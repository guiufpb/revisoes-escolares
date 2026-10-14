(function () {
  'use strict';
  // Conteúdo original aprovado. Apoios não pontuam; cada questão completa vale um ponto.
  window.MatematicaRevisoes.registrar({
    id: 'mariana-matematica-medir-calcular-descobrir-outubro-2026',
    aluno: 'mariana',
    titulo: 'Medir, calcular e descobrir',
    descricao: '30 questões sobre medidas, cálculos e desafios',
    chaveArmazenamento: 'revisoesEscolares.mariana.matematica.medirCalcularDescobrirOutubro2026.v1',
    etapas: [
      {
        id: 'apresentacao',
        tipo: 'apresentacao',
        titulo: 'Medir, calcular e descobrir',
        textos: [
          'São 30 questões. Você pode estudar um bloco de cada vez e fazer uma pausa.',
          'Leia as pequenas explicações antes de começar. Nas respostas de calcular, escreva o número; a unidade já aparece ao lado do espaço. Nas escolhas, marque uma resposta em cada letra. Você pode fazer desenhos e continhas em uma folha para pensar.',
          'Se errar, observe a pista e tente novamente. Cada questão completa vale 1 ponto. Aprender com uma pista também faz parte da revisão!',
        ],
      },
      {
        id: 'q01',
        tipo: 'cena',
        rotulo: 'Questão 1 de 30 · Bloco 1 — Comprimentos e outras medidas',
        titulo: 'O que queremos medir?',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'Comprimento nos ajuda a saber a altura, a largura ou a distância. Massa nos ajuda a comparar quanto um objeto pesa. Capacidade é quanto cabe em um recipiente. Para medir comprimentos, podemos usar régua, fita métrica ou trena. Escolhemos um instrumento prático para cada tarefa.',
            'Unidades de comprimento: 1 metro tem 100 centímetros. Escrevemos m e cm. Cada centímetro tem 10 milímetros: mm. Por exemplo, 2 cm correspondem a 20 mm.',
          ],
          textos: [
            'Na feira da escola, as crianças precisam organizar três tarefas. Escolha a grandeza que será medida em cada uma.',
          ],
          campos: [
            {
              id: 'q01-a',
              pergunta: 'a) Saber o tamanho da faixa que ficará na entrada.',
              opcoes: ['Capacidade', 'Comprimento', 'Massa'],
              pista: 'A pergunta é sobre o tamanho da faixa, de uma ponta até a outra.',
              resposta: 'Comprimento',
            },
            {
              id: 'q01-b',
              pergunta: 'b) Saber quanto pesa um pacote de farinha.',
              opcoes: ['Capacidade', 'Comprimento', 'Massa'],
              pista: 'A pergunta é sobre quanto o pacote pesa.',
              resposta: 'Massa',
            },
            {
              id: 'q01-c',
              pergunta: 'c) Saber quanto suco cabe em uma jarra.',
              opcoes: ['Capacidade', 'Comprimento', 'Massa'],
              pista: 'A pergunta é sobre quanto pode caber dentro da jarra.',
              resposta: 'Capacidade',
            },
          ],
          consolidacao:
            'Você percebeu o que cada tarefa pede: comprimento da faixa, massa da farinha e capacidade da jarra. Antes de escolher uma unidade, descubra o que quer medir.',
        },
      },
      {
        id: 'q02',
        tipo: 'cena',
        rotulo: 'Questão 2 de 30 · Bloco 1 — Comprimentos e outras medidas',
        titulo: 'Uma ferramenta para cada tarefa',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Escolha o par instrumento e unidade mais prático entre as opções de cada letra.',
          ],
          campos: [
            {
              id: 'q02-a',
              pergunta: 'a) Medir o comprimento de um lápis reto de aproximadamente 14 cm.',
              opcoes: [
                'Balança e quilograma.',
                'Jarra medidora e mililitro.',
                'Régua de 20 cm e centímetro.',
              ],
              pista: 'Procure um instrumento para comprimentos que comporte o lápis.',
              resposta: 'Régua de 20 cm e centímetro.',
            },
            {
              id: 'q02-b',
              pergunta:
                'b) Medir, de uma vez, uma volta de aproximadamente 40 cm em torno de um pote. O instrumento precisa acompanhar a curva.',
              opcoes: [
                'Fita métrica flexível de 150 cm e centímetro.',
                'Régua rígida de 15 cm e milímetro.',
                'Balança e grama.',
              ],
              pista: 'Qual instrumento acompanha uma curva e tem comprimento suficiente?',
              resposta: 'Fita métrica flexível de 150 cm e centímetro.',
            },
            {
              id: 'q02-c',
              pergunta:
                'c) Medir, de uma vez, uma distância de aproximadamente 12 metros no pátio.',
              opcoes: [
                'Copo medidor e litro.',
                'Trena de 20 metros e metro.',
                'Fita de 30 centímetros e milímetro.',
              ],
              pista:
                'A tarefa pede uma distância longa em uma só medição. Compare o alcance dos instrumentos.',
              resposta: 'Trena de 20 metros e metro.',
            },
          ],
          consolidacao:
            'A régua foi prática para o lápis, a fita flexível para a volta no pote e a trena para o pátio. Outros instrumentos podem medir comprimentos em outras condições; aqui, você escolheu entre as opções da tarefa.',
        },
      },
      {
        id: 'q03',
        tipo: 'cena',
        rotulo: 'Questão 3 de 30 · Bloco 1 — Comprimentos e outras medidas',
        titulo: 'Olho na régua!',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Observe antes de continuar',
            'Na régua, contamos os intervalos, os espaços entre as marcas. Se uma fita começa no zero e termina na marca 5 de uma régua em centímetros, seu comprimento é 5 cm. Não conte o zero como se fosse um espaço. Use a escala desenhada; não é preciso encostar uma régua de verdade na tela.',
          ],
          textos: [],
          campos: [
            {
              id: 'q03-a',
              pergunta:
                'a) Uma tira começa no zero de uma régua em centímetros e termina na marca 8. A régua vai de 0 a 12 e tem uma marca a cada centímetro. Qual é o comprimento da tira?',
              unidade: 'cm',
              pista:
                'Comece no zero e observe a marca onde a tira termina. Conte os espaços, se precisar.',
              resposta: 8,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/regua-a.svg',
                  alt: 'Régua em centímetros de 0 a 12. A tira começa em 0 e termina na marca 8.',
                },
              ],
            },
            {
              id: 'q03-b',
              pergunta:
                'b) Um pequeno clipe começa no zero de uma régua em milímetros. Ele termina na segunda marca pequena depois do 15, antes do 20. Cada intervalo pequeno vale 1 mm. Qual é o comprimento do clipe?',
              unidade: 'mm',
              pista: 'Depois de 15, avance duas marcas de 1 milímetro.',
              resposta: 17,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/regua-b.svg',
                  alt: 'Régua em milímetros de 0 a 25, com marcas numeradas de cinco em cinco. O clipe começa em 0 e termina na segunda marca pequena depois de 15. Cada intervalo pequeno vale 1 milímetro.',
                },
              ],
            },
          ],
          consolidacao:
            'A tira mede 8 cm e o clipe mede 17 mm. Ler uma régua é observar a unidade e contar intervalos a partir do começo do objeto.',
        },
      },
      {
        id: 'q04',
        tipo: 'cena',
        rotulo: 'Questão 4 de 30 · Bloco 1 — Comprimentos e outras medidas',
        titulo: 'A mesma medida, outra unidade',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Para pensar: se cada metro tem 100 centímetros, 4 metros têm 100 + 100 + 100 + 100 = 400 centímetros. Uma medida também pode reunir metros e centímetros: 3 m e 20 cm são 300 cm mais 20 cm.',
          ],
          campos: [
            {
              id: 'q04-a',
              pergunta: 'a) 2 m =',
              unidade: 'cm',
              pista: 'Cada metro corresponde a um grupo de 100 centímetros.',
              resposta: 200,
            },
            {
              id: 'q04-b',
              pergunta: 'b) 4 cm =',
              unidade: 'mm',
              pista: 'Cada centímetro corresponde a um grupo de 10 milímetros.',
              resposta: 40,
            },
            {
              id: 'q04-c',
              pergunta: 'c) 1 m e 30 cm =',
              unidade: 'cm',
              pista: 'Escreva o metro em centímetros e depois junte os 30 centímetros.',
              resposta: 130,
            },
          ],
          consolidacao:
            'Você escreveu as mesmas medidas em outra unidade: 2 m são 200 cm; 4 cm são 40 mm; 1 m e 30 cm são 130 cm. A unidade mudou; o comprimento continuou o mesmo.',
        },
      },
      {
        id: 'q05',
        tipo: 'cena',
        rotulo: 'Questão 5 de 30 · Bloco 1 — Comprimentos e outras medidas',
        titulo: 'Uma volta completa',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Descubra o caminho da borda',
            'O contorno é o caminho em volta de uma figura. Para medi-lo, percorra toda a borda, uma vez. Em uma malha, cada pedacinho da borda pode valer uma unidade. Contar os quadradinhos de dentro é outra tarefa.',
            'Podemos medir caminhos com passos ou palmos, mas todos precisam ter o mesmo tamanho, sem espaços nem sobreposições. Pessoas diferentes podem ter palmos diferentes. Por isso, unidades como o centímetro ajudam a comparar medidas.',
          ],
          textos: [],
          campos: [
            {
              id: 'q05-a',
              pergunta:
                'a) Uma horta retangular está desenhada em uma malha. Cada pedacinho da borda vale 1 unidade. A borda de cima tem 4 pedacinhos; a da direita, 3; a de baixo, 4; e a da esquerda, 3. Quantas unidades tem uma volta completa pela borda?',
              opcoes: ['14 unidades.', '12 unidades.', '7 unidades.', '16 unidades.'],
              pista:
                'Passe pela borda de cima, pela direita, por baixo e pela esquerda. Você contou os quatro lados uma vez?',
              resposta: '14 unidades.',
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/horta.svg',
                  alt: 'Horta retangular na malha: quatro segmentos unitários em cima, três à direita, quatro embaixo, três à esquerda. A borda forma uma volta fechada.',
                },
              ],
            },
            {
              id: 'q05-b',
              pergunta:
                'b) Bia mediu um caminho reto com passos de mesmo tamanho. Depois, mediu o mesmo caminho com uma unidade que tinha o dobro do comprimento de cada passo. As unidades couberam certinho nas duas medições, sem sobrar pedaços. Na segunda medição, ela precisou de:',
              opcoes: ['Menos unidades.', 'A mesma quantidade de unidades.', 'Mais unidades.'],
              pista:
                'Imagine cobrir o mesmo caminho com peças mais compridas. Compare o trecho coberto por cada peça.',
              resposta: 'Menos unidades.',
            },
          ],
          pausa: 'Pausa: estique os braços e descanse os olhos. Depois, vamos observar as massas.',
          consolidacao:
            'O contorno tem 14 unidades. Contar os 12 quadradinhos de dentro responde a outra pergunta. No mesmo caminho, unidades maiores fazem a contagem diminuir; a distância não encolheu.',
        },
      },
      {
        id: 'q06',
        tipo: 'cena',
        rotulo: 'Questão 6 de 30 · Bloco 2 — Massas e balanças',
        titulo: 'Instrumento, grandeza e símbolo',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'A balança é um instrumento para medir massa. Grama (g) e quilograma (kg) são unidades de massa. 1 kg tem 1000 g. Meio quilograma tem 500 g. Por exemplo, dois pacotes de 300 g têm, juntos, 600 g. O tamanho do desenho de um objeto não conta quanto ele pesa.',
            'Em uma balança de dois pratos, o lado que desce tem maior massa. O lado que sobe tem menor massa. Pratos na mesma altura, com a haste horizontal, indicam massas iguais.',
          ],
          textos: [],
          campos: [
            {
              id: 'q06-a',
              pergunta:
                'a) Qual instrumento podemos usar para medir a massa de um pacote de arroz?',
              opcoes: ['Régua.', 'Balança.', 'Relógio.'],
              pista: 'Pense no instrumento que pode comparar quanto os objetos pesam.',
              resposta: 'Balança.',
            },
            {
              id: 'q06-b',
              pergunta:
                'b) O rótulo de um pacote mostra “250 g”. Qual grandeza está sendo informada?',
              opcoes: ['Massa.', 'Comprimento.', 'Capacidade.'],
              pista: 'Observe a unidade g. Ela aparece quando medimos que característica?',
              resposta: 'Massa.',
            },
            {
              id: 'q06-c',
              pergunta: 'c) Qual é o símbolo de quilograma?',
              opcoes: ['cm.', 'L.', 'kg.'],
              pista: 'Procure o símbolo da palavra quilograma.',
              resposta: 'kg.',
            },
          ],
          consolidacao:
            'Usamos a balança para medir massa. Grama e quilograma são unidades; seus símbolos são g e kg.',
        },
      },
      {
        id: 'q07',
        tipo: 'cena',
        rotulo: 'Questão 7 de 30 · Bloco 2 — Massas e balanças',
        titulo: 'O que a balança mostra?',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Observe três balanças diferentes. A descrição dos pratos também ajuda a acompanhar os desenhos.',
          ],
          campos: [
            {
              id: 'q07-a',
              pergunta:
                'a) Na primeira balança, o prato da esquerda tem um saco de arroz e está mais baixo. O da direita tem uma caixa e está mais alto. Qual objeto tem maior massa?',
              opcoes: ['A caixa.', 'O saco de arroz.', 'Os dois têm a mesma massa.'],
              pista: 'Observe qual prato desceu.',
              resposta: 'O saco de arroz.',
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/balanca-a.svg',
                  alt: 'Saco de arroz à esquerda, prato mais baixo; caixa à direita, prato mais alto; haste desce para a esquerda.',
                },
              ],
            },
            {
              id: 'q07-b',
              pergunta:
                'b) Na segunda balança, o prato da esquerda tem uma pera e está mais alto. O da direita tem um melão e está mais baixo. Qual objeto tem menor massa?',
              opcoes: ['A pera.', 'O melão.', 'Os dois têm a mesma massa.'],
              pista: 'A pergunta pede a menor massa: observe o prato que subiu.',
              resposta: 'A pera.',
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/balanca-b.svg',
                  alt: 'Pera à esquerda, prato mais alto; melão à direita, prato mais baixo; haste desce para a direita.',
                },
              ],
            },
            {
              id: 'q07-c',
              pergunta:
                'c) Na terceira balança, um prato tem um livro e o outro tem um bloco. Os pratos estão na mesma altura e a haste está horizontal. O que podemos concluir?',
              opcoes: [
                'O livro tem maior massa.',
                'O bloco tem maior massa.',
                'O livro e o bloco têm a mesma massa.',
              ],
              pista: 'Compare a altura dos dois pratos e a posição da haste.',
              resposta: 'O livro e o bloco têm a mesma massa.',
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/balanca-c.svg',
                  alt: 'Livro à esquerda e bloco à direita. Pratos na mesma altura e haste horizontal.',
                },
              ],
            },
          ],
          consolidacao:
            'O arroz tem maior massa que a caixa; a pera tem menor massa que o melão; livro e bloco têm a mesma massa. A posição da balança é a informação importante.',
        },
      },
      {
        id: 'q08',
        tipo: 'cena',
        rotulo: 'Questão 8 de 30 · Bloco 2 — Massas e balanças',
        titulo: 'Quilogramas e gramas',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Para pensar: 4 kg correspondem a quatro grupos de 1000 g, isto é, 4000 g. Para juntar quilogramas e gramas, primeiro podemos escrever tudo em gramas.',
          ],
          campos: [
            {
              id: 'q08-a',
              pergunta: 'a) 2 kg =',
              unidade: 'g',
              pista: 'Use um grupo de 1000 gramas para cada quilograma.',
              resposta: 2000,
            },
            {
              id: 'q08-b',
              pergunta: 'b) 3000 g =',
              unidade: 'kg',
              pista: 'Organize 3000 gramas em grupos de 1000.',
              resposta: 3,
            },
            {
              id: 'q08-c',
              pergunta: 'c) 1 kg e 250 g =',
              unidade: 'g',
              pista: 'Transforme primeiro o quilograma em gramas; depois junte as outras gramas.',
              resposta: 1250,
            },
          ],
          consolidacao:
            '2 kg são 2000 g; 3000 g são 3 kg; 1 kg e 250 g são 1250 g. Antes de somar medidas, podemos colocá-las na mesma unidade.',
        },
      },
      {
        id: 'q09',
        tipo: 'cena',
        rotulo: 'Questão 9 de 30 · Bloco 2 — Massas e balanças',
        titulo: 'Pacotes para a feira',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Uma turma preparou 5 pacotes de sementes. Cada pacote tem massa de 200 g. Todos os pacotes têm a mesma massa.',
          ],
          campos: [
            {
              id: 'q09-a',
              pergunta: 'a) Qual é a massa dos cinco pacotes juntos?',
              unidade: 'g',
              pista: 'Cada um dos cinco pacotes contribui com 200 gramas.',
              resposta: 1000,
            },
            {
              id: 'q09-b',
              pergunta:
                'b) A turma entregou 2 desses pacotes a outra sala. Qual é a massa dos pacotes que ficaram?',
              unidade: 'g',
              pista:
                'Primeiro descubra quantos pacotes ficaram. Depois junte a massa desses pacotes.',
              resposta: 600,
            },
          ],
          consolidacao:
            'Os cinco pacotes tinham 1000 g juntos. Depois da entrega de dois, ficaram três pacotes, com 600 g. Diferencie a quantidade de pacotes da massa de cada um.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/pacotes-9.svg',
              alt: '5 pacotes iguais, cada um rotulado 200 g. Serão retirados dois pacotes inteiros.',
            },
          ],
        },
      },
      {
        id: 'q10',
        tipo: 'cena',
        rotulo: 'Questão 10 de 30 · Bloco 2 — Massas e balanças',
        titulo: 'Organize em pares',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Meios que formam inteiros',
            'Dois meios quilogramas formam 1 kg: 500 g + 500 g = 1000 g. Para descobrir a massa de vários pacotes de meio quilograma, você pode formar pares. Por exemplo, 8 pacotes de 500 g formam quatro pares de 1 kg.',
          ],
          textos: ['Há 6 pacotes de 500 g em uma bancada.'],
          campos: [
            {
              id: 'q10-a',
              pergunta: 'a) Qual é a massa dos seis pacotes juntos, em quilogramas inteiros?',
              unidade: 'kg',
              pista: 'Faça pares de pacotes. Cada par de meio quilograma forma um quilograma.',
              resposta: 3,
            },
            {
              id: 'q10-b',
              pergunta:
                'b) Foram retirados 2 pacotes. Qual é a massa dos pacotes que ficaram, em quilogramas inteiros?',
              unidade: 'kg',
              pista: 'Retire dois pacotes dos seis. Forme pares com os que sobraram.',
              resposta: 2,
            },
          ],
          pausa:
            'Pausa: você já comparou, juntou e retirou massas. Vamos descobrir quanto cabe nos recipientes!',
          consolidacao:
            'Seis meios quilogramas formam 3 kg. Quando saem dois pacotes, fica um par a menos: 2 kg. Formar pares ajuda a juntar metades.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/pacotes-10.svg',
              alt: '6 pacotes iguais, cada um rotulado 500 g. Serão retirados dois pacotes inteiros.',
            },
          ],
        },
      },
      {
        id: 'q11',
        tipo: 'cena',
        rotulo: 'Questão 11 de 30 · Bloco 3 — Capacidades',
        titulo: 'Leia os rótulos',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'Capacidade é quanto cabe em um recipiente. Litro (L) e mililitro (mL) são unidades de capacidade. 1 L tem 1000 mL. Meio litro tem 500 mL. Por exemplo, 2 L correspondem a 2000 mL. Um recipiente pode estar cheio, pela metade ou vazio; isso muda quanto há nele, mas não muda sua capacidade.',
          ],
          textos: [],
          campos: [
            {
              id: 'q11-a',
              pergunta: 'a) O que significa a capacidade de uma garrafa?',
              opcoes: [
                'Quanto a garrafa pesa.',
                'O comprimento da garrafa.',
                'Quanto cabe na garrafa.',
              ],
              pista: 'Pense no espaço disponível dentro do recipiente.',
              resposta: 'Quanto cabe na garrafa.',
            },
            {
              id: 'q11-b',
              pergunta: 'b) Uma caixa de leite traz o símbolo “L”. Como se chama essa unidade?',
              opcoes: ['Litro.', 'Grama.', 'Metro.'],
              pista: 'Leia o símbolo que aparece no rótulo do leite.',
              resposta: 'Litro.',
            },
            {
              id: 'q11-c',
              pergunta: 'c) Um frasco traz o símbolo “mL”. Como se chama essa unidade?',
              opcoes: ['Milímetro.', 'Mililitro.', 'Metro.'],
              pista: 'Observe as duas letras mL; não são mm.',
              resposta: 'Mililitro.',
            },
          ],
          consolidacao:
            'Capacidade é quanto cabe. Litro se escreve L; mililitro, mL. Milímetro, escrito mm, é unidade de comprimento.',
        },
      },
      {
        id: 'q12',
        tipo: 'cena',
        rotulo: 'Questão 12 de 30 · Bloco 3 — Capacidades',
        titulo: 'Complete as equivalências',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [],
          campos: [
            {
              id: 'q12-a',
              pergunta: 'a) 3 L =',
              unidade: 'mL',
              pista: 'Para cada litro, escreva um grupo de 1000 mililitros.',
              resposta: 3000,
            },
            {
              id: 'q12-b',
              pergunta: 'b) 5000 mL =',
              unidade: 'L',
              pista: 'Quantos grupos de 1000 mililitros há em 5000?',
              resposta: 5,
            },
          ],
          consolidacao:
            '3 L correspondem a 3000 mL, e 5000 mL correspondem a 5 L. O tamanho da unidade muda; a capacidade representada continua igual.',
        },
      },
      {
        id: 'q13',
        tipo: 'cena',
        rotulo: 'Questão 13 de 30 · Bloco 3 — Capacidades',
        titulo: 'Compare os rótulos',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Quatro recipientes têm as capacidades abaixo. Seus desenhos podem ter tamanhos parecidos: compare os rótulos, não a altura das figuras.',
          ],
          campos: [
            {
              id: 'q13-a',
              pergunta: 'a) Qual recipiente tem a maior capacidade?',
              opcoes: ['Recipiente A.', 'Recipiente B.', 'Recipiente C.', 'Recipiente D.'],
              pista:
                'Compare as capacidades na mesma unidade. Lembre quantos mililitros tem um litro.',
              resposta: 'Recipiente D.',
            },
            {
              id: 'q13-b',
              pergunta: 'b) Qual par mostra a mesma capacidade escrita de dois jeitos?',
              opcoes: ['1 L e 100 mL.', '2 L e 200 mL.', 'Meio litro e 500 mL.', '750 mL e 1 L.'],
              pista: 'Dois meios litros formam um litro. Compare isso com 1000 mililitros.',
              resposta: 'Meio litro e 500 mL.',
            },
          ],
          tabela: {
            titulo: 'Compare os rótulos',
            cabecalhos: ['Recipiente', 'Capacidade'],
            linhas: [
              ['A', '750 mL'],
              ['B', '1 L'],
              ['C', '500 mL'],
              ['D', '2 L'],
            ],
          },
          consolidacao:
            'O recipiente D comporta mais: 2 L. Meio litro e 500 mL são duas maneiras de indicar a mesma capacidade. Rótulos ajudam quando os desenhos não estão em escala.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/recipientes.svg',
              alt: 'Quatro recipientes, desenhos fora de escala: A 750 mL, B 1 L, C 500 mL, D 2 L. Sem indicação de líquido presente.',
            },
          ],
        },
      },
      {
        id: 'q14',
        tipo: 'cena',
        rotulo: 'Questão 14 de 30 · Bloco 3 — Capacidades',
        titulo: 'Água para regar',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'A turma colocou 3 L de água em um balde e depois acrescentou 4 L. O balde comporta toda essa água, sem derramar. Em seguida, usou 2 L para regar as plantas.',
          ],
          campos: [
            {
              id: 'q14-a',
              pergunta: 'a) Quantos litros havia no balde antes de regar?',
              unidade: 'L',
              pista: 'Antes de regar, a água das duas colocações estava reunida.',
              resposta: 7,
            },
            {
              id: 'q14-b',
              pergunta: 'b) Quantos litros ficaram depois de regar?',
              unidade: 'L',
              pista: 'A partir da água reunida, retire apenas os 2 litros usados.',
              resposta: 5,
            },
          ],
          consolidacao:
            'Havia 7 litros antes de regar. Usando 2, ficaram 5 litros. A primeira conta junta; a segunda retira.',
        },
      },
      {
        id: 'q15',
        tipo: 'cena',
        rotulo: 'Questão 15 de 30 · Bloco 3 — Capacidades',
        titulo: 'Encha até a marca',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Copos iguais, quantidades iguais',
            'Para encher um recipiente usando copos iguais, podemos somar a quantidade de cada copo cheio até chegar ao alvo. Por exemplo, três copos de 100 mL colocam 100 + 100 + 100 = 300 mL em um recipiente. Neste desafio, cada copo será cheio até sua marca, sem derramar.',
          ],
          textos: [],
          campos: [
            {
              id: 'q15-a',
              pergunta:
                'a) Uma garrafa vazia deve receber 1 L de água. O copo usado leva 200 mL até a marca. Quantos copos cheios até essa marca são necessários?',
              unidade: 'copos',
              pista: 'Escreva o alvo em mililitros e some porções de 200 até chegar nele.',
              resposta: 5,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/copos-a.svg',
                  alt: 'Garrafa inicialmente vazia, alvo 1 L. Um único copo de referência de 200 mL, cheio até a marca.',
                },
              ],
            },
            {
              id: 'q15-b',
              pergunta:
                'b) Outra garrafa vazia deve receber 2 L de água. Agora, o copo leva meio litro até a marca. Quantos copos cheios até essa marca são necessários?',
              unidade: 'copos',
              pista: 'Forme 1 litro com meios litros. Depois pense no alvo de 2 litros.',
              resposta: 4,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/copos-b.svg',
                  alt: 'Garrafa inicialmente vazia, alvo 2 L. Um único copo de referência de meio litro, cheio até a marca.',
                },
              ],
            },
          ],
          pausa: 'Pausa: descanse um pouquinho. O próximo bloco tem maneiras de juntar números.',
          consolidacao:
            'Cinco copos de 200 mL enchem 1 L. Quatro copos de meio litro enchem 2 L. Você pode descobrir por somas repetidas e pares, sem usar uma conta de dividir.',
        },
      },
      {
        id: 'q16',
        tipo: 'cena',
        rotulo: 'Questão 16 de 30 · Bloco 4 — Juntar e adicionar',
        titulo: 'Juntar, retirar e representar',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'Adicionar pode juntar grupos ou acrescentar uma quantidade. Subtrair pode retirar ou comparar. Leia a história para escolher a conta. Nosso sistema organiza os números em unidades (U), dezenas (D) e centenas (C). Uma barra vale 10 cubinhos; uma placa vale 100. Por exemplo, 1 barra e 6 cubinhos representam 16.',
          ],
          textos: [],
          campos: [
            {
              id: 'q16-a',
              pergunta:
                'a) Em uma mesa havia 7 marcadores. A professora colocou mais 8. Quantos marcadores há agora?',
              unidade: 'marcadores',
              pista: 'A quantidade aumentou: junte os marcadores.',
              resposta: 15,
            },
            {
              id: 'q16-b',
              pergunta: 'b) Em outra mesa havia 18 folhas. Foram usadas 6. Quantas ficaram?',
              unidade: 'folhas',
              pista: 'As folhas usadas saíram do grupo inicial.',
              resposta: 12,
            },
            {
              id: 'q16-c',
              pergunta:
                'c) Em cada cartão, uma barra representa 10 e cada cubinho representa 1. Qual cartão representa 24?',
              opcoes: [
                '4 barras e 2 cubinhos.',
                '2 barras e 4 cubinhos.',
                '2 barras e 3 cubinhos.',
                '3 barras e 4 cubinhos.',
              ],
              pista: 'Separe o número em dezenas e unidades. Cada barra vale uma dezena.',
              resposta: '2 barras e 4 cubinhos.',
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/base-dez-a.svg',
                  alt: 'Cartão A: 4 barras de dez e 2 cubinhos soltos. Cada barra tem dez divisões.',
                },
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/base-dez-b.svg',
                  alt: 'Cartão B: 2 barras de dez e 4 cubinhos soltos. Cada barra tem dez divisões.',
                },
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/base-dez-c.svg',
                  alt: 'Cartão C: 2 barras de dez e 3 cubinhos soltos. Cada barra tem dez divisões.',
                },
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/base-dez-d.svg',
                  alt: 'Cartão D: 3 barras de dez e 4 cubinhos soltos. Cada barra tem dez divisões.',
                },
              ],
            },
          ],
          consolidacao:
            'Juntar deu 15 marcadores; retirar deixou 12 folhas. O número 24 tem 2 dezenas e 4 unidades. A posição de cada algarismo informa seu valor.',
        },
      },
      {
        id: 'q17',
        tipo: 'cena',
        rotulo: 'Questão 17 de 30 · Bloco 4 — Juntar e adicionar',
        titulo: 'Saltos de dezena',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Dezenas e atalhos',
            'Para calcular com dezenas exatas, pense em grupos de dez: 20 + 40 junta 2 dezenas e 4 dezenas. Para adicionar 11, você pode adicionar 10 e depois 1. Para adicionar 9, pode adicionar 10 e retirar 1. Exemplo: 23 + 9 = 23 + 10 − 1 = 32.',
          ],
          textos: [
            'Uma sequência começa em 80 e diminui 20 a cada salto:',
            '80 → 60 → [c] → 20 → [d]',
          ],
          campos: [
            {
              id: 'q17-a',
              pergunta: 'a) 30 + 50 =',
              unidade: '',
              pista: 'Conte quantas dezenas foram juntadas e depois escreva o número.',
              resposta: 80,
            },
            {
              id: 'q17-b',
              pergunta: 'b) 90 − 40 =',
              unidade: '',
              pista: 'Retire quatro dezenas de nove dezenas.',
              resposta: 50,
            },
            {
              id: 'q17-c',
              pergunta: 'c) Qual número ocupa o primeiro espaço?',
              unidade: '',
              pista: 'Faça mais um salto de 20 para trás a partir de 60.',
              resposta: 40,
            },
            {
              id: 'q17-d',
              pergunta: 'd) Qual número ocupa o último espaço?',
              unidade: '',
              pista: 'Continue a mesma regra a partir de 20. É possível chegar ao zero.',
              resposta: 0,
            },
          ],
          consolidacao:
            '30 + 50 = 80 e 90 − 40 = 50. Na sequência, cada salto retira 20: 80, 60, 40, 20, 0. Zero também é um número e uma resposta completa.',
        },
      },
      {
        id: 'q18',
        tipo: 'cena',
        rotulo: 'Questão 18 de 30 · Bloco 4 — Juntar e adicionar',
        titulo: 'Escolha uma maneira de pensar',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: ['Você pode decompor, desenhar ou usar os atalhos que acabou de aprender.'],
          campos: [
            {
              id: 'q18-a',
              pergunta: 'a) 24 + 13 =',
              unidade: '',
              pista: 'Junte dezenas com dezenas e unidades com unidades.',
              resposta: 37,
            },
            {
              id: 'q18-b',
              pergunta: 'b) 46 + 11 =',
              unidade: '',
              pista: 'Pense em adicionar 10 e depois mais 1.',
              resposta: 57,
            },
            {
              id: 'q18-c',
              pergunta: 'c) 35 + 9 =',
              unidade: '',
              pista: 'Adicione 10 e devolva 1, porque o aumento pedido é 9.',
              resposta: 44,
            },
          ],
          consolidacao:
            'Os resultados são 37, 57 e 44. Decompor e compensar ajudam no cálculo mental: adicionar 11 é adicionar 10 e 1; adicionar 9 é adicionar 10 e retirar 1.',
        },
      },
      {
        id: 'q19',
        tipo: 'cena',
        rotulo: 'Questão 19 de 30 · Bloco 4 — Juntar e adicionar',
        titulo: 'Faça a troca',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Quando as unidades formam uma dezena',
            'Dez unidades podem ser trocadas por uma dezena, sem mudar a quantidade. Veja um exemplo diferente: em 28 + 14, as unidades dão 8 + 4 = 12. Ficam 2 unidades, e 10 unidades viram 1 dezena. Então, 2 + 1 + 1 dezenas são 4 dezenas. O resultado é 42. Alinhe unidades com unidades, dezenas com dezenas e centenas com centenas.',
          ],
          textos: [
            'Monte ou desenhe as contas, se precisar. Em cada uma, as unidades formam uma nova dezena.',
          ],
          campos: [
            {
              id: 'q19-a',
              pergunta: 'a) 47 + 26 =',
              unidade: '',
              pista:
                'As unidades passam de dez. Separe uma dezena e lembre dela na coluna das dezenas.',
              resposta: 73,
            },
            {
              id: 'q19-b',
              pergunta: 'b) 326 + 148 =',
              unidade: '',
              pista:
                'Comece pelas unidades. Depois da troca, acrescente a nova dezena antes de calcular as centenas.',
              resposta: 474,
            },
          ],
          consolidacao:
            '47 + 26 = 73 e 326 + 148 = 474. Dez unidades viram uma dezena. Essa dezena precisa entrar na soma da coluna seguinte.',
        },
      },
      {
        id: 'q20',
        tipo: 'cena',
        rotulo: 'Questão 20 de 30 · Bloco 4 — Juntar e adicionar',
        titulo: 'Investigue uma conta',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Conferir ajuda a aprender',
            'Quando uma conta tem troca, confira se a dezena formada pelas unidades também entrou na soma das dezenas. A troca muda a organização, mas conserva a quantidade.',
          ],
          textos: [
            'Leo tentou calcular 38 + 27. Ele contou assim:',
            '“8 + 7 = 15. Escrevo o 5 nas unidades. Agora, 3 + 2 = 5 dezenas. Minha resposta é 55.”',
          ],
          campos: [
            {
              id: 'q20-a',
              pergunta: 'a) O que faltou no raciocínio de Leo?',
              opcoes: [
                'Trocar 8 + 7 por 13.',
                'Trocar uma centena por dez dezenas.',
                'Somar às dezenas a dezena formada pelas unidades.',
                'Colocar as dezenas na coluna das unidades.',
              ],
              pista:
                'Leo escreveu o 5 de 15 nas unidades. Onde deve entrar a outra parte desse 15?',
              resposta: 'Somar às dezenas a dezena formada pelas unidades.',
            },
            {
              id: 'q20-b',
              pergunta: 'b) Qual é o resultado correto de 38 + 27?',
              opcoes: ['55.', '65.', '75.', '615.'],
              pista: 'Refaça a conta guardando a dezena que nasceu na soma das unidades.',
              resposta: '65.',
            },
          ],
          pausa:
            'Pausa: você chegou até aqui! Agora vamos retirar, comparar e descobrir quantidades.',
          consolidacao:
            'A resposta correta é 65. O 15 das unidades se organiza em 1 dezena e 5 unidades. Ao incluir a nova dezena, o resultado deixa de ser 55. Conferir o caminho da conta ajuda a encontrar o erro.',
        },
      },
      {
        id: 'q21',
        tipo: 'cena',
        rotulo: 'Questão 21 de 30 · Bloco 5 — Retirar, comparar e descobrir',
        titulo: 'Sobrou? Tem a mais?',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'Subtrair pode descobrir quanto sobrou ou quanto uma quantidade tem a mais que outra. Em 49 − 16, podemos retirar 1 dezena e 6 unidades: sobram 33. Para subtrair 9, um atalho é tirar 10 e devolver 1. Exemplo: 37 − 9 = 37 − 10 + 1 = 28.',
          ],
          textos: [],
          campos: [
            {
              id: 'q21-a',
              pergunta: 'a) Uma caixa tinha 56 folhas. A turma usou 23. Quantas folhas sobraram?',
              unidade: 'folhas',
              pista: 'Retire as folhas usadas da quantidade inicial.',
              resposta: 33,
            },
            {
              id: 'q21-b',
              pergunta:
                'b) Uma equipe recolheu 48 tampinhas. Outra recolheu 25. Quantas tampinhas a primeira equipe recolheu a mais?',
              unidade: 'tampinhas',
              pista:
                'Compare as duas quantidades e descubra quanto falta à menor para alcançar a maior.',
              resposta: 23,
            },
          ],
          consolidacao:
            'Sobraram 33 folhas. A primeira equipe recolheu 23 tampinhas a mais. A subtração pode indicar o que sobra ou a diferença entre dois grupos.',
        },
      },
      {
        id: 'q22',
        tipo: 'cena',
        rotulo: 'Questão 22 de 30 · Bloco 5 — Retirar, comparar e descobrir',
        titulo: 'Nove a menos',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [],
          textos: [
            'Uma sequência começa em 72 e diminui 9 a cada salto:',
            '72 → 63 → [b] → 45 → [c]',
          ],
          campos: [
            {
              id: 'q22-a',
              pergunta: 'a) Use o atalho, se quiser: 64 − 9 =',
              unidade: '',
              pista: 'Tire 10 e devolva 1.',
              resposta: 55,
            },
            {
              id: 'q22-b',
              pergunta: 'b) Qual número ocupa o primeiro espaço?',
              unidade: '',
              pista: 'A regra retira 9 de cada número para achar o próximo.',
              resposta: 54,
            },
            {
              id: 'q22-c',
              pergunta: 'c) Qual número ocupa o último espaço?',
              unidade: '',
              pista: 'Aplique ao 45 a mesma regra usada nos outros saltos.',
              resposta: 36,
            },
          ],
          consolidacao:
            '64 − 9 = 55. A sequência é 72, 63, 54, 45, 36. Tirar 10 e devolver 1 conserva o efeito de tirar 9.',
        },
      },
      {
        id: 'q23',
        tipo: 'cena',
        rotulo: 'Questão 23 de 30 · Bloco 5 — Retirar, comparar e descobrir',
        titulo: 'Uma dezena vira unidades',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Trocar para poder retirar',
            'Uma dezena pode virar 10 unidades. Por exemplo, 43 é 4 dezenas e 3 unidades, mas também é 3 dezenas e 13 unidades. Isso ajuda em 43 − 18: retiramos 8 unidades de 13 e 1 dezena de 3. Sobram 2 dezenas e 5 unidades. A quantidade inicial não mudou durante a troca.',
          ],
          textos: [],
          campos: [
            {
              id: 'q23-a',
              pergunta: 'a) 62 − 28 =',
              unidade: '',
              pista:
                'Nas unidades, 2 não permite retirar 8. Troque uma das dezenas por 10 unidades.',
              resposta: 34,
            },
            {
              id: 'q23-b',
              pergunta: 'b) 50 − 17 =',
              unidade: '',
              pista:
                'O zero nas unidades não impede a conta. Uma das cinco dezenas pode virar unidades.',
              resposta: 33,
            },
          ],
          consolidacao:
            '62 − 28 = 34 e 50 − 17 = 33. Trocar uma dezena por 10 unidades não muda o número inicial; permite organizar a retirada.',
        },
      },
      {
        id: 'q24',
        tipo: 'cena',
        rotulo: 'Questão 24 de 30 · Bloco 5 — Retirar, comparar e descobrir',
        titulo: 'Olho nas três ordens',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Centenas, dezenas e unidades',
            'Com centenas, seguimos alinhando cada ordem. Em 582 − 146, por exemplo, trocamos uma dezena: 5 C, 8 D e 2 U viram 5 C, 7 D e 12 U. Retiramos 6 U, 4 D e 1 C. O resultado é 436. Depois da troca, lembre de usar a nova quantidade de dezenas.',
          ],
          textos: [],
          campos: [
            {
              id: 'q24-a',
              pergunta: 'a) 764 − 231 =',
              unidade: '',
              pista: 'Alinhe unidades, dezenas e centenas. Retire cada ordem da mesma ordem.',
              resposta: 533,
            },
            {
              id: 'q24-b',
              pergunta: 'b) 453 − 127 =',
              unidade: '',
              pista:
                'Depois de trocar uma dezena, confira quantas dezenas restaram antes de subtrair nessa coluna.',
              resposta: 326,
            },
          ],
          consolidacao:
            '764 − 231 = 533 e 453 − 127 = 326. Na segunda conta, as 5 dezenas se tornam 4 dezenas e 10 unidades extras. Usar a nova quantidade de dezenas evita contar a mesma dezena duas vezes.',
        },
      },
      {
        id: 'q25',
        tipo: 'cena',
        rotulo: 'Questão 25 de 30 · Bloco 5 — Retirar, comparar e descobrir',
        titulo: 'Quantos havia antes?',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Uma conta pode ajudar a conferir outra',
            'Se sabemos quanto foi retirado e quanto sobrou, podemos juntar essas duas partes para descobrir o começo. Exemplo: uma caixa ficou com 14 cartões depois que foram retirados 5. Antes, havia 14 + 5 = 19 cartões. A subtração 19 − 5 = 14 confere a história.',
          ],
          textos: [
            'A biblioteca doou 18 livros e ficou com 26 livros. Nenhum livro foi recebido durante essa doação.',
          ],
          campos: [
            {
              id: 'q25-a',
              pergunta: 'a) Quantos livros havia antes da doação?',
              opcoes: ['44 livros.', '34 livros.', '8 livros.', '46 livros.'],
              pista: 'Imagine reunir os livros que ficaram com os livros que foram doados.',
              resposta: '44 livros.',
            },
            {
              id: 'q25-b',
              pergunta:
                'b) Qual adição junta as duas partes e ajuda a descobrir a quantidade inicial?',
              opcoes: ['26 + 8.', '18 + 18.', '26 + 26.', '26 + 18.'],
              pista: 'A adição precisa usar uma vez a parte que ficou e uma vez a parte que saiu.',
              resposta: '26 + 18.',
            },
          ],
          pausa:
            'Pausa: falta um bloco. Nele, você usará as ideias que já aprendeu para investigar informações.',
          consolidacao:
            'Havia 44 livros. Juntar 26 e 18 reconstrói o começo; retirar 18 de 44 deixa os 26 da história. Adição e subtração podem conferir uma à outra.',
        },
      },
      {
        id: 'q26',
        tipo: 'cena',
        rotulo: 'Questão 26 de 30 · Bloco 6 — Ler informações e resolver desafios',
        titulo: 'A brincadeira escolhida',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Vamos lembrar',
            'Gráficos e tabelas organizam informações. Primeiro, leia o título e os nomes. Depois, localize os dados de que precisa. Uma pergunta pode pedir um dado, uma soma ou uma diferença. Em um gráfico de barras, barras maiores representam quantidades maiores quando usamos a mesma escala.',
          ],
          textos: [
            'Cada estudante votou em uma brincadeira para a tarde da escola. O gráfico “Votos nas brincadeiras” mostra:',
          ],
          campos: [
            {
              id: 'q26-a',
              pergunta: 'a) Quantos votos teve a amarelinha?',
              unidade: 'votos',
              pista: 'Localize a barra com o nome Amarelinha.',
              resposta: 14,
            },
            {
              id: 'q26-b',
              pergunta: 'b) Quantos votos tiveram corda e peteca juntas?',
              unidade: 'votos',
              pista: 'Localize apenas Corda e Peteca e junte seus votos.',
              resposta: 49,
            },
            {
              id: 'q26-c',
              pergunta: 'c) Quantos votos a corda teve a mais que a queimada?',
              unidade: 'votos',
              pista: 'Compare Corda e Queimada. A pergunta pede quanto uma supera a outra.',
              resposta: 9,
            },
          ],
          tabela: {
            titulo: 'A brincadeira escolhida',
            cabecalhos: ['Brincadeira', 'Votos — dados do gráfico em versão textual'],
            linhas: [
              ['Queimada', '18'],
              ['Corda', '27'],
              ['Amarelinha', '14'],
              ['Peteca', '22'],
            ],
          },
          consolidacao:
            'Amarelinha recebeu 14 votos. Corda e Peteca somaram 49. Corda recebeu 9 a mais que Queimada. Uma leitura de gráfico pode pedir localizar, juntar ou comparar.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/grafico.svg',
              alt: 'Gráfico Votos nas brincadeiras. Escala Votos de 0 a 30, de cinco em cinco. Queimada: 18; Corda: 27; Amarelinha: 14; Peteca: 22. Barras iniciam em zero.',
            },
          ],
        },
      },
      {
        id: 'q27',
        tipo: 'cena',
        rotulo: 'Questão 27 de 30 · Bloco 6 — Ler informações e resolver desafios',
        titulo: 'Duas carteiras',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Contar peças não é somar valores',
            'No dinheiro de brincadeira, cada ficha tem um valor escrito. Para saber quantos reais há, some os valores. Ter mais fichas não garante ter mais reais. Por exemplo, uma ficha de 10 reais vale mais que três fichas de 2 reais juntas.',
          ],
          textos: [
            'Nina e Ravi usam fichas de dinheiro de brincadeira, sem centavos. Cada valor abaixo pertence a uma ficha.',
            'Carteira de Nina: R$ 20 · R$ 10 · R$ 2.',
            'Carteira de Ravi: R$ 10 · R$ 5 · R$ 5 · R$ 1 · R$ 1 · R$ 1 · R$ 1 · R$ 1.',
          ],
          campos: [
            {
              id: 'q27-a',
              pergunta: 'a) Quantos reais Nina tem?',
              unidade: 'R$',
              pista: 'Some os valores escritos nas três fichas, não apenas a quantidade de fichas.',
              resposta: 32,
            },
            {
              id: 'q27-b',
              pergunta: 'b) Quantos reais Ravi tem?',
              unidade: 'R$',
              pista: 'Junte as fichas de mesmo valor e depois reúna os grupos.',
              resposta: 25,
            },
            {
              id: 'q27-c',
              pergunta: 'c) Quantos reais Nina tem a mais que Ravi?',
              unidade: 'R$',
              pista: 'Compare o total de reais de cada carteira, não a quantidade de peças.',
              resposta: 7,
            },
          ],
          consolidacao:
            'Nina tem 32 reais, Ravi tem 25 e a diferença é 7 reais. Ravi tem mais fichas, mas Nina tem mais dinheiro. O valor de cada ficha importa.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/carteira-nina.svg',
              alt: 'Nina: uma ficha de R$ 20, uma de R$ 10 e uma de R$ 2.',
            },
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/carteira-ravi.svg',
              alt: 'Ravi: uma de R$ 10, duas de R$ 5 e cinco fichas, cada uma de R$ 1. Dinheiro de brincadeira sem centavos.',
            },
          ],
        },
      },
      {
        id: 'q28',
        tipo: 'cena',
        rotulo: 'Questão 28 de 30 · Bloco 6 — Ler informações e resolver desafios',
        titulo: 'Materiais das equipes',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Linhas e colunas',
            'Uma tabela pode separar os dados de dois grupos. Siga a linha para comparar o mesmo tipo de objeto. Siga a coluna para juntar objetos do mesmo grupo. Confira o nome da linha e o nome da coluna antes de usar um número.',
          ],
          textos: [
            'A tabela mostra os materiais de duas equipes. Cada número conta objetos, não caixas ou pacotes.',
          ],
          campos: [
            {
              id: 'q28-a',
              pergunta: 'a) Quantos lápis as duas equipes têm juntas?',
              unidade: 'lápis',
              pista: 'Siga a linha Lápis e use os dois grupos.',
              resposta: 41,
            },
            {
              id: 'q28-b',
              pergunta: 'b) Quantos objetos a equipe Sol tem ao todo?',
              unidade: 'objetos',
              pista: 'Siga só a coluna da equipe Sol e reúna os três tipos.',
              resposta: 40,
            },
            {
              id: 'q28-c',
              pergunta:
                'c) Quantos objetos a equipe Lua tem a mais que a equipe Sol, considerando todos os materiais?',
              unidade: 'objetos',
              pista: 'Encontre o total da equipe Lua e compare com o total da equipe Sol.',
              resposta: 5,
            },
          ],
          tabela: {
            titulo: 'Materiais das equipes',
            cabecalhos: ['Material', 'Equipe Sol', 'Equipe Lua'],
            linhas: [
              ['Lápis', '17', '24'],
              ['Borrachas', '8', '12'],
              ['Cadernos', '15', '9'],
            ],
          },
          consolidacao:
            'As equipes têm 41 lápis juntas. Sol tem 40 objetos, Lua tem 45. A diferença é 5 objetos. A linha reúne o mesmo material; a coluna reúne os materiais de uma equipe.',
        },
      },
      {
        id: 'q29',
        tipo: 'cena',
        rotulo: 'Questão 29 de 30 · Bloco 6 — Ler informações e resolver desafios',
        titulo: 'As mesmas pedrinhas',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Mudar de lugar muda o total?',
            'Imagine que você move 2 botões de um pote para outro. Nenhum botão entra na brincadeira e nenhum sai. Os grupos mudam, mas continuam sendo os mesmos botões. Observe o que foi transferido, de onde saiu e onde chegou.',
          ],
          textos: [
            'Antes da troca, a caixa A tem 12 pedrinhas, e a caixa B tem 8 pedrinhas. A turma move 3 pedrinhas da caixa A para a caixa B. Nenhuma pedrinha é acrescentada de fora ou retirada das duas caixas.',
            'Depois da troca, a caixa A tem 9 pedrinhas, e a caixa B tem 11 pedrinhas.',
          ],
          campos: [
            {
              id: 'q29-a',
              pergunta: 'a) O que acontece com o total de pedrinhas das duas caixas juntas?',
              opcoes: ['Aumenta 3.', 'Fica igual.', 'Diminui 3.', 'Dobra.'],
              pista: 'Acompanhe as pedrinhas que saíram de uma caixa: onde elas chegaram?',
              resposta: 'Fica igual.',
            },
            {
              id: 'q29-b',
              pergunta: 'b) Qual explicação combina com essa troca?',
              opcoes: [
                'Como a caixa B ganhou pedrinhas, o total das duas aumentou.',
                'Como a caixa A perdeu pedrinhas, o total das duas diminuiu.',
                'Entraram 3 pedrinhas novas na brincadeira.',
                'As mesmas pedrinhas apenas mudaram de caixa.',
              ],
              pista: 'Confira se alguma pedrinha nova entrou ou se alguma saiu da brincadeira.',
              resposta: 'As mesmas pedrinhas apenas mudaram de caixa.',
            },
          ],
          consolidacao:
            'O total continuou 20. Uma caixa perdeu 3 e a outra ganhou as mesmas 3. Mudar de grupo conserva o total quando nada entra ou sai do conjunto.',
          figuras: [
            {
              src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/pedrinhas.svg',
              alt: 'Antes: caixa A com 12 pedrinhas e caixa B com 8. Transferência de três da A para a B. Depois: A com 9 e B com 11. Nenhuma pedrinha entra de fora ou sai das duas caixas.',
            },
          ],
        },
      },
      {
        id: 'q30',
        tipo: 'cena',
        rotulo: 'Questão 30 de 30 · Bloco 6 — Ler informações e resolver desafios',
        titulo: 'Jogue e descubra',
        objetivo: 'Resolva uma letra de cada vez. Você pode corrigir e conferir novamente.',
        cena: {
          tipo: 'atividade-visual',
          conferenciaPorSubitem: true,
          titulo: 'Observe, pense e resolva',
          instrucao:
            'Escolha uma resposta em cada letra ou escreva somente o número. A unidade aparece ao lado.',
          apoios: [
            'Aprenda a regra do jogo',
            'Em cada rodada, há três dados de GANHO, marcados com +, e um dado de DESCONTO, marcado com −. Primeiro, some os três ganhos. Depois, retire uma vez o desconto. Exemplo: ganhos 2, 2 e 3, com desconto 1, dão 2 + 2 + 3 − 1 = 6 pontos. Cada dado comum pode mostrar de 1 a 6 pontos.',
          ],
          textos: [],
          campos: [
            {
              id: 'q30-a',
              pergunta:
                'a) Os dados de GANHO mostram 4, 6 e 3. O dado de DESCONTO mostra 2. Quantos pontos essa rodada vale?',
              unidade: 'pontos',
              pista: 'Some os três ganhos primeiro. Depois retire o desconto uma única vez.',
              resposta: 11,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/dados-a.svg',
                  alt: 'GANHO (+): 4, 6, 3. DESCONTO (−): face 2. Resultado em branco.',
                },
              ],
            },
            {
              id: 'q30-b',
              pergunta:
                'b) Em outra rodada, os dados de GANHO mostram 5, 3 e 6. O dado de DESCONTO está escondido. A rodada terminou com 10 pontos. Quantos pontos havia na face do dado de desconto?',
              unidade: 'pontos no dado',
              pista:
                'Descubra o ganho total. Quanto precisa sair dele para chegar aos 10 pontos finais?',
              resposta: 4,
              figuras: [
                {
                  src: '../assets/matematica-medir-calcular-descobrir-outubro-2026/dados-b.svg',
                  alt: 'GANHO (+): 5, 3, 6. DESCONTO (−): dado escondido, face com interrogação. A rodada terminou com 10 pontos.',
                },
              ],
            },
          ],
          consolidacao:
            'A primeira rodada vale 11 pontos. Na segunda, os ganhos somam 14; retirar 4 deixa 10. Você descobriu uma informação escondida usando as outras informações e a regra do jogo.',
        },
      },
      {
        id: 'final',
        tipo: 'final',
        titulo: 'Você concluiu a revisão!',
        texto:
          'Você mediu, comparou, calculou, leu informações e investigou desafios. Pense em uma estratégia que ajudou você: desenhar, fazer pares, trocar uma dezena, usar um atalho ou conferir com outra conta. Conte para quem está estudando com você. Essa conversa final não vale ponto. Ela ajuda a lembrar como você aprendeu.',
      },
    ],
  });
})();
