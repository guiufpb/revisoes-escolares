'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { IDENTITY_PATH, identityForRoot } = require('../scripts/identidade-ambiente-local.cjs');

module.exports = async function confirmServer(config) {
  const root = path.resolve(__dirname, '..');
  const baseURL = config.projects[0].use.baseURL;
  const response = await fetch(`${baseURL}${IDENTITY_PATH}`, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200, 'Servidor da execucao sem identidade.');
  assert.deepEqual(await response.json(), identityForRoot(root), 'Servidor de outra copia.');
  console.log(
    `Playwright: raiz=${root}; origem=${baseURL}; identidade confirmada; sem reutilizacao.`
  );
};
