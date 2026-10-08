'use strict';

const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const IDENTITY_PATH = '/__revisoes_local__/identity';

function identityForRoot(root) {
  let canonical = fs.realpathSync.native(path.resolve(root)).replaceAll('\\', '/');
  if (process.platform === 'win32') canonical = canonical.toLowerCase();
  return {
    application: 'revisoes-escolares',
    schema: 1,
    copyId: createHash('sha256').update(`revisoes-escolares:1:${canonical}`).digest('hex'),
  };
}

function localIdentityPlugin() {
  return {
    name: 'revisoes-local-identity',
    apply: 'serve',
    config(config) {
      const root = path.resolve(config.root || process.cwd()).replaceAll('\\', '/');
      return {
        server: { fs: { deny: ['tmp', 'output', '.codex'].map((dir) => `${root}/${dir}/**`) } },
      };
    },
    configureServer(server) {
      const identity = identityForRoot(server.config.root);
      server.middlewares.use((request, response, next) => {
        let pathname;
        try {
          pathname = decodeURIComponent((request.url || '').split('?')[0]).replaceAll('\\', '/');
        } catch {
          response.statusCode = 400;
          return response.end('Pedido invalido.');
        }
        // Resolve /@fs/ lexically so a worktree under .codex or tmp remains usable.
        const relative = pathname.startsWith('/@fs/')
          ? path.relative(server.config.root, pathname.slice(6)).replaceAll('\\', '/')
          : pathname;
        if (
          /(^|\/)MINHAS_REVISOES_LOCAIS(\/|$)/i.test(pathname) ||
          /(^|\/)(tmp|output|\.codex|\.git)(\/|$)/i.test(relative)
        ) {
          response.statusCode = 403;
          return response.end('Recurso privado.');
        }
        if (pathname !== IDENTITY_PATH) return next();
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET, HEAD');
          return response.end();
        }
        const host = request.headers.host || '';
        const origin = request.headers.origin;
        const localHost = /^(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/i;
        if (!localHost.test(host) || (origin && origin !== `http://${host}`)) {
          response.statusCode = 403;
          return response.end('Origem recusada.');
        }
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.end(request.method === 'HEAD' ? undefined : JSON.stringify(identity));
      });
    },
  };
}

module.exports = { IDENTITY_PATH, identityForRoot, localIdentityPlugin };

if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw new Error('Raiz obrigatoria.');
    process.stdout.write(JSON.stringify(identityForRoot(process.argv[2])));
  } catch {
    process.stderr.write('Nao foi possivel identificar a raiz local.\n');
    process.exitCode = 1;
  }
}
