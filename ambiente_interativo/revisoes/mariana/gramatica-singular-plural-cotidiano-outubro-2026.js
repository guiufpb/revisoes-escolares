(function () {
  'use strict';
  window.QuestionariosRevisoes.registrar({
    id: 'mariana-gramatica-singular-plural-cotidiano-outubro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Gramática',
    titulo: 'Singular e plural no cotidiano',
    subtitulo: 'Reconheça, transforme e complete palavras do dia a dia.',
    chave: 'revisoesEscolares.mariana.gramatica.singularPluralCotidianoOutubro2026.v1',
    validacaoEstritaEstado: true,
    resumoFinal: 'Você reconheceu o singular e o plural e usou palavras em situações do cotidiano.',
    questoes: [
      {
        id: 'cotidiano-q1',
        bloco: 'Reconhecer o plural',
        titulo: 'Palavras que indicam mais de um',
        instrucao: 'Escolha a palavra que está no plural.',
        tipo: 'opcoes',
        dica: 'O plural indica mais de um. Observe o final das palavras.',
        sucesso: 'Cadernos indica mais de um caderno.',
        leituraTitulo: 'Um ou mais de um?',
        leitura:
          'Singular indica um só: gato, mesa. Plural indica mais de um: gatos, mesas. Nessas palavras, acrescentamos s para formar o plural. Para voltar ao singular, retiramos esse s. Observe a quantidade antes de responder.',
        itens: [
          {
            id: 'cotidiano-q1-item',
            pergunta: 'Qual palavra indica mais de um objeto?',
            opcoes: ['caderno', 'cadernos', 'mochila'],
            respostas: ['cadernos'],
          },
        ],
      },
      {
        id: 'cotidiano-q2',
        bloco: 'Transformar para o plural',
        titulo: 'Patos no lago',
        instrucao: 'Escolha o plural de pato.',
        tipo: 'opcoes',
        dica: 'Para indicar vários, pense no que muda no final de pato.',
        sucesso: 'O plural de pato é patos.',
        itens: [
          {
            id: 'cotidiano-q2-item',
            pergunta: 'Um pato entrou no lago. Agora há vários. Qual palavra usamos?',
            opcoes: ['patos', 'pato', 'pata'],
            respostas: ['patos'],
          },
        ],
      },
      {
        id: 'cotidiano-q3',
        bloco: 'Reconhecer o singular',
        titulo: 'Um sapato',
        instrucao: 'Escolha o singular de sapatos.',
        tipo: 'opcoes',
        dica: 'Singular indica um só. Compare os finais.',
        sucesso: 'Sapato indica apenas um.',
        itens: [
          {
            id: 'cotidiano-q3-item',
            pergunta: 'Como escrevemos sapatos quando falamos de apenas um?',
            opcoes: ['sapatos', 'sapatas', 'sapato'],
            respostas: ['sapato'],
          },
        ],
      },
      {
        id: 'cotidiano-q4',
        bloco: 'Combinar palavra e quantidade',
        titulo: 'Na prateleira',
        instrucao: 'Complete a frase escolhendo uma opção.',
        tipo: 'opcoes',
        dica: 'Três indica mais de um. A palavra também precisa indicar essa quantidade.',
        sucesso: 'Três livros: a quantidade e a palavra combinam.',
        itens: [
          {
            id: 'cotidiano-q4-item',
            pergunta: 'Na prateleira há três...',
            opcoes: ['livro', 'livros', 'livrinho'],
            respostas: ['livros'],
          },
        ],
      },
      {
        id: 'cotidiano-q5',
        bloco: 'Escrever o plural',
        titulo: 'Casas na rua',
        instrucao: 'Escreva o plural da palavra casa.',
        tipo: 'campos',
        dica: 'Para falar de várias, acrescente s ao final da palavra.',
        sucesso: 'Casa no singular; casas no plural.',
        itens: [
          {
            id: 'cotidiano-q5-item',
            pergunta: 'Uma casa. Várias ____.',
            respostas: ['casas'],
          },
        ],
      },
      {
        id: 'cotidiano-q6',
        bloco: 'Escrever o singular',
        titulo: 'Uma bola',
        instrucao: 'Escreva o singular da palavra bolas.',
        tipo: 'campos',
        dica: 'Para falar de uma só, retire o s final.',
        sucesso: 'Bolas no plural; bola no singular.',
        itens: [
          {
            id: 'cotidiano-q6-item',
            pergunta: 'Várias bolas. Uma ____.',
            respostas: ['bola'],
          },
        ],
      },
      {
        id: 'cotidiano-q7',
        bloco: 'Usar o plural na frase',
        titulo: 'Copos na mesa',
        instrucao: 'Use a palavra copo no plural para completar a frase.',
        tipo: 'campos',
        dica: 'Quatro indica mais de um. Transforme copo em plural.',
        sucesso: 'Quatro copos: a palavra está no plural.',
        itens: [
          {
            id: 'cotidiano-q7-item',
            pergunta: 'Na mesa há quatro ____ para o suco.',
            respostas: ['copos'],
          },
        ],
      },
      {
        id: 'cotidiano-q8',
        bloco: 'Usar o plural no cotidiano',
        titulo: 'Pastas na mochila',
        instrucao: 'Use a palavra pasta na forma que combina com duas.',
        tipo: 'campos',
        dica: 'Duas indica mais de uma. Pense no final de pasta.',
        sucesso: 'Duas pastas: você usou o plural.',
        itens: [
          {
            id: 'cotidiano-q8-item',
            pergunta: 'Na mochila há duas ____.',
            respostas: ['pastas'],
          },
        ],
      },
    ],
  });
})();
