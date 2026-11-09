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
test('reconciliação: diagnóstico sem banco não cria schema nem dados', async (t) => {
  const { page } = await vazio(t);
  const antes = await page.evaluate(() => indexedDB.databases());
  await vigiarRecon(page);
  const r = await page.evaluate(() =>
    window.LabJournal.inspecionarReconciliacao('11111111-1111-4111-8111-111111111111')
  );
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'BANCO_LAB_AUSENTE');
  assert.deepEqual(await page.evaluate(() => indexedDB.databases()), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
for (const caso of [
  'intencao',
  'pacote-ausente',
  'pacote-confirmado',
  'sessao-ausente',
  'duas-incompletas',
])
  test('reconciliação: mantém pendente ' + caso + ' sem escrever nada', async (t) => {
    const { page } = await vazio(t);
    let texto;
    if (caso === 'intencao') {
      texto = await backupTexto(page);
      await intencao(page, texto);
    } else
      texto = await pendente(
        page,
        caso === 'pacote-ausente'
          ? 'quota-pacote'
          : caso === 'pacote-confirmado'
            ? 'put-4'
            : caso === 'duas-incompletas'
              ? 'segunda-sessao'
              : 'quota-local',
        caso === 'duas-incompletas'
          ? { principal: inicial(), responsavel: inicial() }
          : { principal: inicial() }
      );
    const antes = await dados(page);
    await vigiarRecon(page);
    const d = await diagnosticar(page);
    assert.equal(d.ok, true, JSON.stringify(d));
    assert.equal(d.diagnostico.elegivelParaConfirmacao, false);
    assert.equal((await solicitarRecon(page, texto)).ok, false);
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
    if (caso === 'duas-incompletas')
      assert.deepEqual(
        d.diagnostico.sessoes.map((s) => s.classificacao),
        ['efeito-esperado-presente', 'efeito-esperado-ausente']
      );
  });
for (const caso of [
  'pacote-solicitado',
  'pacote-observado',
  'snapshot-solicitado',
  'snapshot-observado',
  'sem-terminal',
  'duas-sessoes',
])
  test('reconciliação: confirma somente journal em ' + caso, async (t) => {
    const { page } = await vazio(t);
    const semSessoes = caso.startsWith('pacote-'),
      falha =
        caso === 'pacote-solicitado'
          ? 'put-2'
          : caso === 'pacote-observado'
            ? 'put-3'
            : caso === 'snapshot-observado'
              ? 'put-6'
              : caso === 'sem-terminal'
                ? 'put-7'
                : caso === 'duas-sessoes'
                  ? 'put-8'
                  : 'put-5';
    const texto = await pendente(
      page,
      falha,
      semSessoes
        ? {}
        : { principal: inicial(), ...(caso === 'duas-sessoes' ? { responsavel: inicial() } : {}) }
    );
    const antes = await dados(page);
    await vigiarRecon(page);
    const d = await diagnosticar(page);
    assert.equal(d.ok, true, JSON.stringify(d));
    assert.equal(d.diagnostico.integralmenteConsistente, true);
    assert.equal(d.diagnostico.elegivelParaConfirmacao, true);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
    await autorizarRecon(page, texto);
    const r = await reconciliar(page);
    assert.equal(r.ok, true, JSON.stringify(r));
    assert.equal(r.aplicacaoConcluida, true);
    assert.equal(r.efeitosEscolaresGravados, 0);
    assert.equal(r.autoriaInferidaPorIgualdade, false);
    const depois = await dados(page);
    assert.deepEqual(escolar(depois), escolar(antes));
    assert.deepEqual(imutavel(depois.operacoes[0]), imutavel(antes.operacoes[0]));
    assert.equal(depois.operacoes[0].marcadores.efeitos, 'verificados-por-reconciliacao');
    assert.ok(
      (await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put')
    );
    assert.equal(await page.evaluate(() => window.commitRecon), true);
    assert.equal((await diagnosticar(page)).diagnostico.journal.terminalObservado, true);
    assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
  });
test('reconciliação: presença lida não fabrica causalidade de criação', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  const d = await diagnosticar(page);
  assert.equal(d.diagnostico.sessoes[0].autoriaComprovadaPorIgualdade, false);
  await autorizarRecon(page, texto);
  assert.equal((await reconciliar(page)).ok, true);
  const a = (await dados(page)).operacoes[0].atividades[0];
  assert.equal(a.conteudo.resultado, 'criacao-observada');
  assert.equal(a.sessoes.principal.resultado, 'presenca-verificada');
});
test('reconciliação: sem backup permite somente diagnóstico com payload suficiente', async (t) => {
  const { page } = await vazio(t);
  await pendente(page);
  const antes = await dados(page);
  await vigiarRecon(page);
  const d = await diagnosticar(page, false);
  assert.equal(d.ok, true);
  assert.equal(d.diagnostico.integralmenteConsistente, true);
  assert.equal(d.diagnostico.backupOriginalDisponivel, false);
  assert.equal(d.diagnostico.elegivelParaConfirmacao, false);
  assert.equal((await solicitarRecon(page, undefined)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: dado presente de etapa posterior não solicitada não autoriza conclusão', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page, 'put-4');
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
    k,
    s: inicial(),
  });
  const antes = await dados(page);
  await vigiarRecon(page);
  const d = await diagnosticar(page);
  assert.equal(d.diagnostico.integralmenteConsistente, true);
  assert.ok(d.diagnostico.bloqueios.includes('principal:ETAPA_NAO_SOLICITADA'));
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: representação divergente em criação solicitada mantém pendência', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
    k,
    s: inicial(),
  });
  const antes = await dados(page);
  await vigiarRecon(page);
  const d = await diagnosticar(page);
  assert.equal(d.diagnostico.sessoes[0].classificacao, 'efeito-esperado-presente');
  assert.ok(d.diagnostico.bloqueios.includes('principal:REPRESENTACAO_NAO_COMPROVADA'));
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: tokens anteriores, true e objetos copiados não habilitam journal', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page),
    antes = await dados(page);
  await vigiarRecon(page);
  const r = await page.evaluate(async (texto) => {
    const a = await window.LabRepositorio.abrirRepositorioExistente();
    try {
      return await Promise.all([
        window.LabJournal.reconciliarIntencao(texto, true),
        window.LabJournal.reconciliarIntencao(texto, window.confirmacao),
        window.LabJournal.reconciliarIntencao(texto, window.confirmacaoApp),
        a.repositorio.confirmarReconciliacaoJournal({}),
        window.LabJournal.executarReconciliacaoInterna({}, () => ({ ok: true })),
      ]);
    } finally {
      a.repositorio.fechar();
    }
  }, texto);
  assert.ok(r.every((r) => !r.ok));
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: confirmação é de uso único e conclusão não é regravada', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
  const r = await page.evaluate(() =>
    Promise.all([
      window.LabJournal.reconciliarIntencao(window.texto, window.confirmacaoRecon),
      window.LabJournal.reconciliarIntencao(window.texto, window.confirmacaoRecon),
    ])
  );
  assert.equal(r.filter((r) => r.ok).length, 1);
  const antes = await dados(page);
  await vigiarRecon(page);
  assert.equal((await reconciliar(page)).ok, false);
  const nova = await solicitarRecon(page, texto);
  assert.equal(nova.codigo, 'OPERACAO_JA_CONCLUIDA');
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
for (const modo of ['quota', 'abort', 'timeout'])
  test('reconciliação: falha ' + modo + ' preserva último journal confirmado', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page);
    await autorizarRecon(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page, modo);
    const r = await reconciliar(page);
    assert.equal(r.ok, false);
    assert.equal(r.aplicacaoConcluida, false);
    if (modo === 'timeout') assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
    assert.deepEqual(await dados(page), antes);
    assert.ok(
      (await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put')
    );
  });
for (const caso of ['cancelada', 'identidade', 'bytes', 'estado'])
  test('reconciliação: revoga por ' + caso + ' sem tocar escola', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page);
    await autorizarRecon(page, texto);
    const antes = await dados(page);
    await vigiarRecon(page);
    if (caso === 'cancelada') await page.evaluate(() => window.recon.cancelar());
    if (caso === 'identidade') copyId = B;
    if (caso === 'estado') {
      const k = await chave(page);
      await page.evaluate((k) => localStorage.setItem(k, '{'), k);
    }
    const r =
      caso === 'bytes'
        ? await page.evaluate(() =>
            window.LabJournal.reconciliarIntencao(window.texto + ' ', window.confirmacaoRecon)
          )
        : await reconciliar(page);
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

async function adulterar(page, tipo) {
  await page.evaluate(async (tipo) => {
    const copia = await window.LabIdentidade.resolverIdentidade();
    const db = await new Promise((resolve) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + copia.copyId + '.v1');
      q.onsuccess = () => resolve(q.result);
    });
    await new Promise((resolve) => {
      const tx = db.transaction(['pacotes', 'administracao', 'operacoes'], 'readwrite');
      if (tipo === 'administracao') {
        const s = tx.objectStore('administracao'),
          q = s.get(['alice', 'sintetico', 1]);
        q.onsuccess = () => s.put({ ...q.result, situacao: 'arquivada' });
      }
      if (tipo === 'orfao') tx.objectStore('administracao').delete(['alice', 'sintetico', 1]);
      if (tipo === 'journal') {
        const s = tx.objectStore('operacoes'),
          q = s.get(window.operacao);
        q.onsuccess = () => s.put({ ...q.result, versao: 99, privado: 'MARCADOR_PRIVADO' });
      }
      if (tipo === 'desconhecido')
        tx.objectStore('operacoes').add({ id: 'incompativel', privado: 'MARCADOR_PRIVADO' });
      if (tipo === 'conflito') {
        const s = tx.objectStore('operacoes'),
          q = s.get(window.operacao);
        q.onsuccess = () => s.add({ ...q.result, id: window.crypto.randomUUID() });
      }
      tx.oncomplete = resolve;
    });
    db.close();
  }, tipo);
}
for (const caso of ['administracao', 'orfao', 'journal', 'desconhecido', 'conflito', 'snapshot'])
  test('reconciliação: bloqueia ' + caso + ' sem reparo nem vazamento', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page);
    if (caso === 'snapshot') {
      const k = await chave(page);
      await page.evaluate((k) => localStorage.setItem(k, '{MARCADOR_PRIVADO'), k);
    } else await adulterar(page, caso);
    const antes = await dados(page);
    await vigiarRecon(page);
    const d = await diagnosticar(page);
    assert.equal(d.ok && d.diagnostico.elegivelParaConfirmacao, false);
    assert.ok(!JSON.stringify(d).includes('MARCADOR_PRIVADO'));
    assert.equal((await solicitarRecon(page, texto)).ok, false);
    assert.deepEqual(await dados(page), antes);
    assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
    if (caso === 'snapshot')
      assert.equal(d.diagnostico.sessoes[0].classificacao, 'dado-invalido-ou-corrompido');
    if (caso === 'administracao' || caso === 'orfao')
      assert.equal(d.diagnostico.conteudo.classificacao, 'dado-invalido-ou-corrompido');
  });
test('reconciliação: digest de par coerente diferente é divergência, sem sobrescrita', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page),
    p = pacote();
  p.titulo = 'Outro conteúdo';
  await page.evaluate(async (p) => {
    const v = await window.LabValidador.validarPacote(JSON.stringify(p)),
      c = await window.LabIdentidade.resolverIdentidade();
    const db = await new Promise((resolve) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + c.copyId + '.v1');
      q.onsuccess = () => resolve(q.result);
    });
    const base = {
      perfil: p.perfil,
      materia: p.materia,
      id: p.id,
      versao: p.versao,
      digest: v.digest,
    };
    await new Promise((resolve) => {
      const tx = db.transaction(['pacotes', 'administracao'], 'readwrite');
      tx.objectStore('pacotes').put({ ...base, conteudo: v.canonico });
      tx.objectStore('administracao').put({
        ...base,
        situacao: 'ativa',
        criadoEm: '2026-01-01T00:00:00.000Z',
      });
      tx.oncomplete = resolve;
    });
    db.close();
  }, p);
  const antes = await dados(page);
  await vigiarRecon(page);
  assert.equal(
    (await diagnosticar(page)).diagnostico.conteudo.classificacao,
    'dado-presente-divergente'
  );
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: leitura de progresso bloqueada é inconclusiva e nunca ausência', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page),
    antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    Storage.prototype.getItem = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  const d = await diagnosticar(page);
  assert.equal(d.ok, true);
  assert.equal(d.diagnostico.sessoes[0].classificacao, 'leitura-inconclusiva');
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: bases preservadas, vizinhos e histórico de pontos não são regravados', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const principal = inicial(),
    k = await chave(page);
  principal.respostas.q1 = ['Lua'];
  principal.pontuadas.q1 = true;
  principal.pontos = 1;
  await page.evaluate(
    ({ k, s }) => {
      localStorage.setItem(k, JSON.stringify(s, null, 2));
      localStorage.setItem('oficial-fixture', 'preservar');
      localStorage.setItem(k + '.outra-versao', 'vizinha');
    },
    { k, s: principal }
  );
  const vizinha = pacote('vizinha');
  vizinha.perfil = 'mariana';
  vizinha.versao = 2;
  await cadastrar(page, vizinha);
  const texto = await pendente(page, 'put-4', { principal, responsavel: inicial() });
  const antes = await dados(page);
  await vigiarRecon(page);
  const d = await diagnosticar(page);
  assert.equal(d.diagnostico.conteudo.classificacao, 'base-anterior-preservada');
  assert.equal(d.diagnostico.sessoes[0].classificacao, 'base-anterior-preservada');
  await autorizarRecon(page, texto);
  assert.equal((await reconciliar(page)).ok, true);
  const depois = await dados(page);
  assert.deepEqual(escolar(depois), escolar(antes));
  assert.equal(JSON.parse(depois.local.find(([key]) => key === k)[1]).pontos, 1);
  assert.deepEqual(JSON.parse(depois.local.find(([key]) => key === k)[1]).respostas.q1, ['Lua']);
  assert.ok((await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put'));
});
test('reconciliação: referência de preservação inválida exige backup para avaliar payload, nunca o repara', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const texto = await pendente(page, 'put-3');
  await adulterar(page, 'orfao');
  const antes = await dados(page);
  await vigiarRecon(page);
  const sem = await diagnosticar(page, false);
  assert.equal(sem.ok, false);
  assert.equal(sem.diagnostico.journal.integridade, 'nao-confirmada');
  const com = await diagnosticar(page);
  assert.equal(com.ok, true);
  assert.equal(com.diagnostico.conteudo.classificacao, 'dado-invalido-ou-corrompido');
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: segunda aba não obtém autorização concorrente e observa liberação nativa', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
  const outra = await ctx.newPage();
  await carregar(outra);
  await outra.evaluate(
    ({ id, texto }) => {
      window.operacao = id;
      window.texto = texto;
    },
    { id: await page.evaluate(() => window.operacao), texto }
  );
  await vigiarRecon(outra);
  assert.equal((await solicitarRecon(outra, texto)).ok, false);
  assert.deepEqual(await outra.evaluate(() => window.mutacoesRecon), []);
  await page.evaluate(() => window.recon.cancelar());
  await outra.waitForFunction(
    async () => {
      const q = await navigator.locks.query();
      return !q.held.length && !q.pending.length;
    },
    null,
    { timeout: 3000 }
  );
  await autorizarRecon(outra, texto);
  assert.equal((await reconciliar(outra)).ok, true);
});
test('reconciliação: memória temporária recente em outra aba conserva bloqueio', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page),
    antes = await dados(page),
    outra = await ctx.newPage();
  await carregar(outra);
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
  await vigiarRecon(page);
  assert.equal((await solicitarRecon(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: cópias separadas não adotam UUID ou progresso da vizinha', async (t) => {
  const { page } = await vazio(t),
    textoA = await pendente(page),
    idA = await page.evaluate(() => window.operacao),
    antesA = await dados(page);
  copyId = B;
  const textoB = await pendente(page),
    idB = await page.evaluate(() => window.operacao),
    antesB = await dados(page);
  await page.evaluate((id) => {
    window.operacao = id;
  }, idA);
  assert.equal((await solicitarRecon(page, textoA)).ok, false);
  await page.evaluate((id) => {
    window.operacao = id;
  }, idB);
  await vigiarRecon(page);
  await autorizarRecon(page, textoB);
  assert.equal((await reconciliar(page)).ok, true);
  assert.deepEqual(escolar(await dados(page)), escolar(antesB));
  copyId = A;
  assert.deepEqual(await dados(page), { ...antesA, local: antesB.local });
});
test('reconciliação: cancelamento durante leitura impede retorno tardio de escrever', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
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
    window.promessa = window.LabJournal.reconciliarIntencao(window.texto, window.confirmacaoRecon);
  });
  await recebida;
  await page.evaluate(() => window.recon.cancelar());
  liberar();
  assert.equal((await page.evaluate(() => window.promessa)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: cancelamento na fronteira nativa antes de put não persiste', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    const n = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const tx = n.apply(this, args);
      if (args[1] === 'readwrite') void window.recon.cancelar();
      return tx;
    };
  });
  assert.equal((await reconciliar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: perda de exclusividade observável bloqueia sem escrever', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    navigator.locks.query = () => Promise.reject(new Error('Fixture'));
  });
  assert.equal((await reconciliar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});
test('reconciliação: interrupção real da aba durante put aborta só o journal', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page);
  await autorizarRecon(page, texto);
  const antes = await dados(page);
  await vigiarRecon(page, 'interromper');
  const leitor = await ctx.newPage();
  await carregar(leitor);
  await page.evaluate(() => {
    window.promessa = window.LabJournal.reconciliarIntencao(window.texto, window.confirmacaoRecon);
  });
  await page.waitForFunction(() => window.pedidoRecon && !window.commitRecon);
  await page.close();
  assert.deepEqual(await dados(leitor), antes);
  assert.equal((await inspecionar(leitor)).bloqueiaRestauracao, true);
});
for (const terminal of [false, true])
  test(
    'reconciliação: fechamento lógico após commit ' +
      (terminal ? 'terminal' : 'intermediário') +
      ' mantém registro nativo',
    async (t) => {
      const { page } = await vazio(t),
        texto = await pendente(page);
      await autorizarRecon(page, texto);
      const antes = await dados(page);
      await vigiarRecon(page);
      await page.evaluate(
        (alvo) => {
          const n = IDBDatabase.prototype.transaction;
          let k = 0;
          IDBDatabase.prototype.transaction = function (...args) {
            const tx = n.apply(this, args);
            if (args[1] === 'readwrite' && ++k === alvo)
              tx.addEventListener('complete', () => {
                void window.recon.cancelar();
              });
            return tx;
          };
        },
        terminal ? 3 : 1
      );
      const r = await reconciliar(page);
      assert.equal(r.ok, false);
      assert.equal(r.aplicacaoConcluida, false);
      const depois = await dados(page);
      assert.deepEqual(escolar(depois), escolar(antes));
      assert.notDeepEqual(depois.operacoes, antes.operacoes);
      const d = await diagnosticar(page);
      assert.equal(d.ok, true);
      assert.equal(d.diagnostico.journal.terminalObservado, terminal);
      if (terminal)
        assert.equal((await solicitarRecon(page, texto)).codigo, 'OPERACAO_JA_CONCLUIDA');
      else {
        await autorizarRecon(page, texto);
        assert.equal((await reconciliar(page)).ok, true);
      }
      assert.ok(
        (await page.evaluate(() => window.mutacoesRecon)).every((e) => e === 'operacoes:put')
      );
    }
  );
test('reconciliação: reinício completo do Chromium conserva pendência e requer confirmação nova', async () => {
  copyId = A;
  status = 200;
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-reconciliacao-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    const texto = await pendente(page),
      id = await page.evaluate(() => window.operacao);
    const antes = await dados(page);
    await autorizarRecon(page, texto);
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
    assert.equal((await reconciliar(page)).ok, false);
    await vigiarRecon(page);
    await autorizarRecon(page, texto);
    assert.equal((await reconciliar(page)).ok, true);
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
    assert.equal((await diagnosticar(page)).diagnostico.journal.terminalObservado, true);
    assert.equal((await solicitarRecon(page, texto)).codigo, 'OPERACAO_JA_CONCLUIDA');
  } finally {
    await ctx.close();
  }
});

test('reconciliação: expiração revoga confirmação e libera posse sem journal novo', async (t) => {
  const { page } = await vazio(t),
    texto = await pendente(page);
  const antes = await dados(page);
  await page.evaluate(() => {
    const n = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => {
      if (ms === 30000) window.expirarRecon = fn;
      return n(fn, ms, ...args);
    };
  });
  await autorizarRecon(page, texto);
  await vigiarRecon(page);
  await page.evaluate(() => window.expirarRecon());
  assert.equal((await reconciliar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
  await page.waitForFunction(
    async () => {
      const q = await navigator.locks.query();
      return !q.held.length && !q.pending.length;
    },
    null,
    { timeout: 3000 }
  );
});
test('reconciliação: fechamento real antes da aquisição não inicia escrita', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await pendente(page),
    antes = await dados(page),
    leitor = await ctx.newPage();
  await carregar(leitor);
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
    if (!page.isClosed())
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
      });
  });
  await page.evaluate((texto) => {
    window.preparandoRecon = window.LabJournal.solicitarReconciliacao(texto, window.operacao);
  }, texto);
  await recebida;
  await page.close();
  liberar();
  assert.deepEqual(await dados(leitor), antes);
});
for (const tipo of ['administracao', 'journal', 'progresso'])
  test('reconciliação: CAS recusa mudança de ' + tipo + ' na última fronteira', async (t) => {
    const { page } = await vazio(t),
      texto = await pendente(page);
    await autorizarRecon(page, texto);
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
    assert.equal((await reconciliar(page)).ok, false);
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
test('reconciliação: transições são monotônicas, imutáveis e não conferem permissão', async (t) => {
  const { page } = await vazio(t);
  await pendente(page);
  const antes = await dados(page),
    a = antes.operacoes[0],
    b = structuredClone(a);
  b.marcadores.aplicacao = 'em-reconciliacao';
  b.atividades[0].sessoes.principal.etapa = 'escrita-observada';
  b.atividades[0].sessoes.principal.resultado = 'presenca-verificada';
  const c = structuredClone(b);
  c.atividades[0].sessoes.principal.etapa = 'resultado-confirmado';
  const d = structuredClone(c);
  d.estado = 'aplicacao-concluida';
  d.revisao = 4;
  d.marcadores = {
    intencao: 'registrada',
    aplicacao: 'concluida',
    efeitos: 'verificados-por-reconciliacao',
  };
  const diferente = structuredClone(b);
  diferente.atividades[0].sessoes.principal.snapshot.respostas.q1 = ['Lua'];
  await vigiarRecon(page);
  const r = await page.evaluate(
    async (pares) => {
      const j = (await window.LabJournal.abrirJournal()).journal;
      try {
        const r = [];
        for (const [a, b] of pares)
          r.push(await j.avaliarTransicao(JSON.stringify(a), JSON.stringify(b)));
        return r;
      } finally {
        j.fechar();
      }
    },
    [
      [a, b],
      [b, c],
      [c, d],
      [a, c],
      [c, b],
      [a, diferente],
    ]
  );
  assert.deepEqual(
    r.map((r) => r.ok && r.coerente),
    [true, true, true, false, false, false]
  );
  assert.ok(r.every((r) => r.transicaoOperacionalDisponivel === false));
  assert.deepEqual(await dados(page), antes);
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), []);
});

test('reconciliação: etapa não iniciada só confirma preservação comprovada, sem criar nada', async (t) => {
  const { page } = await vazio(t),
    k = await chave(page, pacote(), 'responsavel');
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
    k,
    s: inicial(),
  });
  const texto = await pendente(page, 'put-7', { principal: inicial(), responsavel: inicial() });
  const antes = await dados(page);
  assert.equal(antes.operacoes[0].atividades[0].sessoes.responsavel.etapa, 'nao-iniciada');
  await vigiarRecon(page);
  const d = await diagnosticar(page);
  assert.equal(d.diagnostico.sessoes[1].classificacao, 'base-anterior-preservada');
  await autorizarRecon(page, texto);
  assert.equal((await reconciliar(page)).ok, true);
  const depois = await dados(page);
  assert.deepEqual(escolar(depois), escolar(antes));
  assert.equal(depois.operacoes[0].atividades[0].sessoes.responsavel.resultado, 'base-preservada');
  assert.deepEqual(await page.evaluate(() => window.mutacoesRecon), [
    'operacoes:put',
    'operacoes:put',
  ]);
});
test('reconciliação: consulta de existência expirada não abre banco após retorno tardio', async (t) => {
  const { page } = await vazio(t);
  await pendente(page);
  const antes = await dados(page);
  await vigiarRecon(page);
  await page.evaluate(() => {
    const n = indexedDB.databases.bind(indexedDB);
    indexedDB.databases = () =>
      new Promise((resolve) => {
        window.retornarExistencia = () => n().then(resolve);
      });
  });
  const r = await diagnosticar(page);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
  await page.evaluate(() => window.retornarExistencia());
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

test('6C.2 backend: reconciliacao v2 autentica após interrupção', async (t) => {
  const { page } = await vazio(t);
  const texto = await pendente(page, 'put-5', { principal: inicial() }, ditadoOperacional());
  await autorizarRecon(page, texto);
  const resultado = await reconciliar(page);
  assert.equal(resultado.ok, true, JSON.stringify(resultado));
  const d = await dados(page);
  assert.equal(d.operacoes[0].estado, 'aplicacao-concluida');
  assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
});

for (const modo of ['quota', 'abort', 'timeout'])
  test(
    '6C.2 backend: reconciliacao v2 falha ' + modo + ' conserva journal e memória',
    async (t) => {
      const { page } = await vazio(t);
      const texto = await pendente(page, 'put-5', { principal: inicial() }, ditadoOperacional());
      await autorizarRecon(page, texto);
      const antes = await dados(page);
      await vigiarRecon(page, modo);
      const r = await reconciliar(page);
      assert.equal(r.ok, false);
      assert.deepEqual(await dados(page), antes);
      if (modo === 'timeout') assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
    }
  );
