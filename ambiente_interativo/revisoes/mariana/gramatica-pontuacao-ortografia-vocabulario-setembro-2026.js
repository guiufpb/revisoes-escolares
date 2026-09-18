(function () {
  'use strict';

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function selecao(pergunta, opcoes, respostas) {
    return { tipo: 'selecao', pergunta: pergunta, opcoes: opcoes, respostas: respostas };
  }

  function ordem(pergunta, cartoes, respostas) {
    return {
      tipo: 'ordenacao',
      pergunta: pergunta,
      cartoes: cartoes,
      respostas: respostas,
      rotuloOrdem: 'Ordem correta',
    };
  }

  function campo(pergunta, resposta, fraseCompleta) {
    return {
      pergunta: pergunta,
      respostas: [resposta],
      acentuacaoObrigatoria: true,
      maiusculasObrigatorias: Boolean(fraseCompleta),
      fraseCompleta: Boolean(fraseCompleta),
    };
  }

  function questao(numero, bloco, titulo, instrucao, itens, dica, extras) {
    return Object.assign(
      {
        id: 'q' + String(numero).padStart(2, '0'),
        bloco: bloco,
        titulo: titulo,
        instrucao: instrucao,
        tipo: itens[0].opcoes ? 'opcoes' : 'campos',
        itens: itens,
        dica: dica,
        sucesso: 'Muito bem! Você concluiu esta questão de ' + bloco.toLowerCase() + '.',
        opcoesReversiveis: true,
      },
      extras || {}
    );
  }

  function ditado(numero, bloco, titulo, respostas, instrucao, dica, frase) {
    return questao(
      numero,
      bloco,
      titulo,
      instrucao,
      respostas.map(function (resposta, indice) {
        return campo((frase ? 'Frase ' : 'Palavra ') + (indice + 1), resposta, frase);
      }),
      dica,
      { ditado: true, unidadeDitado: frase ? 'frase' : 'palavra' }
    );
  }

  var questoes = [
    questao(
      1,
      'Pontuação',
      'Para que serve cada sinal?',
      'Escolha a função de cada sinal de pontuação.',
      [
        opcao(
          'Ponto final (.)',
          ['Faz uma pergunta.', 'Termina uma frase declarativa.', 'Indica uma fala.'],
          'Termina uma frase declarativa.'
        ),
        opcao(
          'Ponto de interrogação (?)',
          ['Faz uma pergunta.', 'Separa sílabas.', 'Mostra uma enumeração.'],
          'Faz uma pergunta.'
        ),
        opcao(
          'Ponto de exclamação (!)',
          ['Anuncia uma fala.', 'Termina qualquer palavra.', 'Mostra emoção, surpresa ou ordem.'],
          'Mostra emoção, surpresa ou ordem.'
        ),
        opcao(
          'Dois-pontos (:)',
          [
            'Faz uma pergunta.',
            'Anuncia uma fala ou uma enumeração.',
            'Substitui todas as vírgulas.',
          ],
          'Anuncia uma fala ou uma enumeração.'
        ),
        opcao(
          'Travessão (—)',
          ['Marca plural.', 'Separa todas as sílabas.', 'Pode iniciar a fala de uma personagem.'],
          'Pode iniciar a fala de uma personagem.'
        ),
      ],
      'Pense na função que cada sinal cumpre dentro de uma frase.',
      {
        leituraTitulo: 'Vamos lembrar',
        leitura:
          'Os sinais de pontuação ajudam a organizar o texto, indicar perguntas, emoções e falas.',
      }
    ),
    questao(
      2,
      'Pontuação',
      'Uma conversa com Nina',
      'Leia o diálogo e identifique os sinais.',
      [
        opcao('Qual sinal aparece depois de “avisou”?', [':', '—', '!'], ':'),
        opcao('Qual sinal inicia a fala de Nina?', [':', '—', '!'], '—'),
        opcao('Qual sinal encerra a fala com entusiasmo?', [':', '—', '!'], '!'),
      ],
      'Observe o que vem antes da fala, o início da fala e o final de cada frase.',
      { leitura: 'Nina avisou:\n— O lanche está pronto!' }
    ),
    questao(
      3,
      'Pontuação',
      'Complete a conversa',
      'Digite somente o sinal que falta em cada lacuna.',
      [
        campo('Léo perguntou [1]', ':'),
        campo('[2] Você trouxe o jogo [3]', '—'),
        campo('Sinal no fim da pergunta [3]', '?'),
        campo('Bia respondeu [4]', ':'),
        campo('[5] Trouxe, sim [6]', '—'),
        campo('Sinal no fim da resposta [6]', '!'),
      ],
      'Há dois-pontos antes das falas, travessão no começo e sinais adequados no final.',
      {
        leitura:
          'Léo perguntou [1]\n[2] Você trouxe o jogo [3]\nBia respondeu [4]\n[5] Trouxe, sim [6]',
      }
    ),
    ditado(
      4,
      'Pontuação',
      'Ditado de uma fala',
      ['— Você viu meu caderno?'],
      'Ouça a frase e escreva com maiúscula, travessão e interrogação.',
      'Ouça novamente e confira o travessão, o espaço, as palavras, os acentos e a pontuação.',
      true
    ),
    questao(
      5,
      'Tipos de frase',
      'O que cada frase expressa?',
      'Classifique cada frase.',
      [
        opcao(
          'O recreio começa às dez.',
          [
            'Negativa',
            'Afirmativa/declarativa',
            'Interrogativa',
            'Exclamativa',
            'Imperativa',
            'Optativa',
          ],
          'Afirmativa/declarativa'
        ),
        opcao(
          'Eu não esqueci o estojo.',
          [
            'Interrogativa',
            'Afirmativa/declarativa',
            'Exclamativa',
            'Negativa',
            'Imperativa',
            'Optativa',
          ],
          'Negativa'
        ),
        opcao(
          'Você trouxe água?',
          [
            'Interrogativa',
            'Afirmativa/declarativa',
            'Negativa',
            'Exclamativa',
            'Imperativa',
            'Optativa',
          ],
          'Interrogativa'
        ),
        opcao(
          'Que dia bonito!',
          [
            'Imperativa',
            'Optativa',
            'Interrogativa',
            'Afirmativa/declarativa',
            'Negativa',
            'Exclamativa',
          ],
          'Exclamativa'
        ),
        opcao(
          'Feche a janela, por favor.',
          [
            'Afirmativa/declarativa',
            'Negativa',
            'Imperativa',
            'Interrogativa',
            'Exclamativa',
            'Optativa',
          ],
          'Imperativa'
        ),
        opcao(
          'Tomara que faça sol amanhã!',
          [
            'Afirmativa/declarativa',
            'Negativa',
            'Interrogativa',
            'Exclamativa',
            'Optativa',
            'Imperativa',
          ],
          'Optativa'
        ),
      ],
      'Observe a intenção e o sinal usado no fim de cada frase.',
      {
        leitura:
          'Uma frase pode afirmar, negar, perguntar, exclamar, dar uma orientação ou expressar um desejo.',
      }
    ),
    questao(
      6,
      'Tipos de frase',
      'Afirmativa ou negativa?',
      'Escolha a classificação de cada frase declarativa.',
      [
        opcao('A janela está aberta.', ['Negativa', 'Afirmativa'], 'Afirmativa'),
        opcao('Pedro gosta de desenhar.', ['Afirmativa', 'Negativa'], 'Afirmativa'),
        opcao('A janela não está aberta.', ['Negativa', 'Afirmativa'], 'Negativa'),
        opcao('Pedro não trouxe o lápis.', ['Afirmativa', 'Negativa'], 'Negativa'),
      ],
      'Palavras como “não” e “nunca” ajudam a formar frases negativas.'
    ),
    questao(
      7,
      'Tipos de frase',
      'Organize e classifique',
      'Monte cada frase e depois indique seu tipo.',
      [
        ordem(
          '7A — Monte a primeira frase.',
          ['engraçado.', 'muito', 'O', 'é', 'palhaço'],
          ['O', 'palhaço', 'é', 'muito', 'engraçado.']
        ),
        opcao('7B — A primeira frase é:', ['Declarativa', 'Interrogativa'], 'Declarativa'),
        ordem(
          '7C — Monte a segunda frase.',
          ['gorro?', 'meu', 'Onde', 'está'],
          ['Onde', 'está', 'meu', 'gorro?']
        ),
        opcao('7D — A segunda frase é:', ['Declarativa', 'Interrogativa'], 'Interrogativa'),
      ],
      'Comece pela palavra com letra maiúscula e observe o sinal final.',
      { tipo: 'misto' }
    ),
    questao(
      8,
      'Pontuação',
      'Reconheça o travessão',
      'Escolha o sinal usado para iniciar a fala de uma personagem.',
      [
        opcao(
          'Qual sinal usamos antes da fala de uma personagem?',
          ['— travessão', '– meia-risca', '- hífen'],
          '— travessão'
        ),
      ],
      'O travessão é o traço mais comprido entre as alternativas.',
      {
        leitura:
          'Travessão, meia-risca e hífen têm comprimentos diferentes. Em diálogos, usamos o travessão para iniciar uma fala.',
      }
    ),
    questao(
      9,
      'Vírgula',
      'Uma lista bem pontuada',
      'Escolha a frase em que a enumeração está pontuada corretamente.',
      [
        opcao(
          'Qual frase está correta?',
          [
            'Na mochila há caderno, lápis, régua e borracha.',
            'Na mochila há caderno lápis, régua, e borracha.',
            'Na mochila há, caderno, lápis régua e borracha.',
          ],
          'Na mochila há caderno, lápis, régua e borracha.'
        ),
      ],
      'A vírgula separa os itens da lista; antes do último, usamos “e”.',
      {
        leitura:
          'Em uma lista, a vírgula separa os itens. Normalmente não colocamos vírgula antes do “e” que liga o último item.',
      }
    ),
    questao(
      10,
      'Vírgula',
      'Duas enumerações',
      'Escolha a escrita correta em cada caso.',
      [
        opcao(
          'O que vimos no parque',
          [
            'No parque vimos árvores flores, pássaros, e borboletas.',
            'No parque vimos árvores, flores, pássaros e borboletas.',
          ],
          'No parque vimos árvores, flores, pássaros e borboletas.'
        ),
        opcao(
          'O que havia na feira',
          [
            'Na feira havia banana, maçã, pera e melancia.',
            'Na feira havia banana maçã, pera, e melancia.',
          ],
          'Na feira havia banana, maçã, pera e melancia.'
        ),
      ],
      'Separe os itens com vírgulas e ligue o último com “e”.'
    ),
    questao(
      11,
      'Vírgula',
      'Outros usos da vírgula',
      'Escolha a frase bem pontuada em cada grupo.',
      [
        opcao(
          'Chamando alguém',
          ['Marina, pegue o lápis.', 'Marina pegue, o lápis.', 'Marina pegue o lápis,'],
          'Marina, pegue o lápis.'
        ),
        opcao(
          'Local e data',
          [
            'Cidade do Sol 12, de setembro de 2026.',
            'Cidade do Sol 12 de setembro, de 2026.',
            'Cidade do Sol, 12 de setembro de 2026.',
          ],
          'Cidade do Sol, 12 de setembro de 2026.'
        ),
        opcao(
          'Endereço inventado',
          ['Rua, das Flores 25.', 'Rua das Flores, 25.', 'Rua das Flores 25,'],
          'Rua das Flores, 25.'
        ),
      ],
      'A vírgula pode separar o nome de quem chamamos, o local da data e o nome da rua do número.',
      {
        leitura:
          'Quando chamamos uma pessoa pelo nome, separamos esse chamamento do restante da frase com vírgula.',
      }
    ),
    questao(
      12,
      'Pontuação',
      'Um bilhete completo',
      'Escolha o bilhete com pontuação adequada.',
      [
        opcao(
          'Qual bilhete está correto?',
          [
            'Bia, leve caderno, lápis e borracha.\nAté mais!',
            'Bia leve, caderno lápis, e borracha.\nAté mais',
            'Bia. leve caderno lápis, e borracha?\nAté mais,',
          ],
          'Bia, leve caderno, lápis e borracha.\nAté mais!'
        ),
      ],
      'Confira o chamamento, a lista e os sinais no fim das frases.'
    ),
    questao(
      13,
      'S entre vogais',
      'S com som de Z',
      'Marque todas as palavras em que o S entre vogais tem som de Z.',
      [
        selecao(
          'Escolha as cinco palavras corretas.',
          ['casa', 'sapo', 'mesa', 'pasta', 'rosa', 'tesoura', 'camisa'],
          ['casa', 'mesa', 'rosa', 'tesoura', 'camisa']
        ),
      ],
      'Procure o S que aparece entre duas vogais.',
      {
        tipo: 'selecao',
        leitura: 'Em algumas palavras, o S entre vogais tem som parecido com Z, como em casa.',
      }
    ),
    questao(
      14,
      'S ou SS',
      'Complete as palavras',
      'Digite somente s ou ss em cada lacuna.',
      [
        campo('ca__aco', 's'),
        campo('pa__eio', 'ss'),
        campo('te__oura', 's'),
        campo('pá__aro', 'ss'),
        campo('a__ado', 'ss'),
        campo('vi__ita', 's'),
      ],
      'Entre vogais, o som de Z costuma ser escrito com S; o som forte pode pedir SS.'
    ),
    questao(
      15,
      'S ou SS',
      'Qual grafia está correta?',
      'Escolha a palavra correta em cada par.',
      [
        opcao('Roupa usada quando faz frio', ['cassaco', 'casaco', 'cazaco'], 'casaco'),
        opcao('Ave com penas e asas', ['pásaro', 'pázaro', 'pássaro'], 'pássaro'),
        opcao('Objeto para cortar papel', ['tesoura', 'tessoura', 'tezoura'], 'tesoura'),
        opcao('Saída para caminhar e divertir-se', ['paseio', 'passeio', 'pazeio'], 'passeio'),
      ],
      'Leia cada palavra em voz baixa e observe o som do S.'
    ),
    ditado(
      16,
      'S ou SS',
      'Ditado com S e SS',
      ['casaco', 'pássaro', 'tesoura', 'passeio'],
      'Ouça uma palavra por vez e escreva com atenção ao S, ao SS e aos acentos.',
      'Repita a palavra e confira todas as letras.'
    ),
    questao(
      17,
      'S ou SS',
      'Sílabas e ordem alfabética',
      'Responda sobre as sílabas e organize as palavras.',
      [
        opcao('Separe “pássaro”.', ['pá-ssa-ro', 'pás-sa-ro', 'pás-sar-o'], 'pás-sa-ro'),
        opcao('Separe “assado”.', ['a-ssa-do', 'as-sad-o', 'as-sa-do'], 'as-sa-do'),
        opcao('Separe “passeio”.', ['pas-sei-o', 'pa-ssei-o', 'pas-se-io'], 'pas-sei-o'),
        ordem(
          'Coloque em ordem alfabética.',
          ['tesoura', 'passeio', 'camisa', 'assado'],
          ['assado', 'camisa', 'passeio', 'tesoura']
        ),
      ],
      'Fale os pedaços das palavras e depois compare a primeira letra de cada uma.',
      { tipo: 'misto' }
    ),
    questao(
      18,
      'R ou RR',
      'Os sons do R',
      'Classifique o som e a posição destacados em cada palavra.',
      [
        opcao(
          'rato',
          ['R forte no início', 'R brando entre vogais', 'RR forte entre vogais'],
          'R forte no início'
        ),
        opcao(
          'barata',
          ['R forte no início', 'R brando entre vogais', 'RR forte entre vogais'],
          'R brando entre vogais'
        ),
        opcao(
          'caro',
          ['R forte no início', 'R brando entre vogais', 'RR forte entre vogais'],
          'R brando entre vogais'
        ),
        opcao(
          'carro',
          ['R forte no início', 'R brando entre vogais', 'RR forte entre vogais'],
          'RR forte entre vogais'
        ),
        opcao(
          'sorriso',
          ['R forte no início', 'R brando entre vogais', 'RR forte entre vogais'],
          'RR forte entre vogais'
        ),
      ],
      'No início, R pode ter som forte. Entre vogais, compare R e RR.',
      {
        leitura:
          'O R no início costuma ter som forte. Entre vogais, um R tem som brando e RR mantém o som forte.',
      }
    ),
    questao(
      19,
      'R ou RR',
      'Complete com R ou RR',
      'Digite somente r ou rr em cada lacuna.',
      [
        campo('Veículo com quatro rodas: ca__o.', 'rr'),
        campo('Preço baixo: ba__ato.', 'r'),
        campo('Parte alta de um castelo: to__e.', 'rr'),
        campo('Recipiente para flores: ja__a.', 'rr'),
        campo('Afeto e cuidado: ca__inho.', 'r'),
        campo('Expressão de alegria no rosto: so__iso.', 'rr'),
      ],
      'Observe se a letra está no início ou entre vogais e escute se o som é forte ou brando.'
    ),
    questao(
      20,
      'R ou RR',
      'Caro ou carro?',
      'Escolha a palavra que completa cada frase.',
      [
        opcao('O brinquedo custou muito dinheiro. Ele ficou ___.', ['caro', 'carro'], 'caro'),
        opcao('Meu tio guardou o ___ na garagem.', ['caro', 'carro'], 'carro'),
      ],
      'Um R entre vogais tem som brando; RR tem som forte.'
    ),
    ditado(
      21,
      'R ou RR',
      'Ditado com R e RR',
      ['barata', 'carroça', 'sorriso', 'terreno'],
      'Ouça uma palavra por vez e escreva com R ou RR.',
      'Repita e confira especialmente as letras no meio da palavra.'
    ),
    questao(
      22,
      'R ou RR',
      'Separe em sílabas',
      'Escolha a separação correta.',
      [
        opcao('terreno', ['te-rre-no', 'ter-re-no', 'ter-ren-o'], 'ter-re-no'),
        opcao('carrapato', ['ca-rra-pa-to', 'car-rap-at-o', 'car-ra-pa-to'], 'car-ra-pa-to'),
        opcao('socorro', ['soc-or-ro', 'so-cor-ro', 'so-co-rro'], 'so-cor-ro'),
        opcao('carroça', ['ca-rro-ça', 'car-roç-a', 'car-ro-ça'], 'car-ro-ça'),
      ],
      'Ao separar, cada R de RR fica em uma sílaba diferente.'
    ),
    questao(
      23,
      'Vocabulário',
      'Palavras sinônimas',
      'Escolha uma palavra com sentido parecido.',
      [
        opcao('belo', ['feio', 'bonito', 'vazio'], 'bonito'),
        opcao('ruído', ['silêncio', 'desenho', 'barulho'], 'barulho'),
        opcao('achar', ['encontrar', 'perder', 'esconder'], 'encontrar'),
        opcao('pular', ['sentar', 'saltar', 'andar'], 'saltar'),
        opcao('acabar', ['começar', 'abrir', 'terminar'], 'terminar'),
      ],
      'Sinônimos são palavras com sentidos iguais ou parecidos.',
      {
        leitura:
          'Palavras diferentes podem ter sentidos iguais ou parecidos. Elas são chamadas de sinônimos.',
      }
    ),
    questao(
      24,
      'Vocabulário',
      'Sinônimos no contexto',
      'Escolha a palavra que mantém o sentido da frase.',
      [
        opcao('Léo ganhou uma mochila no aniversário.', ['venceu', 'recebeu', 'perdeu'], 'recebeu'),
        opcao('A equipe ganhou o jogo.', ['recebeu', 'empatou', 'venceu'], 'venceu'),
        opcao('O trem vai partir cedo.', ['sair', 'cortar', 'parar'], 'sair'),
        opcao(
          'Papai vai partir a laranja em duas partes.',
          ['sair', 'cortar', 'guardar'],
          'cortar'
        ),
      ],
      'Leia a frase inteira e troque a palavra sem mudar sua ideia.',
      {
        leitura:
          'Uma palavra pode ter sentidos diferentes. Por isso, o sinônimo adequado depende da frase.',
      }
    ),
    questao(
      25,
      'Vocabulário',
      'Palavras antônimas',
      'Escolha a palavra de sentido contrário.',
      [
        opcao('bonito', ['belo', 'feio', 'claro'], 'feio'),
        opcao('escuro', ['preto', 'limpo', 'claro'], 'claro'),
        opcao('corajoso', ['covarde', 'valente', 'forte'], 'covarde'),
        opcao('alto', ['grande', 'baixo', 'largo'], 'baixo'),
        opcao('comprido', ['longo', 'estreito', 'curto'], 'curto'),
      ],
      'Antônimos têm sentidos contrários.'
    ),
    questao(
      26,
      'Vocabulário',
      'Forme o contrário',
      'Digite a palavra contrária usando in- ou im-.',
      [
        campo('correto', 'incorreto'),
        campo('justo', 'injusto'),
        campo('completo', 'incompleto'),
        campo('puro', 'impuro'),
        campo('possível', 'impossível'),
        campo('paciente', 'impaciente'),
      ],
      'Use im- antes de palavras iniciadas por P ou B; em vários outros casos, use in-.',
      {
        leitura:
          'Em muitos casos, usamos im- antes de P ou B. Em várias outras palavras, usamos in- para formar o contrário.',
      }
    ),
    questao(
      27,
      'Vocabulário',
      'Sinônimo ou antônimo?',
      'Classifique cada par de palavras.',
      [
        opcao('bonito / belo', ['Antônimos', 'Sinônimos'], 'Sinônimos'),
        opcao('começar / iniciar', ['Sinônimos', 'Antônimos'], 'Sinônimos'),
        opcao('limpo / sujo', ['Sinônimos', 'Antônimos'], 'Antônimos'),
        opcao('rápido / veloz', ['Antônimos', 'Sinônimos'], 'Sinônimos'),
        opcao('entrar / sair', ['Antônimos', 'Sinônimos'], 'Antônimos'),
        opcao('frio / quente', ['Sinônimos', 'Antônimos'], 'Antônimos'),
      ],
      'Compare os sentidos: parecidos indicam sinônimos; contrários indicam antônimos.'
    ),
    questao(
      28,
      'Encontros vocálicos',
      'AR, ER, IR, OR ou UR?',
      'Escolha o grupo de letras que aparece em cada palavra.',
      [
        opcao('arma', ['ER', 'AR', 'IR', 'OR', 'UR'], 'AR'),
        opcao('erva', ['AR', 'IR', 'OR', 'ER', 'UR'], 'ER'),
        opcao('irmão', ['IR', 'AR', 'ER', 'OR', 'UR'], 'IR'),
        opcao('ordem', ['AR', 'ER', 'IR', 'UR', 'OR'], 'OR'),
        opcao('urso', ['AR', 'UR', 'ER', 'IR', 'OR'], 'UR'),
      ],
      'Procure a vogal que aparece imediatamente antes do R.',
      {
        leitura:
          'Observe os grupos AR, ER, IR, OR e UR. Em cada grupo, uma vogal aparece antes do R.',
      }
    ),
    questao(
      29,
      'Encontros vocálicos',
      'Complete os grupos',
      'Digite ar, er, ir, or ou ur.',
      [
        campo('t__ta', 'or'),
        campo('c__ta', 'ar'),
        campo('c__to', 'ur'),
        campo('f__me', 'ir'),
        campo('v__de', 'er'),
      ],
      'Leia a palavra completa mentalmente e escreva as duas letras que faltam.'
    ),
    questao(
      30,
      'Sílabas',
      'Separe e conte',
      'Escolha a separação e a quantidade de sílabas corretas.',
      [
        opcao(
          'borboleta',
          ['bor-bol-eta · 3', 'bor-bo-le-ta · 4', 'bo-rbo-le-ta · 4'],
          'bor-bo-le-ta · 4'
        ),
        opcao('arbusto', ['arb-us-to · 3', 'ar-bu-sto · 3', 'ar-bus-to · 3'], 'ar-bus-to · 3'),
        opcao('urso', ['ur-so · 2', 'u-rso · 2', 'urs-o · 2'], 'ur-so · 2'),
        opcao('circo', ['ci-rco · 2', 'cir-co · 2', 'circ-o · 2'], 'cir-co · 2'),
        opcao('erva', ['e-rva · 2', 'erv-a · 2', 'er-va · 2'], 'er-va · 2'),
      ],
      'Fale a palavra devagar e conte cada impulso de voz.'
    ),
    questao(
      31,
      'Encontros vocálicos',
      'AS, ES, IS, OS ou US?',
      'Digite o grupo que completa cada palavra.',
      [
        campo('r__to', 'os'),
        campo('c__ca', 'as'),
        campo('ônib__', 'us'),
        campo('p__ta', 'is'),
        campo('f__ta', 'es'),
      ],
      'Observe qual vogal aparece antes do S em cada palavra.',
      {
        leitura:
          'Agora observe os grupos AS, ES, IS, OS e US. Complete cada palavra com o grupo adequado.',
      }
    ),
    questao(
      32,
      'Vocabulário',
      'Transforme e organize',
      'Troque a letra indicada e depois organize as palavras.',
      [
        opcao('Em “festa”, troque f por t.', ['sexta', 'testa', 'festa'], 'testa'),
        opcao('Em “disco”, troque d por r.', ['rosco', 'disco', 'risco'], 'risco'),
        opcao('Em “rosca”, troque r por m.', ['mosca', 'marca', 'rosca'], 'mosca'),
        opcao('Em “pista”, troque p por l.', ['lesta', 'lista', 'pista'], 'lista'),
        opcao('Em “rosto”, troque o primeiro o por e.', ['rasto', 'rosto', 'resto'], 'resto'),
        ordem(
          'Coloque as novas palavras em ordem alfabética.',
          ['testa', 'risco', 'mosca', 'lista', 'resto'],
          ['lista', 'mosca', 'resto', 'risco', 'testa']
        ),
      ],
      'Faça somente a troca pedida; na ordem alfabética, compare as primeiras letras.',
      { tipo: 'misto' }
    ),
    questao(
      33,
      'M antes de P/B e no final',
      'Complete com M ou N',
      'Digite somente m ou n em cada lacuna.',
      [
        campo('ca__po', 'm'),
        campo('li__po', 'm'),
        campo('ta__bor', 'm'),
        campo('bo__ba', 'm'),
        campo('jardi__', 'm'),
        campo('onte__', 'm'),
      ],
      'Antes de P e B, usamos M. Muitas palavras também terminam com M.',
      { leitura: 'Antes de P e B, usamos M. Em muitas palavras, também encontramos M no final.' }
    ),
    questao(
      34,
      'Ortografia',
      'Ç, U pronunciado e acentuação',
      'Responda às partes sobre a escrita das palavras.',
      [
        opcao('Qual é a grafia correta?', ['corasão', 'coração', 'corassão'], 'coração'),
        opcao('Qual é a grafia correta?', ['lenso', 'lensso', 'lenço'], 'lenço'),
        opcao('Qual é a grafia correta?', ['cabeça', 'cabesa', 'cabessa'], 'cabeça'),
        opcao('Qual é a grafia correta?', ['asúcar', 'açúcar', 'assúcar'], 'açúcar'),
        selecao(
          'Em quais palavras o U é pronunciado?',
          ['quente', 'água', 'quilo', 'guarda', 'guitarra', 'quarto'],
          ['água', 'guarda', 'quarto']
        ),
        opcao('Qual palavra tem acento circunflexo?', ['café', 'lápis', 'você'], 'você'),
        opcao('Qual palavra tem acento agudo?', ['voce', 'café', 'robo'], 'café'),
      ],
      'Fale as palavras devagar. Depois observe o tipo e a posição do acento.',
      { tipo: 'misto' }
    ),
    questao(
      35,
      'Revisão final',
      'Um desafio completo',
      'Leia o texto e responda às seis perguntas.',
      [
        opcao('Qual sinal depois de “chamou” anuncia a fala?', ['—', ':', '?'], ':'),
        opcao('Qual sinal inicia a fala de Bruno?', [':', '—', '?'], '—'),
        opcao(
          'Qual é a função da vírgula depois de “Bruno”?',
          ['Separar sílabas.', 'Encerrar uma pergunta.', 'Separar o vocativo, chamando alguém.'],
          'Separar o vocativo, chamando alguém.'
        ),
        opcao(
          'Que tipo de frase é “Você quer brincar no parque?”',
          ['Declarativa', 'Interrogativa', 'Imperativa'],
          'Interrogativa'
        ),
        opcao(
          'Em “carrinho”, qual escrita representa o som forte no meio?',
          ['R', 'RR', 'S'],
          'RR'
        ),
        opcao(
          'Qual palavra tem sentido parecido com “contente”?',
          ['triste', 'distante', 'feliz'],
          'feliz'
        ),
      ],
      'Use tudo o que você revisou: pontuação, ortografia, vocabulário e sílabas.',
      {
        leitura:
          'Rita chamou:\n— Bruno, você quer brincar no parque?\n— Sim! Vou levar a bola, a corda e o carrinho.\nBruno ficou contente.',
        sucesso: 'Muito bem! Você revisou pontuação, ortografia e vocabulário.',
      }
    ),
  ];

  questoes[2].itens[1].inserirTravessao = true;
  questoes[2].itens[4].inserirTravessao = true;
  questoes[3].itens[0].inserirTravessao = true;
  questoes[3].itens[0].feedbackErros = {
    inicio: 'Confira o início: use travessão seguido de espaço.',
    palavras: 'Ouça novamente e confira a escrita de cada palavra.',
    acentuacao: 'Confira os acentos das palavras.',
    final: 'Confira o sinal de pontuação no fim da fala.',
    incompleta: 'A fala está incompleta; ouça novamente até o fim.',
  };

  window.GramaticaQuestionarios.registrar({
    id: 'mariana-gramatica-pontuacao-ortografia-vocabulario-setembro-2026',
    aluno: 'mariana',
    nome: 'Mariana',
    materia: 'Gramática',
    titulo: 'Pontuação, ortografia e palavras',
    subtitulo: 'Sinais de pontuação, S/SS, R/RR, sinônimos, antônimos e sílabas',
    chave: 'revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1',
    layout: { desktopAmplo: true },
    validacaoEstritaEstado: true,
    resumoFinal: 'Você concluiu 35 questões sobre pontuação, ortografia, vocabulário e sílabas!',
    questoes: questoes,
  });
})();
