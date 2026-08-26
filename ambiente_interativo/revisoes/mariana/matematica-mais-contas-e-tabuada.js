(function () {
  'use strict';

  function conta(id, bloco, titulo, enunciado, operacao, resposta, dica, sucesso) {
    return {
      id: 'mariana-nova-' + id,
      bloco: bloco,
      faixa: bloco.toLowerCase(),
      titulo: titulo,
      enunciado: enunciado,
      operacao: operacao,
      resposta: resposta,
      dica: dica,
      sucesso: sucesso,
    };
  }

  function multiplicacao(id, titulo, enunciado, itens, dica, sucesso) {
    return {
      id: 'mariana-nova-' + id,
      bloco: 'Multiplicação',
      faixa: 'tabuada',
      titulo: titulo,
      enunciado: enunciado,
      itens: itens,
      dica: dica,
      sucesso: sucesso,
    };
  }

  var questoes = [
    conta(
      'u01',
      'Unidades',
      'Botões coloridos',
      'Eu tinha 3 botões coloridos e encontrei mais 4. Quantos botões tenho agora?',
      '3 + 4 = ?',
      7,
      'Conte mais 4 a partir do número 3.',
      '3 mais 4 é igual a 7.'
    ),
    conta(
      'u02',
      'Unidades',
      'Biscoitos no prato',
      'Havia 8 biscoitos no prato e eu comi 5. Quantos biscoitos sobraram?',
      '8 − 5 = ?',
      3,
      'Retire 5 do grupo de 8.',
      'Sobraram 3 biscoitos.'
    ),
    conta(
      'u03',
      'Unidades',
      'Balões da festa',
      'Eu enchi 1 balão e depois enchi mais 7. Quantos balões estão cheios?',
      '1 + 7 = ?',
      8,
      'Junte o balão que já estava cheio com os outros 7.',
      'Agora há 8 balões cheios.'
    ),
    conta(
      'u04',
      'Unidades',
      'Petecas guardadas',
      'Eu tinha 9 petecas e emprestei 6. Quantas petecas ficaram comigo?',
      '9 − 6 = ?',
      3,
      'Volte 6 números a partir do 9.',
      'Ficaram 3 petecas.'
    ),
    conta(
      'u05',
      'Unidades',
      'Folhas desenhadas',
      'Eu desenhei em 5 folhas pela manhã e em mais 4 à tarde. Quantas folhas usei?',
      '5 + 4 = ?',
      9,
      'Some os dois grupos de folhas.',
      'Foram usadas 9 folhas.'
    ),
    conta(
      'd06',
      'Dezenas',
      'Figurinhas novas',
      'Eu tinha 16 figurinhas e ganhei mais 17 de um amiguinho. Quantas figurinhas tenho agora?',
      '16 + 17 = ?',
      33,
      '6 mais 7 forma 13; junte a nova dezena.',
      'Agora são 33 figurinhas.'
    ),
    conta(
      'd07',
      'Dezenas',
      'Lápis distribuídos',
      'Havia 53 lápis em uma caixa e 28 foram distribuídos. Quantos lápis sobraram?',
      '53 − 28 = ?',
      25,
      'Troque uma dezena por 10 unidades antes de retirar 8.',
      'Sobraram 25 lápis.'
    ),
    conta(
      'd08',
      'Dezenas',
      'Conchas encontradas',
      'Eu tinha 24 conchas e encontrei mais 39 na praia. Quantas conchas tenho ao todo?',
      '24 + 39 = ?',
      63,
      '4 mais 9 forma 13; depois some as dezenas.',
      'A coleção ficou com 63 conchas.'
    ),
    conta(
      'd09',
      'Dezenas',
      'Peças usadas',
      'Uma caixa tinha 76 peças e eu usei 34. Quantas peças sobraram?',
      '76 − 34 = ?',
      42,
      'Retire 4 unidades e depois 3 dezenas.',
      'Sobraram 42 peças.'
    ),
    conta(
      'd10',
      'Dezenas',
      'Pontos nas rodadas',
      'Eu marquei 48 pontos na primeira rodada e 27 na segunda. Quantos pontos marquei?',
      '48 + 27 = ?',
      75,
      '8 mais 7 forma 15; leve a nova dezena para a soma.',
      'Foram marcados 75 pontos.'
    ),
    conta(
      'd11',
      'Dezenas',
      'Livros emprestados',
      'Na estante havia 82 livros e 46 foram emprestados. Quantos livros ficaram?',
      '82 − 46 = ?',
      36,
      'Troque uma dezena antes de retirar 6 unidades.',
      'Ficaram 36 livros.'
    ),
    conta(
      'd12',
      'Dezenas',
      'Blocos reunidos',
      'Eu juntei uma caixa com 35 blocos e outra com 44. Quantos blocos há ao todo?',
      '35 + 44 = ?',
      79,
      'Some unidades com unidades e dezenas com dezenas.',
      'Há 79 blocos ao todo.'
    ),
    conta(
      'd13',
      'Dezenas',
      'Cartões entregues',
      'Eu tinha 93 cartões e entreguei 38. Quantos cartões sobraram?',
      '93 − 38 = ?',
      55,
      'Troque uma dezena para conseguir retirar as 8 unidades.',
      'Sobraram 55 cartões.'
    ),
    multiplicacao(
      'm14',
      'Multiplicar por 1',
      'Complete as quatro contas da tabuada do 1.',
      [
        { id: 'a', operacao: '1 × 3 =', resposta: 3 },
        { id: 'b', operacao: '1 × 6 =', resposta: 6 },
        { id: 'c', operacao: '1 × 9 =', resposta: 9 },
        { id: 'd', operacao: '1 × 10 =', resposta: 10 },
      ],
      'Multiplicar por 1 mantém o outro número.',
      'Todas as contas da tabuada do 1 estão corretas.'
    ),
    multiplicacao(
      'm15',
      'Dobrar com a tabuada do 2',
      'Complete as quatro multiplicações por 2.',
      [
        { id: 'a', operacao: '2 × 3 =', resposta: 6 },
        { id: 'b', operacao: '2 × 5 =', resposta: 10 },
        { id: 'c', operacao: '2 × 7 =', resposta: 14 },
        { id: 'd', operacao: '2 × 9 =', resposta: 18 },
      ],
      'Pense no dobro de cada número.',
      'As quatro multiplicações por 2 estão corretas.'
    ),
    multiplicacao(
      'm16',
      'Três grupos iguais',
      'Agora resolva quatro contas da tabuada do 3.',
      [
        { id: 'a', operacao: '3 × 1 =', resposta: 3 },
        { id: 'b', operacao: '3 × 4 =', resposta: 12 },
        { id: 'c', operacao: '3 × 6 =', resposta: 18 },
        { id: 'd', operacao: '3 × 8 =', resposta: 24 },
      ],
      'Na tabuada do 3, some o outro número três vezes.',
      'As quatro multiplicações por 3 estão corretas.'
    ),
    multiplicacao(
      'm17',
      'Tabuadas misturadas',
      'Resolva contas das tabuadas do 1, do 2 e do 3.',
      [
        { id: 'a', operacao: '1 × 8 =', resposta: 8 },
        { id: 'b', operacao: '2 × 4 =', resposta: 8 },
        { id: 'c', operacao: '3 × 5 =', resposta: 15 },
        { id: 'd', operacao: '2 × 10 =', resposta: 20 },
      ],
      'Confira se a conta pede manter, dobrar ou formar três grupos.',
      'Você acertou as três tabuadas misturadas.'
    ),
    multiplicacao(
      'm18',
      'Desafio final da tabuada',
      'Complete o último conjunto sem consultar a tabela.',
      [
        { id: 'a', operacao: '3 × 2 =', resposta: 6 },
        { id: 'b', operacao: '1 × 7 =', resposta: 7 },
        { id: 'c', operacao: '3 × 9 =', resposta: 27 },
        { id: 'd', operacao: '2 × 8 =', resposta: 16 },
      ],
      'Resolva uma conta de cada vez e confira o fator 1, 2 ou 3.',
      'Desafio final concluído.'
    ),
  ];

  window.MatematicaOperacoes.registrar({
    id: 'mariana-matematica-mais-contas-e-tabuada',
    perfil: 'mariana',
    titulo: 'Mais contas e tabuada',
    chaveArmazenamento: 'revisoesEscolares.mariana.matematica.maisContasETabuada.v1',
    estudoTabuada: { aposQuestaoId: 'mariana-nova-d13', fatores: [1, 2, 3] },
    questoes: questoes,
  });
})();
