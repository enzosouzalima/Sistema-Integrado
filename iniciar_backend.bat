@echo off
title Backend - API TodoApp
cd /d "%~dp0API"
set "PATH=C:\Users\unisanta\nodejs22;C:\Users\unisanta\AppData\Roaming\npm;%PATH%"

echo ================================================================
echo  INICIANDO BACKEND - API TODOAPP (PORTA 3000)
echo  Conectando ao MongoDB Atlas...
echo ================================================================
echo.

:: Libera a porta 3000 se ja estiver em uso por outro processo
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Banco anterior mantido como backup:
:: node index.js "mongodb+srv://ProjetoSistemasIntegrados:SistemasIntegrados@cluster0.p3xhbzg.mongodb.net/tarefasDB?retryWrites=true&w=majority"
node index.js "mongodb+srv://ezolima3000_db_user:RemnyItq50Omdp4Q@cluster0.0cl4e64.mongodb.net/tarefasDB?retryWrites=true&w=majority"
pause
