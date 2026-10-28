(function () {
  'use strict';

  window.QuestionariosRevisoes.registrar({
    id: 'alice-gramatica-pontuacao-interpretacao-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Gramática',
    titulo: 'Sinais de pontuação e interpretação de texto',
    subtitulo: '30 desafios de pontuação, leitura e ditado — outubro de 2026.',
    chave: 'revisoesEscolares.alice.gramatica.pontuacaoInterpretacaoOutubro2026.v1',
    validacaoEstritaEstado: true,
    layout: {
      desktopAmplo: true,
    },
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice',
          principal: true,
          chaveArmazenamento:
            'revisoesEscolares.alice.gramatica.pontuacaoInterpretacaoOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          principal: false,
          chaveArmazenamento:
            'revisoesEscolares.alice.gramatica.pontuacaoInterpretacaoOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Você praticou pontuação, interpretou A fita da pipa e escreveu palavras e frases ouvidas.',
    questoes: [
      {
        id: 'pontuacao-q1',
        bloco: 'Reconhecimento e função dos sinais',
        titulo: '1. Uma informação terminou',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q1-resposta',
            pergunta: 'Leia: O bebê dormiu. O que o ponto final mostra nessa frase?',
            opcoes: [
              'Que alguém está fazendo uma pergunta.',
              'Que a informação terminou.',
              'Que há itens de uma lista para separar.',
            ],
            respostas: ['Que a informação terminou.'],
          },
        ],
        dica: 'Leia a frase novamente. Ela conta algo, pede uma resposta ou apresenta uma lista?',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'Quando contamos algo, podemos terminar a frase com ponto final. Observe: O passarinho pousou.',
      },
      {
        id: 'pontuacao-q2',
        bloco: 'Reconhecimento e função dos sinais',
        titulo: '2. Uma pergunta de verdade',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q2-resposta',
            pergunta: 'Leia: Você viu meu lápis? Para que essa frase foi usada?',
            opcoes: [
              'Para avisar que o lápis foi encontrado.',
              'Para comemorar a chegada do lápis.',
              'Para pedir uma informação sobre o lápis.',
            ],
            respostas: ['Para pedir uma informação sobre o lápis.'],
          },
        ],
        dica: 'Pense no que a pessoa espera ouvir depois de fazer essa pergunta.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'Usamos o ponto de interrogação quando fazemos uma pergunta. Exemplo: Quem bateu na porta?',
      },
      {
        id: 'pontuacao-q3',
        bloco: 'Reconhecimento e função dos sinais',
        titulo: '3. Uma surpresa boa',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q3-resposta',
            pergunta:
              'Nina ganhou uma visita que desejava muito e disse: Que surpresa boa! O ponto de exclamação ajuda a mostrar:',
            opcoes: [
              'A alegria de Nina.',
              'Uma dúvida de Nina.',
              'Uma informação contada sem emoção.',
            ],
            respostas: ['A alegria de Nina.'],
          },
        ],
        dica: 'Lembre como Nina se sentiu ao receber a visita.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'O ponto de exclamação pode mostrar uma reação forte, como alegria, surpresa ou susto. Exemplo: Que susto!',
      },
      {
        id: 'pontuacao-q4',
        bloco: 'Reconhecimento e função dos sinais',
        titulo: '4. Uma lista de alimentos',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q4-resposta',
            pergunta:
              'Leia: Lia trouxe pão, queijo e leite. Para que serve a vírgula depois de “pão”?',
            opcoes: [
              'Para terminar toda a frase.',
              'Para transformar a frase em pergunta.',
              'Para separar alimentos da lista.',
            ],
            respostas: ['Para separar alimentos da lista.'],
          },
        ],
        dica: 'Observe quantos alimentos Lia trouxe e como eles foram apresentados.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'A vírgula pode separar itens de uma lista. Observe: Guardei cola, tesoura e papel.',
      },
      {
        id: 'pontuacao-q5',
        bloco: 'Reconhecimento e função dos sinais',
        titulo: '5. Uma lista vai começar',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q5-resposta',
            pergunta: 'Leia: Use estes materiais: lápis e papel. O que os dois-pontos anunciam?',
            opcoes: [
              'Uma pergunta sobre os materiais.',
              'A lista dos materiais.',
              'O fim da frase, antes dos materiais.',
            ],
            respostas: ['A lista dos materiais.'],
          },
        ],
        dica: 'Compare o que aparece antes e depois dos dois-pontos.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'Os dois-pontos podem anunciar uma lista. Exemplo: Separei estas roupas: camisa e bermuda.',
      },
      {
        id: 'pontuacao-q6',
        bloco: 'Aplicação da pontuação',
        titulo: '6. Contar algo com calma',
        instrucao:
          'Rui apenas conta uma informação, sem perguntar nem exclamar: O cachorro está no quintal___ Complete com um destes sinais: . ? ! Escreva somente o sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q6-resposta',
            pergunta: 'Sinal para terminar a informação',
            respostas: ['.'],
          },
        ],
        dica: 'Confira a intenção de Rui: contar, perguntar ou exclamar.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q7',
        bloco: 'Aplicação da pontuação',
        titulo: '7. Procurando um lugar',
        instrucao:
          'Eva não sabe onde está o estojo e pergunta: Onde está meu estojo___ Escreva somente o sinal que termina a pergunta.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q7-resposta',
            pergunta: 'Sinal para terminar a pergunta',
            respostas: ['?'],
          },
        ],
        dica: 'Eva já sabe a resposta ou precisa que alguém responda?',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q8',
        bloco: 'Aplicação da pontuação',
        titulo: '8. Hora de comemorar',
        instrucao:
          'A turma ganhou uma brincadeira extra e comemorou com entusiasmo: Oba___ Qual sinal mostra essa comemoração? Escreva somente o sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q8-resposta',
            pergunta: 'Sinal da comemoração',
            respostas: ['!'],
          },
        ],
        dica: 'Pense em como a turma reagiu à notícia.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q9',
        bloco: 'Aplicação da pontuação',
        titulo: '9. Separar sem terminar',
        instrucao:
          'Leia a lista: Na caixa há lápis ___ borracha e cola. Qual sinal deve ocupar o espaço para separar os dois primeiros materiais sem terminar a frase? Escreva somente o sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q9-resposta',
            pergunta: 'Sinal entre lápis e borracha',
            respostas: [','],
          },
        ],
        dica: 'A lista ainda continua depois desse espaço.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q10',
        bloco: 'Aplicação da pontuação',
        titulo: '10. A mesma frase pode perguntar',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q10-resposta',
            pergunta:
              'Caio não sabe se a caixa está no armário. Qual frase ele deve usar para perguntar isso?',
            opcoes: [
              'A caixa está no armário?',
              'A caixa está no armário.',
              'A caixa está no armário!',
            ],
            respostas: ['A caixa está no armário?'],
          },
        ],
        dica: 'Caio precisa receber uma resposta. Qual versão mostra isso?',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q11',
        bloco: 'Aplicação da pontuação',
        titulo: '11. Uma lista bem organizada',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q11-resposta',
            pergunta: 'Qual frase separa corretamente as três frutas da lista?',
            opcoes: [
              'Na sacola há maçã pera e uva.',
              'Na sacola há, maçã pera e uva.',
              'Na sacola há maçã, pera e uva.',
            ],
            respostas: ['Na sacola há maçã, pera e uva.'],
          },
        ],
        dica: 'Localize as três frutas. Confira se o sinal separa uma fruta da seguinte.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q12',
        bloco: 'Aplicação da pontuação',
        titulo: '12. Mostrar alegria por escrito',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q12-resposta',
            pergunta:
              'A chuva passou e a turma poderá brincar no pátio. Qual versão mostra a comemoração da turma?',
            opcoes: ['Que bom?', 'Que bom!', 'Que bom.'],
            respostas: ['Que bom!'],
          },
        ],
        dica: 'A turma está pedindo informação ou reagindo com alegria?',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q13',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '13. O plano dos amigos',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q13-resposta',
            pergunta: 'O que Bia e Davi queriam fazer no começo da história?',
            opcoes: ['Comprar materiais novos.', 'Procurar uma pipa nova.', 'Consertar uma pipa.'],
            respostas: ['Consertar uma pipa.'],
          },
        ],
        dica: 'Volte ao começo e procure o plano dos dois amigos.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q14',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '14. O que desapareceu?',
        instrucao:
          'Escolha uma palavra do banco pipa — fita — cola e complete: Bia foi pegar a ______, mas ela não estava mais na mesa. Escreva somente a palavra escolhida.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q14-resposta',
            pergunta: 'Palavra que completa a frase',
            respostas: ['fita'],
          },
        ],
        dica: 'Procure o trecho que conta o que Bia tentou pegar.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q15',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '15. Antes e depois',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q15-resposta',
            pergunta: 'Qual alternativa respeita a ordem da história?',
            opcoes: [
              'Bia encontrou a fita e, depois, percebeu que ela não estava na mesa.',
              'A rajada de vento passou e, depois, Bia percebeu a falta da fita.',
              'Os amigos foram brincar e, depois, consertaram a pipa.',
            ],
            respostas: ['A rajada de vento passou e, depois, Bia percebeu a falta da fita.'],
          },
        ],
        dica: 'Confira qual dos dois acontecimentos aparece primeiro no texto.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q16',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '16. Uma pista importante',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q16-resposta',
            pergunta: 'Por que a pontinha vermelha fez Bia procurar atrás do vaso?',
            opcoes: [
              'Porque tinha a mesma cor da fita que ela procurava.',
              'Porque tinha a mesma cor do papel separado para a pipa.',
              'Porque Davi tinha contado que a fita estava ali.',
            ],
            respostas: ['Porque tinha a mesma cor da fita que ela procurava.'],
          },
        ],
        dica: 'Compare a descrição dos materiais com a pista que Bia encontrou.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q17',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '17. Uma dúvida no meio da história',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q17-resposta',
            pergunta: 'No trecho Onde estava a fita?, a interrogação ajuda a mostrar:',
            opcoes: [
              'Que a cor da fita mudou.',
              'Que a fita já foi encontrada.',
              'A dúvida sobre o lugar da fita.',
            ],
            respostas: ['A dúvida sobre o lugar da fita.'],
          },
        ],
        dica: 'Nesse momento da história, os amigos já sabem onde procurar?',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q18',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '18. O sentimento do final',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q18-resposta',
            pergunta: 'Por que aparece Que alívio! depois que Bia encontra a fita?',
            opcoes: [
              'Porque a preocupação com a fita terminou.',
              'Porque os amigos ainda não sabem onde a fita está.',
              'Porque a pipa voltou a quebrar.',
            ],
            respostas: ['Porque a preocupação com a fita terminou.'],
          },
        ],
        dica: 'Compare a situação dos amigos antes e depois da descoberta.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q19',
        bloco: 'Interpretação de A fita da pipa',
        titulo: '19. Contar o desfecho',
        instrucao:
          'Complete uma frase que apenas conta como a história terminou, sem pergunta nem exclamação: Os amigos consertaram a pipa e foram brincar___ Escreva somente o sinal final.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q19-resposta',
            pergunta: 'Sinal que encerra o resumo',
            respostas: ['.'],
          },
        ],
        dica: 'Observe como o enunciado pede para contar o final.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'A fita da pipa',
        leitura:
          'Bia e Davi queriam consertar uma pipa. Separaram papel azul, cola e uma fita vermelha. Uma rajada de vento passou. Quando Bia foi pegar a fita, ela não estava mais na mesa. Onde estava a fita? Davi procurou perto da porta. Bia viu uma pontinha vermelha aparecendo atrás de um vaso. Ela foi olhar e encontrou a fita. Que alívio! Os dois consertaram a pipa e foram brincar.',
      },
      {
        id: 'pontuacao-q20',
        bloco: 'Revisão, sentido e pontuação',
        titulo: '20. De informação para pergunta',
        instrucao:
          'Pedro escreveu O almoço está pronto. Agora ele quer perguntar se o almoço está pronto. Qual sinal deve substituir o ponto final? Escreva somente o novo sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q20-resposta',
            pergunta: 'Novo sinal para fazer a pergunta',
            respostas: ['?'],
          },
        ],
        dica: 'Pense no que muda quando Pedro deixa de informar e passa a pedir uma resposta.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q21',
        bloco: 'Revisão, sentido e pontuação',
        titulo: '21. Um alimento com nome comprido',
        instrucao:
          'Bolo de milho é um dos alimentos da lista. Complete: Na mesa há bolo de milho ___ suco e uvas. Qual sinal separa o primeiro alimento do seguinte sem terminar a frase? Escreva somente o sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q21-resposta',
            pergunta: 'Sinal depois de bolo de milho',
            respostas: [','],
          },
        ],
        dica: 'Conte os alimentos da lista, sem separar as palavras que nomeiam o mesmo alimento.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'Um item da lista pode ter mais de uma palavra. Em “Separei lápis de cor, papel e cola”, “lápis de cor” é um único item.',
      },
      {
        id: 'pontuacao-q22',
        bloco: 'Revisão, sentido e pontuação',
        titulo: '22. Contar ou descobrir?',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q22-resposta',
            pergunta:
              'Leia: 1. Você fechou a janela. 2. Você fechou a janela? Qual explicação combina com essas frases?',
            opcoes: [
              'As duas pedem uma resposta sobre a janela.',
              'A primeira apresenta uma informação; a segunda pede uma resposta.',
              'A primeira pede uma resposta; a segunda apresenta uma informação.',
            ],
            respostas: ['A primeira apresenta uma informação; a segunda pede uma resposta.'],
          },
        ],
        dica: 'Observe o que a pessoa espera de quem lê cada frase.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q23',
        bloco: 'Revisão, sentido e pontuação',
        titulo: '23. Preparar e apresentar uma lista',
        instrucao: 'Leia e escolha uma alternativa.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'pontuacao-q23-resposta',
            pergunta: 'Qual versão anuncia a lista e separa corretamente os materiais?',
            opcoes: [
              'Separei estes materiais: régua, caderno e borracha.',
              'Separei estes materiais, régua: caderno e borracha.',
              'Separei estes materiais: régua caderno e borracha.',
            ],
            respostas: ['Separei estes materiais: régua, caderno e borracha.'],
          },
        ],
        dica: 'Confira onde a lista começa e onde termina seu primeiro item.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        leituraTitulo: 'Leia para aprender',
        leitura:
          'Os dois-pontos podem anunciar a lista. A vírgula pode separar seus itens. Exemplo: Levei estes brinquedos: carrinho, boneco e pião.',
      },
      {
        id: 'pontuacao-q24',
        bloco: 'Revisão, sentido e pontuação',
        titulo: '24. A reação ao gol',
        instrucao:
          'A torcida vibrou e comemorou um gol. Para mostrar esse entusiasmo, troque o ponto final de Que gol bonito. por outro sinal. Escreva somente o novo sinal.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q24-resposta',
            pergunta: 'Novo sinal para mostrar o entusiasmo',
            respostas: ['!'],
          },
        ],
        dica: 'A frase deve mostrar como a torcida reagiu, e não apenas contar uma informação.',
        sucesso: 'Você conferiu e concluiu esta questão.',
      },
      {
        id: 'pontuacao-q25',
        bloco: 'Ditados de palavras e frases',
        titulo: '25. Ouvir e escrever uma palavra',
        instrucao:
          'Clique em Ouvir palavra. Escute e escreva somente a palavra ouvida, sem sinal de pontuação. Você pode ouvir novamente.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q25-resposta',
            pergunta: 'Palavra ouvida',
            respostas: ['pano'],
          },
        ],
        dica: 'Ouça novamente. Confira as letras e veja se acrescentou algum sinal sem precisar.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'pontuacao-q26',
        bloco: 'Ditados de palavras e frases',
        titulo: '26. Escrever sem modelo',
        instrucao:
          'Ouça a nova palavra e escreva somente o que ouviu, sem sinal de pontuação. Use Repetir se precisar.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q26-resposta',
            pergunta: 'Palavra ouvida',
            respostas: ['bola'],
          },
        ],
        dica: 'Escute até o fim e confira se todas as letras estão na ordem certa.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'pontuacao-q27',
        bloco: 'Ditados de palavras e frases',
        titulo: '27. Escutar com atenção',
        instrucao:
          'Ouça a palavra inteira. Depois, escreva somente a palavra ouvida, sem sinal de pontuação.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q27-resposta',
            pergunta: 'Palavra ouvida',
            respostas: ['pato'],
          },
        ],
        dica: 'Ouça outra vez e compare o começo e o final do áudio com o que escreveu.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'pontuacao-q28',
        bloco: 'Ditados de palavras e frases',
        titulo: '28. Uma frase que conta algo',
        instrucao:
          'Ouça a frase que conta um acontecimento. Escreva a frase inteira, separe as palavras e termine com ponto final.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q28-resposta',
            pergunta: 'Frase ouvida',
            respostas: ['O gato pulou.'],
          },
        ],
        dica: 'Ouça novamente. Confira se escreveu a frase inteira, na ordem ouvida, e se colocou o sinal pedido.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'pontuacao-q29',
        bloco: 'Ditados de palavras e frases',
        titulo: '29. Uma pergunta ouvida',
        instrucao:
          'Ouça a pergunta. Escreva todas as palavras na ordem ouvida, separadas por espaços, e termine com ponto de interrogação.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q29-resposta',
            pergunta: 'Pergunta ouvida',
            respostas: ['Onde fica o lago?'],
          },
        ],
        dica: 'Repita o áudio. Veja se alguma palavra ficou faltando e confira o sinal que termina a pergunta.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'pontuacao-q30',
        bloco: 'Ditados de palavras e frases',
        titulo: '30. Uma comemoração ouvida',
        instrucao:
          'Ouça a frase de comemoração. Escreva a frase inteira, separe as palavras e termine com ponto de exclamação.',
        tipo: 'campos',
        itens: [
          {
            id: 'pontuacao-q30-resposta',
            pergunta: 'Frase de comemoração ouvida',
            respostas: ['Viva o jogo!'],
          },
        ],
        dica: 'Ouça novamente. Confira as palavras e o sinal pedido para a comemoração.',
        sucesso: 'Você conferiu e concluiu esta questão.',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
    ],
  });
})();
