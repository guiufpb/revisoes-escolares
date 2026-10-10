const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const { IDENTITY_PATH, identityForRoot } = require('../scripts/identidade-ambiente-local.cjs');

const configFile = path.resolve(__dirname, '../vite.config.js');
const fixtureParent = path.resolve(__dirname, '../tmp');
const entries = ['ambiente_interativo/index.html', 'ambiente_interativo/leitor.html'];

function makeParent() {
  fs.mkdirSync(fixtureParent, { recursive: true });
  return fs.mkdtempSync(path.join(fixtureParent, 'revisoes-vite-externo-'));
}

function write(root, relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

function makeRoot(parent, name, reader = true) {
  const root = path.join(parent, '.codex', 'tmp', name);
  write(root, 'package.json', JSON.stringify({ name: 'revisoes-escolares', private: true }));
  // O launcher usa o Vite de B, não o runtime de A. Copie somente os arquivos
  // necessários ao dev da fixture; as demais dependências vêm da instalação existente.
  for (const relative of [
    'package.json',
    'misc/true.js',
    'misc/false.js',
    'dist/node/index.js',
    'dist/node/module-runner.js',
    'dist/node/chunks/node.js',
    'dist/node/chunks/dist.js',
    'dist/client/client.mjs',
    'dist/client/env.mjs',
  ]) {
    write(
      root,
      `node_modules/vite/${relative}`,
      fs.readFileSync(path.resolve(__dirname, '../node_modules/vite', relative))
    );
  }
  write(
    root,
    entries[0],
    '<!doctype html><html><head><link rel="stylesheet" href="./css/estilo.css"></head>' +
      '<body><p id="estado">Fixture</p><img src="./imagem.svg"><img src="./imagem.png">' +
      '<script src="./js/app.bundle.js"></script><script type="module" src="./js/fonte.js"></script></body></html>'
  );
  write(root, 'ambiente_interativo/css/estilo.css', '#estado { color: rgb(1, 2, 3); }');
  write(root, 'ambiente_interativo/js/app.bundle.js', "window.bundleFixture = 'antes';");
  write(root, 'ambiente_interativo/js/fonte.js', "import 'entrada-principal';");
  write(
    root,
    'ambiente_interativo/imagem.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="red"/></svg>'
  );
  write(
    root,
    'ambiente_interativo/imagem.png',
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
      'base64'
    )
  );
  for (const dependency of ['entrada-principal', 'entrada-leitor']) {
    write(
      root,
      `node_modules/${dependency}/package.json`,
      JSON.stringify({ name: dependency, type: 'module', main: 'index.js' })
    );
    write(root, `node_modules/${dependency}/index.js`, 'export const fixture = true;');
  }
  if (reader) {
    write(
      root,
      entries[1],
      '<!doctype html><title>Leitor</title><script type="module">import "entrada-leitor";</script>'
    );
  }
  for (const directory of ['tmp', 'output', 'MINHAS_REVISOES_LOCAIS']) {
    write(
      root,
      `${directory}/diagnostico.html`,
      '<script type="module">import "dependencia-inexistente";</script>'
    );
    write(root, `ambiente_interativo/${directory}/fonte.js`, '/* fonte interna preservada */');
  }
  write(
    root,
    'diagnostico.html',
    '<script type="module">import "dependencia-inexistente";</script>'
  );
  return root;
}

async function start(root) {
  const { createServer } = await import(
    pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href
  );
  const server = await createServer({
    configFile,
    root,
    logLevel: 'error',
    server: { host: '127.0.0.1', port: 0, strictPort: true },
  });
  try {
    await server.listen();
    const port = server.httpServer.address().port;
    expect([5173, 5187, 5190]).not.toContain(port);
    return { server, origin: `http://127.0.0.1:${port}` };
  } catch (error) {
    await server.close();
    throw error;
  }
}

function removeFixture(parent) {
  expect(path.resolve(parent).startsWith(fixtureParent + path.sep)).toBe(true);
  expect(path.basename(parent)).toMatch(/^revisoes-vite-externo-/);
  fs.rmSync(parent, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

test('configuração em A observa somente fontes das raízes B e C e mantém identidade/HTTP', async ({
  request,
}) => {
  const parent = makeParent();
  const first = makeRoot(parent, 'Cópia B com espaços e acentos');
  const second = makeRoot(parent, 'Cópia irmã C');
  const running = [];
  try {
    for (const root of [first, second]) running.push(await start(root));
    for (const [index, { server, origin }] of running.entries()) {
      const root = [first, second][index];
      expect(server.config.root).toBe(root.replaceAll('\\', '/'));
      expect(server.config.css.postcss).toEqual({ plugins: [] });
      expect(server.config.optimizeDeps.entries).toEqual(entries);
      const ignore = server.config.server.watch.ignored.find((rule) => typeof rule === 'function');
      expect(typeof ignore).toBe('function');
      for (const directory of ['tmp', 'output', 'MINHAS_REVISOES_LOCAIS']) {
        const artifact = path.join(root, directory);
        expect(ignore(artifact)).toBe(true);
        expect(ignore(path.join(artifact, 'diagnostico.html'))).toBe(true);
        expect(ignore(path.join(root, 'ambiente_interativo', directory, 'fonte.js'))).toBe(false);
        expect(ignore(path.join([first, second][1 - index], directory, 'diagnostico.html'))).toBe(
          false
        );
        expect(ignore(path.join(path.dirname(configFile), directory, 'diagnostico.html'))).toBe(
          false
        );
      }
      for (const relative of [
        'ambiente_interativo/css/estilo.css',
        'ambiente_interativo/js/fonte.js',
        'ambiente_interativo/js/app.bundle.js',
        'ambiente_interativo/imagem.svg',
        'ambiente_interativo/imagem.png',
        'ambiente_interativo/tmp/fonte.js',
      ]) {
        const file = path.join(root, relative);
        expect(ignore(file)).toBe(false);
        await expect
          .poll(() => server.watcher.getWatched()[path.dirname(file)] || [])
          .toContain(path.basename(file));
        if (!relative.includes('/tmp/')) {
          const response = await request.get(origin + '/' + relative, {
            headers: { Accept: relative.endsWith('.css') ? 'text/css' : '*/*' },
          });
          expect(response.status()).toBe(200);
          if (relative.endsWith('/fonte.js'))
            expect(await response.text()).toContain(
              '/node_modules/.vite/deps/entrada-principal.js'
            );
          else if (relative.endsWith('.js'))
            expect(await response.text()).toContain(fs.readFileSync(file, 'utf8'));
          else expect(await response.body()).toEqual(fs.readFileSync(file));
        }
      }
      expect(ignore(configFile)).toBe(false);
      await expect
        .poll(() => server.watcher.getWatched()[path.dirname(configFile)] || [])
        .toContain(path.basename(configFile));
      const watched = Object.keys(server.watcher.getWatched());
      for (const directory of ['tmp', 'output', 'MINHAS_REVISOES_LOCAIS']) {
        const artifact = path.join(root, directory);
        expect(
          watched.filter((file) => file === artifact || file.startsWith(artifact + path.sep))
        ).toEqual([]);
        expect((await request.get(`${origin}/${directory}/diagnostico.html`)).status()).toBe(403);
        expect(
          (
            await request.get(
              origin + '/@fs/' + path.join(artifact, 'diagnostico.html').replaceAll('\\', '/')
            )
          ).status()
        ).toBe(403);
      }
      expect(await (await request.get(origin + IDENTITY_PATH)).json()).toEqual(
        identityForRoot(root)
      );
      expect((await request.post(origin + IDENTITY_PATH)).status()).toBe(405);
      expect(
        (
          await request.get(origin + IDENTITY_PATH, { headers: { Origin: 'https://example.com' } })
        ).status()
      ).toBe(403);
      expect(server.config.server.fs.deny).toEqual(
        expect.arrayContaining([
          '.env',
          '.env.*',
          '*.{crt,pem}',
          '**/.git/**',
          '**/MINHAS_REVISOES_LOCAIS/**',
        ])
      );
    }
  } finally {
    for (const { server } of running) {
      await server.environments.client.depsOptimizer?.scanProcessing;
      await server.close();
    }
    removeFixture(parent);
  }
});

test('HTML opcional ausente mantém descoberta limitada à raiz servida', async ({ page }) => {
  const parent = makeParent();
  const root = makeRoot(parent, 'Cópia antiga sem leitor', false);
  let server;
  try {
    const running = await start(root);
    server = running.server;
    await page.goto(running.origin + '/' + entries[0]);
    await expect(page.locator('#estado')).toBeVisible();
    const optimizer = server.environments.client.depsOptimizer;
    await expect
      .poll(() => Object.keys(optimizer.metadata.optimized))
      .toEqual(['entrada-principal']);
    expect(server.config.optimizeDeps.entries).toEqual(entries);
    expect(fs.existsSync(path.join(root, entries[1]))).toBe(false);
  } finally {
    if (server) await server.close();
    removeFixture(parent);
  }
});

test('CSS atualiza pelo cliente Vite e bundle clássico recarrega sem reconstrução paralela', async ({
  page,
}) => {
  const parent = makeParent();
  const root = makeRoot(parent, 'Cópia para recarregamento');
  let server;
  try {
    const running = await start(root);
    server = running.server;
    await page.goto(running.origin + '/' + entries[0]);
    await expect(page.locator('#estado')).toHaveCSS('color', 'rgb(1, 2, 3)');
    await expect.poll(() => page.evaluate(() => window.bundleFixture)).toBe('antes');
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.images].every((image) => image.complete && image.naturalWidth > 0)
        )
      )
      .toBe(true);
    const optimizer = server.environments.client.depsOptimizer;
    await expect
      .poll(() => Object.keys(optimizer.metadata.optimized).sort())
      .toEqual(['entrada-leitor', 'entrada-principal']);
    const bundle = path.join(root, 'ambiente_interativo/js/app.bundle.js');
    const before = fs.readFileSync(bundle);
    await expect.poll(() => server.ws.clients.size).toBe(1);
    const css = path.join(root, 'ambiente_interativo/css/estilo.css');
    await expect
      .poll(() => server.watcher.getWatched()[path.dirname(css)] || [])
      .toContain('estilo.css');
    write(root, 'ambiente_interativo/css/estilo.css', '#estado { color: rgb(4, 5, 6); }');
    await expect(page.locator('#estado')).toHaveCSS('color', 'rgb(4, 5, 6)');
    write(root, 'ambiente_interativo/js/fonte.js', "import 'entrada-principal'; // fonte alterada");
    await expect
      .poll(async () =>
        (await page.request.get(running.origin + '/ambiente_interativo/js/fonte.js')).text()
      )
      .toContain('fonte alterada');
    expect(fs.readFileSync(bundle)).toEqual(before);
    // Fixture sintética: simula a saída de um build, sem editar bundles reais.
    write(root, 'ambiente_interativo/js/app.bundle.js', "window.bundleFixture = 'depois';");
    await expect.poll(() => page.evaluate(() => window.bundleFixture)).toBe('depois');
    await expect(page.locator('#estado')).toHaveCSS('color', 'rgb(4, 5, 6)');
  } finally {
    if (server) await server.close();
    removeFixture(parent);
  }
});
