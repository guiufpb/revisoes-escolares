const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const IDS = {
  alice: 'alice-matematica-contas-e-tabuada',
  mariana: 'mariana-matematica-contas-e-tabuada',
};
const CHAVES = {
  alice: 'revisoesEscolares.alice.matematica.contasETabuada.v1',
  mariana: 'revisoesEscolares.mariana.matematica.contasETabuada.v1',
};
const CHAVE_ANTIGA_ALICE = 'revisoesEscolares.alice.matematica.contasDiaADia.v1';
const CHAVE_ANTIGA_MARIANA = 'revisoesEscolares.mariana.matematica.contasDiaADia.v1';

async function abrirAtividade(page, perfil) {
  const nome = perfil === 'alice' ? 'Alice' : 'Mariana';
  await page.getByRole('button', { name: new RegExp(nome) }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Contas e tabuada/ }).click();
  await expect(page.locator('#tela-matematica-operacoes')).toBeVisible();
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

async function posicionarNaQuestao13(page, perfil) {
  await page.evaluate(
    ({ chave, id }) => {
      const revisao = window.MatematicaOperacoes.obterRevisao(id);
      const questao = revisao.questoes[12];
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 12,
          corrigidas: { [questao.id]: true },
          pontuadas: { [questao.id]: true },
          respostas: { [questao.id]: '55' },
        })
      );
    },
    { chave: CHAVES[perfil], id: IDS[perfil] }
  );
  await page.reload();
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    [CHAVES.alice, CHAVES.mariana]
  );
  await page.reload();
});

test('cadastra 18 questões iguais por perfil com progressão e chaves independentes', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ ids }) => {
      function simplificar(revisao) {
        return revisao.questoes.map((questao) => ({
          faixa: questao.faixa,
          enunciado: questao.enunciado,
          operacao: questao.operacao || null,
          resposta: questao.resposta == null ? null : questao.resposta,
          itens: (questao.itens || []).map((item) => [item.operacao, item.resposta]),
        }));
      }
      const alice = window.MatematicaOperacoes.obterRevisao(ids.alice);
      const mariana = window.MatematicaOperacoes.obterRevisao(ids.mariana);
      return {
        alice: simplificar(alice),
        mariana: simplificar(mariana),
        estudoAlice: alice.estudoTabuada,
        estudoMariana: mariana.estudoTabuada,
        registroAlice: window.RegistroRevisoes.obter(ids.alice),
        registroMariana: window.RegistroRevisoes.obter(ids.mariana),
      };
    },
    { ids: IDS }
  );

  expect(dados.alice).toEqual(dados.mariana);
  expect(dados.alice).toHaveLength(18);
  expect(dados.alice.slice(0, 5).every((questao) => questao.faixa === 'unidades')).toBe(true);
  expect(dados.alice.slice(5, 13).every((questao) => questao.faixa === 'dezenas')).toBe(true);
  expect(dados.alice.slice(13).every((questao) => questao.faixa === 'tabuada')).toBe(true);
  expect(dados.alice.slice(13).every((questao) => questao.itens.length === 4)).toBe(true);
  expect(dados.alice[5].operacao).toBe('13 + 19 = ?');
  expect(dados.alice[5].resposta).toBe(32);
  expect(dados.estudoAlice.aposQuestaoId).toBe('alice-d13');
  expect(dados.estudoMariana.aposQuestaoId).toBe('mariana-d13');
  expect(dados.registroAlice.totalEtapas).toBe(18);
  expect(dados.registroMariana.totalEtapas).toBe(18);
  expect(dados.registroAlice.chaveArmazenamento).toBe(CHAVES.alice);
  expect(dados.registroMariana.chaveArmazenamento).toBe(CHAVES.mariana);

  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('button', { name: /Contas e tabuada/ })).toContainText('18 questões');
});

test('a nova rodada permite errar, corrigir, avançar, voltar e recarregar', async ({ page }) => {
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Estrelas brilhantes' })).toBeVisible();
  await expect(page.getByText('Questão 1 de 18')).toBeVisible();
  const input = page.locator('#operacoes-conteudo input');
  await input.fill('7');
  await input.press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText('Tente outra vez');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();

  await input.fill('8');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.retorno-operacoes')).toContainText('2 mais 6 é igual a 8');
  await page.locator('#operacoes-proxima').click();
  await page.locator('#operacoes-conteudo input').fill('5');

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Maçãs no cesto' })).toBeVisible();
  await expect(page.locator('#operacoes-conteudo input')).toHaveValue('5');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Estrelas brilhantes' })).toBeVisible();
  await expect(page.locator('#operacoes-conteudo input')).toHaveValue('8');
});

test('mostra as tabuadas completas depois da questão 13 e restaura o estudo ao recarregar', async ({
  page,
}) => {
  await posicionarNaQuestao13(page, 'alice');
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Cartões distribuídos' })).toBeVisible();
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1 e 2' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Tabuada do 1' }).locator('tbody tr')).toHaveCount(
    10
  );
  await expect(page.getByRole('table', { name: 'Tabuada do 2' }).locator('tbody tr')).toHaveCount(
    10
  );
  await expect(page.getByText('2 × 10', { exact: true })).toBeVisible();
  await expect(page.getByText('20', { exact: true })).toBeVisible();
  await expect(page.locator('#operacoes-proxima')).toBeHidden();

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Tabuada de 1 e 2' })).toBeVisible();
  const estado = await page.evaluate((id) => window.MatematicaOperacoes.obterEstado(id), IDS.alice);
  expect(estado.estudoAberto).toBe(true);
  expect(estado.estudoConcluido).toBe(false);
});

test('bloqueia definitivamente a tabela quando começam as multiplicações', async ({ page }) => {
  await posicionarNaQuestao13(page, 'mariana');
  await abrirAtividade(page, 'mariana');
  await page.locator('#operacoes-proxima').click();
  await page.getByRole('button', { name: /Já estudei/ }).click();
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  await expect(page.getByText('Questão 14 de 18')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1 e 2' })).toBeHidden();

  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Cartões distribuídos' })).toBeVisible();
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1 e 2' })).toBeHidden();

  await page.reload();
  await abrirAtividade(page, 'mariana');
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  const estado = await page.evaluate(
    (id) => window.MatematicaOperacoes.obterEstado(id),
    IDS.mariana
  );
  expect(estado.estudoAberto).toBe(false);
  expect(estado.estudoConcluido).toBe(true);
});

test('corrige vários resultados na mesma questão e persiste várias digitações', async ({
  page,
}) => {
  await page.evaluate(
    ({ chave }) =>
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: 13, estudoConcluido: true })),
    { chave: CHAVES.alice }
  );
  await page.reload();
  await abrirAtividade(page, 'alice');
  const inputs = page.locator('[data-item-multiplicacao]');
  for (const [indice, valor] of ['2', '5', '8', '9'].entries()) {
    await inputs.nth(indice).fill(valor);
  }
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(inputs.nth(3)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();

  await inputs.nth(3).fill('10');
  await inputs.nth(3).press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText('tabuada do 1 estão corretas');
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();
  await page.locator('#operacoes-proxima').click();
  const novosInputs = page.locator('[data-item-multiplicacao]');
  await novosInputs.nth(0).fill('2');
  await novosInputs.nth(1).fill('4');

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Dobrar com a tabuada do 2' })).toBeVisible();
  await expect(page.locator('[data-item-multiplicacao]').nth(0)).toHaveValue('2');
  await expect(page.locator('[data-item-multiplicacao]').nth(1)).toHaveValue('4');
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1 e 2' })).toBeHidden();
});

test('conclui e limpa somente a nova atividade e o perfil ativos', async ({ page }) => {
  await page.evaluate(
    ({ ids, chaves, antigaAlice, antigaMariana }) => {
      const revisao = window.MatematicaOperacoes.obterRevisao(ids.mariana);
      const anteriores = revisao.questoes.slice(0, 17);
      localStorage.setItem(
        chaves.mariana,
        JSON.stringify({
          questaoAtual: 17,
          estudoConcluido: true,
          corrigidas: Object.fromEntries(anteriores.map((questao) => [questao.id, true])),
          pontuadas: Object.fromEntries(anteriores.map((questao) => [questao.id, true])),
        })
      );
      localStorage.setItem(chaves.alice, JSON.stringify({ marcador: 'alice-nova-preservada' }));
      localStorage.setItem(antigaAlice, JSON.stringify({ marcador: 'alice-antiga-preservada' }));
      localStorage.setItem(
        antigaMariana,
        JSON.stringify({ marcador: 'mariana-antiga-preservada' })
      );
    },
    {
      ids: IDS,
      chaves: CHAVES,
      antigaAlice: CHAVE_ANTIGA_ALICE,
      antigaMariana: CHAVE_ANTIGA_MARIANA,
    }
  );
  await page.reload();
  await abrirAtividade(page, 'mariana');
  const inputs = page.locator('[data-item-multiplicacao]');
  for (const [indice, valor] of ['20', '4', '14', '10'].entries()) {
    await inputs.nth(indice).fill(valor);
  }
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await page.getByRole('button', { name: 'Concluir atividade →' }).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.getByText('18 questões concluídas', { exact: true })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar esta atividade de Matemática' }).click();
  const valores = await page.evaluate(
    ({ novaMariana, novaAlice, antigaAlice, antigaMariana }) => ({
      novaMariana: localStorage.getItem(novaMariana),
      novaAlice: localStorage.getItem(novaAlice),
      antigaAlice: localStorage.getItem(antigaAlice),
      antigaMariana: localStorage.getItem(antigaMariana),
    }),
    {
      novaMariana: CHAVES.mariana,
      novaAlice: CHAVES.alice,
      antigaAlice: CHAVE_ANTIGA_ALICE,
      antigaMariana: CHAVE_ANTIGA_MARIANA,
    }
  );
  expect(valores.novaMariana).toBeNull();
  expect(valores.novaAlice).toContain('alice-nova-preservada');
  expect(valores.antigaAlice).toContain('alice-antiga-preservada');
  expect(valores.antigaMariana).toContain('mariana-antiga-preservada');
  await expect(page.getByText('Questão 1 de 18')).toBeVisible();
});

test('tabela e multiplicações são acessíveis no celular e funcionam em file local', async ({
  page,
}) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await posicionarNaQuestao13(page, 'alice');
  await abrirAtividade(page, 'alice');
  await page.locator('#operacoes-proxima').click();
  await conferirAcessibilidade(page, 'Tabela da tabuada no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: /Já estudei/ }).click();
  await conferirAcessibilidade(page, 'Multiplicações no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);

  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirAtividade(page, 'mariana');
  await expect(page.getByText('Questão 1 de 18')).toBeVisible();
});
