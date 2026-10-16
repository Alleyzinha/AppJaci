import { StyleSheet } from 'react-native';

import { colors, fontFamilies, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authEntry.background,
  },

  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brandName: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -1.4,
  },

  brandPeriod: {
    color: colors.common.magenta,
  },

  backButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  backText: {
    color: colors.authEntry.body,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.sm,
  },

  intro: {
    marginTop: spacing.xl,
  },

  title: {
    maxWidth: 310,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
  },

  description: {
    maxWidth: 320,
    marginTop: spacing.sm,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
  },

  options: {
    marginTop: spacing.lg,
    gap: spacing.sm + 4,
  },

  profileOption: {
    minHeight: 110,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },

  profileOptionUnselected: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: '#DDDCD3',
  },

  profileText: {
    flex: 1,
    minWidth: 0,
  },

  profileTitle: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 18,
    lineHeight: 24,
  },

  profileDescription: {
    marginTop: spacing.xs,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  selectedLabel: {
    marginTop: spacing.sm,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.xs,
  },

  radio: {
    width: 25,
    height: 25,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 2,
  },

  radioUnselected: {
    backgroundColor: colors.common.white,
    borderColor: '#8A9690',
  },

  summary: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.authEntry.selectionSummary,
  },

  summaryDot: {
    width: 8,
    height: 8,
    flexShrink: 0,
    borderRadius: radius.full,
    backgroundColor: colors.authEntry.tagline,
  },

  summaryText: {
    flex: 1,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 19,
  },

  summaryStrong: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodyBold,
  },

  actionSection: {
    marginTop: spacing.lg,
  },

  actionHint: {
    marginTop: spacing.sm,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    lineHeight: 18,
    textAlign: 'center',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.xs,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.78,
  },
});
