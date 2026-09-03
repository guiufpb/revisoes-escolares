(function () {
  'use strict';

  var imagens = {
    planta: '../assets/objetos_escolares/science-plant-parts.svg',
    caule: '../assets/objetos_escolares/science-plant-stem.svg',
    alimentos: '../assets/objetos_escolares/science-flower-fruit-seeds.svg',
    ambiente: '../assets/objetos_escolares/science-plants-environment.svg',
    diaNoite: '../assets/objetos_escolares/science-day-night.svg',
    solVida: '../assets/objetos_escolares/science-sun-life.svg',
    materiais: '../assets/objetos_escolares/science-light-materials.svg',
    camisetas: '../assets/objetos_escolares/science-shirts.svg',
    cuidados: '../assets/objetos_escolares/science-sun-care.svg',
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function campo(pergunta, resposta, extras) {
    return Object.assign({ pergunta: pergunta, respostas: [resposta] }, extras || {});
  }

  function q(numero, titulo, instrucao, itens, dica, sucesso, extras) {
    var partePlantas = numero <= 15;
    return Object.assign(
      {
        id: 'ciencias-plantas-sol-q' + String(numero).padStart(2, '0'),
        parte: partePlantas ? 'plantas' : 'sol',
        bloco: partePlantas
          ? 'Ciências · Plantas e outros seres vivos'
          : 'Ciências · Sol, luz e calor',
        titulo: numero + '. ' + titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: sucesso,
        leitura: partePlantas
          ? 'Observe as partes das plantas e pense em como elas ajudam os seres vivos e o ambiente.'
          : 'Observe a luz e o calor nas cenas e pense no que acontece durante o dia e a noite.',
        leituraTitulo: 'Observe e relembre',
        fonteEstudo: 'Síntese pedagógica de Ciências — atividade original.',
        opcoesReversiveis: true,
        icone: partePlantas ? '../assets/objetos_escolares/tree.svg' : imagens.cuidados,
      },
      extras || {}
    );
  }

  function unica(numero, titulo, pergunta, opcoes, resposta, dica, sucesso, extras) {
    return q(
      numero,
      titulo,
      'Escolha uma resposta. Você pode trocar ou clicar novamente para desmarcar.',
      [opcao(pergunta, opcoes, resposta)],
      dica,
      sucesso,
      extras
    );
  }

  function selecao(numero, titulo, pergunta, opcoes, respostas, dica, sucesso, extras) {
    return q(
      numero,
      titulo,
      pergunta,
      [
        {
          tipo: 'selecao',
          pergunta: 'Marque todas as respostas corretas.',
          opcoes: opcoes,
          respostas: respostas,
        },
      ],
      dica,
      sucesso,
      Object.assign({ tipo: 'selecao' }, extras || {})
    );
  }

  function ditado(numero, titulo, resposta, unidade, extras, imagem, descricao) {
    var frase = unidade === 'frase';
    return q(
      numero,
      titulo,
      frase
        ? 'Ouça a frase e escreva no campo vazio. Use Repetir quando precisar.'
        : 'Ouça a palavra e escreva no campo vazio. Use Repetir quando precisar.',
      [campo(frase ? 'Escreva a frase ouvida.' : 'Escreva a palavra ouvida.', resposta, extras)],
      'Ouça novamente e confira cada letra antes de tentar outra vez.',
      frase ? 'Você escreveu a frase completa!' : 'Você escreveu a palavra corretamente!',
      {
        bloco: 'Ciências · Ditado',
        leitura: 'Observe a ilustração, acione o áudio e escreva sem procurar a resposta na tela.',
        ditado: true,
        unidadeDitado: unidade,
        cancelarAoTrocarCampo: true,
        ilustracaoLeitura: imagem || (frase ? imagens.cuidados : imagens.planta),
        descricaoIlustracao:
          descricao ||
          (frase
            ? 'Plantas, passarinho, criança protegida e Sol em uma cena ao ar livre.'
            : 'Ilustração original relacionada à palavra ditada, sem mostrar sua escrita.'),
      }
    );
  }

  var partes = ['Raiz', 'Caule', 'Folha', 'Flor'];
  var frutos = ['Mangaba', 'Murici', 'Jatobá'];
  var questoes = [
    q(
      1,
      'Conhecendo a planta',
      'Toque na RAIZ.',
      [opcao('Escolha a parte pedida na ilustração.', partes, 'Raiz')],
      'A parte pedida fica abaixo da linha do solo e ajuda a prender a planta.',
      'Esta é a RAIZ. O nome e o símbolo de acerto também mostram a resposta.',
      {
        leitura:
          'A planta desenhada tem flor, folhas, caule, fruto e uma parte que cresce sob o solo.',
        mapaVisual: {
          imagem: imagens.planta,
          descricao: 'Planta completa com flor, folhas, caule, fruto e raízes visíveis sob o solo.',
          rotulo: 'Partes selecionáveis de uma planta completa',
          pontos: [
            { opcao: 'Flor', rotulo: 'Tocar na flor', x: 50, y: 20 },
            { opcao: 'Folha', rotulo: 'Tocar na folha', x: 39, y: 48 },
            { opcao: 'Caule', rotulo: 'Tocar no caule', x: 50, y: 59 },
            { opcao: 'Raiz', rotulo: 'Tocar na raiz', x: 50, y: 88 },
          ],
        },
      }
    ),
    unica(
      2,
      'Para que serve a raiz?',
      'A raiz ajuda principalmente a:',
      [
        'Fixar a planta no solo e absorver água e nutrientes.',
        'Fazer a planta voar.',
        'Produzir sons.',
      ],
      'Fixar a planta no solo e absorver água e nutrientes.',
      'Pense no que a parte que fica no solo consegue fazer.',
      'A raiz prende a planta e absorve água e nutrientes.',
      {
        ilustracaoLeitura: imagens.planta,
        descricaoIlustracao: 'Planta completa com raízes visíveis no solo.',
      }
    ),
    unica(
      3,
      'O caule',
      'Que parte da planta está indicada pela seta?',
      ['Flor', 'Caule', 'Raiz'],
      'Caule',
      'A seta aponta para a parte central que liga raiz, folhas e flor.',
      'A seta indica o caule.',
      {
        ilustracaoLeitura: imagens.caule,
        descricaoIlustracao: 'Planta com seta apontando para sua parte central vertical.',
      }
    ),
    unica(
      4,
      'Função do caule',
      'O caule __________ a planta.',
      ['SUSTENTA', 'VOA', 'ESCONDE'],
      'SUSTENTA',
      'Escolha a palavra que mostra como o caule mantém a planta erguida.',
      'O caule SUSTENTA a planta.',
      {
        ilustracaoLeitura: imagens.caule,
        descricaoIlustracao: 'Caule mantendo folhas e flor acima do solo.',
      }
    ),
    unica(
      5,
      'As folhas',
      'Qual parte capta luz e ajuda a planta a produzir seu alimento?',
      ['Folha', 'Raiz', 'Fruto'],
      'Folha',
      'Procure a parte geralmente achatada que recebe a luz.',
      'As folhas captam luz e ajudam a planta a produzir seu alimento.',
      {
        ilustracaoLeitura: imagens.planta,
        descricaoIlustracao: 'Planta com raiz, folhas, flor e fruto claramente distinguíveis.',
      }
    ),
    q(
      6,
      'Flor, fruto e semente',
      'Coloque na ordem.',
      ['Flor', 'Fruto', 'Sementes'].map(function (texto, indice) {
        return campo('Posição ' + (indice + 1), texto);
      }),
      'Comece pela flor e pense no que aparece depois.',
      'A ordem é flor, fruto e sementes.',
      {
        tipo: 'ordenacao',
        cartoes: ['Sementes', 'Flor', 'Fruto'],
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao:
          'Três cartões visuais mostram flor, fruto e sementes em ordem misturada.',
      }
    ),
    unica(
      7,
      'O feijão',
      'Os feijões ficam:',
      ['dentro do fruto, a vagem.', 'dentro da raiz.', 'dentro do caule.'],
      'dentro do fruto, a vagem.',
      'Observe a vagem aberta e veja onde estão os feijões.',
      'Os feijões são sementes que ficam dentro da vagem.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Vagem aberta com feijões em desenho original.',
      }
    ),
    ditado(8, 'Ditado: uma parte da planta', 'RAIZ', 'palavra'),
    selecao(
      9,
      'O que a planta precisa?',
      'Marque tudo o que ajuda uma planta a crescer bem.',
      ['Água', 'Luz', 'Condições adequadas do ambiente', 'Refrigerante', 'Sal em excesso'],
      ['Água', 'Luz', 'Condições adequadas do ambiente'],
      'As quantidades variam, mas plantas precisam de condições adequadas, não de bebidas ou excesso de sal.',
      'Cada planta cresce melhor com água, luz e condições adequadas.',
      {
        ilustracaoLeitura: imagens.ambiente,
        descricaoIlustracao: 'Árvore e outros seres vivos em ambiente terrestre.',
      }
    ),
    q(
      10,
      'Árvore e fruto',
      'Ligue cada árvore ao fruto correspondente usando os botões.',
      [
        opcao('Mangabeira', frutos, 'Mangaba'),
        opcao('Muricizeiro', frutos, 'Murici'),
        opcao('Jatobazeiro', frutos, 'Jatobá'),
      ],
      'O nome de cada árvore se parece com o nome de seu fruto.',
      'Você ligou cada árvore ao fruto correspondente.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Conjunto original de frutos, sementes e alimentos de origem vegetal.',
      }
    ),
    unica(
      11,
      'Onde vivem essas árvores?',
      'Esse é um ambiente:',
      ['terrestre', 'aquático'],
      'terrestre',
      'A árvore está crescendo em terra firme.',
      'Terra firme é um ambiente terrestre.',
      {
        ilustracaoLeitura: imagens.ambiente,
        descricaoIlustracao: 'Árvore crescendo em terra firme.',
      }
    ),
    unica(
      12,
      'Quem precisa das plantas?',
      'Qual frase está correta?',
      [
        'Apenas os seres humanos precisam das plantas.',
        'Muitos animais e seres humanos utilizam plantas como alimento.',
        'Nenhum animal utiliza plantas como alimento.',
      ],
      'Muitos animais e seres humanos utilizam plantas como alimento.',
      'Observe o coelho, o passarinho e a pessoa na cena.',
      'Muitos animais e seres humanos usam plantas como alimento.',
      {
        ilustracaoLeitura: imagens.ambiente,
        descricaoIlustracao:
          'Coelho comendo folhas, passarinho com fruto e pessoa comendo uma fruta.',
      }
    ),
    q(
      13,
      'Partes das plantas que comemos',
      'Ligue cada alimento à parte da planta usando os botões.',
      [
        opcao('Cenoura', ['raiz', 'folha', 'fruto', 'semente'], 'raiz'),
        opcao('Alface', ['raiz', 'folha', 'fruto', 'semente'], 'folha'),
        opcao('Maçã', ['raiz', 'folha', 'fruto', 'semente'], 'fruto'),
        opcao('Feijão', ['raiz', 'folha', 'fruto', 'semente'], 'semente'),
      ],
      'Pense em qual parte da planta cada alimento representa.',
      'Cenoura é raiz, alface é folha, maçã é fruto e feijão é semente.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Cenoura, alface, maçã e feijão em desenhos originais.',
      }
    ),
    ditado(
      14,
      'Ditado: observe a ilustração',
      'FOLHA',
      'palavra',
      null,
      '../assets/objetos_escolares/science-leaf.svg',
      'Parte verde e achatada de uma planta, com nervuras e contorno bem definido.'
    ),
    unica(
      15,
      'As plantas ajudam o ambiente',
      'Qual cena mostra plantas ajudando a manter o solo no lugar?',
      ['Cena A — barranco com plantas e raízes', 'Cena B — solo sem vegetação na chuva'],
      'Cena A — barranco com plantas e raízes',
      'Observe em qual cena as raízes ajudam a segurar o solo.',
      'As raízes ajudam a manter o solo no lugar.',
      {
        ilustracaoLeitura: imagens.ambiente,
        descricaoIlustracao:
          'Cena A com barranco coberto por vegetação e raízes; cena B com solo levado pela chuva.',
      }
    ),
    unica(
      16,
      'Nossa principal luz durante o dia',
      'Quem ilumina naturalmente esse ambiente?',
      ['Sol', 'televisão', 'lanterna'],
      'Sol',
      'Procure a fonte natural de luz da paisagem diurna.',
      'O Sol ilumina naturalmente os ambientes durante o dia.',
      {
        ilustracaoLeitura: imagens.diaNoite,
        descricaoIlustracao: 'Paisagem diurna original iluminada pelo Sol.',
      }
    ),
    q(
      17,
      'Dia ou noite?',
      'Classifique cada cena como DIA ou NOITE.',
      [
        opcao('Cena iluminada pelo Sol', ['DIA', 'NOITE'], 'DIA'),
        opcao('Cena com céu escuro e estrelas', ['DIA', 'NOITE'], 'NOITE'),
      ],
      'Observe o Sol, a claridade, o céu escuro e as estrelas.',
      'A cena com Sol é DIA; a cena com céu escuro e estrelas é NOITE.',
      {
        ilustracaoLeitura: imagens.diaNoite,
        descricaoIlustracao: 'Cena clara com Sol e cena escura com Lua e estrelas.',
      }
    ),
    unica(
      18,
      'Amanheceu!',
      'Quando o Sol começa a iluminar o ambiente, estamos chegando ao:',
      ['amanhecer', 'meio da noite', 'inverno'],
      'amanhecer',
      'Pense no começo do dia.',
      'Quando o dia começa e a luz aparece, é o amanhecer.',
      {
        ilustracaoLeitura: imagens.diaNoite,
        descricaoIlustracao: 'Floresta original recebendo as primeiras luzes do amanhecer.',
      }
    ),
    unica(
      19,
      'Animais durante o dia',
      'Qual animal está realizando uma atividade durante o dia?',
      [
        'Passarinho procurando alimento sob a luz do Sol',
        'Coruja parada sob o céu estrelado',
        'Gatinho dormindo em uma toca escura',
      ],
      'Passarinho procurando alimento sob a luz do Sol',
      'Use a iluminação e a ação visível, não apenas o nome do animal.',
      'O passarinho procura alimento em uma cena iluminada pelo Sol.',
      {
        ilustracaoLeitura: imagens.diaNoite,
        descricaoIlustracao:
          'Passarinho procurando alimento ao Sol, coruja em noite estrelada e animal dormindo em local escuro.',
      }
    ),
    ditado(
      20,
      'Ditado: nossa estrela',
      'SOL',
      'palavra',
      { maiusculasObrigatorias: false },
      imagens.diaNoite,
      'Uma estrela brilhante iluminando uma paisagem durante o dia.'
    ),
    unica(
      21,
      'Animais mais ativos à noite',
      'Qual animal está mais ativo na cena noturna?',
      ['coruja', 'ave da cena ensolarada'],
      'coruja',
      'Observe qual animal aparece em ação no céu escuro e estrelado.',
      'A coruja está ativa na cena noturna.',
      {
        ilustracaoLeitura: imagens.diaNoite,
        descricaoIlustracao: 'Coruja em cena noturna e ave em cena ensolarada.',
      }
    ),
    unica(
      22,
      'O lagarto e o Sol',
      'Por que o lagarto fica exposto à luz do Sol?',
      ['Para se aquecer.', 'Para virar uma planta.', 'Para produzir chuva.'],
      'Para se aquecer.',
      'Pense no calor recebido pelo corpo do lagarto.',
      'O lagarto pode ficar ao Sol para se aquecer.',
      {
        ilustracaoLeitura: imagens.solVida,
        descricaoIlustracao: 'Lagarto recebendo luz e calor do Sol.',
      }
    ),
    unica(
      23,
      'Tartarugas e calor',
      'No exemplo estudado, o calor do Sol ajuda:',
      [
        'os ovos de tartaruga a se desenvolverem.',
        'os ovos a virarem pedras.',
        'a areia a congelar.',
      ],
      'os ovos de tartaruga a se desenvolverem.',
      'Observe os ovos enterrados na areia aquecida.',
      'Nesse exemplo, o calor ajuda os ovos de tartaruga a se desenvolverem.',
      {
        ilustracaoLeitura: imagens.solVida,
        descricaoIlustracao: 'Ovos de tartaruga enterrados em areia aquecida pelo Sol.',
      }
    ),
    unica(
      24,
      'Plantas e luz',
      'Qual situação ajuda a planta a produzir seu alimento?',
      ['receber luz adequada.', 'ficar sempre sem luz.'],
      'receber luz adequada.',
      'Compare a planta iluminada com a planta mantida no escuro.',
      'Receber luz adequada ajuda a planta a produzir seu alimento.',
      {
        ilustracaoLeitura: imagens.solVida,
        descricaoIlustracao:
          'Planta recebendo luz adequada e outra mantida em escuridão permanente.',
      }
    ),
    ditado(
      25,
      'Ditado: o que ilumina',
      'LUZ',
      'palavra',
      null,
      imagens.materiais,
      'Raios luminosos chegando a camisetas e materiais diferentes.'
    ),
    unica(
      26,
      'Luz e calor',
      'O Sol fornece para a Terra:',
      ['luz e calor.', 'gelo e neve o tempo todo.', 'apenas vento.'],
      'luz e calor.',
      'Pense no que ilumina e aquece o planeta.',
      'O Sol fornece luz e calor para a Terra.',
      {
        ilustracaoLeitura: imagens.solVida,
        descricaoIlustracao: 'Sol iluminando e aquecendo seres vivos.',
      }
    ),
    unica(
      27,
      'Claro ou escuro?',
      'Sob o mesmo Sol, qual tende a aquecer MAIS?',
      ['a escura', 'a clara'],
      'a escura',
      'Compare as duas camisetas sob a mesma luz.',
      'Superfícies escuras costumam absorver mais energia da luz e aquecer mais.',
      {
        ilustracaoLeitura: imagens.camisetas,
        descricaoIlustracao:
          'Camisetas idênticas, uma rotulada CLARA e outra ESCURA, sob o mesmo Sol.',
      }
    ),
    q(
      28,
      'O que acontece com a luz?',
      'Ligue cada material ao que acontece com a luz usando os botões.',
      [
        opcao(
          'Espelho',
          ['reflete muita luz', 'deixa a luz atravessar', 'absorve mais luz e aquece mais'],
          'reflete muita luz'
        ),
        opcao(
          'Vidro transparente',
          ['reflete muita luz', 'deixa a luz atravessar', 'absorve mais luz e aquece mais'],
          'deixa a luz atravessar'
        ),
        opcao(
          'Caixa preta',
          ['reflete muita luz', 'deixa a luz atravessar', 'absorve mais luz e aquece mais'],
          'absorve mais luz e aquece mais'
        ),
      ],
      'Pense em refletir, deixar atravessar e absorver mais.',
      'O espelho reflete, o vidro transparente deixa passar e a caixa preta absorve mais luz.',
      {
        ilustracaoLeitura: imagens.materiais,
        descricaoIlustracao:
          'Espelho refletindo luz, vidro transparente atravessado por luz e caixa preta aquecida.',
      }
    ),
    selecao(
      29,
      'Cuidados com o Sol',
      'Marque os bons cuidados quando ficamos ao ar livre em um dia de Sol forte.',
      [
        'Beber água',
        'Usar proteção adequada, como boné',
        'Usar protetor solar quando necessário',
        'Ficar muito tempo no Sol forte sem proteção',
        'Evitar beber água',
      ],
      ['Beber água', 'Usar proteção adequada, como boné', 'Usar protetor solar quando necessário'],
      'Escolha atitudes de hidratação e proteção.',
      'Beber água e usar proteção adequada são bons cuidados.',
      {
        ilustracaoLeitura: imagens.cuidados,
        descricaoIlustracao: 'Criança de boné bebendo água e frasco de proteção solar.',
      }
    ),
    ditado(30, 'Ditado final em frase', 'A LUZ DO SOL É IMPORTANTE PARA A VIDA.', 'frase', {
      fraseCompleta: true,
      maiusculasObrigatorias: true,
      acentuacaoObrigatoria: true,
    }),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'mariana-ciencias-plantas-sol-setembro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Ciências',
    titulo: 'Plantas, seres vivos e a luz do Sol',
    subtitulo: 'Partes das plantas, seres vivos, Sol, luz e calor',
    chave: 'revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você revisou as plantas, outros seres vivos e como a luz e o calor do Sol ajudam a vida. Cada questão vale um ponto: são 30 ao todo!',
    questoes: questoes,
  });
})();
