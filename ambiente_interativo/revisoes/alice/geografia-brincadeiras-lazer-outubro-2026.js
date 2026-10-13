(function () {
  'use strict';

  // Conteúdo editorial aprovado. Ordem fixa; um ponto por questão.
  // Q14 usa um subitem de ordenação no tipo misto existente: três cartões, um subitem.
  window.QuestionariosRevisoes.registrar({
    id: 'alice-geografia-brincadeiras-lazer-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Geografia',
    titulo: 'Brincar, conviver e descobrir lugares',
    subtitulo: 'Passado e presente, brinquedos, lugares, lazer e convivência',
    chave: 'revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.v1',
    layout: {
      desktopAmplo: true,
    },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice',
          principal: true,
          chaveArmazenamento: 'revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Alice, você descobriu mudanças e continuidades nas brincadeiras, observou materiais e lugares e pensou em como brincar com cuidado e respeito. Cada nova situação é uma chance de usar o que aprendeu! Se quiser, converse sem valer pontos: qual brincadeira gostaria de aprender com alguém da família ou convivência? Qual lugar combina com ela? Que cuidado seria importante? Você consegue explicar uma brincadeira que continuou, escolher um lugar adequado e pensar numa atitude para incluir e cuidar? Pode pedir para rever algum exemplo.',
    questoes: [
      {
        id: 'geografia-brincadeiras-lazer-q01',
        bloco: 'Geografia · Bloco 1 de 6 · O que mudou e o que continua?',
        titulo: '1. O objeto e a brincadeira',
        instrucao: 'Escolha o objeto usado em cada brincadeira.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '1A — Chutar para o gol.',
            opcoes: ['Corda', 'Bola', 'Pipa'],
            respostas: ['Bola'],
            id: 'geografia-brincadeiras-lazer-q01-a',
          },
          {
            pergunta: '1B — Pular o objeto que duas pessoas estão girando.',
            opcoes: ['Corda', 'Pipa', 'Bola'],
            respostas: ['Corda'],
            id: 'geografia-brincadeiras-lazer-q01-b',
          },
          {
            pergunta: '1C — Manter o brinquedo no ar, preso a uma linha.',
            opcoes: ['Bola', 'Corda', 'Pipa'],
            respostas: ['Pipa'],
            id: 'geografia-brincadeiras-lazer-q01-c',
          },
        ],
        dica: 'Observe o que a criança usa para realizar cada ação.',
        sucesso:
          'Bola, corda e pipa são objetos. Chutar, pular corda e empinar pipa são maneiras de brincar.',
        leitura:
          'Um brinquedo é um objeto que podemos usar para brincar. A brincadeira é o que fazemos. Uma peteca é um objeto; bater a peteca para o colega é uma ação. Também podemos brincar sem brinquedo, como no pega-pega. Crianças e adultos podem conhecer e ensinar brincadeiras.\n\nObserve: Três quadros mostram uma criança chutando uma bola; duas crianças pulando uma corda; e uma criança mantendo uma pipa no ar, num lugar aberto e acompanhada de um adulto.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/objetos-acoes.svg',
        descricaoIlustracao:
          'Três quadros: uma criança chuta uma bola para o gol; duas pessoas giram uma corda para duas crianças pularem; uma criança conduz uma pipa pela linha em área aberta, com adulto.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q02',
        bloco: 'Geografia · Bloco 1 de 6 · O que mudou e o que continua?',
        titulo: '2. Duas cenas, dois tempos',
        instrucao: 'Compare as duas cenas.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '2A — Qual objeto aparece somente na cena do presente?',
            opcoes: ['Pião', 'Desenho de amarelinha', 'Tablet'],
            respostas: ['Tablet'],
            id: 'geografia-brincadeiras-lazer-q02-a',
          },
          {
            pergunta: '2B — Qual brinquedo aparece nas duas cenas?',
            opcoes: ['Pião', 'Tablet', 'Corda'],
            respostas: ['Pião'],
            id: 'geografia-brincadeiras-lazer-q02-b',
          },
        ],
        dica: 'Compare os objetos dos dois quadros, um de cada vez.',
        sucesso:
          'O pião aparece nos dois tempos. O tablet aparece na cena atual. Brincadeiras conhecidas há muito tempo podem continuar.',
        leitura:
          'Uma cena pode contar sobre outro tempo. Para comparar passado e presente, observe o que foi informado. Um brinquedo conhecido há muitos anos também pode aparecer hoje.\n\nObserve: Cena "Passado": Rosa, quando era criança, brinca com um pião e desenha amarelinha. Cena "Presente": sua neta Mila brinca com um pião e usa um jogo no tablet.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/dois-tempos.svg',
        descricaoIlustracao:
          'Passado: Rosa criança com pião e amarelinha. Presente: Mila com pião e tablet. Não há corda nem tablet no quadro do passado.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q03',
        bloco: 'Geografia · Bloco 1 de 6 · O que mudou e o que continua?',
        titulo: '3. O que os relatos contam?',
        instrucao:
          'Em quais relatos cada exemplo aparece? Use as mesmas opções em todas as linhas: A) Só no relato de hoje. B) Só no relato da infância de Rosa. C) Nos dois relatos.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '3A — Brincar de bola.',
            opcoes: [
              'Só no relato de hoje',
              'Só no relato da infância de Rosa',
              'Nos dois relatos',
            ],
            respostas: ['Só no relato da infância de Rosa'],
            id: 'geografia-brincadeiras-lazer-q03-a',
          },
          {
            pergunta: '3B — Pular corda.',
            opcoes: [
              'Só no relato de hoje',
              'Só no relato da infância de Rosa',
              'Nos dois relatos',
            ],
            respostas: ['Nos dois relatos'],
            id: 'geografia-brincadeiras-lazer-q03-b',
          },
          {
            pergunta: '3C — Brincar com um jogo eletrônico.',
            opcoes: [
              'Só no relato de hoje',
              'Só no relato da infância de Rosa',
              'Nos dois relatos',
            ],
            respostas: ['Só no relato de hoje'],
            id: 'geografia-brincadeiras-lazer-q03-c',
          },
        ],
        dica: 'Procure cada brincadeira nos dois relatos. Ela pode aparecer em um ou em ambos.',
        sucesso:
          'A corda aparece nos dois relatos. Isso não quer dizer que hoje ninguém brinca de bola: estamos comparando o que essas pessoas contaram.',
        leitura:
          'Um relato conta o que alguém viveu. Quando uma brincadeira aparece em dois relatos de tempos diferentes, temos uma pista de que ela continuou. Aqui, vamos comparar apenas os exemplos contados.\n\nRelato de Rosa sobre sua infância: "Eu brincava de bola e pulava corda."\n\nRelato de Mila sobre hoje: "Eu pulo corda e brinco com um jogo eletrônico."',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q04',
        bloco: 'Geografia · Bloco 1 de 6 · O que mudou e o que continua?',
        titulo: '4. Uma novidade e uma continuidade',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '4A — Marque as duas frases que combinam com esse relato.',
            opcoes: [
              'Pular corda aparece nos dois tempos',
              'Rui usava o jogo eletrônico citado no relato',
              'O jogo eletrônico aparece no relato de Eva',
              'Eva deixou de pular corda',
            ],
            respostas: [
              'Pular corda aparece nos dois tempos',
              'O jogo eletrônico aparece no relato de Eva',
            ],
            id: 'geografia-brincadeiras-lazer-q04-a',
          },
        ],
        dica: 'Há uma ação que continuou e um recurso que aparece no relato atual.',
        sucesso:
          'Nesse relato, pular corda continuou. O jogo eletrônico aparece como outra possibilidade de brincar no presente.',
        leitura:
          'Uma novidade pode surgir sem apagar outras brincadeiras. Mudar é passar a fazer algo diferente. Continuar é manter uma prática ao longo do tempo.\n\nContexto: Quando era pequeno, Rui pulava corda. Hoje, sua filha Eva pula corda e também brinca com um jogo eletrônico.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q05',
        bloco: 'Geografia · Bloco 1 de 6 · O que mudou e o que continua?',
        titulo: '5. Vamos conferir as ideias',
        instrucao: 'Marque Verdadeiro ou Falso em cada frase.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '5A — Uma brincadeira pode existir no passado e no presente.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
            id: 'geografia-brincadeiras-lazer-q05-a',
          },
          {
            pergunta: '5B — Duas crianças da mesma idade podem gostar de brincadeiras diferentes.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
            id: 'geografia-brincadeiras-lazer-q05-b',
          },
          {
            pergunta: '5C — Um brinquedo conhecido há muito tempo só pode ser usado por adultos.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
            id: 'geografia-brincadeiras-lazer-q05-c',
          },
        ],
        dica: 'Pense se o tempo e a idade obrigam todas as pessoas a brincar do mesmo jeito.',
        sucesso:
          'Brincadeiras podem atravessar gerações. Crianças da mesma idade também podem ter gostos diferentes.',
        leitura:
          'Pessoas diferentes podem escolher brincadeiras diferentes. Uma brincadeira não precisa desaparecer só porque ficou conhecida há muito tempo. Podemos aprender com outras pessoas e também descobrir novidades.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q06',
        bloco: 'Geografia · Bloco 2 de 6 · De que e de como se brinca?',
        titulo: '6. O que precisamos para brincar?',
        instrucao: 'Escolha o que é necessário em cada exemplo.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '6A — Formar uma roda dando as mãos.',
            opcoes: ['Uma linha e uma pipa', 'Peças de um quebra-cabeça', 'Um grupo de pessoas'],
            respostas: ['Um grupo de pessoas'],
            id: 'geografia-brincadeiras-lazer-q06-a',
          },
          {
            pergunta: '6B — Montar uma figura juntando suas partes.',
            opcoes: ['Peças de um quebra-cabeça', 'Um grupo em roda', 'Uma bola e uma trave'],
            respostas: ['Peças de um quebra-cabeça'],
            id: 'geografia-brincadeiras-lazer-q06-b',
          },
          {
            pergunta: '6C — Brincar de empinar pipa.',
            opcoes: ['Um tabuleiro e dados', 'Uma pipa e uma linha apropriada', 'Peças de encaixe'],
            respostas: ['Uma pipa e uma linha apropriada'],
            id: 'geografia-brincadeiras-lazer-q06-c',
          },
        ],
        dica: 'Pense na ação de cada brincadeira e no recurso que permite realizá-la.',
        sucesso:
          'Há brincadeiras com objetos e brincadeiras que dependem de um grupo. Brincar também envolve combinar como participar.',
        leitura:
          'Algumas brincadeiras usam objetos; outras precisam principalmente de pessoas e espaço. Para brincar de roda, um grupo combina como participar. Para uma brincadeira com brinquedo, é preciso observar o que será usado. Não existe um único brinquedo para todas as brincadeiras, nem todas precisam de brinquedos comprados.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q07',
        bloco: 'Geografia · Bloco 2 de 6 · De que e de como se brinca?',
        titulo: '7. Os materiais dos brinquedos',
        instrucao: 'Escolha o material principal de cada brinquedo destas fichas.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '7A — Pião.',
            opcoes: ['Tecido', 'Madeira', 'Plástico'],
            respostas: ['Madeira'],
            id: 'geografia-brincadeiras-lazer-q07-a',
          },
          {
            pergunta: '7B — Baldinho.',
            opcoes: ['Madeira', 'Tecido', 'Plástico'],
            respostas: ['Plástico'],
            id: 'geografia-brincadeiras-lazer-q07-b',
          },
          {
            pergunta: '7C — Boneca costurada.',
            opcoes: ['Tecido', 'Plástico', 'Madeira'],
            respostas: ['Tecido'],
            id: 'geografia-brincadeiras-lazer-q07-c',
          },
        ],
        dica: 'Consulte como cada objeto foi produzido. Responda sobre estes exemplos.',
        sucesso:
          'Neste conjunto, o pião é de madeira, o baldinho é de plástico e a boneca é de tecido. Outros brinquedos podem usar outros materiais.',
        leitura:
          'Um mesmo tipo de brinquedo pode ser feito de materiais diferentes. Para saber o material de um exemplo, podemos consultar sua ficha. A cor, sozinha, nem sempre conta de que ele é feito.\n\nFichas: O pião deste conjunto foi entalhado em madeira. O baldinho foi moldado em plástico. A boneca foi costurada com tecido e recebeu um enchimento macio.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/materiais.svg',
        descricaoIlustracao:
          'Fichas do conjunto: pião entalhado em madeira, baldinho moldado em plástico e boneca costurada com tecido e enchimento macio.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q08',
        bloco: 'Geografia · Bloco 2 de 6 · De que e de como se brinca?',
        titulo: '8. A pipa e o vento',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '8A — O que ajuda a manter a pipa no ar?',
            opcoes: ['Apenas a cor do papel', 'Apenas o nó da linha', 'O vento que movimenta o ar'],
            respostas: ['O vento que movimenta o ar'],
            id: 'geografia-brincadeiras-lazer-q08-a',
          },
        ],
        dica: 'Observe o que também faz a fita se movimentar.',
        sucesso: 'O vento participa do voo da pipa. A cor do papel não é o que a mantém no alto.',
        leitura:
          'O vento é o ar em movimento. Ele participa da brincadeira de empinar pipa, ajudando a mantê-la no alto. A linha permite conduzir a pipa, com cuidado e em local adequado.\n\nContexto: Uma pipa está no alto, presa à linha. Uma fita próxima se move com o vento.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/pipa-vento.svg',
        descricaoIlustracao:
          'Pipa presa à linha no alto, criança e adulto numa área aberta. Uma fita próxima está estendida e ondulada pelo vento.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q09',
        bloco: 'Geografia · Bloco 2 de 6 · De que e de como se brinca?',
        titulo: '9. Um saber do povo Karajá',
        instrucao: 'Complete usando o banco.',
        tipo: 'campos',
        itens: [
          {
            pergunta: '9A — Para modelar os licocós da oficina, a artesã usará…',
            respostas: ['barro'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q09-a',
          },
          {
            pergunta: '9B — Esses bonecos fazem parte de um saber do povo…',
            respostas: ['Karajá'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q09-b',
          },
        ],
        dica: 'Separe a palavra que nomeia um material da palavra que nomeia um povo.',
        sucesso:
          'Conhecer os licocós ajuda a perceber que brinquedos também podem transmitir saberes culturais. Há muitos povos indígenas e muitos modos de brincar.',
        leitura:
          'Os licocós são bonecos de barro ligados à cultura do povo Karajá, um povo indígena brasileiro. Podem representar pessoas e situações da vida. Povos indígenas vivem no presente e têm saberes e brincadeiras diversos.\n\nContexto: Numa oficina imaginada, uma artesã Karajá vai modelar licocós e contar sobre esse saber.\n\nBanco: plástico — Karajá — barro — vidro.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q10',
        bloco: 'Geografia · Bloco 2 de 6 · De que e de como se brinca?',
        titulo: '10. Ouvir nomes de brinquedos',
        instrucao:
          'Toque em Ouvir, escute e escreva. Você pode ouvir novamente, parar e corrigir com calma.',
        tipo: 'campos',
        itens: [
          {
            pergunta: '10A — Palavra 1',
            respostas: ['Bola'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q10-a',
          },
          {
            pergunta: '10B — Palavra 2',
            respostas: ['Pipa'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q10-b',
          },
        ],
        dica: 'Escute a palavra inteira. Use Repetir se precisar e confira o que escreveu.',
        sucesso: 'Você ouviu e registrou dois nomes de brinquedos do nosso estudo.',
        leitura:
          'Você conheceu objetos usados em brincadeiras. Agora vai escutar dois nomes e escrever um de cada vez. Ouvir e registrar ajuda a lembrar as palavras estudadas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'geografia-brincadeiras-lazer-q11',
        bloco: 'Geografia · Bloco 3 de 6 · Onde brincar e como chegar?',
        titulo: '11. Dentro ou fora?',
        instrucao:
          'Onde acontece cada situação descrita? Opções: dentro da moradia ou fora da moradia.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '11A — Duda monta peças no tapete da sala de sua casa.',
            opcoes: ['Dentro da moradia', 'Fora da moradia'],
            respostas: ['Dentro da moradia'],
            id: 'geografia-brincadeiras-lazer-q11-a',
          },
          {
            pergunta: '11B — Caio joga bola na quadra do parque.',
            opcoes: ['Dentro da moradia', 'Fora da moradia'],
            respostas: ['Fora da moradia'],
            id: 'geografia-brincadeiras-lazer-q11-b',
          },
          {
            pergunta: '11C — Lia brinca de roda no quintal, atrás da casa.',
            opcoes: ['Dentro da moradia', 'Fora da moradia'],
            respostas: ['Fora da moradia'],
            id: 'geografia-brincadeiras-lazer-q11-c',
          },
        ],
        dica: 'Procure na frase o lugar onde a brincadeira acontece.',
        sucesso:
          'Sala, quadra e quintal oferecem condições diferentes. Neste exemplo, a sala fica dentro; a quadra e o quintal ficam fora da moradia.',
        leitura:
          'Podemos brincar dentro ou fora de uma moradia. O lugar precisa combinar com a atividade e oferecer segurança. Uma brincadeira tranquila precisa de condições diferentes de uma atividade com muito movimento. A mesma brincadeira pode acontecer em mais de um lugar quando há condições adequadas e os participantes combinam seu uso.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/espacos.svg',
        descricaoIlustracao:
          'Sala dentro da casa com montagem no tapete; quintal fora da casa com roda; quadra cercada com bola; ciclovia separada com crianças pedalando acompanhadas.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q12',
        bloco: 'Geografia · Bloco 3 de 6 · Onde brincar e como chegar?',
        titulo: '12. Um lugar que combina',
        instrucao: 'Escolha o lugar adequado entre os três apresentados.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '12A — Pedalar com um adulto.',
            opcoes: ['Sala com mesa', 'Quadra para bola', 'Ciclovia'],
            respostas: ['Ciclovia'],
            id: 'geografia-brincadeiras-lazer-q12-a',
          },
          {
            pergunta: '12B — Jogar bola com os colegas.',
            opcoes: ['Ciclovia', 'Quadra para bola', 'Sala com mesa'],
            respostas: ['Quadra para bola'],
            id: 'geografia-brincadeiras-lazer-q12-b',
          },
          {
            pergunta: '12C — Montar um quebra-cabeça.',
            opcoes: ['Sala com mesa', 'Ciclovia', 'Quadra onde há jogo de bola'],
            respostas: ['Sala com mesa'],
            id: 'geografia-brincadeiras-lazer-q12-c',
          },
        ],
        dica: 'Compare a atividade com a função e as condições de cada lugar.',
        sucesso:
          'Os lugares escolhidos combinam com as condições deste exemplo. Em outras situações, uma brincadeira pode ter mais de um lugar adequado.',
        leitura:
          'Para escolher um lugar, observe o movimento e o espaço necessário. Uma pista preparada pode receber skate; um espaço tranquilo pode receber uma montagem. O uso também precisa respeitar quem está no local.\n\nConheça os lugares: Sala com mesa livre; quadra cercada, aberta para jogar bola; ciclovia livre, com crianças pedalando acompanhadas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/espacos.svg',
        descricaoIlustracao:
          'Sala com mesa livre, quadra cercada disponível para bola e ciclovia com crianças pedalando acompanhadas. O quintal é outro espaço externo. Exemplo separado: pista preparada para skate.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q13',
        bloco: 'Geografia · Bloco 3 de 6 · Onde brincar e como chegar?',
        titulo: '13. O desenho do parque',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '13A — Toque no setor preparado para jogar bola.',
            opcoes: ['Entrada', 'Banco', 'Quadra', 'Brinquedos'],
            respostas: ['Quadra'],
            id: 'geografia-brincadeiras-lazer-q13-a',
          },
        ],
        dica: 'Use a legenda e procure o setor com espaço preparado para essa atividade.',
        sucesso:
          'A legenda ajuda a ler o desenho. O setor da quadra está preparado para jogar bola.',
        leitura:
          'Um desenho simples de um lugar pode ajudar a encontrar suas partes. A legenda explica os símbolos. Observe os caminhos e os nomes: eles ajudam a localizar onde uma atividade pode acontecer.\n\nObserve o croqui do Parque do Ipê: Entrada na parte inferior esquerda; banco no centro; quadra com bola e trave na parte superior direita; brinquedos com balanço e escorregador na parte inferior direita. Legenda: bola = quadra; banco = descanso; balanço = brinquedos. Um caminho liga a entrada ao banco e, depois, se divide para quadra e brinquedos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        mapaVisual: {
          imagem: '../assets/geografia-brincadeiras-lazer-outubro-2026/croqui-parque.svg',
          descricao:
            'Croqui do Parque do Ipê. Entrada embaixo à esquerda, banco no centro, quadra com bola e trave em cima à direita, brinquedos com balanço e escorregador embaixo à direita. O caminho vai da entrada ao banco e se divide até a quadra e os brinquedos. Início: entrada. Destino: brinquedos. Legenda: bola para quadra, banco para descanso e balanço para brinquedos.',
          rotulo: 'Setores selecionáveis do Parque do Ipê',
          pontos: [
            {
              opcao: 'Entrada',
              rotulo: 'Selecionar Entrada',
              x: 16,
              y: 65,
            },
            {
              opcao: 'Banco',
              rotulo: 'Selecionar Banco',
              x: 46,
              y: 45,
            },
            {
              opcao: 'Quadra',
              rotulo: 'Selecionar Quadra',
              x: 78,
              y: 23,
            },
            {
              opcao: 'Brinquedos',
              rotulo: 'Selecionar Brinquedos',
              x: 78,
              y: 65,
            },
          ],
        },
      },
      {
        id: 'geografia-brincadeiras-lazer-q14',
        bloco: 'Geografia · Bloco 3 de 6 · Onde brincar e como chegar?',
        titulo: '14. Um pequeno caminho',
        instrucao:
          'Organize os três cartões. Clique no cartão colocado para retirá-lo ou use Limpar sequência.',
        tipo: 'misto',
        itens: [
          {
            pergunta: '14A — Organize os cartões na ordem desse percurso.',
            tipo: 'ordenacao',
            cartoes: ['Brinquedos', 'Entrada', 'Banco'],
            respostas: ['Entrada', 'Banco', 'Brinquedos'],
            rotuloOrdem: 'Percurso da entrada aos brinquedos',
            id: 'geografia-brincadeiras-lazer-q14-a',
          },
        ],
        dica: 'Encontre primeiro onde a pessoa está. Depois acompanhe o caminho até o destino.',
        sucesso:
          'Ler o caminho ajuda a organizar as partes do percurso. Você pode usar pontos conhecidos para se localizar.',
        leitura:
          'Um percurso tem um começo e um destino. Podemos usar pontos conhecidos para acompanhar o caminho. No desenho do parque, observe por onde a pessoa passa antes de chegar.\n\nObserve: Use o mesmo croqui do Parque do Ipê. Uma pessoa está na entrada e quer chegar aos brinquedos pelo caminho que passa pelo banco.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/croqui-parque.svg',
        descricaoIlustracao:
          'Croqui do Parque do Ipê. Entrada embaixo à esquerda, banco no centro, quadra com bola e trave em cima à direita, brinquedos com balanço e escorregador embaixo à direita. O caminho vai da entrada ao banco e se divide até a quadra e os brinquedos. Início: entrada. Destino: brinquedos. Legenda: bola para quadra, banco para descanso e balanço para brinquedos.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q15',
        bloco: 'Geografia · Bloco 3 de 6 · Onde brincar e como chegar?',
        titulo: '15. Escolher e cuidar',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '15A — Entre esses lugares, qual escolher para empinar pipa?',
            opcoes: ['Lugar 2', 'Lugar 1', 'Lugar 3'],
            respostas: ['Lugar 1'],
            id: 'geografia-brincadeiras-lazer-q15-a',
          },
          {
            pergunta: '15B — Uma pipa ficou presa nos fios. O que a criança deve fazer?',
            opcoes: [
              'Puxar a linha para soltar a pipa',
              'Procurar uma escada para alcançar os fios',
              'Afastar-se e avisar um adulto',
            ],
            respostas: ['Afastar-se e avisar um adulto'],
            id: 'geografia-brincadeiras-lazer-q15-b',
          },
        ],
        dica: 'Pense nos riscos do lugar e lembre que a criança não deve tentar retirar objetos dos fios.',
        sucesso:
          'Brincar com segurança exige escolher o lugar e saber quando parar. Uma pipa presa na rede não deve ser retirada pela criança nem pelo adulto que a acompanha; o adulto deve buscar ajuda especializada.',
        leitura:
          'Para empinar pipa, procure um lugar aberto, longe de fios elétricos e de veículos, com um adulto. Não use linhas cortantes. Se a pipa ficar presa em fios, não tente pegá-la: afaste-se e avise um adulto.\n\nCompare: Lugar 1: área aberta, longe dos fios e dos veículos, com um adulto. Lugar 2: telhado de uma casa perto de fios elétricos. Lugar 3: rua por onde passam veículos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/lugares-pipa.svg',
        descricaoIlustracao:
          'Lugar 1: área aberta, adulto, longe de fios e veículos. Lugar 2: telhado perto de fios elétricos. Lugar 3: rua com veículos. Ninguém toca nos fios nem tenta retirar pipa.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q16',
        bloco: 'Geografia · Bloco 4 de 6 · O lazer no nosso dia',
        titulo: '16. Diferentes formas de lazer',
        instrucao: 'Relacione cada atividade ao espaço descrito.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '16A — Assistir ao filme da sessão.',
            opcoes: ['Caminho do parque', 'Sala de casa', 'Cinema'],
            respostas: ['Cinema'],
            id: 'geografia-brincadeiras-lazer-q16-a',
          },
          {
            pergunta: '16B — Ler um livro na poltrona mostrada.',
            opcoes: ['Sala de casa', 'Cinema durante a sessão', 'Caminho de passeio'],
            respostas: ['Sala de casa'],
            id: 'geografia-brincadeiras-lazer-q16-b',
          },
          {
            pergunta: '16C — Caminhar com um adulto pelo caminho mostrado.',
            opcoes: ['Cinema', 'Parque', 'Sala de casa'],
            respostas: ['Parque'],
            id: 'geografia-brincadeiras-lazer-q16-c',
          },
        ],
        dica: 'Use as condições descritas para este passeio, sem pensar em outros lugares possíveis.',
        sucesso:
          'Lazer pode acontecer em casa e em outros espaços. Ler, caminhar e assistir a um filme são possibilidades diferentes.',
        leitura:
          'Lazer é um tempo que podemos aproveitar com atividades de que gostamos. Podemos brincar, ler, praticar esportes, conversar ou descansar. Há atividades com muito movimento e outras tranquilas. As pessoas não precisam gostar das mesmas coisas. Um lugar pode receber mais de uma atividade, quando oferece condições e os participantes respeitam seu uso.\n\nConheça os espaços deste passeio: Sala de casa com poltrona e livros; parque com caminho para passeio; cinema com sessão de filme.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/lazer-espacos.svg',
        descricaoIlustracao:
          'Sala de casa com poltrona e livros, parque com caminho para passeio acompanhado e cinema com sessão de filme.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q17',
        bloco: 'Geografia · Bloco 4 de 6 · O lazer no nosso dia',
        titulo: '17. O que as pessoas estão fazendo?',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '17A — Marque todas as atividades de lazer mostradas na cena.',
            opcoes: ['Nadar', 'Ler um livro', 'Andar de skate', 'Brincar de roda', 'Conversar'],
            respostas: ['Ler um livro', 'Brincar de roda', 'Conversar'],
            id: 'geografia-brincadeiras-lazer-q17-a',
          },
        ],
        dica: 'Confira se cada atividade aparece na imagem ou na descrição equivalente.',
        sucesso:
          'O parque pode reunir atividades diferentes ao mesmo tempo. Nesta cena há leitura, roda e conversa.',
        leitura:
          'Observar uma cena ajuda a descobrir quais atividades acontecem num lugar. Só podemos afirmar o que a imagem e sua descrição mostram. Descansar e ler também podem fazer parte do lazer.\n\nObserve: No gramado do parque, duas crianças brincam de roda. Num banco, uma pessoa lê um livro. Em outro banco, duas pessoas conversam. Ninguém está nadando ou andando de skate nessa cena.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/acoes-lazer.svg',
        descricaoIlustracao:
          'No gramado, duas crianças brincam de roda. Uma pessoa lê um livro num banco; duas pessoas conversam em outro banco. Não há piscina, nadador, skate ou skatista.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q18',
        bloco: 'Geografia · Bloco 4 de 6 · O lazer no nosso dia',
        titulo: '18. Uma turma, várias preferências',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '18A — Marque as duas atividades com mais escolhas nessa tabela.',
            opcoes: ['Desenhar', 'Ler histórias', 'Jogar bola'],
            respostas: ['Desenhar', 'Jogar bola'],
            id: 'geografia-brincadeiras-lazer-q18-a',
          },
        ],
        dica: 'Compare os três números. Quais dois são maiores?',
        sucesso:
          'Jogar bola e desenhar tiveram mais escolhas nesta turma. A criança que escolheu ler também tem uma preferência que merece respeito.',
        leitura:
          'Uma tabela organiza informações. Esta tabela mostra escolhas de uma turma inventada. Os números contam quantas crianças escolheram cada atividade; não dizem qual brincadeira é melhor.\n\nTabela · Atividade preferida — Crianças que escolheram:\nLer histórias — 1\nJogar bola — 4\nDesenhar — 3',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura:
          '../assets/geografia-brincadeiras-lazer-outubro-2026/tabela-preferencias.svg',
        descricaoIlustracao:
          'Tabela de uma turma fictícia: ler histórias, 1 criança; jogar bola, 4 crianças; desenhar, 3 crianças.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q19',
        bloco: 'Geografia · Bloco 4 de 6 · O lazer no nosso dia',
        titulo: '19. A mesma praça em dois períodos',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '19A — Qual atividade aparece somente na cena do dia?',
            opcoes: ['Fazer piquenique', 'Ouvir uma história', 'Conversar'],
            respostas: ['Fazer piquenique'],
            id: 'geografia-brincadeiras-lazer-q19-a',
          },
          {
            pergunta: '19B — O que mudou entre essas cenas?',
            opcoes: [
              'A praça passou a ser outro lugar',
              'Todas as pessoas deixaram de ter lazer à noite',
              'Uma das atividades de lazer apresentada',
            ],
            respostas: ['Uma das atividades de lazer apresentada'],
            id: 'geografia-brincadeiras-lazer-q19-b',
          },
        ],
        dica: 'Observe o que continua nas duas cenas e o que aparece em apenas uma.',
        sucesso:
          'O lugar continua sendo a mesma praça. Algumas atividades mudaram, e a conversa aparece nos dois períodos. Outros lugares podem ter rotinas diferentes.',
        leitura:
          'As atividades de um lugar podem mudar durante o dia. Isso depende das pessoas, dos horários e das condições do espaço. Vamos comparar duas cenas desta praça, sem transformar o exemplo numa regra para todos os lugares.\n\nObserve: Na cena do dia, uma família faz piquenique e duas pessoas conversam. Na cena da noite, uma família ouve uma história e duas pessoas conversam. A praça está iluminada, e as crianças estão com adultos nas duas cenas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/dia-noite.svg',
        descricaoIlustracao:
          'Mesma praça em dois quadros. Dia: família faz piquenique e duas pessoas conversam. Noite: família ouve história e duas pessoas conversam, com iluminação. Crianças acompanhadas de adultos nos dois.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q20',
        bloco: 'Geografia · Bloco 4 de 6 · O lazer no nosso dia',
        titulo: '20. Lugares diferentes, uma brincadeira em comum',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '20A — Em quais desses lugares as crianças estão brincando de bola?',
            opcoes: ['Apenas no Bairro Sol', 'Nos dois bairros', 'Apenas no Bairro Lua'],
            respostas: ['Nos dois bairros'],
            id: 'geografia-brincadeiras-lazer-q20-a',
          },
          {
            pergunta: '20B — Qual diferença foi informada?',
            opcoes: [
              'Num lugar há quadra; no outro, campo gramado',
              'Só um dos grupos está acompanhado',
              'Os grupos estão praticando brincadeiras diferentes',
            ],
            respostas: ['Num lugar há quadra; no outro, campo gramado'],
            id: 'geografia-brincadeiras-lazer-q20-b',
          },
        ],
        dica: 'Compare primeiro a ação. Depois observe as características do espaço.',
        sucesso:
          'A brincadeira é parecida, e os espaços são diferentes. Um campo e uma quadra podem receber bola quando oferecem condições adequadas.',
        leitura:
          'Lugares podem ter características diferentes e oferecer atividades parecidas. Observar dois exemplos ajuda a encontrar semelhanças e diferenças. Não podemos concluir que todos os bairros ou todas as pessoas são iguais.\n\nCompare: No Bairro Sol, crianças jogam bola numa quadra cercada. No Bairro Lua, crianças jogam bola num campo gramado reservado para brincar. Nos dois lugares, há adultos acompanhando o grupo.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/dois-bairros.svg',
        descricaoIlustracao:
          'Bairro Sol: grupo joga bola em quadra cercada. Bairro Lua: grupo joga bola em campo gramado reservado. Adultos acompanham os dois grupos.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q21',
        bloco: 'Geografia · Bloco 5 de 6 · Brincar junto e cuidar dos lugares',
        titulo: '21. O que encontramos no parque?',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '21A — Marque os equipamentos que aparecem nesse parque.',
            opcoes: ['Banco', 'Bebedouro', 'Cinema', 'Balanço', 'Quadra de basquete'],
            respostas: ['Banco', 'Bebedouro', 'Balanço'],
            id: 'geografia-brincadeiras-lazer-q21-a',
          },
        ],
        dica: 'Procure cada equipamento na cena. Responda sobre este parque.',
        sucesso:
          'Banco, bebedouro e balanço têm usos diferentes. Outros parques podem oferecer mais equipamentos ou equipamentos diferentes.',
        leitura:
          'Parques e praças podem receber pessoas de diferentes idades e atividades. Equipamentos como bancos, brinquedos e bebedouros ajudam em usos diferentes. Precisamos observar o que existe em cada lugar. Nem todos os parques têm os mesmos equipamentos. Quando compartilhamos um espaço, também cuidamos para que outras pessoas possam aproveitá-lo.\n\nObserve o Parque das Flores: Há um banco, um bebedouro, um balanço, árvores e um caminho. Nesse desenho não há cinema nem quadra de basquete.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/equipamentos.svg',
        descricaoIlustracao:
          'Parque das Flores com banco, bebedouro, balanço, árvores e caminho. Não há cinema nem quadra de basquete.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q22',
        bloco: 'Geografia · Bloco 5 de 6 · Brincar junto e cuidar dos lugares',
        titulo: '22. Duas crianças, um brinquedo',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '22A — Marque as duas atitudes que ajudam a resolver a situação.',
            opcoes: [
              'Tomar o lugar antes de ouvir o colega',
              'Conversar e combinar a vez de cada um',
              'Fingir que não ouviu o pedido do colega',
              'Pedir ajuda a um adulto se não conseguem combinar',
            ],
            respostas: [
              'Conversar e combinar a vez de cada um',
              'Pedir ajuda a um adulto se não conseguem combinar',
            ],
            id: 'geografia-brincadeiras-lazer-q22-a',
          },
        ],
        dica: 'Procure atitudes que considerem as duas crianças.',
        sucesso:
          'Conversar e combinar ajuda a compartilhar. Um adulto pode ajudar quando o grupo precisa resolver um conflito.',
        leitura:
          'Quando duas pessoas querem o mesmo brinquedo, podem conversar e combinar como usá-lo. Esperar e pedir ajuda quando necessário são maneiras de resolver a situação sem machucar alguém.\n\nContexto: Duda e Caio querem usar o mesmo balanço. Os dois chegaram juntos e ainda não combinaram a vez.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q23',
        bloco: 'Geografia · Bloco 5 de 6 · Brincar junto e cuidar dos lugares',
        titulo: '23. Todo mundo pode participar',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '23A — Qual combinação permite que todos participem?',
            opcoes: [
              'Nina observa enquanto os outros correm com a bola',
              'O grupo mantém a corrida e espera que Nina acompanhe',
              'Todos se sentam em roda e passam a bola uns aos outros',
            ],
            respostas: ['Todos se sentam em roda e passam a bola uns aos outros'],
            id: 'geografia-brincadeiras-lazer-q23-a',
          },
        ],
        dica: 'Procure uma mudança na brincadeira que atenda à necessidade informada.',
        sucesso:
          'Adaptar a brincadeira permitiu que o grupo participasse junto. A adaptação atende à situação de Nina, sem precisar excluir ninguém.',
        leitura:
          'Uma brincadeira pode ser adaptada para incluir as pessoas. Ouvir o que cada participante precisa ajuda o grupo a escolher uma forma de brincar junto, com respeito.\n\nContexto: Nina precisa brincar sentada. Ela quer passar uma bola com os amigos. O grupo tem espaço para formar uma roda.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q24',
        bloco: 'Geografia · Bloco 5 de 6 · Brincar junto e cuidar dos lugares',
        titulo: '24. Cuidar do lugar compartilhado',
        instrucao: 'Marque Verdadeiro ou Falso em cada frase.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              '24A — É melhor deixar a embalagem do lanche no banco para outra pessoa guardar.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
            id: 'geografia-brincadeiras-lazer-q24-a',
          },
          {
            pergunta:
              '24B — Avisar um adulto sobre um brinquedo quebrado ajuda a cuidar do parque.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
            id: 'geografia-brincadeiras-lazer-q24-b',
          },
          {
            pergunta: '24C — Podemos arrancar as plantas do jardim para abrir espaço para brincar.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
            id: 'geografia-brincadeiras-lazer-q24-c',
          },
        ],
        dica: 'Pense no que ajuda a conservar o lugar e evita riscos para outras pessoas.',
        sucesso:
          'Guardar o lixo na lixeira apropriada, respeitar as plantas e avisar sobre um equipamento quebrado ajuda a cuidar do espaço.',
        leitura:
          'Cuidar de um parque ajuda quem está ali e quem chegará depois. Observe as lixeiras, as plantas e os equipamentos. Quando algo está quebrado, avise um adulto em vez de tentar consertar sozinho.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q25',
        bloco: 'Geografia · Bloco 5 de 6 · Brincar junto e cuidar dos lugares',
        titulo: '25. O plano mudou',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '25A — Qual plano combina com essas condições?',
            opcoes: [
              'Continuar a corrida no quintal molhado',
              'Jogar o jogo de tabuleiro juntos na mesa',
              'Correr pelo corredor estreito',
            ],
            respostas: ['Jogar o jogo de tabuleiro juntos na mesa'],
            id: 'geografia-brincadeiras-lazer-q25-a',
          },
        ],
        dica: 'Observe o que está disponível e o espaço necessário para cada atividade.',
        sucesso:
          'Mudar o plano permitiu que o grupo continuasse o lazer num espaço adequado. A escolha depende das condições da situação.',
        leitura:
          'Às vezes, as condições mudam e precisamos combinar outro plano. Podemos procurar uma atividade adequada ao espaço disponível, preservando a segurança e a participação do grupo.\n\nContexto: Um grupo ia brincar no quintal, mas começou a chover. Dentro da casa, há uma mesa livre e um jogo de tabuleiro para todos. O corredor é estreito.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q26',
        bloco: 'Geografia · Bloco 6 de 6 · Uma missão para juntar os aprendizados',
        titulo: '26. Uma história de bonecas',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'misto',
        itens: [
          {
            pergunta: '26A — Marque as duas ideias mostradas pelos relatos.',
            tipo: 'selecao',
            opcoes: [
              'Bia deixou de inventar histórias',
              'O material das bonecas é diferente',
              'As duas bonecas foram feitas de madeira',
              'Inventar histórias com bonecas aparece nos dois tempos',
            ],
            respostas: [
              'O material das bonecas é diferente',
              'Inventar histórias com bonecas aparece nos dois tempos',
            ],
            id: 'geografia-brincadeiras-lazer-q26-a',
          },
          {
            pergunta: '26B — O que esse exemplo ajuda a compreender?',
            opcoes: [
              'Uma forma de brincar pode continuar mesmo com brinquedos de materiais diferentes',
              'Bonecas de tecido só podem ser usadas no passado',
              'Uma boneca de plástico impede inventar histórias',
            ],
            respostas: [
              'Uma forma de brincar pode continuar mesmo com brinquedos de materiais diferentes',
            ],
            id: 'geografia-brincadeiras-lazer-q26-b',
          },
        ],
        dica: 'Compare separadamente o material do objeto e a ação de brincar.',
        sucesso:
          'Nesse exemplo, o material mudou, mas inventar histórias com bonecas continuou. Mudança e permanência podem acontecer juntas.',
        leitura:
          'Agora você vai reunir o que aprendeu sobre tempo, objetos e brincadeiras. Uma mudança no material ou no recurso não significa que a ação deixou de existir. Compare o que as pessoas faziam e o que fazem hoje. Use as informações de cada relato, sem transformar um exemplo numa regra para todos.\n\nRelatos: Quando era criança, Lúcia inventava histórias com uma boneca de tecido. Hoje, sua neta Bia inventa histórias com uma boneca de plástico. As duas contaram sobre brincar de boneca.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q27',
        bloco: 'Geografia · Bloco 6 de 6 · Uma missão para juntar os aprendizados',
        titulo: '27. Planejar uma ida à praça',
        instrucao: 'Marque todas as escolhas pedidas. Clique novamente para desmarcar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: '27A — Marque as três escolhas que ajudam nesse passeio.',
            opcoes: [
              'Ir acompanhada de seu responsável',
              'Correr para atravessar antes de observar a rua',
              'Esperar o verde do pedestre e, com o adulto, verificar que os veículos pararam',
              'Usar a quadra disponível para jogar bola',
              'Jogar bola na ciclovia entre as bicicletas',
            ],
            respostas: [
              'Ir acompanhada de seu responsável',
              'Esperar o verde do pedestre e, com o adulto, verificar que os veículos pararam',
              'Usar a quadra disponível para jogar bola',
            ],
            id: 'geografia-brincadeiras-lazer-q27-a',
          },
        ],
        dica: 'Pense no acompanhamento, na travessia e no uso do espaço da praça.',
        sucesso:
          'O passeio exige cuidado no caminho e no lugar escolhido. O sinal verde do pedestre não dispensa observar a rua com o adulto.',
        leitura:
          'Crianças atravessam ruas acompanhadas de um adulto. Onde há sinal para pedestres, o verde permite iniciar a travessia depois de verificar que os veículos pararam. Na praça, observe o espaço adequado e as outras pessoas.\n\nContexto: Duda vai com seu responsável a uma praça para jogar bola. Para chegar, precisam atravessar uma rua com faixa e semáforo para pedestres. A praça tem quadra e ciclovia em uso.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ilustracaoLeitura: '../assets/geografia-brincadeiras-lazer-outubro-2026/passeio-praca.svg',
        descricaoIlustracao:
          'Criança e responsável aguardam na calçada junto da faixa e do semáforo para pedestres. A praça tem quadra para bola e ciclovia em uso, separadas. O sinal tem figuras de pedestre, além de texto, e ninguém iniciou a travessia.',
      },
      {
        id: 'geografia-brincadeiras-lazer-q28',
        bloco: 'Geografia · Bloco 6 de 6 · Uma missão para juntar os aprendizados',
        titulo: '28. Objetos, materiais e brincadeiras',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'misto',
        itens: [
          {
            pergunta: '28A — Qual material faz a cobertura da pipa dessa ficha?',
            opcoes: ['Vidro', 'Barro', 'Papel'],
            respostas: ['Papel'],
            id: 'geografia-brincadeiras-lazer-q28-a',
          },
          {
            pergunta: '28B — Qual material foi usado nos licocós apresentados?',
            opcoes: ['Plástico', 'Barro', 'Madeira'],
            respostas: ['Barro'],
            id: 'geografia-brincadeiras-lazer-q28-b',
          },
          {
            pergunta: '28C — Qual brincadeira a terceira ficha descreve?',
            opcoes: ['Pular corda', 'Brincar de roda', 'Montar um quebra-cabeça'],
            respostas: ['Pular corda'],
            id: 'geografia-brincadeiras-lazer-q28-c',
          },
        ],
        dica: 'Em cada item, observe se a pergunta pede um material ou uma ação.',
        sucesso:
          'Você relacionou objetos, materiais e ações. Os licocós também ajudam a conhecer um saber cultural do povo Karajá.',
        leitura:
          'Para conhecer um brinquedo, podemos observar sua ficha e como ele é usado. O material explica de que o objeto é feito. A ação explica o que fazemos na brincadeira. Alguns objetos também estão ligados a saberes culturais.\n\nFichas desta pequena exposição: Pipa com cobertura de papel e varetas de madeira; conjunto de licocós de barro ligado ao povo Karajá; corda usada por duas crianças para que uma terceira pule.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q29',
        bloco: 'Geografia · Bloco 6 de 6 · Uma missão para juntar os aprendizados',
        titulo: '29. Combinar uma brincadeira à distância',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: '29A — Qual opção atende a essa necessidade?',
            opcoes: [
              'Enviar uma carta pelo correio',
              'Assistir a um programa de televisão',
              'Fazer uma ligação telefônica com ajuda do responsável',
            ],
            respostas: ['Fazer uma ligação telefônica com ajuda do responsável'],
            id: 'geografia-brincadeiras-lazer-q29-a',
          },
        ],
        dica: 'Procure o meio que permite falar e ouvir a resposta naquele momento.',
        sucesso:
          'A ligação atende à conversa imediata dessa situação. Uma carta também pode comunicar, mas sua entrega e resposta levam outro tempo.',
        leitura:
          'Alguns meios ajudam a divulgar notícias; outros permitem conversar com alguém distante. A escolha depende do que queremos fazer. Com ajuda de um adulto, podemos usar uma ligação para combinar uma atividade.\n\nContexto: Duda quer conversar agora com seu avô, que está longe, e ouvir a resposta dele. Seu responsável pode ajudá-la a fazer uma ligação.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
      },
      {
        id: 'geografia-brincadeiras-lazer-q30',
        bloco: 'Geografia · Bloco 6 de 6 · Uma missão para juntar os aprendizados',
        titulo: '30. Ouvir e registrar o que aprendemos',
        instrucao: 'Use Ouvir para cada frase. Você pode repetir, parar e corrigir sua escrita.',
        tipo: 'campos',
        itens: [
          {
            pergunta: '30A — Frase 1',
            respostas: ['Podemos brincar em diferentes lugares.'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q30-a',
          },
          {
            pergunta: '30B — Frase 2',
            respostas: ['Brincadeiras antigas também existem hoje.'],
            pontuacaoFlexivel: true,
            id: 'geografia-brincadeiras-lazer-q30-b',
          },
        ],
        dica: 'Escute toda a frase. Se precisar, repita e confira se registrou todas as palavras.',
        sucesso:
          'Você registrou duas ideias da revisão pela escuta. Comparar, observar e cuidar ajuda a escolher como e onde brincar.',
        leitura:
          'Você comparou tempos, conheceu brinquedos e escolheu lugares para brincar. Agora escute duas frases curtas sobre esse estudo. Escreva uma por vez e releia com calma antes de conferir.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro aprovado de Geografia · conteúdo original; pessoas, relatos e lugares fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/map.svg',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
    ],
  });
})();
