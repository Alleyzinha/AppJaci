import React, { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { documentoMapa } from './documento';

export default function MapaLocalizacao({ posicoes, selecionado, desconectado }) {
  const mapa = useRef(null);
  const [pronto, definirPronto] = useState(false);
  useEffect(() => {
    if (!pronto) return;
    const dados = JSON.stringify({ posicoes, selecionado, desconectado }).replace(/</g, '\\u003c');
    mapa.current?.injectJavaScript(`window.jaciAtualizar && window.jaciAtualizar(${dados}); true;`);
  }, [pronto, posicoes, selecionado, desconectado]);
  return (
    <WebView
      ref={mapa}
      source={{ html: documentoMapa }}
      originWhitelist={['*']}
      style={{ flex: 1, backgroundColor: '#f6edf4' }}
      scrollEnabled={false}
      javaScriptEnabled
      domStorageEnabled
      nestedScrollEnabled
      onMessage={({ nativeEvent }) => {
        try {
          if (JSON.parse(nativeEvent.data).tipo === 'pronto') definirPronto(true);
        } catch {}
      }}
      onShouldStartLoadWithRequest={({ url }) => {
        if (url === 'about:blank') return true;
        if (url.startsWith('https://www.openstreetmap.org/copyright'))
          Linking.openURL(url).catch(() => {});
        return false;
      }}
    />
  );
}
