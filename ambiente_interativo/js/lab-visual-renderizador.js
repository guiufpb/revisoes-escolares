/* global globalThis, module */
(function (root) {
  'use strict';
  const donos = new WeakMap(),
    raizes = new WeakMap();
  let sequencia = 0;
  const recusa = (codigo) =>
    Object.freeze({
      status: 'recusado',
      erros: [{ codigo, caminho: '', origem: 'renderizador' }],
      admissaoOperacional: false,
    });
  function contexto(servico) {
    const e = servico.consultarEstado(),
      r = servico.consultarProjecao();
    if (
      e?.formato !== 'lab-v3-ilustrada-1' ||
      e.estado !== 'disponivel' ||
      e.admissaoOperacional !== false ||
      r?.status !== 'ilustracao-disponivel' ||
      r.formato !== 'lab-v3-ilustrada-1' ||
      r.admissaoOperacional !== false ||
      r.projecao?.formato !== 'lab-v3-previa-1' ||
      !Object.isFrozen(r.projecao)
    )
      return null;
    return r.projecao;
  }
  function criarRenderizadorVisual(raiz, servico) {
    try {
      const Elemento = raiz?.ownerDocument?.defaultView?.Element;
      if (
        arguments.length !== 2 ||
        !Elemento ||
        !(raiz instanceof Elemento) ||
        !servico ||
        typeof servico !== 'object' ||
        ['consultarEstado', 'consultarProjecao', 'criarApresentacao'].some(
          (k) => typeof servico[k] !== 'function'
        )
      )
        return recusa('RENDER_ARGUMENTOS_INVALIDOS');
      if (donos.has(servico) || raizes.has(raiz)) return recusa('RENDER_PROPRIEDADE_OCUPADA');
      if (!contexto(servico)) return recusa('RENDER_CONTEXTO_INCOMPATIVEL');
    } catch {
      return recusa('RENDER_ARGUMENTOS_INVALIDOS');
    }
    const dono = {},
      doc = raiz.ownerDocument,
      prefixo = 'lab-render-' + ++sequencia;
    donos.set(servico, dono);
    raizes.set(raiz, dono);
    let geracao = 0,
      estado = 'inicial',
      atual = null,
      pendente = null,
      ids = 0;
    function el(tag, texto) {
      const n = doc.createElement(tag);
      if (texto !== undefined) n.textContent = texto;
      return n;
    }
    const id = () => prefixo + '-' + ++ids;
    const vigente = (c) => atual === c && geracao === c.geracao && estado !== 'descartado';
    function vinculado(c) {
      try {
        return contexto(servico) === c.projecao;
      } catch {
        return false;
      }
    }
    function soltar(f) {
      const h = f.handle;
      f.handle = null;
      if (h) {
        h.elemento.removeEventListener('error', f.erro);
        h.liberar();
      }
    }
    function limparAtual(novoEstado, codigo = 'RENDER_INVALIDADO') {
      geracao++;
      const c = atual;
      atual = null;
      estado = novoEstado;
      if (c) {
        c.cancelar(recusa(codigo));
        for (const f of [...c.figuras].reverse()) {
          f.botao.removeEventListener('click', f.clique);
          soltar(f);
        }
        c.painel.remove();
      }
    }
    function falhar(c, codigo) {
      if (!vigente(c)) return recusa('RENDER_INVALIDADO');
      const focoInterno = c.painel.contains(doc.activeElement);
      limparAtual('falha', codigo);
      const painel = el('section'),
        aviso = el(
          'p',
          'Não foi possível mostrar esta questão. Prepare a prévia e tente novamente.'
        );
      painel.className = 'lab-v3-renderizador';
      aviso.setAttribute('role', 'status');
      if (focoInterno) {
        aviso.setAttribute('tabindex', '-1');
        // O foco anuncia a mensagem; não solicitar também um anúncio pela região viva.
        aviso.setAttribute('aria-live', 'off');
      }
      painel.append(aviso);
      raiz.append(painel);
      // Mantém somente o nó de aviso sob propriedade do renderizador.
      atual = { painel, figuras: [], geracao, projecao: null, cancelar: () => {} };
      if (focoInterno) aviso.focus();
      return recusa(codigo);
    }
    function conferir() {
      if (atual?.projecao && !vinculado(atual)) falhar(atual, 'RENDER_CONTEXTO_INVALIDADO');
    }
    function atualizar(c) {
      if (!vigente(c)) return;
      const exibidas = c.figuras.filter((f) => f.handle).length;
      estado =
        pendente?.geracao === c.geracao
          ? 'carregando'
          : exibidas === c.figuras.length
            ? 'completo'
            : 'imagens-adiadas';
      const mensagem =
        estado === 'carregando'
          ? 'Carregando figuras.'
          : estado === 'completo'
            ? 'Prévia pronta. Nenhuma resposta será registrada.'
            : 'Algumas figuras ainda não estão exibidas. Você pode ocultar uma figura e exibir outra.';
      if (c.status.textContent !== mensagem) c.status.textContent = mensagem;
      for (const f of c.figuras) {
        f.botao.textContent = (f.handle ? 'Ocultar figura ' : 'Exibir figura ') + f.numero;
        f.botao.disabled = !f.handle && !!pendente;
        f.botao.setAttribute('aria-expanded', f.handle ? 'true' : 'false');
        f.aviso.hidden = !!f.handle;
        f.descricao && (f.descricao.hidden = !!f.handle);
      }
    }
    async function apresentar(c, f) {
      if (!vigente(c)) return recusa('RENDER_INVALIDADO');
      if (!vinculado(c)) return falhar(c, 'RENDER_CONTEXTO_INVALIDADO');
      if (pendente || f.handle) return recusa('RENDER_OCUPADO');
      const marca = { geracao: c.geracao };
      pendente = marca;
      atualizar(c);
      let h = null;
      try {
        h = await servico.criarApresentacao(f.uso);
        if (!vigente(c)) {
          h?.liberar?.();
          return recusa('RENDER_INVALIDADO');
        }
        if (!vinculado(c)) {
          h?.liberar?.();
          return falhar(c, 'RENDER_CONTEXTO_INVALIDADO');
        }
        if (
          h?.status === 'recusado' &&
          ['ILUSTRADA_ORCAMENTO_OCUPADO', 'ILUSTRADA_FILA_OCUPADA'].includes(h.erros?.[0]?.codigo)
        )
          return recusa('RENDER_FIGURA_ADIADA');
        if (
          h?.status !== 'imagem-disponivel' ||
          h.admissaoOperacional !== false ||
          h.consultarEstado().estado !== 'pronta'
        ) {
          h?.liberar?.();
          return falhar(c, 'RENDER_IMAGEM_FALHOU');
        }
        f.handle = h;
        f.erro = () => {
          falhar(c, 'RENDER_IMAGEM_FALHOU');
        };
        h.elemento.addEventListener('error', f.erro);
        if (f.grupoId && f.uso.acessibilidade.tipo === 'essencial')
          h.elemento.setAttribute('aria-describedby', f.grupoId);
        f.slot.append(h.elemento);
        return null;
      } catch {
        if (f.handle === h) soltar(f);
        else h?.liberar?.();
        return falhar(c, 'RENDER_IMAGEM_FALHOU');
      } finally {
        if (pendente === marca) pendente = null;
        if (atual?.projecao) {
          conferir();
          if (atual?.projecao) atualizar(atual);
        }
      }
    }
    function figura(c, uso, grupo) {
      const n = el('figure'),
        slot = el('div'),
        numero = c.figuras.length + 1;
      n.dataset.uso = uso.id;
      const aviso = el('p', 'Figura ainda não exibida.'),
        botao = el('button', 'Exibir figura ' + numero);
      botao.type = 'button';
      botao.setAttribute('aria-controls', (slot.id = id()));
      const descricao =
        uso.acessibilidade.tipo === 'essencial' ? el('p', uso.acessibilidade.descricao) : null;
      n.append(slot, aviso);
      if (descricao) n.append(descricao);
      let grupoId = null;
      if (grupo !== undefined) {
        const tag = el('p', 'Grupo: ' + grupo);
        tag.id = grupoId = id();
        n.append(tag);
      }
      if (uso.acessibilidade.descricaoLonga !== undefined) {
        const detalhe = el('details');
        detalhe.append(
          el('summary', 'Descrição detalhada da figura ' + numero),
          el('p', uso.acessibilidade.descricaoLonga)
        );
        n.append(detalhe);
      }
      n.append(botao);
      if (Object.hasOwn(uso, 'rotulo')) n.append(el('figcaption', uso.rotulo));
      const f = { uso, numero, slot, aviso, descricao, botao, grupoId, handle: null, erro: null };
      f.clique = () => {
        if (!vigente(c)) return;
        if (!vinculado(c)) {
          falhar(c, 'RENDER_CONTEXTO_INVALIDADO');
          return;
        }
        if (f.handle) {
          soltar(f);
          atualizar(c);
        } else void apresentar(c, f);
      };
      botao.addEventListener('click', f.clique);
      c.figuras.push(f);
      return n;
    }
    function visual(c, v, nivel) {
      if (v.tipo === 'imagem') return figura(c, v);
      const n = el('section'),
        titulo = el('h' + nivel, v.rotulo);
      titulo.id = id();
      n.setAttribute('aria-labelledby', titulo.id);
      n.className = 'lab-render-conjunto lab-render-' + v.apresentacao;
      n.dataset.conjunto = v.id;
      n.append(titulo);
      if (v.descricaoRelacao !== undefined) n.append(el('p', v.descricaoRelacao));
      const grupos = new Map();
      if (v.apresentacao === 'agrupamento') {
        const lista = el('ul');
        lista.setAttribute('aria-label', 'Grupos do conjunto');
        for (const g of v.grupos) {
          lista.append(el('li', g.rotulo));
          for (const elemento of g.elementoIds) grupos.set(elemento, g.rotulo);
        }
        n.append(lista);
      }
      const lista = el(v.apresentacao === 'sequencia' ? 'ol' : 'ul');
      lista.className = 'lab-render-elementos';
      for (const elemento of v.elementos) {
        const item = el('li');
        item.append(figura(c, elemento, grupos.get(elemento.id)));
        lista.append(item);
      }
      n.append(lista);
      return n;
    }
    function visuais(c, pai, lista, nivel) {
      for (const v of lista) pai.append(visual(c, v, nivel));
    }
    function construir(c, q) {
      const painel = c.painel;
      painel.className = 'lab-v3-renderizador';
      painel.dataset.contrato = 'lab-v3-renderizador-1';
      painel.append(el('h1', c.projecao.titulo), el('p', 'Prévia — sem respostas ou pontuação.'));
      const artigo = el('article'),
        titulo = el('h2', q.titulo);
      titulo.id = id();
      artigo.setAttribute('aria-labelledby', titulo.id);
      artigo.dataset.questao = q.id;
      if (q.tipo !== 'ditado') artigo.append(el('p', q.bloco));
      artigo.append(titulo);
      if (q.tipo === 'ditado')
        artigo.append(el('p', 'Idioma: ' + q.idioma + '. Unidade: ' + q.unidade + '.'));
      else {
        artigo.append(el('p', q.instrucao), el('p', q.dica));
        visuais(c, artigo, q.visuais, 3);
      }
      const itens = el('ol');
      for (const it of q.itens) {
        const item = el('li');
        item.dataset.item = it.id;
        if (q.tipo === 'ditado') item.append(el('p', it.rotulo));
        else {
          item.append(el('h3', it.pergunta));
          visuais(c, item, it.visuais, 4);
          if (q.tipo === 'campos') {
            const campo = el('p', 'Campo demonstrativo — vazio');
            campo.className = 'lab-render-campo';
            item.append(campo);
          } else {
            const alternativas = el('ol');
            alternativas.className = 'lab-render-alternativas';
            alternativas.setAttribute('aria-label', 'Alternativas demonstrativas');
            for (const a of it.alternativas) {
              const alt = el('li');
              alt.dataset.alternativa = a.id;
              if (Object.hasOwn(a, 'texto')) alt.append(el('p', a.texto));
              visuais(c, alt, a.visuais, 4);
              alternativas.append(alt);
            }
            item.append(alternativas);
          }
        }
        itens.append(item);
      }
      artigo.append(itens);
      painel.append(artigo, c.status);
      c.status.setAttribute('role', 'status');
      c.status.setAttribute('aria-live', 'polite');
    }
    function consultarEstado() {
      conferir();
      return Object.freeze({
        formato: 'lab-v3-renderizador-1',
        estado,
        admissaoOperacional: false,
        figuras: Object.freeze({
          total: atual?.figuras.length || 0,
          exibidas: atual?.figuras.filter((f) => f.handle).length || 0,
          adiadas: atual?.figuras.filter((f) => !f.handle).length || 0,
        }),
        operacaoPendente: !!pendente,
      });
    }
    async function renderizarQuestao(indice) {
      if (estado === 'descartado') return recusa('RENDER_DESCARTADO');
      let projecao;
      try {
        projecao = contexto(servico);
      } catch {
        /* recusa segura */
      }
      if (!projecao) {
        if (atual?.projecao) falhar(atual, 'RENDER_CONTEXTO_INVALIDADO');
        return recusa('RENDER_CONTEXTO_INCOMPATIVEL');
      }
      if (
        arguments.length !== 1 ||
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= projecao.questoes.length
      )
        return recusa('RENDER_INDICE_INVALIDO');
      limparAtual('carregando');
      let cancelar;
      const cancelada = new Promise((r) => {
        cancelar = r;
      });
      const c = {
        geracao,
        projecao,
        figuras: [],
        painel: el('section'),
        status: el('p'),
        cancelar,
      };
      atual = c;
      try {
        construir(c, projecao.questoes[indice]);
        raiz.append(c.painel);
        atualizar(c);
      } catch {
        return falhar(c, 'RENDER_ESTRUTURA_INVALIDA');
      }
      const carregar = async () => {
        for (const f of c.figuras) {
          if (!vigente(c)) return recusa('RENDER_INVALIDADO');
          // Uma tarefa antiga ainda pendente não autoriza uma segunda solicitação.
          if (pendente) break;
          const r = await apresentar(c, f);
          if (r?.status === 'recusado' && r.erros[0].codigo !== 'RENDER_FIGURA_ADIADA') return r;
        }
        if (!vigente(c)) return recusa('RENDER_INVALIDADO');
        atualizar(c);
        return consultarEstado();
      };
      return Promise.race([carregar(), cancelada]);
    }
    function limpar() {
      if (estado !== 'descartado') limparAtual('limpo');
      return consultarEstado();
    }
    function descartar() {
      if (estado !== 'descartado') {
        limparAtual('descartado');
        if (donos.get(servico) === dono) donos.delete(servico);
        if (raizes.get(raiz) === dono) raizes.delete(raiz);
      }
      return consultarEstado();
    }
    return Object.freeze({ renderizarQuestao, consultarEstado, limpar, descartar });
  }
  const api = Object.freeze({ criarRenderizadorVisual });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualRenderizador = api;
})(typeof window === 'undefined' ? globalThis : window);
