import React, { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import { TOPICOS_ACOLHIMENTO } from '@/features/protecao/data/apoio';
import { lerContatosOffline, salvarContatosOffline } from '@/features/protecao/local/apoioOffline';
import { listGuardians } from '@/features/guardians/api/guardians.api';
import { useAuthStore } from '@/stores/auth.store';

export default function ApoioOfflineScreen() {
  const cores = useCoresTela();
  const userId = useAuthStore((estado) => estado.userId);
  const [contatos, definirContatos] = useState([]);
  const [erroLigacao, definirErroLigacao] = useState('');

  useEffect(() => {
    let ativo = true;
    if (!userId)
      return () => {
        ativo = false;
      };
    lerContatosOffline(userId).then((salvos) => ativo && definirContatos(salvos));
    listGuardians()
      .then(async (guardioes) => {
        await salvarContatosOffline(userId, guardioes);
        if (ativo) definirContatos(await lerContatosOffline(userId));
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, [userId]);

  async function ligar(telefone) {
    try {
      await Linking.openURL(`tel:${telefone.replace(/[^+\d]/g, '')}`);
    } catch {
      definirErroLigacao(`Não foi possível abrir o telefone. Ligue ${telefone} manualmente.`);
    }
  }

  return (
    <TelaPadrao
      titulo="Ajuda sem internet"
      descricao="Orientações salvas no app e contatos de confiança carregados anteriormente."
      icone="cloud-offline-outline"
    >
      <Cartao>
        <Text style={{ color: cores.texto, fontSize: 17, fontWeight: '700' }}>Emergência</Text>
        <Mensagem texto="Em perigo imediato, ligue 190. Para orientação e denúncia de violência contra a mulher, ligue 180. A ligação depende de sinal da operadora." />
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Botao titulo="Ligar 190" perigo onPress={() => ligar('190')} />
          <Botao titulo="Ligar 180" secundario onPress={() => ligar('180')} />
        </View>
        <Mensagem erro texto={erroLigacao} />
      </Cartao>
      <Cartao>
        <Text style={{ color: cores.texto, fontSize: 17, fontWeight: '700' }}>
          Minha rede de confiança
        </Text>
        {!contatos.length ? (
          <Mensagem texto="Nenhum contato foi salvo neste aparelho ainda. Abra “Meus Guardiões” com internet para guardar os contatos para uso offline." />
        ) : (
          contatos.map((contato, indice) => (
            <Pressable
              key={`${contato.telefone}-${indice}`}
              accessibilityRole="button"
              accessibilityLabel={`Ligar para ${contato.nome}, ${contato.telefone}`}
              onPress={() => ligar(contato.telefone)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}
            >
              <Ionicons name="call-outline" size={21} color={cores.destaque} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: cores.texto, fontWeight: '700' }}>{contato.nome}</Text>
                <Text style={{ color: cores.secundario }}>
                  {[contato.relacao, contato.telefone].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </Cartao>
      <Cartao>
        <Text style={{ color: cores.texto, fontSize: 17, fontWeight: '700' }}>
          Orientações rápidas
        </Text>
        {TOPICOS_ACOLHIMENTO.map((topico) => (
          <View key={topico.id} style={{ gap: 5 }}>
            <Text style={{ color: cores.destaque, fontWeight: '700' }}>{topico.titulo}</Text>
            <Text style={{ color: cores.secundario, lineHeight: 21 }}>{topico.orientacao}</Text>
          </View>
        ))}
      </Cartao>
      <Mensagem texto="O app não envia SOS sem internet. Use a ligação telefônica ou procure uma pessoa e um lugar seguros." />
    </TelaPadrao>
  );
}
