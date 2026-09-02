(function () {
  'use strict';

  // Fonte pedagógica: síntese fornecida das páginas 58–69 e materiais complementares.
  // As explicações são originais e suficientes para a criança estudar na própria tela.
  var apoios = {
    1: {
      fonte: 'Caderno de Geografia, página 58 — conteúdo adaptado.',
      texto:
        'Crianças podem ir à escola a pé, de ônibus, carro, barco ou bicicleta. O caminho e o lugar onde vivem ajudam a escolher um meio de transporte.',
    },
    2: {
      fonte: 'Caderno de Geografia, página 58 — conteúdo adaptado.',
      texto:
        'A bicicleta pode servir para brincar e também para ir de um lugar a outro em trajetos adequados. Ela se movimenta com as pedaladas.',
    },
    3: {
      fonte: 'Caderno de Geografia, página 59 — conteúdo adaptado.',
      texto:
        'Em regiões próximas de rios, algumas crianças usam barcos, botes ou lanchas para chegar à escola. A água faz parte do caminho delas.',
    },
    4: {
      fonte: 'Caderno de Geografia, páginas 58–59 — conteúdo adaptado.',
      texto:
        'O lugar onde uma pessoa vive influencia o transporte. Para atravessar um rio, uma embarcação pode ajudar. Em um trajeto urbano seguro com ciclovia, uma bicicleta pode ser usada.',
    },
    5: {
      fonte: 'Material complementar — classificação ampla dos transportes.',
      texto:
        'Transportes terrestres passam pela terra. Transportes aquáticos navegam pela água. Transportes aéreos se deslocam pelo ar.',
    },
    6: {
      fonte: 'Material complementar — caminhos dos transportes.',
      texto:
        'Hidroviário acontece em rios, lagos e outros caminhos de água, usando embarcações. Dutoviário leva materiais por dentro de tubos ou canos, como água, petróleo ou gás. Dutos não transportam pessoas.',
    },
    7: {
      fonte: 'Material complementar — caminhos dos transportes.',
      texto:
        'Rodoviário usa ruas e rodovias. Ferroviário usa trilhos. Aéreo acontece no ar. Hidroviário usa rios e lagos. Marítimo usa mar ou oceano. Dutoviário leva materiais por tubos ou canos.',
    },
    8: {
      fonte: 'Material complementar — nomes de transportes.',
      texto:
        'Moto, barco e avião são nomes de meios de transporte. Observe a palavra inteira e escolha a que completa cada nome.',
    },
    9: {
      fonte: 'Material complementar — caminhos dos transportes.',
      texto:
        'Carros podem circular em rodovias. Barcos e navios navegam na água. Petróleo e gás podem seguir por tubulações. Aviões usam o ar.',
    },
    10: {
      fonte: 'Caderno de Geografia, página 60 — conteúdo adaptado.',
      texto:
        'Alguns veículos com motor e combustível podem soltar gases pelo escapamento. A bicicleta é movida por pedaladas e não tem escapamento.',
    },
    11: {
      fonte: 'Caderno de Geografia, página 62 — conteúdo adaptado.',
      texto:
        'Cada transporte pede cuidados: no carro, use cinto; no ônibus, use o ponto de parada; no barco, use colete salva-vidas; na bicicleta, use capacete e proteções.',
    },
    12: {
      fonte: 'Caderno de Geografia, página 63 — conteúdo adaptado.',
      texto:
        'Para atravessar com segurança, a criança pode estar com um adulto, usar a faixa, olhar para os dois lados e esperar uma condição segura no semáforo.',
    },
    13: {
      fonte: 'Caderno de Geografia, página 63 — conteúdo adaptado.',
      texto:
        'Dentro do carro ou transporte escolar, o cinto ajuda a proteger. Mãos e braços devem ficar dentro do veículo durante o trajeto.',
    },
    14: {
      fonte: 'Caderno de Geografia, página 61 — dados fictícios criados para esta revisão.',
      texto:
        'Turma fictícia: a pé: 2; ônibus escolar: 5; carro: 3; bicicleta: 1. Esses dados ajudam a comparar as formas de ir à escola.',
    },
    15: {
      fonte: 'Caderno de Geografia, páginas 58–63 e material complementar — revisão adaptada.',
      texto:
        'Barco em rio é hidroviário. Materiais em tubulações usam o caminho dutoviário. Ao pedalar, capacete e outras proteções ajudam na segurança.',
    },
    16: {
      fonte: 'Caderno de Geografia, página 64 — conteúdo adaptado.',
      texto:
        'Telefone, rádio, jornal e televisão são meios de comunicação. Eles ajudam pessoas a trocar notícias, mensagens e informações.',
    },
    17: {
      fonte: 'Caderno de Geografia, página 65 — situações adaptadas.',
      texto:
        'Uma carta leva mensagem escrita. O rádio transmite sons. A televisão pode mostrar som e imagem. Telefone ou celular ajudam a conversar rapidamente com alguém que está longe.',
    },
    18: {
      fonte: 'Caderno de Geografia, página 64 — conteúdo adaptado.',
      texto:
        'A internet também pode ajudar na comunicação: podemos enviar mensagens, pesquisar e conversar por chamada de vídeo. Ela não dirige veículos.',
    },
    19: {
      fonte: 'Caderno de Geografia, página 65 — conteúdo adaptado.',
      texto:
        'No Brasil, muitas pessoas surdas se comunicam usando a Língua Brasileira de Sinais, chamada Libras. Libras é uma língua de sinais usada para comunicação.',
    },
    20: {
      fonte: 'Caderno de Geografia, página 67 — conteúdo adaptado.',
      texto:
        'Jornais podem informar e divertir. Há jornal impresso e jornal digital. O digital pode ser acessado em computador, celular ou tablet; o impresso é lido no papel.',
    },
    21: {
      fonte: 'Material complementar — evolução dos meios de comunicação.',
      texto:
        'As formas de comunicação foram mudando com o tempo. Segundo a linha do tempo do material, pinturas rupestres vieram antes da escrita, do jornal, do telefone e do smartphone.',
    },
    22: {
      fonte: 'Material complementar — evolução dos meios de comunicação.',
      texto:
        'Segundo a linha do tempo do material, o telégrafo veio antes do rádio, da televisão, do computador e da internet. Não é preciso decorar datas para perceber a ordem.',
    },
    23: {
      fonte: 'Material complementar — evolução dos meios de comunicação.',
      texto:
        'Segundo a linha do tempo do material, a escrita veio antes do jornal. Computador veio antes da internet, e internet antes do smartphone. Pinturas rupestres são as mais antigas desta comparação.',
    },
    24: {
      fonte: 'Material complementar — evolução dos meios de comunicação.',
      texto:
        'Há meios antigos e atuais de comunicação. Alguns continuam existindo quando aparece uma novidade. Por exemplo, jornal impresso e digital podem existir ao mesmo tempo.',
    },
    25: {
      fonte: 'Material complementar — Detetive digital.',
      texto:
        'Uma pessoa desconhecida em um jogo pode pedir foto em troca de moedas ou itens. Foto e dados pessoais não devem ser enviados a desconhecidos. Conte a um adulto responsável.',
    },
    26: {
      fonte: 'Material complementar — Detetive digital.',
      texto:
        'Um número desconhecido pode mandar um link com promessa de prêmio. Não clique em links suspeitos. Mostre a mensagem a um adulto responsável.',
    },
    27: {
      fonte: 'Material complementar — Detetive digital.',
      texto:
        'Ofensas em grupos podem machucar colegas. Não participe nem espalhe mensagens ofensivas. Procure um adulto responsável ou professor e trate as pessoas com respeito.',
    },
    28: {
      fonte: 'Material complementar — Semáforo da internet.',
      texto:
        'No semáforo da internet, ✓ Seguro significa que pode fazer; ⚠ Cuidado significa falar com um adulto antes; ⛔ Perigo significa não fazer. Os textos e símbolos ajudam a entender, além das cores.',
    },
    29: {
      fonte: 'Caderno de Geografia, página 66 — conteúdo adaptado.',
      texto:
        'Os cuidados estudados incluem escolher conteúdo adequado à idade, conversar com adulto responsável, desligar aparelhos nas refeições, proteger dados pessoais e equilibrar telas com outras atividades.',
    },
    30: {
      fonte: 'Caderno de Geografia, página 66 e materiais complementares — preparação para ditado.',
      texto:
        'Agora ouça uma frase por vez sobre segurança digital. A frase exata não aparece na tela: escute, escreva e use Repetir quando precisar.',
    },
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function conjunto(pergunta, opcoes, respostas) {
    return { tipo: 'selecao', pergunta: pergunta, opcoes: opcoes, respostas: respostas };
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
        id: 'geografia-transportes-comunicacao-q' + String(numero).padStart(2, '0'),
        bloco:
          numero <= 15 ? 'Geografia · Meios de transporte' : 'Geografia · Meios de comunicação',
        titulo: numero + '. ' + titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: sucesso,
        leitura: apoio.texto,
        leituraTitulo: 'Leia para aprender',
        fonteEstudo: apoio.fonte,
        opcoesReversiveis: true,
        icone:
          '../assets/objetos_escolares/' +
          (numero <= 15
            ? numero <= 3
              ? 'bus'
              : numero <= 10
                ? 'road'
                : 'shield'
            : numero <= 20
              ? 'computer'
              : numero <= 24
                ? 'clock'
                : 'shield') +
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

  var tiposAmplo = ['Terrestre', 'Aquático', 'Aéreo'];
  var tiposCaminho = [
    'Rodoviário',
    'Ferroviário',
    'Aéreo',
    'Hidroviário',
    'Marítimo',
    'Dutoviário',
  ];
  var semaforo = ['✓ Seguro', '⚠ Cuidado — fale com um adulto', '⛔ Perigo — não faça'];
  var sequenciaAntiga = ['Pinturas rupestres', 'Escrita', 'Jornal', 'Telefone', 'Smartphone'];
  var sequenciaTecnica = ['Telégrafo', 'Rádio', 'Televisão', 'Computador', 'Internet'];

  var questoes = [
    selecao(
      1,
      'Jeitos de ir à escola',
      'Quais formas de ir à escola aparecem no conteúdo estudado?',
      ['A pé', 'Ônibus', 'Carro', 'Barco', 'Bicicleta'],
      ['Foguete', 'Submarino'],
      'Pense nos caminhos comuns apresentados na leitura.',
      'Você encontrou todas as formas de ir à escola estudadas.'
    ),
    selecao(
      2,
      'Bicicleta: brincar e transportar',
      'Quais frases sobre a bicicleta estão corretas?',
      ['Pode ser usada para ir de um lugar a outro.', 'É movida pelas pedaladas.'],
      ['Anda somente sobre trilhos.', 'Precisa navegar em um rio.'],
      'Lembre como a bicicleta se movimenta e para que pode servir.',
      'A bicicleta pode transportar pessoas e se move com pedaladas.'
    ),
    unica(
      3,
      'Crianças ribeirinhas',
      'Qual meio combina melhor com uma criança que precisa atravessar um rio para chegar à escola?',
      ['Bicicleta', 'Barco ou lancha', 'Trem', 'Avião'],
      'Barco ou lancha',
      'Pense no caminho que passa pela água.',
      'Barco ou lancha pode ajudar em um caminho pelo rio.'
    ),
    q(
      4,
      'O lugar influencia o transporte',
      'Escolha o meio que combina melhor com cada situação.',
      [
        opcao(
          '4A — Criança que precisa atravessar um rio',
          ['Bicicleta', 'Embarcação', 'Trem'],
          'Embarcação'
        ),
        opcao(
          '4B — Trajeto urbano seguro com ciclovia',
          ['Bicicleta', 'Submarino', 'Navio'],
          'Bicicleta'
        ),
      ],
      'Observe se o caminho é pela água ou uma ciclovia segura.',
      'O caminho e as condições do lugar ajudam a escolher o transporte.'
    ),
    q(
      5,
      'Terrestre, aquático ou aéreo?',
      'Classifique cada transporte pelo lugar onde ele se desloca.',
      [
        ['Avião', 'Aéreo'],
        ['Barco à vela', 'Aquático'],
        ['Carro', 'Terrestre'],
        ['Bicicleta', 'Terrestre'],
        ['Balão', 'Aéreo'],
        ['Navio', 'Aquático'],
      ].map(function (dados) {
        return opcao(dados[0], tiposAmplo, dados[1]);
      }),
      'Terra, água ou ar: escolha o caminho de cada transporte.',
      'Você classificou corretamente os meios terrestres, aquáticos e aéreos.'
    ),
    q(
      6,
      'Hidroviário e dutoviário',
      'Escolha o tipo de caminho em cada situação.',
      [
        opcao(
          '6A — Barco seguindo por um rio',
          ['Hidroviário', 'Dutoviário', 'Aéreo'],
          'Hidroviário'
        ),
        opcao(
          '6B — Petróleo e gás seguindo por tubos',
          ['Rodoviário', 'Dutoviário', 'Marítimo'],
          'Dutoviário'
        ),
      ],
      'Hidroviário usa água; dutoviário usa tubos ou canos.',
      'Hidroviário usa caminhos de água, e dutoviário leva materiais por tubos.'
    ),
    q(
      7,
      'Por onde cada transporte passa?',
      'Associe cada exemplo ao seu tipo de caminho.',
      [
        ['Carro ou ônibus', 'Rodoviário'],
        ['Trem ou metrô', 'Ferroviário'],
        ['Avião', 'Aéreo'],
        ['Barco em rio', 'Hidroviário'],
        ['Navio no oceano', 'Marítimo'],
        ['Petróleo ou gás em tubulações', 'Dutoviário'],
      ].map(function (dados) {
        return opcao(dados[0], tiposCaminho, dados[1]);
      }),
      'Observe o lugar: rua, trilho, ar, rio, oceano ou tubo.',
      'Você reconheceu os seis tipos de caminho dos transportes.'
    ),
    q(
      8,
      'Complete com o banco de palavras',
      'Escolha a palavra que completa cada nome de transporte.',
      [
        opcao('8A — M _ T O', ['MOTO', 'BARCO', 'AVIÃO'], 'MOTO'),
        opcao('8B — B _ R C O', ['MOTO', 'BARCO', 'AVIÃO'], 'BARCO'),
        opcao('8C — A V I _ O', ['MOTO', 'BARCO', 'AVIÃO'], 'AVIÃO'),
      ],
      'Compare as letras faltantes com as palavras do banco.',
      'Você completou os três nomes de transportes.'
    ),
    q(
      9,
      'Verdadeiro ou falso',
      'Leia cada frase e escolha Verdadeiro ou Falso.',
      [
        ['Carros podem circular em rodovias.', 'Verdadeiro'],
        ['Barcos e navios se deslocam pelo ar.', 'Falso'],
        ['Petróleo e gás podem ser transportados por tubulações.', 'Verdadeiro'],
        ['Aviões usam o meio aéreo.', 'Verdadeiro'],
      ].map(function (dados) {
        return opcao(dados[0], ['Verdadeiro', 'Falso'], dados[1]);
      }),
      'Pense no caminho de cada transporte e dos materiais.',
      'Você conferiu os caminhos de transportes e tubulações.'
    ),
    selecao(
      10,
      'Transporte e qualidade do ar',
      'Quais veículos podem prejudicar a qualidade do ar em uma situação comum?',
      ['Carro a combustível', 'Ônibus a combustível'],
      ['Bicicleta'],
      'Procure os que podem soltar gases pelo escapamento.',
      'Carro e ônibus a combustível podem soltar gases; bicicleta é movida por pedaladas.'
    ),
    q(
      11,
      'Segurança nos transportes',
      'Escolha o cuidado principal em cada situação.',
      [
        opcao(
          '11A — Carro',
          ['Usar cinto de segurança', 'Colocar o braço para fora'],
          'Usar cinto de segurança'
        ),
        opcao(
          '11B — Ônibus',
          ['Embarcar e desembarcar no ponto de parada', 'Correr entre carros'],
          'Embarcar e desembarcar no ponto de parada'
        ),
        opcao(
          '11C — Barco',
          ['Usar colete salva-vidas', 'Ficar sem proteção'],
          'Usar colete salva-vidas'
        ),
        opcao(
          '11D — Bicicleta',
          ['Usar capacete, joelheiras e cotoveleiras', 'Pedalar sem proteção'],
          'Usar capacete, joelheiras e cotoveleiras'
        ),
      ],
      'Cada transporte tem um cuidado importante para a segurança.',
      'Você escolheu cuidados importantes para cada transporte.'
    ),
    selecao(
      12,
      'Pedestre atento',
      'Quais atitudes ajudam uma criança a atravessar com segurança?',
      [
        'Atravessar com adulto',
        'Usar faixa de pedestres',
        'Olhar para os dois lados',
        'Esperar condição segura no semáforo',
      ],
      ['Atravessar entre carros', 'Correr para atravessar sem olhar'],
      'Pense em atitudes calmas e cuidadosas antes de atravessar.',
      'Essas atitudes ajudam o pedestre a atravessar com mais segurança.'
    ),
    selecao(
      13,
      'Dentro do carro ou transporte escolar',
      'Quais cuidados devem ser usados durante o trajeto?',
      ['Usar cinto', 'Manter mãos e braços dentro do veículo'],
      ['Colocar o braço para fora', 'Soltar o cinto durante o trajeto'],
      'Pense no que mantém o corpo protegido dentro do veículo.',
      'Cinto e braços dentro do veículo ajudam a manter a segurança.'
    ),
    q(
      14,
      'Lendo dados de uma turma fictícia',
      'Use os dados da leitura para responder às três partes.',
      [
        opcao(
          '14A — Qual foi o meio mais usado?',
          ['Ônibus escolar', 'Bicicleta', 'A pé'],
          'Ônibus escolar'
        ),
        opcao(
          '14B — Qual foi o meio menos usado?',
          ['Carro', 'Bicicleta', 'Ônibus escolar'],
          'Bicicleta'
        ),
        opcao('14C — Quantos alunos vão de carro?', ['1', '3', '5'], '3'),
      ],
      'Compare os números da turma fictícia com calma.',
      'Você leu corretamente os dados da turma fictícia.'
    ),
    q(
      15,
      'Mini simulado de transportes',
      'Responda cada pequena situação.',
      [
        opcao('15A — Barco em rio', ['Hidroviário', 'Dutoviário', 'Aéreo'], 'Hidroviário'),
        opcao(
          '15B — Produto passando por tubulação',
          ['Marítimo', 'Dutoviário', 'Ferroviário'],
          'Dutoviário'
        ),
        opcao(
          '15C — Item de segurança para bicicleta',
          ['Capacete', 'Trilho', 'Escapamento'],
          'Capacete'
        ),
      ],
      'Pense nos caminhos e nos cuidados estudados.',
      'Você reuniu os principais aprendizados sobre transportes.'
    ),
    q(
      16,
      'Reconheça os meios de comunicação',
      'Escolha o nome de cada meio de comunicação.',
      [
        opcao(
          '16A — Aparelho para conversar por voz à distância',
          ['Telefone', 'Jornal', 'Rádio'],
          'Telefone'
        ),
        opcao('16B — Meio que transmite sons e notícias', ['Televisão', 'Rádio', 'Carta'], 'Rádio'),
        opcao(
          '16C — Publicação com notícias e textos',
          ['Jornal', 'Telefone', 'Celular'],
          'Jornal'
        ),
        opcao(
          '16D — Meio que pode mostrar imagem e som',
          ['Televisão', 'Rádio', 'Carta'],
          'Televisão'
        ),
      ],
      'Pense no que cada meio faz: voz, som, texto ou imagem.',
      'Você reconheceu telefone, rádio, jornal e televisão.'
    ),
    q(
      17,
      'Qual meio combina com a situação?',
      'Escolha o meio mais adequado em cada caso.',
      [
        opcao(
          '17A — Mandar mensagem escrita para alguém sem telefone nem internet',
          ['Carta', 'Rádio', 'Televisão'],
          'Carta'
        ),
        opcao('17B — Ouvir notícia sem olhar para uma tela', ['Rádio', 'Jornal', 'Carta'], 'Rádio'),
        opcao(
          '17C — Assistir a uma reportagem com imagem e som',
          ['Telefone', 'Televisão', 'Carta'],
          'Televisão'
        ),
        opcao(
          '17D — Conversar rapidamente com familiar que mora longe',
          ['Telefone ou celular', 'Jornal', 'Revista'],
          'Telefone ou celular'
        ),
      ],
      'Observe se a situação pede texto, som, imagem ou conversa rápida.',
      'Você escolheu um meio adequado para cada situação.'
    ),
    selecao(
      18,
      'A internet também comunica',
      'Quais usos podem ser feitos na internet?',
      ['Enviar mensagens', 'Pesquisar', 'Conversar por chamada de vídeo'],
      ['Dirigir um ônibus'],
      'Procure formas de trocar informações e conversar.',
      'A internet pode ajudar a pesquisar e comunicar com outras pessoas.'
    ),
    unica(
      19,
      'Libras é comunicação',
      'O que é Libras?',
      [
        'Uma língua de sinais usada para comunicação.',
        'Um tipo de transporte.',
        'Um aparelho para ouvir rádio.',
        'Uma estrada para carros.',
      ],
      'Uma língua de sinais usada para comunicação.',
      'Lembre da língua de sinais apresentada na leitura.',
      'Libras é uma língua de sinais usada por muitas pessoas para se comunicar.'
    ),
    q(
      20,
      'Jornal impresso e jornal digital',
      'Escolha Verdadeiro ou Falso em cada frase.',
      [
        ['Jornal impresso e digital podem informar pessoas.', 'Verdadeiro'],
        ['Jornal digital pode ser acessado por computador, celular ou tablet.', 'Verdadeiro'],
        ['Jornal impresso precisa de internet para ser lido.', 'Falso'],
      ].map(function (dados) {
        return opcao(dados[0], ['Verdadeiro', 'Falso'], dados[1]);
      }),
      'Compare o jornal no papel com o jornal acessado em uma tela.',
      'Você compreendeu as duas formas de ler jornal.'
    ),
    q(
      21,
      'Do mais antigo ao mais recente',
      'Ordene os meios segundo a linha do tempo do material.',
      sequenciaAntiga.map(function (texto, indice) {
        return campo('Posição ' + (indice + 1), texto);
      }),
      'Comece pelas pinturas rupestres e termine no smartphone.',
      'Você ordenou uma sequência de mudanças na comunicação.',
      {
        tipo: 'ordenacao',
        cartoes: [
          sequenciaAntiga[3],
          sequenciaAntiga[0],
          sequenciaAntiga[4],
          sequenciaAntiga[2],
          sequenciaAntiga[1],
        ],
      }
    ),
    q(
      22,
      'Outra sequência da linha do tempo',
      'Ordene os meios segundo a linha do tempo do material.',
      sequenciaTecnica.map(function (texto, indice) {
        return campo('Posição ' + (indice + 1), texto);
      }),
      'Comece pelo telégrafo e termine na internet.',
      'Você ordenou outra sequência de mudanças na comunicação.',
      {
        tipo: 'ordenacao',
        cartoes: [
          sequenciaTecnica[2],
          sequenciaTecnica[4],
          sequenciaTecnica[0],
          sequenciaTecnica[3],
          sequenciaTecnica[1],
        ],
      }
    ),
    q(
      23,
      'O que veio antes?',
      'Segundo a linha do tempo do material, escolha Sim ou Não em cada frase.',
      [
        ['A escrita veio antes do jornal.', 'Sim'],
        ['A internet veio depois do computador.', 'Sim'],
        ['O smartphone aparece depois da internet.', 'Sim'],
        ['A televisão aparece antes das pinturas rupestres.', 'Não'],
      ].map(function (dados) {
        return opcao(dados[0], ['Sim', 'Não'], dados[1]);
      }),
      'Compare a posição de cada meio na linha do tempo estudada.',
      'Você comparou corretamente o antes e o depois na linha do tempo.'
    ),
    selecao(
      24,
      'Mudanças na comunicação',
      'Quais ideias sobre os meios de comunicação estão corretas?',
      [
        'Diferentes meios podem existir ao mesmo tempo.',
        'Tecnologias novas podem permitir comunicação mais rápida entre lugares distantes.',
        'Um meio antigo não precisa deixar de existir só porque surgiu um novo.',
      ],
      ['Todo meio antigo desaparece quando surge um novo.'],
      'Pense no jornal impresso e digital existindo ao mesmo tempo.',
      'Meios antigos e novos podem continuar ajudando a comunicação.'
    ),
    q(
      25,
      'Detetive digital: pedido de foto',
      'Escolha a classificação e a atitude segura.',
      [
        opcao(
          '25A — Pessoa desconhecida pede foto em jogo em troca de moedas',
          ['Segura', 'Perigosa'],
          'Perigosa'
        ),
        opcao(
          '25B — O que fazer?',
          [
            'Enviar a foto depressa',
            'Não enviar a foto e contar a um adulto responsável',
            'Mandar o endereço',
          ],
          'Não enviar a foto e contar a um adulto responsável'
        ),
      ],
      'Pessoas desconhecidas não devem receber fotos ou dados pessoais.',
      'Essa é uma situação perigosa: não envie foto e procure um adulto responsável.'
    ),
    q(
      26,
      'Detetive digital: prêmio por link',
      'Classifique a situação e marque as atitudes seguras.',
      [
        opcao(
          '26A — Número desconhecido promete celular grátis e manda link',
          ['Segura', 'Perigosa'],
          'Perigosa'
        ),
        conjunto(
          '26B — O que fazer?',
          [
            'Não clicar no link',
            'Mostrar a mensagem a um adulto responsável',
            'Enviar o link para mais pessoas',
          ],
          ['Não clicar no link', 'Mostrar a mensagem a um adulto responsável']
        ),
      ],
      'Não clique em links suspeitos; mostre a mensagem a um adulto.',
      'Você reconheceu o link suspeito e escolheu atitudes seguras.',
      { tipo: 'misto' }
    ),
    selecao(
      27,
      'Detetive digital: mensagens ofensivas',
      'Quais atitudes combinam com respeito em um grupo?',
      [
        'Não participar das ofensas',
        'Procurar adulto responsável ou professor',
        'Tratar os colegas com respeito',
      ],
      ['Encaminhar a mensagem para mais pessoas'],
      'Ofensas podem machucar. Pense em quem pode ajudar.',
      'Você escolheu atitudes de respeito e proteção para o grupo.'
    ),
    q(
      28,
      'Semáforo da internet',
      'Classifique cada situação. Leia texto e símbolo, não apenas a cor.',
      [
        ['Pesquisar tema escolar em site confiável', '✓ Seguro'],
        ['Contar a desconhecido em qual escola estuda', '⛔ Perigo — não faça'],
        ['Postar foto mostrando número da casa ou placa do carro', '⛔ Perigo — não faça'],
        [
          'Abrir a câmera para alguém conhecido somente naquele dia em jogo ou chat',
          '⛔ Perigo — não faça',
        ],
        ['Entrar em site novo sem saber se é confiável', '⚠ Cuidado — fale com um adulto'],
        ['Aceitar amizade de pessoa nunca vista pessoalmente', '⛔ Perigo — não faça'],
      ].map(function (dados) {
        return opcao(dados[0], semaforo, dados[1]);
      }),
      'Use os rótulos: seguro, cuidado com adulto ou perigo.',
      'Você identificou situações seguras, de cuidado e de perigo na internet.'
    ),
    selecao(
      29,
      'Bons hábitos com telas e internet',
      'Quais cuidados foram estudados?',
      [
        'Escolher conteúdo adequado à idade',
        'Conversar com adulto responsável',
        'Desligar aparelhos durante refeições',
        'Evitar divulgar dados pessoais',
        'Equilibrar telas com outras atividades',
        'Evitar aparelhos pouco antes de dormir',
      ],
      [
        'Contar endereço para desconhecidos',
        'Clicar em todo link recebido',
        'Usar aparelho durante toda refeição',
      ],
      'Escolha hábitos que ajudam a usar telas e internet com cuidado.',
      'Você reconheceu os cuidados estudados para telas e internet.'
    ),
    q(
      30,
      'Ditado final de segurança digital',
      'Ouça uma frase por vez e escreva. Você pode repetir, parar e corrigir.',
      [
        campo('30A — Frase 1', 'Não clico em links de desconhecidos.'),
        campo('30B — Frase 2', 'Peço ajuda a um adulto quando tenho dúvida na internet.'),
        campo('30C — Frase 3', 'Não divulgo meus dados pessoais na internet.'),
      ],
      'Use Repetir para ouvir cada frase novamente e revise com calma.',
      'Você escreveu três frases importantes sobre segurança digital!',
      { ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true }
    ),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'mariana-geografia-transportes-comunicacao-setembro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Geografia',
    titulo: 'Meios de transporte e comunicação',
    subtitulo: 'Transportes, segurança, comunicação e cuidados na internet',
    chave: 'revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você revisou transportes, segurança, comunicação e cuidados na internet. Cada questão vale um ponto: são 30 ao todo!',
    questoes: questoes,
  });
})();
