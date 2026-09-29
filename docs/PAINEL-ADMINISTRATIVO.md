# Ver as pessoas cadastradas

O projeto possui um site administrativo local, servido pela própria API. Ele consulta a mesma base MySQL usada pelo aplicativo.

## Preparar o acesso

1. Configure o banco e a API conforme o README.
2. Cadastre sua própria conta no aplicativo e confirme seu e-mail.
3. No arquivo `server/.env`, adicione o e-mail exato dessa conta:

```env
ADMIN_EMAILS=seu-email@exemplo.com
```

Somente coloque e-mails de pessoas autorizadas. Para mais de uma administradora, separe os e-mails por vírgula. Essa permissão é controlada pelo servidor; não existe uma opção no cadastro público para virar administradora. Sem essa variável, ninguém tem acesso aos dados do painel.

4. Inicie ou reinicie a API, na raiz do projeto:

```powershell
npm run server:dev
```

5. Abra **http://localhost:3000/admin** no navegador e entre com o e-mail e a senha da sua conta Jaci. Se você mudar a variável `PORT`, use essa porta no endereço.

Não é necessário abrir o Expo para usar o painel. A API e o banco precisam estar funcionando. Este endereço é local; o site não foi publicado na internet.

## O que aparece

- Quantidade total de pessoas, protegidas, guardiões e e-mails pendentes de confirmação.
- Nome, e-mail, telefone, perfil, confirmação de e-mail, número e data de cadastro.
- Busca por nome, e-mail ou telefone, filtros de perfil/confirmação e páginas de 20 registros.

O botão **Atualizar dados** mostra os novos cadastros. O painel é somente para consulta: não altera nem apaga contas. Senhas, PINs, códigos, textos do diário e localizações não são retornados pelos endpoints administrativos.

Use **Sair** ao terminar. Recarregar ou fechar a página remove a sessão do painel; o token não é armazenado no navegador. A sessão expira em até duas horas, e as permissões são verificadas no servidor a cada consulta. Remover um e-mail de `ADMIN_EMAILS` e reiniciar o servidor revoga o acesso administrativo.

## Onde editar

| Arquivo                             | Responsabilidade                     |
| ----------------------------------- | ------------------------------------ |
| `server/painel/index.html`          | Estrutura e textos da página         |
| `server/painel/painel.css`          | Cores, layout e adaptação ao celular |
| `server/painel/painel.js`           | Login, consulta, filtros e paginação |
| `server/src/rotas/administracao.ts` | Autorização e consultas MySQL        |

Ao distribuir a API compilada, inclua também a pasta `server/painel`. O código usa apenas os arquivos fixos dessa pasta, sem permitir caminhos fornecidos por visitantes.
