const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'alice-matematica-dezenas-numeros-dinheiro-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.v1';
const AUX = 'revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.responsavel.v1';
const CARTAO = '#abrir-matematica-dezenas-numeros-dinheiro-outubro-2026';
const URL = '/ambiente_interativo/index.html';
const VIZINHAS = [
  'revisoesEscolares.alice.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1',
  'revisoesEscolares.mariana.matematica.contasDiaADia.v1',
  'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1',
];
// Gabarito independente transcrito do roteiro; não lê constantes de correção do aplicativo.
const GAB = [
  ['Bandeja B.', 'Uma bolinha.'],
  { campos: ['2', '7', '27'] },
  ['Vinte unidades.', 'Duas unidades.'],
  ['A — Quatro barras e nenhum cubinho.', 'B — Oito barras e três cubinhos.'],
  { campos: ['54', '90'] },
  { selecao: ['40', '70', '90', '20'] },
  ['setenta', 'dez', 'noventa', 'trinta', 'cinquenta'],
  { campos: ['sessenta', 'vinte', 'oitenta', 'quarenta'] },
  { campos: ['40', '100'] },
  { campos: ['50', '60'] },
  ['dezoito', 'onze', 'quinze'],
  { campos: ['quatorze', 'trinta e dois'] },
  { campos: ['48', '97'] },
  { campos: ['64', '82'] },
  { campos: ['69', '90'] },
  ['Cédula pedagógica com “R$ 5”.', 'Moeda pedagógica com “1 real”.'],
  { campos: ['34', '62'] },
  { campos: ['36', '77'] },
  ['Nina.', 'Léo.'],
  ['Os dois conjuntos têm o mesmo valor.'],
  ['Menor.', 'Maior.', 'Igual à quantidade no ábaco.'],
  { ordem: ['R$ 18', 'R$ 25', 'R$ 42', 'R$ 47'] },
  { campos: ['17', '5'] },
  { campos: ['7', '3'] },
  ['46', '40 + 6'],
];
const SUBITENS = [2, 3, 2, 2, 2, 1, 5, 4, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2];
const conferir = (page) => page.getByRole('button', { name: 'Conferir', exact: true }).click();
const salvo = (page, chave = CHAVE) =>
  page.evaluate((chave) => JSON.parse(localStorage.getItem(chave)), chave);
async function abrir(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#materia-matematica').click();
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
  const g = GAB[n - 1];
  if (g.campos) {
    for (const [i, texto] of g.campos.entries())
      await page.locator('[data-resposta-gramatica]').nth(i).fill(texto);
  } else if (g.selecao) {
    for (const texto of g.selecao)
      await page
        .locator('[data-interacao-questionario]')
        .getByRole('button', { name: texto, exact: true })
        .click();
  } else if (g.ordem) {
    for (const texto of g.ordem)
      await page.locator('[data-colocar-ordem-misto]').filter({ hasText: texto }).click();
  } else {
    for (const [i, texto] of g.entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', { name: texto, exact: true })
        .click();
  }
}
async function responder(page, n) {
  await preencher(page, n);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}
async function simularAudio(page, semVoz = false) {
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
  page.errosMatematica = [];
  page.on('pageerror', (erro) => page.errosMatematica.push(erro.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') page.errosMatematica.push(msg.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => {
  expect(page.errosMatematica).toEqual([]);
});

test('cadastro exclusivo e conteúdo: 25 questões, 55 subitens, cinco blocos e ordem editorial', async ({
  page,
}) => {
  const r = await page.evaluate((id) => window.QuestionariosRevisoes.obterRevisao(id), ID);
  expect(r).toMatchObject({
    chave: CHAVE,
    aluno: 'alice',
    materia: 'Matemática',
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
  });
  expect(r.questoes.map((q) => q.itens.length)).toEqual(SUBITENS);
  expect(new Set(r.questoes.map((q) => q.bloco)).size).toBe(5);
  expect(new Set(r.questoes.flatMap((q) => q.itens.map((i) => i.id))).size).toBe(55);
  expect(r.questoes[5].itens[0].opcoes).toEqual(['40', '70', '14', '7', '90', '59', '31', '20']);
  expect(r.questoes[21].itens[0].cartoes).toEqual(['R$ 47', 'R$ 25', 'R$ 42', 'R$ 18']);
  expect(r.questoes[6].itens[0].opcoes).toEqual([
    'trinta',
    'noventa',
    'dez',
    'cinquenta',
    'setenta',
  ]);
  const simples = r.questoes
    .filter((_, i) => ![6, 10].includes(i))
    .flatMap((q) =>
      q.itens
        .filter((i) => i.opcoes && i.respostas.length === 1)
        .map((i) => i.opcoes.indexOf(i.respostas[0]))
    );
  expect(simples).toEqual([2, 1, 2, 1, 0, 1, 2, 0, 1, 2, 1, 0, 1, 0, 0, 2]);
  expect(await page.evaluate((id) => window.RegistroRevisoes.obter(id), ID)).toMatchObject({
    aluno: 'alice',
    totalEtapas: 25,
    chaveArmazenamento: CHAVE,
  });
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 25');
  await expect(page.locator('#progresso-resumo')).toContainText('Matemática: questão 1/25');
});

for (let bloco = 0; bloco < 5; bloco++) {
  test(
    'gabarito independente: bloco ' + (bloco + 1) + ', ensino e avanço sem ponto duplicado',
    async ({ page }) => {
      await preparar(page, bloco * 5 + 1);
      for (let n = bloco * 5 + 1; n <= bloco * 5 + 5; n++) {
        if (n === 6) await expect(page.locator('.retorno-gramatica')).not.toContainText('10 — dez');
        if (n === 12)
          await expect(page.locator('#gramatica-conteudo')).not.toContainText('catorze');
        await responder(page, n);
        if (n === 6)
          for (const nome of [
            'dez',
            'vinte',
            'trinta',
            'quarenta',
            'cinquenta',
            'sessenta',
            'setenta',
            'oitenta',
            'noventa',
          ])
            await expect(page.locator('.retorno-gramatica')).toContainText(nome);
        if (n === 11)
          await expect(page.locator('.retorno-gramatica')).toContainText('catorze ou quatorze');
        await conferir(page);
        await expect(page.locator('#gramatica-pontos')).toHaveText(n - bloco * 5 + ' de 25');
        if (n < 25) await page.locator('#gramatica-proxima').click();
      }
    }
  );
}

test('recuperação: primeira tentativa errada, corrigir, voltar, recarregar e várias edições', async ({
  page,
}) => {
  await preparar(page, 2);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('2');
  await campos.nth(1).fill('7');
  await campos.nth(2).fill('9');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(campos.nth(0)).toHaveValue('2');
  await expect(campos.nth(2)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.retorno-gramatica')).toContainText('Cada barra vale dez');
  await campos.nth(2).fill('27');
  await conferir(page);
  await conferir(page);
  expect(await salvo(page)).toMatchObject({ pontos: 1, tentativas: { q02: 3 } });
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(campos.nth(2)).toHaveValue('27');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
  await campos.nth(2).fill('72');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await campos.nth(2).fill('27');
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
});

test('variantes finitas de extenso e dinheiro: aceita equivalências, rejeita inversões e centavos', async ({
  page,
}) => {
  await preparar(page, 12);
  for (const [a, b] of [
    ['CATORZE.', ' TRINTA   E DOIS. '],
    ['quatorze', 'trinta e dois'],
  ]) {
    await page.locator('[data-resposta-gramatica]').nth(0).fill(a);
    await page.locator('[data-resposta-gramatica]').nth(1).fill(b);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
  await page.locator('[data-resposta-gramatica]').nth(1).fill('trinta dois');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await preparar(page, 17);
  for (const variante of ['34', '34,00', 'R$ 34', 'R$34', 'R$ 34,00', 'R$34,00', ' 34   REAIS ']) {
    await page.locator('[data-resposta-gramatica]').nth(0).fill(variante);
    await page.locator('[data-resposta-gramatica]').nth(1).fill('62');
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
  for (const errada of ['3,40', '34,50', '43', 'trinta e quatro']) {
    await page.locator('[data-resposta-gramatica]').nth(0).fill(errada);
    await conferir(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  await preparar(page, 24);
  await page.locator('[data-resposta-gramatica]').nth(0).fill('6');
  await page.locator('[data-resposta-gramatica]').nth(1).fill('4');
  await conferir(page);
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(2);
  await page.locator('[data-resposta-gramatica]').nth(0).fill('7');
  await conferir(page);
  await expect(page.locator('[data-resposta-gramatica]').nth(0)).toHaveValue('7');
  await expect(page.locator('.retorno-gramatica')).toContainText('Troco é o que volta');
});

test('seleção exata e ordenação integral: desfazer por teclado, persistir e corrigir', async ({
  page,
}) => {
  await preparar(page, 6);
  await preencher(page, 6);
  await page.getByRole('button', { name: '14', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: '14', exact: true }).focus();
  await page.keyboard.press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(4);
  await preparar(page, 22);
  await page.locator('[data-colocar-ordem-misto]').filter({ hasText: 'R$ 47' }).click();
  await page.locator('[data-colocar-ordem-misto]').filter({ hasText: 'R$ 25' }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(2);
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('[data-limpar-ordem-misto]').focus();
  await page.keyboard.press('Enter');
  for (const texto of ['R$ 47', 'R$ 42', 'R$ 25', 'R$ 18'])
    await page.locator('[data-colocar-ordem-misto]').filter({ hasText: texto }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('[data-limpar-ordem-misto]').click();
  await responder(page, 22);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('[data-retirar-ordem-misto]')).toHaveCount(4);
});

test('ditado numérico opt-in: payload, não exposição, repetir, parar, cancelar e resposta independente', async ({
  page,
}) => {
  await simularAudio(page);
  await preparar(page, 14);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  const tela = await page
    .locator('#gramatica-conteudo')
    .evaluate((el) => el.outerHTML.toLowerCase());
  for (const alvo of ['64', '82', 'sessenta e quatro', 'oitenta e dois'])
    expect(tela).not.toContain(alvo);
  for (const [i, texto] of [
    'A frase é: sessenta e quatro.',
    'A frase é: oitenta e dois.',
  ].entries()) {
    await page.locator('[data-ouvir-ditado-gramatica]').nth(i).click();
    const esperado = { texto, idioma: 'pt-BR', rate: 0.78, pitch: 1, local: true };
    await expect.poll(() => page.evaluate(() => window.__falas.at(-1))).toEqual(esperado);
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__falas.length)).toBe((i + 1) * 2);
    expect(await page.evaluate(() => window.__falas.at(-1))).toEqual(esperado);
    await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText('interrompido');
    await page
      .locator('[data-resposta-gramatica]')
      .nth((i + 1) % 2)
      .focus();
    await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
  }
  await page.locator('[data-resposta-gramatica]').nth(0).fill('sessenta e quatro');
  await page.locator('[data-resposta-gramatica]').nth(1).fill('82');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('[data-resposta-gramatica]').nth(0).fill('64');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  const antes = await page.evaluate(() => window.__cancelamentos);
  await page.locator('#gramatica-proxima').click();
  expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(antes);
});

test('sem voz local: indisponibilidade explícita e mediação sem alvo escrito', async ({ page }) => {
  await simularAudio(page, true);
  await preparar(page, 14);
  await page.getByRole('button', { name: 'Ouvir primeiro número' }).click();
  await expect(page.locator('.status-ditado-gramatica')).toContainText(/voz|disponível/i);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await expect(page.locator('#gramatica-conteudo')).not.toContainText('sessenta e quatro');
  await responder(page, 14);
});

test('sessões: salto puro, restauração, recarga, cartão principal e limpeza seletiva', async ({
  page,
}) => {
  await page.evaluate(
    (chaves) => chaves.forEach((c) => localStorage.setItem(c, '{"preservar":true}')),
    VIZINHAS
  );
  await preparar(page, 2);
  await page.locator('[data-resposta-gramatica]').first().fill('2');
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  const principal = await page.evaluate((c) => localStorage.getItem(c), CHAVE);
  for (const n of [25, 1, 14]) {
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    expect(await salvo(page, AUX)).toMatchObject({
      questaoAtual: n - 1,
      pontos: 0,
      respostas: {},
      corrigidas: {},
      tentativas: {},
    });
  }
  await page.keyboard.press('Escape');
  await responder(page, 14);
  expect(await page.evaluate((c) => localStorage.getItem(c), CHAVE)).toBe(principal);
  expect(await page.evaluate((id) => window.QuestionariosRevisoes.obterEstado(id).pontos, ID)).toBe(
    0
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 2 de 25');
  await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('2');
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 14 de 25');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((c) => localStorage.getItem(c), AUX)).toBeNull();
  expect(await page.evaluate((c) => localStorage.getItem(c), CHAVE)).toBe(principal);
  await page.locator('#gramatica-modo-responsavel-encerrar').click();
  expect(await page.evaluate((cs) => cs.map((c) => localStorage.getItem(c)), VIZINHAS)).toEqual(
    VIZINHAS.map(() => '{"preservar":true}')
  );
});

test('armazenamento inválido ou bloqueado: não trava nem conclui a revisão', async ({ page }) => {
  for (const dados of [
    '{quebrado',
    '{"versao":99,"questaoAtual":24}',
    '{"versao":1,"questaoAtual":-9,"pontos":999,"finalizada":true,"respostas":{"q01":["inválida"]},"corrigidas":{"q01":true}}',
  ]) {
    await page.evaluate(({ chave, dados }) => localStorage.setItem(chave, dados), {
      chave: CHAVE,
      dados,
    });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 25');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  }
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('bloqueado');
    };
    Storage.prototype.setItem = () => {
      throw new Error('bloqueado');
    };
    Storage.prototype.removeItem = () => {
      throw new Error('bloqueado');
    };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 25');
});

test('geometria: conta peças reais, células, argolas, cédulas e grade com origem comum', async ({
  page,
}) => {
  const pasta = path.resolve(
    __dirname,
    '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026'
  );
  const dados = Object.fromEntries(
    fs
      .readdirSync(pasta)
      .map((n) => [
        n.replace(/^alice-matematica-dezenas-numeros-dinheiro-outubro-2026-/, ''),
        fs.readFileSync(path.join(pasta, n), 'utf8'),
      ])
  );
  const contagens = await page.evaluate(
    (dados) =>
      Object.fromEntries(
        Object.entries(dados).map(([nome, texto]) => {
          const dom = new window.DOMParser().parseFromString(texto, 'image/svg+xml');
          return [
            nome,
            {
              erro: dom.querySelectorAll('parsererror').length,
              bases: [...dom.querySelectorAll('[data-cena="base-dez"]')].map((g) => [
                g.querySelectorAll('[data-peca="barra"]').length,
                g.querySelectorAll('[data-peca="cubinho"]').length,
                [...g.querySelectorAll('[data-peca="barra"]')].map(
                  (b) => b.querySelectorAll('rect').length
                ),
              ]),
              abacos: [...dom.querySelectorAll('[data-cena="abaco"]')].map((g) => [
                g.querySelectorAll('[data-argola="D"]').length,
                g.querySelectorAll('[data-argola="U"]').length,
              ]),
              bandejas: [...dom.querySelectorAll('[data-bandeja]')].map(
                (g) => g.querySelectorAll('circle').length
              ),
              cedulas: [...dom.querySelectorAll('[data-cedula]')].map((g) =>
                Number(g.getAttribute('data-cedula'))
              ),
              moedas: [...dom.querySelectorAll('[data-moeda]')].map((g) =>
                g.getAttribute('data-moeda')
              ),
              grafico: [...dom.querySelectorAll('[data-categoria]')].map((g) => [
                g.getAttribute('data-categoria'),
                g.querySelectorAll('[data-grade]').length,
                g.querySelectorAll('[data-objeto]').length,
                g.querySelector('rect').getAttribute('x'),
              ]),
            },
          ];
        })
      ),
    dados
  );
  for (const c of Object.values(contagens)) {
    expect(c.erro).toBe(0);
    for (const [d, , celulas] of c.bases) expect(celulas).toEqual(Array(d).fill(10));
  }
  expect(contagens['q01-bandejas.svg'].bandejas).toEqual([12, 10, 9]);
  for (const [nome, esperado] of Object.entries({
    'q02-base-dez.svg': [[2, 7]],
    'q04a-opcoes.svg': [
      [4, 0],
      [0, 4],
      [4, 1],
    ],
    'q04b-opcoes.svg': [
      [3, 8],
      [8, 3],
      [8, 0],
    ],
    'q08a-barras.svg': [[6, 0]],
    'q08b-barras.svg': [[2, 0]],
    'q08c-barras.svg': [[8, 0]],
    'q08d-barras.svg': [[4, 0]],
    'q21c-representacoes.svg': [[3, 6]],
  }))
    expect(contagens[nome].bases.map((b) => b.slice(0, 2))).toEqual(esperado);
  expect(contagens['q05a-abaco.svg'].abacos).toEqual([[5, 4]]);
  expect(contagens['q05b-abaco.svg'].abacos).toEqual([[9, 0]]);
  expect(contagens['q21c-representacoes.svg'].abacos).toEqual([[3, 6]]);
  expect(contagens['q17a-carteira.svg'].cedulas).toEqual([10, 10, 10]);
  expect(contagens['q17a-carteira.svg'].moedas).toEqual(Array(4).fill('1 real'));
  expect(contagens['q17b-carteira.svg'].cedulas).toEqual(Array(6).fill(10));
  expect(contagens['q17b-carteira.svg'].moedas).toEqual(Array(2).fill('1 real'));
  expect(contagens['q18a-carteira.svg'].cedulas).toEqual([20, 10, 5]);
  expect(contagens['q18b-carteira.svg'].cedulas).toEqual([50, 20, 5, 2]);
  expect(contagens['q19-nina-leo.svg'].cedulas).toEqual([2, 2, 2, 10]);
  expect(contagens['q20-equivalencia.svg'].cedulas).toEqual([50, 20, 20, 10]);
  expect(contagens['q23-grafico.svg'].grafico).toEqual([
    ['Pipas', 17, 12, '120'],
    ['Barquinhos', 17, 17, '120'],
    ['Flores', 17, 15, '120'],
  ]);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test('layout, cenas legíveis, teclado e axe em ' + viewport.width, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const n of [4, 5, 8, 14, 16, 23]) {
      await preparar(page, n);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
      for (const img of await page.locator('#gramatica-conteudo img').all())
        expect(await img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
      if ([5, 8].includes(n)) {
        for (const img of await page.locator('.imagem-campo-questionario').all())
          expect((await img.boundingBox()).width).toBeGreaterThan(200);
      }
      await page.screenshot({ path: testInfo.outputPath('q' + n + '.png'), fullPage: true });
    }
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    await page.locator('[data-resposta-gramatica]').first().focus();
    await page.keyboard.type('17');
    await page.locator('[data-resposta-gramatica]').nth(1).fill('5');
    await page.keyboard.press('Enter');
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
    await page.locator('[data-conferir-gramatica]').focus();
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
    await page.keyboard.press('Escape');
  });
}

test('file:// usa bundle local, cenas e ditado sem rede', async ({ page }) => {
  await simularAudio(page);
  await page.route(/^https?:/, (route) => route.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill('14');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ouvir primeiro número' }).click();
  await expect
    .poll(() => page.evaluate(() => window.__falas.at(-1)?.texto))
    .toBe('A frase é: sessenta e quatro.');
});

test('conclusão em 25 pontos, recarga e cartão; limpar principal preserva auxiliar', async ({
  page,
}) => {
  // Fixture independente das primeiras vinte respostas; as cinco finais passam pela interface.
  const base = {
    versao: 1,
    questaoAtual: 20,
    respostas: {},
    conferidas: {},
    corrigidas: {},
    pontuadas: {},
    pontos: 20,
  };
  for (let i = 0; i < 20; i++) {
    const qid = 'q' + String(i + 1).padStart(2, '0'),
      g = GAB[i];
    base.respostas[qid] = g.campos || (g.selecao ? [g.selecao] : g);
    base.conferidas[qid] = true;
    base.corrigidas[qid] = true;
    base.pontuadas[qid] = true;
  }
  await page.evaluate(
    ({ chave, aux, base }) => {
      localStorage.setItem(chave, JSON.stringify(base));
      localStorage.setItem(aux, '{"versao":1,"questaoAtual":13}');
    },
    { chave: CHAVE, aux: AUX, base }
  );
  await page.reload();
  await abrir(page);
  for (let n = 21; n <= 25; n++) {
    await responder(page, n);
    await page.locator('#gramatica-proxima').click();
  }
  expect(await salvo(page)).toMatchObject({ pontos: 25, finalizada: true });
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('25 de 25');
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).toContainText(/Concluída/i);
  await page.locator('#materia-matematica').click();
  await page.locator(CARTAO).click();
  const auxiliar = await page.evaluate((c) => localStorage.getItem(c), AUX);
  page.once('dialog', (d) => d.accept());
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((c) => localStorage.getItem(c), CHAVE)).toBeNull();
  expect(await page.evaluate((c) => localStorage.getItem(c), AUX)).toBe(auxiliar);
});

test.describe('toque real em contexto sintético', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test('selecionar/desmarcar e abrir/fechar painel por toque', async ({ page }) => {
    await preparar(page, 6);
    await page.getByRole('button', { name: '40', exact: true }).tap();
    await expect(page.getByRole('button', { name: '40', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await page.getByRole('button', { name: '40', exact: true }).tap();
    await expect(page.getByRole('button', { name: '40', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await page.locator('[data-conferir-gramatica]').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-fechar').tap();
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
    await page.locator('#gramatica-modo-responsavel-encerrar').tap();
    await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
  });
});
