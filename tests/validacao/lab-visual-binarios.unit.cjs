'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../../ambiente_interativo/js/lab-visual-analise.js');
const f = require('./helpers/lab-visual-fixture.cjs');
async function analisar(b, mime = 'image/png', largura = 1, altura = 1) {
  const m = f.base();
  f.recurso(m, 'figura', b, mime, largura, altura);
  m.questoes[0].visuais = [f.use('v1', 'figura')];
  return api.analisarContratoVisual(f.encode(m), [b]);
}
const recusa = (r, codigo) => {
  assert.equal(r.status, 'recusado', JSON.stringify(r));
  assert.equal(r.admissaoOperacional, false);
  assert.equal('digestPacote' in r, false);
  if (codigo)
    assert.ok(
      r.erros.some((e) => e.codigo === codigo),
      JSON.stringify(r)
    );
};
function crc(b) {
  let n = 0xffffffff;
  for (const x of b) {
    n ^= x;
    for (let i = 0; i < 8; i++) n = (n >>> 1) ^ (n & 1 ? 0xedb88320 : 0);
  }
  return (n ^ 0xffffffff) >>> 0;
}
function chunk(t, d) {
  const b = Buffer.alloc(d.length + 12);
  b.writeUInt32BE(d.length);
  b.write(t, 4);
  b.set(d, 8);
  b.writeUInt32BE(crc(b.subarray(4, -4)), b.length - 4);
  return b;
}
function pngChunks(b) {
  const a = [];
  let o = 8;
  while (o < b.length) {
    const n = Buffer.from(b).readUInt32BE(o);
    a.push({
      t: Buffer.from(b).toString('ascii', o + 4, o + 8),
      d: Buffer.from(b.slice(o + 8, o + 8 + n)),
    });
    o += n + 12;
  }
  return a;
}
const montarPNG = (a) =>
  Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ...a.map((c) => chunk(c.t, c.d))]);
const pngMut = (cb) => {
  const a = pngChunks(f.bytes('R.png'));
  cb(a);
  return montarPNG(a);
};
const pngs = [
  [
    'CRC',
    () => {
      const b = f.bytes('R.png');
      b[29] ^= 1;
      return b;
    },
  ],
  ['truncado', () => f.bytes('R.png').slice(0, -1)],
  ['sem término', () => pngMut((a) => a.pop())],
  [
    'prefixo falso',
    () => {
      const b = f.bytes('R.png');
      b[0] = 0;
      return b;
    },
  ],
  ['extra após IEND', () => Buffer.concat([f.bytes('R.png'), Buffer.from([0])])],
  ['IHDR duplicado', () => pngMut((a) => a.splice(1, 0, a[0]))],
  ['bit depth inválido', () => pngMut((a) => (a[0].d[8] = 3))],
  ['cor inválida', () => pngMut((a) => (a[0].d[9] = 1))],
  ['compressão inválida', () => pngMut((a) => (a[0].d[10] = 1))],
  ['interlace inválido', () => pngMut((a) => (a[0].d[12] = 2))],
  ['PLTE inválida', () => pngMut((a) => a.splice(1, 0, { t: 'PLTE', d: Buffer.alloc(2) }))],
  ['paleta obrigatória', () => pngMut((a) => (a[0].d[9] = 3))],
  ['tRNS indevido', () => pngMut((a) => a.splice(1, 0, { t: 'tRNS', d: Buffer.alloc(1) }))],
  ['IDAT vazio', () => pngMut((a) => (a[1].d = Buffer.alloc(0)))],
  ['zlib inválido', () => pngMut((a) => (a[1].d[0] = 0))],
  [
    'IDAT não consecutivo',
    () => pngMut((a) => a.splice(2, 0, { t: 'tRNS', d: Buffer.alloc(6) }, { ...a[1] })),
  ],
  ...['acTL', 'fcTL', 'fdAT', 'eXIf', 'iCCP', 'tEXt', 'zTXt', 'iTXt', 'ABCD'].map((t) => [
    t,
    () => pngMut((a) => a.splice(1, 0, { t, d: Buffer.alloc(8) })),
  ]),
];
for (const [n, fn] of pngs)
  test('PNG estrutural, com hash atualizado: ' + n, async () =>
    recusa(
      await analisar(new Uint8Array(fn())),
      n === 'CRC'
        ? 'CRC_INVALIDO'
        : n === 'prefixo falso'
          ? 'FORMATO_RECURSO_NAO_SUPORTADO'
          : ['acTL', 'fcTL', 'fdAT'].includes(n)
            ? 'VARIANTE_RECURSO_NAO_SUPORTADA'
            : ['eXIf', 'iCCP', 'tEXt', 'zTXt', 'iTXt', 'ABCD'].includes(n)
              ? 'METADADO_NAO_PERMITIDO'
              : 'ESTRUTURA_RECURSO_INVALIDA'
    )
  );
function riffChunk(t, d) {
  const b = Buffer.alloc(8 + d.length + (d.length % 2));
  b.write(t);
  b.writeUInt32LE(d.length, 4);
  b.set(d, 8);
  return b;
}
function webChunks(b) {
  const a = [];
  let o = 12;
  const raw = Buffer.from(b);
  while (o < raw.length) {
    const n = raw.readUInt32LE(o + 4);
    a.push({ t: raw.toString('ascii', o, o + 4), d: Buffer.from(raw.subarray(o + 8, o + 8 + n)) });
    o += 8 + n + (n % 2);
  }
  return a;
}
function montarWeb(a) {
  const d = Buffer.concat([Buffer.from('WEBP'), ...a.map((c) => riffChunk(c.t, c.d))]);
  const h = Buffer.alloc(8);
  h.write('RIFF');
  h.writeUInt32LE(d.length, 4);
  return Buffer.concat([h, d]);
}
const wm = (cb, nome = 'W4.webp') => {
  const a = webChunks(f.bytes(nome));
  cb(a);
  return montarWeb(a);
};
const webs = [
  [
    'RIFF tamanho',
    () => {
      const b = f.bytes('W1.webp');
      b[4] ^= 2;
      return b;
    },
  ],
  ['truncado', () => f.bytes('W4.webp').slice(0, -1)],
  [
    'padding',
    () => {
      const b = Buffer.from(f.bytes('W2.webp'));
      b[b.length - 1] = 1;
      return b;
    },
  ],
  [
    'chunk ultrapassa fim',
    () => {
      const b = Buffer.from(f.bytes('W1.webp'));
      b.writeUInt32LE(0xffffffff, 16);
      return b;
    },
  ],
  ['VP8X dimensões', () => wm((a) => (a[0].d[4] = 31))],
  ['VP8X flag alpha ausente', () => wm((a) => (a[0].d[0] = 0))],
  ['VP8X flag reservada', () => wm((a) => (a[0].d[0] |= 1))],
  ['VP8X bytes reservados', () => wm((a) => (a[0].d[1] = 1))],
  ['ALPH reservado', () => wm((a) => (a[1].d[0] |= 0xc0))],
  ['ALPH após imagem', () => wm((a) => a.push(a.splice(1, 1)[0]))],
  ['imagem duplicada', () => wm((a) => a.push(a.at(-1)))],
  ['VP8 não keyframe', () => wm((a) => (a[0].d[0] |= 1), 'W1.webp')],
  ['VP8 assinatura', () => wm((a) => (a[0].d[3] = 0), 'W1.webp')],
  ['VP8 partição', () => wm((a) => a[0].d.fill(255, 0, 3), 'W1.webp')],
  ['VP8L versão', () => wm((a) => (a[0].d[4] |= 0xe0), 'W2.webp')],
  ['VP8L truncado', () => wm((a) => (a[0].d = a[0].d.subarray(0, 4)), 'W2.webp')],
  ...['ANIM', 'ANMF', 'EXIF', 'XMP ', 'ICCP', 'xxxx'].map((t) => [
    t,
    () => wm((a) => a.push({ t, d: Buffer.alloc(4) })),
  ]),
];
for (const [n, fn] of webs)
  test('WebP estrutural, com hash atualizado: ' + n, async () =>
    recusa(
      await analisar(new Uint8Array(fn()), 'image/webp', 16, 16),
      ['ANIM', 'ANMF', 'VP8X flag reservada'].includes(n)
        ? 'VARIANTE_RECURSO_NAO_SUPORTADA'
        : ['EXIF', 'XMP ', 'ICCP', 'xxxx'].includes(n)
          ? 'METADADO_NAO_PERMITIDO'
          : 'ESTRUTURA_RECURSO_INVALIDA'
    )
  );
function marcador(b, code) {
  for (let i = 0; i < b.length - 1; i++) if (b[i] === 255 && b[i + 1] === code) return i;
  throw Error('fixture sem marcador');
}
function seg(code, d) {
  const b = Buffer.alloc(4 + d.length);
  b[0] = 255;
  b[1] = code;
  b.writeUInt16BE(d.length + 2, 2);
  b.set(d, 4);
  return b;
}
const jpegMut = (cb, nome = 'J2.jpg') => {
  const b = Buffer.from(f.bytes(nome));
  cb(b);
  return b;
};
const jpegs = [
  ['truncado', () => f.bytes('J2.jpg').slice(0, -1)],
  [
    'sem JFIF',
    () => {
      const b = Buffer.from(f.bytes('J2.jpg')),
        o = marcador(b, 224);
      return Buffer.concat([b.subarray(0, o), b.subarray(o + 2 + b.readUInt16BE(o + 2))]);
    },
  ],
  ['thumbnail JFIF', () => jpegMut((b) => (b[marcador(b, 224) + 16] = 1))],
  ['segmento comprimento', () => jpegMut((b) => b.writeUInt16BE(65535, marcador(b, 219) + 2))],
  ['precisão 12', () => jpegMut((b) => (b[marcador(b, 192) + 4] = 12))],
  ['CMYK', () => jpegMut((b) => (b[marcador(b, 192) + 9] = 4))],
  ['lossless', () => jpegMut((b) => (b[marcador(b, 192) + 1] = 195))],
  ['aritmético', () => jpegMut((b) => (b[marcador(b, 192) + 1] = 201))],
  ['quantização zero', () => jpegMut((b) => (b[marcador(b, 219) + 5] = 0))],
  ['DHT sobresubscrito', () => jpegMut((b) => (b[marcador(b, 196) + 5] = 255))],
  ['componente inexistente SOS', () => jpegMut((b) => (b[marcador(b, 218) + 5] = 99))],
  [
    'SOS espectral baseline',
    () =>
      jpegMut((b) => {
        const o = marcador(b, 218),
          fim = o + 2 + b.readUInt16BE(o + 2);
        b[fim - 3] = 1;
      }),
  ],
  [
    'SOS progressivo inválido',
    () =>
      jpegMut((b) => {
        const o = marcador(b, 218),
          fim = o + 2 + b.readUInt16BE(o + 2);
        b[fim - 2] = 63;
      }, 'J3.jpg'),
  ],
  ['extra após EOI', () => Buffer.concat([f.bytes('J2.jpg'), Buffer.from([0])])],
  ...[225, 226, 254].map((c) => [
    'metadado ' + c,
    () => {
      const b = f.bytes('J2.jpg');
      return Buffer.concat([b.slice(0, 2), seg(c, Buffer.from('SINTETICO')), b.slice(2)]);
    },
  ]),
];
for (const [n, fn] of jpegs)
  test('JPEG estrutural, com hash atualizado: ' + n, async () =>
    recusa(
      await analisar(new Uint8Array(fn()), 'image/jpeg', 16, 16),
      n.startsWith('metadado ')
        ? 'METADADO_NAO_PERMITIDO'
        : ['sem JFIF', 'thumbnail JFIF', 'precisão 12', 'CMYK', 'lossless', 'aritmético'].includes(
              n
            )
          ? 'VARIANTE_RECURSO_NAO_SUPORTADA'
          : 'ESTRUTURA_RECURSO_INVALIDA'
    )
  );
test('integridade: ausência, extras, repetição, tamanho, MIME, dimensões e alias divergente', async () => {
  const { m, bins } = f.vetor(1);
  recusa(await api.analisarContratoVisual(f.encode(m), []));
  recusa(await api.analisarContratoVisual(f.encode(m), [...bins, f.bytes('B.png')]));
  recusa(await api.analisarContratoVisual(f.encode(m), [bins[0], bins[0]]));
  const alterado = bins[0].slice();
  alterado[44] ^= 1;
  recusa(await api.analisarContratoVisual(f.encode(m), [alterado]));
  for (const [k, v] of [
    ['bytes', 73],
    ['largura', 2],
    ['altura', 2],
  ]) {
    const x = structuredClone(m);
    x.recursos.ponto[k] = v;
    recusa(await api.analisarContratoVisual(f.encode(x), bins));
  }
  const x = structuredClone(m);
  x.recursos.ponto.mime = 'image/jpeg';
  x.capacidades = x.capacidades.map((c) =>
    c.id === 'raster-png' ? { id: 'raster-jpeg', versao: 1 } : c
  );
  recusa(await api.analisarContratoVisual(f.encode(x), bins));
  const a = structuredClone(m);
  a.recursos.alias = { ...a.recursos.ponto, largura: 2 };
  a.questoes[0].visuais.push(f.use('v2', 'alias'));
  recusa(await api.analisarContratoVisual(f.encode(a), bins));
  const orfao = structuredClone(m);
  orfao.recursos.alias = { ...orfao.recursos.ponto };
  recusa(await api.analisarContratoVisual(f.encode(orfao), bins));
});
test('binário individual: limite inclusivo e uma unidade acima', async () => {
  const raw = f.encode(f.base());
  const a = await api.analisarContratoVisual(raw, [new Uint8Array(8388608)]);
  recusa(a);
  assert.notEqual(a.erros[0].codigo, 'LIMITE_BYTES');
  const b = await api.analisarContratoVisual(raw, [new Uint8Array(8388609)]);
  recusa(b);
  assert.equal(b.erros[0].codigo, 'LIMITE_BYTES');
});
test('orçamento acumulado inclusivo, limite de buffers e SharedArrayBuffer', async () => {
  const raw = f.encode(f.base());
  let chamadas = 0;
  const vm = require('node:vm'),
    fs = require('node:fs'),
    path = require('node:path');
  const s = {
    module: { exports: {} },
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    crypto: {
      subtle: {
        digest: async () => {
          chamadas++;
          throw Error();
        },
      },
    },
  };
  vm.runInNewContext(
    fs.readFileSync(
      path.join(__dirname, '../../ambiente_interativo/js/lab-visual-analise.js'),
      'utf8'
    ),
    s
  );
  const oito = Array.from({ length: 8 }, () => new Uint8Array(8388608));
  const a = await s.module.exports.analisarContratoVisual(raw, oito);
  recusa(a);
  assert.equal(chamadas, 1);
  assert.equal(a.erros[0].codigo, 'FALHA_DIGEST');
  const b = await s.module.exports.analisarContratoVisual(raw, [...oito, new Uint8Array(1)]);
  recusa(b);
  assert.equal(b.erros[0].codigo, 'LIMITE_BYTES');
  assert.equal(chamadas, 1);
  recusa(await api.analisarContratoVisual(raw, Array(4097).fill(new Uint8Array())));
  recusa(
    await api.analisarContratoVisual(new Uint8Array(new globalThis.SharedArrayBuffer(10)), [])
  );
});
for (const [w, h, ok] of [
  [4096, 1024, true],
  [4097, 1, false],
  [2048, 2048, true],
  [2048, 2049, false],
])
  test(`dimensões ${w}x${h}`, async () => {
    const b = pngMut((a) => {
      a[0].d.writeUInt32BE(w);
      a[0].d.writeUInt32BE(h, 4);
    });
    const r = await analisar(new Uint8Array(b), 'image/png', w, h);
    if (ok) {
      assert.equal(r.status, 'analise-concluida');
      assert.equal(r.decodificacao, 'pendente');
    } else recusa(r);
  });
for (const n of [4096, 4097])
  test('registros PNG inclusivo: ' + n, async () => {
    const a = pngChunks(f.bytes('R.png')),
      idat = a[1];
    const b = montarPNG([
      a[0],
      idat,
      ...Array.from({ length: n - 3 }, () => ({ t: 'IDAT', d: Buffer.alloc(0) })),
      a[2],
    ]);
    const r = await analisar(new Uint8Array(b));
    if (n === 4096) assert.equal(r.status, 'analise-concluida');
    else {
      recusa(r);
      assert.equal(r.erros[0].codigo, 'LIMITE_REGISTROS');
    }
  });

for (const nome of Object.keys(f.hashes))
  test('todos os prefixos truncados: ' + nome, async () => {
    const b = f.bytes(nome),
      mime = nome.endsWith('.webp')
        ? 'image/webp'
        : nome.endsWith('.jpg')
          ? 'image/jpeg'
          : 'image/png',
      n = /^[RB]\.png$/.test(nome) ? 1 : 16;
    for (let i = 0; i < b.length; i++) recusa(await analisar(b.slice(0, i), mime, n, n));
  });
