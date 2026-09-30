(function () {
  'use strict';

  var configuracaoAtual = null;
  var pares = [];
  var indicePar = 0;
  var alvoAtual = 'pergunta';
  var gravacao = null;
  var avaliando = false;
  var avaliacaoAtiva = null;
  var sequenciaAvaliacao = 0;
  var solicitandoMicrofone = false;
  var sequenciaCaptura = 0;
  var tentativaDisponivel = false;
  var inicializado = false;

  function elemento(id) {
    return document.getElementById(id);
  }

  function textoSeguro(valor, limite) {
    return String(valor || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limite || 240);
  }

  function numeroEntre(valor, minimo, maximo, padrao) {
    var numero = Number(valor);
    if (!Number.isFinite(numero)) return padrao;
    return Math.max(minimo, Math.min(maximo, numero));
  }

  function configuracaoValida(configuracao) {
    if (!configuracao || !configuracao.habilitada || !Array.isArray(configuracao.pares)) {
      return null;
    }
    var ids = [];
    var paresValidos = configuracao.pares
      .map(function (par) {
        var id = textoSeguro(par && par.id, 80);
        var pergunta = textoSeguro(par && par.pergunta, 240);
        var resposta = textoSeguro(par && par.resposta, 240);
        if (!id || !pergunta || !resposta || ids.indexOf(id) >= 0) return null;
        ids.push(id);
        return { id: id, pergunta: pergunta, resposta: resposta };
      })
      .filter(Boolean);
    if (!paresValidos.length) return null;

    var muitoBem = numeroEntre(configuracao.faixas && configuracao.faixas.muitoBem, 1, 100, 75);
    var quase = numeroEntre(configuracao.faixas && configuracao.faixas.quase, 0, muitoBem, 45);
    return {
      id: textoSeguro(configuracao.id, 80) || 'pronuncia-opt-in',
      gatewayUrl:
        textoSeguro(configuracao.gatewayUrl, 300) || 'http://127.0.0.1:5190/api/pronunciation',
      duracaoMaximaSegundos: numeroEntre(configuracao.duracaoMaximaSegundos, 3, 25, 15),
      timeoutMs: numeroEntre(configuracao.timeoutMs, 3000, 30000, 12000),
      faixas: { muitoBem: muitoBem, quase: quase },
      pares: paresValidos,
    };
  }

  function atualizarAvisoPrivacidade(habilitada) {
    var titulo = elemento('ingles-privacidade-audio-titulo');
    var texto = elemento('ingles-privacidade-audio-texto');
    if (!titulo || !texto) return;
    if (habilitada) {
      titulo.textContent = '🔒 Leitura local + conversa opcional';
      texto.textContent =
        'A leitura em voz alta continua local. Na seção de conversa, o microfone só é usado após consentimento e clique em gravar; a tentativa é enviada ao gateway local e ao Azure somente para avaliação, sem ser armazenada.';
      return;
    }
    titulo.textContent = '🔒 Áudio local';
    texto.textContent =
      'A pronúncia usa as vozes instaladas neste computador. O ambiente não grava a criança e não envia o conteúdo para a internet.';
  }

  function alvoDoPar() {
    var par = pares[indicePar];
    return par ? par[alvoAtual] : '';
  }

  function definirStatus(mensagem, tipo) {
    var status = elemento('pronuncia-status');
    status.textContent = mensagem;
    status.dataset.estado = tipo || 'informacao';
  }

  function definirFeedback(mensagem, faixa) {
    var feedback = elemento('pronuncia-feedback');
    feedback.textContent = mensagem || '';
    feedback.dataset.faixa = faixa || '';
    feedback.hidden = !mensagem;
  }

  function atualizarControles() {
    var consentiu = elemento('pronuncia-consentimento').checked;
    var gravando = Boolean(gravacao);
    var ocupado = gravando || avaliando || solicitandoMicrofone;
    elemento('pronuncia-ouvir').disabled = ocupado;
    elemento('pronuncia-gravar').disabled = !consentiu || ocupado;
    elemento('pronuncia-parar').disabled = !gravando;
    elemento('pronuncia-repetir').disabled = !consentiu || ocupado || !tentativaDisponivel;
    elemento('pronuncia-alvo-pergunta').disabled = ocupado;
    elemento('pronuncia-alvo-resposta').disabled = ocupado;
    elemento('pronuncia-par-anterior').disabled = ocupado || indicePar === 0;
    elemento('pronuncia-par-proximo').disabled = ocupado || indicePar === pares.length - 1;
  }

  function renderizarPar() {
    var par = pares[indicePar];
    if (!par) return;
    elemento('pronuncia-progresso').textContent =
      'Conversa ' + (indicePar + 1) + ' de ' + pares.length;
    elemento('pronuncia-pergunta').textContent = par.pergunta;
    elemento('pronuncia-resposta').textContent = par.resposta;
    elemento('pronuncia-alvo-pergunta').setAttribute(
      'aria-pressed',
      alvoAtual === 'pergunta' ? 'true' : 'false'
    );
    elemento('pronuncia-alvo-resposta').setAttribute(
      'aria-pressed',
      alvoAtual === 'resposta' ? 'true' : 'false'
    );
    elemento('pronuncia-alvo-atual').textContent =
      alvoAtual === 'pergunta'
        ? 'Agora pratique a pergunta em inglês.'
        : 'Agora pratique a resposta em inglês.';
    tentativaDisponivel = false;
    definirFeedback('', '');
    definirStatus(
      'Ouça o modelo. Quando estiver pronta, marque o consentimento e grave no seu ritmo.',
      'pronto'
    );
    atualizarControles();
  }

  function falarAlvo() {
    if (!configuracaoAtual || gravacao || avaliando) return;
    var texto = alvoDoPar();
    window.AudioRevisoes.falar({
      texto: texto,
      idioma: 'en-US',
      velocidade: 0.5,
      unidadeAudio: 'frase',
      origem: 'pronuncia-conversacao',
      aoEstado: function (detalhe) {
        if (detalhe.fase === 'erro') {
          definirStatus(
            'Não foi possível tocar o modelo agora. Você ainda pode tentar gravar.',
            'erro'
          );
          return;
        }
        if (detalhe.fase === 'reproduzindo') {
          definirStatus('Escute com calma e repita quando quiser.', 'ouvindo');
          return;
        }
        if (detalhe.fase === 'concluido') {
          definirStatus('Modelo concluído. Agora você pode gravar a sua tentativa.', 'pronto');
        }
      },
    });
  }

  function limparAmostras(chunks) {
    (chunks || []).forEach(function (chunk) {
      if (chunk && typeof chunk.fill === 'function') chunk.fill(0);
    });
    if (chunks) chunks.length = 0;
  }

  function encerrarRecursos(registro) {
    if (!registro) return;
    window.clearTimeout(registro.temporizador);
    if (registro.processador) {
      registro.processador.onaudioprocess = null;
      try {
        registro.processador.disconnect();
      } catch {
        // O nó pode já ter sido desconectado pelo navegador.
      }
    }
    if (registro.fonte) {
      try {
        registro.fonte.disconnect();
      } catch {
        // A fonte pode já ter sido desconectada pelo navegador.
      }
    }
    if (registro.ganho) {
      try {
        registro.ganho.disconnect();
      } catch {
        // O ganho pode já ter sido desconectado pelo navegador.
      }
    }
    if (registro.stream) {
      registro.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    if (registro.contexto && typeof registro.contexto.close === 'function') {
      registro.contexto.close().catch(function () {});
    }
  }

  function combinarAmostras(chunks) {
    var total = chunks.reduce(function (soma, chunk) {
      return soma + chunk.length;
    }, 0);
    var combinado = new Float32Array(total);
    var deslocamento = 0;
    chunks.forEach(function (chunk) {
      combinado.set(chunk, deslocamento);
      deslocamento += chunk.length;
    });
    return combinado;
  }

  function reamostrar(amostras, taxaOrigem, taxaDestino) {
    if (taxaOrigem === taxaDestino) return new Float32Array(amostras);
    var tamanho = Math.max(1, Math.round((amostras.length * taxaDestino) / taxaOrigem));
    var resultado = new Float32Array(tamanho);
    var proporcao = taxaOrigem / taxaDestino;
    for (var indice = 0; indice < tamanho; indice += 1) {
      var posicao = indice * proporcao;
      var esquerda = Math.floor(posicao);
      var direita = Math.min(amostras.length - 1, esquerda + 1);
      var fracao = posicao - esquerda;
      resultado[indice] = amostras[esquerda] * (1 - fracao) + amostras[direita] * fracao;
    }
    return resultado;
  }

  function escreverTexto(view, deslocamento, texto) {
    for (var indice = 0; indice < texto.length; indice += 1) {
      view.setUint8(deslocamento + indice, texto.charCodeAt(indice));
    }
  }

  function criarWav(amostras, taxaAmostragem) {
    var buffer = new ArrayBuffer(44 + amostras.length * 2);
    var view = new DataView(buffer);
    escreverTexto(view, 0, 'RIFF');
    view.setUint32(4, 36 + amostras.length * 2, true);
    escreverTexto(view, 8, 'WAVE');
    escreverTexto(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, taxaAmostragem, true);
    view.setUint32(28, taxaAmostragem * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    escreverTexto(view, 36, 'data');
    view.setUint32(40, amostras.length * 2, true);
    for (var indice = 0; indice < amostras.length; indice += 1) {
      var amostra = Math.max(-1, Math.min(1, amostras[indice]));
      view.setInt16(44 + indice * 2, amostra < 0 ? amostra * 0x8000 : amostra * 0x7fff, true);
    }
    return new Uint8Array(buffer);
  }

  function base64Utf8(texto) {
    var bytes = new window.TextEncoder().encode(texto);
    var binario = '';
    for (var indice = 0; indice < bytes.length; indice += 1) {
      binario += String.fromCharCode(bytes[indice]);
    }
    bytes.fill(0);
    return window.btoa(binario);
  }

  function mensagemDeErro(codigo, statusHttp) {
    if (codigo === 'gateway_unconfigured' || statusHttp === 503) {
      return 'O serviço de pronúncia ainda não está configurado. Você pode continuar ouvindo e repetindo sem avaliação.';
    }
    if (codigo === 'azure_timeout' || codigo === 'timeout' || statusHttp === 504) {
      return 'A avaliação demorou demais. O áudio foi descartado; tente novamente quando quiser.';
    }
    if (statusHttp === 429) {
      return 'O serviço está ocupado agora. O áudio foi descartado; tente novamente em instantes.';
    }
    return 'Não foi possível avaliar agora. O áudio foi descartado; você pode tentar novamente.';
  }

  function aplicarFeedback(resultado, faixas) {
    var avaliacao = resultado && resultado.assessment;
    var pontuacao = Number(avaliacao && avaliacao.pronunciationScore);
    if (!Number.isFinite(pontuacao)) pontuacao = Number(avaliacao && avaliacao.accuracyScore);
    if (!Number.isFinite(pontuacao)) {
      definirFeedback('Vamos ouvir de novo e tentar mais uma vez.', 'tentar-novamente');
      return;
    }
    if (pontuacao >= faixas.muitoBem) {
      definirFeedback('Muito bem! Sua fala ficou clara. 🌟', 'muito-bem');
      return;
    }
    if (pontuacao >= faixas.quase) {
      definirFeedback('Quase! Vamos ouvir de novo.', 'quase');
      return;
    }
    definirFeedback('Tente mais uma vez. Você está praticando!', 'tentar-novamente');
  }

  async function enviarAvaliacao(wav, referencia) {
    var configuracaoDaTentativa = configuracaoAtual;
    var tentativa = (sequenciaAvaliacao += 1);
    var controlador = new window.AbortController();
    avaliacaoAtiva = { controlador: controlador, tentativa: tentativa };
    var temporizador = window.setTimeout(function () {
      controlador.abort();
    }, configuracaoDaTentativa.timeoutMs);
    try {
      var resposta = await window.fetch(configuracaoDaTentativa.gatewayUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        headers: {
          'Content-Type': 'audio/wav',
          'X-Reference-Text': base64Utf8(referencia),
          'X-Pronunciation-Locale': 'en-US',
        },
        body: wav,
        signal: controlador.signal,
      });
      var resultado = null;
      try {
        resultado = await resposta.json();
      } catch {
        resultado = null;
      }
      if (!resposta.ok) {
        var erroGateway = new Error('gateway_error');
        erroGateway.codigo = resultado && resultado.error;
        erroGateway.statusHttp = resposta.status;
        throw erroGateway;
      }
      if (tentativa !== sequenciaAvaliacao) return;
      aplicarFeedback(resultado, configuracaoDaTentativa.faixas);
      definirStatus('Avaliação concluída. Você pode repetir quantas vezes quiser.', 'concluido');
    } catch (erro) {
      if (tentativa !== sequenciaAvaliacao) return;
      var timeout = erro && erro.name === 'AbortError';
      definirFeedback('', '');
      definirStatus(
        mensagemDeErro(timeout ? 'timeout' : erro && erro.codigo, erro && erro.statusHttp),
        'erro'
      );
    } finally {
      window.clearTimeout(temporizador);
      wav.fill(0);
      if (tentativa !== sequenciaAvaliacao) return;
      avaliacaoAtiva = null;
      avaliando = false;
      tentativaDisponivel = true;
      atualizarControles();
    }
  }

  async function pararEEnviar(automatico) {
    if (!gravacao || avaliando) return;
    var registro = gravacao;
    gravacao = null;
    encerrarRecursos(registro);
    atualizarControles();
    var combinado = combinarAmostras(registro.chunks);
    limparAmostras(registro.chunks);
    var duracao = combinado.length / registro.taxaAmostragem;
    if (duracao < 0.25) {
      combinado.fill(0);
      tentativaDisponivel = true;
      definirStatus(
        'A gravação ficou muito curta. Tente falar um pouco mais perto do microfone.',
        'erro'
      );
      atualizarControles();
      return;
    }
    var reamostrado = reamostrar(combinado, registro.taxaAmostragem, 16000);
    combinado.fill(0);
    var wav = criarWav(reamostrado, 16000);
    reamostrado.fill(0);
    avaliando = true;
    tentativaDisponivel = false;
    definirFeedback('', '');
    definirStatus(
      automatico
        ? 'Tempo concluído. Enviando a tentativa para avaliação...'
        : 'Gravação encerrada. Enviando a tentativa para avaliação...',
      'avaliando'
    );
    atualizarControles();
    await enviarAvaliacao(wav, registro.referencia);
  }

  function descartarGravacao(mensagem) {
    if (!gravacao) return;
    var registro = gravacao;
    gravacao = null;
    encerrarRecursos(registro);
    limparAmostras(registro.chunks);
    tentativaDisponivel = false;
    if (mensagem) definirStatus(mensagem, 'interrompido');
    atualizarControles();
  }

  function cancelarAvaliacao() {
    sequenciaCaptura += 1;
    solicitandoMicrofone = false;
    if (avaliacaoAtiva) avaliacaoAtiva.controlador.abort();
    avaliacaoAtiva = null;
    sequenciaAvaliacao += 1;
    avaliando = false;
    tentativaDisponivel = false;
    atualizarControles();
  }

  function erroDeMicrofone(erro) {
    if (erro && (erro.name === 'NotAllowedError' || erro.name === 'SecurityError')) {
      return 'O microfone não foi autorizado. Nada foi gravado. Um responsável pode permitir o acesso no navegador e tentar novamente.';
    }
    if (erro && erro.name === 'NotFoundError') {
      return 'Nenhum microfone foi encontrado. Você pode continuar ouvindo e repetindo sem avaliação.';
    }
    return 'O microfone não está disponível agora. Nada foi enviado e a atividade continua concluída.';
  }

  async function iniciarGravacao() {
    if (!configuracaoAtual || gravacao || avaliando || solicitandoMicrofone) return;
    if (!elemento('pronuncia-consentimento').checked) {
      definirStatus('Marque o consentimento antes de usar o microfone.', 'erro');
      return;
    }
    var AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (
      !window.navigator.mediaDevices ||
      typeof window.navigator.mediaDevices.getUserMedia !== 'function' ||
      typeof AudioContexto !== 'function'
    ) {
      definirStatus(erroDeMicrofone(), 'erro');
      return;
    }

    window.AudioRevisoes.parar({ silencioso: true, origem: 'pronuncia-conversacao' });
    var capturaAtual = (sequenciaCaptura += 1);
    solicitandoMicrofone = true;
    tentativaDisponivel = false;
    definirFeedback('', '');
    definirStatus('Aguardando a permissão do microfone...', 'aguardando-permissao');
    atualizarControles();

    try {
      var stream = await window.navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      if (capturaAtual !== sequenciaCaptura || !configuracaoAtual) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        return;
      }
      var contexto = new AudioContexto();
      if (contexto.state === 'suspended' && typeof contexto.resume === 'function') {
        await contexto.resume();
      }
      if (typeof contexto.createScriptProcessor !== 'function') {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        if (typeof contexto.close === 'function') await contexto.close();
        throw new Error('captura_pcm_indisponivel');
      }
      var fonte = contexto.createMediaStreamSource(stream);
      var processador = contexto.createScriptProcessor(4096, 1, 1);
      var ganho = contexto.createGain();
      ganho.gain.value = 0;
      var registro = {
        stream: stream,
        contexto: contexto,
        fonte: fonte,
        processador: processador,
        ganho: ganho,
        taxaAmostragem: contexto.sampleRate,
        chunks: [],
        referencia: alvoDoPar(),
        temporizador: null,
      };
      processador.onaudioprocess = function (evento) {
        if (gravacao !== registro) return;
        registro.chunks.push(new Float32Array(evento.inputBuffer.getChannelData(0)));
      };
      fonte.connect(processador);
      processador.connect(ganho);
      ganho.connect(contexto.destination);
      gravacao = registro;
      solicitandoMicrofone = false;
      registro.temporizador = window.setTimeout(function () {
        pararEEnviar(true);
      }, configuracaoAtual.duracaoMaximaSegundos * 1000);
      definirStatus(
        '🎙 Gravando. Fale em inglês e pressione “Parar e avaliar” quando terminar.',
        'gravando'
      );
      atualizarControles();
    } catch (erro) {
      if (capturaAtual !== sequenciaCaptura) return;
      solicitandoMicrofone = false;
      definirStatus(erroDeMicrofone(erro), 'erro');
      tentativaDisponivel = false;
      atualizarControles();
    }
  }

  function trocarAlvo(novoAlvo) {
    if (gravacao || avaliando || ['pergunta', 'resposta'].indexOf(novoAlvo) < 0) return;
    alvoAtual = novoAlvo;
    renderizarPar();
  }

  function mudarPar(deslocamento) {
    if (gravacao || avaliando) return;
    var destino = Math.max(0, Math.min(pares.length - 1, indicePar + deslocamento));
    if (destino === indicePar) return;
    window.AudioRevisoes.parar({ silencioso: true, origem: 'pronuncia-conversacao' });
    indicePar = destino;
    alvoAtual = 'pergunta';
    renderizarPar();
    elemento('pronuncia-titulo-cartao').focus({ preventScroll: true });
  }

  function configurar(novaConfiguracao, opcoes) {
    var valida = configuracaoValida(novaConfiguracao);
    var secao = elemento('pronuncia-conversacao');
    opcoes = opcoes || {};
    atualizarAvisoPrivacidade(Boolean(valida));
    if (!valida) {
      descartarGravacao();
      cancelarAvaliacao();
      configuracaoAtual = null;
      pares = [];
      secao.hidden = true;
      return;
    }

    var mudou = !configuracaoAtual || configuracaoAtual.id !== valida.id;
    configuracaoAtual = valida;
    pares = valida.pares;
    secao.hidden = !opcoes.visivel;
    if (!opcoes.visivel) {
      descartarGravacao();
      cancelarAvaliacao();
      return;
    }
    if (mudou || indicePar >= pares.length) {
      indicePar = 0;
      alvoAtual = 'pergunta';
      elemento('pronuncia-consentimento').checked = false;
    }
    renderizarPar();
  }

  function registrarEventos() {
    if (inicializado) return;
    inicializado = true;
    elemento('pronuncia-ouvir').addEventListener('click', falarAlvo);
    elemento('pronuncia-gravar').addEventListener('click', iniciarGravacao);
    elemento('pronuncia-parar').addEventListener('click', function () {
      pararEEnviar(false);
    });
    elemento('pronuncia-repetir').addEventListener('click', iniciarGravacao);
    elemento('pronuncia-alvo-pergunta').addEventListener('click', function () {
      trocarAlvo('pergunta');
    });
    elemento('pronuncia-alvo-resposta').addEventListener('click', function () {
      trocarAlvo('resposta');
    });
    elemento('pronuncia-par-anterior').addEventListener('click', function () {
      mudarPar(-1);
    });
    elemento('pronuncia-par-proximo').addEventListener('click', function () {
      mudarPar(1);
    });
    elemento('pronuncia-consentimento').addEventListener('change', function (evento) {
      if (!evento.target.checked && (gravacao || solicitandoMicrofone || avaliando)) {
        descartarGravacao();
        cancelarAvaliacao();
        definirStatus(
          'Uso do microfone cancelado e tentativa descartada porque o consentimento foi retirado.',
          'interrompido'
        );
      }
      atualizarControles();
    });
    window.addEventListener('pagehide', function () {
      descartarGravacao();
      cancelarAvaliacao();
    });
  }

  registrarEventos();

  window.PronunciaRevisoes = {
    configurar: configurar,
    desativar: function () {
      configurar(null);
    },
  };
})();
