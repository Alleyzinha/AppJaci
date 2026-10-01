import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { useCoresTela } from '@/styles/useCoresTela';
import { mensagemErroApi } from '@/services/api/api';
import { Botao } from '@/components/ui/TelaPadrao';
import {
  enviarAssistente,
  enviarMensagem,
  historicoAssistente,
  listarContatos,
  listarMensagens,
  marcarLidas,
} from '@/features/chat/api/chat.api';
import { styles } from './styles';

const abas = [
  { id: 'rede', titulo: 'Minha rede', icone: 'people-outline' },
  { id: 'equipe', titulo: 'Equipe', icone: 'headset-outline' },
  { id: 'ia', titulo: 'Assistente IA', icone: 'sparkles-outline' },
];
function identificadorEnvio() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const n = Math.floor(Math.random() * 16);
    return (c === 'x' ? n : (n & 3) | 8).toString(16);
  });
}
function horario(valor) {
  return new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatScreen() {
  const cores = useCoresTela();
  const perfil = useAuthStore((s) => s.perfil);
  const userId = useAuthStore((s) => s.userId);
  const cliente = useQueryClient();
  const lista = useRef(null);
  const proximoEnvio = useRef(null);
  const [aba, definirAba] = useState('rede');
  const [selecionado, definirSelecionado] = useState(null);
  const [rascunhos, definirRascunhos] = useState({});
  const [busca, definirBusca] = useState('');
  const [buscar, definirBuscar] = useState(false);
  const [consentimento, definirConsentimento] = useState(false);
  const [foco, definirFoco] = useState(false);
  const [estadoApp, definirEstadoApp] = useState(AppState.currentState);
  const [erroLeitura, definirErroLeitura] = useState('');
  useFocusEffect(
    useCallback(() => {
      definirFoco(true);
      return () => definirFoco(false);
    }, []),
  );
  useEffect(() => {
    const inscricao = AppState.addEventListener('change', definirEstadoApp);
    return () => inscricao.remove();
  }, []);
  const ativo = foco && estadoApp === 'active';
  const contatosQuery = useQuery({
    queryKey: ['chat-contatos', userId],
    queryFn: listarContatos,
    enabled: ativo,
    refetchInterval: ativo ? 15000 : false,
  });
  const contatos = (contatosQuery.data?.contatos || []).filter((c) => c.modo === aba);
  const contato = contatos.find((c) => c.id === selecionado) || contatos[0];
  const ia = aba === 'ia';
  const chave = ia ? 'ia' : `${aba}:${contato?.id || 'vazio'}`;
  const texto = rascunhos[chave] || '';
  const queryKey = ['chat-mensagens', userId, aba, contato?.id];
  const conversa = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => listarMensagens(contato.id, aba, pageParam),
    getNextPageParam: (ultima) => (ultima.temMais ? ultima.mensagens[0]?.id : undefined),
    enabled: ativo && !ia && !!contato,
    refetchInterval: ativo ? 3000 : false,
  });
  const assistente = useQuery({
    queryKey: ['chat-ia', userId],
    queryFn: historicoAssistente,
    enabled: ativo && ia,
  });
  const mensagens = ia
    ? assistente.data?.mensagens || []
    : (conversa.data?.pages || [])
        .slice()
        .reverse()
        .flatMap((p) => p.mensagens);
  const ids = new Set();
  const unicas = mensagens.filter((m) => !ids.has(m.id) && ids.add(m.id));
  const exibidas = unicas.filter((m) =>
    m.texto.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')),
  );
  const ultimoRecebido =
    !ia && unicas.filter((m) => String(m.remetente) !== String(userId) && !m.lidaEm).at(-1)?.id;
  useEffect(() => {
    if (!ativo || !contato || !ultimoRecebido) return;
    let cancelado = false;
    marcarLidas(contato.id, aba, ultimoRecebido)
      .then(() => {
        if (!cancelado) {
          definirErroLeitura('');
          cliente.invalidateQueries({ queryKey: ['chat-contatos', userId] });
        }
      })
      .catch(() => {
        if (!cancelado) definirErroLeitura('Não foi possível confirmar a leitura.');
      });
    return () => {
      cancelado = true;
    };
  }, [ativo, contato?.id, aba, ultimoRecebido, cliente, userId]);
  const envio = useMutation({
    mutationFn: async (dados) => {
      if (dados.ia) return enviarAssistente(dados.texto);
      return enviarMensagem(dados.id, dados.modo, {
        texto: dados.texto,
        clienteId: dados.clienteId,
      });
    },
    onSuccess: (_, dados) => {
      definirRascunhos((v) => ({
        ...v,
        [dados.chave]: v[dados.chave] === dados.rascunho ? '' : v[dados.chave],
      }));
      proximoEnvio.current = null;
      cliente.invalidateQueries({
        queryKey: dados.ia ? ['chat-ia', userId] : ['chat-mensagens', userId, dados.modo, dados.id],
      });
      cliente.invalidateQueries({ queryKey: ['chat-contatos', userId] });
      lista.current?.scrollToOffset({ offset: 0, animated: true });
    },
  });
  function enviar() {
    if (!texto.trim() || envio.isPending || (!ia && !contato)) return;
    const dados = { texto: texto.trim(), rascunho: texto, chave, ia, id: contato?.id, modo: aba };
    const anterior = proximoEnvio.current;
    dados.clienteId =
      anterior?.chave === chave && anterior?.texto === dados.texto
        ? anterior.clienteId
        : identificadorEnvio();
    proximoEnvio.current = dados;
    envio.mutate(dados);
  }
  function trocarAba(id) {
    definirAba(id);
    definirSelecionado(null);
    definirBusca('');
    envio.reset();
    definirErroLeitura('');
  }
  const carregando = ia ? assistente.isPending : conversa.isPending && !!contato;
  const erro = envio.error || (ia ? assistente.error : conversa.error) || contatosQuery.error;
  const indisponivel = ia && !contatosQuery.data?.assistenteDisponivel;
  const podeEnviar = texto.trim().length > 0 && (ia ? consentimento && !indisponivel : !!contato);
  return (
    <SafeAreaView style={[styles.tela, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.area}>
          <View style={[styles.topo, { borderColor: cores.borda }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => (router.canGoBack() ? router.back() : router.replace(`/${perfil}`))}
              style={[styles.voltar, { backgroundColor: cores.suave }]}
            >
              <Ionicons name="arrow-back" size={22} color={cores.destaque} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.titulo, { color: cores.texto }]}>Conversas</Text>
              <Text style={[styles.subtitulo, { color: cores.secundario }]}>
                {ia
                  ? 'Jaci · assistente virtual'
                  : contato?.nome || 'Sua rede de apoio, mais perto'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Buscar nas mensagens"
              onPress={() => {
                definirBuscar(!buscar);
                definirBusca('');
              }}
              style={styles.voltar}
            >
              <Ionicons name="search-outline" size={23} color={cores.destaque} />
            </Pressable>
            {perfil === 'protegida' && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir orientações de acolhimento"
                onPress={() => router.push('/protegida/acolhimento')}
                style={styles.voltar}
              >
                <Ionicons name="heart-outline" size={23} color={cores.destaque} />
              </Pressable>
            )}
          </View>
          <View style={[styles.aviso, { backgroundColor: cores.suave }]}>
            <Ionicons name="information-circle-outline" size={17} color={cores.destaque} />
            <Text style={[styles.avisoTexto, { color: cores.texto }]}>
              Em perigo imediato, ligue 190. Este chat não aciona serviços de emergência.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, padding: 12 }}>
            {abas.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: aba === item.id }}
                onPress={() => trocarAba(item.id)}
                style={[
                  styles.contato,
                  {
                    flex: 1,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    borderColor: aba === item.id ? cores.destaque : cores.borda,
                    backgroundColor: aba === item.id ? cores.suave : cores.superficie,
                  },
                ]}
              >
                <Ionicons name={item.icone} size={18} color={cores.destaque} />
                <Text style={[styles.nome, { color: cores.texto, fontSize: 12 }]}>
                  {item.titulo}
                </Text>
              </Pressable>
            ))}
          </View>
          {!ia && contatos.length > 0 && (
            <ScrollView
              horizontal
              style={[styles.contatos, { borderColor: cores.borda }]}
              contentContainerStyle={styles.listaContatos}
              showsHorizontalScrollIndicator={false}
            >
              {contatos.map((c) => (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: c.id === contato?.id }}
                  onPress={() => {
                    definirSelecionado(c.id);
                    definirBusca('');
                    envio.reset();
                  }}
                  style={[
                    styles.contato,
                    {
                      borderColor: c.id === contato?.id ? cores.destaque : cores.borda,
                      backgroundColor: cores.superficie,
                    },
                  ]}
                >
                  <View style={[styles.avatar, { backgroundColor: cores.suave }]}>
                    <Text style={[styles.inicial, { color: cores.destaque }]}>
                      {c.nome[0]?.toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.nome, { color: cores.texto }]}>{c.nome}</Text>
                    <Text style={[styles.subtitulo, { color: cores.secundario }]}>
                      {c.naoLidas ? `${c.naoLidas} não lida(s)` : 'Abrir conversa'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
          {buscar && (
            <TextInput
              accessibilityLabel="Buscar nas mensagens carregadas"
              placeholder="Buscar nas mensagens carregadas"
              placeholderTextColor={cores.secundario}
              value={busca}
              onChangeText={definirBusca}
              style={[
                styles.campo,
                {
                  flex: undefined,
                  margin: 12,
                  color: cores.texto,
                  borderColor: cores.borda,
                  backgroundColor: cores.superficie,
                },
              ]}
            />
          )}
          {ia && (
            <View style={[styles.aviso, { backgroundColor: cores.suave }]}>
              <Text style={[styles.avisoTexto, { color: cores.texto }]}>
                Você conversa com uma IA. As mensagens desta conversa são enviadas à OpenAI para
                gerar respostas; não substitui atendimento profissional.
              </Text>
            </View>
          )}
          {ia && !consentimento && !indisponivel && (
            <View style={{ padding: 12 }}>
              <Botao
                titulo="Concordo e quero conversar com a IA"
                onPress={() => definirConsentimento(true)}
              />
            </View>
          )}
          {carregando || contatosQuery.isPending ? (
            <View style={styles.vazio}>
              <ActivityIndicator color={cores.destaque} />
              <Text style={[styles.vazioTexto, { color: cores.secundario }]}>
                Carregando conversa…
              </Text>
            </View>
          ) : (
            <FlatList
              ref={lista}
              style={styles.corpo}
              contentContainerStyle={styles.mensagens}
              inverted
              data={exibidas.slice().reverse()}
              keyExtractor={(m) => String(m.id)}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                !ia && conversa.hasNextPage ? (
                  <Botao
                    titulo="Carregar mensagens anteriores"
                    secundario
                    carregando={conversa.isFetchingNextPage}
                    onPress={() => conversa.fetchNextPage()}
                  />
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.vazio}>
                  <View
                    style={[styles.avatar, { width: 68, height: 68, backgroundColor: cores.suave }]}
                  >
                    <Ionicons
                      name={ia ? 'sparkles-outline' : 'chatbubbles-outline'}
                      size={32}
                      color={cores.destaque}
                    />
                  </View>
                  <Text style={[styles.vazioTitulo, { color: cores.texto }]}>
                    {busca
                      ? 'Nenhuma mensagem encontrada'
                      : indisponivel
                        ? 'Assistente em preparação'
                        : !ia && !contato
                          ? aba === 'rede'
                            ? 'Sua rede começa aqui'
                            : 'Nenhum atendente disponível'
                          : 'Vamos conversar?'}
                  </Text>
                  <Text style={[styles.vazioTexto, { color: cores.secundario }]}>
                    {indisponivel
                      ? 'A IA ainda não foi ativada. Enquanto isso, consulte o acolhimento ou converse com sua rede.'
                      : !ia && !contato
                        ? aba === 'rede'
                          ? perfil === 'protegida'
                            ? 'Adicione um guardião confirmado para começar uma conversa.'
                            : 'As protegidas vinculadas à sua conta aparecerão aqui.'
                          : 'A equipe ainda não possui contas de atendimento configuradas.'
                        : ia
                          ? 'Tire dúvidas sobre o Jaci ou organize seus próximos passos.'
                          : 'Envie sua primeira mensagem. A pessoa poderá responder quando abrir o chat.'}
                  </Text>
                  {!ia && !contato && aba === 'rede' && perfil === 'protegida' && (
                    <Botao
                      titulo="Gerenciar guardiões"
                      onPress={() => router.push('/protegida/guardioes')}
                    />
                  )}
                </View>
              }
              renderItem={({ item }) => {
                const minha = ia
                  ? item.papel === 'user'
                  : String(item.remetente) === String(userId);
                return (
                  <View
                    style={[
                      styles.bolha,
                      {
                        alignSelf: minha ? 'flex-end' : 'flex-start',
                        backgroundColor: minha ? cores.botao || '#CF2B9D' : cores.superficie,
                        borderBottomRightRadius: minha ? 4 : 19,
                        borderBottomLeftRadius: minha ? 19 : 4,
                      },
                    ]}
                  >
                    <Text
                      selectable
                      style={[styles.texto, { color: minha ? '#FFFFFF' : cores.texto }]}
                    >
                      {item.texto}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Text style={[styles.hora, { color: minha ? '#FFFFFF' : cores.secundario }]}>
                        {horario(item.criadaEm)}
                      </Text>
                      {minha && !ia && (
                        <Ionicons
                          accessibilityLabel={item.lidaEm ? 'Mensagem lida' : 'Mensagem enviada'}
                          name={item.lidaEm ? 'checkmark-done' : 'checkmark'}
                          size={15}
                          color="#FFFFFF"
                        />
                      )}
                    </View>
                  </View>
                );
              }}
            />
          )}
          <View
            style={[styles.rodape, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
          >
            {erro && (
              <View>
                <Text accessibilityRole="alert" style={[styles.erro, { color: cores.perigo }]}>
                  {mensagemErroApi(erro, 'Não foi possível atualizar a conversa.')}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    contatosQuery.refetch();
                    if (ia) assistente.refetch();
                    else if (contato) conversa.refetch();
                  }}
                >
                  <Text style={[styles.subtitulo, { color: cores.destaque }]}>
                    Tentar atualizar novamente
                  </Text>
                </Pressable>
              </View>
            )}
            {!!erroLeitura && (
              <Text style={[styles.erro, { color: cores.perigo }]}>{erroLeitura}</Text>
            )}
            {envio.isPending && ia && (
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.subtitulo, { color: cores.secundario }]}
              >
                Jaci está preparando uma resposta…
              </Text>
            )}
            <View style={styles.compositor}>
              <TextInput
                accessibilityLabel="Mensagem"
                placeholder="Escreva sua mensagem…"
                placeholderTextColor={cores.secundario}
                multiline
                maxLength={2000}
                editable={
                  !envio.isPending && (!ia || (consentimento && !indisponivel)) && (ia || !!contato)
                }
                value={texto}
                onChangeText={(valor) => definirRascunhos((v) => ({ ...v, [chave]: valor }))}
                style={[
                  styles.campo,
                  { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
                ]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Enviar mensagem"
                accessibilityState={{
                  disabled: !podeEnviar || envio.isPending,
                  busy: envio.isPending,
                }}
                disabled={!podeEnviar || envio.isPending}
                onPress={enviar}
                style={[
                  styles.enviar,
                  {
                    backgroundColor: cores.botao || '#CF2B9D',
                    opacity: podeEnviar && !envio.isPending ? 1 : 0.45,
                  },
                ]}
              >
                {envio.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                )}
              </Pressable>
            </View>
            <Text style={[styles.subtitulo, { color: cores.secundario }]}>
              {texto.length}/2000 ·{' '}
              {ia ? 'Assistente virtual' : 'Mensagens atualizadas enquanto o chat estiver aberto'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
