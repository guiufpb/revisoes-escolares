(function () {
  'use strict';

  function questao(id, bloco, titulo, enunciado, operacao, resposta, dica, sucesso, lembrete) {
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
      lembrete: Boolean(lembrete),
    };
  }

  var questoes = [
    questao(
      'mariana-u01',
      'Unidades',
      'Bolinhas de gude',
      'Mariana tinha 4 bolinhas de gude e ganhou mais 5. Quantas bolinhas ela tem agora?',
      '4 + 5 = ?',
      9,
      'Junte o grupo de 4 com o grupo de 5.',
      'Mariana ficou com 9 bolinhas.'
    ),
    questao(
      'mariana-u02',
      'Unidades',
      'Biscoitos do lanche',
      'Mariana tinha 9 biscoitos e dividiu 3 com os amigos. Quantos biscoitos sobraram?',
      '9 − 3 = ?',
      6,
      'Retire 3 do grupo de 9.',
      'Sobraram 6 biscoitos.'
    ),
    questao(
      'mariana-u03',
      'Unidades',
      'Cartinhas novas',
      'Mariana tinha 2 cartinhas e recebeu mais 7. Quantas cartinhas ela reuniu?',
      '2 + 7 = ?',
      9,
      'Conte mais 7 a partir do número 2.',
      'Mariana reuniu 9 cartinhas.'
    ),
    questao(
      'mariana-u04',
      'Unidades',
      'Fitas para o trabalho',
      'Mariana tinha 8 fitas e usou 6. Quantas fitas ficaram?',
      '8 − 6 = ?',
      2,
      'Retire 6 fitas do grupo de 8.',
      'Ficaram 2 fitas.'
    ),
    questao(
      'mariana-u05',
      'Unidades',
      'Carrinhos de brinquedo',
      'Mariana colocou 6 carrinhos na pista e acrescentou mais 3. Quantos carrinhos estão na pista?',
      '6 + 3 = ?',
      9,
      'Some os dois grupos de carrinhos.',
      'Há 9 carrinhos na pista.'
    ),
    questao(
      'mariana-d06',
      'Dezenas',
      'Cartões da coleção',
      'Mariana tinha 14 cartões e ganhou mais 17. Quantos cartões ela tem agora?',
      '14 + 17 = ?',
      31,
      'Some as unidades e lembre da nova dezena formada.',
      'Mariana tem 31 cartões.'
    ),
    questao(
      'mariana-d07',
      'Dezenas',
      'Revistas em quadrinhos',
      'Mariana tinha 43 revistas e emprestou 21. Com quantas revistas ela ficou?',
      '43 − 21 = ?',
      22,
      'Retire 1 unidade e depois 2 dezenas.',
      'Mariana ficou com 22 revistas.'
    ),
    questao(
      'mariana-d08',
      'Dezenas',
      'Selos no álbum',
      'O álbum tinha 26 selos e Mariana colocou mais 33. Quantos selos há agora?',
      '26 + 33 = ?',
      59,
      'Some unidades com unidades e dezenas com dezenas.',
      'O álbum tem 59 selos.'
    ),
    questao(
      'mariana-d09',
      'Dezenas',
      'Contas para colares',
      'Mariana tinha 57 contas coloridas e usou 24. Quantas contas sobraram?',
      '57 − 24 = ?',
      33,
      'Retire 4 unidades e 2 dezenas.',
      'Sobraram 33 contas coloridas.'
    ),
    questao(
      'mariana-d10',
      'Dezenas',
      'Pontos no desafio',
      'Mariana marcou 38 pontos e depois ganhou mais 27. Quantos pontos tem no total?',
      '38 + 27 = ?',
      65,
      '8 mais 7 forma 15; leve a nova dezena para a coluna das dezenas.',
      'Mariana tem 65 pontos.'
    ),
    questao(
      'mariana-d11',
      'Dezenas',
      'Lápis para doação',
      'Uma caixa tinha 82 lápis. Mariana separou 46 para doar. Quantos lápis ficaram?',
      '82 − 46 = ?',
      36,
      'Troque uma dezena por 10 unidades antes de retirar 6.',
      'Ficaram 36 lápis.'
    ),
    questao(
      'mariana-d12',
      'Dezenas',
      'Livros da sala',
      'A sala tinha 45 livros e recebeu mais 29. Quantos livros há agora?',
      '45 + 29 = ?',
      74,
      '5 mais 9 forma 14; junte a nova dezena.',
      'A sala agora tem 74 livros.'
    ),
    questao(
      'mariana-d13',
      'Dezenas',
      'Peças do quebra-cabeça',
      'Mariana tinha 96 peças e já encaixou 38. Quantas peças ainda faltam encaixar?',
      '96 − 38 = ?',
      58,
      'Troque uma dezena para conseguir retirar 8 unidades.',
      'Ainda faltam 58 peças.'
    ),
    questao(
      'mariana-d14',
      'Dezenas',
      'Adesivos no caderno',
      'Mariana colou 67 adesivos e ganhou mais 25. Quantos adesivos terá ao todo?',
      '67 + 25 = ?',
      92,
      '7 mais 5 forma 12; some a nova dezena.',
      'Mariana terá 92 adesivos.'
    ),
    questao(
      'mariana-c15',
      'Centenas',
      'Centenas em dezenas',
      'Duas centenas correspondem a quantas dezenas?',
      '2 centenas = ? dezenas',
      20,
      'Cada centena tem 10 dezenas. Calcule 2 vezes 10.',
      '2 centenas são 20 dezenas.',
      true
    ),
    questao(
      'mariana-c16',
      'Centenas',
      'Centenas em unidades',
      'Três centenas correspondem a quantas unidades?',
      '3 centenas = ? unidades',
      300,
      'Cada centena tem 100 unidades. Calcule 3 vezes 100.',
      '3 centenas são 300 unidades.',
      true
    ),
    questao(
      'mariana-c17',
      'Centenas',
      'Cinco centenas',
      'Cinco centenas correspondem a quantas dezenas?',
      '5 centenas = ? dezenas',
      50,
      'Conte 10 dezenas para cada uma das 5 centenas.',
      '5 centenas são 50 dezenas.',
      true
    ),
    questao(
      'mariana-c18',
      'Centenas',
      'Sete centenas',
      'Sete centenas correspondem a quantas unidades?',
      '7 centenas = ? unidades',
      700,
      'Cada centena vale 100 unidades.',
      '7 centenas são 700 unidades.',
      true
    ),
    questao(
      'mariana-c19',
      'Centenas',
      'O número depois de 100',
      'Escreva no teclado o resultado da conta abaixo.',
      '100 + 1 = ?',
      101,
      'Comece em 100 e avance uma unidade.',
      '100 mais 1 é igual a 101.'
    ),
    questao(
      'mariana-c20',
      'Centenas',
      'Mais unidades depois de 100',
      'Escreva no teclado o resultado da conta abaixo.',
      '100 + 8 = ?',
      108,
      'Mantenha a centena e acrescente 8 unidades.',
      '100 mais 8 é igual a 108.'
    ),
  ];

  window.MatematicaOperacoes.registrar({
    id: 'mariana-matematica-contas-dia-a-dia',
    perfil: 'mariana',
    titulo: 'Contas do dia a dia',
    chaveArmazenamento: 'revisoesEscolares.mariana.matematica.contasDiaADia.v1',
    questoes: questoes,
  });
})();
