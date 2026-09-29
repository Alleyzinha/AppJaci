import BotaoSos from '@/components/ui/BotaoSos';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from './styles';
import React, { useState } from 'react';
import { Linking, Text, View, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import {
  listarAlertas,
  registrarAlerta,
  encerrarAlerta,
  mensagemErro,
} from '@/features/protecao/api/protecao.api';

export default function SosScreen({ perfil = 'protegida' }) {
  const guardiao = perfil === 'guardiao';
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const [erroLigacao, definirErroLigacao] = useState('');
  const consulta = useQuery({
    queryKey: ['sos', perfil],
    queryFn: listarAlertas,
    refetchInterval: 15000,
  });
  const atualizar = () => cliente.invalidateQueries({ queryKey: ['sos'] });
  const registrar = useMutation({ mutationFn: registrarAlerta, onSuccess: atualizar });
  const encerrar = useMutation({ mutationFn: encerrarAlerta, onSuccess: atualizar });
  async function ligar(numero) {
    try {
      await Linking.openURL(`tel:${numero}`);
    } catch {
      definirErroLigacao(`Não foi possível abrir o telefone. Ligue ${numero} pelo seu celular.`);
    }
  }
  return (
    <TelaPadrao
      compacto
      perfil={perfil}
      ativo="sos"
      titulo="SOS Emergência"
      descricao={
        guardiao
          ? 'Em uma emergência imediata, ligue 190. O registro no aplicativo não aciona a polícia.'
          : 'Segure SOS por 2 segundos para alertar sua rede. Em perigo imediato, ligue 190.'
      }
      icone="alert-circle-outline"
    >
      <Cartao>
        <BotaoSos
          guardiao={guardiao}
          carregando={registrar.isPending}
          onAcionar={() => (guardiao ? ligar('190') : registrar.mutate())}
        />
        {!guardiao && (
          <>
            <Mensagem texto={registrar.data?.mensagem} />
            <Mensagem erro texto={registrar.error && mensagemErro(registrar.error)} />
            <View style={[styles.informacao, { backgroundColor: cores.suave }]}>
              <View style={styles.informacaoTitulo}>
                <Ionicons name="information-circle-outline" size={20} color={cores.destaque} />
                <Text style={[styles.titulo, { color: cores.texto }]}>Importante saber</Text>
              </View>
              <Text style={[styles.descricao, { color: cores.secundario }]}>
                O botão registra um alerta para sua rede no aplicativo; ele não chama a polícia nem
                envia SMS ou notificações em segundo plano.
              </Text>
              <Text style={[styles.descricao, { color: cores.texto }]}>
                Em perigo imediato, ligue 190. A Central da Mulher atende pelo 180.
              </Text>
            </View>
          </>
        )}
        <Mensagem erro texto={erroLigacao} />
      </Cartao>
      <Text style={[styles.secao, { color: cores.texto }]}>Atalhos de ajuda</Text>
      <View style={styles.atalhos}>
        {[
          {
            titulo: 'Ligar 180',
            descricao: 'Central da Mulher · 24 horas',
            icone: 'call-outline',
            acao: () => ligar('180'),
          },
          {
            titulo: 'Delegacias',
            descricao: 'Buscar no Google Maps',
            icone: 'business-outline',
            acao: async () => {
              try {
                await Linking.openURL(
                  'https://www.google.com/maps/search/?api=1&query=delegacias+da+mulher+perto+de+mim',
                );
              } catch {
                definirErroLigacao('Não foi possível abrir o mapa. Tente novamente.');
              }
            },
          },
          guardiao
            ? {
                titulo: 'Acompanhar localização',
                descricao: 'Locais compartilhados pela sua rede',
                icone: 'location-outline',
                acao: () => router.push('/guardiao/localizacao'),
              }
            : {
                titulo: 'Acolhimento',
                descricao: 'Conheça os caminhos de apoio',
                icone: 'chatbubble-ellipses-outline',
                acao: () => router.push('/protegida/chat'),
              },
        ].map((item) => (
          <Pressable
            key={item.titulo}
            accessibilityRole="button"
            accessibilityLabel={item.titulo}
            onPress={item.acao}
            style={({ pressed }) => [
              styles.atalho,
              {
                backgroundColor: cores.superficie,
                borderColor: cores.borda,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.icone, { backgroundColor: cores.suave }]}>
              <Ionicons name={item.icone} size={24} color={cores.destaque} />
            </View>
            <View style={styles.textoAtalho}>
              <Text style={[styles.tituloAtalho, { color: cores.texto }]}>
                {item.titulo === 'Acompanhar localização' ? 'Localização' : item.titulo}
              </Text>
              <Text style={[styles.descricaoAtalho, { color: cores.secundario }]}>
                {item.descricao}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Cartao>
        <Text style={[styles.titulo, { color: cores.texto }]}>Em uma emergência imediata</Text>
        <Mensagem texto="190 · Polícia Militar. 180 · Central de Atendimento à Mulher. O alerta no aplicativo não chama a polícia nem substitui uma ligação." />
        {!guardiao && (
          <Mensagem texto="Seus guardiões poderão consultar o alerta ao abrir o aplicativo. Não são enviados SMS ou notificações em segundo plano." />
        )}
        <Botao titulo="Ligar 190" perigo onPress={() => ligar('190')} />
      </Cartao>
      <Text style={[styles.secao, { color: cores.texto }]}>Alertas da sua rede</Text>
      <Botao
        titulo="Atualizar alertas"
        secundario
        carregando={consulta.isFetching}
        onPress={() => consulta.refetch()}
      />
      <Mensagem erro texto={consulta.error && mensagemErro(consulta.error)} />
      <Mensagem erro texto={encerrar.error && mensagemErro(encerrar.error)} />
      {consulta.isPending && <Mensagem texto="Consultando alertas…" />}
      {consulta.data?.length === 0 && (
        <Cartao>
          <Mensagem texto="Nenhum alerta registrado." />
        </Cartao>
      )}
      {consulta.data?.map((alerta) => (
        <Cartao key={alerta.idAlertaSos}>
          <Text style={{ color: cores.texto, fontSize: 19, fontWeight: '700' }}>{alerta.nome}</Text>
          <Mensagem
            texto={`${alerta.status === 'ativo' ? 'Alerta ativo' : 'Alerta encerrado'} · ${new Date(alerta.dataHora).toLocaleString('pt-BR')}`}
          />
          {!guardiao && alerta.status === 'ativo' && (
            <Botao
              titulo="Encerrar este alerta"
              secundario
              carregando={encerrar.isPending}
              onPress={() => encerrar.mutate(alerta.idAlertaSos)}
            />
          )}
        </Cartao>
      ))}
    </TelaPadrao>
  );
}
