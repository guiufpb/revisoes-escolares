(function () {
  'use strict';

  // Fonte pedagógica: síntese fornecida, páginas 50–61 e temas complementares.
  // Datas e usos dos bondes são os do material estudado, não horários atuais.
  var apoios = {
    1: {
      fonte: 'Caderno de História, página 50 — texto adaptado.',
      texto:
        'Há cerca de 150 anos, as pessoas se deslocavam de muitas formas no Brasil: a pé, a cavalo, de charrete, de carroça, de barco, de bonde ou de trem. Metrôs modernos e automóveis elétricos atuais ainda não faziam parte daquele cotidiano.',
    },
    2: {
      fonte: 'Caderno de História, página 50 — poema apresentado em resumo.',
      texto:
        'O poema estudado apresenta uma maria-fumaça atravessando o vento sobre os trilhos e trazendo a lembrança de outro tempo. Maria-fumaça era o nome dado aos primeiros trens.',
    },
    3: {
      fonte: 'Caderno de História, página 50 — quadro “Você sabia?”.',
      texto:
        'Os primeiros trens queimavam carvão ou lenha para se movimentar. Essa queima lançava fumaça no ar. Por isso, esses trens ficaram conhecidos como “maria-fumaça”.',
    },
    4: {
      fonte: 'Material complementar — classificação dos transportes.',
      texto:
        'Meios terrestres deslocam-se pela terra ou sobre trilhos. Meios aquáticos navegam pela água. Meios aéreos voam. Assim podemos comparar transportes de épocas e lugares diferentes.',
    },
    5: {
      fonte: 'Caderno de História, página 51 — explicação adaptada.',
      texto:
        'No passado, os trens tinham vagões de primeira e de segunda classe. Os vagões de primeira classe eram mais confortáveis, mas suas passagens custavam mais caro.',
    },
    6: {
      fonte: 'Caderno de História, página 51 — relato de Zélia Gattai adaptado.',
      texto:
        'Zélia Gattai contou que os vagões de segunda classe ficavam cheios. Neles viajavam pessoas, volumes grandes, mercadorias e animais. Era uma forma de viajar com menos conforto.',
    },
    7: {
      fonte: 'Caderno de História, páginas 51 e 61 — comparação adaptada.',
      texto:
        'Primeira classe: vagões confortáveis e passagens mais caras. Segunda classe: menos conforto, passagens mais baratas e transporte de pessoas, mercadorias e animais.',
    },
    8: {
      fonte: 'Caderno de História, página 52 — texto de Machado de Assis adaptado.',
      texto:
        'Machado de Assis escreveu, em tom de brincadeira, uma regra para quem lia jornal no bonde: abrir a folha com cuidado para não encostar nos vizinhos nem no passageiro da frente. A regra protegia o espaço das outras pessoas.',
    },
    9: {
      fonte: 'Caderno de História, página 52 — explicação adaptada.',
      texto:
        'Os bondes começaram a circular nas cidades brasileiras há cerca de 150 anos. Eles levavam vários passageiros e exigiam regras de convivência durante a viagem.',
    },
    10: {
      fonte: 'Caderno de História, página 53 — fotografias e legendas descritas.',
      texto:
        'Há poucos bondes em funcionamento atualmente. No exemplo do caderno, o bonde de Santos (SP) funciona aos fins de semana e transporta turistas. O bonde de Santa Teresa, no Rio de Janeiro (RJ), funciona diariamente e transporta principalmente moradores.',
    },
    11: {
      fonte: 'Caderno de História, página 54 — linha do tempo dos ônibus.',
      texto:
        'Os primeiros ônibus movidos a gasolina começaram a circular no Brasil em 1908. Depois, a partir da década de 1940, tornaram-se um dos principais meios de transporte em muitas cidades brasileiras.',
    },
    12: {
      fonte: 'Caderno de História, página 54 — linha do tempo dos ônibus.',
      texto:
        'Em 1908 começaram a circular os primeiros ônibus a gasolina no Brasil. A partir da década de 1940, os ônibus ganharam grande importância no transporte de passageiros das maiores cidades.',
    },
    13: {
      fonte:
        'Jornal O Povo, 2 de abril de 1954 — notícia reproduzida no caderno, página 54, em resumo.',
      texto:
        'Uma notícia de 1954 contou que passageiros esperavam horas nos pontos. Quando os ônibus chegavam, já vinham superlotados e, algumas vezes, nem paravam. A notícia registra problemas enfrentados pelas pessoas naquela época.',
    },
    14: {
      fonte: 'Caderno de História, páginas 54–55 — notícia de 1954 e charge de 2016 descritas.',
      texto:
        'A notícia de 1954 relata ônibus superlotados. Uma charge de 2016 também mostra um ônibus com pessoas apertadas e desconfortáveis. Fontes de épocas diferentes podem revelar a permanência de um mesmo problema.',
    },
    15: {
      fonte: 'Caderno de História, páginas 52–55 — convivência no transporte coletivo.',
      texto:
        'Muitas pessoas compartilham o transporte coletivo. Respeitar a fila, falar sem incomodar, cuidar da limpeza e deixar espaço para os demais torna a viagem mais segura e agradável.',
    },
    16: {
      fonte: 'Material complementar — transporte e cuidado ambiental.',
      texto:
        'Carros e motos movidos a gasolina soltam gases pelo escapamento durante o uso. A bicicleta é movida pelas pedaladas e não possui escapamento.',
    },
    17: {
      fonte: 'Caderno de História, página 56 — início do capítulo 8.',
      texto:
        'Em 1886, foi criado na Alemanha o primeiro automóvel movido a gasolina. Esse automóvel antigo tinha três rodas.',
    },
    18: {
      fonte: 'Caderno de História, página 56 — fotografias e legendas descritas.',
      texto:
        'Duas fotografias permitem comparar mudanças nos automóveis: o veículo de 1886 tinha três rodas; o automóvel de 1908 já tinha quatro rodas.',
    },
    19: {
      fonte: 'Caderno de História, página 57 — explicação adaptada.',
      texto:
        'Os primeiros automóveis começaram a circular nas cidades brasileiras há cerca de 120 anos. Como custavam muito caro, poucas pessoas podiam comprá-los.',
    },
    20: {
      fonte: 'Caderno de História, página 57 — texto e fotografia descritos.',
      texto:
        'Atualmente há muitos automóveis nas grandes cidades. Quando veículos demais ocupam as ruas ao mesmo tempo, o trânsito fica lento ou parado. Esse problema é chamado de congestionamento.',
    },
    21: {
      fonte: 'Ampliação pedagógica relacionada à página 57.',
      texto:
        'Algumas escolhas podem diminuir a quantidade de carros nas ruas: usar transporte coletivo quando adequado, caminhar ou pedalar em trajetos seguros e compartilhar viagens de carro. Crianças sempre precisam da orientação de um adulto.',
    },
    22: {
      fonte: 'Caderno de História, páginas 50, 54, 56–57 e 60 — síntese cronológica.',
      texto:
        'Primeiro, carroças, charretes e bondes faziam parte das cidades. Depois surgiram os automóveis a gasolina. Mais tarde, os ônibus se tornaram comuns nas grandes cidades. Hoje, carros e ônibus dividem ruas muitas vezes congestionadas.',
    },
    23: {
      fonte: 'Caderno de História, página 58 — fonte histórica material.',
      texto:
        'Há mais de 500 anos, povos indígenas utilizavam no Brasil uma canoa chamada piroga. Ela era feita cavando e esculpindo um único tronco de árvore e servia para navegar entre locais próximos.',
    },
    24: {
      fonte: 'Caderno de História, página 58 — apoio para ditado sem revelar a palavra.',
      texto:
        'O caderno apresenta uma canoa indígena feita de um único tronco. Agora você vai ouvir e escrever o nome desse tipo de canoa. Use o botão de áudio quando estiver pronta.',
    },
    25: {
      fonte: 'Caderno de História, página 58 — modo de construção da canoa.',
      texto:
        'Povos indígenas construíam a piroga cavando e esculpindo um único tronco de árvore. A forma criada no tronco permitia que a canoa navegasse.',
    },
    26: {
      fonte: 'Caderno de História, página 58 — fotografia e legenda descritas.',
      texto:
        'Uma canoa indígena feita de araucária há cerca de 400 anos foi encontrada por um pescador em Minas Gerais. Como objeto antigo preservado, ela é uma fonte histórica material: ajuda a conhecer a vida das pessoas do passado.',
    },
    27: {
      fonte: 'Caderno de História, página 59 — fotografias e legendas descritas.',
      texto:
        'Em muitas localidades brasileiras, barcos transportam passageiros. O caderno mostra exemplos em Breves (Pará), Juazeiro (Bahia) e Ubatuba (São Paulo), onde a água faz parte dos caminhos das pessoas.',
    },
    28: {
      fonte: 'Material complementar — convivência em casa, na escola e na comunidade.',
      texto:
        'A casa é um dos primeiros espaços de convivência. Na escola e na comunidade, podemos aprender, trocar informações, fazer amizades e ajudar outras pessoas. Respeitar as diferenças e tratar todos com educação melhora a convivência.',
    },
    29: {
      fonte: 'Material complementar — fontes históricas, memória e patrimônio.',
      texto:
        'Mapas, fotografias antigas, depoimentos, objetos preservados e prédios históricos guardam informações sobre o passado. Essas fontes ajudam a comparar mudanças e permanências e a proteger a memória de uma comunidade.',
    },
    30: {
      fonte: 'Síntese final — preparação para o ditado.',
      texto:
        'Você estudou convivência nos transportes, maria-fumaça e respeito às diferenças. Agora ouça cada frase do ditado. O texto exato não aparece na tela: escute, escreva e use Repetir quando precisar.',
    },
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }
  function campo(pergunta, resposta, frase) {
    return {
      pergunta: pergunta,
      respostas: [resposta],
      fraseCompleta: Boolean(frase),
      pontuacaoFlexivel: Boolean(frase),
    };
  }
  function q(numero, titulo, instrucao, itens, dica, sucesso, extras) {
    return Object.assign(
      {
        id: 'transportes-q' + String(numero).padStart(2, '0'),
        bloco: 'História · Trens, bondes, ônibus, automóveis e barcos',
        titulo: numero + '. ' + titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: sucesso,
        leitura: apoios[numero].texto,
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: apoios[numero].fonte,
        opcoesReversiveis: true,
        icone:
          '../assets/objetos_escolares/' +
          (numero <= 7
            ? 'history-train'
            : numero <= 10
              ? 'history-tram'
              : numero <= 15
                ? 'bus'
                : numero <= 22
                  ? 'car'
                  : numero <= 27
                    ? 'history-canoe'
                    : 'map') +
          '.svg',
      },
      extras || {}
    );
  }
  function unica(n, titulo, pergunta, opcoes, resposta, dica, sucesso) {
    return q(
      n,
      titulo,
      'Escolha uma resposta. Você pode trocar ou clicar novamente para desmarcar.',
      [opcao(pergunta, opcoes, resposta)],
      dica,
      sucesso
    );
  }
  function selecao(n, titulo, pergunta, corretas, outras, dica, sucesso) {
    // Intercala distratores em posições fixas, estáveis na recarga.
    var opcoes = corretas.slice();
    outras.forEach(function (outra, i) {
      opcoes.splice(1 + i * 3, 0, outra);
    });
    return q(
      n,
      titulo,
      pergunta,
      [{ pergunta: 'Marque todos os itens corretos.', opcoes: opcoes, respostas: corretas }],
      dica,
      sucesso,
      { tipo: 'selecao' }
    );
  }
  var classes = ['P — primeira classe', 'S — segunda classe'];
  var lugares = ['Santos (SP)', 'Santa Teresa, Rio de Janeiro (RJ)'];
  var categorias = ['Terrestre', 'Aquático', 'Aéreo'];
  var sequencia = [
    'Pessoas usando carroça, charrete e bonde',
    'Primeiros automóveis a gasolina',
    'Ônibus se tornando comuns nas grandes cidades',
    'Trânsito atual com muitos carros e ônibus',
  ];
  var questoes = [
    selecao(
      1,
      'Uma viagem ao passado',
      'Segundo o caderno, há cerca de 150 anos, quais destes meios já eram usados para se locomover no Brasil?',
      ['A pé', 'A cavalo', 'Charrete', 'Carroça', 'Barco', 'Bonde', 'Trem'],
      ['Metrô moderno', 'Automóvel elétrico atual'],
      'Pense nos meios antigos estudados no começo do capítulo.',
      'Essas sete formas de locomoção fazem parte do passado estudado.'
    ),
    unica(
      2,
      'Maria-Fumaça',
      'Maria-Fumaça é o nome usado no conteúdo para qual meio de transporte?',
      ['Bicicleta', 'Trem', 'Barco', 'Ônibus'],
      'Trem',
      'Ela anda sobre trilhos.',
      'A maria-fumaça é um trem!'
    ),
    unica(
      3,
      'Por que esse nome?',
      'Por que os primeiros trens ficaram conhecidos como maria-fumaça?',
      [
        'Porque soltavam fumaça durante o funcionamento.',
        'Porque viajavam somente à noite.',
        'Porque eram pintados de branco.',
        'Porque andavam dentro da água.',
      ],
      'Porque soltavam fumaça durante o funcionamento.',
      'Pense no que acontecia quando o combustível era queimado.',
      'A queima do combustível produzia a fumaça que deu origem ao nome.'
    ),
    q(
      4,
      'Na terra, na água ou no ar?',
      'Classifique cada meio de transporte. Escolha uma categoria em cada linha.',
      ['Trem', 'Ônibus', 'Bicicleta', 'Metrô', 'Barco', 'Lancha', 'Avião', 'Helicóptero'].map(
        function (nome, i) {
          return opcao(nome, categorias, categorias[i < 4 ? 0 : i < 6 ? 1 : 2]);
        }
      ),
      'Observe por onde cada transporte se desloca: terra, água ou ar.',
      'Você classificou os oito meios de transporte!'
    ),
    unica(
      5,
      'Primeira classe',
      'Como eram os vagões de primeira classe dos trens?',
      [
        'Mais confortáveis e com passagens mais caras.',
        'Cheios de animais e mercadorias.',
        'Sem bancos e sem janelas.',
        'Usados somente para cargas.',
      ],
      'Mais confortáveis e com passagens mais caras.',
      'Compare o conforto dos vagões e o preço das passagens.',
      'A primeira classe oferecia mais conforto e custava mais.'
    ),
    selecao(
      6,
      'Segunda classe',
      'Nos vagões de segunda classe, o que podia aparecer junto durante a viagem?',
      ['Pessoas', 'Mercadorias e volumes', 'Animais'],
      ['Somente passageiros em poltronas luxuosas'],
      'Lembre do relato sobre os vagões cheios.',
      'Pessoas, mercadorias e animais podiam viajar nesses vagões.'
    ),
    q(
      7,
      'P ou S?',
      'Marque P para primeira classe e S para segunda classe.',
      [
        'Passagens mais caras',
        'Pouco conforto',
        'Vagões confortáveis',
        'Passagens mais baratas',
        'Pessoas, mercadorias e animais no mesmo tipo de vagão',
      ].map(function (texto, i) {
        return opcao(texto, classes, classes[i === 0 || i === 2 ? 0 : 1]);
      }),
      'Pense nas diferenças de preço, conforto e lotação entre as classes.',
      'Você comparou corretamente as duas classes dos trens.'
    ),
    unica(
      8,
      'Boa convivência no bonde',
      'Qual atitude combina com uma boa regra de convivência no transporte coletivo?',
      [
        'Abrir o jornal de modo a incomodar quem está ao lado.',
        'Respeitar o espaço dos outros passageiros.',
        'Jogar objetos sobre o passageiro da frente.',
        'Empurrar as pessoas para entrar primeiro.',
      ],
      'Respeitar o espaço dos outros passageiros.',
      'Pense em como viajar sem incomodar quem está perto.',
      'Respeitar o espaço das pessoas melhora a viagem de todos.'
    ),
    unica(
      9,
      'Os bondes chegaram',
      'Segundo o conteúdo estudado, os bondes começaram a circular nas cidades brasileiras há aproximadamente:',
      ['10 anos', '30 anos', '150 anos', '500 anos'],
      '150 anos',
      'Lembre do período dos meios de transporte antigos do capítulo.',
      'O caderno situa esse começo há cerca de 150 anos.'
    ),
    q(
      10,
      'Santos e Rio de Janeiro',
      'Segundo os exemplos do caderno, associe cada característica ao bonde correspondente.',
      [
        'Transporta turistas',
        'Funciona aos fins de semana',
        'Transporta moradores',
        'Funciona diariamente',
      ].map(function (texto, i) {
        return opcao(texto, lugares, lugares[i < 2 ? 0 : 1]);
      }),
      'Um exemplo mostra passeios turísticos; o outro, viagens do dia a dia.',
      'No caderno, Santos recebe turistas aos fins de semana; Santa Teresa transporta moradores diariamente.'
    ),
    q(
      11,
      'O começo dos ônibus a gasolina',
      'Digite somente o ano em que os primeiros ônibus a gasolina começaram a circular no Brasil.',
      [campo('Ano dos primeiros ônibus a gasolina no Brasil', '1908')],
      'O ano aparece no começo da página sobre ônibus. Lembre do início do século passado.',
      'Em 1908, os primeiros ônibus a gasolina começaram a circular no Brasil.'
    ),
    unica(
      12,
      'Ônibus nas grandes cidades',
      'A partir de qual década os ônibus se tornaram um dos principais transportes de passageiros nas maiores cidades brasileiras?',
      ['1880', '1900', '1940', '2000'],
      '1940',
      'Procure a década do século passado em que os ônibus ganharam mais espaço.',
      'A partir da década de 1940, os ônibus ganharam destaque nas maiores cidades.'
    ),
    selecao(
      13,
      'Passageiros em 1954',
      'Quais problemas apareciam na notícia de 1954?',
      ['Passageiros esperavam muito tempo', 'Ônibus vinham superlotados'],
      ['Todos os ônibus chegavam vazios', 'Ninguém precisava esperar'],
      'Lembre da espera no ponto e da quantidade de passageiros dentro dos ônibus.',
      'A notícia relatava longa espera e ônibus superlotados.'
    ),
    unica(
      14,
      '1954 e 2016',
      'A notícia de 1954 e a charge de 2016 mostram um problema em épocas diferentes. Qual?',
      ['Falta de aviões', 'Superlotação dos ônibus', 'Falta de barcos', 'Ausência de bicicletas'],
      'Superlotação dos ônibus',
      'Compare a quantidade de passageiros nos dois registros.',
      'A superlotação aparece nas duas épocas. Isso é uma permanência ao longo do tempo.'
    ),
    unica(
      15,
      'Viajar com respeito',
      'Qual é uma boa atitude no ônibus?',
      [
        'Gritar perto dos outros passageiros.',
        'Empurrar para entrar.',
        'Respeitar a fila e o espaço das outras pessoas.',
        'Deixar lixo no banco.',
      ],
      'Respeitar a fila e o espaço das outras pessoas.',
      'Escolha a atitude que cuida da convivência.',
      'Respeitar a fila e o espaço das pessoas ajuda todos a viajar melhor.'
    ),
    unica(
      16,
      'Sem fumaça do escapamento',
      'Entre estes meios, qual não solta fumaça do escapamento durante o uso?',
      ['Bicicleta', 'Carro a gasolina', 'Moto a gasolina'],
      'Bicicleta',
      'Pense no transporte movido pelas pedaladas.',
      'A bicicleta não solta fumaça de escapamento durante o uso.'
    ),
    q(
      17,
      'Primeiro automóvel a gasolina',
      'Em que ano foi criado na Alemanha o primeiro automóvel movido a gasolina?',
      [campo('Ano do primeiro automóvel a gasolina', '1886')],
      'Pense no ano do automóvel de três rodas. Ele foi criado antes de 1900.',
      'Segundo o caderno, esse automóvel foi criado na Alemanha em 1886.'
    ),
    q(
      18,
      'Três ou quatro rodas?',
      'Associe os automóveis apresentados no caderno à quantidade de rodas.',
      [
        opcao('Automóvel de 1886', ['Três rodas', 'Quatro rodas'], 'Três rodas'),
        opcao('Automóvel de 1908', ['Três rodas', 'Quatro rodas'], 'Quatro rodas'),
      ],
      'O modelo mais antigo tinha uma roda a menos.',
      'O automóvel de 1886 tinha três rodas; o de 1908, quatro.'
    ),
    unica(
      19,
      'Automóveis no Brasil',
      'Quando os primeiros automóveis começaram a circular nas cidades brasileiras, quantas pessoas podiam comprá-los?',
      [
        'Poucas pessoas podiam comprar.',
        'Todas as crianças tinham um.',
        'Todas as famílias tinham vários.',
        'Ninguém conhecia estradas.',
      ],
      'Poucas pessoas podiam comprar.',
      'Os automóveis ainda não eram comuns entre as famílias.',
      'No começo, poucas pessoas podiam comprar automóveis.'
    ),
    unica(
      20,
      'Muitos carros nas ruas',
      'Quando há carros demais ocupando as ruas ao mesmo tempo, pode acontecer:',
      ['Congestionamento', 'Nevasca', 'Maré alta', 'Eclipse'],
      'Congestionamento',
      'Pense no trânsito lento ou parado.',
      'Muitos veículos na mesma via podem causar congestionamento.'
    ),
    selecao(
      21,
      'Como melhorar o trânsito?',
      'Quais atitudes podem ajudar a diminuir a quantidade de carros nas ruas?',
      [
        'Usar transporte coletivo quando for adequado',
        'Caminhar em trajetos possíveis e seguros',
        'Usar bicicleta quando houver condições seguras',
        'Compartilhar uma viagem de carro quando fizer sentido',
      ],
      ['Cada pessoa usar vários carros ao mesmo tempo', 'Bloquear a rua sem necessidade'],
      'Escolha formas seguras de fazer viagens com menos carros.',
      'Essas escolhas podem ajudar a reduzir os congestionamentos. Crianças devem contar com a orientação de um adulto.'
    ),
    q(
      22,
      'Do passado ao presente',
      'Ordene as cenas do mais antigo para o mais recente, seguindo a história estudada. Não é preciso lembrar datas.',
      sequencia.map(function (texto, i) {
        return campo('Posição ' + (i + 1), texto);
      }),
      'Comece pela cena anterior aos automóveis. Termine com o trânsito atual.',
      'Você ordenou as cenas do passado ao presente. Alguns transportes antigos continuam existindo!',
      { tipo: 'ordenacao', cartoes: [sequencia[2], sequencia[0], sequencia[3], sequencia[1]] }
    ),
    unica(
      23,
      'O que é uma piroga?',
      'A piroga estudada no caderno é:',
      [
        'Uma canoa feita a partir de um tronco de árvore.',
        'Um tipo de helicóptero.',
        'Um ônibus de dois andares.',
        'Uma bicicleta antiga.',
      ],
      'Uma canoa feita a partir de um tronco de árvore.',
      'Pense na embarcação usada por povos indígenas.',
      'A piroga é uma canoa feita de um tronco de árvore.'
    ),
    q(
      24,
      'O nome da canoa indígena',
      'Escreva o nome da canoa indígena estudada. Se quiser, ouça a palavra.',
      [campo('Nome da canoa', 'piroga')],
      'Você pode ouvir novamente e corrigir as letras com calma.',
      'Você escreveu o nome da canoa estudada!',
      { ditado: true, unidadeDitado: 'palavra', cancelarAoTrocarCampo: true }
    ),
    unica(
      25,
      'Como a canoa era feita?',
      'A piroga antiga era feita principalmente:',
      [
        'Escavando ou esculpindo um único tronco de árvore.',
        'Colando folhas de papel.',
        'Usando peças de plástico.',
        'Com asas de metal.',
      ],
      'Escavando ou esculpindo um único tronco de árvore.',
      'Lembre do material retirado da natureza e do trabalho de esculpir.',
      'Um único tronco era escavado para formar a canoa.'
    ),
    unica(
      26,
      'Preservar para conhecer',
      'Por que é importante preservar uma canoa antiga encontrada por pesquisadores ou moradores?',
      [
        'Porque ela ajuda a conhecer a vida e a história do passado.',
        'Porque todo objeto antigo deve ser jogado fora.',
        'Porque ela serve apenas como brinquedo.',
        'Porque ela não conta nada sobre as pessoas.',
      ],
      'Porque ela ajuda a conhecer a vida e a história do passado.',
      'Pense no que um objeto antigo pode ensinar sobre as pessoas.',
      'A canoa é uma fonte histórica material: ela ajuda a conhecer o passado.'
    ),
    selecao(
      27,
      'Barcos no Brasil atual',
      'Em quais situações o barco pode ser importante para as pessoas?',
      [
        'Transportar passageiros',
        'Ajudar no deslocamento em localidades com rios ou litoral',
        'Ligar lugares onde a água faz parte do caminho',
      ],
      ['Viajar sobre trilhos de trem'],
      'Pense nos caminhos pela água.',
      'O caderno mostra passageiros em barcos em Breves (Pará), Juazeiro (Bahia) e Ubatuba (São Paulo).'
    ),
    q(
      28,
      'Casa, escola e comunidade',
      'Escolha Verdadeiro ou Falso em cada frase.',
      [
        'A casa é um dos primeiros espaços de convivência da criança.',
        'Na escola podemos trocar informações.',
        'Maltratar colegas faz parte de uma boa convivência.',
        'Respeitar as diferenças ajuda na convivência.',
        'Fazer amizades pode acontecer na escola e na comunidade.',
        'Faltar com a educação é uma atitude de respeito.',
      ].map(function (texto, i) {
        return opcao(texto, ['Verdadeiro', 'Falso'], i === 2 || i === 5 ? 'Falso' : 'Verdadeiro');
      }),
      'Pense em atitudes de cuidado, respeito e amizade.',
      'Em casa, na escola e na comunidade, respeitar as diferenças melhora a convivência.'
    ),
    selecao(
      29,
      'Fontes históricas e memória',
      'Quais itens podem ajudar a estudar a história de um lugar?',
      [
        'Mapas',
        'Fotografias antigas',
        'Depoimentos de pessoas mais velhas',
        'Objetos antigos, como uma canoa preservada',
        'Prédios antigos e igrejas históricas preservados como patrimônio',
      ],
      ['Apagar todas as lembranças', 'Destruir objetos antigos para ninguém estudá-los'],
      'Pense no que pode guardar informações sobre o passado.',
      'Mapas, fotografias, depoimentos, objetos e patrimônios ajudam a estudar a história e a memória dos lugares.'
    ),
    q(
      30,
      'Ditado final de História',
      'Ouça cada frase e escreva o que ouviu. Você pode repetir, parar e corrigir com calma.',
      [
        campo('30A — Frase 1', 'No ônibus, devemos respeitar os outros.', true),
        campo('30B — Frase 2', 'A maria-fumaça é um trem.', true),
        campo('30C — Frase 3', 'As pessoas são diferentes e merecem respeito.', true),
      ],
      'Confira as palavras de cada frase. Use Repetir para ouvir de novo.',
      'Você escreveu três frases sobre transportes e respeito!',
      { ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true }
    ),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'mariana-historia-convivencia-transportes-agosto-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'História',
    titulo: 'Convivência nos transportes: ontem e hoje',
    subtitulo: 'Trens, bondes, ônibus, automóveis e barcos',
    chave: 'revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você revisou transportes do passado e do presente, fontes históricas e atitudes de respeito. Cada questão vale um ponto: são 30 ao todo!',
    questoes: questoes,
  });
})();
