import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
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
  obterPlanoSeguranca,
  salvarPlanoSeguranca,
} from '@/features/protecao/api/protecao.api';

const VAZIO = { contatos: '', locaisSeguros: '', passos: '' };
const CAMPOS = [
  ['contatos', 'Pessoas e telefones de confiança', 'Ex.: nome, telefone e uma palavra combinada.'],
  [
    'locaisSeguros',
    'Lugares onde posso pedir ajuda',
    'Ex.: casa de alguém confiável, comércio ou serviço público.',
  ],
  [
    'passos',
    'O que fazer se eu precisar de ajuda',
    'Anote passos simples que façam sentido para você.',
  ],
];

export default function PlanoSegurancaScreen() {
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const [plano, definirPlano] = useState(VAZIO);
  const consulta = useQuery({ queryKey: ['plano-seguranca'], queryFn: obterPlanoSeguranca });
  useEffect(() => {
    if (consulta.data) definirPlano({ ...VAZIO, ...consulta.data });
  }, [consulta.data]);
  const salvar = useMutation({
    mutationFn: salvarPlanoSeguranca,
    onSuccess: () => {
      cliente.setQueryData(['plano-seguranca'], plano);
      cliente.invalidateQueries({ queryKey: ['plano-seguranca'] });
    },
  });

  return (
    <TelaPadrao
      titulo="Meu plano de segurança"
      descricao="Organize contatos, lugares seguros e passos que você escolhe seguir. Só você pode editar este plano."
      icone="shield-checkmark-outline"
    >
      <Cartao>
        <Mensagem texto={consulta.isPending && 'Carregando seu plano…'} />
        <Mensagem erro texto={consulta.error && mensagemErro(consulta.error)} />
        {CAMPOS.map(([chave, titulo, dica]) => (
          <React.Fragment key={chave}>
            <Text style={[estilos.rotulo, { color: cores.texto }]}>{titulo}</Text>
            <TextInput
              accessibilityLabel={titulo}
              accessibilityHint={dica}
              multiline
              maxLength={chave === 'passos' ? 5000 : 3000}
              placeholder={dica}
              placeholderTextColor={cores.secundario}
              value={plano[chave]}
              onChangeText={(valor) => {
                definirPlano((atual) => ({ ...atual, [chave]: valor }));
                salvar.reset();
              }}
              textAlignVertical="top"
              style={[
                estilos.campo,
                {
                  color: cores.texto,
                  borderColor: cores.borda,
                  backgroundColor: cores.fundo,
                  minHeight: 105,
                },
              ]}
            />
          </React.Fragment>
        ))}
        <Botao
          titulo="Salvar meu plano"
          carregando={salvar.isPending}
          onPress={() => salvar.mutate(plano)}
        />
        <Mensagem texto={salvar.isSuccess && 'Plano salvo na sua conta.'} />
        <Mensagem erro texto={salvar.error && mensagemErro(salvar.error)} />
      </Cartao>
      <Mensagem texto="Se não for seguro manter estas informações no celular, deixe os campos em branco e use apenas o que for seguro para você." />
    </TelaPadrao>
  );
}
