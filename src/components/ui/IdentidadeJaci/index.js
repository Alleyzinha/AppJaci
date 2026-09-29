import ToqueSuave from '@/components/ui/ToqueSuave';
import React from 'react';
import { s } from './styles';
import { Linking, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth.store';
import { useSegurancaStore } from '@/stores/seguranca.store';
import { getFirstName } from '@/utils/name';
import { useCoresTela } from '@/styles/useCoresTela';
import { colors } from '@/styles/tokens';

function useCoresIdentidade() {
  const cores = useCoresTela();
  const perfil = useAuthStore((estado) => estado.perfil);
  const escuro = cores.fundo === '#17151F';
  return {
    ...cores,
    destaque: escuro
      ? cores.destaque
      : perfil === 'guardiao'
        ? colors.guardiao.primary
        : colors.protegida.primaryDark,
    suave: escuro ? cores.suave : perfil === 'guardiao' ? '#EAF5F6' : '#FFF0F7',
  };
}

export function CabecalhoJaci({
  userName = 'Jaci',
  showBackButton = false,
  onStatusPress,
  perfil = 'protegida',
}) {
  const nome = useAuthStore((estado) => estado.userName);
  const guardiao = perfil === 'guardiao';
  const camuflagem = useSegurancaStore((estado) => estado.camuflagem);
  const marca = camuflagem && !guardiao ? 'notas' : 'jaci';
  const tinta = '#FFFFFF';
  const destaque = '#FFFFFF';
  const fundoIcone = 'rgba(255,255,255,0.16)';
  const inicial = getFirstName(nome || userName);
  return (
    <LinearGradient
      colors={
        guardiao
          ? [colors.guardiao.primary, colors.guardiao.primaryDark]
          : [colors.protegida.primary, colors.protegida.primaryDark]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[s.cabecalho, s.cabecalhoAzul]}
    >
      <View pointerEvents="none" accessible={false} style={s.cabecalhoArcoExterno} />
      <View pointerEvents="none" accessible={false} style={s.cabecalhoArcoInterno} />
      <View style={s.cabecalhoConteudo}>
        {showBackButton && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={[s.voltar, { backgroundColor: fundoIcone }]}
            onPress={() => (router.canGoBack() ? router.back() : router.replace(`/${perfil}`))}
          >
            <Ionicons name="arrow-back" size={21} color={tinta} />
          </Pressable>
        )}
        <View style={s.usuario}>
          <Text style={s.marca}>
            {marca}
            <Text style={s.marcaPonto}>.</Text>
          </Text>
          <Text numberOfLines={1} style={[s.nome, { color: tinta }]}>
            Olá, {inicial}
          </Text>
        </View>
        {onStatusPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Status da proteção"
            onPress={onStatusPress}
            style={[s.voltar, { backgroundColor: fundoIcone }]}
          >
            <Ionicons name="shield-checkmark-outline" size={23} color={destaque} />
          </Pressable>
        ) : null}
        <View accessible={false} style={[s.avatar, { backgroundColor: fundoIcone }]}>
          <Text style={[s.inicial, { color: destaque }]}>{inicial?.[0]?.toUpperCase() || 'J'}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export function MenuJaci({ items, activeItem = 'inicio', onItemPress }) {
  const cores = useCoresIdentidade();
  const guardiao = useAuthStore((estado) => estado.perfil === 'guardiao');
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        s.menuFundo,
        { backgroundColor: cores.fundo, paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <LinearGradient
        colors={
          guardiao
            ? [colors.guardiao.primary, colors.guardiao.primaryDark]
            : [colors.protegida.primary, colors.protegida.primaryDark]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          s.menu,
          {
            borderColor: guardiao ? colors.guardiao.primary : colors.protegida.primaryDark,
          },
        ]}
      >
        {items.map((item) => {
          const ativo = item.id === activeItem;
          const cor = ativo ? '#FFFFFF' : 'rgba(255,255,255,0.8)';
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: ativo }}
              onPress={() => onItemPress?.(item.id)}
              style={({ pressed }) => [
                s.menuItem,
                {
                  backgroundColor: ativo ? 'rgba(255,255,255,0.18)' : 'transparent',
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={cor} />
              <Text style={[s.menuTexto, { color: cor, fontWeight: ativo ? '700' : '500' }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

export function BoasVindasJaci({ perfil = 'protegida' }) {
  const guardiao = perfil === 'guardiao';
  const tinta = { color: guardiao ? '#223A44' : '#222222' };
  return (
    <LinearGradient
      colors={
        guardiao
          ? ['#8DCFE2', '#76B3C5']
          : [colors.protegida.gradientStart, colors.protegida.gradientEnd]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.boasVindas}
    >
      <View pointerEvents="none" style={s.circulo} />
      <View pointerEvents="none" style={s.heroArco} />
      <View style={s.heroTopo}>
        <View style={s.selo}>
          <Ionicons name="heart-outline" size={14} color={tinta.color} />
          <Text style={[s.seloTexto, tinta]}>Cuidado que conecta</Text>
        </View>
        <View style={s.heroEmblema} accessible={false}>
          <Ionicons name="shield-checkmark-outline" size={27} color={tinta.color} />
        </View>
      </View>
      <Text accessibilityRole="header" style={[s.titulo, tinta]}>
        {guardiao ? 'Sua presença\nfaz a diferença.' : 'Você merece\nse sentir segura.'}
      </Text>
      <Text style={[s.descricao, tinta]}>
        {guardiao
          ? 'Esteja por perto. Sua rede de cuidado começa aqui.'
          : 'Um espaço de acolhimento, proteção e cuidado. No seu tempo.'}
      </Text>
      <View style={s.assinatura}>
        <Ionicons name="shield-checkmark-outline" size={16} color={tinta.color} />
        <Text style={[s.assinaturaTexto, tinta]}>
          {guardiao ? 'Juntos, cuidamos melhor' : 'Você não está sozinha'}
        </Text>
      </View>
    </LinearGradient>
  );
}

export function AcoesJaci({ actions, onActionPress }) {
  const { width, fontScale } = useWindowDimensions();
  const colunaUnica = width < 360 || fontScale > 1.3;
  const cores = useCoresIdentidade();
  const perfil = useAuthStore((estado) => estado.perfil);
  const descricoes = {
    guardioes: 'Pessoas em quem confiar',
    localizacao:
      perfil === 'guardiao' ? 'Veja os locais compartilhados' : 'Compartilhe com sua rede',
    seguranca: 'Orientações para se cuidar',
    direitos: 'Informação que fortalece',
    diario: 'Escreva no seu tempo',
    chat: 'Encontre caminhos de apoio',
    configuracao: 'Sua conta, do seu jeito',
  };
  const emergencia = actions.find((acao) => acao.id === 'sos');
  const grupos = [
    {
      titulo: 'Minha proteção',
      descricao: 'Sua rede de apoio sempre por perto',
      ids: ['guardioes', 'localizacao', 'seguranca', 'direitos'],
    },
    {
      titulo: perfil === 'guardiao' ? 'Meu espaço' : 'Meu cuidado',
      descricao: 'Um momento para você',
      ids: ['diario', 'chat', 'configuracao'],
    },
  ];
  return (
    <View style={s.acoes}>
      {emergencia && (
        <View
          style={[
            s.sosCardContainer,
            {
              backgroundColor: cores.superficie,
              borderColor:
                perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.3)' : 'rgba(255, 45, 85, 0.28)',
            },
          ]}
        >
          {/* TOPO COM IDENTIFICADOR */}
          <View style={s.sosCardTopo}>
            <View
              style={[
                s.sosBadgeAlerta,
                {
                  backgroundColor:
                    perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.14)' : 'rgba(255, 45, 85, 0.12)',
                },
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={16}
                color={perfil === 'guardiao' ? '#3A7E94' : '#FF2D55'}
              />
              <Text
                style={[s.sosBadgeTexto, { color: perfil === 'guardiao' ? '#3A7E94' : '#FF2D55' }]}
              >
                CENTRAL DE EMERGÊNCIA
              </Text>
            </View>
          </View>

          {/* O BOTÃO REDONDO DE SOS */}
          <View
            style={[
              s.sosAnelExterno,
              {
                borderColor:
                  perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.25)' : 'rgba(255, 45, 85, 0.25)',
                backgroundColor:
                  perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.08)' : 'rgba(255, 45, 85, 0.06)',
              },
            ]}
          >
            <View
              style={[
                s.sosAnelMedio,
                {
                  borderColor:
                    perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.45)' : 'rgba(255, 45, 85, 0.45)',
                  backgroundColor:
                    perfil === 'guardiao' ? 'rgba(58, 126, 148, 0.18)' : 'rgba(255, 45, 85, 0.15)',
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Botão SOS Emergência"
                accessibilityHint="Segure por 2 segundos para acionar ou toque para abrir a central"
                delayLongPress={2000}
                onLongPress={() => onActionPress?.('sos')}
                onPress={() => onActionPress?.('sos')}
                style={({ pressed }) => [
                  s.sosBotaoRedondo,
                  { transform: [{ scale: pressed ? 0.94 : 1 }] },
                ]}
              >
                <LinearGradient
                  colors={
                    perfil === 'guardiao'
                      ? ['#3A7E94', '#1F5366', '#143845']
                      : ['#FF2D55', '#E91E63', '#A00D49']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.sosGradiente}
                >
                  <Ionicons
                    name={perfil === 'guardiao' ? 'call' : 'shield-checkmark'}
                    size={38}
                    color="#FFFFFF"
                  />
                  <Text maxFontSizeMultiplier={1.3} style={s.sosTituloRedondo} numberOfLines={1}>
                    {perfil === 'guardiao' ? 'POLÍCIA' : 'SOS'}
                  </Text>
                  <View style={s.sosPillBadge}>
                    <Text maxFontSizeMultiplier={1.3} style={s.sosPillText}>
                      {perfil === 'guardiao' ? 'LIGAR 190' : 'SEGURE 2s'}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* INSTRUÇÃO FORA DO BOTÃO (NUNCA CORTA TEXTO) */}
          <View style={s.sosTextosBox}>
            <Text style={[s.sosTituloChamada, { color: cores.texto }]}>
              {perfil === 'guardiao' ? 'Acione a Polícia Militar' : 'Acione sua Rede de Proteção'}
            </Text>
            <Text style={[s.sosSubtituloChamada, { color: cores.secundario }]}>
              {perfil === 'guardiao'
                ? 'Segure o botão por 2s para ligar direto para o 190'
                : 'Segure 2s para alertar guardiões ou toque para abrir a central'}
            </Text>
          </View>

          {/* ATALHOS RÁPIDOS DE LIGAÇÃO */}
          <View style={[s.sosBotoesRapidos, colunaUnica && { flexDirection: 'column' }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ligar 190 Polícia Militar"
              onPress={() => Linking.openURL('tel:190')}
              style={({ pressed }) => [
                s.sosBotaoLinha,
                {
                  backgroundColor: '#FFF0F3',
                  borderColor: '#FFCCD5',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="call" size={16} color="#D61B48" />
              <Text style={[s.sosBotaoLinhaTexto, { color: '#D61B48' }]}>Ligar 190 (Polícia)</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ligar 180 Central da Mulher"
              onPress={() => Linking.openURL('tel:180')}
              style={({ pressed }) => [
                s.sosBotaoLinha,
                {
                  backgroundColor: '#F5EFFB',
                  borderColor: '#E2D1F5',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="call" size={16} color="#7043AA" />
              <Text style={[s.sosBotaoLinhaTexto, { color: '#7043AA' }]}>Ligar 180 (Mulher)</Text>
            </Pressable>
          </View>
        </View>
      )}
      <Text
        accessibilityRole="header"
        style={[s.secaoTitulo, { color: cores.texto, marginBottom: 20 }]}
      >
        Como podemos ajudar?
      </Text>
      {grupos.map((grupo) => {
        const itens = grupo.ids.map((id) => actions.find((acao) => acao.id === id)).filter(Boolean);
        if (!itens.length) return null;
        return (
          <View key={grupo.titulo} style={s.grupo}>
            <View style={s.secao}>
              <Text accessibilityRole="header" style={[s.grupoTitulo, { color: cores.texto }]}>
                {grupo.titulo}
              </Text>
              <Text style={[s.secaoLegenda, { color: cores.secundario }]}>{grupo.descricao}</Text>
            </View>
            <View style={s.grade}>
              {itens.map((acao) => (
                <ToqueSuave
                  key={acao.id}
                  accessibilityRole="button"
                  accessibilityLabel={acao.label || acao.title}
                  onPress={() => onActionPress?.(acao.id)}
                  style={[
                    s.acao,
                    colunaUnica && { width: '100%' },
                    acao.id === 'configuracao' && s.acaoLarga,
                    { backgroundColor: cores.superficie, borderColor: cores.borda },
                  ]}
                >
                  <View style={s.acaoTopo}>
                    <View style={[s.icone, { backgroundColor: cores.suave }]}>
                      <Ionicons name={acao.icon} size={23} color={cores.destaque} />
                    </View>
                    <Ionicons name="chevron-forward-outline" size={17} color={cores.secundario} />
                  </View>
                  <View style={s.acaoConteudo}>
                    <Text style={[s.acaoTexto, { color: cores.texto }]}>
                      {acao.label || acao.title}
                    </Text>
                    <Text style={[s.acaoDescricao, { color: cores.secundario }]}>
                      {descricoes[acao.id]}
                    </Text>
                  </View>
                </ToqueSuave>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function ApoioJaci({ onPress }) {
  const cores = useCoresIdentidade();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Central de Atendimento à Mulher, 180"
      onPress={onPress}
      style={({ pressed }) => [
        s.apoio,
        { backgroundColor: cores.suave, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name="call-outline" size={25} color={cores.destaque} />
      <View style={{ flex: 1 }}>
        <Text style={[s.apoioTitulo, { color: cores.texto }]}>Uma voz para te acolher</Text>
        <Text style={[s.apoioDescricao, { color: cores.secundario }]}>
          Central da Mulher · 24 horas
        </Text>
      </View>
      <Text style={[s.telefone, { color: cores.destaque }]}>180</Text>
    </Pressable>
  );
}
