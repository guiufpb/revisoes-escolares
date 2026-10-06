(function () {
  'use strict';

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.alicePlayTimeUnidade6Outubro2026 = {
    perfil: 'alice',
    revisaoId: 'alice-ingles-play-time-unidade-6-outubro-2026',
    unidadeId: 'play-time-unidade-6-outubro-2026',
    chaveArmazenamento: 'revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1',
  };

  window.RegistroIngles.registrar({
    id: 'play-time-unidade-6-outubro-2026',
    versao: 1,
    titulo: 'English Review · Play Time · Unit 6',
    subtitulo: 'Toys, Colors & Indoor / Outdoor Activities',
    descricao:
      'Ouça, repita e transcreva os 25 itens com o modelo escrito de apoio. Observe as seis cenas de preparação e pratique as 25 questões.',
    imagemCabecalho: 'play-time-robot.svg',
    perfisDisponiveis: ['alice'],
    ordemAlternativasFixa: true,
    correcaoPorQuestao: true,
    exigirAudioPerguntaAntesDeResponder: true,
    revisaoPosResposta: {
      obrigatoria: true,
      pausaMs: 350,
      manterTelaAposErro: true,
    },
    layout: {
      desktopAmplo: true,
    },
    praticaEscrita: {
      habilitada: true,
      obrigatoriaParaAtividades: true,
    },
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice',
          principal: true,
          chaveArmazenamento: 'revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1',
        },
        {
          id: 'mariana',
          nome: 'Mariana',
          chaveArmazenamento:
            'revisoesEscolares.mariana.ingles.playTimeUnidade6Outubro2026Compartilhada.v1',
        },
      ],
    },
    pronuncia: {
      descricao:
        'Treine dez conversas curtas. Esta etapa opcional não muda seus pontos nem a conclusão de Play Time.',
      mensagemIndisponibilidade:
        'Se o microfone, o gateway ou o Azure não estiverem disponíveis, você pode continuar ouvindo e repetindo. Play Time permanece concluída.',
      id: 'play-time-unidade-6-outubro-2026-conversacao-v1',
      habilitada: true,
      gatewayUrl: 'http://127.0.0.1:5190/api/pronunciation',
      duracaoMaximaSegundos: 15,
      timeoutMs: 12000,
      faixas: {
        muitoBem: 75,
        quase: 45,
      },
      pares: [
        {
          id: 'p01-robot',
          pergunta: "What's this?",
          resposta: "It's a robot.",
          imagem: 'play-time-robot.svg',
          imagemAlt: 'O que é isto? É um robô.',
        },
        {
          id: 'p02-teddy',
          pergunta: "What's this?",
          resposta: "It's a teddy bear.",
          imagem: 'play-time-teddy-bear.svg',
          imagemAlt: 'O que é isto? É um urso de pelúcia.',
        },
        {
          id: 'p03-doll',
          pergunta: 'Is it a doll?',
          resposta: 'Yes, it is.',
          imagem: 'play-time-doll.svg',
          imagemAlt: 'É uma boneca? Sim, é.',
        },
        {
          id: 'p04-color',
          pergunta: 'What color is it?',
          resposta: "It's red.",
          imagem: 'play-time-red-car.svg',
          imagemAlt: 'De que cor é? É vermelho.',
        },
        {
          id: 'p05-count',
          pergunta: 'How many balls are there?',
          resposta: 'There are four balls.',
          imagem: 'play-time-four-balls.svg',
          imagemAlt: 'Quantas bolas há? Há quatro bolas.',
        },
        {
          id: 'p06-boys',
          pergunta: 'How many boys are holding balloons?',
          resposta: 'Three boys are holding balloons.',
          imagem: 'play-time-children-balloons.svg',
          imagemAlt: 'Quantos meninos estão segurando balões? Três meninos estão segurando balões.',
        },
        {
          id: 'p07-girls',
          pergunta: 'How many girls are holding balloons?',
          resposta: 'Two girls are holding balloons.',
          imagem: 'play-time-children-balloons.svg',
          imagemAlt: 'Quantas meninas estão segurando balões? Duas meninas estão segurando balões.',
        },
        {
          id: 'p08-position',
          pergunta: 'Where is the robot?',
          resposta: "It's under the table.",
          imagem: 'play-time-robot-under-table.svg',
          imagemAlt: 'Onde está o robô? Está debaixo da mesa.',
        },
        {
          id: 'p09-outside',
          pergunta: 'Where do you play?',
          resposta: 'I play outside.',
          imagem: 'play-time-play-outside.svg',
          imagemAlt: 'Onde você brinca? Eu brinco do lado de fora.',
        },
        {
          id: 'p10-material',
          pergunta: 'What is the kite made of?',
          resposta: "It's made of paper.",
          imagem: 'play-time-paper-kite.svg',
          imagemAlt: 'De que material é feita a pipa? É feita de papel.',
        },
      ],
    },
    historia: {
      tituloIngles: 'Look and Learn · Play Time',
      tituloPortugues: 'Preparação visual · Brinquedos e brincadeiras',
      pausaMs: 350,
      questoesComConsulta: 25,
      cenas: [
        {
          id: 's01-toys',
          tituloIngles: 'Toys',
          tituloPortugues: 'Brinquedos',
          textoIngles:
            'A car and a train are toys. A teddy bear is a soft toy. A spinning top spins.',
          textoPortugues:
            'Um carro e um trem são brinquedos. Um urso de pelúcia é um brinquedo macio. Um pião gira.',
          imagem: 'play-time-learn-toys.svg',
          imagemAlt:
            'Quatro brinquedos separados: carro, trem, urso de pelúcia e pião. Sem personagem de livro ou marca.',
        },
        {
          id: 's02-colors-numbers',
          tituloIngles: 'Colors and Numbers',
          tituloPortugues: 'Cores e números',
          textoIngles:
            'Red, blue, yellow, green, orange, pink, purple. Count: one, two, three, four, five, six, seven, eight, nine, ten. Count each toy once. A soccer ball, a tennis ball, a beach ball, and a basketball are balls.',
          textoPortugues:
            'Vermelho, azul, amarelo, verde, laranja, rosa, roxo. Conte: um, dois, três, quatro, cinco, seis, sete, oito, nove, dez. Conte cada brinquedo uma vez. Uma bola de futebol, uma bola de tênis, uma bola de praia e uma bola de basquete são bolas.',
          imagem: 'play-time-learn-colors-numbers.svg',
          imagemAlt:
            'Sete amostras de cor com nomes em inglês e português; faixa de 1 a 10 com numeral e palavra inglesa. Exemplo de seis pipas para contagem, diferente das cenas avaliativas. Quatro miniaturas distintas, com nome EN/PT: soccer ball (bola de futebol), tennis ball (bola de tênis), beach ball (bola de praia), basketball (bola de basquete). Esses nomes são ensinados aqui antes de Q22.',
        },
        {
          id: 's03-positions',
          tituloIngles: 'On and Under',
          tituloPortugues: 'Posições',
          textoIngles:
            'The boat is on the box. The ball is under the chair. On means on top. Under means below.',
          textoPortugues:
            'O barco está sobre a caixa. A bola está debaixo da cadeira. On indica sobre. Under indica debaixo.',
          imagem: 'play-time-learn-positions.svg',
          imagemAlt:
            'Barco apoiado na parte superior da caixa; bola abaixo do assento de uma cadeira e entre suas pernas. Exemplos diferentes dos objetos cobrados em Q12–Q15.',
        },
        {
          id: 's04-places',
          tituloIngles: 'Inside and Outside',
          tituloPortugues: 'Lugares para brincar',
          textoIngles:
            'Inside means indoors. Outside means outdoors. You can draw inside. You can ride a bike outside. Read books. Fly a kite. Ride a bike. Play with a doll. Some toys can be used inside and outside. Look at the place in each picture.',
          textoPortugues:
            'Inside significa dentro, em um ambiente interno. Outside significa fora, ao ar livre. Você pode desenhar dentro de casa e andar de bicicleta do lado de fora. Ler livros. Empinar pipa. Andar de bicicleta. Brincar com boneca. Alguns brinquedos podem ser usados nos dois lugares. Observe o lugar em cada imagem.',
          imagem: 'play-time-learn-places.svg',
          imagemAlt:
            'Dois painéis: criança desenhando numa sala e outra andando de bicicleta num parque. Títulos Inside / Indoor e Outside / Outdoor. Faixa de quatro miniaturas com as ações ler, empinar pipa, pedalar e brincar com boneca, com nomes EN/PT, sem repetir as composições avaliativas. Não ensinar que um brinquedo só pode existir em um desses ambientes.',
        },
        {
          id: 's05-materials',
          tituloIngles: 'Materials',
          tituloPortugues: 'Materiais',
          textoIngles:
            "This toy car is made of metal. This teddy bear is made of fabric. This paper boat is made of paper. These blocks are made of plastic. What is it made of? It's made of paper.",
          textoPortugues:
            'Este carrinho é feito de metal. Este urso de pelúcia é feito de tecido. Este barco de papel é feito de papel. Estes blocos são feitos de plástico. De que material é feito? É feito de papel.',
          imagem: 'play-time-learn-materials.svg',
          imagemAlt:
            'Carrinho de metal com brilho metálico, urso com costuras e textura de tecido, barco dobrado de papel e blocos de plástico moldado. Cada exemplo acompanhado de pequena amostra do material e nome EN/PT. A associação vale para o objeto mostrado.',
        },
        {
          id: 's06-compare',
          tituloIngles: 'Look and Compare',
          tituloPortugues: 'Observe e compare',
          textoIngles:
            'Look at picture A and picture B. Find what changes. A toy can change color. A toy can appear or disappear.',
          textoPortugues:
            'Observe a imagem A e a imagem B. Procure o que mudou. Um brinquedo pode mudar de cor, aparecer ou desaparecer.',
          imagem: 'play-time-learn-compare.svg',
          imagemAlt:
            'Exemplo didático independente: carro verde em A e carro azul em B; uma pipa somente em A. Não usar as cenas avaliativas de sete diferenças neste exemplo.',
        },
      ],
    },
    mensagemAtividades:
      'Great work! Você ouviu e escreveu os 25 itens. Agora observe a preparação visual.',
    mensagemAposHistoria:
      'Preparação concluída! Ouça cada pergunta e escolha a resposta. Você pode consultar as seis cenas em todas as questões.',
    mensagemFinal:
      'Alice, great work! Você praticou brinquedos, cores, quantidades, posições, brincadeiras e materiais. Agora pode ouvir e praticar as dez conversas!',
    grupos: [
      {
        id: 'toys',
        titulo: 'Toys',
        traducao: 'Brinquedos',
        instrucao: 'Escolha um brinquedo, ouça em inglês e transcreva usando o modelo escrito.',
        itens: [
          {
            id: 'v01-robot',
            ingles: 'robot',
            portugues: 'robô',
            imagem: 'play-time-robot.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v02-teddy-bear',
            ingles: 'teddy bear',
            portugues: 'urso de pelúcia',
            imagem: 'play-time-teddy-bear.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v03-kite',
            ingles: 'kite',
            portugues: 'pipa',
            imagem: 'play-time-kite.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v04-doll',
            ingles: 'doll',
            portugues: 'boneca',
            imagem: 'play-time-doll.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v05-bike',
            ingles: 'bike',
            portugues: 'bicicleta',
            imagem: 'play-time-bike.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['bicycle'],
          },
          {
            id: 'v06-car',
            ingles: 'car',
            portugues: 'carro',
            imagem: 'play-time-car.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v07-lorry',
            ingles: 'lorry',
            portugues: 'caminhão de brinquedo',
            imagem: 'play-time-lorry.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['truck'],
          },
          {
            id: 'v08-train',
            ingles: 'train',
            portugues: 'trem',
            imagem: 'play-time-train.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v09-rocket',
            ingles: 'rocket',
            portugues: 'foguete',
            imagem: 'play-time-rocket.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v10-helicopter',
            ingles: 'helicopter',
            portugues: 'helicóptero',
            imagem: 'play-time-helicopter.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v11-boat',
            ingles: 'boat',
            portugues: 'barco',
            imagem: 'play-time-boat.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v12-plane',
            ingles: 'plane',
            portugues: 'avião',
            imagem: 'play-time-plane.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['airplane', 'aeroplane'],
          },
          {
            id: 'v13-controller',
            ingles: 'video game controller',
            portugues: 'controle de videogame',
            imagem: 'play-time-controller.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v14-ball',
            ingles: 'ball',
            portugues: 'bola',
            imagem: 'play-time-ball.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v15-balloon',
            ingles: 'balloon',
            portugues: 'balão',
            imagem: 'play-time-balloon.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v16-blocks',
            ingles: 'blocks',
            portugues: 'blocos de montar',
            imagem: 'play-time-blocks.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v17-marbles',
            ingles: 'marbles',
            portugues: 'bolinhas de gude',
            imagem: 'play-time-marbles.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: [],
          },
          {
            id: 'v18-yo-yo',
            ingles: 'yo-yo',
            portugues: 'ioiô',
            imagem: 'play-time-yo-yo.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['yoyo', 'yo yo'],
          },
          {
            id: 'v19-spinning-top',
            ingles: 'spinning top',
            portugues: 'pião',
            imagem: 'play-time-spinning-top.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['top'],
          },
        ],
      },
      {
        id: 'questions-and-answers',
        titulo: 'Questions and Answers',
        traducao: 'Perguntas e respostas',
        instrucao:
          'Ouça a pergunta e a resposta juntas. Transcreva a frase completa com o modelo de apoio.',
        itens: [
          {
            id: 'f20-identify',
            ingles: "What's this? It's a robot.",
            portugues: 'O que é isto? É um robô.',
            imagem: 'play-time-robot.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [
              'What is this? It is a robot.',
              "What's this? It is a robot.",
              "What is this? It's a robot.",
              "What's this? It’s a robot.",
              "What’s this? It's a robot.",
              'What’s this? It’s a robot.',
              'What’s this? It is a robot.',
              'What is this? It’s a robot.',
            ],
          },
          {
            id: 'f21-color',
            ingles: "What color is it? It's blue.",
            portugues: 'De que cor é? É azul.',
            imagem: 'play-time-blue-ball.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [
              "What colour is it? It's blue.",
              'What color is it? It is blue.',
              'What colour is it? It is blue.',
              'What color is it? It’s blue.',
              'What colour is it? It’s blue.',
            ],
          },
          {
            id: 'f22-count',
            ingles: 'How many balls are there? There are four balls.',
            portugues: 'Quantas bolas há? Há quatro bolas.',
            imagem: 'play-time-four-balls.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [],
          },
          {
            id: 'f23-on',
            ingles: "Where is the doll? It's on the table.",
            portugues: 'Onde está a boneca? Está sobre a mesa.',
            imagem: 'play-time-doll-on-table.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [
              'Where is the doll? It is on the table.',
              'Where is the doll? It’s on the table.',
            ],
          },
          {
            id: 'f24-under',
            ingles: "Where is the robot? It's under the table.",
            portugues: 'Onde está o robô? Está debaixo da mesa.',
            imagem: 'play-time-robot-under-table.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [
              'Where is the robot? It is under the table.',
              'Where is the robot? It’s under the table.',
            ],
          },
          {
            id: 'f25-outside',
            ingles: 'Where do you play? I play outside.',
            portugues: 'Onde você brinca? Eu brinco do lado de fora.',
            imagem: 'play-time-play-outside.svg',
            unidadeAudio: 'frase',
            variantesEscrita: [],
          },
        ],
      },
    ],
    atividades: [
      {
        id: 'q01-listen-helicopter',
        perguntaIngles: 'Find the helicopter.',
        instrucaoPortugues: 'Ouça e escolha a figura do brinquedo.',
        respostaCorreta: 'q01-listen-helicopter-helicopter',
        explicacao: 'Helicopter significa helicóptero. Observe o rotor na parte superior.',
        feedbackErro: 'Ouça novamente e compare as quatro figuras.',
        alternativas: [
          {
            id: 'q01-listen-helicopter-boat',
            texto: 'Barco',
            imagem: 'play-time-boat.svg',
            rotuloAcessivel: 'Barco',
          },
          {
            id: 'q01-listen-helicopter-helicopter',
            texto: 'Helicóptero',
            imagem: 'play-time-helicopter.svg',
            rotuloAcessivel: 'Helicóptero',
          },
          {
            id: 'q01-listen-helicopter-plane',
            texto: 'Avião',
            imagem: 'play-time-plane.svg',
            rotuloAcessivel: 'Avião',
          },
          {
            id: 'q01-listen-helicopter-rocket',
            texto: 'Foguete',
            imagem: 'play-time-rocket.svg',
            rotuloAcessivel: 'Foguete',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Encontre o helicóptero.',
          respostaIngles: "It's a helicopter.",
          significadoPortugues: 'É um helicóptero.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        textoPerguntaVisivel: 'Listen and choose.',
      },
      {
        id: 'q02-listen-lorry',
        perguntaIngles: 'Find the lorry.',
        instrucaoPortugues: 'Ouça e escolha a figura do brinquedo.',
        respostaCorreta: 'q02-listen-lorry-lorry',
        explicacao: 'Lorry e truck são nomes em inglês para caminhão.',
        feedbackErro: 'Ouça novamente e observe os veículos.',
        alternativas: [
          {
            id: 'q02-listen-lorry-train',
            texto: 'Trem',
            imagem: 'play-time-train.svg',
            rotuloAcessivel: 'Trem',
          },
          {
            id: 'q02-listen-lorry-car',
            texto: 'Carro',
            imagem: 'play-time-car.svg',
            rotuloAcessivel: 'Carro',
          },
          {
            id: 'q02-listen-lorry-bike',
            texto: 'Bicicleta',
            imagem: 'play-time-bike.svg',
            rotuloAcessivel: 'Bicicleta',
          },
          {
            id: 'q02-listen-lorry-lorry',
            texto: 'Caminhão',
            imagem: 'play-time-lorry.svg',
            rotuloAcessivel: 'Caminhão',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Encontre o caminhão.',
          respostaIngles: "It's a lorry.",
          significadoPortugues: 'É um caminhão.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        textoPerguntaVisivel: 'Listen and choose.',
      },
      {
        id: 'q03-teddy-bear',
        perguntaIngles: "What's this?",
        instrucaoPortugues: 'Observe o brinquedo e escolha a resposta.',
        respostaCorreta: 'q03-teddy-bear-it-s-a-teddy-bear',
        explicacao: 'Teddy bear é urso de pelúcia.',
        feedbackErro: 'Observe as orelhas, as patas e o material macio do brinquedo.',
        alternativas: [
          {
            id: 'q03-teddy-bear-it-s-a-teddy-bear',
            texto: "It's a teddy bear.",
          },
          {
            id: 'q03-teddy-bear-it-s-a-robot',
            texto: "It's a robot.",
          },
          {
            id: 'q03-teddy-bear-it-s-a-doll',
            texto: "It's a doll.",
          },
          {
            id: 'q03-teddy-bear-it-s-a-ball',
            texto: "It's a ball.",
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'O que é isto?',
          respostaIngles: "It's a teddy bear.",
          significadoPortugues: 'É um urso de pelúcia.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-teddy-bear.svg',
        imagemEnunciadoAlt:
          'Um urso de pelúcia sozinho, com focinho, orelhas redondas, costuras e patas de pelúcia.',
      },
      {
        id: 'q04-yes-doll',
        perguntaIngles: 'Is it a doll?',
        instrucaoPortugues: 'Observe a figura e escolha a resposta à pergunta.',
        respostaCorreta: 'q04-yes-doll-yes-it-is',
        explicacao: 'A figura é uma boneca, por isso a resposta é Yes, it is.',
        feedbackErro: 'Compare o brinquedo da figura com a palavra que você ouviu.',
        alternativas: [
          {
            id: 'q04-yes-doll-no-it-isn-t',
            texto: "No, it isn't.",
          },
          {
            id: 'q04-yes-doll-it-s-a-kite',
            texto: "It's a kite.",
          },
          {
            id: 'q04-yes-doll-yes-it-is',
            texto: 'Yes, it is.',
          },
          {
            id: 'q04-yes-doll-it-s-a-robot',
            texto: "It's a robot.",
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'É uma boneca?',
          respostaIngles: 'Yes, it is.',
          significadoPortugues: 'Sim, é.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-doll.svg',
        imagemEnunciadoAlt:
          'Uma boneca de brinquedo com articulações, olhos de botão e costuras, sem parecer uma criança real.',
      },
      {
        id: 'q05-spinning-top',
        perguntaIngles: 'Which word names this toy?',
        instrucaoPortugues: 'Observe e escolha o nome do brinquedo.',
        respostaCorreta: 'q05-spinning-top-spinning-top',
        explicacao: 'Spinning top, também chamado top, significa pião.',
        feedbackErro: 'Observe a ponta em que o brinquedo se apoia para girar.',
        alternativas: [
          {
            id: 'q05-spinning-top-yo-yo',
            texto: 'yo-yo',
          },
          {
            id: 'q05-spinning-top-spinning-top',
            texto: 'spinning top',
          },
          {
            id: 'q05-spinning-top-marbles',
            texto: 'marbles',
          },
          {
            id: 'q05-spinning-top-blocks',
            texto: 'blocks',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual palavra dá nome a este brinquedo?',
          respostaIngles: "It's a spinning top.",
          significadoPortugues: 'É um pião.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-spinning-top.svg',
        imagemEnunciadoAlt:
          'Pião com ponta de apoio, corpo arredondado e eixo; sem fio entre dois discos e sem aparência de bolinha de gude.',
      },
      {
        id: 'q06-red-car',
        perguntaIngles: 'What color is the car?',
        instrucaoPortugues: 'Observe a cor principal do brinquedo.',
        respostaCorreta: 'q06-red-car-red',
        explicacao: 'Red significa vermelho. O carro mostrado é vermelho.',
        feedbackErro: 'Observe a carroceria do carro, sem contar as rodas.',
        alternativas: [
          {
            id: 'q06-red-car-red',
            texto: 'red',
          },
          {
            id: 'q06-red-car-yellow',
            texto: 'yellow',
          },
          {
            id: 'q06-red-car-blue',
            texto: 'blue',
          },
          {
            id: 'q06-red-car-green',
            texto: 'green',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'De que cor é o carro?',
          respostaIngles: "It's red.",
          significadoPortugues: 'É vermelho.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-red-car.svg',
        imagemEnunciadoAlt:
          'Carrinho com carroceria vermelha uniforme; rodas pretas e vidros neutros. A cor solicitada é a carroceria.',
      },
      {
        id: 'q07-green-robot',
        perguntaIngles: 'Find the green robot.',
        instrucaoPortugues: 'Escolha a figura que combina com a frase.',
        respostaCorreta: 'q07-green-robot-green-robot',
        explicacao: 'Green significa verde. A frase pede o robô dessa cor.',
        feedbackErro: 'Ouça a palavra da cor e compare os corpos dos robôs.',
        alternativas: [
          {
            id: 'q07-green-robot-yellow-robot',
            texto: 'Robô amarelo',
            imagem: 'play-time-yellow-robot.svg',
            rotuloAcessivel: 'Robô amarelo',
          },
          {
            id: 'q07-green-robot-red-robot',
            texto: 'Robô vermelho',
            imagem: 'play-time-red-robot.svg',
            rotuloAcessivel: 'Robô vermelho',
          },
          {
            id: 'q07-green-robot-blue-robot',
            texto: 'Robô azul',
            imagem: 'play-time-blue-robot.svg',
            rotuloAcessivel: 'Robô azul',
          },
          {
            id: 'q07-green-robot-green-robot',
            texto: 'Robô verde',
            imagem: 'play-time-green-robot.svg',
            rotuloAcessivel: 'Robô verde',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Encontre o robô verde.',
          respostaIngles: 'The robot is green.',
          significadoPortugues: 'O robô é verde.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
      },
      {
        id: 'q08-four-balls',
        perguntaIngles: 'How many balls are there?',
        instrucaoPortugues: 'Conte os brinquedos e escolha a quantidade em inglês.',
        respostaCorreta: 'q08-four-balls-four',
        explicacao: 'Four significa quatro. Há quatro bolas na cena.',
        feedbackErro: 'Conte cada bola uma vez, apontando uma de cada vez.',
        alternativas: [
          {
            id: 'q08-four-balls-one',
            texto: 'one',
          },
          {
            id: 'q08-four-balls-two',
            texto: 'two',
          },
          {
            id: 'q08-four-balls-four',
            texto: 'four',
          },
          {
            id: 'q08-four-balls-five',
            texto: 'five',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Quantas bolas há?',
          respostaIngles: 'There are four balls.',
          significadoPortugues: 'Há quatro bolas.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-four-balls.svg',
        imagemEnunciadoAlt:
          'Exatamente quatro bolas separadas, sem bolas decorativas no fundo: duas azuis, uma vermelha e uma verde.',
      },
      {
        id: 'q09-boys-balloons',
        perguntaIngles: 'How many boys are holding balloons?',
        instrucaoPortugues: 'Observe quem está segurando os fios; conte somente os meninos.',
        respostaCorreta: 'q09-boys-balloons-three',
        explicacao:
          'Contamos as crianças solicitadas, não os balões. Três meninos seguram fios de balões.',
        feedbackErro: 'Procure os meninos com fios nas mãos e conte cada menino uma vez.',
        alternativas: [
          {
            id: 'q09-boys-balloons-three',
            texto: 'three',
          },
          {
            id: 'q09-boys-balloons-four',
            texto: 'four',
          },
          {
            id: 'q09-boys-balloons-two',
            texto: 'two',
          },
          {
            id: 'q09-boys-balloons-five',
            texto: 'five',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Quantos meninos estão segurando balões?',
          respostaIngles: 'Three boys are holding balloons.',
          significadoPortugues: 'Três meninos estão segurando balões.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-children-balloons.svg',
        imagemEnunciadoAlt:
          'Cena original com sete crianças: três meninos seguram balões, duas meninas seguram balões e dois meninos não seguram balão. Um destes brinca com avião e outro com bicicleta. Um menino e uma menina seguram dois balões cada; as outras três crianças seguram um cada. Total de sete balões. Fios terminam claramente nas mãos. Mesmo asset em Q10 e nas conversas 6 e 7.',
      },
      {
        id: 'q10-girls-balloons',
        perguntaIngles: 'How many girls are holding balloons?',
        instrucaoPortugues: 'Observe a mesma cena; agora conte somente as meninas com balões.',
        respostaCorreta: 'q10-girls-balloons-two',
        explicacao:
          'Duas meninas seguram balões. Uma delas segura mais de um, mas continua sendo uma menina.',
        feedbackErro: 'Conte as meninas, mesmo quando uma delas segura mais de um balão.',
        alternativas: [
          {
            id: 'q10-girls-balloons-one',
            texto: 'one',
          },
          {
            id: 'q10-girls-balloons-two',
            texto: 'two',
          },
          {
            id: 'q10-girls-balloons-three',
            texto: 'three',
          },
          {
            id: 'q10-girls-balloons-four',
            texto: 'four',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Quantas meninas estão segurando balões?',
          respostaIngles: 'Two girls are holding balloons.',
          significadoPortugues: 'Duas meninas estão segurando balões.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-children-balloons.svg',
        imagemEnunciadoAlt:
          'Usar exatamente a mesma cena e os mesmos sete balões de Q9, sem alterar posições ou participantes.',
      },
      {
        id: 'q11-two-blue-balls',
        perguntaIngles: 'How many blue balls are there?',
        instrucaoPortugues: 'Conte apenas as bolas da cor solicitada.',
        respostaCorreta: 'q11-two-blue-balls-two',
        explicacao: 'Blue significa azul e two significa dois. Há duas bolas azuis.',
        feedbackErro: 'Separe mentalmente as bolas azuis e conte só essas.',
        alternativas: [
          {
            id: 'q11-two-blue-balls-four',
            texto: 'four',
          },
          {
            id: 'q11-two-blue-balls-one',
            texto: 'one',
          },
          {
            id: 'q11-two-blue-balls-two',
            texto: 'two',
          },
          {
            id: 'q11-two-blue-balls-three',
            texto: 'three',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Quantas bolas azuis há?',
          respostaIngles: 'There are two blue balls.',
          significadoPortugues: 'Há duas bolas azuis.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-four-balls.svg',
        imagemEnunciadoAlt:
          'Reutilizar a cena de Q8: quatro bolas, sendo duas azuis, uma vermelha e uma verde.',
      },
      {
        id: 'q12-doll-on-table',
        perguntaIngles: 'Where is the doll?',
        instrucaoPortugues: 'Observe a posição e escolha a frase.',
        respostaCorreta: 'q12-doll-on-table-it-s-on-the-table',
        explicacao: 'On the table significa sobre a mesa.',
        feedbackErro: 'Observe onde a boneca está apoiada.',
        alternativas: [
          {
            id: 'q12-doll-on-table-it-s-under-the-table',
            texto: "It's under the table.",
          },
          {
            id: 'q12-doll-on-table-it-s-on-the-bed',
            texto: "It's on the bed.",
          },
          {
            id: 'q12-doll-on-table-it-s-on-the-floor',
            texto: "It's on the floor.",
          },
          {
            id: 'q12-doll-on-table-it-s-on-the-table',
            texto: "It's on the table.",
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Onde está a boneca?',
          respostaIngles: "It's on the table.",
          significadoPortugues: 'Está sobre a mesa.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-doll-on-table.svg',
        imagemEnunciadoAlt:
          'Uma boneca sentada sobre o tampo da mesa, visivelmente apoiada nele. Parte inferior da mesa vazia.',
      },
      {
        id: 'q13-robot-under-table',
        perguntaIngles: 'Where is the robot?',
        instrucaoPortugues: 'Observe a posição e escolha a frase.',
        respostaCorreta: 'q13-robot-under-table-it-s-under-the-table',
        explicacao: 'Under the table significa debaixo da mesa.',
        feedbackErro: 'Observe o robô em relação ao tampo e às pernas da mesa.',
        alternativas: [
          {
            id: 'q13-robot-under-table-it-s-on-the-table',
            texto: "It's on the table.",
          },
          {
            id: 'q13-robot-under-table-it-s-under-the-table',
            texto: "It's under the table.",
          },
          {
            id: 'q13-robot-under-table-it-s-on-the-bed',
            texto: "It's on the bed.",
          },
          {
            id: 'q13-robot-under-table-it-s-on-the-chair',
            texto: "It's on the chair.",
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Onde está o robô?',
          respostaIngles: "It's under the table.",
          significadoPortugues: 'Está debaixo da mesa.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-robot-under-table.svg',
        imagemEnunciadoAlt:
          'Um robô entre as pernas da mesa, totalmente abaixo do tampo e apoiado no chão; tampo vazio.',
      },
      {
        id: 'q14-two-bears-bed',
        perguntaIngles: 'Which picture shows two teddy bears on the bed?',
        instrucaoPortugues: 'Compare quantidade e posição nas quatro figuras.',
        respostaCorreta: 'q14-two-bears-bed-two-bears-on-bed',
        explicacao:
          'A frase exige duas características juntas: dois ursinhos e a posição sobre a cama.',
        feedbackErro: 'Confira primeiro a quantidade e depois o móvel e a posição.',
        alternativas: [
          {
            id: 'q14-two-bears-bed-two-bears-on-bed',
            texto: 'Figura A',
            imagem: 'play-time-two-bears-on-bed.svg',
            rotuloAcessivel: 'Dois ursinhos de pelúcia sobre uma cama.',
          },
          {
            id: 'q14-two-bears-bed-two-bears-under-bed',
            texto: 'Figura B',
            imagem: 'play-time-two-bears-under-bed.svg',
            rotuloAcessivel: 'Dois ursinhos de pelúcia debaixo de uma cama.',
          },
          {
            id: 'q14-two-bears-bed-four-bears-on-bed',
            texto: 'Figura C',
            imagem: 'play-time-four-bears-on-bed.svg',
            rotuloAcessivel: 'Quatro ursinhos de pelúcia sobre uma cama.',
          },
          {
            id: 'q14-two-bears-bed-two-bears-on-table',
            texto: 'Figura D',
            imagem: 'play-time-two-bears-on-table.svg',
            rotuloAcessivel: 'Dois ursinhos de pelúcia sobre uma mesa.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual imagem mostra dois ursinhos de pelúcia sobre a cama?',
          respostaIngles: 'There are two teddy bears on the bed.',
          significadoPortugues: 'Há dois ursinhos de pelúcia sobre a cama.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
      },
      {
        id: 'q15-car-under-table',
        perguntaIngles: 'Which sentence matches the picture?',
        instrucaoPortugues: 'Observe o brinquedo e onde ele está.',
        respostaCorreta: 'q15-car-under-table-the-car-is-under-the-table',
        explicacao: 'A frase correta identifica o carro e sua posição: under the table.',
        feedbackErro: 'A frase precisa combinar tanto com o brinquedo quanto com sua posição.',
        alternativas: [
          {
            id: 'q15-car-under-table-it-s-a-train',
            texto: "It's a train.",
          },
          {
            id: 'q15-car-under-table-the-car-is-on-the-bed',
            texto: 'The car is on the bed.',
          },
          {
            id: 'q15-car-under-table-the-car-is-on-the-table',
            texto: 'The car is on the table.',
          },
          {
            id: 'q15-car-under-table-the-car-is-under-the-table',
            texto: 'The car is under the table.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual frase combina com a imagem?',
          respostaIngles: 'The car is under the table.',
          significadoPortugues: 'O carro está debaixo da mesa.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-car-under-table.svg',
        imagemEnunciadoAlt:
          'Um carrinho sozinho debaixo de uma mesa; nenhuma cama e nenhum trem. Carrinho entre as pernas, abaixo do tampo.',
      },
      {
        id: 'q16-read-inside',
        perguntaIngles: 'What is she doing?',
        instrucaoPortugues: 'Observe a ação e o lugar.',
        respostaCorreta: 'q16-read-inside-she-is-reading-inside',
        explicacao: 'Reading significa lendo. Inside indica um ambiente interno.',
        feedbackErro: 'Observe o objeto nas mãos da menina e o lugar onde ela está.',
        alternativas: [
          {
            id: 'q16-read-inside-she-is-reading-outside',
            texto: 'She is reading outside.',
          },
          {
            id: 'q16-read-inside-she-is-riding-a-bike-outside',
            texto: 'She is riding a bike outside.',
          },
          {
            id: 'q16-read-inside-she-is-reading-inside',
            texto: 'She is reading inside.',
          },
          {
            id: 'q16-read-inside-she-is-drawing-inside',
            texto: 'She is drawing inside.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'O que ela está fazendo?',
          respostaIngles: 'She is reading inside.',
          significadoPortugues: 'Ela está lendo dentro de casa.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-read-inside.svg',
        imagemEnunciadoAlt:
          'Menina lendo um livro aberto em uma sala, com paredes e janela visíveis. Ela está dentro; o jardim fica além da janela.',
      },
      {
        id: 'q17-fly-kite-outside',
        perguntaIngles: 'What is he doing?',
        instrucaoPortugues: 'Observe a brincadeira e o lugar.',
        respostaCorreta: 'q17-fly-kite-outside-he-is-flying-a-kite-outside',
        explicacao: 'Flying a kite significa empinando pipa. Outside indica o lado de fora.',
        feedbackErro: 'Siga o fio até o brinquedo e observe o ambiente.',
        alternativas: [
          {
            id: 'q17-fly-kite-outside-he-is-flying-a-kite-inside',
            texto: 'He is flying a kite inside.',
          },
          {
            id: 'q17-fly-kite-outside-he-is-playing-with-a-ball-outside',
            texto: 'He is playing with a ball outside.',
          },
          {
            id: 'q17-fly-kite-outside-he-is-riding-a-bike-outside',
            texto: 'He is riding a bike outside.',
          },
          {
            id: 'q17-fly-kite-outside-he-is-flying-a-kite-outside',
            texto: 'He is flying a kite outside.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'O que ele está fazendo?',
          respostaIngles: 'He is flying a kite outside.',
          significadoPortugues: 'Ele está empinando uma pipa ao ar livre.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-fly-kite-outside.svg',
        imagemEnunciadoAlt:
          'Menino empinando pipa em um parque. Fio liga a mão à pipa. Céu e grama visíveis, sem telhado.',
      },
      {
        id: 'q18-ride-bike-outside',
        perguntaIngles: 'What is she doing?',
        instrucaoPortugues: 'Observe a ação e o lugar.',
        respostaCorreta: 'q18-ride-bike-outside-she-is-riding-a-bike-outside',
        explicacao: 'Riding a bike significa andando de bicicleta. A cena mostra um parque.',
        feedbackErro: 'Observe a bicicleta, os pedais e o lugar da brincadeira.',
        alternativas: [
          {
            id: 'q18-ride-bike-outside-she-is-riding-a-bike-inside',
            texto: 'She is riding a bike inside.',
          },
          {
            id: 'q18-ride-bike-outside-she-is-riding-a-bike-outside',
            texto: 'She is riding a bike outside.',
          },
          {
            id: 'q18-ride-bike-outside-she-is-flying-a-kite-outside',
            texto: 'She is flying a kite outside.',
          },
          {
            id: 'q18-ride-bike-outside-she-is-reading-inside',
            texto: 'She is reading inside.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'O que ela está fazendo?',
          respostaIngles: 'She is riding a bike outside.',
          significadoPortugues: 'Ela está andando de bicicleta ao ar livre.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-ride-bike-outside.svg',
        imagemEnunciadoAlt:
          'Menina pedalando bicicleta num parque, com capacete, mãos no guidão e pés nos pedais. Sem parede ou teto.',
      },
      {
        id: 'q19-play-doll-inside',
        perguntaIngles: 'What is she doing?',
        instrucaoPortugues: 'Observe o brinquedo e o lugar da brincadeira.',
        respostaCorreta: 'q19-play-doll-inside-she-is-playing-with-a-doll-inside',
        explicacao: 'A criança brinca com uma doll em um ambiente interno: inside.',
        feedbackErro: 'Observe o brinquedo nas mãos e os móveis ao redor.',
        alternativas: [
          {
            id: 'q19-play-doll-inside-she-is-playing-with-a-doll-inside',
            texto: 'She is playing with a doll inside.',
          },
          {
            id: 'q19-play-doll-inside-she-is-playing-with-a-doll-outside',
            texto: 'She is playing with a doll outside.',
          },
          {
            id: 'q19-play-doll-inside-she-is-playing-with-a-teddy-bear-inside',
            texto: 'She is playing with a teddy bear inside.',
          },
          {
            id: 'q19-play-doll-inside-she-is-playing-with-a-robot-outside',
            texto: 'She is playing with a robot outside.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'O que ela está fazendo?',
          respostaIngles: 'She is playing with a doll inside.',
          significadoPortugues: 'Ela está brincando com uma boneca dentro de casa.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-play-doll-inside.svg',
        imagemEnunciadoAlt:
          'Menina brincando com boneca num quarto. Mostrar claramente criança e boneca como figuras distintas; quarto com paredes e cama.',
      },
      {
        id: 'q20-compare-doll',
        perguntaIngles: 'What toy is in picture B instead of the robot?',
        instrucaoPortugues: 'Compare A e B e observe a troca de brinquedo.',
        respostaCorreta: 'q20-compare-doll-it-s-a-doll',
        explicacao: 'Na cena B, uma boneca ocupa o lugar do robô. A mudança é de brinquedo.',
        feedbackErro: 'Compare a região entre as duas crianças.',
        alternativas: [
          {
            id: 'q20-compare-doll-it-s-a-robot',
            texto: "It's a robot.",
          },
          {
            id: 'q20-compare-doll-it-s-a-boat',
            texto: "It's a boat.",
          },
          {
            id: 'q20-compare-doll-it-s-a-doll',
            texto: "It's a doll.",
          },
          {
            id: 'q20-compare-doll-it-s-a-teddy-bear',
            texto: "It's a teddy bear.",
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual brinquedo está na imagem B no lugar do robô?',
          respostaIngles: "It's a doll.",
          significadoPortugues: 'É uma boneca.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-compare-a-b.svg',
        imagemEnunciadoAlt:
          'Par original de cenas com exatamente sete diferenças, definido no contrato visual. Robô em A e boneca em B ocupam a mesma região. Duas crianças humanas permanecem nas duas cenas. Reutilizar o mesmo par em Q21–Q22.',
        imagemEnunciadoMobile: 'play-time-compare-a-b-mobile.svg',
      },
      {
        id: 'q21-compare-yellow-flag',
        perguntaIngles: 'What color is the first flag in picture B?',
        instrucaoPortugues: 'Observe a bandeirinha marcada por uma seta neutra na cena B.',
        respostaCorreta: 'q21-compare-yellow-flag-yellow',
        explicacao: 'Yellow significa amarelo. Essa bandeirinha mudou de vermelho para amarelo.',
        feedbackErro: 'Observe a cor da bandeirinha indicada na imagem B.',
        alternativas: [
          {
            id: 'q21-compare-yellow-flag-red',
            texto: 'red',
          },
          {
            id: 'q21-compare-yellow-flag-yellow',
            texto: 'yellow',
          },
          {
            id: 'q21-compare-yellow-flag-green',
            texto: 'green',
          },
          {
            id: 'q21-compare-yellow-flag-blue',
            texto: 'blue',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'De que cor é a primeira bandeirinha na imagem B?',
          respostaIngles: 'The flag is yellow.',
          significadoPortugues: 'A bandeirinha é amarela.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-compare-a-b-flag-focus.svg',
        imagemEnunciadoAlt:
          'Mesmo par de Q20; a bandeirinha da extremidade esquerda é vermelha em A e amarela em B. Uma seta cinza pequena aponta a bandeirinha em B, sem texto de cor.',
        imagemEnunciadoMobile: 'play-time-compare-a-b-flag-focus-mobile.svg',
      },
      {
        id: 'q22-compare-basketball',
        perguntaIngles: 'Which ball is in picture B?',
        instrucaoPortugues: 'Compare a bola maior perto dos blocos nas duas cenas.',
        respostaCorreta: 'q22-compare-basketball-basketball',
        explicacao: 'Na imagem B há uma bola de basquete no lugar da bola de futebol.',
        feedbackErro: 'Compare o desenho e as linhas da bola indicada.',
        alternativas: [
          {
            id: 'q22-compare-basketball-soccer-ball',
            texto: 'A soccer ball.',
            imagem: 'play-time-soccer-ball.svg',
          },
          {
            id: 'q22-compare-basketball-tennis-ball',
            texto: 'A tennis ball.',
            imagem: 'play-time-tennis-ball.svg',
          },
          {
            id: 'q22-compare-basketball-beach-ball',
            texto: 'A beach ball.',
            imagem: 'play-time-beach-ball.svg',
          },
          {
            id: 'q22-compare-basketball-basketball',
            texto: 'A basketball.',
            imagem: 'play-time-basketball.svg',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual bola está na imagem B?',
          respostaIngles: 'A basketball.',
          significadoPortugues: 'Uma bola de basquete.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
          imagemRespostaMobile: 'play-time-compare-review-7-mobile.svg',
          imagemResposta: 'play-time-compare-review-7.svg',
          imagemRespostaAltIngles:
            'Sete diferenças de A para B: bandeirinha vermelha fica amarela; avião vermelho desaparece da prateleira; aparece um dardo azul no alvo; robô é substituído por boneca; bola de futebol é substituída por bola de basquete; mesmos blocos formam torre alta; cubo com 1 roxo fica azul. Permanecem duas crianças, avião azul no chão, bola de praia e dois discos voadores.',
        },
        imagemEnunciado: 'play-time-compare-a-b-ball-focus.svg',
        imagemEnunciadoAlt:
          'Mesmo par de Q20. Uma bola de futebol preta e branca em A é substituída por uma bola de basquete laranja com linhas escuras em B. Manter outra bola de praia em ambas as cenas, sem uma segunda bola de futebol/basquete. Setas cinza indicam apenas o par comparado.',
        imagemEnunciadoMobile: 'play-time-compare-a-b-ball-focus-mobile.svg',
      },
      {
        id: 'q23-metal-bike',
        perguntaIngles: 'What is it made of?',
        instrucaoPortugues: 'Observe o material do quadro da bicicleta indicado na figura.',
        respostaCorreta: 'q23-metal-bike-metal',
        explicacao: 'Metal significa metal. Aqui observamos o quadro metálico da bicicleta.',
        feedbackErro: 'Observe o quadro, e não os pneus.',
        alternativas: [
          {
            id: 'q23-metal-bike-paper',
            texto: 'paper',
          },
          {
            id: 'q23-metal-bike-plastic',
            texto: 'plastic',
          },
          {
            id: 'q23-metal-bike-metal',
            texto: 'metal',
          },
          {
            id: 'q23-metal-bike-fabric',
            texto: 'fabric',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'De que material é feito?',
          respostaIngles: "It's made of metal.",
          significadoPortugues: 'É feito de metal.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-metal-bike.svg',
        imagemEnunciadoAlt:
          'Bicicleta com quadro metálico em destaque e um detalhe ampliado do tubo com brilho metálico. Uma seta cinza aponta somente o quadro. Rodas de borracha neutras; it se refere à parte indicada, não aos pneus.',
      },
      {
        id: 'q24-fabric-doll',
        perguntaIngles: 'What is the doll made of?',
        instrucaoPortugues: 'Observe de que material é feita esta boneca.',
        respostaCorreta: 'q24-fabric-doll-fabric',
        explicacao: 'Fabric significa tecido. Esta boneca é uma boneca de pano.',
        feedbackErro: 'Observe as costuras e a textura da boneca.',
        alternativas: [
          {
            id: 'q24-fabric-doll-fabric',
            texto: 'fabric',
          },
          {
            id: 'q24-fabric-doll-metal',
            texto: 'metal',
          },
          {
            id: 'q24-fabric-doll-plastic',
            texto: 'plastic',
          },
          {
            id: 'q24-fabric-doll-paper',
            texto: 'paper',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'De que material é feita a boneca?',
          respostaIngles: "It's made of fabric.",
          significadoPortugues: 'É feita de tecido.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-fabric-doll.svg',
        imagemEnunciadoAlt:
          'Boneca totalmente de pano, com costuras visíveis e detalhe ampliado de tecido; evitar rosto, mãos ou pernas com aparência de plástico.',
      },
      {
        id: 'q25-paper-plastic',
        perguntaIngles: 'Which pair is correct?',
        instrucaoPortugues: 'Observe a pipa de papel e o caminhão de plástico.',
        respostaCorreta:
          'q25-paper-plastic-the-kite-is-made-of-paper-the-toy-lorry-is-made-of-plastic',
        explicacao:
          'Paper significa papel e plastic significa plástico. As duas associações precisam estar corretas.',
        feedbackErro: 'Compare cada brinquedo com o material mostrado no detalhe ampliado.',
        alternativas: [
          {
            id: 'q25-paper-plastic-the-kite-is-made-of-plastic-the-toy-lorry-is-made-of-paper',
            texto: 'The kite is made of plastic. The toy lorry is made of paper.',
          },
          {
            id: 'q25-paper-plastic-the-kite-is-made-of-paper-the-toy-lorry-is-made-of-plastic',
            texto: 'The kite is made of paper. The toy lorry is made of plastic.',
          },
          {
            id: 'q25-paper-plastic-the-kite-is-made-of-metal-the-toy-lorry-is-made-of-fabric',
            texto: 'The kite is made of metal. The toy lorry is made of fabric.',
          },
          {
            id: 'q25-paper-plastic-the-kite-is-made-of-fabric-the-toy-lorry-is-made-of-metal',
            texto: 'The kite is made of fabric. The toy lorry is made of metal.',
          },
        ],
        revisaoPosResposta: {
          perguntaPortugues: 'Qual par de frases está correto?',
          respostaIngles: 'The kite is made of paper. The toy lorry is made of plastic.',
          significadoPortugues:
            'A pipa é feita de papel. O caminhão de brinquedo é feito de plástico.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        imagemEnunciado: 'play-time-paper-kite-plastic-lorry.svg',
        imagemEnunciadoAlt:
          'Dois brinquedos bem separados: pipa feita de papel, com pequeno detalhe da folha dobrada, e caminhão claramente de plástico moldado, com detalhe de uma peça do mesmo material. Não desenhar caminhão real.',
      },
    ],
  });
})();
