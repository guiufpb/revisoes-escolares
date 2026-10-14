(function () {
  'use strict';

  // Rendering and validation only. Session, audio, scoring and navigation stay in ingles.js.
  function ativa(unidade, questao) {
    return Boolean(
      unidade &&
      unidade.interacoes &&
      unidade.interacoes.habilitadas &&
      questao &&
      Array.isArray(questao.itens)
    );
  }

  function imagem(nome, configuracao) {
    if (typeof nome !== 'string' || !/^[a-z0-9][a-z0-9_-]*\.(svg|png|jpe?g|webp)$/i.test(nome))
      return '';
    var pasta = configuracao && configuracao.diretorioImagens;
    if (typeof pasta !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(pasta))
      pasta = 'objetos_escolares';
    return '../assets/' + pasta + '/' + nome;
  }

  function texto(valor, tolerante) {
    var resultado = String(valor || '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('en-US');
    return tolerante
      ? resultado
          .replace(/['’.,?!]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      : resultado;
  }

  function normalizar(questao, valor) {
    var entrada = valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
    var resultado = {};
    questao.itens.forEach(function (item) {
      var resposta = entrada[item.id];
      if (item.tipo === 'campo') {
        if (typeof resposta === 'string' && resposta.length)
          resultado[item.id] = resposta.slice(0, 200);
        return;
      }
      var ids = item.opcoes.map(function (opcao) {
        return opcao.id;
      });
      if (item.tipo === 'selecao' || item.tipo === 'ordenacao') {
        if (!Array.isArray(resposta)) return;
        var validas = resposta.filter(function (id, indice, lista) {
          return ids.indexOf(id) >= 0 && lista.indexOf(id) === indice;
        });
        if (validas.length) resultado[item.id] = item.tipo === 'selecao' ? validas.sort() : validas;
      } else if (ids.indexOf(resposta) >= 0) resultado[item.id] = resposta;
    });
    return resultado;
  }

  function completa(questao, resposta) {
    resposta = normalizar(questao, resposta);
    return questao.itens.every(function (item) {
      var valor = resposta[item.id];
      if (item.tipo === 'campo') return Boolean(texto(valor));
      if (item.tipo === 'ordenacao')
        return Array.isArray(valor) && valor.length === item.opcoes.length;
      if (item.tipo === 'selecao') return Array.isArray(valor) && valor.length > 0;
      return typeof valor === 'string';
    });
  }

  function acertos(questao, resposta) {
    resposta = normalizar(questao, resposta);
    return questao.itens.map(function (item) {
      var valor = resposta[item.id];
      if (item.tipo === 'campo')
        return item.respostas.some(function (esperada) {
          return texto(valor) === texto(esperada);
        });
      if (item.tipo === 'selecao')
        return (
          Array.isArray(valor) &&
          window.QuestionariosInteracoes.mesmoConjunto(valor, item.respostas)
        );
      if (item.tipo === 'ordenacao')
        return (
          Array.isArray(valor) &&
          valor.length === item.respostas.length &&
          item.respostas.every(function (id, indice) {
            return id === valor[indice];
          })
        );
      return item.respostas.indexOf(valor) >= 0;
    });
  }

  function correta(questao, resposta) {
    return completa(questao, resposta) && acertos(questao, resposta).every(Boolean);
  }

  function assinatura(questao, resposta) {
    return JSON.stringify(normalizar(questao, resposta));
  }

  function resumo(questao, resposta) {
    resposta = normalizar(questao, resposta);
    return questao.itens
      .map(function (item) {
        var valor = resposta[item.id];
        if (item.tipo === 'campo') return valor || 'Sem resposta';
        return (Array.isArray(valor) ? valor : [valor])
          .map(function (id) {
            var opcao = item.opcoes.find(function (candidata) {
              return candidata.id === id;
            });
            return opcao ? opcao.texto : 'Sem resposta';
          })
          .join(' / ');
      })
      .join(' · ');
  }

  function paragrafo(pai, valor) {
    var p = document.createElement('p');
    p.textContent = valor;
    pai.appendChild(p);
    return p;
  }

  function tabela(pai, dados) {
    var tabela = document.createElement('table');
    var caption = document.createElement('caption');
    caption.textContent = dados.titulo;
    tabela.appendChild(caption);
    var head = document.createElement('thead');
    var tr = document.createElement('tr');
    dados.colunas.forEach(function (nome) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = nome;
      tr.appendChild(th);
    });
    head.appendChild(tr);
    tabela.appendChild(head);
    var body = document.createElement('tbody');
    dados.linhas.forEach(function (linha) {
      var row = document.createElement('tr');
      linha.forEach(function (valor, indice) {
        var celula = document.createElement(indice === 0 ? 'th' : 'td');
        if (indice === 0) celula.scope = 'row';
        celula.textContent = valor;
        row.appendChild(celula);
      });
      body.appendChild(row);
    });
    tabela.appendChild(body);
    pai.appendChild(tabela);
  }

  function montar(pai, unidade, questao, resposta, configuracao) {
    pai.replaceChildren();
    pai.classList.add('ingles-interacoes');
    if (questao.aprendizagem) {
      var apoio = document.createElement('details');
      apoio.open = true;
      var titulo = document.createElement('summary');
      titulo.textContent = "Let's learn · Leia para aprender";
      apoio.appendChild(titulo);
      questao.aprendizagem.forEach(function (linha) {
        paragrafo(apoio, linha);
      });
      (questao.aprendizagemTabelas || []).forEach(function (dados) {
        tabela(apoio, dados);
      });
      var ler = document.createElement('button');
      ler.type = 'button';
      ler.className = 'botao-secundario';
      ler.textContent = 'Ouvir apoio';
      ler.addEventListener('click', function () {
        configuracao.ler(questao.aprendizagem.join(' '), 'pt-BR');
      });
      apoio.appendChild(ler);
      pai.appendChild(apoio);
    }
    (questao.imagensApoio || []).forEach(function (dados) {
      var apoioImg = document.createElement('img');
      apoioImg.src = imagem(dados.imagem, unidade);
      apoioImg.alt = dados.descricao;
      pai.appendChild(apoioImg);
    });
    (questao.apoio || []).forEach(function (linha) {
      paragrafo(pai, linha);
    });
    (questao.tabelas || []).forEach(function (dados) {
      tabela(pai, dados);
    });
    resposta = normalizar(questao, resposta);
    var resultados = acertos(questao, resposta);
    questao.itens.forEach(function (item, indice) {
      var fieldset = document.createElement('fieldset');
      fieldset.dataset.subitemIngles = item.id;
      var legend = document.createElement('legend');
      legend.textContent = item.id + ') ' + item.pergunta;
      legend.lang = 'en-US';
      fieldset.appendChild(legend);
      if (configuracao.conferida)
        fieldset.setAttribute('aria-invalid', String(!resultados[indice]));
      if (item.imagem) {
        var figura = document.createElement('img');
        figura.src = imagem(item.imagem, unidade);
        figura.alt = item.imagemAlt || '';
        fieldset.appendChild(figura);
      }
      if (item.descricao) paragrafo(fieldset, item.descricao);
      if (item.estimulo) {
        [false, true].forEach(function (devagar) {
          var ouvir = document.createElement('button');
          ouvir.type = 'button';
          ouvir.className = 'botao-secundario';
          ouvir.textContent = 'Ouvir item ' + item.id + (devagar ? ' devagar' : '');
          // Stimuli may be played before the general question has finished.
          ouvir.disabled = false;
          ouvir.addEventListener('click', function () {
            configuracao.ouvir(item, devagar);
          });
          fieldset.appendChild(ouvir);
        });
        paragrafo(
          fieldset,
          configuracao.ouvido(item) ? '✓ Item ouvido' : 'Ouça este item até o fim.'
        );
      }
      if (item.tipo === 'campo') {
        var label = document.createElement('label');
        label.htmlFor = 'ingles-resposta-' + item.id;
        label.textContent = 'Digite a palavra inteira do item ' + item.id;
        var input = document.createElement('input');
        input.id = label.htmlFor;
        input.type = 'text';
        input.maxLength = 200;
        input.autocomplete = 'off';
        input.autocapitalize = 'off';
        input.spellcheck = false;
        input.value = resposta[item.id] || '';
        input.disabled = configuracao.bloqueada;
        input.setAttribute('aria-invalid', String(configuracao.conferida && !resultados[indice]));
        input.addEventListener('input', function () {
          configuracao.alterar(item, input.value, false);
        });
        input.addEventListener('keydown', function (evento) {
          if (evento.key === 'Enter' && !evento.isComposing) {
            evento.preventDefault();
            configuracao.conferir();
          }
        });
        fieldset.append(label, input);
      } else {
        if (item.tipo === 'ordenacao') {
          paragrafo(
            fieldset,
            'Escolha os cartões para preencher a ordem. Clique novamente no cartão ou use Retirar na lista para reposicioná-lo.'
          );
          var colocadas = Array.isArray(resposta[item.id]) ? resposta[item.id] : [];
          var ordem = document.createElement('ol');
          colocadas.forEach(function (id) {
            var opcao = item.opcoes.find(function (candidata) {
              return candidata.id === id;
            });
            var li = document.createElement('li');
            var retirar = document.createElement('button');
            retirar.type = 'button';
            retirar.className = 'botao-secundario';
            retirar.textContent = 'Retirar ' + opcao.texto;
            retirar.disabled = configuracao.bloqueada;
            retirar.addEventListener('click', function () {
              configuracao.alterar(
                item,
                colocadas.filter(function (valor) {
                  return valor !== id;
                }),
                true
              );
            });
            li.appendChild(retirar);
            ordem.appendChild(li);
          });
          fieldset.appendChild(ordem);
        }
        if (['associacao', 'categoria', 'banco'].indexOf(item.tipo) >= 0) {
          var escolhida = item.opcoes.find(function (opcao) {
            return opcao.id === resposta[item.id];
          });
          paragrafo(
            fieldset,
            (item.tipo === 'categoria' ? 'Categoria: ' : 'No espaço: ') +
              (escolhida ? escolhida.texto : 'ainda vazio')
          );
        }
        if (item.tipo === 'selecao')
          paragrafo(fieldset, 'Marque exatamente duas opções. Clique novamente para desmarcar.');
        var opcoes = document.createElement('div');
        opcoes.className = 'ingles-opcoes-subitem';
        item.opcoes.forEach(function (opcao, posicao) {
          var botao = document.createElement('button');
          botao.type = 'button';
          botao.className = 'alternativa-atividade-ingles';
          botao.dataset.opcaoIngles = opcao.id;
          var valor = resposta[item.id];
          var selecionada = Array.isArray(valor)
            ? valor.indexOf(opcao.id) >= 0
            : valor === opcao.id;
          botao.setAttribute('aria-pressed', String(selecionada));
          botao.disabled = configuracao.bloqueada;
          if (opcao.imagem) {
            var img = document.createElement('img');
            img.src = imagem(opcao.imagem, unidade);
            img.alt = '';
            botao.appendChild(img);
          }
          var prefixo =
            item.tipo === 'ordenacao' && selecionada
              ? 'Retirar: '
              : ['associacao', 'categoria', 'banco', 'ordenacao'].indexOf(item.tipo) >= 0
                ? 'Colocar: '
                : '';
          var rotulo = String.fromCharCode(65 + posicao) + '. ' + prefixo + opcao.texto;
          paragrafo(botao, rotulo);
          botao.setAttribute(
            'aria-label',
            'Opção ' + String.fromCharCode(65 + posicao) + ': ' + prefixo + opcao.texto
          );
          botao.addEventListener('click', function () {
            var novo;
            if (item.tipo === 'selecao')
              novo = selecionada
                ? valor.filter(function (id) {
                    return id !== opcao.id;
                  })
                : (valor || []).concat(opcao.id);
            else if (item.tipo === 'ordenacao')
              novo = selecionada
                ? valor.filter(function (id) {
                    return id !== opcao.id;
                  })
                : (valor || []).concat(opcao.id);
            else novo = selecionada ? '' : opcao.id;
            configuracao.alterar(item, novo, true, opcao.id);
          });
          opcoes.appendChild(botao);
        });
        fieldset.appendChild(opcoes);
        if (['associacao', 'categoria', 'banco'].indexOf(item.tipo) >= 0) {
          var limpar = document.createElement('button');
          limpar.type = 'button';
          limpar.className = 'botao-secundario';
          limpar.textContent = 'Retirar do espaço ' + item.id;
          limpar.disabled = configuracao.bloqueada || !resposta[item.id];
          limpar.addEventListener('click', function () {
            configuracao.alterar(item, '', true);
          });
          fieldset.appendChild(limpar);
        }
      }
      pai.appendChild(fieldset);
    });
  }

  function enriquecimentos(pai, unidade, ler) {
    var antigo = document.getElementById('ingles-enriquecimentos');
    if (antigo) antigo.remove();
    if (!unidade.enriquecimentos) return;
    var secao = document.createElement('section');
    secao.id = 'ingles-enriquecimentos';
    secao.className = 'ingles-interacoes';
    var titulo = document.createElement('h3');
    titulo.textContent = 'Great work! · Explore, se quiser';
    secao.appendChild(titulo);
    unidade.enriquecimentos.paragrafos.forEach(function (linha) {
      paragrafo(secao, linha);
    });
    [
      'Reconhecer e nomear transportes em inglês.',
      'Dizer por onde se deslocam e observar se usam motor.',
      'Relacionar proteção, viagem e direção.',
    ].forEach(function (tema, indice) {
      var label = document.createElement('label');
      label.htmlFor = 'ingles-autoavaliacao-' + indice;
      label.textContent = tema;
      var select = document.createElement('select');
      select.id = label.htmlFor;
      ['', 'Já consigo', 'Consigo com ajuda', 'Quero praticar mais'].forEach(function (valor) {
        var option = document.createElement('option');
        option.value = valor;
        option.textContent = valor || 'Escolha, se quiser';
        select.appendChild(option);
      });
      secao.append(label, select);
    });
    unidade.enriquecimentos.tabelas.forEach(function (dados) {
      tabela(secao, dados);
      dados.linhas.forEach(function (linha) {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'botao-secundario';
        botao.textContent = 'Ouvir ' + linha[0];
        botao.addEventListener('click', function () {
          ler(linha[0], 'en-US', 'palavra');
        });
        secao.appendChild(botao);
      });
    });
    unidade.enriquecimentos.figuras.forEach(function (dados) {
      var img = document.createElement('img');
      img.src = imagem(dados.imagem, unidade);
      img.alt = dados.descricao;
      secao.appendChild(img);
    });
    pai.appendChild(secao);
  }

  window.InglesInteracoes = {
    ativa: ativa,
    imagem: imagem,
    texto: texto,
    normalizar: normalizar,
    completa: completa,
    acertos: acertos,
    correta: correta,
    assinatura: assinatura,
    resumo: resumo,
    montar: montar,
    tabela: tabela,
    enriquecimentos: enriquecimentos,
  };
})();
