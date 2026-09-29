import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 19,
  },
  introIcone: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitulo: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  introTexto: { fontSize: 12, lineHeight: 18 },
  contatoTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: { fontSize: 20, fontWeight: '800' },
  nome: { fontSize: 17, lineHeight: 22, fontWeight: '700' },
  relacao: { fontSize: 12, lineHeight: 18 },
  acaoContato: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 15,
  },
  acaoContatoTexto: { fontSize: 13, fontWeight: '700' },
});
