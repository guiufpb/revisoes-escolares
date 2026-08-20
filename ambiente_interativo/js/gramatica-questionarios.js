(function () {
  'use strict';

  var revisoes = Object.create(null);
  var armazenamentos = Object.create(null);
  var revisaoAtiva = null;
  var estado = null;
  var conteudo = null;
  var controladorApp = null;

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function estadoInicial() {
    return {
      questaoAtual: 0,
      respostas: {},
      corrigidas: {},
      pontuadas: {},
      pontos: 0,
      finalizada: false,
    };
  }

  function normalizadorDaRevisao(revisao) {
    return function (valor, base) {
      valor = objeto(valor);
      base.questaoAtual = Math.max(
        0,
        Math.min(revisao.questoes.length - 1, Math.trunc(Number(valor.questaoAtual) || 0))
      );
      base.respostas = objeto(valor.respostas);
      base.corrigidas = {};
      base.pontuadas = {};
      revisao.questoes.forEach(function (item) {
        if (objeto(valor.corrigidas)[item.id]) base.corrigidas[item.id] = true;
        if (objeto(valor.pontuadas)[item.id]) base.pontuadas[item.id] = true;
      });
      base.pontos = Object.keys(base.pontuadas).length;
      base.finalizada =
        Boolean(valor.finalizada) &&
        Object.keys(base.corrigidas).length === revisao.questoes.length;
      return base;
    };
  }

  function registrar(configuracao) {
    if (!configuracao || !configuracao.id || revisoes[configuracao.id]) {
      throw new Error('Cadastro de revisão de Gramática inválido ou repetido.');
    }
    if (!Array.isArray(configuracao.questoes) || configuracao.questoes.length === 0) {
      throw new Error('A revisão de Gramática precisa ter questões.');
    }
    revisoes[configuracao.id] = configuracao;
  }

  function obterArmazenamento(revisao) {
    if (!armazenamentos[revisao.id]) {
      armazenamentos[revisao.id] = window.ArmazenamentoRevisoes.criar({
        chave: revisao.chave,
        padrao: estadoInicial(),
        normalizar: normalizadorDaRevisao(revisao),
      });
    }
    return armazenamentos[revisao.id];
  }

  function emitirProgresso(revisao) {
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', { detail: { revisaoId: revisao.id } })
    );
  }

  function salvar() {
    estado.pontos = Object.keys(estado.pontuadas).length;
    estado = obterArmazenamento(revisaoAtiva).salvar(estado);
    emitirProgresso(revisaoAtiva);
  }

  function normalizarResposta(valor, acentuacaoObrigatoria) {
    var resposta = String(valor == null ? '' : valor)
      .trim()
      .toLowerCase()
      .replace(/\s+([.!?])/g, '$1')
      .replace(/\s+/g, ' ');
    if (!acentuacaoObrigatoria) {
      resposta = resposta.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return resposta;
  }

  function respostaCorreta(valor, subitem) {
    var normalizada = normalizarResposta(valor, subitem.acentuacaoObrigatoria);
    return subitem.respostas.some(function (resposta) {
      return normalizarResposta(resposta, subitem.acentuacaoObrigatoria) === normalizada;
    });
  }

  function escapar(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function respostasDaQuestao(item) {
    var respostas = estado.respostas[item.id];
    return Array.isArray(respostas) ? respostas.slice(0, item.itens.length) : [];
  }

  function montarCampos(item, respostas) {
    return (
      '<div class="lista-campos-mariana">' +
      item.itens
        .map(function (subitem, indice) {
          var idCampo = 'gramatica-resposta-' + item.id + '-' + indice;
          if (item.ditado) {
            return (
              '<div class="campo-mariana campo-mariana-ditado"><label for="' +
              escapar(idCampo) +
              '"><span>' +
              escapar(subitem.pergunta) +
              '</span></label><div class="campo-resposta-ditado"><input id="' +
              escapar(idCampo) +
              '" type="text" data-resposta-gramatica="' +
              indice +
              '" value="' +
              escapar(respostas[indice] || '') +
              '" autocomplete="off" autocapitalize="sentences">' +
              window.GramaticaDitado.botaoHtml(indice) +
              '</div></div>'
            );
          }
          return (
            '<label class="campo-mariana' +
            (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
            '"><span>' +
            escapar(subitem.pergunta) +
            '</span><input type="text" data-resposta-gramatica="' +
            indice +
            '" value="' +
            escapar(respostas[indice] || '') +
            '" autocomplete="off" autocapitalize="sentences"></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function montarOpcoes(item, respostas) {
    return item.itens
      .map(function (subitem, indice) {
        return (
          '<fieldset class="questao-mariana" data-item-gramatica="' +
          indice +
          '"><legend>' +
          escapar(subitem.pergunta) +
          '</legend><div class="opcoes-mariana">' +
          subitem.opcoes
            .map(function (opcao) {
              var selecionada = respostas[indice] === opcao;
              return (
                '<button type="button" class="opcao-mariana' +
                (selecionada ? ' selecionada' : '') +
                '" data-opcao-gramatica="' +
                escapar(opcao) +
                '" aria-pressed="' +
                String(selecionada) +
                '">' +
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

  function atualizarNavegacao() {
    var total = revisaoAtiva.questoes.length;
    var indice = estado.questaoAtual;
    var item = revisaoAtiva.questoes[indice];
    var finalizada = estado.finalizada;
    document.getElementById('gramatica-contador').textContent = finalizada
      ? total + ' questões concluídas'
      : 'Questão ' + (indice + 1) + ' de ' + total;
    document.getElementById('gramatica-pontos').textContent = estado.pontos + ' de ' + total;
    document.getElementById('gramatica-barra').style.width =
      ((finalizada ? total : indice + 1) / total) * 100 + '%';
    var progresso = document.getElementById('gramatica-progresso');
    progresso.setAttribute('aria-valuemax', total);
    progresso.setAttribute('aria-valuenow', finalizada ? total : indice + 1);
    document.getElementById('gramatica-voltar').disabled = !finalizada && indice === 0;
    var proxima = document.getElementById('gramatica-proxima');
    proxima.hidden = finalizada;
    proxima.disabled = !estado.corrigidas[item.id];
    proxima.textContent = indice === total - 1 ? 'Concluir revisão →' : 'Próxima →';
  }

  function anunciar(item, mensagem, sucesso) {
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className =
      'retorno retorno-mariana retorno-gramatica ' + (sucesso ? 'sucesso' : 'tente-novamente');
    retorno.textContent = mensagem || item.dica;
  }

  function invalidarCorrecao(item) {
    if (estado.corrigidas[item.id]) delete estado.corrigidas[item.id];
    conteudo.querySelectorAll('.campo-correto, .campo-incorreto').forEach(function (elemento) {
      elemento.classList.remove('campo-correto', 'campo-incorreto');
    });
    conteudo.querySelectorAll('.correta, .incorreta').forEach(function (elemento) {
      elemento.classList.remove('correta', 'incorreta');
    });
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className = 'retorno retorno-mariana retorno-gramatica';
    retorno.textContent = '';
    salvar();
    atualizarNavegacao();
  }

  function configurarInteracoes(item) {
    if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input) {
        input.addEventListener('input', function () {
          var respostas = respostasDaQuestao(item);
          respostas[Number(input.dataset.respostaGramatica)] = input.value;
          estado.respostas[item.id] = respostas;
          invalidarCorrecao(item);
        });
      });
    } else {
      conteudo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
        botao.addEventListener('click', function () {
          var grupo = botao.closest('[data-item-gramatica]');
          var indice = Number(grupo.dataset.itemGramatica);
          var respostas = respostasDaQuestao(item);
          respostas[indice] = botao.dataset.opcaoGramatica;
          estado.respostas[item.id] = respostas;
          grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (outra) {
            var selecionada = outra === botao;
            outra.classList.toggle('selecionada', selecionada);
            outra.setAttribute('aria-pressed', String(selecionada));
          });
          invalidarCorrecao(item);
        });
      });
    }
    window.GramaticaDitado.configurar(conteudo, item);
    conteudo.querySelector('[data-conferir-gramatica]').addEventListener('click', function () {
      conferir(item);
    });
  }

  function marcarResultado(item, acertos) {
    if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input, indice) {
        input.classList.toggle('campo-correto', acertos[indice]);
        input.classList.toggle('campo-incorreto', !acertos[indice]);
      });
    } else {
      conteudo.querySelectorAll('[data-item-gramatica]').forEach(function (grupo, indice) {
        grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
          var selecionada = botao.getAttribute('aria-pressed') === 'true';
          botao.classList.toggle('correta', selecionada && acertos[indice]);
          botao.classList.toggle('incorreta', selecionada && !acertos[indice]);
        });
      });
    }
  }

  function conferir(item) {
    var respostas = respostasDaQuestao(item);
    var acertos = item.itens.map(function (subitem, indice) {
      return respostaCorreta(respostas[indice], subitem);
    });
    var completos = item.itens.map(function (subitem, indice) {
      return normalizarResposta(respostas[indice], subitem.acentuacaoObrigatoria) !== '';
    });
    marcarResultado(item, acertos);
    if (
      completos.some(function (completo) {
        return !completo;
      })
    ) {
      anunciar(item, 'Complete todos os itens antes de conferir novamente.', false);
      return;
    }
    if (acertos.every(Boolean)) {
      estado.corrigidas[item.id] = true;
      estado.pontuadas[item.id] = true;
      salvar();
      anunciar(item, '✓ ' + item.sucesso, true);
      atualizarNavegacao();
      return;
    }
    delete estado.corrigidas[item.id];
    salvar();
    anunciar(item, '↻ Revise os itens destacados. ' + item.dica, false);
    atualizarNavegacao();
  }

  function renderizarQuestao() {
    var item = revisaoAtiva.questoes[estado.questaoAtual];
    var respostas = respostasDaQuestao(item);
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">' +
      escapar(item.bloco) +
      '</p><h1 id="gramatica-titulo-questao">' +
      escapar(item.titulo) +
      '</h1><p class="explicacao-mariana">' +
      escapar(item.instrucao) +
      '</p></div><img class="icone-etapa" src="../assets/objetos_escolares/pencil.svg" alt=""></div>' +
      '<div class="atividade-mariana">' +
      (item.ditado ? window.GramaticaDitado.painelHtml() : '') +
      (item.tipo === 'campos' ? montarCampos(item, respostas) : montarOpcoes(item, respostas)) +
      '<div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-gramatica>Conferir</button>' +
      '<div class="retorno retorno-mariana retorno-gramatica" role="status" aria-live="polite"></div></div></div></article>';
    configurarInteracoes(item);
    if (estado.corrigidas[item.id]) {
      marcarResultado(
        item,
        item.itens.map(function () {
          return true;
        })
      );
      anunciar(item, '✓ ' + item.sucesso, true);
    }
  }

  function renderizarFinal() {
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Revisão concluída</p><h1 id="gramatica-titulo-questao">Parabéns, ' +
      escapar(revisaoAtiva.nome) +
      '!</h1><p class="explicacao-mariana">' +
      escapar(revisaoAtiva.resumoFinal) +
      '</p></div><img class="icone-etapa" src="../assets/objetos_escolares/book.svg" alt=""></div>' +
      '<div class="atividade-mariana"><p class="retorno sucesso" role="status">✓ Seu progresso ficou salvo neste computador.</p>' +
      '<button class="botao-principal botao-grande" type="button" data-ir-inicio>Voltar ao início</button></div></article>';
    conteudo.querySelector('[data-ir-inicio]').addEventListener('click', function () {
      document.getElementById('botao-inicio').click();
    });
  }

  function renderizar() {
    window.GramaticaDitado.parar();
    if (estado.finalizada) renderizarFinal();
    else renderizarQuestao();
    atualizarNavegacao();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function irPara(indice) {
    estado.finalizada = false;
    estado.questaoAtual = Math.max(0, Math.min(revisaoAtiva.questoes.length - 1, indice));
    salvar();
    renderizar();
  }

  function abrir(id) {
    var revisao = revisoes[id];
    if (!revisao) throw new Error('Revisão de Gramática não cadastrada: ' + id);
    revisaoAtiva = revisao;
    conteudo = document.getElementById('gramatica-conteudo');
    estado = obterArmazenamento(revisao).carregar();
    document.getElementById('gramatica-nome-perfil').textContent = revisao.nome;
    document.getElementById('gramatica-voltar').onclick = function () {
      if (estado.finalizada) irPara(revisao.questoes.length - 1);
      else irPara(estado.questaoAtual - 1);
    };
    document.getElementById('gramatica-proxima').onclick = function () {
      var item = revisao.questoes[estado.questaoAtual];
      if (!estado.corrigidas[item.id]) return;
      if (estado.questaoAtual === revisao.questoes.length - 1) {
        estado.finalizada = true;
        salvar();
        renderizar();
      } else {
        irPara(estado.questaoAtual + 1);
      }
    };
    renderizar();
    if (controladorApp) controladorApp.mostrarTela('gramaticaMariana');
  }

  function limpar(id, pedirConfirmacao) {
    var revisao = revisoes[id];
    if (!revisao) return false;
    if (
      pedirConfirmacao &&
      !window.confirm(
        'Limpar apenas o progresso desta revisão de Gramática de ' + revisao.nome + '?'
      )
    ) {
      return false;
    }
    obterArmazenamento(revisao).remover();
    if (revisaoAtiva && revisaoAtiva.id === id) {
      estado = estadoInicial();
      if (conteudo) renderizar();
    }
    emitirProgresso(revisao);
    return true;
  }

  function obterEstado(id) {
    var revisao = revisoes[id];
    if (!revisao) return null;
    if (revisaoAtiva && revisaoAtiva.id === id && estado) return estado;
    return obterArmazenamento(revisao).carregar();
  }

  function obterSituacao(id) {
    var atual = obterEstado(id);
    if (!atual) return 'nao-iniciada';
    if (atual.finalizada) return 'concluida';
    if (
      atual.questaoAtual > 0 ||
      Object.keys(atual.respostas).length > 0 ||
      Object.keys(atual.corrigidas).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function inicializar(controlador) {
    controladorApp = controlador;
  }

  window.GramaticaQuestionarios = {
    registrar: registrar,
    inicializar: inicializar,
    abrir: abrir,
    limpar: limpar,
    obterEstado: obterEstado,
    obterSituacao: obterSituacao,
    obterAtiva: function () {
      return revisaoAtiva;
    },
    desativar: function () {
      revisaoAtiva = null;
      estado = null;
    },
    obterRevisao: function (id) {
      return revisoes[id] || null;
    },
  };
})();
