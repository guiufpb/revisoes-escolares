const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'mariana-gramatica-pontuacao-ortografia-vocabulario-setembro-2026';
const CHAVE = 'revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1';
const OUTRAS = [
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1',
  'revisoesEscolares.mariana.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1',
];

const GABARITO = [
  [
    'Termina uma frase declarativa.',
    'Faz uma pergunta.',
    'Mostra emoção, surpresa ou ordem.',
    'Anuncia uma fala ou uma enumeração.',
    'Pode iniciar a fala de uma personagem.',
  ],
  [':', '—', '!'],
  { campos: [':', '—', '?', ':', '—', '!'] },
  { campos: ['— Você viu meu caderno?'] },
  ['Afirmativa/declarativa', 'Negativa', 'Interrogativa', 'Exclamativa', 'Imperativa', 'Optativa'],
  ['Afirmativa', 'Afirmativa', 'Negativa', 'Negativa'],
  [
    { ordem: ['O', 'palhaço', 'é', 'muito', 'engraçado.'] },
    'Declarativa',
    { ordem: ['Onde', 'está', 'meu', 'gorro?'] },
    'Interrogativa',
  ],
  ['— travessão'],
  ['Na mochila há caderno, lápis, régua e borracha.'],
  [
    'No parque vimos árvores, flores, pássaros e borboletas.',
    'Na feira havia banana, maçã, pera e melancia.',
  ],
  ['Marina, pegue o lápis.', 'Cidade do Sol, 12 de setembro de 2026.', 'Rua das Flores, 25.'],
  ['Bia, leve caderno, lápis e borracha.\nAté mais!'],
  [{ selecao: ['casa', 'mesa', 'rosa', 'tesoura', 'camisa'] }],
  { campos: ['s', 'ss', 's', 'ss', 'ss', 's'] },
  ['casaco', 'pássaro', 'tesoura', 'passeio'],
  { campos: ['casaco', 'pássaro', 'tesoura', 'passeio'] },
  ['pás-sa-ro', 'as-sa-do', 'pas-sei-o', { ordem: ['assado', 'camisa', 'passeio', 'tesoura'] }],
  [
    'R forte no início',
    'R brando entre vogais',
    'R brando entre vogais',
    'RR forte entre vogais',
    'RR forte entre vogais',
  ],
  { campos: ['rr', 'r', 'rr', 'rr', 'r', 'rr'] },
  ['caro', 'carro'],
  { campos: ['barata', 'carroça', 'sorriso', 'terreno'] },
  ['ter-re-no', 'car-ra-pa-to', 'so-cor-ro', 'car-ro-ça'],
  ['bonito', 'barulho', 'encontrar', 'saltar', 'terminar'],
  ['recebeu', 'venceu', 'sair', 'cortar'],
  ['feio', 'claro', 'covarde', 'baixo', 'curto'],
  { campos: ['incorreto', 'injusto', 'incompleto', 'impuro', 'impossível', 'impaciente'] },
  ['Sinônimos', 'Sinônimos', 'Antônimos', 'Sinônimos', 'Antônimos', 'Antônimos'],
  ['AR', 'ER', 'IR', 'OR', 'UR'],
  { campos: ['or', 'ar', 'ur', 'ir', 'er'] },
  ['bor-bo-le-ta · 4', 'ar-bus-to · 3', 'ur-so · 2', 'cir-co · 2', 'er-va · 2'],
  { campos: ['os', 'as', 'us', 'is', 'es'] },
  [
    'testa',
    'risco',
    'mosca',
    'lista',
    'resto',
    { ordem: ['lista', 'mosca', 'resto', 'risco', 'testa'] },
  ],
  { campos: ['m', 'm', 'm', 'm', 'm', 'm'] },
  [
    'coração',
    'lenço',
    'cabeça',
    'açúcar',
    { selecao: ['água', 'guarda', 'quarto'] },
    'você',
    'café',
  ],
  [':', '—', 'Separar o vocativo, chamando alguém.', 'Interrogativa', 'RR', 'feliz'],
];

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-pontuacao-ortografia-mariana').click();
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
        for (const cartao of resposta.ordem)
          await item.getByRole('button', { name: cartao, exact: true }).click();
      } else if (resposta.selecao) {
        for (const opcao of resposta.selecao) {
          const botaoNoItem = item.getByRole('button', { name: opcao, exact: true });
          const botao = (await botaoNoItem.count())
            ? botaoNoItem
            : page.getByRole('button', { name: opcao, exact: true });
          await botao.click();
        }
      } else {
        await item.getByRole('button', { name: resposta, exact: true }).click();
      }
    }
  }
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

async function simularAudio(page) {
  await page.addInitScript(() => {
    window.__falasMarianaSetembro = [];
    window.__estadosAudioMarianaSetembro = [];
    document.addEventListener('audioestadoalterado', (evento) => {
      window.__estadosAudioMarianaSetembro.push({
        fase: evento.detail.fase,
        atrasoMs: evento.detail.atrasoMs,
      });
    });
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz online', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasMarianaSetembro.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        volume: fala.volume,
        local: fala.voice.localService,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

async function auditar(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(resultado.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual(
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

test('cadastra 35 questões e preserva revisões anteriores com ID e chave exclusivos', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.GramaticaQuestionarios.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
      antiga: window.GramaticaQuestionarios.obterRevisao(
        'mariana-gramatica-contos-ortografia-pontuacao'
      ).questoes.length,
      ampla: window.RevisaoGramaticaMariana.questoes.length,
    }),
    ID
  );
  expect(dados.revisao).toMatchObject({
    id: ID,
    chave: CHAVE,
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
  });
  expect(dados.registro).toMatchObject({ chaveArmazenamento: CHAVE, totalEtapas: 35 });
  expect(dados.revisao.questoes).toHaveLength(35);
  expect(new Set(dados.revisao.questoes.map((questao) => questao.id)).size).toBe(35);
  expect(
    dados.revisao.questoes.filter((questao) => questao.ditado).map((questao) => questao.id)
  ).toEqual(['q04', 'q16', 'q21']);
  expect(dados.antiga).toBe(30);
  expect(dados.ampla).toBe(40);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-pontuacao-ortografia-mariana')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 35');
});

test('Q22 distribui as respostas corretas entre as alternativas', async ({ page }) => {
  const indices = await page.evaluate((id) => {
    const questao = window.GramaticaQuestionarios.obterRevisao(id).questoes[21];
    return questao.itens.map((item) => item.opcoes.indexOf(item.respostas[0]));
  }, ID);
  expect(indices).toEqual([1, 2, 1, 2]);
  expect(indices.every((indice) => indice === 0)).toBe(false);
});

test('distribui deterministicamente as respostas e rompe sequências previsíveis', async ({
  page,
}) => {
  const dados = await page.evaluate((id) => {
    const questoes = window.GramaticaQuestionarios.obterRevisao(id).questoes;
    const indices = (numero) =>
      questoes[numero - 1].itens
        .filter((item) => item.opcoes && item.tipo !== 'selecao')
        .map((item) => item.opcoes.indexOf(item.respostas[0]));
    return {
      q23: indices(23),
      q25: indices(25),
      q27Respostas: questoes[26].itens.map((item) => item.respostas[0]),
      q30: indices(30),
      q31: questoes[30].itens.map((item) => item.respostas[0]),
      q32: indices(32),
      q34Grafias: indices(34).slice(0, 4),
      q34Selecao: questoes[33].itens[4].respostas.map((resposta) =>
        questoes[33].itens[4].opcoes.indexOf(resposta)
      ),
      q34Acentos: indices(34).slice(4),
      auditoria: [1, 10, 11, 15, 17, 24, 28, 35].map(indices),
      sequenciasAvaliativas: questoes
        .map((questao) =>
          questao.itens
            .filter((item) => item.opcoes && item.tipo !== 'selecao')
            .map((item) => item.opcoes.indexOf(item.respostas[0]))
        )
        .filter((sequencia) => sequencia.length >= 4),
    };
  }, ID);
  expect(dados.q23).toEqual([1, 2, 0, 1, 2]);
  expect(dados.q25).toEqual([1, 2, 0, 1, 2]);
  expect(dados.q27Respostas).toEqual([
    'Sinônimos',
    'Sinônimos',
    'Antônimos',
    'Sinônimos',
    'Antônimos',
    'Antônimos',
  ]);
  expect(dados.q30).toEqual([1, 2, 0, 1, 2]);
  expect(dados.q31).toEqual(['os', 'as', 'us', 'is', 'es']);
  expect(dados.q32).toEqual([1, 2, 0, 1, 2]);
  expect(dados.q34Grafias).toEqual([1, 2, 0, 1]);
  expect(dados.q34Selecao).toEqual([1, 3, 5]);
  expect(dados.q34Acentos).toEqual([2, 1]);
  for (const indices of dados.auditoria) {
    expect(indices.length).toBeGreaterThan(1);
    expect(indices.every((indice) => indice === 0)).toBe(false);
  }
  for (const sequencia of dados.sequenciasAvaliativas) {
    expect(auditarPosicoesGabarito(sequencia)).toEqual([]);
  }
});

test('percurso completo usa gabarito independente e conclui com 35 pontos', async ({ page }) => {
  test.setTimeout(150_000);
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

test('erro é recuperável e seleção por teclado persiste ao voltar e recarregar sem duplicar ponto', async ({
  page,
}) => {
  await abrir(page);
  const errada = page.getByRole('button', { name: 'Faz uma pergunta.', exact: true }).first();
  await errada.focus();
  await page.keyboard.press('Space');
  for (const [indice, resposta] of GABARITO[0].entries()) {
    if (indice === 0) continue;
    await page
      .locator('[data-item-gramatica]')
      .nth(indice)
      .getByRole('button', { name: resposta, exact: true })
      .click();
  }
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('Revise');
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0], exact: true })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
});

test('ordenação e seleção são reversíveis, persistem várias ações e exigem todos os subitens', async ({
  page,
}) => {
  await preparar(page, 7);
  const primeiro = page.locator('[data-item-gramatica]').first();
  for (const cartao of ['O', 'palhaço', 'é'])
    await primeiro.getByRole('button', { name: cartao, exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(3);
  await page.locator('[data-retirar-ordem-misto]').first().press('Space');
  await page.getByRole('button', { name: 'Limpar sequência', exact: true }).first().click();
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  await responder(page, 7);
  await preparar(page, 13);
  for (const opcao of ['casa', 'mesa', 'pasta'])
    await page.getByRole('button', { name: opcao, exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(3);
  await page.getByRole('button', { name: 'pasta', exact: true }).click();
  for (const opcao of ['rosa', 'tesoura', 'camisa'])
    await page.getByRole('button', { name: opcao, exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('Q3 insere travessão por teclado, rejeita hífen e persiste a edição', async ({ page }) => {
  await preparar(page, 3);
  const campos = page.locator('[data-resposta-gramatica]');
  const botoes = page.getByRole('button', { name: 'Inserir travessão —' });
  await expect(botoes).toHaveCount(2);
  await campos.nth(1).fill('-');
  await campos.nth(1).evaluate((input) => input.setSelectionRange(0, 1));
  await botoes.first().press('Enter');
  await expect(campos.nth(1)).toHaveValue('—');
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-resposta-gramatica]').nth(1)).toHaveValue('—');

  for (const [indice, resposta] of GABARITO[2].campos.entries()) {
    await page.locator('[data-resposta-gramatica]').nth(indice).fill(resposta);
  }
  await page.locator('[data-resposta-gramatica]').nth(4).fill('-');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page
    .locator('[data-resposta-gramatica]')
    .nth(4)
    .evaluate((input) => input.setSelectionRange(0, 1));
  await page.getByRole('button', { name: 'Inserir travessão —' }).nth(1).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('ditados não revelam respostas, exigem grafia e usam somente voz local pt-BR', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await simularAudio(page);
  for (const [numero, respostas] of [
    [4, ['— Você viu meu caderno?']],
    [16, ['casaco', 'pássaro', 'tesoura', 'passeio']],
    [21, ['barata', 'carroça', 'sorriso', 'terreno']],
  ]) {
    await preparar(page, numero);
    expect(await page.evaluate(() => window.__falasMarianaSetembro)).toEqual([]);
    const html = (await page.locator('#gramatica-conteudo').innerHTML()).toLowerCase();
    for (const resposta of respostas) expect(html).not.toContain(resposta.toLowerCase());
    await page.locator('[data-ouvir-ditado-gramatica]').first().focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.__falasMarianaSetembro.length)).toBe(1);
    const primeiraSequencia = await page.evaluate(() => ({
      falas: window.__falasMarianaSetembro.map((fala) => fala.texto),
      estados: window.__estadosAudioMarianaSetembro.slice(-3),
    }));
    const respostaFalada = (numero === 4 ? 'A frase é: ' : 'A palavra é: ') + respostas[0];
    expect(primeiraSequencia.falas).toEqual([respostaFalada]);
    expect(primeiraSequencia.estados.map((estado) => estado.fase)).toEqual([
      'aguardando',
      'reproduzindo',
      'concluido',
    ]);
    const ultima = await page.evaluate(() => window.__falasMarianaSetembro.at(-1));
    expect(ultima).toMatchObject({
      texto: respostaFalada,
      idioma: 'pt-BR',
      velocidade: 0.78,
      local: true,
    });
    await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__falasMarianaSetembro.length)).toBe(2);
    const repeticao = await page.evaluate(() => ({
      falas: window.__falasMarianaSetembro.slice(-1).map((fala) => fala.texto),
      estados: window.__estadosAudioMarianaSetembro.slice(-3),
    }));
    expect(repeticao.falas).toEqual([respostaFalada]);
    expect(repeticao.estados.map((estado) => estado.fase)).toEqual([
      'aguardando',
      'reproduzindo',
      'concluido',
    ]);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
  }
  await preparar(page, 4);
  const campo = page.locator('[data-resposta-gramatica]');
  for (const [erro, orientacao] of [
    ['Você viu meu caderno?', 'travessão seguido de espaço'],
    ['— voce viu meu caderno?', 'acentos'],
    ['— Você viu meu caderno.', 'sinal de pontuação'],
    ['— Você viu?', 'fala está incompleta'],
    ['— Você viu meu cadermo?', 'escrita de cada palavra'],
  ]) {
    await campo.fill(erro);
    await campo.press('Enter');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('.retorno-gramatica')).toContainText(orientacao);
    await expect(page.locator('.retorno-gramatica')).not.toContainText('— Você viu meu caderno?');
  }
  await campo.fill(' Você viu meu caderno?');
  await campo.evaluate((input) => input.setSelectionRange(0, 0));
  await page.getByRole('button', { name: 'Inserir travessão —' }).press('Enter');
  await expect(campo).toHaveValue('— Você viu meu caderno?');
  await campo.press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('limpa somente a chave nova e mantém isolado o progresso dos outros perfis e revisões', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) =>
      chaves.forEach((chave) => localStorage.setItem(chave, JSON.stringify({ marcador: chave }))),
    OUTRAS
  );
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar progresso de Gramática' }).click();
  const valores = await page.evaluate(
    ({ chave, outras }) => ({
      nova: localStorage.getItem(chave),
      outras: outras.map((item) => localStorage.getItem(item)),
    }),
    { chave: CHAVE, outras: OUTRAS }
  );
  expect(valores.nova).toBeNull();
  expect(valores.outras.map((valor) => JSON.parse(valor))).toEqual(
    OUTRAS.map((marcador) => ({ marcador }))
  );
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`Desktop Amplo ${viewport.width} × ${viewport.height} sem overflow e com axe`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await abrir(page);
    const tela = page.locator('#tela-gramatica-mariana');
    await expect(tela).toHaveClass(/layout-desktop-amplo/);
    const caixa = await tela.boundingBox();
    expect(caixa.width).toBeGreaterThan(viewport.width * 0.92);
    const leitura = await page.locator('.leitura-gramatica').boundingBox();
    const respostas = await page.locator('.respostas-gramatica').boundingBox();
    expect(respostas.x).toBeGreaterThan(leitura.x + leitura.width);
    await auditar(page);
    await preparar(page, 7);
    await auditar(page);
    await preparar(page, 34);
    await auditar(page);
  });
}

test('celular 390 × 844 aceita toque, campos, seleção e ordenação sem overflow', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.goto('http://127.0.0.1:5173' + URL);
  await abrir(page);
  await page
    .locator('[data-item-gramatica]')
    .first()
    .getByRole('button', { name: GABARITO[0][0], exact: true })
    .tap();
  await auditar(page);
  await preparar(page, 3);
  await page.getByRole('button', { name: 'Inserir travessão —' }).first().tap();
  await expect(page.locator('[data-resposta-gramatica]').nth(1)).toHaveValue('—');
  await auditar(page);
  for (const numero of [4, 7, 13, 34]) {
    await preparar(page, numero);
    await auditar(page);
  }
  expect(erros).toEqual([]);
  await context.close();
});

test('tolera armazenamento corrompido e bloqueado mantendo o fluxo em memória', async ({
  page,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{quebrado'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 35');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Bloqueado', 'SecurityError');
      },
    });
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 35');
});

test('bundle file:// mantém ditado, correção e progresso sem recurso externo', async ({ page }) => {
  const externos = [];
  page.on('request', (requisicao) => {
    if (/^https?:/.test(requisicao.url())) externos.push(requisicao.url());
  });
  await simularAudio(page);
  await page.goto(
    pathToFileURL(path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html')).href
  );
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await preparar(page, 21);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect
    .poll(() => page.evaluate(() => window.__falasMarianaSetembro.at(-1)?.texto))
    .toBe('A palavra é: barata');
  await responder(page, 21);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  expect(externos).toEqual([]);
});
