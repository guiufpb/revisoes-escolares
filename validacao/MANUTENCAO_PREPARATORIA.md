# Manutenção preparatória — Etapa 4.3A.4-P

## Manutenção final autorizada e nova coleta integral

Uma rodada posterior autorizou expressamente a manutenção dos pins HTTP/corpus e uma única
global do código corrigido. Os sete deltas, consumidores, 29 capturas, produtores/âncoras,
fontes/bundles, dez REVIEWED e onze entradas portáteis foram revistos novamente. O gate HTTP
executou seis controles Node e requisições reais antes da manutenção. Justificativas e valores
anteriores/novos estão em [IDENTIDADE.md](IDENTIDADE.md), sem alteração de outros campos.
Os 13 candidatos permanecem sem staging. A coleta só começa após os gates e o congelamento;
seu resultado efetivo, duração, procedência e preservação são registrados em
`tmp/validacao/etapa43a4p-pins-final-Sek0ch/`, sem aprovação antecipada nesta anotação.
Não haverá repetição automática em caso de falha, commit ou início de revisão real.

## Correção controlada do HTTP 403 — rodada posterior

A única global descrita abaixo terminou com 220/571 aprovados e 351 falhas. Sua evidência
completa permanece em `tmp/validacao/etapa43a4p-final-tHzG96/`, incluindo 29 capturas e cópia
verificada dos 882 arquivos de diagnóstico. Ela não foi repetida nesta correção.

Uma alteração limitada ao cálculo de caminho em `scripts/identidade-ambiente-local.cjs` remove
`/@fs/` por seu comprimento literal e recompõe a barra POSIX quando necessário, preservando unidades
Windows e ambas as formas POSIX. A junction contribuiu
para expor o erro ao colocar o runtime Vite fora da raiz servida. Sem junction, a rota relativa
normal passava; uma URL absoluta explícita ainda reproduziu o erro. `fs.allow`, os bloqueios
privados e a delegação de caminhos externos ao Vite permanecem idênticos.

Os seis controles novos em `tests/validacao/http-local.unit.cjs` reproduziram quatro falhas antes
da correção e aprovaram todos os casos depois: caminhos Windows/POSIX e dois servidores HTTP
reais com/sem junction, incluindo negativos de privados, arquivos externos e traversal codificado.
Uma asserção adicional reproduziu a falha POSIX de barra única após a troca isolada do índice;
o cálculo final passa nas duas formas POSIX e mantém os negativos correspondentes.
Os 24 cenários existentes de abertura também passaram. A URL exata recusada pela global recebeu
200 no servidor da própria worktree após a correção, mantendo 403 nos recursos privados.

A política permanece byte a byte como no início desta rodada. O pin HTTP e o corpus exigem
manutenção deliberada posterior. São sete deltas acumulados de corpus e treze candidatos de
código/documentação; nenhum diagnóstico é candidato. Os onze candidatos anteriores e as capturas
estão preservados em cópia/hashes na evidência `tmp/validacao/etapa43a4p-http403-7zSKJN/`.
Somente validação direcionada está autorizada nesta rodada; o relatório local registra seus
resultados finais, sem atribuí-los à global reprovada ou iniciar outra global automaticamente.

## Reatestação deliberada e validação final autorizadas

Após a correção de portabilidade, os cinco deltas acumulados de corpus foram efetivamente
revisados, incluindo importadores, leitores e caminhos dinâmicos. O corpus da base foi
reconstruído e reproduz o pin anterior. A revisão individual, hashes/deltas, onze entradas,
sete associações fonte/bundle, dez REVIEWED, produtores e bloqueio HTTP ficam na evidência
local `tmp/validacao/etapa43a4p-final-tHzG96/REVISAO_CORPUS.md` e seus JSONs.
Não se encontrou novo consumidor direto ou indireto das 29 capturas. O campo autorizado da
política passa de `71992435d3eb680f496bc95a572b17c583d90bb108e230ab6a062d2c95922c79`
para `8483576ab4f3eb231186844de613d288d03f6f70a464b28a2fa4fd041f7e9aaf`.
O restante da política 1.1.0/formato 2 permanece idêntico; não houve alteração de código.

Esta anotação antecede o congelamento e a única global autorizada. Não declara sucesso antes
da execução: o relatório final e as identidades de início/fim serão gravados somente na
evidência local, preservando os bytes versionados durante e após a coleta. As 29 capturas ainda
não existiam nesta worktree; esse estado é admitido explicitamente pela política. Não foram
importadas capturas de outra cópia. O gate exige identidade utilizável, todos os caminhos
reconhecidos como diagnósticos e zero desconhecidos; a global deverá produzir seus artefatos.

O lote candidato passa a onze arquivos: os nove da preparação abaixo, mais
`validacao/identidade-politica.json` e `validacao/IDENTIDADE.md`. Não há staging ou commit.
Os registros seguintes documentam as fases anteriores; suas pendências e resultados históricos
não certificam o snapshot final. A consolidação Git continua aguardando autorização específica.

Base local confirmada: `4d769c2f3867315e2c163405a22dd0789cc278e1`.
Trabalho isolado na branch técnica `codex/etapa43a4p-manutencao`, criada nessa base.
Checkout habitual, implementação consolidada, worktrees anteriores, output, stashes e evidências
anteriores preservados. Dependências existentes reutilizadas por junction local, sem instalar
pacotes ou alterar lockfile. Não houve criação de revisão escolar, experimento, commit, push,
PR, merge, publicação, alteração de main ou execução seletiva.

## Correções e arquivos

| Arquivo                                                                      | Efeito                                                                                                                                                                                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/ambiente-interativo.spec.js`                                          | Valida o manifesto antes de conferir o registro observado no navegador; acrescenta perfil à projeção; mantém asserções específicas e elementos existentes.                                      |
| `tests/validacao/helpers/registro-contrato.cjs`                              | Preserva as três asserções de total/unicidade com o total atual do manifesto; compara todas as identidades ID/perfil/chave; exige todas as identidades/chaves históricas e seu digest imutável. |
| `tests/validacao/helpers/adicao-fixture.cjs`                                 | Lê o snapshot JSON versionado e confere hashes por entrada, dez REVIEWED e selo fixo do conjunto; não executa Git nem renova hashes.                                                            |
| `tests/validacao/manutencao-preparatoria.unit.cjs`                           | Mantém o contrato central e amplia para 31 controles sintéticos, incluindo portabilidade, integridade e recusa de base Git real incompatível.                                                   |
| `validacao/ADICAO_INTEGRADA.md`                                              | Documenta o snapshot portátil e os limites para adições sucessivas.                                                                                                                             |
| `documentacao/ambiente-interativo/infraestrutura/TESTES_E_VALIDACAO_REAL.md` | Atualiza o contrato central e registra os gates adiados.                                                                                                                                        |
| `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`              | Registra a capacidade preparatória e suas pendências.                                                                                                                                           |
| `validacao/MANUTENCAO_PREPARATORIA.md`                                       | Este relatório.                                                                                                                                                                                 |
| `tests/validacao/fixtures/adicao-base.json`                                  | Snapshot novo com onze entradas, seus hashes individuais e metadado da origem; conferido pelo selo fixo do helper.                                                                              |

Acrescentado nesta correção: `tests/validacao/fixtures/adicao-base.json`, único arquivo de dados
com as onze entradas originais. O conjunto final tem nove arquivos candidatos, sem staging.
`tests/ambiente-interativo.spec.js` e `registro-contrato.cjs` permanecem byte a byte como antes
da correção de portabilidade. Os outros seis arquivos anteriores foram preservados e atualizados
somente onde necessário, com cópias anteriores na evidência local.

O teste não usa `>= 66` nem troca um teto literal por outro. O manifesto é validado pelo
validador existente, incluindo schema, observação das fontes, referência histórica com digest,
consumidores, âncoras e descoberta completa. Essa descoberta apenas lista testes: não executa
a global. O contrato compara os conjuntos completos; uma substituição com contagem igual falha.
Mesmo alteração coordenada do manifesto/registro não pode remover ID ou trocar chave histórica.

A fixture fixa somente o cenário de teste. Os dez hashes REVIEWED da prova real, suas âncoras
e consumidores não mudam. A prova continua recebendo a base real do coletor, sem overrides.
Não houve refatoração estrutural, mudança de classificação R0–R4/R1/R2, reporter, comparador,
workflow, política, manifesto, fontes da aplicação ou bundles. O build oficial não gerou delta.

## Controles positivos e negativos

Os 31 controles preparatórios conferem as 66 identidades/chaves observadas; aceitam a 67ª revisão
sintética com lote estruturalmente comprovado; rejeitam divergência de total, remoção,
substituição com total igual, chave histórica alterada, troca de identidade/perfil, IDs/chaves
duplicados e adulteração da referência histórica. Os ensaios de portabilidade usam diretórios
isolados sem repositório ou com `git init` vazio, sem clones ou alternates. O commit original
está indisponível; processos novos têm PATH vazio e proíbem chamadas a subprocessos antes de
importar a fixture. Ambos os perfis continuam estruturalmente comprovados, com identidade
bloqueada, e reproduzem os mesmos mapas apesar de integrações/manifesto posteriores adulterados.
Snapshot ausente, conteúdo alterado, hash incompatível, entrada removida/duplicada e conteúdo
com hash recalculado são recusados. Um coletor real lê uma base Git sintética incompatível e
a recusa antes de VM/discovery, sem usar o snapshot como evidência de integridade.

Dez controles isolados modificam cada superfície REVIEWED da base e exigem recusa específica
de consumidor/âncora não revisado. Outro apresenta as integrações da primeira adição como base
das superfícies da segunda, mantendo o delta de manifesto válido para isolar o gate: os pins
obsoletos continuam recusados. Os controles anteriores de alterações compartilhadas, âncoras,
consumidores, recusa antes de VM/discovery, R1/R2, identidade e composição são preservados.

## Resultados anteriores à correção de portabilidade

| Verificação executada                                                        | Resultado                                                                                                                              |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `adicao-integrada.unit.cjs` e `composicao-atestacao.unit.cjs`                | 88 controles existentes aprovados, incluindo recusas REVIEWED, consumidores, âncoras, pins obsoletos e bloqueio antes de VM/discovery. |
| `manutencao-preparatoria.unit.cjs`                                           | 21/21 aprovados no reteste final, em 3,5 s.                                                                                            |
| `planejador`, `manifesto`, `identidade`, `coleta` e `atestacao-textual` Node | 110/110 aprovados, em 84,8 s; inclui provas R1/R2 e sua integração observacional.                                                      |
| Playwright central: `carrega a tela inicial e registra todas...`             | 1/1 aprovado, em 8,9 s, porta 5191, um worker, raiz/origem confirmadas, sem reutilizar servidor.                                       |
| `npm run validar:manifesto`                                                  | Aprovado: 66 revisões, 42 arquivos, 571 casos atuais/históricos e 8 lacunas explícitas.                                                |
| `npm run build`, `npm run format:check`, `npm run lint`                      | Aprovados; bundles gerados somente pelo build oficial.                                                                                 |
| `git diff --check` e auditoria de caminhos preservados                       | Aprovados; nenhum delta de aplicação, infraestrutura da prova, manifesto, política, workflow ou dependências.                          |

São 219 controles Node aprovados em recortes: 198 existentes e 21 novos. A primeira rodada
dos três arquivos de adição/composição/preparação registrou 107/109: os dois erros eram nos
ensaios novos, corrigidos e retestados (array vindo da VM e isolamento do gate REVIEWED diante
de outro erro de manifesto anterior). Nenhuma asserção da prova foi reduzida. A primeira
invocação Playwright não encontrou testes porque o filtro ancorado não correspondia ao título
completo usado pelo runner; o filtro corrigido selecionou exatamente um teste, que passou.
Os logs dessas tentativas também foram preservados.

Logs locais ficam em `tmp/validacao/etapa43a4p-*`, sem reutilizar evidências anteriores.
O reporter existente produziu somente evidência direcionada; não comprova identidade global
utilizável nem reatesta os diagnósticos. A anotação final deste relatório é posterior aos testes
direcionados; não se atribui a ela o fingerprint capturado nessa execução. Global integral,
uso infantil, audição humana e execução Ubuntu não foram realizados nesta tarefa.

## Portabilidade do snapshot e integridade

A dependência anterior de `git show 4d769c2:CAMINHO` foi eliminada. O checkout com
`fetch-depth: 0` não garantia a presença desse commit após squash merge ou numa instalação
sem seu histórico; nenhuma alteração de workflow foi necessária para corrigir a fixture.
O loader lê somente dados estáticos, usando o parser JSON estático já existente, sem eval/VM.
`sourceCommit` registra a origem descritiva e nunca é resolvido durante a execução.

Na preparação única autorizada, as onze entradas foram extraídas do objeto original. A
conversão UTF-8 de ida e volta foi comparada por Buffer com os bytes originais, e as dez
superfícies foram conferidas contra os hashes REVIEWED preexistentes. Total: **650.639 bytes**
de conteúdo original. O manifesto preserva SHA-256
`a39b5cbbfee34f6bdcdc9078f18854dbc28b4f46cf720cc92d15d44f97406b17`.

Cada entrada guarda caminho, texto UTF-8 e SHA-256 dos bytes. O loader confere onze entradas,
caminhos únicos, hashes individuais e as dez expectativas da prova. O selo fixo independente
no helper, SHA-256 de `JSON.stringify(snapshot)`, é
`c475bbffe07fffc5efd1c905f5be0b7f5c18e13c1d6074b83848338e0c517cdf`.
Ele inclui todos os dados e o manifesto, impedindo aprovar adulteração pelo simples recálculo
dos hashes dentro do JSON. Esse selo inicial é exclusivo da fixture; nenhum pin preexistente
de identidade ou REVIEWED foi alterado. Não há gerador versionado de renovação automática,
fallback para Git/checkout ou cache que esconda alterações posteriores no snapshot.

O snapshot contém somente fontes públicas e metadados já versionados, sem bytes de PDFs,
capturas, OCR, credenciais ou documentos privados. Os textos .js/.html/.css são strings de
dados dentro do JSON, sem módulos duplicados executáveis. Não é conteúdo escolar novo. O
coletor real e a prova continuam recebendo seus próprios bytes da base/alvo, sem importar o helper.

A evidência local desta rodada fica em `tmp/validacao/etapa43a4p-portabilidade-ouSv9P/`:
cópias dos oito arquivos anteriores, extração com todos os onze hashes, comparações posteriores
e logs. `extracao-conferida.json` registra a extração autorizada; `conferencia-final-snapshot.json`
confirma novamente as onze igualdades byte a byte após formatação, os dez REVIEWED e os dois
arquivos de código anteriores que permaneceram intactos. O único invólucro JSON tem 694.363 bytes.
Resultados da rodada anterior acima não certificam este novo snapshot.

## Resultados da correção de portabilidade

| Verificação                                                                                                                | Resultado                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `node --test tests/validacao/manutencao-preparatoria.unit.cjs`                                                             | **31/31**, 8,2 s, incluindo Git ausente/mínimo, subprocessos proibidos, integridade, coletor Git real incompatível e dez controles negativos REVIEWED. |
| Sete arquivos Node existentes: adição integrada, composição, planejador, coleta, identidade, atestação textual e manifesto | **198/198**, 91,5 s, incluindo positivos/negativos anteriores, R1/R2, âncoras, consumidores, pins obsoletos e bloqueio antes de VM/discovery.          |
| `npm run build`                                                                                                            | Aprovado; sem delta nas fontes da aplicação ou bundles rastreados.                                                                                     |
| `npm run format:check` e check adicional de `tests/validacao/fixtures/adicao-base.json`                                    | Aprovados; o snapshot é verificado explicitamente, pois o comando vigente não cobre esse glob JSON.                                                    |
| `npm run lint`                                                                                                             | Aprovado.                                                                                                                                              |
| `npm run validar:manifesto`                                                                                                | Aprovado: 66 revisões, 42 arquivos, 571 casos e 8 lacunas explícitas. Apenas descoberta/listagem Playwright, sem execução de casos.                    |
| Conferência de bytes, caminhos preservados e `git diff --check`                                                            | Aprovados; prova real, coletor, política, manifesto, workflow, dependências e aplicação sem alterações.                                                |

**229 controles Node aprovados em recortes**, sem falhas, retries, skips ou repetição da global.
Não houve execução Playwright nesta correção, reatestação real, atualização de
`diagnosticAudit.corpusSha256`, staging, commit da worktree ou publicação. Os testes Git criam
objetos somente em repositórios sintéticos temporários, conforme o harness existente; não
consolidam o projeto. Logs anteriores e desta rodada foram preservados separadamente.
Os hashes individuais e o selo inicial do snapshot não são autorização para renovar a política.

## Corpus, identidade e manutenção posterior

Todos os deltas acumulados que alteram o corpus são quatro arquivos de código da tabela
(`ambiente-interativo.spec.js`, `adicao-fixture.cjs`, `registro-contrato.cjs`,
`manutencao-preparatoria.unit.cjs`) e o novo `tests/validacao/fixtures/adicao-base.json`.
Nesta correção, dois CJS anteriores foram modificados novamente e o JSON foi acrescentado.
São cinco entradas `.js`/`.cjs`/`.json` nos namespaces da política 1.1.0. Os quatro
Markdowns alteram as entradas brutas, mas não o corpus de atestação, conforme o filtro vigente.
Não há delta de aplicação, bundle, manifesto, produtores, bloqueio HTTP ou superfícies REVIEWED.
Nenhum pin ou hash esperado preexistente, nem `identidade-politica.json`, foi atualizado;
o selo da fixture é uma nova expectativa estática de teste. Não houve reatestação.
O corpus alterado exige manutenção deliberada antes de tratar a identidade como utilizável.
Resultados direcionados verdes não atestam os 29 diagnósticos nem certificam uma global.

Procedimento mínimo, somente após autorização específica:

1. Congelar o código e enumerar os cinco deltas de corpus contra esta base; examinar seus leitores
   diretos/indiretos, inclusive o novo JSON, loader, Git/VM/discovery e importações novas, sem transformar diagnósticos
   em entradas. Conferir os 29 caminhos, produtores, âncoras, bloqueio HTTP e dez REVIEWED intactos.
2. Seguir `IDENTIDADE.md` para revisar deliberadamente o corpus e manter somente o campo admitido
   da política, com evidência separada. Não usar o compositor para absorver esta manutenção de
   infraestrutura: seu contrato estrutural de adição continua fechado.
3. Preparar fixtures sintéticas oficiais, conferir fonte/bundle, formatação, lint e diff e produzir
   evidência/identidade próprias pelo procedimento vigente. Não copiar PDFs privados ou capturas
   de outras worktrees para alegar produção nova. Exigir identidade utilizável, 29 diagnósticos
   reconhecidos e zero desconhecidos; resolver qualquer bloqueio antes da validação final.
4. Congelar todos os arquivos candidatos e executar uma única vez `npm test` integral, sem filtros,
   reutilizando seu pretest oficial para manifesto, Node e build, com origem/raiz confirmadas e
   um worker. Exigir os 571 Playwright, guardar resultado final e conferir identidade/estabilidade
   no início e fim. Não editar durante a coleta nem repetir automaticamente uma global em falha.
5. Somente com autorização de consolidação Git, conferir o destino e preservar lotes alheios.
   A futura PR mantém a global Ubuntu e seu check obrigatório. Testes Windows de launcher/abertura,
   quando exigidos na validação final, usam os harnesses existentes com portas livres.

## Primeira e segunda adições consecutivas

A primeira adição legitimamente cadastrada deixa de falhar no teste central por ser a 67ª;
manifesto e integrações ainda precisam satisfazer seus contratos completos. A fixture continua
exercitando o cenário revisado mesmo depois dessa adição na checkout.

A segunda adição também não exige aumentar manualmente o teste histórico: os totais atuais
acompanham o manifesto validado. Os testes da infraestrutura permanecem independentes da última
revisão adicionada. Porém, a prova real recusará uma base cujas quatro integrações mudaram os
hashes REVIEWED após a primeira adição. Resolver esse gate exige revisão deliberada separada de
superfícies/consumidores, manutenção da infraestrutura e identidade e validação integral, conforme
`COMPOSICAO_ATESTACAO.md`; esta tarefa preserva essa recusa e não autoriza atualizar seus pins.

Reatestação e validação integral foram autorizadas posteriormente, conforme a anotação inicial;
seus resultados finais ficam na evidência local. Consolidação Git aguarda autorização específica.
