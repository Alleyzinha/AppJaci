import { StyleSheet } from 'react-native';
import { colors, fontFamilies, spacing } from '@/styles/tokens';
import { styles as pinStyles } from '../CriarPinScreen/styles';

export const styles = {
  ...pinStyles,
  ...StyleSheet.create({
    errorText: {
      color: colors.authEntry.error,
      fontFamily: fontFamilies.body,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
  }),
};
