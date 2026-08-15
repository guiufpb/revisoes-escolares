const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_LEITURA_ALICE = 'revisoesEscolares.alice.leitura.primeirasLicoesDinheiro.v1';
const CHAVE_RAPOSA_ALICE = 'revisoesEscolares.alice.leitura.raposaEUvas.v1';
const CHAVE_SOL_ALICE = 'revisoesEscolares.alice.leitura.solTirouFerias.v1';
const CHAVE_FORMIGA_ALICE = 'revisoesEscolares.alice.leitura.formigaQueriaCantar.v1';
const CHAVE_CASTELO_ALICE = 'revisoesEscolares.alice.leitura.casteloBemAssombrado.v1';
const CHAVE_BELA_ALICE = 'revisoesEscolares.alice.leitura.belaDesadormecida.v1';
const CHAVE_JOANINHA_ALICE = 'revisoesEscolares.alice.leitura.joaninhaPerdeuPintinhas.v1';
const CHAVE_FORMIGA_ESPECIAL_ALICE = 'revisoesEscolares.alice.leitura.umaFormigaEspecial.v1';
const CHAVE_INGLES_MARIANA = 'revisoesEscolares.mariana.ingles.atSchoolUnidade3.v1';
const CHAVE_INGLES_CITY_LIFE = 'revisoesEscolares.mariana.ingles.cityLifeUnidade5.v1';

async function verificarAcessibilidade(page, nomeDaTela) {
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
  expect(graves, `${nomeDaTela}: ${graves.map((item) => item.id).join(', ')}`).toEqual([]);
}

async function clicarAlternativaCorreta(page, livroId, indicePerguntaObjetiva) {
  const respostaCorreta = await page.evaluate(
    ({ idLivro, indice }) =>
      window.RegistroLeituras.obter(idLivro).questionario.filter(
        (pergunta) => pergunta.tipo !== 'ditado'
      )[indice].respostaCorreta,
    { idLivro: livroId, indice: indicePerguntaObjetiva }
  );
  await page.locator(`[data-alternativa-id="${respostaCorreta}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('tela inicial e navegação completa por teclado', async ({ page }) => {
  await verificarAcessibilidade(page, 'Tela inicial');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Alice/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'O que vamos revisar?' })).toBeFocused();
  await verificarAcessibilidade(page, 'Tela de matérias');
});

test('revisão da Alice e mensagens de estado', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Ciências/ }).click();
  await verificarAcessibilidade(page, 'Revisão da Alice');
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).not.toBeEmpty();
});

test('Inglês da Alice com controles de áudio em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await expect(page.getByRole('heading', { name: 'English Review – Unit 3' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir instrução' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir em inglês' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🐢 Ouvir devagar' })).toBeVisible();
  await expect(page.getByRole('button', { name: '🔁 Repetir' })).toBeVisible();
  await expect(page.getByRole('button', { name: '⏹ Parar' })).toBeVisible();
  await verificarAcessibilidade(page, 'Inglês bilíngue da Alice');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('atividades de Inglês da Mariana em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    const unidade = window.RegistroIngles.obter('at-school-unidade-3');
    localStorage.setItem(
      chave,
      JSON.stringify({
        itensOuvidos: unidade.grupos.flatMap((grupo) => grupo.itens.map((item) => item.id)),
        iniciado: true,
      })
    );
  }, CHAVE_INGLES_MARIANA);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await page.getByRole('button', { name: 'Começar as 10 atividades →' }).click();
  await expect(page.getByText('Atividade 1 de 10')).toBeVisible();
  await expect(page.locator('[data-alternativa-atividade-ingles]')).toHaveCount(4);
  await verificarAcessibilidade(page, 'Atividades de Inglês da Mariana');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('City Life da Mariana funciona por teclado e sem rolagem horizontal no celular', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    const unidade = window.RegistroIngles.obter('city-life-unidade-5');
    localStorage.setItem(
      chave,
      JSON.stringify({
        itensOuvidos: unidade.grupos.flatMap((grupo) => grupo.itens.map((item) => item.id)),
        iniciado: true,
      })
    );
  }, CHAVE_INGLES_CITY_LIFE);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-ingles-city-life').click();
  await expect(page.getByRole('heading', { name: 'English Review - Unit 5' })).toBeVisible();
  await page.getByRole('button', { name: 'Começar as 16 atividades →' }).click();
  const alternativa = page.locator('[data-alternativa-atividade-ingles]').first();
  await alternativa.focus();
  await page.keyboard.press('Enter');
  await expect(alternativa).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Conferir resposta' })).toBeEnabled();
  await verificarAcessibilidade(page, 'City Life da Mariana');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('recompensa final de Inglês em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    const unidade = window.RegistroIngles.obter('at-school-unidade-3');
    localStorage.setItem(
      chave,
      JSON.stringify({
        itensOuvidos: unidade.grupos.flatMap((grupo) => grupo.itens.map((item) => item.id)),
        respostasAtividades: Object.fromEntries(
          unidade.atividades.map((questao) => [questao.id, questao.respostaCorreta])
        ),
        iniciado: true,
        atividadeIniciada: true,
        atividadeFinalizada: true,
      })
    );
  }, CHAVE_INGLES_MARIANA);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  await expect(page.locator('#ingles-surpresa-final')).toBeVisible();
  await expect(page.locator('#ingles-surpresa-final img')).toHaveAttribute(
    'alt',
    'Mita sorrindo, com as mãos unidas'
  );
  await verificarAcessibilidade(page, 'Recompensa final de Inglês');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('revisão da Mariana e canvas em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        etapaAtual: 20,
        respostas: {},
        pontuacoes: {},
        concluidas: {},
        canvases: {},
        pontos: 0,
        finalizada: false,
      })
    );
  }, CHAVE_MARIANA);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.getByRole('button', { name: /Revisão ampla/ }).click();
  await expect(page.locator('#canvas-mariana-vistas')).toBeVisible();
  await verificarAcessibilidade(page, 'Canvas móvel da Mariana');
  const larguraDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(larguraDocumento).toBeLessThanOrEqual(390);
});

test('biblioteca e visualizador de leitura em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await expect(page.getByRole('heading', { name: 'Escolha uma leitura' })).toBeVisible();
  await verificarAcessibilidade(page, 'Biblioteca de leituras');
  await page
    .locator('[data-livro-id="primeiras-licoes-dinheiro"]')
    .getByRole('button', { name: /Começar leitura/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 1 do livro Primeiras Lições sobre Dinheiro'
  );
  await verificarAcessibilidade(page, 'Visualizador de leitura');
  const medidas = await page.evaluate(() => ({
    documento: document.documentElement.scrollWidth,
    canvas: document.getElementById('canvas-livro').getBoundingClientRect().width,
    recipiente: document.getElementById('recipiente-canvas-livro').clientWidth,
  }));
  expect(medidas.documento).toBeLessThanOrEqual(390);
  expect(medidas.canvas).toBeLessThanOrEqual(medidas.recipiente);
});

test('leitor dedicado em janela ampla', async ({ page }) => {
  await page.goto(
    '/ambiente_interativo/leitor.html?perfil=alice&livro=quem-e-o-rei-dos-animais&pagina=10'
  );
  await expect(page.locator('html')).toHaveClass(/leitor-pronto/);
  await expect(page.locator('#canvas-leitor-dedicado')).toHaveAttribute(
    'aria-label',
    'Página 10 do livro Quem é o rei dos animais?'
  );
  await verificarAcessibilidade(page, 'Leitor dedicado');
  await page.getByRole('button', { name: '📘 Palavras desta página' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário do leitor dedicado');
});

test('atividade de ditado com teclado em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 21,
        maiorPaginaAlcancada: 21,
        paginasVisitadas: [21],
        perguntaAtual: 10,
        leituraIniciada: true,
      })
    );
  }, CHAVE_RAPOSA_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="a-raposa-e-as-uvas"]')
    .getByRole('button', { name: /Continuar da página 21/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 11 de 13')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await expect(page.getByLabel('Digite o que você ouviu')).toBeVisible();
  await verificarAcessibilidade(page, 'Atividade de ditado');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('explicação do eclipse e glossário em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 30,
        maiorPaginaAlcancada: 30,
        paginasVisitadas: [30],
        leituraIniciada: true,
      })
    );
  }, CHAVE_SOL_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="o-dia-que-o-sol-tirou-ferias"]')
    .getByRole('button', { name: /Continuar da página 30/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await expect(
    page.getByRole('heading', { name: 'O que aconteceu? Foi um eclipse solar!' })
  ).toBeVisible();
  await expect(page.locator('#imagem-explicacao-final-leitura')).toBeVisible();
  await verificarAcessibilidade(page, 'Explicação infantil do eclipse');
  await page.getByRole('button', { name: '📘 Palavras desta página' }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'eclipse solar' })
  ).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário do eclipse');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('glossário e ditado de A formiga que queria cantar em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 16,
        maiorPaginaAlcancada: 36,
        paginasVisitadas: [16, 36],
        perguntaAtual: 10,
        leituraIniciada: true,
      })
    );
  }, CHAVE_FORMIGA_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="a-formiga-que-queria-cantar"]')
    .getByRole('button', { name: /Continuar da página 16/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'rebuliço' })).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário da formiga cantora');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.locator('#ir-pagina-leitura').fill('36');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 11 de 13')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await verificarAcessibilidade(page, 'Ditado da formiga cantora');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('glossário e ditado de Um castelo bem assombrado em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 13,
        maiorPaginaAlcancada: 25,
        paginasVisitadas: [13, 25],
        perguntaAtual: 10,
        leituraIniciada: true,
      })
    );
  }, CHAVE_CASTELO_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="um-castelo-bem-assombrado"]')
    .getByRole('button', { name: /Continuar da página 13/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'pasma' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'desvendar' })).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário do castelo');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.locator('#ir-pagina-leitura').fill('25');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 11 de 13')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await verificarAcessibilidade(page, 'Ditado do castelo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('glossário e ditado de A Bela Desadormecida em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 18,
        maiorPaginaAlcancada: 30,
        paginasVisitadas: [18, 30],
        perguntaAtual: 10,
        leituraIniciada: true,
      })
    );
  }, CHAVE_BELA_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="a-bela-desadormecida"]')
    .getByRole('button', { name: /Continuar da página 18/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'desalmada' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'século' })).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário da Bela Desadormecida');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.locator('#ir-pagina-leitura').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  for (let indice = 1; indice <= 10; indice += 1) {
    await clicarAlternativaCorreta(page, 'a-bela-desadormecida', indice - 1);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await verificarAcessibilidade(page, 'Revisão conjunta da Bela Desadormecida');
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();
  await expect(page.getByText('Ditado 1 de 3')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await verificarAcessibilidade(page, 'Ditado da Bela Desadormecida');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('glossário e ditado de A Joaninha que Perdeu as Pintinhas em largura móvel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 15,
        maiorPaginaAlcancada: 21,
        paginasVisitadas: [15, 21],
        leituraIniciada: true,
      })
    );
  }, CHAVE_JOANINHA_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="a-joaninha-que-perdeu-as-pintinhas"]')
    .getByRole('button', { name: /Continuar da página 15/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'cabisbaixa' })).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário da Joaninha');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.locator('#ir-pagina-leitura').fill('21');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  for (let indice = 1; indice <= 10; indice += 1) {
    await clicarAlternativaCorreta(page, 'a-joaninha-que-perdeu-as-pintinhas', indice - 1);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await verificarAcessibilidade(page, 'Revisão conjunta da Joaninha');
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();
  await expect(page.getByText('Ditado 1 de 3')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await verificarAcessibilidade(page, 'Ditado da Joaninha');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('glossário e ditado de Uma Formiga Especial em largura móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 20,
        maiorPaginaAlcancada: 31,
        paginasVisitadas: [20, 31],
        leituraIniciada: true,
      })
    );
  }, CHAVE_FORMIGA_ESPECIAL_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="uma-formiga-especial"]')
    .getByRole('button', { name: /Continuar da página 20/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'olfato' })).toBeVisible();
  await verificarAcessibilidade(page, 'Glossário de Uma Formiga Especial');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.locator('#ir-pagina-leitura').fill('31');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  for (let indice = 1; indice <= 10; indice += 1) {
    await clicarAlternativaCorreta(page, 'uma-formiga-especial', indice - 1);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await verificarAcessibilidade(page, 'Revisão conjunta de Uma Formiga Especial');
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();
  await expect(page.getByText('Ditado 1 de 3')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toBeVisible();
  await verificarAcessibilidade(page, 'Ditado de Uma Formiga Especial');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('questionário e resultado da leitura', async ({ page }) => {
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        paginaAtual: 25,
        maiorPaginaAlcancada: 25,
        paginasVisitadas: [25],
        leituraIniciada: true,
      })
    );
  }, CHAVE_LEITURA_ALICE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator('[data-livro-id="primeiras-licoes-dinheiro"]')
    .getByRole('button', { name: /Continuar da página 25/ })
    .click();
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await verificarAcessibilidade(page, 'Questionário de leitura');

  for (let indice = 1; indice <= 10; indice += 1) {
    await clicarAlternativaCorreta(page, 'primeiras-licoes-dinheiro', indice - 1);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 10 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await verificarAcessibilidade(page, 'Resultado da leitura');
});
