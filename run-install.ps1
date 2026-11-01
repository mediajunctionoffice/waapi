$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
Remove-Item -LiteralPath (Join-Path $PSScriptRoot 'install.log') -ErrorAction SilentlyContinue
& npm.cmd ci --no-audit --no-fund *> (Join-Path $PSScriptRoot 'install.log') 2>&1
$code = $LASTEXITCODE
Add-Content -LiteralPath (Join-Path $PSScriptRoot 'install.log') -Value "===NPM_CI_DONE_EXIT=$code==="