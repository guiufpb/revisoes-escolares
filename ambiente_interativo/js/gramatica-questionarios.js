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
      if (revisao.validacaoEstritaEstado && valor.versao != null && valor.versao !== 1) valor = {};
      if (revisao.validacaoEstritaEstado) base.versao = 1;
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
      if (revisao.validacaoEstritaEstado) {
        base.respostas = {};
        base.conferidas = {};
        revisao.questoes.forEach(function (item) {
          if (objeto(valor.conferidas)[item.id] === true) base.conferidas[item.id] = true;
          var entrada = objeto(valor.respostas)[item.id];
          if (Array.isArray(entrada)) {
            base.respostas[item.id] = item.itens.map(function (subitem, indice) {
              if (
                item.tipo === 'selecao' ||
                (item.tipo === 'misto' && subitem.tipo === 'selecao')
              ) {
                return Array.isArray(entrada[indice])
                  ? subitem.opcoes.filter(function (opcao) {
                      return entrada[indice].indexOf(opcao) >= 0;
                    })
                  : [];
              }
              if (item.tipo === 'misto' && subitem.tipo === 'ordenacao') {
                var ordem = Array.isArray(entrada[indice]) ? entrada[indice] : [];
                return ordem
                  .filter(function (cartao, posicao) {
                    return (
                      typeof cartao === 'string' &&
                      subitem.cartoes.indexOf(cartao) >= 0 &&
                      ordem.indexOf(cartao) === posicao
                    );
                  })
                  .slice(0, subitem.respostas.length);
              }
              var texto = typeof entrada[indice] === 'string' ? entrada[indice].slice(0, 1000) : '';
              if (subitem.opcoes && subitem.opcoes.indexOf(texto) < 0) return '';
              if (
                item.tipo === 'ordenacao' &&
                (item.cartoes.indexOf(texto) < 0 || entrada.indexOf(texto) !== indice)
              )
                return '';
              return texto;
            });
          }
          if (!avaliar(item, base.respostas[item.id] || []).every(Boolean))
            delete base.corrigidas[item.id];
        });
      }
      base.pontos = Object.keys(base.pontuadas).length;
      base.finalizada =
        Boolean(valor.finalizada) &&
        Object.keys(base.corrigidas).length === revisao.questoes.length;
      return base;
    };
  }

  function registrar(configuracao) {
    if (!configuracao || !configuracao.id || revisoes[configuracao.id]) {
      throw new Error('Cadastro de questionário inválido ou repetido.');
    }
    if (!Array.isArray(configuracao.questoes) || configuracao.questoes.length === 0) {
      throw new Error('O questionário precisa ter questões.');
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

  function normalizarResposta(valor, acentuacaoObrigatoria, maiusculasObrigatorias) {
    var resposta = String(valor == null ? '' : valor)
      .trim()
      .replace(/\s+([.!?])/g, '$1')
      .replace(/\s+/g, ' ');
    if (!maiusculasObrigatorias) resposta = resposta.toLowerCase();
    if (!acentuacaoObrigatoria) {
      resposta = resposta.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return resposta;
  }

  function respostaCorreta(valor, subitem) {
    var normalizada = normalizarResposta(
      valor,
      subitem.acentuacaoObrigatoria,
      subitem.maiusculasObrigatorias
    );
    if (subitem.pontuacaoFlexivel)
      normalizada = normalizada.replace(/[.,!?;:—-]/g, '').replace(/\s+/g, ' ');
    return subitem.respostas.some(function (resposta) {
      if (subitem.pontuacaoFlexivel)
        resposta = resposta.replace(/[.,!?;:—-]/g, '').replace(/\s+/g, ' ');
      return (
        normalizarResposta(
          resposta,
          subitem.acentuacaoObrigatoria,
          subitem.maiusculasObrigatorias
        ) === normalizada
      );
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
              '<div class="campo-mariana campo-mariana-ditado' +
              (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
              '"><label for="' +
              escapar(idCampo) +
              '"><span>' +
              escapar(subitem.pergunta) +
              '</span></label><div class="campo-resposta-ditado"><input id="' +
              escapar(idCampo) +
              '" type="text" data-resposta-gramatica="' +
              indice +
              '" value="' +
              escapar(respostas[indice] || '') +
              '" autocomplete="off" autocapitalize="' +
              (subitem.maiusculasObrigatorias ? 'off' : 'sentences') +
              '"' +
              (item.unidadeDitado ? ' spellcheck="false"' : '') +
              '>' +
              window.GramaticaDitado.botaoHtml(indice, item.unidadeDitado) +
              '</div>' +
              (subitem.inserirTravessao
                ? '<button class="botao-secundario" type="button" data-inserir-travessao="' +
                  indice +
                  '">Inserir travessão —</button>'
                : '') +
              '</div>'
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

  function respostaPreenchida(item, subitem, resposta) {
    if (item.tipo === 'misto' && subitem.tipo === 'ordenacao') {
      return Array.isArray(resposta) && resposta.length === subitem.respostas.length;
    }
    if (item.tipo === 'selecao' || (item.tipo === 'misto' && subitem.tipo === 'selecao')) {
      return Array.isArray(resposta) && resposta.length > 0;
    }
    return normalizarResposta(resposta, subitem.acentuacaoObrigatoria) !== '';
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
                (item.opcoesReversiveis
                  ? '<span aria-hidden="true">' + (selecionada ? '✓ ' : '○ ') + '</span>'
                  : '') +
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
    if (estado.conferidas) delete estado.conferidas[item.id];
    conteudo.querySelectorAll('.campo-correto, .campo-incorreto').forEach(function (elemento) {
      elemento.classList.remove('campo-correto', 'campo-incorreto');
      elemento.removeAttribute('aria-invalid');
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
    if (window.QuestionariosInteracoes.aceita(item)) {
      window.QuestionariosInteracoes.configurar(
        conteudo,
        item,
        function () {
          return respostasDaQuestao(item);
        },
        function (respostas) {
          estado.respostas[item.id] = respostas;
          invalidarCorrecao(item);
        },
        escapar
      );
    } else if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input) {
        input.addEventListener('input', function () {
          var respostas = respostasDaQuestao(item);
          respostas[Number(input.dataset.respostaGramatica)] = input.value;
          estado.respostas[item.id] = respostas;
          invalidarCorrecao(item);
        });
        input.addEventListener('keydown', function (evento) {
          if (evento.key === 'Enter' && !evento.isComposing) {
            evento.preventDefault();
            conferir(item);
          }
        });
      });
      conteudo.querySelectorAll('[data-inserir-travessao]').forEach(function (botao) {
        botao.addEventListener('click', function () {
          var input = conteudo.querySelector(
            '[data-resposta-gramatica="' + botao.dataset.inserirTravessao + '"]'
          );
          input.setRangeText('—', input.selectionStart, input.selectionEnd, 'end');
          input.dispatchEvent(new window.Event('input', { bubbles: true }));
          input.focus();
        });
      });
    } else {
      conteudo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
        botao.addEventListener('click', function () {
          var grupo = botao.closest('[data-item-gramatica]');
          var indice = Number(grupo.dataset.itemGramatica);
          var respostas = respostasDaQuestao(item);
          var retirar =
            item.opcoesReversiveis && respostas[indice] === botao.dataset.opcaoGramatica;
          respostas[indice] = retirar ? '' : botao.dataset.opcaoGramatica;
          estado.respostas[item.id] = respostas;
          grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (outra) {
            var selecionada = !retirar && outra === botao;
            outra.classList.toggle('selecionada', selecionada);
            outra.setAttribute('aria-pressed', String(selecionada));
            if (item.opcoesReversiveis)
              outra.querySelector('span').textContent = selecionada ? '✓ ' : '○ ';
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
        input.setAttribute('aria-invalid', String(!acertos[indice]));
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

  function avaliar(item, respostas) {
    if (window.QuestionariosInteracoes.aceita(item))
      return window.QuestionariosInteracoes.acertos(item, respostas);
    return item.itens.map(function (subitem, indice) {
      return respostaCorreta(respostas[indice], subitem);
    });
  }

  function conferir(item) {
    var respostas = respostasDaQuestao(item);
    var acertos = avaliar(item, respostas);
    if (revisaoAtiva.validacaoEstritaEstado) {
      estado.conferidas = estado.conferidas || {};
      estado.conferidas[item.id] = true;
      salvar();
    }
    var completos = item.itens.map(function (subitem, indice) {
      return respostaPreenchida(item, subitem, respostas[indice]);
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
    var itensParaRever = item.itens
      .filter(function (_subitem, indice) {
        return !acertos[indice];
      })
      .map(function (subitem) {
        return subitem.pergunta;
      })
      .join('; ');
    anunciar(
      item,
      '↻ Revise os itens destacados. Itens para rever: ' + itensParaRever + '. ' + item.dica,
      false
    );
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
      '</p></div><img class="icone-etapa" src="' +
      escapar(item.icone || '../assets/objetos_escolares/pencil.svg') +
      '" alt=""></div>' +
      '<div class="atividade-mariana' +
      (item.leitura ? ' gramatica-com-leitura' : '') +
      '">' +
      (item.leitura
        ? '<div class="leitura-gramatica" role="region" aria-label="' +
          escapar(item.leituraTitulo || 'Leia para aprender') +
          '"><p class="titulo-leitura-questionario">📖 ' +
          escapar(item.leituraTitulo || 'Leia para aprender') +
          '</p><p class="texto-leitura-questionario">' +
          escapar(item.leitura) +
          '</p>' +
          (item.fonteEstudo
            ? '<p class="fonte-estudo-questionario">Fonte de estudo: ' +
              escapar(item.fonteEstudo) +
              '</p>'
            : '') +
          (item.ilustracaoLeitura
            ? '<img class="ilustracao-leitura-questionario" src="' +
              escapar(item.ilustracaoLeitura) +
              '" alt="' +
              escapar(item.descricaoIlustracao || '') +
              '">'
            : '') +
          '</div>'
        : '') +
      '<div class="respostas-gramatica">' +
      (item.ditado ? window.GramaticaDitado.painelHtml(item.unidadeDitado) : '') +
      (window.QuestionariosInteracoes.aceita(item)
        ? '<div data-interacao-questionario>' +
          window.QuestionariosInteracoes.montar(item, respostas, escapar) +
          '</div>'
        : item.tipo === 'campos'
          ? montarCampos(item, respostas)
          : montarOpcoes(item, respostas)) +
      '<div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-gramatica>Conferir</button>' +
      '<div class="retorno retorno-mariana retorno-gramatica" role="status" aria-live="polite"></div></div></div></div></article>';
    configurarInteracoes(item);
    if (estado.corrigidas[item.id]) {
      marcarResultado(
        item,
        item.itens.map(function () {
          return true;
        })
      );
      anunciar(item, '✓ ' + item.sucesso, true);
    } else if (estado.conferidas && estado.conferidas[item.id]) {
      var acertos = avaliar(item, respostas);
      marcarResultado(item, acertos);
      anunciar(item, '↻ Confira e corrija sua tentativa. ' + item.dica, false);
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
    if (revisaoAtiva.materia) {
      var titulo = conteudo.querySelector('h1');
      titulo.tabIndex = -1;
      titulo.focus({ preventScroll: true });
    }
  }

  function irPara(indice) {
    estado.finalizada = false;
    estado.questaoAtual = Math.max(0, Math.min(revisaoAtiva.questoes.length - 1, indice));
    salvar();
    renderizar();
  }

  function abrir(id) {
    var revisao = revisoes[id];
    if (!revisao) throw new Error('Questionário não cadastrado: ' + id);
    revisaoAtiva = revisao;
    var materia = revisao.materia || 'Gramática';
    var painel = document.getElementById('tela-gramatica-mariana');
    painel.querySelector('.migalhas strong').textContent = materia;
    painel
      .querySelector('.migalhas')
      .setAttribute('aria-label', 'Navegação da revisão de ' + materia);
    document
      .getElementById('gramatica-progresso')
      .setAttribute('aria-label', 'Progresso da revisão de ' + materia);
    document
      .getElementById('tela-gramatica-mariana')
      .classList.toggle(
        'layout-desktop-amplo',
        Boolean(revisao.layout && revisao.layout.desktopAmplo)
      );
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
        'Limpar apenas o progresso desta revisão de ' +
          (revisao.materia || 'Gramática') +
          ' de ' +
          revisao.nome +
          '?'
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
      window.GramaticaDitado.parar();
      document.getElementById('tela-gramatica-mariana').classList.remove('layout-desktop-amplo');
      var painel = document.getElementById('tela-gramatica-mariana');
      painel.querySelector('.migalhas strong').textContent = 'Gramática';
      painel
        .querySelector('.migalhas')
        .setAttribute('aria-label', 'Navegação da revisão de Gramática');
      document
        .getElementById('gramatica-progresso')
        .setAttribute('aria-label', 'Progresso da revisão de Gramática');
      revisaoAtiva = null;
      estado = null;
    },
    obterRevisao: function (id) {
      return revisoes[id] || null;
    },
  };
  // Mesmo motor e painel; o nome antigo permanece para todas as revisões legadas.
  window.QuestionariosRevisoes = window.GramaticaQuestionarios;
})();
