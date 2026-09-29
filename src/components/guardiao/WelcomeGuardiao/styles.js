import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',

    paddingHorizontal: spacing.lg,

    marginTop: spacing.sm,

    marginBottom: spacing.md,
  },

  card: {
    width: '100%',

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.lg,

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: radius.xl,

    borderWidth: 1,

    borderColor: '#D8EAED',

    shadowColor: colors.common.black,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,

    shadowRadius: 10,

    elevation: 4,
  },

  cardDark: {
    backgroundColor: colors.guardiao.dark.surface,
    borderColor: colors.guardiao.dark.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  iconContainer: {
    width: 72,
    height: 72,

    borderRadius: radius.full,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(94,23,235,0.09)',

    marginBottom: spacing.md,
  },

  iconContainerDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
  },

  titleContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  title: {
    color: colors.common.text,

    fontSize: typography.xl,

    lineHeight: 30,

    fontWeight: '900',

    textAlign: 'center',

    letterSpacing: 0.4,
  },

  titleDark: {
    color: colors.guardiao.dark.text,
  },

  heart: {
    marginLeft: spacing.sm,

    marginTop: spacing.xs,
  },

  description: {
    maxWidth: 300,

    marginTop: spacing.md,

    color: colors.common.textSecondary,

    fontSize: typography.sm,

    lineHeight: 21,

    fontWeight: '500',

    textAlign: 'center',
  },

  descriptionDark: {
    color: colors.guardiao.dark.textMuted,
  },

  highlight: {
    color: colors.guardiao.primary,

    fontWeight: '900',
  },

  highlightDark: {
    color: colors.guardiao.dark.accent,
  },
});
