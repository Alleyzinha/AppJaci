import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    minHeight: 68,

    backgroundColor: '#EA5C97',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-around',

    paddingHorizontal: spacing.xs,

    paddingBottom: 4,
  },

  containerDark: {
    backgroundColor: '#241D35',
  },

  item: {
    flex: 1,

    minHeight: 58,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 12,
  },

  activeItem: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  label: {
    marginTop: 1,

    color: colors.common.white,

    fontSize: 13,

    textAlign: 'center',
  },
});
