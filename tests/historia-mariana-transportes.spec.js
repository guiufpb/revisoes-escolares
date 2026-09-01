const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ID = 'mariana-historia-convivencia-transportes-agosto-2026';
const CHAVE = 'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2';
const URL = '/ambiente_interativo/index.html';
const OUTRAS = [
  'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
  'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1',
  'revisoesEscolares.mariana.matematica.centenasEmAcao.v2',
  'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v1',
  'revisoesEscolares.mariana.historia.outraRevisao.v1',
];
const FRASES = [
  'No ônibus, devemos respeitar os outros.',
  'A maria-fumaça é um trem.',
  'As pessoas são diferentes e merecem respeito.',
];
const SEQUENCIA = [
  'Pessoas usando carroça, charrete e bonde',
  'Primeiros automóveis a gasolina',
  'Ônibus se tornando comuns nas grandes cidades',
  'Trânsito atual com muitos carros e ônibus',
];
const MULTIPLAS = {
  1: ['A pé', 'A cavalo', 'Charrete', 'Carroça', 'Barco', 'Bonde', 'Trem'],
  6: ['Pessoas', 'Mercadorias e volumes', 'Animais'],
  13: ['Passageiros esperavam muito tempo', 'Ônibus vinham superlotados'],
  21: [
    'Usar transporte coletivo quando for adequado',
    'Caminhar em trajetos possíveis e seguros',
    'Usar bicicleta quando houver condições seguras',
    'Compartilhar uma viagem de carro quando fizer sentido',
  ],
  27: [
    'Transportar passageiros',
    'Ajudar no deslocamento em localidades com rios ou litoral',
    'Ligar lugares onde a água faz parte do caminho',
  ],
  29: [
    'Mapas',
    'Fotografias antigas',
    'Depoimentos de pessoas mais velhas',
    'Objetos antigos, como uma canoa preservada',
    'Prédios antigos e igrejas históricas preservados como patrimônio',
  ],
};
const OPCOES = {
  2: ['Trem'],
  3: ['Porque soltavam fumaça durante o funcionamento.'],
  4: ['Terrestre', 'Terrestre', 'Terrestre', 'Terrestre', 'Aquático', 'Aquático', 'Aéreo', 'Aéreo'],
  5: ['Mais confortáveis e com passagens mais caras.'],
  7: [
    'P — primeira classe',
    'S — segunda classe',
    'P — primeira classe',
    'S — segunda classe',
    'S — segunda classe',
  ],
  8: ['Respeitar o espaço dos outros passageiros.'],
  9: ['150 anos'],
  10: [
    'Santos (SP)',
    'Santos (SP)',
    'Santa Teresa, Rio de Janeiro (RJ)',
    'Santa Teresa, Rio de Janeiro (RJ)',
  ],
  12: ['1940'],
  14: ['Superlotação dos ônibus'],
  15: ['Respeitar a fila e o espaço das outras pessoas.'],
  16: ['Bicicleta'],
  18: ['Três rodas', 'Quatro rodas'],
  19: ['Poucas pessoas podiam comprar.'],
  20: ['Congestionamento'],
  23: ['Uma canoa feita a partir de um tronco de árvore.'],
  25: ['Escavando ou esculpindo um único tronco de árvore.'],
  26: ['Porque ela ajuda a conhecer a vida e a história do passado.'],
  28: ['Verdadeiro', 'Verdadeiro', 'Falso', 'Verdadeiro', 'Verdadeiro', 'Falso'],
};

async function abrir(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-historia-transportes').click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
async function preparar(page, numero) {
  await page.evaluate(
    ({ chave, numero }) =>
      localStorage.setItem(chave, JSON.stringify({ questaoAtual: numero - 1 })),
    { chave: CHAVE, numero }
  );
  await page.reload();
  await abrir(page);
}
async function conferir(page) {
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
}
async function responder(page, n) {
  if (MULTIPLAS[n]) {
    for (const resposta of MULTIPLAS[n])
      await page.getByRole('button', { name: resposta, exact: true }).click();
  } else if (OPCOES[n]) {
    for (const [i, resposta] of OPCOES[n].entries())
      await page
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', { name: resposta, exact: true })
        .click();
  } else if (n === 22) {
    for (const texto of SEQUENCIA)
      await page.getByRole('button', { name: texto, exact: true }).click();
  } else {
    const respostas = n === 30 ? FRASES : [n === 11 ? '1908' : n === 17 ? '1886' : 'piroga'];
    for (const [i, resposta] of respostas.entries())
      await page.locator('[data-resposta-gramatica]').nth(i).fill(resposta);
  }
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}
async function auditar(page) {
  // Aguarda a tela estável: a entrada animada usa opacidade intermediária.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
}
async function simularAudio(page) {
  await page.addInitScript(() => {
    window.__falas = [];
    window.__cancelamentos = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = () => [
      { name: 'Voz online', lang: 'pt-BR', localService: false },
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

test.beforeEach(async ({ page }) => {
  page.errosHistoria = [];
  page.on('pageerror', (e) => page.errosHistoria.push(e.message));
  page.on('console', (e) => {
    if (e.type() === 'error') page.errosHistoria.push(e.text());
  });
  await page.goto(URL);
});
test.afterEach(async ({ page }) => {
  expect(page.errosHistoria).toEqual([]);
});

test('cadastro exclusivo, 30 questões numeradas, escrita, ditado e rótulos da matéria', async ({
  page,
}) => {
  const dados = await page.evaluate(
    (id) => ({
      revisao: window.QuestionariosRevisoes.obterRevisao(id),
      registro: window.RegistroRevisoes.obter(id),
    }),
    ID
  );
  expect(dados.revisao.chave).toBe(CHAVE);
  expect(dados.registro.totalEtapas).toBe(30);
  expect(dados.registro.chaveArmazenamento).toBe(CHAVE);
  expect(dados.revisao.questoes).toHaveLength(30);
  expect(dados.revisao.layout).toEqual({ desktopAmplo: true });
  expect(new Set(dados.revisao.questoes.map((q) => q.id)).size).toBe(30);
  dados.revisao.questoes.forEach((q, i) => {
    expect(q.titulo).toMatch(new RegExp('^' + (i + 1) + '\\. '));
    expect(q.leituraTitulo).toBe('Leia para aprender');
    expect(q.leitura.trim().length).toBeGreaterThan(40);
    expect(q.fonteEstudo.trim().length).toBeGreaterThan(10);
  });
  expect(dados.revisao.questoes.flatMap((q, i) => (q.tipo === 'campos' ? [i + 1] : []))).toEqual([
    11, 17, 24, 30,
  ]);
  expect(dados.revisao.questoes.flatMap((q, i) => (q.ditado ? [i + 1] : []))).toEqual([24, 30]);
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#abrir-historia-transportes')).toBeHidden();
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.getByRole('region', { name: 'Leia para aprender' })).toBeVisible();
  await expect(page.locator('.fonte-estudo-questionario')).toContainText('Fonte de estudo:');
  await expect(page.locator('#progresso-resumo')).toContainText('História: questão 1/30');
  await expect(page.locator('#limpar-progresso')).toHaveText('Limpar progresso de História');
});

test('Q10 a Q14 apresentam na própria tela as fontes necessárias para responder', async ({
  page,
}) => {
  const leituras = {
    10: [/Santos \(SP\).*fins de semana.*turistas/i, /Santa Teresa.*diariamente.*moradores/i],
    11: [/1908/i, /década de 1940/i],
    12: [/1908/i, /década de 1940/i],
    13: [/esperavam horas/i, /superlotados/i, /nem paravam/i],
    14: [/1954/i, /2016/i, /superlotados/i],
  };
  for (const [numero, trechos] of Object.entries(leituras)) {
    await preparar(page, Number(numero));
    const leitura = page.getByRole('region', { name: 'Leia para aprender' });
    await expect(leitura).toBeVisible();
    for (const trecho of trechos) await expect(leitura).toContainText(trecho);
    await expect(leitura.locator('.fonte-estudo-questionario')).toBeVisible();
  }
});

test('Q1 várias seleções, erro, desfazer por teclado, correção, retorno e recarga sem duplicar pontos', async ({
  page,
}) => {
  await abrir(page);
  const errado = page.getByRole('button', { name: 'Metrô moderno', exact: true });
  await errado.press('Space');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('.retorno-gramatica')).toContainText('Pense nos meios antigos');
  await errado.press('Enter');
  for (const texto of MULTIPLAS[1])
    await page.getByRole('button', { name: texto, exact: true }).click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(7);
  await conferir(page);
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(7);
  await page.getByRole('button', { name: 'Trem', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(6);
  await page.getByRole('button', { name: 'Trem', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('percurso completo com gabarito independente, 30 pontos e status central concluído', async ({
  page,
}) => {
  test.setTimeout(120000);
  await abrir(page);
  for (let n = 1; n <= 30; n++) {
    await expect(page.locator('#gramatica-contador')).toHaveText(`Questão ${n} de 30`);
    await responder(page, n);
    await expect(page.locator('#gramatica-pontos')).toHaveText(`${n} de 30`);
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Mariana!' })).toBeVisible();
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  await page.locator('#gramatica-voltar').click();
  await conferir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-ir-inicio]').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator('#abrir-historia-transportes')).toHaveAttribute(
    'data-estado-revisao',
    'concluida'
  );
});

test('Q7 e Q10 exigem todos os subitens e restauram associações parciais e completas', async ({
  page,
}) => {
  for (const n of [7, 10]) {
    await preparar(page, n);
    const escolhas = OPCOES[n];
    for (let i = 0; i < escolhas.length - 1; i++)
      await page
        .locator('[data-item-gramatica]')
        .nth(i)
        .getByRole('button', { name: escolhas[i], exact: true })
        .click();
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await page.reload();
    await abrir(page);
    await expect(page.locator('[data-opcao-gramatica][aria-pressed="true"]')).toHaveCount(
      escolhas.length - 1
    );
    const ultima = page
      .locator('[data-item-gramatica]')
      .last()
      .getByRole('button', { name: escolhas.at(-1), exact: true });
    await ultima.press('Space');
    await conferir(page);
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
    await ultima.press('Space');
    await expect(ultima).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await ultima.press('Enter');
    await conferir(page);
    await page.locator('#gramatica-proxima').click();
    await page.locator('#gramatica-voltar').click();
    await expect(page.locator('[data-opcao-gramatica][aria-pressed="true"]')).toHaveCount(
      escolhas.length
    );
  }
});

test('Q11 e Q17 aceitam só o ano, ignoram espaços externos e preservam várias edições', async ({
  page,
}) => {
  for (const [n, ano] of [
    [11, '1908'],
    [17, '1886'],
  ]) {
    await preparar(page, n);
    const campo = page.locator('[data-resposta-gramatica]');
    await campo.fill('ano ' + ano);
    await campo.press('Enter');
    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await page.reload();
    await abrir(page);
    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await campo.fill(ano.slice(0, 1));
    await campo.fill(ano.slice(0, 3));
    await page.reload();
    await abrir(page);
    await expect(campo).toHaveValue(ano.slice(0, 3));
    await campo.fill(' ' + ano + ' ');
    await campo.press('Enter');
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
});

test('Q13 permite retirar distrator após erro e conferir de novo sem pular', async ({ page }) => {
  await preparar(page, 13);
  await page.getByRole('button', { name: 'Todos os ônibus chegavam vazios', exact: true }).click();
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.getByRole('button', { name: 'Todos os ônibus chegavam vazios', exact: true }).click();
  await responder(page, 13);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('Q22 cartão errado na primeira posição, recarga, retirar, limpar, teclado e corrigir', async ({
  page,
}) => {
  await preparar(page, 22);
  for (const texto of [...SEQUENCIA].reverse())
    await page.getByRole('button', { name: texto, exact: true }).press('Enter');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(4);
  await page.locator('[data-retirar-ordem="0"]').press('Space');
  await expect(page.getByRole('button', { name: SEQUENCIA[3], exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Limpar sequência', exact: true }).click();
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
  await responder(page, 22);
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-voltar').click();
  await page.reload();
  await abrir(page);
  await expect(page.locator('[data-retirar-ordem]')).toHaveCount(4);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
});

test('Q24 e Q30 ditado local sem vazamento, repetição, parada, campos e cancelamento', async ({
  page,
}) => {
  test.setTimeout(90000);
  await simularAudio(page);
  for (const n of [24, 30]) {
    await preparar(page, n);
    expect(await page.evaluate(() => window.__falas)).toEqual([]);
    const textos = n === 24 ? ['piroga'] : FRASES;
    const html = await page.locator('#gramatica-conteudo').innerHTML();
    for (const texto of textos) expect(html.toLowerCase()).not.toContain(texto.toLowerCase());
    for (const [i, texto] of textos.entries()) {
      await page
        .locator('[data-ouvir-ditado-gramatica]')
        .nth(i)
        .press(i % 2 ? 'Space' : 'Enter');
      await expect.poll(async () => page.evaluate(() => window.__falas.at(-1)?.texto)).toBe(texto);
      const fala = await page.evaluate(() => window.__falas.at(-1));
      expect(fala).toMatchObject({ idioma: 'pt-BR', velocidade: 0.78, local: true });
      await expect(page.locator('[data-resposta-gramatica]').nth(i)).toHaveValue('');
    }
    const falas = await page.evaluate(() => window.__falas);
    expect(falas[0]).toMatchObject({ texto: 'Preparando.', volume: 0.01 });
    expect(falas[1].texto).toBe('Atenção.');
    const antes = falas.length;
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect
      .poll(async () => page.evaluate(() => window.__falas.length))
      .toBeGreaterThan(antes);
    await page.locator('[data-parar-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
    const cancelamentos = await page.evaluate(() => window.__cancelamentos);
    await page.locator('[data-ouvir-ditado-gramatica]').first().click();
    if (n === 30) {
      await page.locator('[data-resposta-gramatica]').nth(1).focus();
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
    }
    await page.locator('#gramatica-voltar').click();
    expect(await page.evaluate(() => window.__cancelamentos)).toBeGreaterThan(cancelamentos);
    const quantidade = await page.evaluate(() => window.__falas.length);
    await page.waitForTimeout(2100);
    expect(await page.evaluate(() => window.__falas.length)).toBe(quantidade);
  }
  await preparar(page, 30);
  for (let abertura = 0; abertura < 3; abertura++) {
    await page.locator('[data-resposta-gramatica]').first().focus();
    const antes = await page.evaluate(() => window.__cancelamentos);
    await page.locator('[data-resposta-gramatica]').nth(1).focus();
    expect(await page.evaluate(() => window.__cancelamentos)).toBe(antes + 1);
    await page.locator('#botao-inicio').click();
    await abrir(page);
  }
});

test('Q30 três frases corrigíveis, caixa e espaços flexíveis, ponto opcional e persistência', async ({
  page,
}) => {
  await preparar(page, 30);
  const campos = page.locator('[data-resposta-gramatica]');
  await campos.nth(0).fill('no  onibus devemos respeitar os outros');
  await campos.nth(1).fill('a maria-fumaça é um barco.');
  await campos.nth(2).fill('AS PESSOAS SÃO DIFERENTES E MERECEM RESPEITO.');
  await conferir(page);
  await expect(campos.nth(1)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await campos.nth(1).fill('a maria-fumaça é um trem');
  await page.reload();
  await abrir(page);
  await expect(campos.nth(0)).toHaveValue('no  onibus devemos respeitar os outros');
  await expect(campos.nth(1)).toHaveValue('a maria-fumaça é um trem');
  await expect(campos.nth(2)).toHaveValue('AS PESSOAS SÃO DIFERENTES E MERECEM RESPEITO.');
  await conferir(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('limpeza seletiva e troca para Gramática não vazam matéria, layout ou áudio', async ({
  page,
}) => {
  await simularAudio(page);
  await page.evaluate(
    (outras) => outras.forEach((chave) => localStorage.setItem(chave, '{"sentinela":"preservar"}')),
    OUTRAS
  );
  await preparar(page, 24);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.locator('#abrir-gramatica-mariana').click();
  await expect(page.locator('#tela-gramatica-mariana .migalhas strong')).toHaveText('Gramática');
  await expect(page.locator('#gramatica-progresso')).toHaveAttribute(
    'aria-label',
    'Progresso da revisão de Gramática'
  );
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await page.waitForTimeout(2100);
  expect(await page.evaluate(() => window.__falas)).toEqual([]);
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await page.locator('[data-resposta-gramatica]').fill('piroga');
  await conferir(page);
  page.once('dialog', (dialogo) => {
    expect(dialogo.message()).toContain('História');
    return dialogo.accept();
  });
  await page.locator('#limpar-progresso').click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBeNull();
  expect(
    await page.evaluate((outras) => outras.map((chave) => localStorage.getItem(chave)), OUTRAS)
  ).toEqual(OUTRAS.map(() => '{"sentinela":"preservar"}'));
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('dados inválidos, etapa fora do intervalo, versão e confirmação incompatível são normalizados', async ({
  page,
}) => {
  for (const dados of [
    '{inválido',
    JSON.stringify({ versao: 99, questaoAtual: 29 }),
    JSON.stringify({
      questaoAtual: -99,
      respostas: { 'transportes-q01': ['incompatível'] },
      corrigidas: { 'transportes-q01': true },
      pontos: 999,
    }),
  ]) {
    await page.evaluate(({ chave, dados }) => localStorage.setItem(chave, dados), {
      chave: CHAVE,
      dados,
    });
    await page.reload();
    await abrir(page);
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  }
  await page.evaluate(
    (chave) =>
      localStorage.setItem(
        chave,
        JSON.stringify({
          questaoAtual: 999,
          respostas: { desconhecida: ['x'] },
          corrigidas: { desconhecida: true },
        })
      ),
    CHAVE
  );
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 30 de 30');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

test('armazenamento bloqueado mantém progresso na aba e reabrir não duplica ações', async ({
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
  await page.locator('#botao-inicio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await expect(page.locator('[data-selecao][aria-pressed="true"]')).toHaveCount(7);
  await page.getByRole('button', { name: 'A pé', exact: true }).click();
  await expect(page.getByRole('button', { name: 'A pé', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false'
  );
});

test('390 × 844, toque, classificação, ordenação e ditado sem overflow e com axe', async ({
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
  await abrir(page);
  for (const n of [1, 4, 7, 10, 18, 22, 24, 28, 30]) {
    await preparar(page, n);
    await auditar(page);
    if (n === 1) {
      await page.getByRole('button', { name: 'Trem', exact: true }).tap();
      await expect(page.getByRole('button', { name: 'Trem', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
    if (n === 22) {
      await page.getByRole('button', { name: SEQUENCIA[3], exact: true }).tap();
      await page.locator('[data-retirar-ordem]').tap();
      await expect(page.locator('[data-retirar-ordem]')).toHaveCount(0);
    }
    if ([4, 22, 30].includes(n))
      await page.screenshot({ path: `test-results/historia-mobile-q${n}.png`, fullPage: true });
  }
  expect(erros).toEqual([]);
  await contexto.close();
});

test('desktop 1366 e 1920, cabeçalho e tela sem overflow', async ({ page }) => {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await preparar(page, 30);
    await auditar(page);
    const titulo = await page.locator('#gramatica-titulo-questao').boundingBox();
    expect(titulo.y).toBeGreaterThan(0);
    await page.screenshot({ path: `test-results/historia-desktop-${width}.png`, fullPage: true });
  }
});

test('file:// sem rede, seleção, persistência, ordenação e ditado local', async ({ page }) => {
  await simularAudio(page);
  const rede = [];
  await page.route(/^https?:/, (rota) => {
    rede.push(rota.request().url());
    return rota.abort();
  });
  await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
  await abrir(page);
  await responder(page, 1);
  await page.reload();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await preparar(page, 22);
  await responder(page, 22);
  await preparar(page, 24);
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect.poll(async () => page.evaluate(() => window.__falas.at(-1)?.texto)).toBe('piroga');
  await responder(page, 24);
  expect(rede).toEqual([]);
});
