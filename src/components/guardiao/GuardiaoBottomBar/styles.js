import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    minHeight: 72,

    paddingHorizontal: spacing.xs,

    paddingTop: spacing.xs,

    paddingBottom: spacing.sm,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-around',

    backgroundColor: colors.guardiao.primaryDark,

    borderTopLeftRadius: radius.xl,

    borderTopRightRadius: radius.xl,
  },

  containerDark: {
    backgroundColor: colors.guardiao.dark.bottomBar,
    borderTopWidth: 1,
    borderTopColor: colors.guardiao.dark.border,
  },

  item: {
    flex: 1,

    minHeight: 60,

    marginHorizontal: 2,

    paddingHorizontal: spacing.xs,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.lg,
  },

  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  itemDark: {
    backgroundColor: 'transparent',
  },

  itemActiveDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(121, 210, 220, 0.18)',
  },

  itemPressed: {
    opacity: 0.7,
  },

  label: {
    marginTop: spacing.xs,

    color: 'rgba(255,255,255,0.78)',

    fontSize: typography.xs,

    fontWeight: '600',

    textAlign: 'center',
  },

  labelDark: {
    color: colors.guardiao.dark.textMuted,
  },

  labelActive: {
    color: colors.common.white,

    fontWeight: '900',
  },

  labelActiveDark: {
    color: colors.guardiao.dark.accent,
  },
});
