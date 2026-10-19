const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createHash } = require('node:crypto');
const { URL, pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const { imagePdf } = require('./fixtures/imagens-pdf.cjs');
const { fixtures } = require('./fixtures/pdfs.cjs');

const root = path.resolve(__dirname, '..');
let server, origin, base, packageRoot;
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.wasm': 'application/wasm',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain; charset=utf-8',
};

test.beforeAll(async () => {
  const parent = path.join(root, 'tmp');
  fs.mkdirSync(parent, { recursive: true });
  packageRoot = fs.mkdtempSync(path.join(parent, 'pdfjs-static-'));
  // Copy only public application files. No node_modules, Vite runtime or school PDFs.
  fs.cpSync(path.join(root, 'ambiente_interativo'), path.join(packageRoot, 'ambiente_interativo'), {
    recursive: true,
    filter: (file) => !file.toLowerCase().endsWith('.pdf'),
  });
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    response.setHeader('Cache-Control', 'no-store');
    if (pathname === '/escola/probe.html') {
      response.setHeader('Content-Type', 'text/html');
      response.end(
        '<!doctype html><script type="module" src="./ambiente_interativo/js/pdfjs.bundle.mjs"></script>'
      );
      return;
    }
    const synthetic = /^\/escola\/image-(jpx|ccitt)\.pdf$/.exec(pathname);
    if (synthetic || pathname === '/escola' + fixtures[0].url) {
      response.setHeader('Content-Type', 'application/pdf');
      response.end(imagePdf(synthetic ? synthetic[1] : 'jpx', synthetic ? 1 : fixtures[0].pages));
      return;
    }
    const relative = pathname.replace(/^\/escola\//, '');
    const file = path.resolve(packageRoot, relative);
    if (
      !pathname.startsWith('/escola/') ||
      !file.startsWith(packageRoot + path.sep) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      response.statusCode = 404;
      response.end();
      return;
    }
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
  base = origin + '/escola';
});
test.afterAll(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

async function localOnly(context) {
  const external = [];
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin || ['blob:', 'data:'].includes(url.protocol)) return route.continue();
    external.push(url.origin);
    return route.abort();
  });
  return external;
}

// Inspect pixels only of the original synthetic checkerboard, never private documents.
async function checkerboard(canvas) {
  return canvas.evaluate((c) => {
    const ctx = c.getContext('2d');
    const a = ctx.getImageData(
      Math.floor(c.width * 0.125),
      Math.floor(c.height * 0.125),
      1,
      1
    ).data;
    const b = ctx.getImageData(
      Math.floor(c.width * 0.375),
      Math.floor(c.height * 0.125),
      1,
      1
    ).data;
    const black = (p) => p[0] < 5 && p[1] < 5 && p[2] < 5 && p[3] === 255;
    const white = (p) => p[0] > 250 && p[1] > 250 && p[2] > 250 && p[3] === 255;
    return (black(a) && white(b)) || (white(a) && black(b));
  });
}

test('pacote estático contém os 13 recursos oficiais idênticos, com MIME e sem node_modules', async ({
  request,
}) => {
  expect(fs.existsSync(path.join(packageRoot, 'node_modules'))).toBe(false);
  const source = path.join(root, 'node_modules/pdfjs-dist/wasm');
  const files = fs.readdirSync(source).sort();
  expect(files).toHaveLength(13);
  expect(
    fs.readdirSync(path.join(packageRoot, 'ambiente_interativo/js/pdfjs-wasm')).sort()
  ).toEqual(files);
  for (const name of files) {
    const response = await request.get(base + '/ambiente_interativo/js/pdfjs-wasm/' + name);
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(fs.readFileSync(path.join(source, name)));
    if (name.endsWith('.wasm')) expect(response.headers()['content-type']).toBe('application/wasm');
    if (name.endsWith('.js')) expect(response.headers()['content-type']).toBe('text/javascript');
  }
  const noticePath = 'ambiente_interativo/js/QUICKJS_LICENSE.txt';
  const noticeResponse = await request.get(base + '/' + noticePath);
  expect(noticeResponse.status()).toBe(200);
  expect(noticeResponse.headers()['content-type']).toBe('text/plain; charset=utf-8');
  const notice = await noticeResponse.body();
  expect(notice).toEqual(fs.readFileSync(path.join(packageRoot, noticePath)));
  const noticeText = notice.toString('utf8');
  expect(noticeText).toContain('PDF.js 6.3.289');
  expect(noticeText).toContain('a3beacc1a35f2d285f0505c5489d8cb4a9ebcc89');
  // Exact upstream MIT texts from Mozilla's license-only fix; no network in tests.
  for (const [name, sha256] of [
    ['LICENSE_PDFJS_QUICKJS', '7fdaed3d938f3dfce7189db07e74773c23789143a55db81a95d09dcbfda267b0'],
    ['LICENSE_QUICKJS', '598fd7fc928e4350abce36e337ba5a1346923c5c692f5be92c3d8e29ddd7c18d'],
  ]) {
    const sections = noticeText.split(`--- BEGIN ${name} ---\n`);
    expect(sections).toHaveLength(2);
    const ending = sections[1].split(`--- END ${name} ---`);
    expect(ending).toHaveLength(2);
    expect(createHash('sha256').update(ending[0]).digest('hex')).toBe(sha256);
  }
  expect((await request.get(origin + '/node_modules/pdfjs-dist/wasm/openjpeg.wasm')).status()).toBe(
    404
  );
});

for (const codec of ['jpx', 'ccitt']) {
  for (const fallback of [false, true]) {
    test(`${codec}: imagem decodificada no pacote offline${fallback ? ', inclusive fallback JS sob falha WASM' : ''}`, async ({
      page,
      context,
    }) => {
      const external = await localOnly(context);
      const failures = [];
      page.on('pageerror', () => failures.push('pageerror'));
      page.on('console', (message) => {
        if (
          message.type() === 'warning' &&
          /Unable to decode image|Dependent image isn't ready|#getJsModule/.test(message.text())
        )
          failures.push('decode');
        if (!fallback && message.type() === 'error') failures.push('consoleerror');
      });
      const wasm = codec === 'jpx' ? 'openjpeg' : 'jbig2';
      if (fallback)
        await context.route(`**/pdfjs-wasm/${wasm}.wasm`, (route) =>
          route.fulfill({ status: 503, body: 'Synthetic fault' })
        );
      const resource = fallback ? `${wasm}_nowasm_fallback.js` : `${wasm}.wasm`;
      const loaded = page.waitForResponse((r) => r.url().endsWith('/pdfjs-wasm/' + resource));
      await page.goto(base + '/probe.html');
      await page.waitForFunction(() => !!window.PDFJSLocal);
      const images = await page.evaluate(
        async (url) => {
          const lib = window.PDFJSLocal,
            task = lib.getDocument({ url });
          try {
            const doc = await task.promise,
              pg = await doc.getPage(1),
              ops = await pg.getOperatorList();
            const viewport = pg.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            canvas.id = 'decoded-image';
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            document.body.appendChild(canvas);
            await pg.render({
              canvasContext: canvas.getContext('2d', { willReadFrequently: true }),
              viewport,
            }).promise;
            const ids = new Set(
              ops.fnArray.flatMap((fn, i) =>
                fn === lib.OPS.paintImageXObject ? [ops.argsArray[i][0]] : []
              )
            );
            return {
              count: ids.size,
              decoded: [...ids].filter((id) => pg.objs.get(id) !== null).length,
            };
          } finally {
            await task.destroy();
          }
        },
        base + `/image-${codec}.pdf`
      );
      expect(images).toEqual({ count: 1, decoded: 1 });
      expect(await checkerboard(page.locator('#decoded-image'))).toBe(true);
      expect((await loaded).status()).toBe(200);
      expect(failures).toEqual([]);
      expect(external).toEqual([]);
    });
  }
}

test('fachada preserva opções, URL, dados tipados/ArrayBuffer e API compartilhada', async ({
  page,
  context,
}) => {
  await localOnly(context);
  await page.goto(base + '/probe.html');
  await page.waitForFunction(() => !!window.PDFJSLocal);
  const results = await page.evaluate(async (url) => {
    const lib = window.PDFJSLocal,
      bytes = await (await window.fetch(url)).arrayBuffer();
    const sources = [
      { url },
      { url: new URL(url) },
      { data: new Uint8Array(bytes.slice(0)) },
      { data: bytes.slice(0) },
    ];
    const counts = [];
    for (const source of sources) {
      const keys = Object.keys(source).join();
      const task = lib.getDocument(source);
      try {
        counts.push((await task.promise).numPages);
      } finally {
        await task.destroy();
      }
      if (Object.keys(source).join() !== keys || 'wasmUrl' in source)
        throw new Error('Caller options mutated');
    }
    return {
      counts,
      version: lib.version,
      workerApi: typeof lib.PDFWorker,
      ops: typeof lib.OPS,
      frozen: Object.isFrozen(lib),
    };
  }, base + '/image-jpx.pdf');
  expect(results).toEqual({
    counts: [1, 1, 1, 1],
    version: '6.3.289',
    workerApi: 'function',
    ops: 'object',
    frozen: true,
  });
});

test('opção wasmUrl explícita e cancelamento preservam a renderização seguinte', async ({
  page,
  context,
}) => {
  await localOnly(context);
  await context.route(origin + '/custom-decoder/*', (route) => {
    const file = path.basename(new URL(route.request().url()).pathname);
    return route.fulfill({
      status: 200,
      contentType: 'application/wasm',
      body: fs.readFileSync(path.join(packageRoot, 'ambiente_interativo/js/pdfjs-wasm', file)),
    });
  });
  await page.goto(base + '/probe.html');
  await page.waitForFunction(() => !!window.PDFJSLocal);
  const loaded = page.waitForResponse((r) => r.url() === origin + '/custom-decoder/openjpeg.wasm');
  const cancellation = await page.evaluate(
    async ({ url, wasmUrl }) => {
      const source = { url, wasmUrl },
        task = window.PDFJSLocal.getDocument(source);
      try {
        const pg = await (await task.promise).getPage(1),
          viewport = pg.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.id = 'after-cancel';
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        document.body.appendChild(canvas);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const cancelled = pg.render({ canvasContext: context, viewport });
        cancelled.cancel();
        let name;
        try {
          await cancelled.promise;
        } catch (error) {
          name = error.name;
        }
        await pg.render({ canvasContext: context, viewport }).promise;
        return { name, sameOption: source.wasmUrl === wasmUrl };
      } finally {
        await task.destroy();
      }
    },
    { url: base + '/image-jpx.pdf', wasmUrl: origin + '/custom-decoder/' }
  );
  expect(cancellation).toEqual({ name: 'RenderingCancelledException', sameOption: true });
  expect((await loaded).status()).toBe(200);
  expect(await checkerboard(page.locator('#after-cancel'))).toBe(true);
});

async function openBook(page, profile) {
  await page.goto(base + '/ambiente_interativo/index.html');
  await page.getByRole('button', { name: new RegExp(profile, 'i') }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="primeiras-licoes-dinheiro"]')
    .getByRole('button', { name: /Começar leitura|Continuar da página/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
}

for (const profile of ['Alice', 'Mariana']) {
  test(`leitor integrado offline: imagens, navegação, recarga e isolamento de ${profile}`, async ({
    page,
    context,
  }) => {
    const external = await localOnly(context);
    await openBook(page, profile);
    expect(await checkerboard(page.locator('#canvas-livro'))).toBe(true);
    await page.locator('#proxima-pagina-leitura').click();
    await expect(page.locator('#contador-pagina-leitura')).toHaveText('Página 2 de 25');
    await openBook(page, profile);
    await expect(page.locator('#contador-pagina-leitura')).toHaveText('Página 2 de 25');
    await page.locator('#pagina-anterior-leitura').click();
    await expect(page.locator('#contador-pagina-leitura')).toHaveText('Página 1 de 25');
    const other = profile === 'Alice' ? 'mariana' : 'alice';
    expect(
      await page.evaluate(
        (p) => localStorage.getItem(`revisoesEscolares.${p}.leitura.primeirasLicoesDinheiro.v1`),
        other
      )
    ).toBeNull();
    expect(external).toEqual([]);
  });
  test(`leitor dedicado offline: imagens e retorno de ${profile}`, async ({ page, context }) => {
    const external = await localOnly(context);
    await openBook(page, profile);
    const pending = page.waitForEvent('popup');
    await page.locator('#abrir-leitor-dedicado').click();
    const popup = await pending;
    await expect(popup.locator('html')).toHaveClass(/leitor-pronto/);
    expect(await checkerboard(popup.locator('#canvas-leitor-dedicado'))).toBe(true);
    await popup.locator('#proxima-pagina-dedicado').click();
    await expect(popup.locator('#contador-pagina-dedicado')).toHaveText('Página 2 de 25');
    await expect
      .poll(() =>
        page.evaluate(
          (p) =>
            JSON.parse(
              localStorage.getItem(`revisoesEscolares.${p}.leitura.primeirasLicoesDinheiro.v1`)
            ).paginaAtual,
          profile.toLowerCase()
        )
      )
      .toBe(2);
    await popup.locator('#pagina-anterior-dedicado').click();
    await expect(popup.locator('#contador-pagina-dedicado')).toHaveText('Página 1 de 25');
    await popup.close();
    await expect(page.locator('#contador-pagina-leitura')).toHaveText('Página 1 de 25');
    expect(external).toEqual([]);
  });
}

test('file:// conserva a orientação de abertura do PDF original', async ({ page }) => {
  await page.goto(pathToFileURL(path.join(root, 'ambiente_interativo/index.html')).href);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="primeiras-licoes-dinheiro"]')
    .getByRole('button', { name: /Começar leitura/ })
    .click();
  await expect(page.locator('#dica-abertura-local')).toBeVisible();
  await expect(page.locator('#canvas-livro')).toBeHidden();
});
