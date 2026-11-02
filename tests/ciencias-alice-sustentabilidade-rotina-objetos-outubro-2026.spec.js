const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const URL = '/ambiente_interativo/index.html';
const ID = 'alice-ciencias-sustentabilidade-rotina-objetos-outubro-2026';
const CARTAO = '#abrir-ciencias-sustentabilidade-alice';
const CHAVE = 'revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.v1';
const AUXILIAR =
  'revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.responsavel.v1';
const VIZINHAS = [
  'revisoesEscolares.alice.ciencias.objetosEmocoesAlimentacaoSetembro2026.v1',
  'revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1',
];
const qid = (n) => 'ciencias-sustentabilidade-rotina-objetos-q' + String(n).padStart(2, '0');
// Transcrito do gabarito do responsável; não consultado nas respostas da aplicação.
const GABARITO = [
  ['Escova de dentes'],
  ['Mexer a sopa.', 'Ajudar a pessoa a se proteger da chuva.'],
  {
    campos: ['pentear', 'escrever'],
  },
  ['Relógio', 'Termômetro'],
  [
    {
      selecao: ['Borracha', 'Lápis'],
    },
  ],
  ['Servir para beber água.', 'O material de que são feitos.'],
  ['transparente', 'flexível', 'resistente'],
  [
    {
      selecao: ['Tecido', 'Metal'],
    },
    'Porque ajuda a proteger a pessoa da chuva.',
  ],
  [
    {
      selecao: ['Pegar um remédio encontrado.', 'Mexer no fogão.'],
    },
    'Avisar um adulto, sem mexer no remédio.',
  ],
  ['cuidado do corpo', 'estudo', 'brincadeira'],
  [
    {
      ordem: [
        'Pegar os lápis que estão guardados.',
        'Usar os lápis para desenhar.',
        'Guardar os lápis depois do desenho.',
      ],
    },
  ],
  ['Tarde', 'Noite'],
  [
    {
      selecao: ['Ir à escola.', 'Escovar os dentes.'],
    },
  ],
  ['Toalha limpa', 'Pente'],
  [
    {
      ordem: ['Lavar as mãos.', 'Secar as mãos com toalha limpa.', 'Começar a comer o lanche.'],
    },
    'Porque ajuda a retirar sujeira das mãos.',
  ],
  ['Vão à escola e brincam.', 'Eles vão à escola em momentos diferentes.'],
  [
    'Bombear sangue pelo corpo.',
    {
      selecao: ['Pular corda.', 'Dormir à noite.'],
    },
  ],
  [
    {
      selecao: [
        'Fechar a torneira quando a água não está sendo usada.',
        'Colocar papel limpo na coleta de papel da escola.',
        'Cuidar das árvores da praça.',
      ],
    },
  ],
  ['Fechar a torneira e abri-la quando precisar enxaguar.', 'Fechar a torneira.'],
  ['Usar uma página vazia do caderno.', 'Usar o lado limpo da folha.'],
  [
    {
      ordem: [
        'Pedir ao adulto que confira a caixa limpa e inteira.',
        'Colocar os blocos na caixa.',
        'Fechar a tampa com os blocos dentro.',
      ],
    },
    'Guardar os blocos.',
  ],
  ['Recicláveis', 'Orgânicos', 'Rejeitos'],
  ['reciclar', 'reduzindo o consumo desnecessário', 'reutilizar'],
  ['Somente a casca de fruta.', 'É preciso dar destino adequado aos resíduos.'],
  [
    'Um animal pode confundi-la com alimento.',
    'Encaminhá-la ao coletor que aceita essa embalagem.',
  ],
  ['flutuando', 'afundou'],
  ['Oferecer um lugar de abrigo.', 'Brincar sem arrancar ou quebrar os galhos.'],
  ['Relógio', 'Borracha'],
  [
    {
      ordem: [
        'Pegar os materiais para começar.',
        'Desenhar o cartaz com os materiais.',
        'Guardar os materiais depois do trabalho.',
      ],
    },
    {
      selecao: [
        'Usar a caixa vazia para guardar os lápis.',
        'Usar o lado limpo do papel para rascunho.',
      ],
    },
  ],
  [
    'Estar inteira e ter espaço para os lápis.',
    'reutilizar a caixa',
    {
      selecao: [
        'Aproveitar o lado limpo para rascunho.',
        'Encaminhar papel limpo e seco à coleta indicada.',
      ],
    },
  ],
];
const EXTRAS = {
  5: 'Relógio',
  8: 'Papel',
  9: 'Abrir um livro na mesa.',
  13: 'Visitar a avó.',
  17: 'Escrever o nome.',
  18: 'Deixar uma embalagem no riacho.',
  29: 'Trocar materiais inteiros só para ter novos.',
  30: 'Descartar a folha que ainda tem um lado útil.',
};

function area(page) {
  return page.locator('#gramatica-conteudo');
}
function grupo(page, numero, indice) {
  return [5, 13, 18].includes(numero)
    ? area(page).locator('[data-interacao-questionario]')
    : area(page).locator('[data-item-gramatica]').nth(indice);
}
async function abrir(page) {
  await page.locator('[data-aluno="alice"]').click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
async function preparar(page, numero, dados = {}) {
  await page.evaluate(
    ({ chave, numero, dados }) =>
      localStorage.setItem(
        chave,
        JSON.stringify({ versao: 1, questaoAtual: numero - 1, ...dados })
      ),
    { chave: CHAVE, numero, dados }
  );
  await page.reload();
  await abrir(page);
}
async function estado(page, chave = CHAVE) {
  return page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), chave);
}
async function conferir(page) {
  await area(page).getByRole('button', { name: 'Conferir', exact: true }).click();
}
async function preencher(page, numero) {
  const respostas = GABARITO[numero - 1];
  if (respostas.campos) {
    const campos = area(page).locator('[data-resposta-gramatica]');
    await expect(campos).toHaveCount(respostas.campos.length);
    for (const [i, r] of respostas.campos.entries()) await campos.nth(i).fill(r);
  } else {
    for (const [i, r] of respostas.entries()) {
      const g = grupo(page, numero, i);
      if (r.ordem)
        for (const cartao of r.ordem)
          await g.getByRole('button', { name: cartao, exact: true }).click();
      else if (r.selecao)
        for (const opcao of r.selecao)
          await g.getByRole('button', { name: opcao, exact: true }).click();
      else await g.getByRole('button', { name: r, exact: true }).click();
    }
  }
}
async function errarPrimeiro(page, numero) {
  const primeira = GABARITO[numero - 1].campos?.[0] || GABARITO[numero - 1][0];
  const g = grupo(page, numero, 0);
  if (numero === 3) await area(page).locator('[data-resposta-gramatica]').first().fill('varrer');
  else if (primeira.selecao)
    await g.getByRole('button', { name: EXTRAS[numero], exact: true }).click();
  else if (primeira.ordem) {
    await g.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
    for (const cartao of [...primeira.ordem].reverse())
      await g.getByRole('button', { name: cartao, exact: true }).click();
  } else {
    const botoes = g.locator('button');
    const nomes = await botoes.evaluateAll((bs) =>
      bs.map((b) => b.getAttribute('aria-label') || b.textContent.replace(/^[○✓□]\s*/, '').trim())
    );
    const errada = nomes.find((n) => n !== primeira);
    await g.getByRole('button', { name: errada, exact: true }).click();
  }
}
async function corrigirPrimeiro(page, numero) {
  const primeira = GABARITO[numero - 1].campos?.[0] || GABARITO[numero - 1][0];
  const g = grupo(page, numero, 0);
  if (numero === 3) await area(page).locator('[data-resposta-gramatica]').first().fill('pentear');
  else if (primeira.selecao)
    await g.getByRole('button', { name: EXTRAS[numero], exact: true }).click();
  else if (primeira.ordem) {
    await g.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
    for (const cartao of primeira.ordem)
      await g.getByRole('button', { name: cartao, exact: true }).click();
  } else await g.getByRole('button', { name: primeira, exact: true }).click();
}
async function auditar(page) {
  const resultado = await new AxeBuilder({ page })
    .include('#tela-gramatica-mariana')
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
  page.errosCiencias = [];
  page.on('pageerror', (e) => page.errosCiencias.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') page.errosCiencias.push(m.text());
  });
  await page.goto(URL);
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
test.afterEach(async ({ page }) => expect(page.errosCiencias).toEqual([]));

test('cadastro, 30 questões/60 subitens, gabarito fixo, contextos e opt-ins', async ({ page }) => {
  const dados = await page.evaluate(
    (id) => ({
      r: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.registro).toMatchObject({
    id: ID,
    totalEtapas: 30,
    chaveArmazenamento: CHAVE,
    possuiAudio: false,
  });
  expect(dados.r).toMatchObject({
    chave: CHAVE,
    aluno: 'alice',
    materia: 'Ciências',
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
  });
  expect(dados.r.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([
    CHAVE,
    AUXILIAR,
  ]);
  expect(dados.r.questoes).toHaveLength(30);
  expect(new Set(dados.r.questoes.map((q) => q.id)).size).toBe(30);
  expect(dados.r.questoes.reduce((s, q) => s + q.itens.length, 0)).toBe(60);
  expect(dados.r.questoes.filter((q) => q.ditado)).toEqual([]);
  const posicoes = [];
  for (const [i, q] of dados.r.questoes.entries()) {
    expect(q.leitura).toContain('Leia para aprender');
    expect(q.leitura).toContain('Observe a situação');
    expect(q.dica.length).toBeGreaterThan(20);
    expect(q.sucesso.length).toBeGreaterThan(20);
    q.itens.forEach((item) => {
      if (item.opcoes && item.tipo !== 'selecao')
        posicoes.push(item.opcoes.indexOf(item.respostas[0]));
    });
    const esperadas = GABARITO[i].campos || GABARITO[i];
    expect(q.itens.map((item) => item.respostas)).toEqual(
      esperadas.map((r) => r.selecao || r.ordem || [r])
    );
  }
  expect(
    posicoes.reduce(
      (s, v) => {
        s[v]++;
        return s;
      },
      [0, 0, 0, 0]
    )
  ).toEqual([13, 18, 15, 0]);
  for (let i = 3; i < posicoes.length; i++)
    expect(new Set(posicoes.slice(i - 3, i + 1)).size).toBeGreaterThan(1);
  for (const n of [28, 29, 30])
    expect(dados.r.questoes[n - 1].leitura).toContain('Lia e Rui vão desenhar um cartaz');
  expect(dados.r.questoes.slice(27).map((q) => q.leitura.split('Observe a situação\n')[1])).toEqual(
    Array(3).fill(dados.r.questoes[27].leitura.split('Observe a situação\n')[1])
  );
  await page.locator('[data-aluno="mariana"]').click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await expect(area(page)).toContainText('Você pode corrigir e tentar de novo.');
});

test('todos os 60 subitens: erro completo, correção, avanço e 30 pontos únicos', async ({
  page,
}) => {
  test.setTimeout(240000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${n} de 30`);
    await preencher(page, n);
    await errarPrimeiro(page, n);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n - 1} de 30`);
    expect((await estado(page)).tentativas[qid(n)]).toBe(1);
    await corrigirPrimeiro(page, n);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    expect((await estado(page)).tentativas[qid(n)]).toBe(2);
    if (n === 1) {
      await conferir(page);
      await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
    }
    await page.locator('#gramatica-proxima').click();
  }
  await expect(area(page).getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await expect(area(page)).toContainText('Essa conversa e esse desenho não valem ponto.');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  const final = await estado(page);
  expect(Object.keys(final.pontuadas)).toHaveLength(30);
  expect(final.finalizada).toBe(true);
});

test('subitens incompletos, erro e acerto restaurados; editar invalida avanço sem duplicar ponto', async ({
  page,
}) => {
  await preparar(page, 2);
  const g = grupo(page, 2, 0);
  await g.getByRole('button', { name: GABARITO[1][0], exact: true }).click();
  await conferir(page);
  expect((await estado(page)).tentativas[qid(2)]).toBeUndefined();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(
    grupo(page, 2, 0).getByRole('button', { name: GABARITO[1][0], exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await grupo(page, 2, 1)
    .getByRole('button', { name: 'Medir quanta chuva caiu.', exact: true })
    .click();
  await conferir(page);
  const erro = await estado(page);
  expect(erro.tentativas[qid(2)]).toBe(1);
  await page.reload();
  await abrir(page);
  await expect(area(page).locator('.retorno-gramatica')).not.toBeEmpty();
  await grupo(page, 2, 1).getByRole('button', { name: GABARITO[1][1], exact: true }).click();
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await grupo(page, 2, 1)
    .getByRole('button', { name: 'Medir quanta chuva caiu.', exact: true })
    .click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await grupo(page, 2, 1).getByRole('button', { name: GABARITO[1][1], exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  expect((await estado(page)).tentativas[qid(2)]).toBe(3);
});

test('Q03 banco completo, caixa/espaços/acentos, composição e Enter; campos persistidos', async ({
  page,
}) => {
  await preparar(page, 3);
  await expect(area(page)).toContainText('beber · pentear · escrever · varrer');
  const campos = area(page).locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('  PÉNTEAR  ');
  await campos.nth(1).fill('escrever');
  await campos.nth(1).dispatchEvent('keydown', { key: 'Enter', isComposing: true });
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  expect((await estado(page)).tentativas[qid(3)]).toBeUndefined();
  await campos.nth(1).press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('  PÉNTEAR  ');
  await expect(campos.nth(1)).toHaveValue('escrever');
  await campos.nth(0).fill('beber');
  await campos.nth(1).press('Enter');
  await expect(campos.nth(0)).toHaveAttribute('aria-invalid', 'true');
  await campos.nth(0).fill('pentear');
  await campos.nth(1).press('Enter');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

for (const n of [5, 8, 9, 13, 17, 18, 29, 30]) {
  test(`Q${n}: conjunto exato, omissão, extra, desmarcação e restauração por grupo`, async ({
    page,
  }) => {
    await preparar(page, n);
    const respostas = GABARITO[n - 1],
      indice = respostas.findIndex((r) => r.selecao),
      alvos = respostas[indice].selecao;
    // Preenche os demais subitens, inclusive sequência, antes de examinar o conjunto.
    await preencher(page, n);
    const g = grupo(page, n, indice);
    await g.getByRole('button', { name: alvos.at(-1), exact: true }).click();
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await g.getByRole('button', { name: alvos.at(-1), exact: true }).click();
    await g.getByRole('button', { name: EXTRAS[n], exact: true }).click();
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await g.getByRole('button', { name: EXTRAS[n], exact: true }).click();
    const antes = await estado(page);
    await page.reload();
    await abrir(page);
    expect(await estado(page)).toEqual(antes);
    for (const nome of alvos)
      await expect(g.getByRole('button', { name: nome, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    await expect(g.getByRole('button', { name: EXTRAS[n], exact: true })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await expect(g.locator('[aria-pressed="true"]')).toHaveCount(alvos.length);
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  });
}

for (const n of [11, 15, 21, 29]) {
  test(`Q${n}: cartões iniciais, sequência parcial, retirar, reposicionar e teclado`, async ({
    page,
  }) => {
    await preparar(page, n);
    const g = grupo(page, n, 0),
      ordem = GABARITO[n - 1][0].ordem;
    const iniciais = await g.locator('[data-colocar-ordem-misto]').allTextContents();
    expect(iniciais).toHaveLength(3);
    expect(iniciais).not.toEqual(ordem);
    await g.getByRole('button', { name: ordem[0], exact: true }).focus();
    await page.keyboard.press('Enter');
    await conferir(page);
    expect((await estado(page)).tentativas[qid(n)]).toBeUndefined();
    await page.reload();
    await abrir(page);
    await expect(g.locator('[data-retirar-ordem-misto]')).toHaveCount(1);
    await g.getByRole('button', { name: ordem[1], exact: true }).click();
    await g.locator('[data-retirar-ordem-misto]').first().focus();
    await page.keyboard.press('Space');
    await expect(g.locator('[data-retirar-ordem-misto]')).toHaveCount(1);
    await g.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
    await preencher(page, n);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await page.reload();
    await abrir(page);
    expect((await estado(page)).respostas[qid(n)][0]).toEqual(ordem);
  });
}

test('Modo Responsável: salto muda só posição, troca/restauração de sessões, cartão principal e limpeza', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"preservar":true}')),
    VIZINHAS
  );
  await abrir(page);
  await preencher(page, 1);
  await conferir(page);
  const principal = await estado(page);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.locator('#gramatica-modo-responsavel-ir button').click();
  expect(await estado(page, AUXILIAR)).toMatchObject({
    questaoAtual: 29,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    tentativas: {},
    pontos: 0,
  });
  expect(await estado(page)).toEqual(principal);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await preencher(page, 30);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill('11');
  await page.locator('#gramatica-modo-responsavel-ir button').click();
  const auxAntes = await estado(page, AUXILIAR);
  expect(auxAntes.pontos).toBe(1);
  expect(auxAntes.tentativas[qid(11)]).toBeUndefined();
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID)).toEqual(
    principal
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 11 de 30');
  expect(await estado(page, AUXILIAR)).toEqual(auxAntes);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page, AUXILIAR)).toBeNull();
  expect(await estado(page)).toEqual(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-proxima').click();
  const auxiliarNovo = await estado(page, AUXILIAR);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page)).toBeNull();
  expect(await estado(page, AUXILIAR)).toEqual(auxiliarNovo);
  for (const chave of VIZINHAS) expect(await estado(page, chave)).toEqual({ preservar: true });
  await page.locator('#botao-inicio').click();
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-gramatica-h-til').click();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
});

test('JSON inválido, IDs/índices/duplicatas, normalização e armazenamento bloqueado', async ({
  page,
  browser,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{inválido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await preparar(page, 29, {
    respostas: {
      inexistente: ['x'],
      [qid(29)]: [
        ['Cartão desconhecido', GABARITO[28][0].ordem[0], GABARITO[28][0].ordem[0]],
        [GABARITO[28][1].selecao[0], GABARITO[28][1].selecao[0], 'opção ausente'],
      ],
    },
    corrigidas: { [qid(29)]: true, inexistente: true },
    pontuadas: { inexistente: true },
    tentativas: { [qid(29)]: -1 },
  });
  const normalizado = await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID);
  expect(normalizado.respostas).toEqual({
    [qid(29)]: [[GABARITO[28][0].ordem[0]], [GABARITO[28][1].selecao[0]]],
  });
  expect(normalizado.corrigidas).toEqual({});
  expect(normalizado.pontos).toBe(0);
  expect(normalizado.tentativas).toEqual({});
  await preparar(page, 8, {
    respostas: { [qid(8)]: [[99, 'Tecido', 'Tecido', 'ausente'], 99] },
    corrigidas: { [qid(8)]: true },
  });
  await expect(
    grupo(page, 8, 0).getByRole('button', { name: 'Tecido', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(grupo(page, 8, 1).locator('[aria-pressed="true"]')).toHaveCount(0);
  const contexto = await browser.newContext();
  await contexto.addInitScript(() => {
    for (const nome of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[nome] = () => {
        throw new Error('Armazenamento bloqueado para teste');
      };
  });
  const p = await contexto.newPage();
  await p.goto(URL);
  await abrir(p);
  await preencher(p, 1);
  await conferir(p);
  await p.locator('#gramatica-proxima').click();
  await p.locator('#gramatica-voltar').click();
  await expect(p.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await contexto.close();
});

test('file:// com bundle, nenhuma rede obrigatória e recursos originais carregados', async ({
  page,
}) => {
  const rede = [];
  await page.route(/^https?:/, (route) => {
    rede.push(route.request().url());
    return route.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await preencher(page, 1);
  await conferir(page);
  await preparar(page, 26);
  const img = area(page).locator('.ilustracao-leitura-questionario');
  await expect(img).toBeVisible();
  expect(await img.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(rede).toEqual([]);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`layout, alvos do mapa, figuras e painel em ${viewport.width} × ${viewport.height}`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize(viewport);
    await abrir(page);
    const alvos = area(page).locator('.ponto-mapa-visual');
    await expect(alvos).toHaveCount(4);
    const limites = await area(page).locator('.mapa-visual-questionario').boundingBox();
    const caixas = [];
    for (const alvo of await alvos.all()) {
      const b = await alvo.boundingBox();
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.height).toBeGreaterThanOrEqual(44);
      expect(b.x).toBeGreaterThanOrEqual(limites.x);
      expect(b.x + b.width).toBeLessThanOrEqual(limites.x + limites.width);
      expect(b.y).toBeGreaterThanOrEqual(limites.y);
      expect(b.y + b.height).toBeLessThanOrEqual(limites.y + limites.height);
      caixas.push(b);
    }
    for (let i = 0; i < caixas.length; i++)
      for (let j = i + 1; j < caixas.length; j++)
        expect(
          caixas[i].y + caixas[i].height <= caixas[j].y ||
            caixas[j].y + caixas[j].height <= caixas[i].y
        ).toBe(true);
    await alvos.nth(0).focus();
    await page.keyboard.press('Enter');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await alvos.nth(1).focus();
    await page.keyboard.press('Space');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await auditar(page);
    for (const n of [3, 5, 11, 15, 26, 30]) {
      await preparar(page, n);
      await auditar(page);
      const imgs = area(page).locator('.ilustracao-leitura-questionario');
      for (const img of await imgs.all()) {
        expect(await img.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
        const b = await img.boundingBox();
        expect(b.width).toBeGreaterThan(240);
      }
    }
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
    await auditar(page);
  });
}

test('toque opera mapa, conjuntos, retirar cartões e sessão auxiliar', async ({ browser }) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  await page.goto(URL);
  await abrir(page);
  await area(page).getByRole('button', { name: 'Escova de dentes', exact: true }).tap();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(page, 8);
  const g = grupo(page, 8, 0);
  await g.getByRole('button', { name: 'Tecido', exact: true }).tap();
  await g.getByRole('button', { name: 'Metal', exact: true }).tap();
  await g.getByRole('button', { name: 'Papel', exact: true }).tap();
  await g.getByRole('button', { name: 'Papel', exact: true }).tap();
  await expect(g.locator('[aria-pressed="true"]')).toHaveCount(2);
  await preparar(page, 11);
  await grupo(page, 11, 0)
    .getByRole('button', { name: GABARITO[10][0].ordem[0], exact: true })
    .tap();
  await grupo(page, 11, 0).locator('[data-retirar-ordem-misto]').tap();
  await expect(grupo(page, 11, 0).locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-proxima').tap();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 2 de 30');
  await auditar(page);
  await contexto.close();
});

test('V01–V27: todos os arquivos locais, descrições e geometria textual dos SVGs', async ({
  page,
}) => {
  const configuracao = await page.evaluate(
    (id) => window.QuestionariosRevisoes.obterRevisao(id),
    ID
  );
  const fontes = configuracao.questoes
    .map((q) => q.mapaVisual?.imagem || q.ilustracaoLeitura)
    .filter(Boolean);
  expect(new Set(fontes).size).toBe(27);
  for (const src of new Set(fontes)) {
    const svg = fs.readFileSync(path.resolve('ambiente_interativo', src), 'utf8');
    expect(svg.replace(/xmlns="[^"]*"/, '')).not.toMatch(
      /(?:https?:\/\/|<image\b|<script\b|font-face)/
    );
  }
  // Renderiza cada composição, inclusive as não incluídas na matriz de screenshots.
  for (let n = 1; n <= 30; n++) {
    await preparar(page, n);
    const imgs = area(page).locator(
      'img[src*="ciencias-sustentabilidade-rotina-objetos-outubro-2026"]'
    );
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', /.{20,}/);
      await expect
        .poll(() => img.evaluate((img) => img.complete && img.naturalWidth > 0))
        .toBe(true);
    }
  }
});
