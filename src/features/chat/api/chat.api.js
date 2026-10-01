import { api } from '@/services/api/api';

export async function listarContatos() {
  return (await api.get('/chat/contatos')).data;
}
export async function listarMensagens(id, modo, antes) {
  return (await api.get(`/chat/${id}/mensagens`, { params: { modo, antes } })).data;
}
export async function enviarMensagem(id, modo, dados) {
  return (await api.post(`/chat/${id}/mensagens`, dados, { params: { modo } })).data;
}
export async function marcarLidas(id, modo, ate) {
  return api.patch(`/chat/${id}/lidas`, { ate }, { params: { modo } });
}
export async function historicoAssistente() {
  return (await api.get('/chat/assistente/historico')).data;
}
export async function enviarAssistente(texto) {
  return (
    await api.post('/chat/assistente/mensagens', { texto, consentimento: true }, { timeout: 35000 })
  ).data;
}
