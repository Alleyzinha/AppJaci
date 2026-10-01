# Chat Jaci

O chat está disponível em `/protegida/chat` e `/guardiao/chat`. As orientações anteriores continuam em `/protegida/acolhimento`.

- **Minha rede:** conversas individuais entre protegidas e guardiões com vínculo ativo. Remover o vínculo revoga o acesso às mensagens.
- **Equipe:** configure `CHAT_TEAM_EMAILS` em `server/.env`, com os e-mails das contas confirmadas que vão atender. Essas pessoas acessam o chat com suas contas e respondem às conversas iniciadas pelos usuários. Não há equipe fictícia ou promessa de atendimento imediato.
- **Assistente IA:** configure `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL` no servidor. O padrão é `gpt-4.1-mini`. A pessoa autoriza o envio à OpenAI antes de conversar. Apenas o histórico desse assistente é enviado; o diário e as conversas com pessoas não entram no contexto. Sem chave, a aba informa que está indisponível.

Execute `npm run db:setup` para criar as tabelas do chat. Essa preparação preserva os registros existentes. Reinicie o backend após alterar as variáveis de ambiente.

As mensagens de texto são persistidas em MySQL, com limite de 2.000 caracteres, paginação e confirmação de leitura. O envio entre pessoas possui identificador para evitar duplicação ao tentar novamente. A tela guarda rascunhos por conversa durante sua abertura e permite buscar nas mensagens carregadas. As atualizações ocorrem a cada três segundos com o chat aberto em primeiro plano; não há notificações push, anexos ou indicador de presença.

O assistente usa a [Responses API da OpenAI](https://developers.openai.com/api/docs/guides/text), com `store: false`. O histórico continua armazenado no banco do Jaci. Esta configuração não significa criptografia de ponta a ponta.

Para testar os fluxos do chat, use uma base exclusiva terminada em `_teste`, prepare-a e execute `npm --prefix server run test:integration`. Os testes criam e removem suas próprias contas; não enviam e-mails ou chamadas reais à IA.
