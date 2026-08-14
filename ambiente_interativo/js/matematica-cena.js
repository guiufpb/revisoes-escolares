(function () {
  'use strict';

  var instancias = new WeakMap();

  function escapar(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function montar(recipiente, configuracao) {
    if (!recipiente || !recipiente.addEventListener) {
      throw new Error('A Cena Matemática precisa de um contêiner válido.');
    }
    configuracao = configuracao || {};
    if (!configuracao.id || !configuracao.tipo) {
      throw new Error('A Cena Matemática precisa de id e tipo.');
    }

    var modelo = window.MatematicaManipulaveis;
    var anterior = instancias.get(recipiente);
    if (anterior) anterior.destruir();

    var estado = modelo.normalizarEstado(configuracao.estado, configuracao);
    var interacao = { ferramenta: null, cartao: null, arrasto: null, suprimirClique: false };
    var historico = [];
    var destruida = false;

    recipiente.classList.add('cena-matematica');
    recipiente.dataset.cenaId = configuracao.id;

    function guardarHistorico() {
      historico.push(modelo.copiarEstado(estado));
      if (historico.length > 20) historico.shift();
    }

    function emitir(motivo) {
      var detalhe = { id: configuracao.id, motivo: motivo, estado: obterEstado() };
      recipiente.dispatchEvent(
        new CustomEvent('cenamatematicaalterada', { bubbles: true, detail: detalhe })
      );
      if (typeof configuracao.aoAlterar === 'function')
        configuracao.aoAlterar(detalhe.estado, motivo);
    }

    function definirStatus(mensagem, tipo) {
      var status = recipiente.querySelector('[data-math-status]');
      if (!status) return;
      status.className = 'matematica-feedback ' + (tipo || '');
      status.textContent = mensagem;
    }

    function resumo() {
      var tipo = configuracao.tipo;
      if (tipo === 'dinheiro')
        return 'Valor formado: ' + modelo.totalDinheiro(estado.dinheiro) + '.';
      if (['material', 'quadro', 'abaco'].indexOf(tipo) >= 0) {
        var total = modelo.valorTotal(estado.quantidades);
        if (configuracao.mostrarValor === false || configuracao.nivelAjuda === 'minima') {
          return 'Construção pronta para conferir. Conte as peças com calma.';
        }
        var texto = 'Número formado: ' + total + '.';
        if (configuracao.mostrarDecomposicao) {
          texto += ' Decomposição: ' + modelo.decomposicao(estado.quantidades, false) + '.';
        }
        return texto;
      }
      if (tipo === 'grafico') return 'Use os botões de cada barra para ajustar as quantidades.';
      return 'Sua construção fica salva nesta etapa.';
    }

    function nomePeca(ordem) {
      return { U: 'cubinho de 1', D: 'barra de 10', C: 'placa de 100', M: 'cubo de 1.000' }[ordem];
    }

    function formaPeca(ordem, indice, removivel) {
      var rotulo = nomePeca(ordem);
      if (!removivel) {
        return (
          '<span class="peca-dourada peca-' +
          ordem.toLowerCase() +
          '" aria-hidden="true"><span></span></span>'
        );
      }
      return (
        '<button class="peca-dourada peca-' +
        ordem.toLowerCase() +
        '" type="button" data-math-piece data-order="' +
        ordem +
        '" data-index="' +
        indice +
        '" aria-label="Retirar ' +
        rotulo +
        '"><span aria-hidden="true"></span></button>'
      );
    }

    function bandejaOrdens(ordens) {
      return (
        '<div class="matematica-bandeja" role="group" aria-label="Bandeja de peças">' +
        ordens
          .map(function (ordem) {
            return (
              '<button class="ferramenta-matematica" type="button" data-math-tool="' +
              ordem +
              '" aria-pressed="' +
              String(interacao.ferramenta === ordem) +
              '">' +
              formaPeca(ordem, 0, false) +
              '<span>' +
              escapar(nomePeca(ordem)) +
              '</span></button>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function colunasOrdens(ordens, abaco, somenteLeitura) {
      return (
        '<div class="' +
        (abaco ? 'abaco-matematico' : 'quadro-ordens-matematico') +
        '" role="group" aria-label="' +
        (abaco ? 'Ábaco interativo' : 'Quadro de ordens') +
        '">' +
        ordens
          .map(function (ordem) {
            var quantidade = estado.quantidades[ordem] || 0;
            var pecas = Array.from({ length: quantidade })
              .map(function (_, indice) {
                return abaco
                  ? somenteLeitura
                    ? '<span class="argola-abaco" aria-hidden="true"></span>'
                    : '<button class="argola-abaco" type="button" data-math-piece data-order="' +
                      ordem +
                      '" data-index="' +
                      indice +
                      '" aria-label="Retirar uma argola de ' +
                      modelo.nomes[ordem] +
                      '"></button>'
                  : formaPeca(ordem, indice, true);
              })
              .join('');
            return (
              '<section class="coluna-ordem ordem-' +
              ordem.toLowerCase() +
              '" aria-label="' +
              modelo.nomes[ordem] +
              ': ' +
              quantidade +
              '"><strong>' +
              ordem +
              '</strong><span class="nome-ordem">' +
              modelo.nomes[ordem] +
              '</span><div class="' +
              (abaco ? 'haste-abaco' : 'pecas-na-ordem') +
              (!somenteLeitura && interacao.ferramenta === ordem ? ' pronta-para-colocar' : '') +
              '" data-math-drop-order="' +
              ordem +
              '">' +
              (somenteLeitura
                ? ''
                : '<button class="area-colocar-na-ordem" type="button" data-math-drop-click="' +
                  ordem +
                  '" aria-label="Colocar a peça selecionada em ' +
                  modelo.nomes[ordem] +
                  '"></button>') +
              pecas +
              '</div>' +
              (somenteLeitura
                ? ''
                : '<button class="colocar-na-ordem" type="button" data-math-place="' +
                  ordem +
                  '">Colocar em ' +
                  ordem +
                  '</button>') +
              '<span class="quantidade-ordem">' +
              quantidade +
              '</span></section>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function trocas(ordens) {
      if (!configuracao.trocas) return '';
      var pares = [
        ['U', 'D'],
        ['D', 'C'],
        ['C', 'M'],
      ].filter(function (par) {
        return ordens.indexOf(par[0]) >= 0 && ordens.indexOf(par[1]) >= 0;
      });
      return (
        '<div class="trocas-matematicas" role="group" aria-label="Trocas disponíveis">' +
        pares
          .map(function (par) {
            var habilitada = modelo.podeTrocar(estado.quantidades, par[0], par[1], configuracao);
            return (
              '<button type="button" data-math-exchange="' +
              par.join('-') +
              '" ' +
              (habilitada ? '' : 'disabled') +
              '>Trocar 10 ' +
              par[0] +
              ' por 1 ' +
              par[1] +
              '</button>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function renderMaterial(tipo) {
      var ordens = modelo.ordensAtivas(configuracao);
      var descobrir = tipo === 'abaco' && configuracao.modo === 'descobrir';
      var escolhas = descobrir
        ? '<div class="escolhas-matematicas" role="group" aria-label="Escolha o número">' +
          (configuracao.opcoes || [])
            .map(function (opcao) {
              return (
                '<button type="button" data-math-answer="' +
                opcao +
                '" aria-pressed="' +
                String(String(estado.resposta) === String(opcao)) +
                '">' +
                opcao +
                '</button>'
              );
            })
            .join('') +
          '</div>'
        : '';
      return (
        (descobrir ? '' : bandejaOrdens(ordens)) +
        colunasOrdens(ordens, tipo === 'abaco', descobrir) +
        trocas(ordens) +
        escolhas +
        (descobrir
          ? ''
          : '<div class="zona-remover" data-math-remove-zone>Arraste uma peça até aqui para retirar</div>')
      );
    }

    function renderComposicao() {
      return (
        (configuracao.numeroAlvo || configuracao.palavras
          ? '<div class="conexao-numero-palavras"><strong>' +
            escapar(configuracao.numeroAlvo || '') +
            '</strong><span>' +
            escapar(configuracao.palavras || '') +
            '</span></div>'
          : '') +
        '<div class="cartoes-parcelas" role="group" aria-label="Cartões de parcelas">' +
        (configuracao.cartoes || [])
          .map(function (cartao) {
            return (
              '<button type="button" data-math-card="' +
              escapar(cartao) +
              '" aria-pressed="' +
              String(interacao.cartao === String(cartao)) +
              '">' +
              escapar(cartao) +
              '</button>'
            );
          })
          .join('') +
        '</div><div class="destino-parcelas" role="group" aria-label="Forma expandida montada">' +
        estado.itens
          .map(function (item, indice) {
            return (
              '<button type="button" data-math-remove-card="' +
              indice +
              '" aria-label="Retirar parcela ' +
              escapar(item) +
              '">' +
              escapar(item) +
              '</button>'
            );
          })
          .join('<span aria-hidden="true"> + </span>') +
        '<button type="button" class="colocar-parcela" data-math-place-card>Colocar parcela</button></div>'
      );
    }

    function renderSequencia() {
      var valores = configuracao.cartoes || [];
      return (
        '<div class="cartoes-sequencia" role="group" aria-label="Cartões de números">' +
        valores
          .map(function (valor) {
            return (
              '<button type="button" data-math-sequence-card="' +
              valor +
              '" aria-pressed="' +
              String(interacao.cartao === String(valor)) +
              '">' +
              valor +
              '</button>'
            );
          })
          .join('') +
        '</div><div class="linha-sequencia" aria-label="Sequência para completar">' +
        (configuracao.sequencia || [])
          .map(function (valor, indice) {
            if (valor != null) return '<span class="numero-sequencia">' + valor + '</span>';
            var espaco = (configuracao.espacos || []).find(function (item) {
              return Number(item.posicao) === indice;
            });
            var id = String(espaco && espaco.id != null ? espaco.id : indice);
            return (
              '<button type="button" class="espaco-sequencia" data-math-sequence-space="' +
              id +
              '" aria-label="Espaço da sequência ' +
              (indice + 1) +
              '">' +
              (estado.respostas[id] == null ? '?' : estado.respostas[id]) +
              '</button>'
            );
          })
          .join('<span aria-hidden="true">→</span>') +
        '</div>'
      );
    }

    function renderReta() {
      var marcadores = configuracao.marcadores || [];
      return (
        '<div class="reta-numerica" role="group" aria-label="Reta numérica">' +
        marcadores
          .map(function (numero) {
            return (
              '<button type="button" data-math-answer="' +
              numero +
              '" aria-pressed="' +
              String(String(estado.resposta) === String(numero)) +
              '"><span aria-hidden="true"></span>' +
              numero +
              '</button>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function renderDinheiro() {
      return (
        '<div class="fichas-dinheiro" role="group" aria-label="Fichas de dinheiro educativo">' +
        (configuracao.valores || [])
          .map(function (valor) {
            return (
              '<button type="button" data-math-money="' +
              valor +
              '"><span>FICHA</span><strong>R$ ' +
              valor +
              '</strong><small>dinheiro de brincar</small></button>'
            );
          })
          .join('') +
        '</div>' +
        (configuracao.trocasDinheiro
          ? '<div class="trocas-matematicas" role="group" aria-label="Trocas de fichas por equivalência">' +
            configuracao.trocasDinheiro
              .map(function (troca, indice) {
                var habilitada = Number(estado.dinheiro[troca.de] || 0) >= troca.quantidade;
                return (
                  '<button type="button" data-math-money-exchange="' +
                  indice +
                  '" ' +
                  (habilitada ? '' : 'disabled') +
                  '>Trocar ' +
                  troca.quantidade +
                  ' fichas de ' +
                  troca.de +
                  ' por 1 de ' +
                  troca.para +
                  '</button>'
                );
              })
              .join('') +
            '</div>'
          : '') +
        '<div class="dinheiro-escolhido" aria-label="Fichas escolhidas">' +
        Object.keys(estado.dinheiro)
          .map(function (valor) {
            return Array.from({ length: estado.dinheiro[valor] })
              .map(function () {
                return (
                  '<button type="button" data-math-remove-money="' +
                  valor +
                  '" aria-label="Retirar ficha de ' +
                  valor +
                  '">R$ ' +
                  valor +
                  '</button>'
                );
              })
              .join('');
          })
          .join('') +
        '</div>'
      );
    }

    function renderGrafico() {
      return (
        '<div class="grafico-matematico" role="group" aria-label="Gráfico de barras ajustável">' +
        (configuracao.dados || [])
          .map(function (item) {
            var valor = estado.barras[item.id] || 0;
            return (
              '<section class="barra-matematica"><div class="barra-visual" style="--valor-barra:' +
              valor +
              '" aria-hidden="true"><span></span></div><strong>' +
              escapar(item.rotulo) +
              '</strong><output>' +
              valor +
              '</output><div><button type="button" data-math-bar="' +
              escapar(item.id) +
              '" data-delta="-1" aria-label="Diminuir ' +
              escapar(item.rotulo) +
              '">−</button><button type="button" data-math-bar="' +
              escapar(item.id) +
              '" data-delta="1" aria-label="Aumentar ' +
              escapar(item.rotulo) +
              '">+</button></div></section>'
            );
          })
          .join('') +
        '</div><table class="tabela-matematica"><caption>Dados que o gráfico deve mostrar</caption><thead><tr><th>Categoria</th><th>Quantidade</th></tr></thead><tbody>' +
        (configuracao.dados || [])
          .map(function (item) {
            return '<tr><th>' + escapar(item.rotulo) + '</th><td>' + item.valor + '</td></tr>';
          })
          .join('') +
        '</tbody></table>'
      );
    }

    function renderMini() {
      return (
        '<div class="mini-simulado-matematico">' +
        (configuracao.espacos || [])
          .map(function (espaco, indice) {
            var id = String(espaco.id == null ? indice : espaco.id);
            return (
              '<label><span>' +
              escapar(espaco.pergunta) +
              '</span><input type="number" inputmode="numeric" data-math-input="' +
              id +
              '" min="0" max="1000" value="' +
              (estado.respostas[id] == null ? '' : estado.respostas[id]) +
              '"></label>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    function corpoDaFerramenta() {
      if (['material', 'quadro', 'abaco'].indexOf(configuracao.tipo) >= 0) {
        return renderMaterial(configuracao.tipo);
      }
      if (configuracao.tipo === 'composicao') return renderComposicao();
      if (configuracao.tipo === 'sequencia') return renderSequencia();
      if (configuracao.tipo === 'reta' || configuracao.tipo === 'escolha') return renderReta();
      if (configuracao.tipo === 'dinheiro') return renderDinheiro();
      if (configuracao.tipo === 'grafico') return renderGrafico();
      if (configuracao.tipo === 'mini') return renderMini();
      return '<p>Ferramenta matemática indisponível.</p>';
    }

    function renderizar(mensagem, tipoMensagem) {
      if (destruida) return;
      recipiente.innerHTML =
        '<div class="cena-instrucao"><p class="etiqueta">Cena Matemática Interativa</p><h2>' +
        escapar(configuracao.titulo || 'Construa e descubra') +
        '</h2><p>' +
        escapar(configuracao.instrucao || '') +
        '</p></div><div class="cena-area-construcao">' +
        corpoDaFerramenta() +
        '</div><p class="resumo-cena" data-math-summary>' +
        escapar(resumo()) +
        '</p><div class="controles-cena" role="group" aria-label="Controles da cena"><button type="button" data-math-undo ' +
        (historico.length ? '' : 'disabled') +
        '>Desfazer</button><button type="button" data-math-clear>Limpar esta cena</button><button type="button" data-math-hint>Dica</button><button type="button" class="botao-principal" data-math-check>Conferir</button></div><p class="matematica-feedback ' +
        (tipoMensagem || '') +
        '" data-math-status role="status" aria-live="polite" tabindex="-1">' +
        escapar(
          mensagem ||
            (estado.concluida ? 'Etapa concluída. Você pode tentar outra construção.' : '')
        ) +
        '</p>';
    }

    function alterar(mutacao, motivo, mensagem) {
      guardarHistorico();
      mutacao();
      estado.concluida = false;
      renderizar(mensagem || '', '');
      emitir(motivo);
    }

    function adicionarOrdem(ordem) {
      var ordens = modelo.ordensAtivas(configuracao);
      if (ordens.indexOf(ordem) < 0) return;
      var limite = Number((configuracao.limites || {})[ordem] || 20);
      if (estado.quantidades[ordem] >= limite) {
        definirStatus('Essa coluna já chegou ao limite desta atividade.', 'tente-novamente');
        return;
      }
      alterar(
        function () {
          estado.quantidades[ordem] += 1;
        },
        'adicionar',
        nomePeca(ordem) + ' colocado.'
      );
    }

    function colocarFerramenta(ordemDestino) {
      if (!interacao.ferramenta) {
        definirStatus('Primeiro escolha uma peça na bandeja.', 'tente-novamente');
        return;
      }
      if (interacao.ferramenta !== ordemDestino) {
        definirStatus(
          nomePeca(interacao.ferramenta) +
            ' pertence a ' +
            modelo.nomes[interacao.ferramenta] +
            '. Escolha o quadro correto.',
          'tente-novamente'
        );
        return;
      }
      adicionarOrdem(ordemDestino);
    }

    function removerOrdem(ordem) {
      if (!estado.quantidades[ordem]) return;
      alterar(
        function () {
          estado.quantidades[ordem] -= 1;
        },
        'remover',
        nomePeca(ordem) + ' retirado.'
      );
    }

    function moverOrdem(origem, destino) {
      if (origem === destino || !estado.quantidades[origem]) return;
      if (configuracao.tipo !== 'quadro') {
        definirStatus(
          'Essa peça mantém o próprio valor. Para trocar ordens, use um botão de troca.',
          'tente-novamente'
        );
        return;
      }
      alterar(
        function () {
          estado.quantidades[origem] -= 1;
          estado.quantidades[destino] += 1;
        },
        'mover',
        'Peça movida de ' + origem + ' para ' + destino + '.'
      );
    }

    function aoClicar(evento) {
      var alvo = evento.target.closest('button');
      if (!alvo || !recipiente.contains(alvo)) return;
      if (interacao.suprimirClique) {
        interacao.suprimirClique = false;
        return;
      }

      if (alvo.dataset.mathTool) {
        interacao.ferramenta = alvo.dataset.mathTool;
        renderizar('Peça selecionada. Agora escolha onde colocar.', '');
      } else if (alvo.dataset.mathDropClick) {
        colocarFerramenta(alvo.dataset.mathDropClick);
      } else if (alvo.dataset.mathPlace) {
        colocarFerramenta(alvo.dataset.mathPlace);
      } else if (alvo.hasAttribute('data-math-piece')) {
        removerOrdem(alvo.dataset.order);
      } else if (alvo.dataset.mathExchange) {
        var par = alvo.dataset.mathExchange.split('-');
        var trocadas = modelo.trocar(estado.quantidades, par[0], par[1], configuracao);
        if (trocadas) {
          alterar(
            function () {
              estado.quantidades = trocadas;
            },
            'trocar',
            'Troca feita à vista: 10 ' + par[0] + ' viraram 1 ' + par[1] + '.'
          );
        }
      } else if (alvo.dataset.mathAnswer != null) {
        alterar(function () {
          estado.resposta = alvo.dataset.mathAnswer;
        }, 'responder');
      } else if (alvo.dataset.mathCard != null) {
        interacao.cartao = alvo.dataset.mathCard;
        renderizar('Parcela selecionada. Use “Colocar parcela”.', '');
      } else if (alvo.hasAttribute('data-math-place-card')) {
        if (!interacao.cartao) {
          definirStatus('Escolha uma parcela primeiro.', 'tente-novamente');
        } else {
          alterar(function () {
            estado.itens.push(interacao.cartao);
            interacao.cartao = null;
          }, 'compor');
        }
      } else if (alvo.dataset.mathRemoveCard != null) {
        var indice = Number(alvo.dataset.mathRemoveCard);
        alterar(function () {
          estado.itens.splice(indice, 1);
        }, 'retirar-parcela');
      } else if (alvo.dataset.mathSequenceCard != null) {
        interacao.cartao = alvo.dataset.mathSequenceCard;
        renderizar('Número selecionado. Escolha um espaço.', '');
      } else if (alvo.dataset.mathSequenceSpace != null) {
        if (!interacao.cartao) {
          definirStatus('Escolha um cartão de número primeiro.', 'tente-novamente');
        } else {
          var espacoId = alvo.dataset.mathSequenceSpace;
          alterar(function () {
            estado.respostas[espacoId] = Number(interacao.cartao);
            interacao.cartao = null;
          }, 'completar-sequencia');
        }
      } else if (alvo.dataset.mathMoney != null) {
        var valor = alvo.dataset.mathMoney;
        alterar(function () {
          estado.dinheiro[valor] = (estado.dinheiro[valor] || 0) + 1;
        }, 'adicionar-dinheiro');
      } else if (alvo.dataset.mathRemoveMoney != null) {
        var dinheiro = alvo.dataset.mathRemoveMoney;
        alterar(function () {
          estado.dinheiro[dinheiro] = Math.max(0, (estado.dinheiro[dinheiro] || 0) - 1);
        }, 'remover-dinheiro');
      } else if (alvo.dataset.mathMoneyExchange != null) {
        var trocaDinheiro = configuracao.trocasDinheiro[Number(alvo.dataset.mathMoneyExchange)];
        if (
          trocaDinheiro &&
          Number(estado.dinheiro[trocaDinheiro.de] || 0) >= trocaDinheiro.quantidade
        ) {
          alterar(
            function () {
              estado.dinheiro[trocaDinheiro.de] -= trocaDinheiro.quantidade;
              estado.dinheiro[trocaDinheiro.para] = (estado.dinheiro[trocaDinheiro.para] || 0) + 1;
            },
            'trocar-dinheiro',
            'Troca equivalente feita. O valor total continuou igual.'
          );
        }
      } else if (alvo.dataset.mathBar != null) {
        var categoria = alvo.dataset.mathBar;
        var delta = Number(alvo.dataset.delta);
        alterar(function () {
          estado.barras[categoria] = Math.max(
            0,
            Math.min(20, (estado.barras[categoria] || 0) + delta)
          );
        }, 'ajustar-grafico');
      } else if (alvo.hasAttribute('data-math-undo')) {
        if (historico.length) {
          estado = historico.pop();
          renderizar('Última ação desfeita.', '');
          emitir('desfazer');
        }
      } else if (alvo.hasAttribute('data-math-clear')) {
        guardarHistorico();
        estado = modelo.estadoInicial(configuracao);
        renderizar('Somente esta cena foi limpa.', '');
        emitir('limpar');
      } else if (alvo.hasAttribute('data-math-hint')) {
        estado.dicas += 1;
        var dicas = configuracao.dicas || ['Observe o valor de cada ordem.'];
        var dica = dicas[Math.min(estado.dicas - 1, dicas.length - 1)];
        renderizar('Dica: ' + dica, 'dica');
        emitir('dica');
        var statusDica = recipiente.querySelector('[data-math-status]');
        if (statusDica) statusDica.focus({ preventScroll: true });
      } else if (alvo.hasAttribute('data-math-check')) {
        estado.tentativas += 1;
        var resultado = modelo.validar(estado, configuracao);
        estado.concluida = resultado.correta;
        renderizar(resultado.mensagem, resultado.correta ? 'sucesso' : 'tente-novamente');
        emitir('conferir');
        if (resultado.correta && typeof configuracao.aoConcluir === 'function') {
          configuracao.aoConcluir(obterEstado());
        }
        var status = recipiente.querySelector('[data-math-status]');
        if (status) status.focus({ preventScroll: true });
      }
    }

    function aoDigitar(evento) {
      var campo = evento.target.closest('[data-math-input]');
      if (!campo) return;
      estado.respostas[campo.dataset.mathInput] = Math.max(
        0,
        Math.min(1000, Math.trunc(Number(campo.value) || 0))
      );
      estado.concluida = false;
      emitir('digitar');
    }

    function aoPointerDown(evento) {
      var fonte = evento.target.closest(
        '[data-math-tool], [data-math-piece], [data-math-sequence-card]'
      );
      if (!fonte || (evento.pointerType === 'mouse' && evento.button !== 0)) return;
      interacao.arrasto = {
        id: evento.pointerId,
        fonte: fonte,
        x: evento.clientX,
        y: evento.clientY,
        moveu: false,
        ordem: fonte.dataset.order || fonte.dataset.mathTool || null,
        existente: fonte.hasAttribute('data-math-piece'),
        valor: fonte.dataset.mathSequenceCard,
      };
      fonte.classList.add('arrastando');
      if (fonte.setPointerCapture) fonte.setPointerCapture(evento.pointerId);
    }

    function aoPointerMove(evento) {
      var arrasto = interacao.arrasto;
      if (!arrasto || arrasto.id !== evento.pointerId) return;
      if (Math.hypot(evento.clientX - arrasto.x, evento.clientY - arrasto.y) > 16) {
        arrasto.moveu = true;
        arrasto.fonte.style.transform =
          'translate(' +
          (evento.clientX - arrasto.x) +
          'px,' +
          (evento.clientY - arrasto.y) +
          'px)';
        evento.preventDefault();
      }
    }

    function aoPointerFim(evento) {
      var arrasto = interacao.arrasto;
      if (!arrasto || arrasto.id !== evento.pointerId) return;
      var foiArrasto =
        arrasto.moveu && Math.hypot(evento.clientX - arrasto.x, evento.clientY - arrasto.y) > 16;
      arrasto.fonte.classList.remove('arrastando');
      arrasto.fonte.style.transform = '';
      if (foiArrasto && evento.type !== 'pointercancel') {
        var destino = document.elementFromPoint(evento.clientX, evento.clientY);
        var zonaOrdem = destino && destino.closest('[data-math-drop-order], [data-math-place]');
        var zonaRemover = destino && destino.closest('[data-math-remove-zone]');
        var espaco = destino && destino.closest('[data-math-sequence-space]');
        if (arrasto.valor != null && espaco) {
          var id = espaco.dataset.mathSequenceSpace;
          alterar(function () {
            estado.respostas[id] = Number(arrasto.valor);
          }, 'arrastar-sequencia');
        } else if (zonaRemover && arrasto.existente) {
          removerOrdem(arrasto.ordem);
        } else if (zonaOrdem) {
          var ordemDestino = zonaOrdem.dataset.mathDropOrder || zonaOrdem.dataset.mathPlace;
          if (arrasto.existente) moverOrdem(arrasto.ordem, ordemDestino);
          else adicionarOrdem(arrasto.ordem);
        }
      }
      if (
        !foiArrasto &&
        evento.type !== 'pointercancel' &&
        (arrasto.fonte.dataset.mathTool || arrasto.valor != null)
      ) {
        if (arrasto.fonte.dataset.mathTool) interacao.ferramenta = arrasto.fonte.dataset.mathTool;
        if (arrasto.valor != null) interacao.cartao = arrasto.valor;
        interacao.suprimirClique = true;
        interacao.arrasto = null;
        renderizar(
          arrasto.valor != null
            ? 'Número selecionado. Escolha um espaço.'
            : 'Peça selecionada. Agora escolha onde colocar.',
          ''
        );
        window.setTimeout(function () {
          interacao.suprimirClique = false;
        }, 0);
        return;
      }
      interacao.suprimirClique = foiArrasto;
      interacao.arrasto = null;
      if (foiArrasto) {
        window.setTimeout(function () {
          interacao.suprimirClique = false;
        }, 0);
      }
    }

    function obterEstado() {
      return modelo.normalizarEstado(estado, configuracao);
    }

    function restaurar(novoEstado) {
      guardarHistorico();
      estado = modelo.normalizarEstado(novoEstado, configuracao);
      renderizar('Construção restaurada.', '');
    }

    function reiniciar() {
      guardarHistorico();
      estado = modelo.estadoInicial(configuracao);
      interacao.ferramenta = null;
      interacao.cartao = null;
      renderizar('Cena reiniciada.', '');
      emitir('reiniciar');
    }

    function destruir() {
      if (destruida) return;
      destruida = true;
      recipiente.removeEventListener('click', aoClicar);
      recipiente.removeEventListener('input', aoDigitar);
      recipiente.removeEventListener('pointerdown', aoPointerDown);
      recipiente.removeEventListener('pointermove', aoPointerMove);
      recipiente.removeEventListener('pointerup', aoPointerFim);
      recipiente.removeEventListener('pointercancel', aoPointerFim);
      recipiente.classList.remove('cena-matematica');
      delete recipiente.dataset.cenaId;
      instancias.delete(recipiente);
    }

    recipiente.addEventListener('click', aoClicar);
    recipiente.addEventListener('input', aoDigitar);
    recipiente.addEventListener('pointerdown', aoPointerDown);
    recipiente.addEventListener('pointermove', aoPointerMove);
    recipiente.addEventListener('pointerup', aoPointerFim);
    recipiente.addEventListener('pointercancel', aoPointerFim);
    renderizar();

    var api = {
      obterEstado: obterEstado,
      restaurar: restaurar,
      reiniciar: reiniciar,
      validar: function () {
        return modelo.validar(estado, configuracao);
      },
      adicionar: adicionarOrdem,
      remover: removerOrdem,
      trocar: function (origem, destino) {
        var trocadas = modelo.trocar(estado.quantidades, origem, destino, configuracao);
        if (trocadas) {
          alterar(function () {
            estado.quantidades = trocadas;
          }, 'trocar');
          return true;
        }
        return false;
      },
      destruir: destruir,
    };
    instancias.set(recipiente, api);
    return api;
  }

  window.CenaMatematica = { montar: montar };
})();
