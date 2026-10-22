export function getFirstName(value) {
  const normalized = String(value || '').trim();
  if (normalized.includes('@')) return '';
  return normalized ? normalized.split(/\s+/)[0] : '';
}
