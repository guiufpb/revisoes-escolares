/* global TextEncoder, TextDecoder, DecompressionStream */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const logico = require('../../../ambiente_interativo/js/lab-visual-analise.js');
const f = require('./lab-visual-fixture.cjs');
const z = require('./lab-visual-zip-fixture.cjs');
const core = fs.readFileSync(
  path.join(__dirname, '../../../ambiente_interativo/js/lab-visual-zip-nucleo.js'),
  'utf8'
);
const defer = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};
function carregar(opcoes = {}) {
  const urls = new Map(),
    stats = {
      calls: 0,
      criadas: 0,
      revogadas: 0,
      decode: 0,
      ativas: 0,
      pico: 0,
      imgs: [],
      blobs: [],
    };
  class BlobTeste {
    constructor(partes, opts) {
      if (opcoes.blobThrow) throw Error('segredo-blob');
      this.bytes = Buffer.from(partes[0]);
      this.type = opts.type;
      stats.blobs.push(this);
    }
  }
  class Imagem {
    constructor() {
      this.listeners = new Map();
      stats.imgs.push(this);
    }
    addEventListener(n, fn) {
      this.listeners.set(n, fn);
    }
    removeEventListener(n, fn) {
      if (this.listeners.get(n) === fn) this.listeners.delete(n);
    }
    removeAttribute(n) {
      if (n === 'src') this.src = '';
    }
    remove() {
      this.removida = true;
    }
    dispatch(n) {
      this.listeners.get(n)?.();
    }
    async decode() {
      const b = urls.get(this.src).bytes;
      stats.decode++;
      stats.ativas++;
      stats.pico = Math.max(stats.pico, stats.ativas);
      try {
        if (opcoes.decode) await opcoes.decode(this, stats.decode);
        this.naturalWidth =
          opcoes.width ?? (b.toString('ascii', 1, 4) === 'PNG' ? b.readUInt32BE(16) : 16);
        this.naturalHeight =
          opcoes.height ?? (b.toString('ascii', 1, 4) === 'PNG' ? b.readUInt32BE(20) : 16);
      } finally {
        stats.ativas--;
      }
    }
  }
  const sandbox = {
    module: { exports: {} },
    require: (nome) => {
      if (nome !== './lab-visual-analise.js') throw Error('import inesperado');
      return {
        analisarContratoVisual: (...args) => {
          stats.calls++;
          return logico.analisarContratoVisual(...args);
        },
      };
    },
    Uint8Array,
    ArrayBuffer,
    TextEncoder,
    TextDecoder,
    DecompressionStream,
    crypto: globalThis.crypto,
    Blob: BlobTeste,
    HTMLImageElement: Imagem,
    createImageBitmap: async (blob) => {
      if (opcoes.bitmap) await opcoes.bitmap();
      if (opcoes.bitmapThrow) throw Error('segredo-bitmap');
      const b = blob.bytes,
        png = b.toString('ascii', 1, 4) === 'PNG';
      stats.bitmaps = (stats.bitmaps || 0) + 1;
      return {
        width: opcoes.bitmapWidth ?? (png ? b.readUInt32BE(16) : 16),
        height: png ? b.readUInt32BE(20) : 16,
        close() {
          stats.fechados = (stats.fechados || 0) + 1;
        },
      };
    },
    document: {
      createElement: (n) => {
        if (n !== 'img' || opcoes.createThrow) throw Error('segredo-elemento');
        return new Imagem();
      },
    },
    URL: {
      createObjectURL: (blob) => {
        if (opcoes.urlThrow) throw Error('segredo-url');
        const url = 'blob:teste/' + ++stats.criadas;
        urls.set(url, blob);
        return url;
      },
      revokeObjectURL: (url) => {
        if (!urls.delete(url)) throw Error('revogação duplicada');
        stats.revogadas++;
      },
    },
  };
  if (opcoes.semRuntime) delete sandbox.document;
  vm.runInNewContext(core, sandbox);
  return { api: sandbox.module.exports, stats, urls, sandbox };
}
function png(w, h, invalido = false) {
  const chunk = (t, data) => {
    const b = Buffer.alloc(data.length + 12);
    b.writeUInt32BE(data.length);
    b.write(t, 4);
    b.set(data, 8);
    b.writeUInt32BE(zlib.crc32(b.subarray(4, -4)), b.length - 4);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const data = invalido
    ? Buffer.from([0x78, 0x9c, 0xff, 0xff, 0xff, 0xff])
    : zlib.deflateSync(Buffer.alloc((w * 4 + 1) * h));
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', data),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function pacotePNG(w = 1, h = 1, invalido = false) {
  const m = f.base(),
    b = png(w, h, invalido);
  f.recurso(m, 'figura', b, 'image/png', w, h);
  m.questoes[0].visuais = [f.use('v1', 'figura', true)];
  return z.construir(z.entradas(m, [b]));
}
function imagens(v, out = []) {
  if (v && typeof v === 'object') {
    if (v.tipo === 'imagem') out.push(v);
    else Object.values(v).forEach((x) => imagens(x, out));
  }
  return out;
}
module.exports = { carregar, defer, pacotePNG, png, imagens };
