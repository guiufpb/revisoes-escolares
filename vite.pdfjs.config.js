const path = require('node:path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    emptyOutDir: false,
    assetsInlineLimit: 0,
    outDir: path.resolve(__dirname, 'ambiente_interativo/js'),
    lib: {
      entry: path.resolve(__dirname, 'ambiente_interativo/js/pdfjs.entry.js'),
      formats: ['es'],
      fileName: () => 'pdfjs.bundle.mjs',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
