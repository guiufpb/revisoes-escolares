(function () {
  'use strict';

  function alternativa(pergunta, opcoes, resposta) {
    return { pergunta: pergunta, opcoes: opcoes, respostas: [resposta] };
  }

  function campo(pergunta, respostas, fraseCompleta, acentuacaoObrigatoria) {
    return {
      pergunta: pergunta,
      respostas: Array.isArray(respostas) ? respostas : [respostas],
      fraseCompleta: Boolean(fraseCompleta),
      acentuacaoObrigatoria: Boolean(acentuacaoObrigatoria),
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
      'H no início',
      'Encontre as palavras com H',
      'Marque a escrita correta. No início dessas palavras, o H não tem som.',
      'opcoes',
      [
        alternativa('Um adulto do sexo masculino', ['omem', 'homem'], 'homem'),
        alternativa('O dia em que estamos', ['hoje', 'oje'], 'hoje'),
        alternativa('Sessenta minutos formam uma...', ['ora', 'hora'], 'hora'),
        alternativa('Um costume que repetimos', ['ábito', 'hábito'], 'hábito'),
      ],
      'Homem, hoje, hora e hábito começam com H, embora ele não seja pronunciado.',
      'Você reconheceu as palavras iniciadas por H!'
    ),
    questao(
      'q02',
      'H no início',
      'Complete com H',
      'Digite apenas a letra que falta no início de cada palavra.',
      'campos',
      [campo('_otel', 'h'), campo('_iena', 'h'), campo('_arpa', 'h'), campo('_élice', 'h')],
      'As palavras são hotel, hiena, harpa e hélice.',
      'Muito bem! Todas ficaram com H inicial.'
    ),
    questao(
      'q03',
      'H no início',
      'Qual vogal ouvimos primeiro?',
      'O H inicial fica silencioso. Marque a vogal cujo som aparece no começo de cada palavra.',
      'opcoes',
      [
        alternativa('homem', ['a', 'e', 'o'], 'o'),
        alternativa('hoje', ['i', 'o', 'u'], 'o'),
        alternativa('hora', ['a', 'o', 'u'], 'o'),
        alternativa('hábito', ['a', 'e', 'i'], 'a'),
      ],
      'Ignore o H e leia a vogal que vem logo depois dele.',
      'Você leu corretamente o H silencioso!'
    ),
    questao(
      'q04',
      'H no início',
      'O que acontece com o H?',
      'Escolha as afirmações corretas para esta revisão.',
      'opcoes',
      [
        alternativa(
          'Em homem e hora, o H inicial...',
          ['não é pronunciado', 'tem o som de R'],
          'não é pronunciado'
        ),
        alternativa(
          'Para escrever essas palavras corretamente, nós...',
          ['aprendemos e lembramos sua escrita', 'apagamos sempre o H'],
          'aprendemos e lembramos sua escrita'
        ),
        alternativa(
          'O H de algumas palavras pode ser explicado...',
          ['pela história e pela origem da palavra', 'pela vontade de quem escreve'],
          'pela história e pela origem da palavra'
        ),
      ],
      'O H inicial é silencioso, mas continua fazendo parte da escrita da palavra.',
      'Você compreendeu a regra introdutória!'
    ),
    questao(
      'q05',
      'Dígrafos',
      'H trabalhando com outra letra',
      'Marque o dígrafo destacado pelo som de cada palavra.',
      'opcoes',
      [
        alternativa('chave', ['ch', 'lh', 'nh'], 'ch'),
        alternativa('abelha', ['ch', 'lh', 'nh'], 'lh'),
        alternativa('vinho', ['ch', 'lh', 'nh'], 'nh'),
        alternativa('ninho', ['ch', 'lh', 'nh'], 'nh'),
      ],
      'CH, LH e NH são pares de letras que formam novos sons.',
      'Ótimo! Você diferenciou CH, LH e NH.'
    ),
    questao(
      'q06',
      'Dígrafo CH',
      'Complete com CHA, CHE, CHI, CHO ou CHU',
      'Digite a parte que falta em cada palavra.',
      'campos',
      [
        campo('_ve', 'cha'),
        campo('_iro', 'che'),
        campo('_clete', 'chi'),
        campo('_colate', 'cho'),
        campo('_va', 'chu'),
      ],
      'Leia: chave, cheiro, chiclete, chocolate e chuva.',
      'Você completou a família do CH!'
    ),
    questao(
      'q07',
      'Dígrafo CH',
      'Palavras com CH',
      'Complete cada palavra com ch.',
      'campos',
      [
        campo('_ave', 'ch'),
        campo('_uvoso', 'ch'),
        campo('lan_e', 'ch'),
        campo('ca_oeira', 'ch'),
        campo('fi_a', 'ch'),
      ],
      'As palavras são chave, chuvoso, lanche, cachoeira e ficha.',
      'Muito bem! O CH apareceu no início e no meio das palavras.'
    ),
    questao(
      'q08',
      'Dígrafo CH',
      'Uma letra muda a palavra',
      'Acrescente H depois do C e digite a nova palavra.',
      'campos',
      [
        campo('capa →', 'chapa'),
        campo('bico →', 'bicho'),
        campo('cão →', 'chão', false, true),
        campo('taco →', 'tacho'),
        campo('cama →', 'chama'),
      ],
      'Com H depois de C, formamos chapa, bicho, chão, tacho e chama.',
      'Excelente! Você percebeu como o H muda o som e a palavra.'
    ),
    questao(
      'q09',
      'Dígrafo LH',
      'Complete com LH',
      'Digite lh para terminar cada palavra.',
      'campos',
      [
        campo('abe_a', 'lh'),
        campo('fi_o', 'lh'),
        campo('pa_aço', 'lh'),
        campo('te_a', 'lh'),
        campo('fo_a', 'lh'),
      ],
      'Leia: abelha, filho, palhaço, telha e folha.',
      'Você formou palavras com LH!'
    ),
    questao(
      'q10',
      'Dígrafo NH',
      'Complete com NH',
      'Digite nh para terminar cada palavra.',
      'campos',
      [
        campo('vi_o', 'nh'),
        campo('ni_o', 'nh'),
        campo('gali_a', 'nh'),
        campo('mi_oca', 'nh'),
        campo('ba_eiro', 'nh'),
        campo('rai_a', 'nh'),
      ],
      'Leia: vinho, ninho, galinha, minhoca, banheiro e rainha.',
      'Muito bem! Você completou todas com NH.'
    ),
    questao(
      'q11',
      'Palavras com hífen',
      'O H depois do hífen',
      'Marque a forma correta das palavras compostas.',
      'opcoes',
      [
        alternativa('O herói muito forte', ['super-homem', 'super-omem'], 'super-homem'),
        alternativa(
          'Aquilo que não é higiênico',
          ['anti-higiênico', 'anti-igiênico'],
          'anti-higiênico'
        ),
      ],
      'Nesses exemplos, o hífen liga as partes e o H da segunda palavra é conservado.',
      'Você escreveu corretamente as palavras com hífen!'
    ),
    questao(
      'q12',
      'Interjeições',
      'Ah! Oh!',
      'Escolha a expressão que combina com cada situação.',
      'opcoes',
      [
        alternativa('Alguém entendeu uma explicação.', ['Ah!', 'Oh!'], 'Ah!'),
        alternativa('Alguém ficou admirado com uma surpresa.', ['Ah!', 'Oh!'], 'Oh!'),
        alternativa('Qual delas termina com H?', ['Ah!', 'Ei!'], 'Ah!'),
      ],
      'Em interjeições como ah! e oh!, o H também faz parte da escrita.',
      'Você reconheceu as interjeições com H!'
    ),
    questao(
      'q13',
      'Til (~)',
      'Para que serve o til?',
      'Marque as respostas corretas.',
      'opcoes',
      [
        alternativa(
          'O til mostra que a vogal tem som...',
          ['nasal', 'de CH', 'sempre mais forte'],
          'nasal'
        ),
        alternativa(
          'Em português, o til aparece sobre...',
          ['a e o', 'e e i', 'todas as vogais'],
          'a e o'
        ),
        alternativa(
          'O til...',
          ['não indica sozinho a sílaba mais forte', 'é sempre um acento de tonicidade'],
          'não indica sozinho a sílaba mais forte'
        ),
        alternativa(
          'Qual palavra tem til e também acento agudo?',
          ['órfão', 'avião', 'mãe'],
          'órfão'
        ),
      ],
      'O til é um sinal de nasalização usado sobre A e O. Ele não marca sozinho a sílaba tônica.',
      'Você entendeu a função principal do til!'
    ),
    questao(
      'q14',
      'Til (~)',
      'Digite as palavras com til',
      'Use o teclado e escreva cada palavra completa. O til é obrigatório.',
      'campos',
      [
        campo('A fruta: maca →', 'maçã', false, true),
        campo('O transporte que voa: aviao →', 'avião', false, true),
        campo('Parte do corpo: mao →', 'mão', false, true),
        campo('Ele coloca: poe →', 'põe', false, true),
        campo('Símbolo do amor: coracao →', 'coração', false, true),
      ],
      'Procure o til em ã ou õ: maçã, avião, mão, põe e coração.',
      'Ótima digitação! Todas as palavras têm som nasal.'
    ),
    questao(
      'q15',
      'Til (~)',
      'Observe as combinações',
      'Escolha a palavra que apresenta a combinação pedida.',
      'opcoes',
      [
        alternativa('ã', ['lã', 'lei', 'lua'], 'lã'),
        alternativa('ãs', ['rãs', 'reis', 'ruas'], 'rãs'),
        alternativa('ãe', ['mãe', 'meu', 'mio'], 'mãe'),
        alternativa('ães', ['pães', 'pais', 'pés'], 'pães'),
        alternativa('ão', ['leão', 'leio', 'lago'], 'leão'),
        alternativa('ãos', ['mãos', 'meses', 'mais'], 'mãos'),
        alternativa('ões', ['balões', 'balas', 'bolos'], 'balões'),
        alternativa('õe', ['põe', 'pode', 'pule'], 'põe'),
      ],
      'Leia devagar e observe ã, ãs, ãe, ães, ão, ãos, ões e õe.',
      'Você encontrou todas as combinações com til!'
    ),
    questao(
      'q16',
      'Til no plural',
      'Passe para o plural',
      'Digite a forma que indica mais de um. Mantenha o til.',
      'campos',
      [
        campo('um cão → dois', 'cães', false, true),
        campo('um pão → dois', 'pães', false, true),
        campo('um leão → dois', 'leões', false, true),
        campo('uma mão → duas', 'mãos', false, true),
        campo('um coração → dois', 'corações', false, true),
      ],
      'Os plurais são cães, pães, leões, mãos e corações.',
      'Muito bem! Você observou como as terminações mudam no plural.'
    ),
    questao(
      'q17',
      'Til no teclado',
      'Pratique o sinal de nasalização',
      'Digite as palavras completas com o til. Sem ele, a resposta ainda precisa ser corrigida.',
      'campos',
      [
        campo('A menina é minha...', 'irmã', false, true),
        campo('Voa no céu.', 'avião', false, true),
        campo('Enfeitam a festa.', 'balões', false, true),
        campo('Parte da manhã antes do meio-dia.', 'manhã', false, true),
      ],
      'Confira se o teclado colocou ã ou õ em cada palavra.',
      'Você usou o til corretamente no teclado!',
      true
    ),
    questao(
      'q18',
      'Lã ou lá',
      'Complete o pequeno texto',
      'Digite lá para indicar lugar e lã para nomear o material da roupa.',
      'campos',
      [
        campo('Quem mora ____ no polo Norte', 'lá', true, true),
        campo('usa sempre roupa de _____.', 'lã', true, true),
      ],
      'Lá indica lugar. Lã é o material usado para fazer roupas quentes.',
      'Perfeito! Você diferenciou lá e lã.'
    ),
    questao(
      'q19',
      'Acento circunflexo',
      'Complete com o acento correto',
      'Digite as palavras completas. O acento circunflexo (^) é obrigatório.',
      'campos',
      [
        campo('bebe →', 'bebê', false, true),
        campo('voce →', 'você', false, true),
        campo('avo, o pai do pai →', 'avô', false, true),
        campo('robo →', 'robô', false, true),
      ],
      'As palavras são bebê, você, avô e robô.',
      'Você colocou o circunflexo corretamente!'
    ),
    questao(
      'q20',
      'Avô e avó',
      'Quem é quem?',
      'Escolha a palavra que completa cada frase.',
      'opcoes',
      [
        alternativa('O pai da minha mãe é meu...', ['avô', 'avó'], 'avô'),
        alternativa('A mãe do meu pai é minha...', ['avô', 'avó'], 'avó'),
        alternativa('Qual palavra tem circunflexo?', ['avô', 'avó'], 'avô'),
        alternativa('Qual palavra tem acento agudo?', ['avô', 'avó'], 'avó'),
      ],
      'Avô nomeia o homem e leva circunflexo. Avó nomeia a mulher e leva acento agudo.',
      'Você diferenciou avô e avó!'
    ),
    questao(
      'q21',
      'Sinônimos',
      'Palavras de sentido parecido',
      'Marque o sinônimo de cada palavra.',
      'opcoes',
      [
        alternativa('feliz', ['alegre', 'triste', 'bravo'], 'alegre'),
        alternativa('longe', ['perto', 'distante', 'baixo'], 'distante'),
        alternativa('carro', ['automóvel', 'casa', 'barco'], 'automóvel'),
        alternativa('casa', ['rua', 'lar', 'escola'], 'lar'),
        alternativa('rápido', ['lento', 'veloz', 'parado'], 'veloz'),
      ],
      'Sinônimos têm sentidos iguais ou parecidos e ajudam a evitar repetições.',
      'Você encontrou os sinônimos!'
    ),
    questao(
      'q22',
      'Sinônimos do caderno',
      'Enriqueça o vocabulário',
      'Escolha a palavra de sentido parecido.',
      'opcoes',
      [
        alternativa('bonito', ['belo', 'feio', 'sujo'], 'belo'),
        alternativa('alegre', ['contente', 'sério', 'infeliz'], 'contente'),
        alternativa('infeliz', ['triste', 'feliz', 'calmo'], 'triste'),
        alternativa('preto', ['negro', 'claro', 'branco'], 'negro'),
        alternativa('valente', ['corajoso', 'medroso', 'lento'], 'corajoso'),
      ],
      'Belo, contente, triste, negro e corajoso mantêm sentidos parecidos.',
      'Seu vocabulário ficou ainda mais rico!'
    ),
    questao(
      'q23',
      'Sinônimos no texto',
      'Evite repetições',
      'Troque a palavra repetida por um sinônimo adequado.',
      'opcoes',
      [
        alternativa(
          'A menina estava feliz. A menina estava muito ____.',
          ['alegre', 'fechada', 'distante'],
          'alegre'
        ),
        alternativa(
          'O carro era rápido. O automóvel era muito ____.',
          ['veloz', 'vazio', 'escuro'],
          'veloz'
        ),
        alternativa('A casa é bonita. O ____ é belo.', ['lar', 'longe', 'alto'], 'lar'),
      ],
      'Use alegre no lugar de feliz, veloz no lugar de rápido e lar no lugar de casa.',
      'Muito bem! Os sinônimos evitaram repetições.'
    ),
    questao(
      'q24',
      'Antônimos',
      'Ideias contrárias',
      'Marque o antônimo de cada palavra.',
      'opcoes',
      [
        alternativa('feliz', ['alegre', 'triste', 'contente'], 'triste'),
        alternativa('longe', ['distante', 'perto', 'alto'], 'perto'),
        alternativa('grande', ['enorme', 'pequeno', 'largo'], 'pequeno'),
        alternativa('aberto', ['fechado', 'claro', 'vazio'], 'fechado'),
        alternativa('claro', ['branco', 'escuro', 'leve'], 'escuro'),
      ],
      'Antônimos apresentam ideias contrárias entre si.',
      'Você reconheceu as ideias contrárias!'
    ),
    questao(
      'q25',
      'Antônimos do caderno',
      'Desafio final de vocabulário',
      'Escolha o antônimo e termine a revisão.',
      'opcoes',
      [
        alternativa('sujo', ['limpo', 'molhado', 'escuro'], 'limpo'),
        alternativa('feio', ['lindo', 'sério', 'pobre'], 'lindo'),
        alternativa('cheio', ['vazio', 'pesado', 'baixo'], 'vazio'),
        alternativa('pesado', ['leve', 'grande', 'rico'], 'leve'),
        alternativa('pobre', ['rico', 'seco', 'calmo'], 'rico'),
        alternativa('seco', ['molhado', 'claro', 'veloz'], 'molhado'),
        alternativa('alto', ['baixo', 'feroz', 'pequeno'], 'baixo'),
        alternativa('calmo', ['feroz', 'lento', 'sorridente'], 'feroz'),
        alternativa('lento', ['veloz', 'leve', 'cheio'], 'veloz'),
      ],
      'Revise cada par: sujo/limpo, feio/lindo, cheio/vazio, pesado/leve, pobre/rico, seco/molhado, alto/baixo, calmo/feroz e lento/veloz.',
      'Parabéns! Você concluiu as 25 questões de Gramática!'
    ),
  ];

  window.GramaticaQuestionarios.registrar({
    id: 'alice-gramatica-h-til-vocabulario',
    perfil: 'alice',
    nome: 'Alice',
    chave: 'revisoesEscolares.alice.gramatica.hTilVocabulario.v1',
    questoes: questoes,
    resumoFinal: 'Você revisou H, dígrafos, til, circunflexo, sinônimos e antônimos.',
  });

  window.GramaticaQuestionarios.registrar({
    id: 'mariana-gramatica-h-til-vocabulario',
    perfil: 'mariana',
    nome: 'Mariana',
    chave: 'revisoesEscolares.mariana.gramatica.hTilVocabulario.v1',
    questoes: questoes,
    resumoFinal: 'Você revisou H, dígrafos, til, circunflexo, sinônimos e antônimos.',
  });
})();
