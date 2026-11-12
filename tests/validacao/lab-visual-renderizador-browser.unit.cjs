/* global window, document, Uint8Array, URL, HTMLImageElement, Event, setTimeout, innerWidth, navigator */
'use strict';
const { test, before, after } = require('node:test'),
  assert = require('node:assert/strict');
const fs = require('node:fs'),
  path = require('node:path'),
  http = require('node:http');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const f = require('./helpers/lab-visual-fixture.cjs'),
  p = require('./helpers/lab-visual-previa-fixture.cjs');
const grande = require('./helpers/lab-visual-ilustrada-fixture.cjs');
let browser, server, origem;
before(async () => {
  const arquivos = new Map();
  for (const n of [
    'lab-visual-analise',
    'lab-visual-zip-nucleo',
    'lab-visual-ilustrada',
    'lab-visual-renderizador',
  ])
    arquivos.set(
      '/ambiente_interativo/js/' + n + '.js',
      fs.readFileSync(path.join(__dirname, '../../ambiente_interativo/js/' + n + '.js'))
    );
  arquivos.set(
    '/ambiente_interativo/css/lab-visual-renderizador.css',
    fs.readFileSync(
      path.join(__dirname, '../../ambiente_interativo/css/lab-visual-renderizador.css')
    )
  );
  arquivos.set(
    '/',
    fs.readFileSync(path.join(__dirname, '../fixtures/lab-visual-renderizador.html'))
  );
  server = http.createServer((req, res) => {
    if (!arquivos.has(req.url)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type':
        req.url === '/'
          ? 'text/html; charset=utf-8'
          : req.url.endsWith('.css')
            ? 'text/css'
            : 'text/javascript',
    });
    res.end(arquivos.get(req.url));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((r) => server.close(r));
});
async function abrir(x = p.canarios(), viewport = { width: 390, height: 844 }) {
  const contexto = await browser.newContext({ viewport, hasTouch: true });
  const page = await contexto.newPage();
  await page.goto(origem);
  const r = await page.evaluate(
    async (bytes) => {
      window.s = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
      const p = await window.s.preparar(new Uint8Array(bytes));
      if (p.status !== 'ilustracao-disponivel') return p;
      window.r = window.LabVisualRenderizador.criarRenderizadorVisual(
        document.querySelector('#previa'),
        window.s
      );
      return window.r.consultarEstado();
    },
    [...p.zip(x)]
  );
  assert.equal(r.estado, 'inicial', JSON.stringify(r));
  return page;
}
async function render(page, i = 0) {
  return page.evaluate(async (i) => window.r.renderizarQuestao(i), i);
}
test('Chromium: fidelidade, posições, agrupamentos intercalados e textos literais', async () => {
  const x = p.canarios();
  x.m.questoes[0].visuais[0].elementos[0].acessibilidade = {
    tipo: 'essencial',
    descricao: 'Figura vermelha.',
    descricaoLonga: 'Descrição longa contextual, literal: <img onerror=alert(1)>',
  };
  x.m.questoes[0].visuais[0].elementos[0].rotulo = 'Figura A';
  const a = x.m.questoes[0].itens[0].alternativas;
  delete a[0].texto;
  a[1].visuais = [f.use('v-combinada', 'ponto', true)];
  const page = await abrir(x);
  try {
    assert.equal((await render(page)).estado, 'completo');
    const r = await page.evaluate(() => {
      const q = window.s.consultarProjecao().projecao.questoes[0],
        set = q.visuais[0];
      const n = document.querySelector('[data-conjunto]');
      return {
        elementos: [...n.querySelectorAll('figure')].map((f) => f.dataset.uso),
        esperados: set.elementos.map((v) => v.id),
        grupos: [...n.querySelector('ul[aria-label]').children].map((n) => n.textContent),
        marcas: [...n.querySelectorAll('figure')].map(
          (f) =>
            [...f.querySelectorAll('p')].find((p) => p.textContent.startsWith('Grupo:'))
              ?.textContent
        ),
        total: document.querySelectorAll('img').length,
        subitem: document.querySelector('[data-item] > figure img') !== null,
        alternativas: [...document.querySelectorAll('[data-alternativa]')].map((n) => ({
          img: !!n.querySelector('img'),
          texto: [...n.children].filter((n) => n.tagName === 'P').map((n) => n.textContent),
        })),
        instrucao: document.querySelector('article').textContent,
        alt: document.querySelector('img').alt,
        legenda: document.querySelector('figcaption').textContent,
        longa: document.querySelector('details').textContent,
        indevidos: document.querySelectorAll('input,textarea,select,iframe,b,script:not([src])')
          .length,
      };
    });
    assert.deepEqual(r.elementos, r.esperados);
    assert.deepEqual(r.grupos, ['Segundo', 'Primeiro']);
    assert.deepEqual(r.marcas, [
      'Grupo: Primeiro',
      'Grupo: Segundo',
      'Grupo: Primeiro',
      'Grupo: Segundo',
    ]);
    assert.equal(r.total, 7);
    assert.equal(r.subitem, true);
    assert.deepEqual(
      r.alternativas.map((a) => a.img),
      [true, true]
    );
    assert.deepEqual(r.alternativas[0].texto, []);
    assert.ok(r.instrucao.includes('<b>3 < 7 e 9 > 4 &lt;</b>'));
    assert.equal(r.alt, 'Figura vermelha.');
    assert.equal(r.legenda, 'Figura A');
    assert.ok(r.longa.includes('<img onerror=alert(1)>'));
    assert.equal(r.indevidos, 0);
    await render(page, 1);
    assert.equal(await page.locator('input,textarea').count(), 0);
    assert.ok(
      (await page.locator('article').textContent()).includes('Campo demonstrativo — vazio')
    );
    await render(page, 2);
    const texto = await page.locator('article').textContent();
    assert.ok(texto.includes('Ditado — item 1'));
    for (const alvo of [
      'AlvoSecretoCanario',
      'RespostaSecretaCanario',
      'orig-',
      'TituloAdministrativoCanario',
    ])
      assert.ok(!(await page.locator('body').textContent()).includes(alvo));
  } finally {
    await page.context().close();
  }
});
for (const apresentacao of ['comparacao', 'sequencia', 'grade'])
  test('Chromium: conjunto ' + apresentacao + ' conserva ordem e semântica estática', async () => {
    const x = f.vetor(3);
    x.m.questoes[0].visuais[0].apresentacao = apresentacao;
    const page = await abrir(x);
    try {
      await render(page);
      const r = await page.evaluate(() => {
        const n = document.querySelector('[data-conjunto]');
        return {
          ids: [...n.querySelectorAll('figure')].map((n) => n.dataset.uso),
          esperados: window.s
            .consultarProjecao()
            .projecao.questoes[0].visuais[0].elementos.map((n) => n.id),
          lista: n.querySelector('.lab-render-elementos').tagName,
          grids: document.querySelectorAll('[role=grid]').length,
        };
      });
      assert.deepEqual(r.ids, r.esperados);
      assert.equal(r.lista, apresentacao === 'sequencia' ? 'OL' : 'UL');
      assert.equal(r.grids, 0);
    } finally {
      await page.context().close();
    }
  });
for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
])
  test('Chromium: layout e axe ' + viewport.width, async () => {
    const x = p.canarios();
    x.m.questoes[0].instrucao = 'Texto longo ' + 'palavralonga'.repeat(35);
    const page = await abrir(x, viewport);
    try {
      await render(page);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false
      );
      const sizes = await page.locator('img').evaluateAll((imgs) =>
        imgs.map((i) => ({
          w: i.getBoundingClientRect().width,
          h: i.getBoundingClientRect().height,
          nw: i.naturalWidth,
          nh: i.naturalHeight,
        }))
      );
      for (const s of sizes) assert.ok(Math.abs(s.w / s.h - s.nw / s.nh) < 0.01);
      const axe = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(axe.violations, []);
    } finally {
      await page.context().close();
    }
  });
test('Chromium: orçamento real, teclado, foco, ocultar e exibir novamente', async () => {
  // Um hash de 4194304 pixels usado três vezes; duas instâncias cabem simultaneamente.
  const bytes = grande.pacotePNG(2048, 2048);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  try {
    await page.goto(origem);
    await page.evaluate(
      async (bytes) => {
        window.s = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        await window.s.preparar(new Uint8Array(bytes));
      },
      [...bytes]
    );
    // Novo manifesto sintético com três usos, mantendo o mesmo binário do helper.
    const zipHelper = require('./helpers/lab-visual-zip-fixture.cjs'),
      m = f.base(),
      b = grande.png(2048, 2048);
    f.recurso(m, 'grande', b, 'image/png', 2048, 2048);
    m.questoes[0].visuais = [0, 1, 2].map((i) => f.use('v' + i, 'grande', true));
    await page.evaluate(
      async (bytes) => {
        await window.s.preparar(new Uint8Array(bytes));
        window.r = window.LabVisualRenderizador.criarRenderizadorVisual(
          document.querySelector('#previa'),
          window.s
        );
      },
      [...zipHelper.construir(zipHelper.entradas(m, [b]))]
    );
    const estado = await render(page);
    assert.equal(estado.estado, 'imagens-adiadas');
    assert.equal(estado.figuras.exibidas, 2);
    const ocultar = page.getByRole('button', { name: 'Ocultar figura 1', exact: true });
    await ocultar.focus();
    await page.keyboard.press('Enter');
    assert.equal(
      await page
        .getByRole('button', { name: 'Exibir figura 1', exact: true })
        .evaluate((n) => n === document.activeElement),
      true
    );
    const exibir = page.getByRole('button', { name: 'Exibir figura 3', exact: true });
    await exibir.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(
      () =>
        window.r.consultarEstado().figuras.exibidas === 2 &&
        document.querySelectorAll('figure')[2].querySelector('img')
    );
    assert.equal(
      await page
        .getByRole('button', { name: 'Ocultar figura 3', exact: true })
        .evaluate((n) => n === document.activeElement),
      true
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    );
    const s = await page.evaluate(() => ({
      r: window.r.consultarEstado(),
      s: window.s.consultarEstado(),
    }));
    assert.equal(s.r.estado, 'imagens-adiadas');
    assert.equal(s.s.observacao.pixelsEmUso, 8388608);
    await page.getByRole('button', { name: 'Ocultar figura 3', exact: true }).tap();
    await page.evaluate(() => window.r.descartar());
    assert.equal(await page.evaluate(() => window.s.consultarEstado().observacao.pixelsEmUso), 0);
  } finally {
    await page.context().close();
  }
});
test('Chromium: recusa da fila pode ser tentada novamente sem loop', async () => {
  const page = await abrir(f.vetor(1));
  try {
    await page.evaluate(() => {
      const svc = window.s,
        original = svc.criarApresentacao;
      // Fachada de teste confiável; não altera 3C.1. Só o primeiro pedido fica ocupado.
      let n = 0;
      window.r.descartar();
      const facade = {
        consultarEstado: svc.consultarEstado,
        consultarProjecao: svc.consultarProjecao,
        criarApresentacao: (u) =>
          ++n === 1
            ? Promise.resolve({ status: 'recusado', erros: [{ codigo: 'ILUSTRADA_FILA_OCUPADA' }] })
            : original(u),
      };
      window.r = window.LabVisualRenderizador.criarRenderizadorVisual(
        document.querySelector('#previa'),
        facade
      );
    });
    assert.equal((await render(page)).estado, 'imagens-adiadas');
    await page.getByRole('button', { name: 'Exibir figura 1', exact: true }).click();
    await page.waitForFunction(() => window.r.consultarEstado().estado === 'completo');
  } finally {
    await page.context().close();
  }
});
test('Chromium: falha nativa de apresentação após primeira imagem causa rollback', async () => {
  const page = await abrir(f.vetor(3));
  try {
    const r = await page.evaluate(async () => {
      const create = URL.createObjectURL.bind(URL),
        revoke = URL.revokeObjectURL.bind(URL),
        decode = HTMLImageElement.prototype.decode;
      let criadas = 0,
        erros = 0;
      const vivas = new Set();
      URL.createObjectURL = (b) => {
        const url = create(b);
        vivas.add(url);
        if (++criadas === 2) {
          revoke(url);
          vivas.delete(url);
        }
        return url;
      };
      URL.revokeObjectURL = (u) => {
        vivas.delete(u);
        revoke(u);
      };
      HTMLImageElement.prototype.decode = async function () {
        try {
          return await decode.call(this);
        } catch (e) {
          erros++;
          throw e;
        }
      };
      const result = await window.r.renderizarQuestao(0);
      return {
        result,
        s: window.s.consultarEstado(),
        r: window.r.consultarEstado(),
        imgs: document.querySelectorAll('img').length,
        artigos: document.querySelectorAll('article').length,
        erros,
        vivas: vivas.size,
        criadas,
      };
    });
    assert.equal(r.result.status, 'recusado');
    assert.equal(r.r.estado, 'falha');
    assert.equal(r.s.estado, 'falha');
    assert.equal(r.erros, 1);
    assert.equal(r.criadas, 2);
    assert.equal(r.vivas, 0);
    assert.equal(r.s.observacao.pixelsEmUso, 0);
    assert.equal(r.imgs, 0);
    assert.equal(r.artigos, 0);
  } finally {
    await page.context().close();
  }
});
for (const modo of ['limpar', 'descartar'])
  test('Chromium: ' + modo + ' durante resultado atrasado não insere imagem antiga', async () => {
    const page = await abrir(p.canarios());
    try {
      const r = await page.evaluate(async (modo) => {
        window.r.descartar();
        const s = window.s;
        let soltar, entrar;
        const gate = new Promise((r) => {
            soltar = r;
          }),
          entry = new Promise((r) => {
            entrar = r;
          });
        let calls = 0;
        const facade = {
          consultarEstado: s.consultarEstado,
          consultarProjecao: s.consultarProjecao,
          criarApresentacao: async (u) => {
            const h = await s.criarApresentacao(u);
            if (++calls === 1) {
              entrar();
              await gate;
            }
            return h;
          },
        };
        window.r = window.LabVisualRenderizador.criarRenderizadorVisual(
          document.querySelector('#previa'),
          facade
        );
        const antiga = window.r.renderizarQuestao(0);
        await entry;
        window.r[modo]();
        const cancelada = await antiga;
        if (modo === 'limpar') await window.r.renderizarQuestao(2);
        soltar();
        await new Promise((r) => setTimeout(r, 0));
        return {
          cancelada,
          estado: window.r.consultarEstado(),
          imgs: document.querySelectorAll('img').length,
          artigo: document.querySelector('article')?.textContent,
          pixels: s.consultarEstado().observacao.pixelsEmUso,
        };
      }, modo);
      assert.equal(r.cancelada.erros[0].codigo, 'RENDER_INVALIDADO');
      assert.equal(r.imgs, 0);
      assert.equal(r.pixels, 0);
      assert.equal(r.estado.estado, modo === 'limpar' ? 'completo' : 'descartado');
      if (modo === 'limpar') assert.ok(r.artigo.includes('Ditado — item 1'));
    } finally {
      await page.context().close();
    }
  });
test('Chromium: erro tardio, propriedade, substituição externa e recuperação cooperativa', async () => {
  const x = f.vetor(1),
    page = await abrir(x);
  try {
    await render(page);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#previa');
      const duplicado = window.LabVisualRenderizador.criarRenderizadorVisual(root, window.s);
      document.querySelector('img').dispatchEvent(new Event('error'));
      return {
        duplicado,
        estado: window.r.consultarEstado(),
        s: window.s.consultarEstado(),
        imgs: document.querySelectorAll('img').length,
      };
    });
    assert.equal(r.duplicado.erros[0].codigo, 'RENDER_PROPRIEDADE_OCUPADA');
    assert.equal(r.estado.estado, 'falha');
    assert.equal(r.imgs, 0);
    assert.equal(r.s.estado, 'falha');
    await page.evaluate(
      async (bytes) => {
        window.r.limpar();
        await window.s.preparar(new Uint8Array(bytes));
        await window.r.renderizarQuestao(0);
      },
      [...p.zip(x)]
    );
    assert.equal(await page.evaluate(() => window.r.consultarEstado().estado), 'completo');
    await page.evaluate(
      async (bytes) => {
        await window.s.preparar(new Uint8Array(bytes));
      },
      [...p.zip(x)]
    );
    assert.equal(await page.evaluate(() => window.r.consultarEstado().estado), 'falha');
  } finally {
    await page.context().close();
  }
});
for (const interno of [true, false])
  test(
    'Chromium: falha tardia preserva o destino de foco ' + (interno ? 'interno' : 'externo'),
    async () => {
      const page = await abrir(f.vetor(1));
      try {
        const result = await page.evaluate(async (interno) => {
          const listeners = new Map(),
            urls = new Set(),
            proto = window.EventTarget.prototype,
            add = proto.addEventListener,
            remove = proto.removeEventListener,
            create = URL.createObjectURL.bind(URL),
            revoke = URL.revokeObjectURL.bind(URL);
          const acompanhar = (n, tipo) =>
            (n.tagName === 'IMG' && tipo === 'error') ||
            (n.tagName === 'BUTTON' && tipo === 'click');
          proto.addEventListener = function (tipo, fn, ...args) {
            if (acompanhar(this, tipo)) {
              if (!listeners.has(this)) listeners.set(this, new Set());
              listeners.get(this).add(fn);
            }
            return add.call(this, tipo, fn, ...args);
          };
          proto.removeEventListener = function (tipo, fn, ...args) {
            listeners.get(this)?.delete(fn);
            return remove.call(this, tipo, fn, ...args);
          };
          URL.createObjectURL = (blob) => {
            const url = create(blob);
            urls.add(url);
            return url;
          };
          URL.revokeObjectURL = (url) => {
            urls.delete(url);
            revoke(url);
          };
          const inicial = await window.r.renderizarQuestao(0),
            root = document.querySelector('#previa'),
            botao = root.querySelector('button'),
            imagem = root.querySelector('img'),
            externo = document.createElement('button');
          externo.textContent = 'Controle externo';
          document.body.prepend(externo);
          const destino = interno ? botao : externo;
          destino.focus();
          const focoAntes = document.activeElement === destino,
            pixelsAntes = window.s.consultarEstado().observacao.pixelsEmUso,
            listenersAntes = [...listeners.values()].reduce((n, s) => n + s.size, 0);
          imagem.dispatchEvent(new Event('error'));
          const aviso = root.querySelector('[role="status"]');
          return {
            inicial: inicial.estado,
            focoAntes,
            pixelsAntes,
            listenersAntes,
            estado: window.r.consultarEstado().estado,
            focoCorreto: document.activeElement === (interno ? aviso : externo),
            mensagem: aviso?.textContent,
            tabindex: aviso?.getAttribute('tabindex'),
            ariaLive: aviso?.getAttribute('aria-live'),
            artigos: root.querySelectorAll('article').length,
            imagens: root.querySelectorAll('img').length,
            pixelsDepois: window.s.consultarEstado().observacao.pixelsEmUso,
            listenersDepois: [...listeners.values()].reduce((n, s) => n + s.size, 0),
            urlsDepois: urls.size,
            admissaoOperacional: window.r.consultarEstado().admissaoOperacional,
          };
        }, interno);
        assert.equal(result.inicial, 'completo');
        assert.equal(result.focoAntes, true);
        assert.ok(result.pixelsAntes > 0);
        assert.ok(result.listenersAntes >= 3);
        assert.equal(result.estado, 'falha');
        assert.equal(result.focoCorreto, true);
        assert.ok(result.mensagem.includes('Não foi possível mostrar esta questão'));
        assert.equal(result.tabindex, interno ? '-1' : null);
        assert.equal(result.ariaLive, interno ? 'off' : null);
        assert.equal(result.artigos, 0);
        assert.equal(result.imagens, 0);
        assert.equal(result.pixelsDepois, 0);
        assert.equal(result.listenersDepois, 0);
        assert.equal(result.urlsDepois, 0);
        assert.equal(result.admissaoOperacional, false);
      } finally {
        await page.context().close();
      }
    }
  );
test('Chromium: resultado de geração obsoleta não rouba foco da questão atual', async () => {
  const page = await abrir(p.canarios());
  try {
    const result = await page.evaluate(async () => {
      window.r.descartar();
      const s = window.s;
      let entrar, soltar;
      const entrada = new Promise((r) => {
          entrar = r;
        }),
        gate = new Promise((r) => {
          soltar = r;
        });
      let handle;
      const facade = {
        consultarEstado: s.consultarEstado,
        consultarProjecao: s.consultarProjecao,
        criarApresentacao: async (uso) => {
          handle = await s.criarApresentacao(uso);
          entrar();
          await gate;
          return handle;
        },
      };
      window.r = window.LabVisualRenderizador.criarRenderizadorVisual(
        document.querySelector('#previa'),
        facade
      );
      const antiga = window.r.renderizarQuestao(0);
      await entrada;
      const pixelsAntes = s.consultarEstado().observacao.pixelsEmUso;
      window.r.limpar();
      const cancelada = await antiga,
        atual = await window.r.renderizarQuestao(2),
        titulo = document.querySelector('h2');
      titulo.setAttribute('tabindex', '-1');
      titulo.focus();
      soltar();
      await new Promise((r) => setTimeout(r, 0));
      return {
        pixelsAntes,
        cancelada,
        atual: atual.estado,
        estado: window.r.consultarEstado().estado,
        focoPreservado: document.activeElement === titulo,
        handle: handle.consultarEstado().estado,
        pixelsDepois: s.consultarEstado().observacao.pixelsEmUso,
        imagens: document.querySelectorAll('img').length,
        texto: document.querySelector('article').textContent,
      };
    });
    assert.ok(result.pixelsAntes > 0);
    assert.equal(result.cancelada.erros[0].codigo, 'RENDER_INVALIDADO');
    assert.equal(result.atual, 'completo');
    assert.equal(result.estado, 'completo');
    assert.equal(result.focoPreservado, true);
    assert.equal(result.handle, 'liberada');
    assert.equal(result.pixelsDepois, 0);
    assert.equal(result.imagens, 0);
    assert.ok(result.texto.includes('Ditado — item 1'));
  } finally {
    await page.context().close();
  }
});
test('Chromium: isolamento operacional e textos avaliativos ausentes', async () => {
  const page = await abrir(p.canarios()),
    requests = [],
    logs = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('blob:')) requests.push(r.url());
  });
  page.on('console', (m) => logs.push(m.text()));
  try {
    const r = await page.evaluate(async () => {
      let efeitos = 0;
      for (const key of [
        'fetch',
        'localStorage',
        'sessionStorage',
        'indexedDB',
        'Audio',
        'AudioContext',
        'speechSynthesis',
        'LabCoordenador',
        'LabRepositorio',
        'GramaticaQuestionarios',
        'WebSocket',
      ])
        Object.defineProperty(window, key, {
          configurable: true,
          get() {
            efeitos++;
            throw Error('efeito proibido');
          },
        });
      Object.defineProperty(navigator, 'mediaDevices', {
        configurable: true,
        get() {
          efeitos++;
          throw Error('microfone proibido');
        },
      });
      const states = [];
      for (let i = 0; i < 3; i++) states.push(await window.r.renderizarQuestao(i));
      const dom = document.querySelector('#previa').outerHTML;
      window.r.descartar();
      return { efeitos, states, dom, s: window.s.consultarEstado() };
    });
    assert.equal(r.efeitos, 0);
    assert.deepEqual(requests, []);
    for (const s of r.states) assert.equal(s.admissaoOperacional, false);
    for (const segredo of [
      'AlvoSecretoCanario',
      'RespostaSecretaCanario',
      'orig-',
      'TituloAdministrativoCanario',
    ])
      assert.ok(!r.dom.includes(segredo) && !logs.join('').includes(segredo));
    assert.equal(r.s.observacao.pixelsEmUso, 0);
    assert.equal(r.s.estado, 'disponivel');
  } finally {
    await page.context().close();
  }
});
