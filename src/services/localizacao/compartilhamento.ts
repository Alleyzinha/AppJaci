import axios from 'axios';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { getSession } from '@/services/storage/secureStorage';

const TAREFA = 'jaci-localizacao-continuada-v1';
const CHAVE = 'appjaci.localizacao.ativa.v1';
const transporte = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
});
type Registro = { id: number; usuario: string; habilitado: boolean; segundoPlano: boolean };
type Estado = {
  ativo: boolean;
  iniciando: boolean;
  parando: boolean;
  segundoPlano: boolean;
  erro: string;
  aviso: string;
  ultimoEnvio: number | null;
};
export const useLocalizacao = create<Estado>(() => ({
  ativo: false,
  iniciando: false,
  parando: false,
  segundoPlano: false,
  erro: '',
  aviso: '',
  ultimoEnvio: null,
}));
let observador: Location.LocationSubscription | null = null;
let fila: Promise<unknown> = Promise.resolve();
let geracao = 0;
let ultimoEnvio = 0;

async function ler(): Promise<Registro | null> {
  const raw =
    Platform.OS === 'web'
      ? window.sessionStorage.getItem(CHAVE)
      : await SecureStore.getItemAsync(CHAVE);
  return raw ? JSON.parse(raw) : null;
}
async function gravar(registro: Registro | null) {
  const raw = registro && JSON.stringify(registro);
  if (Platform.OS === 'web') {
    if (raw) window.sessionStorage.setItem(CHAVE, raw);
    else window.sessionStorage.removeItem(CHAVE);
  } else if (raw) await SecureStore.setItemAsync(CHAVE, raw);
  else await SecureStore.deleteItemAsync(CHAVE);
}
function erroTexto(erro: any) {
  return erro?.response?.data?.error || erro?.message || 'Não foi possível enviar sua posição.';
}
async function desligarSensor() {
  observador?.remove();
  observador = null;
  if (
    Platform.OS !== 'web' &&
    (await TaskManager.isAvailableAsync()) &&
    (await Location.hasStartedLocationUpdatesAsync(TAREFA))
  ) {
    await Location.stopLocationUpdatesAsync(TAREFA);
  }
}
function dadosPosicao(local: Location.LocationObject) {
  return {
    latitude: local.coords.latitude,
    longitude: local.coords.longitude,
    capturadoEm: Math.trunc(local.timestamp),
  };
}

function enviar(local: Location.LocationObject) {
  // Serializa envios e revalida o consentimento antes de cada requisição.
  fila = fila
    .catch(() => {})
    .then(async () => {
      const registro = await ler();
      const sessao = await getSession();
      if (!registro?.habilitado || !sessao?.token || sessao.userId !== registro.usuario) return;
      if (local.timestamp <= ultimoEnvio || Date.now() - local.timestamp > 120000) return;
      if (local.timestamp - ultimoEnvio < 5000) return;
      try {
        await transporte.put(
          '/localizacao',
          {
            ...dadosPosicao(local),
            idCompartilhamento: registro.id,
          },
          { headers: { Authorization: `Bearer ${sessao.token}` } },
        );
        ultimoEnvio = local.timestamp;
        useLocalizacao.setState({ ultimoEnvio, erro: '' });
      } catch (erro: any) {
        useLocalizacao.setState({ erro: erroTexto(erro) });
        if ([401, 403, 409].includes(erro?.response?.status)) {
          await gravar({ ...registro, habilitado: false });
          await desligarSensor();
          useLocalizacao.setState({ ativo: false });
        }
      }
    });
  return fila;
}

if (Platform.OS !== 'web' && !TaskManager.isTaskDefined(TAREFA)) {
  TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
    TAREFA,
    async ({ data, error }) => {
      if (error) {
        useLocalizacao.setState({
          erro: 'O celular interrompeu o GPS. Confira as permissões de localização.',
        });
        return;
      }
      const local = data?.locations?.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
      if (local) await enviar(local);
    },
  );
}

export async function iniciarCompartilhamento() {
  if (useLocalizacao.getState().iniciando || useLocalizacao.getState().ativo) return;
  const operacao = ++geracao;
  useLocalizacao.setState({ iniciando: true, erro: '', aviso: '' });
  try {
    const sessao = await getSession();
    if (!sessao?.token || !sessao.userId || sessao.perfil !== 'protegida')
      throw new Error('Entre novamente para compartilhar sua localização.');
    if (!(await Location.requestForegroundPermissionsAsync()).granted)
      throw new Error('Autorize a localização nas configurações do dispositivo.');
    let segundoPlano = false;
    if (Platform.OS !== 'web' && (await TaskManager.isAvailableAsync())) {
      segundoPlano = (await Location.requestBackgroundPermissionsAsync()).granted;
    }
    if (!segundoPlano)
      useLocalizacao.setState({
        aviso:
          Platform.OS === 'web'
            ? 'Na web, mantenha esta aba aberta. Para continuar com a tela bloqueada, use o app instalado.'
            : 'Ativo somente com o app aberto. Para usar com a tela bloqueada, permita localização sempre e use o app instalado.',
      });
    const local = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    if (geracao !== operacao) return;
    await desligarSensor();
    const resposta = await transporte.post('/localizacao/iniciar', dadosPosicao(local), {
      headers: { Authorization: `Bearer ${sessao.token}` },
    });
    const registro: Registro = {
      id: resposta.data.idCompartilhamento,
      usuario: sessao.userId,
      habilitado: true,
      segundoPlano,
    };
    await gravar(registro);
    if (geracao !== operacao) {
      await pararCompartilhamento();
      return;
    }
    ultimoEnvio = local.timestamp;
    if (segundoPlano) {
      await Location.startLocationUpdatesAsync(TAREFA, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
        deferredUpdatesInterval: 5000,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Jaci • localização compartilhada',
          notificationBody: 'Seus guardiões podem ver sua posição. Abra a Jaci para parar.',
          notificationColor: '#CF2B9D',
          killServiceOnDestroy: true,
        },
      });
    } else {
      observador = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 0,
        },
        enviar,
        (motivo) => useLocalizacao.setState({ erro: `GPS indisponível: ${motivo}` }),
      );
    }
    if (geracao !== operacao) {
      await desligarSensor();
      return;
    }
    useLocalizacao.setState({ ativo: true, segundoPlano, ultimoEnvio });
  } catch (erro) {
    await pararCompartilhamento().catch(() => {});
    useLocalizacao.setState({ erro: erroTexto(erro) });
  } finally {
    useLocalizacao.setState({ iniciando: false });
  }
}

export async function pararCompartilhamento() {
  ++geracao;
  useLocalizacao.setState({ ativo: false, parando: true, erro: '' });
  try {
    const registro = await ler();
    // Persistir a revogação antes de parar o serviço impede tarefas atrasadas.
    if (registro) await gravar({ ...registro, habilitado: false });
    await desligarSensor();
    await fila.catch(() => {});
    const sessao = await getSession();
    if (sessao?.token && sessao.perfil === 'protegida') {
      await transporte.delete('/localizacao', {
        params: registro ? { idCompartilhamento: registro.id } : undefined,
        headers: { Authorization: `Bearer ${sessao.token}` },
      });
    }
    await gravar(null);
    useLocalizacao.setState({ segundoPlano: false, ultimoEnvio: null, aviso: '' });
  } catch (erro) {
    useLocalizacao.setState({
      erro: 'O envio foi interrompido neste aparelho. Não foi possível remover a última posição do servidor; tente parar novamente.',
    });
    throw erro;
  } finally {
    useLocalizacao.setState({ parando: false });
  }
}

export async function recuperarCompartilhamento() {
  try {
    const registro = await ler();
    const sessao = await getSession();
    if (!registro || !sessao || registro.usuario !== sessao.userId) return;
    const emExecucao =
      registro.habilitado &&
      (Boolean(observador) ||
        (Platform.OS !== 'web' &&
          (await TaskManager.isAvailableAsync()) &&
          (await Location.hasStartedLocationUpdatesAsync(TAREFA))));
    if (emExecucao) useLocalizacao.setState({ ativo: true, segundoPlano: registro.segundoPlano });
    else if (!useLocalizacao.getState().iniciando) await pararCompartilhamento();
  } catch {
    useLocalizacao.setState({
      erro: 'Confira a conexão e as permissões para retomar a localização.',
    });
  }
}
