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
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -1.5,
  },

  brandPeriod: {
    color: colors.common.magenta,
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingTop: spacing.xl,
  },

  title: {
    maxWidth: 330,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.2,
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 23,
  },

  profileContext: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.authEntry.divider,
  },

  contextLabel: {
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    lineHeight: 18,
  },

  contextValue: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    lineHeight: 22,
  },

  textAction: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },

  textActionLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.xs,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },

  form: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },

  inputContainer: {
    gap: spacing.xs,
  },

  label: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  passwordLabelRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  recoveryAction: {
    minHeight: 44,
    justifyContent: 'center',
  },

  inputWrapper: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.authEntry.inputBorder,
    borderRadius: radius.md,
    backgroundColor: colors.common.white,
  },

  inputWrapperFocused: {
    borderColor: colors.protegida.authAccent,
    borderWidth: 2,
  },

  inputWrapperError: {
    borderColor: colors.authEntry.error,
    borderWidth: 2,
  },

  input: {
    minWidth: 0,
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    includeFontPadding: false,
  },

  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },

  errorText: {
    marginTop: spacing.xs,
    color: colors.authEntry.error,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: typography.xs,
    lineHeight: 18,
  },

  signupPrompt: {
    minHeight: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  signupPromptText: {
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
  },

  signupLinkButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },

  signupLink: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: typography.sm,
    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.72,
  },
});
