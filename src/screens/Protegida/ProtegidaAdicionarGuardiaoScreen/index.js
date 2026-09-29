import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, { Botao, Cartao, Mensagem, useCoresTela } from '@/components/ui/TelaPadrao';
import { createGuardian } from '@/features/guardians/api/guardians.api';
import { mensagemErro } from '@/features/protecao/api/protecao.api';
import { styles } from './styles';

const GRUPOS = [
  {
    titulo: 'Quem é a pessoa',
    descricao: 'Preencha os dados de quem você escolheu para a sua rede.',
    campos: [
      { chave: 'name', rotulo: 'Nome completo', limite: 100, erro: 'Informe o nome completo.' },
      {
        chave: 'email',
        rotulo: 'E-mail da conta Jaci',
        limite: 100,
        teclado: 'email-address',
        erro: 'Informe um e-mail válido.',
      },
      {
        chave: 'phone',
        rotulo: 'Telefone com DDD',
        limite: 30,
        teclado: 'phone-pad',
        erro: 'Informe um telefone com DDD.',
      },
      {
        chave: 'relation',
        rotulo: 'Parentesco ou relação',
        limite: 100,
        erro: 'Informe sua relação com esta pessoa.',
      },
    ],
  },
  {
    titulo: 'Informações opcionais',
    descricao: 'Acrescente detalhes que ajudem a combinar quando procurar essa pessoa.',
    campos: [
      {
        chave: 'availability',
        rotulo: 'Disponibilidade',
        limite: 100,
        opcional: true,
        ajuda: 'Ex.: durante o dia, em dias úteis.',
      },
      { chave: 'cep', rotulo: 'CEP', limite: 9, teclado: 'number-pad', opcional: true },
      { chave: 'observation', rotulo: 'Observação', limite: 500, opcional: true, multiline: true },
    ],
  },
];

const DADOS_INICIAIS = {
  name: '',
  email: '',
  phone: '',
  relation: '',
  availability: '',
  cep: '',
  observation: '',
};

function validarCampo(chave, valor) {
  const limpo = valor.trim();
  if (['name', 'relation'].includes(chave)) return limpo.length >= 2;
  if (chave === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo);
  if (chave === 'phone') return limpo.replace(/\D/g, '').length >= 8;
  return true;
}

export default function ProtegidaAdicionarGuardiaoScreen() {
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const [dados, definirDados] = useState(DADOS_INICIAIS);
  const [tocados, definirTocados] = useState({});
  const [tentouSalvar, definirTentouSalvar] = useState(false);
  const salvar = useMutation({
    mutationFn: createGuardian,
    onSuccess: async () => {
      await cliente.invalidateQueries({ queryKey: ['guardioes'] });
      router.replace('/protegida/guardioes');
    },
  });
  const obrigatoriosValidos = ['name', 'email', 'phone', 'relation'].every((chave) =>
    validarCampo(chave, dados[chave]),
  );
  const campo = (campoInfo) => {
    const erro = !validarCampo(campoInfo.chave, dados[campoInfo.chave]);
    const exibirErro = erro && (tocados[campoInfo.chave] || tentouSalvar);
    return (
      <View key={campoInfo.chave} style={styles.field}>
        <View style={styles.labelLine}>
          <Text style={[styles.label, { color: cores.texto }]}>{campoInfo.rotulo}</Text>
          {campoInfo.opcional && (
            <Text style={[styles.optional, { color: cores.secundario }]}>Opcional</Text>
          )}
        </View>
        <TextInput
          accessibilityLabel={campoInfo.rotulo}
          accessibilityHint={campoInfo.ajuda}
          value={dados[campoInfo.chave]}
          maxLength={campoInfo.limite}
          keyboardType={campoInfo.teclado || 'default'}
          autoCapitalize={campoInfo.chave === 'email' ? 'none' : 'sentences'}
          autoCorrect={campoInfo.chave !== 'email'}
          multiline={Boolean(campoInfo.multiline)}
          textAlignVertical={campoInfo.multiline ? 'top' : 'center'}
          placeholder={campoInfo.ajuda || ''}
          placeholderTextColor={cores.secundario}
          onBlur={() => definirTocados({ ...tocados, [campoInfo.chave]: true })}
          onChangeText={(valor) => {
            salvar.reset();
            definirDados({ ...dados, [campoInfo.chave]: valor });
          }}
          style={[
            styles.input,
            campoInfo.multiline && styles.multiline,
            {
              color: cores.texto,
              borderColor: exibirErro ? cores.perigo : cores.borda,
              backgroundColor: cores.superficie,
            },
          ]}
        />
        {exibirErro && (
          <Text accessibilityLiveRegion="polite" style={[styles.helper, { color: cores.perigo }]}>
            {campoInfo.erro}
          </Text>
        )}
        {campoInfo.ajuda && !campoInfo.multiline && (
          <Text style={[styles.helper, { color: cores.secundario }]}>{campoInfo.ajuda}</Text>
        )}
        {campoInfo.chave === 'email' && (
          <Text style={[styles.helper, { color: cores.secundario }]}>
            A pessoa precisa ter uma conta de guardião na Jaci e confirmar este e-mail.
          </Text>
        )}
      </View>
    );
  };

  return (
    <TelaPadrao
      titulo="Adicionar guardião"
      descricao="Inclua alguém de confiança na sua rede de proteção."
      icone="person-add-outline"
    >
      <Cartao>
        <View style={[styles.consent, { backgroundColor: cores.suave }]}>
          <Ionicons name="shield-checkmark-outline" size={21} color={cores.destaque} />
          <Text style={[styles.consentText, { color: cores.texto }]}>
            Você escolhe quem poderá consultar seus alertas e as localizações que decidir
            compartilhar.
          </Text>
        </View>
      </Cartao>
      {GRUPOS.map((grupo) => (
        <Cartao key={grupo.titulo}>
          <Text style={[styles.sectionTitle, { color: cores.texto }]}>{grupo.titulo}</Text>
          <Text style={[styles.sectionDescription, { color: cores.secundario }]}>
            {grupo.descricao}
          </Text>
          {grupo.campos.map(campo)}
        </Cartao>
      ))}
      <View style={[styles.consent, { backgroundColor: cores.suave }]}>
        <Ionicons name="lock-closed-outline" size={18} color={cores.destaque} />
        <Text style={[styles.consentText, { color: cores.texto }]}>
          Ao salvar, você confirma que deseja permitir a esta pessoa consultar seus alertas e as
          localizações que compartilhar.
        </Text>
      </View>
      <Mensagem erro texto={salvar.error && mensagemErro(salvar.error)} />
      <Botao
        titulo="Salvar guardião"
        carregando={salvar.isPending}
        disabled={!obrigatoriosValidos}
        onPress={() => {
          definirTentouSalvar(true);
          if (!obrigatoriosValidos) return;
          salvar.mutate({
            ...dados,
            email: dados.email.trim().toLowerCase(),
            availability: dados.availability.trim() || undefined,
            cep: dados.cep.trim() || undefined,
            observation: dados.observation.trim() || undefined,
          });
        }}
      />
      <Botao
        titulo="Voltar à minha rede"
        secundario
        onPress={() => router.replace('/protegida/guardioes')}
      />
    </TelaPadrao>
  );
}
