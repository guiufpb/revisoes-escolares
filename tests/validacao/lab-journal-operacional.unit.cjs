/* global window, localStorage, Storage, navigator, indexedDB, IDBObjectStore, IDBDatabase */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
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
// Falhas são injetadas em primitivas nativas; o caminho positivo usa somente APIs de produção.
async function observarEscritas(page, modo = 'normal') {
  await page.evaluate((modo) => {
    window.escritas = [];
    window.pedidoAceito = false;
    window.commitObservado = false;
    for (const nome of ['setItem', 'removeItem', 'clear']) {
      const n = Storage.prototype[nome];
      Storage.prototype[nome] = function (...args) {
        window.escritas.push('local:' + nome);
        return n.apply(this, args);
      };
    }
    for (const nome of ['add', 'put', 'delete', 'clear']) {
      const n = IDBObjectStore.prototype[nome];
      IDBObjectStore.prototype[nome] = function (...args) {
        window.escritas.push(this.name + ':' + nome);
        if (this.name !== 'operacoes' || nome !== 'add') return n.apply(this, args);
        if (modo === 'quota') throw new window.DOMException('Fixture', 'QuotaExceededError');
        const r = n.apply(this, args),
          store = this,
          tx = this.transaction;
        tx.addEventListener('complete', () => {
          window.commitObservado = true;
        });
        r.addEventListener('success', () => {
          window.pedidoAceito = true;
          if (modo === 'abort') tx.abort();
          if (modo === 'interromper' || modo === 'timeout') {
            const manter = () => {
              const prox = store.get(args[0].id);
              prox.onsuccess = manter;
            };
            manter();
          }
        });
        return r;
      };
    }
  }, modo);
}
async function operar(page, texto) {
  const solicitacao = await solicitar(page, texto);
  assert.equal(solicitacao.ok, true, `solicitar: ${solicitacao.codigo || 'sem código'}`);
  const confirmacao = await confirmar(page);
  assert.equal(confirmacao.ok, true, `confirmar: ${confirmacao.codigo || 'sem código'}`);
  return gravar(page);
}
async function aguardarLiberacaoNativa(page) {
  // page.close() confirma o fechamento da página; a terminação dos Web Locks
  // ainda percorre sua fila nativa. expect.poll aguarda cada consulta assíncrona;
  // waitForFunction tratava a Promise como truthy e não repetia uma consulta false.
  await expect
    .poll(
      async () => {
        const locks = await page.evaluate(() => navigator.locks.query());
        return locks.held.length === 0 && locks.pending.length === 0;
      },
      { intervals: [25], timeout: 3000 }
    )
    .toBe(true);
}

test('operacional: ausente registra intenção real somente após oncomplete, sem dados escolares', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await page.evaluate(() => localStorage.setItem('oficial-preservado', 'fixture'));
  const antes = await dados(page);
  await observarEscritas(page);
  const r = await operar(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.estado, 'intencao-registrada');
  assert.equal(r.restauracaoAplicada, false);
  assert.equal(await page.evaluate(() => window.commitObservado), true);
  assert.deepEqual(await page.evaluate(() => window.escritas), ['operacoes:add']);
  const depois = await dados(page),
    registro = depois.operacoes[0];
  assert.deepEqual({ ...depois, operacoes: [] }, antes);
  assert.equal(registro.id, r.operacao);
  assert.equal(registro.atividades[0].conteudo.intencao, 'criar');
  assert.equal(registro.atividades[0].sessoes.principal.intencao, 'criar');
  assert.deepEqual(Object.keys(registro.atividades[0].sessoes), ['principal']);
  assert.equal((await inspecionar(page)).registros[0].presencaEmIndexedDBObservada, true);
  const plano = await page.evaluate((texto) => window.LabRestauracao.prepararPlano(texto), texto);
  assert.ok(plano.previa.entradas[0].bloqueios.includes('JOURNAL_PENDENTE_NA_ATIVIDADE'));
  assert.equal(plano.previa.entradas[0].conteudo.estado, 'ausente');
});
test('operacional: pacote idêntico e sessão ausente preservam conteúdo e sessão igual', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
    k,
    s: inicial(),
  });
  const texto = await backupTexto(page, pacote(), { principal: inicial(), responsavel: inicial() });
  const antes = await dados(page);
  await observarEscritas(page);
  const r = await operar(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  const depois = await dados(page),
    a = depois.operacoes[0].atividades[0];
  assert.deepEqual({ ...depois, operacoes: [] }, antes);
  assert.equal(a.conteudo.intencao, 'preservar');
  assert.equal(a.conteudo.pacote, null);
  assert.equal(a.sessoes.principal.intencao, 'preservar');
  assert.match(a.sessoes.principal.base.hashTexto, /^[a-f0-9]{64}$/);
  assert.equal(a.sessoes.responsavel.intencao, 'criar');
  assert.deepEqual(await page.evaluate(() => window.escritas), ['operacoes:add']);
});
test('operacional: pacote existente sem nenhuma inserção é recusado', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
    k,
    s: inicial(),
  });
  assert.equal((await solicitar(page, await backupTexto(page))).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
for (const caso of [
  'digest',
  'progresso-divergente',
  'progresso-corrompido',
  'multi',
  'arquivada',
  'sem-lock',
  'sem-identidade',
]) {
  test('operacional: bloqueia ' + caso, async (t) => {
    const { page } = await vazio(t);
    let texto = await backupTexto(page);
    if (caso === 'digest') {
      const p = pacote();
      p.titulo = 'Outro';
      await cadastrar(page, p);
    }
    if (caso.startsWith('progresso')) {
      const k = await chave(page),
        s = inicial();
      s.respostas = { q1: ['Lua'] };
      await page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
        k,
        v: caso.endsWith('corrompido') ? '{' : JSON.stringify(s),
      });
    }
    if (caso === 'multi') {
      const v = JSON.parse(texto),
        outro = JSON.parse(await backupTexto(page, pacote('outra')));
      v.entradas.push(outro.entradas[0]);
      texto = JSON.stringify(v);
    }
    if (caso === 'arquivada')
      texto = await backupTexto(page, pacote(), { principal: inicial() }, 'arquivada');
    if (caso === 'sem-lock')
      await page.evaluate(() => Object.defineProperty(navigator, 'locks', { value: undefined }));
    if (caso === 'sem-identidade') status = 503;
    const r = await solicitar(page, texto);
    assert.equal(r.ok, false, JSON.stringify(r));
    status = 200;
    assert.equal((await dados(page)).operacoes.length, 0);
  });
}
test('operacional: true, plano diagnóstico, lock forjado e confirmação pública não habilitam escrita bruta', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  const r = await page.evaluate(async (texto) => {
    const plano = await window.LabRestauracao.prepararPlano(texto),
      a = await window.LabRepositorio.abrirRepositorio();
    try {
      return await Promise.all([
        window.LabJournal.prepararIntencao(texto),
        window.LabJournal.prepararIntencao(texto, true),
        window.LabJournal.prepararIntencao(texto, plano.plano),
        a.repositorio.registrarIntencaoJournal({ exclusive: true }),
        window.LabJournal.executarGravacaoInterna({}, () => ({ ok: true })),
      ]);
    } finally {
      a.repositorio.fechar();
    }
  }, texto);
  assert.ok(r.every((v) => !v.ok));
  assert.equal((await solicitar(page, texto)).ok, true);
  await confirmar(page);
  const falso = await page.evaluate(async () => {
    const a = await window.LabRepositorio.abrirRepositorio();
    try {
      return await a.repositorio.registrarIntencaoJournal(window.confirmacao);
    } finally {
      a.repositorio.fechar();
    }
  });
  assert.equal(falso.ok, false);
  assert.equal((await gravar(page)).ok, true);
});
test('operacional: confirmação consumida antes de await não admite duas gravações concorrentes', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  const r = await page.evaluate(() =>
    Promise.all([
      window.LabJournal.prepararIntencao(window.texto, window.confirmacao),
      window.LabJournal.prepararIntencao(window.texto, window.confirmacao),
    ])
  );
  assert.equal(r.filter((v) => v.ok).length, 1);
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 1);
});
test('operacional: backup diferente queima confirmação sem permitir voltar aos bytes originais', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  const r = await page.evaluate(() =>
    window.LabJournal.prepararIntencao(window.texto + ' ', window.confirmacao)
  );
  assert.equal(r.ok, false);
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: bytes mutáveis são capturados e devem continuar iguais na persistência', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  const r = await page.evaluate(async (texto) => {
    window.bytes = new window.TextEncoder().encode(texto);
    const r = await window.LabJournal.solicitarConfirmacao(window.bytes);
    if (!r.ok) return r;
    const c = r.solicitacao.confirmar();
    window.bytes[window.bytes.length - 1] = 32;
    return window.LabJournal.prepararIntencao(window.bytes, c.confirmacao);
  }, texto);
  assert.equal(r.ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: cancelar e callback tardio não reativam nem persistem confirmação', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await page.evaluate(() => window.solicitacao.cancelar());
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
  assert.deepEqual(await page.evaluate(async () => (await navigator.locks.query()).held), []);
});
test('operacional: mudança de identidade revoga confirmação e não adota nova cópia', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  copyId = B;
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
  copyId = A;
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: mudança textual da base após confirmação exige confirmação nova', async (t) => {
  const { page } = await vazio(t),
    k = await chave(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), {
    k,
    s: inicial(),
  });
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s, null, 2)), {
    k,
    s: inicial(),
  });
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: lock real ocupado em outra aba bloqueia e volta a funcionar após liberação', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page),
    outra = await ctx.newPage();
  await carregar(outra);
  assert.equal((await solicitar(outra, texto)).ok, true);
  assert.equal((await solicitar(page, texto)).ok, false);
  await outra.evaluate(() => window.solicitacao.cancelar());
  assert.equal((await operar(page, texto)).ok, true);
});
test('operacional: lock de mesmo ID com digest diferente também impede preparação', async (t) => {
  const { ctx, page } = await vazio(t),
    outra = await ctx.newPage();
  await carregar(outra);
  const p = pacote();
  p.titulo = 'Outra execução';
  const texto = await backupTexto(outra, p);
  assert.equal((await solicitar(outra, texto)).ok, true);
  assert.equal((await solicitar(page, await backupTexto(page))).ok, false);
});
test('operacional: execução do motor retida após suspensão é bloqueio mesmo sem lock', async (t) => {
  const { page } = await vazio(t);
  await cadastrar(page);
  const r = await page.evaluate(async (p) => {
    const s = window.LabCoordenador.criarSessao();
    await s.preparar();
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
    if (!r.ok) return r;
    const abriu = await r.handle.abrir(s, 'principal');
    if (!abriu.ok) return abriu;
    await s.encerrar();
    return { ok: true };
  }, pacote());
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal((await solicitar(page, await backupTexto(page))).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
for (const modo of ['quota', 'abort', 'timeout'])
  test('operacional: falha ' + modo + ' antes do commit não deixa intenção', async (t) => {
    const { page } = await vazio(t);
    await solicitar(page, await backupTexto(page));
    await confirmar(page);
    await observarEscritas(page, modo);
    const r = await gravar(page);
    assert.equal(r.ok, false, JSON.stringify(r));
    assert.equal(await page.evaluate(() => window.commitObservado), false);
    assert.equal((await dados(page)).operacoes.length, 0);
    assert.equal((await gravar(page)).ok, false);
  });
test('operacional: storage bloqueado impede interpretar ausência como base vazia', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  await page.evaluate(() => {
    Storage.prototype.getItem = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  assert.equal((await solicitar(page, texto)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: pendência já persistida recusa repetição e preserva outra atividade', async (t) => {
  const { page } = await vazio(t),
    texto = await backupTexto(page);
  assert.equal((await operar(page, texto)).ok, true);
  assert.equal((await solicitar(page, texto)).ok, false);
  assert.equal((await operar(page, await backupTexto(page, pacote('outra')))).ok, true);
  assert.equal((await dados(page)).operacoes.length, 2);
});
test('operacional: registro corrompido de alcance desconhecido bloqueia sem reparo', async (t) => {
  const { page } = await vazio(t);
  assert.equal((await operar(page, await backupTexto(page))).ok, true);
  await page.evaluate(async () => {
    const db = await new Promise((r) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + 'a'.repeat(64) + '.v1', 1);
      q.onsuccess = () => r(q.result);
    });
    await new Promise((r) => {
      const tx = db.transaction('operacoes', 'readwrite');
      tx.objectStore('operacoes').add({ id: 'corrompido' });
      tx.oncomplete = r;
    });
    db.close();
  });
  const antes = await dados(page);
  assert.equal((await solicitar(page, await backupTexto(page, pacote('outra')))).ok, false);
  assert.deepEqual(await dados(page), antes);
});
test('operacional: interrupção real da aba com add aceito e transação ainda ativa não deixa intenção parcial', async (t) => {
  const { ctx, page } = await vazio(t),
    texto = await backupTexto(page),
    leitor = await ctx.newPage();
  await carregar(leitor);
  await solicitar(page, texto);
  await confirmar(page);
  await observarEscritas(page, 'interromper');
  await page.evaluate(() => {
    window.promessa = window.LabJournal.prepararIntencao(window.texto, window.confirmacao);
  });
  await page.waitForFunction(() => window.pedidoAceito && !window.commitObservado);
  await page.close();
  assert.equal((await dados(leitor)).operacoes.length, 0);
  assert.equal((await operar(leitor, texto)).ok, true);
});
test('operacional: cancelamento durante transação aborta antes de soltar Web Lock', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await observarEscritas(page, 'interromper');
  await page.evaluate(() => {
    window.promessa = window.LabJournal.prepararIntencao(window.texto, window.confirmacao);
  });
  await page.waitForFunction(() => window.pedidoAceito);
  await page.evaluate(() => window.solicitacao.cancelar());
  assert.equal((await page.evaluate(() => window.promessa)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: fechamento após commit e reabertura real do Chromium preservam pendência', async () => {
  copyId = A;
  status = 200;
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-journal-operacional-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    const r = await operar(page, await backupTexto(page));
    assert.equal(r.ok, true);
    await ctx.close();
    ctx = await chromium.launchPersistentContext(perfil, { headless: true });
    page = await ctx.newPage();
    await carregar(page);
    assert.equal((await inspecionar(page)).registros[0].operacao, r.operacao);
    const d = await dados(page);
    assert.equal(d.pacotes.length, 0);
    assert.equal(d.administracao.length, 0);
    assert.equal(d.local.length, 0);
  } finally {
    await ctx.close();
  }
});

test('operacional: snapshot coerente acima do transporte persistente é bloqueado', async (t) => {
  const { page } = await vazio(t),
    p = pacote(),
    s = inicial();
  p.questoes = Array.from({ length: 30 }, (_, i) => ({
    ...p.questoes[0],
    id: 'q' + i,
    tipo: 'campos',
    itens: Array.from({ length: 6 }, (_, j) => ({
      id: 'i' + i + '-' + j,
      pergunta: 'Campo',
      respostas: ['sim'],
    })),
  }));
  for (const q of p.questoes) s.respostas[q.id] = q.itens.map(() => '\u0000'.repeat(1000));
  const texto = await backupTexto(page, p, { principal: s });
  assert.equal(
    await page.evaluate(
      async (texto) => (await window.LabBackup.validarBackup(texto)).valido,
      texto
    ),
    true
  );
  assert.equal((await solicitar(page, texto)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: argumento genérico na confirmação revoga a solicitação', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  assert.equal((await page.evaluate(() => window.solicitacao.confirmar(true))).ok, false);
  assert.equal((await confirmar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: expiração revoga token e libera as duas posses nativas', async (t) => {
  const { page } = await vazio(t);
  await page.evaluate(() => {
    const n = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => {
      if (ms === 30000) window.expirar = fn;
      return n(fn, ms, ...args);
    };
  });
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await page.evaluate(() => window.expirar());
  assert.equal((await gravar(page)).ok, false);
  await page.waitForFunction(async () => (await navigator.locks.query()).held.length === 0);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: encerramento enquanto identidade está pendente neutraliza retorno tardio', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
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
    window.promessa = window.LabJournal.prepararIntencao(window.texto, window.confirmacao);
  });
  await recebida;
  await page.evaluate(() => window.solicitacao.cancelar());
  liberar();
  assert.equal((await page.evaluate(() => window.promessa)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
test('operacional: exclusividade inconclusiva depois da confirmação impede escrita', async (t) => {
  const { page } = await vazio(t);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await page.evaluate(() => {
    navigator.locks.query = () => Promise.reject(new Error('Fixture'));
  });
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
for (const store of ['administracao', 'operacoes'])
  test(
    'operacional: mudança de ' + store + ' na fronteira da transação aborta comparação atômica',
    async (t) => {
      const { page } = await vazio(t);
      await cadastrar(page);
      await solicitar(page, await backupTexto(page));
      await confirmar(page);
      await page.evaluate((store) => {
        const original = IDBDatabase.prototype.transaction;
        IDBDatabase.prototype.transaction = function (stores, modo, ...args) {
          if (modo === 'readwrite' && Array.from(stores).includes('operacoes')) {
            IDBDatabase.prototype.transaction = original;
            const tx = original.call(this, store, 'readwrite'),
              s = tx.objectStore(store);
            if (store === 'operacoes') s.add({ id: 'adulterado-na-fronteira' });
            else {
              const q = s.get(['alice', 'sintetico', 1]);
              q.onsuccess = () => s.put({ ...q.result, criadoEm: '2026-01-01T00:00:00.000Z' });
            }
          }
          return original.call(this, stores, modo, ...args);
        };
      }, store);
      const r = await gravar(page);
      assert.equal(r.ok, false, JSON.stringify(r));
      const d = await dados(page);
      assert.equal(d.operacoes.length, store === 'operacoes' ? 1 : 0);
      if (store === 'operacoes') assert.equal(d.operacoes[0].id, 'adulterado-na-fronteira');
    }
  );
test('operacional: progresso alterado após add mas antes de complete aborta journal', async (t) => {
  const { page } = await vazio(t),
    k = await chave(page);
  await solicitar(page, await backupTexto(page));
  await confirmar(page);
  await page.evaluate((k) => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      const q = original.apply(this, args);
      if (this.name === 'operacoes')
        q.addEventListener('success', () => localStorage.setItem(k, '{}'));
      return q;
    };
  }, k);
  assert.equal((await gravar(page)).ok, false);
  assert.equal((await dados(page)).operacoes.length, 0);
});
async function abrirMotor(page, temporario = false) {
  if (!temporario) await cadastrar(page);
  return page.evaluate(
    async ({ p, temporario }) => {
      const s = window.LabCoordenador.criarSessao();
      window.motorSessao = s;
      if (temporario) {
        // Falha de identidade conduz ao modo temporário mantendo Web Locks reais disponíveis.
        const preparar = await s.preparar();
        if (preparar.codigo !== 'CONSENTIMENTO_NECESSARIO') return preparar;
        s.decidirTemporario(true);
        await s.carregarTemporario(JSON.stringify(p));
      } else await s.preparar();
      const adquirido = await s.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
      if (!adquirido.ok) return adquirido;
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
      if (!r.ok) return r;
      window.motorHandle = r.handle;
      return r.handle.abrir(s, 'principal');
    },
    { p: pacote(), temporario }
  );
}
test('operacional: memória órfã de outra aba conserva lock nativo após encerrar coordenador', async (t) => {
  const { ctx, page } = await vazio(t),
    outra = await ctx.newPage();
  await carregar(outra);
  assert.equal((await abrirMotor(outra)).ok, true);
  await outra.evaluate(() => window.motorSessao.encerrar());
  const r = await solicitar(page, await backupTexto(page));
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'ATIVIDADE_OCUPADA');
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  assert.equal((await dados(page)).operacoes.length, 0);
  await outra.close();
  await aguardarLiberacaoNativa(page);
  assert.equal((await operar(page, await backupTexto(page))).ok, true);
});
test('operacional: sessão temporária em outra aba também impede intenção até fechar seu contexto', async (t) => {
  const { ctx, page } = await vazio(t),
    outra = await ctx.newPage();
  await carregar(outra);
  status = 503;
  assert.equal((await abrirMotor(outra, true)).ok, true);
  status = 200;
  assert.equal((await solicitar(page, await backupTexto(page))).ok, false);
  await outra.close();
  await aguardarLiberacaoNativa(page);
  assert.equal((await operar(page, await backupTexto(page))).ok, true);
});
test('operacional: reserva exclusiva do journal impede abertura temporária tardia', async (t) => {
  const { ctx, page } = await vazio(t),
    outra = await ctx.newPage();
  await carregar(outra);
  assert.equal((await solicitar(page, await backupTexto(page))).ok, true);
  status = 503;
  const r = await abrirMotor(outra, true);
  status = 200;
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'MEMORIA_LAB_EM_USO');
  await confirmar(page);
  assert.equal((await gravar(page)).ok, true);
});

test('operacional: falha de reserva com API presente não libera execução temporária invisível', async (t) => {
  const { page } = await vazio(t);
  await page.evaluate(() => {
    navigator.locks.request = () => Promise.reject(new Error('Fixture'));
  });
  status = 503;
  const r = await abrirMotor(page, true);
  status = 200;
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'MEMORIA_NAO_OBSERVAVEL');
  assert.equal((await dados(page)).operacoes.length, 0);
});
