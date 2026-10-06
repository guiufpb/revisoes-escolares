(function () {
  'use strict';

  // Conteúdo original do roteiro aprovado; opções e cartões têm ordem editorial fixa.
  window.QuestionariosRevisoes.registrar({
    id: 'alice-historia-objetos-memorias-outubro-2026',
    aluno: 'alice',
    nome: 'Alice',
    materia: 'História',
    titulo: 'Objetos e histórias — Uma investigação da Alice',
    subtitulo: 'Lembranças, diferentes povos e mudanças entre antigo e atual',
    chave: 'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1',
    layout: {
      desktopAmplo: true,
    },
    validacaoEstritaEstado: true,
    registrarTentativas: true,
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        {
          id: 'alice',
          nome: 'Alice',
          principal: true,
          chaveArmazenamento: 'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1',
        },
        {
          id: 'responsavel',
          nome: 'Responsável',
          chaveArmazenamento:
            'revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.responsavel.v1',
        },
      ],
    },
    resumoFinal:
      'Alice, você investigou lembranças, diferentes povos e mudanças nos objetos! Histórias podem ser descobertas com cuidado, respeito e boas perguntas. Se quiser, converse com seu responsável, sem valer pontos: qual objeto você gostaria de guardar? O que ele lembra? Quem poderia contar mais sobre ele? Você também pode desenhar em papel.',
    questoes: [
      {
        id: 'objetos-memorias-q01',
        bloco: 'História · Bloco 1 de 6 · Lembranças e pistas',
        titulo: '1. Um objeto especial',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q01-a',
            pergunta: '1A — Por que Lia quer guardar o barquinho?',
            opcoes: [
              'Porque ele foi comprado ontem.',
              'Porque ele lembra uma tarde especial.',
              'Porque ele nunca foi usado.',
            ],
            respostas: ['Porque ele lembra uma tarde especial.'],
          },
        ],
        dica: 'Pense no que Lia recorda quando olha para o barquinho.',
        sucesso: 'A lembrança dá um significado especial ao barquinho, mesmo sendo simples.',
        leitura:
          'Lia guardou um barquinho de papel. Ela o fez com uma pessoa querida em um dia de chuva. O barquinho ficou amassado, mas Lia sorri quando se lembra daquela tarde. Um objeto simples pode ajudar a lembrar um momento especial.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/caixa.svg',
        descricaoIlustracao: 'Barquinho de papel amassado junto de uma caixa de lembranças.',
      },
      {
        id: 'objetos-memorias-q02',
        bloco: 'História · Bloco 1 de 6 · Lembranças e pistas',
        titulo: '2. As pistas da caixa',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'selecao',
        itens: [
          {
            id: 'objetos-memorias-q02-a',
            pergunta:
              '2A — Neste relato, quais itens estão ligados a uma lembrança de Lia? Marque todos.',
            tipo: 'selecao',
            opcoes: ['Clipe novo', 'Medalha da corrida', 'Foto do passeio', 'Sapatinho de bebê'],
            respostas: ['Medalha da corrida', 'Foto do passeio', 'Sapatinho de bebê'],
          },
        ],
        dica: 'Procure os itens que aparecem ligados a um acontecimento da vida de Lia.',
        sucesso:
          'Objetos diferentes podem lembrar fases e acontecimentos diferentes. O clipe também poderia ganhar uma história no futuro.',
        leitura:
          'Na caixa de Lia há uma medalha da corrida da escola, um sapatinho usado quando ela era bebê e uma foto de um passeio. Um clipe novo foi colocado na caixa apenas para prender uma etiqueta. Lia ainda não tem uma lembrança especial ligada a esse clipe.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/lembrancas.svg',
        descricaoIlustracao:
          'Uma medalha, uma foto de passeio, um sapatinho de bebê e um clipe em quatro quadros sem marcas de acerto.',
      },
      {
        id: 'objetos-memorias-q03',
        bloco: 'História · Bloco 1 de 6 · Lembranças e pistas',
        titulo: '3. Uso e lembrança',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q03-a',
            pergunta: '3A — Para que serve a moringa deste exemplo?',
            opcoes: ['Mostrar as horas', 'Guardar água', 'Proteger o pé'],
            respostas: ['Guardar água'],
          },
          {
            id: 'objetos-memorias-q03-b',
            pergunta: '3B — Para que serve o sapatinho?',
            opcoes: ['Proteger o pé', 'Guardar água', 'Mostrar as horas'],
            respostas: ['Proteger o pé'],
          },
          {
            id: 'objetos-memorias-q03-c',
            pergunta: '3C — Para que serve o relógio?',
            opcoes: ['Guardar água', 'Proteger o pé', 'Mostrar as horas'],
            respostas: ['Mostrar as horas'],
          },
        ],
        dica: 'Pergunte primeiro: o que cada objeto ajuda a fazer?',
        sucesso:
          'Um objeto pode ter uma função no dia a dia e, ao mesmo tempo, guardar uma lembrança.',
        leitura:
          'Na família de Lia, uma moringa de barro guarda água. Ela também lembra os encontros com a avó. O relógio mostra as horas e lembra quem o deu de presente. O sapatinho protegia o pé de Lia quando ela era bebê. Uso e lembrança podem caminhar juntos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/uso.svg',
        descricaoIlustracao:
          'Moringa de barro, sapatinho e relógio, apresentados como objetos do relato.',
      },
      {
        id: 'objetos-memorias-q04',
        bloco: 'História · Bloco 1 de 6 · Lembranças e pistas',
        titulo: '4. O que a fotografia mostra',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q04-a',
            pergunta: '4A — Quais informações podemos observar nessa imagem?',
            tipo: 'selecao',
            opcoes: ['Os nomes das crianças', 'Duas crianças', 'Uma bola', 'A data da brincadeira'],
            respostas: ['Duas crianças', 'Uma bola'],
          },
          {
            id: 'objetos-memorias-q04-b',
            pergunta: '4B — Como descobrir em que dia a fotografia foi feita?',
            opcoes: [
              'Adivinhar pelo tamanho da bola.',
              'Contar quantas crianças aparecem.',
              'Consultar um registro da foto ou perguntar a quem sabe.',
            ],
            respostas: ['Consultar um registro da foto ou perguntar a quem sabe.'],
          },
        ],
        dica: 'Separe o que está visível do que não foi informado.',
        sucesso: 'A imagem oferece pistas. Data e nomes podem exigir outra fonte.',
        leitura:
          'Uma fotografia registra um instante. Ela pode mostrar pessoas, roupas e lugares. Nem sempre conta tudo sobre aquele dia. Observe a cena desenhada: duas crianças brincam de bola no pátio. A imagem não tem data nem nomes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/patio.svg',
        descricaoIlustracao:
          'Duas crianças brincam com uma bola no pátio. A cena não apresenta nomes nem data.',
      },
      {
        id: 'objetos-memorias-q05',
        bloco: 'História · Bloco 1 de 6 · Lembranças e pistas',
        titulo: '5. Ouvir e escrever palavras de História',
        instrucao:
          'Ouça uma unidade por vez, escreva e confira. Você pode repetir, parar e corrigir.',
        tipo: 'campos',
        itens: [
          {
            id: 'objetos-memorias-q05-a',
            pergunta: '5A — Palavra 1',
            respostas: ['memória'],
            pontuacaoFlexivel: true,
          },
          {
            id: 'objetos-memorias-q05-b',
            pergunta: '5B — Palavra 2',
            respostas: ['objeto'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Ouça novamente e confira se escreveu as partes da palavra.',
        sucesso: 'Você praticou a escrita de duas palavras que ajudam a conversar sobre História.',
        leitura:
          'História é uma investigação de pistas e lembranças. Agora você vai ouvir duas palavras usadas nessa aventura. Escute uma de cada vez, escreva e confira. Pode repetir quantas vezes precisar.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'objetos-memorias-q06',
        bloco: 'História · Bloco 2 de 6 · Crescer, usar e lembrar',
        titulo: '6. Objetos enquanto crescemos',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q06-a',
            pergunta: '6A — Berço usado por Lia',
            opcoes: ['Agora, na escola', 'Quando Lia era bebê'],
            respostas: ['Quando Lia era bebê'],
          },
          {
            id: 'objetos-memorias-q06-b',
            pergunta: '6B — Caderno de atividades usado por Lia',
            opcoes: ['Quando Lia era bebê', 'Agora, na escola'],
            respostas: ['Agora, na escola'],
          },
          {
            id: 'objetos-memorias-q06-c',
            pergunta: '6C — Sapatinhos pequenos do álbum',
            opcoes: ['Agora, na escola', 'Quando Lia era bebê'],
            respostas: ['Quando Lia era bebê'],
          },
        ],
        dica: 'Use as anotações do álbum, sem imaginar que toda criança usa os mesmos objetos.',
        sucesso: 'Na história de Lia, os objetos mudam conforme ela cresce.',
        leitura:
          'No álbum de Lia, os responsáveis anotaram: quando era bebê, ela dormia no berço e usava sapatinhos pequenos. Hoje, Lia leva seu caderno de atividades para a escola. Nesta questão, use a história de Lia: outras crianças podem ter objetos diferentes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/fases.svg',
        descricaoIlustracao:
          'Três objetos do álbum de Lia: berço, caderno de atividades e sapatinhos pequenos.',
      },
      {
        id: 'objetos-memorias-q07',
        bloco: 'História · Bloco 2 de 6 · Crescer, usar e lembrar',
        titulo: '7. Primeiro e depois',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q07-a',
            pergunta: '7A — Monte a sequência do primeiro ao último momento.',
            tipo: 'ordenacao',
            cartoes: [
              'Começou a frequentar a escola',
              'Usava sapatinhos de bebê',
              'Aprendeu a andar',
            ],
            respostas: [
              'Usava sapatinhos de bebê',
              'Aprendeu a andar',
              'Começou a frequentar a escola',
            ],
            rotuloOrdem: 'Acontecimentos do primeiro ao último',
          },
        ],
        dica: 'Localize primeiro, depois e mais tarde no relato.',
        sucesso: 'Você organizou uma linha do tempo com três momentos da história de Lia.',
        leitura:
          'No relato de Lia, há três momentos. Primeiro, quando era bebê, usava sapatinhos pequenos. Depois, aprendeu a andar. Mais tarde, começou a frequentar a escola. Palavras como primeiro e depois ajudam a organizar uma história.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/fases.svg',
        descricaoIlustracao:
          'Berço, caderno e sapatinhos do álbum. O relato informa os momentos da vida de Lia.',
      },
      {
        id: 'objetos-memorias-q08',
        bloco: 'História · Bloco 2 de 6 · Crescer, usar e lembrar',
        titulo: '8. A caixa ganhou outro uso',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q08-a',
            pergunta: '8A — Antes da brincadeira, qual era o uso da caixa?',
            opcoes: [
              'Guardar livros',
              'Ser um ônibus de faz de conta',
              'Transportar passageiros de verdade',
            ],
            respostas: ['Guardar livros'],
          },
          {
            id: 'objetos-memorias-q08-b',
            pergunta: '8B — O que mudou no exemplo?',
            opcoes: ['O material da caixa.', 'O tamanho da caixa.', 'A maneira de usar a caixa.'],
            respostas: ['A maneira de usar a caixa.'],
          },
        ],
        dica: 'Compare o uso dado pelo adulto com o uso dado por Lia.',
        sucesso: 'O material permaneceu o mesmo; o uso mudou na brincadeira.',
        leitura:
          'Um adulto usou uma caixa limpa para guardar livros. Depois, com permissão, Lia transformou a caixa em um ônibus de brincadeira. A caixa continuou sendo de papelão, mas ganhou outro uso. Um objeto pode participar de histórias diferentes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/caixa-usos.svg',
        descricaoIlustracao:
          'A mesma caixa de papelão guarda livros em uma cena e funciona como ônibus de faz de conta na outra.',
      },
      {
        id: 'objetos-memorias-q09',
        bloco: 'História · Bloco 2 de 6 · Crescer, usar e lembrar',
        titulo: '9. De que é feito',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q09-a',
            pergunta: '9A — Colher desta exposição',
            opcoes: ['Metal', 'Madeira', 'Barro'],
            respostas: ['Madeira'],
          },
          {
            id: 'objetos-memorias-q09-b',
            pergunta: '9B — Tigela desta exposição',
            opcoes: ['Barro', 'Metal', 'Madeira'],
            respostas: ['Barro'],
          },
          {
            id: 'objetos-memorias-q09-c',
            pergunta: '9C — Panela desta exposição',
            opcoes: ['Madeira', 'Barro', 'Metal'],
            respostas: ['Metal'],
          },
        ],
        dica: 'Observe a textura e use a ficha de cada objeto.',
        sucesso: 'O material é uma pista para conhecer como um objeto foi feito.',
        leitura:
          'Observe três objetos desta exposição: uma colher de madeira, uma panela de metal e uma tigela de barro. A ficha de cada objeto informa seu material. Existem colheres e tigelas feitas de outros materiais; aqui, vamos estudar estes exemplos.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/materiais.svg',
        descricaoIlustracao:
          'Colher de madeira com veios, tigela de barro e panela de metal, cada uma com a ficha do material.',
      },
      {
        id: 'objetos-memorias-q10',
        bloco: 'História · Bloco 2 de 6 · Crescer, usar e lembrar',
        titulo: '10. O valor de uma lembrança',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q10-a',
            pergunta: '10A — Um desenho feito hoje pode lembrar um momento importante.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            id: 'objetos-memorias-q10-b',
            pergunta: '10B — Um objeto precisa ser caro para ter importância afetiva.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
          {
            id: 'objetos-memorias-q10-c',
            pergunta: '10C — Duas pessoas podem guardar lembranças diferentes do mesmo encontro.',
            opcoes: ['Falso', 'Verdadeiro'],
            respostas: ['Verdadeiro'],
          },
        ],
        dica: 'Pense na relação entre a pessoa e o acontecimento.',
        sucesso: 'O significado de um objeto depende da história que ele ajuda a lembrar.',
        leitura:
          'Um ingresso de papel lembra a primeira visita de Lia ao teatro. Um desenho feito hoje lembra um encontro com alguém querido. Objetos novos ou antigos podem ter significado. Cada pessoa pode guardar lembranças diferentes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q11',
        bloco: 'História · Bloco 3 de 6 · Diferentes povos no presente',
        titulo: '11. Materiais na galeria dos povos',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q11-a',
            pergunta: '11A — Boneca de barro: qual material aparece no exemplo?',
            opcoes: ['Fibra de arumã', 'Bambu e sementes', 'Barro'],
            respostas: ['Barro'],
          },
          {
            id: 'objetos-memorias-q11-b',
            pergunta: '11B — Cesto Baniwa: qual material aparece no exemplo?',
            opcoes: ['Fibra de arumã', 'Barro', 'Bambu e sementes'],
            respostas: ['Fibra de arumã'],
          },
          {
            id: 'objetos-memorias-q11-c',
            pergunta: '11C — Colar do exemplo Timbira: quais materiais aparecem?',
            opcoes: ['Barro', 'Bambu e sementes', 'Fibra de arumã'],
            respostas: ['Bambu e sementes'],
          },
        ],
        dica: 'Observe se o objeto foi modelado, trançado ou montado com pequenas peças.',
        sucesso: 'Materiais e maneiras de fazer ajudam a conhecer os saberes de diferentes povos.',
        leitura:
          'Há muitos povos indígenas, com histórias e conhecimentos diferentes. Nesta galeria, vamos conhecer três exemplos estudados: bonecas de barro do povo Karajá, cestos de fibra de arumã do povo Baniwa e colares de bambu e sementes apresentados como Timbira no material escolar. Arumã é uma planta.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/galeria.svg',
        descricaoIlustracao:
          'Esquemas didáticos: boneca de barro Karajá; cesto de arumã Baniwa; exemplo Timbira de colar com peças compridas de bambu e sementes arredondadas.',
      },
      {
        id: 'objetos-memorias-q12',
        bloco: 'História · Bloco 3 de 6 · Diferentes povos no presente',
        titulo: '12. Quem fez cada exemplo',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q12-a',
            pergunta: '12A — Cesto de arumã da galeria',
            opcoes: ['Timbira', 'Baniwa', 'Karajá'],
            respostas: ['Baniwa'],
          },
          {
            id: 'objetos-memorias-q12-b',
            pergunta: '12B — Boneca de barro da galeria',
            opcoes: ['Karajá', 'Timbira', 'Baniwa'],
            respostas: ['Karajá'],
          },
          {
            id: 'objetos-memorias-q12-c',
            pergunta: '12C — Colar de bambu e sementes da galeria',
            opcoes: ['Baniwa', 'Karajá', 'Timbira'],
            respostas: ['Timbira'],
          },
        ],
        dica: 'Consulte a ficha do objeto e procure o nome do povo.',
        sucesso: 'Você ligou cada exemplo ao povo estudado, sem tratar todos os povos como iguais.',
        leitura:
          'Vamos voltar às fichas da galeria: Karajá, boneca de barro; Baniwa, cesto de arumã; Timbira, colar de bambu e sementes no exemplo do caderno. São exemplos de conhecimentos diferentes. Cada povo produz muitos outros objetos também.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/galeria.svg',
        descricaoIlustracao:
          'Três fichas: Karajá, boneca de barro; Baniwa, cesto de fibra de arumã; Timbira, colar de bambu e sementes, neste exemplo.',
      },
      {
        id: 'objetos-memorias-q13',
        bloco: 'História · Bloco 3 de 6 · Diferentes povos no presente',
        titulo: '13. O colar tem mais de um material',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'selecao',
        itens: [
          {
            id: 'objetos-memorias-q13-a',
            pergunta: '13A — Quais materiais fazem parte desse colar? Marque os dois.',
            tipo: 'selecao',
            opcoes: ['Sementes', 'Barro', 'Bambu', 'Fibra de arumã'],
            respostas: ['Sementes', 'Bambu'],
          },
        ],
        dica: 'O exemplo reúne peças compridas e peças arredondadas.',
        sucesso: 'O colar reúne bambu e sementes. Um único objeto pode combinar materiais.',
        leitura:
          'Um objeto pode reunir mais de um material. No colar do exemplo Timbira, há pequenas peças de bambu e sementes. Na figura, as peças de bambu são compridas e as sementes são arredondadas. Vamos observar as duas partes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/galeria.svg',
        descricaoIlustracao:
          'No esquema do colar, peças de bambu compridas e sementes arredondadas são nomeadas separadamente. Os outros quadros mostram barro e arumã.',
      },
      {
        id: 'objetos-memorias-q14',
        bloco: 'História · Bloco 3 de 6 · Diferentes povos no presente',
        titulo: '14. Conhecer com respeito',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q14-a',
            pergunta: '14A — Quais atitudes ajudam a conhecer uma cultura com respeito?',
            tipo: 'selecao',
            opcoes: [
              'Pedir que todas as pessoas tenham os mesmos costumes',
              'Ouvir a explicação de quem fez o objeto',
              'Perguntar com gentileza sobre o material',
              'Rir de uma língua diferente',
            ],
            respostas: [
              'Ouvir a explicação de quem fez o objeto',
              'Perguntar com gentileza sobre o material',
            ],
          },
          {
            id: 'objetos-memorias-q14-b',
            pergunta: '14B — Qual frase é correta?',
            opcoes: [
              'Todos os povos indígenas têm os mesmos costumes.',
              'Povos indígenas existem apenas no passado.',
              'Há diferentes povos indígenas vivendo no presente.',
            ],
            respostas: ['Há diferentes povos indígenas vivendo no presente.'],
          },
        ],
        dica: 'Conhecer não é exigir que o outro seja igual a você.',
        sucesso:
          'Aprender sobre diferentes povos inclui valorizar sua presença e seus conhecimentos hoje.',
        leitura:
          'Os povos indígenas fazem parte do Brasil de hoje. Seus conhecimentos, línguas e maneiras de viver podem ser diferentes. Conhecer uma cultura pede respeito: ouvir, perguntar com gentileza e valorizar quem compartilha seus saberes.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q15',
        bloco: 'História · Bloco 3 de 6 · Diferentes povos no presente',
        titulo: '15. Uma frase sobre diferentes povos',
        instrucao:
          'Ouça uma unidade por vez, escreva e confira. Você pode repetir, parar e corrigir.',
        tipo: 'campos',
        itens: [
          {
            id: 'objetos-memorias-q15-a',
            pergunta: '15A — Frase 1',
            respostas: ['Cada povo tem sua história.'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Ouça a frase toda mais uma vez e confira cada palavra.',
        sucesso: 'Você registrou uma ideia importante sobre a diversidade dos povos.',
        leitura:
          'Nossa galeria apresentou saberes diferentes. Cada comunidade pode transmitir conhecimentos às novas gerações. Agora escute uma frase curta sobre o que aprendemos. Escreva, repita se precisar e confira.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
      {
        id: 'objetos-memorias-q16',
        bloco: 'História · Bloco 4 de 6 · Antigo, atual e permanências',
        titulo: '16. Modelos de tempos diferentes',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q16-a',
            pergunta: '16A — Exemplar A: tela pequena e corpo profundo, usado há muitos anos',
            opcoes: ['Modelo atual da comparação', 'Modelo antigo da comparação'],
            respostas: ['Modelo antigo da comparação'],
          },
          {
            id: 'objetos-memorias-q16-b',
            pergunta: '16B — Exemplar B: tela plana e corpo fino, comprado recentemente',
            opcoes: ['Modelo atual da comparação', 'Modelo antigo da comparação'],
            respostas: ['Modelo atual da comparação'],
          },
        ],
        dica: 'Compare as fichas e a espessura dos dois televisores.',
        sucesso:
          'Os modelos têm aparências diferentes. Um exemplar antigo também pode continuar em uso.',
        leitura:
          'As fichas desta exposição mostram dois modelos de televisor. O exemplar A foi usado pela família há muitos anos: tem tela pequena e corpo profundo. O exemplar B foi comprado recentemente: tem tela plana e corpo fino. Estamos comparando estes exemplares, não todas as casas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/televisores.svg',
        descricaoIlustracao:
          'À esquerda, exemplar B comprado recentemente, fino e com controle remoto. À direita, exemplar A usado há muitos anos, com corpo profundo e botões. Os dois mostram imagens e sons.',
      },
      {
        id: 'objetos-memorias-q17',
        bloco: 'História · Bloco 4 de 6 · Antigo, atual e permanências',
        titulo: '17. Formas diferentes e funções parecidas',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q17-a',
            pergunta: '17A — Qual objeto atual tem função parecida com o telefone de disco?',
            opcoes: ['Computador para escrever', 'Celular para conversar', 'Lâmpada para iluminar'],
            respostas: ['Celular para conversar'],
          },
          {
            id: 'objetos-memorias-q17-b',
            pergunta: '17B — Qual objeto atual tem função parecida com o lampião?',
            opcoes: ['Lâmpada para iluminar', 'Celular para conversar', 'Computador para escrever'],
            respostas: ['Lâmpada para iluminar'],
          },
          {
            id: 'objetos-memorias-q17-c',
            pergunta: '17C — Qual objeto atual tem função parecida com a máquina de escrever?',
            opcoes: ['Celular para conversar', 'Lâmpada para iluminar', 'Computador para escrever'],
            respostas: ['Computador para escrever'],
          },
        ],
        dica: 'Pense na tarefa feita com o objeto, não apenas em sua aparência.',
        sucesso: 'A forma e os recursos podem mudar enquanto uma função parecida permanece.',
        leitura:
          'Muitos objetos mudam, mas continuam ajudando em tarefas parecidas. Um lampião e uma lâmpada podem iluminar. A máquina de escrever e o computador ajudam a produzir textos. O telefone de disco e o celular permitem conversar a distância.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q18',
        bloco: 'História · Bloco 4 de 6 · Antigo, atual e permanências',
        titulo: '18. O que mudou e o que permaneceu',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q18-a',
            pergunta: '18A — Quais diferenças aparecem entre os aparelhos deste exemplo?',
            tipo: 'selecao',
            opcoes: [
              'A espessura do corpo',
              'Os dois mostram imagens',
              'A maneira de controlar o aparelho',
            ],
            respostas: ['A espessura do corpo', 'A maneira de controlar o aparelho'],
          },
          {
            id: 'objetos-memorias-q18-b',
            pergunta: '18B — O que permaneceu nos dois aparelhos?',
            opcoes: [
              'O mesmo tamanho e os mesmos botões.',
              'Mostrar imagens e sons.',
              'A data em que foram comprados.',
            ],
            respostas: ['Mostrar imagens e sons.'],
          },
        ],
        dica: 'Separe as diferenças daquilo que os dois continuam fazendo.',
        sucesso: 'Mudança e permanência podem aparecer juntas quando comparamos objetos.',
        leitura:
          'O aparelho antigo da exposição tem corpo profundo e botões na frente. O aparelho recente é fino e pode ser controlado por um controle remoto. Os dois mostram imagens e sons. Há coisas que mudaram e uma função que continuou.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/televisores.svg',
        descricaoIlustracao:
          'Exemplar B fino com controle remoto e exemplar A profundo com botões. Ambos mostram imagens e sons. Fichas informam compra recente e uso há muitos anos.',
      },
      {
        id: 'objetos-memorias-q19',
        bloco: 'História · Bloco 4 de 6 · Antigo, atual e permanências',
        titulo: '19. Um anúncio guardado',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q19-a',
            pergunta: '19A — Qual objeto está sendo oferecido no anúncio?',
            opcoes: ['Geladeira', 'Guarda-roupa', 'Fogão'],
            respostas: ['Fogão'],
          },
          {
            id: 'objetos-memorias-q19-b',
            pergunta:
              '19B — O anúncio prova que todas as famílias daquele lugar tinham o aparelho?',
            opcoes: [
              'Não. Algumas não podiam comprá-lo.',
              'Sim. Aparecer num anúncio mostra que todos compraram.',
              'Sim. O anúncio foi guardado por muitos anos.',
            ],
            respostas: ['Não. Algumas não podiam comprá-lo.'],
          },
        ],
        dica: 'Compare anunciar um produto com conseguir comprá-lo.',
        sucesso:
          'A fonte mostra um produto oferecido. A ficha ajuda a entender que nem todos tinham acesso a ele.',
        leitura:
          'No museu, Lia viu um anúncio antigo de fogão, guardado por muitos anos. A ficha explica que, naquele lugar e tempo, algumas famílias não tinham dinheiro para comprar o aparelho anunciado. Um anúncio ajuda a conhecer produtos oferecidos; sozinho, não mostra o que havia em todas as casas.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/anuncio.svg',
        descricaoIlustracao:
          'Anúncio fictício com a palavra FOGÃO e desenho de um fogão. Ficha de relato inventado: algumas famílias daquele lugar e tempo não tinham dinheiro para comprar o aparelho.',
      },
      {
        id: 'objetos-memorias-q20',
        bloco: 'História · Bloco 4 de 6 · Antigo, atual e permanências',
        titulo: '20. Tradicional também pode ser de hoje',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q20-a',
            pergunta: '20A — Um objeto antigo pode continuar em uso.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Verdadeiro'],
          },
          {
            id: 'objetos-memorias-q20-b',
            pergunta:
              '20B — O filtro comprado nesta semana precisa ser um exemplar antigo só porque é de barro.',
            opcoes: ['Verdadeiro', 'Falso'],
            respostas: ['Falso'],
          },
          {
            id: 'objetos-memorias-q20-c',
            pergunta:
              '20C — A história do exemplar ajuda a descobrir quando foi feito ou comprado.',
            opcoes: ['Falso', 'Verdadeiro'],
            respostas: ['Verdadeiro'],
          },
        ],
        dica: 'Material e modelo não informam sozinhos quando um exemplar foi feito.',
        sucesso:
          'Um modelo tradicional pode continuar sendo produzido hoje. Antigo não significa sem uso.',
        leitura:
          'Na casa de Lia, uma colher de madeira foi feita há muitos anos e continua sendo usada. Um filtro de barro foi comprado nesta semana. Ele tem um modelo tradicional, parecido com outros usados há bastante tempo. Para saber a idade de um exemplar, precisamos de informações sobre ele.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q21',
        bloco: 'História · Bloco 5 de 6 · Registros e fontes',
        titulo: '21. Registros em papel e na tela',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q21-a',
            pergunta: '21A — Qual registro digital tem função parecida com uma carta?',
            opcoes: ['Convite digital', 'Mensagem no celular', 'Galeria de fotos'],
            respostas: ['Mensagem no celular'],
          },
          {
            id: 'objetos-memorias-q21-b',
            pergunta:
              '21B — Qual registro digital tem função parecida com um álbum de fotografias?',
            opcoes: ['Galeria de fotos', 'Convite digital', 'Mensagem no celular'],
            respostas: ['Galeria de fotos'],
          },
          {
            id: 'objetos-memorias-q21-c',
            pergunta: '21C — Qual registro digital tem função parecida com um convite impresso?',
            opcoes: ['Mensagem no celular', 'Galeria de fotos', 'Convite digital'],
            respostas: ['Convite digital'],
          },
        ],
        dica: 'Procure a finalidade de cada registro: comunicar, reunir fotos ou convidar.',
        sucesso:
          'Papel e tela podem cumprir funções parecidas e continuar existindo ao mesmo tempo.',
        leitura:
          'Mensagens, fotografias e convites podem existir em papel ou em formato digital. Essas formas convivem hoje. A carta comunica; o álbum reúne fotos; o convite informa sobre um encontro. A tecnologia pode mudar a forma de registrar.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q22',
        bloco: 'História · Bloco 5 de 6 · Registros e fontes',
        titulo: '22. Pistas por escrito',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'selecao',
        itens: [
          {
            id: 'objetos-memorias-q22-a',
            pergunta: '22A — Quais destes exemplos guardam informações por escrito?',
            tipo: 'selecao',
            opcoes: [
              'Bilhete com uma mensagem',
              'Carrinho sem nome nem texto',
              'Certidão com data de nascimento',
              'Diário com relato de um passeio',
            ],
            respostas: [
              'Bilhete com uma mensagem',
              'Certidão com data de nascimento',
              'Diário com relato de um passeio',
            ],
          },
        ],
        dica: 'Procure onde há mensagens, datas ou relatos escritos.',
        sucesso:
          'Documentos e outros objetos podem ser fontes. Aqui você reconheceu três registros escritos.',
        leitura:
          'Muitos objetos podem servir como fontes históricas. Alguns têm registros escritos, como um bilhete, uma certidão e uma página de diário. Um brinquedo também oferece pistas, mesmo sem palavras. Nesta questão, procure os registros que têm informação por escrito.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q23',
        bloco: 'História · Bloco 5 de 6 · Registros e fontes',
        titulo: '23. De quem é a história',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q23-a',
            pergunta: '23A — Jornal sobre a festa do bairro: grupo principal nesta ficha',
            opcoes: ['Pessoal', 'Familiar', 'Comunitária', 'Escolar'],
            respostas: ['Comunitária'],
          },
          {
            id: 'objetos-memorias-q23-b',
            pergunta: '23B — Álbum da família: grupo principal nesta ficha',
            opcoes: ['Familiar', 'Comunitária', 'Escolar', 'Pessoal'],
            respostas: ['Familiar'],
          },
          {
            id: 'objetos-memorias-q23-c',
            pergunta: '23C — Livro de chamadas da turma: grupo principal nesta ficha',
            opcoes: ['Familiar', 'Pessoal', 'Comunitária', 'Escolar'],
            respostas: ['Escolar'],
          },
          {
            id: 'objetos-memorias-q23-d',
            pergunta: '23D — Diário de sentimentos de Lia: grupo principal nesta ficha',
            opcoes: ['Escolar', 'Pessoal', 'Familiar', 'Comunitária'],
            respostas: ['Pessoal'],
          },
        ],
        dica: 'Use o grupo destacado pela ficha; a fonte pode também interessar a outros grupos.',
        sucesso:
          'Pessoal, familiar, escolar e comunitária indicam o foco desta investigação, não caixas fechadas para sempre.',
        leitura:
          'Uma fonte pode contar mais de uma história. Aqui, cada ficha destaca um grupo principal: o diário de Lia fala de seus sentimentos; o álbum reúne sua família; o livro de chamadas registra a turma; o jornal do bairro conta uma festa da comunidade.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q24',
        bloco: 'História · Bloco 5 de 6 · Registros e fontes',
        titulo: '24. Escolher uma boa fonte',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q24-a',
            pergunta:
              '24A — Para descobrir a data de nascimento de uma pessoa, qual fonte você consultaria primeiro?',
            opcoes: ['Foto sem legenda', 'Brinquedo sem ficha', 'Certidão de nascimento'],
            respostas: ['Certidão de nascimento'],
          },
          {
            id: 'objetos-memorias-q24-b',
            pergunta:
              '24B — Para saber quem teve a presença anotada em uma aula, qual fonte você consultaria primeiro?',
            opcoes: ['Livro de chamadas da turma', 'Convite de aniversário', 'Álbum de um passeio'],
            respostas: ['Livro de chamadas da turma'],
          },
        ],
        dica: 'Combine o que você quer saber com a informação registrada na fonte.',
        sucesso: 'Você escolheu fontes que respondem diretamente a duas perguntas diferentes.',
        leitura:
          'Antes de pesquisar, pense no que deseja descobrir. Uma certidão registra a data de nascimento. Um livro de chamadas registra a presença da turma. Uma fotografia pode mostrar uma festa. A melhor fonte depende da pergunta.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q25',
        bloco: 'História · Bloco 5 de 6 · Registros e fontes',
        titulo: '25. Uma semana de descobertas',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q25-a',
            pergunta: '25A — Organize os três acontecimentos conforme a agenda.',
            tipo: 'ordenacao',
            cartoes: ['Abrir a exposição', 'Separar objetos', 'Preparar fichas'],
            respostas: ['Separar objetos', 'Preparar fichas', 'Abrir a exposição'],
            rotuloOrdem: 'Acontecimentos do primeiro ao último',
          },
          {
            id: 'objetos-memorias-q25-b',
            pergunta: '25B — A agenda apresentada organiza acontecimentos de qual período?',
            opcoes: ['Um ano', 'Uma semana', 'Uma hora'],
            respostas: ['Uma semana'],
          },
        ],
        dica: 'Siga os dias anotados, começando pela segunda-feira.',
        sucesso:
          'A agenda ajudou a organizar o que aconteceu antes e depois, dentro de uma semana.',
        leitura:
          'A agenda da turma tem três anotações: segunda-feira, separar objetos; quarta-feira, preparar fichas; sexta-feira, abrir a exposição. Uma semana reúne sete dias. As anotações mostram a preparação antes da visita.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/agenda.svg',
        descricaoIlustracao:
          'Agenda com sete dias, de segunda a domingo. Segunda: separar objetos; quarta: preparar fichas; sexta: abrir a exposição. Os demais dias não têm evento.',
      },
      {
        id: 'objetos-memorias-q26',
        bloco: 'História · Bloco 6 de 6 · Investigar e preservar',
        titulo: '26. Por que visitar o museu',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q26-a',
            pergunta: '26A — Qual é uma finalidade desse museu?',
            opcoes: [
              'Guardar tudo sem permitir que ninguém aprenda.',
              'Cuidar de fontes e ajudar a conhecer outras épocas.',
              'Trocar todos os objetos antigos por novos.',
            ],
            respostas: ['Cuidar de fontes e ajudar a conhecer outras épocas.'],
          },
          {
            id: 'objetos-memorias-q26-b',
            pergunta: '26B — Quais atitudes ajudam a cuidar dos objetos durante a visita?',
            tipo: 'selecao',
            opcoes: [
              'Ler ou ouvir as informações das fichas',
              'Mexer em um objeto frágil sem autorização',
              'Seguir as orientações da visita',
              'Levar uma peça para casa sem pedir',
            ],
            respostas: [
              'Ler ou ouvir as informações das fichas',
              'Seguir as orientações da visita',
            ],
          },
        ],
        dica: 'Pense em aprender sem danificar nem retirar as fontes.',
        sucesso: 'Cuidar dos objetos permite que outras pessoas também aprendam com eles.',
        leitura:
          'O Museu das Pequenas Histórias é um lugar inventado para nossa aventura. Ele cuida de objetos, registra informações e ajuda visitantes a conhecer outras épocas. Há objetos frágeis na exposição. Os visitantes observam e seguem as orientações de quem cuida do acervo.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q27',
        bloco: 'História · Bloco 6 de 6 · Investigar e preservar',
        titulo: '27. Preparar uma pequena exposição',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q27-a',
            pergunta: '27A — Coloque as etapas na ordem combinada.',
            tipo: 'ordenacao',
            cartoes: [
              'Organizar peças e fichas para os visitantes',
              'Escolher objetos com permissão',
              'Conversar sobre os objetos e preparar fichas',
            ],
            respostas: [
              'Escolher objetos com permissão',
              'Conversar sobre os objetos e preparar fichas',
              'Organizar peças e fichas para os visitantes',
            ],
            rotuloOrdem: 'Acontecimentos do primeiro ao último',
          },
        ],
        dica: 'Escolher vem antes de pesquisar; a apresentação vem depois.',
        sucesso:
          'Você organizou um plano que ajuda a cuidar dos objetos e compartilhar informações.',
        leitura:
          'A turma combinou um plano. Primeiro, escolher os objetos que têm permissão para expor. Depois, conversar sobre eles e preparar as fichas. Por último, organizar as peças com as fichas para receber visitantes. Cada etapa ajuda a exposição a contar histórias.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
      },
      {
        id: 'objetos-memorias-q28',
        bloco: 'História · Bloco 6 de 6 · Investigar e preservar',
        titulo: '28. A ficha do objeto',
        instrucao: 'Escolha uma resposta em cada item. Você pode trocar ou desmarcar.',
        tipo: 'opcoes',
        itens: [
          {
            id: 'objetos-memorias-q28-a',
            pergunta: '28A — Qual é o nome da peça?',
            opcoes: ['Madeira', 'Pião', 'Brincar'],
            respostas: ['Pião'],
          },
          {
            id: 'objetos-memorias-q28-b',
            pergunta: '28B — De que material ela foi feita?',
            opcoes: ['Madeira', 'Brincar', 'Pião'],
            respostas: ['Madeira'],
          },
          {
            id: 'objetos-memorias-q28-c',
            pergunta: '28C — Para que ela foi usada?',
            opcoes: ['Pião', 'Madeira', 'Brincar'],
            respostas: ['Brincar'],
          },
        ],
        dica: 'Nome responde o que é; material responde de que é feito; uso responde para que serve.',
        sucesso:
          'Uma ficha bem organizada ajuda os visitantes a compreender a história de uma peça.',
        leitura:
          'Esta peça da exposição é um pião de madeira, feito há muitos anos e usado para brincar. Uma ficha pode indicar nome, material, uso e época. Cada informação responde a uma pergunta diferente sobre o objeto.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/piao.svg',
        descricaoIlustracao:
          'Pião de madeira com ficha separada: nome, pião; material, madeira; uso, brincar; época, feito há muitos anos.',
      },
      {
        id: 'objetos-memorias-q29',
        bloco: 'História · Bloco 6 de 6 · Investigar e preservar',
        titulo: '29. Mais de uma pista',
        instrucao:
          'Observe, escolha ou ordene os cartões. Clique novamente para desfazer e use Conferir.',
        tipo: 'misto',
        itens: [
          {
            id: 'objetos-memorias-q29-a',
            pergunta: '29A — Quais fontes acrescentam informações à medalha neste relato?',
            tipo: 'selecao',
            opcoes: [
              'Uma mensagem sobre outro assunto',
              'A fotografia da corrida com legenda',
              'Uma foto de um lugar sem relação com a corrida',
              'A lembrança contada pelo familiar',
            ],
            respostas: ['A fotografia da corrida com legenda', 'A lembrança contada pelo familiar'],
          },
          {
            id: 'objetos-memorias-q29-b',
            pergunta: '29B — A medalha sem data, sozinha, informa o ano exato da corrida?',
            opcoes: [
              'Não. Precisamos consultar outras pistas.',
              'Sim. Toda medalha registra o ano em que foi recebida.',
              'Sim. Seu material informa o ano em que foi usada.',
            ],
            respostas: ['Não. Precisamos consultar outras pistas.'],
          },
        ],
        dica: 'Procure as fontes que têm relação com a corrida. Aparência não substitui uma data.',
        sucesso:
          'Comparar pistas ajuda a investigar melhor. Às vezes precisamos dizer: ainda não sabemos.',
        leitura:
          'Lia encontrou uma medalha sem data. Um familiar lembra que ela foi recebida numa corrida da escola. Há uma fotografia dessa corrida com uma legenda indicando o ano. O objeto, o relato e a fotografia podem ser comparados para investigar sua história.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ilustracaoLeitura: '../assets/historia-objetos-memorias-outubro-2026/medalha.svg',
        descricaoIlustracao:
          'Três fontes inventadas: medalha sem data, lembrança de um familiar sobre uma corrida da escola e desenho de fotografia da corrida com legenda de ano.',
      },
      {
        id: 'objetos-memorias-q30',
        bloco: 'História · Bloco 6 de 6 · Investigar e preservar',
        titulo: '30. Meu registro de historiadora',
        instrucao:
          'Ouça uma unidade por vez, escreva e confira. Você pode repetir, parar e corrigir.',
        tipo: 'campos',
        itens: [
          {
            id: 'objetos-memorias-q30-a',
            pergunta: '30A — Frase 1',
            respostas: ['Objetos guardam lembranças.'],
            pontuacaoFlexivel: true,
          },
          {
            id: 'objetos-memorias-q30-b',
            pergunta: '30B — Frase 2',
            respostas: ['Museus cuidam da história.'],
            pontuacaoFlexivel: true,
          },
        ],
        dica: 'Ouça de novo a frase que está escrevendo e confira as palavras.',
        sucesso: 'Você concluiu a investigação e registrou duas ideias da nossa aventura.',
        leitura:
          'Chegamos ao fim da visita. Você investigou lembranças, materiais, diferentes povos e mudanças nos objetos. Agora registre duas frases curtas. Escute uma de cada vez, escreva e confira. Você pode repetir, parar e corrigir.',
        leituraTitulo: 'Leia para aprender',
        fonteEstudo:
          'Roteiro pedagógico de História — texto original; personagens e situações fictícios.',
        opcoesReversiveis: true,
        icone: '../assets/objetos_escolares/book.svg',
        ditado: true,
        unidadeDitado: 'frase',
        cancelarAoTrocarCampo: true,
      },
    ],
  });
})();
