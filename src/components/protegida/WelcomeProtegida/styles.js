import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },

  shieldContainer: {
    width: 112,
    height: 112,

    padding: 8,

    borderRadius: 20,

    backgroundColor: '#FFFFFF',
    shadowColor: '#CF2B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,

    justifyContent: 'center',

    alignItems: 'center',
  },

  shieldGradient: {
    width: '100%',

    height: '100%',

    borderRadius: 12,

    backgroundColor: '#C82A9B',

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 8,

    borderColor: '#F5C9E8',
  },

  title: {
    marginTop: 18,

    color: colors.common.black,

    fontSize: 30,

    lineHeight: 43,

    fontWeight: '900',

    textAlign: 'center',
  },

  titleBreak: {
    color: colors.common.black,
  },

  heart: {
    color: colors.protegida.primaryDark,

    fontSize: 38,

    fontWeight: '900',
  },

  description: {
    marginTop: 2,

    color: '#555555',

    fontSize: 18,

    lineHeight: 25,

    textAlign: 'center',
  },
});
