const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'mariana-gramatica-contos-ortografia-pontuacao';
const CHAVE = 'revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1';
const OUTRAS = [
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.mariana.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2',
];

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-contos').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function prepararQuestao(page, numero) {
  await page.evaluate(
    ({ chave, numero }) => {
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: numero - 1 }));
    },
    { chave: CHAVE, numero }
  );
  await page.reload();
  await abrir(page);
}

async function preencher(page, respostas) {
  const campos = page.locator('[data-resposta-gramatica]');
  await expect(campos).toHaveCount(respostas.length);
  for (let i = 0; i < respostas.length; i++) await campos.nth(i).fill(respostas[i]);
}

async function responder(page, questao) {
  if (questao.tipo === 'campos') {
    await preencher(
      page,
      questao.itens.map((item) => item.respostas[0])
    );
  } else {
    for (let i = 0; i < questao.itens.length; i++) {
      await page
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', {
          name: questao.itens[i].respostas[0],
          exact: true,
        })
        .click();
    }
  }
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

async function audioSimulado(page) {
  await page.addInitScript(() => {
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Online Portuguese', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
      { name: 'Microsoft David', lang: 'en-US', localService: true },
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
        volume: fala.volume,
        local: fala.voice.localService,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

async function acessibilidade(page) {
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
  page.errosDaRevisao = [];
  page.on('pageerror', (erro) => page.errosDaRevisao.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosDaRevisao.push(mensagem.text());
  });
  await page.goto(CAMINHO);
});

test.afterEach(async ({ page }) => {
  expect(page.errosDaRevisao).toEqual([]);
});

test('cadastra 30 questões nos blocos definidos e cartão exclusivo sem substituir revisões', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.GramaticaQuestionarios.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
      antiga: window.RevisaoGramaticaMariana.questoes.length,
      h: window.GramaticaQuestionarios.obterRevisao('mariana-gramatica-h-til-vocabulario').questoes
        .length,
    }),
    ID
  );
  expect(dados.revisao.chave).toBe(CHAVE);
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  expect(dados.registro.totalEtapas).toBe(30);
  expect(dados.antiga).toBe(40);
  expect(dados.h).toBe(25);
  expect(dados.revisao.questoes).toHaveLength(30);
  expect(new Set(dados.revisao.questoes.map((q) => q.id)).size).toBe(30);
  expect(dados.revisao.questoes.map((q) => q.bloco)).toEqual([
    ...Array(4).fill('Contos'),
    ...Array(3).fill('NH'),
    ...Array(3).fill('CH'),
    ...Array(2).fill('Antônimos'),
    ...Array(2).fill('Sinônimos'),
    ...Array(3).fill('Frase declarativa'),
    ...Array(2).fill('Interrogação'),
    ...Array(2).fill('Exclamação'),
    ...Array(2).fill('Travessão e dois-pontos'),
    ...Array(3).fill('S e SS'),
    ...Array(2).fill('S com som de Z'),
    ...Array(2).fill('Pontuação integrada'),
  ]);
  expect(dados.revisao.questoes.filter((q) => q.ditado).map((q) => q.id)).toEqual([
    'q07',
    'q10',
    'q17',
    'q21',
    'q23',
    'q28',
    'q30',
  ]);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-contos')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#progresso-resumo')).toContainText('questão 1/30');
});

test('erro recuperável, teclado, retorno, recarga e edição após acerto sem duplicar pontos', async ({
  page,
}) => {
  await abrir(page);
  const proxima = page.locator('#gramatica-proxima');
  const errada = page.getByRole('button', { name: 'receita', exact: true });
  await errada.focus();
  await page.keyboard.press('Space');
  await page.locator('[data-conferir-gramatica]').click();
  await expect(proxima).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('Revise');
  await expect(errada).toBeEnabled();
  const correta = page.getByRole('button', { name: 'conto', exact: true });
  await correta.focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-conferir-gramatica]').click();
  await proxima.click();
  await page.locator('#gramatica-voltar').click();
  await expect(correta).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await abrir(page);
  await expect(proxima).toBeEnabled();
  await expect(correta).toHaveClass(/correta/);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await errada.click();
  await expect(proxima).toBeDisabled();
  await correta.click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('persiste várias digitações parciais e exige todos os itens antes de avançar', async ({
  page,
}) => {
  await prepararQuestao(page, 5);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('nh');
  await campos.nth(1).fill('n');
  await campos.nth(2).fill('nh');
  await campos.nth(2).press('Enter');
  await expect(page.locator('.retorno-gramatica')).toContainText('Complete todos');
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('nh');
  await expect(campos.nth(1)).toHaveValue('n');
  await expect(campos.nth(2)).toHaveValue('nh');
  await expect(campos.nth(3)).toHaveValue('');
  await preencher(page, ['nh', 'nh', 'nh', 'nh']);
  await campos.last().press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('.campo-correto')).toHaveCount(4);
});

test('exige maiúsculas, acento, grafia e pontuação nos ditados e insere travessão pelo teclado', async ({
  page,
}) => {
  for (const caso of [
    {
      numero: 17,
      resposta: 'A menina guardou o desenho.',
      erros: [
        'a menina guardou o desenho.',
        'A menina guardou o desenho',
        'A menina guardou o dezenho.',
      ],
    },
    { numero: 19, resposta: 'A turma chegou?', erros: ['A turma chegou.', 'A turma já chegou?'] },
    { numero: 21, resposta: 'Que chuva forte!', erros: ['Que chuva forte.', 'que chuva forte!'] },
    {
      numero: 23,
      resposta: 'Bia perguntou: — Onde está a chave?',
      erros: [
        'Bia perguntou: — Onde esta a chave?',
        'Bia perguntou: - Onde está a chave?',
        'Bia perguntou — Onde está a chave?',
      ],
    },
    {
      numero: 30,
      resposta: 'O passarinho molhou o ninho!',
      erros: ['O pasarinho molhou o ninho!', 'O passarinho molhou o ninho.'],
    },
  ]) {
    await prepararQuestao(page, caso.numero);
    const campo = page.locator('[data-resposta-gramatica]');
    for (const erro of caso.erros) {
      await campo.fill(erro);
      await campo.press('Enter');
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await expect(campo).toBeEditable();
    }
    if (caso.numero === 23) {
      await campo.fill('Bia perguntou:  Onde está a chave?');
      await campo.evaluate((input) => input.setSelectionRange(15, 15));
      await page.getByRole('button', { name: 'Inserir travessão —' }).focus();
      await page.keyboard.press('Enter');
      await expect(campo).toHaveValue(caso.resposta);
      await campo.press('Backspace');
      await expect(campo).toHaveValue('Bia perguntou:  Onde está a chave?');
    }
    await campo.fill(caso.resposta);
    await campo.press('Enter');
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
  await prepararQuestao(page, 28);
  await preencher(page, ['caza', 'roza', 'meza', 'camiza']);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('.campo-incorreto')).toHaveCount(4);
  await preencher(page, ['casa', 'rosa', 'mesa', 'camisa']);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('conclui as 30 questões pelo fluxo real e limpa somente a chave nova', async ({ page }) => {
  test.setTimeout(90_000);
  await page.evaluate(
    (chaves) =>
      chaves.forEach((chave) =>
        localStorage.setItem(
          chave,
          JSON.stringify({ marcador: chave, questaoAtual: 2, respostas: { q01: ['preservado'] } })
        )
      ),
    OUTRAS
  );
  await page.reload();
  await abrir(page);
  const questoes = await page.evaluate(
    (id) => window.GramaticaQuestionarios.obterRevisao(id).questoes,
    ID
  );
  for (const questao of questoes) {
    await responder(page, questao);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  await expect(page.locator('#progresso-resumo')).toContainText('30 questões concluídas');
  await page.reload();
  await abrir(page);
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await page.locator('#gramatica-voltar').click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('#gramatica-proxima').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar progresso de Gramática' }).click();
  const valores = await page.evaluate(
    ({ chave, outras }) => ({
      nova: localStorage.getItem(chave),
      outras: outras.map((c) => localStorage.getItem(c)),
    }),
    { chave: CHAVE, outras: OUTRAS }
  );
  expect(valores.nova).toBeNull();
  for (let i = 0; i < OUTRAS.length; i++)
    expect(JSON.parse(valores.outras[i])).toEqual({
      marcador: OUTRAS[i],
      questaoAtual: 2,
      respostas: { q01: ['preservado'] },
    });
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('sete ditados não revelam respostas nem tocam sozinhos e usam português local', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await audioSimulado(page);
  for (const numero of [7, 10, 17, 21, 23, 28, 30]) {
    await prepararQuestao(page, numero);
    expect(await page.evaluate(() => window.__falas)).toEqual([]);
    const questao = await page.evaluate(
      ({ id, numero }) => window.GramaticaQuestionarios.obterRevisao(id).questoes[numero - 1],
      { id: ID, numero }
    );
    const html = await page.locator('#gramatica-conteudo').innerHTML();
    for (const item of questao.itens) expect(html).not.toContain(item.respostas[0]);
    const botoes = page.locator('[data-ouvir-ditado-gramatica]');
    for (let i = 0; i < questao.itens.length; i++) {
      await botoes.nth(i).focus();
      await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      expect(
        await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao())
      ).toMatchObject({
        texto: questao.itens[i].respostas[0],
        idioma: 'pt-BR',
        velocidade: 0.78,
        unidadeDitado: questao.unidadeDitado,
      });
      await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
    }
    await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(3);
    const falas = await page.evaluate(() => window.__falas);
    expect(falas.map((f) => f.texto)).toEqual([
      'Preparando.',
      'Atenção.',
      questao.itens.at(-1).respostas[0],
    ]);
    expect(falas[0].volume).toBe(0.01);
    expect(falas.every((f) => f.idioma === 'pt-BR' && f.local)).toBe(true);
    expect(falas[2].velocidade).toBe(0.78);
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(6);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
  }
});

test('parar, trocar questão e sair cancelam falas pendentes sem duplicar ações ao reabrir', async ({
  page,
}) => {
  await audioSimulado(page);
  await prepararQuestao(page, 7);
  await page.clock.install();
  const botoes = page.locator('[data-ouvir-ditado-gramatica]');
  await botoes.first().click();
  await botoes.nth(1).click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.map((f) => f.texto))).toEqual([
    'Preparando.',
    'Atenção.',
    'banho',
  ]);
  await botoes.first().click();
  await page.locator('[data-parar-ditado-gramatica]').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(3);
  await botoes.first().click();
  await page.locator('#gramatica-voltar').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(3);
  await prepararQuestao(page, 7);
  await botoes.first().click();
  await page.locator('#botao-inicio').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(0);
  await abrir(page);
  await botoes.first().click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.map((f) => f.texto))).toEqual([
    'Preparando.',
    'Atenção.',
    'ninho',
  ]);
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`desktop amplo ${viewport.width}, texto ao lado e opt-in removido nas revisões antigas`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await abrir(page);
    const tela = page.locator('#tela-gramatica-mariana');
    await expect(tela).toHaveClass(/layout-desktop-amplo/);
    const caixa = await tela.boundingBox();
    expect(caixa.width).toBeGreaterThan(viewport.width * 0.92);
    expect(caixa.width).toBeLessThan(viewport.width * 0.96);
    const leitura = await page.locator('.leitura-gramatica').boundingBox();
    const respostas = await page.locator('.respostas-gramatica').boundingBox();
    expect(respostas.x).toBeGreaterThan(leitura.x + leitura.width);
    await acessibilidade(page);
    await page.screenshot({
      path: testInfo.outputPath(`conto-${viewport.width}.png`),
      fullPage: true,
    });
    await prepararQuestao(page, 7);
    const campos = page.locator('.campo-mariana');
    expect((await campos.nth(1).boundingBox()).x).toBeGreaterThan(
      (await campos.nth(0).boundingBox()).x
    );
    await expect(page.locator('.gramatica-com-leitura')).toHaveCount(0);
    await acessibilidade(page);
    await page.screenshot({
      path: testInfo.outputPath(`ditado-${viewport.width}.png`),
      fullPage: true,
    });
    await prepararQuestao(page, 23);
    await acessibilidade(page);
    await page.screenshot({
      path: testInfo.outputPath(`frase-${viewport.width}.png`),
      fullPage: true,
    });
    for (const cartao of ['#abrir-gramatica-mariana', '#abrir-gramatica-h-til']) {
      await page.locator('#botao-inicio').click();
      await page.getByRole('button', { name: /Mariana/ }).click();
      await page.locator(cartao).click();
      await expect(tela).not.toHaveClass(/layout-desktop-amplo/);
      expect((await tela.boundingBox()).width).toBeLessThan(caixa.width);
      await page.locator('#botao-inicio').click();
      await abrir(page);
    }
    await page.locator('#botao-inicio').click();
    await page.getByRole('button', { name: /Alice/ }).click();
    await page.locator('#abrir-gramatica-h-til').click();
    await expect(tela).not.toHaveClass(/layout-desktop-amplo/);
    await expect(page.locator('#progresso-resumo')).toContainText('/25');
  });
}

test('celular 390 × 844, toque, ditado, campos e pontuação acessíveis sem erros', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text());
  });
  await audioSimulado(page);
  await page.goto('http://127.0.0.1:5173' + CAMINHO);
  await abrir(page);
  await page.getByRole('button', { name: 'conto', exact: true }).tap();
  await page.locator('[data-conferir-gramatica]').tap();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await acessibilidade(page);
  for (const numero of [7, 17, 23, 29]) {
    await prepararQuestao(page, numero);
    await acessibilidade(page);
    await page.screenshot({ path: testInfo.outputPath(`celular-q${numero}.png`), fullPage: true });
    if (numero === 7) {
      await page.locator('[data-ouvir-ditado-gramatica]').first().tap();
      await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(3);
      await preencher(page, ['ninho', 'banho', 'caminho', 'galinha']);
      await page.locator('[data-conferir-gramatica]').tap();
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    }
  }
  expect(erros).toEqual([]);
  await context.close();
});

test('tolera armazenamento corrompido e bloqueado com progresso em memória', async ({ page }) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{quebrado'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Bloqueado', 'SecurityError');
      },
    });
  });
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'conto', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('bundle file:// mantém ditado, correção e progresso sem recurso externo', async ({ page }) => {
  const erros = [];
  const externos = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('request', (r) => {
    if (/^https?:/.test(r.url())) externos.push(r.url());
  });
  await audioSimulado(page);
  await page.goto(
    pathToFileURL(path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html')).href
  );
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await prepararQuestao(page, 21);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect
    .poll(() => page.evaluate(() => window.__falas.map((f) => f.texto)))
    .toEqual(['Preparando.', 'Atenção.', 'Que chuva forte!']);
  await preencher(page, ['Que chuva forte.']);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await preencher(page, ['Que chuva forte!']);
  await page.locator('[data-resposta-gramatica]').press('Enter');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('Que chuva forte!');
  expect(erros).toEqual([]);
  expect(externos).toEqual([]);
});
