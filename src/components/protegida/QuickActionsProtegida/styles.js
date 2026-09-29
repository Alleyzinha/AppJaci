import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    maxWidth: 560,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
  },

  action: {
    width: '49%',

    minHeight: 62,

    marginBottom: spacing.sm,

    borderRadius: radius.lg,

    borderWidth: 1.5,

    borderColor: '#F9D5E5',

    backgroundColor: '#FFFFFF',
    shadowColor: '#1B1230',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,
  },

  actionPressed: {
    opacity: 0.8,
  },

  iconContainer: {
    width: 36,

    height: 36,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#CF2B9D',
  },

  label: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,

    marginLeft: spacing.xs,

    color: colors.protegida.primaryDark,

    fontSize: typography.sm,

    fontWeight: '800',

    textAlign: 'center',
  },
});
