'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const fonte = fs.readFileSync(
  path.resolve('scripts/validacao/lab-visual-zip-publicacao.cjs'),
  'utf8'
);
function ambiente(falha, opcoes = {}) {
  const destino = path.resolve('saida-sintetica.zip'),
    pasta = path.join(path.dirname(destino), '.lab-v3-zip-sintetico');
  const temporario = path.join(pasta, 'pacote.tmp'),
    arquivos = new Map();
  const original = Object.assign(new Error('falha sintética'), { code: 'EIO' });
  let diretorio = false,
    fechado = false,
    links = 0,
    unlinks = 0,
    consultasPasta = 0;
  const antigo = Buffer.from('preexistente');
  if (opcoes.preexistente) arquivos.set(destino, { ino: 9n, bytes: antigo });
  const stat = (ino, dir = false) => ({ dev: 1n, ino, isFile: () => !dir, isDirectory: () => dir });
  const mock = {
    mkdtemp: async () => {
      if (falha === 'mkdtemp') throw original;
      diretorio = true;
      return pasta;
    },
    open: async (_p, flag) => {
      assert.equal(flag, 'wx');
      if (falha === 'open') throw original;
      arquivos.set(temporario, { ino: 2n, bytes: Buffer.alloc(0) });
      return {
        stat: async () => {
          if (falha === 'stat') throw original;
          return stat(2n);
        },
        writeFile: async (b) => {
          arquivos.get(temporario).bytes = Buffer.from(falha === 'write' ? b.subarray(0, 3) : b);
          if (falha === 'write') throw original;
        },
        sync: async () => {
          if (falha === 'sync') throw original;
        },
        close: async () => {
          if (falha === 'close') throw original;
          fechado = true;
        },
      };
    },
    link: async (_p, final) => {
      assert.ok(fechado);
      links++;
      if (opcoes.corrida) arquivos.set(final, { ino: 9n, bytes: antigo });
      if (falha === 'link') throw original;
      if (arquivos.has(final)) throw Object.assign(new Error('existe'), { code: 'EEXIST' });
      arquivos.set(final, arquivos.get(temporario));
    },
    lstat: async (p) => {
      if (p === pasta)
        return stat(opcoes.pastaSubstituida && consultasPasta++ > 0 ? 99n : 1n, true);
      if (!arquivos.has(p)) throw Object.assign(new Error('ausente'), { code: 'ENOENT' });
      return stat(opcoes.substituido ? 99n : arquivos.get(p).ino);
    },
    unlink: async (p) => {
      assert.equal(p, temporario);
      unlinks++;
      if (opcoes.limpezaFalha) throw Object.assign(new Error('limpeza'), { code: 'EACCES' });
      arquivos.delete(p);
    },
    rmdir: async (p) => {
      assert.equal(p, pasta);
      if (arquivos.has(temporario))
        throw Object.assign(new Error('não vazio'), { code: 'ENOTEMPTY' });
      diretorio = false;
    },
  };
  const modulo = { exports: {} };
  vm.runInNewContext(fonte, {
    module: modulo,
    require: (id) => (id === 'node:fs/promises' ? mock : require(id)),
  });
  return {
    publicar: modulo.exports.publicarZipExclusivo,
    destino,
    temporario,
    arquivos,
    original,
    estado: () => ({ diretorio, fechado, links, unlinks }),
  };
}
test('publicação só ocorre após escrita, sync e fechamento completos', async () => {
  const a = ambiente(),
    b = Buffer.from('ZIP completo');
  await a.publicar(a.destino, b);
  assert.deepEqual(a.arquivos.get(a.destino).bytes, b);
  assert.equal(a.arquivos.has(a.temporario), false);
  assert.equal(a.estado().diretorio, false);
});
for (const etapa of ['mkdtemp', 'open', 'write', 'sync', 'close', 'link'])
  test('falha controlada: ' + etapa + ' não publica arquivo incompleto', async () => {
    const a = ambiente(etapa);
    await assert.rejects(
      a.publicar(a.destino, Buffer.from('ZIP completo')),
      (e) => e === a.original && !e.publicado
    );
    assert.equal(a.arquivos.has(a.destino), false);
    assert.equal(a.arquivos.has(a.temporario), false);
  });
for (const opcoes of [{ preexistente: true }, { corrida: true }])
  test(
    'destino preexistente ou criado durante publicação é preservado: ' + JSON.stringify(opcoes),
    async () => {
      const a = ambiente(null, opcoes);
      await assert.rejects(a.publicar(a.destino, Buffer.from('novo')), (e) => e.code === 'EEXIST');
      assert.equal(a.arquivos.get(a.destino).bytes.toString(), 'preexistente');
      assert.equal(a.arquivos.has(a.temporario), false);
    }
  );
test('erro original e falhas adicionais de limpeza são preservados', async () => {
  const a = ambiente('write', { limpezaFalha: true });
  await assert.rejects(
    a.publicar(a.destino, Buffer.from('ZIP')),
    (e) => e === a.original && e.falhasLimpeza.length === 2 && e.falhasLimpeza[0].code === 'EACCES'
  );
  assert.equal(a.arquivos.has(a.destino), false);
  assert.equal(a.arquivos.has(a.temporario), true);
});
test('resíduo sem identidade conhecida não é apagado', async () => {
  const a = ambiente('stat');
  await assert.rejects(
    a.publicar(a.destino, Buffer.from('ZIP')),
    (e) => e === a.original && e.falhasLimpeza.length > 0
  );
  assert.equal(a.estado().unlinks, 0);
  assert.equal(a.arquivos.has(a.temporario), true);
});
test('resíduo substituído não é apagado', async () => {
  const a = ambiente('write', { substituido: true });
  await assert.rejects(
    a.publicar(a.destino, Buffer.from('ZIP')),
    (e) => e === a.original && e.falhasLimpeza.length > 0
  );
  assert.equal(a.estado().unlinks, 0);
});
test('diretório substituído não é removido', async () => {
  const a = ambiente('write', { pastaSubstituida: true });
  await assert.rejects(
    a.publicar(a.destino, Buffer.from('ZIP')),
    (e) => e === a.original && e.falhasLimpeza.length > 0
  );
  assert.equal(a.estado().diretorio, true);
  assert.equal(a.arquivos.has(a.destino), false);
});
test('falha de limpeza após publicação informa que o destino completo já existe', async () => {
  const a = ambiente(null, { limpezaFalha: true });
  await assert.rejects(
    a.publicar(a.destino, Buffer.from('ZIP completo')),
    (e) => e.publicado && e.falhasLimpeza.length > 0
  );
  assert.equal(a.arquivos.get(a.destino).bytes.toString(), 'ZIP completo');
});
