@echo off
setlocal
cd /d "%~dp0"
if not exist "%CD%\abrir_chromium_ambiente_interativo.bat" (
  echo O atalho do ambiente interativo nao foi encontrado nesta pasta.
  pause
  exit /b 1
)
call "%CD%\abrir_chromium_ambiente_interativo.bat"
endlocal
