(function () {
  'use strict';

  function conta(id, bloco, titulo, enunciado, operacao, resposta, dica, sucesso) {
    return {
      id: 'alice-' + id,
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
      id: 'alice-' + id,
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
      'Estrelas brilhantes',
      'Eu tinha 2 estrelas adesivas e ganhei mais 6. Quantas estrelas tenho agora?',
      '2 + 6 = ?',
      8,
      'Conte mais 6 a partir do número 2.',
      '2 mais 6 é igual a 8.'
    ),
    conta(
      'u02',
      'Unidades',
      'Maçãs no cesto',
      'Havia 9 maçãs no cesto e 4 foram comidas. Quantas maçãs sobraram?',
      '9 − 4 = ?',
      5,
      'Retire 4 do grupo de 9.',
      'Sobraram 5 maçãs.'
    ),
    conta(
      'u03',
      'Unidades',
      'Lápis apontados',
      'Eu apontei 3 lápis e depois apontei mais 5. Quantos lápis apontei ao todo?',
      '3 + 5 = ?',
      8,
      'Junte o grupo de 3 com o grupo de 5.',
      'Foram apontados 8 lápis.'
    ),
    conta(
      'u04',
      'Unidades',
      'Carrinhos guardados',
      'Eu tinha 7 carrinhos e guardei 2 em outra caixa. Quantos ficaram comigo?',
      '7 − 2 = ?',
      5,
      'Volte 2 números a partir do 7.',
      'Ficaram 5 carrinhos.'
    ),
    conta(
      'u05',
      'Unidades',
      'Flores coloridas',
      'Eu colhi 4 flores amarelas e 5 flores vermelhas. Quantas flores colhi?',
      '4 + 5 = ?',
      9,
      'Some os dois grupos de flores.',
      'Foram colhidas 9 flores.'
    ),
    conta(
      'd06',
      'Dezenas',
      'Mais figurinhas',
      'Eu tinha 13 figurinhas e ganhei mais 19 de um amiguinho. Quantas figurinhas tenho agora?',
      '13 + 19 = ?',
      32,
      'Some as unidades e lembre da nova dezena formada.',
      'Agora são 32 figurinhas.'
    ),
    conta(
      'd07',
      'Dezenas',
      'Livros emprestados',
      'Na estante havia 42 livros e 17 foram emprestados. Quantos livros ficaram?',
      '42 − 17 = ?',
      25,
      'Troque uma dezena por 10 unidades antes de retirar 7.',
      'Ficaram 25 livros.'
    ),
    conta(
      'd08',
      'Dezenas',
      'Conchas da coleção',
      'Eu tinha 25 conchas e encontrei mais 34. Quantas conchas tenho ao todo?',
      '25 + 34 = ?',
      59,
      'Some unidades com unidades e dezenas com dezenas.',
      'A coleção tem 59 conchas.'
    ),
    conta(
      'd09',
      'Dezenas',
      'Peças usadas',
      'Uma caixa tinha 68 peças e eu usei 26. Quantas peças sobraram?',
      '68 − 26 = ?',
      42,
      'Retire 6 unidades e depois 2 dezenas.',
      'Sobraram 42 peças.'
    ),
    conta(
      'd10',
      'Dezenas',
      'Pontos no jogo',
      'Eu marquei 37 pontos na primeira rodada e 28 na segunda. Quantos pontos marquei?',
      '37 + 28 = ?',
      65,
      '7 mais 8 forma 15; junte a nova dezena.',
      'Foram marcados 65 pontos.'
    ),
    conta(
      'd11',
      'Dezenas',
      'Gizes de cera',
      'Havia 91 gizes de cera e 45 foram usados. Quantos gizes restaram?',
      '91 − 45 = ?',
      46,
      'Troque uma dezena antes de retirar 5 unidades.',
      'Restaram 46 gizes de cera.'
    ),
    conta(
      'd12',
      'Dezenas',
      'Blocos de montar',
      'Eu juntei uma caixa com 46 blocos e outra com 33. Quantos blocos há ao todo?',
      '46 + 33 = ?',
      79,
      'Some 6 com 3 e depois as dezenas.',
      'Há 79 blocos ao todo.'
    ),
    conta(
      'd13',
      'Dezenas',
      'Cartões distribuídos',
      'Eu tinha 84 cartões e distribuí 29. Quantos cartões sobraram?',
      '84 − 29 = ?',
      55,
      'Troque uma dezena para retirar as 9 unidades.',
      'Sobraram 55 cartões.'
    ),
    multiplicacao(
      'm14',
      'Multiplicar por 1',
      'Complete as quatro contas da tabuada do 1.',
      [
        { id: 'a', operacao: '1 × 2 =', resposta: 2 },
        { id: 'b', operacao: '1 × 5 =', resposta: 5 },
        { id: 'c', operacao: '1 × 8 =', resposta: 8 },
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
        { id: 'a', operacao: '2 × 1 =', resposta: 2 },
        { id: 'b', operacao: '2 × 2 =', resposta: 4 },
        { id: 'c', operacao: '2 × 4 =', resposta: 8 },
        { id: 'd', operacao: '2 × 8 =', resposta: 16 },
      ],
      'Pense no dobro de cada número.',
      'As quatro multiplicações por 2 estão corretas.'
    ),
    multiplicacao(
      'm16',
      'Tabuadas misturadas',
      'Agora resolva contas das tabuadas do 1 e do 2 juntas.',
      [
        { id: 'a', operacao: '1 × 7 =', resposta: 7 },
        { id: 'b', operacao: '2 × 3 =', resposta: 6 },
        { id: 'c', operacao: '1 × 9 =', resposta: 9 },
        { id: 'd', operacao: '2 × 6 =', resposta: 12 },
      ],
      'Nas contas por 2, some o outro número duas vezes.',
      'Você acertou as tabuadas misturadas.'
    ),
    multiplicacao(
      'm17',
      'Grupos iguais',
      'Descubra o total de cada conjunto de grupos iguais.',
      [
        { id: 'a', operacao: '2 × 5 =', resposta: 10 },
        { id: 'b', operacao: '1 × 6 =', resposta: 6 },
        { id: 'c', operacao: '2 × 9 =', resposta: 18 },
        { id: 'd', operacao: '1 × 3 =', resposta: 3 },
      ],
      'Use a ideia de dobro nas contas por 2.',
      'Todos os grupos iguais foram calculados corretamente.'
    ),
    multiplicacao(
      'm18',
      'Desafio final da tabuada',
      'Complete o último conjunto sem consultar a tabela.',
      [
        { id: 'a', operacao: '2 × 10 =', resposta: 20 },
        { id: 'b', operacao: '1 × 4 =', resposta: 4 },
        { id: 'c', operacao: '2 × 7 =', resposta: 14 },
        { id: 'd', operacao: '1 × 10 =', resposta: 10 },
      ],
      'Confira primeiro as contas por 1 e depois calcule os dobros.',
      'Desafio final concluído.'
    ),
  ];

  window.MatematicaOperacoes.registrar({
    id: 'alice-matematica-contas-e-tabuada',
    perfil: 'alice',
    titulo: 'Contas e tabuada',
    chaveArmazenamento: 'revisoesEscolares.alice.matematica.contasETabuada.v1',
    estudoTabuada: { aposQuestaoId: 'alice-d13' },
    questoes: questoes,
  });
})();
