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
function imutavel(r) {
  const c = structuredClone(r);
  delete c.estado;
  delete c.revisao;
  delete c.marcadores;
  for (const a of c.atividades)
    for (const p of [a.conteudo, ...Object.values(a.sessoes)]) {
      delete p.etapa;
      delete p.resultado;
    }
  return c;
}
async function solicitarRet(page, texto) {
  return page.evaluate(async (texto) => {
    const r = await window.LabJournal.solicitarRetomada(texto, window.operacao);
    window.ret = r.solicitacao;
    return r.ok ? r.solicitacao.consultar() : r;
  }, texto);
}
async function confirmarRet(page) {
  return page.evaluate(() => {
    const r = window.ret.confirmarRetomada();
    window.confirmacaoRet = r.confirmacao;
    return { ok: r.ok, codigo: r.codigo };
  });
}
const retomar = (page) =>
  page.evaluate(() => window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet));
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
for (const fronteira of [1, 2])
  for (const tipo of ['administracao', 'journal', 'progresso'])
    test(
      'retomada: CAS ' + tipo + ' na transação ' + fronteira + ' impede gravação escolar',
      async (t) => {
        const { page } = await vazio(t),
          texto = await pendente(page, 'quota-local');
        await autorizarRet(page, texto);
        const antes = await dados(page),
          k = await chave(page);
        await vigiarRecon(page);
        await page.evaluate(
          ({ tipo, k, fronteira }) => {
            const n = IDBDatabase.prototype.transaction;
            let contagem = 0;
            IDBDatabase.prototype.transaction = function (...args) {
              if (args[1] === 'readwrite' && ++contagem === fronteira) {
                IDBDatabase.prototype.transaction = n;
                if (tipo === 'progresso') localStorage.setItem(k, 'FIXTURE_INTERPOSTA');
                else {
                  const s = n
                    .call(this, tipo === 'journal' ? 'operacoes' : 'administracao', 'readwrite')
                    .objectStore(tipo === 'journal' ? 'operacoes' : 'administracao');
                  const q = s.get(tipo === 'journal' ? window.operacao : ['alice', 'sintetico', 1]);
                  q.onsuccess = () =>
                    s.put({
                      ...q.result,
                      ...(tipo === 'journal'
                        ? { estado: 'bloqueada', revisao: 3 }
                        : { criadoEm: '2026-01-01T00:00:00.000Z' }),
                    });
                }
              }
              return n.apply(this, args);
            };
          },
          { tipo, k, fronteira }
        );
        const r = await retomar(page);
        assert.equal(r.ok, false, JSON.stringify(r));
        const depois = await dados(page);
        assert.deepEqual(depois.pacotes, antes.pacotes);
        if (tipo !== 'administracao') assert.deepEqual(depois.administracao, antes.administracao);
        if (tipo !== 'progresso') assert.deepEqual(depois.local, antes.local);
        const eventos = await page.evaluate(() => window.mutacoesRecon);
        assert.deepEqual(eventos, [
          ...(fronteira === 2 ? ['operacoes:put'] : []),
          tipo === 'progresso'
            ? 'local:setItem'
            : tipo === 'journal'
              ? 'operacoes:put'
              : 'administracao:put',
        ]);
      }
    );
test('retomada: cancelamento com leitura pendente neutraliza retorno tardio', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'quota-local');
  await autorizarRet(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  let liberar, sinalizar;
  const retida = new Promise((r) => (liberar = r)),
    recebida = new Promise((r) => (sinalizar = r));
  await page.route(origem + '/__revisoes_local__/identity', async (route) => {
    sinalizar();
    await retida;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
    });
  });
  await page.evaluate(() => {
    window.promessaRet = window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet);
  });
  await recebida;
  await page.evaluate(() => window.ret.cancelar());
  liberar();
  assert.equal((await page.evaluate(() => window.promessaRet)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('retomada: memória temporária recente em outra aba bloqueia até fechamento real', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page, 'quota-local'),
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
  assert.equal((await solicitarRet(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  await outra.close();
  await esperarLocks(page);
  await autorizarRet(page, texto);
  assert.equal((await retomar(page)).ok, true);
});
test('retomada: cópias independentes não adotam operação vizinha', async (t) => {
  const { page } = await vazio(t),
    textoA = await pendente(page, 'quota-local'),
    idA = await page.evaluate(() => window.operacao),
    antesA = await dados(page);
  copyId = B;
  const textoB = await pendente(page, 'quota-local'),
    idB = await page.evaluate(() => window.operacao);
  await page.evaluate((id) => (window.operacao = id), idA);
  assert.equal((await solicitarRet(page, textoA)).ok, false);
  await page.evaluate((id) => (window.operacao = id), idB);
  await autorizarRet(page, textoB);
  assert.equal((await retomar(page)).ok, true);
  const depoisB = await dados(page);
  copyId = A;
  assert.deepEqual(await dados(page), { ...antesA, local: depoisB.local });
});
test('retomada: etapa futura presente sem solicitação não fabrica confirmação', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'put-3', { principal: inicial(), responsavel: inicial() });
  // Conteúdo observado, principal ainda não solicitada. Dado externo igual não fabrica história.
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
    k,
    s: inicial(),
  });
  const antes = await dados(page);
  await vigiarRecon(page);
  assert.equal((await solicitarRet(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('retomada: snapshot antes confirmado e depois ausente não é recriado', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'segunda-sessao', {
      principal: inicial(),
      responsavel: inicial(),
    });
  const k = await chave(page);
  await page.evaluate((k) => localStorage.removeItem(k), k);
  const antes = await dados(page);
  await vigiarRecon(page);
  const r = await solicitarRet(page, texto);
  assert.equal(r.ok, false);
  assert.ok(r.diagnostico.retomada.bloqueios.includes('principal:EFEITO_ANTES_OBSERVADO_AUSENTE'));
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
for (const modo of ['silenciosa', 'leitura-posterior'])
  test('retomada: escrita ' + modo + ' nunca anuncia conclusão', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page, 'quota-local');
    await autorizarRet(page, texto);
    await page.evaluate((modo) => {
      const set = Storage.prototype.setItem,
        get = Storage.prototype.getItem;
      let escreveu = false;
      Storage.prototype.setItem = function (...a) {
        escreveu = true;
        if (modo !== 'silenciosa') return set.apply(this, a);
      };
      Storage.prototype.getItem = function (...a) {
        if (escreveu && modo === 'leitura-posterior')
          throw new window.DOMException('Fixture', 'SecurityError');
        return get.apply(this, a);
      };
    }, modo);
    const r = await retomar(page);
    assert.equal(r.ok, false);
    assert.equal(r.aplicacaoConcluida, false);
    const d = await dados(page);
    assert.equal(d.operacoes[0].atividades[0].sessoes.principal.etapa, 'escrita-solicitada');
    assert.equal(d.local.length, modo === 'silenciosa' ? 0 : 1);
  });
test('retomada: transições preservam payload, passos e prefixo sem conceder escrita', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'quota-local'),
    antes = (await dados(page)).operacoes[0];
  const b = structuredClone(antes);
  b.marcadores.aplicacao = 'em-retomada';
  const c = structuredClone(b);
  c.atividades[0].sessoes.principal.etapa = 'escrita-observada';
  c.atividades[0].sessoes.principal.resultado = 'presenca-verificada';
  const d = structuredClone(c);
  d.atividades[0].sessoes.principal.etapa = 'resultado-confirmado';
  const regressao = structuredClone(b);
  regressao.atividades[0].conteudo.etapa = 'escrita-solicitada';
  regressao.atividades[0].conteudo.resultado = 'nao-comprovado';
  const payload = structuredClone(b);
  payload.atividades[0].sessoes.principal.snapshot.respostas.q1 = ['Lua'];
  const pular = structuredClone(b);
  pular.atividades[0].sessoes.principal.etapa = 'resultado-confirmado';
  pular.atividades[0].sessoes.principal.resultado = 'criacao-observada';
  const resultados = await page.evaluate(
    async (pares) => {
      const j = await window.LabJournal.abrirJournal();
      try {
        return await Promise.all(
          pares.map(([a, b]) => j.journal.avaliarTransicao(JSON.stringify(a), JSON.stringify(b)))
        );
      } finally {
        j.journal.fechar();
      }
    },
    [
      [antes, b],
      [b, c],
      [c, d],
      [b, regressao],
      [b, payload],
      [b, pular],
    ]
  );
  assert.deepEqual(
    resultados.map((r) => r.ok && r.coerente),
    [true, true, true, false, false, false]
  );
  assert.ok(resultados.every((r) => !r.transicaoOperacionalDisponivel));
  await autorizarRet(page, texto);
  assert.equal((await retomar(page)).ok, true);
});
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
for (const sessao of ['nenhuma', 'responsavel'])
  test('retomada: escopo com sessão ' + sessao + ' não cria sessão omitida', async (t) => {
    const { page } = await vazio(t),
      p = pacote();
    p.perfil = 'mariana';
    p.versao = 2;
    const sessoes = sessao === 'nenhuma' ? {} : { responsavel: inicial() },
      texto = await backupTexto(page, p, sessoes);
    await intencao(page, texto);
    await autorizarRet(page, texto);
    await vigiarRecon(page);
    const r = await retomar(page);
    assert.equal(r.ok, true, JSON.stringify(r));
    const d = await dados(page);
    assert.equal(d.local.length, sessao === 'nenhuma' ? 0 : 1);
    assert.equal(d.pacotes[0].perfil, 'mariana');
    assert.equal(d.pacotes[0].versao, 2);
    assert.deepEqual(Object.keys(d.operacoes[0].atividades[0].sessoes), Object.keys(sessoes));
  });
test('retomada: cancelar antes da confirmação não entrega token ou escrita', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'quota-local'),
    antes = await dados(page);
  assert.equal((await solicitarRet(page, texto)).ok, true);
  await vigiarRecon(page);
  await page.evaluate(() => window.ret.cancelar());
  assert.equal((await confirmarRet(page)).ok, false);
  assert.equal((await retomar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
async function autorizarRet(page, texto) {
  const r = await solicitarRet(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal((await confirmarRet(page)).ok, true);
}
for (const modo of ['quota', 'abort', 'timeout'])
  test('retomada: transação ' + modo + ' mantém último marcador confirmado', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page, 'quota-local');
    await autorizarRet(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page, modo);
    const r = await retomar(page);
    assert.equal(r.ok, false);
    assert.equal(r.aplicacaoConcluida, false);
    if (modo === 'timeout') assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
    assert.deepEqual(await dados(page), antes);
    assert.ok(
      (await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put')
    );
  });
for (const falha of ['quota-pacote', 'abort-pacote', 'quota-local'])
  test('retomada: falha escolar ' + falha + ' não perde dados nem conclui', async (t) => {
    const { page } = await vazio(t),
      texto = await backupTexto(page);
    await intencao(page, texto);
    await autorizarRet(page, texto);
    await observar(page, falha);
    const r = await retomar(page);
    assert.equal(r.ok, false);
    assert.equal(r.aplicacaoConcluida, false);
    const d = await dados(page);
    assert.equal(d.pacotes.length, falha === 'quota-local' ? 1 : 0);
    assert.equal(d.administracao.length, d.pacotes.length);
    assert.equal(d.local.length, 0);
    assert.equal(d.operacoes[0].estado, 'pendente');
  });
for (const nome of ['conteudo', 'principal', 'terminal'])
  test(
    'retomada: cancelamento após commit ' + nome + ' conserva efeito e exige nova decisão',
    async (t) => {
      const { page } = await vazio(t),
        texto = await backupTexto(page, pacote(), { principal: inicial(), responsavel: inicial() });
      await intencao(page, texto);
      await autorizarRet(page, texto);
      await page.evaluate((nome) => {
        const put = IDBObjectStore.prototype.put;
        IDBObjectStore.prototype.put = function (r, ...args) {
          const q = put.call(this, r, ...args);
          if (
            this.name === 'operacoes' &&
            ((nome === 'terminal' && r.estado === 'aplicacao-concluida') ||
              (nome !== 'terminal' &&
                (nome === 'conteudo' ? r.atividades[0].conteudo : r.atividades[0].sessoes[nome])
                  .etapa === 'resultado-confirmado'))
          ) {
            IDBObjectStore.prototype.put = put;
            this.transaction.addEventListener('complete', () => {
              void window.ret.cancelar();
            });
          }
          return q;
        };
      }, nome);
      const r = await retomar(page);
      assert.equal(r.ok, false);
      assert.equal(r.aplicacaoConcluida, false);
      const d = await dados(page);
      assert.equal(d.pacotes.length, 1);
      assert.equal(d.local.length, nome === 'conteudo' ? 0 : nome === 'principal' ? 1 : 2);
      if (nome === 'terminal') {
        assert.equal((await diagnosticar(page)).diagnostico.journal.terminalObservado, true);
        assert.equal((await solicitarRet(page, texto)).codigo, 'OPERACAO_JA_CONCLUIDA');
      } else {
        const salvo = d.local.map((x) => [...x]);
        await vigiarRecon(page);
        await autorizarRet(page, texto);
        assert.equal((await retomar(page)).ok, true);
        const depois = await dados(page);
        for (const [k, v] of salvo) assert.equal(depois.local.find((x) => x[0] === k)[1], v);
        assert.ok(!(await page.evaluate(() => window.mutacoesRecon)).includes('pacotes:add'));
      }
    }
  );
for (const fronteira of ['solicitada', 'add', 'snapshot'])
  test('retomada: fechamento real na fronteira ' + fronteira, async (t) => {
    const { ctx, page } = await vazio(t),
      texto = await backupTexto(page);
    await intencao(page, texto);
    await autorizarRet(page, texto);
    const leitor = await prepararLeitor(ctx, page, texto);
    if (fronteira === 'solicitada') {
      await page.evaluate(() => {
        const put = IDBObjectStore.prototype.put,
          n = window.fetch;
        IDBObjectStore.prototype.put = function (r, ...args) {
          const q = put.call(this, r, ...args);
          if (this.name === 'operacoes' && r.atividades[0].conteudo.etapa === 'escrita-solicitada')
            this.transaction.addEventListener('complete', () => {
              window.fetch = (...a) =>
                String(a[0]).includes('/__revisoes_local__/identity')
                  ? new Promise(() => {})
                  : n(...a);
              window.fronteira = true;
            });
          return q;
        };
      });
    } else if (fronteira === 'add') await observar(page, 'interromper-pacote');
    else
      await page.evaluate(() => {
        const tx = IDBDatabase.prototype.transaction,
          set = Storage.prototype.setItem;
        IDBDatabase.prototype.transaction = function (...a) {
          const t = tx.apply(this, a);
          if (a[1] === 'readwrite') window.txAtual = t;
          return t;
        };
        Storage.prototype.setItem = function (...a) {
          set.apply(this, a);
          window.snapshotAceito = true;
          const s = window.txAtual.objectStore('operacoes'),
            manter = () => {
              const q = s.get(window.operacao);
              q.onsuccess = manter;
            };
          manter();
        };
      });
    await page.evaluate(() => {
      window.promessaRet = window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet);
    });
    await page.waitForFunction(
      (f) =>
        f === 'solicitada'
          ? window.fronteira
          : f === 'add'
            ? window.aceitou
            : window.snapshotAceito,
      fronteira
    );
    await page.close();
    await esperarLocks(leitor);
    const antes = await dados(leitor);
    assert.equal(antes.pacotes.length, fronteira === 'snapshot' ? 1 : 0);
    assert.equal(antes.administracao.length, antes.pacotes.length);
    assert.equal(antes.local.length, fronteira === 'snapshot' ? 1 : 0);
    assert.equal(antes.operacoes[0].estado, 'pendente');
    await vigiarRecon(leitor);
    if (fronteira === 'snapshot') {
      assert.equal((await solicitarRet(leitor, texto)).codigo, 'ENCAMINHAR_RECONCILIACAO');
      await autorizarRecon(leitor, texto);
      assert.equal((await reconciliar(leitor)).ok, true);
      assert.deepEqual(escolar(await dados(leitor)), escolar(antes));
    } else {
      await autorizarRet(leitor, texto);
      assert.equal((await retomar(leitor)).ok, true);
    }
  });
test('retomada: duas abas respeitam exclusividade e liberação nativa', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page, 'quota-local');
  const outra = await prepararLeitor(ctx, page, texto);
  await autorizarRet(page, texto);
  await vigiarRecon(outra);
  const antes = await dados(outra);
  assert.equal((await solicitarRet(outra, texto)).ok, false);
  assert.deepEqual(await dados(outra), antes);
  await page.evaluate(() => window.ret.cancelar());
  await esperarLocks(outra);
  await autorizarRet(outra, texto);
  assert.equal((await retomar(outra)).ok, true);
});
test('retomada: reinício completo do Chromium exige novo gesto e preserva journal/progresso', async () => {
  copyId = A;
  status = 200;
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-retomada-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    const texto = await pendente(page, 'segunda-sessao', {
        principal: inicial(),
        responsavel: inicial(),
      }),
      id = await page.evaluate(() => window.operacao),
      antes = await dados(page);
    await autorizarRet(page, texto);
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
    assert.equal((await retomar(page)).ok, false);
    await vigiarRecon(page);
    await autorizarRet(page, texto);
    assert.equal((await retomar(page)).ok, true);
    const final = await dados(page);
    assert.equal(
      (await page.evaluate(() => window.mutacoesRecon)).filter((x) => x === 'local:setItem').length,
      1
    );
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
    assert.equal((await solicitarRet(page, texto)).codigo, 'OPERACAO_JA_CONCLUIDA');
  } finally {
    await ctx.close();
  }
});
for (const falha of [
  'intencao',
  'put-1',
  'quota-pacote',
  'put-2',
  'put-3',
  'put-4',
  'quota-local',
  'segunda-sessao',
]) {
  test('retomada: completa somente ausentes após ' + falha, async (t) => {
    const { page } = await vazio(t),
      sessoes = { principal: inicial(), responsavel: inicial() };
    let texto;
    if (falha === 'intencao') {
      texto = await backupTexto(page, pacote(), sessoes);
      await intencao(page, texto);
    } else texto = await pendente(page, falha, sessoes);
    const antes = await dados(page),
      diag = await diagnosticar(page);
    assert.equal(diag.ok, true, JSON.stringify(diag));
    assert.equal(diag.diagnostico.retomada.elegivel, true, JSON.stringify(diag));
    await vigiarRecon(page);
    await autorizarRet(page, texto);
    assert.deepEqual(await dados(page), antes);
    const r = await retomar(page);
    assert.equal(r.ok, true, JSON.stringify(r));
    const depois = await dados(page),
      eventos = await page.evaluate(() => window.mutacoesRecon);
    assert.deepEqual(imutavel(depois.operacoes[0]), imutavel(antes.operacoes[0]));
    assert.equal(depois.operacoes.length, 1);
    assert.equal(depois.operacoes[0].marcadores.efeitos, 'verificados-por-retomada');
    assert.equal(depois.pacotes.length, 1);
    assert.equal(depois.administracao.length, 1);
    assert.equal(depois.local.length, 2);
    for (const [k, v] of antes.local) assert.equal(depois.local.find((a) => a[0] === k)[1], v);
    if (antes.pacotes.length) assert.deepEqual(depois.pacotes, antes.pacotes);
    if (antes.administracao.length) assert.deepEqual(depois.administracao, antes.administracao);
    assert.equal(eventos.filter((x) => x === 'pacotes:add').length, antes.pacotes.length ? 0 : 1);
    assert.equal(
      eventos.filter((x) => x === 'administracao:add').length,
      antes.administracao.length ? 0 : 1
    );
    assert.equal(eventos.filter((x) => x === 'local:setItem').length, 2 - antes.local.length);
    assert.ok(
      eventos.every((x) =>
        ['operacoes:put', 'pacotes:add', 'administracao:add', 'local:setItem'].includes(x)
      ),
      JSON.stringify(eventos)
    );
    assert.equal((await retomar(page)).ok, false);
    assert.deepEqual(await dados(page), depois);
    assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
  });
}
test('retomada: todos presentes encaminha à reconciliação sem escrever', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'put-5');
  await vigiarRecon(page);
  const r = await solicitarRet(page, texto);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'ENCAMINHAR_RECONCILIACAO');
  assert.equal(r.diagnostico.retomada.encaminhamento, 'reconciliacao');
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  await autorizarRecon(page, texto);
  assert.equal((await reconciliar(page)).ok, true);
});
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
for (const tipo of [
  'administracao',
  'orfao',
  'journal',
  'desconhecido',
  'conflito',
  'digest',
  'snapshot',
  'progresso-divergente',
  'leitura',
  'conteudo-ausente',
])
  test('retomada: bloqueia ' + tipo + ' sem reparar dados', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page, 'segunda-sessao', {
        principal: inicial(),
        responsavel: inicial(),
      });
    if (['snapshot', 'progresso-divergente'].includes(tipo)) {
      const k = await chave(page);
      await page.evaluate(
        ({ k, tipo }) => {
          const s = JSON.parse(localStorage.getItem(k));
          s.respostas.q1 = ['Lua'];
          localStorage.setItem(k, tipo === 'snapshot' ? '{PRIVADO_FIXTURE' : JSON.stringify(s));
        },
        { k, tipo }
      );
    } else if (tipo !== 'leitura') await alterarAlvo(page, tipo);
    const antes = await dados(page);
    await vigiarRecon(page);
    if (tipo === 'leitura')
      await page.evaluate(() => {
        Storage.prototype.getItem = () => {
          throw new window.DOMException('Fixture', 'SecurityError');
        };
      });
    const d = await diagnosticar(page),
      r = await solicitarRet(page, texto);
    assert.equal(r.ok, false, JSON.stringify(r));
    assert.ok(!JSON.stringify(d).includes('PRIVADO_FIXTURE'));
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  });
for (const tipo of ['sem-backup', 'conteudo', 'sessoes', 'sessoes-omitidas', 'snapshot'])
  test('retomada: backup ' + tipo + ' não amplia intenção', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page, 'quota-local');
    let outro;
    if (tipo !== 'sem-backup') {
      const b = JSON.parse(texto);
      if (tipo === 'conteudo') b.entradas[0].pacote.titulo = 'Outro';
      if (tipo === 'sessoes') b.entradas[0].sessoes.responsavel = inicial();
      if (tipo === 'sessoes-omitidas') delete b.entradas[0].sessoes.principal;
      if (tipo === 'snapshot') b.entradas[0].sessoes.principal.respostas.q1 = ['Lua'];
      outro =
        tipo === 'conteudo' ? await backupTexto(page, b.entradas[0].pacote) : JSON.stringify(b);
    }
    const antes = await dados(page);
    await vigiarRecon(page);
    assert.equal((await solicitarRet(page, outro)).ok, false);
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  });
for (const tipo of ['cancelar', 'expirar', 'identidade', 'bytes', 'base', 'lock'])
  test('retomada: confirmação revogada por ' + tipo, async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page, 'quota-local');
    await page.evaluate(() => {
      const n = window.setTimeout;
      window.setTimeout = (fn, ms, ...a) => {
        if (ms === 30000) window.expirarRet = fn;
        return n(fn, ms, ...a);
      };
    });
    await autorizarRet(page, texto);
    if (tipo === 'cancelar') await page.evaluate(() => window.ret.cancelar());
    if (tipo === 'expirar') await page.evaluate(() => window.expirarRet());
    if (tipo === 'identidade') copyId = B;
    if (tipo === 'base') {
      const k = await chave(page);
      await page.evaluate((k) => localStorage.setItem(k, 'fixture'), k);
    }
    if (tipo === 'lock')
      await page.evaluate(() => {
        navigator.locks.query = async () => ({ held: [], pending: [] });
      });
    copyId = tipo === 'identidade' ? B : A;
    await vigiarRecon(page);
    const r =
      tipo === 'bytes'
        ? await page.evaluate(() =>
            window.LabJournal.retomarIntencao(window.texto + ' ', window.confirmacaoRet)
          )
        : await retomar(page);
    assert.equal(r.ok, false, JSON.stringify(r));
    copyId = A;
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  });
test('retomada: tokens de outras finalidades e objetos copiados nunca autorizam', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'quota-local');
  await autorizarRet(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  const r = await page.evaluate(async () => {
    const j = window.LabJournal,
      r = [];
    for (const token of [
      undefined,
      true,
      {},
      structuredClone(window.confirmacaoRet),
      window.confirmacao,
      window.confirmacaoApp,
    ])
      r.push(await j.retomarIntencao(window.texto, token));
    r.push(await j.aplicarIntencao(window.texto, window.confirmacaoRet));
    r.push(await j.reconciliarIntencao(window.texto, window.confirmacaoRet));
    return r;
  });
  assert.ok(r.every((x) => !x.ok));
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  const paralelo = await page.evaluate(() =>
    Promise.all([
      window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet),
      window.LabJournal.retomarIntencao(window.texto, window.confirmacaoRet),
    ])
  );
  assert.equal(paralelo.filter((x) => x.ok).length, 1);
});
test('retomada: principal preexistente, pontos históricos, vizinhos e revisão oficial preservados', async (t) => {
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
  await autorizarRet(page, texto);
  assert.equal((await retomar(page)).ok, true);
  const depois = await dados(page),
    e = await page.evaluate(() => window.mutacoesRecon);
  assert.deepEqual(depois.pacotes, antes.pacotes);
  assert.deepEqual(depois.administracao, antes.administracao);
  for (const [key, v] of antes.local) assert.equal(depois.local.find((a) => a[0] === key)[1], v);
  assert.equal(JSON.parse(depois.local.find((a) => a[0] === k)[1]).pontos, 1);
  assert.equal(await page.locator('#gramatica-conteudo').innerHTML(), dom);
  assert.equal(e.filter((x) => x === 'local:setItem').length, 1);
  assert.ok(e.every((x) => ['operacoes:put', 'local:setItem'].includes(x)));
});
for (const tipo of ['removida', 'reformatada'])
  test('retomada: base declarada para preservação ' + tipo + ' bloqueia', async (t) => {
    const { page } = await vazio(t);
    await cadastrar(page);
    const k = await chave(page),
      s = inicial();
    await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
      k,
      s,
    });
    const texto = await backupTexto(page, pacote(), { principal: s, responsavel: inicial() });
    await intencao(page, texto);
    await page.evaluate(
      ({ k, tipo, s }) =>
        tipo === 'removida'
          ? localStorage.removeItem(k)
          : localStorage.setItem(k, JSON.stringify(s)),
      { k, tipo, s }
    );
    const antes = await dados(page);
    await vigiarRecon(page);
    assert.equal((await solicitarRet(page, texto)).ok, false);
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
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

test('6C.2 backend: retomada v2 autentica após interrupção', async (t) => {
  const { page } = await vazio(t);
  const texto = await pendente(
    page,
    'quota-local',
    { principal: inicial(), responsavel: inicial() },
    ditadoOperacional()
  );
  await autorizarRet(page, texto);
  const resultado = await retomar(page);
  assert.equal(resultado.ok, true, JSON.stringify(resultado));
  const d = await dados(page);
  assert.equal(d.operacoes[0].estado, 'aplicacao-concluida');
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
});

for (const modo of ['quota', 'abort', 'timeout'])
  test('6C.2 backend: retomada v2 falha ' + modo + ' conserva journal e memória', async (t) => {
    const { page } = await vazio(t);
    const texto = await pendente(
      page,
      'quota-local',
      { principal: inicial() },
      ditadoOperacional()
    );
    await autorizarRet(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page, modo);
    const r = await retomar(page);
    assert.equal(r.ok, false);
    assert.deepEqual(await dados(page), antes);
    if (modo === 'timeout') assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
  });
