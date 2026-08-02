const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';

async function verificarAcessibilidade(page, nomeDaTela) {
  await page.waitForTimeout(450);
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const graves = resultado.violations.filter((violacao) =>
    ['serious', 'critical'].includes(violacao.impact)
  );
  expect(graves, `${nomeDaTela}: ${graves.map((item) => item.id).join(', ')}`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
});

test('tela inicial e navegação completa por teclado', async ({ page }) => {
  await verificarAcessibilidade(page, 'Tela inicial');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Alice/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'O que vamos revisar?' })).toBeFocused();
  await verificarAcessibilidade(page, 'Tela de matérias');
});

test('revisão da Alice e mensagens de estado', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Ciências/ }).click();
  await verificarAcessibilidade(page, 'Revisão da Alice');
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).not.toBeEmpty();
});

test('revisão da Mariana e canvas em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        etapaAtual: 20,
        respostas: {},
        pontuacoes: {},
        concluidas: {},
        canvases: {},
        pontos: 0,
        finalizada: false,
      })
    );
  }, CHAVE_MARIANA);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Revisão ampla/ }).click();
  await expect(page.locator('#canvas-mariana-vistas')).toBeVisible();
  await verificarAcessibilidade(page, 'Canvas móvel da Mariana');
  const larguraDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(larguraDocumento).toBeLessThanOrEqual(390);
});
