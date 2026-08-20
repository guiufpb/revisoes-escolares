(function () {
  'use strict';

  var REVISAO_ID = 'mariana-gramatica-revisao-ampla';
  var CHAVE = 'revisoesEscolares.mariana.gramatica.revisaoAmpla.v1';
  var TOTAL_QUESTOES = 40;
  var estado;
  var armazenamento;
  var conteudo;

  function alternativa(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function campo(pergunta, respostas, fraseCompleta) {
    return {
      pergunta: pergunta,
      respostas: Array.isArray(respostas) ? respostas : [respostas],
      fraseCompleta: Boolean(fraseCompleta),
    };
  }

  function questao(id, bloco, titulo, instrucao, tipo, itens, dica, sucesso, ditado) {
    return {
      id: id,
      bloco: bloco,
      titulo: titulo,
      instrucao: instrucao,
      tipo: tipo,
      itens: itens,
      dica: dica,
      sucesso: sucesso,
      ditado: Boolean(ditado),
    };
  }

  var questoes = [
    questao(
      'q01',
      'M e N no final',
      'Complete com M ou N',
      'Digite somente a letra que completa cada palavra.',
      'campos',
      [campo('capi_', 'm'), campo('també_', 'm'), campo('home_', 'm'), campo('póle_', 'n')],
      'Na maioria das palavras usamos M no final. Pólen é uma das poucas exceções.',
      'Muito bem! Você observou a regra geral e a exceção.'
    ),
    questao(
      'q02',
      'M e N no final',
      'Mais palavras com M ou N',
      'Complete cada palavra com a letra final adequada.',
      'campos',
      [campo('nuvé_', 'm'), campo('orde_', 'm'), campo('hífe_', 'n'), campo('jardi_', 'm')],
      'Nuvem, ordem e jardim terminam com M. Hífen é uma exceção escrita com N.',
      'Ótimo trabalho com as terminações!'
    ),
    questao(
      'q03',
      'M e N no final',
      'Escolha a escrita correta',
      'Clique na palavra escrita corretamente em cada linha.',
      'opcoes',
      [
        alternativa('A sobremesa é um...', ['pudim', 'pudin'], 'pudim'),
        alternativa('No céu apareceu uma...', ['nuvem', 'nuven'], 'nuvem'),
        alternativa('A flor produz...', ['pólem', 'pólen'], 'pólen'),
        alternativa('O doce redondo é um...', ['bombom', 'bombon'], 'bombom'),
      ],
      'Leia a palavra inteira e lembre que M é a terminação mais comum.',
      'Você escolheu todas as grafias corretas!'
    ),
    questao(
      'q04',
      'M e N no final',
      'Encontre a exceção',
      'Em cada grupo, marque a palavra que termina com N.',
      'opcoes',
      [
        alternativa('Grupo 1', ['capim', 'pólen', 'batom'], 'pólen'),
        alternativa('Grupo 2', ['hífen', 'bombom', 'jovem'], 'hífen'),
      ],
      'As exceções estudadas no caderno são poucas: observe pólen e hífen.',
      'Você encontrou as palavras que fogem da regra geral!'
    ),
    questao(
      'q05',
      'M e N no final',
      'Palavras do texto',
      'Complete com uma palavra do texto “A comida de cada um”.',
      'campos',
      [
        campo('O macaco come...', ['amendoim']),
        campo('O burro come...', ['capim']),
        campo('Eu quero comer...', ['pudim']),
        campo('Cada um come o que...', ['tem']),
      ],
      'As quatro palavras terminam com M.',
      'Você relembrou as palavras principais do texto!',
      true
    ),
    questao(
      'q06',
      'M e N no final',
      'O que diz a regra?',
      'Escolha a resposta correta.',
      'opcoes',
      [
        alternativa(
          'No final das palavras, qual letra usamos na maioria dos casos?',
          ['M', 'N', 'As duas sempre'],
          'M'
        ),
        alternativa(
          'Qual afirmação combina com o caderno?',
          ['Nunca usamos N.', 'Usamos N em poucos casos.', 'Toda palavra termina com N.'],
          'Usamos N em poucos casos.'
        ),
      ],
      'A regra principal é usar M; algumas palavras são exceções com N.',
      'Você compreendeu a regra estudada!'
    ),
    questao(
      'q07',
      'M e N no final',
      'Complete as frases',
      'Digite a palavra completa que falta.',
      'campos',
      [
        campo('O céu ficou coberto por uma ____.', 'nuvem'),
        campo('O canteiro tem um lindo ____.', 'jardim'),
        campo('A professora organizou a fila em ____.', 'ordem'),
        campo('A abelha levou ____ da flor.', 'pólen'),
      ],
      'Observe o sentido da frase e depois confira a letra final da palavra.',
      'Todas as frases ficaram completas!',
      true
    ),
    questao(
      'q08',
      'M e N no final',
      'Duplas bem escritas',
      'Marque a dupla em que as duas palavras estão corretas.',
      'opcoes',
      [
        alternativa('Dupla 1', ['homem e item', 'homen e iten'], 'homem e item'),
        alternativa('Dupla 2', ['capin e batom', 'capim e batom'], 'capim e batom'),
        alternativa('Dupla 3', ['hífen e pólen', 'hífem e pólem'], 'hífen e pólen'),
      ],
      'Leia cada dupla devagar. M é a regra geral; hífen e pólen são exceções.',
      'Você terminou o bloco de M e N!'
    ),
    questao(
      'q09',
      'Ponto de interrogação',
      'Declarativa ou interrogativa?',
      'Classifique cada frase.',
      'opcoes',
      [
        alternativa('O vento está forte.', ['Declarativa', 'Interrogativa'], 'Declarativa'),
        alternativa('O vento está forte?', ['Declarativa', 'Interrogativa'], 'Interrogativa'),
        alternativa('Mônica fechou a janela?', ['Declarativa', 'Interrogativa'], 'Interrogativa'),
        alternativa('Mônica fechou a janela.', ['Declarativa', 'Interrogativa'], 'Declarativa'),
      ],
      'A interrogativa faz uma pergunta e termina com ?. A declarativa informa algo e termina com ponto-final.',
      'Você diferenciou afirmações e perguntas!'
    ),
    questao(
      'q10',
      'Ponto de interrogação',
      'Que tipo de frase é?',
      'Classifique observando o sentido e o sinal final.',
      'opcoes',
      [
        alternativa('Hoje é domingo.', ['Declarativa', 'Interrogativa'], 'Declarativa'),
        alternativa('Que dia é hoje?', ['Declarativa', 'Interrogativa'], 'Interrogativa'),
        alternativa('Esse menino é meu irmão.', ['Declarativa', 'Interrogativa'], 'Declarativa'),
        alternativa('Quem é esse menino?', ['Declarativa', 'Interrogativa'], 'Interrogativa'),
      ],
      'Perguntas costumam pedir uma resposta e recebem o sinal ?.',
      'Classificação completa!'
    ),
    questao(
      'q11',
      'Ponto de interrogação',
      'Ponto-final ou interrogação?',
      'Digite somente . ou ? no final de cada frase.',
      'campos',
      [
        campo('Você gosta de brincar', '?'),
        campo('A festa será amanhã', '.'),
        campo('Onde está meu lápis', '?'),
        campo('A aula começou', '.'),
        campo('Que horas são', '?'),
      ],
      'Pergunta recebe ?. Informação recebe ponto-final.',
      'Cada frase recebeu o sinal adequado!'
    ),
    questao(
      'q12',
      'Ponto de interrogação',
      'Complete o diálogo',
      'Digite somente . ou ?.',
      'campos',
      [
        campo('Você já chorou de felicidade', '?'),
        campo('Isso pode acontecer', '.'),
        campo('Sabe por quê', '?'),
        campo('O choro ajuda o corpo a relaxar', '.'),
        campo('Quando isso aconteceu', '?'),
      ],
      'Leia como se duas pessoas estivessem conversando: uma pergunta e a outra explica.',
      'O diálogo ficou bem pontuado!'
    ),
    questao(
      'q13',
      'Ponto de interrogação',
      'Qual frase faz uma pergunta?',
      'Escolha a interrogativa de cada par.',
      'opcoes',
      [
        alternativa('Par 1', ['Beto saiu da sala.', 'Beto saiu da sala?'], 'Beto saiu da sala?'),
        alternativa(
          'Par 2',
          ['A professora chegou?', 'A professora chegou.'],
          'A professora chegou?'
        ),
        alternativa('Par 3', ['Está chovendo.', 'Está chovendo?'], 'Está chovendo?'),
      ],
      'A frase interrogativa termina com ponto de interrogação.',
      'Você encontrou todas as perguntas!'
    ),
    questao(
      'q14',
      'Ponto de interrogação',
      'Transforme em pergunta',
      'Troque o ponto-final por ? e digite a frase completa.',
      'campos',
      [
        campo('Beto saiu da sala.', 'Beto saiu da sala?', true),
        campo('Agora é minha vez.', 'Agora é minha vez?', true),
        campo('A professora chegou.', 'A professora chegou?', true),
        campo('Está chovendo.', 'Está chovendo?', true),
      ],
      'Mantenha as palavras e troque apenas o sinal final.',
      'As frases declarativas viraram perguntas!'
    ),
    questao(
      'q15',
      'Ponto de interrogação',
      'Perguntas para as respostas',
      'Escolha a pergunta que combina com cada resposta.',
      'opcoes',
      [
        alternativa(
          'Resposta: São dez horas.',
          ['Que horas são?', 'Onde você mora?'],
          'Que horas são?'
        ),
        alternativa(
          'Resposta: Hoje é domingo.',
          ['Que dia é hoje?', 'Quem é ele?'],
          'Que dia é hoje?'
        ),
        alternativa(
          'Resposta: Moro nessa casa.',
          ['Onde você mora?', 'Você está com fome?'],
          'Onde você mora?'
        ),
        alternativa(
          'Resposta: Esse menino é meu irmão.',
          ['Quem é ele?', 'Que horas são?'],
          'Quem é ele?'
        ),
      ],
      'A pergunta precisa pedir exatamente a informação mostrada na resposta.',
      'Cada resposta encontrou sua pergunta!'
    ),
    questao(
      'q16',
      'Ponto de interrogação',
      'Um pequeno cartaz',
      'Complete com ponto-final ou ponto de interrogação.',
      'campos',
      [
        campo('Você gosta de ler', '?'),
        campo('A biblioteca abre às oito horas', '.'),
        campo('Há livros de aventura', '.'),
        campo('Qual história você escolherá', '?'),
        campo('A leitura começa hoje', '.'),
      ],
      'Descubra se cada frase pergunta ou apenas informa.',
      'O cartaz está pronto e bem pontuado!'
    ),
    questao(
      'q17',
      'ZA, ZE, ZI, ZO, ZU',
      'Complete com a sílaba certa',
      'Use za, ze, zi, zo ou zu.',
      'campos',
      [
        campo('gentile__', 'za'),
        campo('bele__', 'za'),
        campo('__bra', 'ze'),
        campo('bu__na', 'zi'),
        campo('__ro', 'ze'),
      ],
      'Leia a palavra em voz baixa e perceba qual sílaba está faltando.',
      'Você completou as palavras com Z!'
    ),
    questao(
      'q18',
      'ZA, ZE, ZI, ZO, ZU',
      'Mais palavras com Z',
      'Complete usando za, ze, zi, zo ou zu.',
      'campos',
      [
        campo('bati__do', 'za'),
        campo('a__lejo', 'zu'),
        campo('limpe__', 'za'),
        campo('juí__', 'zo'),
        campo('__ro', 'ze'),
      ],
      'A sílaba pode aparecer no começo, no meio ou no fim da palavra.',
      'Excelente leitura das sílabas!'
    ),
    questao(
      'q19',
      'ZA, ZE, ZI, ZO, ZU',
      'Qual sílaba falta?',
      'Escolha a sílaba que forma a palavra.',
      'opcoes',
      [
        alternativa('ami__de', ['za', 'ze', 'zi', 'zo', 'zu'], 'za'),
        alternativa('__lador', ['za', 'ze', 'zi', 'zo', 'zu'], 'ze'),
        alternativa('__gue-zague', ['za', 'ze', 'zi', 'zo', 'zu'], 'zi'),
        alternativa('__nzo', ['za', 'ze', 'zi', 'zo', 'zu'], 'zo'),
        alternativa('__m-zum', ['za', 'ze', 'zi', 'zo', 'zu'], 'zu'),
      ],
      'Fale a palavra completa para ouvir a sílaba que se encaixa.',
      'Você usou as cinco sílabas!'
    ),
    questao(
      'q20',
      'ZA, ZE, ZI, ZO, ZU',
      'Números com Z',
      'Complete a palavra com za, ze, zi, zo ou zu.',
      'campos',
      [
        campo('de__nove', 'ze'),
        campo('du__ntos', 'ze'),
        campo('tre__', 'ze'),
        campo('do__', 'ze'),
        campo('de__ito', 'zo'),
      ],
      'Quatro palavras usam ZE. Dezoito usa ZO.',
      'Os números ficaram completos!'
    ),
    questao(
      'q21',
      'ZA, ZE, ZI, ZO, ZU',
      'Escolha a palavra correta',
      'Marque a escrita que forma uma palavra conhecida.',
      'opcoes',
      [
        alternativa(
          'Uma qualidade de quem trata bem os outros',
          ['gentileza', 'gentilezo'],
          'gentileza'
        ),
        alternativa('Quem cuida da limpeza do prédio', ['zilador', 'zelador'], 'zelador'),
        alternativa(
          'Movimento de um lado para o outro',
          ['zigue-zague', 'zogue-zague'],
          'zigue-zague'
        ),
        alternativa('Revestimento usado em paredes', ['azulejo', 'azilejo'], 'azulejo'),
      ],
      'Use o sentido da explicação e leia as duas opções.',
      'Você reconheceu todas as palavras!'
    ),
    questao(
      'q22',
      'ZA, ZE, ZI, ZO, ZU',
      'Forme a palavra inteira',
      'Digite a palavra completa indicada pela pista.',
      'campos',
      [
        campo('Qualidade do que é belo', 'beleza'),
        campo('Ato de deixar limpo', 'limpeza'),
        campo('Animal listrado', 'zebra'),
        campo('Objeto sonoro de um veículo', 'buzina'),
      ],
      'Todas as respostas contêm uma das sílabas ZA, ZE, ZI, ZO ou ZU.',
      'Palavras formadas com atenção!',
      true
    ),
    questao(
      'q23',
      'Número de sílabas',
      'Conte as sílabas',
      'Escolha quantas sílabas há em cada palavra.',
      'opcoes',
      [
        alternativa('tosse', ['1', '2', '3', '4'], '2'),
        alternativa('passagem', ['1', '2', '3', '4'], '3'),
        alternativa('assobiar', ['1', '2', '3', '4'], '4'),
        alternativa('osso', ['1', '2', '3', '4'], '2'),
      ],
      'Fale devagar: tos-se, pas-sa-gem, as-so-bi-ar, os-so.',
      'Você contou cada pedacinho falado!'
    ),
    questao(
      'q24',
      'Número de sílabas',
      'Conte outras palavras',
      'Escolha o número correto.',
      'opcoes',
      [
        alternativa('pássaro', ['2', '3', '4', '5'], '3'),
        alternativa('amizade', ['2', '3', '4', '5'], '4'),
        alternativa('zagueiro', ['2', '3', '4', '5'], '3'),
        alternativa('buzina', ['2', '3', '4', '5'], '3'),
      ],
      'Bata palmas para cada parte: pás-sa-ro; a-mi-za-de; za-guei-ro; bu-zi-na.',
      'Contagem concluída!'
    ),
    questao(
      'q25',
      'Número de sílabas',
      'Palavras do cotidiano',
      'Digite somente o número de sílabas.',
      'campos',
      [
        campo('nuvem', '2'),
        campo('jardim', '2'),
        campo('amendoim', '3'),
        campo('bombom', '2'),
        campo('gentileza', '4'),
      ],
      'Pronuncie sem correr e conte cada impulso de voz.',
      'Você contou as sílabas com cuidado!'
    ),
    questao(
      'q26',
      'Número de sílabas',
      'Compare os tamanhos',
      'Escolha a contagem correta.',
      'opcoes',
      [
        alternativa('Qual palavra tem 4 sílabas?', ['beleza', 'limpeza', 'amizade'], 'amizade'),
        alternativa('Qual palavra tem 2 sílabas?', ['pólen', 'buzina', 'gentileza'], 'pólen'),
        alternativa('Qual palavra tem 3 sílabas?', ['hífen', 'passagem', 'assobiar'], 'passagem'),
      ],
      'Separe oralmente cada opção antes de escolher.',
      'Você comparou as palavras pelas sílabas!'
    ),
    questao(
      'q27',
      'Ponto de exclamação',
      'Complete as falas fortes',
      'Digite somente o ponto de exclamação.',
      'campos',
      [
        campo('Assim não dá', '!'),
        campo('Você é muito devagar', '!'),
        campo('Devagar é você', '!'),
        campo('Pare agora', '!'),
        campo('Estou muito irritado', '!'),
      ],
      'Raiva, irritação e impaciência podem ser marcadas com !.',
      'As falas fortes receberam exclamação!'
    ),
    questao(
      'q28',
      'Ponto de exclamação',
      'Declarativa ou exclamativa?',
      'Classifique cada frase.',
      'opcoes',
      [
        alternativa('O dia está bonito.', ['Declarativa', 'Exclamativa'], 'Declarativa'),
        alternativa('Que belo dia de sol!', ['Declarativa', 'Exclamativa'], 'Exclamativa'),
        alternativa('A comida está pronta.', ['Declarativa', 'Exclamativa'], 'Declarativa'),
        alternativa('Que delícia!', ['Declarativa', 'Exclamativa'], 'Exclamativa'),
      ],
      'A exclamativa expressa um sentimento forte e termina com !.',
      'Você reconheceu as frases exclamativas!'
    ),
    questao(
      'q29',
      'Ponto de exclamação',
      'Escolha entre três sinais',
      'Digite somente ., ? ou !.',
      'campos',
      [
        campo('Você gosta de se divertir', '?'),
        campo('Então venha à nossa festa', '!'),
        campo('A festa será amanhã', '.'),
        campo('Onde será a festa', '?'),
        campo('Não perca', '!'),
      ],
      'Pergunta: ?. Informação: ponto-final. Convite ou emoção forte: !.',
      'Você escolheu entre os três sinais!'
    ),
    questao(
      'q30',
      'Ponto de exclamação',
      'Raiva e impaciência',
      'Escolha o sinal mais adequado para cada situação.',
      'opcoes',
      [
        alternativa('Uma personagem grita: “Saia daqui__”', ['.', '?', '!'], '!'),
        alternativa('Alguém pergunta com calma: “Você vem__”', ['.', '?', '!'], '?'),
        alternativa('O narrador informa: “A porta fechou__”', ['.', '?', '!'], '.'),
        alternativa('Uma personagem reclama: “Chega de barulho__”', ['.', '?', '!'], '!'),
      ],
      'Observe a intenção: grito e reclamação usam !; pergunta usa ?; informação usa ponto-final.',
      'Você percebeu a emoção de cada fala!'
    ),
    questao(
      'q31',
      'Ponto de exclamação',
      'Quando o personagem grita',
      'Marque a frase que representa melhor um grito de raiva.',
      'opcoes',
      [
        alternativa(
          'Qual fala mostra um grito?',
          ['Fale mais baixo.', 'FALE MAIS BAIXO!', 'Você pode falar mais baixo?'],
          'FALE MAIS BAIXO!'
        ),
        alternativa(
          'Qual fala mostra impaciência?',
          ['Espere um pouco.', 'Você pode esperar?', 'NÃO QUERO ESPERAR!'],
          'NÃO QUERO ESPERAR!'
        ),
      ],
      'Letras maiúsculas e ! podem mostrar que a personagem está gritando.',
      'Você identificou os gritos sem dificuldade!'
    ),
    questao(
      'q32',
      'Transformação de frases',
      'Transforme em exclamativa',
      'Digite a nova frase no teclado. Comece com “Que” e termine com !.',
      'campos',
      [campo('Esse homem é forte.', ['Que homem forte!'], true)],
      'Retire “esse” e “é”, comece com Que e termine com ponto de exclamação.',
      'Você transformou a afirmação em exclamação!'
    ),
    questao(
      'q33',
      'Transformação de frases',
      'Transforme em exclamativa',
      'Digite a nova frase no teclado. Comece com “Que” e termine com !.',
      'campos',
      [campo('O dia está quente.', ['Que dia quente!'], true)],
      'Retire “o” e “está”, comece com Que e use ! no final.',
      'A frase agora expressa uma sensação forte!'
    ),
    questao(
      'q34',
      'Transformação de frases',
      'Transforme em exclamativa',
      'Digite a nova frase no teclado. Comece com “Que” e termine com !.',
      'campos',
      [campo('Essa roupa é bonita.', ['Que roupa bonita!'], true)],
      'Retire “essa” e “é”, comece com Que e termine com !.',
      'Muito bem! A frase ficou exclamativa.'
    ),
    questao(
      'q35',
      'S e SS',
      'Complete com S ou SS',
      'Digite somente s ou ss.',
      'campos',
      [
        campo('_alada', 's'),
        campo('depre__a', 'ss'),
        campo('_emana', 's'),
        campo('trave__eiro', 'ss'),
        campo('_ilêncio', 's'),
      ],
      'No começo usamos S. Entre vogais, o som forte estudado é escrito com SS.',
      'Você aplicou a regra inicial de S e SS!'
    ),
    questao(
      'q36',
      'S e SS',
      'Mais palavras com S ou SS',
      'Complete cada palavra.',
      'campos',
      [
        campo('_ono', 's'),
        campo('va__oura', 'ss'),
        campo('_ubir', 's'),
        campo('a__inatura', 'ss'),
        campo('a__unto', 'ss'),
      ],
      'Veja a posição do espaço: início da palavra pede S; entre vogais pode pedir SS.',
      'Todas as palavras ficaram corretas!'
    ),
    questao(
      'q37',
      'S e SS',
      'O som forte entre vogais',
      'Complete todas as palavras com ss.',
      'campos',
      [
        campo('ama__ado', 'ss'),
        campo('pa__ado', 'ss'),
        campo('pa__eio', 'ss'),
        campo('pe__oa', 'ss'),
        campo('cla__e', 'ss'),
        campo('so__egado', 'ss'),
      ],
      'O espaço aparece entre vogais e o som continua forte: use SS.',
      'Você completou o grupo inteiro com SS!'
    ),
    questao(
      'q38',
      'S e SS',
      'Escolha a escrita correta',
      'Marque a palavra bem escrita.',
      'opcoes',
      [
        alternativa('Aparece no céu', ['passarinho', 'pasarinho'], 'passarinho'),
        alternativa('Animal que pula', ['sapinho', 'ssapinho'], 'sapinho'),
        alternativa('Usamos para varrer', ['vasoura', 'vassoura'], 'vassoura'),
        alternativa('Lugar em que estudamos', ['clase', 'classe'], 'classe'),
      ],
      'Nunca começamos uma palavra com SS. Entre vogais, o som forte pode usar SS.',
      'Você escolheu as grafias corretas!'
    ),
    questao(
      'q39',
      'S e SS',
      'Entenda a regra estudada',
      'Escolha a resposta correta.',
      'opcoes',
      [
        alternativa('Podemos começar uma palavra com SS?', ['Sim', 'Não'], 'Não'),
        alternativa(
          'Em “passarinho”, por que usamos SS?',
          ['Porque está no começo.', 'Porque fica entre vogais e mantém o som forte.'],
          'Porque fica entre vogais e mantém o som forte.'
        ),
        alternativa(
          'O S de “sapinho” tem o mesmo som forte do SS de “passarinho”?',
          ['Sim', 'Não'],
          'Sim'
        ),
      ],
      'Compare sapinho e passarinho, como no caderno.',
      'Você entendeu a regra introdutória!'
    ),
    questao(
      'q40',
      'S e SS',
      'Desafio final',
      'Complete com s ou ss e termine a revisão.',
      'campos',
      [
        campo('_elo', 's'),
        campo('_opa', 's'),
        campo('ma__a', 'ss'),
        campo('pa__o', 'ss'),
        campo('_uco', 's'),
        campo('o__o', 'ss'),
      ],
      'S pode iniciar selo, sopa e suco. SS aparece entre as vogais de massa, passo e osso.',
      'Parabéns! Você concluiu as 40 questões de Gramática!'
    ),
  ];

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function estadoInicial() {
    return {
      questaoAtual: 0,
      respostas: {},
      corrigidas: {},
      pontuadas: {},
      pontos: 0,
      finalizada: false,
    };
  }

  function normalizarEstado(valor, base) {
    valor = objeto(valor);
    base.questaoAtual = Math.max(
      0,
      Math.min(TOTAL_QUESTOES - 1, Math.trunc(Number(valor.questaoAtual) || 0))
    );
    base.respostas = objeto(valor.respostas);
    base.corrigidas = {};
    base.pontuadas = {};
    questoes.forEach(function (item) {
      if (objeto(valor.corrigidas)[item.id]) base.corrigidas[item.id] = true;
      if (objeto(valor.pontuadas)[item.id]) base.pontuadas[item.id] = true;
    });
    base.pontos = Object.keys(base.pontuadas).length;
    base.finalizada =
      Boolean(valor.finalizada) && Object.keys(base.corrigidas).length === TOTAL_QUESTOES;
    return base;
  }

  function obterArmazenamento() {
    if (!armazenamento) {
      armazenamento = window.ArmazenamentoRevisoes.criar({
        chave: CHAVE,
        padrao: estadoInicial(),
        normalizar: normalizarEstado,
      });
    }
    return armazenamento;
  }

  function emitirProgresso() {
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', { detail: { revisaoId: REVISAO_ID } })
    );
  }

  function salvar() {
    estado.pontos = Object.keys(estado.pontuadas).length;
    estado = obterArmazenamento().salvar(estado);
    emitirProgresso();
  }

  function normalizarResposta(valor) {
    return String(valor == null ? '' : valor)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+([.!?])/g, '$1')
      .replace(/\s+/g, ' ');
  }

  function respostaCorreta(valor, respostasAceitas) {
    var normalizada = normalizarResposta(valor);
    return respostasAceitas.some(function (resposta) {
      return normalizarResposta(resposta) === normalizada;
    });
  }

  function escapar(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function respostasDaQuestao(item) {
    var respostas = estado.respostas[item.id];
    return Array.isArray(respostas) ? respostas.slice(0, item.itens.length) : [];
  }

  function montarCampos(item, respostas) {
    return (
      '<div class="lista-campos-mariana">' +
      item.itens
        .map(function (subitem, indice) {
          var idCampo = 'gramatica-resposta-' + item.id + '-' + indice;
          if (item.ditado) {
            return (
              '<div class="campo-mariana campo-mariana-ditado"><label for="' +
              escapar(idCampo) +
              '"><span>' +
              escapar(subitem.pergunta) +
              '</span></label><div class="campo-resposta-ditado"><input id="' +
              escapar(idCampo) +
              '" type="text" data-resposta-gramatica="' +
              indice +
              '" value="' +
              escapar(respostas[indice] || '') +
              '" autocomplete="off" autocapitalize="sentences">' +
              window.GramaticaDitado.botaoHtml(indice) +
              '</div></div>'
            );
          }
          return (
            '<label class="campo-mariana' +
            (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
            '"><span>' +
            escapar(subitem.pergunta) +
            '</span><input type="text" data-resposta-gramatica="' +
            indice +
            '" value="' +
            escapar(respostas[indice] || '') +
            '" autocomplete="off" autocapitalize="sentences"></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function montarOpcoes(item, respostas) {
    return item.itens
      .map(function (subitem, indice) {
        return (
          '<fieldset class="questao-mariana" data-item-gramatica="' +
          indice +
          '"><legend>' +
          escapar(subitem.pergunta) +
          '</legend><div class="opcoes-mariana">' +
          subitem.opcoes
            .map(function (opcao) {
              var selecionada = respostas[indice] === opcao;
              return (
                '<button type="button" class="opcao-mariana' +
                (selecionada ? ' selecionada' : '') +
                '" data-opcao-gramatica="' +
                escapar(opcao) +
                '" aria-pressed="' +
                String(selecionada) +
                '">' +
                escapar(opcao) +
                '</button>'
              );
            })
            .join('') +
          '</div></fieldset>'
        );
      })
      .join('');
  }

  function atualizarNavegacao() {
    var indice = estado.questaoAtual;
    var item = questoes[indice];
    var finalizada = estado.finalizada;
    document.getElementById('gramatica-contador').textContent = finalizada
      ? '40 questões concluídas'
      : 'Questão ' + (indice + 1) + ' de ' + TOTAL_QUESTOES;
    document.getElementById('gramatica-pontos').textContent =
      estado.pontos + ' de ' + TOTAL_QUESTOES;
    document.getElementById('gramatica-barra').style.width =
      ((finalizada ? TOTAL_QUESTOES : indice + 1) / TOTAL_QUESTOES) * 100 + '%';
    document
      .getElementById('gramatica-progresso')
      .setAttribute('aria-valuenow', finalizada ? TOTAL_QUESTOES : indice + 1);
    document.getElementById('gramatica-voltar').disabled = !finalizada && indice === 0;
    var proxima = document.getElementById('gramatica-proxima');
    proxima.hidden = finalizada;
    proxima.disabled = !estado.corrigidas[item.id];
    proxima.textContent = indice === TOTAL_QUESTOES - 1 ? 'Concluir revisão →' : 'Próxima →';
  }

  function anunciar(item, mensagem, sucesso) {
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className =
      'retorno retorno-mariana retorno-gramatica ' + (sucesso ? 'sucesso' : 'tente-novamente');
    retorno.textContent = mensagem || item.dica;
  }

  function invalidarCorrecao(item) {
    if (estado.corrigidas[item.id]) delete estado.corrigidas[item.id];
    conteudo.querySelectorAll('.campo-correto, .campo-incorreto').forEach(function (elemento) {
      elemento.classList.remove('campo-correto', 'campo-incorreto');
    });
    conteudo.querySelectorAll('.correta, .incorreta').forEach(function (elemento) {
      elemento.classList.remove('correta', 'incorreta');
    });
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className = 'retorno retorno-mariana retorno-gramatica';
    retorno.textContent = '';
    salvar();
    atualizarNavegacao();
  }

  function configurarInteracoes(item) {
    if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input) {
        input.addEventListener('input', function () {
          var respostas = respostasDaQuestao(item);
          respostas[Number(input.dataset.respostaGramatica)] = input.value;
          estado.respostas[item.id] = respostas;
          invalidarCorrecao(item);
        });
      });
    } else {
      conteudo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
        botao.addEventListener('click', function () {
          var grupo = botao.closest('[data-item-gramatica]');
          var indice = Number(grupo.dataset.itemGramatica);
          var respostas = respostasDaQuestao(item);
          respostas[indice] = botao.dataset.opcaoGramatica;
          estado.respostas[item.id] = respostas;
          grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (outra) {
            var selecionada = outra === botao;
            outra.classList.toggle('selecionada', selecionada);
            outra.setAttribute('aria-pressed', String(selecionada));
          });
          invalidarCorrecao(item);
        });
      });
    }
    window.GramaticaDitado.configurar(conteudo, item);

    conteudo.querySelector('[data-conferir-gramatica]').addEventListener('click', function () {
      conferir(item);
    });
  }

  function marcarResultado(item, acertos) {
    if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input, indice) {
        input.classList.toggle('campo-correto', acertos[indice]);
        input.classList.toggle('campo-incorreto', !acertos[indice]);
      });
    } else {
      conteudo.querySelectorAll('[data-item-gramatica]').forEach(function (grupo, indice) {
        grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
          var selecionada = botao.getAttribute('aria-pressed') === 'true';
          botao.classList.toggle('correta', selecionada && acertos[indice]);
          botao.classList.toggle('incorreta', selecionada && !acertos[indice]);
        });
      });
    }
  }

  function conferir(item) {
    var respostas = respostasDaQuestao(item);
    var acertos = item.itens.map(function (subitem, indice) {
      return respostaCorreta(respostas[indice], subitem.respostas);
    });
    var completos = item.itens.map(function (_subitem, indice) {
      return normalizarResposta(respostas[indice]) !== '';
    });
    marcarResultado(item, acertos);

    if (
      completos.some(function (completo) {
        return !completo;
      })
    ) {
      anunciar(item, 'Complete todos os itens antes de conferir novamente.', false);
      return;
    }

    if (acertos.every(Boolean)) {
      estado.corrigidas[item.id] = true;
      estado.pontuadas[item.id] = true;
      salvar();
      anunciar(item, '✓ ' + item.sucesso, true);
      atualizarNavegacao();
      return;
    }

    delete estado.corrigidas[item.id];
    salvar();
    anunciar(item, '↻ Revise os itens destacados. ' + item.dica, false);
    atualizarNavegacao();
  }

  function renderizarQuestao() {
    var item = questoes[estado.questaoAtual];
    var respostas = respostasDaQuestao(item);
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">' +
      escapar(item.bloco) +
      '</p><h1 id="gramatica-titulo-questao">' +
      escapar(item.titulo) +
      '</h1><p class="explicacao-mariana">' +
      escapar(item.instrucao) +
      '</p></div><img class="icone-etapa" src="../assets/objetos_escolares/pencil.svg" alt=""></div>' +
      '<div class="atividade-mariana">' +
      (item.ditado ? window.GramaticaDitado.painelHtml() : '') +
      (item.tipo === 'campos' ? montarCampos(item, respostas) : montarOpcoes(item, respostas)) +
      '<div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-gramatica>Conferir</button>' +
      '<div class="retorno retorno-mariana retorno-gramatica" role="status" aria-live="polite"></div></div></div></article>';
    configurarInteracoes(item);
    if (estado.corrigidas[item.id]) {
      marcarResultado(
        item,
        item.itens.map(function () {
          return true;
        })
      );
      anunciar(item, '✓ ' + item.sucesso, true);
    }
  }

  function renderizarFinal() {
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Revisão concluída</p><h1 id="gramatica-titulo-questao">Parabéns, Mariana!</h1>' +
      '<p class="explicacao-mariana">Você concluiu 40 questões sobre M e N, pontuação, sílabas, Z, S e SS.</p></div>' +
      '<img class="icone-etapa" src="../assets/objetos_escolares/book.svg" alt=""></div>' +
      '<div class="atividade-mariana"><p class="retorno sucesso" role="status">✓ Seu progresso ficou salvo neste computador.</p>' +
      '<button class="botao-principal botao-grande" type="button" data-ir-inicio>Voltar ao início</button></div></article>';
    conteudo.querySelector('[data-ir-inicio]').addEventListener('click', function () {
      document.getElementById('botao-inicio').click();
    });
  }

  function renderizar() {
    window.GramaticaDitado.parar();
    if (estado.finalizada) renderizarFinal();
    else renderizarQuestao();
    atualizarNavegacao();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function irPara(indice) {
    estado.finalizada = false;
    estado.questaoAtual = Math.max(0, Math.min(TOTAL_QUESTOES - 1, indice));
    salvar();
    renderizar();
  }

  function abrir() {
    conteudo = document.getElementById('gramatica-conteudo');
    estado = obterArmazenamento().carregar();
    document.getElementById('gramatica-nome-perfil').textContent = 'Mariana';
    document.getElementById('gramatica-progresso').setAttribute('aria-valuemax', TOTAL_QUESTOES);
    document.getElementById('gramatica-voltar').onclick = function () {
      if (estado.finalizada) irPara(TOTAL_QUESTOES - 1);
      else irPara(estado.questaoAtual - 1);
    };
    document.getElementById('gramatica-proxima').onclick = function () {
      var item = questoes[estado.questaoAtual];
      if (!estado.corrigidas[item.id]) return;
      if (estado.questaoAtual === TOTAL_QUESTOES - 1) {
        estado.finalizada = true;
        salvar();
        renderizar();
      } else {
        irPara(estado.questaoAtual + 1);
      }
    };
    renderizar();
  }

  function limparProgresso(pedirConfirmacao) {
    if (
      pedirConfirmacao &&
      !window.confirm('Limpar apenas o progresso desta revisão de Gramática da Mariana?')
    ) {
      return false;
    }
    obterArmazenamento().remover();
    estado = estadoInicial();
    if (conteudo) renderizar();
    emitirProgresso();
    return true;
  }

  function obterEstado() {
    estado = estado || obterArmazenamento().carregar();
    return estado;
  }

  function obterSituacao() {
    var atual = obterEstado();
    if (atual.finalizada) return 'concluida';
    if (
      atual.questaoAtual > 0 ||
      Object.keys(atual.respostas).length > 0 ||
      Object.keys(atual.corrigidas).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  window.RevisaoGramaticaMariana = {
    abrir: abrir,
    limparProgresso: limparProgresso,
    obterEstado: obterEstado,
    obterSituacao: obterSituacao,
    questoes: questoes,
    chave: CHAVE,
    totalQuestoes: TOTAL_QUESTOES,
  };
})();
