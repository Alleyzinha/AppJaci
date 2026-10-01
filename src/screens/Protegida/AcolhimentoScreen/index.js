import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import { SERVICOS_PUBLICOS, TOPICOS_ACOLHIMENTO } from '@/features/protecao/data/apoio';
import { styles } from './styles';

export default function AcolhimentoScreen() {
  const cores = useCoresTela();
  const [aberto, definirAberto] = useState('seguranca');
  const [erroLink, definirErroLink] = useState('');

  async function abrirLink(url) {
    try {
      await Linking.openURL(url);
      definirErroLink('');
    } catch {
      definirErroLink('Não foi possível abrir o recurso agora. Tente novamente ou ligue 180.');
    }
  }

  return (
    <TelaPadrao
      titulo="Espaço de acolhimento"
      descricao="Orientações e caminhos de apoio, para consultar no seu tempo."
      icone="heart-outline"
      ativo="chat"
    >
      <View style={[styles.aviso, { backgroundColor: cores.suave, borderColor: cores.borda }]}>
        <Ionicons name="information-circle-outline" size={21} color={cores.destaque} />
        <Text style={[styles.avisoTexto, { color: cores.texto }]}>
          Este espaço oferece orientações. Não há atendimento por chat aqui.
        </Text>
      </View>

      <Text style={[styles.secao, { color: cores.texto }]}>Preciso de ajuda agora</Text>
      <Cartao>
        <Text style={[styles.cardTitulo, { color: cores.texto }]}>
          Se houver perigo imediato, ligue 190.
        </Text>
        <Mensagem texto="O SOS do aplicativo registra um alerta para sua rede, mas não chama a polícia." />
        <Botao titulo="Abrir central SOS" onPress={() => router.push('/protegida/sos')} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ligar para a Central da Mulher pelo 180"
          onPress={() => abrirLink('tel:180')}
          style={({ pressed }) => [
            styles.ligar180,
            {
              borderColor: cores.borda,
              backgroundColor: cores.superficie,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="call-outline" size={20} color={cores.destaque} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ligarTitulo, { color: cores.texto }]}>
              Central da Mulher · 180
            </Text>
            <Text style={[styles.ligarDescricao, { color: cores.secundario }]}>
              Orientação e informações · 24 horas
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={cores.secundario} />
        </Pressable>
        <Mensagem erro texto={erroLink} />
      </Cartao>

      <Text style={[styles.secao, { color: cores.texto }]}>Manual prático</Text>
      <Text style={[styles.subtituloSecao, { color: cores.secundario }]}>
        Escolha um assunto para abrir as orientações.
      </Text>
      <View style={styles.topicos}>
        {TOPICOS_ACOLHIMENTO.map((topico) => {
          const expandido = aberto === topico.id;
          return (
            <View
              key={topico.id}
              style={[
                styles.topico,
                { backgroundColor: cores.superficie, borderColor: cores.borda },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: expandido }}
                onPress={() => definirAberto(expandido ? '' : topico.id)}
                style={({ pressed }) => [styles.topicoCabecalho, { opacity: pressed ? 0.72 : 1 }]}
              >
                <View style={[styles.topicoIcone, { backgroundColor: cores.suave }]}>
                  <Ionicons name={topico.icone} size={21} color={cores.destaque} />
                </View>
                <Text style={[styles.topicoTitulo, { color: cores.texto }]}>{topico.titulo}</Text>
                <Ionicons
                  name={expandido ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={cores.secundario}
                />
              </Pressable>
              {expandido && (
                <Text style={[styles.topicoCorpo, { color: cores.secundario }]}>
                  {topico.orientacao}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <Botao
        titulo="Registrar algo no Diário"
        secundario
        onPress={() => router.push('/protegida/diario')}
      />
      <Botao
        titulo="Ver minha rede de confiança"
        secundario
        onPress={() => router.push('/protegida/guardioes')}
      />

      <Text style={[styles.secao, { color: cores.texto }]}>Ideias para quando estiver difícil</Text>
      <Cartao>
        <Mensagem texto="Você pode escolher uma coisa pequena: beber água, sentar perto de alguém de confiança ou respirar devagar por alguns instantes. Use apenas o que fizer sentido para você." />
        <Mensagem texto="Estas sugestões são gerais e não substituem atendimento profissional. Se quiser apoio psicossocial, veja os serviços públicos abaixo." />
      </Cartao>

      <Text style={[styles.secao, { color: cores.texto }]}>Recursos públicos</Text>
      <Mensagem texto="Não há uma psicóloga atendendo por este aplicativo. Abaixo estão caminhos oficiais de apoio público; a oferta local pode variar." />
      <View style={styles.servicos}>
        {SERVICOS_PUBLICOS.map((servico) => (
          <Pressable
            key={servico.id}
            accessibilityRole="link"
            accessibilityLabel={`${servico.titulo}. ${servico.acao}`}
            onPress={() => abrirLink(servico.url)}
            style={({ pressed }) => [
              styles.servico,
              {
                backgroundColor: cores.superficie,
                borderColor: cores.borda,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <View style={[styles.servicoIcone, { backgroundColor: cores.suave }]}>
              <Ionicons name={servico.icone} size={21} color={cores.destaque} />
            </View>
            <View style={styles.servicoTexto}>
              <Text style={[styles.servicoTitulo, { color: cores.texto }]}>{servico.titulo}</Text>
              <Text style={[styles.servicoDescricao, { color: cores.secundario }]}>
                {servico.descricao}
              </Text>
              <Text style={[styles.servicoAcao, { color: cores.destaque }]}>{servico.acao}</Text>
            </View>
            <Ionicons name="open-outline" size={17} color={cores.destaque} />
          </Pressable>
        ))}
      </View>
      <Mensagem texto="Fontes oficiais: Ministério das Mulheres e Ministério da Saúde. Consulte os links acima para informações atualizadas." />
    </TelaPadrao>
  );
}
