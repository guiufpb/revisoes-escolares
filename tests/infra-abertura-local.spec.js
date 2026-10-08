const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { URL } = require('node:url');
const { IDENTITY_PATH, identityForRoot } = require('../scripts/identidade-ambiente-local.cjs');

test('servidor de testes identifica esta raiz e mantém a aplicação disponível', async ({
  request,
  page,
  baseURL,
}) => {
  expect(new URL(baseURL).port).not.toBe('5173');
  const response = await request.get(IDENTITY_PATH);
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(await response.json()).toEqual(identityForRoot(path.resolve(__dirname, '..')));
  await page.goto('/ambiente_interativo/index.html');
  await expect(page.locator('#tela-inicial')).toBeVisible();
});

test('identidade recusa comandos e origem externa; catálogo privado nunca é servido', async ({
  request,
}) => {
  const post = await request.post(IDENTITY_PATH, {
    data: { root: '../outra-copia', command: 'abrir outro servidor' },
  });
  expect(post.status()).toBe(405);
  const external = await request.get(IDENTITY_PATH, { headers: { Origin: 'https://example.com' } });
  expect(external.status()).toBe(403);
  const catalogue = await request.get('/MINHAS_REVISOES_LOCAIS/catalogo-local.json');
  expect(catalogue.status()).toBe(403);
  expect(await catalogue.text()).toBe('Recurso privado.');
  const temporary = await request.get('/tmp/preflight-preservacao.json');
  expect(temporary.status()).toBe(403);
  expect(await temporary.text()).toBe('Recurso privado.');
});
