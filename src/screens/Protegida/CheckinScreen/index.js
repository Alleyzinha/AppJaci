import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, {
  Botao,
  Cartao,
  Mensagem,
  estilos,
  useCoresTela,
} from '@/components/ui/TelaPadrao';
import {
  mensagemErro,
  obterCheckins,
  salvarCheckin,
  confirmarCheckin,
} from '@/features/protecao/api/protecao.api';

const INTERVALOS = [1, 3, 6, 12, 24];

function formatarData(valor) {
  return valor
    ? new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : '—';
}

export default function CheckinScreen({ perfil = 'protegida' }) {
  const guardiao = perfil === 'guardiao';
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const [intervaloHoras, definirIntervalo] = useState(6);
  const [observacao, definirObservacao] = useState('');
  const consulta = useQuery({
    queryKey: ['checkin', perfil],
    queryFn: obterCheckins,
    refetchInterval: guardiao ? 30000 : false,
  });
  useEffect(() => {
    if (consulta.data?.checkin) {
      definirIntervalo(consulta.data.checkin.intervaloHoras);
      definirObservacao(consulta.data.checkin.observacao || '');
    }
  }, [consulta.data]);
  const salvar = useMutation({
    mutationFn: salvarCheckin,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['checkin'] }),
  });
  const confirmar = useMutation({
    mutationFn: confirmarCheckin,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['checkin'] }),
  });

  return (
    <TelaPadrao
      perfil={perfil}
      titulo={guardiao ? 'Check-ins da sua rede' : 'Check-in combinado'}
      descricao={
        guardiao
          ? 'Veja quando as pessoas da sua rede esperam confirmar que está tudo bem.'
          : 'Combine um intervalo para confirmar que está tudo bem.'
      }
      icone="time-outline"
    >
      {guardiao ? (
        <>
          <Mensagem texto={consulta.isPending && 'Consultando check-ins…'} />
          <Mensagem erro texto={consulta.error && mensagemErro(consulta.error)} />
          {!consulta.isPending && !consulta.data?.checkins?.length && (
            <Cartao>
              <Mensagem texto="Nenhum check-in foi programado pela sua rede." />
            </Cartao>
          )}
          {consulta.data?.checkins?.map((item) => (
            <Cartao key={item.idUsuario}>
              <Text style={[estilos.rotulo, { color: cores.texto, fontSize: 17 }]}>
                {item.nome}
              </Text>
              <Mensagem
                erro={Boolean(item.atrasado)}
                texto={
                  item.atrasado
                    ? 'Check-in atrasado. Tente entrar em contato com cuidado.'
                    : `Próxima confirmação: ${formatarData(item.proximoEm)}`
                }
              />
              <Mensagem
                texto={`Intervalo combinado: ${item.intervaloHoras}h${item.confirmadoEm ? ` · Última confirmação: ${formatarData(item.confirmadoEm)}` : ''}`}
              />
              {item.observacao ? <Mensagem texto={item.observacao} /> : null}
            </Cartao>
          ))}
          <Mensagem texto="Esta lista só atualiza enquanto o app estiver aberto. Ela não envia notificações automáticas." />
        </>
      ) : (
        <>
          <Cartao>
            <Text style={[estilos.rotulo, { color: cores.texto }]}>
              Lembrar de confirmar a cada
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {INTERVALOS.map((horas) => (
                <Botao
                  key={horas}
                  titulo={`${horas}h`}
                  secundario={intervaloHoras !== horas}
                  onPress={() => definirIntervalo(horas)}
                />
              ))}
            </View>
            <Text style={[estilos.rotulo, { color: cores.texto }]}>
              Mensagem opcional para sua rede
            </Text>
            <TextInput
              accessibilityLabel="Mensagem opcional do check-in"
              value={observacao}
              onChangeText={definirObservacao}
              maxLength={300}
              placeholder="Ex.: Se eu não confirmar, me ligue primeiro."
              placeholderTextColor={cores.secundario}
              style={[
                estilos.campo,
                { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
              ]}
            />
            <Botao
              titulo="Programar check-in"
              carregando={salvar.isPending}
              onPress={() => salvar.mutate({ intervaloHoras, observacao })}
            />
            <Mensagem erro texto={salvar.error && mensagemErro(salvar.error)} />
          </Cartao>
          <Mensagem texto={consulta.error && mensagemErro(consulta.error)} erro />
          {consulta.data?.checkin && (
            <Cartao>
              <Text style={[estilos.rotulo, { color: cores.texto }]}>Seu próximo check-in</Text>
              <Mensagem
                erro={Boolean(consulta.data.checkin.atrasado)}
                texto={
                  consulta.data.checkin.atrasado
                    ? `Está atrasado desde ${formatarData(consulta.data.checkin.proximoEm)}.`
                    : formatarData(consulta.data.checkin.proximoEm)
                }
              />
              <Botao
                titulo="Estou bem · confirmar agora"
                carregando={confirmar.isPending}
                onPress={() => confirmar.mutate()}
              />
              <Mensagem texto={confirmar.isSuccess && 'Próximo check-in atualizado.'} />
              <Mensagem erro texto={confirmar.error && mensagemErro(confirmar.error)} />
            </Cartao>
          )}
          <Mensagem texto="Se um check-in vencer sem confirmação, seus guardiões vinculados receberão um alerta no celular quando as notificações estiverem ativadas." />
        </>
      )}
    </TelaPadrao>
  );
}
