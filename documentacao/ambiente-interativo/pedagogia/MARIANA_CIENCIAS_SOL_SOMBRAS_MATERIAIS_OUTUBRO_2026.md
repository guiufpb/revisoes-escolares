# Mariana — Investigando o Sol, as sombras e os materiais

Registro de integração — 13/10/2026: validação humana das atividades confirmada pelo
responsável antes desta etapa. Os relatos de pendência e os resultados técnicos abaixo
descrevem a cópia de origem em suas respectivas datas. Conteúdo, IDs e chaves foram
preservados; a validação da combinação com 63 revisões consta no inventário.

Nova rodada original para Ciências, 2º ano, identificada por outubro de 2026, sem data de prova
confirmada. A atividade anterior de plantas e Sol permanece independente.

## Identificação e cobertura

- ID: `mariana-ciencias-sol-sombras-materiais-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/mariana/ciencias-sol-sombras-materiais-outubro-2026.js`.
- Principal: `revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.v1`.
- Auxiliar: `revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.responsavel.v1`.
- 30 questões, 64 unidades de resposta, 30 pontos; todos os subitens precisam estar corretos
  para concluir uma questão. Pausas de descoberta aparecem na consolidação dos blocos, sem pontos.

| Bloco | Questões | Cobertura |
| --- | --- | --- |
| Luz e sombras | Q01–Q08 | Fonte, bloqueio, direção, altura aparente, gnômon, diário e luz difusa |
| Luz e materiais | Q09–Q14 | Nitidez, categorias, vocabulário, teatro, opacidade e propriedades |
| Calor e transformações | Q15–Q22 | Derretimento, evaporação, secagem, controles, absorção e forno |
| Conexões com a vida | Q23–Q29 | Emissão/reflexão, energia, plantas, diário, rotação e cuidados |
| Detetive da praça | Q30 | Aplicação integrada em quatro registros autossuficientes |

Distribuição editorial: 18 questões de núcleo inferido, quatro de reforço, sete de ampliação e
uma de enriquecimento. Não certifica a cobertura de uma lista oficial de prova ausente.
Há 47 grupos de escolha, um alvo de mapa, sete conjuntos, quatro sequências e cinco campos.
As 48 decisões únicas têm posições fixas A=15, B=16, C=17, sem embaralhamento na execução.

## Adaptação à infraestrutura existente

Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js`,
`audio.js` e `armazenamento.js`. Não acrescenta motor, API, gravação ou reconhecimento de fala.
Desktop Amplo, validação estrita, tentativas e Modo Responsável são opt-ins desta revisão.
A principal e a auxiliar compartilham somente o conteúdo, com progresso independente.

Q06, Q12 e Q15 usam `misto` com um único subitem de ordenação. Isso mantém a sequência inteira
como uma unidade, com os mesmos controles de colocar, retirar e limpar; Q30 combina os quatro
grupos existentes. As apresentações iniciais e ordens canônicas foram preservadas.

Q10 usa três campos com ditado opcional de palavra, cancelamento ao trocar campo e resposta
canônica primeiro. Variantes de gênero e pequenas formulações são aceitas. Caixa, acento e
pontuação incidental são flexíveis. Os alvos não aparecem no apoio, figura ou rótulos prévios.
Q20 utiliza apenas o banco `menos · clara · mais · escura`, sem ditado.

## Produção visual e inspeção

Há 33 SVGs próprios locais em `assets/ciencias-sol-sombras-materiais-outubro-2026/`: V01–V30 e
três imagens de avaliação da Q05. O apoio do gnômon permanece separado das imagens por subitem,
que não mostram sombras prontas. Os painéis têm identificações fixas e equivalente textual
completo. Q30 usa quatro painéis com os registros completos junto de cada grupo.

O mapa Q02 utiliza uma imagem de proporção 1,3 para conservar a geometria do recorte vigente
no celular. Alvos e opções têm valores idênticos; o Sol e o vaso foram ampliados e nomeados
para continuarem identificáveis atrás dos controles. O piso tem alvo fora da sombra.

Todos os ativos e sua inserção nas 30 questões foram renderizados individualmente. A inspeção
inicial corrigiu projeção na parede, distorção dos painéis, nitidez, ausência de corte nas
sequências, trajetos do refletor, imagem virtual do espelho, salina e poças no piso.
As 90 renderizações em 390×844, 1366×768 e 1920×1080 não apresentaram overflow horizontal.
Capturas e geradores de trabalho permanecem locais, fora do Git.

## Estado da validação

Validação retomada pelo responsável após a pausa para troca de esforço do modelo. Build,
formatação e lint aprovados. Os 15 cenários da nova atividade passaram, incluindo percurso
completo 30/30, recarga/reabertura e ditado local simulado. As 27 regressões equivalentes de
Ciências e História também passaram. A primeira rodada conjunta teve 38 aprovações e quatro
falhas no código dos testes; os quatro casos passaram após corrigir a asserção de erro das
alternativas, o seletor do botão Voltar e aguardar o fim da animação antes de medir contraste.
Nenhuma regra de acessibilidade foi desativada e a aplicação não precisou de alteração nessa
retomada. A correção inicial de implementação alinhou os valores do mapa (pontuação incidental).

O arquivo `tests/ciencias-mariana-sol-sombras-materiais-outubro-2026.spec.js` prepara 15 cenários
de gabarito independente, recuperação, conjuntos, ordenação, escrita, ditado, sessões, limpeza,
armazenamento adverso, toque, teclado, alvos, viewports, axe-core e execução `file://` sem rede.
Os testes Windows de abertura/worktrees (23 cenários) e pronúncia (oito cenários simulados)
passaram. `npm test` é exigido pelas alterações em navegação, registro e HTML de integração;
a execução global terminou com 415/416 aprovados em 29,8 minutos. O único caso pendente era
a contagem fixa antiga do cadastro (59 revisões). As três contagens foram atualizadas para 60,
mantendo unicidade de IDs e chaves e presença dos elementos. O reteste específico passou (1/1).
Assim, todos os 416 casos foram verificados, mas não houve nova execução global integral depois
desse ajuste restrito ao teste. Build, formatação, lint e `git diff --check` passaram.

A base usa o preparo compartilhado atual de dez PDFs sintéticos originais de testes. Esses
arquivos validam o fluxo técnico, sem copiar ou certificar livros escolares privados.
Audição humana, uso infantil, integração na pasta habitual e publicação não foram realizados.
