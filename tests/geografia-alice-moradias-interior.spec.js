const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'alice-geografia-moradias-lugares-interior-setembro-2026';
const CHAVE = 'revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1';
const URL = '/ambiente_interativo/index.html';
const OUTRAS = [
  'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1',
  'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
];
const SELECOES = {
  1: ['Viver', 'Descansar', 'Proteger-se'],
  3: ['Nome da rua', 'Número', 'Bairro', 'Cidade', 'CEP'],
  6: ['Padaria', 'Mercado', 'Farmácia', 'Casas', 'Prédios'],
  19: ['Geladeira', 'Pia', 'Fogão'],
  20: ['Cama', 'Travesseiro'],
  21: ['Chuveiro', 'Pia do banheiro'],
  23: ['Guardar brinquedos', 'Colocar objetos no lugar', 'Ajudar em tarefas adequadas à idade'],
};
const OPCOES = {
  2: ['Casa', 'Prédio de apartamentos'],
  4: ['Rua das Flores', '25', 'Jardim'],
  5: ['Árvore', 'Praça'],
  7: ['Praça'],
  8: ['Casa térrea'],
  9: ['Sobrado'],
  10: ['Prédio'],
  11: ['Sobre estacas perto da água', 'Moradia indígena tradicional', 'Feita com blocos de neve'],
  12: ['Apartamento', 'Sobrado', 'Palafita'],
  13: ['Verdadeiro', 'Falso', 'Verdadeiro'],
  14: ['Madeira', 'Tijolos', 'Blocos de neve'],
  15: ['Casa térrea', '3', 'Sobrado'],
  16: ['Uma parte da moradia'],
  17: ['Banheiro', 'Cozinha', 'Quarto', 'Sala'],
  18: ['Quarto', 'Cozinha', 'Banheiro', 'Sala'],
  22: ['4', 'Quarto', 'Cozinha'],
  24: ['Apartamento', 'Sobrado', 'Padaria', 'Praça'],
};
const FRASES = [
  'A moradia é um lugar para viver.',
  'O quarto é um cômodo da casa.',
  'A praça pode ser um lugar de brincar.',
];

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-geografia-moradias-lugares-interior').click();
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
  if (SELECOES[numero]) {
    for (const texto of SELECOES[numero])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else if (numero === 25) {
    for (const [indice, frase] of FRASES.entries())
      await page.locator('[data-resposta-gramatica]').nth(indice).fill(frase);
  } else {
    for (const [indice, texto] of OPCOES[numero].entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(indice)
        .getByRole('button', { name: texto, exact: true })
        .click();
  }
  await conferir(page);
  await expect(page.locator('#gramatica-proxima'), 'Questão ' + numero).toBeEnabled();
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
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Online', lang: 'pt-BR', localService: false },
      { name: 'Maria', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentos++;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falas.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        local: fala.voice.localService,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

test.beforeEach(async ({ page }) => {
  page.errosGeografiaAlice = [];
  page.on('pageerror', (erro) => page.errosGeografiaAlice.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosGeografiaAlice.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => expect(page.errosGeografiaAlice).toEqual([]));

test('cadastro exclusivo de Alice, 25 questões, dados fictícios e Desktop Amplo', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.revisao.questoes).toHaveLength(25);
  expect(new Set(dados.revisao.questoes.map((questao) => questao.id)).size).toBe(25);
  expect(dados.revisao.materia).toBe('Geografia');
  expect(dados.revisao.layout).toEqual({ desktopAmplo: true });
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  expect(JSON.stringify(dados.revisao.questoes[3])).toContain('Família Sol');
  expect(JSON.stringify(dados.revisao.questoes[3])).not.toContain('Alice');
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-geografia-moradias-lugares-interior')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 25');
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.locator('#progresso-resumo')).toContainText('Geografia: questão 1/25');
  await expect(page.locator('#limpar-progresso')).toHaveText('Limpar progresso de Geografia');
});

test('gabarito independente percorre 25 questões, concede pontos e restaura conclusão', async ({
  page,
}) => {
  test.setTimeout(120000);
  await abrir(page);
  for (let numero = 1; numero <= 25; numero++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${numero} de 25`);
    await responder(page, numero);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${numero} de 25`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('25 de 25');
});

test('erro, correção, seleção reversível, voltar e recarga não duplicam pontos', async ({
  page,
}) => {
  await abrir(page);
  const distrator = page.getByRole('button', { name: 'Dirigir um ônibus', exact: true });
  await distrator.press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await distrator.press('Enter');
  for (const texto of SELECOES[1])
    await page.getByRole('button', { name: texto, exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(3);
  await conferir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.getByRole('button', { name: 'Viver', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('cenas e explicações autossuficientes restauram respostas', async ({ page }) => {
  await preparar(page, 5);
  await expect(page.getByRole('img', { name: /árvore ao lado/i })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toContainText(
    'praça fica em frente'
  );
  await preparar(page, 11);
  const leitura = page.getByRole('region', { name: 'Leia para aprender' });
  await expect(leitura).toContainText('Palafita');
  await expect(leitura).toContainText('Oca');
  await expect(leitura).toContainText('Iglu');
  await preparar(page, 15);
  await page
    .locator('[data-item-gramatica]')
    .nth(0)
    .getByRole('button', { name: 'Apartamento', exact: true })
    .click();
  await page.reload();
  await abrir(page);
  await expect(
    page
      .locator('[data-item-gramatica]')
      .nth(0)
      .getByRole('button', { name: 'Apartamento', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await responder(page, 15);
  await preparar(page, 22);
  await expect(page.getByRole('img', { name: /quatro cômodos/i })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toContainText(
    'quatro cômodos'
  );
});

test('ditado final é local, não toca automaticamente, repete, para e cancela', async ({ page }) => {
  await simularAudio(page);
  await page.reload();
  await preparar(page, 25);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  const html = await page.locator('#gramatica-conteudo').innerHTML();
  for (const frase of FRASES) expect(html.toLowerCase()).not.toContain(frase.toLowerCase());
  await page.locator('[data-ouvir-ditado-gramatica]').first().press('Enter');
  await expect.poll(async () => page.evaluate(() => window.__falas.at(-1)?.texto)).toBe(FRASES[0]);
  expect(await page.evaluate(() => window.__falas.at(-1))).toMatchObject({
    idioma: 'pt-BR',
    velocidade: 0.78,
    local: true,
  });
  const antes = await page.evaluate(() => window.__falas.length);
  await page.locator('[data-repetir-ditado-gramatica]').click();
  await expect.poll(async () => page.evaluate(() => window.__falas.length)).toBeGreaterThan(antes);
  await page.locator('[data-parar-ditado-gramatica]').click();
  await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await page.locator('[data-resposta-gramatica]').nth(1).focus();
  await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
});

test('limpeza é seletiva, dados inválidos e armazenamento bloqueado preservam isolamento', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"sentinela":"preservar"}')),
    OUTRAS
  );
  await page.evaluate((chave) => localStorage.setItem(chave, '{corrompido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 25');
  await responder(page, 1);
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
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
});

test('mobile, desktop, revisão sem opt-in e file:// permanecem acessíveis', async ({
  browser,
  page,
}) => {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await preparar(page, 22);
    await auditar(page);
  }
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const movel = await contexto.newPage();
  await movel.goto(URL);
  await abrir(movel);
  await preparar(movel, 5);
  await movel.getByRole('button', { name: 'Árvore', exact: true }).first().tap();
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
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
  expect(rede).toEqual([]);
});
