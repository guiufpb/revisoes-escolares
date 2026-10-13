(function () {
  'use strict';
  // Conteúdo original da síntese aprovada; interações e progresso usam o motor compartilhado.
  window.QuestionariosRevisoes.registrar({
    id: 'mariana-geografia-paisagens-qualidade-vida-outubro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Geografia',
    titulo: 'Lugares de viver, cuidar e transformar',
    subtitulo: 'Paisagens, trabalho, qualidade de vida e representações · Prova 07/10',
    chave: 'revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.v1',
    layout: {
      desktopAmplo: true,
    },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'mariana',
          nome: 'Mariana',
          principal: true,
          chaveArmazenamento:
            'revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Você observou paisagens, relacionou trabalhos, pensou em cuidados e comparou registros! São 30 questões e 30 pontos. Conversa sem pontos: escolha uma descoberta para contar ao responsável. Depois, diga como se sente: aprendi / quero praticar mais / preciso de ajuda. Não é necessário registrar informações da sua família ou do lugar onde você mora.',
    questoes: [
      {
        id: 'geo-paisagens-q01',
        bloco: 'Geografia · Aprender a observar os lugares',
        titulo: '1. Duas paisagens',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q01-a',
            pergunta: 'a) Qual paisagem aparece principalmente na cena A? Escolha uma opção.',
            opcoes: ['Paisagem do campo.', 'Paisagem da cidade.', 'Paisagem apenas de floresta.'],
            respostas: ['Paisagem da cidade.'],
          },
          {
            id: 'geo-paisagens-q01-b',
            pergunta: 'b) Qual paisagem aparece principalmente na cena B? Escolha uma opção.',
            opcoes: ['Paisagem da cidade.', 'Paisagem apenas de floresta.', 'Paisagem do campo.'],
            respostas: ['Paisagem do campo.'],
          },
        ],
        dica: 'Compare o conjunto de construções e atividades de cada cena. Uma árvore ou uma casa pode aparecer nos dois lugares.',
        sucesso:
          'Você reconheceu as paisagens pelo conjunto de pistas. Há moradias e árvores tanto no campo quanto na cidade.',
        opcoesReversiveis: true,
        leitura:
          'Uma paisagem reúne elementos que podemos observar em um lugar. Há elementos da natureza e elementos construídos pelas pessoas. Campo e cidade têm moradias, trabalho e vida em comunidade. Para conhecer as características de um lugar, observe várias pistas juntas.\n\nEm muitas paisagens urbanas, as construções e os serviços ficam próximos. Em muitas paisagens rurais, há áreas de cultivo e criação de animais. Uma árvore ou uma casa, sozinha, não permite decidir: elas podem aparecer nos dois ambientes.\n\nObserve as cenas:\n\nCena A: Uma rua com casas próximas, dois prédios, padaria, escola, calçada, ônibus e árvores.\nCena B: Uma área com plantação de feijão, pastagem com vacas, casa, galpão, trator e estrada entre os terrenos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/paisagens.svg',
        descricaoIlustracao:
          'Cena A: casas próximas, dois prédios, padaria, escola, calçada, ônibus e árvores. Cena B: feijão em fileiras, vacas na pastagem, casa, galpão, trator, estrada e árvores.',
      },
      {
        id: 'geo-paisagens-q02',
        bloco: 'Geografia · Aprender a observar os lugares',
        titulo: '2. As pistas precisam combinar',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q02-a',
            pergunta:
              'a) Na cena A, quais duas pistas ajudam mais a reconhecer a paisagem da cidade? Marque duas.',
            opcoes: [
              'Árvores na paisagem.',
              'Casas e prédios próximos uns dos outros.',
              'Céu acima das construções.',
              'Escola e comércio próximos na mesma rua.',
            ],
            respostas: [
              'Casas e prédios próximos uns dos outros.',
              'Escola e comércio próximos na mesma rua.',
            ],
            tipo: 'selecao',
          },
          {
            id: 'geo-paisagens-q02-b',
            pergunta:
              'b) Na cena B, quais duas pistas ajudam mais a reconhecer a paisagem do campo? Marque duas.',
            opcoes: [
              'Área de plantação.',
              'Céu acima da paisagem.',
              'Pastagem usada para criar vacas.',
              'Uma casa onde mora uma família.',
            ],
            respostas: ['Área de plantação.', 'Pastagem usada para criar vacas.'],
            tipo: 'selecao',
          },
        ],
        dica: 'Procure pistas das atividades e da organização do espaço. Não escolha um elemento só porque ele existe na cena.',
        sucesso:
          'Você separou pistas que ajudam a distinguir as paisagens de elementos que podem existir nos dois ambientes.',
        opcoesReversiveis: true,
        leitura:
          'Uma pista ajuda quando está relacionada às características que estamos procurando. Ter céu, árvores ou veículos não é uma característica exclusiva do campo ou da cidade.\n\nObserve novamente nesta questão:\n\nCena A: Casas próximas, dois prédios, padaria, escola, calçada, ônibus e árvores.\nCena B: Plantação de feijão, pastagem com vacas, casa, galpão, trator e estrada entre os terrenos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/paisagens.svg',
        descricaoIlustracao:
          'Cena A: construções próximas, escola, padaria, calçada, ônibus e árvores. Cena B: feijão em fileiras, vacas na pastagem, casa, galpão, trator e árvores.',
      },
      {
        id: 'geo-paisagens-q03',
        bloco: 'Geografia · Aprender a observar os lugares',
        titulo: '3. Natureza e construção',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q03-a',
            pergunta: 'a) A ponte de madeira é um elemento',
            opcoes: ['construído pelas pessoas.', 'natural.'],
            respostas: ['construído pelas pessoas.'],
          },
          {
            id: 'geo-paisagens-q03-b',
            pergunta: 'b) O rio é um elemento',
            opcoes: ['construído pelas pessoas.', 'natural.'],
            respostas: ['natural.'],
          },
          {
            id: 'geo-paisagens-q03-c',
            pergunta: 'c) A montanha é um elemento',
            opcoes: ['natural.', 'construído pelas pessoas.'],
            respostas: ['natural.'],
          },
        ],
        dica: 'Pense na origem do elemento. Usar um material da natureza não significa que a construção apareceu sem trabalho humano.',
        sucesso:
          'Uma ponte pode usar madeira e continuar sendo uma construção. Rio e montanha são elementos naturais.',
        opcoesReversiveis: true,
        leitura:
          'Elementos naturais se formam por processos da natureza. Elementos construídos resultam do trabalho das pessoas, que podem usar materiais naturais em suas obras. Os dois grupos podem aparecer na mesma paisagem.\n\nCena desta questão: Um rio passa perto de uma montanha. Sobre o rio há uma ponte de madeira feita pelas pessoas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/rio-ponte.svg',
        descricaoIlustracao:
          'Montanha ao fundo; rio entre duas margens; uma ponte de madeira atravessa o rio e conecta as margens.',
      },
      {
        id: 'geo-paisagens-q04',
        bloco: 'Geografia · Aprender a observar os lugares',
        titulo: '4. Parecidos e diferentes',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q04-a',
            pergunta: 'a) Qual semelhança aparece nas duas cenas?',
            opcoes: [
              'A presença de escola em cada cena.',
              'A presença de padaria em cada cena.',
              'A presença de lugar para morar em cada cena.',
            ],
            respostas: ['A presença de lugar para morar em cada cena.'],
          },
          {
            id: 'geo-paisagens-q04-b',
            pergunta: 'b) Qual diferença está mostrada?',
            opcoes: [
              'A cena B tem plantação de feijão; a cena A tem escola e padaria.',
              'Apenas a cena B tem árvores na paisagem.',
              'Apenas a cena A tem moradia para pessoas.',
            ],
            respostas: ['A cena B tem plantação de feijão; a cena A tem escola e padaria.'],
          },
          {
            id: 'geo-paisagens-q04-c',
            pergunta:
              'c) Qual exemplo da cena B mostra que as pessoas transformaram o espaço para produzir alimentos?',
            opcoes: [
              'O céu que aparece sobre o terreno.',
              'A plantação de feijão organizada em fileiras.',
              'A sombra que muda com a posição do Sol.',
            ],
            respostas: ['A plantação de feijão organizada em fileiras.'],
          },
        ],
        dica: 'Veja o que aparece nas duas cenas e o que foi organizado para uma atividade. Plantas cultivadas também mostram trabalho humano.',
        sucesso:
          'As pessoas moram nos dois ambientes. A plantação combina plantas e transformação humana para produzir alimentos.',
        opcoesReversiveis: true,
        leitura:
          'As pessoas constroem moradias e organizam espaços para suas atividades. Uma plantação tem plantas, mas também mostra o trabalho humano de preparar a área e cultivar.\n\nObserve as duas cenas:\n\nCena A: Rua com casas próximas, escola, padaria e árvores.\nCena B: Casa junto de uma plantação de feijão em fileiras, galpão e árvores.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/paisagens.svg',
        descricaoIlustracao:
          'Cena A: casas próximas, escola, padaria e árvores. Cena B: casa, feijão em fileiras, galpão e árvores.',
      },
      {
        id: 'geo-paisagens-q05',
        bloco: 'Geografia · Aprender a observar os lugares',
        titulo: '5. Duas descobertas pelo ouvido',
        instrucao:
          'Ouça uma palavra por vez e escreva. Pode repetir e parar. Maiúsculas, acentos e ponto-final não são exigidos nesta atividade. Sem voz disponível, peça ao responsável para ditar.',
        tipo: 'campos',
        itens: [
          {
            id: 'geo-paisagens-q05-a',
            pergunta: 'a) Ouça a palavra 1 e escreva',
            respostas: ['paisagem'],
            pontuacaoFlexivel: true,
          },
          {
            id: 'geo-paisagens-q05-b',
            pergunta: 'b) Ouça a palavra 2 e escreva',
            respostas: ['moradia'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Ouça novamente a palavra desse campo. Compare o que você escutou com o que escreveu.',
        sucesso:
          'Você registrou duas palavras do estudo: paisagem e moradia. Podemos observar os lugares e reconhecer onde as pessoas vivem.',
        opcoesReversiveis: true,
        leitura:
          'Você já estudou nomes usados para falar dos lugares e de como as pessoas vivem. Agora, escute com atenção e registre duas palavras desse estudo. Não é preciso adivinhar: cada botão traz a palavra que você deve escrever.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'geo-paisagens-q06',
        bloco: 'Geografia · Trabalhos e caminhos dos produtos',
        titulo: '6. O que cada pessoa faz?',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q06-a',
            pergunta:
              'a) Joana prepara a terra, planta cenouras e cuida do cultivo. Seu trabalho é',
            opcoes: ['criação de animais.', 'agricultura.', 'extrativismo.'],
            respostas: ['agricultura.'],
          },
          {
            id: 'geo-paisagens-q06-b',
            pergunta:
              'b) Rui recolhe frutos de árvores que crescem naturalmente na mata, sem terem sido plantadas ali para cultivo. Essa atividade é',
            opcoes: ['criação de animais.', 'agricultura.', 'extrativismo.'],
            respostas: ['extrativismo.'],
          },
          {
            id: 'geo-paisagens-q06-c',
            pergunta:
              'c) Bia cuida das galinhas que a família cria para obter ovos. Essa atividade é',
            opcoes: ['criação de animais.', 'agricultura.', 'extrativismo.'],
            respostas: ['criação de animais.'],
          },
        ],
        dica: 'Observe a ação: cultivar plantas, coletar um recurso que cresce naturalmente ou cuidar de animais criados pelas pessoas.',
        sucesso:
          'Cultivar, coletar e criar animais são atividades diferentes. Todas pedem trabalho e cuidado com os recursos naturais.',
        opcoesReversiveis: true,
        leitura:
          'As pessoas realizam trabalhos diferentes. Algumas cultivam plantas ou criam animais; outras transportam, transformam ou vendem produtos. Há também trabalhos que atendem necessidades, como cuidar da saúde e ensinar. Um produto pode passar por várias mãos até chegar a quem o utiliza.\n\nAgricultura é cultivar plantas. A criação de animais também fornece produtos. Extrativismo é retirar ou coletar recursos da natureza, como frutos de plantas que crescem sem cultivo naquele local. O cuidado com a natureza é importante em todas essas atividades.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/trabalhos-campo.svg',
        descricaoIlustracao:
          'Joana cultiva cenouras; Rui recolhe frutos de árvores que crescem sem cultivo no local; Bia cuida de galinhas e ovos.',
      },
      {
        id: 'geo-paisagens-q07',
        bloco: 'Geografia · Trabalhos e caminhos dos produtos',
        titulo: '7. Vender e atender',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q07-a',
            pergunta: 'a) Uma professora ensina uma turma na escola. O trabalho descrito é',
            opcoes: ['comércio de produtos.', 'transformação em fábrica.', 'serviço de educação.'],
            respostas: ['serviço de educação.'],
          },
          {
            id: 'geo-paisagens-q07-b',
            pergunta:
              'b) Um vendedor atende uma pessoa que compra arroz no mercado. O trabalho descrito é',
            opcoes: ['comércio de produtos.', 'serviço de educação.', 'cultivo de alimentos.'],
            respostas: ['comércio de produtos.'],
          },
        ],
        dica: 'Qual é a ação principal nessa situação: ensinar, transformar um material ou vender um produto?',
        sucesso:
          'A escola oferece um serviço de educação. O mercado realiza comércio quando vende um produto.',
        opcoesReversiveis: true,
        leitura:
          'No comércio, as pessoas compram e vendem produtos. Em muitos serviços, um trabalho atende uma necessidade, como educação, saúde ou conserto. Esses trabalhos também podem existir em localidades rurais.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/servicos-comercio.svg',
        descricaoIlustracao:
          'Professora junto de quadro e estudantes numa escola; vendedor e cliente num mercado com arroz.',
      },
      {
        id: 'geo-paisagens-q08',
        bloco: 'Geografia · Trabalhos e caminhos dos produtos',
        titulo: '8. Uma ajuda nos dois sentidos',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q08-a',
            pergunta: 'a) Qual situação mostra essa relação nos dois sentidos?',
            opcoes: [
              'A horta usa apenas ferramentas feitas por sua própria família e consome toda a produção.',
              'A feira vende cenouras da horta rural, e a família da horta compra ferramentas numa loja da cidade.',
              'A família da horta leva cenouras e alfaces para vender numa feira da cidade.',
            ],
            respostas: [
              'A feira vende cenouras da horta rural, e a família da horta compra ferramentas numa loja da cidade.',
            ],
          },
          {
            id: 'geo-paisagens-q08-b',
            pergunta:
              'b) Léo disse: “No campo não pode existir escola nem loja”. Quais duas informações corrigem essa ideia? Marque duas.',
            opcoes: [
              'Escolas só fazem sentido onde existem prédios altos.',
              'Toda loja precisa estar em uma grande avenida.',
              'Comunidades rurais também podem ter escolas.',
              'Pode haver comércio em localidades rurais.',
            ],
            respostas: [
              'Comunidades rurais também podem ter escolas.',
              'Pode haver comércio em localidades rurais.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Na primeira parte, procure uma troca em cada sentido. Na segunda, pense se as pessoas do campo também precisam aprender e comprar.',
        sucesso:
          'Alimentos, equipamentos e serviços ligam campo e cidade. Uma comunidade rural também pode ter escola e comércio.',
        opcoesReversiveis: true,
        leitura:
          'Campo e cidade se relacionam. Alimentos podem seguir de uma área de cultivo para um mercado. Ferramentas, equipamentos e serviços também ajudam pessoas que vivem e trabalham no campo. A relação não acontece em um único sentido.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/campo-cidade.svg',
        descricaoIlustracao:
          'Área de cultivo à esquerda e feira e loja à direita. Cenouras seguem à feira e ferramentas seguem para a horta, em sentidos opostos.',
      },
      {
        id: 'geo-paisagens-q09',
        bloco: 'Geografia · Trabalhos e caminhos dos produtos',
        titulo: '9. Antes de virar outro produto',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q09-a',
            pergunta: 'a) Com o algodão, pode-se produzir',
            opcoes: [
              'uma tigela de vidro.',
              'uma camiseta de tecido de algodão.',
              'uma panela de metal.',
            ],
            respostas: ['uma camiseta de tecido de algodão.'],
          },
          {
            id: 'geo-paisagens-q09-b',
            pergunta: 'b) Com o leite, pode-se produzir',
            opcoes: ['queijo.', 'óleo de soja.', 'farinha de milho.'],
            respostas: ['queijo.'],
          },
          {
            id: 'geo-paisagens-q09-c',
            pergunta: 'c) Com a madeira, pode-se produzir',
            opcoes: ['uma jarra de vidro.', 'uma colher de metal.', 'uma estante de madeira.'],
            respostas: ['uma estante de madeira.'],
          },
        ],
        dica: 'Procure o produto que pode ser feito com aquele material. O lugar da compra não muda sua matéria-prima.',
        sucesso:
          'Matéria-prima é um material usado para fazer um produto. Transformar e vender são etapas diferentes.',
        opcoesReversiveis: true,
        leitura:
          'Matéria-prima é um material usado para fazer um produto. Por exemplo, a argila pode ser usada para fazer um vaso. Nas indústrias, matérias-primas são transformadas em outros produtos. Transformar um material e vender o produto são trabalhos diferentes.\n\nAssocie cada material a um produto que pode ser feito com ele. Escolha uma opção em cada parte.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/materiais.svg',
        descricaoIlustracao:
          'Algodão e camiseta de algodão; leite e queijo; madeira e estante de madeira, em três pares.',
      },
      {
        id: 'geo-paisagens-q10',
        bloco: 'Geografia · Trabalhos e caminhos dos produtos',
        titulo: '10. A viagem da alface',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q10-a',
            pergunta:
              'a) Organize os quatro cartões para mostrar o caminho desta alface. Comece na horta e termine na refeição.',
            tipo: 'ordenacao',
            cartoes: [
              'Venda da alface na feira.',
              'Consumo da alface na refeição.',
              'Cultivo e colheita da alface na horta.',
              'Transporte da alface da horta para a feira.',
            ],
            respostas: [
              'Cultivo e colheita da alface na horta.',
              'Transporte da alface da horta para a feira.',
              'Venda da alface na feira.',
              'Consumo da alface na refeição.',
            ],
            rotuloOrdem: 'Caminho da alface',
          },
          {
            id: 'geo-paisagens-q10-b',
            pergunta: 'b) Nesse caminho, qual é a função do transporte?',
            opcoes: [
              'Vender a alface a quem vai comprá-la.',
              'Cultivar a alface até a colheita.',
              'Levar a alface da horta para a feira.',
            ],
            respostas: ['Levar a alface da horta para a feira.'],
          },
          {
            id: 'geo-paisagens-q10-c',
            pergunta: 'c) Em qual momento acontece o consumo da alface?',
            opcoes: [
              'Quando a alface é usada na refeição.',
              'Quando a alface chega à feira para ser vendida.',
              'Quando a alface é colhida na horta.',
            ],
            respostas: ['Quando a alface é usada na refeição.'],
          },
        ],
        dica: 'Pense no que precisa acontecer antes de o alimento chegar à refeição. Levar, vender e utilizar não são a mesma etapa.',
        sucesso:
          'A alface foi produzida, transportada, vendida e consumida. Por ser um alimento fresco, esse caminho não precisou incluir uma fábrica.',
        opcoesReversiveis: true,
        leitura:
          'Produção é obter ou fazer um produto. Circulação é levá-lo de um lugar a outro. A venda ocorre quando o produto é comercializado. Consumo é sua utilização. Uma laranja fresca, por exemplo, pode ser colhida, transportada, vendida e comida, sem passar por uma fábrica.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/alface.svg',
        descricaoIlustracao:
          'Quatro cartões sem números nem setas: venda na feira, consumo na refeição, cultivo e colheita na horta, transporte da horta à feira.',
      },
      {
        id: 'geo-paisagens-q11',
        bloco: 'Geografia · Qualidade de vida e cuidado coletivo',
        titulo: '11. O que ajuda a viver bem?',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q11-a',
            pergunta:
              'a) A comunidade conserva uma praça limpa e com árvores para descanso e brincadeiras.',
            opcoes: ['Favorece.', 'Prejudica.'],
            respostas: ['Favorece.'],
          },
          {
            id: 'geo-paisagens-q11-b',
            pergunta:
              'b) Uma pessoa joga restos de comida e embalagens na calçada, onde os moradores caminham.',
            opcoes: ['Favorece.', 'Prejudica.'],
            respostas: ['Prejudica.'],
          },
          {
            id: 'geo-paisagens-q11-c',
            pergunta:
              'c) Vizinhos conversam com respeito para combinar os horários de uso de um espaço compartilhado.',
            opcoes: ['Favorece.', 'Prejudica.'],
            respostas: ['Favorece.'],
          },
        ],
        dica: 'Pense no efeito da atitude sobre quem usa o lugar. Ela ajuda no cuidado e na convivência ou cria um problema?',
        sucesso:
          'Qualidade de vida envolve tanto condições do espaço quanto atitudes de cuidado e respeito.',
        opcoesReversiveis: true,
        leitura:
          'Viver bem depende de várias condições: água adequada para o uso, cuidado com os resíduos, espaços seguros, serviços e respeito entre as pessoas. Esses cuidados são importantes no campo e na cidade. Ao perceber um problema, podemos pensar em ações que ajudem a comunidade.\n\nUma atitude pode melhorar a convivência ou criar dificuldades para outras pessoas. Observe o que acontece e pense nas consequências, não apenas na aparência do lugar.\n\nEm cada situação, escolha “favorece” ou “prejudica” a qualidade de vida.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/convivencia.svg',
        descricaoIlustracao:
          'Praça com árvores, banco e lixeira; resíduos na calçada; vizinhos conversam frente a frente.',
      },
      {
        id: 'geo-paisagens-q12',
        bloco: 'Geografia · Qualidade de vida e cuidado coletivo',
        titulo: '12. Olhar para o que existe e o que falta',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q12-a',
            pergunta:
              'a) Quais dois recursos descritos ajudam no descanso ou no cuidado com a saúde? Marque dois.',
            opcoes: [
              'A praça com bancos e árvores.',
              'A ausência de sinalização para atravessar.',
              'O posto de saúde funcionando.',
              'O movimento de veículos na saída da escola.',
            ],
            respostas: ['A praça com bancos e árvores.', 'O posto de saúde funcionando.'],
            tipo: 'selecao',
          },
          {
            id: 'geo-paisagens-q12-b',
            pergunta:
              'b) Quais duas informações mostram a necessidade de melhorar a travessia? Marque duas.',
            opcoes: [
              'A praça tem bancos e árvores.',
              'Muitas pessoas atravessam uma rua com veículos na saída da escola.',
              'O posto de saúde atende os moradores.',
              'Não há local sinalizado para atravessar nesse trecho.',
            ],
            respostas: [
              'Muitas pessoas atravessam uma rua com veículos na saída da escola.',
              'Não há local sinalizado para atravessar nesse trecho.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Separe os recursos que já ajudam as pessoas das informações que mostram uma dificuldade para atravessar.',
        sucesso:
          'O bairro tem recursos importantes e uma necessidade de segurança. Um lugar pode apresentar aspectos favoráveis e problemas ao mesmo tempo.',
        opcoesReversiveis: true,
        leitura:
          'Observar um bairro ajuda a reconhecer seus recursos e suas necessidades. Uma praça pode ajudar no lazer. Um serviço de saúde pode atender os moradores. Outras necessidades aparecem quando observamos um problema concreto.\n\nBairro fictício Jardim Claro: Há uma praça com bancos e árvores e um posto de saúde funcionando. Junto à praça há uma escola. Na saída, muitas pessoas precisam atravessar uma rua com veículos. Nesse trecho não há faixa nem local sinalizado para a travessia.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/bairro.svg',
        descricaoIlustracao:
          'Praça com árvores e bancos; posto de saúde; escola; rua com veículo e travessia sem faixa ou sinalização. O texto informa que o posto funciona.',
      },
      {
        id: 'geo-paisagens-q13',
        bloco: 'Geografia · Qualidade de vida e cuidado coletivo',
        titulo: '13. Problema, cuidado e benefício',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q13-a',
            pergunta:
              'a) Há resíduos acumulados numa esquina porque falta coleta regular. Qual proposta enfrenta esse problema?',
            opcoes: [
              'Organizar um campeonato no campo de futebol, ampliando o lazer.',
              'Pedir coleta regular ao serviço responsável e orientar o descarte, evitando acúmulo de resíduos.',
              'Instalar bancos na praça, criando lugares para sentar.',
            ],
            respostas: [
              'Pedir coleta regular ao serviço responsável e orientar o descarte, evitando acúmulo de resíduos.',
            ],
          },
          {
            id: 'geo-paisagens-q13-b',
            pergunta:
              'b) Música muito alta durante a noite impede vizinhos de descansar. Qual proposta enfrenta esse problema?',
            opcoes: [
              'Combinar horários e volume com respeito, favorecendo o descanso.',
              'Aumentar a frequência da coleta de resíduos, deixando a rua mais limpa.',
              'Melhorar a sinalização da rua, ajudando na travessia.',
            ],
            respostas: ['Combinar horários e volume com respeito, favorecendo o descanso.'],
          },
          {
            id: 'geo-paisagens-q13-c',
            pergunta:
              'c) Uma calçada bloqueada obriga pedestres a caminhar entre os carros. Qual proposta enfrenta esse problema?',
            opcoes: [
              'Melhorar a iluminação da praça, facilitando seu uso à noite.',
              'Ampliar o horário do mercado, oferecendo mais tempo para compras.',
              'Pedir aos responsáveis a liberação da passagem, permitindo usar a calçada.',
            ],
            respostas: [
              'Pedir aos responsáveis a liberação da passagem, permitindo usar a calçada.',
            ],
          },
        ],
        dica: 'Uma ação pode ser útil e mesmo assim não resolver esse problema. Relacione a proposta ao que está dificultando a vida dos moradores.',
        sucesso:
          'Boas propostas combinam com o problema observado. Algumas dependem da colaboração entre moradores e serviços responsáveis.',
        opcoesReversiveis: true,
        leitura:
          'Uma boa proposta precisa ajudar a resolver o problema observado. Algumas ações dependem dos moradores; outras também precisam do serviço público. Crianças devem pedir ajuda a adultos para problemas que envolvam risco.\n\nEscolha a proposta que combina com cada problema e seu benefício.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/problemas.svg',
        descricaoIlustracao:
          'Resíduos acumulados em uma esquina; música alta de noite perto das moradias; caixas bloqueiam a calçada.',
      },
      {
        id: 'geo-paisagens-q14',
        bloco: 'Geografia · Qualidade de vida e cuidado coletivo',
        titulo: '14. O solo está nos dois lugares',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q14-a',
            pergunta: 'a) Quais três situações mostram um uso do solo? Marque três.',
            opcoes: [
              'Cultivar feijão numa área rural.',
              'Fazer uma horta num terreno da cidade.',
              'Ler um livro emprestado pela biblioteca.',
              'Usar um terreno como base para construir uma casa.',
            ],
            respostas: [
              'Cultivar feijão numa área rural.',
              'Fazer uma horta num terreno da cidade.',
              'Usar um terreno como base para construir uma casa.',
            ],
            tipo: 'selecao',
          },
          {
            id: 'geo-paisagens-q14-b',
            pergunta:
              'b) Num terreno inclinado, a chuva está levando a terra que ficou sem cobertura. Quais duas ações ajudam a proteger esse solo? Marque duas.',
            opcoes: [
              'Manter o terreno sem plantas para a água passar mais depressa.',
              'Preservar a vegetação que ainda cobre o terreno.',
              'Pedir orientação para recuperar a cobertura vegetal da área.',
              'Colocar resíduos de construção no caminho da água.',
            ],
            respostas: [
              'Preservar a vegetação que ainda cobre o terreno.',
              'Pedir orientação para recuperar a cobertura vegetal da área.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Procure usos diretamente ligados ao terreno. Depois, pense no que ajuda a manter a terra protegida da chuva.',
        sucesso:
          'O solo sustenta cultivos e construções. Hortas podem existir na cidade, e a cobertura vegetal ajuda a proteger o terreno.',
        opcoesReversiveis: true,
        leitura:
          'O solo ajuda a sustentar plantas e construções. Há cultivos em áreas rurais e também hortas em cidades. Cuidar do solo inclui evitar resíduos inadequados e preservar sua cobertura vegetal quando necessário.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/solo.svg',
        descricaoIlustracao:
          'Cultivo rural; horta entre prédios; casa apoiada num terreno; chuva leva terra de uma encosta sem cobertura.',
      },
      {
        id: 'geo-paisagens-q15',
        bloco: 'Geografia · Qualidade de vida e cuidado coletivo',
        titulo: '15. Água: usar e cuidar',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q15-a',
            pergunta:
              'a) Quais três situações mostram necessidades de água no campo ou na cidade? Marque três.',
            opcoes: [
              'Dar água aos animais.',
              'Guardar um livro na prateleira.',
              'Regar uma horta quando ela precisa.',
              'Beber e preparar alimentos com água própria para consumo.',
            ],
            respostas: [
              'Dar água aos animais.',
              'Regar uma horta quando ela precisa.',
              'Beber e preparar alimentos com água própria para consumo.',
            ],
            tipo: 'selecao',
          },
          {
            id: 'geo-paisagens-q15-b',
            pergunta: 'b) Quais três atitudes mostram cuidado com a água? Marque três.',
            opcoes: [
              'Avisar um adulto quando uma torneira apresenta vazamento.',
              'Fechar a torneira enquanto ensaboa as mãos.',
              'Beber água de um córrego apenas porque parece transparente.',
              'Evitar jogar resíduos nos rios e córregos.',
            ],
            respostas: [
              'Avisar um adulto quando uma torneira apresenta vazamento.',
              'Fechar a torneira enquanto ensaboa as mãos.',
              'Evitar jogar resíduos nos rios e córregos.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Separe o que precisa de água do que não precisa nessa ação. Para beber, a aparência sozinha não garante segurança.',
        sucesso:
          'Água é necessária nos dois ambientes. Evitar desperdício e poluição protege esse recurso; água para beber precisa ter origem segura.',
        opcoesReversiveis: true,
        leitura:
          'Pessoas, animais e plantas precisam de água. Ela é usada na alimentação, higiene e produção. Economizar e evitar poluição são cuidados importantes. Água transparente não é, por isso apenas, garantidamente boa para beber: sua origem e seu tratamento precisam ser seguros.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/agua.svg',
        descricaoIlustracao:
          'Água para animais, horta e preparo de alimentos; uma torneira com vazamento; córrego com água transparente. A aparência não informa se pode ser bebida.',
      },
      {
        id: 'geo-paisagens-q16',
        bloco: 'Geografia · O lugar muda, algumas coisas permanecem',
        titulo: '16. A Rua do Ipê em dois tempos',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q16-a',
            pergunta: 'a) O que aconteceu com a rua?',
            opcoes: [
              'Uma rua asfaltada passou a ser de terra.',
              'Uma rua de terra passou a ser asfaltada.',
              'A rua deixou de existir entre os dois registros.',
            ],
            respostas: ['Uma rua de terra passou a ser asfaltada.'],
          },
          {
            id: 'geo-paisagens-q16-b',
            pergunta: 'b) O que aconteceu no terreno junto à esquina?',
            opcoes: [
              'A biblioteca foi retirada, deixando o terreno vazio.',
              'O terreno vazio passou a ser uma área de plantação.',
              'Uma biblioteca foi construída no terreno antes vazio.',
            ],
            respostas: ['Uma biblioteca foi construída no terreno antes vazio.'],
          },
          {
            id: 'geo-paisagens-q16-c',
            pergunta: 'c) O que aconteceu com o muro da casa?',
            opcoes: ['O muro ficou mais alto.', 'O muro ficou mais baixo.', 'O muro foi retirado.'],
            respostas: ['O muro ficou mais alto.'],
          },
        ],
        dica: 'Leia primeiro o registro mais antigo e depois o atual. Confira o que aconteceu com o mesmo elemento, na mesma posição.',
        sucesso:
          'Você comparou mudanças no pavimento, no uso de um terreno e em uma construção. O lugar mudou sem perder todos os seus elementos.',
        opcoesReversiveis: true,
        leitura:
          'Fotografias, desenhos e relatos ajudam a conhecer um lugar em outros tempos. Ao comparar registros, podemos encontrar o que mudou e o que permaneceu. Uma mudança pode trazer benefícios, problemas ou os dois. Precisamos observar as pistas antes de concluir.\n\nPara comparar, procure os mesmos elementos nos dois registros. Uma construção nova, uma alteração na rua ou um serviço diferente podem mostrar transformações. O ponto de observação precisa permitir a comparação.\n\nDuas representações fictícias mostram o mesmo trecho da Rua do Ipê, visto do mesmo ponto.\n\nEm 2006: A rua é de terra. Um terreno junto à esquina está vazio. Na frente de uma casa há um muro baixo. Um ipê fica ao lado da ponte sobre um córrego.\nEm 2026: A rua está asfaltada. No terreno junto à esquina foi construída uma biblioteca. O muro da casa ficou mais alto. O ipê continua ao lado da ponte sobre o córrego.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/ipe.svg',
        descricaoIlustracao:
          'Rua do Ipê em 2006 e 2026, do mesmo ponto: terra passa a asfalto, terreno vazio recebe biblioteca, muro da casa fica mais alto. Ipê, ponte e córrego permanecem nas mesmas posições.',
      },
      {
        id: 'geo-paisagens-q17',
        bloco: 'Geografia · O lugar muda, algumas coisas permanecem',
        titulo: '17. As pistas do mesmo lugar',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q17-a',
            pergunta: 'a) Qual elemento permaneceu nos dois registros?',
            opcoes: [
              'O terreno vazio junto à esquina.',
              'O ipê ao lado da ponte.',
              'O muro baixo da casa.',
            ],
            respostas: ['O ipê ao lado da ponte.'],
          },
          {
            id: 'geo-paisagens-q17-b',
            pergunta: 'b) Que conjunto de pistas ajuda a reconhecer o mesmo lugar?',
            opcoes: [
              'A ponte, o córrego e o ipê aparecem nas mesmas posições relativas.',
              'Os dois registros mostram datas diferentes.',
              'Os dois registros mostram lugares onde vivem pessoas.',
            ],
            respostas: ['A ponte, o córrego e o ipê aparecem nas mesmas posições relativas.'],
          },
        ],
        dica: 'Procure algo que aparece nos dois tempos. Depois, pense em pistas da paisagem que permitam reconhecer o lugar.',
        sucesso:
          'Datas organizam os registros no tempo. A identificação do lugar também depende de referências e de como estão posicionadas.',
        opcoesReversiveis: true,
        leitura:
          'Uma permanência é algo que continua na comparação. Pontos de referência podem ajudar a reconhecer um lugar. As datas indicam quando os registros foram feitos, mas, sozinhas, não mostram que se trata da mesma rua.\n\nInformações dos dois registros da Rua do Ipê: Em 2006, havia rua de terra, terreno vazio e muro baixo. Em 2026, há asfalto, biblioteca no antigo terreno vazio e muro mais alto. Nos dois registros, o ipê fica ao lado da ponte sobre o mesmo córrego.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/ipe.svg',
        descricaoIlustracao:
          '2006: rua de terra, terreno vazio, muro baixo. 2026: asfalto, biblioteca no terreno, muro alto. Nos dois, ipê, ponte e córrego nas mesmas posições relativas.',
      },
      {
        id: 'geo-paisagens-q18',
        bloco: 'Geografia · O lugar muda, algumas coisas permanecem',
        titulo: '18. A família mudou de moradia',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q18-a',
            pergunta: 'a) Qual mudança ocorreu?',
            opcoes: [
              'A casa antiga virou o apartamento em outra rua.',
              'A família ficou na casa antiga e mudou apenas os móveis.',
              'A família saiu de uma casa e passou a morar num apartamento.',
            ],
            respostas: ['A família saiu de uma casa e passou a morar num apartamento.'],
          },
          {
            id: 'geo-paisagens-q18-b',
            pergunta: 'b) Em qual moradia descrita a família está mais próxima de outras moradias?',
            opcoes: [
              'No apartamento, com outras unidades ao lado, acima e abaixo.',
              'Na casa, com o terreno vazio entre ela e a casa vizinha.',
              'Nas duas, com a mesma distância até as outras moradias.',
            ],
            respostas: ['No apartamento, com outras unidades ao lado, acima e abaixo.'],
          },
          {
            id: 'geo-paisagens-q18-c',
            pergunta: 'c) O que continua igual nas duas situações?',
            opcoes: [
              'O quintal pertence às duas moradias.',
              'A moradia serve de abrigo para a família.',
              'A família mora na mesma rua.',
            ],
            respostas: ['A moradia serve de abrigo para a família.'],
          },
        ],
        dica: 'Confira quem mudou: a família ou a construção? Observe as distâncias descritas e a função comum às duas moradias.',
        sucesso:
          'A família mudou de residência. O tipo e a proximidade das moradias mudaram; a função de abrigar continuou.',
        opcoesReversiveis: true,
        leitura:
          'Uma família pode mudar para outra moradia. Isso não significa que a construção antiga se transformou na nova. Moradias diferentes cumprem a função de abrigar as pessoas, e nenhum tipo torna uma família mais importante que outra.\n\nFamília fictícia de Nina: Antes, a família morava numa casa com quintal. A casa vizinha ficava do outro lado de um terreno vazio. Depois, a família se mudou para um apartamento em outra rua. No novo prédio, há outro apartamento ao lado e outros acima e abaixo. A casa antiga continua no lugar anterior.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/moradias.svg',
        descricaoIlustracao:
          'Antes, uma rua: casa com quintal e terreno vazio até a casa vizinha. Depois, outra rua: apartamento com unidades ao lado, acima e abaixo. A casa antiga continua na rua anterior.',
      },
      {
        id: 'geo-paisagens-q19',
        bloco: 'Geografia · O lugar muda, algumas coisas permanecem',
        titulo: '19. Novos vizinhos',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q19-a',
            pergunta: 'a) Qual motivo da mudança aparece no relato?',
            opcoes: [
              'A família mudou porque a escola antiga fechou.',
              'A mãe conseguiu um novo trabalho.',
              'A família mudou porque o bairro antigo ficou sem mercado.',
            ],
            respostas: ['A mãe conseguiu um novo trabalho.'],
          },
          {
            id: 'geo-paisagens-q19-b',
            pergunta: 'b) Quais duas atitudes ajudam Caio a se sentir acolhido? Marque duas.',
            opcoes: [
              'Convidá-lo para uma brincadeira com a turma.',
              'Pedir que evite participar até conhecer todos os colegas.',
              'Mostrar os espaços da escola e explicar os combinados.',
              'Escolher as brincadeiras sem ouvir suas ideias.',
            ],
            respostas: [
              'Convidá-lo para uma brincadeira com a turma.',
              'Mostrar os espaços da escola e explicar os combinados.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Use o motivo que Caio contou. Para acolher, escolha atitudes que permitam participar e conhecer a escola.',
        sucesso:
          'Pessoas mudam por motivos diferentes. Conhecer a história e receber com respeito ajuda a construir a convivência.',
        opcoesReversiveis: true,
        leitura:
          'Pessoas podem mudar de bairro, cidade ou região por diferentes motivos. Conhecer o relato ajuda a entender cada situação. Receber novos moradores com respeito favorece a convivência.\n\nRelato fictício: “Meu nome é Caio. Minha família vivia em outra cidade. Minha mãe conseguiu um novo trabalho e nós nos mudamos para o Bairro do Lago. Eu vou estudar na escola do bairro e ainda não conheço seus espaços.”',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
      },
      {
        id: 'geo-paisagens-q20',
        bloco: 'Geografia · O lugar muda, algumas coisas permanecem',
        titulo: '20. Uma mudança resolve tudo?',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q20-a',
            pergunta: 'a) Qual necessidade motivou a pavimentação, segundo a história?',
            opcoes: [
              'Facilitar o transporte das hortaliças quando havia lama.',
              'Aumentar a quantidade de hortaliças plantadas em cada terreno.',
              'Mudar a feira para outro município.',
            ],
            respostas: ['Facilitar o transporte das hortaliças quando havia lama.'],
          },
          {
            id: 'geo-paisagens-q20-b',
            pergunta: 'b) Qual conclusão combina com o que aconteceu depois?',
            opcoes: [
              'A obra deixou o transporte mais difícil e mais lento.',
              'A obra resolveu todos os problemas de circulação.',
              'A obra facilitou o transporte, mas ainda são necessários cuidados com a velocidade.',
            ],
            respostas: [
              'A obra facilitou o transporte, mas ainda são necessários cuidados com a velocidade.',
            ],
          },
        ],
        dica: 'Separe o motivo da obra dos resultados observados. Uma melhoria não elimina automaticamente todas as necessidades do lugar.',
        sucesso:
          'A mudança atendeu uma necessidade, mas trouxe um cuidado adicional. Avaliar uma transformação exige observar seus efeitos.',
        opcoesReversiveis: true,
        leitura:
          'É importante distinguir o motivo de uma mudança de seus resultados. Uma obra pode atender uma necessidade e ainda exigir outros cuidados. Nem toda consequência pode ser descoberta apenas olhando uma imagem.\n\nHistória fictícia da Vila das Pedras: Em época de chuva, a lama dificultava o transporte das hortaliças até a feira. A estrada foi pavimentada para facilitar esse caminho. Depois, os veículos passaram com menos dificuldade, mas alguns motoristas começaram a dirigir mais depressa. Os moradores pediram sinalização e medidas para reduzir a velocidade perto das casas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
      },
      {
        id: 'geo-paisagens-q21',
        bloco: 'Geografia · Ver e representar o espaço',
        titulo: '21. De onde estamos olhando?',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q21-a',
            pergunta: 'a) A representação 1 usa visão',
            opcoes: ['vertical.', 'oblíqua.', 'frontal.'],
            respostas: ['frontal.'],
          },
          {
            id: 'geo-paisagens-q21-b',
            pergunta: 'b) A representação 2 usa visão',
            opcoes: ['vertical.', 'frontal.', 'oblíqua.'],
            respostas: ['vertical.'],
          },
          {
            id: 'geo-paisagens-q21-c',
            pergunta: 'c) A representação 3 usa visão',
            opcoes: ['frontal.', 'oblíqua.', 'vertical.'],
            respostas: ['oblíqua.'],
          },
        ],
        dica: 'Imagine a posição de quem observa. Olhar de frente, diretamente de cima e do alto de lado produz vistas diferentes.',
        sucesso:
          'O mesmo lugar pode ser representado por pontos de observação diferentes. A vista muda as partes que aparecem.',
        opcoesReversiveis: true,
        leitura:
          'Podemos representar um lugar de frente, de cima e de lado, ou diretamente de cima. Numa paisagem, alguns elementos parecem próximos e outros mais distantes. Um croqui é um desenho simplificado que destaca elementos importantes e pode usar pontos de referência.\n\nNa visão frontal, olhamos de frente. Na visão oblíqua, olhamos do alto e de lado. Na visão vertical, olhamos diretamente de cima. A posição de quem observa muda as partes que aparecem.\n\nTrês representações mostram a mesma escola, seu telhado e um pátio com uma árvore:\n\n1: A fachada da escola, com porta e janelas, observada da rua. O telhado não é visto por cima.\n2: O formato do telhado e o pátio são vistos diretamente de cima. As fachadas não aparecem.\n3: O telhado, a fachada e uma parede lateral aparecem juntos, vistos do alto e de lado.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/vistas.svg',
        descricaoIlustracao:
          'A mesma escola com pátio e árvore. 1: fachada, porta e janelas, sem telhado visto por cima. 2: telhado e pátio vistos diretamente de cima, sem fachadas. 3: telhado, frente e parede lateral juntos, vistos do alto e de lado.',
      },
      {
        id: 'geo-paisagens-q22',
        bloco: 'Geografia · Ver e representar o espaço',
        titulo: '22. Perto, no meio e ao fundo',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q22-a',
            pergunta: 'a) A cerca está no',
            opcoes: ['primeiro plano.', 'plano intermediário.', 'fundo.'],
            respostas: ['primeiro plano.'],
          },
          {
            id: 'geo-paisagens-q22-b',
            pergunta: 'b) As montanhas estão no',
            opcoes: ['plano intermediário.', 'primeiro plano.', 'fundo.'],
            respostas: ['fundo.'],
          },
          {
            id: 'geo-paisagens-q22-c',
            pergunta: 'c) O lago está no',
            opcoes: ['fundo.', 'plano intermediário.', 'primeiro plano.'],
            respostas: ['plano intermediário.'],
          },
        ],
        dica: 'Compare as distâncias em relação a quem está na trilha. Não use apenas o tamanho de uma palavra ou a altura dela na página.',
        sucesso:
          'Os planos organizam a leitura da profundidade: perto, numa distância intermediária e ao fundo.',
        opcoesReversiveis: true,
        leitura:
          'Podemos organizar a leitura de uma paisagem em planos. O primeiro plano mostra o que está mais próximo de quem observa. O plano intermediário fica entre o primeiro e o fundo. O fundo mostra elementos mais distantes.\n\nPaisagem vista de uma trilha: Uma cerca está bem perto de quem observa. Depois dela, mais adiante, há um lago. Bem além do lago, montanhas aparecem ao fundo. As três faixas estão identificadas na representação como planos 1, 2 e 3, nessa ordem de proximidade.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/planos.svg',
        descricaoIlustracao:
          'Plano 1: cerca bem perto de quem observa. Plano 2: lago mais adiante. Plano 3: montanhas bem além do lago, ao fundo. Três faixas delimitadas.',
      },
      {
        id: 'geo-paisagens-q23',
        bloco: 'Geografia · Ver e representar o espaço',
        titulo: '23. A linha do horizonte',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q23-a',
            pergunta: 'a) Qual linha representa o horizonte?',
            opcoes: ['Linha 3.', 'Linha 2.', 'Linha 1.'],
            respostas: ['Linha 2.'],
          },
        ],
        dica: 'Procure o encontro aparente do céu com a superfície distante, e não o limite de uma construção.',
        sucesso:
          'O horizonte é um encontro aparente. Não é uma linha material desenhada na praia ou no mar.',
        opcoesReversiveis: true,
        leitura:
          'Horizonte é o encontro aparente entre o céu e a superfície da terra ou da água. Não é uma faixa de trânsito nem uma linha construída pelas pessoas.\n\nObserve a representação de uma praia:\n\n- A linha 1 contorna a faixa de areia perto de quem observa.\n- A linha 2 marca, ao longe, o encontro aparente entre o céu e o mar.\n- A linha 3 acompanha a beira de um calçadão ao lado da praia.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/horizonte.svg',
        descricaoIlustracao:
          'Praia: linha 1 na faixa de areia próxima; linha 2 no encontro aparente entre céu e mar, ao longe; linha 3 na beira do calçadão lateral.',
      },
      {
        id: 'geo-paisagens-q24',
        bloco: 'Geografia · Ver e representar o espaço',
        titulo: '24. Decifrando a legenda',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q24-a',
            pergunta: 'a) O símbolo de uma cesta representa',
            opcoes: ['a escola.', 'a praça.', 'o mercado.'],
            respostas: ['o mercado.'],
          },
          {
            id: 'geo-paisagens-q24-b',
            pergunta: 'b) Entre a escola e o mercado, qual ponto de referência foi representado?',
            opcoes: [
              'A praça, indicada pela folha.',
              'A escola, indicada pelo livro.',
              'O mercado, indicado pela cesta.',
            ],
            respostas: ['A praça, indicada pela folha.'],
          },
        ],
        dica: 'Use a legenda para saber o significado do símbolo. Depois, confira a posição de cada lugar.',
        sucesso:
          'A legenda explica os símbolos, e os pontos de referência ajudam a localizar os lugares em um croqui.',
        opcoesReversiveis: true,
        leitura:
          'Um croqui simplifica a paisagem. Sua legenda explica símbolos usados para representar os lugares. Um ponto de referência é um elemento reconhecível que ajuda a localizar outros.\n\nCroqui fictício do Bairro das Flores — posições na página:\n\nEsquerda: Escola, com o símbolo de um livro\nCentro: Praça, com o símbolo de uma folha\nDireita: Mercado, com o símbolo de uma cesta\nLegenda: livro = escola; folha = praça; cesta = mercado.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/legenda.svg',
        descricaoIlustracao:
          'Escola à esquerda com livro; praça ao centro com folha; mercado à direita com cesta. Legenda: livro representa escola, folha representa praça, cesta representa mercado.',
      },
      {
        id: 'geo-paisagens-q25',
        bloco: 'Geografia · Ver e representar o espaço',
        titulo: '25. Um croqui completo e outro incompleto',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q25-a',
            pergunta:
              'a) Ana está na escola e combinou encontrar Davi no espaço aberto entre a escola e o mercado. Qual é o ponto de encontro?',
            opcoes: ['A farmácia.', 'A praça.', 'O ponto de ônibus.'],
            respostas: ['A praça.'],
          },
          {
            id: 'geo-paisagens-q25-b',
            pergunta: 'b) Qual é a posição da farmácia em relação à praça neste croqui?',
            opcoes: [
              'Imediatamente abaixo da praça.',
              'À direita da praça.',
              'Imediatamente acima da praça.',
            ],
            respostas: ['Imediatamente acima da praça.'],
          },
          {
            id: 'geo-paisagens-q25-c',
            pergunta: 'c) Qual elemento falta no segundo croqui?',
            opcoes: ['O ponto de ônibus.', 'O mercado.', 'A escola.'],
            respostas: ['O ponto de ônibus.'],
          },
        ],
        dica: 'Compare as posições na página. No segundo croqui, procure o lugar que foi deixado vazio em relação ao primeiro.',
        sucesso:
          'Um croqui pode simplificar uma paisagem e ainda permitir localizar referências e perceber um elemento que falta.',
        opcoesReversiveis: true,
        leitura:
          'Para verificar um croqui, compare seus elementos com a paisagem representada. Nesta questão, “acima” e “abaixo” indicam posições na página. Não representam a altura dos prédios.\n\nCroqui completo do Bairro das Flores:\n\nParte de cima — Esquerda: Espaço sem construção; Centro: Farmácia; Direita: Espaço sem construção\nFaixa central — Esquerda: Escola; Centro: Praça; Direita: Mercado\nParte de baixo — Esquerda: Espaço sem construção; Centro: Ponto de ônibus; Direita: Espaço sem construção\nA farmácia fica imediatamente acima da praça; o ponto de ônibus fica imediatamente abaixo dela. A praça está entre escola e mercado. Um segundo croqui mostra esses mesmos lugares e posições, mas deixa vazio o lugar onde deveria aparecer o ponto de ônibus.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/croquis.svg',
        descricaoIlustracao:
          'Croqui completo: farmácia acima da praça; escola à esquerda, praça no centro e mercado à direita; ponto de ônibus abaixo da praça. Segundo croqui: mesmas posições, retirado somente o ponto de ônibus.',
      },
      {
        id: 'geo-paisagens-q26',
        bloco: 'Geografia · Ampliar e juntar as descobertas',
        titulo: '26. Nosso planeta tem água e terras',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q26-a',
            pergunta: 'a) Qual parte do globo representa as grandes porções de água?',
            opcoes: [
              'A parte marcada como “Água”, onde aparecem os oceanos.',
              'As partes marcadas como “Água” e “Terras” representam o mesmo tipo de superfície.',
              'A parte marcada como “Terras”.',
            ],
            respostas: ['A parte marcada como “Água”, onde aparecem os oceanos.'],
          },
          {
            id: 'geo-paisagens-q26-b',
            pergunta: 'b) Que comparação está correta?',
            opcoes: [
              'As terras cobrem uma parte maior da superfície da Terra do que a água.',
              'A água cobre uma parte maior da superfície da Terra do que as terras.',
              'Água e terras cobrem partes iguais da superfície da Terra.',
            ],
            respostas: ['A água cobre uma parte maior da superfície da Terra do que as terras.'],
          },
        ],
        dica: 'Compare os rótulos e a extensão das áreas. A questão fala da superfície do planeta.',
        sucesso:
          'A Terra tem grandes porções de água e de terras. A água cobre a maior parte de sua superfície.',
        opcoesReversiveis: true,
        leitura:
          'Os lugares estudados fazem parte do planeta Terra. Vamos conhecer duas ideias sobre o planeta e depois juntar o que aprendemos sobre paisagens, trabalho e cuidado.\n\nA superfície da Terra tem grandes porções de água e de terras, onde estão os continentes. A água cobre a maior parte dessa superfície. Em uma representação, cores e rótulos ajudam a distinguir as áreas.\n\nRepresentação do planeta: Um globo mostra áreas de oceanos com o rótulo “Água” e áreas de continentes com o rótulo “Terras”. As áreas de oceanos ocupam a maior parte da superfície representada.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/terra.svg',
        descricaoIlustracao:
          'Globo esquemático: oceanos identificados como Água e continentes como Terras. A área de água é maior. Uma barra com rótulos Água e Terras mostra a predominância de água.',
      },
      {
        id: 'geo-paisagens-q27',
        bloco: 'Geografia · Ampliar e juntar as descobertas',
        titulo: '27. Dois movimentos diferentes',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'geo-paisagens-q27-a',
            pergunta: 'a) O esquema Y mostra qual movimento e duração aproximada?',
            opcoes: [
              'Rotação, em cerca de 24 horas.',
              'Translação, em cerca de 24 horas.',
              'Translação, em cerca de um ano.',
            ],
            respostas: ['Translação, em cerca de um ano.'],
          },
          {
            id: 'geo-paisagens-q27-b',
            pergunta: 'b) O esquema X mostra qual movimento e duração aproximada?',
            opcoes: [
              'Rotação, em cerca de um ano.',
              'Translação, em cerca de um ano.',
              'Rotação, em cerca de 24 horas.',
            ],
            respostas: ['Rotação, em cerca de 24 horas.'],
          },
          {
            id: 'geo-paisagens-q27-c',
            pergunta:
              'c) Uma criança observa que, depois da noite, o Sol volta a iluminar o lugar onde ela vive. Qual movimento estudado ajuda a explicar a alternância entre dia e noite?',
            opcoes: [
              'A rotação, o giro da Terra em torno de si.',
              'A translação, a volta da Terra ao redor do Sol.',
              'Os dois movimentos têm a mesma duração e explicam a mesma coisa.',
            ],
            respostas: ['A rotação, o giro da Terra em torno de si.'],
          },
        ],
        dica: 'Compare onde a seta está: em volta da própria Terra ou no caminho ao redor do Sol. Depois, releia a duração de cada movimento.',
        sucesso:
          'Rotação é o giro em torno de si, relacionado ao dia e à noite. Translação é a volta ao redor do Sol, em cerca de um ano.',
        opcoesReversiveis: true,
        leitura:
          'Rotação é o giro da Terra em torno de si mesma, que dura aproximadamente 24 horas. Nesse giro, diferentes lugares ficam voltados para o Sol ou para o lado sem sua luz, formando dia e noite. Translação é o movimento ao redor do Sol; uma volta leva cerca de um ano. Os desenhos desses movimentos são esquemas sem escala.\n\nObserve os esquemas descritos:\n\n- No esquema X, uma seta curva envolve a própria Terra, mostrando seu giro.\n- No esquema Y, a Terra aparece em um caminho ao redor do Sol. A seta mostra o percurso.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/movimentos.svg',
        descricaoIlustracao:
          'Esquema X: seta de giro junto à própria Terra. Esquema Y: uma Terra num caminho ao redor do Sol; seta no caminho. Esquemas sem escala.',
      },
      {
        id: 'geo-paisagens-q28',
        bloco: 'Geografia · Ampliar e juntar as descobertas',
        titulo: '28. O caminho dos alimentos na Vila da Ponte',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q28-a',
            pergunta: 'a) Quais dois elementos descritos foram construídos pelas pessoas?',
            opcoes: ['O rio e a ponte.', 'A ponte e a escola.', 'O rio e as plantas de abóbora.'],
            respostas: ['A ponte e a escola.'],
          },
          {
            id: 'geo-paisagens-q28-b',
            pergunta: 'b) O transporte das abóboras mostra',
            opcoes: [
              'uma ligação entre a área de cultivo e o lugar onde os produtos são vendidos.',
              'que a abóbora precisa ser produzida dentro do mercado.',
              'que a caminhonete transforma a abóbora em outro alimento durante a viagem.',
            ],
            respostas: [
              'uma ligação entre a área de cultivo e o lugar onde os produtos são vendidos.',
            ],
          },
          {
            id: 'geo-paisagens-q28-c',
            pergunta:
              'c) Quais duas ações respondem ao problema das embalagens na margem? Marque duas.',
            opcoes: [
              'Levar as embalagens até a água para afastá-las das casas.',
              'Recolher as embalagens e deixá-las amontoadas em outra margem.',
              'Descartar os resíduos nos recipientes combinados para a coleta.',
              'Organizar com adultos uma orientação para manter a margem sem resíduos.',
            ],
            respostas: [
              'Descartar os resíduos nos recipientes combinados para a coleta.',
              'Organizar com adultos uma orientação para manter a margem sem resíduos.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Cruze as informações: o que foi construído, para onde segue o produto e que ação enfrenta o problema da margem.',
        sucesso:
          'A vila reúne natureza, construções e trabalhos conectados. Cuidar do rio também faz parte da qualidade de vida.',
        opcoesReversiveis: true,
        leitura:
          'Uma mesma região pode ter áreas de cultivo, moradias próximas e serviços. Observar as relações entre esses espaços ajuda a compreender como as pessoas vivem e trabalham. A água de um rio também precisa de cuidado ao longo de seu caminho.\n\nVila fictícia da Ponte: No lado esquerdo do rio há um sítio com cultivo de abóboras. Uma ponte liga esse lado à rua onde ficam escola, posto de saúde e mercado, próximos uns dos outros. Uma caminhonete leva abóboras do sítio ao mercado. Algumas pessoas têm deixado embalagens na margem do rio. O serviço de coleta pode atender o local se os resíduos forem colocados nos recipientes combinados com os moradores.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/vila.svg',
        descricaoIlustracao:
          'Sítio com abóboras à esquerda do rio. Ponte atravessa o rio no centro. Mercado junto à chegada à direita; posto acima e escola abaixo. Caminhonete transporta abóboras; embalagens na margem.',
      },
      {
        id: 'geo-paisagens-q29',
        bloco: 'Geografia · Ampliar e juntar as descobertas',
        titulo: '29. Registros que se completam',
        instrucao: 'Responda cada parte. Você pode corrigir e conferir novamente.',
        tipo: 'misto',
        itens: [
          {
            id: 'geo-paisagens-q29-a',
            pergunta: 'a) Qual mudança aparece na comparação dos registros?',
            opcoes: [
              'O mercado deixou de existir.',
              'A ponte mudou para outro rio.',
              'O terreno vazio recebeu um posto de saúde.',
            ],
            respostas: ['O terreno vazio recebeu um posto de saúde.'],
          },
          {
            id: 'geo-paisagens-q29-b',
            pergunta: 'b) Que referência permaneceu e ajuda a relacionar os registros ao croqui?',
            opcoes: [
              'O terreno vazio atrás do mercado.',
              'O mercado junto à chegada da ponte.',
              'As caixas bloqueando a calçada da escola.',
            ],
            respostas: ['O mercado junto à chegada da ponte.'],
          },
          {
            id: 'geo-paisagens-q29-c',
            pergunta: 'c) Quais duas ações atendem ao problema atual dos pedestres? Marque duas.',
            opcoes: [
              'Pedir aos responsáveis a retirada das caixas que bloqueiam a passagem.',
              'Mudar os horários de atendimento do posto de saúde.',
              'Combinar com os responsáveis que a passagem da calçada deve ficar livre.',
              'Aumentar a quantidade de produtos vendidos no mercado.',
            ],
            respostas: [
              'Pedir aos responsáveis a retirada das caixas que bloqueiam a passagem.',
              'Combinar com os responsáveis que a passagem da calçada deve ficar livre.',
            ],
            tipo: 'selecao',
          },
        ],
        dica: 'Use cada fonte para a informação que ela oferece. Compare os dois tempos e escolha ações ligadas à passagem dos pedestres.',
        sucesso:
          'Você combinou registros no tempo, referência espacial e problema atual. As informações se completam para ajudar a compreender o lugar.',
        opcoesReversiveis: true,
        leitura:
          'Imagens de tempos diferentes e croquis oferecem informações que podem ser comparadas. Uma boa proposta depende do problema que queremos resolver. Todos os dados desta questão estão nos registros abaixo.\n\nDois registros fictícios do mesmo trecho da Vila da Ponte, feitos do mesmo ponto:\n\nEm 2016: A ponte atravessa o rio. Um mercado fica junto à chegada da ponte. Atrás do mercado há um terreno vazio.\nEm 2026: A ponte atravessa o rio no mesmo lugar. O mercado continua junto à chegada da ponte. No antigo terreno vazio há um posto de saúde.\nCroqui atual — posições na página:\n\nDe cima — Esquerda: Sítio; Centro: Rio; Direita: Posto de saúde\nCentral — Esquerda: Caminho do sítio; Centro: Ponte sobre o rio; Direita: Mercado\nDe baixo — Esquerda: Espaço aberto; Centro: Rio; Direita: Escola\nO rio passa pelo centro; a ponte o atravessa. O mercado fica junto à chegada da ponte, à direita na página. O posto de saúde fica acima do mercado. A escola fica abaixo do mercado. Na rua junto à escola, pedestres precisam caminhar entre os carros porque a calçada está bloqueada por caixas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ilustracaoLeitura: '../assets/geografia-paisagens-outubro/registros-vila.svg',
        descricaoIlustracao:
          '2016 e 2026: ponte e mercado nas mesmas posições. Terreno atrás do mercado vazio em 2016, posto de saúde em 2026. Croqui atual: sítio à esquerda do rio, ponte ao centro, mercado à direita, posto acima e escola abaixo. Caixas bloqueiam a calçada junto à escola.',
      },
      {
        id: 'geo-paisagens-q30',
        bloco: 'Geografia · Ampliar e juntar as descobertas',
        titulo: '30. Três ideias para levar com você',
        instrucao:
          'Ouça uma frase por vez e escreva. Pode repetir e parar. Maiúsculas, acentos e ponto-final não são exigidos nesta atividade. Sem voz disponível, peça ao responsável para ditar.',
        tipo: 'campos',
        itens: [
          {
            id: 'geo-paisagens-q30-a',
            pergunta: 'a) Ouça a frase 1 e escreva',
            respostas: ['O campo e a cidade se ajudam.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
          {
            id: 'geo-paisagens-q30-b',
            pergunta: 'b) Ouça a frase 2 e escreva',
            respostas: ['Cuidamos da água e do solo.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
          {
            id: 'geo-paisagens-q30-c',
            pergunta: 'c) Ouça a frase 3 e escreva',
            respostas: ['A paisagem muda com o tempo.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
        ],
        dica: 'Ouça de novo apenas a frase do campo que precisa de correção. Confira se alguma palavra ficou faltando ou mudou de lugar.',
        sucesso:
          'Você registrou três ideias do estudo: a relação entre campo e cidade, o cuidado com os recursos e as mudanças das paisagens.',
        opcoesReversiveis: true,
        leitura:
          'Você observou lugares, relacionou trabalhos, comparou registros e pensou em cuidados. Nesta última atividade, escute três frases curtas que retomam suas descobertas e escreva uma de cada vez.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: 'Texto e representações originais da revisão de Geografia.',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
    ],
  });
})();
