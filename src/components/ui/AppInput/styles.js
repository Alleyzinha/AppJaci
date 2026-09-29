import { StyleSheet } from 'react-native';

import { colors, radius } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 9,
  },

  label: {
    marginLeft: 6,
    marginBottom: 6,

    color: colors.common.white,

    fontSize: 13,
    fontWeight: '500',

    letterSpacing: 1.2,
  },

  input: {
    width: '100%',
    minHeight: 58,
    paddingVertical: 14,

    paddingHorizontal: 12,

    borderRadius: radius.lg,

    backgroundColor: colors.protegida.inputBackground,

    color: colors.common.white,

    fontSize: 15,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  inputError: {
    borderColor: colors.common.error,
  },

  error: {
    marginTop: 3,
    marginLeft: 6,

    color: colors.common.white,

    fontSize: 11,
  },
});
