const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'alice-matematica-capacidade-operacoes-numeros';
const CHAVE = 'revisoesEscolares.alice.matematica.capacidadeOperacoesNumeros.v1';
const CHAVE_ALICE_ANTIGA = 'revisoesEscolares.alice.matematica.maisContasETabuada.v1';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1';

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Capacidade, continhas e números/ }).click();
  await expect(page.locator('#tela-matematica-cena')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate((chave) => localStorage.removeItem(chave), CHAVE);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('cadastra 30 questões variadas com ID, chave e respostas exclusivas', async ({ page }) => {
  const dados = await page.evaluate((id) => {
    const revisao = window.MatematicaRevisoes.listar().find((item) => item.id === id);
    const questoes = revisao.etapas.filter((etapa) => etapa.tipo === 'cena');
    return {
      aluno: revisao.aluno,
      total: revisao.etapas.length,
      questoes: questoes.length,
      chave: revisao.chaveArmazenamento,
      ids: revisao.etapas.map((etapa) => etapa.id),
      tipos: [...new Set(questoes.map((etapa) => etapa.cena.tipo))],
      assuntos: questoes.reduce((resultado, etapa) => {
        const assunto = etapa.rotulo.split('·').at(-1).trim();
        resultado[assunto] = (resultado[assunto] || 0) + 1;
        return resultado;
      }, {}),
      adicoes: questoes
        .filter((etapa) => etapa.rotulo.includes('· Adição'))
        .map((etapa) => etapa.cena.campos[0].resposta),
      subtracoes: questoes
        .filter((etapa) => etapa.rotulo.includes('· Subtração'))
        .map((etapa) => etapa.cena.campos[0].resposta),
      camposUnicos: questoes.every((etapa) => {
        const campos = etapa.cena.campos || etapa.cena.espacos || [];
        return new Set(campos.map((campo) => campo.id)).size === campos.length;
      }),
    };
  }, ID);

  expect(dados).toMatchObject({
    aluno: 'alice',
    total: 32,
    questoes: 30,
    chave: CHAVE,
    assuntos: {
      Capacidade: 7,
      Adição: 5,
      Subtração: 5,
      Números: 4,
      'Dezenas e unidades': 1,
      'Dezenas exatas': 4,
      Supermercado: 2,
      'Mini simulado': 2,
    },
    adicoes: [42, 64, 65, 85, 53],
    subtracoes: [24, 25, 36, 35, 65],
    camposUnicos: true,
  });
  expect(new Set(dados.ids).size).toBe(32);
  expect(dados.tipos).toEqual(
    expect.arrayContaining([
      'atividade-visual',
      'selecao-visual',
      'associacao-visual',
      'sequencia',
      'quadro',
      'composicao',
      'mini',
    ])
  );
});

test('mostra o cartão somente para Alice e identifica corretamente perfil e progresso', async ({
  page,
}) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('button', { name: /Capacidade, continhas e números/ })).toBeVisible();
  await page.getByRole('button', { name: /Capacidade, continhas e números/ }).click();
  await expect(page.locator('#matematica-cena-nome-perfil')).toHaveText('Alice');
  await expect(page.locator('#progresso-resumo')).toContainText(
    'Alice · Capacidade, continhas e números'
  );
  await expect(page.locator('#tela-matematica-cena .barra-progresso-mariana')).toHaveAttribute(
    'aria-label',
    'Progresso de Capacidade, continhas e números'
  );

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.locator('#abrir-capacidade-operacoes-numeros')).toBeHidden();
});

test('permite errar, corrigir, avançar, voltar e recarregar nas questões de capacidade', async ({
  page,
}) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();

  await page.locator('[data-math-visual-choice="copo"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Compare novamente');
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await page.locator('[data-math-visual-choice="copo"]').click();
  await page.locator('[data-math-visual-choice="balde"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  await page.locator('#matematica-cena-proxima').click();

  const resposta = page.locator('[data-math-visual-input="copos"]');
  await resposta.fill('7');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Conte mais 4 copos');
  await resposta.fill('8');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await expect(resposta).toHaveValue('8');

  await page.reload();
  await abrir(page);
  await expect(page.getByText('Etapa 3 de 32')).toBeVisible();
  await expect(page.locator('[data-math-visual-input="copos"]')).toHaveValue('8');
  await expect(page.locator('.recipiente-visual').first()).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.recipiente-visual').first()).not.toHaveAttribute('title', /.+/);
});

test('persiste associações de L e mL e mantém outras revisões isoladas', async ({ page }) => {
  const preservados = { alice: '{"legado":"alice"}', mariana: '{"legado":"mariana"}' };
  await page.evaluate(
    ({ chaveAlice, chaveMariana, valores }) => {
      localStorage.setItem(chaveAlice, valores.alice);
      localStorage.setItem(chaveMariana, valores.mariana);
    },
    { chaveAlice: CHAVE_ALICE_ANTIGA, chaveMariana: CHAVE_MARIANA, valores: preservados }
  );
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(7));
  for (const [id, unidade] of [
    ['jarra', 'L'],
    ['galao', 'L'],
    ['balde', 'L'],
    ['copo', 'mL'],
    ['xicara', 'mL'],
    ['frasco', 'mL'],
  ]) {
    await page.locator(`[data-math-visual-select="${id}"]`).selectOption(unidade);
  }
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-math-visual-select="frasco"]')).toHaveValue('mL');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE_ANTIGA)).toBe(
    preservados.alice
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_MARIANA)).toBe(
    preservados.mariana
  );
});

test('usa apoio D-U nas adições e decomposição visual nas subtrações', async ({ page }) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(8));
  await expect(page.locator('.painel-operacao-du')).toBeVisible();
  await expect(page.locator('.painel-operacao-du')).toContainText('27 + 15');
  await page.locator('[data-math-visual-input="resultado"]').fill('41');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await page.locator('[data-math-visual-input="resultado"]').fill('42');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();

  await page.evaluate(() => window.MatematicaRevisoes.irPara(13));
  await expect(page.locator('.painel-operacao-du')).toContainText('3 dezenas e 12 unidades');
  await expect(page.getByRole('button', { name: /Trocar 1 D por 10 U/ })).toHaveCount(0);
  await page.locator('[data-math-visual-input="resultado"]').fill('24');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
});

test('resolve números por teclado, supermercado e mini simulado e limpa só a nova chave', async ({
  page,
}) => {
  const legado = '{"preservado":true}';
  await page.evaluate(({ chave, valor }) => localStorage.setItem(chave, valor), {
    chave: CHAVE_ALICE_ANTIGA,
    valor: legado,
  });
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(18));

  for (const [valor, id] of [
    ['2', 'dois'],
    ['5', 'cinco'],
    ['9', 'nove'],
  ]) {
    await page.locator(`[data-math-sequence-card="${valor}"]`).focus();
    await page.keyboard.press('Enter');
    await page.locator(`[data-math-sequence-space="${id}"]`).focus();
    await page.keyboard.press('Space');
  }
  await page.locator('[data-math-undo]').click();
  await expect(page.locator('[data-math-sequence-space="nove"]')).toHaveText('?');
  await page.locator('[data-math-sequence-card="9"]').click();
  await page.locator('[data-math-sequence-space="nove"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();

  await page.evaluate(() => window.MatematicaRevisoes.irPara(27));
  await expect(page.locator('.cartao-produto')).toHaveCount(3);
  await page.locator('[data-math-visual-input="total"]').fill('18');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();

  await page.evaluate(() => window.MatematicaRevisoes.irPara(30));
  for (const [id, valor] of [
    ['soma', '45'],
    ['subtracao', '35'],
    ['dezenas', '7'],
    ['sequencia', '20'],
  ]) {
    await page.locator(`[data-math-input="${id}"]`).fill(valor);
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeEnabled();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar esta revisão de Matemática' }).click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE_ANTIGA)).toBe(
    legado
  );
});

test('é acessível, sem erros ou overflow no celular e funciona por file', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(28));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    resultado.violations.filter((item) => ['serious', 'critical'].includes(item.impact))
  ).toEqual([]);
  expect(erros).toEqual([]);

  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrir(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(28));
  await expect(page.getByRole('heading', { name: 'Uma compra com 20 reais' })).toBeVisible();
  expect(erros).toEqual([]);
});
