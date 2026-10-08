'use strict';

const path = require('node:path');
const { prepareFixtures } = require('../tests/fixtures/pdfs.cjs');

try {
  if (process.argv.length > 3) throw new Error('Informe no maximo uma raiz de projeto.');
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
  const result = prepareFixtures(root);
  console.log(
    `${result.total} PDFs sinteticos validados em tests/fixtures/pdfs; ${result.created} criados.`
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
