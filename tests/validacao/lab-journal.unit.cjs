/* global window, document, localStorage, Storage, navigator, indexedDB */
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
function pacote() {
  return {
    formato: 'lab-questionarios-v1',
    id: 'sintetico',
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
      {
        id: 'q2',
        bloco: 'Banco',
        titulo: 'Complete',
        instrucao: 'Use o banco: água, pedra.',
        tipo: 'campos',
        dica: 'Pense no que bebemos.',
        itens: [{ id: 'i2', pergunta: 'Bebemos qual item?', respostas: ['água'] }],
      },
    ],
  };
}
let server, browser, origem, copyId, status;
before(async () => {
  copyId = A;
  status = 200;
  server = http.createServer((req, res) => {
    if (req.url === '/__revisoes_local__/identity') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId }));
      return;
    }
    if (req.url.endsWith('.svg')) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end('<svg xmlns="http://www.w3.org/2000/svg"/>');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<!doctype html><section id="tela-gramatica-mariana"><nav class="migalhas"><strong>Gramática</strong></nav><span id="gramatica-nome-perfil"></span><div id="gramatica-progresso"><div id="gramatica-barra"></div></div><span id="gramatica-contador"></span><span id="gramatica-pontos"></span><div id="gramatica-conteudo"></div><button id="gramatica-voltar">Voltar</button><button id="gramatica-proxima">Próxima</button><div id="gramatica-modo-responsavel" hidden></div><div id="gramatica-faixa-modo-responsavel" hidden></div><button id="botao-inicio">Início</button></section>'
    );
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
async function carregar(page, url = origem) {
  await page.goto(url);
  await page.evaluate(() => {
    window.QuestionariosInteracoes = { aceita: () => false };
    window.GramaticaDitado = { parar() {}, configurar() {} };
  });
  for (const s of [
    'lab-validador.js',
    'lab-identidade.js',
    'lab-repositorio.js',
    'lab-progresso.js',
    'lab-coordenador.js',
    'armazenamento.js',
    'gramatica-questionarios.js',
    'lab-backup.js',
    'lab-restauracao.js',
    'lab-journal.js',
  ])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', s) });
}
async function preparar(page, temporario = false, entrada = pacote()) {
  return page.evaluate(
    async ({ p, temporario }) => {
      window.pacote = p;
      window.sessao = window.LabCoordenador.criarSessao();
      if (temporario) {
        Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
        const r = await window.sessao.preparar();
        if (r.codigo !== 'CONSENTIMENTO_NECESSARIO') throw new Error(r.codigo);
        window.sessao.decidirTemporario(true);
        await window.sessao.carregarTemporario(JSON.stringify(p));
      } else {
        const banco = await window.LabRepositorio.abrirRepositorio();
        try {
          const r = await banco.repositorio.cadastrar(JSON.stringify(p));
          if (!r.ok) throw new Error(r.codigo);
        } finally {
          banco.repositorio.fechar();
        }
        const r = await window.sessao.preparar();
        if (!r.ok) throw new Error(r.codigo);
      }
      const adquirido = await window.sessao.adquirir({
        perfil: p.perfil,
        id: p.id,
        versao: p.versao,
      });
      if (!adquirido.ok) throw new Error(adquirido.codigo);
      window.config = {
        id: 'lab-runtime',
        chave: null,
        aluno: p.perfil,
        nome: 'Fixture',
        materia: 'Ciências',
        titulo: p.titulo,
        questoes: p.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
      };
      const registro = window.QuestionariosRevisoes.registrarLab(() => window.config);
      if (!registro.ok) throw new Error(registro.codigo);
      window.h = registro.handle;
      return window.sessao.abrirProgresso('principal').canal.chave;
    },
    { p: entrada, temporario }
  );
}
async function contexto(t, temporario = false) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  const chave = await preparar(page, temporario);
  return { ctx, page, chave };
}
const abrir = (page, sessao = 'principal') =>
  page.evaluate((s) => window.h.abrir(window.sessao, s), sessao);
const consultar = (page) => page.evaluate(() => window.h.consultar());
const persistir = (page) => page.evaluate(() => window.h.persistir());
const opcao = (page, valor) => page.locator(`[data-opcao-gramatica="${valor}"]`).click();
const conferir = (page) => page.locator('[data-conferir-gramatica]').click();
const raw = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);

function inicial() {
  return {
    questaoAtual: 0,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    pontos: 0,
    finalizada: false,
    versao: 1,
    conferidas: {},
  };
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
async function fixture(page, p = pacote(), estados = { principal: inicial() }, preservar = false) {
  return page.evaluate(
    async ({ p, estados, preservar, copia }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      if (!v.valido) throw new Error('Fixture inválida');
      const sessoes = {};
      for (const [nome, snapshot] of Object.entries(estados))
        sessoes[nome] = {
          intencao: 'criar',
          base: { existe: false, hashTexto: null },
          snapshot,
          etapa: 'nao-iniciada',
          resultado: 'nao-comprovado',
        };
      return {
        formato: 'lab-journal-v1',
        versao: 1,
        id: window.crypto.randomUUID(),
        destino: { copyId: copia, origem: window.location.origin },
        estado: 'intencao-registrada',
        revisao: 0,
        atividades: [
          {
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: v.digest,
            conteudo: {
              intencao: preservar ? 'preservar' : 'criar',
              baseDigest: preservar ? v.digest : null,
              pacote: preservar ? null : v.canonico,
              etapa: 'nao-iniciada',
              resultado: 'nao-comprovado',
            },
            sessoes,
          },
        ],
        marcadores: {
          intencao: 'registrada',
          aplicacao: 'nao-iniciada',
          efeitos: 'nao-comprovados',
        },
      };
    },
    { p, estados, preservar, copia: copyId }
  );
}
// Seed exclusivo das fixtures: usa IDB nativo, não concede autorização à API de produção.
// Sucesso é entregue apenas por oncomplete; nada fora de operacoes é escrito.
async function instalarGravadorFixture(page) {
  await page.evaluate(async (copia) => {
    const aberto = await window.LabRepositorio.abrirRepositorio();
    if (!aberto.ok) throw new Error(aberto.codigo);
    aberto.repositorio.fechar();
    window.gravarFixtureJournal = (registros, modo = 'normal') =>
      new Promise((resolve) => {
        const r = indexedDB.open('revisoesEscolares.lab.' + copia + '.v1', 1);
        r.onerror = () => resolve({ ok: false, codigo: 'ABERTURA_FIXTURE' });
        r.onsuccess = () => {
          const db = r.result;
          const tx = db.transaction(['operacoes'], 'readwrite');
          const store = tx.objectStore('operacoes');
          let confirmouPedido = false;
          window.fixturePedidoAceito = false;
          window.fixtureCommit = false;
          tx.oncomplete = () => {
            window.fixtureCommit = true;
            db.close();
            resolve({ ok: true, confirmouPedido, evento: 'oncomplete' });
          };
          tx.onabort = () => {
            db.close();
            resolve({ ok: false, codigo: tx.error?.name || 'ABORTADA' });
          };
          tx.onerror = () => {};
          try {
            if (modo === 'quota') throw new window.DOMException('Fixture', 'QuotaExceededError');
            for (const registro of registros) {
              const q = store.add(registro);
              q.onsuccess = () => {
                confirmouPedido = true;
                window.fixturePedidoAceito = true;
                if (modo === 'abortar') tx.abort();
                if (modo === 'interromper') {
                  const manter = () => {
                    const prox = store.get(registro.id);
                    prox.onsuccess = manter;
                  };
                  manter();
                }
              };
            }
          } catch {
            tx.abort();
          }
        };
      });
  }, copyId);
}
async function semear(page, registros, modo = 'normal') {
  await instalarGravadorFixture(page);
  return page.evaluate(
    ({ registros, modo }) =>
      window.gravarFixtureJournal(Array.isArray(registros) ? registros : [registros], modo),
    { registros, modo }
  );
}
const inspecionar = (page) => page.evaluate(() => window.LabJournal.inspecionarPendencias());
async function analisar(page, registro) {
  return page.evaluate(async (texto) => {
    const a = await window.LabJournal.abrirJournal();
    if (!a.ok) return a;
    try {
      return await a.journal.inspecionarRegistro(texto);
    } finally {
      a.journal.fechar();
    }
  }, JSON.stringify(registro));
}
async function transicao(page, a, b) {
  return page.evaluate(
    async ({ a, b }) => {
      const r = await window.LabJournal.abrirJournal();
      if (!r.ok) return r;
      try {
        return await r.journal.avaliarTransicao(a, b);
      } finally {
        r.journal.fechar();
      }
    },
    { a: JSON.stringify(a), b: JSON.stringify(b) }
  );
}
async function conteudoEscolar(page) {
  return page.evaluate(async (copia) => {
    const db = await new Promise((resolve) => {
      const r = indexedDB.open('revisoesEscolares.lab.' + copia + '.v1', 1);
      r.onsuccess = () => resolve(r.result);
    });
    return new Promise((resolve) => {
      const tx = db.transaction(['pacotes', 'administracao'], 'readonly'),
        dados = {};
      for (const nome of ['pacotes', 'administracao']) {
        const r = tx.objectStore(nome).getAll();
        r.onsuccess = () => {
          dados[nome] = r.result;
        };
      }
      tx.oncomplete = () => {
        db.close();
        resolve({ ...dados, local: Object.entries(localStorage) });
      };
    });
  }, copyId);
}
async function textoBackup(page, p = pacote()) {
  return page.evaluate(async (p) => {
    const v = await window.LabValidador.validarPacote(JSON.stringify(p));
    return JSON.stringify({
      formato: 'lab-backup-v1',
      versao: 1,
      entradas: [{ pacote: p, digest: v.digest, situacaoAdministrativa: 'ativa', sessoes: {} }],
    });
  }, p);
}

test('fixture: intenção válida confirma apenas oncomplete e detecção não aplica dados', async (t) => {
  const { page } = await vazio(t);
  const registro = await fixture(page);
  const r = await semear(page, registro);
  assert.equal(r.ok, true);
  assert.equal(r.evento, 'oncomplete');
  assert.equal(r.confirmouPedido, true);
  const antes = await conteudoEscolar(page);
  const l = await inspecionar(page);
  assert.equal(l.ok, true, JSON.stringify(l));
  assert.equal(l.registros[0].situacao, 'pendente-valida');
  assert.equal(l.registros[0].presencaEmIndexedDBObservada, true);
  assert.equal(l.registros[0].estadoRegistro, 'intencao-registrada');
  assert.equal(l.criacaoOperacionalDisponivel, false);
  assert.equal(l.bloqueiaRestauracao, true);
  assert.equal(l.bloqueioGlobalLab, false);
  assert.deepEqual(await conteudoEscolar(page), antes);
});

test('processo Chromium fechado e reaberto reconhece pendência, sem recuperação automática', async () => {
  copyId = A;
  status = 200;
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const perfil = fs.mkdtempSync(path.join(ROOT, 'tmp/lab-journal-perfil-'));
  let ctx = await chromium.launchPersistentContext(perfil, { headless: true });
  try {
    let page = await ctx.newPage();
    await carregar(page);
    const r = await fixture(page);
    assert.equal((await semear(page, r)).ok, true);
    const antes = await inspecionar(page);
    await ctx.close();
    ctx = await chromium.launchPersistentContext(perfil, { headless: true });
    page = await ctx.newPage();
    await carregar(page);
    assert.deepEqual(await inspecionar(page), antes);
    assert.deepEqual(await inspecionar(page), antes);
    assert.deepEqual(await conteudoEscolar(page), { pacotes: [], administracao: [], local: [] });
  } finally {
    await ctx.close();
  }
  // Perfil sintético preservado em tmp, sem remoção.
});

test('fixture: ID repetido aborta add sem sobrescrever a intenção existente', async (t) => {
  const { page } = await vazio(t);
  const r = await fixture(page);
  await semear(page, r);
  const antes = await inspecionar(page);
  const alterado = structuredClone(r);
  alterado.estado = 'bloqueada';
  alterado.revisao = 3;
  assert.equal((await semear(page, alterado)).ok, false);
  assert.deepEqual(await inspecionar(page), antes);
});

test('transições são monotônicas, repetíveis, imutáveis no alvo e não operacionais', async (t) => {
  const { page } = await vazio(t);
  const a = await fixture(page);
  const b = structuredClone(a);
  b.estado = 'pendente';
  b.revisao = 1;
  assert.equal((await transicao(page, a, b)).coerente, true);
  assert.equal((await transicao(page, b, b)).repeticao, true);
  assert.equal((await transicao(page, b, a)).coerente, false);
  b.atividades[0].sessoes.principal.snapshot.respostas.q1 = ['Lua'];
  assert.equal((await transicao(page, a, b)).coerente, false);
  b.estado = 'concluida';
  b.revisao = 4;
  assert.equal((await transicao(page, a, b)).ok, false);
  assert.equal((await inspecionar(page)).registros.length, 0);
});

test('contrato recusa registro incompleto, versão futura, destino diferente e etapas inventadas', async (t) => {
  const { page } = await vazio(t);
  const base = await fixture(page);
  const casos = [
    [
      'REGISTRO_JOURNAL_INCOMPLETO',
      (r) => {
        delete r.marcadores;
      },
    ],
    [
      'VERSAO_JOURNAL_INCOMPATIVEL',
      (r) => {
        r.versao = 2;
        r.campoFuturo = true;
      },
    ],
    [
      'DESTINO_JOURNAL_DIVERGENTE',
      (r) => {
        r.destino.copyId = B;
      },
    ],
    [
      'ETAPAS_JOURNAL_INCOERENTES',
      (r) => {
        r.revisao = 1;
      },
    ],
    [
      'ETAPAS_JOURNAL_INCOERENTES',
      (r) => {
        r.marcadores.aplicacao = 'concluida';
      },
    ],
  ];
  for (const [codigo, mudar] of casos) {
    const r = structuredClone(base);
    mudar(r);
    assert.equal((await analisar(page, r)).codigo, codigo);
  }
});

test('registros incompletos ou corrompidos persistidos bloqueiam globalmente apenas o LAB', async (t) => {
  const { page } = await vazio(t);
  const r = await fixture(page);
  delete r.atividades;
  await semear(page, r);
  const l = await inspecionar(page);
  assert.equal(l.ok, true);
  assert.equal(l.bloqueioGlobalLab, true);
  assert.equal(l.registros[0].alcance, 'lab-inteiro');
  assert.equal(l.registros[0].situacao, 'registro-bloqueado');
  const plano = await page.evaluate(
    (texto) => window.LabRestauracao.prepararPlano(texto),
    await textoBackup(page)
  );
  assert.ok(plano.previa.entradas[0].bloqueios.includes('JOURNAL_NAO_LIBERADO_PARA_RESTAURACAO'));
});

test('payload adulterado, digest e snapshot incoerentes são bloqueados integralmente', async (t) => {
  const { page } = await vazio(t);
  const base = await fixture(page);
  for (const mudar of [
    (r) => {
      r.atividades[0].digest = B;
    },
    (r) => {
      r.atividades[0].sessoes.principal.snapshot.finalizada = true;
    },
    (r) => {
      r.atividades[0].conteudo.baseDigest = A;
    },
    (r) => {
      r.atividades[0].sessoes.principal.base.hashTexto = A;
    },
    (r) => {
      r.atividades[0].sessoes.principal.chave = 'privada';
    },
  ]) {
    const r = structuredClone(base);
    mudar(r);
    assert.equal((await analisar(page, r)).ok, false);
  }
  const r = structuredClone(base);
  r.atividades[0].sessoes.principal.snapshot.pontos = 1;
  await semear(page, r);
  assert.equal((await inspecionar(page)).bloqueioGlobalLab, true);
});

test('referência preservar revalida conteúdo existente sem duplicar pacote no journal', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
  });
  const r = await fixture(page, pacote(), {}, true);
  assert.equal(r.atividades[0].conteudo.pacote, null);
  await semear(page, r);
  const l = await inspecionar(page);
  assert.equal(l.bloqueioGlobalLab, false);
  assert.equal(l.registros[0].situacao, 'pendente-valida');
});

test('fixture: quota e abort transacional não produzem intenção persistida nem sucesso', async (t) => {
  const { page } = await vazio(t);
  const r = await fixture(page);
  assert.equal((await semear(page, r, 'quota')).ok, false);
  assert.equal((await inspecionar(page)).registros.length, 0);
  assert.equal((await semear(page, r, 'abortar')).ok, false);
  assert.equal((await inspecionar(page)).registros.length, 0);
});

test('interrupção real de aba durante transação ativa não deixa registro parcial', async (t) => {
  const { ctx, page } = await vazio(t);
  const r = await fixture(page);
  await instalarGravadorFixture(page);
  await page.evaluate((r) => {
    window.pendenteFixture = window.gravarFixtureJournal([r], 'interromper');
  }, r);
  await page.waitForFunction(() => window.fixturePedidoAceito === true);
  assert.equal(await page.evaluate(() => window.fixtureCommit), false);
  await page.close();
  const nova = await ctx.newPage();
  await carregar(nova);
  assert.equal((await inspecionar(nova)).registros.length, 0);
});

test('interrupção após commit mantém intenção mesmo sem aba ou lock', async (t) => {
  const { ctx, page } = await vazio(t);
  const r = await fixture(page);
  assert.equal((await semear(page, r)).ok, true);
  await page.close();
  const nova = await ctx.newPage();
  await carregar(nova);
  const l = await inspecionar(nova);
  assert.equal(l.registros[0].operacao, r.id);
  assert.equal(l.registros[0].exigeReconciliacao, true);
  assert.equal((await nova.evaluate(() => navigator.locks.query())).held.length, 0);
});

test('duas abas veem a mesma pendência e preparação operacional continua bloqueada', async (t) => {
  const { ctx, page } = await vazio(t);
  const a = await fixture(page);
  await semear(page, a);
  const outra = await ctx.newPage();
  await carregar(outra);
  assert.deepEqual(await inspecionar(outra), await inspecionar(page));
  const texto = await textoBackup(page);
  for (const p of [page, outra])
    assert.equal(
      (await p.evaluate((s) => window.LabJournal.prepararIntencao(s), texto)).codigo,
      'AUTORIZACAO_OPERACIONAL_INDISPONIVEL'
    );
  const b = await fixture(outra);
  await semear(outra, b);
  const l = await inspecionar(page);
  assert.equal(l.registros.length, 2);
  assert.equal(l.conflitos.length, 1);
  assert.equal(l.atividadesBloqueadas.length, 1);
});

test('atividades independentes mantêm bloqueios limitados às identidades afetadas', async (t) => {
  const { page } = await vazio(t);
  const a = await fixture(page);
  await semear(page, a);
  const p = pacote();
  p.id = 'outra-atividade';
  const texto = await textoBackup(page, p);
  const plano = await page.evaluate((s) => window.LabRestauracao.prepararPlano(s), texto);
  assert.equal(plano.ok, true);
  assert.equal(plano.previa.entradas[0].bloqueios.includes('JOURNAL_PENDENTE_NA_ATIVIDADE'), false);
  const b = await fixture(page, p);
  await semear(page, b);
  const l = await inspecionar(page);
  assert.equal(l.conflitos.length, 0);
  assert.equal(l.atividadesBloqueadas.length, 2);
});

test('duas cópias na mesma origem mantêm stores de operações separadas', async (t) => {
  const { page } = await vazio(t);
  const a = await fixture(page);
  await semear(page, a);
  copyId = B;
  assert.equal((await inspecionar(page)).registros.length, 0);
  const b = await fixture(page);
  await semear(page, b);
  assert.equal((await inspecionar(page)).registros[0].operacao, b.id);
  copyId = A;
  assert.equal((await inspecionar(page)).registros[0].operacao, a.id);
});

test('mudança de identidade suspende handle e não adota outro destino', async (t) => {
  const { page } = await vazio(t);
  await semear(page, await fixture(page));
  await page.evaluate(async () => {
    window.j = (await window.LabJournal.abrirJournal()).journal;
  });
  copyId = B;
  const r = await page.evaluate(() => window.j.inspecionarPendencias());
  assert.equal(r.ok, false);
  assert.equal(r.bloqueioGlobalLab, true);
  copyId = A;
  assert.equal(
    (await page.evaluate(() => window.j.inspecionarPendencias())).codigo,
    'JOURNAL_FECHADO'
  );
  assert.equal((await inspecionar(page)).registros.length, 1);
});

test('liberação real do lock de uma aba não encerra sua intenção persistida', async (t) => {
  const { ctx, page } = await contexto(t);
  const r = await fixture(page, pacote(), {}, true);
  await semear(page, r);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  await page.close();
  const nova = await ctx.newPage();
  await carregar(nova);
  assert.equal((await nova.evaluate(() => navigator.locks.query())).held.length, 0);
  const l = await inspecionar(nova);
  assert.equal(l.registros[0].operacao, r.id);
  assert.equal(l.bloqueiaRestauracao, true);
});

test('callback de inspeção revogada não reativa handle nem modifica registros', async (t) => {
  const { page } = await vazio(t);
  await semear(page, await fixture(page));
  await page.evaluate(async () => {
    window.j = (await window.LabJournal.abrirJournal()).journal;
  });
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await page.evaluate(() => {
    window.leituraAntiga = window.j.inspecionarPendencias();
  });
  const req = await aguardando;
  await page.evaluate(() => window.j.fechar());
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await page.evaluate(() => window.leituraAntiga)).ok, false);
  assert.equal((await inspecionar(page)).registros.length, 1);
});

test('versão incompatível, destino divergente e estados finais não ganham recuperação automática', async (t) => {
  const { page } = await vazio(t);
  const a = await fixture(page);
  a.versao = 9;
  await semear(page, a);
  const b = await fixture(page);
  b.destino.copyId = B;
  await semear(page, b);
  const c = await fixture(page);
  c.estado = 'concluida';
  c.revisao = 4;
  await semear(page, c);
  const l = await inspecionar(page);
  assert.equal(l.bloqueioGlobalLab, true);
  assert.equal(l.reconciliacaoAutomatica, false);
  assert.deepEqual(
    l.registros.map((r) => r.codigo).sort(),
    [
      'DESTINO_JOURNAL_DIVERGENTE',
      'ESTADO_JOURNAL_INCOMPATIVEL',
      'VERSAO_JOURNAL_INCOMPATIVEL',
    ].sort()
  );
});

test('falha de leitura é bloqueio global, sem tratar store inacessível como vazia', async (t) => {
  const { page } = await vazio(t);
  await semear(page, await fixture(page));
  await page.evaluate(() => {
    window.cursorOriginal = window.IDBObjectStore.prototype.openKeyCursor;
    window.IDBObjectStore.prototype.openKeyCursor = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  const r = await inspecionar(page);
  assert.equal(r.ok, false);
  assert.equal(r.bloqueioGlobalLab, true);
  await page.evaluate(() => {
    window.IDBObjectStore.prototype.openKeyCursor = window.cursorOriginal;
  });
  assert.equal((await inspecionar(page)).registros.length, 1);
});

test('referências de leitura são opacas e não aceitam ID arbitrário ou referência de outro handle', async (t) => {
  const { page } = await vazio(t);
  const r = await fixture(page);
  await semear(page, r);
  const v = await page.evaluate(async (id) => {
    const a = await window.LabRepositorio.abrirRepositorio(),
      b = await window.LabRepositorio.abrirRepositorio();
    try {
      const lista = await a.repositorio.listarOperacoesJournal();
      return [
        await a.repositorio.lerOperacaoJournal(id),
        await b.repositorio.lerOperacaoJournal(lista.referencias[0]),
        await a.repositorio.lerOperacaoJournal({}),
      ];
    } finally {
      a.repositorio.fechar();
      b.repositorio.fechar();
    }
  }, r.id);
  assert.ok(v.every((x) => !x.ok && x.codigo === 'IDENTIFICADOR_INVALIDO'));
});

test('sessões vizinhas e pontos históricos são validados sem escrita em dados escolares', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await opcao(page, 'Lua');
  await persistir(page);
  const estado = (await consultar(page)).progresso.estado;
  const r = await fixture(page, pacote(), { principal: estado, responsavel: inicial() }, true);
  await semear(page, r);
  const antes = await conteudoEscolar(page);
  await page.evaluate(() => {
    for (const nome of ['setItem', 'removeItem', 'clear'])
      Storage.prototype[nome] = () => {
        throw new Error('Não escrever');
      };
    for (const nome of ['add', 'put', 'delete', 'clear'])
      window.IDBObjectStore.prototype[nome] = () => {
        throw new Error('Não escrever');
      };
  });
  const l = await inspecionar(page);
  assert.equal(l.bloqueioGlobalLab, false);
  assert.equal(l.registros[0].atividades[0].sessoes.length, 2);
  assert.equal(JSON.parse(await raw(page, chave)).pontos, 1);
  assert.deepEqual(await conteudoEscolar(page), antes);
});

test('planejamento informa pendência na atividade, sem tocar revisão oficial ativa', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
  });
  await semear(page, await fixture(page));
  const texto = await textoBackup(page);
  await page.evaluate(() => {
    window.QuestionariosRevisoes.registrar({
      ...window.config,
      id: 'oficial',
      chave: 'fixture-oficial',
    });
    localStorage.setItem('fixture-vizinha', '{"preservar":true}');
    window.QuestionariosRevisoes.abrir('oficial');
  });
  await opcao(page, 'Lua');
  const antes = await page.evaluate(() => ({
    id: window.QuestionariosRevisoes.obterAtiva().id,
    html: document.getElementById('gramatica-conteudo').innerHTML,
    storage: Object.entries(localStorage),
  }));
  const plano = await page.evaluate((s) => window.LabRestauracao.prepararPlano(s), texto);
  assert.ok(plano.previa.entradas[0].bloqueios.includes('JOURNAL_PENDENTE_NA_ATIVIDADE'));
  assert.deepEqual(
    await page.evaluate(() => ({
      id: window.QuestionariosRevisoes.obterAtiva().id,
      html: document.getElementById('gramatica-conteudo').innerHTML,
      storage: Object.entries(localStorage),
    })),
    antes
  );
});

test('token 5A, associação forjada ou objeto de lock não autorizam criação operacional', async (t) => {
  const { page } = await vazio(t);
  const texto = await textoBackup(page);
  const r = await page.evaluate(async (s) => {
    const p = await window.LabRestauracao.prepararPlano(s);
    const casos = [
      await window.LabJournal.prepararIntencao(s),
      await window.LabJournal.prepararIntencao(s, p.plano),
      await window.LabJournal.prepararIntencao(s, { associado: true, lock: { mode: 'exclusive' } }),
    ];
    return {
      casos,
      chaves: Object.keys(window.LabJournal),
      banco: await window.LabJournal.inspecionarPendencias(),
    };
  }, texto);
  assert.ok(r.casos.every((x) => !x.ok && x.codigo === 'AUTORIZACAO_OPERACIONAL_INDISPONIVEL'));
  assert.equal(r.banco.registros.length, 0);
  assert.equal(r.chaves.includes('aplicar'), false);
});

test('mais de 32 operações e estruturas adversariais geram bloqueio global limitado', async (t) => {
  const { page } = await vazio(t);
  const base = await fixture(page);
  const registros = await page.evaluate(
    (r) => Array.from({ length: 33 }, () => ({ ...r, id: window.crypto.randomUUID() })),
    base
  );
  await semear(page, registros);
  const l = await inspecionar(page);
  assert.equal(l.ok, true);
  assert.equal(l.bloqueioGlobalLab, true);
  assert.equal(l.registros.length, 32);
  const extra = structuredClone(base);
  extra.privado = 'SEGREDO_SINTETICO';
  const r = await analisar(page, extra);
  assert.equal(r.ok, false);
  assert.equal(JSON.stringify(r).includes('SEGREDO_SINTETICO'), false);
});

test('diagnósticos nunca incluem gabarito, snapshots, chaves locais ou conteúdo bruto', async (t) => {
  const { page } = await vazio(t);
  const r = await fixture(page);
  await semear(page, r);
  const texto = JSON.stringify(await inspecionar(page));
  assert.equal(texto.includes('Sol'), false);
  assert.equal(texto.includes('respostas'), false);
  assert.equal(texto.includes('snapshot'), false);
  assert.equal(texto.includes('revisoesEscolares.lab.v1.'), false);
  assert.equal(texto.includes('conteudo'), false);
});

function ditadoJournal() {
  return {
    formato: 'lab-questionarios-v2',
    id: 'ditado-journal',
    versao: 1,
    perfil: 'alice',
    materia: 'ingles',
    titulo: 'cat',
    questoes: [
      {
        id: 'q1',
        bloco: 'cat',
        titulo: 'cat',
        instrucao: 'cat',
        tipo: 'ditado',
        idioma: 'en-US',
        itens: [{ id: 'i1', texto: 'cat' }],
      },
    ],
  };
}
async function contratoJournal(page, p = ditadoJournal()) {
  return page.evaluate(
    async ({ p, copyId }) => {
      const v = await window.LabValidador.reconhecerPacote(JSON.stringify(p));
      if (!v.valido) throw new Error('Contrato sintético inválido');
      return {
        formato: 'lab-journal-v1',
        versao: 1,
        id: window.crypto.randomUUID(),
        destino: { copyId, origem: window.location.origin },
        estado: 'intencao-registrada',
        revisao: 0,
        atividades: [
          {
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: v.digest,
            conteudo: {
              intencao: 'criar',
              baseDigest: null,
              pacote: v.canonico,
              etapa: 'nao-iniciada',
              resultado: 'nao-comprovado',
            },
            sessoes: {
              principal: {
                intencao: 'criar',
                base: { existe: false, hashTexto: null },
                snapshot: {
                  versao: 1,
                  questaoAtual: 0,
                  respostas: {},
                  corrigidas: {},
                  pontuadas: {},
                  conferidas: {},
                  pontos: 0,
                  finalizada: false,
                },
                etapa: 'nao-iniciada',
                resultado: 'nao-comprovado',
              },
            },
          },
        ],
        marcadores: {
          intencao: 'registrada',
          aplicacao: 'nao-iniciada',
          efeitos: 'nao-comprovados',
        },
      };
    },
    { p, copyId: A }
  );
}
const analisarJournal = (page, r, bases) =>
  page.evaluate(
    async ({ r, bases }) =>
      window.LabJournal.analisarContratoJournal(JSON.stringify(r), r.destino, bases),
    { r, bases }
  );

test('6C.1 journal reconhece v1/v2 e estados interrompidos/terminais sem mudar o registro', async (t) => {
  const { page } = await vazio(t);
  for (const p of [pacote(), ditadoJournal()]) {
    const r = await contratoJournal(page, p);
    const inicial = await analisarJournal(page, r);
    assert.equal(inicial.ok, true, JSON.stringify(inicial));
    assert.equal(inicial.admissaoOperacional, false);
    assert.equal(inicial.restauracaoAutorizada, false);
    assert.deepEqual(inicial.registro, r);
    const pendente = structuredClone(r);
    pendente.estado = 'pendente';
    pendente.revisao = 1;
    pendente.marcadores.aplicacao = 'em-andamento';
    pendente.atividades[0].conteudo.etapa = 'escrita-solicitada';
    assert.equal((await analisarJournal(page, pendente)).ok, true);
    for (const aplicacao of ['em-reconciliacao', 'em-retomada']) {
      const interrompido = structuredClone(pendente);
      interrompido.marcadores.aplicacao = aplicacao;
      assert.equal((await analisarJournal(page, interrompido)).ok, true);
    }
    const concluido = structuredClone(r);
    concluido.estado = 'aplicacao-concluida';
    concluido.revisao = 4;
    concluido.marcadores.aplicacao = 'concluida';
    concluido.marcadores.efeitos = 'verificados-por-leitura';
    for (const passo of [
      concluido.atividades[0].conteudo,
      concluido.atividades[0].sessoes.principal,
    ]) {
      passo.etapa = 'resultado-confirmado';
      passo.resultado = 'criacao-observada';
    }
    assert.equal((await analisarJournal(page, concluido)).ok, true);
    const terminal = structuredClone(r);
    terminal.estado = 'cancelada-sem-aplicacao';
    terminal.revisao = 5;
    terminal.encerramento = {
      versao: 1,
      efeito: 'sem-aplicacao',
      pacote: r.atividades[0].conteudo.pacote,
    };
    assert.equal((await analisarJournal(page, terminal)).ok, true);
  }
});

test('6C.1 journal revalida canônico/digest, vínculo, snapshot e terminal em análise', async (t) => {
  const { page } = await vazio(t);
  const r = await contratoJournal(page);
  const mutacoes = [
    (v) => {
      v.atividades[0].digest = '0'.repeat(64);
    },
    (v) => {
      v.atividades[0].conteudo.pacote += ' ';
    },
    (v) => {
      v.atividades[0].materia = 'ciencias';
    },
    (v) => {
      v.atividades[0].sessoes.principal.snapshot.pontos = 1;
    },
    (v) => {
      v.atividades[0].sessoes.responsavel = {
        ...v.atividades[0].sessoes.principal,
        snapshot: { ...v.atividades[0].sessoes.principal.snapshot, questaoAtual: 1 },
      };
    },
    (v) => {
      v.atividades[0].conteudo.pacote = v.atividades[0].conteudo.pacote.replace(
        'lab-questionarios-v2',
        'lab-questionarios-v3'
      );
    },
    (v) => {
      v.estado = 'cancelada-sem-aplicacao';
      v.revisao = 5;
      v.encerramento = { versao: 1, efeito: 'sem-aplicacao', pacote: '{}' };
    },
    (v) => {
      v.atividades[0].sessoes.principal.snapshot.sessao = 'principal';
    },
  ];
  for (const mutar of mutacoes) {
    const d = structuredClone(r);
    mutar(d);
    const antes = JSON.stringify(d);
    const a = await analisarJournal(page, d);
    assert.equal(a.ok, false, JSON.stringify(a));
    assert.equal(Object.hasOwn(a, 'registro'), false);
    assert.equal(JSON.stringify(d), antes);
  }
});

test('6C.1 base preservada exige pacote original revalidado, sem consultar banco real', async (t) => {
  const { page } = await vazio(t);
  const r = await contratoJournal(page);
  const a = r.atividades[0];
  const p = JSON.parse(a.conteudo.pacote);
  a.conteudo.intencao = 'preservar';
  a.conteudo.baseDigest = a.digest;
  a.conteudo.pacote = null;
  assert.equal((await analisarJournal(page, r)).ok, false);
  const e = { pacote: p, digest: a.digest, situacaoAdministrativa: 'ativa', sessoes: {} };
  const bases = { formato: 'lab-backup-v1', versao: 1, entradas: [e] };
  assert.equal((await analisarJournal(page, r, JSON.stringify(bases))).ok, true);
  e.digest = '0'.repeat(64);
  assert.equal((await analisarJournal(page, r, JSON.stringify(bases))).ok, false);
});

test('6C.2 reconhecimento não concede autorização e plano com digest divergente não escreve', async (t) => {
  const { page } = await vazio(t);
  const r = await contratoJournal(page);
  const a = r.atividades[0];
  const b = JSON.stringify({
    formato: 'lab-backup-v1',
    versao: 1,
    entradas: [
      {
        pacote: JSON.parse(a.conteudo.pacote),
        digest: a.digest,
        situacaoAdministrativa: 'ativa',
        sessoes: { principal: a.sessoes.principal.snapshot },
      },
    ],
  });
  const resultado = await page.evaluate(
    async ({ r, b }) => {
      const efeitos = [];
      indexedDB.open = () => {
        efeitos.push('indexedDB');
        throw new Error('IO indevido');
      };
      Storage.prototype.setItem = () => {
        efeitos.push('progresso');
        throw new Error('IO indevido');
      };
      const analise = await window.LabBackup.analisarContratoBackup(b);
      const registro = await window.LabJournal.analisarContratoJournal(
        JSON.stringify(r),
        r.destino
      );
      const invalido = JSON.parse(b);
      invalido.entradas[0].digest = '0'.repeat(64);
      const plano = await window.LabRestauracao.prepararPlano(JSON.stringify(invalido));
      const intencao = await window.LabJournal.prepararIntencao(b, registro);
      const operacional = await window.LabBackup.validarBackup(b);
      return { analise, registro, plano, intencao, operacional, efeitos };
    },
    { r, b }
  );
  assert.equal(resultado.analise.valido, true);
  assert.equal(resultado.registro.ok, true);
  assert.equal(resultado.plano.codigo, 'BACKUP_INVALIDO');
  assert.equal(resultado.intencao.ok, false);
  assert.equal(resultado.operacional.valido, true);
  assert.deepEqual(resultado.efeitos, []);
});

test('6C.1 memória analisável acima de 256 KiB não constitui transporte durável de journal', async (t) => {
  const { page } = await vazio(t);
  const p = ditadoJournal();
  p.questoes = Array.from({ length: 30 }, (_, i) => ({
    ...p.questoes[0],
    id: 'q' + i,
    itens: Array.from({ length: 6 }, (_, j) => ({ id: 'i' + i + '-' + j, texto: 'cat' })),
  }));
  const r = await contratoJournal(page, p);
  const s = r.atividades[0].sessoes.principal.snapshot;
  for (const q of p.questoes) s.respostas[q.id] = q.itens.map(() => '\u0000'.repeat(1000));
  assert.ok(Buffer.byteLength(JSON.stringify(s)) > 262144);
  const memoria = await page.evaluate(
    async ({ p, s }) => {
      const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(JSON.stringify(p));
      return c.validarSnapshot('principal', s);
    },
    { p, s }
  );
  assert.equal(memoria.ok, true);
  assert.deepEqual(memoria.snapshot, s);
  assert.equal(memoria.restauracaoAutorizada, false);
  const a = await analisarJournal(page, r);
  assert.equal(a.ok, false);
  assert.equal(a.codigo, 'LIMITE_SNAPSHOT_JOURNAL');
});

test('6C.1 backup analítico preserva as duas sessões v2 e recusa inconsistência integralmente', async (t) => {
  const { page } = await vazio(t);
  const r = await contratoJournal(page);
  const a = r.atividades[0];
  const principal = {
    ...inicial(),
    respostas: { q1: ['cat'] },
    corrigidas: { q1: true },
    conferidas: { q1: true },
    pontuadas: { q1: true },
    pontos: 1,
    finalizada: true,
  };
  const responsavel = { ...inicial(), respostas: { q1: ['dog'] }, conferidas: { q1: true } };
  const b = {
    formato: 'lab-backup-v1',
    versao: 1,
    entradas: [
      {
        pacote: JSON.parse(a.conteudo.pacote),
        digest: a.digest,
        situacaoAdministrativa: 'ativa',
        sessoes: { principal, responsavel },
      },
    ],
  };
  const antes = JSON.stringify(b);
  const resultado = await page.evaluate(async (b) => {
    const x = await window.LabBackup.analisarContratoBackup(JSON.stringify(b));
    const y = await window.LabBackup.analisarContratoBackup(x.json);
    b.entradas[0].sessoes.responsavel.corrigidas = { q1: true };
    const ruim = await window.LabBackup.analisarContratoBackup(JSON.stringify(b));
    return { x, y, ruim };
  }, b);
  assert.equal(resultado.x.valido, true);
  assert.equal(resultado.x.json, resultado.y.json);
  assert.deepEqual(resultado.x.backupNormalizado.entradas[0].sessoes, { principal, responsavel });
  assert.equal(JSON.stringify(b), antes);
  assert.equal(resultado.ruim.valido, false);
  assert.equal(resultado.ruim.erros[0].codigo, 'SNAPSHOT_BACKUP_INVALIDO');
  assert.equal(Object.hasOwn(resultado.ruim, 'backupNormalizado'), false);
});
