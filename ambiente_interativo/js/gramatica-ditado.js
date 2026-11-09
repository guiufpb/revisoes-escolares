(function () {
  'use strict';

  function escaparTexto(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function painelHtml(unidade, instrucao, idioma) {
    var frase = unidade === 'frase';
    return (
      '<section class="painel-ditado-gramatica" aria-label="Ditado em ' +
      (idioma === 'en-US' ? 'inglês' : 'português') +
      '">' +
      '<p>' +
      (instrucao
        ? escaparTexto(instrucao)
        : frase
          ? 'Ouça a frase e escreva com atenção às letras e aos sinais de pontuação.'
          : 'Se a palavra da lacuna não estiver clara, ouça o ditado e escreva o que você ouviu.') +
      '</p>' +
      '<div class="controles-ditado-gramatica">' +
      '<button class="botao-secundario" type="button" data-repetir-ditado-gramatica disabled>↻ Repetir última ' +
      (frase ? 'frase' : 'palavra') +
      '</button>' +
      '<button class="botao-secundario" type="button" data-parar-ditado-gramatica>■ Parar</button>' +
      '</div><div class="status-ditado-gramatica" role="status" aria-live="polite">Escolha uma lacuna e clique em Ouvir ' +
      (frase ? 'frase' : 'palavra') +
      '.</div>' +
      '</section>'
    );
  }

  function botaoHtml(indice, unidade, rotulo) {
    var nome = unidade === 'frase' ? 'frase' : 'palavra';
    return (
      '<button class="botao-secundario botao-ouvir-palavra" type="button" ' +
      'data-ouvir-ditado-gramatica="' +
      indice +
      '" aria-label="' +
      escaparTexto(rotulo || 'Ouvir a ' + nome + ' da lacuna ' + (indice + 1)) +
      '">🔊 Ouvir ' +
      escaparTexto(rotulo ? rotulo.replace(/^Ouvir /, '') : nome) +
      '</button>'
    );
  }

  function parar(silencioso) {
    if (!window.AudioRevisoes) return;
    window.AudioRevisoes.parar({
      silencioso: silencioso !== false,
      origem: 'gramatica',
    });
  }

  function configurar(conteudo, item, autorizada) {
    if (!item.ditado || !window.AudioRevisoes) return;
    var formulario = conteudo.firstElementChild;
    var solicitacao = 0;
    function vigente() {
      return (
        formulario &&
        formulario.isConnected &&
        conteudo.contains(formulario) &&
        (!autorizada || autorizada() === true)
      );
    }
    function proteger(callback) {
      return function () {
        if (vigente()) return callback.apply(this, arguments);
      };
    }
    var status = conteudo.querySelector('.status-ditado-gramatica');
    var repetir = conteudo.querySelector('[data-repetir-ditado-gramatica]');
    var pararBotao = conteudo.querySelector('[data-parar-ditado-gramatica]');
    if (item.cancelarAoTrocarCampo) {
      var campoAtivo = null;
      // O formulário é recriado a cada questão; não acumule listeners no painel persistente.
      conteudo.querySelector('.lista-campos-mariana').addEventListener(
        'focusin',
        proteger(function (evento) {
          var alvo = evento.target;
          var indice = alvo.getAttribute('data-resposta-gramatica');
          if (indice === null) indice = alvo.getAttribute('data-ouvir-ditado-gramatica');
          if (indice === null) return;
          if (campoAtivo !== null && campoAtivo !== indice) {
            parar(false);
            repetir.disabled = true;
          }
          campoAtivo = indice;
        })
      );
    }

    function atualizarStatus(detalhe) {
      if (vigente() && status && status.isConnected) status.textContent = detalhe.mensagem;
    }

    conteudo.querySelectorAll('[data-ouvir-ditado-gramatica]').forEach(function (botao) {
      botao.addEventListener(
        'click',
        proteger(function () {
          var indice = Number(botao.dataset.ouvirDitadoGramatica);
          var subitem = item.itens[indice];
          var texto =
            subitem &&
            (typeof subitem.textoDitado === 'string'
              ? subitem.textoDitado
              : subitem.respostas && subitem.respostas[0]);
          var token = ++solicitacao;
          var iniciou = window.AudioRevisoes.falar({
            texto: texto,
            idioma: item.idiomaDitado === 'en-US' ? 'en-US' : 'pt-BR',
            velocidade: 0.78,
            origem: 'gramatica',
            contexto: 'ditado',
            unidadeDitado: item.unidadeDitado === 'frase' ? 'frase' : 'palavra',
            aoEstado: function (detalhe) {
              if (token === solicitacao) atualizarStatus(detalhe);
            },
          });
          repetir.disabled = !iniciou;
        })
      );
    });

    repetir.addEventListener(
      'click',
      proteger(function () {
        if (!window.AudioRevisoes.repetir()) {
          atualizarStatus({ mensagem: 'Escolha primeiro uma lacuna para ouvir.' });
        }
      })
    );
    pararBotao.addEventListener(
      'click',
      proteger(function () {
        parar(false);
        atualizarStatus({ mensagem: 'Áudio interrompido.' });
      })
    );
  }

  window.GramaticaDitado = {
    painelHtml: painelHtml,
    botaoHtml: botaoHtml,
    configurar: configurar,
    parar: parar,
  };
})();
