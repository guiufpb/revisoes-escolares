(function () {
  'use strict';

  var UNIDADE_ID = 'at-school-atividade-3';
  var REVISAO_ID = 'mariana-ingles-at-school-atividade-3';

  function item(id, ingles, portugues, imagem, unidadeAudio) {
    var registro = { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
    if (unidadeAudio) registro.unidadeAudio = unidadeAudio;
    return registro;
  }

  function opcao(id, texto, imagem) {
    var registro = { id: id, texto: texto };
    if (imagem) registro.imagem = imagem;
    return registro;
  }

  function revisao(
    perguntaPortugues,
    respostaIngles,
    significadoPortugues,
    unidadeResposta,
    unidadeSignificado,
    imagemResposta
  ) {
    var registro = {
      perguntaPortugues: perguntaPortugues,
      respostaIngles: respostaIngles,
      significadoPortugues: significadoPortugues,
      unidadeRespostaIngles: unidadeResposta,
      unidadeSignificadoPortugues: unidadeSignificado,
    };
    if (imagemResposta) {
      registro.imagemResposta = imagemResposta;
      registro.imagemRespostaAltIngles = respostaIngles;
    }
    return registro;
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
      revisaoPosResposta: REVISOES_POS_RESPOSTA[id],
    };
  }

  function comImagem(questao, imagem, textoAlternativo) {
    questao.imagemEnunciado = imagem;
    questao.imagemEnunciadoAlt = textoAlternativo;
    return questao;
  }

  var REVISOES_POS_RESPOSTA = {
    'q01-story-warning': revisao(
      'Qual aviso você ouve na história?',
      'Watch out!',
      'Cuidado!',
      'frase',
      'palavra'
    ),
    'q02-story-apology': revisao(
      'O que Flash diz depois do acidente?',
      "I'm sorry.",
      'Desculpe.',
      'frase',
      'palavra'
    ),
    'q03-story-response': revisao(
      'O que a outra pessoa diz depois que Flash pede desculpas?',
      "It's OK.",
      'Tudo bem.',
      'frase',
      'frase'
    ),
    'q04-story-notebook': revisao(
      'Sobre qual objeto escolar Flash fala com a mãe?',
      'notebook',
      'caderno',
      'palavra',
      'palavra',
      'notebook.svg'
    ),
    'q05-story-return-objects': revisao(
      'Quais objetos os amigos de Flash devolvem para ele?',
      'pencil case, ruler, and book',
      'estojo, régua e livro',
      'frase',
      'frase',
      'story-set-pencil-case-ruler-book.svg'
    ),
    'q06-story-thank-you': revisao(
      'O que Flash diz depois que seus amigos o ajudam?',
      'Thank you.',
      'Obrigado ou obrigada.',
      'frase',
      'frase'
    ),
    'q07-value-helping': revisao(
      'Qual atitude mostra pessoas ajudando umas às outras?',
      'Help a friend.',
      'Ajudar um amigo.',
      'frase',
      'frase',
      'helping-return-things.svg'
    ),
    'q08-phonics-bag': revisao(
      'Qual palavra tem o som de “a” que estamos praticando?',
      'bag',
      'mochila ou bolsa',
      'palavra',
      'frase',
      'schoolbag.svg'
    ),
    'q09-phonics-black': revisao(
      'Qual palavra tem o mesmo som de “a” de bag?',
      'black',
      'preto',
      'palavra',
      'palavra',
      'blackboard.svg'
    ),
    'q10-phonics-back': revisao(
      'Qual palavra tem o mesmo som de “a” de cat?',
      'back',
      'de volta ou para trás',
      'palavra',
      'frase',
      'back-arrow.svg'
    ),
    'q11-phonics-different': revisao(
      'Qual palavra não tem o mesmo som de “a” de bag?',
      'book',
      'livro',
      'palavra',
      'palavra',
      'book.svg'
    ),
    'q12-skills-desk': revisao(
      'Régua, livro e borracha. Qual carteira tem esses três objetos?',
      'ruler, book, and eraser',
      'régua, livro e borracha',
      'frase',
      'frase',
      'desk-set-ruler-book-eraser.svg'
    ),
    'q13-skills-take-out-ruler': revisao(
      'Pegue sua régua, por favor. Qual imagem mostra essa ação?',
      'Take out your ruler, please.',
      'Pegue sua régua, por favor.',
      'frase',
      'frase',
      'school-take-out-ruler.svg'
    ),
    'q14-skills-put-away-book': revisao(
      'Guarde seu livro, por favor. Qual imagem mostra essa ação?',
      'Put away your book, please.',
      'Guarde seu livro, por favor.',
      'frase',
      'frase',
      'school-put-away-book.svg'
    ),
    'q15-skills-bag': revisao(
      'O que é isto?',
      "It's a bag.",
      'É uma mochila.',
      'frase',
      'frase',
      'schoolbag.svg'
    ),
    'q16-senses-look': revisao(
      'Qual palavra significa “olhar”?',
      'look',
      'olhar',
      'palavra',
      'palavra',
      'sense-look.svg'
    ),
    'q17-senses-listen': revisao(
      'O que você faz com uma música?',
      'listen',
      'ouvir ou escutar',
      'palavra',
      'frase',
      'sense-listen.svg'
    ),
    'q18-senses-smell': revisao(
      'O que você faz com uma flor para perceber o cheiro?',
      'smell',
      'cheirar ou sentir o cheiro',
      'palavra',
      'frase',
      'sense-smell.svg'
    ),
    'q19-senses-taste': revisao(
      'O que você faz com o sorvete para saber o sabor?',
      'taste',
      'provar ou sentir o gosto',
      'palavra',
      'frase',
      'sense-taste.svg'
    ),
    'q20-senses-touch': revisao(
      'O que você faz com um brinquedo macio para senti-lo com a mão?',
      'touch',
      'tocar',
      'palavra',
      'palavra',
      'sense-touch.svg'
    ),
    'q21-think-back-notebook': revisao(
      'O que é isto?',
      "It's a notebook.",
      'É um caderno.',
      'frase',
      'frase',
      'notebook.svg'
    ),
    'q22-think-back-short-answer': revisao(
      'É um estojo?',
      "No, it isn't.",
      'Não, não é.',
      'frase',
      'frase',
      'eraser.svg'
    ),
    'q23-think-back-imperative': revisao(
      'Qual instrução combina com a imagem?',
      'Open your book, please.',
      'Abra seu livro, por favor.',
      'frase',
      'frase',
      'school-open-book.svg'
    ),
    'q24-think-back-listen-to': revisao(
      'Você faz o quê com uma música?',
      'listen to a song',
      'ouvir uma música',
      'frase',
      'frase',
      'sense-listen.svg'
    ),
    'q25-think-back-thank-you': revisao(
      'Seu amigo devolveu sua régua. O que você diz?',
      'Thank you.',
      'Obrigado ou obrigada.',
      'frase',
      'frase',
      'helping-return-things.svg'
    ),
  };

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.marianaAtSchoolAtividade3 = {
    perfil: 'mariana',
    revisaoId: REVISAO_ID,
    unidadeId: UNIDADE_ID,
    chaveArmazenamento: 'revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1',
  };

  window.RegistroIngles.registrar({
    id: UNIDADE_ID,
    versao: 1,
    titulo: 'English Review · At School · Activity 3',
    subtitulo: 'Story, Skills & Senses',
    descricao:
      'Ouça, repita e copie os 17 itens. Depois, ouça cada pergunta e consolide o significado em inglês e português.',
    imagemCabecalho: 'friend.svg',
    perfisDisponiveis: ['mariana'],
    correcaoPorQuestao: true,
    exigirAudioPerguntaAntesDeResponder: true,
    revisaoPosResposta: { obrigatoria: true, pausaMs: 350, manterTelaAposErro: true },
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
    historia: {
      tituloIngles: 'Story Time · Watch Out, Flash!',
      tituloPortugues: 'História · Cuidado, Flash!',
      pausaMs: 350,
      questoesComConsulta: 7,
      cenas: [
        {
          id: 'watch-out',
          tituloIngles: 'Watch out!',
          tituloPortugues: 'Cuidado!',
          textoIngles:
            'Flash is walking with his school things. A man is carrying a box. “Watch out!”',
          textoPortugues:
            'Flash está andando com seus materiais escolares. Um homem está carregando uma caixa. “Cuidado!”',
          imagem: 'story-time-watch-out.svg',
          imagemAlt:
            'Uma criança caminha com materiais escolares perto de um homem que carrega uma caixa e faz um alerta.',
        },
        {
          id: 'im-sorry',
          tituloIngles: "I'm sorry.",
          tituloPortugues: 'Desculpe.',
          textoIngles: 'Flash bumps into him. Flash says: “I’m sorry.”',
          textoPortugues: 'Flash esbarra nele. Flash diz: “Desculpe.”',
          imagem: 'story-time-apology.svg',
          imagemAlt:
            'Duas figuras infantis se encontram sem violência, e Flash pede desculpas enquanto alguns materiais ficam no chão.',
        },
        {
          id: 'its-ok',
          tituloIngles: "It's OK.",
          tituloPortugues: 'Tudo bem.',
          textoIngles: 'The man answers: “It’s OK.”',
          textoPortugues: 'O homem responde: “Tudo bem.”',
          imagem: 'story-time-its-ok.svg',
          imagemAlt: 'O homem responde com tranquilidade ao pedido de desculpas de Flash.',
        },
        {
          id: 'notebook',
          tituloIngles: 'The notebook',
          tituloPortugues: 'O caderno',
          textoIngles:
            'Flash looks for his school things. He asks Mom about his notebook. Mom gives the notebook back to him. “Here you go!”',
          textoPortugues:
            'Flash procura seus materiais escolares. Ele pergunta à mãe pelo seu caderno. A mãe devolve o caderno. “Aqui está!”',
          imagem: 'story-time-notebook.svg',
          imagemAlt: 'A mãe devolve um único caderno a Flash e diz que ali está o objeto.',
        },
        {
          id: 'friends-help',
          tituloIngles: 'Friends help Flash',
          tituloPortugues: 'Os amigos ajudam Flash',
          textoIngles:
            'Flash’s friends help him. Thunder gives him his pencil case. Whisper gives him his ruler. Misty gives him his book.',
          textoPortugues:
            'Os amigos de Flash o ajudam. Thunder devolve seu estojo. Whisper devolve sua régua. Misty devolve seu livro.',
          imagem: 'story-time-friends-help.svg',
          imagemAlt: 'Três amigos devolvem exatamente um estojo, uma régua e um livro a Flash.',
        },
        {
          id: 'thank-you',
          tituloIngles: 'Thank you! · Helping Each Other',
          tituloPortugues: 'Obrigado! · Ajudar uns aos outros',
          textoIngles:
            'Flash says: “Thank you!” His friends helped him get his school things back. Helping each other means helping someone who needs you.',
          textoPortugues:
            'Flash diz: “Obrigado!” Os amigos ajudaram Flash a recuperar seus materiais escolares. Helping each other significa ajudar alguém que precisa de ajuda.',
          imagem: 'story-time-thank-you.svg',
          imagemAlt: 'Flash agradece aos três amigos por ajudarem a recuperar seus materiais.',
        },
      ],
    },
    mensagemAtividades:
      'Great work! Você ouviu e escreveu os 17 itens. Agora acompanhe a Story Time antes das atividades.',
    mensagemAposHistoria:
      'Story complete! Agora ouça cada pergunta e escolha a resposta. Você pode rever a história em Q1–Q7.',
    destinatariaMensagemFinal: 'as meninas',
    mensagemFinal:
      'Meninas, great work! Vocês concluíram a Activity 3 e praticaram a história, como ajudar os outros, o som da letra a, compreensão em inglês e os cinco sentidos. Continuem assim!',
    grupos: [
      {
        id: 'story-values',
        titulo: 'Story & Values',
        traducao: 'História e atitudes',
        instrucao: 'Escolha uma frase, ouça em inglês e copie exatamente como ela aparece.',
        itens: [
          item('watch-out', 'Watch out!', 'Cuidado!', 'stop-sign.svg', 'frase'),
          item('im-sorry', "I'm sorry.", 'Desculpe.', 'heart.svg', 'frase'),
          item('its-ok', "It's OK.", 'Tudo bem.', 'heart.svg', 'frase'),
          item('here-you-go', 'Here you go.', 'Aqui está.', 'friend.svg', 'frase'),
          item('heres-your-book', "Here's your book.", 'Aqui está seu livro.', 'book.svg', 'frase'),
          item('thank-you', 'Thank you.', 'Obrigado / Obrigada.', 'heart.svg', 'frase'),
          item(
            'helping-each-other',
            'Helping each other.',
            'Ajudar uns aos outros.',
            'helping-return-things.svg',
            'frase'
          ),
        ],
      },
      {
        id: 'phonics-letter-a',
        titulo: 'Phonics · Letter A',
        traducao: 'Som da letra A',
        instrucao:
          'Ouça cada palavra, repita e copie exatamente como ela aparece. Perceba o som da letra a.',
        itens: [
          item('bag', 'bag', 'mochila / bolsa', 'schoolbag.svg', 'palavra'),
          item('black', 'black', 'preto', 'blackboard.svg', 'palavra'),
          item('back', 'back', 'de volta / para trás', 'back-arrow.svg', 'palavra'),
          item('cat', 'cat', 'gato', 'cat.svg', 'palavra'),
        ],
      },
      {
        id: 'senses',
        titulo: 'Senses',
        traducao: 'Sentidos',
        instrucao: 'Ouça cada palavra em inglês, observe a imagem e copie a palavra.',
        itens: [
          item('look', 'look', 'olhar', 'sense-look.svg', 'palavra'),
          item('listen', 'listen', 'ouvir / escutar', 'sense-listen.svg', 'palavra'),
          item('smell', 'smell', 'cheirar / sentir o cheiro', 'sense-smell.svg', 'palavra'),
          item('taste', 'taste', 'provar / sentir o gosto', 'sense-taste.svg', 'palavra'),
          item('touch', 'touch', 'tocar', 'sense-touch.svg', 'palavra'),
        ],
      },
      {
        id: 'create-that',
        titulo: 'Create That!',
        traducao: 'Crie você também!',
        instrucao:
          'Ouça, copie e confira a frase. Depois, pegue uma folha, desenhe seu próprio estojo e escolha duas cores. Tente dizer em inglês as cores que você escolheu.',
        itens: [
          item(
            'my-pencil-case',
            "This is my pencil case. It's blue and green.",
            'Este é meu estojo. Ele é azul e verde.',
            'pencil-case.svg',
            'frase'
          ),
        ],
      },
    ],
    atividades: [
      atividade(
        'q01-story-warning',
        'Which warning do you hear in the story?',
        'Ouça a pergunta e escolha o aviso correto.',
        'watch-out',
        'Watch out! é o aviso usado para dizer “Cuidado!”.',
        'Pense na frase usada para avisar alguém sobre um perigo.',
        [
          opcao('watch-out', 'Watch out!'),
          opcao('thank-you', 'Thank you.'),
          opcao('im-sorry', "I'm sorry."),
          opcao('here-you-go', 'Here you go.'),
        ]
      ),
      atividade(
        'q02-story-apology',
        'What does Flash say after the accident?',
        'Ouça a pergunta e escolha a fala de Flash.',
        'im-sorry',
        "I'm sorry. é a forma de pedir desculpas.",
        'Procure a expressão usada depois de causar um acidente.',
        [
          opcao('thank-you', 'Thank you.'),
          opcao('im-sorry', "I'm sorry."),
          opcao('watch-out', 'Watch out!'),
          opcao('here-you-go', 'Here you go.'),
        ]
      ),
      atividade(
        'q03-story-response',
        'What does the other person say after Flash apologizes?',
        'Ouça a pergunta e escolha a resposta ao pedido de desculpas.',
        'its-ok',
        "It's OK. mostra que a pessoa aceitou o pedido de desculpas.",
        'Pense no que podemos dizer para mostrar que está tudo bem.',
        [
          opcao('watch-out', 'Watch out!'),
          opcao('thank-you', 'Thank you.'),
          opcao('its-ok', "It's OK."),
          opcao('heres-your-book', "Here's your book."),
        ]
      ),
      atividade(
        'q04-story-notebook',
        'Which school object does Flash ask Mom about?',
        'Ouça a pergunta e lembre qual objeto aparece na história.',
        'notebook',
        'Notebook significa caderno.',
        'Lembre do objeto com folhas usado para escrever.',
        [
          opcao('notebook', 'notebook', 'notebook.svg'),
          opcao('ruler', 'ruler', 'ruler.svg'),
          opcao('pencil-case', 'pencil case', 'pencil-case.svg'),
          opcao('book', 'book', 'book.svg'),
        ]
      ),
      atividade(
        'q05-story-return-objects',
        "Which things do Flash's friends return to him?",
        'Ouça e escolha o conjunto exato de três objetos.',
        'pencil-case-ruler-book',
        "Flash's friends return his pencil case, ruler, and book.",
        'Confira os três objetos: estojo, régua e livro.',
        [
          opcao(
            'pencil-case-ruler-book',
            'pencil case, ruler, and book',
            'story-set-pencil-case-ruler-book.svg'
          ),
          opcao('pencil-ruler-book', 'pencil, ruler, and book', 'story-set-pencil-ruler-book.svg'),
          opcao(
            'pencil-case-eraser-notebook',
            'pencil case, eraser, and notebook',
            'story-set-pencil-case-eraser-notebook.svg'
          ),
          opcao('bag-pen-paper', 'bag, pen, and paper', 'story-set-bag-pen-paper.svg'),
        ]
      ),
      atividade(
        'q06-story-thank-you',
        'What does Flash say after his friends help him?',
        'Ouça a pergunta e escolha a fala de agradecimento.',
        'thank-you',
        'Thank you. é a expressão usada para agradecer.',
        'Procure a expressão usada quando alguém ajuda você.',
        [
          opcao('watch-out', 'Watch out!'),
          opcao('im-sorry', "I'm sorry."),
          opcao('thank-you', 'Thank you.'),
          opcao('its-ok', "It's OK."),
        ]
      ),
      atividade(
        'q07-value-helping',
        'Which action shows helping each other?',
        'Ouça e escolha a atitude que demonstra ajuda.',
        'help-friend',
        'Helping each other means offering useful help to a friend.',
        'Procure a atitude gentil que resolve o problema do amigo.',
        [
          opcao(
            'help-friend',
            'Help a friend get their school things back.',
            'helping-return-things.svg'
          ),
          opcao('hide-ruler', "Hide a friend's ruler.", 'helping-hide-ruler.svg'),
          opcao('laugh-books', 'Laugh when a friend drops their books.', 'helping-laugh-books.svg'),
          opcao('walk-away', 'Walk away without helping.', 'helping-walk-away.svg'),
        ]
      ),
      atividade(
        'q08-phonics-bag',
        'Which word has the short “a” sound?',
        'Ouça a pergunta e reconheça o som da letra a.',
        'bag',
        'Bag tem o som curto de a praticado nesta atividade.',
        'Ouça novamente as palavras e compare o som central.',
        [opcao('pen', 'pen'), opcao('bag', 'bag'), opcao('book', 'book'), opcao('ruler', 'ruler')]
      ),
      atividade(
        'q09-phonics-black',
        'Which word has the same “a” sound as bag?',
        'Ouça e escolha a palavra com o mesmo som de a.',
        'black',
        'Black e bag compartilham o som curto de a praticado.',
        'Compare cada palavra com bag e ouça novamente.',
        [
          opcao('pen', 'pen'),
          opcao('book', 'book'),
          opcao('black', 'black'),
          opcao('ruler', 'ruler'),
        ]
      ),
      atividade(
        'q10-phonics-back',
        'Which word has the same “a” sound as cat?',
        'Ouça e escolha a palavra com o mesmo som de a.',
        'back',
        'Back e cat compartilham o som curto de a praticado.',
        'Compare cada palavra com cat e ouça novamente.',
        [opcao('book', 'book'), opcao('back', 'back'), opcao('pen', 'pen'), opcao('ruler', 'ruler')]
      ),
      atividade(
        'q11-phonics-different',
        'Which word does NOT have the same “a” sound as bag?',
        'Ouça e encontre a palavra com som diferente.',
        'book',
        'Book não tem o mesmo som curto de a de bag, black, back e cat.',
        'Ouça as palavras novamente e compare com bag.',
        [opcao('black', 'black'), opcao('back', 'back'), opcao('cat', 'cat'), opcao('book', 'book')]
      ),
      atividade(
        'q12-skills-desk',
        'Ruler, book, eraser. Which desk matches?',
        'Ouça os três objetos e escolha a carteira correspondente.',
        'ruler-book-eraser',
        'The matching desk has exactly a ruler, a book, and an eraser.',
        'Confira se a carteira tem exatamente régua, livro e borracha.',
        [
          opcao('ruler-book-eraser', 'ruler, book, and eraser', 'desk-set-ruler-book-eraser.svg'),
          opcao(
            'ruler-notebook-pencil',
            'ruler, notebook, and pencil',
            'desk-set-ruler-notebook-pencil.svg'
          ),
          opcao('book-pen-bag', 'book, pen, and bag', 'desk-set-book-pen-bag.svg'),
          opcao(
            'eraser-pencil-case-notebook',
            'eraser, pencil case, and notebook',
            'desk-set-eraser-pencil-case-notebook.svg'
          ),
        ]
      ),
      atividade(
        'q13-skills-take-out-ruler',
        'Take out your ruler, please. Which picture matches?',
        'Ouça o comando e escolha a ação correspondente.',
        'take-out-ruler',
        'Take out your ruler, please. pede para retirar ou pegar a régua.',
        'Observe qual cena mostra a régua saindo do estojo.',
        [
          opcao('take-out-ruler', 'Take out the ruler.', 'school-take-out-ruler.svg'),
          opcao('put-away-ruler', 'Put away the ruler.', 'school-put-away-ruler.svg'),
          opcao('open-book', 'Open the book.', 'school-open-book.svg'),
          opcao('close-bag', 'Close the bag.', 'school-close-bag.svg'),
        ]
      ),
      atividade(
        'q14-skills-put-away-book',
        'Put away your book, please. Which picture matches?',
        'Ouça o comando e escolha a ação correspondente.',
        'put-away-book',
        'Put away your book, please. pede para guardar o livro.',
        'Procure a cena em que o livro entra na mochila.',
        [
          opcao('put-away-book', 'Put away the book.', 'school-put-away-book.svg'),
          opcao('open-book', 'Open the book.', 'school-open-book.svg'),
          opcao('take-pen', 'Take out a pen.', 'school-take-out-pen.svg'),
          opcao('open-bag', 'Open the bag.', 'school-open-bag.svg'),
        ]
      ),
      comImagem(
        atividade(
          'q15-skills-bag',
          "What's this?",
          'Ouça, observe a imagem e escolha a resposta completa.',
          'bag',
          "It's a bag. identifica a mochila mostrada.",
          'Observe o objeto usado para carregar os materiais escolares.',
          [
            opcao('book', "It's a book."),
            opcao('bag', "It's a bag."),
            opcao('ruler', "It's a ruler."),
            opcao('pencil-case', "It's a pencil case."),
          ]
        ),
        'schoolbag.svg',
        'Uma mochila escolar.'
      ),
      comImagem(
        atividade(
          'q16-senses-look',
          'Which word means “olhar”?',
          'Ouça e escolha a palavra em inglês correta.',
          'look',
          'Look significa olhar.',
          'Pense na ação feita com os olhos.',
          [
            opcao('listen', 'listen'),
            opcao('look', 'look'),
            opcao('smell', 'smell'),
            opcao('touch', 'touch'),
          ]
        ),
        'sense-look.svg',
        'Dois olhos observando uma estrela.'
      ),
      comImagem(
        atividade(
          'q17-senses-listen',
          'What do you do with a song?',
          'Ouça e escolha a ação relacionada à música.',
          'listen',
          'We listen to a song. Listen significa ouvir ou escutar.',
          'Pense na ação feita com os ouvidos.',
          [
            opcao('smell', 'smell'),
            opcao('taste', 'taste'),
            opcao('listen', 'listen'),
            opcao('touch', 'touch'),
          ]
        ),
        'sense-listen.svg',
        'Fones de ouvido com notas musicais.'
      ),
      comImagem(
        atividade(
          'q18-senses-smell',
          'What do you do with a flower to notice its scent?',
          'Ouça, observe a flor e escolha a ação correta.',
          'smell',
          'We smell a flower to notice its scent.',
          'Pense na ação usada para perceber o cheiro da flor.',
          [
            opcao('look', 'look'),
            opcao('smell', 'smell'),
            opcao('taste', 'taste'),
            opcao('touch', 'touch'),
          ]
        ),
        'sense-smell.svg',
        'Uma flor com linhas suaves indicando seu perfume.'
      ),
      comImagem(
        atividade(
          'q19-senses-taste',
          'What do you do with ice cream to know its flavor?',
          'Ouça, observe o sorvete e escolha a ação correta.',
          'taste',
          'We taste ice cream to know its flavor.',
          'Pense na ação usada para perceber o sabor de um alimento.',
          [
            opcao('listen', 'listen'),
            opcao('smell', 'smell'),
            opcao('taste', 'taste'),
            opcao('touch', 'touch'),
          ]
        ),
        'sense-taste.svg',
        'Um sorvete em uma casquinha.'
      ),
      comImagem(
        atividade(
          'q20-senses-touch',
          'What do you do with a soft toy to feel it with your hand?',
          'Ouça, observe a mão e escolha a ação correta.',
          'touch',
          'We touch a soft toy to feel it with a hand.',
          'Pense na ação feita com a mão para sentir uma textura.',
          [
            opcao('listen', 'listen'),
            opcao('smell', 'smell'),
            opcao('taste', 'taste'),
            opcao('touch', 'touch'),
          ]
        ),
        'sense-touch.svg',
        'Uma mão tocando um brinquedo macio.'
      ),
      comImagem(
        atividade(
          'q21-think-back-notebook',
          "What's this?",
          'Ouça, observe a imagem e escolha a resposta completa.',
          'notebook',
          "It's a notebook. identifica o caderno mostrado.",
          'Observe o objeto de folhas reunidas para escrever.',
          [
            opcao('notebook', "It's a notebook."),
            opcao('pencil', "It's a pencil."),
            opcao('pencil-case', "It's a pencil case."),
            opcao('ruler', "It's a ruler."),
          ]
        ),
        'notebook.svg',
        'Um caderno escolar.'
      ),
      comImagem(
        atividade(
          'q22-think-back-short-answer',
          'Is it a pencil case?',
          'Ouça, observe a borracha e escolha a resposta curta.',
          'no',
          "No, it isn't. A imagem mostra uma borracha, não um estojo.",
          'Compare pencil case, estojo, com o objeto mostrado.',
          [opcao('yes', 'Yes, it is.'), opcao('no', "No, it isn't.")]
        ),
        'eraser.svg',
        'Uma borracha escolar.'
      ),
      comImagem(
        atividade(
          'q23-think-back-imperative',
          'Which instruction matches the picture?',
          'Ouça, observe a ação e escolha a instrução correta.',
          'open-book',
          'Open your book, please. corresponde ao livro sendo aberto.',
          'Observe que as mãos estão abrindo o livro.',
          [
            opcao('open-book', 'Open your book, please.'),
            opcao('close-book', 'Close your book, please.'),
            opcao('open-bag', 'Open your bag, please.'),
            opcao('sit-desk', 'Sit at your desk, please.'),
          ]
        ),
        'school-open-book.svg',
        'Duas mãos abrindo um livro.'
      ),
      atividade(
        'q24-think-back-listen-to',
        'You ___ a song.',
        'Ouça e complete a frase com a expressão correta.',
        'listen-to',
        'We listen to a song. A expressão completa é listen to.',
        'Lembre da preposição que acompanha listen antes de song.',
        [
          opcao('look-at', 'look at'),
          opcao('listen-to', 'listen to'),
          opcao('smell', 'smell'),
          opcao('touch', 'touch'),
        ]
      ),
      atividade(
        'q25-think-back-thank-you',
        'Your friend gives your ruler back. What do you say?',
        'Ouça a situação e escolha a resposta gentil.',
        'thank-you',
        'Thank you. agradece ao amigo que devolveu a régua.',
        'Pense no que dizemos quando alguém nos ajuda.',
        [
          opcao('watch-out', 'Watch out!'),
          opcao('im-sorry', "I'm sorry."),
          opcao('its-ok', "It's OK."),
          opcao('thank-you', 'Thank you.'),
        ]
      ),
    ],
  });
})();
