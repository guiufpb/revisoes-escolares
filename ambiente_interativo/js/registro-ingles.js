(function () {
  'use strict';

  var unidades = [
    {
      id: 'at-school-unidade-3',
      versao: 2,
      titulo: 'At School',
      subtitulo: 'English Review – Unit 3',
      perfisDisponiveis: ['alice', 'mariana'],
      grupos: [
        {
          id: 'objetos-escolares',
          titulo: 'School Objects',
          traducao: 'Objetos escolares',
          instrucao:
            'Escolha um objeto escolar. Depois, use os botões para ouvir o nome em inglês na velocidade normal ou devagar.',
          itens: [
            { id: 'pencil', ingles: 'pencil', portugues: 'lápis', imagem: 'pencil.svg' },
            { id: 'book', ingles: 'book', portugues: 'livro', imagem: 'book.svg' },
            { id: 'eraser', ingles: 'eraser', portugues: 'borracha', imagem: 'eraser.svg' },
            { id: 'ruler', ingles: 'ruler', portugues: 'régua', imagem: 'ruler.svg' },
            { id: 'glue', ingles: 'glue', portugues: 'cola', imagem: 'glue.svg' },
            { id: 'scissors', ingles: 'scissors', portugues: 'tesoura', imagem: 'scissors.svg' },
            { id: 'backpack', ingles: 'backpack', portugues: 'mochila', imagem: 'backpack.svg' },
            {
              id: 'pencil-case',
              ingles: 'pencil case',
              portugues: 'estojo',
              imagem: 'pencil-case.svg',
            },
            {
              id: 'calculator',
              ingles: 'calculator',
              portugues: 'calculadora',
              imagem: 'calculator.svg',
            },
            { id: 'clock', ingles: 'clock', portugues: 'relógio', imagem: 'clock.svg' },
          ],
        },
        {
          id: 'pessoas-escola',
          titulo: 'People at School',
          traducao: 'Pessoas da escola',
          instrucao:
            'Escolha uma pessoa da escola e ouça como seu nome é pronunciado em inglês. Repita em voz alta no seu ritmo.',
          itens: [
            {
              id: 'teacher',
              ingles: 'teacher',
              portugues: 'professora ou professor',
              imagem: 'teacher.svg',
            },
            {
              id: 'student',
              ingles: 'student',
              portugues: 'aluna ou aluno',
              imagem: 'student.svg',
            },
            {
              id: 'cleaner',
              ingles: 'cleaner',
              portugues: 'faxineira ou faxineiro',
              imagem: 'cleaner.svg',
            },
            {
              id: 'principal',
              ingles: 'principal',
              portugues: 'diretora ou diretor',
              imagem: 'principal.svg',
            },
            {
              id: 'cook',
              ingles: 'cook',
              portugues: 'cozinheira ou cozinheiro',
              imagem: 'cook.svg',
            },
            {
              id: 'pe-teacher',
              ingles: 'P. E. teacher',
              portugues: 'professora ou professor de educação física',
              imagem: 'coach.svg',
            },
          ],
        },
        {
          id: 'lugares-escola',
          titulo: 'Places at School',
          traducao: 'Lugares da escola',
          instrucao:
            'Escolha um lugar da escola. Escute o nome em inglês e observe a figura e a tradução.',
          itens: [
            {
              id: 'classroom',
              ingles: 'classroom',
              portugues: 'sala de aula',
              imagem: 'classroom.svg',
            },
            { id: 'library', ingles: 'library', portugues: 'biblioteca', imagem: 'library.svg' },
            {
              id: 'cafeteria',
              ingles: 'cafeteria',
              portugues: 'refeitório',
              imagem: 'cafeteria.svg',
            },
            { id: 'gym', ingles: 'gym', portugues: 'quadra ou ginásio', imagem: 'gym.svg' },
            {
              id: 'computer-room',
              ingles: 'computer room',
              portugues: 'sala de informática',
              imagem: 'computer-room.svg',
            },
            {
              id: 'principal-office',
              ingles: "principal's office",
              portugues: 'sala da direção',
              imagem: 'principal-office.svg',
            },
          ],
        },
        {
          id: 'frases-instrucoes',
          titulo: 'Listen and Practice',
          traducao: 'Ouça e pratique',
          instrucao:
            'Escolha uma frase. Ouça em inglês, repita e use a opção devagar quando precisar perceber melhor cada palavra.',
          itens: [
            {
              id: 'this-pencil',
              ingles: 'This is a pencil.',
              portugues: 'Isto é um lápis.',
              imagem: 'pencil.svg',
            },
            {
              id: 'color-book',
              ingles: 'Color the book blue.',
              portugues: 'Pinte o livro de azul.',
              imagem: 'colored-pencils.svg',
            },
            {
              id: 'listen-teacher',
              ingles: 'Listen to the teacher.',
              portugues: 'Escute a professora.',
              imagem: 'teacher.svg',
            },
            {
              id: 'keep-clean',
              ingles: 'Keep the classroom clean.',
              portugues: 'Mantenha a sala de aula limpa.',
              imagem: 'classroom.svg',
            },
            {
              id: 'please-thank-you',
              ingles: 'Say please and thank you.',
              portugues: 'Diga por favor e obrigado.',
              imagem: 'student.svg',
            },
          ],
        },
      ],
      atividades: [
        {
          id: 'identificar-pencil',
          perguntaIngles: 'Which picture shows a pencil?',
          instrucaoPortugues: 'Qual figura mostra um lápis?',
          respostaCorreta: 'pencil',
          explicacao: 'Pencil significa lápis, um objeto usado para escrever e desenhar.',
          alternativas: [
            { id: 'pencil', texto: 'pencil', traducao: 'lápis', imagem: 'pencil.svg' },
            { id: 'book', texto: 'book', traducao: 'livro', imagem: 'book.svg' },
            { id: 'ruler', texto: 'ruler', traducao: 'régua', imagem: 'ruler.svg' },
            { id: 'eraser', texto: 'eraser', traducao: 'borracha', imagem: 'eraser.svg' },
          ],
        },
        {
          id: 'identificar-backpack',
          perguntaIngles: 'Which picture shows a backpack?',
          instrucaoPortugues: 'Qual figura mostra uma mochila?',
          respostaCorreta: 'backpack',
          explicacao: 'Backpack significa mochila, onde levamos os materiais escolares.',
          alternativas: [
            { id: 'backpack', texto: 'backpack', traducao: 'mochila', imagem: 'backpack.svg' },
            {
              id: 'pencil-case',
              texto: 'pencil case',
              traducao: 'estojo',
              imagem: 'pencil-case.svg',
            },
            { id: 'glue', texto: 'glue', traducao: 'cola', imagem: 'glue.svg' },
            { id: 'scissors', texto: 'scissors', traducao: 'tesoura', imagem: 'scissors.svg' },
          ],
        },
        {
          id: 'pessoa-teacher',
          perguntaIngles: 'Who teaches the class?',
          instrucaoPortugues: 'Quem ensina a turma?',
          respostaCorreta: 'teacher',
          explicacao: 'Teacher é a professora ou o professor que ensina a turma.',
          alternativas: [
            {
              id: 'teacher',
              texto: 'teacher',
              traducao: 'professora ou professor',
              imagem: 'teacher.svg',
            },
            { id: 'student', texto: 'student', traducao: 'aluna ou aluno', imagem: 'student.svg' },
            { id: 'cook', texto: 'cook', traducao: 'cozinheira ou cozinheiro', imagem: 'cook.svg' },
            {
              id: 'cleaner',
              texto: 'cleaner',
              traducao: 'faxineira ou faxineiro',
              imagem: 'cleaner.svg',
            },
          ],
        },
        {
          id: 'lugar-library',
          perguntaIngles: 'Where do we read and borrow books?',
          instrucaoPortugues: 'Onde podemos ler e pegar livros emprestados?',
          respostaCorreta: 'library',
          explicacao: 'Library significa biblioteca, o lugar da escola onde encontramos livros.',
          alternativas: [
            { id: 'library', texto: 'library', traducao: 'biblioteca', imagem: 'library.svg' },
            { id: 'gym', texto: 'gym', traducao: 'quadra ou ginásio', imagem: 'gym.svg' },
            {
              id: 'cafeteria',
              texto: 'cafeteria',
              traducao: 'refeitório',
              imagem: 'cafeteria.svg',
            },
            {
              id: 'classroom',
              texto: 'classroom',
              traducao: 'sala de aula',
              imagem: 'classroom.svg',
            },
          ],
        },
        {
          id: 'lugar-computer-room',
          perguntaIngles: 'Where do students use computers?',
          instrucaoPortugues: 'Onde os estudantes usam computadores?',
          respostaCorreta: 'computer-room',
          explicacao:
            'Computer room significa sala de informática, preparada para usar computadores.',
          alternativas: [
            {
              id: 'computer-room',
              texto: 'computer room',
              traducao: 'sala de informática',
              imagem: 'computer-room.svg',
            },
            {
              id: 'principal-office',
              texto: "principal's office",
              traducao: 'sala da direção',
              imagem: 'principal-office.svg',
            },
            { id: 'library', texto: 'library', traducao: 'biblioteca', imagem: 'library.svg' },
            { id: 'gym', texto: 'gym', traducao: 'quadra ou ginásio', imagem: 'gym.svg' },
          ],
        },
        {
          id: 'traducao-glue',
          perguntaIngles: 'Which word means cola?',
          instrucaoPortugues: 'Qual palavra em inglês significa cola?',
          respostaCorreta: 'glue',
          explicacao: 'Glue é a palavra em inglês para cola.',
          alternativas: [
            { id: 'glue', texto: 'glue', traducao: 'cola', imagem: 'glue.svg' },
            { id: 'clock', texto: 'clock', traducao: 'relógio', imagem: 'clock.svg' },
            { id: 'ruler', texto: 'ruler', traducao: 'régua', imagem: 'ruler.svg' },
            { id: 'book', texto: 'book', traducao: 'livro', imagem: 'book.svg' },
          ],
        },
        {
          id: 'contar-pencils',
          perguntaIngles: 'How many pencils can you see?',
          instrucaoPortugues: 'Quantos lápis você consegue ver?',
          imagemEnunciado: 'pencil.svg',
          repeticoesImagem: 4,
          respostaCorreta: 'four',
          explicacao: 'Há quatro lápis. Four significa quatro.',
          alternativas: [
            { id: 'two', texto: '2 · two', traducao: 'dois' },
            { id: 'three', texto: '3 · three', traducao: 'três' },
            { id: 'four', texto: '4 · four', traducao: 'quatro' },
            { id: 'five', texto: '5 · five', traducao: 'cinco' },
          ],
        },
        {
          id: 'material-pencil',
          perguntaIngles: 'What is a pencil mainly made of?',
          instrucaoPortugues: 'De que material um lápis é feito principalmente?',
          imagemEnunciado: 'pencil.svg',
          repeticoesImagem: 1,
          respostaCorreta: 'wood',
          explicacao: 'No caderno, o lápis é associado à madeira. Wood significa madeira.',
          alternativas: [
            { id: 'wood', texto: 'wood', traducao: 'madeira' },
            { id: 'fabric', texto: 'fabric', traducao: 'tecido' },
            { id: 'rubber', texto: 'rubber', traducao: 'borracha' },
            { id: 'plastic', texto: 'plastic', traducao: 'plástico' },
          ],
        },
        {
          id: 'acao-respeito',
          perguntaIngles: 'Which action shows respect at school?',
          instrucaoPortugues: 'Qual atitude demonstra respeito na escola?',
          respostaCorreta: 'listen',
          explicacao: 'Escutar a professora demonstra atenção e respeito às regras da escola.',
          alternativas: [
            { id: 'listen', texto: 'Listen to the teacher.', traducao: 'Escutar a professora.' },
            { id: 'shout', texto: 'Shout in class.', traducao: 'Gritar na sala.' },
            { id: 'fight', texto: 'Fight with a friend.', traducao: 'Brigar com um amigo.' },
            { id: 'throw', texto: 'Throw paper.', traducao: 'Jogar papel.' },
          ],
        },
        {
          id: 'shouldnt-classroom',
          perguntaIngles: "What shouldn't we do in the classroom?",
          instrucaoPortugues: 'O que não devemos fazer na sala de aula?',
          respostaCorreta: 'run',
          explicacao:
            "We shouldn't run in the classroom significa que não devemos correr na sala de aula.",
          alternativas: [
            { id: 'run', texto: 'Run in the classroom.', traducao: 'Correr na sala.' },
            { id: 'clean', texto: 'Keep the classroom clean.', traducao: 'Manter a sala limpa.' },
            {
              id: 'please',
              texto: 'Say please and thank you.',
              traducao: 'Dizer por favor e obrigado.',
            },
            { id: 'listen', texto: 'Listen to the teacher.', traducao: 'Escutar a professora.' },
          ],
        },
      ],
    },
  ];

  function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function registrar(unidade) {
    if (!unidade || !unidade.id) {
      throw new Error('A unidade de Inglês precisa ter um ID.');
    }
    if (
      unidades.some(function (item) {
        return item.id === unidade.id;
      })
    ) {
      throw new Error('A unidade de Inglês “' + unidade.id + '” já foi registrada.');
    }
    unidades.push(copiar(unidade));
  }

  window.RegistroIngles = {
    registrar: registrar,
    listar: function (perfil) {
      return unidades
        .filter(function (unidade) {
          return !perfil || unidade.perfisDisponiveis.indexOf(perfil) >= 0;
        })
        .map(copiar);
    },
    obter: function (id) {
      var unidade = unidades.find(function (item) {
        return item.id === id;
      });
      return unidade ? copiar(unidade) : null;
    },
  };
})();
