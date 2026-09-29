import { api } from '@/services/api/api';

export async function listGuardians() {
  const response = await api.get('/guardians');
  return response.data.guardians;
}

export async function createGuardian(data) {
  const response = await api.post('/guardians', data);
  return response.data.guardian;
}

export async function getLinkedProtected() {
  const response = await api.get('/guardians/protected');
  return response.data;
}

export async function deleteGuardian(id) {
  await api.delete(`/guardians/${id}`);
}
