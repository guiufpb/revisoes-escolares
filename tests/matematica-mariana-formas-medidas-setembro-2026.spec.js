const path = require('node:path');
const { URL, pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'mariana-matematica-formas-medidas-setembro-2026';
const CHAVE = 'revisoesEscolares.mariana.matematica.formasMedidasSetembro2026.v1';
const ANTIGA = 'revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1';
const ALICE = 'revisoesEscolares.alice.matematica.maisContasETabuada.v1';
const TITULO = 'Formas e medidas — revisão 03/09';
const GABARITO = [
  ['círculo', 'triângulo', 'retângulo', 'quadrado'],
  [4, 5, 3, 4],
  [3, 3, 4, 4, 4, 4, 0, 0],
  ['triângulo', 'quadrado', 'círculo', 'retângulo'],
  ['triângulo', 'quadrado'],
  ['circulo', 'triangulo', 'retangulo'],
  ['azul', 'rosa', 'azul', 'rosa', 'azul', 'rosa', 'azul', 'rosa', 'azul', 'rosa'],
  ['mm', 'cm', 'm'],
  [9],
  [8],
  [100, 200, 50, 80],
  ['Sol', 'Nina', '25 cm'],
  ['coral', 'lilás'],
  ['régua', 'fita métrica', 'trena'],
  ['caixa', 'livro', 'mesma massa'],
  ['kg', 'kg', 'kg', 'g', 'g', 'g'],
  [1000, 2000, 3000, 5000],
  [1, 2, 4, 7],
  ['1000 g', '3000 g', '6000 g', '8000 g'],
  ['>', '>', '=', '<'],
  [4, 6],
  ['L', 'L', 'mL', 'mL'],
  [1000, 2000, 1],
  [5],
  [2, 1000],
  [75],
  [85],
  [85],
  [34],
  [45],
];

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.locator('#abrir-formas-medidas-setembro').click();
  await expect(page.locator('#tela-matematica-cena')).toBeVisible();
}

async function comecar(page) {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
}

async function responder(page, numero) {
  const respostas = GABARITO[numero - 1];
  if (numero === 6) {
    for (const id of respostas) await page.locator(`[data-math-visual-choice="${id}"]`).click();
  } else if (numero === 7) {
    for (const [indice, cor] of respostas.entries()) {
      await page.locator(`[data-math-mosaic-color="${cor}"]`).click();
      await page.locator(`[data-math-mosaic-cell="mosaico-${indice + 10}"]`).click();
    }
  } else {
    const selects = page.locator('[data-math-visual-select]');
    if (await selects.count()) {
      for (const [indice, valor] of respostas.entries())
        await selects.nth(indice).selectOption(valor);
    } else {
      const inputs = page.locator('[data-math-visual-input]');
      for (const [indice, valor] of respostas.entries())
        await inputs.nth(indice).fill(String(valor));
    }
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('cadastro exclusivo, 32 etapas, 30 pontos e gabarito independente por bloco', async ({
  page,
}) => {
  const dados = await page.evaluate((id) => {
    const revisao = window.MatematicaRevisoes.listar().find((item) => item.id === id);
    const registro = window.RegistroRevisoes.listar().find((item) => item.id === id);
    return { revisao, registro };
  }, ID);
  expect(dados.revisao).toMatchObject({
    id: ID,
    aluno: 'mariana',
    titulo: TITULO,
    chaveArmazenamento: CHAVE,
  });
  expect(dados.registro).toMatchObject({
    id: ID,
    aluno: 'mariana',
    totalEtapas: 32,
    chaveArmazenamento: CHAVE,
  });
  const etapas = dados.revisao.etapas;
  expect(etapas).toHaveLength(32);
  expect(new Set(etapas.map((item) => item.id)).size).toBe(32);
  expect(etapas[0].tipo).toBe('apresentacao');
  expect(etapas[31].tipo).toBe('final');
  const questoes = etapas.filter((item) => item.tipo === 'cena');
  expect(questoes).toHaveLength(30);
  const blocos = ['Formas', 'Comprimento', 'Massa', 'Capacidade', 'Reagrupamento'];
  for (const [indice, questao] of questoes.entries()) {
    const numero = indice + 1;
    const bloco = numero <= 7 ? 0 : numero <= 14 ? 1 : numero <= 21 ? 2 : numero <= 25 ? 3 : 4;
    expect(questao.rotulo).toContain(`Questão ${numero} de 30`);
    expect(questao.rotulo).toContain(numero === 7 ? 'Mosaico' : blocos[bloco]);
    const cena = questao.cena;
    const esperado = cena.campos
      ? cena.campos.map((item) => item.resposta)
      : cena.tipo === 'selecao-visual'
        ? cena.resposta
        : cena.tipo === 'mosaico'
          ? cena.celulas.filter((item) => !item.fixa).map((item) => item.resposta)
          : cena.itens.map((item) => item.resposta);
    expect(esperado).toEqual(GABARITO[indice]);
    const itens = cena.campos || cena.itens || cena.celulas;
    expect(new Set(itens.map((item) => item.id)).size).toBe(itens.length);
  }
  expect(questoes.filter((item) => item.cena.visual?.tipo === 'operacao-du')).toHaveLength(5);
  expect(questoes.slice(25).map((item) => item.cena.visual.operador)).toEqual([
    '+',
    '+',
    '+',
    '−',
    '−',
  ]);
  for (const questao of questoes.slice(25)) {
    const { superior, inferior, operador } = questao.cena.visual;
    expect(superior).toBeGreaterThanOrEqual(10);
    expect(superior).toBeLessThan(100);
    expect(inferior).toBeGreaterThanOrEqual(10);
    expect(inferior).toBeLessThan(100);
    if (operador === '+') expect((superior % 10) + (inferior % 10)).toBeGreaterThanOrEqual(10);
    else expect(superior % 10).toBeLessThan(inferior % 10);
    expect(questao.cena.campos[0].unidade).toBeTruthy();
  }
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.locator('#abrir-formas-medidas-setembro')).toBeHidden();
  await expect(page.locator('#abrir-capacidade-operacoes-numeros')).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.getByRole('heading', { name: TITULO, exact: true })).toBeVisible();
});

test('percurso completo confere as 30 questões, finaliza com 30 pontos e restaura', async ({
  page,
}, testInfo) => {
  test.setTimeout(180000);
  await comecar(page);
  for (let numero = 1; numero <= 30; numero += 1) {
    await expect(page.locator('#matematica-cena-contador')).toHaveText(`Etapa ${numero + 1} de 32`);
    await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
    await responder(page, numero);
    await page.locator('[data-math-check]').click();
    await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
    await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
    await page.locator('#matematica-cena-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Revisão concluída!' })).toBeVisible();
  await expect(page.locator('.resumo-final-centenas')).toContainText('30 de 30');
  await page.screenshot({ path: testInfo.outputPath('final-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath('final-mobile.png'), fullPage: true });
  await page.locator('#matematica-cena-voltar').click();
  await expect(page.locator('[data-math-visual-input="resultado"]')).toHaveValue('45');
  await page.locator('[data-math-check]').click();
  await page.locator('#matematica-cena-proxima').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('.resumo-final-centenas')).toContainText('30 de 30');
  const estado = await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), CHAVE);
  expect(estado.pontos).toBe(30);
  expect(Object.keys(estado.pontuacoes)).toHaveLength(30);
  expect(estado.finalizada).toBe(true);
});

test('subitens: erro, correção, tentativa incompleta, retorno e recarga sem duplicar pontos', async ({
  page,
}) => {
  await comecar(page);
  await page.evaluate(() => window.MatematicaRevisoes.irPara(3));
  const campos = page.locator('[data-math-visual-input]');
  await campos.nth(0).fill('9');
  await campos.nth(1).fill('3');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Revise');
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('9');
  await expect(campos.nth(1)).toHaveValue('3');
  await expect(campos.nth(2)).toHaveValue('');
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await responder(page, 3);
  await page.locator('[data-math-check]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('3');
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-pontos')).toHaveText('1 conquistas');
});

test('seleção e contagem são reversíveis; mosaico permite apagar, desfazer, limpar e recarregar', async ({
  page,
}) => {
  await comecar(page);
  await page.evaluate(() => window.MatematicaRevisoes.irPara(2));
  await page.locator('[data-math-visual-aid]').nth(0).click();
  await page.locator('[data-math-visual-aid]').nth(1).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-math-visual-aid][aria-pressed="true"]')).toHaveCount(2);
  await page.locator('[data-math-visual-aid]').nth(0).click();
  await expect(page.locator('[data-math-visual-aid][aria-pressed="true"]')).toHaveCount(1);
  await page.evaluate(() => window.MatematicaRevisoes.irPara(6));
  for (const id of ['circulo', 'triangulo', 'retangulo', 'quadrado'])
    await page.locator(`[data-math-visual-choice="${id}"]`).click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await page.locator('[data-math-visual-choice="quadrado"]').focus();
  await page.keyboard.press('Space');
  await page.locator('[data-math-check]').click();
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('[data-math-mosaic-color="rosa"]').click();
  const primeira = page.locator('[data-math-mosaic-cell="mosaico-10"]');
  await primeira.click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await primeira.click();
  await expect(primeira).not.toHaveClass(/preenchida/);
  await primeira.click();
  await page.locator('[data-math-undo]').click();
  await expect(primeira).not.toHaveClass(/preenchida/);
  await primeira.click();
  await page.locator('[data-math-clear]').click();
  await expect(page.locator('button.celula-mosaico.preenchida')).toHaveCount(0);
  await page.locator('[data-math-mosaic-color="azul"]').focus();
  await page.keyboard.press('Enter');
  await primeira.focus();
  await page.keyboard.press('Space');
  await page.locator('[data-math-mosaic-color="rosa"]').click();
  await page.locator('[data-math-mosaic-cell="mosaico-11"]').click();
  await page.reload();
  await abrir(page);
  await expect(primeira).toHaveClass(/cor-azul/);
  await expect(page.locator('[data-math-mosaic-cell="mosaico-11"]')).toHaveClass(/cor-rosa/);
  for (const [indice, cor] of GABARITO[6].entries()) {
    if (indice < 2) continue;
    await page.locator(`[data-math-mosaic-color="${cor}"]`).click();
    await page.locator(`[data-math-mosaic-cell="mosaico-${indice + 10}"]`).click();
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
});

test('limpeza seletiva preserva a revisão antiga e Alice', async ({ page }) => {
  const sentinelas = {
    antiga: '{"preservado":"formas-anterior"}',
    alice: '{"preservado":"alice"}',
  };
  await page.evaluate(
    ({ antiga, alice, valores }) => {
      localStorage.setItem(antiga, valores.antiga);
      localStorage.setItem(alice, valores.alice);
    },
    { antiga: ANTIGA, alice: ALICE, valores: sentinelas }
  );
  await comecar(page);
  await responder(page, 1);
  await page.locator('[data-math-check]').click();
  await page.evaluate((id) => window.MatematicaRevisoes.limpar(id, false), ID);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), ANTIGA)).toBe(
    sentinelas.antiga
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), ALICE)).toBe(sentinelas.alice);
  const antiga = await page.evaluate(() =>
    window.MatematicaRevisoes.listar().find(
      (item) => item.id === 'mariana-matematica-formas-mosaicos-medidas'
    )
  );
  expect(antiga.chaveArmazenamento).toBe(ANTIGA);
  expect(antiga.etapas).toHaveLength(32);
  expect(antiga.etapas[7].cena.itens.map((item) => item.resposta)).toEqual([
    'círculo',
    'retângulo',
    'triângulo',
    'cone',
  ]);
});

test('dados corrompidos e armazenamento bloqueado usam o tratamento existente', async ({
  page,
  browser,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{invalido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.getByRole('heading', { name: TITULO, exact: true })).toBeVisible();
  const contexto = await browser.newContext();
  const semArmazenamento = await contexto.newPage();
  await semArmazenamento.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new Error('armazenamento bloqueado no teste');
    };
  });
  await semArmazenamento.goto(new URL(CAMINHO, page.url()).href);
  await comecar(semArmazenamento);
  await responder(semArmazenamento, 1);
  await semArmazenamento.locator('[data-math-check]').click();
  await expect(semArmazenamento.locator('#matematica-cena-proxima')).toBeEnabled();
  await semArmazenamento.locator('#matematica-cena-proxima').click();
  await semArmazenamento.locator('#matematica-cena-voltar').click();
  await expect(semArmazenamento.locator('[data-math-visual-select]').nth(0)).toHaveValue('círculo');
  await contexto.close();
});

test('amostras desktop e 390×844: figuras, medidas, reagrupamento, toque, axe e console', async ({
  page,
}, testInfo) => {
  test.setTimeout(180000);
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await comecar(page);
  for (const largura of [1366, 390]) {
    await page.setViewportSize({ width: largura, height: largura === 390 ? 844 : 900 });
    for (const numero of [2, 7, 9, 10, 12, 15, 24, 26, 29]) {
      await page.evaluate((indice) => window.MatematicaRevisoes.irPara(indice), numero);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        largura
      );
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact))
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`q${numero}-${largura}.png`),
        fullPage: true,
      });
    }
  }
  expect(erros).toEqual([]);
  const contextoToque = await page
    .context()
    .browser()
    .newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const toque = await contextoToque.newPage();
  await toque.goto(new URL(CAMINHO, page.url()).href);
  await comecar(toque);
  await toque.evaluate(() => window.MatematicaRevisoes.irPara(7));
  await toque.locator('[data-math-mosaic-color="azul"]').tap();
  await toque.locator('[data-math-mosaic-cell="mosaico-10"]').tap();
  await expect(toque.locator('[data-math-mosaic-cell="mosaico-10"]')).toHaveClass(/cor-azul/);
  await contextoToque.close();
});

test('bundle file:// abre a nova revisão sem rede e preserva resposta na recarga', async ({
  page,
}) => {
  await page.route(/^https?:/, (rota) => rota.abort());
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await comecar(page);
  await responder(page, 1);
  await page.locator('[data-math-check]').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-math-visual-select]').nth(0)).toHaveValue('círculo');
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
});
