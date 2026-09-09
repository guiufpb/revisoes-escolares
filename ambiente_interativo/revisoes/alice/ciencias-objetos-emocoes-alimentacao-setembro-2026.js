(function () {
  'use strict';

  var imagens = {
    objetos: '../assets/objetos_escolares/science-alice-objetos.svg',
    propriedades: '../assets/objetos_escolares/science-alice-propriedades.svg',
    agua: '../assets/objetos_escolares/science-alice-agua-reciclagem.svg',
    emocoes: '../assets/objetos_escolares/science-alice-emocoes.svg',
    alimentos: '../assets/objetos_escolares/science-alice-alimentacao.svg',
  };

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function campo(pergunta, resposta, extras) {
    return Object.assign({ pergunta: pergunta, respostas: [resposta] }, extras || {});
  }

  function q(numero, titulo, instrucao, itens, dica, sucesso, extras) {
    var bloco =
      numero <= 13
        ? 'Objetos e materiais'
        : numero <= 21
          ? 'Sensações e emoções'
          : 'Boa alimentação';
    return Object.assign(
      {
        id: 'ciencias-objetos-emocoes-alimentacao-q' + String(numero).padStart(2, '0'),
        parte: numero <= 13 ? 'objetos' : numero <= 21 ? 'emocoes' : 'alimentacao',
        bloco: 'Ciências · ' + bloco,
        titulo: numero + '. ' + titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: sucesso,
        leitura: 'Observe a ilustração e leia as opções com calma antes de escolher.',
        leituraTitulo: 'Observe e pense',
        fonteEstudo: 'Síntese pedagógica de Ciências — atividade original.',
        opcoesReversiveis: true,
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

  function selecao(numero, titulo, opcoes, respostas, dica, sucesso, extras) {
    return q(
      numero,
      titulo,
      'Marque todas as respostas corretas.',
      [
        {
          tipo: 'selecao',
          pergunta: 'Marque as opções corretas.',
          opcoes: opcoes,
          respostas: respostas,
        },
      ],
      dica,
      sucesso,
      Object.assign({ tipo: 'selecao' }, extras || {})
    );
  }

  function ditado(numero, titulo, resposta, imagem, descricao) {
    return q(
      numero,
      titulo,
      'Ouça a palavra e escreva no campo vazio. Use Repetir quando precisar.',
      [campo('Escreva a palavra ouvida.', resposta, { maiusculasObrigatorias: true })],
      'Ouça novamente e confira cada letra antes de tentar outra vez.',
      'Você escreveu a palavra corretamente!',
      {
        bloco: 'Ciências · Ditado',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
        ilustracaoLeitura: imagem,
        descricaoIlustracao: descricao,
      }
    );
  }

  var questoes = [
    unica(
      1,
      'Garrafa plástica',
      'De que material esta garrafa é feita?',
      ['plástico', 'madeira', 'papel'],
      'plástico',
      'Observe o nome e o desenho da garrafa.',
      'A garrafa é feita de plástico.',
      {
        ilustracaoLeitura: imagens.objetos,
        descricaoIlustracao: 'Garrafa, panela, caderno e mesa em ilustração original.',
      }
    ),
    unica(
      2,
      'Panela',
      'Qual é o principal material desta panela?',
      ['metal', 'papel', 'pano'],
      'metal',
      'A panela é brilhante e resistente ao calor.',
      'A panela é feita principalmente de metal.',
      {
        ilustracaoLeitura: imagens.objetos,
        descricaoIlustracao: 'Panela de metal em ilustração original.',
      }
    ),
    unica(
      3,
      'Caderno',
      'Qual material aparece principalmente nas páginas?',
      ['papel', 'vidro', 'metal'],
      'papel',
      'Pense no material das folhas do caderno.',
      'As páginas do caderno são de papel.',
      {
        ilustracaoLeitura: imagens.objetos,
        descricaoIlustracao: 'Caderno aberto com páginas de papel.',
      }
    ),
    q(
      4,
      'Objetos e materiais',
      'Ligue cada objeto ao seu material usando os botões.',
      [
        opcao('Garrafa transparente', ['vidro', 'metal', 'papel', 'plástico'], 'vidro'),
        opcao('Lata', ['vidro', 'metal', 'papel', 'plástico'], 'metal'),
        opcao('Caderno', ['vidro', 'metal', 'papel', 'plástico'], 'papel'),
        opcao('Sacola', ['vidro', 'metal', 'papel', 'plástico'], 'plástico'),
      ],
      'Observe para que cada objeto é usado e de que parece ser feito.',
      'Você ligou cada objeto ao material correspondente.',
      {
        ilustracaoLeitura: imagens.objetos,
        descricaoIlustracao: 'Garrafa de vidro, lata, caderno e sacola plástica.',
      }
    ),
    unica(
      5,
      'Mesa',
      'A mesa da imagem é feita principalmente de:',
      ['madeira', 'vidro', 'papel'],
      'madeira',
      'A mesa tem aparência de madeira.',
      'A mesa é feita principalmente de madeira.',
      { ilustracaoLeitura: imagens.objetos, descricaoIlustracao: 'Mesa de madeira simples.' }
    ),
    q(
      6,
      'Duro ou macio',
      'Classifique cada objeto.',
      [opcao('Pedra', ['dura', 'macia'], 'dura'), opcao('Almofada', ['dura', 'macia'], 'macia')],
      'Pense no que acontece quando apertamos cada objeto.',
      'A pedra é dura e a almofada é macia.',
      {
        ilustracaoLeitura: imagens.propriedades,
        descricaoIlustracao: 'Pedra, almofada, pena e peso simples em desenho original.',
      }
    ),
    q(
      7,
      'Leve ou pesado',
      'Classifique cada objeto.',
      [opcao('Pena', ['leve', 'pesado'], 'leve'), opcao('Peso', ['leve', 'pesado'], 'pesado')],
      'Uma pena é fácil de levantar; o peso não.',
      'A pena é leve e o peso é pesado.',
      {
        ilustracaoLeitura: imagens.propriedades,
        descricaoIlustracao: 'Pena leve ao lado de um peso de academia.',
      }
    ),
    unica(
      8,
      'Ver através',
      'Qual material deixa a luz passar e permite ver através dele?',
      ['vidro transparente', 'madeira'],
      'vidro transparente',
      'Pense no material de uma janela transparente.',
      'O vidro transparente deixa a luz passar.',
      {
        ilustracaoLeitura: imagens.propriedades,
        descricaoIlustracao: 'Janela de vidro transparente e tábua de madeira.',
      }
    ),
    unica(
      9,
      'Cuidado ao cair',
      'Qual copo precisa de mais cuidado porque pode quebrar com facilidade?',
      ['copo de vidro', 'copo plástico'],
      'copo de vidro',
      'Um dos copos quebra mais facilmente quando cai.',
      'O copo de vidro precisa de mais cuidado.',
      {
        ilustracaoLeitura: imagens.propriedades,
        descricaoIlustracao: 'Copo de vidro e copo plástico infantil.',
      }
    ),
    q(
      10,
      'Flutua ou afunda',
      'Classifique cada objeto na água.',
      [
        opcao('Barquinho de papel', ['flutua', 'afunda'], 'flutua'),
        opcao('Pedra', ['flutua', 'afunda'], 'afunda'),
      ],
      'Observe onde cada objeto aparece no recipiente com água.',
      'O barquinho flutua e a pedra afunda.',
      {
        ilustracaoLeitura: imagens.agua,
        descricaoIlustracao: 'Barquinho de papel flutuando e pedra afundando em água.',
      }
    ),
    q(
      11,
      'Modelo de submarino',
      'Ligue cada situação ao resultado.',
      [
        opcao('Mais água dentro', ['afunda', 'flutua'], 'afunda'),
        opcao('Mais ar e menos água dentro', ['afunda', 'flutua'], 'flutua'),
      ],
      'Compare as duas cenas do modelo.',
      'Com mais água ele afunda; com mais ar e menos água ele flutua.',
      {
        ilustracaoLeitura: imagens.agua,
        descricaoIlustracao:
          'Duas cenas simples de modelo de submarino, uma afundando e outra flutuando.',
      }
    ),
    unica(
      12,
      'Cuidar da natureza',
      'Qual atitude ajuda a cuidar da natureza?',
      ['Colocar a garrafa no local adequado para descarte.', 'Jogar a garrafa no rio.'],
      'Colocar a garrafa no local adequado para descarte.',
      'Escolha a cena que evita sujeira na água.',
      'Colocar o material no local correto ajuda a cuidar da natureza.',
      {
        ilustracaoLeitura: imagens.agua,
        descricaoIlustracao: 'Garrafa no rio e garrafa colocada em local adequado para descarte.',
      }
    ),
    unica(
      13,
      'Usar de novo',
      'Usar uma garrafa novamente para fazer outro objeto é uma forma de:',
      ['reaproveitar', 'jogar no rio', 'desperdiçar'],
      'reaproveitar',
      'A garrafa ganhou uma nova função.',
      'Usar de novo é reaproveitar.',
      {
        ilustracaoLeitura: imagens.agua,
        descricaoIlustracao: 'Garrafa reutilizada como vaso de planta.',
      }
    ),
    unica(
      14,
      'Rosto feliz',
      'Como esta criança parece estar se sentindo?',
      ['feliz', 'triste', 'assustada'],
      'feliz',
      'Observe o sorriso e a expressão do rosto.',
      'A criança parece estar feliz.',
      {
        ilustracaoLeitura: imagens.emocoes,
        descricaoIlustracao: 'Rostos com expressões feliz, triste, brava e assustada.',
      }
    ),
    unica(
      15,
      'Rosto triste',
      'Qual sentimento combina com a expressão?',
      ['triste', 'feliz', 'calma'],
      'triste',
      'Observe os olhos e a boca do rosto.',
      'A expressão mostra tristeza.',
      { ilustracaoLeitura: imagens.emocoes, descricaoIlustracao: 'Rosto com expressão triste.' }
    ),
    unica(
      16,
      'Rosto bravo',
      'A criança parece estar:',
      ['brava', 'com sono', 'feliz'],
      'brava',
      'Observe as sobrancelhas e a boca.',
      'A criança parece estar brava.',
      {
        ilustracaoLeitura: imagens.emocoes,
        descricaoIlustracao: 'Rosto bravo, sem caricatura agressiva.',
      }
    ),
    unica(
      17,
      'Rosto assustado',
      'Qual sentimento aparece?',
      ['assustada', 'feliz', 'calma'],
      'assustada',
      'Observe os olhos bem abertos.',
      'A criança parece estar assustada.',
      { ilustracaoLeitura: imagens.emocoes, descricaoIlustracao: 'Rosto com expressão assustada.' }
    ),
    unica(
      18,
      'Um brinquedo quebrou',
      'O brinquedo de uma criança quebrou. Como ela pode se sentir?',
      ['triste', 'feliz'],
      'triste',
      'A pergunta diz pode: pessoas podem sentir coisas diferentes.',
      'Ela pode se sentir triste.',
      {
        ilustracaoLeitura: imagens.emocoes,
        descricaoIlustracao: 'Criança olhando um brinquedo quebrado.',
      }
    ),
    unica(
      19,
      'Ajudar um colega',
      'Um colega está triste. Qual atitude é mais gentil?',
      ['Oferecer ajuda ou convidá-lo para brincar.', 'Empurrá-lo.', 'Rir dele.'],
      'Oferecer ajuda ou convidá-lo para brincar.',
      'Pense em uma atitude respeitosa.',
      'Oferecer ajuda é uma atitude gentil.',
      {
        ilustracaoLeitura: imagens.emocoes,
        descricaoIlustracao: 'Duas crianças, uma acolhendo a outra.',
      }
    ),
    unica(
      20,
      'Resolver o problema',
      'Alice ficou brava porque alguém gritou com ela. O que pode ajudar?',
      ['conversar com calma', 'gritar mais', 'bater'],
      'conversar com calma',
      'Falar com respeito ajuda a resolver problemas.',
      'Conversar com calma pode ajudar.',
      {
        ilustracaoLeitura: imagens.emocoes,
        descricaoIlustracao: 'Duas crianças conversando com calma.',
      }
    ),
    ditado(
      21,
      'Ditado: uma emoção',
      'FELIZ',
      imagens.emocoes,
      'Rosto sorridente em ilustração original, sem mostrar a palavra ditada.'
    ),
    unica(
      22,
      'Lanche do dia a dia',
      'Qual é uma boa escolha para o lanche do dia a dia?',
      ['fruta', 'muitos doces'],
      'fruta',
      'Uma fruta é uma escolha simples e variada.',
      'A fruta é uma boa escolha para o lanche do dia a dia.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Fruta, doces, água e prato variado em ilustração original.',
      }
    ),
    selecao(
      23,
      'Frutas e verduras',
      ['maçã', 'cenoura', 'alface', 'pirulito'],
      ['maçã', 'cenoura', 'alface'],
      'Escolha os alimentos que vêm de frutas, legumes ou verduras.',
      'Maçã, cenoura e alface são boas escolhas aqui.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Maçã, cenoura, alface e pirulito.',
      }
    ),
    unica(
      24,
      'Quando temos sede',
      'Quando estamos com sede, uma boa escolha é:',
      ['beber água', 'comer papel', 'beber tinta'],
      'beber água',
      'Pense no que ajuda o corpo a matar a sede.',
      'Beber água é uma boa escolha quando temos sede.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Copo de água ao lado de uma criança.',
      }
    ),
    unica(
      25,
      'Prato variado',
      'Qual prato mostra uma alimentação mais variada?',
      ['Prato A', 'Prato B'],
      'Prato A',
      'Um prato tem alimentos diferentes; o outro tem somente doces.',
      'O prato A mostra mais variedade.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Prato A com alimentos variados e prato B com vários doces.',
      }
    ),
    unica(
      26,
      'Energia para brincar',
      'Os alimentos ajudam nosso corpo a ter:',
      ['energia para brincar e fazer atividades', 'asas', 'rodas'],
      'energia para brincar e fazer atividades',
      'Pense no que o corpo usa para fazer as atividades do dia.',
      'Os alimentos ajudam o corpo a ter energia.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Criança brincando depois de uma refeição variada.',
      }
    ),
    unica(
      27,
      'Crescer',
      'Uma boa alimentação ajuda o corpo a:',
      ['CRESCER', 'ENCOLHER'],
      'CRESCER',
      'Escolha a palavra que completa a frase.',
      'Uma boa alimentação ajuda o corpo a crescer.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Criança crescendo com cuidado e alimentação variada.',
      }
    ),
    unica(
      28,
      'Doces e dentes',
      'Qual atitude ajuda mais a cuidar dos dentes?',
      ['Não exagerar nos doces e cuidar dos dentes.', 'Comer doces o tempo todo.'],
      'Não exagerar nos doces e cuidar dos dentes.',
      'A ideia é consumir com moderação e cuidar dos dentes.',
      'Cuidar dos dentes também inclui não exagerar nos doces.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Criança escovando os dentes e doces consumidos sem exagero.',
      }
    ),
    selecao(
      29,
      'Montando um lanche',
      ['água', 'banana', 'sanduíche simples', 'vários pirulitos', 'vários donuts'],
      ['água', 'banana', 'sanduíche simples'],
      'Escolha três itens diferentes para o lanche.',
      'Água, banana e sanduíche simples formam o lanche combinado.',
      {
        ilustracaoLeitura: imagens.alimentos,
        descricaoIlustracao: 'Água, banana, sanduíche simples, pirulitos e donuts.',
      }
    ),
    ditado(
      30,
      'Ditado final',
      'SAÚDE',
      imagens.alimentos,
      'Alimentos variados, água e sorriso em ilustração original, sem mostrar a palavra ditada.'
    ),
  ];

  window.QuestionariosRevisoes.registrar({
    id: 'alice-ciencias-objetos-emocoes-alimentacao-setembro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'Ciências',
    titulo: 'Objetos, emoções e alimentação',
    subtitulo: 'Materiais, sentimentos e escolhas saudáveis',
    chave: 'revisoesEscolares.alice.ciencias.objetosEmocoesAlimentacaoSetembro2026.v1',
    validacaoEstritaEstado: true,
    layout: { desktopAmplo: true },
    resumoFinal:
      'Muito bem! Cuidar do corpo, dos sentimentos e do ambiente também faz parte de aprender Ciências. Cada questão vale um ponto: são 30 ao todo!',
    questoes: questoes,
  });
})();
