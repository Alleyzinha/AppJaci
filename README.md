# Jaci — aplicativo e banco MySQL

Aplicativo Expo SDK 54 / React Native, API Fastify com TypeScript e banco MySQL com consultas parametrizadas pelo `mysql2`. A interface e os novos módulos são escritos em português.

## Comece aqui

Requisitos: Node.js 20.19+ e MySQL 8.0+ (preferencialmente 8.4). O banco fica no servidor; o aplicativo se comunica somente com a API.

```powershell
npm run install:all
if (!(Test-Path .env)) { Copy-Item .env.example .env }
if (!(Test-Path server/.env)) { Copy-Item server/.env.example server/.env }
```

Edite `server/.env` usando `server/.env.example` como referência. Se você já tinha um `.env` da versão antiga, substitua `DATABASE_URL` pelas variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`. Nenhum banco antigo é apagado ou importado automaticamente.

Gere a chave de autenticação e coloque o resultado em `JWT_SECRET`:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

### Banco instalado no computador

No MySQL Workbench, entre como administrador e execute, substituindo a senha de exemplo:

```sql
CREATE DATABASE IF NOT EXISTS bdJaci CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jaci'@'localhost' IDENTIFIED BY 'defina-uma-senha-local';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON bdJaci.* TO 'jaci'@'localhost';
```

Informe essa senha em `DB_PASSWORD`. Se o usuário já existir, reutilize-o e ajuste as permissões. Prepare as tabelas:

```powershell
npm run db:setup
```

O comando pode ser repetido em uma base criada por esta versão. Ele não converte tabelas antigas de outra estrutura nem substitui um sistema de migrations incrementais. O arquivo [SQL](server/banco/001_estrutura.sql) também pode ser executado no Workbench depois de selecionar o banco.

### Alternativa com Docker

Defina também `DB_ROOT_PASSWORD` em `server/.env`, com uma senha diferente de `DB_PASSWORD`, e execute:

```powershell
docker compose --env-file server/.env up -d
npm run db:setup
```

O serviço usa MySQL 8.4 e mantém os dados em volume persistente. A porta 3306 é exposta apenas no próprio computador. Não use `docker compose down -v` se precisar preservar os dados.

## Executar o aplicativo

Em dois terminais, na raiz do projeto:

```powershell
npm run server:dev
```

```powershell
npm run web
```

Para celular, configure `EXPO_PUBLIC_API_URL` em `.env` com o IP do computador, por exemplo `http://192.168.0.10:3000/api`, use a mesma rede e execute `npm start`. No navegador, a geolocalização exige localhost ou HTTPS; abrir a web por IP via HTTP pode impedir a permissão de localização.

Sem SMTP, os códigos aparecem no terminal da API apenas em desenvolvimento. Em produção, configure SMTP e HTTPS. O cadastro pede confirmação do e-mail antes do login.

## O que funciona nesta versão

- Cadastro, confirmação e reenvio de e-mail, login, recuperação de senha e configuração inicial de PIN.
- Cadastro e remoção de guardiões que possuem conta confirmada.
- Diário privado com criação, edição, exclusão e paginação de notas de texto.
- Envio pontual da localização para os guardiões vinculados e interrupção do compartilhamento.
- Registro, consulta e encerramento de SOS. Guardiões veem somente os alertas de suas protegidas.
- Tema claro/escuro e componentes compartilhados nas telas de diário, localização, SOS e acolhimento.

O SOS **não envia notificações push/SMS nem aciona serviços públicos**. Os alertas são consultados enquanto a tela está aberta. A localização não é rastreada em segundo plano. O chat de atendimento, anexos de áudio/foto e desbloqueio por PIN ainda não estão implementados; as telas não simulam atendimento humano. O PIN é apenas cadastrado nesta versão.

## Consultar pessoas cadastradas

O painel fica em **http://localhost:3000/admin**, com a API e o banco ligados. Configure `ADMIN_EMAILS` em `server/.env` para autorizar sua conta e reinicie a API. Ele mostra os cadastros com busca, filtros e paginação. Veja [como acessar o painel](docs/PAINEL-ADMINISTRATIVO.md).

## Trabalhar no código

```powershell
npm run typecheck
npm test
npm run format
npm run format:check
npm --prefix server run build
```

Veja [o guia para editar](docs/GUIA-DE-DESENVOLVIMENTO.md), [o modelo do banco](docs/BANCO-DE-DADOS.md) e [a validação](docs/VALIDACAO.md).
