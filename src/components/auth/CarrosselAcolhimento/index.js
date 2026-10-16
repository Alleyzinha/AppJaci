import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const fotos = [
  {
    imagem: require('../../../../assets/auth/acolhimento.jpg'),
    titulo: 'Seu tempo.\nSeu espaço. Seu cuidado.',
    texto: 'Acolhimento para viver cada novo passo com mais confiança.',
    alt: 'Mulher em um momento tranquilo em casa.',
    tema: 'ACOLHIMENTO',
    icone: 'heart-outline',
  },
  {
    imagem: require('../../../../assets/auth/conexao.jpg'),
    titulo: 'Você merece\nseguir em frente.',
    texto: 'Um lugar para se ouvir, se fortalecer e cuidar de você.',
    alt: 'Mulher sorrindo em uma mesa com seu computador.',
    tema: 'AUTONOMIA',
    icone: 'flower-outline',
  },
  {
    imagem: require('../../../../assets/auth/cuidado.jpg'),
    titulo: 'O cuidado cresce\nquando é compartilhado.',
    texto: 'Conecte-se às pessoas de confiança que fazem parte da sua rede.',
    alt: 'Grupo de pessoas reunidas, com os braços sobre os ombros umas das outras.',
    tema: 'CONEXÃO',
    icone: 'people-outline',
  },
];

export default function CarrosselAcolhimento({ compacto = false }) {
  const [indice, setIndice] = useState(0);
  const [movimentoReduzido, setMovimentoReduzido] = useState(true);
  const opacidade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let montado = true;
    AccessibilityInfo.isReduceMotionEnabled().then((valor) => {
      if (montado) setMovimentoReduzido(valor);
    });
    const movimento = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setMovimentoReduzido,
    );
    return () => {
      montado = false;
      movimento.remove();
    };
  }, []);

  useEffect(() => {
    if (movimentoReduzido) {
      opacidade.setValue(1);
      return;
    }
    opacidade.setValue(0.5);
    const animacao = Animated.timing(opacidade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });
    animacao.start();
    return () => animacao.stop();
  }, [indice, movimentoReduzido, opacidade]);

  const navegar = (passo) => {
    setIndice((atual) => (atual + passo + fotos.length) % fotos.length);
  };
  const gesto = PanResponder.create({
    onMoveShouldSetPanResponder: (_, estado) =>
      Math.abs(estado.dx) > 30 && Math.abs(estado.dx) > Math.abs(estado.dy),
    onPanResponderRelease: (_, estado) => {
      if (Math.abs(estado.dx) > 40) navegar(estado.dx < 0 ? 1 : -1);
    },
  });
  const foto = fotos[indice];

  return (
    <View style={[styles.container, compacto && styles.compacto]} {...gesto.panHandlers}>
      <Animated.View style={[styles.foto, { opacity: opacidade }]}>
        <Image
          source={foto.imagem}
          accessibilityLabel={foto.alt}
          resizeMode="cover"
          style={styles.foto}
        />
      </Animated.View>
      <LinearGradient
        colors={['rgba(24,37,36,0.12)', 'rgba(24,37,36,0.02)', 'rgba(24,37,36,0.92)']}
        locations={[0, 0.3, 1]}
        style={styles.foto}
        pointerEvents="none"
      />
      <View style={[styles.conteudo, compacto && styles.conteudoCompacto]}>
        <View style={styles.topo}>
          <View style={styles.selo}>
            <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
            <Text style={styles.seloTexto}>UM PASSO DE CADA VEZ</Text>
          </View>
          {!compacto && <Text style={styles.numero}>0{indice + 1} / 03</Text>}
        </View>
        <View style={styles.mensagem}>
          <View style={styles.tema}>
            <Ionicons name={foto.icone} size={18} color="#F8CEDB" />
            <Text style={styles.temaTexto}>{foto.tema}</Text>
          </View>
          <Text style={[styles.titulo, compacto && styles.tituloCompacto]}>{foto.titulo}</Text>
          {!compacto && <Text style={styles.descricao}>{foto.texto}</Text>}
          <View style={styles.controles}>
            <View style={styles.indicadores}>
              {fotos.map((item, posicao) => (
                <Pressable
                  key={item.tema}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver foto ${posicao + 1}: ${item.tema.toLowerCase()}`}
                  accessibilityState={{ selected: indice === posicao }}
                  onPress={() => setIndice(posicao)}
                  style={styles.alvoIndicador}
                >
                  <View style={[styles.indicador, indice === posicao && styles.indicadorAtivo]} />
                </Pressable>
              ))}
            </View>
            <View style={styles.setas}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Foto anterior"
                onPress={() => navegar(-1)}
                style={({ pressed }) => [styles.seta, pressed && styles.pressionado]}
              >
                <Ionicons name="arrow-back" size={19} color="#FFFFFF" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Próxima foto"
                onPress={() => navegar(1)}
                style={({ pressed }) => [styles.seta, pressed && styles.pressionado]}
              >
                <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
