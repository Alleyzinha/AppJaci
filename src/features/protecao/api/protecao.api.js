import { api } from '@/services/api/api';

export const listarDiario = async (pagina = 1) =>
  (await api.get('/diario', { params: { pagina } })).data;
export const salvarNota = async ({ idDiario, ...dados }) =>
  idDiario ? api.put(`/diario/${idDiario}`, dados) : api.post('/diario', dados);
export const excluirNota = async (id) => api.delete(`/diario/${id}`);
export const listarLocalizacoes = async () => (await api.get('/localizacao')).data.localizacoes;
export const compartilharLocalizacao = async (dados) => api.put('/localizacao', dados);
export const pararCompartilhamento = async () => api.delete('/localizacao');
export const listarAlertas = async () => (await api.get('/sos')).data.alertas;
export const registrarAlerta = async () => (await api.post('/sos')).data;
export const encerrarAlerta = async (id) => api.patch(`/sos/${id}/encerrar`);
export const mensagemErro = (erro) =>
  erro?.response?.data?.error ||
  'Não foi possível conectar. Verifique sua conexão e tente novamente.';
