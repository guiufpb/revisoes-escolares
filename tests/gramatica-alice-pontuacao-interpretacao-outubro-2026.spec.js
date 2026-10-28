const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ID = 'alice-gramatica-pontuacao-interpretacao-outubro-2026';
const CHAVE = 'revisoesEscolares.alice.gramatica.pontuacaoInterpretacaoOutubro2026.v1';
const AUX = 'revisoesEscolares.alice.gramatica.pontuacaoInterpretacaoOutubro2026.responsavel.v1';
const CARTAO = '#abrir-alice-gramatica-pontuacao-interpretacao-outubro-2026';
const URL = '/ambiente_interativo/index.html';
// Oráculo editorial independente das respostas da configuração e do DOM.
const GABARITO = [
  'Que a informação terminou.',
  'Para pedir uma informação sobre o lápis.',
  'A alegria de Nina.',
  'Para separar alimentos da lista.',
  'A lista dos materiais.',
  '.',
  '?',
  '!',
  ',',
  'A caixa está no armário?',
  'Na sacola há maçã, pera e uva.',
  'Que bom!',
  'Consertar uma pipa.',
  'fita',
  'A rajada de vento passou e, depois, Bia percebeu a falta da fita.',
  'Porque tinha a mesma cor da fita que ela procurava.',
  'A dúvida sobre o lugar da fita.',
  'Porque a preocupação com a fita terminou.',
  '.',
  '?',
  ',',
  'A primeira apresenta uma informação; a segunda pede uma resposta.',
  'Separei estes materiais: régua, caderno e borracha.',
  '!',
  'pano',
  'bola',
  'pato',
  'O gato pulou.',
  'Onde fica o lago?',
  'Viva o jogo!',
];
const CAMPOS = [6, 7, 8, 9, 14, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30];
const HISTORIA =
  'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.';
const OUTRAS = [
  'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1',
  'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
];

test('[adicao:cadastro] identidade, conteúdo e opt-ins exclusivos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const data = await page.evaluate(
    (id) => ({
      record: window.RegistroRevisoes.obter(id),
      config: window.QuestionariosRevisoes.obterRevisao(id),
    }),
    ID
  );
  expect(data.record).toMatchObject({ aluno: 'alice', totalEtapas: 30, chaveArmazenamento: CHAVE });
  expect(data.config.questoes.filter((q) => q.tipo === 'opcoes')).toHaveLength(15);
  expect(data.config.questoes.filter((q) => q.tipo === 'campos')).toHaveLength(15);
  expect(
    new Set(data.config.questoes.flatMap((q) => [q.id, ...q.itens.map((i) => i.id)])).size
  ).toBe(60);
  expect(data.config).toMatchObject({
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    modoResponsavel: { habilitado: true },
  });
  expect(data.config.modoResponsavel.sessoes.map((s) => s.chaveArmazenamento)).toEqual([
    CHAVE,
    AUX,
  ]);
  const signatures = data.config.questoes
    .filter((q) => q.tipo === 'opcoes')
    .map((q) => q.itens[0].opcoes.indexOf(q.itens[0].respostas[0]));
  expect(signatures).toEqual([1, 2, 0, 2, 1, 0, 2, 1, 2, 1, 0, 2, 0, 1, 0]);
  await expect(page.locator('#tela-gramatica-mariana')).not.toContainText('undefined');
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.locator(CARTAO)).toBeHidden();
  expect(errors).toEqual([]);
});

test('[adicao:recuperacao] erro corrigível, retorno e recarga sem duplicação', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page
    .getByRole('button', { name: 'Que alguém está fazendo uma pergunta.', exact: true })
    .click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(
    page.getByRole('button', { name: 'Que alguém está fazendo uma pergunta.', exact: true })
  ).toHaveClass(/incorreta/);
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-proxima').click();
  await page.getByRole('button', { name: GABARITO[1], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-voltar').click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 30');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await expect(page.getByRole('button', { name: GABARITO[0], exact: true })).toHaveClass(/correta/);
  await page.locator('#gramatica-proxima').click();
  await expect(page.getByRole('button', { name: GABARITO[1], exact: true })).toHaveClass(/correta/);
  await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 30');
});

test('[adicao:isolamento] limpeza seletiva e revisões antigas preservadas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.evaluate(
    ({ aux, others }) => {
      localStorage.setItem(aux, '{"preservar":"auxiliar"}');
      for (const k of others) localStorage.setItem(k, '{"preservar":"outra revisao"}');
    },
    { aux: AUX, others: OUTRAS }
  );
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.evaluate((id) => window.QuestionariosRevisoes.limpar(id, false), ID);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  expect(
    await page.evaluate(
      ({ aux, others }) => [
        localStorage.getItem(aux),
        ...others.map((k) => localStorage.getItem(k)),
      ],
      { aux: AUX, others: OUTRAS }
    )
  ).toEqual([
    '{"preservar":"auxiliar"}',
    '{"preservar":"outra revisao"}',
    '{"preservar":"outra revisao"}',
  ]);
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator('#abrir-gramatica-h-til').click();
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
});

test('[adicao:storage-adverso] JSON inválido e armazenamento bloqueado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.evaluate((k) => localStorage.setItem(k, '{invalido'), CHAVE);
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  const bloqueio = await page.evaluate(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw Error('Bloqueado pelo teste');
      },
    });
    return ['getItem', 'setItem', 'removeItem'].map((metodo) => {
      try {
        window.localStorage[metodo]('sentinela-bloqueio', 'valor');
        return 'não bloqueado';
      } catch (erro) {
        return erro.message;
      }
    });
  });
  expect(bloqueio).toEqual([
    'Bloqueado pelo teste',
    'Bloqueado pelo teste',
    'Bloqueado pelo teste',
  ]);
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('alice');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});

test('[adicao:acessibilidade] teclado, foco e axe no conteúdo novo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-titulo-questao')).toBeFocused();
  await page.getByRole('button', { name: GABARITO[0], exact: true }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Conferir', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.retorno-gramatica')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  for (const n of [13, 25, 28]) {
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('[adicao:offline] bundle file e falhas de voz sem recurso externo', async ({ page }) => {
  await page.addInitScript(() => {
    window.__tts = { calls: [], cancels: 0, mode: 'pending', events: [] };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__tts.mode === 'novoice'
        ? []
        : [{ name: 'Maria local', lang: 'pt-BR', localService: true }];
    window.speechSynthesis.cancel = () => window.__tts.cancels++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__tts.calls.push(u);
      if (window.__tts.mode === 'error') u.onerror?.({ error: 'synthesis-failed' });
    };
    document.addEventListener('audioestadoalterado', (e) =>
      window.__tts.events.push({ fase: e.detail.fase, mensagem: e.detail.mensagem })
    );
  });
  const external = [];
  await page.route(/^https?:/, (route) => {
    external.push(route.request().url());
    return route.abort();
  });
  await page.goto(pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill(String(25));
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  for (const mode of ['novoice', 'error', 'missing']) {
    await page.evaluate((m) => {
      window.__tts.mode = m;
      if (m === 'missing') window.speechSynthesis.speak = undefined;
    }, mode);
    await page.locator('[data-ouvir-ditado-gramatica]').click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText(
      mode === 'novoice'
        ? 'Não foi encontrada'
        : mode === 'error'
          ? 'Não foi possível'
          : 'não oferece leitura'
    );
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
  }
  await page.locator('[data-resposta-gramatica]').fill('pano');
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  expect(external).toEqual([]);
});

test('[adicao:gabarito] percurso editorial independente das trinta questões', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const [i, response] of GABARITO.entries()) {
    const n = i + 1;
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão ' + n + ' de 30');
    if (n >= 13 && n <= 19)
      await expect(page.getByRole('region', { name: 'A fita da pipa' })).toContainText(HISTORIA);
    if (CAMPOS.includes(n)) {
      const input = page.locator('[data-resposta-gramatica]');
      await input.fill('resposta errada');
      await page.getByRole('button', { name: 'Conferir', exact: true }).click();
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await input.fill(response);
    } else {
      await page.getByRole('button', { name: response, exact: true }).click();
    }
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  await expect(page.locator('#gramatica-pontos')).toHaveText('30 de 30');
  const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), CHAVE);
  expect(saved.finalizada).toBe(true);
  expect(Object.keys(saved.pontuadas)).toHaveLength(30);
  expect(errors).toEqual([]);
});

test('[optins:callbacks] callbacks antigos não atravessam sessões', async ({ page }) => {
  await page.addInitScript(() => {
    window.__tts = { calls: [], cancels: 0, mode: 'pending', events: [] };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__tts.mode === 'novoice'
        ? []
        : [{ name: 'Maria local', lang: 'pt-BR', localService: true }];
    window.speechSynthesis.cancel = () => window.__tts.cancels++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__tts.calls.push(u);
      if (window.__tts.mode === 'error') u.onerror?.({ error: 'synthesis-failed' });
    };
    document.addEventListener('audioestadoalterado', (e) =>
      window.__tts.events.push({ fase: e.detail.fase, mensagem: e.detail.mensagem })
    );
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill(String(25));
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-resposta-gramatica]').fill('tentativa principal');
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect.poll(() => page.evaluate(() => window.__tts.calls.length)).toBe(1);
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.locator('#gramatica-modo-responsavel-questao').fill('25');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-resposta-gramatica]').fill('tentativa auxiliar');
  const before = await page.evaluate(() => ({
    text: document.querySelector('#tela-gramatica-mariana').innerText,
    storage: Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])),
    events: window.__tts.events,
  }));
  await page.evaluate(() => {
    const u = window.__tts.calls[0];
    u.onstart?.();
    u.onend?.();
    u.onerror?.({ error: 'late' });
  });
  expect(
    await page.evaluate(() => ({
      text: document.querySelector('#tela-gramatica-mariana').innerText,
      storage: Object.fromEntries(
        Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])
      ),
      events: window.__tts.events,
    }))
  ).toEqual(before);
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('alice');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('tentativa principal');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
});

test('[optins:sigilo] seis estímulos reservados e sinais finais verificados', async ({ page }) => {
  await page.addInitScript(() => {
    window.__tts = { calls: [], cancels: 0, mode: 'pending', events: [] };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__tts.mode === 'novoice'
        ? []
        : [{ name: 'Maria local', lang: 'pt-BR', localService: true }];
    window.speechSynthesis.cancel = () => window.__tts.cancels++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__tts.calls.push(u);
      if (window.__tts.mode === 'error') u.onerror?.({ error: 'synthesis-failed' });
    };
    document.addEventListener('audioestadoalterado', (e) =>
      window.__tts.events.push({ fase: e.detail.fase, mensagem: e.detail.mensagem })
    );
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  expect(await page.evaluate(() => window.__tts.calls.length)).toBe(0);
  for (const n of [25, 26, 27, 28, 29, 30]) {
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    const text = await page.locator('#tela-gramatica-mariana').innerText();
    const attrs = await page.locator('#tela-gramatica-mariana').evaluate((e) =>
      [...e.querySelectorAll('[aria-label],input')]
        .map((x) => [
          x.getAttribute('aria-label'),
          x.getAttribute('placeholder'),
          x.getAttribute('value'),
        ])
        .flat()
        .filter(Boolean)
        .join(' ')
    );
    for (const secret of GABARITO.slice(24)) {
      expect(text.toLowerCase()).not.toContain(secret.toLowerCase());
      expect(attrs.toLowerCase()).not.toContain(secret.toLowerCase());
    }
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    const calls = await page.evaluate(() => window.__tts.calls.length);
    await page.locator('[data-ouvir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__tts.calls.length)).toBe(calls + 1);
    expect(await page.evaluate(() => window.__tts.calls.at(-1).text)).toContain(GABARITO[n - 1]);
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    await page.locator('[data-repetir-ditado-gramatica]').click();
    await expect.poll(() => page.evaluate(() => window.__tts.calls.length)).toBe(calls + 2);
    const cancels = await page.evaluate(() => window.__tts.cancels);
    await page.locator('[data-parar-ditado-gramatica]').click();
    expect(await page.evaluate(() => window.__tts.cancels)).toBeGreaterThan(cancels);
    await expect(page.locator('.status-ditado-gramatica')).toHaveText('Áudio interrompido.');
    const stopped = await page.locator('.status-ditado-gramatica').innerText();
    await page.evaluate(() => {
      const u = window.__tts.calls.at(-1);
      u.onstart?.();
      u.onend?.();
      u.onerror?.({ error: 'late-after-stop' });
    });
    await expect(page.locator('.status-ditado-gramatica')).toHaveText(stopped);
    const wrong =
      n < 28 ? GABARITO[n - 1] + '!' : GABARITO[n - 1].slice(0, -1) + (n === 29 ? '.' : '?');
    await page.locator('[data-resposta-gramatica]').fill(wrong);
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await page.locator('[data-resposta-gramatica]').fill(
      n < 28
        ? GABARITO[n - 1].toUpperCase()
        : '  ' +
            GABARITO[n - 1]
              .toLowerCase()
              .replaceAll(' ', '  ')
              .replace(/([.!?])$/, ' $1') +
            ' '
    );
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  }
});

test('[optins:salto] salto e retorno cancelam áudio sem fabricar acertos', async ({ page }) => {
  await page.addInitScript(() => {
    window.__tts = { calls: [], cancels: 0, mode: 'pending', events: [] };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__tts.mode === 'novoice'
        ? []
        : [{ name: 'Maria local', lang: 'pt-BR', localService: true }];
    window.speechSynthesis.cancel = () => window.__tts.cancels++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__tts.calls.push(u);
      if (window.__tts.mode === 'error') u.onerror?.({ error: 'synthesis-failed' });
    };
    document.addEventListener('audioestadoalterado', (e) =>
      window.__tts.events.push({ fase: e.detail.fase, mensagem: e.detail.mensagem })
    );
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill(String(25));
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-ouvir-ditado-gramatica]').click();
  await expect.poll(() => page.evaluate(() => window.__tts.calls.length)).toBe(1);
  const cancels = await page.evaluate(() => window.__tts.cancels);
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-questao').fill(String(28));
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => window.__tts.cancels)).toBeGreaterThan(cancels);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await page.locator('#gramatica-voltar').click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 27 de 30');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 27 de 30');
  const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), CHAVE);
  expect(saved.pontuadas).toEqual({});
  expect(saved.corrigidas).toEqual({});
  expect(saved.finalizada).toBe(false);
});

test('[optins:desktop-1366] leitura e ditado sem sobreposição', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.setViewportSize({ width: 1366, height: 768 });
  for (const n of [13, 28]) {
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    if (n === 13)
      await expect(page.getByRole('region', { name: 'A fita da pipa' })).toContainText(HISTORIA);
    else {
      const button = page.locator('[data-ouvir-ditado-gramatica]');
      await button.scrollIntoViewIfNeeded();
      expect(
        await button.evaluate((e) => {
          const r = e.getBoundingClientRect();
          const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return at === e || e.contains(at);
        })
      ).toBe(true);
    }
  }
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
});

test('[optins:desktop-1920] leitura e ditado sem sobreposição', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const n of [13, 28]) {
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-questao').fill(String(n));
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    if (n === 13)
      await expect(page.getByRole('region', { name: 'A fita da pipa' })).toContainText(HISTORIA);
    else {
      const button = page.locator('[data-ouvir-ditado-gramatica]');
      await button.scrollIntoViewIfNeeded();
      expect(
        await button.evaluate((e) => {
          const r = e.getBoundingClientRect();
          const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return at === e || e.contains(at);
        })
      ).toBe(true);
    }
  }
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
});

test('[optins:movel-390] toque, teclado e foco em uma coluna', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const mobile = await ctx.newPage();
  await mobile.goto(URL);
  await mobile.getByRole('button', { name: /Alice/ }).tap();
  await mobile.locator(CARTAO).tap();
  await mobile.getByRole('button', { name: GABARITO[0], exact: true }).tap();
  await mobile.getByRole('button', { name: 'Conferir', exact: true }).focus();
  await mobile.keyboard.press('Enter');
  await expect(mobile.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await mobile.locator('#gramatica-titulo-questao').focus();
  await mobile.keyboard.press('Control+Alt+R');
  await mobile.locator('#gramatica-modo-responsavel-questao').fill('28');
  await mobile.getByRole('button', { name: 'Ir', exact: true }).tap();
  await mobile.keyboard.press('Escape');
  await mobile.locator('[data-resposta-gramatica]').fill('O gato pulou.');
  await mobile.locator('[data-resposta-gramatica]').press('Enter');
  await expect(mobile.locator('#gramatica-proxima')).toBeEnabled();
  expect(
    await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ).toBe(true);
  await mobile.locator('[data-resposta-gramatica]').press('Tab');
  expect(await mobile.evaluate(() => document.activeElement !== document.body)).toBe(true);
  await ctx.close();
});

test('[optins:conclusao-auxiliar] trinta acertos auxiliares não concluem Alice', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await page.keyboard.press('Escape');
  const main = await page.evaluate((k) => localStorage.getItem(k), CHAVE);
  for (const [i, response] of GABARITO.entries()) {
    const n = i + 1;
    await expect(page.locator('#gramatica-contador')).toHaveText('Questão ' + n + ' de 30');
    if (n >= 13 && n <= 19)
      await expect(page.getByRole('region', { name: 'A fita da pipa' })).toContainText(HISTORIA);
    if (CAMPOS.includes(n)) {
      const input = page.locator('[data-resposta-gramatica]');
      await input.fill('resposta errada');
      await page.getByRole('button', { name: 'Conferir', exact: true }).click();
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await input.fill(response);
    } else {
      await page.getByRole('button', { name: response, exact: true }).click();
    }
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    await page.getByRole('button', { name: 'Conferir', exact: true }).click();
    await expect(page.locator('#gramatica-pontos')).toHaveText(n + ' de 30');
    await page.locator('#gramatica-proxima').click();
  }
  await expect(page.getByRole('heading', { name: 'Parabéns, Alice!' })).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), CHAVE)).toBe(main);
  expect(await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).finalizada, AUX)).toBe(
    true
  );
  await page.locator('#botao-inicio').click();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator(CARTAO)).not.toContainText('Concluída');
  await page.locator(CARTAO).click();
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await expect(page.locator('#gramatica-contador')).toHaveText('Questão 1 de 30');
});

test('[optins:auxiliar-adverso] JSON auxiliar, memória e limpeza bidirecional', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.locator(CARTAO).click();
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  const main = await page.evaluate((k) => localStorage.getItem(k), CHAVE);
  await page.evaluate((k) => localStorage.setItem(k, '{invalido'), AUX);
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), CHAVE)).toBe(main);
  await page.evaluate((id) => window.QuestionariosRevisoes.limpar(id, false), ID);
  await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 30');
  expect(await page.evaluate((k) => localStorage.getItem(k), CHAVE)).toBe(main);
  const bloqueio = await page.evaluate(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw Error('Bloqueado pelo teste');
      },
    });
    return ['getItem', 'setItem', 'removeItem'].map((metodo) => {
      try {
        window.localStorage[metodo]('sentinela-bloqueio', 'valor');
        return 'não bloqueado';
      } catch (erro) {
        return erro.message;
      }
    });
  });
  expect(bloqueio).toEqual([
    'Bloqueado pelo teste',
    'Bloqueado pelo teste',
    'Bloqueado pelo teste',
  ]);
  await page.getByRole('button', { name: GABARITO[0], exact: true }).click();
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
  await page.locator('#gramatica-titulo-questao').focus();
  await page.keyboard.press('Control+Alt+R');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('alice');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
  await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 30');
});
