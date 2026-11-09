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
  ])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', s) });
}
async function preparar(page, temporario = false, p = pacote()) {
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
      const pedagogia =
        p.formato === 'lab-questionarios-v2'
          ? await window.QuestionariosRevisoes.adaptarContratoDitadoLab(JSON.stringify(p))
          : p;
      window.config = {
        id: 'lab-runtime',
        chave: null,
        aluno: p.perfil,
        nome: 'Fixture',
        materia: 'Ciências',
        titulo: pedagogia.titulo,
        questoes: pedagogia.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
      };
      const registro = window.QuestionariosRevisoes.registrarLab(() => window.config);
      if (!registro.ok) throw new Error(registro.codigo);
      window.h = registro.handle;
      return window.sessao.abrirProgresso('principal').canal.chave;
    },
    { p, temporario }
  );
}
async function contexto(t, temporario = false, p = pacote()) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  const chave = await preparar(page, temporario, p);
  return { ctx, page, chave };
}
const abrir = (page, sessao = 'principal') =>
  page.evaluate((s) => window.h.abrir(window.sessao, s), sessao);
const consultar = (page) => page.evaluate(() => window.h.consultar());
const persistir = (page) => page.evaluate(() => window.h.persistir());
const opcao = (page, valor) => page.locator(`[data-opcao-gramatica="${valor}"]`).click();
const conferir = (page) => page.locator('[data-conferir-gramatica]').click();
const raw = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);

for (const perfil of ['alice', 'mariana'])
  for (const formato of ['lab-questionarios-v1', 'lab-questionarios-v2'])
    test(`conclusão LAB neutra e resumo oficial preservado: ${perfil} ${formato}`, async (t) => {
      const p = { ...pacote(), perfil, formato };
      if (formato === 'lab-questionarios-v2')
        p.questoes = p.questoes.map((q, i) => ({
          id: q.id,
          bloco: q.bloco,
          titulo: q.titulo,
          instrucao: q.instrucao,
          tipo: 'ditado',
          idioma: 'pt-BR',
          itens: [{ id: 'i' + (i + 1), texto: i === 0 ? 'Sol' : 'água' }],
        }));
      const { page, chave } = await contexto(t, false, p);
      if (formato === 'lab-questionarios-v2')
        await page.addScriptTag({
          path: path.join(ROOT, 'ambiente_interativo/js/gramatica-ditado.js'),
        });
      const mensagem = 'Você concluiu todas as questões desta atividade.';
      const explicacao = page.locator('#gramatica-conteudo .explicacao-mariana');
      async function concluir() {
        if (formato === 'lab-questionarios-v1') await opcao(page, 'Sol');
        else await page.locator('[data-resposta-gramatica]').fill('Sol');
        await conferir(page);
        await page.locator('#gramatica-proxima').click();
        await page.locator('[data-resposta-gramatica]').fill('água');
        await conferir(page);
        await page.locator('#gramatica-proxima').click();
      }
      const estados = {};
      for (const sessao of ['principal', 'responsavel']) {
        assert.equal((await abrir(page, sessao)).ok, true);
        assert.equal((await consultar(page)).progresso.estado.pontos, 0);
        await concluir();
        assert.equal(await explicacao.textContent(), mensagem);
        assert.doesNotMatch(await explicacao.textContent(), /undefined|null/);
        assert.equal((await persistir(page)).ok, true);
        estados[sessao] = JSON.parse(await raw(page, chave.replace(/principal$/, sessao)));
        assert.equal(estados[sessao].pontos, 2);
        assert.equal(estados[sessao].finalizada, true);
        assert.deepEqual(estados[sessao].respostas, { q1: ['Sol'], q2: ['água'] });
        assert.equal((await page.evaluate(() => window.h.desativar())).ok, true);
      }
      assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
      await page.evaluate(() => window.sessao.encerrar());
      await carregar(page);
      if (formato === 'lab-questionarios-v2')
        await page.addScriptTag({
          path: path.join(ROOT, 'ambiente_interativo/js/gramatica-ditado.js'),
        });
      await preparar(page, false, p);
      for (const sessao of ['principal', 'responsavel']) {
        assert.equal((await abrir(page, sessao)).ok, true);
        assert.equal(await explicacao.textContent(), mensagem);
        assert.deepEqual((await consultar(page)).progresso.estado, estados[sessao]);
        assert.equal((await page.evaluate(() => window.h.desativar())).ok, true);
      }
      assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
      await page.evaluate(() => {
        window.QuestionariosRevisoes.registrar({
          ...window.config,
          id: 'oficial-fixture',
          chave: 'oficial-fixture',
          resumoFinal: 'Resumo original da revisão oficial.',
        });
        window.QuestionariosRevisoes.abrir('oficial-fixture');
      });
      await concluir();
      assert.equal(await explicacao.textContent(), 'Resumo original da revisão oficial.');
    });

test('abertura autorizada não salva, pontua ou conclui por si', async (t) => {
  const { page, chave } = await contexto(t);
  const r = await abrir(page);
  assert.equal(r.ok, true);
  const c = await consultar(page);
  assert.equal(c.progresso.estado.pontos, 0);
  assert.deepEqual(c.progresso.estado.respostas, {});
  assert.equal(c.progresso.estado.finalizada, false);
  assert.equal(await raw(page, chave), null);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
});
test('objetos/coordenadores forjados, sessão inválida e configuração divergente são recusados', async (t) => {
  const { page } = await contexto(t);
  assert.equal(
    (await page.evaluate(() => window.h.abrir({ ...window.sessao }, 'principal'))).codigo,
    'SESSAO_LAB_INVALIDA'
  );
  assert.equal((await abrir(page, 'outra')).codigo, 'SESSAO_INVALIDA');
  await page.evaluate(() => {
    window.h.liberar();
    window.config.questoes[0].itens[0].respostas = ['Lua'];
    window.h = window.QuestionariosRevisoes.registrarLab(() => window.config).handle;
  });
  assert.equal((await abrir(page)).codigo, 'CONFIGURACAO_LAB_DIVERGENTE');
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva()), null);
});
test('sessão sem aquisição ou encerrada não abre parcialmente', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(() => window.sessao.liberar());
  assert.equal((await abrir(page)).ok, false);
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva()), null);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await abrir(page)).ok, false);
});
test('ciclo errar/conferir/corrigir/avançar/voltar/recarregar preserva ponto único', async (t) => {
  const { page, chave } = await contexto(t);
  assert.equal((await abrir(page)).ok, true);
  await opcao(page, 'Lua');
  await conferir(page);
  assert.equal((await consultar(page)).progresso.estado.pontos, 0);
  await opcao(page, 'Sol');
  await conferir(page);
  assert.equal((await persistir(page)).ok, true);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('pedra');
  await conferir(page);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
  await page.locator('[data-resposta-gramatica]').fill('água');
  await conferir(page);
  await page.locator('#gramatica-voltar').click();
  await conferir(page);
  assert.equal((await persistir(page)).ok, true);
  const antes = (await consultar(page)).progresso.estado;
  assert.equal(antes.pontos, 2);
  assert.equal(antes.questaoAtual, 0);
  await page.evaluate(() => window.h.liberar());
  await page.reload();
  await carregar(page);
  await preparar(page);
  assert.equal((await abrir(page)).ok, true);
  assert.deepEqual((await consultar(page)).progresso.estado, antes);
  assert.deepEqual(JSON.parse(await raw(page, chave)), antes);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-proxima').click();
  assert.equal((await persistir(page)).ok, true);
  assert.equal((await consultar(page)).progresso.estado.finalizada, true);
});
test('editar acerto invalida correção mas mantém histórico de pontos', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await opcao(page, 'Lua');
  const e = (await consultar(page)).progresso.estado;
  assert.equal(e.pontos, 1);
  assert.equal(e.corrigidas.q1, undefined);
  await conferir(page);
  await persistir(page);
  await page.evaluate(() => window.h.desativar());
  await abrir(page);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
  assert.equal((await consultar(page)).progresso.estado.corrigidas.q1, undefined);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
});
test('principal e responsável são selecionados explicitamente e isolados', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await page.evaluate(() => window.h.desativar());
  assert.equal(
    (await page.evaluate(() => navigator.locks.query())).held.filter((l) =>
      l.name.startsWith('revisoesEscolares.lab.sessao.')
    ).length,
    1
  );
  assert.equal((await abrir(page, 'responsavel')).ok, true);
  assert.equal((await consultar(page)).progresso.estado.pontos, 0);
  assert.equal(await raw(page, chave.replace(/principal$/, 'responsavel')), null);
  await opcao(page, 'Lua');
  await persistir(page);
  await page.evaluate(() => window.h.desativar());
  await abrir(page, 'principal');
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
  assert.equal(JSON.parse(await raw(page, chave.replace(/principal$/, 'responsavel'))).pontos, 0);
});
test('temporário consentido usa memória, inclusive desativar/reabrir e liberar', async (t) => {
  const { page } = await contexto(t, true);
  await page.evaluate(() =>
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Não acessar');
      },
    })
  );
  assert.equal((await abrir(page)).ok, true);
  await opcao(page, 'Sol');
  await conferir(page);
  assert.equal((await persistir(page)).ok, true);
  await page.evaluate(() => window.h.desativar());
  await abrir(page);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
  const fim = await page.evaluate(() => window.h.liberar());
  assert.equal(fim.ok, true);
  assert.equal(fim.memoriaPreservada, true);
  assert.equal(fim.durabilidade.durabilidade, 'memoria');
});
test('quota mantém memória recente e recusa fechamento sem fingir durabilidade', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await page.evaluate(() => {
    window.setOriginal = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new window.DOMException('Fixture', 'QuotaExceededError');
    };
  });
  await opcao(page, 'Lua');
  await conferir(page);
  const r = await persistir(page);
  assert.equal(r.ok, false);
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
  const fim = await page.evaluate(() => window.h.liberar());
  assert.equal(fim.codigo, 'PROGRESSO_LAB_NAO_DURAVEL');
  assert.equal((await consultar(page)).ok, true);
  assert.equal(await raw(page, chave), null);
  await page.evaluate(() => {
    Storage.prototype.setItem = window.setOriginal;
  });
  assert.equal((await persistir(page)).ok, true);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
});
test('base divergente não recebe retry automático nem liberação silenciosa', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  await page.evaluate((k) => localStorage.setItem(k, '{"respostas":{}}'), chave);
  await opcao(page, 'Lua');
  const r = await persistir(page);
  assert.equal(r.ok, false);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, false);
  assert.equal(await raw(page, chave), '{"respostas":{}}');
});
for (const causa of ['identidade', 'lock'])
  test(`perda de ${causa} bloqueia gravação e conserva estado no handle`, async (t) => {
    const { page, chave } = await contexto(t);
    await abrir(page);
    await opcao(page, 'Sol');
    await persistir(page);
    const antes = await raw(page, chave);
    if (causa === 'identidade') copyId = B;
    else
      await page.evaluate(() => {
        const n = navigator.locks;
        Object.defineProperty(navigator, 'locks', {
          configurable: true,
          value: { request: n.request.bind(n), query: async () => ({ held: [], pending: [] }) },
        });
      });
    await opcao(page, 'Lua');
    assert.equal((await persistir(page)).ok, false);
    assert.equal(await raw(page, chave), antes);
    assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
    assert.equal((await page.evaluate(() => window.h.liberar())).ok, false);
  });
test('fechamento aguarda gravação pendente antes de soltar o lock', async (t) => {
  const { page, chave } = await contexto(t);
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
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  const r = await page.evaluate(() => window.fechamento);
  assert.equal(r.ok, true);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 0);
  assert.deepEqual(JSON.parse(await raw(page, chave)).respostas.q1, ['Sol']);
});
test('LAB → oficial → LAB não permite que evento DOM antigo altere outra revisão', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await page.evaluate(() => {
    window.botaoAntigo = document.querySelector('[data-opcao-gramatica="Lua"]');
    const oficial = { ...window.config, id: 'oficial', chave: 'fixture-oficial' };
    window.QuestionariosRevisoes.registrar(oficial);
    window.QuestionariosRevisoes.abrir('oficial');
    window.botaoAntigo.click();
  });
  assert.equal(
    await page.evaluate(() => window.QuestionariosRevisoes.obterEstado('oficial').pontos),
    0
  );
  assert.deepEqual(
    await page.evaluate(() => window.QuestionariosRevisoes.obterEstado('oficial').respostas),
    {}
  );
  assert.equal((await abrir(page)).ok, true);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
});

test('resposta correta ainda não conferida não vira ponto ao reabrir', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  await page.evaluate(() => window.h.desativar());
  await abrir(page);
  const e = (await consultar(page)).progresso.estado;
  assert.equal(e.pontos, 0);
  assert.deepEqual(e.corrigidas, {});
  assert.equal(e.finalizada, false);
});

test('liberar depois de desativar solta a exclusividade que permaneceu reservada', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  await page.evaluate(() => window.h.desativar());
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 0);
});

test('desativar e liberar sobrepostos convergem sem deixar lock ou perder a gravação', async (t) => {
  const { page, chave } = await contexto(t);
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
    window.desativando = window.h.desativar();
    window.liberando = window.h.liberar();
    window.segundaLiberacao = window.h.liberar();
  });
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  const r = await page.evaluate(async () =>
    Promise.all([window.desativando, window.liberando, window.segundaLiberacao])
  );
  assert.ok(r.every((x) => x.ok));
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 0);
  assert.deepEqual(JSON.parse(await raw(page, chave)).respostas.q1, ['Sol']);
});

test('abertura atrasada cancelada por liberação não toma o painel oficial', async (t) => {
  const { page } = await contexto(t);
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    chegou(route);
  });
  await page.evaluate(() => {
    window.abrindo = window.h.abrir(window.sessao, 'principal');
  });
  const req = await aguardando;
  await page.evaluate(() => {
    window.h.liberar();
    const c = { ...window.config, id: 'oficial', chave: 'fixture-oficial' };
    window.QuestionariosRevisoes.registrar(c);
    window.QuestionariosRevisoes.abrir('oficial');
  });
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await page.evaluate(() => window.abrindo)).ok, false);
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva().id), 'oficial');
});

test('duas edições durante gravação pendente confirmam apenas o estado mais recente', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let consultas = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (++consultas === 1) chegou(route);
    else return route.continue();
  });
  await opcao(page, 'Lua');
  const req = await aguardando;
  await opcao(page, 'Sol');
  await conferir(page);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  const resultado = await persistir(page);
  assert.equal(resultado.ok, true, JSON.stringify(resultado));
  assert.ok(consultas >= 2);
  await page.unrouteAll();
  await page.clock.resume();
  const e = JSON.parse(await raw(page, chave));
  assert.deepEqual(e.respostas.q1, ['Sol']);
  assert.equal(e.pontos, 1);
});

test('falha na leitura inicial conserva revisão oficial ativa sem abertura parcial', async (t) => {
  const { page } = await contexto(t);
  await page.evaluate(() => {
    const chave = window.sessao.abrirProgresso('principal').canal.chave;
    localStorage.setItem(chave, '{invalido');
    const c = { ...window.config, id: 'oficial', chave: 'fixture-oficial' };
    window.QuestionariosRevisoes.registrar(c);
    window.QuestionariosRevisoes.abrir('oficial');
  });
  assert.equal((await abrir(page)).codigo, 'DADOS_PERSISTIDOS_INVALIDOS');
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva().id), 'oficial');
  assert.equal((await consultar(page)).progresso, null);
});

test('fechamento recusado não deixa intenção de liberação em desativação posterior', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  await page.evaluate(() => {
    window.setOriginal = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('Fixture');
    };
  });
  await opcao(page, 'Sol');
  await persistir(page);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, false);
  await page.evaluate(() => {
    Storage.prototype.setItem = window.setOriginal;
  });
  assert.equal((await persistir(page)).ok, true);
  assert.equal((await page.evaluate(() => window.h.desativar())).ok, true);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  assert.equal((await abrir(page, 'responsavel')).ok, true);
  assert.equal((await consultar(page)).progresso.estado.pontos, 0);
  assert.equal((await page.evaluate(() => window.h.liberar())).ok, true);
});

test('callback de gravação LAB tardio não muda estado da revisão oficial ativa', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  // Exercitar callback ainda autorizado, independentemente da carga da suíte.
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
  await conferir(page);
  await page.evaluate(() => {
    const c = { ...window.config, id: 'oficial', chave: 'fixture-oficial' };
    window.QuestionariosRevisoes.registrar(c);
    window.QuestionariosRevisoes.abrir('oficial');
  });
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'ativa');
  const persistencia = await persistir(page);
  assert.equal(persistencia.ok, true, JSON.stringify(persistencia));
  assert.ok(consultas >= 2);
  await page.unrouteAll();
  await page.clock.resume();
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva().id), 'oficial');
  assert.deepEqual(
    await page.evaluate(() => window.QuestionariosRevisoes.obterEstado('oficial').respostas),
    {}
  );
  assert.equal((await abrir(page)).ok, true);
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
});

test('encerrar coordenador antes do motor não descarta a última cópia temporária', async (t) => {
  const { page } = await contexto(t, true);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  await page.evaluate(() => window.sessao.encerrar());
  assert.equal((await page.evaluate(() => window.h.liberar())).codigo, 'SESSAO_LAB_NAO_AUTORIZADA');
  assert.equal((await consultar(page)).progresso.estado.pontos, 1);
});

test('observação por handle autêntico entrega só metadados e termina na liberação', async (t) => {
  const { page } = await contexto(t);
  await abrir(page);
  const inicial = await page.evaluate(() => {
    window.__metadadosObservados = [];
    const observar = window.h.observarDurabilidade;
    const forjado = observar.call({}, () => {
      throw new Error('Não autorizado');
    });
    const desobservar = window.h.observarDurabilidade((meta) => {
      window.__metadadosObservados.push({ congelado: Object.isFrozen(meta), valor: meta });
    });
    return {
      forjadoRecusado: forjado === null,
      desobservarDisponivel: typeof desobservar === 'function',
    };
  });
  assert.deepEqual(inicial, { forjadoRecusado: true, desobservarDisponivel: true });
  await opcao(page, 'Sol');
  await persistir(page);
  const metadados = await page.evaluate(() => window.__metadadosObservados);
  assert.ok(metadados.some((m) => m.valor.pendente));
  assert.ok(metadados.some((m) => !m.valor.pendente && !m.valor.naoDuravel));
  for (const m of metadados) {
    assert.equal(m.congelado, true);
    assert.deepEqual(Object.keys(m.valor).sort(), [
      'codigo',
      'durabilidade',
      'naoDuravel',
      'pendente',
    ]);
  }
  await page.evaluate(() => window.h.liberar());
  const quantidade = await page.evaluate(() => window.__metadadosObservados.length);
  assert.equal((await persistir(page)).ok, false);
  assert.equal(await page.evaluate(() => window.__metadadosObservados.length), quantidade);
});
