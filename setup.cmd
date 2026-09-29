@echo off
cd /d "%~dp0"
call git clone https://github.com/Alleyzinha/AppJaci . 2>nul
call npm install
if not exist .env copy .env.example .env
if not exist server\.env copy server\.env.example server\.env
docker-compose up -d
timeout /t 5 /nobreak >nul
call npm run db:setup
start "Server" cmd /k "npm run server:dev"
timeout /t 3 /nobreak >nul
start "Web" cmd /k "npm run web"
echo "Ambiente iniciado. Verifique os terminais do Server e Web."
pause
