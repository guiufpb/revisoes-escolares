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

  function renderVisual(configuracao, estado, escapar) {
    var visual = configuracao.visual || {};
    if (visual.tipo === 'contagem-formas') return renderContagem(configuracao, estado, escapar);
    if (visual.tipo === 'forma') return renderForma(visual, escapar);
    if (visual.tipo === 'regua') return renderRegua(visual);
    if (visual.tipo === 'balanca') return renderBalanca(visual, escapar);
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
    validar: validar,
    resumo: resumo,
  };
})();
