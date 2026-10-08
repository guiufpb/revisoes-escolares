param(
    [string]$Raiz = (Split-Path -Parent $PSScriptRoot),
    [ValidateSet('Padrao', 'Chromium')][string]$Navegador = 'Padrao',
    [switch]$SomentePronuncia,
    [switch]$SemPronuncia,
    [switch]$Verificar
)

# Dot-sourcing defines the same functions for deterministic Windows tests.
$infraRoot = Split-Path -Parent $PSScriptRoot
$identityHelper = Join-Path $PSScriptRoot 'identidade-ambiente-local.cjs'
$localOrigin = 'http://127.0.0.1:5173'
$studyPort = 5173
$identityUri = "$localOrigin/__revisoes_local__/identity"

function Resolve-StudyRoot {
    param([string]$Root, [string]$Browser)
    if (-not (Test-Path -LiteralPath $Root -PathType Container)) { throw 'Copia ausente. Confira a raiz selecionada.' }
    $resolved = (Get-Item -LiteralPath $Root -ErrorAction Stop).FullName
    foreach ($file in @('package.json', 'vite.config.js', 'ambiente_interativo/index.html')) {
        if (-not (Test-Path -LiteralPath (Join-Path $resolved $file) -PathType Leaf)) { throw "Arquivo essencial ausente: $file." }
    }
    $package = Get-Content -LiteralPath (Join-Path $resolved 'package.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($package.name -ne 'revisoes-escolares' -or $package.private -ne $true) { throw 'A raiz selecionada nao pertence ao projeto Revisoes Escolares.' }
    if (-not (Test-Path -LiteralPath (Join-Path $resolved 'node_modules/vite/bin/vite.js') -PathType Leaf)) { throw 'Dependencias ausentes nesta copia. Execute npm ci na raiz selecionada.' }
    if ($Browser -eq 'Chromium' -and -not (Test-Path -LiteralPath (Join-Path $resolved 'node_modules/.bin/playwright.cmd') -PathType Leaf)) { throw 'Dependencias do Playwright ausentes nesta copia. Execute npm ci.' }
    return $resolved
}

function Get-ExpectedIdentity {
    param([string]$Root)
    $identityJson = & node.exe $identityHelper $Root
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel calcular a identidade da copia.' }
    return ($identityJson | ConvertFrom-Json)
}

function Test-StudyPort {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $attempt = $client.BeginConnect('127.0.0.1', $studyPort, $null, $null)
        try { return $attempt.AsyncWaitHandle.WaitOne(500) -and $client.Connected }
        finally { $attempt.AsyncWaitHandle.Close() }
    } catch { return $false }
    finally { $client.Close() }
}

function Get-ServedIdentity {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $identityUri -TimeoutSec 2 -MaximumRedirection 0 -ErrorAction Stop
        if ($response.StatusCode -ne 200 -or $response.Headers['Content-Type'] -notmatch '^application/json\b') { return $null }
        if ($response.Content.Length -gt 1024) { return $null }
        $value = $response.Content | ConvertFrom-Json -ErrorAction Stop
        $names = @($value.PSObject.Properties.Name | Sort-Object)
        if (($names -join ',') -ne 'application,copyId,schema') { return $null }
        if ($value.application -cne 'revisoes-escolares' -or $value.schema -isnot [int] -or $value.schema -ne 1 -or $value.copyId -isnot [string] -or $value.copyId -cnotmatch '^[a-f0-9]{64}$') { return $null }
        return $value
    } catch { return $null }
}

function Get-StudyServerState {
    param($Expected)
    if (-not (Test-StudyPort)) { return 'free' }
    $served = Get-ServedIdentity
    if ($null -eq $served) { return 'unknown' }
    if ($served.copyId -ceq $Expected.copyId) { return 'same' }
    return 'other'
}

function Assert-StudyServerState {
    param([string]$State)
    if ($State -eq 'other') { throw 'Porta 5173 ocupada por outra copia. Nenhum servidor foi encerrado ou aberto. Feche-o somente depois de identificar a copia e decidir explicitamente.' }
    if ($State -eq 'unknown') { throw 'Porta 5173 ocupada; identidade indisponivel ou invalida (servidor legado ou estranho). Identifique o servidor e escolha explicitamente como liberar a porta. Nenhuma porta alternativa sera usada.' }
}

function Prepare-StudyPronunciation {
    param([string]$Root)
    $preparation = Join-Path $Root 'scripts/preparar-pronuncia-azure.ps1'
    try {
        if (-not (Test-Path -LiteralPath $preparation -PathType Leaf)) { throw 'Auxiliar ausente.' }
        & $preparation
    } catch { Write-Host 'Pronuncia opcional indisponivel. O estudo continua disponivel.' }
}

function Start-StudyServer {
    param([string]$Root)
    $nodePath = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $vitePath = Join-Path $Root 'node_modules/vite/bin/vite.js'
    $devConfig = Join-Path $infraRoot 'vite.config.js'
    # The shared dev config also identifies an old, explicitly selected copy.
    # Paths are arguments, not shell commands; HTTP requests cannot select them.
    $arguments = @(('"' + $vitePath + '"'), ('"' + $Root + '"'), '--config', ('"' + $devConfig + '"'), '--host', '127.0.0.1', '--port', [string]$studyPort, '--strictPort')
    return Start-Process -FilePath $nodePath -ArgumentList $arguments -WorkingDirectory $Root -WindowStyle Hidden -PassThru -ErrorAction Stop
}

function Wait-StudyServer {
    param($Expected, $Started)
    $limit = (Get-Date).AddSeconds(20)
    do {
        $Started.Refresh()
        if ($Started.HasExited) { throw 'Vite nao iniciou. A porta pode ter sido ocupada durante a abertura; strictPort impede porta alternativa.' }
        $state = Get-StudyServerState $Expected
        Assert-StudyServerState $state
        if ($state -eq 'same') { return }
        Start-Sleep -Milliseconds 200
    } while ((Get-Date) -lt $limit)
    throw 'O servidor nao confirmou a identidade a tempo. Nenhum navegador foi aberto.'
}

function Open-StudyBrowser {
    param([string]$Root, [string]$Browser)
    $url = "$localOrigin/ambiente_interativo/index.html"
    if ($Browser -eq 'Chromium') {
        & (Join-Path $Root 'node_modules/.bin/playwright.cmd') open --browser chromium $url
        if ($LASTEXITCODE -ne 0) { throw 'Chromium indisponivel. Execute npx playwright install chromium nesta copia.' }
    } else { Start-Process -FilePath $url -ErrorAction Stop | Out-Null }
}

function Invoke-StudyOpening {
    param([string]$Root, [string]$Browser = 'Padrao', [switch]$PronunciationOnly, [switch]$SkipPronunciation, [switch]$CheckOnly)
    $started = $null
    try {
        $resolved = Resolve-StudyRoot $Root $Browser
        $expected = Get-ExpectedIdentity $resolved
        $state = Get-StudyServerState $expected
        Assert-StudyServerState $state
        Write-Host "Copia selecionada: $resolved"
        Write-Host "Origem habitual: $localOrigin; estado: $state."
        if ($CheckOnly) { return 0 }
        if (-not $SkipPronunciation) { Prepare-StudyPronunciation $resolved }
        if ($PronunciationOnly) {
            Assert-StudyServerState (Get-StudyServerState $expected)
            Write-Host 'Preparacao da copia selecionada executada. Confira o resultado da pronuncia acima.'
            return 0
        }
        if ($state -eq 'free') {
            $started = Start-StudyServer $resolved
            Wait-StudyServer $expected $started
        }
        $ready = Get-StudyServerState $expected
        Assert-StudyServerState $ready
        if ($ready -ne 'same') { throw 'O servidor selecionado nao esta mais disponivel. Tente abrir novamente.' }
        Write-Host 'Identidade da copia confirmada. Mantenha esta janela aberta enquanto estiver estudando.'
        Open-StudyBrowser $resolved $Browser
        if ($null -ne $started) {
            $started.WaitForExit()
            if ($started.ExitCode -ne 0) { throw 'O servidor local terminou com erro.' }
        }
        return 0
    } catch {
        Write-Host $_.Exception.Message
        return 1
    } finally {
        # Only the process created by this invocation can be stopped here.
        if ($null -ne $started) {
            $started.Refresh()
            if (-not $started.HasExited) { $started.Kill(); $started.WaitForExit() }
            $started.Dispose()
        }
    }
}

if ($MyInvocation.InvocationName -ne '.') {
    $ErrorActionPreference = 'Stop'
    $result = Invoke-StudyOpening -Root $Raiz -Browser $Navegador -PronunciationOnly:$SomentePronuncia -SkipPronunciation:$SemPronuncia -CheckOnly:$Verificar
    exit $result
}
