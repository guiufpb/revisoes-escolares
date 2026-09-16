(function () {
  'use strict';

  var prefixo = 'alice-set26-';

  function simples(id, bloco, titulo, enunciado, operacao, resposta, dica, sucesso, apoioVisual) {
    return {
      id: prefixo + id,
      bloco: bloco,
      faixa: bloco.toLowerCase(),
      titulo: titulo,
      enunciado: enunciado,
      operacao: operacao,
      resposta: resposta,
      dica: dica,
      sucesso: sucesso,
      apoioVisual: apoioVisual || null,
    };
  }

  function multipla(id, bloco, titulo, enunciado, itens, dica, sucesso, opcoes) {
    opcoes = opcoes || {};
    return {
      id: prefixo + id,
      bloco: bloco,
      faixa: opcoes.faixa || bloco.toLowerCase(),
      titulo: titulo,
      enunciado: enunciado,
      itens: itens,
      dica: dica,
      sucesso: sucesso,
      tipoItens: opcoes.tipoItens || 'numericos',
      explicacao: opcoes.explicacao || 'Observe cada item e escreva todos os resultados.',
      rotuloItens: opcoes.rotuloItens || 'Escreva todos os resultados',
      apoioVisual: opcoes.apoioVisual || null,
    };
  }

  var questoes = [
    multipla(
      'q01',
      'Dezenas e unidades',
      'Leia o material dourado',
      'Observe as barras e os cubinhos. Depois complete as três respostas.',
      [
        { id: 'dezenas', rotulo: 'Quantas dezenas?', resposta: 3 },
        { id: 'unidades', rotulo: 'Quantas unidades?', resposta: 6 },
        { id: 'numero', rotulo: 'Qual número foi representado?', resposta: 36 },
      ],
      'Conte as barras de dez e depois os cubinhos separados.',
      'Você relacionou as peças, as ordens e o número 36.',
      {
        apoioVisual: {
          tipo: 'base-dez',
          dezenas: 3,
          unidades: 6,
          rotuloAcessivel: 'Material dourado com 3 barras de dez e 6 cubinhos.',
        },
      }
    ),
    multipla(
      'q02',
      'Dezenas e unidades',
      'Decomponha os números',
      'Separe cada número em dezenas e unidades.',
      [
        { id: '85-d', rotulo: '85: quantas dezenas?', resposta: 8 },
        { id: '85-u', rotulo: '85: quantas unidades?', resposta: 5 },
        { id: '93-d', rotulo: '93: quantas dezenas?', resposta: 9 },
        { id: '93-u', rotulo: '93: quantas unidades?', resposta: 3 },
        { id: '57-d', rotulo: '57: quantas dezenas?', resposta: 5 },
        { id: '57-u', rotulo: '57: quantas unidades?', resposta: 7 },
      ],
      'O algarismo da esquerda mostra as dezenas; o da direita mostra as unidades.',
      'As três decomposições estão corretas.'
    ),
    multipla(
      'q03',
      'Sequências',
      'Sequência dos 40',
      'Complete somente os números que faltam na faixa de 40 a 49.',
      [
        { id: 'n41', rotulo: 'Depois de 40', resposta: 41 },
        { id: 'n43', rotulo: 'Depois de 42', resposta: 43 },
        { id: 'n46', rotulo: 'Depois de 45', resposta: 46 },
        { id: 'n48', rotulo: 'Depois de 47', resposta: 48 },
      ],
      'Leia a faixa da esquerda para a direita, acrescentando 1.',
      'A sequência de 40 a 49 ficou completa.',
      {
        apoioVisual: {
          tipo: 'sequencia-numerica',
          valores: [40, null, 42, null, 44, 45, null, 47, null, 49],
          rotuloAcessivel: 'Faixa crescente de 40 a 49, com lacunas depois de 40, 42, 45 e 47.',
        },
      }
    ),
    multipla(
      'q04',
      'Sequências',
      'Sequência dos 50',
      'Complete somente os números que faltam na faixa de 50 a 59.',
      [
        { id: 'n52', rotulo: 'Depois de 51', resposta: 52 },
        { id: 'n54', rotulo: 'Depois de 53', resposta: 54 },
        { id: 'n58', rotulo: 'Depois de 57', resposta: 58 },
      ],
      'Continue contando de 1 em 1 até chegar a 59.',
      'A sequência de 50 a 59 ficou completa.',
      {
        apoioVisual: {
          tipo: 'sequencia-numerica',
          valores: [50, 51, null, 53, null, 55, 56, 57, null, 59],
          rotuloAcessivel: 'Faixa crescente de 50 a 59, com lacunas depois de 51, 53 e 57.',
        },
      }
    ),
    multipla(
      'q05',
      'Sequências',
      'Números vizinhos',
      'Para cada número do centro, escreva o anterior e o posterior.',
      [
        { id: '44-anterior', rotulo: 'Anterior de 44', resposta: 43 },
        { id: '44-posterior', rotulo: 'Posterior de 44', resposta: 45 },
        { id: '57-anterior', rotulo: 'Anterior de 57', resposta: 56 },
        { id: '57-posterior', rotulo: 'Posterior de 57', resposta: 58 },
        { id: '95-anterior', rotulo: 'Anterior de 95', resposta: 94 },
        { id: '95-posterior', rotulo: 'Posterior de 95', resposta: 96 },
      ],
      'Anterior é um a menos; posterior é um a mais.',
      'Você encontrou todos os vizinhos.',
      {
        apoioVisual: {
          tipo: 'vizinhos',
          alvos: [44, 57, 95],
          rotuloAcessivel:
            'Três linhas com o anterior à esquerda e o posterior à direita de 44, 57 e 95.',
        },
      }
    ),
    multipla(
      'q06',
      'Dezenas e unidades',
      'Leia o ábaco D/U',
      'Observe as duas hastes e complete as ordens e o número.',
      [
        { id: 'd', rotulo: 'D =', resposta: 5 },
        { id: 'u', rotulo: 'U =', resposta: 4 },
        { id: 'numero', rotulo: 'Número representado', resposta: 54 },
      ],
      'A haste D mostra dezenas; a haste U mostra unidades.',
      'Você leu corretamente 5 dezenas e 4 unidades.',
      {
        apoioVisual: {
          tipo: 'abaco-du',
          dezenas: 5,
          unidades: 4,
          rotuloAcessivel: 'Ábaco com 5 peças na haste D e 4 peças na haste U.',
        },
      }
    ),
    simples(
      'q07',
      'Dinheiro',
      'Conte o dinheiro',
      'As fichas são fictícias. Quanto há ao todo?',
      'R$ 10 + R$ 10 + R$ 2 + R$ 2 = ?',
      24,
      'Junte primeiro as duas fichas de 10 e depois as duas fichas de 2.',
      'As fichas somam R$ 24.',
      {
        tipo: 'fichas-dinheiro',
        valores: [10, 10, 2, 2],
        rotuloAcessivel: 'Quatro fichas monetárias fictícias: R$ 10, R$ 10, R$ 2 e R$ 2.',
      }
    ),
    multipla(
      'q08',
      'Operações',
      'Dezenas exatas',
      'Resolva as quatro contas com dezenas exatas.',
      [
        { id: 'a', operacao: '20 + 30 =', resposta: 50 },
        { id: 'b', operacao: '60 − 20 =', resposta: 40 },
        { id: 'c', operacao: '40 + 50 =', resposta: 90 },
        { id: 'd', operacao: '80 − 30 =', resposta: 50 },
      ],
      'Conte as dezenas e mantenha o zero das unidades.',
      'As quatro contas de dezenas exatas estão corretas.'
    ),
    multipla(
      'q09',
      'Operações',
      'Adição até 19',
      'Some cada par de números.',
      [
        { id: 'a', operacao: '12 + 4 =', resposta: 16 },
        { id: 'b', operacao: '13 + 5 =', resposta: 18 },
        { id: 'c', operacao: '10 + 9 =', resposta: 19 },
      ],
      'Comece pelo maior número e conte para a frente.',
      'As adições até 19 estão corretas.'
    ),
    multipla(
      'q10',
      'Operações',
      'Subtração até 19',
      'Retire a segunda quantidade em cada conta.',
      [
        { id: 'a', operacao: '18 − 4 =', resposta: 14 },
        { id: 'b', operacao: '17 − 5 =', resposta: 12 },
        { id: 'c', operacao: '16 − 7 =', resposta: 9 },
      ],
      'Conte para trás a partir do primeiro número.',
      'As subtrações até 19 estão corretas.'
    ),
    simples(
      'q11',
      'Estratégias',
      'Formando uma dezena',
      'Há 8 peças azuis e 7 amarelas. Duas amarelas completam o grupo de dez. Quanto é 8 + 7?',
      '8 + 7 = ?',
      15,
      'Depois de completar 10 com 8 + 2, conte as 5 peças amarelas que sobraram.',
      'Você formou uma dezena e encontrou o total.',
      {
        tipo: 'formando-dezena',
        grupoA: 8,
        grupoB: 7,
        rotuloAcessivel:
          'Oito peças azuis e sete amarelas. Duas amarelas completam um quadro de dez e cinco ficam fora.',
      }
    ),
    simples(
      'q12',
      'Operações',
      'Adição no quadro D/U',
      'Some as unidades e depois as dezenas.',
      '24 + 15 = ?',
      39,
      'Nas unidades, 4 + 5. Nas dezenas, 2 + 1.',
      'A conta 24 + 15 está correta.',
      {
        tipo: 'operacao-du',
        superior: 24,
        inferior: 15,
        operador: '+',
        rotulo: '24 mais 15 no quadro D/U',
        ajuda: 'As dezenas estão na coluna D e as unidades na coluna U.',
      }
    ),
    multipla(
      'q13',
      'Operações',
      'Somando dezenas',
      'Acrescente uma ou duas dezenas a cada número.',
      [
        { id: 'a', operacao: '32 + 10 =', resposta: 42 },
        { id: 'b', operacao: '46 + 20 =', resposta: 66 },
        { id: 'c', operacao: '71 + 10 =', resposta: 81 },
      ],
      'As unidades não mudam quando você soma dezenas exatas.',
      'Você somou as dezenas corretamente.'
    ),
    multipla(
      'q14',
      'Estratégias',
      'Adição por decomposição',
      'Decomponha 26 e 42; depois some dezenas, unidades e o total.',
      [
        { id: 'dezenas', operacao: '20 + 40 =', resposta: 60 },
        { id: 'unidades', operacao: '6 + 2 =', resposta: 8 },
        { id: 'total', rotulo: 'Total de 26 + 42', resposta: 68 },
      ],
      'Some as dezenas em um ramo e as unidades em outro antes de juntar tudo.',
      'A decomposição levou ao total 68.',
      {
        apoioVisual: {
          tipo: 'decomposicao',
          parcelas: [26, 42],
          rotuloAcessivel: '26 decomposto em 20 e 6; 42 decomposto em 40 e 2.',
        },
      }
    ),
    multipla(
      'q15',
      'Cálculo mental',
      'Cálculo mental: +9 e +11',
      'Use uma dezena como apoio para resolver mentalmente.',
      [
        { id: 'a', operacao: '42 + 9 =', resposta: 51 },
        { id: 'b', operacao: '36 + 11 =', resposta: 47 },
        { id: 'c', operacao: '58 + 9 =', resposta: 67 },
        { id: 'd', operacao: '72 + 11 =', resposta: 83 },
      ],
      'Para +9, faça +10 e −1. Para +11, faça +10 e +1.',
      'Você usou as estratégias de +9 e +11.'
    ),
    simples(
      'q16',
      'Reagrupamento',
      'Adição com reagrupamento',
      'As unidades das duas parcelas formam um grupo de dez. Calcule o total.',
      '27 + 16 = ?',
      43,
      '7 + 6 forma 13 unidades: troque 10 por 1 dezena e conserve 3 unidades.',
      'Você reagrupou as unidades e resolveu a adição.',
      {
        tipo: 'adicao-reagrupamento',
        primeira: 27,
        segunda: 16,
        rotuloAcessivel:
          '27 e 16 em material dourado. As 13 unidades permitem trocar 10 unidades por 1 dezena.',
      }
    ),
    multipla(
      'q17',
      'Reagrupamento',
      'Mais adições com reagrupamento',
      'Resolva as três adições. Reagrupe as unidades quando formar dez ou mais.',
      [
        { id: 'a', operacao: '58 + 25 =', resposta: 83 },
        { id: 'b', operacao: '39 + 29 =', resposta: 68 },
        { id: 'c', operacao: '48 + 34 =', resposta: 82 },
      ],
      'Some as unidades, forme a nova dezena e depois some as dezenas.',
      'As três adições com reagrupamento estão corretas.'
    ),
    simples(
      'q18',
      'Subtração',
      'Subtração sem troca',
      'Retire unidades de unidades e dezenas de dezenas.',
      '57 − 23 = ?',
      34,
      'Nas unidades, 7 − 3. Nas dezenas, 5 − 2.',
      'A subtração 57 − 23 está correta.',
      {
        tipo: 'operacao-du',
        superior: 57,
        inferior: 23,
        operador: '−',
        rotulo: '57 menos 23 no quadro D/U',
        ajuda: 'As ordens já permitem retirar sem fazer troca.',
      }
    ),
    simples(
      'q19',
      'Problemas',
      'Quanto a mais?',
      'Lia montou 67 blocos e Bia montou 52. Quantos blocos Lia montou a mais?',
      '67 − 52 = ?',
      15,
      'Para descobrir quanto a mais, calcule a diferença entre 67 e 52.',
      'Lia montou 15 blocos a mais.'
    ),
    simples(
      'q20',
      'Reagrupamento',
      'Subtração com reagrupamento',
      'Para retirar 8 unidades de 72, transforme uma dezena em 10 unidades e calcule.',
      '72 − 38 = ?',
      34,
      '72 pode ser visto como 6 dezenas e 12 unidades. Depois retire 3 dezenas e 8 unidades.',
      'Você preservou o valor na troca e resolveu a subtração.',
      {
        tipo: 'subtracao-reagrupamento',
        inicial: 72,
        retirarUnidades: 8,
        rotuloAcessivel:
          'Antes: 7 dezenas e 2 unidades. Depois da troca: 6 dezenas e 12 unidades, ainda valendo 72.',
      }
    ),
    multipla(
      'q21',
      'Reagrupamento',
      'Mais subtrações com reagrupamento',
      'Resolva as três subtrações fazendo a troca quando necessário.',
      [
        { id: 'a', operacao: '83 − 57 =', resposta: 26 },
        { id: 'b', operacao: '71 − 38 =', resposta: 33 },
        { id: 'c', operacao: '50 − 34 =', resposta: 16 },
      ],
      'Transforme uma dezena em 10 unidades antes de retirar as unidades.',
      'As três subtrações com reagrupamento estão corretas.'
    ),
    simples(
      'q22',
      'Dinheiro',
      'Dinheiro: quanto falta?',
      'Nina tem R$ 28 e um jogo custa R$ 36. Quanto falta para ela comprar o jogo?',
      '36 − 28 = ?',
      8,
      'Calcule a diferença entre o preço e o valor que Nina já tem.',
      'Faltam R$ 8 para Nina.',
      {
        tipo: 'comparacao-dinheiro',
        disponivel: 28,
        preco: 36,
        rotuloAcessivel: 'Nina tem R$ 28; o preço fictício do jogo é R$ 36.',
      }
    ),
    multipla(
      'q23',
      'Problemas',
      'Problema em duas etapas',
      'Uma equipe fez 34 pontos na primeira rodada e 27 na segunda. Depois perdeu 15 pontos por uma penalidade.',
      [
        { id: 'antes', operacao: '34 + 27 =', resposta: 61 },
        { id: 'depois', rotulo: 'Total depois de retirar 15 do primeiro resultado', resposta: 46 },
      ],
      'Resolva primeiro o total das duas rodadas; use esse resultado para retirar 15.',
      'As duas etapas do problema estão corretas.',
      { rotuloItens: 'Resolva na ordem' }
    ),
    multipla(
      'q24',
      'Mini simulado',
      'Mini simulado antes da tabuada',
      'Resolva os quatro desafios antes do momento de estudo.',
      [
        { id: 'du', rotulo: '6 dezenas e 4 unidades', resposta: 64 },
        { id: 'anterior', rotulo: 'Número anterior de 70', resposta: 69 },
        { id: 'adicao', operacao: '45 + 28 =', resposta: 73 },
        { id: 'subtracao', operacao: '92 − 37 =', resposta: 55 },
      ],
      'Confira dezenas e unidades, vizinho anterior e as duas operações.',
      'Mini simulado concluído. Agora você pode estudar as tabuadas do 2 e do 3.'
    ),
    multipla(
      'q25',
      'Multiplicação',
      'Tabuada do 2: começo',
      'Complete as quatro primeiras multiplicações por 2.',
      [
        { id: 'a', operacao: '2 × 1 =', resposta: 2 },
        { id: 'b', operacao: '2 × 2 =', resposta: 4 },
        { id: 'c', operacao: '2 × 3 =', resposta: 6 },
        { id: 'd', operacao: '2 × 4 =', resposta: 8 },
      ],
      'Pense nos dobros de 1, 2, 3 e 4.',
      'O começo da tabuada do 2 está correto.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
    multipla(
      'q26',
      'Multiplicação',
      'Tabuada do 2: continue',
      'Continue a tabuada do 2.',
      [
        { id: 'a', operacao: '2 × 5 =', resposta: 10 },
        { id: 'b', operacao: '2 × 6 =', resposta: 12 },
        { id: 'c', operacao: '2 × 7 =', resposta: 14 },
        { id: 'd', operacao: '2 × 8 =', resposta: 16 },
      ],
      'Cada novo resultado aumenta 2.',
      'Você continuou a tabuada do 2.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
    multipla(
      'q27',
      'Multiplicação',
      'Final do 2 e começo do 3',
      'Termine a tabuada do 2 e comece a do 3.',
      [
        { id: 'a', operacao: '2 × 9 =', resposta: 18 },
        { id: 'b', operacao: '2 × 10 =', resposta: 20 },
        { id: 'c', operacao: '3 × 1 =', resposta: 3 },
        { id: 'd', operacao: '3 × 2 =', resposta: 6 },
      ],
      'Use os dobros para o 2 e conte de 3 em 3 para começar a nova tabuada.',
      'Você terminou o 2 e começou o 3.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
    multipla(
      'q28',
      'Multiplicação',
      'Tabuada do 3: meio',
      'Complete a parte central da tabuada do 3.',
      [
        { id: 'a', operacao: '3 × 3 =', resposta: 9 },
        { id: 'b', operacao: '3 × 4 =', resposta: 12 },
        { id: 'c', operacao: '3 × 5 =', resposta: 15 },
        { id: 'd', operacao: '3 × 6 =', resposta: 18 },
      ],
      'Conte de 3 em 3: 9, 12, 15, 18.',
      'O meio da tabuada do 3 está correto.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
    multipla(
      'q29',
      'Multiplicação',
      'Tabuada do 3: final',
      'Complete os quatro últimos fatos da tabuada do 3.',
      [
        { id: 'a', operacao: '3 × 7 =', resposta: 21 },
        { id: 'b', operacao: '3 × 8 =', resposta: 24 },
        { id: 'c', operacao: '3 × 9 =', resposta: 27 },
        { id: 'd', operacao: '3 × 10 =', resposta: 30 },
      ],
      'Continue acrescentando 3 a cada resultado.',
      'Você completou a tabuada do 3.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
    multipla(
      'q30',
      'Multiplicação',
      'Desafio misturado',
      'Resolva fatos misturados das tabuadas do 2 e do 3.',
      [
        { id: 'a', operacao: '2 × 6 =', resposta: 12 },
        { id: 'b', operacao: '3 × 4 =', resposta: 12 },
        { id: 'c', operacao: '2 × 9 =', resposta: 18 },
        { id: 'd', operacao: '3 × 8 =', resposta: 24 },
      ],
      'Confira qual fator aparece em cada conta antes de responder.',
      'Desafio final concluído.',
      { tipoItens: 'multiplicacao', faixa: 'tabuada' }
    ),
  ];

  window.MatematicaOperacoes.registrar({
    id: 'alice-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026',
    perfil: 'alice',
    titulo: 'Dezenas, dinheiro, contas e tabuadas',
    chaveArmazenamento:
      'revisoesEscolares.alice.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1',
    estudoTabuada: { aposQuestaoId: prefixo + 'q24', fatores: [2, 3] },
    questoes: questoes,
  });
})();
