import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FA',
  },

  containerDark: {
    backgroundColor: '#121C21',
  },

  content: {
    flex: 1,
    backgroundColor: '#F5F9FA',
  },

  contentDark: {
    backgroundColor: '#121C21',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },

  instruction: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: spacing.lg,
    color: '#3A5763',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  instructionDark: {
    color: '#B2CDD6',
  },

  secaoAlertas: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },

  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3E4A',
    marginLeft: 4,
  },

  secaoTituloDark: {
    color: '#E0EEF3',
  },

  alertaCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4E5EC',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  alertaCardDark: {
    backgroundColor: '#1A2930',
    borderColor: '#2D4550',
  },

  alertaCardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  alertaNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3E4A',
  },

  alertaNomeDark: {
    color: '#FFFFFF',
  },

  alertaBadgeAtivo: {
    backgroundColor: '#FFE6EB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  alertaBadgeAtivoTexto: {
    color: '#D61B48',
    fontSize: 11,
    fontWeight: '800',
  },

  alertaBadgeEncerrado: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  alertaBadgeEncerradoTexto: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '700',
  },

  alertaData: {
    fontSize: 12,
    color: '#6E8B97',
  },

  alertaDataDark: {
    color: '#8EAAB5',
  },

  alertaVazio: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2EEF3',
    alignItems: 'center',
  },

  alertaVazioDark: {
    backgroundColor: '#1A2930',
    borderColor: '#2D4550',
  },

  alertaVazioTexto: {
    color: '#6E8B97',
    fontSize: 13,
    textAlign: 'center',
  },

  alertaVazioTextoDark: {
    color: '#8EAAB5',
  },
});
