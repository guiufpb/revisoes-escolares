/* global window, EventTarget */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const ENGINE = path.join(ROOT, 'ambiente_interativo/js/gramatica-questionarios.js');
const STORAGE = path.join(ROOT, 'ambiente_interativo/js/armazenamento.js');
const A = 'a'.repeat(64),
  D = 'd'.repeat(64);
const CHAVE = `revisoesEscolares.lab.v1.${A}.alice.ciencias.sintetico.v1.${D}.principal`;
function config(id = 'lab-sintetico', chave = CHAVE) {
  return {
    id,
    chave,
    aluno: 'alice',
    nome: 'Fixture',
    materia: 'Ciências',
    titulo: 'Registro sintético',
    questoes: [
      {
        id: 'q1',
        bloco: 'Exemplo',
        titulo: 'O dia',
        instrucao: 'Escolha.',
        tipo: 'opcoes',
        dica: 'Observe.',
        sucesso: 'Conferiu.',
        itens: [
          { id: 'i1', pergunta: 'Qual ilumina o dia?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] },
        ],
      },
    ],
  };
}
function ambiente() {
  const dados = new Map();
  let leituras = 0,
    escritas = 0,
    remocoes = 0;
  const win = {
    localStorage: {
      getItem(k) {
        ++leituras;
        return dados.get(k) ?? null;
      },
      setItem(k, v) {
        ++escritas;
        dados.set(k, v);
      },
      removeItem(k) {
        ++remocoes;
        dados.delete(k);
      },
    },
    QuestionariosInteracoes: { aceita: () => false },
  };
  const ctx = vm.createContext({ window: win, console });
  vm.runInContext(fs.readFileSync(STORAGE, 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), ctx);
  const parse = vm.runInContext('JSON.parse', ctx);
  return {
    api: win.QuestionariosRevisoes,
    dados,
    copia: (v) => parse(JSON.stringify(v)),
    contagens: () => ({ leituras, escritas, remocoes }),
  };
}
function registrar(e, c = config()) {
  return e.api.registrarLab(() => e.copia(c));
}

test('registro LAB privado, handle congelado e consulta só de metadados', () => {
  const e = ambiente();
  const r = registrar(e);
  assert.equal(r.ok, true);
  assert.ok(Object.isFrozen(r.handle));
  const consulta = r.handle.consultar();
  assert.equal(consulta.aberturaDisponivel, false);
  assert.equal(consulta.registro.id, 'lab-sintetico');
  assert.equal(consulta.registro.totalQuestoes, 1);
  assert.equal('questoes' in consulta.registro, false);
  consulta.registro.titulo = 'Não alterar';
  assert.equal(r.handle.consultar().registro.titulo, 'Registro sintético');
  assert.deepEqual(e.contagens(), { leituras: 0, escritas: 0, remocoes: 0 });
});

test('JSON cru, construtor ausente/lançando e Promise não são configurações do motor', async () => {
  const e = ambiente();
  for (const valor of [undefined, config(), JSON.stringify(config())])
    assert.equal(e.api.registrarLab(valor).codigo, 'CONSTRUTOR_LAB_INVALIDO');
  assert.equal(
    e.api.registrarLab(() => {
      throw new Error('Privado');
    }).codigo,
    'CONFIGURACAO_LAB_INVALIDA'
  );
  assert.equal(
    e.api.registrarLab(() => Promise.resolve(config())).codigo,
    'CONSTRUTOR_LAB_ASSINCRONO'
  );
  assert.equal(
    e.api.registrarLab(() => Promise.reject(new Error('Privado'))).codigo,
    'CONSTRUTOR_LAB_ASSINCRONO'
  );
  await Promise.resolve();
  assert.equal(registrar(e).ok, true);
});

for (const [nome, mutar] of [
  [
    'ID fora de LAB',
    (c) => {
      c.id = 'oficial';
    },
  ],
  [
    'chave oficial',
    (c) => {
      c.chave = 'revisoesEscolares.alice.gramatica.oficial.v1';
    },
  ],
  [
    'perfil incompatível',
    (c) => {
      c.aluno = 'mariana';
    },
  ],
  [
    'propriedade desconhecida',
    (c) => {
      c.modoResponsavel = { habilitado: true };
    },
  ],
  [
    'sem questões',
    (c) => {
      c.questoes = [];
    },
  ],
  [
    'tipo fora do contrato',
    (c) => {
      c.questoes[0].tipo = 'misto';
    },
  ],
  [
    'muitas questões',
    (c) => {
      c.questoes = Array(31).fill(c.questoes[0]);
    },
  ],
]) {
  test('configuração inativa recusa ' + nome, () => {
    const e = ambiente(),
      c = config();
    mutar(c);
    assert.equal(registrar(e, c).codigo, 'CONFIGURACAO_LAB_INVALIDA');
    assert.deepEqual(e.contagens(), { leituras: 0, escritas: 0, remocoes: 0 });
  });
}

test('cópia independente, sem executar getters/funções nem reter referência externa', () => {
  const e = ambiente();
  const c = e.copia(config());
  const r = e.api.registrarLab(() => c);
  assert.equal(r.ok, true);
  c.id = 'outro';
  c.questoes.length = 0;
  c.titulo = 'Outro';
  assert.equal(r.handle.consultar().registro.totalQuestoes, 1);
  assert.equal(r.handle.consultar().registro.id, 'lab-sintetico');
  const getter = e.copia(config('lab-getter', CHAVE.replace('sintetico', 'getter')));
  Object.defineProperty(getter, 'titulo', {
    enumerable: true,
    get() {
      throw new Error('Não executar');
    },
  });
  assert.equal(e.api.registrarLab(() => getter).codigo, 'CONFIGURACAO_LAB_INVALIDA');
});

test('colisões de ID/chave com legado e com LAB recusam sem substituir', () => {
  const e = ambiente();
  const oficial = e.copia(config());
  e.api.registrar(oficial);
  assert.equal(registrar(e).codigo, 'COLISAO_ID_LAB');
  assert.equal(registrar(e, config('lab-outro')).codigo, 'COLISAO_CHAVE_LAB');
  assert.equal(e.api.obterRevisao(oficial.id), oficial); // Prefixo LAB não transforma registro legado em removível.
  const lab = registrar(e, config('lab-dois', CHAVE.replace('sintetico', 'dois')));
  assert.equal(lab.ok, true);
  assert.equal(
    registrar(e, config('lab-dois', CHAVE.replace('sintetico', 'tres'))).codigo,
    'COLISAO_ID_LAB'
  );
  assert.equal(
    registrar(e, config('lab-tres', CHAVE.replace('sintetico', 'dois'))).codigo,
    'COLISAO_CHAVE_LAB'
  );
  lab.handle.liberar();
  assert.equal(e.api.obterRevisao(oficial.id), oficial);
});

test('chave auxiliar legada também é protegida contra registro LAB', () => {
  const e = ambiente();
  const oficial = e.copia(config('oficial', 'fixture-oficial'));
  oficial.modoResponsavel = { sessoes: [{ chaveArmazenamento: CHAVE }] };
  e.api.registrar(oficial);
  assert.equal(registrar(e).codigo, 'COLISAO_CHAVE_LAB');
});

test('sessões legadas inválidas continuam toleradas na busca de colisões', () => {
  const e = ambiente();
  const c = e.copia(config('oficial', 'fixture-oficial'));
  c.modoResponsavel = { sessoes: [null, 'inválida'] };
  e.api.registrar(c);
  const r = registrar(e);
  assert.equal(r.ok, true);
  r.handle.liberar();
  assert.equal(e.api.obterRevisao('oficial'), c);
});

test('getter then não é executado ao recusar configuração não declarativa', () => {
  const e = ambiente();
  const c = e.copia(config());
  let chamadas = 0;
  Object.defineProperty(c, 'then', {
    enumerable: true,
    get() {
      ++chamadas;
      throw new Error('Não executar');
    },
  });
  assert.equal(e.api.registrarLab(() => c).codigo, 'CONFIGURACAO_LAB_INVALIDA');
  assert.equal(chamadas, 0);
});

test('legado não pode adotar chave reservada enquanto LAB existe; demais registros seguem intactos', () => {
  const e = ambiente();
  const lab = registrar(e);
  assert.throws(() => e.api.registrar(e.copia(config('oficial', CHAVE))), /reservada/);
  const oficial = e.copia(config('oficial', 'fixture-oficial'));
  e.api.registrar(oficial);
  lab.handle.liberar();
  assert.equal(e.api.obterRevisao('oficial'), oficial);
});

test('forjados, métodos emprestados e argumentos de remoção são recusados', () => {
  const e = ambiente(),
    a = registrar(e).handle,
    b = registrar(e, config('lab-outro', CHAVE.replace('sintetico', 'outro'))).handle;
  assert.equal(a.liberar.call({}).codigo, 'HANDLE_INVALIDO');
  assert.equal(a.liberar.call(b).codigo, 'HANDLE_INVALIDO');
  const forjado = { ...a };
  assert.equal(forjado.liberar().codigo, 'HANDLE_INVALIDO');
  assert.equal(a.liberar('oficial').codigo, 'HANDLE_INVALIDO');
  assert.equal(a.consultar().ok, true);
  assert.equal(b.consultar().ok, true);
});

test('liberação idempotente preserva progresso, revoga consultas e não afeta handle vizinho', () => {
  const e = ambiente();
  const a = registrar(e).handle,
    b = registrar(e, config('lab-vizinho', CHAVE.replace('sintetico', 'vizinho'))).handle;
  e.dados.set(CHAVE, 'PRESERVAR');
  e.dados.set('fixture-oficial', 'OFICIAL');
  assert.equal(a.liberar().jaLiberado, false);
  assert.equal(a.liberar().jaLiberado, true);
  assert.equal(a.consultar().codigo, 'HANDLE_LIBERADO');
  assert.equal(a.abrir().codigo, 'HANDLE_LIBERADO');
  assert.equal(b.consultar().ok, true);
  assert.equal(e.dados.get(CHAVE), 'PRESERVAR');
  assert.deepEqual(e.contagens(), { leituras: 0, escritas: 0, remocoes: 0 });
});

test('abertura/limpeza/estado legados não atravessam o registro LAB nem criam cache', () => {
  const e = ambiente();
  const h = registrar(e).handle;
  assert.equal(h.abrir().codigo, 'ABERTURA_LAB_PENDENTE');
  assert.throws(() => e.api.abrir('lab-sintetico'), /LAB.2C.2/);
  assert.equal(e.api.limpar('lab-sintetico', true), false);
  assert.equal(e.api.obterEstado('lab-sintetico'), null);
  assert.equal(e.api.obterRevisao('lab-sintetico'), null);
  assert.equal(e.api.obterSituacao('lab-sintetico'), 'nao-iniciada');
  assert.deepEqual(e.contagens(), { leituras: 0, escritas: 0, remocoes: 0 });
  assert.equal(h.liberar().salvamento, 'nao-aplicavel-registro-inativo');
  assert.throws(() => e.api.abrir('lab-sintetico'), /não cadastrado/);
});

test('100 ciclos reutilizam ID/chave sem acúmulo e handle velho não libera o novo', () => {
  const e = ambiente();
  const velho = registrar(e).handle;
  velho.liberar();
  for (let n = 0; n < 100; n++) {
    const h = registrar(e).handle;
    assert.equal(h.consultar().ok, true);
    velho.liberar();
    assert.equal(h.consultar().ok, true);
    h.liberar();
  }
  const oficial = e.copia(config());
  e.api.registrar(oficial);
  velho.liberar();
  assert.equal(e.api.obterRevisao(oficial.id), oficial);
});

test('callbacks atrasados não reativam handle nem substituem registro oficial posterior', async () => {
  const e = ambiente();
  const h = registrar(e).handle;
  const atrasada = Promise.resolve().then(() => h.abrir());
  h.liberar();
  const oficial = e.copia(config());
  e.api.registrar(oficial);
  assert.equal((await atrasada).codigo, 'HANDLE_LIBERADO');
  assert.equal(e.api.obterRevisao(oficial.id), oficial);
  assert.equal(e.api.obterAtiva(), null);
});

let browser, server, origem;
before(async () => {
  server = http.createServer((req, res) => {
    if (req.url.endsWith('.svg')) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end('<svg xmlns="http://www.w3.org/2000/svg"/>');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<!doctype html><section id="tela-gramatica-mariana"><nav class="migalhas"><strong>Gramática</strong></nav><span id="gramatica-nome-perfil"></span><div id="gramatica-progresso"><div id="gramatica-barra"></div></div><span id="gramatica-contador"></span><span id="gramatica-pontos"></span><div id="gramatica-conteudo"></div><button id="gramatica-voltar">Voltar</button><button id="gramatica-proxima">Próxima</button><div id="gramatica-modo-responsavel" hidden></div><div id="gramatica-faixa-modo-responsavel" hidden></div></section>'
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
async function pagina(t) {
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await page.goto(origem);
  await page.evaluate(() => {
    window.QuestionariosInteracoes = { aceita: () => false };
    window.GramaticaDitado = { parar() {}, configurar() {} };
  });
  for (const file of [STORAGE, ENGINE]) await page.addScriptTag({ path: file });
  return page;
}

test('Chromium: revisão legada continua corrigindo/pontuando durante ciclos LAB inativos', async (t) => {
  const page = await pagina(t);
  await page.evaluate(
    (c) => {
      window.QuestionariosRevisoes.registrar(c);
      window.QuestionariosRevisoes.abrir(c.id);
    },
    config('oficial', 'fixture-oficial')
  );
  await page.locator('[data-opcao-gramatica="Lua"]').click();
  await page.locator('[data-conferir-gramatica]').click();
  assert.equal(
    await page.evaluate(() => window.QuestionariosRevisoes.obterEstado('oficial').pontos),
    0
  );
  await page.evaluate((c) => {
    window.lab = window.QuestionariosRevisoes.registrarLab(() => c).handle;
    for (let i = 0; i < 20; i++) {
      const cfg = { ...c, id: 'lab-ciclo', chave: c.chave.replace('sintetico', 'ciclo') };
      window.QuestionariosRevisoes.registrarLab(() => cfg).handle.liberar();
    }
    window.lab.liberar();
  }, config());
  assert.equal(await page.evaluate(() => window.QuestionariosRevisoes.obterAtiva().id), 'oficial');
  await page.locator('[data-opcao-gramatica="Sol"]').click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('[data-conferir-gramatica]').click();
  assert.equal(
    await page.evaluate(() => window.QuestionariosRevisoes.obterEstado('oficial').pontos),
    1
  );
  await page.locator('#gramatica-proxima').click();
  assert.equal(
    await page.evaluate(() => window.QuestionariosRevisoes.obterSituacao('oficial')),
    'concluida'
  );
});

test('Chromium: registro/liberação não adiciona listeners nem toca storage bloqueado', async (t) => {
  const page = await pagina(t);
  await page.evaluate(() => {
    window.eventos = 0;
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
      ++window.eventos;
      return add.apply(this, args);
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Não acessar');
      },
    });
  });
  const r = await page.evaluate((c) => {
    const antes = window.eventos;
    for (let i = 0; i < 50; i++) {
      const h = window.QuestionariosRevisoes.registrarLab(() => c).handle;
      h.consultar();
      h.liberar();
      h.liberar();
    }
    return { antes, depois: window.eventos };
  }, config());
  assert.equal(r.antes, r.depois);
});

test('Chromium: legado abre/desativa/reabre enquanto callbacks LAB revogados são ignorados', async (t) => {
  const page = await pagina(t);
  const r = await page.evaluate(
    async ({ lab, oficial }) => {
      const api = window.QuestionariosRevisoes;
      api.registrar(oficial);
      api.abrir(oficial.id);
      const h = api.registrarLab(() => lab).handle;
      const pendente = Promise.resolve().then(() => h.abrir());
      h.liberar();
      api.desativar();
      api.abrir(oficial.id);
      return {
        tardio: await pendente,
        ativa: api.obterAtiva().id,
        estado: api.obterEstado(oficial.id),
      };
    },
    { lab: config(), oficial: config('oficial', 'fixture-oficial') }
  );
  assert.equal(r.tardio.codigo, 'HANDLE_LIBERADO');
  assert.equal(r.ativa, 'oficial');
  assert.equal(r.estado.pontos, 0);
});

test('LAB.2D.5 layout interno fechado é opt-in e não acessa progresso', () => {
  for (const valor of [true, false]) {
    const e = ambiente();
    const c = config();
    c.layout = { desktopAmplo: valor };
    const r = registrar(e, c);
    assert.equal(r.ok, true);
    assert.deepEqual(e.contagens(), { leituras: 0, escritas: 0, remocoes: 0 });
  }
  for (const layout of [
    null,
    true,
    {},
    { desktopAmplo: 'true' },
    { desktopAmplo: true, classe: 'x' },
    { outra: true },
  ]) {
    const e = ambiente();
    const c = config();
    c.layout = layout;
    assert.equal(registrar(e, c).codigo, 'CONFIGURACAO_LAB_INVALIDA');
  }
});
