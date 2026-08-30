const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CAMINHO = '/ambiente_interativo/index.html';
const ID = 'alice-gramatica-contos-digrafos-vocabulario';
const CHAVE = 'revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1';
const OUTRAS = [
  'revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1',
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.mariana.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2',
];

async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-contos-digrafos-alice').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}

async function prepararQuestao(page, numero) {
  await page.evaluate(
    ({ chave, numero }) => {
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: numero - 1 }));
    },
    { chave: CHAVE, numero }
  );
  await page.reload();
  await abrir(page);
}

async function preencher(page, respostas) {
  const campos = page.locator('[data-resposta-gramatica]');
  await expect(campos).toHaveCount(respostas.length);
  for (let i = 0; i < respostas.length; i++) await campos.nth(i).fill(respostas[i]);
}

async function responder(page, questao) {
  if (questao.tipo === 'campos') {
    await preencher(
      page,
      questao.itens.map((item) => item.respostas[0])
    );
  } else {
    for (let i = 0; i < questao.itens.length; i++) {
      await page
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', {
          name: questao.itens[i].respostas[0],
          exact: true,
        })
        .click();
    }
  }
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}

async function audioSimulado(page) {
  await page.addInitScript(() => {
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Online Portuguese', lang: 'pt-BR', localService: false },
      { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
      { name: 'Microsoft David', lang: 'en-US', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentos++;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falas.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        volume: fala.volume,
        local: fala.voice.localService,
      });
      if (fala.onstart) fala.onstart();
      if (fala.onend) fala.onend();
    };
  });
}

async function acessibilidade(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const resultado = await new AxeBuilder({ page })
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
  page.errosDaRevisao = [];
  page.on('pageerror', (erro) => page.errosDaRevisao.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosDaRevisao.push(mensagem.text());
  });
  await page.goto(CAMINHO);
});

test.afterEach(async ({ page }) => {
  expect(page.errosDaRevisao).toEqual([]);
});

test('cadastro exclusivo, quatro contos reaproveitados, 30 questões e cinco ditados', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.GramaticaQuestionarios.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
      contos: window.GramaticaQuestionarios.obterRevisao(
        'mariana-gramatica-contos-ortografia-pontuacao'
      ).questoes.slice(0, 4),
      antigas: [
        'alice-gramatica-h-til-vocabulario',
        'mariana-gramatica-h-til-vocabulario',
        'mariana-gramatica-revisao-ampla',
        'mariana-gramatica-contos-ortografia-pontuacao',
      ].map((id) => window.RegistroRevisoes.obter(id).totalEtapas),
    }),
    ID
  );
  expect(dados.registro).toMatchObject({
    aluno: 'alice',
    totalEtapas: 30,
    chaveArmazenamento: CHAVE,
    painelId: 'tela-gramatica-mariana',
    controladorCompartilhado: 'gramatica-questionarios',
  });
  expect(dados.revisao.chave).toBe(CHAVE);
  expect(dados.antigas).toEqual([25, 25, 40, 30]);
  const questoes = dados.revisao.questoes;
  expect(questoes).toHaveLength(30);
  expect(new Set(questoes.map((q) => q.id)).size).toBe(30);
  expect(questoes.slice(0, 4)).toEqual(dados.contos);
  expect(questoes.map((q) => q.bloco)).toEqual([
    ...Array(4).fill('Contos'),
    'Dígrafos',
    ...Array(3).fill('CH'),
    ...Array(3).fill('NH'),
    ...Array(3).fill('LH'),
    'Dígrafos',
    'Sílabas',
    'CH',
    'Dígrafos',
    ...Array(3).fill('Sinônimos'),
    ...Array(3).fill('Antônimos'),
    'Frase',
    'S com som de Z',
    'RR',
    'Dígrafos',
    'Frase',
    'Mini simulado',
  ]);
  expect(questoes.filter((q) => q.ditado).map((q) => q.id)).toEqual([
    'q08',
    'q11',
    'q14',
    'q18',
    'q29',
  ]);
  const respostas = (numero) => questoes[numero - 1].itens.map((i) => i.respostas[0]);
  expect(respostas(6)).toEqual(['cha', 'che', 'chi', 'cho', 'chu']);
  expect(respostas(9)).toEqual(['NHA', 'NHE', 'NHI', 'NHO', 'NHU']);
  expect(respostas(16)).toEqual(['chu-va', 'ga-li-nha', 'a-be-lha', 'co-e-lho']);
  expect(respostas(17)).toEqual(['chapa', 'bicho', 'chão', 'tacho', 'chama']);
  expect([8, 11, 14, 18, 29].map(respostas)).toEqual([
    ['chuva', 'chave', 'lanche', 'mochila'],
    ['ninho', 'banho', 'caminho', 'galinha'],
    ['abelha', 'coelho', 'folha', 'milho'],
    ['chave', 'galinha', 'coelho'],
    ['A galinha achou o milho.'],
  ]);
  expect(questoes[28]).toMatchObject({
    ditado: true,
    unidadeDitado: 'frase',
    itens: [{ fraseCompleta: true, maiusculasObrigatorias: true }],
  });
  expect(questoes[29].itens).toHaveLength(8);
  // Nenhuma alternativa errada pode ser aceita pela normalização declarada.
  for (const questao of questoes.filter((q) => q.tipo === 'opcoes')) {
    for (const item of questao.itens) {
      const normalizar = (valor) => {
        let texto = valor
          .trim()
          .replace(/\s+([.!?])/g, '$1')
          .replace(/\s+/g, ' ');
        if (!item.maiusculasObrigatorias) texto = texto.toLowerCase();
        if (!item.acentuacaoObrigatoria)
          texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return texto;
      };
      expect(
        item.opcoes.filter((o) => item.respostas.map(normalizar).includes(normalizar(o)))
      ).toEqual(item.respostas);
    }
  }
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-gramatica-contos-digrafos-alice')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  const cartao = page.locator('#abrir-gramatica-contos-digrafos-alice');
  await expect(cartao).toContainText('Não iniciada');
  await expect(page.locator('#abrir-gramatica-h-til')).toBeVisible();
  await expect(page.locator('#abrir-gramatica-contos')).toBeHidden();
  await cartao.click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('Q5, Q15 e Q30 ocultam exatamente o dígrafo sem revelar a palavra em outro texto', async ({
  page,
}) => {
  const casos = [
    {
      numero: 5,
      inicio: 0,
      itens: [
        ['__ave', 'chave', 'CH'],
        ['abe__a', 'abelha', 'LH'],
        ['vi__o', 'vinho', 'NH'],
        ['ni__o', 'ninho', 'NH'],
        ['coe__o', 'coelho', 'LH'],
        ['__uva', 'chuva', 'CH'],
      ],
    },
    {
      numero: 15,
      inicio: 0,
      itens: [
        ['mi__oca', 'minhoca', 'NH'],
        ['gali__a', 'galinha', 'NH'],
        ['ca__orro', 'cachorro', 'CH'],
        ['o__o', 'olho', 'LH'],
        ['joani__a', 'joaninha', 'NH'],
        ['a__o', 'alho', 'LH'],
        ['__ave', 'chave', 'CH'],
        ['coe__o', 'coelho', 'LH'],
      ],
    },
    {
      numero: 30,
      inicio: 1,
      itens: [
        ['__ave', 'chave', 'CH'],
        ['ni__o', 'ninho', 'NH'],
        ['coe__o', 'coelho', 'LH'],
      ],
    },
  ];
  for (const caso of casos) {
    await prepararQuestao(page, caso.numero);
    const questao = await page.evaluate(
      ({ id, numero }) => window.GramaticaQuestionarios.obterRevisao(id).questoes[numero - 1],
      { id: ID, numero: caso.numero }
    );
    expect(questao.itens).toHaveLength(caso.numero === 30 ? 8 : caso.itens.length);
    const html = await page.locator('#tela-gramatica-mariana').innerHTML();
    for (const [indice, [lacuna, palavra, digrafo]] of caso.itens.entries()) {
      const item = questao.itens[caso.inicio + indice];
      expect(item.pergunta.split(':').at(-1).trim()).toBe(lacuna);
      expect(lacuna.replace('__', digrafo.toLowerCase())).toBe(palavra);
      expect(item.opcoes).toEqual(['CH', 'LH', 'NH']);
      expect(item.respostas).toEqual([digrafo]);
      // Inclui título, instrução, pistas, dicas, outras alternativas e rótulos acessíveis.
      expect(html).not.toMatch(new RegExp('\\b' + palavra + '\\b', 'i'));
      expect(questao.dica).not.toMatch(new RegExp('\\b' + palavra + '\\b', 'i'));
      if (caso.numero !== 5) expect(item.pergunta.split(':')[0].length).toBeGreaterThan(10);
    }
    if (caso.numero === 30) {
      expect(questao.itens.slice(4).map((item) => item.respostas[0])).toEqual([
        'contente',
        'vazio',
        'mesa',
        'carro',
      ]);
    }
    const alvo = page.locator('[data-item-gramatica]').nth(caso.inicio);
    const resposta = caso.itens[0][2];
    await alvo.getByRole('button', { name: resposta === 'CH' ? 'NH' : 'CH', exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await responder(page, questao);
    await page.locator('#gramatica-proxima').click();
    if (caso.numero !== 30) {
      await page.locator('#gramatica-voltar').click();
      await expect(alvo.getByRole('button', { name: resposta, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
  }
});

test('persiste várias digitações, permite corrigir e restaura respostas e cartão em andamento', async ({
  page,
}) => {
  await prepararQuestao(page, 6);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('cha');
  await campos.nth(1).fill('c');
  await campos.nth(2).fill('chi');
  await campos.nth(2).press('Enter');
  await expect(page.locator('.retorno-gramatica')).toContainText('Complete todos');
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-contos-digrafos-alice')).toContainText(
    'Em andamento'
  );
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('cha');
  await expect(campos.nth(1)).toHaveValue('c');
  await expect(campos.nth(2)).toHaveValue('chi');
  await expect(campos.nth(3)).toHaveValue('');
  await preencher(page, ['cha', 'che', 'chi', 'cho', 'chu']);
  await campos.last().press('Enter');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('.campo-correto')).toHaveCount(5);
});

test('exige til na transformação, maiúscula na alternativa e grafia e ponto no ditado', async ({
  page,
}) => {
  await prepararQuestao(page, 17);
  await preencher(page, ['chapa', 'bicho', 'chao', 'tacho', 'chama']);
  await page.locator('[data-resposta-gramatica]').last().press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('[data-resposta-gramatica]').nth(2)).toHaveAttribute(
    'aria-invalid',
    'true'
  );
  await page.locator('[data-resposta-gramatica]').nth(2).fill('chão');
  await page.locator('[data-resposta-gramatica]').nth(2).press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await prepararQuestao(page, 25);
  for (const resposta of ['a andorinha voa para o ninho.', 'A andorinha voa para o ninho']) {
    await page.getByRole('button', { name: resposta, exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  await page.getByRole('button', { name: 'A andorinha voa para o ninho.', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await prepararQuestao(page, 29);
  const campo = page.locator('[data-resposta-gramatica]');
  for (const erro of [
    'a galinha achou o milho.',
    'A galinha achou o milho',
    'A galina achou o milho.',
    'A galinha axou o milho.',
    'A galinha achou o mio.',
  ]) {
    await campo.fill(erro);
    await campo.press('Enter');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(campo).toBeEditable();
  }
  await campo.fill('A galinha achou o milho.');
  await campo.press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`desktop amplo ${viewport.width} e opt-in isolado entre os dois perfis`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await abrir(page);
    const tela = page.locator('#tela-gramatica-mariana');
    await expect(tela).toHaveClass(/layout-desktop-amplo/);
    const caixa = await tela.boundingBox();
    expect(caixa.width).toBeGreaterThan(viewport.width * 0.92);
    expect(caixa.width).toBeLessThan(viewport.width * 0.96);
    const leitura = await page.locator('.leitura-gramatica').boundingBox();
    expect((await page.locator('.respostas-gramatica').boundingBox()).x).toBeGreaterThan(
      leitura.x + leitura.width
    );
    await acessibilidade(page);
    await page.screenshot({
      path: testInfo.outputPath(`conto-${viewport.width}.png`),
      fullPage: true,
    });
    await prepararQuestao(page, 8);
    const campos = page.locator('.campo-mariana');
    expect((await campos.nth(1).boundingBox()).x).toBeGreaterThan(
      (await campos.nth(0).boundingBox()).x
    );
    await expect(page.locator('.gramatica-com-leitura')).toHaveCount(0);
    await acessibilidade(page);
    await page.screenshot({
      path: testInfo.outputPath(`ditado-${viewport.width}.png`),
      fullPage: true,
    });
    for (const [perfil, cartao, amplo, total] of [
      ['Alice', '#abrir-gramatica-h-til', false, 25],
      ['Mariana', '#abrir-gramatica-h-til', false, 25],
      ['Mariana', '#abrir-gramatica-mariana', false, 40],
      ['Mariana', '#abrir-gramatica-contos', true, 30],
    ]) {
      await page.locator('#botao-inicio').click();
      await page.getByRole('button', { name: new RegExp(perfil) }).click();
      await page.locator(cartao).click();
      expect(await tela.evaluate((el) => el.classList.contains('layout-desktop-amplo'))).toBe(
        amplo
      );
      await expect(page.locator('#progresso-resumo')).toContainText('/' + total);
      await page.locator('#botao-inicio').click();
      await abrir(page);
      await expect(tela).toHaveClass(/layout-desktop-amplo/);
    }
  });
}

test('celular 390 × 844 com toque, ditado e axe sem overflow ou erros', async ({
  browser,
}, testInfo) => {
  test.setTimeout(60_000);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await audioSimulado(page);
  await page.goto('http://127.0.0.1:5173' + CAMINHO);
  await abrir(page);
  await page.getByRole('button', { name: 'conto', exact: true }).tap();
  await page.locator('[data-conferir-gramatica]').tap();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await acessibilidade(page);
  for (const numero of [8, 15, 28, 29, 30]) {
    await prepararQuestao(page, numero);
    await acessibilidade(page);
    await page.screenshot({ path: testInfo.outputPath(`celular-q${numero}.png`), fullPage: true });
    if (numero === 8) {
      await page.locator('[data-ouvir-ditado-gramatica]').first().tap();
      await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(3);
      await preencher(page, ['chuva', 'chave', 'lanche', 'mochila']);
      await page.locator('[data-conferir-gramatica]').tap();
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    }
  }
  expect(erros).toEqual([]);
  await context.close();
});

test('erro recuperável, teclado, retorno, recarga e edição após acerto sem duplicar pontos', async ({
  page,
}) => {
  await abrir(page);
  const proxima = page.locator('#gramatica-proxima');
  const errada = page.getByRole('button', { name: 'receita', exact: true });
  await errada.focus();
  await page.keyboard.press('Space');
  await page.locator('[data-conferir-gramatica]').click();
  await expect(proxima).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('Revise');
  await expect(errada).toBeEnabled();
  const correta = page.getByRole('button', { name: 'conto', exact: true });
  await correta.focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-conferir-gramatica]').click();
  await proxima.click();
  await page.locator('#gramatica-voltar').click();
  await expect(correta).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await abrir(page);
  await expect(proxima).toBeEnabled();
  await expect(correta).toHaveClass(/correta/);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await errada.click();
  await expect(proxima).toBeDisabled();
  await correta.click();
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('conclui as 30 questões pelo fluxo real e limpa somente a chave nova', async ({ page }) => {
  test.setTimeout(90_000);
  await page.evaluate(
    (chaves) =>
      chaves.forEach((chave) =>
        localStorage.setItem(
          chave,
          JSON.stringify({ marcador: chave, questaoAtual: 2, respostas: { q01: ['preservado'] } })
        )
      ),
    OUTRAS
  );
  await page.reload();
  await abrir(page);
  const questoes = await page.evaluate(
    (id) => window.GramaticaQuestionarios.obterRevisao(id).questoes,
    ID
  );
  for (const questao of questoes) {
    await responder(page, questao);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-gramatica-contos-digrafos-alice')).toContainText('Concluída');
  await page.locator('#abrir-gramatica-contos-digrafos-alice').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  await expect(page.locator('#progresso-resumo')).toContainText('30 questões concluídas');
  await page.reload();
  await abrir(page);
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.locator('#gramatica-voltar').click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('#gramatica-proxima').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Limpar progresso de Gramática' }).click();
  const valores = await page.evaluate(
    ({ chave, outras }) => ({
      nova: localStorage.getItem(chave),
      outras: outras.map((c) => localStorage.getItem(c)),
    }),
    { chave: CHAVE, outras: OUTRAS }
  );
  expect(valores.nova).toBeNull();
  for (let i = 0; i < OUTRAS.length; i++)
    expect(JSON.parse(valores.outras[i])).toEqual({
      marcador: OUTRAS[i],
      questaoAtual: 2,
      respostas: { q01: ['preservado'] },
    });
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('cinco ditados não revelam respostas nem tocam sozinhos e usam português local', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await audioSimulado(page);
  for (const numero of [8, 11, 14, 18, 29]) {
    await prepararQuestao(page, numero);
    expect(await page.evaluate(() => window.__falas)).toEqual([]);
    const questao = await page.evaluate(
      ({ id, numero }) => window.GramaticaQuestionarios.obterRevisao(id).questoes[numero - 1],
      { id: ID, numero }
    );
    const html = await page.locator('#gramatica-conteudo').innerHTML();
    for (const item of questao.itens) expect(html).not.toContain(item.respostas[0]);
    const botoes = page.locator('[data-ouvir-ditado-gramatica]');
    for (let i = 0; i < questao.itens.length; i++) {
      await botoes.nth(i).focus();
      await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      expect(
        await page.evaluate(() => window.AudioRevisoes.obterUltimaSolicitacao())
      ).toMatchObject({
        texto: questao.itens[i].respostas[0],
        idioma: 'pt-BR',
        velocidade: 0.78,
        unidadeDitado: questao.unidadeDitado,
      });
      await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
    }
    await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(3);
    const falas = await page.evaluate(() => window.__falas);
    expect(falas.map((f) => f.texto)).toEqual([
      'Preparando.',
      'Atenção.',
      questao.itens.at(-1).respostas[0],
    ]);
    expect(falas[0].volume).toBe(0.01);
    expect(falas.every((f) => f.idioma === 'pt-BR' && f.local)).toBe(true);
    expect(falas[2].velocidade).toBe(0.78);
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(6);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
  }
});

test('parar, trocar questão e sair cancelam falas pendentes sem duplicar ações ao reabrir', async ({
  page,
}) => {
  await audioSimulado(page);
  await prepararQuestao(page, 11);
  await page.clock.install();
  const botoes = page.locator('[data-ouvir-ditado-gramatica]');
  await botoes.first().click();
  await botoes.nth(1).click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.map((f) => f.texto))).toEqual([
    'Preparando.',
    'Atenção.',
    'banho',
  ]);
  await botoes.first().click();
  await page.locator('[data-parar-ditado-gramatica]').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(3);
  await botoes.first().click();
  await page.locator('#gramatica-voltar').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(3);
  await prepararQuestao(page, 11);
  await botoes.first().click();
  await page.locator('#botao-inicio').click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.length)).toBe(0);
  await abrir(page);
  await botoes.first().click();
  await page.clock.runFor(2200);
  expect(await page.evaluate(() => window.__falas.map((f) => f.texto))).toEqual([
    'Preparando.',
    'Atenção.',
    'ninho',
  ]);
});

test('tolera armazenamento corrompido e bloqueado com progresso em memória', async ({ page }) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{quebrado'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Bloqueado', 'SecurityError');
      },
    });
  });
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'conto', exact: true }).click();
  await page.locator('[data-conferir-gramatica]').click();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('bundle file:// mantém ditado, correção e progresso sem recurso externo', async ({ page }) => {
  const erros = [];
  const externos = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('request', (r) => {
    if (/^https?:/.test(r.url())) externos.push(r.url());
  });
  await audioSimulado(page);
  await page.goto(
    pathToFileURL(path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html')).href
  );
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await prepararQuestao(page, 29);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect
    .poll(() => page.evaluate(() => window.__falas.map((f) => f.texto)))
    .toEqual(['Preparando.', 'Atenção.', 'A galinha achou o milho.']);
  await preencher(page, ['A galinha achou o milho']);
  await page.locator('[data-conferir-gramatica]').click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await preencher(page, ['A galinha achou o milho.']);
  await page.locator('[data-resposta-gramatica]').press('Enter');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('A galinha achou o milho.');
  expect(erros).toEqual([]);
  expect(externos).toEqual([]);
});
