# Composição de adição e atestação — Etapa 4.3A.3

## Fase 5C.3C — revisão de base e manutenção escolar local

O registro explícito existente, seu loader, selagem de bytes e guard de estabilidade permanecem.
Opcionalmente, para uma base Git posterior, ele acrescenta:

- `integrationBaseContract: questionarios-base-revisada-v1`;
- `integrationBaseReview`: exatamente quatro objetos, na ordem app.entry.js, app.js,
  registro-revisoes.js e index.html, com caminho completo, `sha256` bruto da base e
  `rationale` descritiva com pelo menos 30 caracteres;
- `consumerReview.integrationBaseConsumersReviewed: true`, além da análise descritiva e
  de todos os campos já obrigatórios de revisão de consumidores, spec, corpus e bundle.

Base/árvore reais, dez descritores de superfícies e alvo exato continuam vinculados pelo
registro. A declaração admite apenas esses quatro hashes da base explicitamente revista,
sem alterar REVIEWED; as seis outras superfícies continuam fixas. Não é override livre,
assinatura ou autorização humana automática. Campo incompleto, hash obsoleto, outra base,
consumidores não revistos ou ausência de composição completa impede seleção.
Em duas adições sucessivas, a segunda base precisa de nova revisão explícita com seus próprios
hashes/base/árvore/alvo; o registro anterior é recusado. Não é necessária uma alteração de pins
da infraestrutura a cada adição.

Somente capturas dos 29 caminhos exatos reconhecidos pela identidade, com precedência de entrada
preservada, podem ser separadas da prova escolar. Cada adição diagnóstica deve ser não rastreada,
ausente da base, presente no alvo e coincidir em bytes com a captura de identidade. Conserva
linha própria `role: diagnostic` e hash em `fullChanges` e no plano. Captura desconhecida,
modificada desde a coleta, alteração rastreada ou promoção a entrada é recusada. Não se
ignoram namespaces. Produtores, âncoras, HTTP, corpus e identidade continuam sendo conferidos.

Quando o único delta de política é o pin de corpus deliberadamente mantido, e o restante é
exclusivamente a adição escolar v3 comprovada, a manutenção é parte do mesmo lote local,
conforme a política temática. Não é infraestrutura arbitrária e não aciona global local
por si só. A composição exige ainda as 16 superfícies da infraestrutura inalteradas na base/alvo,
identidade utilizável e fonte/bundle associados, sem reatestação automática.
`infraestrutura-global-v1` continua global e nunca emite capacidade de seleção escolar.
Manutenção isolada sem adição também não recebe essa exceção.

Somente a composição compatível emite evidência interna para o planejador, vinculada ao
delta inteiro e snapshot. Validação/descoberta/estabilidade posteriores podem revogá-la.
Os campos conservadores `executionPolicy: global` dos complementos isolados são preservados.
As limitações históricas abaixo sobre quatro REVIEWED e seleção são superadas apenas por
esta capacidade delimitada. A implementação atual ainda requer revisão deliberada, pin
autorizado, congelamento e global final; não atesta uma revisão real.

## Fase 5B.5 — manutenção restrita da infraestrutura

`infraestrutura-global-v1` é uma capacidade separada dentro do compositor existente, destinada
ao lote pós-PR #49. Reutiliza o plano/fallback R4 e exige `result: global`, inventário integral e
zero omissões. Não executa testes reduzidos, não prova adição escolar nem renova qualquer pin.
Os contratos de adição descritos nas seções históricas abaixo conservam seus critérios.

O escopo é a lista exata `MAINTENANCE_FILES` em `planejador-composicao.cjs`: os seis módulos
de compositor/CLI/CI/planejamento/Git/comparação, os três testes Node de composição/planejador/
identidade e os cinco documentos de composição/identidade/planejador/inventário/política de
testes. Somente modificações de arquivos existentes são admitidas. A política é uma modificação
adicional obrigatória. Revisões, integrações escolares, manifesto, pacotes, motores, produtores,
HTTP, recursos e arquivos fora da lista não podem ser modificados por esta capacidade.

A política deve preservar todos os campos, exceto o pin deliberado de corpus e a inclusão
exata dos dez `PDF_INPUTS` em `rootInputs`. Não admite remoção, duplicação, reordenação dos
elementos anteriores, nova extensão ou expansão de namespace. Os dez arquivos já precisam
existir na base Git, conservar seus bytes binários no alvo e coincidir com a identidade capturada.
As 29 capturas precisam estar presentes e reconhecidas como diagnósticos, com produtores,
âncoras, bloqueio HTTP e prova textual válidos. As capturas não rastreadas que integram o diff
worktree recebem linhas próprias no delta, com `role: diagnostic`, hash atual e ausência na base.
Não são omitidas do lote nem promovidas a entradas.

### Registro explícito local

Reutiliza-se o loader `--attestation-review tmp/validacao/atestacoes/NOME.json`, suas verificações
de bytes/UTF-8/caminho e estabilidade antes de VM/discovery. O registro continua com
`contract: manutencao-deliberada-atestacao-v1`, `schemaVersion: 1` e os campos da revisão
deliberada descritos abaixo. Para esta capacidade exige também:

- `capability: infraestrutura-global-v1`;
- `infrastructure`: as 16 superfícies em ordem, cada uma com `path`, `sha256` da base e
  `targetSha256` do alvo, todas presentes e explicitamente revisadas;
- `pdfInputs`: os dez recursos em ordem, com `path` e `sha256` bruto;
- `changes`: o delta completo, sem duplicações, com hashes anteriores/atuais e justificativas
  individuais; os diagnósticos não rastreados incluem `role: diagnostic`.

Base/árvore/política anteriores, commit/árvore de ancoragem do alvo, fingerprints brutos do
snapshot/corpus/política/manifesto, produtores/HTTP, capturas, bundle e consumidores mantêm os
vínculos existentes. Os cinco caminhos antes `unread` na prova de adição têm hashes nesta lista
fechada de manutenção; isso não muda a classificação da identidade nem amplia a prova escolar.

O registro é declaração de revisão, não assinatura nem autorização independente. Não há comando
que gere aprovação a partir de um plano. Ele deve ser preenchido após revisão efetiva e antes
do planejamento. Fica em `tmp`, fora das entradas/corpus; não contém fingerprint de seu próprio
arquivo ou do resultado que pretende validar. A política é excluída do cálculo do corpus pelo
mecanismo existente, mas continua entrada com bytes/fingerprint brutos. Não há ciclo de hashes.

A infraestrutura alterada é registrada por evidências de manutenção; a exigência de igualdade
das 16 superfícies continua obrigatória para a composição de adição escolar. Os dez descritores
`REVIEWED` também são registrados, mas nesta capacidade os consumidores devem permanecer iguais
entre base/alvo. Pins históricos divergentes não são atualizados nem declarados válidos. A
adição v3 continua recusando esses pins nos contextos em que são exigidos.

### Roteamento, falhas e CI

Uma revisão com a capacidade explícita solicita este contrato. Um lote sem adição, com política
e arquivos da lista, é diagnosticado como tentativa de manutenção; isso não o aprova sem registro.
Adição não aplicável permanece `structuralStatus: unsupported`; o complemento de manutenção
marca `applicability: not-applicable`. A CLI só atribui recusa à adição quando a prova estrutural
realmente retorna `rejected`. Falhas de manutenção apresentam motivo fixo seguro e etapa/código;
exceções inesperadas de parsing não serializam mensagens, stacks ou conteúdo do arquivo.
Plano inválido conserva inventário/proposta indisponíveis e o resumo não imprime omissões zero.

O adaptador GitHub Actions não recebe registro de manutenção: não foi demonstrado um canal
independente de procedência/autorização. A PR não pode fabricar sua própria aprovação. Sem essa
evidência a CI permanece inconclusiva, preservando `npm test` integral e seu resultado obrigatório.
Um registro local `worktree` não autoriza nem representa automaticamente o SHA integrado da CI.

Esta implementação altera corpus e entradas. O pin da 5B.3 permanece intacto nesta fase:
identidade real obsoleta, ausência de revisão final ou qualquer prova incompatível continuam
bloqueando. Os positivos são fixtures isoladas, sem atestar este snapshot. Reatestação,
global final e publicação dependem de autorização posterior e evidência do novo snapshot.

`adicao-atestacao-composta-v1` compõe duas evidências independentes: a prova estrutural
`questionarios-adicao-integrada-v3` e um registro explícito de manutenção deliberada
`manutencao-deliberada-atestacao-v1`. Não renova pin, não prova equivalência de arquivos novos,
não executa corpos de testes e não autoriza seleção. R0–R4, R1/R2, política 1.1.0/formato 2,
manifesto, reporter, comparador, workflow e global obrigatória conservam seus contratos.

A correção 4.3A.4-M versiona somente a prova estrutural interna para v3 (campos com `pergunta`
e questões com `bloco` realmente renderizados). O contrato composto permanece v1: vínculo de bytes,
base representada, manutenção e gates não mudam. Resultados anteriores das provas v1/v2 não se
tornam evidência v3.
A manutenção corretiva altera a própria infraestrutura e precisa ser consolidada como base
real, após reatestação/global especificamente autorizadas, antes de retomar uma adição.

## Delta admitido

O lote completo precisa conter a adição fechada já admitida pela
[prova estrutural](ADICAO_INTEGRADA.md) e uma única modificação da política. O único campo
semântico permitido nessa modificação é `diagnosticAudit.corpusSha256`, com hashes SHA-256
válidos e distintos. JSON é analisado estaticamente; duplicação de propriedades, mudança de
versão, produtores, bloqueio HTTP, classificação de entradas ou qualquer outro campo é recusada.
É possível verificar somente a manutenção, sem adição, quando a política é o único delta.
Isso exige as mesmas evidências; não serve para absorver uma migração da infraestrutura.
Comparações históricas anteriores à existência da política, sem revisão nova nem registro de
manutenção, seguem o caminho R4/global existente; recebem manutenção `not-applicable`,
compatibilidade não estabelecida e identidade complementar bloqueada. Não renovam atestação.

A política é retirada apenas da entrada da prova estrutural, depois de seu delta ser validado.
O relatório composto mantém `fullChanges` com o lote inteiro, inclusive a política. Nenhum
subconjunto bem formado pode autorizar o restante. Arquivos desconhecidos são marcados `unread`
sem leitura de seu conteúdo; seu ingresso impede a aceitação do lote.

## Registro de revisão deliberada

A revisão é fornecida explicitamente por `--attestation-review
tmp/validacao/atestacoes/NOME.json` no comando local de planejamento já existente. O loader
recusa caminhos externos, links, traversal, JSON duplicado, UTF-8 inválido e registros maiores
que 1 MiB. Não procura registros automaticamente. Os bytes são selados por hash e copiados
para `revisao-atestacao.json` junto ao plano. O registro é uma declaração auditável de revisão,
**não uma assinatura criptográfica nem autorização do usuário**. Quem o preenche deve realmente
rever o delta e consumidores indiretos; texto declaratório ou um novo hash não faz essa revisão.

Campos obrigatórios do registro, sem normalização dos fingerprints brutos:

| Campo                                   | Vínculo exigido                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion`, `contract`, `decision` | `1`, `manutencao-deliberada-atestacao-v1`, `reviewed-no-new-diagnostic-consumers`                                   |
| `reviewer`, `reviewedAt`                | Identificação descritiva da revisão e data interpretável                                                            |
| `base`                                  | Commit e árvore Git reais, fingerprint da política anterior e das 16 superfícies da infraestrutura                  |
| `target`                                | Commit/árvore de ancoragem da checkout, fingerprints brutos de entradas, corpus, política e manifesto do alvo       |
| `changes`                               | Todos os caminhos/status/hashes anterior e atual de `sourceRows`, com justificativa individual `rationale`          |
| `producers`, `httpDeny`                 | Descritores integrais da política, com hashes e âncoras conferidos nas fontes inalteradas                           |
| `diagnostics`                           | Os 29 caminhos exatos e `artifactsFingerprint` das capturas do snapshot                                             |
| `reviewedSurfaces`                      | As dez linhas de `reviewedSurfaces`, sem o campo explicativo `maintenance`                                          |
| `consumerReview`                        | `noNewDiagnosticConsumers`, análise, `newTestBodyReviewed`, `bundleOfficialBuildReviewed` e SHA-256 bruto do bundle |

Os booleanos de revisão precisam ser `true`; identificador do revisor, análise e justificativas
precisam conter texto descritivo (mínimo de 30 caracteres). Esses mínimos detectam omissões,
não certificam a qualidade da análise. `sourceRows`, `infrastructureBase` e `reviewedSurfaces`
reutilizam os dados do coletor; não são um gerador de aprovação ou de atualização do pin.

É obrigatório que a identidade existente seja utilizável: corpus coincidente com a política,
entradas e artefatos completos, fontes/bundle associados, produtores e HTTP válidos, procedência
disponível e mesmo fingerprint no alvo e na checkout. As linhas alteradas também precisam
corresponder às entradas brutas dessa identidade. O registro deve coincidir com esse mesmo
manifesto e snapshot. Legados, outro alvo ou metadados isolados não bastam.

## Consumidores, base e hashes REVIEWED

As fontes dos produtores e do bloqueio HTTP precisam ser idênticas na base/alvo e preservar
hashes/âncoras da política. O escopo inicial recusa alterações nesses componentes mesmo com
justificativa: uma mudança legítima exige manutenção separada e nova análise fora desta prova.
Corpos da spec nova exigem revisão explícita. Acorn ainda recusa dependências dinâmicas/nested,
capacidades globais/reflectivas e referências literais privadas, absolutas ou remotas óbvias.
As rotas públicas `/ambiente_interativo/index.html`, `/ambiente_interativo/leitor.html` e
`/__revisoes_local__/identity` são permitidas. O scanner é conservador e pode recusar uma spec
legítima; não é sandbox, análise universal de fluxo nem prova negativa de consumidores.

A base é um commit realmente resolvido pelo coletor existente. As 16 superfícies listadas em
`INFRASTRUCTURE`, incluindo composição, prova, coletor, identidade, manifesto, reporter,
comparador e dependências, devem existir na base e manter os mesmos bytes no alvo. Uma base
sem a infraestrutura implementada recebe `not-represented`. Arquivos locais ou snapshots
ignorados não são apresentados como commits. A atual implementação não commitada não satisfaz
essa condição; a autorização desta etapa não inclui sua consolidação Git.

`REVIEWED` continua fixando as dez superfícies examinadas. A composição exige hashes da base
iguais aos pins existentes e registra separadamente os hashes do alvo. As integrações permitidas
podem mudar quatro dessas superfícies no alvo; seus novos hashes **não viram pins**. Ao usar
essa revisão como base de uma adição seguinte, a prova recusará os pins obsoletos. Será necessária
revisão deliberada das dez superfícies e dos consumidores, alteração separada da infraestrutura,
seus testes e manutenção de identidade. Não existe override no registro nem avanço automático.
Esta limitação reduz o benefício para adições sucessivas e continua como gate explícito.

## Coleta, relatórios e fallback

`planejador-composicao.cjs` faz as verificações estáticas antes de VM/discovery. A CLI verifica
também a estabilidade dos bytes do registro antes de cada observação/listagem executável e
ao fim. `validateRepository` aceita um guard opcional, com comportamento anterior por padrão.
Os controles existentes de estabilidade de fontes e manifesto continuam ativos. Não há snapshot
transacional contra edições concorrentes: a coleta requer checkout estável, conferida nas
fronteiras de observação e no encerramento.

O complemento `composicao-atestacao.json` separa `maintenance`, `compatibility`,
`effectiveIdentity`, `base`, `reviewedSurfaces` e `fullChanges`; conserva
`runtimeEvidence: not-collected` e `executionPolicy: global`. `adicao-integrada.json` permanece
separado. `compatible` significa compatibilidade administrativa/estrutural desse alvo; não
validação funcional, pedagógica ou global. Erro posterior de manifesto/discovery/estabilidade
revoga a compatibilidade. Recusa bloqueia observação executável, gera plano inválido ou mantém
fallback global/inconclusivo. Sem revisão/política alterada, o fluxo estrutural anterior permanece.
O adaptador CI e a suíte obrigatória não recebem opção de manutenção nem nova autorização.
Reporter/comparador continuam exigindo identidade e correspondência exata plano/alvo/global;
não consomem o complemento como dispensa de seus gates.

## Validação e próxima autorização

Os testes `composicao-atestacao.unit.cjs` usam capturas e pins sintéticos em memória; não renovam
a política real nem leem os 29 arquivos reais. Cobre positivos Alice/Mariana e recusas de
política arbitrária, revisão ausente, corpus/fingerprint incompatível, produtor/HTTP, manifesto,
base, `REVIEWED`, consumidor indevido, lote parcial e evidência instável. Fixtures Git/CLI
isoladas e guard de manifesto verificam recusa antes de VM/discovery.

Após estabilização: Node, manifesto, build oficial, format/lint e revisão final. Nesta etapa,
a global adicional é deliberadamente pendente para ocorrer uma única vez sobre o snapshot final
reatestado, mediante autorização. Os 160 Node e 571 Playwright da 4.3A.2 são históricos e não
validam esta mudança. Logs desta etapa ficam em `tmp/validacao/etapa43a3/`.

Para futura manutenção do pin: congelar fontes e build; comparar o corpus inteiro com a última
atestação, incluindo toda infraestrutura da 4.3A.2/3; revisar produtores, consumidores indiretos,
HTTP e capturas; documentar hashes, referências e análise; somente então alterar manualmente
o campo permitido, por autorização específica. Esse lote de migração não será fingido como
adição integrada. Verificar identidade completa e executar `npm test` integral do snapshot
final; gerar plano/global comparáveis apenas com procedência real e base adequada. Alteração
posterior de corpus/entradas exige reavaliar o gate correspondente.

A 4.3A.4 exige autorização própria, base com infraestrutura efetivamente representada,
`REVIEWED` atual, adição integral no escopo, manutenção deliberada quando o corpus mudar,
revisão humana de cobertura/gabarito e global completa do mesmo alvo. Nunca autoriza seleção.
Qualquer divergência conserva global/bloqueio e interrompe o experimento. Reversão da extensão
deve ser localizada em seus módulos/guard/CLI, sem apagar evidências ou restaurar indiscriminadamente
arquivos com alterações anteriores; a política e seus pins não foram modificados nesta etapa.
