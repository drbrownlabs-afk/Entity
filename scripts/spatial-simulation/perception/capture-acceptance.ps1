param([string]$BrowserTemp = (Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Codex\browser-temp'))
$ErrorActionPreference = 'Stop'
$repoPath = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
Set-Location -LiteralPath $repoPath
$runtimePath = Join-Path $repoPath 'simulation/spatial-office/.runtime'
$statusPath = Join-Path $runtimePath 'accept18-capture-status.json'
$env:TEMP = $BrowserTemp
$env:TMP = $BrowserTemp
New-Item -ItemType Directory -Force -Path $BrowserTemp | Out-Null
$env:P2_CHROMIUM = Join-Path ${env:ProgramFiles(x86)} 'Microsoft/Edge/Application/msedge.exe'
if (!(Test-Path -LiteralPath $env:P2_CHROMIUM)) { throw 'Native Edge executable unavailable' }
$env:P2_TRIAL_SAMPLE = '0'
$completed = @()
try {
    foreach ($variant in 0..4) {
        $trialRun = 'accept18-v' + $variant
        $completion = Join-Path $runtimePath ('cctv-trial-' + $trialRun + '/capture-complete.json')
        @{done=$false; pid=$PID; current=$trialRun; completed=$completed} | ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
        if (!(Test-Path -LiteralPath $completion)) {
            $env:P2_TRIAL_RUN = $trialRun
            & node apps/spatial-simulation/tests/cctv-trial.mjs *> (Join-Path $runtimePath ($trialRun + '-capture.log'))
            if ($LASTEXITCODE -ne 0) { throw ('Capture failed: ' + $trialRun) }
        }
        $capture = Get-Content -Raw -LiteralPath $completion | ConvertFrom-Json
        if (!$capture.complete -or $capture.sample_only -or $capture.images -lt 1000) { throw ('Incomplete corpus: ' + $trialRun) }
        $completed += $trialRun
    }
    @{done=$true; pid=$PID; exit_code=0; completed=$completed} | ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
} catch {
    @{done=$true; pid=$PID; exit_code=1; completed=$completed; error=$_.Exception.Message} | ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
    throw
}
