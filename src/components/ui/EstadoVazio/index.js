import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCoresTela } from '@/styles/useCoresTela';

export default function EstadoVazio({ icone = 'book-outline', titulo, descricao }) {
  const cores = useCoresTela();
  return (
    <View style={[s.container, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
      <View accessible={false} style={[s.ilustracao, { backgroundColor: cores.suave }]}>
        <Ionicons name={icone} size={36} color={cores.destaque} />
        <View style={[s.detalhe, { backgroundColor: cores.superficie }]}>
          <Ionicons name="heart-outline" size={17} color={cores.destaque} />
        </View>
      </View>
      <Text style={[s.titulo, { color: cores.texto }]}>{titulo}</Text>
      <Text style={[s.descricao, { color: cores.secundario }]}>{descricao}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  container: { borderWidth: 1, borderRadius: 24, padding: 28, alignItems: 'center', gap: 14 },
  ilustracao: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  detalhe: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 19, lineHeight: 26, fontWeight: '600', textAlign: 'center', maxWidth: 340 },
  descricao: { fontSize: 14, lineHeight: 23, textAlign: 'center', maxWidth: 340 },
});
