export function getFirstName(value) {
  const normalized = String(value || '').trim();
  return normalized ? normalized.split(/\s+/)[0] : '';
}
