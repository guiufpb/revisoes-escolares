(function () {
  'use strict';

  // Fonte pedagógica: síntese fornecida das páginas 64–69 e materiais complementares.
  // Todas as situações são fictícias: nenhum endereço ou dado pessoal de Alice é pedido ou salvo.
  var apoios = {
    1: {
      fonte: 'Caderno de Geografia, página 64 — conteúdo adaptado.',
      texto: 'A moradia é o lugar onde as pessoas vivem, descansam e se protegem.',
    },
    2: {
      fonte: 'Caderno de Geografia, página 64 — conteúdo adaptado.',
      texto:
        'Uma casa pode ficar no chão. Um prédio pode ter vários apartamentos onde famílias moram.',
      ilustracao: '../assets/objetos_escolares/geografia-moradias-tipos.svg',
      descricao: 'Desenho de uma casa térrea, um sobrado e um prédio de apartamentos.',
    },
    3: {
      fonte: 'Caderno de Geografia, páginas 64–65 — conteúdo adaptado.',
      texto:
        'O endereço ajuda a encontrar um lugar. Nome da rua, número, bairro, cidade e CEP podem fazer parte dele. Nesta atividade não usamos endereço real.',
    },
    4: {
      fonte: 'Caderno de Geografia, página 65 — situação fictícia criada para esta revisão.',
      texto:
        'Família Sol: Rua das Flores, 25. Bairro Jardim. Cidade Feliz. CEP 00000-000. Esses dados são inventados e servem apenas para estudar as partes de um endereço.',
    },
    5: {
      fonte: 'Caderno de Geografia, página 65 — cena fictícia original.',
      texto:
        'Em uma cena inventada, a casa fica no centro. A árvore está ao lado da casa. A praça fica em frente, do outro lado da rua.',
      ilustracao: '../assets/objetos_escolares/geografia-casa-arredores.svg',
      descricao: 'Casa no centro, árvore ao lado esquerdo e praça em frente, do outro lado da rua.',
    },
    6: {
      fonte: 'Caderno de Geografia, página 67 — conteúdo adaptado.',
      texto:
        'Perto de algumas moradias podem existir padaria, mercado, farmácia, casas e prédios. Cada bairro pode ser diferente.',
    },
    7: {
      fonte: 'Cronograma da prova — ampliação pedagógica.',
      texto: 'Bia mora perto de uma praça com brinquedos. Ela vai brincar ali com um adulto.',
    },
    8: {
      fonte: 'Caderno de Geografia, página 66 — conteúdo adaptado.',
      texto:
        'Casa térrea tem seus principais ambientes no nível do chão, sem outro andar de moradia acima.',
      ilustracao: '../assets/objetos_escolares/geografia-moradias-tipos.svg',
      descricao:
        'Desenho de casa térrea, sobrado e prédio. A casa térrea aparece à esquerda, com apenas um andar.',
    },
    9: {
      fonte: 'Caderno de Geografia, página 66 e material complementar — conteúdo adaptado.',
      texto: 'Sobrado é uma casa com dois andares. Os cômodos podem ficar em mais de um piso.',
      ilustracao: '../assets/objetos_escolares/geografia-moradias-tipos.svg',
      descricao:
        'Desenho de casa térrea, sobrado e prédio. O sobrado aparece no meio, com dois andares.',
    },
    10: {
      fonte: 'Caderno de Geografia, páginas 64 e 66 — conteúdo adaptado.',
      texto:
        'Apartamentos são moradias que ficam em prédios. Um prédio pode ter vários apartamentos.',
      ilustracao: '../assets/objetos_escolares/geografia-moradias-tipos.svg',
      descricao:
        'Desenho de casa térrea, sobrado e prédio. O prédio aparece à direita, com várias janelas.',
    },
    11: {
      fonte: 'Material complementar — tipos de moradia.',
      texto:
        'Palafita pode ser construída sobre estacas perto da água. Oca é uma moradia indígena tradicional, que pode usar materiais da natureza e varia entre povos. Iglu é um abrigo tradicional feito com blocos de neve em lugares muito frios.',
    },
    12: {
      fonte: 'Caderno de Geografia, página 66 e material complementar — conteúdo adaptado.',
      texto:
        'Apartamento fica em prédio. Sobrado é casa com dois andares. Palafita pode ser construída sobre estacas perto da água.',
    },
    13: {
      fonte: 'Caderno de Geografia, páginas 64–67 e ampliação moderada.',
      texto:
        'As pessoas vivem em tipos diferentes de moradia. O tipo pode mudar conforme o lugar, a cultura, o clima e as necessidades. Toda moradia deve ajudar a proteger quem vive nela.',
    },
    14: {
      fonte: 'Material complementar — ampliação leve sobre materiais.',
      texto:
        'Algumas moradias usam madeira. Casas de alvenaria podem usar tijolos. Iglus tradicionais são associados a blocos de neve.',
    },
    15: {
      fonte: 'Caderno de Geografia, página 66 — dados fictícios criados para esta revisão.',
      texto:
        'Turma fictícia: casa térrea: 4 crianças; apartamento: 3 crianças; sobrado: 2 crianças. Esses números não são da turma de Alice.',
    },
    16: {
      fonte: 'Caderno de Geografia, página 68 — conteúdo adaptado.',
      texto:
        'Uma moradia pode ser dividida em cômodos. Cada cômodo é uma parte da casa e costuma ser usado para algumas atividades.',
    },
    17: {
      fonte: 'Caderno de Geografia, páginas 68–69 — conteúdo adaptado.',
      texto:
        'Algumas ações combinam com um cômodo: tomar banho no banheiro, preparar comida na cozinha, dormir no quarto e sentar no sofá da sala.',
    },
    18: {
      fonte: 'Caderno de Geografia, páginas 68–69 e material complementar — conteúdo adaptado.',
      texto:
        'Cama costuma ficar no quarto; fogão, na cozinha; chuveiro, no banheiro; sofá, na sala.',
    },
    19: {
      fonte: 'Caderno de Geografia, página 69 — conteúdo adaptado.',
      texto:
        'Na cozinha, as pessoas podem preparar alimentos. Geladeira, pia e fogão são objetos comuns nesse cômodo.',
    },
    20: {
      fonte: 'Caderno de Geografia, página 69 — conteúdo adaptado.',
      texto:
        'O quarto é um cômodo usado principalmente para descansar e dormir. Cama e travesseiro podem ficar nele.',
    },
    21: {
      fonte: 'Caderno de Geografia, página 69 — conteúdo adaptado.',
      texto:
        'No banheiro, as pessoas cuidam da higiene e podem tomar banho. Chuveiro e pia do banheiro são objetos desse cômodo.',
    },
    22: {
      fonte: 'Caderno de Geografia, página 68 — casa fictícia original.',
      texto:
        'Esta casa inventada tem quatro cômodos: sala com sofá, cozinha com fogão, quarto com cama e banheiro com chuveiro.',
      ilustracao: '../assets/objetos_escolares/geografia-casa-interior.svg',
      descricao:
        'Casa fictícia vista por dentro com quatro cômodos: sala com sofá, cozinha com fogão, quarto com cama e banheiro com chuveiro.',
    },
    23: {
      fonte: 'Caderno de Geografia, página 69 — conteúdo adaptado.',
      texto:
        'Todos podem ajudar a cuidar da moradia conforme a idade. Guardar brinquedos e colocar objetos no lugar ajuda na organização.',
    },
    24: {
      fonte: 'Caderno de Geografia, páginas 64–69 e cronograma da prova — revisão adaptada.',
      texto:
        'Apartamento é moradia em prédio. Sobrado tem dois andares. Padaria pode existir em um bairro. Na história de Bia, a praça é lugar de brincar com adulto.',
    },
    25: {
      fonte: 'Caderno de Geografia, páginas 64–69 — preparação para ditado.',
      texto:
        'Ouça uma frase curta por vez sobre moradias, cômodos e lugares de brincar. A frase exata não aparece na tela: escute, escreva e use Repetir quando precisar.',
    },
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
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
        id: 'geografia-moradias-lugares-q' + String(numero).padStart(2, '0'),
        bloco:
          numero <= 7
            ? 'Geografia · Moradia e arredores'
            : numero <= 15
              ? 'Geografia · Tipos de moradia'
              : 'Geografia · Interior da moradia',
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
          (numero <= 7 ? 'home' : numero <= 15 ? 'house' : numero <= 23 ? 'floor-plan' : 'map') +
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

  var questoes = [
    selecao(
      1,
      'Para que serve a moradia?',
      'Para que a moradia pode servir?',
      ['Viver', 'Descansar', 'Proteger-se'],
      ['Dirigir um ônibus', 'Nadar no oceano'],
      'Pense no lugar onde as pessoas vivem e descansam.',
      'A moradia ajuda as pessoas a viver, descansar e se proteger.'
    ),
    q(
      2,
      'Casa ou prédio de apartamentos?',
      'Escolha o nome de cada moradia no desenho.',
      [
        opcao(
          '2A — Moradia com apenas uma casa no chão',
          ['Casa', 'Prédio de apartamentos'],
          'Casa'
        ),
        opcao(
          '2B — Construção alta com vários lugares para morar',
          ['Casa', 'Prédio de apartamentos'],
          'Prédio de apartamentos'
        ),
      ],
      'Observe a casa e o prédio no desenho.',
      'Você reconheceu uma casa e um prédio de apartamentos.'
    ),
    selecao(
      3,
      'O endereço ajuda a encontrar',
      'Quais itens podem fazer parte de um endereço?',
      ['Nome da rua', 'Número', 'Bairro', 'Cidade', 'CEP'],
      ['Sabor de sorvete', 'Nome de um brinquedo'],
      'Pense nas informações que ajudam a localizar um lugar.',
      'Rua, número, bairro, cidade e CEP podem ajudar a localizar um lugar.'
    ),
    q(
      4,
      'Endereço de uma família fictícia',
      'Use apenas os dados inventados da Família Sol para responder.',
      [
        opcao(
          '4A — Qual é o nome da rua?',
          ['Rua das Flores', 'Rua dos Brinquedos', 'Rua da Escola'],
          'Rua das Flores'
        ),
        opcao('4B — Qual é o número?', ['15', '25', '35'], '25'),
        opcao('4C — Qual é o bairro?', ['Jardim', 'Sol', 'Feliz'], 'Jardim'),
      ],
      'Leia novamente os dados fictícios da Família Sol.',
      'Você encontrou rua, número e bairro no endereço inventado.',
      { tipo: 'misto' }
    ),
    q(
      5,
      'Em frente e ao lado',
      'Olhe a cena fictícia e responda.',
      [
        opcao('5A — O que está ao lado da casa?', ['Árvore', 'Praça', 'Ônibus'], 'Árvore'),
        opcao('5B — O que está em frente à casa?', ['Praça', 'Árvore', 'Quarto'], 'Praça'),
      ],
      'Use a descrição do desenho: árvore ao lado e praça em frente.',
      'Você observou corretamente o que está ao lado e em frente à casa.'
    ),
    selecao(
      6,
      'O que pode existir perto da moradia?',
      'O que pode existir perto de algumas moradias?',
      ['Padaria', 'Mercado', 'Farmácia', 'Casas', 'Prédios'],
      ['Planeta Saturno', 'Fundo do oceano'],
      'Pense em lugares que podem fazer parte de uma rua ou bairro.',
      'Esses lugares podem existir perto de algumas moradias; cada bairro é diferente.'
    ),
    unica(
      7,
      'Um lugar para brincar',
      'Onde Bia brinca na pequena história?',
      ['Praça', 'Telhado', 'Rodovia', 'Dentro de um rio'],
      'Praça',
      'Lembre da praça com brinquedos perto da casa de Bia.',
      'Bia brinca na praça com brinquedos, acompanhada de um adulto.'
    ),
    unica(
      8,
      'Casa térrea',
      'Qual é a casa com apenas um andar de moradia?',
      ['Casa térrea', 'Sobrado', 'Prédio de apartamentos'],
      'Casa térrea',
      'Procure a casa que fica toda no nível do chão.',
      'A casa térrea tem seus principais ambientes no nível do chão.'
    ),
    unica(
      9,
      'Sobrado',
      'Como se chama uma casa com dois andares?',
      ['Casa térrea', 'Sobrado', 'Apartamento'],
      'Sobrado',
      'Pense na casa com mais de um piso.',
      'Sobrado é uma casa com dois andares.'
    ),
    unica(
      10,
      'Apartamento',
      'Em qual construção podemos encontrar vários apartamentos?',
      ['Prédio', 'Praça', 'Padaria', 'Árvore'],
      'Prédio',
      'Apartamentos ficam em uma construção com vários andares.',
      'Um prédio pode ter vários apartamentos.'
    ),
    q(
      11,
      'Três moradias diferentes',
      'Associe cada moradia à sua explicação.',
      [
        opcao(
          '11A — Palafita',
          [
            'Sobre estacas perto da água',
            'Feita com blocos de neve',
            'Moradia indígena tradicional',
          ],
          'Sobre estacas perto da água'
        ),
        opcao(
          '11B — Oca',
          [
            'Sobre estacas perto da água',
            'Moradia indígena tradicional',
            'Feita com blocos de neve',
          ],
          'Moradia indígena tradicional'
        ),
        opcao(
          '11C — Iglu',
          [
            'Moradia indígena tradicional',
            'Feita com blocos de neve',
            'Sobre estacas perto da água',
          ],
          'Feita com blocos de neve'
        ),
      ],
      'Leia novamente as três explicações antes de responder.',
      'Você reconheceu três tipos diferentes de moradia.'
    ),
    q(
      12,
      'Qual moradia combina com a pista?',
      'Escolha a moradia indicada em cada pista.',
      [
        opcao('12A — Fica em um prédio.', ['Apartamento', 'Sobrado', 'Palafita'], 'Apartamento'),
        opcao('12B — É uma casa com dois andares.', ['Casa térrea', 'Sobrado', 'Iglu'], 'Sobrado'),
        opcao(
          '12C — Pode ser construída sobre estacas perto da água.',
          ['Palafita', 'Apartamento', 'Prédio'],
          'Palafita'
        ),
      ],
      'Compare as pistas com as explicações estudadas.',
      'Você combinou cada pista com o tipo de moradia.'
    ),
    q(
      13,
      'Moradias podem ser diferentes',
      'Escolha Verdadeiro ou Falso em cada frase.',
      [
        'Existem diferentes tipos de moradia.',
        'Toda pessoa do mundo mora em uma casa igual.',
        'Uma moradia deve ajudar a proteger quem vive nela.',
      ].map(function (texto, indice) {
        return opcao(texto, ['Verdadeiro', 'Falso'], indice === 1 ? 'Falso' : 'Verdadeiro');
      }),
      'Pense nas diferenças de lugar, cultura, clima e necessidades.',
      'As moradias podem ser diferentes e devem ajudar a proteger quem vive nelas.'
    ),
    q(
      14,
      'Uma pequena ampliação sobre materiais',
      'Associe a moradia ao material indicado na leitura.',
      [
        opcao('14A — Casa de madeira', ['Madeira', 'Tijolos', 'Blocos de neve'], 'Madeira'),
        opcao('14B — Casa de alvenaria', ['Blocos de neve', 'Tijolos', 'Madeira'], 'Tijolos'),
        opcao('14C — Iglu', ['Tijolos', 'Madeira', 'Blocos de neve'], 'Blocos de neve'),
      ],
      'Use apenas as três relações simples mostradas na leitura.',
      'Você associou cada moradia a um material da ampliação.'
    ),
    q(
      15,
      'Lendo uma tabela fictícia',
      'Use os dados inventados da turma para responder.',
      [
        opcao(
          '15A — Qual tipo tem mais crianças?',
          ['Casa térrea', 'Apartamento', 'Sobrado'],
          'Casa térrea'
        ),
        opcao('15B — Quantas crianças moram em apartamento?', ['2', '3', '4'], '3'),
        opcao(
          '15C — Qual tipo tem menos crianças?',
          ['Apartamento', 'Sobrado', 'Casa térrea'],
          'Sobrado'
        ),
      ],
      'Compare os números 4, 3 e 2 da turma fictícia.',
      'Você leu corretamente a tabela fictícia.',
      { tipo: 'misto' }
    ),
    unica(
      16,
      'O que é um cômodo?',
      'O que é um cômodo?',
      ['Uma parte da moradia', 'Um tipo de avião', 'Uma rua da cidade'],
      'Uma parte da moradia',
      'Pense nas partes da casa, como quarto e cozinha.',
      'Um cômodo é uma parte da moradia.'
    ),
    q(
      17,
      'Onde fazemos cada atividade?',
      'Escolha o cômodo que combina com cada atividade.',
      [
        opcao('17A — Tomar banho', ['Banheiro', 'Cozinha', 'Sala'], 'Banheiro'),
        opcao('17B — Preparar comida', ['Quarto', 'Cozinha', 'Banheiro'], 'Cozinha'),
        opcao('17C — Dormir', ['Sala', 'Quarto', 'Cozinha'], 'Quarto'),
        opcao('17D — Sentar no sofá para receber pessoas', ['Banheiro', 'Sala', 'Quarto'], 'Sala'),
      ],
      'Lembre das atividades claras de cada cômodo.',
      'Você relacionou as atividades aos cômodos.'
    ),
    q(
      18,
      'Objetos e cômodos',
      'Escolha onde cada objeto costuma ficar.',
      [
        opcao('18A — Cama', ['Quarto', 'Cozinha', 'Sala'], 'Quarto'),
        opcao('18B — Fogão', ['Banheiro', 'Cozinha', 'Quarto'], 'Cozinha'),
        opcao('18C — Chuveiro', ['Sala', 'Banheiro', 'Cozinha'], 'Banheiro'),
        opcao('18D — Sofá', ['Sala', 'Quarto', 'Banheiro'], 'Sala'),
      ],
      'Use a leitura sobre cama, fogão, chuveiro e sofá.',
      'Você associou os objetos aos cômodos.'
    ),
    selecao(
      19,
      'Cozinha',
      'Quais objetos podem ficar na cozinha?',
      ['Geladeira', 'Pia', 'Fogão'],
      ['Chuveiro', 'Cama'],
      'Pense nos objetos usados para preparar alimentos.',
      'Geladeira, pia e fogão são objetos comuns na cozinha.'
    ),
    selecao(
      20,
      'Quarto',
      'Quais objetos podem ficar no quarto?',
      ['Cama', 'Travesseiro'],
      ['Fogão', 'Chuveiro'],
      'Pense nos objetos usados para descansar e dormir.',
      'Cama e travesseiro podem ficar no quarto.'
    ),
    selecao(
      21,
      'Banheiro',
      'Quais objetos combinam com o banheiro?',
      ['Chuveiro', 'Pia do banheiro'],
      ['Sofá', 'Fogão'],
      'Pense no cômodo usado para higiene e banho.',
      'Chuveiro e pia do banheiro são objetos desse cômodo.'
    ),
    q(
      22,
      'Uma casa fictícia vista por dentro',
      'Observe a casa inventada e responda.',
      [
        opcao('22A — Quantos cômodos aparecem?', ['3', '4', '5'], '4'),
        opcao('22B — Em qual cômodo está a cama?', ['Quarto', 'Cozinha', 'Sala'], 'Quarto'),
        opcao('22C — Em qual cômodo está o fogão?', ['Banheiro', 'Cozinha', 'Quarto'], 'Cozinha'),
      ],
      'Use a descrição: sala, cozinha, quarto e banheiro.',
      'Você observou os quatro cômodos da casa fictícia.',
      { tipo: 'misto' }
    ),
    selecao(
      23,
      'Organização da moradia',
      'Quais atitudes ajudam a organizar a moradia?',
      ['Guardar brinquedos', 'Colocar objetos no lugar', 'Ajudar em tarefas adequadas à idade'],
      ['Jogar lixo no chão', 'Espalhar objetos de propósito'],
      'Escolha atitudes de cuidado que sejam adequadas para crianças.',
      'Guardar brinquedos e colocar objetos no lugar ajuda a organizar a moradia.'
    ),
    q(
      24,
      'Mini simulado: moradia e arredores',
      'Responda às quatro pequenas pistas.',
      [
        opcao('24A — Moradia em prédio', ['Apartamento', 'Sobrado', 'Palafita'], 'Apartamento'),
        opcao('24B — Casa com dois andares', ['Casa térrea', 'Sobrado', 'Iglu'], 'Sobrado'),
        opcao(
          '24C — Lugar do bairro para comprar pão',
          ['Padaria', 'Banheiro', 'Quarto'],
          'Padaria'
        ),
        opcao(
          '24D — Lugar de brincar citado na história de Bia',
          ['Praça', 'Telhado', 'Rodovia'],
          'Praça'
        ),
      ],
      'Lembre das pistas de moradia, bairro e da história de Bia.',
      'Você reuniu os aprendizados sobre moradias, arredores e lugares de brincar.',
      { tipo: 'misto' }
    ),
    q(
      25,
      'Ditado final: minha revisão de Geografia',
      'Ouça uma frase curta por vez e escreva. Você pode repetir, parar e corrigir.',
      [
        campo('25A — Frase 1', 'A moradia é um lugar para viver.'),
        campo('25B — Frase 2', 'O quarto é um cômodo da casa.'),
        campo('25C — Frase 3', 'A praça pode ser um lugar de brincar.'),
      ],
      'Use Repetir para ouvir cada frase novamente e revise com calma.',
      'Você escreveu três frases sobre moradia, cômodos e lugares de brincar!',
      { ditado: true, unidadeDitado: 'frase', cancelarAoTrocarCampo: true }
    ),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'alice-geografia-moradias-lugares-interior-setembro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Geografia',
    titulo: 'Moradias, lugares e cômodos',
    subtitulo: 'Moradias, arredores, lugares de brincar e interior da casa',
    chave: 'revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você revisou moradias, lugares do bairro, cômodos e organização. Cada questão vale um ponto: são 25 ao todo!',
    questoes: questoes,
  });
})();
