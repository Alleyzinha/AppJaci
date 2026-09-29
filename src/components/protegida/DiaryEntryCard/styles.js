import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '86%',

    minHeight: 90,

    marginBottom: spacing.md,

    borderRadius: radius.lg,

    backgroundColor: colors.common.white,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: spacing.sm,

    paddingVertical: spacing.sm,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,

      height: 7,
    },

    shadowOpacity: 0.12,

    shadowRadius: 12,

    elevation: 5,
  },

  iconContainer: {
    width: 50,

    height: 50,

    borderRadius: radius.md,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#F17CC7',
  },

  content: {
    flex: 1,

    marginLeft: spacing.sm,

    paddingRight: spacing.xs,
  },

  title: {
    color: '#222222',

    fontSize: 15,

    lineHeight: 20,

    fontWeight: '500',
  },

  description: {
    marginTop: 2,

    color: '#222222',

    fontSize: 14,

    lineHeight: 19,
  },

  date: {
    marginTop: 2,

    color: '#777777',

    fontSize: typography.sm,

    textAlign: 'center',
  },

  deleteButton: {
    width: 32,

    height: 40,

    alignItems: 'center',

    justifyContent: 'center',

    alignSelf: 'flex-start',
  },
});
