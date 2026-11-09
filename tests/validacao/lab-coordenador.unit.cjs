/* global globalThis, window, navigator, indexedDB, localStorage, Storage, IDBObjectStore, queueMicrotask */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const { criarSessao } = require('../../ambiente_interativo/js/lab-coordenador.js');

const ROOT = path.resolve(__dirname, '../..');
const A = 'a'.repeat(64),
  B = 'b'.repeat(64);
const ID = { perfil: 'alice', id: 'sintetico', versao: 1 };
const scripts = [
  'lab-validador.js',
  'lab-identidade.js',
  'lab-repositorio.js',
  'lab-coordenador.js',
];
function pacote(id = 'sintetico', perfil = 'alice') {
  return JSON.stringify({
    formato: 'lab-questionarios-v1',
    id,
    versao: 1,
    perfil,
    materia: 'ciencias',
    titulo: 'Fixture sintética',
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
  });
}

test('Node: consentimento só após oferta, apenas booleano e recusa terminal', async () => {
  const s = criarSessao();
  assert.equal(s.decidirTemporario(true).codigo, 'ESTADO_INCOMPATIVEL');
  assert.equal((await s.preparar()).codigo, 'CONSENTIMENTO_NECESSARIO');
  assert.equal(s.obterSituacao().modo, null);
  assert.equal(s.decidirTemporario({ consentimento: true }).codigo, 'DECISAO_INVALIDA');
  assert.equal((await s.carregarTemporario(pacote())).codigo, 'MODO_INCOMPATIVEL');
  assert.equal(s.decidirTemporario(false).codigo, 'CONSENTIMENTO_RECUSADO');
  assert.equal(s.decidirTemporario(true).codigo, 'ESTADO_INCOMPATIVEL');
  assert.equal((await s.preparar()).ok, false);
  await s.encerrar();
});

test('Node: sessão temporária, identidade imutável e estado sem referências compartilhadas', async () => {
  const s = criarSessao();
  await s.preparar();
  assert.equal(s.decidirTemporario(true).ok, true);
  assert.match(s.obterSituacao().aviso, /não sobreviverá/);
  assert.equal(s.obterSituacao().backupDisponivel, false);
  assert.equal((await s.carregarTemporario(pacote())).criado, true);
  assert.equal((await s.carregarTemporario(pacote())).criado, false);
  const alterado = JSON.parse(pacote());
  alterado.titulo = 'Outro conteúdo';
  assert.equal((await s.carregarTemporario(JSON.stringify(alterado))).codigo, 'CONFLITO_DIGEST');
  const r = await s.adquirir(ID);
  assert.equal(r.ok, true);
  assert.equal(r.situacao.operacaoPendente, false);
  r.pacote.titulo = 'Não alterar';
  const estado = s.obterSituacao();
  estado.atividade.id = 'Não alterar';
  assert.equal((await s.consultar(ID)).pacote.titulo, 'Fixture sintética');
  assert.equal(s.obterSituacao().atividade.id, 'sintetico');
  assert.equal((await s.listar('alice')).pacotes.length, 1);
  assert.equal((await s.listar('mariana')).pacotes.length, 0);
  const a = s.liberar(),
    b = s.liberar();
  assert.equal(a, b);
  await a;
  const fim = s.encerrar();
  assert.equal(s.encerrar(), fim);
  await fim;
  assert.equal(s.obterSituacao().pacotesTemporarios, 0);
  assert.equal((await s.adquirir(ID)).ok, false);
});

test('Node: pacote não fornece consentimento e JSON com JavaScript é recusado', async () => {
  const s = criarSessao();
  await s.preparar();
  s.decidirTemporario(true);
  const p = JSON.parse(pacote());
  p.consentimento = true;
  assert.equal((await s.carregarTemporario(JSON.stringify(p))).codigo, 'PACOTE_INVALIDO');
  assert.equal(
    (await s.carregarTemporario('{"codigo":(()=>{throw 1})()}')).codigo,
    'PACOTE_INVALIDO'
  );
  assert.equal((await s.adquirir(ID)).codigo, 'PACOTE_AUSENTE');
  assert.equal(s.obterSituacao().estado, 'pronta');
  await s.encerrar();
});

test('Node: encerramento invalida preparação ainda em andamento', async () => {
  const s = criarSessao();
  const preparando = s.preparar();
  await s.encerrar();
  assert.equal((await preparando).codigo, 'OPERACAO_OBSOLETA');
  assert.equal(s.obterSituacao().estado, 'encerrada');
  assert.equal(s.decidirTemporario(true).ok, false);
});

test('Node: digest tardio após encerramento não repovoa memória', async (t) => {
  const s = criarSessao();
  await s.preparar();
  s.decidirTemporario(true);
  const subtle = globalThis.crypto.subtle;
  const digest = subtle.digest.bind(subtle);
  let chegar;
  let sinalizarInicio;
  const iniciou = new Promise((resolve) => {
    sinalizarInicio = resolve;
  });
  t.mock.method(
    subtle,
    'digest',
    (...args) =>
      new Promise((resolve, reject) => {
        chegar = () => digest(...args).then(resolve, reject);
        sinalizarInicio();
      })
  );
  const carregamento = s.carregarTemporario(pacote());
  await iniciou;
  assert.equal(typeof chegar, 'function');
  await s.encerrar();
  await chegar();
  assert.equal((await carregamento).codigo, 'OPERACAO_OBSOLETA');
  assert.equal(s.obterSituacao().pacotesTemporarios, 0);
  assert.equal(s.obterSituacao().estado, 'encerrada');
});

let server, browser, origem, copyId, status;
before(async () => {
  copyId = A;
  status = 200;
  server = http.createServer((req, res) => {
    if (req.url === '/__revisoes_local__/identity') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId }));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<!doctype html><title>Fixture coordenador</title>');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origem = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
async function carregar(page) {
  await page.goto(origem);
  for (const s of scripts)
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', s) });
}
async function contexto(t) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  return { ctx, page };
}
async function semear(page, conteudos = [pacote(), pacote('vizinho')]) {
  return page.evaluate(async (dados) => {
    const r = await window.LabRepositorio.abrirRepositorio();
    if (!r.ok) return r;
    const saida = [];
    try {
      for (const s of dados) saida.push(await r.repositorio.cadastrar(s));
    } finally {
      r.repositorio.fechar();
    }
    return saida;
  }, conteudos);
}
async function preparar(page) {
  return page.evaluate(async () => {
    window.sessao = window.LabCoordenador.criarSessao();
    return window.sessao.preparar();
  });
}
const adquirir = (page, id = ID) => page.evaluate((v) => window.sessao.adquirir(v), id);
const situacao = (page) => page.evaluate(() => window.sessao.obterSituacao());
const locks = (page) => page.evaluate(() => navigator.locks.query());

test('Chromium: sessão persistente adquire lock completo e mantém posse até liberação', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  assert.equal((await preparar(page)).situacao.modo, 'persistente');
  const r = await adquirir(page);
  assert.equal(r.ok, true);
  const consulta = await locks(page);
  assert.equal(consulta.held.length, 1);
  assert.equal(consulta.pending.length, 0);
  const nome = consulta.held[0].name;
  assert.equal(
    nome,
    'revisoesEscolares.lab.sessao.v1.' +
      JSON.stringify([A, 'alice', 'ciencias', 'sintetico', 1, r.digest])
  );
  assert.equal(consulta.held[0].mode, 'exclusive');
  assert.equal((await page.evaluate((v) => window.sessao.consultar(v), ID)).pacote.id, 'sintetico');
  assert.equal((await locks(page)).held.length, 1);
  assert.equal((await adquirir(page)).codigo, 'ATIVIDADE_JA_ABERTA');
  await page.evaluate(() => window.sessao.liberar());
  assert.equal((await locks(page)).held.length, 0);
  assert.equal((await situacao(page)).estado, 'pronta');
});

test('Chromium: duas abas na mesma atividade retornam ocupada sem fila ou modificação', async (t) => {
  const { ctx, page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await adquirir(page);
  const outra = await ctx.newPage();
  await carregar(outra);
  await preparar(outra);
  const antes = await page.evaluate(() => window.sessao.listar('alice'));
  const r = await adquirir(outra);
  assert.equal(r.codigo, 'ATIVIDADE_OCUPADA');
  assert.equal(r.situacao.disponibilidade, 'ocupada');
  assert.equal((await locks(outra)).pending.length, 0);
  assert.deepEqual(await page.evaluate(() => window.sessao.listar('alice')), antes);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await adquirir(outra)).ok, true);
});

test('Chromium: atividades distintas são independentes e encerramentos são idempotentes', async (t) => {
  const { ctx, page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await adquirir(page);
  const outra = await ctx.newPage();
  await carregar(outra);
  await preparar(outra);
  assert.equal((await adquirir(outra, { ...ID, id: 'vizinho' })).ok, true);
  assert.equal((await locks(page)).held.length, 2);
  const resultado = await page.evaluate(async () => {
    const a = window.sessao.encerrar(),
      b = window.sessao.encerrar();
    return { mesma: a === b, fim: await a };
  });
  assert.equal(resultado.mesma, true);
  assert.equal(resultado.fim.situacao.estado, 'encerrada');
  assert.equal((await locks(outra)).held.length, 1);
  await outra.evaluate(() => window.sessao.encerrar());
  assert.equal((await locks(outra)).held.length, 0);
});

test('Chromium: fechamento inesperado de aba libera exclusividade nativa', async (t) => {
  const { ctx, page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await adquirir(page);
  const outra = await ctx.newPage();
  await carregar(outra);
  await preparar(outra);
  assert.equal((await adquirir(outra)).codigo, 'ATIVIDADE_OCUPADA');
  await page.close();
  assert.equal((await adquirir(outra)).ok, true);
});

test('Chromium: copyId faz parte da exclusividade, mesmo com conteúdo idêntico', async (t) => {
  const { ctx, page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await adquirir(page);
  copyId = B;
  const outra = await ctx.newPage();
  await carregar(outra);
  await semear(outra);
  await preparar(outra);
  assert.equal((await adquirir(outra)).ok, true);
  assert.equal((await locks(outra)).held.length, 2);
  assert.equal((await outra.evaluate(() => window.sessao.revalidar())).ok, true);
  assert.equal(
    (await page.evaluate(() => window.sessao.revalidar())).codigo,
    'IDENTIDADE_ALTERADA'
  );
  assert.equal((await situacao(page)).estado, 'suspensa');
  assert.equal((await locks(outra)).held.length, 1);
});

for (const causa of ['identidade', 'locks', 'indexedDB']) {
  test(`Chromium: falta de ${causa} exige consentimento; recusa separada`, async (t) => {
    const { page } = await contexto(t);
    if (causa === 'identidade') status = 404;
    if (causa === 'locks')
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined })
      );
    if (causa === 'indexedDB')
      await page.evaluate(() =>
        Object.defineProperty(window, 'indexedDB', { configurable: true, value: undefined })
      );
    const r = await preparar(page);
    assert.equal(r.codigo, 'CONSENTIMENTO_NECESSARIO');
    assert.equal(r.situacao.modo, null);
    assert.equal(
      (await page.evaluate((s) => window.sessao.carregarTemporario(s), pacote())).ok,
      false
    );
    assert.equal(
      (await page.evaluate(() => window.sessao.decidirTemporario(false))).codigo,
      'CONSENTIMENTO_RECUSADO'
    );
    assert.equal((await page.evaluate(() => window.sessao.decidirTemporario(true))).ok, false);
  });
}

test('Chromium: temporário consentido só usa memória e não adota dados persistentes', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await page.evaluate(() => {
    localStorage.setItem('vizinho-oficial', 'preservar');
    window.abrirIDB = indexedDB.open.bind(indexedDB);
    indexedDB.open = () => {
      throw new Error('Não acessar banco em temporário');
    };
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    window.storageOriginais = {};
    for (const nome of ['getItem', 'setItem', 'removeItem', 'clear']) {
      window.storageOriginais[nome] = Storage.prototype[nome];
      Storage.prototype[nome] = () => {
        throw new Error('Não acessar progresso');
      };
    }
  });
  assert.equal((await preparar(page)).codigo, 'CONSENTIMENTO_NECESSARIO');
  assert.equal(
    (await page.evaluate(() => window.sessao.decidirTemporario({ aceitar: true }))).codigo,
    'DECISAO_INVALIDA'
  );
  assert.equal((await page.evaluate(() => window.sessao.decidirTemporario(true))).ok, true);
  assert.equal((await page.evaluate(() => window.sessao.listar('alice'))).pacotes.length, 0);
  assert.equal(
    (await page.evaluate((s) => window.sessao.carregarTemporario(s), pacote('somente-memoria'))).ok,
    true
  );
  assert.equal((await adquirir(page, { ...ID, id: 'somente-memoria' })).ok, true);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await situacao(page)).pacotesTemporarios, 0);
  await page.evaluate(() => {
    indexedDB.open = window.abrirIDB;
    for (const nome of Object.keys(window.storageOriginais))
      Storage.prototype[nome] = window.storageOriginais[nome];
  });
  assert.equal(await page.evaluate(() => localStorage.getItem('vizinho-oficial')), 'preservar');
  const persistidos = await page.evaluate(async () => {
    const r = await window.LabRepositorio.abrirRepositorio();
    try {
      return await r.repositorio.listar('alice');
    } finally {
      r.repositorio.fechar();
    }
  });
  assert.deepEqual(persistidos.pacotes.map((r) => r.pacote.id).sort(), ['sintetico', 'vizinho']);
});

for (const causa of ['identidade', 'locks']) {
  test(`Chromium: sessão persistente perde ${causa}, suspende e nunca vira temporária`, async (t) => {
    const { page } = await contexto(t);
    await semear(page);
    await preparar(page);
    await adquirir(page);
    if (causa === 'identidade') status = 503;
    else
      await page.evaluate(() => {
        window.locksOriginais = navigator.locks;
        Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
      });
    assert.equal((await page.evaluate(() => window.sessao.revalidar())).ok, false);
    assert.equal((await situacao(page)).estado, 'suspensa');
    assert.equal((await situacao(page)).modo, 'persistente');
    assert.equal((await page.evaluate(() => window.sessao.decidirTemporario(true))).ok, false);
    assert.equal((await adquirir(page)).ok, false);
    if (causa === 'locks')
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'locks', {
          configurable: true,
          value: window.locksOriginais,
        })
      );
    assert.equal((await locks(page)).held.length, 0);
  });
}

test('Chromium: falha de request não autoriza temporário nem fabrica exclusividade', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request() {
          throw new Error('Fixture');
        },
      },
    })
  );
  const r = await adquirir(page);
  assert.equal(r.codigo, 'LOCK_FALHOU');
  assert.equal(r.situacao.estado, 'pronta');
  assert.equal(r.situacao.atividade, null);
  assert.equal((await page.evaluate(() => window.sessao.decidirTemporario(true))).ok, false);
});

async function atrasarLock(page) {
  await page.evaluate(() => {
    const nativos = navigator.locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request(nome, opcoes, callback) {
          return new Promise((resolve, reject) => {
            window.chegarLock = () => nativos.request(nome, opcoes, callback).then(resolve, reject);
          });
        },
        query: () => nativos.query(),
      },
    });
  });
  await page.evaluate((id) => {
    window.aquisicao = window.sessao.adquirir(id);
  }, ID);
  await page.waitForFunction(() => typeof window.chegarLock === 'function');
}
test('Chromium: encerramento cancela aquisição; callback tardio não reabre nem retém lock', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await atrasarLock(page);
  await page.evaluate(() => window.sessao.encerrar());
  await page.evaluate(() => window.chegarLock());
  assert.equal((await page.evaluate(() => window.aquisicao)).codigo, 'OPERACAO_OBSOLETA');
  assert.equal((await situacao(page)).estado, 'encerrada');
  assert.equal((await locks(page)).held.length, 0);
});

test('Chromium: pedido que não responde expira e callback posterior não retém lock', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await atrasarLock(page);
  assert.equal((await page.evaluate(() => window.aquisicao)).codigo, 'LOCK_TIMEOUT');
  await page.evaluate(() => window.chegarLock());
  assert.equal((await locks(page)).held.length, 0);
  assert.equal((await situacao(page)).estado, 'pronta');
});

test('Chromium: liberação repetida cancela aquisição pendente sem reativação', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await atrasarLock(page);
  await page.evaluate(async () => {
    const a = window.sessao.liberar(),
      b = window.sessao.liberar();
    if (a !== b) throw new Error('Não idempotente');
    await a;
  });
  await page.evaluate(() => window.chegarLock());
  assert.equal((await page.evaluate(() => window.aquisicao)).ok, false);
  assert.equal((await locks(page)).held.length, 0);
  assert.equal((await situacao(page)).estado, 'pronta');
});

test('Chromium: repositório preparado tardiamente é fechado se a sessão já encerrou', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(() => {
    const nativo = window.LabRepositorio;
    window.fechamentos = 0;
    window.LabRepositorio = {
      async abrirRepositorio() {
        const banco = await nativo.abrirRepositorio();
        const repo = banco.repositorio;
        return new Promise((resolve) => {
          window.chegarBanco = () =>
            resolve({
              ...banco,
              repositorio: {
                ...repo,
                fechar() {
                  ++window.fechamentos;
                  repo.fechar();
                },
              },
            });
        });
      },
    };
  });
  await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js/lab-coordenador.js') });
  await page.evaluate(() => {
    window.sessao = window.LabCoordenador.criarSessao();
    window.preparacao = window.sessao.preparar();
  });
  await page.waitForFunction(() => typeof window.chegarBanco === 'function');
  await page.evaluate(() => window.sessao.encerrar());
  await page.evaluate(() => window.chegarBanco());
  assert.equal((await page.evaluate(() => window.preparacao)).codigo, 'OPERACAO_OBSOLETA');
  assert.equal(await page.evaluate(() => window.fechamentos), 1);
  assert.equal((await situacao(page)).estado, 'encerrada');
});

test('Chromium: encerrar durante liberação não permite que callback restaure pronta', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await adquirir(page);
  const resultado = await page.evaluate(async () => {
    const liberando = window.sessao.liberar();
    const fechando = window.sessao.encerrar();
    await Promise.all([liberando, fechando]);
    return window.sessao.obterSituacao();
  });
  assert.equal(resultado.estado, 'encerrada');
  assert.equal(resultado.atividade, null);
  assert.equal((await locks(page)).held.length, 0);
});

test('Chromium: falha tardia da requisição suspende e libera a posse nativa', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await preparar(page);
  await page.evaluate(() => {
    const nativos = navigator.locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request(...args) {
          return new Promise((resolve, reject) => {
            window.perderLock = () => reject(new Error('Falha sintética tardia'));
            nativos.request(...args).then(resolve, reject);
          });
        },
        query: () => nativos.query(),
      },
    });
  });
  assert.equal((await adquirir(page)).ok, true);
  await page.evaluate(() => window.perderLock());
  await page.waitForFunction(
    async () =>
      window.sessao.obterSituacao().estado === 'suspensa' &&
      (await navigator.locks.query()).held.length === 0
  );
  assert.equal((await situacao(page)).motivo, 'LOCK_PERDIDO');
  assert.equal((await adquirir(page)).ok, false);
});

test('Chromium: coordenador persistente consulta sem emitir escritas no banco existente', async (t) => {
  const { page } = await contexto(t);
  await semear(page);
  await page.evaluate(() => {
    for (const nome of ['add', 'put', 'delete', 'clear']) {
      IDBObjectStore.prototype[nome] = () => {
        throw new Error('Coordenador não deve gravar');
      };
    }
  });
  assert.equal((await preparar(page)).ok, true);
  assert.equal((await adquirir(page)).ok, true);
  assert.equal((await page.evaluate(() => window.sessao.listar('alice'))).pacotes.length, 2);
  assert.equal((await page.evaluate(() => window.sessao.revalidar())).ok, true);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await locks(page)).held.length, 0);
});

for (const transicao of ['preparar', 'adquirir']) {
  test(`Chromium: encerramento na microtask após conferir identidade (${transicao}) é terminal`, async (t) => {
    const { page } = await contexto(t);
    await semear(page);
    await page.evaluate((alvo) => {
      const nativo = window.LabIdentidade;
      let chamadas = 0;
      window.LabIdentidade = {
        resolverIdentidade(...args) {
          ++chamadas;
          if (
            (alvo === 'preparar' && chamadas !== 2) ||
            (alvo === 'adquirir' && !window.cancelarRetorno)
          )
            return nativo.resolverIdentidade(...args);
          // A função conferir recebe o valor antes do encerramento; sua continuação
          // no chamador só executa depois. Nenhum timer/atraso arbitrário.
          return {
            then(resolve, reject) {
              nativo.resolverIdentidade(...args).then((valor) => {
                resolve(valor);
                queueMicrotask(() => {
                  void window.sessao.encerrar();
                });
              }, reject);
            },
          };
        },
      };
    }, transicao);
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js/lab-coordenador.js') });
    let r = await preparar(page);
    if (transicao === 'adquirir') {
      assert.equal(r.ok, true);
      await page.evaluate(() => {
        window.cancelarRetorno = true;
      });
      r = await adquirir(page);
    }
    assert.equal(r.codigo, 'OPERACAO_OBSOLETA');
    assert.equal((await situacao(page)).estado, 'encerrada');
    assert.equal((await locks(page)).held.length, 0);
  });
}
