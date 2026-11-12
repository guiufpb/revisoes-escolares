/* global window, document, URL, HTMLImageElement, Event, Uint8Array, setTimeout, performance */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'),
  path = require('node:path'),
  http = require('node:http');
const { chromium } = require('playwright');
const f = require('./helpers/lab-visual-fixture.cjs');
const p = require('./helpers/lab-visual-previa-fixture.cjs');
const z = require('./helpers/lab-visual-zip-fixture.cjs');
const h = require('./helpers/lab-visual-ilustrada-fixture.cjs');
const zip = require('../../ambiente_interativo/js/lab-visual-zip.js');
let browser, server, origem;
before(async () => {
  const files = new Map(
    [
      '/ambiente_interativo/js/lab-visual-analise.js',
      '/ambiente_interativo/js/lab-visual-zip-nucleo.js',
      '/ambiente_interativo/js/lab-visual-ilustrada.js',
    ].map((n) => [n, fs.readFileSync(path.join(__dirname, '../..', n))])
  );
  files.set('/', fs.readFileSync(path.join(__dirname, '../fixtures/lab-visual-imagens.html')));
  server = http.createServer((req, res) => {
    const b = files.get(req.url);
    if (!b) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': req.url === '/' ? 'text/html; charset=utf-8' : 'text/javascript',
    });
    res.end(b);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((r) => server.close(r));
});
async function pagina() {
  const page = await browser.newPage();
  await page.goto(origem);
  await page.evaluate(() => {
    window.usos = (v) => {
      const out = [];
      function visitar(x) {
        if (!x || typeof x !== 'object') return;
        if (x.tipo === 'imagem') out.push(x);
        else Object.values(x).forEach(visitar);
      }
      visitar(v);
      return out;
    };
    const create = URL.createObjectURL.bind(URL),
      revoke = URL.revokeObjectURL.bind(URL),
      decode = HTMLImageElement.prototype.decode;
    window.observado = {
      vivas: new Set(),
      criadas: 0,
      revogadas: 0,
      decode: 0,
      ativas: 0,
      pico: 0,
      erros: 0,
      errosBitmap: 0,
      bitmaps: 0,
      fechados: 0,
    };
    const materializar = window.createImageBitmap.bind(window);
    window.createImageBitmap = async (blob) => {
      try {
        const b = await materializar(blob);
        window.observado.bitmaps++;
        const fechar = b.close.bind(b);
        b.close = () => {
          window.observado.fechados++;
          fechar();
        };
        return b;
      } catch (e) {
        window.observado.errosBitmap++;
        throw e;
      }
    };
    URL.createObjectURL = (b) => {
      const u = create(b);
      window.observado.vivas.add(u);
      window.observado.criadas++;
      return u;
    };
    URL.revokeObjectURL = (u) => {
      if (!window.observado.vivas.delete(u)) throw Error('revogação inválida');
      window.observado.revogadas++;
      revoke(u);
    };
    HTMLImageElement.prototype.decode = async function () {
      const s = window.observado;
      s.decode++;
      s.ativas++;
      s.pico = Math.max(s.pico, s.ativas);
      try {
        return await decode.call(this);
      } catch (e) {
        s.erros++;
        throw e;
      } finally {
        s.ativas--;
      }
    };
  });
  return page;
}
for (const nome of [
  'R.png',
  'B.png',
  'P1-paleta.png',
  'P2-cinza.png',
  'P3-alpha.png',
  'P4-16bits.png',
  'P5-adam7.png',
  'W1.webp',
  'W2.webp',
  'W3.webp',
  'W4.webp',
  'W5.webp',
  'J1.jpg',
  'J2.jpg',
  'J3.jpg',
])
  test('Chromium decodifica e apresenta ' + nome, async () => {
    const page = await pagina();
    try {
      const x = /^[RB]/.test(nome) ? f.vetor(nome === 'R.png' ? 1 : 3) : f.raster(nome);
      const r = await page.evaluate(
        async (bytes) => {
          const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
          const r = await c.preparar(new Uint8Array(bytes)),
            u = window.usos(r.projecao);
          if (r.status !== 'ilustracao-disponivel') return r;
          const out = [];
          for (const uso of u) {
            const a = await c.criarApresentacao(uso);
            document.querySelector('#imagens').append(a.elemento);
            out.push([
              a.elemento.naturalWidth,
              a.elemento.naturalHeight,
              a.elemento.width,
              a.elemento.height,
            ]);
            if (!window.observado.vivas.has(a.elemento.src)) throw Error('URL revogada cedo');
            a.liberar();
            a.liberar();
          }
          c.descartar();
          return {
            out,
            estado: c.consultarEstado(),
            vivas: window.observado.vivas.size,
            erros: window.observado.erros,
            decode: window.observado.decode,
            bitmaps: window.observado.bitmaps,
            fechados: window.observado.fechados,
          };
        },
        [...p.zip(x)]
      );
      assert.equal(r.vivas, 0);
      assert.equal(r.erros, 0);
      const n = /^[RB]/.test(nome) ? 1 : 16;
      assert.ok(r.out.length);
      for (const dims of r.out) assert.deepEqual(dims, [n, n, n, n]);
      assert.equal(r.estado.observacao.pixelsEmUso, 0);
      assert.ok(r.decode >= 2);
      assert.ok(r.bitmaps > 0);
      assert.equal(r.bitmaps, r.fechados);
    } finally {
      await page.close();
    }
  });
test('Chromium: PNG analiticamente válido é efetivamente indecodificável; sem sucesso parcial', async () => {
  const valido = h.pacotePNG(),
    x = f.vetor(3);
  x.bins[1] = h.png(1, 1, true);
  f.recurso(x.m, 'outro', x.bins[1]);
  const invalido = p.zip(x);
  assert.equal((await zip.analisarTransporteZipVisual(invalido)).status, 'analise-concluida');
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async ({ ok, bad }) => {
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        const antes = await c.preparar(new Uint8Array(ok)),
          u = window.usos(antes.projecao)[0];
        const a = await c.criarApresentacao(u);
        const falha = await c.preparar(new Uint8Array(bad));
        const old = await c.criarApresentacao(u);
        return {
          falha,
          old,
          a: a.consultarEstado(),
          projecao: c.consultarProjecao(),
          estado: c.consultarEstado(),
          erros: window.observado.erros + window.observado.errosBitmap,
          vivas: window.observado.vivas.size,
          bitmaps: window.observado.bitmaps,
          fechados: window.observado.fechados,
        };
      },
      { ok: [...valido], bad: [...invalido] }
    );
    assert.equal(r.falha.erros[0].codigo, 'ILUSTRADA_DECODIFICACAO_FALHOU');
    assert.equal(r.erros, 1);
    assert.equal(r.estado.estado, 'falha');
    assert.equal(r.vivas, 0);
    assert.equal(r.old.erros[0].codigo, 'ILUSTRADA_REFERENCIA_INVALIDA');
    assert.equal(r.a.estado, 'liberada');
    assert.equal(r.projecao.status, 'recusado');
    assert.equal('projecao' in r.falha, false);
    assert.equal('digestPacote' in r.falha, false);
    assert.equal(r.estado.observacao.recursosVerificados, 1);
    assert.equal(r.bitmaps, r.fechados);
  } finally {
    await page.close();
  }
});
test('Chromium: sem imagens é explícito e não exercita codecs', async () => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          r = await c.preparar(new Uint8Array(bytes));
        return {
          r,
          s: c.consultarEstado(),
          decode: window.observado.decode,
          urls: window.observado.criadas,
        };
      },
      [...p.zip(f.vetor(0))]
    );
    assert.equal(r.r.decodificacao, 'sem-recursos');
    assert.equal(r.s.observacao.semRecursos, true);
    assert.equal(r.decode, 0);
    assert.equal(r.urls, 0);
    assert.equal(r.r.admissaoOperacional, false);
  } finally {
    await page.close();
  }
});
test('Chromium: deduplicação, isolamento, canários e ausência de efeitos', async () => {
  const page = await pagina(),
    logs = [],
    requests = [];
  page.on('console', (m) => logs.push(m.text()));
  page.on('request', (r) => {
    if (!r.url().startsWith('blob:')) requests.push(r.url());
  });
  try {
    const r = await page.evaluate(
      async (bytes) => {
        let efeitos = 0;
        for (const k of [
          'fetch',
          'localStorage',
          'sessionStorage',
          'indexedDB',
          'Audio',
          'AudioContext',
          'speechSynthesis',
          'LabCoordenador',
          'LabRepositorio',
          'GramaticaQuestionarios',
        ])
          Object.defineProperty(window, k, {
            configurable: true,
            get() {
              efeitos++;
              throw Error('efeito proibido');
            },
          });
        const a = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          b = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        const r = await a.preparar(new Uint8Array(bytes)),
          s = await b.preparar(new Uint8Array(bytes));
        const usos = window.usos(r.projecao),
          u = usos[0];
        const compartilhado = usos.find((x) => x !== u && x.recurso === u.recurso);
        const c = await a.criarApresentacao(u),
          d = await a.criarApresentacao(compartilhado);
        const same = c.elemento.src === d.elemento.src;
        const cross = await a.criarApresentacao(window.usos(s.projecao)[0]);
        const fake = await a.criarApresentacao({ ...u });
        document.querySelector('#imagens').append(c.elemento, d.elemento);
        const dom = document.body.innerHTML;
        c.liberar();
        const ainda = window.observado.vivas.has(d.elemento.src);
        d.liberar();
        a.descartar();
        b.descartar();
        return {
          same,
          cross,
          fake,
          ainda,
          efeitos,
          dom,
          json: JSON.stringify(r.projecao),
          vivas: window.observado.vivas.size,
        };
      },
      [...p.zip(p.canarios())]
    );
    assert.equal(r.same, true);
    assert.equal(r.ainda, true);
    assert.equal(r.efeitos, 0);
    assert.equal(r.vivas, 0);
    assert.equal(r.cross.erros[0].codigo, 'ILUSTRADA_REFERENCIA_INVALIDA');
    assert.equal(r.fake.erros[0].codigo, 'ILUSTRADA_REFERENCIA_INVALIDA');
    for (const canario of [
      'AlvoSecretoCanario',
      'RespostaSecretaCanario',
      'TituloAdministrativoCanario',
      'orig-',
    ])
      assert.ok(
        !r.dom.includes(canario) && !r.json.includes(canario) && !logs.join('').includes(canario)
      );
    assert.deepEqual(requests, []);
  } finally {
    await page.close();
  }
});
test('Chromium: orçamento real, URLs compartilhadas e retomada', async () => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          p = await c.preparar(new Uint8Array(bytes)),
          u = window.usos(p.projecao)[0];
        const a = await c.criarApresentacao(u),
          b = await c.criarApresentacao(u);
        const cheio = c.consultarEstado(),
          bad = await c.criarApresentacao(u);
        a.liberar();
        const d = await c.criarApresentacao(u);
        const natural = d.elemento.naturalWidth;
        b.liberar();
        d.liberar();
        c.descartar();
        return {
          cheio,
          bad,
          natural,
          final: c.consultarEstado(),
          vivas: window.observado.vivas.size,
          pico: window.observado.pico,
        };
      },
      [...h.pacotePNG(2048, 2048)]
    );
    assert.equal(r.cheio.observacao.pixelsEmUso, 8388608);
    assert.equal(r.bad.erros[0].codigo, 'ILUSTRADA_ORCAMENTO_OCUPADO');
    assert.equal(r.natural, 2048);
    assert.equal(r.vivas, 0);
    assert.equal(r.final.observacao.pixelsEmUso, 0);
    assert.equal(r.pico, 1);
  } finally {
    await page.close();
  }
});
test('Chromium: pixels agregados do pacote não são um limite de validade', async (t) => {
  const m = f.base(),
    bins = [];
  for (const [i, [w, hgt]] of [
    [2048, 2048],
    [1024, 4096],
    [4096, 1024],
  ].entries()) {
    const b = h.png(w, hgt);
    bins.push(b);
    f.recurso(m, 'r' + i, b, 'image/png', w, hgt);
    m.questoes[0].visuais.push(f.use('v' + i, 'r' + i, true));
  }
  const bytes = z.construir(z.entradas(m, bins));
  assert.equal((await zip.analisarTransporteZipVisual(bytes)).status, 'analise-concluida');
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const inicio = performance.now(),
          c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        const r = await c.preparar(new Uint8Array(bytes)),
          s = c.consultarEstado();
        c.descartar();
        return {
          status: r.status,
          s,
          v: window.observado.vivas.size,
          b: window.observado.bitmaps,
          f: window.observado.fechados,
          ms: performance.now() - inicio,
        };
      },
      [...bytes]
    );
    assert.equal(r.status, 'ilustracao-disponivel');
    assert.equal(r.s.observacao.recursosVerificados, 3);
    assert.equal(r.s.observacao.pixelsEmUso, 0);
    assert.equal(r.v, 0);
    assert.equal(r.b, 3);
    assert.equal(r.f, 3);
    t.diagnostic(
      'Exploratório: 3 imagens / 12582912 pixels agregados; ' +
        bytes.length +
        ' bytes ZIP; ' +
        r.ms.toFixed(1) +
        ' ms; nenhum frame retido pela aplicação.'
    );
  } finally {
    await page.close();
  }
});
test('Chromium: dimensões naturais divergentes recusadas após decode real', async () => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const decode = HTMLImageElement.prototype.decode;
        HTMLImageElement.prototype.decode = async function () {
          await decode.call(this);
          Object.defineProperty(this, 'naturalWidth', { value: 2 });
        };
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          r = await c.preparar(new Uint8Array(bytes));
        return { r, n: window.observado.decode, vivas: window.observado.vivas.size };
      },
      [...p.zip(f.vetor(1))]
    );
    assert.equal(r.r.erros[0].codigo, 'ILUSTRADA_DIMENSOES_DIVERGENTES');
    assert.equal(r.n, 1);
    assert.equal(r.vivas, 0);
  } finally {
    await page.close();
  }
});
for (const modo of ['descartar', 'substituir'])
  test('Chromium: ' + modo + ' durante decode nativo retido', async () => {
    const page = await pagina();
    try {
      const r = await page.evaluate(
        async ({ bytes, modo }) => {
          const decode = HTMLImageElement.prototype.decode;
          let soltar, entrou;
          const gate = new Promise((r) => {
              soltar = r;
            }),
            entry = new Promise((r) => {
              entrou = r;
            });
          HTMLImageElement.prototype.decode = async function () {
            await decode.call(this);
            entrou();
            await gate;
          };
          const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
            antiga = c.preparar(new Uint8Array(bytes));
          await entry;
          let nova;
          if (modo === 'descartar') c.descartar();
          else nova = c.preparar(new Uint8Array(bytes));
          const cancelada = await antiga,
            antes = c.consultarEstado();
          HTMLImageElement.prototype.decode = decode;
          soltar();
          const atual = nova ? await nova : null;
          await new Promise((r) => setTimeout(r, 0));
          const fim = c.consultarEstado();
          c.descartar();
          return { cancelada, antes, atual, fim, vivas: window.observado.vivas.size };
        },
        { bytes: [...p.zip(f.vetor(1))], modo }
      );
      assert.equal(r.cancelada.erros[0].codigo, 'ILUSTRADA_INVALIDADA');
      assert.equal(r.antes.observacao.decodificacoesAtivas, 1);
      assert.equal(r.fim.estado, modo === 'descartar' ? 'descartado' : 'disponivel');
      if (r.atual) assert.equal(r.atual.status, 'ilustracao-disponivel');
      assert.equal(r.vivas, 0);
    } finally {
      await page.close();
    }
  });
test('Chromium: erro tardio e erro de decode na apresentação; recuperação', async () => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        let p = await c.preparar(new Uint8Array(bytes)),
          u = window.usos(p.projecao)[0];
        const a = await c.criarApresentacao(u);
        document.querySelector('#imagens').append(a.elemento);
        a.elemento.dispatchEvent(new Event('error'));
        const late = {
          s: c.consultarEstado(),
          a: a.consultarEstado(),
          v: window.observado.vivas.size,
          dom: document.querySelector('#imagens').children.length,
        };
        p = await c.preparar(new Uint8Array(bytes));
        u = window.usos(p.projecao)[0];
        const decode = HTMLImageElement.prototype.decode;
        HTMLImageElement.prototype.decode = async function () {
          await decode.call(this);
          throw Error('segredo após decode real');
        };
        const bad = await c.criarApresentacao(u);
        HTMLImageElement.prototype.decode = decode;
        const recovery = await c.preparar(new Uint8Array(bytes));
        c.descartar();
        return { late, bad, recovery: recovery.status, v: window.observado.vivas.size };
      },
      [...p.zip(f.vetor(1))]
    );
    assert.equal(r.late.s.estado, 'falha');
    assert.equal(r.late.a.estado, 'indisponivel');
    assert.equal(r.late.v, 0);
    assert.equal(r.late.dom, 0);
    assert.equal(r.bad.erros[0].codigo, 'ILUSTRADA_DECODIFICACAO_FALHOU');
    assert.ok(!JSON.stringify(r.bad).includes('segredo'));
    assert.equal(r.recovery, 'ilustracao-disponivel');
    assert.equal(r.v, 0);
  } finally {
    await page.close();
  }
});
for (const alvo of ['Blob', 'URL'])
  test('Chromium: falha de ' + alvo + ' preserva recusa sem dados', async () => {
    const page = await pagina();
    try {
      const r = await page.evaluate(
        async ({ bytes, alvo }) => {
          if (alvo === 'Blob')
            window.Blob = class {
              constructor() {
                throw Error('segredo-blob');
              }
            };
          else
            URL.createObjectURL = () => {
              throw Error('segredo-url');
            };
          const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
          const r = await c.preparar(new Uint8Array(bytes));
          return { r, s: c.consultarEstado(), v: window.observado.vivas.size };
        },
        { bytes: [...p.zip(f.vetor(1))], alvo }
      );
      assert.equal(r.r.erros[0].codigo, 'ILUSTRADA_RECURSO_FALHOU');
      assert.ok(!JSON.stringify(r.r).includes('segredo'));
      assert.equal(r.s.estado, 'falha');
      assert.equal(r.v, 0);
    } finally {
      await page.close();
    }
  });
test('Chromium: descarte durante materialização fecha o bitmap tardio', async () => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const original = window.createImageBitmap;
        let soltar, entrar;
        const gate = new Promise((r) => {
            soltar = r;
          }),
          entry = new Promise((r) => {
            entrar = r;
          });
        window.createImageBitmap = async (blob) => {
          const b = await original(blob);
          entrar();
          await gate;
          return b;
        };
        const c = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          p = c.preparar(new Uint8Array(bytes));
        await entry;
        c.descartar();
        const cancelada = await p;
        soltar();
        await new Promise((r) => setTimeout(r, 0));
        return {
          cancelada,
          s: c.consultarEstado(),
          b: window.observado.bitmaps,
          f: window.observado.fechados,
          v: window.observado.vivas.size,
        };
      },
      [...p.zip(f.vetor(1))]
    );
    assert.equal(r.cancelada.erros[0].codigo, 'ILUSTRADA_INVALIDADA');
    assert.equal(r.b, 1);
    assert.equal(r.f, 1);
    assert.equal(r.v, 0);
    assert.equal(r.s.estado, 'descartado');
  } finally {
    await page.close();
  }
});
test('Chromium: ciclos independentes sem retenção controlada ou listeners acumulados', async (t) => {
  const page = await pagina();
  try {
    const r = await page.evaluate(
      async (bytes) => {
        const inicio = performance.now();
        const a = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual(),
          b = window.LabVisualIlustrada.criarPreparacaoIlustradaVisual();
        const [ra, rb] = await Promise.all([
          a.preparar(new Uint8Array(bytes)),
          b.preparar(new Uint8Array(bytes)),
        ]);
        const ua = window.usos(ra.projecao)[0],
          ub = window.usos(rb.projecao)[0];
        for (let i = 0; i < 20; i++) {
          const [x, y] = await Promise.all([a.criarApresentacao(ua), b.criarApresentacao(ub)]);
          document.querySelector('#imagens').append(x.elemento, y.elemento);
          x.liberar();
          y.liberar();
          // Evento em elemento liberado não pode invalidar uma preparação ainda válida.
          x.elemento.dispatchEvent(new Event('error'));
        }
        const before = [a.consultarEstado(), b.consultarEstado()];
        a.descartar();
        b.descartar();
        return {
          before,
          dom: document.querySelector('#imagens').children.length,
          v: window.observado.vivas.size,
          b: window.observado.bitmaps,
          f: window.observado.fechados,
          ms: performance.now() - inicio,
        };
      },
      [...p.zip(f.vetor(1))]
    );
    for (const s of r.before) {
      assert.equal(s.estado, 'disponivel');
      assert.equal(s.observacao.pixelsEmUso, 0);
      assert.equal(s.observacao.apresentacoes, 0);
    }
    assert.equal(r.dom, 0);
    assert.equal(r.v, 0);
    assert.equal(r.b, r.f);
    t.diagnostic(
      'Exploratório: 2 preparações / 40 apresentações, ' +
        r.ms.toFixed(1) +
        ' ms; registros e URLs zerados; não mede memória física.'
    );
  } finally {
    await page.close();
  }
});
