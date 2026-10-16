import { StyleSheet } from 'react-native';

import { colors, fontFamilies, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authEntry.background,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: spacing.md + spacing.xs,
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
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -1.2,
  },

  brandPeriod: {
    color: colors.common.magenta,
  },

  intro: {
    marginTop: spacing.md,
  },

  profileLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  title: {
    marginTop: spacing.xs,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.8,
  },

  description: {
    maxWidth: 340,
    marginTop: spacing.sm,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
    lineHeight: 21,
  },

  loginPrompt: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  loginPromptText: {
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
  },

  loginLinkButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },

  loginLink: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: typography.sm,
    textDecorationLine: 'underline',
  },

  form: {
    marginTop: spacing.md,
    gap: spacing.md,
  },

  contactGroup: {
    gap: spacing.sm + 4,
  },

  passwordGroup: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.authEntry.divider,
  },

  groupTitle: {
    marginBottom: spacing.xs,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    lineHeight: 21,
  },

  inputContainer: {
    gap: 6,
  },

  label: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 13,
    lineHeight: 18,
  },

  inputWrapper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.authEntry.inputBorder,
    borderRadius: 11,
    backgroundColor: colors.common.white,
  },

  inputWrapperError: {
    borderWidth: 2,
    borderColor: colors.authEntry.error,
  },

  input: {
    minWidth: 0,
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    includeFontPadding: false,
  },

  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    marginTop: 2,
    color: colors.authEntry.error,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.xs,
    lineHeight: 18,
  },

  successText: {
    marginTop: 2,
    color: colors.common.success,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.xs,
    lineHeight: 18,
  },

  passwordRequirements: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
  },

  passwordRequirementsTitle: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 13,
    lineHeight: 19,
  },

  passwordRequirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
  },

  passwordRule: {
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },

  passwordRuleText: {
    flex: 1,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 18,
  },

  passwordRuleTextMet: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
  },

  serverError: {
    color: colors.authEntry.error,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  nextStep: {
    marginTop: -spacing.sm,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    lineHeight: 18,
    textAlign: 'center',
  },

  footer: {
    marginTop: spacing.lg,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.72,
  },
});
