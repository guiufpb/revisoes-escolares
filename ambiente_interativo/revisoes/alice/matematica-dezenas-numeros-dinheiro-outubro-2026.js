(function () {
  'use strict';
  // Conteúdo original aprovado; alternativas, bancos e cartões têm ordem fixa.
  window.QuestionariosRevisoes.registrar({
    id: 'alice-matematica-dezenas-numeros-dinheiro-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Matemática',
    titulo: 'Dezenas, números e dinheiro — descobertas da Alice',
    subtitulo: '1º ano · Prova de 13/10/2026 · 25 questões · 55 subitens · 25 pontos',
    chave: 'revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.v1',
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
          chaveArmazenamento:
            'revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Você contou grupos de dez, leu e escreveu números, juntou reais e comparou quantidades. Quando precisar conferir um número, procure suas dezenas e unidades. Quando precisar conferir dinheiro, leia o valor de cada peça. Se quiser, conte ao responsável qual estratégia mais ajudou você. Essa conversa não vale ponto.',
    questoes: [
      {
        id: 'q01',
        bloco: 'Matemática · Bloco A de 5 — Grupos que viram números',
        titulo: '1. Uma dezena na bandeja',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'uma dezena é um grupo de dez unidades. Você pode contar os objetos um de cada vez para conferir o grupo. Alice, vamos contar, ler números e brincar de fazer compras! Faça um bloco de cada vez. Se precisar, descanse entre os blocos. Você pode conferir, corrigir e tentar novamente. São 25 questões. Cada questão vale um ponto quando todos os seus itens estiverem corretos. Ao completar tudo, você terá 25 pontos!',
        itens: [
          {
            id: 'q01a',
            pergunta: '1a. Qual bandeja tem exatamente uma dezena de bolinhas?',
            opcoes: ['Bandeja C.', 'Bandeja A.', 'Bandeja B.'],
            respostas: ['Bandeja B.'],
          },
          {
            id: 'q01b',
            pergunta: '1b. Quantas bolinhas faltam na bandeja C para completar uma dezena?',
            opcoes: ['Duas bolinhas.', 'Uma bolinha.', 'Três bolinhas.'],
            respostas: ['Uma bolinha.'],
          },
        ],
        dica: 'Conte as bolinhas de cada bandeja. Procure o grupo que para exatamente no dez. Na bandeja C, continue a contagem até chegar a dez. Quantas bolinhas você precisou acrescentar?',
        sucesso:
          'A bandeja B tem dez bolinhas: uma dezena. A bandeja C tem nove; falta uma bolinha para completar dez. A bandeja A tem doze, por isso tem mais de uma dezena.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q01-bandejas.svg',
        descricaoIlustracao:
          'Bandeja A: duas fileiras de seis bolinhas. Bandeja B: duas fileiras de cinco. Bandeja C: uma fileira de cinco e outra de quatro.',
      },
      {
        id: 'q02',
        bloco: 'Matemática · Bloco A de 5 — Grupos que viram números',
        titulo: '2. Barras e cubinhos',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Descubra comigo',
        leitura:
          'no material dourado, uma barra vale dez unidades. Um cubinho vale uma unidade. Se houver uma barra e três cubinhos, teremos dez mais três: treze unidades. Observe a coleção. Cada barra vale dez e cada cubinho vale uma unidade. Escreva as respostas em algarismos.',
        itens: [
          {
            id: 'q02a',
            pergunta: '2a. Quantas barras de dez há?',
            respostas: ['2'],
            feedbackErros: {
              palavras: 'Conte apenas as barras compridas.',
            },
          },
          {
            id: 'q02b',
            pergunta: '2b. Quantos cubinhos soltos há?',
            respostas: ['7'],
            feedbackErros: {
              palavras: 'Agora conte apenas os cubinhos soltos.',
            },
          },
          {
            id: 'q02c',
            pergunta:
              '2c. Quantas unidades há ao todo, contando o valor das barras e dos cubinhos?',
            respostas: ['27'],
            feedbackErros: {
              palavras:
                'Cada barra vale dez. Conte o valor das barras e só depois acrescente os cubinhos.',
            },
          },
        ],
        dica: 'Conte apenas as barras compridas. Agora conte apenas os cubinhos soltos. Cada barra vale dez. Conte o valor das barras e só depois acrescente os cubinhos.',
        sucesso:
          'Duas barras formam duas dezenas, que valem vinte unidades. Com os sete cubinhos, temos vinte e sete: 27. São duas dezenas e sete unidades soltas.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q02-base-dez.svg',
        descricaoIlustracao: 'Duas barras de dez e sete cubinhos soltos.',
      },
      {
        id: 'q03',
        bloco: 'Matemática · Bloco A de 5 — Grupos que viram números',
        titulo: '3. O algarismo mudou de lugar!',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'D é a coluna das dezenas. U é a coluna das unidades. No número 35, o 3 está em D e vale trinta unidades. O 5 está em U e vale cinco unidades.',
        itens: [
          {
            id: 'q03a',
            pergunta: '3a. No número 26, qual é o valor do algarismo 2?',
            opcoes: ['Duas unidades.', 'Vinte e seis unidades.', 'Vinte unidades.'],
            respostas: ['Vinte unidades.'],
          },
          {
            id: 'q03b',
            pergunta: '3b. No número 62, qual é o valor do algarismo 2?',
            opcoes: ['Vinte unidades.', 'Duas unidades.', 'Sessenta e duas unidades.'],
            respostas: ['Duas unidades.'],
          },
        ],
        dica: 'O 2 está na coluna D ou na coluna U? Na coluna D, contamos grupos de dez. Veja a coluna em que o 2 aparece no segundo número. Cada unidade dessa coluna vale um.',
        sucesso:
          'Em 26, o 2 representa vinte unidades. Em 62, representa duas unidades. O algarismo é o mesmo, mas sua posição muda seu valor.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q03-quadro-du.svg',
        descricaoIlustracao:
          'Quadro com colunas D e U. Na primeira linha, numeral 26, 2 em D e 6 em U; na segunda, numeral 62, 6 em D e 2 em U.',
      },
      {
        id: 'q04',
        bloco: 'Matemática · Bloco A de 5 — Grupos que viram números',
        titulo: '4. Encontre o material dourado',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'para representar um número, observe suas dezenas e suas unidades. Quando U é zero, não há cubinhos soltos. No número 50, por exemplo, há cinco dezenas e nenhuma unidade solta.',
        itens: [
          {
            id: 'q04a',
            pergunta: '4a. Qual coleção representa 40?',
            opcoes: [
              'A — Quatro barras e nenhum cubinho.',
              'B — Nenhuma barra e quatro cubinhos.',
              'C — Quatro barras e um cubinho.',
            ],
            respostas: ['A — Quatro barras e nenhum cubinho.'],
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q04a-opcoes.svg',
            imagemAlt:
              'A: quatro barras e nenhum cubinho. B: nenhuma barra e quatro cubinhos. C: quatro barras e um cubinho.',
            imagemAmpla: true,
          },
          {
            id: 'q04b',
            pergunta: '4b. Qual coleção representa 83?',
            opcoes: [
              'A — Três barras e oito cubinhos.',
              'B — Oito barras e três cubinhos.',
              'C — Oito barras e nenhum cubinho.',
            ],
            respostas: ['B — Oito barras e três cubinhos.'],
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q04b-opcoes.svg',
            imagemAlt:
              'A: três barras e oito cubinhos. B: oito barras e três cubinhos. C: oito barras e nenhum cubinho.',
            imagemAmpla: true,
          },
        ],
        dica: 'Observe o algarismo das dezenas e o zero das unidades. Quantas barras são necessárias? Deve sobrar algum cubinho? Confira primeiro quantas barras há. Depois conte somente os cubinhos soltos. Não troque as posições.',
        sucesso:
          '40 tem quatro dezenas e zero unidades soltas. 83 tem oito dezenas e três unidades. Uma barra vale dez; um cubinho vale um.',
        opcoesReversiveis: true,
      },
      {
        id: 'q05',
        bloco: 'Matemática · Bloco A de 5 — Grupos que viram números',
        titulo: '5. Números no ábaco',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'o ábaco tem uma haste para D e outra para U. Cada argola em D representa uma dezena. Cada argola em U representa uma unidade. Uma haste vazia representa zero naquela posição. Duas argolas em D e uma em U, por exemplo, representam vinte e um.',
        itens: [
          {
            id: 'q05a',
            pergunta: '5a. Que número aparece neste ábaco? Escreva em algarismos.',
            respostas: ['54'],
            feedbackErros: {
              palavras: 'Conte as argolas da haste D separadamente das argolas da haste U.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q05a-abaco.svg',
            imagemAlt: 'Ábaco com cinco argolas na haste D e quatro na haste U.',
          },
          {
            id: 'q05b',
            pergunta: '5b. Que número aparece neste ábaco? Escreva em algarismos.',
            respostas: ['90'],
            feedbackErros: {
              palavras: 'A haste U está vazia. Que algarismo registra uma coluna sem unidades?',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q05b-abaco.svg',
            imagemAlt: 'Ábaco com nove argolas na haste D e nenhuma na haste U.',
          },
        ],
        dica: 'Conte as argolas da haste D separadamente das argolas da haste U. A haste U está vazia. Que algarismo registra uma coluna sem unidades?',
        sucesso:
          'O primeiro ábaco mostra cinquenta e quatro: 54. O segundo mostra noventa: 90. O zero registra a ausência de unidades soltas, mas as nove dezenas continuam valendo noventa.',
        opcoesReversiveis: true,
      },
      {
        id: 'q06',
        bloco: 'Matemática · Bloco B de 5 — De dez em dez',
        titulo: '6. Dezenas sem sobras',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'selecao',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'uma dezena exata tem grupos completos de dez e nenhuma unidade sobrando. Nos números de duas posições, o zero em U mostra que não há unidades soltas.',
        itens: [
          {
            id: 'q06a',
            pergunta:
              '6a. Marque todos os cartões que mostram dezenas exatas. Você pode desmarcar um cartão para corrigir.',
            opcoes: ['40', '70', '14', '7', '90', '59', '31', '20'],
            respostas: ['40', '70', '90', '20'],
          },
        ],
        dica: 'Veja as unidades de cada cartão. Nas dezenas exatas desta atividade, não sobra nenhuma unidade. Confira se marcou algum número com unidades restantes ou se esqueceu algum grupo completo.',
        sucesso:
          'Você encontrou 40, 70, 90 e 20. Todos têm dezenas completas e zero unidades soltas. Agora, vamos conhecer os nomes de todas as dezenas exatas de dez a noventa. Leia devagar e conte de dez em dez. 10 — dez; 20 — vinte; 30 — trinta; 40 — quarenta; 50 — cinquenta; 60 — sessenta; 70 — setenta; 80 — oitenta; 90 — noventa. Repare: sessenta tem dois esses juntos. Quarenta começa com qua. Na próxima questão, você vai usar os nomes que acabou de estudar.',
        opcoesReversiveis: true,
      },
      {
        id: 'q07',
        bloco: 'Matemática · Bloco B de 5 — De dez em dez',
        titulo: '7. As dezenas têm nomes',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'podemos escrever uma quantidade com algarismos ou por extenso. Para ligar um número ao nome, leia a palavra inteira. Não use apenas a posição do cartão. Associe cada número a um nome do banco. Use cada nome uma vez. Banco: trinta · noventa · dez · cinquenta · setenta.',
        itens: [
          {
            id: 'q07a',
            pergunta: '7a. 70 — Nome escolhido:',
            opcoes: ['trinta', 'noventa', 'dez', 'cinquenta', 'setenta'],
            respostas: ['setenta'],
          },
          {
            id: 'q07b',
            pergunta: '7b. 10 — Nome escolhido:',
            opcoes: ['trinta', 'noventa', 'dez', 'cinquenta', 'setenta'],
            respostas: ['dez'],
          },
          {
            id: 'q07c',
            pergunta: '7c. 90 — Nome escolhido:',
            opcoes: ['trinta', 'noventa', 'dez', 'cinquenta', 'setenta'],
            respostas: ['noventa'],
          },
          {
            id: 'q07d',
            pergunta: '7d. 30 — Nome escolhido:',
            opcoes: ['trinta', 'noventa', 'dez', 'cinquenta', 'setenta'],
            respostas: ['trinta'],
          },
          {
            id: 'q07e',
            pergunta: '7e. 50 — Nome escolhido:',
            opcoes: ['trinta', 'noventa', 'dez', 'cinquenta', 'setenta'],
            respostas: ['cinquenta'],
          },
        ],
        dica: 'Leia o nome inteiro do cartão. Pense em quantos grupos de dez o numeral representa. Confira cada ligação, mesmo que as outras já pareçam certas.',
        sucesso:
          '70 é setenta; 10 é dez; 90 é noventa; 30 é trinta; 50 é cinquenta. Os nomes não estavam na mesma ordem dos numerais: você precisou ler para associar.',
        opcoesReversiveis: true,
      },
      {
        id: 'q08',
        bloco: 'Matemática · Bloco B de 5 — De dez em dez',
        titulo: '8. Conte as barras e escreva o nome',
        instrucao: 'Escreva por extenso. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'cada barra vale dez. Conte de dez em dez. Depois, escreva por extenso o nome do número que você encontrou. Não há cubinhos soltos nestas coleções.',
        itens: [
          {
            id: 'q08a',
            pergunta: '8a. Conte as barras e escreva por extenso o nome do número.',
            respostas: ['sessenta', 'sessenta.'],
            feedbackErros: {
              palavras:
                'Cada barra vale dez. Conte de dez em dez sem contar uma barra duas vezes. Você já estudou o nome dessa dezena. Recupere o nome inteiro, em vez de escrever apenas o nome do algarismo. Nesse nome usamos dois esses juntos. Você pode corrigir e conferir de novo.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q08a-barras.svg',
            imagemAlt: 'Seis barras de dez e nenhum cubinho solto.',
          },
          {
            id: 'q08b',
            pergunta: '8b. Conte as barras e escreva por extenso o nome do número.',
            respostas: ['vinte', 'vinte.'],
            feedbackErros: {
              palavras:
                'Cada barra vale dez. Conte de dez em dez sem contar uma barra duas vezes. Você já estudou o nome dessa dezena. Recupere o nome inteiro, em vez de escrever apenas o nome do algarismo.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q08b-barras.svg',
            imagemAlt: 'Duas barras de dez e nenhum cubinho solto.',
          },
          {
            id: 'q08c',
            pergunta: '8c. Conte as barras e escreva por extenso o nome do número.',
            respostas: ['oitenta', 'oitenta.'],
            feedbackErros: {
              palavras:
                'Cada barra vale dez. Conte de dez em dez sem contar uma barra duas vezes. Você já estudou o nome dessa dezena. Recupere o nome inteiro, em vez de escrever apenas o nome do algarismo.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q08c-barras.svg',
            imagemAlt: 'Oito barras de dez e nenhum cubinho solto.',
          },
          {
            id: 'q08d',
            pergunta: '8d. Conte as barras e escreva por extenso o nome do número.',
            respostas: ['quarenta', 'quarenta.'],
            feedbackErros: {
              palavras:
                'Cada barra vale dez. Conte de dez em dez sem contar uma barra duas vezes. Você já estudou o nome dessa dezena. Recupere o nome inteiro, em vez de escrever apenas o nome do algarismo.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q08d-barras.svg',
            imagemAlt: 'Quatro barras de dez e nenhum cubinho solto.',
          },
        ],
        dica: 'Cada barra vale dez. Conte de dez em dez sem contar uma barra duas vezes. Você já estudou o nome dessa dezena. Recupere o nome inteiro, em vez de escrever apenas o nome do algarismo.',
        sucesso:
          'Seis barras valem sessenta; duas valem vinte; oito valem oitenta; quatro valem quarenta. Você descobriu as quantidades e escreveu seus nomes.',
        opcoesReversiveis: true,
      },
      {
        id: 'q09',
        bloco: 'Matemática · Bloco B de 5 — De dez em dez',
        titulo: '9. Mais uma dezena',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'em uma sequência de dez em dez, cada passo acrescenta uma dezena. Depois de nove dezenas, mais uma dezena completa dez dezenas. Dez dezenas recebem o nome cem.',
        itens: [
          {
            id: 'q09a',
            pergunta: '9a. 30 → ______ → 50. Acrescentar dez por passo.',
            respostas: ['40'],
            feedbackErros: {
              palavras:
                'Cada seta acrescenta dez, e não uma unidade. Continue a contagem de dezenas.',
            },
          },
          {
            id: 'q09b',
            pergunta: '9b. 80 → 90 → ______. Acrescentar dez por passo.',
            respostas: ['100'],
            feedbackErros: {
              palavras:
                'Depois de nove grupos de dez, acrescentamos mais um grupo. O apoio explicou o nome desse novo total. Registre-o com algarismos.',
            },
          },
        ],
        dica: 'Cada seta acrescenta dez, e não uma unidade. Continue a contagem de dezenas. Depois de nove grupos de dez, acrescentamos mais um grupo. O apoio explicou o nome desse novo total. Registre-o com algarismos.',
        sucesso:
          'A primeira sequência é 30, 40, 50. A segunda é 80, 90, 100. Ao juntar dez dezenas, chegamos a cem.',
        opcoesReversiveis: true,
      },
      {
        id: 'q10',
        bloco: 'Matemática · Bloco B de 5 — De dez em dez',
        titulo: '10. Juntando pacotes',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Descubra comigo',
        leitura:
          'para juntar dezenas, conte os grupos de dez. Uma dezena mais uma dezena forma duas dezenas. Quando todos os grupos estão completos, não sobram unidades soltas.',
        itens: [
          {
            id: 'q10a',
            pergunta:
              '10a. Na oficina de arte havia 20 cartões. Chegaram mais 30 cartões. Quantos cartões há agora? 20 + 30 = ______ cartões.',
            respostas: ['50'],
            feedbackErros: {
              palavras:
                'Pense em duas dezenas e mais três dezenas. Conte quantas dezenas ficam juntas.',
            },
          },
          {
            id: 'q10b',
            pergunta:
              '10b. Uma turma juntou 40 tampinhas e outra juntou 20. Quantas tampinhas as duas turmas juntaram ao todo? 40 + 20 = ______ tampinhas.',
            respostas: ['60'],
            feedbackErros: {
              palavras:
                'Junte quatro grupos de dez e dois grupos de dez. Cada grupo continua valendo dez.',
            },
          },
        ],
        dica: 'Pense em duas dezenas e mais três dezenas. Conte quantas dezenas ficam juntas. Junte quatro grupos de dez e dois grupos de dez. Cada grupo continua valendo dez.',
        sucesso:
          'Vinte mais trinta são cinquenta cartões. Quarenta mais vinte são sessenta tampinhas. Somamos os grupos completos de dez e mantivemos zero nas unidades.',
        opcoesReversiveis: true,
      },
      {
        id: 'q11',
        bloco: 'Matemática · Bloco C de 5 — Números têm nomes',
        titulo: '11. Leia o nome inteiro',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'alguns nomes de números precisam de atenção. Doze, por exemplo, é o nome de 12. Observe o numeral e leia cada palavra do banco com calma. Associe cada número ao seu nome. Use cada nome uma vez. Banco: quinze · dezoito · onze.',
        itens: [
          {
            id: 'q11a',
            pergunta: '11a. 18 — Nome escolhido:',
            opcoes: ['quinze', 'dezoito', 'onze'],
            respostas: ['dezoito'],
          },
          {
            id: 'q11b',
            pergunta: '11b. 11 — Nome escolhido:',
            opcoes: ['quinze', 'dezoito', 'onze'],
            respostas: ['onze'],
          },
          {
            id: 'q11c',
            pergunta: '11c. 15 — Nome escolhido:',
            opcoes: ['quinze', 'dezoito', 'onze'],
            respostas: ['quinze'],
          },
        ],
        dica: 'Leia cada palavra inteira. Esses números têm nomes próprios; não basta juntar o nome dez ao algarismo das unidades.',
        sucesso:
          '18 é dezoito; 11 é onze; 15 é quinze. Vamos guardar mais um nome: 14 pode ser escrito catorze ou quatorze. As duas formas estão corretas.',
        opcoesReversiveis: true,
      },
      {
        id: 'q12',
        bloco: 'Matemática · Bloco C de 5 — Números têm nomes',
        titulo: '12. Agora, escreva por extenso',
        instrucao: 'Escreva por extenso. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'nos números compostos, juntamos o nome da dezena e o das unidades com e. Por exemplo: 23 se escreve vinte e três. Os números entre onze e dezenove têm nomes próprios.',
        itens: [
          {
            id: 'q12a',
            pergunta: '12a. 14 — Escreva por extenso:',
            respostas: ['catorze', 'catorze.', 'quatorze', 'quatorze.'],
            feedbackErros: {
              palavras:
                'Esse número tem um nome próprio. Você acabou de conhecer duas maneiras corretas de escrevê-lo.',
            },
          },
          {
            id: 'q12b',
            pergunta: '12b. 32 — Escreva por extenso:',
            respostas: ['trinta e dois', 'trinta e dois.'],
            feedbackErros: {
              palavras:
                'Comece pelo nome da dezena. Depois ligue o nome das unidades com a palavra e.',
            },
          },
        ],
        dica: 'Esse número tem um nome próprio. Você acabou de conhecer duas maneiras corretas de escrevê-lo. Comece pelo nome da dezena. Depois ligue o nome das unidades com a palavra e.',
        sucesso:
          '14 se escreve catorze ou quatorze. 32 se escreve trinta e dois. Você registrou por extenso o nome inteiro de cada número.',
        opcoesReversiveis: true,
      },
      {
        id: 'q13',
        bloco: 'Matemática · Bloco C de 5 — Números têm nomes',
        titulo: '13. Etiquetas da coleção',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'ler por extenso ajuda a descobrir as dezenas e as unidades. “Cinquenta e um”, por exemplo, indica cinco dezenas e uma unidade. Na oficina, duas caixas receberam etiquetas com suas quantidades. Escreva cada quantidade em algarismos.',
        itens: [
          {
            id: 'q13a',
            pergunta: '13a. Caixa de estrelas: quarenta e oito. Quantidade:',
            respostas: ['48'],
            feedbackErros: {
              palavras:
                'Quarenta informa as dezenas. Oito informa as unidades. Coloque cada algarismo em sua posição.',
            },
          },
          {
            id: 'q13b',
            pergunta: '13b. Caixa de folhas de papel: noventa e sete. Quantidade:',
            respostas: ['97'],
            feedbackErros: {
              palavras:
                'Leia primeiro o nome da dezena e depois o das unidades. Não inverta a ordem.',
            },
          },
        ],
        dica: 'Quarenta informa as dezenas. Oito informa as unidades. Coloque cada algarismo em sua posição. Leia primeiro o nome da dezena e depois o das unidades. Não inverta a ordem.',
        sucesso:
          'A caixa de estrelas tem 48 itens. A caixa de folhas tem 97. O nome escrito ajudou você a encontrar dezenas e unidades.',
        opcoesReversiveis: true,
      },
      {
        id: 'q14',
        bloco: 'Matemática · Bloco C de 5 — Números têm nomes',
        titulo: '14. Ouça e escreva o número',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'escute o nome inteiro do número. Pense nas dezenas e nas unidades. Depois, registre com algarismos. Você pode ouvir novamente.',
        itens: [
          {
            id: 'q14a',
            pergunta: '14a. Primeiro número — Escreva em algarismos:',
            respostas: ['64'],
            feedbackErros: {
              palavras:
                'Ouça novamente o nome da dezena e depois o das unidades. Registre um algarismo em cada posição.',
            },
            textoDitado: 'sessenta e quatro.',
            rotuloDitado: 'Ouvir primeiro número',
          },
          {
            id: 'q14b',
            pergunta: '14b. Segundo número — Escreva em algarismos:',
            respostas: ['82'],
            feedbackErros: {
              palavras:
                'Escute a dezena até o fim. Não troque a posição das dezenas com a das unidades.',
            },
            textoDitado: 'oitenta e dois.',
            rotuloDitado: 'Ouvir segundo número',
          },
        ],
        dica: 'Ouça novamente o nome da dezena e depois o das unidades. Registre um algarismo em cada posição. Escute a dezena até o fim. Não troque a posição das dezenas com a das unidades. Ouvir primeiro número Primeiro número: sessenta e quatro.',
        sucesso:
          'Você ouviu sessenta e quatro e escreveu 64: seis dezenas e quatro unidades. Depois ouviu oitenta e dois e escreveu 82: oito dezenas e duas unidades.',
        opcoesReversiveis: true,
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
        instrucaoDitado:
          'Ouça o nome inteiro do número e escreva em algarismos. Sem voz local, peça ao responsável que leia os números na folha dele. Sem voz ou pessoa leitora, o estímulo está indisponível.',
      },
      {
        id: 'q15',
        bloco: 'Matemática · Bloco C de 5 — Números têm nomes',
        titulo: '15. Antes e depois',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'o antecessor vem imediatamente antes. O sucessor vem imediatamente depois. Por exemplo: 44, 45, 46. Antes de 45 está 44; depois de 45 está 46. Complete as casas com algarismos. Aqui, cada passo vale uma unidade.',
        itens: [
          {
            id: 'q15a',
            pergunta:
              '15a. Qual número vem imediatamente antes de 70? [ ______ ] → [ 70 ] → [ 71 ].',
            respostas: ['69'],
            feedbackErros: {
              palavras:
                'Dê um único passo para trás a partir de setenta. Aqui, o passo vale um, não dez.',
            },
          },
          {
            id: 'q15b',
            pergunta:
              '15b. Qual número vem imediatamente depois de 89? [ 88 ] → [ 89 ] → [ ______ ].',
            respostas: ['90'],
            feedbackErros: {
              palavras:
                'Dê um único passo para a frente depois de oitenta e nove. Você completará uma nova dezena.',
            },
          },
        ],
        dica: 'Dê um único passo para trás a partir de setenta. Aqui, o passo vale um, não dez. Dê um único passo para a frente depois de oitenta e nove. Você completará uma nova dezena.',
        sucesso:
          'Antes de 70 vem 69. Depois de 89 vem 90. Ao passar de uma dezena para outra, a contagem continua de uma unidade em uma unidade.',
        opcoesReversiveis: true,
      },
      {
        id: 'q16',
        bloco: 'Matemática · Bloco D de 5 — Dinheiro de faz de conta',
        titulo: '16. Leia o valor do dinheiro',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'cada cédula e cada moeda tem um valor. Leia o número e a unidade. R$ é o símbolo do real. Nas moedas de centavos, aparece a palavra centavos. Vamos apenas reconhecer essas moedas; não faremos contas com centavos.',
        itens: [
          {
            id: 'q16a',
            pergunta: '16a. Qual cédula vale cinco reais?',
            opcoes: [
              'Cédula pedagógica com “R$ 10”.',
              'Cédula pedagógica com “R$ 2”.',
              'Cédula pedagógica com “R$ 5”.',
            ],
            respostas: ['Cédula pedagógica com “R$ 5”.'],
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q16-cedulas.svg',
            imagemAlt: 'A: cédula de dez reais. B: cédula de dois reais. C: cédula de cinco reais.',
            imagemAmpla: true,
          },
          {
            id: 'q16b',
            pergunta: '16b. Qual moeda vale um real?',
            opcoes: [
              'Moeda pedagógica com “1 real”.',
              'Moeda pedagógica com “50 centavos”.',
              'Moeda pedagógica com “25 centavos”.',
            ],
            respostas: ['Moeda pedagógica com “1 real”.'],
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q16-moedas.svg',
            imagemAlt:
              'A: moeda de um real. B: moeda de cinquenta centavos. C: moeda de vinte e cinco centavos.',
            imagemAmpla: true,
          },
        ],
        dica: 'Leia o valor impresso em cada cédula. Procure o número pedido. Confira também a unidade: está escrito real ou centavos?',
        sucesso:
          'Você reconheceu a cédula de cinco reais e a moeda de um real. Ler o valor e a unidade ajuda a usar o dinheiro corretamente.',
        opcoesReversiveis: true,
      },
      {
        id: 'q17',
        bloco: 'Matemática · Bloco D de 5 — Dinheiro de faz de conta',
        titulo: '17. Conte os reais',
        instrucao:
          'Escreva o número de reais em algarismos. O símbolo R$ já aparece no campo. Você pode corrigir e conferir novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'uma cédula de R$ 10 vale uma dezena de reais. Uma moeda de R$ 1 vale uma unidade de real. Conte as dezenas e depois acrescente as unidades.',
        itens: [
          {
            id: 'q17a',
            pergunta: '17a. Total da carteira A: R$',
            respostas: ['34', '34,00', 'R$ 34', 'R$34', 'R$ 34,00', 'R$34,00', '34 reais'],
            feedbackErros: {
              palavras: 'Conte as cédulas de dez em dez. Depois acrescente as moedas de um.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q17a-carteira.svg',
            imagemAlt: 'Carteira A: três cédulas de dez reais e quatro moedas de um real.',
          },
          {
            id: 'q17b',
            pergunta: '17b. Total da carteira B: R$',
            respostas: ['62', '62,00', 'R$ 62', 'R$62', 'R$ 62,00', 'R$62,00', '62 reais'],
            feedbackErros: {
              palavras:
                'Confira todas as cédulas das duas fileiras antes de acrescentar as moedas.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q17b-carteira.svg',
            imagemAlt:
              'Carteira B: seis cédulas de dez reais, em duas fileiras de três, e duas moedas de um real.',
          },
        ],
        dica: 'Conte as cédulas de dez em dez. Depois acrescente as moedas de um. Confira todas as cédulas das duas fileiras antes de acrescentar as moedas.',
        sucesso:
          'A carteira A tem trinta e quatro reais. A carteira B tem sessenta e dois reais. Cada cédula representava uma dezena de reais; cada moeda acrescentava um real.',
        opcoesReversiveis: true,
      },
      {
        id: 'q18',
        bloco: 'Matemática · Bloco D de 5 — Dinheiro de faz de conta',
        titulo: '18. Valores diferentes',
        instrucao:
          'Escreva o número de reais em algarismos. O símbolo R$ já aparece no campo. Você pode corrigir e conferir novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'nem toda cédula vale dez reais. Leia o valor de cada uma antes de somar. Você pode começar pelo maior valor e acrescentar os menores.',
        itens: [
          {
            id: 'q18a',
            pergunta: '18a. Total da carteira A: R$',
            respostas: ['36', '36,00', 'R$ 36', 'R$36', 'R$ 36,00', 'R$36,00', '36 reais'],
            feedbackErros: {
              palavras:
                'Leia cada valor. Some os dois maiores e depois acrescente os valores menores.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q18a-carteira.svg',
            imagemAlt: 'Carteira A: cédulas de vinte, dez e cinco reais, e uma moeda de um real.',
          },
          {
            id: 'q18b',
            pergunta: '18b. Total da carteira B: R$',
            respostas: ['77', '77,00', 'R$ 77', 'R$77', 'R$ 77,00', 'R$77,00', '77 reais'],
            feedbackErros: {
              palavras:
                'Comece por cinquenta e vinte. Continue com os outros valores, sem contar cada cédula como se valesse apenas dez.',
            },
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q18b-carteira.svg',
            imagemAlt: 'Carteira B: cédulas de cinquenta, vinte, cinco e dois reais.',
          },
        ],
        dica: 'Leia cada valor. Some os dois maiores e depois acrescente os valores menores. Comece por cinquenta e vinte. Continue com os outros valores, sem contar cada cédula como se valesse apenas dez.',
        sucesso:
          'Na carteira A, vinte mais dez mais cinco mais um são trinta e seis reais. Na B, cinquenta mais vinte mais cinco mais dois são setenta e sete reais.',
        opcoesReversiveis: true,
      },
      {
        id: 'q19',
        bloco: 'Matemática · Bloco D de 5 — Dinheiro de faz de conta',
        titulo: '19. Mais cédulas ou mais dinheiro?',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'contar as cédulas e contar os reais são tarefas diferentes. Para saber quem tem mais dinheiro, precisamos comparar os valores.',
        itens: [
          {
            id: 'q19a',
            pergunta: '19a. Quem tem mais cédulas?',
            opcoes: ['Léo.', 'Nina.', 'Os dois têm a mesma quantidade de cédulas.'],
            respostas: ['Nina.'],
          },
          {
            id: 'q19b',
            pergunta: '19b. Quem tem mais reais?',
            opcoes: ['Nina.', 'Os dois têm o mesmo valor.', 'Léo.'],
            respostas: ['Léo.'],
          },
        ],
        dica: 'Nesta pergunta, conte quantos retângulos de cédulas cada pessoa tem. Não some os reais ainda. Agora a pergunta é sobre reais. Some o valor das cédulas de cada pessoa e compare.',
        sucesso:
          'Nina tem mais cédulas, mas Léo tem mais reais. Três cédulas de dois valem seis reais; uma cédula de dez vale dez reais. Mais cédulas nem sempre significam mais dinheiro.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q19-nina-leo.svg',
        descricaoIlustracao:
          'Nina tem três cédulas de dois reais. Léo tem uma cédula de dez reais.',
      },
      {
        id: 'q20',
        bloco: 'Matemática · Bloco D de 5 — Dinheiro de faz de conta',
        titulo: '20. Dinheiro que vale o mesmo',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Descubra comigo',
        leitura:
          'duas cédulas de R$ 5 valem o mesmo que uma de R$ 10. A quantidade de cédulas mudou, mas o valor foi conservado.',
        itens: [
          {
            id: 'q20a',
            pergunta: '20a. Qual frase está correta?',
            opcoes: [
              'O conjunto A tem valor maior.',
              'Os dois conjuntos têm o mesmo valor.',
              'O conjunto B tem valor maior.',
            ],
            respostas: ['Os dois conjuntos têm o mesmo valor.'],
          },
        ],
        dica: 'Compare os valores totais. A quantidade de cédulas pode ser diferente mesmo quando a soma é a mesma.',
        sucesso:
          'Os dois conjuntos valem cinquenta reais. Podemos representar o mesmo valor de maneiras diferentes, conservando a soma.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q20-equivalencia.svg',
        descricaoIlustracao:
          'Conjunto A: uma cédula de cinquenta reais. Conjunto B: duas de vinte reais e uma de dez reais.',
      },
      {
        id: 'q21',
        bloco: 'Matemática · Bloco E de 5 — Comparar e descobrir',
        titulo: '21. Maior, menor ou igual?',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'compare primeiro as dezenas. Se elas forem iguais, compare as unidades. Duas representações diferentes também podem mostrar a mesma quantidade. Por exemplo: 31 é maior que 28; 42 é maior que 41.',
        itens: [
          {
            id: 'q21a',
            pergunta: '21a. Complete: 58 é ______ que 63.',
            opcoes: ['Menor.', 'Igual.', 'Maior.'],
            respostas: ['Menor.'],
          },
          {
            id: 'q21b',
            pergunta: '21b. Complete: 74 é ______ que 71.',
            opcoes: ['Menor.', 'Maior.', 'Igual.'],
            respostas: ['Maior.'],
          },
          {
            id: 'q21c',
            pergunta:
              '21c. Compare as quantidades das duas representações. A quantidade no material dourado é:',
            opcoes: [
              'Igual à quantidade no ábaco.',
              'Maior que a quantidade no ábaco.',
              'Menor que a quantidade no ábaco.',
            ],
            respostas: ['Igual à quantidade no ábaco.'],
            imagem:
              '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q21c-representacoes.svg',
            imagemAlt:
              'Material dourado: três barras e seis cubinhos. Ábaco: três argolas em D e seis em U.',
            imagemAmpla: true,
          },
        ],
        dica: 'Compare as dezenas antes das unidades. As dezenas empatam. Agora compare somente as unidades. Descubra o valor de cada representação separadamente. Depois veja se os resultados são diferentes ou iguais.',
        sucesso:
          '58 é menor que 63. 74 é maior que 71. O material dourado e o ábaco mostram a mesma quantidade: 36. A aparência pode mudar sem mudar o valor.',
        opcoesReversiveis: true,
      },
      {
        id: 'q22',
        bloco: 'Matemática · Bloco E de 5 — Comparar e descobrir',
        titulo: '22. Organize os preços',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'misto',
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'ordem crescente começa pelo menor valor e termina no maior. Quando duas quantidades têm a mesma dezena, as unidades ajudam a decidir a ordem.',
        itens: [
          {
            id: 'q22a',
            tipo: 'ordenacao',
            pergunta:
              '22a. Coloque os quatro cartões do menor para o maior preço. Você pode retirar um cartão e mudar sua posição.',
            cartoes: ['R$ 47', 'R$ 25', 'R$ 42', 'R$ 18'],
            respostas: ['R$ 18', 'R$ 25', 'R$ 42', 'R$ 47'],
            rotuloOrdem: 'Menor preço para maior preço',
          },
        ],
        dica: 'Comece pelo preço com menos dezenas. Nos dois preços que têm quatro dezenas, compare as unidades. Você pode retirar e recolocar os cartões.',
        sucesso:
          'A ordem crescente é dezoito, vinte e cinco, quarenta e dois, quarenta e sete reais. Crescente vai do menor para o maior.',
        opcoesReversiveis: true,
      },
      {
        id: 'q23',
        bloco: 'Matemática · Bloco E de 5 — Comparar e descobrir',
        titulo: '23. O gráfico da oficina',
        instrucao:
          'Escreva as respostas em algarismos. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'o título conta o assunto do gráfico. Cada barra mostra a quantidade de uma categoria. Neste gráfico, cada quadradinho vale um objeto. Todas as barras começam no mesmo lugar, no zero. Para descobrir “quantos a mais”, compare as duas quantidades. Os mesmos dados estão nesta tabela: Objeto de papel — Quantidade. Pipas — 12; Barquinhos — 17; Flores — 15. Escreva em algarismos.',
        itens: [
          {
            id: 'q23a',
            pergunta: '23a. Qual é a maior quantidade registrada no gráfico? ______ objetos.',
            respostas: ['17'],
            feedbackErros: {
              palavras:
                'Compare o comprimento das três barras ou as três quantidades da tabela. A pergunta pede o número da maior quantidade.',
            },
          },
          {
            id: 'q23b',
            pergunta: '23b. Foram feitos quantos barquinhos a mais do que pipas? ______ objetos.',
            respostas: ['5'],
            feedbackErros: {
              palavras:
                'Compare apenas barquinhos e pipas. Conte quantos quadradinhos ficam além da barra das pipas.',
            },
          },
        ],
        dica: 'Compare o comprimento das três barras ou as três quantidades da tabela. A pergunta pede o número da maior quantidade. Compare apenas barquinhos e pipas. Conte quantos quadradinhos ficam além da barra das pipas.',
        sucesso:
          'A maior quantidade é dezessete barquinhos. Foram feitos cinco barquinhos a mais do que pipas, porque dezessete menos doze é cinco.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q23-grafico.svg',
        descricaoIlustracao:
          'Gráfico de objetos de papel feitos na oficina. Cada unidade vale um objeto. Pipas: doze; barquinhos: dezessete; flores: quinze. Todas as barras partem do zero; escala unitária até dezessete.',
      },
      {
        id: 'q24',
        bloco: 'Matemática · Bloco E de 5 — Comparar e descobrir',
        titulo: '24. Uma compra na feira de brincadeira',
        instrucao:
          'Escreva o número de reais em algarismos. O símbolo R$ já aparece no campo. Você pode corrigir e conferir novamente.',
        tipo: 'campos',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'o total da compra é a soma dos preços dos itens comprados. O troco é o dinheiro que volta quando pagamos mais do que o total. Se uma compra custa R$ 6 e o pagamento é R$ 10, podemos contar de seis até dez para descobrir o troco. Tabela: Produto — Preço de uma unidade. Catavento — R$ 4; Adesivo — R$ 3; Marcador de página — R$ 2. Lia comprou um catavento e um adesivo. Ela pagou com uma cédula de R$ 10. Escreva o número de reais em algarismos.',
        itens: [
          {
            id: 'q24a',
            pergunta: '24a. Quanto custou a compra de Lia? R$',
            respostas: ['7', '7,00', 'R$ 7', 'R$7', 'R$ 7,00', 'R$7,00', '7 reais'],
            feedbackErros: {
              palavras:
                'Localize apenas os dois produtos que Lia comprou. Some seus preços, uma vez cada.',
            },
          },
          {
            id: 'q24b',
            pergunta: '24b. Quanto ela deve receber de troco? R$',
            respostas: ['3', '3,00', 'R$ 3', 'R$3', 'R$ 3,00', 'R$3,00', '3 reais'],
            feedbackErros: {
              palavras:
                'Troco é o que volta. Descubra quanto falta ao preço correto da compra para chegar ao pagamento de dez reais.',
            },
          },
        ],
        dica: 'Localize apenas os dois produtos que Lia comprou. Some seus preços, uma vez cada. Troco é o que volta. Descubra quanto falta ao preço correto da compra para chegar ao pagamento de dez reais.',
        sucesso:
          'Lia gastou sete reais e recebe três reais de troco. Sete da compra mais três do troco completam os dez reais que ela entregou.',
        opcoesReversiveis: true,
        ilustracaoLeitura:
          '../assets/matematica-dezenas-numeros-dinheiro-outubro-2026/alice-matematica-dezenas-numeros-dinheiro-outubro-2026-q24-tabela.svg',
        descricaoIlustracao:
          'Tabela de preços de uma unidade: catavento, quatro reais; adesivo, três reais; marcador de página, dois reais.',
      },
      {
        id: 'q25',
        bloco: 'Matemática · Bloco E de 5 — Comparar e descobrir',
        titulo: '25. O número secreto',
        instrucao: 'Resolva cada item. Você pode conferir, corrigir e tentar novamente.',
        tipo: 'opcoes',
        leituraTitulo: 'Vamos aprender',
        leitura:
          'um número secreto precisa obedecer a todas as pistas ao mesmo tempo. Se uma pista disser “maior que 20 e menor que 30”, nem 20 nem 30 podem ser a resposta. Depois de encontrar o número, confira suas dezenas e unidades. Leia as duas pistas: o número é maior que 40 e menor que 50. O algarismo das unidades é 6.',
        itens: [
          {
            id: 'q25a',
            pergunta: '25a. Qual é o número secreto?',
            opcoes: ['46', '64', '56'],
            respostas: ['46'],
          },
          {
            id: 'q25b',
            pergunta: '25b. Qual decomposição representa esse número secreto?',
            opcoes: ['60 + 4', '4 + 6', '40 + 6'],
            respostas: ['40 + 6'],
          },
        ],
        dica: 'Teste as duas pistas em cada candidato. Não basta terminar em seis; também precisa ficar entre os limites. A primeira parcela deve mostrar o valor das dezenas, e não apenas contar quantas dezenas existem.',
        sucesso:
          'O número secreto é quarenta e seis. Ele obedece às duas pistas e pode ser decomposto em quarenta mais seis. Você conferiu o intervalo e as posições.',
        opcoesReversiveis: true,
      },
    ],
  });
})();
