import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingBottom: 40,
    justifyContent: 'center',
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
    maxWidth: 520,
    alignSelf: 'center',
    paddingTop: 24,
    paddingBottom: 12,
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
    maxWidth: 520,
    alignSelf: 'center',
    gap: 20,
    marginTop: 0,
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: 'rgba(29, 16, 67, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },

  subtitulo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
    lineHeight: 20,
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

  errorText: {
    color: '#FFD6D6',
    fontSize: 13,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 10,
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

  eyeIcon: {
    padding: 6,
  },

  footerGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
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
});
