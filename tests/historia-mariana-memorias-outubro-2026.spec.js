const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const URL = '/ambiente_interativo/index.html';
const ID = 'mariana-historia-transportes-memorias-outubro-2026';
const CHAVE = 'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1';
const AUX = 'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.responsavel.v1';
const CARTAO = '#abrir-historia-memorias-outubro-mariana';
const VIZINHAS = [
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v1',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
  'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
];
const FRASES = [
  'Respeitamos as pessoas durante a viagem.',
  'O diário guarda acontecimentos e sentimentos.',
  'As fotografias ajudam a conhecer histórias.',
];
// Gabarito independente transcrito do pedido. Arrays aninhados são conjuntos/ordens.
const GABARITO = [
  ['Terrestre', 'Aquático', 'Aéreo', 'Terrestre', 'Aquático', 'Terrestre'],
  ['Trem a vapor.', 'trilhos'],
  ['Primeira classe', 'Segunda classe', 'Primeira classe', 'Segunda classe'],
  [
    [
      '1. Mochila no colo, liberando o corredor.',
      '3. Conversa sem gritar.',
      '4. Oferecer o assento a quem precisa.',
    ],
  ],
  ['passeio turístico', 'deslocamento cotidiano', 'Podem levar várias pessoas.'],
  ['Superlotação.', 'Falso', 'Verdadeiro'],
  ['3', '4', 'transportar pessoas por terra'],
  [
    'congestionamento',
    [
      '2. Usar transporte coletivo quando disponível e adequado.',
      '3. Compartilhar uma viagem que já seria feita, com organização dos adultos.',
    ],
  ],
  ['Verdadeiro', 'Falso', 'Verdadeiro', 'Falso'],
  ['madeira', 'Para conhecer formas de viver e viajar do passado.'],
  ['estudantes', 'frutas', 'água', 'terra'],
  [
    [
      'Aguardar a vez em um lugar seguro.',
      'Entrar com calma quando o adulto responsável orientar.',
      'Sentar no lugar indicado e permanecer em segurança.',
    ],
    'Usar o colete salva-vidas adequado, colocado com ajuda do adulto.',
  ],
  [['mesa', 'cadeira', 'espelho', 'livro', 'sofá'], 'Como era um ambiente de moradia.'],
  [
    'identificar uma pessoa',
    'registrar o nascimento',
    'registrar vacinas recebidas',
    'registrar acontecimentos e sentimentos',
    'reunir fotografias',
    'brincar',
  ],
  ['Nina Estrela', '12 de maio de 2019', 'Vila das Conchas'],
  ['brincadeiras da infância', 'preparo de alimentos', 'vida escolar', 'comunicação entre pessoas'],
  ['Clara.', 'Uma visita a uma exposição.', 'Curiosa.'],
  ['diário pessoal', 'diário familiar', 'diário de viagem'],
  [
    '20 de setembro de 2026.',
    'Querido diário,',
    'Hoje conheci um brinquedo que meu tio usava quando era pequeno.',
    'Fiquei contente com a descoberta.',
  ],
  ['Theo', 'Lia', 'Vila das Conchas', '21 de setembro de 2026', 'barco'],
  ['local e data', 'pessoa a quem se escreve', 'mensagem', 'despedida', 'assinatura'],
  ['papel', 'digital', 'se comunicar'],
  ['Verdadeiro', 'Verdadeiro', 'Falso', 'Verdadeiro'],
  ['2017: Luna bebê', '2020: Luna brinca no parque', '2023: Luna participa de uma festa escolar'],
  [
    ['1. Há livros.', '2. Há sete pessoas.', '4. O encontro ocorreu em 2024.'],
    'Não; precisaríamos de mais informações.',
  ],
  ['Retrato do grupo em uma festa de casamento.', 'Duas crianças brincam na praça.'],
  [
    [
      '1. Guardar fotografias de papel em local limpo e protegido.',
      '3. Com ajuda do adulto, fazer uma cópia digital e guardar informações sobre a foto.',
      '5. Manusear com cuidado os objetos de uma exposição.',
    ],
  ],
  ['foto A', 'estilo das roupas', 'finalidade de registrar um grupo', 'posadas'],
  [
    'imagem',
    'registro escrito',
    'registro escrito',
    'A fotografia.',
    'O bilhete.',
    'Para combinar informações e conhecer melhor o acontecimento.',
  ],
  FRASES,
];
const CAMPOS = [7, 15, 20, 22, 30];
const ORDENS = [19, 24];
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
    if (CAMPOS.includes(n)) await page.locator('[data-resposta-gramatica]').nth(i).fill(valor);
    else if (ORDENS.includes(n))
      await page.getByRole('button', { name: valor, exact: true }).click();
    else {
      const grupo = [4, 27].includes(n)
        ? page.locator('[data-interacao-questionario]')
        : page.locator('[data-item-gramatica]').nth(i);
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

test('cadastro exclusivo, recursos declarativos, fontes e posições fixas', async ({ page }) => {
  const r = await page.evaluate(
    (id) => ({
      conteudo: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(r.registro).toMatchObject({
    chaveArmazenamento: CHAVE,
    totalEtapas: 30,
    aluno: 'mariana',
  });
  expect(r.conteudo).toMatchObject({
    materia: 'História',
    chave: CHAVE,
    layout: { desktopAmplo: true },
    registrarTentativas: true,
    validacaoEstritaEstado: true,
  });
  expect(r.conteudo.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([CHAVE, AUX]);
  expect(r.conteudo.questoes).toHaveLength(30);
  expect(new Set(r.conteudo.questoes.map((q) => q.id)).size).toBe(30);
  r.conteudo.questoes.forEach((q, i) => {
    expect(q.titulo).toMatch(new RegExp('^' + (i + 1) + '\\. '));
  });
  expect(new Set(r.conteudo.questoes.map((q) => q.bloco)).size).toBe(6);
  for (const n of [1, 7, 13, 17, 23, 29]) {
    expect(r.conteudo.questoes[n - 1].leitura).toBeTruthy();
    expect(r.conteudo.questoes[n - 1].leituraTitulo).toContain('Leia para aprender');
  }
  for (const [n, texto] of [
    [17, 'Clara.'],
    [20, 'Theo.'],
    [21, 'Isa.'],
    [24, 'Luna'],
    [28, '1920'],
    [29, 'Bilhete'],
  ])
    expect(r.conteudo.questoes[n - 1].leitura).toContain(texto);
  expect(r.conteudo.questoes[25].leitura).toBeUndefined();
  const q30 = r.conteudo.questoes[29];
  expect(q30).toMatchObject({ ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true });
  for (const campo of q30.itens) {
    expect(campo.fraseCompleta).toBe(true);
    expect(campo.pontuacaoFlexivel).toBe(true);
    expect(campo.maiusculasObrigatorias).toBeFalsy();
    expect(campo.acentuacaoObrigatoria).toBeFalsy();
  }
  // Letras obrigatórias das alternativas da síntese; associações têm outra auditoria.
  const letras = [
    [2, 0, 1],
    [5, 2, 2],
    [6, 0, 0],
    [10, 1, 2],
    [12, 1, 0],
    [13, 1, 0],
    [17, 0, 2],
    [17, 1, 0],
    [17, 2, 1],
    [25, 1, 2],
    [26, 0, 1],
    [26, 1, 0],
    [29, 3, 1],
    [29, 4, 0],
    [29, 5, 2],
  ];
  const posicoes = letras.map(([n, i, p]) => {
    const item = r.conteudo.questoes[n - 1].itens[i];
    expect(item.opcoes.indexOf(item.respostas[0])).toBe(p);
    return p;
  });
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  for (const n of [1, 3, 14, 16, 18, 21]) {
    const itens = r.conteudo.questoes[n - 1].itens;
    expect(itens.map((i) => i.opcoes.indexOf(i.respostas[0]))).not.toEqual(itens.map((_, i) => i));
  }
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
});

test('percurso independente das 30 questões: vazio e erro não pontuam; correção e recarga', async ({
  page,
}) => {
  test.setTimeout(180_000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${n} de 30`);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n - 1} de 30`);
    await responder(page, n);
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    if ([6, 12, 16, 22, 28, 30].includes(n)) {
      await page.reload();
      await abrir(page);
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    }
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.locator('#gramatica-contador')).toHaveText('30 questões concluídas');
  expect(await estado(page)).toMatchObject({ pontos: 30, finalizada: true });
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

for (const n of [8, 12, 13, 25, 29])
  test(`Q${n}: todos os subitens necessários, correção e invalidação sem duplicar pontos`, async ({
    page,
  }) => {
    await preparar(page, n);
    await preencher(page, n);
    const ultimo = page.locator('[data-item-gramatica]').last();
    const certo = n === 8 ? GABARITO[7][1][0] : GABARITO[n - 1].at(-1);
    const botao = ultimo.getByRole('button', { name: certo, exact: true });
    await botao.click();
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
    await botao.click();
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
    const errado = ultimo
      .locator('button')
      .filter({
        hasText:
          n === 8
            ? '1. Cada pessoa'
            : n === 12
              ? 'Trocar de lugar'
              : n === 13
                ? 'data de nascimento'
                : n === 25
                  ? 'Sim, apenas porque estão juntas'
                  : 'registro mais bonito',
      })
      .first();
    if (n === 8) {
      // Último subitem é conjunto: desmarca uma escolha necessária.
      await ultimo.getByRole('button', { name: GABARITO[n - 1][1][0], exact: true }).click();
    } else await errado.click();
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await conferir(page);
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    if (n === 8)
      await ultimo.getByRole('button', { name: GABARITO[n - 1][1][0], exact: true }).click();
    else await botao.click();
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  });

test('seleção reversível e várias ações persistidas com teclado', async ({ page }) => {
  await preparar(page, 4);
  const grupo = page.locator('[data-interacao-questionario]');
  for (const nome of GABARITO[3][0]) {
    const b = grupo.getByRole('button', { name: nome, exact: true });
    await b.focus();
    await page.keyboard.press('Space');
  }
  await page.reload();
  await abrir(page);
  await expect(grupo.locator('[aria-pressed="true"]')).toHaveCount(3);
  const ruim = grupo.getByRole('button', { name: '2. Pés no banco.', exact: true });
  await ruim.click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await ruim.click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(grupo.locator('[aria-pressed="true"]')).toHaveCount(3);
});

test('ordenação permite retirar e repor; sequência parcial e erros sobrevivem à recarga', async ({
  page,
}) => {
  await preparar(page, 19);
  const ordem = GABARITO[18];
  await page.getByRole('button', { name: ordem[1], exact: true }).click();
  await page.getByRole('button', { name: ordem[0], exact: true }).click();
  await conferir(page);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  const retirar = page.locator('[data-retirar-ordem]');
  await expect(retirar).toHaveCount(2);
  await retirar.first().click();
  await retirar.first().click();
  await responder(page, 19);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(4);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('ditado: normalização de História, subitens vazios e palavras alteradas', async ({ page }) => {
  await preparar(page, 30);
  const campos = page.locator('[data-resposta-gramatica]');
  for (let i = 0; i < 2; i++) await campos.nth(i).fill(FRASES[i]);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await campos.nth(2).fill('As fotografias ajudam a conhecer pessoas.');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  for (const [i, f] of FRASES.entries())
    await campos.nth(i).fill(
      f
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replaceAll(' ', '  ')
        .replace('.', '!')
    );
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.reload();
  await abrir(page);
  await expect(campos.nth(1)).toHaveValue('O  DIARIO  GUARDA  ACONTECIMENTOS  E  SENTIMENTOS!');
});

test('áudio de frase protegido, local, sem vazamento ou preenchimento; repetir, parar e trocar', async ({
  page,
}) => {
  await audio(page);
  await preparar(page, 30);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  const html = await page.locator('#gramatica-conteudo').innerHTML();
  for (const f of FRASES) expect(html).not.toContain(f);
  const ouvir = page.locator('[data-ouvir-ditado-gramatica]');
  for (const [i, f] of FRASES.entries()) {
    await ouvir.nth(i).focus();
    await page.keyboard.press('Enter');
    const ultima = await page.evaluate(() => window.__falas.at(-1));
    expect(ultima).toEqual({
      texto: 'A frase é: ' + f,
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
      .nth((i + 1) % 3)
      .focus();
    expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(cancelamentos);
    await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
  }
  await page.locator('[data-parar-ditado-gramatica]').click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
  for (const f of FRASES)
    expect(await page.locator('#gramatica-conteudo').innerHTML()).not.toContain(f);
});

test('sem voz local, mensagem acessível e trabalho preservado', async ({ page }) => {
  await audio(page, true);
  await preparar(page, 30);
  await page.locator('[data-resposta-gramatica]').first().fill('Minha tentativa');
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText(/voz|vozes/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('Minha tentativa');
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
  expect(Object.keys(auxiliar.corrigidas)).toEqual(['memorias-q30']);
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
      respostas: { 'memorias-q04': [['fantasma', 'fantasma']] },
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
  await preparar(page, 13);
  await expect(page.locator('.ilustracao-leitura-questionario')).toBeVisible();
  expect(rede).toEqual([]);
});

test('contratos visuais locais: contagem, contexto e imagens sem falhas', async ({ page }) => {
  const svg = fs.readFileSync('assets/historia-memorias-outubro/leitura.svg', 'utf8');
  expect(svg.match(/data-person="true"/g)).toHaveLength(7);
  const imagens = await page.evaluate(
    (id) =>
      window.QuestionariosRevisoes.obterRevisao(id)
        .questoes.flatMap((q) => [q.ilustracaoLeitura, ...q.itens.map((i) => i.imagem)])
        .filter(Boolean),
    ID
  );
  for (const src of new Set(imagens)) {
    const r = await page.request.get('/' + src.replace('../', ''));
    expect(r.ok()).toBe(true);
    expect(await r.text()).toContain('<svg');
  }
  for (const n of [4, 7, 13, 25, 26, 28]) {
    await preparar(page, n);
    const imgs = page.locator('#gramatica-conteudo img').filter({ hasNot: page.locator('unused') });
    expect(
      await imgs.evaluateAll((elements) => elements.every((e) => e.complete && e.naturalWidth > 0))
    ).toBe(true);
  }
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
])
  test(`layout e acessibilidade ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    for (const n of [4, 7, 13, 25, 26, 28, 30]) {
      await preparar(page, n);
      await auditar(page);
      if (n === 30) {
        await expect(page.locator('.gramatica-com-leitura')).toHaveCount(0);
        const input = await page.locator('[data-resposta-gramatica]').first().boundingBox();
        expect(input.width).toBeGreaterThan(viewport.width === 390 ? 150 : 600);
      }
    }
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await auditar(page);
    await page.screenshot({
      path: `output/historia-outubro-${viewport.width}.png`,
      fullPage: true,
    });
  });

test('toque em cena, retirada e reposição na ordenação mista', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(URL);
  await preparar(page, 12);
  const primeiro = GABARITO[11][0][0];
  await page.getByRole('button', { name: primeiro, exact: true }).tap();
  await page.locator('[data-retirar-ordem-misto]').tap();
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
  for (const v of GABARITO[11][0]) await page.getByRole('button', { name: v, exact: true }).tap();
  await page
    .locator('[data-item-gramatica]')
    .nth(1)
    .getByRole('button', { name: GABARITO[11][1], exact: true })
    .tap();
  await conferir(page);
  await auditar(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await ctx.close();
});
