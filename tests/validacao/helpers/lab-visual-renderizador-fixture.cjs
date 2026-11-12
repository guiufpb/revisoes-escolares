'use strict';
const f = require('./lab-visual-fixture.cjs');
const p = require('./lab-visual-previa-fixture.cjs');
const {
  criarPreparacaoPreviaVisual,
} = require('../../../ambiente_interativo/js/lab-visual-previa.js');
function dom() {
  const doc = { defaultView: {}, activeElement: null };
  class Elemento {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.ownerDocument = doc;
      this.children = [];
      this.dataset = {};
      this.attrs = {};
      this.listeners = new Map();
      this.texto = '';
    }
    set textContent(v) {
      this.children.forEach((n) => {
        n.parentNode = null;
      });
      this.children = [];
      this.texto = String(v);
    }
    get textContent() {
      return this.texto + this.children.map((n) => n.textContent).join('');
    }
    setAttribute(k, v) {
      this.attrs[k] = String(v);
    }
    append(...nodes) {
      for (const n of nodes) {
        n.remove();
        n.parentNode = this;
        this.children.push(n);
      }
    }
    replaceChildren(...nodes) {
      this.textContent = '';
      this.append(...nodes);
    }
    remove() {
      if (this.parentNode)
        this.parentNode.children = this.parentNode.children.filter((n) => n !== this);
      this.parentNode = null;
    }
    addEventListener(k, fn) {
      if (!this.listeners.has(k)) this.listeners.set(k, new Set());
      this.listeners.get(k).add(fn);
    }
    removeEventListener(k, fn) {
      this.listeners.get(k)?.delete(fn);
    }
    dispatch(k) {
      for (const fn of [...(this.listeners.get(k) || [])]) fn();
    }
    focus() {
      doc.activeElement = this;
    }
    contains(n) {
      return n === this || this.children.some((filho) => filho.contains(n));
    }
  }
  doc.defaultView.Element = Elemento;
  doc.createElement = (t) => new Elemento(t);
  return { doc, raiz: doc.createElement('main') };
}
function elementos(n, pred = () => true, out = []) {
  if (pred(n)) out.push(n);
  n.children.forEach((x) => elementos(x, pred, out));
  return out;
}
async function ambiente(opts = {}) {
  const d = dom(),
    x = opts.x || f.vetor(1);
  if (!opts.x)
    x.m.questoes[0].visuais = [
      f.use('va', 'ponto', true),
      f.use('vb', 'ponto', true),
      f.use('vc', 'ponto', true),
    ];
  const base = criarPreparacaoPreviaVisual(),
    result = await base.preparar(p.zip(x));
  if (result.status !== 'contexto-disponivel') throw Error('fixture inválido');
  let projecao = result.projecao,
    estado = 'disponivel';
  const stats = { pedidos: [], liberados: [], ativos: 0, pico: 0, handles: [], consultas: 0 };
  const usos = new Set();
  function visitar(v) {
    if (v && typeof v === 'object') {
      if (v.tipo === 'imagem') usos.add(v);
      else Object.values(v).forEach(visitar);
    }
  }
  visitar(projecao);
  const svc = {
    consultarEstado() {
      return { formato: 'lab-v3-ilustrada-1', estado, admissaoOperacional: false };
    },
    consultarProjecao() {
      stats.consultas++;
      return {
        formato: 'lab-v3-ilustrada-1',
        status: estado === 'disponivel' ? 'ilustracao-disponivel' : 'recusado',
        projecao,
        admissaoOperacional: false,
      };
    },
    async criarApresentacao(uso) {
      if (!usos.has(uso)) throw Error('cópia de utilização');
      const n = stats.pedidos.length + 1;
      stats.pedidos.push(uso);
      if (opts.gate) await opts.gate(n);
      if (opts.falhaNa === n)
        return { status: 'recusado', erros: [{ codigo: 'ILUSTRADA_DECODIFICACAO_FALHOU' }] };
      if (opts.ocupado || stats.ativos >= (opts.limite ?? 100))
        return {
          status: 'recusado',
          erros: [{ codigo: opts.ocupado || 'ILUSTRADA_ORCAMENTO_OCUPADO' }],
        };
      const img = d.doc.createElement('img');
      img.alt = uso.acessibilidade.descricao || '';
      let vivo = true;
      stats.ativos++;
      stats.pico = Math.max(stats.pico, stats.ativos);
      const h = {
        status: 'imagem-disponivel',
        elemento: img,
        admissaoOperacional: false,
        consultarEstado: () => ({ estado: vivo ? 'pronta' : 'liberada' }),
        liberar() {
          if (!vivo) return;
          vivo = false;
          stats.ativos--;
          stats.liberados.push(uso.id);
          img.remove();
        },
      };
      stats.handles.push(h);
      return h;
    },
  };
  Object.defineProperties(svc, {
    preparar: {
      get() {
        throw Error('capacidade proibida');
      },
    },
    descartar: {
      get() {
        throw Error('capacidade proibida');
      },
    },
  });
  return {
    ...d,
    svc,
    stats,
    projecao,
    invalidar() {
      estado = 'falha';
    },
    substituir() {
      projecao = Object.freeze({ ...projecao });
    },
  };
}
function defer() {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { resolve, promise };
}
module.exports = { ambiente, elementos, defer, dom };
