import EstadoVazio from '@/components/ui/EstadoVazio';
import PortaoPin from '@/components/ui/PortaoPin';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TelaPadrao, {
  Botao,
  Cartao,
  Mensagem,
  estilos,
  useCoresTela,
} from '@/components/ui/TelaPadrao';
import { useAuthStore } from '@/stores/auth.store';
import {
  excluirRegistroLocal,
  liberarAnexosRascunho,
  liberarPreviewsLocais,
  listarRegistrosLocais,
  salvarRegistroLocal,
} from '@/features/protecao/local/diarioLocal';
import {
  listarDiario,
  salvarNota,
  excluirNota,
  mensagemErro,
} from '@/features/protecao/api/protecao.api';
import { styles } from './styles';

const MAX_ANEXOS = 10;
const MAX_ANEXO_BYTES = 250 * 1024 * 1024;
const tiposMidia = ['images', 'videos'];
const icones = { photo: 'image-outline', video: 'videocam-outline', audio: 'mic-outline' };
const nomesTipo = { photo: 'Foto', video: 'Vídeo', audio: 'Áudio' };
const novoId = () => `anexo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

function tamanhoHumano(bytes) {
  if (!bytes) return '';
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AnexoLocalCard({ anexo, cores, onRemover, somenteLeitura = false }) {
  return (
    <View style={[styles.anexo, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
      {anexo.disponivel === false ? (
        <View style={[styles.preview, styles.previewErro, { backgroundColor: cores.suave }]}>
          <Ionicons name="alert-circle-outline" size={28} color={cores.perigo} />
          <Text style={[styles.previewErroTexto, { color: cores.perigo }]}>
            Arquivo indisponível neste aparelho
          </Text>
        </View>
      ) : anexo.tipo === 'photo' ? (
        <Image
          source={{ uri: anexo.uri }}
          style={styles.preview}
          resizeMode="cover"
          accessibilityLabel="Prévia da foto anexada"
        />
      ) : anexo.tipo === 'video' ? (
        <VideoPreview uri={anexo.uri} />
      ) : (
        <AudioPreview uri={anexo.uri} cores={cores} />
      )}
      <View style={styles.anexoInfo}>
        <View style={styles.anexoNomeLinha}>
          <Ionicons
            name={icones[anexo.tipo] || 'document-outline'}
            size={18}
            color={cores.destaque}
          />
          <Text numberOfLines={1} style={[styles.anexoNome, { color: cores.texto }]}>
            {anexo.nomeArquivo || nomesTipo[anexo.tipo]}
          </Text>
        </View>
        <Text style={[styles.anexoMeta, { color: cores.secundario }]}>
          {nomesTipo[anexo.tipo]}
          {anexo.tamanhoBytes ? ` · ${tamanhoHumano(anexo.tamanhoBytes)}` : ''}
        </Text>
        {!somenteLeitura && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remover ${anexo.nomeArquivo || nomesTipo[anexo.tipo]}`}
            onPress={onRemover}
            style={({ pressed }) => [styles.removerAnexo, { opacity: pressed ? 0.62 : 1 }]}
          >
            <Ionicons name="close-circle-outline" size={17} color={cores.perigo} />
            <Text style={[styles.removerAnexoTexto, { color: cores.perigo }]}>Remover arquivo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function VideoPreview({ uri }) {
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      style={styles.videoPreview}
      nativeControls
      contentFit="contain"
      allowsFullscreen
    />
  );
}

function AudioPreview({ uri, cores }) {
  const player = useAudioPlayer(uri, { updateInterval: 500 });
  const estado = useAudioPlayerStatus(player);
  const tocando = Boolean(estado.playing);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tocando ? 'Pausar prévia do áudio' : 'Reproduzir prévia do áudio'}
      onPress={async () => {
        if (tocando) player.pause();
        else {
          if (estado.didJustFinish) await player.seekTo(0);
          player.play();
        }
      }}
      style={({ pressed }) => [
        styles.audioPreview,
        { backgroundColor: cores.suave, opacity: pressed ? 0.72 : 1 },
      ]}
    >
      <Ionicons name={tocando ? 'pause-circle' : 'play-circle'} size={40} color={cores.destaque} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.audioTitulo, { color: cores.texto }]}>
          {tocando ? 'Reproduzindo áudio' : 'Ouvir áudio'}
        </Text>
        <Text style={[styles.anexoMeta, { color: cores.secundario }]}>
          {estado.duration
            ? `${Math.floor(estado.duration / 60)}:${String(Math.floor(estado.duration % 60)).padStart(2, '0')}`
            : 'Prévia do registro'}
        </Text>
      </View>
    </Pressable>
  );
}

function AcaoMidia({ icone, titulo, cores, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.acaoMidia,
        { backgroundColor: cores.suave, opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons name={icone} size={20} color={cores.destaque} />
      <Text style={[styles.acaoMidiaTexto, { color: cores.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

function RegistroLocalCard({
  registro,
  cores,
  confirmarExclusao,
  setConfirmarExclusao,
  onEditar,
  onExcluir,
}) {
  const pedirExclusao = confirmarExclusao === registro.id;
  return (
    <Cartao>
      <View style={styles.registroTopo}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.registroTitulo, { color: cores.texto }]}>
            Registro neste aparelho
          </Text>
          <Text style={[styles.anexoMeta, { color: cores.secundario }]}>
            {new Date(registro.criadoEm).toLocaleString('pt-BR')}
          </Text>
        </View>
        <Ionicons name="phone-portrait-outline" size={21} color={cores.destaque} />
      </View>
      {registro.mensagem ? (
        <Text style={[styles.registroMensagem, { color: cores.texto }]}>{registro.mensagem}</Text>
      ) : null}
      {registro.anexos.map((anexo) => (
        <AnexoLocalCard key={anexo.id} anexo={anexo} cores={cores} somenteLeitura />
      ))}
      <Mensagem texto="Este registro e seus arquivos ficam localmente. A Jaci não os envia ao servidor nem os compartilha com guardiões." />
      {pedirExclusao ? (
        <>
          <Mensagem texto="Excluir este registro e os arquivos salvos junto dele deste aparelho?" />
          <Botao titulo="Confirmar exclusão" perigo onPress={() => onExcluir(registro.id)} />
          <Botao titulo="Manter registro" secundario onPress={() => setConfirmarExclusao('')} />
        </>
      ) : (
        <View style={styles.linhaBotoes}>
          <Botao titulo="Editar registro" secundario onPress={() => onEditar(registro)} />
          <Botao
            titulo="Excluir registro"
            secundario
            onPress={() => setConfirmarExclusao(registro.id)}
          />
        </View>
      )}
    </Cartao>
  );
}

export default function ProtegidaDiarioScreen() {
  const cores = useCoresTela();
  const cliente = useQueryClient();
  const userId = useAuthStore((estado) => estado.userId);
  const [pagina, definirPagina] = useState(1);
  const [rascunho, definirRascunho] = useState(null);
  const [exclusao, definirExclusao] = useState(null);
  const [exclusaoLocal, definirExclusaoLocal] = useState('');
  const [erroMidia, definirErroMidia] = useState('');
  const [erroLocal, definirErroLocal] = useState('');
  // Portão de PIN: pede o PIN toda vez que a tela é (re)montada — ou seja,
  // a cada entrada no Diário. Nada do diário carrega antes da liberação.
  const [pinLiberado, definirPinLiberado] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estadoGravacao = useAudioRecorderState(audioRecorder);
  const consulta = useQuery({ queryKey: ['diario', pagina], queryFn: () => listarDiario(pagina) });
  const meusDados = useQuery({
    queryKey: ['minha-conta'],
    queryFn: async () =>
      (await (await import('@/services/api/api')).api.get('/users/me')).data.user,
    enabled: !userId,
    retry: false,
  });
  const donoId = userId || meusDados.data?.id;
  const registrosLocais = useQuery({
    queryKey: ['diario-local', donoId],
    queryFn: () => listarRegistrosLocais(donoId),
    enabled: Boolean(donoId),
  });

  useEffect(() => {
    const anteriores = registrosLocais.data;
    return () => {
      if (anteriores) void liberarPreviewsLocais(anteriores);
    };
  }, [registrosLocais.data]);
  useEffect(
    () => () => {
      if (audioRecorder.isRecording) void audioRecorder.stop();
    },
    [audioRecorder],
  );

  const salvar = useMutation({
    mutationFn: salvarNota,
    onSuccess: () => {
      definirRascunho(null);
      definirPagina(1);
      cliente.invalidateQueries({ queryKey: ['diario'] });
    },
  });
  const excluir = useMutation({
    mutationFn: excluirNota,
    onSuccess: () => {
      definirExclusao(null);
      cliente.invalidateQueries({ queryKey: ['diario'] });
    },
  });
  const salvarLocal = useMutation({
    mutationFn: (dados) => salvarRegistroLocal(donoId, dados),
    onSuccess: async (_registro, dados) => {
      try {
        await liberarAnexosRascunho(dados.anexos);
      } catch {}
      definirRascunho(null);
      definirErroLocal('');
      cliente.invalidateQueries({ queryKey: ['diario-local', donoId] });
    },
    onError: (erro) =>
      definirErroLocal(erro?.message || 'Não foi possível guardar o registro neste aparelho.'),
  });
  const excluirLocal = useMutation({
    mutationFn: (id) => excluirRegistroLocal(donoId, id),
    onSuccess: () => {
      definirExclusaoLocal('');
      cliente.invalidateQueries({ queryKey: ['diario-local', donoId] });
    },
    onError: (erro) =>
      definirErroLocal(erro?.message || 'Não foi possível excluir o registro local.'),
  });
  const campo = [
    estilos.campo,
    { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.superficie },
  ];

  function abrirEditorLocal(registro) {
    salvarLocal.reset();
    definirErroLocal('');
    definirErroMidia('');
    definirRascunho({
      modo: 'local',
      id: registro?.id,
      mensagem: registro?.mensagem || '',
      anexos: registro?.anexos.map((anexo) => ({ ...anexo, persistido: true })) || [],
    });
  }

  async function selecionarMidia() {
    try {
      definirErroMidia('');
      if (rascunho.anexos.length >= MAX_ANEXOS)
        throw new Error(`Você pode adicionar até ${MAX_ANEXOS} arquivos em cada registro.`);
      if (Platform.OS !== 'web') {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted)
          throw new Error('Permita acesso às fotos e vídeos para escolher evidências.');
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: tiposMidia,
        allowsMultipleSelection: true,
        selectionLimit: MAX_ANEXOS - rascunho.anexos.length,
        quality: 1,
        videoMaxDuration: 180,
        exif: false,
      });
      if (resultado.canceled) return;
      const acimaDoLimite = resultado.assets.filter((asset) => asset.fileSize > MAX_ANEXO_BYTES);
      const permitidos = resultado.assets.filter((asset) => asset.fileSize <= MAX_ANEXO_BYTES);
      if (acimaDoLimite.length) {
        definirErroMidia(
          'Cada arquivo precisa ter até 250 MB. Os arquivos maiores não foram adicionados.',
        );
      }
      const novos = permitidos.map((asset) => ({
        id: novoId(),
        tipo: asset.type === 'video' ? 'video' : 'photo',
        nomeArquivo: asset.fileName || (asset.type === 'video' ? 'Vídeo' : 'Foto'),
        tipoMime: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        uri: asset.uri,
        tamanhoBytes: asset.fileSize,
        duracaoMs: asset.duration ?? undefined,
        arquivoWeb: asset.file,
      }));
      definirRascunho((atual) => ({
        ...atual,
        anexos: [...atual.anexos, ...novos].slice(0, MAX_ANEXOS),
      }));
    } catch (erro) {
      definirErroMidia(erro?.message || 'Não foi possível acessar as fotos e vídeos.');
    }
  }

  async function capturar(tipo) {
    try {
      definirErroMidia('');
      if (rascunho.anexos.length >= MAX_ANEXOS)
        throw new Error(`Você pode adicionar até ${MAX_ANEXOS} arquivos em cada registro.`);
      if (Platform.OS !== 'web') {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted)
          throw new Error('Permita acesso à câmera para registrar esta evidência.');
      }
      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: tipo === 'video' ? ['videos'] : ['images'],
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 180,
      });
      if (resultado.canceled) return;
      const asset = resultado.assets[0];
      if (asset.fileSize > MAX_ANEXO_BYTES) {
        throw new Error('Cada arquivo precisa ter até 250 MB.');
      }
      definirRascunho((atual) => ({
        ...atual,
        anexos: [
          ...atual.anexos,
          {
            id: novoId(),
            tipo,
            nomeArquivo:
              asset.fileName || (tipo === 'video' ? 'Vídeo registrado' : 'Foto registrada'),
            tipoMime: asset.mimeType || (tipo === 'video' ? 'video/mp4' : 'image/jpeg'),
            uri: asset.uri,
            tamanhoBytes: asset.fileSize,
            duracaoMs: asset.duration ?? undefined,
            arquivoWeb: asset.file,
          },
        ].slice(0, MAX_ANEXOS),
      }));
    } catch (erro) {
      definirErroMidia(erro?.message || 'Não foi possível abrir a câmera.');
    }
  }

  async function alternarGravacao() {
    try {
      definirErroMidia('');
      if (estadoGravacao.isRecording) {
        await audioRecorder.stop();
        await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
        const uri = audioRecorder.uri;
        if (!uri) throw new Error('Não foi possível concluir a gravação. Tente novamente.');
        definirRascunho((atual) => ({
          ...atual,
          anexos: [
            ...atual.anexos,
            {
              id: novoId(),
              tipo: 'audio',
              nomeArquivo: 'Áudio gravado',
              tipoMime: uri.endsWith('.webm') ? 'audio/webm' : 'audio/mp4',
              uri,
              temporarioApp: true,
              duracaoMs: Math.round(estadoGravacao.durationMillis),
            },
          ].slice(0, MAX_ANEXOS),
        }));
      } else {
        if (rascunho.anexos.length >= MAX_ANEXOS)
          throw new Error(`Você pode adicionar até ${MAX_ANEXOS} arquivos em cada registro.`);
        const permissao = await AudioModule.requestRecordingPermissionsAsync();
        if (!permissao.granted)
          throw new Error('Permita acesso ao microfone para gravar um áudio.');
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record({ forDuration: 180 });
      }
    } catch (erro) {
      definirErroMidia(erro?.message || 'Não foi possível gravar o áudio.');
      try {
        await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      } catch {}
    }
  }

  async function removerAnexo(id) {
    const removido = rascunho.anexos.find((anexo) => anexo.id === id);
    if (removido?.temporarioApp) await liberarAnexosRascunho([removido]);
    definirRascunho((atual) => ({
      ...atual,
      anexos: atual.anexos.filter((anexo) => anexo.id !== id),
    }));
  }

  const registroValido = Boolean(rascunho?.mensagem.trim() || rascunho?.anexos.length);
  if (!pinLiberado)
    return (
      <View style={{ flex: 1 }}>
        <PortaoPin liberado={pinLiberado} onLiberar={() => definirPinLiberado(true)} />
      </View>
    );
  return (
    <TelaPadrao
      titulo="Seu diário"
      descricao="Escreva uma nota da conta ou crie um registro com mensagens e evidências guardadas neste aparelho."
      icone="book-outline"
      ativo="diario"
    >
      <View
        style={[
          styles.introRegistroLocal,
          { backgroundColor: cores.superficie, borderColor: cores.borda },
        ]}
      >
        <View style={[styles.introIcone, { backgroundColor: cores.suave }]}>
          <Ionicons name="phone-portrait-outline" size={21} color={cores.destaque} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.introTitulo, { color: cores.texto }]}>Registros neste aparelho</Text>
          <Text style={[styles.anexoMeta, { color: cores.secundario }]}>
            Mensagens, fotos, vídeos e áudios não são enviados ao servidor nem compartilhados com
            guardiões.
          </Text>
        </View>
      </View>
      <Botao titulo="Criar registro neste aparelho" onPress={() => abrirEditorLocal(null)} />
      <Botao
        titulo="Escrever nota da conta"
        secundario
        onPress={() => {
          salvar.reset();
          definirRascunho({ modo: 'conta', titulo: '', descricao: '' });
        }}
      />
      <Mensagem
        erro
        texto={
          !donoId && meusDados.isError
            ? 'Não foi possível identificar sua conta para separar os registros locais.'
            : ''
        }
      />

      {rascunho?.modo === 'local' && (
        <Cartao>
          <Text style={[styles.secaoTitulo, { color: cores.texto }]}>
            {rascunho.id ? 'Editar registro local' : 'Novo registro neste aparelho'}
          </Text>
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Mensagem ou descrição</Text>
          <TextInput
            accessibilityLabel="Mensagem ou descrição do registro local"
            value={rascunho.mensagem}
            maxLength={3000}
            multiline
            placeholder="Escreva o que deseja guardar. Também pode anexar sem escrever uma mensagem."
            placeholderTextColor={cores.secundario}
            textAlignVertical="top"
            style={[campo, styles.campoMensagem]}
            onChangeText={(mensagem) => definirRascunho({ ...rascunho, mensagem })}
          />
          <Text style={[styles.contador, { color: cores.secundario }]}>
            {rascunho.mensagem.length}/3000 caracteres
          </Text>
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Adicionar evidência</Text>
          <View style={styles.acoesMidia}>
            <AcaoMidia
              icone="images-outline"
              titulo="Escolher foto ou vídeo"
              cores={cores}
              onPress={selecionarMidia}
              disabled={estadoGravacao.isRecording}
            />
            <AcaoMidia
              icone="camera-outline"
              titulo="Tirar foto"
              cores={cores}
              onPress={() => capturar('photo')}
              disabled={estadoGravacao.isRecording}
            />
            <AcaoMidia
              icone="videocam-outline"
              titulo="Gravar vídeo"
              cores={cores}
              onPress={() => capturar('video')}
              disabled={estadoGravacao.isRecording}
            />
            <AcaoMidia
              icone={estadoGravacao.isRecording ? 'stop-circle-outline' : 'mic-outline'}
              titulo={
                estadoGravacao.isRecording
                  ? `Parar gravação · ${Math.floor(estadoGravacao.durationMillis / 1000)}s`
                  : 'Gravar áudio'
              }
              cores={cores}
              onPress={alternarGravacao}
            />
          </View>
          <Mensagem erro texto={erroMidia} />
          {!!rascunho.anexos.length && (
            <>
              <Text style={[styles.rotuloAnexo, { color: cores.texto }]}>
                Revise os arquivos ({rascunho.anexos.length}/{MAX_ANEXOS})
              </Text>
              <View style={styles.listaAnexos}>
                {rascunho.anexos.map((anexo) => (
                  <AnexoLocalCard
                    key={anexo.id}
                    anexo={anexo}
                    cores={cores}
                    onRemover={() => removerAnexo(anexo.id)}
                  />
                ))}
              </View>
            </>
          )}
          <View style={[styles.privacidade, { backgroundColor: cores.suave }]}>
            <Ionicons name="lock-closed-outline" size={18} color={cores.destaque} />
            <Text style={[styles.privacidadeTexto, { color: cores.texto }]}>
              Este registro fica neste aparelho ou navegador. A Jaci não envia estes dados ao
              servidor nem aos guardiões. Os arquivos não têm criptografia adicional; cópias de
              segurança dependem das configurações do aparelho. Limpar os dados do navegador ou
              desinstalar o app pode apagá-los.
            </Text>
          </View>
          <Mensagem erro texto={erroLocal} />
          <Botao
            titulo="Salvar registro local"
            carregando={salvarLocal.isPending}
            disabled={!donoId || !registroValido || estadoGravacao.isRecording}
            onPress={() =>
              salvarLocal.mutate({
                id: rascunho.id,
                mensagem: rascunho.mensagem,
                anexos: rascunho.anexos,
              })
            }
          />
          <Botao
            titulo="Cancelar"
            secundario
            disabled={salvarLocal.isPending || estadoGravacao.isRecording}
            onPress={async () => {
              try {
                await liberarAnexosRascunho(rascunho.anexos);
              } catch {}
              definirRascunho(null);
              definirErroMidia('');
              definirErroLocal('');
            }}
          />
        </Cartao>
      )}

      {rascunho?.modo === 'conta' && (
        <Cartao>
          <Text style={[styles.secaoTitulo, { color: cores.texto }]}>
            {rascunho.idDiario ? 'Editar nota da conta' : 'Nova nota da conta'}
          </Text>
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Título</Text>
          <TextInput
            accessibilityLabel="Título da nota"
            value={rascunho.titulo}
            maxLength={200}
            style={campo}
            onChangeText={(titulo) => definirRascunho({ ...rascunho, titulo })}
          />
          <Text style={[estilos.rotulo, { color: cores.texto }]}>Sua nota</Text>
          <TextInput
            accessibilityLabel="Conteúdo da nota"
            value={rascunho.descricao}
            maxLength={500}
            multiline
            textAlignVertical="top"
            style={[campo, { minHeight: 130 }]}
            onChangeText={(descricao) => definirRascunho({ ...rascunho, descricao })}
          />
          <Mensagem texto={`${rascunho.descricao.length}/500 caracteres`} />
          <Mensagem texto="Notas de texto usam o serviço atual do diário da conta. Anexos não são enviados junto delas." />
          <Mensagem erro texto={salvar.error && mensagemErro(salvar.error)} />
          <Botao
            titulo="Salvar nota"
            carregando={salvar.isPending}
            disabled={!rascunho.titulo.trim() || !rascunho.descricao.trim()}
            onPress={() =>
              salvar.mutate({
                idDiario: rascunho.idDiario,
                titulo: rascunho.titulo,
                descricao: rascunho.descricao,
              })
            }
          />
          <Botao
            titulo="Cancelar"
            secundario
            disabled={salvar.isPending}
            onPress={() => definirRascunho(null)}
          />
        </Cartao>
      )}

      <Text style={[styles.secaoTitulo, { color: cores.texto }]}>Registros neste aparelho</Text>
      {registrosLocais.isPending && donoId ? <Mensagem texto="Abrindo registros locais…" /> : null}
      <Mensagem erro texto={registrosLocais.error?.message} />
      {registrosLocais.data?.length === 0 && (
        <EstadoVazio
          icone="phone-portrait-outline"
          titulo="Nenhum registro local ainda."
          descricao="Mensagens, fotos, vídeos e áudios ficam separados das notas da conta."
        />
      )}
      {registrosLocais.data?.map((registro) => (
        <RegistroLocalCard
          key={registro.id}
          registro={registro}
          cores={cores}
          confirmarExclusao={exclusaoLocal}
          setConfirmarExclusao={definirExclusaoLocal}
          onEditar={abrirEditorLocal}
          onExcluir={(id) => excluirLocal.mutate(id)}
        />
      ))}
      <Mensagem erro texto={excluirLocal.error?.message} />

      <Text style={[styles.secaoTitulo, { color: cores.texto }]}>Notas da conta</Text>
      <Mensagem texto="Estas notas continuam usando o armazenamento atual do diário da conta." />
      {consulta.isPending && <Mensagem texto="Carregando suas notas…" />}
      {consulta.isError && (
        <>
          <Mensagem erro texto={mensagemErro(consulta.error)} />
          <Botao titulo="Tentar novamente" secundario onPress={() => consulta.refetch()} />
        </>
      )}
      {consulta.data?.entradas.length === 0 && !rascunho && (
        <EstadoVazio
          titulo={
            pagina === 1
              ? 'Seu espaço para escrever, no seu tempo.'
              : 'Você chegou ao fim desta página.'
          }
          descricao={
            pagina === 1
              ? 'Um pensamento, uma conquista ou como foi seu dia. Quando quiser, comece uma nota.'
              : 'Volte à página anterior para encontrar suas notas.'
          }
        />
      )}
      {consulta.data?.entradas.map((nota) => (
        <Cartao key={nota.idDiario}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: cores.texto }}>{nota.titulo}</Text>
          <Mensagem texto={new Date(nota.dataHora).toLocaleString('pt-BR')} />
          <Text style={{ color: cores.texto, fontSize: 16, lineHeight: 25 }}>{nota.descricao}</Text>
          {exclusao === nota.idDiario ? (
            <>
              <Mensagem texto="Excluir esta nota permanentemente?" />
              <Mensagem erro texto={excluir.error && mensagemErro(excluir.error)} />
              <Botao
                titulo="Confirmar exclusão"
                perigo
                carregando={excluir.isPending}
                onPress={() => excluir.mutate(nota.idDiario)}
              />
              <Botao
                titulo="Manter nota"
                secundario
                disabled={excluir.isPending}
                onPress={() => definirExclusao(null)}
              />
            </>
          ) : (
            <View style={{ gap: 8 }}>
              <Botao
                titulo="Editar nota"
                secundario
                onPress={() => {
                  salvar.reset();
                  definirRascunho({
                    modo: 'conta',
                    idDiario: nota.idDiario,
                    titulo: nota.titulo,
                    descricao: nota.descricao,
                  });
                }}
              />
              <Botao
                titulo="Excluir nota"
                secundario
                onPress={() => {
                  excluir.reset();
                  definirExclusao(nota.idDiario);
                }}
              />
            </View>
          )}
        </Cartao>
      ))}
      <Mensagem texto={`Página ${pagina}`} />
      {pagina > 1 && (
        <Botao titulo="Página anterior" secundario onPress={() => definirPagina(pagina - 1)} />
      )}
      {consulta.data?.entradas.length === 20 && (
        <Botao titulo="Próxima página" secundario onPress={() => definirPagina(pagina + 1)} />
      )}
    </TelaPadrao>
  );
}
