$ErrorActionPreference = 'Continue'
$healthUri = 'http://127.0.0.1:5190/health'
$projectRoot = Split-Path -Parent $PSScriptRoot

function Get-GatewayHealth {
    try {
        $health = Invoke-RestMethod -Uri $healthUri -TimeoutSec 2
        if ($health.ok -eq $true -and $health.configured -eq $true) { return 'ready' }
        if ($health.ok -eq $true -and $health.configured -eq $false) { return 'unconfigured' }
    } catch {
        # O gateway pode ainda nao ter iniciado ou a porta pode estar ocupada.
    }
    return 'unavailable'
}

function Test-GatewayPortInUse {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $attempt = $client.BeginConnect('127.0.0.1', 5190, $null, $null)
        try { return $attempt.AsyncWaitHandle.WaitOne(500) -and $client.Connected }
        finally { $attempt.AsyncWaitHandle.Close() }
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

function Write-PronunciationUnavailable {
    param([string] $Reason)
    Write-Host "A avaliacao de pronuncia Azure nao pode ser iniciada: $Reason"
    Write-Host 'O restante do ambiente interativo continuara disponivel.'
}

try {
    $health = Get-GatewayHealth
    if ($health -eq 'ready') {
        Write-Host 'Gateway de pronuncia ja saudavel e configurado em 127.0.0.1:5190; reutilizando.'
        return
    }
    if (Test-GatewayPortInUse) {
        if ($health -eq 'unconfigured') {
            Write-PronunciationUnavailable 'a porta 5190 responde, mas o gateway informa configured:false.'
        } else {
            Write-PronunciationUnavailable 'a porta 5190 esta ocupada sem um gateway saudavel.'
        }
        return
    }

    where.exe az *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-PronunciationUnavailable 'Azure CLI (az) nao encontrada.'
        return
    }

    az account show --output none *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'Azure CLI sem sessao autenticada. O responsavel pode entrar agora.'
        $answer = Read-Host 'Digite L para executar az login, ou Enter para continuar sem pronuncia'
        if ($answer -notmatch '^[Ll]$') {
            Write-PronunciationUnavailable 'login Azure nao realizado.'
            return
        }
        az login --output none
        if ($LASTEXITCODE -ne 0) {
            Write-PronunciationUnavailable 'az login nao foi concluido.'
            return
        }
    }

    $keyLines = @(az cognitiveservices account keys list --name revisoes-escolares-speech --resource-group revisoes-escolares-rg --query key1 --output tsv --only-show-errors 2>$null)
    if ($LASTEXITCODE -ne 0 -or $keyLines.Count -ne 1 -or [string]::IsNullOrWhiteSpace($keyLines[0])) {
        Write-PronunciationUnavailable 'nao foi possivel recuperar a chave do recurso Speech.'
        return
    }
    $key = ([string] $keyLines[0]).Trim()
    if ($key -match '\s') {
        Write-PronunciationUnavailable 'a resposta da Azure CLI nao contem uma chave valida.'
        return
    }

    $env:AZURE_SPEECH_KEY = $key
    $env:AZURE_SPEECH_REGION = 'brazilsouth'
    $key = $null
    $keyLines = $null
    Start-Process -FilePath $env:ComSpec -ArgumentList '/d', '/c', 'title Revisoes Escolares - Gateway de Pronuncia && npm run pronuncia:gateway' -WorkingDirectory $projectRoot -WindowStyle Normal -ErrorAction Stop | Out-Null
    Write-Host 'Aguardando o gateway de pronuncia iniciar...'
    for ($attempt = 0; $attempt -lt 15; $attempt++) {
        Start-Sleep -Milliseconds 500
        $health = Get-GatewayHealth
        if ($health -eq 'ready') {
            Write-Host 'Gateway de pronuncia saudavel: /health respondeu ok:true e configured:true.'
            return
        }
        if ($health -eq 'unconfigured') { break }
    }
    if ($health -eq 'unconfigured') {
        Write-PronunciationUnavailable 'o gateway iniciou, mas /health respondeu configured:false.'
    } else {
        Write-PronunciationUnavailable 'o gateway nao ficou saudavel em 127.0.0.1:5190/health.'
    }
} catch {
    Write-PronunciationUnavailable 'falha ao preparar ou iniciar o gateway.'
} finally {
    Remove-Item Env:AZURE_SPEECH_KEY -ErrorAction SilentlyContinue
    Remove-Item Env:AZURE_SPEECH_REGION -ErrorAction SilentlyContinue
    $key = $null
    $keyLines = $null
}
