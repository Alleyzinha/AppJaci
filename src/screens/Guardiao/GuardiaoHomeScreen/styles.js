import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F8F9',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#F2F8F9',
  },

  content: {
    flex: 1,
    backgroundColor: '#F2F8F9',
  },

  containerDark: {
    backgroundColor: colors.guardiao.dark.page,
  },

  safeAreaDark: {
    backgroundColor: colors.guardiao.dark.page,
  },

  contentDark: {
    backgroundColor: colors.guardiao.dark.page,
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 24,
  },

  /*
   * CARD DA PROTEGIDA
   */

  protegidaCard: {
    width: '100%',
    minHeight: 104,

    marginTop: spacing.md,
    marginBottom: spacing.md,

    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,

    borderRadius: radius.lg,

    backgroundColor: colors.common.white,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,

    elevation: 1,
  },

  protegidaCardDark: {
    backgroundColor: colors.guardiao.dark.surface,
    borderWidth: 1,
    borderColor: colors.guardiao.dark.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  protegidaCardPressed: {
    opacity: 0.88,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  protegidaIconWrapper: {
    width: 48,
    height: 48,

    borderRadius: radius.md,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.guardiao.primaryDark,
  },

  protegidaInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.sm,
  },

  protegidaLabel: {
    color: colors.guardiao.primaryDark,

    fontSize: typography.xs,

    fontWeight: '800',

    letterSpacing: 0.7,
  },

  protegidaLabelDark: {
    color: colors.guardiao.dark.accent,
  },

  protegidaName: {
    flexShrink: 1,
    marginTop: 2,
    maxWidth: '100%',

    color: colors.guardiao.text,

    fontSize: typography.md,
    lineHeight: 20,

    fontWeight: '600',

    letterSpacing: 0.5,
  },

  protegidaNameDark: {
    color: colors.guardiao.dark.text,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 3,
  },

  statusDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: '#4CAF50',

    marginRight: 6,
  },

  statusText: {
    color: colors.guardiao.textSecondary,

    fontSize: typography.sm,

    fontWeight: '600',
  },

  statusTextDark: {
    color: colors.guardiao.dark.textMuted,
  },

  protegidaArrow: {
    width: 38,
    height: 38,

    borderRadius: radius.full,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(34,58,68,0.08)',

    marginLeft: spacing.xs,
  },

  protegidaArrowDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
  },

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.55)',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 24,
  },

  modalContainer: {
    width: '100%',

    maxWidth: 420,

    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.2,
    shadowRadius: 18,

    elevation: 10,
  },

  modalContainerDark: {
    backgroundColor: colors.guardiao.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.guardiao.dark.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  modalHeader: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  modalIconWrapper: {
    width: 58,
    height: 58,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#4E899A',
  },

  closeButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F2F2F2',
  },

  modalTitle: {
    marginTop: 20,

    color: '#4E899A',

    fontSize: 14,

    fontWeight: '800',

    letterSpacing: 0.8,
  },

  modalTitleDark: {
    color: colors.guardiao.dark.accent,
  },

  modalName: {
    marginTop: 4,

    color: '#223A44',

    fontSize: 28,

    fontWeight: '600',
  },

  modalNameDark: {
    color: colors.guardiao.dark.text,
  },

  infoItem: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 22,
  },

  infoIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E8F4F7',
  },

  infoIconDark: {
    backgroundColor: colors.guardiao.dark.accentSoft,
  },

  infoContent: {
    flex: 1,

    marginLeft: 12,
  },

  infoLabel: {
    color: '#7A7A7A',

    fontSize: 11,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  infoLabelDark: {
    color: colors.guardiao.dark.textMuted,
  },

  infoValue: {
    marginTop: 3,

    color: '#223A44',

    fontSize: 15,

    fontWeight: '600',
  },

  infoValueDark: {
    color: colors.guardiao.dark.text,
  },

  modalStatus: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 24,

    paddingVertical: 13,
    paddingHorizontal: 15,

    borderRadius: 16,

    backgroundColor: '#EAF7EF',
  },

  modalStatusDark: {
    backgroundColor: colors.guardiao.dark.successSoft,
  },

  modalStatusText: {
    marginLeft: 10,

    color: '#3E9B69',

    fontSize: 14,

    fontWeight: '800',
  },

  modalStatusTextDark: {
    color: colors.guardiao.dark.success,
  },

  modalButton: {
    width: '100%',

    height: 52,

    marginTop: 24,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#4E899A',
  },

  modalButtonPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  modalButtonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '600',
  },
});
