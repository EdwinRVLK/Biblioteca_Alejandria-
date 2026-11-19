<#
    Levanta todo el entorno de la prueba piloto de Biblioteca Alejandria:
    1. MySQL (servicio)
    2. Restaura la BD desde MySQL\biblioteca_actualizada.sql
    3. Carga los datos ficticios del piloto
    4. Inicia Node en http://localhost:3001 (con ruta /Biblioteca)
    5. Abre el navegador en la URL del protocolo

    Funciona desde cualquier carpeta: $Proyecto por defecto es el padre de este script.

    Uso:
        doble clic en Iniciar_Piloto.bat
    o:
        powershell -ExecutionPolicy Bypass -File .\Iniciar_Piloto.ps1

    Opciones:
        -Proyecto            Ruta al repo (por defecto, la carpeta padre).
        -Puerto              Puerto HTTP (por defecto, 3001).
        -SinReiniciarBD      No restaura el dump (conserva el estado actual).
        -SinAbrirNavegador   No abre el navegador automaticamente.
#>
param(
    [string]$Proyecto = '',
    [int]$Puerto = 3001,
    [switch]$SinReiniciarBD,
    [switch]$SinAbrirNavegador
)

$ErrorActionPreference = 'Stop'
$PilotDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $Proyecto) { $Proyecto = Split-Path -Parent $PilotDir }

function Get-EnvValue([string]$archivo, [string]$clave, [string]$default) {
    $linea = Get-Content $archivo | Where-Object { $_ -match "^\s*$clave\s*=" } | Select-Object -First 1
    if ($linea) { return ($linea -split '=', 2)[1].Trim() }
    return $default
}

Write-Host '=== Biblioteca Alejandria - entorno de prueba piloto ===' -ForegroundColor Cyan

if (-not (Test-Path $Proyecto)) { throw "No encuentro el proyecto en: $Proyecto" }
$envFile = Join-Path $Proyecto '.env'
if (-not (Test-Path $envFile)) {
    # En un clon nuevo no existe .env (esta ignorado por Git). Se crea con los
    # valores del entorno de prueba. Ajustalo si tu MySQL usa otros datos.
    @(
        "PORT=$Puerto",
        'NODE_ENV=development',
        'DB_HOST=localhost',
        'DB_USER=root',
        'DB_PASSWORD=123456',
        'DB_NAME=biblioteca'
    ) | Set-Content -Encoding UTF8 $envFile
    Write-Host '! No existia .env: se creo uno con DB_USER=root / DB_PASSWORD=123456.' -ForegroundColor Yellow
    Write-Host '  Si tu MySQL usa otros datos, edita ese archivo antes de continuar.' -ForegroundColor Yellow
}

$dbHost = Get-EnvValue $envFile 'DB_HOST' 'localhost'
$dbUser = Get-EnvValue $envFile 'DB_USER' 'root'
$dbPass = Get-EnvValue $envFile 'DB_PASSWORD' '123456'
$dbName = Get-EnvValue $envFile 'DB_NAME' 'biblioteca'

# --- 1) MySQL -------------------------------------------------
$svc = Get-Service -Name 'MySQL90' -ErrorAction SilentlyContinue
if (-not $svc) {
    $svc = Get-Service | Where-Object { $_.Name -match 'mysql|mariadb' } | Select-Object -First 1
}
if ($svc -and $svc.Status -ne 'Running') {
    Write-Host "-> Iniciando servicio MySQL ($($svc.Name))..." -ForegroundColor Yellow
    Start-Service -Name $svc.Name
}
for ($i = 0; $i -lt 30; $i++) {
    if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) { break }
    Start-Sleep -Seconds 1
}
if (-not (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue)) {
    throw 'MySQL no esta escuchando en el puerto 3306.'
}
Write-Host '[OK] MySQL activo' -ForegroundColor Green

$mysqlExe = 'C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe'
if (-not (Test-Path $mysqlExe)) {
    $mysqlExe = (Get-Command mysql -ErrorAction SilentlyContinue).Source
}
if (-not $mysqlExe) { throw 'No encuentro mysql.exe para restaurar la base de datos.' }

# --- 2) Restaurar base de datos --------------------------------
if (-not $SinReiniciarBD) {
    $dump = Join-Path $Proyecto 'MySQL\biblioteca_actualizada.sql'
    if (-not (Test-Path $dump)) { throw "No encuentro el dump: $dump" }
    Write-Host '-> Restaurando base de datos de prueba...' -ForegroundColor Yellow
    $cmd = "`"$mysqlExe`" --default-character-set=utf8mb4 -h $dbHost -u $dbUser -p$dbPass $dbName < `"$dump`""
    $eapAnterior = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & cmd.exe /c $cmd 2>&1 | Out-Null
    $ErrorActionPreference = $eapAnterior
    if ($LASTEXITCODE -ne 0) { throw 'Error al restaurar la base de datos. Revisa DB_USER/DB_PASSWORD en .env.' }
    Write-Host '[OK] Base de datos restaurada' -ForegroundColor Green
} else {
    Write-Host '-> Se omite la restauracion de la BD (-SinReiniciarBD)' -ForegroundColor DarkYellow
}

# --- 3) Datos ficticios ---------------------------------------
$seed = Join-Path $PilotDir 'sembrar_piloto.js'
Write-Host '-> Cargando datos ficticios del piloto...' -ForegroundColor Yellow
& node $seed $Proyecto
if ($LASTEXITCODE -ne 0) { throw 'Error al cargar los datos ficticios.' }

# --- 4) Liberar puerto 3001 si es un servidor de este proyecto --
# Nota: el puerto 3000 esta ocupado por un contenedor Docker ajeno (poc_backend).
# La app usa 3001 y las llamadas a la API son relativas (/api/...).
$conn = Get-NetTCPConnection -LocalPort $Puerto -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($conn.OwningProcess)" -ErrorAction SilentlyContinue
    # El puerto 3001 es exclusivo del piloto: si lo ocupa un node ejecutando server.js, es nuestro.
    # (Start-Process no pone la ruta del proyecto en la linea de comandos, solo "node server.js").
    if ($proc -and $proc.Name -match '^node' -and $proc.CommandLine -match 'server\.js') {
        Write-Host '-> Deteniendo servidor anterior de este proyecto...' -ForegroundColor Yellow
        Stop-Process -Id $proc.ProcessId -Force
        Start-Sleep -Seconds 2
    } else {
        throw "El puerto $Puerto esta ocupado por otro proceso ($($proc.Name)). Cierralo antes de continuar."
    }
}

# --- 5) Iniciar Node ------------------------------------------
$env:PORT = "$Puerto"   # dotenv no sobrescribe variables ya definidas
$logOut = Join-Path $PilotDir 'servidor.out.log'
$logErr = Join-Path $PilotDir 'servidor.err.log'
$nodeProc = Start-Process -FilePath 'node' -ArgumentList 'server.js' `
    -WorkingDirectory $Proyecto -PassThru -WindowStyle Hidden `
    -RedirectStandardOutput $logOut -RedirectStandardError $logErr
$nodeProc.Id | Set-Content (Join-Path $PilotDir 'servidor.pid')
Write-Host "[OK] Servidor iniciado (PID $($nodeProc.Id))" -ForegroundColor Green

$ok = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:$Puerto/api/status" -UseBasicParsing -TimeoutSec 2
        if ($res.StatusCode -eq 200) { $ok = $true; break }
    } catch { Start-Sleep -Seconds 1 }
}
if (-not $ok) {
    Get-Content $logErr -Tail 20 -ErrorAction SilentlyContinue
    throw "El servidor no respondio en http://localhost:$Puerto/api/status"
}
Write-Host "[OK] Health check OK: http://localhost:$Puerto/api/status" -ForegroundColor Green

# --- 6) Abrir navegador ---------------------------------------
$urlPiloto = "http://localhost:$Puerto/Biblioteca"
if (-not $SinAbrirNavegador) {
    Start-Process $urlPiloto
    Write-Host "[OK] Navegador abierto en $urlPiloto" -ForegroundColor Green
}

Write-Host ''
Write-Host '=== LISTO PARA EL PILOTO ===' -ForegroundColor Cyan
Write-Host "Acceso:  $urlPiloto" -ForegroundColor White
Write-Host 'Entrar:  Bibliotecario -> admin@alejandria.test / Admin2026' -ForegroundColor White
Write-Host 'Para apagar: powershell -ExecutionPolicy Bypass -File .\Detener_Piloto.ps1' -ForegroundColor DarkGray
