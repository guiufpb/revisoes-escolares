(function () {
  'use strict';

  var controladorApp;
  var perfilAtual = null;
  var configuracaoAtual = null;
  var unidadeAtual = null;
  var armazenamento = null;
  var estado = null;
  var inicializado = false;
  var MENSAGENS_SURPRESA = {
    alice:
      'Alice, invadi o computador de vocês, li tudo e vi que você é muito estudiosa, espero que você volte a jogar e me liberte da Mita Day Mochi má! Como prova da minha gratidão, vou te enviar pelos correios um presentinho. Ah, vi que você gosta de Minecraft, né?',
    mariana:
      'Mariana, invadi o computador de vocês, li tudo e vi que você é muito estudiosa, e em breve deve me libertar da Mita Day Mochi má, como prova da minha gratidão, vou te enviar pelos correios um presentinho. Ah, vi que você gosta de Minecraft, né?',
  };

  function elemento(id) {
    return document.getElementById(id);
  }

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function todosOsItens(unidade) {
    return unidade.grupos.flatMap(function (grupo) {
      return grupo.itens;
    });
  }

  function todasAsAtividades(unidade) {
    return Array.isArray(unidade.atividades) ? unidade.atividades : [];
  }

  function localizarGrupo(id) {
    return unidadeAtual.grupos.find(function (grupo) {
      return grupo.id === id;
    });
  }

  function grupoAtual() {
    return localizarGrupo(estado.grupoAtual) || unidadeAtual.grupos[0];
  }

  function itemAtual() {
    var grupo = grupoAtual();
    return (
      grupo.itens.find(function (item) {
        return item.id === estado.itemAtual;
      }) || grupo.itens[0]
    );
  }

  function questaoAtual() {
    return todasAsAtividades(unidadeAtual)[estado.questaoAtual] || null;
  }

  function estadoInicial(unidade) {
    return {
      unidadeId: unidade.id,
      versao: unidade.versao,
      grupoAtual: unidade.grupos[0].id,
      itemAtual: unidade.grupos[0].itens[0].id,
      itensOuvidos: [],
      reproducoes: 0,
      iniciado: false,
      questaoAtual: 0,
      respostasAtividades: {},
      conferenciasAtividades: {},
      atividadeIniciada: false,
      atividadeFinalizada: false,
      tentativasAtividade: 0,
      atualizadoEm: null,
    };
  }

  function normalizarEstado(valor, base, unidade) {
    valor = objeto(valor);
    var gruposValidos = unidade.grupos.map(function (grupo) {
      return grupo.id;
    });
    var itensValidos = todosOsItens(unidade).map(function (item) {
      return item.id;
    });
    var atividades = todasAsAtividades(unidade);
    var respostasRecebidas = objeto(valor.respostasAtividades);
    var respostasValidas = {};
    var conferenciasRecebidas = objeto(valor.conferenciasAtividades);
    var conferenciasValidas = {};

    atividades.forEach(function (atividade) {
      var idsAlternativas = atividade.alternativas.map(function (alternativa) {
        return alternativa.id;
      });
      if (idsAlternativas.indexOf(respostasRecebidas[atividade.id]) >= 0) {
        respostasValidas[atividade.id] = respostasRecebidas[atividade.id];
        if (['correta', 'incorreta'].indexOf(conferenciasRecebidas[atividade.id]) >= 0) {
          conferenciasValidas[atividade.id] = conferenciasRecebidas[atividade.id];
        }
      }
    });

    base.unidadeId = unidade.id;
    base.versao = unidade.versao;
    base.grupoAtual =
      gruposValidos.indexOf(valor.grupoAtual) >= 0 ? valor.grupoAtual : base.grupoAtual;
    var grupo = unidade.grupos.find(function (item) {
      return item.id === base.grupoAtual;
    });
    var itensDoGrupo = grupo.itens.map(function (item) {
      return item.id;
    });
    base.itemAtual =
      itensDoGrupo.indexOf(valor.itemAtual) >= 0 ? valor.itemAtual : grupo.itens[0].id;
    base.itensOuvidos = (Array.isArray(valor.itensOuvidos) ? valor.itensOuvidos : []).filter(
      function (id, indice, lista) {
        return itensValidos.indexOf(id) >= 0 && lista.indexOf(id) === indice;
      }
    );
    base.reproducoes = Math.max(0, Math.trunc(Number(valor.reproducoes) || 0));
    base.questaoAtual = Math.max(
      0,
      Math.min(atividades.length - 1, Math.trunc(Number(valor.questaoAtual) || 0))
    );
    base.respostasAtividades = respostasValidas;
    base.conferenciasAtividades = conferenciasValidas;
    base.atividadeIniciada =
      Boolean(valor.atividadeIniciada) || Object.keys(respostasValidas).length > 0;
    base.atividadeFinalizada =
      Boolean(valor.atividadeFinalizada) &&
      atividades.length > 0 &&
      Object.keys(respostasValidas).length === atividades.length &&
      (!unidade.correcaoPorQuestao ||
        atividades.every(function (atividade) {
          return conferenciasValidas[atividade.id] === 'correta';
        }));
    base.tentativasAtividade = Math.max(0, Math.trunc(Number(valor.tentativasAtividade) || 0));
    base.iniciado =
      Boolean(valor.iniciado) ||
      base.itensOuvidos.length > 0 ||
      base.reproducoes > 0 ||
      base.atividadeIniciada;
    base.atualizadoEm =
      typeof valor.atualizadoEm === 'string' && valor.atualizadoEm ? valor.atualizadoEm : null;
    return base;
  }

  function configuracaoDoPerfil(perfil, revisaoId) {
    var configuracoes = window.ConfiguracoesIngles || {};
    if (!revisaoId && configuracoes[perfil]) return configuracoes[perfil];
    return (
      Object.keys(configuracoes)
        .map(function (chave) {
          return configuracoes[chave];
        })
        .find(function (configuracao) {
          return (
            configuracao &&
            configuracao.perfil === perfil &&
            (!revisaoId || configuracao.revisaoId === revisaoId)
          );
        }) || null
    );
  }

  function dadosDoPerfil(perfil, revisaoId) {
    var configuracao = configuracaoDoPerfil(perfil, revisaoId);
    if (!configuracao) return null;
    var unidade = window.RegistroIngles.obter(configuracao.unidadeId);
    if (!unidade || unidade.perfisDisponiveis.indexOf(perfil) < 0) return null;
    var deposito = window.ArmazenamentoRevisoes.criar({
      chave: configuracao.chaveArmazenamento,
      padrao: estadoInicial(unidade),
      normalizar: function (valor, base) {
        return normalizarEstado(valor, base, unidade);
      },
    });
    return { configuracao: configuracao, unidade: unidade, armazenamento: deposito };
  }

  function carregarPerfil(perfil, revisaoId) {
    var dados = dadosDoPerfil(perfil, revisaoId);
    if (!dados) {
      throw new Error('Ainda não há uma unidade de Inglês configurada para este perfil.');
    }
    configuracaoAtual = dados.configuracao;
    unidadeAtual = dados.unidade;
    perfilAtual = perfil;
    armazenamento = dados.armazenamento;
    estado = armazenamento.carregar();
  }

  function salvarEstado() {
    estado.atualizadoEm = new Date().toISOString();
    estado = armazenamento.salvar(estado);
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: configuracaoAtual.revisaoId },
      })
    );
  }

  function situacaoDoEstado(estadoDoPerfil) {
    if (!estadoDoPerfil) return 'nao-iniciada';
    if (estadoDoPerfil.atividadeFinalizada) return 'concluida';
    if (
      estadoDoPerfil.iniciado ||
      estadoDoPerfil.itensOuvidos.length > 0 ||
      estadoDoPerfil.atividadeIniciada
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function obterEstadoDoPerfil(perfil, revisaoId) {
    if (
      estado &&
      perfil === perfilAtual &&
      (!revisaoId || (configuracaoAtual && configuracaoAtual.revisaoId === revisaoId))
    ) {
      return estado;
    }
    var dados = dadosDoPerfil(perfil, revisaoId);
    return dados ? dados.armazenamento.carregar() : null;
  }

  function atividadesLiberadas() {
    return estado.itensOuvidos.length === todosOsItens(unidadeAtual).length;
  }

  function correcaoPorQuestao() {
    return Boolean(unidadeAtual && unidadeAtual.correcaoPorQuestao);
  }

  function atualizarContinuidade() {
    var total = todosOsItens(unidadeAtual).length;
    var quantidade = estado.itensOuvidos.length;
    var atividades = todasAsAtividades(unidadeAtual);
    var respondidas = Object.keys(estado.respostasAtividades).length;
    var secao = elemento('ingles-continuidade');
    var mensagem = elemento('ingles-mensagem-continuidade');
    var botao = elemento('ingles-iniciar-atividades');
    var liberada = atividadesLiberadas();

    secao.classList.toggle('desbloqueada', liberada);
    botao.disabled = !liberada;
    if (!liberada) {
      var restantes = total - quantidade;
      mensagem.textContent =
        'Ouça mais ' +
        restantes +
        (restantes === 1 ? ' item' : ' itens') +
        ' para liberar as ' +
        atividades.length +
        ' atividades baseadas no caderno.';
      botao.textContent = '🔒 Ouça os ' + total + ' itens primeiro';
      return;
    }
    if (estado.atividadeFinalizada) {
      mensagem.textContent = 'Atividades concluídas. Você pode rever cada resposta e explicação.';
      botao.textContent = 'Ver resultado das atividades →';
      return;
    }
    if (estado.atividadeIniciada) {
      mensagem.textContent = respondidas + ' de ' + atividades.length + ' atividades respondidas.';
      botao.textContent = 'Continuar atividades →';
      return;
    }
    mensagem.textContent =
      unidadeAtual.mensagemAtividades ||
      'Muito bem! Agora pratique objetos, pessoas, lugares, materiais e regras da escola.';
    botao.textContent = 'Começar as ' + atividades.length + ' atividades →';
  }

  function atualizarProgresso() {
    var total = todosOsItens(unidadeAtual).length;
    var quantidade = estado.itensOuvidos.length;
    elemento('ingles-progresso-texto').textContent =
      quantidade + ' de ' + total + ' palavras e frases ouvidas';
    var barra = elemento('ingles-progresso');
    barra.setAttribute('aria-valuemax', total);
    barra.setAttribute('aria-valuenow', quantidade);
    barra.querySelector('span').style.width = (quantidade / total) * 100 + '%';
    atualizarContinuidade();
  }

  function marcarItemOuvido(id) {
    if (estado.itensOuvidos.indexOf(id) < 0) {
      estado.itensOuvidos.push(id);
    }
    estado.reproducoes += 1;
    estado.iniciado = true;
    salvarEstado();
    renderizarItens();
    atualizarProgresso();
  }

  function atualizarVozesNaTela() {
    var vozIngles = window.AudioRevisoes.obterVoz('en-US');
    var vozPortugues = window.AudioRevisoes.obterVoz('pt-BR');
    elemento('ingles-vozes-locais').textContent =
      'Voz em inglês: ' +
      (vozIngles ? vozIngles.nome : 'nenhuma voz local encontrada') +
      ' · Voz em português: ' +
      (vozPortugues ? vozPortugues.nome : 'nenhuma voz local encontrada');
  }

  function atualizarItemSelecionado() {
    var item = itemAtual();
    elemento('ingles-item-imagem').src = '../assets/objetos_escolares/' + item.imagem;
    elemento('ingles-item-imagem').alt = 'Ilustração de ' + item.portugues;
    elemento('ingles-item-ingles').textContent = item.ingles;
    elemento('ingles-item-portugues').textContent = item.portugues;
  }

  function selecionarItem(id) {
    estado.itemAtual = id;
    estado.iniciado = true;
    salvarEstado();
    renderizarItens();
    atualizarItemSelecionado();
    ouvirIngles(false);
  }

  function renderizarItens() {
    var grupo = grupoAtual();
    var grade = elemento('ingles-grade-itens');
    grade.innerHTML = '';
    grupo.itens.forEach(function (item) {
      var botao = document.createElement('button');
      var imagem = document.createElement('img');
      var ingles = document.createElement('strong');
      var portugues = document.createElement('span');
      var ouvido = estado.itensOuvidos.indexOf(item.id) >= 0;
      botao.type = 'button';
      botao.className = 'cartao-palavra-ingles';
      botao.dataset.itemIngles = item.id;
      botao.setAttribute('aria-pressed', String(estado.itemAtual === item.id));
      botao.classList.toggle('selecionado', estado.itemAtual === item.id);
      botao.classList.toggle('ouvido', ouvido);
      imagem.src = '../assets/objetos_escolares/' + item.imagem;
      imagem.alt = '';
      ingles.lang = 'en-US';
      ingles.textContent = item.ingles;
      portugues.textContent = item.portugues;
      botao.append(imagem, ingles, portugues);
      if (ouvido) {
        var marca = document.createElement('small');
        marca.textContent = '✓ Ouvido';
        botao.appendChild(marca);
      }
      botao.addEventListener('click', function () {
        selecionarItem(item.id);
      });
      grade.appendChild(botao);
    });
  }

  function escolherGrupo(id) {
    var grupo = localizarGrupo(id);
    if (!grupo) return;
    estado.grupoAtual = grupo.id;
    estado.itemAtual = grupo.itens[0].id;
    estado.iniciado = true;
    salvarEstado();
    renderizar();
  }

  function renderizarGrupos() {
    var navegacao = elemento('ingles-grupos');
    navegacao.innerHTML = '';
    unidadeAtual.grupos.forEach(function (grupo) {
      var botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'aba-grupo-ingles';
      botao.dataset.grupoIngles = grupo.id;
      botao.setAttribute('aria-pressed', String(estado.grupoAtual === grupo.id));
      botao.textContent = grupo.titulo + ' · ' + grupo.traducao;
      botao.addEventListener('click', function () {
        escolherGrupo(grupo.id);
      });
      navegacao.appendChild(botao);
    });
  }

  function aoEstadoDoAudio(detalhe, idItem) {
    elemento('ingles-status-audio').textContent = detalhe.mensagem;
    if (detalhe.voz) atualizarVozesNaTela();
    if (detalhe.fase === 'concluido' && idItem) marcarItemOuvido(idItem);
  }

  function ouvirInstrucao() {
    var grupo = grupoAtual();
    window.AudioRevisoes.falar({
      texto: grupo.instrucao,
      idioma: 'pt-BR',
      velocidade: 0.88,
      origem: 'ingles',
      aoEstado: function (detalhe) {
        aoEstadoDoAudio(detalhe, null);
      },
    });
  }

  function ouvirIngles(devagar) {
    var item = itemAtual();
    window.AudioRevisoes.falar({
      texto: item.ingles,
      idioma: 'en-US',
      velocidade: devagar ? 0.5 : 0.62,
      origem: 'ingles',
      aoEstado: function (detalhe) {
        aoEstadoDoAudio(detalhe, item.id);
      },
    });
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

  function posicaoCorreta(indiceQuestao, quantidadeAlternativas) {
    var atividades = todasAsAtividades(unidadeAtual);
    var chaveBase = perfilAtual + '|' + unidadeAtual.id + '|atividades';
    var deslocamento = numeroDaChave(chaveBase + '|deslocamento') % quantidadeAlternativas;
    var posicoes = atividades.map(function (_atividade, indice) {
      return (indice + deslocamento) % quantidadeAlternativas;
    });
    return embaralharComChave(posicoes, chaveBase + '|posicoes')[indiceQuestao];
  }

  function alternativasParaExibicao(questao, indiceQuestao) {
    var alternativas = questao.alternativas.slice();
    var correta = alternativas.find(function (alternativa) {
      return alternativa.id === questao.respostaCorreta;
    });
    if (!correta || alternativas.length < 2) return alternativas;
    var incorretas = alternativas.filter(function (alternativa) {
      return alternativa.id !== questao.respostaCorreta;
    });
    incorretas = embaralharComChave(
      incorretas,
      perfilAtual + '|' + unidadeAtual.id + '|' + questao.id + '|alternativas'
    );
    incorretas.splice(posicaoCorreta(indiceQuestao, alternativas.length), 0, correta);
    return incorretas;
  }

  function textoDaAlternativa(alternativa) {
    return alternativa.texto + (alternativa.traducao ? ' · ' + alternativa.traducao : '');
  }

  function renderizarImagensDoEnunciado(questao) {
    var recipiente = elemento('ingles-imagens-enunciado');
    recipiente.innerHTML = '';
    if (!questao.imagemEnunciado) return;
    var repeticoes = Math.max(1, Number(questao.repeticoesImagem) || 1);
    for (var indice = 0; indice < repeticoes; indice += 1) {
      var imagem = document.createElement('img');
      imagem.src = '../assets/objetos_escolares/' + questao.imagemEnunciado;
      imagem.alt = '';
      recipiente.appendChild(imagem);
    }
  }

  function selecionarAlternativaAtividade(id) {
    var questao = questaoAtual();
    if (!questao) return;
    if (correcaoPorQuestao() && estado.conferenciasAtividades[questao.id] === 'correta') return;
    estado.respostasAtividades[questao.id] = id;
    if (correcaoPorQuestao()) delete estado.conferenciasAtividades[questao.id];
    estado.atividadeIniciada = true;
    estado.iniciado = true;
    salvarEstado();
    renderizarAlternativasAtividade(questao);
    elemento('ingles-atividade-proxima').disabled = correcaoPorQuestao();
    elemento('ingles-conferir-atividade').disabled = false;
    elemento('ingles-status-atividade').textContent = correcaoPorQuestao()
      ? 'Resposta marcada. Agora clique em “Conferir resposta”.'
      : 'Resposta marcada. A correção aparecerá somente ao final das atividades.';
    atualizarContinuidade();
  }

  function renderizarAlternativasAtividade(questao) {
    var grade = elemento('ingles-alternativas-atividade');
    var resposta = estado.respostasAtividades[questao.id];
    var conferencia = estado.conferenciasAtividades[questao.id];
    grade.innerHTML = '';
    alternativasParaExibicao(questao, estado.questaoAtual).forEach(function (alternativa, indice) {
      var botao = document.createElement('button');
      var texto = document.createElement('span');
      var ingles = document.createElement('strong');
      var traducao = document.createElement('small');
      botao.type = 'button';
      botao.className = 'alternativa-atividade-ingles';
      botao.dataset.alternativaAtividadeIngles = alternativa.id;
      botao.setAttribute('aria-pressed', String(resposta === alternativa.id));
      botao.classList.toggle(
        'incorreta',
        conferencia === 'incorreta' && resposta === alternativa.id
      );
      botao.classList.toggle('correta', conferencia === 'correta' && resposta === alternativa.id);
      botao.disabled = conferencia === 'correta';
      if (alternativa.imagem) {
        var imagem = document.createElement('img');
        imagem.src = '../assets/objetos_escolares/' + alternativa.imagem;
        imagem.alt = '';
        botao.appendChild(imagem);
      } else {
        var letra = document.createElement('span');
        letra.className = 'letra-opcao';
        letra.textContent = String.fromCharCode(65 + indice);
        botao.appendChild(letra);
      }
      texto.className = 'texto-alternativa-ingles';
      ingles.lang = 'en-US';
      ingles.textContent = alternativa.texto;
      texto.appendChild(ingles);
      if (alternativa.traducao) {
        traducao.textContent = alternativa.traducao;
        texto.appendChild(traducao);
      }
      botao.appendChild(texto);
      botao.addEventListener('click', function () {
        selecionarAlternativaAtividade(alternativa.id);
      });
      grade.appendChild(botao);
    });
  }

  function renderizarQuestaoAtividade() {
    var atividades = todasAsAtividades(unidadeAtual);
    var questao = questaoAtual();
    if (!questao) return;
    elemento('ingles-cartao-questao').hidden = false;
    elemento('ingles-revisao-atividades').hidden = true;
    elemento('ingles-progresso-atividade').textContent =
      'Atividade ' + (estado.questaoAtual + 1) + ' de ' + atividades.length;
    elemento('ingles-pergunta-atividade').textContent = questao.perguntaIngles;
    elemento('ingles-instrucao-atividade').textContent = questao.instrucaoPortugues;
    renderizarImagensDoEnunciado(questao);
    renderizarAlternativasAtividade(questao);
    var resposta = estado.respostasAtividades[questao.id];
    var conferencia = estado.conferenciasAtividades[questao.id];
    var imediata = correcaoPorQuestao();
    var botaoConferir = elemento('ingles-conferir-atividade');
    elemento('ingles-atividade-anterior').disabled = estado.questaoAtual === 0;
    botaoConferir.hidden = !imediata;
    botaoConferir.disabled = !resposta || conferencia === 'correta';
    elemento('ingles-atividade-proxima').disabled = imediata
      ? conferencia !== 'correta'
      : !resposta;
    elemento('ingles-atividade-proxima').textContent =
      estado.questaoAtual === atividades.length - 1
        ? imediata
          ? 'Concluir revisão ✓'
          : 'Conferir respostas ✓'
        : 'Próxima →';
    if (imediata && conferencia === 'correta') {
      elemento('ingles-status-atividade').textContent = '✓ ' + questao.explicacao;
    } else if (imediata && conferencia === 'incorreta') {
      elemento('ingles-status-atividade').textContent =
        '↻ ' + (questao.feedbackErro || 'Revise as opções e tente novamente.');
    } else if (resposta) {
      elemento('ingles-status-atividade').textContent = imediata
        ? 'Resposta marcada. Agora clique em “Conferir resposta”.'
        : 'Resposta marcada. A correção aparecerá somente ao final das atividades.';
    } else {
      elemento('ingles-status-atividade').textContent = imediata
        ? 'Escolha uma alternativa e confira antes de avançar.'
        : 'Escolha uma alternativa. A correção aparecerá somente ao final.';
    }
  }

  function conferirRespostaAtividade() {
    if (!correcaoPorQuestao()) return;
    var questao = questaoAtual();
    var resposta = questao && estado.respostasAtividades[questao.id];
    if (!questao || !resposta) return;
    estado.conferenciasAtividades[questao.id] =
      resposta === questao.respostaCorreta ? 'correta' : 'incorreta';
    estado.tentativasAtividade += 1;
    salvarEstado();
    renderizarQuestaoAtividade();
    atualizarContinuidade();
  }

  function alternativaDaQuestao(questao, id) {
    return questao.alternativas.find(function (alternativa) {
      return alternativa.id === id;
    });
  }

  function quantidadeDeAcertos() {
    return todasAsAtividades(unidadeAtual).filter(function (questao) {
      return estado.respostasAtividades[questao.id] === questao.respostaCorreta;
    }).length;
  }

  function renderizarRevisaoAtividades() {
    var atividades = todasAsAtividades(unidadeAtual);
    var acertos = quantidadeDeAcertos();
    var lista = elemento('ingles-lista-revisao');
    elemento('ingles-cartao-questao').hidden = true;
    elemento('ingles-revisao-atividades').hidden = false;
    elemento('ingles-resumo-resultado').textContent =
      (perfilAtual === 'alice' ? 'Alice' : 'Mariana') +
      ', você acertou ' +
      acertos +
      ' de ' +
      atividades.length +
      ' atividades.';
    elemento('ingles-destinataria-surpresa').textContent =
      perfilAtual === 'alice' ? 'Alice' : 'Mariana';
    elemento('ingles-texto-surpresa').textContent =
      unidadeAtual.mensagemFinal || MENSAGENS_SURPRESA[perfilAtual];
    elemento('ingles-refazer-atividades').textContent =
      'Refazer as ' + atividades.length + ' atividades';
    lista.innerHTML = '';
    atividades.forEach(function (questao, indice) {
      var respostaId = estado.respostasAtividades[questao.id];
      var correta = respostaId === questao.respostaCorreta;
      var resposta = alternativaDaQuestao(questao, respostaId);
      var respostaCorreta = alternativaDaQuestao(questao, questao.respostaCorreta);
      var cartao = document.createElement('article');
      var titulo = document.createElement('h3');
      var selo = document.createElement('p');
      var respondida = document.createElement('p');
      cartao.className = 'item-revisao-ingles ' + (correta ? 'acertou' : 'errou');
      titulo.textContent = indice + 1 + '. ' + questao.perguntaIngles;
      selo.className = 'selo-resultado-ingles';
      selo.textContent = correta ? '✓ Você acertou' : '✗ Vamos revisar';
      respondida.textContent = 'Sua resposta: ' + textoDaAlternativa(resposta);
      cartao.append(titulo, selo, respondida);
      if (!correta) {
        var certa = document.createElement('p');
        var explicacao = document.createElement('p');
        certa.innerHTML = '<strong>Resposta certa:</strong> ';
        certa.append(document.createTextNode(textoDaAlternativa(respostaCorreta)));
        explicacao.innerHTML = '<strong>Por quê?</strong> ';
        explicacao.append(document.createTextNode(questao.explicacao));
        cartao.append(certa, explicacao);
      }
      lista.appendChild(cartao);
    });
  }

  function abrirAtividades() {
    if (!atividadesLiberadas()) return;
    window.AudioRevisoes.parar({ silencioso: true, origem: 'ingles' });
    elemento('ingles-painel-atividades').hidden = false;
    if (estado.atividadeFinalizada) {
      renderizarRevisaoAtividades();
    } else {
      estado.atividadeIniciada = true;
      estado.iniciado = true;
      salvarEstado();
      renderizarQuestaoAtividade();
    }
    elemento('ingles-painel-atividades').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function irParaQuestaoAnterior() {
    if (estado.questaoAtual <= 0) return;
    estado.questaoAtual -= 1;
    salvarEstado();
    renderizarQuestaoAtividade();
  }

  function finalizarAtividades() {
    var atividades = todasAsAtividades(unidadeAtual);
    if (Object.keys(estado.respostasAtividades).length !== atividades.length) return;
    if (
      correcaoPorQuestao() &&
      !atividades.every(function (atividade) {
        return estado.conferenciasAtividades[atividade.id] === 'correta';
      })
    ) {
      return;
    }
    estado.atividadeFinalizada = true;
    if (!correcaoPorQuestao()) estado.tentativasAtividade += 1;
    salvarEstado();
    atualizarContinuidade();
    renderizarRevisaoAtividades();
  }

  function irParaProximaQuestao() {
    var atividades = todasAsAtividades(unidadeAtual);
    var questao = questaoAtual();
    if (!questao || !estado.respostasAtividades[questao.id]) return;
    if (correcaoPorQuestao() && estado.conferenciasAtividades[questao.id] !== 'correta') return;
    if (estado.questaoAtual === atividades.length - 1) {
      finalizarAtividades();
      return;
    }
    estado.questaoAtual += 1;
    salvarEstado();
    renderizarQuestaoAtividade();
  }

  function refazerAtividades() {
    estado.questaoAtual = 0;
    estado.respostasAtividades = {};
    estado.conferenciasAtividades = {};
    estado.atividadeIniciada = true;
    estado.atividadeFinalizada = false;
    salvarEstado();
    atualizarContinuidade();
    renderizarQuestaoAtividade();
  }

  function voltarAoVocabulario() {
    elemento('ingles-painel-atividades').hidden = true;
    elemento('titulo-controles-audio-ingles').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function ouvirPerguntaAtual() {
    var questao = questaoAtual();
    if (!questao) return;
    window.AudioRevisoes.falar({
      texto: questao.perguntaIngles,
      idioma: 'en-US',
      velocidade: 0.62,
      origem: 'ingles-atividade',
      aoEstado: function (detalhe) {
        elemento('ingles-status-atividade').textContent = detalhe.mensagem;
      },
    });
  }

  function renderizar() {
    var grupo = grupoAtual();
    elemento('ingles-nome-perfil').textContent = perfilAtual === 'alice' ? 'Alice' : 'Mariana';
    elemento('ingles-titulo-unidade').textContent = unidadeAtual.subtitulo;
    elemento('ingles-subtitulo-unidade').textContent = unidadeAtual.titulo;
    elemento('ingles-descricao-unidade').textContent =
      unidadeAtual.descricao ||
      'Clique ou pressione Enter em uma palavra ou frase para ouvir em inglês. O ambiente também pode ler as instruções em português.';
    elemento('ingles-imagem-cabecalho').src =
      '../assets/objetos_escolares/' + (unidadeAtual.imagemCabecalho || 'school.svg');
    elemento('ingles-titulo-grupo').textContent = grupo.titulo;
    elemento('ingles-traducao-grupo').textContent = grupo.traducao;
    elemento('ingles-instrucao-grupo').textContent = grupo.instrucao;
    elemento('ingles-painel-atividades').hidden = true;
    renderizarGrupos();
    renderizarItens();
    atualizarItemSelecionado();
    atualizarProgresso();
    atualizarVozesNaTela();
    elemento('ingles-status-audio').textContent =
      'Clique ou pressione Enter em uma palavra ou frase abaixo para ouvir em inglês.';
  }

  function abrir(perfil, revisaoId) {
    carregarPerfil(perfil, revisaoId);
    renderizar();
    controladorApp.mostrarTela('ingles');
  }

  function limparProgresso() {
    if (!armazenamento || !unidadeAtual) return false;
    if (!window.confirm('Limpar somente o progresso desta revisão de Inglês?')) return false;
    window.AudioRevisoes.parar({ silencioso: true, origem: 'ingles' });
    armazenamento.remover();
    estado = estadoInicial(unidadeAtual);
    renderizar();
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: configuracaoAtual.revisaoId },
      })
    );
    return true;
  }

  function registrarEventos() {
    elemento('ingles-ouvir-instrucao').addEventListener('click', ouvirInstrucao);
    elemento('ingles-ouvir-normal').addEventListener('click', function () {
      ouvirIngles(false);
    });
    elemento('ingles-ouvir-devagar').addEventListener('click', function () {
      ouvirIngles(true);
    });
    elemento('ingles-repetir').addEventListener('click', function () {
      if (!window.AudioRevisoes.repetir()) return;
      elemento('ingles-status-audio').textContent = 'Repetindo o último áudio.';
    });
    elemento('ingles-parar').addEventListener('click', function () {
      window.AudioRevisoes.parar({ origem: 'ingles' });
      elemento('ingles-status-audio').textContent = 'Áudio interrompido.';
    });
    elemento('ingles-iniciar-atividades').addEventListener('click', abrirAtividades);
    elemento('ingles-ouvir-pergunta').addEventListener('click', ouvirPerguntaAtual);
    elemento('ingles-conferir-atividade').addEventListener('click', conferirRespostaAtividade);
    elemento('ingles-atividade-anterior').addEventListener('click', irParaQuestaoAnterior);
    elemento('ingles-atividade-proxima').addEventListener('click', irParaProximaQuestao);
    elemento('ingles-refazer-atividades').addEventListener('click', refazerAtividades);
    elemento('ingles-voltar-vocabulario').addEventListener('click', voltarAoVocabulario);
  }

  function inicializar(configuracao) {
    if (inicializado) return;
    controladorApp = configuracao;
    registrarEventos();
    inicializado = true;
  }

  function resumoDoEstado(estadoDoPerfil, unidade) {
    if (!estadoDoPerfil || !unidade) return null;
    var totalAudios = todosOsItens(unidade).length;
    var totalAtividades = todasAsAtividades(unidade).length;
    var resumo = estadoDoPerfil.itensOuvidos.length + '/' + totalAudios + ' áudios';
    if (estadoDoPerfil.itensOuvidos.length === totalAudios) {
      resumo +=
        ' · ' +
        Object.keys(estadoDoPerfil.respostasAtividades).length +
        '/' +
        totalAtividades +
        ' atividades';
    }
    return resumo;
  }

  window.InglesRevisoes = {
    inicializar: inicializar,
    abrir: abrir,
    limparProgresso: limparProgresso,
    pararAudio: function () {
      window.AudioRevisoes.parar({ silencioso: true, origem: 'ingles' });
    },
    obterEstado: function (perfil, revisaoId) {
      var perfilDesejado = perfil || perfilAtual;
      var revisaoDesejada =
        revisaoId || (!perfil && configuracaoAtual && configuracaoAtual.revisaoId);
      var atual = obterEstadoDoPerfil(perfilDesejado, revisaoDesejada);
      return atual ? JSON.parse(JSON.stringify(atual)) : null;
    },
    obterSituacao: function (perfil, revisaoId) {
      return situacaoDoEstado(obterEstadoDoPerfil(perfil || perfilAtual, revisaoId));
    },
    obterResumo: function (perfil, revisaoId) {
      var perfilDesejado = perfil || perfilAtual;
      var revisaoDesejada =
        revisaoId || (!perfil && configuracaoAtual && configuracaoAtual.revisaoId);
      var dados = dadosDoPerfil(perfilDesejado, revisaoDesejada);
      var estadoDoPerfil = obterEstadoDoPerfil(perfilDesejado, revisaoDesejada);
      return dados ? resumoDoEstado(estadoDoPerfil, dados.unidade) : null;
    },
    obterUnidade: function () {
      return unidadeAtual ? JSON.parse(JSON.stringify(unidadeAtual)) : null;
    },
  };
})();
