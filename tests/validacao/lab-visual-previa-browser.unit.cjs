/* global window, Uint8Array */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const f = require('./helpers/lab-visual-fixture.cjs');
const p = require('./helpers/lab-visual-previa-fixture.cjs');
const indice = require('./fixtures/lab-visual-zip/hashes.json');
const src = (nome) =>
  fs.readFileSync(path.join(__dirname, '../../ambiente_interativo/js', nome), 'utf8');
const base = execFileSync(
  'git',
  ['show', '9af0139d98c22ff0f16f81c6fa0151fd4fda71b2:ambiente_interativo/js/lab-visual-zip.js'],
  { encoding: 'utf8' }
);
let browser, server, origem;
before(async () => {
  server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!doctype html><title>3B sintético isolado</title>');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await new Promise((r) => (server ? server.close(r) : r()));
});
test('Chromium: API pública integralmente equivalente à base e V0–V4', async () => {
  const a = await browser.newPage(),
    b = await browser.newPage();
  try {
    await a.goto(origem);
    await b.goto(origem);
    await a.addScriptTag({ content: src('lab-visual-analise.js') });
    await a.addScriptTag({ content: base });
    for (const n of ['lab-visual-analise.js', 'lab-visual-zip-nucleo.js', 'lab-visual-zip.js'])
      await b.addScriptTag({ content: src(n) });
    const cases = Object.keys(indice).map((nome) => [
      ...fs.readFileSync(path.join(__dirname, 'fixtures/lab-visual-zip', nome)),
    ]);
    const pequeno = p.zip(f.vetor(0));
    for (let i = 0; i < pequeno.length; i += 13) cases.push([...pequeno.subarray(0, i)]);
    const run = async (cases) => {
      const r = [];
      for (const bytes of cases)
        r.push(await window.LabVisualZip.analisarTransporteZipVisual(new Uint8Array(bytes)));
      return r;
    };
    assert.deepEqual(await a.evaluate(run, cases), await b.evaluate(run, cases));
  } finally {
    await a.close();
    await b.close();
  }
});
test('Chromium: projeção segura, referências, descarte e nenhum efeito', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(origem);
    for (const n of ['lab-visual-analise.js', 'lab-visual-zip-nucleo.js', 'lab-visual-previa.js'])
      await page.addScriptTag({ content: src(n) });
    let requests = 0;
    page.on('request', () => requests++);
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    const r = await page.evaluate(
      async (bytes) => {
        let efeitos = 0;
        for (const key of [
          'fetch',
          'localStorage',
          'sessionStorage',
          'indexedDB',
          'speechSynthesis',
          'Audio',
          'AudioContext',
          'AudioRevisoes',
          'LabCoordenador',
          'LabRepositorio',
          'GramaticaQuestionarios',
          'Blob',
          'Image',
          'ImageBitmap',
          'createImageBitmap',
          'OffscreenCanvas',
        ])
          Object.defineProperty(window, key, {
            configurable: true,
            get() {
              efeitos++;
              throw new Error('proibido');
            },
          });
        const c = window.LabVisualPrevia.criarPreparacaoPreviaVisual(),
          d = window.LabVisualPrevia.criarPreparacaoPreviaVisual();
        const zip = new Uint8Array(bytes),
          pendente = c.preparar(zip);
        zip.fill(0);
        const p = await pendente;
        const ref = p.projecao.questoes[0].visuais[0].elementos[0].recurso;
        const json = JSON.stringify(p),
          info = c.consultarReferencia(ref),
          falsa = d.consultarReferencia(ref);
        const imutavel =
          Object.isFrozen(p.projecao) && Object.isFrozen(p.projecao.questoes[0].itens);
        c.descartar();
        c.descartar();
        const morta = c.consultarReferencia(ref),
          atraso = await c.preparar(new Uint8Array(bytes));
        const e = window.LabVisualPrevia.criarPreparacaoPreviaVisual(),
          tardia = e.preparar(new Uint8Array(bytes));
        e.descartar();
        const tardio = await tardia;
        d.descartar();
        return {
          json,
          info,
          falsa,
          morta,
          atraso,
          tardio,
          imutavel,
          efeitos,
          dom: window.document.body.innerHTML,
        };
      },
      [...p.zip(p.canarios(), 8)]
    );
    const parsed = JSON.parse(r.json);
    assert.equal(parsed.status, 'contexto-disponivel');
    assert.equal(parsed.admissaoOperacional, false);
    assert.equal(parsed.decodificacao, 'pendente');
    for (const canario of [
      'orig-',
      'admincanario',
      'TituloAdministrativoCanario',
      'RespostaSecretaCanario',
      'AlvoSecretoCanario',
    ]) {
      assert.ok(!r.json.includes(canario));
      assert.ok(!r.dom.includes(canario));
      assert.ok(!logs.join('').includes(canario));
    }
    assert.equal(r.info.status, 'referencia-reconhecida');
    for (const x of [r.falsa, r.morta, r.atraso, r.tardio]) assert.equal(x.status, 'recusado');
    assert.equal(r.imutavel, true);
    assert.equal(r.efeitos, 0);
    assert.equal(requests, 0);
    assert.equal(r.dom, '');
  } finally {
    await page.close();
  }
});
