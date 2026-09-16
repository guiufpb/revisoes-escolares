const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const IDS = {
  alice: 'alice-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026',
  mariana: 'mariana-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026',
};
const CHAVES = {
  alice: 'revisoesEscolares.alice.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1',
  mariana: 'revisoesEscolares.mariana.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1',
};
const CHAVE_ANTIGA = 'revisoesEscolares.alice.matematica.maisContasETabuada.v1';

async function abrir(page, perfil, acao = 'click') {
  const nome = perfil === 'alice' ? 'Alice' : 'Mariana';
  await page.getByRole('button', { name: new RegExp(nome) })[acao]();
  await page.getByRole('button', { name: /Matemática/ })[acao]();
  await page.getByRole('button', { name: /Dezenas, dinheiro, contas e tabuadas/ })[acao]();
  await expect(page.locator('#tela-matematica-operacoes')).toBeVisible();
}

async function posicionar(page, perfil, indice, adicional = {}) {
  await page.evaluate(
    ({ chave, questaoAtual, dados }) => {
      localStorage.setItem(chave, JSON.stringify({ questaoAtual, ...dados }));
    },
    { chave: CHAVES[perfil], questaoAtual: indice, dados: adicional }
  );
  await page.reload();
  await abrir(page, perfil);
}

async function semViolacoesGraves(page, contexto) {
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
  const graves = resultado.violations.filter((item) =>
    ['serious', 'critical'].includes(item.impact)
  );
  expect(graves, `${contexto}: ${graves.map((item) => item.id).join(', ')}`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    [CHAVES.alice, CHAVES.mariana]
  );
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('cadastra 30 questões semanticamente idênticas com IDs e chaves separados', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ ids }) => {
      function normalizar(revisao) {
        return revisao.questoes.map((questao) => {
          const copia = JSON.parse(JSON.stringify(questao));
          copia.id = copia.id.replace(/^(alice|mariana)-set26-/, 'perfil-set26-');
          return copia;
        });
      }
      const alice = window.MatematicaOperacoes.obterRevisao(ids.alice);
      const mariana = window.MatematicaOperacoes.obterRevisao(ids.mariana);
      return {
        alice: normalizar(alice),
        mariana: normalizar(mariana),
        idsAlice: alice.questoes.map((questao) => questao.id),
        idsMariana: mariana.questoes.map((questao) => questao.id),
        chaveAlice: alice.chaveArmazenamento,
        chaveMariana: mariana.chaveArmazenamento,
        estudoAlice: alice.estudoTabuada,
        estudoMariana: mariana.estudoTabuada,
        registroAlice: window.RegistroRevisoes.obter(ids.alice),
        registroMariana: window.RegistroRevisoes.obter(ids.mariana),
      };
    },
    { ids: IDS }
  );

  expect(dados.alice).toEqual(dados.mariana);
  expect(dados.alice).toHaveLength(30);
  expect(new Set(dados.idsAlice).size).toBe(30);
  expect(new Set(dados.idsMariana).size).toBe(30);
  expect(dados.idsAlice.every((id) => id.startsWith('alice-set26-'))).toBe(true);
  expect(dados.idsMariana.every((id) => id.startsWith('mariana-set26-'))).toBe(true);
  expect(dados.chaveAlice).toBe(CHAVES.alice);
  expect(dados.chaveMariana).toBe(CHAVES.mariana);
  expect(dados.chaveAlice).not.toBe(dados.chaveMariana);
  expect(dados.estudoAlice).toEqual({ aposQuestaoId: 'alice-set26-q24', fatores: [2, 3] });
  expect(dados.estudoMariana).toEqual({
    aposQuestaoId: 'mariana-set26-q24',
    fatores: [2, 3],
  });
  expect(dados.registroAlice.totalEtapas).toBe(30);
  expect(dados.registroMariana.totalEtapas).toBe(30);
  expect(dados.alice[0].itens.map((item) => item.resposta)).toEqual([3, 6, 36]);
  expect(dados.alice[23].itens.map((item) => item.resposta)).toEqual([64, 69, 73, 55]);
  expect(
    dados.alice.slice(24).flatMap((questao) => questao.itens.map((item) => item.resposta))
  ).toEqual([
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 12, 12, 18, 24,
  ]);
});

test('mostra o cartão nos dois perfis e abre a revisão isolada correta', async ({ page }) => {
  for (const perfil of ['alice', 'mariana']) {
    await abrir(page, perfil);
    await expect(page.locator('#operacoes-nome-perfil')).toHaveText(
      perfil === 'alice' ? 'Alice' : 'Mariana'
    );
    await expect(page.getByText('Questão 1 de 30', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leia o material dourado' })).toBeVisible();
    expect(await page.evaluate(() => window.MatematicaOperacoes.obterAtiva().id)).toBe(IDS[perfil]);
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }
});

test('valida os modelos lógicos de material dourado, sequências, vizinhos, ábaco e dinheiro', async ({
  page,
}) => {
  await abrir(page, 'alice');
  await expect(page.locator('.apoio-base-dez')).toHaveAttribute('data-modelo-total', '36');
  await expect(page.locator('.apoio-base-dez .barra-dez')).toHaveCount(3);
  await expect(page.locator('.apoio-base-dez .cubinho-unidade')).toHaveCount(6);

  await posicionar(page, 'alice', 2);
  expect(await page.locator('.celula-sequencia').allTextContents()).toEqual([
    '40',
    '?',
    '42',
    '?',
    '44',
    '45',
    '?',
    '47',
    '?',
    '49',
  ]);
  const campos40 = page.locator('[data-item-operacao]');
  for (const [indice, valor] of ['41', '43', '46', '48'].entries()) {
    await campos40.nth(indice).fill(valor);
  }
  await page.reload();
  await abrir(page, 'alice');
  for (const [indice, valor] of ['41', '43', '46', '48'].entries()) {
    await expect(page.locator('[data-item-operacao]').nth(indice)).toHaveValue(valor);
  }

  await posicionar(page, 'alice', 3);
  expect(await page.locator('.celula-sequencia').allTextContents()).toEqual([
    '50',
    '51',
    '?',
    '53',
    '?',
    '55',
    '56',
    '57',
    '?',
    '59',
  ]);

  await posicionar(page, 'alice', 4);
  await expect(page.locator('.linha-vizinhos')).toHaveCount(3);
  await expect(page.locator('.linha-vizinhos').first()).toHaveAttribute('data-alvo-vizinhos', '44');
  await expect(page.locator('.linha-vizinhos').first().locator('.vizinho-anterior')).toBeVisible();
  await expect(page.locator('.linha-vizinhos').first().locator('.vizinho-posterior')).toBeVisible();

  await posicionar(page, 'alice', 5);
  await expect(page.locator('[data-ordem-abaco="D"] .peca-abaco')).toHaveCount(5);
  await expect(page.locator('[data-ordem-abaco="U"] .peca-abaco')).toHaveCount(4);
  await expect(page.locator('.abaco-du')).toHaveAttribute('data-modelo-total', '54');

  await posicionar(page, 'alice', 6);
  expect(
    await page
      .locator('.ficha-dinheiro')
      .evaluateAll((fichas) => fichas.map((f) => f.dataset.valorFicha))
  ).toEqual(['10', '10', '2', '2']);
  await expect(page.locator('.fichas-dinheiro')).toHaveAttribute('data-modelo-total', '24');
});

test('valida formar dez, D/U, decomposição e os dois reagrupamentos sem antecipar respostas', async ({
  page,
}) => {
  await posicionar(page, 'mariana', 10);
  await expect(page.locator('[data-peca-azul]')).toHaveCount(8);
  await expect(page.locator('[data-peca-amarela-usada]')).toHaveCount(2);
  await expect(page.locator('[data-peca-amarela-restante]')).toHaveCount(5);
  await expect(page.locator('.formando-dezena')).toHaveAttribute('data-grupo-b', '7');
  await expect(page.getByText('15', { exact: true })).toHaveCount(0);

  await posicionar(page, 'mariana', 11);
  const tabelaAdicao = page.getByRole('table', {
    name: 'Conta organizada em dezenas e unidades',
  });
  await expect(tabelaAdicao.locator('thead th')).toHaveText(['', 'D', 'U']);
  await expect(tabelaAdicao.locator('tbody tr').nth(0).locator('td')).toHaveText(['', '2', '4']);
  await expect(tabelaAdicao.locator('tbody tr').nth(1).locator('th')).toHaveText('+');
  await expect(tabelaAdicao.locator('tbody tr').nth(1).locator('td')).toHaveText(['1', '5']);

  await posicionar(page, 'mariana', 13);
  await expect(page.locator('[data-parcela="26"] [data-dezena]')).toHaveText('20');
  await expect(page.locator('[data-parcela="26"] [data-unidade]')).toHaveText('6');
  await expect(page.locator('[data-parcela="42"] [data-dezena]')).toHaveText('40');
  await expect(page.locator('[data-parcela="42"] [data-unidade]')).toHaveText('2');
  await expect(page.getByText('68', { exact: true })).toHaveCount(0);

  await posicionar(page, 'mariana', 15);
  const adicao = page.locator('.adicao-reagrupamento');
  await expect(adicao).toHaveAttribute('data-primeira-parcela', '27');
  await expect(adicao).toHaveAttribute('data-segunda-parcela', '16');
  await expect(adicao).toHaveAttribute('data-total-unidades', '13');
  await expect(adicao).toHaveAttribute('data-troca-unidades', '10');
  await expect(page.getByText('43', { exact: true })).toHaveCount(0);

  await posicionar(page, 'mariana', 17);
  const tabelaSubtracao = page.getByRole('table', {
    name: 'Conta organizada em dezenas e unidades',
  });
  await expect(tabelaSubtracao.locator('tbody tr').nth(0).locator('td')).toHaveText(['', '5', '7']);
  await expect(tabelaSubtracao.locator('tbody tr').nth(1).locator('th')).toHaveText('−');
  await expect(tabelaSubtracao.locator('tbody tr').nth(1).locator('td')).toHaveText(['2', '3']);

  await posicionar(page, 'mariana', 19);
  const troca = page.locator('.troca-subtracao');
  await expect(troca).toHaveAttribute('data-valor-inicial', '72');
  await expect(troca).toHaveAttribute('data-dezenas-iniciais', '7');
  await expect(troca).toHaveAttribute('data-unidades-iniciais', '2');
  await expect(troca).toHaveAttribute('data-dezenas-trocadas', '6');
  await expect(troca).toHaveAttribute('data-unidades-trocadas', '12');
  await expect(troca).toHaveAttribute('data-valor-trocado', '72');
  await expect(page.getByText('34', { exact: true })).toHaveCount(0);

  await posicionar(page, 'mariana', 21);
  await expect(page.locator('.comparacao-dinheiro')).toHaveAttribute('data-valor-disponivel', '28');
  await expect(page.locator('.comparacao-dinheiro')).toHaveAttribute('data-preco', '36');
  await expect(page.getByText('8', { exact: true })).toHaveCount(0);
});

test('mantém erro recuperável, todos os campos editáveis, ponto único e persistência', async ({
  page,
}) => {
  await abrir(page, 'alice');
  const inputs = page.locator('[data-item-operacao]');
  for (const [indice, valor] of ['3', '6', '35'].entries()) await inputs.nth(indice).fill(valor);
  await inputs.nth(2).press('Enter');
  await expect(inputs.nth(2)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();
  await expect(page.locator('#operacoes-pontos')).toHaveText('0 de 30');

  await inputs.nth(2).fill('36');
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();
  await expect(page.locator('#operacoes-pontos')).toHaveText('1 de 30');
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(page.locator('#operacoes-pontos')).toHaveText('1 de 30');
  await page.locator('#operacoes-proxima').click();
  await page.locator('#operacoes-voltar').click();
  await expect(inputs.nth(2)).toHaveValue('36');

  await page.reload();
  await abrir(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Leia o material dourado' })).toBeVisible();
  await expect(page.locator('[data-item-operacao]').nth(2)).toHaveValue('36');
  await expect(page.locator('#operacoes-pontos')).toHaveText('1 de 30');
});

test('mostra somente tabuadas 2 e 3 após Q24 e bloqueia a reabertura desde Q25', async ({
  page,
}) => {
  const q24 = 'alice-set26-q24';
  await posicionar(page, 'alice', 23, {
    respostas: { [q24]: { du: '64', anterior: '69', adicao: '73', subtracao: '55' } },
    corrigidas: { [q24]: true },
    pontuadas: { [q24]: true },
  });
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Tabuada de 2 e 3' })).toBeVisible();
  await expect(page.getByText('Estudo: tabuada de 2 e 3', { exact: true })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Tabuada do 1' })).toHaveCount(0);
  for (const fator of [2, 3]) {
    await expect(
      page.getByRole('table', { name: `Tabuada do ${fator}` }).locator('tbody tr')
    ).toHaveCount(10);
  }
  await expect(page.getByText('2 × 1', { exact: true })).toBeVisible();
  await expect(page.getByText('3 × 10', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Já estudei/ }).click();
  await expect(page.getByRole('heading', { name: 'Tabuada do 2: começo' })).toBeVisible();
  await expect(page.getByText('Questão 25 de 30', { exact: true })).toBeVisible();
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Mini simulado antes da tabuada' })).toBeVisible();
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Tabuada do 2: começo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 2 e 3' })).toHaveCount(0);

  await page.reload();
  await abrir(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Tabuada do 2: começo' })).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrir(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Tabuada do 2: começo' })).toBeVisible();
  const estado = await page.evaluate((id) => window.MatematicaOperacoes.obterEstado(id), IDS.alice);
  expect(estado).toMatchObject({ questaoAtual: 24, estudoAberto: false, estudoConcluido: true });
});

test('conclui Q25–Q30, chega a 30 pontos e limpa só a chave ativa reabrindo o estudo', async ({
  page,
}) => {
  await page.evaluate(
    ({ id, chave, chaveIrma, chaveAntiga }) => {
      const revisao = window.MatematicaOperacoes.obterRevisao(id);
      const anteriores = revisao.questoes.slice(0, 29);
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 29,
          estudoConcluido: true,
          corrigidas: Object.fromEntries(anteriores.map((questao) => [questao.id, true])),
          pontuadas: Object.fromEntries(anteriores.map((questao) => [questao.id, true])),
        })
      );
      localStorage.setItem(chaveIrma, JSON.stringify({ preservada: 'mariana' }));
      localStorage.setItem(chaveAntiga, JSON.stringify({ preservada: 'rodada-antiga' }));
    },
    {
      id: IDS.alice,
      chave: CHAVES.alice,
      chaveIrma: CHAVES.mariana,
      chaveAntiga: CHAVE_ANTIGA,
    }
  );
  await page.reload();
  await abrir(page, 'alice');
  const respostas = ['12', '12', '18', '24'];
  for (const [indice, valor] of respostas.entries()) {
    await page.locator('[data-item-operacao]').nth(indice).fill(valor);
  }
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(page.locator('#operacoes-pontos')).toHaveText('30 de 30');
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(page.locator('#operacoes-pontos')).toHaveText('30 de 30');
  await page.getByRole('button', { name: 'Concluir atividade →' }).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await expect(page.getByText('30 questões concluídas', { exact: true })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar esta atividade de Matemática' }).click();
  const armazenados = await page.evaluate(
    ({ alice, mariana, antiga }) => ({
      alice: localStorage.getItem(alice),
      mariana: localStorage.getItem(mariana),
      antiga: localStorage.getItem(antiga),
    }),
    { alice: CHAVES.alice, mariana: CHAVES.mariana, antiga: CHAVE_ANTIGA }
  );
  expect(armazenados.alice).toBeNull();
  expect(armazenados.mariana).toContain('mariana');
  expect(armazenados.antiga).toContain('rodada-antiga');
  await expect(page.getByText('Questão 1 de 30', { exact: true })).toBeVisible();

  const q24 = 'alice-set26-q24';
  await posicionar(page, 'alice', 23, {
    respostas: { [q24]: { du: '64', anterior: '69', adicao: '73', subtracao: '55' } },
    corrigidas: { [q24]: true },
    pontuadas: { [q24]: true },
  });
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Tabuada de 2 e 3' })).toBeVisible();
});

test('funciona por teclado e toque, sem overflow, erros ou falhas graves de axe e por file', async ({
  browser,
}) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.goto(CAMINHO);
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    [CHAVES.alice, CHAVES.mariana]
  );
  await page.reload();
  await abrir(page, 'mariana', 'tap');
  const inputs = page.locator('[data-item-operacao]');
  await inputs.nth(0).fill('3');
  await inputs.nth(1).fill('6');
  await inputs.nth(2).fill('36');
  await inputs.nth(2).press('Enter');
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await semViolacoesGraves(page, 'Questão visual no celular');
  expect(erros).toEqual([]);

  const arquivo = pathToFileURL(path.resolve('ambiente_interativo/index.html')).href;
  await page.goto(arquivo);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrir(page, 'alice', 'tap');
  await expect(page.getByRole('heading', { name: 'Leia o material dourado' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);
  await contexto.close();
});
