const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'mariana-geografia-transportes-comunicacao-setembro-2026';
const CHAVE = 'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1';
const URL = '/ambiente_interativo/index.html';
const OUTRAS = [
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
];
const SELECOES = {
  1: ['A pé', 'Ônibus', 'Carro', 'Barco', 'Bicicleta'],
  2: ['Pode ser usada para ir de um lugar a outro.', 'É movida pelas pedaladas.'],
  10: ['Carro a combustível', 'Ônibus a combustível'],
  12: [
    'Atravessar com adulto',
    'Usar faixa de pedestres',
    'Olhar para os dois lados',
    'Esperar condição segura no semáforo',
  ],
  13: ['Usar cinto', 'Manter mãos e braços dentro do veículo'],
  18: ['Enviar mensagens', 'Pesquisar', 'Conversar por chamada de vídeo'],
  24: [
    'Diferentes meios podem existir ao mesmo tempo.',
    'Tecnologias novas podem permitir comunicação mais rápida entre lugares distantes.',
    'Um meio antigo não precisa deixar de existir só porque surgiu um novo.',
  ],
  27: [
    'Não participar das ofensas',
    'Procurar adulto responsável ou professor',
    'Tratar os colegas com respeito',
  ],
  29: [
    'Escolher conteúdo adequado à idade',
    'Conversar com adulto responsável',
    'Desligar aparelhos durante refeições',
    'Evitar divulgar dados pessoais',
    'Equilibrar telas com outras atividades',
    'Evitar aparelhos pouco antes de dormir',
  ],
};
const OPCOES = {
  3: ['Barco ou lancha'],
  4: ['Embarcação', 'Bicicleta'],
  5: ['Aéreo', 'Aquático', 'Terrestre', 'Terrestre', 'Aéreo', 'Aquático'],
  6: ['Hidroviário', 'Dutoviário'],
  7: ['Rodoviário', 'Ferroviário', 'Aéreo', 'Hidroviário', 'Marítimo', 'Dutoviário'],
  8: ['MOTO', 'BARCO', 'AVIÃO'],
  9: ['Verdadeiro', 'Falso', 'Verdadeiro', 'Verdadeiro'],
  11: [
    'Usar cinto de segurança',
    'Embarcar e desembarcar no ponto de parada',
    'Usar colete salva-vidas',
    'Usar capacete, joelheiras e cotoveleiras',
  ],
  14: ['Ônibus escolar', 'Bicicleta', '3'],
  15: ['Hidroviário', 'Dutoviário', 'Capacete'],
  16: ['Telefone', 'Rádio', 'Jornal', 'Televisão'],
  17: ['Carta', 'Rádio', 'Televisão', 'Telefone ou celular'],
  19: ['Uma língua de sinais usada para comunicação.'],
  20: ['Verdadeiro', 'Verdadeiro', 'Falso'],
  23: ['Sim', 'Sim', 'Sim', 'Não'],
  25: ['Perigosa', 'Não enviar a foto e contar a um adulto responsável'],
  28: [
    '✓ Seguro',
    '⛔ Perigo — não faça',
    '⛔ Perigo — não faça',
    '⛔ Perigo — não faça',
    '⚠ Cuidado — fale com um adulto',
    '⛔ Perigo — não faça',
  ],
};
const ORDEM = {
  21: ['Pinturas rupestres', 'Escrita', 'Jornal', 'Telefone', 'Smartphone'],
  22: ['Telégrafo', 'Rádio', 'Televisão', 'Computador', 'Internet'],
};
const FRASES = [
  'Não clico em links de desconhecidos.',
  'Peço ajuda a um adulto quando tenho dúvida na internet.',
  'Não divulgo meus dados pessoais na internet.',
];

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-geografia-transportes-comunicacao').click();
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
  } else if (ORDEM[numero]) {
    for (const texto of ORDEM[numero])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else if (numero === 26) {
    await page
      .locator('[data-item-gramatica]')
      .nth(0)
      .getByRole('button', { name: 'Perigosa', exact: true })
      .click();
    for (const texto of ['Não clicar no link', 'Mostrar a mensagem a um adulto responsável'])
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else if (numero === 30) {
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
        volume: fala.volume,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

test.beforeEach(async ({ page }) => {
  page.errosGeografia = [];
  page.on('pageerror', (erro) => page.errosGeografia.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosGeografia.push(mensagem.text());
  });
  await page.goto(URL);
});

test.afterEach(async ({ page }) => expect(page.errosGeografia).toEqual([]));

test('cadastro exclusivo, 30 questões, Geografia e Desktop Amplo', async ({ page }) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.revisao.questoes).toHaveLength(30);
  expect(new Set(dados.revisao.questoes.map((questao) => questao.id)).size).toBe(30);
  expect(dados.revisao.materia).toBe('Geografia');
  expect(dados.revisao.layout).toEqual({ desktopAmplo: true });
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-geografia-transportes-comunicacao')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toBeVisible();
  await expect(page.locator('.fonte-estudo-questionario')).toContainText('Fonte de estudo:');
  await expect(page.locator('#progresso-resumo')).toContainText('Geografia: questão 1/30');
  await expect(page.locator('#limpar-progresso')).toHaveText('Limpar progresso de Geografia');
});

test('percurso completo independente concede 30 pontos, conclui e restaura', async ({ page }) => {
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

test('erro, correção, seleção reversível, retorno e recarga não duplicam pontos', async ({
  page,
}) => {
  await abrir(page);
  const distrator = page.getByRole('button', { name: 'Foguete', exact: true });
  await distrator.press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await distrator.press('Enter');
  for (const texto of SELECOES[1])
    await page.getByRole('button', { name: texto, exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(5);
  await conferir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.getByRole('button', { name: 'A pé', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('hidroviário e dutoviário aparecem antes da cobrança; dados, ordenação e semáforo são recuperáveis', async ({
  page,
}) => {
  await preparar(page, 6);
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toContainText(
    'Hidroviário acontece em rios'
  );
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toContainText(
    'Dutoviário leva materiais por dentro de tubos'
  );
  await preparar(page, 14);
  await page
    .locator('[data-item-gramatica]')
    .nth(0)
    .getByRole('button', { name: 'Bicicleta', exact: true })
    .click();
  await page.reload();
  await abrir(page);
  await expect(
    page
      .locator('[data-item-gramatica]')
      .nth(0)
      .getByRole('button', { name: 'Bicicleta', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await responder(page, 14);
  for (const numero of [21, 22]) {
    await preparar(page, numero);
    await page.getByRole('button', { name: ORDEM[numero].at(-1), exact: true }).press('Enter');
    await expect(page.locator('[data-retirar-ordem]')).toHaveCount(1);
    await page.locator('[data-retirar-ordem]').press('Space');
    await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
    await responder(page, numero);
  }
  await preparar(page, 28);
  for (const texto of ['✓ Seguro', '⚠ Cuidado — fale com um adulto', '⛔ Perigo — não faça'])
    await expect(page.getByRole('button', { name: texto, exact: true }).first()).toBeVisible();
});

test('ditado final é local, não toca automaticamente, permite repetir, parar e cancelamento', async ({
  page,
}) => {
  await simularAudio(page);
  await page.reload();
  await preparar(page, 30);
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

test('limpeza é seletiva, JSON corrompido e armazenamento bloqueado mantêm isolamento', async ({
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
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('mobile, desktops, revisão antiga e file:// funcionam sem overflow ou rede', async ({
  browser,
  page,
}) => {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await preparar(page, 30);
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
  await preparar(movel, 28);
  await movel.getByRole('button', { name: '✓ Seguro', exact: true }).first().tap();
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
