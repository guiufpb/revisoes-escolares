/* global window, document, Event, HTMLImageElement, FileReader, innerWidth, navigator */
'use strict';
const { test, before, after } = require('node:test'),
  assert = require('node:assert/strict');
const fs = require('node:fs'),
  path = require('node:path'),
  http = require('node:http');
const { chromium } = require('playwright'),
  AxeBuilder = require('@axe-core/playwright').default;
const p = require('./helpers/lab-visual-previa-fixture.cjs'),
  f = require('./helpers/lab-visual-fixture.cjs');
let server, browser, origem;
before(async () => {
  const arquivos = new Map();
  for (const n of ['analise', 'zip-nucleo', 'ilustrada', 'renderizador', 'navegacao'])
    arquivos.set(
      '/js/lab-visual-' + n + '.js',
      fs.readFileSync(path.join(__dirname, '../../ambiente_interativo/js/lab-visual-' + n + '.js'))
    );
  for (const n of ['renderizador', 'navegacao'])
    arquivos.set(
      '/css/lab-visual-' + n + '.css',
      fs.readFileSync(
        path.join(__dirname, '../../ambiente_interativo/css/lab-visual-' + n + '.css')
      )
    );
  arquivos.set(
    '/',
    fs
      .readFileSync(
        path.join(__dirname, '../../ambiente_interativo/lab-visual-previa.html'),
        'utf8'
      )
      .replace(
        "window.LabVisualNavegacao.criarPreviaNavegavelVisual(document.getElementById('lab-previa'));",
        ''
      )
  );
  arquivos.set(
    '/original',
    fs.readFileSync(path.join(__dirname, '../../ambiente_interativo/lab-visual-previa.html'))
  );
  server = http.createServer((req, res) => {
    if (!arquivos.has(req.url)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type':
        req.url === '/' || req.url === '/original'
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
async function abrir(viewport = { width: 390, height: 844 }) {
  const c = await browser.newContext({ viewport, hasTouch: true }),
    page = await c.newPage();
  await page.addInitScript(() => {
    window.servicos = [];
    Object.defineProperty(window, 'LabVisualIlustrada', {
      configurable: true,
      set(api) {
        Object.defineProperty(window, 'LabVisualIlustrada', {
          configurable: true,
          value: {
            criarPreparacaoIlustradaVisual() {
              const s = api.criarPreparacaoIlustradaVisual();
              window.servicos.push(s);
              return s;
            },
          },
        });
      },
    });
  });
  await page.goto(origem);
  await page.evaluate(() => {
    window.n = window.LabVisualNavegacao.criarPreviaNavegavelVisual(document.querySelector('main'));
  });
  return page;
}
async function selecionar(page, x = p.canarios()) {
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'sintetico.zip', mimeType: 'application/zip', buffer: p.zip(x) });
}
async function pronto(page) {
  await page.waitForFunction(() => window.n.consultarEstado().estado === 'disponivel');
}
test('Chromium: página original inicializa sem instrumentação ou integração escolar', async () => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage(),
    erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  try {
    await page.goto(origem + '/original');
    await selecionar(page, f.vetor(1));
    await page.waitForFunction(
      () =>
        document.querySelector('article') &&
        [...document.querySelectorAll('p')].some((n) => n.textContent === 'Questão 1 de 1')
    );
    assert.equal(await page.locator('article').count(), 1);
    assert.deepEqual(erros, []);
  } finally {
    await contexto.close();
  }
});
test('Chromium: seleção real, anterior/próxima, limites, mesmo arquivo e cancelamento', async () => {
  const page = await abrir();
  try {
    await selecionar(page);
    await pronto(page);
    assert.equal(await page.locator('input').inputValue(), '');
    assert.equal(
      await page
        .getByRole('button', { name: 'Anterior', exact: true })
        .getAttribute('aria-disabled'),
      'true'
    );
    await page.getByRole('button', { name: 'Próxima', exact: true }).click();
    await pronto(page);
    assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 1);
    await page.getByRole('button', { name: 'Próxima', exact: true }).click();
    await pronto(page);
    assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 2);
    assert.equal(
      await page
        .getByRole('button', { name: 'Próxima', exact: true })
        .getAttribute('aria-disabled'),
      'true'
    );
    await page.getByRole('button', { name: 'Anterior', exact: true }).click();
    await pronto(page);
    await page.locator('input').dispatchEvent('cancel');
    assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 1);
    await selecionar(page);
    await pronto(page);
    assert.equal(await page.evaluate(() => window.servicos.length), 2);
    assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 0);
    await page.getByRole('button', { name: 'Encerrar prévia' }).click();
    assert.equal(await page.locator('article').count(), 0);
  } finally {
    await page.context().close();
  }
});
for (const caso of ['vazio', 'invalido', 'leitura', 'excesso'])
  test('Chromium: recusa recuperável ' + caso, async () => {
    const page = await abrir();
    try {
      await selecionar(page);
      await pronto(page);
      if (caso === 'leitura')
        await page.evaluate(() => {
          FileReader.prototype.readAsArrayBuffer = function () {
            this.dispatchEvent(new Event('error'));
          };
        });
      if (caso === 'excesso')
        await page.evaluate(() => {
          Object.defineProperty(window.File.prototype, 'size', {
            get() {
              return 71303169;
            },
          });
          FileReader.prototype.readAsArrayBuffer = () => {
            throw Error('não deve ler');
          };
        });
      const bytes =
        caso === 'vazio'
          ? Buffer.alloc(0)
          : caso === 'invalido'
            ? Buffer.from('invalido')
            : p.zip(f.vetor(1));
      await page
        .locator('input')
        .setInputFiles({ name: 'outro.zip', mimeType: 'application/zip', buffer: bytes });
      await page.waitForFunction(() => window.n.consultarEstado().estado === 'falha');
      assert.equal(await page.locator('article').count(), 0);
      assert.equal(
        await page.evaluate(() => window.n.consultarEstado().admissaoOperacional),
        false
      );
    } finally {
      await page.context().close();
    }
  });
for (const interno of [true, false])
  test(
    'Chromium: falha tardia, foco ' + (interno ? 'interno' : 'externo') + ' e recuperação',
    async () => {
      const page = await abrir();
      try {
        await selecionar(page);
        await pronto(page);
        assert.equal(
          await page
            .getByRole('button', { name: 'Próxima', exact: true })
            .getAttribute('aria-disabled'),
          'false'
        );
        const r = await page.evaluate((interno) => {
          const alvo = interno
            ? document.querySelector('figure button')
            : document.querySelector('input');
          alvo.focus();
          document.querySelector('img').dispatchEvent(new Event('error'));
          window.avisoDeFalha = document.querySelector(
            'section[aria-label="Questão ilustrada"] [role="status"]'
          );
          return {
            preservado: document.activeElement === (interno ? window.avisoDeFalha : alvo),
            tabindex: window.avisoDeFalha?.getAttribute('tabindex'),
          };
        }, interno);
        assert.equal(r.preservado, true);
        if (interno) assert.equal(r.tabindex, '-1');
        // Observar só o DOM: consultarEstado() também atualiza controles e mascararia ausência do observer.
        await page.waitForFunction(
          () =>
            [...document.querySelectorAll('nav button')]
              .find((n) => n.textContent === 'Próxima')
              ?.getAttribute('aria-disabled') === 'true'
        );
        if (interno)
          assert.equal(
            await page.evaluate(
              () =>
                document.activeElement === window.avisoDeFalha &&
                window.avisoDeFalha.getAttribute('tabindex') === '-1'
            ),
            true
          );
        assert.equal(await page.evaluate(() => window.n.consultarEstado().estado), 'falha');
        assert.equal(await page.locator('article').count(), 0);
        assert.equal(
          await page.evaluate(() => window.servicos[0].consultarEstado().observacao.pixelsEmUso),
          0
        );
        await selecionar(page);
        await pronto(page);
      } finally {
        await page.context().close();
      }
    }
  );
test('Chromium: decode nativo retido, candidato único e encerramento sem sobreposição', async () => {
  const page = await abrir();
  try {
    await page.evaluate(() => {
      const original = HTMLImageElement.prototype.decode;
      let primeira = true;
      window.decodeEntrou = false;
      window.gate = new Promise((r) => {
        window.soltar = r;
      });
      HTMLImageElement.prototype.decode = async function () {
        if (primeira) {
          primeira = false;
          window.decodeEntrou = true;
          await window.gate;
        }
        return original.call(this);
      };
    });
    await selecionar(page);
    await page.waitForFunction(() => window.decodeEntrou);
    await selecionar(page, f.vetor(1));
    await selecionar(page, f.vetor(0));
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => window.servicos.length), 1);
    assert.equal(
      await page.evaluate(
        () => window.servicos[0].consultarEstado().observacao.decodificacoesAtivas
      ),
      1
    );
    await page.evaluate(() => window.soltar());
    await pronto(page);
    assert.equal(await page.evaluate(() => window.servicos.length), 2);
    assert.equal(await page.locator('img').count(), 0);
    await page.evaluate(() => {
      window.n.encerrar();
      window.n.encerrar();
      window.n.descartar();
      window.n.descartar();
    });
    assert.equal(await page.evaluate(() => window.n.consultarEstado().estado), 'descartada');
  } finally {
    await page.context().close();
  }
});
for (const encerrar of [false, true])
  test(
    'Chromium: apresentação pendente, foco externo e ' +
      (encerrar ? 'encerramento' : 'cliques rápidos'),
    async () => {
      const page = await abrir();
      try {
        const x = p.canarios();
        x.m.questoes[1].visuais = [f.use('campo-visual', 'ponto', true)];
        await selecionar(page, x);
        await pronto(page);
        await page.evaluate(() => {
          const decode = HTMLImageElement.prototype.decode;
          window.entrou = false;
          window.gate = new Promise((r) => {
            window.soltar = r;
          });
          HTMLImageElement.prototype.decode = async function () {
            window.entrou = true;
            await window.gate;
            return decode.call(this);
          };
          const b = [...document.querySelectorAll('nav button')].find(
            (n) => n.textContent === 'Próxima'
          );
          b.focus();
          b.click();
          b.click();
        });
        await page.waitForFunction(() => window.entrou);
        assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 1);
        await page.locator('input').focus();
        if (encerrar) await page.evaluate(() => window.n.encerrar());
        await page.evaluate(() => window.soltar());
        if (encerrar) {
          await page.waitForFunction(
            () => window.servicos[0].consultarEstado().observacao.decodificacoesAtivas === 0
          );
          assert.equal(await page.evaluate(() => window.n.consultarEstado().estado), 'encerrada');
          assert.equal(await page.locator('article').count(), 0);
        } else await pronto(page);
        assert.equal(await page.evaluate(() => document.activeElement.tagName), 'INPUT');
      } finally {
        await page.context().close();
      }
    }
  );
test('Chromium: questão única, ausência de dados avaliativos e efeitos operacionais', async () => {
  const page = await abrir(),
    requests = [],
    logs = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('blob:')) requests.push(r.url());
  });
  page.on('console', (m) => logs.push(m.text()));
  try {
    await page.evaluate(() => {
      window.efeitos = 0;
      for (const k of [
        'fetch',
        'localStorage',
        'sessionStorage',
        'indexedDB',
        'Audio',
        'WebSocket',
      ])
        Object.defineProperty(window, k, {
          configurable: true,
          get() {
            window.efeitos++;
            throw Error('proibido');
          },
        });
      Object.defineProperty(navigator, 'mediaDevices', {
        get() {
          window.efeitos++;
          throw Error('proibido');
        },
      });
    });
    await selecionar(page);
    await pronto(page);
    const texto = await page.locator('body').evaluate((n) => n.outerHTML),
      estado = await page.evaluate(() => JSON.stringify(window.n.consultarEstado()));
    for (const canario of [
      'RespostaSecretaCanario',
      'AlvoSecretoCanario',
      'TituloAdministrativoCanario',
      'orig-',
    ]) {
      assert.ok(!texto.includes(canario));
      assert.ok(!estado.includes(canario));
      assert.ok(!logs.join('').includes(canario));
    }
    await selecionar(page, f.vetor(1));
    await pronto(page);
    assert.equal(await page.evaluate(() => window.n.consultarEstado().total), 1);
    assert.equal(
      await page
        .getByRole('button', { name: 'Próxima', exact: true })
        .getAttribute('aria-disabled'),
      'true'
    );
    assert.equal(await page.evaluate(() => window.efeitos), 0);
    assert.deepEqual(requests, []);
  } finally {
    await page.context().close();
  }
});
for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
])
  test('Chromium: axe, teclado, toque e layout ' + viewport.width, async () => {
    const page = await abrir(viewport);
    try {
      await selecionar(page);
      await pronto(page);
      const prox = page.getByRole('button', { name: 'Próxima', exact: true });
      await prox.focus();
      await page.keyboard.press('Enter');
      await pronto(page);
      assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Questão 2 de 3');
      await page.getByRole('button', { name: 'Anterior', exact: true }).tap();
      await pronto(page);
      assert.equal(await page.evaluate(() => window.n.consultarEstado().indice), 0);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false
      );
      assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    } finally {
      await page.context().close();
    }
  });
