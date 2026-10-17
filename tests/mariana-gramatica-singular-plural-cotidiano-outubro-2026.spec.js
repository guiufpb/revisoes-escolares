/* global URL */
const { test, expect } = require('@playwright/test');

const ID = 'mariana-gramatica-singular-plural-cotidiano-outubro-2026';
const KEY = 'revisoesEscolares.mariana.gramatica.singularPluralCotidianoOutubro2026.v1';
const CARD = '#abrir-mariana-gramatica-singular-plural-cotidiano';
const APP_URL = '/ambiente_interativo/index.html';
// Transcrição editorial independente do módulo e do DOM de respostas.
const ANSWERS = ['cadernos', 'patos', 'sapato', 'livros', 'casas', 'bola', 'copos', 'pastas'];

test('[adicao:cadastro] identidade, integração, oito questões e apoio autossuficiente', async ({
  page,
}) => {
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARD)).toBeVisible();
  const record = await page.evaluate((id) => window.RegistroRevisoes.obter(id), ID);
  expect(record).toMatchObject({
    id: ID,
    aluno: 'mariana',
    chaveArmazenamento: KEY,
    totalEtapas: 8,
    painelId: 'tela-gramatica-mariana',
    controladorCompartilhado: 'gramatica-questionarios',
  });
  const content = await page.evaluate((id) => window.QuestionariosRevisoes.obterRevisao(id), ID);
  expect(content.validacaoEstritaEstado).toBe(true);
  expect(content.questoes.map((q) => q.tipo)).toEqual([
    'opcoes',
    'opcoes',
    'opcoes',
    'opcoes',
    'campos',
    'campos',
    'campos',
    'campos',
  ]);
  expect(content.questoes.every((q) => q.itens.length === 1)).toBe(true);
  expect(content.modoResponsavel).toBeUndefined();
  await page.locator(CARD).click();
  await expect(page.locator('#gramatica-nome-perfil')).toHaveText('Mariana');
  await expect(page.getByRole('region', { name: 'Um ou mais de um?' })).toContainText(
    'gatos, mesas'
  );
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 8');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 8');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('[data-ouvir-ditado]')).toHaveCount(0);
});

test('[adicao:recuperacao] erro, correção, avanço, retorno e recarga restauram opção e campo', async ({
  page,
}) => {
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await page.getByRole('button', { name: 'caderno', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('.retorno-gramatica')).toContainText('Revise');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 8');
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await expect(page.getByRole('button', { name: 'caderno', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('button', { name: 'caderno', exact: true })).toHaveClass(/incorreta/);
  await page.getByRole('button', { name: 'cadernos', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 8');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.getByRole('button', { name: 'cadernos', exact: true })).toHaveClass(/correta/);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: ANSWERS[i], exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await page.locator('#gramatica-proxima').click();
  }
  await page.getByRole('textbox').fill('casa');
  await page.getByRole('textbox').press('Enter');
  await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await expect(page.getByRole('textbox')).toHaveValue('casa');
  await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gramatica-pontos')).toHaveText('4 de 8');
  await page.getByRole('textbox').fill('casas');
  await page.getByRole('textbox').press('Enter');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 5 de 8');
  await expect(page.getByRole('textbox')).toHaveValue('casas');
  await expect(page.getByRole('textbox')).toHaveClass(/campo-correto/);
  await expect(page.locator('#gramatica-pontos')).toHaveText('5 de 8');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
  expect(saved.questaoAtual).toBe(4);
  expect(saved.corrigidas['cotidiano-q5']).toBe(true);
  expect(saved.conferidas['cotidiano-q5']).toBe(true);
  expect(Object.keys(saved.pontuadas)).toHaveLength(5);
});

test('[adicao:isolamento] Alice e chaves vizinhas preservadas inclusive na limpeza', async ({
  page,
}) => {
  const neighbors = [
    'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
    'revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1',
  ];
  await page.goto(APP_URL);
  await page.evaluate((keys) => {
    for (const key of keys) localStorage.setItem(key, 'marcador-preservado');
  }, neighbors);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARD)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await page.getByRole('button', { name: 'cadernos', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 8');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#limpar-progresso').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 8');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
  expect(
    await page.evaluate((keys) => keys.map((key) => localStorage.getItem(key)), neighbors)
  ).toEqual(['marcador-preservado', 'marcador-preservado']);
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARD)).toBeHidden();
});

test('[adicao:storage-adverso] JSON inválido, versão incompatível, dados estranhos e bloqueio', async ({
  browser,
}) => {
  const seeds = [
    '{invalido',
    JSON.stringify({ versao: 999, questaoAtual: 7, pontos: 999, finalizada: true }),
    JSON.stringify({
      versao: 1,
      questaoAtual: -5,
      respostas: { estranho: ['x'], 'cotidiano-q1': ['intruso'] },
      corrigidas: { estranho: true },
      pontuadas: { estranho: true },
      pontos: 999,
      finalizada: true,
    }),
  ];
  for (const seed of seeds) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(APP_URL);
    await page.evaluate(({ key, seed }) => localStorage.setItem(key, seed), { key: KEY, seed });
    await page.reload();
    await page.getByRole('button', { name: /Mariana/ }).click();
    await page.locator(CARD).click();
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 8');
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 8');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await page.getByRole('button', { name: 'cadernos', exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 8');
    await context.close();
  }
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Armazenamento bloqueado para o teste');
      },
    });
  });
  const page = await context.newPage();
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await page.getByRole('button', { name: 'cadernos', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.getByRole('button', { name: 'cadernos', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 8');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await context.close();
});

test('[adicao:acessibilidade] teclado, foco, nomes, anúncios, toque e três larguras', async ({
  browser,
}) => {
  const context = await browser.newContext({ hasTouch: true });
  const page = await context.newPage();
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
  const option = page.getByRole('button', { name: 'cadernos', exact: true });
  await option.focus();
  await expect(option).toBeFocused();
  const focusStyle = await option.evaluate((el) => ({
    outline: window.getComputedStyle(el).outlineStyle,
    shadow: window.getComputedStyle(el).boxShadow,
  }));
  expect(focusStyle.outline !== 'none' || focusStyle.shadow !== 'none').toBe(true);
  await page.keyboard.press('Space');
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.retorno-gramatica')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('.retorno-gramatica')).toHaveAttribute('role', 'status');
  await expect(page.locator('.retorno-gramatica')).toContainText('Cadernos indica');
  for (const width of [1366, 1920, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await expect(option).toBeInViewport();
  }
  await page.locator('#gramatica-proxima').tap();
  await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
  await page.getByRole('button', { name: 'patos', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'patos', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.locator('[data-conferir-gramatica]').tap();
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 8');
  for (let i = 1; i < 4; i++) {
    await page.getByRole('button', { name: ANSWERS[i], exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('textbox')).toHaveAccessibleName(/Uma casa/);
  await page.getByRole('textbox').fill('casas');
  await page.getByRole('textbox').press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await context.close();
});

test('[adicao:offline] nenhum recurso externo obrigatório e percurso desconectado', async ({
  page,
  context,
}) => {
  const external = [];
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname && url.hostname !== '127.0.0.1') {
      external.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  await context.setOffline(true);
  for (let i = 0; i < ANSWERS.length; i++) {
    if (i < 4) await page.getByRole('button', { name: ANSWERS[i], exact: true }).click();
    else await page.getByRole('textbox').fill(ANSWERS[i]);
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.locator('#gramatica-contador')).toHaveText('8 questões concluídas');
  await expect(page.locator('#gramatica-pontos')).toHaveText('8 de 8');
  expect(external).toEqual([]);
});

test('[adicao:gabarito] oito respostas independentes e oito pontos sem duplicação', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(APP_URL);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARD).click();
  for (let i = 0; i < ANSWERS.length; i++) {
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão ' + (i + 1) + ' de 8');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    if (i < 4) await page.getByRole('button', { name: ANSWERS[i], exact: true }).click();
    else await page.getByRole('textbox').fill(ANSWERS[i]);
    await page.locator('[data-conferir-gramatica]').click();
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(i + 1 + ' de 8');
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.locator('#gramatica-contador')).toHaveText('8 questões concluídas');
  await page.locator('#gramatica-voltar').click();
  await expect(page.getByRole('textbox')).toHaveValue('pastas');
  await page.getByRole('textbox').fill('pasta');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('textbox').fill('pastas');
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('8 de 8');
  await page.locator('#gramatica-proxima').click();
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARD)).toContainText('Concluída');
  await page.locator(CARD).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('8 questões concluídas');
  await expect(page.locator('#gramatica-pontos')).toHaveText('8 de 8');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
  expect(saved.finalizada).toBe(true);
  expect(Object.keys(saved.pontuadas)).toHaveLength(8);
  expect(Object.keys(saved.corrigidas)).toHaveLength(8);
  expect(saved.pontos).toBe(8);
  expect(errors).toEqual([]);
});
