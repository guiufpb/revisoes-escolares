const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { env, execPath, platform } = require('node:process');
const { test, expect } = require('@playwright/test');
const {
  fixtures,
  directory,
  signature,
  pageText,
  generatePdf,
  sha256,
  fixturePath,
  prepareFixtures,
  readFixture,
} = require('./fixtures/pdfs.cjs');
const { pdfMiddleware } = require('./fixtures/servidor-pdfs.cjs');

const projectRoot = path.resolve(__dirname, '..');

async function inCleanRoot(action) {
  const parent = path.join(projectRoot, 'tmp');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'pdf-fixtures-'));
  try {
    await action(root);
  } finally {
    assert.ok(path.resolve(root).startsWith(path.resolve(parent) + path.sep));
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function respond(root, url, { method = 'GET', headers = {} } = {}) {
  const result = { statusCode: 200, headers: {}, body: undefined, fallback: false };
  const response = {
    get statusCode() {
      return result.statusCode;
    },
    set statusCode(value) {
      result.statusCode = value;
    },
    setHeader(name, value) {
      result.headers[name] = value;
    },
    end(bytes) {
      result.body = bytes;
    },
  };
  pdfMiddleware(root)({ url, method, headers }, response, () => {
    result.fallback = true;
  });
  return result;
}

test('preparo oficial funciona em outra raiz vazia, offline, com contrato identico em CI e local', async () => {
  await inCleanRoot(async (root) => {
    const other = path.join(root, 'Outra cópia com espaços');
    fs.mkdirSync(other);
    const command = path.join(projectRoot, 'scripts/preparar-pdfs-teste.cjs');
    const localOutput = execFileSync(execPath, [command, other], {
      cwd: root,
      env: { ...env, CI: '', HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1' },
      encoding: 'utf8',
    });
    expect(localOutput).toContain('10 criados');
    const hashes = fixtures.map((fixture) => sha256(readFixture(other, fixture)));
    const mtimes = fixtures.map((fixture) => fs.statSync(fixturePath(other, fixture)).mtimeMs);
    const ciOutput = execFileSync(execPath, [command, other], {
      cwd: root,
      env: { ...env, CI: 'true' },
      encoding: 'utf8',
    });
    expect(ciOutput).toContain('0 criados');
    expect(fixtures.map((fixture) => sha256(readFixture(other, fixture)))).toEqual(hashes);
    expect(fixtures.map((fixture) => fs.statSync(fixturePath(other, fixture)).mtimeMs)).toEqual(
      mtimes
    );
    expect(fs.readdirSync(other)).toEqual(['tests']);
    expect(fs.readdirSync(path.join(other, directory)).sort()).toEqual(
      fixtures.map((item) => item.file).sort()
    );
  });
});

test('PDF privado presente nunca e lido nem alterado; somente fixtures atendem as URLs', async () => {
  await inCleanRoot(async (root) => {
    const privateFile = path.join(root, fixtures[0].url);
    fs.mkdirSync(path.dirname(privateFile), { recursive: true });
    fs.writeFileSync(privateFile, 'PRIVATE-SENTINEL');
    const originalRead = fs.readFileSync;
    const reads = [];
    fs.readFileSync = function (file, ...args) {
      const absolute = path.resolve(String(file));
      assert.notEqual(absolute, privateFile, 'Nao pode ler material privado');
      reads.push(absolute);
      return originalRead.call(fs, file, ...args);
    };
    try {
      expect(prepareFixtures(root)).toEqual({ created: 10, total: 10 });
      const response = respond(root, fixtures[0].url);
      expect(response.body.equals(generatePdf(fixtures[0]))).toBe(true);
      expect(reads.every((file) => file.startsWith(path.join(root, directory) + path.sep))).toBe(
        true
      );
      const unknown = respond(root, '/ambiente_interativo/leituras/documento-privado.pdf');
      expect(unknown.statusCode).toBe(404);
      expect(unknown.fallback).toBe(false);
      expect(respond(root, `/@fs/${privateFile.replaceAll('\\', '/')}`).statusCode).toBe(404);
    } finally {
      fs.readFileSync = originalRead;
    }
    expect(fs.readFileSync(privateFile, 'utf8')).toBe('PRIVATE-SENTINEL');
  });
});

test('fixture corrompida falha claramente sem sobrescrever nem preparar parcialmente', async () => {
  await inCleanRoot(async (root) => {
    prepareFixtures(root);
    const corrupt = fixturePath(root, fixtures[0]);
    const missing = fixturePath(root, fixtures[1]);
    fs.writeFileSync(corrupt, 'CORRUPT-SENTINEL');
    fs.unlinkSync(missing);
    expect(() => prepareFixtures(root)).toThrow(/leitor-01\.pdf corrompida/);
    expect(fs.readFileSync(corrupt, 'utf8')).toBe('CORRUPT-SENTINEL');
    expect(fs.existsSync(missing)).toBe(false);
    const failed = respond(root, fixtures[0].url);
    expect(failed.statusCode).toBe(500);
    expect(failed.body).toContain('corrompida');
    expect(failed.fallback).toBe(false);
    const absent = respond(root, fixtures[1].url);
    expect(absent.statusCode).toBe(500);
    expect(absent.body).toContain('ausente');
    expect(absent.fallback).toBe(false);
  });
});

test('preparo recusa diretorio redirecionado por link sem tocar seu destino', async () => {
  await inCleanRoot(async (root) => {
    const target = path.join(root, 'destino-preservado');
    const tests = path.join(root, 'tests');
    fs.mkdirSync(target);
    fs.mkdirSync(tests);
    fs.writeFileSync(path.join(target, 'sentinel.txt'), 'PRESERVE');
    fs.symlinkSync(target, path.join(tests, 'fixtures'), platform === 'win32' ? 'junction' : 'dir');
    expect(() => prepareFixtures(root)).toThrow(/link simbolico recusado/);
    expect(fs.readdirSync(target)).toEqual(['sentinel.txt']);
    expect(fs.readFileSync(path.join(target, 'sentinel.txt'), 'utf8')).toBe('PRESERVE');
  });
});

test('servidor HTTP entrega bytes sinteticos integros, HEAD e intervalos e bloqueia PDFs nao cadastrados', async ({
  request,
}) => {
  for (const fixture of fixtures) {
    const expected = generatePdf(fixture);
    const response = await request.get(fixture.url);
    expect(response.status()).toBe(200);
    expect(response.headers()['x-revisoes-pdf-fixture']).toBe(signature);
    expect(sha256(await response.body())).toBe(sha256(expected));
    expect(response.headers()['content-length']).toBe(String(expected.length));
    const head = await request.head(fixture.url);
    expect(head.status()).toBe(200);
    expect(head.headers()['content-length']).toBe(String(expected.length));
    const range = await request.get(fixture.url, { headers: { Range: 'bytes=0-7' } });
    expect(range.status()).toBe(206);
    expect((await range.body()).equals(expected.subarray(0, 8))).toBe(true);
    expect(range.headers()['content-range']).toBe(`bytes 0-7/${expected.length}`);
  }
  const unknown = await request.get('/ambiente_interativo/leituras/privado.pdf');
  expect(unknown.status()).toBe(404);
  expect(await unknown.text()).toContain('leitura de PDF privado bloqueada');
  const encoded = await request.get('/ambiente_interativo/leituras/privado%2Epdf');
  expect(encoded.status()).toBe(404);
  expect(
    (await request.get(fixtures[0].url, { headers: { Range: 'bytes=999999-1000000' } })).status()
  ).toBe(416);
});

test('PDF.js le todas as paginas com texto original, A4 e desenho nao branco', async ({ page }) => {
  await page.goto('/ambiente_interativo/index.html');
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="primeiras-licoes-dinheiro"]')
    .getByRole('button', { name: /Começar leitura/ })
    .click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute('aria-label', /Página 1 do livro/);
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  const results = await page.evaluate(async (items) => {
    const results = [];
    for (const fixture of items) {
      const loading = window.PDFJSLocal.getDocument({ url: fixture.url });
      const pdf = await loading.promise;
      const pages = [];
      for (let number = 1; number <= pdf.numPages; number += 1) {
        const pdfPage = await pdf.getPage(number);
        const text = await pdfPage.getTextContent();
        const viewport = pdfPage.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        pages.push({
          text: text.items.map((item) => item.str).join(' '),
          width: canvas.width,
          height: canvas.height,
          pixel: Array.from(context.getImageData(50, canvas.height - 50, 1, 1).data),
        });
      }
      results.push({ id: fixture.id, count: pdf.numPages, pages });
      await loading.destroy();
    }
    return results;
  }, fixtures);
  for (const [index, result] of results.entries()) {
    const fixture = fixtures[index];
    expect(result.count).toBe(fixture.pages);
    for (const [pageIndex, page] of result.pages.entries()) {
      expect(page.text).toBe(pageText(fixture, pageIndex + 1));
      expect([page.width, page.height]).toEqual([595, 842]);
      expect(page.pixel[0]).toBeLessThan(100);
      expect(page.pixel[2]).toBeGreaterThan(150);
      expect(page.pixel[3]).toBe(255);
    }
  }
});

test('configuracao comum e launchers ficam separados das fixtures de teste', async () => {
  const ordinary = require('../vite.config.js');
  const testing = require('../vite.test.config.cjs');
  expect(ordinary.plugins.map((plugin) => plugin.name)).not.toContain(
    'revisoes-test-only-synthetic-pdfs'
  );
  expect(testing.plugins.map((plugin) => plugin.name)).toContain(
    'revisoes-test-only-synthetic-pdfs'
  );
  expect(testing.plugins[0]).toBe(ordinary.plugins[0]);
});
