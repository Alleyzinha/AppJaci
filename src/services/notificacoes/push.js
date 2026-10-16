import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from '@/services/api/api';

let tokenRegistrado = null;

export async function registrarPush() {
  if (Platform.OS === 'web') return;
  try {
    let permissao = await Notifications.getPermissionsAsync();
    if (permissao.status !== 'granted') permissao = await Notifications.requestPermissionsAsync();
    if (permissao.status !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alertas', {
        name: 'Alertas de segurança',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#C92F64',
      });
    }

    const projectId = Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (token === tokenRegistrado) return;
    await api.post('/notificacoes/dispositivo', { token });
    tokenRegistrado = token;
  } catch {
    // Sem permissÃ£o, rede ou configuraÃ§Ã£o EAS, o app continua funcionando sem push.
  }
}

export async function removerRegistroPush() {
  if (!tokenRegistrado) return;
  try {
    await api.delete('/notificacoes/dispositivo', { data: { token: tokenRegistrado } });
  } finally {
    tokenRegistrado = null;
  }
}
