import { StyleSheet } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.authEntry.background,
  },

  desktopContent: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 24 },
  desktopIntro: { marginTop: 64 },
  desktopHeadline: { fontSize: 42, lineHeight: 49, maxWidth: 380 },
  eyebrow: {
    color: colors.protegida.authAccentDark,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24 },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4E9EB',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  featureText: {
    color: colors.protegida.authAccentDark,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md + spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },

  brandRow: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  brandName: {
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 25,
    letterSpacing: -1.5,
  },

  brandPeriod: {
    color: colors.common.magenta,
  },

  brandDivider: {
    width: 32,
    height: 2,
    marginLeft: 'auto',
    borderRadius: 1,
    backgroundColor: colors.common.magenta,
  },

  hero: {
    width: '100%',
    marginTop: 12,
    overflow: 'hidden',
    borderTopLeftRadius: 72,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 48,
    borderBottomLeftRadius: 24,
    backgroundColor: colors.authEntry.heroPlaceholder,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 80,
  },

  intro: {
    marginTop: spacing.md + 4,
  },

  headline: {
    maxWidth: 330,
    color: colors.authEntry.heading,
    fontFamily: fontFamilies.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1.1,
  },

  description: {
    maxWidth: 330,
    marginTop: spacing.sm,
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 23,
  },

  actions: {
    width: '100%',
    marginTop: spacing.lg,
  },

  loginPrompt: {
    minHeight: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },

  loginPromptText: {
    color: colors.authEntry.body,
    fontFamily: fontFamilies.body,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  loginLink: {
    minHeight: 44,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    color: colors.authEntry.loginLink,
    fontFamily: fontFamilies.bodyBold,
    fontSize: typography.sm,
    lineHeight: 20,
    textDecorationLine: 'underline',
    textDecorationColor: colors.authEntry.loginLink,
  },

  footerMotto: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
    color: colors.authEntry.tagline,
    fontFamily: fontFamilies.body,
    fontSize: typography.xs,
    textAlign: 'center',
  },
});
