import React, { useEffect, useRef, useState } from 'react';
import { documentoMapa } from './documento';

export default function MapaLocalizacao({ posicoes, selecionado, desconectado }) {
  const frame = useRef(null);
  const [pronto, definirPronto] = useState(false);
  useEffect(() => {
    function receber(evento) {
      if (evento.source !== frame.current?.contentWindow) return;
      try {
        if (JSON.parse(evento.data).tipo === 'pronto') definirPronto(true);
      } catch {}
    }
    window.addEventListener('message', receber);
    return () => window.removeEventListener('message', receber);
  }, []);
  useEffect(() => {
    if (pronto)
      frame.current?.contentWindow?.postMessage(
        { tipo: 'posicoes', posicoes, selecionado, desconectado },
        '*',
      );
  }, [pronto, posicoes, selecionado, desconectado]);
  return (
    <iframe
      ref={frame}
      title="Mapa interativo da sua rede de proteção"
      srcDoc={documentoMapa}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#f6edf4' }}
    />
  );
}
