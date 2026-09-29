import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',

    paddingHorizontal: 0,

    marginBottom: spacing.lg,
  },

  sectionTitle: {
    marginBottom: spacing.sm,

    color: colors.common.text,

    fontSize: typography.sm,

    fontWeight: '900',

    letterSpacing: 1,

    textAlign: 'left',
  },

  sectionTitleDark: {
    color: colors.guardiao.dark.accent,
  },

  grid: {
    width: '100%',

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    gap: spacing.xs,
  },

  action: {
    width: '49%',

    minHeight: 82,

    paddingHorizontal: 10,

    paddingVertical: spacing.sm,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1.5,

    borderColor: '#CFE3E7',

    borderRadius: radius.lg,

    backgroundColor: '#FFFFFF',
    shadowColor: '#223A44',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  actionDark: {
    borderColor: colors.guardiao.dark.border,
    backgroundColor: colors.guardiao.dark.surface,
    shadowOpacity: 0,
    elevation: 0,
  },

  actionPressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  iconContainer: {
    width: 40,
    height: 40,

    flexShrink: 0,

    borderRadius: radius.md,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(94,23,235,0.08)',
  },

  iconContainerDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
  },

  actionText: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,

    marginLeft: spacing.sm,

    color: colors.guardiao.primary,

    fontSize: typography.sm,

    lineHeight: 18,

    fontWeight: '800',
  },

  actionTextDark: {
    color: colors.guardiao.dark.text,
  },
});
