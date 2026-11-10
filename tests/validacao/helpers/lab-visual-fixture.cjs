'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const pasta = path.join(__dirname, '../fixtures/lab-visual-v3');
const hashes = require('../fixtures/lab-visual-v3/hashes.json');
const bytes = (nome) => new Uint8Array(fs.readFileSync(path.join(pasta, nome)));
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const encode = (m) => new Uint8Array(Buffer.from(JSON.stringify(m), 'utf8'));
const use = (id, recursoId, essencial = false) => ({
  id,
  tipo: 'imagem',
  recursoId,
  acessibilidade: essencial
    ? { tipo: 'essencial', descricao: 'Figura sintética.' }
    : { tipo: 'decorativa' },
});
function base() {
  return {
    formato: 'lab-questionarios-v3',
    id: 'vetor-v3',
    versao: 1,
    perfil: 'alice',
    materia: 'matematica',
    titulo: 'Somar',
    capacidades: [{ id: 'questoes-opcoes', versao: 1 }],
    recursos: {},
    questoes: [
      {
        id: 'q1',
        tipo: 'opcoes',
        bloco: 'Números',
        titulo: 'Uma soma',
        instrucao: 'Some e escolha.',
        dica: 'Conte com calma.',
        visuais: [],
        itens: [
          {
            id: 'i1',
            pergunta: 'Quanto é 1 + 1?',
            visuais: [],
            alternativas: [
              { id: 'a', texto: '2', visuais: [] },
              { id: 'b', texto: '3', visuais: [] },
            ],
            gabarito: { alternativaId: 'a' },
          },
        ],
      },
    ],
  };
}
function caps(m, ...nomes) {
  const ids = new Set([...m.capacidades.map((c) => c.id), ...nomes]);
  m.capacidades = [...ids].sort().map((id) => ({ id, versao: 1 }));
}
function recurso(m, id, b, mime = 'image/png', largura = 1, altura = 1) {
  m.recursos[id] = { mime, sha256: hash(b), bytes: b.length, largura, altura };
  caps(
    m,
    { 'image/png': 'raster-png', 'image/webp': 'raster-webp', 'image/jpeg': 'raster-jpeg' }[mime]
  );
}
function vetor(n) {
  const m = base(),
    bins = [];
  if (n >= 1) {
    bins.push(bytes('R.png'));
    recurso(m, 'ponto', bins[0]);
    m.questoes[0].visuais = [use('v1', 'ponto')];
  }
  if (n === 2) m.questoes[0].itens[0].gabarito.alternativaId = 'b';
  if (n >= 3) {
    bins.push(bytes('B.png'));
    recurso(m, 'outro', bins[1]);
    caps(m, 'conjuntos-visuais');
    const elementos = [use('v1', 'ponto'), use('v2', 'outro')];
    if (n === 4) elementos.reverse();
    m.questoes[0].visuais = [
      { id: 'c1', tipo: 'conjunto', apresentacao: 'sequencia', rotulo: 'Cores', elementos },
    ];
  }
  return { m, bins };
}
function raster(nome) {
  const b = bytes(nome),
    m = base(),
    mime = nome.endsWith('.webp')
      ? 'image/webp'
      : nome.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
  recurso(m, 'figura', b, mime, 16, 16);
  m.questoes[0].visuais = [use('v1', 'figura')];
  return { m, bins: [b] };
}
const digests = [
  '20368d6da140c3c3eb96def466fcf4c9591c3416e9c1ef1f5f94d85e247c859d',
  '8abdf589b8fe63e41f8708c0ad828ee3a2f6e37f6167051171ddd77e90a5a8ce',
  'f8321d6d6da9f13a979e95114c4765d41a4e617896d48e3b25a086e97fe3f574',
  'cc1469498a565ba28cd1547a43e3e5b5865a169572ebc843b8418b238260cbe6',
  'f2ca34421d70057b3fa43774364d79fb1ed4be48db447187ecd6c2a53f64b943',
];
module.exports = { base, vetor, raster, bytes, hash, hashes, encode, use, caps, recurso, digests };
