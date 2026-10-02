(function () {
  'use strict';

  function opcao(pergunta, opcoes, resposta, extras) {
    return Object.assign(
      { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] },
      extras || {}
    );
  }
  function campo(pergunta, resposta, extras) {
    return Object.assign({ pergunta: pergunta, respostas: [resposta] }, extras || {});
  }
  function selecao(pergunta, opcoes, respostas) {
    return { tipo: 'selecao', pergunta: pergunta, opcoes: opcoes, respostas: respostas };
  }
  function questao(numero, bloco, titulo, instrucao, itens, dica, extras) {
    return Object.assign(
      {
        id: 'q' + String(numero).padStart(2, '0'),
        bloco: bloco,
        titulo: titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: 'Muito bem! Você concluiu a questão ' + numero + '.',
        opcoesReversiveis: true,
      },
      extras || {}
    );
  }
  function ditado(numero, titulo, respostas, dica, frase, acentoObrigatorio) {
    return questao(
      numero,
      'Ditado',
      titulo,
      frase
        ? 'Ouça e escreva a frase inteira. Use letra maiúscula e o sinal no fim.'
        : 'Ouça uma palavra por vez e escreva cada uma.',
      respostas.map(function (resposta, indice) {
        return campo((frase ? 'Frase ' : 'Palavra ') + (indice + 1), resposta, {
          fraseCompleta: Boolean(frase),
          maiusculasObrigatorias: Boolean(frase),
          acentuacaoObrigatoria: Boolean(acentoObrigatorio),
        });
      }),
      dica,
      {
        tipo: 'campos',
        ditado: true,
        unidadeDitado: frase ? 'frase' : 'palavra',
        cancelarAoTrocarCampo: true,
      }
    );
  }

  var textoFinal =
    'Uma surpresa no quintal\n\n' +
    'Na tarde de chuva, Lia colocou a mochila perto da janela. Dentro dela havia um lanche, uma chave e um livro. De repente, ela ouviu um barulho no quintal.\n\n' +
    'Lia chamou:\n— Mãe, o que caiu lá fora?\n\n' +
    'A mãe olhou pela janela e respondeu:\n— Foi só uma caixa vazia!\n\n' +
    'Lia sorriu, tomou leite em uma xícara e voltou a ler. Pouco depois, um coelho apareceu no caminho do jardim.';
  var imagem = 'assets/gramatica_alice_outubro_2026/';
  var questoes = [
    questao(
      1,
      'Pontuação',
      'Vírgula e ponto-final',
      'Leia e escolha a função de cada sinal.',
      [
        opcao(
          'Para que serve o ponto-final?',
          [
            'Mostrar que alguém fez uma pergunta.',
            'Mostrar que a frase terminou.',
            'Separar os itens de uma lista.',
          ],
          'Mostrar que a frase terminou.'
        ),
        opcao(
          'Na frase “Na mochila há lápis, borracha e cola.”, para que serve a vírgula?',
          ['Separar elementos de uma enumeração.', 'Mostrar uma pergunta.', 'Terminar a frase.'],
          'Separar elementos de uma enumeração.'
        ),
      ],
      'Pense se a frase continua ou se já terminou.',
      {
        leitura:
          'A vírgula faz uma pequena separação, mas a frase continua. O ponto-final mostra que a frase terminou.',
      }
    ),
    questao(
      2,
      'Pontuação',
      'Uma lista bem escrita',
      'Escolha a frase pontuada corretamente.',
      [
        opcao(
          'Qual frase está correta?',
          [
            'Ana levou pão suco frutas.',
            'Ana levou pão, suco, frutas.',
            'Ana levou pão, suco e frutas.',
            'Ana levou, pão suco e frutas.',
          ],
          'Ana levou pão, suco e frutas.'
        ),
      ],
      'Separe os primeiros itens e use “e” antes do último.'
    ),
    questao(
      3,
      'Pontuação',
      'Lista dos brinquedos',
      'Marque a frase escrita corretamente.',
      [
        opcao(
          'Como Sofia contou os brinquedos?',
          [
            'Sofia guardou a bola, a boneca, o carrinho e o quebra-cabeça.',
            'Sofia guardou, a bola a boneca o carrinho e o quebra-cabeça.',
            'Sofia guardou a bola. a boneca. o carrinho e o quebra-cabeça.',
            'Sofia guardou a bola a boneca o carrinho e o quebra-cabeça,',
          ],
          'Sofia guardou a bola, a boneca, o carrinho e o quebra-cabeça.'
        ),
      ],
      'Observe onde cada brinquedo termina e o próximo começa.'
    ),
    questao(
      4,
      'Pontuação',
      'Cidade e data',
      'Escolha a data escrita corretamente.',
      [
        opcao(
          'Qual linha está correta?',
          [
            'Recife 8 de outubro de 2026.',
            'Recife. 8 de outubro, de 2026',
            'Recife, 8 de outubro de 2026,',
            'Recife, 8 de outubro de 2026.',
          ],
          'Recife, 8 de outubro de 2026.'
        ),
      ],
      'Depois da cidade há uma vírgula; no fim da frase, um ponto.',
      {
        leitura:
          'Em uma data escrita com o nome da cidade, podemos colocar uma vírgula depois da cidade e um ponto-final no fim.',
      }
    ),
    ditado(
      5,
      'Uma frase de mochila',
      ['Na mochila há lápis, caderno e cola.'],
      'Ouça outra vez e confira vírgula, acentos, letra inicial e ponto-final.',
      true,
      true
    ),
    questao(
      6,
      'LH',
      'A família do LH',
      'Associe LH à vogal indicada.',
      [
        opcao('LH + A', ['LHE', 'LHI', 'LHA', 'LHO', 'LHU'], 'LHA'),
        opcao('LH + E', ['LHE', 'LHO', 'LHA', 'LHU', 'LHI'], 'LHE'),
        opcao('LH + I', ['LHU', 'LHI', 'LHO', 'LHA', 'LHE'], 'LHI'),
        opcao('LH + O', ['LHO', 'LHA', 'LHE', 'LHI', 'LHU'], 'LHO'),
        opcao('LH + U', ['LHI', 'LHO', 'LHU', 'LHE', 'LHA'], 'LHU'),
      ],
      'Deixe L e H juntinhos e acrescente a vogal.'
    ),
    questao(
      7,
      'LH',
      'Complete com LH',
      'Digite somente “lh” em cada palavra.',
      [
        campo('fo__a', 'lh'),
        campo('mi__o', 'lh'),
        campo('coe__o', 'lh'),
        campo('te__ado', 'lh'),
        campo('baru__o', 'lh'),
      ],
      'Duas letras ficam juntas em cada espaço.'
    ),
    questao(
      8,
      'LH',
      'Divida em sílabas',
      'Escolha a divisão correta de cada palavra.',
      [
        opcao('filhote', ['fil-ho-te', 'fi-lho-te', 'fi-lh-o-te'], 'fi-lho-te'),
        opcao('milho', ['mi-lho', 'mil-ho', 'mi-l-h-o'], 'mi-lho'),
        opcao('barulho', ['ba-rul-ho', 'baru-lho', 'ba-ru-lho'], 'ba-ru-lho'),
        opcao('telhado', ['tel-ha-do', 'te-lh-a-do', 'te-lha-do'], 'te-lha-do'),
      ],
      'Na divisão, L e H continuam juntos.',
      {
        leitura: 'Na divisão em sílabas, L e H continuam juntos.',
      }
    ),
    questao(
      9,
      'LH',
      'Troque só uma letra',
      'Faça somente a troca indicada. Digite a nova palavra.',
      [
        campo('folha: troque F por R', 'rolha'),
        campo('palha: troque P por M', 'malha'),
        campo('filha: troque F por P', 'pilha'),
        campo('joelho: troque J por C', 'coelho'),
      ],
      'Mantenha todas as outras letras na mesma ordem.'
    ),
    questao(
      10,
      'LH',
      'Encontre as palavras com LH',
      'Marque somente as palavras que têm LH.',
      [
        selecao(
          'Quais palavras têm LH?',
          ['milho', 'ninho', 'chave', 'coelho', 'chuva', 'telhado'],
          ['milho', 'coelho', 'telhado']
        ),
      ],
      'Procure a sequência L seguida de H.',
      { tipo: 'selecao' }
    ),
    ditado(
      11,
      'Palavras com LH',
      ['folha', 'coelho', 'milho', 'telhado'],
      'Ouça novamente e confira onde aparece LH.',
      false,
      false
    ),
    questao(
      12,
      'Pontuação',
      'Qual é pergunta?',
      'Escolha a frase que faz uma pergunta.',
      [
        opcao(
          'Qual frase pergunta algo?',
          [
            'Hoje teremos aula de música.',
            'Que alegria!',
            'Mariana abriu a porta.',
            'Onde está meu caderno?',
          ],
          'Onde está meu caderno?'
        ),
      ],
      'Uma pergunta espera uma resposta e termina com um sinal próprio.'
    ),
    questao(
      13,
      'Pontuação',
      'Sinal no fim',
      'Escolha ponto-final, interrogação ou exclamação.',
      [
        opcao('Que horas são__', ['.', '?', '!'], '?'),
        opcao('A aula terminou__', ['!', '.', '?'], '.'),
        opcao('Que surpresa__', ['?', '!', '.'], '!'),
        opcao('Você trouxe o lanche__', ['?', '.', '!'], '?'),
        opcao('O gato dormiu no sofá__', ['!', '?', '.'], '.'),
      ],
      'Pergunta, notícia e surpresa terminam de maneiras diferentes.'
    ),
    questao(
      14,
      'Pontuação',
      'A frase mudou',
      'Compare as duas frases e descubra a mudança.',
      [
        opcao(
          'O que mudou na segunda frase?',
          [
            'Ela passou a indicar uma lista.',
            'Ela passou a ter duas palavras a mais.',
            'Ela passou a indicar uma pergunta.',
            'Ela passou a indicar o nome de alguém.',
          ],
          'Ela passou a indicar uma pergunta.'
        ),
      ],
      'Olhe especialmente para o sinal no fim.',
      { leituraTitulo: 'Compare', leitura: 'A chuva parou.\nA chuva parou?' }
    ),
    ditado(
      15,
      'Uma pergunta',
      ['Onde está minha mochila?'],
      'Ouça novamente: confira a letra inicial e o sinal de pergunta.',
      true,
      false
    ),
    questao(
      16,
      'X/CH',
      'X com som de CH',
      'Marque as palavras em que X tem som parecido com CH.',
      [
        selecao(
          'Em quais palavras X soa como CH?',
          ['xícara', 'exame', 'xale', 'táxi', 'lixo', 'caixa'],
          ['xícara', 'xale', 'lixo', 'caixa']
        ),
      ],
      'Leia cada palavra em voz baixa e compare o som do X.',
      {
        tipo: 'selecao',
        leitura:
          'Em algumas palavras, a letra X tem um som parecido com o som de CH. Isso não significa que todas as palavras com esse som sejam escritas da mesma maneira.',
      }
    ),
    questao(
      17,
      'X/CH',
      'XA, XE, XI, XO e XU',
      'Escolha a sílaba inicial que completa cada palavra.',
      [
        opcao('__LE → xale', ['XI', 'XA', 'XO', 'XE', 'XU'], 'XA'),
        opcao('__RETA → xereta', ['XE', 'XU', 'XA', 'XO', 'XI'], 'XE'),
        opcao('__CARA → xícara', ['XO', 'XI', 'XU', 'XE', 'XA'], 'XI'),
        opcao('__DÓ → xodó', ['XU', 'XA', 'XE', 'XO', 'XI'], 'XO'),
        opcao('__XA → Xuxa', ['XI', 'XO', 'XU', 'XA', 'XE'], 'XU'),
      ],
      'Veja a vogal que vem depois do X. A palavra completa “xícara” recebe acento.'
    ),
    questao(
      18,
      'X/CH',
      'Olhe a figura e escolha',
      'Cada figura mostra uma palavra. Escolha a escrita correta.',
      [
        opcao('Figura A', ['chícara', 'xícara'], 'xícara', {
          imagem: imagem + 'xicara.svg',
          imagemAlt: 'Uma xícara',
        }),
        opcao('Figura B', ['caixa', 'caicha'], 'caixa', {
          imagem: imagem + 'caixa.svg',
          imagemAlt: 'Uma caixa de papelão',
        }),
        opcao('Figura C', ['xuva', 'chuva'], 'chuva', {
          imagem: imagem + 'chuva.svg',
          imagemAlt: 'Nuvem com chuva',
        }),
        opcao('Figura D', ['chapéu', 'xapéu'], 'chapéu', {
          imagem: imagem + 'chapeu.svg',
          imagemAlt: 'Um chapéu',
        }),
      ],
      'Observe a figura e lembre a escrita da palavra.'
    ),
    questao(
      19,
      'X/CH',
      'Detetive da ortografia',
      'Marque somente as palavras escritas corretamente.',
      [
        selecao(
          'Quais estão corretas?',
          ['xampu', 'xuva', 'lixo', 'xapéu', 'chave', 'xadrez', 'caxorro', 'chefe'],
          ['xampu', 'lixo', 'chave', 'xadrez', 'chefe']
        ),
      ],
      'Algumas palavras usam X; outras precisam de CH.',
      { tipo: 'selecao' }
    ),
    questao(
      20,
      'X/CH',
      'Banco de palavras',
      'Escolha uma palavra do banco para cada frase. Use cada uma só uma vez.',
      [
        opcao(
          'Peguei a ____ para abrir a porta.',
          ['xale', 'caixa', 'chave', 'chuva', 'xícara'],
          'chave'
        ),
        opcao(
          'A ____ caiu durante a tarde.',
          ['chuva', 'xícara', 'xale', 'chave', 'caixa'],
          'chuva'
        ),
        opcao(
          'A vovó colocou o ____ nos ombros.',
          ['caixa', 'xale', 'chave', 'xícara', 'chuva'],
          'xale'
        ),
        opcao(
          'O presente estava dentro da ____.',
          ['xícara', 'chave', 'chuva', 'caixa', 'xale'],
          'caixa'
        ),
        opcao('Bebi leite em uma ____.', ['chave', 'chuva', 'xale', 'caixa', 'xícara'], 'xícara'),
      ],
      'Leia a frase toda antes de escolher a palavra.',
      { leituraTitulo: 'Banco', leitura: 'xale / caixa / chave / chuva / xícara' }
    ),
    questao(
      21,
      'X/CH',
      'Monte a frase',
      'Escolha os cartões na ordem para formar uma frase.',
      ['A', 'chuva', 'molhou', 'a', 'caixa', '.'].map(function (palavra) {
        return campo('Próximo cartão', palavra);
      }),
      'Comece com letra maiúscula e termine com ponto.',
      {
        tipo: 'ordenacao',
        rotuloOrdem: 'Ordem da frase',
        cartoes: ['caixa', 'a', 'molhou', 'A', 'chuva', '.'],
      }
    ),
    questao(
      22,
      'CH, NH e LH',
      'Complete com duas letras',
      'Escolha CH, NH ou LH.',
      [
        opcao('ca__orro', ['NH', 'CH', 'LH'], 'CH'),
        opcao('ni__o', ['NH', 'LH', 'CH'], 'NH'),
        opcao('coe__o', ['CH', 'NH', 'LH'], 'LH'),
        opcao('gali__a', ['LH', 'CH', 'NH'], 'NH'),
        opcao('__ave', ['CH', 'LH', 'NH'], 'CH'),
        opcao('abe__a', ['NH', 'LH', 'CH'], 'LH'),
      ],
      'Experimente as duas letras juntas dentro da palavra.'
    ),
    questao(
      23,
      'CH, NH e LH',
      'Separe as sílabas',
      'Escolha a divisão correta de cada palavra.',
      [
        opcao('chuva', ['c-hu-va', 'chuv-a', 'chu-va'], 'chu-va'),
        opcao('ninho', ['ni-nho', 'nin-ho', 'ni-n-h-o'], 'ni-nho'),
        opcao('coelho', ['coel-ho', 'co-e-lho', 'co-e-lh-o'], 'co-e-lho'),
        opcao('galinha', ['ga-lin-ha', 'gali-nha', 'ga-li-nha'], 'ga-li-nha'),
      ],
      'CH, NH e LH não se separam.'
    ),
    ditado(
      24,
      'Uma frase com CH, NH e LH',
      ['O coelho achou uma chave no caminho.'],
      'Ouça novamente e confira os três pares de letras e o ponto.',
      true,
      false
    ),
    questao(
      25,
      'Pontuação',
      'Como termina a frase?',
      'Escolha ., ? ou ! para cada frase.',
      [
        opcao('Que susto__', ['?', '.', '!'], '!'),
        opcao('Você trouxe seu caderno__', ['!', '?', '.'], '?'),
        opcao('O recreio começou__', ['.', '!', '?'], '.'),
        opcao('Que bolo gostoso__', ['?', '!', '.'], '!'),
        opcao('Qual é o seu brinquedo preferido__', ['.', '!', '?'], '?'),
      ],
      'Descubra se a frase conta, pergunta ou mostra emoção.'
    ),
    questao(
      26,
      'Pontuação',
      'Uma fala de Bia',
      'Leia e escolha o sinal que anuncia e inicia a fala.',
      [
        opcao('Qual sinal depois de “perguntou” anuncia a fala?', ['?', '…', ':'], ':'),
        opcao('Qual sinal marca o início da fala?', ['—', ',', ';'], '—'),
      ],
      'Um sinal vem antes da fala; outro aparece no começo dela.',
      {
        leitura:
          'Os dois-pontos podem anunciar que alguém vai falar. O travessão pode marcar o início da fala do personagem.\n\nBia perguntou:\n— Onde está o livro?',
      }
    ),
    questao(
      27,
      'Pontuação',
      'Outros sinais',
      'Associe cada sinal à sua função.',
      [
        opcao(
          'Vírgula ,',
          [
            'pode separar itens de uma lista',
            'mostra fala suspensa',
            'destaca uma fala',
            'separa mais que o ponto-final',
          ],
          'pode separar itens de uma lista'
        ),
        opcao(
          'Ponto e vírgula ;',
          [
            'destaca uma fala',
            'faz uma separação maior que a vírgula e menor que o ponto-final',
            'marca uma pergunta',
            'inicia fala',
          ],
          'faz uma separação maior que a vírgula e menor que o ponto-final'
        ),
        opcao(
          'Reticências …',
          [
            'mostram que uma fala ou ideia ficou suspensa ou continua',
            'separam itens de lista',
            'iniciam a fala',
            'terminam toda pergunta',
          ],
          'mostram que uma fala ou ideia ficou suspensa ou continua'
        ),
        opcao(
          'Aspas “ ”',
          [
            'indicam pergunta',
            'separam sílabas',
            'anunciam lista',
            'podem destacar ou reproduzir exatamente palavras ou uma fala',
          ],
          'podem destacar ou reproduzir exatamente palavras ou uma fala'
        ),
      ],
      'Pense no que cada sinal ajuda o leitor a perceber.',
      {
        leitura:
          'A vírgula separa itens. O ponto e vírgula faz uma pausa um pouco maior. As reticências deixam uma ideia suspensa. As aspas podem mostrar palavras ditas por alguém.',
      }
    ),
    questao(
      28,
      'Leitura',
      'Uma surpresa no quintal',
      'Leia o texto e responda às perguntas.',
      [
        opcao(
          'Onde Lia colocou a mochila?',
          ['Dentro da caixa.', 'Perto da janela.', 'No quintal.', 'Debaixo da cama.'],
          'Perto da janela.'
        ),
        opcao(
          'O que havia dentro da mochila?',
          [
            'Uma xícara, um coelho e uma caixa.',
            'Um livro, uma caixa e leite.',
            'Um lanche, uma chave e um livro.',
            'Uma chave, um coelho e uma janela.',
          ],
          'Um lanche, uma chave e um livro.'
        ),
        opcao(
          'Quem descobriu o que havia caído?',
          ['Lia.', 'A mãe de Lia.', 'O coelho.', 'O livro.'],
          'A mãe de Lia.'
        ),
      ],
      'Volte ao texto e encontre a informação em cada frase.',
      { leituraTitulo: 'Texto original', leitura: textoFinal }
    ),
    questao(
      29,
      'Leitura',
      'Entenda a história',
      'Leia o mesmo texto e escolha o que aconteceu.',
      [
        opcao(
          'Por que Lia chamou a mãe?',
          [
            'Porque ouviu um barulho no quintal.',
            'Porque perdeu a mochila.',
            'Porque queria beber leite.',
            'Porque encontrou um coelho dentro de casa.',
          ],
          'Porque ouviu um barulho no quintal.'
        ),
        opcao(
          'Lia sorriu depois de saber que era uma caixa vazia. O que isso indica?',
          [
            'Ela ficou com raiva da mãe.',
            'Ela ainda não sabia o que aconteceu.',
            'Ela ficou mais tranquila.',
            'Ela queria jogar a caixa fora.',
          ],
          'Ela ficou mais tranquila.'
        ),
        opcao(
          'Por que há “?” depois de “O que caiu lá fora”?',
          [
            'Porque a frase é uma lista.',
            'Porque acabou o texto.',
            'Porque alguém está gritando.',
            'Porque Lia está fazendo uma pergunta.',
          ],
          'Porque Lia está fazendo uma pergunta.'
        ),
      ],
      'Leia a fala de Lia e observe como ela reagiu à resposta.',
      { leituraTitulo: 'Texto original', leitura: textoFinal }
    ),
    questao(
      30,
      'Simulado',
      'Missão final',
      'Acerte todos os itens para ganhar o último ponto.',
      [
        opcao(
          'Em “Lia chamou:”, qual sinal anuncia a fala?',
          ['travessão (—)', 'dois-pontos (:)', 'vírgula (,)'],
          'dois-pontos (:)'
        ),
        opcao(
          'Qual sinal inicia “— Mãe, o que caiu lá fora?”',
          ['travessão (—)', 'dois-pontos (:)', 'reticências (…)'],
          'travessão (—)'
        ),
        opcao('Qual palavra tem CH?', ['livro', 'janela', 'chave'], 'chave'),
        opcao('Qual palavra tem NH?', ['caixa', 'caminho', 'Lia'], 'caminho'),
        opcao('Qual palavra tem LH?', ['coelho', 'chuva', 'chave'], 'coelho'),
        selecao(
          'Selecione as DUAS palavras em que X tem som parecido com CH.',
          ['caixa', 'livro', 'xícara', 'caminho'],
          ['caixa', 'xícara']
        ),
        opcao(
          'Em “um lanche, uma chave e um livro”, a vírgula ajuda a:',
          [
            'transformar a frase em pergunta',
            'separar elementos de uma enumeração',
            'indicar o começo de uma fala',
          ],
          'separar elementos de uma enumeração'
        ),
      ],
      'Releia o texto e confira cada sinal e cada par de letras.',
      { tipo: 'misto', leituraTitulo: 'Texto original', leitura: textoFinal }
    ),
  ];

  window.GramaticaQuestionarios.registrar({
    id: 'alice-gramatica-pontuacao-lh-xch-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Gramática',
    titulo: 'Pontuação, LH e X/CH — Revisão da prova',
    subtitulo: 'Vírgula, ponto-final, interrogação, outros sinais, LH, CH, NH e X com som de CH',
    chave: 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1',
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice',
          principal: true,
          chaveArmazenamento: 'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.responsavel.v1',
        },
      ],
    },
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    resumoFinal: 'Você revisou pontuação, LH, CH, NH e palavras com X. Missão cumprida!',
    questoes: questoes,
  });
})();
