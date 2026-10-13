(function () {
  'use strict';
  window.QuestionariosRevisoes.registrar({
    id: 'alice-ciencias-sustentabilidade-rotina-objetos-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Ciências',
    titulo: 'Objetos, rotina e cuidado com o ambiente',
    subtitulo: 'Ciências · 1º ano · 30 questões',
    chave: 'revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.v1',
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice principal',
          principal: true,
          chaveArmazenamento:
            'revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável auxiliar',
          chaveArmazenamento:
            'revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.responsavel.v1',
        },
      ],
    },
    layout: {
      desktopAmplo: true,
    },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    resumoFinal:
      'Você aprendeu sobre objetos, rotina e cuidado com o ambiente. Conte ao adulto uma coisa que descobriu. Se quiser, desenhe no papel uma atitude de cuidado. Essa conversa e esse desenho não valem ponto.',
    questoes: [
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q01',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '01. Um objeto para cada cuidado',
        instrucao: 'Toque no objeto que ajuda a limpar os dentes.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual objeto você escolhe?',
            opcoes: ['Pente', 'Escova de dentes', 'Relógio', 'Lápis'],
            respostas: ['Escova de dentes'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Você vai observar, escolher, completar e organizar. Leia com calma. Se precisar, peça a um adulto para ler junto com você. Você pode corrigir e tentar de novo. Faça uma pausa quando quiser.\n\nNas escolhas de uma resposta, marque apenas uma. Nas seleções, marque a quantidade de respostas que a tarefa pede. Para ordenar, escolha o cartão que vem primeiro, depois o próximo. Você pode retirar um cartão e colocá-lo de novo.\n\nLeia para aprender\nOs objetos nos ajudam a fazer muitas coisas. Uma toalha, por exemplo, ajuda a secar o corpo. Para escolher um objeto, pense no que você precisa fazer.\n\nObserve a situação\nNa bancada há um pente, uma escova de dentes, um relógio e um lápis. Cada objeto está em seu próprio espaço.',
        dica: 'Pense na parte do corpo que será cuidada e na função de cada objeto.',
        sucesso: 'Você escolheu um objeto pela função: a escova ajuda a limpar os dentes.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        mapaVisual: {
          imagem: '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v01.svg',
          descricao:
            'Bancada com quatro objetos separados: pente, escova de dentes, relógio e lápis.',
          rotulo: 'Objetos selecionáveis da bancada',
          pontos: [
            {
              opcao: 'Pente',
              rotulo: 'Pente',
              x: 47,
              y: 21,
            },
            {
              opcao: 'Escova de dentes',
              rotulo: 'Escova de dentes',
              x: 47,
              y: 45,
            },
            {
              opcao: 'Relógio',
              rotulo: 'Relógio',
              x: 47,
              y: 69,
            },
            {
              opcao: 'Lápis',
              rotulo: 'Lápis',
              x: 47,
              y: 94,
            },
          ],
        },
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q02',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '02. Objetos em ação',
        instrucao: 'Escolha a função de cada objeto nas cenas.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Na cena da sopa, para que serve a colher?',
            opcoes: [
              'Medir a temperatura da sopa.',
              'Conservar a sopa quente por muitas horas.',
              'Mexer a sopa.',
            ],
            respostas: ['Mexer a sopa.'],
          },
          {
            pergunta: 'b) Na cena da chuva, para que serve o guarda-chuva?',
            opcoes: [
              'Ajudar a pessoa a se proteger da chuva.',
              'Medir quanta chuva caiu.',
              'Secar a roupa depois da chuva.',
            ],
            respostas: ['Ajudar a pessoa a se proteger da chuva.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nUm objeto pode ajudar em uma tarefa. A mochila transporta materiais; a toalha seca. Agora observe outros usos.\n\nObserve a situação\nVeja uma colher e um guarda-chuva aberto. As duas cenas mostram uma pessoa mexendo uma sopa com colher e outra se protegendo da chuva com guarda-chuva.',
        dica: 'Compare cada objeto com a tarefa que a pessoa está fazendo.',
        sucesso: 'A colher ajuda a mexer a sopa. O guarda-chuva ajuda a proteger da chuva.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v02.svg',
        descricaoIlustracao:
          'Uma pessoa mexe uma sopa com uma colher. Em outra cena, uma pessoa usa um guarda-chuva aberto para se proteger da chuva.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q03',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '03. Complete com uma ação',
        instrucao: 'Escolha a palavra que completa cada ideia e escreva no campo.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Usamos o pente para ______ o cabelo.',
            respostas: ['pentear'],
          },
          {
            pergunta: 'b) Usamos o lápis para ______ o nosso nome.',
            respostas: ['escrever'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nO nome do objeto e a ação são coisas diferentes. Uma mochila é um objeto; transportar é uma ação que podemos fazer com ela.\n\nObserve a situação\nBanco de palavras: beber · pentear · escrever · varrer. Use uma palavra do banco em cada resposta.',
        dica: 'Leia a frase inteira e teste mentalmente as palavras do banco.',
        sucesso: 'Você relacionou os objetos às ações: pentear o cabelo e escrever o nome.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q04',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '04. Dois instrumentos, duas funções',
        instrucao: 'Escolha o instrumento para cada tarefa.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual instrumento ajuda Luna a consultar o horário?',
            opcoes: ['Termômetro', 'Relógio', 'Régua'],
            respostas: ['Relógio'],
          },
          {
            pergunta: 'b) Qual instrumento ajuda a professora a medir a temperatura?',
            opcoes: ['Termômetro', 'Régua', 'Relógio'],
            respostas: ['Termômetro'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nAlguns objetos são instrumentos: ajudam a descobrir uma informação. Uma régua, por exemplo, ajuda a medir comprimentos.\n\nObserve a situação\nLuna quer consultar o horário da aula. A professora quer medir a temperatura da água em uma tigela. Elas vão escolher instrumentos diferentes.',
        dica: 'Uma tarefa trata de tempo. A outra trata de temperatura.',
        sucesso: 'O relógio informa as horas. O termômetro mede a temperatura.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v03.svg',
        descricaoIlustracao:
          'Luna precisa consultar o horário da aula. A professora quer medir a temperatura da água de uma tigela. Estão disponíveis termômetro, relógio e régua.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q05',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '05. O kit do desenho',
        instrucao: 'Marque os DOIS objetos que Rafa ainda precisa pegar.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'a) Quais objetos completam o kit?',
            opcoes: ['Borracha', 'Relógio', 'Pente', 'Lápis', 'Escova de dentes'],
            respostas: ['Borracha', 'Lápis'],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nPara preparar uma tarefa, pense no que cada objeto permite fazer. Escolha apenas os objetos que ajudam naquela tarefa.\n\nObserve a situação\nRafa vai fazer um desenho com lápis em uma folha e apagar um traço se precisar. A folha já está na mesa.',
        dica: 'Um objeto faz o traço; outro pode apagar o traço do lápis.',
        sucesso: 'O lápis faz o desenho e a borracha pode apagar um traço. Você preparou o kit!',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v04.svg',
        descricaoIlustracao:
          'Rafa tem uma folha sobre a mesa. Pode escolher entre borracha, relógio, pente, lápis e escova de dentes para desenhar com lápis e apagar um traço.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q06',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '06. Mesma função, materiais diferentes',
        instrucao: 'Compare os dois copos.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que função os dois copos têm nessa cena?',
            opcoes: [
              'Guardar lápis na cena.',
              'Servir para beber água.',
              'Medir a temperatura da água.',
            ],
            respostas: ['Servir para beber água.'],
          },
          {
            pergunta: 'b) O que é diferente entre os copos A e B?',
            opcoes: [
              'A função que cumprem na cena.',
              'A bebida colocada dentro deles.',
              'O material de que são feitos.',
            ],
            respostas: ['O material de que são feitos.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nUm objeto pode ser feito de diferentes materiais. Existem caixas de papelão e de plástico. O material pode mudar sem mudar a função da caixa.\n\nObserve a situação\nNa cena, dois copos inteiros recebem água para beber. O copo A é de vidro. O copo B é de plástico. Eles são usados para a mesma tarefa.',
        dica: 'Primeiro pense no uso. Depois compare a informação sobre os materiais.',
        sucesso:
          'Os dois copos têm a mesma função na cena, mas são feitos de materiais diferentes.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v05.svg',
        descricaoIlustracao:
          'Dois copos inteiros com água para beber: A é de vidro e B é de plástico.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q07',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '07. Observe as características',
        instrucao: 'Escolha a característica que cada observação mostra.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) A parede do pote deixa ver a bolinha. Ela é:',
            opcoes: ['transparente', 'flexível', 'resistente'],
            respostas: ['transparente'],
          },
          {
            pergunta: 'b) A tira de borracha dobra e não se quebra nesse uso. Ela é:',
            opcoes: ['transparente', 'resistente', 'flexível'],
            respostas: ['flexível'],
          },
          {
            pergunta: 'c) A caixa suporta os blocos e permanece inteira. Nesse uso, ela é:',
            opcoes: ['flexível', 'resistente', 'transparente'],
            respostas: ['resistente'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nTransparente deixa ver através. Flexível pode dobrar sem se quebrar nas condições do exemplo. Resistente suporta o uso mostrado. Essas características precisam ser observadas; não são iguais em todos os objetos.\n\nObserve a situação\nQuadro A: vemos uma bolinha através da parede de um pote. Quadro B: uma tira de borracha se dobra e permanece inteira. Quadro C: uma caixa suporta os blocos colocados nela e permanece inteira.',
        dica: 'Observe o que aconteceu em cada quadro: ver através, dobrar ou suportar o uso.',
        sucesso: 'Você observou transparência, flexibilidade e resistência em exemplos diferentes.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v06.svg',
        descricaoIlustracao:
          'A: uma bolinha pode ser vista através da parede do pote. B: uma tira de borracha se dobra e permanece inteira. C: uma caixa suporta os blocos colocados nela e permanece inteira.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q08',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '08. Um objeto com várias partes',
        instrucao: 'Observe as partes e responda.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque os DOIS materiais informados para esse guarda-chuva.',
            opcoes: ['Papel', 'Tecido', 'Vidro', 'Metal'],
            respostas: ['Tecido', 'Metal'],
            tipo: 'selecao',
          },
          {
            pergunta: 'b) Por que é útil que a cobertura não deixe a água passar facilmente?',
            opcoes: [
              'Porque facilita a passagem da água para a roupa.',
              'Porque permite dobrar a haste com mais facilidade.',
              'Porque ajuda a proteger a pessoa da chuva.',
            ],
            respostas: ['Porque ajuda a proteger a pessoa da chuva.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nUm objeto pode reunir materiais diferentes. Um estojo, por exemplo, pode ter corpo de tecido e fecho de metal. Cada parte ajuda no uso.\n\nObserve a situação\nEste guarda-chuva tem cobertura de tecido impermeável e haste de metal. A cobertura fica acima da pessoa; a haste mantém a cobertura apoiada.',
        dica: 'Compare a parte que fica sobre a pessoa com o que acontece quando chove.',
        sucesso:
          'Um objeto pode juntar materiais diferentes. A cobertura impermeável ajuda a proteger da chuva.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v07.svg',
        descricaoIlustracao:
          'Guarda-chuva com cobertura de tecido impermeável acima da pessoa e haste de metal que mantém a cobertura apoiada.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q09',
        bloco: 'Ciências · Objetos que ajudam no dia a dia',
        titulo: '09. Usar com cuidado',
        instrucao: 'Pense em cuidado e ajuda adulta.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque as DUAS situações que a criança não deve fazer sozinha.',
            opcoes: [
              'Pegar um remédio encontrado.',
              'Abrir um livro na mesa.',
              'Mexer no fogão.',
              'Brincar com os blocos.',
            ],
            respostas: ['Pegar um remédio encontrado.', 'Mexer no fogão.'],
            tipo: 'selecao',
          },
          {
            pergunta:
              'b) Uma criança encontrou um remédio no chão. Qual ação combina com o cuidado?',
            opcoes: [
              'Guardar o remédio com os brinquedos.',
              'Avisar um adulto, sem mexer no remédio.',
              'Dar o remédio a um colega.',
            ],
            respostas: ['Avisar um adulto, sem mexer no remédio.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nHá atividades que uma criança pode fazer e outras que exigem um adulto. Se aparecer algo que você não deve usar sozinha, peça ajuda.\n\nObserve a situação\nVeja quatro situações: pegar um remédio encontrado; abrir um livro na mesa; mexer no fogão; brincar com blocos adequados à idade.',
        dica: 'Pense em quais atividades precisam de orientação e supervisão de um adulto.',
        sucesso: 'Pedir ajuda a um adulto faz parte de usar os objetos com cuidado.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v08.svg',
        descricaoIlustracao:
          'Quatro situações para avaliar: pegar um remédio encontrado, abrir um livro na mesa, mexer no fogão e brincar com blocos adequados à idade.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q10',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '10. O que estamos fazendo?',
        instrucao: 'Escolha a finalidade mostrada em cada cena.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Ivo lava as mãos. Essa atividade é de:',
            opcoes: ['brincadeira', 'estudo', 'cuidado do corpo'],
            respostas: ['cuidado do corpo'],
          },
          {
            pergunta: 'b) Mila lê o texto da aula. Esse é um momento de:',
            opcoes: ['estudo', 'cuidado do corpo', 'brincadeira'],
            respostas: ['estudo'],
          },
          {
            pergunta: 'c) Dani monta blocos para brincar. Esse é um momento de:',
            opcoes: ['estudo', 'brincadeira', 'cuidado do corpo'],
            respostas: ['brincadeira'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nNa rotina, fazemos atividades com diferentes finalidades: cuidar do corpo, estudar e brincar. Uma mesma pessoa pode ter todos esses momentos no dia.\n\nObserve a situação\nCena A: Ivo lava as mãos. Cena B: Mila lê um texto da aula. Cena C: Dani brinca com blocos.',
        dica: 'Pense no que cada pessoa está fazendo na cena, e não apenas no objeto que aparece.',
        sucesso: 'Cuidado do corpo, estudo e brincadeira podem fazer parte da nossa rotina.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v09.svg',
        descricaoIlustracao:
          'A: Ivo lava as mãos. B: Mila lê um texto da aula. C: Dani brinca com blocos.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q11',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '11. Antes e depois',
        instrucao: 'Coloque os TRÊS cartões na ordem dessa tarefa.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Qual é a ordem?',
            tipo: 'ordenacao',
            cartoes: [
              'Guardar os lápis depois do desenho.',
              'Pegar os lápis que estão guardados.',
              'Usar os lápis para desenhar.',
            ],
            respostas: [
              'Pegar os lápis que estão guardados.',
              'Usar os lápis para desenhar.',
              'Guardar os lápis depois do desenho.',
            ],
            rotuloOrdem: 'Ordem das ações da tarefa',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nAlgumas ações precisam acontecer antes de outras. Para guardar uma roupa dobrada, por exemplo, primeiro precisamos dobrá-la.\n\nObserve a situação\nOs lápis de Davi estão guardados. Ele quer usá-los para desenhar e guardar os lápis novamente só depois de terminar o desenho.',
        dica: 'Antes de usar, os materiais precisam estar disponíveis. Guarde depois de terminar.',
        sucesso: 'Você organizou a tarefa: preparar os materiais, usar e guardar.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v10.svg',
        descricaoIlustracao:
          'Guardar os lápis depois do desenho. Pegar os lápis que estão guardados. Usar os lápis para desenhar.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q12',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '12. Os momentos do dia',
        instrucao: 'Responda usando a rotina de Bia.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Em que momento Bia vai à escola nesse dia?',
            opcoes: ['Noite', 'Manhã', 'Tarde'],
            respostas: ['Tarde'],
          },
          {
            pergunta: 'b) Em que momento Bia ouve a história antes de dormir?',
            opcoes: ['Manhã', 'Noite', 'Tarde'],
            respostas: ['Noite'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nPodemos organizar o dia em manhã, tarde e noite. As pessoas não precisam fazer as mesmas coisas nos mesmos momentos.\n\nObserve a situação\nRotina de Bia neste dia: MANHÃ — brincar no quintal; TARDE — ir à escola; NOITE — ouvir uma história antes de dormir.',
        dica: 'Procure cada atividade no registro do dia de Bia.',
        sucesso: 'Você encontrou as atividades nos momentos indicados na rotina de Bia.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v11.svg',
        descricaoIlustracao:
          'Neste dia, Bia brinca no quintal de manhã, vai à escola à tarde e ouve uma história antes de dormir à noite.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q13',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '13. O que se repete?',
        instrucao: 'Marque as DUAS atividades presentes nos dois dias.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'a) O que aconteceu nos dois dias?',
            opcoes: [
              'Visitar a avó.',
              'Ir à escola.',
              'Passear na praça.',
              'Assistir a um filme.',
              'Escovar os dentes.',
            ],
            respostas: ['Ir à escola.', 'Escovar os dentes.'],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nUma atividade pode aparecer em vários dias. Comparar dois registros ajuda a perceber o que se repetiu.\n\nObserve a situação\nDIA 1 — escovar os dentes, ir à escola, visitar a avó. DIA 2 — escovar os dentes, ir à escola, passear na praça.',
        dica: 'Confira cada atividade no Dia 1 e no Dia 2 antes de marcar.',
        sucesso: 'Escovar os dentes e ir à escola aparecem nos dois registros.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v12.svg',
        descricaoIlustracao:
          'Dia 1: escovar os dentes, ir à escola e visitar a avó. Dia 2: escovar os dentes, ir à escola e passear na praça.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q14',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '14. Objetos para a higiene',
        instrucao: 'Escolha um objeto para cada tarefa.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual objeto ajuda Caio a secar as mãos?',
            opcoes: ['Pente', 'Sabonete', 'Toalha limpa'],
            respostas: ['Toalha limpa'],
          },
          {
            pergunta: 'b) Qual objeto ajuda Eva a pentear o cabelo?',
            opcoes: ['Pente', 'Toalha', 'Sabonete'],
            respostas: ['Pente'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nCuidar do corpo envolve escolher objetos adequados. Usamos cada objeto conforme sua finalidade e com orientação quando precisamos.\n\nObserve a situação\nDepois de lavar as mãos, Caio precisa secá-las. Depois do banho, Eva quer pentear o cabelo.',
        dica: 'Uma tarefa pede tirar a água das mãos; a outra pede organizar os fios do cabelo.',
        sucesso: 'A toalha ajuda a secar. O pente ajuda a pentear o cabelo.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v13.svg',
        descricaoIlustracao:
          'Caio precisa secar as mãos depois de lavá-las. Eva quer pentear o cabelo depois do banho.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q15',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '15. Preparar-se para comer',
        instrucao: 'Organize os cartões e pense no motivo desse cuidado.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Ordene os TRÊS cartões para essa tarefa.',
            tipo: 'ordenacao',
            cartoes: [
              'Secar as mãos com toalha limpa.',
              'Começar a comer o lanche.',
              'Lavar as mãos.',
            ],
            respostas: [
              'Lavar as mãos.',
              'Secar as mãos com toalha limpa.',
              'Começar a comer o lanche.',
            ],
            rotuloOrdem: 'Ordem das ações da tarefa',
          },
          {
            pergunta: 'b) Por que lavar as mãos antes de comer é um cuidado?',
            opcoes: [
              'Porque substitui a limpeza dos utensílios.',
              'Porque ajuda a retirar sujeira das mãos.',
              'Porque dispensa secar as mãos nessa tarefa.',
            ],
            respostas: ['Porque ajuda a retirar sujeira das mãos.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nA higiene das mãos ajuda no cuidado com o corpo. Uma sequência pode incluir lavar, secar e depois começar outra atividade.\n\nObserve a situação\nNara estava brincando e vai lanchar. Nesta tarefa, ela vai lavar as mãos, secar as mãos com uma toalha limpa e só então começar a comer.',
        dica: 'Pense no que vem antes de secar as mãos e por que a limpeza é útil.',
        sucesso: 'Preparar as mãos antes da refeição faz parte do cuidado com o corpo.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v14.svg',
        descricaoIlustracao:
          'Secar as mãos com toalha limpa. Começar a comer o lanche. Lavar as mãos.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q16',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '16. Rotinas diferentes',
        instrucao: 'Compare apenas as duas rotinas apresentadas.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O que Lia e Teo fazem, mesmo em momentos diferentes?',
            opcoes: [
              'Vão à escola e brincam.',
              'Vão à escola só de manhã.',
              'Brincam somente à noite.',
            ],
            respostas: ['Vão à escola e brincam.'],
          },
          {
            pergunta: 'b) Qual diferença aparece nos registros?',
            opcoes: [
              'Só Lia brinca.',
              'Só Teo vai à escola.',
              'Eles vão à escola em momentos diferentes.',
            ],
            respostas: ['Eles vão à escola em momentos diferentes.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nAs rotinas podem ser diferentes. Estudar em outro momento do dia não torna uma rotina errada.\n\nObserve a situação\nLIA — vai à escola de manhã e brinca à tarde. TEO — brinca de manhã e vai à escola à tarde.',
        dica: 'Compare primeiro as atividades. Depois compare manhã e tarde.',
        sucesso:
          'Lia e Teo estudam e brincam, mas organizam esses momentos de maneiras diferentes.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v15.svg',
        descricaoIlustracao:
          'Lia vai à escola de manhã e brinca à tarde. Teo brinca de manhã e vai à escola à tarde.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q17',
        bloco: 'Ciências · Uma rotina com cuidados',
        titulo: '17. Cuidar do corpo por dentro e por fora',
        instrucao: 'Responda sobre o coração e os momentos da rotina.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Qual é a função do coração apresentada no apoio?',
            opcoes: [
              'Guardar os alimentos.',
              'Bombear sangue pelo corpo.',
              'Medir a temperatura do corpo.',
            ],
            respostas: ['Bombear sangue pelo corpo.'],
          },
          {
            pergunta: 'b) Marque a brincadeira com movimento e o momento de sono: DUAS respostas.',
            opcoes: ['Pular corda.', 'Escrever o nome.', 'Guardar um livro.', 'Dormir à noite.'],
            respostas: ['Pular corda.', 'Dormir à noite.'],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nO coração bombeia sangue pelo corpo. Na rotina, também precisamos de momentos de brincadeira com movimento e de descanso. Cuidar do corpo inclui esses momentos.\n\nObserve a situação\nNa rotina de Ana aparecem quatro atividades: pular corda como brincadeira, escrever o nome, guardar um livro e dormir à noite.',
        dica: 'Em a), retome a função do coração. Em b), procure uma brincadeira e um momento de sono.',
        sucesso:
          'O coração bombeia sangue. Movimento e descanso fazem parte do cuidado com o corpo.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v16.svg',
        descricaoIlustracao:
          'Esquema simples do coração bombeando sangue pelo corpo. Na rotina de Ana aparecem pular corda como brincadeira, escrever o nome, guardar um livro e dormir à noite.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q18',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '18. Atitudes que cuidam do ambiente',
        instrucao: 'Marque as TRÊS atitudes de cuidado.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'a) Quais atitudes ajudam a cuidar do ambiente?',
            opcoes: [
              'Deixar uma embalagem no riacho.',
              'Fechar a torneira quando a água não está sendo usada.',
              'Colocar papel limpo na coleta de papel da escola.',
              'Quebrar galhos da árvore por brincadeira.',
              'Cuidar das árvores da praça.',
            ],
            respostas: [
              'Fechar a torneira quando a água não está sendo usada.',
              'Colocar papel limpo na coleta de papel da escola.',
              'Cuidar das árvores da praça.',
            ],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nCuidar do ambiente é cuidar dos lugares e dos recursos que usamos. Evitar desperdício e dar destino adequado aos resíduos são atitudes importantes.\n\nObserve a situação\nNa praça e na escola, diferentes pessoas fazem escolhas sobre água, resíduos e árvores.',
        dica: 'Pense no efeito de cada atitude sobre a água, os resíduos ou as árvores.',
        sucesso: 'Cuidar da água, separar resíduos adequados e proteger árvores ajuda o ambiente.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v17.svg',
        descricaoIlustracao:
          'Cinco atitudes: deixar embalagem no riacho; fechar a torneira quando a água não é usada; colocar papel limpo na coleta de papel da escola; quebrar galhos por brincadeira; cuidar das árvores da praça.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q19',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '19. Água sem desperdício',
        instrucao: 'Escolha o cuidado adequado em cada caso.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Enquanto passa sabonete, qual escolha evita desperdício?',
            opcoes: [
              'Deixar a água correndo durante toda a pausa.',
              'Desistir de lavar as mãos.',
              'Fechar a torneira e abri-la quando precisar enxaguar.',
            ],
            respostas: ['Fechar a torneira e abri-la quando precisar enxaguar.'],
          },
          {
            pergunta: 'b) O que Aline deve fazer antes de sair?',
            opcoes: [
              'Fechar a torneira.',
              'Deixar a água correr até outra pessoa chegar.',
              'Usar mais água sem necessidade.',
            ],
            respostas: ['Fechar a torneira.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nEconomizar água não significa deixar de fazer a higiene. Podemos usar a água necessária e fechar a torneira quando ela não é usada.\n\nObserve a situação\nCaso A: Bruno está passando sabonete nas mãos, sem usar a água nesse momento. Caso B: depois de usar a pia, Aline vai sair e a torneira ainda está aberta.',
        dica: 'Observe em que momento a água está sendo usada e em que momento está apenas correndo.',
        sucesso: 'Podemos manter a higiene e evitar que a água corra sem necessidade.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v18.svg',
        descricaoIlustracao:
          'A: Bruno passa sabonete nas mãos e não está usando a água que corre. B: Aline vai sair depois de usar a pia, mas a torneira continua aberta.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q20',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '20. Usar o que precisamos',
        instrucao: 'Escolha o que evita desperdício nesses casos.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'a) Fê precisa escrever uma nova atividade. Qual escolha aproveita o material?',
            opcoes: [
              'Trocar o caderno só para ter outra capa.',
              'Usar uma página vazia do caderno.',
              'Jogar o caderno inteiro fora.',
            ],
            respostas: ['Usar uma página vazia do caderno.'],
          },
          {
            pergunta: 'b) O rascunho pode ser feito de um lado só. O que Jo pode fazer?',
            opcoes: [
              'Usar o lado limpo da folha.',
              'Descartar a folha sem olhar o outro lado.',
              'Usar só folhas novas, mesmo tendo um lado limpo disponível.',
            ],
            respostas: ['Usar o lado limpo da folha.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nReduzir desperdício é usar os recursos com atenção. Antes de pegar ou comprar outro material, veja se o que você tem ainda atende à tarefa.\n\nObserve a situação\nCaso A: o caderno de Fê está inteiro e tem muitas páginas vazias. Caso B: Jo precisa de uma folha para rascunho e tem uma folha limpa em um dos lados.',
        dica: 'Confira se o material disponível ainda serve para a tarefa.',
        sucesso: 'Quando o material ainda serve, aproveitá-lo evita desperdício.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v19.svg',
        descricaoIlustracao:
          'A: o caderno de Fê está inteiro e tem páginas vazias. B: Jo tem uma folha usada só de um lado; o outro lado está limpo para rascunho.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q21',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '21. Uma embalagem com novo uso',
        instrucao: 'Ordene as ações e identifique o novo uso.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Coloque os TRÊS cartões na ordem desse caso.',
            tipo: 'ordenacao',
            cartoes: [
              'Colocar os blocos na caixa.',
              'Pedir ao adulto que confira a caixa limpa e inteira.',
              'Fechar a tampa com os blocos dentro.',
            ],
            respostas: [
              'Pedir ao adulto que confira a caixa limpa e inteira.',
              'Colocar os blocos na caixa.',
              'Fechar a tampa com os blocos dentro.',
            ],
            rotuloOrdem: 'Ordem das ações da tarefa',
          },
          {
            pergunta: 'b) Qual é o novo uso da caixa?',
            opcoes: ['Guardar alimentos.', 'Transportar roupas.', 'Guardar os blocos.'],
            respostas: ['Guardar os blocos.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nReutilizar é manter um objeto em uso ou dar outra função a ele. Um pote que guardava alimentos pode, depois de preparado por um adulto, guardar peças de um jogo.\n\nObserve a situação\nUma caixa vazia será usada para guardar blocos. Primeiro, um adulto precisa conferir se ela está limpa e inteira. Os blocos só serão colocados depois dessa conferência. A tampa será fechada depois de colocar os blocos.',
        dica: 'Antes de colocar os blocos, o que precisa ser conferido? A tampa fecha depois de quê?',
        sucesso:
          'A caixa ganhou novo uso. Reutilizar pode evitar que um objeto útil seja descartado.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v20.svg',
        descricaoIlustracao:
          'Colocar os blocos na caixa. Pedir ao adulto que confira a caixa limpa e inteira. Fechar a tampa com os blocos dentro.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q22',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '22. Cada resíduo no seu grupo',
        instrucao: 'Use a legenda para classificar cada resíduo.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Uma garrafa plástica vazia aceita pela coleta vai para:',
            opcoes: ['Orgânicos', 'Rejeitos', 'Recicláveis'],
            respostas: ['Recicláveis'],
          },
          {
            pergunta: 'b) Uma casca de banana vai para:',
            opcoes: ['Recicláveis', 'Orgânicos', 'Rejeitos'],
            respostas: ['Orgânicos'],
          },
          {
            pergunta: 'c) Papel higiênico usado vai para:',
            opcoes: ['Rejeitos', 'Recicláveis', 'Orgânicos'],
            respostas: ['Rejeitos'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nNem todo resíduo vai à reciclagem comum. Use a regra do lugar. Neste exemplo, há grupos separados para recicláveis, orgânicos e rejeitos.\n\nObserve a situação\nLegenda da escola do exemplo: RECICLÁVEIS — embalagens de plástico vazias, papel limpo e seco, latas vazias e recipientes de vidro aceitos pela coleta. ORGÂNICOS — restos de alimentos e cascas de frutas. REJEITOS — materiais de higiene usados, que não vão à reciclagem comum. A casca será encaminhada por um adulto ao local de orgânicos da escola.',
        dica: 'Compare o tipo e o estado de cada resíduo com a legenda da escola.',
        sucesso:
          'Você usou a legenda: recicláveis, orgânicos e rejeitos têm encaminhamentos diferentes.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v21.svg',
        descricaoIlustracao:
          'Coletores identificados como Recicláveis, Orgânicos e Rejeitos. Para classificar, há uma garrafa plástica vazia, uma casca de banana e papel higiênico usado. A regra de cada grupo está na legenda da escola.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q23',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '23. Reduzir, reutilizar ou reciclar?',
        instrucao: 'Escolha o R que melhor descreve a ação destacada.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'a) Uma fábrica transforma papel descartado em papel novo. Essa transformação é:',
            opcoes: ['reutilizar', 'reciclar', 'reduzir'],
            respostas: ['reciclar'],
          },
          {
            pergunta: 'b) Nina escolhe não pegar uma embalagem extra de que não precisa. Ela está:',
            opcoes: [
              'reduzindo o consumo desnecessário',
              'reutilizando a embalagem',
              'reciclando o material',
            ],
            respostas: ['reduzindo o consumo desnecessário'],
          },
          {
            pergunta:
              'c) Uma caixa que já foi usada passa a guardar peças de quebra-cabeça. Isso é:',
            opcoes: ['reciclar', 'reduzir', 'reutilizar'],
            respostas: ['reutilizar'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nREDUZIR: evitar consumo e desperdício desnecessários. REUTILIZAR: manter um objeto em uso ou dar outra função. RECICLAR: transformar o material descartado para produzir outro material ou objeto. Separar para a coleta ajuda a reciclagem, mas não é a transformação em si.\n\nObserve a situação\nLeia três ações diferentes. Cada uma destaca um dos três Rs.',
        dica: 'Observe se a ação evita consumo, mantém o objeto ou transforma o material.',
        sucesso: 'Você distinguiu os três Rs pela ação realizada.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v22.svg',
        descricaoIlustracao:
          'Uma fábrica transforma papel descartado em papel novo. Nina escolhe não pegar uma embalagem extra de que não precisa. Uma caixa que já foi usada passa a guardar peças de quebra-cabeça.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q24',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '24. Os resíduos não somem de repente',
        instrucao: 'Observe o exemplo e pense no descarte.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual resíduo apresenta a mudança de forma destacada no quadro de depois?',
            opcoes: [
              'Somente a embalagem plástica.',
              'Somente a casca de fruta.',
              'Os dois estão com a mesma forma de antes.',
            ],
            respostas: ['Somente a casca de fruta.'],
          },
          {
            pergunta: 'b) O que esse exemplo ajuda a lembrar?',
            opcoes: [
              'Deixar resíduos no ambiente resolve o descarte.',
              'Todos os resíduos mudam no mesmo tempo.',
              'É preciso dar destino adequado aos resíduos.',
            ],
            respostas: ['É preciso dar destino adequado aos resíduos.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nResíduos largados no ambiente não desaparecem de repente. Eles podem mudar com o tempo, e essas mudanças dependem do material e das condições do lugar.\n\nObserve a situação\nEste é um exemplo ilustrado, sem duração medida. No primeiro quadro há uma casca de fruta e uma embalagem plástica. No quadro de depois, a casca está escura e em pedaços menores; a embalagem continua inteira e visível.',
        dica: 'Compare o mesmo resíduo antes e depois. Ainda há material no lugar?',
        sucesso:
          'Um resíduo pode mudar e outro permanecer visível. O cuidado é dar destino adequado a ambos.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v23.svg',
        descricaoIlustracao:
          'Exemplo sem duração medida: antes, casca de fruta e embalagem plástica; depois, casca escura e em pedaços menores, enquanto a embalagem continua inteira e visível.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q25',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '25. Rios e mares precisam de cuidado',
        instrucao: 'Pense nas consequências e na escolha de cuidado.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Por que a sacola na água pode ser perigosa?',
            opcoes: [
              'Um animal pode confundi-la com alimento.',
              'Ela é sempre segura porque flutua.',
              'Lixo só prejudica animais quando afunda.',
            ],
            respostas: ['Um animal pode confundi-la com alimento.'],
          },
          {
            pergunta: 'b) Qual atitude dá destino adequado à embalagem da segunda cena?',
            opcoes: [
              'Deixá-la no chão até chover.',
              'Encaminhá-la ao coletor que aceita essa embalagem.',
              'Colocá-la na água para sair do chão.',
            ],
            respostas: ['Encaminhá-la ao coletor que aceita essa embalagem.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nLixo na água pode prejudicar os seres vivos. Um resíduo continua sendo problema quando fica na superfície ou quando vai para o fundo.\n\nObserve a situação\nUma sacola descartada flutua perto de animais aquáticos. Em outra cena, uma embalagem plástica vazia está fora da água, ao lado do coletor que aceita esse tipo de embalagem.',
        dica: 'Pense no que pode acontecer ao animal e confira a regra do coletor.',
        sucesso:
          'Resíduos na água podem prejudicar os animais. O descarte adequado ajuda a cuidar deles.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v24.svg',
        descricaoIlustracao:
          'Uma sacola flutua perto de animais aquáticos. Em outra cena, uma embalagem plástica vazia está fora da água, ao lado de um coletor que aceita esse tipo de embalagem.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q26',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '26. Observar o que aconteceu',
        instrucao: 'Classifique o resultado observado para cada objeto.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O bloco de madeira, junto à superfície, está:',
            opcoes: ['afundando no fundo da tigela', 'flutuando'],
            respostas: ['flutuando'],
          },
          {
            pergunta: 'b) A chave de metal foi para o fundo. Nesse teste, ela:',
            opcoes: ['afundou', 'flutuou'],
            respostas: ['afundou'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nFlutuar é permanecer junto à superfície da água. Afundar é ir para baixo da superfície. Para saber o resultado de um teste, observamos o que aconteceu.\n\nObserve a situação\nNo resultado ilustrado deste teste, um bloco de madeira está junto à superfície. Uma chave de metal está no fundo da tigela. São os resultados dos objetos desse exemplo.',
        dica: 'Observe a linha que marca a superfície e a posição de cada objeto.',
        sucesso: 'Você classificou o que observou: um objeto junto à superfície e outro no fundo.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v25.svg',
        descricaoIlustracao:
          'Neste resultado ilustrado, um bloco de madeira está junto à superfície da água e uma chave de metal está no fundo da tigela.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q27',
        bloco: 'Ciências · Cuidar do ambiente',
        titulo: '27. Uma árvore na praça',
        instrucao: 'Observe a relação entre a árvore, os animais e o espaço.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O ninho nos galhos mostra qual contribuição da árvore?',
            opcoes: [
              'Fazer sombra sobre o banco.',
              'Servir de alimento aos pássaros.',
              'Oferecer um lugar de abrigo.',
            ],
            respostas: ['Oferecer um lugar de abrigo.'],
          },
          {
            pergunta: 'b) Qual escolha cuida da árvore durante a brincadeira?',
            opcoes: [
              'Quebrar galhos para fabricar brinquedos.',
              'Brincar sem arrancar ou quebrar os galhos.',
              'Puxar o ninho para ver os pássaros.',
            ],
            respostas: ['Brincar sem arrancar ou quebrar os galhos.'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nÁrvores fazem parte do ambiente. Elas podem oferecer sombra e abrigo para seres vivos. Cuidar de uma praça também envolve cuidar de suas árvores.\n\nObserve a situação\nNa árvore da praça há um ninho ocupado por pássaros. A sombra fica sobre um banco. Um grupo quer brincar perto da árvore sem danificar seus galhos.',
        dica: 'Observe onde os pássaros estão abrigados e o que preserva esse lugar.',
        sucesso: 'A árvore oferece abrigo e sombra. Podemos brincar e preservar esse espaço.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v26.svg',
        descricaoIlustracao:
          'Uma árvore da praça tem um ninho ocupado por pássaros nos galhos. Sua sombra fica sobre um banco. Há espaço para brincar perto sem danificar os galhos.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q28',
        bloco: 'Ciências · Missão final',
        titulo: '28. Missão final: escolher objetos',
        instrucao: 'Use a história para escolher os objetos.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual instrumento ajuda Lia e Rui a consultar o horário de início?',
            opcoes: ['Régua', 'Relógio', 'Termômetro'],
            respostas: ['Relógio'],
          },
          {
            pergunta: 'b) Qual objeto permite apagar um traço de lápis no cartaz?',
            opcoes: ['Apontador', 'Pente', 'Borracha'],
            respostas: ['Borracha'],
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nVamos juntar o que aprendemos. Pense no objetivo da tarefa, na ordem das ações e no cuidado com os materiais.\n\nObserve a situação\nLia e Rui vão desenhar um cartaz sobre o cuidado com a praça. O trabalho começa no horário combinado. Eles precisam pegar os materiais, fazer o cartaz e guardar tudo depois. Há uma caixa de brinquedos vazia, limpa e inteira. Eles vão usá-la para guardar os lápis. O papel usado só de um lado ainda pode servir de rascunho. Na escola, papel limpo e seco pode ir à coleta de recicláveis.',
        dica: 'Uma tarefa consulta tempo; a outra corrige um traço de lápis.',
        sucesso: 'Você aplicou as funções dos objetos a uma nova tarefa.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v27.svg',
        descricaoIlustracao:
          'Lia e Rui vão fazer um cartaz sobre o cuidado com a praça no horário combinado. Há materiais de desenho, caixa vazia limpa e inteira, papel com um lado disponível para rascunho e coleta de papel limpo e seco.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q29',
        bloco: 'Ciências · Missão final',
        titulo: '29. Missão final: organizar e cuidar',
        instrucao: 'Organize a tarefa e escolha os cuidados com os materiais.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Coloque os TRÊS cartões na ordem do trabalho.',
            tipo: 'ordenacao',
            cartoes: [
              'Guardar os materiais depois do trabalho.',
              'Desenhar o cartaz com os materiais.',
              'Pegar os materiais para começar.',
            ],
            respostas: [
              'Pegar os materiais para começar.',
              'Desenhar o cartaz com os materiais.',
              'Guardar os materiais depois do trabalho.',
            ],
            rotuloOrdem: 'Ordem das ações da tarefa',
          },
          {
            pergunta: 'b) Marque as DUAS escolhas que aproveitam materiais da história.',
            opcoes: [
              'Usar a caixa vazia para guardar os lápis.',
              'Trocar materiais inteiros só para ter novos.',
              'Usar o lado limpo do papel para rascunho.',
              'Deixar os lápis espalhados e comprar outros.',
            ],
            respostas: [
              'Usar a caixa vazia para guardar os lápis.',
              'Usar o lado limpo do papel para rascunho.',
            ],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nUma tarefa fica mais organizada quando pensamos no que vem antes e depois. Também podemos aproveitar materiais que ainda servem.\n\nObserve a situação\nLia e Rui vão desenhar um cartaz sobre o cuidado com a praça. O trabalho começa no horário combinado. Eles precisam pegar os materiais, fazer o cartaz e guardar tudo depois. Há uma caixa de brinquedos vazia, limpa e inteira. Eles vão usá-la para guardar os lápis. O papel usado só de um lado ainda pode servir de rascunho. Na escola, papel limpo e seco pode ir à coleta de recicláveis.',
        dica: 'Comece pelo que permite fazer o trabalho. Depois procure materiais que ainda podem ser usados.',
        sucesso: 'Você organizou o trabalho e escolheu aproveitar materiais úteis.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v27.svg',
        descricaoIlustracao:
          'Lia e Rui vão fazer um cartaz sobre o cuidado com a praça no horário combinado. Há materiais de desenho, caixa vazia limpa e inteira, papel com um lado disponível para rascunho e coleta de papel limpo e seco.',
      },
      {
        id: 'ciencias-sustentabilidade-rotina-objetos-q30',
        bloco: 'Ciências · Missão final',
        titulo: '30. Missão final: nosso cuidado faz diferença',
        instrucao: 'Responda aos três itens para terminar a missão.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) O que ajuda a caixa a cumprir a função de guardar os lápis?',
            opcoes: [
              'Estar inteira e ter espaço para os lápis.',
              'Ter desenhos coloridos em sua superfície.',
              'Ser da mesma cor que os lápis.',
            ],
            respostas: ['Estar inteira e ter espaço para os lápis.'],
          },
          {
            pergunta: 'b) Dar à caixa usada a função de guardar lápis é:',
            opcoes: [
              'reciclar o material',
              'reutilizar a caixa',
              'reduzir o consumo antes da compra',
            ],
            respostas: ['reutilizar a caixa'],
          },
          {
            pergunta: 'c) Marque as DUAS atitudes de cuidado com o papel da história.',
            opcoes: [
              'Descartar a folha que ainda tem um lado útil.',
              'Aproveitar o lado limpo para rascunho.',
              'Colocar qualquer resíduo na coleta de papel.',
              'Encaminhar papel limpo e seco à coleta indicada.',
            ],
            respostas: [
              'Aproveitar o lado limpo para rascunho.',
              'Encaminhar papel limpo e seco à coleta indicada.',
            ],
            tipo: 'selecao',
          },
        ],
        leituraTitulo: 'Leia para aprender e observe a situação',
        leitura:
          'Leia para aprender\nObserve função, novo uso e destino dos resíduos. Nem todo material precisa ser descartado, e nem todo resíduo vai para o mesmo grupo.\n\nObserve a situação\nLia e Rui vão desenhar um cartaz sobre o cuidado com a praça. O trabalho começa no horário combinado. Eles precisam pegar os materiais, fazer o cartaz e guardar tudo depois. Há uma caixa de brinquedos vazia, limpa e inteira. Eles vão usá-la para guardar os lápis. O papel usado só de um lado ainda pode servir de rascunho. Na escola, papel limpo e seco pode ir à coleta de recicláveis.',
        dica: 'Pense no que mantém a função da caixa, no novo uso e na regra para o papel.',
        sucesso: 'Missão cumprida! Você relacionou objetos, rotina e cuidado com o ambiente.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/microscope.svg',
        ilustracaoLeitura:
          '../assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/v27.svg',
        descricaoIlustracao:
          'Lia e Rui vão fazer um cartaz sobre o cuidado com a praça no horário combinado. Há materiais de desenho, caixa vazia limpa e inteira, papel com um lado disponível para rascunho e coleta de papel limpo e seco.',
      },
    ],
  });
})();
