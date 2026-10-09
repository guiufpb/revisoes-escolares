const path = require('node:path');
const { defineConfig } = require('vite');
const { localIdentityPlugin } = require('./scripts/identidade-ambiente-local.cjs');

function servedRootWatchPlugin() {
  return {
    name: 'revisoes-served-root-watch',
    apply: 'serve',
    configResolved(config) {
      if (config.server.watch === null) return;
      // A configuração pode estar em outra worktree. Capture a raiz final de cada servidor.
      const root = config.root;
      const watch = config.server.watch || {};
      const ignored = watch.ignored || [];
      config.server.watch = {
        ...watch,
        ignored: [
          ...(Array.isArray(ignored) ? ignored : [ignored]),
          (file) =>
            /^(tmp|output|MINHAS_REVISOES_LOCAIS)(?:[\\/]|$)/.test(path.relative(root, file)),
        ],
      };
    },
  };
}

module.exports = defineConfig({
  plugins: [localIdentityPlugin(), servedRootWatchPlugin()],
  // O CSS é local e não usa plugins externos. Evita buscar configurações em ancestrais.
  css: { postcss: { plugins: [] } },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/MINHAS_REVISOES_LOCAIS/**'],
    },
  },
  // HTMLs de diagnóstico/capturas não são pontos de entrada da aplicação.
  optimizeDeps: {
    entries: ['ambiente_interativo/index.html', 'ambiente_interativo/leitor.html'],
  },
  build: {
    emptyOutDir: false,
    minify: false,
    outDir: path.resolve(__dirname, 'ambiente_interativo/js'),
    lib: {
      entry: path.resolve(__dirname, 'ambiente_interativo/js/app.entry.js'),
      name: 'RevisoesEscolaresApp',
      formats: ['iife'],
      fileName: () => 'app.bundle.js',
    },
  },
});
