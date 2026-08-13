(function () {
  'use strict';

  var ORDENS = ['M', 'C', 'D', 'U'];
  var VALORES = { U: 1, D: 10, C: 100, M: 1000 };
  var NOMES = { U: 'unidades', D: 'dezenas', C: 'centenas', M: 'milhares' };
  var LIMITES = { U: 40, D: 20, C: 12, M: 2 };

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function inteiro(valor, minimo, maximo, padrao) {
    var numero = Math.trunc(Number(valor));
    if (!Number.isFinite(numero)) return padrao;
    return Math.max(minimo, Math.min(maximo, numero));
  }

  function ordensAtivas(configuracao) {
    var informadas = Array.isArray(configuracao && configuracao.ordens)
      ? configuracao.ordens
      : String((configuracao && configuracao.ordens) || 'C-D-U').split('-');
    var conjunto = informadas.reduce(function (resultado, ordem) {
      var normalizada = String(ordem).toUpperCase();
      if (VALORES[normalizada]) resultado[normalizada] = true;
      return resultado;
    }, {});
    var ativas = ORDENS.filter(function (ordem) {
      return conjunto[ordem];
    });
    return ativas.length ? ativas : ['U'];
  }

  function normalizarQuantidades(valor, configuracao) {
    var entrada = objeto(valor);
    var limites = Object.assign({}, LIMITES, objeto(configuracao && configuracao.limites));
    return ORDENS.reduce(function (resultado, ordem) {
      resultado[ordem] = inteiro(entrada[ordem], 0, inteiro(limites[ordem], 0, 100, 20), 0);
      return resultado;
    }, {});
  }

  function copiarEstado(estado) {
    return JSON.parse(JSON.stringify(estado));
  }

  function estadoInicial(configuracao) {
    var inicial = objeto(configuracao && configuracao.inicial);
    return {
      versao: 1,
      quantidades: normalizarQuantidades(inicial.quantidades || inicial, configuracao),
      respostas: {},
      itens: [],
      barras: {},
      dinheiro: {},
      resposta: null,
      concluida: false,
      tentativas: 0,
      dicas: 0,
    };
  }

  function normalizarMapaNumerico(valor, chaves, maximo) {
    var entrada = objeto(valor);
    return chaves.reduce(function (resultado, chave) {
      if (Object.prototype.hasOwnProperty.call(entrada, chave)) {
        resultado[chave] = inteiro(entrada[chave], 0, maximo, 0);
      }
      return resultado;
    }, {});
  }

  function normalizarEstado(valor, configuracao) {
    var base = estadoInicial(configuracao);
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return base;
    valor = objeto(valor);
    if (valor.versao != null && Number(valor.versao) !== 1) return base;
    if (Object.prototype.hasOwnProperty.call(valor, 'quantidades')) {
      base.quantidades = normalizarQuantidades(valor.quantidades, configuracao);
    }

    var idsResposta = [];
    if (Array.isArray(configuracao && configuracao.espacos)) {
      idsResposta = configuracao.espacos.map(function (espaco, indice) {
        return String(espaco.id == null ? indice : espaco.id);
      });
    }
    base.respostas = normalizarMapaNumerico(valor.respostas, idsResposta, 9999);

    var opcoes = Array.isArray(configuracao && configuracao.cartoes)
      ? configuracao.cartoes.map(String)
      : [];
    base.itens = Array.isArray(valor.itens)
      ? valor.itens
          .slice(0, 12)
          .map(String)
          .filter(function (item) {
            return opcoes.indexOf(item) >= 0;
          })
      : [];

    var categorias = Array.isArray(configuracao && configuracao.dados)
      ? configuracao.dados.map(function (item) {
          return String(item.id);
        })
      : [];
    base.barras = normalizarMapaNumerico(valor.barras, categorias, 20);

    var cedulas = Array.isArray(configuracao && configuracao.valores)
      ? configuracao.valores.map(String)
      : [];
    base.dinheiro = normalizarMapaNumerico(valor.dinheiro, cedulas, 20);

    if (typeof valor.resposta === 'string' || Number.isFinite(Number(valor.resposta))) {
      base.resposta = String(valor.resposta).slice(0, 40);
    }
    base.concluida = Boolean(valor.concluida);
    base.tentativas = inteiro(valor.tentativas, 0, 99, 0);
    base.dicas = inteiro(valor.dicas, 0, 9, 0);
    return base;
  }

  function valorTotal(quantidades) {
    return ORDENS.reduce(function (total, ordem) {
      return total + (Number(quantidades && quantidades[ordem]) || 0) * VALORES[ordem];
    }, 0);
  }

  function totalDinheiro(dinheiro) {
    return Object.keys(objeto(dinheiro)).reduce(function (total, valor) {
      return total + Number(valor) * (Number(dinheiro[valor]) || 0);
    }, 0);
  }

  function decomposicao(quantidades, incluirZeros) {
    var partes = ORDENS.map(function (ordem) {
      return (Number(quantidades[ordem]) || 0) * VALORES[ordem];
    }).filter(function (valor) {
      return incluirZeros || valor > 0;
    });
    return partes.length ? partes.join(' + ') : '0';
  }

  function podeTrocar(quantidades, origem, destino, configuracao) {
    var ativas = ordensAtivas(configuracao);
    return (
      ativas.indexOf(origem) >= 0 &&
      ativas.indexOf(destino) >= 0 &&
      VALORES[destino] === VALORES[origem] * 10 &&
      Number(quantidades[origem]) >= 10 &&
      Boolean(configuracao && configuracao.trocas)
    );
  }

  function trocar(quantidades, origem, destino, configuracao) {
    var resultado = normalizarQuantidades(quantidades, configuracao);
    if (!podeTrocar(resultado, origem, destino, configuracao)) return null;
    resultado[origem] -= 10;
    resultado[destino] += 1;
    return resultado;
  }

  function quantidadesIguais(atual, esperado, configuracao) {
    var alvo = normalizarQuantidades(esperado, configuracao);
    return ordensAtivas(configuracao).every(function (ordem) {
      return Number(atual[ordem]) === Number(alvo[ordem]);
    });
  }

  function validar(estado, configuracao) {
    var tipo = configuracao.tipo;
    var correta = false;
    var detalhe = '';

    if (['material', 'quadro', 'abaco'].indexOf(tipo) >= 0 && configuracao.modo !== 'descobrir') {
      correta = valorTotal(estado.quantidades) === Number(configuracao.valorAlvo);
      if (correta && configuracao.representacaoAlvo) {
        correta = quantidadesIguais(
          estado.quantidades,
          configuracao.representacaoAlvo,
          configuracao
        );
      }
      detalhe = 'Observe quantas ' + NOMES[configuracao.ordemDestaque || 'D'] + ' você colocou.';
    } else if (tipo === 'abaco' && configuracao.modo === 'descobrir') {
      correta = Number(estado.resposta) === valorTotal(estado.quantidades);
      detalhe = 'Leia uma haste de cada vez, começando pela maior ordem.';
    } else if (tipo === 'composicao') {
      var esperados = (configuracao.resposta || []).map(String);
      var atuais = estado.itens.map(String);
      correta = configuracao.ordemLivre
        ? esperados.slice().sort().join('|') === atuais.slice().sort().join('|')
        : esperados.join('|') === atuais.join('|');
      detalhe = 'Confira o valor de cada parcela e procure o zero que guarda uma ordem.';
    } else if (tipo === 'sequencia' || tipo === 'mini') {
      correta = (configuracao.espacos || []).every(function (espaco, indice) {
        var id = String(espaco.id == null ? indice : espaco.id);
        return Number(estado.respostas[id]) === Number(espaco.resposta);
      });
      detalhe = 'Descubra a regra e confira cada espaço.';
    } else if (tipo === 'reta' || tipo === 'escolha') {
      correta = String(estado.resposta) === String(configuracao.resposta);
      detalhe = configuracao.orientacaoErro || 'Observe novamente as opções.';
    } else if (tipo === 'dinheiro') {
      correta = totalDinheiro(estado.dinheiro) === Number(configuracao.valorAlvo);
      detalhe = 'Some os valores das fichas que você escolheu.';
    } else if (tipo === 'grafico') {
      correta = (configuracao.dados || []).every(function (item) {
        return Number(estado.barras[item.id] || 0) === Number(item.valor);
      });
      detalhe = 'Compare cada barra com a linha da tabela.';
    }

    return {
      correta: correta,
      mensagem: correta
        ? configuracao.mensagemCorreta || 'Muito bem! Sua construção representa o valor pedido.'
        : configuracao.mensagemErro || detalhe,
    };
  }

  window.MatematicaManipulaveis = {
    ordens: ORDENS.slice(),
    valores: Object.assign({}, VALORES),
    nomes: Object.assign({}, NOMES),
    ordensAtivas: ordensAtivas,
    estadoInicial: estadoInicial,
    normalizarEstado: normalizarEstado,
    copiarEstado: copiarEstado,
    valorTotal: valorTotal,
    totalDinheiro: totalDinheiro,
    decomposicao: decomposicao,
    podeTrocar: podeTrocar,
    trocar: trocar,
    validar: validar,
  };
})();
