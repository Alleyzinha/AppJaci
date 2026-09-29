import { StyleSheet } from 'react-native';

import { colors } from '@/styles/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFF5F8',
  },

  content: {
    flex: 1,

    backgroundColor: '#FFF5F8',
  },

  containerDark: {
    backgroundColor: '#17151F',
  },

  contentDark: {
    backgroundColor: '#17151F',
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
