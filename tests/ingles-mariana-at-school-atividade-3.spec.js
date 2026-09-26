const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const URL = '/ambiente_interativo/index.html';
const UNIDADE = 'at-school-atividade-3';
const REVISAO = 'mariana-ingles-at-school-atividade-3';
const CHAVE = 'revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1';
const CHAVE_ACTIVITY_1 = 'revisoesEscolares.mariana.ingles.friendsAtividade1.v1';
const CHAVE_ACTIVITY_2 = 'revisoesEscolares.mariana.ingles.atSchoolAtividade2.v1';

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-at-school-atividade-3').click();
  await expect(page.locator('#tela-ingles')).toBeVisible();
}

async function salvarPreRequisitos(page, audios = true, escritas = true, historiaConcluida = true) {
  await page.evaluate(
    ({ chave, unidadeId, audiosCompletos, escritasCompletas, historiaCompleta }) => {
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
          historiaConcluida: historiaCompleta,
          iniciado: true,
        })
      );
    },
    {
      chave: CHAVE,
      unidadeId: UNIDADE,
      audiosCompletos: audios,
      escritasCompletas: escritas,
      historiaCompleta: historiaConcluida,
    }
  );
}

async function instalarAudioControlado(page) {
  await page.evaluate(() => {
    window.__falasActivity3 = [];
    window.__sequenciasActivity3 = [];
    window.__cancelamentosActivity3 = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
      { name: 'Microsoft Maria Desktop', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosActivity3 += 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasActivity3.push(fala);
      fala.onstart?.();
    };
    window.AudioRevisoes.atualizarVozes();
    const falarSequenciaOriginal = window.AudioRevisoes.falarSequencia;
    window.AudioRevisoes.falarSequencia = (opcoes) => {
      window.__sequenciasActivity3.push({
        origem: opcoes.origem,
        etapas: opcoes.etapas.map((etapa) => ({
          texto: etapa.texto,
          idioma: etapa.idioma,
          unidadeAudio: etapa.unidadeAudio,
        })),
      });
      return falarSequenciaOriginal({ ...opcoes, pausaMs: 0 });
    };
  });
}

async function instalarAudioAutomatico(page) {
  await page.evaluate(() => {
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
      { name: 'Microsoft Maria Desktop', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      fala.onstart?.();
      fala.onend?.();
    };
    window.AudioRevisoes.atualizarVozes();
  });
}

async function concluirUltimoAudio(page) {
  await page.evaluate(() => window.__falasActivity3.at(-1).onend());
}

async function ouvirPergunta(page) {
  await page.locator('#ingles-ouvir-pergunta').click();
  await concluirUltimoAudio(page);
}

async function concluirRevisao(page) {
  const quantidadeInicial = await page.evaluate(() => window.__falasActivity3.length);
  await page.locator('#ingles-ouvir-revisao').click();
  for (let indice = 0; indice < 4; indice += 1) {
    await expect
      .poll(() => page.evaluate(() => window.__falasActivity3.length))
      .toBe(quantidadeInicial + indice + 1);
    await page.evaluate(
      (posicao) => window.__falasActivity3[posicao].onend(),
      quantidadeInicial + indice
    );
  }
}

test.beforeEach(async ({ page }) => {
  page.errosActivity3 = [];
  page.on('pageerror', (erro) => page.errosActivity3.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosActivity3.push(mensagem.text());
  });
  await page.goto(URL);
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    [CHAVE, CHAVE_ACTIVITY_1, CHAVE_ACTIVITY_2]
  );
  await page.reload();
});

test.afterEach(async ({ page }) => expect(page.errosActivity3).toEqual([]));

test('cadastra somente para Mariana 17 itens, Story Time, 25 questões e 43 etapas', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ unidadeId, revisaoId }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      return {
        unidade,
        itens: unidade.grupos.flatMap((grupo) => grupo.itens),
        registro: window.RegistroRevisoes.obter(revisaoId),
        configuracao: window.ConfiguracoesIngles.marianaAtSchoolAtividade3,
        configuracaoAlice: Object.values(window.ConfiguracoesIngles).find(
          (configuracao) => configuracao.unidadeId === unidadeId && configuracao.perfil === 'alice'
        ),
      };
    },
    { unidadeId: UNIDADE, revisaoId: REVISAO }
  );

  expect(dados.unidade.perfisDisponiveis).toEqual(['mariana']);
  expect(dados.unidade.grupos.map((grupo) => grupo.id)).toEqual([
    'story-values',
    'phonics-letter-a',
    'senses',
    'create-that',
  ]);
  expect(dados.unidade.grupos.map((grupo) => grupo.itens.length)).toEqual([7, 4, 5, 1]);
  expect(dados.itens).toHaveLength(17);
  expect(new Set(dados.itens.map((item) => item.id)).size).toBe(17);
  expect(dados.unidade.atividades).toHaveLength(25);
  expect(new Set(dados.unidade.atividades.map((questao) => questao.id)).size).toBe(25);
  expect(dados.unidade.praticaEscrita).toEqual({
    habilitada: true,
    obrigatoriaParaAtividades: true,
  });
  expect(dados.unidade.exigirAudioPerguntaAntesDeResponder).toBe(true);
  expect(dados.unidade.revisaoPosResposta).toEqual({
    obrigatoria: true,
    pausaMs: 350,
    manterTelaAposErro: true,
  });
  expect(dados.unidade.destinatariaMensagemFinal).toBe('as meninas');
  expect(dados.unidade.historia).toMatchObject({
    tituloIngles: 'Story Time · Watch Out, Flash!',
    tituloPortugues: 'História · Cuidado, Flash!',
    questoesComConsulta: 7,
  });
  expect(dados.unidade.historia.cenas).toHaveLength(6);
  expect(dados.unidade.historia.cenas.map((cena) => cena.id)).toEqual([
    'watch-out',
    'im-sorry',
    'its-ok',
    'notebook',
    'friends-help',
    'thank-you',
  ]);
  const historiaCompleta = dados.unidade.historia.cenas
    .map((cena) => `${cena.textoIngles} ${cena.textoPortugues}`)
    .join(' ');
  for (const informacao of [
    'Watch out!',
    'I’m sorry.',
    'It’s OK.',
    'notebook',
    'pencil case',
    'ruler',
    'book',
    'Thank you!',
    'Helping each other',
  ]) {
    expect(historiaCompleta).toContain(informacao);
  }
  expect(
    dados.unidade.atividades.every(
      (questao) =>
        questao.perguntaIngles &&
        questao.instrucaoPortugues &&
        questao.explicacao &&
        questao.feedbackErro &&
        questao.alternativas.some((alternativa) => alternativa.id === questao.respostaCorreta) &&
        questao.revisaoPosResposta?.perguntaPortugues &&
        questao.revisaoPosResposta?.respostaIngles &&
        questao.revisaoPosResposta?.significadoPortugues &&
        ['palavra', 'frase'].includes(questao.revisaoPosResposta.unidadeRespostaIngles) &&
        ['palavra', 'frase'].includes(questao.revisaoPosResposta.unidadeSignificadoPortugues)
    )
  ).toBe(true);
  expect(dados.registro).toMatchObject({
    id: REVISAO,
    aluno: 'mariana',
    titulo: 'English Review · At School · Activity 3',
    cartaoId: 'abrir-ingles-at-school-atividade-3',
    chaveArmazenamento: CHAVE,
    totalEtapas: 43,
  });
  expect(dados.configuracao).toMatchObject({
    perfil: 'mariana',
    revisaoId: REVISAO,
    unidadeId: UNIDADE,
    chaveArmazenamento: CHAVE,
  });
  expect(dados.configuracaoAlice).toBeUndefined();
});

test('mostra o cartão só para Mariana e exige áudio e escrita nos 17 itens', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/i }).click();
  await expect(page.locator('#abrir-ingles-at-school-atividade-3')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/17 áudios · 0/17 escritas');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();

  await salvarPreRequisitos(page, true, false);
  await page.reload();
  await abrir(page);
  await expect(page.getByText(/Faltam 0 áudios e 17 escritas/)).toBeVisible();
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();

  await salvarPreRequisitos(page, false, true);
  await page.reload();
  await abrir(page);
  await expect(page.getByText(/Faltam 17 áudios e 0 escritas/)).toBeVisible();
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();

  await salvarPreRequisitos(page, true, true, false);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('17/17 áudios · 17/17 escritas');
  await expect(page.getByText(/Great work! Você ouviu e escreveu os 17 itens/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir Story Time →' })).toBeEnabled();
});

test('Story Time é bilíngue, não toca sozinha, navega, restaura e antecede Q1', async ({
  page,
}) => {
  await salvarPreRequisitos(page, true, true, false);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  expect(await page.evaluate(() => window.__falasActivity3.length)).toBe(0);

  await page.getByRole('button', { name: 'Abrir Story Time →' }).click();
  await expect(page.locator('#ingles-story-time')).toBeVisible();
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 1 de 6');
  await expect(page.locator('#ingles-story-time-texto-ingles')).toContainText('Watch out!');
  await expect(page.locator('#ingles-story-time-texto-portugues')).toContainText('Cuidado!');
  expect(await page.evaluate(() => window.__falasActivity3.length)).toBe(0);

  await page.getByRole('button', { name: '🔊 Ouvir cena' }).click();
  expect(await page.evaluate(() => window.__sequenciasActivity3.at(-1))).toMatchObject({
    origem: 'ingles-story-time',
    etapas: [{ idioma: 'en-US' }, { idioma: 'pt-BR' }],
  });
  await concluirUltimoAudio(page);
  await expect.poll(() => page.evaluate(() => window.__falasActivity3.length)).toBe(2);
  await concluirUltimoAudio(page);
  await expect(page.locator('#ingles-story-time-status')).toContainText('Cena ouvida');

  await page.getByRole('button', { name: 'Próxima cena →' }).click();
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 2 de 6');
  await page.reload();
  await abrir(page);
  await expect(page.locator('#ingles-story-time')).toBeVisible();
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 2 de 6');
  await page.getByRole('button', { name: '← Cena anterior' }).click();
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 1 de 6');

  for (let cena = 1; cena < 6; cena += 1) {
    await page.getByRole('button', { name: 'Próxima cena →' }).click();
  }
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 6 de 6');
  await page.getByRole('button', { name: 'Começar as 25 atividades →' }).click();
  await expect(page.locator('#ingles-painel-atividades')).toBeVisible();
  await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 1 de 25');
  await expect(page.locator('[data-alternativa-atividade-ingles]').first()).toBeDisabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado())).toMatchObject({
    historiaCenaAtual: 5,
    historiaConcluida: true,
    historiaEmExibicao: false,
    atividadeIniciada: true,
  });
});

test('Rever história preserva Q1, pergunta ouvida e resposta ao voltar', async ({ page }) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioAutomatico(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await page.locator('#ingles-ouvir-pergunta').click();
  await page.locator('[data-alternativa-atividade-ingles="watch-out"]').click();
  const antes = await page.evaluate(() => window.InglesRevisoes.obterEstado());

  await page.getByRole('button', { name: '📖 Rever história' }).click();
  await expect(page.locator('#ingles-story-time')).toBeVisible();
  await expect(page.getByRole('button', { name: '← Voltar à questão' })).toBeVisible();
  await page.getByRole('button', { name: 'Próxima cena →' }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#ingles-story-time-progresso')).toHaveText('Cena 2 de 6');
  await page.getByRole('button', { name: '← Voltar à questão' }).click();

  await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 1 de 25');
  await expect(page.locator('[data-alternativa-atividade-ingles="watch-out"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('[data-alternativa-atividade-ingles]').first()).toBeEnabled();
  const depois = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(depois.questaoAtual).toBe(antes.questaoAtual);
  expect(depois.respostasAtividades).toEqual(antes.respostasAtividades);
  expect(depois.perguntasOuvidasAtividades).toEqual(antes.perguntasOuvidasAtividades);
  expect(depois.revisoesPosRespostaConcluidas).toEqual(antes.revisoesPosRespostaConcluidas);
});

test('permite ouvir por teclado, errar, corrigir e restaurar a transcrição', async ({ page }) => {
  await instalarAudioAutomatico(page);
  await abrir(page);
  const cartao = page.locator('[data-item-ingles="watch-out"]');
  await cartao.focus();
  await page.keyboard.press('Enter');
  await expect(cartao).toContainText('✓ Ouvido');

  const campo = page.locator('#ingles-campo-escrita');
  await campo.fill('Watch');
  await page
    .locator('#ingles-pratica-escrita')
    .getByRole('button', { name: /Conferir/ })
    .click();
  await expect(page.locator('#ingles-status-escrita')).toContainText('Quase!');
  await expect(campo).toBeEditable();

  await campo.fill('Watch out!');
  await page.keyboard.press('Enter');
  await expect(cartao).toContainText('✓ Escrito');
  await campo.fill('Watch out!');
  await page.keyboard.press('Enter');
  expect(
    await page.evaluate(() =>
      Object.keys(window.InglesRevisoes.obterEstado().conferenciasEscrita).filter(
        (id) => id === 'watch-out'
      )
    )
  ).toHaveLength(1);

  await page.reload();
  await abrir(page);
  await expect(cartao).toContainText('✓ Ouvido');
  await expect(cartao).toContainText('✓ Escrito');
  await expect(campo).toHaveValue('Watch out!');
});

test('áudio da pergunta só libera alternativas após a conclusão válida', async ({ page }) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  const alternativas = page.locator('[data-alternativa-atividade-ingles]');
  await expect(alternativas.first()).toBeDisabled();

  await page.locator('#ingles-ouvir-pergunta').click();
  await page.evaluate(() => window.__falasActivity3.at(-1).onerror());
  await expect(alternativas.first()).toBeDisabled();

  await page.locator('#ingles-ouvir-pergunta').click();
  const falaParada = await page.evaluate(() => window.__falasActivity3.length - 1);
  await page.locator('#ingles-parar').click();
  await page.evaluate((indice) => window.__falasActivity3[indice].onend(), falaParada);
  await expect(alternativas.first()).toBeDisabled();

  await page.locator('#ingles-ouvir-pergunta').click();
  await page.evaluate(() => window.AudioRevisoes.parar({ silencioso: true, origem: 'teste' }));
  await expect(alternativas.first()).toBeDisabled();

  await ouvirPergunta(page);
  await expect(alternativas.first()).toBeEnabled();
  expect(
    await page.evaluate(() => window.InglesRevisoes.obterEstado().perguntasOuvidasAtividades)
  ).toEqual(['q01-story-warning']);

  await page.reload();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(alternativas.first()).toBeEnabled();
});

test('cada erro mantém a revisão até Tentar novamente e exige uma nova sequência completa', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);

  await page.locator('[data-alternativa-atividade-ingles="thank-you"]').click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeDisabled();
  await concluirRevisao(page);
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeEnabled();

  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-progresso-revisao-pos-resposta')).toHaveText(
    'Question 1 of 25'
  );
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeEnabled();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('#ingles-conteudo-questao')).toBeVisible();
  await expect(page.locator('[data-alternativa-atividade-ingles="thank-you"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );

  await page.locator('[data-alternativa-atividade-ingles="im-sorry"]').click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeDisabled();
  const antesDaSegundaRevisao = await page.evaluate(() => window.__falasActivity3.length);
  await concluirRevisao(page);
  expect(await page.evaluate(() => window.__falasActivity3.length)).toBe(antesDaSegundaRevisao + 4);
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeEnabled();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();

  await page.locator('[data-alternativa-atividade-ingles="watch-out"]').click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  const inicio = await page.evaluate(() => window.__falasActivity3.length);
  await page.locator('#ingles-ouvir-revisao').click();
  for (let indice = 0; indice < 4; indice += 1) {
    await expect
      .poll(() => page.evaluate(() => window.__falasActivity3.length))
      .toBe(inicio + indice + 1);
    if (indice < 3) {
      await page.evaluate((posicao) => window.__falasActivity3[posicao].onend(), inicio + indice);
      await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
    }
  }
  expect(
    await page.evaluate(
      (primeira) =>
        window.__falasActivity3
          .slice(primeira)
          .map((fala) => ({ texto: fala.text, idioma: fala.lang })),
      inicio
    )
  ).toEqual([
    { texto: 'Phrase: Which warning do you hear in the story?', idioma: 'en-US' },
    { texto: 'A frase é: Qual aviso você ouve na história?', idioma: 'pt-BR' },
    { texto: 'Phrase: Watch out!', idioma: 'en-US' },
    { texto: 'A palavra é: Cuidado!', idioma: 'pt-BR' },
  ]);
  await page.evaluate((posicao) => window.__falasActivity3[posicao].onend(), inicio + 3);
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    3
  );
});

test('parar, cancelar ou trocar o áudio não conclui a consolidação; reload preserva só a conclusão real', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);
  await page.locator('[data-alternativa-atividade-ingles="watch-out"]').click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();

  await page.locator('#ingles-ouvir-revisao').click();
  const falaParada = await page.evaluate(() => window.__falasActivity3.length - 1);
  await page.locator('#ingles-parar').click();
  await page.evaluate((indice) => window.__falasActivity3[indice].onend(), falaParada);
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator('#ingles-ouvir-revisao').click();
  await page.evaluate(() =>
    window.AudioRevisoes.parar({ silencioso: true, origem: 'cancelamento' })
  );
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator('#ingles-ouvir-revisao').click();
  await page.evaluate(() =>
    window.AudioRevisoes.falar({
      texto: 'another audio',
      idioma: 'en-US',
      unidadeAudio: 'frase',
      origem: 'outro-audio',
    })
  );
  expect(
    await page.evaluate(
      () => Object.keys(window.InglesRevisoes.obterEstado().revisoesPosRespostaConcluidas).length
    )
  ).toBe(0);

  await concluirRevisao(page);
  await page.reload();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    1
  );
});

test('refazer preserva estudo, e limpar remove apenas a chave da Activity 3', async ({ page }) => {
  await salvarPreRequisitos(page);
  await page.evaluate(
    ({ chave, unidadeId, vizinhas }) => {
      const estado = JSON.parse(localStorage.getItem(chave));
      const atividades = window.RegistroIngles.obter(unidadeId).atividades;
      estado.questaoAtual = 24;
      estado.perguntasOuvidasAtividades = atividades.map((questao) => questao.id);
      estado.respostasAtividades = Object.fromEntries(
        atividades.map((questao) => [questao.id, questao.respostaCorreta])
      );
      estado.conferenciasAtividades = Object.fromEntries(
        atividades.map((questao) => [questao.id, 'correta'])
      );
      estado.revisoesPosRespostaConcluidas = Object.fromEntries(
        atividades.map((questao) => [questao.id, questao.respostaCorreta])
      );
      estado.atividadeIniciada = true;
      estado.atividadeFinalizada = true;
      localStorage.setItem(chave, JSON.stringify(estado));
      vizinhas.forEach((vizinha) =>
        localStorage.setItem(vizinha, JSON.stringify({ preservar: true }))
      );
    },
    { chave: CHAVE, unidadeId: UNIDADE, vizinhas: [CHAVE_ACTIVITY_1, CHAVE_ACTIVITY_2] }
  );
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  await page.getByRole('button', { name: 'Refazer as 25 atividades' }).click();
  let estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.itensOuvidos).toHaveLength(17);
  expect(Object.keys(estado.conferenciasEscrita)).toHaveLength(17);
  expect(estado.perguntasOuvidasAtividades).toEqual([]);
  expect(estado.respostasAtividades).toEqual({});
  expect(estado.revisoesPosRespostaConcluidas).toEqual({});
  expect(estado.questaoAtual).toBe(0);

  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(
    await page.evaluate(
      ({ chave, vizinhas }) => ({
        atual: localStorage.getItem(chave),
        vizinhas: vizinhas.map((vizinha) => localStorage.getItem(vizinha)),
      }),
      { chave: CHAVE, vizinhas: [CHAVE_ACTIVITY_1, CHAVE_ACTIVITY_2] }
    )
  ).toEqual({
    atual: null,
    vizinhas: [JSON.stringify({ preservar: true }), JSON.stringify({ preservar: true })],
  });
  estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.itensOuvidos).toEqual([]);
});

test('tolera JSON inválido e localStorage bloqueado com fallback em memória', async ({
  page,
  browser,
}) => {
  await page.evaluate((chave) => localStorage.setItem(chave, '{json-invalido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/17 áudios · 0/17 escritas');

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
  await abrir(paginaBloqueada);
  await paginaBloqueada.locator('[data-item-ingles="watch-out"]').click();
  await expect(paginaBloqueada.locator('[data-item-ingles="watch-out"]')).toContainText('✓ Ouvido');
  await contextoBloqueado.close();
});

test('assets visuais codificam conjuntos, ações e sentidos coerentes com o gabarito', async ({
  page,
}) => {
  const unidade = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId),
    UNIDADE
  );
  const porId = Object.fromEntries(unidade.atividades.map((questao) => [questao.id, questao]));

  expect(
    porId['q05-story-return-objects'].alternativas.map((alternativa) => [
      alternativa.id,
      alternativa.imagem,
    ])
  ).toEqual([
    ['pencil-case-ruler-book', 'story-set-pencil-case-ruler-book.svg'],
    ['pencil-ruler-book', 'story-set-pencil-ruler-book.svg'],
    ['pencil-case-eraser-notebook', 'story-set-pencil-case-eraser-notebook.svg'],
    ['bag-pen-paper', 'story-set-bag-pen-paper.svg'],
  ]);
  expect(
    porId['q12-skills-desk'].alternativas.map((alternativa) => [alternativa.id, alternativa.imagem])
  ).toEqual([
    ['ruler-book-eraser', 'desk-set-ruler-book-eraser.svg'],
    ['ruler-notebook-pencil', 'desk-set-ruler-notebook-pencil.svg'],
    ['book-pen-bag', 'desk-set-book-pen-bag.svg'],
    ['eraser-pencil-case-notebook', 'desk-set-eraser-pencil-case-notebook.svg'],
  ]);
  expect(porId['q13-skills-take-out-ruler'].respostaCorreta).toBe('take-out-ruler');
  expect(porId['q14-skills-put-away-book'].respostaCorreta).toBe('put-away-book');
  expect(
    [
      'q16-senses-look',
      'q17-senses-listen',
      'q18-senses-smell',
      'q19-senses-taste',
      'q20-senses-touch',
    ].map((id) => porId[id].imagemEnunciadoAlt)
  ).toEqual([
    'Dois olhos observando uma estrela.',
    'Fones de ouvido com notas musicais.',
    'Uma flor com linhas suaves indicando seu perfume.',
    'Um sorvete em uma casquinha.',
    'Uma mão tocando um brinquedo macio.',
  ]);

  const asset = (nome) => fs.readFileSync(path.resolve('assets/objetos_escolares', nome), 'utf8');
  expect(asset('story-set-pencil-case-ruler-book.svg')).toContain(
    'data-objects="pencil-case ruler book" data-count="3"'
  );
  expect(asset('desk-set-ruler-book-eraser.svg')).toContain(
    'data-objects="ruler book eraser" data-count="3"'
  );
  expect(asset('school-take-out-ruler.svg')).toContain(
    'data-action="take-out" data-object="ruler"'
  );
  expect(asset('school-put-away-book.svg')).toContain(
    'data-action="put-away" data-object="book" data-container="bag"'
  );
  expect(asset('helping-return-things.svg')).toContain(
    'data-scene="help friend return pencil case ruler book"'
  );
  expect(asset('story-time-watch-out.svg')).toContain(
    'data-scene="watch-out warning box school-things"'
  );
  expect(asset('story-time-notebook.svg')).toContain(
    'data-scene="mom returns notebook" data-object="notebook" data-count="1"'
  );
  expect(asset('story-time-friends-help.svg')).toContain(
    'data-scene="friends help Flash" data-objects="pencil-case ruler book" data-count="3"'
  );
  for (const cena of unidade.historia.cenas) {
    expect(fs.existsSync(path.resolve('assets/objetos_escolares', cena.imagem))).toBe(true);
    expect(cena.imagemAlt.length).toBeGreaterThan(30);
  }
});

test('completa as 25 questões sem duplicar pontuação e mostra a mensagem para as meninas', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();

  for (let indice = 0; indice < 25; indice += 1) {
    if (indice < 7) {
      await expect(page.getByRole('button', { name: '📖 Rever história' })).toBeVisible();
    } else {
      await expect(page.locator('#ingles-rever-historia')).toBeHidden();
    }
    await ouvirPergunta(page);
    const correta = await page.evaluate((unidadeId) => {
      const estado = window.InglesRevisoes.obterEstado();
      return window.RegistroIngles.obter(unidadeId).atividades[estado.questaoAtual].respostaCorreta;
    }, UNIDADE);
    await page.locator(`[data-alternativa-atividade-ingles="${correta}"]`).click();
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await concluirRevisao(page);
    await page
      .getByRole('button', { name: indice === 24 ? 'Concluir revisão ✓' : 'Próxima →' })
      .click();
  }

  await expect(page.getByText('Mariana, você acertou 25 de 25 atividades.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Uma mensagem para as meninas' })).toBeVisible();
  await expect(page.locator('#ingles-texto-surpresa')).toContainText('Meninas, great work!');
  const estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.perguntasOuvidasAtividades).toHaveLength(25);
  expect(estado.revisoesPosRespostaConcluidas).toHaveProperty(
    'q25-think-back-thank-you',
    'thank-you'
  );
  expect(estado.tentativasAtividade).toBe(25);
  expect(estado.atividadeFinalizada).toBe(true);

  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    25
  );
});

test('Activity 2 preserva chave, etapa de 25 itens e título para Mariana', async ({ page }) => {
  const dados = await page.evaluate(() => {
    const unidade = window.RegistroIngles.obter('at-school-atividade-2');
    const registro = window.RegistroRevisoes.obter('mariana-ingles-at-school-atividade-2');
    return {
      itens: unidade.grupos.flatMap((grupo) => grupo.itens).length,
      questoes: unidade.atividades.length,
      destinataria: unidade.destinatariaMensagemFinal,
      chave: registro.chaveArmazenamento,
      total: registro.totalEtapas,
    };
  });
  expect(dados).toEqual({
    itens: 25,
    questoes: 25,
    destinataria: undefined,
    chave: CHAVE_ACTIVITY_2,
    total: 50,
  });

  await page.evaluate((chave) => {
    const unidade = window.RegistroIngles.obter('at-school-atividade-2');
    const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
    localStorage.setItem(
      chave,
      JSON.stringify({
        unidadeId: unidade.id,
        versao: unidade.versao,
        grupoAtual: unidade.grupos[0].id,
        itemAtual: itens[0].id,
        itensOuvidos: itens.map((item) => item.id),
        respostasEscrita: Object.fromEntries(itens.map((item) => [item.id, item.ingles])),
        conferenciasEscrita: Object.fromEntries(itens.map((item) => [item.id, 'correta'])),
        perguntasOuvidasAtividades: unidade.atividades.map((questao) => questao.id),
        respostasAtividades: Object.fromEntries(
          unidade.atividades.map((questao) => [questao.id, questao.respostaCorreta])
        ),
        conferenciasAtividades: Object.fromEntries(
          unidade.atividades.map((questao) => [questao.id, 'correta'])
        ),
        atividadeIniciada: true,
        atividadeFinalizada: true,
      })
    );
  }, CHAVE_ACTIVITY_2);
  await page.reload();
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-at-school-atividade-2').click();
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  await expect(page.getByRole('heading', { name: 'Uma mensagem para Mariana' })).toBeVisible();
});

test('funciona em toque, desktops, axe-core e file sem rede', async ({ page, browser }) => {
  const contextoToque = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const paginaToque = await contextoToque.newPage();
  await paginaToque.goto(URL);
  await instalarAudioAutomatico(paginaToque);
  await salvarPreRequisitos(paginaToque, true, true, false);
  await paginaToque.reload();
  await abrir(paginaToque);
  await paginaToque.getByRole('button', { name: 'Abrir Story Time →' }).tap();
  await expect(paginaToque.locator('#ingles-story-time')).toBeVisible();
  await expect(paginaToque.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
  expect(
    await paginaToque.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ).toBe(true);
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
    await salvarPreRequisitos(page, true, true, false);
    await page.reload();
    await abrir(page);
    await page.getByRole('button', { name: 'Abrir Story Time →' }).click();
    await expect(page.locator('#ingles-story-time')).toBeVisible();
    await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.locator('#botao-inicio').click();
  }

  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await salvarPreRequisitos(page, true, true, false);
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'Abrir Story Time →' }).click();
  await expect(page.locator('#ingles-story-time')).toBeVisible();
  await expect(page.locator('#ingles-story-time-texto-ingles')).toContainText('Watch out!');
  expect(rede).toEqual([]);
});
