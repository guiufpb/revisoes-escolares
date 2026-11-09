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
for (const caso of ['sem-sessoes', 'principal', 'duas', 'identico'])
  test(
    'aplicação: sucesso ' + caso + ' com confirmação separada e terminal persistido',
    async (t) => {
      const { page } = await vazio(t),
        sessoes =
          caso === 'sem-sessoes'
            ? {}
            : { principal: inicial(), ...(caso === 'duas' ? { responsavel: inicial() } : {}) };
      if (caso === 'identico') await cadastrar(page);
      const texto = await backupTexto(page, pacote(), sessoes);
      await intencao(page, texto);
      await autorizar(page, texto);
      await observar(page);
      const r = await aplicar(page);
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.aplicacaoConcluida, true);
      const d = await dados(page),
        a = d.operacoes[0].atividades[0];
      assert.equal(d.pacotes.length, 1);
      assert.equal(d.administracao.length, 1);
      assert.equal(d.operacoes[0].estado, 'aplicacao-concluida');
      assert.equal(a.conteudo.etapa, 'resultado-confirmado');
      for (const s of Object.keys(sessoes)) {
        assert.equal(a.sessoes[s].etapa, 'resultado-confirmado');
        const k = await chave(page, pacote(), s),
          raw = await page.evaluate((k) => localStorage.getItem(k), k);
        assert.deepEqual(JSON.parse(raw), sessoes[s]);
      }
      const eventos = await page.evaluate(() => window.eventos);
      assert.equal(eventos.filter((e) => e === 'pacotes:add').length, caso === 'identico' ? 0 : 1);
      assert.equal(
        eventos.filter((e) => e === 'administracao:add').length,
        caso === 'identico' ? 0 : 1
      );
      assert.equal(
        eventos.filter((e) => e === 'local:setItem').length,
        Object.keys(sessoes).length
      );
      assert.ok(
        eventos.every((e) =>
          ['pacotes:add', 'administracao:add', 'operacoes:put', 'local:setItem'].includes(e)
        )
      );
      assert.equal((await inspecionar(page)).bloqueiaRestauracao, false);
      const nova = await page.evaluate(async () => {
        const s = window.LabCoordenador.criarSessao();
        await s.preparar();
        const r = await s.adquirir({ perfil: 'alice', id: 'sintetico', versao: 1 });
        await s.encerrar();
        return r;
      });
      assert.equal(nova.ok, true, JSON.stringify(nova));
    }
  );
test('aplicação: dados já idênticos depois da intenção são preservados byte a byte', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await cadastrar(page);
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
    k,
    s: inicial(),
  });
  const antes = await dados(page);
  await autorizar(page, texto);
  await observar(page);
  const r = await aplicar(page);
  assert.equal(r.ok, true, JSON.stringify(r));
  const d = await dados(page);
  assert.deepEqual({ ...d, operacoes: [] }, { ...antes, operacoes: [] });
  assert.ok((await page.evaluate(() => window.eventos)).every((e) => e === 'operacoes:put'));
  assert.equal(d.operacoes[0].atividades[0].sessoes.principal.resultado, 'base-preservada');
});
test('aplicação: principal existente preservada ao criar somente responsável e vizinhos intactos', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const k = await chave(page);
  await page.evaluate(
    ({ k, s }) => {
      localStorage.setItem(k, JSON.stringify(s, null, 2));
      localStorage.setItem('oficial-fixture', 'original');
      localStorage.setItem(k + '.vizinha', 'vizinha');
    },
    { k, s: inicial() }
  );
  const p = pacote('vizinha');
  p.perfil = 'mariana';
  p.versao = 2;
  await cadastrar(page, p);
  const texto = await backupTexto(page, pacote(), { principal: inicial(), responsavel: inicial() });
  await intencao(page, texto);
  const antes = await dados(page);
  await autorizar(page, texto);
  await observar(page);
  assert.equal((await aplicar(page)).ok, true);
  const d = await dados(page);
  assert.deepEqual(d.pacotes, antes.pacotes);
  assert.deepEqual(d.administracao, antes.administracao);
  for (const [key, value] of antes.local) assert.equal(d.local.find((p) => p[0] === key)[1], value);
  assert.equal(
    (await page.evaluate(() => window.eventos)).filter((e) => e === 'local:setItem').length,
    1
  );
});
test('aplicação: confirmação de intenção, booleano, plano e capacidades forjadas não escrevem', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  const antes = await dados(page);
  const r = await page.evaluate(async (texto) => {
    const plano = await window.LabRestauracao.prepararPlano(texto),
      a = await window.LabRepositorio.abrirRepositorio();
    try {
      return await Promise.all([
        window.LabJournal.aplicarIntencao(texto),
        window.LabJournal.aplicarIntencao(texto, true),
        window.LabJournal.aplicarIntencao(texto, window.confirmacao),
        window.LabJournal.aplicarIntencao(texto, plano.plano),
        a.repositorio.executarAplicacaoJournal({}),
        window.LabProgresso.restaurarSnapshotInterno({}),
      ]);
    } finally {
      a.repositorio.fechar();
    }
  }, texto);
  assert.ok(r.every((r) => !r.ok));
  assert.deepEqual(await dados(page), antes);
});
test('aplicação: uso único concorrente e repetição posterior não duplicam dados ou pontos', async (t) => {
  const { page } = await vazio(t),
    s = inicial();
  s.respostas.q1 = ['Sol'];
  s.corrigidas.q1 = true;
  s.pontuadas.q1 = true;
  s.conferidas.q1 = true;
  s.pontos = 1;
  const texto = await backupTexto(page, pacote(), { principal: s });
  await intencao(page, texto);
  await autorizar(page, texto);
  const r = await page.evaluate(() =>
    Promise.all([
      window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp),
      window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp),
    ])
  );
  assert.equal(r.filter((r) => r.ok).length, 1, JSON.stringify(r));
  const antes = await dados(page);
  assert.equal((await aplicar(page)).ok, false);
  assert.equal((await solicitarApp(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
  assert.equal(JSON.parse(antes.local[0][1]).pontos, 1);
});
for (const caso of ['digest', 'progresso', 'corrompido', 'identidade', 'backup', 'cancelada'])
  test('aplicação: bloqueia ' + caso + ' sem sobrescrever', async (t) => {
    const { page } = await vazio(t),
      texto = await backupTexto(page);
    await intencao(page, texto);
    if (caso === 'digest') {
      const p = pacote();
      p.titulo = 'Divergente';
      await cadastrar(page, p);
    }
    if (['progresso', 'corrompido'].includes(caso)) {
      const k = await chave(page),
        s = inicial();
      s.respostas.q1 = ['Lua'];
      await page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
        k,
        v: caso === 'corrompido' ? '{' : JSON.stringify(s),
      });
    }
    const antes = await dados(page);
    if (['digest', 'progresso', 'corrompido'].includes(caso))
      assert.equal((await solicitarApp(page, texto)).ok, false);
    else {
      await autorizar(page, texto);
      if (caso === 'identidade') copyId = B;
      if (caso === 'cancelada') await page.evaluate(() => window.app.cancelar());
      const r =
        caso === 'backup'
          ? await page.evaluate(() =>
              window.LabJournal.aplicarIntencao(window.texto + ' ', window.confirmacaoApp)
            )
          : await aplicar(page);
      assert.equal(r.ok, false);
      copyId = A;
    }
    assert.deepEqual(await dados(page), antes);
  });
for (const falha of [
  'put-1',
  'quota-pacote',
  'abort-pacote',
  'put-2',
  'put-3',
  'put-4',
  'quota-local',
  'put-5',
  'put-6',
  'put-7',
])
  test('aplicação: fronteira ' + falha + ' mantém pendência sem repetir escrita', async (t) => {
    const { page } = await vazio(t),
      texto = await backupTexto(page);
    await intencao(page, texto);
    await autorizar(page, texto);
    await observar(page, falha);
    const r = await aplicar(page);
    assert.equal(r.ok, false, JSON.stringify(r));
    assert.equal(r.aplicacaoConcluida, false);
    const antes = await dados(page),
      j = await inspecionar(page);
    assert.notEqual(antes.operacoes[0].estado, 'aplicacao-concluida');
    assert.equal(j.bloqueiaRestauracao, true);
    assert.equal(
      antes.pacotes.length,
      ['put-1', 'quota-pacote', 'abort-pacote'].includes(falha) ? 0 : 1
    );
    assert.equal(antes.administracao.length, antes.pacotes.length);
    if (falha !== 'put-1') assert.equal((await solicitarApp(page, texto)).ok, false);
    assert.equal((await aplicar(page)).ok, false);
    assert.deepEqual(await dados(page), antes);
    const exec = await page.evaluate(async () => {
      const s = window.LabCoordenador.criarSessao();
      await s.preparar();
      const r = await s.adquirir({ perfil: 'alice', id: 'sintetico', versao: 1 });
      await s.encerrar();
      return r;
    });
    assert.equal(exec.ok, false);
  });
test('aplicação: confirmação mantém lock real e bloqueia outra aba', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  const outra = await ctx.newPage();
  await carregar(outra);
  await outra.evaluate(
    (id) => {
      window.operacao = id;
    },
    await page.evaluate(() => window.operacao)
  );
  assert.equal((await solicitarApp(outra, texto)).ok, false);
  assert.equal((await aplicar(page)).ok, true);
});
test('aplicação: base criada depois da confirmação não é sobrescrita nem reinterpretada', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
    k,
    s: inicial(),
  });
  const antes = await dados(page);
  assert.equal((await aplicar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
});
test('aplicação: aba interrompida antes do commit de pacote conserva journal e aborta ambos os adds', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  await observar(page, 'interromper-pacote');
  const leitor = await ctx.newPage();
  await carregar(leitor);
  await page.evaluate(() => {
    window.promessa = window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp);
  });
  await page.waitForFunction(() => window.aceitou);
  await page.close();
  const d = await dados(leitor);
  assert.equal(d.pacotes.length, 0);
  assert.equal(d.administracao.length, 0);
  assert.equal(d.operacoes[0].atividades[0].conteudo.etapa, 'escrita-solicitada');
  assert.equal((await inspecionar(leitor)).bloqueiaRestauracao, true);
});

test('aplicação: armazenamento bloqueado não vira ausência nem recebe escrita', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  const antes = await dados(page);
  await page.evaluate(() => {
    Storage.prototype.getItem = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  assert.equal((await solicitarApp(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
});
for (const falha of ['silenciosa', 'leitura-posterior'])
  test(
    'aplicação: falha ' + falha + ' após solicitar snapshot não anuncia conclusão',
    async (t) => {
      const { page } = await vazio(t),
        texto = await backupTexto(page);
      await intencao(page, texto);
      await autorizar(page, texto);
      await page.evaluate((falha) => {
        const set = Storage.prototype.setItem,
          get = Storage.prototype.getItem;
        let escrita = false;
        Storage.prototype.setItem = function (k, v) {
          escrita = true;
          if (falha !== 'silenciosa') return set.call(this, k, v);
        };
        Storage.prototype.getItem = function (k) {
          if (escrita && falha === 'leitura-posterior')
            throw new window.DOMException('Fixture', 'SecurityError');
          return get.call(this, k);
        };
      }, falha);
      const r = await aplicar(page);
      assert.equal(r.ok, false);
      assert.equal(r.pendenteDeReconciliacao, true);
      const d = await dados(page);
      assert.equal(d.pacotes.length, 1);
      assert.equal(d.local.length, falha === 'silenciosa' ? 0 : 1);
      const j = await inspecionar(page);
      assert.equal(j.bloqueiaRestauracao, true);
      assert.equal(j.registros[0].etapas.find((p) => p.alvo === 'principal').escritaIncerta, true);
    }
  );
test('aplicação: mutação do journal na fronteira nativa invalida CAS e preserva dados escolares', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (stores, modo, ...args) {
      if (modo === 'readwrite' && Array.from(stores).includes('operacoes')) {
        IDBDatabase.prototype.transaction = original;
        const tx = original.call(this, 'operacoes', 'readwrite'),
          s = tx.objectStore('operacoes'),
          q = s.get(window.operacao);
        q.onsuccess = () => {
          const r = q.result;
          r.estado = 'bloqueada';
          r.revisao = 3;
          s.put(r);
        };
      }
      return original.call(this, stores, modo, ...args);
    };
  });
  assert.equal((await aplicar(page)).ok, false);
  const d = await dados(page);
  assert.equal(d.pacotes.length, 0);
  assert.equal(d.administracao.length, 0);
  assert.equal(d.local.length, 0);
  assert.equal(d.operacoes[0].estado, 'bloqueada');
});
test('aplicação: pacote inserido na fronteira do add permanece intocado', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  await page.evaluate(async (p) => {
    const v = await window.LabValidador.validarPacote(JSON.stringify(p));
    const base = {
      perfil: p.perfil,
      materia: p.materia,
      id: p.id,
      versao: p.versao,
      digest: v.digest,
    };
    window.pacoteInserido = { ...base, conteudo: v.canonico };
    window.adminInserida = { ...base, situacao: 'ativa', criadoEm: '2026-01-01T00:00:00.000Z' };
    const original = IDBDatabase.prototype.transaction;
    let n = 0;
    IDBDatabase.prototype.transaction = function (stores, modo, ...args) {
      if (modo === 'readwrite' && Array.from(stores).includes('operacoes') && ++n === 2) {
        IDBDatabase.prototype.transaction = original;
        const tx = original.call(this, ['pacotes', 'administracao'], 'readwrite');
        tx.objectStore('pacotes').add(window.pacoteInserido);
        tx.objectStore('administracao').add(window.adminInserida);
      }
      return original.call(this, stores, modo, ...args);
    };
  }, pacote());
  assert.equal((await aplicar(page)).ok, false);
  const d = await dados(page);
  assert.deepEqual(d.pacotes[0], await page.evaluate(() => window.pacoteInserido));
  assert.deepEqual(d.administracao[0], await page.evaluate(() => window.adminInserida));
  assert.equal(d.local.length, 0);
});
test('aplicação: snapshot igual inserido na última fronteira também não é regravado', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  const k = await chave(page);
  await page.evaluate(
    ({ k, s }) => {
      const original = IDBDatabase.prototype.transaction;
      let n = 0;
      window.inserida = JSON.stringify(s, null, 2);
      window.escritasLS = 0;
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (...args) {
        ++window.escritasLS;
        return set.apply(this, args);
      };
      IDBDatabase.prototype.transaction = function (stores, modo, ...args) {
        if (modo === 'readwrite' && Array.from(stores).includes('operacoes') && ++n === 6)
          localStorage.setItem(k, window.inserida);
        return original.call(this, stores, modo, ...args);
      };
    },
    { k, s: inicial() }
  );
  assert.equal((await aplicar(page)).ok, false);
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), k),
    await page.evaluate(() => window.inserida)
  );
  assert.equal(await page.evaluate(() => window.escritasLS), 1);
});
test('aplicação: cancelamento com identidade pendente neutraliza callback tardio', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  const antes = await dados(page);
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
    window.promessa = window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp);
  });
  await recebida;
  await page.evaluate(() => window.app.cancelar());
  liberar();
  assert.equal((await page.evaluate(() => window.promessa)).ok, false);
  assert.deepEqual(await dados(page), antes);
});
test('aplicação: temporário com memória recente em outra aba bloqueia antes de qualquer marcador', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  const antes = await dados(page);
  const outra = await ctx.newPage();
  await carregar(outra);
  status = 503;
  const r = await outra.evaluate(async (p) => {
    const s = window.LabCoordenador.criarSessao();
    await s.preparar();
    s.decidirTemporario(true);
    await s.carregarTemporario(JSON.stringify(p));
    await s.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
    const config = {
      id: 'lab-runtime',
      chave: null,
      aluno: p.perfil,
      nome: 'Fixture',
      materia: 'Ciências',
      titulo: p.titulo,
      questoes: p.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
    };
    const r = window.QuestionariosRevisoes.registrarLab(() => config);
    return r.handle.abrir(s, 'principal');
  }, pacote());
  status = 200;
  assert.equal(r.ok, true);
  assert.equal((await solicitarApp(page, texto)).ok, false);
  assert.deepEqual(await dados(page), antes);
});
test('aplicação: interrupção real depois de setItem preserva snapshot e journal incerto sem atomicidade presumida', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  const leitor = await ctx.newPage();
  await carregar(leitor);
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (stores, modo, ...args) {
      const tx = original.call(this, stores, modo, ...args);
      if (modo === 'readwrite') window.txAtual = tx;
      return tx;
    };
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (...args) {
      set.apply(this, args);
      window.snapshotAceito = true;
      const store = window.txAtual.objectStore('operacoes');
      const manter = () => {
        const q = store.get(window.operacao);
        q.onsuccess = manter;
      };
      manter();
    };
  });
  await page.evaluate(() => {
    window.promessa = window.LabJournal.aplicarIntencao(window.texto, window.confirmacaoApp);
  });
  await page.waitForFunction(() => window.snapshotAceito);
  await page.close();
  const d = await dados(leitor);
  assert.equal(d.pacotes.length, 1);
  assert.equal(d.local.length, 1);
  const j = await inspecionar(leitor);
  assert.equal(j.bloqueiaRestauracao, true);
  assert.equal(j.registros[0].etapas.find((p) => p.alvo === 'principal').escritaIncerta, true);
});
for (const pendente of [true, false])
  test(
    'aplicação: reinício real do Chromium preserva estado ' + (pendente ? 'pendente' : 'concluído'),
    async () => {
      copyId = A;
      status = 200;
      fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
      const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-aplicacao-perfil-'));
      let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
      try {
        let page = await ctx.newPage();
        await carregar(page);
        const texto = await backupTexto(page);
        const id = await intencao(page, texto);
        await autorizar(page, texto);
        if (pendente) await observar(page, 'put-5');
        const r = await aplicar(page);
        assert.equal(r.ok, !pendente);
        const antes = await dados(page);
        await ctx.close();
        ctx = await chromium.launchPersistentContext(perfil, { headless: true });
        page = await ctx.newPage();
        await carregar(page);
        assert.deepEqual(await dados(page), antes);
        const j = await inspecionar(page);
        assert.equal(j.bloqueiaRestauracao, pendente);
        await page.evaluate((id) => {
          window.operacao = id;
        }, id);
        assert.equal((await solicitarApp(page, texto)).ok, false);
        assert.deepEqual(await dados(page), antes);
      } finally {
        await ctx.close();
      }
    }
  );
test('aplicação: journal com etapa incoerente ou alcance desconhecido bloqueia sem reparo', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await page.evaluate(async () => {
    const db = await new Promise((resolve) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + 'a'.repeat(64) + '.v1');
      q.onsuccess = () => resolve(q.result);
    });
    await new Promise((resolve) => {
      const tx = db.transaction('operacoes', 'readwrite');
      const s = tx.objectStore('operacoes'),
        q = s.get(window.operacao);
      q.onsuccess = () => {
        const r = q.result;
        r.atividades[0].conteudo.etapa = 'resultado-confirmado';
        s.put(r);
      };
      tx.oncomplete = resolve;
    });
    db.close();
  });
  const antes = await dados(page);
  assert.equal((await solicitarApp(page, texto)).ok, false);
  assert.equal((await inspecionar(page)).bloqueioGlobalLab, true);
  assert.deepEqual(await dados(page), antes);
});
test('aplicação: pacote parcial permanece bloqueado mesmo sem módulo de journal carregado', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  await observar(page, 'quota-local');
  assert.equal((await aplicar(page)).ok, false);
  const r = await page.evaluate(async () => {
    window.LabJournal = undefined;
    const s = window.LabCoordenador.criarSessao();
    await s.preparar();
    const r = await s.adquirir({ perfil: 'alice', id: 'sintetico', versao: 1 });
    await s.encerrar();
    return r;
  });
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'JOURNAL_NAO_INSPECIONAVEL');
});

test('aplicação: expiração da confirmação revoga capacidade e libera locks sem escrita', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await page.evaluate(() => {
    const n = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => {
      if (ms === 30000) window.expirar = fn;
      return n(fn, ms, ...args);
    };
  });
  await autorizar(page, texto);
  const antes = await dados(page);
  await page.evaluate(() => window.expirar());
  assert.equal((await aplicar(page)).ok, false);
  assert.deepEqual(await dados(page), antes);
  await page.waitForFunction(async () => (await navigator.locks.query()).held.length === 0);
});
test('aplicação: timeout da transação de conteúdo não deixa pacote ou administração parcial', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await autorizar(page, texto);
  await observar(page, 'interromper-pacote');
  const r = await aplicar(page);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'ARMAZENAMENTO_TIMEOUT');
  const d = await dados(page);
  assert.equal(d.pacotes.length, 0);
  assert.equal(d.administracao.length, 0);
  assert.equal(d.local.length, 0);
  assert.equal(d.operacoes[0].atividades[0].conteudo.etapa, 'escrita-solicitada');
});
test('aplicação: revisão oficial ativa mantém DOM, resposta e chave própria', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await intencao(page, texto);
  await page.evaluate((p) => {
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
  }, pacote());
  await page.locator('[data-opcao-gramatica="Lua"]').click();
  const antes = await page.evaluate(() => ({
    html: window.document.getElementById('gramatica-conteudo').innerHTML,
    id: window.QuestionariosRevisoes.obterAtiva().id,
    raw: localStorage.getItem('oficial-fixture'),
  }));
  await autorizar(page, texto);
  assert.equal((await aplicar(page)).ok, true);
  assert.deepEqual(
    await page.evaluate(() => ({
      html: window.document.getElementById('gramatica-conteudo').innerHTML,
      id: window.QuestionariosRevisoes.obterAtiva().id,
      raw: localStorage.getItem('oficial-fixture'),
    })),
    antes
  );
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
test('6C.2 backend: restaura v2 original com duas sessões e aquisição autêntica', async (t) => {
  const { page } = await vazio(t);
  for (const arquivo of ['audio.js', 'gramatica-ditado.js'])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', arquivo) });
  const p = ditadoOperacional();
  const principal = {
    ...inicial(),
    respostas: { q1: ['Sol'] },
    corrigidas: { q1: true },
    conferidas: { q1: true },
    pontuadas: { q1: true },
    pontos: 1,
    finalizada: true,
  };
  const responsavel = { ...inicial(), respostas: { q1: ['Lua'] } };
  const texto = await backupTexto(page, p, { principal, responsavel });
  await intencao(page, texto);
  await autorizar(page, texto);
  await observar(page);
  const r = await aplicar(page);
  assert.equal(r.ok, true, JSON.stringify(r));
  const d = await dados(page);
  assert.equal(d.pacotes.length, 1);
  assert.equal(JSON.parse(d.pacotes[0].conteudo).formato, 'lab-questionarios-v2');
  assert.equal(d.operacoes[0].estado, 'aplicacao-concluida');
  for (const [s, estado] of Object.entries({ principal, responsavel })) {
    const k = await chave(page, p, s);
    assert.deepEqual(JSON.parse(await page.evaluate((k) => localStorage.getItem(k), k)), estado);
  }
  const real = await page.evaluate(async (p) => {
    const c = window.LabCoordenador.criarSessao();
    await c.preparar();
    const a = await c.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
    if (!a.ok) return a;
    const cfg = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(JSON.stringify(p));
    const h = window.QuestionariosRevisoes.registrarLab(() => ({
      id: 'lab-v2-real',
      chave: null,
      aluno: p.perfil,
      nome: 'Alice',
      materia: 'Ciências',
      titulo: cfg.titulo,
      questoes: cfg.questoes,
    }));
    if (!h.ok) return h;
    const abriu = await h.handle.abrir(c, 'principal');
    const b = window.LabBackup.capturar(h.handle);
    const backup = await window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [b.captura] },
    ]);
    const snapshot = h.handle.exportarSnapshot();
    await h.handle.desativar();
    const aux = await h.handle.abrir(c, 'responsavel');
    if (!aux.ok) return aux;
    const capturaAux = window.LabBackup.capturar(h.handle);
    const ambas = await window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [b.captura, capturaAux.captura] },
    ]);
    await h.handle.desativar();
    await h.handle.liberar();
    await c.encerrar();
    const anterior = {
      formato: 'lab-questionarios-v1',
      perfil: 'alice',
      materia: 'ciencias',
      id: 'vizinho-v1',
      versao: 1,
      titulo: 'Vizinho',
      questoes: [
        {
          id: 'q1',
          bloco: 'Exemplo',
          titulo: 'Exemplo',
          instrucao: 'Escolha.',
          tipo: 'opcoes',
          dica: 'Observe.',
          itens: [{ id: 'i1', pergunta: 'Luz?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] }],
        },
      ],
    };
    const repo = await window.LabRepositorio.abrirRepositorio();
    const registro = await repo.repositorio.cadastrar(JSON.stringify(anterior));
    repo.repositorio.fechar();
    if (!registro.ok) return registro;
    const vizinho = window.LabCoordenador.criarSessao();
    await vizinho.preparar();
    const aquisicao = await vizinho.adquirir({ perfil: 'alice', id: anterior.id, versao: 1 });
    if (!aquisicao.ok) return aquisicao;
    const capturaV1 = await window.LabBackup.capturarPacote(vizinho);
    const misto = await window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [b.captura, capturaAux.captura] },
      { situacaoAdministrativa: 'ativa', capturas: [capturaV1.captura] },
    ]);
    await vizinho.encerrar();
    return { ok: abriu.ok, digest: a.digest, snapshot, backup, ambas, misto };
  }, p);
  assert.equal(real.ok, true, JSON.stringify(real));
  assert.deepEqual(real.snapshot.snapshot, principal);
  assert.equal(real.backup.valido, true);
  assert.equal(real.ambas.valido, true);
  assert.deepEqual(real.ambas.backupNormalizado.entradas[0].sessoes, { principal, responsavel });
  assert.equal(real.misto.valido, true);
  assert.equal(real.misto.backupNormalizado.entradas.length, 2);
  assert.equal(real.backup.backupNormalizado.entradas[0].digest, real.digest);
  assert.equal(real.backup.backupNormalizado.entradas[0].pacote.formato, 'lab-questionarios-v2');
});

test('6C.2 backend: transporte v2 acima de 256 KiB não grava nem anuncia durabilidade', async (t) => {
  const { page } = await vazio(t);
  const p = ditadoOperacional();
  p.questoes = Array.from({ length: 30 }, (_, i) => ({
    ...p.questoes[0],
    id: 'q' + i,
    itens: Array.from({ length: 6 }, (_, j) => ({ id: 'i' + i + '-' + j, texto: 'Sol' })),
  }));
  const r = await page.evaluate(async (p) => {
    const repo = await window.LabRepositorio.abrirRepositorio();
    const cadastro = await repo.repositorio.cadastrar(JSON.stringify(p));
    repo.repositorio.fechar();
    if (!cadastro.ok) return cadastro;
    const c = window.LabCoordenador.criarSessao();
    await c.preparar();
    const a = await c.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
    if (!a.ok) return a;
    const ch = c.abrirProgresso('principal').canal;
    await ch.carregar();
    const antes = localStorage.getItem(ch.chave);
    const estado = {
      versao: 1,
      questaoAtual: 0,
      respostas: Object.fromEntries(
        p.questoes.map((q) => [q.id, q.itens.map(() => String.fromCharCode(0).repeat(1000))])
      ),
      corrigidas: {},
      pontuadas: {},
      conferidas: {},
      pontos: 0,
      finalizada: false,
    };
    const ctx = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(JSON.stringify(p));
    const analise = ctx.validarSnapshot('principal', estado);
    const resultado = await ch.salvar(estado);
    const depois = localStorage.getItem(ch.chave);
    await c.encerrar();
    return {
      ok: true,
      resultado,
      antes,
      depois,
      analise: analise.ok,
      tamanho: new window.TextEncoder().encode(JSON.stringify(estado)).length,
    };
  }, p);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.analise, true);
  assert.ok(r.tamanho > 262144);
  assert.equal(r.resultado.ok, false);
  assert.equal(r.resultado.durabilidade, 'memoria');
  assert.equal(r.depois, r.antes);
});

test('6C.2 backend: pacote v2 não ingressa na importação temporária', async (t) => {
  const { page } = await vazio(t);
  const r = await page.evaluate(async (p) => {
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    const c = window.LabCoordenador.criarSessao();
    const preparacao = await c.preparar();
    if (preparacao.codigo !== 'CONSENTIMENTO_NECESSARIO') return preparacao;
    c.decidirTemporario(true);
    const resultado = await c.carregarTemporario(JSON.stringify(p));
    await c.encerrar();
    return resultado;
  }, ditadoOperacional());
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'PACOTE_INVALIDO');
});
