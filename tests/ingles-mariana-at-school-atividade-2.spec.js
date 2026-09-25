const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const URL = '/ambiente_interativo/index.html';
const UNIDADE = 'at-school-atividade-2';
const REVISAO = 'mariana-ingles-at-school-atividade-2';
const CHAVE = 'revisoesEscolares.mariana.ingles.atSchoolAtividade2.v1';
const CHAVE_FRIENDS = 'revisoesEscolares.mariana.ingles.friendsAtividade1.v1';

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-at-school-atividade-2').click();
  await expect(page.locator('#tela-ingles')).toBeVisible();
}

async function salvarPreRequisitos(page) {
  await page.evaluate(
    ({ chave, unidadeId }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
      localStorage.setItem(
        chave,
        JSON.stringify({
          unidadeId: unidade.id,
          versao: unidade.versao,
          grupoAtual: unidade.grupos[0].id,
          itemAtual: unidade.grupos[0].itens[0].id,
          itensOuvidos: itens.map((item) => item.id),
          reproducoes: itens.length,
          respostasEscrita: Object.fromEntries(itens.map((item) => [item.id, item.ingles])),
          conferenciasEscrita: Object.fromEntries(itens.map((item) => [item.id, 'correta'])),
          iniciado: true,
        })
      );
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
}

async function instalarAudioControlado(page) {
  await page.evaluate(() => {
    window.__falasAtSchool = [];
    window.__cancelamentosAtSchool = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
      { name: 'Microsoft Maria Desktop', lang: 'pt-BR', localService: true },
    ];
    window.speechSynthesis.cancel = () => {
      window.__cancelamentosAtSchool += 1;
    };
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (fala) => {
      window.__falasAtSchool.push(fala);
      fala.onstart?.();
    };
    window.AudioRevisoes.atualizarVozes();
    const falarSequenciaOriginal = window.AudioRevisoes.falarSequencia;
    window.AudioRevisoes.falarSequencia = (opcoes) =>
      falarSequenciaOriginal({ ...opcoes, pausaMs: 0 });
  });
}

async function concluirUltimoAudio(page) {
  await page.evaluate(() => window.__falasAtSchool.at(-1).onend());
}

async function ouvirPergunta(page) {
  await page.locator('#ingles-ouvir-pergunta').click();
  await concluirUltimoAudio(page);
}

async function concluirRevisao(page) {
  const quantidadeInicial = await page.evaluate(() => window.__falasAtSchool.length);
  await page.locator('#ingles-ouvir-revisao').click();
  for (let indice = 0; indice < 4; indice += 1) {
    await expect
      .poll(() => page.evaluate(() => window.__falasAtSchool.length))
      .toBe(quantidadeInicial + indice + 1);
    await page.evaluate(
      (posicao) => window.__falasAtSchool[posicao].onend(),
      quantidadeInicial + indice
    );
  }
}

test.beforeEach(async ({ page }) => {
  page.errosAtSchool = [];
  page.on('pageerror', (erro) => page.errosAtSchool.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosAtSchool.push(mensagem.text());
  });
  await page.goto(URL);
  await page.evaluate(
    ({ chave, friends }) => {
      localStorage.removeItem(chave);
      localStorage.removeItem(friends);
    },
    { chave: CHAVE, friends: CHAVE_FRIENDS }
  );
  await page.reload();
});

test.afterEach(async ({ page }) => expect(page.errosAtSchool).toEqual([]));

test('cadastra a revisão exclusiva da Mariana com 25 itens e 25 questões completas', async ({
  page,
}) => {
  const dados = await page.evaluate(
    ({ unidadeId, revisaoId }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      return {
        unidade,
        itens: unidade.grupos.flatMap((grupo) => grupo.itens),
        registro: window.RegistroRevisoes.obter(revisaoId),
        configuracao: window.ConfiguracoesIngles.marianaAtSchoolAtividade2,
      };
    },
    { unidadeId: UNIDADE, revisaoId: REVISAO }
  );

  expect(dados.unidade.perfisDisponiveis).toEqual(['mariana']);
  expect(dados.unidade.grupos.map((grupo) => grupo.itens.length)).toEqual([10, 6, 9]);
  expect(dados.itens).toHaveLength(25);
  expect(new Set(dados.itens.map((item) => item.id)).size).toBe(25);
  expect(dados.unidade.atividades).toHaveLength(25);
  expect(new Set(dados.unidade.atividades.map((questao) => questao.id)).size).toBe(25);
  expect(dados.unidade.exigirAudioPerguntaAntesDeResponder).toBe(true);
  expect(dados.unidade.revisaoPosResposta).toEqual({ obrigatoria: true, pausaMs: 350 });
  expect(dados.unidade.praticaEscrita).toEqual({
    habilitada: true,
    obrigatoriaParaAtividades: true,
  });
  expect(
    dados.unidade.atividades.every(
      (questao) =>
        questao.perguntaIngles &&
        questao.instrucaoPortugues &&
        questao.explicacao &&
        questao.feedbackErro &&
        questao.revisaoPosResposta?.perguntaPortugues &&
        questao.revisaoPosResposta?.respostaIngles &&
        questao.revisaoPosResposta?.significadoPortugues &&
        questao.revisaoPosResposta.respostaIngles ===
          questao.alternativas.find((alternativa) => alternativa.id === questao.respostaCorreta)
            ?.texto &&
        ['palavra', 'frase'].includes(questao.revisaoPosResposta.unidadeRespostaIngles) &&
        ['palavra', 'frase'].includes(questao.revisaoPosResposta.unidadeSignificadoPortugues) &&
        questao.alternativas.some((alternativa) => alternativa.id === questao.respostaCorreta)
    )
  ).toBe(true);
  expect(dados.unidade.atividades.slice(20).every((questao) => questao.imagemEnunciadoAlt)).toBe(
    true
  );
  expect(dados.registro.totalEtapas).toBe(50);
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  expect(dados.configuracao).toMatchObject({
    perfil: 'mariana',
    revisaoId: REVISAO,
    unidadeId: UNIDADE,
    chaveArmazenamento: CHAVE,
  });
});

test('mostra o cartão apenas para Mariana e exige os 25 áudios e as 25 escritas', async ({
  page,
}) => {
  await page.getByRole('button', { name: /Alice/i }).click();
  await expect(page.locator('#abrir-ingles-at-school-atividade-2')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeDisabled();

  await salvarPreRequisitos(page);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('25/25 áudios · 25/25 escritas');
  await expect(page.locator('#ingles-iniciar-atividades')).toBeEnabled();
});

test('só libera a pergunta após o áudio terminar e preserva cada liberação separadamente', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  const alternativas = page.locator('[data-alternativa-atividade-ingles]');
  await expect(alternativas.first()).toBeDisabled();
  await expect(page.locator('#ingles-status-atividade')).toContainText('Ouça a pergunta');

  await page.locator('#ingles-ouvir-pergunta').click();
  await expect(alternativas.first()).toBeDisabled();
  await page.evaluate(() => window.__falasAtSchool.at(-1).onerror());
  await expect(alternativas.first()).toBeDisabled();

  await page.locator('#ingles-ouvir-pergunta').click();
  const indiceCancelado = await page.evaluate(() => window.__falasAtSchool.length - 1);
  await page.locator('#ingles-parar').click();
  await page.evaluate((indice) => window.__falasAtSchool[indice].onend(), indiceCancelado);
  await expect(alternativas.first()).toBeDisabled();

  await ouvirPergunta(page);
  await expect(alternativas.first()).toBeEnabled();
  const primeira = await page.evaluate((unidadeId) => {
    const questao = window.RegistroIngles.obter(unidadeId).atividades[0];
    return questao.respostaCorreta;
  }, UNIDADE);
  await page.locator(`[data-alternativa-atividade-ingles="${primeira}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await concluirRevisao(page);
  await page.getByRole('button', { name: 'Próxima →' }).click();
  await expect(alternativas.first()).toBeDisabled();
  await page.getByRole('button', { name: '← Anterior' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-resposta-revisao-pos-resposta')).toHaveText('pencil');
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();

  const estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.perguntasOuvidasAtividades).toEqual(['q01-pencil-visual']);
  await page.reload();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-resposta-revisao-pos-resposta')).toHaveText('pencil');
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
});

test('normaliza IDs ouvidos, rejeita respostas sem áudio e refazer preserva o vocabulário', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.evaluate(
    ({ chave, unidadeId }) => {
      const estado = JSON.parse(localStorage.getItem(chave));
      const unidade = window.RegistroIngles.obter(unidadeId);
      const [q1, q2] = unidade.atividades;
      estado.perguntasOuvidasAtividades = [q1.id, q1.id, 'id-inexistente'];
      estado.respostasAtividades = {
        [q1.id]: q1.respostaCorreta,
        [q2.id]: q2.respostaCorreta,
      };
      estado.conferenciasAtividades = { [q1.id]: 'correta', [q2.id]: 'correta' };
      estado.atividadeIniciada = true;
      localStorage.setItem(chave, JSON.stringify(estado));
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
  await page.reload();
  await abrir(page);
  let estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.perguntasOuvidasAtividades).toEqual(['q01-pencil-visual']);
  expect(Object.keys(estado.respostasAtividades)).toEqual(['q01-pencil-visual']);

  await page.evaluate(
    ({ chave, unidadeId }) => {
      const estadoSalvo = JSON.parse(localStorage.getItem(chave));
      const atividades = window.RegistroIngles.obter(unidadeId).atividades;
      estadoSalvo.perguntasOuvidasAtividades = atividades.map((questao) => questao.id);
      estadoSalvo.respostasAtividades = Object.fromEntries(
        atividades.map((questao) => [questao.id, questao.respostaCorreta])
      );
      estadoSalvo.conferenciasAtividades = Object.fromEntries(
        atividades.map((questao) => [questao.id, 'correta'])
      );
      estadoSalvo.atividadeFinalizada = true;
      localStorage.setItem(chave, JSON.stringify(estadoSalvo));
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: /Ver resultado/ }).click();
  await page.getByRole('button', { name: 'Refazer as 25 atividades' }).click();
  estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.perguntasOuvidasAtividades).toEqual([]);
  expect(estado.respostasAtividades).toEqual({});
  expect(estado.itensOuvidos).toHaveLength(25);
  expect(Object.keys(estado.conferenciasEscrita)).toHaveLength(25);
  await expect(page.locator('[data-alternativa-atividade-ingles]').first()).toBeDisabled();
});

test('completa as 25 questões ouvindo cada pergunta e mantém a pontuação sem duplicação', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();

  for (let indice = 0; indice < 25; indice += 1) {
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
  const estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.perguntasOuvidasAtividades).toHaveLength(25);
  expect(estado.tentativasAtividade).toBe(25);
  expect(estado.atividadeFinalizada).toBe(true);
  expect(
    await page.evaluate(
      (revisaoId) => window.InglesRevisoes.obterSituacao('mariana', revisaoId),
      REVISAO
    )
  ).toBe('concluida');
});

test('não aplica a trava às revisões antigas e limpa somente a chave desta revisão', async ({
  page,
}) => {
  await page.evaluate(
    (friends) => localStorage.setItem(friends, JSON.stringify({ preservar: true })),
    CHAVE_FRIENDS
  );
  await salvarPreRequisitos(page);
  await page.reload();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  page.once('dialog', (dialogo) => dialogo.accept());
  await page.locator('#limpar-progresso').click();
  expect(
    await page.evaluate(
      ({ chave, friends }) => ({
        atual: localStorage.getItem(chave),
        friends: localStorage.getItem(friends),
      }),
      { chave: CHAVE, friends: CHAVE_FRIENDS }
    )
  ).toEqual({ atual: null, friends: JSON.stringify({ preservar: true }) });

  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-friends-atividade-1').click();
  await page.evaluate(() => {
    const unidade = window.RegistroIngles.obter('friends-level-1-atividade-1');
    const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
    localStorage.setItem(
      'revisoesEscolares.mariana.ingles.friendsAtividade1.v1',
      JSON.stringify({
        unidadeId: unidade.id,
        versao: unidade.versao,
        grupoAtual: unidade.grupos[0].id,
        itemAtual: unidade.grupos[0].itens[0].id,
        itensOuvidos: itens.map((item) => item.id),
        respostasEscrita: Object.fromEntries(itens.map((item) => [item.id, item.ingles])),
        conferenciasEscrita: Object.fromEntries(itens.map((item) => [item.id, 'correta'])),
      })
    );
  });
  await page.reload();
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-friends-atividade-1').click();
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('[data-alternativa-atividade-ingles]').first()).toBeEnabled();
});

test('abre a revisão após erro e acerto sem exibir as traduções em português', async ({ page }) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);

  const primeira = await page.evaluate((unidadeId) => {
    const questao = window.RegistroIngles.obter(unidadeId).atividades[0];
    return {
      correta: questao.respostaCorreta,
      errada: questao.alternativas.find((alternativa) => alternativa.id !== questao.respostaCorreta)
        .id,
      pergunta: questao.perguntaIngles,
      resposta: questao.revisaoPosResposta.respostaIngles,
      perguntaPortugues: questao.revisaoPosResposta.perguntaPortugues,
      significadoPortugues: questao.revisaoPosResposta.significadoPortugues,
    };
  }, UNIDADE);

  await page.locator(`[data-alternativa-atividade-ingles="${primeira.errada}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-conteudo-questao')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Let’s review!' })).toBeVisible();
  await expect(page.locator('#ingles-pergunta-revisao-pos-resposta')).toHaveText(primeira.pergunta);
  await expect(page.locator('#ingles-resposta-revisao-pos-resposta')).toHaveText(primeira.resposta);
  await expect(page.locator('#ingles-imagem-revisao-pos-resposta-img')).toHaveAttribute(
    'alt',
    primeira.resposta
  );
  const textoVisivel = await page.locator('#ingles-revisao-pos-resposta').innerText();
  expect(textoVisivel).not.toContain(primeira.perguntaPortugues);
  expect(textoVisivel).not.toContain(primeira.significadoPortugues);
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await concluirRevisao(page);
  await expect(page.locator('#ingles-conteudo-questao')).toBeVisible();
  await expect(page.locator('#ingles-status-atividade')).toContainText('↻');
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator(`[data-alternativa-atividade-ingles="${primeira.correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
  await concluirRevisao(page);
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().tentativasAtividade)).toBe(
    2
  );
});

test('reproduz pergunta EN, tradução PT, resposta EN e significado PT na ordem', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);
  const correta = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId).atividades[0].respostaCorreta,
    UNIDADE
  );
  await page.locator(`[data-alternativa-atividade-ingles="${correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();

  const inicio = await page.evaluate(() => window.__falasAtSchool.length);
  await page.locator('#ingles-ouvir-revisao').click();
  await page.locator('#ingles-ouvir-revisao').click({ force: true });
  await expect.poll(() => page.evaluate(() => window.__falasAtSchool.length)).toBe(inicio + 1);
  await expect(page.locator('#ingles-ouvir-revisao')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  for (let indice = 0; indice < 4; indice += 1) {
    await expect
      .poll(() => page.evaluate(() => window.__falasAtSchool.length))
      .toBe(inicio + indice + 1);
    if (indice < 3) {
      await page.evaluate((posicao) => window.__falasAtSchool[posicao].onend(), inicio + indice);
      await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
    }
  }

  const falas = await page.evaluate(
    (primeira) =>
      window.__falasAtSchool
        .slice(primeira)
        .map((fala) => ({ texto: fala.text, idioma: fala.lang })),
    inicio
  );
  expect(falas).toEqual([
    { texto: 'Phrase: Which object is a pencil?', idioma: 'en-US' },
    { texto: 'A frase é: Qual objeto é um lápis?', idioma: 'pt-BR' },
    { texto: 'Word: pencil', idioma: 'en-US' },
    { texto: 'A palavra é: lápis', idioma: 'pt-BR' },
  ]);
  await page.evaluate((posicao) => window.__falasAtSchool[posicao].onend(), inicio + 3);
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
});

test('parada, cancelamento, erro, outro áudio e navegação não concluem a revisão', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);
  const correta = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId).atividades[0].respostaCorreta,
    UNIDADE
  );
  await page.locator(`[data-alternativa-atividade-ingles="${correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();

  await page.locator('#ingles-ouvir-revisao').click();
  const falaParada = await page.evaluate(() => window.__falasAtSchool.length - 1);
  await page.locator('#ingles-parar').click();
  await page.evaluate((indice) => window.__falasAtSchool[indice].onend(), falaParada);
  await expect(page.locator('#ingles-ouvir-revisao')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator('#ingles-ouvir-revisao').click();
  await page.evaluate(() => window.AudioRevisoes.parar({ silencioso: true, origem: 'teste' }));
  await expect(page.locator('#ingles-status-revisao-pos-resposta')).toContainText('interrupted');
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator('#ingles-ouvir-revisao').click();
  await page.evaluate(() => window.__falasAtSchool.at(-1).onerror());
  await expect(page.locator('#ingles-status-revisao-pos-resposta')).toContainText(
    'could not be completed'
  );
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();

  await page.locator('#ingles-ouvir-revisao').click();
  await page.evaluate(() =>
    window.AudioRevisoes.falar({
      texto: 'another audio',
      idioma: 'en-US',
      unidadeAudio: 'frase',
      origem: 'teste-outro-audio',
    })
  );
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
  expect(
    await page.evaluate(
      () => Object.keys(window.InglesRevisoes.obterEstado().revisoesPosRespostaConcluidas).length
    )
  ).toBe(0);

  await page.locator('#ingles-ouvir-revisao').click();
  await page.locator('#botao-inicio').click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.locator('#ingles-ouvir-revisao')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
});

test('restaura a revisão no recarregamento e persiste a conclusão sem duplicar pontos', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await ouvirPergunta(page);
  const correta = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId).atividades[0].respostaCorreta,
    UNIDADE
  );
  await page.locator(`[data-alternativa-atividade-ingles="${correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeDisabled();
  await concluirRevisao(page);
  let estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.tentativasAtividade).toBe(1);
  expect(estado.revisoesPosRespostaConcluidas).toEqual({ 'q01-pencil-visual': correta });

  await page.reload();
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-pos-resposta')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próxima →' })).toBeEnabled();
  estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.tentativasAtividade).toBe(1);
});

test('mantém progresso antigo concluído e refazer inicia o ciclo completo na questão 1', async ({
  page,
}) => {
  await salvarPreRequisitos(page);
  await page.evaluate(
    ({ chave, unidadeId }) => {
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
      estado.atividadeIniciada = true;
      estado.atividadeFinalizada = true;
      estado.tentativasAtividade = 25;
      delete estado.revisoesPosRespostaConcluidas;
      localStorage.setItem(chave, JSON.stringify(estado));
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
  await page.reload();
  await abrir(page);
  await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
  await expect(page.getByText('Mariana, você acertou 25 de 25 atividades.')).toBeVisible();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().atividadeFinalizada)).toBe(
    true
  );
  await page.getByRole('button', { name: 'Refazer as 25 atividades' }).click();
  await expect(page.locator('#ingles-progresso-atividade')).toHaveText('Atividade 1 de 25');
  await expect(page.locator('[data-alternativa-atividade-ingles]').first()).toBeDisabled();
  const estado = await page.evaluate(() => window.InglesRevisoes.obterEstado());
  expect(estado.questaoAtual).toBe(0);
  expect(estado.perguntasOuvidasAtividades).toEqual([]);
  expect(estado.revisoesPosRespostaConcluidas).toEqual({});
  expect(estado.itensOuvidos).toHaveLength(25);
});

test('a questão 25 só encerra depois da revisão final completa', async ({ page }) => {
  await salvarPreRequisitos(page);
  await page.evaluate(
    ({ chave, unidadeId }) => {
      const estado = JSON.parse(localStorage.getItem(chave));
      const atividades = window.RegistroIngles.obter(unidadeId).atividades;
      estado.questaoAtual = 24;
      estado.perguntasOuvidasAtividades = atividades.map((questao) => questao.id);
      estado.respostasAtividades = Object.fromEntries(
        atividades.slice(0, 24).map((questao) => [questao.id, questao.respostaCorreta])
      );
      estado.conferenciasAtividades = Object.fromEntries(
        atividades.slice(0, 24).map((questao) => [questao.id, 'correta'])
      );
      estado.revisoesPosRespostaConcluidas = Object.fromEntries(
        atividades.slice(0, 24).map((questao) => [questao.id, questao.respostaCorreta])
      );
      estado.atividadeIniciada = true;
      localStorage.setItem(chave, JSON.stringify(estado));
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
  await page.reload();
  await instalarAudioControlado(page);
  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();
  const correta = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId).atividades[24].respostaCorreta,
    UNIDADE
  );
  await page.locator(`[data-alternativa-atividade-ingles="${correta}"]`).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('button', { name: 'Concluir revisão ✓' })).toBeDisabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().atividadeFinalizada)).toBe(
    false
  );
  await concluirRevisao(page);
  await expect(page.getByRole('button', { name: 'Concluir revisão ✓' })).toBeEnabled();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().atividadeFinalizada)).toBe(
    false
  );
  await page.getByRole('button', { name: 'Concluir revisão ✓' }).click();
  await expect(page.getByText('Mariana, você acertou 25 de 25 atividades.')).toBeVisible();
  expect(await page.evaluate(() => window.InglesRevisoes.obterEstado().atividadeFinalizada)).toBe(
    true
  );
});

test('mantém layout acessível em desktops e funciona localmente sem rede', async ({ page }) => {
  await salvarPreRequisitos(page);
  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await abrir(page);
    await expect(page.locator('#tela-ingles')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.locator('#ingles-iniciar-atividades').click();
    await expect(page.locator('#ingles-imagens-enunciado')).toHaveAttribute('aria-hidden', 'true');
    await page.locator('#botao-inicio').click();
  }

  await abrir(page);
  await page.locator('#ingles-iniciar-atividades').click();

  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    axe.violations.filter((violacao) => ['serious', 'critical'].includes(violacao.impact))
  ).toEqual([]);

  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await expect(page.locator('#ingles-progresso-texto')).toHaveText('0/25 áudios · 0/25 escritas');
  expect(rede).toEqual([]);
});
