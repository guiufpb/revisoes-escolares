'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../../ambiente_interativo/js/lab-visual-analise.js');
const f = require('./helpers/lab-visual-fixture.cjs');
async function analisar(b, mime = 'image/jpeg') {
  const m = f.base();
  f.recurso(m, 'figura', new Uint8Array(b), mime, 16, 16);
  m.questoes[0].visuais = [f.use('v1', 'figura')];
  return api.analisarContratoVisual(f.encode(m), [new Uint8Array(b)]);
}
function sucesso(r) {
  assert.equal(r.status, 'analise-concluida', JSON.stringify(r));
  assert.equal(r.admissaoOperacional, false);
  assert.equal(r.decodificacao, 'pendente');
}
function recusa(r, codigo) {
  assert.equal(r.status, 'recusado');
  assert.ok(
    r.erros.some((e) => e.codigo === codigo),
    JSON.stringify(r)
  );
  assert.equal(r.admissaoOperacional, false);
  assert.equal('digestPacote' in r, false);
}
function tabela(b, id) {
  for (let i = 0; i < b.length - 4; i++)
    if (b[i] === 255 && b[i + 1] === 219 && (b[i + 4] & 15) === id)
      return Buffer.from(b.subarray(i, i + 2 + b.readUInt16BE(i + 2)));
  throw Error('fixture não contém DQT');
}
function inserir(b, t, offset) {
  return Buffer.concat([b.subarray(0, offset), t, b.subarray(offset)]);
}
const j3 = Buffer.from(f.bytes('J3.jpg'));
const sos1 = j3.indexOf(Buffer.from([255, 218])),
  sos2 = j3.indexOf(Buffer.from([255, 218]), sos1 + 2);
test('JPEG P2: todos os 64 coeficientes são protegidos, descritor re-hasheado', async () => {
  for (let i = 0; i < 64; i++) {
    const t = tabela(j3, 0);
    t[5 + i] = t[5 + i] === 1 ? 2 : 1;
    recusa(await analisar(inserir(j3, t, sos2)), 'QUANTIZACAO_PROGRESSIVA_ALTERADA');
  }
});
test('JPEG: destino compartilhado pelos componentes 2 e 3 também é protegido', async () => {
  const t = tabela(j3, 1);
  t[68] = t[68] === 1 ? 2 : 1;
  recusa(await analisar(inserir(j3, t, sos2)), 'QUANTIZACAO_PROGRESSIVA_ALTERADA');
});
test('JPEG: redefinições idênticas são permitidas para destinos individuais e compartilhados', async () => {
  for (const id of [0, 1]) sucesso(await analisar(inserir(j3, tabela(j3, id), sos2)));
});
test('JPEG: precisão também integra a definição, mesmo com coeficientes numéricos iguais', async () => {
  const original = tabela(j3, 0),
    t = Buffer.alloc(133);
  t[0] = 255;
  t[1] = 219;
  t.writeUInt16BE(131, 2);
  t[4] = 16;
  for (let i = 0; i < 64; i++) t.writeUInt16BE(original[5 + i], 5 + 2 * i);
  recusa(await analisar(inserir(j3, t, sos2)), 'QUANTIZACAO_PROGRESSIVA_ALTERADA');
});
test('JPEG: alteração antes do primeiro uso preservada; redefinição idêntica após uso', async () => {
  const t = tabela(j3, 0);
  t[5] = 1;
  const novo = inserir(j3, t, sos1);
  sucesso(await analisar(novo));
  sucesso(await analisar(inserir(novo, t, sos2 + t.length)));
});
test('JPEG: destino não vinculado a componentes iniciados pode ser redefinido', async () => {
  const a = tabela(j3, 0);
  a[4] = 2;
  const b = Buffer.from(a);
  b[5] = 1;
  sucesso(await analisar(inserir(j3, Buffer.concat([a, b]), sos2)));
});
test('JPEG baseline não adquire bloqueio de tabelas progressivas', async () => {
  const b = Buffer.from(f.bytes('J2.jpg')),
    t = tabela(b, 0);
  t[5] = 1;
  sucesso(await analisar(inserir(b, t, b.indexOf(Buffer.from([255, 218])))));
  sucesso(await analisar(inserir(b, t, b.length - 2)));
});
for (const nome of ['W2.webp', 'W3.webp', 'W5.webp'])
  test('VP8L: hint pode variar em ' + nome, async () => {
    const b = Buffer.from(f.bytes(nome));
    let o = 12;
    while (b.toString('ascii', o, o + 4) !== 'VP8L')
      o += 8 + b.readUInt32LE(o + 4) + (b.readUInt32LE(o + 4) % 2);
    b[o + 12] ^= 16;
    sucesso(await analisar(b, 'image/webp'));
  });
test('coleção com extras: recusa após enumerar nomes, sem materializar descritores extras', async () => {
  const a = [];
  let getters = 0;
  const descritores = [];
  for (let i = 0; i < 4097; i++)
    Object.defineProperty(a, 'extra' + i, {
      configurable: true,
      get() {
        getters++;
        throw Error('não executar');
      },
    });
  const p = new Proxy(a, {
    getOwnPropertyDescriptor(t, k) {
      descritores.push(k);
      return Reflect.getOwnPropertyDescriptor(t, k);
    },
  });
  const r = await api.analisarContratoVisual(f.encode(f.base()), p);
  recusa(r, 'ENTRADA_INVALIDA');
  assert.equal(getters, 0);
  assert.deepEqual(descritores, ['length']);
});
test('PNG positivo congelado possui as variantes anunciadas', () => {
  const esperados = [
    ['P1-paleta.png', null, 3, 0],
    ['P2-cinza.png', 8, 0, 0],
    ['P3-alpha.png', 8, 6, 0],
    ['P4-16bits.png', 16, 2, 0],
    ['P5-adam7.png', 8, 2, 1],
  ];
  for (const [n, bits, cor, interlace] of esperados) {
    const b = f.bytes(n);
    if (bits !== null) assert.equal(b[24], bits);
    assert.equal(b[25], cor);
    assert.equal(b[28], interlace);
    assert.equal(f.hash(b), f.hashes[n].sha256);
  }
});
