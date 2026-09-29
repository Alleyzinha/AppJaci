import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  /*
   * ========================================
   * CARD PADRÃO
   * ========================================
   */

  container: {
    width: '92%',

    minHeight: 166,

    marginBottom: spacing.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.md,

    borderRadius: radius.xl,

    backgroundColor: colors.common.white,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.04,

    shadowRadius: 12,

    elevation: 2,
  },

  containerPressed: {
    opacity: 0.85,
  },

  topRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',
  },

  iconContainer: {
    width: 50,

    height: 50,

    borderRadius: radius.full,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: colors.guardiao.primary,
  },

  content: {
    flex: 1,

    marginLeft: spacing.sm,

    paddingRight: spacing.xs,
  },

  category: {
    color: colors.guardiao.primary,

    fontSize: typography.md,

    fontWeight: '500',

    marginBottom: spacing.xs,
  },

  title: {
    color: colors.common.black,

    fontSize: 18,

    lineHeight: 25,

    fontWeight: '600',
  },

  arrow: {
    marginTop: 1,
  },

  description: {
    marginTop: spacing.sm,

    paddingHorizontal: spacing.xs,

    color: '#555555',

    fontSize: 14,

    lineHeight: 22,
  },

  /*
   * ========================================
   * VARIANTE PROFILE
   * ========================================
   */

  profileContainer: {
    width: '82%',

    height: 106,

    marginBottom: spacing.md,

    paddingHorizontal: spacing.md,

    borderRadius: radius.xl,

    backgroundColor: 'rgba(255,255,255,0.35)',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,

    shadowRadius: 8,

    elevation: 3,
  },

  profileContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.55)',

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.85)',
  },

  profileContainerPressed: {
    opacity: 0.82,
  },

  profileIconContainer: {
    width: 58,

    height: 58,

    borderRadius: radius.md,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: colors.guardiao.primary,
  },

  profileTitle: {
    flex: 1,

    marginLeft: spacing.sm,

    color: colors.common.white,

    fontSize: 32,

    fontWeight: '900',

    textAlign: 'center',

    letterSpacing: 0.5,
  },
});
