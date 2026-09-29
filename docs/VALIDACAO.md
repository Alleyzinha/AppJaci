# Validação da reorganização

## Verificações executadas

- `npm run typecheck`: aplicativo e API sem erros de TypeScript.
- `npm --prefix server run build`: compilação da API concluída.
- `npm run format:check`: padrão Prettier aplicado ao código e à documentação.
- `npm test`: cinco testes de segurança e entrega da interface administrativa aprovados, sem precisar de banco.
- `npm run test:integration`: fluxo completo aprovado no banco isolado, incluindo cadastro, confirmação, PIN, login, edição da conta, diário privado, vínculos, localização, SOS concorrente, encerramento, bloqueio de códigos e invalidação de sessão.
- Preparação do banco executada mais de uma vez para verificar que não apaga registros nem falha em tabelas já criadas por esta versão.
- Exportação web pelo Expo e validação automatizada em Chromium: criação, persistência após recarga e edição de notas, envio/remoção da posição com permissão simulada, registro/encerramento de SOS, edição da conta e tema escuro.
- Inspeção de capturas em 390 × 844 e 1366 × 900. Os fluxos exercitados não apresentaram erros de JavaScript.

## Limites da validação

O computador possui MariaDB 10.4 do XAMPP, e não uma instalação MySQL 8 em execução. A integração SQL foi testada em instância isolada desse servidor, na porta 3307, com dados fictícios. Isso valida os fluxos pelo driver mysql2, mas não substitui a execução dos testes em MySQL 8.4. O `compose.yaml` fornece esse ambiente quando Docker estiver disponível.

Não foram testados builds nativos Android/iOS, permissões em aparelhos físicos, entrega por SMTP real, Docker nem implantação em produção. A geolocalização do navegador foi simulada pelo executor de testes. Nenhuma mensagem foi enviada a pessoas reais durante a validação.

O banco SQLite anterior e os arquivos `.env` existentes não foram convertidos automaticamente. Configure a conexão MySQL conforme o README antes de iniciar a nova API.

## Repetir os testes de integração

Use uma base exclusiva cujo nome termine em `_teste`. Crie `bdJaci_teste` e conceda ao usuário local as mesmas permissões descritas no README para essa base. Nunca use dados reais.

```powershell
$env:DB_NAME = 'bdJaci_teste'
npm run db:setup
npm run test:integration
Remove-Item Env:DB_NAME
```

Os testes criam registros próprios e os removem ao terminar. Eles recusam bases sem o sufixo `_teste`. Host, porta e credenciais seguem as variáveis `DB_*` do servidor.

## Dependências

Na revisão realizada em 28/09/2026:

- API: zero vulnerabilidades conhecidas apontadas pelo `npm audit` após atualizar Nodemailer.
- Aplicativo: 15 alertas transitivos, sendo 14 moderados e um alto, relacionados às dependências do Expo 54. O alerta alto restante envolve `image-size`, utilizado no processamento de imagens pelas ferramentas de compilação. A versão 2 corrigida não é compatível com a forma como esse Metro lê alguns arquivos; a tentativa de atualização foi revertida após falha na exportação.
- PostCSS foi atualizado por override e a exportação foi verificada. Não foi usado `npm audit fix --force` para trocar de SDK.

Esses números dependem das versões e dos avisos publicados. Revise os alertas antes de publicar e planeje a atualização do SDK separadamente; esta reorganização não equivale a uma certificação de segurança.

## Referências consultadas

O painel administrativo também foi validado em Chromium (computador e celular) com login real na API e registros fictícios no banco isolado: busca, filtros, duas páginas de resultados, estado vazio, saída, bloqueio de conta comum e exibição de conteúdo como texto, sem executar HTML recebido do cadastro. Os testes de integração verificam a autorização, a revogação e a seleção explícita de campos públicos do cadastro. Nenhum acesso administrativo foi concedido automaticamente a contas reais.

- [Documentação versionada do Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).
- [Localização no Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/location/).
- [Armazenamento de sessão com SecureStore](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).
- [Consultas parametrizadas e pool do MySQL2](https://sidorares.github.io/node-mysql2/docs).
