const path = require('node:path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
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
