const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGINA = '/ambiente_interativo/index.html';
const CHAVE = 'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2';
const ANTERIOR = 'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1';
const CITY = 'revisoesEscolares.mariana.ingles.cityLifeUnidade5.v2';
const UNIT3 = 'revisoesEscolares.alice.ingles.atSchoolUnidade3.v1';

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-ingles-at-the-farm').click();
}

async function prepararPortao(page, audios = true, escritas = true, questaoAtual = 0) {
  await page.evaluate(
    ({ chave, audios, escritas, questaoAtual }) => {
      const unidade = window.RegistroIngles.obter('at-the-farm-unidade-5');
      const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
      localStorage.setItem(
        chave,
        JSON.stringify({
          unidadeId: unidade.id,
          versao: unidade.versao,
          itensOuvidos: audios ? itens.map((item) => item.id) : [],
          respostasEscrita: escritas
            ? Object.fromEntries(itens.map((item) => [item.id, item.ingles]))
            : {},
          conferenciasEscrita: escritas
            ? Object.fromEntries(itens.map((item) => [item.id, 'correta']))
            : {},
          questaoAtual,
        })
      );
    },
    { chave: CHAVE, audios, escritas, questaoAtual }
  );
  await page.reload();
  await abrir(page);
}

test.beforeEach(async ({ page }) => {
  await page.goto(PAGINA);
});

test('At the Farm v2 preserva os 41 itens e cadastra os 56 novos, 30 questões e assets locais', async ({
  page,
}) => {
  const dados = await page.evaluate(() => ({
    unidade: window.RegistroIngles.obter('at-the-farm-unidade-5'),
    cadastro: window.RegistroRevisoes.obter('alice-ingles-at-the-farm-unidade-5'),
    configuracao: window.ConfiguracoesIngles.aliceAtTheFarm,
  }));
  const { unidade, cadastro } = dados;
  expect(unidade).toMatchObject({
    versao: 2,
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
  });
  expect(cadastro).toMatchObject({
    cartaoId: 'abrir-ingles-at-the-farm',
    chaveArmazenamento: CHAVE,
    totalEtapas: 127,
    aluno: 'alice',
  });
  expect(dados.configuracao.chaveArmazenamento).toBe(CHAVE);
  expect(unidade.grupos).toHaveLength(10);
  expect(unidade.grupos.slice(0, 4).map((grupo) => grupo.id)).toEqual([
    'animais-fazenda',
    'familias-grupos',
    'cuidados-alimentos',
    'lugares-sons',
  ]);
  expect(unidade.grupos.slice(0, 4).flatMap((grupo) => grupo.itens.map((item) => item.id))).toEqual(
    [
      'bird',
      'pig',
      'sheep',
      'dog',
      'chicken',
      'goat',
      'cat',
      'horse',
      'cow',
      'mouse',
      'duck',
      'fish',
      'farm-animal',
      'calf',
      'lamb',
      'piglet',
      'chick',
      'duckling',
      'baby-animals',
      'animals-and-babies',
      'four-legged-animals',
      'birds',
      'mammals',
      'food',
      'water',
      'milk',
      'grass',
      'carrots',
      'hay',
      'feed-animals',
      'brush-horse',
      'ride-horse',
      'farm',
      'city',
      'pond',
      'aquarium',
      'home',
      'woof',
      'moo',
      'cluck',
      'oink',
    ]
  );
  const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
  expect(itens).toHaveLength(97);
  expect(new Set(itens.map((item) => item.id)).size).toBe(97);
  expect(
    unidade.grupos.slice(4).flatMap((grupo) => grupo.itens.map((item) => item.ingles))
  ).toEqual([
    'rabbit',
    'hen',
    'lion',
    "Father's Day",
    'celebration',
    'father',
    'gifts',
    'dad',
    'heart',
    'love',
    "Happy Father's Day!",
    'mother',
    'parents',
    'brother',
    'sister',
    'family',
    'toys',
    'doll',
    'ball',
    'rocket',
    'robot',
    'blocks',
    'helicopter',
    'boat',
    'teddy bear',
    'truck',
    'mini car',
    'train',
    'plane',
    'bike',
    'on',
    'under',
    'next to',
    'in',
    'in front of',
    'am',
    'is',
    'are',
    'has',
    'have',
    'student',
    'book',
    'pencil',
    'backpack',
    'teacher',
    'classroom',
    'school',
    'learn',
    'friend',
    'soldier',
    'brave',
    'courage',
    'protect',
    'duty',
    'respect',
    'country',
  ]);
  expect(JSON.stringify(unidade)).not.toMatch(/\b(hocket|rabit)\b/i);
  expect(unidade.grupos[0].itens.some((item) => item.id === 'lion')).toBe(false);
  expect(unidade.atividades).toHaveLength(30);
  expect(new Set(unidade.atividades.map((questao) => questao.id)).size).toBe(30);
  expect(itens.length + unidade.atividades.length).toBe(cadastro.totalEtapas);
  expect(unidade.atividades.map((questao) => questao.respostaCorreta)).toEqual([
    'rabbit',
    'lion',
    'lamb',
    'duckling',
    'birds',
    'mammals',
    'three',
    'horse',
    'hay',
    'chocolate',
    'pond',
    'farm',
    'food-water',
    'brush-horse',
    'woof',
    'cluck',
    'happy-fathers-day',
    'gifts',
    'teddy-bear',
    'helicopter',
    'pencil',
    'protect',
    'parents',
    'under',
    'on',
    'in',
    'next-to',
    'in-front-of',
    'am-is-are',
    'has-have',
  ]);
  expect(unidade.atividades[6]).toMatchObject({ imagemEnunciado: 'pig.svg', repeticoesImagem: 3 });
  for (const questao of unidade.atividades) {
    expect(questao.id).toMatch(/^v2-/);
    expect(
      questao.alternativas.filter((opcao) => opcao.id === questao.respostaCorreta)
    ).toHaveLength(1);
    expect(questao.instrucaoPortugues).toBeTruthy();
    expect(questao.feedbackErro).toBeTruthy();
    expect(questao.explicacao).toBeTruthy();
  }
  const imagens = [
    ...itens.map((item) => item.imagem),
    ...unidade.atividades.flatMap((questao) => [
      questao.imagemEnunciado,
      ...questao.alternativas.map((opcao) => opcao.imagem),
    ]),
  ].filter(Boolean);
  for (const imagem of new Set(imagens)) {
    expect(imagem).toMatch(/^[a-z0-9-]+\.svg$/);
    expect(fs.existsSync(path.join(__dirname, '..', 'assets', 'objetos_escolares', imagem))).toBe(
      true
    );
  }
  await abrir(page);
  await expect(page.locator('#ingles-titulo-unidade')).toContainText('Version 2');
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/97 áudios · 0/97 escritas');
});

test('At the Farm v2 escreve, corrige, restaura, pronuncia por ação e limpa somente sua chave', async ({
  page,
}) => {
  await page.evaluate(
    ({ anterior, city, unit3 }) => {
      localStorage.setItem(
        anterior,
        JSON.stringify({ marcador: 'v1-intacta', atividadeFinalizada: true })
      );
      localStorage.setItem(city, JSON.stringify({ marcador: 'mariana-intacta' }));
      localStorage.setItem(unit3, JSON.stringify({ marcador: 'unit3-intacta' }));
    },
    { anterior: ANTERIOR, city: CITY, unit3: UNIT3 }
  );
  await page.evaluate(() => {
    window.__falasFarmV2 = [];
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz local de teste', lang: 'en-US', localService: true },
    ];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasFarmV2.push({ texto: fala.text, idioma: fala.lang, velocidade: fala.rate });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
    window.AudioRevisoes.atualizarVozes();
  });
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/97 áudios · 0/97 escritas');
  await page.locator('[data-grupo-ingles="brinquedos"]').click();
  expect(await page.evaluate(() => window.__falasFarmV2)).toEqual([]);
  await page.locator('[data-item-ingles="rocket"]').press('Enter');
  await expect
    .poll(() => page.evaluate(() => window.__falasFarmV2.at(-1)?.texto))
    .toBe('Word: rocket');
  expect(await page.evaluate(() => window.__falasFarmV2.at(-1))).toEqual({
    texto: 'Word: rocket',
    idioma: 'en-US',
    velocidade: 0.62,
  });
  const falas = await page.evaluate(() => window.__falasFarmV2.length);
  const campo = page.getByLabel('Digite a palavra ou expressão em inglês');
  await campo.fill('roket');
  await page.getByRole('button', { name: 'Conferir escrita' }).click();
  await expect(campo).toHaveAttribute('aria-invalid', 'true');
  await campo.fill('  RoCkEt  ');
  await campo.press('Enter');
  await expect(page.locator('[data-item-ingles="rocket"]')).toContainText('✓ Escrito');
  await expect(page.locator('[data-item-ingles="rocket"]')).toContainText('✓ Ouvido');
  expect(await page.evaluate(() => window.__falasFarmV2.length)).toBe(falas);
  await campo.fill('rock');
  await page.reload();
  await abrir(page);
  await expect(campo).toHaveValue('rock');
  await campo.fill('rocket');
  await campo.press('Enter');
  await page.reload();
  await abrir(page);
  await expect(campo).toHaveValue('rocket');
  await expect(page.locator('[data-item-ingles="rocket"]')).toContainText('✓ Escrito');
  await page.locator('[data-grupo-ingles="familia-dia-pais"]').click();
  await campo.fill('Fathers Day');
  await campo.press('Enter');
  await expect(page.locator('#ingles-palavra-copia')).toHaveText("Father's Day");
  await expect(page.locator('#ingles-status-escrita')).toContainText('Great!');
  await page.locator('[data-item-ingles="happy-fathers-day"]').click();
  await campo.fill('  HAPPY   FATHERS DAY  ');
  await campo.press('Enter');
  await expect(page.locator('#ingles-palavra-copia')).toHaveText("Happy Father's Day!");
  await expect(page.locator('#ingles-status-escrita')).toContainText('Great!');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#limpar-progresso').click();
  expect(
    await page.evaluate(
      ({ chave, anterior, city, unit3 }) => ({
        atual: localStorage.getItem(chave),
        anterior: JSON.parse(localStorage.getItem(anterior)).marcador,
        city: JSON.parse(localStorage.getItem(city)).marcador,
        unit3: JSON.parse(localStorage.getItem(unit3)).marcador,
      }),
      { chave: CHAVE, anterior: ANTERIOR, city: CITY, unit3: UNIT3 }
    )
  ).toEqual({
    atual: null,
    anterior: 'v1-intacta',
    city: 'mariana-intacta',
    unit3: 'unit3-intacta',
  });
});

test('At the Farm v2 só libera 30 atividades com os 97 áudios e as 97 escritas corretas', async ({
  page,
}) => {
  for (const [audios, escritas] of [
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ]) {
    await prepararPortao(page, audios, escritas);
    await expect(page.locator('#ingles-progresso-texto')).toHaveText(
      `${audios ? 97 : 0}/97 áudios · ${escritas ? 97 : 0}/97 escritas`
    );
    if (audios && escritas) {
      await expect(page.getByRole('button', { name: 'Começar as 30 atividades →' })).toBeEnabled();
    } else {
      await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
    }
  }
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`At the Farm v2 desktop ${viewport.width}×${viewport.height}: grade, preposições, axe e isolamento visual`, async ({
    page,
  }, testInfo) => {
    const erros = [];
    page.on('pageerror', (erro) => erros.push(erro.message));
    page.on('console', (mensagem) => {
      if (mensagem.type() === 'error') erros.push(mensagem.text());
    });
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await prepararPortao(page, true, true, 23);
    await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
    const layout = await page.evaluate(() => {
      const rect = (seletor) => document.querySelector(seletor).getBoundingClientRect();
      return {
        proporcao: rect('#tela-ingles').width / window.innerWidth,
        escritaEsquerda: rect('#ingles-pratica-escrita').right < rect('#ingles-grade-itens').left,
        colunas: window
          .getComputedStyle(document.getElementById('ingles-grade-itens'))
          .gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(layout.proporcao).toBeGreaterThan(0.9);
    expect(layout.escritaEsquerda).toBe(true);
    expect(layout.colunas).toBeGreaterThanOrEqual(4);
    expect(layout.overflow).toBe(false);
    for (const grupo of ['brinquedos', 'pequena-gramatica', 'posicoes']) {
      await page.locator(`[data-grupo-ingles="${grupo}"]`).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
    }
    const campo = page.getByLabel('Digite a palavra ou expressão em inglês');
    await campo.focus();
    await expect(campo).toBeFocused();
    expect(
      await campo.evaluate((elemento) => window.getComputedStyle(elemento).outlineStyle)
    ).not.toBe('none');
    await page
      .locator('.conteudo-grupo-ingles')
      .screenshot({ path: testInfo.outputPath('vocabulario.png') });
    const vocabulario = await new AxeBuilder({ page }).analyze();
    expect(
      vocabulario.violations.filter((item) => ['serious', 'critical'].includes(item.impact))
    ).toEqual([]);
    await page.locator('#ingles-iniciar-atividades').click();
    await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 24 de 30');
    await expect(page.locator('#ingles-cartao-questao')).toHaveClass(/com-apoio-visual/);
    const areas = await page.evaluate(() => ({
      colunas: window
        .getComputedStyle(document.getElementById('ingles-cartao-questao'))
        .gridTemplateColumns.split(' ').length,
      alternativas: window
        .getComputedStyle(document.getElementById('ingles-alternativas-atividade'))
        .gridTemplateColumns.split(' ').length,
    }));
    expect(areas).toEqual({ colunas: 2, alternativas: 2 });
    await page
      .locator('#ingles-painel-atividades')
      .screenshot({ path: testInfo.outputPath('preposicao.png') });
    const atividade = await new AxeBuilder({ page }).analyze();
    expect(
      atividade.violations.filter((item) => ['serious', 'critical'].includes(item.impact))
    ).toEqual([]);
    for (const id of ['under', 'on', 'in', 'next-to', 'in-front-of']) {
      await expect(page.locator('#ingles-imagens-enunciado img')).toHaveCount(1);
      await page.locator(`[data-alternativa-atividade-ingles="${id}"]`).click();
      await page.locator('#ingles-conferir-atividade').click();
      await page.locator('#ingles-atividade-proxima').click();
    }
    await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 29 de 30');
    await expect(page.locator('#ingles-cartao-questao')).not.toHaveClass(/com-apoio-visual/);
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
    await page.getByRole('button', { name: /Mariana/ }).click();
    await page.locator('#abrir-ingles-city-life').click();
    await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
    await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/73 áudios · 0/73 escritas');
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
    await page.getByRole('button', { name: /Alice/ }).click();
    await page.locator('[data-materia="ingles"]').click();
    await expect(page.locator('#tela-ingles')).not.toHaveClass(/layout-desktop-amplo/);
    await expect(page.locator('#ingles-pratica-escrita')).toBeHidden();
    expect(erros).toEqual([]);
  });
}

test('At the Farm v2 abre com escrita e desktop amplo pelo bundle file local', async ({ page }) => {
  await page.goto(
    pathToFileURL(path.join(__dirname, '..', 'ambiente_interativo', 'index.html')).href
  );
  await abrir(page);
  await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/97 áudios · 0/97 escritas');
  await page.locator('[data-grupo-ingles="mais-animais"]').click();
  await page.getByLabel('Digite a palavra ou expressão em inglês').fill('rabbit');
  await page.getByLabel('Digite a palavra ou expressão em inglês').press('Enter');
  await expect(page.locator('#ingles-status-escrita')).toContainText('Great!');
});
