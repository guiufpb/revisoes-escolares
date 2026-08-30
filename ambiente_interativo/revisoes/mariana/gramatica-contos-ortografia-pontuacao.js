(function () {
  'use strict';

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function campo(pergunta, resposta, fraseCompleta) {
    return {
      pergunta: pergunta,
      respostas: [resposta],
      acentuacaoObrigatoria: true,
      maiusculasObrigatorias: Boolean(fraseCompleta),
      fraseCompleta: Boolean(fraseCompleta),
    };
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
        sucesso: 'Muito bem! Você concluiu esta questão de ' + bloco.toLowerCase() + '.',
      },
      extras || {}
    );
  }

  function ditado(numero, bloco, titulo, palavras, instrucao, dica, frase) {
    return questao(
      numero,
      bloco,
      titulo,
      instrucao,
      palavras.map(function (palavra, indice) {
        return campo((frase ? 'Frase ' : 'Palavra ') + (indice + 1), palavra, frase);
      }),
      dica,
      { ditado: true, unidadeDitado: frase ? 'frase' : 'palavra' }
    );
  }

  var questoes = [
    questao(
      1,
      'Contos',
      'Uma descoberta no quintal',
      'Leia a história e escolha o tipo de texto.',
      [opcao('Que tipo de texto é esse?', ['conto', 'receita', 'notícia', 'lista'], 'conto')],
      'Observe se o texto conta o que aconteceu com uma personagem.',
      {
        leitura:
          'Luna encontrou uma semente no quintal. Ela a plantou perto da janela. Todos os dias, Luna regava a terra. Depois de uma semana, nasceu uma flor amarela.',
      }
    ),
    questao(
      2,
      'Contos',
      'Um objeto encantado',
      'Leia e descubra o que combina com um conto de fadas.',
      [
        opcao(
          'O que torna essa história um conto de fadas?',
          [
            'lista de ingredientes',
            'magia e encantamento',
            'preço de produtos',
            'instruções para montar brinquedo',
          ],
          'magia e encantamento'
        ),
      ],
      'Pense no que o objeto faz e se isso pode acontecer na vida real.',
      {
        leitura:
          'A jovem Iara precisava atravessar um rio sem ponte. Uma fada lhe deu uma fita mágica, mas ela só funcionaria depois de uma boa ação. Iara ajudou um coelho perdido. A fita virou uma ponte, e Iara chegou em casa.',
      }
    ),
    questao(
      3,
      'Contos',
      'Cada parte da história',
      'Escolha começo, problema ou desfecho para cada parte.',
      [
        opcao('Téo saiu para levar pão à avó.', ['começo', 'problema', 'desfecho'], 'começo'),
        opcao(
          'No caminho, a alça da cesta arrebentou.',
          ['começo', 'problema', 'desfecho'],
          'problema'
        ),
        opcao(
          'Téo amarrou a alça e entregou o pão.',
          ['começo', 'problema', 'desfecho'],
          'desfecho'
        ),
      ],
      'O começo apresenta a situação. O problema atrapalha o plano. O desfecho mostra como tudo terminou.'
    ),
    questao(
      4,
      'Contos',
      'Que barulho foi esse?',
      'Leia este conto de suspense leve e escolha o trecho que cria mistério.',
      [
        opcao(
          'Qual trecho faz o leitor querer descobrir o que está dentro da caixa?',
          [
            'A casa estava silenciosa.',
            'Algo fazia toc, toc dentro de uma caixa fechada.',
            'Era uma bolinha batendo na tampa!',
            'Os irmãos riram da descoberta.',
          ],
          'Algo fazia toc, toc dentro de uma caixa fechada.'
        ),
      ],
      'Procure a parte em que ainda não sabemos o que está acontecendo.',
      {
        leitura:
          'A casa estava silenciosa. Algo fazia toc, toc dentro de uma caixa fechada. Nina e seu irmão se aproximaram e abriram a caixa que o gato empurrava. Era uma bolinha batendo na tampa! Os irmãos riram da descoberta.',
      }
    ),
    questao(
      5,
      'NH',
      'Duas letras juntinhas',
      'Digite somente nh em cada lacuna.',
      [campo('ni__o', 'nh'), campo('mi__oca', 'nh'), campo('dese__o', 'nh'), campo('ma__ã', 'nh')],
      'As duas letras ficam juntas. Confira se você digitou as duas.'
    ),
    questao(
      6,
      'NH',
      'Qual palavra está correta?',
      'Escolha a escrita correta em cada par.',
      [
        opcao('Onde o pássaro põe os ovos', ['nino', 'ninho'], 'ninho'),
        opcao('O que tomamos para ficar limpos', ['banho', 'bano'], 'banho'),
        opcao('A ave que bota ovos no galinheiro', ['galina', 'galinha'], 'galinha'),
      ],
      'Leia devagar e procure as duas letras que formam o som estudado.'
    ),
    ditado(
      7,
      'NH',
      'Ouça e escreva com NH',
      ['ninho', 'banho', 'caminho', 'galinha'],
      'Ouça uma palavra por vez e digite. Se preferir, peça a um adulto para ditar.',
      'Ouça novamente e confira o par de letras no meio de cada palavra.'
    ),
    questao(
      8,
      'CH',
      'Complete com CH',
      'Digite somente ch em cada lacuna.',
      [
        campo('__inelo', 'ch'),
        campo('__ocolate', 'ch'),
        campo('ca__orro', 'ch'),
        campo('fi__a', 'ch'),
      ],
      'O par estudado tem duas letras. Não deixe nenhuma de fora.'
    ),
    questao(
      9,
      'CH',
      'Leia os pares',
      'Escolha a grafia correta de cada palavra.',
      [
        opcao('Cai das nuvens', ['xuva', 'chuva'], 'chuva'),
        opcao('Abre a fechadura', ['chave', 'xave'], 'chave'),
        opcao('Leva o material escolar', ['moxila', 'mochila'], 'mochila'),
      ],
      'Nestas palavras, o som estudado é escrito com duas letras.'
    ),
    ditado(
      10,
      'CH',
      'Um ditado com CH',
      ['chuva', 'chave', 'lanche', 'mochila'],
      'Ouça e digite cada palavra. Um adulto também pode ditar.',
      'Repita a palavra e confira onde aparece o par CH.'
    ),
    questao(
      11,
      'Antônimos',
      'Sentidos contrários',
      'Escolha a palavra de sentido contrário.',
      [
        opcao('O contrário de alto é...', ['baixo', 'grande', 'longo'], 'baixo'),
        opcao('O contrário de quente é...', ['morno', 'frio', 'fervente'], 'frio'),
        opcao('O contrário de aberto é...', ['novo', 'largo', 'fechado'], 'fechado'),
      ],
      'Imagine a situação oposta, como uma porta que estava aberta e deixou de estar.'
    ),
    questao(
      12,
      'Antônimos',
      'Complete com o contrário',
      'Use cada palavra uma vez: escuro, triste, devagar.',
      [
        campo('O quarto estava claro. Apaguei a luz e ele ficou ____.', 'escuro'),
        campo('Antes eu estava feliz. Ao perder o brinquedo, fiquei ____.', 'triste'),
        campo('Antes andava rápido. Agora ando ____.', 'devagar'),
      ],
      'Escolha no banco a palavra que mostra o sentido oposto ao destacado na frase.'
    ),
    questao(
      13,
      'Sinônimos',
      'Sentidos parecidos',
      'Escolha a palavra com sentido semelhante.',
      [
        opcao('bonito', ['belo', 'sujo', 'feio'], 'belo'),
        opcao('feliz', ['triste', 'contente', 'zangado'], 'contente'),
        opcao('rápido', ['lento', 'parado', 'veloz'], 'veloz'),
      ],
      'Procure uma palavra que diga quase a mesma coisa, sem trocar a ideia por seu contrário.'
    ),
    questao(
      14,
      'Sinônimos',
      'Outra palavra, mesma ideia',
      'Troque a palavra em MAIÚSCULAS por outra de sentido parecido.',
      [
        opcao('Vamos COMEÇAR o jogo.', ['encerrar', 'iniciar', 'guardar'], 'iniciar'),
        opcao('O jardim ficou BONITO.', ['belo', 'vazio', 'pequeno'], 'belo'),
      ],
      'Leia a frase com cada opção e veja qual conserva a ideia principal.'
    ),
    questao(
      15,
      'Frase declarativa',
      'Palavras em ordem',
      'Organize mentalmente: jardim / no / pula / coelho / o.',
      [
        opcao(
          'Qual frase informa algo com sentido completo?',
          [
            'Jardim no o pula coelho.',
            'O coelho pula no jardim.',
            'O no jardim coelho pula.',
            'Pula jardim o no coelho.',
          ],
          'O coelho pula no jardim.'
        ),
      ],
      'Descubra quem faz a ação, o que faz e onde faz.'
    ),
    questao(
      16,
      'Frase declarativa',
      'Uma frase completa',
      'Escolha a frase com sentido completo, maiúscula inicial e ponto-final.',
      [
        opcao(
          'Qual está pronta?',
          [
            'A menina fechou a janela.',
            'a menina fechou a janela.',
            'A menina fechou a janela',
            'Janela a fechou menina a.',
          ],
          'A menina fechou a janela.'
        ),
      ],
      'Confira três coisas: a ordem das palavras, a primeira letra e o sinal final.'
    ),
    ditado(
      17,
      'Frase declarativa',
      'Ditado de uma informação',
      ['A menina guardou o desenho.'],
      'Ouça e escreva a frase completa, com maiúscula inicial e ponto-final. Um adulto também pode ditar.',
      'Confira a primeira letra, a escrita com NH e o ponto-final.',
      true
    ),
    questao(
      18,
      'Interrogação',
      'Informar ou perguntar?',
      'Classifique cada frase.',
      [
        opcao('O lanche está pronto.', ['declarativa', 'interrogativa'], 'declarativa'),
        opcao('O lanche está pronto?', ['declarativa', 'interrogativa'], 'interrogativa'),
        opcao('Você viu meu desenho?', ['declarativa', 'interrogativa'], 'interrogativa'),
      ],
      'Uma pergunta espera resposta. Uma declaração dá uma informação.'
    ),
    questao(
      19,
      'Interrogação',
      'Transforme em pergunta',
      'Mantenha todas as palavras e troque somente o ponto-final por interrogação.',
      [campo('A turma chegou.', 'A turma chegou?', true)],
      'Copie as mesmas palavras, preserve a maiúscula e mude apenas o sinal final.'
    ),
    questao(
      20,
      'Exclamação',
      'Falas com emoção',
      'Escolha o sinal que destaca a emoção forte em cada fala.',
      [
        opcao('Surpresa: Nossa, que arco-íris', ['.', '?', '!'], '!'),
        opcao('Alegria e entusiasmo: Viva, nosso time ganhou', ['?', '!', '.'], '!'),
        opcao('Susto: Ai, que barulho', ['!', '.', '?'], '!'),
        opcao('Impaciência: Ande logo', ['.', '!', '?'], '!'),
      ],
      'Pense no sinal que usamos quando falamos com muita emoção.'
    ),
    ditado(
      21,
      'Exclamação',
      'Ditado de uma surpresa',
      ['Que chuva forte!'],
      'Ouça e escreva a frase com maiúscula e exclamação. Um adulto também pode ditar.',
      'Confira a escrita com CH e o sinal que mostra surpresa.',
      true
    ),
    questao(
      22,
      'Travessão e dois-pontos',
      'Quem está falando?',
      'Leia e escolha o sinal usado em cada situação.',
      [
        opcao('Qual sinal anuncia a fala depois de “disse”?', ['?', ':', '.'], ':'),
        opcao('Qual sinal inicia a fala de Caio?', ['—', '!', ':'], '—'),
        opcao(
          'Qual sinal anuncia a lista em “Trouxe três coisas: lápis, cola e papel.”?',
          ['.', '—', ':'],
          ':'
        ),
      ],
      'Observe o que vem antes da fala e o que aparece bem no início dela.',
      { leitura: 'Caio disse:\n— Meu desenho ficou pronto!' }
    ),
    ditado(
      23,
      'Travessão e dois-pontos',
      'Um diálogo bem curtinho',
      ['Bia perguntou: — Onde está a chave?'],
      'Ouça e escreva em uma linha. Use dois-pontos depois de “perguntou”, travessão antes da fala e interrogação no fim. Um adulto também pode ditar.',
      'Confira as maiúsculas, o acento e os três sinais do diálogo.',
      true
    ),
    questao(
      24,
      'S e SS',
      'Uma ou duas letras?',
      'Complete cada lacuna somente com s ou ss.',
      [
        campo('pa__arinho', 'ss'),
        campo('pa__eio', 'ss'),
        campo('ma__a de pão', 'ss'),
        campo('pe__oa', 'ss'),
        campo('__emana', 's'),
        campo('__alada', 's'),
      ],
      'No início usamos uma letra S. Entre vogais, SS mantém o som de S.'
    ),
    questao(
      25,
      'S e SS',
      'Descubra a regra',
      'Escolha a explicação correta em cada item.',
      [
        opcao(
          'Em “massa”, o SS fica...',
          ['no início da palavra', 'entre duas vogais', 'no fim da palavra'],
          'entre duas vogais'
        ),
        opcao(
          'Podemos começar uma palavra com SS?',
          ['Sim, sempre.', 'Não, usamos S no início.'],
          'Não, usamos S no início.'
        ),
        opcao('Em “passeio”, SS mantém o som de...', ['S', 'Z'], 'S'),
      ],
      'Olhe as letras vizinhas do SS e compare com o início de “salada”.'
    ),
    questao(
      26,
      'S e SS',
      'Separe as sílabas',
      'Escolha a separação correta. Cada S fica em uma sílaba.',
      [
        opcao('passo', ['pa-sso', 'pas-so', 'pass-o'], 'pas-so'),
        opcao('massa', ['mas-sa', 'ma-ssa', 'mass-a'], 'mas-sa'),
        opcao('passeio', ['pa-ssei-o', 'pas-se-io', 'pas-sei-o'], 'pas-sei-o'),
      ],
      'Fale cada pedaço devagar. Não deixe os dois S na mesma sílaba.'
    ),
    questao(
      27,
      'S com som de Z',
      'Uma letra, outro som',
      'Escolha a palavra em que o S entre vogais tem som de Z.',
      [
        opcao('Grupo 1', ['sapo', 'casa', 'massa'], 'casa'),
        opcao('Grupo 2', ['passeio', 'salada', 'tesoura'], 'tesoura'),
      ],
      'Observe as letras dos dois lados do S e fale a palavra em voz baixa.'
    ),
    ditado(
      28,
      'S com som de Z',
      'Ouça o som, pense na escrita',
      ['casa', 'rosa', 'mesa', 'camisa'],
      'Ouça e escreva. Nestas palavras, o som de Z é escrito com S. Um adulto também pode ditar.',
      'O som pode enganar: confira a letra que está entre duas vogais.'
    ),
    questao(
      29,
      'Pontuação integrada',
      'Complete a conversa',
      'Escolha um sinal para cada número do texto.',
      [
        opcao('[1] Anuncia a fala de Nina', ['.', '?', '!', ':', '—'], ':'),
        opcao('[2] Inicia a fala', ['.', '?', '!', ':', '—'], '—'),
        opcao('[3] Termina uma informação tranquila', ['.', '?', '!', ':', '—'], '.'),
        opcao('[4] Termina a pergunta', ['.', '?', '!', ':', '—'], '?'),
        opcao('[5] Destaca a alegria', ['.', '?', '!', ':', '—'], '!'),
      ],
      'Leia uma linha por vez. Há anúncio de fala, informação, pergunta e emoção.',
      {
        leitura:
          'Nina anunciou [1]\n[2] Hoje vamos pintar [3]\n— Você trouxe tinta [4]\n— Que alegria [5]',
      }
    ),
    ditado(
      30,
      'Pontuação integrada',
      'Mini ditado final',
      ['O passarinho molhou o ninho!'],
      'Ouça e escreva com maiúscula inicial e exclamação. Preste atenção em SS e NH. Um adulto também pode ditar.',
      'Releia a frase: confira as letras do meio das palavras e o sinal de emoção.',
      true
    ),
  ];

  questoes[22].itens[0].inserirTravessao = true;

  window.GramaticaQuestionarios.registrar({
    id: 'mariana-gramatica-contos-ortografia-pontuacao',
    aluno: 'mariana',
    nome: 'Mariana',
    titulo: 'Contos, ortografia e pontuação',
    chave: 'revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1',
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você concluiu 30 questões sobre contos, NH, CH, antônimos, sinônimos, S, SS e pontuação!',
    questoes: questoes,
  });
})();
