const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'mariana-matematica-formas-mosaicos-medidas';
const CHAVE = 'revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1';
const CHAVE_CENTENAS = 'revisoesEscolares.mariana.matematica.centenasEmAcao.v2';
const CHAVE_ALICE = 'revisoesEscolares.alice.matematica.maisContasETabuada.v1';

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Formas, mosaicos e medidas/ }).click();
  await expect(page.locator('#tela-matematica-cena')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate((chave) => localStorage.removeItem(chave), CHAVE);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('cadastra 30 questões e confere dados pedagógicos e chave independente', async ({ page }) => {
  const dados = await page.evaluate((id) => {
    const revisao = window.MatematicaRevisoes.listar().find((item) => item.id === id);
    const questoes = revisao.etapas.filter((etapa) => etapa.tipo === 'cena');
    return {
      total: revisao.etapas.length,
      questoes: questoes.length,
      ids: revisao.etapas.map((etapa) => etapa.id),
      chave: revisao.chaveArmazenamento,
      tipos: [...new Set(questoes.map((etapa) => etapa.cena.tipo))],
      finais: questoes
        .slice(24)
        .map((etapa) => etapa.cena.campos.map((campo) => [campo.resposta, campo.unidade])),
      contagem: questoes[0].cena.marcadores.reduce((resultado, item) => {
        resultado[item.forma] = (resultado[item.forma] || 0) + 1;
        return resultado;
      }, {}),
    };
  }, ID);

  expect(dados).toMatchObject({
    total: 32,
    questoes: 30,
    chave: CHAVE,
    contagem: { circulo: 5, triangulo: 4, retangulo: 6, cone: 3 },
  });
  expect(new Set(dados.ids).size).toBe(32);
  expect(dados.tipos).toEqual(
    expect.arrayContaining(['atividade-visual', 'selecao-visual', 'associacao-visual', 'mosaico'])
  );
  expect(dados.finais).toEqual([
    [
      [45, 'cm'],
      [63, 'm'],
      [74, 'mm'],
    ],
    [
      [24, 'cm'],
      [35, 'm'],
      [33, 'mm'],
    ],
    [
      [65, 'kg'],
      [73, 'g'],
    ],
    [
      [36, 'kg'],
      [37, 'g'],
    ],
    [
      [63, 'L'],
      [83, 'mL'],
    ],
    [
      [22, 'L'],
      [34, 'L'],
      [48, 'mL'],
    ],
  ]);
});

test('mostra bandeirinha triangular e cone com volume sem alterar respostas ou progresso', async ({
  page,
}) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(7));

  const bandeira = page
    .locator('[data-math-visual-select="bandeira"]')
    .locator('xpath=ancestor::*[contains(@class, "cartao-associacao")]')
    .locator('.simbolo-medida');
  const cone = page
    .locator('[data-math-visual-select="cone"]')
    .locator('xpath=ancestor::*[contains(@class, "cartao-associacao")]')
    .locator('.simbolo-medida');

  await expect(page.getByText('Bandeirinha', { exact: true })).toBeVisible();
  await expect(page.getByText('Cone de trânsito', { exact: true })).toBeVisible();
  await expect(bandeira).toHaveAttribute('aria-hidden', 'true');
  await expect(cone).toHaveAttribute('aria-hidden', 'true');
  await expect(bandeira).not.toHaveAttribute('aria-label', /.+/);
  await expect(cone).not.toHaveAttribute('aria-label', /.+/);
  await expect(bandeira).not.toHaveAttribute('title', /.+/);
  await expect(cone).not.toHaveAttribute('title', /.+/);

  const desenho = await page.evaluate(() => {
    const simbolo = (id) =>
      document
        .querySelector(`[data-math-visual-select="${id}"]`)
        .closest('.cartao-associacao')
        .querySelector('.simbolo-medida');
    const bandeirinha = simbolo('bandeira');
    const coneTransito = simbolo('cone');
    return {
      fonteBandeira: window.getComputedStyle(bandeirinha).fontSize,
      pontaBandeira: window.getComputedStyle(bandeirinha, '::after').clipPath,
      larguraBandeira: bandeirinha.getBoundingClientRect().width,
      corpoCone: window.getComputedStyle(coneTransito, '::before').clipPath,
      faixaCone: window.getComputedStyle(coneTransito, '::before').backgroundImage,
      larguraBaseCone: window.getComputedStyle(coneTransito, '::after').width,
    };
  });
  expect(desenho.fonteBandeira).toBe('0px');
  expect(desenho.pontaBandeira).toContain('polygon');
  expect(desenho.larguraBandeira).toBeGreaterThanOrEqual(68);
  expect(desenho.corpoCone).toContain('polygon');
  expect(desenho.faixaCone).toContain('linear-gradient');
  expect(Number.parseFloat(desenho.larguraBaseCone)).toBeGreaterThanOrEqual(54);

  await page.locator('[data-math-visual-select="bandeira"]').selectOption('triângulo');
  await page.locator('[data-math-visual-select="cone"]').selectOption('cone');
  await page.reload();
  await abrir(page);
  await expect(page.getByText('Etapa 8 de 32')).toBeVisible();
  await expect(page.locator('[data-math-visual-select="bandeira"]')).toHaveValue('triângulo');
  await expect(page.locator('[data-math-visual-select="cone"]')).toHaveValue('cone');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).etapaAtual, CHAVE)
  ).toBe(7);
});

test('bloqueia o erro, permite corrigir, voltar e restaura sem afetar outras chaves', async ({
  page,
}) => {
  const outras = { centenas: '{"preservado":"centenas"}', alice: '{"preservado":"alice"}' };
  await page.evaluate(
    ({ chaveCentenas, chaveAlice, valores }) => {
      localStorage.setItem(chaveCentenas, valores.centenas);
      localStorage.setItem(chaveAlice, valores.alice);
    },
    { chaveCentenas: CHAVE_CENTENAS, chaveAlice: CHAVE_ALICE, valores: outras }
  );
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  const campos = page.locator('[data-math-visual-input]');
  for (const [indice, valor] of [4, 4, 6, 3].entries())
    await campos.nth(indice).fill(String(valor));
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Algum total');
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await campos.nth(0).fill('5');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await expect(campos.nth(0)).toHaveValue('5');
  await page.reload();
  await abrir(page);
  await expect(page.getByText('Etapa 2 de 32')).toBeVisible();
  await expect(page.locator('[data-math-visual-input]').nth(0)).toHaveValue('5');
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_CENTENAS)).toBe(
    outras.centenas
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(
    outras.alice
  );
});

test('completa o mosaico por clique e teclado, desfaz e persiste várias ações', async ({
  page,
}) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(8));
  const editaveis = await page.evaluate((id) => {
    const revisao = window.MatematicaRevisoes.listar().find((item) => item.id === id);
    return revisao.etapas[8].cena.celulas
      .filter((celula) => !celula.fixa)
      .map(({ id: celula, resposta: cor }) => ({ celula, cor }));
  }, ID);

  for (const [indice, item] of editaveis.entries()) {
    const cor = page.locator(`[data-math-mosaic-color="${item.cor}"]`);
    const celula = page.locator(`[data-math-mosaic-cell="${item.celula}"]`);
    if (indice === 0) {
      await cor.focus();
      await page.keyboard.press('Enter');
      await celula.focus();
      await page.keyboard.press('Space');
    } else {
      await cor.click();
      await celula.click();
    }
  }
  const ultima = editaveis.at(-1);
  await page.locator('[data-math-undo]').click();
  await expect(page.locator(`[data-math-mosaic-cell="${ultima.celula}"]`)).not.toHaveClass(
    /preenchida/
  );
  await page.locator(`[data-math-mosaic-color="${ultima.cor}"]`).click();
  await page.locator(`[data-math-mosaic-cell="${ultima.celula}"]`).click();
  await page.reload();
  await abrir(page);
  await expect(page.getByText('Etapa 9 de 32')).toBeVisible();
  await expect(page.locator('.celula-mosaico.preenchida')).toHaveCount(24);
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
});

test('resolve régua, massa e operação final com as unidades ao lado', async ({ page }) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(11));
  await expect(page.locator('.regua-interativa')).toHaveAttribute('aria-label', /terminando em 8/);
  await page.locator('[data-math-visual-input="medida"]').fill('8');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await page.evaluate(() => window.MatematicaRevisoes.irPara(19));
  for (const [id, valor] of [
    ['melancia', 'kg'],
    ['arroz', 'kg'],
    ['clipe', 'g'],
    ['borracha', 'g'],
  ]) {
    await page.locator(`[data-math-visual-select="${id}"]`).selectOption(valor);
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await page.evaluate(() => window.MatematicaRevisoes.irPara(30));
  for (const [id, valor] of [
    ['mel', '22'],
    ['a', '34'],
    ['b', '48'],
  ]) {
    await page.locator(`[data-math-visual-input="${id}"]`).fill(valor);
  }
  await expect(page.locator('.entrada-com-unidade strong')).toHaveText(['L', 'L', 'mL']);
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
});

test('é acessível e sem rolagem horizontal no celular e abre por file', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(8));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    resultado.violations.filter((item) => ['serious', 'critical'].includes(item.impact))
  ).toEqual([]);

  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrir(page);
  await expect(page.getByRole('heading', { name: 'Formas, mosaicos e medidas' })).toBeVisible();
});
