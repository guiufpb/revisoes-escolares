(function () {
  'use strict';

  var ID = 'mariana-matematica-formas-medidas-setembro-2026';
  var CHAVE = 'revisoesEscolares.mariana.matematica.formasMedidasSetembro2026.v1';

  function etapa(id, numero, bloco, titulo, objetivo, cena) {
    return {
      id: id,
      tipo: 'cena',
      rotulo: 'Questão ' + numero + ' de 30 · ' + bloco,
      titulo: titulo,
      objetivo: objetivo,
      cena: cena,
    };
  }

  function campos(respostas, visual, extras) {
    return Object.assign(
      {
        tipo: 'atividade-visual',
        titulo: 'Observe, pense e complete',
        instrucao: 'Digite somente os números. A unidade, quando necessária, aparece ao lado.',
        visual: visual || {},
        campos: respostas,
        dicas: ['Resolva um item de cada vez.', 'Confira todas as respostas antes de avançar.'],
      },
      extras || {}
    );
  }

  function equivalencias(id, numero, bloco, titulo, texto, respostas, mensagemErro) {
    return etapa(
      id,
      numero,
      bloco,
      titulo,
      'Complete todas as equivalências usando números inteiros.',
      campos(respostas, { texto: texto }, { mensagemErro: mensagemErro })
    );
  }

  function operacao(id, numero, titulo, contexto, superior, inferior, operador, unidade, resposta) {
    return etapa(
      id,
      numero,
      'Reagrupamento',
      titulo,
      contexto,
      campos(
        [
          {
            id: 'resultado',
            pergunta: superior + ' ' + operador + ' ' + inferior,
            unidade: unidade,
            resposta: resposta,
          },
        ],
        {
          tipo: 'operacao-du',
          superior: superior,
          inferior: inferior,
          operador: operador,
          rotulo: titulo,
          ajuda:
            operador === '+'
              ? 'Comece pelas unidades. Dez unidades formam uma nova dezena.'
              : 'Comece pelas unidades. Troque uma dezena por 10 unidades quando precisar.',
        },
        {
          instrucao: 'Organize dezenas e unidades e digite o resultado.',
          dicas: [
            'Comece pela coluna das unidades.',
            operador === '+'
              ? 'Veja se 10 unidades precisam formar 1 dezena.'
              : 'Veja se uma dezena precisa ser trocada por 10 unidades.',
          ],
          mensagemErro:
            'Revise primeiro as unidades e depois as dezenas. Faça a troca necessária e confira outra vez.',
        }
      )
    );
  }

  var figurasContagem = [
    ['circulo', 'janela-1', 'Janela circular para marcar durante a contagem'],
    ['triangulo', 'asa-1', 'Asa triangular para marcar durante a contagem'],
    ['retangulo', 'corpo-1', 'Parte retangular para marcar durante a contagem'],
    ['quadrado', 'painel-1', 'Painel quadrado para marcar durante a contagem'],
    ['circulo', 'janela-2', 'Janela circular para marcar durante a contagem'],
    ['quadrado', 'painel-2', 'Painel quadrado para marcar durante a contagem'],
    ['triangulo', 'asa-2', 'Asa triangular para marcar durante a contagem'],
    ['retangulo', 'corpo-2', 'Parte retangular para marcar durante a contagem'],
    ['triangulo', 'ponta-1', 'Ponta triangular para marcar durante a contagem'],
    ['circulo', 'roda-1', 'Roda circular para marcar durante a contagem'],
    ['quadrado', 'painel-3', 'Painel quadrado para marcar durante a contagem'],
    ['retangulo', 'base-1', 'Base retangular para marcar durante a contagem'],
    ['circulo', 'roda-2', 'Roda circular para marcar durante a contagem'],
    ['triangulo', 'ponta-2', 'Ponta triangular para marcar durante a contagem'],
    ['quadrado', 'painel-4', 'Painel quadrado para marcar durante a contagem'],
    ['triangulo', 'asa-3', 'Asa triangular para marcar durante a contagem'],
  ].map(function (item) {
    return { forma: item[0], id: item[1], rotulo: item[2] };
  });

  var coresMosaico = [
    { id: 'azul', rotulo: 'Azul', cor: '#72b7ff' },
    { id: 'rosa', rotulo: 'Rosa', cor: '#ef8fb6' },
  ];
  var celulasMosaico = Array.from({ length: 20 }).map(function (_, indice) {
    var linha = Math.floor(indice / 5);
    var coluna = indice % 5;
    return {
      id: 'mosaico-' + indice,
      fixa: linha < 2,
      resposta: coresMosaico[(linha + coluna) % coresMosaico.length].id,
    };
  });

  var etapas = [
    {
      id: 'apresentacao-formas-medidas-setembro',
      tipo: 'apresentacao',
      titulo: 'Formas e medidas — revisão 03/09',
      texto:
        'Mariana, nesta nova rodada você vai investigar figuras, comprimentos, massas e capacidades. No final, resolverá cinco contas com trocas entre dezenas e unidades. Você poderá corrigir cada tentativa antes de avançar.',
    },
    etapa(
      'q01-formas-cotidiano',
      1,
      'Formas',
      'Formas escondidas no cotidiano',
      'Relacione cada objeto à figura plana que mais lembra seu contorno principal.',
      {
        tipo: 'associacao-visual',
        titulo: 'Observe o contorno principal',
        instrucao: 'Abra cada lista e escolha uma figura.',
        opcoes: ['círculo', 'triângulo', 'retângulo', 'quadrado'],
        itens: [
          { id: 'prato', rotulo: 'Prato visto de frente', simbolo: '◉', resposta: 'círculo' },
          { id: 'barraca', rotulo: 'Frente de uma barraca', simbolo: '⛺', resposta: 'triângulo' },
          { id: 'porta', rotulo: 'Porta da sala', simbolo: '▯', resposta: 'retângulo' },
          {
            id: 'ladrilho',
            rotulo: 'Ladrilho com quatro lados iguais',
            simbolo: '▣',
            resposta: 'quadrado',
          },
        ],
        dicas: ['Imagine o objeto desenhado em uma folha e observe somente o contorno.'],
      }
    ),
    etapa(
      'q02-contagem-brinquedo',
      2,
      'Formas',
      'Conte as peças do brinquedo',
      'As peças abaixo formam um robô de brincar. Marque as que já contou e escreva os totais.',
      campos(
        [
          { id: 'circulos', pergunta: 'Círculos', resposta: 4 },
          { id: 'triangulos', pergunta: 'Triângulos', resposta: 5 },
          { id: 'retangulos', pergunta: 'Retângulos', resposta: 3 },
          { id: 'quadrados', pergunta: 'Quadrados', resposta: 4 },
        ],
        { tipo: 'contagem-formas' },
        {
          marcadores: figurasContagem,
          instrucao: 'Toque em uma peça para marcá-la. A marcação é um apoio e pode ser retirada.',
          mensagemErro:
            'Algum total precisa de revisão. Marque as peças e conte cada forma novamente.',
        }
      )
    ),
    etapa(
      'q03-lados-vertices',
      3,
      'Formas',
      'Lados e vértices em uma só investigação',
      'Complete os lados retos e os vértices das quatro figuras.',
      campos(
        [
          { id: 'triangulo-lados', pergunta: 'Triângulo: lados retos', resposta: 3 },
          { id: 'triangulo-vertices', pergunta: 'Triângulo: vértices', resposta: 3 },
          { id: 'retangulo-lados', pergunta: 'Retângulo: lados retos', resposta: 4 },
          { id: 'retangulo-vertices', pergunta: 'Retângulo: vértices', resposta: 4 },
          { id: 'quadrado-lados', pergunta: 'Quadrado: lados retos', resposta: 4 },
          { id: 'quadrado-vertices', pergunta: 'Quadrado: vértices', resposta: 4 },
          { id: 'circulo-lados', pergunta: 'Círculo: lados retos', resposta: 0 },
          { id: 'circulo-vertices', pergunta: 'Círculo: vértices', resposta: 0 },
        ],
        { texto: '△  ▭  □  ○' },
        {
          mensagemErro: 'Revise as pontas e os trechos retos. O círculo possui contorno curvo.',
        }
      )
    ),
    etapa(
      'q04-pistas-formas',
      4,
      'Formas',
      'Descubra cada figura pelas pistas',
      'Leia cada pista e escolha a figura correspondente.',
      {
        tipo: 'associacao-visual',
        titulo: 'Quem sou eu?',
        instrucao: 'Use lados, vértices e tipo de contorno para decidir.',
        opcoes: ['círculo', 'triângulo', 'retângulo', 'quadrado'],
        itens: [
          {
            id: 'tres',
            rotulo: 'Tenho 3 lados e 3 vértices.',
            simbolo: '?',
            resposta: 'triângulo',
          },
          {
            id: 'iguais',
            rotulo: 'Tenho 4 lados iguais e 4 vértices.',
            simbolo: '?',
            resposta: 'quadrado',
          },
          {
            id: 'curvo',
            rotulo: 'Meu contorno é curvo e não tenho vértices.',
            simbolo: '?',
            resposta: 'círculo',
          },
          {
            id: 'alongado',
            rotulo: 'Tenho 4 lados e pareço uma porta.',
            simbolo: '?',
            resposta: 'retângulo',
          },
        ],
        dicas: ['Compare cada pista com uma figura de cada vez.'],
      }
    ),
    etapa(
      'q05-sequencia-formas',
      5,
      'Formas',
      'Complete a sequência',
      'O grupo círculo, triângulo, quadrado se repete. Descubra os dois espaços.',
      {
        tipo: 'associacao-visual',
        titulo: '○  △  □  ○  __  □  ○  △  __',
        instrucao: 'Escolha a figura que mantém a repetição em cada espaço.',
        opcoes: ['círculo', 'triângulo', 'quadrado'],
        itens: [
          { id: 'espaco-1', rotulo: 'Primeiro espaço vazio', simbolo: '1', resposta: 'triângulo' },
          { id: 'espaco-2', rotulo: 'Segundo espaço vazio', simbolo: '2', resposta: 'quadrado' },
        ],
        dicas: ['Separe a sequência em grupos de três figuras.'],
      }
    ),
    etapa(
      'q06-veiculo-partes',
      6,
      'Formas',
      'Um veículo formado por partes',
      'O desenho usa duas rodas, uma carroceria e uma peça de cima. Selecione todas as formas presentes.',
      {
        tipo: 'selecao-visual',
        titulo: '◯  ▭  ◯  △',
        instrucao:
          'Marque as formas usadas no desenho acima. Toque outra vez para retirar uma escolha.',
        itens: [
          { id: 'circulo', rotulo: 'Círculo', forma: 'circulo' },
          { id: 'triangulo', rotulo: 'Triângulo', forma: 'triangulo' },
          { id: 'retangulo', rotulo: 'Retângulo', forma: 'retangulo' },
          { id: 'quadrado', rotulo: 'Quadrado', forma: 'quadrado' },
        ],
        resposta: ['circulo', 'triangulo', 'retangulo'],
        dicas: [
          'Compare o contorno de cada peça com as opções, sem contar quantas vezes ela aparece.',
        ],
      }
    ),
    etapa(
      'q07-mosaico',
      7,
      'Mosaico',
      'Continue o caminho de cores',
      'As duas primeiras linhas mostram como as cores se deslocam. Complete as duas últimas.',
      {
        tipo: 'mosaico',
        titulo: 'Mosaico de duas cores',
        instrucao: 'Escolha uma cor e pinte. Você pode apagar, desfazer ou limpar a tentativa.',
        colunas: 5,
        cores: coresMosaico,
        celulas: celulasMosaico,
        dicas: ['As cores se alternam. Cada nova linha começa com a cor diferente da anterior.'],
        mensagemErro: 'Alguma cor interrompe o caminho. Compare cada coluna com as linhas prontas.',
      }
    ),
    etapa(
      'q08-unidades-comprimento',
      8,
      'Comprimento',
      'Qual unidade combina?',
      'Relacione cada situação a milímetro, centímetro ou metro.',
      {
        tipo: 'associacao-visual',
        titulo: 'mm, cm ou m?',
        instrucao: 'Pense no tamanho e na precisão necessária.',
        opcoes: ['mm', 'cm', 'm'],
        itens: [
          {
            id: 'folha',
            rotulo: 'Espessura de algumas folhas juntas',
            simbolo: '≋',
            resposta: 'mm',
          },
          { id: 'estojo', rotulo: 'Comprimento de um estojo', simbolo: '▱', resposta: 'cm' },
          { id: 'corredor', rotulo: 'Comprimento de um corredor', simbolo: '↔', resposta: 'm' },
        ],
        dicas: ['Milímetros medem detalhes pequenos; metros medem distâncias maiores.'],
      }
    ),
    etapa(
      'q09-regua-cm',
      9,
      'Comprimento',
      'Leia a régua em centímetros',
      'A fita começa no zero. Observe a marca onde ela termina.',
      campos(
        [{ id: 'medida', pergunta: 'Comprimento da fita', unidade: 'cm', resposta: 9 }],
        { tipo: 'regua', maximo: 12, fim: 9, unidade: 'cm' },
        { mensagemErro: 'Leia a marca alcançada pela ponta da fita, começando no zero.' }
      )
    ),
    etapa(
      'q10-regua-mm',
      10,
      'Comprimento',
      'Leia a régua em milímetros',
      'A tira começa no zero e cada pequena marca vale um milímetro.',
      campos(
        [{ id: 'medida', pergunta: 'Comprimento da tira', unidade: 'mm', resposta: 8 }],
        { tipo: 'regua', maximo: 10, fim: 8, unidade: 'mm' },
        { mensagemErro: 'Conte as divisões de milímetro até a ponta da tira.' }
      )
    ),
    equivalencias(
      'q11-equivalencias-comprimento',
      11,
      'Comprimento',
      'Metros, centímetros e milímetros',
      '1 m = 100 cm   ·   1 cm = 10 mm',
      [
        { id: 'um-metro', pergunta: '1 metro corresponde a', unidade: 'cm', resposta: 100 },
        { id: 'dois-metros', pergunta: '2 metros correspondem a', unidade: 'cm', resposta: 200 },
        {
          id: 'cinco-centimetros',
          pergunta: '5 centímetros correspondem a',
          unidade: 'mm',
          resposta: 50,
        },
        {
          id: 'oito-centimetros',
          pergunta: '8 centímetros correspondem a',
          unidade: 'mm',
          resposta: 80,
        },
      ],
      'Use as relações mostradas e confira se a unidade aumenta ou diminui o número.'
    ),
    etapa(
      'q12-alturas',
      12,
      'Comprimento',
      'Compare três alturas',
      'Nina mede 118 cm, Ravi mede 125 cm e Sol mede 132 cm. Responda aos três itens.',
      {
        tipo: 'associacao-visual',
        titulo: 'Nina: 118 cm · Ravi: 125 cm · Sol: 132 cm',
        instrucao: 'Compare primeiro as centenas, depois as dezenas e unidades.',
        itens: [
          {
            id: 'mais-alta',
            rotulo: 'Quem é a criança mais alta?',
            simbolo: '↥',
            opcoes: ['Nina', 'Ravi', 'Sol'],
            resposta: 'Sol',
          },
          {
            id: 'mais-baixa',
            rotulo: 'Quem é a criança mais baixa?',
            simbolo: '↧',
            opcoes: ['Nina', 'Ravi', 'Sol'],
            resposta: 'Nina',
          },
          {
            id: 'resto-centimetros',
            rotulo: '125 cm = 1 m e quantos cm?',
            simbolo: '125',
            opcoes: ['18 cm', '25 cm', '32 cm'],
            resposta: '25 cm',
          },
        ],
        dicas: ['Um metro corresponde a 100 centímetros.'],
      }
    ),
    etapa(
      'q13-maior-menor-comprimento',
      13,
      'Comprimento',
      'Encontre o maior e o menor',
      'Compare as medidas de quatro fitas: azul 42 cm, verde 35 cm, coral 57 cm e lilás 28 cm.',
      {
        tipo: 'associacao-visual',
        titulo: 'Quatro fitas medidas',
        instrucao: 'Escolha a fita correta em cada comparação.',
        itens: [
          {
            id: 'maior',
            rotulo: 'Qual fita tem o maior comprimento?',
            simbolo: '↔',
            opcoes: ['azul', 'verde', 'coral', 'lilás'],
            resposta: 'coral',
          },
          {
            id: 'menor',
            rotulo: 'Qual fita tem o menor comprimento?',
            simbolo: '↔',
            opcoes: ['azul', 'verde', 'coral', 'lilás'],
            resposta: 'lilás',
          },
        ],
        dicas: ['O maior número indica a fita mais comprida.'],
      }
    ),
    etapa(
      'q14-instrumentos',
      14,
      'Comprimento',
      'Escolha o instrumento adequado',
      'Relacione cada medição ao instrumento mais prático.',
      {
        tipo: 'associacao-visual',
        titulo: 'Régua, fita métrica ou trena?',
        instrucao: 'Pense no formato e no tamanho do que será medido.',
        opcoes: ['régua', 'fita métrica', 'trena'],
        itens: [
          { id: 'lapis', rotulo: 'Comprimento de um lápis', simbolo: '✎', resposta: 'régua' },
          { id: 'cintura', rotulo: 'Contorno da cintura', simbolo: '◌', resposta: 'fita métrica' },
          { id: 'parede', rotulo: 'Comprimento de uma parede', simbolo: '▭', resposta: 'trena' },
        ],
        dicas: ['A fita dobra; a trena alcança distâncias maiores.'],
      }
    ),
    etapa(
      'q15-balanca',
      15,
      'Massa',
      'Mais pesado, mais leve e mesma massa',
      'Na primeira comparação, a caixa deixa o prato esquerdo mais baixo que o livro.',
      {
        tipo: 'associacao-visual',
        titulo: 'Leia a posição dos pratos',
        instrucao: 'O prato mais baixo tem maior massa; pratos alinhados indicam massas iguais.',
        visual: {
          tipo: 'balanca',
          esquerda: 'caixa',
          direita: 'livro',
          rotulo: 'A caixa deixa o prato esquerdo mais baixo que o livro.',
        },
        itens: [
          {
            id: 'pesado',
            rotulo: 'Qual objeto é mais pesado?',
            opcoes: ['caixa', 'livro'],
            resposta: 'caixa',
          },
          {
            id: 'leve',
            rotulo: 'Qual objeto é mais leve?',
            opcoes: ['caixa', 'livro'],
            resposta: 'livro',
          },
          {
            id: 'equilibrio',
            rotulo: 'Pratos na mesma altura indicam qual relação?',
            opcoes: ['mesma massa', 'massas diferentes'],
            resposta: 'mesma massa',
          },
        ],
        dicas: ['Observe primeiro qual prato está mais baixo.'],
      }
    ),
    etapa(
      'q16-kg-ou-g',
      16,
      'Massa',
      'Quilograma ou grama?',
      'Escolha a unidade mais adequada para cada item.',
      {
        tipo: 'associacao-visual',
        titulo: 'Massas do cotidiano',
        instrucao: 'Use kg para itens mais pesados e g para itens leves.',
        opcoes: ['kg', 'g'],
        itens: [
          { id: 'abobora', rotulo: 'Abóbora', simbolo: '●', resposta: 'kg' },
          { id: 'arroz', rotulo: 'Saco de arroz', produto: 'pacote', resposta: 'kg' },
          { id: 'pessoa', rotulo: 'Massa de uma pessoa', simbolo: '♙', resposta: 'kg' },
          { id: 'moeda', rotulo: 'Moeda', simbolo: '◉', resposta: 'g' },
          { id: 'clipe', rotulo: 'Clipe', simbolo: '⌁', resposta: 'g' },
          {
            id: 'chocolate',
            rotulo: 'Barra pequena de chocolate',
            produto: 'pacote',
            resposta: 'g',
          },
        ],
        dicas: ['Imagine qual número seria razoável em uma balança.'],
      }
    ),
    equivalencias(
      'q17-kg-para-g',
      17,
      'Massa',
      'Transforme quilogramas em gramas',
      '1 kg = 1000 g',
      [
        { id: 'kg1', pergunta: '1 kg corresponde a', unidade: 'g', resposta: 1000 },
        { id: 'kg2', pergunta: '2 kg correspondem a', unidade: 'g', resposta: 2000 },
        { id: 'kg3', pergunta: '3 kg correspondem a', unidade: 'g', resposta: 3000 },
        { id: 'kg5', pergunta: '5 kg correspondem a', unidade: 'g', resposta: 5000 },
      ],
      'Cada quilograma forma um grupo de 1000 gramas.'
    ),
    equivalencias(
      'q18-g-para-kg',
      18,
      'Massa',
      'Transforme gramas em quilogramas',
      '1000 g = 1 kg',
      [
        { id: 'g1000', pergunta: '1000 g correspondem a', unidade: 'kg', resposta: 1 },
        { id: 'g2000', pergunta: '2000 g correspondem a', unidade: 'kg', resposta: 2 },
        { id: 'g4000', pergunta: '4000 g correspondem a', unidade: 'kg', resposta: 4 },
        { id: 'g7000', pergunta: '7000 g correspondem a', unidade: 'kg', resposta: 7 },
      ],
      'Separe a quantidade de gramas em grupos completos de 1000.'
    ),
    etapa(
      'q19-massas-equivalentes',
      19,
      'Massa',
      'Ligue massas equivalentes',
      'Escolha, para cada massa em quilogramas, a quantidade igual em gramas.',
      {
        tipo: 'associacao-visual',
        titulo: 'Mesma massa, outra unidade',
        instrucao: 'Lembre-se de que cada quilograma vale 1000 gramas.',
        opcoes: ['1000 g', '3000 g', '6000 g', '8000 g'],
        itens: [
          { id: 'um', rotulo: '1 kg', simbolo: '1', resposta: '1000 g' },
          { id: 'tres', rotulo: '3 kg', simbolo: '3', resposta: '3000 g' },
          { id: 'seis', rotulo: '6 kg', simbolo: '6', resposta: '6000 g' },
          { id: 'oito', rotulo: '8 kg', simbolo: '8', resposta: '8000 g' },
        ],
        dicas: ['Multiplique a quantidade de quilogramas por 1000.'],
      }
    ),
    etapa(
      'q20-comparar-massas',
      20,
      'Massa',
      'Compare massas em unidades diferentes',
      'Escolha maior que, menor que ou igual depois de transformar mentalmente os quilogramas.',
      {
        tipo: 'associacao-visual',
        titulo: 'Use >, < ou =',
        instrucao: 'Converta para a mesma unidade antes de comparar.',
        opcoes: ['>', '<', '='],
        itens: [
          { id: 'a', rotulo: '2 kg ___ 1800 g', simbolo: '⚖', resposta: '>' },
          { id: 'b', rotulo: '3 kg ___ 2900 g', simbolo: '⚖', resposta: '>' },
          { id: 'c', rotulo: '1000 g ___ 1 kg', simbolo: '⚖', resposta: '=' },
          { id: 'd', rotulo: '750 g ___ 1 kg', simbolo: '⚖', resposta: '<' },
        ],
        dicas: ['2 kg equivalem a 2000 g; use a mesma ideia nos outros itens.'],
      }
    ),
    etapa(
      'q21-problema-massa',
      21,
      'Massa',
      'Pacotes na caixa',
      'Uma mercearia colocou 4 pacotes de 1 kg de feijão em uma caixa. Depois acrescentou mais 2 kg.',
      campos(
        [
          { id: 'primeiro', pergunta: 'Massa dos 4 pacotes', unidade: 'kg', resposta: 4 },
          { id: 'total', pergunta: 'Massa depois de acrescentar 2 kg', unidade: 'kg', resposta: 6 },
        ],
        { texto: '1 kg + 1 kg + 1 kg + 1 kg' },
        {
          instrucao: 'Conte os quilogramas dos pacotes e depois some os 2 kg acrescentados.',
          mensagemErro:
            'Primeiro descubra a massa dos quatro pacotes iguais; depois acrescente 2 kg.',
        }
      )
    ),
    etapa(
      'q22-litro-ou-mililitro',
      22,
      'Capacidade',
      'Litro ou mililitro?',
      'Escolha a unidade mais adequada para a capacidade de cada recipiente.',
      {
        tipo: 'associacao-visual',
        titulo: 'Capacidades do cotidiano',
        instrucao: 'Recipientes grandes costumam usar litros; pequenos volumes usam mililitros.',
        opcoes: ['L', 'mL'],
        itens: [
          { id: 'balde', rotulo: 'Balde', recipiente: 'balde', resposta: 'L' },
          { id: 'garrafa', rotulo: 'Garrafa grande de água', recipiente: 'garrafa', resposta: 'L' },
          { id: 'xicara', rotulo: 'Xícara', recipiente: 'xicara', resposta: 'mL' },
          { id: 'frasco', rotulo: 'Frasco pequeno', recipiente: 'frasco', resposta: 'mL' },
        ],
        dicas: ['Mil mililitros formam um litro.'],
      }
    ),
    equivalencias(
      'q23-litros-mililitros',
      23,
      'Capacidade',
      'Complete litros e mililitros',
      '1 L = 1000 mL',
      [
        { id: 'um-litro', pergunta: '1 L corresponde a', unidade: 'mL', resposta: 1000 },
        { id: 'dois-litros', pergunta: '2 L correspondem a', unidade: 'mL', resposta: 2000 },
        {
          id: 'duas-metades',
          pergunta: '500 mL + 500 mL correspondem a',
          unidade: 'L',
          resposta: 1,
        },
      ],
      'Forme grupos de 1000 mL para descobrir os litros.'
    ),
    etapa(
      'q24-copos-um-litro',
      24,
      'Capacidade',
      'Quantos copos completam um litro?',
      'Cada copo comporta 200 mL. Descubra quantos copos iguais completam 1000 mL.',
      campos(
        [{ id: 'copos', pergunta: 'Quantidade de copos de 200 mL', unidade: 'copos', resposta: 5 }],
        {
          tipo: 'capacidade',
          grupos: [{ tipo: 'copo', quantidade: 5, rotulo: 'Copos iguais', detalhe: '200 mL cada' }],
          equacao: '200 + 200 + 200 + 200 + 200 = 1000 mL',
          rotuloAcessivel: 'Cinco copos iguais, cada um com capacidade de duzentos mililitros',
        },
        {
          instrucao: 'Conte quantos grupos de 200 mL aparecem até chegar a 1000 mL.',
          mensagemErro: 'Some mais um grupo de 200 mL por vez até alcançar 1000 mL.',
        }
      )
    ),
    etapa(
      'q25-garrafas-capacidade',
      25,
      'Capacidade',
      'Garrafas que formam um litro',
      'Duas garrafas iguais têm 500 mL cada. Compare e complete.',
      campos(
        [
          {
            id: 'garrafas',
            pergunta: 'Quantidade de garrafas para formar 1 L',
            unidade: 'garrafas',
            resposta: 2,
          },
          {
            id: 'total',
            pergunta: 'Capacidade total das duas garrafas',
            unidade: 'mL',
            resposta: 1000,
          },
        ],
        {
          tipo: 'capacidade',
          grupos: [
            { tipo: 'garrafa', quantidade: 2, rotulo: 'Duas garrafas', detalhe: '500 mL cada' },
            { tipo: 'jarra', quantidade: 1, rotulo: 'Uma jarra', detalhe: '1 L' },
          ],
          equacao: '500 mL + 500 mL = 1 L',
          rotuloAcessivel:
            'Duas garrafas de quinhentos mililitros comparadas com uma jarra de um litro',
        },
        { mensagemErro: 'Junte as duas capacidades de 500 mL e lembre que 1000 mL formam 1 L.' }
      )
    ),
    operacao(
      'q26-adicao-fitas',
      26,
      'Junte duas fitas',
      'Uma fita mede 47 cm e outra mede 28 cm. Qual é o comprimento total?',
      47,
      28,
      '+',
      'cm',
      75
    ),
    operacao(
      'q27-adicao-caminhos',
      27,
      'Some dois caminhos',
      'Um caminho tem 36 m e outro tem 49 m. Quantos metros há ao todo?',
      36,
      49,
      '+',
      'm',
      85
    ),
    operacao(
      'q28-adicao-pacotes',
      28,
      'Junte duas massas',
      'Um pacote tem 58 g e outro tem 27 g. Qual é a massa total?',
      58,
      27,
      '+',
      'g',
      85
    ),
    operacao(
      'q29-subtracao-fita',
      29,
      'Corte uma fita',
      'Uma fita tinha 72 cm. Foram cortados 38 cm. Quanto restou?',
      72,
      38,
      '−',
      'cm',
      34
    ),
    operacao(
      'q30-subtracao-capacidade',
      30,
      'Descubra quanto restou',
      'Um recipiente tinha 91 mL e foram usados 46 mL. Quanto restou?',
      91,
      46,
      '−',
      'mL',
      45
    ),
    {
      id: 'final-formas-medidas-setembro',
      tipo: 'final',
      titulo: 'Revisão concluída!',
      texto:
        'Você reconheceu formas, completou um mosaico, comparou medidas e resolveu contas com reagrupamento. Cada descoberta ajudou na preparação para a prova.',
    },
  ];

  window.MatematicaRevisoes.registrar({
    id: ID,
    aluno: 'mariana',
    titulo: 'Formas e medidas — revisão 03/09',
    descricao: '32 etapas: formas, comprimento, massa, capacidade e reagrupamento',
    chaveArmazenamento: CHAVE,
    etapas: etapas,
  });
})();
