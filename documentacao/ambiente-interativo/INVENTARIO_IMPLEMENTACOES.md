# Inventário de implementações do projeto

## 1. Visão geral

O **Revisões Escolares** evoluiu para uma aplicação educacional local com perfis, matérias, revisões versionadas, progresso persistente, áudio, leitura de PDFs, cenas manipulativas e testes automáticos. A estrutura chamada **Ambiente Interativo** está em `ambiente_interativo/` e atende Alice e Mariana sem misturar os dados das duas.

Este inventário registra o estado de trabalho em **31/08/2026**.

## 2. Base da aplicação

### Navegação e perfis

- Tela inicial com seleção de Alice ou Mariana.
- Painéis de matérias e cartões próprios de cada perfil.
- Breadcrumb, voltar, próxima etapa e retorno à página inicial.
- Cabeçalho com perfil, etapa, pontos ou conquistas.
- Estados “não iniciada”, “em andamento” e “concluída”.
- Limpeza seletiva de uma revisão, sem afetar outras trilhas.
- Registro central que valida IDs, chaves, cartões e painéis duplicados.

### Execução local

- Servidor Vite por `abrir_ambiente_interativo.bat` ou `npm run interativo`.
- Aplicação principal por `file://` usando bundle clássico gerado.
- Atalho para Chromium do Playwright.
- Recursos locais, sem CDN obrigatória.
- Bundle principal e PDF.js gerados a partir dos módulos-fonte.

### Interface e acessibilidade

- Layout responsivo para computador e celular.
- Viewport de 390 × 844 sem rolagem horizontal.
- Operação por mouse, toque e teclado.
- Foco visível, rótulos acessíveis, texto alternativo e regiões `aria-live`.
- Barras de progresso acessíveis.
- Respeito a `prefers-reduced-motion`.
- Canvas em alta densidade.
- Auditoria axe-core para violações graves e críticas.

## 3. Infraestrutura compartilhada

### Registros e controladores

- `js/registro-revisoes.js`: catálogo central de revisões e chaves.
- `js/registro-ingles.js`: conteúdo compartilhado da Unidade 3.
- `js/registro-leituras.js`: livros, perguntas, ditados, glossários e metadados.
- `js/app.js` e `js/app.entry.js`: navegação, cartões e composição do bundle.
- `js/armazenamento.js`: persistência segura.
- `js/audio.js`: síntese de voz local bilíngue.
- `js/gramatica-questionarios.js` e `js/gramatica-ditado.js`: questionários sequenciais de
  Gramática e apoio auditivo por lacuna.
- `js/desenho.js`: canvas e persistência de desenho.
- `js/leitura.js`, `js/leitor-dedicado.js` e `js/glossario.js`: biblioteca e leitor.
- `js/matematica.js`, `js/matematica-cena.js` e `js/matematica-manipulaveis.js`: Matemática manipulativa.
- `js/matematica-geometria-medidas.js`: formas originais em CSS, campos com unidade, seleção,
  associação, mosaico, régua, balança, recipientes de capacidade, continhas verticais D–U e
  produtos de mercado dentro do mesmo contrato de Cena Matemática.
- `js/matematica-operacoes.js`: operações digitadas, questões com vários campos e estudo
  intermediário de tabuadas configuráveis com bloqueio persistente.

### Armazenamento seguro

- Camada compartilhada `ArmazenamentoRevisoes`.
- Chaves independentes por perfil, matéria e revisão.
- Objetos persistidos com versão e normalização.
- Tratamento de JSON corrompido, versão incompatível, etapa inválida e valores fora dos limites.
- Migrações conservadoras e idempotentes.
- Fallback em memória quando `localStorage` é bloqueado.
- Limpeza limitada à revisão ativa; não existe `localStorage.clear()`.
- Restauração de etapa, respostas, pontuação, canvas, página e cenas manipulativas.

## 4. História e Ciências

### Alice — História: Famílias e objetos: ontem e hoje

- Revisão exclusiva do 1º ano com **20 questões numeradas e 20 pontos**, baseada na síntese das
  páginas 66–90, com ênfase reforçada nas páginas 70–75. Os dois PDFs privados não foram abertos,
  renderizados, extraídos nem submetidos a OCR nesta implementação.
- Diversidade familiar, parentesco fictício, rotinas, quantidade de crianças, fotografias e
  entrevista como fontes, mudanças nas famílias, direitos e proteção; objetos, fases da vida,
  povos Karajá, Baniwa e Timbira, antigo/atual, museus e preservação.
- Todas as 20 telas têm quadro “Leia para aprender” e fonte de estudo. Histórias, entrevista,
  relações de parentesco e situações necessárias à resposta aparecem integralmente na questão.
  Q14 tem um ditado de frase; Q20 tem três frases e só pontua quando todas estiverem corretas.
- Reutiliza `QuestionariosRevisoes`, `gramatica-ditado.js`, `audio.js` e o painel compartilhado.
  A extensão opt-in `tipo: 'misto'` combina alternativa, seleção e ordenação sem duplicar
  controlador. As ações são reversíveis por clique, toque e teclado e têm normalização estrita.
- `layout.desktopAmplo` organiza leitura e respostas lado a lado no desktop e mantém uma coluna no
  celular. Dois SVGs originais e acessíveis representam famílias de épocas diferentes e objetos
  domésticos antigos/atuais; nenhuma imagem do caderno foi copiada.
- Testes: `tests/historia-alice-familias-objetos.spec.js` (13 casos), incluindo percurso completo,
  questões mistas, ditado local, isolamento, armazenamento corrompido/bloqueado, `file://`,
  390 × 844, 1366 × 768, 1920 × 1080, axe-core e console. Cadastro central: 42 revisões.

ID: `alice-historia-familias-objetos-agosto-2026`.

Chave: `revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/historia-familias-objetos.js`.

### Mariana — História: Convivência nos transportes: ontem e hoje

- Nova revisão exclusiva de História, 2º ano, com **30 questões numeradas e 30 pontos**.
- Fonte inicial: síntese fornecida das páginas 50–61. Após validação em uso real, o responsável
  autorizou uma nova conferência do PDF por OCR e inspeção visual local das 12 páginas. O PDF e os
  arquivos temporários não integram o projeto.
- Cada uma das 30 questões exibe antes da atividade um quadro “Leia para aprender”, com explicação
  adaptada autossuficiente e indicação da página ou do material complementar. A revisão pode ser
  feita sem manter o caderno aberto; Q10–Q14 têm regressão específica para as fontes que motivaram
  a correção.
- Trens/maria-fumaça e classes; bondes e convivência; ônibus, demora e superlotação;
  automóveis, cronologia e congestionamento; barcos/piroga, fontes históricas e preservação.
  Complementos moderados: classificação dos transportes, convivência, diferenças e memória.
- Seleção múltipla, alternativa única, classificação, associação, V/F, ordenação reversível,
  escrita curta e ditados. Escrita: Q11 (1908), Q17 (1886), Q24 (palavra) e Q30 (três frases).
- Ditados Q24 e Q30 reutilizam exclusivamente `gramatica-ditado.js`/`audio.js`, em pt-BR local,
  sem início automático, com aquecimento, Atenção, repetir, parar e cancelamento por subitem/tela.
- Motor existente `gramatica-questionarios.js`, também exposto como `QuestionariosRevisoes`;
  `questionarios-interacoes.js` oferece seleção múltipla e ordenação opcionais. Nenhum controlador
  duplicado. Painel e registro legados mantidos, com matéria configurável e retorno a Gramática.
- Subitens precisam estar todos corretos para ganhar um ponto. Edição invalida a conferência;
  acertos já conquistados não duplicam. Respostas, tentativas erradas, conferências, etapa e
  pontos persistem. Normalização estrita opcional, fallback em memória e limpeza somente da chave.
- Ícones locais existentes e três SVGs originais (trem, bonde e canoa), sem ilustrações do livro.
- Testes: `tests/historia-mariana-transportes.spec.js` (16 casos), incluindo gabarito independente
  para o percurso completo, isolamento, corrupção/bloqueio do armazenamento, teclado, toque,
  390 × 844, desktops, axe-core, console e `file://` sem rede. Cadastro central preservado em 42
  revisões após a inclusão da História da Alice.

ID: `mariana-historia-convivencia-transportes-agosto-2026`.

Chave atual: `revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2`. A chave
`v1` permanece intocada para preservar o progresso da primeira versão, enquanto a rodada corrigida
começa do zero.

Conteúdo: `ambiente_interativo/revisoes/mariana/historia-convivencia-transportes.js`.

### Alice — Origem dos materiais

- Revisão preservada no perfil de Alice.
- Conteúdo sobre origem e classificação de materiais.
- Atividade com canvas e persistência de desenho.
- Migração do progresso antigo sem apagar a chave original.
- Isolamento em relação às atividades de Mariana.

Chave: `revisoesEscolares.alice.ciencias.origemMateriais`.

## 5. Matemática

### Alice — Capacidade, continhas e números

- Revisão exclusiva com **32 etapas**: apresentação, **30 questões avaliativas** e encerramento.
- Questões 1 a 7: capacidade de recipientes, comparações, equivalências entre litro e mililitro e
  associação de objetos às unidades `L` e `mL`.
- Questões 8 a 12: adições com reagrupamento, apoiadas por continhas verticais D–U.
- Questões 13 a 17: subtrações com reagrupamento e decomposição visual da dezena, sem simular uma
  troca manipulativa inversa que a biblioteca compartilhada não oferece.
- Questões 18 a 22: sequências, nomes dos números e composição de 1 a 20 em dezenas e unidades.
- Questões 23 a 26: dezenas exatas até 100, leitura, ordenação e quantidade de dezenas.
- Questões 27 a 30: compras de supermercado, troco e dois mini simulados com várias respostas.
- Recipientes, produtos e continhas são ilustrações originais em HTML/CSS, sem imagens ou recursos
  obrigatórios da internet. Todos os campos continuam no contrato persistente da Cena Matemática.
- Erro bloqueia o avanço sem apagar a resposta; a criança pode corrigir, conferir novamente,
  avançar, voltar e recarregar. Clique, toque, teclado, `aria-live` e limpeza seletiva foram
  preservados, com progresso isolado de todas as revisões anteriores de Alice e Mariana.

Chave: `revisoesEscolares.alice.matematica.capacidadeOperacoesNumeros.v1`.

### Alice e Mariana — Contas do dia a dia

- Nova revisão independente de adição e subtração, disponível nos dois perfis com enunciados e
  situações diferentes para cada criança.
- Alice pratica **15 questões**; Mariana pratica **20 questões**.
- As cinco primeiras questões de cada perfil trabalham somente unidades e números de um algarismo.
- As questões seguintes avançam para dezenas e problemas com números de dois algarismos.
- Exclusivamente para Mariana, as seis questões finais trabalham equivalências entre centenas,
  dezenas e unidades e resultados imediatamente posteriores a 100, como `100 + 1`.
- Todas as respostas são digitadas no teclado. Um erro produz uma pista específica, mantém o campo
  editável e bloqueia o avanço somente até a resposta ser corrigida e conferida novamente.
- Questão atual, respostas, correções, pontuação e conclusão são restauradas ao voltar ou recarregar.
  Limpar remove somente a chave da atividade e do perfil ativos.
- O mesmo controlador compartilhado atende os dois conteúdos, sem misturar perguntas ou progresso.

Chaves:

- `revisoesEscolares.alice.matematica.contasDiaADia.v1`
- `revisoesEscolares.mariana.matematica.contasDiaADia.v1`

### Alice e Mariana — Contas e tabuada

- Nova rodada independente e idêntica nos dois perfis, com **18 questões** e progresso próprio.
- Questões 1 a 5: adição e subtração somente com unidades e números de um algarismo.
- Questões 6 a 13: problemas de adição e subtração com números de dois algarismos.
- Depois da questão 13, uma etapa de estudo mostra em tabelas completas as tabuadas do 1 e do 2,
  de `× 1` até `× 10`.
- Ao acionar “Já estudei — começar as multiplicações”, o bloqueio é salvo: voltar, sair ou
  recarregar não permite reabrir a tabela durante a mesma rodada.
- Questões 14 a 18: cinco páginas de multiplicação, cada uma com quatro resultados digitados das
  tabuadas do 1 e do 2.
- A questão só é concluída quando todos os seus campos estão corretos. Campos vazios ou errados
  permanecem editáveis, recebem indicação individual e podem ser conferidos novamente.
- Respostas de vários campos, etapa de estudo, bloqueio, questão atual, pontos e conclusão são
  persistidos; limpar remove somente a nova chave do perfil ativo e permite uma nova rodada.

Chaves:

- `revisoesEscolares.alice.matematica.contasETabuada.v1`
- `revisoesEscolares.mariana.matematica.contasETabuada.v1`

### Alice e Mariana — Mais contas e tabuada

- Segunda rodada independente e idêntica nos dois perfis, com **18 questões**, números novos e
  progresso separado da atividade anterior.
- Questões 1 a 5: adição e subtração simples somente com unidades.
- Questões 6 a 13: problemas de adição e subtração com números de dois algarismos, começando pelo
  exemplo `16 + 17`.
- Depois da questão 13, a etapa de estudo apresenta as tabuadas completas do 1, do 2 e do 3, de
  `× 1` até `× 10`, em tabelas responsivas.
- O controlador agora aceita a lista declarativa `estudoTabuada.fatores`; revisões anteriores sem
  essa lista continuam usando as tabuadas do 1 e do 2.
- Ao começar a questão 14, o bloqueio é persistido. Voltar, sair, avançar novamente ou recarregar
  não reabre as tabelas durante a rodada.
- Questões 14 a 18: cinco questionários com quatro multiplicações cada, cobrindo as tabuadas do 1,
  do 2 e do 3, inclusive `3 × 4` e `3 × 8`.
- Erros permanecem corrigíveis por campo; respostas parciais, acertos, bloqueio, questão e
  conclusão são restaurados. Limpar remove somente a chave da nova revisão ativa.

Chaves:

- `revisoesEscolares.alice.matematica.maisContasETabuada.v1`
- `revisoesEscolares.mariana.matematica.maisContasETabuada.v1`

### Mariana — Revisão ampla

- **25 etapas interativas**.
- Subtração, operações inversas, sequências e gráficos.
- Dezena e unidade; números de 10 a 19.
- Ordinais, pares e ímpares.
- Geometria, sólidos, vistas e planificações.
- Canvas, mini simulado, atividade livre, pontuação e conclusão persistentes.

#### Correção da etapa 14 — Crescente e decrescente

- Cartões posicionados são restaurados visivelmente após recarga.
- Um cartão colocado pode ser clicado para voltar à bandeja.
- Também pode ser arrastado novamente para corrigir a ordem.
- É possível errar, conferir, reorganizar e concluir sem pular a etapa.
- O fluxo de correção, avanço, retorno e recarga tem teste de regressão.

Chave: `revisoesEscolares.mariana.matematica.revisaoAmpla`.

### Biblioteca manipulativa

- Quadros U, D–U, C–D–U e M–C–D–U.
- Cubinho de 1, barra de 10, placa de 100 e cubo de 1.000.
- Ábaco para montar e ler números, com descrição por haste.
- Composição e decomposição, inclusive zero intermediário.
- Ordenação, sequências, reta numérica, dinheiro pedagógico e gráfico de barras.
- Histórico, desfazer, limpar, dica e conferir.
- Retirada por clique, arrasto ou descarte.
- Estado serializável, normalizado e persistente.
- Pointer Events para mouse, toque e caneta.
- Selecionar e colocar por botão, clique no quadro grande ou teclado.
- Ordens incompatíveis continuam bloqueadas; uma placa de 100 não entra em dezenas ou unidades.
- Supressão apenas do clique sintético após arrasto, sem perder o clique legítimo seguinte.
- Persistência de várias ações consecutivas, sem depender da identidade da mesma referência de objeto.

Trocas explícitas:

- 10 U por 1 D.
- 10 D por 1 C.
- 10 C por 1 M.
- Cada troca exige quantidade exata e preserva o valor.

### Mariana — Centenas em ação, nova rodada

- **20 etapas novas**: apresentação, 18 avaliativas e encerramento.
- Mesmo ID lógico e nova chave `v2`, preservando a rodada anterior.
- Disponível somente para Mariana.

Etapas: apresentação; reconhecer 100; trocas U→D e D→C; montar 700; montar 800 e 641 no ábaco; ler 307; quadros 582 e 905; compor 734; decompor 420; ordem crescente; saltos de +25 e −50; reta em 675; formar 840; troca C→M; gráfico; encerramento.

Chave: `revisoesEscolares.mariana.matematica.centenasEmAcao.v2`.

### Mariana — Formas, mosaicos e medidas

- Revisão exclusiva com 32 etapas: apresentação, 30 questões e encerramento.
- Progressão: formas planas e não planas, lados e vértices, relações com objetos e mosaico de três
  cores; comprimento em mm, cm e m; massa em g e kg; capacidade em mL e L; conversões e operações.
- Contagem auxiliada por figuras selecionáveis, associações por listas, mosaico editável com metade
  pronta, réguas originais, balança e campos numéricos com a unidade fora da digitação.
- Erro corrigível, avanço bloqueado até o acerto, desfazer/limpar no mosaico, teclado, toque,
  persistência visual e lógica e pontuação máxima de 30 conquistas.

Chave: `revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1`.

## 6. Gramática

### Alice — Contos, dígrafos e vocabulário

- Revisão exclusiva da Alice com **30 questões** no controlador `gramatica-questionarios`,
  sem alterar controladores, áudio ou CSS compartilhados.
- ID: `alice-gramatica-contos-digrafos-vocabulario`. Conteúdo em
  `revisoes/alice/gramatica-contos-digrafos-vocabulario.js` e cartão próprio ao lado de H/til.
- Q1–Q4 reaproveitam integralmente os quatro contos originais da revisão da Mariana.
  Q5–Q18 praticam CH/LH/NH, famílias, recuperação da grafia, sílabas e transformação com H;
  Q19–Q24 trabalham sinônimos e antônimos; Q25 ordena uma frase; Q26–Q27 reforçam S com som de Z
  e RR; Q28 usa banco fechado; Q29 dita uma frase integradora; Q30 reúne oito itens de revisão.
- Q5 oculta os dígrafos em seis palavras; Q15 combina oito pistas com palavras incompletas;
  os três itens de CH/LH/NH da Q30 também usam lacunas, sem expor as palavras completas.
- **Cinco ditados:** Q8 (CH), Q11 (NH), Q14 (LH), Q18 (mistura) e Q29 (frase).
  Reutilizam `gramatica-ditado.js` e `audio.js`, com voz local pt-BR, ação explícita,
  aquecimento, Atenção, repetir, parar e cancelamento. Sem revelar ou preencher respostas.
- Q17 exige o til de “chão”; Q25 exige maiúscula na alternativa; Q29 exige grafia, maiúscula
  inicial e ponto-final em “A galinha achou o milho.”. Sinônimos e antônimos usam alternativas.
- Desktop Amplo ativado somente por `layout: { desktopAmplo: true }`, com suporte a
  1366 × 768, 1920 × 1080, celular 390 × 844 e bundle `file://`.
- Respostas, correções, etapa, pontos e conclusão ficam isolados na chave nova. Limpar não
  afeta H/til da Alice nem as revisões da Mariana. Nenhuma migração de progresso.
- Conteúdo baseado somente na síntese Markdown e nas revisões existentes; nenhum PDF/print
  escolar foi aberto, convertido, renderizado ou incluído.

Chave: `revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1`.

Validação em 30/08/2026: build, formatação e lint aprovados; **13/13** testes em
`tests/gramatica-alice-contos-digrafos-vocabulario.spec.js` (1,4 min) e **1/1** teste central
de cadastro, com 40 IDs/chaves distintos. Cobertura de conclusão, correção, persistência,
limpeza seletiva, ditados, teclado/toque, layouts, axe, console e `file://`.
Capturas da aplicação conferidas; voz local simulada, sem audição humana. `npm test` dispensado
nesta inclusão declarativa, sem alteração de comportamento compartilhado ou regressão;
a suíte global permanece obrigatória na CI do futuro PR. Detalhes no relatório de testes.

Alice concluiu integralmente a revisão em uso real, inclusive após a correção pedagógica
de Q5, Q15 e Q30, com funcionamento correto confirmado pelo responsável.

### Mariana — Contos, ortografia e pontuação

- Nova revisão independente com **30 questões**, baseada na síntese pedagógica da prova de 31/08.
- Questões 1–4: contos, conto de fadas, começo/problema/desfecho e suspense infantil; 5–10: NH e CH;
  11–14: antônimos e sinônimos; 15–23: frase declarativa, ponto-final, interrogação, exclamação,
  travessão e dois-pontos; 24–28: S/SS, separação silábica e S com som de Z; 29–30: pontuação integrada.
- Conteúdo original e declarativo em `revisoes/mariana/gramatica-contos-ortografia-pontuacao.js`,
  reutilizando `js/gramatica-questionarios.js`. Não substitui as revisões de 40 e 25 questões.
- Sete ditados opcionais: Q7, Q10 e Q28 com palavras; Q17, Q21, Q23 e Q30 com frases curtas.
  `js/gramatica-ditado.js` aceita `unidadeDitado: 'frase'`, mantendo palavras como padrão legado.
  Usa exclusivamente `js/audio.js`, voz local pt-BR a 0,78, aquecimento, Atenção, repetir, parar e
  cancelamento. Nenhuma resposta é exposta nos controles ou preenchida pelo áudio.
- Campos podem declarar `maiusculasObrigatorias`, junto de `acentuacaoObrigatoria` e
  `fraseCompleta`. Enter confere no controlador compartilhado. `inserirTravessao` oferece um botão
  para inserir apenas esse sinal no cursor, com edição e exclusão normais por teclado ou toque.
- Erros continuam editáveis, com nomes dos itens a rever no retorno acessível e `aria-invalid`
  nos campos. Pontos são concedidos uma única vez. Progresso e limpeza usam somente a chave nova.
- Primeira revisão de Gramática com `layout: { desktopAmplo: true }`: 94vw, teto de 2360px e
  breakpoint de 1120px. `leitura` cria um painel de texto ao lado das respostas; questões sem texto
  não reservam coluna vazia. Campos podem ocupar duas colunas e frases usam a largura disponível.
  Em 390 × 844 tudo volta a uma coluna. Abrir H/til ou a revisão ampla remove a classe opt-in.
- O resumo global deriva o total do conteúdo ativo; as revisões antigas mantêm seus totais.
- Nenhum PDF ou print de referência foi aberto, convertido, submetido a OCR ou renderizado para
  esta implementação. Sem recursos obrigatórios da internet e com suporte ao bundle `file://`.

Chave: `revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1`.

Validação em 30/08/2026: build, formatação e lint aprovados; 30/30 testes direcionados de
Gramática, 1/1 de cadastro e suíte global `npm test` com 160/160 aprovados em 10,1 minutos.
Capturas da aplicação conferidas nos dois desktops e no celular. Áudio validado com vozes locais
simuladas, sem audição humana; detalhes em `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`.

Mariana concluiu a revisão completa em uso real, com funcionamento correto confirmado pelo responsável.
A execução local de 160 testes incluía seis testes de outra implementação não incluída neste PR;
a suíte versionada desta entrega contém 154 testes.

### Mariana — revisão ampla de Gramática

- Nova revisão independente e disponível somente para Mariana.
- **40 questões** com correção imediata, tentativa recuperável e avanço bloqueado até a correção.
- Conteúdo baseado no caderno de agosto de 2026: M e N no final das palavras; frases declarativas
  e interrogativas; ponto-final e ponto de interrogação; `za`, `ze`, `zi`, `zo`, `zu`; contagem de
  sílabas; ponto de exclamação em emoções fortes; transformação digitada de frases declarativas em
  exclamativas; e uso introdutório de `s` e `ss`.
- Campos de texto e alternativas reutilizam os componentes visuais da revisão ampla, com mensagens
  específicas em região `aria-live` e operação por teclado, mouse ou toque.
- Respostas, questão atual, correções, pontuação e conclusão são restauradas depois de voltar ou
  recarregar; limpar remove somente a chave desta revisão.
- O PDF escolar permaneceu privado e não foi copiado para a aplicação.
- As questões 5, 7 e 22 oferecem ditado opcional de cada resposta em `pt-BR`, com “Atenção”,
  repetição e parada, sem mostrar nem preencher automaticamente a palavra.

Chave: `revisoesEscolares.mariana.gramatica.revisaoAmpla.v1`.

### Alice e Mariana — H, til e vocabulário

- Revisão compartilhada com **25 questões idênticas** para os dois perfis e progresso individual.
- Conteúdo adaptado ao caderno: H inicial silencioso; dígrafos `ch`, `lh` e `nh`; H em
  `super-homem`, `anti-higiênico`, `ah!` e `oh!`; til e nasalização; combinações com `ã` e `õ`;
  plural; distinção entre `lã` e `lá`; circunflexo em `bebê`, `você`, `avô` e `robô`; sinônimos e
  antônimos.
- Questões específicas de teclado exigem o til ou o circunflexo; respostas sem o sinal continuam
  corrigíveis e não liberam o avanço.
- O mesmo conjunto de questões é cadastrado uma única vez, mas questão atual, respostas,
  correções, pontos, conclusão e limpeza permanecem isolados por perfil.
- O painel visual de Gramática é reutilizado sem remover a revisão anterior da Mariana, e o PDF
  escolar permanece privado fora da aplicação.
- Na questão 17, Alice e Mariana podem ouvir separadamente `irmã`, `avião`, `balões` e `manhã` e
  continuam responsáveis por digitar o til corretamente.

Chaves:

- `revisoesEscolares.alice.gramatica.hTilVocabulario.v1`
- `revisoesEscolares.mariana.gramatica.hTilVocabulario.v1`

## 7. Inglês — conteúdo, áudio e pronúncia

### Unit 3 — At School

- Disponível para Alice e Mariana com progresso independente.
- **27 palavras e frases** agrupadas em objetos, pessoas, lugares e comandos escolares.
- Instrução em português e pronúncia em inglês para cada item.
- Clicar ou acionar pelo teclado um item já inicia sua pronúncia; nenhum áudio começa apenas ao
  abrir a revisão ou trocar de grupo.
- Depois dos 27 áudios, são liberadas 10 atividades.
- Atividades sobre vocabulário, contagem, tradução, materiais, respeito e `should`/`shouldn't`.
- Alternativas A–D pseudoaleatórias, estáveis e equilibradas por perfil.
- Correção conjunta apenas após a décima resposta.
- Resultado com acertos, erros, alternativa correta e explicação.
- Recompensa final com imagem local da Mita e mensagem própria para cada perfil.
- Ícone de borracha substituído por SVG original.

Chaves:

- `revisoesEscolares.alice.ingles.atSchoolUnidade3.v1`
- `revisoesEscolares.mariana.ingles.atSchoolUnidade3.v1`

### Mariana — Unit 5: City Life

- A revisão existente evoluiu para a versão 2, preservando o mesmo ID, cartão e unidade somente no
  perfil da Mariana. A chave v1 não é lida, migrada ou removida.
- **73 palavras e expressões** com pronúncia local e prática de escrita: os 44 itens anteriores foram
  preservados e receberam exatamente 29 acréscimos.
- Sete grupos em ordem: lugares da cidade; posições; materiais e propriedades; prédios e formas;
  viagens e férias; Dia do Soldado; escola e dias especiais.
- Cada cartão continua iniciando a pronúncia normal por clique, toque, `Enter` ou `Espaço`. Um único
  campo abaixo do item selecionado permite copiar, conferir, corrigir e retomar a escrita.
- Áudio e escrita têm selos e contadores separados. As **30 atividades** são liberadas somente
  depois dos 73 áudios e das 73 escritas conferidas corretamente.
- As atividades intercalam os 16 eixos pedagógicos anteriores com 14 questões novas sobre viagem,
  férias, passaporte, `I went to`, perguntas de viagem, Dia do Soldado, escola, preferências e
  lugares da cidade. Todas usam instrução bilíngue e correção imediata recuperável.
- Correção imediata por questão: um erro mostra uma pista específica, mantém as alternativas
  ativas e bloqueia o avanço somente até a resposta ser corrigida e conferida novamente.
- Voltar e recarregar restauram áudio, texto parcial, conferência de escrita, resposta, conferência de
  atividade, questão atual e pontuação sem duplicação.
- É o piloto da capacidade declarativa `layout.desktopAmplo`: em monitores com pelo menos 1120 px,
  ocupa 94% da viewport e distribui áudio, grupos, resumo/escrita, cartões, atividades e resultado em
  áreas proporcionais. Em larguras menores, conserva o fluxo responsivo existente.
- Unit 3 e At the Farm não ativam escrita e preservam suas chaves e seus comportamentos anteriores.
- Dez SVGs locais da biblioteca Fluent Emoji Flat foram incluídos para os conceitos novos; nenhum
  PDF, imagem escolar ou recurso da internet foi incorporado.

Chave ativa: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v2`.

Chave histórica preservada: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v1`.

### Alice — Unit 5: At the Farm

- Nova revisão independente, disponível somente no perfil da Alice.
- **41 palavras e expressões com pronúncia local** antes das atividades.
- Quatro grupos: animais da fazenda; famílias e grupos; cuidados e alimentos; lugares e sons.
- **16 atividades** baseadas no caderno de agosto de 2026, sem publicar o PDF, suas imagens ou
  anotações pessoais.
- Conteúdo sobre nomes de animais, filhotes, aves e mamíferos, contagem, alimentação de cavalos,
  necessidades básicas, habitats, cuidado e sons dos animais.
- Correção imediata por questão, com pista específica, nova tentativa obrigatória antes do avanço
  e restauração da resposta, conferência, questão e progresso após voltar ou recarregar.
- O cartão fica visível somente para Alice; Unit 3 e City Life preservam suas próprias chaves.
- Foram acrescentados 29 SVGs locais da biblioteca Fluent Emoji Flat já licenciada no projeto.

Chave: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1`.

### Melhorias aglutinadas de pronúncia

As melhorias foram concentradas em `js/audio.js` e consumidas por `js/ingles.js`, evitando que cada revisão implemente sua própria voz.

#### Pronúncia direta pelo cartão

- Clicar, tocar ou acionar por teclado um cartão de palavra seleciona o item e inicia sua pronúncia
  em inglês na velocidade normal de 0,62.
- O padrão é compartilhado pela Unit 3 e City Life e passa a valer automaticamente para novas
  revisões de Inglês de Alice e Mariana.
- Os botões “Ouvir em inglês”, “Ouvir devagar”, “Repetir” e “Parar” permanecem disponíveis.
- Abrir uma revisão ou apenas trocar o grupo de vocabulário não dispara áudio.

#### Prática optativa de escrita

- `js/ingles.js` oferece um módulo de escrita ativado por `praticaEscrita`, sem implementação própria
  dentro de cada conteúdo e sem alterar unidades que não optaram pelo recurso.
- O estado compartilhado usa `respostasEscrita` e `conferenciasEscrita`, aceita variações explícitas
  por item, normaliza caixa e espaços e invalida o acerto quando o texto é editado.
- A interface usa campo único com rótulo real, envio por `Enter`, navegação natural por `Tab`,
  mensagens bilíngues em `aria-live`, selos textuais e contadores derivados do conteúdo.
- Quando a escrita é obrigatória, o portão das atividades combina os áudios concluídos com todas as
  escritas corretas. O resumo do cabeçalho também apresenta os dois progressos.

#### Layout desktop amplo opt-in

- `js/ingles.js` aplica a classe genérica `.layout-desktop-amplo` somente quando a unidade declara
  `layout: { desktopAmplo: true }` e a remove automaticamente ao abrir outra unidade.
- `css/estilo.css` mantém todas as regras sob a classe e o breakpoint de 1120 px. O contêiner chega
  a 94% da viewport, com teto de 2360 px, sem transformar a tela em uma única coluna esticada.
- O áudio separa título/controles de vozes/status; o vocabulário separa resumo e escrita da grade de
  cartões; questões só ganham área visual quando possuem imagem; alternativas e resultado usam duas
  colunas quando há espaço.
- City Life v2 é a única revisão optante. Unit 3 de Alice e Mariana e At the Farm continuam no layout
  legado, inclusive depois de serem abertas na mesma sessão do piloto.

#### Seleção inteligente da voz

- Usa `window.speechSynthesis` e somente vozes locais (`localService !== false`).
- Normaliza Inglês para `en-US` e Português para `pt-BR`.
- Prefere correspondência exata do idioma; aceita a mesma família linguística quando necessário.
- Atribui preferência extra a vozes locais com indicação `natural` ou `neural` e a vozes conhecidas do sistema.
- Reavalia a lista no evento `voiceschanged`, pois alguns navegadores carregam vozes depois da página.
- Exibe orientação clara se não houver voz inglesa ou portuguesa local instalada.

#### Proteção contra corte da primeira palavra

Foi corrigido o problema do Chromium/Windows que pode cortar o início da primeira fala depois de um período ocioso:

1. espera inicial de **1.000 ms**;
2. fala de aquecimento “Ready.” ou “Preparando.” no mesmo idioma e voz, com volume de **1%**;
3. pausa de **250 ms**;
4. aviso audível completo “Listen.” ou “Atenção.”;
5. pausa de **600 ms**;
6. pronúncia do conteúdo em uma fala separada.

O eventual corte fica no aquecimento quase inaudível, não em “Listen” nem na primeira palavra estudada.

#### Velocidades pedagógicas

- “Ouvir em inglês”: velocidade **0,62**, lenta o bastante para compreensão e ainda natural.
- “Ouvir devagar”: velocidade **0,50**, limite mais lento aceito pelo módulo.
- A opção devagar mantém a palavra ou frase contínua; não soletra e não separa sílabas artificialmente.
- O `pitch` permanece neutro em 1 para evitar distorção da pronúncia.

#### Controles e continuidade

- “Ouvir instrução”: voz local `pt-BR`.
- “Ouvir em inglês”: voz local `en-US`.
- “Ouvir devagar”: repete o mesmo inglês em velocidade menor.
- “Repetir”: reproduz exatamente a última solicitação, inclusive idioma e velocidade.
- “Parar”: cancela a fila, o temporizador e a fala atual imediatamente.
- Uma nova solicitação invalida a sequência anterior, impedindo falas sobrepostas ou atrasadas.
- `resume()` é acionado antes das falas para recuperar sintetizadores pausados pelo navegador.

#### Retorno acessível e privacidade

- O módulo emite estados `aguardando`, `aviso`, `pausa`, `reproduzindo`, `concluido`, `parado` e `erro`.
- As mensagens chegam à interface por evento compartilhado e região `aria-live`.
- A interface informa que o áudio começará, qual voz está reproduzindo e quando é possível repetir.
- Botões funcionam por teclado e em viewport móvel.
- Não há microfone, gravação, reconhecimento de fala, avaliação automática de pronúncia, upload, API ou CDN.

#### Cobertura e reaproveitamento

- A mesma infraestrutura bilíngue atende Alice e Mariana.
- O padrão de espera e aviso também foi reaproveitado nos ditados de Leitura, protegendo a primeira palavra avaliada.
- Os ditados de Gramática reutilizam o mesmo módulo com voz `pt-BR`, velocidade 0,78 e mensagens
  próprias para palavra ditada.
- Testes verificam presença das vozes `pt-BR`/`en-US`, controles, progresso dos 27 itens, atividades, isolamento por perfil, recompensa e acessibilidade móvel.

## 8. Leitura

### Biblioteca compartilhada

| Livro                              | Páginas |
| ---------------------------------- | ------: |
| Primeiras Lições sobre Dinheiro    |      25 |
| Quem é o rei dos animais?          |      32 |
| A Galinha dos Ovos de Ouro         |      35 |
| A Raposa e as Uvas                 |      21 |
| O dia que o Sol tirou férias       |      30 |
| A formiga que queria cantar        |      36 |
| Um castelo bem assombrado          |      25 |
| A Bela Desadormecida               |      30 |
| A Joaninha que Perdeu as Pintinhas |      21 |
| Uma Formiga Especial               |      31 |

### Recursos

- Mesmo catálogo e dados totalmente separados por perfil e livro.
- Cartões com capa, autoria, páginas, resumo e situação.
- PDF.js local, renderização em canvas e leitor dedicado amplo.
- Sincronização e persistência de página.
- Cancelamento de renderizações antigas em trocas rápidas.
- Glossário apenas da página atual.
- Questionários com quatro alternativas em ordem estável.
- Ditados com voz local, “Atenção” completo e proteção contra corte.
- Correções, explicações e resultado persistente.
- Explicações de cobiça e eclipse sem alterar pontos ou respostas.
- Conteúdo de inclusão em “Uma Formiga Especial”.
- Limpeza somente do livro ativo e fallback em memória.

### Privacidade dos PDFs

- PDFs escolares reais ficam no computador e são ignorados pelo Git.
- Capas e recursos publicáveis são versionados.
- Na CI, `scripts/gerar_pdfs_teste_ci.js` cria PDFs vazios válidos com a quantidade exata de páginas apenas quando estão ausentes.
- O gerador nunca sobrescreve livros reais locais.

## 9. Prevenções de regressão incorporadas

- Atividades de ordenar não prendem cartões após o primeiro erro.
- Bandejas e posições são reconstruídas do estado salvo.
- Todo item colocado tem caminho reversível.
- Soltar por arrasto não bloqueia o próximo clique legítimo.
- A área grande das colunas aceita clique após seleção da peça.
- Compatibilidade entre peça e ordem continua obrigatória.
- Várias alterações consecutivas são salvas.
- Voltar, avançar e recarregar preservam a representação.
- Reabrir não duplica listeners.
- Limpar uma revisão não apaga outra matéria, perfil ou rodada.
- Áudio antigo é cancelado antes de uma nova pronúncia.
- O início audível da pronúncia é protegido por aquecimento e pausas.
- Lacunas ambíguas de Gramática oferecem ditado opcional sem expor a resposta escrita no controle.
- A tabela de estudo da tabuada deixa de ser acessível de modo persistente quando começam as
  questões avaliativas, sem impedir voltar às questões anteriores.

Teste obrigatório: `errar → conferir → corrigir → conferir → avançar → voltar → recarregar`.

## 10. Testes e qualidade

Ferramentas: Playwright, axe-core, ESLint, Prettier e Vite.

### Cadência de validação

- Toda mudança de código passa por build, formatação e lint.
- Cada nova revisão recebe regressões e testes direcionados de fluxo pedagógico, persistência,
  isolamento, teclado, ponteiro, celular, acessibilidade e console conforme o risco.
- A suíte global roda localmente a cada três revisões ou conjuntos independentes de atividades e é
  antecipada por qualquer mudança comportamental em infraestrutura compartilhada.
- Perguntas ou etapas da mesma revisão contam como um único conjunto para essa cadência.
- Inclusões declarativas com apenas import, cartão ou cadastro central podem usar validação local
  direcionada quando não mudarem o comportamento compartilhado.
- Toda pull request para `main` continua executando a suíte global no GitHub Actions; a saída
  completa é consultada apenas quando houver falha ou necessidade de diagnóstico.

Na data deste inventário existem **154 testes Playwright**:

- `tests/ambiente-interativo.spec.js`: fluxos centrais, revisões de Inglês de Alice e Mariana, Leitura, Matemática ampla, armazenamento, canvas e `file://`.
- `tests/matematica-manipulativa.spec.js`: cenas, trocas, ábacos, clique no quadro, teclado, persistência e nova Centenas em ação.
- `tests/acessibilidade.spec.js`: axe e responsividade das telas principais.
- `tests/gramatica-mariana.spec.js`: 40 questões, erro e correção, digitação, teclado, persistência,
  isolamento, limpeza seletiva, conclusão, ditado nas questões 5/7/22, celular, axe e `file://`.
- `tests/gramatica-contos-ortografia-pontuacao.spec.js`: 12 testes novos para cadastro exclusivo,
  sequência de 30 questões, maiúsculas/acentos/grafia/pontuação, travessão editável, ditados locais
  sem vazamento de respostas, repetir/parar/cancelar, várias edições persistidas, limpeza isolada,
  desktop 1366 × 768 e 1920 × 1080, celular com toque, axe, console, armazenamento indisponível
  ou corrompido, isolamento visual e execução sem rede em `file://`.
- `tests/gramatica-h-til-vocabulario.spec.js`: conteúdo idêntico com chaves distintas, erro e
  correção, teclado, exigência de sinais gráficos, retorno, recarga, isolamento, limpeza seletiva,
  conclusão, ditado compartilhado da questão 17, celular, axe e `file://`.
- `tests/matematica-operacoes.spec.js`: sequências próprias de 15 e 20 questões, progressão de
  unidades para dezenas, centenas exclusivas da Mariana, digitação, correção recuperável,
  persistência, isolamento, limpeza seletiva, celular, axe e `file://`.
- `tests/matematica-contas-tabuada.spec.js`: 18 questões iguais com chaves próprias, tabela completa,
  bloqueio persistente depois do início das multiplicações, quatro campos por questão, erro e
  correção, retorno, recarga, isolamento, limpeza seletiva, celular, axe e `file://`.
- `tests/matematica-mais-contas-tabuada.spec.js`: nova rodada com números próprios, tabuadas
  configuráveis do 1 ao 3, bloqueio persistente, multiplicações por 3, correção, retorno, recarga,
  isolamento da rodada anterior, limpeza seletiva, celular, axe e `file://`.

A cobertura inclui isolamento, erro e correção antes do avanço em City Life e At the Farm,
recarga, Pointer Events, teclado, dados corrompidos, `localStorage` bloqueado, áudio bilíngue,
leitor, ditados, canvas, console, arquivo local e viewport móvel.

City Life v2 acrescenta regressão estrutural para 73 itens e 30 atividades, escrita com erro e nova
tentativa, caixa alta e espaços, edição após acerto, recarga parcial e correta, portão áudio/escrita
nas quatro combinações, chave v1 preservada, limpeza seletiva, fluxo completo das 30 atividades,
teclado, viewport 390 × 844, axe-core e ausência de rolagem horizontal. A capacidade desktop amplo
também é verificada em 1366 × 768 e 1920 × 1080, incluindo distribuição em áreas, áudio após troca
de grupos, questões sem coluna vazia, resultado em duas colunas e remoção da classe nas unidades
legadas.

## 11. GitHub e automações

- GitHub CLI instalado e autenticado.
- Repositório público: <https://github.com/guiufpb/revisoes-escolares>.
- Workflow `.github/workflows/validacao.yml` para `main`, pull requests e execução manual.
- Node.js 24, `npm ci`, Chromium, formatação, lint, PDFs de teste, build e suíte completa.
- Artefatos de diagnóstico por 14 dias em falhas.
- Dependabot semanal para npm e GitHub Actions.
- Formulário “Erro em uma atividade” com orientação de privacidade.
- `main` protegida por check obrigatório, atualização da branch, bloqueio de force-push e exclusão.
- Pull request #1 em rascunho e com check aprovado nesta consolidação.

## 12. Ferramentas auxiliares

- Geração de PDF A4 a partir de cartilhas HTML.
- Geração de previews PNG.
- Validação de HTML, páginas, recursos e PDF.
- Relatório em texto e opção JSON.
- Biblioteca local de ícones e créditos.
- Atalhos Windows independentes do diretório inicial e do perfil pessoal do navegador.

## 13. Mapa principal

| Caminho                          | Responsabilidade                         |
| -------------------------------- | ---------------------------------------- |
| `ambiente_interativo/index.html` | Estrutura das telas e cartões            |
| `ambiente_interativo/css/`       | Estilo e leitor dedicado                 |
| `ambiente_interativo/js/`        | Controladores e registros compartilhados |
| `ambiente_interativo/revisoes/`  | Conteúdo por perfil                      |
| `ambiente_interativo/leituras/`  | Capas e recursos publicáveis dos livros  |
| `tests/`                         | Testes funcionais e de acessibilidade    |
| `scripts/`                       | PDF, previews, validação e apoio à CI    |
| `.github/`                       | Actions, Dependabot e formulário de erro |

## 14. Histórico técnico consolidado

- `105fba3` — ampliação do ambiente e automação das validações.
- `564a6c7` — PDFs vazios nos testes remotos.
- `048b84c` — integridade local dos PDFs separada da CI.
- `cb79555` — renovação completa de Centenas em ação.

O histórico detalhado permanece em `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`; este arquivo é a referência organizada e atual.
