@echo off
title Frontend - TODOapp
cd /d "%~dp0"
set "PATH=C:\Users\unisanta\nodejs22;C:\Users\unisanta\AppData\Roaming\npm;%PATH%"

echo ================================================================
echo  INICIANDO FRONTEND - ANGULAR (http://localhost:4200)
echo ================================================================
echo.

call npx ng serve
pause
