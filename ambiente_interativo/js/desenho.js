(function () {
  'use strict';

  var controles = new WeakMap();
  var ativos = [];

  function encontrarControle(canvas, seletores) {
    var recipiente =
      canvas.closest('.atividade-corpo, .atividade-mariana, article') || canvas.parentElement;
    return recipiente ? recipiente.querySelector(seletores) : null;
  }

  function preparar(canvas, opcoes) {
    opcoes = opcoes || {};
    if (!canvas || typeof canvas.getContext !== 'function') {
      return function () {};
    }

    var anterior = controles.get(canvas);
    if (anterior) {
      anterior();
    }

    var contexto = canvas.getContext('2d');
    var cor = encontrarControle(canvas, '[data-cor-canvas], [data-canvas-cor]');
    var espessura = encontrarControle(canvas, '[data-espessura-canvas], [data-canvas-espessura]');
    var limpar = encontrarControle(canvas, '[data-limpar-canvas], [data-canvas-limpar]');
    var desfazer = encontrarControle(canvas, '[data-canvas-desfazer]');
    var salvar = encontrarControle(canvas, '[data-salvar-canvas]');
    var desenhando = false;
    var pontoAnterior = null;
    var ponteiroAtivo = null;
    var historico = [];
    var temporizador = null;
    var alteracaoPendente = false;
    var destruido = false;
    var observador = null;

    function dimensoes() {
      var retangulo = canvas.getBoundingClientRect();
      return { largura: retangulo.width, altura: retangulo.height };
    }

    function configurarContexto(proporcao) {
      contexto = canvas.getContext('2d');
      contexto.setTransform(proporcao, 0, 0, proporcao, 0, 0);
      contexto.lineCap = 'round';
      contexto.lineJoin = 'round';
    }

    function desenharImagem(dados, aoTerminar) {
      if (typeof dados !== 'string' || dados.indexOf('data:image/') !== 0) {
        return;
      }
      var imagem = new Image();
      imagem.onload = function () {
        if (destruido) return;
        var tamanho = dimensoes();
        contexto.clearRect(0, 0, tamanho.largura, tamanho.altura);
        contexto.drawImage(imagem, 0, 0, tamanho.largura, tamanho.altura);
        canvas.dataset.temDesenho = 'true';
        if (typeof aoTerminar === 'function') aoTerminar();
      };
      imagem.onerror = function () {
        console.warn('Um desenho salvo não pôde ser restaurado no canvas #' + canvas.id + '.');
        if (typeof aoTerminar === 'function') aoTerminar();
      };
      imagem.src = dados;
    }

    function obterImagem() {
      try {
        return canvas.dataset.temDesenho === 'true' ? canvas.toDataURL('image/png') : null;
      } catch (erro) {
        console.warn('O desenho não pôde ser convertido para salvamento.', erro);
        return null;
      }
    }

    function ajustarResolucao() {
      if (destruido) return;
      var tamanho = dimensoes();
      if (tamanho.largura <= 0 || tamanho.altura <= 0) return;

      var imagemAnterior = obterImagem();
      var proporcao = Math.max(1, window.devicePixelRatio || 1);
      var largura = Math.max(1, Math.round(tamanho.largura * proporcao));
      var altura = Math.max(1, Math.round(tamanho.altura * proporcao));
      if (canvas.width === largura && canvas.height === altura) return;

      canvas.width = largura;
      canvas.height = altura;
      configurarContexto(proporcao);
      if (imagemAnterior) desenharImagem(imagemAnterior);
    }

    function ponto(evento) {
      var retangulo = canvas.getBoundingClientRect();
      return { x: evento.clientX - retangulo.left, y: evento.clientY - retangulo.top };
    }

    function registrarHistorico() {
      var imagem = obterImagem();
      historico.push(imagem);
      if (historico.length > 15) historico.shift();
    }

    function notificar(imediato) {
      if (temporizador) window.clearTimeout(temporizador);
      alteracaoPendente = true;
      var executar = function () {
        temporizador = null;
        alteracaoPendente = false;
        if (typeof opcoes.aoAlterar === 'function') {
          opcoes.aoAlterar(obterImagem());
        }
        canvas.dispatchEvent(new CustomEvent('desenhoalterado', { bubbles: true }));
      };
      if (imediato) executar();
      else temporizador = window.setTimeout(executar, 180);
    }

    function iniciar(evento) {
      if ((evento.pointerType === 'mouse' && evento.button !== 0) || desenhando) return;
      registrarHistorico();
      desenhando = true;
      ponteiroAtivo = evento.pointerId;
      pontoAnterior = ponto(evento);
      if (canvas.setPointerCapture) canvas.setPointerCapture(evento.pointerId);
      evento.preventDefault();
    }

    function desenhar(evento) {
      if (!desenhando || evento.pointerId !== ponteiroAtivo || !pontoAnterior) return;
      var atual = ponto(evento);
      var base = Math.max(1, Number(espessura ? espessura.value : 6) || 6);
      var pressao = evento.pointerType === 'pen' && evento.pressure > 0 ? evento.pressure : 0.5;
      contexto.strokeStyle = cor ? cor.value : '#6546c4';
      contexto.lineWidth =
        evento.pointerType === 'pen' ? Math.max(1, base * (0.45 + pressao)) : base;
      contexto.beginPath();
      contexto.moveTo(pontoAnterior.x, pontoAnterior.y);
      contexto.lineTo(atual.x, atual.y);
      contexto.stroke();
      pontoAnterior = atual;
      canvas.dataset.temDesenho = 'true';
      evento.preventDefault();
    }

    function finalizar(evento) {
      if (!desenhando || evento.pointerId !== ponteiroAtivo) return;
      desenhando = false;
      pontoAnterior = null;
      if (canvas.hasPointerCapture && canvas.hasPointerCapture(evento.pointerId)) {
        canvas.releasePointerCapture(evento.pointerId);
      }
      ponteiroAtivo = null;
      notificar(false);
    }

    function limparCanvas() {
      registrarHistorico();
      var tamanho = dimensoes();
      contexto.clearRect(0, 0, tamanho.largura, tamanho.altura);
      canvas.dataset.temDesenho = 'false';
      notificar(true);
    }

    function desfazerCanvas() {
      if (!historico.length) return;
      var anterior = historico.pop();
      var tamanho = dimensoes();
      contexto.clearRect(0, 0, tamanho.largura, tamanho.altura);
      canvas.dataset.temDesenho = anterior ? 'true' : 'false';
      if (anterior)
        desenharImagem(anterior, function () {
          notificar(true);
        });
      else notificar(true);
    }

    function salvarCanvas() {
      notificar(true);
      if (typeof opcoes.aoSalvar === 'function') opcoes.aoSalvar(obterImagem());
    }

    canvas.addEventListener('pointerdown', iniciar);
    canvas.addEventListener('pointermove', desenhar);
    canvas.addEventListener('pointerup', finalizar);
    canvas.addEventListener('pointercancel', finalizar);
    if (limpar) limpar.addEventListener('click', limparCanvas);
    if (desfazer) desfazer.addEventListener('click', desfazerCanvas);
    if (salvar) salvar.addEventListener('click', salvarCanvas);

    if (window.ResizeObserver) {
      observador = new window.ResizeObserver(ajustarResolucao);
      observador.observe(canvas);
    } else {
      window.addEventListener('resize', ajustarResolucao);
    }

    ajustarResolucao();
    desenharImagem(opcoes.dadosIniciais);

    function destruir() {
      if (destruido) return;
      destruido = true;
      if (temporizador) window.clearTimeout(temporizador);
      if (alteracaoPendente && typeof opcoes.aoAlterar === 'function') {
        alteracaoPendente = false;
        opcoes.aoAlterar(obterImagem());
      }
      canvas.removeEventListener('pointerdown', iniciar);
      canvas.removeEventListener('pointermove', desenhar);
      canvas.removeEventListener('pointerup', finalizar);
      canvas.removeEventListener('pointercancel', finalizar);
      if (limpar) limpar.removeEventListener('click', limparCanvas);
      if (desfazer) desfazer.removeEventListener('click', desfazerCanvas);
      if (salvar) salvar.removeEventListener('click', salvarCanvas);
      if (observador) observador.disconnect();
      else window.removeEventListener('resize', ajustarResolucao);
      controles.delete(canvas);
      ativos = ativos.filter(function (item) {
        return item.canvas !== canvas;
      });
    }

    controles.set(canvas, destruir);
    ativos.push({ canvas: canvas, destruir: destruir, ajustar: ajustarResolucao });
    return destruir;
  }

  function inicializar(recipiente, opcoes) {
    var raiz = recipiente && recipiente.querySelectorAll ? recipiente : document;
    var seletores = 'canvas.area-desenho, canvas.canvas-mariana';
    return Array.from(raiz.querySelectorAll(seletores)).map(function (canvas) {
      return preparar(canvas, typeof opcoes === 'function' ? opcoes(canvas) : opcoes);
    });
  }

  function descartar(recipiente) {
    ativos.slice().forEach(function (item) {
      if (!recipiente || recipiente === item.canvas || recipiente.contains(item.canvas)) {
        item.destruir();
      }
    });
  }

  window.DesenhoRevisoes = {
    preparar: preparar,
    inicializar: inicializar,
    descartar: descartar,
    ajustarTodos: function () {
      ativos.slice().forEach(function (item) {
        item.ajustar();
      });
    },
  };
})();
