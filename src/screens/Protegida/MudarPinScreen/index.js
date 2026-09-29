import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import TelaPadrao, {
  Botao,
  Cartao,
  Mensagem,
  estilos,
  useCoresTela,
} from '@/components/ui/TelaPadrao';
import { mudarPin, solicitarMudancaPin } from '@/features/auth/api/auth.api';
import { mensagemErro } from '@/features/protecao/api/protecao.api';

export default function MudarPinScreen() {
  const cores = useCoresTela();
  const [codigo, definirCodigo] = useState('');
  const [pin, definirPin] = useState('');
  const [pinConfirmar, definirPinConfirmar] = useState('');
  const [erroLocal, definirErroLocal] = useState('');

  const solicitar = useMutation({ mutationFn: solicitarMudancaPin });
  const trocar = useMutation({
    mutationFn: () => mudarPin({ code: codigo, pin }),
    onSuccess: () => {
      router.back();
    },
  });

  const pinValido = /^\d{4}$/.test(pin);
  const confirmacaoValida = pin === pinConfirmar;
  const podeSalvar = /^\d{6}$/.test(codigo) && pinValido && confirmacaoValida;

  return (
    <TelaPadrao
      titulo="Mudar PIN"
      descricao="Enviamos um código para seu e-mail para autorizar a troca."
      icone="key-outline"
      ativo="ajustes"
    >
      <Cartao>
        <Mensagem
          texto={
            solicitar.isSuccess ? 'Código enviado! Verifique seu e-mail (olhe também o spam).' : ''
          }
        />
        <Mensagem erro texto={(solicitar.error && mensagemErro(solicitar.error)) || ''} />
        {!solicitar.isSuccess ? (
          <Botao
            titulo="Enviar código por e-mail"
            carregando={solicitar.isPending}
            onPress={() => {
              trocar.reset();
              solicitar.mutate();
            }}
          />
        ) : null}
      </Cartao>

      {solicitar.isSuccess && (
        <Cartao>
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Código de 6 dígitos</Text>
          <TextInput
            accessibilityLabel="Código recebido por e-mail"
            value={codigo}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(valor) => definirCodigo(valor.replace(/\D/g, ''))}
            style={[
              estilos.campo,
              { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
            ]}
          />
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Novo PIN (4 dígitos)</Text>
          <TextInput
            accessibilityLabel="Novo PIN"
            value={pin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            onChangeText={(valor) => definirPin(valor.replace(/\D/g, ''))}
            style={[
              estilos.campo,
              { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
            ]}
          />
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Confirme o novo PIN</Text>
          <TextInput
            accessibilityLabel="Confirmação do novo PIN"
            value={pinConfirmar}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            onChangeText={(valor) => definirPinConfirmar(valor.replace(/\D/g, ''))}
            style={[
              estilos.campo,
              { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.fundo },
            ]}
          />
          <Mensagem
            erro
            texto={pinConfirmar && !confirmacaoValida ? 'Os PINs não coincidem.' : erroLocal || ''}
          />
          <Botao
            titulo="Salvar novo PIN"
            disabled={!podeSalvar}
            carregando={trocar.isPending}
            onPress={() => trocar.mutate()}
          />
          <Mensagem erro texto={(trocar.error && mensagemErro(trocar.error)) || ''} />
        </Cartao>
      )}
    </TelaPadrao>
  );
}
