(function () {
  'use strict';

  function questao(id, bloco, titulo, enunciado, operacao, resposta, dica, sucesso) {
    return {
      id: id,
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

  var questoes = [
    questao(
      'alice-u01',
      'Unidades',
      'Adesivos coloridos',
      'Alice separou 3 adesivos e ganhou mais 4. Quantos adesivos ela tem agora?',
      '3 + 4 = ?',
      7,
      'Junte os 3 adesivos com os outros 4.',
      '3 mais 4 é igual a 7.'
    ),
    questao(
      'alice-u02',
      'Unidades',
      'Morangos do lanche',
      'Alice tinha 9 morangos e comeu 5. Quantos morangos sobraram?',
      '9 − 5 = ?',
      4,
      'Comece em 9 e retire 5.',
      'Sobraram 4 morangos.'
    ),
    questao(
      'alice-u03',
      'Unidades',
      'Conchinhas na coleção',
      'Alice encontrou 2 conchinhas e depois encontrou mais 6. Quantas conchinhas ela reuniu?',
      '2 + 6 = ?',
      8,
      'Conte 6 a partir do número 2.',
      'Alice reuniu 8 conchinhas.'
    ),
    questao(
      'alice-u04',
      'Unidades',
      'Lápis emprestados',
      'Alice tinha 8 lápis e emprestou 3. Com quantos lápis ela ficou?',
      '8 − 3 = ?',
      5,
      'Retire 3 lápis do grupo de 8.',
      'Alice ficou com 5 lápis.'
    ),
    questao(
      'alice-u05',
      'Unidades',
      'Balões da festa',
      'Alice encheu 5 balões e sua irmã encheu mais 4. Quantos balões foram enchidos?',
      '5 + 4 = ?',
      9,
      'Some os dois grupos de balões.',
      'Foram enchidos 9 balões.'
    ),
    questao(
      'alice-d06',
      'Dezenas',
      'Álbum de figurinhas',
      'Alice tinha 12 figurinhas e ganhou mais 18 de uma amiga. Quantas figurinhas ela tem agora?',
      '12 + 18 = ?',
      30,
      'Some primeiro as unidades e depois as dezenas.',
      'Alice ficou com 30 figurinhas.'
    ),
    questao(
      'alice-d07',
      'Dezenas',
      'Lápis de cor',
      'Havia 35 lápis de cor na caixa. Alice usou 12. Quantos lápis ficaram na caixa?',
      '35 − 12 = ?',
      23,
      'Retire 2 unidades e depois 1 dezena.',
      'Ficaram 23 lápis de cor.'
    ),
    questao(
      'alice-d08',
      'Dezenas',
      'Conchas da praia',
      'Alice guardou 24 conchas e recebeu mais 15. Quantas conchas há na coleção?',
      '24 + 15 = ?',
      39,
      'Some 4 com 5 e 2 dezenas com 1 dezena.',
      'A coleção tem 39 conchas.'
    ),
    questao(
      'alice-d09',
      'Dezenas',
      'Cartela de adesivos',
      'Uma cartela tinha 48 adesivos. Alice usou 26. Quantos adesivos sobraram?',
      '48 − 26 = ?',
      22,
      'Retire 6 unidades e 2 dezenas.',
      'Sobraram 22 adesivos.'
    ),
    questao(
      'alice-d10',
      'Dezenas',
      'Miçangas para pulseiras',
      'Alice tinha 31 miçangas e ganhou mais 27. Quantas miçangas ela tem?',
      '31 + 27 = ?',
      58,
      'Some as unidades e depois as dezenas.',
      'Alice tem 58 miçangas.'
    ),
    questao(
      'alice-d11',
      'Dezenas',
      'Livros na estante',
      'A estante tinha 64 livros. Foram retirados 21. Quantos livros permaneceram?',
      '64 − 21 = ?',
      43,
      'Retire 1 unidade e depois 2 dezenas.',
      'Permaneceram 43 livros.'
    ),
    questao(
      'alice-d12',
      'Dezenas',
      'Blocos de montar',
      'Alice juntou uma caixa com 46 blocos e outra com 32. Quantos blocos há ao todo?',
      '46 + 32 = ?',
      78,
      'Some 6 com 2 e depois 4 dezenas com 3 dezenas.',
      'Há 78 blocos ao todo.'
    ),
    questao(
      'alice-d13',
      'Dezenas',
      'Flores do jardim',
      'No jardim havia 73 flores. Foram colhidas 41. Quantas flores ficaram?',
      '73 − 41 = ?',
      32,
      'Retire 1 unidade e 4 dezenas.',
      'Ficaram 32 flores.'
    ),
    questao(
      'alice-d14',
      'Dezenas',
      'Pontos no jogo',
      'Alice marcou 28 pontos na primeira rodada e 36 na segunda. Quantos pontos marcou no total?',
      '28 + 36 = ?',
      64,
      '8 mais 6 forma 14; registre a unidade e junte a nova dezena.',
      'Alice marcou 64 pontos.'
    ),
    questao(
      'alice-d15',
      'Dezenas',
      'Giz de cera',
      'A escola tinha 90 gizes de cera e doou 37. Quantos gizes restaram?',
      '90 − 37 = ?',
      53,
      'Pense em quanto falta de 37 para chegar a 90.',
      'Restaram 53 gizes de cera.'
    ),
  ];

  window.MatematicaOperacoes.registrar({
    id: 'alice-matematica-contas-dia-a-dia',
    perfil: 'alice',
    titulo: 'Contas do dia a dia',
    chaveArmazenamento: 'revisoesEscolares.alice.matematica.contasDiaADia.v1',
    questoes: questoes,
  });
})();
