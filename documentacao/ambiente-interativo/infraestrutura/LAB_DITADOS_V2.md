# LAB.2D.6A — contrato de ditados v2, sem admissão operacional

## LAB.2D.6C.2 — integração operacional local (validada integralmente)

Contrato vigente: validarPacote revalida explicitamente v1/v2 pelo reconhecimento existente,
retornando somente pacote original normalizado, canônico e digest. Nenhum objeto marcado
válido ou digest externo é aceito; nenhuma validação emite aquisição ou autorização de escrita.
Validadores analíticos continuam retornando admissaoOperacional:false. Seções 6A–6C.1 abaixo
registram o estado histórico anterior, inclusive seus bloqueios naquela etapa.

A mesma entrada operacional é usada por repositório/cadastrar e validarPar, coordenador,
backup, planejamento, journal, aplicação, reconciliação, retomada e payload terminal.
V1 preserva canonicalização/digests, APIs, registros, chaves e snapshots. V2 mantém pacote
original na identidade, perfil/ID/versão como endereço lógico e os mesmos copyId/origem,
matéria/digest/sessão; nenhum namespace, migração ou sobrescrita. Duplicatas idênticas são
idempotentes e conflitos entre formatos exigem outro ID/versão. Importação temporária v2
continua recusada explicitamente em carregarTemporario.

Execução v2 usa adaptarContratoDitadoLab(canonico) e sua projeção única da 6B/6C.1,
sem substituir conectarMotor ou canais: aquisição, Web Locks, configuração correspondente,
snapshots estritos e persistência são autênticos. Gabarito exclusivamente de texto, 1–6 itens,
ordem/IDs, idioma/unidade e mensagem sucesso simétrica. Nenhuma alteração no avaliador,
normalização, áudio, prazo de 3000 ms ou corpo de snapshot versão 1. Palavra/frase pt-BR e
en-US reutilizam AudioRevisoes/GramaticaDitado; ouvir não escreve nem pontua.

ApresentarPacote projeta metadados v2 com rótulo Ditado e identificação estável derivada do
digest completo, agrupada para permitir quebra de linha. Prévia, ID exibido, listagem e
cabeçalho usam essa identificação; metadados livres/IDs originais ficam na identidade interna.
O motor reutiliza apresentação neutra e IDs HTML neutros da 6B. V1 conserva sua apresentação.
Não há promessa de ocultação da memória/código/arquivo local. Arquivos continuam escolhidos
pelo responsável; não são executados scripts recebidos. Confirmação explícita permanece.

Lab-backup-v1 aceita explicitamente pacotes originais v1/v2 e conjuntos mistos, conferindo
digest e snapshots antes de qualquer operação. Versão do envelope, formato e versão individual
não se confundem. APIs de captura usam handles autênticos e preservam principal/responsavel.
Leitores completos anteriores que só conhecem v1 recusam v2; não há migração retroativa.
Todos os pontos operacionais do journal reutilizam validarPacote/validarBackup versionados,
inclusive releitura canônica, comparação, CAS, aplicação, reconciliação/retomada e encerramento.
Confirmações, locks, etapas e revalidações antes da escrita são os existentes, sem rollback.
Não foi criada interface de download, backup, restauração, reconciliação ou administração.

Durabilidade: salvo pelo navegador não é garantia permanente de retenção. Quota, indisponibilidade
e divergência mantêm a memória e bloqueiam troca insegura; sem retry que contorne conflito.
Snapshots inválidos não são reparados. Respostas até 1000 UTF-16, transporte até 256 KiB;
análise de memória maior não autoriza transporte persistente. Sessões mantêm chaves/posição/
respostas/pontos separados; abertura/recarga começa na principal e retomada do responsável é
explícita. A listagem consulta só principal. Desktop Amplo continua escolhido antes da abertura.

Validação C2: 673 testes Node distintos aprovados nas 16 suítes LAB (13 novos); 238/238 Playwright em
quatro arquivos completos (32 novos). Rodada Node completa 672/672 e arquivo de aplicação
46/46 após acrescentar a recusa temporária: repetições não somadas ao total distinto.
Rodada Playwright completa 238/238 e quatro cenários ampliados de conclusão/recarga 4/4.
Sem falhas/retries/flaky/skips/omissões/timeouts nas rodadas finais. Fontes e artefatos
estáveis conforme reporters. Build, formato, lint, manifesto e diff aprovados.
Manifesto: 69 revisões, 50 specs, 850 casos descobertos. Relatório `tmp/lab2d6c2-faseA-20261108-000635/RELATORIO_FASE_A.md`.
Global integral aprovada conforme encerramento abaixo; liberação operacional local validada
no escopo da 6C.2, sem iniciar outras capacidades.
Pacotes exclusivamente sintéticos; sem piloto infantil ou publicação. Pronúncia real ainda
requer validação humana. source.identity.complete:false permanece independente; pins e políticas
não mudaram. Sem novas capacidades administrativas, banco, coordenador, motor ou infraestrutura.



Status histórico da LAB.2D.6A (fase estrutural anterior): validação estrutural implementada;
Fase B global integral aprovada. Naquela etapa, essa validação não autorizava reprodução,
importação, execução pedagógica, backup ou recuperação de v2. O estado vigente da integração
operacional é o descrito na seção LAB.2D.6C.2 acima.

Nota de escopo do manifesto: a limitação de `tests/lab-importacao.spec.js` sobre execução e
restauração fora da interface descreve o recorte da spec de importação, não a disponibilidade
atual da execução LAB. A execução operacional é coberta pela infraestrutura e pelos testes de
`tests/lab-execucao.spec.js`; interfaces de restauração continuam não implementadas. O texto
do manifesto permanece preservado, sem manutenção de corpus, pins ou homologação seletiva.



### Encerramento global — LAB.2D.6C.2

Fase B aprovada em 08/11/2026: **1340/1340 Node e 850/850 Playwright**, saída 0,
sem falhas/retries/flaky/skips/omissões/timeouts/interrupções. Duração total 59min07s
(Playwright 56,5min). Descoberta coincide com manifesto: 69 revisões e 50 specs.
Integração operacional local v2 validada; v1, sessões, Desktop Amplo, áudio e recuperação
preservados. Sem interfaces novas de exportação/restauração/administração ou piloto real.
Fontes/artefatos estáveis durante a suíte. 229 evidências/38.819.575 bytes protegidos em
cópias SHA-256 válidas reutilizadas da Fase A; dez arquivos regenerados pelo runner mantêm
suas versões anteriores nas cópias. 18.222 históricos e 29 PNGs íntegros, nove vínculos válidos.
HEAD/branch mantidos, staging vazio. source.identity.complete:false permanece independente;
pronúncia real continua dependendo de validação humana. Nenhum pin/política alterado.
Log `tmp/lab2d6c2-global-20261108-004329/npm-test.log`; relatório `tmp/lab2d6c2-global-20261108-004329/RELATORIO_FASE_B.md`.

## LAB.2D.6C.1 — preparação compartilhada (Fase A)

Reconhecimento para análise, sem liberação operacional. `LabValidador.reconhecerPacote(JSON)`
revalida v1/v2, recalcula o SHA-256 do canônico original (incluindo formato) e retorna
`admissaoOperacional:false`. Não aceita objetos marcados como válidos ou digest recebido.
V1 reutiliza seu validador e conserva os vetores históricos; em v2 a unidade padrão continua
explicitada pelo contrato 6A. O digest pode coincidir numericamente com digestContrato,
mas nenhum resultado de análise constitui aquisição, registro ou autorização de escrita.
Endereço futuro continua perfil/ID/versão; copyId/origem, matéria, digest e sessão mantêm
seus papéis existentes. Formatos diferentes no mesmo endereço conflitam; não há migração,
namespace novo ou mudança do prefixo LAB v1.

`projetarPacoteLab`, privada ao motor, é a única projeção pedagógica: o adaptador 6B,
a comparação de configuração e o contexto de snapshots a reutilizam. Preserva IDs/ordem,
1–6 itens, idioma/unidade e respostas:[texto]; apresentação fixa neutra. A comparação
ignora sucesso dos dois lados, como mensagem interna sem efeito no avaliador/pontuação.
Demais propriedades pedagógicas continuam comparadas integralmente.

`criarValidadorSnapshotLab` agora reconhece os dois formatos, sem registro/lease/IO.
`validarSnapshot(sessao,corpo)` deriva o vínculo do pacote revalidado;
`analisarSnapshot(sessao,{vinculo,snapshot})` exige o vínculo exato, e
`correspondeConfiguracao(config)` confere a mesma projeção prevista para execução.
Nenhum desses métodos instala estado ou autoriza restauração. Mantido snapshot versão 1,
com os oito campos existentes, arrays posicionais, avaliador oficial, conferências,
correções e pontos históricos. Snapshot inválido é recusado sem reparação; resposta até
1000 UTF-16. Análise lógica/captura pode conservar memória acima de 256 KiB, mas isso não
certifica transporte ou durabilidade; journal e progresso mantêm seus limites de 256 KiB.
Não foram persistidos snapshots v2 nem migrados snapshots v1.

Decisão: conservar `lab-backup-v1`, versão 1. Sua estrutura comporta pacotes originais
v1/v2 e ambas as sessões, independentemente da versão individual da atividade.
A ampliação PREPARADA é explícita e somente analítica:
`LabBackup.analisarContratoBackup` usa o mesmo analisador integral com reconhecimento
versionado, digest original e contexto estrito de snapshots. O resultado é apenas dado,
sem captura/plano/capacidade de exportação ou aplicação. `validarBackup`, `inspecionarBackup`
e `construirBackup` continuam operacionais exclusivamente v1. Leitores atuais recusam o
backup inteiro se houver v2/desconhecido; não há aceitação parcial. Backups antigos mantêm
JSON/envelope/digests idênticos. Não se criou lab-backup-v2.

`LabJournal.analisarContratoJournal(texto,destino,basesJSON?)` reutiliza o analisador
fechado do journal, incluindo canônicos, digests, snapshots, etapas e payload terminal.
Bases de preservação são exclusivamente um backup JSON revalidado em memória; não recebe
repositório ou capacidade. Reconhece v1/v2 sem consultar/gravar banco, chaves ou journal.
Não comprova a presença dessas bases no dispositivo. Todos os fluxos persistentes continuam
pelo validador operacional v1, inclusive revalidações de planejamento, aplicação,
reconciliação, retomada e encerramento. LabRestauracao mantém a recusa antes de abrir
repositório ou emitir plano. Resultados analíticos não são tokens dos WeakMaps existentes.

Pendências LAB.2D.6C.2: integrar reconhecimento e projeção às fronteiras autênticas de
repositório/coordenador/motor, preservando conflitos/locks/bases; ampliar coerentemente TODAS
as revalidações operacionais de backup/restauração/journal/retomada, incluindo terminal;
comprovar persistência/recarga e recuperação nas duas sessões com identidade original.
Somente então avaliar admissão pública como conjunto. Importação/cadastro/execução,
progresso persistente, exportação/backup e recuperação operacionais v2 permanecem bloqueados.
Não há flag de liberação ou importação alternativa.

Interface futura: lab-importacao (prévia/título/ID), lab-listagem (título/metadados) e
lab-execucao (registro/título/questões) precisam usar apresentação neutra sem reutilizar
metadados/IDs brutos em HTML/aria. Nenhuma dessas interfaces foi liberada ou alterada
para v2 nesta fase. Sem promessa de ocultação da memória/código do navegador.
Áudio, sessões, Desktop Amplo e prazo de 3 segundos não foram alterados; qualidade acústica
continua exigindo validação humana. source.identity.complete:false é pendência da evidência
do checkout, independente da identidade operacional LAB; pins/políticas não mudaram.

Validação da Fase A aprovada: 660 testes Node distintos nas 16 suítes LAB, incluindo
20 novos. Primeira rodada completa 658/658; após os dois cenários adicionais, arquivos
completos de snapshots/journal 68/68, sem somar repetições. Playwright: 206/206 nos quatro
arquivos completos de importação, listagem, execução e contratos oficiais (9min02s), sem
falhas/retries/flaky/skips/omissões/timeouts/interrupções. Reporter sem mudanças de fontes
ou artefatos durante a execução. Build, formato, lint, manifesto e diff aprovados.
Manifesto preservado: 69 revisões, 50 specs, 818 casos descobertos. Fase B global aprovada
conforme encerramento abaixo; admissão v2 segue bloqueada e 6C.2 não iniciada.
Evidências: 229 arquivos/38.828.205 bytes e cópias verificadas, 13.997 históricos e os
29 PNGs/2.893.454 bytes íntegros por SHA-256; nove vínculos válidos. Revisões oficiais e
módulos de identidade, armazenamento, coordenador, restauração, interface e áudio intactos.
HEAD e branch mantidos; staging vazio; alterações acumuladas preservadas.
Logs e relatório: `tmp/lab2d6c1-faseA-20261107-201404/RELATORIO_FASE_A.md`.



### Encerramento da Fase B — LAB.2D.6C.1

Global final aprovada em 07/11/2026: **1327/1327 Node e 818/818 Playwright**, saída 0,
sem falhas/retries/flaky/skips/omissões/timeouts/interrupções na execução final.
Duração total 57min51s; Playwright 55min15s. Manifesto e descoberta: 69 revisões, 50 specs.
Fontes e artefatos estáveis durante a execução. Reconhecimento/projeção/snapshots e análise
de backup/journal aprovados; envelope backup-v1 e contratos oficiais preservados.
Admissão operacional v2 continua bloqueada em todos os caminhos; 6C.2 não iniciada.
Primeira tentativa falhou em fixture histórica de coalescência: controle determinístico
de relógio e retenção apenas da primeira consulta, como nas fixtures vizinhas 6B,
sem alterar produção ou prazo de 3000 ms; arquivo completo 23/23 aprovado.
Segunda tentativa interrompida por queda de energia no Playwright, sem resultado terminal;
log e reporter incompletos preservados. Terceira tentativa integral aprovada.
Antes da reexecução foram copiados 35.987 arquivos/1.905.042.971 bytes com SHA-256 verificado.
35.958 arquivos temporários do runner foram regenerados/removidos pelo próprio runner;
as versões anteriores continuam integralmente nas cópias verificadas. Nenhuma limpeza manual.
17.552 históricos intactos, 29 PNGs originais idênticos, nove vínculos válidos.
Referências anteriores da Fase A e baseline-complementar preservados separadamente da
referência pós-implementação e do reporter da global. source.identity.complete:false
continua independente; pins/políticas/classificações não mudaram.
HEAD/branch mantidos; staging vazio; alterações acumuladas preservadas.
Log `tmp/lab2d6c1-global-20261107-224132-apos-queda/npm-test.log`; relatório `tmp/lab2d6c1-global-20261107-224132-apos-queda/RELATORIO_FASE_B.md`.

## Decisão de versionamento (contrato 6A)

Escolhido `lab-questionarios-v2`, explícito e fechado. V1 só declara opcoes/campos,
perguntas exibidas e respostas/variantes. Adicionar flags ditado ou reaproveitar pergunta
como texto oculto mudaria sua semântica, a canonicalização e os caminhos de correção.
Um envelope de extensão seria outro formato e exigiria o mesmo reconhecimento dos
consumidores, além de criar uma segunda identidade/envelope desnecessária.
V2 delimita esta nova estrutura: apenas questões ditado. Mistura de tipos não é oferecida.

A versão do formato não é `versao`: esta continua a versão da atividade (1..9999).
O formato v1 e seus vetores canônicos/digests permanecem byte a byte iguais.
Não há migração, recalculação de registros antigos ou ampliação silenciosa de v1.

## APIs e bloqueio de admissão

`LabValidador.validarContratoDitado(entrada)` recebe JSON string ou Uint8Array e usa
os mesmos parser/prechecagem de Unicode, duplicatas, estrutura, canonicalizador e SHA-256.
Sucesso: valido, contratoNormalizado, canonico, digestContrato, admissaoOperacional:false.
Não retorna pacoteNormalizado/digest operacionais. Fracasso usa erros ordenados com
código, caminho e mensagem; sem digestContrato. Não lê DOM/áudio/armazenamento/rede.
A única normalização estrutural é explicitar unidade palavra quando ausente.
Ordem de propriedades/escapes JSON não mudam o resultado. Strings v2 devem já estar em NFC.

`validarPacote` NÃO chama essa função e continua aceitando somente v1. Todos os caminhos
operacionais atuais seguem por validarPacote: importação/prévia, repositório/cadastrar,
leitura de registros, coordenador temporário e journal, abertura operacional do motor,
backup, restauração, reconciliação e retomada. Os contextos puros de análise foram ampliados
na 6C.1, conforme seção atual acima; isso não amplia a admissão. Não produzir registros parcialmente
suportados. Campo ou argumento extra não autoriza v2 nesses caminhos.

## Campos fechados

Raiz: formato, id, versao, perfil, materia, titulo, questoes.
ID/versionamento/perfis/matérias seguem os enums e limites v1 (Alice/Mariana; matérias
já enumeradas). Título até 120 unidades UTF-16. Não há campo layout, código ou áudio.

Questão: id, bloco (80 UTF-16), titulo (120), instrucao (500), tipo ditado,
idioma (pt-BR ou en-US), unidade opcional (palavra/frase), itens.
Palavra é padrão, frase é escolha explícita. Não há dica com resposta ou pergunta a exibir.
Instrução/título/bloco são texto exibível de orientação; autores não devem inserir neles
o alvo/gabarito. A validação sintática não prova sigilo semântico de instruções livres.

Item: id e texto, somente. Texto é a fonte única do que será falado e do gabarito fechado;
respostas, textoDitado separado, URLs, voz, velocidade, SSML, scripts e arquivos são
propriedades desconhecidas. A futura adaptação poderá derivar internamente respostas:[texto].
Isso não cria campo de resposta preenchido: escrever continuará sendo ação da criança.

## Limites e política textual

- Transporte: 256 KiB UTF-8, profundidade 8, 10000 tokens, até 20 erros (já existentes).
- 1..30 questões, 1..6 itens por questão; IDs únicos no pacote, padrão v1.
- Palavra: 1..40 unidades UTF-16, uma unidade lexical; sem espaços ou pontuação final.
- Frase: 2..12 unidades separadas por exatamente um espaço ASCII, até 160 UTF-16 no total;
  cada palavra até 40 UTF-16. Pontuação opcional ao final de cada unidade: , . ! ? ; :.
- Letras admitidas no alvo: A-Z, a-z, U+00C0..00D6, U+00D8..00F6, U+00F8..00FF.
  Apóstrofo ASCII, apóstrofo U+2019 e hífen ASCII só ligam grupos de letras dentro da palavra.
  Números, emojis, símbolos, URLs, barras, tags, comandos e alfabetos fora desse recorte não são admitidos.
- Todos os textos v2: NFC prévio, sem espaços nas extremidades, HTML <>, controles,
  formatação invisível/bidi (categorias Cc/Cf) e separadores de linha/parágrafo Zl/Zp.
  Nada é truncado, aparado, corrigido ou convertido silenciosamente. Texto vazio é inválido.
- Surrogates isolados, UTF-8 inválido, BOM e chaves duplicadas continuam recusados pelo parser.

UTF-16 é intencional: o motor histórico limita respostas com slice(0,1000), em unidades
UTF-16, enquanto v1 mede limites textuais de transporte em pontos de código e normaliza NFC.
V1 não foi alterado. Em v2 o limite falado é 160 UTF-16, menor que 1000, sem grafemas
astrais no alvo. Metadados podem conter caracteres astrais válidos, contabilizados como
2 unidades (ex.: 60 emojis = 120 UTF-16 no título). Não confundir bytes, pontos de código,
UTF-16 e grafemas. Não afirmar suporte a todos os Unicode/idiomas.

## Exemplos sintéticos

Palavra padrão:

```json
{"formato":"lab-questionarios-v2","id":"palavra-sintetica","versao":1,"perfil":"alice","materia":"gramatica","titulo":"Escutar e escrever","questoes":[{"id":"q1","bloco":"Escrita","titulo":"Escute com atenção","instrucao":"Ouça e escreva a palavra.","tipo":"ditado","idioma":"pt-BR","itens":[{"id":"i1","texto":"café"}]}]}
```

Frase curta explícita:

```json
{"formato":"lab-questionarios-v2","id":"frase-sintetica","versao":1,"perfil":"mariana","materia":"ingles","titulo":"Escutar e escrever","questoes":[{"id":"q1","bloco":"Escrita","titulo":"Escute com atenção","instrucao":"Ouça e escreva a frase inteira.","tipo":"ditado","idioma":"en-US","unidade":"frase","itens":[{"id":"i1","texto":"The sun is bright."}]}]}
```

Não são arquivos importáveis nesta etapa. digestContrato é só a impressão do contrato;
o campo formato entra no canônico. Nenhum consumidor operacional adota esse digest como
identidade de atividade, sessão ou autorização. Identidade local copyId/origem não mudou.
O repositório identifica atividade por perfil/id/versao e recusa digest divergente; formato
não é outro endereço para sobrescrever uma atividade. Trocar formato não migra nem substitui
um registro v1; admissão futura deverá respeitar conflito e versionamento da atividade.

## Snapshots, backup e recuperação: dependências futuras

Snapshot v1 do motor contém respostas, posição, pontos e conferências; não uma cópia do
pacote nem tipo/idioma textual. Seu vínculo exige pacote/perfil/matéria/id/versão/digest/sessão.
A análise é ligada ao avaliador e às questões conhecidas (opcoes/campos), não a tipos novos.
RegistrarLab também continua recusando tipo ditado. O formato do snapshot não mudou.

Lab-backup-v1 revalida cada pacote com validarPacote; v2 é recusado antes de validar sessões.
Restauração e journal reutilizam esse bloqueio. Reconciliação/retomada revalidam pacote,
digest e bases atuais; não reconhecem v2 por ter digestContrato. IndexedDB e chaves
revisoesEscolares.lab.v1... permanecem intactos. Nenhuma afirmação de recuperação v2.

LAB.2D.6B/C deverão preparar, com testes, adaptação de questão ao motor/avaliador, validação
estrita do snapshot nos dois idiomas/unidades, conexão autêntica/configuração correspondente,
backup/journal/restauração e admissão ponta a ponta. Não basta ampliar validarPacote.
A evolução de lab-backup-v1 ou das chaves deverá ser avaliada formalmente, sem migração implícita.

## Integração de áudio identificada, não implementada

gramatica-questionarios.js já renderiza campos ditado sem gabarito antecipado quando a
configuração confiável usa ditado/unidadeDitado; GramaticaDitado usa textoDitado ou a primeira
resposta como fonte, e AudioRevisoes.falar/repetir/parar para solicitações explícitas.
O formulário não preenche o input ao ouvir. Pontos e correção continuam no avaliador.
Renderização/desativação chamam GramaticaDitado.parar; guards LAB protegem eventos antigos.

AudioRevisoes já suporta pt-BR/en-US, palavra/frase, cancelamento e prefixos de proteção
Chromium. Porém GramaticaDitado atualmente fixa pt-BR e o painel diz português. En-US exige
integração explícita futura (inclusive rótulos), sem criar speechSynthesis paralelo.
Troca de questão/sessão/atividade deverá cancelar fala, repetir/parar funcionar sem gravar
progresso auditivo ou pontuar por ouvir. Não há microfone, Azure ou reconhecimento.

Sessões principal/responsavel, Desktop Amplo, foco, navegação segura e Web Locks mantêm
os contratos existentes para v1. Compatibilidade v2 com eles está planejada, não executada.

## Validação e checkpoint

Fase A aprovada: 516 testes Node (validador, identidade/repositório, motor,
snapshots, backups, restauração, journal, reconciliação, retomada e encerramento) e
153 Playwright (76 execução LAB, 51 importação e 26 contratos oficiais). Novo teste
Chromium demonstra análise estrutural válida com recusa de importação/cadastro/snapshot/
aquisição journal, sem alterar banco ou progresso. Build, formato, lint, manifesto e diff
aprovados. Manifesto: 69 revisões, 50 arquivos, 802 casos. Logs e relatório em
`tmp/lab2d6a-faseA-20261107-164600/`.
Global integral aprovada em 07/11/2026: 1306/1306 Node e 802/802 Playwright,
saída 0, sem falhas/retries/flaky/skips/omissões/interrupções/timeouts. Duração total
54min58s (Playwright 52,6min). Descoberta corresponde ao manifesto: 69 revisões e 50 specs.
Compatibilidade v1 e validação estrutural v2 aprovadas; admissão operacional v2 segue
bloqueada. Fontes e artefatos estáveis durante a execução conforme reporter.
Evidências: 226 arquivos/37.952.792 bytes em cópias verificadas por SHA-256; 2116 históricos
idênticos. Doze capturas regeneradas em test-results mantêm suas versões anteriores nas
cópias preservadas. Os 29 PNGs de output continuam idênticos e os nove vínculos válidos.
source.identity.complete:false permanece independente, sem alteração de pins/políticas.
Log `tmp/lab2d6a-global-20261107-170758/npm-test.log`; relatório `tmp/lab2d6a-global-20261107-170758/RELATORIO_FASE_B.md`.
LAB.2D.6A validada integralmente no escopo de contrato; LAB.2D.6B não iniciada.


source.identity.complete:false continua separado.

## LAB.2D.6B — integração interna (global aprovada)

`QuestionariosRevisoes.adaptarContratoDitadoLab(JSON)` revalida pela API estrutural v2
e retorna apenas configuração pedagógica, título neutro e admissaoOperacional:false.
Não registra, abre, adquire ou persiste. Objeto com valido:true não é autorização.
Nenhum caminho público chama o adaptador; validarPacote continua exclusivo v1.

Adaptação: questão ditado vira campos + ditado:true, unidadeDitado e idiomaDitado
fechados; itens mantêm IDs/ordem e derivam respostas:[texto]. Sem cópia separada de fala:
GramaticaDitado usa a primeira resposta. Um a seis itens são um a seis campos; o ponto
é por questão, só quando TODOS os itens são corretos, conforme o avaliador existente.
Normalização existente preservada: trim, espaços, caixa e acentos opcionais conforme
flags já existentes, sem aproximação ou retirada de pontuação adicional.

Sigilo: nenhum título/bloco/instrução/dica recebido é exibido pela configuração adaptada,
mesmo se repetir literalmente o alvo. Textos apresentados são fixos e genéricos em
português, labels Item N. IDs originais permanecem na memória, mas input/for usam IDs
neutros sem q.id nesse opt-in. Não há texto alvo em botões/aria/value antes de escrever.
Coincidência incidental com palavras genéricas dos controles não identifica a resposta;
não há promessa de ocultação contra inspeção técnica da memória/código do navegador.
A futura camada LAB também deverá usar o título neutro, sem reintroduzir metadados brutos.

GramaticaDitado recebe idiomaDitado opt-in en-US; ausência ou outros valores conservam
pt-BR. Painel identifica inglês/português; controles/instruções continuam em português.
Mesmos AudioRevisoes.falar/repetir/parar, velocidade oficial existente e seleção local.
Nenhum novo speechSynthesis, microfone, serviço, velocidade configurável ou voz arbitrária.

Handlers/feedback do ditado verificam formulário conectado e guard do render/execução.
Eventos de nós antigos são inertes. AudioRevisoes mantém seus tokens nativos para eventos
tardios de síntese. Desativação LAB interrompe áudio antes de aguardar drenagem; renderização,
troca de sessão/atividade/perfil e desativação visual reutilizam cancelamento existente.
Repetir nasce desabilitado em cada nova questão; não retoma a questão anterior.

Testes sintéticos usam apenas instrumentação na página de teste: aquisição v1 autêntica
para Web Lock e conexão instrumentada com pacote pedagógico adaptado e canal de memória.
O digestContrato NÃO é identidade dessa aquisição; ela não demonstra identidade v2.
Nenhuma substituição de conexão existe no produto. Snapshots lógicos são observados só
em memória da fixture, sem persistir registros v2. Regressões reais v1 verificam locks,
progresso/backup e fronteiras operacionais inalteradas. O harness não habilita admissão.

Dependências LAB.2D.6C: identidade/digest operacional próprios; vínculo exato adaptado e
comparação de configuração; índices alinhados aos IDs/ordem; respostas/conferências/pontos
históricos/posição/sessão/versão; análise estrita de snapshots e compatibilidade com backup,
journal, reconciliação e retomada. Não basta ampliar validarPacote ou usar digestContrato.
Admissão, backup e recuperação públicos v2 continuam recusados. Nenhum snapshot v1 migrou.
Pronúncia real ainda requer validação humana; mocks só comprovam payload/idioma/cancelamento.

### Validação da integração 6B

Fase A aprovada: 169 Playwright (92 execução LAB, com 16 novos; 51 importação;
26 contratos oficiais de áudio/ditado/opt-ins) e 284 Node (validador v1/v2, registro,
motor, snapshots, backup, journal e restauração). Rodada final dos 16 novos também
aprovada após reforço de correção parcial/capturas, sem somar repetições aos totais.
Build, formato, lint, manifesto e diff aprovados. Manifesto: 69 revisões, 50 specs,
818 casos. Logs e relatório em `tmp/lab2d6b-faseA-20261107-182226/`.
Áudio compartilhado, validador e persistência protegidos por hash; 29 PNGs intactos,
nove vínculos válidos. source.identity.complete:false continua separado. Global não
iniciada; exige autorização. Pronúncia real ainda não validada por estes mocks.

### Encerramento da Fase B — LAB.2D.6B

Global final aprovada em 07/11/2026: 1307/1307 Node e 818/818 Playwright,
saída 0, sem falhas/retries/flaky/skips/omissões/timeouts/interrupções na execução final.
Duração final 55min35s (Playwright 53,1min). Descoberta coincide com manifesto: 69 revisões,
50 specs. Duas tentativas anteriores pararam em Node por fixtures históricas que retinham
consultas coalescidas de identidade e disputavam o prazo de 3 s. Correções somente em
lab-snapshots.unit.cjs e lab-motor-progresso.unit.cjs: relógio controlado no cenário de
pendência autorizada e somente primeira consulta retida. Novo teste confirma suspensão
em 3000 ms, sem reativação/escrita por resposta tardia; prazo/produção não mudaram.
Ambos os arquivos completos 52/52 aprovados antes da global final; logs reprovados mantidos.
Fontes e artefatos estáveis durante a execução final. Evidências: 226 arquivos/37.992.985
bytes preservados em cópias verificadas por SHA-256; 2228 históricos idênticos. Oito capturas
regeneradas conservam as versões anteriores nas cópias; 29 PNGs originais idênticos,
nove vínculos válidos. Identidade integral continua pendente, sem pins/políticas alterados.
Log `tmp/lab2d6b-global-20261107-185322-fixtures-controladas/npm-test.log`; relatório `tmp/lab2d6b-global-20261107-185322-fixtures-controladas/RELATORIO_FASE_B.md`.
Admissão operacional v2 continua bloqueada; qualidade acústica exige validação humana.
LAB.2D.6B validada integralmente no escopo técnico. LAB.2D.6C não iniciada.
