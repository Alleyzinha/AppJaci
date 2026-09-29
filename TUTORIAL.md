# AppJaci — Tutorial de Setup

## Pré-requisitos
- Windows 10/11
- Node.js 18+
- Docker Desktop (para MySQL)
- Git

## Setup Rápido (um clique)

Clique duas vezes em `setup.cmd` — instala tudo automaticamente.

## Setup Manual

```powershell
git clone https://github.com/Alleyzinha/AppJaci.git
cd AppJaci

npm install
npm run install:all

if (!(Test-Path .env)) { Copy-Item .env.example .env }
if (!(Test-Path server\.env)) { Copy-Item server\.env.example server\.env }

docker-compose up -d
npm run db:setup

# Terminal 1
npm run server:dev

# Terminal 2
npm run web
```

## Configurações
- Abra `server\.env` — configure `DB_PASSWORD` e `JWT_SECRET`
- A API roda em `http://localhost:8080`
- O Expo web abre automaticamente no navegador

## Estrutura
```
AppJaci/
├── app/                 # Rotas (Expo Router)
├── src/                 # Componentes, telas, stores, features
├── server/              # API Fastify + TypeScript + MySQL
├── compose.yaml         # Docker MySQL
├── .env.example         # Template de configuração
└── AGENTS.md            # Guia completo de desenvolvimento
```
