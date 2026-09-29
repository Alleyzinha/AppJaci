import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCoresTela } from '@/styles/useCoresTela';
import { styles } from './styles';

export default function ProtegidaEmergencyCard({ onPress }) {
  const cores = useCoresTela();

  return (
    <View
      accessibilityRole="summary"
      style={[styles.container, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
    >
      <View style={styles.cabecalho}>
        <View style={[styles.icone, { backgroundColor: cores.suave }]}>
          <Ionicons name="people-outline" size={23} color={cores.destaque} />
        </View>
        <View style={styles.textos}>
          <Text style={[styles.titulo, { color: cores.texto }]}>Apoio e rede de confiança</Text>
          <Text style={[styles.descricao, { color: cores.secundario }]}>
            Pequenos combinados podem ajudar você a se sentir mais segura.
          </Text>
        </View>
      </View>
      <View style={[styles.divisor, { backgroundColor: cores.borda }]} />
      <View style={styles.orientacao}>
        <Ionicons name="chatbubble-ellipses-outline" size={17} color={cores.destaque} />
        <Text style={[styles.orientacaoTexto, { color: cores.texto }]}>
          Combine com alguém de confiança uma forma segura de pedir ajuda.
        </Text>
      </View>
      <View style={styles.orientacao}>
        <Ionicons name="shield-checkmark-outline" size={17} color={cores.destaque} />
        <Text style={[styles.orientacaoTexto, { color: cores.texto }]}>
          Em perigo imediato, procure um local seguro e ligue 190.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver orientações de emergência"
        onPress={onPress}
        style={({ pressed }) => [styles.link, { opacity: pressed ? 0.65 : 1 }]}
      >
        <Text style={[styles.linkTexto, { color: cores.destaque }]}>Ver orientações de ajuda</Text>
        <Ionicons name="arrow-forward" size={16} color={cores.destaque} />
      </Pressable>
    </View>
  );
}
