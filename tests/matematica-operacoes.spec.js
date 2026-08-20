const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE_ALICE = 'revisoesEscolares.alice.matematica.contasDiaADia.v1';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.contasDiaADia.v1';
const CHAVE_REVISAO_AMPLA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_GRAMATICA = 'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1';

async function abrirOperacoes(page, perfil) {
  const nome = perfil === 'alice' ? 'Alice' : 'Mariana';
  await page.getByRole('button', { name: new RegExp(nome) }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Contas do dia a dia/ }).click();
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

test('cadastra sequências diferentes de 15 e 20 questões na progressão pedida', async ({
  page,
}) => {
  const dados = await page.evaluate(() => {
    const alice = window.MatematicaOperacoes.obterRevisao('alice-matematica-contas-dia-a-dia');
    const mariana = window.MatematicaOperacoes.obterRevisao('mariana-matematica-contas-dia-a-dia');
    return {
      alice: alice.questoes,
      mariana: mariana.questoes,
      registroAlice: window.RegistroRevisoes.obter('alice-matematica-contas-dia-a-dia'),
      registroMariana: window.RegistroRevisoes.obter('mariana-matematica-contas-dia-a-dia'),
    };
  });

  expect(dados.alice).toHaveLength(15);
  expect(dados.mariana).toHaveLength(20);
  expect(dados.alice.slice(0, 5).every((item) => item.faixa === 'unidades')).toBe(true);
  expect(dados.mariana.slice(0, 5).every((item) => item.faixa === 'unidades')).toBe(true);
  expect(dados.alice.slice(5).every((item) => item.faixa === 'dezenas')).toBe(true);
  expect(dados.mariana.slice(5, 14).every((item) => item.faixa === 'dezenas')).toBe(true);
  expect(dados.mariana.slice(14).every((item) => item.faixa === 'centenas')).toBe(true);
  expect(dados.mariana.slice(14).map((item) => item.resposta)).toEqual([
    20, 300, 50, 700, 101, 108,
  ]);
  const enunciadosAlice = new Set(dados.alice.map((item) => item.enunciado));
  expect(dados.mariana.every((item) => !enunciadosAlice.has(item.enunciado))).toBe(true);
  expect(dados.registroAlice.totalEtapas).toBe(15);
  expect(dados.registroMariana.totalEtapas).toBe(20);
  expect(dados.registroAlice.chaveArmazenamento).toBe(CHAVE_ALICE);
  expect(dados.registroMariana.chaveArmazenamento).toBe(CHAVE_MARIANA);

  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.getByRole('button', { name: /Matemática/ })).toBeVisible();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('button', { name: /Revisão ampla/ })).toBeHidden();
  await expect(page.getByRole('button', { name: /Centenas em ação/ })).toBeHidden();
  await expect(page.getByRole('button', { name: /Contas do dia a dia/ })).toContainText(
    '15 questões'
  );
});

test('Alice pode errar, corrigir, avançar, voltar e recarregar a resposta digitada', async ({
  page,
}) => {
  await abrirOperacoes(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Adesivos coloridos' })).toBeVisible();
  await expect(page.getByText('Questão 1 de 15')).toBeVisible();
  const input = page.locator('#operacoes-conteudo input');
  await expect(input).toHaveAttribute('inputmode', 'numeric');
  await input.fill('6');
  await input.press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText('Tente outra vez');
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();

  await input.fill('7');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.retorno-operacoes')).toContainText('3 mais 4 é igual a 7');
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();
  await page.locator('#operacoes-proxima').click();
  await expect(page.getByRole('heading', { name: 'Morangos do lanche' })).toBeVisible();
  await page.locator('#operacoes-conteudo input').fill('4');

  await page.reload();
  await abrirOperacoes(page, 'alice');
  await expect(page.getByRole('heading', { name: 'Morangos do lanche' })).toBeVisible();
  await expect(page.locator('#operacoes-conteudo input')).toHaveValue('4');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await page.locator('#operacoes-voltar').click();
  await expect(page.getByRole('heading', { name: 'Adesivos coloridos' })).toBeVisible();
  await expect(page.locator('#operacoes-conteudo input')).toHaveValue('7');
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();
});

test('Mariana digita equivalências de centenas e resultados depois de 100', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(chave, JSON.stringify({ questaoAtual: 14 }));
  }, CHAVE_MARIANA);
  await page.reload();
  await abrirOperacoes(page, 'mariana');
  await expect(page.getByRole('heading', { name: 'Centenas em dezenas' })).toBeVisible();
  await expect(page.getByText('1 centena')).toBeVisible();
  const input = page.locator('#operacoes-conteudo input');
  await input.fill('19');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('#operacoes-proxima')).toBeDisabled();
  await input.fill('20');
  await input.press('Enter');
  await expect(page.locator('.retorno-operacoes')).toContainText('2 centenas são 20 dezenas');
  await expect(page.locator('#operacoes-proxima')).toBeEnabled();

  await page.evaluate((chave) => {
    const atual = JSON.parse(localStorage.getItem(chave));
    atual.questaoAtual = 18;
    localStorage.setItem(chave, JSON.stringify(atual));
  }, CHAVE_MARIANA);
  await page.reload();
  await abrirOperacoes(page, 'mariana');
  await expect(page.getByRole('heading', { name: 'O número depois de 100' })).toBeVisible();
  await expect(page.getByText('100 + 1 = ?', { exact: true })).toBeVisible();
  await page.locator('#operacoes-conteudo input').fill('101');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.locator('.retorno-operacoes')).toContainText('100 mais 1 é igual a 101');
});

test('conclui Mariana uma vez e limpa somente a atividade ativa', async ({ page }) => {
  await page.evaluate(
    ({ chave, alice, ampla, gramatica }) => {
      const revisao = window.MatematicaOperacoes.obterRevisao(
        'mariana-matematica-contas-dia-a-dia'
      );
      const anteriores = revisao.questoes.slice(0, 19);
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 19,
          corrigidas: Object.fromEntries(anteriores.map((item) => [item.id, true])),
          pontuadas: Object.fromEntries(anteriores.map((item) => [item.id, true])),
        })
      );
      localStorage.setItem(alice, JSON.stringify({ marcador: 'alice-preservada' }));
      localStorage.setItem(ampla, JSON.stringify({ marcador: 'ampla-preservada' }));
      localStorage.setItem(gramatica, JSON.stringify({ marcador: 'gramatica-preservada' }));
    },
    {
      chave: CHAVE_MARIANA,
      alice: CHAVE_ALICE,
      ampla: CHAVE_REVISAO_AMPLA,
      gramatica: CHAVE_GRAMATICA,
    }
  );
  await page.reload();
  await abrirOperacoes(page, 'mariana');
  await expect(page.getByText('Questão 20 de 20')).toBeVisible();
  await page.locator('#operacoes-conteudo input').fill('108');
  await page.getByRole('button', { name: 'Conferir' }).click();
  await page.getByRole('button', { name: 'Concluir atividade →' }).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await expect(page.getByText('20 questões concluídas', { exact: true })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar esta atividade de Matemática' }).click();
  const valores = await page.evaluate(
    ({ chave, alice, ampla, gramatica }) => ({
      operacoes: localStorage.getItem(chave),
      alice: localStorage.getItem(alice),
      ampla: localStorage.getItem(ampla),
      gramatica: localStorage.getItem(gramatica),
    }),
    {
      chave: CHAVE_MARIANA,
      alice: CHAVE_ALICE,
      ampla: CHAVE_REVISAO_AMPLA,
      gramatica: CHAVE_GRAMATICA,
    }
  );
  expect(valores.operacoes).toBeNull();
  expect(valores.alice).toContain('alice-preservada');
  expect(valores.ampla).toContain('ampla-preservada');
  expect(valores.gramatica).toContain('gramatica-preservada');
  await expect(page.getByText('Questão 1 de 20')).toBeVisible();
});

test('é acessível no celular e abre pelo bundle em file local', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await abrirOperacoes(page, 'alice');
  await conferirAcessibilidade(page, 'Operações de Alice no celular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(erros).toEqual([]);

  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirOperacoes(page, 'mariana');
  await expect(page.getByText('Questão 1 de 20')).toBeVisible();
});
