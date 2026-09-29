# AppJaci - Instalação no PC da ETEC

## Pré-requisitos

1. **Node.js 20.19+** (https://nodejs.org)
2. **MySQL 8.0+** (https://dev.mysql.com/downloads/mysql/)
3. **Git** (https://git-scm.com)

---

## Passo a Passo

### 1. Clonar o projeto

```powershell
git clone https://github.com/Alleyzinha/AppJaci.git
cd AppJaci
```

### 2. Instalar dependências

```powershell
npm run install:all
```

### 3. Configurar ambiente

```powershell
# Copiar arquivos de exemplo
if (!(Test-Path .env)) { Copy-Item .env.example .env }
if (!(Test-Path server\.env)) { Copy-Item server\.env.example server\.env }
```

Edite `server/.env`:
- `DB_PASSWORD`: senha do MySQL que você vai criar
- `JWT_SECRET`: gere com `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`

### 4. Configurar MySQL

**Opção A - MySQL Community Server (recomendado para ETEC):**

1. Baixe em https://dev.mysql.com/downloads/mysql/
2. Instale com as configurações padrão
3. No MySQL Workbench ou terminal, execute:

```sql
CREATE DATABASE IF NOT EXISTS bdJaci CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jaci'@'localhost' IDENTIFIED BY 'sua-senha-aqui';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON bdJaci.* TO 'jaci'@'localhost';
FLUSH PRIVILEGES;
```

4. No `server/.env`, configure:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bdJaci
DB_USER=jaci
DB_PASSWORD=sua-senha-aqui
```

**Opção B - Docker Desktop:**

```powershell
# Adicione DB_ROOT_PASSWORD em server/.env
docker compose --env-file server/.env up -d
```

### 5. Preparar o banco de dados

```powershell
npm run db:setup
```

### 6. Executar o aplicativo

**Terminal 1 - Servidor API:**
```powershell
npm run server:dev
```

**Terminal 2 - Aplicativo Web:**
```powershell
npm run web
```

---

## Acesso

- **Aplicativo web:** http://localhost:8081 (abre automaticamente)
- **Painel administrativo:** http://localhost:3000/admin
- **API:** http://localhost:3000/api

---

## Comandos úteis

```powershell
npm run server:dev    # Inicia a API
npm run web           # Inicia o app web
npm start             # Inicia o Expo (para celular)
npm run db:setup      # Prepara as tabelas do banco
```

---

## Problemas comuns

- **"Cannot find module"**: Execute `npm run install:all` novamente
- **"Connection refused"**: Verifique se o MySQL está rodando
- **"Access denied"**: Verifique DB_USER e DB_PASSWORD em server/.env