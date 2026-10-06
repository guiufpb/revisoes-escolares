(function () {
  'use strict';

  var REVISAO_ID = 'alice-ingles-at-the-farm-unidade-5';

  function item(id, ingles, portugues, imagem, variantesEscrita) {
    var valor = { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
    if (variantesEscrita) valor.variantesEscrita = variantesEscrita;
    return valor;
  }

  function opcao(id, texto, traducao, imagem) {
    var valor = { id: id, texto: texto, traducao: traducao };
    if (imagem) valor.imagem = imagem;
    return valor;
  }

  function atividade(
    id,
    pergunta,
    instrucao,
    correta,
    explicacao,
    erro,
    alternativas,
    imagem,
    repeticoes
  ) {
    var valor = {
      id: id,
      perguntaIngles: pergunta,
      instrucaoPortugues: instrucao,
      respostaCorreta: correta,
      explicacao: explicacao,
      feedbackErro: erro,
      alternativas: alternativas,
    };
    if (imagem) valor.imagemEnunciado = imagem;
    if (repeticoes) valor.repeticoesImagem = repeticoes;
    return valor;
  }

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.aliceAtTheFarm = {
    perfil: 'alice',
    revisaoId: REVISAO_ID,
    unidadeId: 'at-the-farm-unidade-5',
    chaveArmazenamento: 'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2',
  };

  window.RegistroIngles.registrar({
    id: 'at-the-farm-unidade-5',
    versao: 2,
    titulo: 'At the Farm',
    subtitulo: 'English Review - Unit 5 · Version 2',
    descricao:
      'Ouça cada palavra com um clique e copie em inglês. Depois, pratique animais, família, brinquedos, posições, escola e datas especiais.',
    imagemCabecalho: 'farm.svg',
    perfisDisponiveis: ['alice'],
    correcaoPorQuestao: true,
    layout: { desktopAmplo: true },
    praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true },
    mensagemAtividades:
      'Great work! Você ouviu e escreveu os 97 itens. Agora pode começar as 30 atividades!',
    mensagemFinal:
      'Alice, great job! Você praticou animais, cuidados, família, brinquedos, posições e pequenas frases em inglês. Continue aprendendo no seu ritmo!',
    grupos: [
      {
        id: 'animais-fazenda',
        titulo: 'Farm Animals',
        traducao: 'Animais da fazenda',
        instrucao:
          'Clique em cada animal para ouvir o nome em inglês. Depois, copie a palavra e confira. Use a opção devagar quando quiser.',
        itens: [
          item('bird', 'bird', 'pássaro', 'bird.svg'),
          item('pig', 'pig', 'porco', 'pig.svg'),
          item('sheep', 'sheep', 'ovelha', 'sheep.svg'),
          item('dog', 'dog', 'cachorro', 'dog.svg'),
          item('chicken', 'chicken', 'galinha', 'chicken.svg'),
          item('goat', 'goat', 'cabra', 'goat.svg'),
          item('cat', 'cat', 'gato', 'cat.svg'),
          item('horse', 'horse', 'cavalo', 'horse.svg'),
          item('cow', 'cow', 'vaca', 'cow.svg'),
          item('mouse', 'mouse', 'camundongo', 'mouse.svg'),
          item('duck', 'duck', 'pato', 'duck.svg'),
          item('fish', 'fish', 'peixe', 'fish.svg'),
          item('farm-animal', 'farm animal', 'animal da fazenda', 'farm.svg'),
        ],
      },
      {
        id: 'familias-grupos',
        titulo: 'Families and Groups',
        traducao: 'Famílias e grupos',
        instrucao:
          'Clique para ouvir as palavras sobre filhotes e grupos de animais. Depois, copie em inglês e confira.',
        itens: [
          item('calf', 'calf', 'bezerro', 'calf.svg'),
          item('lamb', 'lamb', 'cordeiro', 'lamb.svg'),
          item('piglet', 'piglet', 'leitão', 'piglet.svg'),
          item('chick', 'chick', 'pintinho', 'chick.svg'),
          item('duckling', 'duckling', 'patinho', 'duckling.svg'),
          item('baby-animals', 'baby animals', 'filhotes', 'baby-animals.svg'),
          item(
            'animals-and-babies',
            'animals and their babies',
            'animais e seus filhotes',
            'baby-animals.svg'
          ),
          item(
            'four-legged-animals',
            'four-legged animals',
            'animais de quatro patas',
            'horse.svg'
          ),
          item('birds', 'birds', 'aves', 'bird.svg'),
          item('mammals', 'mammals', 'mamíferos', 'cow.svg'),
        ],
      },
      {
        id: 'cuidados-alimentos',
        titulo: 'Care and Food',
        traducao: 'Cuidados e alimentos',
        instrucao:
          'Clique para ouvir o que os animais precisam e como cuidamos deles. Depois, copie em inglês e confira.',
        itens: [
          item('food', 'food', 'comida', 'food.svg'),
          item('water', 'water', 'água', 'water.svg'),
          item('milk', 'milk', 'leite', 'milk.svg'),
          item('grass', 'grass', 'grama', 'grass.svg'),
          item('carrots', 'carrots', 'cenouras', 'carrots.svg'),
          item('hay', 'hay', 'feno', 'hay.svg'),
          item('feed-animals', 'feed the animals', 'alimentar os animais', 'food.svg'),
          item('brush-horse', 'brush the horse', 'escovar o cavalo', 'paintbrush.svg'),
          item('ride-horse', 'ride a horse', 'andar a cavalo', 'horse.svg'),
        ],
      },
      {
        id: 'lugares-sons',
        titulo: 'Places and Sounds',
        traducao: 'Lugares e sons',
        instrucao:
          'Clique para ouvir os lugares e os sons dos animais. Depois, copie em inglês e confira.',
        itens: [
          item('farm', 'farm', 'fazenda', 'farm.svg'),
          item('city', 'city', 'cidade', 'city.svg'),
          item('pond', 'pond', 'lagoa', 'pond.svg'),
          item('aquarium', 'aquarium', 'aquário', 'aquarium.svg'),
          item('home', 'home', 'casa', 'home.svg'),
          item('woof', 'woof', 'som do cachorro', 'dog.svg'),
          item('moo', 'moo', 'som da vaca', 'cow.svg'),
          item('cluck', 'cluck', 'som da galinha', 'chicken.svg'),
          item('oink', 'oink', 'som do porco', 'pig.svg'),
        ],
      },
      {
        id: 'mais-animais',
        titulo: 'More Animals',
        traducao: 'Mais animais',
        instrucao:
          'Clique para ouvir e depois copie. Aqui há também um animal selvagem: o leão não é um animal da fazenda.',
        itens: [
          item('rabbit', 'rabbit', 'coelho', 'rabbit.svg'),
          item('hen', 'hen', 'galinha adulta (fêmea)', 'chicken.svg'),
          item('lion', 'lion', 'leão (animal selvagem)', 'lion.svg'),
        ],
      },
      {
        id: 'familia-dia-pais',
        titulo: "Family & Father's Day",
        traducao: 'Família e Dia dos Pais',
        instrucao:
          'Clique para ouvir as palavras de família e do Dia dos Pais. Depois, copie em inglês e confira.',
        itens: [
          item('fathers-day', "Father's Day", 'Dia dos Pais', 'family.svg', ['Fathers Day']),
          item('celebration', 'celebration', 'celebração', 'star.svg'),
          item('father', 'father', 'pai', 'family.svg'),
          item('gifts', 'gifts', 'presentes', 'gifts.svg'),
          item('dad', 'dad', 'papai', 'family.svg'),
          item('heart', 'heart', 'coração', 'heart.svg'),
          item('love', 'love', 'amor', 'heart.svg'),
          item('happy-fathers-day', "Happy Father's Day!", 'Feliz Dia dos Pais!', 'gifts.svg', [
            "Happy Father's Day",
            'Happy Fathers Day!',
            'Happy Fathers Day',
          ]),
          item('mother', 'mother', 'mãe', 'family.svg'),
          item('parents', 'parents', 'pais', 'family.svg'),
          item('brother', 'brother', 'irmão', 'friend.svg'),
          item('sister', 'sister', 'irmã', 'friend.svg'),
          item('family', 'family', 'família', 'family.svg'),
        ],
      },
      {
        id: 'brinquedos',
        titulo: 'Toys',
        traducao: 'Brinquedos',
        instrucao:
          'Clique em cada brinquedo para ouvir seu nome. Depois, copie a palavra ou expressão e confira.',
        itens: [
          item('toys', 'toys', 'brinquedos', 'blocks.svg'),
          item('doll', 'doll', 'boneca', 'doll.svg'),
          item('ball', 'ball', 'bola', 'ball.svg'),
          item('rocket', 'rocket', 'foguete', 'rocket.svg'),
          item('robot', 'robot', 'robô', 'robot.svg'),
          item('blocks', 'blocks', 'blocos', 'blocks.svg'),
          item('helicopter', 'helicopter', 'helicóptero', 'helicopter.svg'),
          item('boat', 'boat', 'barco', 'boat.svg'),
          item('teddy-bear', 'teddy bear', 'ursinho de pelúcia', 'teddy-bear.svg'),
          item('truck', 'truck', 'caminhão', 'truck.svg'),
          item('mini-car', 'mini car', 'carrinho', 'car.svg'),
          item('train', 'train', 'trem', 'train.svg'),
          item('plane', 'plane', 'avião', 'plane.svg'),
          item('bike', 'bike', 'bicicleta', 'bike.svg'),
        ],
      },
      {
        id: 'posicoes',
        titulo: 'Where Is It?',
        traducao: 'Onde está?',
        instrucao:
          'Observe a posição dos objetos. Clique para ouvir, copie a expressão em inglês e confira.',
        itens: [
          item('on', 'on', 'em cima de', 'car-on-table.svg'),
          item('under', 'under', 'embaixo de', 'ball-under-bench.svg'),
          item('next-to', 'next to', 'ao lado de / próximo de', 'doll-next-to-bear.svg'),
          item('in', 'in', 'dentro de', 'puppy-in-toy-shop.svg'),
          item('in-front-of', 'in front of', 'em frente de', 'robot-in-front-of-box.svg'),
        ],
      },
      {
        id: 'pequena-gramatica',
        titulo: 'Little Grammar',
        traducao: 'Pequenas palavras da gramática',
        instrucao:
          'Clique para ouvir cada pequena palavra. Leia o exemplo ao lado da tradução, copie a palavra e confira.',
        itens: [
          item('am', 'am', 'sou / estou: I am (eu sou / estou)', 'student.svg'),
          item('is', 'is', 'é / está: It is (ele ou ela é / está)', 'cat.svg'),
          item('are', 'are', 'são / estão: They are (eles são / estão)', 'family.svg'),
          item('has', 'has', 'tem: He has (ele tem)', 'ball.svg'),
          item('have', 'have', 'temos: We have (nós temos)', 'book.svg'),
        ],
      },
      {
        id: 'escola-datas',
        titulo: 'School & Special Days',
        traducao: 'Escola e datas especiais',
        instrucao:
          'Pratique palavras da escola, do Dia do Estudante e do Dia do Soldado. Clique para ouvir, copie e confira.',
        itens: [
          item('student', 'student', 'estudante', 'student.svg'),
          item('book', 'book', 'livro', 'book.svg'),
          item('pencil', 'pencil', 'lápis', 'pencil.svg'),
          item('backpack', 'backpack', 'mochila', 'backpack.svg'),
          item('teacher', 'teacher', 'professor / professora', 'teacher.svg'),
          item('classroom', 'classroom', 'sala de aula', 'classroom.svg'),
          item('school', 'school', 'escola', 'school.svg'),
          item('learn', 'learn', 'aprender', 'book.svg'),
          item('friend', 'friend', 'amigo / amiga', 'friend.svg'),
          item('soldier', 'soldier', 'soldado', 'soldier.svg'),
          item('brave', 'brave', 'corajoso', 'soldier.svg'),
          item('courage', 'courage', 'coragem', 'shield.svg'),
          item('protect', 'protect', 'proteger', 'shield.svg'),
          item('duty', 'duty', 'dever', 'notebook.svg'),
          item('respect', 'respect', 'respeito / respeitar', 'heart.svg'),
          item('country', 'country', 'país', 'flag.svg'),
        ],
      },
    ],
    atividades: [
      atividade(
        'v2-rabbit',
        'Look at the long ears. Which animal is this?',
        'Observe as orelhas compridas. Qual é este animal?',
        'rabbit',
        'It is a rabbit. Rabbit significa coelho.',
        'Observe as orelhas e compare com os animais que você estudou.',
        [
          opcao('rabbit', 'rabbit', 'coelho'),
          opcao('cat', 'cat', 'gato'),
          opcao('pig', 'pig', 'porco'),
          opcao('sheep', 'sheep', 'ovelha'),
        ],
        'rabbit.svg'
      ),
      atividade(
        'v2-lion',
        'Which animal is a lion?',
        'Qual destes animais é um leão? Ele é um animal selvagem.',
        'lion',
        'Lion significa leão. O leão é selvagem, não um animal da fazenda.',
        'Procure o felino com uma grande juba ao redor do rosto.',
        [
          opcao('horse', 'horse', 'cavalo', 'horse.svg'),
          opcao('lion', 'lion', 'leão', 'lion.svg'),
          opcao('rabbit', 'rabbit', 'coelho', 'rabbit.svg'),
          opcao('dog', 'dog', 'cachorro', 'dog.svg'),
        ]
      ),
      atividade(
        'v2-lamb',
        'A sheep has a baby. What is the baby called?',
        'Uma ovelha tem um filhote. Como ele se chama em inglês?',
        'lamb',
        'A baby sheep is a lamb. O filhote da ovelha é o cordeiro.',
        'Lembre-se do par formado pela ovelha e seu filhote.',
        [
          opcao('calf', 'calf', 'bezerro'),
          opcao('lamb', 'lamb', 'cordeiro'),
          opcao('piglet', 'piglet', 'leitão'),
          opcao('chick', 'chick', 'pintinho'),
        ]
      ),
      atividade(
        'v2-duckling',
        'The baby follows its mother duck. What is it called?',
        'O filhote segue a mamãe pata. Como esse filhote se chama?',
        'duckling',
        'A baby duck is a duckling. Duckling significa patinho.',
        'Pense no filhote que cresce e se torna um pato.',
        [
          opcao('lamb', 'lamb', 'cordeiro'),
          opcao('chick', 'chick', 'pintinho'),
          opcao('duckling', 'duckling', 'patinho'),
          opcao('calf', 'calf', 'bezerro'),
        ]
      ),
      atividade(
        'v2-hen-group',
        'A hen has feathers. Which group does it belong to?',
        'A galinha tem penas. A qual grupo ela pertence?',
        'birds',
        'A hen is a bird. A galinha adulta pertence ao grupo das aves.',
        'As penas ajudam você a reconhecer este grupo de animais.',
        [
          opcao('birds', 'birds', 'aves'),
          opcao('mammals', 'mammals', 'mamíferos'),
          opcao('fish', 'fish', 'peixes'),
          opcao('baby-animals', 'baby animals', 'filhotes'),
        ]
      ),
      atividade(
        'v2-cow-group',
        "A baby cow drinks its mother's milk. Which group includes cows?",
        'O bezerro mama quando é pequeno. A qual grupo pertence a vaca?',
        'mammals',
        'A cow is a mammal. A vaca pertence ao grupo dos mamíferos.',
        'Lembre-se do grupo dos animais que mamam quando são filhotes.',
        [
          opcao('birds', 'birds', 'aves'),
          opcao('fish', 'fish', 'peixes'),
          opcao('mammals', 'mammals', 'mamíferos'),
          opcao('chicks', 'chicks', 'pintinhos'),
        ]
      ),
      atividade(
        'v2-count-pigs',
        'How many pigs can you see?',
        'Quantos porcos você consegue ver?',
        'three',
        'There are three pigs. Há três porcos.',
        'Aponte para cada porco e conte uma vez, sem repetir nenhum.',
        [
          opcao('two', '2 · two', 'dois'),
          opcao('three', '3 · three', 'três'),
          opcao('four', '4 · four', 'quatro'),
          opcao('five', '5 · five', 'cinco'),
        ],
        'pig.svg',
        3
      ),
      atividade(
        'v2-favourite-horse',
        'Which sentence means “Meu animal da fazenda favorito é o cavalo”?',
        'Escolha a frase em inglês com o mesmo significado.',
        'horse',
        'My favourite farm animal is the horse. A frase diz que o cavalo é o favorito.',
        'Compare os nomes dos animais no final das frases.',
        [
          opcao(
            'horse',
            'My favourite farm animal is the horse.',
            'Meu animal da fazenda favorito é o cavalo.'
          ),
          opcao(
            'cow',
            'My favourite farm animal is the cow.',
            'Meu animal da fazenda favorito é a vaca.'
          ),
          opcao(
            'pig',
            'My favourite farm animal is the pig.',
            'Meu animal da fazenda favorito é o porco.'
          ),
          opcao(
            'duck',
            'My favourite farm animal is the duck.',
            'Meu animal da fazenda favorito é o pato.'
          ),
        ]
      ),
      atividade(
        'v2-horse-hay',
        'Choose a suitable food for a horse.',
        'Escolha um alimento adequado para um cavalo.',
        'hay',
        'A horse can eat hay. Feno é um alimento adequado para cavalos.',
        'Procure um alimento de origem vegetal usado na alimentação de cavalos.',
        [
          opcao('hay', 'hay', 'feno', 'hay.svg'),
          opcao('chocolate', 'chocolate', 'chocolate'),
          opcao('cake', 'cake', 'bolo'),
          opcao('candy', 'candy', 'bala'),
        ]
      ),
      atividade(
        'v2-no-chocolate',
        'Which food should NOT be given to a horse?',
        'Qual alimento NÃO deve ser dado a um cavalo?',
        'chocolate',
        'Do not give chocolate to a horse. Chocolate não é um alimento adequado para cavalos.',
        'Entre as opções há um doce feito para pessoas. Não o ofereça ao animal.',
        [
          opcao('hay', 'hay', 'feno'),
          opcao('grass', 'grass', 'grama'),
          opcao('carrots', 'carrots', 'cenouras'),
          opcao('chocolate', 'chocolate', 'chocolate'),
        ]
      ),
      atividade(
        'v2-duck-pond',
        'The duck wants to swim. Where can it go?',
        'O pato quer nadar. A qual lugar ele pode ir?',
        'pond',
        'A duck can swim in a pond. Um pato pode nadar em uma lagoa.',
        'Procure um lugar com água e espaço para o pato nadar.',
        [
          opcao('pond', 'pond', 'lagoa', 'pond.svg'),
          opcao('classroom', 'classroom', 'sala de aula'),
          opcao('backpack', 'backpack', 'mochila'),
          opcao('toy-shop', 'toy shop', 'loja de brinquedos'),
        ]
      ),
      atividade(
        'v2-sheep-farm',
        'Where can a sheep live with other farm animals?',
        'Onde uma ovelha pode viver com outros animais da fazenda?',
        'farm',
        'A sheep can live on a farm. Uma ovelha pode viver em uma fazenda.',
        'Pense em um lugar com pasto, espaço e cuidados para a ovelha.',
        [
          opcao('aquarium', 'aquarium', 'aquário'),
          opcao('farm', 'farm', 'fazenda', 'farm.svg'),
          opcao('pond', 'pond', 'lagoa'),
          opcao('toy-box', 'toy box', 'caixa de brinquedos'),
        ]
      ),
      atividade(
        'v2-dog-needs',
        'What must we give a dog every day?',
        'O que precisamos oferecer a um cachorro todos os dias?',
        'food-water',
        'A dog needs food and water. O cachorro precisa de comida e água todos os dias.',
        'Pense no que mata a fome e a sede do animal.',
        [
          opcao('food-water', 'food and water', 'comida e água'),
          opcao('only-toys', 'only toys', 'somente brinquedos'),
          opcao('gifts', 'gifts', 'presentes'),
          opcao('chocolate', 'chocolate', 'chocolate'),
        ]
      ),
      atividade(
        'v2-brush-horse',
        'The horse needs gentle care. What can we do?',
        'O cavalo precisa de cuidado e carinho. O que podemos fazer?',
        'brush-horse',
        'We can brush the horse. Podemos escovar o cavalo com cuidado.',
        'Escolha uma ação delicada que cuida do pelo do cavalo.',
        [
          opcao('pull', 'pull its tail', 'puxar seu rabo'),
          opcao('brush-horse', 'brush the horse', 'escovar o cavalo'),
          opcao('shout', 'shout at it', 'gritar com ele'),
          opcao('no-water', 'take away its water', 'tirar sua água'),
        ]
      ),
      atividade(
        'v2-dog-sound',
        'The dog is barking. Which word shows its sound in English?',
        'O cachorro está latindo. Qual palavra representa esse som em inglês?',
        'woof',
        'A dog goes woof. Woof representa o som do cachorro em inglês.',
        'Pense no som de um latido e compare com os sons estudados.',
        [
          opcao('moo', 'moo', 'muuu'),
          opcao('woof', 'woof', 'au-au'),
          opcao('oink', 'oink', 'oinc'),
          opcao('cluck', 'cluck', 'có-có'),
        ]
      ),
      atividade(
        'v2-hen-sound',
        'Listen to the hen! Which word shows its sound in English?',
        'Imagine a galinha cacarejando. Qual palavra representa o som dela em inglês?',
        'cluck',
        'A hen goes cluck. Cluck representa o cacarejo da galinha.',
        'Lembre-se do som da ave adulta que põe ovos.',
        [
          opcao('woof', 'woof', 'au-au'),
          opcao('oink', 'oink', 'oinc'),
          opcao('cluck', 'cluck', 'có-có'),
          opcao('moo', 'moo', 'muuu'),
        ]
      ),
      atividade(
        'v2-fathers-day',
        'Which phrase means “Feliz Dia dos Pais!”?',
        'Escolha a expressão de carinho para o Dia dos Pais.',
        'happy-fathers-day',
        "Happy Father's Day! significa Feliz Dia dos Pais!",
        'Procure uma saudação de felicidade para a data, não apenas uma lista de palavras.',
        [
          opcao('happy-fathers-day', "Happy Father's Day!", 'Feliz Dia dos Pais!'),
          opcao('family', 'My family', 'Minha família'),
          opcao('love', 'Love and gifts', 'Amor e presentes'),
          opcao('dad', 'My dad', 'Meu papai'),
        ]
      ),
      atividade(
        'v2-gifts',
        'What does “gifts” mean?',
        'Na lista do Dia dos Pais, o que significa “gifts”?',
        'gifts',
        'Gifts significa presentes.',
        'Pense nas coisas que podemos embrulhar para oferecer a alguém.',
        [
          opcao('heart', 'heart', 'coração'),
          opcao('gifts', 'gifts', 'presentes'),
          opcao('love', 'love', 'amor'),
          opcao('celebration', 'celebration', 'celebração'),
        ]
      ),
      atividade(
        'v2-teddy-bear',
        'Which toy is this?',
        'Observe a figura. Qual é este brinquedo?',
        'teddy-bear',
        'It is a teddy bear. É um ursinho de pelúcia.',
        'Observe as orelhas redondas e o corpo de um ursinho.',
        [
          opcao('doll', 'doll', 'boneca'),
          opcao('robot', 'robot', 'robô'),
          opcao('ball', 'ball', 'bola'),
          opcao('teddy-bear', 'teddy bear', 'ursinho de pelúcia'),
        ],
        'teddy-bear.svg'
      ),
      atividade(
        'v2-helicopter',
        'Which toy has a rotor on top?',
        'Qual brinquedo aparece com uma hélice na parte de cima?',
        'helicopter',
        'It is a helicopter. É um helicóptero.',
        'Observe a hélice acima da cabine. Compare com os outros meios de transporte.',
        [
          opcao('plane', 'plane', 'avião'),
          opcao('boat', 'boat', 'barco'),
          opcao('helicopter', 'helicopter', 'helicóptero'),
          opcao('bike', 'bike', 'bicicleta'),
        ],
        'helicopter.svg'
      ),
      atividade(
        'v2-pencil',
        'She is writing with a ___.',
        'Ela está escrevendo com um ___. Qual objeto completa a frase?',
        'pencil',
        'She is writing with a pencil. Ela está escrevendo com um lápis.',
        'Procure o objeto que seguramos para fazer letras no papel.',
        [
          opcao('book', 'book', 'livro'),
          opcao('backpack', 'backpack', 'mochila'),
          opcao('classroom', 'classroom', 'sala de aula'),
          opcao('pencil', 'pencil', 'lápis'),
        ]
      ),
      atividade(
        'v2-protect',
        'Soldiers ___ our country.',
        'Os soldados ___ nosso país. Escolha a ação que completa a frase.',
        'protect',
        'Soldiers protect our country. Os soldados protegem nosso país.',
        'Procure a palavra que significa cuidar da segurança, não uma qualidade ou um dever.',
        [
          opcao('respect', 'respect', 'respeitar'),
          opcao('protect', 'protect', 'proteger'),
          opcao('courage', 'courage', 'coragem'),
          opcao('duty', 'duty', 'dever'),
        ]
      ),
      atividade(
        'v2-parents',
        "In our story, Mia's father and mother are her ___.",
        'Em nossa história inventada, o pai e a mãe de Mia são seus ___.',
        'parents',
        'They are her parents. O pai e a mãe de Mia são os pais dela.',
        'Procure a palavra que reúne pai e mãe, não irmãos ou amigos.',
        [
          opcao('brother', 'brother', 'irmão'),
          opcao('sister', 'sister', 'irmã'),
          opcao('friends', 'friends', 'amigos'),
          opcao('parents', 'parents', 'pais'),
        ]
      ),
      atividade(
        'v2-under',
        'The ball is ___ the playground bench.',
        'A bola está embaixo do banco do parquinho. Qual expressão completa a frase?',
        'under',
        'The ball is under the bench. Under significa embaixo de.',
        'Compare a altura da bola com o assento do banco.',
        [
          opcao('under', 'under', 'embaixo de'),
          opcao('on', 'on', 'em cima de'),
          opcao('in', 'in', 'dentro de'),
          opcao('next-to', 'next to', 'ao lado de'),
        ],
        'ball-under-bench.svg'
      ),
      atividade(
        'v2-on',
        'The mini car is ___ the table.',
        'O carrinho está em cima da mesa. Qual expressão completa a frase?',
        'on',
        'The mini car is on the table. On significa em cima de.',
        'Observe a superfície que sustenta o carrinho.',
        [
          opcao('in-front-of', 'in front of', 'em frente de'),
          opcao('under', 'under', 'embaixo de'),
          opcao('on', 'on', 'em cima de'),
          opcao('in', 'in', 'dentro de'),
        ],
        'car-on-table.svg'
      ),
      atividade(
        'v2-in',
        'The puppy is ___ the toy shop.',
        'O cachorrinho está dentro da loja de brinquedos. Qual palavra completa a frase?',
        'in',
        'The puppy is in the toy shop. In significa dentro de.',
        'Veja se o cachorrinho está fora ou no interior da loja.',
        [
          opcao('next-to', 'next to', 'ao lado de'),
          opcao('in', 'in', 'dentro de'),
          opcao('on', 'on', 'em cima de'),
          opcao('under', 'under', 'embaixo de'),
        ],
        'puppy-in-toy-shop.svg'
      ),
      atividade(
        'v2-next-to',
        'The doll is ___ the teddy bear.',
        'A boneca está ao lado do ursinho. Qual expressão completa a frase?',
        'next-to',
        'The doll is next to the teddy bear. Next to significa ao lado de.',
        'Observe os dois brinquedos lado a lado.',
        [
          opcao('on', 'on', 'em cima de'),
          opcao('in', 'in', 'dentro de'),
          opcao('next-to', 'next to', 'ao lado de'),
          opcao('under', 'under', 'embaixo de'),
        ],
        'doll-next-to-bear.svg'
      ),
      atividade(
        'v2-in-front-of',
        'The robot is ___ the box.',
        'O robô está em frente da caixa. Qual expressão completa a frase?',
        'in-front-of',
        'The robot is in front of the box. In front of significa em frente de.',
        'Observe qual objeto está na frente e cobre parte do outro.',
        [
          opcao('under', 'under', 'embaixo de'),
          opcao('next-to', 'next to', 'ao lado de'),
          opcao('in', 'in', 'dentro de'),
          opcao('in-front-of', 'in front of', 'em frente de'),
        ],
        'robot-in-front-of-box.svg'
      ),
      atividade(
        'v2-am-is-are',
        'Complete: I ___ a student. It ___ a rabbit. They ___ toys. Which sequence is correct?',
        'Complete na ordem: Eu sou estudante. Ele é um coelho. Eles são brinquedos.',
        'am-is-are',
        'I am a student. It is a rabbit. They are toys. Use am com I, is com It e are com They.',
        'Leia uma frase por vez e pense nos pequenos padrões que você praticou.',
        [
          opcao('am-is-are', 'am / is / are', 'na ordem das três frases'),
          opcao('is-am-are', 'is / am / are', 'na ordem das três frases'),
          opcao('am-are-is', 'am / are / is', 'na ordem das três frases'),
          opcao('are-is-am', 'are / is / am', 'na ordem das três frases'),
        ]
      ),
      atividade(
        'v2-has-have',
        'Complete: He ___ a truck. We ___ books. Which sequence is correct?',
        'Complete na ordem: Ele tem um caminhão. Nós temos livros.',
        'has-have',
        'He has a truck. We have books. Pratique os pares: He has... We have...',
        'Lembre-se de como completamos He e We. A mesma palavra não serve nos dois espaços.',
        [
          opcao('has-have', 'has / have', 'na ordem das duas frases'),
          opcao('have-has', 'have / has', 'na ordem das duas frases'),
          opcao('has-has', 'has / has', 'na ordem das duas frases'),
          opcao('have-have', 'have / have', 'na ordem das duas frases'),
        ]
      ),
    ],
  });
})();
