(function () {
  'use strict';

  function painelHtml() {
    return (
      '<section class="painel-ditado-gramatica" aria-label="Ditado em português">' +
      '<p>Se a palavra da lacuna não estiver clara, ouça o ditado e escreva o que você ouviu.</p>' +
      '<div class="controles-ditado-gramatica">' +
      '<button class="botao-secundario" type="button" data-repetir-ditado-gramatica disabled>↻ Repetir última palavra</button>' +
      '<button class="botao-secundario" type="button" data-parar-ditado-gramatica>■ Parar</button>' +
      '</div><div class="status-ditado-gramatica" role="status" aria-live="polite">Escolha uma lacuna e clique em Ouvir palavra.</div>' +
      '</section>'
    );
  }

  function botaoHtml(indice) {
    return (
      '<button class="botao-secundario botao-ouvir-palavra" type="button" ' +
      'data-ouvir-ditado-gramatica="' +
      indice +
      '" aria-label="Ouvir a palavra da lacuna ' +
      (indice + 1) +
      '">🔊 Ouvir palavra</button>'
    );
  }

  function parar(silencioso) {
    if (!window.AudioRevisoes) return;
    window.AudioRevisoes.parar({
      silencioso: silencioso !== false,
      origem: 'gramatica',
    });
  }

  function configurar(conteudo, item) {
    if (!item.ditado || !window.AudioRevisoes) return;
    var status = conteudo.querySelector('.status-ditado-gramatica');
    var repetir = conteudo.querySelector('[data-repetir-ditado-gramatica]');
    var pararBotao = conteudo.querySelector('[data-parar-ditado-gramatica]');

    function atualizarStatus(detalhe) {
      if (status && status.isConnected) status.textContent = detalhe.mensagem;
    }

    conteudo.querySelectorAll('[data-ouvir-ditado-gramatica]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var indice = Number(botao.dataset.ouvirDitadoGramatica);
        var subitem = item.itens[indice];
        var texto = subitem && subitem.respostas && subitem.respostas[0];
        var iniciou = window.AudioRevisoes.falar({
          texto: texto,
          idioma: 'pt-BR',
          velocidade: 0.78,
          origem: 'gramatica',
          contexto: 'ditado',
          unidadeDitado: 'palavra',
          aoEstado: atualizarStatus,
        });
        repetir.disabled = !iniciou;
      });
    });

    repetir.addEventListener('click', function () {
      if (!window.AudioRevisoes.repetir()) {
        atualizarStatus({ mensagem: 'Escolha primeiro uma palavra para ouvir.' });
      }
    });
    pararBotao.addEventListener('click', function () {
      parar(false);
      atualizarStatus({ mensagem: 'Áudio interrompido.' });
    });
  }

  window.GramaticaDitado = {
    painelHtml: painelHtml,
    botaoHtml: botaoHtml,
    configurar: configurar,
    parar: parar,
  };
})();
