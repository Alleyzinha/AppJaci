import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Botao, useCoresTela } from '@/components/ui/TelaPadrao';

export default function BotaoSos({ guardiao, onAcionar, carregando }) {
  const cores = useCoresTela();
  const [pressionado, definirPressionado] = useState(false);
  const [confirmar, definirConfirmar] = useState(false);
  const acionado = useRef(false);
  const titulo = guardiao ? 'LIGAR 190' : 'SOS';
  return (
    <View style={s.area}>
      <View
        style={[
          s.anel,
          !guardiao && s.anelProtegida,
          {
            borderColor: guardiao ? cores.borda : 'rgba(207, 43, 157, 0.34)',
            backgroundColor: guardiao ? cores.superficie : 'rgba(207, 43, 157, 0.06)',
          },
        ]}
      >
        <View
          style={[
            s.anelConteudo,
            !guardiao && s.anelMedioProtegida,
            !guardiao && {
              borderColor: 'rgba(207, 43, 157, 0.45)',
              backgroundColor: 'rgba(207, 43, 157, 0.14)',
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={guardiao ? 'Ligar para a polícia, 190' : 'Registrar alerta SOS'}
            accessibilityHint="Segure por dois segundos. Você também pode usar a opção Acionar sem segurar abaixo."
            accessibilityState={{ disabled: carregando, busy: carregando }}
            disabled={carregando}
            delayLongPress={2000}
            onPressIn={() => {
              acionado.current = false;
              definirPressionado(true);
            }}
            onPressOut={() => definirPressionado(false)}
            onLongPress={() => {
              acionado.current = true;
              onAcionar();
            }}
            onPress={() => {
              if (!acionado.current) definirConfirmar(true);
            }}
            style={({ pressed }) => [
              s.botao,
              !guardiao && s.botaoProtegida,
              { opacity: carregando ? 0.7 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={guardiao ? ['#4E899A', '#223A44'] : ['#F777B6', '#CF2B9D', '#A71968']}
              style={s.gradiente}
            >
              {carregando ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={guardiao ? 'call-outline' : 'shield-checkmark-outline'}
                  size={guardiao ? 36 : 38}
                  color="#FFFFFF"
                />
              )}
              <Text maxFontSizeMultiplier={1.3} style={s.titulo}>
                {carregando ? 'Enviando…' : titulo}
              </Text>
              <Text maxFontSizeMultiplier={1.3} style={s.legenda}>
                {pressionado
                  ? 'Continue segurando…'
                  : guardiao
                    ? 'Segure por 2 segundos'
                    : 'Segure 2s'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
      <Text style={[s.instrucao, { color: cores.texto }]}>
        {guardiao
          ? 'Segure o botão para abrir a ligação para a Polícia Militar.'
          : 'Segure o botão para registrar um alerta para seus guardiões.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Acionar sem segurar"
        disabled={carregando}
        onPress={() => definirConfirmar(!confirmar)}
        style={s.alternativa}
      >
        <Text style={{ color: cores.destaque, fontSize: 13, textDecorationLine: 'underline' }}>
          Acionar sem segurar
        </Text>
      </Pressable>
      {confirmar && (
        <View style={s.confirmacao}>
          <Text style={[s.instrucao, { color: cores.texto }]}>
            {guardiao ? 'Abrir uma ligação para 190?' : 'Registrar um alerta SOS agora?'}
          </Text>
          <Botao
            titulo={guardiao ? 'Confirmar ligação para 190' : 'Confirmar alerta SOS'}
            carregando={carregando}
            onPress={() => {
              definirConfirmar(false);
              onAcionar();
            }}
          />
          <Botao
            titulo="Cancelar"
            secundario
            disabled={carregando}
            onPress={() => definirConfirmar(false)}
          />
        </View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  area: { alignItems: 'center', gap: 8 },
  anel: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anelProtegida: {
    width: 204,
    height: 204,
    borderRadius: 102,
    borderWidth: 2,
    padding: 0,
  },
  anelConteudo: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  anelMedioProtegida: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botao: { width: '100%', height: '100%', borderRadius: 110, overflow: 'hidden' },
  botaoProtegida: { width: 156, height: 156, borderRadius: 78 },
  gradiente: { padding: 10, flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  titulo: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  legenda: { textAlign: 'center', color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  instrucao: { fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 360 },
  alternativa: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  confirmacao: { width: '100%', gap: 10 },
});
