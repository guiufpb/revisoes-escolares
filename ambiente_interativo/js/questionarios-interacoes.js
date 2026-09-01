(function () {
  'use strict';

  // Capacidades opcionais do questionário: conjuntos e sequência reversível.
  function aceita(item) {
    return item.tipo === 'selecao' || item.tipo === 'ordenacao' || item.tipo === 'misto';
  }

  function mesmoConjunto(marcadas, esperadas) {
    return (
      marcadas.length === esperadas.length &&
      esperadas.every(function (valor) {
        return marcadas.indexOf(valor) >= 0;
      })
    );
  }

  function acertos(item, respostas) {
    if (item.tipo === 'selecao') {
      var marcadas = Array.isArray(respostas[0]) ? respostas[0] : [];
      var esperadas = item.itens[0].respostas;
      return [mesmoConjunto(marcadas, esperadas)];
    }
    if (item.tipo === 'misto') {
      return item.itens.map(function (subitem, indice) {
        if (subitem.tipo === 'selecao') {
          return mesmoConjunto(
            Array.isArray(respostas[indice]) ? respostas[indice] : [],
            subitem.respostas
          );
        }
        if (subitem.tipo === 'ordenacao') {
          var ordem = Array.isArray(respostas[indice]) ? respostas[indice] : [];
          return (
            ordem.length === subitem.respostas.length &&
            subitem.respostas.every(function (valor, posicao) {
              return ordem[posicao] === valor;
            })
          );
        }
        return subitem.respostas.indexOf(respostas[indice]) >= 0;
      });
    }
    return item.itens.map(function (subitem, indice) {
      return respostas[indice] === subitem.respostas[0];
    });
  }

  function montarMisto(item, respostas, escapar) {
    return item.itens
      .map(function (subitem, indice) {
        if (subitem.tipo === 'selecao') {
          var marcadas = Array.isArray(respostas[indice]) ? respostas[indice] : [];
          return (
            '<fieldset class="questao-mariana" data-item-gramatica="' +
            indice +
            '"><legend>' +
            escapar(subitem.pergunta) +
            '</legend><p>Marque todas as corretas. Clique novamente para desmarcar.</p><div class="opcoes-mariana">' +
            subitem.opcoes
              .map(function (opcao, opcaoIndice) {
                var selecionada = marcadas.indexOf(opcao) >= 0;
                return (
                  '<button type="button" class="opcao-mariana' +
                  (selecionada ? ' selecionada' : '') +
                  '" data-opcao-gramatica data-selecao-misto="' +
                  indice +
                  ':' +
                  opcaoIndice +
                  '" aria-pressed="' +
                  selecionada +
                  '"><span aria-hidden="true">' +
                  (selecionada ? '✓ ' : '□ ') +
                  '</span>' +
                  escapar(opcao) +
                  '</button>'
                );
              })
              .join('') +
            '</div></fieldset>'
          );
        }
        if (subitem.tipo === 'ordenacao') {
          var ordem = Array.isArray(respostas[indice]) ? respostas[indice] : [];
          return (
            '<div class="ordem-questionario questao-mariana" data-item-gramatica="' +
            indice +
            '"><p class="titulo-subquestao">' +
            escapar(subitem.pergunta) +
            '</p><p>Escolha um cartão para a próxima posição. Clique no cartão colocado para retirá-lo.</p>' +
            '<ol aria-label="' +
            escapar(subitem.rotuloOrdem || 'Sequência ordenada') +
            '">' +
            subitem.respostas
              .map(function (_resposta, posicao) {
                return (
                  '<li>' +
                  (ordem[posicao]
                    ? '<button class="botao-secundario" type="button" data-opcao-gramatica data-retirar-ordem-misto="' +
                      indice +
                      ':' +
                      posicao +
                      '" aria-pressed="true" aria-label="Retirar da posição ' +
                      (posicao + 1) +
                      ': ' +
                      escapar(ordem[posicao]) +
                      '">' +
                      escapar(ordem[posicao]) +
                      ' · Retirar</button>'
                    : '<span>Posição ' + (posicao + 1) + ' — escolha um cartão</span>') +
                  '</li>'
                );
              })
              .join('') +
            '</ol><div class="opcoes-mariana" aria-label="Cartões disponíveis">' +
            subitem.cartoes
              .map(function (cartao, cartaoIndice) {
                return (
                  '<button class="opcao-mariana" type="button" data-colocar-ordem-misto="' +
                  indice +
                  ':' +
                  cartaoIndice +
                  '"' +
                  (ordem.indexOf(cartao) >= 0 ? ' disabled' : '') +
                  '>' +
                  escapar(cartao) +
                  '</button>'
                );
              })
              .join('') +
            '</div><button class="botao-secundario" type="button" data-limpar-ordem-misto="' +
            indice +
            '">Limpar sequência</button></div>'
          );
        }
        return (
          '<fieldset class="questao-mariana" data-item-gramatica="' +
          indice +
          '"><legend>' +
          escapar(subitem.pergunta) +
          '</legend><div class="opcoes-mariana">' +
          subitem.opcoes
            .map(function (opcao, opcaoIndice) {
              var selecionada = respostas[indice] === opcao;
              return (
                '<button type="button" class="opcao-mariana' +
                (selecionada ? ' selecionada' : '') +
                '" data-opcao-gramatica data-opcao-misto="' +
                indice +
                ':' +
                opcaoIndice +
                '" aria-pressed="' +
                selecionada +
                '"><span aria-hidden="true">' +
                (selecionada ? '✓ ' : '○ ') +
                '</span>' +
                escapar(opcao) +
                '</button>'
              );
            })
            .join('') +
          '</div></fieldset>'
        );
      })
      .join('');
  }

  function montar(item, respostas, escapar) {
    if (item.tipo === 'misto') return montarMisto(item, respostas, escapar);
    if (item.tipo === 'selecao') {
      var marcadas = Array.isArray(respostas[0]) ? respostas[0] : [];
      return (
        '<fieldset class="questao-mariana"><legend>' +
        escapar(item.itens[0].pergunta) +
        '</legend><p>Marque todas as corretas. Clique novamente para desmarcar.</p><div class="opcoes-mariana">' +
        item.itens[0].opcoes
          .map(function (opcao, indice) {
            var selecionada = marcadas.indexOf(opcao) >= 0;
            return (
              '<button type="button" class="opcao-mariana' +
              (selecionada ? ' selecionada' : '') +
              '" data-selecao="' +
              indice +
              '" aria-pressed="' +
              selecionada +
              '"><span aria-hidden="true">' +
              (selecionada ? '✓ ' : '□ ') +
              '</span>' +
              escapar(opcao) +
              '</button>'
            );
          })
          .join('') +
        '</div></fieldset>'
      );
    }
    return (
      '<div class="ordem-questionario"><p>Escolha um cartão para ocupar a próxima posição vazia. Para desfazer, clique no cartão colocado.</p>' +
      '<ol aria-label="Do mais antigo ao mais recente">' +
      item.itens
        .map(function (_subitem, indice) {
          return (
            '<li>' +
            (respostas[indice]
              ? '<button class="botao-secundario" type="button" data-retirar-ordem="' +
                indice +
                '" aria-label="Retirar da posição ' +
                (indice + 1) +
                ': ' +
                escapar(respostas[indice]) +
                '">' +
                escapar(respostas[indice]) +
                ' · Retirar</button>'
              : '<span>Posição ' + (indice + 1) + ' — escolha um cartão</span>') +
            '</li>'
          );
        })
        .join('') +
      '</ol><div class="opcoes-mariana" aria-label="Cartões disponíveis">' +
      item.cartoes
        .map(function (cartao, indice) {
          return (
            '<button class="opcao-mariana" type="button" data-colocar-ordem="' +
            indice +
            '"' +
            (respostas.indexOf(cartao) >= 0 ? ' disabled' : '') +
            '>' +
            escapar(cartao) +
            '</button>'
          );
        })
        .join('') +
      '</div><button class="botao-secundario" type="button" data-limpar-ordem>Limpar sequência</button></div>'
    );
  }

  function configurarMisto(area, item, obter, salvar, escapar) {
    area.addEventListener('click', function (evento) {
      var botao = evento.target.closest('button');
      if (!botao || !area.contains(botao)) return;
      var respostas = obter();
      var partes;
      var indice;
      var opcaoIndice;
      var foco;
      if (botao.hasAttribute('data-selecao-misto')) {
        partes = botao.dataset.selecaoMisto.split(':').map(Number);
        indice = partes[0];
        opcaoIndice = partes[1];
        var opcao = item.itens[indice].opcoes[opcaoIndice];
        var marcadas = Array.isArray(respostas[indice]) ? respostas[indice].slice() : [];
        var marcada = marcadas.indexOf(opcao);
        if (marcada >= 0) marcadas.splice(marcada, 1);
        else marcadas.push(opcao);
        respostas[indice] = marcadas;
        foco = '[data-selecao-misto="' + indice + ':' + opcaoIndice + '"]';
      } else if (botao.hasAttribute('data-opcao-misto')) {
        partes = botao.dataset.opcaoMisto.split(':').map(Number);
        indice = partes[0];
        opcaoIndice = partes[1];
        var valor = item.itens[indice].opcoes[opcaoIndice];
        respostas[indice] = respostas[indice] === valor ? '' : valor;
        foco = '[data-opcao-misto="' + indice + ':' + opcaoIndice + '"]';
      } else if (botao.hasAttribute('data-colocar-ordem-misto')) {
        partes = botao.dataset.colocarOrdemMisto.split(':').map(Number);
        indice = partes[0];
        opcaoIndice = partes[1];
        var ordem = Array.isArray(respostas[indice]) ? respostas[indice].slice() : [];
        if (ordem.length >= item.itens[indice].respostas.length) return;
        ordem.push(item.itens[indice].cartoes[opcaoIndice]);
        respostas[indice] = ordem;
        foco = '[data-retirar-ordem-misto="' + indice + ':' + (ordem.length - 1) + '"]';
      } else if (botao.hasAttribute('data-retirar-ordem-misto')) {
        partes = botao.dataset.retirarOrdemMisto.split(':').map(Number);
        indice = partes[0];
        var posicao = partes[1];
        var ordemAtual = Array.isArray(respostas[indice]) ? respostas[indice].slice() : [];
        var cartaoRetirado = ordemAtual[posicao];
        ordemAtual.splice(posicao, 1);
        respostas[indice] = ordemAtual;
        foco =
          '[data-colocar-ordem-misto="' +
          indice +
          ':' +
          item.itens[indice].cartoes.indexOf(cartaoRetirado) +
          '"]';
      } else if (botao.hasAttribute('data-limpar-ordem-misto')) {
        indice = Number(botao.dataset.limparOrdemMisto);
        respostas[indice] = [];
        foco = '[data-colocar-ordem-misto^="' + indice + ':"]';
      } else return;
      salvar(respostas);
      area.innerHTML = montarMisto(item, respostas, escapar);
      var alvo = area.querySelector(foco);
      if (alvo) alvo.focus();
    });
  }

  function configurar(conteudo, item, obter, salvar, escapar) {
    var area = conteudo.querySelector('[data-interacao-questionario]');
    if (item.tipo === 'misto') {
      configurarMisto(area, item, obter, salvar, escapar);
      return;
    }
    area.addEventListener('click', function (evento) {
      var botao = evento.target.closest('button');
      if (!botao || !area.contains(botao)) return;
      var respostas = obter();
      if (botao.hasAttribute('data-selecao')) {
        var opcao = item.itens[0].opcoes[Number(botao.dataset.selecao)];
        var marcadas = Array.isArray(respostas[0]) ? respostas[0].slice() : [];
        var indice = marcadas.indexOf(opcao);
        if (indice >= 0) marcadas.splice(indice, 1);
        else marcadas.push(opcao);
        respostas[0] = marcadas;
        botao.setAttribute('aria-pressed', String(indice < 0));
        botao.classList.toggle('selecionada', indice < 0);
        botao.querySelector('span').textContent = indice < 0 ? '✓ ' : '□ ';
        salvar(respostas);
        return;
      }
      var foco;
      if (botao.hasAttribute('data-colocar-ordem')) {
        var posicao = item.itens.findIndex(function (_subitem, i) {
          return !respostas[i];
        });
        if (posicao < 0) return;
        respostas[posicao] = item.cartoes[Number(botao.dataset.colocarOrdem)];
        foco = '[data-retirar-ordem="' + posicao + '"]';
      } else if (botao.hasAttribute('data-retirar-ordem')) {
        var retirar = Number(botao.dataset.retirarOrdem);
        foco = '[data-colocar-ordem="' + item.cartoes.indexOf(respostas[retirar]) + '"]';
        respostas[retirar] = '';
      } else if (botao.hasAttribute('data-limpar-ordem')) {
        respostas = [];
        foco = '[data-colocar-ordem]';
      } else return;
      salvar(respostas);
      area.innerHTML = montar(item, respostas, escapar);
      area.querySelector(foco).focus();
    });
  }

  window.QuestionariosInteracoes = {
    aceita: aceita,
    montar: montar,
    configurar: configurar,
    acertos: acertos,
  };
})();
