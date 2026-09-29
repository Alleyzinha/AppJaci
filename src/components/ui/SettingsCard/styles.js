import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 84,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 15, fontWeight: '600', lineHeight: 21 },
  description: { fontSize: 12, lineHeight: 18, marginTop: 3 },
});
