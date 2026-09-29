import React, { useEffect, useState } from 'react';
import {
  AppState,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import MapaLocalizacao from '@/components/ui/MapaLocalizacao';
import { listarLocalizacoes, mensagemErro } from '@/features/protecao/api/protecao.api';
import {
  iniciarCompartilhamento,
  pararCompartilhamento,
  recuperarCompartilhamento,
  useLocalizacao,
} from '@/services/localizacao/compartilhamento';

export default function LocalizacaoScreen({ perfil = 'protegida' }) {
  const guardiao = perfil === 'guardiao';
  const cores = useCoresTela();
  const { height } = useWindowDimensions();
  const cliente = useQueryClient();
  const envio = useLocalizacao();
  const [selecionado, selecionar] = useState(null);
  const [versaoMapa, recarregarMapa] = useState(0);
  const [agora, definirAgora] = useState(Date.now());
  const [erroMapa, definirErroMapa] = useState('');
  const consulta = useQuery({
    queryKey: ['localizacao', perfil],
    queryFn: listarLocalizacoes,
    refetchInterval: 5000,
    staleTime: 0,
  });
  useEffect(() => {
    if (!guardiao) recuperarCompartilhamento();
    const temporizador = setInterval(() => definirAgora(Date.now()), 10000);
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        if (!guardiao) recuperarCompartilhamento();
        cliente.invalidateQueries({ queryKey: ['localizacao'] });
      }
    });
    return () => {
      clearInterval(temporizador);
      assinatura.remove();
    };
  }, [guardiao, cliente]);
  const posicoes = (consulta.data || []).map((local) => ({
    ...local,
    latitude: Number(local.latitude),
    longitude: Number(local.longitude),
  }));
  async function iniciar() {
    await iniciarCompartilhamento();
    cliente.invalidateQueries({ queryKey: ['localizacao'] });
  }
  async function parar() {
    try {
      await pararCompartilhamento();
      cliente.setQueryData(['localizacao', perfil], []);
    } catch {
      /* O serviço mantém a mensagem e permite tentar novamente. */
    }
    cliente.invalidateQueries({ queryKey: ['localizacao'] });
  }
  return (
    <TelaPadrao
      perfil={perfil}
      ativo={guardiao ? 'localizacao' : 'inicio'}
      titulo={guardiao ? 'Sua rede no mapa' : 'Por perto, onde você estiver'}
      descricao={
        guardiao
          ? 'Acompanhe as posições que suas protegidas escolheram compartilhar.'
          : 'Compartilhe seu caminho com quem cuida de você.'
      }
      icone="navigate-outline"
    >
      <LinearGradient
        colors={guardiao ? ['#E0F4F1', '#EDF4FF'] : ['#FCE2F2', '#F7ECFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.resumo}
      >
        <View style={s.selo}>
          <Ionicons name="shield-checkmark" size={23} color="#A02680" />
        </View>
        <View style={s.textos}>
          <Text style={s.resumoTitulo}>
            {guardiao
              ? 'Conexão que cuida'
              : envio.ativo
                ? 'Compartilhamento ligado'
                : 'Você escolhe quando compartilhar'}
          </Text>
          <Text style={s.resumoTexto}>
            {guardiao
              ? 'O mapa consulta novas posições a cada 5 segundos.'
              : envio.ativo
                ? envio.segundoPlano
                  ? 'Também em segundo plano, com permissão do celular.'
                  : 'Atualizando enquanto o app ou esta aba estiver em uso.'
                : 'Sua localização só é enviada depois que você ativar.'}
          </Text>
        </View>
      </LinearGradient>
      <View style={[s.mapaCartao, { borderColor: cores.borda }]}>
        <View style={{ height: Math.max(340, Math.min(height * 0.55, 480)) }}>
          <MapaLocalizacao
            key={versaoMapa}
            posicoes={posicoes}
            selecionado={selecionado}
            desconectado={consulta.isError}
          />
        </View>
        <View style={[s.rodapeMapa, { backgroundColor: cores.superficie }]}>
          <Ionicons name="hand-left-outline" size={15} color={cores.secundario} />
          <Text style={[s.dica, { color: cores.secundario }]}>
            Arraste para explorar • use + e − ou dois dedos para ampliar
          </Text>
        </View>
      </View>
      <View style={s.ferramentas}>
        <Pressable
          accessibilityRole="button"
          onPress={() => recarregarMapa((v) => v + 1)}
          style={s.link}
        >
          <Ionicons name="reload-outline" size={16} color={cores.destaque} />
          <Text style={{ color: cores.destaque }}>Recarregar mapa</Text>
        </Pressable>
        <Text accessibilityLiveRegion="polite" style={{ color: cores.secundario, fontSize: 12 }}>
          {consulta.isFetching
            ? 'Atualizando…'
            : `${posicoes.length} ${posicoes.length === 1 ? 'posição' : 'posições'}`}
        </Text>
      </View>
      {!guardiao && (
        <Cartao>
          <Text style={[s.titulo, { color: cores.texto }]}>Seu caminho, seu controle</Text>
          <Mensagem
            texto={
              Platform.OS === 'web'
                ? 'Seus guardiões vinculados recebem sua posição. Na web, mantenha esta aba aberta; o navegador pode pausar o GPS quando você sair.'
                : 'Ao ativar, permita localização “sempre” para continuar com a tela bloqueada. No Android, uma notificação indica o compartilhamento. Você pode parar a qualquer momento.'
            }
          />
          {!envio.ativo && (
            <Botao
              titulo="Ativar localização em tempo real"
              carregando={envio.iniciando}
              disabled={envio.parando}
              onPress={iniciar}
            />
          )}
          <Botao
            titulo={
              envio.ativo ? 'Parar e remover minha localização' : 'Remover posição compartilhada'
            }
            secundario
            carregando={envio.parando}
            disabled={envio.iniciando}
            onPress={parar}
          />
          <Mensagem texto={envio.aviso} />
          <Mensagem erro texto={envio.erro} />
        </Cartao>
      )}
      <Mensagem
        erro
        texto={
          consulta.error &&
          `${mensagemErro(consulta.error)} O mapa pode estar mostrando uma posição antiga.`
        }
      />
      {consulta.isPending && <Mensagem texto="Buscando as posições da sua rede…" />}
      {!consulta.isPending && !posicoes.length && (
        <Cartao>
          <Text style={[s.titulo, { color: cores.texto }]}>O mapa está pronto para vocês</Text>
          <Mensagem
            texto={
              guardiao
                ? 'Quando uma protegida vinculada ativar o compartilhamento, ela aparecerá aqui.'
                : 'Ative o compartilhamento para mostrar sua posição real no mapa.'
            }
          />
        </Cartao>
      )}
      {posicoes.map((local) => {
        const idade = agora - new Date(local.atualizadoEm).getTime();
        const recente = idade >= -30000 && idade < 60000 && !consulta.isError;
        return (
          <View
            key={local.idLocalizacaoUsuario}
            style={[
              s.pessoa,
              {
                backgroundColor: cores.superficie,
                borderColor:
                  selecionado === local.idLocalizacaoUsuario ? cores.destaque : cores.borda,
              },
            ]}
          >
            <View style={[s.avatar, { backgroundColor: cores.suave }]}>
              <Ionicons name="person-outline" size={22} color={cores.destaque} />
            </View>
            <View style={s.textos}>
              <Text style={[s.titulo, { color: cores.texto }]}>{local.nome}</Text>
              <Text style={[s.status, { color: recente ? '#26765D' : cores.secundario }]}>
                {recente ? '● Posição recente' : '○ Última posição conhecida'}
              </Text>
              <Text style={[s.horario, { color: cores.secundario }]}>
                Capturada em {new Date(local.atualizadoEm).toLocaleString('pt-BR')}
              </Text>
              <Pressable
                accessibilityRole="button"
                style={s.link}
                onPress={() => selecionar(local.idLocalizacaoUsuario)}
              >
                <Text style={{ color: cores.destaque }}>Ver no mapa</Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                style={s.link}
                onPress={async () => {
                  try {
                    await Linking.openURL(
                      `https://www.google.com/maps?q=${local.latitude},${local.longitude}`,
                    );
                  } catch {
                    definirErroMapa('Não foi possível abrir o mapa externo.');
                  }
                }}
              >
                <Text style={{ color: cores.destaque }}>Abrir no Google Maps ↗</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
      <Mensagem erro texto={erroMapa} />
      <Mensagem texto="O GPS e a internet podem atrasar atualizações. Confira sempre o horário da posição. A última posição permanece visível até você remover o compartilhamento." />
    </TelaPadrao>
  );
}
const s = StyleSheet.create({
  resumo: { padding: 18, borderRadius: 24, flexDirection: 'row', gap: 12, alignItems: 'center' },
  selo: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFFAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, minWidth: 0 },
  resumoTitulo: { color: '#592444', fontWeight: '700', fontSize: 15 },
  resumoTexto: { color: '#73546B', fontSize: 12, lineHeight: 19, marginTop: 5 },
  mapaCartao: { borderRadius: 26, overflow: 'hidden', borderWidth: 1 },
  rodapeMapa: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dica: { fontSize: 11, lineHeight: 17, flex: 1 },
  ferramentas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  link: { minHeight: 44, flexDirection: 'row', gap: 7, alignItems: 'center', paddingVertical: 8 },
  titulo: { fontSize: 16, fontWeight: '700' },
  pessoa: { borderWidth: 1, borderRadius: 22, padding: 18, flexDirection: 'row', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: { fontSize: 12, marginTop: 6 },
  horario: { fontSize: 11, lineHeight: 17, marginTop: 4 },
});
