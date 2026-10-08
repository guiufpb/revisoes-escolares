const path = require('node:path');
const { defineConfig } = require('vite');
const { localIdentityPlugin } = require('./scripts/identidade-ambiente-local.cjs');

module.exports = defineConfig({
  plugins: [localIdentityPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/MINHAS_REVISOES_LOCAIS/**'],
    },
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
