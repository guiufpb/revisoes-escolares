# Adição integrada observacional — Etapa 4.3A.2

## Extensão local 5C.3C

A prova v3 isolada continua estrutural e conservadora. Sua composição completa agora pode
sustentar a regra local específica descrita em [PLANEJADOR.md](PLANEJADOR.md), depois dos gates
de identidade, revisão e descoberta. As afirmações históricas abaixo de ausência de seleção
referem-se às etapas anteriores; não concedem exceção genérica a R1.

Os dez hashes REVIEWED e o snapshot portátil histórico permanecem intactos. O registro
existente pode declarar `questionarios-base-revisada-v1` somente para as quatro superfícies
de integração, com revisão explícita da base e consumidores, conforme
[COMPOSICAO_ATESTACAO.md](COMPOSICAO_ATESTACAO.md). Sem essa declaração, a prova original
continua recusando bases posteriores incompatíveis. As seis dependências restantes mantêm
seus pins históricos mesmo quando há base revisada. Nenhum resultado promove hashes do alvo.

A Etapa 4.3A.3 acrescenta a [composição auditável com manutenção deliberada](COMPOSICAO_ATESTACAO.md).
O contrato estrutural abaixo permanece fechado: a política continua fora de seu lote. Somente
o compositor pode separar esse delta após verificá-lo, mantendo o diff inteiro e todos os gates.

O contrato `questionarios-adicao-integrada-v3` é um diagnóstico complementar. Não seleciona testes,
não altera R0–R4/R1/R2 e não substitui `npm test` ou a global de toda PR. O plano oficial conserva
seus campos, regras, formatos e códigos de saída. Reporter, comparador e identidade permanecem
inalterados. A Etapa 4.2 não certifica adições novas nem comprova economia real.

## Escopo inicial

- Uma revisão nova para Alice **ou** Mariana, no motor Questionários.
- Conteúdo estático com questões `opcoes`/`campos`, IDs únicos, chave principal exclusiva e
  `validacaoEstritaEstado: true`. Sem sessões auxiliares, dependências de outra revisão ou migração.
- Matérias História, Geografia, Ciências ou Gramática; painel existente `tela-gramatica-mariana`.
- Um módulo, um import, um registro, um cartão, uma regra de visibilidade, um listener e uma spec.
- Sem imagens/assets na revisão ou no cartão neste primeiro recorte, mesmo já existentes.
  Sem novo CSS, controlador, áudio, pacote, configuração ou recurso externo.
- Metadados e expectativas atuais do manifesto explicitamente aditivos. Base histórica,
  representantes, classificações, exceções, lacunas e maturidade anteriores preservados.

Esta restrição é menor que a capacidade do motor. Outra inclusão permanece não suportada ou
recusada pela prova, sem flexibilizar o comportamento conservador do planejador.

### Correção dos campos — Etapa 4.3A.4-M (17/10/2026)

Itens `campos` admitem exclusivamente `id`, `pergunta` e `respostas`. `pergunta` é obrigatória,
texto literal não vazio e renderizável; `undefined`/`null` literais também são recusados. O motor
existente usa esse texto no `label` do campo. Todo contexto necessário à resolução deve estar
na pergunta ou no apoio efetivamente visível, conferido editorialmente e no navegador.
`antes`/`depois` são recusados, inclusive junto de `pergunta`: o motor não os renderiza.

A v1 admitia `antes`/`depois` e rejeitava `pergunta`, produzindo prova positiva para campos
sem rótulo válido. A v2 corrige essa incompatibilidade sem alterar o motor, registros ou progresso.
Não houve adição real aprovada pela v1 que exija compatibilidade desse formato incorreto.
Relatórios v1/v2 permanecem históricos, sem reinterpretação ou aceitação automática como v3.
Schema do complemento e contrato composto conservam suas versões; o identificador da prova
estrutural distingue a mudança de semântica. Os dez REVIEWED e o snapshot portátil não mudam.

Os controles Node incluem positivos/negativos estruturais e renderização Chromium das fontes/HTML
reais, com registro sintético somente no navegador: contexto, nome acessível, erro/correção,
recarga, navegação, normalização e pontuação, além de axe e larguras 1366/390.
Não cadastram revisão escolar nem acrescentam casos ao catálogo Playwright de 571.

### Correção final da etiqueta — contrato v3 (17/10/2026)

Cada questão `opcoes` ou `campos` também exige `bloco`: texto literal não vazio, sem HTML,
controles ou referências externas, conforme a validação textual existente. Ausência, null,
número, booleano, array, objeto, espaços isolados e os textos literais `undefined`/`null`
(ignorando caixa e espaços externos) são recusados. Não há valor padrão nem preenchimento
automático. O renderer real apresenta essa propriedade na etiqueta acima do título.

A v2 corrigia os campos, mas ainda recusava `bloco`, embora o motor o renderize incondicionalmente.
A v3 corrige esse desacordo sem mudar o motor. Os controles de navegador agora exigem etiqueta,
título, instrução e pergunta corretos em ambos os formatos, inclusive após navegar e recarregar;
não toleram `undefined` no conteúdo renderizado. Propriedades adicionais e expressões executáveis
continuam recusadas. A auditoria pontual das leituras comuns, alternativas, campos e finalização
não encontrou outra propriedade obrigatória ausente nesse recorte. Capacidades condicionais
excluídas não foram habilitadas. Isso não prova adequação pedagógica de futuras perguntas.

A base de uma adição deve conter manifesto. Sua ausência agora tem recusa explícita, antes
de VM/discovery, em vez de TypeError. A CLI histórica sem nova revisão continua no fallback
global existente; adicionar revisão nessa comparação continua inválido. O teste histórico usa
repositório sintético isolado criado de um snapshot Git coerente, com ausência deliberada de
manifesto/política na base e asserções de leitura somente. Não depende de pendências da worktree
nem da disponibilidade do commit histórico após squash; não altera regras do planejador.

Esta é manutenção da infraestrutura, fora do lote de adição. Corpus e identidade ficam pendentes
de revisão deliberada; não há reatestação, avanço de pins ou global integral nesta fase.

## Prova e consumidores

`scripts/validacao/planejador-adicao.cjs` usa Acorn e o parser HTML exportado pelo plugin do
Prettier já instalado pelo lockfile. Não há parser improvisado, dependência nova ou eval/VM.
Verifica a forma da AST do wrapper/registrador e converte somente dados literais. Getters,
expressões, propriedades duplicadas/calculadas, spreads e instruções adicionais são recusados.

As âncoras são o array `revisoes`, imports entre o motor e `app.js`, filhos da `grade-materias`
identificada e instruções diretas de `escolherAluno`/`registrarEventos`. As inserções JS devem
corresponder aos templates fechados. Removê-las, incluindo apenas espaços e separador indispensável,
precisa recuperar os bytes e AST anteriores. HTML exige árvore válida, fechamento explícito,
atributos únicos, IDs globais únicos e recuperação exata dos bytes anteriores sem o cartão novo.
Nenhuma contagem substitui a comparação: trocar um nó antigo por outro continua sendo recusado.

Foram revisados, na base `202c304`, a validação/listagem do registro, atualização de cartões por
perfil, abertura pelo alias público de Questionários, seleção de chaves no armazenamento e os
seletores genéricos de eventos do app. O cartão fechado não possui os atributos de delegação
`data-aluno`, `data-materia`, `data-voltar-*` nem `.opcao-atividade`. O grid usa fluxo normal;
seletores posicionais encontrados em CSS são de gráficos, não dos cartões.

`REVIEWED` fixa os hashes das dez superfícies de app/imports/registro/HTML/CSS/motor/interações/
ditado/áudio/armazenamento examinadas. Alterar a base dessas superfícies recusa a prova até nova
revisão deliberada. Esses hashes delimitam esta prova: **não são a política/pin de identidade**.
O diff completo deve conter apenas o lote reconhecido e, opcionalmente, uma nota final fechada no
inventário, preservando integralmente seu texto anterior. A nota é exatamente duas quebras de linha,
`## Nova revisão: ID`, linha vazia, título, linha vazia, `Conteúdo: CAMINHO` e quebra final. Outros
Markdowns, inclusive políticas temáticas, ficam fora deste contrato. Mudança
em outra fonte, teste antigo, helper, build ou dependência recusa o lote inteiro.

Isso comprova preservação sintática delimitada, não equivalência universal de comportamento.
Layout, consumidores indiretos, progresso e acessibilidade continuam sujeitos às regressões.

## Manifesto, testes e cobertura

Compara-se todo o manifesto da base explícita, não somente `base-14584b2.json`. Só se admitem
registro/spec novos, incremento de versão/totais e associações recíprocas do ID novo. A validação
existente continua obrigatória para schema, catálogo observado, classificações, representantes e
descoberta. IDs/chaves principais, auxiliares e históricas anteriores não podem colidir.

A spec nova admite apenas imports fechados de `test`/`expect`, constantes estáticas e chamadas
diretas `test(tituloLiteral, callback)`. Não admite `test.only`, filtros, hooks, configuração,
helpers ou código executável no topo. Cada callback precisa declarar uma asserção e os títulos
precisam incluir os sete marcadores `[adicao:cadastro]`, `[adicao:recuperacao]`,
`[adicao:isolamento]`, `[adicao:storage-adverso]`, `[adicao:acessibilidade]`, `[adicao:offline]`
e `[adicao:gabarito]`, seguidos de espaço/texto. O percurso de gabarito exige regra ancorada
própria, um match esperado, oráculo `independent` e escopo `questions` no manifesto.

São declarações estruturais, **não prova da qualidade das asserções, do gabarito ou da cobertura**.
O relatório mantém `functional: not-proven` e `pedagogical: human-review-required`. A revisão
humana da spec e do material continua necessária. Callbacks não são um sandbox para a execução
posterior de testes. A prova somente impede execução indevida na coleta do candidato.

Os arquivos requeridos incluem a spec, associações da revisão e os representantes existentes da
política Questionários, acrescidos de acessibilidade, file-bundle e identidade. Representantes
têm o alcance de seu motor/preparação; não certificam todas as revisões.

## Coleta, identidade e evidência

O fluxo de `planRepository` verifica a prova antes de `validateRepository`/VM e de `discover`.
Candidato recusado produz plano inválido sem observação executável nem descoberta. Sem módulo
adicionado, registra `unsupported`/não aplicável e mantém o fluxo anterior. Lote estruturalmente
comprovado ainda precisa passar pela validação existente e pela estabilidade da coleta.

O comando já existente `npm run planejar:testes -- --mode worktree --base REF` grava
`adicao-integrada.json` ao lado do plano. O adaptador CI grava o mesmo complemento em seu diretório
observacional; não modifica workflow, filtros, upload, check obrigatório ou comandos de execução.

O complemento separa `structuralStatus`, `identityStatus`, `runtimeEvidence` e
`executionPolicy: global`. Inclui hashes dos sete arquivos, intervalo HTML, contratos, fontes,
manifesto e motivos de recusa. O fingerprint bruto e a procedência do alvo são preservados.
Identidade utilizável exige o gate existente e associação dos hashes às entradas examinadas.

Adições mudam o corpus atestado pela política 1.1.0. `proven` com identidade `blocked` não permite
comparação conclusiva ou projeção. Não há atualização automática nem alteração de atestação
neste lote. `runtimeEvidence` permanece `not-collected`: esta implementação não certifica uma
global para uma revisão nova nem reinterpreta relatórios anteriores.

## Validação e próximos gates

### Manutenção preparatória 4.3A.4-P

A fixture `tests/validacao/helpers/adicao-fixture.cjs` lê as dez superfícies `REVIEWED` e o
manifesto do único snapshot versionado `tests/validacao/fixtures/adicao-base.json`.
Os textos UTF-8 reproduzem exatamente os bytes conferidos da referência original
`4d769c2f3867315e2c163405a22dd0789cc278e1`; `sourceCommit` é metadado descritivo.
O objeto Git não é necessário em execução. A tentativa anterior de leitura por `git show`
foi substituída: `fetch-depth: 0` não garante preservar o commit após squash ou em instalação
sem esse histórico. O workflow permanece inalterado.

O loader confere SHA-256 de cada entrada, caminhos únicos, as dez expectativas REVIEWED da
prova e o selo fixo de `JSON.stringify(snapshot)`, incluindo o manifesto. Não renova hashes.
Formato do invólucro JSON não transforma os textos escapados; os bytes de cada conteúdo são
conferidos sem normalização. Cada ensaio recebe mapas independentes, sem cache de arquivo que
possa ocultar adulteração posterior. Snapshot ausente ou adulterado falha sem fallback para
Git/checkout. Este é um cenário sintético, nunca evidência da integridade de uma base Git real.

Os dez hashes da prova real permanecem intactos. Os controles negativos alteram a base fornecida
à prova e continuam recusados; a referência estável da fixture não torna compatível uma base real
com integrações posteriores. Após a primeira adição, a segunda continua exigindo a manutenção
deliberada de superfícies/consumidores descrita em [COMPOSICAO_ATESTACAO.md](COMPOSICAO_ATESTACAO.md).
Não há atualização automática de hashes nem autorização para fazê-la nesta tarefa.

O teste central usa o manifesto validado e a referência histórica imutável, compartilhando seu
contrato de identidades com controles sintéticos. Os testes incluem execução em processo novo
sem chamadas a subprocessos, com Git ausente/mínimo, sem clone compartilhado ou objetos emprestados.
Um coletor Git real ainda recusa consumidor incompatível antes de VM/discovery, sem receber o
snapshot como base. Detalhes, deltas de corpus e gates pendentes
estão em [MANUTENCAO_PREPARATORIA.md](MANUTENCAO_PREPARATORIA.md). A 4.3A.4 experimental permanece
fora do escopo; nenhuma revisão real foi adicionada.

Os testes Node em `tests/validacao/adicao-integrada.unit.cjs` usam adições sintéticas em memória,
sem executar seus conteúdos/specs. A fixture Git/CLI isolada usa sentinelas para conferir recusa
antes de VM/discovery e emissão separada, sem criar uma atividade real na aplicação.

Durante desenvolvimento: `node --test tests/validacao/adicao-integrada.unit.cjs`. Após estabilizar:
formatação, lint, diff e `npm test` integral, cujo pretest já valida manifesto, Node e build.
Não repetir o build/global sem mudança ou falha que justifique. Preservar logs/relatórios locais.

Para o primeiro experimento real da Etapa 4.3A.4 são necessários autorização específica, revisão
humana de cobertura/gabarito, lote no escopo fechado, identidade válida pelo procedimento vigente,
build oficial e global do mesmo snapshot. Não há autorização implícita para experimento, injeção
real de defeitos ou suíte seletiva. Uma global verde não mede sensibilidade a falhas omitidas.

Se houver desvio, permanece a global ou o diagnóstico inválido existente. Reverter a extensão
significa retirar o complemento/guard específico, sem tocar em progresso, R1/R2 ou evidências.
