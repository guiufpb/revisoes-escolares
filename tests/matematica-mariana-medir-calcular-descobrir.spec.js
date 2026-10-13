const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'mariana-matematica-medir-calcular-descobrir-outubro-2026';
const CHAVE = 'revisoesEscolares.mariana.matematica.medirCalcularDescobrirOutubro2026.v1';
const ANTIGA = 'revisoesEscolares.mariana.matematica.formasMedidasSetembro2026.v1';
const ALICE = 'revisoesEscolares.alice.matematica.capacidadeOperacoesNumeros.v1';
const TITULO = 'Medir, calcular e descobrir';
const CAMINHO = '/ambiente_interativo/index.html';
const ROOT = path.resolve(__dirname, '..');
// Oráculo independente da configuração usada pelo controlador.
const GABARITO = [
  ['Comprimento', 'Massa', 'Capacidade'],
  [
    'Régua de 20 cm e centímetro.',
    'Fita métrica flexível de 150 cm e centímetro.',
    'Trena de 20 metros e metro.',
  ],
  [8, 17],
  [200, 40, 130],
  ['14 unidades.', 'Menos unidades.'],
  ['Balança.', 'Massa.', 'kg.'],
  ['O saco de arroz.', 'A pera.', 'O livro e o bloco têm a mesma massa.'],
  [2000, 3, 1250],
  [1000, 600],
  [3, 2],
  ['Quanto cabe na garrafa.', 'Litro.', 'Mililitro.'],
  [3000, 5],
  ['Recipiente D.', 'Meio litro e 500 mL.'],
  [7, 5],
  [5, 4],
  [15, 12, '2 barras e 4 cubinhos.'],
  [80, 50, 40, 0],
  [37, 57, 44],
  [73, 474],
  ['Somar às dezenas a dezena formada pelas unidades.', '65.'],
  [33, 23],
  [55, 54, 36],
  [34, 33],
  [533, 326],
  ['44 livros.', '26 + 18.'],
  [14, 49, 9],
  [32, 25, 7],
  [41, 40, 5],
  ['Fica igual.', 'As mesmas pedrinhas apenas mudaram de caixa.'],
  [11, 4],
];
const FIGURAS = [3, 5, 7, 9, 10, 13, 15, 16, 26, 27, 29, 30];

async function abrir(page, iniciar = true) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await page.locator('#abrir-medir-calcular-descobrir').click();
  if (iniciar && (await page.locator('[data-math-start]').count()))
    await page.locator('[data-math-start]').click();
}

async function responder(page, numero) {
  for (const [indice, valor] of GABARITO[numero - 1].entries()) {
    const id = `q${String(numero).padStart(2, '0')}-${String.fromCharCode(97 + indice)}`;
    if (typeof valor === 'number')
      await page.locator(`[data-math-visual-input="${id}"]`).fill(String(valor));
    else await page.locator(`[data-math-visual-select="${id}"]`).selectOption(valor);
  }
}

async function conferir(page) {
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-consolidacao]')).toBeVisible();
}

async function ate(page, numero) {
  for (let q = 1; q < numero; q++) {
    await responder(page, q);
    await conferir(page);
    await page.locator('#matematica-cena-proxima').click();
  }
}

async function estado(page) {
  return page.evaluate((id) => window.MatematicaRevisoes.obterEstado(id), ID);
}

async function prepararQuestaoSintetica(page, numero) {
  const progresso = {
    versao: 1,
    etapaAtual: numero,
    cenas: {},
    pontuacoes: {},
    concluidas: {},
    finalizada: false,
  };
  for (let n = 1; n < numero; n++) {
    const qid = `q${String(n).padStart(2, '0')}`;
    progresso.cenas[qid] = {
      versao: 1,
      concluida: true,
      tentativas: 1,
      escolhas: Object.fromEntries(
        GABARITO[n - 1].map((v, i) => [`${qid}-${String.fromCharCode(97 + i)}`, String(v)])
      ),
    };
    progresso.pontuacoes[qid] = 1;
    progresso.concluidas[qid] = true;
  }
  await page.evaluate(({ chave, dados }) => localStorage.setItem(chave, JSON.stringify(dados)), {
    chave: CHAVE,
    dados: progresso,
  });
  await page.reload();
  await abrir(page, false);
  expect((await estado(page)).etapaAtual).toBe(numero);
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
});

test('registro exclusivo e conteúdo aprovado 30/75/30, bancos e ordem', async ({ page }) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.MatematicaRevisoes.listar().find((r) => r.id === id),
      registro: window.RegistroRevisoes.listar().find((r) => r.id === id),
    }),
    ID
  );
  expect(dados.registro).toMatchObject({
    aluno: 'mariana',
    chaveArmazenamento: CHAVE,
    totalEtapas: 32,
  });
  expect(dados.revisao).toMatchObject({
    aluno: 'mariana',
    titulo: TITULO,
    chaveArmazenamento: CHAVE,
  });
  expect(dados.revisao.etapas).toHaveLength(32);
  const questoes = dados.revisao.etapas.filter((q) => q.tipo === 'cena');
  expect(questoes).toHaveLength(30);
  expect(questoes.flatMap((q) => q.cena.campos)).toHaveLength(75);
  expect(questoes.flatMap((q) => q.cena.campos).filter((c) => c.opcoes)).toHaveLength(26);
  const posicoes = [];
  const quatro = [];
  for (const [indice, q] of questoes.entries()) {
    expect(q.id).toBe(`q${String(indice + 1).padStart(2, '0')}`);
    expect(q.cena.campos.map((c) => c.resposta)).toEqual(GABARITO[indice]);
    expect(q.cena.consolidacao.length).toBeGreaterThan(30);
    for (const [i, campo] of q.cena.campos.entries()) {
      expect(campo.id).toBe(`${q.id}-${String.fromCharCode(97 + i)}`);
      expect(campo.pista.length).toBeGreaterThan(15);
      if (campo.opcoes) {
        expect(new Set(campo.opcoes).size).toBe(campo.opcoes.length);
        const posicao = campo.opcoes.indexOf(campo.resposta);
        expect(posicao).toBeGreaterThanOrEqual(0);
        posicoes.push(posicao);
        if (campo.opcoes.length === 4) quatro.push(posicao);
      }
    }
  }
  expect([0, 1, 2, 3].map((p) => posicoes.filter((x) => x === p).length)).toEqual([8, 8, 7, 3]);
  expect(quatro).toEqual([0, 3, 2, 1, 2, 1, 0, 3, 1, 3]);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.locator('#abrir-medir-calcular-descobrir')).toBeHidden();
});

test('errar, pistas específicas, corrigir, 30 pontos únicos, final e recarga', async ({ page }) => {
  await abrir(page);
  await page.locator('[data-math-hint]').click();
  await expect(page.locator('[data-math-status]')).toContainText('Primeiro tente');
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await page.locator('[data-math-visual-select="q01-a"]').selectOption('Comprimento');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('[data-math-status]')).toContainText('quanto o pacote pesa');
  await expect(page.locator('[data-math-status]')).not.toContainText('de uma ponta até a outra');
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  for (let q = 1; q <= 30; q++) {
    await responder(page, q);
    await conferir(page);
    await conferir(page);
    expect((await estado(page)).pontos).toBe(q);
    await page.locator('#matematica-cena-proxima').click();
  }
  await expect(page.locator('.resumo-final-centenas')).toContainText('30 de 30');
  expect((await estado(page)).finalizada).toBe(true);
  await page.reload();
  await abrir(page, false);
  await expect(page.locator('.resumo-final-centenas')).toContainText('30 de 30');
});

test('008=8, retorno, edição invalida conferência/consolidação sem duplicar ponto', async ({
  page,
}) => {
  await abrir(page);
  await ate(page, 3);
  await page.locator('[data-math-visual-input="q03-a"]').fill(' 008 ');
  await page.locator('[data-math-visual-input="q03-b"]').fill('017');
  await page.locator('[data-math-visual-input="q03-b"]').press('Enter');
  await expect(page.locator('[data-math-consolidacao]')).toContainText('17 mm');
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await expect(page.locator('[data-math-consolidacao]')).toBeVisible();
  await page.locator('[data-math-visual-input="q03-a"]').fill('9');
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  expect((await estado(page)).pontos).toBe(3);
  expect((await estado(page)).concluidas.q03).toBeUndefined();
  await page.reload();
  await abrir(page, false);
  await expect(page.locator('[data-math-visual-input="q03-a"]')).toHaveValue('9');
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await page.locator('[data-math-visual-input="q03-a"]').fill('8');
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await conferir(page);
  expect((await estado(page)).pontos).toBe(3);
  await page.evaluate((id) => window.MatematicaRevisoes.abrir(id), ID);
  expect((await estado(page)).pontos).toBe(3);
  await page.locator('[data-math-visual-input="q03-a"]').fill('8.0');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
});

test('questão mista persistida e zero diferente de vazio em Q17d', async ({ page }) => {
  await abrir(page);
  await ate(page, 16);
  await responder(page, 16);
  await page.reload();
  await abrir(page, false);
  await expect(page.locator('[data-math-visual-input]')).toHaveCount(2);
  await expect(page.locator('[data-math-visual-select]')).toHaveCount(1);
  await conferir(page);
  await page.locator('#matematica-cena-proxima').click();
  await responder(page, 17);
  await page.locator('[data-math-visual-input="q17-d"]').fill('');
  await page.locator('[data-math-check]').click();
  await expect(page.locator('#matematica-cena-proxima')).toBeDisabled();
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await page.locator('[data-math-visual-input="q17-d"]').fill('000');
  await conferir(page);
  expect((await estado(page)).pontos).toBe(17);
});

test('dados corrompidos, versão/etapa inválida, escolhas desconhecidas e limpeza seletiva', async ({
  page,
}) => {
  await page.evaluate(
    ({ chave, antiga, alice }) => {
      localStorage.setItem(chave, '{JSON inválido');
      localStorage.setItem(antiga, 'marcador-antiga');
      localStorage.setItem(alice, 'marcador-alice');
    },
    { chave: CHAVE, antiga: ANTIGA, alice: ALICE }
  );
  await page.reload();
  await abrir(page);
  expect((await estado(page)).pontos).toBe(0);
  await page.evaluate(
    (chave) =>
      localStorage.setItem(
        chave,
        JSON.stringify({
          versao: 1,
          etapaAtual: 999,
          finalizada: true,
          concluidas: { q01: true },
          cenas: {
            q01: { versao: 1, concluida: true, tentativas: 1, escolhas: { 'q01-a': 'intrusa' } },
          },
        })
      ),
    CHAVE
  );
  await page.reload();
  await abrir(page, false);
  expect((await estado(page)).etapaAtual).toBe(1);
  expect((await estado(page)).finalizada).toBe(false);
  await expect(page.locator('[data-math-visual-select="q01-a"]')).toHaveValue('');
  await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
  await page.evaluate(
    (chave) =>
      localStorage.setItem(chave, JSON.stringify({ versao: 99, etapaAtual: 31, pontos: 30 })),
    CHAVE
  );
  await page.reload();
  await abrir(page, false);
  expect((await estado(page)).etapaAtual).toBe(0);
  await page.evaluate((id) => window.MatematicaRevisoes.limpar(id, false), ID);
  const armazenado = await page.evaluate(
    ({ chave, antiga, alice }) => [
      localStorage.getItem(chave),
      localStorage.getItem(antiga),
      localStorage.getItem(alice),
    ],
    { chave: CHAVE, antiga: ANTIGA, alice: ALICE }
  );
  expect(armazenado).toEqual([null, 'marcador-antiga', 'marcador-alice']);
});

test('armazenamento bloqueado mantém correção e progresso em memória', async ({ page }) => {
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem'])
      Storage.prototype[metodo] = () => {
        throw new DOMException('Bloqueado', 'SecurityError');
      };
  });
  await page.reload();
  await abrir(page);
  await responder(page, 1);
  await conferir(page);
  await page.locator('#matematica-cena-proxima').click();
  await page.locator('#matematica-cena-voltar').click();
  await expect(page.locator('[data-math-consolidacao]')).toBeVisible();
  expect((await estado(page)).pontos).toBe(1);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  for (const q of [...FIGURAS, 28]) {
    test(`visual Q${q}, foco, axe e console ${viewport.width}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      const erros = [];
      page.on('pageerror', (error) => erros.push(error.message));
      await prepararQuestaoSintetica(page, q);
      // Aguarda a entrada da tela antes de medir contraste e capturar seu estado final.
      await page.locator('#tela-matematica-cena').evaluate(async (tela) => {
        await Promise.all(
          tela.getAnimations({ subtree: true }).map((animacao) => animacao.finished)
        );
      });
      if (FIGURAS.includes(q)) {
        const imagens = page.locator('#recipiente-cena-matematica img');
        expect(await imagens.count()).toBeGreaterThan(0);
        await expect
          .poll(() =>
            imagens.evaluateAll((imgs) =>
              imgs.every((img) => img.complete && img.naturalWidth > 0 && img.alt.length > 20)
            )
          )
          .toBe(true);
        for (let i = 0; i < (await imagens.count()); i++) {
          await imagens
            .nth(i)
            .screenshot({ path: testInfo.outputPath(`q${q}-figura-${i}-${viewport.width}.png`) });
        }
      }
      await page.screenshot({
        path: testInfo.outputPath(`q${q}-${viewport.width}.png`),
        fullPage: true,
      });
      const resultado = await new AxeBuilder({ page }).include('#tela-matematica-cena').analyze();
      expect(resultado.violations).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
      if (q === 28) {
        await expect(page.locator('th[scope="col"]')).toHaveText([
          'Material',
          'Equipe Sol',
          'Equipe Lua',
        ]);
        await expect(page.locator('th[scope="row"]')).toHaveText([
          'Lápis',
          'Borrachas',
          'Cadernos',
        ]);
        await expect(page.locator('td')).toHaveText(['17', '24', '8', '12', '15', '9']);
      }
      if (q === 30) {
        await expect(page.locator('[data-math-consolidacao]')).toHaveCount(0);
        await expect(page.locator('#recipiente-cena-matematica img[alt*="face 4"]')).toHaveCount(0);
        await expect(page.locator('[data-math-visual-input="q30-b"]')).toHaveValue('');
      }
      await responder(page, q);
      await conferir(page);
      await page.locator('#matematica-cena-proxima').focus();
      await expect(page.locator('#matematica-cena-proxima')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#matematica-cena-titulo')).toBeFocused();
      expect(erros).toEqual([]);
      await page.evaluate(() =>
        window.MatematicaRevisoes.abrir('mariana-matematica-formas-medidas-setembro-2026')
      );
      await expect(page.locator('.layout-desktop-amplo')).toHaveCount(0);
    });
  }
}

test('toque, seleção nativa e correção recuperável', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(CAMINHO);
  await page.getByRole('button', { name: /Mariana/ }).tap();
  await page.getByRole('button', { name: /Matemática/ }).tap();
  await page.locator('#abrir-medir-calcular-descobrir').tap();
  await page.locator('[data-math-start]').tap();
  await page.locator('[data-math-check]').tap();
  await expect(page.locator('[data-math-status]')).toContainText('Pista:');
  await responder(page, 1);
  await page.locator('[data-math-check]').tap();
  await expect(page.locator('[data-math-consolidacao]')).toBeVisible();
  await context.close();
});

test('figuras determinísticas: escalas, borda, balanças, contagens, carteiras e dados', () => {
  const pasta = path.join(ROOT, 'assets/matematica-medir-calcular-descobrir-outubro-2026');
  const svg = (nome) => fs.readFileSync(path.join(pasta, `${nome}.svg`), 'utf8');
  expect((svg('regua-a').match(/<line /g) || []).length).toBe(16); // eixo + 13 marcas + 2 projeções
  expect((svg('regua-b').match(/<line /g) || []).length).toBe(29);
  expect((svg('horta').match(/<line /g) || []).length).toBe(9); // 5 verticais e 4 horizontais: 4 × 3 células
  expect(svg('balanca-a')).toContain('x1="100" y1="130" x2="260" y2="70"');
  expect(svg('balanca-b')).toContain('x1="100" y1="70" x2="260" y2="130"');
  expect(svg('balanca-c')).toContain('x1="100" y1="100" x2="260" y2="100"');
  expect((svg('pacotes-9').match(/data-pacote=/g) || []).length).toBe(5);
  expect((svg('pacotes-10').match(/data-pacote=/g) || []).length).toBe(6);
  for (const [letra, barras, cubinhos] of [
    ['a', 4, 2],
    ['b', 2, 4],
    ['c', 2, 3],
    ['d', 3, 4],
  ]) {
    expect((svg(`base-dez-${letra}`).match(/data-barra=/g) || []).length).toBe(barras * 10);
    expect((svg(`base-dez-${letra}`).match(/data-cubinho=/g) || []).length).toBe(cubinhos);
  }
  expect((svg('carteira-nina').match(/data-ficha=/g) || []).length).toBe(3);
  expect((svg('carteira-ravi').match(/data-ficha=/g) || []).length).toBe(8);
  const identidades = [...svg('pedrinhas').matchAll(/data-pedrinha="([^"]+)"/g)].map((m) => m[1]);
  const antes = identidades
    .filter((x) => x.startsWith('Antes-'))
    .map((x) => x.slice(6))
    .sort();
  const depois = identidades
    .filter((x) => x.startsWith('Depois-'))
    .map((x) => x.slice(7))
    .sort();
  expect(antes).toHaveLength(20);
  expect(depois).toEqual(antes);
  expect((svg('dados-a').match(/<circle /g) || []).length).toBe(15);
  expect((svg('dados-b').match(/<circle /g) || []).length).toBe(14); // apenas 5 + 3 + 6
  expect(svg('dados-b')).toContain('>?</text>');
});

test('bundle clássico por file:// com edição, conferência e recarga', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(pathToFileURL(path.join(ROOT, 'ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await conferir(page);
  await page.reload();
  await abrir(page, false);
  await expect(page.locator('[data-math-consolidacao]')).toBeVisible();
  expect((await estado(page)).pontos).toBe(1);
  expect(erros).toEqual([]);
  await context.close();
});
