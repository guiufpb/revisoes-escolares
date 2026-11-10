'use strict';
// Autoria local explícita. Não faz parte da API ou do fluxo escolar.
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const { crc32 } = require('node:zlib');
const { analisarContratoVisual } = require('../../ambiente_interativo/js/lab-visual-analise.js');
const { analisarTransporteZipVisual } = require('../../ambiente_interativo/js/lab-visual-zip.js');
const { publicarZipExclusivo } = require('./lab-visual-zip-publicacao.cjs');
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const erro = (codigo) => {
  throw new Error(codigo);
};
async function gerarZipVisual(manifestoUTF8, recursosBinarios) {
  if (
    !(manifestoUTF8 instanceof Uint8Array) ||
    manifestoUTF8.length > 262144 ||
    !Array.isArray(recursosBinarios) ||
    recursosBinarios.length > 4096
  )
    erro('AUTORIA_ENTRADA_INVALIDA');
  // Ferramenta Node para autoria confiável; não aceita objetos de pacotes como opções.
  const manifesto = new Uint8Array(manifestoUTF8),
    mapa = new Map();
  let total = 0;
  for (const b of recursosBinarios) {
    if (!(b instanceof Uint8Array) || b.length > 8388608) erro('AUTORIA_ENTRADA_INVALIDA');
    total += b.length;
    if (total > 67108864) erro('AUTORIA_LIMITE_BYTES');
    const copia = new Uint8Array(b);
    mapa.set(hash(copia), copia);
  }
  const r = await analisarContratoVisual(manifesto, [...mapa.values()]);
  if (r.status !== 'analise-concluida') erro('AUTORIA_CONTRATO_RECUSADO');
  const ext = { 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg' };
  const entradas = [{ nome: 'lab-v3-zip-1/manifesto.json', bytes: manifesto }];
  for (const x of r.resumoRecursos)
    entradas.push({
      nome: `lab-v3-zip-1/recursos/${x.sha256}.${ext[x.mime]}`,
      bytes: mapa.get(x.sha256),
    });
  const locais = [],
    centrais = [];
  let offset = 0;
  for (const e of entradas) {
    const nome = Buffer.from(e.nome, 'ascii'),
      crc = crc32(e.bytes);
    const local = Buffer.alloc(30 + nome.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x21, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(e.bytes.length, 18);
    local.writeUInt32LE(e.bytes.length, 22);
    local.writeUInt16LE(nome.length, 26);
    nome.copy(local, 30);
    const central = Buffer.alloc(46 + nome.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(e.bytes.length, 20);
    central.writeUInt32LE(e.bytes.length, 24);
    central.writeUInt16LE(nome.length, 28);
    central.writeUInt32LE(offset, 42);
    nome.copy(central, 46);
    locais.push(local, e.bytes);
    centrais.push(central);
    offset += local.length + e.bytes.length;
  }
  const tamanhoCentral = centrais.reduce((n, b) => n + b.length, 0),
    fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(tamanhoCentral, 12);
  fim.writeUInt32LE(offset, 16);
  const zipBytes = Buffer.concat([...locais, ...centrais, fim]);
  const reaberto = await analisarTransporteZipVisual(zipBytes);
  if (reaberto.status !== 'analise-concluida' || reaberto.digestPacote !== r.digestPacote)
    erro('AUTORIA_REABERTURA_RECUSADA');
  return { zipBytes, digestPacote: r.digestPacote, admissaoOperacional: false };
}
async function lerLimitado(caminho, max) {
  const h = await fs.open(caminho, 'r');
  try {
    const s = await h.stat();
    if (!s.isFile() || s.size > max) erro('AUTORIA_ARQUIVO_INVALIDO');
    const b = Buffer.alloc(s.size + 1);
    let pos = 0;
    while (pos < b.length) {
      const { bytesRead } = await h.read(b, pos, b.length - pos, null);
      if (!bytesRead) break;
      pos += bytesRead;
    }
    if (pos !== s.size) erro('AUTORIA_ARQUIVO_ALTERADO');
    return b.subarray(0, pos);
  } finally {
    await h.close();
  }
}
async function main() {
  const [manifesto, destino, ...recursos] = process.argv.slice(2);
  if (!manifesto || !destino || recursos.length > 4096) erro('AUTORIA_ARGUMENTOS_INVALIDOS');
  const m = await lerLimitado(manifesto, 262144),
    bins = [];
  let total = 0;
  for (const p of recursos) {
    const b = await lerLimitado(p, Math.min(8388608, 67108864 - total));
    total += b.length;
    bins.push(b);
  }
  const r = await gerarZipVisual(m, bins);
  await publicarZipExclusivo(destino, r.zipBytes);
  console.log(
    JSON.stringify({
      digestPacote: r.digestPacote,
      bytes: r.zipBytes.length,
      admissaoOperacional: false,
    })
  );
}
if (require.main === module)
  main().catch((e) => {
    console.error('AUTORIA_RECUSADA: confira manifesto, recursos e destino inexistente.');
    if (typeof e.code === 'string' && /^[A-Z0-9_]+$/.test(e.code))
      console.error('AUTORIA_CAUSA: ' + e.code);
    if (e.publicado)
      console.error('AUTORIA_PUBLICADA: o ZIP completo foi publicado, mas a limpeza falhou.');
    if (e.falhasLimpeza?.length)
      console.error(
        'AUTORIA_LIMPEZA_FALHOU: confira os resíduos temporários; nenhum destino foi removido.'
      );
    process.exitCode = 1;
  });
module.exports = { gerarZipVisual };
