$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path "E:\temp")) { New-Item -ItemType Directory -Path "E:\temp" -Force | Out-Null }
$env:TEMP = "E:\temp"
$env:TMP = "E:\temp"
Remove-Item -LiteralPath (Join-Path $PSScriptRoot 'dev-run.log') -ErrorAction SilentlyContinue
& npm.cmd run dev *> (Join-Path $PSScriptRoot 'dev-run.log') 2>&1
$code = $LASTEXITCODE
Add-Content -LiteralPath (Join-Path $PSScriptRoot 'dev-run.log') -Value "===DEV_EXIT=$code==="
