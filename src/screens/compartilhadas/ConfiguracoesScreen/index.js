import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, {
  Botao,
  Cartao,
  Mensagem,
  estilos,
  useCoresTela,
} from '@/components/ui/TelaPadrao';
import SettingsCard from '@/components/ui/SettingsCard';
import { api } from '@/services/api/api';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';
import { useSegurancaStore } from '@/stores/seguranca.store';
import { saveSession } from '@/services/storage/secureStorage';
import { mensagemErro } from '@/features/protecao/api/protecao.api';
import { styles } from './styles';

export default function ConfiguracoesScreen({ perfil = 'protegida' }) {
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const escuro = useThemeStore((estado) => estado.isDark);
  const alternarTema = useThemeStore((estado) => estado.toggleDarkMode);
  const camuflagem = useSegurancaStore((estado) => estado.camuflagem);
  const alternarCamuflagem = useSegurancaStore((estado) => estado.alternarCamuflagem);
  const [rascunho, definirRascunho] = useState(null);
  const [erroSaida, definirErroSaida] = useState('');
  const consulta = useQuery({
    queryKey: ['minha-conta'],
    queryFn: async () => (await api.get('/users/me')).data.user,
  });
  const salvar = useMutation({
    mutationFn: async (dados) => (await api.patch('/users/me', dados)).data.user,
    onSuccess: async (usuario) => {
      cliente.setQueryData(['minha-conta'], usuario);
      definirRascunho(null);
      useAuthStore.setState({ userName: usuario.name });
      const sessao = useAuthStore.getState();
      if (sessao.token && sessao.perfil)
        await saveSession({
          token: sessao.token,
          perfil: sessao.perfil,
          userName: usuario.name,
          userId: sessao.userId || usuario.id,
        });
    },
  });
  const dados = rascunho || consulta.data;
  const nome = useAuthStore((estado) => estado.userName);
  return (
    <TelaPadrao
      perfil={perfil}
      ativo="ajustes"
      titulo="Do seu jeito"
      descricao="Seus dados, suas preferências. Tudo em um só lugar."
      icone="options-outline"
    >
      <Cartao>
        <View style={styles.perfil}>
          <View style={[styles.avatar, { backgroundColor: cores.suave }]}>
            <Text style={[styles.inicial, { color: cores.destaque }]}>
              {(nome || 'J')[0].toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.nome, { color: cores.texto }]}>{nome || 'Minha conta'}</Text>
            <Text style={[styles.legenda, { color: cores.secundario }]}>
              {perfil === 'guardiao' ? 'Perfil guardião' : 'Perfil protegida'}
            </Text>
          </View>
          <Ionicons name="shield-checkmark-outline" size={24} color={cores.destaque} />
        </View>
      </Cartao>
      <Text style={[styles.secao, { color: cores.secundario }]}>INFORMAÇÕES PESSOAIS</Text>
      <Cartao>
        <Mensagem texto={consulta.isPending && 'Carregando sua conta…'} />
        <Mensagem erro texto={consulta.error && mensagemErro(consulta.error)} />
        {consulta.isError && <Botao titulo="Tentar novamente" onPress={() => consulta.refetch()} />}
        {dados && (
          <>
            {[
              ['name', 'Nome completo'],
              ['phone', 'Telefone com DDD'],
            ].map(([chave, rotulo]) => (
              <View key={chave} style={styles.campo}>
                <Text style={[estilos.rotulo, { color: cores.texto }]}>{rotulo}</Text>
                <TextInput
                  accessibilityLabel={rotulo}
                  value={dados[chave] || ''}
                  maxLength={chave === 'name' ? 100 : 30}
                  keyboardType={chave === 'phone' ? 'phone-pad' : 'default'}
                  onChangeText={(valor) => definirRascunho({ ...dados, [chave]: valor })}
                  style={[
                    estilos.campo,
                    { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
                  ]}
                />
              </View>
            ))}
            <Mensagem texto={consulta.data?.email} />
            <Botao
              titulo="Salvar alterações"
              carregando={salvar.isPending}
              disabled={!rascunho}
              onPress={() => salvar.mutate({ name: dados.name, phone: dados.phone })}
            />
            <Mensagem texto={salvar.isSuccess && !rascunho ? 'Dados atualizados.' : ''} />
            <Mensagem erro texto={salvar.error && mensagemErro(salvar.error)} />
          </>
        )}
      </Cartao>
      <Text style={[styles.secao, { color: cores.secundario }]}>PREFERÊNCIAS E SEGURANÇA</Text>
      <View style={styles.preferencias}>
        <SettingsCard
          icon="moon-outline"
          title="Modo Escuro"
          description="Mais conforto para os seus olhos"
          type="switch"
          value={escuro}
          onValueChange={alternarTema}
        />
        {perfil === 'protegida' && (
          <SettingsCard
            icon="eye-off-outline"
            title="Modo Camuflagem"
            description="Disfarça o app para não chamar atenção"
            type="switch"
            value={camuflagem}
            onValueChange={alternarCamuflagem}
          />
        )}
        <SettingsCard
          icon="lock-closed-outline"
          title="Minha senha"
          description="Redefina sua senha por e-mail"
          onPress={() => router.push({ pathname: '/(auth)/esqueci-senha', params: { perfil } })}
        />
        {perfil === 'protegida' && (
          <SettingsCard
            icon="people-outline"
            title="Meus Guardiões"
            description="Adicionar e gerenciar seus guardiões"
            onPress={() => router.push('/protegida/guardioes')}
          />
        )}
        <SettingsCard
          icon="key-outline"
          title="Mudar PIN"
          description="Confirme por e-mail para alterar"
          onPress={() => router.push('/protegida/mudarPin')}
        />
        <SettingsCard
          icon="log-out-outline"
          title="Sair da conta"
          description="Encerrar sua sessão neste dispositivo"
          onPress={async () => {
            try {
              await useAuthStore.getState().signOut();
              router.replace('/(auth)/perfil');
            } catch {
              definirErroSaida('Não foi possível encerrar a sessão. Tente novamente.');
            }
          }}
        />
      </View>
      <Mensagem erro texto={erroSaida} />
    </TelaPadrao>
  );
}
