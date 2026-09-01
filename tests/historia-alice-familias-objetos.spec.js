const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'alice-historia-familias-objetos-agosto-2026';
const CHAVE = 'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1';
const URL = '/ambiente_interativo/index.html';
const OUTRAS = [
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.ciencias.origemMateriais',
];
const DOMINGO = [
  'Arrumar a mesa e preparar frutas e suco',
  'Os avós chegarem',
  'Todos conversarem',
  'Passear juntos no parque',
];
const FRASE_14 = 'Na família, cuidamos uns dos outros.';
const FRASES_20 = [
  'Cada família tem seu jeito de ser.',
  'Toda criança tem direito à proteção.',
  'Objetos antigos ajudam a conhecer o passado.',
];
const MULTIPLAS = {
  2: [
    'Criança vivendo com um responsável que cuida dela',
    'Avós e netos cuidando uns dos outros',
    'Mãe e filhos',
    'Pai e filhos',
    'Familiares que convivem e se cuidam',
  ],
  11: [
    'Mulheres passaram a ocupar novos espaços, inclusive no mercado de trabalho',
    'Muitas mulheres passaram a estudar por mais tempo',
    'A quantidade de crianças por família diminuiu de modo geral',
  ],
  12: ['Proteção', 'Amor', 'Compreensão', 'Cuidados especiais'],
  13: ['Familiares ou responsáveis', 'Sociedade', 'Autoridades públicas'],
};
const OPCOES = {
  3: ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'],
  5: [
    '5',
    'Dificuldade para pagar aluguel e contas.',
    'Continuaram trabalhando e juntando dinheiro.',
  ],
  6: ['Exemplo A — por volta de 1930'],
  7: ['Verdadeiro', 'Falso', 'Verdadeiro', 'Verdadeiro'],
  8: ['Oral', '14', 'Porque memórias podem contar como era a vida em outros tempos.'],
  9: ['Atualmente', 'Há cerca de cem anos', 'Atualmente', 'Há cerca de cem anos'],
  10: ['Muitas mulheres passaram a dedicar mais tempo ao estudo e ao trabalho.'],
  16: [
    'Tempo de bebê',
    'Tempo de bebê',
    'Tempo de bebê',
    'Tempo de criança',
    'Tempo de criança',
    'Tempo de criança',
  ],
  17: [
    'Bonecas de barro',
    'Cestos de fibra de arumã',
    'Colar de bambu e sementes',
    'Para conhecer e respeitar culturas e histórias.',
  ],
  18: ['Antigo', 'Atual', 'Antigo', 'Atual', 'Antigo', 'Atual'],
};

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-historia-familias-objetos').click();
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

async function conferir(page) {
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
}

async function escolherNoItem(page, indice, resposta) {
  await page
    .locator('[data-item-gramatica]')
    .nth(indice)
    .getByRole('button', { name: resposta, exact: true })
    .click();
}

async function responderMista(page, numero) {
  if (numero === 1) {
    await escolherNoItem(page, 0, 'Não');
    await escolherNoItem(page, 1, 'As famílias podem ser diferentes umas das outras.');
    for (const resposta of ['Cuidado', 'Respeito', 'Carinho'])
      await escolherNoItem(page, 2, resposta);
  } else if (numero === 4) {
    for (const resposta of DOMINGO)
      await page.getByRole('button', { name: resposta, exact: true }).click();
    await escolherNoItem(page, 1, 'Rotinas e momentos de convivência diferentes.');
  } else if (numero === 15) {
    await escolherNoItem(page, 0, 'Conhecer lembranças e histórias da família.');
    for (const resposta of ['Objeto antigo', 'Fotografia antiga'])
      await escolherNoItem(page, 1, resposta);
  } else if (numero === 19) {
    await escolherNoItem(page, 0, 'Conhecer o cotidiano das pessoas no passado.');
    for (const resposta of [
      'Máquina de escrever',
      'Máquina de costura antiga',
      'Brinquedos antigos',
      'Fotografias antigas',
    ])
      await escolherNoItem(page, 1, resposta);
    await escolherNoItem(page, 2, 'Porque ajudam a conhecer outros tempos.');
  }
}

async function responder(page, numero) {
  if ([1, 4, 15, 19].includes(numero)) {
    await responderMista(page, numero);
  } else if (MULTIPLAS[numero]) {
    for (const resposta of MULTIPLAS[numero])
      await page.getByRole('button', { name: resposta, exact: true }).click();
  } else if (OPCOES[numero]) {
    for (const [indice, resposta] of OPCOES[numero].entries())
      await escolherNoItem(page, indice, resposta);
  } else {
    const frases = numero === 14 ? [FRASE_14] : FRASES_20;
    for (const [indice, frase] of frases.entries())
      await page.locator('[data-resposta-gramatica]').nth(indice).fill(frase);
  }
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

async function auditar(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    axe.violations.filter((violacao) => ['serious', 'critical'].includes(violacao.impact))
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
}

async function simularAudio(page) {
  await page.addInitScript(() => {
    window.__falasAliceHistoria = [];
    window.__cancelamentosAliceHistoria = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz online', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
      { name: 'Microsoft David', lang: 'en-US', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosAliceHistoria++;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasAliceHistoria.push({
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

test.beforeEach(async ({ page }) => {
  page.errosHistoriaAlice = [];
  page.on('pageerror', (erro) => page.errosHistoriaAlice.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosHistoriaAlice.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => {
  expect(page.errosHistoriaAlice).toEqual([]);
});

test('cadastro exclusivo da Alice tem 20 questões, textos, layout amplo e dois ditados', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.revisao.chave).toBe(CHAVE);
  expect(dados.revisao.layout).toEqual({ desktopAmplo: true });
  expect(dados.revisao.questoes).toHaveLength(20);
  expect(dados.registro).toMatchObject({ aluno: 'alice', totalEtapas: 20 });
  expect(new Set(dados.revisao.questoes.map((questao) => questao.id)).size).toBe(20);
  dados.revisao.questoes.forEach((questao, indice) => {
    expect(questao.titulo).toMatch(new RegExp('^' + (indice + 1) + '\\. '));
    expect(questao.leituraTitulo).toBe('Leia para aprender');
    expect(questao.leitura.length).toBeGreaterThan(45);
    expect(questao.fonteEstudo.length).toBeGreaterThan(10);
  });
  expect(dados.revisao.questoes.flatMap((questao, i) => (questao.ditado ? [i + 1] : []))).toEqual([
    14, 20,
  ]);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-historia-familias-objetos')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#abrir-historia-transportes')).toBeHidden();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 20');
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toBeVisible();
  await expect(page.locator('#progresso-resumo')).toContainText('História: questão 1/20');
});

test('questões dependentes de fonte mostram na tela todo o conteúdo necessário', async ({
  page,
}) => {
  const verificacoes = {
    1: [/Famílias de muitos jeitos/i, /cuidado, respeito e carinho/i],
    3: [/Ana é mãe de Bia e Leo/i, /Nina é filha de Marta/i],
    4: [/Domingo na família de Luna/i, /mais tarde.*parque/i],
    5: [/cinco filhos/i, /aluguel e outras contas/i],
    6: [/1930/i, /menos crianças/i],
    8: [/Aidê/i, /1961/i, /14 irmãos/i],
    10: [/estudo e ao trabalho/i, /menos filhos/i],
    12: [/amor/i, /proteção/i, /cuidados especiais/i],
    15: [/caixa de lembranças de Caio/i, /carrinho antigo/i],
    17: [/Karajá.*bonecas de barro/i, /Baniwa.*arumã/i, /Timbira.*sementes/i],
    19: [/museu/i, /máquina de escrever/i, /fotografias/i],
  };
  for (const [numero, trechos] of Object.entries(verificacoes)) {
    await preparar(page, Number(numero));
    const leitura = page.getByRole('region', { name: 'Leia para aprender' });
    for (const trecho of trechos) await expect(leitura).toContainText(trecho);
    await expect(leitura.locator('.fonte-estudo-questionario')).toBeVisible();
  }
  for (const numero of [6, 18]) {
    await preparar(page, numero);
    await expect(page.locator('.ilustracao-leitura-questionario')).toBeVisible();
    await expect(page.locator('.ilustracao-leitura-questionario')).not.toHaveAttribute('alt', '');
  }
});

test('percurso completo usa gabarito independente e conclui com 20 pontos', async ({ page }) => {
  test.setTimeout(120000);
  await abrir(page);
  for (let numero = 1; numero <= 20; numero++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 20`);
    await responder(page, numero);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${numero} de 20`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('20 de 20');
  await page.locator('#gramatica-voltar').click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('20 de 20');
});

test('Q1 mistura alternativas e seleção com erro recuperável e várias ações persistidas', async ({
  page,
}) => {
  await abrir(page);
  await escolherNoItem(page, 0, 'Sim');
  await escolherNoItem(page, 1, 'As famílias podem ser diferentes umas das outras.');
  await escolherNoItem(page, 2, 'Cuidado');
  await escolherNoItem(page, 2, 'Desrespeito');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-item-gramatica="2"] [aria-pressed="true"]')).toHaveCount(2);
  await escolherNoItem(page, 0, 'Sim');
  await escolherNoItem(page, 0, 'Não');
  await escolherNoItem(page, 2, 'Desrespeito');
  await escolherNoItem(page, 2, 'Respeito');
  await escolherNoItem(page, 2, 'Carinho');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 20');
});

test('Q4 ordena, retira, limpa, restaura e exige também a alternativa 4B', async ({ page }) => {
  await preparar(page, 4);
  for (const resposta of [...DOMINGO].reverse())
    await page.getByRole('button', { name: resposta, exact: true }).press('Enter');
  await escolherNoItem(page, 1, 'Apenas uma rotina igual todos os dias.');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(4);
  await page.locator('[data-retirar-ordem-misto="0:0"]').press('Space');
  await page.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  await responderMista(page, 4);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(4);
});

test('Q3, Q8, Q9, Q16, Q17 e Q18 exigem todos os subitens e restauram associações', async ({
  page,
}) => {
  for (const numero of [3, 8, 9, 16, 17, 18]) {
    await preparar(page, numero);
    const escolhas = OPCOES[numero];
    for (let indice = 0; indice < escolhas.length - 1; indice++)
      await escolherNoItem(page, indice, escolhas[indice]);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await page.reload();
    await abrir(page);
    await escolherNoItem(page, escolhas.length - 1, escolhas.at(-1));
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
});

test('Q14 e Q20 usam ditado local sem revelar respostas, com repetir, parar e cancelar', async ({
  page,
}) => {
  test.setTimeout(90000);
  await simularAudio(page);
  for (const numero of [14, 20]) {
    await preparar(page, numero);
    const esperadas = numero === 14 ? [FRASE_14] : FRASES_20;
    expect(await page.evaluate(() => window.__falasAliceHistoria)).toEqual([]);
    const html = await page.locator('#gramatica-conteudo').innerHTML();
    for (const frase of esperadas) expect(html.toLowerCase()).not.toContain(frase.toLowerCase());
    for (const [indice, frase] of esperadas.entries()) {
      await page.locator('[data-ouvir-ditado-gramatica]').nth(indice).click();
      await expect
        .poll(async () => page.evaluate(() => window.__falasAliceHistoria.at(-1)?.texto))
        .toBe(frase);
      expect(await page.evaluate(() => window.__falasAliceHistoria.at(-1))).toMatchObject({
        idioma: 'pt-BR',
        velocidade: 0.78,
        local: true,
      });
      await expect(page.locator('[data-resposta-gramatica]').nth(indice)).toHaveValue('');
    }
    const antes = await page.evaluate(() => window.__falasAliceHistoria.length);
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect
      .poll(async () => page.evaluate(() => window.__falasAliceHistoria.length))
      .toBeGreaterThan(antes);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
    const cancelamentos = await page.evaluate(() => window.__cancelamentosAliceHistoria);
    await page.locator('#gramatica-voltar').click();
    expect(await page.evaluate(() => window.__cancelamentosAliceHistoria)).toBeGreaterThan(
      cancelamentos
    );
  }
});

test('Q20 permite corrigir três frases, flexibiliza pontuação e persiste edições', async ({
  page,
}) => {
  await preparar(page, 20);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('cada familia tem seu jeito de ser');
  await campos.nth(1).fill('Toda criança não tem direito à proteção.');
  await campos.nth(2).fill('OBJETOS ANTIGOS AJUDAM A CONHECER O PASSADO');
  await conferir(page);
  await expect(campos.nth(1)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await campos.nth(1).fill('toda criança tem direito a proteção');
  await page.reload();
  await abrir(page);
  await expect(campos.nth(1)).toHaveValue('toda criança tem direito a proteção');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 20');
});

test('limpeza remove somente a chave da Alice e preserva Mariana e outras revisões', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"sentinela":true}')),
    OUTRAS
  );
  await abrir(page);
  await responder(page, 1);
  page.once('dialog', (dialogo) => {
    expect(dialogo.message()).toContain('História');
    return dialogo.accept();
  });
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(
    await page.evaluate((chaves) => chaves.map((chave) => localStorage.getItem(chave)), OUTRAS)
  ).toEqual(OUTRAS.map(() => '{"sentinela":true}'));
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 20');
});

test('dados inválidos são normalizados e armazenamento bloqueado mantém progresso na aba', async ({
  page,
}) => {
  for (const dados of [
    '{inválido',
    JSON.stringify({ versao: 99, questaoAtual: 19 }),
    JSON.stringify({ questaoAtual: -9, respostas: { 'familias-objetos-q01': ['x'] } }),
  ]) {
    await page.evaluate(({ chave, dados }) => localStorage.setItem(chave, dados), {
      chave: CHAVE,
      dados,
    });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 20');
  }
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado no teste');
      };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 20');
});

test('390 × 844 oferece toque, interações mistas, classificações e ditado sem overflow', async ({
  browser,
}) => {
  test.setTimeout(90000);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto(URL);
  await abrir(page);
  for (const numero of [1, 3, 4, 9, 14, 16, 17, 18, 19, 20]) {
    await preparar(page, numero);
    await auditar(page);
    if (numero === 1) {
      await page.getByRole('button', { name: 'Cuidado', exact: true }).tap();
      await expect(page.getByRole('button', { name: 'Cuidado', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
    if (numero === 4) {
      await page.getByRole('button', { name: DOMINGO[0], exact: true }).tap();
      await page.locator('[data-retirar-ordem-misto]').tap();
      await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
    }
    if ([4, 18, 20].includes(numero))
      await page.screenshot({
        path: `test-results/historia-alice-mobile-q${numero}.png`,
        fullPage: true,
      });
  }
  expect(erros).toEqual([]);
  await contexto.close();
});

test('desktop 1366 e 1920 usa duas colunas e remove opt-in ao abrir revisão antiga', async ({
  page,
}) => {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await preparar(page, 18);
    await auditar(page);
    const colunas = await page
      .locator('.gramatica-com-leitura')
      .evaluate((elemento) =>
        window.getComputedStyle(elemento).gridTemplateColumns.split(' ').filter(Boolean)
      );
    expect(colunas).toHaveLength(2);
    await page.screenshot({
      path: `test-results/historia-alice-desktop-${width}.png`,
      fullPage: true,
    });
  }
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
});

test('bundle file:// funciona sem rede com seleção, ordem, persistência e ditado local', async ({
  page,
}) => {
  await simularAudio(page);
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
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 20');
  await preparar(page, 4);
  await responder(page, 4);
  await preparar(page, 14);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect
    .poll(async () => page.evaluate(() => window.__falasAliceHistoria.at(-1)?.texto))
    .toBe(FRASE_14);
  await responder(page, 14);
  expect(rede).toEqual([]);
});
