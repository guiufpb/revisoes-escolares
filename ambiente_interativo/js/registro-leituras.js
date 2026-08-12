(function () {
  'use strict';

  var perguntasDinheiro = [
    {
      id: 'nome-menina',
      enunciado: 'Como se chama a menina da história?',
      alternativas: [
        { id: 'helena', texto: 'Helena' },
        { id: 'alice', texto: 'Alice' },
        { id: 'marina', texto: 'Marina' },
        { id: 'sofia', texto: 'Sofia' },
      ],
      respostaCorreta: 'helena',
      feedback: 'Isso mesmo! A menina curiosa da história se chama Helena.',
    },
    {
      id: 'passeio',
      enunciado: 'Aonde Helena foi com a mãe?',
      alternativas: [
        { id: 'mercado', texto: 'Ao mercado' },
        { id: 'escola', texto: 'À escola' },
        { id: 'praia', texto: 'À praia' },
        { id: 'parque', texto: 'Ao parque' },
      ],
      respostaCorreta: 'mercado',
      feedback: 'Muito bem! Helena foi ao mercado com a mãe.',
    },
    {
      id: 'paes',
      enunciado: 'Quem preparou os pães quentinhos?',
      alternativas: [
        { id: 'padeiro', texto: 'O padeiro' },
        { id: 'motorista', texto: 'O motorista' },
        { id: 'jardineiro', texto: 'O jardineiro' },
        { id: 'medico', texto: 'O médico' },
      ],
      respostaCorreta: 'padeiro',
      feedback: 'Certo! O padeiro acordou cedo e preparou os pães com cuidado.',
    },
    {
      id: 'trabalho',
      enunciado: 'O que Helena aprendeu sobre as pessoas que trabalham?',
      alternativas: [
        { id: 'ajudam', texto: 'Elas ajudam pessoas e recebem algo em troca' },
        { id: 'brincam', texto: 'Elas passam o dia brincando' },
        { id: 'sozinhas', texto: 'Elas nunca precisam umas das outras' },
        { id: 'sem-esforco', texto: 'Elas recebem tudo sem fazer esforço' },
      ],
      respostaCorreta: 'ajudam',
      feedback: 'Boa descoberta! Cada trabalho ajuda alguém e tem valor.',
    },
    {
      id: 'ursinho',
      enunciado: 'Por que o ursinho ficou ainda mais valioso para Helena?',
      alternativas: [
        { id: 'avo-economizou', texto: 'A avó economizou por meses para comprá-lo' },
        { id: 'era-novo', texto: 'Ele tinha acabado de chegar à loja' },
        { id: 'era-grande', texto: 'Ele era o maior brinquedo do quarto' },
        { id: 'era-colorido', texto: 'Ele tinha muitas cores brilhantes' },
      ],
      respostaCorreta: 'avo-economizou',
      feedback: 'Isso! Helena percebeu o carinho e o esforço da avó naquele presente.',
    },
    {
      id: 'compartilhar',
      enunciado: 'O que Helena fez com o brinquedo que não usava mais?',
      alternativas: [
        { id: 'deu-irmao', texto: 'Deu ao irmão menor' },
        { id: 'jogou-fora', texto: 'Jogou no lixo' },
        { id: 'escondeu', texto: 'Escondeu de todos' },
        { id: 'guardou-caixa', texto: 'Guardou em uma caixa sem usar' },
      ],
      respostaCorreta: 'deu-irmao',
      feedback: 'Muito bem! Helena compartilhou o brinquedo e deixou o irmão feliz.',
    },
    {
      id: 'moedas',
      enunciado: 'Quantas moedas Helena ganhou do avô?',
      alternativas: [
        { id: 'tres', texto: 'Três' },
        { id: 'duas', texto: 'Duas' },
        { id: 'dez', texto: 'Dez' },
        { id: 'cinco', texto: 'Cinco' },
      ],
      respostaCorreta: 'tres',
      feedback: 'Acertou! O avô deu três moedas a Helena.',
    },
    {
      id: 'antes-comprar',
      enunciado: 'O que Helena fez antes de comprar um brinquedo?',
      alternativas: [
        { id: 'pensou-economizou', texto: 'Pensou, esperou e guardou moedas' },
        { id: 'comprou-correndo', texto: 'Comprou o primeiro que viu' },
        { id: 'pediu-emprestado', texto: 'Pediu dinheiro emprestado' },
        { id: 'gastou-tudo', texto: 'Gastou todas as moedas imediatamente' },
      ],
      respostaCorreta: 'pensou-economizou',
      feedback: 'Isso mesmo! Ela escolheu com calma e economizou no cofrinho.',
    },
    {
      id: 'compra-planejada',
      enunciado: 'O que Helena comprou quando juntou dinheiro suficiente?',
      alternativas: [
        { id: 'jogo-montar', texto: 'Um jogo de montar' },
        { id: 'bicicleta', texto: 'Uma bicicleta' },
        { id: 'balao', texto: 'Um balão' },
        { id: 'patins', texto: 'Um par de patins' },
      ],
      respostaCorreta: 'jogo-montar',
      feedback: 'Muito bem! A espera terminou com um divertido jogo de montar.',
    },
    {
      id: 'mais-importante',
      enunciado: 'Segundo o pai de Helena, o que é mais importante: o dinheiro ou as pessoas?',
      alternativas: [
        { id: 'pessoas', texto: 'As pessoas' },
        { id: 'dinheiro', texto: 'O dinheiro' },
        { id: 'brinquedos', texto: 'Os brinquedos' },
        { id: 'lojas', texto: 'As lojas' },
      ],
      respostaCorreta: 'pessoas',
      feedback: 'Perfeito! As pessoas são mais importantes, e o dinheiro ajuda a cuidar delas.',
    },
  ];

  var perguntasReiAnimais = [
    {
      id: 'queria-ser-rei',
      enunciado: 'Qual animal queria tomar o lugar do leão como rei dos animais?',
      alternativas: [
        { id: 'escorpiao', texto: 'O escorpião' },
        { id: 'jacare', texto: 'O jacaré' },
        { id: 'elefante', texto: 'O elefante' },
        { id: 'coruja', texto: 'A coruja' },
      ],
      respostaCorreta: 'escorpiao',
      feedback: 'Isso mesmo! O escorpião se considerava invencível e queria ser rei.',
    },
    {
      id: 'erro-escorpiao',
      enunciado: 'Como o escorpião tratava as diferenças entre os animais?',
      alternativas: [
        { id: 'zombava', texto: 'Zombava e humilhava os outros' },
        { id: 'admirava', texto: 'Admirava e elogiava todos' },
        { id: 'ensinava', texto: 'Ensinava novas brincadeiras' },
        { id: 'ignorava', texto: 'Ignorava todos e ficava em silêncio' },
      ],
      respostaCorreta: 'zombava',
      feedback: 'Certo! Ele ainda não entendia que as diferenças também são virtudes.',
    },
    {
      id: 'girafa',
      enunciado: 'O que a girafa conseguia fazer graças ao seu pescoço comprido?',
      alternativas: [
        { id: 'folhas-altas', texto: 'Alcançar as folhas mais altas' },
        { id: 'nadar', texto: 'Nadar no fundo da lagoa' },
        { id: 'cavar', texto: 'Cavar túneis na terra' },
        { id: 'voar', texto: 'Voar acima das árvores' },
      ],
      respostaCorreta: 'folhas-altas',
      feedback: 'Muito bem! Sua altura era uma habilidade importante.',
    },
    {
      id: 'jacare',
      enunciado: 'Onde o jacaré estava quando foi insultado pelo escorpião?',
      alternativas: [
        { id: 'lagoa', texto: 'Na lagoa' },
        { id: 'ninho', texto: 'Em um ninho' },
        { id: 'caverna', texto: 'Dentro de uma caverna' },
        { id: 'arvore', texto: 'No alto de uma árvore' },
      ],
      respostaCorreta: 'lagoa',
      feedback: 'Isso! Ele tomava sol e pescava perto da lagoa.',
    },
    {
      id: 'elefante',
      enunciado: 'O que o elefante fez depois de ouvir a canção maldosa?',
      alternativas: [
        { id: 'escondeu', texto: 'Tentou se esconder atrás das próprias orelhas' },
        { id: 'dancou', texto: 'Dançou com os outros animais' },
        { id: 'voou', texto: 'Voou para longe da floresta' },
        { id: 'cantou', texto: 'Começou a cantar ainda mais alto' },
      ],
      respostaCorreta: 'escondeu',
      feedback: 'Exatamente! As palavras do escorpião deixaram o elefante envergonhado.',
    },
    {
      id: 'defendeu-animais',
      enunciado: 'Quem percebeu as humilhações e defendeu os outros animais?',
      alternativas: [
        { id: 'leao', texto: 'O leão' },
        { id: 'macaco', texto: 'O macaco' },
        { id: 'sapo', texto: 'O sapo' },
        { id: 'girafa', texto: 'A girafa' },
      ],
      respostaCorreta: 'leao',
      feedback: 'Isso mesmo! O leão questionou com firmeza o comportamento do escorpião.',
    },
    {
      id: 'ameaca',
      enunciado: 'Que perigo ameaçou a clareira onde os animais estavam reunidos?',
      alternativas: [
        { id: 'incendio', texto: 'Um grande incêndio' },
        { id: 'enchente', texto: 'Uma grande enchente' },
        { id: 'tempestade', texto: 'Uma tempestade de granizo' },
        { id: 'deslizamento', texto: 'Um deslizamento de terra' },
      ],
      respostaCorreta: 'incendio',
      feedback: 'Certo! As chamas avançavam com o vento em direção à clareira.',
    },
    {
      id: 'trabalho-equipe',
      enunciado: 'Como os animais conseguiram apagar o incêndio?',
      alternativas: [
        { id: 'juntos', texto: 'Trabalhando juntos e usando as habilidades de cada um' },
        { id: 'escorpiao', texto: 'Esperando o escorpião resolver tudo sozinho' },
        { id: 'fugindo', texto: 'Fugindo sem ajudar os outros' },
        { id: 'separados', texto: 'Agindo separadamente, sem combinar as tarefas' },
      ],
      respostaCorreta: 'juntos',
      feedback: 'Perfeito! Cada diferença se transformou em uma ajuda importante.',
    },
    {
      id: 'arrependimento',
      enunciado: 'O que o escorpião fez depois que o incêndio foi apagado?',
      alternativas: [
        { id: 'desculpas', texto: 'Arrependeu-se e pediu desculpas' },
        { id: 'continuou', texto: 'Continuou humilhando os animais' },
        { id: 'escondeu', texto: 'Escondeu-se e nunca mais falou com ninguém' },
        { id: 'virou-rei', texto: 'Declarou-se o novo rei da floresta' },
      ],
      respostaCorreta: 'desculpas',
      feedback: 'Muito bem! Ele reconheceu seu erro e pediu desculpas a todos.',
    },
    {
      id: 'verdadeiro-rei',
      enunciado: 'Por que o leão foi reconhecido como o verdadeiro rei?',
      alternativas: [
        {
          id: 'lider-acolhedor',
          texto: 'Porque liderou com bondade e valorizou as diferenças',
        },
        { id: 'mais-rico', texto: 'Porque era o animal mais rico' },
        { id: 'mais-alto', texto: 'Porque era o animal mais alto' },
        { id: 'rugido', texto: 'Porque tinha o rugido mais barulhento' },
      ],
      respostaCorreta: 'lider-acolhedor',
      feedback: 'Isso! Sua força também estava no coração acolhedor e no respeito por cada um.',
    },
  ];

  var perguntasGalinhaOuro = [
    {
      id: 'sitio-agricultor',
      enunciado: 'O que havia no pequeno sítio do agricultor?',
      alternativas: [
        { id: 'horta-pomar-galinheiro', texto: 'Uma horta, um pomar e um galinheiro' },
        { id: 'castelo-lago', texto: 'Um castelo e um grande lago' },
        { id: 'fabrica-lojas', texto: 'Uma fábrica e várias lojas' },
        { id: 'curral-cavalos', texto: 'Um curral cheio de cavalos de corrida' },
      ],
      respostaCorreta: 'horta-pomar-galinheiro',
      feedback: 'Isso! O agricultor vivia em um sítio simples com a família.',
    },
    {
      id: 'galinha-especial',
      enunciado: 'Qual galinha colocou o primeiro ovo de ouro?',
      alternativas: [
        { id: 'parda-quieta', texto: 'A galinha parda e quieta' },
        { id: 'branca-barulhenta', texto: 'A galinha branca e barulhenta' },
        { id: 'preta-fujona', texto: 'A galinha preta que sempre fugia' },
        { id: 'ruiva-brava', texto: 'A galinha ruiva e muito brava' },
      ],
      respostaCorreta: 'parda-quieta',
      feedback: 'Muito bem! Era uma galinha parda, mansa e discreta.',
    },
    {
      id: 'frequencia-ovos',
      enunciado: 'Quantos ovos de ouro a galinha colocava por dia?',
      alternativas: [
        { id: 'um', texto: 'Um ovo' },
        { id: 'cinco', texto: 'Cinco ovos' },
        { id: 'dez', texto: 'Dez ovos' },
        { id: 'dois', texto: 'Dois ovos' },
      ],
      respostaCorreta: 'um',
      feedback: 'Certo! Todos os dias aparecia um novo ovo de ouro.',
    },
    {
      id: 'uso-do-dinheiro',
      enunciado: 'O que a família fez primeiro com o dinheiro dos ovos?',
      alternativas: [
        { id: 'dividas-telhado', texto: 'Pagou dívidas e consertou o telhado' },
        { id: 'desperdicou', texto: 'Gastou tudo em uma única festa' },
        { id: 'enterrou', texto: 'Enterrou todo o dinheiro no quintal' },
        { id: 'palacio', texto: 'Comprou imediatamente um grande palácio' },
      ],
      respostaCorreta: 'dividas-telhado',
      feedback: 'Isso mesmo! A riqueza primeiro trouxe segurança e melhorias para a família.',
    },
    {
      id: 'cuidado-inicial',
      enunciado: 'Como o agricultor cuidava da galinha no começo?',
      alternativas: [
        { id: 'milho-palha-agua', texto: 'Dava milho escolhido, palha fresca e água limpa' },
        { id: 'sem-cuidado', texto: 'Deixava a galinha sem comida e sem água' },
        { id: 'longe', texto: 'Mandava a galinha para longe do sítio' },
        { id: 'enfeites', texto: 'Enfeitava suas penas com fitas todos os dias' },
      ],
      respostaCorreta: 'milho-palha-agua',
      feedback: 'Perfeito! Enquanto agradecia, ele cuidava da fonte daquele bem.',
    },
    {
      id: 'conselho-esposa',
      enunciado: 'Que conselho a esposa deu ao agricultor?',
      alternativas: [
        { id: 'paciencia', texto: 'Ter paciência e agradecer pela bênção' },
        { id: 'vender-galinha', texto: 'Vender a galinha imediatamente' },
        { id: 'esconder-ovos', texto: 'Esconder os ovos dos filhos' },
        { id: 'exigir-ovos', texto: 'Obrigar a galinha a colocar vários ovos por dia' },
      ],
      respostaCorreta: 'paciencia',
      feedback: 'Muito bem! Ela percebeu que as coisas boas precisam de tempo e cuidado.',
    },
    {
      id: 'mudanca-agricultor',
      enunciado: 'O que cresceu dentro do agricultor quando ele deixou de agradecer?',
      alternativas: [
        { id: 'cobica', texto: 'A cobiça e a impaciência' },
        { id: 'amizade', texto: 'A amizade pelos vizinhos' },
        { id: 'coragem', texto: 'A coragem para estudar' },
        { id: 'generosidade', texto: 'A vontade de repartir tudo com os outros' },
      ],
      respostaCorreta: 'cobica',
      feedback: 'Certo! Ele passou a enxergar apenas o que faltava.',
    },
    {
      id: 'ideia-errada',
      enunciado: 'O que o agricultor imaginou que havia dentro da galinha?',
      alternativas: [
        { id: 'mina-ovos', texto: 'Uma mina com muitos ovos de ouro' },
        { id: 'sementes', texto: 'Um saco de sementes de laranja' },
        { id: 'mapa', texto: 'Um mapa de um tesouro distante' },
        { id: 'pintinhos', texto: 'Vários pintinhos feitos de ouro' },
      ],
      respostaCorreta: 'mina-ovos',
      feedback: 'Isso! A pressa fez o agricultor acreditar em uma ideia sem sentido.',
    },
    {
      id: 'consequencia-moral',
      enunciado: 'Qual foi a consequência da decisão apressada do agricultor?',
      alternativas: [
        { id: 'perdeu-fonte', texto: 'Ele perdeu a galinha e nunca mais recebeu ovos de ouro' },
        { id: 'ficou-rico', texto: 'Encontrou todo o ouro de uma só vez' },
        { id: 'ganhou-galinhas', texto: 'Ganhou muitas outras galinhas mágicas' },
        { id: 'mais-ovos', texto: 'A galinha passou a colocar dez ovos por dia' },
      ],
      respostaCorreta: 'perdeu-fonte',
      feedback: 'Exatamente! A cobiça destruiu a fonte do bem que se renovava todos os dias.',
    },
    {
      id: 'ditado-gratidao',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre gratidão.',
      textoDitado: 'A gratidão protege a gente da cobiça.',
      respostaCorreta: 'A gratidão protege a gente da cobiça.',
      feedback: 'Muito bem! A gratidão nos ajuda a reconhecer o que já temos.',
    },
    {
      id: 'ditado-bastante',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre saber esperar.',
      textoDitado: 'Um ovo por dia era o bastante.',
      respostaCorreta: 'Um ovo por dia era o bastante.',
      feedback: 'Isso! Saber que o suficiente basta protege contra a cobiça.',
    },
    {
      id: 'ditado-devagar',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre o ritmo das coisas.',
      textoDitado: 'Tudo o que é vivo e bom cresce devagar.',
      respostaCorreta: 'Tudo o que é vivo e bom cresce devagar.',
      feedback: 'Perfeito! Crescer, aprender e cuidar são trabalhos de cada dia.',
    },
  ];

  var perguntasRaposaUvas = [
    {
      id: 'caminho-raposa',
      enunciado: 'Onde a Raposa caminhava quando sentiu fome?',
      alternativas: [
        { id: 'beira-pomar', texto: 'Pela beira de um pomar' },
        { id: 'trilha-floresta', texto: 'Por uma trilha no meio da floresta' },
        { id: 'margem-rio', texto: 'Pela margem de um rio' },
        { id: 'quintal-fazenda', texto: 'Pelo quintal de uma fazenda' },
      ],
      respostaCorreta: 'beira-pomar',
      feedback: 'Isso! A Raposa caminhava perto de um pomar no fim de uma tarde quente.',
    },
    {
      id: 'atraiu-raposa',
      enunciado: 'O que atraiu a Raposa até a parreira?',
      alternativas: [
        { id: 'perfume-uvas', texto: 'O perfume doce das uvas' },
        { id: 'canto-passaro', texto: 'O canto alto de um pássaro' },
        { id: 'barulho-agua', texto: 'O barulho de uma fonte de água' },
        { id: 'cheiro-flores', texto: 'O cheiro de flores do campo' },
      ],
      respostaCorreta: 'perfume-uvas',
      feedback: 'Muito bem! O perfume doce fez o focinho da Raposa tremer de alegria.',
    },
    {
      id: 'aparencia-uvas',
      enunciado: 'Como eram as uvas que a Raposa viu?',
      alternativas: [
        { id: 'maduras-escuras', texto: 'Grandes, escuras, redondas e maduras' },
        { id: 'verdes-pequenas', texto: 'Verdes, pequenas e ainda duras' },
        { id: 'secas-murchas', texto: 'Secas, murchas e caídas no chão' },
        { id: 'estragadas', texto: 'Estragadas e sem nenhum perfume' },
      ],
      respostaCorreta: 'maduras-escuras',
      feedback: 'Certo! Os cachos estavam maduros e brilhavam no alto da parreira.',
    },
    {
      id: 'primeira-tentativa',
      enunciado: 'Qual foi a primeira tentativa da Raposa para alcançar as uvas?',
      alternativas: [
        { id: 'salto-simples', texto: 'Dar um salto simples' },
        { id: 'pedir-ajuda', texto: 'Pedir ajuda ao Sabiá' },
        { id: 'buscar-escada', texto: 'Procurar uma escada no pomar' },
        { id: 'cavar-tunel', texto: 'Cavar um túnel sob o muro' },
      ],
      respostaCorreta: 'salto-simples',
      feedback: 'Isso mesmo! Ela dobrou as patas, tomou impulso e tentou saltar.',
    },
    {
      id: 'outras-tentativas',
      enunciado: 'O que mais a Raposa tentou fazer?',
      alternativas: [
        {
          id: 'correr-escalar-pedras',
          texto: 'Correr, escalar e empilhar pedras',
        },
        { id: 'dormir-esperar', texto: 'Dormir e esperar as uvas caírem' },
        { id: 'chamar-animais', texto: 'Chamar todos os animais do pomar' },
        { id: 'sacudir-parreira', texto: 'Sacudir a parreira com uma corda' },
      ],
      respostaCorreta: 'correr-escalar-pedras',
      feedback: 'Perfeito! Ela tentou vários caminhos, mas os cachos continuaram no alto.',
    },
    {
      id: 'parou-tentar',
      enunciado: 'Por que a Raposa finalmente parou de tentar?',
      alternativas: [
        { id: 'cansada-sem-folego', texto: 'Estava cansada, dolorida e sem fôlego' },
        { id: 'perdeu-fome', texto: 'Já não sentia mais nenhuma fome' },
        { id: 'uvas-sumiram', texto: 'As uvas desapareceram da parreira' },
        { id: 'anoiteceu', texto: 'Escureceu de repente no pomar' },
      ],
      respostaCorreta: 'cansada-sem-folego',
      feedback: 'Exatamente! Depois de tantos esforços, suas pernas doíam e faltava fôlego.',
    },
    {
      id: 'desculpa-raposa',
      enunciado: 'O que a Raposa disse quando não conseguiu alcançar os cachos?',
      alternativas: [
        { id: 'verdes-azedas', texto: 'Que as uvas estavam verdes e azedas' },
        { id: 'doces-maduras', texto: 'Que as uvas pareciam doces e maduras' },
        { id: 'voltaria-amanha', texto: 'Que voltaria no dia seguinte com ajuda' },
        { id: 'passaro-comeu', texto: 'Que um pássaro tinha comido todas as uvas' },
      ],
      respostaCorreta: 'verdes-azedas',
      feedback: 'Isso! Ela inventou um defeito nas uvas para esconder a frustração.',
    },
    {
      id: 'observador',
      enunciado: 'Qual animal observou todas as tentativas da Raposa?',
      alternativas: [
        { id: 'sabia', texto: 'Um Sabiá' },
        { id: 'coruja', texto: 'Uma coruja' },
        { id: 'coelho', texto: 'Um coelho' },
        { id: 'esquilo', texto: 'Um esquilo' },
      ],
      respostaCorreta: 'sabia',
      feedback: 'Muito bem! O Sabiá assistiu aos saltos, às quedas e à desculpa final.',
    },
    {
      id: 'verdade-uvas',
      enunciado: 'O que o Sabiá descobriu ao provar uma uva?',
      alternativas: [
        { id: 'doce-madura', texto: 'Ela estava madura, macia e muito doce' },
        { id: 'verde-dura', texto: 'Ela estava verde e muito dura' },
        { id: 'azeda-seca', texto: 'Ela estava azeda e sem nenhum sumo' },
        { id: 'nao-era-uva', texto: 'Ela nem sequer era uma uva de verdade' },
      ],
      respostaCorreta: 'doce-madura',
      feedback: 'Certo! O Sabiá confirmou que as uvas estavam no ponto e eram pura doçura.',
    },
    {
      id: 'licao-fabula',
      enunciado: 'Qual atitude ajudaria a Raposa a aprender com o que aconteceu?',
      alternativas: [
        { id: 'admitir-verdade', texto: 'Admitir a verdade com humildade' },
        { id: 'inventar-desculpas', texto: 'Inventar novas desculpas sobre as uvas' },
        { id: 'culpar-parreira', texto: 'Culpar a parreira por ser muito alta' },
        { id: 'desprezar-desejo', texto: 'Fingir que nunca desejou as uvas' },
      ],
      respostaCorreta: 'admitir-verdade',
      feedback: 'Perfeito! Dizer “eu tentei e não consegui” abre espaço para aprender e crescer.',
    },
    {
      id: 'ditado-uvas-doces',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre as uvas.',
      textoDitado: 'As uvas estavam maduras e doces.',
      respostaCorreta: 'As uvas estavam maduras e doces.',
      feedback: 'Muito bem! O Sabiá provou que os cachos estavam maduros e doces.',
    },
    {
      id: 'ditado-tentativa',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre reconhecer uma tentativa.',
      textoDitado: 'Eu tentei e ainda não consegui.',
      respostaCorreta: 'Eu tentei e ainda não consegui.',
      feedback: 'Isso! Reconhecer uma dificuldade deixa a porta aberta para tentar novamente.',
    },
    {
      id: 'ditado-verdade',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre honestidade.',
      textoDitado: 'Dizer a verdade ajuda a gente a crescer.',
      respostaCorreta: 'Dizer a verdade ajuda a gente a crescer.',
      feedback: 'Perfeito! A honestidade ajuda a aprender até quando algo não dá certo.',
    },
  ];

  var perguntasSolFerias = [
    {
      id: 'ferias-do-sol',
      enunciado: 'O que os animais pensaram que o Sol tinha feito?',
      alternativas: [
        { id: 'tirou-ferias', texto: 'Tirado férias sem avisar' },
        { id: 'mudou-floresta', texto: 'Mudado para outra floresta' },
        { id: 'dormiu-caverna', texto: 'Dormido dentro de uma caverna' },
        { id: 'caiu-rio', texto: 'Caído no rio da floresta' },
      ],
      respostaCorreta: 'tirou-ferias',
      feedback:
        'Isso! Como o dia ficou escuro, os animais imaginaram que o Sol tinha saído de férias.',
    },
    {
      id: 'primeiras-perceber',
      enunciado: 'Quais animais foram os primeiros a acordar e notar a falta do Sol?',
      alternativas: [
        { id: 'formiguinhas', texto: 'As formiguinhas trabalhadeiras' },
        { id: 'araras', texto: 'As araras falantes' },
        { id: 'garcas', texto: 'As garças do rio' },
        { id: 'coelhinhos', texto: 'Os coelhinhos da toca' },
      ],
      respostaCorreta: 'formiguinhas',
      feedback:
        'Muito bem! As formiguinhas trabalhadeiras acordaram cedo e estranharam a escuridão.',
    },
    {
      id: 'reacao-macaco',
      enunciado: 'Como o Macaco reagiu à escuridão?',
      alternativas: [
        { id: 'fez-brincadeiras', texto: 'Fez brincadeiras com os outros animais' },
        { id: 'escondeu-toca', texto: 'Escondeu-se sozinho em uma toca' },
        { id: 'procurou-peixes', texto: 'Foi procurar peixes no rio' },
        { id: 'escreveu-carta', texto: 'Escreveu uma carta para o Sol' },
      ],
      respostaCorreta: 'fez-brincadeiras',
      feedback: 'Certo! O Macaco fez piadas, mesmo enquanto os outros animais estavam preocupados.',
    },
    {
      id: 'preocupacao-garcas',
      enunciado: 'Por que as Garças ficaram preocupadas?',
      alternativas: [
        { id: 'nao-viam-peixes', texto: 'Não conseguiam ver os peixes para comer' },
        { id: 'perderam-ninho', texto: 'Não encontravam mais o próprio ninho' },
        { id: 'penas-molhadas', texto: 'Estavam com todas as penas molhadas' },
        { id: 'rio-secou', texto: 'O rio havia secado de repente' },
      ],
      respostaCorreta: 'nao-viam-peixes',
      feedback:
        'Exatamente! Sem a claridade, as Garças não enxergavam os peixes e estavam com fome.',
    },
    {
      id: 'ideia-araras',
      enunciado: 'Que ideia uma das Araras teve para resolver o problema?',
      alternativas: [
        { id: 'contratar-substituto', texto: 'Contratar um substituto para o Sol' },
        { id: 'acender-fogueira', texto: 'Acender uma fogueira enorme' },
        { id: 'mudar-floresta', texto: 'Levar todos para outra floresta' },
        { id: 'pedir-lua', texto: 'Pedir que a Lua brilhasse o dia inteiro' },
      ],
      respostaCorreta: 'contratar-substituto',
      feedback: 'Isso! Uma Arara sugeriu contratar um substituto, mas a outra não gostou da ideia.',
    },
    {
      id: 'preocupacao-plantas',
      enunciado: 'Do que as plantinhas precisavam, segundo os animais intelectuais?',
      alternativas: [
        { id: 'calor-luz', texto: 'Do calor e da luz do Sol' },
        { id: 'vento-forte', texto: 'De muito vento forte' },
        { id: 'noite-longa', texto: 'De uma noite bem comprida' },
        { id: 'folhas-secas', texto: 'De um monte de folhas secas' },
      ],
      respostaCorreta: 'calor-luz',
      feedback:
        'Perfeito! As plantas usam a luz do Sol e também precisam de condições boas para crescer.',
    },
    {
      id: 'conselho-rei-leao',
      enunciado: 'O que o Rei Leão disse que os animais deveriam fazer?',
      alternativas: [
        { id: 'esperar-volta', texto: 'Esperar o Sol voltar' },
        { id: 'derrubar-arvores', texto: 'Derrubar as árvores mais altas' },
        { id: 'atravessar-rio', texto: 'Atravessar o rio durante a noite' },
        { id: 'gritar-sol', texto: 'Gritar todos juntos pelo Sol' },
      ],
      respostaCorreta: 'esperar-volta',
      feedback: 'Muito bem! O Rei Leão acreditava que o Sol voltaria e pediu que todos esperassem.',
    },
    {
      id: 'animais-desanimados',
      enunciado: 'O que alguns animais fizeram depois de esperar bastante?',
      alternativas: [
        { id: 'voltaram-casa', texto: 'Voltaram para casa desanimados' },
        { id: 'comecaram-festa', texto: 'Começaram uma grande festa' },
        { id: 'foram-dormir-rio', texto: 'Foram dormir dentro do rio' },
        { id: 'subiram-montanha', texto: 'Subiram a montanha para buscar o Sol' },
      ],
      respostaCorreta: 'voltaram-casa',
      feedback: 'Certo! Alguns voltaram para cuidar dos filhotes enquanto continuavam esperando.',
    },
    {
      id: 'volta-do-sol',
      enunciado: 'O que aconteceu quando a claridade do Sol começou a voltar?',
      alternativas: [
        { id: 'fizeram-festa', texto: 'Os animais fizeram uma grande festa' },
        { id: 'todos-dormiram', texto: 'Todos os animais foram dormir' },
        { id: 'comecou-chover', texto: 'Uma chuva muito forte começou' },
        { id: 'lua-sumiu', texto: 'A Lua desapareceu para sempre' },
      ],
      respostaCorreta: 'fizeram-festa',
      feedback: 'Isso mesmo! Aliviados e felizes, os animais comemoraram a volta da luz.',
    },
    {
      id: 'explicacao-escuridao',
      enunciado: 'O que realmente explica a escuridão que assustou os animais?',
      alternativas: [
        { id: 'eclipse-solar', texto: 'Um eclipse solar' },
        { id: 'ferias-verdadeiras', texto: 'Férias de verdade do Sol' },
        { id: 'tempestade-neve', texto: 'Uma tempestade de neve' },
        { id: 'noite-sem-fim', texto: 'Uma noite que não teria fim' },
      ],
      respostaCorreta: 'eclipse-solar',
      feedback: 'Perfeito! A Lua passou na frente do Sol por alguns minutos e fez o dia escurecer.',
    },
    {
      id: 'ditado-floresta-escura',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre a floresta.',
      textoDitado: 'A floresta ficou escura sem a luz do Sol.',
      respostaCorreta: 'A floresta ficou escura sem a luz do Sol.',
      feedback: 'Muito bem! A falta de claridade deixou os animais preocupados.',
    },
    {
      id: 'ditado-esperaram-juntos',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre os animais.',
      textoDitado: 'Os animais esperaram juntos pelo Sol.',
      respostaCorreta: 'Os animais esperaram juntos pelo Sol.',
      feedback: 'Isso! Mesmo preocupados, eles ficaram juntos enquanto esperavam.',
    },
    {
      id: 'ditado-eclipse-solar',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre o eclipse solar.',
      textoDitado: 'No eclipse solar, a Lua passa na frente do Sol.',
      respostaCorreta: 'No eclipse solar, a Lua passa na frente do Sol.',
      feedback:
        'Perfeito! Essa posição da Lua pode esconder uma parte da luz do Sol por alguns minutos.',
    },
  ];

  var perguntasFormigaCantora = [
    {
      id: 'nome-formiga-cantora',
      enunciado: 'Como se chamava a formiga que sonhava em cantar?',
      alternativas: [
        { id: 'felipa', texto: 'Felipa' },
        { id: 'ofelia', texto: 'Ofélia' },
        { id: 'patricia', texto: 'Patrícia' },
        { id: 'raisa', texto: 'Raisa' },
      ],
      respostaCorreta: 'felipa',
      feedback: 'Isso! Felipa era a formiguinha que carregava muitas canções no coração.',
    },
    {
      id: 'sonho-felipa',
      enunciado: 'Qual era o grande sonho de Felipa?',
      alternativas: [
        { id: 'ser-cantora', texto: 'Ser cantora e encantar o mundo com suas canções' },
        { id: 'ser-rainha', texto: 'Ser a rainha de todos os formigueiros' },
        { id: 'morar-rio', texto: 'Morar no fundo do rio com os peixes' },
        { id: 'virar-cigarra', texto: 'Transformar-se em uma cigarra' },
      ],
      respostaCorreta: 'ser-cantora',
      feedback: 'Muito bem! Felipa queria mudar a realidade do formigueiro com seu canto.',
    },
    {
      id: 'sonho-do-pai',
      enunciado: 'O que Andréi, pai de Felipa, desejava para a filha?',
      alternativas: [
        { id: 'casar-cuidar-formiguinhas', texto: 'Que ela se casasse e cuidasse de formiguinhas' },
        { id: 'viajar-sozinha', texto: 'Que ela viajasse sozinha pelo mundo' },
        { id: 'liderar-orquestra', texto: 'Que ela liderasse uma orquestra' },
        { id: 'morar-arvore', texto: 'Que ela construísse uma casa na árvore' },
      ],
      respostaCorreta: 'casar-cuidar-formiguinhas',
      feedback: 'Certo! O pai ainda não compreendia o sonho diferente que Felipa guardava.',
    },
    {
      id: 'trabalho-durante-dia',
      enunciado: 'O que Felipa fazia durante o dia?',
      alternativas: [
        { id: 'carregava-folhas', texto: 'Trabalhava com as operárias carregando folhas' },
        { id: 'dormia-rio', texto: 'Dormia sobre uma pedra perto do rio' },
        { id: 'ensinava-sapos', texto: 'Ensinava os sapos a cantar' },
        { id: 'costurava-trajes', texto: 'Costurava trajes para os animais' },
      ],
      respostaCorreta: 'carregava-folhas',
      feedback: 'Isso mesmo! De dia ela trabalhava e, à noite, soltava sua bela voz.',
    },
    {
      id: 'encontro-no-rio',
      enunciado: 'Quem falou com Felipa quando ela cantava perto do rio?',
      alternativas: [
        { id: 'dom-vagalume', texto: 'Dom, o vaga-lume' },
        { id: 'andrei-pai', texto: 'Andréi, o pai de Felipa' },
        { id: 'sapo-verde', texto: 'Um sapo verde' },
        { id: 'rouxinol', texto: 'Um rouxinol' },
      ],
      respostaCorreta: 'dom-vagalume',
      feedback: 'Perfeito! Dom ouviu Felipa e mostrou que ela não estava sozinha.',
    },
    {
      id: 'semelhanca-dom-felipa',
      enunciado: 'O que Dom disse ter em comum com Felipa?',
      alternativas: [
        { id: 'coracao-cancoes', texto: 'Um coração cheio de canções' },
        { id: 'asas-amarelas', texto: 'Asas amarelas e brilhantes' },
        { id: 'bigode-negro', texto: 'Um grande bigode negro' },
        { id: 'forca-folhas', texto: 'Força para carregar folhas imensas' },
      ],
      respostaCorreta: 'coracao-cancoes',
      feedback: 'Isso! Dom também amava cantar e entendeu o que Felipa sentia.',
    },
    {
      id: 'convite-dom',
      enunciado: 'Que convite Dom fez a Felipa?',
      alternativas: [
        { id: 'orquestra-floresta', texto: 'Participar da orquestra da floresta' },
        { id: 'mudar-formigueiro', texto: 'Construir outro formigueiro' },
        { id: 'atravessar-rio', texto: 'Atravessar o rio com os peixes' },
        { id: 'competir-operarias', texto: 'Competir com as formigas operárias' },
      ],
      respostaCorreta: 'orquestra-floresta',
      feedback: 'Muito bem! O convite deu a Felipa a oportunidade de compartilhar sua voz.',
    },
    {
      id: 'integrantes-trio',
      enunciado: 'Quem ensaiava no trio musical com Felipa?',
      alternativas: [
        { id: 'dom-ofelia', texto: 'Dom, o vaga-lume, e Ofélia, a borboleta' },
        { id: 'andrei-cigarra', texto: 'Andréi e uma cigarra' },
        { id: 'sapos-peixes', texto: 'Os sapos e os peixes' },
        { id: 'operarias-besouros', texto: 'As operárias e os besouros' },
      ],
      respostaCorreta: 'dom-ofelia',
      feedback: 'Certo! Felipa, Dom e Ofélia praticavam juntos ao som do rio.',
    },
    {
      id: 'condicao-orquestra',
      enunciado: 'Qual era a única condição para Felipa cantar com o grupo?',
      alternativas: [
        { id: 'cantar-coracao', texto: 'Cantar de todo o coração' },
        { id: 'usar-traje-verde', texto: 'Usar sempre um traje verde' },
        { id: 'parar-trabalho', texto: 'Parar de trabalhar no formigueiro' },
        { id: 'vencer-cigarras', texto: 'Vencer as cigarras em uma competição' },
      ],
      respostaCorreta: 'cantar-coracao',
      feedback: 'Exatamente! Felipa já cantava com sinceridade e amor.',
    },
    {
      id: 'resultado-estreia',
      enunciado: 'O que a estreia de Felipa mostrou a todos?',
      alternativas: [
        {
          id: 'acreditar-muda-destino',
          texto: 'É possível mudar o destino quando se acredita em um sonho',
        },
        { id: 'so-cigarras-cantam', texto: 'Somente as cigarras conseguem cantar bem' },
        { id: 'sonho-tem-prazo', texto: 'Todo sonho tem um prazo curto para acabar' },
        { id: 'trabalhar-impede-sonhar', texto: 'Quem trabalha não pode ter outros sonhos' },
      ],
      respostaCorreta: 'acreditar-muda-destino',
      feedback: 'Perfeito! Felipa acreditou em seu sonho e encontrou quem valorizasse sua voz.',
    },
    {
      id: 'ditado-sonho-cantar',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre o sonho de Felipa.',
      textoDitado: 'Felipa sonhava em cantar para o mundo.',
      respostaCorreta: 'Felipa sonhava em cantar para o mundo.',
      feedback: 'Muito bem! Felipa guardava um sonho bonito e continuou acreditando nele.',
    },
    {
      id: 'ditado-convite-orquestra',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre o convite de Dom.',
      textoDitado: 'Dom convidou Felipa para a orquestra da floresta.',
      respostaCorreta: 'Dom convidou Felipa para a orquestra da floresta.',
      feedback: 'Isso! Dom reconheceu o talento de Felipa e a convidou para cantar.',
    },
    {
      id: 'ditado-coragem-continuar',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre acreditar nos sonhos.',
      textoDitado: 'Quem acredita no sonho encontra coragem para continuar.',
      respostaCorreta: 'Quem acredita no sonho encontra coragem para continuar.',
      feedback: 'Perfeito! Acreditar ajudou Felipa a continuar até ser ouvida.',
    },
  ];

  var perguntasCasteloAssombrado = [
    {
      id: 'local-casarao',
      enunciado: 'Onde ficava o velho casarão conhecido como castelo assombrado?',
      alternativas: [
        { id: 'ao-lado-julia', texto: 'Ao lado da casa de Júlia' },
        { id: 'atras-escola', texto: 'Atrás da escola das crianças' },
        { id: 'alto-montanha', texto: 'No alto de uma montanha' },
        { id: 'meio-floresta', texto: 'No meio de uma floresta distante' },
      ],
      respostaCorreta: 'ao-lado-julia',
      feedback: 'Isso! O casarão ficava bem ao lado da casa de Júlia.',
    },
    {
      id: 'coragem-julia',
      enunciado: 'Por que Júlia não tinha medo dos barulhos do casarão?',
      alternativas: [
        { id: 'acostumada-barulhos', texto: 'Ela já estava acostumada a ouvi-los' },
        { id: 'nao-ouvia', texto: 'Ela não conseguia ouvir nenhum som' },
        { id: 'morava-longe', texto: 'Ela morava muito longe daquele lugar' },
        { id: 'tinha-amuleto', texto: 'Ela carregava um amuleto mágico' },
      ],
      respostaCorreta: 'acostumada-barulhos',
      feedback: 'Muito bem! Júlia conhecia aqueles sons porque morava perto do casarão.',
    },
    {
      id: 'bolas-perdidas',
      enunciado: 'O que acontecia quando uma bola caía dentro dos muros do casarão?',
      alternativas: [
        { id: 'ninguem-buscava', texto: 'Ninguém tinha coragem de entrar para buscá-la' },
        { id: 'julia-buscava', texto: 'Júlia entrava imediatamente para buscá-la' },
        { id: 'bola-voltava', texto: 'A bola voltava sozinha para a rua' },
        { id: 'vizinhos-pulavam', texto: 'Os vizinhos pulavam o muro juntos' },
      ],
      respostaCorreta: 'ninguem-buscava',
      feedback: 'Certo! O medo fazia as crianças deixarem suas bolas dentro do terreno.',
    },
    {
      id: 'visao-noturna-julia',
      enunciado: 'O que Júlia viu certa noite pela janela?',
      alternativas: [
        { id: 'pessoas-entrando', texto: 'Pessoas saindo de um carro e entrando no casarão' },
        { id: 'fantasmas-voando', texto: 'Fantasmas voando acima do telhado' },
        { id: 'animais-fugindo', texto: 'Animais fugindo do jardim' },
        { id: 'criancas-jogando', texto: 'Crianças jogando bola no quintal' },
      ],
      respostaCorreta: 'pessoas-entrando',
      feedback: 'Isso mesmo! A chegada dessas pessoas aumentou a curiosidade de Júlia.',
    },
    {
      id: 'nova-colega',
      enunciado: 'Quem era a nova colega apresentada pela professora?',
      alternativas: [
        { id: 'lorena', texto: 'Lorena, a nova moradora do casarão' },
        { id: 'nora', texto: 'Nora, a avó que contava histórias' },
        { id: 'laura', texto: 'Laura, a prima de Júlia' },
        { id: 'juliana', texto: 'Juliana, a professora da turma' },
      ],
      respostaCorreta: 'lorena',
      feedback: 'Perfeito! Lorena havia acabado de se mudar com sua família para o casarão.',
    },
    {
      id: 'fantasmas-janelas',
      enunciado: 'O que eram os “fantasmas” vistos pelas janelas?',
      alternativas: [
        { id: 'lencois-moveis', texto: 'Lençóis sobre os móveis, balançados pelo vento' },
        { id: 'cortinas-brancas', texto: 'Cortinas brancas penduradas pelos trabalhadores' },
        { id: 'nuvens-baixas', texto: 'Nuvens baixas refletidas nos vidros' },
        { id: 'fantasias', texto: 'Fantasias usadas pelas crianças da cidade' },
      ],
      respostaCorreta: 'lencois-moveis',
      feedback: 'Muito bem! O vento entrava pelo vidro quebrado e movimentava os lençóis.',
    },
    {
      id: 'barulho-portas',
      enunciado: 'O que causava as pancadas ouvidas no casarão?',
      alternativas: [
        { id: 'portas-sem-fechadura', texto: 'Portas sem fechaduras batendo com o vento' },
        { id: 'passos-fantasmas', texto: 'Passos de fantasmas pela sala' },
        { id: 'bola-muros', texto: 'Bolas batendo nos muros durante a noite' },
        { id: 'chuva-telhado', texto: 'Chuva forte caindo sobre o telhado' },
      ],
      respostaCorreta: 'portas-sem-fechadura',
      feedback: 'Isso! Lorena mostrou que o barulho tinha uma explicação simples.',
    },
    {
      id: 'correntes-sala',
      enunciado: 'Por que uma corrente se arrastava no chão da sala?',
      alternativas: [
        {
          id: 'lustre-quebrada',
          texto: 'Ela segurava um lustre e uma de suas partes havia quebrado',
        },
        { id: 'prendia-portao', texto: 'Ela prendia o portão principal da casa' },
        { id: 'trabalhador-puxava', texto: 'Um trabalhador a puxava todas as noites' },
        { id: 'decoracao', texto: 'Ela fazia parte de uma decoração de festa' },
      ],
      respostaCorreta: 'lustre-quebrada',
      feedback: 'Exatamente! O vento balançava a corrente quebrada que sustentava o lustre.',
    },
    {
      id: 'menino-no-hospital',
      enunciado: 'O que havia acontecido com o pai de Lorena quando ele era criança?',
      alternativas: [
        { id: 'picado-cobra', texto: 'Foi picado por uma cobra e ficou no hospital' },
        { id: 'caiu-arvore', texto: 'Caiu de uma árvore e quebrou o braço' },
        { id: 'perdeu-floresta', texto: 'Perdeu-se durante vários dias na floresta' },
        { id: 'adoeceu-frio', texto: 'Ficou resfriado depois de uma noite fria' },
      ],
      respostaCorreta: 'picado-cobra',
      feedback: 'Certo! Seus pais saíram depressa para conseguir atendimento e salvá-lo.',
    },
    {
      id: 'homens-misteriosos',
      enunciado: 'Quem eram os homens que entravam no casarão à noite?',
      alternativas: [
        { id: 'trabalhadores-reforma', texto: 'Trabalhadores contratados para reformar a casa' },
        { id: 'cacadores-fantasmas', texto: 'Caçadores de fantasmas da cidade' },
        { id: 'atores-teatro', texto: 'Atores ensaiando uma peça de teatro' },
        { id: 'vizinhos-curiosos', texto: 'Vizinhos curiosos procurando as bolas' },
      ],
      respostaCorreta: 'trabalhadores-reforma',
      feedback:
        'Perfeito! Eles consertavam e pintavam a casa quando o pai de Lorena podia acompanhar.',
    },
    {
      id: 'ditado-julia-corajosa',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre Júlia.',
      textoDitado: 'Júlia era corajosa e queria descobrir a verdade.',
      respostaCorreta: 'Júlia era corajosa e queria descobrir a verdade.',
      feedback: 'Muito bem! A curiosidade de Júlia ajudou a observar o que acontecia.',
    },
    {
      id: 'ditado-lencois-vento',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre os falsos fantasmas.',
      textoDitado: 'Os lençóis balançavam com o vento.',
      respostaCorreta: 'Os lençóis balançavam com o vento.',
      feedback: 'Isso! Os lençóis sobre os móveis pareciam fantasmas vistos de longe.',
    },
    {
      id: 'ditado-lorena-explicou',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre os mistérios.',
      textoDitado: 'Lorena explicou os mistérios do velho casarão.',
      respostaCorreta: 'Lorena explicou os mistérios do velho casarão.',
      feedback: 'Perfeito! Depois das explicações, as crianças puderam deixar o medo de lado.',
    },
  ];

  var perguntasBelaDesadormecida = [
    {
      id: 'nome-belinha',
      enunciado: 'Como se chamava a menina da história?',
      alternativas: [
        { id: 'bela-belinha', texto: 'Bela, também chamada de Belinha' },
        { id: 'aurora-aurorinha', texto: 'Aurora, também chamada de Aurorinha' },
        { id: 'flora-florinha', texto: 'Flora, também chamada de Florinha' },
        { id: 'clara-clarinha', texto: 'Clara, também chamada de Clarinha' },
      ],
      respostaCorreta: 'bela-belinha',
      feedback: 'Isso! Seus pais a chamaram de Belinha quando ela nasceu.',
      explicacaoRevisao:
        'No começo da história, os pais escolhem o nome Bela e passam a chamá-la carinhosamente de Belinha.',
    },
    {
      id: 'motivo-festa',
      enunciado: 'Por que os pais de Bela organizaram uma festa?',
      alternativas: [
        { id: 'nascimento-bela', texto: 'Para comemorar o nascimento de Bela' },
        { id: 'mudanca-casa', texto: 'Para comemorar a mudança de casa' },
        { id: 'chegada-inverno', texto: 'Para celebrar a chegada do inverno' },
        { id: 'premio-escola', texto: 'Para festejar um prêmio da escola' },
      ],
      respostaCorreta: 'nascimento-bela',
      feedback: 'Muito bem! A família estava muito feliz com a chegada da bebê.',
      explicacaoRevisao:
        'A festa foi preparada para comemorar a chegada de Bela, que havia acabado de nascer.',
    },
    {
      id: 'convidada-faltante',
      enunciado: 'Quem não foi convidada para a festa de nascimento?',
      alternativas: [
        { id: 'bruxa-vizinha', texto: 'A bruxa que morava na vizinhança' },
        { id: 'professora', texto: 'A professora de Bela' },
        { id: 'avo', texto: 'A avó de Bela' },
        { id: 'padeira', texto: 'A padeira do bairro' },
      ],
      respostaCorreta: 'bruxa-vizinha',
      feedback: 'Certo! Mesmo sem convite, a bruxa entrou na festa.',
      explicacaoRevisao:
        'A bruxa da vizinhança ficou fora da lista de convidados, mas apareceu na festa mesmo assim.',
    },
    {
      id: 'presente-maldicao',
      enunciado: 'O que a bruxa disse que aconteceria quando Bela completasse catorze anos?',
      alternativas: [
        {
          id: 'picar-dormir',
          texto: 'Ela picaria o dedo e todos dormiriam por cem anos',
        },
        { id: 'perder-voz', texto: 'Ela perderia a voz durante uma semana' },
        { id: 'virar-rato', texto: 'Ela se transformaria em um rato' },
        { id: 'esquecer-nome', texto: 'Ela esqueceria o próprio nome' },
      ],
      respostaCorreta: 'picar-dormir',
      feedback: 'Isso mesmo! Esse era o presente maldoso anunciado pela bruxa.',
      explicacaoRevisao:
        'A maldição dizia que Bela picaria o dedo aos catorze anos e faria todos dormirem por cem anos.',
    },
    {
      id: 'protecao-pais',
      enunciado: 'Como os pais tentaram proteger Bela da maldição?',
      alternativas: [
        { id: 'tiraram-pontudos', texto: 'Tiraram de perto dela os objetos afiados e pontudos' },
        { id: 'fecharam-janelas', texto: 'Fecharam todas as janelas da casa' },
        { id: 'esconderam-doces', texto: 'Esconderam os doces da cozinha' },
        { id: 'mudaram-cidade', texto: 'Mudaram de cidade no mesmo dia' },
      ],
      respostaCorreta: 'tiraram-pontudos',
      feedback: 'Perfeito! Até garfos, facas e o anel da tia foram afastados.',
      explicacaoRevisao:
        'Com medo de que Bela ferisse o dedo, os pais afastaram dela tudo o que era afiado ou pontudo.',
    },
    {
      id: 'presente-catorze',
      enunciado: 'Que presente a bruxa levou no aniversário de catorze anos de Bela?',
      alternativas: [
        { id: 'long-play', texto: 'Um antigo long-play' },
        { id: 'livro-receitas', texto: 'Um livro de receitas' },
        { id: 'jogo-montar', texto: 'Um jogo de montar' },
        { id: 'caixa-lapis', texto: 'Uma caixa de lápis de cor' },
      ],
      respostaCorreta: 'long-play',
      feedback: 'Muito bem! O presente era um disco grande e antigo.',
      explicacaoRevisao:
        'No aniversário de catorze anos, a bruxa entregou a Bela um long-play, que é um disco grande e antigo.',
    },
    {
      id: 'agulha-disco',
      enunciado: 'Como Bela picou o dedo?',
      alternativas: [
        { id: 'agulha-long-play', texto: 'Ao encostar na agulha que tocava o disco' },
        { id: 'espinho-jardim', texto: 'Ao pegar uma rosa no jardim' },
        { id: 'alfinete-roupa', texto: 'Ao prender um alfinete na roupa' },
        { id: 'garfo-cozinha', texto: 'Ao segurar um garfo na cozinha' },
      ],
      respostaCorreta: 'agulha-long-play',
      feedback: 'Isso! A agulha da vitrola fez a maldição começar.',
      explicacaoRevisao:
        'Quando Bela foi ouvir o disco, encostou o dedo na agulha da vitrola e a maldição começou.',
    },
    {
      id: 'todos-dormiram',
      enunciado: 'Quem adormeceu depois que Bela picou o dedo?',
      alternativas: [
        {
          id: 'familia-animais-bela',
          texto: 'Bela, seus pais e até os animais da casa',
        },
        { id: 'somente-bruxa', texto: 'Somente a bruxa' },
        { id: 'somente-bela', texto: 'Somente Bela' },
        { id: 'cidade-inteira', texto: 'Todas as pessoas da cidade' },
      ],
      respostaCorreta: 'familia-animais-bela',
      feedback: 'Certo! Até o cachorro, o gato e um ratinho dormiram profundamente.',
      explicacaoRevisao: 'O sono atingiu Bela, seus pais e também os animais que estavam na casa.',
    },
    {
      id: 'feitico-falhou',
      enunciado: 'Por que Bela não dormiu durante cem anos?',
      alternativas: [
        { id: 'despertador', texto: 'Porque colocou o despertador para tocar de manhã' },
        { id: 'beijo-principe', texto: 'Porque recebeu o beijo de um príncipe' },
        { id: 'bruxa-desistiu', texto: 'Porque a bruxa desfez a maldição' },
        { id: 'pais-acordaram', texto: 'Porque os pais acordaram primeiro' },
      ],
      respostaCorreta: 'despertador',
      feedback: 'Exatamente! O despertador tocou e o feitiço não durou cem anos.',
      explicacaoRevisao:
        'Bela havia programado o despertador; quando ele tocou pela manhã, ela acordou e interrompeu o longo sono.',
    },
    {
      id: 'roqueiro-ajudou',
      enunciado: 'Quem cantava no rádio-relógio que ajudou Bela a acordar?',
      alternativas: [
        { id: 'roqueiro-preferido', texto: 'O roqueiro preferido de Bela' },
        { id: 'musico-festa', texto: 'O músico que tocou na festa do nascimento' },
        { id: 'pai-bela', texto: 'O pai de Bela' },
        { id: 'vizinho-cantor', texto: 'Um vizinho cantor de ópera' },
      ],
      respostaCorreta: 'roqueiro-preferido',
      feedback: 'Isso! A música do roqueiro tocou bem perto do ouvido de Bela.',
      explicacaoRevisao:
        'O rádio-relógio tocou uma música do roqueiro preferido de Bela, ajudando-a a despertar.',
    },
    {
      id: 'ditado-bela-despertador',
      tipo: 'ditado',
      enunciado: 'Ditado 1: ouça e digite a frase sobre o despertar de Bela.',
      textoDitado: 'Bela acordou com o toque do despertador.',
      respostaCorreta: 'Bela acordou com o toque do despertador.',
      feedback: 'Muito bem! O despertador ajudou Bela a vencer o sono da maldição.',
    },
    {
      id: 'ditado-bruxa-disco',
      tipo: 'ditado',
      enunciado: 'Ditado 2: ouça e digite a frase sobre o presente da bruxa.',
      textoDitado: 'A bruxa levou um disco antigo de presente.',
      respostaCorreta: 'A bruxa levou um disco antigo de presente.',
      feedback: 'Isso! O disco escondia a agulha usada para cumprir a maldição.',
    },
    {
      id: 'ditado-bilhete-roqueiro',
      tipo: 'ditado',
      enunciado: 'Ditado 3: ouça e digite a frase sobre o agradecimento de Bela.',
      textoDitado: 'Bela escreveu um bilhete para o roqueiro.',
      respostaCorreta: 'Bela escreveu um bilhete para o roqueiro.',
      feedback: 'Perfeito! Bela agradeceu pela música que a ajudou a acordar.',
    },
  ];

  var livros = [
    {
      id: 'primeiras-licoes-dinheiro',
      versao: 1,
      titulo: 'Primeiras Lições sobre Dinheiro',
      autor: 'Anderson Abreu',
      arquivoPdf: 'leituras/primeiras-licoes-sobre-dinheiro/infantil-dinheiro.pdf',
      capa: 'leituras/primeiras-licoes-sobre-dinheiro/capa.jpg',
      totalPaginas: 25,
      resumo:
        'Acompanhe Helena em descobertas sobre trabalho, escolhas, cuidado, espera e compartilhamento.',
      perfisDisponiveis: ['alice', 'mariana'],
      questionario: perguntasDinheiro,
    },
    {
      id: 'quem-e-o-rei-dos-animais',
      versao: 1,
      titulo: 'Quem é o rei dos animais?',
      autor: 'Nádia Aguiar',
      ilustrador: 'Rudson Duarte',
      arquivoPdf: 'leituras/quem-e-o-rei-dos-animais/rei-dos-animais.pdf',
      capa: 'leituras/quem-e-o-rei-dos-animais/capa.jpg',
      totalPaginas: 32,
      resumo:
        'Uma fábula sobre respeito, empatia e o valor das diferenças quando os animais precisam trabalhar juntos.',
      perfisDisponiveis: ['alice', 'mariana'],
      glossarioPorPagina: {
        10: ['convivencia'],
      },
      questionario: perguntasReiAnimais,
    },
    {
      id: 'a-galinha-dos-ovos-de-ouro',
      versao: 1,
      titulo: 'A Galinha dos Ovos de Ouro',
      autor: 'Esopo',
      adaptador: 'Anderson Abreu',
      arquivoPdf: 'leituras/a-galinha-dos-ovos-de-ouro/galinha-ovos-ouro.pdf',
      capa: 'leituras/a-galinha-dos-ovos-de-ouro/capa.jpg',
      totalPaginas: 35,
      resumo:
        'Uma fábula sobre paciência, gratidão, moderação e o perigo de perder tudo por querer demais de uma só vez.',
      perfisDisponiveis: ['alice', 'mariana'],
      questionario: perguntasGalinhaOuro,
    },
    {
      id: 'a-raposa-e-as-uvas',
      versao: 1,
      titulo: 'A Raposa e as Uvas',
      autor: 'Esopo',
      adaptador: 'Anderson Abreu',
      ilustrador: 'Elder Franca',
      arquivoPdf: 'leituras/a-raposa-e-as-uvas/raposa-e-as-uvas.pdf',
      capa: 'leituras/a-raposa-e-as-uvas/capa.jpg',
      totalPaginas: 21,
      resumo:
        'Uma fábula sobre esforço, frustração e a coragem de reconhecer a verdade para aprender e tentar novamente.',
      perfisDisponiveis: ['alice', 'mariana'],
      questionario: perguntasRaposaUvas,
    },
    {
      id: 'o-dia-que-o-sol-tirou-ferias',
      versao: 1,
      titulo: 'O dia que o Sol tirou férias',
      autor: 'Barbara Samel Rocha Tostes',
      ilustrador: 'Lionel Mota',
      arquivoPdf: 'leituras/o-dia-que-o-sol-tirou-ferias/o-dia-que-o-sol-tirou-ferias.pdf',
      capa: 'leituras/o-dia-que-o-sol-tirou-ferias/capa.jpg',
      totalPaginas: 30,
      resumo:
        'Os animais de uma floresta tentam entender por que o dia escureceu e descobrem um fenômeno do céu.',
      perfisDisponiveis: ['alice', 'mariana'],
      glossarioPorPagina: {
        5: ['apavoradas'],
        9: ['famintas'],
        11: ['substituto'],
        15: ['intelectuais'],
        23: ['desanimados'],
        30: ['eclipseSolar'],
      },
      explicacaoFinal: {
        titulo: 'O que aconteceu? Foi um eclipse solar!',
        paragrafos: [
          'O Sol não tirou férias de verdade. Na história, a Lua passou na frente do Sol por alguns minutos. Isso se chama eclipse solar.',
          'Imagine três amigos em fila: Sol, Lua e Terra. Quando a Lua fica entre a Terra e o Sol, ela esconde uma parte da luz. Por isso, o dia pode ficar mais escuro por um tempinho. Depois, a Lua continua seu caminho e a claridade volta.',
          'Importante: nunca olhe diretamente para o Sol, nem durante um eclipse. Para observar com segurança, use óculos próprios para eclipse e peça a ajuda de um adulto.',
        ],
        imagem: 'leituras/o-dia-que-o-sol-tirou-ferias/eclipse-solar.png',
        imagemAlt:
          'Ilustração de um eclipse solar: a Lua escura passa na frente do Sol e deixa parte da luz dourada visível.',
      },
      questionario: perguntasSolFerias,
    },
    {
      id: 'a-formiga-que-queria-cantar',
      versao: 1,
      titulo: 'A formiga que queria cantar',
      autor: 'Aparecida Machado',
      ilustrador: 'Raisa Christina',
      arquivoPdf: 'leituras/a-formiga-que-queria-cantar/a-formiga-que-queria-cantar.pdf',
      capa: 'leituras/a-formiga-que-queria-cantar/capa.jpg',
      totalPaginas: 36,
      resumo:
        'Felipa sonha em cantar e encontra amigos que a ajudam a transformar sua voz em coragem, amizade e realização.',
      perfisDisponiveis: ['alice', 'mariana'],
      glossarioPorPagina: {
        7: ['rouxinol'],
        11: ['altiva'],
        16: ['rebulico', 'melancolica'],
        19: ['clamou'],
        21: ['celestial'],
        22: ['orquestra'],
        29: ['ensaios'],
        30: ['estreia', 'radiante'],
        33: ['plateia', 'delirou'],
      },
      questionario: perguntasFormigaCantora,
    },
    {
      id: 'um-castelo-bem-assombrado',
      versao: 1,
      titulo: 'Um castelo bem assombrado',
      autor: 'Lícia Holanda',
      ilustrador: 'Juliana Chagas',
      arquivoPdf: 'leituras/um-castelo-bem-assombrado/um-castelo-bem-assombrado.pdf',
      capa: 'leituras/um-castelo-bem-assombrado/capa.jpg',
      totalPaginas: 25,
      resumo:
        'Júlia e seus colegas descobrem que os mistérios de um velho casarão têm explicações muito diferentes das lendas assustadoras.',
      perfisDisponiveis: ['alice', 'mariana'],
      glossarioPorPagina: {
        6: ['lenda', 'paradeiro'],
        9: ['casarao', 'inconformados', 'vagavam'],
        13: ['pasma', 'desvendar'],
        17: ['lustre'],
        20: ['traumatizados'],
        21: ['reforma'],
      },
      questionario: perguntasCasteloAssombrado,
    },
    {
      id: 'a-bela-desadormecida',
      versao: 1,
      titulo: 'A Bela Desadormecida',
      autor: 'Frances Minters',
      ilustrador: 'G. Brian Karas',
      arquivoPdf: 'leituras/a-bela-desadormecida/a-bela-desadormecida.pdf',
      capa: 'leituras/a-bela-desadormecida/capa.jpg',
      totalPaginas: 30,
      resumo:
        'Uma versão divertida de um conto conhecido, em que Bela usa um despertador e a música para escapar de um sono de cem anos.',
      perfisDisponiveis: ['alice', 'mariana'],
      correcaoObjetivas: 'ao-final',
      glossarioPorPagina: {
        1: ['desadormecida'],
        7: ['cotoveladas'],
        9: ['formosa'],
        16: ['longPlay'],
        18: ['desalmada', 'seculo'],
        23: ['feitico'],
        26: ['intrometida'],
      },
      questionario: perguntasBelaDesadormecida,
    },
  ];

  function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function obter(id) {
    return livros.find(function (livro) {
      return livro.id === id;
    });
  }

  window.RegistroLeituras = {
    listar: function (perfil) {
      return livros
        .filter(function (livro) {
          return !perfil || livro.perfisDisponiveis.indexOf(perfil) >= 0;
        })
        .map(copiar);
    },
    obter: function (id) {
      var livro = obter(id);
      return livro ? copiar(livro) : null;
    },
  };
})();
