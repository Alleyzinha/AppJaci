import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '94%',

    minHeight: 86,

    borderWidth: 1,

    borderColor: '#6F8994',

    borderRadius: radius.lg,

    backgroundColor: colors.common.white,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: spacing.sm,

    marginTop: spacing.lg,
  },

  containerDark: {
    backgroundColor: '#252232',
    borderColor: '#514668',
  },

  avatar: {
    width: 48,

    height: 48,

    borderRadius: radius.md,

    backgroundColor: '#FFD05A',

    alignItems: 'center',

    justifyContent: 'center',
  },

  info: {
    flex: 1,

    marginLeft: spacing.sm,
  },

  name: {
    color: '#111111',

    fontSize: 18,

    fontWeight: '800',
  },

  textDark: {
    color: '#FFFFFF',
  },

  details: {
    color: '#222222',

    fontSize: 16,

    marginTop: 2,
  },

  location: {
    color: '#222222',

    fontSize: 16,

    marginTop: 2,
  },

  subtextDark: {
    color: '#C7C0D8',
  },

  actions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,
  },

  actionButton: {
    width: 38,

    height: 50,

    alignItems: 'center',

    justifyContent: 'center',
  },
});
