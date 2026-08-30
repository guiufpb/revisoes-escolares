(function () {
  'use strict';

  function opcao(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
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
      },
      extras || {}
    );
  }

  function ditado(numero, bloco, titulo, palavras, instrucao, dica, frase) {
    return questao(
      numero,
      bloco,
      titulo,
      instrucao,
      palavras.map(function (palavra, indice) {
        return campo((frase ? 'Frase ' : 'Palavra ') + (indice + 1), palavra, frase);
      }),
      dica,
      { ditado: true, unidadeDitado: frase ? 'frase' : 'palavra' }
    );
  }

  var questoes = [
    questao(
      1,
      'Contos',
      'Uma descoberta no quintal',
      'Leia a história e escolha o tipo de texto.',
      [opcao('Que tipo de texto é esse?', ['conto', 'receita', 'notícia', 'lista'], 'conto')],
      'Observe se o texto conta o que aconteceu com uma personagem.',
      {
        leitura:
          'Luna encontrou uma semente no quintal. Ela a plantou perto da janela. Todos os dias, Luna regava a terra. Depois de uma semana, nasceu uma flor amarela.',
      }
    ),
    questao(
      2,
      'Contos',
      'Um objeto encantado',
      'Leia e descubra o que combina com um conto de fadas.',
      [
        opcao(
          'O que torna essa história um conto de fadas?',
          [
            'lista de ingredientes',
            'magia e encantamento',
            'preço de produtos',
            'instruções para montar brinquedo',
          ],
          'magia e encantamento'
        ),
      ],
      'Pense no que o objeto faz e se isso pode acontecer na vida real.',
      {
        leitura:
          'A jovem Iara precisava atravessar um rio sem ponte. Uma fada lhe deu uma fita mágica, mas ela só funcionaria depois de uma boa ação. Iara ajudou um coelho perdido. A fita virou uma ponte, e Iara chegou em casa.',
      }
    ),
    questao(
      3,
      'Contos',
      'Cada parte da história',
      'Escolha começo, problema ou desfecho para cada parte.',
      [
        opcao('Téo saiu para levar pão à avó.', ['começo', 'problema', 'desfecho'], 'começo'),
        opcao(
          'No caminho, a alça da cesta arrebentou.',
          ['começo', 'problema', 'desfecho'],
          'problema'
        ),
        opcao(
          'Téo amarrou a alça e entregou o pão.',
          ['começo', 'problema', 'desfecho'],
          'desfecho'
        ),
      ],
      'O começo apresenta a situação. O problema atrapalha o plano. O desfecho mostra como tudo terminou.'
    ),
    questao(
      4,
      'Contos',
      'Que barulho foi esse?',
      'Leia este conto de suspense leve e escolha o trecho que cria mistério.',
      [
        opcao(
          'Qual trecho faz o leitor querer descobrir o que está dentro da caixa?',
          [
            'A casa estava silenciosa.',
            'Algo fazia toc, toc dentro de uma caixa fechada.',
            'Era uma bolinha batendo na tampa!',
            'Os irmãos riram da descoberta.',
          ],
          'Algo fazia toc, toc dentro de uma caixa fechada.'
        ),
      ],
      'Procure a parte em que ainda não sabemos o que está acontecendo.',
      {
        leitura:
          'A casa estava silenciosa. Algo fazia toc, toc dentro de uma caixa fechada. Nina e seu irmão se aproximaram e abriram a caixa que o gato empurrava. Era uma bolinha batendo na tampa! Os irmãos riram da descoberta.',
      }
    ),
    questao(
      5,
      'Dígrafos',
      'CH, LH ou NH?',
      'Escolha CH, LH ou NH para completar cada palavra.',
      [
        opcao('__ave', ['CH', 'LH', 'NH'], 'CH'),
        opcao('abe__a', ['CH', 'LH', 'NH'], 'LH'),
        opcao('vi__o', ['CH', 'LH', 'NH'], 'NH'),
        opcao('ni__o', ['CH', 'LH', 'NH'], 'NH'),
        opcao('coe__o', ['CH', 'LH', 'NH'], 'LH'),
        opcao('__uva', ['CH', 'LH', 'NH'], 'CH'),
      ],
      'Pense na escrita da palavra e experimente cada par no espaço vazio.'
    ),
    questao(
      6,
      'CH',
      'A família do CH',
      'Use CHA, CHE, CHI, CHO ou CHU. Digite somente a parte que falta.',
      [
        campo('__ve', 'cha'),
        campo('__iro', 'che'),
        campo('__clete', 'chi'),
        campo('__colate', 'cho'),
        campo('__va', 'chu'),
      ],
      'Junte cada opção ao final da palavra e veja qual forma uma palavra conhecida.'
    ),
    questao(
      7,
      'CH',
      'Escolha a escrita com CH',
      'Leia a pista e escolha a palavra escrita corretamente.',
      [
        opcao('Cai das nuvens.', ['chuva', 'xuva'], 'chuva'),
        opcao('Usamos para abrir a fechadura.', ['xave', 'chave'], 'chave'),
        opcao('Comemos no recreio.', ['lanxe', 'lanche'], 'lanche'),
        opcao('Leva o material escolar.', ['mochila', 'moxila'], 'mochila'),
        opcao('É um animal que late.', ['caxorro', 'cachorro'], 'cachorro'),
      ],
      'Nestas palavras, o som estudado é escrito com C e H juntos.'
    ),
    ditado(
      8,
      'CH',
      'Ouça e escreva com CH',
      ['chuva', 'chave', 'lanche', 'mochila'],
      'Ouça uma palavra por vez e digite. Um adulto também pode ditar.',
      'Repita a palavra e confira onde aparece o CH.'
    ),
    questao(
      9,
      'NH',
      'A família do NH',
      'Junte NH com a vogal indicada. Escolha a combinação formada.',
      [
        opcao('NH + A', ['NHA', 'NHE', 'NHI'], 'NHA'),
        opcao('NH + E', ['NHO', 'NHE', 'NHU'], 'NHE'),
        opcao('NH + I', ['NHE', 'NHA', 'NHI'], 'NHI'),
        opcao('NH + O', ['NHU', 'NHO', 'NHA'], 'NHO'),
        opcao('NH + U', ['NHU', 'NHI', 'NHE'], 'NHU'),
      ],
      'Mantenha N e H juntos e observe a vogal que vem depois.'
    ),
    questao(
      10,
      'NH',
      'Palavras com NH',
      'Escolha a escrita correta de cada palavra.',
      [
        opcao('Onde o pássaro põe os ovos.', ['nino', 'ninho'], 'ninho'),
        opcao('A ave que bota ovos no galinheiro.', ['galinha', 'galina'], 'galinha'),
        opcao('Bichinho comprido que vive na terra.', ['minoca', 'minhoca'], 'minhoca'),
        opcao('Lugar da casa onde tomamos banho.', ['banheiro', 'baneiro'], 'banheiro'),
        opcao('A mulher que governa um reino.', ['raina', 'rainha'], 'rainha'),
      ],
      'Procure as duas letras que ficam juntas para formar o som de NH.'
    ),
    ditado(
      11,
      'NH',
      'Ouça e escreva com NH',
      ['ninho', 'banho', 'caminho', 'galinha'],
      'Ouça uma palavra por vez e digite. Um adulto também pode ditar.',
      'Ouça novamente e confira as letras no meio de cada palavra.'
    ),
    questao(
      12,
      'LH',
      'Complete com LH',
      'Digite somente lh para completar cada palavra.',
      [
        campo('abe__a', 'lh'),
        campo('mi__o', 'lh'),
        campo('fo__a', 'lh'),
        campo('coe__o', 'lh'),
        campo('o__o', 'lh'),
        campo('a__o', 'lh'),
      ],
      'O par tem duas letras: não deixe nenhuma de fora.'
    ),
    questao(
      13,
      'LH',
      'Leia os pares com LH',
      'Escolha a palavra escrita corretamente em cada par.',
      [
        opcao('Inseto que produz mel.', ['abeia', 'abelha'], 'abelha'),
        opcao('Animal de orelhas compridas.', ['coelho', 'coeio'], 'coelho'),
        opcao('Parte verde de uma planta.', ['foia', 'folha'], 'folha'),
        opcao('Grãos que podem virar pipoca.', ['milho', 'mio'], 'milho'),
      ],
      'Na escrita destas palavras, usamos L e H juntos.'
    ),
    ditado(
      14,
      'LH',
      'Ouça e escreva com LH',
      ['abelha', 'coelho', 'folha', 'milho'],
      'Ouça uma palavra por vez e digite. Um adulto também pode ditar.',
      'Repita a palavra e confira se escreveu o par LH.'
    ),
    questao(
      15,
      'Dígrafos',
      'Leia a pista e complete',
      'Leia cada pista e escolha CH, LH ou NH para completar a palavra.',
      [
        opcao('Animal comprido que vive na terra: mi__oca', ['CH', 'LH', 'NH'], 'NH'),
        opcao('Ave que bota ovos: gali__a', ['CH', 'LH', 'NH'], 'NH'),
        opcao('Animal que late: ca__orro', ['CH', 'LH', 'NH'], 'CH'),
        opcao('Parte do rosto usada para enxergar: o__o', ['CH', 'LH', 'NH'], 'LH'),
        opcao('Inseto vermelho com pintinhas: joani__a', ['CH', 'LH', 'NH'], 'NH'),
        opcao('Tempero branco usado na comida: a__o', ['CH', 'LH', 'NH'], 'LH'),
        opcao('Objeto que abre a fechadura: __ave', ['CH', 'LH', 'NH'], 'CH'),
        opcao('Animal de orelhas compridas: coe__o', ['CH', 'LH', 'NH'], 'LH'),
      ],
      'Use a pista para descobrir a palavra e pense nas duas letras que faltam.'
    ),
    questao(
      16,
      'Sílabas',
      'Palavras em pedacinhos',
      'Escolha a separação silábica correta. CH, LH e NH ficam juntos.',
      [
        opcao('chuva', ['chu-va', 'c-hu-va', 'chuv-a'], 'chu-va'),
        opcao('galinha', ['ga-lin-ha', 'ga-li-nha', 'gali-nha'], 'ga-li-nha'),
        opcao('abelha', ['a-bel-ha', 'abe-lha', 'a-be-lha'], 'a-be-lha'),
        opcao('coelho', ['co-e-lho', 'coel-ho', 'coe-lho'], 'co-e-lho'),
      ],
      'Fale os pedaços devagar. O par de letras continua na mesma sílaba.'
    ),
    questao(
      17,
      'CH',
      'Coloque H depois do C',
      'Acrescente H depois do C e digite a nova palavra. Mantenha as outras letras e o til.',
      [
        campo('capa →', 'chapa'),
        campo('bico →', 'bicho'),
        campo('cão →', 'chão'),
        campo('taco →', 'tacho'),
        campo('cama →', 'chama'),
      ],
      'Mude apenas o que foi pedido: coloque H logo depois de C, sem apagar o til.'
    ),
    ditado(
      18,
      'Dígrafos',
      'Um ditado com três pares',
      ['chave', 'galinha', 'coelho'],
      'Ouça cada palavra e escreva com atenção. Um adulto também pode ditar.',
      'As palavras usam CH, NH ou LH. Confira o par de cada uma.'
    ),
    questao(
      19,
      'Sinônimos',
      'Palavras de sentido parecido',
      'Sinônimos têm sentido igual ou parecido. Escolha a resposta de cada item.',
      [
        opcao(
          'Sinônimos são palavras com...',
          ['sentidos contrários', 'sentidos iguais ou parecidos', 'o mesmo número de letras'],
          'sentidos iguais ou parecidos'
        ),
        opcao('bonito', ['belo', 'feio', 'sujo'], 'belo'),
        opcao('alegre', ['triste', 'zangado', 'contente'], 'contente'),
        opcao('infeliz', ['animado', 'triste', 'feliz'], 'triste'),
        opcao('preto', ['negro', 'branco', 'verde'], 'negro'),
        opcao('valente', ['medroso', 'cansado', 'corajoso'], 'corajoso'),
      ],
      'Procure a palavra que conserva a ideia, sem trocá-la pelo contrário.'
    ),
    questao(
      20,
      'Sinônimos',
      'Escolha o sinônimo',
      'Marque a palavra de sentido parecido.',
      [
        opcao('feliz', ['triste', 'alegre', 'bravo'], 'alegre'),
        opcao('rápido', ['veloz', 'parado', 'lento'], 'veloz'),
        opcao('casa', ['rua', 'praça', 'lar'], 'lar'),
        opcao('começar', ['terminar', 'iniciar', 'parar'], 'iniciar'),
      ],
      'Leia cada opção e pense se ela expressa uma ideia parecida.'
    ),
    questao(
      21,
      'Sinônimos',
      'A mesma ideia na frase',
      'Complete com a opção que mantém o sentido da primeira frase.',
      [
        opcao(
          'A menina estava feliz. Ela estava muito ____.',
          ['alegre', 'triste', 'zangada'],
          'alegre'
        ),
        opcao('O jardim ficou bonito. O jardim ficou ____.', ['feio', 'belo', 'sujo'], 'belo'),
        opcao(
          'O menino foi valente. Ele foi ____.',
          ['medroso', 'distraído', 'corajoso'],
          'corajoso'
        ),
      ],
      'Leia a frase completa com a opção escolhida e confira se a ideia continua a mesma.'
    ),
    questao(
      22,
      'Antônimos',
      'Palavras de sentido contrário',
      'Antônimos têm sentidos contrários. Escolha o contrário de cada palavra.',
      [
        opcao('sujo', ['escuro', 'limpo', 'molhado'], 'limpo'),
        opcao('feio', ['lindo', 'sujo', 'pesado'], 'lindo'),
        opcao('cheio', ['grande', 'largo', 'vazio'], 'vazio'),
        opcao('pesado', ['duro', 'leve', 'alto'], 'leve'),
      ],
      'Imagine a situação oposta: como fica algo sujo depois de ser lavado?'
    ),
    questao(
      23,
      'Antônimos',
      'Mais palavras contrárias',
      'Escolha a palavra que indica o contrário.',
      [
        opcao('pobre', ['rico', 'triste', 'calmo'], 'rico'),
        opcao('seco', ['leve', 'pequeno', 'molhado'], 'molhado'),
        opcao('alto', ['largo', 'baixo', 'claro'], 'baixo'),
        opcao('claro', ['escuro', 'limpo', 'vazio'], 'escuro'),
      ],
      'Procure a palavra de sentido oposto, e não apenas uma palavra diferente.'
    ),
    questao(
      24,
      'Antônimos',
      'O contrário dentro da frase',
      'Complete com o contrário da palavra em MAIÚSCULAS.',
      [
        opcao(
          'Um botão é PEQUENO. Comparada a ele, uma bola é ____.',
          ['leve', 'grande', 'redonda'],
          'grande'
        ),
        opcao(
          'No começo, o carrinho foi LENTO. Depois, ele ficou ____.',
          ['parado', 'quieto', 'veloz'],
          'veloz'
        ),
        opcao(
          'No conto, o leão era CALMO. Depois do feitiço, ficou ____.',
          ['feroz', 'tranquilo', 'sossegado'],
          'feroz'
        ),
        opcao(
          'A personagem estava FELIZ. Ao perder seu brinquedo, ficou ____.',
          ['contente', 'triste', 'alegre'],
          'triste'
        ),
      ],
      'Pense em como a situação mudou para o sentido contrário.'
    ),
    questao(
      25,
      'Frase',
      'Palavras em ordem',
      'Escolha a frase com sentido completo, maiúscula inicial e ponto-final.',
      [
        opcao(
          'Organize: ninho / a / para / voa / andorinha / o.',
          [
            'A ninho para voa andorinha o.',
            'a andorinha voa para o ninho.',
            'A andorinha voa para o ninho.',
            'A andorinha voa para o ninho',
          ],
          'A andorinha voa para o ninho.'
        ),
      ],
      'Confira quem faz a ação, o que faz e para onde vai. Observe também a primeira letra e o ponto.'
    ),
    questao(
      26,
      'S com som de Z',
      'Um reforço: o som do S',
      'Em cada grupo, escolha a palavra em que o S entre vogais tem som de Z.',
      [
        opcao('Grupo 1', ['casa', 'sapo', 'massa'], 'casa'),
        opcao('Grupo 2', ['sino', 'mesa', 'passeio'], 'mesa'),
        opcao('Grupo 3', ['passo', 'sopa', 'rosa'], 'rosa'),
        opcao('Grupo 4', ['camisa', 'sacola', 'osso'], 'camisa'),
        opcao('Grupo 5', ['selo', 'tesoura', 'pássaro'], 'tesoura'),
      ],
      'Fale a palavra em voz baixa e observe as vogais dos dois lados do S.'
    ),
    questao(
      27,
      'RR',
      'Um reforço: duas letras R',
      'Escolha a grafia correta. Nestas palavras, RR fica entre vogais.',
      [
        opcao('Veículo de quatro rodas.', ['carro', 'caro'], 'carro'),
        opcao('Animal que late.', ['cachoro', 'cachorro'], 'cachorro'),
        opcao('Um deslize que pode causar uma queda.', ['escorregão', 'escoregão'], 'escorregão'),
      ],
      'Confira os dois R entre as vogais para manter o som forte.'
    ),
    questao(
      28,
      'Dígrafos',
      'Complete as frases',
      'Use cada palavra do banco uma vez: galinha, chave, coelho.',
      [
        campo('A ____ bota ovos no galinheiro.', 'galinha'),
        campo('Peguei a ____ para abrir a fechadura da porta.', 'chave'),
        campo('O ____ de orelhas compridas pulou pelo jardim.', 'coelho'),
      ],
      'Escolha apenas entre as três palavras do banco e confira qual combina com cada frase.'
    ),
    ditado(
      29,
      'Frase',
      'Uma frase com CH, NH e LH',
      ['A galinha achou o milho.'],
      'Ouça e escreva a frase com maiúscula inicial e ponto-final. Um adulto também pode ditar.',
      'Confira a primeira letra, o ponto-final e os pares CH, NH e LH.',
      true
    ),
    questao(
      30,
      'Mini simulado',
      'Vamos revisar?',
      'Escolha uma resposta para cada item. Lembre o que você praticou.',
      [
        opcao(
          'Qual opção apresenta um conto?',
          [
            'Uma lista de compras.',
            'Uma história em que um gato perde a cesta e depois a encontra.',
            'Instruções para fazer um bolo.',
          ],
          'Uma história em que um gato perde a cesta e depois a encontra.'
        ),
        opcao('Objeto que abre a fechadura: __ave', ['CH', 'LH', 'NH'], 'CH'),
        opcao('Lugar onde o passarinho põe os ovos: ni__o', ['CH', 'LH', 'NH'], 'NH'),
        opcao('Animal de orelhas compridas que pula: coe__o', ['CH', 'LH', 'NH'], 'LH'),
        opcao('Qual é o sinônimo de alegre?', ['contente', 'triste', 'zangado'], 'contente'),
        opcao('Qual é o antônimo de cheio?', ['pesado', 'grande', 'vazio'], 'vazio'),
        opcao('Em qual palavra S tem som de Z?', ['sapo', 'mesa', 'massa'], 'mesa'),
        opcao(
          'Qual palavra está escrita corretamente com RR?',
          ['caro', 'carro', 'caroro'],
          'carro'
        ),
      ],
      'Faça um item por vez: há histórias, pares de letras e sentidos de palavras.'
    ),
  ];

  questoes[24].itens[0].maiusculasObrigatorias = true;

  window.GramaticaQuestionarios.registrar({
    id: 'alice-gramatica-contos-digrafos-vocabulario',
    aluno: 'alice',
    nome: 'Alice',
    titulo: 'Contos, dígrafos e vocabulário',
    chave: 'revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1',
    layout: { desktopAmplo: true },
    resumoFinal:
      'Você concluiu 30 questões sobre contos, CH, NH, LH, sinônimos, antônimos, sílabas, frases, S com som de Z e RR!',
    questoes: questoes,
  });
})();
