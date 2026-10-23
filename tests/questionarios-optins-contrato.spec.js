const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const URL = '/ambiente_interativo/index.html';
// Independent literal oracles from the reviewed existing test specifications, never from revision sources.
const GABARITOS = {
  Alice: [
    ['Mostrar que a frase terminou.', 'Separar elementos de uma enumeração.'],
    ['Ana levou pão, suco e frutas.'],
    ['Sofia guardou a bola, a boneca, o carrinho e o quebra-cabeça.'],
    ['Recife, 8 de outubro de 2026.'],
    {
      campos: ['Na mochila há lápis, caderno e cola.'],
    },
    ['LHA', 'LHE', 'LHI', 'LHO', 'LHU'],
    {
      campos: ['lh', 'lh', 'lh', 'lh', 'lh'],
    },
    ['fi-lho-te', 'mi-lho', 'ba-ru-lho', 'te-lha-do'],
    {
      campos: ['rolha', 'malha', 'pilha', 'coelho'],
    },
    [
      {
        selecao: ['milho', 'coelho', 'telhado'],
      },
    ],
    {
      campos: ['folha', 'coelho', 'milho', 'telhado'],
    },
    ['Onde está meu caderno?'],
    ['?', '.', '!', '?', '.'],
    ['Ela passou a indicar uma pergunta.'],
    {
      campos: ['Onde está minha mochila?'],
    },
    [
      {
        selecao: ['xícara', 'xale', 'lixo', 'caixa'],
      },
    ],
    ['XA', 'XE', 'XI', 'XO', 'XU'],
    ['xícara', 'caixa', 'chuva', 'chapéu'],
    [
      {
        selecao: ['xampu', 'lixo', 'chave', 'xadrez', 'chefe'],
      },
    ],
    ['chave', 'chuva', 'xale', 'caixa', 'xícara'],
    [
      {
        ordem: ['A', 'chuva', 'molhou', 'a', 'caixa', '.'],
      },
    ],
    ['CH', 'NH', 'LH', 'NH', 'CH', 'LH'],
    ['chu-va', 'ni-nho', 'co-e-lho', 'ga-li-nha'],
    {
      campos: ['O coelho achou uma chave no caminho.'],
    },
    ['!', '?', '.', '!', '?'],
    [':', '—'],
    [
      'pode separar itens de uma lista',
      'faz uma separação maior que a vírgula e menor que o ponto-final',
      'mostram que uma fala ou ideia ficou suspensa ou continua',
      'podem destacar ou reproduzir exatamente palavras ou uma fala',
    ],
    ['Perto da janela.', 'Um lanche, uma chave e um livro.', 'A mãe de Lia.'],
    [
      'Porque ouviu um barulho no quintal.',
      'Ela ficou mais tranquila.',
      'Porque Lia está fazendo uma pergunta.',
    ],
    [
      'dois-pontos (:)',
      'travessão (—)',
      'chave',
      'caminho',
      'coelho',
      {
        selecao: ['caixa', 'xícara'],
      },
      'separar elementos de uma enumeração',
    ],
  ],
  Mariana: [
    ['Uma caixa com figuras.'],
    {
      ordem: [
        'Rafael percebeu que uma caixa havia sumido.',
        'Mariana e Rafael foram até a biblioteca.',
        'Eles encontraram o material e voltaram para a sala.',
      ],
    },
    ['Porque Mariana lembrou que a professora Clara havia deixado uma caixa perto dali.'],
    [
      'Mariana e Rafael prepararam uma exposição, procuraram um material desaparecido e conseguiram realizar a atividade.',
    ],
    ['Levamos cartazes, régua, cola e lápis de cor.'],
    ['Recife, 5 de outubro de 2026.'],
    ['Mariana, leve o caderno, a régua e o lápis.'],
    ['R forte no início', 'R brando entre vogais', 'RR com som forte entre vogais'],
    ['careta / carreta'],
    {
      campos: ['borracha'],
    },
    {
      campos: ['relógio', 'barriga'],
    },
    ['car-ro-ça'],
    {
      ordem: ['CA', 'DER', 'NO'],
    },
    {
      ordem: ['RE', 'VIS', 'TA'],
    },
    {
      campos: ['jardim', 'lista'],
    },
    ['A menina tomou chá numa xícara.'],
    {
      campos: ['caixa'],
    },
    {
      campos: ['chave', 'xarope'],
    },
    ['alegre'],
    ['A = sentido 1; B = sentido 2.'],
    ['vazia'],
    ['SINÔNIMOS', 'ANTÔNIMOS', 'SINÔNIMOS'],
    {
      campos: ['impossível', 'incompleto', 'incompleto'],
    },
    ['cachorro e parque'],
    ['Mariana', 'Recife', 'Mingau'],
    [
      '“menina” é substantivo comum nas duas frases; na primeira aparece com maiúscula porque inicia a frase.',
    ],
    ['Ontem, Pedro levou o cachorro Bidu ao Parque das Flores.'],
    ['A', 'O', 'A', 'O'],
    {
      campos: ['aluna', 'professora'],
    },
    ['rainha', 'égua', 'cabra'],
    {
      campos: ['A professora'],
    },
    {
      campos: ['Marina, pegue a régua e o caderno.'],
    },
    ['Ter ajudado o menino a recuperar o boné.'],
    ['O menino agradeceu, e Lucas voltou para casa feliz.'],
    ['Pedro, leve a bola, a toalha e a água.'],
  ],
};
function independentOracle(p) {
  return GABARITOS[p.name];
}
async function oracleAnswer(page, _p, n, r) {
  if (r.campos) await fill(page, r.campos);
  else if (r.ordem)
    for (const text of r.ordem) await page.getByRole('button', { name: text, exact: true }).click();
  else
    for (const [i, response] of r.entries()) {
      const item = page.locator('[data-item-gramatica]').nth(i);
      if (response.ordem) {
        const area = n === 21 ? page.locator('[data-interacao-questionario]') : item;
        for (const text of response.ordem)
          await area.getByRole('button', { name: text, exact: true }).click();
      } else if (response.selecao) {
        const area = [10, 16, 19].includes(n)
          ? page.locator('[data-interacao-questionario]')
          : item;
        for (const text of response.selecao)
          await area.getByRole('button', { name: text, exact: true }).click();
      } else await item.getByRole('button', { name: response, exact: true }).click();
    }
  await check(page);
  await expect(page.locator('#gramatica-proxima')).toBeEnabled();
}
const profiles = [
  {
    name: 'Alice',
    session: 'alice',
    card: '#abrir-gramatica-pontuacao-lh-xch-alice',
    key: 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1',
    aux: 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.responsavel.v1',
    word: 11,
    phrase: 5,
    answers: ['folha', 'coelho', 'milho', 'telhado'],
    sentence: ['Na mochila há lápis, caderno e cola.'],
    legacy: '#abrir-gramatica-h-til',
  },
  {
    name: 'Mariana',
    session: 'mariana',
    card: '#abrir-gramatica-portugues-prova-outubro-mariana',
    key: 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
    aux: 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.responsavel.v1',
    word: 11,
    phrase: 32,
    answers: ['relógio', 'barriga'],
    sentence: ['Marina, pegue a régua e o caderno.'],
    legacy: '#abrir-gramatica-mariana',
  },
];
async function mock(page) {
  await page.addInitScript(() => {
    window.__ga = { calls: [], events: [], cancels: 0, mode: 'pending' };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__ga.mode === 'novoice'
        ? []
        : [
            { name: 'Maria local', lang: 'pt-BR', localService: true },
            { name: 'Remote', lang: 'pt-BR', localService: false },
          ];
    window.speechSynthesis.cancel = () => window.__ga.cancels++;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__ga.calls.push(u);
      if (window.__ga.mode === 'error') u.onerror?.({ error: 'synthesis-failed' });
    };
    document.addEventListener('audioestadoalterado', (e) =>
      window.__ga.events.push({
        fase: e.detail.fase,
        mensagem: e.detail.mensagem,
        origem: e.detail.origem,
      })
    );
  });
}
async function open(page, p) {
  await page.getByRole('button', { name: new RegExp(p.name) }).click();
  await page.locator(p.card).click();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
async function panel(page) {
  if (!(await page.locator('#gramatica-modo-responsavel').isVisible())) {
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
  }
  await expect(page.locator('#gramatica-modo-responsavel')).toBeVisible();
}
async function jump(page, q) {
  await panel(page);
  await page.locator('#gramatica-modo-responsavel-questao').fill(String(q));
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
}
async function session(page, id) {
  await panel(page);
  await page.locator('#gramatica-modo-responsavel-sessao').selectOption(id);
}
async function fill(page, answers) {
  for (const [i, s] of answers.entries())
    await page.locator('[data-resposta-gramatica]').nth(i).fill(s);
}
async function check(page) {
  await page.getByRole('button', { name: 'Conferir', exact: true }).click();
}
async function snap(page) {
  return page.evaluate(() => ({
    storage: Object.fromEntries(
      Object.keys(localStorage)
        .sort()
        .map((k) => [k, localStorage.getItem(k)])
    ),
    counter: document.querySelector('#gramatica-contador').textContent,
    points: document.querySelector('#gramatica-pontos').textContent,
    feedback: document.querySelector('.retorno-gramatica')?.textContent,
    audio: document.querySelector('.status-ditado-gramatica')?.textContent,
    band: document.querySelector('#gramatica-faixa-modo-responsavel').textContent,
    fields: [...document.querySelectorAll('[data-resposta-gramatica]')].map((e) => ({
      value: e.value,
      invalid: e.getAttribute('aria-invalid'),
    })),
    events: window.__ga.events,
    calls: window.__ga.calls.length,
  }));
}
async function late(page, index) {
  await page.evaluate((i) => {
    const u = window.__ga.calls[i];
    if (!u) throw Error('No retained utterance');
    u.onstart?.();
    u.onend?.();
    u.onerror?.({ error: 'late' });
  }, index);
}
async function listen(page) {
  const n = await page.evaluate(() => window.__ga.calls.length);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await expect.poll(() => page.evaluate(() => window.__ga.calls.length)).toBe(n + 1);
  return n;
}
async function boot(page, p) {
  await mock(page);
  await page.goto(URL);
  await page.evaluate(
    ({ key, q }) => localStorage.setItem(key, JSON.stringify({ versao: 1, questaoAtual: q - 1 })),
    { key: p.key, q: p.word }
  );
  await page.reload();
  await open(page, p);
}

// Thirteen bounded scenarios per profile; related subcases must all finish.
for (const p of profiles) {
  test('opt-ins ' + p.name + ' P1 callbacks entre sessões', async ({ page }) => {
    await boot(page, p);
    await fill(
      page,
      p.answers.map(() => 'tentativa principal')
    );
    let i = await listen(page);
    await session(page, 'responsavel');
    await jump(page, p.word);
    let before = await snap(page);
    await late(page, i);
    expect(await snap(page)).toEqual(before);
    expect(JSON.parse(before.storage[p.aux]).pontos).toBe(0);
    expect(JSON.parse(before.storage[p.aux]).respostas).toEqual({});
    await fill(
      page,
      p.answers.map(() => 'tentativa auxiliar')
    );
    i = await listen(page);
    await session(page, p.session);
    before = await snap(page);
    await late(page, i);
    expect(await snap(page)).toEqual(before);
    expect(before.fields.map((f) => f.value)).toEqual(p.answers.map(() => 'tentativa principal'));
    expect(before.points).toMatch(/^0 de /);
  });
  test('opt-ins ' + p.name + ' P2 parar campo e salto', async ({ page }) => {
    {
      await boot(page, p);
      const i = await listen(page);
      await page.locator('[data-parar-ditado-gramatica]').click();
      await jump(page, p.phrase);
      let before = await snap(page);
      await late(page, i);
      expect(await snap(page)).toEqual(before);
      await jump(page, p.word);
      expect(await page.evaluate(() => window.__ga.calls.length)).toBe(1);
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
      const state = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), p.key);
      expect(state.respostas).toEqual({});
      expect(state.pontos).toBe(0);
      expect(state.corrigidas).toEqual({});
      expect(state.pontuadas).toEqual({});
      expect(state.tentativas).toEqual({});
    }
    {
      await boot(page, p);
      const i = await listen(page);
      await page.locator('[data-resposta-gramatica]').nth(1).focus();
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
      const before = await snap(page);
      await late(page, i);
      expect(await snap(page)).toEqual(before);
      expect(before.fields.every((f) => f.value === '')).toBe(true);
    }
  });
  test('opt-ins ' + p.name + ' P3 recarga de cinco estados', async ({ page }) => {
    for (const phase of ['iniciado', 'interrompido', 'erro', 'corrigido', 'auxiliar-salto']) {
      await boot(page, p);
      await listen(page);
      if (phase === 'interrompido') await page.locator('[data-parar-ditado-gramatica]').click();
      if (phase === 'erro' || phase === 'corrigido') {
        await fill(page, phase === 'erro' ? p.answers.map(() => 'incorreta') : p.answers);
        await check(page);
      }
      if (phase === 'auxiliar-salto') {
        await session(page, 'responsavel');
        await jump(page, p.phrase);
        await fill(page, p.sentence);
        await check(page);
      }
      const before = await page.evaluate(
        ({ key, aux }) => ({ main: localStorage.getItem(key), aux: localStorage.getItem(aux) }),
        p
      );
      await page.reload();
      await open(page, p);
      expect(await page.evaluate(() => window.__ga.calls.length)).toBe(0);
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
      expect(
        await page.evaluate(
          ({ key, aux }) => ({ main: localStorage.getItem(key), aux: localStorage.getItem(aux) }),
          p
        )
      ).toEqual(before);
      if (phase === 'corrigido') {
        await expect(page.locator('#gramatica-pontos')).toHaveText(
          p.name === 'Alice' ? '1 de 30' : '1 de 35'
        );
        await check(page);
        await expect(page.locator('#gramatica-pontos')).toHaveText(
          p.name === 'Alice' ? '1 de 30' : '1 de 35'
        );
      }
      if (phase === 'erro')
        await expect(page.locator('[data-resposta-gramatica]').first()).toHaveAttribute(
          'aria-invalid',
          'true'
        );
      if (phase === 'auxiliar-salto') {
        await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeHidden();
        await session(page, 'responsavel');
        await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue(p.sentence[0]);
        await expect(page.locator('#gramatica-contador')).toContainText(
          'Questão ' + p.phrase + ' de'
        );
      }
    }
  });
  test('opt-ins ' + p.name + ' P4 limpeza bidirecional e perfil vizinho', async ({ page }) => {
    await boot(page, p);
    const neighbor = profiles.find((other) => other.name !== p.name).key;
    await page.evaluate((k) => localStorage.setItem(k, 'preservar'), neighbor);
    await fill(page, p.answers);
    await check(page);
    const main = await page.evaluate((k) => localStorage.getItem(k), p.key);
    await session(page, 'responsavel');
    await jump(page, p.word);
    await fill(
      page,
      p.answers.map(() => 'errada')
    );
    await check(page);
    const i = await listen(page);
    page.once('dialog', (d) => d.accept());
    await page.locator('#limpar-progresso').click();
    let before = await snap(page);
    await late(page, i);
    expect(await snap(page)).toEqual(before);
    expect(before.storage[p.key]).toBe(main);
    expect(before.storage[p.aux]).toBeUndefined();
    expect(before.storage[neighbor]).toBe('preservar');
    await jump(page, p.phrase);
    await fill(page, p.sentence);
    await check(page);
    const aux = await page.evaluate((k) => localStorage.getItem(k), p.aux);
    await session(page, p.session);
    await jump(page, p.word);
    const j = await listen(page);
    page.once('dialog', (d) => d.accept());
    await page.locator('#limpar-progresso').click();
    before = await snap(page);
    await late(page, j);
    expect(await snap(page)).toEqual(before);
    expect(before.storage[p.aux]).toBe(aux);
    expect(before.storage[p.key]).toBeUndefined();
    expect(before.storage[neighbor]).toBe('preservar');
  });
  test('opt-ins ' + p.name + ' P5 reabertura legado e consumidor Inglês', async ({ page }) => {
    {
      await boot(page, p);
      for (let n = 0; n < 3; n++) {
        await listen(page);
        await page.locator('#botao-inicio').click();
        await open(page, p);
      }
      expect(await page.evaluate(() => window.__ga.calls.length)).toBe(3);
      await page.locator('#botao-inicio').click();
      await page.getByRole('button', { name: new RegExp(p.name) }).click();
      await page.locator(p.legacy).click();
      await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
      await page.locator('#gramatica-titulo-questao').focus();
      await page.keyboard.press('Control+Alt+R');
      await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
      const before = await snap(page);
      await late(page, 2);
      expect(await snap(page)).toEqual(before);
    }
    {
      await boot(page, p);
      const i = await listen(page);
      await page.locator('#botao-inicio').click();
      await page.getByRole('button', { name: new RegExp(p.name) }).click();
      await page.locator('#materia-ingles').click();
      await expect(page.locator('#ingles-ouvir-normal')).toBeVisible();
      const before = await page.evaluate(() => ({
        storage: Object.fromEntries(
          Object.keys(localStorage)
            .sort()
            .map((k) => [k, localStorage.getItem(k)])
        ),
        body: document.body.innerText,
        events: window.__ga.events,
      }));
      await late(page, i);
      expect(
        await page.evaluate(() => ({
          storage: Object.fromEntries(
            Object.keys(localStorage)
              .sort()
              .map((k) => [k, localStorage.getItem(k)])
          ),
          body: document.body.innerText,
          events: window.__ga.events,
        }))
      ).toEqual(before);
    }
  });
  test('opt-ins ' + p.name + ' P6 sigilo e payload de palavra e frase', async ({ page }) => {
    await boot(page, p);
    for (const [q, answers, prefix] of [
      [p.word, p.answers, 'A palavra é: '],
      [p.phrase, p.sentence, 'A frase é: '],
    ]) {
      await jump(page, q);
      await page.keyboard.press('Escape');
      const dom = await page.locator('#gramatica-conteudo').evaluate((e) => ({
        text: e.textContent,
        attrs: [...e.querySelectorAll('*')]
          .flatMap((n) => [...n.attributes].map((a) => a.value))
          .join('\n'),
      }));
      for (const a of answers) {
        expect(dom.text).not.toContain(a);
        expect(dom.attrs).not.toContain(a);
      }
      const i = await listen(page);
      const payload = await page.evaluate((i) => {
        const u = window.__ga.calls[i];
        return {
          text: u.text,
          lang: u.lang,
          rate: u.rate,
          pitch: u.pitch,
          local: u.voice.localService,
        };
      }, i);
      expect(payload).toEqual({
        text: prefix + answers[0],
        lang: 'pt-BR',
        rate: 0.78,
        pitch: 1,
        local: true,
      });
      await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
    }
  });
  test('opt-ins ' + p.name + ' P7 layout 1366', async ({ page }) => {
    const width = 1366;

    await page.setViewportSize({
      width,
      height: width === 390 ? 844 : width === 1366 ? 768 : 1080,
    });
    await boot(page, p);
    await session(page, 'responsavel');
    await jump(page, p.phrase);
    await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    const button = page.locator('[data-ouvir-ditado-gramatica]').first();
    await button.scrollIntoViewIfNeeded();
    expect(
      await button.evaluate((e) => {
        const r = e.getBoundingClientRect();
        const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return e === at || e.contains(at);
      })
    ).toBe(true);
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
    await panel(page);
    await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  });
  test('opt-ins ' + p.name + ' P8 layout 1920', async ({ page }) => {
    const width = 1920;

    await page.setViewportSize({
      width,
      height: width === 390 ? 844 : width === 1366 ? 768 : 1080,
    });
    await boot(page, p);
    await session(page, 'responsavel');
    await jump(page, p.phrase);
    await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    const button = page.locator('[data-ouvir-ditado-gramatica]').first();
    await button.scrollIntoViewIfNeeded();
    expect(
      await button.evaluate((e) => {
        const r = e.getBoundingClientRect();
        const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return e === at || e.contains(at);
      })
    ).toBe(true);
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
    await panel(page);
    await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
  });
  test(
    'opt-ins ' + p.name + ' P9 layout 390 toque e teclado',
    async ({ page, browser, baseURL }) => {
      const width = 390;

      await page.setViewportSize({
        width,
        height: width === 390 ? 844 : width === 1366 ? 768 : 1080,
      });
      await boot(page, p);
      await session(page, 'responsavel');
      await jump(page, p.phrase);
      await expect(page.locator('#gramatica-faixa-modo-responsavel')).toBeVisible();
      await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
      const button = page.locator('[data-ouvir-ditado-gramatica]').first();
      await button.scrollIntoViewIfNeeded();
      expect(
        await button.evaluate((e) => {
          const r = e.getBoundingClientRect();
          const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return e === at || e.contains(at);
        })
      ).toBe(true);
      await page.locator('#gramatica-titulo-questao').focus();
      await page.keyboard.press('Control+Alt+R');
      await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();
      await panel(page);
      await expect(page.locator('#gramatica-modo-responsavel-titulo')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('#gramatica-modo-responsavel')).toBeHidden();

      {
        const ctx = await browser.newContext({
          baseURL,
          hasTouch: true,
          viewport: { width: 390, height: 844 },
        });
        const page = await ctx.newPage();
        await boot(page, p);
        await session(page, 'responsavel');
        await jump(page, p.word);
        await page.keyboard.press('Escape');
        await page.locator('[data-ouvir-ditado-gramatica]').first().tap();
        await expect.poll(() => page.evaluate(() => window.__ga.calls.length)).toBe(1);
        await fill(page, p.answers);
        await page.locator('[data-resposta-gramatica]').last().press('Tab');
        expect(
          await page.evaluate(() => {
            const e = document.activeElement;
            return e && e !== document.body && e.getBoundingClientRect().width > 0;
          })
        ).toBe(true);
        await page.getByRole('button', { name: 'Conferir', exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#gramatica-pontos')).toContainText('1 de');
        expect(await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).pontos, p.key)).toBe(
          0
        );
        await ctx.close();
      }
    }
  );
  test('opt-ins ' + p.name + ' P10 arquivo offline e três falhas TTS', async ({ page }) => {
    for (const mode of ['novoice', 'error', 'missing']) {
      await mock(page);
      const external = [];
      await page.route(/^https?:/, (route) => {
        external.push(route.request().url());
        return route.abort();
      });
      await page.goto(pathToFileURL(path.resolve('ambiente_interativo/index.html')).href);
      await open(page, p);
      await jump(page, p.word);
      await page.keyboard.press('Escape');
      await page.evaluate((m) => {
        window.__ga.mode = m;
        if (m === 'missing') window.speechSynthesis.speak = undefined;
      }, mode);
      await page.locator('[data-ouvir-ditado-gramatica]').first().click();
      await expect(page.locator('.status-ditado-gramatica')).toContainText(
        mode === 'novoice'
          ? 'Não foi encontrada'
          : mode === 'error'
            ? 'Não foi possível'
            : 'não oferece leitura'
      );
      await fill(page, p.answers);
      await check(page);
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      expect(external).toEqual([]);
    }
  });

  test('opt-ins ' + p.name + ' P11 JSON auxiliar inválido', async ({ page }) => {
    await boot(page, p);
    await fill(page, p.answers);
    await check(page);
    const main = await page.evaluate((k) => localStorage.getItem(k), p.key);
    await page.evaluate((k) => localStorage.setItem(k, '{invalido'), p.aux);
    await session(page, 'responsavel');
    await expect(page.locator('#gramatica-contador')).toContainText('Questão 1 de');
    await expect(page.locator('#gramatica-pontos')).toContainText('0 de');
    expect(await page.evaluate((k) => localStorage.getItem(k), p.key)).toBe(main);
    await jump(page, p.word);
    await fill(page, p.answers);
    await check(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  });
  test('opt-ins ' + p.name + ' P12 storage bloqueado e memória isolada', async ({ page }) => {
    await boot(page, p);
    await page.evaluate(() => {
      for (const m of ['getItem', 'setItem', 'removeItem'])
        Storage.prototype[m] = () => {
          throw Error('Bloqueado pelo harness');
        };
    });
    await fill(page, p.answers);
    await check(page);
    await session(page, 'responsavel');
    await jump(page, p.word);
    await expect(page.locator('#gramatica-pontos')).toContainText('0 de');
    await fill(
      page,
      p.answers.map(() => 'errada')
    );
    await check(page);
    await expect(page.locator('#gramatica-proxima')).toBeDisabled();
    await session(page, p.session);
    await expect(page.locator('#gramatica-pontos')).toContainText('1 de');
    await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue(p.answers[0]);
  });
  test('opt-ins ' + p.name + ' P13 conclusão auxiliar e cartão principal', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await boot(page, p);
    await jump(page, 1);
    await session(page, 'responsavel');
    const main = await page.evaluate((k) => localStorage.getItem(k), p.key);
    expect(JSON.parse(main)).toMatchObject({
      questaoAtual: 0,
      respostas: {},
      corrigidas: {},
      pontuadas: {},
      pontos: 0,
      finalizada: false,
    });
    await page.keyboard.press('Escape');
    const oracle = independentOracle(p);
    for (const [index, response] of oracle.entries()) {
      await oracleAnswer(page, p, index + 1, response);
      await page.locator('#gramatica-proxima').click();
    }
    await expect(page.getByRole('heading', { name: 'Parabéns, ' + p.name + '!' })).toBeVisible();
    await expect(page.locator('#gramatica-pontos')).toHaveText(
      oracle.length + ' de ' + oracle.length
    );
    expect(await page.evaluate((k) => localStorage.getItem(k), p.key)).toBe(main);
    expect(await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).finalizada, p.aux)).toBe(
      true
    );
    await page.locator('#botao-inicio').click();
    await page.getByRole('button', { name: new RegExp(p.name) }).click();
    await expect(page.locator(p.card)).toContainText('Não iniciada');
  });
}
