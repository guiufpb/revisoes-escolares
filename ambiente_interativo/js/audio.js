(function () {
  'use strict';

  var sintetizador = window.speechSynthesis;
  var temporizador = null;
  var sequencia = 0;
  var ultimaSolicitacao = null;
  var vozes = [];
  var inicializado = false;
  var ATRASO_INICIAL_PADRAO = 1000;
  var PAUSA_APOS_AQUECIMENTO_PADRAO = 250;
  var PAUSA_APOS_AVISO_PADRAO = 600;
  var VOLUME_AQUECIMENTO = 0.01;

  function textoSeguro(valor, limite) {
    return String(valor || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limite || 500);
  }

  function idiomaNormalizado(idioma) {
    var valor = textoSeguro(idioma, 20).toLowerCase();
    if (valor === 'en' || valor.indexOf('en-') === 0) return 'en-US';
    return 'pt-BR';
  }

  function atualizarVozes() {
    if (!sintetizador || typeof sintetizador.getVoices !== 'function') {
      vozes = [];
      return vozes;
    }
    vozes = sintetizador.getVoices().filter(function (voz) {
      return voz && voz.localService !== false;
    });
    return vozes;
  }

  function pontuarVoz(voz, idioma) {
    var linguagem = String(voz.lang || '').toLowerCase();
    var nome = String(voz.name || '').toLowerCase();
    var desejado = idioma.toLowerCase();
    var prefixo = desejado.split('-')[0];
    var pontos = 0;
    if (linguagem === desejado) pontos += 100;
    else if (linguagem.indexOf(prefixo + '-') === 0 || linguagem === prefixo) pontos += 60;
    if (/natural|neural/.test(nome)) pontos += 12;
    if (/microsoft|zira|aria|jenny|maria|daniel/.test(nome)) pontos += 5;
    if (voz.default) pontos += 2;
    return pontos;
  }

  function selecionarVoz(idioma) {
    atualizarVozes();
    return (
      vozes
        .map(function (voz) {
          return { voz: voz, pontos: pontuarVoz(voz, idioma) };
        })
        .filter(function (item) {
          return item.pontos >= 60;
        })
        .sort(function (a, b) {
          return b.pontos - a.pontos;
        })[0]?.voz || null
    );
  }

  function emitir(fase, mensagem, configuracao, extras) {
    var detalhe = Object.assign(
      {
        fase: fase,
        mensagem: mensagem,
        origem: configuracao && configuracao.origem ? configuracao.origem : 'geral',
        idioma: configuracao && configuracao.idioma ? configuracao.idioma : null,
        texto: configuracao && configuracao.texto ? configuracao.texto : null,
      },
      extras || {}
    );
    document.dispatchEvent(new CustomEvent('audioestadoalterado', { detail: detalhe }));
    if (configuracao && typeof configuracao.aoEstado === 'function') {
      configuracao.aoEstado(detalhe);
    }
  }

  function limparTemporizador() {
    if (temporizador === null) return;
    window.clearTimeout(temporizador);
    temporizador = null;
  }

  function parar(opcoes) {
    opcoes = opcoes || {};
    sequencia += 1;
    limparTemporizador();
    if (sintetizador && typeof sintetizador.cancel === 'function') {
      sintetizador.cancel();
    }
    if (!opcoes.silencioso) {
      emitir('parado', 'Áudio interrompido.', { origem: opcoes.origem || 'geral' });
    }
  }

  function configurarFala(texto, idioma, velocidade, voz, volume) {
    var fala = new window.SpeechSynthesisUtterance(texto);
    fala.lang = idioma;
    fala.rate = velocidade;
    fala.pitch = 1;
    fala.volume = Number.isFinite(volume) ? volume : 1;
    if (voz) fala.voice = voz;
    return fala;
  }

  function aquecimentoParaIdioma(idioma) {
    return idioma === 'en-US' ? 'Ready.' : 'Preparando.';
  }

  function avisoParaIdioma(idioma) {
    return idioma === 'en-US' ? 'Listen.' : 'Atenção.';
  }

  function contextoDaFala(configuracao) {
    return {
      ehDitado: configuracao && configuracao.contexto === 'ditado',
      unidade: configuracao && configuracao.unidadeDitado === 'frase' ? 'frase' : 'palavra',
    };
  }

  function mensagemInicial(idioma, configuracao) {
    var contexto = contextoDaFala(configuracao);
    if (idioma === 'pt-BR' && contexto.ehDitado) {
      return (
        'O ditado começará em 1 segundo. Você ouvirá “Atenção” antes da ' + contexto.unidade + '.'
      );
    }
    return idioma === 'en-US'
      ? 'O áudio começará em 1 segundo. Você ouvirá “Listen” antes do conteúdo em inglês.'
      : 'O áudio começará em 1 segundo. Você ouvirá “Atenção” antes da instrução.';
  }

  function falar(opcoes, registrarComoUltima) {
    opcoes = opcoes || {};
    var texto = textoSeguro(opcoes.texto);
    var idioma = idiomaNormalizado(opcoes.idioma);
    var velocidade = Math.max(0.5, Math.min(1.2, Number(opcoes.velocidade) || 0.82));
    var atrasoInicial = Math.max(
      0,
      Number.isFinite(Number(opcoes.atrasoInicial))
        ? Number(opcoes.atrasoInicial)
        : ATRASO_INICIAL_PADRAO
    );
    var pausaAposAviso = Math.max(
      0,
      Number.isFinite(Number(opcoes.pausaAposAviso))
        ? Number(opcoes.pausaAposAviso)
        : PAUSA_APOS_AVISO_PADRAO
    );
    var pausaAposAquecimento = Math.max(
      0,
      Number.isFinite(Number(opcoes.pausaAposAquecimento))
        ? Number(opcoes.pausaAposAquecimento)
        : PAUSA_APOS_AQUECIMENTO_PADRAO
    );

    if (!texto) {
      emitir('erro', 'Não há texto para reproduzir.', opcoes);
      return false;
    }
    if (
      !sintetizador ||
      typeof window.SpeechSynthesisUtterance !== 'function' ||
      typeof sintetizador.speak !== 'function'
    ) {
      emitir(
        'erro',
        'Este navegador não oferece leitura em voz alta. Tente abrir pelo Chromium.',
        opcoes
      );
      return false;
    }

    var voz = selecionarVoz(idioma);
    if (!voz) {
      emitir(
        'erro',
        idioma === 'en-US'
          ? 'Não foi encontrada uma voz inglesa local. Instale uma voz de Inglês no Windows e reabra o navegador.'
          : 'Não foi encontrada uma voz portuguesa local. Instale uma voz em Português no Windows e reabra o navegador.',
        opcoes
      );
      return false;
    }

    parar({ silencioso: true });
    var sequenciaAtual = sequencia;
    var configuracao = Object.assign({}, opcoes, {
      texto: texto,
      idioma: idioma,
      velocidade: velocidade,
      atrasoInicial: atrasoInicial,
      pausaAposAquecimento: pausaAposAquecimento,
      pausaAposAviso: pausaAposAviso,
    });
    if (registrarComoUltima !== false) {
      ultimaSolicitacao = configuracao;
    }

    var nomeVoz = voz.name;
    // O Chromium/Windows pode cortar o começo do primeiro enunciado depois que a voz
    // fica ociosa. Esta fala quase inaudível absorve esse corte antes do aviso audível.
    var aquecimento = configurarFala(
      aquecimentoParaIdioma(idioma),
      idioma,
      0.9,
      voz,
      VOLUME_AQUECIMENTO
    );
    var aviso = configurarFala(avisoParaIdioma(idioma), idioma, 0.9, voz);
    var conteudo = configurarFala(texto, idioma, velocidade, voz);
    var contexto = contextoDaFala(configuracao);
    var avisoAgendado = false;
    var conteudoAgendado = false;

    function aindaValido() {
      return sequenciaAtual === sequencia;
    }

    function agendarConteudo() {
      if (!aindaValido() || conteudoAgendado) return;
      conteudoAgendado = true;
      emitir(
        'pausa',
        idioma === 'en-US'
          ? 'Listen. O conteúdo em inglês começará depois de uma pequena pausa.'
          : contexto.ehDitado
            ? 'Atenção. A ' + contexto.unidade + ' começará depois de uma pequena pausa.'
            : 'Atenção. A instrução começará depois de uma pequena pausa.',
        configuracao,
        { voz: nomeVoz }
      );
      temporizador = window.setTimeout(function () {
        temporizador = null;
        if (!aindaValido()) return;
        if (typeof sintetizador.resume === 'function') sintetizador.resume();
        sintetizador.speak(conteudo);
      }, pausaAposAviso);
    }

    function agendarAviso() {
      if (!aindaValido() || avisoAgendado) return;
      avisoAgendado = true;
      temporizador = window.setTimeout(function () {
        temporizador = null;
        if (!aindaValido()) return;
        if (typeof sintetizador.resume === 'function') sintetizador.resume();
        sintetizador.speak(aviso);
      }, pausaAposAquecimento);
    }

    aquecimento.onend = agendarAviso;
    aquecimento.onerror = agendarAviso;

    aviso.onstart = function () {
      if (!aindaValido()) return;
      emitir(
        'aviso',
        idioma === 'en-US' ? 'Listen. Prepare-se para ouvir.' : 'Atenção. Prepare-se para ouvir.',
        configuracao,
        { voz: nomeVoz }
      );
    };
    aviso.onend = agendarConteudo;
    aviso.onerror = agendarConteudo;
    conteudo.onstart = function () {
      if (!aindaValido()) return;
      emitir(
        'reproduzindo',
        contexto.ehDitado
          ? 'Reproduzindo a ' + contexto.unidade + ' com ' + nomeVoz + '.'
          : 'Reproduzindo com ' + nomeVoz + '.',
        configuracao,
        { voz: nomeVoz }
      );
    };
    conteudo.onend = function () {
      if (!aindaValido()) return;
      emitir(
        'concluido',
        contexto.ehDitado
          ? 'Ditado concluído. Agora digite o que você ouviu.'
          : 'Áudio concluído. Você pode repetir ou ouvir mais devagar.',
        configuracao,
        {
          voz: nomeVoz,
        }
      );
    };
    conteudo.onerror = function () {
      if (!aindaValido()) return;
      emitir('erro', 'Não foi possível reproduzir este áudio. Tente novamente.', configuracao, {
        voz: nomeVoz,
      });
    };

    emitir('aguardando', mensagemInicial(idioma, configuracao), configuracao, {
      voz: nomeVoz,
    });
    temporizador = window.setTimeout(function () {
      temporizador = null;
      if (!aindaValido()) return;
      if (typeof sintetizador.resume === 'function') sintetizador.resume();
      sintetizador.speak(aquecimento);
    }, atrasoInicial);
    return true;
  }

  function repetir() {
    if (!ultimaSolicitacao) {
      emitir('erro', 'Escolha primeiro uma instrução, palavra ou frase para ouvir.', {
        origem: 'geral',
      });
      return false;
    }
    return falar(ultimaSolicitacao, false);
  }

  function inicializar() {
    if (inicializado) return;
    inicializado = true;
    atualizarVozes();
    if (sintetizador && typeof sintetizador.addEventListener === 'function') {
      sintetizador.addEventListener('voiceschanged', atualizarVozes);
    }
  }

  inicializar();

  window.AudioRevisoes = {
    falar: falar,
    parar: parar,
    repetir: repetir,
    atualizarVozes: atualizarVozes,
    obterVoz: function (idioma) {
      var voz = selecionarVoz(idiomaNormalizado(idioma));
      return voz ? { nome: voz.name, idioma: voz.lang, local: voz.localService !== false } : null;
    },
    obterUltimaSolicitacao: function () {
      return ultimaSolicitacao
        ? {
            texto: ultimaSolicitacao.texto,
            idioma: ultimaSolicitacao.idioma,
            velocidade: ultimaSolicitacao.velocidade,
            origem: ultimaSolicitacao.origem,
            contexto: ultimaSolicitacao.contexto,
            unidadeDitado: ultimaSolicitacao.unidadeDitado,
          }
        : null;
    },
  };
})();
