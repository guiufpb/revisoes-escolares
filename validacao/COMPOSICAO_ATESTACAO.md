# Composição de adição e atestação — Etapa 4.3A.3

`adicao-atestacao-composta-v1` compõe duas evidências independentes: a prova estrutural
`questionarios-adicao-integrada-v1` e um registro explícito de manutenção deliberada
`manutencao-deliberada-atestacao-v1`. Não renova pin, não prova equivalência de arquivos novos,
não executa corpos de testes e não autoriza seleção. R0–R4, R1/R2, política 1.1.0/formato 2,
manifesto, reporter, comparador, workflow e global obrigatória conservam seus contratos.

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
