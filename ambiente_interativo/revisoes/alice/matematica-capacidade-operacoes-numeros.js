(function () {
  'use strict';

  var ID = 'alice-matematica-capacidade-operacoes-numeros';
  var CHAVE = 'revisoesEscolares.alice.matematica.capacidadeOperacoesNumeros.v1';

  function questao(numero, id, assunto, titulo, objetivo, cena) {
    return {
      id: id,
      tipo: 'cena',
      rotulo: 'Questão ' + numero + ' de 30 · ' + assunto,
      titulo: titulo,
      objetivo: objetivo,
      cena: cena,
    };
  }

  function atividade(campos, visual, extras) {
    return Object.assign(
      {
        tipo: 'atividade-visual',
        titulo: 'Observe, pense e escreva',
        instrucao: 'Digite somente o número. A unidade já aparece ao lado.',
        visual: visual || {},
        campos: campos,
        dicas: ['Observe a ilustração com calma.', 'Confira cada número antes de continuar.'],
        mensagemErro:
          'Uma resposta ainda precisa de correção. Reveja a ilustração e tente novamente.',
      },
      extras || {}
    );
  }

  function operacao(numero, id, operador, superior, inferior, resposta, ajuda) {
    var sinalFalado = operador === '−' ? 'menos' : 'mais';
    return questao(
      numero,
      id,
      operador === '−' ? 'Subtração' : 'Adição',
      superior + ' ' + operador + ' ' + inferior,
      'Organize dezenas e unidades e escreva o resultado.',
      atividade(
        [
          {
            id: 'resultado',
            pergunta: superior + ' ' + operador + ' ' + inferior + ' =',
            resposta: resposta,
            rotuloAcessivel: 'Resultado de ' + superior + ' ' + sinalFalado + ' ' + inferior,
          },
        ],
        {
          tipo: 'operacao-du',
          superior: superior,
          inferior: inferior,
          operador: operador,
          rotulo: superior + ' ' + operador + ' ' + inferior,
          ajuda: ajuda,
        },
        {
          instrucao: 'Comece pelas unidades e depois cuide das dezenas.',
          dicas:
            operador === '−'
              ? [
                  'Transforme uma dezena em 10 unidades antes de retirar.',
                  'Depois da troca, subtraia unidades e dezenas.',
                ]
              : [
                  'Some primeiro as unidades.',
                  'Quando formar 10 unidades, troque-as por 1 dezena.',
                ],
          mensagemErro:
            operador === '−'
              ? 'A conta ainda não está certa. Use a troca mostrada, retire as unidades e tente novamente.'
              : 'A conta ainda não está certa. Some as unidades, faça a troca por uma dezena e tente novamente.',
        }
      )
    );
  }

  function ajudaSubtracao(superior) {
    var dezenas = Math.floor(superior / 10) - 1;
    var unidades = (superior % 10) + 10;
    return (
      'Troca para começar: ' +
      dezenas +
      ' dezenas e ' +
      unidades +
      ' unidades. Agora retire com calma.'
    );
  }

  var etapas = [
    {
      id: 'apresentacao-capacidade-contas-numeros',
      tipo: 'apresentacao',
      titulo: 'Capacidade, continhas e números',
      texto:
        'Alice, vamos comparar recipientes, resolver continhas com dezenas e unidades, brincar com números e fazer compras de faz de conta. Você pode corrigir tudo antes de avançar.',
    },
    questao(
      1,
      'q01-cabe-mais',
      'Capacidade',
      'Qual recipiente cabe mais?',
      'Selecione somente o recipiente que costuma guardar mais água.',
      {
        tipo: 'selecao-visual',
        titulo: 'Grande ou pequeno?',
        instrucao: 'Compare os tamanhos e escolha uma opção.',
        rotuloGrupo: 'Recipientes para comparar capacidade',
        itens: [
          { id: 'copo', rotulo: 'Copo', recipiente: 'copo' },
          { id: 'garrafa', rotulo: 'Garrafa', recipiente: 'garrafa' },
          { id: 'balde', rotulo: 'Balde', recipiente: 'balde' },
        ],
        resposta: ['balde'],
        dicas: ['Imagine qual deles ajuda a carregar mais água.', 'Compare o copo com o balde.'],
        mensagemErro: 'Compare novamente os três recipientes e deixe selecionado apenas o maior.',
      }
    ),
    questao(
      2,
      'q02-duas-jarras',
      'Capacidade',
      'Duas jarras para a mesa',
      'Uma jarra enche 4 copos. Descubra quantos copos duas jarras enchem.',
      atividade(
        [{ id: 'copos', pergunta: '2 jarras enchem quantos copos?', resposta: 8 }],
        {
          tipo: 'capacidade',
          rotuloAcessivel: 'Relação entre jarras e copos',
          grupos: [
            { tipo: 'jarra', quantidade: 1, rotulo: '1 jarra cheia' },
            { tipo: 'copo', quantidade: 4, rotulo: '4 copos' },
            { tipo: 'jarra', quantidade: 2, rotulo: '2 jarras cheias' },
          ],
          equacao: '4 copos + 4 copos = ? copos',
        },
        {
          mensagemErro:
            'Uma jarra enche 4 copos. Conte mais 4 copos para representar a segunda jarra.',
        }
      )
    ),
    questao(
      3,
      'q03-galao-garrafas',
      'Capacidade',
      'Do galão para as garrafas',
      'O galão tem 5 L e cada garrafa recebe 1 L.',
      atividade(
        [{ id: 'garrafas', pergunta: 'Quantas garrafas de 1 L ficam cheias?', resposta: 5 }],
        {
          tipo: 'capacidade',
          rotuloAcessivel: 'Um galão de cinco litros e garrafas de um litro',
          grupos: [
            { tipo: 'galao', quantidade: 1, rotulo: 'Galão', detalhe: '5 L' },
            { tipo: 'garrafa', quantidade: 1, rotulo: 'Cada garrafa', detalhe: '1 L' },
          ],
          equacao: '1 L + 1 L + 1 L + 1 L + 1 L = 5 L',
        },
        { mensagemErro: 'Conte quantas parcelas de 1 L aparecem para completar os 5 L.' }
      )
    ),
    questao(
      4,
      'q04-maior-medida',
      'Capacidade',
      'Qual medida representa mais?',
      'Observe as medidas e escolha somente o recipiente de maior capacidade.',
      {
        tipo: 'selecao-visual',
        titulo: 'Compare as medidas',
        instrucao: 'Lembre-se: 1 L corresponde a 1000 mL.',
        itens: [
          { id: 'copo-200', rotulo: 'Copo · 200 mL', recipiente: 'copo' },
          { id: 'caixa-250', rotulo: 'Caixa de suco · 250 mL', recipiente: 'caixa' },
          { id: 'jarra-1l', rotulo: 'Jarra · 1 L', recipiente: 'jarra' },
        ],
        resposta: ['jarra-1l'],
        dicas: ['Compare 200 mL, 250 mL e 1000 mL.', 'A jarra está medida em litro.'],
        mensagemErro: 'Converta 1 L em 1000 mL e compare novamente as três medidas.',
      }
    ),
    questao(
      5,
      'q05-dois-copos',
      'Capacidade',
      'Junte a capacidade de dois copos',
      'Cada copo tem 200 mL. Some as duas capacidades.',
      atividade(
        [{ id: 'total', pergunta: '200 mL + 200 mL', unidade: 'mL', resposta: 400 }],
        {
          tipo: 'capacidade',
          rotuloAcessivel: 'Dois copos com duzentos mililitros cada',
          grupos: [{ tipo: 'copo', quantidade: 2, rotulo: '2 copos', detalhe: '200 mL cada' }],
          equacao: '200 mL + 200 mL = ? mL',
        },
        { mensagemErro: 'Some 2 centenas: 200 mL mais 200 mL.' }
      )
    ),
    questao(
      6,
      'q06-um-litro-cinco-copos',
      'Capacidade',
      'Uma jarra enche cinco copos',
      'Observe como cinco parcelas de 200 mL completam 1 L.',
      atividade(
        [
          { id: 'copos', pergunta: 'Quantos copos de 200 mL aparecem?', resposta: 5 },
          { id: 'mililitros', pergunta: '1 L corresponde a', unidade: 'mL', resposta: 1000 },
        ],
        {
          tipo: 'capacidade',
          rotuloAcessivel: 'Uma jarra de um litro ao lado de cinco copos iguais',
          grupos: [
            { tipo: 'jarra', quantidade: 1, rotulo: '1 jarra', detalhe: '1 L' },
            { tipo: 'copo', quantidade: 5, rotulo: '5 copos', detalhe: '200 mL cada' },
          ],
          equacao: '200 + 200 + 200 + 200 + 200 = 1000 mL',
        },
        {
          instrucao: 'Conte os copos e complete a equivalência.',
          mensagemErro: 'Conte os cinco copos e observe o total mostrado na soma repetida.',
        }
      )
    ),
    questao(
      7,
      'q07-litro-ou-mililitro',
      'Capacidade',
      'Litro ou mililitro?',
      'Escolha a unidade mais adequada para cada recipiente.',
      {
        tipo: 'associacao-visual',
        titulo: 'L para grandes, mL para pequenos',
        instrucao: 'Abra cada lista e escolha L ou mL.',
        opcoes: ['L', 'mL'],
        itens: [
          { id: 'jarra', rotulo: 'Jarra grande', recipiente: 'jarra', resposta: 'L' },
          { id: 'galao', rotulo: 'Galão', recipiente: 'galao', resposta: 'L' },
          { id: 'balde', rotulo: 'Balde', recipiente: 'balde', resposta: 'L' },
          { id: 'copo', rotulo: 'Copo', recipiente: 'copo', resposta: 'mL' },
          { id: 'xicara', rotulo: 'Xícara', recipiente: 'xicara', resposta: 'mL' },
          { id: 'frasco', rotulo: 'Frasco pequeno', recipiente: 'frasco', resposta: 'mL' },
        ],
        dicas: [
          'Litros combinam com recipientes maiores.',
          'Mililitros combinam com pequenas porções.',
        ],
        mensagemErro:
          'Uma unidade ainda não combina com o tamanho do recipiente. Compare e corrija.',
      }
    ),
    operacao(8, 'q08-adicao-27-15', '+', 27, 15, 42),
    operacao(9, 'q09-adicao-36-28', '+', 36, 28, 64),
    operacao(10, 'q10-adicao-48-17', '+', 48, 17, 65),
    operacao(11, 'q11-adicao-59-26', '+', 59, 26, 85),
    operacao(12, 'q12-adicao-34-19', '+', 34, 19, 53),
    operacao(13, 'q13-subtracao-42-18', '−', 42, 18, 24, ajudaSubtracao(42)),
    operacao(14, 'q14-subtracao-51-26', '−', 51, 26, 25, ajudaSubtracao(51)),
    operacao(15, 'q15-subtracao-63-27', '−', 63, 27, 36, ajudaSubtracao(63)),
    operacao(16, 'q16-subtracao-70-35', '−', 70, 35, 35, ajudaSubtracao(70)),
    operacao(17, 'q17-subtracao-84-19', '−', 84, 19, 65, ajudaSubtracao(84)),
    questao(
      18,
      'q18-sequencia-1-a-10',
      'Números',
      'Complete de 1 a 10',
      'Coloque os três cartões nos espaços certos.',
      {
        tipo: 'sequencia',
        titulo: 'Números que faltam',
        instrucao: 'Complete a sequência crescente.',
        sequencia: [1, null, 3, 4, null, 6, 7, 8, null, 10],
        cartoes: [9, 2, 5],
        espacos: [
          { id: 'dois', posicao: 1, resposta: 2 },
          { id: 'cinco', posicao: 4, resposta: 5 },
          { id: 'nove', posicao: 8, resposta: 9 },
        ],
        dicas: ['Conte de um em um.', 'Observe o número que vem antes e depois de cada espaço.'],
      }
    ),
    questao(
      19,
      'q19-sequencia-11-a-20',
      'Números',
      'Continue até 20',
      'Complete os números que faltam entre 11 e 20.',
      {
        tipo: 'sequencia',
        titulo: 'A segunda dezena',
        instrucao: 'Coloque 13, 16 e 20 nos lugares corretos.',
        sequencia: [11, 12, null, 14, 15, null, 17, 18, 19, null],
        cartoes: [20, 13, 16],
        espacos: [
          { id: 'treze', posicao: 2, resposta: 13 },
          { id: 'dezesseis', posicao: 5, resposta: 16 },
          { id: 'vinte', posicao: 9, resposta: 20 },
        ],
        dicas: ['Depois de 12 vem 13.', 'O último número da sequência é 20.'],
      }
    ),
    questao(
      20,
      'q20-numeral-e-palavra',
      'Números',
      'Ligue o numeral ao nome',
      'Escolha o nome por extenso de cada número.',
      {
        tipo: 'associacao-visual',
        titulo: 'Números de 1 a 20',
        instrucao: 'Abra as listas e encontre a palavra correta.',
        opcoes: ['doze', 'catorze', 'dezesseis', 'dezenove', 'vinte'],
        itens: [
          { id: 'n14', rotulo: '14', simbolo: '14', resposta: 'catorze' },
          { id: 'n16', rotulo: '16', simbolo: '16', resposta: 'dezesseis' },
          { id: 'n19', rotulo: '19', simbolo: '19', resposta: 'dezenove' },
          { id: 'n20', rotulo: '20', simbolo: '20', resposta: 'vinte' },
        ],
        dicas: ['Leia a palavra inteira.', 'Dezenove começa com “deze”.'],
        mensagemErro: 'Um numeral ainda está ligado ao nome errado. Leia cada palavra novamente.',
      }
    ),
    questao(
      21,
      'q21-monte-17',
      'Dezenas e unidades',
      'Monte o número 17',
      'Use uma dezena e sete unidades no quadro D–U.',
      {
        tipo: 'quadro',
        titulo: 'Uma dezena e sete unidades',
        instrucao: 'Escolha a barra de 10 e os cubinhos de 1.',
        ordens: 'D-U',
        valorAlvo: 17,
        representacaoAlvo: { D: 1, U: 7 },
        limites: { D: 2, U: 9 },
        trocas: false,
        mostrarDecomposicao: true,
        nivelAjuda: 'ampliada',
        dicas: ['A barra vale uma dezena.', 'Depois coloque 7 cubinhos na coluna U.'],
      }
    ),
    questao(
      22,
      'q22-componha-18',
      'Números',
      'Componha o número 18',
      'Escolha as duas parcelas que formam 18.',
      {
        tipo: 'composicao',
        titulo: 'Dez e mais oito',
        instrucao: 'Selecione 10 e 8 e coloque as parcelas.',
        numeroAlvo: 18,
        palavras: 'dezoito',
        cartoes: [10, 80, 8, 1, 18],
        resposta: [10, 8],
        ordemLivre: true,
        dicas: ['18 tem 1 dezena.', 'A parcela das unidades vale 8.'],
      }
    ),
    questao(
      23,
      'q23-dezenas-por-extenso',
      'Dezenas exatas',
      'Leia as dezenas exatas',
      'Escolha o nome correto de cada numeral.',
      {
        tipo: 'associacao-visual',
        titulo: 'Numeral e nome',
        instrucao: 'Relacione cada número à palavra.',
        opcoes: ['vinte', 'cinquenta', 'oitenta', 'cem'],
        itens: [
          { id: 'd20', rotulo: '20', simbolo: '20', resposta: 'vinte' },
          { id: 'd50', rotulo: '50', simbolo: '50', resposta: 'cinquenta' },
          { id: 'd80', rotulo: '80', simbolo: '80', resposta: 'oitenta' },
          { id: 'd100', rotulo: '100', simbolo: '100', resposta: 'cem' },
        ],
        dicas: ['Observe o primeiro algarismo.', '100 recebe o nome “cem”.'],
        mensagemErro: 'Uma dezena ainda está com o nome errado. Compare numeral e palavra.',
      }
    ),
    questao(
      24,
      'q24-completar-dezenas',
      'Dezenas exatas',
      'Complete os saltos de dez',
      'Coloque os números que faltam.',
      {
        tipo: 'sequencia',
        titulo: 'De dez em dez',
        instrucao: 'A sequência aumenta 10 a cada passo.',
        sequencia: [20, 30, null, 50, 60, null, 80],
        cartoes: [70, 40, 90],
        espacos: [
          { id: 'quarenta', posicao: 2, resposta: 40 },
          { id: 'setenta', posicao: 5, resposta: 70 },
        ],
        dicas: ['Depois de 30 vem 40.', 'Entre 60 e 80 fica 70.'],
      }
    ),
    questao(
      25,
      'q25-ordenar-dezenas',
      'Dezenas exatas',
      'Ordene do menor para o maior',
      'Organize quatro dezenas exatas em ordem crescente.',
      {
        tipo: 'sequencia',
        titulo: 'Qual vem primeiro?',
        instrucao: 'Coloque 20, 40, 60 e 90 em ordem.',
        sequencia: [null, null, null, null],
        cartoes: [90, 20, 60, 40],
        espacos: [
          { id: 'a', posicao: 0, resposta: 20 },
          { id: 'b', posicao: 1, resposta: 40 },
          { id: 'c', posicao: 2, resposta: 60 },
          { id: 'd', posicao: 3, resposta: 90 },
        ],
        dicas: ['Comece pelo número com menos dezenas.', '90 é o maior dos quatro.'],
      }
    ),
    questao(
      26,
      'q26-quantas-dezenas',
      'Dezenas exatas',
      'Quantas dezenas há?',
      'Complete os três números.',
      atividade(
        [
          { id: 'trinta', pergunta: '30 tem quantas dezenas?', resposta: 3 },
          { id: 'sessenta', pergunta: '60 tem quantas dezenas?', resposta: 6 },
          { id: 'noventa', pergunta: '90 tem quantas dezenas?', resposta: 9 },
        ],
        { texto: '1 dezena = 10 unidades' },
        {
          instrucao: 'Observe o algarismo das dezenas e complete.',
          mensagemErro: 'Uma quantidade de dezenas ainda precisa de correção. Conte de 10 em 10.',
        }
      )
    ),
    questao(
      27,
      'q27-carrinho-mercado',
      'Supermercado',
      'Quanto custa o carrinho?',
      'Some os três preços inteiros.',
      atividade(
        [{ id: 'total', pergunta: 'Total do carrinho', unidade: 'reais', resposta: 18 }],
        {
          tipo: 'mercado',
          rotuloAcessivel: 'Carrinho com arroz, macarrão e feijão, com os preços visíveis',
          itens: [
            { nome: 'Arroz', preco: 5, tipo: 'pacote' },
            { nome: 'Macarrão', preco: 4, tipo: 'pacote' },
            { nome: 'Feijão', preco: 9, tipo: 'pacote' },
          ],
        },
        { mensagemErro: 'Some 5, depois mais 4 e, por fim, mais 9.' }
      )
    ),
    questao(
      28,
      'q28-compra-com-vinte',
      'Supermercado',
      'Uma compra com 20 reais',
      'Calcule o total e quanto sobra de 20 reais.',
      atividade(
        [
          { id: 'total', pergunta: 'Total da compra', unidade: 'reais', resposta: 18 },
          { id: 'sobra', pergunta: 'Quanto sobra de 20 reais?', unidade: 'reais', resposta: 2 },
        ],
        {
          tipo: 'mercado',
          rotuloAcessivel: 'Carrinho com ovos, leite e atum, com os preços visíveis',
          itens: [
            { nome: 'Ovos', preco: 7, tipo: 'ovos' },
            { nome: 'Leite', preco: 5, tipo: 'caixa' },
            { nome: 'Atum', preco: 6, tipo: 'lata' },
          ],
        },
        {
          instrucao: 'Primeiro some a compra. Depois descubra quanto falta para 20.',
          mensagemErro: 'Confira o total dos três produtos e depois calcule 20 menos esse total.',
        }
      )
    ),
    questao(
      29,
      'q29-mini-capacidade',
      'Mini simulado',
      'Três desafios de capacidade',
      'Resolva um item de cada vez.',
      atividade(
        [
          { id: 'tres-copos', pergunta: '3 copos de 200 mL', unidade: 'mL', resposta: 600 },
          { id: 'duas-jarras', pergunta: '2 jarras de 4 copos', unidade: 'copos', resposta: 8 },
          { id: 'um-litro', pergunta: '1 L corresponde a', unidade: 'mL', resposta: 1000 },
        ],
        {
          tipo: 'capacidade',
          rotuloAcessivel: 'Copos e jarras para recordar as relações estudadas',
          grupos: [
            { tipo: 'copo', quantidade: 3, rotulo: '3 copos', detalhe: '200 mL cada' },
            { tipo: 'jarra', quantidade: 2, rotulo: '2 jarras', detalhe: '4 copos cada' },
            { tipo: 'jarra', quantidade: 1, rotulo: '1 jarra', detalhe: '1 L' },
          ],
        },
        {
          mensagemErro: 'Revise uma relação de cada vez: 200 mL, 4 copos e 1000 mL.',
        }
      )
    ),
    questao(
      30,
      'q30-mini-misto',
      'Mini simulado',
      'Missão final de números',
      'Resolva as quatro atividades curtas.',
      {
        tipo: 'mini',
        titulo: 'Capriche na missão final',
        instrucao: 'Digite os quatro resultados e confira tudo junto.',
        espacos: [
          { id: 'soma', pergunta: '28 + 17', resposta: 45 },
          { id: 'subtracao', pergunta: '61 − 26', resposta: 35 },
          { id: 'dezenas', pergunta: '70 tem quantas dezenas?', resposta: 7 },
          { id: 'sequencia', pergunta: 'Qual número vem depois de 19?', resposta: 20 },
        ],
        dicas: [
          'Resolva primeiro as unidades de cada conta.',
          'Depois confira as dezenas e a sequência até 20.',
        ],
        mensagemErro: 'Há um item para rever. Corrija somente o que precisar e confira novamente.',
      }
    ),
    {
      id: 'final-capacidade-contas-numeros',
      tipo: 'final',
      titulo: 'Você completou a aventura!',
      texto:
        'Você comparou capacidades, resolveu continhas com troca, reconheceu números e fez compras de brincadeira. Volte quando quiser para praticar novamente.',
    },
  ];

  window.MatematicaRevisoes.registrar({
    id: ID,
    aluno: 'alice',
    titulo: 'Capacidade, continhas e números',
    descricao: '32 etapas com capacidade, operações, números e supermercado',
    chaveArmazenamento: CHAVE,
    etapas: etapas,
  });
})();
