const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'alice-gramatica-pontuacao-lh-xch-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1';
const AUXILIAR = 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.responsavel.v1';
const VIZINHAS = [
  'revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1',
  'revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1',
];
// Gabarito escrito independentemente da configuração renderizada.
const GABARITO = [
  ['Mostrar que a frase terminou.', 'Separar elementos de uma enumeração.'],
  ['Ana levou pão, suco e frutas.'],
  ['Sofia guardou a bola, a boneca, o carrinho e o quebra-cabeça.'],
  ['Recife, 8 de outubro de 2026.'],
  { campos: ['Na mochila há lápis, caderno e cola.'] },
  ['LHA', 'LHE', 'LHI', 'LHO', 'LHU'],
  { campos: ['lh', 'lh', 'lh', 'lh', 'lh'] },
  ['fi-lho-te', 'mi-lho', 'ba-ru-lho', 'te-lha-do'],
  { campos: ['rolha', 'malha', 'pilha', 'coelho'] },
  [{ selecao: ['milho', 'coelho', 'telhado'] }],
  { campos: ['folha', 'coelho', 'milho', 'telhado'] },
  ['Onde está meu caderno?'],
  ['?', '.', '!', '?', '.'],
  ['Ela passou a indicar uma pergunta.'],
  { campos: ['Onde está minha mochila?'] },
  [{ selecao: ['xícara', 'xale', 'lixo', 'caixa'] }],
  ['XA', 'XE', 'XI', 'XO', 'XU'],
  ['xícara', 'caixa', 'chuva', 'chapéu'],
  [{ selecao: ['xampu', 'lixo', 'chave', 'xadrez', 'chefe'] }],
  ['chave', 'chuva', 'xale', 'caixa', 'xícara'],
  [{ ordem: ['A', 'chuva', 'molhou', 'a', 'caixa', '.'] }],
  ['CH', 'NH', 'LH', 'NH', 'CH', 'LH'],
  ['chu-va', 'ni-nho', 'co-e-lho', 'ga-li-nha'],
  { campos: ['O coelho achou uma chave no caminho.'] },
  ['!', '?', '.', '!', '?'],
  [':', '—'],
  [
    'pode separar itens de uma lista',
    'faz uma separação maior que a vírgula e menor que o ponto-final',
    'mostram que uma fala ou ideia ficou suspensa ou continua',
    'podem destacar ou reproduzir exatamente palavras ou uma fala',
  ],
  ['Perto da janela.', 'Um lanche, uma chave e um livro.', 'A mãe de Lia.'],
  [
    'Porque ouviu um barulho no quintal.',
    'Ela ficou mais tranquila.',
    'Porque Lia está fazendo uma pergunta.',
  ],
  [
    'dois-pontos (:)',
    'travessão (—)',
    'chave',
    'caminho',
    'coelho',
    { selecao: ['caixa', 'xícara'] },
    'separar elementos de uma enumeração',
  ],
];

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-pontuacao-lh-xch-alice').click();
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

async function responder(page, numero) {
  const respostas = GABARITO[numero - 1];
  if (respostas.campos) {
    const campos = page.locator('[data-resposta-gramatica]');
    await expect(campos).toHaveCount(respostas.campos.length);
    for (const [indice, resposta] of respostas.campos.entries())
      await campos.nth(indice).fill(resposta);
  } else {
    for (const [indice, resposta] of respostas.entries()) {
      const item = page.locator('[data-item-gramatica]').nth(indice);
      if (resposta.ordem) {
        for (const cartao of resposta.ordem) {
          const area = numero === 21 ? page.locator('[data-interacao-questionario]') : item;
          await area.getByRole('button', { name: cartao, exact: true }).click();
        }
      } else if (resposta.selecao) {
        for (const opcao of resposta.selecao) {
          const area = [10, 16, 19].includes(numero)
            ? page.locator('[data-interacao-questionario]')
            : item;
          await area.getByRole('button', { name: opcao, exact: true }).click();
        }
      } else {
        await item.getByRole('button', { name: resposta, exact: true }).click();
      }
    }
  }
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

test('cadastro, chave, 30 questões, sessões e gabarito distribuído', async ({ page }) => {
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
  });
  expect(dados.registro).toMatchObject({ chaveArmazenamento: CHAVE, totalEtapas: 30 });
  expect(dados.revisao.questoes).toHaveLength(30);
  expect(new Set(dados.revisao.questoes.map((q) => q.id)).size).toBe(30);
  expect(dados.revisao.questoes.filter((q) => q.ditado).map((q) => q.id)).toEqual([
    'q05',
    'q11',
    'q15',
    'q24',
  ]);
  expect(dados.revisao.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([
    CHAVE,
    AUXILIAR,
  ]);
  const posicoes = dados.revisao.questoes.flatMap((q) =>
    q.itens
      .filter((item) => item.opcoes && item.tipo !== 'selecao')
      .map((item) => item.opcoes.indexOf(item.respostas[0]))
  );
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-gramatica-pontuacao-lh-xch-alice')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
});

test('percurso independente completa as 30 questões e a última só pontua inteira', async ({
  page,
}) => {
  test.setTimeout(180_000);
  await abrir(page);
  for (let numero = 1; numero <= 30; numero++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 30`);
    if (numero === 30) {
      await page
        .locator('[data-item-gramatica]')
        .first()
        .getByRole('button', { name: GABARITO[29][0], exact: true })
        .click();
      await page.getByRole('button', { name: 'Conferir', exact: true }).click();
      await expect(page.locator('#gramatica-pontos')).toHaveText('29 de 30');
      await page
        .locator('[data-item-gramatica]')
        .first()
        .getByRole('button', { name: GABARITO[29][0], exact: true })
        .click();
    }
    await responder(page, numero);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${numero} de 30`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await expect(page.locator('#gramatica-conteudo')).toContainText('Missão cumprida!');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('erro, correção, pontuação única, voltar e recarregar restauram o estado', async ({
  page,
}) => {
  await abrir(page);
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: 'Mostrar que alguém fez uma pergunta.' })
    .press('Space');
  await page
    .locator('[data-item-gramatica]')
    .nth(1)
    .getByRole('button', { name: GABARITO[0][1] })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('Revise');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).tentativas.q01, CHAVE)
  ).toBe(1);
  await page.reload();
  await abrir(page);
  await expect(page.locator('[aria-pressed="true"]').first()).toContainText('pergunta');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).tentativas.q01, CHAVE)
  ).toBe(1);
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0] })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).tentativas.q01, CHAVE)
  ).toBe(3);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('seleção e ordenação são reversíveis, persistem e funcionam pelo teclado', async ({
  page,
}) => {
  await preparar(page, 10);
  await page.getByRole('button', { name: 'milho', exact: true }).press('Enter');
  await page.getByRole('button', { name: 'ninho', exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(2);
  await page.getByRole('button', { name: 'ninho', exact: true }).press('Space');
  for (const palavra of ['coelho', 'telhado'])
    await page.getByRole('button', { name: palavra, exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(page, 21);
  await page.getByRole('button', { name: 'A', exact: true }).press('Enter');
  await page.getByRole('button', { name: 'chuva', exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(2);
  await page.locator('[data-retirar-ordem]').last().press('Space');
  await page.getByRole('button', { name: 'Limpar sequência' }).click();
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
  await responder(page, 21);
});

test('ditados exigem ação para o áudio, não vazam resposta e oferecem repetir/parar/cancelar', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__falasAlice = [];
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz online', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosAlice = (window.__cancelamentosAlice || 0) + 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasAlice.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        local: fala.voice.localService,
      });
      fala.onstart?.();
      fala.onend?.();
    };
  });
  for (const [numero, resposta, prefixo] of [
    [5, GABARITO[4].campos[0], 'A frase é: '],
    [11, GABARITO[10].campos[0], 'A palavra é: '],
    [15, GABARITO[14].campos[0], 'A frase é: '],
    [24, GABARITO[23].campos[0], 'A frase é: '],
  ]) {
    await preparar(page, numero);
    expect(await page.evaluate(() => window.__falasAlice)).toEqual([]);
    const html = await page.locator('#gramatica-conteudo').innerHTML();
    expect(html).not.toContain(resposta);
    await page.locator('[data-ouvir-ditado-gramatica]').first().click();
    await expect.poll(() => page.evaluate(() => window.__falasAlice.length)).toBe(1);
    expect(await page.evaluate(() => window.__falasAlice[0])).toEqual({
      texto: prefixo + resposta,
      idioma: 'pt-BR',
      velocidade: 0.78,
      local: true,
    });
    await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__falasAlice.length)).toBe(2);
    await page.locator('[data-parar-ditado-gramatica]').click();
    expect(await page.evaluate(() => window.__cancelamentosAlice)).toBeGreaterThan(0);
  }
});

test('Q18 mostra quatro figuras originais coerentes com palavras e textos alternativos', async ({
  page,
}) => {
  await preparar(page, 18);
  const pares = [
    ['xicara.svg', 'Uma xícara', 'xícara'],
    ['caixa.svg', 'Uma caixa de papelão', 'caixa'],
    ['chuva.svg', 'Nuvem com chuva', 'chuva'],
    ['chapeu.svg', 'Um chapéu', 'chapéu'],
  ];
  for (const [indice, [arquivo, alt, correta]] of pares.entries()) {
    const item = page.locator('[data-item-gramatica]').nth(indice);
    const figura = item.getByRole('img', { name: alt });
    await expect(figura).toBeVisible();
    expect(await figura.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await figura.getAttribute('src')).toContain(arquivo);
    await expect(item.getByRole('button', { name: correta, exact: true })).toBeVisible();
    const svg = fs.readFileSync(
      path.resolve('ambiente_interativo/assets/gramatica_alice_outubro_2026', arquivo),
      'utf8'
    );
    expect(svg).toContain(`aria-label="${alt}"`);
  }
  await auditar(page);
});

test('Modo Responsável é opt-in, isola chaves, salta sem progresso e retorna à Alice', async ({
  page,
}) => {
  await abrir(page);
  await responder(page, 1);
  const principalAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 30 de 30');
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), AUXILIAR)
  ).toMatchObject({
    questaoAtual: 29,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    tentativas: {},
    pontos: 0,
  });
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principalAntes);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await page.keyboard.press('Control+Alt+R');
  await responder(page, 30);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 30 de 30');
});

test('limpeza auxiliar preserva Alice e revisões vizinhas; legado ignora o atalho', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) =>
      chaves.forEach((chave) => localStorage.setItem(chave, JSON.stringify({ preservar: true }))),
    VIZINHAS
  );
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  const antes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('12');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(antes);
  expect(
    await page.evaluate(
      (chaves) => chaves.map((chave) => JSON.parse(localStorage.getItem(chave))),
      VIZINHAS
    )
  ).toEqual([{ preservar: true }, { preservar: true }]);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-contos-digrafos-alice').click();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
});

test('limpeza principal preserva a sessão responsável e o cartão usa só Alice', async ({
  page,
}) => {
  await abrir(page);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  expect(await page.evaluate((id) => window.GramaticaQuestionarios.obterSituacao(id), ID)).toBe(
    'nao-iniciada'
  );
  await responder(page, 1);
  const auxiliarAntes = await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR);
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBe(auxiliarAntes);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
});

test('toque no celular opera seleção e o painel sem alterar Alice', async ({ browser }) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(URL);
  await abrir(pagina);
  await pagina
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0], exact: true })
    .tap();
  await expect(
    pagina.locator('[data-item-gramatica]').first().locator('[aria-pressed="true"]')
  ).toHaveCount(1);
  await pagina.keyboard.press('Control+Alt+R');
  await pagina.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await pagina.locator('#gramatica-modo-responsavel-proxima').tap();
  await expect(pagina.locator('#gramatica-contador')).toHaveText('Questão 2 de 30');
  await expect(pagina.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await auditar(pagina);
  await contexto.close();
});

test('JSON inválido, localStorage bloqueado, file:// e troca para revisão legada', async ({
  page,
  browser,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{inválido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  const bloqueado = await browser.newContext();
  await bloqueado.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado');
      };
  });
  const paginaBloqueada = await bloqueado.newPage();
  await paginaBloqueada.goto(URL);
  await abrir(paginaBloqueada);
  await responder(paginaBloqueada, 1);
  await paginaBloqueada.locator('#gramatica-proxima').click();
  await paginaBloqueada.locator('#gramatica-voltar').click();
  await expect(paginaBloqueada.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await bloqueado.close();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await preparar(page, 18);
  await expect(page.getByRole('img', { name: 'Uma xícara' })).toBeVisible();
  expect(rede).toEqual([]);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`layout e painel acessíveis em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await abrir(page);
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    await auditar(page);
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
    await auditar(page);
    await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
    await page.locator('#gramatica-modo-responsavel-proxima').click();
    await auditar(page);
  });
}
