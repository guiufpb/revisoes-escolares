(function () {
  'use strict';

  var sintetizador = window.speechSynthesis;
  var sequencia = 0;
  var ultimaSolicitacao = null;
  var solicitacaoAtiva = null;
  var vozes = [];
  var inicializado = false;

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

  function unidadeNormalizada(configuracao) {
    var unidade = textoSeguro(
      configuracao && (configuracao.unidadeAudio || configuracao.unidadeDitado),
      20
    ).toLowerCase();
    if (unidade === 'frase') return 'frase';
    if (unidade === 'instrucao' || unidade === 'instrução') return 'instrucao';
    return 'palavra';
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

  function parar(opcoes) {
    opcoes = opcoes || {};
    var ativa = solicitacaoAtiva;
    sequencia += 1;
    solicitacaoAtiva = null;
    if (sintetizador && typeof sintetizador.cancel === 'function') sintetizador.cancel();
    if (ativa) {
      emitir('cancelado', 'Áudio interrompido.', ativa);
      return;
    }
    if (!opcoes.silencioso) {
      emitir('parado', 'Áudio interrompido.', { origem: opcoes.origem || 'geral' });
    }
  }

  function configurarFala(texto, idioma, velocidade, voz) {
    var fala = new window.SpeechSynthesisUtterance(texto);
    fala.lang = idioma;
    fala.rate = velocidade;
    fala.pitch = 1;
    fala.volume = 1;
    if (voz) fala.voice = voz;
    return fala;
  }

  function textoProtegido(texto, idioma, unidade) {
    if (idioma === 'en-US') return (unidade === 'frase' ? 'Phrase: ' : 'Word: ') + texto;
    if (unidade === 'frase') return 'A frase é: ' + texto;
    if (unidade === 'palavra') return 'A palavra é: ' + texto;
    return 'Instrução: ' + texto;
  }

  function mensagemInicial(idioma, unidade) {
    if (idioma === 'en-US') return 'Preparando o áudio em inglês.';
    if (unidade === 'instrucao') return 'Preparando a instrução em áudio.';
    return 'Preparando o ditado da ' + unidade + '.';
  }

  function falar(opcoes, registrarComoUltima, controleInterno) {
    opcoes = opcoes || {};
    controleInterno = controleInterno || {};
    var texto = textoSeguro(opcoes.texto);
    var idioma = idiomaNormalizado(opcoes.idioma);
    var velocidade = Math.max(0.5, Math.min(1.2, Number(opcoes.velocidade) || 0.82));
    var unidade = unidadeNormalizada(opcoes);

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

    if (!controleInterno.preservarSequencia) parar({ silencioso: true });
    var sequenciaAtual = controleInterno.sequenciaAtual || sequencia;
    var configuracao = Object.assign({}, opcoes, {
      texto: texto,
      idioma: idioma,
      velocidade: velocidade,
      unidadeAudio: unidade,
    });
    if (registrarComoUltima !== false) ultimaSolicitacao = configuracao;

    var nomeVoz = voz.name;
    var conteudo = configurarFala(textoProtegido(texto, idioma, unidade), idioma, velocidade, voz);

    function aindaValido() {
      return sequenciaAtual === sequencia;
    }

    conteudo.onstart = function () {
      if (!aindaValido()) return;
      emitir(
        'reproduzindo',
        unidade === 'instrucao'
          ? 'Reproduzindo a instrução com ' + nomeVoz + '.'
          : 'Reproduzindo a ' + unidade + ' com ' + nomeVoz + '.',
        configuracao,
        { voz: nomeVoz }
      );
    };
    conteudo.onend = function () {
      if (!aindaValido()) return;
      solicitacaoAtiva = null;
      emitir(
        controleInterno.faseConclusao || 'concluido',
        configuracao.contexto === 'ditado'
          ? 'Ditado concluído. Agora digite o que você ouviu.'
          : 'Áudio concluído. Você pode repetir ou ouvir mais devagar.',
        configuracao,
        { voz: nomeVoz }
      );
    };
    conteudo.onerror = function () {
      if (!aindaValido()) return;
      solicitacaoAtiva = null;
      emitir('erro', 'Não foi possível reproduzir este áudio. Tente novamente.', configuracao, {
        voz: nomeVoz,
      });
    };

    emitir('aguardando', mensagemInicial(idioma, unidade), configuracao, { voz: nomeVoz });
    if (typeof sintetizador.resume === 'function') sintetizador.resume();
    solicitacaoAtiva = configuracao;
    sintetizador.speak(conteudo);
    return true;
  }

  function falarSequencia(opcoes) {
    opcoes = opcoes || {};
    var etapas = Array.isArray(opcoes.etapas) ? opcoes.etapas : [];
    var pausaMs = Math.max(0, Math.min(3000, Math.trunc(Number(opcoes.pausaMs) || 0)));

    if (!etapas.length) {
      emitir('erro', 'Não há etapas de áudio para reproduzir.', opcoes);
      return false;
    }

    parar({ silencioso: true });
    var sequenciaAtual = sequencia;
    var indice = 0;

    function notificar(detalhe) {
      if (typeof opcoes.aoEstado !== 'function') return;
      opcoes.aoEstado(
        Object.assign({}, detalhe, {
          indiceEtapa: indice,
          totalEtapas: etapas.length,
        })
      );
    }

    function reproduzirEtapa() {
      if (sequenciaAtual !== sequencia) return false;
      var ultimaEtapa = indice === etapas.length - 1;
      var etapa = Object.assign({}, etapas[indice], {
        origem: opcoes.origem || etapas[indice].origem || 'geral',
        aoEstado: function (detalhe) {
          notificar(detalhe);
          if (detalhe.fase === 'erro') return;
          if (detalhe.fase !== 'etapa-concluida') return;
          indice += 1;
          window.setTimeout(function () {
            reproduzirEtapa();
          }, pausaMs);
        },
      });
      return falar(etapa, false, {
        preservarSequencia: true,
        sequenciaAtual: sequenciaAtual,
        faseConclusao: ultimaEtapa ? 'concluido' : 'etapa-concluida',
      });
    }

    return reproduzirEtapa();
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
    falarSequencia: falarSequencia,
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
            unidadeAudio: ultimaSolicitacao.unidadeAudio,
            unidadeDitado: ultimaSolicitacao.unidadeDitado,
          }
        : null;
    },
  };
})();
