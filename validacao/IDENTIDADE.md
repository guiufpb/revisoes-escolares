# Identidade de entradas e artefatos — Etapa 2.1

## Fase 5C.3D — manutenção deliberada da seleção local (21/10/2026)

Revisão autorizada sobre a base `814557ec0762bb4732083edb2586e991be3c588e` reproduziu
o corpus anterior e examinou os seis deltas executáveis/de testes da 5C.3C, seus consumidores
diretos/indiretos, provas de lote/base revisada, bindings e leituras de diagnósticos.
Somente `diagnosticAudit.corpusSha256` é mantido manualmente:
de `0e66647c2bf8a21460d37fb17a797cf456f83f5eb08913f50708b559df3ef48c`
para `e10d6a4aef1754bd4fdb34620ea8e29fc4dad8a073ed78a3592f8e3ee0e9388c`.

As leituras novas de capturas servem exclusivamente a hash/procedência, sem conteúdo ou
oráculo escolar. Produtores/âncoras, HTTP, entradas privadas, classificações, dez REVIEWED e
oito vínculos fonte/bundle permanecem. Os 29 caminhos diagnósticos estão ausentes nesta
worktree antes da global; não foram copiados de outras cópias. A ausência continua explícita.

Reconstrução, hashes individuais, consumidores, justificativas, limitações e preservação das
evidências anteriores ficam em `tmp/validacao/fase5c3d/REVISAO_CORPUS.md` e JSONs associados.
Identidade, congelamento e resultado da única global final são registrados nessa pasta
após cada gate, sem aprovação antecipada nesta anotação. A manutenção da infraestrutura
não usa `infraestrutura-global-v1` nem autoriza piloto escolar, CI seletiva ou publicação.

## Fase 5C.3C — identidade preservada para seleção escolar local

Não há mudança da política 1.1.0/formato 2 nem de seus pins. A identidade utilizável,
os 29 diagnósticos exatos, precedência de entrada, produtores/âncoras, HTTP e vínculos
fonte/bundle continuam obrigatórios. O compositor reaproveita os papéis comprovados para
separar somente adições diagnósticas da prova escolar, mantendo delta e hashes integrais.

A manutenção exclusiva do corpus decorrente da adição v3 completa pode integrar o lote local
conforme [COMPOSICAO_ATESTACAO.md](COMPOSICAO_ATESTACAO.md) e a política temática. Continua
exigindo revisão deliberada do corpus/spec/consumidores e registro vinculado ao alvo;
nenhum cálculo ou teste verde escreve o pin. Outras mudanças de infraestrutura permanecem globais.
O contrato de base revisada das quatro integrações não substitui atestação de identidade.

Esta implementação altera o corpus da infraestrutura. A identidade real poderá ficar
obsoleta até revisão deliberada e autorização específica de manutenção. Nenhum pin foi
atualizado; global final fica para o snapshot congelado com identidade utilizável.

## PR #52 — manutenção após correção dos testes em CI

Revisão deliberada autorizada sobre `870352cb833d8abb0389f3bd4d8f0ca281f36477`
reproduziu o corpus anterior e identificou somente os deltas do executor e de seu teste Node.
Mantém manualmente apenas `diagnosticAudit.corpusSha256`, de
`823ff468060140bd1a13538a7d8c72be0dc903782b7883930c2f2944863846a6` para
`0e66647c2bf8a21460d37fb17a797cf456f83f5eb08913f50708b559df3ef48c`.

O harness injeta ambiente local; a CLI real usa `process.env` e conserva o bloqueio CI.
As novas leituras conferem metadados do resumo gerado em tmp, sem consumir capturas.
Produtores, âncoras, proteção HTTP, demais pins, REVIEWED, contratos e fonte/bundle não mudam.
Os 29 diagnósticos conservam os hashes da base validada. A revisão não usa
`infraestrutura-global-v1` nem autoriza nova revisão escolar ou seleção na CI.
Reconstrução, hashes, justificativas e prévia utilizável estão em
`tmp/validacao/fase5c1-ci-fix/auditoria-final.json`. Congelamento e resultado da única global
final serão registrados nessa pasta; esta nota anterior à execução não presume aprovação.

## Fase 5C.2A — manutenção local do corpus do executor

Após revisão deliberada autorizada dos deltas da 5C.1 consolidada em
`1efb22b047cc8af741d13cb0975958fca94ec0c7`, o corpus anterior foi reproduzido e apenas
`diagnosticAudit.corpusSha256` é mantido: de
`716bbc46330d7e108e56ab19a86444741ca33cad6aefd78c73576c13826cc61e` para
`823ff468060140bd1a13538a7d8c72be0dc903782b7883930c2f2944863846a6`.

Foram revisados executor, teste Node, comando opt-in e consumidores diretos/indiretos.
O gate do executor consome metadados de integridade das capturas; não usa pixels como
conteúdo/oráculo nem promove diagnósticos a entradas. Produtores/âncoras, HTTP, REVIEWED,
classificações, manifesto, fontes/bundle e 29 capturas permanecem intactos.
Esta é manutenção manual do protocolo de identidade; não usa nem amplia o contrato fechado
`infraestrutura-global-v1`, que não admite o lote da 5C.1.

Revisão anterior à escrita, reconstrução da base, hashes, consumidores, prévia e preservação
ficam em `tmp/validacao/fase5c2a/`. A prévia em memória apresentou 29 diagnósticos, zero
desconhecidos e identidade utilizável. A validação final e estabilidade serão registradas
nessa evidência depois do congelamento; esta anotação não presume seus resultados.
Não houve alteração pedagógica, piloto seletivo, mudança de CI ou autorização de publicação.

## Fase 5B.5 — corpus novamente pendente

A capacidade restrita `infraestrutura-global-v1` modifica compositor, CLI, coleta binária e
testes. O pin mantido na 5B.3 não é renovado nesta implementação intermediária. Será necessária
revisão deliberada do delta final e dos consumidores antes de nova manutenção do corpus/global.
Identidade obsoleta continua sendo recusa, mesmo com contrato e registro formalmente preenchidos.
Pins de produtores, HTTP e REVIEWED permanecem intactos; dez recursos e 29 capturas são preservados.

## Fase 5B.3 — manutenção deliberada do corpus (19/10/2026)

Após revisão das seis superfícies de validação/testes das Fases 5B.1/5B.2, dos dez recursos
PDF.js e dos deltas acumulados da PR #49, o pin foi autorizado para manutenção deliberada:
de `3ed1ae7c15d67fce6f06dfcf7cf8da746ab8b1e87fd0aa155a213ace6f566ab7`
para `92cf0532b905f0ae8bfd270b1b5ee8e9e0d036564302024b75cfbb3f2b3f7037`.
Produtores/âncoras/HTTP/REVIEWED e `questionarios-dica-literal-v1` permanecem intactos.

Foram examinados leitores diretos/dinâmicos da instrumentação, reporter, walker de assets,
leitores PDF e seus decodificadores, teste/pacote estático PDF.js, produtores e servidores.
Os novos leitores alcançam JSONs próprios, recursos públicos PDF.js, SVGs originais ou dados
sintéticos; não há novo consumidor funcional das 29 capturas. O hash separado dos artefatos
continua distinto da identidade de entradas. Os 13 recursos coincidem com o upstream instalado;
a prova fonte/bundle conserva oito vínculos estáticos. Evidência e razões por superfície em
`tmp/validacao/fase5b3/REVISAO_CORPUS.md` e `auditoria-corpus.json`, locais e ignorados.

A prévia com o novo pin reconheceu 29 diagnósticos, zero desconhecidos e identidade utilizável.
A validação posterior e a global do snapshot estabilizado são registradas somente nas evidências
locais; esta anotação anterior à execução não presume seus resultados. Prosa anterior conserva
o estado histórico de suas etapas.

## Fases 5B.1/5B.2 — identidade PDF.js e corpus pendente (19/10/2026)

Sobre a base histórica pós-PR #49 `9bd74342d14ae4430b24530c25a46eda01427b31`,
a política declara dez caminhos exatos em `rootInputs`, sob `ambiente_interativo/js/pdfjs-wasm/`:

- `jbig2.wasm`, `openjpeg.wasm`, `qcms_bg.wasm`, `quickjs-eval.wasm`;
- `LICENSE_JBIG2`, `LICENSE_OPENJPEG`, `LICENSE_PDFJS_JBIG2`,
  `LICENSE_PDFJS_OPENJPEG`, `LICENSE_PDFJS_QCMS`, `LICENSE_QCMS`.

São entradas do pacote offline e da sua validação, embora sejam produzidas pelo build.
Seus bytes exatos e ausências são capturados pelo mecanismo existente; recursos não declarados
não recebem autorização genérica por extensão. A precedência de entrada e a proteção de
documentos privados permanecem. A inclusão explícita também incorpora os dez caminhos ao corpus.

Nenhum pin foi renovado. `diagnosticAudit.corpusSha256` continua
`3ed1ae7c15d67fce6f06dfcf7cf8da746ab8b1e87fd0aa155a213ace6f566ab7`,
já divergente do snapshot auditado na Fase 5A. As 29 saídas permanecem desconhecidas enquanto
a atestação não for mantida deliberadamente. A política continua 1.1.0/formato 2; produtores,
âncoras, HTTP, representação e hashes REVIEWED não foram alterados. Anotações históricas abaixo
conservam os valores de suas respectivas etapas, sem reinterpretá-los como o pin atual.

Superfícies de código alteradas nesta rodada que exigem revisão do corpus:

1. `scripts/validacao/planejador-git.cjs`;
2. `scripts/validacao/planejador.cjs`;
3. `scripts/validacao/planejador-comparacao.cjs`;
4. `scripts/validacao/ci-observacional.cjs`;
5. `tests/validacao/identidade.unit.cjs`;
6. `tests/validacao/planejador.unit.cjs`.

Além dessas seis superfícies, revisar a ampliação do corpus pelos dez recursos acima e os
consumidores que justificam o tratamento. `validacao/identidade-politica.json` mudou somente
pela inclusão dos dez caminhos; a própria política fica fora do corpus para evitar circularidade,
mas altera a identidade das entradas. As notas em `IDENTIDADE.md`, `PLANEJADOR.md`, inventário
e política temática de testes também alteram a identidade, embora a prosa fique fora do corpus.

Na Fase 5B.3, revisar o snapshot final acumulado, incluindo os deltas da PR #49 identificados
na Fase 5A, antes de manter o pin. Confirmar 29 diagnósticos reconhecidos, zero desconhecidos,
identidade utilizável e estabilidade; só depois executar a global final autorizada. Testes
direcionados, build, formatação e lint desta rodada não aprovam antecipadamente esse snapshot.

## Manutenção corretiva 4.3A.4-M — reatestação pendente (17/10/2026)

A correção da prova de campos e etiqueta `bloco` para v3 altera `scripts/validacao/planejador-adicao.cjs` e seus
controles em `tests/validacao/adicao-integrada.unit.cjs`, `helpers/adicao-fixture.cjs`,
`planejador.unit.cjs`, mais os novos `helpers/cli-historico-fixture.cjs` e
`campos-adicao.unit.cjs` (caminhos sob `tests/validacao/`). São seis deltas do corpus, além
da prosa normativa, que também integra a identidade de entradas. O build oficial conserva
o bundle porque nenhuma fonte da aplicação foi alterada.

`diagnosticAudit.corpusSha256` fica obsoleto. O valor vigente
`e2d981a2cfc104f91065ede92e817955a77a9dcf4417193e81d08cd768bfd04c` não foi renovado.
Os dois produtores de capturas, o bloqueio HTTP, a política 1.1.0, os dez REVIEWED e a fixture
portátil de onze entradas permanecem intactos. A auditoria de consumidores exigida para
reatestação não é presumida por estes testes e não foi emitido registro de aprovação.

Após autorização específica, revisar o corpus completo e os seis deltas/consumidores, o ensaio
de navegador e os objetos Git isolados, fontes/bundle, produtores/âncoras, HTTP e 29 diagnósticos.
Somente então manter manualmente o pin autorizado, confirmar identidade utilizável e congelar
o snapshot para uma única global integral autorizada. A composição de adição não absorve esta
migração da infraestrutura. Não atribuir identidade/global do experimento à manutenção, nem
promover novos hashes a REVIEWED automaticamente. Retomada do experimento exige base consolidada
e autorização próprias. O conteúdo futuro deve fornecer `bloco` explicitamente em cada questão
e `pergunta` nos campos; evidências v1/v2 não são reinterpretadas como v3.

## Manutenção final dos pins HTTP e corpus — 16/10/2026

Após autorização específica, os sete deltas acumulados foram revistos sobre os bytes finais:
teste central, contrato de registro, fixture sintética, controles preparatórios, JSON portátil,
módulo HTTP e testes HTTP. Foram conferidos leitores diretos/indiretos, produtores e âncoras,
29 capturas, sete vínculos fonte/bundle, dez REVIEWED e as onze entradas do snapshot contra
os bytes originais. Nenhum novo leitor usa diagnósticos como entradas. O cálculo HTTP é lexical;
não muda a autorização de acesso. A execução dirigida do gate confirma Windows, duas formas
POSIX, runtime com/sem junction, privados, traversal codificado e recusa de arquivo externo.

Somente dois campos da política são mantidos manualmente:

- `diagnosticAudit.httpDeny.sha256`: de
  `e471c327c9f6086eb1998d2c4ef41940f55f0f24440af039d1132c0b5113e604` para
  `454efa43370e11360f5aa8b0f128faefa2c5b2aa1ab21605675e35255b2c6b44`, após revisão do cálculo
  corrigido e bloqueios efetivos. A âncora `/i.test(relative)` permanece.
- `diagnosticAudit.corpusSha256`: de
  `8483576ab4f3eb231186844de613d288d03f6f70a464b28a2fa4fd041f7e9aaf` para
  `e2d981a2cfc104f91065ede92e817955a77a9dcf4417193e81d08cd768bfd04c`, após revisão individual
  dos sete deltas e de seus consumidores. A própria política e prosa ficam fora desse corpus.

Os valores foram recalculados nesta rodada; não foram copiados como prova da rodada anterior.
Versão 1.1.0, formato 2, produtores, representação, classificações e REVIEWED permanecem intactos.
Evidência local: `tmp/validacao/etapa43a4p-pins-final-Sek0ch/REVISAO_PINS.md`, JSONs de bytes,
preservação e gate. A global só começa após identidade utilizável, 29 diagnósticos reconhecidos,
zero desconhecidos e congelamento do snapshot. Resultado e estabilidade serão registrados
exclusivamente na evidência local após a coleta, sem edição concorrente nem aprovação antecipada.
Esta manutenção de infraestrutura R4/global não constitui prova positiva de adição integrada.
Consolidação Git e experimento escolar continuam sujeitos a autorização própria.

## Correção HTTP posterior à global 4.3A.4-P — manutenção pendente

A global do snapshot reatestado abaixo executou 571 casos e reprovou 351. A investigação
direcionada confirmou um erro anterior no cálculo de `/@fs/`: `slice(6)` removia a unidade
Windows ou a barra POSIX. O módulo HTTP passa a usar o comprimento do prefixo literal e
recompõe a barra POSIX quando o Vite emite `/@fs/home/...`, mantendo também a forma com barra dupla.
O Vite instalado emite rota relativa quando seu runtime está na raiz e `/@fs/` quando está fora,
como na junction desta worktree; os dois arranjos foram reproduzidos em fixtures isoladas.

Essa correção altera `scripts/identidade-ambiente-local.cjs` e acrescenta
`tests/validacao/http-local.unit.cjs`, totalizando sete deltas acumulados de corpus desde a base.
O hash em `diagnosticAudit.httpDeny.sha256` e `diagnosticAudit.corpusSha256` ficam obsoletos.
Não foram atualizados nesta correção; política 1.1.0/formato 2, produtores e dez REVIEWED
permanecem intactos. Uma identidade bloqueada após a correção é o comportamento conservador
esperado, não motivo para reduzir asserções ou renovar pins automaticamente.

Antes de autorizar outra global, revisar deliberadamente o módulo, consumidores Vite/launcher,
requisições negativas, testes novos, produtores e seus vínculos. Conferir o bloqueio HTTP real
e as 29 capturas preservadas; manter manualmente somente os pins explicitamente autorizados
em tarefa própria. Confirmar identidade utilizável, 29 diagnósticos e zero desconhecidos,
congelar o novo snapshot e executar uma única global integral pelo pretest oficial.
Não usar o compositor de adição para absorver essa alteração de infraestrutura/HTTP.
Resultados direcionados e evidências em `tmp/validacao/etapa43a4p-http403-7zSKJN/`.

## Manutenção deliberada da infraestrutura 4.3A.4-P — 16/10/2026

Os cinco deltas executáveis/de dados foram revisados contra a base local
`4d769c2f3867315e2c163405a22dd0789cc278e1`: teste central, contrato de registro, helper de adição,
controles preparatórios e snapshot JSON das onze entradas. A reconstrução do corpus anterior
reproduziu exatamente o pin vigente. A revisão dos imports, chamadas de leitura e caminhos
dinâmicos confirma que esses deltas não consomem as 29 capturas como entradas. O JSON conserva
os bytes originais, seus hashes e o selo fixo; é dado sintético de teste, sem substituir a base
real do coletor. As dez superfícies reais REVIEWED continuam iguais às expectativas fixas.

Os hashes/âncoras dos produtores e do bloqueio HTTP permanecem intactos, incluindo `/@fs/`.
As sete associações de fonte/bundle continuam válidas. A evidência individual, os corpus
reconstruídos, deltas/hashes e leitores estão em
`tmp/validacao/etapa43a4p-final-tHzG96/REVISAO_CORPUS.md` e seus JSONs locais.
Somente `diagnosticAudit.corpusSha256` muda de
`71992435d3eb680f496bc95a572b17c583d90bb108e230ab6a062d2c95922c79` para
`8483576ab4f3eb231186844de613d288d03f6f70a464b28a2fa4fd041f7e9aaf`.
Política 1.1.0, formato 2, produtores, classificações e demais pins não mudaram.

As 29 capturas estavam ausentes nesta worktree antes da global; não foram copiadas de outra
cópia nem atribuídas a esta execução. A política admite esse estado explícito dos artefatos,
sem dispensar seu reconhecimento como diagnósticos ou os gates de identidade. A global deve
produzir suas próprias capturas e conferir a identidade no início/fim. O resultado da única
execução autorizada, seus estados e hashes finais ficam na evidência local, sem aprovação
antecipada nesta anotação. A manutenção é de infraestrutura R4/global, não uma prova positiva
de adição integrada. Consolidação Git e experimento escolar continuam sujeitos a autorização.

## Manutenção deliberada da infraestrutura 4.3A.2/3 — 16/10/2026

Revisão acumulada contra o corpus válido `cbdd769d3defd657dd8c2ba578cd84c8d46de294232282034028af75303be5be`:
oito superfícies de validação/testes foram examinadas, sem novo consumo das 29 capturas como
entradas. Produtores, âncoras, bloqueio HTTP, manifesto, aplicação, bundles e dez `REVIEWED`
preservados. Corpus reconstruídos, deltas/hashes, cópias das capturas e análise individual dos
leitores estão na evidência local `tmp/validacao/etapa43a3-final/REVISAO_CORPUS.md` e seus JSONs.
Somente `diagnosticAudit.corpusSha256` passa para
`71992435d3eb680f496bc95a572b17c583d90bb108e230ab6a062d2c95922c79`;
política 1.1.0/formato 2 preservados. Identidade final e resultado da única global autorizada
são registrados separadamente nessa evidência, sem atribuir resultados antecipados.
Trata-se de manutenção R4/global de uma worktree modificada ancorada em `202c304`, não uma
adição integrada ou um commit contendo a implementação. A 4.3A.4 permanece fora desta etapa.

## Etapa 4.1C — política 1.1.0 e atestação textual A1

A política vigente é **1.1.0**, mantendo identityFormat 2 e SHA-256 dos bytes exatos de todas
as entradas. Os registros abaixo da Etapa 2.1 descrevem a política histórica 1.0.0; seus pins,
planos e relatórios não são reinterpretados. Descritores de versões/pins diferentes continuam
incompatíveis. A cópia anterior permanece no histórico Git e na evidência local da migração.

Somente o corpus usado para atestar diagnósticos usa `questionarios-dica-literal-v1`, implementado
em `scripts/validacao/identidade-texto.cjs` e integrado ao capturador existente. A captura conserva
separadamente o fingerprint bruto das entradas, o corpus de atestação e os artefatos. Uma dica
diferente sempre muda `inputFingerprint`; nunca permite confrontar com a global da dica anterior.

O contrato exige payload **inteiramente estático** de um registrador público Questionários
reconhecido, associado inequivocamente ao manifesto por ID, perfil, chave e fonte. Propriedades
duplicadas, calculadas, getters, funções, spreads, métodos, shorthand e `__proto__` não são dados
admitidos. Cada questão tem ID textual único. Só o intervalo do valor literal simples de uma
`dica` existente em `questoes` recebe um marcador por revisão/questão/propriedade. Todo o restante
do arquivo conserva seus bytes, incluindo comentários, respostas, opções, referências e código.
Strings vazias, com barras, controles ou aparência de esquema permanecem protegidas sem máscara.
Novas questões/propriedades e remoções alteram o corpus e revogam a atestação.

Na base inicial, sete configurações e 190 dicas satisfazem a prova. Isso é uma consequência da
estrutura dos dados, sem allowlist de nomes, perfis ou matérias. Os demais payloads permanecem
protegidos integralmente. Ambiguidade nunca amplia a máscara.

### Prova fonte/bundle e consumidores

O build oficial Vite parte de `app.entry.js`, importa o motor antes dos conteúdos e produz o IIFE
local sem minificação. A prova encontra a chamada ao **registrador público**, compara a AST de
todo o objeto fonte/bundle (excluindo somente posições e grafia de literais), exige unicidade e
então projeta os mesmos intervalos de dicas. Não procura nome de variável local nem substitui
ocorrências textuais soltas. Todos os demais bytes do bundle continuam no pin revisado, gerado
pelo build oficial. Bundle ausente, antigo, divergente, com código adicional ou transformação
incompatível não sustenta atestação. Os hashes brutos de fonte/bundle ficam nas associações da
prova e são conferidos contra as entradas por `identityUsable`.

Revisão de consumidores na base `ecaaf74`: o motor guarda a referência da configuração e lê dica
em `anunciar` e `mensagemDeRevisao`; o destino é `textContent`, na região status/aria-live. O texto
visível e a fala do leitor de tela podem mudar, preservando o mecanismo de foco/retorno e pontos.
As APIs públicas retornam a configuração inteira. `app.js` usa matéria/contagem/identidade; specs
serializam os objetos e verificam presença, tamanho e não exposição do gabarito. Interações,
ditado, armazenamento e correção não usam dica como resposta, chave, URL ou nome de arquivo.

O consumidor indireto relevante é `scripts/validacao/fontes.cjs`: percorre `Object.entries` e
`Object.values`, reconhecendo strings de assets pelos prefixos `../assets/` e `leituras/`. A
restrição textual impede essa interpretação nas folhas projetadas. Não foi encontrada dependência
dinâmica relevante não resolvida nas sete configurações. Isso é uma revisão delimitada do corpus,
não uma alegação de análise estática universal: novo consumidor literal/dinâmico, novo arquivo,
mudança no motor, nos testes, no build ou na infraestrutura muda os bytes protegidos e recusa a
atestação. O scanner positivo anterior continua promovendo entradas antes de diagnósticos.

Os dois produtores e as âncoras dos 29 caminhos permanecem iguais, assim como o bloqueio HTTP
inclusive `/@fs/`. O percurso das três capturas de História abre Q30 e o painel responsável sem
conferência, deixando vazio o retorno que exibiria dica. As outras 26 capturas são de Inglês.
Não se exige que capturas sejam sempre iguais: elas continuam artefatos separados, sujeitos aos
produtores e à prova de ausência de leitores. Não existe exclusão geral de screenshots.

### Procedência, migração e validação

Na política 1.1.0, o comparador exige também procedência disponível e coerente: commit e árvore
iguais no alvo planejado e no início/fim da execução, com rótulos Git válidos e fingerprint bruto
do alvo igual ao da worktree planejada. SHA isolado nunca identifica uma worktree modificada.
O estado Git bruto é preservado; criação de diagnósticos pode mudar porcelain/dirty sem mudar
entradas. Igualdade dos fingerprints brutos, política/manifesto e inventário global completo
continua obrigatória. Metadados antigos, apenas `complete=true` ou relatório parcial não bastam.

O novo pin só é registrado após revisão deliberada dos consumidores acima, correspondência do
build inicial, delta da infraestrutura, produtores e bloqueio. Não existe comando de renovação
automática. A migração é R4 e exige testes Node direcionados, manifesto, build, format:check,
lint, diff e uma global final estável. A prova experimental posterior usa outra cópia isolada e
compara seu delta com o snapshot da implementação, sem commit intermediário ou política no delta.
Sem global desse snapshot experimental, não há projeção de economia. A classificação R1/R3/R4
e a execução global obrigatória continuam intactas; R2 e CI seletiva não foram ampliados.

Os testes acrescentados cobrem aceitação textual e recusas de bundle, AST, referências,
consumidores, produtores, renderer, HTTP, política e procedência. Os três casos reais de
materialização LF→CRLF permanecem nos testes anteriores, com seus hashes originais. A evidência
local Windows não substitui a futura execução Ubuntu. Dependências instaladas são metadados,
não uma assinatura de toda a cadeia de ferramentas. Resultados e digests finais são registrados
na evidência local após congelar os arquivos da implementação, sem atribuir prosa posterior à
identidade testada.

A execução obrigatória continua global. Reporter, planejador e comparador compartilham
`scripts/validacao/identidade.cjs` e a política versionada
[identidade-politica.json](identidade-politica.json). Não há seleção executável. A integração
observacional da Etapa 3 está descrita em [PLANEJADOR.md](PLANEJADOR.md); usa a mesma identidade.

## Formato e escopo

Planos, relatórios e comparações novos usam schema 2; a política usa schema 1, versão 1.0.0 e
identityFormat 2. O manifesto permanece 1.1.0 e sua base histórica/digest permanecem imutáveis.
A política inteira tem digest; planos e execução precisam concordar com ele. Versão, formato,
identidade ausente ou política incompatível impedem conclusão e projeção.

Correção A2: o comparador exige descritores de manifesto válidos nos dois artefatos, com schema 1,
versão numérica `x.y.z` e SHA-256 hexadecimal minúsculo de 64 caracteres. Versão e hash precisam
coincidir. A mesma decisão alimenta o diagnóstico e `identity.manifestCompatible`; dois campos
ausentes ou inválidos não comprovam compatibilidade e não permitem projeção.

A identidade usa SHA-256 dos **bytes exatos** de cada entrada, inclusive SVG, PNG e outras imagens,
fontes locais e configurações. Não há normalização de quebras de linha, Unicode ou UTF-8. Os
adaptadores precisam entregar Buffer; decodificar imagem antes do hash é rejeitado. Caminhos são
relativos, canônicos e ordenados; tamanho e estado acompanham o digest por arquivo.

A política enumera namespaces públicos e extensões de fontes, HTML/CSS, testes, fixtures,
configurações, documentação, infraestrutura e recursos locais, além de configurações explícitas
na raiz. Inclui todos os assets públicos pertinentes desses namespaces, além dos caminhos de
assets explicitamente consumidos pelo manifesto. Isso amplia a identidade; não declara resolvidas
as lacunas do mapa de consumidores usadas para decidir recortes R2.

O bundle local gerado é uma entrada observada da worktree. Os dez PDFs sintéticos oficiais têm
caminhos exatos e hashes esperados do gerador de fixtures; somente esses PDFs são admitidos.
Outros PDFs, documentos, áudio, progresso e credenciais são protegidos e não são lidos para hash.
Se um caminho protegido for declarado como asset consumido, a identidade fica incompleta.
Symlinks, ancestrais symlink, caminhos externos ou não canônicos não são seguidos.

## Entradas, diagnósticos e desconhecidos

Entrada pública ou consumo demonstrado tem precedência sobre qualquer produtor de screenshot.
O scanner de sinks de leitura/referências é apenas evidência positiva: não prova ausência de
consumidores dinâmicos. A exclusão abaixo depende também da revisão e do pin do corpus inteiro.

Somente os 29 caminhos exatos listados abaixo recebem tratamento diagnóstico. A regra exige:

1. Hash dos bytes e âncora do produtor real de screenshot.
2. Hash e âncora do bloqueio HTTP de output no helper de ambiente local.
3. Hash do corpus revisado de fontes executáveis, configuração, referências HTML/CSS/SVG e bundle.

O corpus inclui entradas públicas indexadas pertinentes. Exclui a própria política, para evitar
circularidade, e prosa Markdown/TXT, que não fornece prova negativa de consumo executável.
A investigação dos produtores e consumidores encontrou screenshots escritas pelos testes abaixo,
sem leitura dessas capturas pela aplicação ou pelos testes. Os assets originais em assets/ são
entradas distintas das capturas produzidas em output/. O servidor local recusa output/.

Uma mudança em fonte/configuração/SVG desse corpus invalida a atestação: as capturas voltam a
**desconhecidas** até nova revisão deliberada e atualização do pin. Não existe regeneração
automática de atestação. A manutenção deve rever os produtores, o bloqueio e possíveis consumidores,
inclusive dinâmicos, antes de atualizar corpusSha256. Apenas editar o hash não constitui revisão.
Isso é conservador: até uma alteração executável sem relação com screenshots exige reavaliação.

### Manutenção da atestação decorrente do A2 — 15/10/2026

O delta do corpus foi revisto separadamente da correção: somente
`scripts/validacao/planejador-comparacao.cjs`, `tests/validacao/planejador.unit.cjs` e
`tests/validacao/identidade.unit.cjs` mudaram entre as superfícies executáveis/configuração.
O delta valida metadados e acrescenta cenários sintéticos, sem novos imports, consumidores de
capturas, sinks de leitura ou referências dinâmicas a arquivos. As demais superfícies conservaram
seus hashes. Os hashes e âncoras dos dois produtores e do bloqueio HTTP foram reconferidos e
permanecem iguais. Lista de 29 diagnósticos, precedência das entradas, proteção de privados,
namespaces e exceções sintéticas não foram alterados.

Após essa revisão, o pin do corpus passou de
`18ce12696aae1c6619d9649108f16f24e8aad5f99ed8412e660ca827c220bf30` para
`a8655c9e25d3b244eb24da079d793f17e08013169c4f2f994c376a31b2d3c5e0`.
Essa renovação não resolve A1/A3 nem reescreve planos/relatórios anteriores, que preservam a
política e o snapshot de sua própria coleta. Anotações em prosa ficam fora do corpus executável.

### Reatestação por checkout completo da PR #44 — 15/10/2026

A CI #110 interrompeu no teste CLI porque o checkout raso não continha o commit-base histórico.
A única superfície executável/configuração alterada nesta correção é
`.github/workflows/validacao.yml`: `actions/checkout@v6` recebe `fetch-depth: 0`.
O delta não cria consumidor, sink ou referência a screenshots. Produtores e bloqueio HTTP
conservaram hashes/âncoras; privacidade, precedência de entradas, namespaces, dez fixtures
sintéticas e lista exata de 29 diagnósticos permanecem iguais. As demais superfícies
coincidem com a atestação anterior. Depois dessa revisão, o pin passa de
`a8655c9e25d3b244eb24da079d793f17e08013169c4f2f994c376a31b2d3c5e0` para
`cbe8500004c9c96385a4a2e0f3f6597fed4cb80287eb294345ac98cbdd10d505`.
A renovação é restrita a esse delta e não corrige A1/A3 nem altera evidências históricas.

### Reatestação da integração observacional — Etapa 3, 15/10/2026

O corpus anterior foi reconstruído a partir da base `6d3cff0`, conservando a materialização local
do bundle: reproduziu exatamente o pin
`cbe8500004c9c96385a4a2e0f3f6597fed4cb80287eb294345ac98cbdd10d505`.
Foram revistas as únicas quatro superfícies executáveis/configuração alteradas:
`.github/workflows/validacao.yml`, `package.json`, `scripts/validacao/ci-observacional.cjs` (nova)
e `tests/validacao/planejador.unit.cjs`. As demais superfícies conservaram seus hashes; as mudanças
em prosa não pertencem ao corpus executável, embora continuem entradas da identidade.

O adaptador lê somente o evento GitHub, o próprio estado/plano e o relatório JSON do reporter;
escreve JSON/Markdown no diretório observacional. A descoberta dos relatórios é limitada aos
subdiretórios imediatos do reporter; não procura nem consome capturas ou arquivos privados.
Seus caminhos dinâmicos derivam dessas saídas próprias. Os novos testes usam os mesmos planos
sintéticos, relatórios JSON e repositório Git isolado; não criam leitor de screenshot. O workflow
mantém o upload estruturado existente e acrescenta resumo, sem consumidor de imagens.

Hashes e âncoras dos dois arquivos produtores e do bloqueio HTTP foram reconferidos e permaneceram
iguais. O bloqueio conserva recusa de `tmp/output/.codex/.git`, inclusive acesso `/@fs/`, e as
regressões de privacidade continuam na global. Precedência de entrada, nomes exatos dos 29
diagnósticos, proteção de privados e dez PDFs sintéticos não mudaram. Nenhuma captura existente
foi apagada, substituída, lida para publicação ou incluída no Git. A worktree nova materializa
somente suas próprias capturas quando a global as produz.

Após essa revisão deliberada, o novo pin é
`e0e93ccb2d59bb5f56c101e38bf1ccaf9fca48fdfbdabc48c8c98fb47f694d80`.
A1 continua como risco operacional: mudança posterior do corpus invalida novamente a atestação.
A3 permanece no planejador; a integração exige identidade utilizável e comparação completa,
separadas de `valid=true`. Não há exceção global de output/tmp nem atualização automática de pin.

| Produtor                                               | Captura diagnóstica exata                              |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `tests/historia-mariana-memorias-outubro-2026.spec.js` | `output/historia-outubro-1366.png`                     |
| `tests/historia-mariana-memorias-outubro-2026.spec.js` | `output/historia-outubro-1920.png`                     |
| `tests/historia-mariana-memorias-outubro-2026.spec.js` | `output/historia-outubro-390.png`                      |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/comparison-1366.png`                 |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/comparison-1920.png`                 |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/comparison-390.png`                  |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/pronunciation-1366.png`              |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/pronunciation-1920.png`              |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/pronunciation-390.png`               |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/children-balloons.png`        |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/four-balls.png`               |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/doll-on-table.png`            |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/robot-under-table.png`        |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/two-bears-on-bed.png`         |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/two-bears-under-bed.png`      |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/four-bears-on-bed.png`        |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/two-bears-on-table.png`       |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/learn-positions.png`          |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/learn-colors-numbers.png`     |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/learn-places.png`             |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/read-inside.png`              |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/fly-kite-outside.png`         |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/ride-bike-outside.png`        |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/play-doll-inside.png`         |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/metal-bike.png`               |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/fabric-doll.png`              |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/paper-kite-plastic-lorry.png` |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/compare-review-7.png`         |
| `tests/ingles-alice-play-time.spec.js`                 | `output/play-time/assets/toys-gallery.png`             |

Os 29 arquivos permanecem locais; não são apagados, movidos, promovidos a entrada nem incluídos no
Git para tornar a comparação favorável. Seu fingerprint separado registra bytes/ausência dos
artefatos; alterações nas capturas não alteram o fingerprint de entradas. Arquivo novo sob output/
ou tmp/ não ganha exceção por nome, extensão ou ausência no Git: se aparecer no conjunto indexado
ou no diff relevante sem regra demonstrada, permanece desconhecido e bloqueia conclusão.
Não há varredura indiscriminada de tmp/ nem leitura de documentos privados ignorados.

## Git, worktree e estabilidade

Commit e árvore descrevem Git. O fingerprint de entradas descreve os bytes observados na worktree,
inclusive entradas geradas explicitamente necessárias; não é uma árvore Git limpa. O fingerprint
de artefatos descreve resultados diagnósticos separadamente. Worktree modificada mantém esse rótulo.
Em modo refs, a identidade dos blobs Git é calculada em bytes e conferida separadamente com o mesmo
escopo na worktree. Entradas locais adicionais não derivadas impedem equivalência; bundle e PDFs
sintéticos locais são observados como materialização e nunca atribuídos aos blobs Git.

### Compatibilidade de materialização LF→CRLF — correção P1

Os três atalhos `.bat` são armazenados em LF no Git e materializados em CRLF por
`*.bat text eol=crlf`. Igualdade direta dos fingerprints desses escopos rejeitava até uma
checkout correta. `planejador-git.cjs` agora conserva ambas as identidades originais e verifica
separadamente cada entrada divergente. Somente `.bat` com blob LF sem CR/NUL pode receber a
transformação exata LF→CRLF; todo o restante dos bytes precisa coincidir. Entradas binárias e
outras diferenças continuam exigindo igualdade exata. Não há normalização do fingerprint.

A prova usa `git check-attr --source=<commit>` isolado de atributos globais/sistema e exige
`text=set`, `eol=crlf`, sem filter, ident, crlf legado ou working-tree-encoding. Os atributos
efetivos locais precisam coincidir; cada `.gitattributes` aplicável deve corresponder aos bytes
da revisão Git. Overrides em info/attributes, fonte externa GIT_ATTR_SOURCE, atributos ausentes,
divergentes/não suportados ou Git sem suporte à consulta impedem a exceção. Nenhum filtro é
executado. `materializedInputs` registra caminho, conversão, commit e atributos comprovados;
`materializationErrors` registra recusas, sem conteúdo dos arquivos.

Os testes usam objetos e checkouts reais de repositórios temporários, separados do Git do
projeto. Os fluxos positivos de PR integrada e push percorrem eventReferences, collectComparison
e refIdentity reais, makePlan e o comparador existente com inventário global sintético completo.
As identidades originais diferentes permanecem verificáveis; A3 continua impedindo projeção
com identidade incompleta. Ubuntu definitivo permanece dependente de futura PR autorizada.

### Reatestação da correção P1 — 15/10/2026

Além das quatro superfícies da Etapa 3 já atestadas, esta correção modifica somente
`scripts/validacao/planejador-git.cjs` e acrescenta testes em `tests/validacao/planejador.unit.cjs`.
A nova leitura é restrita aos atributos Git e entradas já comparadas; não cria consumidor de
screenshots nem exceção de output/tmp. Produtores, bloqueio HTTP, política de privados,
precedência de entradas e lista dos 29 diagnósticos são preservados. A prova e o novo pin após
revisão deliberada ficam registrados abaixo e nas evidências locais da correção.

Reporter captura início e fim; planejador confere estabilidade durante a própria coleta. Remoção,
rename, entrada ausente/ilegível ou corrida percebida durante leitura produz digest distinto ou
identidade incompleta. Comparador exige identidades completas e coerentes com os próprios digests,
política/manifesto compatíveis, início/fim iguais, inventário global integral, contagens coerentes e
tratamento dos caminhos alterados. Incerteza impede projeção; resultados direcionados continuam
válidos para o reporter, mas não comprovam inventário global para o comparador.

A captura não é um monitor contínuo nem snapshot transacional do sistema de arquivos. Uma mudança
transitória integralmente revertida entre capturas pode escapar. Não executar edições concorrentes
durante a global. Dependências externas instaladas/ambiente são metadados, não prova byte a byte de
todo node_modules. O pin é uma evidência local revisável, não assinatura criptográfica de auditor.

## Legados e manutenção

Relatórios/planos antigos do formato 1 continuam imutáveis e inconclusivos quanto aos assets e
outputs não coletados naquela execução. Nenhum digest é acrescentado retrospectivamente. Para nova
evidência, gerar novo plano e nova global; preservar os antigos como histórico.

Ao acrescentar entrada pública, conferir namespace/extensão e consumidores; quando necessário,
atualizar a política explicitamente. Para novo diagnóstico, demonstrar produtor, consumidores e
bloqueio antes de incluir o caminho exato e revisar os pins. Uma nova categoria sem decisão fica
desconhecida. Mudanças do manifesto continuam seguindo o procedimento do README, sem regenerar
base histórica. Alterações semânticas de formato exigem versionamento e rejeição explícita de
incompatibilidade.

Testes sintéticos cobrem assets/bits binários, saídas conhecidas, desconhecidos, consumo com
precedência, invalidação da atestação, estabilidade, ausência/rename, políticas/formatos, legados e
privacidade. A evidência real exige novo plano e global completos, sem segunda suíte recortada.
Uma comparação concluída permite somente projeção da soma observada de tentativas; não certifica
recorte nem prevê tempo seletivo. Política de execução, check obrigatório, workers, retries,
timeouts, servidor e testes originais da aplicação permanecem preservados.

Reatestação P1 concluída: o pin passa de `e0e93ccb2d59bb5f56c101e38bf1ccaf9fca48fdfbdabc48c8c98fb47f694d80` para `c74ec14472974ca446788687ed1ec603a6ee76fdffb3675a8081dc9cd48dd253`. Somente as duas superfícies descritas mudaram desde a atestação da Etapa 3; hashes/âncoras dos produtores e do bloqueio HTTP conferem, e os 29 diagnósticos anteriores foram preservados em cópia local ignorada.

## Fase 5C.3G-B2 — registro inicial anterior à autorização do corpus

A rota opt-ins, compositor/planejador, testes Node/Playwright e manifesto alteram o corpus.
Nenhum pin é renovado nesta implementação. Antes da global final, apresentar deltas/hashes,
consumidores, produtores/âncoras/HTTP, fonte/bundle e 29 diagnósticos conforme a política;
solicitar autorização específica para manter manualmente somente diagnosticAudit.corpusSha256.
REVIEWED, pins de produtores/HTTP/recursos e política de entradas privadas permanecem fixos.
Identidade inconclusiva bloqueia seleção, mesmo com provas sintéticas positivas. Novos SHAs
Git não alteram por si os hashes de conteúdo nem autorizam renovar pins. Evidências antigas
conservam sua proveniência original. Infraestrutura deve ser consolidada antes do piloto.

### Manutenção deliberada autorizada — 22/10/2026

Após reconferência do checkpoint e autorização específica do responsável, foi alterado
manualmente somente `diagnosticAudit.corpusSha256`, em `validacao/identidade-politica.json`:
de `01b8d4ae5ea3228544019fc2c0368076a327fed283eb068ee580d4a5b121aa45`
para `119952e16f05638ff85640c8169578bb007f34e9fb3b7fa881e446d6edbd0ad1`.
O corpus anterior foi reproduzido com a materialização CRLF dos três BAT exigida pelos
atributos versionados; os dez deltas de corpus, 14 consumidores e hashes coincidem com
o checkpoint. Mudam prova opt-ins, adição/compositor/planejador, testes/fixtures e manifesto.
REVIEWED, produtores/âncoras, HTTP, recursos, demais pins e entradas privadas permanecem fixos.
A verificação local de disponibilidade não encontrou dependência efetiva do volume que havia
sido desbloqueado, nem deriva dos insumos. Não atribui as falhas anteriores a esse bloqueio.
Identidade real, congelamento e resultado da global são registrados separadamente em
`tmp/validacao/fase5c3g-b2/RELATORIO_VALIDACAO_GLOBAL.md`; esta nota de manutenção não
antecipa aprovação dos testes. Evidências anteriores conservam seus hashes e proveniência.

### Revalidação do P13 — manutenção autorizada em 23/10/2026

Auditoria sobre `4241a5231309ab9a520bb4b99243f91782895c8a` reproduziu o corpus publicado
e confirmou como único delta executável a preferência `reducedMotion: 'reduce'` antes de
`boot` no P13 compartilhado. A remoção dessa linha recupera integralmente a spec publicada;
questões, gabaritos, cliques, asserções e timeout permanecem. A comparação Linux
[39894991968](https://github.com/guiufpb/revisoes-escolares/actions/runs/39894991968)
registrou três timeouts no controle e seis aprovações na candidata, sem esperas de estabilidade.
O workflow diagnóstico não integra este lote nem seus insumos comparados.

Após revisão deliberada e autorização específica, mantém-se manualmente somente
`diagnosticAudit.corpusSha256`, de
`119952e16f05638ff85640c8169578bb007f34e9fb3b7fa881e446d6edbd0ad1` para
`7ce796f0bc17830af9186396e9da182d77194e8933937c3f19b3d959fbd3b37b`.
Consumidores, dez REVIEWED, produtores/âncoras, HTTP, política de privados e vínculos
fonte/bundle permanecem preservados. Os 29 PNGs continuam locais, com cópia de evidência
da própria worktree antes da regeneração pela global. Auditoria, hashes, identidade real,
snapshot e resultado da única global ficam em
`tmp/validacao/fase5c3g-b3/RELATORIO_REVALIDACAO_GLOBAL_P13.md` e evidências associadas.
Esta nota não antecipa aprovação da global nem autoriza publicação ou seleção na CI.
