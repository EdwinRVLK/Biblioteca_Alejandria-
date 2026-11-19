<#
    Detiene el servidor Node iniciado por Iniciar_Piloto.ps1.
    Uso:
        powershell -ExecutionPolicy Bypass -File .\Detener_Piloto.ps1
#>
$ErrorActionPreference = 'Stop'
$PilotDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pidFile = Join-Path $PilotDir 'servidor.pid'

if (Test-Path $pidFile) {
    $id = [int](Get-Content $pidFile | Select-Object -First 1)
    $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq 'node') {
        Stop-Process -Id $id -Force
        Remove-Item $pidFile -Force
        Write-Host "✓ Servidor detenido (PID $id)" -ForegroundColor Green
    } else {
        Write-Host 'El PID guardado ya no corresponde a un proceso node activo.' -ForegroundColor Yellow
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host 'No hay archivo servidor.pid; buscando node con server.js de este proyecto...' -ForegroundColor Yellow
    Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object {
        $_.CommandLine -match 'server\.js'
    } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host "✓ Detenido PID $($_.ProcessId)" -ForegroundColor Green }
}
