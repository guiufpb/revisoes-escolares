/* global globalThis, window, indexedDB, IDBDatabase, IDBObjectStore, IDBFactory, DOMException, localStorage */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '../..');
const A = 'a'.repeat(64);
const B = 'b'.repeat(64);
let server, browser, origem;
let resposta;
let pedidos;
const scripts = ['lab-validador.js', 'lab-identidade.js', 'lab-repositorio.js'];
function pacote(id = 'sintetico', perfil = 'alice') {
  return JSON.stringify({
    formato: 'lab-questionarios-v1',
    id,
    versao: 1,
    perfil,
    materia: 'ciencias',
    titulo: 'Sintético',
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
function reset() {
  resposta = {
    status: 200,
    texto: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  };
  pedidos = [];
}
before(async () => {
  reset();
  server = http.createServer((req, res) => {
    pedidos.push({ url: req.url, cache: req.headers['cache-control'] });
    if (req.url === '/__revisoes_local__/identity') {
      if (resposta.pendente) return;
      res.writeHead(resposta.status, resposta.headers || { 'Content-Type': 'application/json' });
      res.end(resposta.texto);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<!doctype html><title>Fixture LAB</title>');
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
async function pagina(t) {
  reset();
  const context = await browser.newContext();
  t.after(() => context.close());
  const page = await context.newPage();
  await carregar(page);
  return page;
}
async function abrir(page) {
  return page.evaluate(async () => {
    window.abertura = await window.LabRepositorio.abrirRepositorio();
    window.repo = window.abertura.repositorio;
    return { ...window.abertura, repositorio: Boolean(window.repo) };
  });
}
const cadastrar = (page, texto = pacote()) => page.evaluate((s) => window.repo.cadastrar(s), texto);
const consultar = (page, id = 'sintetico', perfil = 'alice') =>
  page.evaluate((x) => window.repo.consultar(x), { perfil, id, versao: 1 });
const listar = (page, perfil = 'alice') => page.evaluate((x) => window.repo.listar(x), perfil);

test('identidade válida é relativa, local e sem cache; stores têm escopo exclusivo', async (t) => {
  const page = await pagina(t);
  const r = await abrir(page);
  assert.equal(r.ok, true);
  assert.equal(r.copyId, A);
  assert.equal(r.origem, origem);
  assert.equal(r.modo, 'persistente');
  assert.deepEqual(
    await page.evaluate(async () => (await indexedDB.databases()).map((d) => d.name)),
    [`revisoesEscolares.lab.${A}.v1`]
  );
  const consulta = pedidos.find((p) => p.url === '/__revisoes_local__/identity');
  assert.ok(consulta);
  assert.match(consulta.cache, /no-cache|no-store/);
  assert.deepEqual(await listar(page), { ok: true, pacotes: [] });
});

for (const [nome, mudar, codigo] of [
  [
    'ausente',
    () => {
      resposta.status = 404;
    },
    'IDENTIDADE_INDISPONIVEL',
  ],
  [
    'JSON inválido',
    () => {
      resposta.texto = '{';
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'aplicação errada',
    () => {
      resposta.texto = JSON.stringify({ application: 'outra', schema: 1, copyId: A });
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'schema errado',
    () => {
      resposta.texto = JSON.stringify({
        application: 'revisoes-escolares',
        schema: '1',
        copyId: A,
      });
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'copyId inválido',
    () => {
      resposta.texto = JSON.stringify({
        application: 'revisoes-escolares',
        schema: 1,
        copyId: '../oficial',
      });
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'propriedade desconhecida',
    () => {
      resposta.texto = JSON.stringify({
        application: 'revisoes-escolares',
        schema: 1,
        copyId: A,
        extra: true,
      });
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'resposta excessiva',
    () => {
      resposta.texto = ' '.repeat(4097);
    },
    'IDENTIDADE_INVALIDA',
  ],
  [
    'redirecionamento recusado',
    () => {
      resposta.status = 302;
      resposta.headers = { Location: 'https://example.invalid/' };
    },
    'IDENTIDADE_INDISPONIVEL',
  ],
  [
    'timeout',
    () => {
      resposta.pendente = true;
    },
    'IDENTIDADE_TIMEOUT',
  ],
]) {
  test(`identidade ${nome}: temporário sem criar banco`, async (t) => {
    const page = await pagina(t);
    mudar();
    const r = await page.evaluate(() => window.LabIdentidade.resolverIdentidade());
    assert.equal(r.modo, 'temporario');
    assert.equal(r.copyId, null);
    assert.equal(r.codigo, codigo);
    assert.deepEqual(await page.evaluate(() => indexedDB.databases()), []);
  });
}

test('file:// e origem externa não fazem requisição de identidade', async (t) => {
  const page = await pagina(t);
  for (const url of ['file:///fixture.html', 'https://example.invalid/']) {
    // Contrato do componente em ambientes sem servidor suportado; não navegar externamente.
    const { resolverIdentidade } = require('../../ambiente_interativo/js/lab-identidade.js');
    const anterior = Object.getOwnPropertyDescriptor(globalThis, 'location');
    try {
      Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: url } });
      assert.equal((await resolverIdentidade()).codigo, 'ORIGEM_NAO_SUPORTADA');
    } finally {
      if (anterior) Object.defineProperty(globalThis, 'location', anterior);
      else delete globalThis.location;
    }
  }
  assert.equal(
    await page.evaluate(() => typeof window.LabIdentidade.resolverIdentidade),
    'function'
  );
});

test('cadastro e reimportação idempotente preservam conteúdo/metadados até oncomplete', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const tx = original.apply(this, args);
      if (args[1] === 'readwrite')
        tx.addEventListener('complete', () => {
          window.commitConfirmado = true;
        });
      return tx;
    };
  });
  const r = await cadastrar(page);
  assert.equal(r.ok, true);
  assert.equal(r.criado, true);
  assert.equal(await page.evaluate(() => window.commitConfirmado), true);
  const anterior = await consultar(page);
  const repetido = await cadastrar(page, JSON.stringify(JSON.parse(pacote()), null, 2));
  assert.equal(repetido.ok, true);
  assert.equal(repetido.criado, false);
  assert.deepEqual(await consultar(page), anterior);
  assert.equal((await listar(page)).pacotes.length, 1);
});

test('recusa objeto fingindo validação e ID/versão com conteúdo divergente', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page);
  const antes = await consultar(page);
  const p = JSON.parse(pacote());
  p.titulo = 'Conteúdo diferente';
  assert.equal((await cadastrar(page, JSON.stringify(p))).codigo, 'CONFLITO_DIGEST');
  assert.equal(
    (await page.evaluate(() => window.repo.cadastrar({ valido: true, digest: 'falso' }))).codigo,
    'PACOTE_INVALIDO'
  );
  assert.deepEqual(await consultar(page), antes);
});

test('perfis, versões e registros vizinhos são independentes', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await page.evaluate(() => localStorage.setItem('oficial.fixture', 'preservar'));
  for (const p of [pacote(), pacote('vizinho'), pacote('sintetico', 'mariana')])
    assert.equal((await cadastrar(page, p)).ok, true);
  const novo = JSON.parse(pacote());
  novo.versao = 2;
  assert.equal((await cadastrar(page, JSON.stringify(novo))).ok, true);
  assert.equal((await listar(page)).pacotes.length, 3);
  assert.equal((await listar(page, 'mariana')).pacotes.length, 1);
  assert.equal((await listar(page, '../oficial')).codigo, 'PERFIL_INVALIDO');
  assert.equal((await consultar(page, 'ausente')).pacote, null);
  assert.equal(await page.evaluate(() => localStorage.getItem('oficial.fixture')), 'preservar');
  assert.equal(
    (
      await page.evaluate(() =>
        window.repo.consultar({ perfil: 'alice', id: 'sintetico', versao: 1, banco: 'oficial' })
      )
    ).codigo,
    'IDENTIFICADOR_INVALIDO'
  );
});

test('duas cópias na mesma origem: alteração suspende handle e não adota outro banco', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page);
  resposta.texto = JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: B });
  assert.equal((await listar(page)).codigo, 'IDENTIDADE_ALTERADA');
  assert.equal((await cadastrar(page)).codigo, 'REPOSITORIO_FECHADO');
  await abrir(page);
  assert.equal((await listar(page)).pacotes.length, 0);
  await cadastrar(page, pacote('copia-b'));
  resposta.texto = JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A });
  await page.evaluate(() => window.repo.fechar());
  await abrir(page);
  assert.equal((await listar(page)).pacotes[0].pacote.id, 'sintetico');
});

test('falha de comunicação durante a sessão suspende sem gravar e exige nova abertura', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page);
  resposta.status = 503;
  assert.equal((await cadastrar(page, pacote('nao-gravar'))).codigo, 'IDENTIDADE_INDISPONIVEL');
  reset();
  await abrir(page);
  assert.equal((await listar(page)).pacotes.length, 1);
});

test('abort real entre gravações desfaz pacote e administração sem tocar no vizinho', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page, pacote('vizinho'));
  const antes = await consultar(page, 'vizinho');
  await page.evaluate(() => {
    window.addOriginal = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (valor, ...args) {
      const pedido = window.addOriginal.call(this, valor, ...args);
      if (this.name === 'administracao') this.transaction.abort();
      return pedido;
    };
  });
  const r = await cadastrar(page);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'TRANSACAO_FALHOU');
  await page.evaluate(() => {
    IDBObjectStore.prototype.add = window.addOriginal;
  });
  assert.equal((await consultar(page)).pacote, null);
  assert.deepEqual(await consultar(page, 'vizinho'), antes);
  assert.equal((await listar(page)).pacotes.length, 1);
});

test('quota é comunicada e nenhum dado anterior é apagado', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page, pacote('vizinho'));
  await page.evaluate(() => {
    window.txOriginal = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (args[1] === 'readwrite') throw new DOMException('fixture', 'QuotaExceededError');
      return window.txOriginal.apply(this, args);
    };
  });
  assert.equal((await cadastrar(page)).codigo, 'ARMAZENAMENTO_QUOTA');
  await page.evaluate(() => {
    IDBDatabase.prototype.transaction = window.txOriginal;
  });
  assert.equal((await listar(page)).pacotes[0].pacote.id, 'vizinho');
});

async function adulterar(page, modo) {
  await page.evaluate(
    async ({ copy, modo }) => {
      await new Promise((resolve, reject) => {
        const req = indexedDB.open('revisoesEscolares.lab.' + copy + '.v1', 1);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(['pacotes', 'administracao'], 'readwrite');
          const store = tx.objectStore(modo === 'metadado' ? 'administracao' : 'pacotes');
          const r = store.get(['alice', 'sintetico', 1]);
          r.onsuccess = () => {
            const v = r.result;
            if (modo === 'digest') v.digest = '0'.repeat(64);
            if (modo === 'conteudo') v.conteudo = '{}';
            if (modo === 'json-valido') v.conteudo = v.conteudo.replace('Sintético', 'Adulterado');
            if (modo === 'metadado') v.digest = '0'.repeat(64);
            if (modo === 'orfao') tx.objectStore('administracao').delete(['alice', 'sintetico', 1]);
            else store.put(v);
          };
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onabort = () => {
            db.close();
            reject(tx.error);
          };
        };
      });
    },
    { copy: A, modo }
  );
}
for (const modo of ['digest', 'conteudo', 'json-valido', 'metadado', 'orfao']) {
  test(`dados adulterados (${modo}) são recusados na leitura/listagem e não sobrescritos`, async (t) => {
    const page = await pagina(t);
    await abrir(page);
    await cadastrar(page);
    await cadastrar(page, pacote('vizinho'));
    const antes = await consultar(page, 'vizinho');
    await adulterar(page, modo);
    assert.equal((await consultar(page)).codigo, 'DADOS_INVALIDOS');
    assert.equal((await listar(page)).codigo, 'DADOS_INVALIDOS');
    assert.equal((await cadastrar(page)).codigo, 'DADOS_INVALIDOS');
    assert.deepEqual(await consultar(page, 'vizinho'), antes);
  });
}

test('IndexedDB ausente ou bloqueado não inventa persistência', async (t) => {
  const page = await pagina(t);
  await page.evaluate(() =>
    Object.defineProperty(window, 'indexedDB', { configurable: true, value: undefined })
  );
  const r = await abrir(page);
  assert.equal(r.ok, false);
  assert.equal(r.modo, 'temporario');
  assert.equal(r.motivo, 'INDEXEDDB_INDISPONIVEL');
});

for (const tipo of ['versao', 'estrutura', 'bloqueio']) {
  test(`banco preexistente com ${tipo} incompatível é preservado`, async (t) => {
    const page = await pagina(t);
    await page.evaluate(
      async ({ copy, tipo }) => {
        window.legado = await new Promise((resolve, reject) => {
          const req = indexedDB.open(
            'revisoesEscolares.lab.' + copy + '.v1',
            tipo === 'bloqueio' ? undefined : tipo === 'versao' ? 2 : 1
          );
          req.onupgradeneeded = () => {
            req.result.createObjectStore('vizinho');
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        if (tipo !== 'bloqueio') window.legado.close();
        else {
          // Banco real em versão superior mantém uma conexão que bloqueia upgrade de fixture
          // sem substituir as APIs usadas na implementação em produção.
          const open = indexedDB.open.bind(indexedDB);
          indexedDB.open = (nome) => open(nome, 2);
        }
      },
      { copy: A, tipo }
    );
    const r = await abrir(page);
    assert.equal(r.ok, false);
    assert.equal(r.codigo, tipo === 'bloqueio' ? 'BANCO_BLOQUEADO' : 'VERSAO_INCOMPATIVEL');
    await page.evaluate(() => window.legado.close());
    const stores = await page.evaluate(async (copy) => {
      const req = IDBFactory.prototype.open.call(
        indexedDB,
        'revisoesEscolares.lab.' + copy + '.v1'
      );
      return new Promise((resolve) => {
        req.onsuccess = () => {
          const r = Array.from(req.result.objectStoreNames);
          req.result.close();
          resolve(r);
        };
      });
    }, A);
    assert.deepEqual(stores, ['vizinho']);
  });
}

test('persistência real após fechar e reabrir contexto e processo do navegador', async () => {
  reset();
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-idb-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    await abrir(page);
    await cadastrar(page);
    const antes = await consultar(page);
    await ctx.close();
    ctx = await chromium.launchPersistentContext(perfil, { headless: true });
    page = await ctx.newPage();
    await carregar(page);
    await abrir(page);
    assert.deepEqual(await consultar(page), antes);
    assert.equal((await cadastrar(page)).criado, false);
    assert.equal((await listar(page)).pacotes.length, 1);
  } finally {
    await ctx.close();
  }
  // Perfil sintético preservado em tmp; sem limpeza de evidências.
});

test('troca de identidade entre preflight e gravação impede cadastro', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  let consultas = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        application: 'revisoes-escolares',
        schema: 1,
        copyId: ++consultas === 1 ? A : B,
      }),
    })
  );
  assert.equal((await cadastrar(page)).codigo, 'IDENTIDADE_ALTERADA');
  await page.unrouteAll();
  await abrir(page);
  assert.equal((await consultar(page)).pacote, null);
});

test('versionchange fecha conexão antiga e preserva pacote existente', async (t) => {
  const page = await pagina(t);
  await abrir(page);
  await cadastrar(page);
  await page.evaluate(async (copy) => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('revisoesEscolares.lab.' + copy + '.v1', 2);
      req.onsuccess = () => {
        req.result.close();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }, A);
  assert.equal((await listar(page)).codigo, 'REPOSITORIO_FECHADO');
  assert.equal((await abrir(page)).codigo, 'VERSAO_INCOMPATIVEL');
  const registro = await page.evaluate(async (copy) => {
    const req = indexedDB.open('revisoesEscolares.lab.' + copy + '.v1', 2);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('pacotes');
        const r = tx.objectStore('pacotes').get(['alice', 'sintetico', 1]);
        tx.oncomplete = () => {
          db.close();
          resolve(r.result);
        };
      };
    });
  }, A);
  assert.equal(registro.id, 'sintetico');
});

test('banco vizinho independente permanece intacto em sucesso e falha', async (t) => {
  const page = await pagina(t);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const req = indexedDB.open('fixture-vizinho-preservado', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('marcadores');
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('marcadores', 'readwrite');
        tx.objectStore('marcadores').add('preservar', 'origem');
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    });
  });
  await abrir(page);
  await cadastrar(page);
  await cadastrar(page, '{}');
  const valor = await page.evaluate(
    async () =>
      new Promise((resolve) => {
        const req = indexedDB.open('fixture-vizinho-preservado', 1);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction('marcadores');
          const r = tx.objectStore('marcadores').get('origem');
          tx.oncomplete = () => {
            db.close();
            resolve(r.result);
          };
        };
      })
  );
  assert.equal(valor, 'preservar');
});
