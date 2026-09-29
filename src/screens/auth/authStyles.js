import { StyleSheet } from 'react-native';

/**
 * Tema visual unificado das telas
 * de autenticação (estilo rascunho):
 * gradiente rosa/roxo, glows, step
 * badge e inputs translúcidos.
 */

const base = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 60,
    justifyContent: 'flex-start',
  },

  glowTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },

  glowBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 72, 199, 0.25)',
  },

  topNavigation: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  pressed: {
    opacity: 0.8,
  },

  mainWrapper: {
    maxWidth: 460,
    alignSelf: 'center',
    width: '100%',
    gap: 24,
    marginTop: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepHeader: {
    alignItems: 'center',
    gap: 8,
  },

  stepBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  stepBarBackground: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },

  stepBarFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#FFD000',
    borderRadius: 2,
  },

  stepBarFillFull: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD000',
    borderRadius: 2,
  },

  headerGroup: {
    alignItems: 'center',
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitulo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  emailDestaque: {
    color: '#FFD000',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
  },

  cardsGroup: {
    width: '100%',
    gap: 14,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },

  cardSelecionado: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: '#FFD000',
    borderWidth: 2,
    elevation: 0,
  },

  cardPressionado: {
    opacity: 0.9,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 1,
  },

  cardSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },

  checkArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  footerGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },

  formGroup: {
    width: '100%',
    gap: 14,
  },

  inputContainer: {
    gap: 6,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 10,
  },

  inputError: {
    borderColor: '#FF5A5A',
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    minWidth: 0,
    paddingVertical: 12,
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },

  inputCodigo: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 8,
    textAlign: 'center',
  },

  eyeIcon: {
    padding: 6,
  },

  feedbackText: {
    fontSize: 13,
    marginLeft: 4,
  },

  validText: {
    color: '#7DFFA0',
  },

  invalidText: {
    color: '#FFB3B3',
  },

  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  buttonContainer: {
    width: '100%',
  },

  cadastroLink: {
    paddingVertical: 6,
  },

  cadastroText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },

  cadastroBold: {
    color: '#FFD000',
    fontWeight: '700',
  },

  reenviarLink: {
    paddingVertical: 6,
  },

  reenviarText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },

  reenviarBold: {
    color: '#FFD000',
    fontWeight: '700',
  },
});

export const authStyles = base;
