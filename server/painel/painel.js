'use strict';

const elemento = (id) => document.getElementById(id);
let token = null;
let pagina = 1;
let totalPaginas = 1;
let solicitacao = null;
let entrando = false;
let filtrosAplicados = { busca: '', perfil: 'todos', confirmacao: 'todos' };

async function consultarApi(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, {
    ...opcoes,
    cache: 'no-store',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    const erro = new Error(dados.error || 'Não foi possível consultar os dados.');
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

function mensagem(id, texto, erro = false) {
  elemento(id).textContent = texto;
  elemento(id).classList.toggle('erro', erro);
}

function sair() {
  solicitacao?.abort();
  token = null;
  pagina = 1;
  totalPaginas = 1;
  elemento('painel').hidden = true;
  elemento('sessao').hidden = true;
  elemento('entrada').hidden = false;
  elemento('usuarios').replaceChildren();
  elemento('nome-administrador').textContent = '';
  elemento('quantidade').textContent = '';
  elemento('senha').value = '';
  elemento('filtros').reset();
  filtrosAplicados = { busca: '', perfil: 'todos', confirmacao: 'todos' };
  for (const chave of ['total', 'protegidas', 'guardioes', 'pendentes'])
    elemento(chave).textContent = '—';
  elemento('email').focus();
}

function definirCarregamento(ocupado) {
  elemento('painel').setAttribute('aria-busy', String(ocupado));
  elemento('atualizar').disabled = ocupado;
  for (const campo of elemento('filtros').elements) campo.disabled = ocupado;
  elemento('anterior').disabled = ocupado || pagina <= 1;
  elemento('proxima').disabled = ocupado || pagina >= totalPaginas;
}

function celula(texto, secundario) {
  const td = document.createElement('td');
  td.textContent = texto;
  if (secundario) {
    const detalhe = document.createElement('small');
    detalhe.textContent = secundario;
    td.append(detalhe);
  }
  return td;
}

function selo(texto, classe = '') {
  const td = document.createElement('td');
  const etiqueta = document.createElement('span');
  etiqueta.className = `selo ${classe}`;
  etiqueta.textContent = texto;
  td.append(etiqueta);
  return td;
}

function mostrarUsuarios(dados) {
  const linhas = document.createDocumentFragment();
  for (const usuario of dados.usuarios) {
    const linha = document.createElement('tr');
    const data = new Date(usuario.criadoEm);
    linha.append(
      celula(usuario.nome, `Cadastro #${usuario.idUsuario}`),
      celula(usuario.email, usuario.telefone),
      selo(
        usuario.perfil === 'administrador'
          ? 'Administrador'
          : usuario.perfil === 'protegida'
            ? 'Protegida'
            : 'Guardião',
        usuario.perfil === 'administrador'
          ? 'administrador'
          : usuario.perfil === 'protegida'
            ? 'protegida'
            : 'guardiao',
      ),
      selo(
        usuario.emailConfirmadoEm ? 'Confirmado' : 'Pendente',
        usuario.emailConfirmadoEm ? 'confirmado' : 'pendente',
      ),
      celula(
        data.toLocaleDateString('pt-BR'),
        data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ),
    );
    linhas.append(linha);
  }
  elemento('usuarios').replaceChildren(linhas);
  totalPaginas = Math.max(1, Math.ceil(dados.total / dados.porPagina));
  elemento('quantidade').textContent =
    `${dados.total} ${dados.total === 1 ? 'cadastro encontrado' : 'cadastros encontrados'}`;
  elemento('pagina-atual').textContent = `Página ${pagina} de ${totalPaginas}`;
  mensagem('aviso', dados.usuarios.length ? '' : 'Nenhum cadastro encontrado. Tente outro filtro.');
}

async function carregar() {
  solicitacao?.abort();
  const controle = new AbortController();
  solicitacao = controle;
  definirCarregamento(true);
  elemento('usuarios').replaceChildren();
  mensagem('aviso', 'Carregando cadastros…');
  try {
    const parametros = new URLSearchParams({ ...filtrosAplicados, pagina: String(pagina) });
    const [visaoGeral, dados] = await Promise.all([
      consultarApi('/api/admin/resumo', { signal: controle.signal }),
      consultarApi(`/api/admin/usuarios?${parametros}`, { signal: controle.signal }),
    ]);
    if (controle.signal.aborted) return;
    if (pagina > Math.max(1, Math.ceil(dados.total / dados.porPagina))) {
      pagina = Math.max(1, Math.ceil(dados.total / dados.porPagina));
      return await carregar();
    }
    elemento('nome-administrador').textContent = visaoGeral.administrador.nome;
    for (const [chave, valor] of Object.entries(visaoGeral.resumo))
      elemento(chave).textContent = Number(valor).toLocaleString('pt-BR');
    mostrarUsuarios(dados);
  } catch (erro) {
    if (controle.signal.aborted) return;
    if ([401, 403].includes(erro.status)) {
      sair();
      mensagem('erro-entrada', erro.message, true);
    } else {
      mensagem(
        'aviso',
        'Não foi possível carregar os cadastros. Use “Atualizar dados” para tentar novamente.',
        true,
      );
    }
  } finally {
    if (solicitacao === controle) definirCarregamento(false);
  }
}

elemento('formulario-entrada').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (entrando) return;
  entrando = true;
  elemento('entrar').disabled = true;
  elemento('entrar').textContent = 'Verificando acesso…';
  mensagem('erro-entrada', '');
  try {
    const dados = await consultarApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: elemento('email').value.trim(),
        password: elemento('senha').value,
      }),
    });
    token = dados.accessToken;
    await consultarApi('/api/admin/resumo');
    elemento('entrada').hidden = true;
    elemento('painel').hidden = false;
    elemento('sessao').hidden = false;
    await carregar();
  } catch (erro) {
    sair();
    mensagem(
      'erro-entrada',
      erro.status ? erro.message : 'Não foi possível conectar ao servidor. Tente novamente.',
      true,
    );
  } finally {
    elemento('senha').value = '';
    entrando = false;
    elemento('entrar').disabled = false;
    elemento('entrar').textContent = 'Entrar no painel';
  }
});

elemento('sair').addEventListener('click', () => {
  sair();
  mensagem('erro-entrada', 'Sessão encerrada.');
});
elemento('filtros').addEventListener('submit', (evento) => {
  evento.preventDefault();
  filtrosAplicados = {
    busca: elemento('busca').value.trim(),
    perfil: elemento('perfil').value,
    confirmacao: elemento('confirmacao').value,
  };
  pagina = 1;
  carregar();
});
elemento('limpar').addEventListener('click', () => {
  elemento('filtros').reset();
  filtrosAplicados = { busca: '', perfil: 'todos', confirmacao: 'todos' };
  pagina = 1;
  carregar();
});
elemento('anterior').addEventListener('click', () => {
  if (pagina > 1) {
    pagina--;
    carregar();
  }
});
elemento('proxima').addEventListener('click', () => {
  if (pagina < totalPaginas) {
    pagina++;
    carregar();
  }
});
elemento('atualizar').addEventListener('click', carregar);
// O token fica somente na memória da página. Recarregar exige um novo login.
