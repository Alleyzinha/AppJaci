@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   AppJaci - Instalacao para ETEC
echo ========================================
echo.

REM Verificar se Git esta instalado
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERRO: Git nao encontrado. Instale em https://git-scm.com
    pause
    exit /b
)

REM Verificar se Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERRO: Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b
)

REM Verificar versao do Node.js
for /f "tokens=1-2 delims=^." %%a in ('node --version') do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
)
if !NODE_MAJOR! lss 20 (
    echo ERRO: Node.js 20.19+ necessario. Versao atual: !NODE_MAJOR!.
    pause
    exit /b
)

echo [1/5] Clonando repositorio...
if exist "AppJaci" (
    echo Diretorio AppJaci ja existe. Removendo...
    rmdir /s /q "AppJaci"
)
git clone https://github.com/Alleyzinha/AppJaci.git
if %ERRORLEVEL% neq 0 (
    echo ERRO ao clonar repositorio
    pause
    exit /b
)
cd AppJaci

echo [2/5] Instalando dependencias...
npm run install:all
if %ERRORLEVEL% neq 0 (
    echo ERRO ao instalar dependencias
    pause
    exit /b
)

echo [3/5] Configurando ambiente...
if not exist .env copy .env.example .env
if not exist server\.env copy server\.env.example server\.env

REM Gerar JWT_SECRET automaticamente
for /f "tokens=*" %%a in ('node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"') do (
    set JWT_SECRET=%%a
)
powershell -Command "(Get-Content server\.env.example) -replace 'JWT_SECRET=.*', 'JWT_SECRET=!JWT_SECRET!' | Out-File server\.env -Encoding UTF8"

echo [4/5] Configurando MySQL...
echo.
echo Escolha uma opcao:
echo [1] MySQL Community Server (recomendado)
echo [2] Docker Desktop
set /p OPCAO=

if "!OPCAO!"=="1" (
    echo.
    echo Instale MySQL Community Server em: https://dev.mysql.com/downloads/mysql/
    echo Apos instalar, execute no MySQL Workbench:
    echo.
    echo CREATE DATABASE IF NOT EXISTS bdJaci CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    echo CREATE USER 'jaci'@'localhost' IDENTIFIED BY 'sua-senha';
    echo GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON bdJaci.* TO 'jaci'@'localhost';
    echo FLUSH PRIVILEGES;
    echo.
    echo Depois edite server/.env com:
    echo   DB_HOST=127.0.0.1
    echo   DB_PORT=3306
    echo   DB_NAME=bdJaci
    echo   DB_USER=jaci
    echo   DB_PASSWORD=sua-senha
    echo.
    pause
) else if "!OPCAO!"=="2" (
    echo.
    echo Adicione DB_ROOT_PASSWORD em server/.env
    docker compose --env-file server/.env up -d
    timeout /t 5 /nobreak >nul
)

echo [5/5] Preparando banco de dados...
npm run db:setup
if %ERRORLEVEL% neq 0 (
    echo ERRO ao preparar banco de dados
    pause
    exit /b
)

echo.
echo ========================================
echo   Instalacao concluida!
echo ========================================
echo.
echo Para executar:
echo   Terminal 1: npm run server:dev
echo   Terminal 2: npm run web
echo.
echo Acesso: http://localhost:8081
echo Painel: http://localhost:3000/admin
echo.
pause