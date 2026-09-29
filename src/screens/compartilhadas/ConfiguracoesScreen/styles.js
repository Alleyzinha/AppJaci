import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: { fontSize: 24, fontWeight: '700' },
  nome: { fontSize: 18, fontWeight: '600' },
  legenda: { fontSize: 13, marginTop: 5 },
  secao: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginTop: 12 },
  campo: { gap: 8, marginBottom: 4 },
  preferencias: { gap: 10 },
});
