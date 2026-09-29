import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    alignItems: 'flex-start',

    marginBottom: spacing.sm,

    paddingHorizontal: spacing.md,
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  bubble: {
    maxWidth: '80%',

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

    borderRadius: radius.lg,
  },

  attendantBubble: {
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 6,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,

      height: 3,
    },

    shadowOpacity: 0.07,

    shadowRadius: 7,

    elevation: 2,
  },

  attendantBubbleDark: {
    backgroundColor: '#2A2638',
  },

  userBubble: {
    backgroundColor: colors.protegida.primaryDark,

    borderTopRightRadius: 6,
  },

  message: {
    fontSize: typography.md,

    lineHeight: 22,
  },

  attendantMessage: {
    color: '#333333',
  },

  attendantMessageDark: {
    color: '#F5F1FF',
  },

  userMessage: {
    color: colors.common.white,
  },

  time: {
    marginTop: 3,

    color: '#888888',

    fontSize: 11,

    alignSelf: 'flex-end',
  },

  userTime: {
    color: 'rgba(255,255,255,0.75)',
  },
});
