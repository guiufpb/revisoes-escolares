# Inventário de implementações do projeto

## 1. Visão geral

O **Revisões Escolares** evoluiu para uma aplicação educacional local com perfis, matérias, revisões versionadas, progresso persistente, áudio, leitura de PDFs, cenas manipulativas e testes automáticos. A estrutura chamada **Ambiente Interativo** está em `ambiente_interativo/` e atende Alice e Mariana sem misturar os dados das duas.

Este inventário registra o estado de trabalho em **06/10/2026**.

Consolidação local das quatro revisões validadas em uso real: Alice História, Alice Play Time,
Mariana História e Alice At the Farm v2. Catálogo com 59 registros; build, formatação, lint e
diff aprovados. Testes direcionados: **62/62 (4.8m)**; regressões compartilhadas:
**112/112 (8.8m)**; suíte global: **392/392 (28.6m)**. As fontes e o stash original de Farm
permanecem preservados, sem reconstrução de progresso local. Os relatórios pedagógicos
distinguem este resultado dos testes históricos e das validações específicas de voz/Azure.


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

- Servidor Vite por `abrir_ambiente_interativo.bat` ou `npm run interativo`. O launcher prepara o
  gateway opcional de pronúncia via Azure CLI, reutiliza `/health` saudável e mantém o ambiente
  principal disponível em caso de falha da CLI, da chave ou do gateway.
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
- `js/audio.js`: síntese de voz local bilíngue; cada solicitação usa um único utterance audível
  protegido por prefixo no mesmo payload, inclusive na repetição.
- `js/pronuncia.js`: controlador opt-in de conversa oral, com consentimento, captura PCM em memória,
  WAV de 16 kHz, gateway local, feedback infantil configurável, descarte e falha não bloqueante.
- `js/ingles.js`: motor único de Inglês, incluindo o **Modo Responsável** opt-in com sessões por
  chave, salto administrativo sem fabricar progresso e painel acessível por `Ctrl + Alt + R`.
- `js/gramatica-questionarios.js` e `js/gramatica-ditado.js`: questionários sequenciais de
  Gramática e outras matérias, mapa visual opt-in, Modo Responsável opt-in, imagem por subitem,
  apoio auditivo por lacuna, botão declarativo de
  travessão também em campos sem ditado e feedback opt-in por categoria de erro textual.
- `js/desenho.js`: canvas e persistência de desenho.
- `js/leitura.js`, `js/leitor-dedicado.js` e `js/glossario.js`: biblioteca e leitor.
- `js/matematica.js`, `js/matematica-cena.js` e `js/matematica-manipulaveis.js`: Matemática manipulativa.
- `js/matematica-geometria-medidas.js`: formas originais em CSS, campos com unidade, seleção,
  associação, mosaico, régua, balança, recipientes de capacidade, continhas verticais D–U,
  produtos de mercado e apoios determinísticos de base dez, sequências, vizinhos, ábaco D–U,
  dinheiro, decomposição e reagrupamento dentro do mesmo contrato de Cena Matemática.
- `js/matematica-operacoes.js`: operações digitadas, questões com vários campos e rótulos
  configuráveis, apoio visual opt-in e estudo intermediário de tabuadas configuráveis com
  bloqueio persistente.

### Armazenamento seguro

- Camada compartilhada `ArmazenamentoRevisoes`.
- Chaves independentes por perfil, matéria e revisão.
- Objetos persistidos com versão e normalização.
- Tratamento de JSON corrompido, versão incompatível, etapa inválida e valores fora dos limites.
- Migrações conservadoras e idempotentes.
- Fallback em memória quando `localStorage` é bloqueado.
- Limpeza limitada à revisão ativa; não existe `localStorage.clear()`.
- Restauração de etapa, respostas, pontuação, canvas, página e cenas manipulativas.

## 4. História, Geografia e Ciências

### Mariana — História: Uma viagem pelas histórias e memórias (outubro de 2026)

- Revisão nova, exclusiva de Mariana, 2º ano, para a prova de **06/10/2026**; mantém a atividade
  de agosto e todas as suas chaves. São **30 questões numeradas e 30 pontos**: cada questão exige
  todos os seus subitens corretos.
- Seis apoios completos nas aberturas dos blocos: transportes coletivos; terra/água e cuidado; objetos e
  registros; diários/cartas; fotografias; cruzamento de fontes. Contextos, modelos e personagens
  fictícios permanecem na própria atividade. As demais telas usam pistas específicas; Voltar permite
  reler a abertura sem perder os acertos. Pausas, conversa e autoavaliação são opcionais,
  fora da pontuação e sem coleta nova de dados pessoais.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js`,
  `audio.js` e `armazenamento.js`. Alternativas, associações, campos com banco, V/F, seleções,
  ordenações e subitens mistos; nenhuma extensão de controlador ou CSS.
- Desktop amplo, validação estrita de estado, registro de tentativas e Modo Responsável são
  opt-in. Sessões Mariana/Responsável independentes, salto sem pontos e cartão ligado à principal.
  Q26 e Q30 ocupam a largura disponível, sem coluna de leitura vazia; frases de ditado usam campos amplos.
- Q30 contém três frases independentes em um único ponto. Voz local pt-BR a 0,78, prefixo de
  frase protegido, ouvir/repetir/parar e cancelamento ao trocar campo. Não há controle separado
  de velocidade no ditado vigente. Campos toleram caixa, acentos, espaços e pontuação; Q07
  também aceita três/quatro por extenso. Nenhuma resposta de ditado aparece antes da conferência.
- Cenas SVG originais locais em `assets/historia-memorias-outubro/`, com textos alternativos:
  cinco ações em ônibus; três/quatro rodas verificáveis; cinco objetos da sala; seis crianças e
  uma professora; cenas distintas de casamento/praça e grupos diferentes em 1920/2026.
- Integração declarativa: import, registro, cartão HTML e abertura/visibilidade em `app.js`.
- Testes: `tests/historia-mariana-memorias-outubro-2026.spec.js` (20 casos), com gabarito
  independente, subitens incompletos/errados, reversão, recarga, isolamento, sessões, áudio,
  armazenamento adverso, teclado/toque, três viewports, axe-core, console e `file://` sem rede.
- Validação automatizada em **05/10/2026**: `npm run build`, `npm run format:check` e
  `npm run lint` aprovados; **69 regressões direcionadas aprovadas** (História de outubro e
  agosto de Mariana, História de Alice e Gramática de outubro de Mariana); suíte global
  `npm test` com **350 testes aprovados**.
- Uso real validado em outubro de 2026. Clareza, fluxo e execução foram confirmados pelo
  responsável; não há confirmação separada da acústica da voz instalada.

ID: `mariana-historia-transportes-memorias-outubro-2026`.

Chave principal: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/historia-transportes-memorias-outubro-2026.js`.

Abrir `ambiente_interativo/index.html`, escolher **Mariana** e o cartão **Uma viagem pelas
histórias e memórias**. `Ctrl + Alt + R` abre o painel apenas fora dos campos editáveis.


### Alice — História: Objetos e histórias — Uma investigação da Alice (outubro de 2026)

- Revisão exclusiva do **1º ano com ampliação gradual**, com **30 questões, 65 subitens,
  30 etapas avaliativas e 30 pontos**, em seis blocos de cinco questões. Preserva a revisão
  de famílias/objetos e seu progresso. Apoios e conversa opcional não criam pontos ou etapas.
- Todas as telas têm “Leia para aprender”, tarefa, dica e consolidação. Memórias e usos,
  fases da vida, diferentes povos no presente, materiais, antigo/atual com contexto,
  mudanças/permanências, papel/digital, fontes, agenda, museu e exposição.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js`,
  `audio.js` e `armazenamento.js`, sem extensão de controlador ou CSS. Integração declarativa
  por import, registro, cartão exclusivo e listener com proteção do perfil Alice.
- Desktop amplo, validação estrita de estado, tentativas e Modo Responsável são opt-in.
  Sessões Alice/Responsável independentes; salto puro, status principal e limpeza da chave ativa.
- Ditados Q05 (duas palavras), Q15 (uma frase) e Q30 (duas frases), em pt-BR local, rate 0,78,
  pitch 1, prefixo protegido no mesmo utterance, repetir/parar e cancelamento por campo/tela.
  Escrita tolera caixa, acentos, espaços e pontuação sem aceitar sequência livre de palavras.
  Não há alvo anunciado antes da conferência ou preenchimento automático. Sem voz, o responsável
  pode ler o gabarito editorial; os campos continuam operáveis.
- **13 SVGs originais locais**, com descrições equivalentes, usados em 17 telas. Incluem
  duas crianças/uma bola, galeria didática, comparação contextual de televisores, anúncio
  fictício de fogão, agenda de sete dias e pião com ficha. Os anexos privados de História
  não foram reabertos nem copiados para os ativos. Apoios textuais mantêm a atividade autossuficiente.
- `tests/historia-alice-objetos-memorias-outubro-2026.spec.js`: **20 casos direcionados aprovados**,
  com gabarito independente e percurso completo, 30 pontos, erro/correção/recarga, seleção e
  ordenação reversíveis, escrita flexível, três ditados, sessões, isolamento, limpeza seletiva,
  JSON impossível/inválido, fallback, teclado/toque, 1366 × 768, 1920 × 1080, 390 × 844,
  axe-core, console e `file://` sem rede. Uso real validado em outubro de 2026. Não há confirmação separada da acústica da voz instalada.
- Cadastro central consolidado: **59 revisões**; as três contagens do teste central foram atualizadas
  para incluir as três revisões novas do lote, mantendo unicidade de IDs/chaves e existência dos elementos.
- Validação local concluída em 05/10/2026: build, formatação, lint, `git diff --check`,
  **20 testes direcionados**, **11 regressões de cadastro/Leitura** e **350 testes na suíte
  global (`npm test`, 23,9 minutos, exit 0)**. Uso real validado em outubro de 2026. A preparação
  dos PDFs de Leitura ocorreu somente em caminhos ignorados, com os originais preservados.

ID: `alice-historia-objetos-memorias-outubro-2026`.

Chave principal: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/historia-objetos-memorias-outubro-2026.js`.

Gabarito e uso acompanhado: [documento pedagógico](pedagogia/ALICE_HISTORIA_OBJETOS_MEMORIAS_OUTUBRO_2026.md).


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
  sem início automático, com prefixo protegido, repetir, parar e cancelamento por subitem/tela.
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

### Mariana — Geografia: Meios de transporte e comunicação

- Revisão exclusiva do 2º ano com **30 questões numeradas e 30 pontos**, baseada na síntese das
  páginas 58–69 e nos materiais complementares, sem reabrir ou reprocessar material privado.
- Q1–Q15 tratam de deslocamento até a escola, bicicleta, crianças ribeirinhas, classificação ampla
  e por caminhos, qualidade do ar, segurança, pedestre e leitura de dados fictícios. Hidroviário e
  dutoviário são explicados antes de serem cobrados.
- Q16–Q30 tratam de telefone, rádio, jornal, televisão, Libras, jornal impresso/digital, evolução
  temporal da comunicação, cuidados com telas e situações práticas de segurança na internet.
- Todas as telas mostram “Leia para aprender” e a fonte pedagógica adaptada. Q21–Q22 usam
  ordenação reversível; Q28 usa símbolos e rótulos textuais de Seguro, Cuidado e Perigo, sem
  depender apenas de cor.
- Q30 é um ditado final de três frases, usando somente `gramatica-ditado.js` e `audio.js` com voz
  local pt-BR, utterance protegido, repetir, parar e cancelamento. As respostas não aparecem nos
  controles.
- Reutiliza `QuestionariosRevisoes`, com estado estritamente normalizado, limpeza seletiva e
  fallback em memória. `layout.desktopAmplo` mantém leitura e atividade lado a lado no desktop e
  uma coluna no celular. Não há controlador paralelo.
- Testes: `tests/geografia-mariana-transportes-comunicacao.spec.js` (7 cenários), cobrindo gabarito
  independente, erro/correção, persistência, ordenação, ditado, isolamento, armazenamento
  corrompido ou bloqueado, 390 × 844, 1366 × 768, 1920 × 1080, axe-core e `file://` sem rede.

ID: `mariana-geografia-transportes-comunicacao-setembro-2026`.

Chave: `revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/geografia-transportes-comunicacao.js`.

### Alice — Geografia: Moradias, lugares e cômodos

- Revisão exclusiva do 1º ano, para a prova de 02/09/2026, com **25 questões numeradas e 25
  pontos**, baseada na síntese das páginas 64–69 sem reprocessar o material privado.
- Moradia, endereço e arredores são apresentados em cenas e dados totalmente fictícios; a revisão
  não pede, exibe como resposta nem armazena endereço real de Alice.
- Abrange lugares de brincar, casa térrea, sobrado, apartamento, palafita, oca, iglu, dados de uma
  turma fictícia, cômodos, objetos e organização da moradia. Materiais aparecem apenas como uma
  ampliação leve, sem transformar o conteúdo em revisão de construção.
- Todas as telas têm “Leia para aprender” e fonte de estudo; três SVGs originais descrevem tipos
  de moradia, uma casa com árvore/praça e o interior de uma casa fictícia com quatro cômodos.
- Q25 é um ditado final de três frases, usando somente `gramatica-ditado.js` e `audio.js` com voz
  local pt-BR, prefixo protegido, repetir, parar e cancelamento, sem expor respostas nos controles.
- Reutiliza `QuestionariosRevisoes`, com normalização estrita, limpeza seletiva e fallback em
  memória. `layout.desktopAmplo` organiza leitura e atividade lado a lado no desktop, mantendo uma
  coluna no celular; não há controlador paralelo.
- Testes: `tests/geografia-alice-moradias-interior.spec.js`, com gabarito independente, correção,
  persistência, isolamento, ditado, armazenamento corrompido/bloqueado, 390 × 844, desktops,
  axe-core e `file://` sem rede.

ID: `alice-geografia-moradias-lugares-interior-setembro-2026`.

Chave: `revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/geografia-moradias-lugares-interior.js`.

### Alice — Origem dos materiais

- Revisão preservada no perfil de Alice.
- Conteúdo sobre origem e classificação de materiais.
- Atividade com canvas e persistência de desenho.
- Migração do progresso antigo sem apagar a chave original.
- Isolamento em relação às atividades de Mariana.

Chave: `revisoesEscolares.alice.ciencias.origemMateriais`.

### Alice — Ciências: Objetos, emoções e alimentação

- Revisão exclusiva do 1º ano com **30 questões e 30 pontos**: materiais e reaproveitamento,
  sentimentos e atitudes respeitosas, alimentação variada e cuidados com os dentes.
- Dois ditados locais em pt-BR: `FELIZ` e `SAÚDE`, sem revelar ou preencher a resposta.
- Reutiliza o questionário declarativo compartilhado, com associações, seleção reversível,
  persistência, teclado, toque e cinco SVGs originais locais. A revisão antiga de Ciências da Alice
  permanece disponível no cartão próprio.

ID: `alice-ciencias-objetos-emocoes-alimentacao-setembro-2026`.

Chave: `revisoesEscolares.alice.ciencias.objetosEmocoesAlimentacaoSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/ciencias-objetos-emocoes-alimentacao-setembro-2026.js`.

### Mariana — Ciências: Plantas, seres vivos e a luz do Sol

- Revisão exclusiva do 2º ano com **30 questões numeradas e 30 pontos**: Q1–Q15 abordam
  partes e funções das plantas, frutos, sementes, necessidades, alimentação e proteção do solo;
  Q16–Q30 abordam dia/noite, animais, luz, calor, materiais e cuidados sob Sol forte.
- Cinco ditados locais em pt-BR: Q8 `RAIZ`, Q14 `FOLHA`, Q20 `SOL`, Q25 `LUZ` e Q30 com a frase
  `A LUZ DO SOL É IMPORTANTE PARA A VIDA.`. A resposta não aparece nem é preenchida pelo áudio;
  a frase final exige maiúsculas, acentuação e pontuação.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js` e
  `audio.js`. A Q1 ativa o novo `mapaVisual` declarativo para tocar diretamente na raiz, com botões
  posicionados também operáveis por teclado; associações usam subitens de alternativas e a
  ordenação permite retirar e limpar cartões.
- Dez SVGs originais e locais ilustram plantas, folha, sequência flor/fruto/sementes, seres vivos,
  solo, dia/noite, calor, materiais e proteção. Nenhum PDF, print, OCR ou recurso da internet foi
  reprocessado ou incorporado.
- Testes direcionados: `tests/ciencias-mariana-plantas-sol.spec.js`, incluindo gabarito completo,
  erro e correção, mapa visual, subitens, cinco ditados, persistência, isolamento, limpeza,
  armazenamento adverso, teclado/toque, layouts, axe-core, console e `file://`.

ID: `mariana-ciencias-plantas-sol-setembro-2026`.

Chave: `revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/ciencias-plantas-sol-setembro-2026.js`.

## 5. Matemática

### Alice e Mariana — Dezenas, dinheiro, contas e tabuadas

- Nova rodada com **30 questões e 30 pontos**, semanticamente idêntica nos dois perfis e com IDs,
  chaves, respostas e progresso independentes.
- Questões 1 a 6: material dourado, decomposição, sequências, números vizinhos e ábaco D–U.
- Questões 7 a 12: dinheiro fictício, dezenas exatas, cálculos até 19, formação de uma dezena e
  adição sem reagrupamento no quadro D–U.
- Questões 13 a 22: estratégias de adição, decomposição, cálculo mental, adição e subtração com
  reagrupamento, comparação e situações com dinheiro.
- Questões 23 e 24: problemas em etapas e mini simulado. Depois do acerto da questão 24, uma etapa
  de estudo apresenta somente as tabuadas do 2 e do 3, de `× 1` a `× 10`, sem conceder ponto.
- Ao iniciar a questão 25, a tabela fica bloqueada de modo persistente: voltar leva diretamente à
  questão 24 e avançar retorna à 25 sem reabrir o estudo, inclusive após sair ou recarregar.
- Questões 25 a 30 avaliam as tabuadas do 2 e do 3 em páginas com vários campos; cada página vale
  um único ponto e só termina quando todos os fatos estiverem corretos.
- Os visuais locais expõem dados estruturais que permitem conferir quantidades, posições D–U,
  valores monetários, parcelas e estados anterior/posterior das trocas sem revelar o resultado
  final. A revisão visual cega e os testes verificam o modelo matemático além da aparência.

IDs:

- `alice-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026`
- `mariana-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026`

Chaves:

- `revisoesEscolares.alice.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1`
- `revisoesEscolares.mariana.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1`

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

### Mariana — Formas e medidas — revisão 03/09

- Revisão exclusiva da Mariana com 32 etapas: apresentação, 30 questões avaliativas e encerramento.
- ID: `mariana-matematica-formas-medidas-setembro-2026`.
- Chave: `revisoesEscolares.mariana.matematica.formasMedidasSetembro2026.v1`.
- Progressão: formas e mosaico; comprimento em mm, cm e m; massa em g e kg; capacidade em mL e L;
  cinco operações com reagrupamento entre dezenas e unidades.
- Reutiliza integralmente a infraestrutura matemática existente: associações, seleção reversível,
  contagem, mosaico, régua, balança, recipientes de capacidade, campos e operação D-U.
- A revisão anterior Formas, mosaicos e medidas e os respectivos progressos permanecem intactos.

## 6. Gramática

### Alice — Pontuação, LH e X/CH (outubro de 2026)

- Revisão original para a prova do 1º ano, com **30 questões e 30 pontos**. Progressão de
  reconhecimento, completamento, aplicação, comparação, correção e interpretação.
- Vírgula, ponto-final, pergunta, exclamação, dois-pontos, travessão, ponto e vírgula, reticências,
  aspas, LH, CH, NH e X com som de CH. Q28–Q30 reutilizam o mesmo texto original; Q30 mistura
  alternativas e seleção e só pontua depois de todos os subitens corretos.
- Quatro ditados locais em pt-BR (Q5, Q11, Q15 e Q24) reutilizam exclusivamente
  `gramatica-ditado.js` e `audio.js`. Q18 apresenta quatro SVGs originais e textos alternativos.
- Conteúdo declarativo em `revisoes/alice/gramatica-pontuacao-lh-xch-outubro-2026.js`, painel de
  questionários compartilhado, `layout.desktopAmplo`, `validacaoEstritaEstado` e contagem opt-in
  de tentativas completas por questão.
- Primeiro questionário com **Modo Responsável** opt-in: Ctrl + Alt + R abre o painel; a sessão
  auxiliar tem chave isolada, salto administrativo de Q1–Q30 sem fabricar progresso, limpeza
  seletiva e retorno à sessão principal. Cartão e status continuam ligados apenas à Alice.
- Teste direcionado: `tests/gramatica-alice-pontuacao-lh-xch-outubro-2026.spec.js`.
- Validação automatizada em 01/10/2026: build, formatação e lint aprovados; **14/14** testes
  direcionados e **315/315** testes na suíte global. Os quatro SVGs foram inspecionados
  visualmente. Em 02/10/2026, o responsável confirmou que a atividade funcionou corretamente no
  uso real. A orientação para evitar respostas entregues nos próprios itens foi registrada em
  `pedagogia/QUALIDADE_DAS_QUESTOES.md` para revisões futuras, sem alterar as questões atuais.
- Material escolar privado permaneceu fora do Git; nenhuma página, OCR, print ou ilustração foi
  copiada ou reprocessada.

ID: `alice-gramatica-pontuacao-lh-xch-outubro-2026`.

Chave principal: `revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.responsavel.v1`.

### Mariana — Português e Gramática: revisão da prova (outubro de 2026)

- Revisão exclusiva do 2º ano com **35 questões e 35 pontos**: interpretação, vírgula,
  R/RR, estruturas silábicas, X/CH, sinônimos e antônimos, substantivos e gênero.
- Q1–Q4 mantêm “A caixa da exposição” para consulta; Q33–Q35 mantêm “O boné encontrado”.
  Ordenações Q2, Q13 e Q14 são reversíveis; questões com vários itens dão um ponto apenas após
  todos os acertos. A distribuição das alternativas é fixa e irregular.
- Quatro ditados locais em pt-BR (Q11, Q15, Q18 e Q32) usam `gramatica-ditado.js` e `audio.js`,
  sem reprodução automática nem exposição da resposta nos controles. Q32 cobra maiúscula,
  vírgula, acento e ponto na frase completa.
- Conteúdo em `revisoes/mariana/gramatica-portugues-prova-outubro-2026.js`, no painel e
  controlador `gramatica-questionarios` existentes. Usa `layout.desktopAmplo`,
  `validacaoEstritaEstado`, `registrarTentativas` e **Modo Responsável** opt-in com sessão e
  chave independentes, salto de posição sem fabricar progresso e limpeza da chave ativa.
- Teste direcionado: `tests/gramatica-mariana-portugues-prova-outubro-2026.spec.js`.
- Validação automatizada em 02/10/2026: build, formatação e lint aprovados; **15/15** testes
  direcionados e **330/330** testes na suíte global. A suíte global foi executada porque a
  integração acrescentou uma entrada de navegação em `app.js`. Áudio conferido por payload
  simulado. Em 04/10/2026, o responsável confirmou a validação em uso real e aprovou a revisão;
  não há registro separado de audição da voz instalada.

ID: `mariana-gramatica-portugues-prova-outubro-2026`.

Chave principal: `revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.responsavel.v1`.

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
  utterance protegido, repetir, parar e cancelamento. Sem revelar ou preencher respostas.
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

### Mariana — Pontuação, ortografia e palavras (setembro de 2026)

- Nova revisão independente de Gramática do 2º ano com **35 questões e 35 pontos**.
- ID `mariana-gramatica-pontuacao-ortografia-vocabulario-setembro-2026` e conteúdo declarativo em
  `revisoes/mariana/gramatica-pontuacao-ortografia-vocabulario-setembro-2026.js`.
- Blocos de sinais e tipos de frase, vírgula, S/SS, R/RR, sinônimos, antônimos, encontros
  vocálicos, separação silábica, transformações de palavras, M antes de P/B e acentuação.
- Q4, Q16 e Q21 usam ditado opcional local em pt-BR, sem resposta escrita nos controles; Q7,
  Q17, Q32 e Q34 reutilizam seleção e ordenação reversíveis de `questionarios-interacoes.js`.
- Após validação em uso real, Q3 e Q4 receberam botão de travessão; Q4 orienta separadamente erros
  de início, grafia, acento, pontuação final e frase incompleta sem revelar a resposta. Os ditados
  usam um único utterance com “A palavra é:” ou “A frase é:” no mesmo enunciado da resposta. Esse
  prefixo absorve o corte inicial observado no Chromium/Windows sem expor a resposta escrita na
  interface.
- As alternativas foram redistribuídas deterministicamente nas questões com padrões previsíveis,
  incluindo Q23, Q25, Q27, Q30, Q31, Q32 e Q34. Q22 permanece exatamente nas posições 2/3/2/3.
- `layout: { desktopAmplo: true }` e `validacaoEstritaEstado: true`; correção recuperável,
  persistência, pontuação e limpeza ficam isoladas na chave nova. As revisões anteriores não são
  substituídas nem migradas.
- Teste direcionado em
  `tests/gramatica-mariana-pontuacao-ortografia-vocabulario-setembro-2026.spec.js`, cobrindo o
  percurso completo com gabarito independente, erro e correção, retorno/recarga, isolamento,
  ditado/áudio, teclado, toque, Desktop Amplo, 390 × 844, axe-core, overflow e `file://`.
- Correção de uso real e arquitetura de áudio unificada validadas com 123/123 testes direcionados e
  257/257 testes na suíte global.
- Validação acústica humana concluída com sucesso no Chromium/Windows em Português e Inglês.
- Implementação feita somente a partir da síntese Markdown consolidada, sem OCR, nova renderização
  ou cópia de PDF, página, texto ou ilustração escolar.

Chave:
`revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1`.

### Mariana — Contos, ortografia e pontuação

- Nova revisão independente com **30 questões**, baseada na síntese pedagógica da prova de 31/08.
- Questões 1–4: contos, conto de fadas, começo/problema/desfecho e suspense infantil; 5–10: NH e CH;
  11–14: antônimos e sinônimos; 15–23: frase declarativa, ponto-final, interrogação, exclamação,
  travessão e dois-pontos; 24–28: S/SS, separação silábica e S com som de Z; 29–30: pontuação integrada.
- Conteúdo original e declarativo em `revisoes/mariana/gramatica-contos-ortografia-pontuacao.js`,
  reutilizando `js/gramatica-questionarios.js`. Não substitui as revisões de 40 e 25 questões.
- Sete ditados opcionais: Q7, Q10 e Q28 com palavras; Q17, Q21, Q23 e Q30 com frases curtas.
  `js/gramatica-ditado.js` aceita `unidadeDitado: 'frase'`, mantendo palavras como padrão legado.
  Usa exclusivamente `js/audio.js`, voz local pt-BR a 0,78, utterance protegido, repetir, parar e
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
- As questões 5, 7 e 22 oferecem ditado opcional de cada resposta em `pt-BR`, com prefixo protegido,
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

### Alice — Play Time · Unit 6 (outubro de 2026)

Uso real validado em outubro de 2026. Clareza, fluxo e execução da atividade foram confirmados;
Azure, gateway, avaliação automática e exposição da voz instalada no navegador não recebem
validação técnica adicional por essa confirmação.

- ID: `alice-ingles-play-time-unidade-6-outubro-2026`; unidade:
  `play-time-unidade-6-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/alice/ingles-play-time-unidade-6-outubro-2026.js`.
- Principal: `revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1`.
- Auxiliar: `revisoesEscolares.mariana.ingles.playTimeUnidade6Outubro2026Compartilhada.v1`;
  somente pelo Modo Responsável. O cartão e seu status pertencem exclusivamente a Alice.
- 25 cartões de áudio/escrita guiada (19 brinquedos e seis frases compostas), uma preparação
  `historia` com seis painéis, 25 questões/25 pontos: **51 etapas obrigatórias**. Escritas e os
  painéis internos não criam pontos ou etapas extras. Consulta disponível em todas as questões.
- Dez pares/20 alvos opcionais de conversa, ID `play-time-unidade-6-outubro-2026-conversacao-v1`.
- 61 SVGs locais originais `play-time-*`; geração determinística por
  `node scripts/gerar-assets-play-time.cjs`. Comparação A/B com sete alterações e mesma base;
  permanências e destaques auditados. Quatro versões móveis empilham as mesmas cenas A/B.
  A revisão das sete diferenças aparece somente após Q22.
- Reuso de RegistroIngles/ConfiguracoesIngles, Inglês, AudioRevisoes, pronúncia e armazenamento.
  Extensões opt-in: pergunta visível, ordem fixa, rótulo acessível, imagem de conversa e fontes
  móveis locais. Trocas de
  sessão/saída cancelam microfone/avaliação e exigem novo consentimento.
- Gabarito: B, D, A, C, B, A, D, C, A, B, C, D, B, A, D, C, D, B, A, C, B, D, C, A, B.
  Distribuição A=6, B=7, C=6, D=6, preservada também na sessão auxiliar.
- Testes específicos: `tests/ingles-alice-play-time.spec.js`; suíte global exigida pelas alterações
  compartilhadas. Validação automatizada usa TTS, microfone e gateway simulados; acústica
  instalada e serviço real não receberam confirmação técnica específica para Play Time.
- Validação histórica isolada: build, `format:check`, lint e `git diff --check` aprovados; **16/16** testes
  direcionados e **331/331** na suíte global (23,4 min). Capturas inspecionadas em 1366, 1920 e
  390 px; sete diferenças e variantes móveis auditadas sem mudança de geometria.
- Base: `origin/main` em `8e82c89`, branch `codex/alice-ingles-play-time-outubro-2026`.
  A implementação original não tinha commit. A consolidação local mantém a Gramática da
  Mariana já incorporada em `main` por `e88ad36`/`937989e` e acrescenta as duas Histórias de outubro.
- Detalhes: [Play Time](pedagogia/ALICE_INGLES_PLAY_TIME_OUTUBRO_2026.md).


### Alice e Mariana — Friends · Atividade 1

- Uma única unidade declarativa compartilhada oferece o mesmo conteúdo, as mesmas 25 questões,
  o mesmo gabarito e a mesma progressão pedagógica aos dois perfis. IDs, chaves, respostas,
  conferências, pontos, conclusão e limpeza permanecem separados para Alice e Mariana.
- A etapa inicial tem **25 itens obrigatórios de áudio e transcrição**: nome e amizade;
  números de 1 a 10; seis cores; e sete frases de apresentação, idade e cor. A grafia continua
  visível e o portão só libera as atividades com 25/25 áudios e 25/25 escritas corretas.
- As **25 atividades / 25 pontos** trabalham cumprimento, nome, idade, números, anterior e
  posterior no alfabeto, cores e três integrações curtas. Correção imediata permite errar,
  corrigir e conferir novamente antes de avançar.
- Nos exercícios específicos de números, o numeral aparece no enunciado e a criança escolhe a
  palavra em inglês, sem tradução em português nas alternativas. Nos exercícios de alfabeto, as
  alternativas exibem somente as letras e o enunciado explicita `Which letter...`; o áudio da
  pergunta pratica o nome inglês da letra. IDs, gabarito e chaves foram preservados, portanto o
  refinamento não invalida o progresso já salvo.
- `layout.desktopAmplo` e `praticaEscrita` reutilizam o motor atual. Áudio permanece exclusivamente
  em `audio.js`, com `Word:`/`Phrase:`, velocidades 0,62/0,50, repetição, parada e cancelamento.
- Dois SVGs originais representam um balão verde e uma mochila azul. Atividades visuais podem
  declarar `imagemEnunciadoAlt`; em repetições, o texto alternativo completo aparece somente na
  primeira imagem para evitar anúncio duplicado.
- Teste direcionado: `tests/ingles-friends-atividade-1.spec.js` (6 cenários), cobrindo cadastro,
  áudio/escrita, portão, percurso, pontuação, gabarito, isolamento, armazenamento adverso,
  lógica visual, teclado/toque, viewports, axe-core, troca para revisão legada e `file://`.

IDs:

- `alice-ingles-friends-atividade-1`
- `mariana-ingles-friends-atividade-1`

Chaves:

- `revisoesEscolares.alice.ingles.friendsAtividade1.v1`
- `revisoesEscolares.mariana.ingles.friendsAtividade1.v1`

Unidade compartilhada: `friends-level-1-atividade-1`.

### Mariana — At School · Atividade 2

- Revisão exclusiva da Mariana, independente da Unit 3 e da Atividade 1, com **25 itens de áudio
  e transcrição** distribuídos em dez objetos escolares, seis perguntas/respostas e nove comandos
  de sala. O portão exige 25/25 áudios e 25/25 escritas corretas.
- As **25 atividades / 25 pontos** avançam de reconhecimento visual de objetos para perguntas com
  `What's this?` e `Is it...?`, respostas afirmativas/negativas e compreensão de comandos.
- A unidade ativa `exigirAudioPerguntaAntesDeResponder`: cada questão começa bloqueada e somente o
  término do seu próprio áudio libera as alternativas. As liberações são isoladas por questão,
  normalizadas, persistidas e apagadas por `Refazer`; vocabulário e escrita permanecem preservados.
- `js/ingles.js` concentra a capacidade opt-in e continua usando exclusivamente `js/audio.js`.
  Revisões anteriores não recebem a trava. Parada, erro, cancelamento, nova fala, navegação ou
  troca de tela não simulam conclusão.
- Depois de cada conferência, a unidade abre a etapa obrigatória **Let’s review!**, com pergunta,
  resposta correta e imagem opcional somente em Inglês. O botão de revisão executa a sequência
  pergunta EN → tradução PT → resposta EN → significado PT; `Próxima` só libera ao término normal.
  Erro, parada, cancelamento, clique repetido, outro áudio, navegação e recarga não fabricam a
  conclusão. A questão 25 segue o mesmo ciclo antes do resultado final.
- A conclusão da revisão pós-resposta é persistida por questão e alternativa na mesma chave `v1`.
  Estados antigos já concluídos continuam válidos, tentativas e pontos não são duplicados, e
  `Refazer` inicia o ciclo completo na questão 1 sem apagar vocabulário ou escrita.
- Cinco SVGs originais representam abrir o livro, fechar a mochila, sentar na carteira, passar a
  caneta e a orientação da professora. As descrições significativas ficam expostas por
  `imagemEnunciadoAlt`; nenhum PDF, OCR, captura escolar ou recurso remoto foi incorporado.
- Teste direcionado: `tests/ingles-mariana-at-school-atividade-2.spec.js` (13 cenários), cobrindo
  cadastro, conteúdo, portão, ordem bilíngue, acerto/erro, bloqueio até o fim, parada, cancelamento,
  erro, clique repetido, outro áudio, navegação, recarga intermediária, persistência, progresso
  legado, refazer, questão 25, percurso completo, pontuação, isolamento, viewports, axe-core e
  `file://`.

ID: `mariana-ingles-at-school-atividade-2`.

Chave: `revisoesEscolares.mariana.ingles.atSchoolAtividade2.v1`.

Unidade: `at-school-atividade-2`.

### Mariana — At School · Atividade 3

- Revisão exclusiva da Mariana com **17 itens obrigatórios de áudio e transcrição** em quatro
  grupos: Story & Values, Phonics · Letter A, Senses e Create That!. O questionário permanece
  bloqueado até 17/17 áudios e 17/17 escritas corretas.
- A validação humana mostrou que Q1–Q7 dependiam de contexto externo. Por isso, uma **Story Time
  interna com seis cenas** agora aparece depois do estudo e antes das perguntas, tornando a revisão
  autossuficiente. As cenas são recontações e ilustrações originais/adaptadas; nenhuma página,
  quadrinho ou ilustração do livro foi copiada.
- Cada cena oferece texto em Inglês e Português e áudio local EN → PT, sem autoplay, pela
  infraestrutura `AudioRevisoes`. Cena, conclusão e origem da consulta sobrevivem à recarga.
- As **25 atividades / 25 pontos** cobrem a história e Helping Each Other, o som curto de `a`,
  Skills, os cinco sentidos e Think Back. Cada pergunta exige a conclusão do próprio áudio antes
  de liberar as alternativas e mantém erro recuperável.
- Q1–Q7 oferecem **Rever história**. A consulta abre a Story Time sem apagar questão, resposta,
  áudio já concluído ou consolidações anteriores; **Voltar à questão** restaura o ponto exato.
- Toda questão usa a consolidação obrigatória Let’s review!, na ordem pergunta EN → tradução PT →
  resposta EN → significado PT. Parada, cancelamento, erro ou substituição do áudio não fabricam
  conclusão; a recarga restaura o estado intermediário.
- Depois de uma resposta errada, a Activity 3 mantém **Let’s review!** aberta até o fim da sequência
  e então libera **Tentar novamente**, que volta à mesma questão. Cada novo erro invalida somente a
  revisão daquela tentativa e exige novamente EN → PT → EN → PT; o acerto libera **Próxima**.
- A Activity 3 e Play Time são as unidades de Inglês com **Modo Responsável** habilitado. O painel
  oculto abre e fecha por `Ctrl + Alt + R`, mostra sessão e questão, permite selecionar Mariana ou
  Alice, saltar livremente e encerrar a sessão administrativa. A faixa permanece visível enquanto
  a sessão auxiliar de Alice está ativa.
- A sessão principal continua usando exatamente
  `revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1`; a sessão auxiliar usa
  `revisoesEscolares.alice.ingles.atSchoolAtividade3Compartilhada.v1`. A troca salva e restaura os
  mapas completos sem copiar dados. O salto persiste apenas `questaoAtual`, não conclui os 17 itens,
  a Story Time, áudio, resposta, conferência, revisão pós-resposta, tentativa ou ponto.
- O cartão continua exclusivo da Mariana e consulta somente a chave principal. Não há cartão nem
  cadastro da Activity 3 no perfil de Alice, e a limpeza remove apenas a chave da sessão ativa.
- `destinatariaMensagemFinal` é uma capacidade declarativa opt-in de `js/ingles.js`: esta unidade
  mostra “Uma mensagem para as meninas”, enquanto a Atividade 2 e as demais revisões conservam o
  destinatário derivado do perfil.
- Depois do resultado normal, a seção opcional **CONVERSAÇÃO · ESCUTE E PRONUNCIE** reutiliza
  cinco pares de Q6, Q15, Q17, Q21 e Q22. Pergunta e resposta podem ser ouvidas pelo `audio.js` e
  praticadas separadamente, com gravação/parada/repetição ilimitada e feedback “Muito bem!”,
  “Quase!” ou “Tente mais uma vez.”, sem exibir nota nem aprovar/reprovar.
  **Ouvir modelo** fixa `en-US` a `0.50` em `js/pronuncia.js`, para pergunta e resposta, inclusive
  ao ouvir novamente; vocabulário, Story Time, perguntas e consolidação mantêm suas velocidades.
- A conversa não cria etapa, ponto ou estado persistido, portanto preserva as 25 questões, as 43
  etapas, a chave `v1`, progresso legado e sessões do Modo Responsável. Consentimento e permissão
  são explícitos; permissão negada, API ausente, timeout e rede indisponível não desfazem a
  conclusão.
- `scripts/azure-pronunciation-gateway.js` escuta apenas em loopback, lê chave/região do ambiente,
  limita WAV, aplica CORS local, chama o Azure e devolve somente escores resumidos. Navegador e
  gateway zeram buffers após uso e não gravam arquivos. Operação e privacidade estão documentadas
  em `infraestrutura/PRONUNCIA_AZURE.md`.
- O parser de pronúncia aceita os escores REST diretamente em `NBest[0]`, mantendo o formato
  aninhado compatível. Logs seguros distinguem status Azure, ausência de avaliação e erro local,
  com metadados WAV e nomes de campos, sem áudio, fala ou credenciais. A retomada após reboot e
  o contrato REST estão descritos em `PRONUNCIA_AZURE.md`; o responsável confirmou a validação do
  protótipo com Azure real antes da automação do launcher.
- Os SVGs novos são originais e descrevem conjuntos de objetos, ajuda entre colegas, ações de
  retirar/guardar, os cinco sentidos e as seis cenas da Story Time. Assets existentes de objetos
  escolares e de abrir o livro foram reutilizados. Nenhum PDF, OCR, print escolar ou recurso
  remoto foi incorporado.
- Teste direcionado: `tests/ingles-mariana-at-school-atividade-3.spec.js` (17 cenários), cobrindo
  cadastro, perfil, portão de estudo, Story Time antes das perguntas, seis cenas, conteúdo de
  Q1–Q7, áudio bilíngue sem autoplay, navegação e recarga, consulta sem perda de estado, escrita
  corrigível, áudio obrigatório, consolidação bilíngue, refazer, limpeza seletiva, armazenamento
  adverso, isolamento, cenas visuais, percurso completo, mensagem final, Activity 2, viewports,
  teclado, toque, axe-core, `file://`, opt-in exclusivo do Modo Responsável, atalho, sessão auxiliar,
  salto sem pré-requisitos falsos, restauração entre sessões, recarga e limpeza por chave.
- Protótipo de pronúncia: `tests/ingles-pronuncia-azure.spec.js` (8 cenários), com parser REST,
  resposta Azure 200/401 simulada, logs sem fala/credencial, descarte no gateway e gateway sem
  credencial e CORS restrito, opt-in exclusivo, TTS compartilhado, WAV de 16 kHz, consentimento,
  pergunta/resposta, repetição, faixas sem nota, descarte, permissão negada, `503`, rede, timeout,
  isolamento do `localStorage`, 390 × 844 e axe-core.
  O payload-modelo é verificado a `0.50` nas cinco perguntas e respostas, com repetição, retorno e
  nova audição após tentativa simulada, sem consumir Azure.
- Launcher de pronúncia: `tests/launcher-pronuncia.cjs` (8 cenários simulados) cobre autenticação,
  login, reutilização do gateway, CLI ausente, falha na chave, `configured:false` e continuidade do
  ambiente principal. A chave real não é usada nesses testes.

ID: `mariana-ingles-at-school-atividade-3`.

Chave: `revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1`.

Chave auxiliar do Modo Responsável:
`revisoesEscolares.alice.ingles.atSchoolAtividade3Compartilhada.v1`.

Unidade: `at-school-atividade-3`.

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
- Unit 3 não ativa escrita e preserva suas chaves e seu comportamento anterior.
- Dez SVGs locais da biblioteca Fluent Emoji Flat foram incluídos para os conceitos novos; nenhum
  PDF, imagem escolar ou recurso da internet foi incorporado.

Chave ativa: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v2`.

Chave histórica preservada: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v1`.

### Alice — Unit 5: At the Farm

- **Versão 2**, no mesmo cartão e ID, somente para Alice: **97 itens + 30 atividades = 127 etapas**.
- Preserva os 41 itens dos quatro grupos antigos e acrescenta exatamente 56 itens em seis grupos:
  More Animals, Family & Father's Day, Toys, Where Is It?, Little Grammar e School & Special Days.
- Ativa declarativamente `praticaEscrita` obrigatória e `layout.desktopAmplo`, reutilizando a
  infraestrutura da City Life sem mudar controlador, áudio, HTML ou CSS compartilhados.
- As atividades exigem 97 áudios e 97 escritas corretas. A grafia canônica permanece visível;
  somente Father's Day e Happy Father's Day! têm variantes explícitas de pontuação para o 1º ano.
- As 16 atividades anteriores foram reformuladas; as 14 seguintes cobrem família fictícia, datas
  especiais, brinquedos, as cinco preposições e os padrões am/is/are e has/have.
- Correção recuperável por questão, recarga e isolamento preservados. A v1 não é lida, migrada ou
  apagada; limpar remove somente a v2 ativa. Mariana e Unit 3 conservam suas chaves.
- Reutiliza a biblioteca local e acrescenta 18 SVGs originais (13 conceitos e cinco cenas de
  posição). Nenhum PDF, scan ou desenho da professora foi incorporado.

Chave ativa: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2`.

Chave histórica preservada: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1`.


Validação técnica histórica concluída e atividade validada em uso real com Alice em outubro de
2026. O progresso local foi posteriormente limpo pelo responsável, sem alteração da implementação
ou da validação pedagógica realizada. Nenhum progresso foi reconstruído nesta consolidação.
A confirmação não valida separadamente Azure, avaliação automática ou voz instalada.

Detalhes: [At the Farm v2](pedagogia/ALICE_INGLES_AT_THE_FARM_V2.md).


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
- City Life v2, Friends · Atividade 1, At the Farm v2 e Play Time ativam o layout amplo. Unit 3
  de Alice e Mariana conserva o layout legado ao ser aberta depois de uma revisão
  optante.

#### Áudio compartilhado

`js/audio.js` atende Alice e Mariana, Inglês e ditados declarativos com vozes locais, uma única
utterance protegida por solicitação, repetição, parada e cancelamento. A revisão mantém pronúncia
normal/devagar e instruções em Português sem criar implementação própria.

A fonte normativa de payloads, idiomas, velocidades, privacidade, controles e validação humana é
[Áudio e voz](infraestrutura/AUDIO_E_VOZ.md). A justificativa arquitetural fica no
[ADR-001](decisoes/ADR-001-PROTECAO_AUDIO_CHROMIUM_WINDOWS.md).

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
- Ditados com voz local e prefixo protegido no mesmo utterance do conteúdo contra corte.
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
- O início audível da pronúncia é protegido por prefixo dentro do mesmo utterance.
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

Na data deste inventário existem **392 testes Playwright**:

- `tests/ingles-alice-play-time.spec.js`: conteúdo, percurso, sessões, áudio, armazenamento, acessibilidade e execução local de Play Time.
- `tests/historia-alice-objetos-memorias-outubro-2026.spec.js`: **20 casos direcionados aprovados**,
  com gabarito independente e percurso completo, 30 pontos, erro/correção/recarga, seleção e
  ordenação reversíveis, escrita flexível, três ditados, sessões, isolamento, limpeza seletiva,
  JSON impossível/inválido, fallback, teclado/toque, 1366 × 768, 1920 × 1080, 390 × 844,
  axe-core, console e `file://` sem rede. Uso real validado em outubro de 2026. Não há confirmação separada da acústica da voz instalada.
- `tests/historia-mariana-memorias-outubro-2026.spec.js`: 30 questões e 30 pontos, gabarito
  independente, cenas locais, seleção/ordenação mista, ditado de frases e normalização de
  História, sessões independentes, persistência, isolamento, acessibilidade e `file://`.
- `tests/ingles-at-the-farm-v2.spec.js`: 97 itens, 30 questões, áudio/escrita, variantes, portão,
  chave v1 preservada, limpeza seletiva, desktop, preposições, axe-core e `file://`.
- `tests/ambiente-interativo.spec.js`: fluxos centrais, revisões de Inglês de Alice e Mariana, Leitura, Matemática ampla, armazenamento, canvas e `file://`.
- `tests/ingles-friends-atividade-1.spec.js`: unidade compartilhada com 25 itens e 25 questões,
  áudio e escrita obrigatórios, portão, correção recuperável, isolamento, armazenamento
  adverso, lógica das ilustrações, viewports, axe-core e `file://`.
- `tests/ingles-mariana-at-school-atividade-2.spec.js`: 25 itens e 25 questões, portão de
  áudio/escrita, conclusão obrigatória do áudio de cada pergunta, cancelamento, normalização,
  percurso completo, refazer, regressão legada, viewports, axe-core e `file://`.
- `tests/ingles-mariana-at-school-atividade-3.spec.js`: 17 itens, Story Time de seis cenas, 25
  questões e quatro grupos, portão de áudio/escrita, áudio bilíngue sem autoplay, consulta da
  história em Q1–Q7 com restauração exata, áudio obrigatório por pergunta, consolidação bilíngue,
  Modo Responsável opt-in com sessões Mariana/Alice, salto puro, restauração e limpeza seletiva,
  mensagem plural opt-in, cenas visuais, armazenamento adverso, isolamento, refazer, viewports,
  axe-core e `file://`.
- `tests/ciencias-mariana-plantas-sol.spec.js`: 30 questões, mapa visual, gabarito completo,
  associações, ordenação, cinco ditados, persistência, isolamento, armazenamento adverso,
  teclado/toque, layouts, axe-core, console e `file://`.
- `tests/matematica-manipulativa.spec.js`: cenas, trocas, ábacos, clique no quadro, teclado, persistência e nova Centenas em ação.
- `tests/acessibilidade.spec.js`: axe e responsividade das telas principais.
- `tests/gramatica-mariana.spec.js`: 40 questões, erro e correção, digitação, teclado, persistência,
  isolamento, limpeza seletiva, conclusão, ditado nas questões 5/7/22, celular, axe e `file://`.
- `tests/gramatica-mariana-portugues-prova-outubro-2026.spec.js`: 35 questões, quatro ditados,
  leitura, ordenação, subitens, tentativas, Modo Responsável, persistência, isolamento,
  armazenamento adverso, layouts, axe-core e `file://`.
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
- `tests/matematica-dezenas-dinheiro-tabuadas-setembro.spec.js`: igualdade semântica das 30
  questões entre perfis, IDs e chaves isolados, gabarito, modelos visuais quantificados, erro e
  correção, vários campos, pontuação única, tabuadas somente do 2 e do 3, bloqueio persistente,
  limpeza seletiva, teclado, toque, celular, axe-core, console e `file://`.

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
