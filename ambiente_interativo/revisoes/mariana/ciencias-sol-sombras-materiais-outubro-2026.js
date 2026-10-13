(function () {
  'use strict';
  // Uma sequência inteira é um único subitem no renderer misto existente.
  window.QuestionariosRevisoes.registrar({
    id: 'mariana-ciencias-sol-sombras-materiais-outubro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Ciências',
    titulo: 'Investigando o Sol, as sombras e os materiais',
    subtitulo: 'Ciências · 2º ano · 30 questões e 30 pontos',
    chave: 'revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.v1',
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
            'revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Você observou, comparou, organizou e explicou situações de Ciências. Se uma resposta ainda precisar de ajuste, volte à pista, mude o que for necessário e confira novamente. Cada questão completa conta uma vez. Agora, você pode contar a um adulto uma descoberta que achou interessante. Essa conversa não vale ponto.',
    questoes: [
      {
        id: 'sol-sombras-materiais-q01',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q01 — Luz no quintal',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O que ilumina esse quintal? Escolha uma.',
            opcoes: ['A. A pedra.', 'B. O Sol.', 'C. O chão.'],
            respostas: ['B. O Sol.'],
          },
          {
            pergunta: 'b) O que aconteceu com a pedra ao receber energia do Sol? Escolha uma.',
            opcoes: [
              'A. Ficou iluminada, mas não mudou de temperatura.',
              'B. Ficou mais fria enquanto recebia essa energia.',
              'C. Ficou mais quente.',
            ],
            respostas: ['C. Ficou mais quente.'],
          },
        ],
        leitura:
          'Leia para aprender. O Sol tem luz própria e ilumina muitos ambientes durante o dia. A energia que recebemos dele também pode aquecer objetos. Um boneco deixado ao Sol pode ficar mais quente do que estava antes. Observe. É dia. O quintal de Nina recebe luz do Sol. Uma pedra ficou exposta nessa parte do quintal e aqueceu. Nenhuma lâmpada está acesa.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Confira de onde vem a luz e o que o registro conta sobre a temperatura da pedra.',
        sucesso:
          'O Sol ilumina o quintal, e a energia recebida ajudou a aquecer a pedra. Luz e aquecimento aparecem nessa mesma situação.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v01.svg',
        descricaoIlustracao:
          'Quintal de Nina durante o dia, recebendo luz do Sol. Uma pedra ficou exposta nessa parte do quintal e aqueceu. Nenhuma lâmpada está acesa.',
      },
      {
        id: 'sol-sombras-materiais-q02',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q02 — Quem está no caminho da luz?',
        instrucao:
          'Toque ou selecione o objeto que bloqueia a luz e produz essa sombra. Escolha um alvo.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'Toque ou selecione o objeto que bloqueia a luz e produz essa sombra. Escolha um alvo.',
            opcoes: ['Vaso de barro', 'Sol', 'Piso'],
            respostas: ['Vaso de barro'],
          },
        ],
        leitura:
          'Leia para aprender. Uma sombra aparece onde chega menos luz porque um objeto bloqueia sua passagem. A sombra de um boneco no chão se forma porque o boneco fica no caminho da luz. Observe. A luz vem do Sol, que está no alto, à esquerda do desenho. Há um vaso de barro no centro do piso. Na região do piso logo à direita do vaso, vemos uma área menos iluminada, ligada à base dele.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Procure o objeto que está no caminho entre a fonte de luz e a região menos iluminada.',
        sucesso: 'O vaso bloqueia parte da luz. Por isso, a sombra dele aparece no piso.',
        opcoesReversiveis: true,
        mapaVisual: {
          imagem: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v02.svg',
          descricao:
            'O Sol está no alto, à esquerda. Um vaso de barro está no centro do piso. À direita do vaso, uma região menos iluminada no piso está ligada à base dele.',
          rotulo: 'Objetos selecionáveis da cena',
          pontos: [
            {
              opcao: 'Vaso de barro',
              rotulo: 'Vaso de barro',
              x: 55,
              y: 58,
            },
            {
              opcao: 'Sol',
              rotulo: 'Sol',
              x: 21.7,
              y: 28.1,
            },
            {
              opcao: 'Piso',
              rotulo: 'Piso',
              x: 84,
              y: 84,
            },
          ],
        },
      },
      {
        id: 'sol-sombras-materiais-q03',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q03 — O que precisamos para projetar uma sombra?',
        instrucao: 'Marque todos os elementos necessários para formar essa sombra na parede.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'Marque todos os elementos necessários para formar essa sombra na parede.',
            opcoes: [
              'A. Uma superfície onde a sombra possa aparecer.',
              'B. A figura ter obrigatoriamente cor preta.',
              'C. Uma fonte de luz acesa.',
              'D. A figura ter obrigatoriamente um tamanho grande.',
              'E. Um objeto que bloqueie parte da luz.',
            ],
            respostas: [
              'A. Uma superfície onde a sombra possa aparecer.',
              'C. Uma fonte de luz acesa.',
              'E. Um objeto que bloqueie parte da luz.',
            ],
            tipo: 'selecao',
          },
        ],
        leitura:
          'Leia para aprender. Uma lâmpada pode iluminar uma parede. Quando uma figura opaca fica entre a lâmpada e a parede, ela bloqueia parte da luz e podemos ver sua sombra na parede. A figura não precisa estar pintada de preto para isso acontecer. Observe. Davi quer projetar a sombra de uma figura de cartolina numa parede. Ele usa uma lanterna acesa e mantém a figura entre a lanterna e a parede.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Pense no caminho da luz até a parede. Confira se cor e tamanho são mesmo condições obrigatórias.',
        sucesso:
          'Fonte de luz, objeto no caminho e superfície de projeção explicam essa sombra. A figura pode bloquear luz mesmo sem ser preta.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v03.svg',
        descricaoIlustracao:
          'Uma lanterna acesa ilumina uma figura de cartolina colocada entre a lanterna e uma parede. Na parede aparece a sombra da figura.',
      },
      {
        id: 'sol-sombras-materiais-q04',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q04 — De que lado?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Cena 1: lanterna à esquerda. Escolha uma.',
            opcoes: [
              'A. À esquerda do vaso.',
              'B. Ao mesmo tempo dos dois lados, com sombras iguais.',
              'C. À direita do vaso.',
            ],
            respostas: ['C. À direita do vaso.'],
          },
          {
            pergunta: 'b) Cena 2: lanterna à direita. Escolha uma.',
            opcoes: [
              'A. À direita do vaso.',
              'B. À esquerda do vaso.',
              'C. Ao mesmo tempo dos dois lados, com sombras iguais.',
            ],
            respostas: ['B. À esquerda do vaso.'],
          },
        ],
        leitura:
          'Leia para aprender. Em um chão plano, a sombra se projeta para o lado oposto à fonte de luz. Pense num boneco iluminado de um lado: a sombra aparece do outro. Observe. As duas cenas mostram o mesmo vaso sobre um chão plano. A lanterna fica acima da altura do vaso e aponta para ele. Na cena 1, a lanterna está à esquerda. Na cena 2, está à direita. Você vai prever de que lado ficará a sombra no chão.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Localize a lanterna em cada cena e procure o lado oposto.',
        sucesso:
          'Quando a lanterna muda de lado, a sombra muda para o lado oposto. Você relacionou a fonte e a sombra nas duas cenas.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v04.svg',
        descricaoIlustracao:
          'Duas montagens com o mesmo vaso e chão plano. Na cena 1, a lanterna acima do vaso fica à esquerda. Na cena 2, fica à direita. As sombras ainda não estão desenhadas.',
      },
      {
        id: 'sol-sombras-materiais-q05',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q05 — Mais alto ou mais baixo?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que sombra combina com o registro 1? Escolha uma.',
            opcoes: [
              'A. Sombra comprida para a direita.',
              'B. Sombra curta para a esquerda.',
              'C. Sombra curta para a direita.',
            ],
            respostas: ['A. Sombra comprida para a direita.'],
            imagem: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v05-registro-1.svg',
            imagemAlt:
              'Registro 1: mesmo poste e chão plano; Sol baixo à esquerda. A sombra não está desenhada.',
          },
          {
            pergunta: 'b) Que sombra combina com o registro 2? Escolha uma.',
            opcoes: [
              'A. Sombra comprida para a direita.',
              'B. Sombra comprida para a esquerda.',
              'C. Sombra curta para a direita.',
            ],
            respostas: ['C. Sombra curta para a direita.'],
            imagem: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v05-registro-2.svg',
            imagemAlt:
              'Registro 2: mesmo poste e chão plano; Sol mais alto à esquerda. A sombra não está desenhada.',
          },
          {
            pergunta: 'c) Que sombra combina com o registro 3? Escolha uma.',
            opcoes: [
              'A. Sombra curta para a esquerda.',
              'B. Sombra comprida para a esquerda.',
              'C. Sombra comprida para a direita.',
            ],
            respostas: ['B. Sombra comprida para a esquerda.'],
            imagem: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v05-registro-3.svg',
            imagemAlt:
              'Registro 3: mesmo poste e chão plano; Sol baixo à direita. A sombra não está desenhada.',
          },
        ],
        leitura:
          'Leia para aprender. Durante o dia, o Sol parece mudar de posição no céu. Para o mesmo objeto, sobre o mesmo chão plano, uma posição mais alta do Sol produz uma sombra mais curta. Uma posição mais baixa produz uma sombra mais comprida. Uma descoberta. Uma vara fincada de pé no chão pode ajudar a comparar sombras. Ela é chamada de gnômon. Mantemos a vara no mesmo lugar e marcamos a sombra em momentos diferentes. Observamos a sombra, sem olhar diretamente para o Sol. Observe. Os três registros são de um mesmo poste que não mudou de altura nem de lugar. O chão é plano. Registro 1: início da manhã, Sol baixo à esquerda. Registro 2: perto do meio do dia, Sol mais alto à esquerda. Registro 3: final da tarde, Sol baixo à direita.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Confira duas coisas em cada registro: se o Sol está alto ou baixo e de que lado ele aparece.',
        sucesso:
          'O poste não mudou. A posição aparente do Sol ajudou a mudar o tamanho e o lado da sombra.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v05.svg',
        descricaoIlustracao:
          'Apoio do gnômon: uma vara vertical fixa no chão é observada em três momentos. Cada painel mostra a mesma vara e sua sombra, que muda de comprimento ou lado conforme a posição aparente do Sol. As imagens de cada pergunta apresentam o poste sem sombras prontas.',
      },
      {
        id: 'sol-sombras-materiais-q06',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q06 — O diário do poste',
        instrucao: 'Ordene os cartões. Clique em um cartão colocado para retirá-lo e reorganizar.',
        tipo: 'misto',
        itens: [
          {
            tipo: 'ordenacao',
            pergunta: 'Ordene do primeiro momento para o último.',
            cartoes: [
              'Final da tarde: Sol baixo à direita e sombra comprida para a esquerda.',
              'Início da manhã: Sol baixo à esquerda e sombra comprida para a direita.',
              'Perto do meio do dia: Sol mais alto e sombra mais curta.',
            ],
            respostas: [
              'Início da manhã: Sol baixo à esquerda e sombra comprida para a direita.',
              'Perto do meio do dia: Sol mais alto e sombra mais curta.',
              'Final da tarde: Sol baixo à direita e sombra comprida para a esquerda.',
            ],
            rotuloOrdem: '1º momento → 2º momento → 3º momento',
          },
        ],
        leitura:
          'Leia para aprender. Podemos comparar o mesmo objeto em momentos diferentes do dia. A posição aparente do Sol e a sombra mudam. Um registro de manhã vem antes de um registro do final da tarde. Observe. Nina fez três registros do mesmo poste, no mesmo dia. Ela escreveu o momento de cada observação. Os cartões estão misturados.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Leia o momento anotado em cada cartão. Qual veio primeiro naquele dia?',
        sucesso:
          'Você organizou os registros do mesmo dia. Eles mostram que a aparência do Sol no céu e a sombra mudaram.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v06.svg',
        descricaoIlustracao:
          'Três cartões misturados do mesmo poste. Primeiro cartão apresentado: final da tarde, Sol baixo à direita e sombra comprida à esquerda. Segundo: início da manhã, Sol baixo à esquerda e sombra comprida à direita. Terceiro: perto do meio do dia, Sol mais alto e sombra mais curta.',
      },
      {
        id: 'sol-sombras-materiais-q07',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q07 — O poste ficou diferente?',
        instrucao:
          'Leia cada parte: marque todas onde for pedido, escolha uma ou ordene os cartões.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque todas as previsões que combinam com esses registros.',
            opcoes: [
              'A. Com o Sol mais alto, a sombra do poste fica mais comprida.',
              'B. Com o Sol baixo, a sombra do poste fica mais comprida.',
              'C. Com o Sol baixo, a sombra do poste fica mais curta.',
              'D. Com o Sol mais alto, a sombra do poste fica mais curta.',
            ],
            respostas: [
              'B. Com o Sol baixo, a sombra do poste fica mais comprida.',
              'D. Com o Sol mais alto, a sombra do poste fica mais curta.',
            ],
            tipo: 'selecao',
          },
          {
            pergunta: 'b) O que explica a diferença entre as sombras? Escolha uma.',
            opcoes: [
              'A. O poste mudou de altura entre os registros.',
              'B. O poste mudou de lugar entre os registros.',
              'C. A posição aparente do Sol mudou entre os registros.',
            ],
            respostas: ['C. A posição aparente do Sol mudou entre os registros.'],
          },
        ],
        leitura:
          'Leia para aprender. Um objeto pode continuar com o mesmo tamanho e produzir sombras diferentes. Para comparar, precisamos observar também a posição da fonte de luz. Observe. Um poste ficou no mesmo lugar e não mudou de altura. No registro 1, o Sol está baixo à esquerda. No registro 2, o Sol está mais alto à esquerda. O chão continua plano.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Separe o que ficou igual do que mudou. Depois, relacione a altura do Sol ao comprimento da sombra.',
        sucesso:
          'O mesmo poste pode formar sombras diferentes. A mudança da iluminação explica essa diferença.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v07.svg',
        descricaoIlustracao:
          'O mesmo poste ficou no mesmo lugar e conservou a altura. No registro 1, o Sol aparece baixo à esquerda. No 2, mais alto à esquerda. O chão é plano nas duas cenas.',
      },
      {
        id: 'sol-sombras-materiais-q08',
        bloco: 'Ciências · Luz e sombras',
        titulo: 'Q08 — E quando o céu fica nublado?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual conclusão combina com o registro 2? Escolha uma.',
            opcoes: [
              'A. A sombra ficou menos nítida com a luz espalhada pelas nuvens.',
              'B. A árvore deixou de bloquear luz porque apareceram nuvens.',
              'C. A sombra ficou mais nítida do que sob a luz direta.',
            ],
            respostas: ['A. A sombra ficou menos nítida com a luz espalhada pelas nuvens.'],
          },
          {
            pergunta: 'b) O que podemos dizer sobre a iluminação no registro 2? Escolha uma.',
            opcoes: [
              'A. Só uma lâmpada poderia deixar esse ambiente claro.',
              'B. O ambiente ainda recebe luz do Sol, mesmo com nuvens.',
              'C. Se o Sol não aparece entre as nuvens, sua luz não chega ao ambiente.',
            ],
            respostas: ['B. O ambiente ainda recebe luz do Sol, mesmo com nuvens.'],
          },
        ],
        leitura:
          'Leia para aprender. Mesmo num dia nublado, a luz do Sol pode chegar ao ambiente. As nuvens espalham essa luz. Uma sombra pode ficar menos nítida do que sob luz solar direta. Observe. O registro 1 mostra uma árvore sob luz solar direta, com sombra bem marcada. No registro 2, a mesma árvore está sob um céu coberto de nuvens. O ambiente ainda está claro, mas o contorno da sombra é pouco definido.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Compare o contorno da sombra e veja se o segundo ambiente continua claro.',
        sucesso:
          'As nuvens espalham a luz, e a sombra pode ficar menos definida. Ainda podemos receber luz do Sol. Pausa de descoberta: Se quiser, conte a um adulto como você sabe de que lado uma sombra aparece. Você não precisa escrever uma resposta nem olhar para o Sol.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v08.svg',
        descricaoIlustracao:
          'Na primeira cena, a árvore recebe luz solar direta e tem sombra bem marcada. Na segunda, o céu está coberto por nuvens e o ambiente ainda está claro; o contorno da sombra da mesma árvore é pouco definido.',
      },
      {
        id: 'sol-sombras-materiais-q09',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q09 — O brinquedo atrás das placas',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Como é o material da placa 1? Escolha uma.',
            opcoes: ['A. Transparente.', 'B. Opaco.', 'C. Translúcido.'],
            respostas: ['C. Translúcido.'],
          },
          {
            pergunta: 'b) Como é o material da placa 2? Escolha uma.',
            opcoes: ['A. Opaco.', 'B. Translúcido.', 'C. Transparente.'],
            respostas: ['A. Opaco.'],
          },
          {
            pergunta: 'c) Como é o material da placa 3? Escolha uma.',
            opcoes: ['A. Translúcido.', 'B. Transparente.', 'C. Opaco.'],
            respostas: ['B. Transparente.'],
          },
        ],
        leitura:
          'Leia para aprender. Um material transparente deixa a luz passar e permite ver com nitidez através dele. Um material translúcido deixa parte da luz passar, mas a imagem não fica nítida. Um material opaco bloqueia a passagem da luz e não permite ver através dele. Uma placa transparente, uma placa fosca e uma placa de madeira podem oferecer visões diferentes de um mesmo desenho. Observe. O mesmo carrinho está atrás de três placas. Pela placa 1, ele aparece borrado. Pela placa 2, não vemos a parte que está atrás da placa. Pela placa 3, vemos o carrinho com nitidez. As placas cobrem a mesma região do brinquedo.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Confira se o carrinho aparece nítido, borrado ou encoberto em cada placa.',
        sucesso:
          'Transparente permite ver com nitidez. Translúcido deixa ver sem nitidez. Opaco bloqueia a visão através dele.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v09.svg',
        descricaoIlustracao:
          'O mesmo carrinho está atrás de três placas que cobrem a mesma região. Pela placa 1, essa região aparece borrada. Pela placa 2, não vemos a parte atrás da placa. Pela placa 3, vemos essa parte com nitidez.',
      },
      {
        id: 'sol-sombras-materiais-q10',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q10 — Nomes de cientista',
        instrucao:
          'Escreva uma palavra para classificar o material de cada caso. Não precisa usar letras maiúsculas.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Caso A — visão sem nitidez.',
            respostas: [
              'translúcido',
              'translúcida',
              'material translúcido',
              'placa translúcida',
              'é translúcido',
              'é translúcida',
            ],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Caso B — visão com nitidez.',
            respostas: ['transparente', 'material transparente', 'é transparente'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'c) Caso C — visão bloqueada.',
            respostas: ['opaco', 'opaca', 'material opaco', 'tampa opaca', 'é opaco', 'é opaca'],
            pontuacaoFlexivel: true,
          },
        ],
        leitura:
          'Leia para aprender. Vamos usar os nomes dos três tipos de material que você estudou. Observe a visão através de cada objeto e escreva o nome aprendido. Se uma palavra não estiver clara, você pode pedir para ouvi-la. Observe. São novos objetos. No caso A, uma pequena placa fosca deixa ver a forma de uma chave, mas sem nitidez. No caso B, uma janela de vidro limpo deixa ver os detalhes de um vaso do outro lado. No caso C, uma tampa de metal impede ver a parte da chave que está atrás dela.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Observe a nitidez da visão em cada caso. Se precisar, ouça a palavra do campo e confira o que escreveu.',
        sucesso:
          'Você nomeou os três casos: translúcido, transparente e opaco. Os nomes ajudam a explicar como vemos através dos materiais.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v10.svg',
        descricaoIlustracao:
          'Caso A: pela placa fosca vemos a forma de uma chave, mas sem nitidez. Caso B: pela janela de vidro limpo vemos os detalhes de um vaso do outro lado. Caso C: a tampa de metal impede ver a parte da chave que está atrás dela.',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'sol-sombras-materiais-q11',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q11 — Um pequeno teatro',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual amostra é a mais adequada para a tela descrita? Escolha uma.',
            opcoes: [
              'A. Cartolina grossa.',
              'B. Papel de seda branco fino.',
              'C. Placa de plástico transparente.',
            ],
            respostas: ['B. Papel de seda branco fino.'],
          },
          {
            pergunta:
              'b) Qual amostra é a mais adequada para recortar uma figura que bloqueie a luz? Escolha uma.',
            opcoes: [
              'A. Placa de plástico transparente.',
              'B. Papel de seda branco fino.',
              'C. Cartolina grossa.',
            ],
            respostas: ['C. Cartolina grossa.'],
          },
        ],
        leitura:
          'Leia para aprender. Num teatro de sombras, a figura bloqueia parte da luz. A tela recebe a sombra e espalha a luz que passa por ela. Assim, quem está do outro lado pode ver a sombra na tela. Observe. Davi quer montar um teatro. Ele tem três amostras: cartolina grossa que bloqueia a luz; papel de seda branco fino que deixa passar luz espalhada; e uma placa de plástico transparente pela qual se vê com nitidez.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'A tela e a figura têm funções diferentes. Uma precisa mostrar a sombra; a outra precisa bloquear luz.',
        sucesso:
          'A tela espalha a luz que passa por ela, e a figura opaca bloqueia parte dessa luz. As duas funções fazem o teatro funcionar.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v11.svg',
        descricaoIlustracao:
          'Materiais disponíveis: cartolina grossa que bloqueia a luz; papel de seda branco fino que deixa passar luz espalhada; placa de plástico transparente pela qual se vê com nitidez. Davi quer escolher uma tela e uma figura para o teatro de sombras.',
      },
      {
        id: 'sol-sombras-materiais-q12',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q12 — Montando no lugar certo',
        instrucao: 'Ordene os cartões. Clique em um cartão colocado para retirá-lo e reorganizar.',
        tipo: 'misto',
        itens: [
          {
            tipo: 'ordenacao',
            pergunta: 'Ordene as peças no caminho da luz: da primeira para a última.',
            cartoes: ['Figura opaca.', 'Tela que deixa passar luz espalhada.', 'Lanterna acesa.'],
            respostas: ['Lanterna acesa.', 'Figura opaca.', 'Tela que deixa passar luz espalhada.'],
            rotuloOrdem: 'primeira peça → segunda peça → terceira peça',
          },
        ],
        leitura:
          'Leia para aprender. Para projetar uma sombra, o objeto precisa ficar no caminho da luz antes de ela chegar à superfície de projeção. É o que acontece quando um boneco fica entre a lanterna e uma parede. Observe. No teatro de Davi, a luz segue da esquerda para a direita. A plateia fica à direita da tela e olha para ela. Você vai organizar as três peças antes da plateia.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Comece por onde a luz sai. Qual peça deve entrar no caminho antes de ela alcançar a tela?',
        sucesso:
          'A luz sai da lanterna, encontra a figura e chega à tela. A plateia vê a sombra pelo outro lado.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v12.svg',
        descricaoIlustracao:
          'No teatro, a luz segue da esquerda para a direita. Há três espaços a organizar antes da plateia, que ficará à direita da tela. Os cartões disponíveis são figura opaca, tela que deixa passar luz espalhada e lanterna acesa, nessa ordem de apresentação.',
      },
      {
        id: 'sol-sombras-materiais-q13',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q13 — Mudar a cor muda tudo?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual comparação está correta? Escolha uma.',
            opcoes: [
              'A. As duas peças bloqueiam a passagem da luz.',
              'B. A peça branca deixa a luz passar; a azul bloqueia.',
              'C. A peça azul deixa a luz passar; a branca bloqueia.',
            ],
            respostas: ['A. As duas peças bloqueiam a passagem da luz.'],
          },
          {
            pergunta: 'b) O que devemos esperar nas regiões da sombra? Escolha uma.',
            opcoes: [
              'A. Uma sombra fica branca e a outra fica azul, copiando a tinta das peças.',
              'B. As duas são regiões menos iluminadas e não copiam a cor da tinta das peças.',
              'C. Só a peça azul produz uma região menos iluminada.',
            ],
            respostas: [
              'B. As duas são regiões menos iluminadas e não copiam a cor da tinta das peças.',
            ],
          },
        ],
        leitura:
          'Leia para aprender. A cor de uma peça não diz, sozinha, se ela deixa a luz passar. Uma peça opaca clara também pode bloquear a luz e formar sombra. Observe. Davi recortou duas peças de cartolina grossa e opaca. Elas têm a mesma forma e espessura. Uma foi pintada de branco; a outra, de azul. Ele ilumina uma de cada vez com a mesma lanterna de luz branca, na mesma posição, diante de uma tela branca.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Lembre que as duas peças são opacas. A sombra mostra onde chega menos luz, não uma pintura da peça.',
        sucesso:
          'Uma peça opaca clara também bloqueia luz. A sombra não precisa ter a cor da tinta do objeto.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v13.svg',
        descricaoIlustracao:
          'Duas peças de cartolina grossa e opaca têm a mesma forma e espessura. Uma é branca; outra, azul. Cada peça será iluminada separadamente pela mesma lanterna de luz branca, na mesma posição, diante de tela branca.',
      },
      {
        id: 'sol-sombras-materiais-q14',
        bloco: 'Ciências · Luz e materiais',
        titulo: 'Q14 — Cada propriedade tem uma utilidade',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'a) Uma alça de silicone se curva com facilidade. Qual propriedade descreve essa facilidade de dobrar? Escolha uma.',
            opcoes: ['A. Resistência ao peso.', 'B. Transparência.', 'C. Flexibilidade.'],
            respostas: ['C. Flexibilidade.'],
          },
          {
            pergunta:
              'b) Pela janela fechada, Nina vê com nitidez as folhas do jardim. Qual propriedade do vidro permite isso? Escolha uma.',
            opcoes: ['A. Transparência.', 'B. Flexibilidade.', 'C. Resistência ao peso.'],
            respostas: ['A. Transparência.'],
          },
          {
            pergunta:
              'c) A alça da mochila suporta o peso dos materiais sem rasgar. Qual propriedade está sendo observada nesse teste? Escolha uma.',
            opcoes: ['A. Transparência.', 'B. Resistência ao peso.', 'C. Flexibilidade.'],
            respostas: ['B. Resistência ao peso.'],
          },
        ],
        leitura:
          'Leia para aprender. Flexibilidade é a facilidade de um material se curvar ou dobrar. Transparência permite ver com nitidez através dele. Resistência ajuda um material a suportar o esforço descrito sem se romper. Um mesmo material pode ter mais de uma propriedade.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Leia a ação de cada teste: dobrar, ver através ou suportar peso.',
        sucesso:
          'As propriedades ajudam a escolher materiais para usos diferentes. Um mesmo material pode ter mais de uma propriedade. Pausa de descoberta: Você pode procurar, com um adulto, um objeto que permita ver através dele e outro que bloqueie essa visão. Não precisa fazer experiências com lâmpadas quentes ou quebrar materiais.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v14.svg',
        descricaoIlustracao:
          'Uma alça de silicone se curva com facilidade. Nina vê folhas com nitidez através de uma janela fechada. A alça de uma mochila suporta o peso dos materiais sem rasgar.',
      },
      {
        id: 'sol-sombras-materiais-q15',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q15 — O gelo mudou',
        instrucao: 'Ordene os cartões. Clique em um cartão colocado para retirá-lo e reorganizar.',
        tipo: 'misto',
        itens: [
          {
            tipo: 'ordenacao',
            pergunta: 'Ordene o que aconteceu.',
            cartoes: [
              'Há apenas os cubos de gelo, antes de começarem a derreter.',
              'Não há mais gelo; ficou água líquida no prato.',
              'Há pedaços menores de gelo e água líquida.',
            ],
            respostas: [
              'Há apenas os cubos de gelo, antes de começarem a derreter.',
              'Há pedaços menores de gelo e água líquida.',
              'Não há mais gelo; ficou água líquida no prato.',
            ],
            rotuloOrdem: 'começo → durante a mudança → final da observação',
          },
        ],
        leitura:
          'Leia para aprender. Ao receber calor, o gelo pode derreter e virar água líquida. Isso é derretimento. Um pedaço de gelo num copo pode diminuir enquanto aparece água líquida ao redor dele. Observe. Nina acompanhou um prato com gelo num lugar aquecido pelo Sol. O prato ficou na mesma posição. Ela registrou a mudança até o gelo derreter, antes de o prato secar. Os cartões estão misturados.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Procure primeiro o estado antes da mudança. Depois, observe como a água líquida aparece.',
        sucesso:
          'O gelo derreteu e virou água líquida. A água continua no prato ao final dessa observação.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v15.svg',
        descricaoIlustracao:
          'Três registros misturados do mesmo prato: no cartão 1 há cubos de gelo antes de começarem a derreter; no 2, apenas água líquida; no 3, pedaços menores de gelo com água líquida. A observação termina antes de o prato secar.',
      },
      {
        id: 'sol-sombras-materiais-q16',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q16 — Duas mudanças da água',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que mudanças as sequências mostram? Escolha uma.',
            opcoes: [
              'A. Sequência 1: evaporação. Sequência 2: derretimento.',
              'B. Sequência 1: derretimento. Sequência 2: evaporação.',
              'C. As duas sequências mostram apenas derretimento.',
            ],
            respostas: ['B. Sequência 1: derretimento. Sequência 2: evaporação.'],
          },
          {
            pergunta: 'b) Na sequência 2, para onde foi a água que evaporou? Escolha uma.',
            opcoes: [
              'A. Escorreu para fora do prato.',
              'B. Foi absorvida pelo chão, através do prato.',
              'C. Passou para o ar como vapor de água.',
            ],
            respostas: ['C. Passou para o ar como vapor de água.'],
          },
        ],
        leitura:
          'Leia para aprender. Derreter é passar de sólido para líquido. Evaporar é passar de água líquida para vapor de água no ar. Uma toalha molhada pode secar por evaporação, sem a água precisar ferver. Observe. Na sequência 1, gelo num prato diminui até restar água líquida. Na sequência 2, água líquida num outro prato vai diminuindo até o prato secar. Os pratos não vazaram, não foram virados e nada foi derramado. O tempo passou num ambiente aquecido.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Compare o que existe no começo e no final de cada sequência. Qual termina com água líquida e qual termina com o prato seco?',
        sucesso:
          'Derretimento produz água líquida a partir do gelo. Na evaporação, a água líquida passa para o ar como vapor.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v16.svg',
        descricaoIlustracao:
          'Na sequência 1, o gelo diminui até restar água líquida no prato. Na sequência 2, a água líquida de outro prato vai diminuindo até o prato secar. Nada foi derramado, os pratos não vazaram e o tempo passou num ambiente aquecido.',
      },
      {
        id: 'sol-sombras-materiais-q17',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q17 — Dois panos no varal',
        instrucao:
          'Leia cada parte: marque todas onde for pedido, escolha uma ou ordene os cartões.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque todas as conclusões que combinam com esse registro.',
            opcoes: [
              'A. O pano H não perdeu água porque ficou à sombra.',
              'B. O pano S secou mais rapidamente nesse teste.',
              'C. Os dois panos perderam parte da água.',
              'D. O pano S demorou mais para secar que o pano H.',
              'E. Também houve evaporação no pano que ficou à sombra.',
            ],
            respostas: [
              'B. O pano S secou mais rapidamente nesse teste.',
              'C. Os dois panos perderam parte da água.',
              'E. Também houve evaporação no pano que ficou à sombra.',
            ],
            tipo: 'selecao',
          },
          {
            pergunta: 'b) O que ajuda a explicar a secagem mais rápida do pano S? Escolha uma.',
            opcoes: [
              'A. Ele recebeu mais aquecimento, favorecendo a evaporação.',
              'B. Ele começou com menos água do que o pano H.',
              'C. Ele ficou mais tempo no varal do que o pano H.',
            ],
            respostas: ['A. Ele recebeu mais aquecimento, favorecendo a evaporação.'],
          },
        ],
        leitura:
          'Leia para aprender. O aquecimento pode tornar a evaporação mais rápida. Mas a água também pode evaporar à sombra. Para comparar a secagem, precisamos considerar as condições dos dois panos. Observe. Os panos S e H são iguais e começaram com a mesma quantidade de água. Ficaram pelo mesmo tempo num local com a mesma circulação de ar. O pano S recebeu mais aquecimento do Sol; o pano H ficou à sombra. No fim, S estava quase seco. H ainda estava úmido, mas tinha menos água do que no começo.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Veja o que cada pano tinha no começo e no fim. Confira quais condições ficaram iguais.',
        sucesso:
          'Os dois panos perderam água por evaporação. Nesse teste, o maior aquecimento ajudou o pano S a secar mais rápido.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v17.svg',
        descricaoIlustracao:
          'Os panos S e H começaram iguais e com a mesma quantidade de água, ficaram pelo mesmo tempo e com a mesma circulação de ar. S recebeu mais aquecimento solar e terminou quase seco. H ficou à sombra e ainda estava úmido, mas tinha menos água que no começo.',
      },
      {
        id: 'sol-sombras-materiais-q18',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q18 — Uma comparação justa',
        instrucao: 'Marque todas as condições que ajudam a fazer essa comparação.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'Marque todas as condições que ajudam a fazer essa comparação.',
            opcoes: [
              'A. Usar latas do mesmo material e tamanho.',
              'B. Colocar a mesma quantidade de gelo nas duas latas.',
              'C. Observar uma lata pela manhã e a outra no final da tarde.',
              'D. Deixar as duas latas pelo mesmo tempo no teste.',
              'E. Usar a mesma cor de cobertura nas duas latas.',
              'F. Deixar as duas latas receberem a mesma exposição ao Sol.',
            ],
            respostas: [
              'A. Usar latas do mesmo material e tamanho.',
              'B. Colocar a mesma quantidade de gelo nas duas latas.',
              'D. Deixar as duas latas pelo mesmo tempo no teste.',
              'F. Deixar as duas latas receberem a mesma exposição ao Sol.',
            ],
            tipo: 'selecao',
          },
        ],
        leitura:
          'Leia para aprender. Para investigar uma diferença, tentamos mudar apenas o que queremos comparar. Se quisermos estudar a influência da cor, mantemos as outras condições parecidas. Comparar dois objetos de tamanhos diferentes, por exemplo, pode atrapalhar a investigação. Observe. Davi quer comparar o aquecimento de duas latas: uma com cobertura preta e outra com cobertura branca. Colocará gelo sobre elas. Ele quer investigar a diferença entre as cores, sem misturar outras diferenças no teste.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Mude só a característica que Davi quer investigar. Confira o que precisa ficar igual nas duas latas.',
        sucesso:
          'Uma comparação justa ajuda a entender o efeito da cor. As outras condições precisam continuar semelhantes.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v18.svg',
        descricaoIlustracao:
          'Davi planeja comparar duas latas, uma com cobertura preta e outra com cobertura branca, usando gelo. Ele quer investigar a influência da cor e escolher quais condições manter iguais.',
      },
      {
        id: 'sol-sombras-materiais-q19',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q19 — O resultado das latas',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'a) Qual lata apresentou o resultado ligado a maior aquecimento nesse teste? Escolha uma.',
            opcoes: [
              'A. A lata branca.',
              'B. As duas, sem diferença no resultado.',
              'C. A lata preta.',
            ],
            respostas: ['C. A lata preta.'],
          },
          {
            pergunta: 'b) Qual explicação combina com as condições descritas? Escolha uma.',
            opcoes: [
              'A. A lata preta tinha recebido mais tempo de Sol.',
              'B. A cobertura preta absorveu mais energia solar nesse teste.',
              'C. A lata branca tinha começado com uma porção maior de gelo.',
            ],
            respostas: ['B. A cobertura preta absorveu mais energia solar nesse teste.'],
          },
        ],
        leitura:
          'Leia para aprender. Em condições semelhantes, superfícies escuras comuns tendem a absorver mais energia solar do que superfícies claras. Essa energia pode aquecê-las. Material, tamanho e tempo de exposição também importam. Observe. Este é um registro inventado para estudar. As duas latas são do mesmo material e tamanho. Uma tem cobertura branca e outra, preta, feitas do mesmo tipo de papel. Receberam a mesma exposição ao Sol durante o mesmo tempo. As porções iniciais de gelo eram iguais. No fim, o gelo sobre a lata preta estava mais derretido do que o gelo sobre a branca.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Compare o gelo no final e releia quais condições foram iguais.',
        sucesso:
          'No registro, a cobertura preta absorveu mais energia e o gelo derreteu mais. A comparação manteve as outras condições iguais.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v19.svg',
        descricaoIlustracao:
          'Registro inventado de duas latas iguais, com coberturas do mesmo tipo de papel, branca e preta. Exposição solar, duração e porções iniciais de gelo foram iguais. No final, o gelo sobre a lata preta estava mais derretido do que sobre a branca.',
      },
      {
        id: 'sol-sombras-materiais-q20',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q20 — Qual camiseta tende a aquecer mais?',
        instrucao:
          'Complete usando palavras do banco. Você não precisa usar todas. Banco: menos · clara · mais · escura.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Nessas condições, a camiseta que tende a aquecer mais é a.',
            respostas: ['escura', 'escuro', 'a escura', 'camiseta escura', 'a camiseta escura'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Isso acontece porque ela costuma absorver energia solar que a outra.',
            respostas: ['mais'],
            pontuacaoFlexivel: true,
          },
        ],
        leitura:
          'Leia para aprender. A cor pode influenciar a quantidade de energia solar absorvida por uma superfície. Para comparar camisetas, também precisamos considerar tecido, espessura e exposição. A cor não substitui os cuidados de proteção ao Sol. Observe. As duas camisetas são do mesmo tecido, tamanho e espessura. Uma é clara; outra, escura. Recebem a mesma exposição ao Sol.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Compare a cor e pense na energia absorvida. Use o banco para completar uma ideia que faça sentido.',
        sucesso:
          'Nessas condições, a camiseta escura tende a absorver mais energia solar e aquecer mais. Todas as cores ainda exigem cuidados de proteção.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v20.svg',
        descricaoIlustracao:
          'Duas camisetas de mesmo tecido, tamanho e espessura recebem a mesma exposição ao Sol. Uma é clara e outra é escura.',
      },
      {
        id: 'sol-sombras-materiais-q21',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q21 — Areia e água na praia',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O que o registro mostra? Escolha uma.',
            opcoes: [
              'A. A areia seca estava mais quente que a água naquele momento.',
              'B. A água estava mais quente que a areia seca naquele momento.',
              'C. A areia e a água estavam com o mesmo aquecimento naquele momento.',
            ],
            respostas: ['A. A areia seca estava mais quente que a água naquele momento.'],
          },
          {
            pergunta: 'b) Qual explicação é adequada? Escolha uma.',
            opcoes: [
              'A. A água do mar nunca recebe energia do Sol.',
              'B. Somente a cor explica o aquecimento de qualquer material.',
              'C. Materiais e condições diferentes podem produzir aquecimentos diferentes.',
            ],
            respostas: [
              'C. Materiais e condições diferentes podem produzir aquecimentos diferentes.',
            ],
          },
        ],
        leitura:
          'Leia para aprender. Materiais diferentes podem se aquecer de maneiras diferentes. Um resultado observado depende também das condições do lugar e do momento. Não podemos concluir que um material nunca aquece por causa de uma única comparação. Observe. Num registro de pesquisa na praia, um adulto observou que a areia seca exposta ao Sol estava mais quente do que a água do mar naquele momento. A água também recebia energia do Sol. O registro não diz que a água estava gelada.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Use o que foi observado naquele momento. Evite transformar um registro em uma regra com ‘sempre’ ou ‘nunca’.',
        sucesso:
          'A areia seca estava mais quente naquele registro. A água também recebe energia do Sol e pode aquecer.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v21.svg',
        descricaoIlustracao:
          'Na observação de um adulto, a areia seca exposta ao Sol estava mais quente que a água do mar naquele momento. A água também recebia energia solar, e o registro não diz que estava gelada.',
      },
      {
        id: 'sol-sombras-materiais-q22',
        bloco: 'Ciências · Calor e transformações',
        titulo: 'Q22 — Um forno que usa o Sol',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que função combina com a tampa A? Escolha uma.',
            opcoes: [
              'A. Bloquear toda a luz que tentaria entrar.',
              'B. Permitir a entrada da luz.',
              'C. Ser a superfície refletora que fica fora da abertura.',
            ],
            respostas: ['B. Permitir a entrada da luz.'],
          },
          {
            pergunta: 'b) Que função combina com a superfície B? Escolha uma.',
            opcoes: [
              'A. Direcionar parte da luz para a abertura.',
              'B. Deixar ver com nitidez através do seu material.',
              'C. Bloquear a abertura para impedir que ela receba luz.',
            ],
            respostas: ['A. Direcionar parte da luz para a abertura.'],
          },
          {
            pergunta: 'c) Que função combina com a superfície C? Escolha uma.',
            opcoes: [
              'A. Deixar a luz atravessar o fundo sem ser absorvida.',
              'B. Impedir que qualquer energia aqueça o interior.',
              'C. Absorver energia que ajuda a aquecer o interior.',
            ],
            respostas: ['C. Absorver energia que ajuda a aquecer o interior.'],
          },
        ],
        leitura:
          'Leia para aprender. Um forno solar usa energia do Sol para aquecer seu interior e ajudar a cozinhar alimentos. A luz pode entrar por uma tampa transparente. Uma superfície refletora ajuda a direcionar luz para dentro. O interior absorve energia, e a estrutura ajuda a diminuir a perda de calor. Observe. No desenho do forno, A é uma tampa transparente. B é uma superfície refletora voltada para a abertura. C é a superfície escura do interior. Um adulto cuida do forno: esta atividade é para observar o desenho, sem montar ou manusear um forno quente.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Relacione cada parte ao caminho da luz: entrar, mudar de direção ou ajudar a aquecer o interior.',
        sucesso:
          'O forno aproveita energia do Sol: a luz entra, o refletor ajuda a direcioná-la e o interior absorve energia. Isso pode ajudar a cozinhar alimentos. Pausa de descoberta: Conte, se quiser, a diferença entre gelo que derrete e água que evapora. Não é preciso fazer uma experiência nem tocar em superfícies quentes.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v22.svg',
        descricaoIlustracao:
          'Forno solar em desenho simplificado. A identifica a tampa transparente, B a superfície refletora voltada para a abertura e C a superfície escura do interior. A luz solar chega à abertura diretamente e também pelo refletor. Um adulto cuida do uso do forno.',
      },
      {
        id: 'sol-sombras-materiais-q23',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q23 — Emitir ou refletir luz?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Sol.',
            opcoes: [
              'A. Fonte artificial que emite luz.',
              'B. Objeto sem luz própria que reflete luz recebida.',
              'C. Fonte natural que emite luz.',
            ],
            respostas: ['C. Fonte natural que emite luz.'],
          },
          {
            pergunta: 'b) Lanterna acesa.',
            opcoes: [
              'A. Fonte natural que emite luz.',
              'B. Fonte artificial que emite luz.',
              'C. Objeto sem luz própria que apenas reflete luz recebida.',
            ],
            respostas: ['B. Fonte artificial que emite luz.'],
          },
          {
            pergunta: 'c) Lua iluminada pelo Sol.',
            opcoes: [
              'A. Objeto sem luz própria que reflete luz recebida.',
              'B. Fonte artificial que emite luz.',
              'C. Fonte natural que emite luz.',
            ],
            respostas: ['A. Objeto sem luz própria que reflete luz recebida.'],
          },
          {
            pergunta: 'd) Outra estrela que vemos no céu.',
            opcoes: [
              'A. Objeto sem luz própria que reflete luz recebida.',
              'B. Fonte artificial que emite luz.',
              'C. Fonte natural que emite luz.',
            ],
            respostas: ['C. Fonte natural que emite luz.'],
          },
        ],
        leitura:
          'Leia para aprender. Uma fonte de luz emite luz. Fontes naturais existem na natureza; fontes artificiais são feitas por pessoas. Um objeto também pode ser visto porque reflete luz recebida, sem produzir luz própria. O Sol e outras estrelas emitem luz; a Lua reflete luz do Sol. Classifique cada exemplo. Escolha uma resposta em cada parte.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Primeiro pense se o exemplo emite luz ou reflete luz recebida. Se emite, confira se é natural ou feito por pessoas.',
        sucesso:
          'Sol e estrelas emitem luz. A lanterna acesa é uma fonte artificial. A Lua pode iluminar refletindo luz que recebe do Sol.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v23.svg',
        descricaoIlustracao:
          'Quatro exemplos para classificar: Sol, lanterna acesa, Lua iluminada pelo Sol e outra estrela vista no céu.',
      },
      {
        id: 'sol-sombras-materiais-q24',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q24 — O que explica cada observação?',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O que explica a imagem do brinquedo no espelho? Escolha uma.',
            opcoes: [
              'A. A luz atravessa o espelho até o que está atrás dele.',
              'B. A luz é refletida pela superfície do espelho.',
              'C. A imagem aparece porque toda a luz é absorvida.',
            ],
            respostas: ['B. A luz é refletida pela superfície do espelho.'],
          },
          {
            pergunta: 'b) O que explica ver a folha através da placa de vidro? Escolha uma.',
            opcoes: [
              'A. A placa bloqueia toda a luz que vem da folha.',
              'B. A placa absorve toda a luz que vem da folha.',
              'C. Parte da luz atravessa a placa transparente.',
            ],
            respostas: ['C. Parte da luz atravessa a placa transparente.'],
          },
          {
            pergunta:
              'c) O que ajuda a explicar o maior aquecimento da superfície escura descrita? Escolha uma.',
            opcoes: [
              'A. Ela absorveu mais energia solar nessa comparação.',
              'B. Ela deixou toda a luz atravessá-la.',
              'C. Ela refletiu toda a luz e não absorveu energia.',
            ],
            respostas: ['A. Ela absorveu mais energia solar nessa comparação.'],
          },
        ],
        leitura:
          'Leia para aprender. A luz pode voltar de uma superfície: isso é reflexão. Pode atravessar um material ou ser absorvida por ele. Um mesmo material pode fazer mais de uma dessas coisas. Aqui, vamos escolher o comportamento que explica cada observação. Observe. Caso 1: no espelho, vemos a imagem de um brinquedo. Caso 2: através de uma placa de vidro transparente, vemos com nitidez uma folha do outro lado. Caso 3: numa comparação de peças iguais, uma superfície opaca escura comum absorveu mais energia solar e aqueceu mais do que uma clara.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Compare as observações: ver uma imagem no espelho, ver através de uma placa e perceber maior aquecimento.',
        sucesso:
          'A reflexão explica a imagem no espelho; a passagem de luz permite ver através do vidro; a absorção ajuda a explicar o aquecimento.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v24.svg',
        descricaoIlustracao:
          'Caso 1: a imagem de um brinquedo é vista no espelho. Caso 2: uma folha é vista com nitidez através de uma placa de vidro. Caso 3: numa comparação entre peças iguais, uma superfície opaca escura comum absorveu mais energia e aqueceu mais do que a clara.',
      },
      {
        id: 'sol-sombras-materiais-q25',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q25 — Dois usos da energia solar',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que mudança da água participa da obtenção de sal na salina? Escolha uma.',
            opcoes: [
              'A. A água congela e vira gelo.',
              'B. A água evapora e o sal permanece.',
              'C. A água líquida derrete.',
            ],
            respostas: ['B. A água evapora e o sal permanece.'],
          },
          {
            pergunta: 'b) Para que serve o painel fotovoltaico dessa casa? Escolha uma.',
            opcoes: [
              'A. Aproveitar energia solar para produzir eletricidade.',
              'B. Retirar o sal da água dos tanques.',
              'C. Usar apenas o calor para aquecer diretamente a água do banho.',
            ],
            respostas: ['A. Aproveitar energia solar para produzir eletricidade.'],
          },
        ],
        leitura:
          'Leia para aprender. Podemos aproveitar energia solar de diferentes maneiras. Ela pode ajudar a aquecer e secar materiais. Algumas tecnologias também a transformam em eletricidade. Observe. Na salina, água salgada fica em tanques rasos. Com o tempo, a quantidade de água diminui e restam cristais de sal. A água não foi escoada para outro tanque. Na casa de Nina, um painel fotovoltaico recebe luz solar e está ligado a um sistema que fornece eletricidade para equipamentos.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Observe o que diminui no tanque e o que o sistema ligado ao painel fornece.',
        sucesso:
          'Na salina, a água evapora e deixa o sal. O painel fotovoltaico usa energia solar para produzir eletricidade: são usos diferentes.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v25.svg',
        descricaoIlustracao:
          'Na salina, água salgada nos tanques rasos diminui com o tempo e deixa cristais de sal; ela não foi escoada. Na casa de Nina, um painel fotovoltaico recebe luz solar e se liga a um sistema que fornece eletricidade aos equipamentos.',
      },
      {
        id: 'sol-sombras-materiais-q26',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q26 — Cuidando de uma planta verde',
        instrucao:
          'Leia cada parte: marque todas onde for pedido, escolha uma ou ordene os cartões.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque todos os cuidados adequados da lista.',
            opcoes: [
              'A. Dar água na quantidade adequada para essa planta.',
              'B. Deixá-la sem luz por muitos dias.',
              'C. Manter o solo sempre encharcado.',
              'D. Colocá-la onde receba a luz de que precisa.',
              'E. Mantê-la num lugar com circulação de ar.',
            ],
            respostas: [
              'A. Dar água na quantidade adequada para essa planta.',
              'D. Colocá-la onde receba a luz de que precisa.',
              'E. Mantê-la num lugar com circulação de ar.',
            ],
            tipo: 'selecao',
          },
          {
            pergunta: 'b) O que a luz ajuda essa planta verde a fazer? Escolha uma.',
            opcoes: [
              'A. Retirar do solo um alimento já pronto para substituir tudo que produz.',
              'B. Crescer sem precisar de água.',
              'C. Produzir seu alimento.',
            ],
            respostas: ['C. Produzir seu alimento.'],
          },
        ],
        leitura:
          'Leia para aprender. Plantas verdes usam luz para produzir seu alimento. Elas também precisam de água, ar e nutrientes. As quantidades e os cuidados variam conforme a planta. Muito calor ou água em excesso podem prejudicá-la. Observe. Nina cuida de uma pequena planta verde em vaso. A planta precisa da luz da janela. O vaso já tem solo com nutrientes e saída para a água. Um adulto ajuda Nina a saber quando regar.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Pense nas necessidades dessa planta. Mais água nem sempre é melhor; procure a função da luz.',
        sucesso:
          'A planta precisa de condições adequadas. A luz ajuda as plantas verdes a produzir alimento; água em excesso também pode prejudicar.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v26.svg',
        descricaoIlustracao:
          'Nina cuida de uma planta verde em vaso, que precisa da luz da janela. O vaso contém solo com nutrientes e tem saída para a água. Um adulto ajuda a decidir quando regar.',
      },
      {
        id: 'sol-sombras-materiais-q27',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q27 — Três registros de cuidado',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Ficou sem a luz de que precisava, mas recebeu água adequada.',
            opcoes: [
              'A. Cresceu com folhas e ramos firmes.',
              'B. Ficou com ramos compridos e fracos.',
              'C. Ficou com folhas murchas, no registro de falta de água.',
            ],
            respostas: ['B. Ficou com ramos compridos e fracos.'],
          },
          {
            pergunta: 'b) Recebeu água e luz adequadas.',
            opcoes: [
              'A. Cresceu com folhas e ramos firmes.',
              'B. Ficou com folhas murchas, no registro de falta de água.',
              'C. Ficou com ramos compridos e fracos.',
            ],
            respostas: ['A. Cresceu com folhas e ramos firmes.'],
          },
          {
            pergunta: 'c) Ficou sem água por muitos dias, mas recebeu luz adequada.',
            opcoes: [
              'A. Ficou com ramos compridos e fracos.',
              'B. Cresceu com folhas e ramos firmes.',
              'C. Ficou com folhas murchas.',
            ],
            respostas: ['C. Ficou com folhas murchas.'],
          },
        ],
        leitura:
          'Leia para aprender. Para cuidar de uma planta, observamos suas necessidades e seus resultados ao longo do tempo. Plantas diferentes não reagem sempre do mesmo jeito. Nesta questão, vamos usar somente os registros do diário. Observe o diário inventado de três mudas do mesmo tipo. - Muda A: recebeu água adequada, mas ficou por muitos dias sem a luz de que precisava. Nesse diário, seus ramos ficaram compridos e fracos. - Muda B: recebeu água e luz adequadas. Nesse diário, cresceu com folhas e ramos firmes. - Muda C: recebeu luz adequada, mas ficou sem água por muitos dias. Nesse diário, suas folhas ficaram murchas. Relacione cada condição ao resultado registrado. Escolha uma em cada parte.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Procure cada condição no diário e compare o resultado anotado. Use esses registros, sem inventar uma mudança diferente.',
        sucesso:
          'O diário mostra resultados ligados a cuidados diferentes. Observar a planta ajuda a perceber o que precisa ser ajustado.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v27.svg',
        descricaoIlustracao:
          'No diário inventado, a muda A recebeu água, mas ficou sem a luz necessária e apresentou ramos compridos e fracos. B recebeu água e luz adequadas e cresceu com folhas e ramos firmes. C recebeu luz, mas ficou sem água por muitos dias e apresentou folhas murchas.',
      },
      {
        id: 'sol-sombras-materiais-q28',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q28 — Dia aqui, noite depois',
        instrucao:
          'Escolha uma resposta em cada parte. Você pode trocar ou desmarcar antes de conferir.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual informação está correta? Escolha uma.',
            opcoes: [
              'A. O Sol é uma estrela; a Terra é um planeta.',
              'B. O Sol é um planeta; a Terra é uma estrela.',
              'C. O Sol e a Terra são estrelas com luz própria.',
            ],
            respostas: ['A. O Sol é uma estrela; a Terra é um planeta.'],
          },
          {
            pergunta:
              'b) Qual movimento explica a mudança de dia para noite nesse lugar? Escolha uma.',
            opcoes: [
              'A. A volta da Terra ao redor do Sol, sozinha, produz essa mudança diária.',
              'B. O giro da Terra em torno de si mesma.',
              'C. Uma volta diária do Sol ao redor da Terra.',
            ],
            respostas: ['B. O giro da Terra em torno de si mesma.'],
          },
        ],
        leitura:
          'Leia para aprender. O Sol é uma estrela e tem luz própria. A Terra é o planeta em que vivemos. Ela gira em torno de si mesma: esse movimento é a rotação. Durante esse giro, um lugar passa pela parte iluminada pelo Sol e depois pela parte sem iluminação direta dele. Observe. O modelo mostra o Sol à esquerda e a Terra à direita. No registro 1, o lugar marcado na Terra está no lado que recebe luz direta do Sol. No registro 2, depois de parte do giro da Terra, esse mesmo lugar está no lado oposto, sem luz direta do Sol. O modelo é simplificado e não está em tamanho real.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Acompanhe o mesmo lugar marcado na Terra e veja qual movimento o leva para outro lado.',
        sucesso:
          'O Sol emite luz, e a Terra é um planeta. A rotação faz um lugar alternar entre dia e noite.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v28.svg',
        descricaoIlustracao:
          'Modelo simplificado, fora de escala, com o Sol à esquerda e a Terra à direita. No registro 1, o lugar marcado recebe luz direta do Sol. No registro 2, após parte do giro da Terra, o mesmo lugar fica do lado oposto, sem luz direta do Sol.',
      },
      {
        id: 'sol-sombras-materiais-q29',
        bloco: 'Ciências · Conexões com a vida',
        titulo: 'Q29 — Um passeio com cuidados',
        instrucao: 'Marque todos os cuidados adequados para esse passeio.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'Marque todos os cuidados adequados para esse passeio.',
            opcoes: [
              'A. Usar protetor e, por isso, ficar no Sol forte pelo tempo que quiser.',
              'B. Beber água durante o passeio.',
              'C. Usar proteção adequada e pedir ajuda ao adulto para o protetor solar.',
              'D. Procurar sombra e fazer pausas.',
              'E. Olhar diretamente para o Sol usando óculos de sol comuns.',
              'F. Observar as sombras no chão, sem olhar diretamente para o Sol.',
            ],
            respostas: [
              'B. Beber água durante o passeio.',
              'C. Usar proteção adequada e pedir ajuda ao adulto para o protetor solar.',
              'D. Procurar sombra e fazer pausas.',
              'F. Observar as sombras no chão, sem olhar diretamente para o Sol.',
            ],
            tipo: 'selecao',
          },
        ],
        leitura:
          'Leia para aprender. Num passeio ao ar livre, sombra, roupas adequadas, chapéu e protetor solar com ajuda de um adulto ajudam na proteção. Beber água cuida da hidratação. Não olhamos diretamente para o Sol, nem com óculos de sol comuns. O protetor não é uma permissão para ficar mais tempo no Sol forte. Observe. Nina e Davi vão visitar um parque com um adulto. Querem observar árvores e sombras. Há locais sombreados para fazer pausas.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Confira se cada atitude ajuda a cuidar do corpo e dos olhos. Um cuidado não cancela a necessidade dos outros.',
        sucesso:
          'Você combinou hidratação, proteção e pausas. Podemos estudar as sombras sem olhar diretamente para o Sol. Pausa de descoberta: Pense em um cuidado que ajuda uma planta e em um cuidado que ajuda você num passeio. Essa conversa não vale ponto e não precisa ser escrita.',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v29.svg',
        descricaoIlustracao:
          'Nina e Davi vão ao parque com um adulto para observar árvores e sombras. Há locais sombreados para pausas. Eles podem levar água e proteção adequada para o passeio.',
      },
      {
        id: 'sol-sombras-materiais-q30',
        bloco: 'Ciências · Detetive da praça',
        titulo: 'Q30 — Uma investigação com quatro pistas',
        instrucao:
          'Leia cada parte: marque todas onde for pedido, escolha uma ou ordene os cartões.',
        tipo: 'misto',
        itens: [
          {
            pergunta:
              'Registro 1 — A sombra. O Sol ilumina um chão plano. Uma placa de madeira está de pé, presa no chão. Ela é opaca. Uma região menos iluminada aparece no chão, do lado oposto ao Sol, ligada à base da placa. a) Marque todos os elementos que explicam a formação dessa sombra.',
            opcoes: [
              'A. A placa opaca no caminho da luz.',
              'B. A placa ter obrigatoriamente pintura preta.',
              'C. A placa precisar se movimentar para formar sombra.',
              'D. A luz do Sol.',
              'E. O chão onde a sombra aparece.',
            ],
            respostas: [
              'A. A placa opaca no caminho da luz.',
              'D. A luz do Sol.',
              'E. O chão onde a sombra aparece.',
            ],
            tipo: 'selecao',
          },
          {
            pergunta:
              'Registro 2 — Uma visão borrada. Davi olha uma flor através da parte fosca de uma divisória. Ele percebe a forma e a cor da flor, mas os detalhes ficam borrados. b) Como é o material dessa parte da divisória? Escolha uma.',
            opcoes: ['A. Translúcido.', 'B. Transparente.', 'C. Opaco.'],
            respostas: ['A. Translúcido.'],
          },
          {
            tipo: 'ordenacao',
            pergunta:
              'Registro 3 — A poça. Num piso impermeável, uma poça de água foi observada enquanto o dia passava. Ninguém acrescentou ou retirou água. Não choveu, a água não escorreu e não entrou no piso. Os cartões descrevem a mudança que aconteceu por evaporação. c) Ordene do começo ao final da observação.',
            cartoes: [
              'A poça está menor.',
              'A poça ocupa uma área maior do piso.',
              'O piso está seco; a água líquida passou para o ar como vapor.',
            ],
            respostas: [
              'A poça ocupa uma área maior do piso.',
              'A poça está menor.',
              'O piso está seco; a água líquida passou para o ar como vapor.',
            ],
            rotuloOrdem: 'começo → depois → final',
          },
          {
            pergunta:
              'Registro 4 — Duas placas. Duas placas têm o mesmo material, tamanho e espessura. Uma é bege-clara; outra é marrom-escura. Recebem a mesma exposição ao Sol durante o mesmo tempo. São superfícies comuns, sem revestimento especial. d) Qual previsão combina com o que você aprendeu? Escolha uma.',
            opcoes: [
              'A. A placa clara tende a absorver mais energia solar e aquecer mais.',
              'B. As duas precisam aquecer exatamente igual porque têm o mesmo tamanho.',
              'C. A placa escura tende a absorver mais energia solar e aquecer mais.',
            ],
            respostas: ['C. A placa escura tende a absorver mais energia solar e aquecer mais.'],
          },
        ],
        leitura:
          'Vamos reunir as descobertas. Em uma praça, Nina e Davi observaram sombras, placas e água. Depois, leram um registro de comparação de duas superfícies. Não precisam tocar em nada quente nem olhar para o Sol. Use os quatro registros abaixo.',
        leituraTitulo: 'Leia para aprender e observe',
        dica: 'Resolva um registro por vez. Procure o bloqueio da luz, a nitidez da visão, a mudança da água e as condições iguais da comparação.',
        sucesso:
          'Você reuniu quatro descobertas: formação de sombras, materiais translúcidos, evaporação e aquecimento de superfícies. A mesma ideia pode ajudar em situações novas!',
        opcoesReversiveis: true,
        ilustracaoLeitura: '../assets/ciencias-sol-sombras-materiais-outubro-2026/v30.svg',
        descricaoIlustracao:
          'Registro 1: Sol, chão plano e placa de madeira opaca de pé; a sombra aparece do lado oposto ao Sol e ligada à base. Registro 2: a forma e a cor de uma flor aparecem através da parte fosca de uma divisória, mas sem detalhes nítidos. Registro 3: uma poça em piso impermeável passa por redução até secar, sem chuva, escoamento, infiltração ou retirada de água; os cartões iniciais mostram poça menor, poça maior e piso seco. Registro 4: placas iguais de mesmo material e espessura, uma bege-clara e outra marrom-escura, recebem a mesma exposição ao Sol durante o mesmo tempo.',
      },
    ],
  });
})();
