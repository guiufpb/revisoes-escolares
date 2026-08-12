@echo off
setlocal
cd /d "%~dp0"
if not exist "%CD%\node_modules\vite" (
  echo As dependencias do projeto nao estao instaladas.
  echo Execute primeiro: npm install
  pause
  exit /b 1
)
echo Iniciando o ambiente interativo pelo servidor local...
echo Mantenha esta janela aberta enquanto estiver estudando.
call npm run interativo
if errorlevel 1 pause
endlocal
