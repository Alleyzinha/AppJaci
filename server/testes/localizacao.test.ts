import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { posicaoSchema, atualizacaoSchema } from '../src/localizacao.js';

test('localizacao rejeita coordenadas invalidas, capturas antigas e atualizacao sem sessao', () => {
  const posicao = { latitude: -23.5, longitude: -46.6, capturadoEm: Date.now() };
  assert.ok(posicaoSchema.safeParse(posicao).success);
  assert.equal(posicaoSchema.safeParse({ ...posicao, latitude: 100 }).success, false);
  assert.equal(
    posicaoSchema.safeParse({ ...posicao, capturadoEm: Date.now() - 180000 }).success,
    false,
  );
  assert.equal(
    posicaoSchema.safeParse({ ...posicao, capturadoEm: Date.now() + 60000 }).success,
    false,
  );
  assert.equal(atualizacaoSchema.safeParse(posicao).success, false);
  assert.ok(atualizacaoSchema.safeParse({ ...posicao, idCompartilhamento: 8 }).success);
});

function ambiente(plataforma = 'web', permissao = true) {
  const armazenamento = new Map<string, string>();
  const chamadas: string[] = [];
  let callback: any;
  let tarefa: any;
  let executando = false;
  let erroEnvio = false;
  const agora = Date.now();
  const local = (tempo = agora) => ({
    coords: { latitude: -23.5, longitude: -46.6 },
    timestamp: tempo,
  });
  const storage = {
    getItem: (k: string) => armazenamento.get(k) || null,
    setItem: (k: string, v: string) => armazenamento.set(k, v),
    removeItem: (k: string) => armazenamento.delete(k),
  };
  const modulos: Record<string, any> = {
    axios: {
      create: () => ({
        post: async () => {
          chamadas.push('iniciar');
          return { data: { idCompartilhamento: 8 } };
        },
        put: async () => {
          chamadas.push('enviar');
          if (erroEnvio) throw { response: { status: 409, data: { error: 'Encerrado' } } };
        },
        delete: async () => {
          chamadas.push('remover');
        },
      }),
    },
    'react-native': { Platform: { OS: plataforma } },
    'expo-location': {
      Accuracy: { High: 4 },
      requestForegroundPermissionsAsync: async () => ({ granted: permissao }),
      requestBackgroundPermissionsAsync: async () => ({ granted: true }),
      getCurrentPositionAsync: async () => local(),
      watchPositionAsync: async (_: any, cb: any) => {
        callback = cb;
        return { remove: () => chamadas.push('pararGPS') };
      },
      hasStartedLocationUpdatesAsync: async () => executando,
      startLocationUpdatesAsync: async () => {
        executando = true;
        chamadas.push('iniciarFundo');
      },
      stopLocationUpdatesAsync: async () => {
        executando = false;
        chamadas.push('pararFundo');
      },
    },
    'expo-task-manager': {
      isAvailableAsync: async () => true,
      isTaskDefined: () => false,
      defineTask: (_: string, fn: any) => {
        tarefa = fn;
      },
    },
    'expo-secure-store': {
      getItemAsync: storage.getItem,
      setItemAsync: storage.setItem,
      deleteItemAsync: storage.removeItem,
    },
    zustand: {
      create: (init: any) => {
        let estado = init();
        const store = () => estado;
        store.getState = () => estado;
        store.setState = (dados: any) => {
          estado = { ...estado, ...dados };
        };
        return store;
      },
    },
    '@/services/storage/secureStorage': {
      getSession: async () => ({ token: 'teste', userId: '1', perfil: 'protegida' }),
    },
  };
  const source = readFileSync(
    new URL('../../src/services/localizacao/compartilhamento.ts', import.meta.url),
    'utf8',
  );
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const exports: any = {};
  vm.runInNewContext(js, {
    exports,
    require: (nome: string) => modulos[nome],
    process: { env: {} },
    window: { sessionStorage: storage },
    Date,
    Promise,
  });
  return {
    exports,
    chamadas,
    local,
    agora,
    enviar: (t: number) => callback(local(t)),
    tarefa: (t: number) => tarefa({ data: { locations: [local(t)] } }),
    falhar: () => {
      erroEnvio = true;
    },
  };
}

test('web acompanha GPS entre telas e parar impede novos envios', async () => {
  const a = ambiente();
  await a.exports.iniciarCompartilhamento();
  assert.equal(a.exports.useLocalizacao.getState().ativo, true);
  assert.equal(a.exports.useLocalizacao.getState().segundoPlano, false);
  await a.exports.recuperarCompartilhamento();
  assert.equal(a.exports.useLocalizacao.getState().ativo, true);
  await a.enviar(a.agora + 6000);
  assert.equal(a.chamadas.filter((x) => x === 'enviar').length, 1);
  await a.exports.pararCompartilhamento();
  await a.enviar(a.agora + 12000);
  assert.equal(a.chamadas.filter((x) => x === 'enviar').length, 1);
  assert.ok(a.chamadas.includes('pararGPS'));
  assert.equal(a.exports.useLocalizacao.getState().ativo, false);
});

test('sem permissao nao inicia compartilhamento', async () => {
  const a = ambiente('web', false);
  await a.exports.iniciarCompartilhamento();
  assert.equal(a.chamadas.includes('iniciar'), false);
  assert.equal(a.exports.useLocalizacao.getState().ativo, false);
});

test('tarefa nativa envia em segundo plano e sessao revogada desliga o servico', async () => {
  const a = ambiente('android');
  await a.exports.iniciarCompartilhamento();
  assert.ok(a.chamadas.includes('iniciarFundo'));
  assert.equal(a.exports.useLocalizacao.getState().segundoPlano, true);
  await a.tarefa(a.agora + 6000);
  a.falhar();
  await a.tarefa(a.agora + 12000);
  assert.ok(a.chamadas.includes('pararFundo'));
  assert.equal(a.exports.useLocalizacao.getState().ativo, false);
  await a.tarefa(a.agora + 18000);
  assert.equal(a.chamadas.filter((x) => x === 'enviar').length, 2);
});
