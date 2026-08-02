@echo off
setlocal
cd /d "%~dp0"
set "ALVO=%CD%\ambiente_interativo\index.html"
if not exist "%ALVO%" (
  echo Nao foi possivel encontrar: "%ALVO%"
  pause
  exit /b 1
)
if not exist "%CD%\node_modules\@playwright\test" (
  echo As dependencias do projeto nao estao instaladas. Execute: npm install
  pause
  exit /b 1
)
set "URL=file:///%CD:\=/%/ambiente_interativo/index.html"
call npx playwright open --browser chromium "%URL%"
if errorlevel 1 (
  echo Nao foi possivel abrir o Chromium. Execute: npx playwright install chromium
  pause
  exit /b 1
)
endlocal
