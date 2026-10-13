const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'mariana-ciencias-sol-sombras-materiais-outubro-2026';
const CHAVE = 'revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.v1';
const AUX = 'revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.responsavel.v1';
const CARTAO = '#abrir-ciencias-sol-sombras-materiais';
const VIZINHAS = [
  'revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1',
  'revisoesEscolares.alice.ciencias.origemMateriais',
  'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1',
];
// Transcrição independente da matriz editorial. Letras são posições fixas;
// arrays de números são cartões na ordem inicial; strings longas são conjuntos.
const GABARITO = [
  ['B', 'C'],
  ['A'],
  ['ACE'],
  ['C', 'B'],
  ['A', 'C', 'B'],
  [[2, 3, 1]],
  ['BD', 'C'],
  ['A', 'B'],
  ['C', 'A', 'B'],
  ['translúcido', 'transparente', 'opaco'],
  ['B', 'C'],
  [[3, 1, 2]],
  ['A', 'B'],
  ['C', 'A', 'B'],
  [[1, 3, 2]],
  ['B', 'C'],
  ['BCE', 'A'],
  ['ABDF'],
  ['C', 'B'],
  ['escura', 'mais'],
  ['A', 'C'],
  ['B', 'A', 'C'],
  ['C', 'B', 'A', 'C'],
  ['B', 'C', 'A'],
  ['B', 'A'],
  ['ADE', 'C'],
  ['B', 'A', 'C'],
  ['A', 'B'],
  ['BCDF'],
  ['ADE', 'A', [2, 1, 3], 'C'],
];
const CARTOES = {
  6: [
    'Final da tarde: Sol baixo à direita e sombra comprida para a esquerda.',
    'Início da manhã: Sol baixo à esquerda e sombra comprida para a direita.',
    'Perto do meio do dia: Sol mais alto e sombra mais curta.',
  ],
  12: ['Figura opaca.', 'Tela que deixa passar luz espalhada.', 'Lanterna acesa.'],
  15: [
    'Há apenas os cubos de gelo, antes de começarem a derreter.',
    'Não há mais gelo; ficou água líquida no prato.',
    'Há pedaços menores de gelo e água líquida.',
  ],
  30: [
    'A poça está menor.',
    'A poça ocupa uma área maior do piso.',
    'O piso está seco; a água líquida passou para o ar como vapor.',
  ],
};
const article = (page) => page.locator('#tela-gramatica-mariana .etapa-mariana');
const group = (page, n, i = 0) =>
  [3, 18, 29].includes(n)
    ? article(page).locator('[data-interacao-questionario]')
    : article(page).locator('[data-item-gramatica]').nth(i);
async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARTAO).click();
  await expect(article(page)).toBeVisible();
}
async function preparar(page, n) {
  await page.evaluate(
    ({ chave, n }) =>
      localStorage.setItem(chave, JSON.stringify({ versao: 1, questaoAtual: n - 1 })),
    { chave: CHAVE, n }
  );
  await page.reload();
  await abrir(page);
}
async function estado(page, chave = CHAVE) {
  return page.evaluate((c) => JSON.parse(localStorage.getItem(c)), chave);
}
async function escolher(page, n, i, letra) {
  const g = group(page, n, i);
  if (n === 2)
    await g
      .getByRole('button', {
        name: ['Vaso de barro', 'Sol', 'Piso'][letra.charCodeAt(0) - 65],
        exact: true,
      })
      .click();
  else await g.getByRole('button', { name: new RegExp('^' + letra + '\\.') }).click();
}
async function preencher(page, n) {
  for (const [i, value] of GABARITO[n - 1].entries()) {
    if ([10, 20].includes(n))
      await article(page).locator('[data-resposta-gramatica]').nth(i).fill(value);
    else if (Array.isArray(value)) {
      for (const k of value)
        await group(page, n, i)
          .getByRole('button', { name: CARTOES[n][k - 1], exact: true })
          .click();
    } else for (const letter of value) await escolher(page, n, i, letter);
  }
}
async function conferir(page) {
  await article(page).getByRole('button', { name: 'Conferir', exact: true }).click();
}
async function responder(page, n) {
  await preencher(page, n);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima'), `Q${n}`).toBeEnabled();
}
async function audio(page, semVoz = false) {
  await page.addInitScript((semVoz) => {
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      semVoz
        ? []
        : [
            { name: 'Remota', lang: 'pt-BR', localService: false },
            { name: 'Maria', lang: 'pt-BR', localService: true },
          ];
    window.speechSynthesis.cancel = () => window.__cancelamentos++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falas.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        pitch: fala.pitch,
        local: fala.voice.localService,
      });
      fala.onstart?.();
      fala.onend?.();
    };
  }, semVoz);
}
test.beforeEach(async ({ page }) => {
  page.erros = [];
  page.on('pageerror', (e) => page.erros.push(e.message));
  page.on('console', (e) => {
    if (e.type() === 'error') page.erros.push(e.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => expect(page.erros).toEqual([]));

for (const entrada of ['mouse', 'teclado', 'toque']) {
  test.describe(`Diagnóstico Ciências Q16 por ${entrada}`, () => {
    test.use(
      entrada === 'toque'
        ? { hasTouch: true, viewport: { width: 390, height: 844 } }
        : { hasTouch: false }
    );
    test('Q16: desmarcar nas duas partes, corrigir e restaurar sem salto administrativo', async ({
      page,
    }) => {
      const id = 'sol-sombras-materiais-q16';
      await preparar(page, 16);
      await expect(article(page)).toContainText('Q16 — Duas mudanças da água');
      const opcao = (i, letra) =>
        group(page, 16, i).getByRole('button', { name: new RegExp('^' + letra + '\\.') });
      const acionar = async (alvo) => {
        await expect(alvo).toBeEnabled();
        if (entrada === 'toque') await alvo.tap();
        else if (entrada === 'teclado') {
          await alvo.focus();
          await page.keyboard.press('Space');
        } else await alvo.click();
      };
      const conferirEntrada = () =>
        acionar(article(page).getByRole('button', { name: 'Conferir', exact: true }));
      const conferirSelecao = async (letras) => {
        for (const [i, letra] of letras.entries()) {
          for (const candidata of ['A', 'B', 'C']) {
            await expect(opcao(i, candidata)).toHaveAttribute(
              'aria-pressed',
              String(candidata === letra)
            );
          }
        }
      };
      await acionar(opcao(0, 'A'));
      await acionar(opcao(1, 'A'));
      await conferirSelecao(['A', 'A']);
      await conferirEntrada();
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      expect((await estado(page)).tentativas[id]).toBe(1);
      await acionar(opcao(0, 'A'));
      await conferirSelecao(['', 'A']);
      await page.reload();
      await abrir(page);
      await conferirSelecao(['', 'A']);
      expect((await estado(page)).respostas[id]).toEqual(['', 'A. Escorreu para fora do prato.']);
      await conferirEntrada();
      expect((await estado(page)).tentativas[id]).toBe(1);
      await acionar(opcao(1, 'A'));
      await conferirSelecao(['', '']);
      await acionar(opcao(0, 'C'));
      await acionar(opcao(0, 'B'));
      await acionar(opcao(1, 'C'));
      await conferirSelecao(['B', 'C']);
      await conferirEntrada();
      expect(await estado(page)).toMatchObject({ pontos: 1, tentativas: { [id]: 2 } });
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await acionar(page.locator('#gramatica-proxima'));
      await expect(article(page)).toContainText('Q17 — Dois panos no varal');
      await acionar(page.locator('#gramatica-voltar'));
      await conferirSelecao(['B', 'C']);
      await page.reload();
      await abrir(page);
      await conferirSelecao(['B', 'C']);
      expect(await estado(page)).toMatchObject({ pontos: 1, tentativas: { [id]: 2 } });
      await acionar(opcao(1, 'C'));
      await conferirSelecao(['B', '']);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await acionar(opcao(1, 'C'));
      await conferirEntrada();
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      expect(await estado(page)).toMatchObject({ pontos: 1, tentativas: { [id]: 3 } });
    });
  });
}

test('integração exclusiva, unidades e distribuição editorial estável', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  const { r, registro } = await page.evaluate(
    (id) => ({
      r: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(registro).toMatchObject({ aluno: 'mariana', totalEtapas: 30, chaveArmazenamento: CHAVE });
  expect(r.questoes).toHaveLength(30);
  expect(r.questoes.reduce((s, q) => s + q.itens.length, 0)).toBe(64);
  expect(r.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([CHAVE, AUX]);
  const counts = { escolhas: 0, mapa: 0, selecoes: 0, ordens: 0, campos: 0 };
  const positions = [];
  for (const [i, q] of r.questoes.entries()) {
    expect(q.titulo).toMatch(new RegExp('^Q' + String(i + 1).padStart(2, '0') + ' —'));
    expect(q.leitura).toBeTruthy();
    expect(q.dica).toBeTruthy();
    expect(q.sucesso).toBeTruthy();
    for (const it of q.itens) {
      if (q.tipo === 'campos') counts.campos++;
      else if (it.tipo === 'selecao') counts.selecoes++;
      else if (it.tipo === 'ordenacao') counts.ordens++;
      else {
        counts[q.mapaVisual ? 'mapa' : 'escolhas']++;
        positions.push(it.opcoes.indexOf(it.respostas[0]));
      }
    }
  }
  expect(counts).toEqual({ escolhas: 47, mapa: 1, selecoes: 7, ordens: 4, campos: 5 });
  expect(positions.map((p) => positions.filter((x) => x === p).length).slice(0, 2)).toEqual([
    16, 17,
  ]);
  expect([0, 1, 2].map((p) => positions.filter((x) => x === p).length)).toEqual([15, 16, 17]);
  expect(auditarPosicoesGabarito(positions)).toEqual([]);
});

test('percurso inteiro com gabarito independente: 30 questões e 30 pontos, recarga e reabertura', async ({
  page,
}) => {
  test.setTimeout(180_000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${n} de 30`);
    await responder(page, n);
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(article(page)).toContainText('Você observou, comparou, organizou');
  expect(await estado(page)).toMatchObject({ pontos: 30, finalizada: true });
  await page.reload();
  await abrir(page);
  expect(await estado(page)).toMatchObject({ pontos: 30, finalizada: true });
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('erro, correção, mapa por teclado, avançar, voltar e recarregar sem pontuar duas vezes', async ({
  page,
}) => {
  await abrir(page);
  await escolher(page, 1, 0, 'A');
  await escolher(page, 1, 1, 'A');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(article(page).locator('.opcao-mariana.incorreta')).toHaveCount(2);
  await expect(article(page).locator('[aria-live]')).toContainText('Itens para rever');
  await responder(page, 1);
  await page.locator('#gramatica-proxima').click();
  await group(page, 2).getByRole('button', { name: 'Sol', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await group(page, 2).getByRole('button', { name: 'Vaso de barro', exact: true }).focus();
  await page.keyboard.press('Space');
  await conferir(page);
  await page.locator('#gramatica-voltar').click();
  await conferir(page);
  await page.reload();
  await abrir(page);
  await expect(group(page, 1, 0).getByRole('button', { name: /^B\./ })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(group(page, 1, 1).getByRole('button', { name: /^C\./ })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 30');
});

test('seleções incompletas e com distrator são corrigíveis e restauram conjuntos e desmarcações', async ({
  page,
}) => {
  await preparar(page, 7);
  await escolher(page, 7, 0, 'A');
  await escolher(page, 7, 0, 'B');
  await escolher(page, 7, 1, 'C');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await escolher(page, 7, 0, 'A');
  await escolher(page, 7, 0, 'D');
  await conferir(page);
  await page.reload();
  await abrir(page);
  for (const letter of 'ABCD')
    await expect(
      group(page, 7, 0).getByRole('button', { name: new RegExp('^' + letter + '\\.') })
    ).toHaveAttribute('aria-pressed', 'BD'.includes(letter) ? 'true' : 'false');
  await expect(group(page, 7, 1).getByRole('button', { name: /^C\./ })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await escolher(page, 7, 0, 'D');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await escolher(page, 7, 0, 'D');
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('ordem irregular, retirar e reposicionar por teclado; restauração em cada grupo do misto', async ({
  page,
}) => {
  for (const n of [6, 12, 15, 30]) {
    await preparar(page, n);
    const i = n === 30 ? 2 : 0;
    const g = group(page, n, i);
    const cards = g.locator('[data-colocar-ordem-misto]');
    await expect(cards).toHaveText(CARTOES[n]);
    await cards.first().focus();
    await page.keyboard.press('Enter');
    await g.locator('[data-retirar-ordem-misto]').focus();
    await page.keyboard.press('Space');
    await expect(g.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
    await responder(page, n);
    await page.reload();
    await abrir(page);
    const order = GABARITO[n - 1][i].map((k) => CARTOES[n][k - 1]);
    await expect(group(page, n, i).locator('[data-retirar-ordem-misto]')).toHaveText(
      order.map((s) => s + ' · Retirar')
    );
    if (n === 30) {
      for (const letter of 'ABCDE')
        await expect(
          group(page, 30, 0).getByRole('button', { name: new RegExp('^' + letter + '\\.') })
        ).toHaveAttribute('aria-pressed', 'ADE'.includes(letter) ? 'true' : 'false');
      await expect(group(page, 30, 1).getByRole('button', { name: /^A\./ })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      await expect(group(page, 30, 3).getByRole('button', { name: /^C\./ })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
  }
});

test('campos científicos toleram caixa, acento e pontuação; variantes completas e banco sem ditado', async ({
  page,
}) => {
  await preparar(page, 10);
  const inputs = article(page).locator('[data-resposta-gramatica]');
  for (const [i, value] of ['metal', 'janela', 'chave'].entries()) await inputs.nth(i).fill(value);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  for (const row of [
    ['  TRANSLUCIDO!  ', 'TRANSPARENTE.', 'OPACO;'],
    ['translúcida', 'material transparente', 'opaca'],
    ['material translúcido', 'é transparente', 'material opaco'],
    ['placa translúcida', 'transparente', 'tampa opaca'],
    ['é translúcido', 'transparente', 'é opaco'],
    ['é translúcida', 'transparente', 'é opaca'],
  ]) {
    for (const [i, value] of row.entries()) await inputs.nth(i).fill(value);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  }
  await page.reload();
  await abrir(page);
  await expect(inputs.nth(0)).toHaveValue('é translúcida');
  await preparar(page, 20);
  await expect(article(page)).toContainText('menos · clara · mais · escura');
  await expect(article(page).locator('[data-ouvir-ditado-gramatica]')).toHaveCount(0);
  for (const value of ['escura', 'escuro', 'a escura', 'camiseta escura', 'a camiseta escura']) {
    await inputs.nth(0).fill(value.toUpperCase() + '!');
    await inputs.nth(1).fill('MAIS.');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
  await inputs.nth(1).fill('menos');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('ditado local opcional: três palavras protegidas, sem alvo no DOM, repetir, parar e cancelamentos', async ({
  page,
}) => {
  await audio(page);
  await preparar(page, 10);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  expect(await article(page).innerHTML()).not.toMatch(/transl[uú]cid|transparente|opac[oa]/i);
  expect(await article(page).ariaSnapshot()).not.toMatch(/transl[uú]cid|transparente|opac[oa]/i);
  for (const [i, value] of GABARITO[9].entries()) {
    await article(page).locator('[data-ouvir-ditado-gramatica]').nth(i).focus();
    await page.keyboard.press('Enter');
    const last = await page.evaluate(() => window.__falas.at(-1));
    expect(last).toEqual({
      texto: 'A palavra é: ' + value,
      idioma: 'pt-BR',
      velocidade: 0.78,
      pitch: 1,
      local: true,
    });
    await expect(article(page).locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
    await article(page).locator('[data-repetir-ditado-gramatica]').click();
    expect(await page.evaluate(() => window.__falas.at(-1))).toEqual(last);
    const before = await page.evaluate(() => window.__cancelamentos);
    await article(page)
      .locator('[data-resposta-gramatica]')
      .nth((i + 1) % 3)
      .focus();
    expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(before);
    await expect(article(page).locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
  }
  await article(page).locator('[data-parar-ditado-gramatica]').click();
  await expect(article(page).locator('.status-ditado-gramatica')).toContainText('interrompido');
  let before = await page.evaluate(() => window.__cancelamentos);
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+r');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(before);
  before = await page.evaluate(() => window.__cancelamentos);
  await page.locator('#botao-inicio').click();
  expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(before);
});

test('sem voz local a atividade continua editável, persistente e pontuável', async ({ page }) => {
  await audio(page, true);
  await preparar(page, 10);
  await article(page).locator('[data-resposta-gramatica]').first().fill('Minha tentativa');
  await article(page).locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect(article(page).locator('.status-ditado-gramatica')).toContainText(/voz|vozes/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await page.reload();
  await abrir(page);
  await expect(article(page).locator('[data-resposta-gramatica]').first()).toHaveValue(
    'Minha tentativa'
  );
  await responder(page, 10);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('Modo Responsável: salto puro, principal no cartão, Escape, foco, sessões restauradas e limpeza recíproca', async ({
  page,
}) => {
  await page.evaluate(
    (keys) => keys.forEach((k) => localStorage.setItem(k, JSON.stringify({ preservar: true }))),
    VIZINHAS
  );
  await abrir(page);
  await responder(page, 1);
  const principal = await estado(page);
  await page.keyboard.press('Control+Alt+r');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  expect(await estado(page, AUX)).toMatchObject({
    questaoAtual: 29,
    pontos: 0,
    respostas: {},
    pontuadas: {},
    corrigidas: {},
    tentativas: {},
  });
  expect(await estado(page)).toEqual(principal);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await responder(page, 30);
  expect(
    await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID)
  ).toMatchObject({ pontos: 1, questaoAtual: 0 });
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toHaveAttribute('data-estado-revisao', 'em-andamento');
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.keyboard.press('Control+Alt+r');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 30 de 30');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.keyboard.press('Control+Alt+r');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  const auxiliary = await estado(page, AUX);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page, AUX)).toBeNull();
  expect(await estado(page)).toEqual(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.evaluate(({ c, e }) => localStorage.setItem(c, JSON.stringify(e)), {
    c: AUX,
    e: auxiliary,
  });
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page)).toBeNull();
  expect(await estado(page, AUX)).toEqual(auxiliary);
  expect(
    await page.evaluate((keys) => keys.map((k) => JSON.parse(localStorage.getItem(k))), VIZINHAS)
  ).toEqual(VIZINHAS.map(() => ({ preservar: true })));
});

test('JSON inválido e estado incompatível não fabricam pontuação; storage bloqueado usa memória', async ({
  page,
  browser,
}) => {
  for (const value of [
    '{invalido',
    JSON.stringify({
      versao: 90,
      questaoAtual: -50,
      pontos: 999,
      corrigidas: { fantasma: true },
      respostas: { 'sol-sombras-materiais-q07': [['fantasma', 'fantasma']] },
    }),
  ]) {
    await page.evaluate(({ c, v }) => localStorage.setItem(c, v), { c: CHAVE, v: value });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  }
  const context = await browser.newContext();
  await context.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[method] = () => {
        throw new Error('bloqueado');
      };
  });
  const blocked = await context.newPage();
  await blocked.goto(URL);
  await abrir(blocked);
  await responder(blocked, 1);
  await blocked.locator('#botao-inicio').click();
  await abrir(blocked);
  await expect(blocked.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await context.close();
});

for (const width of [390, 1366, 1920])
  test(`layout, figuras, alvos, teclado e acessibilidade em ${width}`, async ({ page }) => {
    await page.setViewportSize({
      width,
      height: width === 390 ? 844 : width === 1920 ? 1080 : 768,
    });
    for (const n of [2, 5, 10, 16, 22, 30]) {
      await preparar(page, n);
      await article(page)
        .locator('img')
        .evaluateAll((imgs) => Promise.all(imgs.map((img) => img.decode())));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
      await page.locator('#tela-gramatica-mariana').evaluate(async (tela) => {
        await Promise.all(tela.getAnimations().map((animacao) => animacao.finished));
      });
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
      if (n === 2) {
        const map = article(page).locator('.mapa-visual-questionario');
        const bounds = await map.boundingBox();
        for (const [name, x, y] of [
          ['Vaso de barro', 0.55, 0.58],
          ['Sol', 0.217, 0.281],
          ['Piso', 0.84, 0.84],
        ]) {
          const box = await map.getByRole('button', { name, exact: true }).boundingBox();
          expect(Math.abs((box.x + box.width / 2 - bounds.x) / bounds.width - x)).toBeLessThan(
            0.025
          );
          expect(Math.abs((box.y + box.height / 2 - bounds.y) / bounds.height - y)).toBeLessThan(
            0.025
          );
        }
      }
    }
    await preparar(page, 10);
    await article(page).locator('[data-resposta-gramatica]').first().focus();
    await page.keyboard.press('Control+Alt+r');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+r');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.keyboard.press('Escape');
    await page.locator('#botao-inicio').click();
    await page.getByRole('button', { name: /Mariana/ }).click();
    await page.locator('#abrir-gramatica-mariana').click();
    await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
    await page.keyboard.press('Control+Alt+r');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  });

test('toque no mapa, seleção e ordenação usam controles reversíveis', async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(URL);
  await preparar(page, 2);
  await group(page, 2).getByRole('button', { name: 'Piso', exact: true }).tap();
  await conferir(page);
  await group(page, 2).getByRole('button', { name: 'Vaso de barro', exact: true }).tap();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(page, 3);
  await group(page, 3).getByRole('button', { name: /^B\./ }).tap();
  await group(page, 3).getByRole('button', { name: /^B\./ }).tap();
  await expect(group(page, 3).getByRole('button', { name: /^B\./ })).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await preparar(page, 6);
  await group(page, 6).locator('[data-colocar-ordem-misto]').first().tap();
  await group(page, 6).locator('[data-retirar-ordem-misto]').tap();
  await expect(group(page, 6).locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  await context.close();
});

test('bundle file:// funciona sem rede e mantém as revisões anteriores', async ({ browser }) => {
  const context = await browser.newContext();
  const external = [];
  await context.route(/^https?:\/\//, (route) => {
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(__dirname, '../ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-ciencias-plantas-sol').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  expect(external).toEqual([]);
  await context.close();
});
