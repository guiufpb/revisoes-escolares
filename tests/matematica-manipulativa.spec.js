const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'mariana-matematica-centenas-em-acao';
const CHAVE = 'revisoesEscolares.mariana.matematica.centenasEmAcao.v2';
const CHAVE_ANTIGA = 'revisoesEscolares.mariana.matematica.centenasEmAcao.v1';
const CHAVE_AMPLA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_ALICE = 'revisoesEscolares.alice.ciencias.origemMateriais';

async function abrirHubMariana(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('heading', { name: 'Escolha uma revisão' })).toBeVisible();
}

async function abrirCentenas(page) {
  await abrirHubMariana(page);
  await page.getByRole('button', { name: /Centenas em ação/ }).click();
  await expect(page.locator('#tela-matematica-cena')).toBeVisible();
  await expect(page.locator('#matematica-cena-titulo')).toBeVisible();
}

async function montarCenaIsolada(page, configuracao, estado) {
  await page.evaluate(
    ({ config, salvo }) => {
      if (window.__cenaTeste) window.__cenaTeste.destruir();
      const anterior = document.getElementById('cena-teste-isolada');
      if (anterior) anterior.remove();
      const recipiente = document.createElement('div');
      recipiente.id = 'cena-teste-isolada';
      document.body.appendChild(recipiente);
      window.__cenaTeste = window.CenaMatematica.montar(recipiente, {
        id: 'teste-isolado',
        titulo: 'Cena isolada',
        instrucao: 'Teste reutilizável',
        ...config,
        estado: salvo,
      });
    },
    { config: configuracao, salvo: estado }
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await page.evaluate((chave) => localStorage.removeItem(chave), CHAVE);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('mantém a revisão ampla separada e mostra a nova somente para Mariana', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-matematica')).toBeHidden();
  await expect(page.locator('#abrir-centenas-em-acao')).toBeHidden();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirHubMariana(page);
  await expect(page.getByRole('button', { name: /Revisão ampla/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Centenas em ação/ })).toBeVisible();

  await page.getByRole('button', { name: /Revisão ampla/ }).click();
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  const amplaAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_AMPLA);
  await page.getByRole('button', { name: 'Matemática', exact: true }).click();
  await page.getByRole('button', { name: /Centenas em ação/ }).click();
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_AMPLA)).toBe(amplaAntes);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeTruthy();
});

test('inicia a nova rodada sem apagar o progresso da rodada anterior', async ({ page }) => {
  const progressoAnterior = JSON.stringify({ versao: 1, etapaAtual: 18, finalizada: true });
  await page.evaluate(({ chave, valor }) => localStorage.setItem(chave, valor), {
    chave: CHAVE_ANTIGA,
    valor: progressoAnterior,
  });
  await page.reload();
  await abrirHubMariana(page);
  await expect(page.getByRole('button', { name: /Centenas em ação/ })).toContainText(
    '20 novas etapas'
  );
  await expect(page.getByRole('button', { name: /Centenas em ação/ })).not.toContainText(
    'Concluída'
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ANTIGA)).toBe(
    progressoAnterior
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
});

test('cadastra 20 etapas novas com três ábacos e as três trocas de ordens', async ({ page }) => {
  const resumo = await page.evaluate((id) => {
    const revisao = window.MatematicaRevisoes.listar().find((item) => item.id === id);
    return {
      total: revisao.etapas.length,
      ids: revisao.etapas.map((etapa) => etapa.id),
      abacos: revisao.etapas.filter((etapa) => etapa.cena && etapa.cena.tipo === 'abaco').length,
      trocas: revisao.etapas
        .filter((etapa) => etapa.cena && etapa.cena.trocas)
        .map((etapa) => ({ ordens: etapa.cena.ordens, inicial: etapa.cena.inicial })),
    };
  }, ID);
  expect(resumo.total).toBe(20);
  expect(new Set(resumo.ids).size).toBe(20);
  expect(resumo.abacos).toBe(3);
  expect(resumo.trocas).toEqual([
    { ordens: 'D-U', inicial: { U: 10 } },
    { ordens: 'C-D-U', inicial: { D: 10 } },
    { ordens: 'M-C-D-U', inicial: { C: 10 } },
  ]);
});

test('permite errar, retirar, corrigir, voltar e recarregar na nova rodada', async ({ page }) => {
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();

  await page.locator('[data-math-tool="D"]').click();
  await page.locator('[data-math-drop-click="D"]').click({ position: { x: 8, y: 8 } });
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Observe quantas dezenas');

  await page
    .locator('[data-math-piece][data-order="D"]')
    .dragTo(page.locator('[data-math-remove-zone]'));
  await expect(page.locator('[data-math-piece][data-order="D"]')).toHaveCount(0);
  await page.locator('[data-math-tool="C"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-math-place="C"]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-math-piece][data-order="C"]')).toHaveCount(1);
  await expect(page.locator('[data-math-summary]')).toContainText('100');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).cenas['placa-centena'].quantidades.C,
        CHAVE
      )
    )
    .toBe(1);

  await page.locator('#matematica-cena-proxima').click();
  await expect(page.getByText('Etapa 3 de 20')).toBeVisible();
  await page.locator('#matematica-cena-voltar').click();
  await expect(page.getByText('Etapa 2 de 20')).toBeVisible();
  await expect(page.locator('[data-order="C"]')).toHaveCount(1);
  await expect(page.locator('[data-order="D"]')).toHaveCount(0);
  await page.reload();
  await abrirCentenas(page);
  await expect(page.getByText('Etapa 2 de 20')).toBeVisible();
  await expect(page.locator('[data-order="C"]')).toHaveCount(1);
});

test('executa as três trocas novas dentro da própria revisão', async ({ page }) => {
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();

  const casos = [
    { etapa: 2, troca: 'U-D', origem: 'U', destino: 'D' },
    { etapa: 3, troca: 'D-C', origem: 'D', destino: 'C' },
    { etapa: 17, troca: 'C-M', origem: 'C', destino: 'M' },
  ];
  for (const caso of casos) {
    await page.evaluate((etapa) => window.MatematicaRevisoes.irPara(etapa), caso.etapa);
    await page.locator(`[data-math-exchange="${caso.troca}"]`).click();
    await expect(page.locator(`[data-order="${caso.origem}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-order="${caso.destino}"]`)).toHaveCount(1);
    await page.locator('[data-math-check]').click();
    await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
  }
});

test('pratica montar e ler os três novos ábacos', async ({ page }) => {
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();

  await page.evaluate(() => window.MatematicaRevisoes.irPara(5));
  for (let indice = 0; indice < 8; indice += 1) {
    await page.locator('[data-math-tool="C"]').click();
    await page.locator('[data-math-place="C"]').click();
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await page.evaluate(() => window.MatematicaRevisoes.irPara(6));
  for (const [ordem, quantidade] of [
    ['C', 6],
    ['D', 4],
    ['U', 1],
  ]) {
    for (let indice = 0; indice < quantidade; indice += 1) {
      await page.locator(`[data-math-tool="${ordem}"]`).click();
      await page.locator(`[data-math-place="${ordem}"]`).click();
    }
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await page.evaluate(() => window.MatematicaRevisoes.irPara(7));
  await page.locator('[data-math-answer="307"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
});

test('renderiza e navega por todas as 20 etapas até o encerramento', async ({ page }) => {
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await expect(page.getByText('Etapa 2 de 20')).toBeVisible();

  for (let indice = 1; indice < 20; indice += 1) {
    await page.evaluate((destino) => window.MatematicaRevisoes.irPara(destino), indice);
    await expect(page.locator('#matematica-cena-titulo')).toBeVisible();
    if (indice < 19) await expect(page.locator('#recipiente-cena-matematica')).toBeVisible();
  }

  await expect(
    page.getByRole('heading', { name: /Nova missão das centenas concluída/ })
  ).toBeVisible();
  await expect(page.locator('#matematica-cena-proxima')).toBeHidden();
  expect(
    await page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)).finalizada, CHAVE)
  ).toBe(true);
});

test('suporta U, D-U, C-D-U e M-C-D-U sem colunas vazias ocultas', async ({ page }) => {
  for (const ordens of ['U', 'D-U', 'C-D-U', 'M-C-D-U']) {
    await montarCenaIsolada(page, { tipo: 'quadro', ordens, valorAlvo: 0 });
    const esperadas = ordens.split('-');
    await expect(page.locator('#cena-teste-isolada .coluna-ordem')).toHaveCount(esperadas.length);
    await expect
      .poll(() => page.locator('#cena-teste-isolada .coluna-ordem > strong').allTextContents())
      .toEqual(esperadas);
  }

  await montarCenaIsolada(page, {
    tipo: 'quadro',
    ordens: 'U',
    valorAlvo: 4,
    limites: { U: 6 },
  });
  await expect(page.locator('#cena-teste-isolada [data-math-tool="U"]')).toBeVisible();
  expect(
    await page.evaluate(() => Object.keys(window.__cenaTeste.obterEstado().quantidades))
  ).toEqual(['M', 'C', 'D', 'U']);
});

test('adiciona, move e remove peças com Pointer Events', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'quadro',
    ordens: 'D-U',
    valorAlvo: 1,
    limites: { D: 9, U: 9 },
  });
  const ferramenta = page.locator('#cena-teste-isolada [data-math-tool="D"]');
  const destinoD = page.locator('#cena-teste-isolada [data-math-drop-order="D"]');
  await ferramenta.dragTo(destinoD);
  await expect(page.locator('#cena-teste-isolada [data-order="D"]')).toHaveCount(1);

  const pecaD = page.locator('#cena-teste-isolada [data-order="D"]');
  const destinoU = page.locator('#cena-teste-isolada [data-math-drop-order="U"]');
  await pecaD.dragTo(destinoU);
  await expect(page.locator('#cena-teste-isolada [data-order="D"]')).toHaveCount(0);
  await expect(page.locator('#cena-teste-isolada [data-order="U"]')).toHaveCount(1);

  await page
    .locator('#cena-teste-isolada [data-order="U"]')
    .dragTo(page.locator('#cena-teste-isolada [data-math-remove-zone]'));
  await expect(page.locator('#cena-teste-isolada [data-order="U"]')).toHaveCount(0);
});

test('oferece selecionar e colocar por clique e por teclado', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'material',
    ordens: 'D-U',
    valorAlvo: 11,
    limites: { D: 2, U: 3 },
  });
  const ferramentaD = page.locator('#cena-teste-isolada [data-math-tool="D"]');
  await ferramentaD.focus();
  await page.keyboard.press('Enter');
  const colocarD = page.locator('#cena-teste-isolada [data-math-place="D"]');
  await colocarD.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#cena-teste-isolada [data-order="D"]')).toHaveCount(1);

  await page.locator('#cena-teste-isolada [data-math-tool="U"]').click();
  await page.locator('#cena-teste-isolada [data-math-place="U"]').click();
  await expect(page.locator('#cena-teste-isolada [data-math-summary]')).toContainText('11');
});

test('coloca a peça ao clicar na área grande e rejeita uma ordem incompatível', async ({
  page,
}) => {
  await montarCenaIsolada(page, {
    tipo: 'material',
    ordens: 'C-D-U',
    valorAlvo: 120,
    limites: { C: 2, D: 10, U: 9 },
  });

  await page.locator('[data-math-tool="D"]').click();
  await expect(page.locator('[data-math-drop-order="D"]')).toHaveClass(/pronta-para-colocar/);
  await page.locator('[data-math-drop-click="D"]').click({ position: { x: 8, y: 8 } });
  await page.locator('[data-math-drop-click="D"]').click({ position: { x: 8, y: 8 } });
  await expect(page.locator('[data-order="D"]')).toHaveCount(2);

  await page.locator('[data-math-tool="C"]').click();
  await page.locator('[data-math-drop-click="D"]').click({ position: { x: 8, y: 8 } });
  await expect(page.locator('[data-order="C"]')).toHaveCount(0);
  await expect(page.locator('[data-order="D"]')).toHaveCount(2);
  await expect(page.locator('[data-math-status]')).toContainText('pertence a centenas');

  const areaCentenas = page.locator('[data-math-drop-click="C"]');
  await areaCentenas.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-order="C"]')).toHaveCount(1);
  await expect(page.locator('[data-math-summary]')).toContainText('120');
});

test('faz explicitamente as três trocas e mantém o valor matemático', async ({ page }) => {
  const casos = [
    { ordens: 'D-U', origem: 'U', destino: 'D', inicial: { U: 10 }, esperado: { D: 1 } },
    { ordens: 'C-D-U', origem: 'D', destino: 'C', inicial: { D: 10 }, esperado: { C: 1 } },
    { ordens: 'M-C-D-U', origem: 'C', destino: 'M', inicial: { C: 10 }, esperado: { M: 1 } },
  ];
  for (const caso of casos) {
    await montarCenaIsolada(page, {
      tipo: 'material',
      ordens: caso.ordens,
      inicial: caso.inicial,
      valorAlvo: 1000,
      trocas: true,
      limites: { U: 10, D: 10, C: 10, M: 2 },
    });
    const antes = await page.evaluate(() =>
      window.MatematicaManipulaveis.valorTotal(window.__cenaTeste.obterEstado().quantidades)
    );
    expect(
      await page.evaluate(({ origem, destino }) => window.__cenaTeste.trocar(origem, destino), caso)
    ).toBe(true);
    const resultado = await page.evaluate(() => window.__cenaTeste.obterEstado());
    expect(resultado.quantidades[caso.origem]).toBe(0);
    expect(resultado.quantidades[caso.destino]).toBe(caso.esperado[caso.destino]);
    expect(
      await page.evaluate(() =>
        window.MatematicaManipulaveis.valorTotal(window.__cenaTeste.obterEstado().quantidades)
      )
    ).toBe(antes);
  }
});

test('troca fichas educativas por uma combinação equivalente', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'dinheiro',
    valores: [100, 200, 500],
    valorAlvo: 200,
    trocasDinheiro: [{ de: 100, quantidade: 2, para: 200 }],
  });
  await page.locator('[data-math-money="100"]').click();
  await page.locator('[data-math-money="100"]').click();
  await expect(page.locator('[data-math-money-exchange="0"]')).toBeEnabled();
  await page.locator('[data-math-money-exchange="0"]').click();
  expect(await page.evaluate(() => window.__cenaTeste.obterEstado().dinheiro)).toMatchObject({
    100: 0,
    200: 1,
  });
  await expect(page.locator('[data-math-summary]')).toContainText('200');
});

test('monta e lê números no ábaco com descrição por haste', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'abaco',
    ordens: 'C-D-U',
    valorAlvo: 203,
    representacaoAlvo: { C: 2, D: 0, U: 3 },
    limites: { C: 9, D: 9, U: 9 },
  });
  for (let i = 0; i < 2; i += 1)
    (await page.locator('[data-math-tool="C"]').click(),
      await page.locator('[data-math-place="C"]').click());
  for (let i = 0; i < 3; i += 1)
    (await page.locator('[data-math-tool="U"]').click(),
      await page.locator('[data-math-place="U"]').click());
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
  await expect(page.locator('.coluna-ordem[aria-label="dezenas: 0"]')).toBeVisible();

  await montarCenaIsolada(page, {
    tipo: 'abaco',
    modo: 'descobrir',
    ordens: 'C-D-U',
    inicial: { C: 2, D: 4, U: 3 },
    opcoes: [234, 243, 423],
  });
  await page.locator('[data-math-answer="243"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
});

test('compõe, decompõe e trata zero intermediário por equivalência', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'composicao',
    cartoes: [600, 60, 8, 80],
    resposta: [600, 8],
    ordemLivre: true,
  });
  for (const valor of ['8', '600']) {
    await page.locator(`[data-math-card="${valor}"]`).click();
    await page.locator('[data-math-place-card]').click();
  }
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await montarCenaIsolada(page, {
    tipo: 'quadro',
    ordens: 'C-D-U',
    valorAlvo: 304,
    representacaoAlvo: { C: 3, D: 0, U: 4 },
    inicial: { C: 3, U: 4 },
  });
  expect(await page.evaluate(() => window.__cenaTeste.validar().correta)).toBe(true);
});

test('completa sequência, escolhe na reta e constrói gráfico acessível', async ({ page }) => {
  await montarCenaIsolada(page, {
    tipo: 'sequencia',
    sequencia: [320, null, 360],
    cartoes: [340, 380],
    espacos: [{ id: 'meio', posicao: 1, resposta: 340 }],
  });
  await page.locator('[data-math-sequence-card="340"]').click();
  await page.locator('[data-math-sequence-space="meio"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');

  await montarCenaIsolada(page, {
    tipo: 'reta',
    marcadores: [480, 500, 520],
    resposta: 520,
  });
  await page.locator('[data-math-answer="520"]').click();
  expect(await page.evaluate(() => window.__cenaTeste.validar().correta)).toBe(true);

  await montarCenaIsolada(page, {
    tipo: 'grafico',
    dados: [
      { id: 'a', rotulo: 'A', valor: 2 },
      { id: 'b', rotulo: 'B', valor: 1 },
    ],
  });
  await page.locator('[data-math-bar="a"][data-delta="1"]').click();
  await page.locator('[data-math-bar="a"][data-delta="1"]').click();
  await page.locator('[data-math-bar="b"][data-delta="1"]').click();
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Muito bem');
  await expect(page.getByRole('table')).toContainText('Quantidade');
});

test('desfaz e limpa somente a cena atual', async ({ page }) => {
  await montarCenaIsolada(page, { tipo: 'quadro', ordens: 'D-U', valorAlvo: 1 });
  await page.locator('[data-math-tool="U"]').click();
  await page.locator('[data-math-place="U"]').click();
  await page.locator('[data-math-place="U"]').click();
  await expect(page.locator('[data-order="U"]')).toHaveCount(2);
  await page.locator('[data-math-undo]').click();
  await expect(page.locator('[data-order="U"]')).toHaveCount(1);
  await page.locator('[data-math-clear]').click();
  await expect(page.locator('[data-order="U"]')).toHaveCount(0);
  await expect(page.locator('[data-math-status]')).toContainText('Somente esta cena');
});

test('salva, recarrega e restaura a construção manipulativa', async ({ page }) => {
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.locator('[data-math-tool="C"]').click();
  await page.locator('[data-math-place="C"]').click();
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).cenas['placa-centena'].quantidades.C,
        CHAVE
      )
    )
    .toBe(1);
  await page.reload();
  await abrirCentenas(page);
  await expect(page.getByText('Etapa 2 de 20')).toBeVisible();
  await expect(page.locator('[data-order="C"]')).toHaveCount(1);
});

test('limpa apenas a revisão ativa e preserva Alice e a Matemática ampla', async ({ page }) => {
  const ampla = JSON.stringify({ etapaAtual: 7, respostas: { x: 'y' } });
  const alice = JSON.stringify({ tentativas: 2, respostas: { origemMateriais: 'a' } });
  await page.evaluate(
    ({ chaveAmpla, dadoAmpla, chaveAlice, dadoAlice }) => {
      localStorage.setItem(chaveAmpla, dadoAmpla);
      localStorage.setItem(chaveAlice, dadoAlice);
    },
    { chaveAmpla: CHAVE_AMPLA, dadoAmpla: ampla, chaveAlice: CHAVE_ALICE, dadoAlice: alice }
  );
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_AMPLA)).toBe(ampla);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(alice);
});

test('normaliza JSON corrompido, versão incompatível e valores fora do limite', async ({
  page,
}) => {
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        versao: 1,
        etapaAtual: 8,
        cenas: {
          'quadro-582': {
            versao: 1,
            quantidades: { C: 999, D: -3, U: 'não é número' },
            tentativas: 999,
          },
        },
      })
    );
  }, CHAVE);
  await page.reload();
  const normalizado = await page.evaluate((id) => window.MatematicaRevisoes.obterEstado(id), ID);
  expect(normalizado.etapaAtual).toBe(8);
  expect(normalizado.cenas['quadro-582'].quantidades).toMatchObject({ C: 9, D: 0, U: 0 });
  expect(normalizado.cenas['quadro-582'].tentativas).toBe(99);

  await page.evaluate(
    (chave) => localStorage.setItem(chave, JSON.stringify({ versao: 99, etapaAtual: 19 })),
    CHAVE
  );
  await page.reload();
  expect(
    (await page.evaluate((id) => window.MatematicaRevisoes.obterEstado(id), ID)).etapaAtual
  ).toBe(0);

  await page.evaluate((chave) => localStorage.setItem(chave, '{quebrado'), CHAVE);
  await page.reload();
  expect(
    (await page.evaluate((id) => window.MatematicaRevisoes.obterEstado(id), ID)).etapaAtual
  ).toBe(0);
});

test('continua utilizável em memória com localStorage bloqueado', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[metodo] = function () {
        throw new DOMException('Bloqueado pelo teste', 'SecurityError');
      };
    }
  });
  await page.goto(CAMINHO);
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.locator('[data-math-tool="D"]').click();
  await page.locator('[data-math-place="D"]').click();
  await expect(page.locator('[data-order="D"]')).toHaveCount(1);
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await expect(page.locator('[data-order="D"]')).toHaveCount(1);
  await contexto.close();
});

test('não duplica ações ao sair e reabrir e não gera erros de console', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.getByRole('button', { name: 'Matemática', exact: true }).click();
  await page.getByRole('button', { name: /Centenas em ação/ }).click();
  await page.getByRole('button', { name: 'Matemática', exact: true }).click();
  await page.getByRole('button', { name: /Centenas em ação/ }).click();
  await page.locator('[data-math-tool="D"]').click();
  await page.locator('[data-math-place="D"]').click();
  await expect(page.locator('[data-order="D"]')).toHaveCount(1);
  expect(erros).toEqual([]);
});

test('é acessível e não cria rolagem horizontal em 390 por 844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await page.evaluate(() => window.MatematicaRevisoes.irPara(17));
  await expect(page.locator('.ordem-m')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const graves = resultado.violations.filter((violacao) =>
    ['serious', 'critical'].includes(violacao.impact)
  );
  expect(graves.map((violacao) => violacao.id)).toEqual([]);
});

test('abre a revisão manipulativa também pelo bundle em file local', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await abrirCentenas(page);
  await page.getByRole('button', { name: 'Começar a aventura' }).click();
  await expect(page.locator('#recipiente-cena-matematica')).toBeVisible();
  await contexto.close();
});
