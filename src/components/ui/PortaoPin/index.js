import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verificarPin } from '@/features/auth/api/auth.api';
import { mensagemErro } from '@/features/protecao/api/protecao.api';
import { useCoresTela } from '@/styles/useCoresTela';

import { SafeAreaView } from 'react-native-safe-area-context';

const PIN_TAMANHO = 4;

/** Valida o PIN da conta antes de abrir o Diário Seguro. */
export default function PortaoPin({ liberado, onLiberar }) {
  const cores = useCoresTela();
  const [digits, definirDigits] = useState([]);
  const [erro, definirErro] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const [pronto, definirPronto] = useState(false);
  const validando = React.useRef(false);
  const ativo = React.useRef(true);

  React.useEffect(() => {
    ativo.current = true;
    return () => {
      ativo.current = false;
    };
  }, []);

  if (liberado || pronto) return null;

  function digitar(digito) {
    if (validando.current || digits.length >= PIN_TAMANHO) return;
    const novo = [...digits, digito];
    definirDigits(novo);
    definirErro('');
    if (novo.length === PIN_TAMANHO) validar(novo.join(''));
  }

  function apagar() {
    if (validando.current) return;
    definirDigits(digits.slice(0, -1));
    definirErro('');
  }

  async function validar(pin) {
    if (validando.current) return;
    validando.current = true;
    definirCarregando(true);
    try {
      await verificarPin({ pin });
      if (!ativo.current) return;
      definirPronto(true);
      onLiberar?.();
    } catch (falha) {
      if (ativo.current) definirErro(mensagemErro(falha));
    } finally {
      validando.current = false;
      if (ativo.current) {
        definirDigits([]);
        definirCarregando(false);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.fundo, { backgroundColor: cores.fundo }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.rolagem}>
        <View
          style={[styles.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
        >
          <View style={[styles.icone, { backgroundColor: cores.suave }]}>
            <Ionicons name="lock-closed-outline" size={26} color={cores.destaque} />
          </View>
          <Text style={[styles.titulo, { color: cores.texto }]}>
            {carregando ? 'Aguarde…' : 'Digite seu PIN para abrir o Diário'}
          </Text>
          <View style={styles.circulos}>
            {Array.from({ length: PIN_TAMANHO }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.circulo,
                  { borderColor: erro ? cores.perigo : cores.destaque },
                  i < digits.length && { backgroundColor: cores.destaque },
                ]}
              />
            ))}
          </View>
          {erro ? (
            <Text style={[styles.erro, { color: cores.perigo }]}>{erro}</Text>
          ) : (
            <Text style={[styles.erro, { color: cores.secundario }]}>
              Use o mesmo PIN criado no cadastro.
            </Text>
          )}
          <View style={styles.teclado}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['', '0', 'del'],
            ].map((linha, li) => (
              <View key={li} style={styles.linha}>
                {linha.map((tecla, ti) =>
                  tecla === '' ? (
                    <View key={ti} style={styles.teclaOca} />
                  ) : tecla === 'del' ? (
                    <Pressable
                      key={ti}
                      accessibilityRole="button"
                      accessibilityLabel="Apagar dígito"
                      disabled={carregando}
                      onPress={apagar}
                      style={({ pressed }) => [
                        styles.tecla,
                        { backgroundColor: cores.superficie, opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Ionicons name="backspace-outline" size={24} color={cores.texto} />
                    </Pressable>
                  ) : (
                    <Pressable
                      key={ti}
                      accessibilityRole="button"
                      accessibilityLabel={`Dígito ${tecla}`}
                      disabled={carregando}
                      onPress={() => digitar(tecla)}
                      style={({ pressed }) => [
                        styles.tecla,
                        { backgroundColor: cores.superficie, opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Text style={[styles.teclaTexto, { color: cores.texto }]}>{tecla}</Text>
                    </Pressable>
                  ),
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  rolagem: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cartao: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  circulos: { flexDirection: 'row', gap: 14, marginTop: 4 },
  circulo: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  erro: { fontSize: 12, minHeight: 16, textAlign: 'center' },
  teclado: { width: '100%', marginTop: 8, gap: 10 },
  linha: { flexDirection: 'row', gap: 8 },
  tecla: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teclaOca: { flex: 1, minHeight: 52 },
  teclaTexto: { fontSize: 22, fontWeight: '700' },
});
