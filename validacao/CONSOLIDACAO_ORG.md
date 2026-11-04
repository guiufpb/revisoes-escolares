# ORG.9A — consolidação técnica e entrega Git delimitada

Revisão em 03/11/2026, na branch `codex/org-6a-integracao-evidencias`, HEAD
`dfa1b0afb99c8ccd4db3f179fd89a6b9f6922a20`. ORG.4D integra esse commit; ORG.5A–ORG.8C
continuam alterações locais sem commit/publicação. As refs locais `main=e388649`
e `origin/main=dfa1b0a` são distintas; não houve fetch ou confirmação remota nova
nesta etapa. Revalidar a base remota na futura integração, sem presumir publicação
das alterações locais ou atualizar outras worktrees implicitamente.

Worktree existente adequada, demais worktrees/stash preservados e staging vazio.
Esta etapa só acrescenta este relatório e a entrada no inventário de implementações.
Não altera código, contratos, testes, dependências, executor, CI ou ambiente escolar.
Não executa testes físicos, leitura de registros privados ou limpeza de recursos.

## Revisão objetiva da cadeia

| Camada | Contrato e limite conferidos                                                                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ORG.4D | Inventário por recursos explícitos; metadados/Git somente de leitura, recusas e resultados parciais. Sem conteúdo, consumidores ou conclusão de dispensabilidade. Código/teste já em HEAD.                                      |
| ORG.5A | Registro v1 privado, UUID v4, limites e duplicados; projeção de declarações sem textos/caminhos privados. Envelope v1 independente do schema completo. Schema e validação semântica são complementares.                         |
| ORG.6A | Adaptador puro da saída ORG.4D conhecida, com contexto explícito. Mantém procedência, desconhecidos e recusas. Não invoca coletor ou faz IO/Git/relógio.                                                                        |
| ORG.6B | Somente `synthetic-counter-v1`: receita, produtor fechado, IDs/escopos, regenerações e liberação do verificador. Quatro estados, códigos e lacunas; não autentica arquivos reais.                                               |
| ORG.7  | Simulador puro reutiliza o classificador; bloqueia identidades/escopos duplicados, conta resultados efetivos e mantém espaço real recuperável desconhecido.                                                                     |
| ORG.8A | Criação exclusiva em perímetro novo próprio, handles retidos, IDs exatos, bytes/SHA-256/tamanho, duas regenerações físicas e consumidores fechados. Quarentena/restauração por nomes fixos no mesmo diretório, sem sobrescrita. |
| ORG.8B | Âncora independente do executor e do alvo conserva handles e recibo privado em memória. Morte real do executor permite reidentificação e grant novo de uso único; perda da âncora bloqueia adoção.                              |
| ORG.8C | CLI local exige iniciar o demo, selecionar o único recurso e confirmar frase da seleção atual. Pipe/default/EOF/replay não autorizam. Revalidação física delegada à ORG.8B.                                                     |

`complete`, `ignored`, `absent`, `directory-contents-unverified` e `recognized`
não autorizam manutenção. `cleanupAuthorization=none` permanece nos contratos
ORG.6B/ORG.7 e no relatório do fluxo. Os intents físicos são separados, limitados
ao recurso criado pelo harness, e não ampliam as declarações históricas.

A análise dos imports confirma o sentido das dependências: o adaptador não importa
o inventário; classificador/simulador não importam o leitor; somente a orquestração
física liga o inventário às operações. Não há referências aos novos módulos nos
fontes HTML/JS do ambiente escolar. `package.json`, lockfile, configuração Playwright,
workflow e código/teste ORG.4D permanecem iguais a HEAD; nenhuma mudança rastreada
em revisões, controladores, cadastro, CSS, progresso ou materiais escolares.

### Achados e limites efetivos

Não foi encontrada divergência funcional nova na revisão delimitada. Duas questões
concretas precisam acompanhar a entrega:

- Há **29 PNGs não rastreados em `output/`**, sem regra geral de ignore para a pasta.
  São previews/assets/diagnósticos alheios ao lote ORG; não foram abertos, modificados
  ou incluídos na seleção. Inventário nominal local em `tmp/org9a-inventario-local.json`.
  `git diff --stat` sozinho também não mostra os 27 arquivos novos do lote anterior.
- O uso humano real da CLI continua pendente. Streams sintéticos com respostas
  roteirizadas comprovam as condições do fluxo, não uma confirmação humana observada.

Limites anteriores, já documentados e conferidos no código:

- Leitor de registros usa leitura limitada, `lstat`, `fstat` e `O_NOFOLLOW` quando
  disponível; não oferece snapshot atômico contra troca hostil de caminhos nem
  certifica tags exóticas de reparse por Node. Destina-se a diretório privado confiável.
  A leitura pode atualizar atime pelo filesystem; isso não é chamada de escrita.
- Backends físicos exigem Windows 64 bits, Python padrão, volume local fixo NTFS
  e `tmp` já existente. Arquivo exclusivo e diretórios próprios têm handles/travas
  retidos. Não há fallback para movimentação entre diretórios, volumes ou por
  caminhos arbitrários. Concorrência não controlada ou metadados insuficientes bloqueiam.
- Quarentena é outro nome no mesmo recipiente, não pasta isolada por ACL. IDs são
  serializados sem perda; timestamp não prova propriedade. `ReplaceIfExists=false`
  protege contra colisões inclusive depois das verificações anteriores.
- Recuperação exige continuidade dos handles na âncora viva. Recibo, JSON, UUID,
  nome ou digest do alvo não autenticam adoção após perda da âncora. Não há retomada
  depois de fechar todos os processos ou reiniciar o computador, transação atômica
  journal/rename ou proteção contra administrador/kernel hostil.
- Criação real de symlink de arquivo foi recusada pelo Windows sem elevação;
  junction real e guard de reparse foram testados. CI Ubuntu não executa as operações
  físicas Windows: sua aprovação futura não substituirá a evidência local nativa.
- As verificações de ausência de consumidores são do universo fechado do harness;
  não demonstram ausência de consumidores externos de arquivos reais. O TTY exige
  interação, mas não autentica uma pessoa contra controle hostil do console/código.

## Lista explícita do futuro commit

**31 arquivos: 12 de código/contratos, 9 de testes/fixtures e 10 de documentação.**
São os 30 caminhos ORG.5A–ORG.8C já pendentes e este relatório ORG.9A.
Todos são texto versionável; três arquivos rastreados modificados e 28 novos.
Não há staging realizado. Não incluir diretórios inteiros por conveniência.

### Código e contratos — 12

| Caminho                                                    | Origem/capacidade                           |
| ---------------------------------------------------------- | ------------------------------------------- |
| `scripts/validacao/registro-worktrees.cjs`                 | ORG.5A, leitor/validador privado            |
| `scripts/validacao/evidencia-organizacao.cjs`              | ORG.5A, semântica do envelope independente  |
| `validacao/registro-worktree.schema.json`                  | ORG.5A, estrutura de registro v1            |
| `validacao/evidencia-organizacao.schema.json`              | ORG.5A, envelope v1                         |
| `scripts/validacao/inventario-evidencias.cjs`              | ORG.6A, adaptação pura                      |
| `scripts/validacao/harness-temporario-sintetico.cjs`       | ORG.6B, receita/corpus fechado em memória   |
| `scripts/validacao/classificador-temporario-sintetico.cjs` | ORG.6B, reconhecimento conservador          |
| `scripts/validacao/simulador-sintetico.cjs`                | ORG.7, simulação pura                       |
| `scripts/validacao/harness-fisico.cjs`                     | ORG.8A/8B, orquestração e capacidades vivas |
| `scripts/validacao/harness-fisico-win.py`                  | ORG.8A, primitivas privadas Windows         |
| `scripts/validacao/harness-recuperacao-win.py`             | ORG.8B, âncora e executor descartável       |
| `scripts/validacao/recuperacao-assistida-cli.cjs`          | ORG.8C, fluxo interativo                    |

### Testes e fixtures sintéticas — 9

| Caminho                                                       | Origem                                              |
| ------------------------------------------------------------- | --------------------------------------------------- |
| `tests/fixtures/registro-worktree-sintetico.json`             | ORG.5A, conteúdo fictício sem registros reais       |
| `tests/validacao/registro-worktrees.unit.cjs`                 | ORG.5A; manutenção de injeção de inode ORG.7        |
| `tests/validacao/inventario-evidencias.unit.cjs`              | ORG.6A                                              |
| `tests/fixtures/temporarios-sinteticos.cjs`                   | ORG.6B, corpus em memória reutilizado               |
| `tests/validacao/classificador-temporario-sintetico.unit.cjs` | ORG.6B                                              |
| `tests/validacao/simulador-sintetico.unit.cjs`                | ORG.7                                               |
| `tests/validacao/harness-fisico.unit.cjs`                     | ORG.8A, somente fixtures físicas novas              |
| `tests/validacao/harness-recuperacao.unit.cjs`                | ORG.8B, somente fixtures físicas novas              |
| `tests/validacao/recuperacao-assistida-cli.unit.cjs`          | ORG.8C, streams sintéticos e novas fixtures físicas |

### Documentação — 10

| Caminho                                                                                 | Alteração pertinente                                                 |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`                         | Entradas e resultados ORG.5A–ORG.9A                                  |
| `documentacao/ambiente-interativo/infraestrutura/WORKTREES_CATALOGO_E_ENTREGA_LOCAL.md` | Referência ao registro auxiliar ORG.5A, sem alterar catálogo privado |
| `validacao/INVENTARIO_SEGURO.md`                                                        | Referências ORG.5A e ORG.6A, CLI ORG.4D intacta                      |
| `validacao/REGISTRO_WORKTREES.md`                                                       | ORG.5A                                                               |
| `validacao/INTEGRACAO_EVIDENCIAS.md`                                                    | ORG.6A                                                               |
| `validacao/CLASSIFICADOR_SINTETICO.md`                                                  | ORG.6B, referência ORG.7                                             |
| `validacao/SIMULACAO_SINTETICA.md`                                                      | ORG.7, referência ORG.8A                                             |
| `validacao/HARNESS_FISICO.md`                                                           | ORG.8A, referência ORG.8B                                            |
| `validacao/RECUPERACAO_ASSISTIDA.md`                                                    | ORG.8B/8C, uso/limites e resultados                                  |
| `validacao/CONSOLIDACAO_ORG.md`                                                         | ORG.9A, este relatório/lista delimitada                              |

### Permanecem locais e fora da seleção

| Recursos                                                                                             | Tratamento                                                                             |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `tmp/org*-*.log`, arquivos `.exit`, snapshots e baselines `tmp/org*-*.json`                          | Evidências anteriores preservadas, não versionar                                       |
| `tmp/org8a-*/` e fixtures/probes físicos                                                             | Conteúdo sintético, journals e estados interrompidos preservados; não adotar ou apagar |
| `tmp/org6b-*`, `tmp/org7-*`, `tmp/org8a-*`, `tmp/org8b-*`, `tmp/org8c-*-artifacts/`                  | Logs/traces/artefatos locais, inclusive falhas originais                               |
| `tmp/validacao/`, `test-results/`, `playwright-report/`, `blob-report/`                              | Diagnósticos/resultados locais; não compõem o commit                                   |
| `tmp/org9a-inventario-local.json`, `tmp/org9a-entrega-delimitada.json`                               | Inventário nominal/hashes de revisão desta máquina, fora do Git                        |
| 29 PNGs não rastreados sob `output/`                                                                 | Alheios a ORG; não versionar com este lote, mesmo sem ignore                           |
| PDFs, registros privados reais, catálogo `MINHAS_REVISOES_LOCAIS`, dados/progresso, prompts pessoais | Não abrir/adotar/copiar/incluir na entrega                                             |
| `node_modules/`, caches, bundles/previews gerados e temporários                                      | Dependências/artefatos, não adicionar; não presumidos dispensáveis                     |
| Stash e arquivos de outras worktrees                                                                 | Preservados, sem integração implícita                                                  |

O inventário local inicial separa os 30 candidatos e os 29 PNGs. A seleção final de
31 caminhos possui hashes em `tmp/org9a-entrega-delimitada.json`. Inspeção dos candidatos
não encontrou arquivos binários, credenciais literais reconhecíveis, caminhos de
usuário reais ou material sincronizado privado; os exemplos e fixtures são sintéticos.
Essa verificação delimitada não é certificação universal de ausência de segredos.
As regras existentes ignoram tmp/test-results/node_modules e logs; não existe ignore
geral de output. Não houve alteração de ignore ou uso de staging amplo para compensar.

## Evidências de validação conferidas

ORG.8C: `tmp/org8c-global.exit=0`, **633/633 Node e 638/638 Playwright, 45,5 min**,
sem falhas/retries/skips. Direcionados: **225/225**, incluindo 35 novos. Build,
format:check, lint, sintaxe Python e diff aprovados nessa composição.

Os hashes de todos os fontes/esquemas/testes acumulados coincidem com a baseline
ORG.8C; no snapshot global só mudaram as duas anotações documentais de resultados
já declaradas. O trace original ORG.6B conserva seu SHA-256. As falhas anteriores
e suas correções permanecem descritas nos documentos temáticos e nos logs locais;
não se apagou evidência nem se enfraqueceram testes nesta etapa.

ORG.9A não modifica código nem executa funcionalidades físicas. Por isso não repete
build, testes físicos ou suíte global para produzir este relatório; confere hashes,
escopo Git, links/listas, formatação documental e `git diff --check`. A futura PR
continua sujeita à global obrigatória de CI e à base efetivamente integrada.

### Roteiro humano curto, ainda não executado

Em terminal Windows 64 bits/NTFS local, Python disponível e tmp da worktree existente,
sem pipe/redirecionamento, executar na raiz da worktree:

```text
node scripts/validacao/recuperacao-assistida-cli.cjs --demo
```

1. Primeira execução: ler o aviso e digitar a frase inicial somente para criar um
   cenário novo próprio. Conferir recurso/escopo/IDs/estado e selecionar o ID exato.
   No prompt de restauração, digitar `cancelar`; esperar `cancelled`, sem tentativa
   de restauração. O arquivo permanece em quarentena; fechar encerra a âncora.
2. Segunda execução do mesmo comando: outro cenário novo. Selecionar seu recurso
   e digitar manualmente a frase específica exibida, incluindo o desafio novo.
   Esperar `restored`, `source` e `restoration-verified`, sem bloqueio.
3. Registrar somente resultado observado e códigos, sem caminhos privados. Se algo
   divergir, preservar o cenário/log e interromper a validação. Nunca reabrir cenário
   antigo, improvisar restauração, apagar fixtures ou automatizar a confirmação.

Nenhuma dessas operações foi executada na ORG.9A. A validação humana pendente deve
continuar declarada se a infraestrutura for versionada antes dessa demonstração.

## Recomendação para integração Git e próximo objetivo

Lote tecnicamente delimitado para revisão e futuro commit único das 31 entradas,
com título sugerido: `feat(org): adiciona infraestrutura conservadora e piloto sintético reversível`.
Não há autorização de staging/commit/PR nesta revisão. Quando houver autorização
específica, selecionar só os caminhos listados, confrontar nomes/status do index com
a lista, revisar o diff completo incluindo arquivos novos e conferir novamente
privacidade e base remota. Não copiar implementações entre worktrees ou alterar a
checkout escolar habitual para tornar o lote visível. PR futura com CI global;
publicação/merge/atualização local continuam ações separadas.

O ciclo sintético ORG.5A–ORG.8C está suficientemente demonstrado para esse marco,
com as limitações acima. Não criar ORG.8D ou uma fase automática de novos experimentos.

Primeira classe real **candidata a estudo, não a descarte**: a entrada intermediária
`tmp/validacao/<runId>/run.json.tmp`, produzida por `ValidationReporter.write()` em
`scripts/validacao/reporter.cjs`, antes do rename para `run.json`. A origem e a
finalidade de serialização estão demonstradas no código; o reporter é consumidor
durante a publicação, e a execução/diagnósticos podem depender de uma cópia interrompida.
Reexecutar testes não regenera necessariamente as mesmas tentativas, tempos e falhas.

Menor incremento: avaliar **um caminho explicitamente selecionado** e sua possível
cópia final, exclusivamente em leitura, sem descobrir pendências globalmente. Coletar
procedência, identidade/metadados, estado do produtor, consumidores conhecidos e
lacunas. Somente com autorização de leitura do conteúdo, verificar schema/runId e
digest da cópia final para estudar redundância, preservando informações privadas.
Se a cópia final não existir, divergir ou o produtor/consumidor estiver indeterminado,
manter a hipótese de evidência histórica única. Ausência/idade/nome/tmp/ignored não
comprovam encerramento, regenerabilidade ou dispensabilidade. Nenhum exemplar real
dessa classe foi inspecionado e nenhuma classificação/limpeza real foi iniciada aqui.

## Continuidade ORG.9B

O diagnóstico acima registra o estado histórico da ORG.9A. Após integração pela PR #64,
a ORG.9B encerrou duas buscas históricas delimitadas sem localizar o intermediário.
Uma única experiência autorizada com o reporter original produziu um par fictício
por falha física no rename. O incremento de leitura e seus limites estão em
[Avaliação do par do reporter](AVALIACAO_PAR_REPORTER.md). A experiência foi preservada,
sem repetição, e a igualdade observada não concede autorização de limpeza.
