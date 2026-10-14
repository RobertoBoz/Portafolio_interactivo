@echo off
REM Levanta el portafolio en modo desarrollo y abre el navegador.
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro npm. Instala Node.js LTS desde https://nodejs.org y vuelve a intentarlo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias, solo la primera vez...
  call npm install
  if errorlevel 1 (
    echo La instalacion fallo. Revisa el mensaje de arriba.
    pause
    exit /b 1
  )
)

echo Iniciando el servidor. Cierra esta ventana o presiona Ctrl+C para detenerlo.
call npm run dev -- --open
pause
