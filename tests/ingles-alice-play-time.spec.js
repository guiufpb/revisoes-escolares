const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { Buffer } = require('node:buffer');

const URL = '/ambiente_interativo/index.html';
const UNIT = 'play-time-unidade-6-outubro-2026';
const REVIEW = 'alice-ingles-' + UNIT;
const KEY = 'revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1';
const AUX = 'revisoesEscolares.mariana.ingles.playTimeUnidade6Outubro2026Compartilhada.v1';
const GATEWAY = 'http://127.0.0.1:5190/api/pronunciation';
const POSITIONS = 'BDACBADCABCDBADCDBACBDCAB'.split('').map((x) => x.charCodeAt(0) - 65);
const ANSWERS = [
  "It's a helicopter.",
  "It's a lorry.",
  "It's a teddy bear.",
  'Yes, it is.',
  "It's a spinning top.",
  "It's red.",
  'The robot is green.',
  'There are four balls.',
  'Three boys are holding balloons.',
  'Two girls are holding balloons.',
  'There are two blue balls.',
  "It's on the table.",
  "It's under the table.",
  'There are two teddy bears on the bed.',
  'The car is under the table.',
  'She is reading inside.',
  'He is flying a kite outside.',
  'She is riding a bike outside.',
  'She is playing with a doll inside.',
  "It's a doll.",
  'The flag is yellow.',
  'A basketball.',
  "It's made of metal.",
  "It's made of fabric.",
  'The kite is made of paper. The toy lorry is made of plastic.',
];
const WORDS = [
  'robot',
  'teddy bear',
  'kite',
  'doll',
  'bike',
  'car',
  'lorry',
  'train',
  'rocket',
  'helicopter',
  'boat',
  'plane',
  'video game controller',
  'ball',
  'balloon',
  'blocks',
  'marbles',
  'yo-yo',
  'spinning top',
  "What's this? It's a robot.",
  "What color is it? It's blue.",
  'How many balls are there? There are four balls.',
  "Where is the doll? It's on the table.",
  "Where is the robot? It's under the table.",
  'Where do you play? I play outside.',
];

async function mock(page, automatic = false) {
  await page.addInitScript((auto) => {
    window.__calls = [];
    window.__auto = auto;
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Local English', lang: 'en-US', localService: true },
      { name: 'Local Portuguese', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (speech) => {
      window.__calls.push(speech);
      speech.onstart?.();
      if (window.__auto) speech.onend?.();
    };
    window.__tracksStopped = 0;
    Object.defineProperty(window.navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => ({
          getTracks: () => [
            {
              stop: () => {
                window.__tracksStopped++;
              },
            },
          ],
        }),
      },
    });
    window.AudioContext = class {
      constructor() {
        this.sampleRate = 16000;
        this.destination = {};
      }
      createMediaStreamSource() {
        return {
          connect: (p) =>
            window.setTimeout(
              () =>
                p.onaudioprocess?.({
                  inputBuffer: { getChannelData: () => new Float32Array(8000).fill(0.1) },
                }),
              0
            ),
          disconnect() {},
        };
      }
      createScriptProcessor() {
        return { connect() {}, disconnect() {}, onaudioprocess: null };
      }
      createGain() {
        return { gain: { value: 1 }, connect() {}, disconnect() {} };
      }
      resume() {
        return Promise.resolve();
      }
      close() {
        return Promise.resolve();
      }
    };
  }, automatic);
}
async function fastSequences(page) {
  await page.evaluate(() => {
    const original = window.AudioRevisoes.falarSequencia;
    window.AudioRevisoes.falarSequencia = (opts) => original({ ...opts, pausaMs: 0 });
  });
}
async function open(page) {
  await page.getByRole('button', { name: /Alice/i }).click();
  await page.locator('#abrir-ingles-play-time').click();
}
async function endAudio(page) {
  await page.evaluate(() => window.__calls.at(-1).onend());
}
async function hear(page) {
  await page.locator('#ingles-ouvir-pergunta').click();
  await endAudio(page);
}
async function reviewAudio(page) {
  const start = await page.evaluate(() => window.__calls.length);
  await page.locator('#ingles-ouvir-revisao').click();
  for (let i = 0; i < 4; i++) {
    await expect.poll(() => page.evaluate(() => window.__calls.length)).toBe(start + i + 1);
    await endAudio(page);
  }
  return page.evaluate(
    (i) => window.__calls.slice(i).map((x) => ({ text: x.text, lang: x.lang })),
    start
  );
}
async function seed(page, complete = false, key = KEY) {
  await page.evaluate(
    ({ unit, key, complete }) => {
      const u = window.RegistroIngles.obter(unit),
        items = u.grupos.flatMap((g) => g.itens),
        q = u.atividades;
      localStorage.setItem(
        key,
        JSON.stringify({
          unidadeId: u.id,
          versao: u.versao,
          grupoAtual: u.grupos[0].id,
          itemAtual: items[0].id,
          itensOuvidos: items.map((x) => x.id),
          respostasEscrita: Object.fromEntries(items.map((x) => [x.id, x.ingles])),
          conferenciasEscrita: Object.fromEntries(items.map((x) => [x.id, 'correta'])),
          historiaConcluida: true,
          atividadeIniciada: complete,
          atividadeFinalizada: complete,
          questaoAtual: complete ? 24 : 0,
          perguntasOuvidasAtividades: complete ? q.map((x) => x.id) : [],
          respostasAtividades: complete
            ? Object.fromEntries(q.map((x) => [x.id, x.respostaCorreta]))
            : {},
          conferenciasAtividades: complete
            ? Object.fromEntries(q.map((x) => [x.id, 'correta']))
            : {},
          revisoesPosRespostaConcluidas: complete
            ? Object.fromEntries(q.map((x) => [x.id, x.respostaCorreta]))
            : {},
        })
      );
    },
    { unit: UNIT, key, complete }
  );
}
async function jump(page, n) {
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-questao').fill(String(n));
  await page.locator('#ingles-modo-responsavel-questao').press('Enter');
  await page.keyboard.press('Escape');
}
test.beforeEach(async ({ page }) => {
  await mock(page);
  page.playTimeErrors = [];
  page.on('pageerror', (e) => page.playTimeErrors.push(e.message));
  await page.goto(URL);
  await fastSequences(page);
});
test.afterEach(async ({ page }) => expect(page.playTimeErrors).toEqual([]));

test('audita fonte fechada, IDs/chaves, 25/6/25/10 e todos os recursos locais', async ({
  page,
}) => {
  const { unit, registry, configuration } = await page.evaluate(
    ({ unit, review }) => ({
      unit: window.RegistroIngles.obter(unit),
      registry: window.RegistroRevisoes.obter(review),
      configuration: window.ConfiguracoesIngles.alicePlayTimeUnidade6Outubro2026,
    }),
    { unit: UNIT, review: REVIEW }
  );
  const items = unit.grupos.flatMap((g) => g.itens);
  expect(items.map((x) => x.ingles)).toEqual(WORDS);
  expect(new Set(items.map((x) => x.id)).size).toBe(25);
  expect(unit.historia.cenas).toHaveLength(6);
  expect(unit.historia.questoesComConsulta).toBe(25);
  expect(unit.atividades).toHaveLength(25);
  expect(new Set(unit.atividades.map((x) => x.id)).size).toBe(25);
  expect(
    unit.atividades.map((q) => q.alternativas.findIndex((a) => a.id === q.respostaCorreta))
  ).toEqual(POSITIONS);
  expect(unit.atividades.map((q) => q.revisaoPosResposta.respostaIngles)).toEqual(ANSWERS);
  expect(unit.perfisDisponiveis).toEqual(['alice']);
  expect(unit.pronuncia.pares).toHaveLength(10);
  expect(new Set(unit.pronuncia.pares.map((x) => x.id)).size).toBe(10);
  expect(unit.modoResponsavel.sessoes.map((x) => x.chaveArmazenamento)).toEqual([KEY, AUX]);
  expect(registry).toMatchObject({ id: REVIEW, chaveArmazenamento: KEY, totalEtapas: 51 });
  expect(configuration).toMatchObject({
    perfil: 'alice',
    revisaoId: REVIEW,
    unidadeId: UNIT,
    chaveArmazenamento: KEY,
  });
  function assets(o) {
    return Object.entries(o).flatMap(([k, v]) =>
      typeof v === 'object' && v !== null
        ? assets(v)
        : k.startsWith('imagem') && typeof v === 'string' && v.endsWith('.svg')
          ? [v]
          : []
    );
  }
  for (const image of new Set(assets(unit)))
    expect(fs.existsSync(path.join(__dirname, '../assets/objetos_escolares', image)), image).toBe(
      true
    );
  expect(
    unit.atividades.every(
      (q) =>
        new Set(q.alternativas.map((a) => a.id)).size === 4 &&
        q.revisaoPosResposta.perguntaPortugues &&
        q.revisaoPosResposta.significadoPortugues
    )
  ).toBe(true);
  const scene = fs.readFileSync(
    path.join(__dirname, '../assets/objetos_escolares/play-time-children-balloons.svg'),
    'utf8'
  );
  expect((scene.match(/data-balloon=/g) || []).length).toBe(7);
  expect((scene.match(/data-child="boy" data-holding="true"/g) || []).length).toBe(3);
  expect((scene.match(/data-child="girl" data-holding="true"/g) || []).length).toBe(2);
  expect((scene.match(/data-child="boy" data-holding="false"/g) || []).length).toBe(2);
});

test('estuda os 25 cartões, valida variantes estritas, edição, interrupção e portão', async ({
  page,
}) => {
  test.setTimeout(120000);
  await open(page);
  expect(await page.evaluate(() => window.__calls.length)).toBe(0);
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  const groups = await page.evaluate((id) => window.RegistroIngles.obter(id).grupos, UNIT);
  for (const g of groups) {
    await page.locator(`[data-grupo-ingles="${g.id}"]`).click();
    for (const item of g.itens) {
      await page.locator(`[data-item-ingles="${item.id}"]`).click();
      const payload = await page.evaluate(() => ({
        text: window.__calls.at(-1).text,
        lang: window.__calls.at(-1).lang,
      }));
      expect(payload).toEqual({
        text: (item.unidadeAudio === 'frase' ? 'Phrase: ' : 'Word: ') + item.ingles,
        lang: 'en-US',
      });
      if (item.id === 'v01-robot') {
        await page.locator('#ingles-parar').click();
        await endAudio(page);
        expect(
          (await page.evaluate(() => window.InglesRevisoes.obterEstado())).itensOuvidos
        ).toEqual([]);
        await page.locator('#ingles-ouvir-normal').click();
      }
      await endAudio(page);
      const field = page.locator('#ingles-campo-escrita');
      await field.fill(item.ingles + ' extra');
      await page.locator('#ingles-conferir-escrita').click();
      await expect(page.locator('#ingles-status-escrita')).toContainText('Quase!');
      for (const variant of [item.ingles, ...item.variantesEscrita]) {
        await field.fill(variant.toUpperCase().replaceAll(' ', '  '));
        await field.press('Enter');
        await expect(page.locator('#ingles-status-escrita')).toContainText('✓');
      }
    }
  }
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('25/25 áudios · 25/25 escritas');
  await page.locator('#ingles-campo-escrita').fill('Where do you play?');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  await page.reload();
  await fastSequences(page);
  await open(page);
  await expect(page.locator('#ingles-campo-escrita')).toHaveValue('Where do you play?');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  await page.locator('#ingles-campo-escrita').fill(WORDS[24]);
  await page.locator('#ingles-conferir-escrita').click();
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 1 de 6');
});

test('percurso completo: seis cenas, erro/revisão/correção, 25 questões e Q25 interrompida', async ({
  page,
}) => {
  test.setTimeout(120000);
  await seed(page);
  await page.evaluate((key) => {
    const s = JSON.parse(localStorage.getItem(key));
    s.historiaConcluida = false;
    localStorage.setItem(key, JSON.stringify(s));
  }, KEY);
  await open(page);
  await page.locator('#ingles-iniciar-atividades').click();
  for (let i = 0; i < 6; i++) {
    await expect(page.locator('#ingles-story-time-progresso')).toHaveText(`Cena ${i + 1} de 6`);
    const start = await page.evaluate(() => window.__calls.length);
    await page.locator('#ingles-story-time-ouvir').click();
    await endAudio(page);
    await expect.poll(() => page.evaluate(() => window.__calls.length)).toBe(start + 2);
    await endAudio(page);
    expect(await page.evaluate((n) => window.__calls.slice(n).map((x) => x.lang), start)).toEqual([
      'en-US',
      'pt-BR',
    ]);
    await page.locator('#ingles-story-time-proxima').click();
  }
  const qs = await page.evaluate((id) => window.RegistroIngles.obter(id).atividades, UNIT);
  for (let i = 0; i < 25; i++) {
    if (i === 3) {
      const before = await page.evaluate(() => window.InglesRevisoes.obterEstado());
      await page.locator('#ingles-atividade-anterior').click();
      await page.locator('#ingles-atividade-proxima').click();
      const after = await page.evaluate(() => window.InglesRevisoes.obterEstado());
      expect(after.tentativasAtividade).toBe(before.tentativasAtividade);
      expect(after.conferenciasAtividades).toEqual(before.conferenciasAtividades);
    }
    await expect(page.locator('#ingles-progresso-atividade')).toHaveText(
      `Atividade ${i + 1} de 25`
    );
    const options = page.locator('[data-alternativa-atividade-ingles]');
    expect(
      await options.evaluateAll((nodes) => nodes.map((n) => n.dataset.alternativaAtividadeIngles))
    ).toEqual(qs[i].alternativas.map((a) => a.id));
    if (i < 2) {
      await expect(page.locator('#ingles-pergunta-atividade')).toHaveText('Listen and choose.');
      const dom = await page.locator('#ingles-conteudo-questao').evaluate((el) => el.outerHTML);
      expect(dom).not.toContain(qs[i].perguntaIngles);
      const exposed = await page
        .locator('#ingles-conteudo-questao')
        .evaluate((el) =>
          [
            el.innerText,
            ...Array.from(el.querySelectorAll('[title], [aria-label], img[alt]')).flatMap((n) =>
              ['title', 'aria-label', 'alt'].map((a) => n.getAttribute(a) || '')
            ),
          ].join(' ')
        );
      expect(exposed).not.toMatch(/\b(helicopter|lorry)\b/i);
    }
    await expect(page.locator('#ingles-rever-historia')).toBeVisible();
    if (i === 0) {
      await expect(options.first()).toBeDisabled();
      await hear(page);
      await options.first().click();
      await page.locator('#ingles-conferir-atividade').click();
      await expect(page.locator('#ingles-atividade-proxima')).toBeDisabled();
      await reviewAudio(page);
      await expect(page.locator('#ingles-atividade-proxima')).toHaveText('Tentar novamente');
      await page.locator('#ingles-atividade-proxima').click();
      await page.locator('#ingles-rever-historia').click();
      await page.locator('#ingles-story-time-fechar').click();
    } else await hear(page);
    await options.nth(POSITIONS[i]).click();
    await page.locator('#ingles-conferir-atividade').click();
    if (i === 21)
      await expect(page.locator('#ingles-imagem-revisao-pos-resposta-img')).toHaveAttribute(
        'src',
        /play-time-compare-review-7/
      );
    if (i === 24) {
      await page.locator('#ingles-ouvir-revisao').click();
      await endAudio(page);
      await page.locator('#ingles-parar').click();
      expect(
        (await page.evaluate(() => window.InglesRevisoes.obterEstado())).atividadeFinalizada
      ).toBe(false);
      await page.reload();
      await fastSequences(page);
      await open(page);
      await page.locator('#ingles-iniciar-atividades').click();
      await expect(page.locator('#ingles-atividade-proxima')).toBeDisabled();
    }
    const sequence = await reviewAudio(page);
    expect(sequence.map((x) => x.lang)).toEqual(['en-US', 'pt-BR', 'en-US', 'pt-BR']);
    expect(sequence.map((x) => x.text)).toEqual([
      'Phrase: ' + qs[i].perguntaIngles,
      'A frase é: ' + qs[i].revisaoPosResposta.perguntaPortugues,
      'Phrase: ' + ANSWERS[i],
      'A frase é: ' + qs[i].revisaoPosResposta.significadoPortugues,
    ]);
    await page.locator('#ingles-atividade-proxima').click();
  }
  await expect(page.getByText('Alice, você acertou 25 de 25 atividades.')).toBeVisible();
  await expect(page.locator('#pronuncia-progresso')).toHaveText('Conversa 1 de 10');
  let state = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(state.atividadeFinalizada).toBe(true);
  expect(state.tentativasAtividade).toBe(26);
  await page.locator('#ingles-refazer-atividades').click();
  state = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(state.itensOuvidos).toHaveLength(25);
  expect(state.historiaConcluida).toBe(true);
  expect(state.respostasAtividades).toEqual({});
  expect(state.atividadeFinalizada).toBe(false);
});

test('Modo Responsável: salto puro, chaves isoladas, status principal, recarga e limpeza seletiva', async ({
  page,
}) => {
  await open(page);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('mariana');
  await page.locator('#ingles-modo-responsavel-questao').fill('14');
  await page.locator('#ingles-modo-responsavel-questao').press('Enter');
  let state = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(state).toMatchObject({
    questaoAtual: 13,
    itensOuvidos: [],
    respostasEscrita: {},
    respostasAtividades: {},
    conferenciasAtividades: {},
    tentativasAtividade: 0,
    historiaConcluida: false,
    atividadeFinalizada: false,
  });
  expect(
    (await page.evaluate((id) => window.InglesRevisoes.obterEstado('alice', id), REVIEW))
      .questaoAtual
  ).toBe(0);
  await page.keyboard.press('Escape');
  const buttons = page.locator('[data-alternativa-atividade-ingles]');
  await hear(page);
  await expect(buttons.nth(0)).toHaveAccessibleName('Dois ursinhos de pelúcia sobre uma cama.');
  await buttons.nth(0).click();
  await page.locator('#ingles-conferir-atividade').click();
  await reviewAudio(page);
  await page.locator('#ingles-atividade-proxima').click();
  await page.reload();
  await fastSequences(page);
  await open(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('mariana');
  expect((await page.evaluate(() => window.InglesRevisoes.obterEstado())).questaoAtual).toBe(14);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((key) => localStorage.getItem(key), AUX)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).not.toBeNull();
  await page.getByRole('button', { name: 'Encerrar sessão responsável', exact: true }).click();
  await page.getByRole('button', { name: 'Voltar ao início', exact: true }).click();
  await page.getByRole('button', { name: /Mariana/i }).click();
  await expect(page.locator('#abrir-ingles-play-time')).toBeHidden();
});

for (const bad of [
  '{broken',
  JSON.stringify({
    itensOuvidos: ['invalid', 'v01-robot', 'v01-robot'],
    questaoAtual: 999,
    respostasEscrita: { 'v01-robot': 'rbt' },
    conferenciasEscrita: { 'v01-robot': 'correta' },
    respostasAtividades: { fake: 'correct' },
    atividadeFinalizada: true,
    historiaConcluida: true,
  }),
]) {
  test('normaliza armazenamento adverso ' + bad.slice(0, 15), async ({ page }) => {
    await page.evaluate(({ key, bad }) => localStorage.setItem(key, bad), { key: KEY, bad });
    await open(page);
    const s = await page.evaluate(() => window.InglesRevisoes.obterEstado());
    expect(s.atividadeFinalizada).toBe(false);
    expect(s.conferenciasEscrita).toEqual({});
    expect(s.respostasAtividades).toEqual({});
    await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  });
}

test('conversas: 20 modelos a 0,50, imagens, gateway simulado e consentimento por sessão', async ({
  page,
}) => {
  test.setTimeout(120000);
  await seed(page, true);
  await seed(page, true, AUX);
  await open(page);
  await page.locator('#ingles-iniciar-atividades').click();
  const pairs = await page.evaluate((id) => window.RegistroIngles.obter(id).pronuncia.pares, UNIT);
  await page.route(GATEWAY, async (route) => {
    const req = route.request();
    expect(req.method()).toBe('POST');
    expect(Buffer.from(req.headers()['x-reference-text'], 'base64').toString('utf8')).toBe(
      pairs[9].resposta
    );
    expect(req.postDataBuffer().subarray(0, 4).toString()).toBe('RIFF');
    await route.fulfill({
      json: {
        ok: true,
        assessment: {
          pronunciationScore: 80,
          accuracyScore: 80,
          fluencyScore: 80,
          completenessScore: 80,
        },
      },
    });
  });
  for (let i = 0; i < 10; i++) {
    await expect(page.locator('#pronuncia-imagem-img')).toHaveAttribute(
      'src',
      '../assets/objetos_escolares/' + pairs[i].imagem
    );
    for (const target of ['pergunta', 'resposta']) {
      await page.locator('#pronuncia-alvo-' + target).click();
      await page.locator('#pronuncia-ouvir').click();
      expect(
        await page.evaluate(() => ({
          text: window.__calls.at(-1).text,
          lang: window.__calls.at(-1).lang,
          rate: window.__calls.at(-1).rate,
        }))
      ).toEqual({ text: 'Phrase: ' + pairs[i][target], lang: 'en-US', rate: 0.5 });
      await endAudio(page);
    }
    if (i < 9) await page.locator('#pronuncia-par-proximo').click();
  }
  await expect(page.locator('#pronuncia-gravar')).toBeDisabled();
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await expect(page.locator('#pronuncia-parar')).toBeEnabled();
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-feedback')).toContainText('Muito bem!');
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).not.toMatch(
    /scores|consentimento|gravacao|audioBase64/
  );
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('mariana');
  await expect(page.locator('#pronuncia-consentimento')).not.toBeChecked();
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await page.locator('#ingles-modo-responsavel-sessao').selectOption('alice');
  await expect(page.locator('#pronuncia-consentimento')).not.toBeChecked();
  expect(await page.evaluate(() => window.__tracksStopped)).toBeGreaterThanOrEqual(2);
  await page.getByRole('button', { name: 'Voltar ao início', exact: true }).click();
  await expect(page.locator('#pronuncia-imagem-img')).not.toHaveAttribute('src', /./);
});

test('imagem da pronúncia recusa URLs/travessia e revisões antigas não recebem apoio', async ({
  page,
}) => {
  for (const imagem of [
    'https://example.com/image.svg',
    '../secret.svg',
    'data:image/png;base64,a',
    '/private.svg',
    'file.svg?query',
  ]) {
    await page.evaluate(
      (imagem) =>
        window.PronunciaRevisoes.configurar(
          {
            habilitada: true,
            id: 'test',
            pares: [
              { id: '1', pergunta: 'Question?', resposta: 'Answer.', imagem, imagemAlt: 'Teste' },
            ],
          },
          { visivel: true }
        ),
      imagem
    );
    await expect(page.locator('#pronuncia-imagem')).toBeHidden();
    await expect(page.locator('#pronuncia-imagem-img')).not.toHaveAttribute('src', /./);
  }
  await page.evaluate(() =>
    window.PronunciaRevisoes.configurar(
      window.RegistroIngles.obter('at-school-atividade-3').pronuncia,
      { visivel: true }
    )
  );
  await expect(page.locator('#pronuncia-imagem')).toBeHidden();
});

test('falha externa mantém conclusão e modelo local, sem guardar avaliação', async ({ page }) => {
  await seed(page, true);
  await open(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await page.route(GATEWAY, (route) =>
    route.fulfill({ status: 503, json: { ok: false, error: 'unavailable' } })
  );
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await expect(page.locator('#pronuncia-parar')).toBeEnabled();
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-ouvir')).toBeEnabled();
  expect((await page.evaluate(() => window.InglesRevisoes.obterEstado())).atividadeFinalizada).toBe(
    true
  );
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
]) {
  test('layout real e acessibilidade ' + viewport.width, async ({ page }) => {
    await page.setViewportSize(viewport);
    await seed(page);
    await open(page);
    await page.locator('#ingles-iniciar-atividades').click();
    await jump(page, 20);
    await expect(page.locator('#ingles-imagens-enunciado img')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    if (viewport.width > 1000)
      expect(
        (await page.locator('#ingles-imagens-enunciado img').boundingBox()).width
      ).toBeGreaterThan(950);
    const image = page.locator('#ingles-imagens-enunciado img');
    expect(await image.evaluate((img) => img.currentSrc)).toContain(
      viewport.width < 721 ? 'compare-a-b-mobile.svg' : 'compare-a-b.svg'
    );
    if (viewport.width < 721) {
      const box = await image.boundingBox();
      expect(box.width).toBeGreaterThan(260);
      expect(box.height).toBeGreaterThan(box.width);
    }
    const result = await new AxeBuilder({ page }).include('#tela-ingles').analyze();
    expect(result.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    fs.mkdirSync(path.join(__dirname, '../output/play-time'), { recursive: true });
    await page.locator('#ingles-cartao-questao').screenshot({
      path: path.join(__dirname, `../output/play-time/comparison-${viewport.width}.png`),
    });
    await jump(page, 22);
    await hear(page);
    await page.locator('[data-alternativa-atividade-ingles]').nth(3).click();
    await page.locator('#ingles-conferir-atividade').click();
    expect(
      await page
        .locator('#ingles-imagem-revisao-pos-resposta-img')
        .evaluate((img) => img.currentSrc)
    ).toContain(viewport.width < 721 ? 'compare-review-7-mobile.svg' : 'compare-review-7.svg');
    await seed(page, true);
    await page.reload();
    await fastSequences(page);
    await open(page);
    await page.locator('#ingles-iniciar-atividades').click();
    const panels = await page.locator('.falas-pronuncia section').evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.x, y: r.y, height: r.height };
      })
    );
    await expect(page.locator('#pronuncia-descricao')).toContainText('dez conversas');
    await expect(page.locator('#pronuncia-conversacao')).not.toContainText('Activity 3');
    if (viewport.width < 721) expect(panels[1].y).toBeGreaterThan(panels[0].y + panels[0].height);
    else {
      expect(panels[1].x).toBeGreaterThan(panels[0].x);
      expect(panels[1].y).toBe(panels[0].y);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const speechA11y = await new AxeBuilder({ page }).include('#pronuncia-conversacao').analyze();
    expect(speechA11y.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual(
      []
    );
    await page.locator('#pronuncia-conversacao').screenshot({
      path: path.join(__dirname, `../output/play-time/pronunciation-${viewport.width}.png`),
    });
    await page.getByRole('button', { name: 'Voltar ao início', exact: true }).click();
    await page.getByRole('button', { name: /Alice/i }).click();
    await page.locator('#materia-ingles').click();
    await expect(page.locator('#tela-ingles')).not.toHaveClass(/layout-desktop-amplo/);
  });
}

test('file:// carrega bundle e assets sem internet, principal funciona e microfone é opcional', async ({
  page,
}) => {
  await page.goto(pathToFileURL(path.join(__dirname, '../ambiente_interativo/index.html')).href);
  await fastSequences(page);
  await open(page);
  await expect(page.locator('[data-item-ingles]')).toHaveCount(19);
  await page.locator('[data-item-ingles="v01-robot"]').click();
  await endAudio(page);
  await page.locator('#ingles-campo-escrita').fill('robot');
  await page.locator('#ingles-conferir-escrita').click();
  await expect(page.locator('[data-item-ingles="v01-robot"]')).toContainText('✓ Ouvido');
  expect(
    await page
      .locator('#ingles-imagem-cabecalho')
      .evaluate((img) => img.complete && img.naturalWidth > 0)
  ).toBe(true);
});

test('auditoria SVG: exatamente sete diferenças, base comum, destaques e render ampliado', async ({
  page,
}) => {
  const dir = path.join(__dirname, '../assets/objetos_escolares');
  const files = [
    'compare-a-b',
    'compare-a-b-flag-focus',
    'compare-a-b-ball-focus',
    'compare-review-7',
    'compare-a-b-mobile',
    'compare-a-b-flag-focus-mobile',
    'compare-a-b-ball-focus-mobile',
    'compare-review-7-mobile',
  ];
  const sources = files.map((name) =>
    fs.readFileSync(path.join(dir, 'play-time-' + name + '.svg'), 'utf8')
  );
  const audit = await page.evaluate((sources) => {
    const docs = sources.map((s) => new window.DOMParser().parseFromString(s, 'image/svg+xml'));
    const a = docs[0].querySelector('[data-scene="a"]'),
      b = docs[0].querySelector('[data-scene="b"]');
    const differences = Array.from(a.querySelectorAll('[data-difference]')).map(
      (g, i) => g.outerHTML !== b.querySelectorAll('[data-difference]')[i].outerHTML
    );
    const blocks = [a, b].map(
      (s) => s.querySelector('[data-difference="6"]').querySelectorAll('rect').length
    );
    const sameScenes = docs.every((doc) =>
      ['a', 'b'].every(
        (id) =>
          doc.querySelector('[data-scene="' + id + '"]').innerHTML ===
          docs[0].querySelector('[data-scene="' + id + '"]').innerHTML
      )
    );
    [a, b].forEach((s) => s.querySelectorAll('[data-difference]').forEach((g) => g.remove()));
    return {
      differences,
      blocks,
      sameScenes,
      baseEqual: a.innerHTML === b.innerHTML,
      valid: docs.every((d) => !d.querySelector('parsererror')),
    };
  }, sources);
  expect(audit).toEqual({
    differences: Array(7).fill(true),
    blocks: [4, 4],
    sameScenes: true,
    baseEqual: true,
    valid: true,
  });
  fs.mkdirSync(path.join(__dirname, '../output/play-time/assets'), { recursive: true });
  const critical = [
    'children-balloons',
    'four-balls',
    'doll-on-table',
    'robot-under-table',
    'two-bears-on-bed',
    'two-bears-under-bed',
    'four-bears-on-bed',
    'two-bears-on-table',
    'learn-positions',
    'learn-colors-numbers',
    'learn-places',
    'read-inside',
    'fly-kite-outside',
    'ride-bike-outside',
    'play-doll-inside',
    'metal-bike',
    'fabric-doll',
    'paper-kite-plastic-lorry',
    'compare-review-7',
  ];
  await page.setViewportSize({ width: 1500, height: 1000 });
  for (const name of critical) {
    await page.goto('/assets/objetos_escolares/play-time-' + name + '.svg');
    expect(await page.locator('svg').count()).toBe(1);
    await page
      .locator('svg')
      .screenshot({ path: path.join(__dirname, '../output/play-time/assets', name + '.png') });
  }
  const toys = [
    'robot',
    'teddy-bear',
    'kite',
    'doll',
    'bike',
    'car',
    'lorry',
    'train',
    'rocket',
    'helicopter',
    'boat',
    'plane',
    'controller',
    'ball',
    'balloon',
    'blocks',
    'marbles',
    'yo-yo',
    'spinning-top',
  ];
  await page.goto(URL);
  await page.setContent(
    '<main style="display:grid;grid-template-columns:repeat(5,1fr);gap:20px;background:white">' +
      toys
        .map(
          (n) =>
            '<figure style="margin:0"><img width="240" height="200" src="/assets/objetos_escolares/play-time-' +
            n +
            '.svg"><figcaption>' +
            n +
            '</figcaption></figure>'
        )
        .join('') +
      '</main>'
  );
  await page.locator('img').evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
  await page
    .locator('main')
    .screenshot({ path: path.join(__dirname, '../output/play-time/assets/toys-gallery.png') });
});

test('armazenamento bloqueado conserva interação no fallback em memória', async ({ browser }) => {
  const context = await browser.newContext();
  const p = await context.newPage();
  await mock(p);
  await p.addInitScript(() => {
    window.Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    window.Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
    window.Storage.prototype.removeItem = () => {
      throw new Error('blocked');
    };
  });
  await p.goto(URL);
  await open(p);
  await p.locator('[data-item-ingles="v01-robot"]').click();
  await endAudio(p);
  await p.locator('#ingles-campo-escrita').fill('robot');
  await p.locator('#ingles-conferir-escrita').click();
  await expect(p.locator('#ingles-progresso-texto')).toHaveText('1/25 áudios · 1/25 escritas');
  await context.close();
});

test('toque no celular seleciona e confere figura acessível', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const p = await context.newPage();
  await mock(p);
  await p.goto(URL);
  await fastSequences(p);
  await open(p);
  await jump(p, 14);
  await hear(p);
  await p
    .getByRole('button', { name: 'Dois ursinhos de pelúcia sobre uma cama.', exact: true })
    .tap();
  await p.locator('#ingles-conferir-atividade').tap();
  await reviewAudio(p);
  await expect(p.locator('#ingles-atividade-proxima')).toBeEnabled();
  expect(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await context.close();
});
