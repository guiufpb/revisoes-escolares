'use strict';
// Construtor independente para corpus/adversariais; não é API de produção.
const zlib = require('node:zlib');
const f = require('./lab-visual-fixture.cjs');
function entradas(m, bins) {
  const ext = { 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg' };
  const descritores = new Map(Object.values(m.recursos).map((r) => [r.sha256, r]));
  return [
    { nome: 'lab-v3-zip-1/manifesto.json', bytes: f.encode(m) },
    ...bins.map((b) => {
      const h = f.hash(b);
      return {
        nome: `lab-v3-zip-1/recursos/${h}.${ext[descritores.get(h)?.mime] || 'png'}`,
        bytes: b,
      };
    }),
  ];
}
function construir(entradas, metodo = 0, reversoCentral = false) {
  let pos = 0;
  const locais = [],
    centrais = [];
  for (const e of entradas) {
    const bytes = Buffer.from(e.bytes),
      nome = Buffer.from(e.nome),
      comprimido = e.comprimido
        ? Buffer.from(e.comprimido)
        : metodo === 8
          ? zlib.deflateRawSync(bytes)
          : bytes;
    const local = Buffer.alloc(30 + nome.length),
      central = Buffer.alloc(46 + nome.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(metodo, 8);
    local.writeUInt16LE(0x21, 12);
    local.writeUInt32LE(zlib.crc32(bytes), 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(e.tamanho ?? bytes.length, 22);
    local.writeUInt16LE(nome.length, 26);
    nome.copy(local, 30);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(metodo, 10);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(zlib.crc32(bytes), 16);
    central.writeUInt32LE(comprimido.length, 20);
    central.writeUInt32LE(e.tamanho ?? bytes.length, 24);
    central.writeUInt16LE(nome.length, 28);
    central.writeUInt32LE(pos, 42);
    nome.copy(central, 46);
    locais.push(local, comprimido);
    centrais.push(central);
    pos += local.length + comprimido.length;
  }
  if (reversoCentral) centrais.reverse();
  const cd = Buffer.concat(centrais),
    fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(cd.length, 12);
  fim.writeUInt32LE(pos, 16);
  return Buffer.concat([...locais, cd, fim]);
}
function offsets(b) {
  const fim = b.length - 22,
    central = b.readUInt32LE(fim + 16),
    registros = [];
  for (let p = central; p < fim; p += 46 + b.readUInt16LE(p + 28))
    registros.push({ c: p, l: b.readUInt32LE(p + 42) });
  return { fim, central, registros };
}
function composto() {
  const x = f.vetor(3),
    m = x.m,
    c = m.questoes[0].visuais[0];
  c.apresentacao = 'agrupamento';
  c.elementos.push(f.use('v3', 'ponto'), f.use('v4', 'outro'));
  c.grupos = [
    { id: 'g2', rotulo: 'Segundo', elementoIds: ['v4', 'v2'] },
    { id: 'g1', rotulo: 'Primeiro', elementoIds: ['v3', 'v1'] },
  ];
  c.descricaoRelacao = 'Grupos intercalados.';
  m.recursos.alias = { ...m.recursos.ponto };
  m.questoes[0].itens[0].visuais = [f.use('vi', 'outro', true)];
  const a = m.questoes[0].itens[0].alternativas[0];
  delete a.texto;
  a.visuais = [f.use('va', 'alias', true)];
  m.questoes.push(
    {
      id: 'q2',
      tipo: 'campos',
      bloco: 'Escrever',
      titulo: 'Complete',
      instrucao: 'Escreva.',
      dica: 'Revise.',
      visuais: [],
      itens: [{ id: 'i2', pergunta: 'Escreva dois.', visuais: [], respostas: ['dois', '2'] }],
    },
    {
      id: 'q3',
      tipo: 'ditado',
      idioma: 'pt-BR',
      unidade: 'palavra',
      itens: [{ id: 'i3', texto: 'café' }],
    }
  );
  f.caps(m, 'agrupamento-visual', 'alternativas-visuais', 'questoes-campos', 'ditado');
  return x;
}
module.exports = { construir, entradas, offsets, composto };
