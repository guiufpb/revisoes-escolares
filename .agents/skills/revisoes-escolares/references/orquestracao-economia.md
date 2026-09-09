# Orquestracao economica

## Objetivo

Reduzir poluicao de contexto e trabalho tecnico repetido sem multiplicar agentes por rotina nem empobrecer a analise pedagogica.

## Limite do modo economico

A formula da v2 e:

**analise pedagogica rica uma vez -> sintese rica -> implementacao tecnica economica**

Economize releitura de codigo, varredura do repositorio, OCR/rerenderizacao repetidos, infraestrutura paralela, subagentes e testes sem gatilho. Nao economize profundidade da analise dos materiais, conceitos considerados, textos de apoio, variedade, ilustracoes, adequacao ou qualidade da sintese.

## Classificacao de risco

### Inclusao declarativa de baixo risco

Quando houver equivalente conhecido, conteudo especifico novo e nenhuma mudanca de controlador, armazenamento ou estrutura:

- consulte o minimo tecnico necessario;
- mantenha a implementacao declarativa;
- nao use subagentes automaticamente;
- crie assets somente quando tiverem funcao pedagogica;
- teste conforme `AGENTS.md`.

### Mudanca compartilhada de maior risco

Ao alterar controlador, armazenamento, audio, navegacao, motor de atividades ou componente reutilizavel, o modo economico deixa de prevalecer. Amplie a investigacao, mapeie revisoes afetadas, justifique a mudanca, avalie regressao e compatibilidade, considere auditoria e siga os gatilhos completos de `AGENTS.md`.

## Regra de delegacao

Antes de criar subagente, responda:

1. A tarefa e independente?
2. A saida pode ser curta e verificavel?
3. O subagente precisa de menos contexto que o principal?
4. Um modelo mais barato consegue executa-la com seguranca?

Se alguma resposta for nao, mantenha a tarefa no agente principal.

## Papeis recomendados

### Agente principal

Responsabilidades:

- interpretar pedido e sintese pedagogica;
- decidir arquitetura/controlador;
- planejar alteracoes;
- executar ou integrar escritas;
- decidir gates de risco;
- consolidar resultados e falar com o usuario.

Para nova revisao ou tarefa ambigua, prefira Sol em esforco medio; aumente o esforco apenas para arquitetura compartilhada, regressao complexa ou conflito dificil.

### `revisoes_explorer`

Use para exploracao read-only delimitada:

- encontrar revisao equivalente;
- mapear arquivos/registro/testes;
- comparar implementacoes;
- confirmar se capacidade ja existe.

Use quando o equivalente ou a infraestrutura nao estiverem claros. Nao use automaticamente quando o caminho ja for conhecido.

Configuracao incluida em `.codex/agents/revisoes-explorer.toml`: Terra medio, read-only.
Retorno esperado: poucos itens com caminhos e evidencias; sem edicao.

### `revisoes_auditor`

Use no fim para auditoria objetiva:

- escopo do diff;
- contagem de arquivos;
- IDs/chaves/total esperados;
- arquivos compartilhados tocados;
- prompts/material privado candidatos ao Git;
- consistencia entre teste/registro/documentacao.

Priorize em mudanca compartilhada, risco de colisao de ID/chave, escopo estrutural ou lote com risco relevante. Nao o torne etapa obrigatoria de inclusao declarativa simples.

Configuracao incluida em `.codex/agents/revisoes-auditor.toml`: Luna medio, read-only.
Nao substitui build/lint/Playwright reais.

## Testes e comandos

Prefira que o agente principal execute comandos deterministas e entregue ao subagente apenas o resumo/erro relevante, quando a execucao puder gerar artefatos.

Nao use varios agentes para executar a mesma suite.
Nao rode `npm test` em paralelo com outras suites que gerem bundles/relatorios no mesmo workspace sem motivo.

## Escrita paralela

Evite por padrao.
Nao delegue simultaneamente a dois agentes edicoes em `app.js`, `app.entry.js`, registros, documentacao central ou controladores compartilhados.
Se houver paralelismo de escrita realmente necessario, use worktrees isoladas e uma estrategia explicita de integracao; caso contrario, o agente principal escreve.

## Economia de tokens

- subagente recebe tarefa minima, nao o prompt inteiro;
- nao mande PDF/OCR bruto ao auditor;
- nao mande `AGENTS.md` inteiro a cada subagente se bastar citar a regra relevante;
- subagente devolve conclusao + caminhos/linhas, nao diario de raciocinio;
- reutilize resultados de comandos ja executados;
- nao crie subagente para alterar uma linha, contar arquivos ou atualizar uma expectativa simples.
