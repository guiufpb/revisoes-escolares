# Identidade de entradas e artefatos — Etapa 2.1

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
