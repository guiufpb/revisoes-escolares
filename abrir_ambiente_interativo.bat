@echo off
setlocal
cd /d "%~dp0"
if not exist "%CD%\node_modules\vite" (
  echo As dependencias do projeto nao estao instaladas.
  echo Execute primeiro: npm install
  pause
  exit /b 1
)
if exist "%CD%\scripts\preparar-pronuncia-azure.ps1" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%CD%\scripts\preparar-pronuncia-azure.ps1"
) else (
  echo A avaliacao de pronuncia Azure nao pode ser iniciada: auxiliar ausente.
  echo O restante do ambiente interativo continuara disponivel.
)
echo Iniciando o ambiente interativo pelo servidor local...
echo Mantenha esta janela aberta enquanto estiver estudando.
call npm run interativo
if errorlevel 1 pause
endlocal
