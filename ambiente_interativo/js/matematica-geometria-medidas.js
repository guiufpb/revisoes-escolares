(function () {
  'use strict';

  var TIPOS = ['atividade-visual', 'selecao-visual', 'associacao-visual', 'mosaico'];

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function listaUnica(valor, permitidos, limite) {
    return Array.isArray(valor)
      ? valor
          .map(String)
          .filter(function (item, indice, lista) {
            return permitidos.indexOf(item) >= 0 && lista.indexOf(item) === indice;
          })
          .slice(0, limite)
      : [];
  }

  function ids(configuracao, chave) {
    return (configuracao[chave] || []).map(function (item, indice) {
      return String(item.id == null ? indice : item.id);
    });
  }

  function estadoInicial() {
    return {
      escolhas: {},
      selecoes: [],
      marcadores: [],
      mosaico: { cor: null, celulas: {} },
    };
  }

  function normalizarEstado(base, valor, configuracao) {
    valor = objeto(valor);
    var campos = ids(configuracao, 'campos');
    var itens = ids(configuracao, 'itens');
    var chaves = campos.concat(itens);
    var escolhas = objeto(valor.escolhas);
    base.escolhas = chaves.reduce(function (resultado, id) {
      if (typeof escolhas[id] === 'string' || Number.isFinite(Number(escolhas[id]))) {
        resultado[id] = String(escolhas[id]).slice(0, 40);
      }
      return resultado;
    }, {});

    base.selecoes = listaUnica(valor.selecoes, itens, itens.length);
    var marcadoresPermitidos = ids(configuracao, 'marcadores');
    base.marcadores = listaUnica(
      valor.marcadores,
      marcadoresPermitidos,
      marcadoresPermitidos.length
    );

    var mosaico = objeto(valor.mosaico);
    var cores = (configuracao.cores || []).map(function (cor) {
      return String(cor.id);
    });
    var editaveis = (configuracao.celulas || [])
      .filter(function (celula) {
        return !celula.fixa;
      })
      .map(function (celula) {
        return String(celula.id);
      });
    var celulas = objeto(mosaico.celulas);
    base.mosaico = {
      cor: cores.indexOf(String(mosaico.cor)) >= 0 ? String(mosaico.cor) : null,
      celulas: editaveis.reduce(function (resultado, id) {
        if (cores.indexOf(String(celulas[id])) >= 0) resultado[id] = String(celulas[id]);
        return resultado;
      }, {}),
    };
    return base;
  }

  function suporta(tipo) {
    return TIPOS.indexOf(tipo) >= 0;
  }

  function formaVisual(forma) {
    return '<span class="forma-geometrica forma-' + forma + '" aria-hidden="true"></span>';
  }

  var TIPOS_RECIPIENTE = [
    'jarra',
    'copo',
    'garrafa',
    'caixa',
    'galao',
    'balde',
    'xicara',
    'frasco',
  ];
  var TIPOS_PRODUTO = ['pacote', 'caixa', 'lata', 'ovos'];

  function tipoPermitido(tipo, permitidos, padrao) {
    tipo = String(tipo || '');
    return permitidos.indexOf(tipo) >= 0 ? tipo : padrao;
  }

  function recipienteVisual(tipo) {
    tipo = tipoPermitido(tipo, TIPOS_RECIPIENTE, 'copo');
    return (
      '<span class="recipiente-visual recipiente-' +
      tipo +
      '" aria-hidden="true"><span></span><i></i><b></b></span>'
    );
  }

  function produtoVisual(tipo) {
    tipo = tipoPermitido(tipo, TIPOS_PRODUTO, 'pacote');
    return (
      '<span class="produto-visual produto-' +
      tipo +
      '" aria-hidden="true"><span></span><i></i><b></b></span>'
    );
  }

  function renderCapacidade(visual, escapar) {
    return (
      '<div class="painel-capacidade" role="group" aria-label="' +
      escapar(visual.rotuloAcessivel || 'Recipientes para comparar') +
      '">' +
      (visual.grupos || [])
        .map(function (grupo) {
          var quantidade = Math.max(1, Math.min(8, Math.trunc(Number(grupo.quantidade) || 1)));
          return (
            '<section class="grupo-capacidade"><div class="serie-recipientes">' +
            Array.from({ length: quantidade })
              .map(function () {
                return recipienteVisual(grupo.tipo);
              })
              .join('') +
            '</div><strong>' +
            escapar(grupo.rotulo) +
            '</strong>' +
            (grupo.detalhe ? '<span>' + escapar(grupo.detalhe) + '</span>' : '') +
            '</section>'
          );
        })
        .join('') +
      '</div>' +
      (visual.equacao
        ? '<p class="equacao-capacidade" aria-label="Relação de capacidade apresentada">' +
          escapar(visual.equacao) +
          '</p>'
        : '')
    );
  }

  function algarismosDU(numero) {
    var valor = Math.max(0, Math.min(99, Math.trunc(Number(numero) || 0)));
    return { D: Math.floor(valor / 10), U: valor % 10 };
  }

  function renderOperacaoDU(visual, escapar) {
    var superior = algarismosDU(visual.superior);
    var inferior = algarismosDU(visual.inferior);
    var operador = visual.operador === '−' ? '−' : '+';
    return (
      '<div class="painel-operacao-du"><table aria-label="Conta organizada em dezenas e unidades"><caption>' +
      escapar(visual.rotulo || 'Conta em dezenas e unidades') +
      '</caption><thead><tr><th aria-label="Operação"></th><th scope="col">D</th><th scope="col">U</th></tr></thead><tbody><tr><td></td><td>' +
      superior.D +
      '</td><td>' +
      superior.U +
      '</td></tr><tr><th scope="row">' +
      operador +
      '</th><td>' +
      inferior.D +
      '</td><td>' +
      inferior.U +
      '</td></tr></tbody></table><p>' +
      escapar(
        visual.ajuda ||
          (operador === '+'
            ? 'Comece pelas unidades. Ao formar 10 unidades, troque por 1 dezena.'
            : 'Comece pelas unidades e observe se uma dezena precisa ser transformada.')
      ) +
      '</p></div>'
    );
  }

  function renderMercado(visual, escapar) {
    return (
      '<div class="painel-mercado" role="group" aria-label="' +
      escapar(visual.rotuloAcessivel || 'Produtos e preços do carrinho') +
      '">' +
      (visual.itens || [])
        .map(function (item) {
          return (
            '<article class="cartao-produto">' +
            produtoVisual(item.tipo) +
            '<strong>' +
            escapar(item.nome) +
            '</strong><span>R$ ' +
            Math.max(0, Math.trunc(Number(item.preco) || 0)) +
            '</span></article>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderContagem(configuracao, estado, escapar) {
    return (
      '<div class="painel-contagem-formas" role="group" aria-label="Figuras para contar. Toque em uma figura para marcá-la durante a contagem.">' +
      (configuracao.marcadores || [])
        .map(function (item, indice) {
          var id = String(item.id == null ? indice : item.id);
          var marcado = estado.marcadores.indexOf(id) >= 0;
          return (
            '<button type="button" class="figura-contavel" data-math-visual-aid="' +
            escapar(id) +
            '" aria-pressed="' +
            String(marcado) +
            '" aria-label="' +
            escapar(item.rotulo || 'Figura ' + (indice + 1)) +
            '">' +
            formaVisual(item.forma) +
            '</button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderForma(visual, escapar) {
    return (
      '<div class="painel-forma-detalhe" aria-label="' +
      escapar(visual.rotulo) +
      '">' +
      formaVisual(visual.forma) +
      '<strong>' +
      escapar(visual.rotulo) +
      '</strong></div>'
    );
  }

  function renderRegua(visual) {
    var maximo = Number(visual.maximo) || 10;
    var fim = Number(visual.fim) || 0;
    return (
      '<div class="regua-interativa" style="--divisoes:' +
      maximo +
      '" aria-label="Régua de zero a ' +
      maximo +
      ' ' +
      visual.unidade +
      ', com o objeto começando no zero e terminando em ' +
      fim +
      '"><div class="objeto-na-regua" style="--fim:' +
      fim +
      '" aria-hidden="true"></div><div class="marcas-regua">' +
      Array.from({ length: maximo + 1 })
        .map(function (_, numero) {
          return (
            '<span class="' +
            (numero % 5 === 0 ? 'marca-maior' : '') +
            '"><i></i><small>' +
            numero +
            '</small></span>'
          );
        })
        .join('') +
      '</div><strong>' +
      visual.unidade +
      '</strong></div>'
    );
  }

  function renderBalanca(visual, escapar) {
    return (
      '<div class="balanca-visual" role="img" aria-label="' +
      escapar(visual.rotulo) +
      '"><div class="prato prato-esquerdo"><span>' +
      escapar(visual.esquerda) +
      '</span></div><div class="haste-balanca" aria-hidden="true"></div><div class="prato prato-direito"><span>' +
      escapar(visual.direita) +
      '</span></div><div class="base-balanca" aria-hidden="true"></div></div>'
    );
  }

  function repetir(quantidade, montar) {
    return Array.from({ length: Math.max(0, Math.trunc(Number(quantidade) || 0)) })
      .map(montar)
      .join('');
  }

  function pecasBaseDez(dezenas, unidades, prefixo) {
    return (
      '<div class="grupo-base-dez" data-grupo-base-dez="' +
      prefixo +
      '" data-dezenas="' +
      dezenas +
      '" data-unidades="' +
      unidades +
      '"><div class="barras-dez">' +
      repetir(dezenas, function (_, indice) {
        return (
          '<span class="barra-dez" data-barra-dez="' + (indice + 1) + '" aria-hidden="true"></span>'
        );
      }) +
      '</div><div class="cubinhos-unidade">' +
      repetir(unidades, function (_, indice) {
        return (
          '<span class="cubinho-unidade" data-cubinho-unidade="' +
          (indice + 1) +
          '" aria-hidden="true"></span>'
        );
      }) +
      '</div></div>'
    );
  }

  function renderBaseDez(visual, escapar) {
    var dezenas = Math.max(0, Math.min(9, Math.trunc(Number(visual.dezenas) || 0)));
    var unidades = Math.max(0, Math.min(19, Math.trunc(Number(visual.unidades) || 0)));
    var total = dezenas * 10 + unidades;
    return (
      '<div class="apoio-matematico apoio-base-dez" role="img" data-modelo-total="' +
      total +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          'Material dourado com ' + dezenas + ' barras de dez e ' + unidades + ' cubinhos.'
      ) +
      '">' +
      pecasBaseDez(dezenas, unidades, 'representacao') +
      '</div>'
    );
  }

  function renderSequenciaNumerica(visual, escapar) {
    return (
      '<div class="apoio-matematico faixa-sequencia" role="group" aria-label="' +
      escapar(visual.rotuloAcessivel || 'Sequência numérica com lacunas') +
      '">' +
      (visual.valores || [])
        .map(function (valor, indice) {
          var lacuna = valor == null;
          return (
            '<span class="celula-sequencia ' +
            (lacuna ? 'lacuna-sequencia' : '') +
            '" data-posicao-sequencia="' +
            indice +
            '"' +
            (lacuna
              ? ' data-lacuna-sequencia="true" aria-label="Lacuna ' + (indice + 1) + '"'
              : '') +
            '>' +
            (lacuna ? '<span aria-hidden="true">?</span>' : escapar(valor)) +
            '</span>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderVizinhos(visual, escapar) {
    return (
      '<div class="apoio-matematico lista-vizinhos" role="group" aria-label="' +
      escapar(visual.rotuloAcessivel || 'Números com espaço para anterior e posterior') +
      '">' +
      (visual.alvos || [])
        .map(function (alvo) {
          return (
            '<div class="linha-vizinhos" data-alvo-vizinhos="' +
            escapar(alvo) +
            '"><span class="vizinho-anterior" role="img" aria-label="Anterior de ' +
            escapar(alvo) +
            '">?</span><span aria-hidden="true">←</span><strong>' +
            escapar(alvo) +
            '</strong><span aria-hidden="true">→</span><span class="vizinho-posterior" role="img" aria-label="Posterior de ' +
            escapar(alvo) +
            '">?</span></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderAbacoDU(visual, escapar) {
    var dezenas = Math.max(0, Math.min(9, Math.trunc(Number(visual.dezenas) || 0)));
    var unidades = Math.max(0, Math.min(9, Math.trunc(Number(visual.unidades) || 0)));
    function haste(ordem, quantidade) {
      return (
        '<section class="haste-abaco" data-ordem-abaco="' +
        ordem +
        '" data-quantidade-abaco="' +
        quantidade +
        '"><strong>' +
        ordem +
        '</strong><div class="trilho-abaco" role="group" aria-label="' +
        quantidade +
        (ordem === 'D' ? ' dezenas' : ' unidades') +
        '">' +
        repetir(quantidade, function (_, indice) {
          return (
            '<span class="peca-abaco" data-peca-abaco="' +
            ordem +
            '-' +
            (indice + 1) +
            '" aria-hidden="true"></span>'
          );
        }) +
        '</div></section>'
      );
    }
    return (
      '<div class="apoio-matematico abaco-du" role="img" data-modelo-total="' +
      (dezenas * 10 + unidades) +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          'Ábaco com ' + dezenas + ' peças na haste D e ' + unidades + ' peças na haste U.'
      ) +
      '">' +
      haste('D', dezenas) +
      haste('U', unidades) +
      '</div>'
    );
  }

  function renderFichasDinheiro(visual, escapar) {
    var valores = (visual.valores || []).map(function (valor) {
      return Math.max(0, Math.trunc(Number(valor) || 0));
    });
    return (
      '<div class="apoio-matematico fichas-dinheiro" role="img" data-modelo-total="' +
      valores.reduce(function (total, valor) {
        return total + valor;
      }, 0) +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          'Fichas monetárias fictícias de ' +
            valores
              .map(function (valor) {
                return 'R$ ' + valor;
              })
              .join(', ') +
            '.'
      ) +
      '">' +
      valores
        .map(function (valor, indice) {
          return (
            '<span class="ficha-dinheiro" data-valor-ficha="' +
            valor +
            '" data-ficha-indice="' +
            indice +
            '">R$ ' +
            valor +
            '</span>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderFormandoDezena(visual, escapar) {
    var grupoA = Math.max(0, Math.trunc(Number(visual.grupoA) || 0));
    var grupoB = Math.max(0, Math.trunc(Number(visual.grupoB) || 0));
    var usadosDoB = Math.max(0, Math.min(grupoB, 10 - grupoA));
    var restantes = grupoB - usadosDoB;
    return (
      '<div class="apoio-matematico formando-dezena" role="img" data-grupo-a="' +
      grupoA +
      '" data-grupo-b="' +
      grupoB +
      '" data-usados-grupo-b="' +
      usadosDoB +
      '" data-restantes-grupo-b="' +
      restantes +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          grupoA +
            ' peças azuis e ' +
            grupoB +
            ' amarelas. Duas amarelas completam um grupo de dez; cinco ficam fora.'
      ) +
      '"><section class="quadro-dez">' +
      repetir(grupoA, function (_, indice) {
        return (
          '<span class="peca-contagem azul" data-peca-azul="' +
          (indice + 1) +
          '" aria-hidden="true"></span>'
        );
      }) +
      repetir(usadosDoB, function (_, indice) {
        return (
          '<span class="peca-contagem amarela usada" data-peca-amarela-usada="' +
          (indice + 1) +
          '" aria-hidden="true"></span>'
        );
      }) +
      '</section><section class="pecas-restantes">' +
      repetir(restantes, function (_, indice) {
        return (
          '<span class="peca-contagem amarela" data-peca-amarela-restante="' +
          (indice + 1) +
          '" aria-hidden="true"></span>'
        );
      }) +
      '</section></div>'
    );
  }

  function renderDecomposicao(visual, escapar) {
    return (
      '<div class="apoio-matematico decomposicao-visual" role="img" aria-label="' +
      escapar(visual.rotuloAcessivel || 'Decomposição das parcelas em dezenas e unidades') +
      '">' +
      (visual.parcelas || [])
        .map(function (parcela) {
          var numero = Math.max(0, Math.min(99, Math.trunc(Number(parcela) || 0)));
          var partes = algarismosDU(numero);
          return (
            '<section data-parcela="' +
            numero +
            '"><strong>' +
            numero +
            '</strong><span aria-hidden="true">→</span><span data-dezena="' +
            partes.D * 10 +
            '">' +
            partes.D * 10 +
            '</span><span aria-hidden="true">+</span><span data-unidade="' +
            partes.U +
            '">' +
            partes.U +
            '</span></section>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderAdicaoReagrupamento(visual, escapar) {
    var primeira = algarismosDU(visual.primeira);
    var segunda = algarismosDU(visual.segunda);
    var unidades = primeira.U + segunda.U;
    return (
      '<div class="apoio-matematico reagrupamento-visual adicao-reagrupamento" role="img" data-primeira-parcela="' +
      Math.trunc(Number(visual.primeira) || 0) +
      '" data-segunda-parcela="' +
      Math.trunc(Number(visual.segunda) || 0) +
      '" data-total-unidades="' +
      unidades +
      '" data-troca-unidades="10" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          'Duas parcelas em material dourado. As unidades totalizam ' +
            unidades +
            ' e um grupo de 10 unidades pode virar 1 dezena.'
      ) +
      '"><section><strong>Primeira parcela</strong>' +
      pecasBaseDez(primeira.D, primeira.U, 'primeira-parcela') +
      '</section><span class="operador-visual" aria-hidden="true">+</span><section><strong>Segunda parcela</strong>' +
      pecasBaseDez(segunda.D, segunda.U, 'segunda-parcela') +
      '</section><p><strong>' +
      unidades +
      ' U</strong><span aria-hidden="true"> → </span>agrupe 10 U para formar 1 D.</p></div>'
    );
  }

  function renderSubtracaoReagrupamento(visual, escapar) {
    var inicial = algarismosDU(visual.inicial);
    var depois = { D: inicial.D - 1, U: inicial.U + 10 };
    return (
      '<div class="apoio-matematico troca-subtracao" role="img" data-valor-inicial="' +
      Math.trunc(Number(visual.inicial) || 0) +
      '" data-dezenas-iniciais="' +
      inicial.D +
      '" data-unidades-iniciais="' +
      inicial.U +
      '" data-dezenas-trocadas="' +
      depois.D +
      '" data-unidades-trocadas="' +
      depois.U +
      '" data-valor-trocado="' +
      (depois.D * 10 + depois.U) +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel ||
          inicial.D +
            ' dezenas e ' +
            inicial.U +
            ' unidades se transformam em ' +
            depois.D +
            ' dezenas e ' +
            depois.U +
            ' unidades, preservando o mesmo valor.'
      ) +
      '"><section><strong>Antes da troca</strong>' +
      pecasBaseDez(inicial.D, inicial.U, 'antes-troca') +
      '</section><span class="seta-troca" aria-hidden="true">→</span><section><strong>Depois da troca</strong>' +
      pecasBaseDez(depois.D, depois.U, 'depois-troca') +
      '</section><p>1 D virou 10 U. Agora há unidades suficientes para retirar ' +
      Math.max(0, Math.trunc(Number(visual.retirarUnidades) || 0)) +
      ' U.</p></div>'
    );
  }

  function renderComparacaoDinheiro(visual, escapar) {
    var disponivel = Math.max(0, Math.trunc(Number(visual.disponivel) || 0));
    var preco = Math.max(0, Math.trunc(Number(visual.preco) || 0));
    return (
      '<div class="apoio-matematico comparacao-dinheiro" role="img" data-valor-disponivel="' +
      disponivel +
      '" data-preco="' +
      preco +
      '" aria-label="' +
      escapar(
        visual.rotuloAcessivel || 'Nina tem R$ ' + disponivel + ' e o jogo custa R$ ' + preco + '.'
      ) +
      '"><section><span>Nina tem</span><strong>R$ ' +
      disponivel +
      '</strong></section><span class="comparador-visual" aria-hidden="true">&lt;</span><section><span>Preço do jogo</span><strong>R$ ' +
      preco +
      '</strong></section></div>'
    );
  }

  function renderVisual(configuracao, estado, escapar) {
    var visual = configuracao.visual || {};
    if (visual.tipo === 'contagem-formas') return renderContagem(configuracao, estado, escapar);
    if (visual.tipo === 'forma') return renderForma(visual, escapar);
    if (visual.tipo === 'regua') return renderRegua(visual);
    if (visual.tipo === 'balanca') return renderBalanca(visual, escapar);
    if (visual.tipo === 'capacidade') return renderCapacidade(visual, escapar);
    if (visual.tipo === 'operacao-du') return renderOperacaoDU(visual, escapar);
    if (visual.tipo === 'mercado') return renderMercado(visual, escapar);
    if (visual.tipo === 'base-dez') return renderBaseDez(visual, escapar);
    if (visual.tipo === 'sequencia-numerica') return renderSequenciaNumerica(visual, escapar);
    if (visual.tipo === 'vizinhos') return renderVizinhos(visual, escapar);
    if (visual.tipo === 'abaco-du') return renderAbacoDU(visual, escapar);
    if (visual.tipo === 'fichas-dinheiro') return renderFichasDinheiro(visual, escapar);
    if (visual.tipo === 'formando-dezena') return renderFormandoDezena(visual, escapar);
    if (visual.tipo === 'decomposicao') return renderDecomposicao(visual, escapar);
    if (visual.tipo === 'adicao-reagrupamento') return renderAdicaoReagrupamento(visual, escapar);
    if (visual.tipo === 'subtracao-reagrupamento')
      return renderSubtracaoReagrupamento(visual, escapar);
    if (visual.tipo === 'comparacao-dinheiro') return renderComparacaoDinheiro(visual, escapar);
    if (visual.texto) {
      return (
        '<div class="painel-visual-medidas" aria-hidden="true">' + escapar(visual.texto) + '</div>'
      );
    }
    return '';
  }

  function renderCampos(configuracao, estado, escapar) {
    return (
      '<div class="campos-medidas">' +
      (configuracao.campos || [])
        .map(function (campo, indice) {
          var id = String(campo.id == null ? indice : campo.id);
          var valor = Object.prototype.hasOwnProperty.call(estado.escolhas, id)
            ? estado.escolhas[id]
            : '';
          return (
            '<label class="campo-medida"><span>' +
            escapar(campo.pergunta) +
            '</span><span class="entrada-com-unidade"><input type="number" inputmode="numeric" data-math-visual-input="' +
            escapar(id) +
            '" min="0" max="10000" value="' +
            escapar(valor) +
            '" aria-label="' +
            escapar(campo.rotuloAcessivel || campo.pergunta) +
            '">' +
            (campo.unidade ? '<strong>' + escapar(campo.unidade) + '</strong>' : '') +
            '</span></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderAtividade(configuracao, estado, escapar) {
    return (
      renderVisual(configuracao, estado, escapar) + renderCampos(configuracao, estado, escapar)
    );
  }

  function iconeItem(item) {
    if (item.forma) return formaVisual(item.forma);
    if (item.recipiente) return recipienteVisual(item.recipiente);
    if (item.produto) return produtoVisual(item.produto);
    return '<span class="simbolo-medida" aria-hidden="true">' + (item.simbolo || '◆') + '</span>';
  }

  function renderSelecao(configuracao, estado, escapar) {
    return (
      '<div class="grade-selecao-visual" role="group" aria-label="' +
      escapar(configuracao.rotuloGrupo || 'Opções para selecionar') +
      '">' +
      (configuracao.itens || [])
        .map(function (item, indice) {
          var id = String(item.id == null ? indice : item.id);
          return (
            '<button type="button" data-math-visual-choice="' +
            escapar(id) +
            '" aria-pressed="' +
            String(estado.selecoes.indexOf(id) >= 0) +
            '">' +
            iconeItem(item) +
            '<strong>' +
            escapar(item.rotulo) +
            '</strong></button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderAssociacao(configuracao, estado, escapar) {
    return (
      renderVisual(configuracao, estado, escapar) +
      '<div class="grade-associacoes">' +
      (configuracao.itens || [])
        .map(function (item, indice) {
          var id = String(item.id == null ? indice : item.id);
          var atual = estado.escolhas[id] || '';
          return (
            '<label class="cartao-associacao">' +
            iconeItem(item) +
            '<span>' +
            escapar(item.rotulo) +
            '</span><select data-math-visual-select="' +
            escapar(id) +
            '"><option value="">Escolha</option>' +
            (item.opcoes || configuracao.opcoes || [])
              .map(function (opcao) {
                var valor = String(opcao.valor == null ? opcao : opcao.valor);
                var rotulo = String(opcao.rotulo == null ? opcao : opcao.rotulo);
                return (
                  '<option value="' +
                  escapar(valor) +
                  '" ' +
                  (atual === valor ? 'selected' : '') +
                  '>' +
                  escapar(rotulo) +
                  '</option>'
                );
              })
              .join('') +
            '</select></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderMosaico(configuracao, estado, escapar) {
    return (
      '<div class="paleta-mosaico" role="group" aria-label="Cores do mosaico">' +
      (configuracao.cores || [])
        .map(function (cor) {
          return (
            '<button type="button" data-math-mosaic-color="' +
            escapar(cor.id) +
            '" aria-pressed="' +
            String(estado.mosaico.cor === String(cor.id)) +
            '"><span style="--cor-mosaico:' +
            escapar(cor.cor) +
            '" aria-hidden="true"></span>' +
            escapar(cor.rotulo) +
            '</button>'
          );
        })
        .join('') +
      '</div><div class="grade-mosaico" style="--colunas-mosaico:' +
      Number(configuracao.colunas || 6) +
      '" role="group" aria-label="Mosaico parcialmente preenchido">' +
      (configuracao.celulas || [])
        .map(function (celula, indice) {
          var id = String(celula.id == null ? indice : celula.id);
          var cor = celula.fixa ? celula.resposta : estado.mosaico.celulas[id];
          var classe = cor ? ' preenchida cor-' + cor : '';
          if (celula.fixa) {
            return (
              '<span class="celula-mosaico fixa' +
              classe +
              '" role="img" aria-label="Parte pronta do padrão"></span>'
            );
          }
          return (
            '<button type="button" class="celula-mosaico' +
            classe +
            '" data-math-mosaic-cell="' +
            escapar(id) +
            '" aria-label="Célula editável ' +
            (indice + 1) +
            '"></button>'
          );
        })
        .join('') +
      '</div><p class="orientacao-mosaico">Escolha uma cor e depois toque nas células. Toque novamente com a mesma cor para apagar.</p>'
    );
  }

  function renderizar(configuracao, estado, escapar) {
    if (configuracao.tipo === 'atividade-visual')
      return renderAtividade(configuracao, estado, escapar);
    if (configuracao.tipo === 'selecao-visual') return renderSelecao(configuracao, estado, escapar);
    if (configuracao.tipo === 'associacao-visual')
      return renderAssociacao(configuracao, estado, escapar);
    if (configuracao.tipo === 'mosaico') return renderMosaico(configuracao, estado, escapar);
    return '';
  }

  function conjuntosIguais(atual, esperado) {
    return atual.slice().sort().join('|') === esperado.map(String).slice().sort().join('|');
  }

  function validar(estado, configuracao) {
    var correta = false;
    if (configuracao.tipo === 'atividade-visual') {
      correta = (configuracao.campos || []).every(function (campo, indice) {
        var id = String(campo.id == null ? indice : campo.id);
        return (
          String(estado.escolhas[id] == null ? '' : estado.escolhas[id]).trim() ===
          String(campo.resposta)
        );
      });
    } else if (configuracao.tipo === 'selecao-visual') {
      correta = conjuntosIguais(estado.selecoes, configuracao.resposta || []);
    } else if (configuracao.tipo === 'associacao-visual') {
      correta = (configuracao.itens || []).every(function (item, indice) {
        var id = String(item.id == null ? indice : item.id);
        return String(estado.escolhas[id] || '') === String(item.resposta);
      });
    } else if (configuracao.tipo === 'mosaico') {
      correta = (configuracao.celulas || []).every(function (celula, indice) {
        var id = String(celula.id == null ? indice : celula.id);
        var atual = celula.fixa ? celula.resposta : estado.mosaico.celulas[id];
        return String(atual || '') === String(celula.resposta);
      });
    }
    return {
      correta: correta,
      mensagem: correta
        ? configuracao.mensagemCorreta || 'Muito bem! Você observou e resolveu toda a atividade.'
        : configuracao.mensagemErro ||
          'Ainda há algo para revisar. Observe cada item, corrija e confira novamente.',
    };
  }

  function resumo(configuracao) {
    if (configuracao.tipo === 'mosaico')
      return 'O padrão e cada escolha de cor ficam salvos nesta etapa.';
    if (configuracao.tipo === 'selecao-visual')
      return 'Você pode selecionar e retirar opções antes de conferir.';
    return 'Suas respostas ficam salvas nesta etapa.';
  }

  window.MatematicaGeometriaMedidas = {
    suporta: suporta,
    estadoInicial: estadoInicial,
    normalizarEstado: normalizarEstado,
    renderizar: renderizar,
    renderizarApoio: function (visual, escapar) {
      return renderVisual({ visual: visual }, estadoInicial(), escapar);
    },
    validar: validar,
    resumo: resumo,
  };
})();
