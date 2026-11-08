/* global window, document, localStorage, Storage, navigator */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
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
async function carregar(page) {
  await page.goto(origem);
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

async function capturar(page, nome) {
  return page.evaluate((n) => {
    const r = window.LabBackup.capturar(window.h);
    if (!r.ok) throw new Error(r.codigo);
    window.capturas = window.capturas || {};
    window.capturas[n] = r.captura;
    return r.resumo;
  }, nome);
}
const construir = (page, grupos = [['principal']]) =>
  page.evaluate(
    (g) =>
      window.LabBackup.construirBackup(
        g.map((nomes) => ({
          situacaoAdministrativa: 'ativa',
          capturas: nomes.map((n) => window.capturas[n]),
        }))
      ),
    grupos
  );
const validar = (page, texto) => page.evaluate((s) => window.LabBackup.validarBackup(s), texto);
async function concluir(page) {
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('água');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await persistir(page);
}

test('Chromium: captura só do pacote exige coordenador autêntico e não inventa sessões vazias', async (t) => {
  const { page, chave } = await contexto(t);
  const r = await page.evaluate(async () => {
    const captura = await window.LabBackup.capturarPacote(window.sessao);
    if (!captura.ok) throw new Error(captura.codigo);
    return window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [captura.captura] },
    ]);
  });
  assert.equal(r.valido, true, JSON.stringify(r));
  assert.deepEqual(r.backupNormalizado.entradas[0].sessoes, {});
  assert.deepEqual(r.capturasSomenteMemoria, []);
  assert.equal(await raw(page, chave), null);
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva()), null);
  assert.equal(
    (await page.evaluate(() => window.LabBackup.capturarPacote({ ...window.sessao }))).ok,
    false
  );
  await page.evaluate(() => window.sessao.liberar());
  assert.equal(
    (await page.evaluate(() => window.LabBackup.capturarPacote(window.sessao))).ok,
    false
  );
});

test('Chromium: dois perfis, duas sessões, parcial/concluída e ida e volta determinística', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await capturar(page, 'alice-principal');
  await page.evaluate(() => window.h.desativar());
  await abrir(page, 'responsavel');
  await opcao(page, 'Lua');
  await conferir(page);
  await persistir(page);
  await capturar(page, 'alice-responsavel');
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
  });
  const m = pacote();
  m.perfil = 'mariana';
  m.id = 'mariana-fixture';
  m.materia = 'matematica';
  await preparar(page, false, m);
  await abrir(page);
  await concluir(page);
  await capturar(page, 'mariana-principal');
  await page.evaluate(() => window.h.desativar());
  await abrir(page, 'responsavel');
  await capturar(page, 'mariana-responsavel');
  const antes = await consultar(page);
  const grupos = [
    ['mariana-responsavel', 'mariana-principal'],
    ['alice-responsavel', 'alice-principal'],
  ];
  const r = await construir(page, grupos);
  assert.equal(r.valido, true, JSON.stringify(r));
  assert.equal(r.previa.totalAtividades, 2);
  const [a, b] = r.backupNormalizado.entradas;
  assert.equal(a.pacote.perfil, 'alice');
  assert.equal(b.pacote.perfil, 'mariana');
  assert.equal(a.sessoes.principal.pontos, 1);
  assert.equal(a.sessoes.responsavel.pontos, 0);
  assert.equal(b.sessoes.principal.finalizada, true);
  assert.equal(b.sessoes.responsavel.finalizada, false);
  assert.deepEqual(await consultar(page), antes);
  assert.equal((await validar(page, r.json)).json, r.json);
  assert.equal(
    (
      await page.evaluate(
        (texto) => window.LabBackup.validarBackup(new window.TextEncoder().encode(texto)),
        r.json
      )
    ).json,
    r.json
  );
  const novamente = await construir(
    page,
    grupos
      .slice()
      .reverse()
      .map((g) => g.slice().reverse())
  );
  assert.equal(novamente.json, r.json);
});

test('Chromium: edição após ponto mantém histórico sem converter resposta atual em acerto', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await opcao(page, 'Lua');
  await persistir(page);
  await capturar(page, 'principal');
  const r = await construir(page);
  assert.equal(r.valido, true);
  const s = r.backupNormalizado.entradas[0].sessoes.principal;
  assert.equal(s.pontos, 1);
  assert.equal(s.pontuadas.q1, true);
  assert.equal(s.corrigidas.q1, undefined);
  assert.deepEqual(s.respostas.q1, ['Lua']);
  assert.deepEqual((await validar(page, r.json)).backupNormalizado, r.backupNormalizado);
});

test('Chromium: quota mantém captura recente e sinaliza memória sem gravação implícita', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await page.evaluate(() => {
    window.escritas = 0;
    Storage.prototype.setItem = () => {
      ++window.escritas;
      throw new window.DOMException('Fixture', 'QuotaExceededError');
    };
  });
  await opcao(page, 'Lua');
  await conferir(page);
  assert.equal((await persistir(page)).ok, false);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, false);
  const resumo = await capturar(page, 'principal');
  const antes = await page.evaluate(() => window.escritas);
  const r = await construir(page);
  assert.equal(r.valido, true, JSON.stringify(r));
  assert.equal(resumo.somenteMemoria, true);
  assert.equal(r.capturasSomenteMemoria[0].sessao, 'principal');
  assert.deepEqual(r.backupNormalizado.entradas[0].sessoes.principal.respostas.q1, ['Lua']);
  assert.equal(Object.hasOwn(r.backupNormalizado.entradas[0], 'durabilidade'), false);
  assert.equal(await page.evaluate(() => window.escritas), antes);
  assert.equal(await raw(page, chave), null);
});

test('Chromium: temporário consentido constrói backup inteiramente em memória', async (t) => {
  const { page } = await contexto(t, true);
  await page.evaluate(() =>
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Não acessar');
      },
    })
  );
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await capturar(page, 'principal');
  const r = await construir(page);
  assert.equal(r.valido, true, JSON.stringify(r));
  assert.equal(r.capturasSomenteMemoria.length, 1);
  assert.equal(r.backupNormalizado.entradas[0].sessoes.principal.pontos, 1);
});

test('Chromium: escrita pendente não bloqueia construção nem substitui a captura já obtida', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  // Este cenário mantém a autorização pendente, sem expirar. O relógio controlado
  // separa essa condição da carga da suíte; a expiração real do contrato é coberta abaixo.
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let consultasIdentidade = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    // Só a primeira gravação é retida. A edição coalescida deve consultar o servidor,
    // mesmo se sua requisição chegar antes de remover o handler.
    if (++consultasIdentidade === 1) chegou(route);
    else return route.continue();
  });
  await opcao(page, 'Sol');
  const req = await aguardando;
  assert.equal((await consultar(page)).progresso.pendente, true);
  await capturar(page, 'principal');
  await opcao(page, 'Lua');
  const r = await construir(page);
  assert.equal(r.valido, true);
  assert.equal(r.capturasSomenteMemoria.length, 1);
  assert.deepEqual(r.backupNormalizado.entradas[0].sessoes.principal.respostas.q1, ['Sol']);
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
  assert.equal((await consultar(page)).progresso.pendente, true);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  assert.equal(await raw(page, chave), null);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const persistencia = await persistir(page);
  assert.equal(persistencia.ok, true, JSON.stringify({ consultasIdentidade, persistencia }));
  assert.deepEqual(JSON.parse(await raw(page, chave)).respostas.q1, ['Lua']);
  assert.ok(consultasIdentidade >= 2);
  await page.unrouteAll();
  await page.clock.resume();
  assert.equal((await construir(page)).json, r.json);
});

test('Chromium: autorização pendente expira em três segundos sem editar ou persistir após suspensão', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  await page.evaluate(() => {
    window.escritas = 0;
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (...args) {
      ++window.escritas;
      return set.apply(this, args);
    };
  });
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await opcao(page, 'Sol');
  const req = await aguardando;
  await capturar(page, 'principal');
  const antes = await construir(page);
  assert.equal(antes.valido, true);
  await page.clock.runFor(2999);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  assert.equal((await consultar(page)).progresso.pendente, true);
  await page.clock.runFor(1);
  const situacao = await page.evaluate(() => window.sessao.obterSituacao());
  assert.equal(situacao.estado, 'suspensa');
  assert.equal(situacao.motivo, 'IDENTIDADE_INDISPONIVEL');
  await opcao(page, 'Lua');
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Sol']);
  assert.equal((await consultar(page)).progresso.pendente, false);
  assert.equal((await page.evaluate(() => window.LabBackup.capturar(window.h))).ok, false);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await persistir(page)).ok, false);
  assert.equal(await raw(page, chave), null);
  assert.equal(await page.evaluate(() => window.escritas), 0);
  assert.equal((await construir(page)).json, antes.json);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'suspensa');
});

test('Chromium: tokens não são forjáveis e capturas da mesma sessão não são fundidas', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await capturar(page, 'principal');
  await capturar(page, 'repetida');
  assert.equal(
    (await construir(page, [['principal', 'repetida']])).erros[0].codigo,
    'SESSAO_BACKUP_REPETIDA'
  );
  const r = await page.evaluate(async () => {
    let acessos = 0;
    const falsa = window.LabBackup.capturar({
      exportarSnapshot() {
        ++acessos;
        return {};
      },
    });
    const token = JSON.parse(JSON.stringify(window.capturas.principal));
    const montado = await window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [token] },
    ]);
    return { falsa, acessos, montado };
  });
  assert.equal(r.falsa.ok, false);
  assert.equal(r.acessos, 0);
  assert.equal(r.montado.valido, false);
});

test('Chromium: capturas conflitantes de mesmo ID/versão nunca se misturam', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await capturar(page, 'primeira');
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
  });
  const p = pacote();
  p.titulo = 'Outro digest';
  await preparar(page, true, p);
  await abrir(page);
  await capturar(page, 'segunda');
  assert.equal(
    (await construir(page, [['primeira', 'segunda']])).erros[0].codigo,
    'CAPTURAS_LAB_INCOMPATIVEIS'
  );
  assert.equal(
    (await construir(page, [['primeira'], ['segunda']])).erros[0].codigo,
    'IDENTIDADE_BACKUP_CONFLITANTE'
  );
});

test('Chromium: prévia não depende de atividade aberta nem altera registros oficiais', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await concluir(page);
  await capturar(page, 'principal');
  const backup = await construir(page);
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
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
    ativa: window.QuestionariosRevisoes.obterAtiva().id,
    estado: window.QuestionariosRevisoes.obterEstado('oficial'),
    html: document.getElementById('gramatica-conteudo').innerHTML,
    storage: Object.entries(localStorage),
  }));
  await page.evaluate(() => {
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      get() {
        throw new Error('Não abrir banco');
      },
    });
    window.fetch = () => {
      throw new Error('Não consultar rede');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Não escrever');
    };
  });
  const r = await validar(page, backup.json);
  assert.equal(r.valido, true, JSON.stringify(r));
  const previa = await page.evaluate((s) => window.LabBackup.inspecionarBackup(s), backup.json);
  assert.equal(JSON.stringify(previa).includes('respostas'), false);
  const depois = await page.evaluate(() => ({
    ativa: window.QuestionariosRevisoes.obterAtiva().id,
    estado: window.QuestionariosRevisoes.obterEstado('oficial'),
    html: document.getElementById('gramatica-conteudo').innerHTML,
    storage: Object.entries(localStorage),
  }));
  assert.deepEqual(depois, antes);
  assert.equal(
    await page.evaluate(() => window.QuestionariosRevisoes.obterRevisao('lab-runtime')),
    null
  );
});

test('Chromium: snapshots incoerentes são recusados sem reparação ou aplicação', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await capturar(page, 'principal');
  const bom = await construir(page);
  const antes = await raw(page, chave);
  const mudancas = [
    (s) => {
      s.versao = 2;
    },
    (s) => {
      s.questaoAtual = 99;
    },
    (s) => {
      s.pontos = 0;
    },
    (s) => {
      s.finalizada = true;
    },
    (s) => {
      s.respostas.q1 = ['Lua'];
    },
    (s) => {
      s.respostas.outra = ['Sol'];
    },
    (s) => {
      s.respostas.q1 = ['Sol', 'Lua'];
    },
    (s) => {
      s.conferidas.q1 = false;
    },
    (s) => {
      delete s.pontuadas.q1;
    },
    (s) => {
      s.vinculo = { sessao: 'responsavel' };
    },
    (s) => {
      s.chave = 'privada';
    },
    (s) => {
      s.copyId = 'a'.repeat(64);
    },
  ];
  for (const mudar of mudancas) {
    const d = structuredClone(bom.backupNormalizado);
    mudar(d.entradas[0].sessoes.principal);
    const r = await validar(page, JSON.stringify(d));
    assert.equal(r.valido, false);
    assert.equal(r.erros[0].codigo, 'SNAPSHOT_BACKUP_INVALIDO');
    assert.equal(Object.hasOwn(r, 'backupNormalizado'), false);
  }
  assert.equal(await raw(page, chave), antes);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
});

test('Chromium: sessão declarada em chave inválida ou envelope com vínculo arbitrário é recusado', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await capturar(page, 'principal');
  const bom = await construir(page);
  for (const nome of ['outra', 'Principal', 'alice']) {
    const d = structuredClone(bom.backupNormalizado);
    d.entradas[0].sessoes = { [nome]: d.entradas[0].sessoes.principal };
    assert.equal(
      (await validar(page, JSON.stringify(d))).erros[0].codigo,
      'SESSOES_BACKUP_INVALIDAS'
    );
  }
  const d = structuredClone(bom.backupNormalizado);
  const snapshot = d.entradas[0].sessoes.principal;
  d.entradas[0].sessoes.principal = {
    vinculo: { perfil: 'mariana', sessao: 'responsavel' },
    snapshot,
  };
  assert.equal(
    (await validar(page, JSON.stringify(d))).erros[0].codigo,
    'SNAPSHOT_BACKUP_INVALIDO'
  );
});

test('Chromium: contexto puro do motor revalida pacote sem criar registro ou execução', async (t) => {
  const { page } = await contexto(t);
  const r = await page.evaluate(async () => {
    const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(
      JSON.stringify(window.pacote)
    );
    const invalido = await window.QuestionariosRevisoes.criarValidadorSnapshotLab({
      digest: 'a'.repeat(64),
      pacote: window.pacote,
    });
    const alterado = { ...window.pacote, copyId: 'x' };
    const errado = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(
      JSON.stringify(alterado)
    );
    return {
      ok: c.ok,
      invalido,
      errado,
      semRegistro: window.QuestionariosRevisoes.obterAtiva() === null,
      sessaoErrada: c.validarSnapshot('outra', {}),
      estadoInvalido: c.validarSnapshot('principal', {}),
    };
  });
  assert.equal(r.ok, true);
  assert.equal(r.invalido.ok, false);
  assert.equal(r.errado.ok, false);
  assert.equal(r.semRegistro, true);
  assert.equal(r.sessaoErrada.ok, false);
  assert.equal(r.estadoInvalido.ok, false);
});

test('Chromium: limite de respostas do snapshot difere do gabarito declarativo e não trunca a entrada', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('x'.repeat(1000));
  await persistir(page);
  await capturar(page, 'principal');
  const bom = await construir(page);
  assert.equal(bom.valido, true);
  assert.equal(bom.backupNormalizado.entradas[0].sessoes.principal.respostas.q2[0].length, 1000);
  const grande = structuredClone(bom.backupNormalizado);
  grande.entradas[0].sessoes.principal.respostas.q2[0] += 'x';
  assert.equal((await validar(page, JSON.stringify(grande))).valido, false);
  const pacoteErrado = structuredClone(bom.backupNormalizado);
  pacoteErrado.entradas[0].pacote.questoes[1].itens[0].respostas = ['x'.repeat(1000)];
  assert.equal(
    (await validar(page, JSON.stringify(pacoteErrado))).erros[0].codigo,
    'PACOTE_BACKUP_INVALIDO'
  );
});

test('Chromium: Unicode quebrado pelo corte do motor é recusado no backup sem perder memória', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('x' + '😀'.repeat(500));
  await persistir(page);
  const antes = (await consultar(page)).progresso.estado;
  assert.equal(antes.respostas.q2[0].length, 1000);
  await capturar(page, 'principal');
  const r = await construir(page);
  assert.equal(r.valido, false);
  assert.equal(r.erros[0].codigo, 'UNICODE_INVALIDO');
  assert.deepEqual((await consultar(page)).progresso.estado, antes);
});

test('Chromium: revogação ou perda conhecida de identidade impede nova captura', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  copyId = B;
  await opcao(page, 'Lua');
  await persistir(page);
  assert.equal((await page.evaluate(() => window.LabBackup.capturar(window.h))).ok, false);
  assert.equal(
    (await page.evaluate(() => window.LabBackup.capturarPacote(window.sessao))).ok,
    false
  );
});

test('Chromium: captura antiga permanece independente após edição, fechamento e mutação do resultado', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await capturar(page, 'principal');
  await opcao(page, 'Lua');
  await persistir(page);
  await page.evaluate(async () => {
    await window.h.liberar();
    await window.sessao.encerrar();
  });
  const a = await construir(page);
  assert.equal(a.valido, true);
  assert.deepEqual(a.backupNormalizado.entradas[0].sessoes.principal.respostas.q1, ['Sol']);
  a.backupNormalizado.entradas[0].sessoes.principal.respostas.q1[0] = 'Lua';
  const b = await construir(page);
  assert.deepEqual(b.backupNormalizado.entradas[0].sessoes.principal.respostas.q1, ['Sol']);
  assert.equal(
    (await page.evaluate(() => window.LabBackup.capturar(window.h))).codigo,
    'HANDLE_LIBERADO'
  );
});
