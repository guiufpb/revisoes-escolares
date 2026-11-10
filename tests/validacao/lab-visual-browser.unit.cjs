/* global window, document, Blob, createImageBitmap, URL, TextEncoder */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const f = require('./helpers/lab-visual-fixture.cjs');
let browser, server, origem;
before(async () => {
  server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!doctype html><title>Fixture sintética isolada</title>');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await new Promise((r) => (server ? server.close(r) : r()));
});
test('Chromium: API isolada, V0–V4 e ausência de rede/storage/áudio/sessões', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(origem);
    await page.addScriptTag({
      content: fs.readFileSync(
        path.join(__dirname, '../../ambiente_interativo/js/lab-visual-analise.js'),
        'utf8'
      ),
    });
    let pedidos = 0;
    page.on('request', () => pedidos++);
    const dados = Array.from({ length: 5 }, (_, i) => {
      const x = f.vetor(i);
      return { m: x.m, bins: x.bins.map((b) => [...b]) };
    });
    const resultado = await page.evaluate(async (dados) => {
      let efeitos = 0;
      for (const k of [
        'fetch',
        'localStorage',
        'indexedDB',
        'speechSynthesis',
        'AudioRevisoes',
        'LabCoordenador',
        'QuestionariosRevisoes',
      ])
        Object.defineProperty(window, k, {
          configurable: true,
          get() {
            efeitos++;
            throw Error('efeito');
          },
        });
      const resultados = [];
      for (const d of dados)
        resultados.push(
          await window.LabVisualAnalise.analisarContratoVisual(
            new TextEncoder().encode(JSON.stringify(d.m)),
            d.bins.map((b) => new Uint8Array(b))
          )
        );
      return { resultados, efeitos, api: Object.keys(window.LabVisualAnalise) };
    }, dados);
    assert.deepEqual(resultado.api, ['analisarContratoVisual']);
    assert.equal(resultado.efeitos, 0);
    assert.equal(pedidos, 0);
    assert.deepEqual(
      resultado.resultados.map((r) => r.digestPacote),
      f.digests
    );
    assert.ok(
      resultado.resultados.every(
        (r) =>
          r.status === 'analise-concluida' &&
          r.admissaoOperacional === false &&
          r.decodificacao === 'pendente'
      )
    );
  } finally {
    await page.close();
  }
});
test('Chromium: corpus congelado decodifica; oráculo externo ao analisador', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(origem);
    const dados = Object.keys(f.hashes).map((nome) => ({ nome, b: [...f.bytes(nome)] }));
    const r = await page.evaluate(async (dados) => {
      const resultados = [];
      for (const d of dados) {
        const mime = d.nome.endsWith('.webp')
          ? 'image/webp'
          : d.nome.endsWith('.jpg')
            ? 'image/jpeg'
            : 'image/png';
        const blob = new Blob([new Uint8Array(d.b)], { type: mime });
        const url = URL.createObjectURL(blob);
        try {
          const img = document.createElement('img');
          img.src = url;
          await img.decode();
          const bitmap = await createImageBitmap(blob);
          resultados.push({
            nome: d.nome,
            w: img.naturalWidth,
            h: img.naturalHeight,
            bw: bitmap.width,
            bh: bitmap.height,
          });
          bitmap.close();
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      return resultados;
    }, dados);
    for (const x of r) {
      const n = /^[RB]\.png$/.test(x.nome) ? 1 : 16;
      assert.equal(x.w, n);
      assert.equal(x.h, n);
      assert.equal(x.bw, n);
      assert.equal(x.bh, n);
    }
  } finally {
    await page.close();
  }
});
