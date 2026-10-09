const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');
const { IDENTITY_PATH, identityForRoot } = require('../scripts/identidade-ambiente-local.cjs');

test('dev preserva CSS, fontes e identidade sem observar artefatos locais', async ({ request }) => {
  const { createServer } = await import('vite');
  const root = path.resolve(__dirname, '..');
  const artifacts = [];
  let server;
  try {
    // Cria artefatos próprios: o contrato não depende de pastas preexistentes.
    for (const name of ['tmp', 'output', 'MINHAS_REVISOES_LOCAIS']) {
      const parent = path.join(root, name);
      const parentExisted = fs.existsSync(parent);
      fs.mkdirSync(parent, { recursive: true });
      const directory = fs.mkdtempSync(path.join(parent, 'vite-infra-'));
      const file = path.join(directory, 'diagnostico.html');
      artifacts.push({ parent, parentExisted, directory, file });
      fs.writeFileSync(file, '<!doctype html><title>Artefato de teste</title>');
    }
    server = await createServer({
      root,
      logLevel: 'error',
      server: { host: '127.0.0.1', port: 0, strictPort: true },
    });
    await server.listen();
    const port = server.httpServer.address().port;
    expect(port).toBeGreaterThan(0);
    expect(port).not.toBe(5173);
    const origin = `http://127.0.0.1:${port}`;

    expect(server.config.css.postcss).toEqual({ plugins: [] });
    expect(server.config.optimizeDeps.entries).toEqual([
      'ambiente_interativo/index.html',
      'ambiente_interativo/leitor.html',
    ]);
    const response = await request.get(`${origin}/ambiente_interativo/css/estilo.css`, {
      headers: { Accept: 'text/css' },
    });
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(
      fs.readFileSync(path.join(root, 'ambiente_interativo/css/estilo.css'))
    );

    const ignore = server.config.server.watch.ignored.find((rule) => typeof rule === 'function');
    expect(typeof ignore).toBe('function');
    for (const { parent, file } of artifacts) {
      expect(ignore(parent)).toBe(true);
      expect(ignore(file)).toBe(true);
      const relative = path.relative(root, file).split(path.sep).join('/');
      expect((await request.get(`${origin}/${relative}`)).status()).toBe(403);
    }
    for (const relative of [
      'ambiente_interativo/css/estilo.css',
      'ambiente_interativo/js/app.js',
      'vite.config.js',
    ]) {
      const file = path.join(root, relative);
      expect(ignore(file)).toBe(false);
      await expect
        .poll(() => server.watcher.getWatched()[path.dirname(file)] || [])
        .toContain(path.basename(file));
    }
    for (const name of ['tmp', 'output', 'MINHAS_REVISOES_LOCAIS']) {
      expect(ignore(path.join(path.dirname(root), name, 'outra-copia', 'fonte.js'))).toBe(false);
    }
    expect(ignore(path.join(root, 'ambiente_interativo', 'tmp', 'fonte.js'))).toBe(false);
    const watched = Object.keys(server.watcher.getWatched());
    for (const { parent } of artifacts) {
      expect(
        watched.filter(
          (directory) => directory === parent || directory.startsWith(`${parent}${path.sep}`)
        )
      ).toEqual([]);
    }

    const identity = await request.get(`${origin}${IDENTITY_PATH}`);
    expect(identity.status()).toBe(200);
    expect(await identity.json()).toEqual(identityForRoot(root));
    expect(identity.headers()['cache-control']).toBe('no-store');
    expect((await request.post(`${origin}${IDENTITY_PATH}`)).status()).toBe(405);
    expect(
      (
        await request.get(`${origin}${IDENTITY_PATH}`, {
          headers: { Origin: 'https://example.com' },
        })
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
    const base = require('../vite.config.js');
    expect(base.server.host).toBe('127.0.0.1');
    expect(base.server.port).toBe(5173);
    expect(base.server.strictPort).toBe(true);
  } finally {
    try {
      if (server) await server.close();
    } finally {
      // Remove somente os arquivos e diretórios criados por esta invocação, sem recursão.
      for (const { parent, parentExisted, directory, file } of artifacts.reverse()) {
        if (fs.existsSync(file)) fs.unlinkSync(file);
        fs.rmdirSync(directory);
        if (!parentExisted && fs.readdirSync(parent).length === 0) fs.rmdirSync(parent);
      }
    }
  }
});
