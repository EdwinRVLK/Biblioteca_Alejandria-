<#
    Crea (o actualiza) en el escritorio los accesos directos para
    INICIAR y DETENER el entorno de prueba piloto.

    Se ejecuta con doble clic en Crear_Accesos_Directos.bat
#>
$ErrorActionPreference = 'Stop'

$PilotDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# GetFolderPath respeta la redireccion de OneDrive al escritorio real.
$escritorio = [Environment]::GetFolderPath('Desktop')
if (-not $escritorio -or -not (Test-Path $escritorio)) {
    $escritorio = Join-Path $env:USERPROFILE 'Desktop'
}

$sh = New-Object -ComObject WScript.Shell
$cmd = Join-Path $env:WINDIR 'System32\cmd.exe'
$icono = (Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe') + ',0'

$planes = @(
    @{
        Nombres = @('Iniciar Piloto - Biblioteca.lnk', 'Iniciar_Piloto - Acceso directo.lnk')
        Bat     = 'Iniciar_Piloto.bat'
    },
    @{
        Nombres = @('Detener Piloto - Biblioteca.lnk', 'Detener_Piloto - Acceso directo.lnk')
        Bat     = 'Detener_Piloto.bat'
    }
)

Write-Host "Escritorio: $escritorio" -ForegroundColor Cyan

foreach ($plan in $planes) {
    $rutaBat = Join-Path $PilotDir $plan.Bat
    if (-not (Test-Path $rutaBat)) { throw "No encuentro el archivo: $rutaBat" }

    foreach ($nombre in $plan.Nombres) {
        $rutaLnk = Join-Path $escritorio $nombre
        $lnk = $sh.CreateShortcut($rutaLnk)
        $lnk.TargetPath       = $cmd
        $lnk.Arguments        = '/c ""' + $rutaBat + '""'
        $lnk.WorkingDirectory = $PilotDir
        $lnk.IconLocation     = $icono
        $lnk.Description      = 'Biblioteca Alejandria - ' + $plan.Bat
        $lnk.Save()
        Write-Host "  [OK] $nombre" -ForegroundColor Green
    }
}

Write-Host ''
Write-Host 'LISTO. Ya tienes los accesos directos en tu escritorio.' -ForegroundColor Cyan
Write-Host '  Iniciar Piloto - Biblioteca  ->  doble clic para levantar todo.' -ForegroundColor White
Write-Host '  Detener Piloto - Biblioteca  ->  doble clic para apagar.' -ForegroundColor White
