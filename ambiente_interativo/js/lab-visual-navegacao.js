/* global globalThis, module, require */
(function (root) {
  'use strict';
  const donos = new WeakMap();
  const ilustrada =
    typeof module !== 'undefined' && module.exports
      ? require('./lab-visual-ilustrada.js')
      : root.LabVisualIlustrada;
  const render =
    typeof module !== 'undefined' && module.exports
      ? require('./lab-visual-renderizador.js')
      : root.LabVisualRenderizador;
  const recusa = (codigo) =>
    Object.freeze({ status: 'recusado', codigo, admissaoOperacional: false });
  function criarPreviaNavegavelVisual(raiz) {
    const doc = raiz?.ownerDocument,
      win = doc?.defaultView;
    if (arguments.length !== 1 || !win?.Element || !(raiz instanceof win.Element))
      return recusa('NAV_RAIZ_INVALIDA');
    if (donos.has(raiz)) return recusa('NAV_PROPRIEDADE_OCUPADA');
    const dono = {};
    donos.set(raiz, dono);
    let geracao = 0,
      estado = 'inicial',
      indice = null,
      total = 0,
      erro = null;
    let atual = null,
      retido = null,
      candidato = null,
      timer = null,
      observer = null;
    let observacaoPendente = false;
    function el(tag, texto) {
      const n = doc.createElement(tag);
      if (texto !== undefined) n.textContent = texto;
      return n;
    }
    const painel = el('section'),
      titulo = el('h1', 'LAB · Prévia de atividade');
    painel.className = 'lab-v3-navegacao';
    const rotulo = el('label', 'Selecionar ZIP local '),
      arquivo = el('input');
    arquivo.type = 'file';
    arquivo.accept = '.zip,application/zip';
    rotulo.append(arquivo);
    const anterior = el('button', 'Anterior'),
      proxima = el('button', 'Próxima');
    const fechar = el('button', 'Encerrar prévia'),
      posicao = el('p', 'Nenhuma atividade aberta.');
    for (const b of [anterior, proxima, fechar]) b.type = 'button';
    posicao.setAttribute('tabindex', '-1');
    const aviso = el('p'),
      conteudo = el('section'),
      controles = el('nav');
    aviso.setAttribute('role', 'status');
    controles.setAttribute('aria-label', 'Navegação da prévia');
    conteudo.setAttribute('aria-label', 'Questão ilustrada');
    controles.append(anterior, proxima, fechar);
    painel.append(
      titulo,
      el('p', 'Prévia local, sem respostas, pontos ou salvamento.'),
      rotulo,
      posicao,
      controles,
      aviso,
      conteudo
    );
    raiz.append(painel);
    const vigente = (c) => atual === c && geracao === c.g && estado !== 'descartada';
    function apresentacao() {
      return atual?.renderer?.consultarEstado() || null;
    }
    function podeNavegar(r) {
      return estado === 'disponivel' && !r?.operacaoPendente && r?.estado !== 'carregando';
    }
    function atualizar() {
      const r = apresentacao();
      if (r?.estado === 'falha') {
        estado = 'falha';
        erro = 'NAV_APRESENTACAO_FALHOU';
      }
      const pode = podeNavegar(r);
      anterior.setAttribute('aria-disabled', !pode || indice === 0 ? 'true' : 'false');
      proxima.setAttribute('aria-disabled', !pode || indice === total - 1 ? 'true' : 'false');
      posicao.textContent =
        indice === null ? 'Nenhuma atividade aberta.' : 'Questão ' + (indice + 1) + ' de ' + total;
    }
    function mensagem(s) {
      if (aviso.textContent !== s) aviso.textContent = s;
    }
    function pararTimer() {
      if (timer !== null) win.clearTimeout(timer);
      timer = null;
    }
    function pararObserver() {
      observer?.disconnect();
      observer = null;
      observacaoPendente = false;
    }
    function observar(c) {
      observer = new win.MutationObserver(() => {
        if (!vigente(c) || observacaoPendente) return;
        observacaoPendente = true;
        win.queueMicrotask(() => {
          if (!vigente(c)) return;
          observacaoPendente = false;
          atualizar();
        });
      });
      observer.observe(conteudo, { childList: true, subtree: true });
    }
    function retirar() {
      pararObserver();
      if (atual) {
        const c = atual;
        atual = null;
        retido = c;
        if (c.leitor?.readyState === 1) c.leitor.abort();
        c.renderer?.limpar();
        c.renderer?.descartar();
        c.servico.descartar();
      }
      indice = null;
      total = 0;
    }
    function ocupado(c) {
      return c && (c.ocupado || c.servico.consultarEstado().observacao.decodificacoesAtivas !== 0);
    }
    function bombear() {
      if (estado === 'descartada' || !candidato) return;
      if (ocupado(retido)) {
        estado = 'aguardando-liberacao';
        mensagem('Aguardando a operação anterior terminar. Você pode encerrar a prévia.');
        if (timer === null) {
          const g = geracao;
          timer = win.setTimeout(() => {
            timer = null;
            if (g === geracao) bombear();
          }, 250);
        }
        atualizar();
        return;
      }
      pararTimer();
      retido = null;
      const file = candidato;
      candidato = null;
      const c = {
        g: geracao,
        servico: ilustrada.criarPreparacaoIlustradaVisual(),
        renderer: null,
        leitor: null,
        ocupado: true,
      };
      atual = c;
      void preparar(c, file);
    }
    function ler(c, file) {
      return new Promise((resolve, reject) => {
        const leitor = new win.FileReader();
        c.leitor = leitor;
        const limpar = () => {
          leitor.onload = leitor.onerror = leitor.onabort = null;
          c.leitor = null;
        };
        leitor.onload = () => {
          const resultado = leitor.result;
          limpar();
          resolve(resultado);
        };
        leitor.onerror = () => {
          limpar();
          reject('NAV_LEITURA_FALHOU');
        };
        leitor.onabort = () => {
          limpar();
          reject('NAV_LEITURA_ABORTADA');
        };
        try {
          leitor.readAsArrayBuffer(file);
        } catch {
          limpar();
          reject('NAV_LEITURA_FALHOU');
        }
      });
    }
    async function preparar(c, file) {
      try {
        estado = 'lendo';
        mensagem('Lendo o ZIP. Nada será salvo.');
        atualizar();
        let buffer = await ler(c, file);
        file = null;
        if (!vigente(c)) return;
        if (
          !(buffer instanceof win.ArrayBuffer) ||
          !buffer.byteLength ||
          buffer.byteLength > 71303168
        )
          throw 'NAV_TAMANHO_INVALIDO';
        let bytes = new win.Uint8Array(buffer);
        buffer = null;
        estado = 'preparando';
        mensagem('Conferindo o pacote e as imagens.');
        atualizar();
        const p = c.servico.preparar(bytes);
        bytes = null;
        const resultado = await p;
        if (!vigente(c)) return;
        if (resultado.status !== 'ilustracao-disponivel') throw 'NAV_PACOTE_RECUSADO';
        total = resultado.projecao.questoes.length;
        c.renderer = render.criarRenderizadorVisual(conteudo, c.servico);
        if (c.renderer.status === 'recusado') {
          c.renderer = null;
          throw 'NAV_APRESENTACAO_FALHOU';
        }
        observar(c);
        await mostrar(c, 0, arquivo);
      } catch (e) {
        if (vigente(c)) {
          erro = [
            'NAV_LEITURA_FALHOU',
            'NAV_LEITURA_ABORTADA',
            'NAV_TAMANHO_INVALIDO',
            'NAV_PACOTE_RECUSADO',
            'NAV_APRESENTACAO_FALHOU',
          ].includes(e)
            ? e
            : 'NAV_PREPARACAO_FALHOU';
          retirar();
          estado = 'falha';
          mensagem('Não foi possível abrir este arquivo. Selecione outro ZIP.');
          atualizar();
        }
      } finally {
        file = null;
        c.ocupado = false;
        // Não arma acompanhamento de uma geração encerrada. A seleção atual já o controla.
      }
    }
    async function mostrar(c, destino, iniciador) {
      if (!vigente(c)) return;
      estado = 'apresentando';
      indice = destino;
      mensagem('');
      atualizar();
      try {
        const r = await c.renderer.renderizarQuestao(destino);
        if (!vigente(c)) return;
        if (r.status === 'recusado') {
          estado = 'falha';
          erro = 'NAV_APRESENTACAO_FALHOU';
        } else estado = 'disponivel';
        atualizar();
        if (estado === 'disponivel' && doc.activeElement === iniciador) posicao.focus();
      } catch {
        if (vigente(c)) {
          c.renderer.limpar();
          estado = 'falha';
          erro = 'NAV_APRESENTACAO_FALHOU';
          mensagem('Não foi possível mostrar a questão. Selecione outro ZIP.');
          atualizar();
        }
      }
    }
    function selecionar() {
      if (estado === 'descartada') return;
      const file = arquivo.files?.[0];
      arquivo.value = '';
      if (!file) return;
      geracao++;
      pararTimer();
      candidato = null;
      retirar();
      erro = null;
      if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > 71303168) {
        estado = 'falha';
        erro = 'NAV_TAMANHO_INVALIDO';
        mensagem('Escolha um ZIP não vazio de até 71.303.168 bytes.');
        atualizar();
        return;
      }
      candidato = file;
      bombear();
    }
    function navegar(delta, iniciador) {
      atualizar();
      if (!podeNavegar(apresentacao())) return;
      const destino = indice + delta;
      if (destino < 0 || destino >= total) return;
      void mostrar(atual, destino, iniciador);
    }
    const voltar = () => navegar(-1, anterior),
      avancar = () => navegar(1, proxima);
    function consultarEstado() {
      atualizar();
      const r = apresentacao();
      const pode = podeNavegar(r);
      return Object.freeze({
        formato: 'lab-v3-navegacao-1',
        estado,
        indice,
        total,
        acoes: Object.freeze({
          anterior: pode && indice > 0,
          proxima: pode && indice < total - 1,
          selecionar: estado !== 'descartada',
          encerrar: estado !== 'descartada',
        }),
        apresentacao: r?.estado || null,
        erro,
        admissaoOperacional: false,
      });
    }
    function encerrar() {
      if (estado !== 'descartada') {
        geracao++;
        pararTimer();
        candidato = null;
        retirar();
        estado = 'encerrada';
        erro = null;
        mensagem('Prévia encerrada. Você pode selecionar outro ZIP.');
        atualizar();
      }
      return consultarEstado();
    }
    function descartar() {
      if (estado !== 'descartada') {
        encerrar();
        estado = 'descartada';
        retido = null;
        arquivo.removeEventListener('change', selecionar);
        anterior.removeEventListener('click', voltar);
        proxima.removeEventListener('click', avancar);
        fechar.removeEventListener('click', encerrar);
        painel.remove();
        if (donos.get(raiz) === dono) donos.delete(raiz);
      }
      return consultarEstado();
    }
    arquivo.addEventListener('change', selecionar);
    anterior.addEventListener('click', voltar);
    proxima.addEventListener('click', avancar);
    fechar.addEventListener('click', encerrar);
    atualizar();
    return Object.freeze({ consultarEstado, encerrar, descartar });
  }
  const api = Object.freeze({ criarPreviaNavegavelVisual });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualNavegacao = api;
})(typeof window === 'undefined' ? globalThis : window);
