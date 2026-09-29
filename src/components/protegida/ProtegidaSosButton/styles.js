import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 28,
  },

  outerButton: {
    width: 306,

    height: 306,

    borderRadius: 153,

    borderWidth: 12,

    borderColor: '#D884E9',

    backgroundColor: '#F4EEF5',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,

      height: 8,
    },

    shadowOpacity: 0.1,

    shadowRadius: 16,

    elevation: 5,
  },

  outerButtonPressed: {
    opacity: 0.8,
  },

  innerButton: {
    width: 228,

    height: 228,

    borderRadius: 114,

    backgroundColor: '#FFAE45',

    alignItems: 'center',

    justifyContent: 'center',
  },

  title: {
    marginTop: 8,

    color: '#FFFFFF',

    fontSize: 34,

    fontWeight: '900',

    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 4,

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '700',
  },
});
