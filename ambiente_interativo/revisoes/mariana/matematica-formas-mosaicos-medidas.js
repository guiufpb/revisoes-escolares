(function () {
  'use strict';

  var ID = 'mariana-matematica-formas-mosaicos-medidas';
  var CHAVE = 'revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1';

  function etapa(id, rotulo, titulo, objetivo, cena) {
    return { id: id, tipo: 'cena', rotulo: rotulo, titulo: titulo, objetivo: objetivo, cena: cena };
  }

  function campos(respostas, visual, extras) {
    return Object.assign(
      {
        tipo: 'atividade-visual',
        titulo: 'Observe, pense e escreva',
        instrucao: 'Digite somente os números. A unidade já aparece ao lado do campo.',
        visual: visual || {},
        campos: respostas,
        dicas: ['Resolva um item de cada vez.', 'Confira a unidade mostrada ao lado do campo.'],
      },
      extras || {}
    );
  }

  function conversao(id, numero, titulo, perguntas) {
    return etapa(
      id,
      'Conversão de medidas',
      titulo,
      'Complete as equivalências sem trocar a grandeza medida.',
      campos(
        perguntas,
        { texto: numero },
        {
          mensagemErro:
            'Uma equivalência ainda precisa de correção. Lembre-se: 1 m = 100 cm e 1 cm = 10 mm.',
        }
      )
    );
  }

  function operacoes(id, rotulo, titulo, objetivo, perguntas, dica) {
    return etapa(
      id,
      rotulo,
      titulo,
      objetivo,
      campos(
        perguntas,
        { texto: 'Reagrupe quando uma coluna chegar a 10.' },
        {
          instrucao: 'Calcule e digite o resultado. A unidade já está indicada.',
          dicas: [
            dica || 'Comece pelas unidades e faça a troca quando precisar.',
            'Confira a conta com a operação inversa.',
          ],
          mensagemErro:
            'Há um cálculo para rever. Alinhe as ordens, reagrupe quando necessário e tente outra vez.',
        }
      )
    );
  }

  var formasContagem = [];
  [
    ['circulo', 5, 'círculo'],
    ['triangulo', 4, 'triângulo'],
    ['retangulo', 6, 'retângulo'],
    ['cone', 3, 'cone'],
  ].forEach(function (grupo) {
    for (var indice = 1; indice <= grupo[1]; indice += 1) {
      formasContagem.push({
        id: grupo[0] + '-' + indice,
        forma: grupo[0],
        rotulo: grupo[2] + ' para marcar durante a contagem',
      });
    }
  });

  var coresMosaico = [
    { id: 'amarelo', rotulo: 'Amarelo', cor: '#ffd166' },
    { id: 'azul', rotulo: 'Azul', cor: '#72b7ff' },
    { id: 'rosa', rotulo: 'Rosa', cor: '#ef8fb6' },
  ];
  var celulasMosaico = Array.from({ length: 24 }).map(function (_, indice) {
    var linha = Math.floor(indice / 6);
    var coluna = indice % 6;
    return {
      id: 'celula-' + indice,
      fixa: indice % 2 === 0,
      resposta: coresMosaico[(linha + coluna) % 3].id,
    };
  });

  var etapas = [
    {
      id: 'apresentacao-formas-medidas',
      tipo: 'apresentacao',
      titulo: 'Formas, mosaicos e medidas',
      texto:
        'Mariana, nesta aventura você vai observar figuras, completar um mosaico e resolver desafios de comprimento, massa e capacidade. Tudo pode ser corrigido antes de avançar.',
    },
    etapa(
      'q01-contar-formas',
      'Questão 1 de 30 · Formas',
      'Conte cada tipo de figura',
      'Toque nas figuras para marcá-las durante a contagem e depois escreva os quatro totais.',
      campos(
        [
          { id: 'circulos', pergunta: 'Círculos', resposta: 5 },
          { id: 'triangulos', pergunta: 'Triângulos', resposta: 4 },
          { id: 'retangulos', pergunta: 'Retângulos', resposta: 6 },
          { id: 'cones', pergunta: 'Cones', resposta: 3 },
        ],
        { tipo: 'contagem-formas' },
        {
          marcadores: formasContagem,
          instrucao: 'Conte com calma. Marcar uma figura é apenas um apoio e pode ser desfeito.',
          mensagemErro:
            'Algum total não corresponde às figuras. Marque as que já contou e confira novamente.',
        }
      )
    ),
    etapa(
      'q02-formas-planas',
      'Questão 2 de 30 · Formas',
      'Quais figuras são planas?',
      'Selecione todas as figuras planas e deixe a figura não plana sem seleção.',
      {
        tipo: 'selecao-visual',
        titulo: 'Figuras planas e não planas',
        instrucao: 'Toque para selecionar. Toque outra vez para retirar.',
        itens: [
          { id: 'circulo', rotulo: 'Círculo', forma: 'circulo' },
          { id: 'triangulo', rotulo: 'Triângulo', forma: 'triangulo' },
          { id: 'retangulo', rotulo: 'Retângulo', forma: 'retangulo' },
          { id: 'quadrado', rotulo: 'Quadrado', forma: 'quadrado' },
          { id: 'cone', rotulo: 'Cone', forma: 'cone' },
        ],
        resposta: ['circulo', 'triangulo', 'retangulo', 'quadrado'],
        dicas: [
          'Figuras planas podem ser desenhadas inteiras sobre uma folha.',
          'O cone ocupa espaço e não é plano.',
        ],
      }
    ),
    etapa(
      'q03-triangulo',
      'Questão 3 de 30 · Formas',
      'Investigue o triângulo',
      'Conte lados retos e vértices.',
      campos(
        [
          { id: 'lados', pergunta: 'Lados retos', resposta: 3 },
          { id: 'vertices', pergunta: 'Vértices', resposta: 3 },
        ],
        { tipo: 'forma', forma: 'triangulo', rotulo: 'Triângulo' }
      )
    ),
    etapa(
      'q04-retangulo',
      'Questão 4 de 30 · Formas',
      'Investigue o retângulo',
      'Conte lados retos e vértices.',
      campos(
        [
          { id: 'lados', pergunta: 'Lados retos', resposta: 4 },
          { id: 'vertices', pergunta: 'Vértices', resposta: 4 },
        ],
        { tipo: 'forma', forma: 'retangulo', rotulo: 'Retângulo' }
      )
    ),
    etapa(
      'q05-quadrado',
      'Questão 5 de 30 · Formas',
      'Investigue o quadrado',
      'Conte lados retos e vértices.',
      campos(
        [
          { id: 'lados', pergunta: 'Lados retos', resposta: 4 },
          { id: 'vertices', pergunta: 'Vértices', resposta: 4 },
        ],
        { tipo: 'forma', forma: 'quadrado', rotulo: 'Quadrado' }
      )
    ),
    etapa(
      'q06-circulo',
      'Questão 6 de 30 · Formas',
      'Investigue o círculo',
      'Observe que o contorno é curvo.',
      campos(
        [
          { id: 'lados', pergunta: 'Lados retos', resposta: 0 },
          { id: 'vertices', pergunta: 'Vértices', resposta: 0 },
        ],
        { tipo: 'forma', forma: 'circulo', rotulo: 'Círculo' },
        {
          mensagemErro:
            'O círculo tem contorno curvo: procure lados retos e pontas antes de responder.',
        }
      )
    ),
    etapa(
      'q07-objetos-e-formas',
      'Questão 7 de 30 · Associações',
      'Relacione objetos e formas',
      'Escolha a figura que mais lembra cada objeto.',
      {
        tipo: 'associacao-visual',
        titulo: 'Formas no cotidiano',
        instrucao: 'Abra cada lista e faça uma associação.',
        opcoes: ['círculo', 'triângulo', 'retângulo', 'cone'],
        itens: [
          { id: 'relogio', rotulo: 'Relógio de parede', simbolo: '◷', resposta: 'círculo' },
          { id: 'janela', rotulo: 'Janela', simbolo: '▤', resposta: 'retângulo' },
          { id: 'bandeira', rotulo: 'Bandeirinha', simbolo: '⚑', resposta: 'triângulo' },
          { id: 'cone', rotulo: 'Cone de trânsito', simbolo: '△', resposta: 'cone' },
        ],
        dicas: [
          'Observe o contorno principal de cada objeto.',
          'O cone de trânsito é uma forma não plana.',
        ],
      }
    ),
    etapa(
      'q08-mosaico',
      'Questão 8 de 30 · Mosaico',
      'Complete o padrão de três cores',
      'Descubra a repetição nas células prontas e pinte a outra metade.',
      {
        tipo: 'mosaico',
        titulo: 'Um mosaico original',
        instrucao:
          'Escolha uma cor e complete o padrão. Você pode apagar, desfazer ou limpar a tentativa.',
        colunas: 6,
        cores: coresMosaico,
        celulas: celulasMosaico,
        dicas: [
          'As cores avançam sempre na mesma ordem.',
          'Compare cada célula vazia com as vizinhas da linha anterior.',
        ],
        mensagemErro:
          'O padrão ainda se quebra em alguma célula. Compare as linhas e corrija somente o que precisar.',
      }
    ),
    etapa(
      'q09-unidade-adequada',
      'Questão 9 de 30 · Comprimento',
      'Escolha a unidade adequada',
      'Relacione cada medição a cm, m ou mm.',
      {
        tipo: 'associacao-visual',
        titulo: 'Qual unidade combina melhor?',
        instrucao: 'Pense no tamanho real e no grau de precisão necessário.',
        opcoes: ['cm', 'm', 'mm'],
        itens: [
          { id: 'lapis', rotulo: 'Comprimento de um lápis', simbolo: '✎', resposta: 'cm' },
          { id: 'sala', rotulo: 'Comprimento de uma sala', simbolo: '⌂', resposta: 'm' },
          { id: 'livro', rotulo: 'Espessura de um livro', simbolo: '▥', resposta: 'mm' },
        ],
        dicas: ['Uma sala é longa; a espessura do livro pede mais precisão.'],
      }
    ),
    etapa(
      'q10-instrumento-escala',
      'Questão 10 de 30 · Comprimento',
      'Leia cada escala',
      'Associe a característica da medição à unidade destacada.',
      {
        tipo: 'associacao-visual',
        titulo: 'Escalas e unidades',
        instrucao:
          'Ferramentas podem mostrar mais de uma unidade; observe qual escala está sendo destacada.',
        opcoes: ['m', 'cm', 'mm'],
        itens: [
          {
            id: 'escala-longa',
            rotulo: 'Escala longa para medir ambientes',
            simbolo: '↔',
            resposta: 'm',
          },
          {
            id: 'regua',
            rotulo: 'Números principais de uma régua escolar',
            simbolo: '▱',
            resposta: 'cm',
          },
          {
            id: 'divisoes',
            rotulo: 'Pequenas subdivisões entre centímetros',
            simbolo: '┊',
            resposta: 'mm',
          },
        ],
        dicas: ['Cada centímetro da régua costuma ser dividido em 10 milímetros.'],
      }
    ),
    etapa(
      'q11-regua-centimetros',
      'Questão 11 de 30 · Régua',
      'Meça o lápis em centímetros',
      'O lápis começa no zero. Leia onde ele termina.',
      campos(
        [{ id: 'medida', pergunta: 'Comprimento do lápis', unidade: 'cm', resposta: 8 }],
        { tipo: 'regua', maximo: 10, fim: 8, unidade: 'cm' },
        {
          instrucao: 'Leia a marca final, pois o objeto começa exatamente no zero.',
          mensagemErro: 'Observe em qual número a ponta do lápis termina.',
        }
      )
    ),
    etapa(
      'q12-regua-milimetros',
      'Questão 12 de 30 · Régua',
      'Meça em milímetros',
      'A faixa começa no zero. Leia a escala ampliada.',
      campos(
        [{ id: 'medida', pergunta: 'Comprimento da faixa', unidade: 'mm', resposta: 35 }],
        { tipo: 'regua', maximo: 35, fim: 35, unidade: 'mm' },
        {
          instrucao: 'Conte as pequenas divisões até o fim da faixa.',
          mensagemErro: 'A escala está em milímetros. Leia a última marca alcançada pela faixa.',
        }
      )
    ),
    conversao('q13-doze-centimetros', '12 cm', 'Duas escritas para o mesmo comprimento', [
      { id: 'cm', pergunta: 'Em centímetros', unidade: 'cm', resposta: 12 },
      { id: 'mm', pergunta: 'Em milímetros', unidade: 'mm', resposta: 120 },
    ]),
    conversao('q14-sete-centimetros', '7 cm', 'Converta centímetros em milímetros', [
      { id: 'cm', pergunta: 'Em centímetros', unidade: 'cm', resposta: 7 },
      { id: 'mm', pergunta: 'Em milímetros', unidade: 'mm', resposta: 70 },
    ]),
    conversao('q15-tres-metros', '3 m', 'Converta metros em centímetros', [
      { id: 'cm', pergunta: '3 metros correspondem a', unidade: 'cm', resposta: 300 },
    ]),
    conversao('q16-quinhentos-centimetros', '500 cm', 'Converta centímetros em metros', [
      { id: 'm', pergunta: '500 centímetros correspondem a', unidade: 'm', resposta: 5 },
    ]),
    conversao('q17-sete-centimetros-mm', '7 cm', 'Mais uma conversão de comprimento', [
      { id: 'mm', pergunta: '7 centímetros correspondem a', unidade: 'mm', resposta: 70 },
    ]),
    conversao('q18-noventa-milimetros', '90 mm', 'Volte de milímetros para centímetros', [
      { id: 'cm', pergunta: '90 milímetros correspondem a', unidade: 'cm', resposta: 9 },
    ]),
    etapa(
      'q19-quilograma-ou-grama',
      'Questão 19 de 30 · Massa',
      'Quilograma ou grama?',
      'Escolha a unidade mais adequada para cada objeto.',
      {
        tipo: 'associacao-visual',
        titulo: 'Compare massas do cotidiano',
        instrucao: 'Objetos pesados costumam ser medidos em quilogramas; objetos leves, em gramas.',
        opcoes: ['kg', 'g'],
        itens: [
          { id: 'melancia', rotulo: 'Melancia', simbolo: '●', resposta: 'kg' },
          { id: 'arroz', rotulo: 'Saco grande de arroz', simbolo: '▰', resposta: 'kg' },
          { id: 'clipe', rotulo: 'Clipe de papel', simbolo: '⌁', resposta: 'g' },
          { id: 'borracha', rotulo: 'Borracha escolar', simbolo: '▭', resposta: 'g' },
        ],
        dicas: ['Imagine colocar cada objeto em uma balança.'],
      }
    ),
    etapa(
      'q20-balancas',
      'Questão 20 de 30 · Balanças',
      'Compare as massas',
      'Leia a balança e responda às duas comparações.',
      {
        tipo: 'associacao-visual',
        titulo: 'Quem pesa mais? Há equilíbrio?',
        instrucao: 'O prato que fica mais baixo contém o objeto de maior massa.',
        visual: {
          tipo: 'balanca',
          esquerda: 'melancia',
          direita: 'maçã',
          rotulo: 'A melancia deixa o prato esquerdo mais baixo que a maçã.',
        },
        itens: [
          {
            id: 'mais-pesado',
            rotulo: 'Qual objeto é mais pesado?',
            opcoes: ['melancia', 'maçã'],
            resposta: 'melancia',
          },
          {
            id: 'iguais',
            rotulo: 'Dois pratos na mesma altura têm massas iguais?',
            opcoes: ['sim', 'não'],
            resposta: 'sim',
          },
        ],
        dicas: ['Mais baixo significa maior massa.', 'Pratos na mesma altura indicam equilíbrio.'],
      }
    ),
    conversao('q21-dois-quilogramas', '2 kg', 'Converta quilogramas em gramas', [
      { id: 'g', pergunta: '2 quilogramas correspondem a', unidade: 'g', resposta: 2000 },
    ]),
    conversao('q22-tres-mil-gramas', '3000 g', 'Converta gramas em quilogramas', [
      { id: 'kg', pergunta: '3000 gramas correspondem a', unidade: 'kg', resposta: 3 },
    ]),
    etapa(
      'q23-litro-ou-mililitro',
      'Questão 23 de 30 · Capacidade',
      'Litro ou mililitro?',
      'Escolha a unidade mais adequada para a capacidade de cada recipiente.',
      {
        tipo: 'associacao-visual',
        titulo: 'Capacidades do cotidiano',
        instrucao: 'Recipientes grandes costumam usar litros; recipientes pequenos, mililitros.',
        opcoes: ['L', 'mL'],
        itens: [
          { id: 'galao', rotulo: 'Galão de água', simbolo: '⬡', resposta: 'L' },
          { id: 'jarra', rotulo: 'Jarra grande', simbolo: '◡', resposta: 'L' },
          { id: 'copo', rotulo: 'Copo pequeno', simbolo: '▯', resposta: 'mL' },
          { id: 'frasco', rotulo: 'Frasco pequeno', simbolo: '♙', resposta: 'mL' },
        ],
        dicas: ['Mil mililitros formam um litro.'],
      }
    ),
    conversao('q24-litros-mililitros', '1 L = 1000 mL', 'Duas conversões de capacidade', [
      { id: 'ml', pergunta: '4 litros correspondem a', unidade: 'mL', resposta: 4000 },
      { id: 'l', pergunta: '5000 mililitros correspondem a', unidade: 'L', resposta: 5 },
    ]),
    operacoes(
      'q25-somar-comprimentos',
      'Questão 25 de 30 · Operações',
      'Some comprimentos',
      'Resolva as três adições conservando a unidade.',
      [
        { id: 'a', pergunta: '28 cm + 17 cm', unidade: 'cm', resposta: 45 },
        { id: 'b', pergunta: '36 m + 27 m', unidade: 'm', resposta: 63 },
        { id: 'c', pergunta: '46 mm + 28 mm', unidade: 'mm', resposta: 74 },
      ]
    ),
    operacoes(
      'q26-subtrair-comprimentos',
      'Questão 26 de 30 · Operações',
      'Subtraia comprimentos',
      'Resolva as três subtrações conservando a unidade.',
      [
        { id: 'a', pergunta: '52 cm − 28 cm', unidade: 'cm', resposta: 24 },
        { id: 'b', pergunta: '71 m − 36 m', unidade: 'm', resposta: 35 },
        { id: 'c', pergunta: '80 mm − 47 mm', unidade: 'mm', resposta: 33 },
      ],
      'Se não der para retirar uma ordem, decomponha uma dezena.'
    ),
    operacoes(
      'q27-somar-massas',
      'Questão 27 de 30 · Operações',
      'Some massas',
      'Resolva as duas adições.',
      [
        { id: 'a', pergunta: '37 kg + 28 kg', unidade: 'kg', resposta: 65 },
        { id: 'b', pergunta: '46 g + 27 g', unidade: 'g', resposta: 73 },
      ]
    ),
    operacoes(
      'q28-subtrair-massas',
      'Questão 28 de 30 · Operações',
      'Subtraia massas',
      'Resolva as duas subtrações.',
      [
        { id: 'a', pergunta: '74 kg − 38 kg', unidade: 'kg', resposta: 36 },
        { id: 'b', pergunta: '82 g − 45 g', unidade: 'g', resposta: 37 },
      ],
      'Na subtração, decomponha uma dezena quando a unidade de cima for menor.'
    ),
    operacoes(
      'q29-somar-capacidades',
      'Questão 29 de 30 · Operações',
      'Some capacidades',
      'Resolva as duas adições.',
      [
        { id: 'a', pergunta: '36 L + 27 L', unidade: 'L', resposta: 63 },
        { id: 'b', pergunta: '48 mL + 35 mL', unidade: 'mL', resposta: 83 },
      ]
    ),
    operacoes(
      'q30-subtrair-capacidades',
      'Questão 30 de 30 · Operações',
      'Resolva o desafio final de capacidade',
      'Leno tinha 43 L de mel e deu 21 L. Depois, resolva mais duas subtrações.',
      [
        { id: 'mel', pergunta: 'Quanto mel restou para Leno?', unidade: 'L', resposta: 22 },
        { id: 'a', pergunta: '72 L − 38 L', unidade: 'L', resposta: 34 },
        { id: 'b', pergunta: '95 mL − 47 mL', unidade: 'mL', resposta: 48 },
      ],
      'Retirar 1 dezena transforma essa dezena em 10 unidades.'
    ),
    {
      id: 'final-formas-medidas',
      tipo: 'final',
      titulo: 'Missão completa!',
      texto:
        'Você investigou formas, criou um mosaico e usou unidades para medir comprimento, massa e capacidade. Volte quando quiser para fortalecer uma descoberta.',
    },
  ];

  window.MatematicaRevisoes.registrar({
    id: ID,
    aluno: 'mariana',
    titulo: 'Formas, mosaicos e medidas',
    descricao: '32 etapas: formas, mosaico, comprimento, massa e capacidade',
    chaveArmazenamento: CHAVE,
    etapas: etapas,
  });
})();
