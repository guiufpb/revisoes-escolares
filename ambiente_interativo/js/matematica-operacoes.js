(function () {
  'use strict';

  var revisoes = Object.create(null);
  var armazenamentos = Object.create(null);
  var controladorApp = null;
  var revisaoAtiva = null;
  var estado = null;
  var conteudo = null;

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function textoSeguro(valor, limite) {
    return String(valor == null ? '' : valor)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limite || 500);
  }

  function escapar(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function registrar(configuracao) {
    configuracao = objeto(configuracao);
    if (
      !configuracao.id ||
      !configuracao.perfil ||
      !configuracao.chaveArmazenamento ||
      !Array.isArray(configuracao.questoes) ||
      !configuracao.questoes.length
    ) {
      throw new Error('A revisão de operações precisa de id, perfil, chave e questões.');
    }
    if (revisoes[configuracao.id]) {
      throw new Error('Revisão de operações duplicada: ' + configuracao.id + '.');
    }
    var ids = Object.create(null);
    configuracao.questoes.forEach(function (questao) {
      if (!questao.id || ids[questao.id]) {
        throw new Error('As questões de ' + configuracao.id + ' precisam de IDs únicos.');
      }
      if (Array.isArray(questao.itens) && questao.itens.length) {
        var idsItens = Object.create(null);
        questao.itens.forEach(function (item) {
          if (!item.id || idsItens[item.id]) {
            throw new Error('Os itens de ' + questao.id + ' precisam de IDs únicos.');
          }
          if (!Number.isInteger(item.resposta) || item.resposta < 0) {
            throw new Error(
              'A resposta de ' + item.id + ' precisa ser um número inteiro positivo.'
            );
          }
          idsItens[item.id] = true;
        });
      } else if (!Number.isInteger(questao.resposta) || questao.resposta < 0) {
        throw new Error('A resposta de ' + questao.id + ' precisa ser um número inteiro positivo.');
      }
      ids[questao.id] = true;
    });
    if (configuracao.estudoTabuada) {
      var indiceEstudo = configuracao.questoes.findIndex(function (questao) {
        return questao.id === configuracao.estudoTabuada.aposQuestaoId;
      });
      if (indiceEstudo < 0 || indiceEstudo >= configuracao.questoes.length - 1) {
        throw new Error(
          'A etapa de estudo de ' + configuracao.id + ' precisa ficar entre questões.'
        );
      }
      if (configuracao.estudoTabuada.fatores != null) {
        if (
          !Array.isArray(configuracao.estudoTabuada.fatores) ||
          !configuracao.estudoTabuada.fatores.length
        ) {
          throw new Error('A etapa de estudo de ' + configuracao.id + ' precisa indicar fatores.');
        }
        var fatoresUnicos = Object.create(null);
        configuracao.estudoTabuada.fatores.forEach(function (fator) {
          if (!Number.isInteger(fator) || fator < 1 || fator > 10 || fatoresUnicos[fator]) {
            throw new Error(
              'Os fatores da etapa de estudo de ' +
                configuracao.id +
                ' precisam ser números únicos de 1 a 10.'
            );
          }
          fatoresUnicos[fator] = true;
        });
      }
    }
    revisoes[configuracao.id] = configuracao;
  }

  function estadoInicial() {
    return {
      questaoAtual: 0,
      respostas: {},
      corrigidas: {},
      pontuadas: {},
      pontos: 0,
      estudoAberto: false,
      estudoConcluido: false,
      finalizada: false,
    };
  }

  function indiceEstudoDaRevisao(revisao) {
    if (!revisao.estudoTabuada) return -1;
    return revisao.questoes.findIndex(function (questao) {
      return questao.id === revisao.estudoTabuada.aposQuestaoId;
    });
  }

  function normalizadorDaRevisao(revisao) {
    return function (valor, base) {
      valor = objeto(valor);
      var total = revisao.questoes.length;
      var respostasRecebidas = objeto(valor.respostas);
      var corrigidasRecebidas = objeto(valor.corrigidas);
      var pontuadasRecebidas = objeto(valor.pontuadas);
      base.questaoAtual = Math.max(
        0,
        Math.min(total - 1, Math.trunc(Number(valor.questaoAtual) || 0))
      );
      base.respostas = {};
      base.corrigidas = {};
      base.pontuadas = {};
      revisao.questoes.forEach(function (questao) {
        if (Array.isArray(questao.itens) && questao.itens.length) {
          var respostasDosItens = objeto(respostasRecebidas[questao.id]);
          base.respostas[questao.id] = {};
          questao.itens.forEach(function (item) {
            if (respostasDosItens[item.id] != null) {
              base.respostas[questao.id][item.id] = textoSeguro(respostasDosItens[item.id], 12);
            }
          });
          if (!Object.keys(base.respostas[questao.id]).length) delete base.respostas[questao.id];
        } else if (respostasRecebidas[questao.id] != null) {
          base.respostas[questao.id] = textoSeguro(respostasRecebidas[questao.id], 12);
        }
        if (corrigidasRecebidas[questao.id]) base.corrigidas[questao.id] = true;
        if (pontuadasRecebidas[questao.id]) base.pontuadas[questao.id] = true;
      });
      base.pontos = Object.keys(base.pontuadas).length;
      var indiceEstudo = indiceEstudoDaRevisao(revisao);
      base.estudoConcluido = indiceEstudo >= 0 && Boolean(valor.estudoConcluido);
      base.estudoAberto =
        indiceEstudo >= 0 &&
        !base.estudoConcluido &&
        Boolean(valor.estudoAberto) &&
        base.questaoAtual === indiceEstudo &&
        Boolean(base.corrigidas[revisao.questoes[indiceEstudo].id]);
      base.finalizada = Boolean(valor.finalizada) && Object.keys(base.corrigidas).length === total;
      return base;
    };
  }

  function obterArmazenamento(revisao) {
    if (!armazenamentos[revisao.id]) {
      armazenamentos[revisao.id] = window.ArmazenamentoRevisoes.criar({
        chave: revisao.chaveArmazenamento,
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

  function nomePerfil(perfil) {
    return perfil === 'alice' ? 'Alice' : 'Mariana';
  }

  function respostaCorreta(valor, esperada) {
    var resposta = textoSeguro(valor, 12);
    return /^\d+$/.test(resposta) && Number(resposta) === esperada;
  }

  function atualizarCabecalho() {
    var total = revisaoAtiva.questoes.length;
    var indice = estado.questaoAtual;
    var nome = nomePerfil(revisaoAtiva.perfil);
    var estudando = estado.estudoAberto && !estado.estudoConcluido;
    document.getElementById('operacoes-nome-perfil').textContent = nome;
    document.getElementById('operacoes-titulo-revisao').textContent = revisaoAtiva.titulo;
    document.getElementById('operacoes-contador').textContent = estado.finalizada
      ? total + ' questões concluídas'
      : estudando
        ? 'Estudo: tabuada de ' + listarFatores(fatoresDaTabuada())
        : 'Questão ' + (indice + 1) + ' de ' + total;
    document.getElementById('operacoes-pontos').textContent = estado.pontos + ' de ' + total;
    document.getElementById('operacoes-barra').style.width =
      ((estado.finalizada ? total : indice + 1) / total) * 100 + '%';
    var progresso = document.getElementById('operacoes-progresso');
    progresso.setAttribute('aria-label', 'Progresso de Matemática de ' + nome);
    progresso.setAttribute('aria-valuemax', String(total));
    progresso.setAttribute('aria-valuenow', String(estado.finalizada ? total : indice + 1));

    var voltar = document.getElementById('operacoes-voltar');
    voltar.disabled = !estado.finalizada && indice === 0;
    var proxima = document.getElementById('operacoes-proxima');
    proxima.hidden = estado.finalizada || estudando;
    proxima.disabled = estudando || !estado.corrigidas[revisaoAtiva.questoes[indice].id];
    proxima.textContent = indice === total - 1 ? 'Concluir atividade →' : 'Próxima →';
  }

  function lembreteDaQuestao(questao) {
    if (!questao.lembrete) return '';
    return (
      '<div class="lembrete-centenas" aria-label="Uma centena equivale a dez dezenas ou cem unidades">' +
      '<span><strong>1</strong> centena</span><span aria-hidden="true">=</span>' +
      '<span><strong>10</strong> dezenas</span><span aria-hidden="true">=</span>' +
      '<span><strong>100</strong> unidades</span></div>'
    );
  }

  function anunciar(questao, mensagem, sucesso) {
    var retorno = conteudo.querySelector('.retorno-operacoes');
    retorno.className =
      'retorno retorno-mariana retorno-operacoes ' + (sucesso ? 'sucesso' : 'tente-novamente');
    retorno.textContent = mensagem || questao.dica;
  }

  function invalidarCorrecao(questao, input) {
    if (estado.corrigidas[questao.id]) delete estado.corrigidas[questao.id];
    input.classList.remove('campo-correto', 'campo-incorreto');
    input.removeAttribute('aria-invalid');
    var retorno = conteudo.querySelector('.retorno-operacoes');
    retorno.className = 'retorno retorno-mariana retorno-operacoes';
    retorno.textContent = '';
    salvar();
    atualizarCabecalho();
  }

  function conferir(questao, input) {
    var resposta = textoSeguro(input.value, 12);
    estado.respostas[questao.id] = resposta;
    input.classList.remove('campo-correto', 'campo-incorreto');

    if (!resposta) {
      delete estado.corrigidas[questao.id];
      salvar();
      input.classList.add('campo-incorreto');
      input.setAttribute('aria-invalid', 'true');
      anunciar(questao, 'Digite sua resposta antes de conferir.', false);
      atualizarCabecalho();
      return;
    }

    if (respostaCorreta(resposta, questao.resposta)) {
      estado.corrigidas[questao.id] = true;
      estado.pontuadas[questao.id] = true;
      salvar();
      input.classList.add('campo-correto');
      input.removeAttribute('aria-invalid');
      anunciar(questao, '✓ ' + questao.sucesso, true);
      atualizarCabecalho();
      return;
    }

    delete estado.corrigidas[questao.id];
    salvar();
    input.classList.add('campo-incorreto');
    input.setAttribute('aria-invalid', 'true');
    anunciar(questao, '↻ Tente outra vez. ' + questao.dica, false);
    atualizarCabecalho();
  }

  function respostasDaQuestaoMultipla(questao) {
    var recebidas = objeto(estado.respostas[questao.id]);
    return questao.itens.reduce(function (respostas, item) {
      respostas[item.id] = textoSeguro(recebidas[item.id], 12);
      return respostas;
    }, {});
  }

  function invalidarCorrecaoMultipla(questao, input) {
    if (estado.corrigidas[questao.id]) delete estado.corrigidas[questao.id];
    input.classList.remove('campo-correto', 'campo-incorreto');
    input.removeAttribute('aria-invalid');
    var retorno = conteudo.querySelector('.retorno-operacoes');
    retorno.className = 'retorno retorno-mariana retorno-operacoes';
    retorno.textContent = '';
    salvar();
    atualizarCabecalho();
  }

  function conferirMultipla(questao) {
    var respostas = {};
    var faltando = 0;
    var incorretas = 0;
    questao.itens.forEach(function (item) {
      var input = conteudo.querySelector('[data-item-multiplicacao="' + item.id + '"]');
      var resposta = textoSeguro(input.value, 12);
      respostas[item.id] = resposta;
      input.classList.remove('campo-correto', 'campo-incorreto');
      if (!resposta) {
        faltando += 1;
        input.classList.add('campo-incorreto');
        input.setAttribute('aria-invalid', 'true');
      } else if (respostaCorreta(resposta, item.resposta)) {
        input.classList.add('campo-correto');
        input.removeAttribute('aria-invalid');
      } else {
        incorretas += 1;
        input.classList.add('campo-incorreto');
        input.setAttribute('aria-invalid', 'true');
      }
    });
    estado.respostas[questao.id] = respostas;

    if (!faltando && !incorretas) {
      estado.corrigidas[questao.id] = true;
      estado.pontuadas[questao.id] = true;
      salvar();
      anunciar(questao, '✓ ' + questao.sucesso, true);
      atualizarCabecalho();
      return;
    }

    delete estado.corrigidas[questao.id];
    salvar();
    anunciar(
      questao,
      faltando
        ? 'Complete todas as multiplicações destacadas antes de conferir.'
        : '↻ Tente outra vez. ' + questao.dica,
      false
    );
    atualizarCabecalho();
  }

  function renderizarQuestaoMultipla(questao) {
    var respostas = respostasDaQuestaoMultipla(questao);
    var itens = questao.itens
      .map(function (item) {
        var inputId = 'resposta-operacoes-' + questao.id + '-' + item.id;
        return (
          '<label class="item-multiplicacao" for="' +
          inputId +
          '"><span>' +
          escapar(item.operacao) +
          '</span><input id="' +
          inputId +
          '" data-item-multiplicacao="' +
          escapar(item.id) +
          '" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" value="' +
          escapar(respostas[item.id]) +
          '" autocomplete="off"></label>'
        );
      })
      .join('');

    conteudo.innerHTML =
      '<article class="etapa-mariana etapa-operacoes"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">' +
      escapar(questao.bloco) +
      '</p><h1 id="operacoes-titulo-questao">' +
      escapar(questao.titulo) +
      '</h1><p class="explicacao-mariana">Resolva cada multiplicação sem consultar a tabela.</p>' +
      '</div><img class="icone-etapa" src="../assets/objetos_escolares/calculator.svg" alt=""></div>' +
      '<div class="atividade-mariana atividade-operacoes"><p class="problema-operacoes">' +
      escapar(questao.enunciado) +
      '</p><fieldset class="lista-multiplicacoes"><legend>Escreva todos os resultados</legend>' +
      itens +
      '</fieldset><div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-operacoes>Conferir todas</button>' +
      '<div class="retorno retorno-mariana retorno-operacoes" role="status" aria-live="polite"></div></div></div></article>';

    conteudo.querySelectorAll('[data-item-multiplicacao]').forEach(function (input) {
      input.addEventListener('input', function () {
        var atuais = objeto(estado.respostas[questao.id]);
        atuais[input.dataset.itemMultiplicacao] = input.value;
        estado.respostas[questao.id] = atuais;
        invalidarCorrecaoMultipla(questao, input);
      });
      input.addEventListener('keydown', function (evento) {
        if (evento.key !== 'Enter') return;
        evento.preventDefault();
        conferirMultipla(questao);
      });
    });
    conteudo.querySelector('[data-conferir-operacoes]').addEventListener('click', function () {
      conferirMultipla(questao);
    });

    if (estado.corrigidas[questao.id]) {
      conteudo.querySelectorAll('[data-item-multiplicacao]').forEach(function (input) {
        input.classList.add('campo-correto');
      });
      anunciar(questao, '✓ ' + questao.sucesso, true);
    }
  }

  function renderizarQuestao() {
    var questao = revisaoAtiva.questoes[estado.questaoAtual];
    if (Array.isArray(questao.itens) && questao.itens.length) {
      renderizarQuestaoMultipla(questao);
      return;
    }
    var resposta = estado.respostas[questao.id] || '';
    var inputId = 'resposta-operacoes-' + questao.id;
    conteudo.innerHTML =
      '<article class="etapa-mariana etapa-operacoes"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">' +
      escapar(questao.bloco) +
      '</p><h1 id="operacoes-titulo-questao">' +
      escapar(questao.titulo) +
      '</h1><p class="explicacao-mariana">Leia com calma, faça a conta e escreva o resultado.</p>' +
      '</div><img class="icone-etapa" src="../assets/objetos_escolares/calculator.svg" alt=""></div>' +
      '<div class="atividade-mariana atividade-operacoes">' +
      lembreteDaQuestao(questao) +
      '<p class="problema-operacoes">' +
      escapar(questao.enunciado) +
      '</p><div class="conta-operacoes" aria-label="Conta: ' +
      escapar(questao.operacao) +
      '">' +
      escapar(questao.operacao) +
      '</div><label class="campo-mariana campo-resposta-operacoes" for="' +
      inputId +
      '"><span>Escreva o resultado:</span><input id="' +
      inputId +
      '" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" value="' +
      escapar(resposta) +
      '" autocomplete="off"></label>' +
      '<div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-operacoes>Conferir</button>' +
      '<div class="retorno retorno-mariana retorno-operacoes" role="status" aria-live="polite"></div></div></div></article>';

    var input = conteudo.querySelector('#' + inputId);
    input.addEventListener('input', function () {
      estado.respostas[questao.id] = input.value;
      invalidarCorrecao(questao, input);
    });
    input.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Enter') return;
      evento.preventDefault();
      conferir(questao, input);
    });
    conteudo.querySelector('[data-conferir-operacoes]').addEventListener('click', function () {
      conferir(questao, input);
    });

    if (estado.corrigidas[questao.id]) {
      input.classList.add('campo-correto');
      anunciar(questao, '✓ ' + questao.sucesso, true);
    }
  }

  function tabelaDaTabuada(numero) {
    var linhas = '';
    for (var fator = 1; fator <= 10; fator += 1) {
      linhas +=
        '<tr><th scope="row">' +
        numero +
        ' × ' +
        fator +
        '</th><td>' +
        numero * fator +
        '</td></tr>';
    }
    return (
      '<table class="tabela-tabuada"><caption>Tabuada do ' +
      numero +
      '</caption><thead><tr><th scope="col">Conta</th><th scope="col">Resultado</th></tr></thead><tbody>' +
      linhas +
      '</tbody></table>'
    );
  }

  function fatoresDaTabuada() {
    var configurados = revisaoAtiva.estudoTabuada && revisaoAtiva.estudoTabuada.fatores;
    return Array.isArray(configurados) && configurados.length ? configurados : [1, 2];
  }

  function listarFatores(fatores) {
    if (fatores.length === 1) return String(fatores[0]);
    return fatores.slice(0, -1).join(', ') + ' e ' + fatores[fatores.length - 1];
  }

  function renderizarEstudoTabuada() {
    var fatores = fatoresDaTabuada();
    var tabelas = fatores.map(tabelaDaTabuada).join('');
    conteudo.innerHTML =
      '<article class="etapa-mariana etapa-operacoes estudo-tabuada"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Momento de estudo</p><h1 id="operacoes-titulo-questao">Tabuada de ' +
      escapar(listarFatores(fatores)) +
      '</h1>' +
      '<p class="explicacao-mariana">Observe, leia e procure os padrões antes de começar.</p></div>' +
      '<img class="icone-etapa" src="../assets/objetos_escolares/calculator.svg" alt=""></div>' +
      '<div class="atividade-mariana atividade-operacoes"><p class="aviso-bloqueio-tabuada"><strong>Atenção:</strong> depois de começar as questões de multiplicação, esta tabela não poderá ser aberta novamente nesta rodada.</p>' +
      '<div class="grade-tabuadas">' +
      tabelas +
      '</div><div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-comecar-multiplicacoes>Já estudei — começar as multiplicações →</button>' +
      '<div class="retorno retorno-mariana retorno-operacoes" role="status" aria-live="polite">Use o tempo que precisar antes de continuar.</div></div></div></article>';
    conteudo.querySelector('[data-comecar-multiplicacoes]').addEventListener('click', function () {
      estado.estudoAberto = false;
      estado.estudoConcluido = true;
      estado.questaoAtual = Math.min(
        revisaoAtiva.questoes.length - 1,
        indiceEstudoDaRevisao(revisaoAtiva) + 1
      );
      salvar();
      renderizar();
    });
  }

  function renderizarFinal() {
    var nome = nomePerfil(revisaoAtiva.perfil);
    var total = revisaoAtiva.questoes.length;
    conteudo.innerHTML =
      '<article class="etapa-mariana etapa-operacoes"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Atividade concluída</p><h1 id="operacoes-titulo-questao">Parabéns, ' +
      nome +
      '!</h1><p class="explicacao-mariana">Você concluiu ' +
      total +
      ' desafios de Matemática.</p></div>' +
      '<img class="icone-etapa" src="../assets/objetos_escolares/calculator.svg" alt=""></div>' +
      '<div class="atividade-mariana"><p class="retorno sucesso" role="status">✓ As respostas ficaram salvas neste computador.</p>' +
      '<button class="botao-principal botao-grande" type="button" data-ir-trilha-operacoes>Voltar para Matemática</button></div></article>';
    conteudo.querySelector('[data-ir-trilha-operacoes]').addEventListener('click', function () {
      document.querySelector('#tela-matematica-operacoes [data-voltar-trilha-matematica]').click();
    });
  }

  function renderizar() {
    if (estado.finalizada) renderizarFinal();
    else if (estado.estudoAberto && !estado.estudoConcluido) renderizarEstudoTabuada();
    else renderizarQuestao();
    atualizarCabecalho();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function irPara(indice) {
    estado.finalizada = false;
    estado.estudoAberto = false;
    estado.questaoAtual = Math.max(0, Math.min(revisaoAtiva.questoes.length - 1, indice));
    salvar();
    renderizar();
  }

  function abrir(id) {
    var revisao = revisoes[id];
    if (!revisao) throw new Error('Revisão de operações não encontrada: ' + id + '.');
    revisaoAtiva = revisao;
    estado = obterArmazenamento(revisao).carregar();
    conteudo = document.getElementById('operacoes-conteudo');
    document.getElementById('operacoes-voltar').onclick = function () {
      if (estado.estudoAberto && !estado.estudoConcluido) {
        estado.estudoAberto = false;
        salvar();
        renderizar();
      } else if (estado.finalizada) irPara(revisaoAtiva.questoes.length - 1);
      else irPara(estado.questaoAtual - 1);
    };
    document.getElementById('operacoes-proxima').onclick = function () {
      var questao = revisaoAtiva.questoes[estado.questaoAtual];
      if (!estado.corrigidas[questao.id]) return;
      if (!estado.estudoConcluido && indiceEstudoDaRevisao(revisaoAtiva) === estado.questaoAtual) {
        estado.estudoAberto = true;
        salvar();
        renderizar();
        return;
      }
      if (estado.questaoAtual === revisaoAtiva.questoes.length - 1) {
        estado.finalizada = true;
        salvar();
        renderizar();
      } else {
        irPara(estado.questaoAtual + 1);
      }
    };
    renderizar();
    controladorApp.mostrarTela('matematicaOperacoes');
  }

  function limpar(id, pedirConfirmacao) {
    var revisao = revisoes[id];
    if (!revisao) return false;
    if (
      pedirConfirmacao &&
      !window.confirm(
        'Limpar apenas o progresso desta atividade de Matemática de ' +
          nomePerfil(revisao.perfil) +
          '?'
      )
    ) {
      return false;
    }
    obterArmazenamento(revisao).remover();
    if (revisaoAtiva && revisaoAtiva.id === id) {
      estado = estadoInicial();
      renderizar();
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
      atual.estudoAberto ||
      atual.estudoConcluido ||
      Object.keys(atual.respostas).length > 0 ||
      Object.keys(atual.corrigidas).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  window.MatematicaOperacoes = {
    inicializar: function (controlador) {
      controladorApp = controlador;
    },
    registrar: registrar,
    abrir: abrir,
    limpar: limpar,
    obterEstado: obterEstado,
    obterSituacao: obterSituacao,
    obterAtiva: function () {
      return revisaoAtiva;
    },
    obterRevisao: function (id) {
      return revisoes[id] || null;
    },
    listar: function () {
      return Object.keys(revisoes).map(function (id) {
        return revisoes[id];
      });
    },
  };
})();
