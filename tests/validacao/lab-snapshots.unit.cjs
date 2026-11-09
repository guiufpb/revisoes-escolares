/* global window, document, localStorage, Storage, navigator, indexedDB */
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

const exportar = (page) => page.evaluate(() => window.h.exportarSnapshot());
const prever = (page, entrada) => page.evaluate((dado) => window.h.validarSnapshot(dado), entrada);
const envelope = ({ vinculo, snapshot }) => ({ vinculo, snapshot });
async function idaVolta(page) {
  const captura = await exportar(page);
  assert.equal(captura.ok, true, JSON.stringify(captura));
  const entrada = envelope(captura);
  const antes = JSON.stringify(entrada);
  const analise = await prever(page, entrada);
  assert.equal(analise.ok, true, JSON.stringify(analise));
  assert.deepEqual(analise.snapshot, captura.snapshot);
  assert.deepEqual(analise.vinculo, captura.vinculo);
  assert.equal(analise.restauracaoAutorizada, false);
  assert.equal(JSON.stringify(entrada), antes);
  assert.deepEqual((await consultar(page)).progresso.estado, captura.snapshot);
  return captura;
}
async function concluir(page) {
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('água');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
}

test('exportar exige handle próprio, execução e sessão autorizada', async (t) => {
  const { page } = await contexto(t);
  assert.equal((await exportar(page)).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
  const recusas = await page.evaluate(() => [
    window.h.exportarSnapshot.call({}),
    window.h.validarSnapshot.call({}, {}),
    window.h.exportarSnapshot('oficial'),
    window.h.validarSnapshot(),
    window.h.validarSnapshot({}, {}),
  ]);
  assert.ok(recusas.every((r) => !r.ok));
  await abrir(page);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await exportar(page)).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
});

test('não iniciada: formato fechado, cópia independente, determinismo e nenhuma escrita', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  const a = await idaVolta(page);
  assert.deepEqual(a.snapshot, {
    questaoAtual: 0,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    pontos: 0,
    finalizada: false,
    versao: 1,
    conferidas: {},
  });
  assert.deepEqual(await exportar(page), a);
  assert.equal(a.durabilidade.naoDuravel, true);
  assert.equal(await raw(page, chave), null);
  await page.evaluate(() => {
    const c = window.h.exportarSnapshot();
    c.snapshot.pontos = 2;
    c.snapshot.respostas.q1 = ['Lua'];
    c.vinculo.perfil = 'mariana';
    c.durabilidade.resultado.ok = false;
  });
  assert.deepEqual(await exportar(page), a);
  assert.equal(await raw(page, chave), null);
});

test('parcial: resposta correta sem conferência não fabrica ponto', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  const c = await idaVolta(page);
  assert.deepEqual(c.snapshot.respostas, { q1: ['Sol'] });
  assert.equal(c.snapshot.pontos, 0);
  assert.deepEqual(c.snapshot.corrigidas, {});
});

test('conferir vazio é legítimo sem criar array de respostas ou ponto', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await conferir(page);
  const c = await idaVolta(page);
  assert.deepEqual(c.snapshot.respostas, {});
  assert.deepEqual(c.snapshot.conferidas, { q1: true });
  assert.equal(c.snapshot.pontos, 0);
});

test('errar, corrigir e conferir novamente mantém ponto único na ida e volta', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Lua');
  await conferir(page);
  assert.equal((await idaVolta(page)).snapshot.pontos, 0);
  await opcao(page, 'Sol');
  await conferir(page);
  assert.equal((await idaVolta(page)).snapshot.pontos, 1);
  await conferir(page);
  assert.equal((await idaVolta(page)).snapshot.pontos, 1);
});

test('concluída exige correções atuais e posição final; voltar conserva pontos', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await concluir(page);
  const c = await idaVolta(page);
  assert.equal(c.snapshot.finalizada, true);
  assert.equal(c.snapshot.pontos, 2);
  assert.equal(c.snapshot.questaoAtual, 1);
  const forjado = envelope(structuredClone(c));
  forjado.snapshot.questaoAtual = 0;
  assert.equal((await prever(page, forjado)).codigo, 'CONCLUSAO_SNAPSHOT_INCOERENTE');
  await page.locator('#gramatica-voltar').click();
  const volta = await idaVolta(page);
  assert.equal(volta.snapshot.finalizada, false);
  assert.equal(volta.snapshot.pontos, 2);
});

test('editar acerto preserva marcador histórico mesmo com resposta atual errada ou vazia', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('água');
  await conferir(page);
  for (const resposta of ['pedra', '', 'água']) {
    await page.locator('[data-resposta-gramatica]').fill(resposta);
    const c = await idaVolta(page);
    assert.equal(c.snapshot.pontos, 2);
    assert.equal(c.snapshot.pontuadas.q2, true);
    assert.equal(c.snapshot.corrigidas.q2, undefined);
    assert.equal(c.snapshot.conferidas.q2, undefined);
    assert.equal(c.snapshot.finalizada, false);
  }
});

test('principal e responsável têm vínculos independentes e não aceitam prévia cruzada', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  const principal = await idaVolta(page);
  await page.evaluate(() => window.h.desativar());
  await abrir(page, 'responsavel');
  const responsavel = await idaVolta(page);
  assert.equal(responsavel.snapshot.pontos, 0);
  assert.equal(responsavel.vinculo.sessao, 'responsavel');
  assert.equal((await prever(page, envelope(principal))).codigo, 'VINCULO_SNAPSHOT_DIVERGENTE');
  await page.evaluate(() => window.h.desativar());
  await abrir(page);
  assert.deepEqual((await idaVolta(page)).snapshot, principal.snapshot);
});

test('temporário consentido captura memória sem acessar armazenamento', async (t) => {
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
  const c = await idaVolta(page);
  assert.equal(c.durabilidade.modo, 'temporario');
  assert.equal(c.durabilidade.naoDuravel, true);
  assert.equal(c.snapshot.pontos, 1);
  assert.equal(Object.hasOwn(c.vinculo, 'copyId'), false);
});

test('exportação durante escrita pendente captura a versão lógica mais recente sem esperar ou gravar', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  // Pendência autorizada não deve expirar por carga de outros testes.
  // A fronteira real de 3 s é verificada no caso seguinte.
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let consultas = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (++consultas === 1) chegou(route);
    else return route.continue();
  });
  await opcao(page, 'Sol');
  const req = await aguardando;
  await opcao(page, 'Lua');
  assert.equal((await consultar(page)).progresso.pendente, true);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  const c = await idaVolta(page);
  assert.deepEqual(c.snapshot.respostas.q1, ['Lua']);
  assert.equal(c.durabilidade.pendente, true);
  assert.equal(c.durabilidade.naoDuravel, true);
  assert.equal(await raw(page, chave), null);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const persistencia = await persistir(page);
  assert.equal(persistencia.ok, true, JSON.stringify(persistencia));
  assert.ok(consultas >= 2);
  await page.unrouteAll();
  await page.clock.resume();
  assert.deepEqual((await idaVolta(page)).snapshot, c.snapshot);
  assert.deepEqual(JSON.parse(await raw(page, chave)), c.snapshot);
});

test('snapshot: consulta coalescida expira em 3000 ms e resposta tardia não reativa a sessão', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  let primeira, segunda;
  const chegouPrimeira = new Promise((resolve) => {
    primeira = resolve;
  });
  const chegouSegunda = new Promise((resolve) => {
    segunda = resolve;
  });
  let consultas = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (++consultas === 1) primeira(route);
    else segunda(route);
  });
  await opcao(page, 'Sol');
  const req = await chegouPrimeira;
  await opcao(page, 'Lua');
  const captura = await idaVolta(page);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const atrasada = await chegouSegunda;
  await page.clock.runFor(2999);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  assert.equal((await consultar(page)).progresso.pendente, true);
  await page.clock.runFor(1);
  const situacao = await page.evaluate(() => window.sessao.obterSituacao());
  assert.equal(situacao.estado, 'suspensa');
  assert.equal(situacao.motivo, 'IDENTIDADE_INDISPONIVEL');
  assert.equal((await exportar(page)).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
  assert.deepEqual(JSON.parse(await raw(page, chave)).respostas.q1, ['Sol']);
  await atrasada.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await persistir(page)).ok, false);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'suspensa');
  assert.deepEqual(
    (await consultar(page)).progresso.estado.respostas.q1,
    captura.snapshot.respostas.q1
  );
  assert.deepEqual(JSON.parse(await raw(page, chave)).respostas.q1, ['Sol']);
});

test('quota e fechamento recusado permitem inspecionar memória recente sem retry implícito', async (t) => {
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
  const escritas = await page.evaluate(() => window.escritas);
  const c = await idaVolta(page);
  assert.deepEqual(c.snapshot.respostas.q1, ['Lua']);
  assert.equal(c.durabilidade.naoDuravel, true);
  assert.equal(c.durabilidade.resultado.codigo, 'QUOTA_EXCEDIDA');
  assert.equal(await page.evaluate(() => window.escritas), escritas);
  assert.equal(await raw(page, chave), null);
});

test('divergência mantém snapshot recente e não sobrescreve base ao validar', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  await page.evaluate((k) => localStorage.setItem(k, '{"fixture":"divergente"}'), chave);
  await opcao(page, 'Lua');
  assert.equal((await persistir(page)).ok, false);
  const c = await idaVolta(page);
  assert.equal(c.durabilidade.resultado.codigo, 'CONFLITO_PERSISTIDO');
  assert.deepEqual(c.snapshot.respostas.q1, ['Lua']);
  assert.equal(await raw(page, chave), '{"fixture":"divergente"}');
});

test('vínculo recusa outro perfil, pacote, matéria, versão, digest e sessão', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const c = await exportar(page);
  for (const [campo, valor] of Object.entries({
    perfil: 'mariana',
    id: 'outro',
    materia: 'ingles',
    versao: 2,
    digest: B,
    sessao: 'responsavel',
  })) {
    const dado = envelope(structuredClone(c));
    dado.vinculo[campo] = valor;
    assert.equal((await prever(page, dado)).codigo, 'VINCULO_SNAPSHOT_DIVERGENTE', campo);
  }
});

test('IDs, índices e listas desconhecidos ou malformados são recusados integralmente', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const c = await exportar(page);
  const mutacoes = [
    (s) => {
      s.questaoAtual = -1;
    },
    (s) => {
      s.questaoAtual = 2;
    },
    (s) => {
      s.questaoAtual = 0.5;
    },
    (s) => {
      s.questaoAtual = '0';
    },
    ...['respostas', 'corrigidas', 'pontuadas', 'conferidas'].map((nome) => (s) => {
      s[nome].desconhecida = nome === 'respostas' ? ['Sol'] : true;
    }),
    (s) => {
      s.respostas.q1 = [];
    },
    (s) => {
      s.respostas.q1 = ['Sol', 'Lua'];
    },
    (s) => {
      s.respostas.q1 = { 0: 'Sol' };
    },
    (s) => {
      s.respostas.q1 = [5];
    },
    (s) => {
      s.respostas.q1 = [['Sol']];
    },
    (s) => {
      s.respostas.q1 = ['desconhecida'];
    },
    (s) => {
      s.respostas.q1 = ['sol'];
    },
    (s) => {
      s.respostas.q1 = [null];
    },
    (s) => {
      s.respostas = [];
    },
    (s) => {
      s.corrigidas = null;
    },
  ];
  for (const [i, mudar] of mutacoes.entries()) {
    const dado = envelope(structuredClone(c));
    mudar(dado.snapshot);
    assert.equal((await prever(page, dado)).ok, false, String(i));
  }
  assert.deepEqual((await exportar(page)).snapshot, c.snapshot);
});

test('pontos incoerentes, marcadores falsos e correções sem resposta válida são recusados', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const c = await exportar(page);
  const mutacoes = [
    (s) => {
      s.pontos = 1;
    },
    (s) => {
      s.pontos = '0';
    },
    (s) => {
      s.pontos = -1;
    },
    (s) => {
      s.pontuadas.q1 = true;
      s.pontos = 1;
    },
    (s) => {
      s.pontuadas.q1 = false;
    },
    (s) => {
      s.conferidas.q1 = 1;
    },
    (s) => {
      s.respostas.q1 = ['Lua'];
      s.corrigidas.q1 = true;
      s.conferidas.q1 = true;
      s.pontuadas.q1 = true;
      s.pontos = 1;
    },
    (s) => {
      s.respostas.q1 = ['Sol'];
      s.corrigidas.q1 = true;
    },
    (s) => {
      s.respostas.q1 = ['Sol'];
      s.conferidas.q1 = true;
    },
    (s) => {
      s.finalizada = true;
    },
    (s) => {
      s.finalizada = 'false';
    },
  ];
  for (const [i, mudar] of mutacoes.entries()) {
    const dado = envelope(structuredClone(c));
    mudar(dado.snapshot);
    assert.equal((await prever(page, dado)).ok, false, String(i));
  }
  assert.deepEqual((await exportar(page)).snapshot, c.snapshot);
});

test('versão incompatível e campos extras ou ausentes não são reparados silenciosamente', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const c = await exportar(page);
  for (const versao of [0, 2, '1', null]) {
    const dado = envelope(structuredClone(c));
    dado.snapshot.versao = versao;
    assert.equal((await prever(page, dado)).codigo, 'VERSAO_SNAPSHOT_INCOMPATIVEL');
  }
  for (const onde of ['snapshot', 'vinculo', 'raiz']) {
    for (const nome of ['copyId', 'chave', 'tentativas', 'desconhecida']) {
      const dado = envelope(structuredClone(c));
      (onde === 'raiz' ? dado : dado[onde])[nome] = 'x';
      assert.equal((await prever(page, dado)).ok, false);
    }
  }
  for (const nome of Object.keys(c.snapshot)) {
    const dado = envelope(structuredClone(c));
    delete dado.snapshot[nome];
    assert.equal((await prever(page, dado)).ok, false, nome);
  }
});

test('objetos especiais, funções, getters, símbolos, ciclos e listas esparsas não atravessam a fronteira', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const r = await page.evaluate(() => {
    let acessos = 0;
    const mutacoes = [
      (d) => {
        d.snapshot.respostas.q1 = [() => 'Sol'];
      },
      (d) => {
        d.snapshot.respostas.q1 = [new Date()];
      },
      (d) => {
        d.snapshot.respostas = new Map();
      },
      (d) => {
        d.snapshot.respostas = new Set();
      },
      (d) => {
        d.snapshot.respostas.q1 = [/Sol/];
      },
      (d) => {
        d.snapshot.pontos = NaN;
      },
      (d) => {
        d.snapshot.pontos = Infinity;
      },
      (d) => {
        d.snapshot.pontos = 0n;
      },
      (d) => {
        d.snapshot.pontos = undefined;
      },
      (d) => {
        Object.defineProperty(d.snapshot, 'pontos', {
          get() {
            ++acessos;
            return 0;
          },
        });
      },
      (d) => {
        Object.defineProperty(d.snapshot, 'oculta', { value: 1 });
      },
      (d) => {
        d.snapshot[Symbol('x')] = 1;
      },
      (d) => {
        d.snapshot.respostas.q1 = new Array(1);
      },
      (d) => {
        d.snapshot.respostas.q1 = ['Sol'];
        d.snapshot.respostas.q1.extra = 1;
      },
      (d) => {
        d.snapshot.respostas.q1 = ['Sol'];
        Object.defineProperty(d.snapshot.respostas.q1, '0', {
          get() {
            ++acessos;
            return 'Sol';
          },
        });
      },
      (d) => {
        d.snapshot.respostas.q1 = d.snapshot;
      },
      (d) => {
        d.snapshot.toJSON = () => {
          ++acessos;
          return {};
        };
      },
      (d) => {
        Object.defineProperty(d.snapshot.respostas, '__proto__', { enumerable: true, value: {} });
      },
      (d) => {
        d.snapshot.respostas.constructor = {};
      },
      (d) => {
        Object.setPrototypeOf(d.snapshot.respostas, { externo: true });
      },
      (d) => {
        d.snapshot.respostas.q1 = new (class extends Array {})('Sol');
      },
      (d) => {
        d.snapshot.respostas.q1 = ['Sol'];
        Object.setPrototypeOf(d.snapshot.respostas.q1, {});
      },
    ];
    const recusas = mutacoes.map((mudar) => {
      const c = window.h.exportarSnapshot();
      const dado = { vinculo: c.vinculo, snapshot: c.snapshot };
      mudar(dado);
      return window.h.validarSnapshot(dado).ok;
    });
    return { recusas, acessos };
  });
  assert.ok(r.recusas.every((ok) => !ok));
  assert.equal(r.acessos, 0);
});

test('limites de texto e estrutura são verificados sem truncar ou aplicar o snapshot', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const resultados = await page.evaluate(() => {
    function entrada() {
      const c = window.h.exportarSnapshot();
      return { vinculo: c.vinculo, snapshot: c.snapshot };
    }
    const longo = entrada();
    longo.snapshot.respostas.q2 = ['a'.repeat(1001)];
    const profundo = entrada();
    let no = profundo;
    for (let i = 0; i < 20; ++i) {
      no.extra = {};
      no = no.extra;
    }
    const largo = entrada();
    largo.extra = new Array(10001).fill(0);
    return [longo, profundo, largo].map((d) => window.h.validarSnapshot(d).ok);
  });
  assert.deepEqual(resultados, [false, false, false]);
  assert.deepEqual((await idaVolta(page)).snapshot.respostas, {});
});

test('respostas legítimas acima de 160 caracteres e no limite UTF-16 mantêm equivalência', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  for (const texto of ['x'.repeat(161), '😀'.repeat(501)]) {
    await page.locator('[data-resposta-gramatica]').fill(texto);
    const c = await idaVolta(page);
    assert.equal(c.snapshot.respostas.q2[0], texto.slice(0, 1000));
  }
});

test('snapshot máximo sintético cabe na captura mesmo acima do limite do transporte persistente', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(() => window.h.liberar());
  await page.evaluate(() => window.sessao.encerrar());
  const grande = pacote();
  grande.id = 'maximo';
  grande.questoes = Array.from({ length: 30 }, (_, i) => ({
    ...grande.questoes[1],
    id: 'q' + i,
    itens: Array.from({ length: 6 }, (_, j) => ({
      id: 'i' + i + '-' + j,
      pergunta: 'Campo',
      respostas: ['sim'],
    })),
  }));
  await preparar(page, false, grande);
  await abrir(page);
  const c = await exportar(page);
  const dado = envelope(c);
  for (const q of grande.questoes)
    dado.snapshot.respostas[q.id] = q.itens.map(() => '\u0000'.repeat(1000));
  assert.ok(Buffer.byteLength(JSON.stringify(dado)) > 262144);
  const r = await prever(page, dado);
  assert.equal(r.ok, true, JSON.stringify(r).slice(0, 200));
  assert.deepEqual(r.snapshot, dado.snapshot);
  assert.deepEqual((await exportar(page)).snapshot.respostas, {});
});

test('validar dado congelado ou de protótipo nulo não altera entrada, motor ou storage', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Lua');
  await persistir(page);
  const antes = await raw(page, chave);
  const r = await page.evaluate(() => {
    const c = window.h.exportarSnapshot();
    const d = { vinculo: c.vinculo, snapshot: c.snapshot };
    const texto = JSON.stringify(d);
    function congelar(v) {
      if (v && typeof v === 'object') {
        Object.values(v).forEach(congelar);
        Object.freeze(v);
      }
    }
    Object.setPrototypeOf(d.snapshot.respostas, null);
    congelar(d);
    const analise = window.h.validarSnapshot(d);
    if (analise.ok) analise.snapshot.respostas.q1[0] = 'Sol';
    return {
      ok: analise.ok,
      igual: texto === JSON.stringify(d),
      atual: window.h.exportarSnapshot().snapshot,
    };
  });
  assert.equal(r.ok, true);
  assert.equal(r.igual, true);
  assert.deepEqual(r.atual.respostas.q1, ['Lua']);
  assert.equal(await raw(page, chave), antes);
});

test('liberação e encerramento revogam captura e prévia sem reativação por callbacks', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  const c = await exportar(page);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
  assert.equal((await exportar(page)).codigo, 'HANDLE_LIBERADO');
  assert.equal((await prever(page, envelope(c))).codigo, 'HANDLE_LIBERADO');
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva()), null);
});

test('fechamento em voo conserva leitura até revogar o vínculo; callback não recria execução', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await opcao(page, 'Sol');
  const req = await aguardando;
  await page.evaluate(() => {
    window.fechamento = window.h.liberar();
  });
  const c = await idaVolta(page);
  assert.equal(c.durabilidade.pendente, true);
  assert.deepEqual(c.snapshot.respostas.q1, ['Sol']);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await page.evaluate(() => window.fechamento)).ok, true);
  assert.equal((await exportar(page)).codigo, 'HANDLE_LIBERADO');
});

test('LAB oculto exporta somente seu estado e operações não alteram revisão oficial', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  const lab = await exportar(page);
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
    estado: window.QuestionariosRevisoes.obterEstado('oficial'),
    html: document.getElementById('gramatica-conteudo').innerHTML,
    storage: Object.entries(localStorage),
  }));
  assert.deepEqual((await idaVolta(page)).snapshot, lab.snapshot);
  const invalido = envelope(structuredClone(lab));
  invalido.snapshot.finalizada = true;
  assert.equal((await prever(page, invalido)).ok, false);
  const depois = await page.evaluate(() => ({
    estado: window.QuestionariosRevisoes.obterEstado('oficial'),
    html: document.getElementById('gramatica-conteudo').innerHTML,
    storage: Object.entries(localStorage),
  }));
  assert.deepEqual(depois, antes);
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva().id), 'oficial');
});

test('estado persistido e recarregado continua válido e logicamente equivalente', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  const c = await idaVolta(page);
  await page.evaluate(() => window.h.liberar());
  await page.reload();
  await carregar(page);
  await preparar(page);
  await abrir(page);
  assert.deepEqual((await idaVolta(page)).snapshot, c.snapshot);
  assert.equal((await exportar(page)).durabilidade.naoDuravel, false);
});

test('exceções adversariais e proxies revogados resultam em recusa sem inspecionar erro externo', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const r = await page.evaluate(() => {
    let acessos = 0;
    const erro = Object.defineProperty({}, 'codigo', {
      get() {
        ++acessos;
        throw new Error('Não ler');
      },
    });
    const objetos = [
      new Proxy(
        {},
        {
          ownKeys() {
            throw null;
          },
        }
      ),
      new Proxy(
        {},
        {
          getPrototypeOf() {
            throw erro;
          },
        }
      ),
    ];
    const revogado = Proxy.revocable({}, {});
    revogado.revoke();
    objetos.push(revogado.proxy);
    const recusas = objetos.map((obj) => window.h.validarSnapshot(obj));
    return { acessos, recusas };
  });
  assert.equal(r.acessos, 0);
  assert.ok(r.recusas.every((d) => !d.ok && d.codigo === 'DADOS_SNAPSHOT_INVALIDOS'));
});

for (const causa of ['identidade', 'lock'])
  test(`suspensão conhecida por perda de ${causa} revoga captura e prévia`, async (t) => {
    const { page } = await contexto(t);
    await abrir(page);
    const c = await exportar(page);
    if (causa === 'identidade') copyId = B;
    else
      await page.evaluate(() => {
        navigator.locks.query = async () => ({ held: [], pending: [] });
      });
    await opcao(page, 'Lua');
    assert.equal((await persistir(page)).ok, false);
    assert.equal((await exportar(page)).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
    assert.equal((await prever(page, envelope(c))).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
    assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
  });

function pacoteDitadoAnalise(idioma = 'pt-BR', unidade = 'palavra', quantidade = 2) {
  const palavras =
    idioma === 'pt-BR'
      ? ['café', 'árvore', 'céu', 'flor', 'lápis', 'pão']
      : ['cat', 'tree', 'sun', 'flower', 'pencil', 'bread'];
  const frases =
    idioma === 'pt-BR'
      ? ['A casa é azul.', 'O sol está alto.']
      : ['The house is blue.', 'The sun is bright.'];
  return {
    formato: 'lab-questionarios-v2',
    id: 'ditado-analise',
    versao: 3,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: palavras[0],
    questoes: [
      {
        id: 'questao-alvo',
        bloco: palavras[0],
        titulo: palavras[0],
        instrucao: palavras[0],
        tipo: 'ditado',
        idioma,
        unidade,
        itens: Array.from({ length: quantidade }, (_, i) => ({
          id: 'item-' + (quantidade - i),
          texto: unidade === 'palavra' ? palavras[i] : frases[i % 2],
        })),
      },
    ],
  };
}
function snapshotDitado(p) {
  const q = p.questoes[0];
  return {
    versao: 1,
    questaoAtual: 0,
    respostas: { [q.id]: q.itens.map((i) => i.texto) },
    corrigidas: { [q.id]: true },
    pontuadas: { [q.id]: true },
    conferidas: { [q.id]: true },
    pontos: 1,
    finalizada: true,
  };
}
async function paginaAnalise(t) {
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  return page;
}
for (const idioma of ['pt-BR', 'en-US'])
  for (const unidade of ['palavra', 'frase'])
    test(`6C.1 projeção e snapshot ${idioma}/${unidade}, 1–6 itens e ambas as sessões`, async (t) => {
      const page = await paginaAnalise(t);
      for (let n = 1; n <= 6; ++n) {
        const p = pacoteDitadoAnalise(idioma, unidade, n);
        const s = snapshotDitado(p);
        const r = await page.evaluate(
          async ({ p, s }) => {
            const texto = JSON.stringify(p);
            const v = await window.LabValidador.reconhecerPacote(texto);
            const a = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(texto);
            const b = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(texto);
            const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(texto);
            const config = {
              aluno: p.perfil,
              titulo: a.titulo,
              chave: null,
              questoes: structuredClone(a.questoes),
            };
            const igual = c.correspondeConfiguracao(config);
            config.questoes[0].sucesso = 'Outra mensagem interna.';
            const sucesso = c.correspondeConfiguracao(config);
            config.questoes[0].itens.reverse();
            const ordemInversa = (n) => (n === 1 ? null : c.correspondeConfiguracao(config));
            return {
              v,
              a,
              b,
              digest: c.digest,
              igual,
              sucesso,
              inversa: ordemInversa(p.questoes[0].itens.length),
              sessoes: ['principal', 'responsavel'].map((nome) => c.validarSnapshot(nome, s)),
              imutavel: texto === JSON.stringify(p),
            };
          },
          { p, s }
        );
        assert.equal(r.v.valido, true);
        assert.equal(r.digest, r.v.digest);
        assert.deepEqual(r.a, r.b);
        assert.equal(r.imutavel, true);
        assert.equal(r.igual, true);
        assert.equal(r.sucesso, true);
        if (n > 1) assert.equal(r.inversa, false);
        assert.equal(r.a.titulo, 'Atividade de escrita');
        const q = r.a.questoes[0];
        assert.equal(q.id, p.questoes[0].id);
        assert.equal(q.idiomaDitado, idioma);
        assert.equal(q.unidadeDitado, unidade);
        assert.deepEqual(
          q.itens.map((i) => i.id),
          p.questoes[0].itens.map((i) => i.id)
        );
        assert.deepEqual(
          q.itens.map((i) => i.respostas),
          p.questoes[0].itens.map((i) => [i.texto])
        );
        assert.ok(q.itens.every((i) => !Object.hasOwn(i, 'value')));
        for (const [i, resultado] of r.sessoes.entries()) {
          assert.equal(resultado.ok, true, JSON.stringify(resultado));
          assert.deepEqual(resultado.snapshot, s);
          assert.equal(resultado.vinculo.digest, r.v.digest);
          assert.equal(resultado.vinculo.versao, 3);
          assert.equal(resultado.vinculo.sessao, ['principal', 'responsavel'][i]);
          assert.equal(resultado.restauracaoAutorizada, false);
        }
      }
    });

test('6C.1 ciclo lógico erro/correção/edição mantém ponto histórico e normalização oficial', async (t) => {
  const page = await paginaAnalise(t);
  const p = pacoteDitadoAnalise();
  const certo = snapshotDitado(p);
  const editado = structuredClone(certo);
  editado.respostas['questao-alvo'][0] = 'incorreta';
  editado.corrigidas = {};
  editado.conferidas = {};
  editado.finalizada = false;
  const erradoConferido = structuredClone(editado);
  erradoConferido.conferidas = { 'questao-alvo': true };
  const normalizado = structuredClone(certo);
  normalizado.respostas['questao-alvo'][0] = '  CAFE  ';
  const s = [editado, erradoConferido, certo, normalizado, certo];
  const r = await page.evaluate(
    async ({ p, s }) => {
      const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(JSON.stringify(p));
      return s.map((estado) => c.validarSnapshot('principal', estado));
    },
    { p, s }
  );
  for (const [i, analise] of r.entries()) {
    assert.equal(analise.ok, true, JSON.stringify(analise));
    assert.deepEqual(analise.snapshot, s[i]);
    assert.equal(analise.snapshot.pontos, 1);
  }
});

test('6C.1 corrupção, ordem posicional, identidade e configuração divergentes recusadas sem reparação', async (t) => {
  const page = await paginaAnalise(t);
  const p = pacoteDitadoAnalise();
  const s = snapshotDitado(p);
  const ruins = [
    (v) => v.respostas['questao-alvo'].pop(),
    (v) => v.respostas['questao-alvo'].reverse(),
    (v) => {
      v.respostas['questao-alvo'][0] = 'x'.repeat(1001);
    },
    (v) => {
      v.pontos = 2;
    },
    (v) => {
      v.conferidas = {};
    },
    (v) => {
      v.pontuadas = {};
    },
    (v) => {
      v.questaoAtual = 1;
    },
    (v) => {
      v.versao = 2;
    },
    (v) => {
      v.corrigidas = {};
    },
    (v) => {
      v.respostas.desconhecida = ['café'];
    },
    (v) => {
      v.sessao = 'principal';
    },
  ].map((mutar) => {
    const v = structuredClone(s);
    mutar(v);
    return v;
  });
  const antes = JSON.stringify(ruins);
  const r = await page.evaluate(
    async ({ p, s, ruins }) => {
      const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(JSON.stringify(p));
      const a = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(JSON.stringify(p));
      const boa = c.validarSnapshot('principal', s);
      const vinculos = ['perfil', 'materia', 'id', 'versao', 'digest', 'sessao'].map((campo) => {
        const vinculo = { ...boa.vinculo, [campo]: campo === 'versao' ? 4 : 'outro' };
        return c.analisarSnapshot('principal', { vinculo, snapshot: s });
      });
      const configura = {
        aluno: p.perfil,
        titulo: a.titulo,
        chave: null,
        questoes: structuredClone(a.questoes),
      };
      configura.questoes[0].idiomaDitado = 'en-US';
      const idioma = c.correspondeConfiguracao(configura);
      configura.questoes[0].idiomaDitado = 'pt-BR';
      configura.questoes[0].itens[0].respostas = ['outra'];
      return {
        ruins: ruins.map((v) => c.validarSnapshot('principal', v)),
        vinculos,
        idioma,
        gabarito: c.correspondeConfiguracao(configura),
        sessao: c.validarSnapshot('outra', s),
        boa,
      };
    },
    { p, s, ruins }
  );
  assert.equal(r.boa.ok, true);
  assert.equal(JSON.stringify(ruins), antes);
  assert.ok(
    r.ruins.every((v) => !v.ok),
    JSON.stringify(r.ruins)
  );
  assert.ok(r.vinculos.every((v) => v.codigo === 'VINCULO_SNAPSHOT_DIVERGENTE'));
  assert.equal(r.idioma, false);
  assert.equal(r.gabarito, false);
  assert.equal(r.sessao.ok, false);
});

test('6C.1 reconhecimento e snapshots não abrem banco, gravam progresso ou acionam áudio', async (t) => {
  const page = await paginaAnalise(t);
  const p = pacoteDitadoAnalise();
  const s = snapshotDitado(p);
  s.respostas['questao-alvo'] = ['😀'.repeat(500), 'x'.repeat(1000)];
  s.corrigidas = {};
  s.conferidas = {};
  s.finalizada = false;
  const r = await page.evaluate(
    async ({ p, s }) => {
      const efeitos = [];
      indexedDB.open = () => {
        efeitos.push('banco');
        throw new Error('IO indevido');
      };
      Storage.prototype.setItem = () => {
        efeitos.push('progresso');
        throw new Error('IO indevido');
      };
      window.GramaticaDitado.parar = () => efeitos.push('audio');
      const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(JSON.stringify(p));
      return { resultado: c.validarSnapshot('responsavel', s), efeitos };
    },
    { p, s }
  );
  assert.equal(r.resultado.ok, true);
  assert.deepEqual(r.resultado.snapshot, s);
  assert.deepEqual(r.efeitos, []);
});

test('6C.1 duas questões preservam posição, conclusão e ponto histórico após edição', async (t) => {
  const page = await paginaAnalise(t);
  const p = pacoteDitadoAnalise();
  p.questoes.push({
    ...structuredClone(p.questoes[0]),
    id: 'q-final',
    itens: [{ id: 'ultimo-item', texto: 'flor' }],
  });
  const parcial = snapshotDitado(p);
  parcial.finalizada = false;
  parcial.questaoAtual = 1;
  parcial.respostas['q-final'] = ['errada'];
  parcial.conferidas['q-final'] = true;
  const completo = structuredClone(parcial);
  completo.respostas['q-final'] = ['flor'];
  completo.corrigidas['q-final'] = true;
  completo.pontuadas['q-final'] = true;
  completo.pontos = 2;
  completo.finalizada = true;
  const voltou = structuredClone(completo);
  voltou.questaoAtual = 0;
  voltou.finalizada = false;
  voltou.respostas['questao-alvo'][0] = 'errada';
  delete voltou.corrigidas['questao-alvo'];
  delete voltou.conferidas['questao-alvo'];
  const finalForaDaPosicao = structuredClone(completo);
  finalForaDaPosicao.questaoAtual = 0;
  const r = await page.evaluate(
    async ({ p, estados, invalido }) => {
      const texto = JSON.stringify(p);
      const a = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(texto);
      const c = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(texto);
      const config = {
        aluno: p.perfil,
        titulo: a.titulo,
        chave: null,
        questoes: a.questoes.slice().reverse(),
      };
      return {
        estados: estados.map((s) =>
          c.validarSnapshot('responsavel', JSON.parse(JSON.stringify(s)))
        ),
        invalido: c.validarSnapshot('responsavel', invalido),
        ordem: c.correspondeConfiguracao(config),
      };
    },
    { p, estados: [parcial, completo, voltou], invalido: finalForaDaPosicao }
  );
  for (const [i, a] of r.estados.entries()) {
    assert.equal(a.ok, true, JSON.stringify(a));
    assert.deepEqual(a.snapshot, [parcial, completo, voltou][i]);
  }
  assert.equal(r.invalido.codigo, 'CONCLUSAO_SNAPSHOT_INCOERENTE');
  assert.equal(r.ordem, false);
});
