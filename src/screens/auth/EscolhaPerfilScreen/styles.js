import { StyleSheet } from 'react-native';

import { radius, spacing } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
  },

  content: {
    width: '100%',

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: spacing.xl,
  },

  title: {
    color: '#FFFFFF',

    fontSize: 42,

    lineHeight: 46,

    fontWeight: '900',

    textAlign: 'center',

    textShadowColor: 'rgba(0,0,0,0.15)',

    textShadowOffset: {
      width: 0,

      height: 3,
    },

    textShadowRadius: 5,
  },

  description: {
    marginTop: spacing.xl,

    color: '#FFFFFF',

    fontSize: 25,

    lineHeight: 36,

    fontWeight: '800',

    textAlign: 'center',
  },

  options: {
    width: '100%',

    alignItems: 'center',

    marginTop: spacing.xl,
  },

  confirmButton: {
    width: '78%',

    height: 90,

    marginTop: spacing.md,

    borderRadius: radius.lg,

    backgroundColor: '#FFAA46',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,

      height: 6,
    },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 5,
  },

  confirmButtonPressed: {
    opacity: 0.82,
  },

  confirmText: {
    color: '#FFFFFF',

    fontSize: 25,

    fontWeight: '800',

    textAlign: 'center',
  },

  decorations: {
    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    overflow: 'hidden',
  },

  flowerOne: {
    position: 'absolute',

    top: 8,

    right: 20,

    fontSize: 72,

    color: 'rgba(255,255,255,0.28)',
  },

  flowerTwo: {
    position: 'absolute',

    top: 72,

    right: 24,

    fontSize: 55,

    color: 'rgba(255,190,210,0.30)',
  },

  flowerThree: {
    position: 'absolute',

    top: 20,

    right: 100,

    fontSize: 48,

    color: 'rgba(255,210,220,0.20)',
  },

  watermark: {
    position: 'absolute',

    left: 55,

    bottom: 70,

    color: 'rgba(255,255,255,0.30)',

    fontSize: 110,

    fontWeight: '700',

    fontStyle: 'italic',

    transform: [
      {
        rotate: '-8deg',
      },
    ],
  },
});
