const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'mariana-geografia-paisagens-qualidade-vida-outubro-2026';
const CHAVE = 'revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.v1';
const AUX = 'revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.responsavel.v1';
const CARTAO = '#abrir-geografia-paisagens-outubro-mariana';
const VIZINHAS = [
  'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1',
  'revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v1',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
  'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
];
const PALAVRAS = ['paisagem', 'moradia'];
const FRASES = [
  'O campo e a cidade se ajudam.',
  'Cuidamos da água e do solo.',
  'A paisagem muda com o tempo.',
];
// Gabarito editorial fixo, transcrito antes da execução; não lê respostas da aplicação.
const GABARITO = [
  ['Paisagem da cidade.', 'Paisagem do campo.'],
  [
    ['Casas e prédios próximos uns dos outros.', 'Escola e comércio próximos na mesma rua.'],
    ['Área de plantação.', 'Pastagem usada para criar vacas.'],
  ],
  ['construído pelas pessoas.', 'natural.', 'natural.'],
  [
    'A presença de lugar para morar em cada cena.',
    'A cena B tem plantação de feijão; a cena A tem escola e padaria.',
    'A plantação de feijão organizada em fileiras.',
  ],
  ['paisagem', 'moradia'],
  ['agricultura.', 'extrativismo.', 'criação de animais.'],
  ['serviço de educação.', 'comércio de produtos.'],
  [
    'A feira vende cenouras da horta rural, e a família da horta compra ferramentas numa loja da cidade.',
    ['Comunidades rurais também podem ter escolas.', 'Pode haver comércio em localidades rurais.'],
  ],
  ['uma camiseta de tecido de algodão.', 'queijo.', 'uma estante de madeira.'],
  [
    [
      'Cultivo e colheita da alface na horta.',
      'Transporte da alface da horta para a feira.',
      'Venda da alface na feira.',
      'Consumo da alface na refeição.',
    ],
    'Levar a alface da horta para a feira.',
    'Quando a alface é usada na refeição.',
  ],
  ['Favorece.', 'Prejudica.', 'Favorece.'],
  [
    ['A praça com bancos e árvores.', 'O posto de saúde funcionando.'],
    [
      'Muitas pessoas atravessam uma rua com veículos na saída da escola.',
      'Não há local sinalizado para atravessar nesse trecho.',
    ],
  ],
  [
    'Pedir coleta regular ao serviço responsável e orientar o descarte, evitando acúmulo de resíduos.',
    'Combinar horários e volume com respeito, favorecendo o descanso.',
    'Pedir aos responsáveis a liberação da passagem, permitindo usar a calçada.',
  ],
  [
    [
      'Cultivar feijão numa área rural.',
      'Fazer uma horta num terreno da cidade.',
      'Usar um terreno como base para construir uma casa.',
    ],
    [
      'Preservar a vegetação que ainda cobre o terreno.',
      'Pedir orientação para recuperar a cobertura vegetal da área.',
    ],
  ],
  [
    [
      'Dar água aos animais.',
      'Regar uma horta quando ela precisa.',
      'Beber e preparar alimentos com água própria para consumo.',
    ],
    [
      'Avisar um adulto quando uma torneira apresenta vazamento.',
      'Fechar a torneira enquanto ensaboa as mãos.',
      'Evitar jogar resíduos nos rios e córregos.',
    ],
  ],
  [
    'Uma rua de terra passou a ser asfaltada.',
    'Uma biblioteca foi construída no terreno antes vazio.',
    'O muro ficou mais alto.',
  ],
  ['O ipê ao lado da ponte.', 'A ponte, o córrego e o ipê aparecem nas mesmas posições relativas.'],
  [
    'A família saiu de uma casa e passou a morar num apartamento.',
    'No apartamento, com outras unidades ao lado, acima e abaixo.',
    'A moradia serve de abrigo para a família.',
  ],
  [
    'A mãe conseguiu um novo trabalho.',
    [
      'Convidá-lo para uma brincadeira com a turma.',
      'Mostrar os espaços da escola e explicar os combinados.',
    ],
  ],
  [
    'Facilitar o transporte das hortaliças quando havia lama.',
    'A obra facilitou o transporte, mas ainda são necessários cuidados com a velocidade.',
  ],
  ['frontal.', 'vertical.', 'oblíqua.'],
  ['primeiro plano.', 'fundo.', 'plano intermediário.'],
  ['Linha 2.'],
  ['o mercado.', 'A praça, indicada pela folha.'],
  ['A praça.', 'Imediatamente acima da praça.', 'O ponto de ônibus.'],
  [
    'A parte marcada como “Água”, onde aparecem os oceanos.',
    'A água cobre uma parte maior da superfície da Terra do que as terras.',
  ],
  [
    'Translação, em cerca de um ano.',
    'Rotação, em cerca de 24 horas.',
    'A rotação, o giro da Terra em torno de si.',
  ],
  [
    'A ponte e a escola.',
    'uma ligação entre a área de cultivo e o lugar onde os produtos são vendidos.',
    [
      'Descartar os resíduos nos recipientes combinados para a coleta.',
      'Organizar com adultos uma orientação para manter a margem sem resíduos.',
    ],
  ],
  [
    'O terreno vazio recebeu um posto de saúde.',
    'O mercado junto à chegada da ponte.',
    [
      'Pedir aos responsáveis a retirada das caixas que bloqueiam a passagem.',
      'Combinar com os responsáveis que a passagem da calçada deve ficar livre.',
    ],
  ],
  ['O campo e a cidade se ajudam.', 'Cuidamos da água e do solo.', 'A paisagem muda com o tempo.'],
];
async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
async function preparar(page, n) {
  await page.evaluate(
    ({ chave, n }) =>
      localStorage.setItem(chave, JSON.stringify({ versao: 1, questaoAtual: n - 1 })),
    { chave: CHAVE, n }
  );
  await page.reload();
  await abrir(page);
}
async function preencher(page, n) {
  for (const [i, valor] of GABARITO[n - 1].entries()) {
    if ([5, 30].includes(n)) await page.locator('[data-resposta-gramatica]').nth(i).fill(valor);
    else {
      const grupo = page.locator('[data-item-gramatica]').nth(i);
      for (const v of Array.isArray(valor) ? valor : [valor])
        await grupo.getByRole('button', { name: v, exact: true }).click();
    }
  }
}
async function conferir(page) {
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
}
async function responder(page, n) {
  await preencher(page, n);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}
async function estado(page, chave = CHAVE) {
  return page.evaluate((c) => JSON.parse(localStorage.getItem(c)), chave);
}
async function auditar(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const a = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(a.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
}
async function audio(page, semVoz = false) {
  await page.addInitScript((semVoz) => {
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      semVoz
        ? []
        : [
            { name: 'Remota', lang: 'pt-BR', localService: false },
            { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
          ];
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.cancel = () => {
      window.__cancelamentos++;
    };
    window.speechSynthesis.speak = (utterance) => {
      window.__falas.push({
        texto: utterance.text,
        idioma: utterance.lang,
        velocidade: utterance.rate,
        pitch: utterance.pitch,
        local: utterance.voice.localService,
      });
      utterance.onstart?.();
      utterance.onend?.();
    };
  }, semVoz);
}
test.beforeEach(async ({ page }) => {
  page.erros = [];
  page.on('pageerror', (e) => page.erros.push(e.message));
  page.on('console', (e) => {
    if (e.type() === 'error') page.erros.push(e.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => expect(page.erros).toEqual([]));

test('cadastro exclusivo, 75 subitens e diversidade editorial preservada', async ({ page }) => {
  const r = await page.evaluate(
    (id) => ({
      conteudo: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(r.registro).toMatchObject({
    aluno: 'mariana',
    totalEtapas: 30,
    chaveArmazenamento: CHAVE,
  });
  expect(r.conteudo).toMatchObject({
    materia: 'Geografia',
    chave: CHAVE,
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
  });
  expect(r.conteudo.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([CHAVE, AUX]);
  expect(r.conteudo.questoes).toHaveLength(30);
  expect(new Set(r.conteudo.questoes.map((q) => q.id)).size).toBe(30);
  expect(new Set(r.conteudo.questoes.map((q) => q.bloco)).size).toBe(6);
  const itens = r.conteudo.questoes.flatMap((q) => q.itens);
  expect(itens).toHaveLength(75);
  expect(new Set(itens.map((i) => i.id)).size).toBe(75);
  const contagens = { opcoes: 0, selecao: 0, ordenacao: 0, campos: 0 };
  const posicoes = [];
  const tres = [];
  for (const [qi, q] of r.conteudo.questoes.entries()) {
    expect(q.titulo).toMatch(new RegExp('^' + (qi + 1) + '\\. '));
    expect(q.leitura).toBeTruthy();
    expect(q.dica).toBeTruthy();
    expect(q.sucesso).toBeTruthy();
    expect(q.leituraTitulo).toBe('Leia para aprender');
    q.itens.forEach((item, i) => {
      const tipo = q.tipo === 'campos' ? 'campos' : item.tipo || 'opcoes';
      contagens[tipo]++;
      const esperado = GABARITO[qi][i];
      expect(item.respostas).toEqual(Array.isArray(esperado) ? esperado : [esperado]);
      if (tipo === 'opcoes') {
        expect(new Set(item.opcoes).size).toBe(item.opcoes.length);
        const p = item.opcoes.indexOf(esperado);
        expect(p).toBeGreaterThanOrEqual(0);
        posicoes.push(p);
        if (item.opcoes.length === 3) tres.push(p);
      }
      if (tipo === 'selecao') {
        const quantidade = item.pergunta.includes('três') ? 3 : 2;
        expect(item.respostas).toHaveLength(quantidade);
      }
    });
  }
  expect(contagens).toEqual({ opcoes: 57, selecao: 12, ordenacao: 1, campos: 5 });
  expect([0, 1, 2].map((p) => tres.filter((x) => x === p).length)).toEqual([17, 17, 17]);
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  for (const n of [5, 30]) {
    const q = r.conteudo.questoes[n - 1];
    expect(q).toMatchObject({
      ditado: true,
      unidadeDitado: n === 5 ? 'palavra' : 'frase',
      cancelarAoTrocarCampo: true,
    });
    for (const item of q.itens) {
      expect(item.pontuacaoFlexivel).toBe(true);
      expect(item.maiusculasObrigatorias).toBeFalsy();
      expect(item.acentuacaoObrigatoria).toBeFalsy();
      expect(q.leitura.toLowerCase()).not.toContain(item.respostas[0].toLowerCase());
    }
  }
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
});

test('percurso completo: vazio, erro, correção, retorno e recarga, sem pontos duplicados', async ({
  page,
}) => {
  test.setTimeout(240_000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${n} de 30`);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    expect(
      (await estado(page))?.tentativas?.[`geo-paisagens-q${String(n).padStart(2, '0')}`] || 0
    ).toBe(0);
    await preencher(page, n);
    // Uma resposta completa errada por questão; mantém todas as outras decisões.
    if ([5, 30].includes(n)) {
      await page
        .locator('[data-resposta-gramatica]')
        .first()
        .fill('palavras que não foram ditadas');
    } else if (n === 10) {
      await page.locator('[data-limpar-ordem-misto]').click();
      const ordem = GABARITO[9][0];
      for (const v of [ordem[1], ordem[0], ordem[2], ordem[3]])
        await page.getByRole('button', { name: v, exact: true }).click();
    } else {
      const grupo = page.locator('[data-item-gramatica]').first();
      const v = GABARITO[n - 1][0];
      if (Array.isArray(v)) await grupo.getByRole('button', { name: v[0], exact: true }).click();
      else await grupo.locator('button').filter({ hasNotText: v }).first().click();
    }
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n - 1} de 30`);
    const antes = await estado(page);
    if (n % 5 === 0) {
      await page.reload();
      await abrir(page);
      expect(await estado(page)).toEqual(antes);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    }
    if ([5, 30].includes(n))
      await page
        .locator('[data-resposta-gramatica]')
        .first()
        .fill(GABARITO[n - 1][0]);
    else if (n === 10) {
      await page.locator('[data-limpar-ordem-misto]').click();
      for (const v of GABARITO[9][0])
        await page.getByRole('button', { name: v, exact: true }).click();
    } else {
      const v = GABARITO[n - 1][0];
      await page
        .locator('[data-item-gramatica]')
        .first()
        .getByRole('button', { name: Array.isArray(v) ? v[0] : v, exact: true })
        .click();
    }
    await conferir(page);
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await page.locator('#gramatica-proxima').click();
    if (n < 30 && n % 5 === 0) {
      await page.locator('#gramatica-voltar').click();
      await page.reload();
      await abrir(page);
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
      await page.locator('#gramatica-proxima').click();
    }
  }
  expect(await estado(page)).toMatchObject({ pontos: 30, finalizada: true });
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('30 questões concluídas');
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('seleções e opções reversíveis: várias edições persistidas e teclado', async ({ page }) => {
  await preparar(page, 2);
  await preencher(page, 2);
  const grupo = page.locator('[data-item-gramatica]').first();
  const extra = grupo.getByRole('button', { name: 'Árvores na paisagem.', exact: true });
  await extra.focus();
  await page.keyboard.press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await extra.focus();
  await page.keyboard.press('Enter');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-item-gramatica] [aria-pressed="true"]')).toHaveCount(4);
  for (const item of [0, 1])
    await expect(
      page.locator('[data-item-gramatica]').nth(item).locator('[aria-pressed="true"]')
    ).toHaveCount(2);
  await page.locator('#gramatica-proxima').click();
  const b = page.locator('[data-item-gramatica]').first().locator('button').first();
  await b.click();
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await abrir(page);
  await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('ordenação parcial, retirada, reposição e limpeza persistem', async ({ page }) => {
  await preparar(page, 10);
  const ordem = GABARITO[9][0];
  for (const v of [ordem[1], ordem[0]])
    await page.getByRole('button', { name: v, exact: true }).click();
  await conferir(page);
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(2);
  await page.locator('[data-retirar-ordem-misto]').first().click();
  await page.locator('[data-retirar-ordem-misto]').first().click();
  await responder(page, 10);
  await page.locator('[data-limpar-ordem-misto]').click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  for (const v of ordem) await page.getByRole('button', { name: v, exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

for (const n of [5, 30])
  test(`Q${n}: escrita flexível, item vazio, sequência e edição após acerto`, async ({ page }) => {
    await preparar(page, n);
    const alvos = GABARITO[n - 1],
      campos = page.locator('[data-resposta-gramatica]');
    for (let i = 0; i < alvos.length - 1; i++) await campos.nth(i).fill(alvos[i]);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await campos.last().fill(n === 5 ? 'casinha' : 'O tempo muda a paisagem.');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    for (const [i, alvo] of alvos.entries())
      await campos.nth(i).fill(
        alvo
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .replaceAll(' ', '  ')
          .replace('.', '!')
      );
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
    await campos.first().fill('outra resposta');
    await conferir(page);
    await page.reload();
    await abrir(page);
    await expect(campos.first()).toHaveValue('outra resposta');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await campos.first().fill(alvos[0]);
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  });

for (const n of [5, 30])
  test(`Q${n}: áudio local protegido, sem vazamento, repetir, parar e cancelar`, async ({
    page,
  }) => {
    await audio(page);
    await preparar(page, n);
    const alvos = n === 5 ? PALAVRAS : FRASES;
    expect(await page.evaluate(() => window.__falas)).toEqual([]);
    for (const alvo of alvos)
      expect((await page.locator('#gramatica-conteudo').innerHTML()).toLowerCase()).not.toContain(
        alvo.toLowerCase()
      );
    for (const [i, alvo] of alvos.entries()) {
      await page.locator('[data-ouvir-ditado-gramatica]').nth(i).focus();
      await page.keyboard.press('Enter');
      const ultima = await page.evaluate(() => window.__falas.at(-1));
      expect(ultima).toEqual({
        texto: (n === 5 ? 'A palavra é: ' : 'A frase é: ') + alvo,
        idioma: 'pt-BR',
        velocidade: 0.78,
        pitch: 1,
        local: true,
      });
      await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
      await page.locator('[data-repetir-ditado-gramatica]').click();
      expect(await page.evaluate(() => window.__falas.at(-1))).toEqual(ultima);
      const cancelamentos = await page.evaluate(() => window.__cancelamentos);
      await page
        .locator('[data-resposta-gramatica]')
        .nth((i + 1) % alvos.length)
        .focus();
      expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(cancelamentos);
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
    }
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    const canc = await page.evaluate(() => window.__cancelamentos);
    await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
    expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(canc);
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    for (const alvo of alvos)
      expect((await page.locator('#gramatica-conteudo').innerHTML()).toLowerCase()).not.toContain(
        alvo.toLowerCase()
      );
  });

test('sem voz local, digitação e correção continuam disponíveis', async ({ page }) => {
  await audio(page, true);
  await preparar(page, 5);
  await page.locator('[data-resposta-gramatica]').first().fill('minha tentativa');
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText(/voz|vozes/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('minha tentativa');
  await responder(page, 5);
});

test('contratos geométricos: referências constantes, croqui e recursos locais', async ({
  page,
}) => {
  const svg = (nome) => fs.readFileSync('assets/geografia-paisagens-outubro/' + nome, 'utf8');
  const ipe = svg('ipe.svg');
  for (const ref of ['ipe', 'ponte', 'corrego']) {
    const nodes = ipe.match(
      new RegExp('<(?:g|rect|path)[^>]+data-reference="' + ref + '"[^>]*>', 'g')
    );
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBe(nodes[1]);
  }
  const croquis = svg('croquis.svg');
  expect(croquis.match(/Ponto de ônibus/g)).toHaveLength(1);
  for (const ref of ['Escola', 'Praça', 'Mercado', 'Farmácia'])
    expect(croquis.match(new RegExp('>' + ref + '<', 'g'))).toHaveLength(2);
  expect(svg('alface.svg')).not.toContain('marker-end');
  const fontes = await page.evaluate(
    (id) =>
      window.QuestionariosRevisoes.obterRevisao(id)
        .questoes.filter((q) => q.ilustracaoLeitura)
        .map((q) => q.ilustracaoLeitura),
    ID
  );
  expect(new Set(fontes).size).toBe(23);
  for (const src of new Set(fontes)) {
    const response = await page.request.get('/' + src.replace('../', ''));
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('<svg');
  }
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
])
  test(`layout, foco e acessibilidade ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize(viewport);
    for (const n of [1, 5, 10, 16, 21, 25, 27, 29, 30]) {
      await preparar(page, n);
      await auditar(page);
      await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
      const img = page.locator('.ilustracao-leitura-questionario');
      if (await img.count()) {
        expect(await img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
        const bounds = await img.boundingBox();
        expect(bounds.width).toBeGreaterThan(viewport.width === 390 ? 230 : 400);
      }
      if (n === 30) {
        const input = await page.locator('[data-resposta-gramatica]').first().boundingBox();
        expect(input.width).toBeGreaterThan(
          viewport.width === 390 ? 150 : viewport.width === 1366 ? 240 : 500
        );
      }
    }
    await page.keyboard.press('Control+Alt+R');
    await auditar(page);
    await page.screenshot({ path: `tmp/geografia-layout-${viewport.width}.png`, fullPage: true });
  });

test('toque permite retirar e repor a ordenação e marcar seleção', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(URL);
  await preparar(p, 10);
  const ordem = GABARITO[9][0];
  await p.getByRole('button', { name: ordem[0], exact: true }).tap();
  await p.locator('[data-retirar-ordem-misto]').tap();
  await expect(p.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  for (const v of ordem) await p.getByRole('button', { name: v, exact: true }).tap();
  for (const [i, v] of GABARITO[9].entries())
    if (i > 0)
      await p
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', { name: v, exact: true })
        .tap();
  await conferir(p);
  await expect(p.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(p, 2);
  for (const [i, vs] of GABARITO[1].entries())
    for (const v of vs)
      await p
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', { name: v, exact: true })
        .tap();
  await conferir(p);
  await expect(p.locator('#gramatica-proxima')).toBeEnabled();
  await auditar(p);
  await ctx.close();
});

test('Modo Responsável: salto puro, chaves distintas, Escape, retorno e recarga', async ({
  page,
}) => {
  await abrir(page);
  await responder(page, 1);
  const principal = await estado(page);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  expect(await estado(page, AUX)).toMatchObject({
    questaoAtual: 29,
    pontos: 0,
    respostas: {},
    pontuadas: {},
    corrigidas: {},
    tentativas: {},
  });
  expect(await estado(page)).toEqual(principal);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await page.locator('[data-resposta-gramatica]').first().focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await responder(page, 30);
  await page.locator('#gramatica-proxima').click();
  const auxiliar = await estado(page, AUX);
  expect(auxiliar.finalizada).toBe(false);
  expect(Object.keys(auxiliar.corrigidas)).toEqual(['geo-paisagens-q30']);
  expect(auxiliar.pontos).toBe(1);
  expect(
    await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID)
  ).toMatchObject({ pontos: 1, questaoAtual: 0 });
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 30 de 30');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-modo-responsavel-questao').fill('12');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await responder(page, 12);
  await page.locator('#gramatica-proxima').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 13 de 30');
  expect(await estado(page)).toEqual(principal);
});

test('limpeza afeta somente a sessão ativa; vizinhas e status do cartão preservados', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((c) => localStorage.setItem(c, JSON.stringify({ preservar: true }))),
    VIZINHAS
  );
  await abrir(page);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await responder(page, 1);
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterSituacao(id), ID)).toBe(
    'nao-iniciada'
  );
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await responder(page, 1);
  const principal = await estado(page);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page, AUX)).toBeNull();
  expect(await estado(page)).toEqual(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  const auxiliar = await estado(page, AUX);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await estado(page)).toBeNull();
  expect(await estado(page, AUX)).toEqual(auxiliar);
  expect(
    await page.evaluate(
      (chaves) => chaves.map((c) => JSON.parse(localStorage.getItem(c))),
      VIZINHAS
    )
  ).toEqual(VIZINHAS.map(() => ({ preservar: true })));
});

test('dados inválidos e incompatíveis, fallback bloqueado, revisão sem opt-in e file sem rede', async ({
  page,
  browser,
}) => {
  for (const dado of [
    '{inválido',
    JSON.stringify({
      questaoAtual: 999,
      respostas: { 'geo-paisagens-q04': ['fantasma', 'fantasma', 'fantasma'] },
      pontuadas: { fantasma: true },
      corrigidas: { fantasma: true },
      pontos: 900,
    }),
  ]) {
    await page.evaluate(({ c, d }) => localStorage.setItem(c, d), { c: CHAVE, d: dado });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    for (const m of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[m] = () => {
        throw new Error('bloqueado');
      };
  });
  const p = await ctx.newPage();
  await p.goto(URL);
  await abrir(p);
  await responder(p, 1);
  await p.locator('#gramatica-proxima').click();
  await p.locator('#gramatica-voltar').click();
  await expect(p.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await ctx.close();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  const rede = [];
  await page.route(/^https?:/, (r) => {
    rede.push(r.request().url());
    return r.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await preparar(page, 29);
  await expect(page.locator('.ilustracao-leitura-questionario')).toBeVisible();
  expect(rede).toEqual([]);
});
