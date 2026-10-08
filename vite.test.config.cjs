// Explicit test configuration; ordinary launchers never load synthetic PDFs.
const base = require('./vite.config.js');
const { syntheticPdfPlugin } = require('./tests/fixtures/servidor-pdfs.cjs');

module.exports = { ...base, plugins: [...base.plugins, syntheticPdfPlugin()] };
