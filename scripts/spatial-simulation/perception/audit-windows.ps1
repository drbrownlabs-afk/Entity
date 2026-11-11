param([Parameter(Mandatory = $true)][string]$OutputPath)
$ErrorActionPreference = 'Stop'

function Invoke-ReadOnlyProbe([string]$Program, [string[]]$ProbeArguments) {
    try {
        $probeText = (& $Program @ProbeArguments 2>&1 | Out-String) -replace "`0", ''
        return @{ command = "$Program $($ProbeArguments -join ' ')"; exit_code = $LASTEXITCODE; output = $probeText.Trim() }
    } catch {
        return @{ command = "$Program $($ProbeArguments -join ' ')"; exit_code = $null; error = $_.Exception.Message }
    }
}

function Read-Cim([string]$ClassName, [string[]]$Properties) {
    try { return @(Get-CimInstance $ClassName | Select-Object -Property $Properties) }
    catch { return @{ error = $_.Exception.Message } }
}

$taskRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$resolvedOutput = [IO.Path]::GetFullPath($OutputPath)
$frozenRoot = Join-Path $taskRoot 'docs/spatial-simulation/evidence/p2-09'
foreach ($phase in 1..9) {
    $frozenPath = [IO.Path]::GetFullPath((Join-Path $frozenRoot "09.$phase")) + [IO.Path]::DirectorySeparatorChar
    if ($resolvedOutput.StartsWith($frozenPath, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Historical baseline evidence is frozen'
    }
}
$report = [ordered]@{
    phase = 'P2-09.10'
    generated_at_utc = [DateTime]::UtcNow.ToString('o')
    read_only = $true
    phase_gate_passed = $false
    administrator = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    computer = Read-Cim 'Win32_ComputerSystem' @('Name', 'Manufacturer', 'Model', 'TotalPhysicalMemory')
    os = Read-Cim 'Win32_OperatingSystem' @('Caption', 'Version', 'BuildNumber')
    cpu = Read-Cim 'Win32_Processor' @('Name', 'NumberOfCores', 'NumberOfLogicalProcessors', 'VirtualizationFirmwareEnabled')
    graphics = Read-Cim 'Win32_VideoController' @('Name', 'AdapterRAM', 'DriverVersion')
    system_drive = Read-Cim 'Win32_LogicalDisk' @('DeviceID', 'Size', 'FreeSpace', 'DriveType')
    git = Invoke-ReadOnlyProbe 'git' @('--version')
    node = Invoke-ReadOnlyProbe 'node' @('--version')
    nvidia = Invoke-ReadOnlyProbe 'nvidia-smi' @('--query-gpu=name,memory.total,driver_version', '--format=csv')
    wsl_status = Invoke-ReadOnlyProbe 'wsl.exe' @('--status')
    wsl_version = Invoke-ReadOnlyProbe 'wsl.exe' @('--version')
    wsl_distributions = Invoke-ReadOnlyProbe 'wsl.exe' @('--list', '--verbose')
    boundary = 'No changes to devices, drivers, Windows features, cameras, Core, geometry or baseline.'
}
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null
[IO.File]::WriteAllText($resolvedOutput, ($report | ConvertTo-Json -Depth 8) + "`n", [Text.UTF8Encoding]::new($false))
Write-Output $resolvedOutput
