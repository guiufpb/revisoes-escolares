const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID_ALICE = 'alice-gramatica-h-til-vocabulario';
const ID_MARIANA = 'mariana-gramatica-h-til-vocabulario';
const CHAVE_ALICE = 'revisoesEscolares.alice.gramatica.hTilVocabulario.v1';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.gramatica.hTilVocabulario.v1';
const CHAVE_ANTIGA = 'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1';

async function abrirGramatica(page, perfil) {
  const nome = perfil === 'alice' ? 'Alice' : 'Mariana';
  await page.getByRole('button', { name: new RegExp(nome) }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function respostasDaQuestao(page, id, indice) {
  return page.evaluate(
    ({ revisaoId, numero }) =>
      window.GramaticaQuestionarios.obterRevisao(revisaoId).questoes[numero].itens.map(
        (item) => item.respostas[0]
      ),
    { revisaoId: id, numero: indice }
  );
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
    window.__falasGramaticaCompartilhada = [];
    window.__cancelamentosGramaticaCompartilhada = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Maria Natural', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosGramaticaCompartilhada += 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasGramaticaCompartilhada.push(fala.text);
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
    window.AudioRevisoes.atualizarVozes();
  });
}

async function marcarRespostas(page, respostas) {
  const grupos = page.locator('[data-item-gramatica]');
  for (let indice = 0; indice < respostas.length; indice += 1) {
    const botao = grupos.nth(indice).getByRole('button', {
      name: respostas[indice],
      exact: true,
    });
    await botao.focus();
    await page.keyboard.press(indice % 2 === 0 ? 'Enter' : 'Space');
  }
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
  await page.evaluate(
    ({ alice, mariana }) => {
      localStorage.removeItem(alice);
      localStorage.removeItem(mariana);
    },
    { alice: CHAVE_ALICE, mariana: CHAVE_MARIANA }
  );
  await page.reload();
});

test('cadastra o mesmo conteúdo de 25 questões para Alice e Mariana com chaves individuais', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ aliceId, marianaId }) => {
      const alice = window.GramaticaQuestionarios.obterRevisao(aliceId);
      const mariana = window.GramaticaQuestionarios.obterRevisao(marianaId);
      return {
        mesmaLista: alice.questoes === mariana.questoes,
        totalAlice: alice.questoes.length,
        totalMariana: mariana.questoes.length,
        blocos: [...new Set(alice.questoes.map((item) => item.bloco))],
        texto: JSON.stringify(alice.questoes),
        registroAlice: window.RegistroRevisoes.obter(aliceId),
        registroMariana: window.RegistroRevisoes.obter(marianaId),
      };
    },
    { aliceId: ID_ALICE, marianaId: ID_MARIANA }
  );

  expect(dados.mesmaLista).toBe(true);
  expect(dados.totalAlice).toBe(25);
  expect(dados.totalMariana).toBe(25);
  expect(dados.registroAlice.chaveArmazenamento).toBe(CHAVE_ALICE);
  expect(dados.registroMariana.chaveArmazenamento).toBe(CHAVE_MARIANA);
  expect(dados.registroAlice.totalEtapas).toBe(25);
  expect(dados.registroMariana.totalEtapas).toBe(25);
  expect(dados.texto).toContain('super-homem');
  expect(dados.texto).toContain('anti-higiênico');
  expect(dados.texto).toContain('Quem mora ____ no polo Norte');
  expect(dados.blocos).toEqual(
    expect.arrayContaining([
      'H no início',
      'Dígrafos',
      'Til (~)',
      'Acento circunflexo',
      'Sinônimos',
      'Antônimos',
    ])
  );

  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-h-til')).toBeVisible();
  await expect(page.locator('#abrir-gramatica-mariana')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-gramatica-h-til')).toBeVisible();
  await expect(page.locator('#abrir-gramatica-mariana')).toBeVisible();
});

test('permite errar, corrigir por teclado, avançar, voltar e recarregar várias respostas', async ({
  page,
}) => {
  await abrirGramatica(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Encontre as palavras com H' })).toBeVisible();
  await expect(page.getByText('Questão 1 de 25')).toBeVisible();
  const grupos = page.locator('[data-item-gramatica]');
  await grupos.nth(0).getByRole('button', { name: 'omem', exact: true }).click();
  await grupos.nth(1).getByRole('button', { name: 'oje', exact: true }).click();
  await grupos.nth(2).getByRole('button', { name: 'ora', exact: true }).click();
  await grupos.nth(3).getByRole('button', { name: 'ábito', exact: true }).click();
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('Revise os itens destacados');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();

  await marcarRespostas(page, await respostasDaQuestao(page, ID_ALICE, 0));
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.locator('#gramatica-proxima').click();
  await expect(page.getByRole('heading', { name: 'Complete com H' })).toBeVisible();
  const respostas = await respostasDaQuestao(page, ID_ALICE, 1);
  await page.locator('[data-resposta-gramatica]').nth(0).fill(respostas[0]);
  await page.locator('[data-resposta-gramatica]').nth(1).fill(respostas[1]);

  await page.reload();
  await abrirGramatica(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Complete com H' })).toBeVisible();
  await expect(page.locator('[data-resposta-gramatica]').nth(0)).toHaveValue('h');
  await expect(page.locator('[data-resposta-gramatica]').nth(1)).toHaveValue('h');
  await page.locator('#gramatica-voltar').click();
  await expect(page.getByRole('heading', { name: 'Encontre as palavras com H' })).toBeVisible();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('exige til e circunflexo nas questões de digitação', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 13 }));
  }, CHAVE_ALICE);
  await page.reload();
  await abrirGramatica(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Digite as palavras com til' })).toBeVisible();
  await preencherCampos(page, ['maca', 'aviao', 'mao', 'poe', 'coracao']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.campo-incorreto')).toHaveCount(5);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await preencherCampos(page, ['maçã', 'avião', 'mão', 'põe', 'coração']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();

  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 18 }));
  }, CHAVE_ALICE);
  await page.reload();
  await abrirGramatica(page, 'alice');
  await preencherCampos(page, ['bebe', 'voce', 'avo', 'robo']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.campo-incorreto')).toHaveCount(4);
  await preencherCampos(page, ['bebê', 'você', 'avô', 'robô']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('diferencia lã e lá e mantém os progressos das duas meninas isolados', async ({ page }) => {
  await page.evaluate(
    ({ alice, antiga }) => {
      localStorage.setItem(alice, JSON.stringify({ questaoAtual: 17 }));
      localStorage.setItem(antiga, JSON.stringify({ marcador: 'revisao-antiga-preservada' }));
    },
    { alice: CHAVE_ALICE, antiga: CHAVE_ANTIGA }
  );
  await page.reload();
  await abrirGramatica(page, 'alice');
  await preencherCampos(page, ['la', 'la']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.campo-incorreto')).toHaveCount(2);
  await preencherCampos(page, ['lá', 'lã']);
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();

  await page.locator('#botao-inicio').click();
  await abrirGramatica(page, 'mariana');
  await expect(page.getByText('Questão 1 de 25')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Encontre as palavras com H' })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar progresso de Gramática' }).click();
  const salvos = await page.evaluate(
    ({ alice, mariana, antiga }) => ({
      alice: localStorage.getItem(alice),
      mariana: localStorage.getItem(mariana),
      antiga: localStorage.getItem(antiga),
    }),
    { alice: CHAVE_ALICE, mariana: CHAVE_MARIANA, antiga: CHAVE_ANTIGA }
  );
  expect(salvos.alice).toContain('q18');
  expect(salvos.mariana).toBeNull();
  expect(salvos.antiga).toContain('revisao-antiga-preservada');
});

test('conclui as 25 questões uma vez e restaura a tela final', async ({ page }) => {
  await page.evaluate(
    ({ chave, id }) => {
      const revisao = window.GramaticaQuestionarios.obterRevisao(id);
      const ids = revisao.questoes.map((item) => item.id);
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 24,
          corrigidas: Object.fromEntries(ids.map((questaoId) => [questaoId, true])),
          pontuadas: Object.fromEntries(ids.map((questaoId) => [questaoId, true])),
        })
      );
    },
    { chave: CHAVE_MARIANA, id: ID_MARIANA }
  );
  await page.reload();
  await abrirGramatica(page, 'mariana');
  await expect(page.getByText('25 de 25', { exact: true })).toBeVisible();
  await page.locator('#gramatica-proxima').click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.getByText('25 questões concluídas', { exact: true })).toBeVisible();
  await page.reload();
  await abrirGramatica(page, 'mariana');
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
});

test('tolera JSON corrompido e funciona em 390 x 844 sem erro grave ou overflow', async ({
  page,
}) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.evaluate((chave) => localStorage.setItem(chave, '{progresso quebrado'), CHAVE_ALICE);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await abrirGramatica(page, 'alice');
  await conferirAcessibilidade(page, 'Gramática compartilhada no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);
});

test('abre a revisão compartilhada pelo bundle local em file://', async ({ page }) => {
  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirGramatica(page, 'alice');
  await expect(page.getByText('Questão 1 de 25')).toBeVisible();
});

test('dita em português as quatro respostas com til para Alice e Mariana', async ({ page }) => {
  await page.evaluate(
    ({ alice, mariana }) => {
      localStorage.setItem(alice, JSON.stringify({ questaoAtual: 16 }));
      localStorage.setItem(mariana, JSON.stringify({ questaoAtual: 16 }));
    },
    { alice: CHAVE_ALICE, mariana: CHAVE_MARIANA }
  );
  await page.reload();
  await abrirGramatica(page, 'alice');
  await prepararAudioPortugues(page);
  await expect(page.locator('[data-ouvir-ditado-gramatica]')).toHaveCount(4);
  expect(await page.evaluate(() => window.__falasGramaticaCompartilhada)).toEqual([]);

  const esperadas = ['irmã', 'avião', 'balões', 'manhã'];
  const ouvidas = [];
  const botoes = page.locator('[data-ouvir-ditado-gramatica]');
  for (let indice = 0; indice < esperadas.length; indice += 1) {
    const botao = botoes.nth(indice);
    await botao.focus();
    await page.keyboard.press(indice % 2 === 0 ? 'Enter' : 'Space');
    ouvidas.push(await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao().texto));
  }
  expect(ouvidas).toEqual(esperadas);
  await expect
    .poll(() => page.evaluate(() => window.__falasGramaticaCompartilhada))
    .toEqual(['Preparando.', 'Atenção.', 'manhã']);

  const falasAntesDaTroca = await page.evaluate(() => window.__falasGramaticaCompartilhada.length);
  await page.locator('#botao-inicio').click();
  await abrirGramatica(page, 'mariana');
  await expect(page.getByText('Questão 17 de 25')).toBeVisible();
  expect(await page.evaluate(() => window.__falasGramaticaCompartilhada.length)).toBe(
    falasAntesDaTroca
  );
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  expect(await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao().texto)).toBe(
    'irmã'
  );
});

test('mostra o ditado compartilhado no celular e pelo bundle file local', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 16 }));
  }, CHAVE_ALICE);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await abrirGramatica(page, 'alice');
  await expect(page.locator('[data-ouvir-ditado-gramatica]')).toHaveCount(4);
  await conferirAcessibilidade(page, 'Ditado de Gramática compartilhado no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 16 }));
  }, CHAVE_ALICE);
  await page.reload();
  await abrirGramatica(page, 'alice');
  await expect(page.locator('[data-ouvir-ditado-gramatica]')).toHaveCount(4);
});
