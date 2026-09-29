// O mapa recebe apenas posições já autorizadas pela API; nunca recebe tokens.
export const documentoMapa = `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<style>
*{box-sizing:border-box}html,body,#map{height:100%;width:100%;margin:0;font-family:system-ui,sans-serif}body{background:#f6edf4;color:#35273e}#map{z-index:0}
.leaflet-container{background:#ede9e3;font-family:inherit}.leaflet-tile{filter:saturate(.68)}.leaflet-control-zoom{border:0!important;box-shadow:0 5px 24px #45234622!important;border-radius:16px!important;overflow:hidden}.leaflet-control-zoom a{width:40px!important;height:40px!important;line-height:40px!important;color:#9e257c!important}.leaflet-control-attribution{font-size:10px!important}
.etiqueta{position:absolute;z-index:500;top:18px;left:16px;max-width:calc(100% - 80px);padding:10px 14px;background:#ffffffed;box-shadow:0 6px 25px #45234612;border:1px solid #fff;border-radius:18px;pointer-events:none}.etiqueta small{display:block;color:#806c85;font-size:9px;font-weight:700;letter-spacing:2px;margin-bottom:4px}.etiqueta strong{font-size:13px}
#centralizar{position:absolute;z-index:500;right:12px;bottom:38px;border:1px solid #ead9e8;border-radius:16px;background:white;color:#a3267d;box-shadow:0 6px 25px #45234622;padding:12px;cursor:pointer;font-weight:700;min-height:44px}button:focus-visible{outline:3px solid #7b32ba;outline-offset:3px}
#estado{position:absolute;z-index:500;bottom:38px;left:14px;max-width:calc(100% - 160px);font-size:11px;line-height:16px;color:#705d75;background:#fffffff0;border-radius:12px;padding:9px 12px;pointer-events:none}#falha{position:absolute;z-index:800;inset:0;display:flex;align-items:center;justify-content:center;padding:30px;text-align:center;background:#f9f0f7;color:#705d75;font-size:14px}#falha[hidden]{display:none}
.pin{background:transparent;border:0}.pin svg{overflow:visible;filter:drop-shadow(0 5px 6px #78205c38)}.pulso{transform-origin:32px 32px;animation:onda 2.4s ease-out infinite}.parado .pulso{animation:none;opacity:.08}.parado{filter:grayscale(1)}@keyframes onda{0%{transform:scale(.7);opacity:.5}100%{transform:scale(1.65);opacity:0}}@media(prefers-reduced-motion:reduce){.pulso{animation:none}}
.leaflet-tooltip{border:0;border-radius:10px;padding:6px 10px;color:#60224f;font-weight:600;box-shadow:0 3px 12px #45234620}.leaflet-tooltip:before{display:none}
</style></head><body><div id="map" aria-label="Mapa interativo de localizações"></div>
<div class="etiqueta"><small>JACI • SUA REDE</small><strong>O cuidado acompanha você</strong></div>
<button id="centralizar" aria-label="Centralizar posições no mapa">◎ Centralizar</button>
<div id="estado">Aguardando uma posição compartilhada</div><div id="falha">Preparando seu mapa…</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
(function(){
var aviso=document.getElementById('falha');
function emitir(tipo){var msg=JSON.stringify({tipo:tipo});if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(msg);else parent.postMessage(msg,'*');}
if(!window.L){aviso.textContent='Não foi possível carregar o mapa. Confira sua conexão e toque em Recarregar mapa.';emitir('erro');return;}
var mapa=L.map('map',{zoomControl:false,scrollWheelZoom:false}).setView([-14.2,-51.9],4);
L.control.zoom({position:'topright'}).addTo(mapa);
var tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(mapa);
tiles.on('tileerror',function(){document.getElementById('estado').textContent='Mapa indisponível. Verifique sua conexão.';});
var marcadores={},posicoes=[],seguir=true,primeiro=true,selecionado=null;
var reduzir=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
mapa.on('dragstart zoomstart',function(e){if(e.type==='dragstart')seguir=false;});
function recente(p){var idade=Date.now()-new Date(p.atualizadoEm).getTime();return idade>=-30000&&idade<60000;}
function icone(p){return L.divIcon({className:'pin'+(recente(p)?'':' parado'),iconSize:[64,64],iconAnchor:[32,32],html:'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle class="pulso" cx="32" cy="32" r="25" fill="#d6339e"/><circle cx="32" cy="32" r="21" fill="#fff"/><circle cx="32" cy="32" r="17" fill="#c52e97"/><path d="M32 43s-11-7-11-14a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7-11 14-11 14z" fill="white"/></svg>'});}
function enquadrar(){if(!posicoes.length)return;var alvo=posicoes.find(function(p){return String(p.idLocalizacaoUsuario)===String(selecionado);});if(alvo){mapa.flyTo([alvo.latitude,alvo.longitude],Math.max(15,mapa.getZoom()),{animate:!reduzir,duration:.8});}else{mapa.fitBounds(posicoes.map(function(p){return [p.latitude,p.longitude];}),{padding:[65,85],maxZoom:16,animate:!reduzir});}}
document.getElementById('centralizar').onclick=function(){seguir=true;enquadrar();};
function mover(m,p){if(m.frame)cancelAnimationFrame(m.frame);var origem=m.getLatLng(),inicio=performance.now();function passo(agora){var t=reduzir?1:Math.min(1,(agora-inicio)/900),f=t*(2-t);m.setLatLng([origem.lat+(p.latitude-origem.lat)*f,origem.lng+(p.longitude-origem.lng)*f]);if(t<1)m.frame=requestAnimationFrame(passo);}m.frame=requestAnimationFrame(passo);}
window.jaciAtualizar=function(dados){
if(!dados||!Array.isArray(dados.posicoes))return;
posicoes=dados.posicoes.filter(function(p){return Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;});
var mudouSelecao=selecionado!==dados.selecionado;selecionado=dados.selecionado;
var ids=new Set(posicoes.map(function(p){return String(p.idLocalizacaoUsuario);}));
Object.keys(marcadores).forEach(function(id){if(!ids.has(id)){cancelAnimationFrame(marcadores[id].frame);mapa.removeLayer(marcadores[id]);delete marcadores[id];}});
posicoes.forEach(function(p){var id=String(p.idLocalizacaoUsuario),m=marcadores[id];var texto=document.createElement('span');texto.textContent=p.nome||'Posição compartilhada';if(!m){m=L.marker([p.latitude,p.longitude],{icon:icone(p),title:p.nome||'Posição compartilhada'}).addTo(mapa).bindTooltip(texto,{direction:'top',offset:[0,-24]});marcadores[id]=m;}else{m.setIcon(icone(p));m.setTooltipContent(texto);mover(m,p);}m.on('click',function(){selecionado=id;seguir=true;});});
document.getElementById('estado').textContent=posicoes.length?(dados.desconectado?'Sem conexão • última posição recebida':posicoes.some(recente)?'Posição recebida há menos de 1 min':'Última posição • aguardando atualização'):'Nenhuma posição compartilhada';
if(posicoes.length&&(primeiro||mudouSelecao||seguir)){enquadrar();primeiro=false;}if(!posicoes.length)primeiro=true;
};
window.addEventListener('message',function(e){if(e.source!==parent)return;try{var d=typeof e.data==='string'?JSON.parse(e.data):e.data;if(d.tipo==='posicoes')window.jaciAtualizar(d);}catch(_){}});
aviso.hidden=true;emitir('pronto');
new ResizeObserver(function(){mapa.invalidateSize();}).observe(document.body);
})();
</script></body></html>`;
