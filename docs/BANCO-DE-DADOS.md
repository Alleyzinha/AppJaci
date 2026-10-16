# Banco de dados Jaci

O arquivo `bdJaci.sql` fornecido pela usuária é a referência do modelo funcional. Ele foi escrito para SQL Server; o projeto usa MySQL 8.4, então seus tipos e comandos foram convertidos para MySQL nos arquivos em `server/banco/`.

## Mapeamento do modelo

| Entidade do arquivo                                                                   | Implementação MySQL | Uso na API                                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `tbUsuario`                                                                           | `tbUsuario`         | Conta, autenticação, perfil e dados de sessão; alguns campos dão suporte à confirmação de e-mail e recuperação segura. |
| `tbProtegida`                                                                         | `tbProtegida`       | Dados específicos da pessoa protegida e relação 1:1 com a conta.                                                       |
| `tbGuardiao`                                                                          | `tbGuardiao`        | Dados de contato do guardião.                                                                                          |
| `tbVinculo`                                                                           | `tbVinculo`         | Relaciona uma pessoa protegida ao contato guardião.                                                                    |
| `tbLocalizacaoUsuario`, `tbDiario`, `tbAlertaSos`                                     | Mesmo nome          | Localização, diário e SOS. O SOS mantém `data` e `hora` do modelo e `dataHora` para ordenação na API.                  |
| `tbAdmin`, `tbConversa`, `tbMensagem`, `tbNotificacao`, `tbDispositivo`, `tbLogAdmin` | Mesmo nome          | Entidades administrativas, de conversa, notificação, dispositivo e auditoria.                                          |

O backend também mantém tabelas de suporte para códigos de acesso, chat atual e assistente, pois esses recursos não estão descritos no arquivo recebido. Campos como telefone, perfil da conta, confirmação de e-mail e hash de sessão continuam em `tbUsuario` para atender os fluxos existentes.

## Preparação e atualização

`npm run db:setup` aplica, em ordem, `001_estrutura.sql`, `002_chat.sql` e `003_modelo_bdJaci.sql`. A terceira etapa cria as entidades do modelo recebido e converte os registros de guardiões já existentes em vínculos, sem apagar tabelas ou registros. Também cria `tbProtegida` para contas protegidas existentes e preenche `data`/`hora` de alertas anteriores.

O banco configurado em `server/.env` continua sendo `bdJaci` por padrão. A senha e o usuário são definidos nessa configuração local ou em `server/.env.example` como referência.

O SQL recebido contém apenas a estrutura, sem registros para importar. Contas já existentes no MySQL são preservadas; não há importação de dados de outro servidor ou conversão de senhas em texto puro.

## Integridade e acesso

- E-mail único por conta e credenciais de guardiões associadas à conta em `tbUsuario`.
- Chaves estrangeiras em InnoDB removem dados dependentes em cascata ao excluir uma conta.
- A API autoriza localização e alertas de SOS de acordo com vínculos ativos em `tbVinculo`.
- Apenas pessoas protegidas podem usar o diário, compartilhar localização e abrir/encerrar alertas.
- Senhas, PINs e códigos de acesso são armazenados como hashes.
- Horários são tratados em UTC no driver e formatados em português pela interface.
