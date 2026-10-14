(function () {
  'use strict';
  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.marianaTransportesOutubro2026 = {
    perfil: 'mariana',
    revisaoId: 'mariana-ingles-means-of-transportation-outubro-2026',
    unidadeId: 'means-of-transportation-outubro-2026',
    chaveArmazenamento: 'revisoesEscolares.mariana.ingles.meansOfTransportationOutubro2026.v1',
  };
  window.RegistroIngles.registrar({
    id: 'means-of-transportation-outubro-2026',
    versao: 1,
    titulo: 'Moving Around · Transport & Safety',
    subtitulo: 'English Review · Moving Around',
    descricao:
      'Aprenda com as figuras. Depois, ouça e escreva os 20 ditados. Faça um grupo de cada vez e descanse quando precisar. Seu trabalho pode ser retomado.',
    imagemCabecalho: 'practice.svg',
    diretorioImagens: 'ingles-means-of-transportation-outubro-2026',
    perfisDisponiveis: ['mariana'],
    correcaoPorQuestao: true,
    ordemAlternativasFixa: true,
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
    ditadoOculto: {
      habilitado: true,
    },
    interacoes: {
      habilitadas: true,
    },
    grupos: [
      {
        id: 'g1',
        titulo: 'Transport',
        traducao: 'Transportes',
        itens: [
          {
            id: 'd01',
            ingles: 'bus',
            portugues: 'ônibus',
            imagem: 'bus.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['bus'],
          },
          {
            id: 'd02',
            ingles: 'bike',
            portugues: 'bicicleta',
            imagem: 'bike.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['bike'],
            sinonimo: 'bicycle',
          },
          {
            id: 'd03',
            ingles: 'helicopter',
            portugues: 'helicóptero',
            imagem: 'helicopter.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['helicopter'],
          },
          {
            id: 'd04',
            ingles: 'car',
            portugues: 'carro',
            imagem: 'car.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['car'],
          },
          {
            id: 'd05',
            ingles: 'boat',
            portugues: 'barco',
            imagem: 'boat.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['boat'],
          },
          {
            id: 'd06',
            ingles: 'lorry',
            portugues: 'caminhão',
            imagem: 'lorry.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['lorry'],
            sinonimo: 'truck',
          },
          {
            id: 'd07',
            ingles: 'plane',
            portugues: 'avião',
            imagem: 'plane.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['plane'],
            sinonimo: 'airplane',
          },
          {
            id: 'd08',
            ingles: 'train',
            portugues: 'trem',
            imagem: 'train.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['train'],
          },
          {
            id: 'd09',
            ingles: 'motorbike',
            portugues: 'moto',
            imagem: 'motorbike.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['motorbike'],
            sinonimo: 'motorcycle',
          },
        ],
        ordemEstudo: ['d03', 'd02', 'd06', 'd05', 'd07', 'd04', 'd01', 'd09', 'd08'],
        instrucao:
          'Leia, observe as figuras e ouça cada item. Repita em voz alta se quiser. Veja os contrastes: a bicicleta convencional tem pedais; a moto usa motor. O avião tem asas fixas; o helicóptero tem um rotor. Caminhão leva carga; ônibus leva passageiros. As figuras de aprendizagem mostram essas diferenças. Você também pode encontrar outros nomes: bicycle para bike; truck para lorry; motorcycle para motorbike; airplane para plane. Nos ditados, escreva a palavra que ouvir.',
      },
      {
        id: 'g2',
        titulo: 'Stay safe',
        traducao: 'Cuide de você',
        itens: [
          {
            id: 'd10',
            ingles: 'helmet',
            portugues: 'capacete',
            imagem: 'helmet.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['helmet'],
          },
          {
            id: 'd11',
            ingles: 'lifejacket',
            portugues: 'colete salva-vidas',
            imagem: 'lifejacket.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['lifejacket', 'life jacket'],
          },
          {
            id: 'd12',
            ingles: 'seatbelt',
            portugues: 'cinto de segurança',
            imagem: 'seatbelt.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['seatbelt', 'seat belt'],
          },
          {
            id: 'd13',
            ingles: 'knee pads',
            portugues: 'joelheiras',
            imagem: 'knee-pads.svg',
            unidadeAudio: 'palavra',
            variantesEscrita: ['knee pads'],
          },
        ],
        ordemEstudo: ['d12', 'd10', 'd11', 'd13'],
        instrucao:
          'Leia, observe e ouça. O capacete ajuda a proteger a cabeça. O cinto e o assento apropriado ajudam a manter a criança segura no veículo. As joelheiras ajudam a proteger os joelhos. O colete ajuda a flutuar e deve estar ajustado. Esses cuidados reduzem riscos; um adulto continua acompanhando a criança. Seat belt e seatbelt são duas formas de escrever o nome do cinto. Life jacket e lifejacket são duas formas de escrever o nome do colete. Knee pads é uma expressão no plural.',
      },
      {
        id: 'g3',
        titulo: 'Ask and answer',
        traducao: 'Pergunte e responda',
        itens: [
          {
            id: 'd14',
            ingles: "What's this?",
            portugues: 'O que é isto?',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ["What's this?", 'What is this?'],
          },
          {
            id: 'd15',
            ingles: "It's a bus.",
            portugues: 'É um ônibus.',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ["It's a bus.", 'It is a bus.'],
          },
          {
            id: 'd16',
            ingles: 'Is it a bike?',
            portugues: 'É uma bicicleta?',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ['Is it a bike?'],
          },
          {
            id: 'd17',
            ingles: 'Yes, it is.',
            portugues: 'Sim, é.',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ['Yes, it is.'],
          },
          {
            id: 'd18',
            ingles: "No, it isn't.",
            portugues: 'Não, não é.',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ["No, it isn't.", 'No, it is not.'],
          },
          {
            id: 'd19',
            ingles: 'I go by boat.',
            portugues: 'Eu vou de barco.',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ['I go by boat.'],
          },
          {
            id: 'd20',
            ingles: 'Wear a helmet.',
            portugues: 'Use um capacete.',
            imagem: 'practice.svg',
            unidadeAudio: 'frase',
            variantesEscrita: ['Wear a helmet.'],
          },
        ],
        ordemEstudo: ['d18', 'd14', 'd19', 'd17', 'd16', 'd20', 'd15'],
        instrucao:
          "Observe estes modelos e ouça cada um. Os modelos são estudados antes do ditado e não ficam escritos na tela de tentativa. What's this? pergunta o nome de algo. Is it...? pergunta se é aquele objeto: você responde Yes, it is ou No, it isn't. By apresenta o meio de transporte: I go by car significa Eu vou de carro.",
      },
    ],
    historia: {
      tituloIngles: 'Story Time · A trip to the river',
      tituloPortugues: 'História · Um passeio até o rio',
      pausaMs: 350,
      questoesComConsulta: 25,
      cenas: [
        {
          id: 'scene-1',
          tituloIngles: 'Going to the river',
          tituloPortugues: 'Vamos ao rio',
          textoIngles: 'Mia and Leo go to the river with Jo, an adult. Leo uses a wheelchair.',
          textoPortugues:
            'Mia e Leo vão até o rio com Jo, uma pessoa adulta. Leo usa cadeira de rodas.',
          imagem: 'story-1.svg',
          imagemAlt:
            'Mia e Leo combinam ir ao rio com Jo; Leo usa cadeira de rodas e participa da decisão.',
        },
        {
          id: 'scene-2',
          tituloIngles: 'The blue bus',
          tituloPortugues: 'O ônibus azul',
          textoIngles:
            "They choose the blue bus because it has a ramp and space for Leo's wheelchair.",
          textoPortugues:
            'Eles escolhem o ônibus azul porque ele tem rampa e espaço para a cadeira de rodas de Leo.',
          imagem: 'story-2.svg',
          imagemAlt:
            'Ônibus azul parado com rampa de embarque e espaço para a cadeira de rodas. Mia e Leo participam igualmente.',
        },
        {
          id: 'scene-3',
          tituloIngles: 'A toy in the bag',
          tituloPortugues: 'Um brinquedo na bolsa',
          textoIngles: 'Mia has a toy boat in her bag.',
          textoPortugues: 'Mia tem um barco de brinquedo na bolsa.',
          imagem: 'story-3.svg',
          imagemAlt: 'Mia mostra um barco pequeno de brinquedo em sua bolsa. Leo e Jo observam.',
        },
        {
          id: 'scene-4',
          tituloIngles: 'Watching the boats',
          tituloPortugues: 'Observando os barcos',
          textoIngles:
            'At the river, they watch the boats. They stay with Jo on the path. They do not get into a boat.',
          textoPortugues:
            'No rio, eles observam os barcos. Ficam com Jo no caminho de passeio. Eles não entram num barco.',
          imagem: 'story-4.svg',
          imagemAlt:
            'Os três observam barcos reais à distância, no caminho protegido perto do rio. Ninguém embarca. O brinquedo de Mia permanece pequeno.',
        },
      ],
    },
    atividades: [
      {
        id: 'q01',
        textoPerguntaVisivel: 'Match each picture to its name.',
        apoio: [
          'Observe as figuras e escolha um nome para cada uma. Você pode trocar a associação.',
          'Figura 1: veículo pequeno com quatro rodas, cabine fechada e bancos para poucas pessoas. Figura 2: veículo comprido, com muitas janelas, vários bancos e porta de embarque.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'Picture 1.',
            opcoes: [
              {
                id: 'bus',
                texto: 'bus',
              },
              {
                id: 'boat',
                texto: 'boat',
              },
              {
                id: 'car',
                texto: 'car',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['car'],
            imagem: 'car.svg',
            imagemAlt: 'Veículo pequeno de quatro rodas para poucas pessoas.',
            descricao: 'Veículo pequeno de quatro rodas para poucas pessoas.',
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'Picture 2.',
            opcoes: [
              {
                id: 'bus',
                texto: 'bus',
              },
              {
                id: 'boat',
                texto: 'boat',
              },
              {
                id: 'car',
                texto: 'car',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['bus'],
            imagem: 'bus.svg',
            imagemAlt: 'Veículo comprido com muitas janelas, bancos e porta de embarque.',
            descricao: 'Veículo comprido com muitas janelas, bancos e porta de embarque.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Match each picture to its name. Picture 1. Picture 2.',
        revisaoPosResposta: {
          perguntaPortugues: 'Associe cada figura ao seu nome. Figura 1. Figura 2.',
          respostaIngles: 'Picture 1 is a car. Picture 2 is a bus.',
          significadoPortugues: 'A figura 1 é um carro. A figura 2 é um ônibus.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Compare tamanho, bancos e porta de embarque.',
        explicacao: 'Você reconheceu transportes pelo que observou nas figuras.',
      },
      {
        id: 'q02',
        textoPerguntaVisivel: 'Match the two vehicles to their names.',
        apoio: [
          'Observe como cada veículo se move e escolha um nome para cada figura.',
          'Figura 1: duas rodas, tanque e motor visível, sem pedais de bicicleta. Figura 2: duas rodas, pedais e corrente. Nesta figura, não há motor.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'Picture 1.',
            opcoes: [
              {
                id: 'bike',
                texto: 'bike',
              },
              {
                id: 'motorbike',
                texto: 'motorbike',
              },
              {
                id: 'helicopter',
                texto: 'helicopter',
              },
            ],
            respostas: ['motorbike'],
            imagem: 'motorbike.svg',
            imagemAlt: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
            descricao: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'Picture 2.',
            opcoes: [
              {
                id: 'bike',
                texto: 'bike',
              },
              {
                id: 'motorbike',
                texto: 'motorbike',
              },
              {
                id: 'helicopter',
                texto: 'helicopter',
              },
            ],
            respostas: ['bike'],
            imagem: 'bike.svg',
            imagemAlt: 'Bicicleta convencional com duas rodas, pedais e corrente, sem motor.',
            descricao: 'Bicicleta convencional com duas rodas, pedais e corrente, sem motor.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Match the two vehicles to their names. Picture 1. Picture 2.',
        revisaoPosResposta: {
          perguntaPortugues: 'Associe os dois veículos aos seus nomes. Figura 1. Figura 2.',
          respostaIngles: 'Picture 1 is a motorbike. Picture 2 is a bike.',
          significadoPortugues: 'A figura 1 é uma moto. A figura 2 é uma bicicleta.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Duas rodas aparecem nas duas figuras. Procure o motor ou os pedais.',
        explicacao: 'Você percebeu a diferença entre pedais e motor.',
      },
      {
        id: 'q03',
        textoPerguntaVisivel: 'Listen and choose the pictures.',
        apoio: [
          'Acione Ouvir no item a e depois no item b. Escolha a figura que combina com a palavra ouvida. Você pode ouvir novamente.',
          'As figuras não têm nomes em inglês. Os botões são identificados apenas por Item a e Item b.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: 'Listen to item a.',
            opcoes: [
              {
                id: 'fig-car',
                texto: 'Figura: veículo pequeno de quatro rodas para poucas pessoas.',
                imagem: 'car.svg',
              },
              {
                id: 'fig-boat',
                texto: 'Figura: embarcação com casco sobre a água.',
                imagem: 'boat.svg',
              },
              {
                id: 'fig-plane',
                texto: 'Figura: veículo com asas fixas voando no céu.',
                imagem: 'plane.svg',
              },
            ],
            respostas: ['fig-boat'],
            estimulo: {
              texto: 'boat',
              unidadeAudio: 'palavra',
            },
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Listen to item b.',
            opcoes: [
              {
                id: 'fig-train',
                texto: 'Figura: vagões ligados sobre trilhos.',
                imagem: 'train.svg',
              },
              {
                id: 'fig-bike',
                texto: 'Figura: duas rodas, pedais e corrente.',
                imagem: 'bike.svg',
              },
              {
                id: 'fig-helicopter',
                texto: 'Figura: veículo no céu com rotor acima da cabine.',
                imagem: 'helicopter.svg',
              },
            ],
            respostas: ['fig-helicopter'],
            estimulo: {
              texto: 'helicopter',
              unidadeAudio: 'palavra',
            },
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Listen and choose the pictures. Listen to item a. Listen to item b.',
        revisaoPosResposta: {
          perguntaPortugues: 'Ouça e escolha as figuras. Ouça o item a. Ouça o item b.',
          respostaIngles: 'Item a is a boat. Item b is a helicopter.',
          significadoPortugues: 'O item a é um barco. O item b é um helicóptero.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Ouça devagar e compare o som com as palavras estudadas.',
        explicacao: 'Você ligou os sons às figuras.',
      },
      {
        id: 'q04',
        textoPerguntaVisivel: 'Match three pictures to their names.',
        apoio: [
          'Escolha o nome inglês de cada figura.',
          'Figura 1: cabine dianteira ligada a vagões sobre trilhos. Figura 2: asas fixas, cauda e cabine, no céu. Figura 3: cabine dianteira e grande compartimento de carga, sobre rodas.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'Picture 1.',
            opcoes: [
              {
                id: 'plane',
                texto: 'plane',
              },
              {
                id: 'lorry',
                texto: 'lorry',
              },
              {
                id: 'bike',
                texto: 'bike',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['train'],
            imagem: 'train.svg',
            imagemAlt: 'Cabine e vagões ligados sobre trilhos.',
            descricao: 'Cabine e vagões ligados sobre trilhos.',
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'Picture 2.',
            opcoes: [
              {
                id: 'plane',
                texto: 'plane',
              },
              {
                id: 'lorry',
                texto: 'lorry',
              },
              {
                id: 'bike',
                texto: 'bike',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['plane'],
            imagem: 'plane.svg',
            imagemAlt: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
            descricao: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
          },
          {
            id: 'c',
            tipo: 'associacao',
            pergunta: 'Picture 3.',
            opcoes: [
              {
                id: 'plane',
                texto: 'plane',
              },
              {
                id: 'lorry',
                texto: 'lorry',
              },
              {
                id: 'bike',
                texto: 'bike',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['lorry'],
            imagem: 'lorry.svg',
            imagemAlt: 'Cabine na frente e grande compartimento de carga, sem bancos de ônibus.',
            descricao: 'Cabine na frente e grande compartimento de carga, sem bancos de ônibus.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Match three pictures to their names. Picture 1. Picture 2. Picture 3.',
        revisaoPosResposta: {
          perguntaPortugues: 'Associe três figuras aos seus nomes. Figura 1. Figura 2. Figura 3.',
          respostaIngles:
            'Picture 1 is a train. Picture 2 is a plane. Picture 3 is a lorry. Lorry also means truck.',
          significadoPortugues:
            'A figura 1 é um trem. A figura 2 é um avião. A figura 3 é um caminhão. Lorry e truck são nomes para caminhão.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Procure trilhos, asas ou compartimento de carga.',
        explicacao: 'Você observou trilhos, asas e carga para encontrar os nomes.',
      },
      {
        id: 'q05',
        textoPerguntaVisivel: 'Complete the words.',
        apoio: [
          'Observe as figuras e letras. Digite a palavra inteira em inglês. Não precisa usar maiúsculas.',
          'Figura 1: veículo com asas fixas, cauda e cabine. Modelo: p l _ n _. Figura 2: veículo pequeno com quatro rodas e cabine fechada. Modelo: c _ r.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'campo',
            pergunta: 'Complete: p l _ n _.',
            opcoes: [],
            respostas: ['plane'],
            imagem: 'plane.svg',
            imagemAlt: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
            descricao: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
          },
          {
            id: 'b',
            tipo: 'campo',
            pergunta: 'Complete: c _ r.',
            opcoes: [],
            respostas: ['car'],
            imagem: 'car.svg',
            imagemAlt: 'Veículo pequeno de quatro rodas para poucas pessoas.',
            descricao: 'Veículo pequeno de quatro rodas para poucas pessoas.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Complete the words. Picture one. Complete the word using the letters shown. Picture two. Complete the word using the letters shown.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Complete as palavras. Complete a palavra do primeiro modelo. Complete a palavra do segundo modelo.',
          respostaIngles: 'The first word is plane. The second word is car.',
          significadoPortugues:
            'A primeira palavra é plane, avião. A segunda palavra é car, carro.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Fale o nome baixinho e confira as letras já presentes.',
        explicacao: 'Você recuperou as letras das duas palavras.',
      },
      {
        id: 'q06',
        textoPerguntaVisivel: 'Choose the answers for the two short dialogues.',
        apoio: [
          'Observe a figura de cada diálogo e escolha uma resposta.',
          'Diálogo 1: veículo com asas fixas e cauda, no céu. Diálogo 2: veículo com duas rodas, tanque e motor, sem pedais.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: "What's this?",
            opcoes: [
              {
                id: 'it-s-a-boat',
                texto: "It's a boat.",
              },
              {
                id: 'it-s-a-plane',
                texto: "It's a plane.",
              },
              {
                id: 'it-s-a-lorry',
                texto: "It's a lorry.",
              },
            ],
            respostas: ['it-s-a-plane'],
            imagem: 'plane.svg',
            imagemAlt: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
            descricao: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Is it a bike?',
            opcoes: [
              {
                id: 'yes-it-is',
                texto: 'Yes, it is.',
              },
              {
                id: 'it-s-a-boat',
                texto: "It's a boat.",
              },
              {
                id: 'no-it-isn-t',
                texto: "No, it isn't.",
              },
            ],
            respostas: ['no-it-isn-t'],
            imagem: 'motorbike.svg',
            imagemAlt: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
            descricao: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          "Choose the answers for the two short dialogues. What's this? Is it a bike?",
        revisaoPosResposta: {
          perguntaPortugues:
            'Escolha as respostas para os dois diálogos curtos. O que é isto? É uma bicicleta?',
          respostaIngles: "It's a plane. No, it isn't. It's a motorbike.",
          significadoPortugues: 'É um avião. Não, não é. É uma moto.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'No primeiro diálogo, nomeie o objeto. No segundo, compare o nome perguntado com a figura.',
        explicacao: 'Você combinou pergunta, resposta e imagem.',
      },
      {
        id: 'q07',
        textoPerguntaVisivel: 'Listen to the sentences and choose the vehicles.',
        apoio: [
          'Ouça cada fala completa e escolha o veículo mencionado. Use Ouvir devagar se quiser.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: 'Listen to sentence a.',
            opcoes: [
              {
                id: 'fig-motorbike',
                texto: 'Figura: duas rodas, tanque e motor.',
                imagem: 'motorbike.svg',
              },
              {
                id: 'fig-train',
                texto: 'Figura: vagões ligados sobre trilhos.',
                imagem: 'train.svg',
              },
              {
                id: 'fig-boat',
                texto: 'Figura: embarcação sobre a água.',
                imagem: 'boat.svg',
              },
            ],
            respostas: ['fig-train'],
            estimulo: {
              texto: 'I go by train.',
              unidadeAudio: 'frase',
            },
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Listen to sentence b.',
            opcoes: [
              {
                id: 'fig-bus',
                texto: 'Figura: veículo comprido, com muitas janelas e bancos.',
                imagem: 'bus.svg',
              },
              {
                id: 'fig-car',
                texto: 'Figura: veículo pequeno, com quatro rodas para poucas pessoas.',
                imagem: 'car.svg',
              },
              {
                id: 'fig-plane',
                texto: 'Figura: veículo com asas fixas no céu.',
                imagem: 'plane.svg',
              },
            ],
            respostas: ['fig-bus'],
            estimulo: {
              texto: 'I go by bus.',
              unidadeAudio: 'frase',
            },
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Listen to the sentences and choose the vehicles. Listen to sentence a. Listen to sentence b.',
        revisaoPosResposta: {
          perguntaPortugues: 'Ouça as frases e escolha os veículos. Ouça a fala a. Ouça a fala b.',
          respostaIngles: 'Sentence a says: I go by train. Sentence b says: I go by bus.',
          significadoPortugues: 'A fala a diz: Eu vou de trem. A fala b diz: Eu vou de ônibus.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Depois de by, você ouve o nome do transporte. Ouça de novo.',
        explicacao: 'Você entendeu os transportes mencionados nas frases.',
      },
      {
        id: 'q08',
        textoPerguntaVisivel: 'Choose land, water or air for each vehicle.',
        apoio: [
          'Escolha uma categoria para cada cartão. Você pode mudar as escolhas.',
          'Cartões: helicóptero voando; caminhão numa estrada; barco navegando; carro numa rua.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'categoria',
            pergunta: 'Helicopter.',
            opcoes: [
              {
                id: 'water',
                texto: 'water',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'land',
                texto: 'land',
              },
            ],
            respostas: ['air'],
            imagem: 'helicopter.svg',
            imagemAlt: 'Veículo no céu com rotor acima da cabine e rotor de cauda.',
            descricao: 'Veículo no céu com rotor acima da cabine e rotor de cauda.',
          },
          {
            id: 'b',
            tipo: 'categoria',
            pergunta: 'Lorry.',
            opcoes: [
              {
                id: 'water',
                texto: 'water',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'land',
                texto: 'land',
              },
            ],
            respostas: ['land'],
            imagem: 'lorry.svg',
            imagemAlt: 'Cabine na frente e grande compartimento de carga, sem bancos de ônibus.',
            descricao: 'Cabine na frente e grande compartimento de carga, sem bancos de ônibus.',
          },
          {
            id: 'c',
            tipo: 'categoria',
            pergunta: 'Boat.',
            opcoes: [
              {
                id: 'water',
                texto: 'water',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'land',
                texto: 'land',
              },
            ],
            respostas: ['water'],
            imagem: 'boat.svg',
            imagemAlt: 'Embarcação com casco sobre a água.',
            descricao: 'Embarcação com casco sobre a água.',
          },
          {
            id: 'd',
            tipo: 'categoria',
            pergunta: 'Car.',
            opcoes: [
              {
                id: 'water',
                texto: 'water',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'land',
                texto: 'land',
              },
            ],
            respostas: ['land'],
            imagem: 'car.svg',
            imagemAlt: 'Veículo pequeno de quatro rodas para poucas pessoas.',
            descricao: 'Veículo pequeno de quatro rodas para poucas pessoas.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Choose land, water or air for each vehicle. Helicopter. Lorry. Boat. Car.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Escolha terra, água ou ar para cada veículo. Helicóptero. Caminhão. Barco. Carro.',
          respostaIngles:
            'A helicopter travels through the air. A lorry travels on land. A boat travels on water. A car travels on land.',
          significadoPortugues:
            'Um helicóptero se desloca pelo ar. Um caminhão se desloca por terra. Um barco se desloca pela água. Um carro se desloca por terra.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Pense no ambiente de deslocamento. Ter rodas não impede um veículo de voar.',
        explicacao: 'Você classificou pelo lugar de deslocamento.',
        aprendizagem: [
          'Land é terra; water é água; air é ar. Para classificar um transporte, observe por onde ele se desloca naquela cena, não só se ele tem rodas.',
          'Exemplo: um skate se move no chão, em land. Uma canoa navega em water. Um balão de ar quente voa em air. As três figuras são exemplos de aprendizagem.',
          'Motorised significa motorizado: usa motor para se mover. Non-motorised significa não motorizado: não usa motor. Um trem convencional usa motor; um skate pode ser movido pelo corpo, sem motor. Veja a informação de cada exemplo. Existem bicicletas elétricas e diferentes tipos de barcos, por isso vamos dizer se o veículo desta tarefa tem motor.',
          'Leia e ouça: - It travels on land. — Ele se desloca por terra. - It travels on water. — Ele se desloca pela água. - It travels through the air. — Ele se desloca pelo ar. - It uses a motor. — Ele usa um motor. - It has no motor. — Ele não tem motor.',
          'Nas categorias, você pode escolher e depois trocar sua escolha. Um mesmo ambiente pode ser usado em mais de um item.',
        ],
        aprendizagemTabelas: [],
        imagensApoio: [
          {
            imagem: 'env-support.svg',
            descricao:
              'Exemplos: skate no chão (land), canoa na água (water) e balão de ar quente no céu (air).',
          },
          {
            imagem: 'motor-support.svg',
            descricao: 'Trem convencional com motor; skate movido pelo corpo, sem motor.',
          },
        ],
      },
      {
        id: 'q09',
        textoPerguntaVisivel: 'Complete the three sentences about where vehicles travel.',
        apoio: [
          'Use uma palavra do banco em cada frase. Uma palavra pode ser usada mais de uma vez.',
          'Banco nesta ordem: land · air · water. Cenas: barco na água; avião em voo; helicóptero em voo.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'banco',
            pergunta: 'A boat travels on ___.',
            opcoes: [
              {
                id: 'land',
                texto: 'land',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'water',
                texto: 'water',
              },
            ],
            respostas: ['water'],
            imagem: 'boat.svg',
            imagemAlt: 'Embarcação com casco sobre a água.',
            descricao: 'Embarcação com casco sobre a água.',
          },
          {
            id: 'b',
            tipo: 'banco',
            pergunta: 'A plane travels through the ___.',
            opcoes: [
              {
                id: 'land',
                texto: 'land',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'water',
                texto: 'water',
              },
            ],
            respostas: ['air'],
            imagem: 'plane.svg',
            imagemAlt: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
            descricao: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
          },
          {
            id: 'c',
            tipo: 'banco',
            pergunta: 'A helicopter travels through the ___.',
            opcoes: [
              {
                id: 'land',
                texto: 'land',
              },
              {
                id: 'air',
                texto: 'air',
              },
              {
                id: 'water',
                texto: 'water',
              },
            ],
            respostas: ['air'],
            imagem: 'helicopter.svg',
            imagemAlt: 'Veículo no céu com rotor acima da cabine e rotor de cauda.',
            descricao: 'Veículo no céu com rotor acima da cabine e rotor de cauda.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Complete the three sentences about where vehicles travel. For a boat, choose its travel environment. For a plane, choose its travel environment. For a helicopter, choose its travel environment.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Complete as três frases sobre onde os veículos se deslocam. Para o barco, escolha o ambiente de deslocamento. Para o avião, escolha o ambiente de deslocamento. Para o helicóptero, escolha o ambiente de deslocamento.',
          respostaIngles:
            'A boat travels on water. A plane travels through the air. A helicopter travels through the air.',
          significadoPortugues:
            'Um barco se desloca pela água. Um avião se desloca pelo ar. Um helicóptero se desloca pelo ar.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'Não é preciso gastar cada palavra uma só vez. Duas figuras podem compartilhar um ambiente.',
        explicacao: 'Você usou o mesmo ambiente quando ele servia a duas frases.',
      },
      {
        id: 'q10',
        textoPerguntaVisivel: 'Sort the vehicles into motorised and non-motorised.',
        apoio: [
          'Leia a informação de cada cartão e escolha a categoria.',
          'a) Ônibus com motor usado para se mover. b) Bicicleta convencional movida pelos pedais, sem motor. c) Moto movida por motor. d) Avião convencional movido por motores.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'categoria',
            pergunta: 'Bus: it uses a motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['motorised'],
            imagem: 'motor-bus.svg',
            imagemAlt: 'Ônibus convencional. Neste modelo o motor é usado para se mover.',
            descricao: 'Ônibus convencional. Neste modelo o motor é usado para se mover.',
          },
          {
            id: 'b',
            tipo: 'categoria',
            pergunta: 'Bike: pedals, no motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['non-motorised'],
            imagem: 'pedal-bike.svg',
            imagemAlt: 'Bicicleta convencional movida pelos pedais, sem motor.',
            descricao: 'Bicicleta convencional movida pelos pedais, sem motor.',
          },
          {
            id: 'c',
            tipo: 'categoria',
            pergunta: 'Motorbike: it uses a motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['motorised'],
            imagem: 'motorbike.svg',
            imagemAlt: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
            descricao: 'Duas rodas, tanque e motor, sem pedais de bicicleta.',
          },
          {
            id: 'd',
            tipo: 'categoria',
            pergunta: 'Plane: it uses engines.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['motorised'],
            imagem: 'motor-plane.svg',
            imagemAlt: 'Avião convencional em voo, movido por motores.',
            descricao: 'Avião convencional em voo, movido por motores.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Sort the vehicles into motorised and non-motorised. Bus: it uses a motor. Bike: pedals, no motor. Motorbike: it uses a motor. Plane: it uses engines.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Classifique os veículos em motorizados e não motorizados. Ônibus: ele usa motor. Bicicleta: pedais, sem motor. Moto: ela usa motor. Avião: ele usa motores.',
          respostaIngles:
            'This bus is motorised. This bike is non-motorised. This motorbike is motorised. This plane is motorised.',
          significadoPortugues:
            'Este ônibus é motorizado. Esta bicicleta não é motorizada. Esta moto é motorizada. Este avião é motorizado.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Procure a informação sobre motor neste cartão, sem imaginar outro modelo.',
        explicacao: 'Você procurou a informação sobre motor em cada caso.',
      },
      {
        id: 'q11',
        textoPerguntaVisivel: 'Are these two vehicles motorised?',
        apoio: [
          'Observe pedais ou remos e escolha a categoria.',
          'a) Uma pessoa pedala uma bicicleta convencional; o cartão informa: sem motor. b) Uma pessoa movimenta um barco com remos; o cartão informa: sem motor.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'categoria',
            pergunta: 'This bike has no motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['non-motorised'],
            imagem: 'pedal-bike.svg',
            imagemAlt: 'Bicicleta convencional movida pelos pedais, sem motor.',
            descricao: 'Bicicleta convencional movida pelos pedais, sem motor.',
          },
          {
            id: 'b',
            tipo: 'categoria',
            pergunta: 'This rowing boat has no motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['non-motorised'],
            imagem: 'rowing-boat.svg',
            imagemAlt: 'Uma pessoa adulta move os remos que tocam a água. O barco não tem motor.',
            descricao: 'Uma pessoa adulta move os remos que tocam a água. O barco não tem motor.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Are these two vehicles motorised? This bike has no motor. This rowing boat has no motor.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Estes dois veículos são motorizados? Esta bicicleta não tem motor. Este barco a remo não tem motor.',
          respostaIngles:
            'This bike is non-motorised. It has no motor. This rowing boat is non-motorised. It has no motor.',
          significadoPortugues:
            'Esta bicicleta não é motorizada. Ela não tem motor. Este barco a remo não é motorizado. Ele não tem motor.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Uma pessoa pode mover um veículo usando pedais ou remos.',
        explicacao: 'Você reconheceu dois exemplos movidos sem motor.',
      },
      {
        id: 'q12',
        textoPerguntaVisivel: 'Compare the two boats.',
        apoio: [
          'Os dois são barcos, mas não se movem da mesma forma. Escolha uma categoria para cada um.',
          'Barco 1: motor atrás, usado para movimentar a embarcação. Barco 2: remos em uso; o texto informa que não há motor.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'categoria',
            pergunta: 'Boat 1 uses a motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['motorised'],
            imagem: 'motor-boat.svg',
            imagemAlt: 'Barco movido pelo motor visível atrás, em uso; não há remos.',
            descricao: 'Barco movido pelo motor visível atrás, em uso; não há remos.',
          },
          {
            id: 'b',
            tipo: 'categoria',
            pergunta: 'Boat 2 uses oars and has no motor.',
            opcoes: [
              {
                id: 'motorised',
                texto: 'motorised',
              },
              {
                id: 'non-motorised',
                texto: 'non-motorised',
              },
            ],
            respostas: ['non-motorised'],
            imagem: 'rowing-boat.svg',
            imagemAlt: 'Uma pessoa adulta move os remos que tocam a água. O barco não tem motor.',
            descricao: 'Uma pessoa adulta move os remos que tocam a água. O barco não tem motor.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Compare the two boats. Boat 1 uses a motor. Boat 2 uses oars and has no motor.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Compare os dois barcos. O barco 1 usa motor. O barco 2 usa remos e não tem motor.',
          respostaIngles: 'Boat 1 is motorised. Boat 2 is non-motorised.',
          significadoPortugues: 'O barco 1 é motorizado. O barco 2 não é motorizado.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Compare o que faz cada barco se mover, não apenas o nome boat.',
        explicacao: 'Você descobriu que dois barcos podem se mover de formas diferentes.',
      },
      {
        id: 'q13',
        textoPerguntaVisivel: 'Match the safety equipment to its use.',
        apoio: [
          'Escolha o equipamento que combina com cada função.',
          'Banco nesta ordem: seatbelt · knee pads · helmet · lifejacket.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'For your head when you ride a bike.',
            opcoes: [
              {
                id: 'seatbelt',
                texto: 'seatbelt',
              },
              {
                id: 'knee-pads',
                texto: 'knee pads',
              },
              {
                id: 'helmet',
                texto: 'helmet',
              },
              {
                id: 'lifejacket',
                texto: 'lifejacket',
              },
            ],
            respostas: ['helmet'],
            imagem: 'helmet.svg',
            imagemAlt:
              'Capacete cobrindo a cabeça da criança, com tira ajustada sob o queixo e adulto presente.',
            descricao:
              'Capacete cobrindo a cabeça da criança, com tira ajustada sob o queixo e adulto presente.',
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'To keep you secured in your seat in a car.',
            opcoes: [
              {
                id: 'seatbelt',
                texto: 'seatbelt',
              },
              {
                id: 'knee-pads',
                texto: 'knee pads',
              },
              {
                id: 'helmet',
                texto: 'helmet',
              },
              {
                id: 'lifejacket',
                texto: 'lifejacket',
              },
            ],
            respostas: ['seatbelt'],
            imagem: 'seatbelt.svg',
            imagemAlt:
              'No carro parado, adulto confere o cinto corretamente colocado e o assento infantil apropriado.',
            descricao:
              'No carro parado, adulto confere o cinto corretamente colocado e o assento infantil apropriado.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Match the safety equipment to its use. For your head when you ride a bike. To keep you secured in your seat in a car.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Associe o equipamento de proteção ao seu uso. Para a cabeça quando você anda de bicicleta. Para manter você preso com segurança ao assento do carro.',
          respostaIngles:
            'A helmet helps protect your head. A seatbelt keeps you secured in your seat.',
          significadoPortugues:
            'Um capacete ajuda a proteger a cabeça. O cinto mantém você preso com segurança ao assento.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Pense em onde o equipamento fica: na cabeça ou junto ao assento.',
        explicacao: 'Você relacionou as proteções às suas funções.',
        aprendizagem: [
          'Retome as quatro proteções do grupo Stay safe. Observe a função, não apenas a cor do equipamento.',
          'Safe indica uma ação de segurança. Not safe indica que o cuidado ensinado não foi seguido. Exemplo: o adulto verifica a proteção antes de sair; isso é uma ação de segurança. Abrir a porta do veículo enquanto ele se move não segue esse cuidado.',
          'Para a travessia desta atividade, acompanhe a criança com um adulto: 1. Pare na calçada antes da faixa. 2. Espere o sinal de pedestres e confira com o adulto se os veículos pararam e se é seguro atravessar. 3. Atravesse pela faixa com o adulto.',
          'No sinal de pedestres, procure a figura de uma pessoa. Um círculo verde no sinal de veículos não é a mesma coisa. O sinal verde de pedestres também precisa ser acompanhado da verificação com o adulto.',
          'More dangerous significa com maior perigo. Less dangerous significa com menor perigo. Compare a ação e as condições da cena. Exemplo: numa brincadeira de carrinhos, uma peça solta no caminho cria mais risco de alguém tropeçar do que o mesmo caminho livre. A comparação vale para aquela situação.',
        ],
        aprendizagemTabelas: [],
      },
      {
        id: 'q14',
        textoPerguntaVisivel: 'Complete the two safety sentences.',
        apoio: [
          'Escolha uma expressão do banco para cada lacuna.',
          'Banco nesta ordem: helmet · lifejacket · seatbelt · knee pads. Cena a: criança com adulto numa embarcação, com colete ajustado. Cena b: criança de patins numa área protegida, com proteções nos joelhos.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'banco',
            pergunta: 'I wear a ___ on a boat.',
            opcoes: [
              {
                id: 'helmet',
                texto: 'helmet',
              },
              {
                id: 'lifejacket',
                texto: 'lifejacket',
              },
              {
                id: 'seatbelt',
                texto: 'seatbelt',
              },
              {
                id: 'knee-pads',
                texto: 'knee pads',
              },
            ],
            respostas: ['lifejacket'],
            imagem: 'river-trip.svg',
            imagemAlt: 'Criança e adulto atravessam o rio de barco, com coletes ajustados.',
            descricao: 'Criança e adulto atravessam o rio de barco, com coletes ajustados.',
          },
          {
            id: 'b',
            tipo: 'banco',
            pergunta: 'I wear ___ to help protect my knees.',
            opcoes: [
              {
                id: 'helmet',
                texto: 'helmet',
              },
              {
                id: 'lifejacket',
                texto: 'lifejacket',
              },
              {
                id: 'seatbelt',
                texto: 'seatbelt',
              },
              {
                id: 'knee-pads',
                texto: 'knee pads',
              },
            ],
            respostas: ['knee-pads'],
            imagem: 'knee-pads.svg',
            imagemAlt:
              'Criança de patins com capacete e proteções sobre os dois joelhos numa área protegida.',
            descricao:
              'Criança de patins com capacete e proteções sobre os dois joelhos numa área protegida.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Complete the two safety sentences. Choose the safety equipment for a boat. Choose the equipment for your knees.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Complete as duas frases de proteção. Escolha o equipamento de proteção para um barco. Escolha o equipamento para os joelhos.',
          respostaIngles:
            'I wear a lifejacket on a boat. I wear knee pads to help protect my knees.',
          significadoPortugues:
            'Eu uso colete salva-vidas no barco. Eu uso joelheiras para ajudar a proteger os joelhos.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Observe a proteção do tronco e a dos joelhos.',
        explicacao: 'Você completou as frases com as proteções adequadas.',
      },
      {
        id: 'q15',
        textoPerguntaVisivel: 'Choose safe or not safe for each action.',
        apoio: [
          'Julgue a ação destacada. Safe indica o cuidado ensinado; não quer dizer que todo risco desaparece.',
          'a) Na pista protegida, criança começa a pedalar sem capacete; adulto por perto. b) No carro parado, adulto confere cinto e assento infantil adequado antes de sair. c) No barco parado no cais, criança vai iniciar o passeio sem colete. d) Na pista protegida, criança começa a pedalar depois que o adulto ajusta o capacete.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'categoria',
            pergunta: 'Riding a bike without a helmet.',
            opcoes: [
              {
                id: 'safe',
                texto: 'safe',
              },
              {
                id: 'not-safe',
                texto: 'not safe',
              },
            ],
            respostas: ['not-safe'],
            imagem: 'bike-no-helmet.svg',
            imagemAlt:
              'Criança começa a pedalar sem capacete, na pista protegida, com adulto por perto.',
            descricao:
              'Criança começa a pedalar sem capacete, na pista protegida, com adulto por perto.',
          },
          {
            id: 'b',
            tipo: 'categoria',
            pergunta: 'Checking the seatbelt before the car moves.',
            opcoes: [
              {
                id: 'safe',
                texto: 'safe',
              },
              {
                id: 'not-safe',
                texto: 'not safe',
              },
            ],
            respostas: ['safe'],
            imagem: 'seatbelt.svg',
            imagemAlt:
              'No carro parado, adulto confere o cinto corretamente colocado e o assento infantil apropriado.',
            descricao:
              'No carro parado, adulto confere o cinto corretamente colocado e o assento infantil apropriado.',
          },
          {
            id: 'c',
            tipo: 'categoria',
            pergunta: 'Starting a boat trip without a lifejacket.',
            opcoes: [
              {
                id: 'safe',
                texto: 'safe',
              },
              {
                id: 'not-safe',
                texto: 'not safe',
              },
            ],
            respostas: ['not-safe'],
            imagem: 'boat-no-jacket.svg',
            imagemAlt:
              'Criança vai iniciar passeio no barco parado no cais, sem colete, com adulto presente.',
            descricao:
              'Criança vai iniciar passeio no barco parado no cais, sem colete, com adulto presente.',
          },
          {
            id: 'd',
            tipo: 'categoria',
            pergunta: 'Putting on a helmet before riding a bike.',
            opcoes: [
              {
                id: 'safe',
                texto: 'safe',
              },
              {
                id: 'not-safe',
                texto: 'not safe',
              },
            ],
            respostas: ['safe'],
            imagem: 'bike-helmet.svg',
            imagemAlt:
              'A mesma criança, pista, velocidade e adulto. O adulto ajusta o capacete antes de ela pedalar.',
            descricao:
              'A mesma criança, pista, velocidade e adulto. O adulto ajusta o capacete antes de ela pedalar.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Choose safe or not safe for each action. Riding a bike without a helmet. Checking the seatbelt before the car moves. Starting a boat trip without a lifejacket. Putting on a helmet before riding a bike.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Escolha seguro ou não seguro para cada ação. Pedalar sem capacete. Conferir o cinto antes que o carro se mova. Começar um passeio de barco sem colete. Colocar o capacete antes de pedalar.',
          respostaIngles:
            'Riding a bike without a helmet is not safe. Checking the seatbelt before the car moves is a safe action. Starting a boat trip without a lifejacket is not safe. Putting on a helmet before riding a bike is a safe action.',
          significadoPortugues:
            'Pedalar sem capacete não segue o cuidado ensinado. Conferir o cinto antes de sair é uma ação de segurança. Começar um passeio de barco sem colete não segue o cuidado ensinado. Colocar o capacete antes de pedalar é uma ação de segurança.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Procure o cuidado que deve acontecer antes de começar.',
        explicacao: 'Você conferiu cuidados antes de começar o passeio.',
      },
      {
        id: 'q16',
        textoPerguntaVisivel: 'Put the crossing steps in order and choose the pedestrian signal.',
        apoio: [
          'No item a, organize os cartões. Você pode retirar e recolocar cada um. No item b, escolha um sinal.',
          'Criança com adulto numa faixa com sinal de pedestres. Os cartões do item a chegam misturados.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'ordenacao',
            pergunta: 'Put the three cards in order.',
            opcoes: [
              {
                id: 'cross',
                texto:
                  'Cartão A: depois que o adulto confirma que é seguro, os dois atravessam pela faixa.',
                imagem: 'cross-step.svg',
              },
              {
                id: 'stop',
                texto: 'Cartão B: os dois param na calçada antes da faixa.',
                imagem: 'stop-step.svg',
              },
              {
                id: 'check',
                texto:
                  'Cartão C: esperam o verde de pedestres e o adulto verifica se os veículos pararam.',
                imagem: 'check-step.svg',
              },
            ],
            respostas: ['stop', 'check', 'cross'],
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Which signal is the green pedestrian signal?',
            opcoes: [
              {
                id: 'fig-red-person',
                texto: 'Figura A: pessoa vermelha parada.',
                imagem: 'red-person.svg',
              },
              {
                id: 'fig-green-circle',
                texto: 'Figura B: círculo verde de um sinal de veículos.',
                imagem: 'green-circle.svg',
              },
              {
                id: 'fig-green-person',
                texto: 'Figura C: pessoa verde em posição de caminhar.',
                imagem: 'green-person.svg',
              },
            ],
            respostas: ['fig-green-person'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Put the crossing steps in order and choose the pedestrian signal. Put the three cards in order. Which signal is the green pedestrian signal?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Coloque os passos da travessia em ordem e escolha o sinal de pedestres. Coloque os três cartões em ordem. Qual sinal é o verde de pedestres?',
          respostaIngles:
            'First, stop on the sidewalk. Then, wait for the pedestrian signal and check with an adult. Finally, cross at the crossing. The green pedestrian signal shows a walking person.',
          significadoPortugues:
            'Primeiro, pare na calçada. Depois, espere o sinal de pedestres e confira com um adulto. Por último, atravesse pela faixa. O sinal verde de pedestres mostra uma pessoa caminhando.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Parada e verificação vêm antes da travessia. No sinal, procure a pessoa.',
        explicacao: 'Você organizou os momentos da travessia e encontrou o sinal de pedestres.',
      },
      {
        id: 'q17',
        textoPerguntaVisivel: 'Choose the more dangerous scene and the less dangerous scene.',
        apoio: [
          'Compare apenas as duas cenas de cada par. Dentro de cada par, as condições da rua ou da pista são iguais.',
          'Par a: cena A mostra criança com adulto na calçada, afastados da borda; cena B mostra os mesmos personagens na pista, fora da faixa, com carros se aproximando. Par b: na pista protegida, cena A mostra criança pedalando sem capacete; cena B mostra a mesma criança com capacete ajustado. Velocidade, adulto e pista são iguais.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: 'Which scene is more dangerous?',
            opcoes: [
              {
                id: 'scene-a',
                texto: 'Scene A.',
                imagem: 'street-sidewalk.svg',
              },
              {
                id: 'scene-b',
                texto: 'Scene B.',
                imagem: 'street-road.svg',
              },
            ],
            respostas: ['scene-b'],
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Which scene is less dangerous?',
            opcoes: [
              {
                id: 'scene-a',
                texto: 'Scene A.',
                imagem: 'bike-no-helmet.svg',
              },
              {
                id: 'scene-b',
                texto: 'Scene B.',
                imagem: 'bike-helmet-comparison.svg',
              },
            ],
            respostas: ['scene-b'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Choose the more dangerous scene and the less dangerous scene. Which scene is more dangerous? Which scene is less dangerous?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Escolha a cena de maior perigo e a cena de menor perigo. Qual cena tem maior perigo? Qual cena tem menor perigo?',
          respostaIngles:
            'Scene B is more dangerous: they are walking in the road near moving cars. Scene B is less dangerous: the rider is wearing a helmet.',
          significadoPortugues:
            'A cena B tem maior perigo: eles caminham na pista perto de carros em movimento. A cena B tem menor risco: a criança usa capacete.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'Compare apenas a conduta que mudou, sem imaginar outra velocidade ou outro lugar.',
        explicacao:
          'Você comparou as condições das cenas, sem julgar todos os veículos do mesmo jeito.',
      },
      {
        id: 'q18',
        textoPerguntaVisivel: 'Which vehicle is faster in each trip?',
        apoio: [
          'Em cada par, o caminho é o mesmo. Nesta atividade, quem leva menos tempo para completá-lo é faster. Não precisa fazer conta.',
          'Percurso a: viagens fictícias de adultos no mesmo caminho. bike — 8 minutos; motorbike — 4 minutos. Percurso b: modelos numa pista de brinquedo de mesmo comprimento. bus — 3 minutos; car — 6 minutos.',
        ],
        tabelas: [
          {
            titulo: 'Mesmo caminho: percurso a de adultos',
            colunas: ['Vehicle', 'Time'],
            linhas: [
              ['bike', '8 minutes'],
              ['motorbike', '4 minutes'],
            ],
          },
          {
            titulo: 'Mesmo caminho: percurso b de brinquedos',
            colunas: ['Model', 'Time'],
            linhas: [
              ['bus', '3 minutes'],
              ['car', '6 minutes'],
            ],
          },
        ],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: 'Trip a.',
            opcoes: [
              {
                id: 'bike-8-minutes',
                texto: 'bike — 8 minutes',
              },
              {
                id: 'motorbike-4-minutes',
                texto: 'motorbike — 4 minutes',
              },
            ],
            respostas: ['motorbike-4-minutes'],
            imagem: 'trip-adults.svg',
            imagemAlt:
              'Mesmo caminho fictício: bicicleta, oito minutos; moto, quatro minutos. Adultos conduzem; o motorista da moto usa capacete.',
            descricao:
              'Mesmo caminho fictício: bicicleta, oito minutos; moto, quatro minutos. Adultos conduzem; o motorista da moto usa capacete.',
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Trip b.',
            opcoes: [
              {
                id: 'bus-3-minutes',
                texto: 'bus — 3 minutes',
              },
              {
                id: 'car-6-minutes',
                texto: 'car — 6 minutes',
              },
            ],
            respostas: ['bus-3-minutes'],
            imagem: 'trip-models.svg',
            imagemAlt:
              'Modelos numa pista de brinquedo: ônibus, três minutos; carro, seis minutos. Caminhos de mesmo comprimento.',
            descricao:
              'Modelos numa pista de brinquedo: ônibus, três minutos; carro, seis minutos. Caminhos de mesmo comprimento.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Which vehicle is faster in each trip? Trip a. Trip b.',
        revisaoPosResposta: {
          perguntaPortugues: 'Qual veículo é mais rápido em cada percurso? Percurso a. Percurso b.',
          respostaIngles:
            'In trip a, the motorbike is faster. It takes four minutes. In trip b, the bus model is faster. It takes three minutes.',
          significadoPortugues:
            'No percurso a, a moto é mais rápida. Ela leva quatro minutos. No percurso b, o modelo de ônibus é mais rápido. Ele leva três minutos.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Veja o menor número de minutos dentro de cada par.',
        explicacao: 'Você usou o tempo do mesmo caminho para comparar cada par.',
        aprendizagem: [
          'Faster significa mais rápido. Em dois percursos do mesmo comprimento, podemos comparar o tempo para completá-los. Exemplo: dois aviões de brinquedo fazem o mesmo caminho. Um leva 5 minutos; o outro, 2. Nesse exemplo, o que leva 2 minutos é faster. Isso não é uma regra sobre todos os modelos de avião.',
          'Leia as setas olhando a tela de frente: - ← left — esquerda. - → right — direita. - ↑ straight ahead — em frente, no mapa desta atividade.',
          'Não gire a tela ou imagine o lado de outra pessoa. O mapa usa os lados que você vê.',
          'By pode apresentar o transporte: I go by car. — Eu vou de carro. Observe o veículo que a cena realmente mostra; não precisa adivinhar entre vários possíveis.',
          'Para a maquete, places quer dizer lugares e room for six quer dizer espaço para seis. Um modelo com oito lugares também tem espaço para seis bonecos.',
        ],
        aprendizagemTabelas: [],
        imagensApoio: [
          {
            imagem: 'faster-support.svg',
            descricao:
              'Dois aviões de brinquedo no mesmo percurso: um leva cinco minutos e outro dois minutos.',
          },
        ],
      },
      {
        id: 'q19',
        textoPerguntaVisivel: 'Match the directions to the arrows.',
        apoio: [
          'Olhe as setas de frente. Esquerda e direita são os lados da tela; não gire a imagem.',
          'Cada opção é uma seta simples, sem perspectiva.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'Turn left.',
            opcoes: [
              {
                id: 'fig-right',
                texto: 'Seta: para o lado direito da tela.',
                imagem: 'right.svg',
              },
              {
                id: 'fig-up',
                texto: 'Seta: para cima.',
                imagem: 'up.svg',
              },
              {
                id: 'fig-left',
                texto: 'Seta: para o lado esquerdo da tela.',
                imagem: 'left.svg',
              },
            ],
            respostas: ['fig-left'],
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'Turn right.',
            opcoes: [
              {
                id: 'fig-right',
                texto: 'Seta: para o lado direito da tela.',
                imagem: 'right.svg',
              },
              {
                id: 'fig-left',
                texto: 'Seta: para o lado esquerdo da tela.',
                imagem: 'left.svg',
              },
              {
                id: 'fig-up',
                texto: 'Seta: para cima.',
                imagem: 'up.svg',
              },
            ],
            respostas: ['fig-right'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Match the directions to the arrows. Turn left. Turn right.',
        revisaoPosResposta: {
          perguntaPortugues: 'Associe as direções às setas. Vire à esquerda. Vire à direita.',
          respostaIngles:
            'Turn left. Choose the arrow pointing left. Turn right. Choose the arrow pointing right.',
          significadoPortugues:
            'Vire à esquerda. Escolha a seta que aponta para a esquerda. Vire à direita. Escolha a seta que aponta para a direita.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Mantenha a tela na mesma posição e compare os lados das setas.',
        explicacao: 'Você acompanhou esquerda e direita no referencial da tela.',
      },
      {
        id: 'q20',
        textoPerguntaVisivel: 'Complete the sentences using the vehicle in each scene.',
        apoio: [
          'Use o transporte mostrado na cena. Outros veículos poderiam fazer passeios, mas aqui a cena mostra qual foi usado.',
          'Cena a: veículo comprido, com várias janelas e muitos bancos, para na escola; criança desembarca com adulto. Cena b: embarcação atravessa um rio entre duas margens, com passageiros usando coletes ajustados.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'banco',
            pergunta: 'I go to school by ___.',
            opcoes: [
              {
                id: 'plane',
                texto: 'plane',
              },
              {
                id: 'bus',
                texto: 'bus',
              },
              {
                id: 'boat',
                texto: 'boat',
              },
            ],
            respostas: ['bus'],
            imagem: 'school-trip.svg',
            imagemAlt:
              'Ônibus de passageiros parado diante de uma escola fictícia; criança desembarca com adulto.',
            descricao:
              'Ônibus de passageiros parado diante de uma escola fictícia; criança desembarca com adulto.',
          },
          {
            id: 'b',
            tipo: 'banco',
            pergunta: 'I cross the river by ___.',
            opcoes: [
              {
                id: 'boat',
                texto: 'boat',
              },
              {
                id: 'car',
                texto: 'car',
              },
              {
                id: 'train',
                texto: 'train',
              },
            ],
            respostas: ['boat'],
            imagem: 'river-trip.svg',
            imagemAlt: 'Criança e adulto atravessam o rio de barco, com coletes ajustados.',
            descricao: 'Criança e adulto atravessam o rio de barco, com coletes ajustados.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Complete the sentences using the vehicle in each scene. Look at the school trip. Choose the vehicle. Look at the river crossing. Choose the vehicle.',
        revisaoPosResposta: {
          perguntaPortugues:
            'Complete as frases usando o veículo de cada cena. Observe o passeio até a escola e escolha o veículo. Observe a travessia do rio e escolha o veículo.',
          respostaIngles: 'I go to school by bus. I cross the river by boat.',
          significadoPortugues: 'Eu vou à escola de ônibus. Eu atravesso o rio de barco.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Use a evidência da cena, não apenas um veículo possível.',
        explicacao: 'Você escolheu o transporte que a cena realmente mostrou.',
      },
      {
        id: 'q21',
        textoPerguntaVisivel: 'Read the story and answer the three questions.',
        apoio: [
          'A história inteira fica disponível. Volte ao trecho que ajuda a responder.',
          'A trip to the river',
          "Mia and Leo go to the river with Jo, an adult. Leo uses a wheelchair. They choose the blue bus because it has a ramp and space for Leo's wheelchair. Mia has a toy boat in her bag. At the river, they watch the boats. They stay with Jo on the path. They do not get into a boat.",
          'Vamos compreender: Mia e Leo vão até o rio com Jo, uma pessoa adulta. Leo usa cadeira de rodas. Eles escolhem o ônibus azul porque ele tem rampa e espaço para a cadeira de rodas de Leo. Mia tem um barco de brinquedo na bolsa. No rio, eles observam os barcos. Ficam com Jo no caminho de passeio. Eles não entram num barco.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'alternativa',
            pergunta: 'How do Mia and Leo go to the river?',
            opcoes: [
              {
                id: 'by-boat',
                texto: 'By boat.',
              },
              {
                id: 'by-car',
                texto: 'By car.',
              },
              {
                id: 'by-bus',
                texto: 'By bus.',
              },
            ],
            respostas: ['by-bus'],
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Who has a toy boat?',
            opcoes: [
              {
                id: 'mia',
                texto: 'Mia.',
              },
              {
                id: 'jo',
                texto: 'Jo.',
              },
              {
                id: 'leo',
                texto: 'Leo.',
              },
            ],
            respostas: ['mia'],
          },
          {
            id: 'c',
            tipo: 'alternativa',
            pergunta: 'Why do they choose this bus?',
            opcoes: [
              {
                id: 'it-is-leo-s-favourite-bus',
                texto: "It is Leo's favourite bus.",
              },
              {
                id: 'it-has-a-ramp-and-space-for-leo-s-wheelchair',
                texto: "It has a ramp and space for Leo's wheelchair.",
              },
              {
                id: 'it-is-the-only-bus-today',
                texto: 'It is the only bus today.',
              },
            ],
            respostas: ['it-has-a-ramp-and-space-for-leo-s-wheelchair'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Read the story and answer the three questions. How do Mia and Leo go to the river? Who has a toy boat? Why do they choose this bus?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Leia a história e responda às três perguntas. Como Mia e Leo vão até o rio? Quem tem um barco de brinquedo? Por que eles escolhem esse ônibus?',
          respostaIngles:
            "Mia and Leo go to the river by bus. Mia has a toy boat. They choose the bus because it has a ramp and space for Leo's wheelchair.",
          significadoPortugues:
            'Mia e Leo vão até o rio de ônibus. Mia tem um barco de brinquedo. Eles escolhem o ônibus porque ele tem rampa e espaço para a cadeira de rodas de Leo.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'Procure o transporte da viagem, o brinquedo e o motivo da escolha. Brinquedo e veículo da viagem não são a mesma coisa.',
        explicacao:
          'Você encontrou informações na história e distinguiu o brinquedo do transporte da viagem.',
        imagemEnunciado: 'story-summary.svg',
        imagemEnunciadoAlt:
          'Mia, Leo em cadeira de rodas e Jo participam juntos do passeio; ônibus com rampa, brinquedo na bolsa de Mia e observação dos barcos sem embarcar.',
      },
      {
        id: 'q22',
        textoPerguntaVisivel: 'Choose vehicles for the model trip.',
        apoio: [
          'Depois da visita, Mia e Leo montam uma maquete. As capacidades abaixo pertencem a esses modelos, não a todos os veículos do mundo.',
          'No trecho em terra, seis bonecos precisam viajar juntos em um único modelo. Há estrada e trilhos na maquete. Cartões: car — 2 lugares; train — 8 lugares; bus — 6 lugares; helicopter — 4 lugares. No segundo trecho, a rota segue pela água do rio. Não há ponte. Escolha um veículo convencional próprio para navegar na água.',
        ],
        tabelas: [
          {
            titulo: 'Capacidades estipuladas para a maquete',
            colunas: ['Model', 'Places'],
            linhas: [
              ['car', '2'],
              ['train', '8'],
              ['bus', '6'],
              ['helicopter', '4'],
            ],
          },
        ],
        itens: [
          {
            id: 'a',
            tipo: 'selecao',
            pergunta: 'Select the two land vehicles with room for six toy passengers.',
            opcoes: [
              {
                id: 'car-2-places',
                texto: 'car — 2 places',
                imagem: 'model-car.svg',
              },
              {
                id: 'train-8-places',
                texto: 'train — 8 places',
                imagem: 'model-train.svg',
              },
              {
                id: 'bus-6-places',
                texto: 'bus — 6 places',
                imagem: 'model-bus.svg',
              },
              {
                id: 'helicopter-4-places',
                texto: 'helicopter — 4 places',
                imagem: 'model-helicopter.svg',
              },
            ],
            respostas: ['train-8-places', 'bus-6-places'],
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'Which vehicle is designed to travel on the water?',
            opcoes: [
              {
                id: 'boat',
                texto: 'boat',
                imagem: 'boat.svg',
              },
              {
                id: 'car',
                texto: 'car',
                imagem: 'car.svg',
              },
              {
                id: 'bus',
                texto: 'bus',
                imagem: 'bus.svg',
              },
            ],
            respostas: ['boat'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Choose vehicles for the model trip. Select the two land vehicles with room for six toy passengers. Which vehicle is designed to travel on the water?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Escolha veículos para a viagem da maquete. Selecione os dois veículos terrestres com espaço para seis bonecos passageiros. Qual veículo é feito para se deslocar pela água?',
          respostaIngles:
            'Select the train and the bus. Both travel on land and have room for six toy passengers in this model. Choose the boat for the water part.',
          significadoPortugues:
            'Selecione trem e ônibus. Os dois vão por terra e têm espaço para seis bonecos nestes modelos. Escolha o barco para o trecho na água.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'No item a, confira duas condições: ir por terra e ter ao menos seis lugares. No b, pense no ambiente da rota.',
        explicacao: 'Você conferiu o ambiente e o espaço necessário nos modelos.',
        imagemEnunciado: 'model-trip.svg',
        imagemEnunciadoAlt:
          'Maquete com seis bonecos, estrada para ônibus e trilhos para trem, seguida de trecho por água sem ponte.',
      },
      {
        id: 'q23',
        textoPerguntaVisivel: 'Read the timetable and choose the days.',
        apoio: ['A agenda é inventada. Você pode consultar o apoio dos dias da semana.'],
        tabelas: [
          {
            titulo: 'Consulte o quadro',
            colunas: ['Day', 'Trip'],
            linhas: [
              ['Monday', 'By bike to the park.'],
              ['Wednesday', 'By train to the museum.'],
              ['Saturday', 'By boat on the lake.'],
            ],
          },
        ],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'On which day is the train trip?',
            opcoes: [
              {
                id: 'saturday',
                texto: 'Saturday',
              },
              {
                id: 'wednesday',
                texto: 'Wednesday',
              },
              {
                id: 'monday',
                texto: 'Monday',
              },
            ],
            respostas: ['wednesday'],
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'On which day is the boat trip?',
            opcoes: [
              {
                id: 'monday',
                texto: 'Monday',
              },
              {
                id: 'wednesday',
                texto: 'Wednesday',
              },
              {
                id: 'saturday',
                texto: 'Saturday',
              },
            ],
            respostas: ['saturday'],
          },
          {
            id: 'c',
            tipo: 'associacao',
            pergunta: 'On which day is the bike trip?',
            opcoes: [
              {
                id: 'saturday',
                texto: 'Saturday',
              },
              {
                id: 'monday',
                texto: 'Monday',
              },
              {
                id: 'wednesday',
                texto: 'Wednesday',
              },
            ],
            respostas: ['monday'],
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Read the timetable and choose the days. On which day is the train trip? On which day is the boat trip? On which day is the bike trip?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Leia a agenda e escolha os dias. Em qual dia é o passeio de trem? Em qual dia é o passeio de barco? Em qual dia é o passeio de bicicleta?',
          respostaIngles:
            'The train trip is on Wednesday. The boat trip is on Saturday. The bike trip is on Monday.',
          significadoPortugues:
            'O passeio de trem é na quarta-feira. O passeio de barco é no sábado. O passeio de bicicleta é na segunda-feira.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro: 'Encontre o transporte na coluna Trip e siga a mesma linha até Day.',
        explicacao: 'Você consultou a linha certa da agenda.',
        aprendizagem: [
          'Uma agenda pode começar em dias diferentes. Na questão, use o dia que está escrito e consulte a linha do passeio.',
          'Fall também pode significar autumn. As estações não têm o mesmo clima em todos os lugares. Um inverno não precisa ter neve. Nas cenas da atividade, o calendário informa a estação.',
        ],
        aprendizagemTabelas: [
          {
            titulo: 'Leia e aprenda',
            colunas: ['English', 'Português'],
            linhas: [
              ['Sunday', 'domingo'],
              ['Monday', 'segunda-feira'],
              ['Tuesday', 'terça-feira'],
              ['Wednesday', 'quarta-feira'],
              ['Thursday', 'quinta-feira'],
              ['Friday', 'sexta-feira'],
              ['Saturday', 'sábado'],
            ],
          },
          {
            titulo: 'Leia e aprenda',
            colunas: ['English', 'Português'],
            linhas: [
              ['spring', 'primavera'],
              ['summer', 'verão'],
              ['autumn', 'outono'],
              ['winter', 'inverno'],
            ],
          },
        ],
      },
      {
        id: 'q24',
        textoPerguntaVisivel: 'Match the two trips to the seasons.',
        apoio: [
          'Os passeios acontecem num lugar fictício. Use o calendário escrito em português. As estações não têm o mesmo clima em todos os lugares.',
          'Cena a: passeio de bicicleta num jardim, com capacete ajustado e adulto. O calendário diz: primavera. Cena b: passeio de ônibus em dia frio e chuvoso. O calendário diz: inverno. Não há neve.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'associacao',
            pergunta: 'Scene a.',
            opcoes: [
              {
                id: 'autumn',
                texto: 'autumn',
              },
              {
                id: 'winter',
                texto: 'winter',
              },
              {
                id: 'spring',
                texto: 'spring',
              },
              {
                id: 'summer',
                texto: 'summer',
              },
            ],
            respostas: ['spring'],
            imagem: 'spring-trip.svg',
            imagemAlt:
              'Criança e adulto de bicicleta com capacetes ajustados num jardim fictício. O calendário informa primavera.',
            descricao:
              'Criança e adulto de bicicleta com capacetes ajustados num jardim fictício. O calendário informa primavera.',
          },
          {
            id: 'b',
            tipo: 'associacao',
            pergunta: 'Scene b.',
            opcoes: [
              {
                id: 'winter',
                texto: 'winter',
              },
              {
                id: 'spring',
                texto: 'spring',
              },
              {
                id: 'summer',
                texto: 'summer',
              },
              {
                id: 'autumn',
                texto: 'autumn',
              },
            ],
            respostas: ['winter'],
            imagem: 'winter-trip.svg',
            imagemAlt:
              'Ônibus numa paisagem fria e chuvosa, sem neve. O calendário informa inverno.',
            descricao:
              'Ônibus numa paisagem fria e chuvosa, sem neve. O calendário informa inverno.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles: 'Match the two trips to the seasons. Scene a. Scene b.',
        revisaoPosResposta: {
          perguntaPortugues: 'Associe os dois passeios às estações. Cena a. Cena b.',
          respostaIngles: 'Scene a is in spring. Scene b is in winter.',
          significadoPortugues: 'A cena a acontece na primavera. A cena b acontece no inverno.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'Associe o nome no calendário ao termo inglês. Não dependa só de flores, chuva ou neve.',
        explicacao: 'Você usou o calendário para nomear as estações.',
      },
      {
        id: 'q25',
        textoPerguntaVisivel: 'Plan the two parts of the trip.',
        apoio: [
          'Leia todo o plano. No item a, marque exatamente dois transportes. Depois responda b e c. Você pode desmarcar e trocar respostas.',
          'Criança e adulto vão por uma ciclovia até o cais, cada um pedalando sua bicicleta convencional e com capacete ajustado. Deixam as bicicletas no bicicletário do cais e entram num barco para atravessar o rio. Antes do embarque, ajustam os coletes salva-vidas. Mapa visto de cima: o ponto S está no centro. O cais está do lado esquerdo da tela e o parque do lado direito. A única rota destacada sai de S e segue até o cais. O mapa não gira.',
        ],
        tabelas: [],
        itens: [
          {
            id: 'a',
            tipo: 'selecao',
            pergunta: 'Select the two means of transportation used in the plan.',
            opcoes: [
              {
                id: 'car',
                texto: 'car',
                imagem: 'car.svg',
              },
              {
                id: 'boat',
                texto: 'boat',
                imagem: 'boat.svg',
              },
              {
                id: 'plane',
                texto: 'plane',
                imagem: 'plane.svg',
              },
              {
                id: 'bike',
                texto: 'bike',
                imagem: 'bike.svg',
              },
              {
                id: 'bus',
                texto: 'bus',
                imagem: 'bus.svg',
              },
            ],
            respostas: ['boat', 'bike'],
          },
          {
            id: 'b',
            tipo: 'alternativa',
            pergunta: 'What do they wear on the boat?',
            opcoes: [
              {
                id: 'helmet',
                texto: 'helmet',
              },
              {
                id: 'lifejacket',
                texto: 'lifejacket',
              },
              {
                id: 'knee-pads',
                texto: 'knee pads',
              },
              {
                id: 'seatbelt',
                texto: 'seatbelt',
              },
            ],
            respostas: ['lifejacket'],
          },
          {
            id: 'c',
            tipo: 'alternativa',
            pergunta: 'Which direction does the route go from S to the dock?',
            opcoes: [
              {
                id: 'right',
                texto: 'right',
              },
              {
                id: 'straight-ahead',
                texto: 'straight ahead',
              },
              {
                id: 'left',
                texto: 'left',
              },
            ],
            respostas: ['left'],
            imagem: 'map.svg',
            imagemAlt:
              'Mapa plano: S no centro; cais à esquerda; parque à direita. Rota de S ao cais apontando para a esquerda.',
          },
        ],
        alternativas: [],
        instrucaoPortugues:
          'Ouça os comandos, observe e responda a todas as partes. Você pode trocar, retirar ou desmarcar antes de conferir.',
        perguntaIngles:
          'Plan the two parts of the trip. Select the two means of transportation used in the plan. What do they wear on the boat? Which direction does the route go from S to the dock?',
        revisaoPosResposta: {
          perguntaPortugues:
            'Planeje os dois trechos do passeio. Selecione os dois meios de transporte usados no plano. O que eles usam no barco? Para qual direção a rota vai de S até o cais?',
          respostaIngles:
            'The two means of transportation are bike and boat. They wear a lifejacket on the boat. The route goes left, from S to the dock.',
          significadoPortugues:
            'Os dois meios de transporte são bicicleta e barco. Eles usam colete salva-vidas no barco. A rota segue para a esquerda, de S até o cais.',
          unidadeRespostaIngles: 'frase',
          unidadeSignificadoPortugues: 'frase',
        },
        feedbackErro:
          'Separe os dois trechos, confira a proteção na água e acompanhe a rota de S até o cais.',
        explicacao: 'Você reuniu transporte, proteção e direção em um passeio completo.',
        imagemEnunciado: 'final-trip.svg',
        imagemEnunciadoAlt:
          'Criança e adulto de bicicleta e capacete na ciclovia. No cais, deixam as bicicletas no bicicletário e embarcam no barco com coletes ajustados.',
      },
    ],
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'mariana',
          nome: 'Mariana',
          principal: true,
          chaveArmazenamento:
            'revisoesEscolares.mariana.ingles.meansOfTransportationOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.responsavel.ingles.marianaMeansOfTransportationOutubro2026.v1',
        },
      ],
    },
    pronuncia: {
      id: 'means-of-transportation-outubro-2026-conversacao-v1',
      habilitada: true,
      diretorioImagens: 'ingles-means-of-transportation-outubro-2026',
      gatewayUrl: 'http://127.0.0.1:5190/api/pronunciation',
      duracaoMaximaSegundos: 15,
      timeoutMs: 12000,
      faixas: {
        muitoBem: 75,
        quase: 45,
      },
      descricao:
        'Cinco conversas opcionais. Você pode apenas ouvir os modelos e repetir. A atividade já está concluída.',
      pares: [
        {
          id: 'pair-1',
          pergunta: "What's this?",
          resposta: "It's a bus.",
          imagem: 'bus.svg',
          imagemAlt: 'Veículo comprido com muitas janelas, bancos e porta de embarque.',
        },
        {
          id: 'pair-2',
          pergunta: 'Is this bus motorised?',
          resposta: 'Yes, it is.',
          imagem: 'motor-bus.svg',
          imagemAlt: 'Ônibus convencional. Neste modelo o motor é usado para se mover.',
        },
        {
          id: 'pair-3',
          pergunta: 'Where does a plane travel?',
          resposta: 'It travels through the air.',
          imagem: 'plane.svg',
          imagemAlt: 'Avião convencional com asas fixas, cauda, cabine e motores, voando no céu.',
        },
        {
          id: 'pair-4',
          pergunta: 'How do you cross this river?',
          resposta: 'I go by boat.',
          imagem: 'river-trip.svg',
          imagemAlt: 'Criança e adulto atravessam o rio de barco, com coletes ajustados.',
        },
        {
          id: 'pair-5',
          pergunta: 'What do you wear on your head?',
          resposta: 'I wear a helmet.',
          imagem: 'bike-helmet.svg',
          imagemAlt:
            'A mesma criança, pista, velocidade e adulto. O adulto ajusta o capacete antes de ela pedalar.',
        },
      ],
      mensagemIndisponibilidade:
        'Se o microfone, o gateway ou a internet não estiverem disponíveis, use os modelos locais. Moving Around continua concluída.',
    },
    mensagemFinal:
      'Mariana, você reuniu transporte, proteção e direção! Corrigir e conferir ajuda a aprender. Faça uma pausa e conte o que já consegue fazer.',
    enriquecimentos: {
      paragrafos: [
        '· Hora de consolidar Você terminou as 25 questões. Cada questão vale no máximo um ponto. Corrigir e conferir de novo ajuda a aprender.',
        'Escolha uma frase para cada tema: Já consigo, Consigo com ajuda ou Quero praticar mais: - Reconhecer e nomear transportes em inglês. - Dizer por onde eles se deslocam e observar se usam motor. - Relacionar proteção, viagem e direção.',
        'Essa conversa não vale pontos.',
        'Scooter pode ser usado para veículos diferentes. As duas expressões acima ajudam a dizer qual é o caso; não vamos classificar um desenho ambíguo só por esse nome.',
      ],
      tabelas: [
        {
          titulo: 'More words · Glossário opcional',
          colunas: ['English', 'Português'],
          linhas: [
            ['subway', 'metrô'],
            ['taxi', 'táxi'],
            ['ship', 'navio'],
            ['van', 'van'],
            ['ferry', 'balsa'],
            ['kayak', 'caiaque'],
            ['tractor', 'trator'],
            ['kick scooter', 'patinete movido por impulso do corpo'],
            ['motor scooter', 'scooter motorizada'],
          ],
        },
      ],
      figuras: [
        {
          imagem: 'tuk-tuk.svg',
          descricao: 'Neste modelo, três rodas, cobertura e motor.',
        },
        {
          imagem: 'animals.svg',
          descricao: 'Cachorro e gato: domesticados. Leão e urso: selvagens.',
        },
      ],
    },
  });
})();
