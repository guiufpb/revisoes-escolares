const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const URL = '/ambiente_interativo/index.html';
const UNIDADE = 'friends-level-1-atividade-1';
const IDS = {
  alice: 'alice-ingles-friends-atividade-1',
  mariana: 'mariana-ingles-friends-atividade-1',
};
const CHAVES = {
  alice: 'revisoesEscolares.alice.ingles.friendsAtividade1.v1',
  mariana: 'revisoesEscolares.mariana.ingles.friendsAtividade1.v1',
};

async function abrir(page, perfil) {
  await page.getByRole('button', { name: new RegExp(perfil, 'i') }).click();
  await page.locator('#abrir-ingles-friends-atividade-1').click();
  await expect(page.locator('#tela-ingles')).toBeVisible();
}

async function salvarPreRequisitos(page, perfil, audios = true, escritas = true) {
  await page.evaluate(
    ({ chave, unidadeId, audiosCompletos, escritasCompletas }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
      localStorage.setItem(
        chave,
        JSON.stringify({
          unidadeId: unidade.id,
          versao: unidade.versao,
          grupoAtual: unidade.grupos[0].id,
          itemAtual: unidade.grupos[0].itens[0].id,
          itensOuvidos: audiosCompletos ? itens.map((item) => item.id) : [],
          reproducoes: audiosCompletos ? itens.length : 0,
          respostasEscrita: escritasCompletas
            ? Object.fromEntries(itens.map((item) => [item.id, item.ingles]))
            : {},
          conferenciasEscrita: escritasCompletas
            ? Object.fromEntries(itens.map((item) => [item.id, 'correta']))
            : {},
          iniciado: audiosCompletos || escritasCompletas,
        })
      );
    },
    {
      chave: CHAVES[perfil],
      unidadeId: UNIDADE,
      audiosCompletos: audios,
      escritasCompletas: escritas,
    }
  );
}

async function instalarAudioSimulado(page) {
  await page.evaluate(() => {
    window.__falasFriends = [];
    window.__cancelamentosFriends = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
      { name: 'Microsoft Maria Desktop', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosFriends += 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasFriends.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        pitch: fala.pitch,
      });
      fala.onstart?.();
      fala.onend?.();
    };
    window.AudioRevisoes.atualizarVozes();
  });
}

test.beforeEach(async ({ page }) => {
  page.errosFriends = [];
  page.on('pageerror', (erro) => page.errosFriends.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosFriends.push(mensagem.text());
  });
  await page.goto(URL);
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    [CHAVES.alice, CHAVES.mariana]
  );
  await page.reload();
});

test.afterEach(async ({ page }) => expect(page.errosFriends).toEqual([]));

test('cadastra uma unidade compartilhada com 25 itens e 25 questões para os dois perfis', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ unidadeId, ids }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
      const configuracoes = Object.values(window.ConfiguracoesIngles).filter(
        (configuracao) => configuracao.unidadeId === unidadeId
      );
      return {
        unidade,
        itens,
        configuracoes,
        registros: ids.map((id) => window.RegistroRevisoes.obter(id)),
        atividadesPedagogicas: Object.fromEntries(
          unidade.atividades
            .filter((questao) =>
              [
                'q06-eight-numeral',
                'q07-seven-word',
                'q08-four-numeral',
                'q09-ten',
                'q13-after-b',
                'q14-before-t',
                'q15-alphabet-sequence',
                'q16-after-m',
              ].includes(questao.id)
            )
            .map((questao) => [questao.id, questao])
        ),
      };
    },
    { unidadeId: UNIDADE, ids: Object.values(IDS) }
  );

  expect(dados.unidade.perfisDisponiveis).toEqual(['alice', 'mariana']);
  expect(dados.unidade.layout).toEqual({ desktopAmplo: true });
  expect(dados.unidade.praticaEscrita).toEqual({
    habilitada: true,
    obrigatoriaParaAtividades: true,
  });
  expect(dados.unidade.grupos.map((grupo) => grupo.itens.length)).toEqual([2, 10, 6, 7]);
  expect(dados.itens).toHaveLength(25);
  expect(new Set(dados.itens.map((item) => item.id)).size).toBe(25);
  expect(dados.itens.slice(18).every((item) => item.unidadeAudio === 'frase')).toBe(true);
  expect(dados.unidade.atividades).toHaveLength(25);
  expect(new Set(dados.unidade.atividades.map((questao) => questao.id)).size).toBe(25);
  expect(
    dados.unidade.atividades.every(
      (questao) =>
        questao.perguntaIngles &&
        questao.instrucaoPortugues &&
        questao.feedbackErro &&
        questao.explicacao &&
        questao.alternativas.some((alternativa) => alternativa.id === questao.respostaCorreta)
    )
  ).toBe(true);
  expect(dados.configuracoes.map((configuracao) => configuracao.revisaoId).sort()).toEqual(
    Object.values(IDS).sort()
  );
  expect(
    new Set(dados.configuracoes.map((configuracao) => configuracao.chaveArmazenamento))
  ).toEqual(new Set(Object.values(CHAVES)));
  expect(dados.registros.map((registro) => registro.totalEtapas)).toEqual([50, 50]);
  expect(dados.registros.map((registro) => registro.chaveArmazenamento)).toEqual([
    CHAVES.alice,
    CHAVES.mariana,
  ]);

  const numeros = [
    [
      'q06-eight-numeral',
      'Which word matches 8?',
      '8',
      { 3: 'three', 6: 'six', 8: 'eight', 9: 'nine' },
    ],
    [
      'q07-seven-word',
      'Which word matches 7?',
      'seven',
      { six: 'six', seven: 'seven', eight: 'eight', ten: 'ten' },
    ],
    [
      'q08-four-numeral',
      'Which word matches 4?',
      '4',
      { 2: 'two', 4: 'four', 5: 'five', 7: 'seven' },
    ],
    ['q09-ten', 'Which word matches 10?', '10', { 1: 'one', 6: 'six', 9: 'nine', 10: 'ten' }],
  ];
  numeros.forEach(([id, pergunta, respostaCorreta, alternativas]) => {
    const questao = dados.atividadesPedagogicas[id];
    expect(questao.perguntaIngles).toBe(pergunta);
    expect(questao.respostaCorreta).toBe(respostaCorreta);
    expect(
      Object.fromEntries(questao.alternativas.map(({ id: opcaoId, texto }) => [opcaoId, texto]))
    ).toEqual(alternativas);
    expect(questao.alternativas.every((alternativa) => !alternativa.traducao)).toBe(true);
  });

  const alfabeto = {
    'q13-after-b': ['Which letter comes after B?', 'c', ['a', 'c', 'd', 'p']],
    'q14-before-t': ['Which letter comes before T?', 's', ['r', 's', 'u', 'v']],
    'q15-alphabet-sequence': [
      'Which letter comes after H and before J?',
      'i',
      ['f', 'i', 'k', 'l'],
    ],
    'q16-after-m': ['Which letter comes after M?', 'n', ['l', 'n', 'o', 'w']],
  };
  Object.entries(alfabeto).forEach(([id, [pergunta, respostaCorreta, idsAlternativas]]) => {
    const questao = dados.atividadesPedagogicas[id];
    expect(questao.perguntaIngles).toBe(pergunta);
    expect(questao.respostaCorreta).toBe(respostaCorreta);
    expect(questao.alternativas.map((alternativa) => alternativa.id).sort()).toEqual(
      idsAlternativas
    );
    expect(questao.alternativas.every((alternativa) => !alternativa.traducao)).toBe(true);
  });
});

test('usa Word e Phrase em um único utterance e restaura a escrita manual corrigível', async ({
  page,
}) => {
  await instalarAudioSimulado(page);
  await abrir(page, 'Alice');
  expect(await page.evaluate(() => window.__falasFriends)).toEqual([]);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');

  const campo = page.getByLabel('Digite a palavra ou expressão em inglês');
  await expect(campo).toHaveValue('');
  await page.locator('[data-item-ingles="name"]').press('Enter');
  await expect.poll(() => page.evaluate(() => window.__falasFriends.length)).toBe(1);
  expect(await page.evaluate(() => window.__falasFriends[0])).toEqual({
    texto: 'Word: name',
    idioma: 'en-US',
    velocidade: 0.62,
    pitch: 1,
  });
  await expect(campo).toHaveValue('');
  await page.getByRole('button', { name: 'Ouvir devagar' }).click();
  expect(await page.evaluate(() => window.__falasFriends.at(-1).velocidade)).toBe(0.5);
  await expect(page.locator('[data-item-ingles="name"]')).toContainText('✓ Ouvido');

  await campo.fill('neme');
  await campo.press('Enter');
  await expect(campo).toHaveAttribute('aria-invalid', 'true');
  await campo.fill('  NaMe  ');
  await campo.press('Enter');
  await expect(page.locator('[data-item-ingles="name"]')).toContainText('✓ Escrito');
  await campo.press('End');
  await campo.type('x');
  await expect(page.locator('[data-item-ingles="name"]')).not.toContainText('✓ Escrito');
  await campo.fill('nam');

  await page.locator('[data-grupo-ingles="frases-essenciais"]').click();
  expect(await page.evaluate(() => window.__falasFriends.length)).toBe(2);
  await page.locator('[data-item-ingles="hi"]').press('Space');
  await expect
    .poll(() => page.evaluate(() => window.__falasFriends.at(-1).texto))
    .toBe('Phrase: Hi!');
  await expect(page.locator('#ingles-palavra-copia')).toHaveText('Hi!');
  const antesDeRepetir = await page.evaluate(() => window.__falasFriends.length);
  await page.getByRole('button', { name: 'Repetir' }).click();
  await expect
    .poll(() => page.evaluate(() => window.__falasFriends.length))
    .toBe(antesDeRepetir + 1);
  expect(await page.evaluate(() => window.__falasFriends.at(-1).texto)).toBe('Phrase: Hi!');
  const cancelamentos = await page.evaluate(() => window.__cancelamentosFriends);
  await page.getByRole('button', { name: 'Parar' }).click();
  expect(await page.evaluate(() => window.__cancelamentosFriends)).toBeGreaterThan(cancelamentos);

  await page.locator('[data-grupo-ingles="apresentacao"]').click();
  await expect(campo).toHaveValue('nam');
  await page.reload();
  await abrir(page, 'Alice');
  await expect(campo).toHaveValue('nam');
  await expect(page.locator('[data-item-ingles="name"]')).toContainText('✓ Ouvido');
});

test('mantém portão, progresso, limpeza e estados de Alice e Mariana independentes', async ({
  page,
  browser,
}) => {
  await salvarPreRequisitos(page, 'alice', true, false);
  await salvarPreRequisitos(page, 'mariana', false, true);
  await page.reload();
  await abrir(page, 'Alice');
  await expect(page.getByText(/Faltam 0 áudios e 25 escritas/)).toBeVisible();
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();
  await page.locator('#botao-inicio').click();
  await abrir(page, 'Mariana');
  await expect(page.getByText(/Faltam 25 áudios e 0 escritas/)).toBeVisible();
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();

  await salvarPreRequisitos(page, 'alice');
  await page.reload();
  await abrir(page, 'Alice');
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('25/25 áudios · 25/25 escritas');
  await expect(page.getByRole('button', { name: 'Começar as 25 atividades →' })).toBeEnabled();
  expect(
    await page.evaluate(
      ({ alice, mariana }) => ({
        alice: window.InglesRevisoes.obterSituacao('alice', alice),
        mariana: window.InglesRevisoes.obterSituacao('mariana', mariana),
      }),
      IDS
    )
  ).toEqual({ alice: 'em-andamento', mariana: 'em-andamento' });

  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(
    await page.evaluate(
      ({ alice, mariana }) => ({
        alice: localStorage.getItem(alice),
        mariana: localStorage.getItem(mariana) !== null,
      }),
      CHAVES
    )
  ).toEqual({ alice: null, mariana: true });

  await page.evaluate((chave) => localStorage.setItem(chave, '{json-invalido'), CHAVES.alice);
  await page.reload();
  await abrir(page, 'Alice');
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');

  const contextoBloqueado = await browser.newContext();
  await contextoBloqueado.addInitScript(() => {
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
    ];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      fala.onstart?.();
      fala.onend?.();
    };
    for (const metodo of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[metodo] = () => {
        throw new Error('localStorage bloqueado');
      };
    }
  });
  const paginaBloqueada = await contextoBloqueado.newPage();
  await paginaBloqueada.goto(URL);
  await abrir(paginaBloqueada, 'Alice');
  await paginaBloqueada.locator('[data-item-ingles="name"]').click();
  await expect(paginaBloqueada.locator('[data-item-ingles="name"]')).toContainText('✓ Ouvido');
  await contextoBloqueado.close();
});

test('permite errar, corrigir, voltar, recarregar e concluir 25 pontos sem duplicação', async ({
  page,
}) => {
  test.setTimeout(120000);
  await salvarPreRequisitos(page, 'alice');
  await page.reload();
  await abrir(page, 'Alice');
  await page.getByRole('button', { name: 'Começar as 25 atividades →' }).click();

  const primeira = await page.evaluate((unidadeId) => {
    const questao = window.RegistroIngles.obter(unidadeId).atividades[0];
    return {
      correta: questao.respostaCorreta,
      errada: questao.alternativas.find((alternativa) => alternativa.id !== questao.respostaCorreta)
        .id,
      feedback: questao.feedbackErro,
    };
  }, UNIDADE);
  await page.locator(`[data-alternativa-atividade-ingles="${primeira.errada}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-status-atividade')).toContainText(primeira.feedback);
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
  await page.locator(`[data-alternativa-atividade-ingles="${primeira.correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  const letrasCorretas = [
    await page
      .locator(`[data-alternativa-atividade-ingles="${primeira.correta}"] .letra-opcao`)
      .textContent(),
  ];
  await page.getByRole('button', { name: 'Próxima →' }).click();
  await page.getByRole('button', { name: '← Anterior' }).click();
  await expect(
    page.locator(`[data-alternativa-atividade-ingles="${primeira.correta}"]`)
  ).toHaveClass(/correta/);
  await page.getByRole('button', { name: 'Próxima →' }).click();
  await page.reload();
  await abrir(page, 'Alice');
  await page.getByRole('button', { name: 'Continuar atividades →' }).click();
  await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 2 de 25');

  for (let indice = 1; indice < 25; indice += 1) {
    const correta = await page.evaluate((unidadeId) => {
      const estado = window.InglesRevisoes.obterEstado();
      return window.RegistroIngles.obter(unidadeId).atividades[estado.questaoAtual].respostaCorreta;
    }, UNIDADE);
    const alternativa = page.locator(`[data-alternativa-atividade-ingles="${correta}"]`);
    letrasCorretas.push(await alternativa.locator('.letra-opcao').textContent());
    await alternativa.click();
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 24 ? 'Concluir revisão ✓' : 'Próxima →' })
      .click();
  }

  await expect(page.getByText('Alice, você acertou 25 de 25 atividades.')).toBeVisible();
  expect(new Set(letrasCorretas)).toEqual(new Set(['A', 'B', 'C', 'D']));
  expect(letrasCorretas.join('')).not.toMatch(/(A{4}|B{4}|C{4}|D{4})/);
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    26
  );
  await page.reload();
  await abrir(page, 'Alice');
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  await expect(page.locator('.item-revisao-ingles')).toHaveCount(25);
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    26
  );
  expect(
    await page.evaluate(
      ({ idAlice, idMariana }) => ({
        alice: window.InglesRevisoes.obterSituacao('alice', idAlice),
        mariana: window.InglesRevisoes.obterSituacao('mariana', idMariana),
      }),
      { idAlice: IDS.alice, idMariana: IDS.mariana }
    )
  ).toEqual({ alice: 'concluida', mariana: 'nao-iniciada' });
});

test('imagens avaliativas preservam cor, quantidade e texto alternativo sem duplicação', async ({
  page,
}) => {
  await salvarPreRequisitos(page, 'mariana');
  await page.evaluate((chave) => {
    const estado = JSON.parse(localStorage.getItem(chave));
    estado.questaoAtual = 17;
    estado.atividadeIniciada = true;
    localStorage.setItem(chave, JSON.stringify(estado));
  }, CHAVES.mariana);
  await page.reload();
  await abrir(page, 'Mariana');
  await page.getByRole('button', { name: 'Continuar atividades →' }).click();
  await expect(page.locator('#ingles-imagens-enunciado img')).toHaveCount(1);
  await expect(page.locator('#ingles-imagens-enunciado img')).toHaveAttribute(
    'alt',
    'Um balão verde.'
  );

  const ativos = await page.evaluate(async () => {
    const [balao, mochila] = await Promise.all([
      window
        .fetch('../assets/objetos_escolares/green-balloon.svg')
        .then((resposta) => resposta.text()),
      window
        .fetch('../assets/objetos_escolares/blue-backpack.svg')
        .then((resposta) => resposta.text()),
    ]);
    return { balao, mochila };
  });
  expect(ativos.balao).toContain('#2f9e44');
  expect(ativos.mochila).toContain('#2f80ed');

  await page.evaluate((chave) => {
    const estado = JSON.parse(localStorage.getItem(chave));
    estado.questaoAtual = 18;
    localStorage.setItem(chave, JSON.stringify(estado));
  }, CHAVES.mariana);
  await page.reload();
  await abrir(page, 'Mariana');
  await page.getByRole('button', { name: 'Continuar atividades →' }).click();
  await expect(page.locator('#ingles-imagens-enunciado img')).toHaveAttribute(
    'alt',
    'Uma mochila azul.'
  );

  await page.evaluate((chave) => {
    const estado = JSON.parse(localStorage.getItem(chave));
    estado.questaoAtual = 23;
    localStorage.setItem(chave, JSON.stringify(estado));
  }, CHAVES.mariana);
  await page.reload();
  await abrir(page, 'Mariana');
  await page.getByRole('button', { name: 'Continuar atividades →' }).click();
  const imagens = page.locator('#ingles-imagens-enunciado img');
  await expect(imagens).toHaveCount(2);
  await expect(imagens.nth(0)).toHaveAttribute('alt', 'Dois balões verdes.');
  await expect(imagens.nth(1)).toHaveAttribute('alt', '');
});

test('Desktop Amplo funciona em celular e desktops, remove a classe no legado e abre por file', async ({
  page,
  browser,
}) => {
  const contextoToque = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const paginaToque = await contextoToque.newPage();
  await paginaToque.goto(URL);
  await abrir(paginaToque, 'Alice');
  await expect(paginaToque.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
  expect(
    await paginaToque.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ).toBe(true);
  await paginaToque.locator('[data-item-ingles="name"]').tap();
  const axe = await new AxeBuilder({ page: paginaToque })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    axe.violations.filter((violacao) => ['serious', 'critical'].includes(violacao.impact))
  ).toEqual([]);
  await contextoToque.close();

  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await abrir(page, 'Alice');
    await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.locator('#botao-inicio').click();
  }

  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('[data-materia="ingles"]').click();
  await expect(page.locator('#tela-ingles')).not.toHaveClass(/layout-desktop-amplo/);

  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page, 'Mariana');
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');
  expect(rede).toEqual([]);
});
