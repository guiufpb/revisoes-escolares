(function () {
  'use strict';

  var ID_ALICE = 'alice-ciencias-origem-materiais';
  var ID_CENTENAS = 'mariana-matematica-centenas-em-acao';
  var ID_GRAMATICA = 'mariana-gramatica-revisao-ampla';
  var IDS_GRAMATICA_COMPARTILHADA = {
    alice: 'alice-gramatica-h-til-vocabulario',
    mariana: 'mariana-gramatica-h-til-vocabulario',
  };
  var IDS_OPERACOES = {
    alice: 'alice-matematica-contas-dia-a-dia',
    mariana: 'mariana-matematica-contas-dia-a-dia',
  };
  var IDS_INGLES = {
    alice: 'alice-ingles-at-school-unidade-3',
    mariana: 'mariana-ingles-at-school-unidade-3',
  };
  var telas;
  var alunoAtual = null;
  var opcaoSelecionada = null;
  var estadoAlice;
  var armazenamentoAlice;
  var desenhoAliceAtivo = false;
  var telaAtualId = 'inicial';

  function estadoInicialAlice() {
    return { etapa: 0, concluidas: [], respostas: {}, desenhos: {}, tentativas: 0 };
  }

  function normalizarAlice(valor, base) {
    valor = valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
    var concluidas = Array.isArray(valor.concluidas) ? valor.concluidas : [];
    if (valor.concluida === true) concluidas.push(0);

    base.etapa = 0;
    base.concluidas = concluidas.map(Number).filter(function (indice, posicao, lista) {
      return indice === 0 && lista.indexOf(indice) === posicao;
    });
    base.respostas =
      valor.respostas && typeof valor.respostas === 'object' && !Array.isArray(valor.respostas)
        ? valor.respostas
        : {};
    base.desenhos =
      valor.desenhos && typeof valor.desenhos === 'object' && !Array.isArray(valor.desenhos)
        ? Object.keys(valor.desenhos).reduce(function (validos, chave) {
            if (
              typeof valor.desenhos[chave] === 'string' &&
              valor.desenhos[chave].indexOf('data:image/') === 0
            ) {
              validos[chave] = valor.desenhos[chave];
            }
            return validos;
          }, {})
        : {};
    base.tentativas = Math.max(0, Number(valor.tentativas) || 0);
    return base;
  }

  function migrarAlice(dados) {
    var antigo =
      dados && dados.alice && dados.alice.cienciasOrigemMateriais
        ? dados.alice.cienciasOrigemMateriais
        : null;
    return antigo
      ? {
          concluidas: antigo.concluida ? [0] : [],
          tentativas: antigo.tentativas,
          respostas: {},
          desenhos: {},
        }
      : null;
  }

  function emitirProgresso(id) {
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', { detail: { revisaoId: id } })
    );
  }

  function salvarAlice() {
    estadoAlice = armazenamentoAlice.salvar(estadoAlice);
    emitirProgresso(ID_ALICE);
  }

  function gerenciarDesenhoAlice(ativar) {
    var painel = document.getElementById('tela-revisao');
    if (!painel) return;
    if (!ativar) {
      window.DesenhoRevisoes.descartar(painel);
      desenhoAliceAtivo = false;
      return;
    }
    if (desenhoAliceAtivo) {
      window.requestAnimationFrame(window.DesenhoRevisoes.ajustarTodos);
      return;
    }
    window.DesenhoRevisoes.inicializar(painel, function (canvas) {
      return {
        dadosIniciais: estadoAlice.desenhos[canvas.id],
        aoAlterar: function (dados) {
          if (dados) estadoAlice.desenhos[canvas.id] = dados;
          else delete estadoAlice.desenhos[canvas.id];
          salvarAlice();
        },
      };
    });
    desenhoAliceAtivo = true;
  }

  function focarTitulo(tela) {
    var titulo = tela.querySelector('h1');
    if (!titulo) return;
    titulo.setAttribute('tabindex', '-1');
    titulo.focus({ preventScroll: true });
    titulo.addEventListener(
      'blur',
      function () {
        titulo.removeAttribute('tabindex');
      },
      { once: true }
    );
  }

  function mostrarTela(id) {
    if (telaAtualId === 'ingles' && id !== 'ingles' && window.InglesRevisoes) {
      window.InglesRevisoes.pararAudio();
    }
    if (telaAtualId === 'gramaticaMariana' && id !== 'gramaticaMariana' && window.GramaticaDitado) {
      window.GramaticaDitado.parar();
    }
    if (telaAtualId === 'matematicaCena' && id !== 'matematicaCena') {
      window.MatematicaRevisoes.suspender();
    }
    telaAtualId = id;
    gerenciarDesenhoAlice(id === 'revisao');
    Object.keys(telas).forEach(function (chave) {
      var ativa = chave === id;
      telas[chave].hidden = !ativa;
      telas[chave].classList.toggle('tela-ativa', ativa);
    });

    document.getElementById('botao-inicio').hidden = id === 'inicial';
    document.getElementById('limpar-progresso').textContent =
      id === 'bibliotecaLeitura' || id === 'visualizadorLeitura' || id === 'questionarioLeitura'
        ? 'Limpar progresso desta leitura'
        : id === 'ingles'
          ? 'Limpar progresso de Inglês'
          : id === 'matematicaCena'
            ? 'Limpar esta revisão de Matemática'
            : id === 'matematicaOperacoes'
              ? 'Limpar esta atividade de Matemática'
              : id === 'gramaticaMariana'
                ? 'Limpar progresso de Gramática'
                : 'Limpar progresso';
    if (id === 'marianaRevisao') {
      window.requestAnimationFrame(window.DesenhoRevisoes.ajustarTodos);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    focarTitulo(telas[id]);
  }

  function situacaoAlice() {
    if (estadoAlice.concluidas.indexOf(0) >= 0) return 'concluida';
    if (
      estadoAlice.tentativas > 0 ||
      Object.keys(estadoAlice.respostas).length > 0 ||
      Object.keys(estadoAlice.desenhos).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function situacaoMariana() {
    if (!window.RevisaoMatematicaMariana) return 'nao-iniciada';
    var atual = window.RevisaoMatematicaMariana.obterEstado();
    if (atual.finalizada) return 'concluida';
    if (
      Number(atual.etapaAtual) > 0 ||
      Object.keys(atual.respostas || {}).length > 0 ||
      Object.keys(atual.concluidas || {}).length > 0 ||
      Object.keys(atual.canvases || {}).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function situacaoGramatica() {
    if (!window.RevisaoGramaticaMariana) return 'nao-iniciada';
    return window.RevisaoGramaticaMariana.obterSituacao();
  }

  function situacaoGramaticaCompartilhada(id) {
    if (!window.GramaticaQuestionarios) return 'nao-iniciada';
    return window.GramaticaQuestionarios.obterSituacao(id);
  }

  function situacaoOperacoes(id) {
    if (!window.MatematicaOperacoes) return 'nao-iniciada';
    return window.MatematicaOperacoes.obterSituacao(id);
  }

  function atualizarEstadoCartao(revisao, situacao) {
    var cartao = document.getElementById(revisao.cartaoId);
    if (!cartao) return;
    var textos = {
      'nao-iniciada': 'Não iniciada',
      'em-andamento': 'Em andamento',
      concluida: 'Concluída',
    };
    var idEstado = revisao.cartaoId + '-estado';
    var indicador = document.getElementById(idEstado);
    if (!indicador) {
      indicador = document.createElement('span');
      indicador.id = idEstado;
      indicador.className = 'estado-revisao';
      cartao.appendChild(indicador);
    }
    indicador.textContent = textos[situacao];
    cartao.classList.remove('estado-nao-iniciada', 'estado-em-andamento', 'estado-concluida');
    cartao.classList.add('estado-' + situacao);
    cartao.dataset.estadoRevisao = situacao;
    cartao.setAttribute('aria-describedby', idEstado);
  }

  function atualizarCartoes() {
    window.RegistroRevisoes.validar().forEach(function (revisao) {
      if (revisao.exibirEstadoNoCartao === false) return;
      var ehIngles = revisao.controladorCompartilhado === 'ingles';
      var ehOperacoes = revisao.controladorCompartilhado === 'matematica-operacoes';
      var ehGramaticaCompartilhada = revisao.controladorCompartilhado === 'gramatica-questionarios';
      if (
        (ehIngles || ehOperacoes || ehGramaticaCompartilhada) &&
        (!alunoAtual || revisao.aluno !== alunoAtual)
      ) {
        return;
      }
      var situacao;
      if (revisao.id === ID_ALICE) situacao = situacaoAlice();
      else if (revisao.id === ID_CENTENAS) {
        situacao = window.MatematicaRevisoes.situacao(ID_CENTENAS);
      } else if (revisao.id === ID_GRAMATICA) {
        situacao = situacaoGramatica();
      } else if (ehGramaticaCompartilhada) {
        situacao = situacaoGramaticaCompartilhada(revisao.id);
      } else if (ehOperacoes) {
        situacao = situacaoOperacoes(revisao.id);
      } else if (ehIngles && window.InglesRevisoes) {
        situacao = window.InglesRevisoes.obterSituacao(revisao.aluno, revisao.id);
      } else situacao = situacaoMariana();
      atualizarEstadoCartao(revisao, situacao);
    });
  }

  function atualizarResumo() {
    var resumo = document.getElementById('progresso-resumo');
    var estadoLeitura = window.LeituraRevisoes && window.LeituraRevisoes.obterEstado();
    var livroLeitura = window.LeituraRevisoes && window.LeituraRevisoes.obterLivroAtual();
    if (
      estadoLeitura &&
      (telaAtualId === 'bibliotecaLeitura' ||
        telaAtualId === 'visualizadorLeitura' ||
        telaAtualId === 'questionarioLeitura')
    ) {
      resumo.textContent =
        (alunoAtual === 'alice' ? 'Alice' : 'Mariana') +
        ': página ' +
        estadoLeitura.paginaAtual +
        '/' +
        livroLeitura.totalPaginas;
    } else if (telaAtualId === 'ingles' && window.InglesRevisoes) {
      resumo.textContent =
        (alunoAtual === 'alice' ? 'Alice' : 'Mariana') +
        ' · Inglês: ' +
        (window.InglesRevisoes.obterResumo() || 'vamos ouvir!');
    } else if (telaAtualId === 'matematicaCena') {
      var ativa = window.MatematicaRevisoes.obterAtiva();
      var estadoCentenas = ativa && window.MatematicaRevisoes.obterEstado(ativa.id);
      resumo.textContent = estadoCentenas
        ? 'Mariana · ' +
          ativa.titulo +
          ': etapa ' +
          (estadoCentenas.etapaAtual + 1) +
          '/' +
          ativa.etapas.length +
          ' · ' +
          estadoCentenas.pontos +
          ' conquistas'
        : 'Mariana: vamos construir!';
    } else if (telaAtualId === 'matematicaOperacoes' && window.MatematicaOperacoes) {
      var operacoesAtiva = window.MatematicaOperacoes.obterAtiva();
      var estadoOperacoes =
        operacoesAtiva && window.MatematicaOperacoes.obterEstado(operacoesAtiva.id);
      resumo.textContent = estadoOperacoes
        ? (operacoesAtiva.perfil === 'alice' ? 'Alice' : 'Mariana') +
          ' · Matemática: questão ' +
          (estadoOperacoes.questaoAtual + 1) +
          '/' +
          operacoesAtiva.questoes.length +
          ' · ' +
          estadoOperacoes.pontos +
          ' acertos'
        : 'Matemática: vamos calcular!';
    } else if (telaAtualId === 'trilhaMatematica') {
      resumo.textContent =
        (alunoAtual === 'alice' ? 'Alice' : 'Mariana') + ' · Matemática: escolha uma atividade';
    } else if (telaAtualId === 'gramaticaMariana') {
      var gramaticaAtiva =
        window.GramaticaQuestionarios && window.GramaticaQuestionarios.obterAtiva();
      if (gramaticaAtiva) {
        var estadoGramaticaCompartilhada = window.GramaticaQuestionarios.obterEstado(
          gramaticaAtiva.id
        );
        resumo.textContent = estadoGramaticaCompartilhada.finalizada
          ? gramaticaAtiva.nome + ' · Gramática: 25 questões concluídas ✓'
          : gramaticaAtiva.nome +
            ' · Gramática: questão ' +
            (estadoGramaticaCompartilhada.questaoAtual + 1) +
            '/25 · ' +
            estadoGramaticaCompartilhada.pontos +
            ' acertos';
      } else if (window.RevisaoGramaticaMariana) {
        var estadoGramatica = window.RevisaoGramaticaMariana.obterEstado();
        resumo.textContent = estadoGramatica.finalizada
          ? 'Mariana · Gramática: 40 questões concluídas ✓'
          : 'Mariana · Gramática: questão ' +
            (estadoGramatica.questaoAtual + 1) +
            '/40 · ' +
            estadoGramatica.pontos +
            ' acertos';
      }
    } else if (alunoAtual === 'mariana' && window.RevisaoMatematicaMariana) {
      var estadoMariana = window.RevisaoMatematicaMariana.obterEstado();
      resumo.textContent =
        'Mariana: etapa ' +
        (estadoMariana.etapaAtual + 1) +
        '/25 · ' +
        estadoMariana.pontos +
        ' pontos';
    } else if (alunoAtual === 'alice') {
      resumo.textContent =
        situacaoAlice() === 'concluida'
          ? 'Alice: 1 atividade concluída ✓'
          : situacaoAlice() === 'em-andamento'
            ? 'Alice: revisão em andamento'
            : 'Alice: vamos começar!';
    } else {
      resumo.textContent = 'Vamos começar!';
    }
    atualizarCartoes();
  }

  function escolherAluno(aluno) {
    alunoAtual = aluno;
    document.getElementById('saudacao-aluno').textContent =
      aluno === 'alice' ? 'Olá, Alice!' : 'Olá, Mariana!';
    document.getElementById('materia-ciencias').hidden = aluno !== 'alice';
    document.getElementById('materia-ingles').hidden = false;
    document.getElementById('abrir-ingles-city-life').hidden = aluno !== 'mariana';
    document.getElementById('abrir-ingles-at-the-farm').hidden = aluno !== 'alice';
    document.getElementById('materia-matematica').hidden = false;
    document.getElementById('materia-matematica-descricao').textContent =
      aluno === 'alice' ? '15 questões de adição e subtração' : 'Revisões e desafios com números';
    document.getElementById('matematica-nome-perfil').textContent =
      aluno === 'alice' ? 'Alice' : 'Mariana';
    document.getElementById('operacoes-matematica-descricao').textContent =
      aluno === 'alice' ? '15 questões para praticar' : '20 questões, incluindo centenas';
    document.getElementById('abrir-revisao-mariana').hidden = aluno !== 'mariana';
    document.getElementById('abrir-centenas-em-acao').hidden = aluno !== 'mariana';
    document.getElementById('materia-leitura').hidden = false;
    document.getElementById('abrir-gramatica-mariana').hidden = aluno !== 'mariana';
    document.getElementById('limpar-progresso').hidden = false;
    atualizarResumo();
    mostrarTela('trilhas');
  }

  function abrirRevisaoAlice() {
    if (alunoAtual !== 'alice') escolherAluno('alice');
    mostrarTela('revisao');
  }

  function montarAtividade() {
    var atividade = window.AtividadesRevisoes.dados.origemMateriais;
    var pergunta = document.getElementById('pergunta-atividade');
    var opcoes = document.getElementById('opcoes-atividade');
    pergunta.textContent = atividade.pergunta;
    opcoes.innerHTML = '';

    atividade.opcoes.forEach(function (opcao, indice) {
      var botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'opcao-atividade';
      botao.dataset.opcao = opcao.id;
      botao.setAttribute('aria-pressed', 'false');
      botao.innerHTML =
        '<span class="letra-opcao">' +
        String.fromCharCode(65 + indice) +
        '</span><span>' +
        opcao.texto +
        '</span>';
      botao.addEventListener('click', function () {
        selecionarOpcao(botao, opcao.id);
      });
      opcoes.appendChild(botao);
    });

    if (estadoAlice.respostas.origemMateriais) {
      var salva = opcoes.querySelector(
        '[data-opcao="' + CSS.escape(estadoAlice.respostas.origemMateriais) + '"]'
      );
      if (salva) selecionarOpcao(salva, estadoAlice.respostas.origemMateriais, false);
    }
  }

  function selecionarOpcao(botao, idOpcao, persistir) {
    opcaoSelecionada = idOpcao;
    document.querySelectorAll('.opcao-atividade').forEach(function (opcao) {
      var selecionada = opcao === botao;
      opcao.classList.toggle('selecionada', selecionada);
      opcao.setAttribute('aria-pressed', String(selecionada));
      opcao.classList.remove('correta', 'incorreta');
    });
    document.getElementById('corrigir-atividade').disabled = false;
    document.getElementById('retorno-atividade').textContent = '';
    if (persistir !== false) {
      estadoAlice.respostas.origemMateriais = idOpcao;
      salvarAlice();
    }
  }

  function corrigirAtividade() {
    if (!opcaoSelecionada) return;
    var resultado = window.AtividadesRevisoes.corrigir('origemMateriais', opcaoSelecionada);
    var retorno = document.getElementById('retorno-atividade');
    var selecionada = document.querySelector('[data-opcao="' + CSS.escape(opcaoSelecionada) + '"]');
    var correta = document.querySelector(
      '[data-opcao="' + CSS.escape(resultado.opcaoCorreta || '') + '"]'
    );

    estadoAlice.tentativas += 1;
    if (resultado.correta && estadoAlice.concluidas.indexOf(0) < 0) {
      estadoAlice.concluidas.push(0);
    }
    salvarAlice();

    if (selecionada) selecionada.classList.add(resultado.correta ? 'correta' : 'incorreta');
    if (!resultado.correta && correta) correta.classList.add('correta');
    retorno.textContent = (resultado.correta ? '✓ ' : '↻ ') + resultado.mensagem;
    retorno.className = 'retorno ' + (resultado.correta ? 'sucesso' : 'tente-novamente');
    atualizarResumo();
  }

  function registrarEventos() {
    document.querySelectorAll('[data-aluno]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        escolherAluno(botao.dataset.aluno);
      });
    });
    document
      .querySelector('[data-materia="ciencias"]')
      .addEventListener('click', abrirRevisaoAlice);
    document.querySelector('[data-materia="ingles"]').addEventListener('click', function () {
      window.InglesRevisoes.abrir(alunoAtual, IDS_INGLES[alunoAtual]);
      atualizarResumo();
    });
    document.getElementById('abrir-ingles-city-life').addEventListener('click', function () {
      window.InglesRevisoes.abrir('mariana', 'mariana-ingles-city-life-unidade-5');
      atualizarResumo();
    });
    document.getElementById('abrir-ingles-at-the-farm').addEventListener('click', function () {
      window.InglesRevisoes.abrir('alice', 'alice-ingles-at-the-farm-unidade-5');
      atualizarResumo();
    });
    document.querySelector('[data-materia="matematica"]').addEventListener('click', function () {
      mostrarTela('trilhaMatematica');
    });
    document.getElementById('abrir-operacoes-matematica').addEventListener('click', function () {
      window.MatematicaOperacoes.abrir(IDS_OPERACOES[alunoAtual]);
      atualizarResumo();
    });
    document.querySelector('[data-materia="leitura"]').addEventListener('click', function () {
      window.LeituraRevisoes.abrirBiblioteca(alunoAtual);
      atualizarResumo();
    });
    document.getElementById('abrir-gramatica-mariana').addEventListener('click', function () {
      window.GramaticaQuestionarios.desativar();
      window.RevisaoGramaticaMariana.abrir();
      mostrarTela('gramaticaMariana');
      atualizarResumo();
    });
    document.getElementById('abrir-gramatica-h-til').addEventListener('click', function () {
      window.GramaticaQuestionarios.abrir(IDS_GRAMATICA_COMPARTILHADA[alunoAtual]);
      atualizarResumo();
    });
    document.getElementById('abrir-revisao-mariana').addEventListener('click', function () {
      window.RevisaoMatematicaMariana.abrir();
      mostrarTela('marianaRevisao');
      atualizarResumo();
    });
    document.getElementById('abrir-centenas-em-acao').addEventListener('click', function () {
      window.MatematicaRevisoes.abrir(ID_CENTENAS);
      atualizarResumo();
    });
    document.querySelectorAll('[data-voltar-materias]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        mostrarTela('trilhas');
      });
    });
    document.querySelectorAll('[data-voltar-trilha-matematica]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        mostrarTela('trilhaMatematica');
      });
    });
    document.getElementById('corrigir-atividade').addEventListener('click', corrigirAtividade);
    document.getElementById('voltar-trilhas').addEventListener('click', function () {
      mostrarTela('trilhas');
    });
    document.getElementById('botao-inicio').addEventListener('click', function () {
      alunoAtual = null;
      document.getElementById('limpar-progresso').hidden = true;
      mostrarTela('inicial');
      atualizarResumo();
    });
    document.getElementById('limpar-progresso').addEventListener('click', function () {
      if (
        telaAtualId === 'bibliotecaLeitura' ||
        telaAtualId === 'visualizadorLeitura' ||
        telaAtualId === 'questionarioLeitura'
      ) {
        if (window.LeituraRevisoes.limparProgresso()) mostrarTela('bibliotecaLeitura');
        atualizarResumo();
        return;
      }
      if (telaAtualId === 'ingles') {
        if (window.InglesRevisoes.limparProgresso()) atualizarResumo();
        return;
      }
      if (telaAtualId === 'matematicaCena') {
        var revisaoAtiva = window.MatematicaRevisoes.obterAtiva();
        if (revisaoAtiva) window.MatematicaRevisoes.limpar(revisaoAtiva.id, true);
        atualizarResumo();
        return;
      }
      if (telaAtualId === 'matematicaOperacoes') {
        var operacoes = window.MatematicaOperacoes.obterAtiva();
        if (operacoes) window.MatematicaOperacoes.limpar(operacoes.id, true);
        atualizarResumo();
        return;
      }
      if (telaAtualId === 'gramaticaMariana') {
        var gramatica = window.GramaticaQuestionarios.obterAtiva();
        if (gramatica) {
          if (window.GramaticaQuestionarios.limpar(gramatica.id, true)) atualizarResumo();
        } else if (window.RevisaoGramaticaMariana.limparProgresso(true)) {
          atualizarResumo();
        }
        return;
      }
      var mensagem =
        alunoAtual === 'mariana'
          ? 'Limpar apenas o progresso de Matemática da Mariana?'
          : 'Limpar apenas o progresso da revisão da Alice?';
      if (!window.confirm(mensagem)) return;
      if (alunoAtual === 'mariana') {
        window.RevisaoMatematicaMariana.limparProgresso();
      } else {
        armazenamentoAlice.remover();
        estadoAlice = estadoInicialAlice();
        opcaoSelecionada = null;
        montarAtividade();
        gerenciarDesenhoAlice(false);
      }
      atualizarResumo();
    });
    document.addEventListener('revisaoprogressoalterado', atualizarResumo);
  }

  function mostrarErroInicializacao(erro) {
    console.error('O ambiente interativo não pôde ser inicializado.', erro);
    var aviso = document.createElement('div');
    aviso.className = 'aviso-inicializacao';
    aviso.setAttribute('role', 'alert');
    aviso.textContent =
      'Não foi possível carregar todo o ambiente. Reabra a página para tentar novamente.';
    document.body.prepend(aviso);
  }

  function inicializar() {
    try {
      telas = {
        inicial: document.getElementById('tela-inicial'),
        trilhas: document.getElementById('tela-trilhas'),
        revisao: document.getElementById('tela-revisao'),
        ingles: document.getElementById('tela-ingles'),
        trilhaMatematica: document.getElementById('tela-trilha-matematica'),
        marianaRevisao: document.getElementById('tela-mariana-revisao'),
        matematicaCena: document.getElementById('tela-matematica-cena'),
        matematicaOperacoes: document.getElementById('tela-matematica-operacoes'),
        gramaticaMariana: document.getElementById('tela-gramatica-mariana'),
        bibliotecaLeitura: document.getElementById('tela-biblioteca-leitura'),
        visualizadorLeitura: document.getElementById('tela-visualizador-leitura'),
        questionarioLeitura: document.getElementById('tela-questionario-leitura'),
      };
      armazenamentoAlice = window.ArmazenamentoRevisoes.criar({
        chave: window.RegistroRevisoes.obter(ID_ALICE).chaveArmazenamento,
        padrao: estadoInicialAlice(),
        normalizar: normalizarAlice,
        legados: [{ chave: 'revisoes-escolares-progresso-v1', migrar: migrarAlice }],
      });
      estadoAlice = armazenamentoAlice.carregar();
      window.RegistroRevisoes.validar();
      montarAtividade();
      window.LeituraRevisoes.inicializar({ mostrarTela: mostrarTela });
      window.InglesRevisoes.inicializar({ mostrarTela: mostrarTela });
      window.MatematicaRevisoes.inicializar({ mostrarTela: mostrarTela });
      window.MatematicaOperacoes.inicializar({ mostrarTela: mostrarTela });
      window.GramaticaQuestionarios.inicializar({ mostrarTela: mostrarTela });
      registrarEventos();
      atualizarResumo();
      mostrarTela('inicial');
      document.documentElement.classList.add('aplicacao-pronta');
    } catch (erro) {
      mostrarErroInicializacao(erro);
    }
  }

  document.addEventListener('DOMContentLoaded', inicializar, { once: true });
})();
