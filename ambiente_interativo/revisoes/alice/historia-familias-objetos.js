(function () {
  'use strict';

  var apoios = {
    1: {
      fonte: 'Caderno de História, página 66 — texto adaptado.',
      texto:
        'Famílias de muitos jeitos\n\nAs famílias podem ser diferentes. Algumas têm uma criança, outras têm várias. Algumas pessoas vivem com mãe e pai; outras vivem com um responsável, com avós ou com outros familiares. O mais importante é haver cuidado, respeito e carinho entre as pessoas.',
    },
    2: {
      fonte: 'Caderno de História, páginas 66–67 — síntese adaptada.',
      texto:
        'Uma família pode reunir pessoas de muitos jeitos. Crianças podem viver com um responsável, com avós, com mãe, com pai ou com outros familiares. Laços de afeto, cuidado e convivência ajudam a formar uma família.',
    },
    3: {
      fonte: 'Material complementar — graus de parentesco em uma família fictícia.',
      texto:
        'Ana é mãe de Bia e Leo. Carlos é pai de Bia e Leo. Rosa é mãe de Ana. José é pai de Ana. Marta é irmã de Carlos. Nina é filha de Marta. Responda sempre do ponto de vista de Bia.',
    },
    4: {
      fonte: 'Caderno de História, página 68 — história original inspirada no tema.',
      texto:
        'Domingo na família de Luna\n\nDe manhã, Luna e sua família arrumaram a mesa e prepararam frutas e suco. Depois, os avós chegaram para visitá-los. Todos conversaram e, mais tarde, foram passear juntos no parque.',
    },
    5: {
      fonte: 'Caderno de História, página 69 — relato apresentado em resumo respeitoso.',
      texto:
        'No caderno, conhecemos uma família com cinco filhos que passou por um período muito difícil. Faltou dinheiro para pagar aluguel e outras contas. Os adultos continuaram trabalhando e juntando dinheiro até conseguirem uma moradia para a família.',
    },
    6: {
      fonte:
        'Caderno de História, páginas 70–71 — comparação representada por ilustração original.',
      texto:
        'O caderno compara um exemplo de família de cerca de 1930, com várias crianças, e um exemplo atual, com menos crianças. Essa comparação mostra uma mudança ao longo do tempo, sem dizer que todas as famílias são iguais.',
      ilustracao: '../assets/objetos_escolares/history-families-old-new.svg',
      descricao:
        'Dois quadros fictícios: o exemplo A, de 1930, tem seis símbolos de crianças; o exemplo B, atual, tem dois.',
    },
    7: {
      fonte: 'Caderno de História, página 71 — fotografias estudadas como fontes.',
      texto:
        'Fotografias registram pessoas, lugares e momentos. Uma fotografia antiga pode ajudar a conhecer famílias de outro tempo. Ao comparar imagens antigas e atuais, percebemos mudanças e coisas que permaneceram.',
    },
    8: {
      fonte: 'Caderno de História, páginas 72–73 — entrevista apresentada em resumo.',
      texto:
        'No caderno, Aidê contou em uma entrevista que nasceu em 1961 e que teve 14 irmãos. Ao ouvir pessoas contando suas lembranças, podemos aprender sobre a vida em outros tempos.',
    },
    9: {
      fonte: 'Caderno de História, páginas 74 e 77 — comparação geral do material.',
      texto:
        'Atualmente, de modo geral, as famílias têm menos filhos, e muitas mulheres dedicam mais tempo ao trabalho e ao estudo. Há cerca de cem anos, de modo geral, as famílias tinham mais filhos e muitas mulheres dedicavam mais tempo aos cuidados da casa e dos filhos.',
    },
    10: {
      fonte: 'Caderno de História, página 74 — explicação histórica do material.',
      texto:
        'Segundo o caderno, muitas mulheres passaram a dedicar mais tempo ao estudo e ao trabalho. Muitas também passaram a escolher ter menos filhos. Isso ajuda a explicar uma mudança na quantidade de crianças por família.',
    },
    11: {
      fonte: 'Caderno de História, páginas 74 e 77 — mudanças apresentadas em síntese.',
      texto:
        'Ao longo do tempo, muitas mulheres passaram a estudar por mais tempo e a ocupar novos espaços, inclusive no mercado de trabalho. De modo geral, a quantidade de crianças por família diminuiu. Afeto e cuidado continuam importantes.',
    },
    12: {
      fonte: 'Caderno de História, página 75 — direitos da criança em linguagem adaptada.',
      texto:
        'Toda criança tem direitos. A Declaração dos Direitos da Criança destaca amor, compreensão, proteção e cuidados especiais para que as crianças cresçam com segurança e respeito.',
    },
    13: {
      fonte: 'Caderno de História, página 75 — responsabilidades de proteção.',
      texto:
        'A proteção das crianças é uma responsabilidade compartilhada. Familiares ou responsáveis cuidam no dia a dia. A sociedade e as autoridades públicas também devem ajudar a garantir os direitos das crianças.',
    },
    14: {
      fonte: 'Caderno de História, página 75 — preparação para o ditado.',
      texto:
        'Cuidado e proteção fazem parte de uma boa convivência familiar. Agora ouça a frase e escreva o que ouviu. O texto exato não aparece na tela.',
    },
    15: {
      fonte: 'Caderno de História, páginas 78–79 — história original sobre lembranças.',
      texto:
        'A caixa de lembranças de Caio\n\nCaio encontrou uma caixa com um carrinho antigo, uma fotografia e um pequeno brinquedo guardado por sua avó. Ela contou quando aqueles objetos foram usados. Caio percebeu que objetos podem guardar lembranças e ajudar a contar histórias.',
    },
    16: {
      fonte: 'Caderno de História, páginas 80 e 88 — fases da vida.',
      texto:
        'Os objetos usados podem mudar conforme crescemos. Berço, carrinho e sapatinhos pequenos aparecem no tempo de bebê. Tênis infantil, camiseta e bermuda aparecem no exemplo do tempo de criança.',
    },
    17: {
      fonte: 'Caderno de História, páginas 82–83 — objetos e culturas indígenas.',
      texto:
        'O povo Karajá produz bonecas de barro. O povo Baniwa produz cestos de fibra de arumã. O povo Timbira produz colares de bambu e sementes. Materiais, técnicas e objetos ajudam a contar histórias e fazem parte das culturas desses povos.',
    },
    18: {
      fonte: 'Caderno de História, páginas 84 e 89 — comparação com ilustração original.',
      texto:
        'Geladeiras, televisores e guarda-roupas mudaram ao longo do tempo. Os modelos antigos e atuais podem ter formatos, tamanhos, materiais e controles diferentes. Observe a ilustração e classifique cada descrição.',
      ilustracao: '../assets/objetos_escolares/history-objects-old-new.svg',
      descricao:
        'Ilustração com duas colunas. À esquerda aparecem uma geladeira de cantos retos, um televisor de caixa com botões e um guarda-roupa antigo. À direita aparecem modelos atuais dos três objetos.',
    },
    19: {
      fonte: 'Caderno de História, páginas 87 e 90 — história original sobre uma exposição.',
      texto:
        'Um museu organizou uma exposição com uma máquina de escrever, uma máquina de costura antiga, brinquedos e fotografias de outras épocas. Os visitantes observaram esses objetos para descobrir como as pessoas viviam e trabalhavam no passado.',
    },
    20: {
      fonte: 'Síntese final — preparação para o ditado.',
      texto:
        'Você estudou famílias, direitos das crianças, objetos antigos e preservação. Agora ouça uma frase por vez, escreva e use Repetir quando precisar. As frases exatas não aparecem na tela.',
    },
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function conjunto(pergunta, opcoes, respostas) {
    return { tipo: 'selecao', pergunta: pergunta, opcoes: opcoes, respostas: respostas };
  }

  function ordem(pergunta, cartoes, respostas) {
    return {
      tipo: 'ordenacao',
      pergunta: pergunta,
      cartoes: cartoes,
      respostas: respostas,
      rotuloOrdem: 'Acontecimentos do primeiro ao último',
    };
  }

  function campo(pergunta, resposta) {
    return {
      pergunta: pergunta,
      respostas: [resposta],
      fraseCompleta: true,
      pontuacaoFlexivel: true,
    };
  }

  function q(numero, titulo, instrucao, itens, dica, sucesso, extras) {
    var apoio = apoios[numero];
    return Object.assign(
      {
        id: 'familias-objetos-q' + String(numero).padStart(2, '0'),
        bloco:
          numero <= 5
            ? 'História · Famílias e convivência'
            : numero <= 14
              ? 'História · Mudanças nas famílias e direitos'
              : 'História · Objetos, culturas e memória',
        titulo: numero + '. ' + titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: sucesso,
        leitura: apoio.texto,
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: apoio.fonte,
        ilustracaoLeitura: apoio.ilustracao,
        descricaoIlustracao: apoio.descricao,
        opcoesReversiveis: true,
        icone:
          '../assets/objetos_escolares/' +
          (numero <= 5 ? 'family' : numero <= 14 ? 'heart' : numero <= 18 ? 'clock' : 'book') +
          '.svg',
      },
      extras || {}
    );
  }

  function unica(numero, titulo, pergunta, opcoes, resposta, dica, sucesso) {
    return q(
      numero,
      titulo,
      'Escolha uma resposta. Você pode trocar ou clicar novamente para desmarcar.',
      [opcao(pergunta, opcoes, resposta)],
      dica,
      sucesso
    );
  }

  function selecao(numero, titulo, pergunta, corretas, distratores, dica, sucesso) {
    var opcoes = corretas.slice();
    distratores.forEach(function (distrator, indice) {
      opcoes.splice(1 + indice * 3, 0, distrator);
    });
    return q(
      numero,
      titulo,
      pergunta,
      [{ pergunta: 'Marque todos os itens corretos.', opcoes: opcoes, respostas: corretas }],
      dica,
      sucesso,
      { tipo: 'selecao' }
    );
  }

  var domingo = [
    'Arrumar a mesa e preparar frutas e suco',
    'Os avós chegarem',
    'Todos conversarem',
    'Passear juntos no parque',
  ];
  var momentos = ['Atualmente', 'Há cerca de cem anos'];
  var fases = ['Tempo de bebê', 'Tempo de criança'];
  var tempos = ['Antigo', 'Atual'];

  var questoes = [
    q(
      1,
      'Famílias de muitos jeitos',
      'Responda às três partes usando o texto.',
      [
        opcao('1A — Todas as famílias têm a mesma quantidade de crianças?', ['Sim', 'Não'], 'Não'),
        opcao(
          '1B — Qual frase combina com o texto?',
          [
            'Todas as famílias precisam ser iguais.',
            'As famílias podem ser diferentes umas das outras.',
            'Toda família precisa ter muitos filhos.',
          ],
          'As famílias podem ser diferentes umas das outras.'
        ),
        conjunto(
          '1C — O que é importante na convivência familiar?',
          ['Cuidado', 'Desrespeito', 'Respeito', 'Carinho'],
          ['Cuidado', 'Respeito', 'Carinho']
        ),
      ],
      'Releia o que o texto diz sobre diferenças e convivência.',
      'Você reconheceu que cada família tem seu jeito e merece respeito!',
      { tipo: 'misto' }
    ),
    selecao(
      2,
      'Qual pode ser uma família?',
      'Marque as situações que podem representar uma família.',
      [
        'Criança vivendo com um responsável que cuida dela',
        'Avós e netos cuidando uns dos outros',
        'Mãe e filhos',
        'Pai e filhos',
        'Familiares que convivem e se cuidam',
      ],
      ['Só existe família quando há obrigatoriamente pai, mãe e dois filhos'],
      'Famílias podem ter composições diferentes e manter laços de cuidado.',
      'Todas essas situações podem representar famílias.'
    ),
    q(
      3,
      'Parentesco na família de Bia',
      'Associe cada pessoa ao parentesco que ela tem com Bia.',
      [
        opcao('Ana', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Mãe'),
        opcao('Carlos', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Pai'),
        opcao('Leo', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Irmão'),
        opcao('Rosa', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Avó'),
        opcao('José', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Avô'),
        opcao('Marta', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Tia'),
        opcao('Nina', ['Mãe', 'Pai', 'Irmão', 'Avó', 'Avô', 'Tia', 'Prima'], 'Prima'),
      ],
      'Siga uma relação de cada vez e responda do ponto de vista de Bia.',
      'Você identificou os sete graus de parentesco!'
    ),
    q(
      4,
      'Uma rotina de domingo',
      'Ordene os acontecimentos e depois responda à parte 4B.',
      [
        ordem(
          '4A — Coloque os acontecimentos do primeiro ao último.',
          [domingo[2], domingo[0], domingo[3], domingo[1]],
          domingo
        ),
        opcao(
          '4B — A história mostra que as famílias podem ter:',
          [
            'Apenas uma rotina igual todos os dias.',
            'Rotinas e momentos de convivência diferentes.',
            'Nenhuma atividade juntas.',
          ],
          'Rotinas e momentos de convivência diferentes.'
        ),
      ],
      'Use as palavras “de manhã”, “depois” e “mais tarde”.',
      'Você organizou o domingo de Luna e reconheceu um momento de convivência!',
      { tipo: 'misto' }
    ),
    q(
      5,
      'Uma família enfrentou dificuldades',
      'Responda às três partes usando o resumo.',
      [
        opcao('5A — Quantos filhos havia na família?', ['2', '3', '5', '10'], '5'),
        opcao(
          '5B — Qual problema aparece?',
          [
            'Muitos brinquedos.',
            'Dificuldade para pagar aluguel e contas.',
            'Ninguém queria morar em casa.',
          ],
          'Dificuldade para pagar aluguel e contas.'
        ),
        opcao(
          '5C — O que os adultos fizeram?',
          [
            'Continuaram trabalhando e juntando dinheiro.',
            'Pararam de procurar solução.',
            'Jogaram fora seus pertences.',
          ],
          'Continuaram trabalhando e juntando dinheiro.'
        ),
      ],
      'Leia novamente a quantidade de filhos, a dificuldade e a atitude dos adultos.',
      'Você compreendeu a dificuldade e a busca respeitosa por uma solução.'
    ),
    unica(
      6,
      'Famílias do passado e de hoje',
      'No exemplo estudado, em qual família havia mais crianças?',
      ['Exemplo A — por volta de 1930', 'Exemplo B — atual'],
      'Exemplo A — por volta de 1930',
      'Conte os símbolos nos dois quadros da ilustração.',
      'No exemplo A, a família do passado tinha mais crianças.'
    ),
    q(
      7,
      'Fotografias contam histórias',
      'Escolha Verdadeiro ou Falso em cada frase.',
      [
        opcao(
          'Fotografias antigas podem ajudar a conhecer famílias de outro tempo.',
          ['Verdadeiro', 'Falso'],
          'Verdadeiro'
        ),
        opcao(
          'Uma fotografia nunca pode ser usada para estudar História.',
          ['Verdadeiro', 'Falso'],
          'Falso'
        ),
        opcao(
          'Podemos comparar fotografias antigas e atuais.',
          ['Verdadeiro', 'Falso'],
          'Verdadeiro'
        ),
        opcao(
          'Fotografias podem mostrar mudanças e permanências.',
          ['Verdadeiro', 'Falso'],
          'Verdadeiro'
        ),
      ],
      'Pense nas informações que uma fotografia pode guardar.',
      'Você reconheceu a fotografia como fonte para estudar História.'
    ),
    q(
      8,
      'Entrevista como fonte histórica oral',
      'Responda às três partes usando a entrevista resumida.',
      [
        opcao('8A — A entrevista é uma fonte:', ['Escrita', 'Visual', 'Oral'], 'Oral'),
        opcao('8B — Quantos irmãos Aidê teve?', ['4', '10', '14', '20'], '14'),
        opcao(
          '8C — Por que entrevistar pessoas mais velhas pode ajudar?',
          [
            'Porque apaga lembranças.',
            'Porque memórias podem contar como era a vida em outros tempos.',
            'Porque todas as pessoas tiveram a mesma vida.',
          ],
          'Porque memórias podem contar como era a vida em outros tempos.'
        ),
      ],
      'Uma entrevista registra a fala e as lembranças de uma pessoa.',
      'Você reconheceu a fonte oral e as informações da entrevista.'
    ),
    q(
      9,
      'Atualmente ou há cerca de cem anos?',
      'Classifique cada frase conforme o recorte do caderno.',
      [
        opcao('Menor quantidade de filhos, de modo geral', momentos, 'Atualmente'),
        opcao('Maior quantidade de filhos, de modo geral', momentos, 'Há cerca de cem anos'),
        opcao('Muitas mulheres dedicam mais tempo ao trabalho e ao estudo', momentos, 'Atualmente'),
        opcao(
          'No recorte do caderno, mulheres dedicavam mais tempo aos cuidados da casa e dos filhos',
          momentos,
          'Há cerca de cem anos'
        ),
      ],
      'Compare as duas partes do texto: atualmente e há cerca de cem anos.',
      'Você classificou as mudanças apresentadas pelo caderno.'
    ),
    unica(
      10,
      'Por que a quantidade de filhos mudou?',
      'Segundo o caderno, qual mudança ajuda a explicar por que muitas famílias passaram a ter menos filhos?',
      [
        'Famílias deixaram de existir.',
        'Crianças deixaram de estudar.',
        'Muitas mulheres passaram a dedicar mais tempo ao estudo e ao trabalho.',
        'Cuidado deixou de ser importante.',
      ],
      'Muitas mulheres passaram a dedicar mais tempo ao estudo e ao trabalho.',
      'Procure no texto a mudança na vida de muitas mulheres.',
      'Estudo, trabalho e escolhas sobre ter filhos ajudam a explicar essa mudança.'
    ),
    selecao(
      11,
      'Mudanças na rotina das famílias',
      'Marque as mudanças apresentadas no texto.',
      [
        'Mulheres passaram a ocupar novos espaços, inclusive no mercado de trabalho',
        'Muitas mulheres passaram a estudar por mais tempo',
        'A quantidade de crianças por família diminuiu de modo geral',
      ],
      [
        'Famílias deixaram de existir',
        'Crianças pararam de frequentar a escola',
        'Afeto e cuidado deixaram de ser importantes',
      ],
      'Marque somente as mudanças apresentadas pelo caderno.',
      'Você reconheceu três mudanças nas rotinas familiares.'
    ),
    selecao(
      12,
      'Toda criança tem direitos',
      'Quais direitos aparecem no texto?',
      ['Proteção', 'Amor', 'Compreensão', 'Cuidados especiais'],
      ['Abandono', 'Falta de cuidado'],
      'Direitos ajudam as crianças a crescer com segurança e respeito.',
      'Proteção, amor, compreensão e cuidados especiais são direitos das crianças.'
    ),
    selecao(
      13,
      'Quem ajuda a proteger as crianças?',
      'Quem tem responsabilidade na proteção das crianças?',
      ['Familiares ou responsáveis', 'Sociedade', 'Autoridades públicas'],
      ['Ninguém mais precisa ajudar', 'Somente outras crianças'],
      'A responsabilidade é compartilhada por pessoas e instituições.',
      'Familiares, sociedade e autoridades ajudam a proteger as crianças.'
    ),
    q(
      14,
      'Ditado: cuidado na família',
      'Ouça a frase e escreva o que ouviu. Você pode repetir, parar e corrigir.',
      [campo('14A — Frase sobre cuidado na família', 'Na família, cuidamos uns dos outros.')],
      'Use Repetir para ouvir novamente e confira todas as palavras.',
      'Você escreveu uma frase sobre cuidado na família!',
      { ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true }
    ),
    q(
      15,
      'Objetos também contam histórias',
      'Responda às duas partes usando a história de Caio.',
      [
        opcao(
          '15A — Os objetos podem ajudar a:',
          ['Esquecer o passado.', 'Conhecer lembranças e histórias da família.', 'Saber o futuro.'],
          'Conhecer lembranças e histórias da família.'
        ),
        conjunto(
          '15B — Quais podem ajudar a conhecer o passado?',
          ['Objeto antigo', 'Apagar todas as lembranças', 'Fotografia antiga'],
          ['Objeto antigo', 'Fotografia antiga']
        ),
      ],
      'Releia o que havia na caixa e o que a avó contou.',
      'Objetos e fotografias podem guardar lembranças e histórias.',
      { tipo: 'misto' }
    ),
    q(
      16,
      'Objetos de bebê e de criança',
      'Classifique cada objeto na fase indicada pelo texto.',
      [
        opcao('Berço', fases, 'Tempo de bebê'),
        opcao('Carrinho de bebê', fases, 'Tempo de bebê'),
        opcao('Sapatinhos de bebê', fases, 'Tempo de bebê'),
        opcao('Tênis infantil', fases, 'Tempo de criança'),
        opcao('Camiseta', fases, 'Tempo de criança'),
        opcao('Bermuda', fases, 'Tempo de criança'),
      ],
      'Separe os objetos usados no começo da vida dos usados no exemplo de criança.',
      'Você percebeu que os objetos mudam conforme crescemos.'
    ),
    q(
      17,
      'Objetos e povos indígenas',
      'Faça as três associações e responda à parte 17B.',
      [
        opcao(
          'Povo Karajá',
          ['Bonecas de barro', 'Cestos de fibra de arumã', 'Colar de bambu e sementes'],
          'Bonecas de barro'
        ),
        opcao(
          'Povo Baniwa',
          ['Bonecas de barro', 'Cestos de fibra de arumã', 'Colar de bambu e sementes'],
          'Cestos de fibra de arumã'
        ),
        opcao(
          'Povo Timbira',
          ['Bonecas de barro', 'Cestos de fibra de arumã', 'Colar de bambu e sementes'],
          'Colar de bambu e sementes'
        ),
        opcao(
          '17B — Por que é importante preservar esses objetos e conhecimentos?',
          [
            'Para apagar a história.',
            'Para conhecer e respeitar culturas e histórias.',
            'Porque objetos antigos não têm importância.',
          ],
          'Para conhecer e respeitar culturas e histórias.'
        ),
      ],
      'Cada povo está ligado a um objeto no texto. Preservar ajuda a conhecer e respeitar.',
      'Você associou os objetos e valorizou a preservação das culturas indígenas.'
    ),
    q(
      18,
      'Antigo ou atual?',
      'Observe a ilustração e classifique cada descrição.',
      [
        opcao(
          'Geladeira de cantos retos e puxador simples, na coluna da esquerda',
          tempos,
          'Antigo'
        ),
        opcao('Geladeira alta com painel, na coluna da direita', tempos, 'Atual'),
        opcao('Televisor em forma de caixa, com botões ao lado', tempos, 'Antigo'),
        opcao('Televisor fino com tela larga', tempos, 'Atual'),
        opcao('Guarda-roupa de madeira do modelo da esquerda', tempos, 'Antigo'),
        opcao('Guarda-roupa do modelo da direita', tempos, 'Atual'),
      ],
      'A própria ilustração está dividida em objetos antigos e atuais.',
      'Você classificou os três pares de objetos.'
    ),
    q(
      19,
      'Museu e exposição do passado',
      'Responda às três partes usando o texto da exposição.',
      [
        opcao(
          '19A — Qual era a principal função da exposição?',
          ['Vender objetos.', 'Conhecer o cotidiano das pessoas no passado.', 'Esconder objetos.'],
          'Conhecer o cotidiano das pessoas no passado.'
        ),
        conjunto(
          '19B — Quais fontes aparecem no texto?',
          [
            'Máquina de escrever',
            'Máquina de costura antiga',
            'Brinquedos antigos',
            'Fotografias antigas',
          ],
          [
            'Máquina de escrever',
            'Máquina de costura antiga',
            'Brinquedos antigos',
            'Fotografias antigas',
          ]
        ),
        opcao(
          '19C — Por que museus preservam objetos antigos?',
          [
            'Porque ajudam a conhecer outros tempos.',
            'Porque não contam nada.',
            'Só para ocupar espaço.',
          ],
          'Porque ajudam a conhecer outros tempos.'
        ),
      ],
      'O museu conserva fontes para que as pessoas conheçam outros tempos.',
      'Você compreendeu como uma exposição ajuda a estudar o passado.',
      { tipo: 'misto' }
    ),
    q(
      20,
      'Ditado final de História',
      'Ouça uma frase por vez e escreva. Você pode repetir, parar e corrigir.',
      [
        campo('20A — Frase 1', 'Cada família tem seu jeito de ser.'),
        campo('20B — Frase 2', 'Toda criança tem direito à proteção.'),
        campo('20C — Frase 3', 'Objetos antigos ajudam a conhecer o passado.'),
      ],
      'Confira as palavras de cada frase e use Repetir quando precisar.',
      'Você escreveu três frases sobre famílias, direitos e objetos antigos!',
      { ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true }
    ),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'alice-historia-familias-objetos-agosto-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'História',
    titulo: 'Famílias e objetos: ontem e hoje',
    subtitulo: 'Jeitos de viver, mudanças nas famílias e objetos da nossa história',
    chave: 'revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você revisou famílias, direitos das crianças, fontes históricas, objetos e preservação. Cada questão vale um ponto: são 20 ao todo!',
    questoes: questoes,
  });
})();
