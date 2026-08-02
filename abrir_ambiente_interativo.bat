@echo off
setlocal
cd /d "%~dp0"
set "ALVO=%CD%\ambiente_interativo\index.html"
if not exist "%ALVO%" (
  echo Nao foi possivel encontrar: "%ALVO%"
  pause
  exit /b 1
)
start "" "%ALVO%"
endlocal
