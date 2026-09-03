const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'mariana-ciencias-plantas-sol-setembro-2026';
const CHAVE = 'revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1';
const URL = '/ambiente_interativo/index.html';
const OUTRAS = [
  'revisoesEscolares.alice.ciencias.origemMateriais',
  'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
];
const DITADOS = {
  8: 'RAIZ',
  14: 'FOLHA',
  20: 'SOL',
  25: 'LUZ',
  30: 'A LUZ DO SOL É IMPORTANTE PARA A VIDA.',
};
const SELECOES = {
  9: ['Água', 'Luz', 'Condições adequadas do ambiente'],
  29: ['Beber água', 'Usar proteção adequada, como boné', 'Usar protetor solar quando necessário'],
};
const ORDEM = { 6: ['Flor', 'Fruto', 'Sementes'] };
const OPCOES = {
  1: ['Raiz'],
  2: ['Fixar a planta no solo e absorver água e nutrientes.'],
  3: ['Caule'],
  4: ['SUSTENTA'],
  5: ['Folha'],
  7: ['dentro do fruto, a vagem.'],
  10: ['Mangaba', 'Murici', 'Jatobá'],
  11: ['terrestre'],
  12: ['Muitos animais e seres humanos utilizam plantas como alimento.'],
  13: ['raiz', 'folha', 'fruto', 'semente'],
  15: ['Cena A — barranco com plantas e raízes'],
  16: ['Sol'],
  17: ['DIA', 'NOITE'],
  18: ['amanhecer'],
  19: ['Passarinho procurando alimento sob a luz do Sol'],
  21: ['coruja'],
  22: ['Para se aquecer.'],
  23: ['os ovos de tartaruga a se desenvolverem.'],
  24: ['receber luz adequada.'],
  26: ['luz e calor.'],
  27: ['a escura'],
  28: ['reflete muita luz', 'deixa a luz atravessar', 'absorve mais luz e aquece mais'],
};

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-ciencias-plantas-sol').click();
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

async function responder(page, numero) {
  if (numero === 1) {
    await page.getByRole('button', { name: 'Tocar na raiz' }).click();
  } else if (DITADOS[numero]) {
    await page.locator('[data-resposta-gramatica]').fill(DITADOS[numero]);
  } else if (SELECOES[numero]) {
    for (const texto of SELECOES[numero])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else if (ORDEM[numero]) {
    for (const texto of ORDEM[numero])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else {
    for (const [indice, texto] of OPCOES[numero].entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: texto, exact: true })
        .click();
  }
  await conferir(page);
  await expect(page.locator('#gramatica-proxima'), `Questão ${numero}`).toBeEnabled();
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
    window.__falasCiencias = [];
    window.__cancelamentosCiencias = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Online', lang: 'pt-BR', localService: false },
      { name: 'Maria', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => window.__cancelamentosCiencias++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasCiencias.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        local: fala.voice.localService,
        volume: fala.volume,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

test.beforeEach(async ({ page }) => {
  page.errosCiencias = [];
  page.on('pageerror', (erro) => page.errosCiencias.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosCiencias.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => expect(page.errosCiencias).toEqual([]));

test('cadastro exclusivo tem 30 questões, dois blocos de 15 e cinco ditados', async ({ page }) => {
  const dados = await page.evaluate((id) => {
    const revisao = window.QuestionariosRevisoes.obterRevisao(id);
    const registro = window.RegistroRevisoes.obter(id);
    return {
      ids: revisao.questoes.map((questao) => questao.id),
      partes: revisao.questoes.map((questao) => questao.parte),
      ditados: revisao.questoes
        .map((questao, indice) =>
          questao.ditado
            ? {
                numero: indice + 1,
                unidade: questao.unidadeDitado,
                resposta: questao.itens[0].respostas[0],
              }
            : null
        )
        .filter(Boolean),
      materia: revisao.materia,
      mapa: revisao.questoes[0].mapaVisual,
      chave: registro.chaveArmazenamento,
    };
  }, ID);
  expect(dados.ids).toHaveLength(30);
  expect(new Set(dados.ids).size).toBe(30);
  expect(dados.partes.slice(0, 15)).toEqual(Array(15).fill('plantas'));
  expect(dados.partes.slice(15)).toEqual(Array(15).fill('sol'));
  expect(dados.ditados).toEqual([
    { numero: 8, unidade: 'palavra', resposta: 'RAIZ' },
    { numero: 14, unidade: 'palavra', resposta: 'FOLHA' },
    { numero: 20, unidade: 'palavra', resposta: 'SOL' },
    { numero: 25, unidade: 'palavra', resposta: 'LUZ' },
    { numero: 30, unidade: 'frase', resposta: 'A LUZ DO SOL É IMPORTANTE PARA A VIDA.' },
  ]);
  expect(dados.materia).toBe('Ciências');
  expect(dados.mapa.pontos).toHaveLength(4);
  expect(dados.chave).toBe(CHAVE);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-ciencias-plantas-sol')).toBeHidden();
  await expect(page.locator('#materia-ciencias')).toBeVisible();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#materia-ciencias')).toBeHidden();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('percurso completo confere respostas e subitens, concede 30 pontos e restaura', async ({
  page,
}) => {
  test.setTimeout(120000);
  await abrir(page);
  for (let numero = 1; numero <= 30; numero++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 30`);
    await responder(page, numero);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${numero} de 30`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('mapa visual aceita teclado, erro corrigível, destaque textual, retorno e pontos únicos', async ({
  page,
}) => {
  await abrir(page);
  await page.getByRole('button', { name: 'Tocar na flor' }).press('Enter');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'Tocar na raiz' }).press('Space');
  await conferir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.getByRole('button', { name: 'Tocar na raiz' })).toHaveClass(/correta/);
  await expect(page.getByRole('button', { name: 'Tocar na raiz' })).toContainText('Raiz');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('ordenação e associações funcionam por clique e teclado, desfazem e persistem', async ({
  page,
}) => {
  await preparar(page, 6);
  await page.getByRole('button', { name: 'Sementes', exact: true }).press('Enter');
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(1);
  await page.locator('[data-retirar-ordem]').press('Space');
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Flor', exact: true }).click();
  await page.getByRole('button', { name: 'Fruto', exact: true }).press('Enter');
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(2);
  await page.getByRole('button', { name: 'Sementes', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  for (const numero of [10, 13, 28]) {
    await preparar(page, numero);
    for (const [indice, texto] of OPCOES[numero].entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: texto, exact: true })
        .press(indice % 2 ? 'Enter' : 'Space');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
});

test('cinco ditados são locais, não revelam/preenchem respostas e cancelam corretamente', async ({
  page,
}) => {
  test.setTimeout(120000);
  await simularAudio(page);
  await page.reload();
  for (const [numeroTexto, resposta] of Object.entries(DITADOS)) {
    const numero = Number(numeroTexto);
    await preparar(page, numero);
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    const textosExpostos = [
      await page.locator('#gramatica-conteudo').textContent(),
      ...(await page
        .locator('#gramatica-conteudo [aria-label]')
        .evaluateAll((elementos) =>
          elementos.map((elemento) => elemento.getAttribute('aria-label'))
        )),
    ]
      .join(' ')
      .toUpperCase();
    expect(textosExpostos).not.toContain(resposta);
    const antes = await page.evaluate(() => window.__falasCiencias.length);
    await page.locator('[data-ouvir-ditado-gramatica]').press('Enter');
    await expect
      .poll(async () => page.evaluate(() => window.__falasCiencias.at(-1)?.texto))
      .toBe(resposta);
    expect(await page.evaluate(() => window.__falasCiencias.at(-1))).toMatchObject({
      idioma: 'pt-BR',
      velocidade: 0.78,
      local: true,
    });
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect
      .poll(async () => page.evaluate(() => window.__falasCiencias.length))
      .toBeGreaterThan(antes);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
  }
  expect(await page.evaluate(() => window.__cancelamentosCiencias)).toBeGreaterThan(0);
});

test('seleção reabre sem listeners duplicados; limpeza, corrupção e bloqueio ficam isolados', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"sentinela":"preservar"}')),
    OUTRAS
  );
  await page.evaluate((chave) => localStorage.setItem(chave, '{corrompido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await preparar(page, 9);
  await page.getByRole('button', { name: 'Água', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Água', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(
    await page.evaluate((chaves) => chaves.map((chave) => localStorage.getItem(chave)), OUTRAS)
  ).toEqual(OUTRAS.map(() => '{"sentinela":"preservar"}'));
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
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('celular, desktops, troca para revisão antiga e file:// ficam acessíveis e sem overflow', async ({
  browser,
  page,
}) => {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await preparar(page, 1);
    await auditar(page);
  }
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const movel = await contexto.newPage();
  await movel.goto(URL);
  await abrir(movel);
  await movel.getByRole('button', { name: 'Tocar na raiz' }).tap();
  await auditar(movel);
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
