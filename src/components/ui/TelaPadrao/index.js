import FundoDecorativo from '@/components/ui/FundoDecorativo';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtegidaHeader from '@/components/protegida/ProtegidaHeader';
import GuardiaoHeader from '@/components/guardiao/GuardiaoHeader';
import ProtegidaBottomBar from '@/components/protegida/ProtegidaBottomBar';
import GuardiaoBottomBar from '@/components/guardiao/GuardiaoBottomBar';

export { useCoresTela } from '@/styles/useCoresTela';
import { useCoresTela } from '@/styles/useCoresTela';

export function Botao({
  titulo,
  onPress,
  carregando = false,
  secundario = false,
  perigo = false,
  disabled = false,
}) {
  const cores = useCoresTela();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || carregando, busy: carregando }}
      disabled={disabled || carregando}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        {
          backgroundColor: secundario ? cores.suave : perigo ? '#A82442' : cores.botao || '#CF2B9D',
          opacity: pressed || disabled || carregando ? 0.6 : 1,
        },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? cores.destaque : '#FFFFFF'} />
      ) : (
        <Text style={[estilos.botaoTexto, { color: secundario ? cores.destaque : '#FFFFFF' }]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

export function Cartao({ children }) {
  const cores = useCoresTela();
  return (
    <View style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
      {children}
    </View>
  );
}

export function Mensagem({ texto, erro = false }) {
  const cores = useCoresTela();
  if (!texto) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      style={[estilos.mensagem, { color: erro ? cores.perigo : cores.secundario }]}
    >
      {texto}
    </Text>
  );
}

export default function TelaPadrao({
  titulo,
  descricao,
  icone = 'shield-checkmark-outline',
  perfil = 'protegida',
  ativo = 'inicio',
  compacto = false,
  children,
}) {
  const cores = useCoresTela();
  const { width } = useWindowDimensions();
  const guardiao = perfil === 'guardiao';
  const Cabecalho = guardiao ? GuardiaoHeader : ProtegidaHeader;
  const Menu = guardiao ? GuardiaoBottomBar : ProtegidaBottomBar;
  function navegar(item) {
    const destino = { inicio: '', ajustes: 'configuracoes' }[item] ?? item;
    router.replace(`/${perfil}${destino ? `/${destino}` : ''}`);
  }
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[estilos.tela, { backgroundColor: cores.fundo }]}
    >
      <FundoDecorativo perfil={perfil} />
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.rolagem}>
          <View style={estilos.conteudo}>
            <Cabecalho />
            <View
              style={[
                estilos.corpo,
                width < 360 && { paddingHorizontal: 14 },
                compacto && { paddingTop: 12, gap: 12 },
              ]}
            >
              {!compacto && (
                <View style={[estilos.icone, { backgroundColor: cores.suave }]}>
                  <Ionicons name={icone} size={28} color={cores.destaque} />
                </View>
              )}
              <Text accessibilityRole="header" style={[estilos.titulo, { color: cores.texto }]}>
                {titulo}
              </Text>
              <Text style={[estilos.descricao, { color: cores.secundario }]}>{descricao}</Text>
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Menu activeItem={ativo} onItemPress={navegar} />
    </SafeAreaView>
  );
}

export const estilos = StyleSheet.create({
  tela: { flex: 1 },
  rolagem: { flexGrow: 1, paddingBottom: 24 },
  conteudo: { width: '100%', maxWidth: 760, alignSelf: 'center' },
  corpo: { padding: 22, gap: 16 },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  descricao: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  cartao: { padding: 20, borderWidth: 1, borderRadius: 24, gap: 14 },
  botao: {
    padding: 15,
    minHeight: 50,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: { textAlign: 'center', flexShrink: 1, fontSize: 15, fontWeight: '700' },
  mensagem: { fontSize: 14, lineHeight: 22 },
  campo: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, minHeight: 50 },
  rotulo: { fontSize: 14, fontWeight: '700' },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
});
