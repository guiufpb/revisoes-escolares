(function () {
  'use strict';

  var REVISAO_ID = 'mariana-ingles-city-life-unidade-5';

  function item(id, ingles, portugues, imagem, variantesEscrita) {
    var registro = { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
    if (variantesEscrita) registro.variantesEscrita = variantesEscrita;
    return registro;
  }

  function op(id, texto, traducao) {
    return { id: id, texto: texto, traducao: traducao };
  }

  function atividade(id, pergunta, instrucao, correta, explicacao, erro, alternativas) {
    return {
      id: id,
      perguntaIngles: pergunta,
      instrucaoPortugues: instrucao,
      respostaCorreta: correta,
      explicacao: explicacao,
      feedbackErro: erro,
      alternativas: alternativas,
    };
  }

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.marianaCityLife = {
    perfil: 'mariana',
    revisaoId: REVISAO_ID,
    unidadeId: 'city-life-unidade-5',
    chaveArmazenamento: 'revisoesEscolares.mariana.ingles.cityLifeUnidade5.v2',
  };

  window.RegistroIngles.registrar({
    id: 'city-life-unidade-5',
    versao: 2,
    titulo: 'City Life',
    subtitulo: 'English Review - Unit 5 · Version 2',
    descricao:
      'Ouça cada palavra com um clique e pratique a escrita. Depois, resolva atividades sobre cidade, viagens, o Dia do Soldado, escola, materiais e formas.',
    imagemCabecalho: 'street.svg',
    perfisDisponiveis: ['mariana'],
    correcaoPorQuestao: true,
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
    mensagemAtividades:
      'Great work! Muito bem! Você ouviu e escreveu as 73 palavras. Agora pode começar as 30 atividades.',
    mensagemFinal:
      'Mariana, great work! Você praticou a cidade, viagens, o Dia do Soldado, a escola, materiais e formas em inglês. Continue ouvindo, escrevendo e aprendendo no seu ritmo!',
    grupos: [
      {
        id: 'lugares-cidade',
        titulo: 'City Places',
        traducao: 'Lugares da cidade',
        instrucao:
          'Clique em um lugar para ouvir em inglês. Depois, copie a palavra no campo de escrita e confira.',
        itens: [
          item('city', 'city', 'cidade', 'street.svg'),
          item('town', 'town', 'cidade pequena', 'church.svg'),
          item('village', 'village', 'vila', 'house.svg'),
          item('clothes-shop', 'clothes shop', 'loja de roupas', 'store.svg'),
          item('restaurant', 'restaurant', 'restaurante', 'cafeteria.svg'),
          item('pharmacy', 'pharmacy', 'farmácia', 'pharmacy.svg'),
          item('supermarket', 'supermarket', 'supermercado', 'market.svg'),
          item('toyshop', 'toy shop', 'loja de brinquedos', 'ball.svg'),
          item('bookshop', 'bookshop', 'livraria', 'book.svg'),
          item('bakery', 'bakery', 'padaria', 'bakery.svg'),
          item('shopping-centre', 'shopping centre', 'centro de compras', 'store.svg'),
          item('playground', 'playground', 'parquinho', 'playground.svg'),
          item('zoo', 'zoo', 'zoológico', 'park.svg'),
          item('hospital', 'hospital', 'hospital', 'hospital.svg'),
        ],
      },
      {
        id: 'posicoes-cidade',
        titulo: 'Where Is It?',
        traducao: 'Onde está?',
        instrucao:
          'Clique em uma posição para ouvir em inglês. Depois, copie a palavra ou expressão e confira.',
        itens: [
          item('in', 'in', 'dentro de', 'store.svg'),
          item('on', 'on', 'sobre ou em cima de', 'road.svg'),
          item('under', 'under', 'embaixo de', 'tree.svg'),
          item('behind', 'behind', 'atrás de', 'car.svg'),
          item('in-front-of', 'in front of', 'na frente de', 'store.svg'),
          item('between', 'between', 'entre', 'car.svg'),
          item('next-to', 'next to', 'ao lado de', 'map.svg'),
          item('there-is', 'There is.', 'Há, no singular.', 'house.svg', ['There is']),
          item('there-are', 'There are.', 'Há, no plural.', 'street.svg', ['There are']),
        ],
      },
      {
        id: 'materiais-propriedades',
        titulo: 'Materials and Properties',
        traducao: 'Materiais e propriedades',
        instrucao:
          'Clique em um material ou propriedade para ouvir. Depois, copie em inglês e confira.',
        itens: [
          item('glass', 'glass', 'vidro', 'square.svg'),
          item('metal', 'metal', 'metal', 'ruler.svg'),
          item('rubber', 'rubber', 'borracha', 'eraser.svg'),
          item('plastic', 'plastic', 'plástico', 'pencil-case.svg'),
          item('fabric', 'fabric', 'tecido', 'backpack.svg'),
          item('cotton', 'cotton', 'algodão', 'ball.svg'),
          item('paper', 'paper', 'papel', 'paper.svg'),
          item('wood', 'wood', 'madeira', 'pencil.svg'),
          item('transparent', 'transparent', 'transparente', 'square.svg'),
          item('flexible', 'flexible', 'flexível', 'eraser.svg'),
          item('impermeable', 'impermeable', 'impermeável', 'pencil-case.svg'),
          item('hard', 'hard', 'duro', 'ruler.svg'),
          item('heavy', 'heavy', 'pesado', 'market.svg'),
          item('soft', 'soft', 'macio', 'ball.svg'),
        ],
      },
      {
        id: 'predios-formas',
        titulo: 'Buildings and Shapes',
        traducao: 'Prédios e formas',
        instrucao:
          'Clique em uma palavra sobre construções ou formas para ouvir. Depois, copie e confira.',
        itens: [
          item('building', 'building', 'prédio', 'store.svg'),
          item('window', 'window', 'janela', 'classroom.svg'),
          item('cuboid', 'cuboid', 'paralelepípedo', 'model.svg'),
          item('rectangle', 'rectangle', 'retângulo', 'blackboard.svg'),
          item('three-dimensional', 'three-dimensional', 'tridimensional', 'model.svg'),
          item('sphere', 'sphere', 'esfera', 'ball.svg'),
          item('cone', 'cone', 'cone', 'pencil-sharpener.svg'),
          item('pyramid', 'pyramid', 'pirâmide', 'model.svg'),
        ],
      },
      {
        id: 'viagem-ferias',
        titulo: 'Travel & Vacation',
        traducao: 'Viagem e férias',
        instrucao:
          'Clique em cada palavra ou expressão de viagem para ouvir. Depois, copie em inglês e confira.',
        itens: [
          item('trip', 'trip', 'viagem', 'map.svg'),
          item('vacation', 'vacation', 'férias', 'park.svg'),
          item('passport', 'passport', 'passaporte', 'passport.svg'),
          item('i-went-to', 'I went to', 'Eu fui para', 'road.svg'),
          item('plane', 'plane', 'avião', 'plane.svg'),
          item('family', 'family', 'família', 'family.svg'),
          item('amazing', 'amazing', 'incrível', 'star.svg'),
          item('favorite-part', 'favorite part', 'parte favorita', 'heart.svg'),
        ],
      },
      {
        id: 'dia-soldado',
        titulo: "Soldier's Day",
        traducao: 'Dia do Soldado',
        instrucao:
          'Clique em cada palavra sobre o Dia do Soldado para ouvir. Depois, copie em inglês e confira.',
        itens: [
          item('soldier', 'soldier', 'soldado', 'soldier.svg'),
          item('brave', 'brave', 'corajoso', 'soldier.svg'),
          item('courage', 'courage', 'coragem', 'shield.svg'),
          item('protect', 'protect', 'proteger', 'shield.svg'),
          item('duty', 'duty', 'dever', 'notebook.svg'),
          item('respect', 'respect', 'respeito', 'heart.svg'),
          item('country', 'country', 'país', 'flag.svg'),
        ],
      },
      {
        id: 'escola-dias-especiais',
        titulo: 'School & Special Days',
        traducao: 'Escola e dias especiais',
        instrucao:
          'Clique em cada palavra da escola e de dias especiais para ouvir. Depois, copie e confira.',
        itens: [
          item('student', 'student', 'aluno ou aluna', 'student.svg'),
          item('book', 'book', 'livro', 'book.svg'),
          item('pencil', 'pencil', 'lápis', 'pencil.svg'),
          item('backpack', 'backpack', 'mochila', 'backpack.svg'),
          item('teacher', 'teacher', 'professor ou professora', 'teacher.svg'),
          item('classroom', 'classroom', 'sala de aula', 'classroom.svg'),
          item('school', 'school', 'escola', 'school.svg'),
          item('learn', 'learn', 'aprender', 'book.svg'),
          item('friend', 'friend', 'amigo ou amiga', 'friend.svg'),
          item('dad', 'dad', 'pai', 'family.svg'),
          item('favorite-color', 'favorite color', 'cor favorita', 'colored-pencils.svg'),
          item('favorite-food', 'favorite food', 'comida favorita', 'food.svg'),
          item('special', 'special', 'especial', 'star.svg'),
        ],
      },
    ],
    atividades: [
      atividade(
        'v2-trip-definition',
        'What is a trip?',
        'O que é uma trip? Escolha a melhor definição.',
        'journey',
        'A trip is a journey to another place. Trip significa viagem.',
        'Pense em sair de um lugar e viajar para outro.',
        [
          op('journey', 'A journey to another place', 'Uma viagem para outro lugar'),
          op('lesson', 'A lesson at school', 'Uma aula na escola'),
          op('material', 'A kind of material', 'Um tipo de material'),
          op('building', 'A tall building', 'Um prédio alto'),
        ]
      ),
      atividade(
        'v2-city-community',
        'Mariana sees many streets, buildings and shops. She is in a ___.',
        'Mariana vê muitas ruas, prédios e lojas. Complete: ela está em uma cidade.',
        'city',
        'City significa cidade, um lugar com ruas, prédios e muitos serviços.',
        'Compare city, town e village e observe a pista “many streets and buildings”.',
        [
          op('city', 'city', 'cidade'),
          op('town', 'town', 'cidade pequena'),
          op('village', 'village', 'vila'),
          op('country', 'country', 'país'),
        ]
      ),
      atividade(
        'v2-passport-purpose',
        'What document do you usually need for an international trip?',
        'Qual documento geralmente é necessário para uma viagem internacional?',
        'passport',
        'A passport é um passaporte usado para identificação em viagens internacionais.',
        'Procure o documento de viagem, não um objeto escolar.',
        [
          op('passport', 'passport', 'passaporte'),
          op('notebook', 'notebook', 'caderno'),
          op('pencil', 'pencil', 'lápis'),
          op('map', 'map', 'mapa'),
        ]
      ),
      atividade(
        'v2-clothes-for-party',
        'Lia needs a new shirt for a party. Where should she go?',
        'Lia precisa de uma camisa nova para uma festa. Aonde ela deve ir?',
        'clothes-shop',
        'A clothes shop é uma loja de roupas.',
        'Pense no lugar especializado em camisas, calças e outras roupas.',
        [
          op('clothes-shop', 'clothes shop', 'loja de roupas'),
          op('bookshop', 'bookshop', 'livraria'),
          op('bakery', 'bakery', 'padaria'),
          op('hospital', 'hospital', 'hospital'),
        ]
      ),
      atividade(
        'v2-i-went-to-meaning',
        'Which expression means “Eu fui para”?',
        'Escolha a expressão em inglês que significa “Eu fui para”.',
        'i-went-to',
        'I went to significa “Eu fui para” e fala sobre um lugar visitado no passado.',
        'Procure a forma com went, o passado de go.',
        [
          op('i-went-to', 'I went to', 'Eu fui para'),
          op('i-go-to', 'I go to', 'Eu vou para'),
          op('i-saw', 'I saw', 'Eu vi'),
          op('i-ate', 'I ate', 'Eu comi'),
        ]
      ),
      atividade(
        'v2-doctor-place',
        'Ravi is very sick and needs a doctor. Where should he go?',
        'Ravi está muito doente e precisa de um médico. Aonde ele deve ir?',
        'hospital',
        'Doctors help sick people at a hospital. Hospital também significa hospital.',
        'Procure o lugar onde médicos cuidam de pessoas doentes.',
        [
          op('hospital', 'hospital', 'hospital'),
          op('pharmacy', 'pharmacy', 'farmácia'),
          op('playground', 'playground', 'parquinho'),
          op('restaurant', 'restaurant', 'restaurante'),
        ]
      ),
      atividade(
        'v2-vacation-went',
        'On my vacation, I ___ to Disney.',
        'Nas minhas férias, eu fui para a Disney. Complete a frase no passado.',
        'went',
        'Went é o passado de go: On my vacation, I went to Disney.',
        'A frase fala de férias que já aconteceram; use o passado de go.',
        [
          op('went', 'went', 'fui'),
          op('go', 'go', 'ir ou vou'),
          op('goes', 'goes', 'vai'),
          op('going', 'going', 'indo'),
        ]
      ),
      atividade(
        'v2-supermarket-list',
        'Noah needs rice, fruit and milk. Where can he buy them?',
        'Noah precisa de arroz, frutas e leite. Onde ele pode comprar esses alimentos?',
        'supermarket',
        'A supermarket vende muitos tipos de alimentos.',
        'Pense no lugar onde fazemos uma lista grande de compras de comida.',
        [
          op('supermarket', 'supermarket', 'supermercado'),
          op('toyshop', 'toy shop', 'loja de brinquedos'),
          op('bookshop', 'bookshop', 'livraria'),
          op('zoo', 'zoo', 'zoológico'),
        ]
      ),
      atividade(
        'v2-where-did-you-go',
        'Where did you go?',
        'Aonde você foi? Escolha uma resposta-modelo adequada.',
        'beach',
        'I went to the beach responde a “Where did you go?” com um lugar visitado.',
        'A pergunta pede um lugar e uma resposta no passado.',
        [
          op('beach', 'I went to the beach.', 'Eu fui à praia.'),
          op('family', 'With my family.', 'Com minha família.'),
          op('july', 'In July.', 'Em julho.'),
          op('amazing', 'It was amazing!', 'Foi incrível!'),
        ]
      ),
      atividade(
        'v2-there-is-library',
        'Is there a bookshop next to the school?',
        'Há uma livraria ao lado da escola? Escolha a resposta afirmativa no singular.',
        'yes-there-is',
        'Yes, there is é a resposta afirmativa para “Is there...?” no singular.',
        'A pergunta usa “a bookshop”, portanto está no singular.',
        [
          op('yes-there-is', 'Yes, there is.', 'Sim, há.'),
          op('yes-there-are', 'Yes, there are.', 'Sim, há, no plural.'),
          op('no-they-are', 'No, they are.', 'Não, eles são.'),
          op('there-are', 'There are.', 'Há, no plural.'),
        ]
      ),
      atividade(
        'v2-how-did-you-travel',
        'How did you travel?',
        'Como você viajou? Escolha a resposta que indica o meio de transporte.',
        'plane',
        'By plane responde como a pessoa viajou: de avião.',
        'A pergunta “How?” pede a maneira ou o meio de transporte.',
        [
          op('plane', 'By plane.', 'De avião.'),
          op('july', 'In July.', 'Em julho.'),
          op('family', 'With my family.', 'Com minha família.'),
          op('amazing', 'It was amazing!', 'Foi incrível!'),
        ]
      ),
      atividade(
        'v2-puppy-in-shop',
        'The puppy is ___ the toy shop.',
        'O cachorrinho está dentro da loja de brinquedos. Complete a frase.',
        'in',
        'In indica que o cachorrinho está dentro do lugar.',
        'A pista é “dentro da loja”.',
        [
          op('in', 'in', 'dentro de'),
          op('on', 'on', 'sobre'),
          op('behind', 'behind', 'atrás de'),
          op('next-to', 'next to', 'ao lado de'),
        ]
      ),
      atividade(
        'v2-favorite-part-meaning',
        'What does “My favorite part was...” mean?',
        'O que significa “My favorite part was...”?',
        'parte-favorita',
        'My favorite part was... significa “Minha parte favorita foi...”.',
        'Observe as palavras favorite e part.',
        [
          op('parte-favorita', 'My favorite part was...', 'Minha parte favorita foi...'),
          op('comi', 'I ate...', 'Eu comi...'),
          op('vi', 'I saw...', 'Eu vi...'),
          op('viajei', 'I traveled...', 'Eu viajei...'),
        ]
      ),
      atividade(
        'v2-bus-in-front',
        'The bus is ___ the school entrance.',
        'O ônibus está na frente da entrada da escola. Complete a frase.',
        'in-front-of',
        'In front of significa na frente de.',
        'Procure a expressão que indica uma posição diante da entrada.',
        [
          op('in-front-of', 'in front of', 'na frente de'),
          op('behind', 'behind', 'atrás de'),
          op('under', 'under', 'embaixo de'),
          op('in', 'in', 'dentro de'),
        ]
      ),
      atividade(
        'v2-soldiers-brave',
        'Soldiers are ___ people.',
        'Soldados são pessoas corajosas. Complete a frase.',
        'brave',
        'Brave significa corajoso ou corajosa.',
        'Procure a palavra que significa “corajosos”.',
        [
          op('brave', 'brave', 'corajosas'),
          op('soft', 'soft', 'macias'),
          op('heavy', 'heavy', 'pesadas'),
          op('transparent', 'transparent', 'transparentes'),
        ]
      ),
      atividade(
        'v2-cafe-between',
        'The restaurant is ___ the pharmacy and the bakery.',
        'O restaurante fica entre a farmácia e a padaria. Complete a frase.',
        'between',
        'Between significa entre dois lugares, pessoas ou objetos.',
        'A frase cita um lugar de cada lado do restaurante.',
        [
          op('between', 'between', 'entre'),
          op('next-to', 'next to', 'ao lado de'),
          op('on', 'on', 'sobre'),
          op('behind', 'behind', 'atrás de'),
        ]
      ),
      atividade(
        'v2-soldiers-protect',
        'Soldiers ___ our country.',
        'Soldados protegem nosso país. Complete a frase.',
        'protect',
        'Protect significa proteger.',
        'Procure o verbo que significa “proteger”.',
        [
          op('protect', 'protect', 'protegem'),
          op('learn', 'learn', 'aprendem'),
          op('travel', 'travel', 'viajam'),
          op('write', 'write', 'escrevem'),
        ]
      ),
      atividade(
        'v2-ball-under-bench',
        'The ball is ___ the playground bench.',
        'A bola está embaixo do banco do parquinho. Complete a frase.',
        'under',
        'Under significa embaixo de.',
        'Procure a palavra que indica uma posição abaixo do banco.',
        [
          op('under', 'under', 'embaixo de'),
          op('on', 'on', 'sobre'),
          op('behind', 'behind', 'atrás de'),
          op('between', 'between', 'entre'),
        ]
      ),
      atividade(
        'v2-respect-soldiers',
        'We should ___ our soldiers.',
        'Devemos respeitar nossos soldados. Complete a frase.',
        'respect',
        'Respect significa respeitar.',
        'Procure o verbo que significa “respeitar”.',
        [
          op('respect', 'respect', 'respeitar'),
          op('forget', 'forget', 'esquecer'),
          op('hide', 'hide', 'esconder'),
          op('break', 'break', 'quebrar'),
        ]
      ),
      atividade(
        'v2-rubber-band',
        'A rubber band bends easily. Which property describes it?',
        'Um elástico de borracha dobra facilmente. Qual propriedade o descreve?',
        'flexible',
        'Rubber pode ser flexible, isto é, flexível.',
        'Pense em algo que pode dobrar sem quebrar.',
        [
          op('flexible', 'flexible', 'flexível'),
          op('hard', 'hard', 'duro'),
          op('transparent', 'transparent', 'transparente'),
          op('heavy', 'heavy', 'pesado'),
        ]
      ),
      atividade(
        'v2-unscramble-student',
        'Unscramble the word: udstnet',
        'Desembaralhe as letras de “udstnet” e encontre a palavra “aluno ou aluna”.',
        'student',
        'As letras formam student, que significa aluno ou aluna.',
        'Comece com “stu” e procure terminar com “dent”.',
        [
          op('student', 'student', 'aluno ou aluna'),
          op('teacher', 'teacher', 'professor ou professora'),
          op('school', 'school', 'escola'),
          op('friend', 'friend', 'amigo ou amiga'),
        ]
      ),
      atividade(
        'v2-glass-door',
        'You can see through a glass door. Glass can be ___.',
        'Você consegue enxergar através de uma porta de vidro. O vidro pode ser...',
        'transparent',
        'Glass pode ser transparent e deixar a luz passar.',
        'Pense na propriedade que permite enxergar através do material.',
        [
          op('transparent', 'transparent', 'transparente'),
          op('soft', 'soft', 'macio'),
          op('flexible', 'flexible', 'flexível'),
          op('impermeable', 'impermeable', 'impermeável'),
        ]
      ),
      atividade(
        'v2-writing-pencil',
        'She is writing with a ___.',
        'Ela está escrevendo com um lápis. Complete a frase.',
        'pencil',
        'Pencil significa lápis, um objeto usado para escrever.',
        'Procure o objeto escolar usado para escrever.',
        [
          op('pencil', 'pencil', 'lápis'),
          op('book', 'book', 'livro'),
          op('backpack', 'backpack', 'mochila'),
          op('passport', 'passport', 'passaporte'),
        ]
      ),
      atividade(
        'v2-cotton-pillow',
        'A cotton pillow feels gentle. Cotton is usually ___.',
        'Um travesseiro de algodão é agradável ao toque. O algodão geralmente é...',
        'soft',
        'Cotton costuma ser soft, isto é, macio.',
        'Pense em como o algodão é sentido ao toque.',
        [
          op('soft', 'soft', 'macio'),
          op('hard', 'hard', 'duro'),
          op('heavy', 'heavy', 'pesado'),
          op('transparent', 'transparent', 'transparente'),
        ]
      ),
      atividade(
        'v2-ben-favorite-color',
        "Ben's favorite color is blue. What is his favorite color?",
        'A cor favorita do personagem fictício Ben é azul. Qual é a cor favorita dele?',
        'blue',
        "The sentence says Ben's favorite color is blue.",
        'Releia a primeira frase e procure a cor mencionada.',
        [
          op('blue', 'blue', 'azul'),
          op('green', 'green', 'verde'),
          op('yellow', 'yellow', 'amarelo'),
          op('red', 'red', 'vermelho'),
        ]
      ),
      atividade(
        'v2-raincoat-material',
        'Which material is useful for an impermeable rain cover?',
        'Qual material é útil para uma capa de chuva impermeável?',
        'plastic',
        'Plastic costuma ser impermeable e impedir a passagem da água.',
        'Compare plastic com materiais que absorvem água, como paper, fabric e cotton.',
        [
          op('plastic', 'plastic', 'plástico'),
          op('paper', 'paper', 'papel'),
          op('fabric', 'fabric', 'tecido'),
          op('cotton', 'cotton', 'algodão'),
        ]
      ),
      atividade(
        'v2-place-for-fun',
        'Where can you go to have fun?',
        'Aonde você pode ir para se divertir?',
        'playground',
        'A playground é um parquinho onde crianças podem brincar e se divertir.',
        'Escolha o lugar feito para brincar, não para comprar livros ou receber cuidados de saúde.',
        [
          op('playground', 'playground', 'parquinho'),
          op('pharmacy', 'pharmacy', 'farmácia'),
          op('hospital', 'hospital', 'hospital'),
          op('bookshop', 'bookshop', 'livraria'),
        ]
      ),
      atividade(
        'v2-window-material',
        'Which material lets light enter through many building windows?',
        'Qual material deixa a luz entrar por muitas janelas de prédios?',
        'glass',
        'Muitas janelas são feitas de glass, que pode ser transparente.',
        'Pense no material transparente usado em janelas, não em metal, madeira ou borracha.',
        [
          op('glass', 'glass', 'vidro'),
          op('metal', 'metal', 'metal'),
          op('wood', 'wood', 'madeira'),
          op('rubber', 'rubber', 'borracha'),
        ]
      ),
      atividade(
        'v2-building-shape',
        'A rectangular building has length, width and height. Which 3D shape matches it?',
        'Um prédio retangular tem comprimento, largura e altura. Qual forma 3D combina com ele?',
        'cuboid',
        'A cuboid é uma forma tridimensional parecida com uma caixa retangular.',
        'Procure a forma 3D parecida com uma caixa, não com uma bola ou um cone.',
        [
          op('cuboid', 'cuboid', 'paralelepípedo'),
          op('sphere', 'sphere', 'esfera'),
          op('cone', 'cone', 'cone'),
          op('pyramid', 'pyramid', 'pirâmide'),
        ]
      ),
      atividade(
        'v2-globe-shape',
        'A globe is round in every direction. Which 3D shape is it?',
        'Um globo é redondo em todas as direções. Qual é a forma 3D dele?',
        'sphere',
        'A globe has the shape of a sphere, isto é, uma esfera.',
        'Pense em uma forma redonda como uma bola.',
        [
          op('sphere', 'sphere', 'esfera'),
          op('cuboid', 'cuboid', 'paralelepípedo'),
          op('cone', 'cone', 'cone'),
          op('pyramid', 'pyramid', 'pirâmide'),
        ]
      ),
    ],
  });
})();
