import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TelaPadrao, { useCoresTela } from '@/components/ui/TelaPadrao';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { useThemeStore } from '@/stores/theme.store';
import { colors } from '@/styles/tokens';
import { styles } from './styles';

const assuntos = [
  {
    id: 'legislacao',
    icone: 'scale-outline',
    categoria: 'Legislação',
    titulo: 'Lei Maria da Penha',
    descricao: 'Direitos e proteções garantidas às mulheres.',
  },
  {
    id: 'protecao',
    icone: 'shield-outline',
    categoria: 'Proteção',
    titulo: 'Medida protetiva de urgência',
    descricao: 'Informações sobre medidas de proteção.',
  },
  {
    id: 'denuncia',
    icone: 'document-text-outline',
    categoria: 'Denúncia',
    titulo: 'Como registrar um B.O.',
    descricao: 'Orientações sobre o boletim de ocorrência.',
  },
];
const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function DireitosScreen({ perfil = 'protegida' }) {
  const cores = useCoresTela();
  const escuro = useThemeStore((estado) => estado.isDark);
  const destaque = escuro
    ? cores.destaque
    : perfil === 'guardiao'
      ? colors.guardiao.primary
      : colors.protegida.primaryDark;
  const suave = escuro ? cores.suave : perfil === 'guardiao' ? '#EAF5F6' : '#FFF0F7';
  const [busca, definirBusca] = useState('');
  const encontrados = useMemo(
    () =>
      assuntos.filter((item) =>
        normalizar(`${item.categoria} ${item.titulo} ${item.descricao}`).includes(
          normalizar(busca.trim()),
        ),
      ),
    [busca],
  );
  return (
    <TelaPadrao
      perfil={perfil}
      ativo="direitos"
      titulo="Informação que fortalece"
      descricao="Conheça os temas que fazem parte do seu guia de direitos."
      icone="scale-outline"
    >
      <View style={[styles.busca, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
        <Ionicons name="search-outline" size={21} color={destaque} />
        <TextInput
          accessibilityLabel="Buscar informações"
          placeholder="Busque um tema ou uma palavra"
          placeholderTextColor={cores.secundario}
          value={busca}
          onChangeText={definirBusca}
          style={[styles.campo, { color: cores.texto }]}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            onPress={() => definirBusca('')}
            style={styles.limpar}
          >
            <Ionicons name="close-outline" size={21} color={cores.secundario} />
          </Pressable>
        )}
      </View>
      <View style={styles.cabecalhoLista}>
        <Text style={[styles.secao, { color: cores.texto }]}>Guia de direitos</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.contagem, { color: cores.secundario }]}
        >
          {encontrados.length} {encontrados.length === 1 ? 'tema' : 'temas'}
        </Text>
      </View>
      {encontrados.map((item) => (
        <View
          key={item.id}
          style={[styles.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
        >
          <View style={styles.topoCartao}>
            <View style={[styles.icone, { backgroundColor: suave }]}>
              <Ionicons name={item.icone} size={24} color={destaque} />
            </View>
            <Text style={[styles.categoria, { color: destaque }]}>{item.categoria}</Text>
          </View>
          <Text style={[styles.titulo, { color: cores.texto }]}>{item.titulo}</Text>
          <Text style={[styles.descricao, { color: cores.secundario }]}>{item.descricao}</Text>
          <View style={[styles.rodape, { borderTopColor: cores.borda }]}>
            <Ionicons name="book-outline" size={15} color={cores.secundario} />
            <Text style={[styles.disponibilidade, { color: cores.secundario }]}>
              Conteúdo completo em preparação
            </Text>
          </View>
        </View>
      ))}
      {encontrados.length === 0 && (
        <EstadoVazio
          icone="search-outline"
          titulo="Vamos tentar outra palavra?"
          descricao="Nenhum tema encontrado. Busque por lei, proteção ou denúncia."
        />
      )}
    </TelaPadrao>
  );
}
