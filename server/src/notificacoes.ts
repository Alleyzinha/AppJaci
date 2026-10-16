import type { FastifyBaseLogger } from 'fastify';
import { consultar, executar } from './banco/conexao.js';

type MensagemPush = {
  titulo: string;
  corpo: string;
  dados: Record<string, string | number>;
};

type TicketExpo = { status: 'ok' | 'error'; details?: { error?: string } };

export async function enviarPush(tokens: string[], mensagem: MensagemPush) {
  const unicos = [...new Set(tokens)].filter((token) => /^Expo(nent)?PushToken\[[^\]]+\]$/.test(token));
  for (let inicio = 0; inicio < unicos.length; inicio += 100) {
    const lote = unicos.slice(inicio, inicio + 100);
    try {
      const resposta = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          lote.map((to) => ({
            to,
            title: mensagem.titulo,
            body: mensagem.corpo,
            data: mensagem.dados,
            sound: 'default',
            priority: 'high',
            channelId: 'alertas',
          })),
        ),
        signal: AbortSignal.timeout(8000),
      });
      if (!resposta.ok) continue;
      const resultado = (await resposta.json()) as { data?: TicketExpo[] };
      const invalidos = lote.filter(
        (_, indice) => resultado.data?.[indice]?.details?.error === 'DeviceNotRegistered',
      );
      for (const token of invalidos)
        await executar('DELETE FROM tbDispositivoPush WHERE token = ?', [token]);
    } catch {
      // Falha de push nÃ£o deve impedir que o SOS ou check-in seja salvo na API.
    }
  }
}

export async function notificarGuardioesDoSos(idUsuario: number) {
  const dispositivos = await consultar<{ token: string }>(
    `SELECT DISTINCT d.token FROM tbDispositivoPush d
    JOIN tbGuardiao g ON g.idContaGuardiao = d.idUsuario AND g.status = 'ativo'
    JOIN tbVinculo v ON v.idGuardiao = g.idGuardiao AND v.status = 'Ativo'
    JOIN tbProtegida p ON p.idProtegida = v.idProtegida
    WHERE p.idUsuario = ? AND d.idUsuario <> ?`,
    [idUsuario, idUsuario],
  );
  await enviarPush(
    dispositivos.map(({ token }) => token),
    {
      titulo: 'Alerta SOS',
      corpo: 'Um alerta de seguranÃ§a foi acionado na sua rede. Abra o AppJaci.',
      dados: { tela: '/guardiao/sos' },
    },
  );
}

export async function verificarCheckinsAtrasados(logger: FastifyBaseLogger) {
  const vencidos = await consultar<{ idCheckin: number; idUsuario: number }>(
    `SELECT c.idCheckin, c.idUsuario FROM tbCheckin c
    WHERE c.proximoEm <= UTC_TIMESTAMP(3) AND c.alertaAtrasoEnviadoEm IS NULL LIMIT 100`,
  );
  for (const checkin of vencidos) {
    const reivindicado = await executar(
      `UPDATE tbCheckin SET alertaAtrasoEnviadoEm = UTC_TIMESTAMP(3)
      WHERE idCheckin = ? AND proximoEm <= UTC_TIMESTAMP(3) AND alertaAtrasoEnviadoEm IS NULL`,
      [checkin.idCheckin],
    );
    if (!reivindicado.affectedRows) continue;
    try {
      const dispositivos = await consultar<{ token: string }>(
        `SELECT DISTINCT d.token FROM tbDispositivoPush d
        JOIN tbGuardiao g ON g.idContaGuardiao = d.idUsuario AND g.status = 'ativo'
        JOIN tbVinculo v ON v.idGuardiao = g.idGuardiao AND v.status = 'Ativo'
        JOIN tbProtegida p ON p.idProtegida = v.idProtegida
        WHERE p.idUsuario = ? AND d.idUsuario <> ?`,
        [checkin.idUsuario, checkin.idUsuario],
      );
      await enviarPush(
        dispositivos.map(({ token }) => token),
        {
          titulo: 'Check-in atrasado',
          corpo: 'Um check-in combinado venceu sem confirmaÃ§Ã£o. Verifique o AppJaci.',
          dados: { tela: '/guardiao/checkin' },
        },
      );
    } catch (erro) {
      logger.error({ err: erro, idCheckin: checkin.idCheckin }, 'Falha ao notificar check-in');
    }
  }
}

export function iniciarMonitoramentoCheckins(logger: FastifyBaseLogger) {
  let executando = false;
  const verificar = async () => {
    if (executando) return;
    executando = true;
    try {
      await verificarCheckinsAtrasados(logger);
    } catch (erro) {
      logger.error({ err: erro }, 'Falha ao consultar check-ins vencidos');
    } finally {
      executando = false;
    }
  };
  const temporizador = setInterval(() => void verificar(), 60_000);
  void verificar();
  return () => clearInterval(temporizador);
}
