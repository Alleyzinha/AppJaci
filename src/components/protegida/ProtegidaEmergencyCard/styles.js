import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
  },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icone: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, minWidth: 0, gap: spacing.xs },
  titulo: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  descricao: { fontSize: 12, lineHeight: 18 },
  divisor: { height: 1, width: '100%' },
  orientacao: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  orientacaoTexto: { flex: 1, minWidth: 0, fontSize: 12, lineHeight: 18 },
  link: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  linkTexto: { fontSize: 13, fontWeight: '700' },
});
