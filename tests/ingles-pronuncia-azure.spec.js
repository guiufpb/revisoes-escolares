const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { Buffer } = require('node:buffer');
const process = require('node:process');
const console = require('node:console');
const { createServer, sanitizedAssessment } = require('../scripts/azure-pronunciation-gateway.js');

const URL = '/ambiente_interativo/index.html';
const UNIDADE = 'at-school-atividade-3';
const CHAVE = 'revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1';
const GATEWAY = 'http://127.0.0.1:5190/api/pronunciation';

async function instalarAmbienteDeAudio(page) {
  await page.addInitScript(() => {
    window.__falasPronuncia = [];
    window.__microfonesAbertos = 0;
    window.__trilhasParadas = 0;
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
      window.__falasPronuncia.push(fala);
      fala.onstart?.();
      fala.onend?.();
    };

    const stream = {
      getTracks: () => [
        {
          stop: () => {
            window.__trilhasParadas += 1;
          },
        },
      ],
    };
    Object.defineProperty(window.navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          window.__microfonesAbertos += 1;
          return stream;
        },
      },
    });

    class AudioContextoFalso {
      constructor() {
        this.sampleRate = 16000;
        this.state = 'running';
        this.destination = {};
      }

      createMediaStreamSource() {
        return {
          connect: (processador) => {
            window.setTimeout(() => {
              const amostras = new Float32Array(8000);
              for (let indice = 0; indice < amostras.length; indice += 1) {
                amostras[indice] = Math.sin((indice / 20) * Math.PI) * 0.2;
              }
              processador.onaudioprocess?.({
                inputBuffer: { getChannelData: () => amostras },
              });
            }, 0);
          },
          disconnect: () => {},
        };
      }

      createScriptProcessor() {
        return { onaudioprocess: null, connect: () => {}, disconnect: () => {} };
      }

      createGain() {
        return { gain: { value: 1 }, connect: () => {}, disconnect: () => {} };
      }

      resume() {
        return Promise.resolve();
      }

      close() {
        return Promise.resolve();
      }
    }

    window.AudioContext = AudioContextoFalso;
  });
}

async function salvarConclusao(page) {
  await page.evaluate(
    ({ chave, unidadeId }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      const itens = unidade.grupos.flatMap((grupo) => grupo.itens);
      const atividades = unidade.atividades;
      localStorage.setItem(
        chave,
        JSON.stringify({
          unidadeId: unidade.id,
          versao: unidade.versao,
          grupoAtual: unidade.grupos[0].id,
          itemAtual: itens[0].id,
          itensOuvidos: itens.map((item) => item.id),
          reproducoes: itens.length,
          respostasEscrita: Object.fromEntries(itens.map((item) => [item.id, item.ingles])),
          conferenciasEscrita: Object.fromEntries(itens.map((item) => [item.id, 'correta'])),
          iniciado: true,
          questaoAtual: atividades.length - 1,
          perguntasOuvidasAtividades: atividades.map((atividade) => atividade.id),
          respostasAtividades: Object.fromEntries(
            atividades.map((atividade) => [atividade.id, atividade.respostaCorreta])
          ),
          conferenciasAtividades: Object.fromEntries(
            atividades.map((atividade) => [atividade.id, 'correta'])
          ),
          revisoesPosRespostaConcluidas: Object.fromEntries(
            atividades.map((atividade) => [atividade.id, atividade.respostaCorreta])
          ),
          historiaCenaAtual: unidade.historia.cenas.length - 1,
          historiaConcluida: true,
          historiaEmExibicao: false,
          historiaOrigem: 'estudo',
          atividadeIniciada: true,
          atividadeFinalizada: true,
          tentativasAtividade: atividades.length,
        })
      );
    },
    { chave: CHAVE, unidadeId: UNIDADE }
  );
}

async function abrirResultado(page) {
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-at-school-atividade-3').click();
  await page.locator('#ingles-iniciar-atividades').click();
  await expect(page.locator('#ingles-revisao-atividades')).toBeVisible();
  await expect(page.locator('#pronuncia-conversacao')).toBeVisible();
}

async function prepararResultado(page) {
  await page.goto(URL);
  await page.evaluate((chave) => localStorage.removeItem(chave), CHAVE);
  await salvarConclusao(page);
  await page.reload();
  await abrirResultado(page);
}

test.beforeEach(async ({ page }) => {
  page.errosPronuncia = [];
  page.on('pageerror', (erro) => page.errosPronuncia.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') page.errosPronuncia.push(mensagem.text());
  });
  await instalarAmbienteDeAudio(page);
});

test.afterEach(async ({ page }) => expect(page.errosPronuncia).toEqual([]));

test('lê escores REST diretos, preserva formato aninhado e recusa resultado sem avaliação', () => {
  const scores = { AccuracyScore: 100, FluencyScore: 90, CompletenessScore: 100, PronScore: 95.1 };
  const expected = {
    accuracyScore: 100,
    fluencyScore: 90,
    completenessScore: 100,
    pronunciationScore: 95.1,
    prosodyScore: null,
  };
  expect(sanitizedAssessment({ NBest: [scores] })).toEqual(expected);
  expect(sanitizedAssessment({ NBest: [{ PronunciationAssessment: scores }] })).toEqual(expected);
  expect(sanitizedAssessment({ NBest: [{ Display: 'texto reconhecido privado' }] })).toBeNull();
  expect(sanitizedAssessment({ NBest: [{ AccuracyScore: null, PronScore: '' }] })).toBeNull();
  expect(sanitizedAssessment({ RecognitionStatus: 'NoMatch' })).toBeNull();
  expect(sanitizedAssessment({ NBest: [{ AccuracyScore: 0, PronScore: 0 }] })).toMatchObject({
    accuracyScore: 0,
    pronunciationScore: 0,
  });
});

test('gateway processa resposta REST 200 e diagnostica erro Azure sem fala nem credenciais', async () => {
  const previousKey = process.env.AZURE_SPEECH_KEY;
  const previousRegion = process.env.AZURE_SPEECH_REGION;
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const logs = [];
  const key = 'chave-ficticia-exclusiva-do-teste';
  process.env.AZURE_SPEECH_KEY = key;
  process.env.AZURE_SPEECH_REGION = 'brazilsouth';
  console.log = (entry) => logs.push(entry);
  let azureStatus = 200;
  let receivedAudio;
  let azureMockError;
  globalThis.fetch = async (url, options) => {
    if (!String(url).startsWith('https://brazilsouth.stt.speech.microsoft.com/')) {
      return originalFetch(url, options);
    }
    try {
      expect(new globalThis.URL(url).searchParams.get('language')).toBe('en-US');
      expect(new globalThis.URL(url).searchParams.get('format')).toBe('detailed');
      expect(options.method).toBe('POST');
      expect(options.headers.Accept).toBe('application/json');
      expect(options.headers['Content-Type']).toBe('audio/wav; codecs=audio/pcm; samplerate=16000');
      expect(options.headers['Ocp-Apim-Subscription-Key']).toBe(key);
      expect(
        JSON.parse(
          Buffer.from(options.headers['Pronunciation-Assessment'], 'base64').toString('utf8')
        )
      ).toEqual({
        ReferenceText: 'Thank you.',
        GradingSystem: 'HundredMark',
        Granularity: 'Word',
        Dimension: 'Comprehensive',
        EnableProsodyAssessment: 'True',
      });
      receivedAudio = options.body;
    } catch (error) {
      azureMockError = error;
      throw error;
    }
    return {
      ok: azureStatus === 200,
      status: azureStatus,
      json: async () =>
        azureStatus === 200
          ? {
              RecognitionStatus: 'Success',
              DisplayText: 'fala privada',
              NBest: [
                {
                  AccuracyScore: 100,
                  FluencyScore: 90,
                  CompletenessScore: 100,
                  PronScore: 95,
                  Words: [{ Word: 'fala privada', AccuracyScore: 100 }],
                },
              ],
            }
          : { error: { code: 'Unauthorized', message: key + ' fala privada' } },
    };
  };
  const server = createServer();
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const wav = Buffer.alloc(64);
    wav.write('RIFF');
    const options = {
      method: 'POST',
      headers: {
        Origin: 'http://127.0.0.1:5173',
        'Content-Type': 'audio/wav',
        'X-Reference-Text': Buffer.from('Thank you.', 'utf8').toString('base64'),
        'X-Pronunciation-Locale': 'en-US',
      },
      body: wav,
    };
    const response = await globalThis.fetch(`${base}/api/pronunciation`, options);
    if (azureMockError) throw azureMockError;
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(JSON.parse(body)).toMatchObject({
      ok: true,
      assessment: {
        accuracyScore: 100,
        fluencyScore: 90,
        completenessScore: 100,
        pronunciationScore: 95,
        prosodyScore: null,
      },
    });
    expect(receivedAudio.every((byte) => byte === 0)).toBe(true);
    expect(JSON.parse(logs[0])).toMatchObject({
      azureStatus: 200,
      audioBytes: 64,
      recognitionStatus: 'Success',
      wordCount: 1,
      phonemeCount: 0,
      scoreFields: ['AccuracyScore', 'FluencyScore', 'CompletenessScore', 'PronScore'],
    });
    azureStatus = 401;
    const failure = await globalThis.fetch(`${base}/api/pronunciation`, options);
    expect(failure.status).toBe(502);
    const failureBody = await failure.text();
    expect(JSON.parse(logs[1])).toMatchObject({ azureStatus: 401, azureErrorCode: 'Unauthorized' });
    for (const text of [body, failureBody, ...logs]) {
      expect(text).not.toContain(key);
      expect(text).not.toContain('fala privada');
      expect(text).not.toContain('Thank you.');
    }
    expect(receivedAudio.every((byte) => byte === 0)).toBe(true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    globalThis.fetch = originalFetch;
    console.log = originalLog;
    if (previousKey === undefined) delete process.env.AZURE_SPEECH_KEY;
    else process.env.AZURE_SPEECH_KEY = previousKey;
    if (previousRegion === undefined) delete process.env.AZURE_SPEECH_REGION;
    else process.env.AZURE_SPEECH_REGION = previousRegion;
  }
});

test('gateway local não expõe credencial, recusa origem externa e avisa quando não configurado', async () => {
  const previousKey = process.env.AZURE_SPEECH_KEY;
  const previousRegion = process.env.AZURE_SPEECH_REGION;
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_REGION;
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const health = await globalThis.fetch(`${base}/health`);
    expect(await health.json()).toEqual({ ok: true, configured: false });

    const forbidden = await globalThis.fetch(`${base}/health`, {
      headers: { Origin: 'https://example.com' },
    });
    expect(forbidden.status).toBe(403);

    const opaque = await globalThis.fetch(`${base}/health`, {
      headers: { Origin: 'null' },
    });
    expect(opaque.status).toBe(403);

    const response = await globalThis.fetch(`${base}/api/pronunciation`, {
      method: 'POST',
      headers: {
        Origin: 'http://127.0.0.1:5173',
        'Content-Type': 'audio/wav',
        'X-Reference-Text': Buffer.from("What's this?", 'utf8').toString('base64'),
        'X-Pronunciation-Locale': 'en-US',
      },
      body: Buffer.from('RIFF-not-a-real-recording', 'ascii'),
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: 'gateway_unconfigured' });
    expect(response.headers.get('access-control-allow-origin')).toBe('http://127.0.0.1:5173');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (previousKey === undefined) delete process.env.AZURE_SPEECH_KEY;
    else process.env.AZURE_SPEECH_KEY = previousKey;
    if (previousRegion === undefined) delete process.env.AZURE_SPEECH_REGION;
    else process.env.AZURE_SPEECH_REGION = previousRegion;
  }
});

test('habilita somente a Activity 3 concluída e preserva as 25 questões e a chave v1', async ({
  page,
}) => {
  await prepararResultado(page);
  const dados = await page.evaluate(
    ({ unidadeId, chave }) => {
      const unidade = window.RegistroIngles.obter(unidadeId);
      return {
        pronuncia: unidade.pronuncia,
        atividades: unidade.atividades.length,
        estado: localStorage.getItem(chave),
      };
    },
    { unidadeId: UNIDADE, chave: CHAVE }
  );

  expect(dados.atividades).toBe(25);
  expect(dados.pronuncia).toMatchObject({
    habilitada: true,
    gatewayUrl: GATEWAY,
    faixas: { muitoBem: 75, quase: 45 },
  });
  expect(dados.pronuncia.pares).toHaveLength(5);
  await expect(
    page.getByRole('heading', { name: 'CONVERSAÇÃO · ESCUTE E PRONUNCIE' })
  ).toBeVisible();
  await expect(page.locator('#pronuncia-progresso')).toHaveText('Conversa 1 de 5');
  await expect(page.locator('#pronuncia-pergunta')).toHaveText(
    'What does Flash say after his friends help him?'
  );
  await expect(page.locator('#pronuncia-resposta')).toHaveText('Thank you.');
  await expect(page.locator('#pronuncia-gravar')).toBeDisabled();
  await expect(page.locator('#ingles-privacidade-audio-texto')).toContainText(
    'só é usado após consentimento'
  );

  await page.locator('#pronuncia-par-proximo').click();
  await expect(page.locator('#pronuncia-pergunta')).toHaveText("What's this?");
  await expect(page.locator('#pronuncia-resposta')).toHaveText("It's a bag.");
  await page.locator('#pronuncia-alvo-resposta').click();
  await page.locator('#pronuncia-ouvir').click();
  const fala = await page.evaluate(() => window.__falasPronuncia.at(-1)?.text);
  expect(fala).toBe("Phrase: It's a bag.");
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(dados.estado);

  await page.locator('#ingles-voltar-vocabulario').click();
  await page.reload();
  await page.getByRole('button', { name: /Mariana/i }).click();
  await page.locator('#abrir-ingles-at-school-atividade-2').click();
  await expect(page.locator('#pronuncia-conversacao')).toBeHidden();
  await expect(page.locator('#ingles-privacidade-audio-texto')).toContainText(
    'não grava a criança'
  );
});

test('Ouvir modelo usa en-US a 0.50 em pergunta e resposta das cinco conversas, inclusive ao repetir e voltar', async ({
  page,
}) => {
  const requisicoes = [];
  await page.route(GATEWAY, async (route) => {
    requisicoes.push(route.request().url());
    await route.abort();
  });
  await prepararResultado(page);
  const pares = await page.evaluate(
    (unidadeId) => window.RegistroIngles.obter(unidadeId).pronuncia.pares,
    UNIDADE
  );
  expect(pares).toHaveLength(5);
  expect(await page.evaluate(() => window.__falasPronuncia.length)).toBe(0);

  async function conferirModelo(alvo, texto) {
    await page.locator('#pronuncia-alvo-' + alvo).click();
    const quantidadeAntes = await page.evaluate(() => window.__falasPronuncia.length);
    await page.locator('#pronuncia-ouvir').click();
    await expect
      .poll(() => page.evaluate(() => window.__falasPronuncia.length))
      .toBe(quantidadeAntes + 1);
    const fala = await page.evaluate(() => {
      const ultima = window.__falasPronuncia.at(-1);
      return { texto: ultima.text, idioma: ultima.lang, velocidade: ultima.rate };
    });
    expect(fala).toEqual({ texto: 'Phrase: ' + texto, idioma: 'en-US', velocidade: 0.5 });
  }

  for (let indice = 0; indice < pares.length; indice += 1) {
    await expect(page.locator('#pronuncia-progresso')).toHaveText(
      'Conversa ' + (indice + 1) + ' de 5'
    );
    for (const alvo of ['pergunta', 'resposta']) {
      await conferirModelo(alvo, pares[indice][alvo]);
      await conferirModelo(alvo, pares[indice][alvo]);
    }
    if (indice < pares.length - 1) await page.locator('#pronuncia-par-proximo').click();
  }

  for (let indice = pares.length - 2; indice >= 0; indice -= 1) {
    await page.locator('#pronuncia-par-anterior').click();
    await conferirModelo('pergunta', pares[indice].pergunta);
    await conferirModelo('resposta', pares[indice].resposta);
  }
  expect(await page.evaluate(() => window.__microfonesAbertos)).toBe(0);
  expect(requisicoes).toEqual([]);
});

test('grava WAV em memória, envia ao gateway e permite repetir pergunta e resposta sem nota', async ({
  page,
}) => {
  const requisicoes = [];
  await page.route(GATEWAY, async (route) => {
    const request = route.request();
    requisicoes.push({
      headers: request.headers(),
      body: request.postDataBuffer(),
    });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        assessment: { pronunciationScore: requisicoes.length === 1 ? 82 : 58 },
      }),
    });
  });
  await prepararResultado(page);
  const estadoAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE);

  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await expect(page.locator('#pronuncia-status')).toContainText('Gravando');
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-feedback')).toHaveText(/Muito bem!/);
  await expect(page.locator('#pronuncia-feedback')).toHaveAttribute('data-faixa', 'muito-bem');
  await expect(page.locator('#pronuncia-feedback')).not.toContainText(/82|nota|aprov/i);
  await expect.poll(() => requisicoes.length).toBe(1);

  expect(requisicoes[0].body.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(requisicoes[0].body.subarray(8, 12).toString('ascii')).toBe('WAVE');
  expect(requisicoes[0].body.readUInt32LE(24)).toBe(16000);
  expect(Buffer.from(requisicoes[0].headers['x-reference-text'], 'base64').toString('utf8')).toBe(
    'What does Flash say after his friends help him?'
  );

  await page.locator('#pronuncia-repetir').click();
  await expect(page.locator('#pronuncia-status')).toContainText('Gravando');
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-feedback')).toHaveText('Quase! Vamos ouvir de novo.');
  await page.locator('#pronuncia-ouvir').click();
  expect(await page.evaluate(() => window.__falasPronuncia.at(-1).rate)).toBe(0.5);
  await expect.poll(() => requisicoes.length).toBe(2);
  expect(Buffer.from(requisicoes[1].headers['x-reference-text'], 'base64').toString('utf8')).toBe(
    'What does Flash say after his friends help him?'
  );

  await page.locator('#pronuncia-alvo-resposta').click();
  await page.locator('#pronuncia-gravar').click();
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect.poll(() => requisicoes.length).toBe(3);
  expect(Buffer.from(requisicoes[2].headers['x-reference-text'], 'base64').toString('utf8')).toBe(
    'Thank you.'
  );
  expect(await page.evaluate(() => window.__microfonesAbertos)).toBe(3);
  expect(await page.evaluate(() => window.__trilhasParadas)).toBe(3);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE)).toBe(estadoAntes);
});

test('trata permissão negada, gateway ausente, erro de rede e timeout sem desfazer a conclusão', async ({
  page,
}) => {
  await prepararResultado(page);
  await page.evaluate(() => {
    window.navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException('negado', 'NotAllowedError');
    };
  });
  await page.locator('#pronuncia-consentimento').check();
  await page.locator('#pronuncia-gravar').click();
  await expect(page.locator('#pronuncia-status')).toContainText('microfone não foi autorizado');
  await expect(page.locator('#ingles-resumo-resultado')).toContainText('25 de 25');

  await page.evaluate(() => {
    window.navigator.mediaDevices.getUserMedia = async () => ({
      getTracks: () => [{ stop: () => (window.__trilhasParadas += 1) }],
    });
  });
  await page.evaluate(() => {
    window.fetch = async () =>
      new window.Response(JSON.stringify({ error: 'gateway_unconfigured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
  });
  await page.locator('#pronuncia-gravar').click();
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-status')).toContainText('ainda não está configurado');

  await page.evaluate(() => {
    window.fetch = () => Promise.reject(new TypeError('network unavailable'));
  });
  await page.locator('#pronuncia-repetir').click();
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-status')).toContainText('Não foi possível avaliar agora');

  await page.unroute(GATEWAY);
  await page.evaluate(() => {
    const setTimeoutReal = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) =>
      setTimeoutReal(callback, delay === 12000 ? 10 : delay, ...args);
    window.fetch = (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () =>
          reject(new DOMException('timeout', 'AbortError'))
        );
      });
  });
  await page.locator('#pronuncia-repetir').click();
  await page.waitForTimeout(30);
  await page.locator('#pronuncia-parar').click();
  await expect(page.locator('#pronuncia-status')).toContainText('demorou demais');
  await expect(page.locator('#ingles-resumo-resultado')).toContainText('25 de 25');
});

test('mantém a conversa acessível e sem rolagem horizontal em 390 x 844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepararResultado(page);
  await page.locator('#pronuncia-conversacao').scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => ({
    largura: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(overflow.largura).toBeLessThanOrEqual(overflow.viewport);
  const resultados = await new AxeBuilder({ page })
    .include('#pronuncia-conversacao')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(resultados.violations).toEqual([]);
});
