import { criarAplicacao } from './aplicacao.js';
import { banco, consultar } from './banco/conexao.js';
import { iniciarMonitoramentoCheckins } from './notificacoes.js';

const app = await criarAplicacao();
let pararMonitoramento = () => {};
try {
  await consultar('SELECT idUsuario FROM tbUsuario LIMIT 1');
  await app.listen({ port: Number(process.env.PORT || 3000), host: '0.0.0.0' });
  pararMonitoramento = iniciarMonitoramentoCheckins(app.log);
} catch (erro) {
  app.log.error(erro, 'Verifique a configuração MySQL e execute npm run db:setup.');
  await app.close();
  pararMonitoramento();
  await banco.end();
  process.exitCode = 1;
}
for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(sinal, async () => {
    pararMonitoramento();
    await app.close();
    await banco.end();
  });
}
