const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'alice-ciencias-objetos-emocoes-alimentacao-setembro-2026';
const CHAVE = 'revisoesEscolares.alice.ciencias.objetosEmocoesAlimentacaoSetembro2026.v1';
const URL = '/ambiente_interativo/index.html';
const DITADOS = { 21: 'FELIZ', 30: 'SAÚDE' };
const SELECOES = {
  23: ['maçã', 'cenoura', 'alface'],
  29: ['água', 'banana', 'sanduíche simples'],
};
const OPCOES = {
  1: ['plástico'],
  2: ['metal'],
  3: ['papel'],
  4: ['vidro', 'metal', 'papel', 'plástico'],
  5: ['madeira'],
  6: ['dura', 'macia'],
  7: ['leve', 'pesado'],
  8: ['vidro transparente'],
  9: ['copo de vidro'],
  10: ['flutua', 'afunda'],
  11: ['afunda', 'flutua'],
  12: ['Colocar a garrafa no local adequado para descarte.'],
  13: ['reaproveitar'],
  14: ['feliz'],
  15: ['triste'],
  16: ['brava'],
  17: ['assustada'],
  18: ['triste'],
  19: ['Oferecer ajuda ou convidá-lo para brincar.'],
  20: ['conversar com calma'],
  22: ['fruta'],
  24: ['beber água'],
  25: ['Prato A'],
  26: ['energia para brincar e fazer atividades'],
  27: ['CRESCER'],
  28: ['Não exagerar nos doces e cuidar dos dentes.'],
};

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-ciencias-alice-objetos-emocoes-alimentacao').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function preparar(page, numero) {
  await page.evaluate(
    ({ chave, numero }) =>
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: numero - 1 })),
    { chave: CHAVE, numero }
  );
  await page.reload();
  await abrir(page);
}

async function responder(page, numero) {
  if (DITADOS[numero]) {
    await page.locator('[data-resposta-gramatica]').fill(DITADOS[numero]);
  } else if (SELECOES[numero]) {
    for (const texto of SELECOES[numero])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else {
    for (const [indice, texto] of OPCOES[numero].entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: texto, exact: true })
        .click();
  }
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

test.beforeEach(async ({ page }) => {
  page.errosAliceCiencias = [];
  page.on('pageerror', (erro) => page.errosAliceCiencias.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosAliceCiencias.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => expect(page.errosAliceCiencias).toEqual([]));

test('cadastro exclusivo oferece 30 questões, dois ditados e preserva as Ciências antigas', async ({
  page,
}) => {
  const dados = await page.evaluate((id) => {
    const revisao = window.QuestionariosRevisoes.obterRevisao(id);
    const registro = window.RegistroRevisoes.obter(id);
    return { questoes: revisao.questoes, chave: registro.chaveArmazenamento };
  }, ID);
  expect(dados.questoes).toHaveLength(30);
  expect(new Set(dados.questoes.map((questao) => questao.id)).size).toBe(30);
  expect(dados.questoes.map((questao) => questao.parte).slice(0, 13)).toEqual(
    Array(13).fill('objetos')
  );
  expect(dados.questoes.map((questao) => questao.parte).slice(13, 21)).toEqual(
    Array(8).fill('emocoes')
  );
  expect(dados.questoes.map((questao) => questao.parte).slice(21)).toEqual(
    Array(9).fill('alimentacao')
  );
  expect(
    dados.questoes
      .filter((questao) => questao.ditado)
      .map((questao) => questao.itens[0].respostas[0])
  ).toEqual(['FELIZ', 'SAÚDE']);
  expect(dados.chave).toBe(CHAVE);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-ciencias')).toBeVisible();
  await expect(page.locator('#abrir-ciencias-alice-objetos-emocoes-alimentacao')).toBeVisible();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-ciencias-plantas-sol')).toBeVisible();
});

test('percurso completo concede 30 pontos, permite corrigir e restaura após recarga', async ({
  page,
}) => {
  test.setTimeout(120000);
  await abrir(page);
  await page.getByRole('button', { name: 'madeira', exact: true }).press('Enter');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'plástico', exact: true }).press('Space');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  for (let numero = 1; numero <= 30; numero++) {
    if (numero > 1)
      await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 30`);
    if (numero !== 1) await responder(page, numero);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('associações, seleção, limpeza e armazenamento adverso permanecem isolados', async ({
  page,
}) => {
  await preparar(page, 4);
  await page
    .locator('[data-item-gramatica]')
    .nth(0)
    .getByRole('button', { name: 'vidro', exact: true })
    .press('Enter');
  await page
    .locator('[data-item-gramatica]')
    .nth(1)
    .getByRole('button', { name: 'metal', exact: true })
    .press('Space');
  await page.reload();
  await abrir(page);
  await expect(
    page.locator('[data-item-gramatica]').nth(0).getByRole('button', { name: 'vidro', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await page
    .locator('[data-item-gramatica]')
    .nth(2)
    .getByRole('button', { name: 'papel', exact: true })
    .click();
  await page
    .locator('[data-item-gramatica]')
    .nth(3)
    .getByRole('button', { name: 'plástico', exact: true })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"sentinela":"preservar"}')),
    [
      'revisoesEscolares.alice.ciencias.origemMateriais',
      'revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1',
    ]
  );
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado');
      };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
});

test('ditados usam voz local sem revelar ou preencher a resposta', async ({ page }) => {
  await page.addInitScript(() => {
    window.__falasAlice = [];
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [{ name: 'Maria', lang: 'pt-BR', localService: true }];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasAlice.push(fala.text);
      fala.onstart?.();
      fala.onend?.();
    };
  });
  await page.reload();
  for (const [numeroTexto, resposta] of Object.entries(DITADOS)) {
    await preparar(page, Number(numeroTexto));
    expect((await page.locator('#gramatica-conteudo').textContent()).toUpperCase()).not.toContain(
      resposta
    );
    await page.locator('[data-ouvir-ditado-gramatica]').press('Enter');
    await expect.poll(() => page.evaluate(() => window.__falasAlice.at(-1))).toBe(resposta);
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    await page.locator('[data-parar-ditado-gramatica]').click();
  }
});

test('celular e file:// não têm overflow nem violações graves', async ({ browser, page }) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const movel = await contexto.newPage();
  await movel.goto(URL);
  await abrir(movel);
  await movel.getByRole('button', { name: 'plástico', exact: true }).tap();
  const axe = await new AxeBuilder({ page: movel })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    axe.violations.filter((violacao) => ['serious', 'critical'].includes(violacao.impact))
  ).toEqual([]);
  expect(
    await movel.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ).toBe(true);
  await contexto.close();
  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  expect(rede).toEqual([]);
});
