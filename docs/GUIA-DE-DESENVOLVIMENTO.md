# Guia de desenvolvimento

## Onde editar

| Pasta                           | Responsabilidade                                           |
| ------------------------------- | ---------------------------------------------------------- |
| `app/`                          | Rotas do Expo Router; apenas conectam URL e tela           |
| `src/screens/`                  | Telas e comportamento da interface                         |
| `src/components/`               | Componentes reutilizáveis                                  |
| `src/components/ui/TelaPadrao/` | Layout, cartões, botões, mensagens e cores das novas telas |
| `src/styles/`                   | Cores, espaçamento e tipografia existentes                 |
| `src/features/*/api/`           | Chamadas HTTP por funcionalidade                           |
| `src/stores/`                   | Sessão, tema e estado temporário do cadastro               |
| `server/src/rotas/`             | Validação e regras de cada grupo de endpoints              |
| `server/src/banco/`             | Pool de conexões, consultas e transações                   |
| `server/src/seguranca.ts`       | Autenticação, autorização e respostas públicas             |
| `server/banco/`                 | Estrutura SQL versionada                                   |
| `server/testes/`                | Testes de segurança e integração                           |

## Padrões

As telas de localização, SOS e configurações ficam em `src/screens/compartilhadas/` e são reutilizadas pelos dois perfis. A atualização do nome e telefone usa `PATCH /api/users/me`.

Use UTF-8, dois espaços, nomes descritivos e comentários que expliquem decisões. O Prettier e o EditorConfig padronizam o formato. Escreva novos módulos, mensagens e regras de domínio em português. APIs de bibliotecas e os contratos antigos de autenticação/guardiões continuam em inglês para manter compatibilidade; não traduza um campo em apenas um dos lados.

Nas telas, use `TelaPadrao`, `Cartao`, `Botao` e `Mensagem` para manter largura, cores, contraste, espaçamento e feedback consistentes. Componentes antigos continuam em suas pastas para não quebrar rotas existentes. Prefira consultar dados com React Query; use chaves específicas e invalide as consultas após gravar. Não repita mutações automaticamente: isso pode duplicar cadastros. O cache é limpo ao trocar de sessão.

Nunca conecte o aplicativo diretamente ao MySQL. Credenciais ficam somente em `server/.env`; variáveis `EXPO_PUBLIC_*` são públicas. Use os helpers `consultar`, `executar` e `transacao` com parâmetros `?`. Não concatene valores fornecidos pela pessoa em SQL. Toda leitura ou alteração de dados privados deve filtrar o proprietário ou verificar um vínculo ativo.

O diário usa acesso restrito pela API, mas não possui criptografia ponta a ponta. Senhas e PINs têm hash bcrypt; administradores do banco podem acessar textos do diário. Não prometa uma proteção que o produto ainda não implementa.

## Como acrescentar uma funcionalidade

1. Defina os campos e as permissões no servidor e, se necessário, crie uma nova migração SQL.
2. Valide entradas com Zod e implemente consultas parametrizadas.
3. Crie a função HTTP em `src/features/<funcionalidade>/api/`.
4. Construa a tela com estados de carregamento, erro, vazio e sucesso.
5. Verifique acesso indevido de outra conta nos testes quando houver dados privados.
6. Rode a verificação de tipos, testes, formatação e exportação web.

## Endpoints

Todas as rotas abaixo, exceto autenticação pública, exigem `Authorization: Bearer <token>`.

| Método e caminho                    | Uso                                                                |
| ----------------------------------- | ------------------------------------------------------------------ |
| `POST /api/auth/register`           | Cadastro                                                           |
| `POST /api/auth/email/verify`       | Confirmar código e obter autorização temporária para cadastrar PIN |
| `POST /api/auth/email/resend`       | Reenviar código                                                    |
| `POST /api/auth/pin/setup`          | Cadastrar PIN com `setupToken` e `pin`                             |
| `POST /api/auth/login`              | Entrar com e-mail e senha                                          |
| `POST /api/auth/password/forgot`    | Solicitar recuperação                                              |
| `POST /api/auth/password/reset`     | Redefinir senha; invalida sessões anteriores                       |
| `GET /api/users/me`                 | Consultar conta autenticada                                        |
| `GET, POST /api/guardians`          | Listar/cadastrar guardião                                          |
| `DELETE /api/guardians/:id`         | Remover vínculo próprio                                            |
| `GET /api/guardians/protected`      | Protegidas vinculadas ao guardião                                  |
| `GET, POST /api/diario`             | Listar/criar nota; consulta aceita `pagina`                        |
| `PUT, DELETE /api/diario/:id`       | Editar/excluir nota própria                                        |
| `GET, PUT, DELETE /api/localizacao` | Consultar, enviar e remover posição                                |
| `GET, POST /api/sos`                | Consultar/registrar alerta                                         |
| `PATCH /api/sos/:id/encerrar`       | Encerrar alerta próprio                                            |
| `GET /health`                       | Verificar API e conexão com o banco                                |

Antes de publicar: configure infraestrutura e credenciais próprias, envio real de e-mail, HTTPS, backups com restauração testada e monitoração. O projeto não foi implantado em um servidor de produção.

No celular, a sessão fica no SecureStore. No navegador, usa sessionStorage e termina ao fechar a aba. Não reutilizamos tokens da versão antiga. Respostas 401 encerram a sessão, e o login usa o perfil confirmado pelo servidor.

A versão de PostCSS é ajustada por override para incorporar correções sem trocar o Expo SDK. Ao atualizar o Expo, revise esse override e valide exportação web e builds nativos. As pendências da auditoria de dependências estão registradas em `VALIDACAO.md`.
