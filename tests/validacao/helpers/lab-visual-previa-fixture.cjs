'use strict';
const z = require('./lab-visual-zip-fixture.cjs');
function canarios() {
  const x = z.composto(),
    m = x.m;
  m.id = 'admincanario';
  m.titulo = 'TituloAdministrativoCanario';
  m.questoes[0].instrucao = '<b>3 < 7 e 9 > 4 &lt;</b>';
  m.questoes[0].itens[0].alternativas[0].texto = 'Alternativa legítima';
  m.questoes[1].itens[0].respostas = ['RespostaSecretaCanario'];
  m.questoes[2].itens[0].texto = 'AlvoSecretoCanario';
  const ids = new Map();
  function visitar(v) {
    if (!v || typeof v !== 'object') return;
    if (typeof v.id === 'string') {
      ids.set(v.id, 'orig-' + v.id);
      v.id = 'orig-' + v.id;
    }
    for (const x of Object.values(v)) visitar(x);
  }
  visitar(m.questoes);
  m.questoes[0].itens[0].gabarito.alternativaId = ids.get('a');
  for (const g of m.questoes[0].visuais[0].grupos)
    g.elementoIds = g.elementoIds.map((e) => ids.get(e));
  return x;
}
function zip(x, metodo = 0) {
  return z.construir(z.entradas(x.m, x.bins), metodo);
}
module.exports = { canarios, zip };
