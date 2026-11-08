/* global globalThis, window, navigator, localStorage, Storage */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { criarArmazenamento } = require('../../ambiente_interativo/js/lab-progresso.js');
const ROOT = path.resolve(__dirname, '../..');
const A = 'a'.repeat(64),
  B = 'b'.repeat(64),
  DIGEST = 'd'.repeat(64);
const ID = { perfil: 'alice', id: 'sintetico', versao: 1 };
const E1 = { questaoAtual: 0, respostas: { q1: ['Lua'] } };
const E2 = { questaoAtual: 0, respostas: { q1: ['Sol'] } };
function config(modo = 'persistente') {
  return {
    modo,
    sessao: 'principal',
    identidade: {
      copyId: modo === 'persistente' ? A : null,
      perfil: 'alice',
      materia: 'ciencias',
      id: 'sintetico',
      versao: 1,
      digest: DIGEST,
    },
    vigente: () => true,
    autorizar: async (acao) => acao(),
  };
}
function storageNode(t) {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const mapa = new Map();
  const store = { getItem: (k) => mapa.get(k) ?? null, setItem: (k, v) => mapa.set(k, v) };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: store });
  t.after(() => {
    if (anterior) Object.defineProperty(globalThis, 'localStorage', anterior);
    else delete globalThis.localStorage;
  });
  return { mapa, store };
}

test('Node: gerador aceita só identidade LAB rigorosa e sessão fechada', () => {
  const armazenamento = criarArmazenamento();
  const valido = armazenamento.abrir(config());
  assert.equal(valido.ok, true);
  assert.equal(
    valido.canal.chave,
    `revisoesEscolares.lab.v1.${A}.alice.ciencias.sintetico.v1.${DIGEST}.principal`
  );
  for (const alterar of [
    (c) => {
      c.identidade.copyId = '../vizinho';
    },
    (c) => {
      c.identidade.perfil = 'outro';
    },
    (c) => {
      c.identidade.id = 'com.ponto';
    },
    (c) => {
      c.identidade.versao = '1';
    },
    (c) => {
      c.identidade.digest = 'd';
    },
    (c) => {
      c.sessao = 'outra';
    },
    (c) => {
      c.chave = 'oficial';
    },
    (c) => {
      c.identidade.chave = 'oficial';
    },
    (c) => {
      c.identidade.materia = 'artes';
    },
    (c) => {
      c.autorizar = true;
    },
  ]) {
    const c = config();
    alterar(c);
    assert.equal(armazenamento.abrir(c).codigo, 'CONFIGURACAO_INVALIDA');
  }
  assert.equal(armazenamento.abrir(config('temporario')).canal.chave, null);
  armazenamento.encerrar();
  assert.equal(armazenamento.abrir(config()).codigo, 'ARMAZENAMENTO_ENCERRADO');
});

test('Node: escrita aceita não promete retenção e snapshots não compartilham referências', async (t) => {
  const { mapa } = storageNode(t);
  const a = criarArmazenamento();
  const { canal } = a.abrir(config());
  assert.equal((await canal.carregar()).durabilidade, 'ausente');
  const estado = structuredClone(E1);
  const r = await canal.salvar(estado);
  assert.equal(r.durabilidade, 'gravacao-aceita');
  assert.equal(r.aceitaPeloNavegador, true);
  estado.respostas.q1[0] = 'Não alterar';
  r.estado.respostas.q1[0] = 'Não alterar';
  assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E1);
  assert.deepEqual((await canal.carregar()).estado, E1);
  assert.equal(canal.obterDurabilidade().pendente, false);
});

test('Node: memória recente vence escrita falha; retry divergente não sobrescreve', async (t) => {
  const { mapa, store } = storageNode(t);
  const { canal } = criarArmazenamento().abrir(config());
  await canal.salvar(E1);
  const base = mapa.get(canal.chave);
  const original = store.setItem;
  store.setItem = () => {
    throw new Error('Escrita falhou');
  };
  assert.equal((await canal.salvar(E2)).codigo, 'ESCRITA_FALHOU');
  assert.deepEqual((await canal.carregar()).estado, E2);
  assert.equal(mapa.get(canal.chave), base);
  store.setItem = original;
  mapa.set(canal.chave, '{"respostas":{}}');
  assert.equal((await canal.tentarPersistir()).codigo, 'CONFLITO_PERSISTIDO');
  assert.equal(mapa.get(canal.chave), '{"respostas":{}}');
  assert.deepEqual((await canal.carregar()).estado, E2);
});

test('Node: retry explícito aceita só a base conhecida e não há retentativa automática', async (t) => {
  const { mapa, store } = storageNode(t);
  const { canal } = criarArmazenamento().abrir(config());
  await canal.salvar(E1);
  const original = store.setItem;
  let chamadas = 0;
  store.setItem = () => {
    ++chamadas;
    throw new Error('Falha');
  };
  await canal.salvar(E2);
  await canal.carregar();
  assert.equal(chamadas, 1);
  store.setItem = original;
  assert.equal((await canal.tentarPersistir()).aceitaPeloNavegador, true);
  assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E2);
});

test('Node: progresso preexistente desconhecido exige carregamento, sem adoção para sobrescrita', async (t) => {
  const { mapa } = storageNode(t);
  const a = criarArmazenamento();
  const { canal } = a.abrir(config());
  mapa.set(canal.chave, JSON.stringify(E1));
  assert.equal((await canal.salvar(E2)).codigo, 'CONFLITO_PERSISTIDO');
  assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E1);
  const novo = criarArmazenamento().abrir(config()).canal;
  assert.equal((await novo.carregar()).durabilidade, 'persistido-lido');
  assert.equal((await novo.salvar(E2)).ok, true);
});

test('Node: temporário não acessa localStorage e encerramento elimina referências', async (t) => {
  storageNode(t);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Não acessar');
    },
  });
  const a = criarArmazenamento();
  const { canal } = a.abrir(config('temporario'));
  assert.equal((await canal.salvar(E1)).durabilidade, 'memoria');
  assert.deepEqual((await canal.carregar()).estado, E1);
  a.encerrar();
  a.encerrar();
  assert.equal((await canal.carregar()).estado, null);
  assert.equal((await canal.salvar(E2)).codigo, 'ARMAZENAMENTO_ENCERRADO');
});

test('Node: transporte opaco não executa getters/toJSON nem interpreta pontos', async (t) => {
  storageNode(t);
  const { canal } = criarArmazenamento().abrir(config());
  await canal.salvar(E1);
  for (const estado of [
    {
      get respostas() {
        throw new Error('Não executar');
      },
    },
    {
      toJSON() {
        throw new Error('Não executar');
      },
    },
    { numero: Infinity },
    { fn() {} },
    { array: Array(10001) },
  ]) {
    assert.equal((await canal.salvar(estado)).codigo, 'ESTADO_INVALIDO');
  }
  assert.deepEqual((await canal.carregar()).estado, E1);
});

test('Node: callback autorizado tardio após encerramento não grava', async (t) => {
  const { mapa } = storageNode(t);
  let chegar;
  const c = config();
  c.autorizar = (acao) =>
    new Promise((resolve) => {
      chegar = () => resolve(acao());
    });
  const a = criarArmazenamento();
  const { canal } = a.abrir(c);
  const p = canal.salvar(E1);
  a.encerrar();
  chegar();
  const r = await p;
  assert.equal(r.estado, null);
  assert.equal(r.durabilidade, 'encerrado');
  assert.equal(mapa.size, 0);
});

test('Node: limites e propriedades não JSON recusam snapshot sem perder o anterior', async (t) => {
  storageNode(t);
  const { canal } = criarArmazenamento().abrir(config());
  await canal.salvar(E1);
  const ciclo = {};
  ciclo.retorno = ciclo;
  const profundo = {};
  let ponteiro = profundo;
  for (let n = 0; n < 17; n++) {
    ponteiro.filho = {};
    ponteiro = ponteiro.filho;
  }
  const oculto = {};
  Object.defineProperty(oculto, 'resposta', {
    get() {
      throw new Error('Não executar');
    },
  });
  const simbolo = { [Symbol('nao-json')]: 'valor' };
  for (const estado of [ciclo, profundo, oculto, simbolo, { resposta: 'x'.repeat(262145) }]) {
    assert.equal((await canal.salvar(estado)).codigo, 'ESTADO_INVALIDO');
    assert.deepEqual((await canal.carregar()).estado, E1);
  }
});

test('Node: aceitação ocorrida antes do encerramento não é anunciada como falha de escrita', async (t) => {
  const { mapa } = storageNode(t);
  const a = criarArmazenamento();
  const c = config();
  c.autorizar = async (acao) => {
    acao();
    a.encerrar();
    return { ok: false, codigo: 'OPERACAO_OBSOLETA' };
  };
  const { canal } = a.abrir(c);
  const r = await canal.salvar(E1);
  assert.equal(r.durabilidade, 'encerrado');
  assert.equal(r.estado, null);
  assert.equal(r.aceitaPeloNavegador, true);
  assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E1);
});

for (const primeira of ['gravacao', 'leitura']) {
  test(`Node: snapshot novo durante ${primeira} pendente prevalece sem escrita automática`, async (t) => {
    const { mapa } = storageNode(t);
    const a = criarArmazenamento();
    const c = config();
    let chegar,
      atrasar = true;
    c.autorizar = (acao) =>
      atrasar
        ? new Promise((resolve) => {
            chegar = () => resolve(acao());
          })
        : Promise.resolve(acao());
    const { canal } = a.abrir(c);
    if (primeira === 'leitura') mapa.set(canal.chave, JSON.stringify(E1));
    const pendente = primeira === 'leitura' ? canal.carregar() : canal.salvar(E1);
    const recente = await canal.salvar(E2);
    assert.deepEqual(recente.estado, E2);
    assert.equal(recente.codigo, 'OPERACAO_EM_ANDAMENTO');
    chegar();
    assert.deepEqual((await pendente).estado, E2);
    assert.deepEqual((await canal.carregar()).estado, E2);
    atrasar = false;
    const r = await canal.tentarPersistir();
    if (primeira === 'leitura') {
      assert.equal(r.codigo, 'CONFLITO_PERSISTIDO');
      assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E1);
    } else {
      assert.equal(r.aceitaPeloNavegador, true);
      assert.deepEqual(JSON.parse(mapa.get(canal.chave)), E2);
    }
  });
}

let browser, server, origem, copyId, status;
before(async () => {
  copyId = A;
  status = 200;
  server = http.createServer((req, res) => {
    if (req.url === '/__revisoes_local__/identity') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId }));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<!doctype html><title>Fixture durabilidade</title>');
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
function pacote(id = 'sintetico', perfil = 'alice', versao = 1) {
  return JSON.stringify({
    formato: 'lab-questionarios-v1',
    id,
    versao,
    perfil,
    materia: 'ciencias',
    titulo: 'Fixture',
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
async function carregar(page) {
  await page.goto(origem);
  for (const nome of [
    'lab-validador.js',
    'lab-identidade.js',
    'lab-repositorio.js',
    'lab-progresso.js',
    'lab-coordenador.js',
  ])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', nome) });
}
async function preparar(page, pacotes = [pacote()]) {
  await page.evaluate(async (dados) => {
    const banco = await window.LabRepositorio.abrirRepositorio();
    try {
      for (const p of dados) {
        const r = await banco.repositorio.cadastrar(p);
        if (!r.ok) throw new Error(r.codigo);
      }
    } finally {
      banco.repositorio.fechar();
    }
    window.sessao = window.LabCoordenador.criarSessao();
    const r = await window.sessao.preparar();
    if (!r.ok) throw new Error(r.codigo);
  }, pacotes);
}
async function contexto(t) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  await preparar(page);
  return { ctx, page };
}
async function abrir(page, sessao = 'principal', id = ID, nome = 'canal') {
  return page.evaluate(
    async ({ sessao, id, nome }) => {
      if (window.sessao.obterSituacao().estado !== 'ativa') {
        const r = await window.sessao.adquirir(id);
        if (!r.ok) return r;
      }
      const r = window.sessao.abrirProgresso(sessao);
      if (r.ok) window[nome] = r.canal;
      return { ok: r.ok, codigo: r.codigo, chave: r.canal?.chave };
    },
    { sessao, id, nome }
  );
}
const salvar = (page, estado, nome = 'canal') =>
  page.evaluate(({ estado, nome }) => window[nome].salvar(estado), { estado, nome });
const ler = (page, nome = 'canal') => page.evaluate((nome) => window[nome].carregar(), nome);
const raw = (page, chave) => page.evaluate((k) => localStorage.getItem(k), chave);

test('Chromium: gravação aceita por armazenamento real e leitura após nova sessão', async (t) => {
  const { page } = await contexto(t);
  const r = await abrir(page);
  assert.equal(r.ok, true);
  assert.equal((await ler(page)).durabilidade, 'ausente');
  const gravacao = await salvar(page, E1);
  assert.equal(gravacao.aceitaPeloNavegador, true);
  assert.deepEqual(JSON.parse(await raw(page, r.chave)), E1);
  await page.evaluate(() => window.sessao.encerrar());
  await preparar(page);
  await abrir(page);
  assert.deepEqual((await ler(page)).estado, E1);
});

for (const [etapa, tipo, codigo] of [
  ['leitura', 'Error', 'LEITURA_FALHOU'],
  ['escrita', 'Error', 'ESCRITA_FALHOU'],
  ['escrita', 'QuotaExceededError', 'QUOTA_EXCEDIDA'],
  ['escrita', 'SecurityError', 'ACESSO_BLOQUEADO'],
]) {
  test(`Chromium: falha ${etapa}/${tipo} mantém snapshot em memória`, async (t) => {
    const { page } = await contexto(t);
    await abrir(page);
    await ler(page);
    await page.evaluate(
      ({ etapa, tipo }) => {
        const metodo = etapa === 'leitura' ? 'getItem' : 'setItem';
        Storage.prototype[metodo] = () => {
          throw new window.DOMException('Fixture', tipo);
        };
      },
      { etapa, tipo }
    );
    const r = await salvar(page, E2);
    assert.equal(r.codigo, codigo);
    assert.equal(r.aceitaPeloNavegador, false);
    assert.deepEqual(r.estado, E2);
    assert.deepEqual((await ler(page)).estado, E2);
    assert.equal((await page.evaluate(() => window.sessao.obterSituacao())).modo, 'persistente');
  });
}

for (const tipo of ['ausente', 'bloqueado']) {
  test(`Chromium: acesso ${tipo} ao storage é distinto de escrita falha`, async (t) => {
    const { page } = await contexto(t);
    await abrir(page);
    await page.evaluate(
      (tipo) =>
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          ...(tipo === 'ausente'
            ? { value: undefined }
            : {
                get() {
                  throw new window.DOMException('Fixture', 'SecurityError');
                },
              }),
        }),
      tipo
    );
    const r = await salvar(page, E1);
    assert.equal(r.etapa, 'acesso');
    assert.equal(r.codigo, tipo === 'ausente' ? 'ARMAZENAMENTO_INDISPONIVEL' : 'ACESSO_BLOQUEADO');
    assert.deepEqual(r.estado, E1);
  });
}

test('Chromium: memória nova e base divergente sobrevivem a liberar/reabrir atividade', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await salvar(page, E1);
  await page.evaluate(() => {
    window.setOriginal = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('Fixture');
    };
  });
  assert.equal((await salvar(page, E2)).codigo, 'ESCRITA_FALHOU');
  await page.evaluate(() => {
    Storage.prototype.setItem = window.setOriginal;
  });
  await page.evaluate((k) => localStorage.setItem(k, '{"respostas":{}}'), chave);
  await page.evaluate(() => window.sessao.liberar());
  await abrir(page, 'principal', ID, 'novoCanal');
  assert.equal((await salvar(page, E1)).codigo, 'CANAL_INATIVO');
  assert.deepEqual((await ler(page, 'novoCanal')).estado, E2);
  assert.equal(
    (await page.evaluate(() => window.novoCanal.tentarPersistir())).codigo,
    'CONFLITO_PERSISTIDO'
  );
  assert.equal(await raw(page, chave), '{"respostas":{}}');
});

test('Chromium: dados persistidos corrompidos não são reparados nem sobrescritos', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await page.evaluate((k) => localStorage.setItem(k, '{invalido'), chave);
  assert.equal((await ler(page)).codigo, 'DADOS_PERSISTIDOS_INVALIDOS');
  assert.equal((await salvar(page, E1)).codigo, 'CONFLITO_PERSISTIDO');
  assert.equal(await raw(page, chave), '{invalido');
});

test('Chromium: identidade é checada entre gravações e falha não vira temporário', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await salvar(page, E1);
  copyId = B;
  const r = await salvar(page, E2);
  assert.equal(r.codigo, 'IDENTIDADE_ALTERADA');
  assert.equal(r.aceitaPeloNavegador, false);
  assert.deepEqual(r.estado, E2);
  assert.deepEqual(JSON.parse(await raw(page, chave)), E1);
  assert.deepEqual((await ler(page)).estado, E2);
  assert.equal((await page.evaluate(() => window.sessao.obterSituacao())).estado, 'suspensa');
});

test('Chromium: exclusividade não confirmada bloqueia escrita e libera posse', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await salvar(page, E1);
  await page.evaluate(() => {
    const locks = navigator.locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: locks.request.bind(locks),
        query: async () => ({ held: [], pending: [] }),
      },
    });
  });
  const r = await salvar(page, E2);
  assert.equal(r.codigo, 'EXCLUSIVIDADE_PERDIDA');
  assert.deepEqual(JSON.parse(await raw(page, chave)), E1);
  assert.equal((await page.evaluate(() => window.sessao.obterSituacao())).estado, 'suspensa');
});

test('Chromium: encerramento durante identidade pendente impede callback de gravar', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await page.evaluate((e) => {
    window.gravacaoPendente = window.canal.salvar(e);
  }, E1);
  const req = await aguardando;
  await page.evaluate(() => window.sessao.encerrar());
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const r = await page.evaluate(() => window.gravacaoPendente);
  assert.equal(r.durabilidade, 'encerrado');
  assert.equal(r.estado, null);
  assert.equal(await raw(page, chave), null);
  assert.equal((await salvar(page, E2)).codigo, 'ARMAZENAMENTO_ENCERRADO');
});

test('Chromium: modo temporário com consentimento não toca storage e não herda progresso', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await salvar(page, E1);
  await page.evaluate(() => window.sessao.encerrar());
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Não acessar');
      },
    });
    window.sessao = window.LabCoordenador.criarSessao();
  });
  assert.equal(
    (await page.evaluate(() => window.sessao.preparar())).codigo,
    'CONSENTIMENTO_NECESSARIO'
  );
  assert.equal((await page.evaluate(() => window.sessao.abrirProgresso('principal'))).ok, false);
  await page.evaluate(() => window.sessao.decidirTemporario(true));
  await page.evaluate((p) => window.sessao.carregarTemporario(p), pacote());
  assert.equal((await abrir(page)).chave, null);
  assert.equal((await ler(page)).estado, null);
  assert.equal((await salvar(page, E2)).durabilidade, 'memoria');
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await ler(page)).estado, null);
  // Usar uma segunda aba da mesma origem para observar somente a sentinela persistida.
  const outra = await page.context().newPage();
  await outra.goto(origem);
  assert.deepEqual(JSON.parse(await raw(outra, chave)), E1);
});

test('Chromium: perfis, sessões, pacotes, versões, cópias e chaves oficiais isolados', async (t) => {
  const { ctx, page } = await contexto(t);
  await preparar(page, [
    pacote(),
    pacote('sintetico', 'mariana'),
    pacote('sintetico', 'alice', 2),
    pacote('outro'),
  ]);
  await page.evaluate(() => {
    localStorage.setItem('revisoesEscolares.alice.gramatica.oficial.v1', 'preservar');
    localStorage.setItem('lab-vizinho', 'preservar');
  });
  const keys = [];
  for (const [id, sessao] of [
    [ID, 'principal'],
    [ID, 'responsavel'],
    [{ ...ID, perfil: 'mariana' }, 'principal'],
    [{ ...ID, versao: 2 }, 'principal'],
    [{ ...ID, id: 'outro' }, 'principal'],
  ]) {
    await page.evaluate(() => window.sessao.liberar());
    const r = await abrir(page, sessao, id);
    keys.push(r.chave);
    assert.equal((await salvar(page, E1)).aceitaPeloNavegador, true);
  }
  copyId = B;
  const outra = await ctx.newPage();
  await carregar(outra);
  await preparar(outra);
  keys.push((await abrir(outra)).chave);
  await salvar(outra, E2);
  assert.equal(new Set(keys).size, 6);
  for (let n = 0; n < keys.length; n++)
    assert.deepEqual(JSON.parse(await raw(outra, keys[n])), n === 5 ? E2 : E1);
  assert.equal(await raw(outra, 'revisoesEscolares.alice.gramatica.oficial.v1'), 'preservar');
  assert.equal(await raw(outra, 'lab-vizinho'), 'preservar');
  assert.equal(
    (await page.evaluate(() => window.sessao.abrirProgresso({ chave: 'oficial' }))).codigo,
    'SESSAO_INVALIDA'
  );
});

test('Chromium: repetir abertura/encerramento não duplica listeners, canais ou escritas', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(() => window.sessao.encerrar());
  await page.evaluate(() => {
    const add = window.addEventListener,
      remove = window.removeEventListener,
      set = Storage.prototype.setItem;
    window.contagens = { add: 0, remove: 0, set: 0 };
    window.addEventListener = function (nome, ...args) {
      if (nome === 'pagehide') ++window.contagens.add;
      return add.call(this, nome, ...args);
    };
    window.removeEventListener = function (nome, ...args) {
      if (nome === 'pagehide') ++window.contagens.remove;
      return remove.call(this, nome, ...args);
    };
    Storage.prototype.setItem = function (...args) {
      ++window.contagens.set;
      return set.apply(this, args);
    };
  });
  for (let n = 0; n < 3; n++) {
    await preparar(page);
    await abrir(page);
    assert.equal(
      await page.evaluate(() => window.sessao.abrirProgresso('principal').canal === window.canal),
      true
    );
    await ler(page);
    await salvar(page, E1);
    await page.evaluate(() => Promise.all([window.sessao.encerrar(), window.sessao.encerrar()]));
    assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 0);
  }
  assert.deepEqual(await page.evaluate(() => window.contagens), { add: 3, remove: 3, set: 3 });
});

test('Chromium: API legada continua síncrona e seu progresso fica separado do LAB', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js/armazenamento.js') });
  const antes = await page.evaluate((estado) => {
    window.legado = window.ArmazenamentoRevisoes.criar({
      chave: 'revisoesEscolares.alice.gramatica.fixture-preservada.v1',
      padrao: { respostas: {} },
    });
    const salvo = window.legado.salvar(estado);
    return {
      salvo,
      sincrono: !(salvo instanceof Promise),
      lido: window.legado.carregar(),
      retornoJSON: window.ArmazenamentoRevisoes.salvarJSON('fixture-legada-vizinha', {
        marcador: true,
      }),
    };
  }, E1);
  assert.equal(antes.sincrono, true);
  assert.deepEqual(antes.salvo, E1);
  assert.deepEqual(antes.lido, E1);
  assert.equal(antes.retornoJSON, true);
  await salvar(page, E2);
  assert.deepEqual(await page.evaluate(() => window.legado.carregar()), E1);
  assert.deepEqual(
    await page.evaluate(() => window.ArmazenamentoRevisoes.lerJSON('fixture-legada-vizinha', {})),
    { marcador: true }
  );
});

test('Chromium: rejeição tardia de query após encerrar não muda o estado terminal', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  await page.evaluate(() => {
    const locks = navigator.locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: locks.request.bind(locks),
        query: () =>
          new Promise((_resolve, reject) => {
            window.rejeitarQuery = () => reject(new Error('Fixture tardia'));
          }),
      },
    });
  });
  await page.evaluate((e) => {
    window.salvamentoTardio = window.canal.salvar(e);
  }, E1);
  await page.waitForFunction(() => typeof window.rejeitarQuery === 'function');
  await page.evaluate(() => window.sessao.encerrar());
  await page.evaluate(() => window.rejeitarQuery());
  const r = await page.evaluate(() => window.salvamentoTardio);
  assert.equal(r.estado, null);
  assert.equal(await raw(page, chave), null);
  assert.equal((await page.evaluate(() => window.sessao.obterSituacao())).estado, 'encerrada');
});

test('Chromium: duas respostas rápidas preservam a mais recente durante autorização HTTP', async (t) => {
  const { page } = await contexto(t);
  const { chave } = await abrir(page);
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await page.evaluate((e) => {
    window.primeiraGravacao = window.canal.salvar(e);
  }, E1);
  const req = await aguardando;
  const nova = await salvar(page, E2);
  assert.deepEqual(nova.estado, E2);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const primeira = await page.evaluate(() => window.primeiraGravacao);
  assert.deepEqual(primeira.estado, E2);
  assert.equal(primeira.codigo, 'ESTADO_SUBSTITUIDO');
  assert.equal(await raw(page, chave), null);
  await page.unrouteAll();
  assert.equal(
    (await page.evaluate(() => window.canal.tentarPersistir())).aceitaPeloNavegador,
    true
  );
  assert.deepEqual(JSON.parse(await raw(page, chave)), E2);
});
