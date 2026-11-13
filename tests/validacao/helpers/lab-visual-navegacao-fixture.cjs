/* global ArrayBuffer, Uint8Array, queueMicrotask */
'use strict';
const vm = require('node:vm'),
  fs = require('node:fs'),
  path = require('node:path');
const d = require('./lab-visual-renderizador-fixture.cjs');
const tick = require('node:timers/promises').setImmediate;
function ambiente(opts = {}) {
  const { doc, raiz } = d.dom(),
    win = doc.defaultView;
  const stats = {
    leituras: [],
    preparacoes: [],
    servicos: [],
    timers: new Map(),
    observadores: [],
    ordem: [],
    consultasRenderizador: 0,
  };
  let timerId = 0;
  Object.assign(win, {
    ArrayBuffer,
    Uint8Array,
    queueMicrotask,
    setTimeout(fn) {
      const id = ++timerId;
      stats.timers.set(id, fn);
      return id;
    },
    clearTimeout(id) {
      stats.timers.delete(id);
    },
    MutationObserver: class {
      constructor(fn) {
        this.fn = fn;
        this.ativo = false;
        stats.observadores.push(this);
      }
      observe() {
        this.ativo = true;
      }
      disconnect() {
        this.ativo = false;
      }
    },
    FileReader: class {
      readAsArrayBuffer(file) {
        stats.leituras.push(file.tag);
        this.readyState = 1;
        if (opts.lerPendente) {
          stats.leitor = this;
          return;
        }
        if (opts.erroLeitura) {
          this.onerror();
          return;
        }
        this.readyState = 2;
        this.result = new ArrayBuffer(1);
        this.onload();
      }
      abort() {
        this.readyState = 2;
        this.onabort?.();
      }
    },
  });
  const janela = {
    LabVisualIlustrada: {
      criarPreparacaoIlustradaVisual() {
        const s = {
          active: 0,
          estado: 'inicial',
          async preparar() {
            stats.preparacoes.push(stats.leituras.at(-1));
            s.estado = 'disponivel';
            if (opts.reter && stats.servicos.length === 1) {
              s.active = 1;
              return new Promise((r) => {
                s.resolver = r;
              });
            }
            if (opts.recusar) return { status: 'recusado' };
            return { status: 'ilustracao-disponivel', projecao: { questoes: [{}, {}, {}] } };
          },
          consultarEstado() {
            return { observacao: { decodificacoesAtivas: s.active } };
          },
          descartar() {
            stats.ordem.push('servico');
            s.estado = 'descartado';
            s.resolver?.({ status: 'recusado' });
          },
        };
        stats.servicos.push(s);
        return s;
      },
    },
    LabVisualRenderizador: {
      criarRenderizadorVisual() {
        let estado = 'inicial';
        const r = {
          consultarEstado() {
            stats.consultasRenderizador++;
            return { estado, operacaoPendente: false };
          },
          async renderizarQuestao(i) {
            stats.indice = i;
            estado = 'completo';
            return { estado };
          },
          limpar() {
            stats.ordem.push('limpar');
          },
          descartar() {
            stats.ordem.push('renderer');
          },
          falhar() {
            estado = 'falha';
          },
        };
        stats.renderer = r;
        return r;
      },
    },
  };
  const contexto = vm.createContext({ window: janela, globalThis: janela });
  vm.runInContext(
    fs.readFileSync(
      path.join(__dirname, '../../../ambiente_interativo/js/lab-visual-navegacao.js'),
      'utf8'
    ),
    contexto
  );
  const criar = janela.LabVisualNavegacao.criarPreviaNavegavelVisual;
  const api = criar(raiz);
  const nodes = (tag) => d.elementos(raiz, (n) => n.tagName === tag.toUpperCase());
  function selecionar(tag, size = 1) {
    nodes('input')[0].files = tag === null ? [] : [{ tag, size }];
    nodes('input')[0].dispatch('change');
  }
  function drenar() {
    const callbacks = [...stats.timers.values()];
    stats.timers.clear();
    callbacks.forEach((fn) => fn());
  }
  return { stats, api, criar, raiz, doc, nodes, selecionar, drenar };
}
module.exports = { ambiente, tick };
