import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sectionTitle: { marginTop: 3, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  sectionDescription: { fontSize: 12, lineHeight: 18, marginTop: -8 },
  field: { gap: 6 },
  labelLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: { fontSize: 13, fontWeight: '700' },
  optional: { fontSize: 11, fontWeight: '500' },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: { minHeight: 94, paddingTop: 13, textAlignVertical: 'top' },
  helper: { fontSize: 12, lineHeight: 18 },
  consent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
  },
  consentText: { flex: 1, fontSize: 12, lineHeight: 19 },
  sectionGap: { height: 2 },
});
