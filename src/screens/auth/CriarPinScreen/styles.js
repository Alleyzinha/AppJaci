import { StyleSheet } from 'react-native';

import { colors, fontFamilies, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authEntry.background,
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.authEntry.divider,
    backgroundColor: colors.authEntry.surface,
  },

  brandName: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 23,
    lineHeight: 30,
    letterSpacing: -1.2,
  },

  brandPeriod: {
    color: colors.common.magenta,
  },

  profileLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.xs,
  },

  intro: {
    marginTop: spacing.lg,
  },

  title: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 29,
    lineHeight: 35,
    letterSpacing: -0.9,
  },

  subtitle: {
    marginTop: spacing.xs,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
  },

  confirmationHint: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  pinSection: {
    marginTop: spacing.md,
  },

  pinCountRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  pinLabel: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.sm,
  },

  pinCount: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.sm,
  },

  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  pinSlot: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.authEntry.divider,
    borderRadius: 17,
    backgroundColor: colors.authEntry.surface,
  },

  pinDot: {
    width: 13,
    height: 13,
    borderRadius: radius.full,
  },

  keypadContainer: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  keypadKey: {
    width: 76,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.authEntry.surface,
  },

  keypadDelete: {
    width: 76,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },

  keypadSpacer: {
    width: 76,
    height: 58,
  },

  keypadText: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 23,
    lineHeight: 30,
  },

  keypadPressed: {
    backgroundColor: colors.authEntry.selectionSummary,
    transform: [{ scale: 0.96 }],
  },

  keypadDisabled: {
    opacity: 0.55,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },

  pinHint: {
    minHeight: 20,
    marginTop: spacing.sm,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    lineHeight: 18,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.72,
  },
});
