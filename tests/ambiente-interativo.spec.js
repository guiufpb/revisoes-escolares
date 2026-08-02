const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE_ALICE = 'revisoesEscolares.alice.ciencias.origemMateriais';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_ANTIGA = 'revisoes-escolares-progresso-v1';
const CHAVES_DOS_TESTES = [CHAVE_ALICE, CHAVE_MARIANA, CHAVE_ANTIGA];

async function limparSomenteChavesDoAmbiente(page) {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    CHAVES_DOS_TESTES
  );
}

async function abrirAlice(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Ciências/ }).click();
  await expect(page.getByRole('heading', { name: 'Origem dos materiais' })).toBeVisible();
}

async function abrirTrilhaMariana(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('heading', { name: 'Escolha uma revisão' })).toBeVisible();
}

async function abrirRevisaoMariana(page) {
  await abrirTrilhaMariana(page);
  await page.getByRole('button', { name: /Revisão ampla/ }).click();
  await expect(page.getByRole('progressbar')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await limparSomenteChavesDoAmbiente(page);
  await page.reload();
});

test('carrega a tela inicial e registra somente as revisões existentes', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Revisões Escolares' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Alice/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mariana/ })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);

  const registro = await page.evaluate(() =>
    window.RegistroRevisoes.listar().map(({ id, cartaoId, painelId, chaveArmazenamento }) => ({
      id,
      cartaoId,
      painelId,
      chaveArmazenamento,
      elementosExistem: Boolean(
        document.getElementById(cartaoId) && document.getElementById(painelId)
      ),
    }))
  );
  expect(registro).toHaveLength(2);
  expect(new Set(registro.map((item) => item.chaveArmazenamento)).size).toBe(2);
  expect(registro.every((item) => item.elementosExistem)).toBe(true);
});

test('abre apenas a revisão escolhida e retorna à tela inicial', async ({ page }) => {
  await abrirAlice(page);
  await expect(page.locator('#tela-mariana-revisao')).toBeHidden();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await expect(page.locator('#tela-revisao')).toBeHidden();

  await abrirRevisaoMariana(page);
  await expect(page.locator('#tela-revisao')).toBeHidden();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
});

test('mostra e persiste os estados não iniciada, em andamento e concluída', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  const cartao = page.locator('#materia-ciencias');
  await expect(cartao).toHaveAttribute('data-estado-revisao', 'nao-iniciada');
  await expect(cartao.getByText('Não iniciada')).toBeVisible();

  await cartao.click();
  await page.getByRole('button', { name: /Lã de ovelha/ }).click();
  await page.getByRole('button', { name: 'Alice' }).click();
  await expect(cartao).toHaveAttribute('data-estado-revisao', 'em-andamento');

  await cartao.click();
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Muito bem');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-ciencias')).toHaveAttribute(
    'data-estado-revisao',
    'concluida'
  );
  await expect(page.locator('#materia-ciencias').getByText('Concluída')).toBeVisible();
});

test('restaura a etapa e respeita os limites da navegação', async ({ page }) => {
  await abrirRevisaoMariana(page);
  await expect(page.locator('#mariana-voltar')).toBeDisabled();
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  await expect(page.getByText('Etapa 2 de 25')).toBeVisible();
  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.getByText('Etapa 2 de 25')).toBeVisible();
  await page.locator('#mariana-voltar').click();
  await expect(page.getByText('Etapa 1 de 25')).toBeVisible();
});

test('isola o armazenamento entre as revisões', async ({ page }) => {
  await abrirAlice(page);
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  const aliceAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE);
  expect(aliceAntes).toBeTruthy();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_MARIANA)).toBeNull();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirRevisaoMariana(page);
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_MARIANA)).toBeTruthy();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(aliceAntes);
});

test('migra de modo idempotente o progresso antigo da Alice sem removê-lo', async ({ page }) => {
  const legado = JSON.stringify({
    alunoAtual: 'alice',
    alice: { cienciasOrigemMateriais: { concluida: true, tentativas: 3 } },
    mariana: {},
  });
  await page.evaluate(
    ({ chaveNova, chaveAntiga, dados }) => {
      localStorage.removeItem(chaveNova);
      localStorage.setItem(chaveAntiga, dados);
    },
    { chaveNova: CHAVE_ALICE, chaveAntiga: CHAVE_ANTIGA, dados: legado }
  );
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-ciencias')).toHaveAttribute(
    'data-estado-revisao',
    'concluida'
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ANTIGA)).toBe(legado);
  const primeiraMigracao = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE);
  await page.reload();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(
    primeiraMigracao
  );
});

test('desenha, salva e restaura um canvas em alta densidade', async ({ page }) => {
  await page.evaluate(
    ({ chave }) =>
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
      ),
    { chave: CHAVE_MARIANA }
  );
  await page.reload();
  await abrirRevisaoMariana(page);
  const canvas = page.locator('#canvas-mariana-vistas');
  await expect(canvas).toBeVisible();
  const caixa = await canvas.boundingBox();
  await page.mouse.move(caixa.x + 30, caixa.y + 30);
  await page.mouse.down();
  await page.mouse.move(caixa.x + 130, caixa.y + 90, { steps: 8 });
  await page.mouse.up();
  await expect(canvas).toHaveAttribute('data-tem-desenho', 'true');
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).canvases.vistas,
        CHAVE_MARIANA
      )
    )
    .toMatch(/^data:image\/png/);

  const resolucao = await canvas.evaluate((elemento) => ({
    interna: elemento.width,
    visual: elemento.getBoundingClientRect().width,
  }));
  expect(resolucao.interna).toBeGreaterThanOrEqual(Math.round(resolucao.visual));

  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.locator('#canvas-mariana-vistas')).toHaveAttribute('data-tem-desenho', 'true');
});

test('normaliza etapa inválida e ignora JSON corrompido', async ({ page }) => {
  await page.evaluate(
    ({ alice, mariana }) => {
      localStorage.setItem(alice, '{invalido');
      localStorage.setItem(mariana, JSON.stringify({ etapaAtual: 999, respostas: 'ruim' }));
    },
    { alice: CHAVE_ALICE, mariana: CHAVE_MARIANA }
  );
  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.getByText('Etapa 25 de 25')).toBeVisible();
  await expect(page.locator('#mariana-proxima')).toBeHidden();
});

test('continua utilizável quando localStorage está indisponível', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[metodo] = function () {
        throw new DOMException('Bloqueado pelo teste', 'SecurityError');
      };
    }
  });
  await page.goto(CAMINHO);
  await abrirAlice(page);
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Muito bem');
  await contexto.close();
});

test('abre também por arquivo local usando o bundle gerado', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.getByRole('heading', { name: 'Revisões Escolares' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await contexto.close();
});

test('não produz erros graves no console durante os dois fluxos', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await abrirAlice(page);
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirRevisaoMariana(page);
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  expect(erros).toEqual([]);
});
