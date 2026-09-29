import { StyleSheet } from 'react-native';

import { radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    flexDirection: 'row',

    justifyContent: 'space-between',

    paddingHorizontal: spacing.sm,

    marginTop: 28,
  },

  card: {
    flex: 1,

    minHeight: 122,

    marginHorizontal: 4,

    borderRadius: radius.lg,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: spacing.sm,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,

      height: 7,
    },

    shadowOpacity: 0.1,

    shadowRadius: 14,

    elevation: 5,
  },

  cardPressed: {
    opacity: 0.82,
  },

  iconContainer: {
    width: 62,

    height: 62,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 6,
  },

  title: {
    color: '#333333',

    fontSize: typography.md,

    fontWeight: '600',

    textAlign: 'center',
  },

  subtitle: {
    marginTop: 1,

    color: '#777777',

    fontSize: typography.sm,

    textAlign: 'center',
  },
});
