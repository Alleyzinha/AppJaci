import { StyleSheet } from 'react-native';

import { radius } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 60,

    borderRadius: radius.lg,

    overflow: 'hidden',

    elevation: 4,

    shadowOpacity: 0.15,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  gradient: {
    flex: 1,

    minHeight: 60,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  text: {
    textAlign: 'center',
    flexShrink: 1,
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '800',
  },

  pressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  disabled: {
    opacity: 0.6,
  },
});
