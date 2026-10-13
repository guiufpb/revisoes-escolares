const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const ID = 'alice-geografia-brincadeiras-lazer-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.v1';
const AUXILIAR = 'revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.responsavel.v1';
const CARTAO = '#abrir-geografia-brincadeiras-lazer-outubro-2026';
const URL = '/ambiente_interativo/index.html';
const VIZINHAS = [
  'revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1',
  'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1',
  'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1',
];
// Transcrição independente do gabarito editorial, sem consultar respostas da configuração.
const GABARITO = [
  ['Bola', 'Corda', 'Pipa'],
  ['Tablet', 'Pião'],
  ['Só no relato da infância de Rosa', 'Nos dois relatos', 'Só no relato de hoje'],
  [['Pular corda aparece nos dois tempos', 'O jogo eletrônico aparece no relato de Eva']],
  ['Verdadeiro', 'Verdadeiro', 'Falso'],
  ['Um grupo de pessoas', 'Peças de um quebra-cabeça', 'Uma pipa e uma linha apropriada'],
  ['Madeira', 'Plástico', 'Tecido'],
  ['O vento que movimenta o ar'],
  { campos: ['barro', 'Karajá'] },
  { campos: ['Bola', 'Pipa'] },
  ['Dentro da moradia', 'Fora da moradia', 'Fora da moradia'],
  ['Ciclovia', 'Quadra para bola', 'Sala com mesa'],
  { mapa: 'Selecionar Quadra' },
  [{ ordem: ['Entrada', 'Banco', 'Brinquedos'] }],
  ['Lugar 1', 'Afastar-se e avisar um adulto'],
  ['Cinema', 'Sala de casa', 'Parque'],
  [['Ler um livro', 'Brincar de roda', 'Conversar']],
  [['Desenhar', 'Jogar bola']],
  ['Fazer piquenique', 'Uma das atividades de lazer apresentada'],
  ['Nos dois bairros', 'Num lugar há quadra; no outro, campo gramado'],
  [['Banco', 'Bebedouro', 'Balanço']],
  [['Conversar e combinar a vez de cada um', 'Pedir ajuda a um adulto se não conseguem combinar']],
  ['Todos se sentam em roda e passam a bola uns aos outros'],
  ['Falso', 'Verdadeiro', 'Falso'],
  ['Jogar o jogo de tabuleiro juntos na mesa'],
  [
    [
      'O material das bonecas é diferente',
      'Inventar histórias com bonecas aparece nos dois tempos',
    ],
    'Uma forma de brincar pode continuar mesmo com brinquedos de materiais diferentes',
  ],
  [
    [
      'Ir acompanhada de seu responsável',
      'Esperar o verde do pedestre e, com o adulto, verificar que os veículos pararam',
      'Usar a quadra disponível para jogar bola',
    ],
  ],
  ['Papel', 'Barro', 'Pular corda'],
  ['Fazer uma ligação telefônica com ajuda do responsável'],
  {
    campos: ['Podemos brincar em diferentes lugares.', 'Brincadeiras antigas também existem hoje.'],
  },
];
const SUBITENS = [
  3, 2, 3, 1, 3, 3, 3, 1, 2, 2, 3, 3, 1, 1, 2, 3, 1, 1, 2, 2, 1, 1, 1, 3, 1, 2, 1, 3, 1, 2,
];
const qid = (n) => 'geografia-brincadeiras-lazer-q' + String(n).padStart(2, '0');
const conferir = (page) => page.getByRole('button', { name: 'Conferir', exact: true }).click();
async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
async function preparar(page, numero) {
  await page.evaluate(
    ({ chave, numero }) =>
      localStorage.setItem(chave, JSON.stringify({ versao: 1, questaoAtual: numero - 1 })),
    { chave: CHAVE, numero }
  );
  await page.reload();
  await abrir(page);
}
async function salvo(page, chave = CHAVE) {
  return page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), chave);
}
async function preencher(page, numero) {
  const resposta = GABARITO[numero - 1];
  if (resposta.campos) {
    await expect(page.locator('[data-resposta-gramatica]')).toHaveCount(resposta.campos.length);
    for (const [i, v] of resposta.campos.entries())
      await page.locator('[data-resposta-gramatica]').nth(i).fill(v);
  } else if (resposta.mapa) {
    await page.getByRole('button', { name: resposta.mapa, exact: true }).click();
  } else {
    for (const [i, v] of resposta.entries()) {
      const item =
        resposta.length === 1 && Array.isArray(v)
          ? page.locator('[data-interacao-questionario]')
          : page.locator('[data-item-gramatica]').nth(i);
      for (const texto of v.ordem || (Array.isArray(v) ? v : [v]))
        await item.getByRole('button', { name: texto, exact: true }).click();
    }
  }
}
async function responder(page, numero) {
  await preencher(page, numero);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima'), 'Questão ' + numero).toBeEnabled();
}
async function auditar(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
}
async function audio(page, semVoz = false) {
  await page.addInitScript(
    ({ semVoz }) => {
      window.__falas = [];
      window.__cancelamentos = 0;
      window.SpeechSynthesisUtterance = function (texto) {
        this.text = texto;
      };
      window.speechSynthesis.getVoices = () =>
        semVoz
          ? []
          : [
              { name: 'Remota', lang: 'pt-BR', localService: false },
              { name: 'Microsoft Maria', lang: 'pt-BR', localService: true },
            ];
      window.speechSynthesis.cancel = () => {
        window.__cancelamentos++;
      };
      window.speechSynthesis.resume = () => {};
      window.speechSynthesis.speak = (fala) => {
        window.__falas.push({
          texto: fala.text,
          idioma: fala.lang,
          rate: fala.rate,
          pitch: fala.pitch,
          local: fala.voice.localService,
        });
        fala.onstart?.();
        fala.onend?.();
      };
    },
    { semVoz }
  );
}
test.beforeEach(async ({ page }) => {
  page.errosGeografia = [];
  page.on('pageerror', (e) => page.errosGeografia.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') page.errosGeografia.push(m.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => expect(page.errosGeografia).toEqual([]));

test('registro exclusivo, 30 questões, 58 subitens e opções na ordem editorial', async ({
  page,
}) => {
  const { revisao, registro } = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(revisao.questoes).toHaveLength(30);
  expect(revisao.questoes.map((q) => q.itens.length)).toEqual(SUBITENS);
  expect(SUBITENS.reduce((s, n) => s + n, 0)).toBe(58);
  expect(new Set(revisao.questoes.map((q) => q.id)).size).toBe(30);
  expect(new Set(revisao.questoes.flatMap((q) => q.itens.map((i) => i.id))).size).toBe(58);
  expect(registro).toMatchObject({ aluno: 'alice', totalEtapas: 30, chaveArmazenamento: CHAVE });
  expect(revisao.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([
    CHAVE,
    AUXILIAR,
  ]);
  expect(revisao.questoes.every((q) => q.leitura && q.dica && q.sucesso)).toBe(true);
  for (const n of [9, 10, 30])
    for (const i of revisao.questoes[n - 1].itens) {
      expect(i.maiusculasObrigatorias).toBeUndefined();
      expect(i.acentuacaoObrigatoria).toBeUndefined();
      expect(i.fraseCompleta).toBeUndefined();
      expect(i.pontuacaoFlexivel).toBe(true);
    }
  const ternarias = revisao.questoes.flatMap((q) =>
    q.itens.filter((i) => i.opcoes?.length === 3 && i.respostas.length === 1)
  );
  const posicoes = ternarias.map((i) => i.opcoes.indexOf(i.respostas[0]));
  expect(posicoes).toHaveLength(34);
  expect([0, 1, 2].map((p) => posicoes.filter((v) => v === p).length)).toEqual([11, 10, 13]);
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#progresso-resumo')).toContainText('Geografia: questão 1/30');
  await expect(page.locator('#limpar-progresso')).toHaveText('Limpar progresso de Geografia');
});

test('percurso independente completo, 30 pontos, apoios e conclusão restaurada', async ({
  page,
}) => {
  test.setTimeout(150000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão ' + n + ' de 30');
    await expect(page.getByRole('region', { name: 'Leia para aprender' })).toBeVisible();
    await responder(page, n);
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  expect(await salvo(page)).toMatchObject({ finalizada: true, pontos: 30 });
});

test('vazio, erro, correção, várias ações, voltar e recarga sem duplicar pontos', async ({
  page,
}) => {
  await abrir(page);
  await conferir(page);
  expect((await salvo(page)).tentativas[qid(1)]).toBeUndefined();
  const itens = page.locator('[data-item-gramatica]');
  await itens.nth(0).getByRole('button', { name: 'Corda', exact: true }).press('Space');
  await itens.nth(1).getByRole('button', { name: 'Corda', exact: true }).press('Enter');
  await itens.nth(2).getByRole('button', { name: 'Pipa', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  expect((await salvo(page)).tentativas[qid(1)]).toBe(1);
  await page.reload();
  await abrir(page);
  await expect(itens.nth(1).getByRole('button', { name: 'Corda', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await itens.nth(0).getByRole('button', { name: 'Bola', exact: true }).click();
  await conferir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await itens.nth(0).getByRole('button', { name: 'Bola', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(itens.nth(0).locator('[aria-pressed="true"]')).toHaveCount(0);
});

test('seleção exige conjunto completo, rejeita extra e preserva várias escolhas', async ({
  page,
}) => {
  await preparar(page, 17);
  await page.getByRole('button', { name: 'Ler um livro', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'Brincar de roda', exact: true }).click();
  await page.getByRole('button', { name: 'Conversar', exact: true }).click();
  await page.getByRole('button', { name: 'Nadar', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(4);
  await page.getByRole('button', { name: 'Nadar', exact: true }).press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('mapa com quatro setores nomeados, teclado, erro, desmarcar e recarga', async ({ page }) => {
  await preparar(page, 13);
  await expect(page.locator('.ponto-mapa-visual')).toHaveCount(4);
  for (const nome of ['Entrada', 'Banco', 'Quadra', 'Brinquedos']) {
    await expect(page.locator('.rotulo-ponto-mapa', { hasText: nome })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Selecionar Brinquedos', exact: true }).press('Enter');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'Selecionar Quadra', exact: true }).press('Space');
  await page.reload();
  await abrir(page);
  await expect(
    page.getByRole('button', { name: 'Selecionar Quadra', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.getByRole('button', { name: 'Selecionar Quadra', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('ordenação incompleta/errada, retirar, limpar e restaurar cartões', async ({ page }) => {
  await preparar(page, 14);
  await page.getByRole('button', { name: 'Brinquedos', exact: true }).press('Enter');
  await conferir(page);
  expect((await salvo(page)).tentativas[qid(14)]).toBeUndefined();
  await page.getByRole('button', { name: 'Entrada', exact: true }).click();
  await page.getByRole('button', { name: 'Banco', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page
    .getByRole('button', { name: 'Retirar da posição 1: Brinquedos', exact: true })
    .press('Space');
  await expect(page.getByRole('button', { name: 'Brinquedos', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
  await page.getByRole('button', { name: 'Entrada', exact: true }).click();
  await page.getByRole('button', { name: 'Banco', exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(2);
  await page.getByRole('button', { name: 'Brinquedos', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('tabela mantém linhas e números; questões mistas corrigem um subitem sem perder os demais', async ({
  page,
}) => {
  await preparar(page, 18);
  await expect(page.getByRole('img', { name: /ler histórias, 1 criança/i })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toContainText(
    'Jogar bola — 4'
  );
  await responder(page, 18);
  await preparar(page, 26);
  const itens = page.locator('[data-item-gramatica]');
  for (const texto of GABARITO[25][0])
    await itens.nth(0).getByRole('button', { name: texto, exact: true }).click();
  await itens
    .nth(1)
    .getByRole('button', { name: 'Uma boneca de plástico impede inventar histórias', exact: true })
    .click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(itens.nth(0).locator('[aria-pressed="true"]')).toHaveCount(2);
  await itens.nth(1).getByRole('button', { name: GABARITO[25][1], exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(page, 28);
  await responder(page, 28);
});

for (const [numero, validas, invalidas] of [
  [9, [' BARRO ', '  KARAJA  '], ['vidro', 'barro']],
  [10, [' bola. ', ' PIPA '], ['bolo', 'papel']],
  [
    30,
    [' podemos  brincar em diferentes lugares ', ' BRINCADEIRAS antigas tambem existem hoje! '],
    ['podemos brincar lugares', 'hoje existem também antigas brincadeiras'],
  ],
]) {
  test(
    'Q' + numero + ' tolera escrita equivalente e rejeita conteúdo/ordem incorretos',
    async ({ page }) => {
      await preparar(page, numero);
      const campos = page.locator('[data-resposta-gramatica]');
      for (const [i, v] of invalidas.entries()) await campos.nth(i).fill(v);
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      for (const [i, v] of validas.entries()) await campos.nth(i).fill(v);
      await page.reload();
      await abrir(page);
      await campos.last().press('Enter');
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await campos.first().fill('');
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    }
  );
}

for (const numero of [10, 30]) {
  test(
    'ditado Q' + numero + ' é protegido, local, sem vazamento, repete, para e cancela',
    async ({ page }) => {
      await audio(page);
      await preparar(page, numero);
      expect(await page.evaluate(() => window.__falas)).toEqual([]);
      const alvos = GABARITO[numero - 1].campos;
      const html = await page.locator('#gramatica-conteudo').innerHTML();
      for (const alvo of alvos) expect(html.toLowerCase()).not.toContain(alvo.toLowerCase());
      await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
      await page.locator('[data-ouvir-ditado-gramatica]').first().press('Enter');
      const prefixo = numero === 10 ? 'A palavra é: ' : 'A frase é: ';
      await expect
        .poll(() => page.evaluate(() => window.__falas.at(-1)?.texto))
        .toBe(prefixo + alvos[0]);
      expect(await page.evaluate(() => window.__falas.at(-1))).toMatchObject({
        idioma: 'pt-BR',
        rate: 0.78,
        pitch: 1,
        local: true,
      });
      await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
      const quantidade = await page.evaluate(() => window.__falas.length);
      await page.locator('[data-repetir-ditado-gramatica]').click();
      await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(quantidade + 1);
      expect(await page.evaluate(() => window.__falas.at(-1)?.texto)).toBe(prefixo + alvos[0]);
      await page.locator('[data-parar-ditado-gramatica]').click();
      await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
      await page.locator('[data-ouvir-ditado-gramatica]').first().click();
      await page.locator('[data-resposta-gramatica]').nth(1).focus();
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
      await page.locator('[data-ouvir-ditado-gramatica]').nth(1).click();
      await expect
        .poll(() => page.evaluate(() => window.__falas.at(-1)?.texto))
        .toBe(prefixo + alvos[1]);
      const cancelamentos = await page.evaluate(() => window.__cancelamentos);
      await page.locator('#botao-inicio').click();
      expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(cancelamentos);
      const falas = await page.evaluate(() => window.__falas.length);
      await abrir(page);
      expect(await page.evaluate(() => window.__falas.length)).toBe(falas);
    }
  );
}

test('sem voz local os campos e progresso continuam operáveis', async ({ page }) => {
  await audio(page, true);
  await preparar(page, 10);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText(/voz|disponível/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await responder(page, 10);
});

test('sessões isoladas, atalho, Escape, salto sem respostas/pontos e recarga na principal', async ({
  page,
}) => {
  await preparar(page, 10);
  await page.locator('[data-resposta-gramatica]').first().focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  const principal = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  for (const numero of [30, 1, 14]) {
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(numero));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    expect(await salvo(page, AUXILIAR)).toMatchObject({
      questaoAtual: numero - 1,
      respostas: {},
      conferidas: {},
      corrigidas: {},
      pontuadas: {},
      tentativas: {},
      pontos: 0,
    });
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
  await responder(page, 14);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principal);
  expect(
    await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID)
  ).toMatchObject({ pontos: 0 });
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterSituacao(id), ID)).toBe(
    'em-andamento'
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 10 de 30');
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 14 de 30');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 10 de 30');
});

test('limpar remove só a sessão ativa, preserva a outra e revisões vizinhas', async ({ page }) => {
  await page.evaluate(
    (chaves) => chaves.forEach((c) => localStorage.setItem(c, '{"sentinela":"preservar"}')),
    VIZINHAS
  );
  await abrir(page);
  await responder(page, 1);
  const principal = await page.evaluate((c) => localStorage.getItem(c), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await responder(page, 30);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((c) => localStorage.getItem(c), AUXILIAR)).toBeNull();
  expect(await page.evaluate((c) => localStorage.getItem(c), CHAVE)).toBe(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('14');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  const auxiliar = await page.evaluate((c) => localStorage.getItem(c), AUXILIAR);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((c) => localStorage.getItem(c), CHAVE)).toBeNull();
  expect(await page.evaluate((c) => localStorage.getItem(c), AUXILIAR)).toBe(auxiliar);
  expect(await page.evaluate((cs) => cs.map((c) => localStorage.getItem(c)), VIZINHAS)).toEqual(
    VIZINHAS.map(() => '{"sentinela":"preservar"}')
  );
});

test('JSON inválido, estado adulterado e armazenamento bloqueado são tolerados', async ({
  page,
}) => {
  await page.evaluate((c) => localStorage.setItem(c, '{corrompido'), CHAVE);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.evaluate(
    ({ chave, id }) =>
      localStorage.setItem(
        chave,
        JSON.stringify({
          versao: 1,
          questaoAtual: 999,
          pontos: 400,
          finalizada: true,
          respostas: { [id]: ['fora', 'fora', 'fora'] },
          corrigidas: { [id]: true, falsa: true },
          pontuadas: { falsa: true },
        })
      ),
    { chave: CHAVE, id: qid(1) }
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado no teste');
      };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('desktop: imagens carregadas, mapa proporcional, frases confortáveis e revisão legada', async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const n of [1, 2, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 27, 30]) {
      await preparar(page, n);
      const imagens = page.locator('#gramatica-conteudo img');
      await expect
        .poll(() =>
          imagens.evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0))
        )
        .toBe(true);
    }
    await auditar(page);
    const campo = await page.locator('[data-resposta-gramatica]').first().boundingBox();
    expect(campo.width).toBeGreaterThan(350);
    await expect(page.locator('.campo-gramatica-frase')).toHaveCount(0);
    await preparar(page, 13);
    await auditar(page);
  }
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
});

test('celular: toque, mapa, ordem, frases e painel acessíveis, sem overflow', async ({
  browser,
}) => {
  test.setTimeout(120000);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(URL);
  await abrir(page);
  for (const n of [1, 13, 14, 18, 26, 27, 30]) {
    await preparar(page, n);
    await auditar(page);
    if (n === 13) {
      await page.getByRole('button', { name: 'Selecionar Quadra', exact: true }).tap();
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    }
    if (n === 14) {
      for (const nome of ['Entrada', 'Banco', 'Brinquedos'])
        await page.getByRole('button', { name: nome, exact: true }).tap();
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    }
    if (n === 30) {
      const campo = await page.locator('[data-resposta-gramatica]').first().boundingBox();
      expect(campo.width).toBeGreaterThan(220);
    }
  }
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await auditar(page);
  await page.locator('#gramatica-modo-responsavel-encerrar').tap();
  expect(erros).toEqual([]);
  await contexto.close();
});

test('assets locais originais mantêm os dados críticos e não dependem de URLs externas', async () => {
  const pasta = 'assets/geografia-brincadeiras-lazer-outubro-2026';
  const files = fs.readdirSync(pasta);
  expect(files).toHaveLength(14);
  for (const name of files) {
    const svg = fs.readFileSync(path.join(pasta, name), 'utf8');
    expect(svg).toContain('viewBox="0 0 780 600"');
    expect(svg).not.toMatch(/(?:href|src)=["']https?:/);
    for (const m of svg.matchAll(/href="#([^"]+)"/g)) expect(svg).toContain('id="' + m[1] + '"');
  }
  const croqui = fs.readFileSync(path.join(pasta, 'croqui-parque.svg'), 'utf8');
  expect(croqui).toContain('M125 455L358 270L608 138');
  expect(croqui).toContain('M358 270L608 455');
  const table = fs.readFileSync(path.join(pasta, 'tabela-preferencias.svg'), 'utf8');
  for (const s of ['Ler histórias', 'Jogar bola', 'Desenhar', '>1<', '>4<', '>3<'])
    expect(table).toContain(s);
});

test('file:// permite mapa, ordem, ditado e recarga sem rede obrigatória', async ({ page }) => {
  const rede = [];
  await audio(page);
  await page.route(/^https?:/, (r) => {
    rede.push(r.request().url());
    return r.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await preparar(page, 13);
  await responder(page, 13);
  await preparar(page, 14);
  await responder(page, 14);
  await preparar(page, 30);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect
    .poll(() => page.evaluate(() => window.__falas.at(-1)?.texto))
    .toBe('A frase é: Podemos brincar em diferentes lugares.');
  await responder(page, 30);
  expect(rede).toEqual([]);
});
