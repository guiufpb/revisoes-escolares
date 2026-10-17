'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { URL, pathToFileURL } = require('node:url');
const acorn = require('acorn');

const ROOT = path.resolve(__dirname, '../..');
const MODULE = path.join(ROOT, 'scripts/identidade-ambiente-local.cjs');

// Exercise the actual middleware with each host path implementation, including
// POSIX on Windows. Only filesystem identity is stubbed for the virtual roots.
function middleware(root, paths, platform) {
  const mod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(MODULE, 'utf8'), {
    module: mod,
    process: { platform },
    require(name) {
      if (name === 'node:path') return paths;
      if (name === 'node:fs') return { realpathSync: { native: (value) => value } };
      if (name === 'node:crypto') return require('node:crypto');
      throw Error('Unexpected middleware dependency: ' + name);
    },
  });
  let handler;
  mod.exports.localIdentityPlugin().configureServer({
    config: { root },
    middlewares: {
      use: (fn) => {
        handler = fn;
      },
    },
  });
  return (url) => {
    const result = { next: false, status: null, body: null };
    const response = {
      setHeader() {},
      end(body) {
        result.status = this.statusCode;
        result.body = body;
      },
    };
    handler({ url, method: 'GET', headers: { host: '127.0.0.1:5191' } }, response, () => {
      result.next = true;
    });
    return result;
  };
}

for (const [platform, paths, root] of [
  ['win32', path.win32, 'C:/Users/familia/.codex/worktrees/revisao'],
  ['linux', path.posix, '/home/familia/.codex/worktrees/revisao'],
]) {
  test('HTTP local: /@fs/ legítimo preserva raiz e ancestrais em ' + platform, () => {
    const handle = middleware(root, paths, platform);
    for (const url of [
      '/@vite/client',
      '/ambiente_interativo/index.html',
      '/@fs/' + root + '/node_modules/vite/dist/client/env.mjs',
      '/@fs/' + root + '/ambiente_interativo/js/leitor-dedicado.js',
      '/@fs/' +
        root.replace('/revisao', '/dependencias') +
        '/node_modules/vite/dist/client/env.mjs',
    ])
      assert.equal(handle(url).next, true, url);
    if (platform === 'win32')
      assert.equal(
        handle('/@fs/' + (root + '/node_modules/vite/dist/client/env.mjs').replaceAll('/', '%5C'))
          .next,
        true
      );
    if (platform === 'linux')
      assert.equal(
        handle('/@fs/' + root.slice(1) + '/node_modules/vite/dist/client/env.mjs').next,
        true,
        'Vite joins /@fs/ with a POSIX absolute path using a single slash'
      );
  });

  test('HTTP local: diretórios privados dentro da raiz continuam bloqueados em ' + platform, () => {
    const handle = middleware(root, paths, platform);
    for (const directory of ['output', 'tmp', '.git', '.codex', 'MINHAS_REVISOES_LOCAIS'])
      for (const url of [
        '/' + directory + '/secret.txt',
        '/@fs/' + root + '/' + directory + '/secret.txt',
      ]) {
        assert.equal(handle(url).status, 403, url);
        assert.equal(handle(url).next, false, url);
      }
    assert.equal(handle('/%6futput/secret.txt').status, 403);
    assert.equal(handle('/%2egit/config').status, 403);
    assert.equal(handle('/%zz').status, 400);
    if (platform === 'linux')
      for (const directory of ['output', 'tmp', '.git', '.codex', 'MINHAS_REVISOES_LOCAIS'])
        assert.equal(handle('/@fs/' + root.slice(1) + '/' + directory + '/secret.txt').status, 403);
  });
}

function request(origin, url) {
  const base = new URL(origin);
  return new Promise((resolve, reject) => {
    const encoded = url.replace(/[^\u0021-\u007e]/gu, (character) => encodeURIComponent(character));
    const req = http.get({ hostname: base.hostname, port: base.port, path: encoded }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
  });
}

// Same minimal local Vite runtime already used by infra-vite-externo.spec.js.
// No package install, clone, developer captures or shared-worktree writes.
function copyRuntime(modules) {
  for (const file of [
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
    const target = path.join(modules, 'vite', file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'node_modules/vite', file), target);
  }
}

for (const junction of [false, true])
  test(
    'HTTP real: Vite, privados e traversal ' + (junction ? 'com junction/symlink' : 'sem junction'),
    { timeout: 60_000 },
    async () => {
      const parentRoot = path.join(ROOT, 'tmp');
      fs.mkdirSync(parentRoot, { recursive: true });
      const parent = fs.mkdtempSync(path.join(parentRoot, 'http-local-'));
      const root = path.join(parent, '.codex', 'Revisões com espaços');
      const modules = junction
        ? path.join(parent, '.codex', 'dependencias/node_modules')
        : path.join(root, 'node_modules');
      let server;
      const put = (file, body) => {
        const target = path.join(root, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, body);
      };
      try {
        copyRuntime(modules);
        fs.mkdirSync(root, { recursive: true });
        if (junction)
          fs.symlinkSync(
            modules,
            path.join(root, 'node_modules'),
            process.platform === 'win32' ? 'junction' : 'dir'
          );
        put('package.json', '{"name":"http-local-synthetic","private":true}');
        put(
          'ambiente_interativo/index.html',
          '<!doctype html><title>Fixture pública</title><p>Local</p>'
        );
        for (const dir of ['output', 'tmp', '.git', '.codex', 'MINHAS_REVISOES_LOCAIS'])
          put(dir + '/secret.txt', 'PRIVATE_SENTINEL');
        fs.writeFileSync(path.join(parent, 'outside.txt'), 'EXTERNAL_SENTINEL');
        const { createServer } = await import(
          pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href
        );
        server = await createServer({
          configFile: false,
          root,
          logLevel: 'silent',
          plugins: [require(MODULE).localIdentityPlugin()],
          css: { postcss: { plugins: [] } },
          optimizeDeps: { noDiscovery: true, include: [] },
          server: { host: '127.0.0.1', port: 0, strictPort: true, fs: { allow: [root] } },
        });
        await server.listen();
        const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
        const client = await request(origin, '/@vite/client');
        assert.equal(client.status, 200);
        const ast = acorn.parse(client.body, { ecmaVersion: 'latest', sourceType: 'module' });
        const envUrl = ast.body.find(
          (n) => n.type === 'ImportDeclaration' && n.source.value.includes('/env.mjs')
        )?.source.value;
        assert.ok(envUrl, 'Vite client must import the actual env.mjs');
        assert.equal(envUrl.startsWith('/@fs/'), junction, envUrl);
        const env = await request(origin, envUrl);
        console.log(
          JSON.stringify({ runtime: junction ? 'junction' : 'own', envUrl, status: env.status })
        );
        assert.equal(env.status, 200, envUrl);
        assert.ok(env.body.length > 0);
        // Even without a junction, an explicit absolute /@fs/ URL is valid.
        const absoluteEnv =
          '/@fs/' +
          encodeURI(path.join(root, 'node_modules/vite/dist/client/env.mjs').replaceAll('\\', '/'));
        assert.equal((await request(origin, absoluteEnv)).status, 200, absoluteEnv);
        assert.equal((await request(origin, '/ambiente_interativo/index.html')).status, 200);
        for (const dir of ['output', 'tmp', '.git', '.codex', 'MINHAS_REVISOES_LOCAIS'])
          for (const url of [
            '/' + dir + '/secret.txt',
            '/@fs/' + encodeURI(path.join(root, dir, 'secret.txt').replaceAll('\\', '/')),
          ]) {
            const denied = await request(origin, url);
            assert.equal(denied.status, 403, url);
            assert.doesNotMatch(denied.body, /PRIVATE_SENTINEL/);
          }
        for (const url of [
          '/%6futput/secret.txt',
          '/%2egit/secret.txt',
          '/%2Foutput/secret.txt',
          '/ambiente_interativo/../../output/secret.txt',
          '/%2e%2e/output/secret.txt',
          '/@fs/' + encodeURI(path.join(parent, 'outside.txt').replaceAll('\\', '/')),
          '/@fs/' + encodeURI(root.replaceAll('\\', '/') + '/../../outside.txt'),
          '/@fs/' +
            encodeURI(root.replaceAll('\\', '/') + '/%2e%2e/%2e%2e/outside.txt').replaceAll(
              '%25',
              '%'
            ),
        ]) {
          const denied = await request(origin, url);
          assert.equal(denied.status, 403, url);
          assert.doesNotMatch(denied.body, /PRIVATE_SENTINEL|EXTERNAL_SENTINEL/);
        }
        assert.equal((await request(origin, '/%zz')).status, 400);
      } finally {
        if (server) await server.close();
        assert.equal(path.dirname(parent), parentRoot);
        assert.ok(path.resolve(parent).startsWith(path.resolve(parentRoot) + path.sep));
        fs.rmSync(parent, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      }
    }
  );
