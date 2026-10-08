@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\abrir-ambiente-local.ps1" -Raiz "%~dp0."
set "resultado=%errorlevel%"
if not "%resultado%"=="0" pause
exit /b %resultado%
