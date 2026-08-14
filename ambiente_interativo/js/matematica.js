(function () {
  'use strict';

  var VERSAO = 1;
  var revisoes = Object.create(null);
  var armazenamentos = Object.create(null);
  var estados = Object.create(null);
  var revisaoAtiva = null;
  var cenaAtiva = null;
  var mostrarTela = null;
  var inicializado = false;

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function estadoInicial() {
    return {
      versao: VERSAO,
      etapaAtual: 0,
      cenas: {},
      pontuacoes: {},
      concluidas: {},
      pontos: 0,
      finalizada: false,
    };
  }

  function normalizarEstado(valor, base, revisao) {
    valor = objeto(valor);
    if (valor.versao != null && Number(valor.versao) !== VERSAO) return base;
    var maximo = revisao.etapas.length - 1;
    base.etapaAtual = Math.max(0, Math.min(maximo, Math.trunc(Number(valor.etapaAtual) || 0)));

    var cenasSalvas = objeto(valor.cenas);
    revisao.etapas.forEach(function (etapa) {
      if (etapa.tipo === 'cena' && cenasSalvas[etapa.id]) {
        base.cenas[etapa.id] = window.MatematicaManipulaveis.normalizarEstado(
          cenasSalvas[etapa.id],
          etapa.cena
        );
      }
      if (objeto(valor.concluidas)[etapa.id] === true) base.concluidas[etapa.id] = true;
      var pontos = Number(objeto(valor.pontuacoes)[etapa.id]);
      if (Number.isFinite(pontos) && pontos >= 0 && pontos <= 1) {
        base.pontuacoes[etapa.id] = pontos;
      }
    });
    base.pontos = Object.keys(base.pontuacoes).reduce(function (total, id) {
      return total + base.pontuacoes[id];
    }, 0);
    base.finalizada = Boolean(valor.finalizada);
    return base;
  }

  function registrar(revisao) {
    if (!revisao || !revisao.id || !revisao.chaveArmazenamento || !Array.isArray(revisao.etapas)) {
      throw new Error('A revisão de Matemática precisa de id, chave e etapas.');
    }
    if (revisoes[revisao.id]) throw new Error('Revisão de Matemática duplicada: ' + revisao.id);
    revisoes[revisao.id] = revisao;
  }

  function armazenamento(revisao) {
    if (!armazenamentos[revisao.id]) {
      armazenamentos[revisao.id] = window.ArmazenamentoRevisoes.criar({
        chave: revisao.chaveArmazenamento,
        padrao: estadoInicial(),
        normalizar: function (valor, base) {
          return normalizarEstado(valor, base, revisao);
        },
      });
    }
    return armazenamentos[revisao.id];
  }

  function obterEstado(id) {
    var revisao = revisoes[id];
    if (!revisao) return null;
    if (!estados[id]) estados[id] = armazenamento(revisao).carregar();
    return estados[id];
  }

  function atualizarObjeto(destino, origem) {
    Object.keys(destino).forEach(function (chave) {
      delete destino[chave];
    });
    Object.keys(origem).forEach(function (chave) {
      destino[chave] = origem[chave];
    });
    return destino;
  }

  function salvar(motivo) {
    if (!revisaoAtiva) return;
    var estado = obterEstado(revisaoAtiva.id);
    var normalizado = armazenamento(revisaoAtiva).salvar(estado);
    estados[revisaoAtiva.id] = atualizarObjeto(estado, normalizado);
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: revisaoAtiva.id, motivo: motivo },
      })
    );
  }

  function descartarCena() {
    if (cenaAtiva) cenaAtiva.destruir();
    cenaAtiva = null;
  }

  function escapar(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function atualizarCabecalho() {
    var estado = obterEstado(revisaoAtiva.id);
    var total = revisaoAtiva.etapas.length;
    var atual = estado.etapaAtual + 1;
    document.getElementById('matematica-cena-contador').textContent =
      'Etapa ' + atual + ' de ' + total;
    document.getElementById('matematica-cena-pontos').textContent = estado.pontos + ' conquistas';
    var barra = document.getElementById('matematica-cena-barra');
    barra.style.width = (atual / total) * 100 + '%';
    barra.parentElement.setAttribute('aria-valuemax', total);
    barra.parentElement.setAttribute('aria-valuenow', atual);
    document.getElementById('matematica-cena-voltar').disabled = estado.etapaAtual === 0;
    document.getElementById('matematica-cena-proxima').hidden = estado.etapaAtual === total - 1;
  }

  function renderizarApresentacao(etapa) {
    return (
      '<article class="apresentacao-centenas"><p class="etiqueta">Matemática manipulativa</p><h1 id="matematica-cena-titulo">' +
      escapar(etapa.titulo) +
      '</h1><p>' +
      escapar(etapa.texto) +
      '</p><div class="passos-interacao" aria-label="Como usar as peças"><span><strong>1</strong> Escolha uma peça</span><span><strong>2</strong> Toque em “Colocar” ou arraste</span><span><strong>3</strong> Confira e tente de novo</span></div><button type="button" class="botao-principal botao-gigante" data-math-start>Começar a aventura</button></article>'
    );
  }

  function renderizarFinal(etapa) {
    var estado = obterEstado(revisaoAtiva.id);
    var avaliativas = revisaoAtiva.etapas.filter(function (item) {
      return item.tipo === 'cena';
    }).length;
    return (
      '<article class="final-centenas"><span class="celebracao-matematica" aria-hidden="true">★</span><p class="etiqueta">Aventura concluída</p><h1 id="matematica-cena-titulo">' +
      escapar(etapa.titulo) +
      '</h1><p>' +
      escapar(etapa.texto) +
      '</p><p class="resumo-final-centenas"><strong>' +
      estado.pontos +
      '</strong> de ' +
      avaliativas +
      ' desafios conquistados. Você pode voltar e tentar qualquer cena novamente.</p><button type="button" class="botao-secundario botao-grande" data-math-restart-review>Recomeçar esta revisão</button></article>'
    );
  }

  function renderizar() {
    if (!revisaoAtiva) return;
    descartarCena();
    var estado = obterEstado(revisaoAtiva.id);
    var etapa = revisaoAtiva.etapas[estado.etapaAtual];
    var conteudo = document.getElementById('matematica-cena-conteudo');
    document.getElementById('matematica-cena-nome-revisao').textContent = revisaoAtiva.titulo;

    if (etapa.tipo === 'apresentacao') {
      conteudo.innerHTML = renderizarApresentacao(etapa);
    } else if (etapa.tipo === 'final') {
      estado.finalizada = true;
      conteudo.innerHTML = renderizarFinal(etapa);
      salvar('finalizar');
    } else {
      conteudo.innerHTML =
        '<article class="etapa-centenas"><header><p class="etiqueta">' +
        escapar(etapa.rotulo || 'Desafio manipulativo') +
        '</p><h1 id="matematica-cena-titulo">' +
        escapar(etapa.titulo) +
        '</h1><p>' +
        escapar(etapa.objetivo || '') +
        '</p></header><div id="recipiente-cena-matematica"></div></article>';
      var configuracaoCena = Object.assign({}, etapa.cena, {
        id: etapa.id,
        estado: estado.cenas[etapa.id],
        aoAlterar: function (novoEstado, motivo) {
          estado.cenas[etapa.id] = novoEstado;
          if (novoEstado.concluida) {
            estado.concluidas[etapa.id] = true;
            estado.pontuacoes[etapa.id] = 1;
          }
          estado.pontos = Object.keys(estado.pontuacoes).reduce(function (total, id) {
            return total + estado.pontuacoes[id];
          }, 0);
          salvar(motivo);
          atualizarCabecalho();
        },
      });
      cenaAtiva = window.CenaMatematica.montar(
        document.getElementById('recipiente-cena-matematica'),
        configuracaoCena
      );
    }
    atualizarCabecalho();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function irPara(indice) {
    if (!revisaoAtiva) return;
    var estado = obterEstado(revisaoAtiva.id);
    estado.etapaAtual = Math.max(0, Math.min(revisaoAtiva.etapas.length - 1, Number(indice) || 0));
    salvar('navegar');
    renderizar();
    var titulo = document.getElementById('matematica-cena-titulo');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  }

  function abrir(id) {
    var revisao = revisoes[id];
    if (!revisao) throw new Error('Revisão de Matemática não encontrada: ' + id);
    revisaoAtiva = revisao;
    obterEstado(id);
    mostrarTela('matematicaCena');
    renderizar();
  }

  function situacao(id) {
    var estado = obterEstado(id);
    if (!estado) return 'nao-iniciada';
    if (estado.finalizada) return 'concluida';
    if (
      estado.etapaAtual > 0 ||
      Object.keys(estado.cenas).length ||
      Object.keys(estado.concluidas).length
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function limpar(id, pedirConfirmacao) {
    var revisao = revisoes[id];
    if (!revisao) return false;
    if (
      pedirConfirmacao !== false &&
      !window.confirm('Limpar somente o progresso de “' + revisao.titulo + '”?')
    ) {
      return false;
    }
    armazenamento(revisao).remover();
    estados[id] = estadoInicial();
    if (revisaoAtiva && revisaoAtiva.id === id) renderizar();
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', { detail: { revisaoId: id, motivo: 'limpar' } })
    );
    return true;
  }

  function aoClicarConteudo(evento) {
    if (evento.target.closest('[data-math-start]')) irPara(1);
    if (evento.target.closest('[data-math-restart-review]') && revisaoAtiva) {
      if (limpar(revisaoAtiva.id, true)) irPara(0);
    }
  }

  function inicializar(opcoes) {
    if (inicializado) return;
    mostrarTela = opcoes.mostrarTela;
    document.getElementById('matematica-cena-conteudo').addEventListener('click', aoClicarConteudo);
    document.getElementById('matematica-cena-voltar').addEventListener('click', function () {
      if (revisaoAtiva) irPara(obterEstado(revisaoAtiva.id).etapaAtual - 1);
    });
    document.getElementById('matematica-cena-proxima').addEventListener('click', function () {
      if (revisaoAtiva) irPara(obterEstado(revisaoAtiva.id).etapaAtual + 1);
    });
    inicializado = true;
  }

  window.MatematicaRevisoes = {
    registrar: registrar,
    inicializar: inicializar,
    abrir: abrir,
    irPara: irPara,
    obterEstado: obterEstado,
    obterAtiva: function () {
      return revisaoAtiva;
    },
    situacao: situacao,
    limpar: limpar,
    suspender: descartarCena,
    listar: function () {
      return Object.keys(revisoes).map(function (id) {
        return revisoes[id];
      });
    },
  };
})();
