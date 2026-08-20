(function () {
  'use strict';

  var REVISAO_ID = 'alice-ingles-at-the-farm-unidade-5';

  function item(id, ingles, portugues, imagem) {
    return { id: id, ingles: ingles, portugues: portugues, imagem: imagem };
  }

  function opcao(id, texto, traducao, imagem) {
    var valor = { id: id, texto: texto, traducao: traducao };
    if (imagem) valor.imagem = imagem;
    return valor;
  }

  window.ConfiguracoesIngles = window.ConfiguracoesIngles || {};
  window.ConfiguracoesIngles.aliceAtTheFarm = {
    perfil: 'alice',
    revisaoId: REVISAO_ID,
    unidadeId: 'at-the-farm-unidade-5',
    chaveArmazenamento: 'revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1',
  };

  window.RegistroIngles.registrar({
    id: 'at-the-farm-unidade-5',
    versao: 1,
    titulo: 'At the Farm',
    subtitulo: 'English Review - Unit 5',
    descricao:
      'Primeiro, ouça as palavras principais do caderno. Depois, pratique animais, filhotes, cuidados, habitats e sons.',
    imagemCabecalho: 'farm.svg',
    perfisDisponiveis: ['alice'],
    correcaoPorQuestao: true,
    mensagemAtividades:
      'Muito bem! Agora use o que você ouviu para reconhecer os animais, seus filhotes, necessidades, alimentos, habitats e sons.',
    mensagemFinal:
      'Alice, você conheceu os animais da fazenda, seus filhotes, os cuidados de que precisam e os sons que fazem. Great job!',
    grupos: [
      {
        id: 'animais-fazenda',
        titulo: 'Farm Animals',
        traducao: 'Animais da fazenda',
        instrucao:
          'Clique em cada animal para ouvir o nome em inglês. Use a opção devagar quando quiser repetir com mais calma.',
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
          'Clique nas palavras e expressões para ouvir como falamos sobre filhotes e grupos de animais.',
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
          'Clique em cada palavra ou ação para ouvir o que os animais precisam e o que fazemos para cuidar deles.',
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
          'Clique nos lugares e nos sons para ouvir onde os animais vivem e como representamos seus sons em inglês.',
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
    ],
    atividades: [
      {
        id: 'nome-porco',
        perguntaIngles: 'Which animal is a pig?',
        instrucaoPortugues: 'Qual animal é o porco?',
        respostaCorreta: 'pig',
        explicacao: 'Pig significa porco.',
        feedbackErro: 'Observe as figuras e procure o animal chamado pig.',
        alternativas: [
          opcao('pig', 'pig', 'porco', 'pig.svg'),
          opcao('sheep', 'sheep', 'ovelha', 'sheep.svg'),
          opcao('goat', 'goat', 'cabra', 'goat.svg'),
          opcao('duck', 'duck', 'pato', 'duck.svg'),
        ],
      },
      {
        id: 'nome-cabra',
        perguntaIngles: 'Which animal is a goat?',
        instrucaoPortugues: 'Qual animal é a cabra?',
        respostaCorreta: 'goat',
        explicacao: 'Goat significa cabra.',
        feedbackErro: 'Procure o animal de quatro patas chamado goat.',
        alternativas: [
          opcao('horse', 'horse', 'cavalo', 'horse.svg'),
          opcao('cow', 'cow', 'vaca', 'cow.svg'),
          opcao('goat', 'goat', 'cabra', 'goat.svg'),
          opcao('dog', 'dog', 'cachorro', 'dog.svg'),
        ],
      },
      {
        id: 'filhote-porco',
        perguntaIngles: 'What is a baby pig called?',
        instrucaoPortugues: 'Como se chama o filhote do porco?',
        respostaCorreta: 'piglet',
        explicacao: 'A baby pig is a piglet. Piglet significa leitão.',
        feedbackErro: 'Lembre-se da palavra usada para o filhote do pig.',
        alternativas: [
          opcao('calf', 'calf', 'bezerro'),
          opcao('lamb', 'lamb', 'cordeiro'),
          opcao('piglet', 'piglet', 'leitão'),
          opcao('chick', 'chick', 'pintinho'),
        ],
      },
      {
        id: 'filhote-vaca',
        perguntaIngles: 'What is a baby cow called?',
        instrucaoPortugues: 'Como se chama o filhote da vaca?',
        respostaCorreta: 'calf',
        explicacao: 'A baby cow is a calf. Calf significa bezerro.',
        feedbackErro: 'Procure a palavra usada para o filhote da cow.',
        alternativas: [
          opcao('duckling', 'duckling', 'patinho'),
          opcao('piglet', 'piglet', 'leitão'),
          opcao('calf', 'calf', 'bezerro'),
          opcao('lamb', 'lamb', 'cordeiro'),
        ],
      },
      {
        id: 'classificar-pato',
        perguntaIngles: 'A duck belongs to which group?',
        instrucaoPortugues: 'A qual grupo pertence o pato?',
        respostaCorreta: 'birds',
        explicacao: 'A duck is a bird. O pato pertence ao grupo das aves.',
        feedbackErro: 'Pense se o pato é uma ave ou um mamífero.',
        alternativas: [
          opcao('birds', 'birds', 'aves'),
          opcao('mammals', 'mammals', 'mamíferos'),
          opcao('fish', 'fish', 'peixes'),
          opcao('baby-animals', 'baby animals', 'filhotes'),
        ],
      },
      {
        id: 'classificar-cavalo',
        perguntaIngles: 'A horse belongs to which group?',
        instrucaoPortugues: 'A qual grupo pertence o cavalo?',
        respostaCorreta: 'mammals',
        explicacao: 'A horse is a mammal. O cavalo pertence ao grupo dos mamíferos.',
        feedbackErro: 'O cavalo tem quatro patas e mama quando é filhote.',
        alternativas: [
          opcao('birds', 'birds', 'aves'),
          opcao('mammals', 'mammals', 'mamíferos'),
          opcao('fish', 'fish', 'peixes'),
          opcao('chicks', 'chicks', 'pintinhos'),
        ],
      },
      {
        id: 'contar-ovelhas',
        perguntaIngles: 'How many sheep can you see?',
        instrucaoPortugues: 'Quantas ovelhas você consegue ver?',
        imagemEnunciado: 'sheep.svg',
        repeticoesImagem: 4,
        respostaCorreta: 'four',
        explicacao: 'There are four sheep. Há quatro ovelhas.',
        feedbackErro: 'Conte novamente cada ovelha da figura.',
        alternativas: [
          opcao('two', '2 · two', 'dois'),
          opcao('three', '3 · three', 'três'),
          opcao('four', '4 · four', 'quatro'),
          opcao('five', '5 · five', 'cinco'),
        ],
      },
      {
        id: 'frase-favorito',
        perguntaIngles: 'What is your favourite farm animal?',
        instrucaoPortugues: 'O que essa pergunta quer saber?',
        respostaCorreta: 'favorite',
        explicacao: 'A pergunta quer saber qual é o seu animal da fazenda favorito.',
        feedbackErro: 'Observe a expressão favourite farm animal.',
        alternativas: [
          opcao('favorite', 'My favourite farm animal.', 'Meu animal da fazenda favorito.'),
          opcao('count', 'How many animals?', 'Quantos animais?'),
          opcao('food', 'What do horses eat?', 'O que os cavalos comem?'),
          opcao('home', 'Where do animals live?', 'Onde os animais vivem?'),
        ],
      },
      {
        id: 'comida-cavalo',
        perguntaIngles: 'What can a horse eat?',
        instrucaoPortugues: 'O que um cavalo pode comer?',
        respostaCorreta: 'grass',
        explicacao: 'A horse can eat grass. Um cavalo pode comer grama.',
        feedbackErro: 'Escolha um alimento adequado para o cavalo.',
        alternativas: [
          opcao('grass', 'grass', 'grama', 'grass.svg'),
          opcao('pizza', 'pizza', 'pizza'),
          opcao('cookies', 'cookies', 'biscoitos'),
          opcao('chocolate', 'chocolate', 'chocolate'),
        ],
      },
      {
        id: 'nao-come-cavalo',
        perguntaIngles: "What doesn't a horse eat?",
        instrucaoPortugues: 'O que um cavalo não come?',
        respostaCorreta: 'pizza',
        explicacao: "A horse doesn't eat pizza. Cavalos não comem pizza.",
        feedbackErro: 'Compare comida de pessoas com alimentos próprios para cavalos.',
        alternativas: [
          opcao('hay', 'hay', 'feno'),
          opcao('grass', 'grass', 'grama'),
          opcao('carrots', 'carrots', 'cenouras'),
          opcao('pizza', 'pizza', 'pizza'),
        ],
      },
      {
        id: 'habitat-peixe',
        perguntaIngles: 'Where can a pet fish live?',
        instrucaoPortugues: 'Onde um peixe de estimação pode viver?',
        respostaCorreta: 'aquarium',
        explicacao: 'A pet fish can live in an aquarium.',
        feedbackErro: 'Procure um lugar cheio de água preparado para peixes.',
        alternativas: [
          opcao('aquarium', 'aquarium', 'aquário', 'aquarium.svg'),
          opcao('farm', 'farm', 'fazenda', 'farm.svg'),
          opcao('city', 'city', 'cidade', 'city.svg'),
          opcao('home', 'home', 'casa', 'home.svg'),
        ],
      },
      {
        id: 'habitat-ovelha',
        perguntaIngles: 'Where does a sheep live?',
        instrucaoPortugues: 'Onde vive uma ovelha?',
        respostaCorreta: 'farm',
        explicacao: 'A sheep lives on a farm. A ovelha vive em uma fazenda.',
        feedbackErro: 'Pense no lugar onde encontramos animais como vacas, cavalos e ovelhas.',
        alternativas: [
          opcao('farm', 'farm', 'fazenda', 'farm.svg'),
          opcao('aquarium', 'aquarium', 'aquário', 'aquarium.svg'),
          opcao('pond', 'pond', 'lagoa', 'pond.svg'),
          opcao('city', 'city', 'cidade', 'city.svg'),
        ],
      },
      {
        id: 'necessidade-cachorro',
        perguntaIngles: 'What does a dog need every day?',
        instrucaoPortugues: 'Do que um cachorro precisa todos os dias?',
        respostaCorreta: 'food-water',
        explicacao: 'A dog needs food and water every day.',
        feedbackErro: 'Pense nas necessidades básicas de todos os animais.',
        alternativas: [
          opcao('food-water', 'food and water', 'comida e água'),
          opcao('toys-only', 'only toys', 'somente brinquedos'),
          opcao('chocolate', 'chocolate', 'chocolate'),
          opcao('television', 'television', 'televisão'),
        ],
      },
      {
        id: 'cuidado-cavalo',
        perguntaIngles: 'Which action helps care for a horse?',
        instrucaoPortugues: 'Qual ação ajuda a cuidar de um cavalo?',
        respostaCorreta: 'brush-horse',
        explicacao: 'Brush the horse significa escovar o cavalo.',
        feedbackErro: 'Procure uma ação cuidadosa feita com uma escova.',
        alternativas: [
          opcao('brush-horse', 'brush the horse', 'escovar o cavalo'),
          opcao('shout', 'shout at the horse', 'gritar com o cavalo'),
          opcao('no-water', 'give no water', 'não dar água'),
          opcao('chocolate', 'give chocolate', 'dar chocolate'),
        ],
      },
      {
        id: 'som-vaca',
        perguntaIngles: 'Which sound does a cow make?',
        instrucaoPortugues: 'Qual som a vaca faz?',
        respostaCorreta: 'moo',
        explicacao: 'A cow goes moo. Em inglês, representamos o som da vaca com moo.',
        feedbackErro: 'Lembre-se do som associado à cow.',
        alternativas: [
          opcao('woof', 'woof', 'som do cachorro'),
          opcao('moo', 'moo', 'som da vaca'),
          opcao('cluck', 'cluck', 'som da galinha'),
          opcao('oink', 'oink', 'som do porco'),
        ],
      },
      {
        id: 'som-porco',
        perguntaIngles: 'Which sound does a pig make?',
        instrucaoPortugues: 'Qual som o porco faz?',
        respostaCorreta: 'oink',
        explicacao: 'A pig goes oink. Em inglês, representamos o som do porco com oink.',
        feedbackErro: 'Lembre-se do som associado ao pig.',
        alternativas: [
          opcao('moo', 'moo', 'som da vaca'),
          opcao('cluck', 'cluck', 'som da galinha'),
          opcao('oink', 'oink', 'som do porco'),
          opcao('woof', 'woof', 'som do cachorro'),
        ],
      },
    ],
  });
})();
