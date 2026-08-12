@echo off
setlocal
cd /d "%~dp0"
if not exist "%CD%\node_modules\vite" (
  echo As dependencias do projeto nao estao instaladas. Execute: npm install
  pause
  exit /b 1
)
if not exist "%CD%\node_modules\@playwright\test" (
  echo As dependencias do projeto nao estao instaladas. Execute: npm install
  pause
  exit /b 1
)
start "Servidor das revisoes" /min cmd /c "cd /d ""%CD%"" && npm run dev"
powershell -NoProfile -Command "$limite=(Get-Date).AddSeconds(20); do { try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173/ambiente_interativo/index.html'; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Milliseconds 300 } while ((Get-Date) -lt $limite); exit 1"
if errorlevel 1 (
  echo O servidor local nao iniciou a tempo.
  pause
  exit /b 1
)
set "URL=http://127.0.0.1:5173/ambiente_interativo/index.html"
call npx playwright open --browser chromium "%URL%"
if errorlevel 1 (
  echo Nao foi possivel abrir o Chromium. Execute: npx playwright install chromium
  pause
  exit /b 1
)
endlocal
