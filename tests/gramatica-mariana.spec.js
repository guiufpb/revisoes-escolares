const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE = 'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1';
const CHAVE_MATEMATICA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_ALICE = 'revisoesEscolares.alice.ciencias.origemMateriais';

async function abrirGramatica(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function respostasDaQuestao(page, indice) {
  return page.evaluate((numero) => {
    const questao = window.RevisaoGramaticaMariana.questoes[numero];
    return questao.itens.map((item) => item.respostas[0]);
  }, indice);
}

async function preencherCampos(page, respostas) {
  const campos = page.locator('[data-resposta-gramatica]');
  await expect(campos).toHaveCount(respostas.length);
  for (let indice = 0; indice < respostas.length; indice += 1) {
    await campos.nth(indice).fill(respostas[indice]);
  }
}

async function prepararAudioPortugues(page) {
  await page.evaluate(() => {
    window.__falasGramatica = [];
    window.__cancelamentosGramatica = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Maria Natural', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosGramatica += 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasGramatica.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        volume: fala.volume,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
    window.AudioRevisoes.atualizarVozes();
  });
}

async function conferirAcessibilidade(page, nome) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(
    () =>
      new Promise((resolver) =>
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolver))
      )
  );
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const graves = resultado.violations.filter((violacao) =>
    ['serious', 'critical'].includes(violacao.impact)
  );
  expect(graves, `${nome}: ${graves.map((item) => item.id).join(', ')}`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate((chave) => localStorage.removeItem(chave), CHAVE);
  await page.reload();
});

test('cadastra 40 questões nos sete blocos pedidos e mostra a revisão somente para Mariana', async ({
  page,
}) => {
  const dados = await page.evaluate(() => ({
    total: window.RevisaoGramaticaMariana.questoes.length,
    declarado: window.RevisaoGramaticaMariana.totalQuestoes,
    blocos: [...new Set(window.RevisaoGramaticaMariana.questoes.map((item) => item.bloco))],
    registro: window.RegistroRevisoes.obter('mariana-gramatica-revisao-ampla'),
  }));
  expect(dados.total).toBe(40);
  expect(dados.declarado).toBe(40);
  expect(dados.blocos).toEqual([
    'M e N no final',
    'Ponto de interrogação',
    'ZA, ZE, ZI, ZO, ZU',
    'Número de sílabas',
    'Ponto de exclamação',
    'Transformação de frases',
    'S e SS',
  ]);
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  expect(dados.registro.totalEtapas).toBe(40);

  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-mariana')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-gramatica-mariana')).toBeVisible();
});

test('permite errar, corrigir sem pular, avançar, voltar e recarregar várias respostas', async ({
  page,
}) => {
  await abrirGramatica(page);
  await expect(page.getByRole('heading', { name: 'Complete com M ou N' })).toBeVisible();
  const proxima = page.locator('#gramatica-proxima');
  await expect(proxima).toBeDisabled();

  await preencherCampos(page, ['n', 'n', 'n', 'm']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('Revise os itens destacados');
  await expect(page.locator('.campo-incorreto')).toHaveCount(4);
  await expect(proxima).toBeDisabled();

  await preencherCampos(page, await respostasDaQuestao(page, 0));
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('Você observou a regra geral');
  await expect(proxima).toBeEnabled();
  await proxima.click();
  await expect(page.getByRole('heading', { name: 'Mais palavras com M ou N' })).toBeVisible();

  const respostasSegunda = await respostasDaQuestao(page, 1);
  await page.locator('[data-resposta-gramatica]').nth(0).fill(respostasSegunda[0]);
  await page.locator('[data-resposta-gramatica]').nth(1).fill(respostasSegunda[1]);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.locator('[data-resposta-gramatica]').nth(0)).toHaveValue(respostasSegunda[0]);
  await expect(page.locator('[data-resposta-gramatica]').nth(1)).toHaveValue(respostasSegunda[1]);

  await page.locator('#gramatica-voltar').click();
  await expect(page.getByRole('heading', { name: 'Complete com M ou N' })).toBeVisible();
  await expect(page.locator('[data-resposta-gramatica]').nth(0)).toHaveValue('m');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('mantém opções corrigíveis por clique e teclado e restaura a seleção', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 2 }));
  }, CHAVE);
  await page.reload();
  await abrirGramatica(page);
  await expect(page.getByRole('heading', { name: 'Escolha a escrita correta' })).toBeVisible();

  const errada = page.getByRole('button', { name: 'pudin', exact: true });
  await errada.focus();
  await page.keyboard.press('Space');
  await expect(errada).toHaveAttribute('aria-pressed', 'true');

  const corretas = await respostasDaQuestao(page, 2);
  for (const resposta of corretas) {
    const botao = page.getByRole('button', { name: resposta, exact: true });
    await botao.focus();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.getByRole('button', { name: 'pudim', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});

test('aceita digitação de frase exclamativa e exige o ponto de exclamação', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 31 }));
  }, CHAVE);
  await page.reload();
  await abrirGramatica(page);
  await expect(page.getByRole('heading', { name: 'Transforme em exclamativa' })).toBeVisible();
  const campo = page.locator('[data-resposta-gramatica]');
  await campo.fill('Que homem forte.');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('Revise');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await campo.fill('Que homem forte!');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('transformou a afirmação');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('conclui a questão 40 uma vez e preserva Matemática e Alice ao limpar Gramática', async ({
  page,
}) => {
  await page.evaluate(
    ({ chave, matematica, alice }) => {
      const ids = window.RevisaoGramaticaMariana.questoes.map((item) => item.id);
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 39,
          corrigidas: Object.fromEntries(ids.map((id) => [id, true])),
          pontuadas: Object.fromEntries(ids.map((id) => [id, true])),
        })
      );
      localStorage.setItem(matematica, JSON.stringify({ marcador: 'matematica-preservada' }));
      localStorage.setItem(alice, JSON.stringify({ marcador: 'alice-preservada' }));
    },
    { chave: CHAVE, matematica: CHAVE_MATEMATICA, alice: CHAVE_ALICE }
  );
  await page.reload();
  await abrirGramatica(page);
  await expect(page.getByText('40 de 40', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Concluir revisão →' }).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.getByText('40 questões concluídas', { exact: true })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar progresso de Gramática' }).click();
  const valores = await page.evaluate(
    ({ chave, matematica, alice }) => ({
      gramatica: localStorage.getItem(chave),
      matematica: localStorage.getItem(matematica),
      alice: localStorage.getItem(alice),
    }),
    { chave: CHAVE, matematica: CHAVE_MATEMATICA, alice: CHAVE_ALICE }
  );
  expect(valores.gramatica).toBeNull();
  expect(valores.matematica).toContain('matematica-preservada');
  expect(valores.alice).toContain('alice-preservada');
  await expect(page.getByRole('heading', { name: 'Complete com M ou N' })).toBeVisible();
});

test('tolera JSON corrompido e funciona em 390 x 844 sem erro grave ou overflow', async ({
  page,
}) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.evaluate((chave) => localStorage.setItem(chave, '{progresso quebrado'), CHAVE);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await abrirGramatica(page);
  await expect(page.getByText('Questão 1 de 40')).toBeVisible();
  await conferirAcessibilidade(page, 'Gramática da Mariana no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);
});

test('abre a revisão pelo bundle local em file://', async ({ page }) => {
  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirGramatica(page);
  await expect(page.getByText('Questão 1 de 40')).toBeVisible();
});

test('oferece ditado em português nas questões 5, 7 e 22 sem mostrar a resposta', async ({
  page,
}) => {
  const cenarios = [
    { indice: 4, respostas: ['amendoim', 'capim', 'pudim', 'tem'] },
    { indice: 6, respostas: ['nuvem', 'jardim', 'ordem', 'pólen'] },
    { indice: 21, respostas: ['beleza', 'limpeza', 'zebra', 'buzina'] },
  ];

  for (const cenario of cenarios) {
    await page.evaluate(
      ({ chave, indice }) => localStorage.setItem(chave, JSON.stringify({ questaoAtual: indice })),
      { chave: CHAVE, indice: cenario.indice }
    );
    await page.reload();
    await abrirGramatica(page);
    await prepararAudioPortugues(page);
    const botoes = page.locator('[data-ouvir-ditado-gramatica]');
    await expect(botoes).toHaveCount(4);
    await expect(page.locator('.status-ditado-gramatica')).toContainText('Escolha uma lacuna');
    expect(await page.locator('#gramatica-conteudo').innerText()).not.toContain(
      cenario.respostas.join(' ')
    );

    const ouvidas = [];
    for (let indice = 0; indice < cenario.respostas.length; indice += 1) {
      const botao = botoes.nth(indice);
      await botao.focus();
      await page.keyboard.press(indice % 2 === 0 ? 'Enter' : 'Space');
      ouvidas.push(await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao().texto));
    }
    expect(ouvidas).toEqual(cenario.respostas);
    const solicitacao = await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao());
    expect(solicitacao).toMatchObject({
      idioma: 'pt-BR',
      velocidade: 0.78,
      origem: 'gramatica',
      contexto: 'ditado',
      unidadeDitado: 'palavra',
    });
    await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeEnabled();
  }

  await expect(page.locator('.status-ditado-gramatica')).toContainText(
    'O ditado começará em 1 segundo'
  );
  await expect
    .poll(() => page.evaluate(() => window.__falasGramatica.map((fala) => fala.texto)))
    .toEqual(['Preparando.', 'Atenção.', 'buzina']);
  await page.locator('[data-repetir-ditado-gramatica]').click();
  expect(await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao().texto)).toBe(
    'buzina'
  );
  await page.locator('[data-parar-ditado-gramatica]').click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText('Áudio interrompido');
});

test('mantém o ditado da Gramática acessível e sem overflow no celular', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 21 }));
  }, CHAVE);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await abrirGramatica(page);
  await expect(page.locator('[data-ouvir-ditado-gramatica]')).toHaveCount(4);
  await conferirAcessibilidade(page, 'Ditado de Gramática da Mariana no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
