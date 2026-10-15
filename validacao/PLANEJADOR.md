# Planejador observacional — Etapa 2

O planejador calcula uma hipótese de testes por risco/impacto e explica cada inclusão, omissão e
fallback. **Nunca executa um recorte. `npm test`, a global em toda PR e o check Formatação, lint e
testes continuam integrais.** A Etapa 3 acrescenta a integração observacional abaixo; a execução
Ubuntu dessa integração permanece pendente até futura PR autorizada.

## Entradas explícitas e comandos

```text
npm run planejar:testes -- --mode worktree --base 14584b2fee618fc900bb3d5657b9cfa16482bf33
npm run planejar:testes -- --mode refs --base REF_BASE --target REF_ALVO
npm run test:planejador
npm run comparar:plano -- --plan CAMINHO/plano.json --run CAMINHO/run.json
```

O modo `worktree` compara a base explícita com índice, alterações não staged e arquivos não
rastreados não ignorados. Não usa HEAD como substituto da checkout modificada. O modo `refs`
compara dois commits resolvidos, sem incluir as alterações locais no diff dessas referências.
Os nomes são resolvidos por Git para SHA; caminhos são lidos com registros NUL, inclusive renomes,
espaços e acentos. Nenhum checkout, staging, commit ou atualização de referência é realizado.

**Limite da validação entre refs nesta etapa:** o conteúdo permitido do alvo precisa coincidir
com a checkout local validada. Caso contrário, o plano é inválido, com diagnóstico de identidade.
Não são criadas cópias de fontes históricas nem são executados testes de outra referência. Use
uma checkout já correspondente ao alvo para esse modo. O diff é sempre aquele das referências;
a identidade da worktree utilizada na validação é registrada separadamente.

O planejador reutiliza o validador e a descoberta Playwright com `--list --reporter=json`.
A listagem carrega declarações dos testes, mas não executa seus corpos, build ou servidor.
As identidades são as da Etapa 1: SHA-256 de arquivo/caminho de títulos, com projeto/repetição
como instâncias. Linhas não selecionam nem identificam casos.

## Saídas e códigos

Cada chamada grava somente sob `tmp/validacao/planejador/<UTC-UUID>/`, ignorado pelo Git:

- `plano.json` e `plano.md`: comparação/identidade, manifesto/versão, mudanças, riscos,
  fundamentos, consumidores, dependências, contratos, arquivos/casos disponíveis e propostos,
  omissões justificadas, referências não resolvidas e motivos de fallback.
- `comparacao.json` e `comparacao.md`: compatibilidade, presença/execução, falhas omitidas,
  impedimentos de conclusão e projeção condicional das durações de tentativas.

Plano válido (`candidate` ou `global`): saída 0. Plano inválido/erro de uso: saída 1.
Comparação inconclusiva: saída 2; comparação possível: saída 0. Uma falha omitida observada fica
explicitamente marcada como `omitted-failure-observed`; saída 0 significa que a comparação pôde
ser feita, não aprovação de um recorte. Não há comando de execução de testes neste módulo.

## Regras conservadoras

| Risco/situação                                                       | Regra                                                                                                                                                                                                                            |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R0                                                                   | Somente Markdown na allowlist `documentacao/**/*.md` e README/PLANEJADOR desta pasta. Documentos AGENTS, instruções e política de testes ficam fora da exceção. Vazio é admitido apenas nessa regra.                             |
| R1                                                                   | Delta estático comprovado na AST, configuração efetivamente associada a motor conhecido/validado e mapa de testes/contratos resolvido. Dependentes entram transitivamente.                                                       |
| R2                                                                   | Somente troca hexadecimal de fill/stroke em SVG de gramática fechada, mesma estrutura/geometria, consumidores explícitos e nenhuma lacuna concreta de assets calculados nos consumidores. Inclui consumidores e contrato visual. |
| R3/R4                                                                | Global. Fontes compartilhadas/dependências, fluxo próprio, estrutura, armazenamento, build ou alcance incerto não são recortados.                                                                                                |
| Desconhecido, CSS, asset não demonstrado                             | Global, com referência não resolvida e motivo.                                                                                                                                                                                   |
| Rename/cópia/exclusão/troca de tipo                                  | Mapeia caminhos antigos/novos e consumidores disponíveis; global. Ausência de manifesto anterior é explícita.                                                                                                                    |
| Manifesto/validador/reporter/planejador/testes/configuração/workflow | Global. Manifesto inválido não produz candidato válido.                                                                                                                                                                          |
| Código sem inventário/seleção executável                             | Erro, nunca aprovação de seleção vazia.                                                                                                                                                                                          |

A implementação R1 usa Acorn 8.16.0, declarado como dependência de desenvolvimento exata,
reutilizando o pacote já instalado. Não avalia JavaScript para reconhecer o delta. São admitidas
alterações em folhas de dados estáticos dos campos `titulo`, `subtitulo`, `resumoFinal`, `questoes`
de objetos passados aos registradores conhecidos. Toda a AST executável precisa permanecer
idêntica. Chaves de identidade/armazenamento, tipos de atividade, layout e referências de assets
são protegidos; funções, getters, spreads, expressões, mudanças de estrutura/comprimento e
novos módulos não passam por essa prova. Apenas Questionários e cena de Matemática têm o suporte
inicial necessário para R1; outros formatos permanecem conservadores. Caminho em `revisoes/`,
cadastro ou import isolado não comprovam integração declarativa.

O SVG R2 aceita somente formas/tags/atributos de uma gramática fechada, consumindo o arquivo todo.
Scripts, CSS, texto/entidades, links, eventos, paint externo, mudanças de geometria e qualquer token
não reconhecido falham na prova. O índice de assets/CSS não foi completado: o manifesto atual
registra `assets-calculados`, que continua provocando global quando concreto. Não retirar essa
lacuna para obter recorte. As fixtures R2 demonstram uma unidade sintética com consumidores finitos
explícitos e sem essa lacuna; não são uma certificação de assets reais.

## Contratos frequentes e limites por motor

A lista explícita `CONTRACT_POLICY` resolve arquivos/padrões existentes de `manifesto.contracts`:

| Motor                           | Contratos exigidos pelo planejamento                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Questionários                   | cadastro, recuperacao, limpeza-sessoes                                                                |
| Inglês                          | cadastro, persistencia, reversibilidade, audio-cancelamento, pre-requisitos, responsavel              |
| Cena de Matemática              | cadastro, pontuacao-edicao, storage-adverso, trocas, mosaico, subitens                                |
| Leitura                         | cadastro, audio-leitura, pdf-integridade, pdf-privacidade                                             |
| Operações e três fluxos legados | cadastro como representante de catálogo; isso não fornece prova para recorte de seus estados próprios |

R2 acrescenta `acessibilidade`. Um fallback global inclui os representantes de todos os contratos
disponíveis. Representante obrigatório sem correspondência amplia para global; erro de integridade
do manifesto invalida o plano. O JSON registra referências, IDs lógicos resolvidos, motores, motivo
de inclusão e limites originais. Cadastro/acessibilidade são contratos de catálogo/UI e não
estabelecem equivalência de armazenamento. Representantes de estado são específicos do motor e da
preparação que realmente executam; não são testes universais.

A granularidade inicial é **arquivo inteiro**, inclusive quando um representante resolve um único
caso. A associação `file-conservative-superset` não afirma que cada caso cobre todas as revisões ou
capacidades agregadas. Os testes originais não foram encurtados.

## Comparação com a global e projeções

A comparação exige fingerprints de fontes e manifesto compatíveis, identidade estável no início/fim,
relatório completo, inventário atual integral e consistência das tentativas. Relatório direcionado,
caso proposto ausente, execução pulada/não realizada/interrompida, identidade divergente ou erro de
associação impede conclusão. Falhas de casos omitidos, inclusive tentativas em casos flakey, são
listadas. Uma global verde não comprova segurança estatística de recorte algum.

Os dois descritores de manifesto precisam ser objetos com `schemaVersion: 1`, versão numérica
`x.y.z` e fingerprint SHA-256 hexadecimal minúsculo de 64 caracteres. Versão e fingerprint devem
coincidir. Ausência unilateral/bilateral, descritor inválido ou divergência gera diagnóstico de
manifesto, `manifestCompatible=false`, comparação inconclusiva e projeção indisponível.

Historicamente, o fingerprint da Etapa 1 cobria uma allowlist de fontes/configurações; não cobria imagens/assets
nem `output/`. Mudanças fora desse escopo ficam em `identityUncoveredPaths` e tornam a comparação
inconclusiva para identidade integral. Não se atribui fingerprint de árvore limpa à worktree dirty.
O plano mantém os arquivos fora do escopo e seus fallbacks; não os oculta para aparentar economia.

Quando os pré-requisitos são satisfeitos, o custo é a **soma observada das durações de tentativas**
propostas/omitidas. Isso é projeção, não previsão de duração seletiva: hooks, inicialização,
encerramento e concorrência podem mudar. `selectiveWallMs` permanece nulo. Quando a identidade ou
completude não puder ser estabelecida, a projeção fica indisponível, com motivo.

## Exemplos e validação

As fixtures de `tests/validacao/planejador.unit.cjs` demonstram sete casos disponíveis:

- R1: seis propostos, um omitido; inclui Alice, dependente Mariana e representantes.
- R2: seis propostos, um omitido; inclui todos os consumidores explícitos e acessibilidade.
- Helper compartilhado ou alcance incerto: global, sete propostos, nenhum omitido.
- Comparação sintética compatível: 70 ms de tentativas globais, 60 ms propostas, 10 ms omitidas.
  São números controlados de fixture, sem equivalência com duração real de uma suíte recortada.

Cada execução do teste de CLI também preserva exemplos JSON sob `tmp/validacao/planejador/`.
Na worktree real, a infraestrutura não commitada das Etapas 1/2 exige global. O comando registra o
diff completo, inclusive os artefatos existentes de `output/`. A comparação real da Etapa 2 foi
inconclusiva pela ausência de tratamento desses artefatos, mesmo com fontes/manifesto compatíveis.

Valide com `test:planejador`, `test:validacao`, `validar:manifesto`, build, formatação, lint,
global final e `git diff --check`, além das regressões aplicáveis da política temática.
Sem execução seletiva na CI, agendamento, coleção histórica ou promoção de maturidade.

## Integração observacional à CI — Etapa 3

O workflow preserva `npm test` sem argumentos, o check obrigatório, Ubuntu, um worker, retries,
timeouts e `fetch-depth: 0`. O adaptador `scripts/validacao/ci-observacional.cjs` reutiliza
`planRepository`, `prepareFixtures`, `identityUsable` e `comparePlan`; não classifica riscos nem
executa testes. O hook é inerte sem `VALIDACAO_CI_OBSERVACIONAL=1`, definido somente na etapa da
global e na conclusão experimental. Não há `continue-on-error` no teste obrigatório.

Ordem da invocação CI:

```text
npm test
  → pretest:e2e: validar manifesto → testes Node → build oficial
  → hook: validar refs → preparar dez PDFs sintéticos → planejar (--list, sem corpos)
  → test:e2e: playwright test integral (servidor revalida fixtures sem sobrescrever)
→ etapa always(): localizar run.json único → comparar → resumo/artefatos
```

Antes do hook, uma checkout nova pode ter identidade incompleta mesmo com plano `valid=true`:
faltam bundle e/ou PDFs. A preparação existente é determinística e não muda bytes já válidos.
Não há segundo build, segundo servidor ou segunda execução Playwright; a descoberta e validação
do planejador continuam usando o contrato existente. O preparo no servidor é idempotente.

PR contra main: base explícita `pull_request.base.sha`, destino `GITHUB_SHA` da versão integrada
efetivamente validada, nunca substituído pelo HEAD da branch de origem. Exige ambos os commits,
ancestralidade da base/HEAD da PR no destino e destino igual à checkout. Push main: `before` e
`after`, com `after=GITHUB_SHA=HEAD`. SHA ausente/zero/inexistente, histórico raso, checkout
divergente e evento não suportado, inclusive `workflow_dispatch`, são inconclusivos. Nenhuma base
é inventada. Valores externos passam por validação e argumentos Git sem interpolação shell.

Antes do plano, o adaptador registra os relatórios já existentes. Na conclusão só aceita um
`run.json` novo diretamente sob `tmp/validacao/<runId>/`, excluindo exemplos aninhados e relatórios
anteriores. Estado de outro `GITHUB_RUN_ID`/`GITHUB_RUN_ATTEMPT` é recusado. Zero/múltiplos
relatórios, erro anterior ao hook, interrupção ou relatório parcial não viram global completa.

Os caminhos estáveis ficam em `tmp/validacao/ci-observacional/`: `estado.json`, `plano.json`,
`plano.md`, `comparacao.json`, `observacao.json`, `indice.json` e `resumo.md`. O índice aponta para
o relatório real e os demais arquivos, sem adivinhar o UUID mais recente. O upload estruturado
existente retém esses resultados por 14 dias. O resumo é anexado a `GITHUB_STEP_SUMMARY`; Markdown
de caminhos externos é escapado. Erros inesperados deixam aviso e `erro.json`, quando gravável.

Resultado da etapa `npm test`, status do reporter, validade do plano, identidade completa e
comparação conclusiva são campos separados. **A3 permanece no planejador**: `valid=true` sozinho
não estabelece comparabilidade. Identidades completas/coerentes e todos os pré-requisitos do
comparador existente são obrigatórios; caso contrário, projeção indisponível. Falha da global
mantém o job falho mesmo quando seus resultados podem ser analisados. Falhas omitidas aparecem
explicitamente. Indisponibilidade experimental não impede o Playwright após o pretest obrigatório.

Exemplos sintéticos reutilizam as fixtures existentes: R1/R2 propõem seis de sete casos, mas o
relatório confrontado contém os sete; alteração compartilhada propõe sete. Uma falha no caso
omitido produz `omitted-failure-observed` e conserva `global.outcome=failure`. Identidade incompleta
produz `inconclusive`, sem projeção. São demonstrações controladas, sem evidência de recorte seguro.

Os nove testes `CI:` cobrem refs Git reais em repositório sintético isolado, merge integrado,
push, SHA ausente/inexistente, histórico raso, ordem de preparo, erro experimental, R1/R2/global,
A3, falha omitida, relatório parcial/divergente/ausente/ambíguo, publicação e hook local inerte.
Não enfraquecem os testes anteriores. A suíte Node passa a 64 casos; Playwright conserva 42
arquivos/571 casos, conferidos pelo manifesto, sem congelar contagens futuras.

A1 continua operacional: qualquer mudança do corpus pode tornar os 29 diagnósticos desconhecidos
até revisão e renovação deliberada do pin, conforme [IDENTIDADE.md](IDENTIDADE.md). Não há exceção
geral de output/tmp. A projeção é apenas soma de tentativas observadas; `selectiveWallMs=null`.
A meta futura de 10–15 minutos permanece experimental e não foi alcançada nesta etapa.

Sem commit autorizado, o modo refs recusa corretamente a checkout local modificada em relação
ao alvo Git. A validação local pode confrontar um plano explícito `worktree` com uma única global
do mesmo snapshot; isso não substitui a futura PR/execução Ubuntu do modo refs integrado.

Correção P1: a compatibilidade Git/checkout reconhece exclusivamente a materialização LF→CRLF
de `.bat` comprovada por atributos da revisão Git e atributos efetivos locais coincidentes.
Os fingerprints brutos continuam distintos e intactos; diferenças substanciais, binários,
atributos divergentes, filtros e regras não suportadas são recusados. A evidência por caminho
fica em `gitInputIdentity.materializedInputs`, com recusas em `materializationErrors`.
Os testes positivos de PR integrada e push usam `refIdentity` real, plano válido e relatório
global sintético completo, sem executar recorte. Contrato detalhado em [IDENTIDADE.md](IDENTIDADE.md).

## Identidade compartilhada — Etapa 2.1

O formato 2 usa a [política comum](IDENTIDADE.md) para entradas públicas em bytes e diagnósticos
com evidência versionada. Os 29 caminhos comprovados aparecem no plano como R0
`verified-diagnostic-output`, mantendo visíveis os produtores e o tratamento. Isso não elimina
o fallback global da infraestrutura das Etapas 1/2/2.1. Entrada prevalece sobre saída; desconhecidos
bloqueiam comparação e projeção. Legados continuam inconclusivos, sem complemento retrospectivo.
