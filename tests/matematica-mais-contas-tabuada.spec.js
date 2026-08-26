const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const IDS = {
  alice: 'alice-matematica-mais-contas-e-tabuada',
  mariana: 'mariana-matematica-mais-contas-e-tabuada',
};
const CHAVES = {
  alice: 'revisoesEscolares.alice.matematica.maisContasETabuada.v1',
  mariana: 'revisoesEscolares.mariana.matematica.maisContasETabuada.v1',
};
const CHAVES_RODADA_ANTERIOR = {
  alice: 'revisoesEscolares.alice.matematica.contasETabuada.v1',
  mariana: 'revisoesEscolares.mariana.matematica.contasETabuada.v1',
};

async function abrirAtividade(page, perfil) {
  const nome = perfil === 'alice' ? 'Alice' : 'Mariana';
  await page.getByRole('button', { name: new RegExp(nome) }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Mais contas e tabuada/ }).click();
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

test('cadastra outra rodada idêntica com números novos, tabuada até 3 e chaves próprias', async ({
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
      const anterior = window.MatematicaOperacoes.obterRevisao('alice-matematica-contas-e-tabuada');
      return {
        alice: simplificar(alice),
        mariana: simplificar(mariana),
        anterior: simplificar(anterior),
        estudoAlice: alice.estudoTabuada,
        estudoMariana: mariana.estudoTabuada,
        registroAlice: window.RegistroRevisoes.obter(ids.alice),
        registroMariana: window.RegistroRevisoes.obter(ids.mariana),
      };
    },
    { ids: IDS }
  );

  expect(dados.alice).toEqual(dados.mariana);
  expect(dados.alice).not.toEqual(dados.anterior);
  expect(dados.alice).toHaveLength(18);
  expect(dados.alice.slice(0, 5).every((questao) => questao.faixa === 'unidades')).toBe(true);
  expect(dados.alice.slice(5, 13).every((questao) => questao.faixa === 'dezenas')).toBe(true);
  expect(dados.alice.slice(13).every((questao) => questao.faixa === 'tabuada')).toBe(true);
  expect(dados.alice.slice(13).every((questao) => questao.itens.length === 4)).toBe(true);
  expect(dados.alice[5].operacao).toBe('16 + 17 = ?');
  expect(dados.alice[5].resposta).toBe(33);
  expect(dados.alice[15].itens).toContainEqual(['3 × 4 =', 12]);
  expect(dados.alice[15].itens).toContainEqual(['3 × 8 =', 24]);
  expect(dados.estudoAlice).toEqual({
    aposQuestaoId: 'alice-nova-d13',
    fatores: [1, 2, 3],
  });
  expect(dados.estudoMariana).toEqual({
    aposQuestaoId: 'mariana-nova-d13',
    fatores: [1, 2, 3],
  });
  expect(dados.registroAlice.totalEtapas).toBe(18);
  expect(dados.registroMariana.totalEtapas).toBe(18);
  expect(dados.registroAlice.chaveArmazenamento).toBe(CHAVES.alice);
  expect(dados.registroMariana.chaveArmazenamento).toBe(CHAVES.mariana);

  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('button', { name: /Mais contas e tabuada/ })).toContainText(
    'tabuadas do 1, 2 e 3'
  );
});

test('permite errar, corrigir, avançar, voltar e recarregar sem afetar a rodada anterior', async ({
  page,
}) => {
  await page.evaluate(
    (chave) => localStorage.setItem(chave, JSON.stringify({ marcador: 'rodada-anterior' })),
    CHAVES_RODADA_ANTERIOR.alice
  );
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Botões coloridos' })).toBeVisible();
  const input = page.locator('#operacoes-conteudo input');
  await input.fill('6');
  await input.press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText('Tente outra vez');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();

  await input.fill('7');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.retorno-operacoes')).toContainText('3 mais 4 é igual a 7');
  await page.locator('#operacoes-proxima').click();
  await page.locator('#operacoes-conteudo input').fill('3');

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Biscoitos no prato' })).toBeVisible();
  await expect(page.locator('#operacoes-conteudo input')).toHaveValue('3');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Botões coloridos' })).toBeVisible();
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVES_RODADA_ANTERIOR.alice)
  ).toContain('rodada-anterior');
});

test('mostra as tabuadas completas de 1, 2 e 3 e restaura o estudo antes do início', async ({
  page,
}) => {
  await posicionarNaQuestao13(page, 'alice');
  await abrirAtividade(page, 'alice');
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1, 2 e 3' })).toBeVisible();
  await expect(page.getByText('Estudo: tabuada de 1, 2 e 3', { exact: true })).toBeVisible();
  for (const fator of [1, 2, 3]) {
    await expect(
      page.getByRole('table', { name: `Tabuada do ${fator}` }).locator('tbody tr')
    ).toHaveCount(10);
  }
  await expect(page.getByText('3 × 10', { exact: true })).toBeVisible();
  await expect(page.getByText('30', { exact: true })).toBeVisible();
  await expect(page.locator('#operacoes-proxima')).toBeHidden();

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Tabuada de 1, 2 e 3' })).toBeVisible();
  const estado = await page.evaluate((id) => window.MatematicaOperacoes.obterEstado(id), IDS.alice);
  expect(estado.estudoAberto).toBe(true);
  expect(estado.estudoConcluido).toBe(false);
});

test('não reabre a tabela depois que começam as multiplicações', async ({ page }) => {
  await posicionarNaQuestao13(page, 'mariana');
  await abrirAtividade(page, 'mariana');
  await page.locator('#operacoes-proxima').click();
  await page.getByRole('button', { name: /Já estudei/ }).click();
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  await expect(page.getByText('Questão 14 de 18')).toBeVisible();

  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Cartões entregues' })).toBeVisible();
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Multiplicar por 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1, 2 e 3' })).toBeHidden();

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

test('corrige e persiste vários resultados, incluindo multiplicações por 3', async ({ page }) => {
  await page.evaluate(
    ({ chave }) =>
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: 15, estudoConcluido: true })),
    { chave: CHAVES.alice }
  );
  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Três grupos iguais' })).toBeVisible();
  const inputs = page.locator('[data-item-multiplicacao]');
  for (const [indice, valor] of ['3', '12', '18', '23'].entries()) {
    await inputs.nth(indice).fill(valor);
  }
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await expect(inputs.nth(3)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();

  await inputs.nth(3).fill('24');
  await inputs.nth(3).press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText(
    'multiplicações por 3 estão corretas'
  );
  await page.locator('#operacoes-proxima').click();
  const novosInputs = page.locator('[data-item-multiplicacao]');
  await novosInputs.nth(0).fill('8');
  await novosInputs.nth(1).fill('8');

  await page.reload();
  await abrirAtividade(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Tabuadas misturadas' })).toBeVisible();
  await expect(page.locator('[data-item-multiplicacao]').nth(0)).toHaveValue('8');
  await expect(page.locator('[data-item-multiplicacao]').nth(1)).toHaveValue('8');
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Três grupos iguais' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tabuada de 1, 2 e 3' })).toBeHidden();
});

test('conclui e limpa somente a nova atividade e o perfil ativos', async ({ page }) => {
  await page.evaluate(
    ({ ids, chaves, anteriores }) => {
      const revisao = window.MatematicaOperacoes.obterRevisao(ids.mariana);
      const questoesAnteriores = revisao.questoes.slice(0, 17);
      localStorage.setItem(
        chaves.mariana,
        JSON.stringify({
          questaoAtual: 17,
          estudoConcluido: true,
          corrigidas: Object.fromEntries(questoesAnteriores.map((questao) => [questao.id, true])),
          pontuadas: Object.fromEntries(questoesAnteriores.map((questao) => [questao.id, true])),
        })
      );
      localStorage.setItem(chaves.alice, JSON.stringify({ marcador: 'alice-preservada' }));
      localStorage.setItem(anteriores.alice, JSON.stringify({ marcador: 'anterior-alice' }));
      localStorage.setItem(anteriores.mariana, JSON.stringify({ marcador: 'anterior-mariana' }));
    },
    { ids: IDS, chaves: CHAVES, anteriores: CHAVES_RODADA_ANTERIOR }
  );
  await page.reload();
  await abrirAtividade(page, 'mariana');
  const inputs = page.locator('[data-item-multiplicacao]');
  for (const [indice, valor] of ['6', '7', '27', '16'].entries()) {
    await inputs.nth(indice).fill(valor);
  }
  await page.getByRole('button', { name: 'Conferir todas' }).click();
  await page.getByRole('button', { name: 'Concluir atividade →' }).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.getByText('18 questões concluídas', { exact: true })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar esta atividade de Matemática' }).click();
  const valores = await page.evaluate(
    ({ novaMariana, novaAlice, anteriores }) => ({
      novaMariana: localStorage.getItem(novaMariana),
      novaAlice: localStorage.getItem(novaAlice),
      anteriorAlice: localStorage.getItem(anteriores.alice),
      anteriorMariana: localStorage.getItem(anteriores.mariana),
    }),
    {
      novaMariana: CHAVES.mariana,
      novaAlice: CHAVES.alice,
      anteriores: CHAVES_RODADA_ANTERIOR,
    }
  );
  expect(valores.novaMariana).toBeNull();
  expect(valores.novaAlice).toContain('alice-preservada');
  expect(valores.anteriorAlice).toContain('anterior-alice');
  expect(valores.anteriorMariana).toContain('anterior-mariana');
  await expect(page.getByText('Questão 1 de 18')).toBeVisible();
});

test('tabelas e multiplicações são acessíveis no celular e funcionam em file local', async ({
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
  await conferirAcessibilidade(page, 'Tabelas de 1, 2 e 3 no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: /Já estudei/ }).click();
  await conferirAcessibilidade(page, 'Multiplicações até 3 no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);

  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirAtividade(page, 'mariana');
  await expect(page.getByText('Questão 1 de 18')).toBeVisible();
});
