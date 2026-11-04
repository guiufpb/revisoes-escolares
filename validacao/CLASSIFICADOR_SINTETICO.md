# ORG.6B — uma classe sintética fechada

A [simulação ORG.7](SIMULACAO_SINTETICA.md) agrega este classificador em lotes sintéticos,
preservando suas regras e acrescentando bloqueios de identidade/escopo entre entradas.
Reconhecimento continua sem autorização de limpeza.

Reconhecedor puro `classifySynthetic(input, context)` em
`scripts/validacao/classificador-temporario-sintetico.cjs`. Usa o envelope independente
ORG.5A e a saída ORG.6A, sem modificar seus contratos. Não importa os leitores de
registros/inventário, não executa IO/Git, relógio atual ou persistência e não implementa
simulação ou ações físicas. `cleanupAuthorization` é sempre `none`, inclusive quando
o resultado é `recognized`.

## Classe e prova exigida

Única classe: `synthetic-counter-v1`. É a representação em memória de um arquivo de
contagem, produzido pelo harness próprio `org6b-owned-harness-v1`, no cenário fechado
`closed-counter-harness-v1`. Não são criados arquivos físicos nesta etapa.
`harness-temporario-sintetico.cjs` executa esse cenário determinístico, produz conteúdo,
SHA-256, duas regenerações independentes e o transcript do consumidor previsto.

O contexto independente informa cenário, `runId` e data da inspeção. O chamador do
teste deve defini-lo a partir do plano confiável do harness, nunca extraí-lo de uma
alegação externa para torná-la confiável. `runId` aceita 1–32 caracteres ASCII de
minúsculas/dígitos/hífen; identidades exatas derivam como `scope-<runId>` e
`counter-<runId>`. Não são caminhos, UUIDs de worktree ou índices privados novos.

```js
const { runHarness } = require('./scripts/validacao/harness-temporario-sintetico.cjs');
const { classifySynthetic } = require('./scripts/validacao/classificador-temporario-sintetico.cjs');
const proof = runHarness('case-one');
// inspection é o resultado ORG.6A para esse único recurso sintético.
const result = classifySynthetic(
  { proof, inspection },
  {
    scenarioId: 'closed-counter-harness-v1',
    runId: 'case-one',
    observedAt: '2026-11-03T12:00:00Z',
  }
);
```

Condições cumulativas de reconhecimento:

1. Versão, cenário, classe, produtor e finalidade `test-only-ephemeral` conhecidos.
2. Identidade e escopo exatos em todos os pontos, incluindo os eventos e envelopes.
3. Conteúdo exatamente igual à receita fixa `counter-sequence-v1`, digest coerente e
   tamanho observado igual ao número de bytes UTF-8 esperado. Não basta fornecer um hash.
4. Duas tentativas de regeneração com o digest esperado; a receita conhecida é
   reexecutável independentemente do conteúdo informado. Corpus fixa conteúdo e digest
   conhecidos, evitando validar a receita somente contra ela própria.
5. Transcript exato `producer:produce → verifier:acquire → verifier:release →
producer:finish`. O único consumidor do universo é `verifier`; ausência de referência
   ativa é demonstrada por aquisição/liberação e encerramento, não por um booleano
   `noConsumers=true`. Consumidor/evento extra, recurso divergente ou consumidor ativo bloqueiam.
6. Inspeção ORG.6A completa, compatível e sem diagnósticos, com exatamente um recurso.
   Seus três fatos devem ser únicos, observados, contemporâneos à data fornecida,
   consistentes com os metadados e provenientes de filesystem e índice/ignore.
   O recurso deve ser arquivo presente e `ignored` ou `untracked`; `tracked` bloqueia.

Não depende de nome, extensão, idade, pasta `tmp` ou registro histórico. `ignored`/
`untracked` são somente restrições adicionais do cenário, sem provar temporariedade.
Ausência física e diretório não são reconhecidos como essa classe. Esta versão recusa
toda inspeção parcial, mesmo se a falha pudesse ser irrelevante em um universo maior.
Os contratos herdados permanecem fechados; versões/campos desconhecidos são recusados.
Entradas são dados JSON simples, sem getters/proxies/métodos, com limites explícitos
de tamanho de conteúdo, run, eventos, tentativas e recursos.

## Saída explicável e corpus

Saída `classificationVersion=1`, `targetClass`, `subjectId`, `status`, `codes`,
`explanations`, `basis`, `unknown` e `cleanupAuthorization=none`. Códigos e explicações
estáveis são definidos em `REASONS`; não reproduzem texto arbitrário de entrada.
`basis` registra apenas verificações já satisfeitas, inclusive em resultados negativos.
Os desconhecidos globais da ORG.6A são preservados; provas locais do harness não
resolvem consumidores externos, origem real ou estado atual do filesystem.

| Resultado        | Significado e exemplos do corpus                                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recognized`     | Prova completa de `case-one`, `case-two` e run máximo, com ignored/untracked. Só reconhece a classe no universo sintético.                                                         |
| `not-recognized` | Classe/finalidade diferente ou recurso conhecido que é diretório/ausente.                                                                                                          |
| `indeterminate`  | Prova obrigatória ausente, fatos desconhecidos ou encerramento não demonstrado sem consumidor ativo comprovado.                                                                    |
| `blocked`        | Produtor desconhecido, versões incompatíveis, conteúdo/hash/tamanho divergentes, identidade conflitante, dependência ativa, regeneração insuficiente ou inspeção parcial/recusada. |

Corpus em `tests/fixtures/temporarios-sinteticos.cjs`; testes em
`tests/validacao/classificador-temporario-sintetico.unit.cjs`. Todos os dados são
sintéticos e em memória. Inclui entradas congeladas, comparação de chamadas repetidas,
saída sem referências mutáveis compartilhadas, preservação de desconhecidos e bloqueio
de IO/execução/relógio atual/aleatoriedade durante os cenários positivos e negativos.
Os testes da ORG.6B não acessam outras worktrees, registros reais, documentos escolares
ou evidências históricas. O carregamento inicial de módulos/schemas confiáveis é feito
pelo Node; não é leitura de recursos pelo reconhecedor.

## Limites e próximo incremento

Esta prova não autentica produtor externo, transcript recebido de terceiros ou arquivo
real. O harness é confiável **dentro do teste fechado**, por sua implementação conhecida
e seu contexto independente; SHA-256 comprova coerência do conteúdo, não procedência.
Um JSON fabricado externamente pode reproduzir os mesmos dados sintéticos. Não usar
esse resultado como atestação de um recurso da máquina ou autorização de manutenção.
Não há descoberta de consumidores reais, snapshot atômico, reconciliação histórica,
permissão de exclusão ou coleta de conteúdo fora do corpus.

O menor incremento ORG.7 é um simulador exclusivamente de leitura sobre lotes do mesmo
corpus/snapshot sintético: agregar reconhecidos, recusados e desconhecidos, com motivos,
sem comandos, movimentação ou executores. Manter `cleanupAuthorization=none`, identidade
exata e recusa diante de lacunas/conflitos. Antes de alcançar recursos físicos reais,
será necessário demonstrar o vínculo confiável entre origem, conteúdo, identidade e
consumidores; o reconhecimento em memória não fornece esse vínculo automaticamente.

## Separação dos lotes e validação

Continuidade na worktree `codex/org-6a-integracao-evidencias`, HEAD `dfa1b0a`.
Baseline dos 13 arquivos herdados em `tmp/org6b-base-hashes.json`, sem ler outra
worktree. ORG.6B adiciona somente dois módulos, corpus, teste e este documento; altera
o inventário de implementações e acrescenta referência na documentação da ORG.6A.
Não altera os schemas/coletores/validador/adaptador herdados. Sem commit ou publicação.
Build, formatação, lint e diff aprovados; direcionados 90/90, com 46 casos da ORG.6B.
Os 46 casos do reconhecedor passaram também após a revisão final do harness, cujo
conjunto local de consumidores ativos é verificado antes de registrar o encerramento.
A primeira global (`npm test`, `tmp/org6b-global.log`) aprovou 498/498 Node e
637/638 Playwright em 43,5 min, exit code 1. Falhou o teste existente
`[optins:callbacks] callbacks antigos não atravessam sessões` de
`gramatica-alice-pontuacao-interpretacao-outubro-2026.spec.js:324`: a comparação de
texto passou a incluir “← Voltar”, sem diferença registrada em storage/eventos nessa
asserção. O reteste isolado aprovou 1/1 em 6,1 s, sem alteração de código ou teste.
Possível oscilação, sem causa definitivamente comprovada; não foi ocultada ou corrigida
por enfraquecimento de asserção. Trace original preservado em `test-results/`, com
identificação SHA-256 em `tmp/org6b-falha-original-hash.json`.

Passagem global final: `npm run test:e2e -- --output tmp/org6b-global-final-artifacts`,
incluindo o pretest oficial (manifesto, todos os testes Node, build e planejamento
observacional). Resultado: 498/498 Node e 638/638 Playwright, em 45,6 min de Playwright,
exit code 0, sem mudança de código/testes entre as rodadas. Um worker, porta 5189 e
identidade confirmada, PDFs sintéticos oficiais. Log: `tmp/org6b-global-final.log`;
reteste: `tmp/org6b-reteste-callbacks.log`. Artefatos da passagem final separados do
trace da primeira rodada. Os warnings de storage corrompido/bloqueado são parte dos
cenários adversos; permanece o aviso existente do build sobre `pdfjs-wasm` em runtime.
Previews locais em `output/` foram preservados fora do lote de implementação.
