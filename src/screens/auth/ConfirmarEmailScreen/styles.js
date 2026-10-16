import { StyleSheet } from 'react-native';
import { colors, fontFamilies, spacing, radius } from '@/styles/tokens';
import { styles as pinStyles } from '../CriarPinScreen/styles';

export const styles = {
  ...pinStyles,
  ...StyleSheet.create({
    email: {
      fontFamily: fontFamilies.bodySemibold,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing.xs,
    },
    codeSection: { marginTop: spacing.lg, gap: spacing.sm },
    codeInput: {
      width: '100%',
      minHeight: 64,
      borderWidth: 1,
      borderRadius: radius.lg,
      backgroundColor: colors.authEntry.surface,
      color: colors.authEntry.heading,
      fontFamily: fontFamilies.bodySemibold,
      fontSize: 24,
      letterSpacing: 8,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    feedback: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20 },
    errorText: {
      color: colors.authEntry.error,
      fontFamily: fontFamilies.body,
      fontSize: 14,
      lineHeight: 20,
    },
    resend: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    resendText: {
      color: colors.authEntry.body,
      fontFamily: fontFamilies.body,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    resendEmphasis: { fontFamily: fontFamilies.bodyBold },
  }),
};
