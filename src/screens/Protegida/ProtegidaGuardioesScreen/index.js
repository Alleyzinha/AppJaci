import EstadoVazio from '@/components/ui/EstadoVazio';
import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import { listGuardians, deleteGuardian } from '@/features/guardians/api/guardians.api';
import { mensagemErro } from '@/features/protecao/api/protecao.api';
import { styles } from './styles';

export default function ProtegidaGuardioesScreen() {
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const [confirmacao, definirConfirmacao] = useState(null);
  const [erroTelefone, definirErroTelefone] = useState('');
  const consulta = useQuery({ queryKey: ['guardioes'], queryFn: listGuardians });
  useFocusEffect(
    React.useCallback(() => {
      cliente.invalidateQueries({ queryKey: ['guardioes'] });
    }, [cliente]),
  );
  const excluir = useMutation({
    mutationFn: deleteGuardian,
    onSuccess: () => {
      definirConfirmacao(null);
      cliente.invalidateQueries({ queryKey: ['guardioes'] });
    },
  });

  return (
    <TelaPadrao
      titulo="Meus Guardiões"
      descricao="As pessoas que poderão consultar seus alertas e a localização que compartilhar."
      icone="people-outline"
    >
      <View style={[styles.intro, { backgroundColor: cores.suave, borderColor: cores.borda }]}>
        <View style={[styles.introIcone, { backgroundColor: cores.superficie }]}>
          <Ionicons name="people-outline" size={22} color={cores.destaque} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[styles.introTitulo, { color: cores.texto }]}>Seus Guardiões</Text>
          <Text style={[styles.introTexto, { color: cores.secundario }]}>
            Adicione ou remova guardiões quando quiser.
          </Text>
        </View>
      </View>
      <Botao
        titulo="Adicionar Guardião"
        onPress={() => router.push('/protegida/adicionarGuardiao')}
      />
      {consulta.isPending && <Mensagem texto="Carregando sua rede…" />}
      <Mensagem erro texto={consulta.error && mensagemErro(consulta.error)} />
      {consulta.isError && (
        <Botao titulo="Tentar novamente" secundario onPress={() => consulta.refetch()} />
      )}
      {consulta.data?.length === 0 && (
        <EstadoVazio
          icone="people-outline"
          titulo="Você ainda não tem guardiões."
          descricao="Adicione um guardião: a pessoa precisa ter uma conta Jaci com o e-mail confirmado."
        />
      )}
      {consulta.data?.map((guardiao) => (
        <Cartao key={guardiao.id}>
          <View style={styles.contatoTopo}>
            <View style={[styles.avatar, { backgroundColor: cores.suave }]}>
              <Text style={[styles.inicial, { color: cores.destaque }]}>
                {guardiao.name?.trim()?.[0]?.toLocaleUpperCase('pt-BR') || 'G'}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.nome, { color: cores.texto }]}>{guardiao.name}</Text>
              <Text style={[styles.relacao, { color: cores.secundario }]}>
                {[guardiao.relation, guardiao.phone].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={21} color={cores.destaque} />
          </View>
          <Mensagem texto={guardiao.email} />
          {guardiao.availability ? (
            <Mensagem texto={`Disponibilidade: ${guardiao.availability}`} />
          ) : null}
          {guardiao.observation ? <Mensagem texto={guardiao.observation} /> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ligar para ${guardiao.name}`}
            onPress={async () => {
              try {
                await Linking.openURL(`tel:${guardiao.phone.replace(/[^+\d]/g, '')}`);
                definirErroTelefone('');
              } catch {
                definirErroTelefone('Não foi possível abrir o telefone neste dispositivo.');
              }
            }}
            style={({ pressed }) => [
              styles.acaoContato,
              { backgroundColor: cores.suave, opacity: pressed ? 0.68 : 1 },
            ]}
          >
            <Ionicons name="call-outline" size={18} color={cores.destaque} />
            <Text style={[styles.acaoContatoTexto, { color: cores.destaque }]}>
              Ligar para esta pessoa
            </Text>
          </Pressable>
          {confirmacao === guardiao.id ? (
            <>
              <Mensagem texto="Esta pessoa deixará de consultar seus alertas e localizações compartilhadas." />
              <Botao
                titulo="Confirmar remoção"
                perigo
                carregando={excluir.isPending}
                onPress={() => excluir.mutate(guardiao.id)}
              />
              <Botao
                titulo="Cancelar"
                secundario
                disabled={excluir.isPending}
                onPress={() => definirConfirmacao(null)}
              />
              <Mensagem erro texto={excluir.error && mensagemErro(excluir.error)} />
            </>
          ) : (
            <Botao
              titulo="Remover guardião"
              secundario
              onPress={() => {
                excluir.reset();
                definirConfirmacao(guardiao.id);
              }}
            />
          )}
        </Cartao>
      ))}
      <Mensagem erro texto={erroTelefone} />
    </TelaPadrao>
  );
}
