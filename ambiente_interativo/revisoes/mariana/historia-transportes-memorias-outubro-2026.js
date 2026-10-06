(function () {
  'use strict';
  // Conteúdo e cenas originais a partir da síntese pedagógica aprovada.
  window.QuestionariosRevisoes.registrar({
    id: 'mariana-historia-transportes-memorias-outubro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'História',
    titulo: 'Uma viagem pelas histórias e memórias',
    subtitulo: 'Transportes, convivência, objetos, diários, cartas e fotografias · Prova 06/10',
    chave: 'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1',
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
            'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Você investigou transportes, convivência, objetos, diários, cartas e fotografias! São 30 questões e 30 pontos. Em conversa, sem pontos, escolha: aprendi / quero praticar mais / preciso de ajuda. Reconheço atitudes de respeito nas viagens; identifico diário, carta e fotografia; comparo mudanças e permanências; sei que registros ajudam a conhecer histórias e precisam de cuidado. Se quiser, pense em algo que gostaria de guardar, sem informar dados pessoais.',
    questoes: [
      {
        id: 'memorias-q01',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '1. Cada transporte em seu caminho',
        instrucao: 'Escolha o grupo de cada transporte: terrestre, aquático ou aéreo.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'Trem',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Terrestre'],
            imagem: '../assets/historia-memorias-outubro/transporte-0.svg',
            imagemAlt: 'Trem — ilustração original.',
          },
          {
            pergunta: 'Canoa',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Aquático'],
            imagem: '../assets/historia-memorias-outubro/transporte-1.svg',
            imagemAlt: 'Canoa — ilustração original.',
          },
          {
            pergunta: 'Helicóptero',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Aéreo'],
            imagem: '../assets/historia-memorias-outubro/transporte-2.svg',
            imagemAlt: 'Helicóptero — ilustração original.',
          },
          {
            pergunta: 'Bicicleta',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Terrestre'],
            imagem: '../assets/historia-memorias-outubro/transporte-3.svg',
            imagemAlt: 'Bicicleta — ilustração original.',
          },
          {
            pergunta: 'Navio',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Aquático'],
            imagem: '../assets/historia-memorias-outubro/transporte-4.svg',
            imagemAlt: 'Navio — ilustração original.',
          },
          {
            pergunta: 'Ônibus',
            opcoes: ['Aquático', 'Aéreo', 'Terrestre'],
            respostas: ['Terrestre'],
            imagem: '../assets/historia-memorias-outubro/transporte-5.svg',
            imagemAlt: 'Ônibus — ilustração original.',
          },
        ],
        dica: 'Pense no caminho: terra, água ou ar.',
        sucesso: 'a categoria depende do meio pelo qual o veículo se desloca.',
        opcoesReversiveis: true,
        leitura:
          'As pessoas usam transportes para chegar a outros lugares. Alguns levam vários passageiros que compartilham a viagem. Os veículos podem mudar com o tempo. A necessidade de respeitar as pessoas continua: esperar a vez, cuidar do espaço e colaborar. Transporte terrestre circula pela terra ou trilhos, aquático pela água e aéreo pelo ar.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q02',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '2. O trem que soltava fumaça',
        instrucao: 'Escolha uma resposta em cada parte.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual transporte recebeu o apelido maria-fumaça?',
            opcoes: ['Bonde elétrico.', 'Trem a vapor.', 'Barco a vela.'],
            respostas: ['Trem a vapor.'],
          },
          {
            pergunta: 'b) O trem circula sobre ______.',
            opcoes: ['rios', 'trilhos', 'nuvens'],
            respostas: ['trilhos'],
          },
        ],
        dica: 'Observe o caminho do veículo e o que sai da chaminé.',
        sucesso: 'tecnologias mudam; nem todo trem atual solta fumaça.',
        opcoesReversiveis: true,
        leitura:
          'Alguns trens antigos queimavam carvão ou lenha para produzir o vapor que os movimentava. A fumaça saía por uma chaminé.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/trem.svg',
        descricaoIlustracao: 'Locomotiva antiga com chaminé soltando fumaça, rodas sobre trilhos.',
      },
      {
        id: 'memorias-q03',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '3. Dois vagões, condições diferentes',
        instrucao: 'Ligue cada característica à primeira ou à segunda classe.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'Passagem mais cara',
            opcoes: ['Segunda classe', 'Primeira classe'],
            respostas: ['Primeira classe'],
          },
          {
            pergunta: 'Menos conforto',
            opcoes: ['Segunda classe', 'Primeira classe'],
            respostas: ['Segunda classe'],
          },
          {
            pergunta: 'Vagão mais confortável',
            opcoes: ['Segunda classe', 'Primeira classe'],
            respostas: ['Primeira classe'],
          },
          {
            pergunta: 'Viagem com animais e grandes volumes',
            opcoes: ['Segunda classe', 'Primeira classe'],
            respostas: ['Segunda classe'],
          },
        ],
        dica: 'Compare as condições dos dois vagões.',
        sucesso:
          'a fonte mostra condições diferentes de viagem naquele contexto; todas as pessoas merecem respeito.',
        opcoesReversiveis: true,
        leitura:
          'No relato estudado no caderno, a primeira classe tinha mais conforto e passagens mais caras. A segunda classe tinha menos conforto e transportava passageiros, grandes volumes e animais.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q04',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '4. Um ônibus bom para todos',
        instrucao: 'Observe o ônibus. Marque as três atitudes que ajudam na convivência.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'Escolha três atitudes.',
            tipo: 'selecao',
            opcoes: [
              '1. Mochila no colo, liberando o corredor.',
              '2. Pés no banco.',
              '3. Conversa sem gritar.',
              '4. Oferecer o assento a quem precisa.',
              '5. Lixo no chão.',
            ],
            respostas: [
              '1. Mochila no colo, liberando o corredor.',
              '3. Conversa sem gritar.',
              '4. Oferecer o assento a quem precisa.',
            ],
          },
        ],
        dica: 'Procure atitudes que cuidam do espaço e das pessoas.',
        sucesso: 'respeitar, manter passagem livre e cuidar dos lugares compartilhados.',
        opcoesReversiveis: true,
        leitura:
          'Observe as cinco cenas numeradas. No espaço compartilhado, cuide das pessoas e da passagem.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/onibus.svg',
        descricaoIlustracao:
          'Cinco cenas no ônibus: 1, passageira com mochila no colo e corredor livre; 2, passageiro com pés no banco; 3, duas pessoas conversam sem gritar; 4, passageiro oferece o assento a uma pessoa com bengala; 5, pessoa deixa papel no chão.',
      },
      {
        id: 'memorias-q05',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '5. Um bonde, dois usos',
        instrucao: 'Associe os usos e compare os dois bondes.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Cidade das Flores',
            opcoes: ['deslocamento cotidiano', 'passeio turístico'],
            respostas: ['passeio turístico'],
          },
          {
            pergunta: 'a) Cidade do Rio Claro',
            opcoes: ['deslocamento cotidiano', 'passeio turístico'],
            respostas: ['deslocamento cotidiano'],
          },
          {
            pergunta: 'b) O que os dois bondes têm em comum?',
            opcoes: [
              'Atendem apenas passeios turísticos.',
              'Atendem apenas deslocamentos diários de moradores.',
              'Podem levar várias pessoas.',
            ],
            respostas: ['Podem levar várias pessoas.'],
          },
        ],
        dica: 'Veja quem usa cada bonde e para quê.',
        sucesso: 'Um transporte pode continuar existindo e ter usos diferentes.',
        opcoesReversiveis: true,
        leitura:
          'Na Cidade das Flores, um bonde leva visitantes para conhecer lugares históricos. Na Cidade do Rio Claro, outro bonde leva moradores em seus caminhos do dia a dia.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q06',
        bloco: 'História · Estação dos transportes coletivos',
        titulo: '6. Um problema que continuou',
        instrucao: 'Compare os dois registros. Escolha uma resposta e marque V ou F.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual problema aparece nos dois registros?',
            opcoes: ['Superlotação.', 'Demora na chegada dos ônibus.', 'Falta de passageiros.'],
            respostas: ['Superlotação.'],
          },
          {
            pergunta: 'b) Os registros foram feitos na mesma época.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
          {
            pergunta: 'b) Um problema pode continuar mesmo com a passagem do tempo.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
        ],
        dica: 'Compare as datas e o problema mostrado.',
        sucesso:
          'permanência é algo que continua; uma fonte escrita e uma visual podem ajudar na comparação. Se quiser, faça uma pausa. Em conversa: que pista você encontrou? O que mudou e o que continuou? Seu progresso fica salvo.',
        opcoesReversiveis: true,
        leitura:
          'Cartão 1 — Resumo da notícia estudada, 1954: passageiros esperavam muito e os ônibus ficavam cheios.\nCartão 2 — Descrição da charge estudada, 2016: um ônibus aparece superlotado.\nSão resumos didáticos, não transcrições ou fotografias históricas.',
        leituraTitulo: 'Leia para aprender · Estação dos transportes coletivos',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q07',
        bloco: 'História · Viagem por terra e água',
        titulo: '7. O automóvel mudou',
        instrucao:
          'Escreva a quantidade de rodas de cada modelo. Em c), complete com uma expressão do banco: navegar / transportar pessoas por terra / voar.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Modelo de 1886: quantidade de rodas',
            respostas: ['3', 'três'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Modelo de 1908: quantidade de rodas',
            respostas: ['4', 'quatro'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'c) O que permaneceu na função dos dois veículos?',
            respostas: ['transportar pessoas por terra'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Observe a quantidade e compare para que servem.',
        sucesso:
          'O formato pode mudar e uma função permanecer. As datas ajudam a situar os exemplos no tempo.',
        opcoesReversiveis: true,
        leitura:
          'Ruas, estradas e rios fazem parte dos caminhos de muitas comunidades. Há pessoas que usam barcos para chegar à escola ou ao trabalho. Fotografias de veículos de outras épocas ajudam a descobrir o que mudou. Em toda viagem, seguimos os cuidados orientados por adultos responsáveis. Quando veículos demais ocupam um caminho ao mesmo tempo, o trânsito avança devagar: isso é congestionamento. Imagine uma avenida diferente desta atividade, cheia de veículos esperando para seguir.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/automoveis.svg',
        descricaoIlustracao:
          'Modelos ilustrados: 1886, veículo antigo de três rodas; 1908, outro modelo de quatro rodas. Quadros vistos de cima mostram separadamente todas as três e quatro rodas para conferir a contagem. Ambos transportam pessoas por terra. Não são fotografias autênticas.',
      },
      {
        id: 'memorias-q08',
        bloco: 'História · Viagem por terra e água',
        titulo: '8. A rua ficou cheia',
        instrucao: 'Observe a rua. Complete a ideia e marque duas escolhas.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Trânsito que avança devagar por haver muitos veículos:',
            opcoes: ['congestionamento', 'embarque', 'fotografia'],
            respostas: ['congestionamento'],
          },
          {
            pergunta: 'b) Duas escolhas que podem diminuir os carros em circulação:',
            tipo: 'selecao',
            opcoes: [
              '1. Cada pessoa ir sozinha em um carro.',
              '2. Usar transporte coletivo quando disponível e adequado.',
              '3. Compartilhar uma viagem que já seria feita, com organização dos adultos.',
              '4. Fazer mais viagens de carro sem necessidade.',
            ],
            respostas: [
              '2. Usar transporte coletivo quando disponível e adequado.',
              '3. Compartilhar uma viagem que já seria feita, com organização dos adultos.',
            ],
          },
        ],
        dica: 'Pense em levar mais pessoas usando menos carros.',
        sucesso:
          'soluções dependem do lugar; passageiros não são culpados por falhas do transporte público.',
        opcoesReversiveis: true,
        leitura:
          'Quando muitos veículos ocupam a rua ao mesmo tempo, o trânsito pode ficar lento. Observe a fila e a faixa do ônibus.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/rua.svg',
        descricaoIlustracao:
          'Muitos carros em fila avançam devagar. Um ônibus segue em faixa própria. Não há pessoas atravessando entre os veículos.',
      },
      {
        id: 'memorias-q09',
        bloco: 'História · Viagem por terra e água',
        titulo: '9. Cuidar da viagem de carro',
        instrucao: 'Marque V para a atitude cuidadosa e F para a atitude que precisa mudar.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta:
              'a) A criança viaja sentada, com proteção adequada ao seu tamanho e orientação de um adulto.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            pergunta: 'b) O passageiro abre a porta com o carro em movimento.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
          {
            pergunta: 'c) O passageiro evita gritos que distraiam quem dirige.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            pergunta: 'd) O passageiro coloca o braço para fora da janela.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
        ],
        dica: 'Veja se a atitude protege a pessoa e ajuda quem dirige a prestar atenção.',
        sucesso: 'Seguimos os cuidados orientados pelos adultos durante a viagem.',
        opcoesReversiveis: true,
        leitura:
          'Em cada situação, observe se a atitude protege as pessoas e ajuda quem dirige a prestar atenção.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/cuidados.svg',
        descricaoIlustracao:
          'Quatro cartões: criança sentada com cinto apoiado no ombro e quadril; porta aberta e carro em movimento; passageiro fala baixo; braço fora da janela. As ações inseguras estão representadas como situações para analisar.',
      },
      {
        id: 'memorias-q10',
        bloco: 'História · Viagem por terra e água',
        titulo: '10. Uma canoa pode contar histórias',
        instrucao: 'Use a legenda para escolher as respostas.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Que material foi usado?',
            opcoes: ['metal', 'madeira', 'plástico'],
            respostas: ['madeira'],
          },
          {
            pergunta: 'b) Por que preservar a canoa?',
            opcoes: [
              'Para conhecer apenas sua aparência, sem estudar sua história.',
              'Para afirmar que todos os barcos atuais são iguais a ela.',
              'Para conhecer formas de viver e viajar do passado.',
            ],
            respostas: ['Para conhecer formas de viver e viajar do passado.'],
          },
        ],
        dica: 'O tronco e a legenda são pistas.',
        sucesso:
          'objeto como fonte histórica; povos indígenas são diversos e vivem também no presente.',
        opcoesReversiveis: true,
        leitura:
          'Em uma exposição, uma canoa antiga aparece com a legenda: “Embarcação feita a partir de um tronco escavado. Foi usada por um povo indígena para se deslocar pela água.” Exemplo didático inspirado no estudo da piroga.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/canoa.svg',
        descricaoIlustracao:
          'Canoa de tronco inteira, com detalhe da parte escavada, formando o espaço interno da embarcação.',
      },
      {
        id: 'memorias-q11',
        bloco: 'História · Viagem por terra e água',
        titulo: '11. Caminhos de uma comunidade',
        instrucao: 'Relacione o que cada veículo leva e seu caminho.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Barco escolar',
            opcoes: ['frutas', 'estudantes'],
            respostas: ['estudantes'],
          },
          {
            pergunta: 'b) Barco de entrega',
            opcoes: ['frutas', 'estudantes'],
            respostas: ['frutas'],
          },
          {
            pergunta: 'c) Barco',
            opcoes: ['terra', 'água'],
            respostas: ['água'],
          },
          {
            pergunta: 'd) Ônibus',
            opcoes: ['terra', 'água'],
            respostas: ['terra'],
          },
        ],
        dica: 'Observe o caminho e o que cada veículo leva.',
        sucesso:
          'transportes atendem pessoas e cargas; nem toda comunidade tem os mesmos caminhos.',
        opcoesReversiveis: true,
        leitura:
          'Na comunidade de Lia, o rio é um caminho importante. Um barco leva estudantes à escola. Outro leva frutas ao mercado. Nas cidades, as pessoas também podem viajar em ônibus.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/barcos.svg',
        descricaoIlustracao:
          'Duas embarcações identificadas: barco escolar com estudantes sentados e coletes fechados; barco de entrega com caixas de frutas. Embarcações com espaço e proteção, sem superlotação.',
      },
      {
        id: 'memorias-q12',
        bloco: 'História · Viagem por terra e água',
        titulo: '12. Embarcar com cuidado',
        instrucao: 'Organize o embarque, do começo ao fim. Depois escolha um cuidado.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Ordem do embarque:',
            tipo: 'ordenacao',
            cartoes: [
              'Entrar com calma quando o adulto responsável orientar.',
              'Aguardar a vez em um lugar seguro.',
              'Sentar no lugar indicado e permanecer em segurança.',
            ],
            respostas: [
              'Aguardar a vez em um lugar seguro.',
              'Entrar com calma quando o adulto responsável orientar.',
              'Sentar no lugar indicado e permanecer em segurança.',
            ],
          },
          {
            pergunta: 'b) Qual cuidado acompanha a viagem de barco?',
            opcoes: [
              'Usar o colete salva-vidas adequado, colocado com ajuda do adulto.',
              'Trocar de lugar correndo durante a viagem.',
              'Ficar de pé na borda.',
            ],
            respostas: ['Usar o colete salva-vidas adequado, colocado com ajuda do adulto.'],
          },
        ],
        dica: 'O que precisa acontecer antes de alguém entrar?',
        sucesso:
          'respeitar a vez e seguir a orientação dos adultos. Se quiser, faça uma pausa. Em conversa: que pista você encontrou? O que mudou e o que continuou? Seu progresso fica salvo.',
        opcoesReversiveis: true,
        leitura:
          'Antes de embarcar, um adulto ajuda a ajustar e fechar o colete. Ele acompanha a orientação para toda a viagem.',
        leituraTitulo: 'Leia para aprender · Viagem por terra e água',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/colete.svg',
        descricaoIlustracao:
          'Criança em local seguro antes do embarque. Colete ajustado, com fechos unidos na frente; adulto acompanha o cuidado.',
      },
      {
        id: 'memorias-q13',
        bloco: 'História · Baú de objetos e registros',
        titulo: '13. Uma sala conta uma história',
        instrucao: 'Observe a sala e escolha as respostas.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque os cinco objetos que aparecem na sala.',
            tipo: 'selecao',
            opcoes: ['mesa', 'bicicleta', 'cadeira', 'espelho', 'livro', 'sofá'],
            respostas: ['mesa', 'cadeira', 'espelho', 'livro', 'sofá'],
          },
          {
            pergunta: 'b) Que pergunta essa imagem pode ajudar a responder?',
            opcoes: [
              'Como era um ambiente de moradia.',
              'Qual é a data de nascimento de quem morou ali.',
              'Como eram todos os cômodos de todas as casas da cidade.',
            ],
            respostas: ['Como era um ambiente de moradia.'],
          },
        ],
        dica: 'Observe os objetos e o lugar representado.',
        sucesso:
          'uma pintura pode ser uma fonte sobre ambientes e costumes, mas também apresenta escolhas de quem a pintou.',
        opcoesReversiveis: true,
        leitura:
          'Um brinquedo, uma pintura e um uniforme podem contar histórias quando sabemos quem os usou e em que situação. Documentos registram informações sobre pessoas. Nem todas as informações são públicas: os documentos verdadeiros ficam protegidos. Nosso baú usará personagens inventados. Uma carta é um registro escrito e também um objeto material.',
        leituraTitulo: 'Leia para aprender · Baú de objetos e registros',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/sala.svg',
        descricaoIlustracao:
          'Interior ilustrado de uma moradia de outra época: mesa de madeira, cadeira, espelho na parede, livro na mesa e sofá. Não há bicicleta.',
      },
      {
        id: 'memorias-q14',
        bloco: 'História · Baú de objetos e registros',
        titulo: '14. Para que serve cada registro?',
        instrucao: 'Ligue cada item à sua função principal neste exemplo.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'Carteira de identidade',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['identificar uma pessoa'],
          },
          {
            pergunta: 'Certidão de nascimento',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['registrar o nascimento'],
          },
          {
            pergunta: 'Cartão de vacinação',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['registrar vacinas recebidas'],
          },
          {
            pergunta: 'Diário',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['registrar acontecimentos e sentimentos'],
          },
          {
            pergunta: 'Álbum',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['reunir fotografias'],
          },
          {
            pergunta: 'Brinquedo',
            opcoes: [
              'reunir fotografias',
              'registrar o nascimento',
              'brincar',
              'identificar uma pessoa',
              'registrar acontecimentos e sentimentos',
              'registrar vacinas recebidas',
            ],
            respostas: ['brincar'],
          },
        ],
        dica: 'Pense no que fazemos com cada item.',
        sucesso:
          'vários itens ajudam a conhecer a vida das pessoas; objeto cotidiano e registro histórico podem se relacionar.',
        opcoesReversiveis: true,
        leitura:
          'Objetos e registros podem oferecer pistas sobre histórias. Estes cartões são exemplos de brincadeira, sem dados reais.',
        leituraTitulo: 'Leia para aprender · Baú de objetos e registros',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/registros.svg',
        descricaoIlustracao:
          'Seis cartões genéricos com identificação EXEMPLO FICTÍCIO: identidade, nascimento, vacinas, diário, álbum e brinquedo. Sem números reais, brasões ou modelos oficiais.',
      },
      {
        id: 'memorias-q15',
        bloco: 'História · Baú de objetos e registros',
        titulo: '15. Investigando um registro inventado',
        instrucao:
          'Escreva a informação pedida usando o banco: Nina Estrela / 12 de maio de 2019 / Vila das Conchas / 12 de maio de 2024 / Vila das Flores.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Quem nasceu?',
            respostas: ['Nina Estrela'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Quando nasceu?',
            respostas: ['12 de maio de 2019'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'c) Em qual cidade nasceu?',
            respostas: ['Vila das Conchas'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Procure o rótulo: nome, nascimento ou cidade.',
        sucesso: 'Documentos registram informações. Os verdadeiros devem ser protegidos.',
        opcoesReversiveis: true,
        leitura:
          'EXEMPLO FICTÍCIO PARA A ATIVIDADE.\nRegistro de nascimento: nome: Nina Estrela; nascimento: 12 de maio de 2019; cidade: Vila das Conchas.\nNão é uma réplica de certidão oficial. Todos os dados foram inventados.',
        leituraTitulo: 'Leia para aprender · Baú de objetos e registros',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q16',
        bloco: 'História · Baú de objetos e registros',
        titulo: '16. O objeto e sua lembrança',
        instrucao: 'Ligue cada objeto à pista que ele oferece.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'Pião',
            opcoes: [
              'vida escolar',
              'comunicação entre pessoas',
              'brincadeiras da infância',
              'preparo de alimentos',
            ],
            respostas: ['brincadeiras da infância'],
          },
          {
            pergunta: 'Panela',
            opcoes: [
              'vida escolar',
              'comunicação entre pessoas',
              'brincadeiras da infância',
              'preparo de alimentos',
            ],
            respostas: ['preparo de alimentos'],
          },
          {
            pergunta: 'Uniforme',
            opcoes: [
              'vida escolar',
              'comunicação entre pessoas',
              'brincadeiras da infância',
              'preparo de alimentos',
            ],
            respostas: ['vida escolar'],
          },
          {
            pergunta: 'Carta',
            opcoes: [
              'vida escolar',
              'comunicação entre pessoas',
              'brincadeiras da infância',
              'preparo de alimentos',
            ],
            respostas: ['comunicação entre pessoas'],
          },
        ],
        dica: 'A legenda ajuda a descobrir como o objeto foi usado.',
        sucesso:
          'O contexto ajuda a interpretar objetos. Objetos antigos podiam ter usos diferentes em cada família. Se quiser, faça uma pausa. Em conversa: que pista você encontrou? O que mudou e o que continuou? Seu progresso fica salvo.',
        opcoesReversiveis: true,
        leitura:
          'Na exposição de Bia, cada objeto tem uma legenda: um pião usado pelo tio quando era criança; uma panela usada para cozinhar nos encontros de família; um uniforme usado no primeiro ano de escola; uma carta enviada por uma amiga distante.',
        leituraTitulo: 'Leia para aprender · Baú de objetos e registros',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q17',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '17. O diário de Clara',
        instrucao: 'Leia o diário de Clara e escolha uma resposta em cada parte.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Quem escreveu?',
            opcoes: ['A professora.', 'Uma pessoa do álbum.', 'Clara.'],
            respostas: ['Clara.'],
          },
          {
            pergunta: 'b) O que ela registrou?',
            opcoes: [
              'Uma visita a uma exposição.',
              'Uma viagem de avião.',
              'Uma festa de aniversário.',
            ],
            respostas: ['Uma visita a uma exposição.'],
          },
          {
            pergunta: 'c) Como ela disse que se sentiu?',
            opcoes: ['Com sono.', 'Curiosa.', 'Irritada.'],
            respostas: ['Curiosa.'],
          },
        ],
        dica: 'Encontre no diário a assinatura, o acontecimento e o sentimento.',
        sucesso:
          'o diário pode guardar acontecimentos e sentimentos. A data situa o registro no tempo.',
        opcoesReversiveis: true,
        leitura:
          'No diário, uma pessoa pode escrever acontecimentos, ideias e sentimentos. A data ajuda a saber quando fez o registro. Uma carta tem uma mensagem para alguém. A assinatura mostra quem escreveu. Esses registros também podem ajudar a conhecer a história de pessoas e famílias. Exemplo separado: data — 2 de outubro de 2026; acontecimento — visitei um jardim; sentimento — fiquei alegre; autor — Rui; destinatário de uma carta — Sol.\n\nObserve estas pistas:\n15 de setembro de 2026. Querido diário, hoje visitei uma exposição com minha turma. Vi uma canoa antiga e um álbum de fotografias. Fiquei curiosa para saber quem havia usado aqueles objetos. Depois, conversei com a professora. Clara.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q18',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '18. Diferentes diários',
        instrucao: 'Escolha o tipo que combina com o assunto principal de cada descrição.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Uma pessoa registra principalmente seus sentimentos e escolhas do dia.',
            opcoes: ['diário de viagem', 'diário pessoal', 'diário familiar'],
            respostas: ['diário pessoal'],
          },
          {
            pergunta:
              'b) Uma família registra principalmente encontros e acontecimentos vividos em conjunto.',
            opcoes: ['diário de viagem', 'diário pessoal', 'diário familiar'],
            respostas: ['diário familiar'],
          },
          {
            pergunta: 'c) Um viajante registra principalmente caminhos e lugares visitados.',
            opcoes: ['diário de viagem', 'diário pessoal', 'diário familiar'],
            respostas: ['diário de viagem'],
          },
        ],
        dica: 'Veja qual é o assunto principal de cada registro.',
        sucesso:
          'categorias podem se cruzar na vida real; nesta atividade, usamos o objetivo principal indicado.',
        opcoesReversiveis: true,
        leitura:
          'Há diários com objetivos diferentes. Aqui vamos observar o assunto principal de cada trecho: a vida de uma pessoa, os acontecimentos da família ou uma viagem.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q19',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '19. Vamos montar uma página de diário',
        instrucao:
          'Neste modelo, organize primeiro a data, depois a saudação, o acontecimento e, por último, o sentimento.',
        tipo: 'ordenacao',
        itens: [
          {
            pergunta: 'Próximo cartão',
            respostas: ['20 de setembro de 2026.'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'Próximo cartão',
            respostas: ['Querido diário,'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'Próximo cartão',
            respostas: ['Hoje conheci um brinquedo que meu tio usava quando era pequeno.'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'Próximo cartão',
            respostas: ['Fiquei contente com a descoberta.'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Descubra qual trecho diz quando aconteceu e qual conta o que foi vivido.',
        sucesso:
          'A data e o acontecimento ajudam a lembrar. “Querido diário” é uma possibilidade. Se quiser, conte em conversa um acontecimento inventado, sem pontos.',
        opcoesReversiveis: true,
        leitura:
          'Neste modelo de diário, cada trecho tem uma função: data, saudação, acontecimento ou sentimento.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        cartoes: [
          'Fiquei contente com a descoberta.',
          'Querido diário,',
          '20 de setembro de 2026.',
          'Hoje conheci um brinquedo que meu tio usava quando era pequeno.',
        ],
      },
      {
        id: 'memorias-q20',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '20. Quem escreveu? Quem recebeu?',
        instrucao:
          'Complete a ficha usando o banco: Lia / Theo / Vila das Conchas / 21 de setembro de 2026 / Vila do Sol / 21 de outubro de 2026. Para e): bicicleta / barco / trem.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Quem escreveu?',
            respostas: ['Theo'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Para quem escreveu?',
            respostas: ['Lia'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'c) Onde escreveu?',
            respostas: ['Vila das Conchas'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'd) Qual é a data?',
            respostas: ['21 de setembro de 2026'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'e) Em que transporte viajou?',
            respostas: ['barco'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'A abertura, a assinatura e a mensagem trazem pistas diferentes.',
        sucesso:
          'Remetente é quem envia; destinatário é quem recebe. A abertura, a assinatura e a mensagem ajudam a entender uma carta.',
        opcoesReversiveis: true,
        leitura:
          'Vila das Conchas, 21 de setembro de 2026. Querida Lia, hoje viajamos de barco e visitamos uma exposição de brinquedos. Pensei que você gostaria de conhecer esse lugar. Um abraço, Theo.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q21',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '21. Uma carta com começo, mensagem e assinatura',
        instrucao: 'Ligue cada trecho à parte da carta.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'Vila do Sol, 22 de setembro de 2026.',
            opcoes: [
              'mensagem',
              'assinatura',
              'local e data',
              'despedida',
              'pessoa a quem se escreve',
            ],
            respostas: ['local e data'],
          },
          {
            pergunta: 'Querido Ravi,',
            opcoes: [
              'mensagem',
              'assinatura',
              'local e data',
              'despedida',
              'pessoa a quem se escreve',
            ],
            respostas: ['pessoa a quem se escreve'],
          },
          {
            pergunta:
              'Nossa turma encontrou uma fotografia antiga da escola. Vamos comparar com uma foto atual?',
            opcoes: [
              'mensagem',
              'assinatura',
              'local e data',
              'despedida',
              'pessoa a quem se escreve',
            ],
            respostas: ['mensagem'],
          },
          {
            pergunta: 'Até logo,',
            opcoes: [
              'mensagem',
              'assinatura',
              'local e data',
              'despedida',
              'pessoa a quem se escreve',
            ],
            respostas: ['despedida'],
          },
          {
            pergunta: 'Isa.',
            opcoes: [
              'mensagem',
              'assinatura',
              'local e data',
              'despedida',
              'pessoa a quem se escreve',
            ],
            respostas: ['assinatura'],
          },
        ],
        dica: 'Qual trecho conta a novidade? Qual mostra quem escreveu?',
        sucesso:
          'uma carta pode comunicar e guardar uma lembrança. Ela não precisa ser enviada de verdade na atividade.',
        opcoesReversiveis: true,
        leitura:
          'Vila do Sol, 22 de setembro de 2026. Querido Ravi, nossa turma encontrou uma fotografia antiga da escola. Vamos comparar com uma foto atual? Até logo, Isa.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q22',
        bloco: 'História · Oficina de diários e cartas',
        titulo: '22. O que mudou na comunicação?',
        instrucao:
          'Complete com o banco: digital / papel / se comunicar / viajar pelo ar / madeira.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Na carta, a mensagem do exemplo foi escrita em ______.',
            respostas: ['papel'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'b) Na tela, foi enviada por um meio ______.',
            respostas: ['digital'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'c) Nos dois exemplos, as pessoas querem ______.',
            respostas: ['se comunicar'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Compare o suporte e a finalidade da mensagem.',
        sucesso:
          'Formas de comunicação mudam. Cartas e mensagens digitais coexistem e podem ser registros históricos. Se quiser, faça uma pausa. Em conversa: que pista você encontrou? O que mudou e o que continuou? Seu progresso fica salvo.',
        opcoesReversiveis: true,
        leitura: 'Compare onde as mensagens foram escritas e o que as pessoas querem fazer.',
        leituraTitulo: 'Leia para aprender · Oficina de diários e cartas',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/comunicacao.svg',
        descricaoIlustracao:
          'Carta em papel com envelope e mensagem de texto em uma tela. Ambas dizem: Amiga, vamos visitar uma exposição? São mensagens fictícias.',
      },
      {
        id: 'memorias-q23',
        bloco: 'História · Galeria de fotografias',
        titulo: '23. Um álbum de muitas histórias',
        instrucao: 'Marque V ou F usando a história de Dora.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) O álbum reúne fotografias.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            pergunta: 'b) A fotografia mostra que Lúcia também teve infância.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            pergunta: 'c) O álbum prova que todas as famílias vivem do mesmo jeito.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
          {
            pergunta: 'd) As fotos podem registrar pessoas, lugares e momentos.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
        ],
        dica: 'Veja o que o álbum mostra e o que ele não pode provar.',
        sucesso:
          'famílias são diversas; um registro conta uma história situada, não a história de todas as famílias.',
        opcoesReversiveis: true,
        leitura:
          'Um álbum pode guardar fotos de pessoas, lugares e momentos. As legendas ajudam a entender cada imagem. Observamos roupas, objetos e espaços. Uma foto oferece pistas, mas não mostra tudo: para algumas perguntas precisamos de outro registro ou do relato de alguém. Em uma foto posada, as pessoas se organizam para o retrato. Em uma foto espontânea, o registro acompanha uma ação sem essa preparação. Foto antiga pode ser colorida e foto atual pode ser preta e branca.\n\nObserve estas pistas:\nDora recebeu de uma tia um álbum. Nas páginas havia fotografias de pessoas, lugares e comemorações de diferentes épocas. Ao lado de uma foto, leu: “Lúcia quando era criança”. Hoje Lúcia é adulta.',
        leituraTitulo: 'Leia para aprender · Galeria de fotografias',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q24',
        bloco: 'História · Galeria de fotografias',
        titulo: '24. Primeiro, depois e mais tarde',
        instrucao: 'Organize as fotos do acontecimento mais antigo para o mais recente.',
        tipo: 'ordenacao',
        itens: [
          {
            pergunta: 'Próximo cartão',
            respostas: ['2017: Luna bebê'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'Próximo cartão',
            respostas: ['2020: Luna brinca no parque'],
            pontuacaoFlexivel: true,
          },
          {
            pergunta: 'Próximo cartão',
            respostas: ['2023: Luna participa de uma festa escolar'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Compare os anos das legendas.',
        sucesso: 'Datas ajudam a colocar acontecimentos em ordem.',
        opcoesReversiveis: true,
        leitura:
          'Luna é uma personagem fictícia diferente de Lúcia. Observe as datas nas legendas das três cenas.',
        leituraTitulo: 'Leia para aprender · Galeria de fotografias',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        cartoes: [
          '2023: Luna participa de uma festa escolar',
          '2017: Luna bebê',
          '2020: Luna brinca no parque',
        ],
        ilustracaoLeitura: '../assets/historia-memorias-outubro/luna.svg',
        descricaoIlustracao:
          'Três cenas fictícias com legendas: 2023, Luna em festa escolar; 2017, Luna bebê; 2020, Luna brinca no parque.',
      },
      {
        id: 'memorias-q25',
        bloco: 'História · Galeria de fotografias',
        titulo: '25. A foto mostra tudo?',
        instrucao: 'Observe a cena e sua legenda. Separe informações e suposições.',
        tipo: 'misto',
        itens: [
          {
            pergunta: 'a) Marque três informações da cena ou legenda.',
            tipo: 'selecao',
            opcoes: [
              '1. Há livros.',
              '2. Há sete pessoas.',
              '3. Todas as pessoas gostam da mesma história.',
              '4. O encontro ocorreu em 2024.',
              '5. Sabemos o nome de cada pessoa.',
            ],
            respostas: ['1. Há livros.', '2. Há sete pessoas.', '4. O encontro ocorreu em 2024.'],
          },
          {
            pergunta: 'b) Só por essa foto, sabemos com certeza como cada pessoa se sentiu?',
            opcoes: [
              'Sim, apenas porque estão juntas.',
              'Sim, apenas porque aparecem com livros.',
              'Não; precisaríamos de mais informações.',
            ],
            respostas: ['Não; precisaríamos de mais informações.'],
          },
        ],
        dica: 'Separe o que está visível ou escrito do que seria uma suposição.',
        sucesso:
          'roupa, posição e expressão oferecem pistas, mas não permitem afirmar pensamentos ou sentimentos com certeza.',
        opcoesReversiveis: true,
        leitura:
          'Uma fotografia e sua legenda oferecem pistas. Nem toda suposição pode ser confirmada só por uma imagem.\n\nIlustração de uma fotografia fictícia. Legenda: Encontro de leitura da escola, 2024.',
        leituraTitulo: 'Leia para aprender · Galeria de fotografias',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/leitura.svg',
        descricaoIlustracao:
          'Exatamente seis crianças e uma professora em um pátio. As sete pessoas têm livros nas mãos. Há uma mesa de livros. Legenda: Encontro de leitura da escola, 2024.',
      },
      {
        id: 'memorias-q26',
        bloco: 'História · Galeria de fotografias',
        titulo: '26. Escolhendo uma legenda',
        instrucao:
          'Veja o lugar, as pessoas e o que estão fazendo. Escolha uma legenda para cada cena.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual legenda combina com a cena 1?',
            opcoes: [
              'Brincadeira com bola na praça.',
              'Retrato do grupo em uma festa de casamento.',
              'Passageiros num barco.',
            ],
            respostas: ['Retrato do grupo em uma festa de casamento.'],
            imagem: '../assets/historia-memorias-outubro/casamento.svg',
            imagemAlt:
              'Cena 1: grupo familiar posando em um casamento fictício, com roupas de ocasião especial. Não se atribuem papéis familiares pela aparência.',
          },
          {
            pergunta: 'b) Qual legenda combina com a cena 2?',
            opcoes: [
              'Duas crianças brincam na praça.',
              'Duas crianças escrevem uma carta.',
              'Uma família janta em casa.',
            ],
            respostas: ['Duas crianças brincam na praça.'],
            imagem: '../assets/historia-memorias-outubro/praca.svg',
            imagemAlt:
              'Cena 2: duas crianças brincando com uma bola em uma praça com árvore e banco.',
          },
        ],
        dica: 'Veja o lugar, as pessoas e o que estão fazendo.',
        sucesso:
          'no contexto estudado, roupa de domingo quer dizer roupa reservada a ocasião especial; não significa que a fotografia foi feita obrigatoriamente em um domingo. A roupa não determina o valor das pessoas.',
        opcoesReversiveis: true,
      },
      {
        id: 'memorias-q27',
        bloco: 'História · Galeria de fotografias',
        titulo: '27. Cuidar das lembranças',
        instrucao: 'Marque as três atitudes que ajudam a preservar e proteger os registros.',
        tipo: 'selecao',
        itens: [
          {
            pergunta: 'Escolha três atitudes.',
            tipo: 'selecao',
            opcoes: [
              '1. Guardar fotografias de papel em local limpo e protegido.',
              '2. Escrever por cima da imagem com caneta para decorar.',
              '3. Com ajuda do adulto, fazer uma cópia digital e guardar informações sobre a foto.',
              '4. Publicar documentos pessoais num lugar aberto a qualquer pessoa.',
              '5. Manusear com cuidado os objetos de uma exposição.',
            ],
            respostas: [
              '1. Guardar fotografias de papel em local limpo e protegido.',
              '3. Com ajuda do adulto, fazer uma cópia digital e guardar informações sobre a foto.',
              '5. Manusear com cuidado os objetos de uma exposição.',
            ],
          },
        ],
        dica: 'Preservar é cuidar para que o registro possa continuar sendo conhecido.',
        sucesso:
          'Preservação inclui papel, arquivos digitais e contexto. Compartilhar fotos de outras pessoas exige cuidado e decisão do adulto.',
        opcoesReversiveis: true,
        leitura: 'Preservar registros é cuidar deles e das informações que ajudam a entendê-los.',
        leituraTitulo: 'Leia para aprender · Galeria de fotografias',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
      },
      {
        id: 'memorias-q28',
        bloco: 'História · Galeria de fotografias',
        titulo: '28. Duas fotos, épocas diferentes',
        instrucao: 'Compare as datas, as roupas e a posição das pessoas nas duas fotos fictícias.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Qual registro é mais antigo?',
            opcoes: ['foto A', 'foto B'],
            respostas: ['foto A'],
          },
          {
            pergunta: 'b) O que mudou nos exemplos?',
            opcoes: ['finalidade de registrar um grupo', 'estilo das roupas'],
            respostas: ['estilo das roupas'],
          },
          {
            pergunta: 'c) O que permaneceu?',
            opcoes: ['finalidade de registrar um grupo', 'estilo das roupas'],
            respostas: ['finalidade de registrar um grupo'],
          },
          {
            pergunta:
              'd) As pessoas se organizaram e ficaram paradas para o retrato. As fotos são:',
            opcoes: ['posadas', 'feitas durante uma corrida'],
            respostas: ['posadas'],
          },
        ],
        dica: 'Compare a data, as roupas e a posição das pessoas.',
        sucesso:
          'fotos atuais também podem ser posadas; fotos em preto e branco podem ser atuais. O ano da legenda é uma pista mais segura que a cor isolada. Se quiser, faça uma pausa. Em conversa: que pista você encontrou? O que mudou e o que continuou? Seu progresso fica salvo.',
        opcoesReversiveis: true,
        leitura:
          'Foto fictícia A, 1920: grupo familiar posado em frente a uma moradia, com roupas de outra época.\nFoto fictícia B, 2026: outro grupo familiar posado em frente a uma moradia, com roupas atuais.\nSão grupos diferentes; a cor da imagem não determina a data.',
        leituraTitulo: 'Leia para aprender · Galeria de fotografias',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/epocas.svg',
        descricaoIlustracao:
          'A, 1920: três pessoas posadas diante de uma moradia, com chapéus, saia comprida e colete. B, 2026: outro grupo de três pessoas posadas diante de outra moradia, com camiseta, calça e tênis. Datas nas legendas. Não são as mesmas pessoas.',
      },
      {
        id: 'memorias-q29',
        bloco: 'História · Missão final',
        titulo: '29. Três pistas da mesma viagem',
        instrucao: 'Junte as pistas do mesmo conjunto de viagem.',
        tipo: 'opcoes',
        itens: [
          {
            pergunta: 'a) Fonte 1',
            opcoes: ['registro escrito', 'imagem'],
            respostas: ['imagem'],
          },
          {
            pergunta: 'a) Fonte 2',
            opcoes: ['registro escrito', 'imagem'],
            respostas: ['registro escrito'],
          },
          {
            pergunta: 'a) Fonte 3',
            opcoes: ['registro escrito', 'imagem'],
            respostas: ['registro escrito'],
          },
          {
            pergunta: 'b) Qual fonte mostra o meio de transporte?',
            opcoes: ['O bilhete da exposição.', 'A fotografia.', 'O trecho de diário apresentado.'],
            respostas: ['A fotografia.'],
          },
          {
            pergunta: 'c) Qual fonte informa que houve visita à exposição de brinquedos?',
            opcoes: ['O bilhete.', 'A fotografia.', 'O trecho de diário apresentado.'],
            respostas: ['O bilhete.'],
          },
          {
            pergunta: 'd) Por que juntar as fontes?',
            opcoes: [
              'Para substituir todas as fontes por uma única lembrança.',
              'Para escolher só o registro mais bonito.',
              'Para combinar informações e conhecer melhor o acontecimento.',
            ],
            respostas: ['Para combinar informações e conhecer melhor o acontecimento.'],
          },
        ],
        dica: 'Procure em qual fonte aparece cada informação.',
        sucesso:
          'cruzar fontes enriquece a investigação; uma fonte não precisa contar tudo sozinha.',
        opcoesReversiveis: true,
        leitura:
          'Quem investiga uma história pode comparar objetos, imagens e registros escritos. Uma pista ajuda a entender outra. Cuidar dessas fontes permite que outras pessoas também conheçam as histórias.\n\nObserve estas pistas:\nFonte 1 — Fotografia ilustrada: Nina e seu tio em um barco, 2025.\nFonte 2 — Diário: “Em 2025, visitei a outra margem do rio com meu tio.”\nFonte 3 — Bilhete: “Visita à exposição de brinquedos, 2025”.\nAs três fontes pertencem ao mesmo conjunto de viagem, e cada uma traz informação própria.',
        leituraTitulo: 'Leia para aprender · Missão final',
        fonteEstudo: 'Textos e cenas originais da revisão de outubro de 2026.',
        ilustracaoLeitura: '../assets/historia-memorias-outubro/viagem.svg',
        descricaoIlustracao:
          'Fotografia fictícia da fonte 1: Nina e seu tio sentados em um barco protegido, com coletes fechados. Legenda: Nina e seu tio em um barco, 2025.',
      },
      {
        id: 'memorias-q30',
        bloco: 'História · Missão final',
        titulo: '30. Ouvir, escrever e lembrar',
        instrucao:
          'Ouça uma frase de cada vez e escreva. Você pode repetir, parar e corrigir antes de conferir. Se não houver voz local disponível, um adulto pode ditar pelo roteiro.',
        tipo: 'campos',
        itens: [
          {
            pergunta: 'a) Frase 1',
            respostas: ['Respeitamos as pessoas durante a viagem.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
          {
            pergunta: 'b) Frase 2',
            respostas: ['O diário guarda acontecimentos e sentimentos.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
          {
            pergunta: 'c) Frase 3',
            respostas: ['As fotografias ajudam a conhecer histórias.'],
            pontuacaoFlexivel: true,
            fraseCompleta: true,
          },
        ],
        dica: 'Ouça novamente a frase deste campo e veja se escreveu todas as palavras.',
        sucesso:
          'Respeitar as pessoas, registrar acontecimentos e cuidar das fotografias ajuda a conhecer histórias.',
        opcoesReversiveis: true,
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
    ],
  });
})();
