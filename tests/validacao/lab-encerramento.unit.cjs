/* global window, localStorage, Storage, navigator, indexedDB, IDBObjectStore, IDBDatabase */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const A = 'a'.repeat(64),
  B = 'b'.repeat(64);
let server,
  browser,
  origem,
  copyId = A,
  status = 200;
function pacote(id = 'sintetico') {
  return {
    formato: 'lab-questionarios-v1',
    id,
    versao: 1,
    perfil: 'alice',
    materia: 'ciencias',
    titulo: 'Fixture LAB',
    questoes: [
      {
        id: 'q1',
        bloco: 'Exemplo',
        titulo: 'O dia',
        instrucao: 'Escolha.',
        tipo: 'opcoes',
        dica: 'Observe.',
        itens: [
          { id: 'i1', pergunta: 'Qual ilumina o dia?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] },
        ],
      },
    ],
  };
}
const inicial = () => ({
  questaoAtual: 0,
  respostas: {},
  corrigidas: {},
  pontuadas: {},
  pontos: 0,
  finalizada: false,
  versao: 1,
  conferidas: {},
});
before(async () => {
  server = http.createServer((req, res) => {
    if (req.url === '/__revisoes_local__/identity') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId }));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(
        '<!doctype html><section id="tela-gramatica-mariana"><nav class="migalhas"><strong>Gramática</strong></nav><span id="gramatica-nome-perfil"></span><div id="gramatica-progresso"><div id="gramatica-barra"></div></div><span id="gramatica-contador"></span><span id="gramatica-pontos"></span><div id="gramatica-conteudo"></div><button id="gramatica-voltar">Voltar</button><button id="gramatica-proxima">Próxima</button><div id="gramatica-modo-responsavel" hidden></div><div id="gramatica-faixa-modo-responsavel" hidden></div><button id="botao-inicio">Início</button></section>'
      );
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  }
});
async function carregar(page) {
  await page.goto(origem);
  await page.evaluate(() => {
    window.QuestionariosInteracoes = { aceita: () => false };
    window.GramaticaDitado = { parar() {}, configurar() {} };
  });
  for (const s of [
    'lab-validador',
    'lab-identidade',
    'lab-repositorio',
    'lab-progresso',
    'lab-coordenador',
    'armazenamento',
    'gramatica-questionarios',
    'lab-backup',
    'lab-restauracao',
    'lab-journal',
  ])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', s + '.js') });
}
async function vazio(t) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  return { ctx, page };
}
async function backupTexto(
  page,
  p = pacote(),
  sessoes = { principal: inicial() },
  situacao = 'ativa'
) {
  return page.evaluate(
    async ({ p, sessoes, situacao }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      if (!v.valido) throw new Error('Fixture inválida');
      return JSON.stringify({
        formato: 'lab-backup-v1',
        versao: 1,
        entradas: [{ pacote: p, digest: v.digest, situacaoAdministrativa: situacao, sessoes }],
      });
    },
    { p, sessoes, situacao }
  );
}
async function solicitar(page, texto) {
  return page.evaluate(async (texto) => {
    window.texto = texto;
    const r = await window.LabJournal.solicitarConfirmacao(texto);
    window.solicitacao = r.solicitacao;
    return r.ok ? r.solicitacao.consultar() : r;
  }, texto);
}
async function confirmar(page) {
  return page.evaluate(() => {
    const r = window.solicitacao.confirmar();
    window.confirmacao = r.confirmacao;
    return { ok: r.ok, codigo: r.codigo };
  });
}
const gravar = (page) =>
  page.evaluate(() => window.LabJournal.prepararIntencao(window.texto, window.confirmacao));
const inspecionar = (page) => page.evaluate(() => window.LabJournal.inspecionarPendencias());
async function dados(page) {
  return page.evaluate(async () => {
    const a = await window.LabRepositorio.abrirRepositorio();
    if (!a.ok) throw new Error(a.codigo);
    a.repositorio.fechar();
    const d = await new Promise((resolve, reject) => {
      const r = indexedDB.open('revisoesEscolares.lab.' + a.copyId + '.v1', 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = reject;
    });
    return new Promise((resolve) => {
      const tx = d.transaction(['pacotes', 'administracao', 'operacoes'], 'readonly'),
        resultado = {};
      for (const s of ['pacotes', 'administracao', 'operacoes']) {
        const r = tx.objectStore(s).getAll();
        r.onsuccess = () => {
          resultado[s] = r.result;
        };
      }
      tx.oncomplete = () => {
        d.close();
        resolve({ ...resultado, local: Object.entries(localStorage) });
      };
    });
  });
}
async function cadastrar(page, p = pacote()) {
  return page.evaluate(async (p) => {
    const a = await window.LabRepositorio.abrirRepositorio();
    try {
      return await a.repositorio.cadastrar(JSON.stringify(p));
    } finally {
      a.repositorio.fechar();
    }
  }, p);
}
async function chave(page, p = pacote(), sessao = 'principal') {
  return page.evaluate(
    async ({ p, sessao }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      const d = await window.LabIdentidade.resolverIdentidade();
      const a = window.LabProgresso.criarArmazenamento();
      const c = a.abrir({
        modo: 'persistente',
        sessao,
        identidade: {
          copyId: d.copyId,
          perfil: p.perfil,
          materia: p.materia,
          id: p.id,
          versao: p.versao,
          digest: v.digest,
        },
        vigente: () => false,
        autorizar: () => Promise.resolve({ ok: false }),
      });
      a.encerrar();
      return c.canal.chave;
    },
    { p, sessao }
  );
}
async function intencao(page, texto) {
  assert.equal((await solicitar(page, texto)).ok, true);
  await confirmar(page);
  const r = await gravar(page);
  assert.equal(r.ok, true, JSON.stringify(r));
  await page.evaluate((id) => {
    window.operacao = id;
  }, r.operacao);
  return r.operacao;
}
async function solicitarApp(page, texto) {
  return page.evaluate(async (texto) => {
    const r = await window.LabJournal.solicitarAplicacao(texto, window.operacao);
    window.app = r.solicitacao;
    return r.ok ? r.solicitacao.consultar() : r;
  }, texto);
}
async function confirmarApp(page) {
  return page.evaluate(() => {
    const r = window.app.confirmarAplicacao();
    window.confirmacaoApp = r.confirmacao;
    return { ok: r.ok, codigo: r.codigo };
  });
}
const aplicar = (page) =>
  page.evaluate(() => window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp));
async function autorizar(page, texto) {
  const r = await solicitarApp(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal((await confirmarApp(page)).ok, true);
}
async function observar(page, falha = '') {
  await page.evaluate((falha) => {
    window.eventos = [];
    window.puts = 0;
    window.aceitou = false;
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      window.eventos.push('local:setItem');
      if (falha === 'quota-local') throw new window.DOMException('Fixture', 'QuotaExceededError');
      return set.call(this, k, v);
    };
    for (const nome of ['removeItem', 'clear']) {
      const n = Storage.prototype[nome];
      Storage.prototype[nome] = function (...args) {
        window.eventos.push('local:' + nome);
        return n.apply(this, args);
      };
    }
    for (const nome of ['add', 'put', 'delete', 'clear']) {
      const n = IDBObjectStore.prototype[nome];
      IDBObjectStore.prototype[nome] = function (...args) {
        window.eventos.push(this.name + ':' + nome);
        if (this.name === 'operacoes' && nome === 'put') {
          ++window.puts;
          if (falha === 'put-' + window.puts)
            throw new window.DOMException('Fixture', 'QuotaExceededError');
        }
        if (this.name === 'pacotes' && nome === 'add' && falha === 'quota-pacote')
          throw new window.DOMException('Fixture', 'QuotaExceededError');
        const r = n.apply(this, args),
          store = this,
          tx = this.transaction;
        r.addEventListener('success', () => {
          if (store.name === 'administracao' && nome === 'add') {
            window.aceitou = true;
            if (falha === 'abort-pacote') tx.abort();
            if (falha === 'interromper-pacote') {
              const manter = () => {
                const q = store.get(['alice', 'sintetico', 1]);
                q.onsuccess = manter;
              };
              manter();
            }
          }
        });
        return r;
      };
    }
  }, falha);
}
async function pendente(page, falha = 'put-5', sessoes = { principal: inicial() }, p = pacote()) {
  const texto = await backupTexto(page, p, sessoes);
  await intencao(page, texto);
  await autorizar(page, texto);
  await page.evaluate(() => {
    window.primitivasRecon = { storage: {}, store: {} };
    for (const k of ['setItem', 'getItem', 'removeItem', 'clear'])
      window.primitivasRecon.storage[k] = Storage.prototype[k];
    for (const k of ['add', 'put', 'delete', 'clear'])
      window.primitivasRecon.store[k] = IDBObjectStore.prototype[k];
  });
  await observar(page, falha);
  if (falha === 'segunda-sessao')
    await page.evaluate(() => {
      const set = Storage.prototype.setItem;
      let n = 0;
      Storage.prototype.setItem = function (...args) {
        if (++n === 2) throw new window.DOMException('Fixture', 'QuotaExceededError');
        return set.apply(this, args);
      };
    });
  const r = await aplicar(page);
  assert.equal(r.ok, false, JSON.stringify(r));
  await page.evaluate(() => {
    Object.assign(Storage.prototype, window.primitivasRecon.storage);
    Object.assign(IDBObjectStore.prototype, window.primitivasRecon.store);
  });
  return texto;
}
const diagnosticar = (page, original = true) =>
  page.evaluate(
    (original) =>
      window.LabJournal.inspecionarReconciliacao(
        window.operacao,
        original ? window.texto : undefined
      ),
    original
  );
async function solicitarRecon(page, texto) {
  return page.evaluate(async (texto) => {
    const r = await window.LabJournal.solicitarReconciliacao(texto, window.operacao);
    window.recon = r.solicitacao;
    return r.ok ? r.solicitacao.consultar() : r;
  }, texto);
}
async function confirmarRecon(page) {
  return page.evaluate(() => {
    const r = window.recon.confirmarReconciliacao();
    window.confirmacaoRecon = r.confirmacao;
    return { ok: r.ok, codigo: r.codigo };
  });
}
const reconciliar = (page) =>
  page.evaluate(() => window.LabJournal.reconciliarIntencao(window.texto, window.confirmacaoRecon));
async function autorizarRecon(page, texto) {
  const r = await solicitarRecon(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal((await confirmarRecon(page)).ok, true);
}
async function vigiarRecon(page, falha = '', indice = 1) {
  await page.evaluate(
    ({ falha, indice }) => {
      window.mutacoesRecon = [];
      window.pedidoRecon = false;
      window.commitRecon = false;
      window.putRecon = 0;
      for (const nome of ['setItem', 'removeItem', 'clear']) {
        const n = Storage.prototype[nome];
        Storage.prototype[nome] = function (...args) {
          window.mutacoesRecon.push('local:' + nome);
          return n.apply(this, args);
        };
      }
      for (const nome of ['createObjectStore', 'deleteObjectStore']) {
        const n = IDBDatabase.prototype[nome];
        IDBDatabase.prototype[nome] = function (...args) {
          window.mutacoesRecon.push('schema:' + nome);
          return n.apply(this, args);
        };
      }
      for (const nome of ['add', 'put', 'delete', 'clear']) {
        const n = IDBObjectStore.prototype[nome];
        IDBObjectStore.prototype[nome] = function (...args) {
          window.mutacoesRecon.push(this.name + ':' + nome);
          if (this.name !== 'operacoes' || nome !== 'put') return n.apply(this, args);
          const alvo = ++window.putRecon === indice;
          if (alvo && falha === 'quota')
            throw new window.DOMException('Fixture', 'QuotaExceededError');
          const q = n.apply(this, args),
            tx = this.transaction,
            store = this;
          tx.addEventListener('complete', () => {
            window.commitRecon = true;
          });
          q.addEventListener('success', () => {
            window.pedidoRecon = true;
            if (alvo && falha === 'abort') tx.abort();
            if (alvo && ['timeout', 'interromper'].includes(falha)) {
              const manter = () => {
                const r = store.get(window.operacao);
                r.onsuccess = manter;
              };
              manter();
            }
          });
          return q;
        };
      }
    },
    { falha, indice }
  );
}
function escolar(d) {
  return { pacotes: d.pacotes, administracao: d.administracao, local: d.local };
}
async function solicitarEnc(page, texto) {
  return page.evaluate(async (texto) => {
    const r = await window.LabJournal.solicitarEncerramento(texto, window.operacao);
    window.enc = r.solicitacao;
    return r.ok ? r.solicitacao.consultar() : r;
  }, texto);
}
async function confirmarEnc(page) {
  return page.evaluate(() => {
    const r = window.enc.confirmarEncerramento();
    window.confirmacaoEnc = r.confirmacao;
    return { ok: r.ok, codigo: r.codigo };
  });
}
const encerrar = (page) =>
  page.evaluate(() => window.LabJournal.encerrarIntencao(window.texto, window.confirmacaoEnc));
for (const tipo of ['administracao', 'orfao', 'journal', 'desconhecido', 'conflito', 'digest'])
  test('encerramento: bloqueia ' + tipo + ' sem reparar registro ou dados', async (t) => {
    const { page } = await vazio(t);
    await cadastrar(page);
    const texto = await prepararEnc(page);
    await alterarAlvo(page, tipo);
    const antes = await dados(page);
    await vigiarRecon(page);
    const r = await solicitarEnc(page, texto);
    assert.equal(r.ok, false);
    assert.ok(!JSON.stringify(r).includes('PRIVADO_FIXTURE'));
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  });
test('encerramento: snapshot corrompido e leitura impossível não são ausência', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page),
    k = await chave(page);
  await page.evaluate((k) => localStorage.setItem(k, '{PRIVADO_FIXTURE'), k);
  const antes = await dados(page);
  await vigiarRecon(page);
  assert.equal((await solicitarEnc(page, texto)).ok, false);
  await page.evaluate(() => {
    Storage.prototype.getItem = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  assert.equal((await solicitarEnc(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('encerramento: retomada iniciada permanece bloqueante sem efeitos novos', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'quota-local');
  await page.evaluate(async () => {
    const a = await window.LabJournal.solicitarRetomada(window.texto, window.operacao);
    window.ret = a.solicitacao;
    window.confirmacaoRet = window.ret.confirmarRetomada().confirmacao;
  });
  await observar(page, 'quota-local');
  assert.equal(
    (
      await page.evaluate(() =>
        window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet)
      )
    ).ok,
    false
  );
  const antes = await dados(page);
  assert.equal(antes.operacoes[0].marcadores.aplicacao, 'em-retomada');
  await vigiarRecon(page);
  assert.equal((await solicitarEnc(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('encerramento: integralmente presente usa reconciliação e concluída nunca é cancelada', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'put-5');
  await vigiarRecon(page);
  const r = await solicitarEnc(page, texto);
  assert.equal(r.ok, false);
  assert.equal(r.diagnostico.encerramento.encaminhamento, 'reconciliacao');
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  await autorizarRecon(page, texto);
  assert.equal((await reconciliar(page)).ok, true);
  const antes = await dados(page);
  assert.equal((await solicitarEnc(page, texto)).codigo, 'OPERACAO_JA_CONCLUIDA');
  assert.deepEqual(await dados(page), antes);
});
test('encerramento: commit sem resposta ao chamador é reconhecido sem outra escrita', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await page.evaluate(() => {
    const n = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...a) {
      const tx = n.apply(this, a);
      if (a[1] === 'readwrite')
        tx.addEventListener('complete', () => {
          void window.enc.cancelar();
        });
      return tx;
    };
  });
  const r = await encerrar(page);
  assert.equal(r.ok, false);
  assert.equal(r.encerramentoConfirmado, false);
  const depois = await dados(page);
  assert.deepEqual(escolar(depois), escolar(antes));
  assert.equal(depois.operacoes[0].estado, 'cancelada-sem-aplicacao');
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
  await vigiarRecon(page);
  assert.equal((await solicitarEnc(page, texto)).codigo, 'OPERACAO_JA_ENCERRADA');
  assert.equal((await encerrar(page)).ok, false);
  assert.deepEqual(await dados(page), depois);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('encerramento: contexto terminal independe de novo digest legítimo no destino', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  assert.equal((await encerrar(page)).ok, true);
  const terminal = (await dados(page)).operacoes[0];
  await alterarAlvo(page, 'digest');
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
  const p = pacote();
  p.titulo = 'Conteúdo divergente';
  const novo = await backupTexto(page, p);
  await intencao(page, novo);
  assert.deepEqual(
    (await dados(page)).operacoes.find((r) => r.id === terminal.id),
    terminal
  );
});
async function autorizarEnc(page, texto) {
  const r = await solicitarEnc(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal((await confirmarEnc(page)).ok, true);
}
test('encerramento: Mariana versão própria e confirmação cancelada antes do gesto', async (t) => {
  const { page } = await vazio(t),
    p = pacote();
  p.perfil = 'mariana';
  p.versao = 2;
  const texto = await backupTexto(page, p);
  await intencao(page, texto);
  const antes = await dados(page);
  assert.equal((await solicitarEnc(page, texto)).ok, true);
  await page.evaluate(() => window.enc.cancelar());
  assert.equal((await confirmarEnc(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  await autorizarEnc(page, texto);
  await vigiarRecon(page);
  assert.equal((await encerrar(page)).ok, true);
  assert.deepEqual(escolar(await dados(page)), escolar(antes));
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), ['operacoes:put']);
});
for (const tipo of ['versao', 'metadado', 'etapa', 'marcadores'])
  test('encerramento: terminal adulterado em ' + tipo + ' volta a bloquear', async (t) => {
    const { page } = await vazio(t),
      texto = await prepararEnc(page);
    await autorizarEnc(page, texto);
    assert.equal((await encerrar(page)).ok, true);
    await page.evaluate(async (tipo) => {
      const c = await window.LabIdentidade.resolverIdentidade();
      const db = await new Promise((resolve) => {
        const q = indexedDB.open('revisoesEscolares.lab.' + c.copyId + '.v1');
        q.onsuccess = () => resolve(q.result);
      });
      await new Promise((resolve) => {
        const tx = db.transaction('operacoes', 'readwrite'),
          s = tx.objectStore('operacoes'),
          q = s.get(window.operacao);
        q.onsuccess = () => {
          const r = q.result;
          if (tipo === 'versao') r.versao = 99;
          if (tipo === 'metadado') r.encerramento.versao = 99;
          if (tipo === 'etapa') r.atividades[0].conteudo.etapa = 'escrita-solicitada';
          if (tipo === 'marcadores') r.marcadores.aplicacao = 'em-retomada';
          s.put(r);
        };
        tx.oncomplete = resolve;
      });
      db.close();
    }, tipo);
    const antes = await dados(page);
    await vigiarRecon(page);
    assert.equal((await inspecionar(page)).bloqueioGlobalLab, true);
    assert.equal((await solicitarEnc(page, texto)).ok, false);
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  });
test('encerramento: transição pública é monotônica e não concede autorização', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page),
    a = (await dados(page)).operacoes[0];
  await autorizarEnc(page, texto);
  assert.equal((await encerrar(page)).ok, true);
  const b = (await dados(page)).operacoes[0];
  const outro = structuredClone(b);
  outro.id = '11111111-1111-4111-8111-111111111111';
  const r = await page.evaluate(
    async (pares) => {
      const a = await window.LabJournal.abrirJournal();
      try {
        return await Promise.all(
          pares.map(([x, y]) => a.journal.avaliarTransicao(JSON.stringify(x), JSON.stringify(y)))
        );
      } finally {
        a.journal.fechar();
      }
    },
    [
      [a, b],
      [b, a],
      [b, b],
      [a, outro],
    ]
  );
  assert.deepEqual(
    r.map((v) => v.ok && v.coerente),
    [true, false, true, false]
  );
  assert.ok(r.every((v) => !v.transicaoOperacionalDisponivel));
});
test('encerramento: nova intenção e novo conteúdo não invalidam o histórico terminal', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const texto = await prepararEnc(page),
    antes = await dados(page);
  await autorizarEnc(page, texto);
  assert.equal((await encerrar(page)).ok, true);
  const antigo = (await dados(page)).operacoes[0];
  const novo = await backupTexto(page, pacote(), { principal: inicial(), responsavel: inicial() });
  await intencao(page, novo);
  await autorizar(page, novo);
  assert.equal((await aplicar(page)).ok, true);
  const depois = await dados(page);
  assert.deepEqual(
    depois.operacoes.find((r) => r.id === antigo.id),
    antigo
  );
  assert.deepEqual(depois.pacotes, antes.pacotes);
  assert.equal(depois.local.length, 2);
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
});
test('encerramento: confirmação não é forjável, intercambiável ou reutilizável', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  const falsos = await page.evaluate(async () => {
    const j = window.LabJournal,
      r = [];
    for (const token of [
      undefined,
      true,
      {},
      structuredClone(window.confirmacaoEnc),
      window.confirmacao,
    ])
      r.push(await j.encerrarIntencao(window.texto, token));
    r.push(
      await j.aplicarIntencao(window.texto, window.confirmacaoEnc),
      await j.reconciliarIntencao(window.texto, window.confirmacaoEnc),
      await j.retomarIntencao(window.texto, window.confirmacaoEnc)
    );
    return r;
  });
  assert.ok(falsos.every((r) => !r.ok));
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  const r = await page.evaluate(() =>
    Promise.all([
      window.LabJournal.encerrarIntencao(window.texto, window.confirmacaoEnc),
      window.LabJournal.encerrarIntencao(window.texto, window.confirmacaoEnc),
    ])
  );
  assert.equal(r.filter((r) => r.ok).length, 1);
});
test('encerramento: expiração revoga antes de qualquer alteração', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page),
    antes = await dados(page);
  await page.evaluate(() => {
    const n = window.setTimeout;
    window.setTimeout = (fn, ms, ...a) => {
      if (ms === 30000) window.expirarEnc = fn;
      return n(fn, ms, ...a);
    };
  });
  await autorizarEnc(page, texto);
  await vigiarRecon(page);
  await page.evaluate(() => window.expirarEnc());
  assert.equal((await encerrar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
for (const marco of ['principal', 'pacote'])
  test(
    'encerramento: base externa ' + marco + ' criada depois da confirmação bloqueia',
    async (t) => {
      const { page } = await vazio(t),
        texto = await prepararEnc(page);
      await autorizarEnc(page, texto);
      if (marco === 'pacote') await cadastrar(page);
      else {
        const k = await chave(page);
        await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
          k,
          s: inicial(),
        });
      }
      const antes = await dados(page);
      await vigiarRecon(page);
      assert.equal((await encerrar(page)).ok, false);
      assert.deepEqual(await dados(page), antes);
      assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
    }
  );
for (const tipo of ['ausentes', 'preservar-pacote', 'preservar-principal', 'sem-sessoes'])
  test('encerramento: intenção nunca aplicada com ' + tipo, async (t) => {
    const { page } = await vazio(t),
      s = inicial();
    if (tipo.startsWith('preservar')) await cadastrar(page);
    if (tipo === 'preservar-principal') {
      const k = await chave(page);
      await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
        k,
        s,
      });
    }
    const texto = await backupTexto(
      page,
      pacote(),
      tipo === 'sem-sessoes' ? {} : { principal: s, responsavel: inicial() }
    );
    await intencao(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page);
    const d = await diagnosticar(page);
    assert.equal(d.diagnostico.encerramento.elegivel, true, JSON.stringify(d));
    await autorizarEnc(page, texto);
    assert.deepEqual(await dados(page), antes);
    const r = await encerrar(page);
    assert.equal(r.ok, true, JSON.stringify(r));
    assert.equal(r.efeitosEscolaresGravados, 0);
    const depois = await dados(page);
    assert.deepEqual(escolar(depois), escolar(antes));
    const terminal = structuredClone(depois.operacoes[0]);
    delete terminal.encerramento;
    terminal.estado = antes.operacoes[0].estado;
    terminal.revisao = antes.operacoes[0].revisao;
    assert.deepEqual(terminal, antes.operacoes[0]);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), ['operacoes:put']);
    assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
    assert.equal((await solicitarEnc(page, texto)).codigo, 'OPERACAO_JA_ENCERRADA');
    assert.equal((await encerrar(page)).ok, false);
    assert.deepEqual(await dados(page), depois);
  });
for (const falha of ['quota-pacote', 'put-2', 'put-3', 'quota-local', 'segunda-sessao'])
  test(
    'encerramento: aplicação ' + falha + ' impede cancelar mesmo sem efeito confirmado',
    async (t) => {
      const { page } = await vazio(t),
        texto = await pendente(page, falha, { principal: inicial(), responsavel: inicial() }),
        antes = await dados(page);
      await vigiarRecon(page);
      const d = await diagnosticar(page);
      assert.equal(d.diagnostico.encerramento.elegivel, false);
      assert.equal((await solicitarEnc(page, texto)).ok, false);
      assert.deepEqual(await dados(page), antes);
      assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
      assert.equal((await inspecionar(page)).bloqueiaRestauracao, true);
    }
  );

async function prepararEnc(page) {
  const texto = await backupTexto(page);
  await intencao(page, texto);
  return texto;
}
for (const modo of ['quota', 'abort', 'timeout'])
  test('encerramento: falha ' + modo + ' preserva último journal confirmado', async (t) => {
    const { page } = await vazio(t),
      texto = await prepararEnc(page);
    await autorizarEnc(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page, modo);
    const r = await encerrar(page);
    assert.equal(r.ok, false);
    assert.equal(r.encerramentoConfirmado, false);
    if (modo === 'timeout') assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
    assert.deepEqual(await dados(page), antes);
    assert.ok(
      (await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put')
    );
  });

for (const caso of ['cancelada', 'identidade', 'bytes', 'estado'])
  test('encerramento: revoga por ' + caso + ' sem tocar escola', async (t) => {
    const { page } = await vazio(t),
      texto = await prepararEnc(page);
    await autorizarEnc(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page);
    if (caso === 'cancelada') await page.evaluate(() => window.enc.cancelar());
    if (caso === 'identidade') copyId = B;
    if (caso === 'estado') {
      const k = await chave(page);
      await page.evaluate((k) => localStorage.setItem(k, '{'), k);
    }
    const r =
      caso === 'bytes'
        ? await page.evaluate(() =>
            window.LabJournal.encerrarIntencao(window.texto + ' ', window.confirmacaoEnc)
          )
        : await encerrar(page);
    assert.equal(r.ok, false);
    copyId = A;
    const depois = await dados(page);
    assert.deepEqual(depois.pacotes, antes.pacotes);
    assert.deepEqual(depois.administracao, antes.administracao);
    assert.deepEqual(depois.operacoes, antes.operacoes);
    if (caso !== 'estado') {
      assert.deepEqual(depois.local, antes.local);
      assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
    }
  });

test('encerramento: cancelamento durante leitura impede retorno tardio de escrever', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  let liberar, sinalizar;
  const retida = new Promise((r) => {
      liberar = r;
    }),
    recebida = new Promise((r) => {
      sinalizar = r;
    });
  await page.route(origem + '/__revisoes_local__/identity', async (route) => {
    sinalizar();
    await retida;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
    });
  });
  await page.evaluate(() => {
    window.promessa = window.LabJournal.encerrarIntencao(window.texto, window.confirmacaoEnc);
  });
  await recebida;
  await page.evaluate(() => window.enc.cancelar());
  liberar();
  assert.equal((await page.evaluate(() => window.promessa)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('encerramento: cancelamento na fronteira nativa antes de put não persiste', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    const n = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const tx = n.apply(this, args);
      if (args[1] === 'readwrite') void window.enc.cancelar();
      return tx;
    };
  });
  assert.equal((await encerrar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});

test('encerramento: perda de exclusividade observável bloqueia sem escrever', async (t) => {
  const { page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    navigator.locks.query = () => Promise.reject(new Error('Fixture'));
  });
  assert.equal((await encerrar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('encerramento: interrupção real da aba durante put aborta só o journal', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await prepararEnc(page);
  await autorizarEnc(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page, 'interromper');
  const leitor = await ctx.newPage();
  await carregar(leitor);
  await page.evaluate(() => {
    window.promessa = window.LabJournal.encerrarIntencao(window.texto, window.confirmacaoEnc);
  });
  await page.waitForFunction(() => window.pedidoRecon && !window.commitRecon);
  await page.close();
  assert.deepEqual(await dados(leitor), antes);
  assert.equal((await inspecionar(leitor)).bloqueiaRestauracao, true);
});
test('encerramento: reinício completo do Chromium conserva pendência e requer confirmação nova', async () => {
  copyId = A;
  status = 200;
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-encerramento-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    const texto = await prepararEnc(page),
      id = await page.evaluate(() => window.operacao);
    const antes = await dados(page);
    await autorizarEnc(page, texto);
    await ctx.close();
    ctx = await chromium.launchPersistentContext(perfil, { headless: true });
    page = await ctx.newPage();
    await carregar(page);
    await page.evaluate(
      ({ id, texto }) => {
        window.operacao = id;
        window.texto = texto;
      },
      { id, texto }
    );
    assert.deepEqual(await dados(page), antes);
    assert.equal((await inspecionar(page)).bloqueiaRestauracao, true);
    assert.equal((await encerrar(page)).ok, false);
    await vigiarRecon(page);
    await autorizarEnc(page, texto);
    assert.equal((await encerrar(page)).ok, true);
    const final = await dados(page);
    await ctx.close();
    ctx = await chromium.launchPersistentContext(perfil, { headless: true });
    page = await ctx.newPage();
    await carregar(page);
    await page.evaluate(
      ({ id, texto }) => {
        window.operacao = id;
        window.texto = texto;
      },
      { id, texto }
    );
    assert.deepEqual(await dados(page), final);
    assert.equal(
      (await diagnosticar(page)).diagnostico.journal.encerramentoSemAplicacaoObservado,
      true
    );
    assert.equal((await solicitarEnc(page, texto)).codigo, 'OPERACAO_JA_ENCERRADA');
  } finally {
    await ctx.close();
  }
});

test('encerramento: memória temporária recente em outra aba bloqueia até fechamento real', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await prepararEnc(page),
    outra = await prepararLeitor(ctx, page, texto);
  status = 503;
  const r = await outra.evaluate(async (p) => {
    const s = window.LabCoordenador.criarSessao();
    await s.preparar();
    s.decidirTemporario(true);
    await s.carregarTemporario(JSON.stringify(p));
    await s.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
    const c = {
      id: 'lab-runtime',
      chave: null,
      aluno: p.perfil,
      nome: 'Fixture',
      materia: 'Ciências',
      titulo: p.titulo,
      questoes: p.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
    };
    return window.QuestionariosRevisoes.registrarLab(() => c).handle.abrir(s, 'principal');
  }, pacote());
  status = 200;
  assert.equal(r.ok, true);
  await outra.locator('[data-opcao-gramatica="Lua"]').click();
  const antes = await dados(page);
  await vigiarRecon(page);
  assert.equal((await solicitarEnc(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  await outra.close();
  await esperarLocks(page);
  await autorizarEnc(page, texto);
  assert.equal((await encerrar(page)).ok, true);
});
test('encerramento: duas abas respeitam exclusividade e liberação nativa', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await prepararEnc(page);
  const outra = await prepararLeitor(ctx, page, texto);
  await autorizarEnc(page, texto);
  await vigiarRecon(outra);
  const antes = await dados(outra);
  assert.equal((await solicitarEnc(outra, texto)).ok, false);
  assert.deepEqual(await dados(outra), antes);
  await page.evaluate(() => window.enc.cancelar());
  await esperarLocks(outra);
  await autorizarEnc(outra, texto);
  assert.equal((await encerrar(outra)).ok, true);
});
async function prepararLeitor(ctx, page, texto) {
  const leitor = await ctx.newPage();
  await carregar(leitor);
  await leitor.evaluate(
    ({ id, texto }) => {
      window.operacao = id;
      window.texto = texto;
    },
    { id: await page.evaluate(() => window.operacao), texto }
  );
  return leitor;
}
async function esperarLocks(page) {
  const { expect } = require('@playwright/test');
  await expect
    .poll(
      async () => {
        const q = await page.evaluate(() => navigator.locks.query());
        return !q.held.length && !q.pending.length;
      },
      { intervals: [25], timeout: 3000 }
    )
    .toBe(true);
}

async function alterarAlvo(page, tipo) {
  await page.evaluate(async (tipo) => {
    const c = await window.LabIdentidade.resolverIdentidade();
    let diferente;
    if (tipo === 'digest') {
      const p = JSON.parse(window.texto).entradas[0].pacote;
      p.titulo = 'Conteúdo divergente';
      diferente = await window.LabValidador.validarPacote(JSON.stringify(p));
    }
    const db = await new Promise((resolve) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + c.copyId + '.v1');
      q.onsuccess = () => resolve(q.result);
    });
    await new Promise((resolve) => {
      const tx = db.transaction(['pacotes', 'administracao', 'operacoes'], 'readwrite');
      if (['administracao', 'digest'].includes(tipo)) {
        const s = tx.objectStore('administracao'),
          q = s.get(['alice', 'sintetico', 1]);
        q.onsuccess = () =>
          s.put({
            ...q.result,
            ...(tipo === 'digest' ? { digest: diferente.digest } : { situacao: 'arquivada' }),
          });
      }
      if (tipo === 'digest') {
        const s = tx.objectStore('pacotes'),
          q = s.get(['alice', 'sintetico', 1]);
        q.onsuccess = () =>
          s.put({ ...q.result, digest: diferente.digest, conteudo: diferente.canonico });
      }
      if (tipo === 'orfao') tx.objectStore('administracao').delete(['alice', 'sintetico', 1]);
      if (tipo === 'conteudo-ausente')
        for (const s of ['pacotes', 'administracao'])
          tx.objectStore(s).delete(['alice', 'sintetico', 1]);
      if (['journal', 'conflito', 'legado'].includes(tipo)) {
        const s = tx.objectStore('operacoes'),
          q = s.get(window.operacao);
        q.onsuccess = () =>
          tipo === 'conflito'
            ? s.add({ ...q.result, id: window.crypto.randomUUID() })
            : s.put({
                ...q.result,
                ...(tipo === 'journal'
                  ? { versao: 99, privado: 'PRIVADO_FIXTURE' }
                  : {
                      estado: 'bloqueada',
                      revisao: 3,
                      marcadores: {
                        intencao: 'registrada',
                        aplicacao: 'nao-iniciada',
                        efeitos: 'nao-comprovados',
                      },
                    }),
              });
      }
      if (tipo === 'desconhecido')
        tx.objectStore('operacoes').add({ id: 'desconhecido', privado: 'PRIVADO_FIXTURE' });
      tx.oncomplete = resolve;
    });
    db.close();
  }, tipo);
}
for (const tipo of ['administracao', 'journal', 'progresso'])
  test('encerramento: CAS recusa mudança de ' + tipo + ' na última fronteira', async (t) => {
    const { page } = await vazio(t),
      texto = await prepararEncPreservado(page);
    await autorizarEnc(page, texto);
    const antes = await dados(page),
      k = await chave(page);
    await vigiarRecon(page);
    await page.evaluate(
      ({ tipo, k }) => {
        const n = IDBDatabase.prototype.transaction;
        IDBDatabase.prototype.transaction = function (...args) {
          if (args[1] === 'readwrite') {
            IDBDatabase.prototype.transaction = n;
            if (tipo === 'progresso') localStorage.setItem(k, 'VALOR_INSERIDO_PELA_FIXTURE');
            else {
              const store = tipo === 'journal' ? 'operacoes' : 'administracao',
                tx = n.call(this, store, 'readwrite'),
                s = tx.objectStore(store);
              const q = s.get(tipo === 'journal' ? window.operacao : ['alice', 'sintetico', 1]);
              q.onsuccess = () =>
                s.put(
                  tipo === 'journal'
                    ? { ...q.result, estado: 'bloqueada', revisao: 3 }
                    : { ...q.result, criadoEm: '2026-01-01T00:00:00.000Z' }
                );
            }
          }
          return n.apply(this, args);
        };
      },
      { tipo, k }
    );
    assert.equal((await encerrar(page)).ok, false);
    const depois = await dados(page);
    assert.deepEqual(depois.pacotes, antes.pacotes);
    if (tipo !== 'administracao') assert.deepEqual(depois.administracao, antes.administracao);
    if (tipo !== 'journal') assert.deepEqual(depois.operacoes, antes.operacoes);
    if (tipo !== 'progresso') assert.deepEqual(depois.local, antes.local);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), [
      tipo === 'administracao'
        ? 'administracao:put'
        : tipo === 'journal'
          ? 'operacoes:put'
          : 'local:setItem',
    ]); // somente a injeção da fixture
  });

async function prepararEncPreservado(page) {
  await cadastrar(page);
  return prepararEnc(page);
}
test('encerramento: principal preexistente, pontos históricos, vizinhos e revisão oficial preservados', async (t) => {
  const { page } = await vazio(t),
    s = inicial(),
    p = pacote();
  s.respostas.q1 = ['Lua'];
  s.pontuadas.q1 = true;
  s.pontos = 1;
  await cadastrar(page);
  const k = await chave(page);
  await page.evaluate(
    ({ k, s, p }) => {
      localStorage.setItem(k, JSON.stringify(s, null, 2));
      localStorage.setItem(k + '.vizinho', 'preservar');
      window.QuestionariosRevisoes.registrar({
        id: 'oficial',
        chave: 'oficial-fixture',
        aluno: 'alice',
        nome: 'Fixture',
        materia: 'Ciências',
        titulo: p.titulo,
        questoes: p.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
      });
      window.QuestionariosRevisoes.abrir('oficial');
    },
    { k, s, p }
  );
  await page.locator('[data-opcao-gramatica="Lua"]').click();
  const vizinho = pacote('vizinho');
  vizinho.perfil = 'mariana';
  vizinho.versao = 2;
  await cadastrar(page, vizinho);
  const texto = await backupTexto(page, p, { principal: s, responsavel: inicial() });
  await intencao(page, texto);
  const antes = await dados(page),
    dom = await page.locator('#gramatica-conteudo').innerHTML();
  await vigiarRecon(page);
  await autorizarEnc(page, texto);
  assert.equal((await encerrar(page)).ok, true);
  const depois = await dados(page),
    e = await page.evaluate(() => window.mutacoesRecon);
  assert.deepEqual(depois.pacotes, antes.pacotes);
  assert.deepEqual(depois.administracao, antes.administracao);
  for (const [key, v] of antes.local) assert.equal(depois.local.find((a) => a[0] === key)[1], v);
  assert.equal(JSON.parse(depois.local.find((a) => a[0] === k)[1]).pontos, 1);
  assert.equal(await page.locator('#gramatica-conteudo').innerHTML(), dom);
  assert.equal(e.filter((x) => x === 'local:setItem').length, 0);
  assert.ok(e.every((x) => x === 'operacoes:put'));
});

function ditadoOperacional() {
  return {
    formato: 'lab-questionarios-v2',
    id: 'sintetico',
    versao: 1,
    perfil: 'alice',
    materia: 'ciencias',
    titulo: 'Sol',
    questoes: [
      {
        id: 'q1',
        bloco: 'Sol',
        titulo: 'Sol',
        instrucao: 'Sol',
        tipo: 'ditado',
        idioma: 'pt-BR',
        itens: [{ id: 'i1', texto: 'Sol' }],
      },
    ],
  };
}

test('6C.2 backend: encerramento v2 autentica após interrupção', async (t) => {
  const { page } = await vazio(t);
  const texto = await backupTexto(page, ditadoOperacional(), {
    principal: inicial(),
    responsavel: inicial(),
  });
  await intencao(page, texto);
  await autorizarEnc(page, texto);
  const resultado = await encerrar(page);
  assert.equal(resultado.ok, true, JSON.stringify(resultado));
  const d = await dados(page);
  assert.equal(d.operacoes[0].estado, 'cancelada-sem-aplicacao');
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
});
