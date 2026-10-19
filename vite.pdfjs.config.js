const path = require('node:path');
const fs = require('node:fs');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  plugins: [
    {
      name: 'pdfjs-local-decoders',
      generateBundle() {
        const directory = path.join(
          path.dirname(require.resolve('pdfjs-dist/package.json')),
          'wasm'
        );
        // Keep upstream filenames: workers dynamically load both WASM and JS fallbacks.
        // Include the complete directory, including upstream license notices.
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          if (!entry.isFile()) throw new Error('Recurso PDF.js WASM inesperado: ' + entry.name);
          this.emitFile({
            type: 'asset',
            fileName: 'pdfjs-wasm/' + entry.name,
            source: fs.readFileSync(path.join(directory, entry.name)),
          });
        }
      },
    },
  ],
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
