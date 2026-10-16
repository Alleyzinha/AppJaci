# NotificaÃ§Ãµes push

O AppJaci envia push para os guardiÃµes vinculados quando uma conta protegida aciona o SOS e quando um check-in vence sem confirmaÃ§Ã£o. O processo do servidor confere check-ins vencidos uma vez por minuto. Os textos enviados ao serviÃ§o de push sÃ£o genÃ©ricos e nÃ£o incluem nome, e-mail ou identificador da pessoa.

## Preparar um build nativo

Push remoto nÃ£o funciona no Expo Go para Android. O projeto precisa estar ligado a um projeto EAS e instalado em um build de desenvolvimento:

1. Entre na conta EAS: `npx eas-cli@latest login`.
2. Associe este app a um projeto EAS: `npx eas-cli@latest init`. Esse comando grava o identificador real do projeto em `app.json`.
3. Configure as credenciais de push da plataforma no EAS, conforme [o guia oficial de configuraÃ§Ã£o de push](https://docs.expo.dev/push-notifications/push-notifications-setup/).
4. Gere o build: `npx eas-cli@latest build --profile development --platform android` (ou `ios`) e instale-o no dispositivo.
5. Inicie o projeto com `npx expo start --dev-client` e entre com uma conta GuardiÃ£o no dispositivo para registrar o token push.

As credenciais e o projeto EAS pertencem Ã  conta do desenvolvedor e nÃ£o ficam no repositÃ³rio. Sem esse vÃ­nculo e credenciais, o app continua funcionando e os alertas podem ser vistos ao abrir suas telas, mas o celular nÃ£o recebe push remoto.
