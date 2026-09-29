import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',

    paddingHorizontal: spacing.lg,

    marginBottom: spacing.lg,
  },

  card: {
    width: '100%',

    padding: spacing.md,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#EAF5F6',

    borderWidth: 1.5,

    borderColor: '#A9D5DC',

    borderRadius: radius.lg,
  },

  cardDark: {
    backgroundColor: colors.guardiao.dark.surface,
    borderColor: colors.guardiao.dark.border,
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: radius.full,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.common.white,
  },

  iconContainerDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
  },

  content: {
    flex: 1,

    marginLeft: spacing.sm,
  },

  title: {
    color: colors.common.text,

    fontSize: typography.sm,

    lineHeight: 18,

    fontWeight: '800',
  },

  titleDark: {
    color: colors.guardiao.dark.text,
  },

  description: {
    marginTop: spacing.xs,

    color: colors.common.textSecondary,

    fontSize: typography.xs,

    lineHeight: 16,
  },

  descriptionDark: {
    color: colors.guardiao.dark.textMuted,
  },

  callButton: {
    minWidth: 82,

    paddingHorizontal: spacing.sm,

    paddingVertical: spacing.sm,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: spacing.xs,

    backgroundColor: colors.guardiao.primary,

    borderRadius: radius.md,
  },

  callButtonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  callText: {
    color: colors.common.white,

    fontSize: typography.xs,

    fontWeight: '900',
  },
});
