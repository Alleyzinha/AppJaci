import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingBottom: 40,
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
    width: '100%',
    gap: 12,
    marginTop: 10,
  },

  headerGroup: {
    alignItems: 'center',
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },

  subtitulo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },

  pinCircle: {
    width: '18%',
    maxWidth: 52,
    aspectRatio: 1,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinCirclePreenchido: {
    borderColor: '#FFD000',
    backgroundColor: 'rgba(255, 208, 0, 0.15)',
  },

  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFD000',
  },

  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 10,
  },

  keypadKey: {
    width: '31%',
    minHeight: 56,
    paddingVertical: 10,
    margin: '1%',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  keypadKeyVazio: {
    width: '31%',
    minHeight: 56,
    paddingVertical: 10,
    margin: '1%',
  },

  keypadKeyPressionado: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  keypadText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
  },

  keypadDelete: {
    color: '#FFD000',
    fontSize: 28,
    fontWeight: '600',
  },

  footerGroup: {
    width: '100%',
    marginTop: 10,
  },

  continuarButton: {
    width: '100%',
    minHeight: 54,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFD000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continuarButtonPressed: {
    opacity: 0.8,
  },

  continuarButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  continuarButtonText: {
    color: '#341E6D',
    fontSize: 16,
    fontWeight: '700',
  },

  continuarButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
