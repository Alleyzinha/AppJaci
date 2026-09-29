import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '92%',

    minHeight: 54,

    marginBottom: spacing.sm,

    paddingLeft: spacing.sm,

    paddingRight: 6,

    borderWidth: 1.5,

    borderColor: colors.protegida.primary,

    borderRadius: radius.xl,

    backgroundColor: colors.common.white,

    flexDirection: 'row',

    alignItems: 'center',
  },

  input: {
    flex: 1,

    maxHeight: 90,

    paddingHorizontal: spacing.xs,

    paddingVertical: spacing.xs,

    color: '#333333',

    fontSize: 16,
  },

  sendButton: {
    width: 42,

    height: 42,

    borderRadius: 21,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: colors.protegida.primaryDark,
  },

  sendButtonPressed: {
    opacity: 0.8,
  },
});
