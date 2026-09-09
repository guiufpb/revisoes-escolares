---
name: revisoes-escolares
description: Planeja, implementa, testa, audita e prepara publicacao de revisoes no repositorio Revisoes Escolares para Alice e Mariana. Use ao criar ou evoluir atividades de Matematica, Gramatica/Portugues, Historia, Geografia, Ciencias, Ingles, Leitura, Computacao e futuras materias; ao trabalhar com PDFs, cadernos, prints ou sinteses pedagogicas; ou ao auditar Git, progresso, acessibilidade e testes desse projeto. Nao use para tarefas fora do repositorio Revisoes Escolares.
---

# Revisoes Escolares v2

Use esta skill como **roteador operacional**, nao como substituto das regras do repositorio.

## 1. Fonte de verdade e precedencia

Antes de alterar codigo, siga nesta ordem:

1. `AGENTS.md`.
2. `documentacao/ambiente-interativo/INSTRUCOES_PROJETO.md`.
3. `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`.
4. Para nova revisao: `ambiente_interativo/revisoes/MODELO_NOVA_REVISAO.txt`.
5. Quando precisar de historico/testes reais: `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`.
6. `package.json` para comandos vigentes.
7. Implementacao atual e uma revisao equivalente.

Se houver divergencia, prevalecem `AGENTS.md`, as instrucoes do projeto e a implementacao atual. Nao copie para esta skill regras que mudam com frequencia; releia os arquivos acima.

## 2. Preflight obrigatorio

Antes de qualquer escrita:

- execute `git status --short --branch`;
- identifique branch, `HEAD`, relacao com `origin/main` e arquivos pendentes;
- preserve prompts locais, stashes e alteracoes alheias;
- se houver trabalho rastreado ou codigo nao relacionado que possa conflitar com a tarefa, pare e reporte antes de misturar lotes;
- nunca use `git reset --hard`, `git clean -fd`, `git add -A`, `git add .` ou `git add -f` como atalho;
- nao faca commit, push, PR, merge ou publicacao sem autorizacao explicita para essa etapa.

Para nova revisao, crie branch propria `codex/<slug>` apenas quando a base estiver adequada e o usuario tiver pedido implementacao.

## 3. Separe analise pedagogica de implementacao

A formula central da v2 e:

**analise pedagogica rica uma vez -> sintese rica -> implementacao tecnica economica**

Economia de contexto e processamento nunca significa economia pedagogica.

Na fase pedagogica, estude todas as fontes relevantes, incluindo texto e elementos visuais, monte a matriz de cobertura e conclua o gate pedagogico. A prova define o nucleo obrigatorio, nao o limite da revisao. A revisao deve combinar **ensinar -> observar -> praticar -> verificar -> consolidar**.

Preencha a sintese durante a analise para registrar fontes, matriz, plano e resultado do gate. Somente depois de corrigir todas as lacunas e aprovar o gate, finalize a sintese e gere o Markdown de implementacao para o Codex. Leia `references/pedagogia-e-cobertura.md` para analisar materiais, planejar ensino, textos de apoio, diversidade, ilustracoes, validacao textual e o gate completo. Use `assets/modelo-sintese-pedagogica.md` para registrar a passagem entre as fases.

No Codex, receba a sintese pronta, consulte poucos arquivos tecnicos, reutilize infraestrutura e evite reanalisar integralmente o material. Leia `references/materiais-locais.md` quando houver PDF, caderno, print, OCR, imagem, DOCX, planilha ou outro material bruto.

## 4. Entenda a entrada antes de codificar

Resolva explicitamente:

- crianca/perfil e serie;
- materia, assunto e data/prova quando relevante;
- material de referencia e quais paginas/prints sao relevantes;
- se existe sintese pedagogica rica e aprovada;
- saida desejada: interativa, cartilha/PDF, simulado, gabarito, auditoria ou planejamento;
- quantidade de questoes/pontos e restricoes especiais.

Se a analise pedagogica ainda nao passou pelo gate, nao reduza o material a uma implementacao apressada. Conclua a analise conforme `references/pedagogia-e-cobertura.md` antes do Markdown para implementacao.

## 5. Modo economico e risco

Concentre o modo economico na implementacao tecnica:

1. **REUSE BEFORE PROCESS** — reutilize sintese, OCR, paginas renderizadas e implementacoes equivalentes.
2. **LOCAL BEFORE MODEL** — use ferramenta local para trabalho mecanico e deterministico.
3. **FILTER BEFORE CONTEXT** — filtre paginas, trechos, logs e diffs antes de leva-los ao contexto principal.
4. **VISION FOR PEDAGOGY** — na analise pedagogica, inspecione visualmente todas as paginas relevantes; no Codex, volte a elas apenas para esclarecer duvida pontual indispensavel.

Para inclusao declarativa de baixo risco, com equivalente conhecido e sem mudanca compartilhada, consulte o minimo, mantenha a implementacao declarativa e nao crie subagentes automaticamente.

Se a tarefa exigir controlador, armazenamento, audio, navegacao, motor ou componente compartilhado, o modo economico deixa de prevalecer: amplie a investigacao, justifique a necessidade, avalie impacto nas revisoes antigas, use auditoria quando fizer sentido e siga os gatilhos completos de regressao do `AGENTS.md`.

Leia `references/orquestracao-economia.md` para os criterios de risco e subagentes.

## 6. Escolha a infraestrutura antes de criar algo novo

Consulte primeiro o inventario e uma revisao equivalente. Depois roteie:

- **Matematica visual/manipulativa ou digitada/tabuada**: `references/matematica.md`.
- **Gramatica/Portugues, Historia, Geografia, Ciencias e questionarios declarativos**: `references/questionarios-e-audio.md`.
- **Ingles/audio**: `references/questionarios-e-audio.md`.
- **Leitura/PDF.js**: `references/leitura.md`.
- **Computacao**: leia primeiro `documentacao/computacao/README.md` e siga o ciclo editorial abaixo antes de qualquer integracao.
- **Outra materia futura**: inventario/modelo e extensao opt-in; nao presuma biblioteca ou controlador inexistente.

Para Computacao, consulte a trilha, o historico, a bibliografia/mapa de fontes e o padrao editorial indicados no README. Antes de cada novo volume, examine novas paginas relevantes das obras-base e atualize o mapa comparativo. Use obrigatoriamente:

**fontes → mapa comparativo → lacunas → ideia central → roteiro → texto → direcao visual → briefings → questoes → ativos → PDF → validacao → integracao**

Preserve a arquitetura **historia → conceito → aplicacao cotidiana → aplicacao computacional → questoes**, Lina, Nino e a identidade visual. Produza conteudo e ilustracoes originais e nao re-OCRize nem rerenderize material ja sintetizado sem necessidade. Mantenha cartilha e questoes comuns a Alice e Mariana. Na futura integracao, reutilize Leitura/PDF e questionarios existentes, sem leitor paralelo, e isole o progresso por perfil, materia, revisao e chave.

Conteudo especifico fica em `ambiente_interativo/revisoes/<perfil>/` quando aplicavel. Comportamento reutilizavel fica em controlador compartilhado somente quando a capacidade realmente precisa ser geral. Nao reconstrua o ambiente nem crie controlador paralelo para trocar conteudo. Preserve revisoes antigas e nunca edite bundles gerados manualmente.

## 7. Contrato pedagogico, estado e acessibilidade

Preserve sempre:

`errar -> conferir -> corrigir -> conferir -> avancar -> voltar -> recarregar`

Garanta:

- erro recuperavel sem pular etapa e pontuacao sem duplicacao;
- estado visual e logico restaurados juntos;
- progresso isolado por perfil, materia, revisao e chave;
- `localStorage.clear()` proibido e limpeza somente da chave ativa;
- arrasto nunca como unico meio e toda manipulacao reversivel;
- clique, toque, teclado, foco visivel e `aria-live`;
- celular 390 x 844 sem rolagem horizontal quando aplicavel;
- conteudo infantil original, autossuficiente e adequado a serie;
- respostas e exigencias de escrita coerentes com o objetivo pedagogico da materia;
- alternativa fechada quando varias respostas legitimas nao puderem ser aceitas com seguranca.

Para material impresso ou simulado, inclua gabarito e siga as regras especificas do repositorio.

## 8. Audio, ditado e validacao textual

Use apenas os modulos compartilhados existentes. Audio comeca por acao da crianca, oferece repetir, parar e cancelar, usa vozes locais e nunca cria `speechSynthesis` paralelo.

Ditado e apoio auditivo sem preenchimento automatico nem exposicao da resposta. Use-o tambem como ferramenta pedagogica quando exercitar leitura, escrita ou vocabulario de forma apropriada.

Por padrao, Ciencias, Historia, Geografia, Matematica e Leitura nao devem rejeitar uma resposta apenas por diferenca de maiusculas/minusculas. Exija capitalizacao, pontuacao, acentuacao ou frase completa somente quando isso tiver valor pedagogico explicito. Reserve `maiusculasObrigatorias` principalmente para Gramatica/Portugues ou objetivos declarados de escrita. Detalhes ficam em `references/questionarios-e-audio.md` e `references/pedagogia-e-cobertura.md`.

## 9. Privacidade e direitos autorais

Nunca publique PDFs escolares reais, OCR bruto, renderizacoes privadas, prints do caderno, pastas identificadas por aluna, documentos pessoais, caches, relatorios ou temporarios. Crie textos, atividades e ilustracoes proprios. Use materiais privados para compreender conceitos e formatos pedagogicos, nao para reproduzir paginas, personagens, logos ou diagramacao.

## 10. Validacao proporcional ao risco

A politica de testes e exclusivamente a de `AGENTS.md`. Para toda mudanca de codigo, normalmente execute build, formatacao, lint e testes Playwright direcionados. Use `npm test` global apenas pelos gatilhos atuais do projeto; mudanca compartilhada, estrutural ou com alcance incerto antecipa a regressao correspondente.

Prefira testes reais e comandos deterministas. Filtre saidas longas e retorne apenas erros relevantes ou contagens PASS/FAIL. Leia `references/testes-git-publicacao.md`.

## 11. Gates de parada

Pare e informe antes de prosseguir quando:

- a base Git estiver contaminada por trabalho nao relacionado que possa conflitar;
- uma inclusao aparentemente declarativa exigir mudanca compartilhada nao prevista;
- houver necessidade de destruir ou migrar progresso antigo;
- uma ferramenta local exigir instalacao ou elevacao nao autorizada;
- testes revelarem regressao compartilhada inesperada;
- material privado aparecer como candidato a versionamento;
- commit, push, PR, merge ou publicacao forem necessarios sem autorizacao explicita.

Nao esconda problemas alterando testes para faze-los passar.

## 12. Encerramento e uso real

O fluxo completo e:

**analise -> implementacao -> testes automatizados -> uso real por Alice/Mariana -> ajustes necessarios -> consolidacao -> publicacao**

Testes automatizados validam software. Uso real valida clareza, dificuldade, compreensao, ergonomia, valor pedagogico, ambiguidade, audio, imagens e regras de correcao. Registre validacao real somente quando o usuario a confirmar; pequenos achados podem orientar revisoes futuras sem reabrir automaticamente uma revisao concluida.

Antes de declarar uma implementacao pronta:

- resuma ID, chave, arquivo, questoes/etapas/pontos, cobertura pedagogica e infraestrutura reutilizada;
- informe arquivos compartilhados alterados ou confirme que nao houve;
- informe testes realmente executados e se a suite global foi exigida;
- execute `git diff --check`;
- confirme privacidade;
- pare antes de commit, push, PR ou merge salvo autorizacao explicita.

Para staging ou publicacao autorizados, siga `references/testes-git-publicacao.md` e preserve staging explicito.
