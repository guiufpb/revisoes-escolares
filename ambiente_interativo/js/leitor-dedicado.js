import './pdfjs.bundle.mjs';
import './registro-leituras.js';
import './glossario.js';

const parametros = new URLSearchParams(window.location.search);
const livro =
  window.RegistroLeituras.obter(parametros.get('livro')) ||
  window.RegistroLeituras.obter('primeiras-licoes-dinheiro');
const TOTAL_PAGINAS = livro.totalPaginas;
const LIVRO_ID = livro.id;
const TITULO = livro.titulo;
const perfil = parametros.get('perfil') === 'mariana' ? 'mariana' : 'alice';
let paginaAtual = limitar(parametros.get('pagina'), 1, TOTAL_PAGINAS);
let zoom = 1;
let documentoPdf;
let tarefaRenderizacao;
let sequenciaRenderizacao = 0;
let temporizadorRedimensionamento;

function elemento(id) {
  return document.getElementById(id);
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, Math.trunc(Number(valor) || minimo)));
}

function anunciar(texto) {
  elemento('anuncio-leitor-dedicado').textContent = texto;
}

function notificarJanelaPrincipal(tipo, pagina) {
  if (!window.opener || window.opener.closed) return;
  window.opener.postMessage(
    { tipo: tipo, livroId: LIVRO_ID, perfil: perfil, pagina: pagina },
    window.location.origin
  );
}

function atualizarControles() {
  elemento('contador-pagina-dedicado').textContent =
    'Página ' + paginaAtual + ' de ' + TOTAL_PAGINAS;
  elemento('pagina-anterior-dedicado').disabled = paginaAtual <= 1;
  elemento('proxima-pagina-dedicado').disabled = paginaAtual >= TOTAL_PAGINAS;
  elemento('terminar-leitura-dedicado').hidden = paginaAtual !== TOTAL_PAGINAS;
  elemento('terminar-leitura-dedicado').textContent = livro.explicacaoFinal
    ? 'Ver explicação do eclipse'
    : 'Terminei - responder perguntas';
  elemento('zoom-dedicado').textContent = Math.round(zoom * 100) + '%';
  elemento('diminuir-zoom-dedicado').disabled = zoom <= 0.75;
  elemento('aumentar-zoom-dedicado').disabled = zoom >= 1.75;
  window.GlossarioRevisoes.atualizarBotaoPagina(
    elemento('palavras-pagina-dedicado'),
    livro,
    paginaAtual
  );
}

function atualizarEndereco() {
  const url = new URL(window.location.href);
  url.searchParams.set('perfil', perfil);
  url.searchParams.set('livro', LIVRO_ID);
  url.searchParams.set('pagina', paginaAtual);
  window.history.replaceState(null, '', url);
}

async function renderizarPagina(pagina) {
  pagina = limitar(pagina, 1, TOTAL_PAGINAS);
  const minhaSequencia = ++sequenciaRenderizacao;
  if (tarefaRenderizacao) tarefaRenderizacao.cancel();
  const estadoVisivel = elemento('estado-leitor-dedicado');
  estadoVisivel.hidden = false;
  estadoVisivel.classList.remove('erro');
  estadoVisivel.textContent = 'Preparando a página ' + pagina + '...';

  try {
    const paginaPdf = await documentoPdf.getPage(pagina);
    if (minhaSequencia !== sequenciaRenderizacao) return;
    const recipiente = elemento('canvas-leitor-dedicado').parentElement;
    const canvas = elemento('canvas-leitor-dedicado');
    const base = paginaPdf.getViewport({ scale: 1 });
    const larguraDisponivel = Math.max(
      280,
      Math.min(recipiente.clientWidth - 24, window.innerWidth - 24)
    );
    const alturaDisponivel = Math.max(200, recipiente.clientHeight - 24);
    const escalaBase = Math.min(larguraDisponivel / base.width, alturaDisponivel / base.height);
    const viewport = paginaPdf.getViewport({ scale: escalaBase * zoom });
    const proporcao = Math.max(1, window.devicePixelRatio || 1);
    const contexto = canvas.getContext('2d', { alpha: false });

    canvas.width = Math.max(1, Math.round(viewport.width * proporcao));
    canvas.height = Math.max(1, Math.round(viewport.height * proporcao));
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    canvas.setAttribute('aria-label', 'Página ' + pagina + ' do livro ' + TITULO);
    tarefaRenderizacao = paginaPdf.render({
      canvasContext: contexto,
      viewport: viewport,
      transform: proporcao === 1 ? null : [proporcao, 0, 0, proporcao, 0, 0],
    });
    await tarefaRenderizacao.promise;
    if (minhaSequencia !== sequenciaRenderizacao) return;
    tarefaRenderizacao = null;
    paginaAtual = pagina;
    estadoVisivel.hidden = true;
    atualizarControles();
    atualizarEndereco();
    anunciar('Página ' + pagina + ' carregada.');
    notificarJanelaPrincipal('leitura-pagina', pagina);
  } catch (erro) {
    if (erro && erro.name === 'RenderingCancelledException') return;
    estadoVisivel.classList.add('erro');
    estadoVisivel.textContent =
      'Não foi possível mostrar esta página. Volte à janela principal ou abra o PDF original.';
    console.warn('O leitor dedicado não pôde renderizar a página.', erro);
  }
}

function alterarZoom(valor) {
  zoom = Math.max(0.75, Math.min(1.75, valor));
  atualizarControles();
  renderizarPagina(paginaAtual);
}

async function alternarTelaCheia() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch (_erro) {
    anunciar('O navegador não permitiu a tela cheia. A janela ampla continua disponível.');
  }
}

function registrarEventos() {
  elemento('pagina-anterior-dedicado').addEventListener('click', () => {
    renderizarPagina(paginaAtual - 1);
  });
  elemento('proxima-pagina-dedicado').addEventListener('click', () => {
    renderizarPagina(paginaAtual + 1);
  });
  elemento('ajustar-pagina-dedicado').addEventListener('click', () => alterarZoom(1));
  elemento('diminuir-zoom-dedicado').addEventListener('click', () => alterarZoom(zoom - 0.25));
  elemento('aumentar-zoom-dedicado').addEventListener('click', () => alterarZoom(zoom + 0.25));
  elemento('alternar-tela-cheia').addEventListener('click', alternarTelaCheia);
  elemento('terminar-leitura-dedicado').addEventListener('click', () => {
    notificarJanelaPrincipal(
      livro.explicacaoFinal ? 'leitura-explicacao' : 'leitura-questionario',
      TOTAL_PAGINAS
    );
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    elemento('alternar-tela-cheia').textContent = document.fullscreenElement
      ? '↙ Sair da tela cheia'
      : '⛶ Tela cheia';
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    evento.preventDefault();
    renderizarPagina(paginaAtual + (evento.key === 'ArrowLeft' ? -1 : 1));
  });
  window.addEventListener('resize', () => {
    window.clearTimeout(temporizadorRedimensionamento);
    temporizadorRedimensionamento = window.setTimeout(() => renderizarPagina(paginaAtual), 100);
  });
}

async function inicializar() {
  registrarEventos();
  document.title = 'Leitor - ' + TITULO;
  elemento('titulo-leitor-dedicado').textContent = TITULO;
  elemento('abrir-pdf-original-dedicado').href = livro.arquivoPdf;
  atualizarControles();
  try {
    const urlPdf = new URL(livro.arquivoPdf, document.baseURI).href;
    documentoPdf = await window.PDFJSLocal.getDocument({ url: urlPdf }).promise;
    if (documentoPdf.numPages !== TOTAL_PAGINAS) {
      throw new Error('O PDF não contém as ' + TOTAL_PAGINAS + ' páginas esperadas.');
    }
    await renderizarPagina(paginaAtual);
    document.documentElement.classList.add('leitor-pronto');
  } catch (erro) {
    const estadoVisivel = elemento('estado-leitor-dedicado');
    estadoVisivel.classList.add('erro');
    estadoVisivel.textContent =
      'Não foi possível abrir o livro. Volte à janela principal ou abra o PDF original.';
    console.warn('O leitor dedicado não pôde ser inicializado.', erro);
  }
}

inicializar();
