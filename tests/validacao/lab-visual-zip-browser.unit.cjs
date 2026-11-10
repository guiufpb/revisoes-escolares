/* global window, Uint8Array, Blob, createImageBitmap */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const f = require('./helpers/lab-visual-fixture.cjs');
const z = require('./helpers/lab-visual-zip-fixture.cjs');
const { probeDeflate, casosDeflate } = require('./helpers/lab-visual-deflate-probe.cjs');
const indice = require('./fixtures/lab-visual-zip/hashes.json');
let browser, server, origem;
before(async () => {
  server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!doctype html><title>ZIP sintético</title>');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origem = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await new Promise((r) => (server ? server.close(r) : r()));
});
test('Node/Chromium: conformidade nativa de DEFLATE e cancelamento', async () => {
  const cases = casosDeflate(),
    page = await browser.newPage();
  try {
    for (const result of [await probeDeflate(cases), await page.evaluate(probeDeflate, cases)]) {
      assert.equal(result[0].accepted, true);
      assert.ok(result[0].reads > 1);
      for (const r of result.slice(1, 5)) {
        assert.equal(r.accepted, false);
        assert.equal(r.error, true);
      }
      assert.equal(result[5].cancelled, true);
      assert.equal(result[5].writeError, true);
    }
    console.log(
      JSON.stringify({ node: process.version, chromium: browser.version(), deflate: 'conforme' })
    );
  } finally {
    await page.close();
  }
});
test('Chromium: corpus congelado, V0–V4 e ausência de efeitos', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(origem);
    for (const name of ['lab-visual-analise.js', 'lab-visual-zip.js'])
      await page.addScriptTag({
        content: fs.readFileSync(
          path.join(__dirname, '../../ambiente_interativo/js', name),
          'utf8'
        ),
      });
    let requests = 0;
    page.on('request', () => requests++);
    const cases = Object.entries(indice).map(([name, expected]) => ({
      name,
      expected,
      bytes: [...fs.readFileSync(path.join(__dirname, 'fixtures/lab-visual-zip', name))],
    }));
    const resultados = await page.evaluate(async (cases) => {
      let efeitos = 0;
      for (const key of [
        'fetch',
        'localStorage',
        'sessionStorage',
        'indexedDB',
        'speechSynthesis',
        'AudioRevisoes',
        'LabRepositorio',
        'LabCoordenador',
        'GramaticaQuestionarios',
      ])
        Object.defineProperty(window, key, {
          configurable: true,
          get() {
            efeitos++;
            throw new Error('efeito proibido');
          },
        });
      const results = [];
      for (const c of cases) {
        const b = new Uint8Array(c.bytes),
          pending = window.LabVisualZip.analisarTransporteZipVisual(b);
        b.fill(0);
        const r = await pending;
        results.push({
          name: c.name,
          status: r.status,
          digest: r.digestPacote,
          admissao: r.admissaoOperacional,
          decodificacao: r.decodificacao,
        });
      }
      return { results, efeitos };
    }, cases);
    assert.equal(resultados.efeitos, 0);
    assert.equal(requests, 0);
    for (const r of resultados.results) {
      assert.equal(r.status, 'analise-concluida', r.name);
      assert.equal(r.digest, indice[r.name].digestPacote);
      assert.equal(r.admissao, false);
      assert.equal(r.decodificacao, 'pendente');
    }
  } finally {
    await page.close();
  }
});
test('Chromium: recusas físicas, lógicas e DEFLATE preservam isolamento', async () => {
  const x = f.vetor(1),
    entries = z.entradas(x.m, x.bins),
    cases = [];
  const add = (name, b, code, origem = 'transporte') =>
    cases.push({ name, bytes: [...b], code, origem });
  const crc = z.construir(entries);
  crc[30 + crc.readUInt16LE(26)] ^= 1;
  add('CRC', crc, 'ZIP_CRC_INVALIDO');
  add('duplicada', z.construir([...entries, entries[0]]), 'ZIP_ENTRADA_DUPLICADA');
  add(
    'extra',
    z.construir([...entries, { nome: 'README.txt', bytes: Buffer.from('x') }]),
    'ZIP_CAMINHO_PROIBIDO'
  );
  add(
    'DEFLATE',
    z.construir([{ ...entries[0], comprimido: Buffer.from([7]) }], 8),
    'ZIP_DEFLATE_INVALIDO'
  );
  add('truncado', z.construir(entries).subarray(0, -1), 'ZIP_FIM_INVALIDO');
  add(
    'expansão',
    z.construir([{ ...entries[0], bytes: Buffer.alloc(1048576), tamanho: 1 }], 8),
    'ZIP_SAIDA_EXCEDENTE'
  );
  const zlib = require('node:zlib');
  add(
    'cauda',
    z.construir(
      [
        {
          ...entries[0],
          comprimido: Buffer.concat([zlib.deflateRawSync(entries[0].bytes), Buffer.from([0])]),
        },
      ],
      8
    ),
    'ZIP_DEFLATE_INVALIDO'
  );
  add(
    'JSON',
    z.construir([{ ...entries[0], bytes: Buffer.from('{"x":1,"x":2}') }]),
    'CHAVE_DUPLICADA',
    'contrato'
  );
  const page = await browser.newPage();
  try {
    await page.goto(origem);
    for (const name of ['lab-visual-analise.js', 'lab-visual-zip.js'])
      await page.addScriptTag({
        content: fs.readFileSync(
          path.join(__dirname, '../../ambiente_interativo/js', name),
          'utf8'
        ),
      });
    const resultados = await page.evaluate(async (cases) => {
      const results = [];
      for (const c of cases)
        results.push(
          await window.LabVisualZip.analisarTransporteZipVisual(new Uint8Array(c.bytes))
        );
      return results;
    }, cases);
    for (let i = 0; i < cases.length; i++) {
      const r = resultados[i],
        c = cases[i];
      assert.equal(r.status, 'recusado', c.name);
      assert.equal(r.erros[0].codigo, c.code, c.name);
      assert.equal(r.erros[0].origem, c.origem);
      assert.equal(r.admissaoOperacional, false);
      assert.ok(!('manifesto' in r));
      assert.ok(!('digestPacote' in r));
    }
  } finally {
    await page.close();
  }
});

test('Chromium: CRC do ZIP e análise estrutural não comprovam decodificação da imagem', async () => {
  const zlib = require('node:zlib'),
    bytes = Buffer.from(f.bytes('R.png'));
  for (let p = 8; p < bytes.length;) {
    const n = bytes.readUInt32BE(p),
      tipo = bytes.toString('ascii', p + 4, p + 8);
    if (tipo === 'IDAT') {
      // Bloco DEFLATE com BTYPE reservado, preservando CRC PNG e CRC ZIP: falha de pixels,
      // fora da inspeção estrutural homologada do incremento 1.
      bytes[p + 8 + 2] = 7;
      bytes.writeUInt32BE(zlib.crc32(bytes.subarray(p + 4, p + 8 + n)), p + 8 + n);
      break;
    }
    p += n + 12;
  }
  const m = f.base();
  f.recurso(m, 'figura', bytes);
  m.questoes[0].visuais = [f.use('v1', 'figura')];
  const zip = z.construir(z.entradas(m, [bytes]), 8),
    page = await browser.newPage();
  try {
    await page.goto(origem);
    for (const name of ['lab-visual-analise.js', 'lab-visual-zip.js'])
      await page.addScriptTag({
        content: fs.readFileSync(
          path.join(__dirname, '../../ambiente_interativo/js', name),
          'utf8'
        ),
      });
    const r = await page.evaluate(
      async ({ zip, bytes }) => {
        const analise = await window.LabVisualZip.analisarTransporteZipVisual(new Uint8Array(zip));
        let decodificou = false;
        try {
          const bitmap = await createImageBitmap(
            new Blob([new Uint8Array(bytes)], { type: 'image/png' })
          );
          bitmap.close();
          decodificou = true;
        } catch {
          /* Oráculo independente. */
        }
        return {
          status: analise.status,
          decodificacao: analise.decodificacao,
          admissao: analise.admissaoOperacional,
          decodificou,
        };
      },
      { zip: [...zip], bytes: [...bytes] }
    );
    assert.deepEqual(r, {
      status: 'analise-concluida',
      decodificacao: 'pendente',
      admissao: false,
      decodificou: false,
    });
  } finally {
    await page.close();
  }
});
