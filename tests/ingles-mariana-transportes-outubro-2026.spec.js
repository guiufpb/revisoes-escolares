const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const UNIT = 'means-of-transportation-outubro-2026';
const KEY = 'revisoesEscolares.mariana.ingles.meansOfTransportationOutubro2026.v1';
const AUX = 'revisoesEscolares.responsavel.ingles.marianaMeansOfTransportationOutubro2026.v1';
const CARD = '#abrir-ingles-transportes-outubro';
// Independent editorial answer key. Never read the application's answer properties.
const ANSWERS = [
  ['car', 'bus'],
  ['motorbike', 'bike'],
  ['fig-boat', 'fig-helicopter'],
  ['train', 'plane', 'lorry'],
  ['plane', 'car'],
  ['it-s-a-plane', 'no-it-isn-t'],
  ['fig-train', 'fig-bus'],
  ['air', 'land', 'water', 'land'],
  ['water', 'air', 'air'],
  ['motorised', 'non-motorised', 'motorised', 'motorised'],
  ['non-motorised', 'non-motorised'],
  ['motorised', 'non-motorised'],
  ['helmet', 'seatbelt'],
  ['lifejacket', 'knee-pads'],
  ['not-safe', 'safe', 'not-safe', 'safe'],
  [['stop', 'check', 'cross'], 'fig-green-person'],
  ['scene-b', 'scene-b'],
  ['motorbike-4-minutes', 'bus-3-minutes'],
  ['fig-left', 'fig-right'],
  ['bus', 'boat'],
  ['by-bus', 'mia', 'it-has-a-ramp-and-space-for-leo-s-wheelchair'],
  [['train-8-places', 'bus-6-places'], 'boat'],
  ['wednesday', 'saturday', 'monday'],
  ['spring', 'winter'],
  [['boat', 'bike'], 'lifejacket', 'left'],
];
const DICTATION = [
  'bus',
  'bike',
  'helicopter',
  'car',
  'boat',
  'lorry',
  'plane',
  'train',
  'motorbike',
  'helmet',
  'lifejacket',
  'seatbelt',
  'knee pads',
  "What's this?",
  "It's a bus.",
  'Is it a bike?',
  'Yes, it is.',
  "No, it isn't.",
  'I go by boat.',
  'Wear a helmet.',
];

async function audio(page, automatic = true) {
  await page.evaluate((automatico) => {
    window.__falasTransportes = [];
    window.__automaticoTransportes = automatico;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Local English', lang: 'en-US', localService: true },
      { name: 'Local Português', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasTransportes.push(fala);
      fala.onstart?.();
      if (window.__automaticoTransportes) window.setTimeout(() => fala.onend?.(), 0);
    };
    window.AudioRevisoes.atualizarVozes();
    const sequencia = window.AudioRevisoes.falarSequencia;
    window.AudioRevisoes.falarSequencia = (opcoes) => sequencia({ ...opcoes, pausaMs: 0 });
  }, automatic);
}

async function abrir(page) {
  await page
    .getByRole('button', { name: /Mariana/i })
    .first()
    .click();
  await page.locator(CARD).click();
  await expect(page.locator('#tela-ingles')).toHaveAttribute('data-unidade', UNIT);
}

async function preparar(page) {
  await page.evaluate(
    ({ key, unit, words }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          unidadeId: unit,
          versao: 1,
          grupoAtual: 'g1',
          itemAtual: 'd01',
          itensOuvidos: words.map((_, i) => 'd' + String(i + 1).padStart(2, '0')),
          respostasEscrita: Object.fromEntries(
            words.map((word, i) => ['d' + String(i + 1).padStart(2, '0'), word])
          ),
          conferenciasEscrita: Object.fromEntries(
            words.map((_, i) => ['d' + String(i + 1).padStart(2, '0'), 'correta'])
          ),
          historiaConcluida: true,
          ditadoEmExibicao: true,
        })
      );
    },
    { key: KEY, unit: UNIT, words: DICTATION }
  );
}

async function prepararConclusao(page) {
  await preparar(page);
  await page.evaluate(
    ({ key, answers }) => {
      const estado = JSON.parse(localStorage.getItem(key));
      estado.atividadeIniciada = true;
      estado.atividadeFinalizada = true;
      estado.questaoAtual = 24;
      estado.perguntasOuvidasAtividades = answers.map(
        (_, i) => `q${String(i + 1).padStart(2, '0')}`
      );
      estado.estimulosOuvidos = ['q03:a', 'q03:b', 'q07:a', 'q07:b'];
      estado.respostasAtividades = {};
      estado.conferenciasAtividades = {};
      estado.revisoesPosRespostaConcluidas = {};
      answers.forEach((valores, i) => {
        const id = `q${String(i + 1).padStart(2, '0')}`;
        const resposta = Object.fromEntries(
          valores.map((valor, j) => [
            String.fromCharCode(97 + j),
            Array.isArray(valor) && i !== 15 ? valor.slice().sort() : valor,
          ])
        );
        estado.respostasAtividades[id] = resposta;
        estado.conferenciasAtividades[id] = 'correta';
        estado.revisoesPosRespostaConcluidas[id] = JSON.stringify(resposta);
      });
      localStorage.setItem(key, JSON.stringify(estado));
    },
    { key: KEY, answers: ANSWERS }
  );
}

async function saltar(page, n) {
  await page.locator('#botao-inicio').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-questao').fill(String(n));
  await page.locator('#ingles-modo-responsavel-ir button[type="submit"]').click();
  await page.keyboard.press('Escape');
}

async function ouvir(page, n) {
  await page.locator('#ingles-ouvir-pergunta').click();
  await expect(page.locator('#ingles-status-atividade')).toContainText('Pergunta ouvida');
  if ([3, 7].includes(n)) {
    for (const letter of ['a', 'b']) {
      await page
        .locator('#ingles-alternativas-atividade')
        .getByRole('button', { name: `Ouvir item ${letter}`, exact: true })
        .click();
      await expect(page.locator(`[data-subitem-ingles="${letter}"]`)).toContainText(
        '✓ Item ouvido'
      );
    }
  }
}

async function responder(page, n, values = ANSWERS[n - 1]) {
  for (const [i, value] of values.entries()) {
    const letter = String.fromCharCode(97 + i);
    const scope = page.locator(`#ingles-alternativas-atividade [data-subitem-ingles="${letter}"]`);
    if (n === 5) await scope.locator('input').fill(value);
    else
      for (const id of Array.isArray(value) ? value : [value])
        await scope.locator(`[data-opcao-ingles="${id}"]`).click();
  }
}

async function revisar(page) {
  await page.locator('#ingles-conferir-atividade').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-atividade-proxima')).toBeDisabled();
  await page.locator('#ingles-ouvir-revisao').click();
  await expect(page.locator('#ingles-atividade-proxima')).toBeEnabled();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/ambiente_interativo/index.html');
});

test('catálogo, contratos e 61 respostas no percurso completo, com quatro falas em cada consolidação', async ({
  page,
}) => {
  test.setTimeout(120_000);
  await preparar(page);
  await audio(page);
  await abrir(page);
  const dados = await page.evaluate((id) => {
    const unit = window.RegistroIngles.obter(id);
    return {
      grupos: unit.grupos.map((g) => g.itens.length),
      cenas: unit.historia.cenas.length,
      perguntas: unit.atividades.length,
      respostas: unit.atividades.reduce((s, q) => s + q.itens.length, 0),
      pares: unit.pronuncia.pares.length,
    };
  }, UNIT);
  expect(dados).toEqual({ grupos: [9, 4, 7], cenas: 4, perguntas: 25, respostas: 61, pares: 5 });
  await page.locator('#ingles-iniciar-atividades').click();
  for (let n = 1; n <= 25; n += 1) {
    await ouvir(page, n);
    if (n === 3)
      expect(
        await page
          .locator('[data-subitem-ingles="b"] [data-opcao-ingles]')
          .evaluateAll((nodes) => nodes.map((node) => node.dataset.opcaoIngles))
      ).toEqual(['fig-train', 'fig-bike', 'fig-helicopter']);
    await responder(page, n);
    const antes = await page.evaluate(() => window.__falasTransportes.length);
    await revisar(page);
    const falas = await page.evaluate(
      (index) =>
        window.__falasTransportes
          .slice(index)
          .map((f) => ({ texto: f.text, idioma: f.lang, velocidade: f.rate })),
      antes
    );
    expect(falas.map((f) => f.idioma)).toEqual(['en-US', 'pt-BR', 'en-US', 'pt-BR']);
    expect(falas.map((f) => f.velocidade)).toEqual([0.62, 0.82, 0.62, 0.82]);
    if (n === 25)
      expect(falas[2].texto).toBe(
        'Phrase: The two means of transportation are bike and boat. They wear a lifejacket on the boat. The route goes left, from S to the dock.'
      );
    expect(
      await page.evaluate(
        (id) => window.InglesRevisoes.obterEstado().conferenciasAtividades[id],
        `q${String(n).padStart(2, '0')}`
      )
    ).toBe('correta');
    await page.locator('#ingles-atividade-proxima').click();
  }
  await expect(page.locator('#ingles-resumo-resultado')).toContainText('25 de 25');
  await expect(page.locator('#pronuncia-conversacao')).toBeVisible();
  await expect(page.locator('#ingles-enriquecimentos table')).toBeVisible();
  expect(
    await page.evaluate(
      () => Object.keys(window.InglesRevisoes.obterEstado().revisoesPosRespostaConcluidas).length
    )
  ).toBe(25);
});

test('ditado separado, 20 escutas/escritas, variantes, revisão do estudo e edição sem escuta fabricada', async ({
  page,
}) => {
  await audio(page);
  await abrir(page);
  await expect(page.locator('#ingles-pratica-escrita')).toBeHidden();
  await page.locator('#ingles-ditar').click();
  expect(await page.locator('#ingles-grade-itens img').count()).toBe(0);
  expect(await page.locator('#ingles-grade-itens').innerText()).not.toMatch(
    /\b(bus|bike|boat|car|helmet)\b/i
  );
  expect(await page.locator('#ingles-item-imagem').getAttribute('src')).toBeNull();
  await page.locator('#ingles-campo-escrita').fill('bus');
  await page.locator('#ingles-conferir-escrita').click();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  await page.locator('#ingles-estudar').click();
  await page.locator('[data-item-ingles="d03"]').click();
  await page.locator('#ingles-ouvir-normal').click();
  await expect(page.locator('#ingles-status-audio')).toContainText('concluído');
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await page.locator('#ingles-ditar').click();
  for (const [i, word] of DICTATION.entries()) {
    if (i === 9) await page.locator('[data-grupo-ingles="g2"]').click();
    if (i === 13) await page.locator('[data-grupo-ingles="g3"]').click();
    await page.locator(`[data-item-ingles="d${String(i + 1).padStart(2, '0')}"]`).click();
    await page.locator('#ingles-ouvir-devagar').click();
    await expect(page.locator('#ingles-status-audio')).toContainText('concluído');
    const variant =
      {
        10: 'life jacket',
        11: 'seat belt',
        13: 'What is this',
        14: 'It is a bus',
        17: 'No it is not',
      }[i] || word.toUpperCase();
    await page.locator('#ingles-campo-escrita').fill(variant);
    await page.locator('#ingles-conferir-escrita').click();
    await expect(page.locator('#ingles-status-escrita')).toContainText('Muito bem');
  }
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('20/20 áudios · 20/20 escritas');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeEnabled();
  await page.locator('#ingles-campo-escrita').fill('Wear helmet');
  await page.locator('#ingles-conferir-escrita').click();
  await expect(page.locator('#ingles-campo-escrita')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('20/20 áudios · 19/20 escritas');
});

test('parada, cancelamento, erro, repetição e callback tardio não completam outro ditado', async ({
  page,
}) => {
  await audio(page, false);
  await abrir(page);
  await page.locator('#ingles-ditar').click();
  await page.locator('#ingles-ouvir-devagar').click();
  expect(
    await page.evaluate(() => ({
      text: window.__falasTransportes.at(-1).text,
      rate: window.__falasTransportes.at(-1).rate,
      pitch: window.__falasTransportes.at(-1).pitch,
    }))
  ).toEqual({ text: 'Word: bus', rate: 0.5, pitch: 1 });
  await page.locator('#ingles-repetir').click();
  expect(await page.evaluate(() => window.__falasTransportes.at(-1).text)).toBe('Word: bus');
  await page.locator('#ingles-parar').click();
  await page.evaluate(() => window.__falasTransportes.at(-1).onend?.());
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await page.locator('#ingles-ouvir-normal').click();
  await page.locator('[data-item-ingles="d02"]').click();
  await page.evaluate(() => window.__falasTransportes.at(-1).onend?.());
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await expect(page.locator('#ingles-repetir')).toBeDisabled();
  await page.locator('#ingles-ouvir-normal').click();
  await page.evaluate(() =>
    window.__falasTransportes.at(-1).onerror?.({ error: 'synthesis-failed' })
  );
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
});

test('escutas Q03/Q07 separadas, sem transcrição e sem conferir apenas com enunciado', async ({
  page,
}) => {
  await audio(page);
  await abrir(page);
  for (const n of [3, 7]) {
    await saltar(page, n);
    await page.locator('#ingles-ouvir-pergunta').click();
    await expect(
      page.locator('[data-subitem-ingles="a"] [data-opcao-ingles]').first()
    ).toBeEnabled();
    await responder(page, n);
    await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
    expect(await page.locator('#ingles-alternativas-atividade').innerText()).not.toMatch(
      /I go by train|I go by bus|\bboat\b|\bhelicopter\b/
    );
    await page
      .locator('#ingles-alternativas-atividade')
      .getByRole('button', { name: 'Ouvir item a', exact: true })
      .click();
    await expect(page.locator('[data-subitem-ingles="a"]')).toContainText('✓ Item ouvido');
    await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
    await page
      .locator('#ingles-alternativas-atividade')
      .getByRole('button', { name: 'Ouvir item b', exact: true })
      .click();
    await expect(page.locator('#ingles-conferir-atividade')).toBeEnabled();
  }
});

test('errar, revisar, corrigir, avançar, voltar e recarregar preserva toda a tentativa sem duplicar pontos', async ({
  page,
}) => {
  await preparar(page);
  await audio(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvir(page, 1);
  await responder(page, 1, ['boat', 'bus']);
  await revisar(page);
  await expect(page.locator('#ingles-atividade-proxima')).toHaveText('Tentar novamente');
  await page.locator('#ingles-atividade-proxima').click();
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="car"]').click();
  await revisar(page);
  await page.locator('#ingles-atividade-proxima').click();
  await page.locator('#ingles-atividade-anterior').click();
  await page.reload();
  await audio(page);
  await abrir(page);
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  const state = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(state.respostasAtividades.q01).toEqual({ a: 'car', b: 'bus' });
  expect(state.tentativasAtividade).toBe(2);
  expect(Object.keys(state.revisoesPosRespostaConcluidas)).toEqual(['q01']);
  await page.locator('#ingles-editar-respostas').click();
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="boat"]').click();
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().revisoesPosRespostaConcluidas)
  ).toEqual({});
});

test('ordenação, bancos reutilizáveis e conjuntos exatos são reversíveis e persistem várias ações', async ({
  page,
}) => {
  await preparar(page);
  await audio(page);
  await abrir(page);
  await saltar(page, 16);
  await ouvir(page, 16);
  expect(
    await page
      .locator('[data-subitem-ingles="a"] [data-opcao-ingles]')
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.opcaoIngles))
  ).toEqual(['cross', 'stop', 'check']);
  await responder(page, 16);
  await page
    .locator('[data-subitem-ingles="a"] ol')
    .getByRole('button', { name: /Retirar.*Cartão C/ })
    .click();
  await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
  await page.reload();
  await audio(page);
  await abrir(page);
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().respostasAtividades.q16)
  ).toEqual({ a: ['stop', 'cross'], b: 'fig-green-person' });
  await page
    .locator('[data-subitem-ingles="a"] ol')
    .getByRole('button', { name: /Retirar.*Cartão A/ })
    .click();
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="check"]').click();
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="cross"]').click();
  await revisar(page);
  await saltar(page, 9);
  await ouvir(page, 9);
  await responder(page, 9);
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().respostasAtividades.q09)
  ).toEqual({ a: 'water', b: 'air', c: 'air' });
  await page
    .locator('[data-subitem-ingles="b"]')
    .getByRole('button', { name: 'Retirar do espaço b' })
    .click();
  await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
  await saltar(page, 22);
  await ouvir(page, 22);
  await responder(page, 22);
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="car-2-places"]').click();
  await revisar(page);
  await expect(page.locator('#ingles-atividade-proxima')).toHaveText('Tentar novamente');
  await page.locator('#ingles-atividade-proxima').click();
  await page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="car-2-places"]').click();
  await revisar(page);
});

test('campos exigem palavras inteiras e consolidação incompleta não libera a questão final', async ({
  page,
}) => {
  await preparar(page);
  await audio(page);
  await abrir(page);
  await saltar(page, 5);
  await ouvir(page, 5);
  await responder(page, 5, ['a e', 'a']);
  await revisar(page);
  await expect(page.locator('#ingles-atividade-proxima')).toHaveText('Tentar novamente');
  await page.locator('#ingles-atividade-proxima').click();
  await responder(page, 5, ['  PLANE  ', 'Car']);
  await revisar(page);
  await saltar(page, 25);
  await ouvir(page, 25);
  await responder(page, 25);
  await page.evaluate(() => {
    window.__automaticoTransportes = false;
  });
  await page.locator('#ingles-conferir-atividade').click();
  await page.locator('#ingles-ouvir-revisao').click();
  await page.locator('#ingles-parar').click();
  await expect(page.locator('#ingles-atividade-proxima')).toBeDisabled();
  await page.reload();
  await audio(page);
  await abrir(page);
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-atividade-proxima')).toBeDisabled();
  await expect(page.locator('#pronuncia-conversacao')).toBeHidden();
});

test('modo responsável isola sessões, salto não inventa progresso e limpeza é seletiva', async ({
  page,
}) => {
  await audio(page);
  await abrir(page);
  await saltar(page, 22);
  await ouvir(page, 22);
  await responder(page, 22);
  await page.locator('#ingles-ouvir-instrucao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#ingles-faixa-modo-responsavel')).toContainText('Responsável');
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await page.locator('#ingles-modo-responsavel-questao').fill('25');
  await page.locator('#ingles-modo-responsavel-ir button[type="submit"]').click();
  await page.keyboard.press('Escape');
  await ouvir(page, 25);
  await responder(page, 25);
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    0
  );
  await page.evaluate(() => localStorage.setItem('sentinela.alice.ingles', 'preservar'));
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#limpar-progresso').click();
  expect(
    await page.evaluate(
      (keys) => keys.map((key) => localStorage.getItem(key)),
      [AUX, 'sentinela.alice.ingles']
    )
  ).toEqual([null, 'preservar']);
  const main = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
  expect(main.respostasAtividades.q22).toEqual({
    a: ['bus-6-places', 'train-8-places'],
    b: 'boat',
  });
});

test('JSON corrompido, versões incompatíveis, respostas inválidas e localStorage bloqueado', async ({
  page,
}) => {
  await page.evaluate((key) => localStorage.setItem(key, '{invalido'), KEY);
  await abrir(page);
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().respostasAtividades)
  ).toEqual({});
  await page.goto('/ambiente_interativo/index.html');
  await preparar(page);
  await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    data.versao = 999;
    data.atividadeFinalizada = true;
    localStorage.setItem(key, JSON.stringify(data));
  }, KEY);
  await abrir(page);
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().itensOuvidos)).toEqual([]);
  await page.goto('/ambiente_interativo/index.html');
  await prepararConclusao(page);
  await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    data.respostasAtividades.q01.a = 'opcao-inexistente';
    data.respostasAtividades.q25.a = ['bike', 'boat', 'bike', 'car'];
    data.revisoesPosRespostaConcluidas.q02 = 'assinatura-antiga';
    data.estimulosOuvidos.push('q03:a', 'q99:a');
    localStorage.setItem(key, JSON.stringify(data));
  }, KEY);
  await abrir(page);
  const recuperado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(recuperado.respostasAtividades.q01).toEqual({ b: 'bus' });
  expect(recuperado.respostasAtividades.q25.a).toEqual(['bike', 'boat', 'car']);
  expect(recuperado.estimulosOuvidos).toEqual(['q03:a', 'q03:b', 'q07:a', 'q07:b']);
  expect(recuperado.conferenciasAtividades.q01).toBeUndefined();
  expect(recuperado.conferenciasAtividades.q25).toBeUndefined();
  expect(recuperado.revisoesPosRespostaConcluidas.q02).toBeUndefined();
  expect(recuperado.atividadeFinalizada).toBe(false);
  await expect(page.locator('#pronuncia-conversacao')).toBeHidden();
  await page.goto('/ambiente_interativo/index.html');
  await page.evaluate(() => {
    Storage.prototype.getItem = () => {
      throw new Error('bloqueado');
    };
    Storage.prototype.setItem = () => {
      throw new Error('bloqueado');
    };
  });
  await audio(page);
  await abrir(page);
  await page.locator('#ingles-ditar').click();
  await page.locator('#ingles-campo-escrita').fill('bus');
  await page.locator('#ingles-conferir-escrita').click();
  await expect(page.locator('#ingles-status-escrita')).toContainText('Muito bem');
});

test('dez modelos opcionais de pronúncia a 0,50, com imagens próprias e sem consentimento herdado', async ({
  page,
}) => {
  await prepararConclusao(page);
  await audio(page);
  await abrir(page);
  const modelos = [
    ["What's this?", "It's a bus."],
    ['Is this bus motorised?', 'Yes, it is.'],
    ['Where does a plane travel?', 'It travels through the air.'],
    ['How do you cross this river?', 'I go by boat.'],
    ['What do you wear on your head?', 'I wear a helmet.'],
  ];
  await expect(page.locator('#pronuncia-conversacao')).toBeVisible();
  for (const [i, par] of modelos.entries()) {
    for (const [alvo, texto] of [
      ['pergunta', par[0]],
      ['resposta', par[1]],
    ]) {
      await page.locator(`#pronuncia-alvo-${alvo}`).click();
      await page.locator('#pronuncia-ouvir').click();
      await expect(page.locator('#pronuncia-status')).toContainText('Modelo concluído');
      expect(
        await page.evaluate(() => ({
          text: window.__falasTransportes.at(-1).text,
          rate: window.__falasTransportes.at(-1).rate,
          lang: window.__falasTransportes.at(-1).lang,
        }))
      ).toEqual({ text: `Phrase: ${texto}`, rate: 0.5, lang: 'en-US' });
      await expect(page.locator('#pronuncia-imagem-img')).toHaveAttribute(
        'src',
        /ingles-means-of-transportation-outubro-2026/
      );
    }
    if (i < 4) await page.locator('#pronuncia-par-proximo').click();
  }
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#ingles-ouvir-instrucao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#pronuncia-consentimento')).not.toBeChecked();
  await expect(page.locator('#pronuncia-conversacao')).toBeHidden();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).atividadeFinalizada, KEY)
  ).toBe(true);
});

test('recusa simulada de microfone preserva conclusão, e voltar ao ditado remove modelos anteriores do DOM', async ({
  page,
}) => {
  await prepararConclusao(page);
  await audio(page);
  await abrir(page);
  await page.route('http://127.0.0.1:5190/**', (route) => route.abort());
  await page.evaluate(() => {
    Object.defineProperty(window.navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException('negada', 'NotAllowedError');
        },
      },
    });
  });
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await expect(page.locator('#pronuncia-status')).toContainText(/microfone|permissão/i);
  await expect(page.locator('#ingles-resumo-resultado')).toContainText('25 de 25');
  await page.locator('#ingles-voltar-vocabulario').click();
  await page.locator('#ingles-ditar').click();
  const ocultos = await page
    .locator('#tela-ingles')
    .evaluate((tela) =>
      [
        ...tela.querySelectorAll(
          '#ingles-lista-revisao, #ingles-alternativas-atividade, #pronuncia-pergunta, #pronuncia-resposta, #ingles-story-time-texto-ingles'
        ),
      ].map((node) => node.textContent)
    );
  expect(ocultos).toEqual(['', '', '', '', '']);
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
]) {
  test(`teclado, geometria, mapa fixo e axe ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await preparar(page);
    await audio(page);
    await abrir(page);
    await saltar(page, 25);
    await ouvir(page, 25);
    const bike = page.locator('[data-subitem-ingles="a"] [data-opcao-ingles="bike"]');
    await bike.focus();
    await page.keyboard.press('Space');
    await expect(bike).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space');
    await expect(bike).toHaveAttribute('aria-pressed', 'false');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
    const results = await new AxeBuilder({ page }).include('#tela-ingles').analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual(
      []
    );
    await page.screenshot({
      path: `test-results/transportes-${viewport.width}.png`,
      fullPage: true,
    });
    const svg = fs.readFileSync(
      path.join(__dirname, '../assets/ingles-means-of-transportation-outubro-2026/map.svg'),
      'utf8'
    );
    expect(svg).toContain('M218 140H72');
    await page.locator('[data-voltar-materias]').filter({ visible: true }).first().click();
    await page.locator('#materia-ingles').click();
    await expect(page.locator('#tela-ingles')).not.toHaveClass(/layout-desktop-amplo/);
  });
}

test('Q16: cartões e retirada respeitam o bloqueio até o fim do áudio', async ({ page }) => {
  await preparar(page);
  await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key));
    state.atividadeIniciada = true;
    state.questaoAtual = 15;
    localStorage.setItem(key, JSON.stringify(state));
  }, KEY);
  await audio(page, false);
  await abrir(page);
  const area = page.locator('#ingles-alternativas-atividade');
  const a = area.locator('[data-subitem-ingles="a"]');
  const retirar = a.locator('ol button');
  await expect(retirar).toHaveCount(0);
  await expect(area.locator('[data-opcao-ingles]')).toHaveCount(6);
  for (const button of await area.locator('[data-opcao-ingles], ol button').all())
    await expect(button).toBeDisabled();
  await page.locator('#ingles-ouvir-pergunta').click();
  for (const button of await area.locator('[data-opcao-ingles]').all())
    await expect(button).toBeDisabled();
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().respostasAtividades.q16)
  ).toBeUndefined();
  await page.evaluate(() => window.__falasTransportes.at(-1).onend?.());
  await expect(page.locator('#ingles-status-atividade')).toContainText('Pergunta ouvida');
  for (const button of await area.locator('[data-opcao-ingles], ol button').all())
    await expect(button).toBeEnabled();
  await a.locator('[data-opcao-ingles="cross"]').click();
  await a.locator('[data-opcao-ingles="stop"]').click();
  await expect(retirar).toHaveCount(2);
  for (const button of await retirar.all()) await expect(button).toBeEnabled();
  await retirar.first().click();
  await expect(a.locator('[data-opcao-ingles="cross"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
});

for (const modo of ['mouse', 'teclado', 'toque']) {
  test.describe(`Entrada Q16 por ${modo}`, () => {
    test.use({ hasTouch: modo === 'toque' });
    test(`Q16: retirar pelo próprio cartão, corrigir e retomar sem salto administrativo — ${modo}`, async ({
      page,
    }) => {
      if (modo === 'toque') await page.setViewportSize({ width: 390, height: 844 });
      await preparar(page);
      // Fixture isolada: posicionar o caso não responde nem confere a questão.
      await page.evaluate((key) => {
        const state = JSON.parse(localStorage.getItem(key));
        state.atividadeIniciada = true;
        state.questaoAtual = 15;
        localStorage.setItem(key, JSON.stringify(state));
      }, KEY);
      await audio(page);
      await abrir(page);
      await ouvir(page, 16);
      const area = page.locator('#ingles-alternativas-atividade');
      const a = area.locator('[data-subitem-ingles="a"]');
      const b = area.locator('[data-subitem-ingles="b"]');
      const agir = async (controle) => {
        if (modo === 'teclado') {
          await controle.focus();
          await page.keyboard.press('Space');
        } else if (modo === 'toque') {
          await controle.tap();
        } else await controle.click();
      };
      const carta = (id) => a.locator(`[data-opcao-ingles="${id}"]`);
      const sinal = (id) => b.locator(`[data-opcao-ingles="${id}"]`);
      for (const id of ['cross', 'stop', 'check']) await agir(carta(id));
      await agir(sinal('fig-green-person'));
      await agir(sinal('fig-green-person'));
      await expect(sinal('fig-green-person')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
      await agir(sinal('fig-green-circle'));
      await agir(sinal('fig-green-person'));
      await expect(sinal('fig-green-circle')).toHaveAttribute('aria-pressed', 'false');
      // Reproduz o print: os três cartões foram colocados na ordem de apresentação.
      await expect(carta('cross')).toBeEnabled();
      await agir(carta('cross'));
      await expect(carta('cross')).toHaveAttribute('aria-pressed', 'false');
      await expect(a.locator('ol li')).toHaveCount(2);
      await expect(page.locator('#ingles-conferir-atividade')).toBeDisabled();
      await page.reload();
      await audio(page);
      await abrir(page);
      expect(
        await page.evaluate(() => window.InglesRevisoes.obterEstado().respostasAtividades.q16)
      ).toEqual({ a: ['stop', 'check'], b: 'fig-green-person' });
      await expect(carta('cross')).toHaveAttribute('aria-pressed', 'false');
      await expect(carta('stop')).toHaveAttribute('aria-pressed', 'true');
      await expect(carta('check')).toHaveAttribute('aria-pressed', 'true');
      await agir(carta('cross'));
      await agir(sinal('fig-red-person'));
      await revisar(page);
      await expect(page.locator('#ingles-atividade-proxima')).toHaveText('Tentar novamente');
      await page.locator('#ingles-atividade-proxima').click();
      await agir(sinal('fig-green-person'));
      // O botão de retirada separado continua disponível, inclusive após erro.
      await agir(a.locator('ol').getByRole('button', { name: /Retirar.*Cartão C/ }));
      await agir(carta('cross'));
      await agir(carta('check'));
      await agir(carta('cross'));
      await revisar(page);
      await page.locator('#ingles-atividade-proxima').click();
      await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 17 de 25');
      await page.locator('#ingles-atividade-anterior').click();
      await page.reload();
      await audio(page);
      await abrir(page);
      const state = await page.evaluate(() => window.InglesRevisoes.obterEstado());
      expect(state.respostasAtividades.q16).toEqual({
        a: ['stop', 'check', 'cross'],
        b: 'fig-green-person',
      });
      expect(state.conferenciasAtividades.q16).toBe('correta');
      expect(state.tentativasAtividade).toBe(2);
      expect(Object.keys(state.revisoesPosRespostaConcluidas)).toEqual(['q16']);
      await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
    });
  });
}

test('file:// mantém atividade local e Alice não ganha o cartão', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/i }).first().click();
  await expect(page.locator(CARD)).toBeHidden();
  const url = pathToFileURL(path.join(__dirname, '../ambiente_interativo/index.html')).href;
  await page.goto(url);
  await abrir(page);
  await page.locator('#ingles-ditar').click();
  await expect(page.locator('#ingles-campo-escrita')).toBeVisible();
  const resources = await page
    .locator('#tela-ingles img[src]')
    .evaluateAll((nodes) => nodes.map((img) => img.src));
  expect(resources.every((src) => src.startsWith('file:'))).toBe(true);
});
