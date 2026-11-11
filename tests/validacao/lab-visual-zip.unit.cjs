/* global Uint8Array, SharedArrayBuffer */
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { spawnSync } = require('node:child_process');
const f = require('./helpers/lab-visual-fixture.cjs');
const z = require('./helpers/lab-visual-zip-fixture.cjs');
const {
  analisarTransporteZipVisual: analisar,
} = require('../../ambiente_interativo/js/lab-visual-zip.js');
const { gerarZipVisual } = require('../../scripts/validacao/gerar-lab-visual-zip.cjs');
const dir = path.join(__dirname, 'fixtures/lab-visual-zip');
const indice = require('./fixtures/lab-visual-zip/hashes.json');
function recusa(r, codigo, origem = 'transporte') {
  assert.equal(r.status, 'recusado');
  assert.equal(r.admissaoOperacional, false);
  assert.equal(r.erros[0].codigo, codigo);
  assert.equal(r.erros[0].origem, origem);
  for (const key of ['manifesto', 'digestPacote', 'manifestoCanonico', 'zipBytes'])
    assert.ok(!(key in r));
  assert.ok(r.erros.length <= 20);
}
for (const [nome, esperado] of Object.entries(indice))
  test('ZIP congelado: ' + nome, async () => {
    const b = fs.readFileSync(path.join(dir, nome));
    assert.equal(f.hash(b), esperado.sha256);
    const r = await analisar(b);
    assert.equal(r.status, 'analise-concluida', JSON.stringify(r));
    assert.equal(r.digestPacote, esperado.digestPacote);
    assert.equal(r.admissaoOperacional, false);
    assert.equal(r.decodificacao, 'pendente');
  });
for (let i = 0; i < 5; i++)
  test('V' + i + ': gerador determinístico e identidade invariável', async () => {
    const x = f.vetor(i),
      a = await gerarZipVisual(f.encode(x.m), x.bins);
    assert.equal(a.digestPacote, f.digests[i]);
    assert.deepEqual(a.zipBytes, (await gerarZipVisual(f.encode(x.m), x.bins)).zipBytes);
    const list = z.entradas(x.m, x.bins).reverse();
    list.find((e) => e.nome.endsWith('manifesto.json')).bytes = Buffer.from(
      JSON.stringify(x.m, null, 2).replace(/</g, '\\u003c')
    );
    for (const metodo of [0, 8]) {
      const b = z.construir(list, metodo, true),
        o = z.offsets(b);
      for (const e of o.registros) {
        b.writeUInt16LE(0x5c21, e.c + 14);
        b.writeUInt16LE(0x5c21, e.l + 12);
      }
      assert.equal((await analisar(b)).digestPacote, f.digests[i]);
    }
  });
const base = () => {
  const x = f.vetor(1);
  return z.construir(z.entradas(x.m, x.bins));
};
const mudancas = [
  ['versao origem', 'ZIP_VERSAO_PROIBIDA', (b, o) => b.writeUInt16LE(0x0314, o.central + 4)],
  ['versao extracao', 'ZIP_VERSAO_PROIBIDA', (b, o) => b.writeUInt16LE(45, o.central + 6)],
  ['criptografia', 'ZIP_FLAGS_PROIBIDAS', (b, o) => b.writeUInt16LE(1, o.central + 8)],
  ['data descriptor', 'ZIP_FLAGS_PROIBIDAS', (b, o) => b.writeUInt16LE(8, o.central + 8)],
  ['flag reservada', 'ZIP_FLAGS_PROIBIDAS', (b, o) => b.writeUInt16LE(16, o.central + 8)],
  ['metodo desconhecido', 'ZIP_METODO_PROIBIDO', (b, o) => b.writeUInt16LE(9, o.central + 10)],
  ['data invalida', 'ZIP_DATA_INVALIDA', (b, o) => b.writeUInt16LE(0, o.central + 14)],
  ['hora invalida', 'ZIP_DATA_INVALIDA', (b, o) => b.writeUInt16LE(0xffff, o.central + 12)],
  ['extra central', 'ZIP_METADADOS_PROIBIDOS', (b, o) => b.writeUInt16LE(1, o.central + 30)],
  ['comentario entrada', 'ZIP_METADADOS_PROIBIDOS', (b, o) => b.writeUInt16LE(1, o.central + 32)],
  ['comentario final', 'ZIP_METADADOS_PROIBIDOS', (b, o) => b.writeUInt16LE(1, o.fim + 20)],
  ['multivolume', 'ZIP_MULTIVOLUME', (b, o) => b.writeUInt16LE(1, o.fim + 4)],
  ['disco entrada', 'ZIP_MULTIVOLUME', (b, o) => b.writeUInt16LE(1, o.central + 34)],
  ['atributo diretorio', 'ZIP_ATRIBUTOS_PROIBIDOS', (b, o) => b.writeUInt32LE(16, o.central + 38)],
  [
    'link simbolico',
    'ZIP_ATRIBUTOS_PROIBIDOS',
    (b, o) => b.writeUInt32LE(0xa1ff0000, o.central + 38),
  ],
  ['atributo interno', 'ZIP_ATRIBUTOS_PROIBIDOS', (b, o) => b.writeUInt16LE(1, o.central + 36)],
  ['zip64 final', 'ZIP64_PROIBIDO', (b, o) => b.writeUInt32LE(0xffffffff, o.fim + 12)],
  ['zip64 entrada', 'ZIP64_PROIBIDO', (b, o) => b.writeUInt32LE(0xffffffff, o.central + 24)],
  ['contagem divergente', 'ZIP_CONTAGEM_DIVERGENTE', (b, o) => b.writeUInt16LE(1, o.fim + 8)],
  ['contagem excessiva', 'ZIP_LIMITE_ENTRADAS', (b, o) => b.writeUInt16LE(4098, o.fim + 10)],
  ['limite central', 'ZIP_LIMITE_CENTRAL', (b, o) => b.writeUInt32LE(1048577, o.fim + 12)],
  ['offset central', 'ZIP_CENTRAL_INVALIDA', (b, o) => b.writeUInt32LE(1, o.fim + 16)],
  ['offset local', 'ZIP_INTERVALO_INVALIDO', (b, o) => b.writeUInt32LE(o.central, o.central + 42)],
  ['assinatura local', 'ZIP_LOCAL_INVALIDO', (b) => b.writeUInt32LE(0, 0)],
  ['nome local', 'ZIP_CABECALHOS_DIVERGENTES', (b) => (b[30] = 65)],
  ['extra local', 'ZIP_METADADOS_PROIBIDOS', (b) => b.writeUInt16LE(1, 28)],
  ['crc cabecalho', 'ZIP_CABECALHOS_DIVERGENTES', (b) => (b[14] ^= 1)],
  ['crc dados', 'ZIP_CRC_INVALIDO', (b) => (b[30 + b.readUInt16LE(26)] ^= 1)],
  ['nome longo', 'ZIP_NOME_INVALIDO', (b, o) => b.writeUInt16LE(97, o.central + 28)],
];
for (const [nome, codigo, mudar] of mudancas)
  test('recusa específica: ' + nome, async () => {
    const b = base();
    mudar(b, z.offsets(b));
    recusa(await analisar(b), codigo);
  });
for (const nome of [
  '../manifesto.json',
  '/lab-v3-zip-1/manifesto.json',
  'C:/manifesto.json',
  'lab-v3-zip-1\\manifesto.json',
  'lab-v3-zip-1/',
  'lab-v3-zip-1/Manifesto.json',
  '__MACOSX/arquivo',
  'README.txt',
  'lab-v3-zip-1/%2e%2e/manifesto.json',
  'lab-v3-zip-1/é.json',
  'lab-v3-zip-1/\0.json',
])
  test('caminho proibido: ' + JSON.stringify(nome), async () => {
    const b = z.construir([{ nome, bytes: Buffer.from('{}') }]);
    recusa(
      await analisar(b),
      /[^\x20-\x7e]/.test(nome) ? 'ZIP_NOME_INVALIDO' : 'ZIP_CAMINHO_PROIBIDO'
    );
  });
test('todas as truncagens do ZIP sintético recusadas', async () => {
  const b = base();
  for (let i = 0; i < b.length; i++) {
    const r = await analisar(b.subarray(0, i));
    assert.equal(r.status, 'recusado');
    assert.equal(r.admissaoOperacional, false);
  }
});
test('duplicatas, manifesto ausente, hash duplicado e extensão falsa', async () => {
  const x = f.vetor(1),
    es = z.entradas(x.m, x.bins);
  recusa(await analisar(z.construir([...es, es[0]])), 'ZIP_ENTRADA_DUPLICADA');
  recusa(await analisar(z.construir(es.slice(1))), 'ZIP_MANIFESTO_AUSENTE');
  recusa(
    await analisar(z.construir([...es, { ...es[1], nome: es[1].nome.replace('.png', '.jpg') }])),
    'ZIP_HASH_REPETIDO'
  );
  recusa(
    await analisar(z.construir([es[0], { ...es[1], nome: es[1].nome.replace('.png', '.jpg') }])),
    'ZIP_EXTENSAO_DIVERGENTE'
  );
  recusa(
    await analisar(
      z.construir([{ ...es[1], nome: es[1].nome.replace(/[a-f0-9]{64}/, '0'.repeat(64)) }, es[0]])
    ),
    'ZIP_HASH_DIVERGENTE'
  );
});
test('separação: transporte válido não valida JSON nem referências', async () => {
  const x = f.vetor(1),
    es = z.entradas(x.m, x.bins);
  recusa(
    await analisar(z.construir([{ ...es[0], bytes: Buffer.from('{"a":1,"a":2}') }])),
    'CHAVE_DUPLICADA',
    'contrato'
  );
  const r = await analisar(z.construir([es[0]]));
  assert.equal(r.status, 'recusado');
  assert.equal(r.erros[0].origem, 'contrato');
  const extra = z.entradas(f.vetor(0).m, []);
  extra.push(es[1]);
  recusa(await analisar(z.construir(extra)), 'RECURSO_EXTRA', 'contrato');
});
test('cobertura exata: prefixos, lacunas, sobreposição e bytes finais', async () => {
  const b = base();
  recusa(await analisar(Buffer.concat([b, Buffer.from([0])])), 'ZIP_FIM_INVALIDO');
  const p = Buffer.concat([Buffer.from([0]), b]),
    o = z.offsets(b);
  p.writeUInt32LE(o.central + 1, p.length - 6);
  for (const e of o.registros) p.writeUInt32LE(e.l + 1, e.c + 1 + 42);
  recusa(await analisar(p), 'ZIP_COBERTURA_INVALIDA');
  const c = base(),
    oc = z.offsets(c);
  c.writeUInt32LE(0, oc.registros[1].c + 42);
  const r = await analisar(c);
  assert.equal(r.status, 'recusado');
});
test('DEFLATE nativo: inválido, truncado, cauda no mesmo chunk e em chunk posterior', async () => {
  const x = f.vetor(0),
    es = z.entradas(x.m, []),
    valid = zlib.deflateRawSync(es[0].bytes);
  for (const comprimido of [
    Buffer.from([7, 255]),
    valid.subarray(0, -1),
    Buffer.concat([valid, Buffer.from([0])]),
  ])
    recusa(await analisar(z.construir([{ ...es[0], comprimido }], 8)), 'ZIP_DEFLATE_INVALIDO');
  const grande = Buffer.from('abc'.repeat(100000)),
    comp = zlib.deflateRawSync(grande, { level: 0 });
  recusa(
    await analisar(
      z.construir(
        [
          {
            ...es[0],
            bytes: grande,
            comprimido: Buffer.concat([comp, Buffer.from([0])]),
            tamanho: 262144,
          },
        ],
        8
      )
    ),
    'ZIP_SAIDA_EXCEDENTE'
  );
  const curto = Buffer.alloc(262144, 32),
    raw = zlib.deflateRawSync(curto, { level: 0 });
  recusa(
    await analisar(
      z.construir(
        [{ ...es[0], bytes: curto, comprimido: Buffer.concat([raw, Buffer.from([0])]) }],
        8
      )
    ),
    'ZIP_DEFLATE_INVALIDO'
  );
});
test('expansão interrompida, erro de tamanho e cancelamento sem rejeição não tratada', async () => {
  const x = f.vetor(0),
    es = z.entradas(x.m, []);
  recusa(
    await analisar(
      z.construir([{ ...es[0], bytes: Buffer.alloc(4 * 1024 * 1024), tamanho: 1024 }], 8)
    ),
    'ZIP_SAIDA_EXCEDENTE'
  );
  recusa(
    await analisar(z.construir([{ ...es[0], tamanho: es[0].bytes.length + 1 }], 8)),
    'ZIP_TAMANHO_DIVERGENTE'
  );
  const old = globalThis.DecompressionStream;
  let cancelou = 0,
    abortou = 0,
    escreveu = 0;
  globalThis.DecompressionStream = class {
    constructor(tipo) {
      const ds = new old(tipo);
      this.readable = {
        getReader() {
          const r = ds.readable.getReader();
          return {
            read: () => r.read(),
            cancel: () => {
              cancelou++;
              return r.cancel();
            },
            releaseLock: () => r.releaseLock(),
          };
        },
      };
      this.writable = {
        getWriter() {
          const w = ds.writable.getWriter();
          return {
            write: (b) => {
              escreveu++;
              return w.write(b);
            },
            close: () => w.close(),
            abort: () => {
              abortou++;
              return w.abort();
            },
            releaseLock: () => w.releaseLock(),
          };
        },
      };
    }
  };
  try {
    recusa(
      await analisar(z.construir([{ ...es[0], bytes: Buffer.alloc(1048576), tamanho: 1 }], 8)),
      'ZIP_SAIDA_EXCEDENTE'
    );
  } finally {
    globalThis.DecompressionStream = old;
  }
  assert.ok(cancelou && abortou && escreveu);
});
test('método 0 independente do descompressor', async () => {
  const old = globalThis.DecompressionStream;
  globalThis.DecompressionStream = undefined;
  try {
    assert.equal((await analisar(base())).status, 'analise-concluida');
    const x = f.vetor(0);
    recusa(await analisar(z.construir(z.entradas(x.m, []), 8)), 'ZIP_DEFLATE_INDISPONIVEL');
  } finally {
    globalThis.DecompressionStream = old;
  }
});
test('fronteiras de manifesto e total físico', async () => {
  const es = z.entradas(f.vetor(0).m, []),
    json = es[0].bytes;
  for (const metodo of [0, 8]) {
    const bytes = Buffer.concat([json, Buffer.alloc(262144 - json.length, 32)]);
    assert.equal(
      (await analisar(z.construir([{ ...es[0], bytes }], metodo))).digestPacote,
      f.digests[0]
    );
    recusa(
      await analisar(
        z.construir([{ ...es[0], bytes: Buffer.concat([bytes, Buffer.from(' ')]) }], metodo)
      ),
      'ZIP_LIMITE_ENTRADA'
    );
  }
  recusa(await analisar(new Uint8Array(71303169)), 'ZIP_LIMITE_BYTES');
  recusa(await analisar(new Uint8Array(71303168)), 'ZIP_FIM_INVALIDO');
});
test('limites individual e agregado antes de qualquer descompressão', async () => {
  const es = z.entradas(f.vetor(0).m, []),
    nome = (i) => `lab-v3-zip-1/recursos/${i.toString(16).padStart(64, '0')}.png`;
  const falso = (i, n) => ({
    nome: nome(i),
    bytes: Buffer.alloc(0),
    comprimido: Buffer.from([3, 0]),
    tamanho: n,
  });
  recusa(await analisar(z.construir([...es, falso(1, 8388609)], 8)), 'ZIP_LIMITE_ENTRADA');
  // Exato passa a triagem de orçamento e falha no fluxo; +1 falha antes da extração.
  recusa(await analisar(z.construir([...es, falso(1, 8388608)], 8)), 'ZIP_TAMANHO_DIVERGENTE');
  const oito = Array.from({ length: 8 }, (_, i) => falso(i + 1, 8388608));
  recusa(await analisar(z.construir([...es, ...oito], 8)), 'ZIP_TAMANHO_DIVERGENTE');
  recusa(await analisar(z.construir([...es, ...oito, falso(9, 1)], 8)), 'ZIP_LIMITE_EXTRAIDO');
});
test('fronteiras alcançáveis e limites dominados sem bypass', async () => {
  const es = z.entradas(f.vetor(0).m, []);
  const itens = Array.from({ length: 4096 }, (_, i) => ({
    nome: `lab-v3-zip-1/recursos/${i.toString(16).padStart(64, '0')}.png`,
    bytes: Buffer.alloc(0),
  }));
  recusa(await analisar(z.construir([...es, ...itens])), 'ZIP_HASH_DIVERGENTE');
  recusa(await analisar(z.construir([...es, ...itens, itens[0]])), 'ZIP_LIMITE_ENTRADAS');
  for (const n of [96, 97])
    recusa(
      await analisar(z.construir([{ nome: 'a'.repeat(n), bytes: Buffer.alloc(0) }])),
      n === 96 ? 'ZIP_CAMINHO_PROIBIDO' : 'ZIP_NOME_INVALIDO'
    );
  for (const n of [1048576, 1048577]) {
    const b = base(),
      o = z.offsets(b);
    b.writeUInt32LE(n, o.fim + 12);
    recusa(await analisar(b), n === 1048576 ? 'ZIP_CENTRAL_INVALIDA' : 'ZIP_LIMITE_CENTRAL');
  }
  // Caminhos fechados/contagem limitam metadados antes de 2 MiB e o total extraído
  // a manifesto + 64 MiB. Tetos dominados não ganham parâmetros especiais de teste.
});
test('datas reais, flags UTF-8 e atributos comuns admitidos', async () => {
  const b = base(),
    o = z.offsets(b);
  for (const e of o.registros) {
    b.writeUInt16LE(0x0800, e.c + 8);
    b.writeUInt16LE(0x0800, e.l + 6);
    b.writeUInt32LE(32, e.c + 38);
  }
  assert.equal((await analisar(b)).digestPacote, f.digests[1]);
  // 2100 não é bissexto no calendário gregoriano.
  const data = ((2100 - 1980) << 9) | (2 << 5) | 29;
  for (const e of o.registros) {
    b.writeUInt16LE(data, e.c + 14);
    b.writeUInt16LE(data, e.l + 12);
  }
  recusa(await analisar(b), 'ZIP_DATA_INVALIDA');
});
test('manifesto heterogêneo preserva usos, ordem e referências compartilhadas', async () => {
  const x = z.composto(),
    b = z.construir(z.entradas(x.m, x.bins), 8),
    r = await analisar(b);
  assert.equal(r.status, 'analise-concluida');
  assert.deepEqual(r.manifesto, x.m);
  assert.equal(r.resumoRecursos.length, 2);
  assert.equal(r.transporte.entradas, 3);
  for (const apresentacao of ['comparacao', 'sequencia', 'grade']) {
    const v = f.vetor(3);
    v.m.questoes[0].visuais[0].apresentacao = apresentacao;
    const a = await analisar(z.construir(z.entradas(v.m, v.bins)));
    assert.equal(a.status, 'analise-concluida');
    assert.deepEqual(a.manifesto, v.m);
  }
});
test('faltas criptográficas e coleções de entrada rejeitadas sem getters', async () => {
  const prop = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  try {
    recusa(await analisar(base()), 'CRIPTO_INDISPONIVEL');
  } finally {
    Object.defineProperty(globalThis, 'crypto', prop);
  }
  const getter = {
    get byteLength() {
      throw new Error('não executar');
    },
  };
  recusa(await analisar(getter), 'ZIP_ENTRADA_INVALIDA');
  const detached = new Uint8Array(1);
  structuredClone(detached, { transfer: [detached.buffer] });
  recusa(await analisar(detached), 'ZIP_ENTRADA_INVALIDA');
});
test('snapshot defensivo, entradas hostis e argumentos extras', async () => {
  const b = base(),
    antes = f.hash(b),
    p = analisar(b);
  b.fill(0);
  assert.equal((await p).digestPacote, f.digests[1]);
  assert.notEqual(f.hash(b), antes);
  const original = base(),
    h = f.hash(original);
  await analisar(original);
  assert.equal(f.hash(original), h);
  for (const v of [
    null,
    {},
    [],
    new Uint8Array(new SharedArrayBuffer(1)),
    new Uint8Array(new ArrayBuffer(1, { maxByteLength: 2 })),
  ])
    recusa(await analisar(v), 'ZIP_ENTRADA_INVALIDA');
  recusa(await analisar(base(), {}), 'ZIP_ENTRADA_INVALIDA');
  const typed = base();
  Object.defineProperty(typed, 'constructor', {
    get() {
      throw new Error('nao executar');
    },
  });
  assert.equal((await analisar(typed)).digestPacote, f.digests[1]);
});
test('gerador deduplica, recusa contrato inválido e CLI não sobrescreve destino', async () => {
  const x = f.vetor(1);
  assert.equal(
    (await gerarZipVisual(f.encode(x.m), [...x.bins, ...x.bins])).digestPacote,
    f.digests[1]
  );
  await assert.rejects(gerarZipVisual(Buffer.from('{}'), []), /AUTORIA_CONTRATO_RECUSADO/);
  const pai = path.resolve('tmp/lab-v3-zip-2c/autoria');
  fs.mkdirSync(pai, { recursive: true });
  const temp = fs.mkdtempSync(path.join(pai, 'execucao-'));
  const m = path.join(temp, 'manifesto.json'),
    out = path.join(temp, 'saida.zip');
  fs.writeFileSync(m, f.encode(f.vetor(0).m));
  const cli = path.resolve('scripts/validacao/gerar-lab-visual-zip.cjs');
  assert.equal(spawnSync(process.execPath, [cli, m, out]).status, 0);
  const produzido = await analisar(fs.readFileSync(out));
  assert.equal(produzido.status, 'analise-concluida');
  assert.equal(produzido.digestPacote, f.digests[0]);
  const h = f.hash(fs.readFileSync(out));
  assert.equal(spawnSync(process.execPath, [cli, m, out]).status, 1);
  assert.equal(f.hash(fs.readFileSync(out)), h);
  assert.deepEqual(fs.readdirSync(temp).sort(), ['manifesto.json', 'saida.zip']);
});
test('isolamento por dependências: somente analisador, sem registro operacional', () => {
  const src = fs.readFileSync(path.resolve('ambiente_interativo/js/lab-visual-zip.js'), 'utf8');
  assert.deepEqual(
    [...src.matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]),
    ['./lab-visual-zip-nucleo.js']
  );
  const core = fs.readFileSync(
    path.resolve('ambiente_interativo/js/lab-visual-zip-nucleo.js'),
    'utf8'
  );
  assert.deepEqual(
    [...core.matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]),
    ['./lab-visual-analise.js']
  );
  assert.doesNotMatch(
    fs.readFileSync(path.resolve('ambiente_interativo/js/app.entry.js'), 'utf8'),
    /lab-visual-zip/
  );
  assert.deepEqual(Object.keys(require('../../ambiente_interativo/js/lab-visual-zip.js')), [
    'analisarTransporteZipVisual',
  ]);
});
