function auditarPosicoesGabarito(posicoes) {
  const sequencia = posicoes.filter((posicao) => Number.isInteger(posicao) && posicao >= 0);
  const problemas = [];

  for (let inicio = 0; inicio <= sequencia.length - 4; inicio += 1) {
    const trecho = sequencia.slice(inicio, inicio + 4);
    if (trecho.every((posicao) => posicao === trecho[0])) {
      problemas.push(`quatro respostas consecutivas na posição ${trecho[0]}`);
      break;
    }
  }

  for (let inicio = 0; inicio <= sequencia.length - 6; inicio += 1) {
    const trecho = sequencia.slice(inicio, inicio + 6);
    if (
      trecho[0] !== trecho[1] &&
      trecho.every((posicao, indice) => posicao === trecho[indice % 2])
    ) {
      problemas.push(`alternância perfeita prolongada entre ${trecho[0]} e ${trecho[1]}`);
      break;
    }
  }

  if (sequencia.length >= 8) {
    const frequencias = new Map();
    for (const posicao of sequencia) {
      frequencias.set(posicao, (frequencias.get(posicao) || 0) + 1);
    }
    const maior = Math.max(...frequencias.values());
    if (maior / sequencia.length >= 0.75) {
      problemas.push('concentração extrema em uma única posição');
    }
  }

  return problemas;
}

module.exports = { auditarPosicoesGabarito };
