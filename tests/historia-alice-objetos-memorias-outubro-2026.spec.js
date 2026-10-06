const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { auditarPosicoesGabarito } = require('./helpers/auditoria-gabaritos');

const ID = 'alice-historia-objetos-memorias-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1';
const AUXILIAR = 'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.responsavel.v1';
const CARTAO = '#abrir-historia-objetos-memorias-outubro-2026';
const URL = '/ambiente_interativo/index.html';
const VIZINHAS = [
  'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
  'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1',
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
];

// Transcrição editorial independente. Não usa respostas da configuração ou do DOM.
const GABARITO = [
  ['Porque ele lembra uma tarde especial.'],
  [['Medalha da corrida', 'Foto do passeio', 'Sapatinho de bebê']],
  ['Guardar água', 'Proteger o pé', 'Mostrar as horas'],
  [['Duas crianças', 'Uma bola'], 'Consultar um registro da foto ou perguntar a quem sabe.'],
  { campos: ['memória', 'objeto'] },
  ['Quando Lia era bebê', 'Agora, na escola', 'Quando Lia era bebê'],
  [{ ordem: ['Usava sapatinhos de bebê', 'Aprendeu a andar', 'Começou a frequentar a escola'] }],
  ['Guardar livros', 'A maneira de usar a caixa.'],
  ['Madeira', 'Barro', 'Metal'],
  ['Verdadeiro', 'Falso', 'Verdadeiro'],
  ['Barro', 'Fibra de arumã', 'Bambu e sementes'],
  ['Baniwa', 'Karajá', 'Timbira'],
  [['Sementes', 'Bambu']],
  [
    ['Ouvir a explicação de quem fez o objeto', 'Perguntar com gentileza sobre o material'],
    'Há diferentes povos indígenas vivendo no presente.',
  ],
  { campos: ['Cada povo tem sua história.'] },
  ['Modelo antigo da comparação', 'Modelo atual da comparação'],
  ['Celular para conversar', 'Lâmpada para iluminar', 'Computador para escrever'],
  [['A espessura do corpo', 'A maneira de controlar o aparelho'], 'Mostrar imagens e sons.'],
  ['Fogão', 'Não. Algumas não podiam comprá-lo.'],
  ['Verdadeiro', 'Falso', 'Verdadeiro'],
  ['Mensagem no celular', 'Galeria de fotos', 'Convite digital'],
  [
    [
      'Bilhete com uma mensagem',
      'Certidão com data de nascimento',
      'Diário com relato de um passeio',
    ],
  ],
  ['Comunitária', 'Familiar', 'Escolar', 'Pessoal'],
  ['Certidão de nascimento', 'Livro de chamadas da turma'],
  [{ ordem: ['Separar objetos', 'Preparar fichas', 'Abrir a exposição'] }, 'Uma semana'],
  [
    'Cuidar de fontes e ajudar a conhecer outras épocas.',
    ['Ler ou ouvir as informações das fichas', 'Seguir as orientações da visita'],
  ],
  [
    {
      ordem: [
        'Escolher objetos com permissão',
        'Conversar sobre os objetos e preparar fichas',
        'Organizar peças e fichas para os visitantes',
      ],
    },
  ],
  ['Pião', 'Madeira', 'Brincar'],
  [
    ['A fotografia da corrida com legenda', 'A lembrança contada pelo familiar'],
    'Não. Precisamos consultar outras pistas.',
  ],
  { campos: ['Objetos guardam lembranças.', 'Museus cuidam da história.'] },
];
const SUBITENS = [
  1, 1, 3, 2, 2, 3, 1, 2, 3, 3, 3, 3, 1, 2, 1, 2, 3, 2, 2, 3, 3, 1, 4, 2, 2, 2, 1, 3, 2, 2,
];
const qid = (numero) => 'objetos-memorias-q' + String(numero).padStart(2, '0');
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
async function preencher(page, numero) {
  const resposta = GABARITO[numero - 1];
  if (resposta.campos) {
    const campos = page.locator('[data-resposta-gramatica]');
    await expect(campos).toHaveCount(resposta.campos.length);
    for (const [i, valor] of resposta.campos.entries()) await campos.nth(i).fill(valor);
    return;
  }
  for (const [i, valor] of resposta.entries()) {
    const item =
      resposta.length === 1 && Array.isArray(valor)
        ? page.locator('[data-interacao-questionario]')
        : page.locator('[data-item-gramatica]').nth(i);
    for (const texto of valor.ordem || (Array.isArray(valor) ? valor : [valor]))
      await item.getByRole('button', { name: texto, exact: true }).click();
  }
}
async function responder(page, numero) {
  await preencher(page, numero);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}
async function salvo(page, chave = CHAVE) {
  return page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), chave);
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
  page.errosHistoria = [];
  page.on('pageerror', (erro) => page.errosHistoria.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosHistoria.push(mensagem.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => {
  expect(page.errosHistoria).toEqual([]);
});

test('cadastro exclusivo, 30 questões, 65 subitens, seis blocos e posições fixas', async ({
  page,
}) => {
  const { revisao, registro } = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(revisao).toMatchObject({
    chave: CHAVE,
    aluno: 'alice',
    materia: 'História',
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
  });
  expect(registro).toMatchObject({
    aluno: 'alice',
    totalEtapas: 30,
    possuiAudio: true,
    chaveArmazenamento: CHAVE,
  });
  expect(revisao.questoes).toHaveLength(30);
  expect(revisao.questoes.map((q) => q.itens.length)).toEqual(SUBITENS);
  expect(SUBITENS.reduce((a, b) => a + b)).toBe(65);
  expect(new Set(revisao.questoes.map((q) => q.bloco)).size).toBe(6);
  const ids = revisao.questoes.flatMap((q) => q.itens.map((i) => i.id));
  expect(new Set(ids).size).toBe(65);
  const posicoes = [];
  revisao.questoes.forEach((q, i) => {
    expect(q.id).toBe(qid(i + 1));
    expect(q.titulo).toMatch(new RegExp('^' + (i + 1) + '\\. '));
    expect(q.leitura.length).toBeGreaterThan(90);
    expect(q.dica.length).toBeGreaterThan(25);
    expect(q.sucesso.length).toBeGreaterThan(25);
    for (const item of q.itens) {
      expect(item.maiusculasObrigatorias).toBeUndefined();
      expect(item.acentuacaoObrigatoria).toBeUndefined();
      expect(item.fraseCompleta).toBeUndefined();
      if (item.opcoes && item.respostas.length === 1)
        posicoes.push(item.opcoes.indexOf(item.respostas[0]));
    }
  });
  expect(auditarPosicoesGabarito(posicoes)).toEqual([]);
  expect(revisao.questoes.filter((q) => q.ditado).map((q) => q.id)).toEqual([
    qid(5),
    qid(15),
    qid(30),
  ]);
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#progresso-resumo')).toContainText('História: questão 1/30');
});

test('gabarito independente percorre as 30 questões, volta, recarrega e conclui com 30 pontos', async ({
  page,
}) => {
  test.setTimeout(120000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await responder(page, n);
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    if ([4, 7, 15, 25, 30].includes(n)) {
      await page.reload();
      await abrir(page);
      await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await conferir(page);
      await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    }
    await page.locator('#gramatica-proxima').click();
    if (n === 9) {
      await page.locator('#gramatica-voltar').click();
      await expect(page.locator('#gramatica-contador')).toHaveText('Questão 9 de 30');
      await page.locator('#gramatica-proxima').click();
    }
  }
  await expect(page.locator('#gramatica-titulo-questao')).toHaveText('Parabéns, Alice!');
  expect(await salvo(page)).toMatchObject({ finalizada: true, pontos: 30 });
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterSituacao(id), ID)).toBe(
    'concluida'
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
});

test('erro, dica, correção, edição após acerto e recarga preservam estado sem duplicar pontos', async ({
  page,
}) => {
  await abrir(page);
  const errada = page.getByRole('button', { name: 'Porque ele foi comprado ontem.', exact: true });
  await errada.click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('recorda');
  await page.reload();
  await abrir(page);
  await expect(errada).toHaveAttribute('aria-pressed', 'true');
  await responder(page, 1);
  await errada.click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await conferir(page);
  await responder(page, 1);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  expect((await salvo(page)).tentativas[qid(1)]).toBe(4);
});

test('seleção incompleta, extra e remoção persistem; vazio não conta tentativa', async ({
  page,
}) => {
  await preparar(page, 2);
  await conferir(page);
  expect((await salvo(page)).tentativas[qid(2)]).toBeUndefined();
  for (const name of ['Medalha da corrida', 'Foto do passeio'])
    await page.getByRole('button', { name, exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'Sapatinho de bebê', exact: true }).click();
  await page.getByRole('button', { name: 'Clipe novo', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-interacao-questionario] [aria-pressed="true"]')).toHaveCount(4);
  await page.getByRole('button', { name: 'Clipe novo', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  expect((await salvo(page)).tentativas[qid(2)]).toBe(3);
});

test('Q25 combina ordem e opção: retirar, limpar, recarregar e corrigir todos os subitens', async ({
  page,
}) => {
  await preparar(page, 25);
  const ordem = page.locator('[data-item-gramatica]').nth(0);
  await ordem.getByRole('button', { name: 'Abrir a exposição', exact: true }).click();
  await ordem.getByRole('button', { name: 'Separar objetos', exact: true }).click();
  await conferir(page);
  expect((await salvo(page)).tentativas[qid(25)]).toBeUndefined();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(2);
  await page.locator('[data-retirar-ordem-misto]').first().click();
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
  await responder(page, 25);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('[data-retirar-ordem-misto]').nth(1).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  expect((await salvo(page)).respostas[qid(25)]).toEqual([
    ['Separar objetos', 'Abrir a exposição'],
    'Uma semana',
  ]);
});

test('campos de História aceitam caixa, espaços, acentos e pontuação flexíveis; palavras erradas continuam corrigíveis', async ({
  page,
}) => {
  await preparar(page, 30);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('  OBJETOS   GUARDAM LEMBRANCAS! ');
  await campos.nth(1).fill('Museus apagam a história.');
  await conferir(page);
  await expect(campos.nth(1)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await campos.nth(1).fill('museus cuidam da historia');
  await page.reload();
  await abrir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await campos.nth(1).fill('história da cuidam museus');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

for (const numero of [5, 15, 30]) {
  test(
    'ditado Q' +
      numero +
      ': payload único local, sem vazamento, ouvir/repetir/parar e cancelamento',
    async ({ page }) => {
      await audio(page);
      await preparar(page, numero);
      expect(await page.evaluate(() => window.__falas)).toEqual([]);
      // IDs obrigatórios contêm "objetos-memorias"; audite texto e atributos de interface,
      // sem tratar identificadores técnicos ou caminhos dos ícones como respostas anunciadas.
      const interfaceDitado = await page.locator('#gramatica-conteudo').evaluate((el) =>
        [
          el.textContent,
          ...Array.from(el.querySelectorAll('*')).flatMap((item) =>
            Array.from(item.attributes)
              .filter(
                (a) =>
                  ['aria-label', 'title', 'placeholder', 'value'].includes(a.name) ||
                  a.name.startsWith('data-')
              )
              .map((a) => a.value)
          ),
        ]
          .join('\n')
          .toLowerCase()
      );
      for (const alvo of GABARITO[numero - 1].campos)
        expect(interfaceDitado).not.toContain(alvo.toLowerCase());
      for (const [i, alvo] of GABARITO[numero - 1].campos.entries()) {
        const antes = await page.evaluate(() => window.__falas.length);
        await page.locator('[data-ouvir-ditado-gramatica]').nth(i).click();
        const esperado = {
          texto: (numero === 5 ? 'A palavra é: ' : 'A frase é: ') + alvo,
          idioma: 'pt-BR',
          rate: 0.78,
          pitch: 1,
          local: true,
        };
        await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(antes + 1);
        expect((await page.evaluate(() => window.__falas)).at(-1)).toEqual(esperado);
        await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
        await page.locator('[data-repetir-ditado-gramatica]').click();
        await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe(antes + 2);
        expect((await page.evaluate(() => window.__falas)).at(-1)).toEqual(esperado);
        await page.locator('[data-parar-ditado-gramatica]').click();
        await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
        if (GABARITO[numero - 1].campos.length > 1) {
          await page
            .locator('[data-resposta-gramatica]')
            .nth((i + 1) % 2)
            .focus();
          await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
        }
      }
      const cancelamentos = await page.evaluate(() => window.__cancelamentos);
      await page.locator('#botao-inicio').click();
      expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(cancelamentos);
      const quantidade = await page.evaluate(() => window.__falas.length);
      await abrir(page);
      expect(await page.evaluate(() => window.__falas.length)).toBe(quantidade);
    }
  );
}

test('sem voz local, informa indisponibilidade e permite escrita acompanhada', async ({ page }) => {
  await audio(page, true);
  await preparar(page, 5);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText(/voz|disponível/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await responder(page, 5);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('responsável: atalho ignorado em campo, salto puro, Escape, sessões, recarga e encerramento', async ({
  page,
}) => {
  await preparar(page, 5);
  await page.locator('[data-resposta-gramatica]').first().focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  const principal = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  for (const numero of [30, 1, 15]) {
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
  await responder(page, 15);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principal);
  expect(
    await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id), ID)
  ).toMatchObject({ pontos: 0 });
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 5 de 30');
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 15 de 30');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 5 de 30');
});

test('cartão consulta principal e limpeza remove apenas chave ativa, preservando vizinhas', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.setItem(chave, '{"preservar":true}')),
    VIZINHAS
  );
  await abrir(page);
  await responder(page, 1);
  const principal = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await responder(page, 30);
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterSituacao(id), ID)).toBe(
    'em-andamento'
  );
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('14');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  const auxiliar = await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), AUXILIAR)).toBe(auxiliar);
  expect(
    await page.evaluate((chaves) => chaves.map((chave) => localStorage.getItem(chave)), VIZINHAS)
  ).toEqual(VIZINHAS.map(() => ' {"preservar":true}'.trim()));
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toContainText(/Não iniciada/i);
});

test('JSON inválido e estado impossível não fabricam respostas, conferências ou pontos', async ({
  page,
}) => {
  for (const dados of [
    '{inválido',
    JSON.stringify({ versao: 99, questaoAtual: 29 }),
    JSON.stringify({
      versao: 1,
      questaoAtual: -2,
      pontos: 999,
      finalizada: true,
      respostas: { [qid(1)]: ['inventada'] },
      corrigidas: { [qid(1)]: true },
      conferidas: { [qid(1)]: true },
    }),
  ]) {
    await page.evaluate(({ chave, dados }) => localStorage.setItem(chave, dados), {
      chave: CHAVE,
      dados,
    });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  await page.evaluate(
    ({ chave, id }) =>
      localStorage.setItem(
        chave,
        JSON.stringify({
          versao: 1,
          questaoAtual: 24,
          respostas: { [id]: [['Separar objetos', 'Separar objetos', 'fantasma'], 'Uma semana'] },
          corrigidas: { [id]: true },
        })
      ),
    { chave: CHAVE, id: qid(25) }
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(1);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('armazenamento bloqueado usa fallback em memória e mantém as sessões independentes', async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new Error('bloqueado no teste');
      };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('fontes visuais locais carregam e textos mantêm limites históricos e culturais', async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const n of [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 16, 18, 19, 25, 28, 29]) {
    await preparar(page, n);
    const imagem = page.locator('.ilustracao-leitura-questionario');
    await expect(imagem).toBeVisible();
    expect(await imagem.getAttribute('alt')).not.toContain('correta');
    expect(await imagem.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  const textos = await page.evaluate(
    (id) => window.QuestionariosRevisoes.obterRevisao(id).questoes.map((q) => q.leitura),
    ID
  );
  expect(textos[10]).toContain('apresentados como Timbira');
  expect(textos[13]).toContain('Brasil de hoje');
  expect(textos[19]).toContain('comprado nesta semana');
  expect(textos[20]).toContain('convivem hoje');
  expect(textos[22]).toContain('mais de uma história');
});

test('teclado: opção, conferência, ordenação, remoção e foco visível', async ({ page }) => {
  await abrir(page);
  await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
  const botao = page.getByRole('button', { name: GABARITO[0][0], exact: true });
  await botao.focus();
  await page.keyboard.press('Space');
  await expect(botao).toHaveAttribute('aria-pressed', 'true');
  expect(await botao.evaluate((el) => window.getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await preparar(page, 7);
  await page.getByRole('button', { name: 'Usava sapatinhos de bebê', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-retirar-ordem-misto]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
});

for (const [width, height] of [
  [1366, 768],
  [1920, 1080],
]) {
  test(
    'desktop ' + width + ': duas colunas, imagens, ditado e painel acessíveis',
    async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize({ width, height });
      for (const n of [4, 16, 19, 25, 28, 30]) {
        await preparar(page, n);
        await auditar(page);
        const colunas = await page
          .locator('.gramatica-com-leitura')
          .evaluate((el) =>
            window.getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean)
          );
        expect(colunas).toHaveLength(2);
        if (n === 16)
          await page.screenshot({
            path: 'test-results/alice-historia-' + width + '.png',
            fullPage: true,
          });
      }
      await page.keyboard.press('Control+Alt+R');
      await auditar(page);
      await page.locator('#botao-inicio').click();
      await page.getByRole('button', { name: /Alice/ }).click();
      await page.locator('#abrir-gramatica-h-til').click();
      await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
      await page.keyboard.press('Control+Alt+R');
      await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
    }
  );
}

test('celular 390 × 844: uma coluna, toque reversível, ditado, responsável e axe-core', async ({
  browser,
}) => {
  test.setTimeout(90000);
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await contexto.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(URL);
  for (const n of [4, 13, 16, 19, 25, 28, 30]) {
    await preparar(page, n);
    await auditar(page);
    expect(
      await page
        .locator('.gramatica-com-leitura')
        .evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length
        )
    ).toBe(1);
    if (n === 13) {
      const botao = page.getByRole('button', { name: 'Sementes', exact: true });
      await botao.tap();
      await botao.tap();
      await expect(botao).toHaveAttribute('aria-pressed', 'false');
    }
    if (n === 25) {
      await page.getByRole('button', { name: 'Separar objetos', exact: true }).tap();
      await page.locator('[data-retirar-ordem-misto]').tap();
      await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(0);
    }
    if (n === 28)
      await page.screenshot({ path: 'test-results/alice-historia-mobile.png', fullPage: true });
  }
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await auditar(page);
  await page.locator('#gramatica-modo-responsavel-encerrar').tap();
  expect(erros).toEqual([]);
  await contexto.close();
});

test('file:// sem rede: bundle, imagens, ordem, recarga, sessões e ditado', async ({ page }) => {
  await audio(page);
  const rede = [];
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
  await preparar(page, 25);
  await responder(page, 25);
  expect(
    await page
      .locator('.ilustracao-leitura-questionario')
      .evaluate((img) => img.complete && img.naturalWidth > 0)
  ).toBe(true);
  await preparar(page, 15);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect
    .poll(() => page.evaluate(() => window.__falas.at(-1)?.texto))
    .toBe('A frase é: Cada povo tem sua história.');
  await responder(page, 15);
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  expect(rede).toEqual([]);
});
