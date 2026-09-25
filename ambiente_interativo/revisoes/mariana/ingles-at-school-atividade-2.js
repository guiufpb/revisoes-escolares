(function () {
  'use strict';

  var UNIDADE_ID = 'at-school-atividade-2';
  var REVISAO_ID = 'mariana-ingles-at-school-atividade-2';

  function item(id, ingles, portugues, imagem, unidadeAudio) {
    var registro = { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
    if (unidadeAudio) registro.unidadeAudio = unidadeAudio;
    return registro;
  }

  function opcao(id, texto, traducao, imagem) {
    var registro = { id: id, texto: texto };
    if (traducao) registro.traducao = traducao;
    if (imagem) registro.imagem = imagem;
    return registro;
  }

  function atividade(id, pergunta, instrucao, correta, explicacao, feedbackErro, alternativas) {
    var registro = {
      id: id,
      perguntaIngles: pergunta,
      instrucaoPortugues: instrucao,
      respostaCorreta: correta,
      explicacao: explicacao,
      feedbackErro: feedbackErro,
      alternativas: alternativas,
    };
    if (REVISOES_POS_RESPOSTA[id]) registro.revisaoPosResposta = REVISOES_POS_RESPOSTA[id];
    return registro;
  }

  function comImagem(questao, imagem, textoAlternativo) {
    questao.imagemEnunciado = imagem;
    questao.imagemEnunciadoAlt = textoAlternativo;
    return questao;
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

  var REVISOES_POS_RESPOSTA = {
    'q01-pencil-visual': revisao(
      'Qual objeto é um lápis?',
      'pencil',
      'lápis',
      'palavra',
      'palavra',
      'pencil.svg'
    ),
    'q02-ruler-visual': revisao(
      'Qual objeto é uma régua?',
      'ruler',
      'régua',
      'palavra',
      'palavra',
      'ruler.svg'
    ),
    'q03-eraser-visual': revisao(
      'Qual objeto é uma borracha?',
      'eraser',
      'borracha',
      'palavra',
      'palavra',
      'eraser.svg'
    ),
    'q04-pencil-case-whats-this': revisao(
      'O que é isto?',
      "It's a pencil case.",
      'É um estojo.',
      'frase',
      'frase',
      'pencil-case.svg'
    ),
    'q05-notebook-name': revisao(
      'Qual é o objeto escolar?',
      'notebook',
      'caderno',
      'palavra',
      'palavra',
      'notebook.svg'
    ),
    'q06-book-visual': revisao(
      'Qual imagem mostra um livro?',
      'book',
      'livro',
      'palavra',
      'palavra',
      'book.svg'
    ),
    'q07-bag-image-word': revisao(
      'Qual palavra corresponde à imagem?',
      'bag',
      'mochila',
      'palavra',
      'palavra',
      'schoolbag.svg'
    ),
    'q08-desk-name': revisao(
      'O que é isto?',
      'desk',
      'carteira escolar',
      'palavra',
      'frase',
      'desk.svg'
    ),
    'q09-paper-name': revisao(
      'Qual palavra corresponde à imagem?',
      'paper',
      'papel',
      'palavra',
      'palavra',
      'paper.svg'
    ),
    'q10-pen-or-pencil': revisao(
      'Isto é uma caneta ou um lápis?',
      'pen',
      'caneta',
      'palavra',
      'palavra',
      'pen.svg'
    ),
    'q11-whats-this-meaning': revisao(
      'O que significa “What’s this?”?',
      'It asks what an object is.',
      'Ela pergunta o que é um objeto.',
      'frase',
      'frase'
    ),
    'q12-ruler-whats-this': revisao(
      'O que é isto?',
      "It's a ruler.",
      'É uma régua.',
      'frase',
      'frase',
      'ruler.svg'
    ),
    'q13-book-whats-this': revisao(
      'O que é isto?',
      "It's a book.",
      'É um livro.',
      'frase',
      'frase',
      'book.svg'
    ),
    'q14-pencil-affirmative': revisao(
      'É um lápis?',
      'Yes, it is.',
      'Sim, é.',
      'frase',
      'frase',
      'pencil.svg'
    ),
    'q15-pen-negative': revisao(
      'É um lápis?',
      "No, it isn't.",
      'Não, não é.',
      'frase',
      'frase',
      'pen.svg'
    ),
    'q16-eraser-affirmative': revisao(
      'É uma borracha?',
      'Yes, it is.',
      'Sim, é.',
      'frase',
      'frase',
      'eraser.svg'
    ),
    'q17-notebook-bag-negative': revisao(
      'É uma mochila?',
      "No, it isn't.",
      'Não, não é.',
      'frase',
      'frase',
      'notebook.svg'
    ),
    'q18-confirm-ruler': revisao(
      'Qual pergunta confirma se isto é uma régua?',
      'Is it a ruler?',
      'É uma régua?',
      'frase',
      'frase',
      'ruler.svg'
    ),
    'q19-ask-unknown-object': revisao(
      'Qual pergunta pede o nome de um objeto desconhecido?',
      "What's this?",
      'O que é isto?',
      'frase',
      'frase',
      'pencil-case.svg'
    ),
    'q20-suspect-pencil': revisao(
      'Qual pergunta confirma se isto é um lápis?',
      'Is it a pencil?',
      'É um lápis?',
      'frase',
      'frase',
      'pencil.svg'
    ),
    'q21-open-book-command': revisao(
      'Qual instrução corresponde à imagem?',
      'Open your book, please.',
      'Abra seu livro, por favor.',
      'frase',
      'frase',
      'school-open-book.svg'
    ),
    'q22-close-bag-command': revisao(
      'Qual instrução corresponde à imagem?',
      'Close your bag, please.',
      'Feche sua mochila, por favor.',
      'frase',
      'frase',
      'school-close-bag.svg'
    ),
    'q23-sit-at-desk-command': revisao(
      'Qual instrução corresponde à imagem?',
      'Sit at your desk, please.',
      'Sente-se em sua carteira, por favor.',
      'frase',
      'frase',
      'school-sit-at-desk.svg'
    ),
    'q24-pass-pen-command': revisao(
      'Qual instrução corresponde à imagem?',
      'Pass me a pen, please.',
      'Passe-me uma caneta, por favor.',
      'frase',
      'frase',
      'school-pass-pen.svg'
    ),
    'q25-teacher-open-book': revisao(
      'O que a professora quer que a estudante faça?',
      'Open your book, please.',
      'Abra seu livro, por favor.',
      'frase',
      'frase',
      'school-teacher-open-book.svg'
    ),
  };

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.marianaAtSchoolAtividade2 = {
    perfil: 'mariana',
    revisaoId: REVISAO_ID,
    unidadeId: UNIDADE_ID,
    chaveArmazenamento: 'revisoesEscolares.mariana.ingles.atSchoolAtividade2.v1',
  };

  window.RegistroIngles.registrar({
    id: UNIDADE_ID,
    versao: 1,
    titulo: 'At School · Activity 2',
    subtitulo: 'English Review · At School',
    descricao:
      'Ouça cada palavra ou frase e copie em inglês. Depois, ouça cada pergunta antes de escolher a resposta.',
    imagemCabecalho: 'desk.svg',
    perfisDisponiveis: ['mariana'],
    correcaoPorQuestao: true,
    exigirAudioPerguntaAntesDeResponder: true,
    revisaoPosResposta: { obrigatoria: true, pausaMs: 350 },
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
    mensagemAtividades:
      'Great work! Você ouviu e escreveu os 25 itens. Agora ouça cada pergunta para liberar as respostas.',
    mensagemFinal:
      'Mariana, great work! Você praticou objetos, perguntas e comandos da escola em inglês.',
    grupos: [
      {
        id: 'school-objects',
        titulo: 'School Objects',
        traducao: 'Objetos escolares',
        instrucao:
          'Escolha um objeto, ouça a palavra em inglês e copie exatamente como ela aparece.',
        itens: [
          item('ruler', 'ruler', 'régua', 'ruler.svg'),
          item('pen', 'pen', 'caneta', 'pen.svg'),
          item('book', 'book', 'livro', 'book.svg'),
          item('eraser', 'eraser', 'borracha', 'eraser.svg'),
          item('pencil-case', 'pencil case', 'estojo', 'pencil-case.svg'),
          item('pencil', 'pencil', 'lápis', 'pencil.svg'),
          item('desk', 'desk', 'carteira escolar', 'desk.svg'),
          item('notebook', 'notebook', 'caderno', 'notebook.svg'),
          item('bag', 'bag', 'mochila', 'schoolbag.svg'),
          item('paper', 'paper', 'papel', 'paper.svg'),
        ],
      },
      {
        id: 'school-questions',
        titulo: 'Questions and Answers',
        traducao: 'Perguntas e respostas',
        instrucao: 'Ouça cada pergunta ou resposta completa e depois copie a frase em inglês.',
        itens: [
          item('whats-this', "What's this?", 'O que é isto?', 'pencil-case.svg', 'frase'),
          item('its-a-pencil', "It's a pencil.", 'É um lápis.', 'pencil.svg', 'frase'),
          item('is-it-a-pencil', 'Is it a pencil?', 'É um lápis?', 'pencil.svg', 'frase'),
          item('yes-it-is', 'Yes, it is.', 'Sim, é.', 'star.svg', 'frase'),
          item('no-it-isnt', "No, it isn't.", 'Não, não é.', 'star.svg', 'frase'),
          item('is-it-an-eraser', 'Is it an eraser?', 'É uma borracha?', 'eraser.svg', 'frase'),
        ],
      },
      {
        id: 'classroom-instructions',
        titulo: 'Classroom Instructions',
        traducao: 'Instruções da sala',
        instrucao: 'Ouça o comando completo e copie a frase em inglês.',
        itens: [
          item(
            'sit-at-your-desk',
            'Sit at your desk, please.',
            'Sente-se em sua carteira, por favor.',
            'school-sit-at-desk.svg',
            'frase'
          ),
          item('get-a-pen', 'Get a pen.', 'Pegue uma caneta.', 'pen.svg', 'frase'),
          item(
            'open-your-book',
            'Open your book, please.',
            'Abra seu livro, por favor.',
            'school-open-book.svg',
            'frase'
          ),
          item(
            'close-your-bag',
            'Close your bag, please.',
            'Feche sua mochila, por favor.',
            'school-close-bag.svg',
            'frase'
          ),
          item(
            'write-one-to-ten',
            'Write one to ten.',
            'Escreva de um a dez.',
            'paper.svg',
            'frase'
          ),
          item(
            'pass-me-a-pen',
            'Pass me a pen, please.',
            'Passe-me uma caneta, por favor.',
            'school-pass-pen.svg',
            'frase'
          ),
          item(
            'open-your-bag',
            'Open your bag, please.',
            'Abra sua mochila, por favor.',
            'schoolbag.svg',
            'frase'
          ),
          item(
            'close-your-book',
            'Close your book, please.',
            'Feche seu livro, por favor.',
            'book.svg',
            'frase'
          ),
          item(
            'pass-me-your-ruler',
            'Pass me your ruler, please.',
            'Passe-me sua régua, por favor.',
            'ruler.svg',
            'frase'
          ),
        ],
      },
    ],
    atividades: [
      atividade(
        'q01-pencil-visual',
        'Which object is a pencil?',
        'Ouça a pergunta e escolha a imagem do lápis.',
        'pencil',
        'Pencil significa lápis.',
        'Ouça novamente e procure o objeto usado para escrever.',
        [
          opcao('pen', 'pen', '', 'pen.svg'),
          opcao('pencil', 'pencil', '', 'pencil.svg'),
          opcao('ruler', 'ruler', '', 'ruler.svg'),
          opcao('eraser', 'eraser', '', 'eraser.svg'),
        ]
      ),
      atividade(
        'q02-ruler-visual',
        'Which object is a ruler?',
        'Ouça a pergunta e escolha a imagem da régua.',
        'ruler',
        'Ruler significa régua.',
        'Procure o objeto comprido usado para medir.',
        [
          opcao('book', 'book', '', 'book.svg'),
          opcao('ruler', 'ruler', '', 'ruler.svg'),
          opcao('paper', 'paper', '', 'paper.svg'),
          opcao('pencil-case', 'pencil case', '', 'pencil-case.svg'),
        ]
      ),
      atividade(
        'q03-eraser-visual',
        'Which object is an eraser?',
        'Ouça a pergunta e escolha a imagem da borracha.',
        'eraser',
        'Eraser significa borracha.',
        'Procure o objeto usado para apagar.',
        [
          opcao('notebook', 'notebook', '', 'notebook.svg'),
          opcao('eraser', 'eraser', '', 'eraser.svg'),
          opcao('desk', 'desk', '', 'desk.svg'),
          opcao('pen', 'pen', '', 'pen.svg'),
        ]
      ),
      comImagem(
        atividade(
          'q04-pencil-case-whats-this',
          "What's this?",
          'Ouça a pergunta, observe a imagem e escolha a resposta.',
          'pencil-case',
          "It's a pencil case. significa 'É um estojo.'.",
          'Observe onde os lápis e as canetas podem ser guardados.',
          [
            opcao('book', "It's a book."),
            opcao('bag', "It's a bag."),
            opcao('pencil-case', "It's a pencil case."),
            opcao('notebook', "It's a notebook."),
          ]
        ),
        'pencil-case.svg',
        'Um estojo escolar.'
      ),
      comImagem(
        atividade(
          'q05-notebook-name',
          'What is the school object?',
          'Ouça e escolha o nome do objeto mostrado.',
          'notebook',
          'Notebook significa caderno.',
          'O objeto mostrado tem folhas reunidas para escrever.',
          [
            opcao('paper', 'paper'),
            opcao('notebook', 'notebook'),
            opcao('book', 'book'),
            opcao('desk', 'desk'),
          ]
        ),
        'notebook.svg',
        'Um caderno escolar.'
      ),
      atividade(
        'q06-book-visual',
        'Which picture shows a book?',
        'Ouça e escolha a imagem do livro.',
        'book',
        'Book significa livro.',
        'Procure o objeto que abrimos para ler.',
        [
          opcao('bag', 'bag', '', 'schoolbag.svg'),
          opcao('book', 'book', '', 'book.svg'),
          opcao('pencil', 'pencil', '', 'pencil.svg'),
          opcao('paper', 'paper', '', 'paper.svg'),
        ]
      ),
      comImagem(
        atividade(
          'q07-bag-image-word',
          'Which word matches the picture?',
          'Ouça e escolha a palavra que corresponde à imagem.',
          'bag',
          'Bag significa mochila ou bolsa.',
          'A imagem mostra um objeto usado para carregar o material escolar.',
          [
            opcao('desk', 'desk'),
            opcao('paper', 'paper'),
            opcao('bag', 'bag'),
            opcao('eraser', 'eraser'),
          ]
        ),
        'schoolbag.svg',
        'Uma mochila escolar.'
      ),
      comImagem(
        atividade(
          'q08-desk-name',
          'What is this?',
          'Ouça e escolha o nome do móvel escolar.',
          'desk',
          'Desk significa carteira ou mesa escolar.',
          'Na sala de aula, a criança se senta junto deste móvel.',
          [
            opcao('desk', 'desk'),
            opcao('bag', 'bag'),
            opcao('notebook', 'notebook'),
            opcao('pencil-case', 'pencil case'),
          ]
        ),
        'desk.svg',
        'Uma carteira escolar.'
      ),
      comImagem(
        atividade(
          'q09-paper-name',
          'Which word matches the picture?',
          'Ouça e escolha a palavra correta para a imagem.',
          'paper',
          'Paper significa papel.',
          'Observe a folha usada para escrever ou desenhar.',
          [
            opcao('book', 'book'),
            opcao('ruler', 'ruler'),
            opcao('paper', 'paper'),
            opcao('pen', 'pen'),
          ]
        ),
        'paper.svg',
        'Uma folha de papel.'
      ),
      comImagem(
        atividade(
          'q10-pen-or-pencil',
          'Is this a pen or a pencil?',
          'Ouça e escolha o objeto mostrado.',
          'pen',
          'The object is a pen. O objeto é uma caneta.',
          'Compare pen, caneta, com pencil, lápis.',
          [opcao('pen', 'pen'), opcao('pencil', 'pencil')]
        ),
        'pen.svg',
        'Uma caneta.'
      ),
      atividade(
        'q11-whats-this-meaning',
        "What does 'What's this?' mean?",
        'Ouça e escolha o significado da pergunta.',
        'what-is-this',
        "What's this? significa 'O que é isto?'.",
        'A pergunta pede para identificar um objeto.',
        [
          opcao('what-is-this', 'It asks what an object is.'),
          opcao('where-is-this', 'It asks where an object is.'),
          opcao('is-it-a-pencil', 'It asks whether something is a pencil.'),
          opcao('open-the-book', 'It tells someone to open a book.'),
        ]
      ),
      comImagem(
        atividade(
          'q12-ruler-whats-this',
          "What's this?",
          'Ouça, observe a imagem e escolha a resposta completa.',
          'ruler',
          "It's a ruler. significa 'É uma régua.'.",
          "Use It's a... para identificar o objeto.",
          [
            opcao('pen', "It's a pen."),
            opcao('ruler', "It's a ruler."),
            opcao('pencil', "It's a pencil."),
            opcao('eraser', "It's an eraser."),
          ]
        ),
        'ruler.svg',
        'Uma régua.'
      ),
      comImagem(
        atividade(
          'q13-book-whats-this',
          "What's this?",
          'Ouça, observe a imagem e escolha a resposta completa.',
          'book',
          "It's a book. significa 'É um livro.'.",
          'O objeto mostrado é usado para leitura.',
          [
            opcao('notebook', "It's a notebook."),
            opcao('book', "It's a book."),
            opcao('bag', "It's a bag."),
            opcao('paper', "It's paper."),
          ]
        ),
        'book.svg',
        'Um livro.'
      ),
      comImagem(
        atividade(
          'q14-pencil-affirmative',
          'Is it a pencil?',
          'Ouça a pergunta e responda de acordo com a imagem.',
          'yes',
          'Yes, it is. A imagem mostra um lápis.',
          'Compare a palavra pencil com o objeto da imagem.',
          [opcao('yes', 'Yes, it is.'), opcao('no', "No, it isn't.")]
        ),
        'pencil.svg',
        'Um lápis.'
      ),
      comImagem(
        atividade(
          'q15-pen-negative',
          'Is it a pencil?',
          'Ouça a pergunta e responda de acordo com a imagem.',
          'no',
          "No, it isn't. A imagem mostra uma caneta, não um lápis.",
          'Pen é caneta; pencil é lápis.',
          [opcao('yes', 'Yes, it is.'), opcao('no', "No, it isn't.")]
        ),
        'pen.svg',
        'Uma caneta.'
      ),
      comImagem(
        atividade(
          'q16-eraser-affirmative',
          'Is it an eraser?',
          'Ouça a pergunta e responda de acordo com a imagem.',
          'yes',
          'Yes, it is. A imagem mostra uma borracha.',
          'Eraser significa borracha.',
          [opcao('yes', 'Yes, it is.'), opcao('no', "No, it isn't.")]
        ),
        'eraser.svg',
        'Uma borracha.'
      ),
      comImagem(
        atividade(
          'q17-notebook-bag-negative',
          'Is it a bag?',
          'Ouça a pergunta e responda de acordo com a imagem.',
          'no',
          "No, it isn't. A imagem mostra um notebook, um caderno.",
          'Bag é mochila; notebook é caderno.',
          [opcao('yes', 'Yes, it is.'), opcao('no', "No, it isn't.")]
        ),
        'notebook.svg',
        'Um caderno.'
      ),
      comImagem(
        atividade(
          'q18-confirm-ruler',
          'Which question checks if this is a ruler?',
          'Ouça e escolha a pergunta adequada para confirmar o objeto.',
          'is-ruler',
          'Is it a ruler? pergunta se o objeto é uma régua.',
          'Escolha uma pergunta que comece com Is it... e nomeie ruler.',
          [
            opcao('is-ruler', 'Is it a ruler?'),
            opcao('is-pen', 'Is it a pen?'),
            opcao('its-ruler', "It's a ruler."),
            opcao('whats-ruler', "What's a pencil?"),
          ]
        ),
        'ruler.svg',
        'Uma régua.'
      ),
      comImagem(
        atividade(
          'q19-ask-unknown-object',
          'Which question asks the name of an unknown object?',
          'Ouça e escolha a pergunta usada quando não sabemos o nome do objeto.',
          'whats-this',
          "What's this? pergunta 'O que é isto?'.",
          'Procure a pergunta que pede a identificação do objeto.',
          [
            opcao('whats-this', "What's this?"),
            opcao('yes-it-is', 'Yes, it is.'),
            opcao('get-a-pen', 'Get a pen.'),
            opcao('is-pencil', 'Is it a pencil?'),
          ]
        ),
        'pencil-case.svg',
        'Um objeto escolar ainda não identificado.'
      ),
      comImagem(
        atividade(
          'q20-suspect-pencil',
          'Which question checks if this is a pencil?',
          'Ouça e escolha a pergunta que confirma a hipótese.',
          'is-pencil',
          'Is it a pencil? pergunta se o objeto é um lápis.',
          'A resposta deve ser uma pergunta sobre pencil.',
          [
            opcao('is-pencil', 'Is it a pencil?'),
            opcao('its-pencil', "It's a pencil."),
            opcao('is-eraser', 'Is it an eraser?'),
            opcao('whats-this', "What's this?"),
          ]
        ),
        'pencil.svg',
        'Um lápis.'
      ),
      comImagem(
        atividade(
          'q21-open-book-command',
          'Which instruction matches the picture?',
          'Ouça, observe a ação e escolha o comando correto.',
          'open-book',
          'Open your book, please. pede para abrir o livro.',
          'Observe que o livro está sendo aberto.',
          [
            opcao('open-book', 'Open your book, please.'),
            opcao('close-book', 'Close your book, please.'),
            opcao('open-bag', 'Open your bag, please.'),
            opcao('get-pen', 'Get a pen.'),
          ]
        ),
        'school-open-book.svg',
        'Duas mãos abrindo um livro.'
      ),
      comImagem(
        atividade(
          'q22-close-bag-command',
          'Which instruction matches the picture?',
          'Ouça, observe a ação e escolha o comando correto.',
          'close-bag',
          'Close your bag, please. pede para fechar a mochila.',
          'Observe o zíper fechando a mochila.',
          [
            opcao('open-bag', 'Open your bag, please.'),
            opcao('close-bag', 'Close your bag, please.'),
            opcao('close-book', 'Close your book, please.'),
            opcao('sit-desk', 'Sit at your desk, please.'),
          ]
        ),
        'school-close-bag.svg',
        'Uma mão fechando o zíper de uma mochila.'
      ),
      comImagem(
        atividade(
          'q23-sit-at-desk-command',
          'Which instruction matches the picture?',
          'Ouça, observe a ação e escolha o comando correto.',
          'sit-desk',
          'Sit at your desk, please. pede para sentar na carteira.',
          'A criança está sentada junto à carteira escolar.',
          [
            opcao('sit-desk', 'Sit at your desk, please.'),
            opcao('get-pen', 'Get a pen.'),
            opcao('write-numbers', 'Write one to ten.'),
            opcao('pass-ruler', 'Pass me your ruler, please.'),
          ]
        ),
        'school-sit-at-desk.svg',
        'Uma criança sentada em sua carteira escolar.'
      ),
      comImagem(
        atividade(
          'q24-pass-pen-command',
          'Which instruction matches the picture?',
          'Ouça, observe a ação e escolha o comando correto.',
          'pass-pen',
          'Pass me a pen, please. pede que a caneta seja passada a outra pessoa.',
          'Uma mão entrega a caneta para outra.',
          [
            opcao('get-pen', 'Get a pen.'),
            opcao('pass-pen', 'Pass me a pen, please.'),
            opcao('pass-ruler', 'Pass me your ruler, please.'),
            opcao('write-numbers', 'Write one to ten.'),
          ]
        ),
        'school-pass-pen.svg',
        'Uma mão passando uma caneta para outra mão.'
      ),
      comImagem(
        atividade(
          'q25-teacher-open-book',
          'What does the teacher want the student to do?',
          'Ouça, observe a professora e escolha o comando correto.',
          'open-book',
          'Open your book, please. é o comando para abrir o livro.',
          'Observe o gesto da professora e o livro aberto.',
          [
            opcao('close-bag', 'Close your bag, please.'),
            opcao('open-book', 'Open your book, please.'),
            opcao('sit-desk', 'Sit at your desk, please.'),
            opcao('pass-pen', 'Pass me a pen, please.'),
          ]
        ),
        'school-teacher-open-book.svg',
        'Uma professora indicando que a estudante deve abrir o livro.'
      ),
    ],
  });
})();
