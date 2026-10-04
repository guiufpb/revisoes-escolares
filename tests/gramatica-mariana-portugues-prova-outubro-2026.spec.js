const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'mariana-gramatica-portugues-prova-outubro-2026';
const CHAVE = 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1';
const AUXILIAR = 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.responsavel.v1';
const CARTAO = '#abrir-gramatica-portugues-prova-outubro-mariana';
const VIZINHAS = [
  'revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1',
  'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1',
];

// Gabarito transcrito do banco pedagógico, sem ler as respostas da configuração ou do DOM.
const GABARITO = [
  ['Uma caixa com figuras.'],
  {
    ordem: [
      'Rafael percebeu que uma caixa havia sumido.',
      'Mariana e Rafael foram até a biblioteca.',
      'Eles encontraram o material e voltaram para a sala.',
    ],
  },
  ['Porque Mariana lembrou que a professora Clara havia deixado uma caixa perto dali.'],
  [
    'Mariana e Rafael prepararam uma exposição, procuraram um material desaparecido e conseguiram realizar a atividade.',
  ],
  ['Levamos cartazes, régua, cola e lápis de cor.'],
  ['Recife, 5 de outubro de 2026.'],
  ['Mariana, leve o caderno, a régua e o lápis.'],
  ['R forte no início', 'R brando entre vogais', 'RR com som forte entre vogais'],
  ['careta / carreta'],
  { campos: ['borracha'] },
  { campos: ['relógio', 'barriga'] },
  ['car-ro-ça'],
  { ordem: ['CA', 'DER', 'NO'] },
  { ordem: ['RE', 'VIS', 'TA'] },
  { campos: ['jardim', 'lista'] },
  ['A menina tomou chá numa xícara.'],
  { campos: ['caixa'] },
  { campos: ['chave', 'xarope'] },
  ['alegre'],
  ['A = sentido 1; B = sentido 2.'],
  ['vazia'],
  ['SINÔNIMOS', 'ANTÔNIMOS', 'SINÔNIMOS'],
  { campos: ['impossível', 'incompleto', 'incompleto'] },
  ['cachorro e parque'],
  ['Mariana', 'Recife', 'Mingau'],
  [
    '“menina” é substantivo comum nas duas frases; na primeira aparece com maiúscula porque inicia a frase.',
  ],
  ['Ontem, Pedro levou o cachorro Bidu ao Parque das Flores.'],
  ['A', 'O', 'A', 'O'],
  { campos: ['aluna', 'professora'] },
  ['rainha', 'égua', 'cabra'],
  { campos: ['A professora'] },
  { campos: ['Marina, pegue a régua e o caderno.'] },
  ['Ter ajudado o menino a recuperar o boné.'],
  ['O menino agradeceu, e Lucas voltou para casa feliz.'],
  ['Pedro, leve a bola, a toalha e a água.'],
];

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function preparar(page, numero, chave = CHAVE) {
  await page.evaluate(
    ({ chave, numero }) => {
      localStorage.setItem(chave, JSON.stringify({ versao: 1, questaoAtual: numero - 1 }));
    },
    { chave, numero }
  );
  await page.reload();
  await abrir(page);
}

async function preencher(page, numero) {
  const resposta = GABARITO[numero - 1];
  if (resposta.campos) {
    const campos = page.locator('[data-resposta-gramatica]');
    await expect(campos).toHaveCount(resposta.campos.length);
    for (const [indice, valor] of resposta.campos.entries()) await campos.nth(indice).fill(valor);
  } else if (resposta.ordem) {
    for (const cartao of resposta.ordem)
      await page
        .locator('[data-interacao-questionario]')
        .getByRole('button', { name: cartao, exact: true })
        .click();
  } else {
    for (const [indice, valor] of resposta.entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: valor, exact: true })
        .click();
  }
}

async function responder(page, numero) {
  await preencher(page, numero);
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

async function auditar(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact))).toEqual(
    []
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
}

test.beforeEach(async ({ page }) => {
  page.errosRevisao = [];
  page.on('pageerror', (erro) => page.errosRevisao.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosRevisao.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => {
  expect(page.errosRevisao).toEqual([]);
});

test('cadastro, cartão, 35 pontos, ditados, leitura e distribuição do gabarito', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.GramaticaQuestionarios.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.revisao).toMatchObject({
    id: ID,
    chave: CHAVE,
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
  });
  expect(dados.registro).toMatchObject({ chaveArmazenamento: CHAVE, totalEtapas: 35 });
  expect(dados.revisao.questoes).toHaveLength(35);
  expect(new Set(dados.revisao.questoes.map((q) => q.id)).size).toBe(35);
  expect(dados.revisao.questoes.filter((q) => q.ditado).map((q) => q.id)).toEqual([
    'q11',
    'q15',
    'q18',
    'q32',
  ]);
  expect(dados.revisao.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([
    CHAVE,
    AUXILIAR,
  ]);
  for (const numero of [1, 2, 3, 4])
    expect(dados.revisao.questoes[numero - 1].leitura).toContain('A caixa da exposição');
  for (const numero of [33, 34, 35])
    expect(dados.revisao.questoes[numero - 1].leitura).toContain('O boné encontrado');
  const posicoes = dados.revisao.questoes.flatMap((q) =>
    q.itens.filter((i) => i.opcoes).map((i) => i.opcoes.indexOf(i.respostas[0]))
  );
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 35');
});

test('percurso completo usa gabarito independente e conclui com 35 pontos', async ({ page }) => {
  test.setTimeout(240_000);
  await abrir(page);
  for (let numero = 1; numero <= 35; numero++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 35`);
    await responder(page, numero);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${numero} de 35`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('35 de 35');
});

test('erro, correção, tentativas, ponto único, volta e recarga', async ({ page }) => {
  await abrir(page);
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: 'A régua de Mariana.' })
    .press('Enter');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-item-gramatica] [aria-pressed="true"]')).toContainText('régua');
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0] })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
  const estado = await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), CHAVE);
  expect(estado.tentativas.q01).toBe(3);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
});

test('Q2, Q13 e Q14: ordenação reversível, teclado e persistência', async ({ page }) => {
  await preparar(page, 2);
  await page
    .locator('[data-interacao-questionario]')
    .getByRole('button', { name: GABARITO[1].ordem[0], exact: true })
    .press('Enter');
  await page
    .locator('[data-interacao-questionario]')
    .getByRole('button', { name: GABARITO[1].ordem[1], exact: true })
    .click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(2);
  await page.locator('[data-retirar-ordem]').last().press('Space');
  await page.getByRole('button', { name: 'Limpar sequência' }).click();
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
  await responder(page, 2);
  for (const numero of [13, 14]) {
    await preparar(page, numero);
    await responder(page, numero);
  }
});

test('Q8, Q25, Q28 e Q30 exigem todos os subitens', async ({ page }) => {
  for (const numero of [8, 25, 28, 30]) {
    await preparar(page, numero);
    const primeiro = GABARITO[numero - 1][0];
    await page
      .locator('[data-item-gramatica]')
      .first()
      .getByRole('button', { name: primeiro, exact: true })
      .click();
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 35');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await page.reload();
    await abrir(page);
    await expect(
      page.locator('[data-item-gramatica]').first().locator('[aria-pressed="true"]')
    ).toHaveCount(1);
    for (const [indice, valor] of GABARITO[numero - 1].entries()) {
      if (indice === 0) continue;
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: valor, exact: true })
        .click();
    }
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
  }
});

test('Q23 forma dois antônimos sem resposta exposta e só pontua após a escolha final', async ({
  page,
}) => {
  await preparar(page, 23);
  expect(await page.locator('#gramatica-conteudo').textContent()).not.toContain('impossível');
  expect(await page.locator('#gramatica-conteudo').textContent()).not.toContain('incompleto');
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('impossível');
  await campos.nth(1).fill('incompleto');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 35');
  await campos.nth(2).fill('impossível');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('impossível');
  await expect(campos.nth(1)).toHaveValue('incompleto');
  await campos.nth(2).fill('incompleto');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
});

test('Q11, Q15, Q18 e Q32 usam áudio local sem resposta no DOM', async ({ page }) => {
  await page.addInitScript(() => {
    window.__falasMariana = [];
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz remota', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosMariana = (window.__cancelamentosMariana || 0) + 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasMariana.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        local: fala.voice.localService,
      });
      fala.onstart?.();
      fala.onend?.();
    };
  });
  for (const numero of [11, 15, 18, 32]) {
    await preparar(page, numero);
    expect(await page.evaluate(() => window.__falasMariana)).toEqual([]);
    const respostas = GABARITO[numero - 1].campos;
    for (const resposta of respostas)
      expect(await page.locator('#gramatica-conteudo').textContent()).not.toContain(resposta);
    for (const [indice, resposta] of respostas.entries()) {
      await page.locator('[data-ouvir-ditado-gramatica]').nth(indice).click();
      const falas = await page.evaluate(() => window.__falasMariana);
      expect(falas.at(-1)).toEqual({
        texto: (numero === 32 ? 'A frase é: ' : 'A palavra é: ') + resposta,
        idioma: 'pt-BR',
        velocidade: 0.78,
        local: true,
      });
      await expect(page.locator('[data-resposta-gramatica]').nth(indice)).toHaveValue('');
      await page.locator('[data-repetir-ditado-gramatica]').click();
      expect((await page.evaluate(() => window.__falasMariana)).at(-1).texto).toBe(
        falas.at(-1).texto
      );
      await page.locator('[data-parar-ditado-gramatica]').click();
    }
    expect(await page.evaluate(() => window.__cancelamentosMariana)).toBeGreaterThan(0);
    await responder(page, numero);
  }
});

test('Q31 e Q32 exigem artigo, maiúscula, vírgula, acento e ponto', async ({ page }) => {
  await preparar(page, 31);
  await page.locator('[data-resposta-gramatica]').fill('professora');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('[data-resposta-gramatica]').fill('A professora');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
  await preparar(page, 32);
  for (const incorreta of [
    'marina, pegue a régua e o caderno.',
    'Marina pegue a régua e o caderno.',
    'Marina, pegue a regua e o caderno.',
    'Marina, pegue a régua e o caderno',
  ]) {
    await page.locator('[data-resposta-gramatica]').fill(incorreta);
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  await responder(page, 32);
});

test('Modo Responsável: salto não fabrica progresso e a sessão principal permanece intacta', async ({
  page,
}) => {
  await abrir(page);
  await responder(page, 1);
  const principal = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('35');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 35 de 35');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), AUXILIAR)
  ).toMatchObject({
    questaoAtual: 34,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    tentativas: {},
    pontos: 0,
  });
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principal);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await page.keyboard.press('Control+Alt+R');
  await responder(page, 35);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 35');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 35 de 35');
});

test('limpeza seletiva nas duas sessões e cartão ligado à principal', async ({ page }) => {
  await page.evaluate(
    (chaves) =>
      chaves.forEach((chave) => localStorage.setItem(chave, JSON.stringify({ preservar: true }))),
    VIZINHAS
  );
  await page.reload();
  await abrir(page);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('35');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  expect(await page.evaluate((id) => window.GramaticaQuestionarios.obterSituacao(id), ID)).toBe(
    'nao-iniciada'
  );
  await responder(page, 1);
  const principal = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  const auxiliar = await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR);
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBe(auxiliar);
  expect(
    await page.evaluate(
      (chaves) => chaves.map((chave) => JSON.parse(localStorage.getItem(chave))),
      VIZINHAS
    )
  ).toEqual([{ preservar: true }, { preservar: true }]);
});

test('JSON inválido, armazenamento bloqueado, revisão legada e file://', async ({
  page,
  browser,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{inválido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 35');
  const bloqueado = await browser.newContext();
  await bloqueado.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado');
      };
  });
  const pagina = await bloqueado.newPage();
  await pagina.goto(URL);
  await abrir(pagina);
  await responder(pagina, 1);
  await pagina.locator('#gramatica-proxima').click();
  await pagina.locator('#gramatica-voltar').click();
  await expect(pagina.locator('#gramatica-pontos')).toHaveText('1 de 35');
  await bloqueado.close();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  expect(rede).toEqual([]);
});

test('toque e painel em 390 × 844', async ({ browser }) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  await page.goto(URL);
  await abrir(page);
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0] })
    .tap();
  await expect(
    page.locator('[data-item-gramatica]').first().locator('[aria-pressed="true"]')
  ).toHaveCount(1);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-proxima').tap();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 2 de 35');
  await auditar(page);
  await contexto.close();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`layout e acessibilidade em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await abrir(page);
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    await auditar(page);
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
    await auditar(page);
  });
}
