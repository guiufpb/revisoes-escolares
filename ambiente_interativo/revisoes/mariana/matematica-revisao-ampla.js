(function () {
  'use strict';

  var CHAVE = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
  var TOTAL_ETAPAS = 25;
  var etapaAtual = 0;
  var conteudo;
  var estado;
  var selecoesPares = {};
  var armazenamento;

  function estadoInicial() {
    return {
      etapaAtual: 0,
      respostas: {},
      pontuacoes: {},
      concluidas: {},
      canvases: {},
      pontos: 0,
      finalizada: false,
    };
  }

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function normalizarEstado(valor, base) {
    valor = objeto(valor);
    base.etapaAtual = Math.max(
      0,
      Math.min(TOTAL_ETAPAS - 1, Math.trunc(Number(valor.etapaAtual) || 0))
    );
    base.respostas = objeto(valor.respostas);
    base.pontuacoes = Object.keys(objeto(valor.pontuacoes)).reduce(function (resultado, chave) {
      var pontos = Number(valor.pontuacoes[chave]);
      if (Number.isFinite(pontos) && pontos >= 0) resultado[chave] = pontos;
      return resultado;
    }, {});
    base.concluidas = Array.isArray(valor.concluidas)
      ? valor.concluidas.reduce(function (resultado, indice) {
          var numero = Number(indice);
          if (Number.isInteger(numero) && numero >= 0 && numero < TOTAL_ETAPAS) {
            resultado[numero] = true;
          }
          return resultado;
        }, {})
      : Object.keys(objeto(valor.concluidas)).reduce(function (resultado, chave) {
          if (valor.concluidas[chave]) resultado[chave] = true;
          return resultado;
        }, {});
    base.canvases = Object.keys(objeto(valor.canvases)).reduce(function (resultado, chave) {
      var desenho = valor.canvases[chave];
      if (typeof desenho === 'string' && desenho.indexOf('data:image/') === 0) {
        resultado[chave] = desenho;
      }
      return resultado;
    }, {});
    base.pontos = Object.keys(base.pontuacoes).reduce(function (total, chave) {
      return total + base.pontuacoes[chave];
    }, 0);
    base.finalizada = Boolean(valor.finalizada) || base.etapaAtual === TOTAL_ETAPAS - 1;
    return base;
  }

  function obterArmazenamento() {
    if (!armazenamento) {
      armazenamento = window.ArmazenamentoRevisoes.criar({
        chave: CHAVE,
        padrao: estadoInicial(),
        normalizar: normalizarEstado,
      });
    }
    return armazenamento;
  }

  function carregar() {
    return obterArmazenamento().carregar();
  }

  function salvar() {
    estado.etapaAtual = etapaAtual;
    estado.pontos = Object.keys(estado.pontuacoes).reduce(function (total, chave) {
      return total + Number(estado.pontuacoes[chave] || 0);
    }, 0);
    estado = obterArmazenamento().salvar(estado);
    var pontosVisiveis = document.getElementById('mariana-pontos');
    if (pontosVisiveis) {
      pontosVisiveis.textContent = estado.pontos + ' pontos';
    }
    document.dispatchEvent(new CustomEvent('marianaprogressoalterado'));
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', {
        detail: { revisaoId: 'mariana-matematica-revisao-ampla' },
      })
    );
  }

  function normalizar(valor) {
    return String(valor == null ? '' : valor)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  function respostaAceita(valor, respostas) {
    var normalizada = normalizar(valor);
    return [].concat(respostas).some(function (resposta) {
      return normalizar(resposta) === normalizada;
    });
  }

  function icone(nome, alt) {
    return (
      '<img class="icone-etapa" src="../assets/objetos_escolares/' +
      nome +
      '" alt="' +
      (alt || '') +
      '">'
    );
  }

  function opcoes(perguntas) {
    return perguntas
      .map(function (pergunta, indicePergunta) {
        return (
          '<fieldset class="questao-mariana" data-questao="' +
          indicePergunta +
          '">' +
          '<legend>' +
          pergunta.pergunta +
          '</legend><div class="opcoes-mariana">' +
          pergunta.opcoes
            .map(function (opcao) {
              return (
                '<button type="button" class="opcao-mariana" data-resposta="' +
                opcao +
                '">' +
                opcao +
                '</button>'
              );
            })
            .join('') +
          '</div></fieldset>'
        );
      })
      .join('');
  }

  function campos(perguntas) {
    return (
      '<div class="lista-campos-mariana">' +
      perguntas
        .map(function (pergunta, indice) {
          return (
            '<label class="campo-mariana"><span>' +
            pergunta.pergunta +
            '</span>' +
            '<input type="' +
            (pergunta.tipo || 'text') +
            '" inputmode="' +
            (pergunta.tipo === 'number' ? 'numeric' : 'text') +
            '" data-campo="' +
            indice +
            '" autocomplete="off"></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function cabecalho(titulo, explicacao, visual) {
    return (
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Matemática da Mariana</p><h1 id="mariana-titulo-etapa">' +
      titulo +
      '</h1><p class="explicacao-mariana">' +
      explicacao +
      '</p></div>' +
      (visual || '') +
      '</div><div class="atividade-mariana">'
    );
  }

  function rodapeAtividade(corrigivel, extra) {
    return (
      (extra || '') +
      '<div class="acoes-atividade-mariana">' +
      (corrigivel
        ? '<button class="botao-principal botao-grande" type="button" data-conferir>Conferir</button>'
        : '') +
      '<div class="retorno retorno-mariana" role="status" aria-live="polite"></div></div></div></article>'
    );
  }

  function svgSolido(tipo) {
    var desenhos = {
      cubo: '<svg viewBox="0 0 120 100" aria-label="cubo"><path d="M30 28 65 12 98 30 62 48Z" fill="#b9a7ff"/><path d="M30 28v42l32 18V48Z" fill="#8368df"/><path d="M62 48v40l36-18V30Z" fill="#6546c4"/></svg>',
      bloco:
        '<svg viewBox="0 0 140 90" aria-label="paralelepípedo"><path d="M20 32 75 10 122 28 66 51Z" fill="#ffd98b"/><path d="M20 32v38l46 16V51Z" fill="#e8a945"/><path d="M66 51v35l56-18V28Z" fill="#cf8630"/></svg>',
      piramide:
        '<svg viewBox="0 0 120 100" aria-label="pirâmide"><path d="m60 8 48 76H15Z" fill="#ffb4cb"/><path d="m60 8 10 76h38Z" fill="#dd6592"/><path d="m15 84 55-15 38 15Z" fill="#f08aaf"/></svg>',
      cilindro:
        '<svg viewBox="0 0 100 110" aria-label="cilindro"><ellipse cx="50" cy="20" rx="32" ry="14" fill="#89daf5"/><path d="M18 20v64c0 18 64 18 64 0V20" fill="#5ec7f2"/><ellipse cx="50" cy="84" rx="32" ry="14" fill="#42a9d0"/></svg>',
      cone: '<svg viewBox="0 0 100 110" aria-label="cone"><path d="M50 8 15 88h70Z" fill="#ffd65a"/><ellipse cx="50" cy="88" rx="35" ry="13" fill="#e9ae2c"/></svg>',
      esfera:
        '<svg viewBox="0 0 100 100" aria-label="esfera"><defs><radialGradient id="g"><stop stop-color="#fff"/><stop offset=".3" stop-color="#ff9fc2"/><stop offset="1" stop-color="#d94f86"/></radialGradient></defs><circle cx="50" cy="50" r="39" fill="url(#g)"/></svg>',
    };
    return '<div class="solido-visual">' + desenhos[tipo] + '</div>';
  }

  var etapas = [
    {
      titulo: 'Matemática da Mariana',
      explicacao: 'Subtração, dezena, números até 19, ordem, pares e ímpares e geometria.',
      tipo: 'apresentacao',
      render: function () {
        return (
          cabecalho(this.titulo, 'Vamos revisar brincando!', icone('calculator.svg', '')) +
          '<div class="blocos-revisao">' +
          ['Subtração', 'Dezena', 'Números até 19', 'Ordinais', 'Pares e ímpares', 'Geometria']
            .map(function (item, indice) {
              return '<span class="bloco-revisao bloco-' + indice + '">' + item + '</span>';
            })
            .join('') +
          '</div><button class="botao-principal botao-gigante" type="button" data-comecar>Começar revisão</button>' +
          rodapeAtividade(false)
        );
      },
    },
    {
      titulo: 'Subtrair é tirar',
      explicacao: 'Subtrair é tirar uma quantidade de outra.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'Havia 8 bolas. 3 foram guardadas. Quantas ficaram?',
          opcoes: ['4', '5', '6'],
          resposta: '5',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ball.svg', '')) +
          '<div class="exemplo-grande"><span>🐱🐱🐱🐱🐱🐱</span><b>6 - 2 = 4</b><small>Dois gatinhos saíram.</small></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Problemas de subtração',
      explicacao: 'Leia com calma e descubra quanto sobrou.',
      tipo: 'campos',
      perguntas: [
        { pergunta: '9 adesivos - 4 dados para Alice =', resposta: ['5'], tipo: 'number' },
        { pergunta: '7 lápis - 2 quebrados =', resposta: ['5'], tipo: 'number' },
        { pergunta: '10 frutas - 5 comidas =', resposta: ['5'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('pencil.svg', '')) +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Subtração com troco',
      explicacao: 'O troco é o dinheiro que volta depois de uma compra.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'Um gibi custa 4 reais. Lucas pagou 5 reais. Qual é o troco?',
          opcoes: ['1 real', '2 reais', '3 reais'],
          resposta: '1 real',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('book.svg', '')) +
          '<div class="dinheiro-visual"><span>R$ 5</span><b>-</b><span>R$ 4</span><b>= ?</b></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Quanto a mais?',
      explicacao: 'Para comparar duas quantidades, podemos usar a subtração.',
      tipo: 'campos',
      perguntas: [
        {
          pergunta: 'Isabela fez 8 pontos e Mário fez 5. Quantos pontos Isabela fez a mais?',
          resposta: ['3'],
          tipo: 'number',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ball.svg', '')) +
          '<div class="placar"><span>Isabela <b>8</b></span><span>Mário <b>5</b></span></div>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Operações inversas',
      explicacao: 'A adição junta. A subtração tira. Uma pode desfazer a outra.',
      tipo: 'campos',
      perguntas: [
        { pergunta: '5 + 2 = 7, então 7 - 2 =', resposta: ['5'], tipo: 'number' },
        { pergunta: '3 + 4 = 7, então 7 - 4 =', resposta: ['3'], tipo: 'number' },
        { pergunta: '6 + 1 = 7, então 7 - 1 =', resposta: ['6'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('calculator.svg', '')) +
          '<div class="operacoes-inversas"><b>4 + 2 = 6</b><span>↔</span><b>6 - 2 = 4</b></div>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Sequências que aumentam',
      explicacao: 'Descubra a regra e complete os números que faltam.',
      tipo: 'campos',
      perguntas: [
        { pergunta: '2, 4, 6, __', resposta: ['8'], tipo: 'number' },
        { pergunta: '2, 4, 6, 8, __', resposta: ['10'], tipo: 'number' },
        { pergunta: '2, 4, 6, 8, 10, __', resposta: ['12'], tipo: 'number' },
        { pergunta: '5, 10, 15, __', resposta: ['20'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ruler.svg', '')) +
          '<div class="dica-regra">Regra: os números estão aumentando.</div>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Sequências que diminuem',
      explicacao: 'Agora os números ficam menores a cada passo.',
      tipo: 'campos',
      perguntas: [
        { pergunta: '20, 18, 16, __', resposta: ['14'], tipo: 'number' },
        { pergunta: '20, 18, 16, 14, __', resposta: ['12'], tipo: 'number' },
        { pergunta: '30, 25, 20, __', resposta: ['15'], tipo: 'number' },
        { pergunta: '30, 25, 20, 15, __', resposta: ['10'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ruler.svg', '')) +
          '<button class="botao-dica" type="button" data-dica>💡 Dica</button><div class="dica-oculta" hidden>Veja se os números estão diminuindo.</div>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Máquina de números',
      explicacao: 'O número entra, a máquina segue a regra e mostra uma saída.',
      tipo: 'campos',
      perguntas: [
        { pergunta: 'Entrada 4 → regra +3 → saída', resposta: ['7'], tipo: 'number' },
        { pergunta: 'Entrada 9 → regra -2 → saída', resposta: ['7'], tipo: 'number' },
        { pergunta: 'Entrada 10 → regra -5 → saída', resposta: ['5'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('computer.svg', '')) +
          '<div class="maquina-visual"><span>ENTRA</span><strong>⚙ + / - ⚙</strong><span>SAI</span></div>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Gráfico de barras',
      explicacao: 'O gráfico ajuda a comparar informações.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'Quem doou mais agasalhos?',
          opcoes: ['Mário', 'Isabela', 'Ana'],
          resposta: 'Isabela',
        },
        {
          pergunta: 'Quem doou menos agasalhos?',
          opcoes: ['Mário', 'Isabela', 'Ana'],
          resposta: 'Mário',
        },
        { pergunta: 'Quantos agasalhos Ana doou?', opcoes: ['3', '4', '7'], resposta: '4' },
        {
          pergunta: 'Quantos Isabela doou a mais que Mário?',
          opcoes: ['3', '4', '5'],
          resposta: '4',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('blackboard.svg', '')) +
          '<div class="grafico-mariana" aria-label="Gráfico: Mário 3, Isabela 7, Ana 4">' +
          '<div><b>7</b><span style="height:42%">Mário<br>3</span></div>' +
          '<div><b>7</b><span style="height:98%">Isabela<br>7</span></div>' +
          '<div><b>7</b><span style="height:56%">Ana<br>4</span></div></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Dezena e unidade',
      explicacao: '10 unidades formam 1 dezena.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: '10 unidades formam:',
          opcoes: ['1 dezena', '1 unidade', '1 centena'],
          resposta: '1 dezena',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('square.svg', '')) +
          '<div class="dezena-visual"><div>' +
          Array(10).fill('<i></i>').join('') +
          '</div><strong>= 1 dezena</strong></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Quadro de ordens',
      explicacao: 'D é dezena. U é unidade.',
      tipo: 'campos',
      perguntas: [
        { pergunta: '12 = 1 dezena e __ unidades', resposta: ['2'], tipo: 'number' },
        { pergunta: '14 = 1 dezena e __ unidades', resposta: ['4'], tipo: 'number' },
        { pergunta: '18 = 1 dezena e __ unidades', resposta: ['8'], tipo: 'number' },
        { pergunta: '19 = 1 dezena e __ unidades', resposta: ['9'], tipo: 'number' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('calculator.svg', '')) +
          '<table class="quadro-ordens"><tr><th>D</th><th>U</th></tr><tr><td>1</td><td>4</td></tr></table>' +
          '<p class="exemplo-centro">14 tem 1 dezena e 4 unidades.</p>' +
          campos(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Números por extenso',
      explicacao: 'Ligue cada número ao nome correto. São duas rodadas.',
      tipo: 'pares',
      pares: [
        ['10', 'dez'],
        ['11', 'onze'],
        ['12', 'doze'],
        ['13', 'treze'],
        ['14', 'catorze'],
        ['15', 'quinze'],
        ['16', 'dezesseis'],
        ['17', 'dezessete'],
        ['18', 'dezoito'],
        ['19', 'dezenove'],
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('notebook.svg', '')) +
          '<div class="numeros-extenso">' +
          this.pares
            .map(function (par) {
              return '<span><b>' + par[0] + '</b>' + par[1] + '</span>';
            })
            .join('') +
          '</div><div class="ligar-pares" data-pares></div>' +
          rodapeAtividade(
            true,
            '<button class="botao-secundario" type="button" data-trocar-rodada>Trocar rodada</button>'
          )
        );
      },
    },
    {
      titulo: 'Crescente e decrescente',
      explicacao: 'Arraste os cartões para montar cada ordem.',
      tipo: 'ordem',
      grupos: [
        { titulo: 'Crescente', tokens: ['14', '12', '13'], resposta: ['12', '13', '14'] },
        { titulo: 'Crescente', tokens: ['18', '16', '17'], resposta: ['16', '17', '18'] },
        { titulo: 'Decrescente', tokens: ['13', '11', '12'], resposta: ['13', '12', '11'] },
        { titulo: 'Decrescente', tokens: ['16', '18', '17'], resposta: ['18', '17', '16'] },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ruler.svg', '')) +
          '<div class="grupos-ordem">' +
          this.grupos
            .map(function (grupo, indice) {
              return (
                '<div class="grupo-ordem" data-grupo="' +
                indice +
                '"><strong>' +
                grupo.titulo +
                '</strong><div class="tokens-arrastar">' +
                grupo.tokens
                  .map(function (token) {
                    return (
                      '<button draggable="true" type="button" class="token-arrastar" data-token="' +
                      token +
                      '">' +
                      token +
                      '</button>'
                    );
                  })
                  .join('') +
                '</div><div class="destino-ordem" data-destino></div></div>'
              );
            })
            .join('') +
          '</div>' +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Números ordinais',
      explicacao: 'Os ordinais indicam posição: primeiro, segundo, terceiro...',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'Qual carrinho está em 1º lugar?',
          opcoes: ['vermelho', 'azul', 'verde'],
          resposta: 'vermelho',
        },
        {
          pergunta: 'Qual carrinho está em 3º lugar?',
          opcoes: ['azul', 'verde', 'roxo'],
          resposta: 'verde',
        },
        {
          pergunta: 'Qual carrinho está em 6º lugar?',
          opcoes: ['amarelo', 'rosa', 'roxo'],
          resposta: 'roxo',
        },
      ],
      render: function () {
        var cores = ['vermelho', 'azul', 'verde', 'amarelo', 'rosa', 'roxo'];
        return (
          cabecalho(this.titulo, this.explicacao, icone('car.svg', '')) +
          '<div class="corrida-mariana">' +
          cores
            .map(function (cor, indice) {
              return '<span class="' + cor + '">🚗<b>' + (indice + 1) + 'º</b></span>';
            })
            .join('') +
          '</div><div class="tabela-ordinal"><span>1º primeiro</span><span>2º segundo</span><span>3º terceiro</span><span>4º quarto</span><span>5º quinto</span><span>10º décimo</span></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Antes e depois',
      explicacao: 'Descubra qual posição vem antes e qual vem depois.',
      tipo: 'opcoes',
      perguntas: [
        { pergunta: 'Antes de 8º vem:', opcoes: ['7º', '9º', '10º'], resposta: '7º' },
        { pergunta: 'Depois de 8º vem:', opcoes: ['6º', '9º', '5º'], resposta: '9º' },
        { pergunta: 'Antes de 12º vem:', opcoes: ['10º', '11º', '13º'], resposta: '11º' },
        { pergunta: 'Depois de 12º vem:', opcoes: ['11º', '13º', '14º'], resposta: '13º' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('clock.svg', '')) +
          '<div class="faixa-ordinal">7º <b>8º</b> 9º &nbsp;&nbsp; 11º <b>12º</b> 13º</div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Pares e ímpares',
      explicacao: 'Par forma duplas sem sobrar. Ímpar sobra 1.',
      tipo: 'classificar',
      tokens: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
      resposta: { par: ['10', '12', '14', '16', '18'], impar: ['11', '13', '15', '17', '19'] },
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('paper-clips.svg', '')) +
          '<div class="lembrete-par"><span>PARES: 0, 2, 4, 6, 8...</span><span>ÍMPARES: 1, 3, 5, 7, 9...</span></div>' +
          '<div class="banco-classificar">' +
          this.tokens
            .map(function (token) {
              return (
                '<button draggable="true" type="button" class="token-arrastar" data-token="' +
                token +
                '">' +
                token +
                '</button>'
              );
            })
            .join('') +
          '</div><div class="caixas-classificar"><div data-caixa="par"><strong>PAR</strong></div><div data-caixa="impar"><strong>ÍMPAR</strong></div></div>' +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Formando pares',
      explicacao: 'Marque se cada grupo é par ou ímpar.',
      tipo: 'opcoes',
      perguntas: [
        { pergunta: '⚽⚽⚽⚽⚽⚽ — 6 bolas', opcoes: ['par', 'ímpar'], resposta: 'par' },
        { pergunta: '✏️✏️✏️✏️✏️✏️✏️ — 7 lápis', opcoes: ['par', 'ímpar'], resposta: 'ímpar' },
        { pergunta: '🧦 x 10 — 10 meias', opcoes: ['par', 'ímpar'], resposta: 'par' },
        { pergunta: '⭐ x 9 — 9 estrelas', opcoes: ['par', 'ímpar'], resposta: 'ímpar' },
        { pergunta: '🍎 x 12 — 12 frutas', opcoes: ['par', 'ímpar'], resposta: 'par' },
        { pergunta: '🎲 x 15 — 15 dados', opcoes: ['par', 'ímpar'], resposta: 'ímpar' },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('ball.svg', '')) +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Sólidos geométricos',
      explicacao: 'Objetos do dia a dia lembram figuras geométricas não planas.',
      tipo: 'pares',
      pares: [
        ['dado', 'cubo'],
        ['caixa', 'paralelepípedo'],
        ['chapéu de festa', 'cone'],
        ['lata', 'cilindro'],
        ['bola', 'esfera'],
        ['pirâmide de brinquedo', 'pirâmide'],
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('model.svg', '')) +
          '<div class="grade-solidos">' +
          '<div>' +
          svgSolido('cubo') +
          '<b>Cubo</b><small>dado ou bloco</small></div>' +
          '<div>' +
          svgSolido('bloco') +
          '<b>Paralelepípedo</b><small>caixa ou tijolo</small></div>' +
          '<div>' +
          svgSolido('piramide') +
          '<b>Pirâmide</b><small>brinquedo</small></div>' +
          '<div>' +
          svgSolido('cilindro') +
          '<b>Cilindro</b><small>lata ou copo</small></div>' +
          '<div>' +
          svgSolido('cone') +
          '<b>Cone</b><small>chapéu ou casquinha</small></div>' +
          '<div>' +
          svgSolido('esfera') +
          '<b>Esfera</b><small>bola ou globo</small></div></div>' +
          '<div class="ligar-pares" data-pares></div>' +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Partes das figuras',
      explicacao:
        'Face é plana, vértice é pontinha, aresta parece uma linha e base apoia a figura.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'A face é uma parte...',
          opcoes: ['plana', 'redonda', 'invisível'],
          resposta: 'plana',
        },
        {
          pergunta: 'O vértice parece uma...',
          opcoes: ['pontinha', 'janela', 'cor'],
          resposta: 'pontinha',
        },
        {
          pergunta: 'A aresta parece uma...',
          opcoes: ['linha', 'bola', 'nuvem'],
          resposta: 'linha',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, svgSolido('cubo')) +
          '<div class="partes-figura"><span>Face: parte plana</span><span>Vértice: pontinha</span><span>Aresta: linha</span><span>Base: onde se apoia</span></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Vistas dos objetos',
      explicacao: 'Podemos ver de frente, de cima ou de lado.',
      tipo: 'canvas',
      canvasId: 'vistas',
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, svgSolido('cone')) +
          '<div class="desafios-canvas"><span>Desenhe a vista de cima de um cone.</span><span>Desenhe a vista de frente de uma esfera.</span></div>' +
          ferramentasCanvas() +
          '<canvas class="canvas-mariana" id="canvas-mariana-vistas" width="900" height="390" tabindex="0" aria-label="Área para desenhar vistas geométricas">Área de desenho das vistas geométricas.</canvas>' +
          rodapeAtividade(
            false,
            '<button class="botao-principal" type="button" data-salvar-canvas>Salvar desenho</button>'
          )
        );
      },
    },
    {
      titulo: 'Moldes e planificações',
      explicacao: 'Um molde plano pode ser dobrado para montar uma figura.',
      tipo: 'opcoes',
      perguntas: [
        {
          pergunta: 'Qual molde pode formar uma pirâmide?',
          opcoes: ['Molde A', 'Molde B', 'Molde C'],
          resposta: 'Molde A',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('scissors.svg', '')) +
          '<div class="moldes">' +
          '<div><b>Molde A</b><svg viewBox="0 0 150 120"><rect x="55" y="42" width="40" height="40" fill="#ffd65a"/><path d="M55 42 75 5 95 42M55 82 75 117 95 82M55 42 18 62 55 82M95 42 132 62 95 82" fill="#ff9fbd" stroke="#7d5bc7" stroke-width="3"/></svg></div>' +
          '<div><b>Molde B</b><svg viewBox="0 0 150 120"><g fill="#91d8ef" stroke="#4d9cbb" stroke-width="3"><rect x="12" y="40" width="38" height="38"/><rect x="51" y="40" width="38" height="38"/><rect x="90" y="40" width="38" height="38"/></g></svg></div>' +
          '<div><b>Molde C</b><svg viewBox="0 0 150 120"><rect x="40" y="25" width="70" height="70" fill="#b9e7b7"/><circle cx="25" cy="60" r="20" fill="#71d6a5"/><circle cx="125" cy="60" r="20" fill="#71d6a5"/></svg></div></div>' +
          opcoes(this.perguntas) +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Mini simulado',
      explicacao: 'Dez desafios misturados. Faça com calma!',
      tipo: 'opcoes',
      perguntas: [
        { pergunta: '8 - 3 =', opcoes: ['4', '5', '6'], resposta: '5' },
        { pergunta: '10 - 4 =', opcoes: ['5', '6', '7'], resposta: '6' },
        { pergunta: '14 = 1 dezena e quantas unidades?', opcoes: ['1', '4', '14'], resposta: '4' },
        {
          pergunta: '18 por extenso é:',
          opcoes: ['dezessete', 'dezoito', 'dezenove'],
          resposta: 'dezoito',
        },
        {
          pergunta: 'Ordem crescente de 15, 13, 14:',
          opcoes: ['13, 14, 15', '15, 14, 13', '14, 13, 15'],
          resposta: '13, 14, 15',
        },
        {
          pergunta: '2º por extenso é:',
          opcoes: ['primeiro', 'segundo', 'terceiro'],
          resposta: 'segundo',
        },
        { pergunta: '16 é:', opcoes: ['par', 'ímpar'], resposta: 'par' },
        { pergunta: '17 é:', opcoes: ['par', 'ímpar'], resposta: 'ímpar' },
        { pergunta: 'A bola lembra:', opcoes: ['cubo', 'esfera', 'cone'], resposta: 'esfera' },
        {
          pergunta: 'A lata lembra:',
          opcoes: ['cilindro', 'pirâmide', 'esfera'],
          resposta: 'cilindro',
        },
      ],
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('notebook.svg', '')) +
          '<div class="simulado">' +
          opcoes(this.perguntas) +
          '</div>' +
          rodapeAtividade(true)
        );
      },
    },
    {
      titulo: 'Resolva do seu jeito',
      explicacao: 'Use a caneta para resolver uma continha ou desenhar uma figura geométrica.',
      tipo: 'canvas',
      canvasId: 'livre',
      render: function () {
        return (
          cabecalho(this.titulo, this.explicacao, icone('paintbrush.svg', '')) +
          ferramentasCanvas() +
          '<canvas class="canvas-mariana canvas-grande" id="canvas-mariana-livre" width="900" height="470" tabindex="0" aria-label="Área livre para resolver e desenhar">Área livre para resolver e desenhar.</canvas>' +
          rodapeAtividade(
            false,
            '<button class="botao-principal" type="button" data-salvar-canvas>Salvar atividade</button>'
          )
        );
      },
    },
    {
      titulo: 'Parabéns, Mariana!',
      explicacao: 'Você chegou ao fim da revisão ampla de Matemática.',
      tipo: 'final',
      render: function () {
        var concluidas = Object.keys(estado.concluidas).filter(function (chave) {
          return estado.concluidas[chave];
        }).length;
        return (
          cabecalho(this.titulo, this.explicacao, icone('colored-pencils.svg', '')) +
          '<div class="resultado-final"><span class="trofeu">★</span><h2>' +
          estado.pontos +
          ' pontos</h2><p>' +
          concluidas +
          ' atividades registradas</p>' +
          '<p class="mensagem-motivadora">' +
          mensagemFinal(estado.pontos) +
          '</p>' +
          '<div class="botoes-final"><button class="botao-secundario botao-grande" type="button" data-refazer>Refazer revisão</button>' +
          '<button class="botao-principal botao-grande" type="button" data-final-inicio>Voltar ao início</button></div></div>' +
          rodapeAtividade(false)
        );
      },
    },
  ];

  function ferramentasCanvas() {
    return (
      '<div class="ferramentas-desenho ferramentas-mariana">' +
      '<label>Cor <input type="color" value="#222222" data-canvas-cor aria-label="Cor do traço"></label>' +
      '<label>Traço <input type="range" min="2" max="20" value="5" data-canvas-espessura aria-label="Espessura do traço"></label>' +
      '<button class="botao-secundario" type="button" data-canvas-desfazer>Desfazer</button>' +
      '<button class="botao-secundario" type="button" data-canvas-limpar>Limpar</button></div>'
    );
  }

  function mensagemFinal(pontos) {
    if (pontos >= 55) {
      return 'Excelente! Você mostrou muita atenção e coragem matemática!';
    }
    if (pontos >= 35) {
      return 'Muito bem! Cada tentativa deixou seu pensamento mais forte.';
    }
    return 'Bom trabalho! Revisar com calma ajuda a aprender cada vez mais.';
  }

  function guardarRespostaEtapa(chave, valor) {
    estado.respostas[chave] = valor;
    salvar();
  }

  function restaurarRespostas(indice, etapa) {
    var resposta = estado.respostas[indice] || {};
    if (etapa.tipo === 'opcoes') {
      Object.keys(resposta).forEach(function (questao) {
        var botao = conteudo.querySelector(
          '[data-questao="' + questao + '"] [data-resposta="' + CSS.escape(resposta[questao]) + '"]'
        );
        if (botao) {
          botao.classList.add('selecionada');
          botao.setAttribute('aria-pressed', 'true');
        }
      });
    } else if (etapa.tipo === 'campos') {
      conteudo.querySelectorAll('[data-campo]').forEach(function (input) {
        if (resposta[input.dataset.campo] != null) {
          input.value = resposta[input.dataset.campo];
        }
      });
    }
  }

  function pontuar(indice, pontos, maximo) {
    estado.pontuacoes[indice] = pontos;
    estado.concluidas[indice] = true;
    salvar();
    var retorno = conteudo.querySelector('.retorno-mariana');
    retorno.className =
      'retorno retorno-mariana ' + (pontos === maximo ? 'sucesso' : 'tente-novamente');
    retorno.textContent =
      pontos === maximo
        ? '✓ Muito bem! Você acertou tudo nesta etapa.'
        : 'Você acertou ' + pontos + ' de ' + maximo + '. Observe as dicas e tente novamente.';
  }

  function corrigirEtapa(indice, etapa) {
    var pontos = 0;
    var maximo = 0;

    if (etapa.tipo === 'opcoes') {
      var respostas = estado.respostas[indice] || {};
      etapa.perguntas.forEach(function (pergunta, questao) {
        maximo += 1;
        var fieldset = conteudo.querySelector('[data-questao="' + questao + '"]');
        var marcada = respostas[questao];
        fieldset.querySelectorAll('.opcao-mariana').forEach(function (botao) {
          botao.classList.remove('correta', 'incorreta');
          if (botao.dataset.resposta === pergunta.resposta) {
            botao.classList.add('correta');
          } else if (botao.dataset.resposta === marcada) {
            botao.classList.add('incorreta');
          }
        });
        if (marcada === pergunta.resposta) {
          pontos += 1;
        }
      });
    } else if (etapa.tipo === 'campos') {
      var valores = {};
      conteudo.querySelectorAll('[data-campo]').forEach(function (input) {
        var pergunta = etapa.perguntas[Number(input.dataset.campo)];
        var correta = respostaAceita(input.value, pergunta.resposta);
        valores[input.dataset.campo] = input.value;
        input.classList.toggle('campo-correto', correta);
        input.classList.toggle('campo-incorreto', !correta);
        maximo += 1;
        if (correta) {
          pontos += 1;
        }
      });
      guardarRespostaEtapa(indice, valores);
    } else if (etapa.tipo === 'pares') {
      var paresEstado = (estado.respostas[indice] || {}).pares || {};
      etapa.pares.forEach(function (par) {
        maximo += 1;
        if (paresEstado[par[0]] === par[1]) {
          pontos += 1;
        }
      });
    } else if (etapa.tipo === 'ordem') {
      var ordens = (estado.respostas[indice] || {}).ordens || {};
      etapa.grupos.forEach(function (grupo, grupoIndice) {
        maximo += 1;
        if (JSON.stringify(ordens[grupoIndice] || []) === JSON.stringify(grupo.resposta)) {
          pontos += 1;
        }
      });
    } else if (etapa.tipo === 'classificar') {
      var caixas = (estado.respostas[indice] || {}).caixas || {};
      etapa.tokens.forEach(function (token) {
        maximo += 1;
        var caixaCorreta = etapa.resposta.par.indexOf(token) >= 0 ? 'par' : 'impar';
        if (caixas[token] === caixaCorreta) {
          pontos += 1;
        }
      });
    }

    pontuar(indice, pontos, maximo);
  }

  function configurarOpcoes(indice) {
    conteudo.querySelectorAll('.opcao-mariana').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var fieldset = botao.closest('[data-questao]');
        var questao = fieldset.dataset.questao;
        var respostas = estado.respostas[indice] || {};
        respostas[questao] = botao.dataset.resposta;
        fieldset.querySelectorAll('.opcao-mariana').forEach(function (outra) {
          outra.classList.toggle('selecionada', outra === botao);
          outra.setAttribute('aria-pressed', String(outra === botao));
        });
        guardarRespostaEtapa(indice, respostas);
      });
    });
  }

  function configurarCampos(indice) {
    conteudo.querySelectorAll('[data-campo]').forEach(function (input) {
      input.addEventListener('input', function () {
        var respostas = estado.respostas[indice] || {};
        respostas[input.dataset.campo] = input.value;
        guardarRespostaEtapa(indice, respostas);
      });
    });
  }

  function embaralhar(lista) {
    return lista.slice().sort(function (a, b) {
      return a.localeCompare(b) % 2 || a.length - b.length;
    });
  }

  function montarPares(indice, etapa) {
    var recipiente = conteudo.querySelector('[data-pares]');
    var inicio = etapa.pares.length > 6 ? ((estado.respostas[indice] || {}).rodada || 0) * 5 : 0;
    var paresRodada = etapa.pares.slice(
      inicio,
      etapa.pares.length > 6 ? inicio + 5 : etapa.pares.length
    );
    var direitas = embaralhar(
      paresRodada.map(function (par) {
        return par[1];
      })
    );
    recipiente.innerHTML =
      '<div class="coluna-pares">' +
      paresRodada
        .map(function (par) {
          return (
            '<button type="button" data-lado="esquerdo" data-valor="' +
            par[0] +
            '">' +
            par[0] +
            '</button>'
          );
        })
        .join('') +
      '</div><div class="coluna-pares">' +
      direitas
        .map(function (valor) {
          return (
            '<button type="button" data-lado="direito" data-valor="' +
            valor +
            '">' +
            valor +
            '</button>'
          );
        })
        .join('') +
      '</div>';

    selecoesPares[indice] = {};
    recipiente.querySelectorAll('button').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var selecao = selecoesPares[indice];
        selecao[botao.dataset.lado] = botao.dataset.valor;
        recipiente
          .querySelectorAll('[data-lado="' + botao.dataset.lado + '"]')
          .forEach(function (outro) {
            outro.classList.toggle('selecionado-par', outro === botao);
          });
        if (selecao.esquerdo && selecao.direito) {
          var resposta = estado.respostas[indice] || {};
          resposta.pares = resposta.pares || {};
          resposta.pares[selecao.esquerdo] = selecao.direito;
          guardarRespostaEtapa(indice, resposta);
          recipiente
            .querySelector(
              '[data-lado="esquerdo"][data-valor="' + CSS.escape(selecao.esquerdo) + '"]'
            )
            .classList.add('par-formado');
          recipiente
            .querySelector(
              '[data-lado="direito"][data-valor="' + CSS.escape(selecao.direito) + '"]'
            )
            .classList.add('par-formado');
          selecoesPares[indice] = {};
        }
      });
    });
  }

  function configurarOrdem(indice) {
    var resposta = estado.respostas[indice] || { ordens: {} };
    resposta.ordens = resposta.ordens || {};

    conteudo.querySelectorAll('.grupo-ordem').forEach(function (grupo) {
      var grupoIndice = grupo.dataset.grupo;
      var destino = grupo.querySelector('[data-destino]');

      function adicionar(token) {
        resposta.ordens[grupoIndice] = resposta.ordens[grupoIndice] || [];
        if (resposta.ordens[grupoIndice].indexOf(token) < 0) {
          resposta.ordens[grupoIndice].push(token);
          var botao = document.createElement('button');
          botao.type = 'button';
          botao.className = 'token-arrastar';
          botao.textContent = token;
          botao.addEventListener('click', function () {
            resposta.ordens[grupoIndice] = resposta.ordens[grupoIndice].filter(function (item) {
              return item !== token;
            });
            botao.remove();
            guardarRespostaEtapa(indice, resposta);
          });
          destino.appendChild(botao);
          guardarRespostaEtapa(indice, resposta);
        }
      }

      grupo.querySelectorAll('[data-token]').forEach(function (token) {
        token.addEventListener('dragstart', function (evento) {
          evento.dataTransfer.setData('text/plain', token.dataset.token);
        });
        token.addEventListener('click', function () {
          adicionar(token.dataset.token);
        });
      });
      destino.addEventListener('dragover', function (evento) {
        evento.preventDefault();
      });
      destino.addEventListener('drop', function (evento) {
        evento.preventDefault();
        adicionar(evento.dataTransfer.getData('text/plain'));
      });
    });
  }

  function configurarClassificacao(indice) {
    var resposta = estado.respostas[indice] || { caixas: {} };
    resposta.caixas = resposta.caixas || {};
    var tokenSelecionado = null;

    function colocar(token, caixa) {
      resposta.caixas[token] = caixa;
      var botao = conteudo.querySelector('.banco-classificar [data-token="' + token + '"]');
      var destino = conteudo.querySelector('[data-caixa="' + caixa + '"]');
      if (botao && destino) {
        destino.appendChild(botao);
        botao.classList.remove('selecionado-arrastar');
      }
      guardarRespostaEtapa(indice, resposta);
    }

    conteudo.querySelectorAll('[data-token]').forEach(function (token) {
      token.addEventListener('dragstart', function (evento) {
        evento.dataTransfer.setData('text/plain', token.dataset.token);
      });
      token.addEventListener('click', function () {
        tokenSelecionado = token.dataset.token;
        conteudo.querySelectorAll('[data-token]').forEach(function (outro) {
          outro.classList.toggle('selecionado-arrastar', outro === token);
        });
      });
    });
    conteudo.querySelectorAll('[data-caixa]').forEach(function (caixa) {
      caixa.addEventListener('dragover', function (evento) {
        evento.preventDefault();
      });
      caixa.addEventListener('drop', function (evento) {
        evento.preventDefault();
        colocar(evento.dataTransfer.getData('text/plain'), caixa.dataset.caixa);
      });
      caixa.addEventListener('click', function () {
        if (tokenSelecionado) {
          colocar(tokenSelecionado, caixa.dataset.caixa);
          tokenSelecionado = null;
        }
      });
    });
  }

  function configurarCanvas(indice, etapa) {
    var canvas = conteudo.querySelector('canvas');
    window.DesenhoRevisoes.preparar(canvas, {
      dadosIniciais: estado.canvases[etapa.canvasId],
      aoAlterar: function (dados) {
        if (dados) {
          estado.canvases[etapa.canvasId] = dados;
          estado.concluidas[indice] = true;
        } else {
          delete estado.canvases[etapa.canvasId];
          delete estado.concluidas[indice];
        }
        salvar();
      },
      aoSalvar: function (dados) {
        var retorno = conteudo.querySelector('.retorno-mariana');
        retorno.className = 'retorno retorno-mariana ' + (dados ? 'sucesso' : 'tente-novamente');
        retorno.textContent = dados
          ? '✓ Desenho salvo neste navegador.'
          : 'Faça um desenho antes de salvar.';
      },
    });
  }

  function configurarEtapa(indice, etapa) {
    restaurarRespostas(indice, etapa);

    if (etapa.tipo === 'opcoes') {
      configurarOpcoes(indice);
    } else if (etapa.tipo === 'campos') {
      configurarCampos(indice);
    } else if (etapa.tipo === 'pares') {
      montarPares(indice, etapa);
      var trocar = conteudo.querySelector('[data-trocar-rodada]');
      if (trocar) {
        trocar.addEventListener('click', function () {
          var resposta = estado.respostas[indice] || {};
          resposta.rodada = resposta.rodada === 1 ? 0 : 1;
          guardarRespostaEtapa(indice, resposta);
          montarPares(indice, etapa);
        });
      }
    } else if (etapa.tipo === 'ordem') {
      configurarOrdem(indice);
    } else if (etapa.tipo === 'classificar') {
      configurarClassificacao(indice);
    } else if (etapa.tipo === 'canvas') {
      configurarCanvas(indice, etapa);
    }

    var conferir = conteudo.querySelector('[data-conferir]');
    if (conferir) {
      conferir.addEventListener('click', function () {
        corrigirEtapa(indice, etapa);
      });
    }
    var dica = conteudo.querySelector('[data-dica]');
    if (dica) {
      dica.addEventListener('click', function () {
        conteudo.querySelector('.dica-oculta').hidden = false;
      });
    }
    var comecar = conteudo.querySelector('[data-comecar]');
    if (comecar) {
      comecar.addEventListener('click', function () {
        irPara(1);
      });
    }
    var refazer = conteudo.querySelector('[data-refazer]');
    if (refazer) {
      refazer.addEventListener('click', function () {
        if (
          window.confirm('Recomeçar a revisão da Mariana? Os desenhos e respostas serão apagados.')
        ) {
          limparProgresso();
          irPara(0);
        }
      });
    }
    var inicio = conteudo.querySelector('[data-final-inicio]');
    if (inicio) {
      inicio.addEventListener('click', function () {
        document.getElementById('botao-inicio').click();
      });
    }
  }

  function atualizarBarra() {
    document.getElementById('mariana-contador-etapa').textContent =
      'Etapa ' + (etapaAtual + 1) + ' de ' + TOTAL_ETAPAS;
    document.getElementById('mariana-pontos').textContent = estado.pontos + ' pontos';
    document.getElementById('mariana-barra-preenchida').style.width =
      ((etapaAtual + 1) / TOTAL_ETAPAS) * 100 + '%';
    document
      .querySelector('.barra-progresso-mariana')
      .setAttribute('aria-valuenow', etapaAtual + 1);
    document.getElementById('mariana-voltar').disabled = etapaAtual === 0;
    document.getElementById('mariana-proxima').hidden = etapaAtual === TOTAL_ETAPAS - 1;
  }

  function renderizar() {
    var etapa = etapas[etapaAtual];
    window.DesenhoRevisoes.descartar(conteudo);
    conteudo.innerHTML = etapa.render();
    atualizarBarra();
    configurarEtapa(etapaAtual, etapa);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function irPara(indice) {
    etapaAtual = Math.max(0, Math.min(TOTAL_ETAPAS - 1, indice));
    if (etapaAtual === TOTAL_ETAPAS - 1) {
      estado.finalizada = true;
    }
    salvar();
    renderizar();
  }

  function abrir() {
    conteudo = document.getElementById('mariana-conteudo-etapa');
    estado = carregar();
    etapaAtual = Math.max(0, Math.min(TOTAL_ETAPAS - 1, Number(estado.etapaAtual) || 0));
    document.getElementById('mariana-voltar').onclick = function () {
      irPara(etapaAtual - 1);
    };
    document.getElementById('mariana-proxima').onclick = function () {
      irPara(etapaAtual + 1);
    };
    renderizar();
  }

  function limparProgresso() {
    obterArmazenamento().remover();
    estado = estadoInicial();
    etapaAtual = 0;
    if (conteudo) {
      renderizar();
    }
    document.dispatchEvent(new CustomEvent('marianaprogressoalterado'));
  }

  function obterEstado() {
    estado = estado || carregar();
    return estado;
  }

  window.RevisaoMatematicaMariana = {
    abrir: abrir,
    obterEstado: obterEstado,
    limparProgresso: limparProgresso,
    chave: CHAVE,
    totalEtapas: TOTAL_ETAPAS,
  };
})();
