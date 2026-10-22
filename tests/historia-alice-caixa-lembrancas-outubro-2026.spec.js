const { test, expect } = require('@playwright/test');

const ID = 'alice-historia-caixa-lembrancas-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.historia.caixaLembrancasOutubro2026.v1';
const CARTAO = '#abrir-historia-caixa-lembrancas-outubro-2026';
const URL = '/ambiente_interativo/index.html';
// Oráculo editorial independente: não lê respostas da configuração nem do DOM.
const GABARITO = [
  'A fotografia antiga.',
  'Pião de madeira.',
  'Uma viagem.',
  'Tiraram uma fotografia nova.',
  'viagem',
  'corda',
];

test('[adicao:cadastro] registro exclusivo, contexto e seis questões', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto(URL);
  const dados = await page.evaluate(
    (id) => ({
      registro: window.RegistroRevisoes.obter(id),
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
    }),
    ID
  );
  expect(dados.registro).toMatchObject({
    aluno: 'alice',
    totalEtapas: 6,
    chaveArmazenamento: CHAVE,
  });
  expect(dados.revisao.validacaoEstritaEstado).toBe(true);
  expect(dados.revisao.modoResponsavel).toBeUndefined();
  expect(dados.revisao.layout).toBeUndefined();
  expect(dados.revisao.questoes.map((q) => q.tipo)).toEqual([
    'opcoes',
    'opcoes',
    'opcoes',
    'opcoes',
    'campos',
    'campos',
  ]);
  expect(new Set(dados.revisao.questoes.map((q) => q.id)).size).toBe(6);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 6');
  await expect(page.getByRole('region', { name: 'A caixa de lembranças' })).toContainText(
    'A avó contou que brincava com o pião no quintal.'
  );
  await expect(page.locator('#tela-gramatica-mariana')).not.toContainText('undefined');
  expect(erros).toEqual([]);
});

test('[adicao:recuperacao] erro, correção, retorno e recarga sem ponto duplicado', async ({
  page,
}) => {
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.getByRole('button', { name: 'O pião de madeira.', exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 6');
  await expect(page.locator('.retorno-gramatica')).not.toBeEmpty();
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.getByRole('button', { name: 'O pião de madeira.', exact: true })).toHaveClass(
    /incorreta/
  );
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 6');
  await page.locator('#gramatica-proxima').click();
  await page.getByRole('button', { name: GABARITO[1], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 6');
  await page.locator('#gramatica-voltar').click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 6');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 6');
  await expect(page.getByRole('button', { name: GABARITO[0], exact: true })).toHaveClass(/correta/);
  await page.locator('#gramatica-proxima').click();
  await expect(page.getByRole('button', { name: GABARITO[1], exact: true })).toHaveClass(/correta/);
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 6');
});

test('[adicao:isolamento] outra revisão e perfil preservam suas chaves', async ({ page }) => {
  await page.goto(URL);
  const outras = [
    'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
    'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  ];
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, 'progresso preservado')),
    outras
  );
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 6');
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  expect(
    await page.evaluate((chaves) => chaves.map((chave) => localStorage.getItem(chave)), outras)
  ).toEqual(['progresso preservado', 'progresso preservado']);
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).pontos, CHAVE)
  ).toBe(1);
});

test('[adicao:storage-adverso] JSON inválido e versão incompatível não impedem responder', async ({
  page,
}) => {
  await page.goto(URL);
  await page.evaluate((chave) => localStorage.setItem(chave, '{invalido'), CHAVE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 6');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 6');
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 6');
  await page.evaluate(
    (chave) =>
      localStorage.setItem(
        chave,
        JSON.stringify({ versao: 999, questaoAtual: 5, pontos: 900, finalizada: true })
      ),
    CHAVE
  );
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 6');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 6');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('[adicao:acessibilidade] teclado, toque, rótulos e celular sem overflow', async ({
  page,
  browser,
  baseURL,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
  await page.getByRole('button', { name: GABARITO[0], exact: true }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Conferir', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.retorno-gramatica')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 6');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  const contexto = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const toque = await contexto.newPage();
  await toque.goto(URL);
  await toque.getByRole('button', { name: /Alice/ }).tap();
  await toque.locator(CARTAO).tap();
  await toque.getByRole('button', { name: GABARITO[0], exact: true }).tap();
  await toque.getByRole('button', { name: 'Conferir', exact: true }).tap();
  await expect(toque.locator('#gramatica-pontos')).toHaveText('1 de 6');
  await contexto.close();
});

test('[adicao:offline] revisão aberta responde sem conexão ou recursos externos', async ({
  page,
  context,
  baseURL,
}) => {
  const externas = [];
  page.on('request', (req) => {
    if (!req.url().startsWith(baseURL)) externas.push(req.url());
  });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await context.setOffline(true);
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-proxima').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 2 de 6');
  await expect(page.getByRole('region', { name: 'A caixa de lembranças' })).toBeVisible();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 6');
  expect(externas).toEqual([]);
  await context.setOffline(false);
});

test('[adicao:gabarito] percurso editorial independente de seis pontos', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  for (const [indice, resposta] of GABARITO.entries()) {
    await expect(page.locator('#gramatica-contador')).toHaveText(
      'Questão ' + (indice + 1) + ' de 6'
    );
    await expect(page.locator('.etiqueta').filter({ hasText: 'Objetos e memórias' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'A caixa de lembranças' })).toContainText(
      'Lia gosta de pular corda.'
    );
    if (indice < 4) {
      await page.getByRole('button', { name: resposta, exact: true }).click();
    } else {
      const campo = page.getByRole('textbox', {
        name: indice === 4 ? /O bilhete guardado/ : /Lia gosta de pular/,
      });
      await campo.fill('errada');
      await campo.press('Enter');
      await expect(campo).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await campo.fill(resposta.toUpperCase());
    }
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(indice + 1 + ' de 6');
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(indice + 1 + ' de 6');
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await expect(page.locator('#gramatica-pontos')).toHaveText('6 de 6');
  const salvo = await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), CHAVE);
  expect(salvo.finalizada).toBe(true);
  expect(Object.keys(salvo.pontuadas)).toHaveLength(6);
  expect(erros).toEqual([]);
});
