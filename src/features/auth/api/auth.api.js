import { api } from '@/services/api/api';

export async function register(data) {
  const response = await api.post('/auth/register', data);

  return response.data;
}

export async function login(data) {
  const response = await api.post('/auth/login', data);

  return response.data;
}

export async function verifyEmail(data) {
  const response = await api.post('/auth/email/verify', data);

  return response.data;
}

export async function setupPin(data) {
  const response = await api.post('/auth/pin/setup', data);
  return response.data;
}

export async function solicitarMudancaPin() {
  const response = await api.post('/auth/pin/change/request');
  return response.data;
}

export async function mudarPin(data) {
  const response = await api.post('/auth/pin/change', data);
  return response.data;
}

export async function requestPasswordReset(data) {
  const response = await api.post('/auth/password/forgot', data);
  return response.data;
}

export async function resetPassword(data) {
  const response = await api.post('/auth/password/reset', data);
  return response.data;
}
export async function resendEmail(data) {
  return (await api.post('/auth/email/resend', data)).data;
}

export async function verificarPin(data) {
  return (await api.post('/auth/pin/verify', data)).data;
}
