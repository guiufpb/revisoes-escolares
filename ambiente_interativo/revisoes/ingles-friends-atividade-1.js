(function () {
  'use strict';

  var UNIDADE_ID = 'friends-level-1-atividade-1';

  function item(id, ingles, portugues, imagem, unidadeAudio) {
    var registro = { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
    if (unidadeAudio) registro.unidadeAudio = unidadeAudio;
    return registro;
  }

  function opcao(id, texto, traducao) {
    return { id: id, texto: texto, traducao: traducao };
  }

  function atividade(id, pergunta, instrucao, correta, explicacao, feedbackErro, alternativas) {
    return {
      id: id,
      perguntaIngles: pergunta,
      instrucaoPortugues: instrucao,
      respostaCorreta: correta,
      explicacao: explicacao,
      feedbackErro: feedbackErro,
      alternativas: alternativas,
    };
  }

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.aliceFriendsAtividade1 = {
    perfil: 'alice',
    revisaoId: 'alice-ingles-friends-atividade-1',
    unidadeId: UNIDADE_ID,
    chaveArmazenamento: 'revisoesEscolares.alice.ingles.friendsAtividade1.v1',
  };
  window.ConfiguracoesIngles.marianaFriendsAtividade1 = {
    perfil: 'mariana',
    revisaoId: 'mariana-ingles-friends-atividade-1',
    unidadeId: UNIDADE_ID,
    chaveArmazenamento: 'revisoesEscolares.mariana.ingles.friendsAtividade1.v1',
  };

  window.RegistroIngles.registrar({
    id: UNIDADE_ID,
    versao: 1,
    titulo: 'Friends · Activity 1',
    subtitulo: 'English Review · Friends',
    descricao:
      'Escolha uma palavra ou expressão, ouça em inglês e depois copie no campo de escrita. Confira sua resposta e continue até completar todos os itens.',
    imagemCabecalho: 'friend.svg',
    perfisDisponiveis: ['alice', 'mariana'],
    correcaoPorQuestao: true,
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
    mensagemAtividades:
      'Great work! Você ouviu e escreveu os 25 itens. Agora pode começar as 25 atividades.',
    mensagemFinal:
      'Great work! Você praticou cumprimentos, nome, idade, números, alfabeto e cores em inglês.',
    grupos: [
      {
        id: 'apresentacao',
        titulo: 'Meeting Friends',
        traducao: 'Conhecendo amigos',
        instrucao:
          'Escolha uma palavra, ouça em inglês e copie exatamente como ela aparece no campo de escrita.',
        itens: [
          item('name', 'name', 'nome', 'student.svg'),
          item('friend', 'friend', 'amigo ou amiga', 'friend.svg'),
        ],
      },
      {
        id: 'numeros',
        titulo: 'Numbers 1–10',
        traducao: 'Números de 1 a 10',
        instrucao:
          'Ouça cada número em inglês, observe a escrita e depois copie no campo para conferir.',
        itens: [
          item('one', 'one', 'um', 'star.svg'),
          item('two', 'two', 'dois', 'star.svg'),
          item('three', 'three', 'três', 'star.svg'),
          item('four', 'four', 'quatro', 'star.svg'),
          item('five', 'five', 'cinco', 'star.svg'),
          item('six', 'six', 'seis', 'star.svg'),
          item('seven', 'seven', 'sete', 'star.svg'),
          item('eight', 'eight', 'oito', 'star.svg'),
          item('nine', 'nine', 'nove', 'star.svg'),
          item('ten', 'ten', 'dez', 'star.svg'),
        ],
      },
      {
        id: 'cores',
        titulo: 'Colors',
        traducao: 'Cores',
        instrucao:
          'Ouça cada cor em inglês, observe a palavra e copie no campo de escrita antes de conferir.',
        itens: [
          item('yellow', 'yellow', 'amarelo', 'colored-pencils.svg'),
          item('red', 'red', 'vermelho', 'colored-pencils.svg'),
          item('orange', 'orange', 'laranja', 'colored-pencils.svg'),
          item('purple', 'purple', 'roxo', 'colored-pencils.svg'),
          item('green', 'green', 'verde', 'green-balloon.svg'),
          item('blue', 'blue', 'azul', 'blue-backpack.svg'),
        ],
      },
      {
        id: 'frases-essenciais',
        titulo: 'Useful Phrases',
        traducao: 'Frases essenciais',
        instrucao:
          'Ouça a frase completa, use a opção devagar se precisar e copie a expressão visível.',
        itens: [
          item('hi', 'Hi!', 'Oi!', 'friend.svg', 'frase'),
          item(
            'whats-your-name',
            "What's your name?",
            'Qual é o seu nome?',
            'student.svg',
            'frase'
          ),
          item('im-sam', "I'm Sam.", 'Eu sou Sam.', 'student.svg', 'frase'),
          item(
            'how-old-are-you',
            'How old are you?',
            'Quantos anos você tem?',
            'star.svg',
            'frase'
          ),
          item('im-six', "I'm six.", 'Eu tenho seis anos.', 'star.svg', 'frase'),
          item(
            'what-color-is-it',
            'What color is it?',
            'Que cor é?',
            'colored-pencils.svg',
            'frase'
          ),
          item(
            'my-bag-is-blue',
            'My bag is blue.',
            'Minha mochila é azul.',
            'blue-backpack.svg',
            'frase'
          ),
        ],
      },
    ],
    atividades: [
      atividade(
        'q01-greeting',
        'Which expression greets someone?',
        'Qual expressão usamos para cumprimentar alguém?',
        'hi',
        'Hi! é uma forma curta e amigável de cumprimentar alguém.',
        'Procure a expressão usada quando encontramos uma pessoa.',
        [
          opcao('hi', 'Hi!', 'Oi!'),
          opcao('six', "I'm six.", 'Eu tenho seis anos.'),
          opcao('blue', 'blue', 'azul'),
          opcao('name', 'name', 'nome'),
        ]
      ),
      atividade(
        'q02-name-question',
        'Which question asks for a name?',
        'Qual pergunta pede o nome de uma pessoa?',
        'whats-your-name',
        "What's your name? significa Qual é o seu nome?",
        'Procure a pergunta que tem a palavra name.',
        [
          opcao('how-old', 'How old are you?', 'Quantos anos você tem?'),
          opcao('what-color', 'What color is it?', 'Que cor é?'),
          opcao('whats-your-name', "What's your name?", 'Qual é o seu nome?'),
          opcao('hi', 'Hi!', 'Oi!'),
        ]
      ),
      atividade(
        'q03-answer-name',
        "What's your name?",
        'Escolha a resposta que diz um nome.',
        'im-sam',
        "I'm Sam. responde à pergunta sobre o nome.",
        'A resposta deve apresentar uma pessoa, não idade ou cor.',
        [
          opcao('im-seven', "I'm seven.", 'Eu tenho sete anos.'),
          opcao('im-sam', "I'm Sam.", 'Eu sou Sam.'),
          opcao('green', 'It is green.', 'É verde.'),
          opcao('ten', 'ten', 'dez'),
        ]
      ),
      atividade(
        'q04-name-age-color',
        'Which answer tells a name?',
        'Qual resposta apresenta um nome?',
        'im-lia',
        "I'm Lia. apresenta o nome Lia.",
        'Compare: uma resposta fala de nome, outra de idade e outra de cor.',
        [
          opcao('im-eight', "I'm eight.", 'Eu tenho oito anos.'),
          opcao('it-is-red', 'It is red.', 'É vermelho.'),
          opcao('im-lia', "I'm Lia.", 'Eu sou Lia.'),
          opcao('two', 'two', 'dois'),
        ]
      ),
      atividade(
        'q05-complete-introduction',
        'Hi! ___ Sam.',
        'Complete a apresentação: Oi! Eu sou Sam.',
        'im',
        "I'm completa a frase Hi! I'm Sam.",
        'Escolha a forma curta usada antes de um nome.',
        [
          opcao('im', "I'm", 'Eu sou'),
          opcao('is', 'is', 'é'),
          opcao('are', 'are', 'são'),
          opcao('my', 'my', 'meu ou minha'),
        ]
      ),
      atividade(
        'q06-eight-numeral',
        'Which word matches 8?',
        'Qual palavra em inglês corresponde ao numeral 8?',
        '8',
        'Eight is the English word for 8. Eight é a palavra em inglês para 8.',
        'Lembre-se da sequência six, seven, eight.',
        [
          opcao('6', 'six', ''),
          opcao('8', 'eight', ''),
          opcao('9', 'nine', ''),
          opcao('3', 'three', ''),
        ]
      ),
      atividade(
        'q07-seven-word',
        'Which word matches 7?',
        'Qual palavra em inglês corresponde ao numeral 7?',
        'seven',
        'Seven é a palavra em inglês para 7.',
        'Lembre-se da sequência six, seven, eight.',
        [
          opcao('six', 'six', ''),
          opcao('seven', 'seven', ''),
          opcao('eight', 'eight', ''),
          opcao('ten', 'ten', ''),
        ]
      ),
      atividade(
        'q08-four-numeral',
        'Which word matches 4?',
        'Qual palavra em inglês corresponde ao numeral 4?',
        '4',
        'Four is the English word for 4. Four é a palavra em inglês para 4.',
        'Conte one, two, three, four.',
        [
          opcao('5', 'five', ''),
          opcao('2', 'two', ''),
          opcao('4', 'four', ''),
          opcao('7', 'seven', ''),
        ]
      ),
      atividade(
        'q09-ten',
        'Which word matches 10?',
        'Qual palavra em inglês corresponde ao numeral 10?',
        '10',
        'Ten is the English word for 10. Ten é a palavra em inglês para 10.',
        'Lembre-se do último número da sequência de one a ten.',
        [
          opcao('1', 'one', ''),
          opcao('9', 'nine', ''),
          opcao('10', 'ten', ''),
          opcao('6', 'six', ''),
        ]
      ),
      atividade(
        'q10-age-question',
        'Which question asks about age?',
        'Qual pergunta pede a idade?',
        'how-old',
        'How old are you? pergunta quantos anos a pessoa tem.',
        'Procure a pergunta que usa a palavra old.',
        [
          opcao('how-old', 'How old are you?', 'Quantos anos você tem?'),
          opcao('whats-name', "What's your name?", 'Qual é o seu nome?'),
          opcao('what-color', 'What color is it?', 'Que cor é?'),
          opcao('hi', 'Hi!', 'Oi!'),
        ]
      ),
      atividade(
        'q11-answer-age',
        'How old are you?',
        'Escolha a resposta que diz sete anos.',
        'im-seven',
        "I'm seven. significa Eu tenho sete anos.",
        'A resposta de idade usa um número.',
        [
          opcao('im-seven', "I'm seven.", 'Eu tenho sete anos.'),
          opcao('im-leo', "I'm Leo.", 'Eu sou Leo.'),
          opcao('blue', 'It is blue.', 'É azul.'),
          opcao('hello', 'Hi!', 'Oi!'),
        ]
      ),
      atividade(
        'q12-leo-age',
        'Leo is six. How old is Leo?',
        'Leo tem seis anos. Qual é a idade dele?',
        'six',
        'A frase diz Leo is six, por isso a resposta é six.',
        'Releia o número que aparece depois do nome Leo.',
        [
          opcao('five', 'five', 'cinco'),
          opcao('six', 'six', 'seis'),
          opcao('seven', 'seven', 'sete'),
          opcao('eight', 'eight', 'oito'),
        ]
      ),
      atividade(
        'q13-after-b',
        'Which letter comes after B?',
        'Qual letra vem depois de B no alfabeto?',
        'c',
        'C is the letter after B. A sequência é A, B, C.',
        'Recite o começo do alfabeto: A, B...',
        [opcao('a', 'A', ''), opcao('c', 'C', ''), opcao('d', 'D', ''), opcao('p', 'P', '')]
      ),
      atividade(
        'q14-before-t',
        'Which letter comes before T?',
        'Qual letra vem antes de T no alfabeto?',
        's',
        'S is the letter before T. A sequência é R, S, T.',
        'Pense nas letras que aparecem perto de T.',
        [opcao('u', 'U', ''), opcao('r', 'R', ''), opcao('s', 'S', ''), opcao('v', 'V', '')]
      ),
      atividade(
        'q15-alphabet-sequence',
        'Which letter comes after H and before J?',
        'Qual letra completa a sequência G — H — ___ — J?',
        'i',
        'I completes the sequence. A ordem correta é G, H, I, J.',
        'Recite as letras entre G e J.',
        [opcao('f', 'F', ''), opcao('i', 'I', ''), opcao('k', 'K', ''), opcao('l', 'L', '')]
      ),
      atividade(
        'q16-after-m',
        'Which letter comes after M?',
        'Qual letra vem depois de M no alfabeto?',
        'n',
        'N is the letter after M. A sequência é L, M, N.',
        'Pense na letra seguinte a M.',
        [opcao('l', 'L', ''), opcao('n', 'N', ''), opcao('o', 'O', ''), opcao('w', 'W', '')]
      ),
      atividade(
        'q17-green-translation',
        'Which word means verde?',
        'Qual palavra em inglês significa verde?',
        'green',
        'Green significa verde.',
        'Lembre-se das seis cores estudadas.',
        [
          opcao('blue', 'blue', 'azul'),
          opcao('green', 'green', 'verde'),
          opcao('red', 'red', 'vermelho'),
          opcao('yellow', 'yellow', 'amarelo'),
        ]
      ),
      Object.assign(
        atividade(
          'q18-green-balloon',
          'What color is the balloon?',
          'Observe o balão e escolha a cor dele.',
          'green',
          'The balloon is green. O balão é verde.',
          'Observe com atenção a cor do balão.',
          [
            opcao('orange', 'orange', 'laranja'),
            opcao('green', 'green', 'verde'),
            opcao('purple', 'purple', 'roxo'),
            opcao('yellow', 'yellow', 'amarelo'),
          ]
        ),
        { imagemEnunciado: 'green-balloon.svg', imagemEnunciadoAlt: 'Um balão verde.' }
      ),
      Object.assign(
        atividade(
          'q19-blue-bag',
          'What color is the bag?',
          'Observe a mochila e escolha a cor dela.',
          'blue',
          'The bag is blue. A mochila é azul.',
          'Observe com atenção a cor da mochila.',
          [
            opcao('red', 'red', 'vermelho'),
            opcao('purple', 'purple', 'roxo'),
            opcao('blue', 'blue', 'azul'),
            opcao('orange', 'orange', 'laranja'),
          ]
        ),
        { imagemEnunciado: 'blue-backpack.svg', imagemEnunciadoAlt: 'Uma mochila azul.' }
      ),
      atividade(
        'q20-color-question',
        'What does "What color is it?" ask about?',
        'Sobre qual informação essa pergunta quer saber?',
        'color',
        'What color is it? pergunta qual é a cor.',
        'Observe a palavra color na pergunta.',
        [
          opcao('name', 'a name', 'um nome'),
          opcao('age', 'an age', 'uma idade'),
          opcao('color', 'a color', 'uma cor'),
          opcao('number', 'a number of friends', 'uma quantidade de amigos'),
        ]
      ),
      atividade(
        'q21-dialogue-name',
        "Hi! I'm Leo. I'm eight. My bag is green. What's his name?",
        'Olá! Eu sou Leo. Tenho oito anos. Minha mochila é verde. Qual é o nome dele?',
        'leo',
        "O menino se apresenta dizendo I'm Leo.",
        'Procure a informação apresentada logo depois de Hi!',
        [
          opcao('sam', 'Sam', 'Sam'),
          opcao('leo', 'Leo', 'Leo'),
          opcao('eight', 'eight', 'oito'),
          opcao('green', 'green', 'verde'),
        ]
      ),
      atividade(
        'q22-dialogue-age',
        "Hi! I'm Leo. I'm eight. My bag is green. How old is Leo?",
        'Olá! Eu sou Leo. Tenho oito anos. Minha mochila é verde. Quantos anos Leo tem?',
        'eight',
        "I'm eight. informa que Leo tem oito anos.",
        'Procure o número usado na frase sobre a idade.',
        [
          opcao('six', 'six', 'seis'),
          opcao('seven', 'seven', 'sete'),
          opcao('eight', 'eight', 'oito'),
          opcao('ten', 'ten', 'dez'),
        ]
      ),
      atividade(
        'q23-dialogue-color',
        "Hi! I'm Leo. I'm eight. My bag is green. What color is his bag?",
        'Olá! Eu sou Leo. Tenho oito anos. Minha mochila é verde. Qual é a cor da mochila?',
        'green',
        'My bag is green. informa que a mochila é verde.',
        'Procure a cor mencionada depois da palavra bag.',
        [
          opcao('yellow', 'yellow', 'amarelo'),
          opcao('green', 'green', 'verde'),
          opcao('blue', 'blue', 'azul'),
          opcao('red', 'red', 'vermelho'),
        ]
      ),
      Object.assign(
        atividade(
          'q24-two-balloons',
          'Mia has two green balloons. How many balloons does she have?',
          'Mia tem dois balões verdes. Quantos balões ela tem?',
          'two',
          'Mia has two balloons. Two significa dois.',
          'Conte os balões e releia o número da frase.',
          [
            opcao('one', 'one', 'um'),
            opcao('two', 'two', 'dois'),
            opcao('three', 'three', 'três'),
            opcao('four', 'four', 'quatro'),
          ]
        ),
        {
          imagemEnunciado: 'green-balloon.svg',
          repeticoesImagem: 2,
          imagemEnunciadoAlt: 'Dois balões verdes.',
        }
      ),
      atividade(
        'q25-final-review',
        'Nina is seven. Her favorite color is purple. Which sentence is correct?',
        'Nina tem sete anos e sua cor favorita é roxo. Qual frase apresenta corretamente as três informações?',
        'nina-seven-purple',
        'Nina, seven e purple reproduzem corretamente o nome, a idade e a cor.',
        'Compare nome, idade e cor em cada alternativa.',
        [
          opcao(
            'nina-seven-purple',
            "I'm Nina. I'm seven. My favorite color is purple.",
            'Eu sou Nina. Tenho sete anos. Minha cor favorita é roxo.'
          ),
          opcao(
            'nina-six-purple',
            "I'm Nina. I'm six. My favorite color is purple.",
            'Eu sou Nina. Tenho seis anos. Minha cor favorita é roxo.'
          ),
          opcao(
            'mia-seven-purple',
            "I'm Mia. I'm seven. My favorite color is purple.",
            'Eu sou Mia. Tenho sete anos. Minha cor favorita é roxo.'
          ),
          opcao(
            'nina-seven-blue',
            "I'm Nina. I'm seven. My favorite color is blue.",
            'Eu sou Nina. Tenho sete anos. Minha cor favorita é azul.'
          ),
        ]
      ),
    ],
  });
})();
