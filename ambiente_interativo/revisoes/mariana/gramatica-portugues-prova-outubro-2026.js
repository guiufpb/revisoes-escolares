(function () {
  'use strict';

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }
  function campo(pergunta, resposta, extras) {
    return Object.assign({ pergunta: pergunta, respostas: [resposta] }, extras || {});
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
  function ordenacao(numero, bloco, titulo, instrucao, cartoes, respostas, dica, extras) {
    return questao(
      numero,
      bloco,
      titulo,
      instrucao,
      respostas.map(function (resposta) {
        return campo('Próximo cartão', resposta);
      }),
      dica,
      Object.assign(
        { tipo: 'ordenacao', rotuloOrdem: 'Ordem correta', cartoes: cartoes },
        extras || {}
      )
    );
  }
  function ditado(numero, bloco, titulo, respostas, dica, frase) {
    return questao(
      numero,
      bloco,
      titulo,
      frase
        ? 'Escreva a frase que você ouvir. Comece com letra maiúscula, use uma vírgula para separar o nome da pessoa chamada e termine com ponto final.'
        : 'Ouça uma palavra por vez e escreva cada uma.',
      respostas.map(function (resposta, indice) {
        return campo((frase ? 'Frase ' : 'Palavra ') + (indice + 1), resposta, {
          fraseCompleta: Boolean(frase),
          maiusculasObrigatorias: Boolean(frase),
          acentuacaoObrigatoria: frase || resposta === 'relógio',
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

  var caixaExposicao =
    'A caixa da exposição\n\n' +
    'Na sexta-feira, Mariana e seu colega Rafael prepararam uma pequena exposição na escola. Eles levaram cartazes, régua, cola e lápis de cor.\n\n' +
    'Antes de começar, Rafael percebeu que uma caixa com figuras havia sumido. Mariana lembrou que a professora Clara tinha deixado uma caixa perto da biblioteca. Os dois foram até lá e encontraram o material.\n\n' +
    'De volta à sala, organizaram tudo rapidamente. No fim, a turma visitou a exposição e fez muitas perguntas. Mariana ficou contente porque todos puderam participar. Rafael sorriu e disse:\n\n' +
    '— Ainda bem que procuramos antes de desistir!';
  var boneEncontrado =
    'O boné encontrado\n\n' +
    'No sábado, Lucas levou sua cadela Mel para a praça. Na mochila havia água, uma toalha e uma bola.\n\n' +
    'Durante a brincadeira, Mel encontrou um boné perto de um banco. Lucas procurou o dono e viu um menino preocupado. O boné era dele. O menino agradeceu, e Lucas voltou para casa contente.';
  var leituraCaixa = { leituraTitulo: 'A caixa da exposição', leitura: caixaExposicao };
  var leituraBone = { leituraTitulo: 'O boné encontrado', leitura: boneEncontrado };

  var questoes = [
    questao(
      1,
      'Leitura',
      'O que desapareceu?',
      'O que Rafael percebeu que havia sumido antes de a exposição começar?',
      [
        opcao(
          'Escolha a resposta.',
          [
            'A régua de Mariana.',
            'Uma caixa com figuras.',
            'Um cartaz da professora.',
            'Uma caixa de lápis de cor.',
          ],
          'Uma caixa com figuras.'
        ),
      ],
      'Volte ao segundo parágrafo e procure o que Rafael percebeu antes de começar a exposição.',
      leituraCaixa
    ),
    ordenacao(
      2,
      'Leitura',
      'Coloque a história em ordem',
      'Escolha os cartões na ordem dos acontecimentos.',
      [
        'Mariana e Rafael foram até a biblioteca.',
        'Rafael percebeu que uma caixa havia sumido.',
        'Eles encontraram o material e voltaram para a sala.',
      ],
      [
        'Rafael percebeu que uma caixa havia sumido.',
        'Mariana e Rafael foram até a biblioteca.',
        'Eles encontraram o material e voltaram para a sala.',
      ],
      'Pense primeiro no problema, depois no lugar onde eles procuraram e, por último, no que aconteceu após a procura.',
      leituraCaixa
    ),
    questao(
      3,
      'Leitura',
      'Perto da biblioteca',
      'Por que Mariana e Rafael decidiram procurar perto da biblioteca?',
      [
        opcao(
          'Escolha a explicação.',
          [
            'Porque queriam escolher um livro para ler.',
            'Porque a professora mandou cancelar a exposição.',
            'Porque Mariana lembrou que a professora Clara havia deixado uma caixa perto dali.',
            'Porque toda a turma estava esperando na biblioteca.',
          ],
          'Porque Mariana lembrou que a professora Clara havia deixado uma caixa perto dali.'
        ),
      ],
      'Procure no texto a lembrança de Mariana que ajudou os dois a decidir onde procurar.',
      leituraCaixa
    ),
    questao(
      4,
      'Leitura',
      'Ideia principal',
      'Qual frase resume melhor a história?',
      [
        opcao(
          'Escolha o resumo.',
          [
            'Mariana e Rafael prepararam uma exposição, procuraram um material desaparecido e conseguiram realizar a atividade.',
            'Mariana e Rafael perderam todos os materiais e a exposição precisou ser cancelada.',
            'A professora Clara organizou sozinha uma exposição dentro da biblioteca.',
            'A turma preferiu brincar e não participou da exposição.',
          ],
          'Mariana e Rafael prepararam uma exposição, procuraram um material desaparecido e conseguiram realizar a atividade.'
        ),
      ],
      'Um bom resumo reúne os acontecimentos mais importantes sem inventar informações.',
      leituraCaixa
    ),
    questao(
      5,
      'Pontuação',
      'A lista da exposição',
      'Mariana anotou os materiais levados para a exposição. Qual frase está pontuada corretamente?',
      [
        opcao(
          'Escolha a frase.',
          [
            'Levamos cartazes régua, cola e lápis de cor.',
            'Levamos cartazes, régua, cola e lápis de cor.',
            'Levamos cartazes, régua cola, e lápis de cor.',
            'Levamos cartazes, régua, cola, e lápis de cor.',
          ],
          'Levamos cartazes, régua, cola e lápis de cor.'
        ),
      ],
      'Veja onde termina cada item da lista. Antes do último item aparece a palavra “e”.'
    ),
    questao(
      6,
      'Pontuação',
      'Cidade e data',
      'Esta é uma linha de local e data. Qual é a forma correta?',
      [
        opcao(
          'Escolha a linha.',
          [
            'Recife 5, de outubro de 2026.',
            'Recife, 5 de outubro de 2026.',
            'Recife 5 de outubro, de 2026.',
            'Recife, 5, de outubro de 2026.',
          ],
          'Recife, 5 de outubro de 2026.'
        ),
      ],
      'Quando escrevemos cidade e data, a vírgula separa o nome da cidade da data.'
    ),
    questao(
      7,
      'Pontuação',
      'Um bilhete',
      'Qual bilhete está corretamente pontuado?',
      [
        opcao(
          'Escolha o bilhete.',
          [
            'Mariana leve o caderno, a régua e o lápis?',
            'Mariana, leve o caderno, a régua e o lápis.',
            'Mariana, leve o caderno a régua e o lápis.',
            'Mariana. leve o caderno, a régua e o lápis.',
          ],
          'Mariana, leve o caderno, a régua e o lápis.'
        ),
      ],
      'Observe três coisas: quem está sendo chamado, a lista de objetos e como termina uma ordem.'
    ),
    questao(
      8,
      'R/RR',
      'Escute o R',
      'Classifique cada palavra pelo som e pela posição do R.',
      [
        opcao(
          'rato',
          ['R brando entre vogais', 'R forte no início', 'RR com som forte entre vogais'],
          'R forte no início'
        ),
        opcao(
          'carinho',
          ['RR com som forte entre vogais', 'R brando entre vogais', 'R forte no início'],
          'R brando entre vogais'
        ),
        opcao(
          'carro',
          ['R forte no início', 'RR com som forte entre vogais', 'R brando entre vogais'],
          'RR com som forte entre vogais'
        ),
      ],
      'Observe onde o R aparece e escute mentalmente o som da palavra.'
    ),
    questao(
      9,
      'R/RR',
      'Palavras parecidas',
      'Leia: “Pedro fez uma ______ engraçada para a fotografia.” e “O caminhão puxava uma ______ pesada.”',
      [
        opcao(
          'Qual par completa as frases nessa ordem?',
          ['carreta / careta', 'careta / carreta', 'careta / careta', 'carreta / carreta'],
          'careta / carreta'
        ),
      ],
      'As duas palavras são parecidas na escrita, mas têm significados diferentes. Leia as frases inteiras.'
    ),
    questao(
      10,
      'R/RR',
      'Corrija a palavra',
      'A menina pegou a boracha que caiu no chão. Escreva corretamente a palavra com erro.',
      [campo('Palavra corrigida', 'borracha')],
      'Nessa palavra, o som forte do R aparece entre duas vogais.'
    ),
    ditado(
      11,
      'R/RR',
      'Ditado de R/RR',
      ['relógio', 'barriga'],
      'Escute novamente e preste atenção ao som do R.',
      false
    ),
    questao(
      12,
      'R/RR',
      'Separe as sílabas',
      'Qual é a separação correta da palavra “carroça”?',
      [
        opcao(
          'Escolha a separação.',
          ['ca-rro-ça', 'car-ro-ça', 'carr-o-ça', 'ca-r-ro-ça'],
          'car-ro-ça'
        ),
      ],
      'Na separação silábica, observe o que acontece com os dois erres.'
    ),
    ordenacao(
      13,
      'Sílabas',
      'Monte a palavra',
      'É usado na escola para escrever e fazer atividades. Coloque as sílabas em ordem.',
      ['DER', 'NO', 'CA'],
      ['CA', 'DER', 'NO'],
      'Leia as combinações e procure a palavra que combina com a pista.'
    ),
    ordenacao(
      14,
      'Sílabas',
      'Outra palavra',
      'Pode trazer notícias, fotografias e reportagens. Coloque as sílabas em ordem.',
      ['TA', 'VIS', 'RE'],
      ['RE', 'VIS', 'TA'],
      'Leia as combinações em voz baixa e veja qual delas forma uma palavra conhecida.'
    ),
    ditado(
      15,
      'Sílabas',
      'Ditado de sílabas',
      ['jardim', 'lista'],
      'Ouça outra vez e confira a escrita de cada palavra.',
      false
    ),
    questao(
      16,
      'X/CH',
      'Grafia correta',
      'Qual frase está totalmente correta?',
      [
        opcao(
          'Escolha a frase.',
          [
            'A menina tomou xá numa chícara.',
            'A menina tomou chá numa xícara.',
            'A menina tomou chá numa chícara.',
            'A menina tomou xá numa xícara.',
          ],
          'A menina tomou chá numa xícara.'
        ),
      ],
      'Leia as duas palavras principais e lembre-se de como cada uma é escrita.'
    ),
    questao(
      17,
      'X/CH',
      'Corrija a palavra',
      'O menino encontrou uma caxa cheia de brinquedos. Escreva corretamente a palavra com erro.',
      [campo('Palavra corrigida', 'caixa')],
      'Leia a palavra inteira e lembre-se de como costumamos escrever o nome desse objeto.'
    ),
    ditado(
      18,
      'X/CH',
      'Ditado de X/CH',
      ['chave', 'xarope'],
      'Ouça outra vez e confira a grafia das palavras.',
      false
    ),
    questao(
      19,
      'Vocabulário',
      'Sinônimo na frase',
      'Depois da apresentação, Mariana ficou contente. Qual palavra pode substituir “contente” sem mudar o sentido da frase?',
      [opcao('Escolha a palavra.', ['alegre', 'zangada', 'assustada', 'cansada'], 'alegre')],
      'Escolha a palavra que mantém a ideia da frase.'
    ),
    questao(
      20,
      'Vocabulário',
      'Dois sentidos de leve',
      'A. “Depois de tirar os livros, a mochila ficou leve.” B. “Um vento leve entrou pela janela.” Qual sentido aparece em cada frase?',
      [
        opcao(
          'Compare com o verbete.',
          [
            'A = sentido 1; B = sentido 2.',
            'A = sentido 2; B = sentido 1.',
            'As duas usam apenas o sentido 1.',
            'As duas usam apenas o sentido 2.',
          ],
          'A = sentido 1; B = sentido 2.'
        ),
      ],
      'Não escolha só olhando para a palavra. Leia a frase em que ela aparece.',
      {
        leituraTitulo: 'Verbete: leve',
        leitura:
          'leve\n\n1. Que pesa pouco.\nEx.: A sacola está leve.\n\n2. Suave, pouco intenso.\nEx.: Soprou um vento leve.',
      }
    ),
    questao(
      21,
      'Vocabulário',
      'Sentido contrário',
      'A caixa estava cheia. Depois que retiramos todos os livros, ela ficou ______.',
      [opcao('Escolha a palavra.', ['pesada', 'vazia', 'grande', 'limpa'], 'vazia')],
      'Procure uma palavra com sentido contrário a “cheia” que também combine com a situação.'
    ),
    questao(
      22,
      'Vocabulário',
      'Sinônimos ou antônimos?',
      'Classifique cada par de palavras.',
      [
        opcao('feliz / alegre', ['ANTÔNIMOS', 'SINÔNIMOS'], 'SINÔNIMOS'),
        opcao('entrar / sair', ['SINÔNIMOS', 'ANTÔNIMOS'], 'ANTÔNIMOS'),
        opcao('rápido / veloz', ['ANTÔNIMOS', 'SINÔNIMOS'], 'SINÔNIMOS'),
      ],
      'Compare o sentido das duas palavras de cada par.'
    ),
    questao(
      23,
      'Vocabulário',
      'Forme e use antônimos',
      'Escreva os dois antônimos com IN ou IM. Depois escolha entre as palavras que você formou e escreva a que completa: “Faltou uma página no trabalho. Por isso, ele ficou ______.”',
      [
        campo('possível →', 'impossível'),
        campo('completo →', 'incompleto'),
        campo('Palavra adequada para a frase', 'incompleto'),
      ],
      'Primeiro forme os antônimos. Depois leia a frase e veja qual significado combina com ela.'
    ),
    questao(
      24,
      'Substantivos',
      'Nomes comuns',
      'Beatriz levou o cachorro Pipoca ao parque. Quais duas palavras são substantivos comuns?',
      [
        opcao(
          'Escolha o par.',
          ['Beatriz e Pipoca', 'cachorro e parque', 'Beatriz e parque', 'cachorro e Pipoca'],
          'cachorro e parque'
        ),
      ],
      'Pergunte: essa palavra nomeia um ser específico ou qualquer ser daquele tipo?'
    ),
    questao(
      25,
      'Substantivos',
      'Comum e próprio',
      'Associe cada nome geral ao nome específico.',
      [
        opcao('menina', ['Recife', 'Mariana', 'Mingau'], 'Mariana'),
        opcao('cidade', ['Mingau', 'Recife', 'Mariana'], 'Recife'),
        opcao('gato', ['Mariana', 'Mingau', 'Recife'], 'Mingau'),
      ],
      'De um lado está o nome geral; do outro, o nome de um ser ou lugar específico.'
    ),
    questao(
      26,
      'Substantivos',
      'Maiúscula e classificação',
      'Leia: “Menina encontrou um livro.” e “A menina Ana encontrou um livro.” Qual afirmação está correta?',
      [
        opcao(
          'Escolha a explicação.',
          [
            '“Menina” é nome próprio na frase 1 porque começa com letra maiúscula.',
            '“menina” é nome próprio apenas na frase 2.',
            '“menina” é substantivo comum nas duas frases; na primeira aparece com maiúscula porque inicia a frase.',
            '“Menina” não é substantivo.',
          ],
          '“menina” é substantivo comum nas duas frases; na primeira aparece com maiúscula porque inicia a frase.'
        ),
      ],
      'A letra inicial pode estar maiúscula só porque a palavra começou a frase. Pense no que ela nomeia.'
    ),
    questao(
      27,
      'Substantivos',
      'Nomes próprios',
      'Os nomes próprios são Pedro, Bidu e Parque das Flores. Qual mensagem foi escrita corretamente?',
      [
        opcao(
          'Escolha a mensagem.',
          [
            'Ontem, pedro levou o cachorro bidu ao parque das flores.',
            'Ontem, Pedro levou o cachorro Bidu ao Parque das Flores.',
            'Ontem, Pedro levou o Cachorro Bidu ao Parque das flores.',
            'Ontem, pedro levou o cachorro Bidu ao parque das Flores.',
          ],
          'Ontem, Pedro levou o cachorro Bidu ao Parque das Flores.'
        ),
      ],
      'Use maiúsculas nos nomes específicos, mas não transforme todo substantivo comum em nome próprio.'
    ),
    questao(
      28,
      'Masculino/feminino',
      'O artigo de cada coisa',
      'Escolha O ou A para cada palavra.',
      [
        opcao('___ árvore', ['O', 'A'], 'A'),
        opcao('___ caderno', ['A', 'O'], 'O'),
        opcao('___ mochila', ['O', 'A'], 'A'),
        opcao('___ vento', ['A', 'O'], 'O'),
      ],
      'Nem todo substantivo precisa ter uma forma do outro gênero. Aqui você está descobrindo qual artigo usamos com cada palavra.'
    ),
    questao(
      29,
      'Masculino/feminino',
      'Formas femininas',
      'Escreva a forma feminina de cada palavra.',
      [campo('o aluno → a ______', 'aluna'), campo('o professor → a ______', 'professora')],
      'Observe como termina a palavra masculina e qual forma feminina é usada normalmente.'
    ),
    questao(
      30,
      'Masculino/feminino',
      'Pares de palavras',
      'Associe cada palavra à forma feminina.',
      [
        opcao('rei', ['égua', 'cabra', 'rainha'], 'rainha'),
        opcao('cavalo', ['cabra', 'égua', 'rainha'], 'égua'),
        opcao('bode', ['rainha', 'cabra', 'égua'], 'cabra'),
      ],
      'Alguns pares usam palavras bem diferentes. Leia cada nome antes de escolher.'
    ),
    questao(
      31,
      'Masculino/feminino',
      'Troque o grupo',
      'Na frase “O professor chegou cedo.”, troque apenas “O professor” pela forma feminina: ______ chegou cedo.',
      [campo('Trecho feminino', 'A professora', { maiusculasObrigatorias: true })],
      'Não mude apenas o substantivo. Veja também qual artigo combina com ele.'
    ),
    ditado(
      32,
      'Ditado',
      'Ditado da frase',
      ['Marina, pegue a régua e o caderno.'],
      'Ouça novamente e confira início, vírgula, acento e sinal final.',
      true
    ),
    questao(
      33,
      'Leitura',
      'O boné encontrado',
      'O que provavelmente deixou Lucas contente no final da história?',
      [
        opcao(
          'Escolha a explicação.',
          [
            'Ter perdido a bola na praça.',
            'Ter ajudado o menino a recuperar o boné.',
            'Ter encontrado uma mochila nova.',
            'Ter ido embora sem falar com ninguém.',
          ],
          'Ter ajudado o menino a recuperar o boné.'
        ),
      ],
      'Pense no problema que apareceu na história e no que Lucas fez para resolvê-lo.',
      leituraBone
    ),
    questao(
      34,
      'Leitura',
      'Mesmo sentido',
      'O menino agradeceu, e Lucas voltou para casa contente. Qual frase mantém o mesmo sentido?',
      [
        opcao(
          'Escolha a frase.',
          [
            'O menino agradeceu, e Lucas voltou para casa feliz.',
            'O menino agradeceu, e Lucas voltou para casa zangado.',
            'O menino reclamou, e Lucas perdeu o boné.',
            'Lucas voltou para casa triste porque ninguém agradeceu.',
          ],
          'O menino agradeceu, e Lucas voltou para casa feliz.'
        ),
      ],
      'Procure a frase que troca uma palavra por outra de sentido parecido sem mudar o acontecimento.',
      leituraBone
    ),
    questao(
      35,
      'Leitura',
      'Revisão final',
      'Lucas chamou o amigo para preparar outra brincadeira. Qual frase está escrita corretamente?',
      [
        opcao(
          'Escolha a frase.',
          [
            'pedro leve a bola, a toalha e a água.',
            'Pedro leve a bola a toalha e a água.',
            'Pedro, leve a bola, a toalha e a água.',
            'Pedro, leve a bola, a toalha, e a água.',
          ],
          'Pedro, leve a bola, a toalha e a água.'
        ),
      ],
      'Confira o nome próprio, a pessoa que está sendo chamada, a lista e o sinal final.',
      leituraBone
    ),
  ];

  // Posições fixas e irregulares, sem sorteio a cada recarga.
  var posicoesCorretas = [
    2, 0, 3, 1, 0, 2, 1, 2, 0, 3, 1, 0, 2, 3, 1, 1, 0, 0, 2, 0, 2, 1, 3, 1, 0, 1, 1, 0, 2, 0, 1, 3,
    0, 2,
  ];
  var posicao = 0;
  questoes.forEach(function (questaoAtual) {
    questaoAtual.itens.forEach(function (item) {
      if (!item.opcoes) return;
      var alvo = posicoesCorretas[posicao++];
      var atual = item.opcoes.indexOf(item.respostas[0]);
      item.opcoes.splice(atual, 1);
      item.opcoes.splice(alvo, 0, item.respostas[0]);
    });
  });

  window.GramaticaQuestionarios.registrar({
    id: 'mariana-gramatica-portugues-prova-outubro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Gramática',
    titulo: 'Português e Gramática — Revisão da prova',
    subtitulo:
      'Interpretação, vírgula, R/RR, sílabas, X/CH, sinônimos, antônimos, substantivos e masculino/feminino',
    chave: 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'mariana',
          nome: 'Mariana',
          principal: true,
          chaveArmazenamento: 'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.responsavel.v1',
        },
      ],
    },
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    resumoFinal: 'Você revisou leitura, pontuação, ortografia e palavras. Parabéns!',
    questoes: questoes,
  });
})();
