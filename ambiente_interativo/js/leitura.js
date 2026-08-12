(function () {
  'use strict';

  var controladorApp;
  var perfilAtual;
  var livroAtual;
  var armazenamento;
  var estado;
  var documentoPdf;
  var promessaDocumento;
  var promessaBibliotecaPdfjs;
  var tarefaRenderizacao;
  var sequenciaRenderizacao = 0;
  var paginaRenderizada = 0;
  var zoom = 1;
  var temporizadorRedimensionamento;
  var temporizadorDitado = null;
  var falaDitadoAtiva = false;
  var sequenciaDitado = 0;
  var inicializado = false;
  var ATRASO_INICIAL_DITADO_MS = 1000;
  var PAUSA_APOS_PREPARACAO_DITADO_MS = 600;
  var TEXTO_PREPARACAO_DITADO = 'Atenção.';

  function elemento(id) {
    return document.getElementById(id);
  }

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function limitar(numero, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, Math.trunc(Number(numero) || minimo)));
  }

  function configuracaoDoPerfil(perfil, livroId) {
    var configuracoes = window.ConfiguracoesLeitura && window.ConfiguracoesLeitura[perfil];
    var configuracao = configuracoes && configuracoes[livroId];
    if (!configuracao) {
      throw new Error('Não há configuração do livro ' + livroId + ' para o perfil ' + perfil + '.');
    }
    return configuracao;
  }

  function estadoInicial(livro) {
    return {
      livroId: livro.id,
      versao: livro.versao,
      paginaAtual: 1,
      maiorPaginaAlcancada: 1,
      paginasVisitadas: [],
      respostas: {},
      perguntasCorrigidas: {},
      acertos: 0,
      tentativas: 0,
      perguntaAtual: 0,
      leituraIniciada: false,
      questionarioConcluido: false,
      leituraConcluida: false,
      atualizadoEm: null,
    };
  }

  function alternativasValidas(pergunta) {
    return (Array.isArray(pergunta.alternativas) ? pergunta.alternativas : []).map(
      function (alternativa) {
        return alternativa.id;
      }
    );
  }

  function numeroDaChave(chave) {
    var hash = 2166136261;
    String(chave)
      .split('')
      .forEach(function (caractere) {
        hash ^= caractere.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
      });
    return hash >>> 0;
  }

  function embaralharComChave(itens, chave) {
    var resultado = itens.slice();
    var estadoAleatorio = numeroDaChave(chave);
    for (var indice = resultado.length - 1; indice > 0; indice -= 1) {
      estadoAleatorio = (Math.imul(estadoAleatorio, 1664525) + 1013904223) >>> 0;
      var destino = estadoAleatorio % (indice + 1);
      var temporario = resultado[indice];
      resultado[indice] = resultado[destino];
      resultado[destino] = temporario;
    }
    return resultado;
  }

  function posicaoCorretaDaPergunta(indicePerguntaObjetiva, quantidadeAlternativas) {
    var perguntasObjetivas = livroAtual.questionario.filter(function (item) {
      return item.tipo !== 'ditado';
    });
    var chaveBase = perfilAtual + '|' + livroAtual.id;
    var deslocamento = numeroDaChave(chaveBase + '|deslocamento') % quantidadeAlternativas;
    var posicoesEquilibradas = perguntasObjetivas.map(function (_pergunta, indice) {
      return (indice + deslocamento) % quantidadeAlternativas;
    });
    return embaralharComChave(posicoesEquilibradas, chaveBase + '|posicoes')[
      indicePerguntaObjetiva
    ];
  }

  function alternativasParaExibicao(pergunta) {
    var alternativas = Array.isArray(pergunta.alternativas) ? pergunta.alternativas.slice() : [];
    if (alternativas.length < 2) return alternativas;
    var alternativaCorreta = alternativas.find(function (alternativa) {
      return alternativa.id === pergunta.respostaCorreta;
    });
    if (!alternativaCorreta) return alternativas;
    var indicePerguntaObjetiva = livroAtual.questionario
      .slice(0, estado.perguntaAtual)
      .filter(function (item) {
        return item.tipo !== 'ditado';
      }).length;
    var posicaoCorreta = posicaoCorretaDaPergunta(indicePerguntaObjetiva, alternativas.length);
    var alternativasIncorretas = alternativas.filter(function (alternativa) {
      return alternativa.id !== pergunta.respostaCorreta;
    });
    alternativasIncorretas = embaralharComChave(
      alternativasIncorretas,
      perfilAtual + '|' + livroAtual.id + '|' + pergunta.id + '|alternativas'
    );
    alternativasIncorretas.splice(posicaoCorreta, 0, alternativaCorreta);
    return alternativasIncorretas;
  }

  function normalizarTextoDitado(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[.,!?;:]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function respostaEstaCorreta(pergunta, resposta) {
    if (pergunta.tipo === 'ditado') {
      return normalizarTextoDitado(resposta) === normalizarTextoDitado(pergunta.respostaCorreta);
    }
    return resposta === pergunta.respostaCorreta;
  }

  function perguntasObjetivasDoLivro(livro) {
    return livro.questionario.filter(function (pergunta) {
      return pergunta.tipo !== 'ditado';
    });
  }

  function ditadosDoLivro(livro) {
    return livro.questionario.filter(function (pergunta) {
      return pergunta.tipo === 'ditado';
    });
  }

  function usaCorrecaoObjetivasEmLote(livro) {
    return livro.correcaoObjetivas === 'ao-final';
  }

  function todasObjetivasCorrigidasNoEstado(livro, estadoDoLivro) {
    return perguntasObjetivasDoLivro(livro).every(function (pergunta) {
      return estadoDoLivro.perguntasCorrigidas[pergunta.id] === true;
    });
  }

  function normalizarEstado(valor, base, livro) {
    valor = objeto(valor);
    var perguntasPorId = livro.questionario.reduce(function (resultado, pergunta) {
      resultado[pergunta.id] = pergunta;
      return resultado;
    }, {});
    var respostas = objeto(valor.respostas);
    var corrigidas = objeto(valor.perguntasCorrigidas);

    base.livroId = livro.id;
    base.versao = livro.versao;
    base.paginaAtual = limitar(valor.paginaAtual, 1, livro.totalPaginas);
    base.maiorPaginaAlcancada = Math.max(
      base.paginaAtual,
      limitar(valor.maiorPaginaAlcancada, 1, livro.totalPaginas)
    );
    base.paginasVisitadas = (Array.isArray(valor.paginasVisitadas) ? valor.paginasVisitadas : [])
      .map(function (pagina) {
        return Math.trunc(Number(pagina));
      })
      .filter(function (pagina, indice, lista) {
        return pagina >= 1 && pagina <= livro.totalPaginas && lista.indexOf(pagina) === indice;
      });
    base.respostas = {};
    base.perguntasCorrigidas = {};
    livro.questionario.forEach(function (pergunta) {
      var resposta = respostas[pergunta.id];
      var respostaValida =
        pergunta.tipo === 'ditado'
          ? typeof resposta === 'string' && resposta.trim().length > 0
          : alternativasValidas(pergunta).indexOf(resposta) >= 0;
      if (respostaValida) {
        if (pergunta.tipo === 'ditado') resposta = resposta.slice(0, 180);
        base.respostas[pergunta.id] = resposta;
        if (corrigidas[pergunta.id] === true) {
          base.perguntasCorrigidas[pergunta.id] = true;
        }
      }
    });
    if (usaCorrecaoObjetivasEmLote(livro)) {
      var objetivas = perguntasObjetivasDoLivro(livro);
      var todasObjetivasCorrigidas = objetivas.every(function (pergunta) {
        return base.perguntasCorrigidas[pergunta.id] === true;
      });
      if (!todasObjetivasCorrigidas) {
        objetivas.forEach(function (pergunta) {
          delete base.perguntasCorrigidas[pergunta.id];
        });
      }
    }
    base.acertos = Object.keys(base.perguntasCorrigidas).filter(function (id) {
      return respostaEstaCorreta(perguntasPorId[id], base.respostas[id]);
    }).length;
    base.tentativas = Math.max(0, Math.trunc(Number(valor.tentativas) || 0));
    base.perguntaAtual = limitar(valor.perguntaAtual, 0, livro.questionario.length - 1);
    if (usaCorrecaoObjetivasEmLote(livro) && !todasObjetivasCorrigidasNoEstado(livro, base)) {
      var indicePrimeiroDitado = livro.questionario.findIndex(function (pergunta) {
        return pergunta.tipo === 'ditado';
      });
      if (indicePrimeiroDitado >= 0 && base.perguntaAtual >= indicePrimeiroDitado) {
        var indiceObjetivaPendente = livro.questionario.findIndex(function (pergunta) {
          return pergunta.tipo !== 'ditado' && !base.respostas[pergunta.id];
        });
        base.perguntaAtual =
          indiceObjetivaPendente >= 0 ? indiceObjetivaPendente : indicePrimeiroDitado - 1;
      }
    }
    base.leituraIniciada =
      Boolean(valor.leituraIniciada) ||
      base.paginasVisitadas.length > 0 ||
      base.paginaAtual > 1 ||
      base.maiorPaginaAlcancada > 1;
    base.questionarioConcluido =
      Boolean(valor.questionarioConcluido) &&
      Object.keys(base.perguntasCorrigidas).length === livro.questionario.length;
    base.leituraConcluida =
      base.questionarioConcluido && base.maiorPaginaAlcancada === livro.totalPaginas;
    base.atualizadoEm =
      typeof valor.atualizadoEm === 'string' && valor.atualizadoEm ? valor.atualizadoEm : null;
    return base;
  }

  function criarContextoLivro(perfil, livro) {
    var configuracao = configuracaoDoPerfil(perfil, livro.id);
    if (configuracao.livroId !== livro.id) {
      throw new Error('A configuração do perfil não corresponde ao livro selecionado.');
    }
    var armazenamentoDoLivro = window.ArmazenamentoRevisoes.criar({
      chave: configuracao.chaveArmazenamento,
      padrao: estadoInicial(livro),
      normalizar: function (valor, base) {
        return normalizarEstado(valor, base, livro);
      },
    });
    return {
      configuracao: configuracao,
      armazenamento: armazenamentoDoLivro,
      estado: armazenamentoDoLivro.carregar(),
    };
  }

  function salvarEstado() {
    estado.atualizadoEm = new Date().toISOString();
    estado = armazenamento.salvar(estado);
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: perfilAtual + '-leitura-' + livroAtual.id },
      })
    );
    return estado;
  }

  function descartarDocumentoAtual() {
    paginaRenderizada = 0;
    sequenciaRenderizacao += 1;
    if (tarefaRenderizacao) tarefaRenderizacao.cancel();
    tarefaRenderizacao = null;
    documentoPdf = null;
    promessaDocumento = null;
    zoom = 1;
    elemento('zoom-leitura').textContent = '100%';
  }

  function selecionarLivro(livroId) {
    var livro = window.RegistroLeituras.obter(livroId);
    if (!livro || livro.perfisDisponiveis.indexOf(perfilAtual) < 0) {
      throw new Error('O livro selecionado não está disponível para este perfil.');
    }
    if (!livroAtual || livroAtual.id !== livro.id) descartarDocumentoAtual();
    var contexto = criarContextoLivro(perfilAtual, livro);
    livroAtual = livro;
    armazenamento = contexto.armazenamento;
    estado = contexto.estado;
  }

  function prepararPerfil(perfil) {
    var mudou = perfilAtual !== perfil;
    perfilAtual = perfil;
    if (mudou || !livroAtual) {
      descartarDocumentoAtual();
      var primeiroLivro = window.RegistroLeituras.listar(perfil)[0];
      if (!primeiroLivro)
        throw new Error('Não há livros disponíveis para o perfil ' + perfil + '.');
      selecionarLivro(primeiroLivro.id);
    }
  }

  function textoSituacao(estadoDoLivro) {
    if (estadoDoLivro.leituraConcluida) return 'Concluído';
    if (estadoDoLivro.leituraIniciada) return 'Continuar da página ' + estadoDoLivro.paginaAtual;
    return 'Não iniciado';
  }

  function textoBotaoLivro(estadoDoLivro) {
    if (estadoDoLivro.leituraConcluida) return 'Ler novamente';
    if (estadoDoLivro.leituraIniciada) return 'Continuar da página ' + estadoDoLivro.paginaAtual;
    return 'Começar leitura';
  }

  function renderizarBiblioteca() {
    var grade = elemento('grade-leituras');
    grade.innerHTML = '';
    window.RegistroLeituras.listar(perfilAtual).forEach(function (livro) {
      var contexto = criarContextoLivro(perfilAtual, livro);
      var estadoDoLivro = contexto.estado;
      var cartao = document.createElement('article');
      var capa = document.createElement('img');
      var corpo = document.createElement('div');
      var titulo = document.createElement('h2');
      var autor = document.createElement('p');
      var paginas = document.createElement('p');
      var resumo = document.createElement('p');
      var situacao = document.createElement('p');
      var botao = document.createElement('button');

      cartao.className = 'cartao-livro';
      cartao.dataset.livroId = livro.id;
      capa.className = 'capa-livro';
      capa.src = livro.capa;
      capa.alt = 'Capa do livro ' + livro.titulo + ', de ' + livro.autor;
      capa.width = 480;
      capa.height = 340;
      corpo.className = 'cartao-livro-corpo';
      titulo.textContent = livro.titulo;
      autor.className = 'autor-livro';
      autor.textContent = livro.autor;
      if (livro.adaptador) autor.textContent += ' · Adaptação: ' + livro.adaptador;
      if (livro.ilustrador) autor.textContent += ' · Ilustrações: ' + livro.ilustrador;
      paginas.className = 'paginas-livro';
      paginas.textContent = livro.totalPaginas + ' páginas';
      resumo.className = 'resumo-livro';
      resumo.textContent = livro.resumo;
      situacao.className = 'situacao-leitura';
      situacao.dataset.estadoLeitura = estadoDoLivro.leituraConcluida
        ? 'concluido'
        : estadoDoLivro.leituraIniciada
          ? 'em-andamento'
          : 'nao-iniciado';
      situacao.textContent = textoSituacao(estadoDoLivro);
      botao.type = 'button';
      botao.className = 'botao-principal botao-abrir-livro';
      botao.textContent = textoBotaoLivro(estadoDoLivro);
      botao.setAttribute('aria-label', textoBotaoLivro(estadoDoLivro) + ': ' + livro.titulo);
      botao.addEventListener('click', function () {
        selecionarLivro(livro.id);
        abrirVisualizador(estado.leituraConcluida ? 1 : estado.paginaAtual);
      });
      corpo.append(titulo, autor, paginas, resumo, situacao, botao);
      cartao.append(capa, corpo);
      grade.appendChild(cartao);
    });
  }

  function abrirBiblioteca(perfil) {
    cancelarDitado();
    prepararPerfil(perfil);
    elemento('nome-perfil-biblioteca').textContent = perfil === 'alice' ? 'Alice' : 'Mariana';
    renderizarBiblioteca();
    controladorApp.mostrarTela('bibliotecaLeitura');
  }

  function enderecoDoLivro() {
    return new window.URL(livroAtual.arquivoPdf, document.baseURI).href;
  }

  function prepararAlternativaPdf() {
    var endereco = enderecoDoLivro();
    var link = elemento('abrir-pdf-original');
    link.href = endereco;
    link.setAttribute('download', livroAtual.arquivoPdf.split('/').pop());
  }

  function recursosJanelaAmpla() {
    var largura = Math.max(900, (window.screen && window.screen.availWidth) || 1280);
    var altura = Math.max(650, (window.screen && window.screen.availHeight) || 800);
    return (
      'popup=yes,fullscreen=yes,left=0,top=0,width=' +
      largura +
      ',height=' +
      altura +
      ',resizable=yes,scrollbars=yes'
    );
  }

  function abrirJanelaAmpla(endereco, nome) {
    var janela = window.open(endereco, nome, recursosJanelaAmpla());
    if (!janela) {
      elemento('anuncio-pagina-leitura').textContent =
        'O navegador bloqueou a nova janela. Permita pop-ups para este endereço e tente novamente.';
      return null;
    }
    try {
      janela.focus();
    } catch {
      // Alguns navegadores não permitem focar uma janela recém-aberta.
    }
    return janela;
  }

  function abrirPdfEmJanela() {
    return abrirJanelaAmpla(enderecoDoLivro(), 'Livro-' + livroAtual.id);
  }

  function abrirLeitorDedicado() {
    if (window.location.protocol === 'file:') {
      abrirPdfEmJanela();
      return;
    }
    var endereco = new window.URL('leitor.html', document.baseURI);
    endereco.searchParams.set('perfil', perfilAtual);
    endereco.searchParams.set('livro', livroAtual.id);
    endereco.searchParams.set('pagina', paginaRenderizada || estado.paginaAtual);
    abrirJanelaAmpla(endereco.href, 'Leitor-' + livroAtual.id + '-' + perfilAtual);
  }

  function definirControlesIntegrados(disponiveis) {
    [
      'ajustar-largura-leitura',
      'diminuir-zoom-leitura',
      'aumentar-zoom-leitura',
      'pagina-anterior-leitura',
      'proxima-pagina-leitura',
      'ir-pagina-leitura',
    ].forEach(function (id) {
      elemento(id).disabled = !disponiveis;
    });
    elemento('form-ir-pagina-leitura').querySelector('button').disabled = !disponiveis;
  }

  function mostrarErroPdf(mensagem, modoArquivo) {
    elemento('estado-carregamento-pdf').hidden = true;
    elemento('erro-pdf').hidden = false;
    elemento('erro-pdf-mensagem').textContent = mensagem;
    elemento('canvas-livro').hidden = true;
    elemento('dica-abertura-local').hidden = !modoArquivo;
    elemento('concluir-leitura-arquivo').hidden = !modoArquivo;
    elemento('abrir-leitor-dedicado').textContent = modoArquivo
      ? '↗ Abrir PDF em nova janela'
      : '↗ Abrir leitor em nova janela';
    if (modoArquivo) definirControlesIntegrados(false);
  }

  function carregarBibliotecaPdfjs() {
    if (window.PDFJSLocal) return Promise.resolve(true);
    if (promessaBibliotecaPdfjs) return promessaBibliotecaPdfjs;
    promessaBibliotecaPdfjs = new Promise(function (resolver) {
      var script = document.createElement('script');
      script.type = 'module';
      script.src = new window.URL('js/pdfjs.bundle.mjs', document.baseURI).href;
      script.onload = function () {
        resolver(Boolean(window.PDFJSLocal));
      };
      script.onerror = function () {
        promessaBibliotecaPdfjs = null;
        resolver(false);
      };
      document.head.appendChild(script);
    });
    return promessaBibliotecaPdfjs;
  }

  function carregarDocumento() {
    if (window.location.protocol === 'file:') {
      mostrarErroPdf(
        'Esta aba foi aberta como arquivo local. Você pode abrir o PDF agora em uma janela ampla ou reiniciar pelo atalho para usar o leitor integrado.',
        true
      );
      return Promise.resolve(null);
    }
    if (documentoPdf) return Promise.resolve(documentoPdf);
    if (promessaDocumento) return promessaDocumento;

    elemento('estado-carregamento-pdf').hidden = false;
    elemento('erro-pdf').hidden = true;
    promessaDocumento = carregarBibliotecaPdfjs()
      .then(function (disponivel) {
        if (!disponivel || typeof window.PDFJSLocal.getDocument !== 'function') {
          throw new Error('O módulo local do PDF.js não ficou disponível.');
        }
        return window.PDFJSLocal.getDocument({ url: enderecoDoLivro() }).promise;
      })
      .then(function (documento) {
        if (documento.numPages !== livroAtual.totalPaginas) {
          throw new Error(
            'O livro não contém as ' + livroAtual.totalPaginas + ' páginas esperadas.'
          );
        }
        documentoPdf = documento;
        return documentoPdf;
      })
      .catch(function (erro) {
        promessaDocumento = null;
        mostrarErroPdf(
          'Não foi possível desenhar o livro agora. Use uma das opções para abrir o PDF.',
          false
        );
        console.warn('O PDF local não pôde ser renderizado pelo visualizador.', erro);
        return null;
      });
    return promessaDocumento;
  }

  function atualizarControlesPagina(pagina) {
    definirControlesIntegrados(true);
    elemento('abrir-leitor-dedicado').textContent = '↗ Abrir leitor em nova janela';
    elemento('contador-pagina-leitura').textContent =
      'Página ' + pagina + ' de ' + livroAtual.totalPaginas;
    elemento('pagina-anterior-leitura').disabled = pagina <= 1;
    elemento('proxima-pagina-leitura').disabled = pagina >= livroAtual.totalPaginas;
    elemento('ir-pagina-leitura').value = pagina;
    elemento('ir-pagina-leitura').max = livroAtual.totalPaginas;
    elemento('terminar-leitura').hidden = pagina !== livroAtual.totalPaginas;
    renderizarExplicacaoFinal(pagina);
    window.GlossarioRevisoes.atualizarBotaoPagina(
      elemento('palavras-pagina-leitura'),
      livroAtual,
      pagina
    );
    elemento('anuncio-pagina-leitura').textContent = 'Página ' + pagina + ' carregada.';
  }

  function renderizarExplicacaoFinal(pagina) {
    var recipiente = elemento('explicacao-final-leitura');
    var explicacao = livroAtual.explicacaoFinal;
    var mostrar = pagina === livroAtual.totalPaginas && explicacao;
    recipiente.hidden = !mostrar;
    elemento('terminar-leitura').textContent = mostrar
      ? 'Entendi o eclipse - responder perguntas'
      : 'Terminei a leitura - responder perguntas';
    if (!mostrar) return;

    elemento('titulo-explicacao-final-leitura').textContent = explicacao.titulo;
    var paragrafos = elemento('paragrafos-explicacao-final-leitura');
    paragrafos.replaceChildren();
    explicacao.paragrafos.forEach(function (texto, indice) {
      var paragrafo = document.createElement('p');
      if (indice === explicacao.paragrafos.length - 1) {
        paragrafo.className = 'aviso-seguranca-eclipse';
      }
      window.GlossarioRevisoes.renderizarTexto(paragrafo, texto);
      paragrafos.appendChild(paragrafo);
    });
    var imagem = elemento('imagem-explicacao-final-leitura');
    imagem.src = explicacao.imagem;
    imagem.alt = explicacao.imagemAlt;
    imagem.width = 768;
    imagem.height = 512;
  }

  function registrarPaginaCarregada(pagina) {
    estado.paginaAtual = pagina;
    estado.maiorPaginaAlcancada = Math.max(estado.maiorPaginaAlcancada, pagina);
    if (estado.paginasVisitadas.indexOf(pagina) < 0) estado.paginasVisitadas.push(pagina);
    estado.leituraIniciada = true;
    salvarEstado();
  }

  function renderizarPagina(pagina) {
    pagina = limitar(pagina, 1, livroAtual.totalPaginas);
    var minhaSequencia = ++sequenciaRenderizacao;
    if (tarefaRenderizacao) tarefaRenderizacao.cancel();
    elemento('estado-carregamento-pdf').hidden = false;
    elemento('estado-carregamento-pdf').textContent = 'Preparando a página ' + pagina + '...';
    elemento('erro-pdf').hidden = true;

    return carregarDocumento().then(function (documento) {
      if (!documento || minhaSequencia !== sequenciaRenderizacao) return false;
      return documento
        .getPage(pagina)
        .then(function (paginaPdf) {
          if (minhaSequencia !== sequenciaRenderizacao) return false;
          var canvas = elemento('canvas-livro');
          var recipiente = elemento('recipiente-canvas-livro');
          var base = paginaPdf.getViewport({ scale: 1 });
          var larguraDisponivel = Math.max(260, recipiente.clientWidth - 24);
          var escala = (larguraDisponivel / base.width) * zoom;
          var viewport = paginaPdf.getViewport({ scale: escala });
          var proporcao = Math.max(1, window.devicePixelRatio || 1);
          var contexto = canvas.getContext('2d', { alpha: false });

          canvas.width = Math.max(1, Math.round(viewport.width * proporcao));
          canvas.height = Math.max(1, Math.round(viewport.height * proporcao));
          canvas.style.width = viewport.width + 'px';
          canvas.style.height = viewport.height + 'px';
          canvas.hidden = false;
          canvas.setAttribute('aria-label', 'Página ' + pagina + ' do livro ' + livroAtual.titulo);
          tarefaRenderizacao = paginaPdf.render({
            canvasContext: contexto,
            viewport: viewport,
            transform: proporcao === 1 ? null : [proporcao, 0, 0, proporcao, 0, 0],
          });
          return tarefaRenderizacao.promise.then(function () {
            if (minhaSequencia !== sequenciaRenderizacao) return false;
            paginaRenderizada = pagina;
            tarefaRenderizacao = null;
            elemento('estado-carregamento-pdf').hidden = true;
            atualizarControlesPagina(pagina);
            registrarPaginaCarregada(pagina);
            return true;
          });
        })
        .catch(function (erro) {
          if (erro && erro.name === 'RenderingCancelledException') return false;
          if (minhaSequencia === sequenciaRenderizacao) {
            mostrarErroPdf(
              'Não foi possível mostrar esta página. Tente novamente ou abra o PDF original.',
              false
            );
            console.warn('A página do livro não pôde ser renderizada.', erro);
          }
          return false;
        });
    });
  }

  function abrirVisualizador(pagina) {
    cancelarDitado();
    prepararAlternativaPdf();
    elemento('titulo-livro-visualizador').textContent = livroAtual.titulo;
    elemento('nome-perfil-visualizador').textContent =
      perfilAtual === 'alice' ? 'Alice' : 'Mariana';
    elemento('explicacao-final-leitura').hidden = true;
    elemento('terminar-leitura').hidden = true;
    controladorApp.mostrarTela('visualizadorLeitura');
    renderizarPagina(pagina);
  }

  function paginaDesejada(delta) {
    var base = paginaRenderizada || estado.paginaAtual;
    return limitar(base + delta, 1, livroAtual.totalPaginas);
  }

  function atualizarZoom(novoZoom) {
    zoom = Math.max(0.75, Math.min(1.75, novoZoom));
    elemento('zoom-leitura').textContent = Math.round(zoom * 100) + '%';
    elemento('diminuir-zoom-leitura').disabled = zoom <= 0.75;
    elemento('aumentar-zoom-leitura').disabled = zoom >= 1.75;
    if (paginaRenderizada) renderizarPagina(paginaRenderizada);
  }

  function perguntaAtual() {
    return livroAtual.questionario[estado.perguntaAtual];
  }

  function calcularAcertos() {
    return livroAtual.questionario.filter(function (pergunta) {
      return (
        estado.perguntasCorrigidas[pergunta.id] &&
        respostaEstaCorreta(pergunta, estado.respostas[pergunta.id])
      );
    }).length;
  }

  function cancelarDitado() {
    sequenciaDitado += 1;
    var haviaDitadoPendente = temporizadorDitado !== null || falaDitadoAtiva;
    if (temporizadorDitado !== null) {
      window.clearTimeout(temporizadorDitado);
      temporizadorDitado = null;
    }
    if (haviaDitadoPendente && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    falaDitadoAtiva = false;
  }

  function configurarVozDitado(fala, volume, velocidade) {
    fala.lang = 'pt-BR';
    fala.rate = velocidade;
    fala.pitch = 1;
    fala.volume = volume;
    if (typeof window.speechSynthesis.getVoices === 'function') {
      var vozes = window.speechSynthesis.getVoices();
      var vozPortugues = vozes.find(function (voz) {
        return String(voz.lang).toLowerCase() === 'pt-br';
      });
      if (vozPortugues) fala.voice = vozPortugues;
    }
    return fala;
  }

  function falarDitado(pergunta) {
    if (
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance !== 'function' ||
      !pergunta.textoDitado
    ) {
      elemento('anuncio-questionario-leitura').textContent =
        'O navegador não conseguiu reproduzir o ditado. Peça a um adulto para ler a frase.';
      return false;
    }
    cancelarDitado();
    var sequenciaAtual = sequenciaDitado;
    var falaPrincipalAgendada = false;
    var preparacao = configurarVozDitado(
      new window.SpeechSynthesisUtterance(TEXTO_PREPARACAO_DITADO),
      1,
      0.9
    );
    var fala = configurarVozDitado(
      new window.SpeechSynthesisUtterance(pergunta.textoDitado),
      1,
      0.78
    );

    function sequenciaAindaValida() {
      return sequenciaAtual === sequenciaDitado;
    }

    function agendarFalaPrincipal() {
      if (!sequenciaAindaValida() || falaPrincipalAgendada) return;
      falaPrincipalAgendada = true;
      falaDitadoAtiva = false;
      elemento('anuncio-questionario-leitura').textContent =
        'Atenção. A frase começará depois de uma pequena pausa.';
      temporizadorDitado = window.setTimeout(function () {
        temporizadorDitado = null;
        if (!sequenciaAindaValida()) return;
        if (typeof window.speechSynthesis.resume === 'function') {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(fala);
      }, PAUSA_APOS_PREPARACAO_DITADO_MS);
    }

    preparacao.onstart = function () {
      if (!sequenciaAindaValida()) return;
      falaDitadoAtiva = true;
      elemento('anuncio-questionario-leitura').textContent =
        'Atenção. Prepare-se para ouvir a frase.';
    };
    preparacao.onend = agendarFalaPrincipal;
    preparacao.onerror = agendarFalaPrincipal;
    fala.onstart = function () {
      if (!sequenciaAindaValida()) return;
      falaDitadoAtiva = true;
      elemento('anuncio-questionario-leitura').textContent = 'Ditado em reprodução.';
    };
    fala.onend = function () {
      if (!sequenciaAindaValida()) return;
      falaDitadoAtiva = false;
      elemento('anuncio-questionario-leitura').textContent =
        'Ditado concluído. Agora digite o que você ouviu.';
    };
    fala.onerror = function () {
      if (!sequenciaAindaValida()) return;
      falaDitadoAtiva = false;
      elemento('anuncio-questionario-leitura').textContent =
        'O navegador não conseguiu reproduzir o ditado. Tente ouvir novamente.';
    };
    elemento('anuncio-questionario-leitura').textContent =
      'O ditado começará em 1 segundo. Você ouvirá “Atenção” antes da frase.';
    temporizadorDitado = window.setTimeout(function () {
      temporizadorDitado = null;
      if (!sequenciaAindaValida()) return;
      falaDitadoAtiva = true;
      if (typeof window.speechSynthesis.resume === 'function') {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(preparacao);
    }, ATRASO_INICIAL_DITADO_MS);
    return true;
  }

  function todasCorrigidas() {
    return livroAtual.questionario.every(function (pergunta) {
      return estado.perguntasCorrigidas[pergunta.id] === true;
    });
  }

  function concluirQuestionario() {
    estado.questionarioConcluido = todasCorrigidas();
    estado.leituraConcluida =
      estado.questionarioConcluido && estado.maiorPaginaAlcancada === livroAtual.totalPaginas;
    salvarEstado();
    renderizarQuestionario();
  }

  function renderizarResultado() {
    var corpo = elemento('corpo-questionario-leitura');
    corpo.innerHTML = '';
    var resultado = document.createElement('section');
    var simbolo = document.createElement('div');
    var titulo = document.createElement('h2');
    var placar = document.createElement('p');
    var mensagem = document.createElement('p');
    var botoes = document.createElement('div');
    var rever = document.createElement('button');
    var responder = document.createElement('button');

    resultado.className = 'resultado-leitura';
    simbolo.className = 'trofeu-leitura';
    simbolo.setAttribute('aria-hidden', 'true');
    simbolo.textContent = '★';
    titulo.textContent = 'Leitura concluída!';
    placar.className = 'placar-leitura';
    placar.textContent = estado.acertos + ' de ' + livroAtual.questionario.length + ' acertos';
    mensagem.textContent =
      'Parabéns por chegar ao fim e pensar sobre a história. Cada tentativa também ajuda a aprender!';
    botoes.className = 'botoes-resultado-leitura';
    rever.type = 'button';
    rever.className = 'botao-secundario botao-grande';
    rever.textContent = 'Rever o livro';
    rever.addEventListener('click', function () {
      abrirVisualizador(1);
    });
    responder.type = 'button';
    responder.className = 'botao-principal botao-grande';
    responder.textContent = 'Responder novamente';
    responder.addEventListener('click', function () {
      estado.respostas = {};
      estado.perguntasCorrigidas = {};
      estado.acertos = 0;
      estado.perguntaAtual = 0;
      estado.questionarioConcluido = false;
      estado.leituraConcluida = false;
      salvarEstado();
      renderizarQuestionario();
    });
    botoes.append(rever, responder);
    resultado.append(simbolo, titulo, placar, mensagem, botoes);
    corpo.appendChild(resultado);
    elemento('progresso-questionario-leitura').hidden = true;
    elemento('anuncio-questionario-leitura').textContent =
      'Questionário concluído com ' + estado.acertos + ' acertos.';
  }

  function selecionarResposta(pergunta, alternativaId) {
    estado.respostas[pergunta.id] = alternativaId;
    delete estado.perguntasCorrigidas[pergunta.id];
    estado.questionarioConcluido = false;
    estado.leituraConcluida = false;
    salvarEstado();
    renderizarQuestionario();
  }

  function corrigirPergunta() {
    var pergunta = perguntaAtual();
    if (!estado.respostas[pergunta.id]) return;
    estado.perguntasCorrigidas[pergunta.id] = true;
    estado.tentativas += 1;
    estado.acertos = calcularAcertos();
    salvarEstado();
    renderizarQuestionario();
  }

  function todasObjetivasRespondidas() {
    return perguntasObjetivasDoLivro(livroAtual).every(function (pergunta) {
      return Boolean(estado.respostas[pergunta.id]);
    });
  }

  function corrigirObjetivasEmLote() {
    if (!todasObjetivasRespondidas()) return;
    var objetivas = perguntasObjetivasDoLivro(livroAtual);
    objetivas.forEach(function (pergunta) {
      estado.perguntasCorrigidas[pergunta.id] = true;
    });
    estado.tentativas += objetivas.length;
    estado.acertos = calcularAcertos();
    salvarEstado();
    renderizarQuestionario();
  }

  function textoDaAlternativa(pergunta, alternativaId) {
    var alternativa = (pergunta.alternativas || []).find(function (item) {
      return item.id === alternativaId;
    });
    return alternativa ? alternativa.texto : 'Resposta não identificada';
  }

  function renderizarRevisaoDasObjetivas() {
    var corpo = elemento('corpo-questionario-leitura');
    var progresso = elemento('progresso-questionario-leitura');
    var objetivas = perguntasObjetivasDoLivro(livroAtual);
    var acertosObjetivas = objetivas.filter(function (pergunta) {
      return respostaEstaCorreta(pergunta, estado.respostas[pergunta.id]);
    }).length;
    var revisao = document.createElement('section');
    var titulo = document.createElement('h2');
    var resumo = document.createElement('p');
    var orientacao = document.createElement('p');
    var lista = document.createElement('div');
    var continuar = document.createElement('button');

    corpo.innerHTML = '';
    progresso.hidden = true;
    elemento('contador-questionario-leitura').textContent =
      'Revisão das ' + objetivas.length + ' perguntas';
    revisao.className = 'revisao-questionario-leitura';
    titulo.textContent = 'Vamos revisar suas respostas!';
    resumo.className = 'resumo-revisao-questionario';
    resumo.textContent =
      'Você acertou ' + acertosObjetivas + ' de ' + objetivas.length + ' perguntas.';
    orientacao.textContent =
      acertosObjetivas === objetivas.length
        ? 'Muito bem! Confira seus acertos e, depois, continue para os ditados.'
        : 'Veja com calma as respostas. Nas questões que precisam de revisão, mostramos a resposta certa e uma explicação baseada na história.';
    lista.className = 'lista-revisao-questionario';

    objetivas.forEach(function (pergunta, indice) {
      var acertou = respostaEstaCorreta(pergunta, estado.respostas[pergunta.id]);
      var item = document.createElement('article');
      var status = document.createElement('p');
      var enunciado = document.createElement('h3');
      var respostaDaCrianca = document.createElement('p');

      item.className = 'item-revisao-questionario ' + (acertou ? 'correta' : 'incorreta');
      status.className = 'status-item-revisao';
      status.textContent = acertou ? '✓ Você acertou' : '↻ Vamos rever';
      window.GlossarioRevisoes.renderizarTexto(enunciado, indice + 1 + '. ' + pergunta.enunciado);
      respostaDaCrianca.className = 'resposta-item-revisao';
      respostaDaCrianca.textContent =
        (acertou ? 'Sua resposta: ' : 'Você marcou: ') +
        textoDaAlternativa(pergunta, estado.respostas[pergunta.id]);
      item.append(status, enunciado, respostaDaCrianca);

      if (!acertou) {
        var respostaCorreta = document.createElement('p');
        var explicacao = document.createElement('p');
        respostaCorreta.className = 'resposta-certa-revisao';
        respostaCorreta.textContent =
          'Resposta certa: ' + textoDaAlternativa(pergunta, pergunta.respostaCorreta);
        explicacao.className = 'explicacao-item-revisao';
        window.GlossarioRevisoes.renderizarTexto(
          explicacao,
          'Por quê? ' + (pergunta.explicacaoRevisao || pergunta.feedback)
        );
        item.append(respostaCorreta, explicacao);
      }
      lista.appendChild(item);
    });

    continuar.type = 'button';
    continuar.className = 'botao-principal botao-grande continuar-ditados';
    continuar.textContent = 'Continuar para os ditados';
    continuar.addEventListener('click', function () {
      var indicePrimeiroDitado = livroAtual.questionario.findIndex(function (pergunta) {
        return pergunta.tipo === 'ditado';
      });
      if (indicePrimeiroDitado < 0) {
        concluirQuestionario();
        return;
      }
      estado.perguntaAtual = indicePrimeiroDitado;
      salvarEstado();
      renderizarQuestionario();
    });
    revisao.append(titulo, resumo, orientacao, lista, continuar);
    corpo.appendChild(revisao);
    elemento('anuncio-questionario-leitura').textContent =
      'Revisão pronta. Você acertou ' +
      acertosObjetivas +
      ' de ' +
      objetivas.length +
      ' perguntas.';
    window.requestAnimationFrame(function () {
      titulo.tabIndex = -1;
      titulo.focus();
    });
  }

  function renderizarQuestionario() {
    cancelarDitado();
    if (estado.questionarioConcluido) {
      renderizarResultado();
      return;
    }
    var pergunta = perguntaAtual();
    var objetivaComCorrecaoEmLote =
      pergunta.tipo !== 'ditado' && usaCorrecaoObjetivasEmLote(livroAtual);
    if (objetivaComCorrecaoEmLote && todasObjetivasCorrigidasNoEstado(livroAtual, estado)) {
      renderizarRevisaoDasObjetivas();
      return;
    }
    var corpo = elemento('corpo-questionario-leitura');
    var progresso = elemento('progresso-questionario-leitura');
    var itensDaEtapa = objetivaComCorrecaoEmLote
      ? perguntasObjetivasDoLivro(livroAtual)
      : pergunta.tipo === 'ditado' && usaCorrecaoObjetivasEmLote(livroAtual)
        ? ditadosDoLivro(livroAtual)
        : livroAtual.questionario;
    var indiceNaEtapa = itensDaEtapa.findIndex(function (item) {
      return item.id === pergunta.id;
    });
    corpo.innerHTML = '';
    progresso.hidden = false;
    progresso.setAttribute('aria-valuemax', itensDaEtapa.length);
    progresso.setAttribute('aria-valuenow', indiceNaEtapa + 1);
    progresso.querySelector('span').style.width =
      ((indiceNaEtapa + 1) / itensDaEtapa.length) * 100 + '%';
    elemento('contador-questionario-leitura').textContent =
      (pergunta.tipo === 'ditado' && usaCorrecaoObjetivasEmLote(livroAtual)
        ? 'Ditado '
        : 'Pergunta ') +
      (indiceNaEtapa + 1) +
      ' de ' +
      itensDaEtapa.length;

    var cartao = document.createElement('article');
    var titulo = document.createElement('h2');
    var opcoes = document.createElement('div');
    var corrigir = document.createElement('button');
    var retorno = document.createElement('div');
    var navegacao = document.createElement('div');
    var anterior = document.createElement('button');
    var proxima = document.createElement('button');
    var resposta = estado.respostas[pergunta.id];
    var corrigida = estado.perguntasCorrigidas[pergunta.id] === true;
    var ehDitado = pergunta.tipo === 'ditado';
    var acertou = corrigida && respostaEstaCorreta(pergunta, resposta);

    cartao.className = 'cartao-pergunta-leitura';
    window.GlossarioRevisoes.renderizarTexto(titulo, pergunta.enunciado);
    var palavrasDaPergunta = window.GlossarioRevisoes.encontrarEmTextos(
      [pergunta.enunciado, pergunta.feedback, pergunta.textoDitado].concat(
        (pergunta.alternativas || []).map(function (alternativa) {
          return alternativa.texto;
        })
      )
    );
    var atalhosGlossario = window.GlossarioRevisoes.criarAtalhos(palavrasDaPergunta);
    if (ehDitado) {
      var instrucaoDitado = document.createElement('p');
      var ouvirDitado = document.createElement('button');
      var rotuloDitado = document.createElement('label');
      var entradaDitado = document.createElement('input');
      var idEntradaDitado = 'resposta-ditado-' + pergunta.id;
      opcoes.className = 'atividade-ditado';
      opcoes.setAttribute('role', 'group');
      opcoes.setAttribute('aria-label', 'Atividade de ditado');
      instrucaoDitado.textContent =
        'Clique em Ouvir ditado. Você ouvirá “Atenção” e, depois, a frase. Digite somente a frase usando o teclado.';
      ouvirDitado.type = 'button';
      ouvirDitado.className = 'botao-secundario botao-ouvir-ditado';
      ouvirDitado.textContent = '🔊 Ouvir ditado';
      ouvirDitado.addEventListener('click', function () {
        falarDitado(pergunta);
      });
      rotuloDitado.htmlFor = idEntradaDitado;
      rotuloDitado.textContent = 'Digite o que você ouviu';
      entradaDitado.id = idEntradaDitado;
      entradaDitado.className = 'entrada-ditado';
      entradaDitado.type = 'text';
      entradaDitado.maxLength = 180;
      entradaDitado.autocomplete = 'off';
      entradaDitado.spellcheck = false;
      entradaDitado.value = typeof resposta === 'string' ? resposta : '';
      entradaDitado.classList.toggle('correta', acertou);
      entradaDitado.classList.toggle('incorreta', corrigida && !acertou);
      entradaDitado.addEventListener('input', function () {
        estado.respostas[pergunta.id] = entradaDitado.value.slice(0, 180);
        delete estado.perguntasCorrigidas[pergunta.id];
        estado.questionarioConcluido = false;
        estado.leituraConcluida = false;
        salvarEstado();
        corrigir.textContent = 'Conferir resposta';
        corrigir.disabled = !entradaDitado.value.trim();
        proxima.disabled = true;
        entradaDitado.classList.remove('correta', 'incorreta');
        retorno.className = 'retorno retorno-pergunta-leitura';
        retorno.textContent = '';
      });
      opcoes.append(instrucaoDitado, ouvirDitado, rotuloDitado, entradaDitado);
    } else {
      if (objetivaComCorrecaoEmLote) {
        var avisoCorrecao = document.createElement('p');
        avisoCorrecao.className = 'aviso-correcao-em-lote';
        avisoCorrecao.textContent =
          'Marque uma alternativa. Os acertos e as explicações aparecerão juntos depois da pergunta ' +
          perguntasObjetivasDoLivro(livroAtual).length +
          '.';
      }
      opcoes.className = 'opcoes-leitura';
      opcoes.setAttribute('role', 'group');
      opcoes.setAttribute('aria-label', 'Alternativas da pergunta');
      alternativasParaExibicao(pergunta).forEach(function (alternativa, indice) {
        var botao = document.createElement('button');
        var letra = document.createElement('span');
        var texto = document.createElement('span');
        botao.type = 'button';
        botao.className = 'opcao-leitura';
        botao.dataset.alternativaId = alternativa.id;
        botao.setAttribute('aria-pressed', String(resposta === alternativa.id));
        botao.classList.toggle('selecionada', resposta === alternativa.id);
        if (corrigida && resposta === alternativa.id) {
          botao.classList.add(acertou ? 'correta' : 'incorreta');
        }
        letra.className = 'letra-opcao';
        letra.textContent = String.fromCharCode(65 + indice);
        texto.textContent = alternativa.texto;
        botao.append(letra, texto);
        botao.addEventListener('click', function () {
          selecionarResposta(pergunta, alternativa.id);
        });
        opcoes.appendChild(botao);
      });
    }
    corrigir.type = 'button';
    corrigir.className = 'botao-principal botao-grande';
    corrigir.textContent = corrigida ? 'Conferido' : 'Conferir resposta';
    corrigir.disabled = !String(resposta || '').trim() || corrigida;
    corrigir.addEventListener('click', corrigirPergunta);
    retorno.className = 'retorno retorno-pergunta-leitura';
    retorno.setAttribute('role', 'status');
    retorno.setAttribute('aria-live', 'polite');
    if (corrigida) {
      retorno.classList.add(acertou ? 'sucesso' : 'tente-novamente');
      if (acertou) {
        window.GlossarioRevisoes.renderizarTexto(retorno, '✓ ' + pergunta.feedback);
      } else {
        retorno.textContent = ehDitado
          ? '↻ Boa tentativa! Ouça novamente e confira cada palavra digitada.'
          : '↻ Boa tentativa! Volte à história se quiser e escolha outra alternativa.';
      }
    }
    navegacao.className = 'navegacao-questionario-leitura';
    anterior.type = 'button';
    anterior.className = 'botao-secundario botao-grande';
    anterior.textContent = 'Pergunta anterior';
    anterior.disabled = estado.perguntaAtual === 0;
    anterior.addEventListener('click', function () {
      estado.perguntaAtual -= 1;
      salvarEstado();
      renderizarQuestionario();
    });
    proxima.type = 'button';
    proxima.className = 'botao-principal botao-grande';
    proxima.textContent = objetivaComCorrecaoEmLote
      ? indiceNaEtapa === itensDaEtapa.length - 1
        ? 'Finalizar perguntas e ver revisão'
        : 'Próxima pergunta'
      : estado.perguntaAtual === livroAtual.questionario.length - 1
        ? 'Ver resultado'
        : 'Próxima pergunta';
    proxima.disabled = objetivaComCorrecaoEmLote ? !resposta : !corrigida;
    proxima.addEventListener('click', function () {
      if (objetivaComCorrecaoEmLote && indiceNaEtapa === itensDaEtapa.length - 1) {
        corrigirObjetivasEmLote();
        return;
      }
      if (estado.perguntaAtual === livroAtual.questionario.length - 1) {
        concluirQuestionario();
      } else {
        estado.perguntaAtual += 1;
        salvarEstado();
        renderizarQuestionario();
      }
    });
    navegacao.append(anterior, proxima);
    cartao.appendChild(titulo);
    if (avisoCorrecao) cartao.appendChild(avisoCorrecao);
    if (atalhosGlossario) cartao.appendChild(atalhosGlossario);
    cartao.appendChild(opcoes);
    if (!objetivaComCorrecaoEmLote) cartao.append(corrigir, retorno);
    cartao.appendChild(navegacao);
    corpo.appendChild(cartao);
  }

  function abrirQuestionario() {
    if (estado.maiorPaginaAlcancada < livroAtual.totalPaginas) return;
    elemento('nome-perfil-questionario').textContent =
      perfilAtual === 'alice' ? 'Alice' : 'Mariana';
    controladorApp.mostrarTela('questionarioLeitura');
    renderizarQuestionario();
  }

  function concluirLeituraEmArquivo() {
    registrarPaginaCarregada(livroAtual.totalPaginas);
    abrirQuestionario();
  }

  function receberMensagemDoLeitor(evento) {
    if (evento.origin !== window.location.origin) return;
    if (!livroAtual || !perfilAtual || !armazenamento) return;
    var dados = objeto(evento.data);
    if (
      dados.livroId !== livroAtual.id ||
      dados.perfil !== perfilAtual ||
      (dados.tipo !== 'leitura-pagina' &&
        dados.tipo !== 'leitura-questionario' &&
        dados.tipo !== 'leitura-explicacao')
    ) {
      return;
    }
    var pagina = limitar(dados.pagina, 1, livroAtual.totalPaginas);
    registrarPaginaCarregada(pagina);
    if (dados.tipo === 'leitura-questionario' && pagina === livroAtual.totalPaginas) {
      abrirQuestionario();
    }
    if (dados.tipo === 'leitura-explicacao' && pagina === livroAtual.totalPaginas) {
      abrirVisualizador(pagina);
    }
  }

  function limparProgresso() {
    if (!perfilAtual || !armazenamento) return false;
    if (!window.confirm('Limpar somente o progresso deste livro para este perfil?')) return false;
    armazenamento.remover();
    estado = estadoInicial(livroAtual);
    paginaRenderizada = 0;
    renderizarBiblioteca();
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: perfilAtual + '-leitura-' + livroAtual.id },
      })
    );
    return true;
  }

  function alvoDeFormulario(alvo) {
    return Boolean(
      alvo &&
      alvo.closest &&
      alvo.closest('input, textarea, select, button, [contenteditable="true"]')
    );
  }

  function registrarEventos() {
    elemento('pagina-anterior-leitura').addEventListener('click', function () {
      renderizarPagina(paginaDesejada(-1));
    });
    elemento('proxima-pagina-leitura').addEventListener('click', function () {
      renderizarPagina(paginaDesejada(1));
    });
    elemento('form-ir-pagina-leitura').addEventListener('submit', function (evento) {
      evento.preventDefault();
      renderizarPagina(elemento('ir-pagina-leitura').value);
    });
    elemento('ajustar-largura-leitura').addEventListener('click', function () {
      atualizarZoom(1);
    });
    elemento('diminuir-zoom-leitura').addEventListener('click', function () {
      atualizarZoom(zoom - 0.25);
    });
    elemento('aumentar-zoom-leitura').addEventListener('click', function () {
      atualizarZoom(zoom + 0.25);
    });
    elemento('abrir-leitor-dedicado').addEventListener('click', abrirLeitorDedicado);
    elemento('abrir-pdf-janela').addEventListener('click', abrirPdfEmJanela);
    elemento('concluir-leitura-arquivo').addEventListener('click', concluirLeituraEmArquivo);
    elemento('terminar-leitura').addEventListener('click', abrirQuestionario);
    elemento('limpar-progresso-leitura').addEventListener('click', limparProgresso);
    document.querySelectorAll('[data-voltar-biblioteca-leitura]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        cancelarDitado();
        sequenciaRenderizacao += 1;
        if (tarefaRenderizacao) tarefaRenderizacao.cancel();
        renderizarBiblioteca();
        controladorApp.mostrarTela('bibliotecaLeitura');
      });
    });
    document.querySelectorAll('[data-voltar-materias-leitura]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        cancelarDitado();
        controladorApp.mostrarTela('trilhas');
      });
    });
    document.addEventListener('keydown', function (evento) {
      if (
        elemento('tela-visualizador-leitura').hidden ||
        alvoDeFormulario(evento.target) ||
        (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight')
      ) {
        return;
      }
      evento.preventDefault();
      renderizarPagina(paginaDesejada(evento.key === 'ArrowLeft' ? -1 : 1));
    });
    window.addEventListener('resize', function () {
      if (elemento('tela-visualizador-leitura').hidden || !paginaRenderizada) return;
      window.clearTimeout(temporizadorRedimensionamento);
      temporizadorRedimensionamento = window.setTimeout(function () {
        renderizarPagina(paginaRenderizada);
      }, 120);
    });
    window.addEventListener('message', receberMensagemDoLeitor);
  }

  function inicializar(controlador) {
    if (inicializado) return;
    controladorApp = controlador;
    if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
      window.speechSynthesis.getVoices();
    }
    registrarEventos();
    inicializado = true;
  }

  window.LeituraRevisoes = {
    inicializar: inicializar,
    abrirBiblioteca: abrirBiblioteca,
    limparProgresso: limparProgresso,
    obterEstado: function () {
      return estado ? JSON.parse(JSON.stringify(estado)) : null;
    },
    obterLivroAtual: function () {
      return livroAtual ? JSON.parse(JSON.stringify(livroAtual)) : null;
    },
    normalizarParaTeste: function (perfil, valor, livroId) {
      livroId = livroId || 'primeiras-licoes-dinheiro';
      var configuracao = configuracaoDoPerfil(perfil, livroId);
      var livro = window.RegistroLeituras.obter(configuracao.livroId);
      return normalizarEstado(valor, estadoInicial(livro), livro);
    },
    irParaPagina: renderizarPagina,
    abrirQuestionario: abrirQuestionario,
  };
})();
