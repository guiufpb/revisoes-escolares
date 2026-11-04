# ORG.7 — simulação de um lote sintético

O [piloto físico ORG.8A](HARNESS_FISICO.md) consome esta simulação sem alterar suas
regras ou autorização `none`. A ação física depende de solicitação explícita separada
e fica limitada a entradas de arquivos recém-criados dentro do recipiente próprio.

Função pura `simulateSyntheticBatch(batch)` em `scripts/validacao/simulador-sintetico.cjs`.
Opera somente sobre dados sintéticos JSON em memória. Reutiliza `classifySynthetic`
da ORG.6B para cada entrada; não recebe classificações pré-calculadas nem duplica suas
regras. Não executa IO/Git, persistência, relógio atual, aleatoriedade ou ações físicas.
Schemas, classificador, corpus e contratos ORG.5A/6A/6B permanecem inalterados.

## Entrada e identidade

```js
const { simulateSyntheticBatch } = require('./scripts/validacao/simulador-sintetico.cjs');
const report = simulateSyntheticBatch({
  batchVersion: 1,
  resources: [
    {
      resourceId: 'counter-case-one',
      scopeId: 'scope-case-one',
      input, // proof + inspection, conforme ORG.6B
      context, // cenário, runId e data explícitos, conforme ORG.6B
    },
  ],
});
```

De 0 a 100 entradas explícitas, sem descoberta de recursos. Objetos são fechados e
versões desconhecidas são recusadas. Argumentos devem ser JSON simples, sem getters,
proxies ou métodos. IDs são opacos (1–100 letras ASCII/dígitos/hífen/underscore), sem
caminhos; `resourceId` e `scopeId` devem coincidir com a identidade derivada do contexto
independente da ORG.6B. Campos ausentes de prova/inspeção continuam sob responsabilidade
do classificador, que mantém resultados indeterminados ou bloqueados.

Antes da consolidação, coleta reivindicações de identidade do manifesto, contexto,
prova, eventos e sujeitos observados. Colisões de recurso **ou escopo** bloqueiam todos
os envolvidos, inclusive se uma entrada duplicada for estruturalmente inválida.
Não escolhe o primeiro registro, não deduplica silenciosamente e não conta bytes duas
vezes. Reivindicações e arrays só são examinados dentro dos limites conhecidos.
Erros de ligação entre manifesto/prova/contexto acrescentam bloqueio explícito.

## Relatório explicável

Saída `simulationVersion=1`, `cleanupAuthorization=none`:

- `status=rejected`: lote incompatível/ausente/acima do limite, sem avaliação parcial
  silenciosa; `submittedCount=null` e `assessedCount=0` não significam lote vazio válido.
- `status=evaluated` ou `with-blocks`: o lote foi avaliado, com o resultado individual
  em cada linha. Avaliação concluída não é autorização nem prova de manutenção segura.
- `resources`: posição, IDs/escopos sintéticos, `classification` original da ORG.6B,
  `status` efetivo no lote, diagnósticos do simulador, `syntheticBytes` e autorização `none`.
  Entradas inválidas mantêm posição, com IDs desconhecidos como `null`.
- A classificação conserva `codes`, explicações, `basis` favorável e `unknown`; razões
  contrárias ficam nos códigos/diagnósticos. Se a ORG.6B reconhecer um recurso que colide
  no lote, a classificação original é preservada para explicação, mas o status efetivo
  passa a `blocked`. **Contagens sempre usam o status efetivo.**
- `summary.counts`: recognized, not-recognized, indeterminate e blocked; `assessedCount`
  e `submittedCount` correspondem ao lote aceito. Lote vazio é válido e conta zero.
- `knownSyntheticBytes` soma apenas arquivos únicos com tamanho comprovado pela ORG.6B
  e sem bloqueios do lote. Os demais têm tamanho `null` e contam em
  `resourcesWithUnknownSize`; zero na soma não comprova ausência de bytes nesses casos.
- `realReclaimableBytes` é sempre `null`. A soma sintética não representa espaço físico
  recuperável. Não há caminhos, conteúdo de arquivos, comandos ou planos de movimentação.
- `requiredChecks` aplica-se a todos os recursos: autenticar produtor físico, vincular
  identidade/conteúdo, revalidar estado sem links, demonstrar regeneração física,
  resolver consumidores externos, comprovar recuperação reversível e obter autorização
  explícita. São condições futuras, sem instruções executáveis ou concessão de permissão.

Resultados incompatíveis do classificador são bloqueados na fronteira. O simulador
nunca converte `recognized` em elegibilidade e não reconcilia histórico com observação.
A confiança no produtor e no universo fechado continua limitada ao harness sintético;
conteúdo/digest e transcript fornecidos externamente não autenticam recursos da máquina.

## Corpus, testes e preservação

`tests/validacao/simulador-sintetico.unit.cjs` reutiliza integralmente o corpus ORG.6B
em memória. Abrange positivos, negativos, lote misto dos quatro resultados, duplicação,
aliases conflitantes, escopos divergentes, dados incompletos/incompatíveis, limite de
100 entradas, versão futura do classificador, contagens/tamanhos, entradas congeladas,
determinismo, saída sem referências mutáveis compartilhadas e autorização sempre `none`.
IO, execução de processos, relógio e aleatoriedade são bloqueados durante teste de pureza.
Não há criação/alteração de recursos pelo simulador nem consulta a materiais privados.

Continuidade na worktree `codex/org-6a-integracao-evidencias`, HEAD `dfa1b0a`.
Baseline local dos 18 arquivos herdados: `tmp/org7-base-hashes.json`. ORG.7 adiciona
módulo, testes e este documento; somente acrescenta referências ao documento ORG.6B
e ao inventário. Traces e logs anteriores são preservados; a global usa diretório de
saída próprio para não sobrescrever a evidência da falha oscilante legada. Nenhum
commit, push, PR, merge ou publicação foi realizado. Resultados da validação desta
composição serão registrados após execução, sem reutilizar aprovações antigas.

Validação inicial: build, formatação, lint e diff aprovados; 137/137 testes direcionados,
incluindo 47 da ORG.7. Os 16 arquivos herdados fora dos dois documentos atualizados
mantêm os hashes da baseline, e o trace original ORG.6B mantém seu SHA-256. A global
obrigatória desta composição ainda será registrada ao terminar. Log reservado:
`tmp/org7-global.log`; artefatos próprios: `tmp/org7-global-artifacts`.

A primeira global terminou no pretest com 544/545 Node, exit code 1; o Playwright
não iniciou. Falhou a injeção de troca de arquivo do teste herdado ORG.5A, que usava
`ino += 1`. Em fixtures Windows com inode acima da precisão inteira de `Number`,
foi confirmado que essa soma pode não alterar o valor (por exemplo,
`10133099162411176 + 1 === 10133099162411176`). O reteste isolado passou, evidenciando
que a injeção dependia do inode alocado para a fixture.

Manutenção exclusiva em `tests/validacao/registro-worktrees.unit.cjs`: escolher inode
sintético 0 ou 1, sempre diferente do original, e afirmar a diferença. A asserção de
rejeição `record-file-changed` foi preservada; nenhum código do leitor ou contrato foi
alterado. Reteste leitor + simulador: 64/64. Essa é a única exceção adicional à
preservação byte a byte da baseline, além dos dois documentos já identificados.
Global integral final: `npm test -- -- --output tmp/org7-global-final-artifacts`,
incluindo o pretest oficial completo. Resultado: 545/545 Node e 638/638 Playwright,
em 46,0 min de Playwright, exit code 0. Um worker, porta 5189, identidade confirmada
e PDFs sintéticos oficiais. Log em `tmp/org7-global-final.log`, com artefatos separados
em `tmp/org7-global-final-artifacts`. A primeira falha permanece no log original.
Build, formatação, lint e diff também aprovados após a manutenção. Os 15 arquivos
herdados fora dos dois documentos e do teste mantido preservam os hashes originais;
o trace da oscilação legada ORG.6B mantém seu SHA-256. Nenhum recurso foi alterado pelo
simulador; somente ferramentas de desenvolvimento/testes geraram seus artefatos locais.

## Menor próximo incremento

Um harness físico isolado, exclusivamente de arquivos sintéticos próprios, poderá
demonstrar criação e regeneração, identidade exata, vínculo confiável com a inspeção,
ausência de consumidores no escopo e recuperação de uma operação reversível. Exigirá
ação/escopo explícitos, recusa de links/conflitos e prova de restauração sem sobrescrever
destinos. O primeiro ensaio deve continuar limitado aos artefatos desse harness; esta
simulação não autoriza operação física, uso em worktrees ou arquivos reais do usuário.
