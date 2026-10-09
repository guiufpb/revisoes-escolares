const path = require('node:path');
const { defineConfig } = require('vite');
const { localIdentityPlugin } = require('./scripts/identidade-ambiente-local.cjs');

module.exports = defineConfig({
  plugins: [localIdentityPlugin()],
  // O CSS é local e não usa plugins externos. Evita buscar configurações em ancestrais.
  css: { postcss: { plugins: [] } },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: [
        (arquivo) =>
          /^(tmp|output|MINHAS_REVISOES_LOCAIS)(?:[\\/]|$)/.test(path.relative(__dirname, arquivo)),
      ],
    },
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
