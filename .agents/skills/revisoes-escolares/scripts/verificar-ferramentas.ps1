$ErrorActionPreference = 'Continue'

$commands = @('tesseract', 'magick', 'python', 'node', 'npm', 'git', 'gh')

Write-Output '=== Ferramentas no PATH ==='
foreach ($cmd in $commands) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($null -eq $found) {
        Write-Output ("{0}: NAO ENCONTRADO" -f $cmd)
    } else {
        Write-Output ("{0}: {1}" -f $cmd, $found.Source)
    }
}

Write-Output ''
Write-Output '=== Tesseract ==='
if (Get-Command tesseract -ErrorAction SilentlyContinue) {
    & tesseract --version 2>&1 | Select-Object -First 2
    & tesseract --list-langs 2>&1
}

Write-Output ''
Write-Output '=== LibreOffice ==='
$candidates = @(
    "$env:ProgramFiles\LibreOffice\program\soffice.exe",
    "${env:ProgramFiles(x86)}\LibreOffice\program\soffice.exe"
)
$soffice = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if ($soffice) {
    Write-Output ("soffice: {0}" -f $soffice)
} else {
    $cmd = Get-Command soffice -ErrorAction SilentlyContinue
    if ($cmd) { Write-Output ("soffice: {0}" -f $cmd.Source) } else { Write-Output 'soffice: NAO ENCONTRADO' }
}
