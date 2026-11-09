# Laboratório de Atividades Avulsas — contrato LAB.1

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

## LAB.2D.6C.1 — preparação compartilhada, sem admissão v2

Reconhecimento puro versionado em LabValidador, projeção pedagógica única no motor e
análise estrita de snapshots das duas sessões. Identidade futura deriva do pacote original,
nunca da projeção; perfil/ID/versão continuam o endereço lógico, sem namespace/migração.
`reconhecerPacote`, `criarValidadorSnapshotLab`, `analisarContratoBackup` e
`analisarContratoJournal` não concedem escrita/aquisição. O journal reutiliza seu analisador
fechado, inclusive estados interrompidos e encerramento, sobre bases JSON de análise.
Mantidos snapshot versão 1 e envelope lab-backup-v1: adequados estruturalmente, sem alteração
semântica dos caminhos operacionais atuais, que continuam aceitando só atividades v1.
Restauração, reconciliação e retomada persistentes v2 permanecem bloqueadas.
Contrato, limites, testes e dependências da 6C.2 em [LAB_DITADOS_V2.md](LAB_DITADOS_V2.md#lab2d6c1--preparação-compartilhada-fase-a).
Fase A aprovada: 660 Node distintos (20 novos), 206 Playwright, build/formato/lint/manifesto/diff.
Manifesto: 69 revisões, 50 specs, 818 casos. Relatório `tmp/lab2d6c1-faseA-20261107-201404/RELATORIO_FASE_A.md`.
Global integral aprovada: 1327 Node e 818 Playwright, saída 0, sem falhas/retries/skips;
57min51s. Encerramento e preservação em LAB_DITADOS_V2.md e
`tmp/lab2d6c1-global-20261107-224132-apos-queda/RELATORIO_FASE_B.md`. Nenhuma interface de importação,
listagem, execução ou recuperação v2 liberada. source.identity.complete:false separado.


**Situação: LAB.2D.4 acrescenta alternância explícita de sessões à execução persistente LAB.2D.3; Fase B global integral aprovada.** LAB.2A implementa
somente o validador isolado descrito na seção 4; LAB.2B.1 acrescenta identidade e repositório
isolados; LAB.2B.2 acrescenta o coordenador de sessões e Web Locks e LAB.2B.3, canais de
progresso com durabilidade observável (seção 5); LAB.2C.1 acrescenta registros inativos por
handle no motor e LAB.2C.2 permite execução/progresso assíncrono exclusivamente por API
controlada (seção 3); LAB.2C.3 acrescenta captura e prévia de snapshots sem aplicação e
LAB.2C.4, construção/validação de backups inteiramente em memória, e LAB.2C.5A,
planejamento de restauração exclusivamente por leitura; LAB.2C.5B acrescenta contrato de
journal e detecção de pendências. LAB.2C.5C.1 acrescenta confirmação específica e gravação
operacional exclusivamente da intenção no journal (seção 7). LAB.2C.5C.2 permite aplicação
isolada somente de conteúdo/snapshots ausentes, com autorização separada e journal por etapa;
LAB.2C.5C.3 acrescenta diagnóstico e reconciliação explícita somente do journal, sem recriar
dados ausentes. LAB.2C.5C.4 acrescenta retomada explícita da mesma intenção, criando somente
ausentes originalmente autorizados após nova confirmação. Continua sem uso pelo aplicativo ou
recuperação automática. LAB.2C.5C.5 permite encerramento explícito apenas da intenção
comprovadamente nunca aplicada, preservando o histórico. LAB.2D.1 oferece consulta visual;
LAB.2D.2 acrescenta prévia e importação persistente; LAB.2D.3 integra execução persistente
na sessão principal. Backup e recuperação continuam sem integração visual. Os demais módulos e APIs abaixo são propostas,
não capacidades disponíveis.
Não autoriza implementação, piloto, publicação, limpeza nem operações ORG.

Base examinada em 04/11/2026: `802489526a244be95cc89458ac68a0b5c2fe5349`, branch
`codex/lab-1-contrato-arquitetura`, worktree `lab-1-contrato-arquitetura`, inicialmente limpa.
Precedência: `AGENTS.md`, [instruções](../INSTRUCOES_PROJETO.md), documentos temáticos.

### Integração interna de ditados — LAB.2D.6B (validada integralmente)

Adaptador puro no motor e idioma en-US opt-in no ditado compartilhado, sem novo avaliador
ou sintetizador. Apresentação neutra e guards de formulário/render/execução impedem
vazamentos triviais por metadados e eventos obsoletos. Testes sintéticos sem armazenamento
v2. Admissão operacional, backup e restauração v2 continuam bloqueados; 6C não iniciada.
[Contrato e limites da integração](LAB_DITADOS_V2.md).

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


### Contrato de ditados — LAB.2D.6A (validada integralmente)

[Contrato v2 e dependências futuras](LAB_DITADOS_V2.md). Nova função pura
`validarContratoDitado` analisa lab-questionarios-v2, sem admissão operacional.
`validarPacote` continua exclusivo v1; pacote/digest/snapshot/backup/journal anteriores
não mudam. Ditados v2 permanecem bloqueados em importação, execução e recuperação.
Sem áudio, controles visuais, avaliador ou infraestrutura paralelos.

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


### Desktop Amplo — LAB.2D.5 (validada integralmente)

Inspeção direcionada confirmou: `montarRevisao` aplica `layout.desktopAmplo` e
`desativarVisual` remove a classe oficial. A configuração é copiada/congelada no registro;
não há API de troca visual ativa. Por isso, Estudar atividades oferece checkbox antes
de iniciar/continuar, com orientação do momento de aplicação. Para mudar a escolha,
retorne ao Laboratório e abra novamente, sem fechamento motivado por um controle visual.
A preferência é temporária e reiniciada na listagem/recarga, sem chave permanente.

O registro LAB passa a aceitar opcionalmente apenas `layout: {desktopAmplo: boolean}`
no construtor confiável, fechado contra campos extras e copiado/congelado pelo mecanismo
existente. O JSON importado continua recusando layout; formato/digest/versão permanecem
iguais. Nenhuma API legada, normalização, transporte, snapshot, journal ou banco mudou.
`lab-execucao.js` captura a escolha antes da abertura e fornece a configuração interna.
Motor e CSS oficiais continuam aplicando o layout em cada montagem, inclusive nas duas
sessões e nas retentativas, sem novo handle/coordenador/aquisição na alternância.

O CSS amplo existente só expande no breakpoint desktop (1120px), com campos e alternativas
em duas colunas; no celular preserva a adaptação existente. Sem CSS amplo paralelo ou
mudança de estilo global. Controle nativo com rótulo, foco visível, teclado e toque.
Identificação textual informa a apresentação selecionada; não há falso botão de troca ativa.
Fase A aprovada: 139 Playwright (76 execução, incluindo nove novos casos LAB.2D.5;
37 listagem; 26 contratos oficiais de opt-ins) e 75 Node de registro/motor/snapshots.
Build, formato, lint, manifesto e diff aprovados. Manifesto: 69 revisões oficiais,
50 arquivos e 801 casos. Capturas de 390/1366/1920 inspecionadas; geometria também em 2560.
Evidências e logs em `tmp/lab2d5-faseA-20261107-021855/`. Tentativas iniciais preservadas:
atribuição redundante a configuração congelada removida; expectativa nova corrigida para
respeitar revisão oficial já optante. Rodada final integral dos arquivos direcionados aprovada.
Os 29 PNGs preexistentes de output permanecem idênticos por SHA-256; nove vínculos válidos.
Global integral aprovada em 07/11/2026: 1273/1273 Node e 801/801 Playwright,
saída 0; sem falhas, retries, flaky, skips, omissões, interrupções ou timeouts.
Duração total 55min26s (Playwright 52,9min). Manifesto corresponde à descoberta real;
69 revisões oficiais e contratos Desktop Amplo/sessões preservados. Fontes e artefatos
estáveis durante a execução, conforme reporter. Evidências: 218 arquivos/36.141.877 bytes
preservados em cópias conferidas por SHA-256; 2020 arquivos históricos idênticos.
O runner regenerou 12 capturas em test-results, mantendo as versões anteriores
nas cópias verificadas. Os 29 PNGs de output seguem idênticos e os nove vínculos válidos.
Identidade integral continua pendente, sem alteração de pins/políticas/classificações.
Log `tmp/lab2d5-global-20261107-023704/npm-test.log`; relatório `tmp/lab2d5-global-20261107-023704/RELATORIO_FASE_B.md`.
LAB.2D.5 validada integralmente no escopo técnico. Próxima etapa não iniciada.



### Alternância de sessões — LAB.2D.4 (validada integralmente)

A interface LAB oferece Modo Responsável com confirmação e cancelamento explícitos.
A sessão separada é identificada por texto; Voltar à sessão da criança retorna à principal.
Abertura normal, recarga e retorno da lista sempre começam em principal. A lista continua
consultando apenas presença de progresso principal, sem inferir conclusão.

`lab-execucao.js` reutiliza o mesmo handle/coordenador: bloqueia comandos, aguarda
`desativar()` (inclusive coalescência), valida estritamente o canal de destino com
`criarValidadorSnapshotLab` e chama `abrir(coordenador,destino)`. A sessão só muda após
sucesso. Não usa liberar/encerrar/readquirir na troca; mantém o Web Lock da atividade.
Respostas, pontos e conclusão ficam exclusivamente no avaliador e nas chaves internas LAB.
Abrir sessão vazia não grava snapshot. Nenhuma preferência de ativação é persistida.

Durante transição, o gate recusa navegação/perfil/abertura concorrentes com orientação
para acionar novamente após a troca (não mantém intenção implícita). Persistência e novas
trocas também são bloqueadas. Guards do motor invalidam eventos de execuções anteriores.
Falha de desativação conserva memória; Tentar salvar novamente é retentativa explícita.
Falha após desativação mantém contexto/aquisição enquanto válidos e oferece Recuperar sessão
de origem, revalidando e reabrindo pelo mesmo handle, sem rollback. Sem origem reaberta,
comandos e saída permanecem bloqueados. Recuperação não é garantida após perda de identidade,
lock ou armazenamento. Aceite do navegador não garante retenção permanente.

Sem mudança de motor, API síncrona legada, catálogo oficial, transporte global ou formato.
Testes sintéticos ampliam execução e contrato do motor. Fase A aprovada: 209 Playwright
(18 novos casos LAB.2D.4) e 130 Node; build/formato/lint/manifesto/diff aprovados.
Logs `tmp/lab2d4-faseA-20261107-*.log`, artefatos em caminho novo próprio.
Manifesto conserva 69 revisões oficiais e passa a 792 casos. A aprovação global da Fase B está registrada abaixo. Global integral aprovada em 07/11/2026: 1272/1272 Node e 792/792 Playwright,
código 0; sem falhas, flaky, retries, skips ou casos omitidos. Duração total 57min50s
(Playwright 55,2min). Fontes e artefatos estáveis durante a execução conforme reporter.
Evidências preexistentes: 218 arquivos/36.127.357 bytes copiados e reconferidos por SHA-256;
136 logs históricos idênticos. Dez capturas de test-results regeneradas pelo runner têm
versões anteriores preservadas nas cópias verificadas. Os 29 PNGs de output permanecem
idênticos, e os nove vínculos válidos. Sem alteração de pins/políticas/classificações.
Log `tmp/lab2d4-global-20261107-011310/npm-test.log`; relatório `tmp/lab2d4-global-20261107-011310/RELATORIO_FASE_B.md`.
LAB.2D.4 validada integralmente no escopo técnico; identidade integral continua pendente.


### Execução principal e saída segura — LAB.2D.3

Na listagem, expandir **Estudar atividades**, então **Iniciar atividade** ou **Continuar
atividade**, conforme presença de progresso no armazenamento local. A consulta de presença
reutiliza o construtor de chave em `LabProgresso`, sem canal, sessão, parse, reparação ou
escrita. A presença não certifica integridade; abrir sempre repete as verificações completas.
Não altera o fluxo padrão de consulta/importação nem inicia estudo após importar.

`lab-execucao.js` mantém um contexto privado, sem pacote/handle/chave em DOM, dataset ou
evento global. Usa `abrirRepositorioExistente`/`consultar` para revalidar identidade atual,
digest observado, perfil e administração ativa; revalida pelo parser existente e inspeciona
journal existente. Falha, pendência ou alcance incerto bloqueiam. Prepara
`LabCoordenador.criarSessao().prepararExistente()`, exige modo persistente com mesma cópia/origem,
e `adquirir` obtém Web Lock exclusivo e repete a verificação de journal pelo contrato existente.

Abre somente o canal principal pelo coordenador, carrega e valida snapshot com
`QuestionariosRevisoes.criarValidadorSnapshotLab`; dado inválido bloqueia sem normalização
reparadora. Constrói configuração declarativa de pacote validado, perfil/matéria confiáveis,
ID interno aleatório e `chave:null` (o handle liga a chave autêntica do canal). Só então chama
`registrarLab(construtor)` e `handle.abrir(coordenador,'principal')`. O motor revalida vínculos,
pacote, chave, estado e autorização; não recebe JSON externo como configuração de registro.

Renderização, correção, pontos históricos, conferências, navegação e conclusão ficam no
motor compartilhado. Não há avaliador novo nem alteração de conteúdo do JSON v1. O resumo
final LAB não afirma salvamento incondicional; o botão final retorna pelo mesmo gate seguro.
Modo Responsável permanece desabilitado, sem sessão auxiliar conectada.

`handle.observarDurabilidade(callback)` transmite somente metadados congelados ao dono do
handle: pendente, não durável, resultado/código. Notificações acompanham mutação e conclusão
de gravação/coalescência, sem disparar retry. A ponte distingue preparação, gravação, escrita
aceita pelo navegador, conflito e falha; não promete retenção absoluta. Só **Tentar salvar
novamente** chama `persistir()` explicitamente. Falha de quota/identidade/lock não gera retry
automático. Durante estudo, o botão oficial de limpeza fica oculto.

`app.js` mantém navegação oficial síncrona quando o LAB está inativo. O gate LAB atua antes
de trocar perfil/tela e antes de abrir outro questionário, além de interceptar controles
de navegação por clique/teclado. Cancelamento durante abertura invalida o contexto antes de
liberar os recursos incompletos. Eventos de questões continuam protegidos pelos guards do
motor; cliques repetidos não criam handles nem encerramentos paralelos.

Saída ativa bloqueia interações, espera `handle.liberar()` (incluindo gravações pendentes e
snapshots coalescidos) e só após sucesso encerra o coordenador e retorna à listagem/perfil
ou executa a navegação solicitada. Retorno ao LAB restaura perfil, rolagem e foco na atividade.
Falha mantém a mesma memória, handle recuperável e reserva; reabertura do MESMO handle só
restaura renderização/guards, sem substituir memória por snapshot antigo. Não há descarte
forçado. Callback de saída fracassada não fica enfileirado para execução posterior implícita.

`beforeunload` solicita o aviso nativo se há alterações pendentes/não duráveis. Fechar,
recarregar ou matar o processo não garante execução de Promise; aceitar o aviso ou forçar
fechamento ainda pode perder memória. Identidade/locks suspensos e conflito conservador
podem impedir persistir/sair até verificação externa pelo responsável; não há reparação,
rollback, exportação ou recuperação automática nessa interface.

Spec permanente: `tests/lab-execucao.spec.js`, 49 casos sintéticos com IndexedDB,
localStorage e Web Locks nativos, mais injeção limitada de falhas/atrasos. Regressões de
consulta/importação são preservadas sem edição. Manifesto aditivo: 50 arquivos/774 casos,
sem mudança de catálogo, política, pin ou classificação dos 29 PNGs.

Direcionados aprovados: 49 execução + 87 consulta/importação + 11 regressões escolares/a11y.
Rodada combinada inicial 135/135; rodada final de execução/navegação 60/60 e reconferência
das quatro mensagens de falha/suspensão 4/4. Motor/coordenador/progresso/snapshots: 130/130
Node, incluindo observador autêntico, metadados sem respostas/chaves e revogação após liberar.
Manifesto: 19/19; build, formato, lint e diff aprovados.
Logs: `tmp/lab2d3-direcionados-2.log`, `tmp/lab2d3-direcionados-final.log`,
`tmp/lab2d3-mensagens-final.log`, `tmp/lab2d3-regressoes-node-vinculo.log`.
A primeira rodada ampliada teve uma falha de fixture: duplo clique sintético antes de o
evento nativo `toggle` criar os botões. O harness agora aguarda os botões; as asserções de
unicidade foram mantidas. Casos anteriores de consulta/importação não foram editados.
Capturas em 390×844, 1366×768 e 1920×1080 conferidas; sem overflow horizontal.

Global integral concluída em 07/11/2026, saída 0: 1272 testes Node e 774 Playwright aprovados
(51,0 min na fase Playwright), sem falhas, flaky, skips, retries ou casos não executados.
Log: `tmp/lab2d3-global-20261106-231431/npm-test.log`; registro:
`tmp/validacao/2026-11-07T02-17-06-781Z-a788e4df-ef79-483c-a798-31f7a74400bf/run.json`.
`status:passed`, `complete:true`, fontes/artefatos estáveis durante a execução.
Bundle SHA-256: `e7331f3b88074f7ce5db51280aa1e3b1d29431fca8725ab458d4635f10feb2a6`.
Os 271 arquivos/56.462.314 bytes preservados por cópia em `evidencias-anteriores/` dessa
execução tiveram todos os hashes reconferidos após a global. Nove vínculos e os 29 PNGs
atuais em `output/` continuam preservados, sem limpeza ou instalação.

Identidade integral permanece `source.identity.complete:false`, com 29 PNGs `unknown` e
motivo `Diagnostic evidence stale/unavailable; exclusion refused`. Aprovação funcional
não resolve essa pendência; nenhum pin, política ou classificação foi alterado. Somente
esta especificação e o inventário recebem os resultados depois da suíte; essa atualização
documental não faz parte do snapshot executado. Código, testes e bundle ficaram inalterados.
Modo Responsável, exportação, recuperação e demais etapas não foram iniciados.

### Prévia e importação explícita — LAB.2D.2

Na tela LAB, expandir **Importar atividade — Responsável**, selecionar JSON, conferir a
prévia e clicar **Confirmar importação**. Selecionar valida automaticamente; **Cancelar**
revoga a prévia e permite selecionar o mesmo arquivo novamente. A indicação Responsável
organiza o fluxo, sem autenticar a pessoa ou conceder uma autorização de sistema.

`lab-importacao.js` mantém bytes e contexto em closure privada. Recusa arquivos maiores
que `LabValidador.LIMITES.bytes` antes de `arrayBuffer`; passa `Uint8Array` original ao
validador estrito, sem remover BOM, reparar Unicode ou executar conteúdo. Só perfil,
matéria, título, ID, versão e quantidade de questões entram na prévia por `textContent`.
Não envia arquivo ao servidor, não expõe questões/respostas em DOM/dataset/log/evento e
não cria estado de progresso. Nenhum banco/schema é criado durante seleção ou prévia.

Prévia consulta banco existente, conflito de digest/administração e inspeção de journal
existente, sem criar ou alterar registros. Perfil diferente bloqueia e exige nova seleção
no perfil correto. Identidade indisponível ou alterada revoga a prévia. Não há fallback
temporário em memória nem persistência alternativa para `file://` ou IndexedDB bloqueado.

Na confirmação: revalidar identidade/origem, bytes/digest/perfil, consultar conflitos e
journal, abrir/criar somente então o banco pela API existente, repetir as verificações de
destino/bloqueios e chamar `repo.cadastrar(bytes)`. Conteúdo/administração continuam no mesmo
`readwrite`, com `add`, CAS da base e confirmação por `oncomplete`. O tratamento mínimo de
exceções síncronas nos dois `add` conserva o erro de quota e aborta atomicamente, sem
deixar conteúdo órfão. Não adiciona parser, mecanismo de cadastro, motor ou store.

Identidade/digest iguais produzem resultado idempotente; digest divergente exige versão
nova definida pelo responsável. Não sobrescreve pacote/administração nem reinicia progresso.
Journal relacionado pendente ou bloqueio global/incerto impede importar; erro da inspeção
também bloqueia. Terminais só são considerados pelo parser existente. Verificações de
identidade/journal continuam observações locais dos contratos existentes, sem autenticação
do servidor ou isolamento contra scripts de mesma origem.

Geração por seleção/contexto invalida callbacks ao cancelar, trocar arquivo/perfil ou sair.
Duplo clique e controles incompatíveis são bloqueados durante confirmação. Sair fecha a
conexão própria e revoga a UI, sem alegar desfazer uma transação já iniciada; ao reabrir,
um aviso orienta verificar a lista. Bytes e objetos de validação são liberados ao concluir.
Só o retorno `ok` de `cadastrar` autoriza anunciar cadastro confirmado. A listagem existente
retorna agora `{ok}` sem payload; falha/ausência da atualização resulta em mensagem distinta
de cadastro confirmado com lista indisponível. Não abre nem executa a atividade importada.

Controles nativos, rótulos, foco visível/restaurado, `aria-live`, `aria-busy`, botões com áreas
adequadas e quebra de títulos longos mantêm os três tamanhos de tela. Testes permanentes:
50 casos novos em `tests/lab-importacao.spec.js`; 37 anteriores de listagem preservados.
Fixtures são sintéticas; identidade HTTP e IndexedDB são reais no Chromium, com falhas
específicas injetadas. Manifesto aditivo registra 49 arquivos/725 casos, sem política nova.
Validação direcionada aprovada: 50 novos + 37 listagem + 11 regressões escolares/a11y
(`tmp/lab2d2-direcionados-final.log`, 98/98), 97 Node de persistência/journal e 19 do manifesto.
Build, formato, lint e diff aprovados. A primeira rodada
teve duas falhas: perda do código de quota dentro de callback de `add` (corrigida no
repositório) e fixture que examinava `:focus-visible` antes de usar teclado (corrigida
sem reduzir a asserção). Logs, traces e perfis das rodadas anteriores foram preservados.
Global integral concluída em 06/11/2026, saída 0: 1271 Node e 725 Playwright aprovados
(49,3 min na fase Playwright), sem falhas, flaky, skips, retries ou casos não executados.
Log: `tmp/lab2d2-global-20261106-200204/npm-test.log`; registro:
`tmp/validacao/2026-11-06T23-04-38-148Z-43ac6f69-21fa-4b7f-9b43-7e30830c9a46/run.json`.
`status:passed`, `complete:true`, fontes/artefatos estáveis durante a execução.
Bundle SHA-256: `325abc654ad09da461012afc2070d8eda61e58b2d794a10fef0850c7f961340e`.
Os 248 arquivos/48.422.757 bytes copiados para `evidencias-anteriores/` dessa execução
tiveram todos os hashes reconferidos após a global. Nove vínculos e os 29 PNGs atuais em
`output/` continuam preservados; nenhuma limpeza ou instalação foi realizada.

Identidade integral permanece `source.identity.complete:false`, com 29 PNGs `unknown` e
motivo `Diagnostic evidence stale/unavailable; exclusion refused`. Aprovação funcional não
resolve essa pendência; nenhum pin, política ou classificação foi alterado. Só este documento
e o inventário recebem o registro dos resultados depois da suíte; essa atualização documental
não faz parte do snapshot executado. Código, testes e bundle permaneceram inalterados.
Execução, exportação, recuperação e importação temporária continuam fora da interface.

### Listagem somente de leitura — LAB.2D.1

O botão **Laboratório de Atividades** fica no cabeçalho do painel de matérias. Usa o perfil
já escolhido e a tela `laboratorio` do roteador existente (`app.js`); voltar restaura painel,
rolagem e foco no botão, sem escolher o perfil novamente. O botão escolar de limpeza fica
oculto nesta tela. Início continua voltando ao seletor de perfis, inclusive após recarregar.

`lab-listagem.js` usa `LabIdentidade.resolverIdentidade`,
`LabRepositorio.abrirRepositorioExistente`/`listar(perfil)` e a nova
`LabJournal.inspecionarPendenciasExistentes`. Esta última reutiliza o parser e a inspeção
existentes, trocando somente a abertura interna por uma abertura de banco existente.
Não cria schema nem quando o banco desaparece entre as consultas. As APIs operacionais
anteriores mantêm seus contratos. Conexões próprias são fechadas ao concluir a leitura.

Banco ausente com identidade válida produz vazio; falta de identidade/IndexedDB, `file://`,
schema incompatível e corrupção produzem indisponibilidade/erro. A identidade é conferida
antes e depois da consulta; troca de cópia/origem suspende a apresentação. Uma geração local
invalida respostas após saída/troca de perfil. Não se cria sessão nem handle do motor.

Somente título, matéria, versão e situação administrativa são projetados e renderizados
por `textContent`, sem payload em DOM, datasets, eventos, logs ou globais da interface.
Pendências conhecidas geram aviso bloqueante; inspeção falha gera aviso inconclusivo.
Terminais concluídos/encerrados só deixam de bloquear conforme o parser real. A tela não
oferece execução nem qualquer operação administrativa, mesmo quando não há pendências.

`app.entry.js` importa estaticamente os módulos UMD da ponte e publica suas APIs após a
conversão CommonJS pelo build. O journal resolve o parser de backup como dependência,
sem chamar backup, recuperação, coordenador ou progresso. Ausência de API LAB na abertura
da tela não impede o aplicativo escolar. Não há registro de pacotes no catálogo oficial.

HTML e `css/lab-listagem.css` usam controles nativos, foco visível, estado `aria-live`,
carregamento com `aria-busy`, quebra de títulos longos e layout restrito à tela.
`tests/lab-listagem.spec.js` usa pacotes sintéticos e IndexedDB nativo no Chromium para
verificar leitura, perfis, identidade, journals, metadados, falhas, teclado, toque,
acessibilidade, três viewports, retorno, recarga e preservação do progresso oficial.

Validação direcionada: 37 casos da nova interface + 11 regressões escolares/a11y, 97 testes
de persistência/journal e 19 do manifesto aprovados. Build, formato, lint e diff aprovados.
Manifesto recebeu somente a spec e contagens atuais: 48 arquivos/675 casos; sem novo registro
de revisão oficial, mudança de política ou pin.

Global integral concluída em 06/11/2026, saída 0: 1271 testes Node e 675 Playwright aprovados
(47,7 min na fase Playwright), sem falhas, flaky, skips, retries ou casos não executados.
Log: `tmp/lab2d1-global-20261106-182233/npm-test.log`; registro completo:
`tmp/validacao/2026-11-06T21-25-16-852Z-9f01964b-2202-4833-a37b-92cd21a19ec2/run.json`.
`status:passed`, `complete:true`, fontes e artefatos inalterados durante a execução.
Bundle SHA-256: `30048bf2f2a9ef3baa40bf1256c362b9903ba503134a3b8bb72ef9ab312817a9`.
Os 229 arquivos/42.304.510 bytes preservados por cópia em `evidencias-anteriores/` dessa
execução tiveram todos os hashes reconferidos após a global; os nove vínculos permanecem
íntegros e os 29 PNGs atuais continuam em `output/`. Nenhuma limpeza foi feita.

A pendência de identidade integral da auditoria LAB.2C.6A continua independente da aprovação
funcional: `source.identity.complete:false`, 29 entradas `unknown` em `output/`, com motivo
`Diagnostic evidence stale/unavailable; exclusion refused`. Nenhum pin, política ou
classificação de evidências foi alterado. Esta especificação e o inventário recebem somente
o registro documental dos resultados após a suíte; essa atualização não pertence ao snapshot
executado. Não houve alteração posterior de código, testes ou bundle nem início da etapa seguinte.

## 1. Objetivo e escopo

Importar JSON local, validar, guardar e executar atividades temporárias de Alice ou Mariana
no motor `QuestionariosRevisoes`. Cada pacote declara um único perfil e uma matéria.
Não haverá import estático, cartão no catálogo oficial, alteração de registro oficial ou
spec Playwright permanente por pacote. A infraestrutura LAB terá testes permanentes próprios.

V1 admite apenas alternativas de resposta única e campos com gabarito fechado, de 1 a 30
questões. Não admite HTML, imagens, áudio, microfone, rede externa, URLs de recursos, funções,
expressões, módulos JS, seleção múltipla, associação, ordenação ou manipuláveis.
Uma matéria diferente de Gramática não habilita os motores especializados dessa matéria.
O JSON contém gabarito: não é instrumento de sigilo de prova ou controle de acesso.

O responsável importa e administra. A criança abre/retoma, responde e confere uma tarefa por
tela. Material deve ser original, adequado à série, autossuficiente e sem pergunta aberta
que exija adivinhar uma única resposta entre várias plausíveis.

## 2. Capacidades existentes e lacunas comprovadas

Inspeção pontual dos fontes desta base, sem execução ou certificação funcional nova:

| Fonte | Capacidade observada | Lacuna para LAB |
| --- | --- | --- |
| `ambiente_interativo/js/gramatica-questionarios.js` | `QuestionariosRevisoes` é alias de `GramaticaQuestionarios`; `registrar`, `abrir`, `obterEstado`, `obterSituacao`, `limpar`, `desativar`, sessões opt-in; painel compartilhado | `registrar` verifica basicamente ID não repetido e questões não vazias; não valida JSON externo nem oferece retirada do registro/cache |
| Mesmo fonte | `abrir` restaura a chave principal, configura navegação e chama `mostrarTela('gramaticaMariana')`; `desativar` cancela ditado e limpa referências da sessão | Desativar não remove cadastro; falta retorno específico ao LAB e fechamento controlado de uma entrada dinâmica |
| Mesmo fonte | Normalizador estrito filtra IDs/opções e reavalia correção; pontos derivam de `pontuadas`; editar invalida correção, mas preserva ponto já conquistado | Histórico de pontos não é demonstrável pela resposta atual; backup precisa distinguir acerto atual de pontuação histórica declarada |
| `js/questionarios-interacoes.js` | Extensão para seleção, ordenação e misto | Não é necessária para os dois tipos iniciais; não ampliar o formato por capacidades incidentais do motor |
| `js/armazenamento.js` | `criar`, `lerJSON`, `salvarJSON`, `remover`; JSON tolerante, normalização e memória em falhas | Sem IndexedDB, transação entre bancos, exportação ou aviso visual de durabilidade; `criar().salvar` devolve estado, não confirmação de gravação |
| `js/registro-revisoes.js` | Lista oficial fixa, valida metadados/cartões/controladores e oferece consulta | Não usar como banco dinâmico; pressupõe integração oficial existente |
| `js/app.js`, `js/app.entry.js`, `index.html` | Imports estáticos, handlers por revisão, painel `tela-gramatica-mariana`, atualização por `revisaoprogressoalterado` | Não há importador/lista LAB nem roteamento de retorno de atividades temporárias |
| `scripts/identidade-ambiente-local.cjs` | Endpoint `/__revisoes_local__/identity`, `application`, `schema: 1`, `copyId` derivado da raiz real | É identidade de desenvolvimento, não autenticação nem identidade de usuário; não existe consumo LAB no navegador |

Os caminhos `js/` dessa tabela são relativos a `ambiente_interativo/`.
Referência declarativa consultada: `revisoes/alice/gramatica-pontuacao-interpretacao-outubro-2026.js`:
configuração, questões `opcoes`, itens com `pergunta`, `opcoes`, `respostas`, sessões e chaves.
Sua configuração ampla não se torna automaticamente permitida no pacote LAB.

Regras consultadas: [questionários](QUESTIONARIOS_E_INTERACOES.md),
[armazenamento](ARMAZENAMENTO_E_PROGRESSO.md), [testes](TESTES_E_VALIDACAO_REAL.md),
[worktrees/catálogo](WORKTREES_CATALOGO_E_ENTREGA_LOCAL.md),
[registro ORG](../../../validacao/REGISTRO_WORKTREES.md),
[consolidação ORG](../../../validacao/CONSOLIDACAO_ORG.md) e
[adição integrada](../../../validacao/ADICAO_INTEGRADA.md).
O registro privado ORG não é armazenamento de atividades ou fonte de autorização de descarte.

## 3. Arquitetura e fluxos

Separar quatro responsabilidades futuras: validador puro de pacote; repositório LAB em
IndexedDB; coordenador de ciclo de vida/backup/identidade; adaptador de interface/motor.
Só a infraestrutura recebe import em `app.entry.js`; pacotes nunca se tornam módulos.
Não criar outro corretor, cálculo de pontos ou controlador de questões.

### Registro e retirada mínimos no motor

Adicionar extensão opt-in ao próprio motor, mantendo `registrar` e APIs legadas intactas:
uma fábrica interna de registros LAB recebe exclusivamente configuração construída pelo
adaptador confiável e devolve um handle fechado sobre o registro criado. O handle permite
abrir, consultar estado/situação, exportar/restaurar sessões normalizadas e liberar o registro.
As operações não recebem IDs arbitrários de revisões oficiais. A propriedade LAB fica em mapa
privado do motor, não em uma propriedade do JSON nem apenas no prefixo do ID.

`liberar` é idempotente: se ativo, salva pelo fluxo existente, desativa, remove handlers e
referências LAB, retira só o registro pertencente ao handle e seus caches de armazenamento.
Não chama `limpar` nem remove dados persistentes. Se a gravação falhar, informa a condição e
mantém estado recuperável em memória; não alega salvamento durável. Recusa alvo oficial,
handle inválido e colisão de ID/chave, sem substituição. O registro oficial não ganha uma
operação genérica de remoção. Descarte, arquivamento, saída e troca de perfil liberam o handle.

O adaptador gera `id`, `aluno`, `nome`, `materia` de apresentação, `chave`, sessões e mensagens;
não aceita essas opções de infraestrutura do pacote. Usa `validacaoEstritaEstado: true`,
alternativas reversíveis e os dois tipos existentes (`opcoes`, `campos`). Modo Responsável é
ativado apenas no LAB pela interface de administração, com sessões `principal` e `responsavel`,
sem novas sessões livres no v1. O perfil do pacote não é trocado pelo seletor de sessão.
Layout amplo, ditado e demais opt-ins ficam desabilitados.

#### Ciclo de registros implementado LAB.2C.1

Extensão aditiva de `gramatica-questionarios.js`, exposta pelos mesmos aliases
`QuestionariosRevisoes`/`GramaticaQuestionarios`: `registrarLab(construirConfiguracao)`.
O argumento é uma função síncrona de código adaptador confiável, não o pacote JSON nem uma
configuração recebida diretamente de arquivo. Objeto/string cru, construtor que lança, Promise,
thenable e configuração não declarativa são recusados por códigos próprios. O construtor não
é armazenado. A construção completa de configuração a partir do pacote ficará para LAB.2C.2;
esta API não é o importador LAB.2A nem autentica scripts da mesma origem.

Configuração interna mínima fechada: `id`, `chave`, `aluno`, `nome`, `materia`, `titulo`,
`questoes`. Exige ID `lab-` com caracteres seguros, chave principal no namespace LAB v1 completo
e perfil correspondente, metadados textuais e 1–30 questões `opcoes`/`campos` com itens.
Cópia defensiva declarativa, congelada, recusa funções/acessores/toJSON, ciclos, propriedades
ocultas/proibidas e objetos especiais; limites de 12 níveis, 10000 nós e 262144 unidades UTF-16
serializadas. Isso protege o registro inativo, não valida suficiência pedagógica, gabaritos,
digest do pacote ou todos os campos do futuro adaptador. Esses contratos continuam no LAB.2A
e na futura adaptação. Não há configuração de sessões auxiliares, layout, ditado ou callbacks
de conteúdo nessa configuração mínima.

Sucesso: `{ok:true,handle}`; falha: `{ok:false,codigo}` sem exceções/conteúdo do construtor.
O handle congelado oferece:

| Operação | Comportamento atual |
| --- | --- |
| `consultar()` | Metadados copiados do próprio registro, situação `registrado` e `aberturaDisponivel:false`; não consulta progresso, questões completas ou armazenamento |
| `abrir()` | Recusa `ABERTURA_LAB_PENDENTE`; não ativa revisão, navegação, áudio, listener ou cache |
| `liberar()` | Retira só cadastro/proprietário/cache em memória próprios; revoga o handle. Sucesso informa `salvamento:'nao-aplicavel-registro-inativo'`; nunca alega gravação durável |

Propriedade LAB é controlada por mapa privado de registros e WeakMap de handles. WeakSet de
revogados permite repetir `liberar()` sem nova ação. Após liberação, consultas/abertura recusam
`HANDLE_LIBERADO`. Métodos emprestados, objetos copiados/externos e argumentos adicionais
(inclusive ID de revisão oficial) são recusados. Não existe função pública de remoção por ID.
Prefixo sozinho não atribui propriedade: revisão cadastrada pelo `registrar` legado, mesmo
que tenha ID/chave semelhantes a LAB, continua oficial e irremovível pela nova API.

Colisões de ID e chave são verificadas antes do cadastro, contra qualquer registro existente,
incluindo chaves auxiliares do Modo Responsável e caches. Cadastro legado que tente usar chave
atualmente reservada por LAB é recusado; fora dessas reservas opt-in, `registrar` mantém seu
contrato anterior. Não há substituição. Um handle antigo revogado nunca remove outro registro
posterior que reutilize o mesmo ID/chave. A liberação remove referências a construtor/configuração
e questões; métodos do handle não fecham sobre o payload. Não se afirma medição de heap/GC:
há inspeção das referências e prova comportamental de 100 ciclos/reutilização sem reservas residuais.

**Abertura LAB fica deliberadamente pendente.** A chamada legada `abrir(id)` também recusa ID
pertencente ao LAB antes de tocar no estado atual ou DOM. `obterEstado`/`obterRevisao` não
expõem configuração/estado LAB; `limpar` recusa LAB. `obterSituacao` conserva o fallback
`nao-iniciada` sem leitura persistente. Só o handle informa o ciclo administrativo do registro.
Isso impede usar o registro temporário para atravessar o caminho síncrono de progresso legado.
Revisões oficiais conservam renderização, correção, pontuação, getters e desativação existentes.

Nenhum registro LAB pode ficar ativo pelas APIs atuais. Por isso a liberação não chama `salvar`,
`limpar` ou `desativar` sobre revisão oficial ativa. Uma guarda defensiva recusa
`LIBERACAO_ATIVA_PENDENTE` e mantém todas as referências se uma extensão futura violar essa
pré-condição. Não há caminho que finja confirmar durabilidade pelo `salvar` legado. LAB.2C.2
deverá conectar o canal assíncrono LAB.2B.3, reaproveitar o normalizador/avaliador e só então
definir salvamento/desativação/liberação ativa; falha deve conservar memória recuperável.

Não são introduzidos async, listeners ou roteador no cadastro/liberação. Construtor assíncrono
não publica registro; callbacks tardios usando handle revogado são recusados antes de abrir
ou atingir revisão oficial. Chamadas globais por ID não são capacidades LAB e não devem ser
usadas por callbacks do adaptador futuro. Abertura completa, snapshots, backup, UI e piloto
continuam indisponíveis; nenhum import/cartão/HTML/arquivo de conteúdo oficial foi alterado.

Direcionados: 23/23 novos testes em `tests/validacao/lab-registro-motor.unit.cjs`, com VM Node
e Chromium controlado, sem atividades reais. Cobrem registro, cópia, colisões, handles inválidos,
revogação, reuso, cancelamento e coexistência com revisão sintética legada que erra, corrige e
pontua uma única vez. Total LAB.2A–LAB.2C.1: 208/208 aprovados; build/formato/lint/diff aprovados.
Também há regressões de getter `then` não executado e sessões legadas inválidas toleradas.
**Global integral obrigatória por mudança no motor compartilhado**, sem redução;
aprovada em 05/11/2026: **875/875 Node e 638/638 Playwright**, saída 0; Playwright em
45,9 minutos, sem falhas, flakies, retries, skips, interrupções ou timeouts. Relatório
`tmp/validacao/2026-11-05T09-55-47-358Z-4c33cd5f-2e9d-468e-a08a-17535006da86/run.json`
com `status: passed`, `complete: true` e 638 tentativas. Resultado registrado após o término,
sem edição de código durante a global. LAB.2C.1 concluída; LAB.2C.2 não iniciada.

Preservação da rodada global: diretórios fixos `test-results`, `output` e `tmp/validacao`
anteriores foram **movidos sem limpeza/sobrescrita** para
`tmp/lab2c1-global-20261105-065245/evidencias-anteriores/` (respectivamente `test-results`,
`output`, `validacao`). Conferidos caminhos absolutos dentro da worktree, ausência de links
nesses diretórios, contagens e bytes após a movimentação: 180 arquivos/32101916 bytes,
29 PNGs/2893454 bytes e 18 arquivos/2545722 bytes. Manifesto em
`tmp/lab2c1-global-20261105-065245/preservacao.json`. Os caminhos históricos de relatórios
`tmp/validacao/...` citados neste documento agora se encontram sob esse arquivo de evidências;
os logs `tmp/lab2b1-global-*` e perfis sintéticos permanecem em seus locais anteriores.
A nova global usa os diretórios fixos livres e log próprio
`tmp/lab2c1-global-20261105-065245/npm-test.log`, sem tocar nos nove vínculos de dependências.
Conferência final: arquivo histórico mantém as mesmas contagens/bytes do manifesto; os novos
29 PNGs gerados em `output/` são evidências distintas, também preservadas. Nenhuma limpeza,
abertura de imagem, commit, push, PR ou sincronização nesta entrega.

### Fluxo de execução

#### Integração opt-in implementada LAB.2C.2

Mudanças restritas a `gramatica-questionarios.js`, `lab-coordenador.js` e testes/documentação.
Não há imports, UI, catálogo, launcher ou arquivos escolares novos. As descrições de abertura
bloqueada da LAB.2C.1 acima registram aquele marco: a chamada global `abrir(idLab)` continua
recusada, mas o handle ganha abertura controlada. O argumento sem sessão continua recusado.

Configuração confiável continua sendo construída por callback JS, nunca JSON externo passado
diretamente ao motor. `chave:null` permite adiar completamente a identidade de progresso;
IDs internos vêm do construtor confiável, sem adotar o `id` do pacote como ID de registro.
Chave não nula anterior só é aceita na abertura se corresponder à principal gerada pelo
coordenador; em temporário, usar null, sem inventar copyId. O canal realmente usado é sempre
emitido pelo coordenador. Chaves efetivas também ficam reservadas no registro privado, sem
colisões com outros registros/caches oficiais ou LAB.

`LabCoordenador.conectarMotor(sessaoLab,sessaoProgresso)` verifica a instância exata em WeakMap
privado de sessões emitidas. Objeto copiado ou duck typing não autorizam abertura. A sessão
precisa estar preparada e já ter adquirido a atividade pelo fluxo existente, inclusive consentimento
temporário explícito. A conexão lê novamente o pacote validado e emite canal, chave principal,
modo e callbacks de vigência/revalidação/liberação restritos àquela aquisição. Não emite uma
autorização genérica para salvar depois de um await; cada escrita continua usando o gate LAB.2B.3.

| API do handle | Contrato LAB.2C.2 |
| --- | --- |
| `abrir(coordenador,'principal' ou 'responsavel')` | Promise; exige configuração correspondente ao perfil/título/questões do pacote validado (diferenças de gabarito ou flags de conteúdo são recusadas), sessão emitida e aquisição ativa. Lê canal, usa o normalizador estrito existente e reconfirma autorização antes de montar o painel compartilhado. Não salva, pontua, confere ou conclui ao abrir |
| `consultar()` | Metadados + cópia do estado lógico da execução própria, sessão selecionada, modo, operação pendente, indicador de não durabilidade e últimos metadados do canal. Não expõe configuração/gabarito novo na UI |
| `persistir()` | Promise de drenagem/retentativa explícita do snapshot próprio mais recente; não recebe estado externo e não restaura backup. Divergência não tem opção de sobrescrita forçada |
| `desativar()` | Promise; bloqueia novos eventos LAB durante fechamento, aguarda gravações, exige sessão ainda autorizada, retira visual e referências da execução apenas após confirmação. Mantém aquisição/caches do coordenador para troca explícita de sessão e reabertura |
| `liberar()` | Mantém o resultado síncrono de registros nunca abertos; com execução/vínculo retorna Promise, converge chamadas repetidas e só libera aquisição depois de drenar gravações. Revoga cadastro próprio sem apagar chaves. Falha mantém registro e cópia recuperável, sem alegar que está salvo |

O construtor interno força `validacaoEstritaEstado:true` e oferece sucesso textual genérico
quando omitido. Correção, avaliador, pontos, histórico de `pontuadas`, posição, conclusão e
navegação são os mesmos do motor. Não há correção paralela ou novo normalizador pedagógico.
Principal e responsável são selecionados explicitamente pela API; não se cria painel/atalho LAB
de salto administrativo. Troca exige desativar a execução anterior; resposta e pontos não são
copiados entre sessões. Nenhum estado vindo de snapshot externo é importado nesta etapa.

O `salvar()` legado mantém seu caminho síncrono/retorno; somente execução LAB desvia para o
canal assíncrono. Edição, conferência, avanço e retorno normalizam o estado lógico imediatamente,
guardam a cópia mais recente e incrementam uma revisão interna. Confirmações de storage nunca
substituem o estado lógico atual, nem escrevem em outra revisão que ganhou o painel. Enquanto
há escrita em voo, novas ações são coalescidas no snapshot mais recente; após sucesso, esse
snapshot recebe nova autorização/escrita. Quota, base divergente ou autorização perdida não
acionam retry automático. Uma nova ação explícita ou `persistir()` pode tentar novamente, sempre
sob o gate e a comparação conservadora da base. Aceite não é garantia de retenção permanente.

Se fechar com gravação pendente, aguarda a conclusão e as ações já coalescidas antes de soltar
o lock. Falha retorna `PROGRESSO_LAB_NAO_DURAVEL`, estado e metadados; conserva memória e reserva,
permite inspeção/retentativa e não remove o registro. Encerramentos sobrepostos convergem sem
liberação duplicada. Uma tentativa recusada não deixa intenção de liberação em operação posterior.
Em temporário, confirmação é somente memória do coordenador, explicitamente identificada como
não durável; liberar não encerra esse coordenador nem apaga seu cache. Encerrar o coordenador
antes do motor revoga a conexão: o fechamento é recusado e a última cópia do motor é conservada
como memória de emergência, sem restaurar o canal automaticamente. Ordem correta: fechar/liberar
o handle, conferir resultado e só então encerrar o coordenador. Não existe descarte forçado.

APIs globais oficiais continuam síncronas. Abrir/desativar uma revisão oficial invalida aberturas
LAB atrasadas e separa o visual LAB, mas preserva sua execução/cópia e lock até fechamento explícito.
Eventos de nós antigos são protegidos pelo escopo da execução/renderização, não podem corrigir
ou pontuar a revisão oficial nem uma questão posterior. Não há listener global novo, alteração
de roteador ou atualização do catálogo oficial por evento LAB. O painel compartilhado é reutilizado
sem chamar o roteador oficial no caminho LAB; host/teste deve ter o painel disponível. Botão final
LAB usa o fechamento controlado, sem navegar automaticamente para o catálogo oficial.

Após fechamento bem-sucedido, removem-se handlers/DOM do visual LAB próprio e referências de
estado/conexão da execução; revisão oficial ativa não é tocada. Retomar o mesmo handle oculto
aguarda gravações e reconfirma a conexão; mudar para outro coordenador enquanto o vínculo anterior
segue reservado é recusado. Perda de identidade/lock suspende escritas e mantém estado recuperável;
não há adoção de outra cópia ou conversão silenciosa para temporário.

Limites: HTTP, Web Locks e localStorage não são uma transação atômica nem autenticação contra
scripts da mesma origem. O host ainda precisa apresentar durabilidade/erros na futura UI; aqui
o resultado é pela API. Memória não confirmada não sobrevive a recarga/fechamento do processo.
Backup, journal, importação de snapshots e recuperação entre coordenadores/cópias não existem.
LAB.2C.3 deverá tratar validação/normalização segura de snapshots externos e seus conflitos,
sem reinterpretar pontos históricos como acerto atual nem fabricar conclusão. Não antecipada aqui.

Testes novos: 22/22 Chromium em `tests/validacao/lab-motor-progresso.unit.cjs`; conjunto LAB
com regressões anteriores: 230/230 aprovados. Cobre ciclo pedagógico, recarga, sessões, memória,
quota/divergência, autorização, sobreposição, cancelamento, fechamento e transição LAB/oficial.
Build/formato/lint/diff aprovados. Global integral aprovada em 05/11/2026: 897/897 Node
(116,8 segundos) e 638/638 Playwright (43,6 minutos), `npm test` com saída 0.
Relatório `complete=true`, `status=passed`, 638 descobertos/esperados/executados/aprovados e
638 tentativas, sem falhas, retries, skips, flakies, omissões, interrupções ou timeouts.
Nenhuma mudança de fontes/artefatos durante a execução; depois dela, apenas este resultado documental.
Log exclusivo `tmp/lab2c2-global-20261105-083100/npm-test.log` e relatório
`tmp/validacao/2026-11-05T11-33-40-546Z-0a9c2ac9-819b-4b5d-b76f-f5b6eb10be25/run.json`.
Antes dessa rodada, `test-results`, `output` e `tmp/validacao` foram preservados em
`tmp/lab2c2-global-20261105-083100/evidencias-anteriores/`, sem sobrescrita: respectivamente
180 arquivos/32.101.708 bytes, 29 PNGs/2.893.454 bytes e 10 arquivos/2.547.848 bytes.
Contagens/bytes conferidos antes/depois em `preservacao.json` da rodada. O relatório LAB.2C.1
antes em `tmp/validacao/2026-11-05T09-55-47-358Z-4c33cd5f-2e9d-468e-a08a-17535006da86/run.json`
está agora sob `evidencias-anteriores/validacao/` dessa rodada; arquivos anteriores em
`tmp/lab2c1-global-*`, logs e perfis sintéticos continuam nos locais históricos. Os nove
vínculos de dependências foram conferidos e preservados. Após a global, contagens/bytes
arquivados foram reconferidos; os novos 29 PNGs permanecem em `output/` e os nove vínculos intactos.
Nenhum teste anterior ou política foi alterado. LAB.2C.2 concluída; LAB.2C.3 não iniciada.

1. Ação explícita seleciona arquivo; conferir bytes, decodificação, parsing, schema e semântica.
2. Mostrar resumo seguro de perfil/matéria/título/quantidade; confirmar importação.
3. Resolver identidade da cópia, digest e colisões; persistir pacote e metadados na transação LAB.
4. Só depois do sucesso publicar na lista LAB. Falha deixa a lista anterior intacta.
5. Ao abrir atividade ativa, validar novamente o conteúdo salvo, construir configuração e
   registrar apenas essa atividade. Consultar progresso pelo motor e abrir painel existente.
6. Na volta ao LAB, salvar/desativar/liberar. Reabertura reconstrói o mesmo registro e chaves;
   não reinstala listeners globais nem pontua novamente.
7. Na recarga, reconstruir a lista a partir do banco da cópia; a seleção da atividade é
   restaurada se ainda ativa e válida, sempre na sessão principal. A sessão responsável é
   retomada somente mediante seleção explícita no painel existente.

Ao trocar para revisão oficial, cancelar qualquer abertura assíncrona LAB pendente e liberar
o handle antes da nova abertura. Um contador de geração invalida callbacks atrasados.
Saída/retorno precisa usar um contexto opt-in no roteador; não alterar o destino das revisões
oficiais nem contornar validações de `RegistroRevisoes`. Eventos LAB atualizam só a lista LAB;
IDs LAB desconhecidos pelo catálogo oficial são ignorados sem erro.

## 4. Contrato JSON v1

O identificador de formato é `lab-questionarios-v1`. O schema abaixo é normativo para a
estrutura (JSON Schema draft-07, para futura implementação); as regras semânticas seguintes
também são obrigatórias. Nenhum arquivo schema/configuração é criado na LAB.1.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "additionalProperties": false,
  "required": ["formato", "id", "versao", "perfil", "materia", "titulo", "questoes"],
  "properties": {
    "formato": { "const": "lab-questionarios-v1" },
    "id": { "$ref": "#/definitions/id" },
    "versao": { "type": "integer", "minimum": 1, "maximum": 9999 },
    "perfil": { "enum": ["alice", "mariana"] },
    "materia": { "enum": ["gramatica", "matematica", "ciencias", "geografia", "historia", "ingles", "leitura"] },
    "titulo": { "type": "string", "minLength": 1, "maxLength": 120 },
    "questoes": {
      "type": "array", "minItems": 1, "maxItems": 30,
      "items": { "$ref": "#/definitions/questao" }
    }
  },
  "definitions": {
    "id": { "type": "string", "pattern": "^[a-z][a-z0-9-]{0,63}$" },
    "texto": { "type": "string", "minLength": 1, "maxLength": 500 },
    "resposta": { "type": "string", "minLength": 1, "maxLength": 160 },
    "questao": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "bloco", "titulo", "instrucao", "tipo", "itens", "dica"],
      "properties": {
        "id": { "$ref": "#/definitions/id" },
        "bloco": { "type": "string", "minLength": 1, "maxLength": 80 },
        "titulo": { "type": "string", "minLength": 1, "maxLength": 120 },
        "instrucao": { "$ref": "#/definitions/texto" },
        "dica": { "$ref": "#/definitions/texto" },
        "tipo": { "enum": ["opcoes", "campos"] },
        "itens": {
          "type": "array", "minItems": 1, "maxItems": 6,
          "items": { "$ref": "#/definitions/item" }
        }
      }
    },
    "item": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "pergunta", "respostas"],
      "properties": {
        "id": { "$ref": "#/definitions/id" },
        "pergunta": { "$ref": "#/definitions/texto" },
        "respostas": {
          "type": "array", "minItems": 1, "maxItems": 5, "uniqueItems": true,
          "items": { "$ref": "#/definitions/resposta" }
        },
        "opcoes": {
          "type": "array", "minItems": 2, "maxItems": 6, "uniqueItems": true,
          "items": { "$ref": "#/definitions/resposta" }
        }
      }
    }
  }
}
```

### Limites, semântica e normalização

- Arquivo até 256 KiB (262144 bytes), UTF-8 estrito, um objeto raiz; sem JSON5, comentários,
  vírgula final, chaves duplicadas ou BOM. Verificar bytes antes de ler integralmente.
  Profundidade máxima de 8 contêineres incluindo a raiz; limite de 10000 tokens léxicos
  antes da construção do objeto. Parser não executa código. Detecção de chaves duplicadas
  exige parser/tokenizador: `JSON.parse` sozinho não satisfaz este requisito.
- Todas as propriedades são fechadas em qualquer nível. Recusar `__proto__`, `prototype`
  e `constructor` como nomes de propriedade. Não fazer merge de objeto recebido em configuração.
- Textos: normalizar CRLF/CR para LF, Unicode NFC e trim nas bordas; não converter tipo,
  remover acentos, mudar caixa ou reordenar listas. Recusar vazio, só espaços, controles
  U+0000–U+001F exceto LF e TAB, U+007F e controles bidi U+202A–U+202E/U+2066–U+2069.
  Limites de strings são em pontos de código após normalização; bytes valem antes dela.
  IDs, formato, perfil e matéria não são aparados nem corrigidos: devem ser exatos.
- Recusar `<` ou `>` em qualquer texto do pacote. Demais caracteres são texto literal,
  sempre escapado ao renderizar. Não interpretar Markdown, entidades HTML, URLs ou caminhos.
  Uma URL em texto não é recurso executável e nunca vira link ou requisição.
- IDs de questões e de todos os itens devem ser únicos conjuntamente no pacote. O ID do
  pacote pertence a outro domínio e é combinado com perfil/versão/digest na identidade.
- Em `opcoes`, `opcoes` é obrigatório em cada item e `respostas` tem exatamente uma entrada,
  idêntica a uma opção normalizada. Opções não podem colidir sob a comparação do motor.
- Em `campos`, `opcoes` é proibido e `respostas` lista de 1 a 5 variantes explícitas. Não usar
  regex, avaliação numérica, respostas livres ou correção por IA. Variantes equivalentes
  sob comparação do motor são duplicatas e devem ser recusadas.
- Comparação pedagógica reutiliza a normalização atual do motor: trim, espaços, espaços
  antes de `. ! ?`, caixa e acentos não obrigatórios. Não habilitar `pontuacaoFlexivel`,
  exigência de caixa/acentos/frase, ditado ou outros flags no v1. Questões cujo objetivo
  dependa desses flags ficam fora do formato inicial. Não confundir essa comparação com
  normalização do pacote para identidade, que preserva caixa, acentos e ordem.
- Arrays não vazios, números inteiros reais (sem coerção), perfil/matéria reconhecidos,
  nenhuma propriedade omitida preenchida por adivinhação. Conteúdo salvo é revalidado na leitura.

### Exemplos sintéticos, exclusivamente dentro desta especificação

Pacote válido com os dois tipos; não constitui piloto ou material a cadastrar:

```json
{
  "formato": "lab-questionarios-v1",
  "id": "exemplo-sintetico",
  "versao": 1,
  "perfil": "alice",
  "materia": "ciencias",
  "titulo": "Observando o dia",
  "questoes": [
    {
      "id": "q1", "bloco": "Observação", "titulo": "O céu",
      "instrucao": "Escolha uma resposta.", "tipo": "opcoes",
      "dica": "Pense no que você vê durante o dia.",
      "itens": [{ "id": "i1", "pergunta": "Qual astro ilumina o dia?",
        "opcoes": ["Sol", "Lua"], "respostas": ["Sol"] }]
    },
    {
      "id": "q2", "bloco": "Banco de palavras", "titulo": "Complete",
      "instrucao": "Use uma palavra do banco: água, pedra.", "tipo": "campos",
      "dica": "Pense no que usamos para beber.",
      "itens": [{ "id": "i2", "pergunta": "Bebemos qual item do banco?",
        "respostas": ["água"] }]
    }
  ]
}
```

Também é válido esse mesmo pacote com `perfil: "mariana"`, mantendo identidade separada.
Exemplo inválido completo, recusado sem salvar:

```json
{
  "formato": "lab-questionarios-v1", "id": "exemplo-invalido", "versao": 1,
  "perfil": "alice", "materia": "ciencias", "titulo": "Exemplo",
  "codigo": "alert(1)",
  "questoes": [{
    "id": "q1", "bloco": "Exemplo", "titulo": "Escolha",
    "instrucao": "Escolha.", "tipo": "opcoes", "dica": "Observe.",
    "itens": [{ "id": "i1", "pergunta": "Qual ilumina o dia?",
      "opcoes": ["Sol", "Lua"], "respostas": ["Marte"] }]
  }]
}
```

Erros: propriedade desconhecida `/codigo` e gabarito fora das opções
`/questoes/0/itens/0/respostas/0`. Outras mutações inválidas do válido: 31 questões,
ID repetido, `versao: "1"`, item `campos` com `opcoes`, `imagem`, `chave`,
`modoResponsavel`, tipo `misto`, `<img>` no título e resposta só de espaços.

Retorno do validador: sucesso `{ valido: true, pacoteNormalizado, digest }` ou falha
`{ valido: false, erros: [{ codigo, caminho, mensagem }], truncado }`; até 20 erros,
ordenados pelo caminho e código. Caminhos usam JSON Pointer. Códigos estáveis mínimos:
`LIMITE_BYTES`, `UTF8_INVALIDO`, `JSON_INVALIDO`, `CHAVE_DUPLICADA`, `LIMITE_ESTRUTURA`,
`PROPRIEDADE_DESCONHECIDA`, `CAMPO_OBRIGATORIO`, `TIPO_INVALIDO`, `VALOR_INVALIDO`,
`TEXTO_INVALIDO`, `ID_DUPLICADO`, `OPCAO_DUPLICADA`, `GABARITO_INVALIDO`.
Erro léxico impede validação estrutural. Mensagem não incorpora conteúdo bruto nem stack;
interface traduz código/caminho em orientação ao responsável. Sem salvar parcialmente.

### Implementação isolada LAB.2A

Implementado `ambiente_interativo/js/lab-validador.js`, sem import em `app.entry.js` ou
dependência do DOM, motor, banco, armazenamento ou rede. O schema estrutural acima é aplicado
por descritores internos fechados, complementados por validação semântica. Não foi criado
arquivo JSON de configuração. A ausência de integração mantém o Laboratório indisponível na UI.

Não foi encontrado parser adequado nas dependências declaradas/lockfile ou nos fontes locais.
Acorn trata JavaScript; AJV não detecta chaves perdidas no parsing JSON. A solução sem novas
dependências usa scanner léxico limitado com pilha para profundidade, tokens e chaves decodificadas
por objeto; `JSON.parse` nativo permanece responsável pela gramática/construção do objeto.
Não há parser completo alternativo, `eval`, geração de funções ou carregamento remoto.
Um token é string, número, literal (`true`/`false`/`null`) ou um separador individual
(`{`, `}`, `[`, `]`, `,`, `:`); espaços JSON não contam. A pré-checagem ocorre antes do parse
do documento inteiro. Tokens string são decodificados pelo parser nativo individualmente.

API pública: CommonJS `require(...).validarPacote(entrada)` em Node; ao carregar explicitamente
como script de navegador, `LabValidador.validarPacote(entrada)`. `LIMITES` é exposto e congelado,
sem opções para relaxar limites. Entrada é string JSON ou `Uint8Array` (incluindo Buffer em Node),
não objeto já parseado, ArrayBuffer ou Blob. Essa restrição preserva detecção de duplicatas,
não executa getters de um objeto fornecido e não modifica bytes de entrada. O chamador futuro
converte arquivo para bytes, verificando seu tamanho antes da leitura; este módulo não faz IO.

Retorna Promise de sucesso `{ valido: true, pacoteNormalizado, canonico, digest }` ou falha
no formato definido acima. `canonico` é a representação exata usada no SHA-256. Erros léxicos
interrompem na primeira ocorrência; erros estruturais são acumulados/ordenados e impedem a fase
semântica; falha semântica impede o digest. Ordenação usa comparação lexicográfica UTF-16 de
caminho e código, sem depender de locale; até 20 erros e `truncado` quando exceder.
Extensões de códigos: `BOM_PROIBIDO`, `UNICODE_INVALIDO`, `CRIPTO_INDISPONIVEL`, `FALHA_DIGEST`.
Mensagens não incluem valores, fonte, stack ou detalhes do provedor criptográfico; JSON Pointer
identifica propriedades desconhecidas, portanto continua sendo texto não confiável para uma UI.

SHA-256 usa apenas `crypto.subtle.digest` com bytes UTF-8 canônicos. Ausência/falha é explícita;
sem hash alternativo. Requer TextEncoder/TextDecoder e Web Crypto nativos (Node 24.19.0 foi
utilizado na validação). LAB.2B.1 exercitou o validador também no Chromium real; compatibilidade
com outros navegadores permanece pendente. O módulo
não habilita persistência por `file://` nem resolve o futuro `copyId`.

Precisões normativas de implementação, sem ampliação do formato: rejeitar surrogate UTF-16
isolado, inclusive escapado em chaves/valores; aceitar pares válidos. Validar controles antes
do trim para que controles proibidos nas bordas não desapareçam. Normalizar CR/CRLF antes dessa
checagem, preservando LF/TAB internos. JSON com BOM é recusado, não removido silenciosamente.
Tipo/ID/enums não são corrigidos. Comparação de respostas foi conferida com
`normalizarResposta` do motor desta base, sem executar/importar o controlador.

Vetores fixos em `tests/validacao/lab-validador.unit.cjs`, com literais canônicos escritos
independentemente do algoritmo e hashes calculados por Python `hashlib`:

| Vetor | SHA-256 esperado |
| --- | --- |
| Pacote sintético mínimo ASCII, constante `CANONICO` do teste | `d9ab1b1e4c3c2fbd28bade92aae7452f8f71d71b8c352291eae0bb3b76996294` |
| Mesmo pacote, título `Água 😀` (NFC, sem espaços nas bordas) | `e183e7b461a2b76354ba523dbb1241b4fd2c0655d5db2ec3c6d5cd62c800edb4` |

Testes também comparam o vetor ASCII com `node:crypto`, preservação da ordem dos arrays,
equivalência de formatação/ordem de propriedades/escapes e diferenças reais de perfil/versão/texto.
Validação estrutural não comprova autoria, qualidade pedagógica ou autenticidade do gabarito.

## 5. Identidade e armazenamento

### Identidade imutável

Identidade declarada = `(perfil, id, versao)`; matéria e todos os textos/questões estão no
conteúdo imutável. Calcular SHA-256 dos bytes UTF-8 do JSON normalizado com propriedades
de objetos ordenadas lexicograficamente por unidades UTF-16, arrays na ordem recebida,
sem espaços de serialização, usando representação JSON de strings/números. Esse algoritmo
restrito deve ter vetores fixos; não depende de ordem original das propriedades ou nome do arquivo.
Digest não autentica autoria. Formatação e normalizações permitidas não criam outro pacote.

Mesma identidade declarada e mesmo digest: importação idempotente, sem duplicar atividade ou
reiniciar progresso. Mesma identidade e digest diferente: conflito bloqueado, inclusive após
descarte. Editar conteúdo exige incrementar `versao`; mudança de perfil cria identidade distinta.
Não reutilizar pontuação de outra versão nem migrar automaticamente.

### Escopo de cópia e origem

Persistência LAB v1 suportada inicialmente somente por HTTP local com identidade válida.
Consultar endpoint relativo, sem cache, validando `application`, `schema` e `copyId` (64 hex
minúsculos), com timeout de 3 segundos. Sem identidade, ou em `file://`, permitir somente
modo temporário explicitamente aceito, em memória, com exportação; nunca reutilizar namespace
persistente de outra cópia nem inventar `copyId`. Se nem digest estiver disponível, recusar
importação explicando a limitação, em vez de adotar hash alternativo.

Escopo = origem exata do navegador + `copyId`; armazenamento continua separado por perfil do
navegador. Revalidar identidade antes de importar, abrir, restaurar e antes de cada gravação
durável durante uma atividade (checagem assíncrona no coordenador); estado só fica durável após
essa checagem. Mudança/indisponibilidade suspende gravação durável e operações administrativas,
preserva memória/backup e exige reabrir a cópia correta. Checagem não é autenticação contra
servidor malicioso nem transação atômica com o processo HTTP.

Duas worktrees em `127.0.0.1:5173` compartilham origem, mas usam bancos/chaves distintos pelo
`copyId`. Troca de porta, host, protocolo, perfil do navegador ou caminho real pode fazer os
dados anteriores não aparecerem. Não diagnosticar perda, adotar dados antigos ou migrar sozinho.
`copyId` ausente não autoriza escolher uma cópia anterior. Offline significa servidor local
disponível sem internet; `file://` tem contrato temporário, sem promessa de persistência.

### Conteúdo e metadados em IndexedDB

#### Incremento implementado LAB.2B.1

Fontes isolados `js/lab-identidade.js` e `js/lab-repositorio.js` em `ambiente_interativo/`,
sem integração, interface ou mudança no motor/endpoint/launcher/Vite. O navegador deve carregar
explicitamente validador, identidade e repositório nessa ordem; CommonJS resolve os módulos
locais em Node. A implementação não acessa localStorage ou dados oficiais.

- `LabIdentidade.resolverIdentidade(copyIdEsperado = null)` retorna Promise de
  `{ modo: 'persistente', copyId, origem, codigo: null }` ou
  `{ modo: 'temporario', copyId: null, origem: null, codigo }`. Indica capacidade candidata,
  não garante abertura do banco, retenção permanente, Web Locks ou autorização de execução.
  Só HTTP em `127.0.0.1`, `localhost` ou `[::1]`; `file://`, HTTPS e hosts externos são
  recusados sem requisição. Fetch relativo, sem cache, credenciais da mesma origem,
  redirecionamento recusado, abort/timeout de 3 s cobrindo corpo e limite de resposta de 4096
  bytes. Envelope fechado exige aplicação/schema/copyId exatos. Identidade esperada divergente
  não é substituída. Ausência, formato inválido, timeout e falta de IndexedDB têm códigos próprios.
- `LabRepositorio.abrirRepositorio()` confirma identidade e abre exclusivamente o banco
  derivado de `copyId`. Sucesso: `{ ok: true, modo: 'persistente', copyId, origem, repositorio }`.
  Falha retorna `{ ok: false, modo: 'temporario', codigo, mensagem, ... }`, sem handle, banco
  alternativo ou implementação implícita em memória. Fallback temporário continua dependendo
  de consentimento e coordenador futuros; não há Web Locks nesta etapa só de cadastro/consulta.
- Handle congelado: `cadastrar(entradaJSON)`, `consultar({perfil,id,versao})`, `listar(perfil)`
  e `fechar()`. Nenhuma API recebe nome de banco/store/chave fornecido pelo conteúdo.
  Resultados operacionais usam `ok`, ou `codigo`/`mensagem` estáveis na falha. Pacote inválido
  inclui `erros`/`truncado` do LAB.2A; erros do sistema não expõem exceção, stack ou conteúdo.
- `cadastrar` revalida a entrada textual/bytes pelo LAB.2A; não confia em um objeto
  `{valido:true}`. Retorna `{ok:true,criado,digest,identidade}` só em `transaction.oncomplete`.
  `criado:false` é reimportação idêntica, sem regravar metadados; digest divergente em identidade
  já existente retorna `CONFLITO_DIGEST`. Registro inconsistente é erro, não nova importação.
- `consultar` retorna `{ok:true,pacote,digest,administracao,ausente:false}` ou
  `{ok:true,pacote:null}` quando não há conteúdo nem metadado. `listar` devolve
  `{ok:true,pacotes:[{pacote,digest,administracao}]}` apenas se todos os pares do perfil forem
  válidos. Não entregar lista parcial como íntegra. Só aceita perfis Alice e Mariana.
- Cada operação reconfirma cópia/origem; cadastro reconfirma também depois de validar o
  snapshot anterior e antes da gravação. Falha ou troca suspende/fecha o handle, exigindo nova
  abertura explícita; nunca adota automaticamente a outra cópia. A checagem HTTP não é atômica
  com troca de servidor, nem autenticação de usuário ou de dados locais.
- Banco v1: `pacotes` e `administracao` usam keyPath composto `['perfil','id','versao']`,
  índices `perfil` e `perfilMateria` (`['perfil','materia']`), sem unicidade de índice.
  `pacotes` guarda perfil/id/versão/matéria/digest e `conteudo` como JSON canônico textual;
  administração guarda a mesma identidade/matéria/digest, `situacao:'ativa'` e `criadoEm`.
  Store `operacoes` usa keyPath `id` e permanece vazia. Sem journal ou restauração.
- Conteúdo e administração são inseridos juntos por `add`, nunca `put`, em transação
  readwrite. Snapshot revalidado é comparado novamente dentro dela antes de inserir;
  alteração concorrente recusa sem sobrescrita. Não há coordenação administrativa definitiva:
  cadastros concorrentes podem exigir nova tentativa explícita. Isso não autoriza abrir,
  arquivar, descartar ou restaurar sem os gates previstos para etapas futuras.
- Leitura revalida JSON/digest/identidade e coerência dos dois registros, inclusive na lista
  e antes de aceitar idempotência. Par órfão, conteúdo adulterado ou metadado divergente
  retorna `DADOS_INVALIDOS`, preservando o banco. Nesta etapa só metadado ativo é suportado;
  situações futuras exigirão implementação própria, não reparação automática.
- Abertura bloqueada/versão ou schema incompatível/quota/abort/timeout têm falhas explícitas.
  Não apagar/recriar/migrar banco para recuperar. `onversionchange` fecha conexão e invalida
  o handle; pedido de abertura que termine depois de falha/timeout é fechado, sem adoção.
  Timeout de armazenamento é 3 s. Commit confirma transação IDB, não protege contra expulsão
  posterior pelo navegador nem substitui backup futuro.

Verificação direcionada: 31 testes novos em `tests/validacao/lab-persistencia.unit.cjs`,
com IndexedDB real no Chromium e servidor HTTP sintético local, mais os 98 testes LAB.2A.
Cobrem duas cópias na mesma origem, adulteração, rollback real, quota simulada, bloqueio real,
versionchange e reabertura de processo Chromium com perfil persistente sintético em `tmp/`.
Os perfis de teste são preservados; não são dados escolares. Não há teste por atividade real.
Validação global deste incremento aprovada em 05/11/2026 pelo gatilho de armazenamento:
**796/796 Node e 638/638 Playwright**, saída 0; Playwright em 45,8 minutos, sem falhas,
flakies, retries, skips ou casos não executados. Build, formato, lint e diff aprovados;
fontes oficiais e bundle PDF.js rastreado sem diferenças. O `app.bundle.js` ignorado foi
regenerado pelo build oficial, sem mudança de entradas/fontes oficiais. Recuperação aqui significa reler após reabrir o navegador,
não journal, backup, adoção de operações interrompidas ou restauração de progresso.

Preparação da global LAB.2B.1: os quatro vínculos LAB.2A foram conferidos e preservados.
A primeira execução parou em Node (794/796), antes de Playwright, por ausência de resolução
ESM de `rolldown` nas fixtures que copiam um runtime Vite mínimo. Não foi constatada falha LAB.
Acrescentados apenas vínculos locais ignorados para as cinco dependências do Vite já instaladas
(`rolldown`, `picomatch`, `tinyglobby`, `postcss`, `lightningcss`), sem instalação/download,
alteração dos vínculos anteriores ou mudanças em testes/código/configuração. Os seis testes
HTTP locais passaram após esse ajuste. O log inicial permanece em
`tmp/lab2b1-global-20261104-232804/npm-test.log`; nova global usa diretório próprio.
Execução aprovada: `tmp/lab2b1-global-20261104-235949/npm-test.log`; relatório completo
`tmp/validacao/2026-11-05T03-01-54-028Z-4c8005e9-45d7-4d95-861d-7c0fcbe75588/run.json`
com `status: passed`, `complete: true`, 638 tentativas e zero interrupções/timeouts.
Os 29 PNGs produzidos pela suíte em `output/`, os perfis sintéticos e as demais evidências
permanecem locais e fora da entrega de fontes; não foram abertos, apagados ou incluídos no Git.
Nenhuma evidência anterior foi limpa. Resultado registrado após encerrar os testes, sem editar
código durante a execução. Na entrega LAB.2B.1, LAB.2B.2 ainda não havia sido iniciada.

Banco proposto `revisoesEscolares.lab.<copyId>.v1`; versão de banco 1, object stores:
`pacotes` (chave composta perfil/id/versao, digest, conteúdo validado), `administracao`
(mesma chave, situação, datas locais informativas), `operacoes` (restaurações pendentes).
Transações cobrem conteúdo e estado administrativo; índice perfil/matéria para lista, sem
segundo catálogo oficial. Datas não concedem autorização nem determinam descarte automático.
Descartado conserva só tombstone: identidade, digest, perfil, matéria e situação, sem enunciados.
Não apagar banco em erro de versão/upgrade, corrupção ou bloqueio; informar e oferecer recuperação.

### Progresso pelo armazenamento existente

Chave gerada exclusivamente pelo adaptador:
`revisoesEscolares.lab.v1.<copyId>.<perfil>.<materia>.<id>.v<versao>.<digest>.<sessao>`.
Sessão é `principal` ou `responsavel`. Nome do arquivo, pacote ou backup nunca fornece chave.
ID de registro em memória deriva desses componentes com prefixo `lab-`; não é identidade oficial.
Recarga/reinício recuperam conteúdo do IndexedDB e progresso do `ArmazenamentoRevisoes` da
mesma origem/cópia; progresso continua como estado do motor, sem outro contador de pontuação.

Para modo temporário, o motor precisa aceitar opt-in uma instância de armazenamento em memória
com a mesma interface, sem tocar em localStorage. Não basta rotular a sessão como temporária:
o `criar()` atual ainda tentaria gravar. Para durabilidade, uma extensão aditiva e opt-in do
armazenamento deve expor resultado real de leitura/gravação/remoção ao coordenador, sem alterar
o retorno legado. O motor precisa encaminhar isso ao adaptador; aviso apenas no console é
insuficiente. Não implementar wrapper que replique correção/estado.

Se IndexedDB falhar, oferecer modo temporário sem sobrescrever dados existentes. Se progresso
falhar, manter sessão em memória com aviso persistente e exportação; não anunciar gravação ou
exclusão bem-sucedida. Impedir que uma leitura de valor antigo no localStorage sobreponha a
versão mais recente em memória após falha de escrita. Retry exige política explícita e teste.
Conteúdo ausente e progresso presente é órfão recuperável, não motivo para limpar a chave.
Metadado de conclusão nunca substitui `obterSituacao`/estado normalizado do motor.

#### Durabilidade implementada LAB.2B.3

`ambiente_interativo/js/lab-progresso.js` implementa adaptador **exclusivo do LAB**, permitido
como alternativa de menor impacto à extensão do armazenamento compartilhado. O arquivo
`armazenamento.js` permanece intacto: mesmas assinaturas, retornos síncronos, normalizadores,
legados e persistência oficial. Consumidores existentes em app, Gramática, Inglês, Leitura e
Matemática continuam usando suas APIs. O novo adaptador não chama essas APIs para o LAB, pois
elas não expõem confirmação e podem reler valor antigo após uma falha de escrita. Não há segundo
motor, normalizador pedagógico, cálculo de pontos ou interpretação de conclusão.

Em navegador, carregar `lab-progresso.js` antes de `lab-coordenador.js` para usar a nova API.
A ausência do script só recusa essa capacidade; operações LAB anteriores continuam disponíveis.
O coordenador acrescenta `abrirProgresso(sessao)`, síncrono, apenas com atividade ativa e nenhuma
operação pendente. `sessao` deve ser exatamente `principal` ou `responsavel`; objeto JSON,
chave arbitrária ou outra sessão é recusado. Sucesso devolve `{ok:true,canal}`; repetir na mesma
atividade/sessão devolve o mesmo handle. Identidade completa vem do pacote revalidado no
coordenador; a chave não é parâmetro do conteúdo.

| API do canal | Resultado/limite |
| --- | --- |
| `chave` | Valor gerado, somente leitura, no namespace LAB completo definido acima; null em temporário |
| `carregar()` | Promise de snapshot opaco e metadados; não normaliza estado do motor. Ausência retorna estado null. Memória suja prevalece sobre qualquer valor antigo persistido |
| `salvar(estado)` | Captura cópia JSON do estado mais recente enquanto o canal está ativo; antes de escrever exige autorização atual do coordenador. Falha de persistência conserva a cópia em memória |
| `tentarPersistir()` | Retentativa explícita do snapshot em memória, com as mesmas checagens de autorização e comparação. Não há timer, retry automático, merge, migração ou sobrescrita forçada |
| `obterDurabilidade()` | Snapshot síncrono dos últimos metadados, com flags de encerramento e operação pendente; não faz IO nem garante retenção futura |

Formato de operação: `{ok,estado,durabilidade,codigo,aceitaPeloNavegador,etapa}`.
`ok:false` significa que a operação solicitada não foi concluída conforme esperado, mesmo que
o snapshot atualizado esteja disponível em `estado`. `aceitaPeloNavegador:true` só significa
que `localStorage.setItem` retornou sem exceção; não significa fsync, proteção contra expulsão,
retenção após fechar o navegador ou backup. false indica aceitação não confirmada ou escrita não realizada;
null é operação sem confirmação de escrita. Uma aceitação anterior ao encerramento continua
identificada como tal, mas o resultado tardio não devolve dados descartados nem reabre a sessão.

Estados observáveis de durabilidade: `nao-verificada`, `ausente`, `persistido-lido`,
`gravacao-aceita`, `memoria`, `conflito`, `suspenso`, `encerrado`. Estes são estados de transporte,
independentes de situação pedagógica/administrativa do pacote. `etapa` distingue `acesso`,
`leitura`, `comparacao`, `escrita` e `autorizacao`. Códigos incluem `ACESSO_BLOQUEADO`,
`ACESSO_FALHOU`, `ARMAZENAMENTO_INDISPONIVEL`, `QUOTA_EXCEDIDA`, `LEITURA_FALHOU`,
`ESCRITA_FALHOU`, `DADOS_PERSISTIDOS_INVALIDOS`, `ESTADO_INVALIDO`, `CONFLITO_PERSISTIDO`,
`CANAL_INATIVO`, `ARMAZENAMENTO_ENCERRADO` e motivos de suspensão do coordenador.
Não há logs de respostas, valores brutos, exceções ou credenciais.

Se um novo snapshot chegar enquanto há leitura/escrita aguardando autorização, a memória é
atualizada imediatamente e a segunda chamada informa `OPERACAO_EM_ANDAMENTO`. Um contador
interno do slot invalida o resultado superado (`ESTADO_SUBSTITUIDO`), sem escrever a versão
antiga ou permitir que leitura pendente substitua o estado recente. Não há fila automática:
a retomada exige `tentarPersistir()` explícito ou novo salvamento. Se uma escrita anterior já
foi aceita antes de chegar o snapshot novo, o aceite é informado, mas a durabilidade do estado
mais recente permanece `memoria` até nova confirmação.

Cada leitura/gravação persistente passa por callback síncrono autorizado dentro do coordenador:
sessão ativa, atividade vinculada à aquisição atual, identidade/origem reconfirmadas e posse
privada do lock ainda válida. O gate consulta também Web Locks reais para confirmar o nome
completo e modo exclusivo. Falta de posse ou query que falha suspende com
`EXCLUSIVIDADE_PERDIDA`/`EXCLUSIVIDADE_NAO_CONFIRMADA`; identidade divergente mantém os motivos
anteriores. A permissão não é devolvida como token reutilizável depois de um await.
Callbacks obsoletos são recusados, inclusive rejeição tardia de query após encerrar.
Estado atualizado capturado antes da perda de autorização fica só em memória, na mesma
identidade esperada; a sessão não vira temporária nem adota outra origem/cópia.

O adaptador interno `LabProgresso.criarArmazenamento()` mantém slots privados da sessão.
`abrir` é usado pelo coordenador com configuração fechada de modo, identidade, sessão e
callbacks confiáveis de autorização/vigência. Gerador interno valida copyId/digest hex de 64
caracteres, perfil/matéria fechados, ID e versão do contrato, e sessão fechada. Esse contrato JS
interno não é uma autorização para aceitar callbacks/configuração de JSON importado, nem uma
barreira de segurança contra scripts da mesma origem. Nenhuma API aceita prefixo/chave livre,
faz varredura, usa `localStorage.clear()` ou remove progresso.

**Proteção de divergência:** cada slot guarda o último snapshot em memória e a string exata
da base persistida conhecida. Após escrita falha, `carregar` devolve a memória sem reler a base
antiga. Retentativa lê a chave e só escreve se ainda corresponder à base conhecida (ou estiver
ausente quando nunca houve base). Se um progresso preexistente ainda não foi carregado, salvar
não o sobrescreve: primeiro é necessário carregamento explícito. Valor divergente, inclusive
diferença apenas de serialização, bloqueia futuras escritas nesse slot; nenhum merge/reparo ou
adoção automática é oferecido. JSON persistido inválido é preservado e recusado.
O conflito conserva o snapshot em memória e o valor divergente no navegador. Não há resolução
de conflitos/backup disponível; encerrar perde o snapshot não persistido.

Slots são isolados por modo/copyId/perfil/matéria/pacote/versão/digest/sessão. Liberar e reabrir a
mesma atividade na mesma instância reutiliza memória/base para não perder resposta recente
após falha; handles da aquisição anterior ficam inativos e não fazem IO ou novas gravações.
Um handle inativo pode inspecionar sua memória pelo resultado de `carregar`, mas não usar o
armazenamento do navegador. Suspender preserva slots; encerrar limpa texto/base e referências
de todos eles, fecha a coleção e invalida seus handles. Instância nova não adota essa memória.

Temporário continua exigindo consentimento no coordenador e uma atividade temporária ativa.
Seu canal nunca acessa localStorage/IndexedDB, nunca gera chave persistente e não carrega
progresso de instalação persistente. Há somente memória até encerrar; backup/exportação e
recuperação depois de fechar continuam indisponíveis. Não existe consentimento paralelo.

Limites de transporte (não validação pedagógica): snapshot raiz objeto JSON simples, sem
funções/acessores/toJSON executável, ciclos, números não finitos ou tipos especiais; até 16
níveis, 10000 nós e 262144 bytes UTF-8 serializados. O adaptador não decide se respostas,
pontuação, correção ou conclusão são coerentes. **LAB.2C deverá usar o normalizador/avaliador
existente do motor antes de salvar e depois de carregar**, por handle opt-in. Não conectar uma
Promise de canal ao retorno síncrono legado: a futura integração deve aguardar os metadados
sem alterar fluxo oficial. Não há motor provisório, progresso de atividade real, exportação,
restauração, journal, arquivamento ou descarte nesta etapa.

Limites de atomicidade: HTTP de identidade, query de locks e localStorage não formam transação
atômica. Comparação da base e escrita são síncronas, protegidas pelo lock cooperativo, mas não
são CAS atômico contra outra aba/script que ignore o protocolo. APIs nativas adulteradas e
scripts maliciosos da mesma origem não são autenticados. Erro de storage não converte sessão
nem implica perda dos dados anteriores; aviso visual de durabilidade dependerá da futura UI.

Testes direcionados: **30/30 novos** (Node e Chromium), mais **155/155 regressões LAB anteriores**,
total **185/185**. Cobertura inclui persistência real, falhas, quota, bloqueio, base divergente,
identidade/posse, memória temporária, callbacks após encerrar, isolamento e convivência com a
API legada síncrona. Um teste reproduziu de propósito a rejeição tardia de query; o gate novo
foi corrigido com guard de geração, mantendo a asserção terminal. Nenhum teste anterior alterado.
Outros três testes reproduziram sobreposição de snapshots durante autorização; o contador do
slot passou a impedir escrita/leitura superada, mantendo o estado mais recente em memória.
Build, formato, lint e `git diff --check` aprovados em 05/11/2026.

Global avaliada: não há alteração em `armazenamento.js` ou outro comportamento compartilhado
do aplicativo; apenas adaptador LAB não importado e API opt-in no coordenador isolado.
Não se aciona nova global para este recorte. A global de LAB.2B.1 permanece evidência daquele
snapshot, não do código novo. Integração ao motor, persistência oficial ou qualquer alteração
compartilhada na LAB.2C exigirá a global conforme AGENTS; não há dispensa nova de política.
Vínculos, logs, perfis sintéticos, `test-results` e os 29 PNGs anteriores foram preservados,
sem executar a suíte sobre seus caminhos fixos ou limpar evidências. Próxima etapa não iniciada.

### Concorrência

Antes de abrir, restaurar ou descartar, adquirir exclusão por atividade/cópia entre abas.
V1 usa Web Locks quando disponível, mantendo a sessão dona do lock; segunda aba só lista e
informa atividade em uso. Sem suporte, LAB fica temporário e não faz manutenção persistente.
Não simular lock seguro apenas com localStorage ou BroadcastChannel. Liberação do processo
libera lock, mas não autoriza apagar dados. Operações em identidades diferentes são independentes.

#### Coordenador implementado LAB.2B.2

`ambiente_interativo/js/lab-coordenador.js` é módulo isolado, não importado no aplicativo.
CommonJS resolve os módulos LAB anteriores; como script, carregar após validador, identidade e
repositório. Não altera esses módulos, nem storage/motor/registro/interface/launcher/ORG.
O coordenador consulta pacotes persistentes pelo repositório existente, sem cadastrar, atualizar
ou apagar conteúdo no IndexedDB. O cadastro LAB.2B.1 continua separado, não é ampliado aqui.
Preparar uma sessão pode criar o schema de um banco LAB novo pela abertura já existente;
isso não é autorização para executar atividade, gravar progresso ou administrar conteúdo.

API: `LabCoordenador.criarSessao()` devolve handle congelado, sem argumentos de configuração,
repositório bruto ou nome de banco/lock vindo do JSON. Métodos assíncronos retornam Promise:

| Método | Contrato |
| --- | --- |
| `preparar()` | Só de `nova`; resolve identidade e Web Locks, abre o repositório e reconfirma a cópia. Sucesso deixa `pronta/persistente`. Falta de capacidade inicial oferece `aguarda-consentimento`, nunca ativa temporário automaticamente |
| `decidirTemporario(boolean)` | Síncrono; só após oferta. `true` autoriza uma nova sessão em memória; `false` deixa `recusada`, terminal. Objetos, strings, JSON e propriedades como `consentimento` não valem decisão |
| `obterSituacao()` | Síncrono, snapshot sem referências internas: estado, modo, copyId/origem, motivo, disponibilidade, operação pendente, identidade da atividade, quantidade temporária e aviso. Não faz IO; não comprova identidade em tempo real |
| `revalidar()` | Reconfirma identidade/origem e Web Locks antes de continuar persistente; não consulta/monitora periodicamente. Estado do banco é confirmado nas consultas pelo repositório |
| `carregarTemporario(entradaJSON)` | Somente após consentimento, valida pelo LAB.2A e guarda JSON canônico/digest em Map privado. Reimportação idêntica é idempotente; mesma identidade com conteúdo diferente é conflito. Sem acesso ao repositório |
| `consultar({perfil,id,versao})`, `listar(perfil)` | Em persistente, consultas delegadas com gates e revalidação do repositório; em temporário, só a memória da instância. Não adota conteúdo de banco existente para a sessão temporária |
| `adquirir({perfil,id,versao})` | Exige pacote já disponível no modo escolhido; obtém identidade completa por leitura validada. Mantém uma atividade autorizada por instância; em persistente tenta lock exclusivo imediato; em temporário não promete exclusão entre abas |
| `liberar()` | Invalida operações pendentes de acesso, libera a atividade e volta a `pronta`, preservando conteúdo temporário até o encerramento. Chamadas simultâneas compartilham a mesma liberação. Não limpa conteúdo nem progresso |
| `encerrar()` | Terminal, idempotente; invalida callbacks, fecha o handle do repositório, libera posse e esvazia apenas a memória temporária. Remove seu listener de `pagehide`; chamadas repetidas devolvem a mesma Promise |

Estados: `nova → preparando → pronta → adquirindo → ativa`; `liberar` retorna a `pronta`.
Alternativa inicial: `preparando → aguarda-consentimento → pronta/temporario` ou `recusada`.
Perda/falha relevante em sessão persistente resulta em `suspensa`, sem retomada automática e
sem consentimento temporário aceito nessa instância. Qualquer estado pode ser encerrado;
`encerrada` não volta a outro estado. Nova tentativa após suspensão/recusa exige nova instância
e ação explícita do responsável; dados persistentes anteriores ficam intactos.

O resultado de sessão inclui `ok`, `situacao` e, nas recusas, `codigo`. Consultas/listagens
reutilizam os resultados do repositório ou objetos equivalentes em memória. Exemplos de códigos:
`CONSENTIMENTO_NECESSARIO`, `CONSENTIMENTO_RECUSADO`, `DECISAO_INVALIDA`,
`ESTADO_INCOMPATIVEL`, `MODO_INCOMPATIVEL`, `OPERACAO_EM_ANDAMENTO`, `OPERACAO_OBSOLETA`,
`PACOTE_AUSENTE`, `ATIVIDADE_JA_ABERTA`, `ATIVIDADE_OCUPADA`, `LOCK_TIMEOUT`, `LOCK_FALHOU`,
`LOCK_PERDIDO`, `IDENTIDADE_ALTERADA`, `IDENTIDADE_INDISPONIVEL`, `WEB_LOCKS_INDISPONIVEIS`.
Erros de consulta e validação mantêm seus códigos anteriores, sem repassar exceções ou stacks.
Operações comuns não são enfileiradas: uma operação pendente recusa outra; liberar/encerrar
podem invalidá-la. A contagem de geração é conferida também depois dos awaits e antes de
aceitar uma transição. Um resultado atrasado não repovoa memória nem reabre a sessão.

Lock gerado internamente:
`revisoesEscolares.lab.sessao.v1.` + JSON da lista
`[copyId, perfil, materia, id, versao, digest]`. Web Locks já é escopado à origem do navegador.
Usa apenas `{mode:'exclusive',ifAvailable:true}`, sem `steal`, fila indefinida, localStorage
ou BroadcastChannel. O callback conserva uma Promise pendente até liberar/encerrar.
Segunda aba recebe `ATIVIDADE_OCUPADA`, disponibilidade `ocupada`, sem mutação e sem pending
lock. Tentativa anômala sem resposta expira em 3 s; callback que chegar depois não retém posse.
Atividades/cópias distintas têm locks diferentes. Perda de identidade/origem ou capacidade de
locks suspende novas consultas persistentes e libera a atividade; nada é convertido ou apagado.

Modo temporário guarda somente pacote canônico/digest em memória da instância, com progresso
inexistente. Não lê/escreve localStorage, IndexedDB ou outro banco para buscar conteúdo; não
inventa `copyId`. Aviso obrigatório no contrato: **“Conteúdo somente em memória: não sobreviverá
ao encerramento. Backup e exportação não estão disponíveis.”** Campos `backupDisponivel` e
`exportacaoDisponivel` são sempre false. `liberar` não encerra a sessão; `encerrar`, fechar a
página ou perder seu processo torna essa memória indisponível. O contrato booleano é destinado
a uma futura ação explícita do responsável: não autentica clique, pessoa ou intenção em JS.

Limites: locks são cooperação entre clientes desta API, não controle de acesso contra scripts
da mesma origem; o repositório bruto continua sendo uma capacidade separada. Não há monitor
contínuo de identidade; a mudança é detectada nas próximas transições/consultas. O check HTTP
não é atômico com troca de servidor. Suspender/encerrar não pode cancelar uma consulta HTTP já
iniciada pelo componente anterior; seu resultado é invalidado. Abertura IDB iniciada antes do
encerramento pode terminar, mas seu handle tardio é fechado sem adoção; schema vazio pode ficar
no banco, sem remoção automática. `pagehide` encerra também no caso de bfcache; retorno exige
instância nova. Encerramento inesperado do processo depende da liberação nativa de Web Locks.
Não há execução escolar, progresso, backup, exportação, journal, arquivamento ou descarte.

Testes em `tests/validacao/lab-coordenador.unit.cjs`: **26/26**, sendo cinco Node e 21 Chromium,
com locks reais em duas abas, mesmo copyId/atividade ocupado, atividades/cópias independentes,
encerramento normal e fechamento inesperado, consentimento/recusa, memória sem persistência,
falhas e callbacks tardios. Regressões LAB.2A/LAB.2B.1: **129/129**; total **155/155**.
Na revisão, dois testes adicionais reproduziram uma janela entre o retorno de `conferir` e a
continuação do chamador. O guard de geração foi aplicado nessas duas transições do módulo novo;
os testes passam sem relaxar asserções. Nenhum módulo anterior precisou de ajuste.

Verificação de 05/11/2026: build, formato, lint e `git diff --check` aprovados. Não se reutiliza a global LAB.2B.1
como prova do coordenador novo. A global não é acionada aqui: coordenador ainda não importado,
consultas persistentes delegadas sem alterar escrita/schema do repositório, nenhuma mudança em
persistência existente, motor, storage compartilhado, progresso, navegação, interface, build ou
política. A falha reproduzida de propósito pelos dois testes novos foi localizada no código
novo e corrigida por testes direcionados; não houve falha inesperada em regressão existente.
Uma futura integração ou mudança nessas superfícies continua exigindo global conforme AGENTS.
Os caminhos fixos/evidências da global anterior não foram reutilizados, limpos ou sobrescritos;
os vínculos de dependências foram mantidos, sem instalação/download. Incremento seguinte depende
de novo pedido; recomenda-se fechar os contratos de durabilidade antes de motor/backup.

## 6. Ciclo de vida

Situação pedagógica é derivada pelo motor por sessão: `nao-iniciada`, `em-andamento`,
`concluida`. Abrir/saltar administrativamente não fabrica acertos. Revisitar questão pode
retornar a em andamento segundo o comportamento existente; refazer/limpar é ação própria.
A lista mostra sessão principal; responsável não conclui a atividade da criança.

| Situação administrativa | Ações permitidas | Efeito |
| --- | --- | --- |
| Nova importação | Confirmar importação | Torna ativa, sem progresso fabricado |
| Ativa | Abrir, exportar, arquivar, descartar | Arquivar preserva tudo; descartar exige confirmação própria |
| Arquivada | Exportar, reativar, descartar | Reativar conserva conteúdo/progresso e volta a ativa; não abre diretamente |
| Descartada | Reimportar conteúdo idêntico, restaurar backup, excluir progresso | Sem execução; tombstone impede mudança silenciosa de conteúdo |

Arquivar fecha a execução e retira registro em memória, mas preserva conteúdo e todas as
sessões. Descartar fecha/libera e remove apenas conteúdo do IndexedDB, conservando tombstone
e progresso. Confirmação informa perfil/título/versão e que o progresso ficará guardado;
oferecer exportação prévia sem torná-la consentimento implícito para descarte.

Excluir progresso é operação independente, disponível inclusive em descartadas. Exige seleção
de sessão e confirmação própria; não elimina conteúdo, tombstone ou progresso de outra sessão.
Para ambas as sessões, realizar duas exclusões explicitamente selecionadas e confirmadas.
Nunca `localStorage.clear()`, varredura por prefixo nem limpeza por idade/conclusão.
Se sessão estiver aberta, limpar pelo handle/motor antes de liberar para não regravar cache antigo.

Reimportação idêntica de ativa/arquivada não muda a situação. Para descartada, confirmar
recuperação de conteúdo e escolher ativa ou arquivada (padrão arquivada); progresso preservado
volta a ser utilizável. Mudança de conteúdo exige versão nova. Tombstone não é removido para
contornar conflito. Nenhum gatilho automático de expiração, coleta de lixo ou ORG.

## 7. Segurança e recuperação

### Snapshots internos implementados LAB.2C.3

O handle LAB aberto ganhou duas operações síncronas de leitura, sem nova API global para
consultar revisões oficiais e sem gravação, espera de IO ou restauração:

| Operação | Resultado |
| --- | --- |
| `handle.exportarSnapshot()` | `{ok, vinculo, snapshot, durabilidade}`: cópia independente do estado lógico mais recente da sessão já selecionada em `abrir`, inclusive durante escrita pendente ou falha de salvamento |
| `handle.validarSnapshot({vinculo, snapshot})` | Prévia `{ok, vinculo, snapshot, resumo, restauracaoAutorizada:false}`, ou `{ok:false,codigo,caminho}`; não aplica a entrada a memória, IndexedDB ou localStorage |

Somente o handle exato emitido pelo motor e seu vínculo ainda vigente podem usar essas APIs.
Registro ainda não aberto, execução encerrada, handle revogado ou aquisição suspensa são
recusados. Após fechamento recusado por quota/divergência, o estado continua inspecionável;
durante drenagem do fechamento, a leitura permanece possível até a revogação do vínculo.
Uma execução oculta ao abrir uma revisão oficial continua acessando apenas a própria memória.
A captura síncrona não cria callbacks nem interage com a fila de gravações; não pode capturar
meia ação do motor nem reativar execução encerrada. Após desativação limpa, reabrir a sessão
antes de capturar novamente.

`vinculo` é um objeto fechado com `perfil`, `materia`, `id`, `versao` do pacote, `digest` e
`sessao` (`principal`/`responsavel`). Vem da aquisição privada do coordenador, congelado na
conexão, sem `copyId`, chave ou caminhos. A prévia exige correspondência exata desses seis
campos; não deduz nem converte pacote/perfil/sessão a partir das respostas. O corpo isolado,
sem vínculo, não é aceito. O digest vincula o conteúdo do pacote, não autentica a história das
respostas. `durabilidade` não faz parte do envelope de validação.

O corpo versão 1 possui exatamente oito campos obrigatórios, inclusive mapas vazios:

| Campo | Representação efetiva do motor LAB |
| --- | --- |
| `versao` | Inteiro literal `1`, distinto da versão do pacote |
| `questaoAtual` | Índice inteiro baseado em zero no intervalo das questões |
| `respostas` | Mapa esparso por ID de questão; quando presente, array denso de strings com exatamente o número de itens daquela questão, na ordem do pacote |
| `corrigidas`, `pontuadas`, `conferidas` | Mapas esparsos por ID conhecido, somente valores `true`; ausência representa marcador não definido |
| `pontos` | Inteiro igual à contagem dos marcadores históricos em `pontuadas`, recalculado pelo normalizador |
| `finalizada` | Booleano; `true` exige todas as correções atuais e posição na última questão |

Compatibilidade conservadora com estados reais LAB.2C.2: campos digitados são truncados pelo
normalizador existente em **1.000 unidades UTF-16** (`slice(0,1000)`), não 160 pontos de código
como previa LAB.1. A captura/validação v1 admite esse limite já produzido, inclusive texto
vazio e unidades Unicode preservadas pelo motor; não trunca entrada externa. Alternativas
continuam restritas à opção literal do pacote ou `''`. Os textos/gabaritos do pacote mantêm
seus limites LAB.2A. Nenhum contrato legado foi alterado para adequar-se ao documento.
Uma conferência vazia pode registrar `conferidas` sem entrada em `respostas`, como faz o motor;
um ponto histórico exige a entrada de respostas que o motor conserva mesmo após editar/apagar.

A cópia declarativa existente foi reutilizada com limites exclusivos para snapshot: 10.000 nós,
profundidade 12, 1.000 unidades UTF-16 por string e 2 MiB de JSON UTF-8. Arrays esparsos,
propriedades ocultas/extras/simbólicas, acessores, funções, ciclos, objetos/protótipos especiais,
valores não JSON e nomes proibidos são recusados. Getters de dados não são executados; exceções
adversariais não são inspecionadas como mensagens de erro. A API recebe objeto de dados, não
texto JSON, arquivo ou código; não implementa parser/importador de backup. Proxies/scripts da
mesma origem não são uma fronteira de segurança contra execução de código já autorizado.

Após verificar estrutura, limites, IDs e índices, a prévia usa `avaliar`/`respostaPreenchida` e
o **mesmo `normalizadorDaRevisao` estrito** do motor, com estado-base novo. Recusa toda diferença
entre entrada e resultado normalizado; não filtra, completa, converte ou repara o snapshot
silenciosamente. Correção exige resposta atual válida/correta, conferência e ponto; conferência
com resposta toda correta exige a correção correspondente. Resposta correta sem conferência
pode continuar sem ponto. A pontuação histórica pode permanecer após editar para resposta
errada/vazia, sem correção atual; reavaliar não fabrica acerto nem remove esse histórico legítimo.
A validade é coerência declarativa, não prova autenticada de que uma criança ganhou os pontos.

`durabilidade` informa `modo`, `pendente`, `naoDuravel` e cópia do último `resultado` do canal.
Estado inicial sem persistência, temporário ou revisão lógica ainda não confirmada é indicado
como não durável. Metadados podem mudar quando IO termina; o corpo é determinístico enquanto
o estado lógico não mudar. Nenhuma consulta de identidade/rede/locks é iniciada pela captura:
exige a aquisição local vigente; suspensão já conhecida recusa a operação. Cada escrita continua
revalidando identidade e lock pelo contrato LAB.2C.2, sem liberação antecipada, retry divergente
ou troca silenciosa de cópia. Capturar não confirma retenção permanente pelo navegador.

O teto de captura comporta até 30 × 6 respostas de 1.000 unidades, inclusive JSON escapado,
que pode superar os 256 KiB do transporte persistente LAB.2B.3. Não se ampliou esse transporte:
se falhar, a memória recente pode ser inspecionada. A futura camada de backup precisará aplicar
seus próprios limites agregados, consentimento e tratamento de escrita em disco. Permanecem
pendentes arquivos `lab-backup-v1`, restauração, conflitos, journal/rollback, interface e
recuperação entre processos/cópias. Memória capturada não é backup em disco.

Testes novos: 28/28 Chromium em `tests/validacao/lab-snapshots.unit.cjs`; regressões anteriores
230/230, conjunto LAB 258/258 aprovado. Build/formato/lint/diff aprovados; global integral
aprovada em 05/11/2026: 925/925 Node (121,2 segundos) e 638/638 Playwright (45,7 minutos),
`npm test` com saída 0. Relatório `status=passed`, `complete=true`, 638 casos descobertos,
esperados, executados e aprovados, 638 tentativas, sem falhas/retries/skips/flakies/omissões,
interrupções ou timeouts. Fontes/artefatos não mudaram durante a execução; depois dela,
somente este resultado documental. Log exclusivo `tmp/lab2c3-global-20261105-145224/npm-test.log`
e relatório `tmp/validacao/2026-11-05T17-55-07-790Z-8b3d5a84-e8b9-4a86-a0fe-c1227479b5af/run.json`.
Antes da global, diretórios fixos preservados sem sobrescrita em
`tmp/lab2c3-global-20261105-145224/evidencias-anteriores/`: `test-results` (180 arquivos,
32.099.953 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao` (10 arquivos,
2.548.701 bytes), antes em `tmp/validacao`. Contagens/bytes conferidos antes/depois no manifesto
`preservacao.json` da rodada. O relatório LAB.2C.2 anteriormente em
`tmp/validacao/2026-11-05T11-33-40-546Z-0a9c2ac9-819b-4b5d-b76f-f5b6eb10be25/run.json`
agora está em `evidencias-anteriores/validacao/` dessa rodada. Logs, perfis sintéticos,
arquivos históricos `tmp/lab2c2-global-*`/anteriores e nove vínculos permanecem preservados.
Após a global, contagens/bytes arquivados foram reconferidos; os novos 29 PNGs permanecem
em `output/` e os nove vínculos estão intactos. Nenhum teste anterior/política alterado.
LAB.2C.3 concluída; próxima etapa não iniciada.

### Backups em memória implementados LAB.2C.4

`js/lab-backup.js` é módulo isolado e opt-in, sem import no aplicativo. Depende de LAB.2A;
validação de sessões/captura exige também o motor LAB. Não contém corretor próprio, operações
de restauração, acesso direto a storage, download ou APIs administrativas do repositório.

| API | Contrato implementado |
| --- | --- |
| `LabBackup.validarBackup(textoOuBytes)` | Promise: valida integralmente texto ou `Uint8Array` (inclusive Buffer no Node) e retorna `{valido,backupNormalizado,json,bytes,previa}` ou `{valido:false,erros}`; não aplica nada |
| `inspecionarBackup(textoOuBytes)` | Mesma validação, devolvendo apenas `{valido,bytes,previa}` sem pacote, respostas ou gabaritos; erros seguros sem dados brutos |
| `capturar(handleLab)` | Captura síncrona da sessão selecionada em handle autêntico; retorna `{ok,captura,resumo}` com token opaco privado, cópia do pacote, snapshot atual e durabilidade preservados internamente |
| `capturarPacote(coordenador)` | Promise: consulta somente a atividade já adquirida por coordenador autêntico, sem ler progresso ou abrir outra atividade; token sem sessões, que não cria sessões vazias no backup |
| `construirBackup(fontes)` | Promise: cada fonte fechada é `{situacaoAdministrativa,capturas:[tokens]}`. Retorna o resultado validado e `capturasSomenteMemoria` fora do arquivo, sem gravar nem abrir atividades |

Até 20 fontes/entradas; conjunto vazio é válido e a prévia informa zero atividades. Cada fonte
não vazia exige de uma a três capturas autênticas do mesmo pacote/digest (pacote sem progresso
e/ou sessões principal/responsável). Sessão repetida é recusada, sem merge. O chamador captura
cada sessão explicitamente no fluxo LAB já autorizado; a construção não troca sessões, não lê
outras atividades, não atribui ausência de snapshot a estado vazio e não inventa dados.
Identidades `(perfil,id,versao)` repetidas/conflitantes invalidam o backup inteiro, inclusive
mudança de matéria/conteúdo sem nova versão. `ativa`/`arquivada` são declarações do envelope,
sem alterar a administração local; `descartada`, pacote ausente e progresso órfão são recusados.

Tokens são mantidos em WeakMap, não serializáveis nem forjáveis por objetos com métodos
parecidos. O motor ganhou apenas `capturarParaBackupLab(handle)` (acesso pelo WeakMap de
handles, nunca ID oficial) e `criarValidadorSnapshotLab(textoOuBytesDoPacote)` (contexto puro).
O segundo revalida o pacote pela LAB.2A, congela sua configuração mínima e deriva internamente
perfil, matéria, ID, versão e digest; `validarSnapshot(sessao,snapshot)` chama a análise
LAB.2C.3 existente. Esse contexto **não** representa sessão aberta, lease ou autorização de
restauração: não registra atividade, lê progresso, mostra painel ou escreve. A mudança mínima
no motor foi necessária para analisar múltiplos pacotes/sessões sem abri-los artificialmente;
não alterou normalizador, avaliador, pontuação, navegação ou APIs legadas. Exige global integral.

O arquivo não fornece vínculo confiável ou callback: o módulo recalcula o digest do pacote e
solicita seu próprio contexto ao motor, que revalida o conteúdo. Não aceita `vinculo`, `copyId`
ou chave apresentados pelo arquivo. A sessão é determinada pela chave fechada `principal` ou
`responsavel` do envelope e avaliada nesse contexto. Dados editáveis coerentes não provam sua
origem histórica; trocar manualmente dois snapshots estruturalmente compatíveis não é
autenticável por esse formato. A captura por token impede essa mistura durante a construção.

O parser LAB.2A foi reutilizado, com perfil fechado adicional `lerJSONBackup` e
`LIMITES_BACKUP`: 8 MiB UTF-8, 16 contêineres e 200000 tokens. `validarPacote` mantém seus
256 KiB, profundidade 8 e 10000 tokens originais. Bytes/BOM/UTF-8 e Unicode são conferidos antes
de parse/schema/digests; o scanner recusa duplicatas inclusive escapadas e nomes perigosos.
Bytes são lidos por slots nativos sem executar getters de subclasses/objetos de entrada.
O scanner guarda os trechos originais dos pacotes: cada pacote é revalidado separadamente,
incluindo bytes de sua formatação interna, sem o compactar para contornar os 256 KiB.
Também se confere o tamanho canônico do pacote. Não há outro parser nem dependência externa.

O envelope fechado tem `formato:'lab-backup-v1'`, `versao:1` e `entradas`. Cada entrada exige
`pacote`, `digest` SHA-256 minúsculo recalculado, `situacaoAdministrativa` (`ativa`/`arquivada`)
e `sessoes` (objeto fechado, ambas opcionais). Os snapshots seguem integralmente LAB.2C.3:
oito campos, respostas até 1.000 unidades UTF-16, histórico de pontos distinto de acerto atual
e recusa integral de reparações. Gabaritos declarativos do pacote continuam limitados a 160
pontos de código. Sem contexto do motor disponível, sessões são recusadas; nunca se usa um
corretor alternativo. Validação sem sessões pode rodar puramente em Node.

Saída normaliza os pacotes e snapshots pelo contrato existente, ordena entradas por perfil,
ID e versão (comparação estável, independente de locale), sessões principal/responsável em
ordem fixa e serializa em JSON compacto com ordem de campos definida. Formatação equivalente
produz o mesmo `json`; `bytes` mede essa representação normalizada. A construção verifica o
orçamento incremental antes de montar o texto total e o submete à validação integral final.
Não há arquivo, Blob, download, telemetria ou gravação implícita. A prévia mostra identidades,
matérias, versões, administração, sessões incluídas e resumos de coerência, com
`restauracaoAutorizada:false`. Erros não devolvem nomes arbitrários, respostas ou estado parcial.

Cada token é uma cópia independente no instante da captura, reutilizável após fechar o handle;
alterações posteriores e mutações do resultado não o alteram. Isso não garante um instante
atômico comum a várias sessões/atividades. `capturasSomenteMemoria` informa quais sessões não
tinham confirmação de persistência no instante capturado, inclusive temporário/quota/escrita
pendente; o aviso fica fora do envelope, pois durabilidade da origem não é garantia de retenção
no destino. Capturar/construir/validar não resolve conflitos persistidos nem faz retry.

Limite de compatibilidade: LAB.2C.3 conserva unidades Unicode isoladas legitimamente produzidas
pelo `slice(0,1000)` do motor. O formato textual estrito recusa esse caso com `UNICODE_INVALIDO`,
sem truncar/reparar o texto e sem perder o estado original no handle. O responsável precisará
corrigir explicitamente esse texto antes de uma exportação futura. Nenhuma mudança de legado
foi feita para eliminar o caso; captura em memória e backup textual têm essa diferença explícita.

LAB.2C.5 poderá usar o `json`/`backupNormalizado` e a prévia, sempre revalidando o texto na entrada
da futura recuperação, sem confiar em um objeto mutável marcado `valido:true`. Interfaces
de planejamento por leitura implementadas em LAB.2C.5A abaixo; aplicar plano confirmado e
reconciliar destino após interrupção continuam **planejados, não implementados**. Contratos mínimos:

- Resolver identidade da cópia de destino explicitamente; jamais adotar `copyId`/chaves da origem.
- Consultar conteúdo existente pelo repositório: mesmo digest é idempotente; digest distinto para
  a mesma identidade é conflito, sem sobrescrita/merge automático ou criação de API administrativa aqui.
- Comparar progresso normalizado por sessão e base persistida vigente: idêntico é no-op;
  divergente exige decisão explícita futura, preservando ambas as versões até resolução.
- Adquirir exclusividade por atividade e fechar/drenar execução pendente pelo contrato LAB.2C.2
  antes de qualquer aplicação; gerar chaves pelo destino e revalidar identidade/posse em cada escrita.
- IndexedDB e localStorage não formam transação única. Journal/rollback/reconciliação deverão
  guardar intenção e resultado por etapa, detectar interrupção e deixar operações incompletas
  pendentes até comprovar/reconciliar o destino; sucesso parcial não pode ser anunciado como completo.

Nada dessa recuperação, journal ou política de conflitos foi implementado nesta etapa.
Testes: 17 puros + 16 Chromium = 33/33 novos; regressões LAB anteriores 258/258, total 291/291.
Build/formato/lint/diff aprovados. Global integral aprovada em 05/11/2026: 958/958 Node
(120,6 segundos) e 638/638 Playwright (44,9 minutos), `npm test` com saída 0.
Relatório `status=passed`, `complete=true`, 638 descobertos/esperados/executados/aprovados e
638 tentativas, sem falhas/retries/skips/flakies/omissões/interrupções/timeouts. Fontes/artefatos
não mudaram durante a execução; depois dela, apenas este resultado documental. Log exclusivo
`tmp/lab2c4-global-20261105-172510/npm-test.log` e relatório
`tmp/validacao/2026-11-05T20-27-50-535Z-4117cc37-f376-4ca5-9bf8-2f2a11d3569d/run.json`.
Antes da global, diretórios fixos preservados sem sobrescrita em
`tmp/lab2c4-global-20261105-172510/evidencias-anteriores/`: `test-results` (180 arquivos,
32.101.792 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao` (10 arquivos,
2.549.576 bytes), antes em `tmp/validacao`. Contagens/bytes conferidos antes/depois no manifesto
`preservacao.json` da rodada. O relatório LAB.2C.3 anteriormente em
`tmp/validacao/2026-11-05T17-55-07-790Z-8b3d5a84-e8b9-4a86-a0fe-c1227479b5af/run.json`
agora está em `evidencias-anteriores/validacao/` dessa rodada. Logs, perfis sintéticos,
arquivos históricos `tmp/lab2c3-global-*`/anteriores e nove vínculos preservados.
Após a global, contagens/bytes arquivados foram reconferidos; os novos 29 PNGs permanecem
em `output/` e os nove vínculos estão intactos. Nenhuma política/teste anterior alterado.
LAB.2C.4 concluída; LAB.2C.5 não iniciada.

### Planejamento por leitura implementado LAB.2C.5A

`js/lab-restauracao.js` é módulo isolado, opt-in e não importado pelo aplicativo. Não altera
motor, repositório, identidade, coordenador, progresso ou backup aprovados. Reutiliza essas
APIs e devolve somente diagnóstico; não contém cadastro, set/remove/clear, aplicação de
snapshot, gravação de journal, rollback, reconciliação, interface ou aquisição/liberação de Web Locks.
Na LAB.2C.5B passou a consultar pendências de journal conforme contrato abaixo, sem aplicá-las.

| API | Contrato |
| --- | --- |
| `LabRestauracao.prepararPlano(textoOuBytesOriginais, {handlesLab:[]} = {})` | Promise de `{ok,plano,previa}` ou `{ok:false,codigo,erros?}`. Revalida todo o backup LAB.2C.4 antes de consultar identidade/armazenamento; recusa `{valido:true}` como substituto do original |
| `inspecionarPlano(plano)` | Cópia independente da prévia privada em WeakMap; token opaco não serializável. Não refaz leituras, não garante atualidade e não concede nenhuma permissão |

A prévia contém destino atual (`origem`, `copyId`), identidades dos pacotes (perfil, matéria,
ID, versão, digest), administração declarada, conteúdo/progresso observados, operações apenas
potenciais, dependências e bloqueios por entrada. Nunca contém respostas, gabaritos, chaves
locais completas ou valores brutos. `restauracaoAutorizada:false`,
`associacaoDestinoConfirmada:false`, `confirmacaoExplicitaNecessaria:true`,
`repetirValidacaoSobExclusividade:true` e `instantaneoSemGarantiaDeVigencia:true` são explícitos.
Mudar a cópia pública não altera a prévia privada. Não existe API de aplicar ou promover token
a lease/permissão; o token conserva apenas diagnóstico, não backup, chaves ou bases brutas.

Destino é resolvido exclusivamente por `LabIdentidade`, reconfirmado na abertura/consultas
do repositório e ao final da preparação. Origem/copyId divergentes, identidade indisponível
ou troca detectada (mesmo depois revertida) recusam o plano inteiro. Não há adoção de origem
do backup, fallback temporário, busca de outras worktrees ou escolha de chave pelo arquivo.
Toda entrada exige associação explícita ao destino na confirmação futura, mesmo quando os
dados parecem idênticos; preparação não é consentimento.

Conteúdo é consultado apenas por `(perfil,id,versao)` na API aprovada e reconferido ao final:
`ausente`, `identico`, `conflito-digest`, `dados-ou-administracao-invalidos`,
`consulta-inconclusiva` ou `alterado-durante-planejamento`. Ausência sugere cadastro futuro;
conteúdo idêntico sugere preservação. Falhas e conflitos bloqueiam sem reparar/reimportar.
Metadados também entram na reconferência; ela não é uma transação atômica com as demais leituras.
LAB.2B.1 só suporta administração `ativa`: backup `arquivada` gera
`ADMINISTRACAO_ARQUIVADA_NAO_SUPORTADA` e dependência explícita, sem converter o destino.
A API existente agrega metadado incompatível, corrupção e par órfão em `DADOS_INVALIDOS`.
O planejador mantém essa incerteza (`administracaoDestino:'nao-confirmada'`), sem ler stores
por fora para adivinhar a causa nem alterar a API/regras de administração.

Para cada sessão presente, o planejador usa uma coleção **privada e inerte** de LAB.2B.3
somente para derivar a chave com identidade atual e pacote/digest validados. Seu `vigente`
sempre é falso e sua autorização recusa IO. Não chama `carregar`/`salvar`, não acessa cache de
outra sessão, não usa leitura tolerante do legado e não divulga o canal/chave. A leitura nativa
exata de localStorage preserva a diferença entre `null` (chave ausente), JSON `null`, texto
vazio, JSON inválido e falha de acesso. A coleção própria é encerrada ao sair; nenhum handle,
coordenador ou lock de outro fluxo é encerrado.

Progresso é classificado como `ausente-no-storage`, `logicamente-identico`, `divergente`,
`corrompido`, `indisponivel`, `inconclusivo` ou `alterado-durante-planejamento`. O parser
estrito existente e o contexto de snapshot LAB.2C.3/LAB.2C.4 fazem a validação; não há corretor
novo nem reparação silenciosa. Pontuação histórica após edição continua válida. A prévia
distingue igualdade lógica, igualdade textual com a representação do backup e estabilidade
da base entre duas leituras exatas. A última releitura de progresso é síncrona após todas as
esperas; mudança detectada invalida o candidato idempotente. Apenas estado validado e
logicamente igual é candidato idempotente, nunca autorização de sobrescrever uma divergência.
Corpos maiores que o transporte atual de 256 KiB também geram bloqueio/dependência, mesmo que
o snapshot seja válido para captura. Unicode isolado conservado pelo motor é `inconclusivo`
no perfil textual estrito, nunca ausência nem reparação; o valor permanece intacto.

Web Locks são observados por `query()` com prazo de 3 s, no início/fim, somente na família LAB
e no destino/identidade pertinente. Lock/pedido em uso, capacidade indisponível, nome LAB não
interpretável ou informação inconclusiva bloqueiam. Não se solicita, enfileira ou solta lock.
O host pode fornecer até 40 handles LAB; a memória é consultada exclusivamente pelo acesso
autenticado do motor, que não executa métodos de um objeto forjado. Sessão ativa, gravação
pendente e memória não durável acrescentam bloqueios. Coordenadores/callbacks arbitrários não
são aceitos como observadores, pois não há API pública de autenticação de observação apenas
por leitura. Fluxo em preparação sem handle e memória de outras abas não são comprováveis:
`MEMORIA_NAO_INSPECIONADA` mantém a entrada bloqueada/indeterminada. Locks livres observados
ou listas vazias de handles não provam ausência global de progresso em memória.

Efeito técnico do repositório aprovado: `abrirRepositorio()` pode inicializar o schema v1
vazio por `onupgradeneeded` na cópia identificada. A prévia sinaliza
`aberturaPodeCriarSchemaVazio` para preparação não vazia; não afirma que ocorreu nem autoriza
mutação de dados escolares. Plano vazio não abre repositório. Backup inválido é recusado antes
de consultar identidade/banco. Não há banco alternativo, migração, remoção ou cadastro de
pacotes; conexões abertas pelo próprio planejador são fechadas. Os testes de instalação vazia
bloqueiam `add`/`put`/`delete`/`clear` e demonstram zero linhas nas três stores.

Para o journal futuro continuam necessários: associação explícita à cópia de destino, plano
privado novo com revalidação integral sob locks adquiridos em ordem determinística, drenagem
dos fluxos legítimos, comparação das bases reais novamente e contrato entre transação IDB e
localStorage com interrupção/reconciliação. Nenhuma dessas operações de aplicação foi
antecipada. O diagnóstico antigo não deve ser usado como base CAS nem prova de segurança.

Testes novos: 35/35 Chromium em `tests/validacao/lab-restauracao.unit.cjs` aprovados; conjunto
LAB com regressões anteriores 326/326 aprovado. Build/formato/lint/diff aprovados. Bundle com
SHA-256 inalterado `bea941ee6f3786b7fbf226a84795e63b67a52c0e9509c76fe9fdf44661c6d74b`.
Somente módulo isolado não importado e testes/docs novos, sem mudança compartilhada,
normalização/pontuação, persistência existente ou aplicação de restauração. Global integral
aprovada em 05/11/2026: 993/993 Node (130,1 segundos) e 638/638 Playwright (45,8 minutos),
`npm test` com saída 0. Relatório `status=passed`, `complete=true`, 638 casos descobertos,
esperados, executados e aprovados, 638 tentativas, sem falhas/retries/skips/flakies/omissões,
interrupções ou timeouts. Fontes/artefatos não mudaram durante a execução; depois dela, apenas
este resultado documental. Log exclusivo `tmp/lab2c5a-global-20261105-192552/npm-test.log`
e relatório `tmp/validacao/2026-11-05T22-28-47-505Z-fbddafdb-54f1-4092-a14a-d45f981c8faa/run.json`.
Antes da global, diretórios fixos preservados sem sobrescrita em
`tmp/lab2c5a-global-20261105-192552/evidencias-anteriores/`: `test-results` (180 arquivos,
32.101.350 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao` (10 arquivos,
2.552.148 bytes), antes em `tmp/validacao`. Contagens/bytes conferidos antes/depois no manifesto
`preservacao.json` da rodada. O relatório LAB.2C.4 anteriormente em
`tmp/validacao/2026-11-05T20-27-50-535Z-4117cc37-f376-4ca5-9bf8-2f2a11d3569d/run.json`
agora está em `evidencias-anteriores/validacao/` dessa rodada. Logs, perfis sintéticos,
arquivos históricos `tmp/lab2c4-global-*`/anteriores e nove vínculos preservados.
Após a global, contagens/bytes arquivados foram reconferidos; os novos 29 PNGs permanecem em
`output/` e os nove vínculos estão intactos. Gatilhos de global permanecem obrigatórios para
futura integração/escrita/journal. LAB.2C.5A concluída; nenhuma próxima etapa iniciada.

### Journal: contrato e detecção implementados LAB.2C.5B

`js/lab-journal.js` implementa o contrato verificável, leitura persistente e bloqueios de
pendências, usando somente a store `operacoes` já existente no banco LAB v1 da cópia atual.
**Criação e transições operacionais continuam bloqueadas.** Não existe ainda capacidade
confiável de associação explícita/consentimento e exclusividade para restauração. Segue-se
a exceção expressa do pedido LAB.2C.5B: persistência é exercitada em fixtures sintéticas,
sem inventar autorização provisória, flag de teste em produção ou promover token LAB.2C.5A.
Nenhuma função de produção deste incremento escreve journal, pacote, administração ou progresso.

| API | Contrato efetivo |
| --- | --- |
| `LabJournal.abrirJournal()` | Confirma destino e abre conexão pelo repositório aprovado; retorna `{ok,journal}` ou falha com bloqueio global LAB |
| `journal.inspecionarPendencias()` | Lê/valida registros existentes; retorna resumos, identidades bloqueadas, conflitos, alcance global se necessário e `criacaoOperacionalDisponivel:false` |
| `LabJournal.inspecionarPendencias()` | Atalho de leitura que abre/fecha apenas sua própria conexão |
| `journal.inspecionarRegistro(textoOuBytes)` | Analisa um registro contra a cópia atual e pacotes/snapshots existentes; não persiste e distingue análise de presença observada em IDB |
| `journal.avaliarTransicao(antes,depois)` | Verifica coerência/monotonicidade e repetição; sempre `transicaoOperacionalDisponivel:false`, sem atualizar registro |
| `journal.fechar()` | Revoga somente o handle de leitura; callbacks obsoletos não retornam inspeção vigente nem atualizam registros |
| `LabJournal.prepararIntencao(backupOriginal)` | Revalida backup pelo LAB.2C.4 e recusa com `AUTORIZACAO_OPERACIONAL_INDISPONIVEL`, `registrosPersistidos:0`; token antigo, objeto de lock e flags não concedem autorização |

Registro fechado `lab-journal-v1`, `versao:1`: `id` UUID v4, `destino:{copyId,origem}`,
`estado`, `revisao`, `atividades` e `marcadores`. Geração operacional do UUID, associação
e gravação do registro pertencem ao futuro contrato interno confiável; hoje IDs novos são
gerados apenas pelo helper de fixtures com `crypto.randomUUID()`. Não há data/hora como prova,
credencial humana, expiração ou exclusão automática. Conteúdo editável não autentica autoria,
desempenho ou quem autorizou qualquer operação.

Cada atividade contém perfil, matéria, ID, versão e digest completos. `conteudo` declara
`criar` (pacote canônico uma única vez e baseDigest nulo) ou `preservar` (referência ao pacote
existente por digest, sem duplicá-lo); etapa `nao-iniciada` e resultado `nao-comprovado`.
Sessões fechadas `principal`/`responsavel`, opcionais e explicitamente incluídas, contêm intenção
de criar/preservar, base `{existe,hashTexto}`, snapshot-alvo único e os mesmos marcadores
de não aplicação. Criação exige base ausente/hash nulo; preservação exige referência SHA-256
textual válida. Hash declarado não é comprovação da base atual: não se reconcilia localStorage
neste incremento. Não se copia o backup original inteiro nem registros alheios à intenção.

Pacotes/digests/canonicalização são revalidados por LAB.2A; referências de preservação consultam
o repositório atual. A análise reconstrói apenas em memória a seleção de pacotes/sessões e delega
ao LAB.2C.4/LAB.2C.3 toda coerência do progresso, preservando pontos históricos após edição.
Nenhum corretor foi duplicado. Metadados divergentes, snapshots incoerentes, ID repetido,
campos extras ou alvo diferente invalidam o registro. Caminhos, banco/store/chave livres,
autorizações e gabaritos não são aceitos como parâmetros administrativos ou diagnósticos.

Estados v1: `intencao-registrada`/revisão 0, `pendente`/1, `reconciliacao-necessaria`/2 e
`bloqueada`/3. Avaliação permite repetição idêntica e avanço monotônico sem alterar destino,
atividades ou dados imutáveis; regressão e mudança de payload são incoerentes. A avaliação
não é persistência de transição. Marcadores são fechados em intenção `registrada`, aplicação
`nao-iniciada`, efeitos `nao-comprovados`; conclusão/cancelamento e efeitos comprovados não são
suportados aqui. Detectar pendência não modifica seu estado para concluir, cancelar ou recuperar.

O repositório ganhou **somente leituras** `listarOperacoesJournal()` e
`lerOperacaoJournal(referencia)`. Enumeram no máximo 32 chaves por cursor e retornam referências
opacas privadas do handle, sem aceitar ID arbitrário ou referência de outro handle. Cada valor
é lido em transação readonly separada e validado antes de ler o seguinte; isso limita materialização
acumulada. A transação existente foi reutilizada com stores fechadas pelos chamadores internos,
sem API para nome livre, schema novo ou banco alternativo. Confirmação de leitura ocorre em
`oncomplete`; identidade é reconfirmada nas operações. O custo nativo de clonar um único valor
IDB adulterado não pode ser prevenido pelo schema v1; ele é recusado após a leitura limitada.

Limites: 32 operações inspecionadas, 20 atividades por registro, 8 MiB UTF-8 por registro,
16 MiB agregados por inspeção, profundidade 16 e 200000 tokens pelo parser já aprovado.
A cópia declarativa anterior à serialização limita nós a 100000, arrays a 10000 posições e
strings nativas a 256 KiB. Pacotes mantêm 256 KiB e snapshots aqui ficam limitados ao transporte
atual de 256 KiB; respostas seguem LAB.2C.3. Excesso de registros/dados gera bloqueio global LAB,
sem interpretar parte inspecionada como inventário completo. Objetos especiais, acessores,
propriedades perigosas, estrutura incompleta e valores incompatíveis são recusados sem dumps.

A inspeção distingue pendência válida, operação declarada bloqueada, registro incompleto/
corrompido, versão/estado futuro, destino divergente, etapa incoerente e consulta impossível.
Pendências conhecidas bloqueiam suas atividades; se não for possível confirmar todo o alcance,
bloqueia conservadoramente o LAB inteiro. Conflitos entre operações com a mesma identidade são
informados, sem merge. Revisões oficiais nunca entram nesses bloqueios. Presença observada no
banco não comprova autorização ou efeitos; aba ausente/lock liberado não equivale a conclusão.

LAB.2C.5A agora consulta o journal quando carregado e inclui bloqueios específicos por atividade
ou globais. Falha de leitura/módulo ausente é inconclusiva e bloqueada; identidade invalidada
pelo journal recusa o plano. A observação é pontual: aplicação futura deve reexaminar pendências,
destino e bases sob exclusividade. Nenhum dado de progresso é lido ou escrito pelo detector de
journal; ele valida apenas os snapshots declarados e referências de conteúdo pertinentes.

Nos testes, um helper separado escreve **apenas fixtures** por `add` na store `operacoes` e
resolve sucesso somente em `transaction.oncomplete`. Não é API distribuída nem autorização de
produção. Quota/abort são injeções controladas nessa persistência sintética, não evidência de um
fluxo operacional autorizado inexistente. Interrupção real de aba com transação mantida ativa
abortou sem registro parcial; após commit, fechamento de aba/contexto e reinício completo do
Chromium com perfil sintético preservado mantiveram a pendência, sem recuperação automática.

LAB.2C.5C ainda precisa implementar emissão de autorização interna restrita à operação e destino,
associação explícita, comparação nova de bases, geração interna do ID e transação de intenção
antes de efeitos escolares. Precisará adquirir Web Locks nativos em ordem determinística das
atividades, sem objeto forjado, steal, mutex localStorage ou espera indefinida; confirmar posse/
identidade antes de transições, fazer CAS do estado imutável e revogar callbacks antes de soltar
locks. A ordenação das atividades já é parte do contrato, mas nenhuma aquisição/gravação foi
antecipada. Web Locks, IndexedDB, HTTP e localStorage não formam transação global atômica.
Não estão implementados escrita operacional de journal, aplicação, rollback, reconciliação,
conclusão/cancelamento persistentes, limpeza ou interface.

Validação: 25/25 testes Chromium novos e 351/351 no conjunto LAB aprovados. Build/formato/
lint/diff aprovados; bundle inalterado. Global integral aprovada em 05/11/2026: 1018/1018 Node
(126,7 segundos) e 638/638 Playwright (45,5 minutos), `npm test` com saída 0.
Relatório `status=passed`, `complete=true`, 638 descobertos/esperados/executados/aprovados e
638 tentativas, sem falhas/retries/skips/flakies/omissões/interrupções/timeouts. Fontes/artefatos
não mudaram durante a execução; depois dela, apenas este resultado documental. Log exclusivo
`tmp/lab2c5b-global-20261105-204511/npm-test.log` e relatório
`tmp/validacao/2026-11-05T23-47-50-151Z-203a5747-6316-4b7a-bbaf-8f5fb934f76c/run.json`.
Antes da global, diretórios fixos preservados sem sobrescrita em
`tmp/lab2c5b-global-20261105-204511/evidencias-anteriores/`: `test-results` (180 arquivos,
32.101.811 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao` (10 arquivos,
2.553.880 bytes), antes em `tmp/validacao`. Contagens/bytes conferidos antes/depois no manifesto
`preservacao.json` da rodada. O relatório LAB.2C.5A anteriormente em
`tmp/validacao/2026-11-05T22-28-47-505Z-fbddafdb-54f1-4092-a14a-d45f981c8faa/run.json`
agora está em `evidencias-anteriores/validacao/` dessa rodada. Logs, perfis sintéticos,
arquivos históricos `tmp/lab2c5a-global-*`/anteriores e nove vínculos preservados.
Após a global, contagens/bytes arquivados foram reconferidos; novos 29 PNGs em `output/` e nove
vínculos intactos. LAB.2C.5B encerrada no recorte expressamente permitido de contrato/detecção
e persistência sintética, com criação operacional bloqueada. LAB.2C.5C não iniciada.

### Autorização controlada e journal operacional — LAB.2C.5C.1

Este incremento sucede o bloqueio operacional documentado no histórico LAB.2C.5B acima.
Somente `operacoes` recebe novas gravações. O Laboratório continua sem importação no aplicativo,
interface, cartões ou navegação; chamar infraestrutura JavaScript não autentica um responsável.
O harness simula a ação explícita. A interface futura precisa mostrar destino/atividade/efeito
e colher confirmação real antes de disponibilizar este fluxo. Não há proteção alegada contra
scripts maliciosos da mesma origem, mudança de primitivas nativas ou abas com versões antigas
que não participem do protocolo atual; uma futura disponibilização exige contextos atualizados.

| API | Contrato operacional |
| --- | --- |
| `LabJournal.solicitarConfirmacao(backupOriginal)` | Valida texto/Uint8Array originais, reserva exclusividade real e recompõe a comparação; retorna `{ok,solicitacao}` somente se elegível |
| `solicitacao.consultar()` | Prévia copiada: destino, identidade completa, criar/preservar conteúdo/sessões, efeito `registrar-intencao-sem-restaurar`; nenhum snapshot, resposta, gabarito ou chave de progresso |
| `solicitacao.confirmar()` | Ação explícita sem argumentos; emite `{ok,confirmacao}` com referência opaca específica e de uso único |
| `LabJournal.prepararIntencao(backupOriginal,confirmacao)` | Consome a confirmação antes do primeiro await, repete validação/comparação e persiste somente a intenção; sucesso `{ok,operacao,estado:'intencao-registrada',intencaoRegistrada:true,restauracaoAplicada:false}` |
| `solicitacao.cancelar()` | Revoga token, aborta transação pendente, aguarda seu término e libera recursos próprios; não exclui intenção já comprometida |

Sem confirmação autêntica, a chamada de um argumento preserva a recusa anterior. `true`, plano
5A, objeto de lock, registro pronto, ID livre ou confirmação pública passada ao repositório não
concedem escrita. O repositório recebe uma segunda referência privada, transitória e nunca
devolvida ao chamador; o bridge interno a consome sob autorização do coordenador. Não há flag
de teste, bypass de validação ou API de escrita bruta. Helpers internos de comparação continuam
somente leitura e não promovem o plano 5A a permissão; a enumeração pública do planejador permanece.

A confirmação vincula os bytes UTF-8 válidos/texto exato (sem BOM ou normalização lexical),
copyId/origem atuais, perfil/matéria/ID/versão/digest, seleção exata das sessões, bases brutas do
conteúdo/administração e hashes dos textos de progresso observados. Alterar apenas a formatação
do backup ou da base de progresso também exige nova confirmação. Entradas mutáveis são capturadas
sincronamente antes de awaits. Repetição, erro, cancelamento, perda de posse, identidade alterada,
pagehide ou prazo total de 30 segundos revogam o fluxo; callbacks tardios não restauram a permissão.

Admite exatamente uma atividade ativa, com zero a duas sessões explicitamente incluídas. Conteúdo
ausente é elegível; conteúdo idêntico exige alguma sessão ausente. Sessão existente logicamente
igual declara preservação, sem regravação. Digest/progresso divergente, progresso corrompido ou
inconclusivo, administração arquivada, transporte acima de 256 KiB, múltiplas atividades, journal
conflitante/incompatível, limites excedidos e ausência de identidade/Web Locks bloqueiam integralmente.
Pacotes, snapshots e pontos históricos usam os validadores LAB já existentes, sem outro corretor.

`coordenador.adquirirIntencao(pacoteJSON)` é uma finalidade restrita, persistente: usa o Web Lock
exclusivo real da atividade pelo nome existente, com `ifAvailable`, sem fila indefinida, steal
ou mutex localStorage. Não exige cadastrar o pacote ausente e não fornece canal de progresso ou
conexão para executar no motor. Uma conexão autenticada por WeakMap reconfirma identidade e posse
imediatamente antes da transação; o callback assíncrono mantém a autorização até ela terminar.
Locks de outro digest para o mesmo perfil/ID/versão também impedem preparação.

O motor ganhou uma consulta privada de disponibilidade sem leitura de respostas e uma reserva
de memória emitida pelo coordenador. Em persistente, uma sondagem compartilhada do Web Lock
`revisoesEscolares.lab.memoria.v1.` impede abrir durante intenção; depois, o **mesmo lock da
atividade** protege o estado enquanto o motor o retém. Encerrar/suspender coordenador revoga
escrita imediatamente, mas não libera esse lock enquanto houver memória do motor, inclusive
oculta, pendente ou não durável. O encerramento controlado/durável libera a reserva; fechamento
do contexto encerra os locks nativos. Não se descarta estado para desbloquear a intenção.
Em temporário, a reserva compartilhada de memória permanece até a liberação explícita do registro
ou fechamento do contexto. Seu escopo é conservador por origem/perfil/ID/versão, sem copyId/digest,
pois a cópia pode ser desconhecida. O journal detém essa reserva em modo exclusivo além do lock
da atividade; assim outra aba temporária não consegue abrir tardiamente. Sem Web Locks o modo
temporário anterior continua utilizável, mas preparação operacional de journal é indisponível.
Revisões oficiais não adquirem reservas LAB. Nenhum inventário arbitrário de handles é aceito como prova.

Após confirmação, repetem-se a análise do original, resolução de destino, comparação sob posse,
leitura de conteúdo/administração e inspeção limitada do journal. A transação única usa escopo
readwrite nas três stores para serializar **leituras** das bases com a inclusão, mas emite apenas
`operacoes.add(registro)`. Em `pacotes`/`administracao` emite somente `get`; não há put/delete/clear.
Compara bases nativas e catálogo inteiro com as observações revalidadas; qualquer inserção,
alteração ou limite novo aborta. Confere novamente memória/progresso antes de add e em seu
onsuccess. Nenhum await ocorre dentro da transação. Não cria schema/versionamento novo.

O registro usa exatamente `lab-journal-v1`: UUID v4 interno, destino, uma atividade, digest,
conteúdo canônico único para criar ou referência para preservar, apenas snapshots selecionados,
bases criar/preservar e marcadores iniciais `nao-iniciada`/`nao-comprovado`. Estado é somente
`intencao-registrada`, revisão 0. Limites 5B permanecem; também se verifica que o novo conjunto
cabe nos 16 MiB de inspeção. Não há aplicação, transição operacional, rollback, conclusão,
reconciliação, exclusão ou limpeza. O planejador continua diagnóstico: reconhece a pendência,
bloqueia a atividade e preserva a classificação das outras; corrupção bloqueia globalmente o LAB.

Sucesso só nasce do **oncomplete nativo**, após atualizar a prova interna de commit e antes de
resolver a Promise. `add.onsuccess` não é commit. Quota/abort/timeout (3 segundos) nunca declaram
sucesso. Cancelamento durante transação invalida callbacks e tenta abortar antes de liberar os
locks. Na fronteira de commit, `intencaoPodeEstarRegistrada:true` orienta inspeção, sem afirmar
ausência nem apagar registros. Antes do commit, interrupção real da aba aborta sem intenção
parcial; depois, fechamento de aba/contexto e reinício completo do Chromium mantêm pendência
detectável. Liberação de lock não implica conclusão. Web Locks/IDB/HTTP/localStorage não formam
uma transação global: são garantias cooperativas pontuais, e futuras aplicações devem reconferir
destino, bases, memória e estado do journal antes de **qualquer** efeito escolar.

Arquivos deste incremento: `lab-journal.js`, `lab-repositorio.js`, `lab-coordenador.js`,
`lab-restauracao.js`, `gramatica-questionarios.js`, `lab-validador.js` (captura do texto original
pelo parser já aprovado); novo `tests/validacao/lab-journal-operacional.unit.cjs`; esta especificação
e inventário. Não se alteram testes anteriores, app.js/app.entry.js, HTML/CSS, launcher, registro
oficial, armazenamento oficial ou ORG. Alterações acumuladas anteriores permanecem sem commits.

Validação direcionada: 41/41 novos testes Chromium e 392/392 no conjunto LAB aprovados. Inclui
concorrência real, memória retida e temporária entre abas, repetição/expiração/cancelamento,
destino/bytes/bases alterados, CAS nativo de conteúdo/administração/catalogo, quota/abort/timeout,
storage bloqueado, snapshot grande, interrupção real durante transação e reinício de processo
após commit. Spies sobre todas as primitivas mutadoras de IDB/localStorage no caminho positivo
observam **somente `operacoes:add`**; conteúdo/administração/progresso oficial são comparados
antes/depois. Injeções complementam os cenários nativos, sem substituir persistência real.
Build, formato, lint e diff aprovados. Global integral aprovada na reexecução, encerrada em
06/11/2026: 1059/1059 Node (136,5 segundos), 638/638 Playwright (45,9 minutos) e saída 0.
Relatório `status=passed`, `complete=true`, 638 descobertos/esperados/executados/aprovados,
638 tentativas e zero falhas/retries/flakies/skips/omissões/interrupções/timeouts na reexecução.
`sourcesChangedDuringRun=false` e `artifactsChangedDuringRun=false`; depois, somente a
documentação de resultados foi atualizada. Relatório completo preservado em
`tmp/validacao/2026-11-06T02-32-53-190Z-a8e45f31-eb88-431f-a15d-b141a7fcab9c/run.json`.
Primeira tentativa global terminou com saída 1: 1058/1059 Node passaram em 126,8 segundos;
Playwright não chegou a iniciar. Falhou `Chromium: escrita pendente não bloqueia construção nem
substitui a captura já obtida`, em `lab-backup-browser.unit.cjs`, ao observar `Sol` em vez de
`Lua` na sessão viva. O caso levou 3,39 segundos e mantém deliberadamente a identidade pendente,
cujo timeout de produção é 3 segundos. Isso é compatível com expiração sob carga, não comprova
causa. Diagnóstico posterior executou o arquivo completo inalterado: 16/16 aprovados, caso em
0,24 segundo. Nenhum código, teste, limite, cobertura ou política foi alterado após a falha.
Log da tentativa permanece no caminho abaixo; a nova global integral usou o mesmo `npm test`.
Reexecução aprovada em `tmp/lab2c5c1-global-20261105-232959/npm-test.log`.
Preservados previamente os oito arquivos/2.226 bytes gerados em `tmp/validacao`,
com contagens/bytes conferidos em `evidencias-anteriores/validacao/` dessa nova rodada e manifesto
`preservacao.json`. `output` e `test-results` não foram recriados pela tentativa que parou no Node.
Nove junctions e hash do bundle reconferidos sem mudanças.
Primeira rodada: `tmp/lab2c5c1-global-20261105-223344/npm-test.log`. Antes da global, os
diretórios fixos foram preservados sem sobrescrita em `evidencias-anteriores/` dessa rodada:
`test-results` (180 arquivos, 32.101.726 bytes), `output` (29 PNGs, 2.893.454 bytes) e
`validacao` (10 arquivos, 2.555.584 bytes), antes em `tmp/validacao`. Caminhos absolutos foram
conferidos dentro da worktree e sem reparse points; contagens/bytes coincidem antes/depois no
manifesto `preservacao.json`. Nove junctions preservadas. O relatório LAB.2C.5B antes em
`tmp/validacao/2026-11-05T23-47-50-151Z-203a5747-6316-4b7a-bbaf-8f5fb934f76c/run.json`
agora está em `evidencias-anteriores/validacao/` da rodada LAB.2C.5C.1. Perfis sintéticos,
logs e arquivos históricos permanecem locais, sem limpeza. Bundle regenerado somente pelo
build oficial, SHA-256 `D8D4D411E29773856417361E897BA103F4F6831E9EA49A2A0D06B389D47FC369`.
Após a global, contagens/bytes dos dois arquivos de preservação foram reconferidos sem
divergências; 29 novos PNGs em `output/`, nove junctions e todos os arquivos históricos
permanecem preservados. Branch `codex/lab-1-contrato-arquitetura`, HEAD `8024895`, alterações
acumuladas ainda sem commits. LAB.2C.5C.1 concluída neste escopo; nenhuma etapa seguinte iniciada.

LAB.2C.5C.2 exigirá pedido separado, protocolo de aplicação/recuperação sob exclusividade e
comparação das bases atuais, com durabilidade observável por efeito e reconciliação explícita.
A intenção persistida não autoriza essa próxima etapa. Interface real e confirmação humana,
suporte multiatividade e administração arquivada continuam bloqueados. Não iniciar aplicação
de conteúdo/progresso, piloto ou publicação como consequência deste incremento.

### Aplicação controlada sem sobrescrita — LAB.2C.5C.2

Este incremento sucede a preparação de intenção 5C.1 acima. Continua isolado do aplicativo:
sem interface, importação visual, cartões, roteamento, launcher ou revisão escolar alterada.
Uma chamada JavaScript não autentica humano. O harness simula a ação explícita; uma interface
futura precisará colher confirmação real. Não há alegação de proteção contra scripts maliciosos
da mesma origem, primitivas adulteradas ou contextos antigos fora do protocolo cooperativo.

| API | Contrato |
| --- | --- |
| `LabJournal.solicitarAplicacao(backupOriginal,operacao)` | Seleciona UUID previamente persistido, revalida arquivo, payload do journal, destino, exclusividade e bases; retorna `{ok,solicitacao}` somente para intenção inicial íntegra e uma atividade ativa |
| `solicitacao.consultar()` | Prévia copiada de operação/destino/atividade e criar/preservar sessões, efeito `aplicar-somente-ausentes`; sem respostas/gabaritos/chaves |
| `solicitacao.confirmarAplicacao()` | Ação separada da confirmação 5C.1, sem argumentos; emite referência opaca específica e de uso único |
| `LabJournal.aplicarIntencao(backupOriginal,confirmacao)` | Consome a referência antes de await, recompõe as comparações e executa somente o que continua ausente; retorna sucesso apenas após marcador terminal persistido e relido |
| `solicitacao.cancelar()` | Revoga a autorização e aborta/aguarda a transação em curso antes de liberar recursos próprios; efeitos já aceitos permanecem, com inspeção necessária |

O ID seleciona uma intenção, não concede permissão. Booleano, plano, confirmação 5C.1, objeto
copiado ou chave arbitrária não habilitam aplicação. A confirmação nova vincula texto/bytes
exatos selecionados, operação/payload persistido, destino, perfil/matéria/ID/versão/digest,
sessões e bases atuais. O journal 5C.1 não guarda o texto original completo do arquivo:
compara-se seu payload validado ao backup revalidado, e os bytes atuais ficam vinculados à nova
confirmação em memória. Alterações após confirmação, erro, cancelamento, pagehide, prazo de
30 segundos ou perda de posse/identidade impedem escritas posteriores. Não há capacidade livre
transferível para outra atividade, sessão, operação ou cópia.

Admite uma atividade, administração ativa, pacote ausente ou idêntico, zero a duas sessões
explicitamente incluídas e snapshot ausente ou logicamente igual. Existentes iguais são
operações nulas, com preservação **byte a byte**, inclusive formatação do progresso. Intenção
anterior de preservar cuja base desapareceu é recusada. Uma intenção de criar pode encontrar
o dado já idêntico antes da confirmação de aplicação e preservá-lo sem reivindicar criação.
Depois da confirmação, até uma inserção igual inesperada invalida a base e bloqueia a escrita.
Digest divergente, administração inconsistente/arquivada/descartada, progresso inválido ou
divergente, transporte acima de 256 KiB, multiatividade e journal incompatível/pendente conflitante
bloqueiam integralmente. Não há merge, migração, normalização de dados existentes ou overwrite.

A reserva exclusiva da atividade e a proteção de memória 5C.1 são mantidas até encerrar a
aplicação. Reutilizam-se os validadores de pacote/backup/snapshot do motor e a derivação de chave
LAB do transporte existente. O planejador 5A permanece somente leitura: um helper não enumerável
aceita referência privada do fluxo vivo para desconsiderar **somente sua própria pendência**;
nenhum plano antigo ou objeto do chamador pode dispensar bloqueios. O catálogo inteiro e o
registro selecionado são revalidados e comparados novamente em cada transação de efeito.

Sequência real, sem presumir atomicidade entre IDB e localStorage:

1. Confirmar novamente arquivo, destino, journal, conteúdo, memória e sessões sob Web Locks.
2. Persistir `escrita-solicitada` para o pacote e aguardar oncomplete antes de qualquer add.
3. Criar pacote e administração por dois **add na mesma transação IDB**, conferindo que ambos
   continuam ausentes e que journal/catálogo/bases permanecem exatos. Não usar cadastrar como bypass.
4. Consultar pacote/administração em transação independente e conferir conteúdo, digest,
   metadados e identidade. Persistir `escrita-observada`, depois `resultado-confirmado`.
5. Para cada sessão selecionada, principal antes de responsável, persistir sua solicitação.
   Executar a capacidade privada de restauração do transporte: validar snapshot, derivar chave,
   reler base e chamar setItem somente se continuar nula. Conferir bytes após a chamada.
6. Fazer leitura independente e validação coerente do snapshot; persistir observação e resultado
   confirmado antes de avançar. Sessões existentes iguais fazem somente leitura e confirmação
   de preservação; não são regravadas nem fabricadas sessões omitidas.
7. Revalidar todas as bases, persistir `aplicacao-concluida`, reler esse marcador e comparar
   novamente o destino antes de devolver `aplicacaoConcluida:true`.

As transações internas usam escopo fechado nas três stores para serializar as bases e o journal.
CAS compara os registros nativos e catálogo inteiro com observações revalidadas; qualquer mudança
intercorrente aborta. `operacoes.put` altera somente a intenção selecionada após validação de
transição; pacote/administração recebem exclusivamente add, nunca put/delete/clear. Cada passo
exige oncomplete nativo; onsuccess de request não autoriza avançar. A primeira causa de falha
de transação é preservada: erros AbortError posteriores não substituem timeout/quota/cancelamento.

O snapshot é escrito em uma janela síncrona interna, dentro da transação que acabou de conferir
journal/pacote/administração e ainda mantém seus locks IDB, além dos Web Locks. A referência
privada é consumida nessa janela; o método de transporte não aceita caminho ou chave fornecida
pelo chamador, não usa `handle.persistir()` e não altera cache/estado de execução. GetItem e
setItem ocorrem na mesma pilha JS, sem await entre comparação e escrita; fluxos cooperativos de
outras abas são excluídos pelo lock. **Isso não torna localStorage transacional nem fornece CAS
contra escritores que desrespeitem o protocolo.** Se o setItem ocorrer e a transação/leituras ou
journal posteriores falharem, o snapshot pode permanecer: não se remove nem repete a escrita.
Aceitação pelo navegador e leitura conferida não comprovam retenção permanente.

Extensão estrita do mesmo `lab-journal-v1`, versão/store inalteradas, sem payload paralelo:

| Marcador por conteúdo/sessão | Significado |
| --- | --- |
| `nao-iniciada` / `nao-comprovado` | Sem escrita solicitada neste passo |
| `escrita-solicitada` / `nao-comprovado` | Intenção da etapa persistida; escrita escolar pode ainda não existir ou ter ocorrido sem confirmação posterior |
| `escrita-observada` / `criacao-observada` | Leitura independente verificou a criação e o marcador foi persistido |
| `resultado-confirmado` / `criacao-observada` | Confirmação persistida do resultado verificado; passo concluído |
| `resultado-confirmado` / `base-preservada` | Leitura confirmou igualdade; nenhuma escrita escolar foi emitida |

Somente um prefixo de passos pode estar confirmado; há no máximo um passo solicitado/observado
e os seguintes continuam iniciais. Transições preservam UUID, destino, conteúdo, digest, bases
originais e snapshots; CAS impede pular fases, regredir ou mudar payload. Durante aplicação,
estado `pendente`, revisão 1, marcadores `registrada`/`em-andamento`/`nao-comprovados`.
Terminal exige todos os passos confirmados: estado `aplicacao-concluida`, revisão 4,
marcadores `registrada`/`concluida`/`verificados-por-leitura`. Estados anteriores e registros
legados continuam analisáveis no contrato anterior; somente intenção inicial íntegra é
aplicável. Estado parcial não pode ser reaplicado ou retomado por esta API.

O detector informa alvo de cada etapa, escrita incerta e confirmação persistida, sem snapshots.
Pendência conhecida bloqueia a atividade; corrupção/alcance desconhecido bloqueia o LAB.
Coordenador impede adquirir/executar pacote persistente pendente, inclusive se o módulo journal
estiver ausente e houver registros que não possam ser inspecionados. Revisões oficiais não
passam por esse bloqueio. Terminal íntegro fica retido e deixa de bloquear por pendência;
não se apaga registro, pacote, progresso ou evidência. O limite conservador de 32 registros
continua incluindo concluídos, até futura política administrativa própria.

Interrupção após add aceito mas antes de commit aborta pacote e administração juntos e conserva
solicitação do journal. Após commit de conteúdo, falhas posteriores mantêm pacote íntegro e
etapas pendentes. Interrupção real após setItem preserva o snapshot mesmo com abort da janela
IDB; o journal continua `escrita-solicitada`, sem falsa conclusão. Reinício completo do Chromium
reconhece essas pendências sem recuperação automática. Repetição de confirmação ou operação
parcial/concluída é recusada, sem duplicar conteúdo/pontos. Erro ou cancelamento na fronteira do
terminal exige inspeção: nunca se anuncia sucesso sem comprovar seu commit e leitura posterior.

Arquivos alterados neste incremento: `lab-journal.js`, `lab-restauracao.js`, `lab-repositorio.js`,
`lab-progresso.js`, `lab-coordenador.js`; novo `tests/validacao/lab-aplicacao.unit.cjs`; esta
especificação e inventário. Motor/corretor, armazenamento oficial, app.js/app.entry.js, HTML/CSS,
launcher, revisões, políticas e ORG permanecem sem alterações deste incremento. Dois testes
anteriores do journal receberam sincronização nativa de fechamento, descrita abaixo; nenhuma
assertiva ou caso foi removido e nenhum prazo de produção foi ampliado.
Diagnóstico da primeira global 5C.1 foi consultado pontualmente na seção anterior: hipótese de
timeout sob carga, sem causa comprovada; histórico/logs preservados, sem repetir investigação,
aumentar prazo ou modificar o teste anterior para obter aprovação.

Validação direcionada: **43/43 novos testes de aplicação e 435/435 LAB aprovados**. Build,
formato, lint e diff aprovados. Global integral aprovada em 06/11/2026: **1102/1102 Node**
(134,2 segundos), **638/638 Playwright** (45,5 minutos), `npm test` com saída 0. Testes usam
somente fixtures sintéticas e primitivas nativas Chromium; incluem todos os passos, não escrita
de iguais, pontos históricos, CAS, quota/abort/timeout, falhas silenciosas e de leitura, memória
entre abas, cancelamento/callback tardio, expiração, interrupções reais de aba, reinício de
Chromium pendente/concluído e preservação de revisão oficial ativa, DOM e chaves vizinhas.
O teste novo de timeout expôs perda do primeiro motivo de aborto no helper de transação:
AbortError posterior substituía o timeout por falha genérica. O motivo inicial agora é
preservado; naquela rodada, todos os testes anteriores passaram sem modificações e sem ampliar prazos.

Rodada global reservada em `tmp/lab2c5c2-global-20261106-005324/npm-test.log`. Diretórios fixos
anteriores preservados em `evidencias-anteriores/` dessa rodada após conferência de caminhos
absolutos dentro da worktree e ausência de reparse points: `test-results` (180 arquivos,
32.101.730 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao` (10 arquivos,
2.556.490 bytes), antes em `tmp/validacao`. Contagens/bytes antes/depois conferidos no
manifesto `preservacao.json`; nove junctions, perfis sintéticos, logs e arquivos históricos
preservados, sem limpeza. O relatório final 5C.1 antes em
`tmp/validacao/2026-11-06T02-32-53-190Z-a8e45f31-eb88-431f-a15d-b141a7fcab9c/run.json`
agora está em `evidencias-anteriores/validacao/` da rodada 5C.2. Bundle regenerado pelo build
oficial com o mesmo SHA-256 anterior: `D8D4D411E29773856417361E897BA103F4F6831E9EA49A2A0D06B389D47FC369`.

Primeira global 5C.2 encerrou com saída 1: 1100/1102 Node passaram em 134,9 segundos e
Playwright não iniciou. Falharam dois testes anteriores de `lab-journal-operacional.unit.cjs`
ao preparar intenção imediatamente após fechar a aba que mantinha memória/lock: memória órfã
persistente e sessão temporária. Foram recusas inesperadas de preparação, sem evidência de
escrita indevida. Diagnóstico executou o arquivo completo inalterado: 41/41 passaram; casos
levaram 0,32/0,31 segundo isolados contra 0,81/0,70 segundo na global. Disputa de timing na
liberação do lock era hipótese ainda não comprovada. Entre essa tentativa e a reexecução
seguinte, nenhum código, teste, cobertura, prazo ou política foi modificado. O log permanece.

Reexecução integral com o mesmo `npm test`, também encerrada com saída 1 (1100/1102 Node,
133,6 segundos, os mesmos dois casos; Playwright não iniciou), preservada em
`tmp/lab2c5c2-global-20261106-012014/npm-test.log`. Antes dela, oito arquivos/2.224 bytes
de `tmp/validacao` foram preservados com conferência de caminhos/contagens/bytes em
`evidencias-anteriores/validacao/` dessa nova rodada; manifesto `preservacao.json`.
`output` e `test-results` não foram recriados pela tentativa que parou no Node. Nove junctions
e hash do bundle reconferidos sem mudança.

Diagnóstico posterior capturou o resultado original de Page.evaluate, sem modificar APIs do
navegador: `ATIVIDADE_OCUPADA` na tentativa após fechar a aba com memória órfã. Isso demonstrou
que o lock ainda não estava disponível; a recusa do código de produção estava correta. A
[especificação Web Locks, terminação de locks](https://www.w3.org/TR/web-locks/#termination-of-locks)
enfileira a liberação no descarregamento. Page.close() não foi usado como prova suficiente
da ausência de locks. O diagnóstico está em `tmp/lab2c5c2-diagnostico-avaliacao-2.log`;
24 reproduções isoladas das duas fronteiras passaram, reforçando o caráter de sincronização.
Outra rodada instrumentada mostrou timeout de identidade em cenário anterior de snapshots,
sem servir como aprovação da suíte padrão. Todos os logs e harnesses temporários foram preservados.

Correção restrita a `tests/validacao/lab-journal-operacional.unit.cjs`: após fechar a outra aba,
os dois testes exigem query nativa com held/pending vazios antes de pedir uma nova intenção,
com deadline de 3 segundos e polling de condição, sem espera fixa. Permanecem as assertivas
de bloqueio enquanto a aba existe, retenção de memória, journal ausente, exclusividade e
sucesso posterior. Acrescenta-se comprovação da liberação, sem reduzir cobertura ou relaxar
a proteção de produção. Cópia anterior preservada em
`tmp/lab2c5c2-journal-operacional-antes-sincronizacao.cjs`. Não se alterou o teste antigo de
backup/snapshots nem a política de testes. Formato/lint/diff aprovados após a correção.

Etapa Node padrão sem instrumentação aprovada: **1102/1102**, zero falhas/skips, 133,1 segundos;
log `tmp/lab2c5c2-node-sincronizado.log`. Nova global integral aprovada em
`tmp/lab2c5c2-global-20261106-014423/npm-test.log`. Antes dela, os 32 arquivos/
8.904 bytes gerados em `tmp/validacao` foram preservados com caminhos/contagens/bytes conferidos
em `evidencias-anteriores/validacao/` dessa nova rodada e manifesto `preservacao.json`.
Contagens/bytes dos dois arquivos anteriores de preservação foram reconferidos; nove junctions
e hash do bundle inalterados.

Conferência final: relatório `status=passed`, `complete=true`, 638 descobertos/esperados/
executados/aprovados, 638 tentativas, zero falhas/retries/flakies/skips/omissões/interrupções/
timeouts na execução final. `sourcesChangedDuringRun=false` e `artifactsChangedDuringRun=false`;
depois, somente esta documentação de resultados e inventário foram atualizados. Relatório:
`tmp/validacao/2026-11-06T04-47-39-911Z-e51ae6e3-9fee-4e57-a95d-b98ec82e5e12/run.json`.
As duas globais anteriores com falhas e os diagnósticos continuam preservados; não são ocultados
pela aprovação posterior. A correção final foi de sincronização dos dois testes, sem nova
alteração de código de produção, redução de cobertura ou ampliação de prazos de produção.
Contagens/bytes dos três manifestos de preservação foram reconferidos após a global sem
divergências; 29 novos PNGs em `output/`, nove junctions, perfis e arquivos históricos intactos.
Branch `codex/lab-1-contrato-arquitetura`, HEAD original `8024895`, alterações acumuladas ainda
sem commits. LAB.2C.5C.2 concluída no perímetro de aplicação de ausentes; nenhum commit, push,
PR, merge, sincronização, limpeza, piloto ou etapa seguinte foi iniciado.

LAB.2C.5C.3 exigirá autorização separada para reconciliação explícita das etapas incertas, com
nova inspeção das bases e prova de quais efeitos realmente ocorreram. Não implementar retomada,
rollback destrutivo, recuperação automática, resolução de conflito, arquivamento/descarte,
multiatividade, download/importação visual, interface ou piloto como consequência desta etapa.

### Reconciliação conservadora de interrompidas — LAB.2C.5C.3

Reconstitui por leitura os efeitos atuais de uma operação e, com confirmação própria, pode
concluir **apenas seu journal** quando todos os efeitos necessários forem comprovados.
Pacotes, administração, snapshots, respostas, pontos e revisões oficiais nunca são gravados,
removidos ou reparados por este fluxo. Permanece isolado do aplicativo e sem interface.
Chamadas JS não autenticam responsável humano; a confirmação é simulada pelo harness. Mantém
o limite cooperativo das etapas anteriores, sem alegar autenticação contra scripts maliciosos
da mesma origem, primitivas adulteradas ou versões antigas que não participem do protocolo.

| API | Contrato |
| --- | --- |
| `LabJournal.inspecionarReconciliacao(operacao,backupOriginal?)` | Diagnóstico somente leitura; retorna `{ok,diagnostico}` com estados, classificações, impedimentos e observação pontual; sem token de escrita |
| `LabJournal.solicitarReconciliacao(backupOriginal,operacao)` | Seleção explícita, arquivo revalidado, comparação com payload, inspeção nova e aquisição real de exclusividade; retorna `{ok,solicitacao}` somente se tudo for elegível |
| `solicitacao.consultar()` | Prévia copiada do destino, atividade, passos e efeito administrativo `confirmar-journal-sem-escrita-escolar`; não retorna respostas ou chaves |
| `solicitacao.confirmarReconciliacao()` | Ação específica sem argumentos; emite confirmação opaca de uso único, independente das confirmações 5C.1/5C.2 |
| `LabJournal.reconciliarIntencao(backupOriginal,confirmacao)` | Consome a referência antes de await, refaz todas as inspeções sob posse e atualiza somente marcadores comprovados; sucesso exige terminal persistido e relido |
| `solicitacao.cancelar()` | Revoga, aborta/aguarda transação própria e libera a posse; não desfaz marcador já comprometido nem efeitos escolares |

UUID seleciona o registro, não concede permissão. Texto/bytes exatos atualmente selecionados,
UUID/payload, destino/origem, atividade/versão/digest/sessões, catálogo e bases observadas ficam
vinculados à confirmação privada. Booleano, plano antigo, objeto copiado e tokens de intenção
ou aplicação não habilitam reconciliação. Erro, cancelamento, expiração (30 segundos), pagehide,
mudança de estado/identidade/bases ou perda de posse revogam callbacks; não há replay ou retry
automático. A reserva exclusiva da atividade e a proteção de memória LAB continuam as existentes,
com `ifAvailable`, sem steal, mutex localStorage ou fila indefinida. Atividade/memória ativa em
outra aba impede autorização. Os testes aguardam a liberação **nativa** após fechamento.

A inspeção usa abertura **somente de banco existente**: metadados `indexedDB.databases()`
confirmam a existência da cópia e `open` sem versão não solicita upgrade. Qualquer
onupgradeneeded é abortado, sem criar stores ou persistir schema. Se o banco estiver ausente,
inacessível, incompatível ou a consulta expirar, retorna diagnóstico inconclusivo e não o cria.
Reutiliza o limite de 3 segundos do repositório; retorno tardio não abre banco após timeout.
O coordenador tem preparação equivalente de banco existente para este fluxo. Schema, versão
do banco e stores anteriores não foram alterados.

O repositório lê pacote/administração em uma única transação readonly e reutiliza `validarPar`.
O journal reutiliza seu parser fechado, detector/validador de registros, backup e contexto puro
de snapshot do motor. O planejador expõe internamente a comparação de progresso já usada no
5A, sem duplicar corretor. Uma coleção inerte do transporte deriva somente as chaves das
sessões selecionadas; não carrega/salva cache de execução. Conteúdo/administração, catálogo e
textos são relidos, e identidade reconfirmada; mudanças durante a inspeção impedem autorização.
Limites anteriores de registros, bytes, profundidade, estrutura e transporte permanecem.

Se o backup estiver ausente, um journal com payload suficiente permite diagnóstico, nunca
confirmação terminal. Se uma referência de conteúdo preservado perder sua base, pode faltar
contexto para validar o payload sem o original; informa ausência de comprovação. Com backup
revalidado, o payload de referência pode ser analisado independentemente da base escolar;
isso **não** comprova o destino. A leitura real do par continua separada e sua ausência,
divergência ou corrupção bloqueia a operação. Não se adota copyId apresentado pelo arquivo.

| Classificação observável | Significado |
| --- | --- |
| `efeito-esperado-presente` | Dados lidos e validados satisfazem o alvo; igualdade não demonstra quem os escreveu |
| `base-anterior-preservada` | Conteúdo por digest original, ou snapshot por SHA-256 do texto da base original, com coerência atual |
| `efeito-esperado-ausente` | Ausência observada; nenhuma criação ou regravação é autorizada |
| `dado-presente-divergente` | Par válido de outro digest ou snapshot válido diferente do alvo |
| `dado-invalido-ou-corrompido` | Par órfão, conteúdo/metadados inconsistentes ou snapshot inválido |
| `leitura-inconclusiva` | Acesso impossível, representação ambígua, instabilidade ou payload não comprovado |
| Journal `incompativel` | Contrato/versão/etapas/campos inválidos; nenhuma reparação |
| `integralmente-consistente-sem-terminal` | Efeitos atuais conferidos; ainda exige avaliação de etapas, backup, exclusividade e confirmação específica |

O diagnóstico mostra último passo confirmado **no journal**, passos solicitados/observados,
presença atual e impedimentos, sem tratar marcador ausente como prova de ausência de escrita.
Presença observada não prova causalidade. `autoriaComprovadaPorIgualdade:false` é explícito;
uma declaração anterior de `criacao-observada` é histórica e não é fabricada novamente.
Administração precisa estar ativa/coerente; igualdade do pacote não comprova autoria, data de
criação ou preservação byte a byte de metadados antigos que o journal não registrou.

Para criação solicitada/observada, snapshots exigem a representação exata do transporte 5C.2
e coerência pelo motor. Igualdade lógica com representação diferente é informada, mas mantém
pendência nesse caso. Preservação previamente confirmada respeita equivalência lógica sem
regravar bytes. Uma etapa ainda não solicitada **não** vira criação confirmada apenas porque
há dados iguais. Só pode confirmar uma operação nula de preservação quando a base anterior
está comprovada. Efeito ausente/divergente, ambiguidade, corrupção, par órfão, etapa futura não
solicitada, operação conflitante ou journal desconhecido/incompatível mantêm bloqueio. Não se
retrocedem marcadores anteriores para ajustar a história aos dados atuais.

Extensão compatível e fechada de `lab-journal-v1`, sem nova store/payload ou contador:

- Durante reconciliação, estado `pendente`, revisão 1, marcador de aplicação `em-reconciliacao`.
- `escrita-solicitada` pode avançar a `escrita-observada` com resultado **`presenca-verificada`**:
  comprova o alvo lido, não criação por esta operação. Depois avança a `resultado-confirmado`.
- `escrita-observada` já persistida pode avançar a confirmação conservando seu resultado anterior.
- Passos já confirmados são imutáveis. Passo inicial de preservação comprovada pode avançar
  diretamente a `resultado-confirmado`/`base-preservada`, sem efeito escolar.
- Só com todos os passos confirmados admite terminal `aplicacao-concluida`, revisão 4,
  marcadores `registrada`/`concluida`/**`verificados-por-reconciliacao`**.

Transições preservam UUID, destino, identidades, snapshots e bases originais e só avançam um
passo coerente por vez. A avaliação pública de transição continua diagnóstica e não concede
escrita. Intenção ainda não aplicada, estados legados sem protocolo suportado e operação já
terminal não são reaplicados. Terminais são retidos; inspeção reconhece sua presença sem
regravar dados, eliminar registros ou criar outra operação.

Antes de cada put há inspeção nova sob Web Lock e reserva de memória autênticos. Uma capacidade
privada distinta da aplicação habilita `confirmarReconciliacaoJournal(referenciaInterna)`;
ela não contém tipo de comando escolar, chave livre, snapshot escritor ou cadastro. Transação
com escopo fechado nas três stores serializa **leituras** de conteúdo/administração e catálogo
com o único `operacoes.put`. CAS compara bases nativas e catálogo inteiro; mudança interposta
aborta sem substituir dados. A primeira causa de falha é preservada. Sucesso de cada marcador
depende de oncomplete nativo, seguido por nova leitura independente do journal e dos efeitos.

`aplicacaoConcluida:true` só é devolvido após todos os alvos e etapas exigidos estarem
comprovados, terminal efetivamente comprometido/relido e identidade/posse ainda válidas.
`efeitosEscolaresGravados:0`, `autoriaInferidaPorIgualdade:false` e retenção permanente não
comprovada são explícitos. Se houver erro, nunca se anuncia conclusão integral. Um put
abortado preserva o último registro confirmado; commit seguido de fechamento/cancelamento
antes da resposta pode ter persistido. Nova inspeção reconhece esse fato sem aplicar dados.
Interrupção de reconciliação exige seleção e confirmação novas, mesmo após reiniciar Chromium.

Arquivos deste incremento: `lab-journal.js`, `lab-repositorio.js`, `lab-coordenador.js`,
`lab-restauracao.js`; novo `tests/validacao/lab-reconciliacao.unit.cjs`; esta especificação e
inventário. Nenhum módulo novo de produção. Transporte/corretor, armazenamento oficial,
app.js/app.entry.js, HTML/CSS, launcher, revisões, ORG e testes anteriores não foram alterados.
Histórico 5C.2, incluindo duas globais com falhas, diagnósticos, sincronização aprovada e
resultado final, foi preservado; não se repetiu investigação histórica.

Validação direcionada: **53/53 novos testes Chromium, 488/488 LAB**, sem falhas/skips.
Inclui todos os estados/classificações acima, pontos históricos após edição, bases preservadas
byte a byte, sessões/perfis/versões/cópias independentes, capacidade não forjável, replay,
cancelamento/expiração/retorno tardio, CAS adversarial nas últimas fronteiras, quota/abort/timeout,
interrupção real antes da aquisição e durante put, commit intermediário/terminal sem confirmação
ao chamador e dois reinícios completos do Chromium. Spies de todas as primitivas mutadoras de
IDB/localStorage/schema observam **somente `operacoes:put`** na reconciliação; diagnóstico e
recusas observam zero mutações. Injeções adversariais são distinguíveis das ações de produção.
Build, formato, lint e diff aprovados; resultado global final registrado abaixo.
Primeira rodada em `tmp/lab2c5c3-global-20261106-072021/npm-test.log`. Antes da global,
diretórios fixos preservados em `evidencias-anteriores/` dessa rodada: `test-results`
(180 arquivos, 32.101.850 bytes), `output` (29 PNGs, 2.893.454 bytes) e `validacao`
(10 arquivos, 2.557.338 bytes), antes em `tmp/validacao`. Caminhos absolutos dentro da worktree,
ausência de reparse points e contagens/bytes antes/depois conferidos em `preservacao.json`.
Nove junctions e históricos preservados. O relatório final 5C.2 antes em
`tmp/validacao/2026-11-06T04-47-39-911Z-e51ae6e3-9fee-4e57-a95d-b98ec82e5e12/run.json`
agora está em `evidencias-anteriores/validacao/` da rodada 5C.3. Logs e diagnósticos das globais
5C.2 com falhas continuam nos caminhos históricos, sem limpeza ou sobrescrita. Bundle gerado
pelo build oficial permanece com SHA-256 `D8D4D411E29773856417361E897BA103F4F6831E9EA49A2A0D06B389D47FC369`.

Primeira global 5C.3: **1153/1155 Node**, saída 1; Playwright não iniciou. Falharam os dois
casos anteriores de liberação após fechar aba. Diagnóstico com mensagens de recusa preservou
as asserções e reproduziu `ATIVIDADE_OCUPADA` em um deles (**1154/1155 Node**), em
`tmp/lab2c5c3-node-diagnostico.log`. Não foi evidência de perda de dados ou permissão indevida.
Verificação do Playwright instalado e reprodução mínima comprovaram que `waitForFunction`
tratava a Promise do predicado async como truthy: retornava false após **uma consulta**, sem
polling. Assim, a sincronização acrescentada em 5C.2 não garantia a liberação nativa.
Reprodução: `tmp/lab2c5c3-diagnostico-polling-assincrono.log`.

Correção restrita a `lab-journal-operacional.unit.cjs`: `expect.poll` aguarda cada query nativa,
mantendo intervalos de 25 ms, limite de 3 s e todas as asserções. `operar` apenas acrescenta
o código de recusa à mensagem de falha. Produção, políticas e prazos de produção inalterados.
Original preservado em `tmp/lab2c5c3-journal-operacional-antes-diagnostico.cjs`.
Arquivo completo **41/41 aprovado** em `tmp/lab2c5c3-journal-sincronizacao-corrigida.log`.
Reprodução determinística com Web Lock real observa primeiro held=1, libera o lock e só
conclui após nova consulta held=0 em `tmp/lab2c5c3-diagnostico-polling-corrigido.log`.
Build/formato/lint novamente aprovados, sem alteração do bundle.
Nova global em `tmp/lab2c5c3-global-20261106-074327/npm-test.log`, aprovada conforme abaixo.
Antes dela, `tmp/validacao` foi preservado (16 arquivos, 4.454 bytes), com contagens/bytes
conferidos em `preservacao.json` dessa nova rodada; output/test-results ausentes após falha
Node, e todos os PNGs/resultados anteriores permanecem no primeiro arquivo de evidências.

Global integral final aprovada em 06/11/2026: **1155/1155 Node e 638/638 Playwright**,
`NPM_TEST_EXIT=0`, duração Playwright 43,6 minutos. Relatório
`tmp/validacao/2026-11-06T10-46-51-641Z-3baea7cd-04c6-41b1-ba0c-ba88a26cc3a8/run.json`
com `status:passed`, `complete:true`, 638 descobertos/esperados/executados/aprovados e 638
tentativas, sem falhas/retries/flakies/skips/omissões/interrupções/timeouts. Fontes e artefatos
não mudaram durante a execução; depois dela, somente documentação de resultados.
Contagens/bytes dos dois manifestos de preservação 5C.3 reconferidos sem divergência;
29 novos PNGs (2.893.454 bytes), nove junctions e SHA-256 do bundle preservados.
LAB.2C.5C.3 concluída localmente na branch `codex/lab-1-contrato-arquitetura`, HEAD
`802489526a244be95cc89458ac68a0b5c2fe5349`, sem commit, publicação ou sincronização.

Pendências para eventual retomada/cancelamento assistido: efeitos ausentes e conflitos continuam
pendentes; precisam de protocolo e autorização próprios, com nova avaliação. Não há recriação,
repetição de snapshots, rollback, cancelamento destrutivo, merge, limpeza de journals, suporte
a arquivados/descartados, multiatividade, importador visual, interface ou piloto nesta etapa.

### Retomada assistida de incompletas — LAB.2C.5C.4

Opt-in de infraestrutura, sem interface ou chamada pelo aplicativo. Continua a operação existente,
na ordem conteúdo/administração → principal → responsável, somente nas sessões originalmente
incluídas. Não cria nova intenção para contornar a pendência, não modifica payload ou bases
originais, nem usa a autorização anterior de aplicação/reconciliação.

| API | Contrato |
| --- | --- |
| `LabJournal.inspecionarReconciliacao(operacao,original?)` | Mesma inspeção readonly de 5C.3; acrescenta `diagnostico.retomada` com bloqueios, operações potenciais por alvo e encaminhamento, sem autorização |
| `LabJournal.solicitarRetomada(original,operacao)` | Backup validado contra a intenção; inspeção atual e reserva exclusiva real; retorna solicitação opaca somente se houver criação ausente segura |
| `solicitacao.consultar()` | Prévia copiada do destino, atividade, journal e ações `criar-ausente`, `preservar-base`, `confirmar-presenca` ou `ja-confirmada`; sem respostas ou chaves livres |
| `solicitacao.confirmarRetomada()` | Confirmação específica de uso único, sem argumentos; não é intercambiável com intenção, aplicação ou reconciliação |
| `LabJournal.retomarIntencao(original,confirmacao)` | Consome a referência antes de await, revalida arquivo e bases, reconcilia presentes e cria somente ausentes; só retorna sucesso após terminal persistido e relido |
| `solicitacao.cancelar()` | Revoga e aguarda/aborta transação própria; preserva efeitos ou marcadores que já tenham sido comprometidos |

A análise de retomada reutiliza o núcleo de observação de `inspecionarReconciliacao`, seus
parsers, leitura consistente de pacote/administração, catálogo inteiro, comparação de snapshots,
releituras de estabilidade e identidade. A elegibilidade observacional não prova exclusividade:
o diagnóstico continua pontual e exige nova verificação sob posse antes de qualquer escrita.
Solicitação/diagnóstico nunca gravam dados. Se não houver ausente e o estado for reconciliável,
retorna `ENCAMINHAR_RECONCILIACAO`; a conclusão usa a confirmação separada de 5C.3, sem efeito
escolar. Terminal retorna `OPERACAO_JA_CONCLUIDA`, sem reabrir ou regravar.

Elegibilidade fechada: uma atividade, administração ativa, backup original disponível/íntegro
e compatível com identidade, digest, conteúdo e conjunto exato de sessões/snapshots do journal.
Aceita intenção inicial ou pendência operacional `em-andamento`, `em-reconciliacao` ou
`em-retomada`. Estados legados sem protocolo de continuação, incompatíveis/corrompidos, outro
journal conflitante, par órfão/inválido, leitura bloqueada, bases instáveis ou destino divergente
continuam bloqueados. Não amplia sessões, versão, perfil, conteúdo ou digest.

O vínculo privado inclui UUID, copyId/origem, payload, catálogo e bases atuais. O texto do
backup é capturado antes de await e novamente validado ao consumir a confirmação; os bytes
precisam coincidir com os selecionados nesta tentativa. O contrato v1 antigo não registra hash
do texto do arquivo original: a associação histórica é validada pelo payload original, sem
inventar prova de que sua formatação textual era a mesma. Confirmação é revogada em cancelamento,
expiração (30 segundos), pagehide, mudança de bases/identidade/estado ou perda de posse.
Harness simula o gesto; chamadas JS não autenticam consentimento humano real.

Tratamento por passo, sempre respeitando o prefixo já confirmado:

- Preservação exige base original ainda comprovada: pacote por digest/par ativo coerente;
  snapshot por SHA-256 do texto original, além de coerência pelo motor. Ausência, alteração ou
  reformatar a base de snapshot impede retomada; nunca a recria ou normaliza.
- Criação ainda `nao-iniciada` e comprovadamente ausente pode receber solicitação persistida.
  Dado já presente nessa etapa futura não fabrica uma solicitação histórica: permanece bloqueado.
- Criação em `escrita-solicitada` é inspecionada de novo. Se presente e exata, segue a reconciliação
  de 5C.3 (`presenca-verificada`), sem regravação ou inferência de autoria. Se realmente ausente,
  a nova confirmação permite criar, conservando `escrita-solicitada`, sem regredir ou reiniciar
  a etapa. Não interpreta ausência do marcador de observação como ausência dos dados.
- Etapa observada/confirmada que perdeu seu efeito permanece bloqueada, mesmo se a intenção
  original fosse criar: esta fase não repara perda de efeito anteriormente comprovado.
- Presentes coerentes são confirmados com as mesmas regras de 5C.3; resultados já confirmados
  são imutáveis. Igualdade lógica com representação diferente não confirma criação solicitada.

Extensão mínima e fechada do mesmo `lab-journal-v1`, sem nova store, schema, payload ou contador:
pendência usa `em-retomada`; terminal usa estado `aplicacao-concluida`, revisão 4 e efeitos
`verificados-por-retomada`. Mantém passos e resultados existentes, inclusive `presenca-verificada`.
Trocar a finalidade de uma pendência para retomada pode persistir apenas esse marcador, sem
alterar etapas. Primeira criação inicial persiste `escrita-solicitada` antes do efeito.
Uma solicitação já persistida continua válida somente após ausência reobservada e nova autorização;
não se fabrica um reinício histórico. Não há retry automático dentro da tentativa.
As transições públicas continuam diagnósticas, sem capacidade de escrita. Código anterior que
desconheça os novos marcadores deve recusá-los, nunca tentar interpretá-los como intenção nova.

Reutiliza integralmente as capacidades privadas de 5C.2: pacote/administração recebem somente
dois add atômicos após ausência conferida dentro da transação; progresso usa a mesma capacidade
de `lab-progresso.js`, chave derivada internamente, comparação/setItem na mesma pilha e leitura
independente. Não há outro restaurador, API de caminho livre ou atualização de cache de execução.
O journal usa a transação privada de confirmação de 5C.3. CAS nativo compara catálogo e par;
guardas síncronas comparam todos os textos das sessões. Depois de um efeito próprio, só os bytes
exatos esperados desse efeito entram na base prevista; uma nova leitura integral deve conferir
todo o restante sem mudanças antes de avançar. Web Locks reais da atividade/memória, sem steal,
permanecem até encerramento. Escritores externos que não cooperem continuam fora da garantia
de CAS do localStorage; não se presume atomicidade entre ele e IndexedDB ou durabilidade permanente.

Conclusão exige todos os efeitos atuais coerentes e todos os passos confirmados, terminal
comprometido por oncomplete, nova leitura independente e identidade/posse válidas. Falha ou
cancelamento retorna `aplicacaoConcluida:false`/`exigeInspecao:true`. Um setItem pode permanecer
mesmo com abort da janela IDB; não é removido nem repetido automaticamente. Commit sem resposta
ao chamador pode ser reconhecido por nova inspeção. Reiniciar Chromium nunca retoma por si só.

Arquivos deste incremento: `lab-journal.js`, novo `tests/validacao/lab-retomada.unit.cjs`,
esta especificação e inventário; após a falha global, também `lab-backup-browser.unit.cjs`,
e a fixture de `inventario-seguro.unit.cjs`, conforme diagnósticos abaixo. Repositório,
transporte, coordenador, planejador, motor,
app/HTML/CSS/launcher, revisões oficiais, políticas e ORG não foram alterados.
Validação direcionada: **65/65 testes novos e 553/553 LAB aprovados**, sem falhas/skips;
log `tmp/lab2c5c4-regressoes-lab.log`. Inclui intenção sem efeitos, todos os pontos de escrita
solicitada/observada/confirmada, duas sessões, sessão responsável sem principal e nenhuma sessão,
Alice/Mariana/versões/cópias independentes, pontos históricos após resposta editada e revisão
oficial ativa preservada. Spies confirmam apenas `operacoes:put`, `pacotes:add`,
`administracao:add` e setItem nas sessões ausentes originais, com quantidades exatas e payload
imutável. Inspeção/solicitação/recusas não emitem mutação. Presentes não são regravados.
CAS adversarial testa administração, journal e progresso tanto na transação do marcador quanto
na janela de snapshot. Cobertos ausência/replay/uso cruzado/cópia de confirmação, cancelamento
antes de confirmar e após commits, callbacks tardios, expiração, identidade/lock perdido,
quota/abort/timeout, falha silenciosa e leitura posterior bloqueada. Fechamento real de aba
após solicitação persistida, durante add nativo e após setItem sem confirmação; dois reinícios
completos de Chromium, preservando perfil sintético e exigindo nova decisão explícita.
Build, formato, lint e diff aprovados nessa primeira validação, sem alterar testes anteriores,
pins, políticas ou prazos. Correção posterior exclusivamente no cenário de teste descrita abaixo.

Primeira global em `tmp/lab2c5c4-global-20261106-135507/npm-test.log`. Antes da execução,
diretórios fixos preservados em
`evidencias-anteriores/` dessa rodada, com caminhos absolutos verificados dentro da worktree,
ausência de reparse points e contagens/bytes antes/depois conferidos em `preservacao.json`:
test-results (180 arquivos, 32.101.413 bytes), output (29 PNGs, 2.893.454 bytes) e validacao
(10 arquivos, 2.558.158 bytes), antes em tmp/validacao. O relatório final 5C.3, antes em
`tmp/validacao/2026-11-06T10-46-51-641Z-3baea7cd-04c6-41b1-ba0c-ba88a26cc3a8/run.json`,
agora está em `evidencias-anteriores/validacao/` dessa rodada 5C.4. Históricos com falhas e
diagnósticos anteriores não foram movidos nem alterados. Baseline dos arquivos deste incremento
em `tmp/lab2c5c4-preflight/`, sem sobrescrever cópias anteriores. Nove junctions preservadas;
repositório, transporte, coordenador e planejador conferidos por hash, sem alterações.
Bundle do build oficial inalterado, SHA-256
`D8D4D411E29773856417361E897BA103F4F6831E9EA49A2A0D06B389D47FC369`.

Primeira global 5C.4: **1219/1220 Node**, saída 1; Playwright não iniciou. Falhou o caso anterior
de escrita pendente/captura de backup em `lab-backup-browser.unit.cjs`, esperando Lua e lendo
Sol em 3,46 s. O teste não carrega o journal alterado nesta fase e mantém uma rota de identidade
retida enquanto tenta uma segunda edição. A produção tem timeout de identidade de 3 s; se ele
vence, suspende corretamente a sessão e ignora eventos posteriores, preservando a resposta Sol.

Arquivo original inalterado passou isolado **16/16** em
`tmp/lab2c5c4-backup-browser-isolado.log`. Diagnóstico acrescentando mensagem apenas em falha
passou **1220/1220 Node** em `tmp/lab2c5c4-node-diagnostico-backup.log`; não capturou recusa nessa
rodada e não foi tratado como aprovação global. Reprodução com o relógio Playwright instalado,
avançado explicitamente até 3.000 ms com a rota retida, produziu a mesma divergência Sol/Lua:
coordenador `suspensa`/`IDENTIDADE_INDISPONIVEL`, memória Sol, sem escrita, em
`tmp/lab2c5c4-backup-expiracao-deterministica.log`. Esse diagnóstico deliberadamente falha na
expectativa antiga; arquivo sintético em tmp não participa da suíte padrão.

Correção restrita ao teste de backup: relógio controlado mantém a condição pretendida de
autorização ainda pendente, com as mesmas asserções e novas comprovações de pendência/sessão
ativa. Relógio retomado antes de persistir. Acrescentado teste independente do prazo original:
ativa em 2.999 ms, suspensa em 3.000 ms, ignora Lua e resposta tardia, não permite nova captura
ou persistência, zero setItem e preservação da captura anterior. Não se ampliou prazo de produção
ou de teste, nem se alterou código escolar/backup para aceitar resposta após suspensão.
Arquivo **17/17 aprovado** em `tmp/lab2c5c4-backup-browser-relogio-controlado.log`.
Original preservado em `tmp/lab2c5c4-backup-browser-antes-diagnostico.cjs`; logs e scripts
diagnósticos permanecem. Build/formato/lint/diff novamente aprovados; bundle inalterado.

Segunda global em `tmp/lab2c5c4-global-20261106-140944/npm-test.log`, resultado abaixo,
sem monitoramento contínuo. Antes dela, tmp/validacao preservado em evidencias-anteriores/validacao
dessa nova rodada: 16 arquivos, 4.454 bytes, com caminhos/contagens/bytes conferidos no manifesto
preservacao.json. Output/test-results não foram recriados pela falha Node; todas as evidências
anteriores, nove junctions e perfis sintéticos permanecem preservados.

Segunda global 5C.4: **1220/1221 Node**, saída 1; Playwright não iniciou. Falhou exclusivamente
`inventario-seguro.unit.cjs`, caso de diferença de caixa com identidade de arquivo distinta:
esperado untracked, recebido tracked. Sem relação com o fluxo LAB: a fixture usava
`targetStat.ino + 1` para simular outro arquivo. Em identificadores Windows acima da precisão
inteira de Number, somar um pode manter o mesmo valor. A reprodução somente por leitura nos
arquivos sintéticos preservados observou ino e ino+1 iguais a `10133099162764504` e classificação
tracked: `tmp/lab2c5c4-reproducao-inode.log`; diagnóstico de metadados em
`tmp/lab2c5c4-diagnostico-inode.log`. Arquivo original isolado passou 13/13, pois a nova fixture
usou identificadores menores; não substituiu a reprodução da causa.

Correção somente no teste: identidades sintéticas garantidamente distintas, com assertiva
explícita dessa diferença, tanto para o inode real quanto para `2 ** 54`. A expectativa untracked
e os demais casos de correspondência/ambiguidade foram mantidos. Sem alteração do classificador,
infraestrutura ORG, política, pin ou timeout. Cópia anterior em
`tmp/lab2c5c4-inventario-antes-correcao.cjs`; arquivo corrigido **13/13 aprovado** em
`tmp/lab2c5c4-inventario-corrigido.log`. Build/formato/lint/diff novamente aprovados; produção
LAB e bundle inalterados nesta correção. Não foi necessário modificar produção para obter aprovação.

Terceira global em `tmp/lab2c5c4-global-20261106-142236/npm-test.log`, aprovada conforme abaixo,
sem monitoramento contínuo. Antes dela, tmp/validacao preservado em
evidencias-anteriores/validacao dessa rodada (8 arquivos, 2.226 bytes), com caminhos absolutos,
ausência de reparse points e contagens/bytes antes/depois conferidos em preservacao.json.
Output/test-results continuam ausentes após falha Node. Todas as tentativas e evidências
anteriores permanecem preservadas, sem limpeza; nove junctions e hash do bundle reconferidos.

Global integral final aprovada em 06/11/2026: **1221/1221 Node e 638/638 Playwright**,
`NPM_TEST_EXIT=0`, duração Playwright 45,0 minutos. Relatório
`tmp/validacao/2026-11-06T17-26-15-434Z-0712b488-a9b6-480a-9502-359e961a91fd/run.json`
com status passed, complete true, 638 descobertos/esperados/executados/aprovados e 638 tentativas;
zero falhas/retries/flakies/skips/omissões/interrupções/timeouts. Fontes e artefatos não mudaram
durante a execução; depois, somente documentação de resultados. As duas globais com falhas,
os diagnósticos e cópias anteriores permanecem preservados.
Contagens/bytes dos três manifestos 5C.4 reconferidos após a global sem divergência; nove
junctions, bundle e 29 novos PNGs (2.893.454 bytes) preservados. Repositório, transporte,
coordenador e planejador conferidos por hash, iguais ao preflight 5C.4.
LAB.2C.5C.4 concluída localmente na branch `codex/lab-1-contrato-arquitetura`, HEAD
`802489526a244be95cc89458ac68a0b5c2fe5349`, alterações acumuladas sem commits. Nenhum commit,
push, PR, merge, sincronização, limpeza, piloto ou etapa seguinte foi iniciado.

Cancelamento assistido definitivo, eventual rollback, resolução de conflitos, limpeza, interface,
download e piloto continuam fora desta etapa e exigem protocolo/autorização separados.

### Encerramento assistido sem aplicação — LAB.2C.5C.5

Fluxo opt-in de infraestrutura, sem interface, recuperação automática, rollback ou remoção.
Só pode encerrar intenção inicial íntegra, de uma atividade, com todas as etapas em
`nao-iniciada`/`nao-comprovado` e marcadores originais `registrada`/`nao-iniciada`/`nao-comprovados`.
Qualquer estado de aplicação/reconciliação/retomada, inclusive escrita solicitada ainda sem
resposta ou dados atualmente ausentes, impede encerramento. Não se infere inexistência histórica
de efeitos a partir da ausência atual. Estados legados sem comprovação inicial também bloqueiam.

| API | Contrato |
| --- | --- |
| `inspecionarReconciliacao(operacao,original?)` | Acrescenta `diagnostico.encerramento`, somente leitura: fundamentos por alvo, elegibilidade pontual, aplicação iniciada/efeito possível, efeito presente, divergência, leitura inconclusiva e encaminhamento |
| `solicitarEncerramento(original,operacao)` | Mesmo padrão de associação das etapas anteriores: backup revalidado contra payload, UUID, destino, atividade/digest/sessões, observação integral e reserva exclusiva real |
| `solicitacao.consultar()` | Prévia copiada e efeito administrativo `encerrar-intencao-sem-aplicacao-e-sem-remocao`; não expõe respostas, gabaritos ou chaves |
| `solicitacao.confirmarEncerramento()` | Confirmação própria de uso único, sem argumentos; não aceita token de aplicação/reconciliação/retomada |
| `encerrarIntencao(original,confirmacao)` | Revalida bytes, payload, journal, identidade/posse e todas as bases, persiste apenas terminal e relê independentemente; sucesso somente após commit comprovado |
| `solicitacao.cancelar()` | Revoga confirmação e aguarda/aborta a transação própria; não desfaz terminal já comprometido nem dados escolares |

Reutiliza observação de 5C.3, par nativo consistente, contexto puro do motor, derivação inerte de
chaves, catálogo completo e guardas de estabilidade. Cada alvo originalmente criado deve
continuar comprovadamente ausente; cada preservado exige base compatível: pacote por digest/par
ativo coerente, snapshots pelo hash do texto original e validação semântica. O v1 original não
registrou timestamp administrativo histórico: não se inventa essa prova. As bases atuais completas
ficam vinculadas à tentativa e não podem mudar entre inspeção, confirmação e transação.
Identidade/corrupção/conflito/leitura inconclusiva não são dispensados. A análise pontual não
prova exclusividade; solicitação adquire Web Lock exclusivo da atividade e reserva real de ausência
de memória, mantendo-os até commit/releitura ou suspensão. Sem steal, mutex localStorage ou fila
indefinida. Dados integralmente presentes elegíveis são encaminhados à reconciliação de 5C.3.

Compatibilidade: extensão estrita de `lab-journal-v1`, sem nova store ou versão de banco.
Novo estado `cancelada-sem-aplicacao`, revisão 5, preserva todos os marcadores históricos,
etapas, UUID, destino, conteúdo, snapshots e bases originais. Acrescenta exclusivamente no
terminal `encerramento:{versao:1,efeito:'sem-aplicacao',pacote:<texto-canônico>}`. Esse contexto
é validado pelo mesmo validador e precisa corresponder ao digest/identidade/payload original;
permite validar o histórico independentemente de futuras mudanças legítimas no destino,
inclusive quando o conteúdo original era somente referência de preservação. Não é exibido na
prévia. Registros antigos permanecem intocados. Metadado em estado diferente, versão desconhecida,
efeito divergente, contexto inválido ou qualquer passo iniciado tornam o terminal inválido/bloqueante.
Código antigo que desconheça a extensão deve recusá-la, nunca tratá-la como intenção inicial.

Única transição operacional permitida: intenção inicial íntegra → terminal sem aplicação.
Transições públicas continuam apenas diagnósticas. Não reabre terminal, não converte parcial ou
concluída em cancelada e não fabrica histórico anterior. Confirmação privada distinta é consumida
antes de await; bytes atuais do backup precisam coincidir com os selecionados. Erro, expiração
(30 segundos), pagehide, alteração de bases/identidade ou perda de posse revogam a operação.
Sem interface, harness demonstra o gesto e não autentica consentimento humano real.

Reutiliza a capacidade de confirmação do journal 5C.3: transação nativa nas três stores lê par
e catálogo, faz CAS e somente `operacoes.put` do terminal selecionado. Guardas síncronas conferem
os textos das sessões; oncomplete e releitura independente do terminal são obrigatórios.
Não recebe comando escolar, não invoca capacidade de aplicação/snapshot, não altera caches,
pacotes, administração ou localStorage. Não há atomicidade presumida com escritores externos
que não cooperem com o protocolo, nem garantia de retenção permanente.

Somente terminal estruturalmente íntegro lido do banco deixa de bloquear. Detector mantém o
registro no catálogo; ele não conflita com nova intenção e não é reativado. Contexto persistido
permite que futura restauração tenha novo digest, comparação e confirmações sem invalidar o
histórico encerrado. O limite conservador de 32 registros continua incluindo terminais.
Terminal adulterado/incompatível permanece bloqueante. Falha ou resposta de commit inconclusiva
retorna `encerramentoConfirmado:false`/`exigeInspecao:true`. Se o commit ocorreu sem resposta,
nova inspeção reconhece o terminal sem repetir escrita. Reinício nunca encerra automaticamente.

Arquivos deste incremento: `lab-journal.js`, novo `tests/validacao/lab-encerramento.unit.cjs`,
esta especificação e inventário; após falhas globais, também fixtures de `lab-backup-browser.unit.cjs`
e `lab-restauracao.unit.cjs`, conforme diagnósticos abaixo. Repositório, transporte, coordenador, planejador, motor,
app/HTML/CSS/launcher, revisões oficiais, políticas e ORG permanecem inalterados.
Validação direcionada: **49/49 testes novos Chromium e 603/603 LAB aprovados**, sem falhas/skips,
em `tmp/lab2c5c5-regressoes-lab.log`. Inclui todos os estados de aplicação/retomada/conclusão,
ausentes, bases preservadas e pontos históricos, Alice/Mariana, sessões/versões/vizinhos, revisão
oficial ativa e futuras intenções com contexto/digest diferentes. Spies comprovam somente
`operacoes:put` no encerramento; inspeção, solicitação e recusas não emitem mutações. Antes/depois
conferem dados escolares byte a byte e preservação de todo o registro original, exceto estado,
revisão e o novo contexto terminal. Correção posterior de fixture anterior descrita abaixo.
Cobertos tokens forjados/copiados/cruzados, replay concorrente, expiração, cancelamento antes da
confirmação, leitura retida/retorno tardio, perda de identidade/posse, corrupção e CAS interposto
de administração/journal/progresso. Quota, abort e timeout preservam o registro anterior. Fechamento
real durante put aborta o journal; commit sem resposta é reconhecido por inspeção sem regravação.
Dois reinícios completos do Chromium conservam pendência/terminal, sem encerramento automático.
Build/formato/lint/diff aprovados; bundle inalterado. Repositório, transporte, coordenador e
planejador conferidos por SHA-256, iguais ao preflight em `tmp/lab2c5c5-preflight/`.

Primeira global em `tmp/lab2c5c5-global-20261106-155350/npm-test.log`, resultado abaixo,
sem monitoramento contínuo. Antes dela, diretórios fixos preservados em
`evidencias-anteriores/` dessa rodada, com caminhos absolutos verificados dentro da worktree,
ausência de reparse points e contagens/bytes antes/depois conferidos em `preservacao.json`:
test-results (180 arquivos, 32.101.585 bytes), output (29 PNGs, 2.893.454 bytes), validacao
(10 arquivos, 2.559.056 bytes), antes em tmp/validacao. O relatório final 5C.4 antes em
`tmp/validacao/2026-11-06T17-26-15-434Z-0712b488-a9b6-480a-9502-359e961a91fd/run.json`
agora está em `evidencias-anteriores/validacao/` dessa rodada 5C.5. Todas as tentativas históricas,
diagnósticos, perfis sintéticos e nove junctions preservados; nenhuma limpeza ou sobrescrita.
SHA-256 do bundle: `D8D4D411E29773856417361E897BA103F4F6831E9EA49A2A0D06B389D47FC369`.

Primeira global 5C.5: **1269/1270 Node**, saída 1, sem Playwright. Falhou o teste anterior de
captura durante escrita pendente, agora na persistência final: Lua estava correta em memória,
mas storage tinha Sol. Esse teste não carrega o journal desta fase. A fixture retinha todas as
consultas de identidade e liberava apenas a primeira. A gravação coalescida de Lua podia fazer
uma segunda consulta enquanto o handler antigo ainda existia, antes de sua remoção.
Reprodução controlada em `tmp/lab2c5c5-backup-rota-expirada.log` observou duas rotas, persistência
false/CANAL_INATIVO, memória Lua e storage Sol após expirar a segunda consulta: proteção de
produção correta, sem afirmar persistência. A rodada Node com diagnóstico na persistência passou
1270/1270 em `tmp/lab2c5c5-node-diagnostico-rota.log`; não capturou a falha nessa rodada e não
substitui aprovação global. Diagnósticos e scripts sintéticos fora da suíte padrão preservados.

Correção somente da fixture: reter a primeira consulta e encaminhar todas as seguintes ao servidor
real com route.continue; manter o handler ativo até concluir a persistência, para exercitar esse
caminho independentemente da ordem de remoção. Relógio permanece controlado até o sucesso da
operação deliberadamente não expirada, e depois é retomado. Acrescentadas asserções de persistência
ok e de pelo menos duas consultas; todas as anteriores e o caso de expiração em 2.999/3.000 ms
permanecem. Sem alteração de produção, políticas ou prazos. Arquivo **17/17 aprovado** em
`tmp/lab2c5c5-backup-browser-rota-corrigida.log`; original em
`tmp/lab2c5c5-backup-browser-antes-rota.cjs`. Build/formato/lint/diff novamente aprovados.

Segunda global em `tmp/lab2c5c5-global-20261106-160606/npm-test.log`, resultado abaixo,
sem monitoramento contínuo. Antes dela, tmp/validacao preservado em evidencias-anteriores/validacao
dessa nova rodada: 16 arquivos, 4.454 bytes, com caminhos absolutos, ausência de reparse points
e contagens/bytes conferidos em preservacao.json. Output/test-results ausentes após falha Node;
todos os PNGs, perfis, históricos e nove junctions anteriores preservados. Bundle inalterado.

Segunda global 5C.5: **1269/1270 Node**, saída 1, sem Playwright. Falhou o teste anterior de
coordenador ainda preparando em `lab-restauracao.unit.cjs` (3,36 s), após observar preparando
e responder a identidade retida: preparação retornou false. O teste não carrega o journal desta
fase. Original isolado **35/35 aprovado** em `tmp/lab2c5c5-restauracao-isolado.log`.
Reprodução controlada que avançou o relógio a 3.000 ms nessa mesma fronteira registrou
`CONSENTIMENTO_NECESSARIO`, estado `aguarda-consentimento`, motivo `IDENTIDADE_TIMEOUT` e a
mesma falha da assertiva antiga, em `tmp/lab2c5c5-restauracao-expiracao.log`. Esse diagnóstico
deliberadamente falha, não pertence à suíte padrão e preserva a evidência da causa.

Correção só no teste: manter tempo controlado no cenário que precisa permanecer preparando,
até comprovar preparação concluída e estado pronta. As assertivas originais foram mantidas;
resultado da preparação agora é incluído na mensagem de falha. Novo caso separado comprova
preparando em 2.999 ms e recusa/aguarda-consentimento em 3.000 ms, sem habilitar modo persistente
por resposta tardia, sem carregar pacote temporário e com banco inalterado. Produção, prazos,
políticas e pins inalterados. Arquivo **36/36 aprovado** em
`tmp/lab2c5c5-restauracao-relogio-corrigido.log`; cópia anterior em
`tmp/lab2c5c5-restauracao-antes-relogio.cjs`. Build/formato/lint/diff novamente aprovados.

Terceira global em `tmp/lab2c5c5-global-20261106-162243/npm-test.log`, aprovada conforme abaixo,
sem monitoramento contínuo. Antes dela, tmp/validacao preservado em
evidencias-anteriores/validacao dessa rodada (8 arquivos, 2.226 bytes), com caminhos absolutos,
ausência de reparse points e contagens/bytes conferidos em preservacao.json. Output/test-results
não foram recriados pela falha Node; históricos, PNGs, perfis e nove junctions preservados.
Bundle inalterado, sem qualquer correção de produção durante esta investigação.

Global integral final aprovada em 06/11/2026: **1271/1271 Node e 638/638 Playwright**,
`NPM_TEST_EXIT=0`, duração Playwright 45,6 minutos. Relatório
`tmp/validacao/2026-11-06T19-26-28-741Z-604342e4-c548-4a87-99f1-65113294efe7/run.json`
com status passed, complete true, 638 descobertos/esperados/executados/aprovados, 638 tentativas
e zero falhas/retries/flakies/skips/omissões/interrupções/timeouts. Fontes e artefatos não mudaram
durante a execução; depois, somente documentação de resultados. As duas tentativas com falhas,
diagnósticos e cópias anteriores continuam preservados.
Contagens/bytes dos três manifestos 5C.5 reconferidos após a global sem divergência. Nove junctions
e seus destinos conferem com o preflight; 29 novos PNGs (2.893.454 bytes), perfis sintéticos e
bundle preservados. Repositório, transporte, coordenador e planejador conferidos por SHA-256,
iguais ao preflight. LAB.2C.5C.5 concluída localmente na branch
`codex/lab-1-contrato-arquitetura`, HEAD `802489526a244be95cc89458ac68a0b5c2fe5349`, alterações
acumuladas sem commits. Nenhum commit, push, PR, merge, sincronização, limpeza, rollback,
auditoria de consolidação, interface ou piloto foi iniciado.

Encerramento de parciais, reversão assistida, rollback, compactação, remoção, interface e piloto
continuam fora desta etapa e exigem contrato e autorização próprios.

### Exportação por arquivo e recuperação planejadas

Formato `lab-backup-v1` implementado em memória acima: objeto fechado com `formato`, `versao: 1`, `entradas`.
Cada entrada fechada contém `pacote` (contrato acima), `digest`, `situacaoAdministrativa`
(`ativa`/`arquivada`) e `sessoes` (objeto fechado `principal`/`responsavel`, cada qual opcional).
Valor de sessão: snapshot de progresso versão 1 do motor LAB, limitado aos campos
`versao`, `questaoAtual`, `respostas`, `corrigidas`, `pontuadas`, `conferidas`, `pontos`,
`finalizada`; respostas seguem a compatibilidade de até 1.000 unidades UTF-16 implementada
na LAB.2C.3 acima, em arrays indexados só por
IDs de questão existentes, mapas booleanos só aceitam IDs conhecidos e `true`, índices finitos
inteiros no intervalo e pontos inteiros entre 0 e total. Não habilitar tentativas no v1.
O futuro exportador segue os oito campos obrigatórios; restaurador recusa desconhecidos.

Backup não inclui caminhos, chaves de armazenamento, `copyId` de origem, registros privados,
credenciais, logs ou dados oficiais. Limite de 20 entradas/8 MiB UTF-8, profundidade 16 e
200000 tokens; mesmas regras léxicas/propriedades proibidas, limites por pacote e erro seguro.
Tombstone sem conteúdo não permite backup completo: exportar antes do descarte ou selecionar
o JSON original para recuperar. Não exportar progresso órfão isolado como se fosse pacote completo.

Download exige ação explícita e informa que há respostas/gabaritos privados; sem envio ou
salvamento automático no repositório. Não afirmar sucesso de escrita no disco: o navegador
preparou o download, cabendo ao usuário guardar o arquivo. Exportação captura sessão atual em
memória quando armazenamento falhou, indicando essa origem no resumo de exportação.

Restauração valida o arquivo inteiro e todos os digests antes de escrever. Motor LAB deve
normalizar snapshot e reavaliar respostas/correções com seu próprio avaliador. `corrigidas`
exige resposta atual correta e marcadores correspondentes em `conferidas` e `pontuadas`;
`finalizada: true` exige todas as questões corrigidas. `pontos` deve coincidir com a contagem
dos IDs válidos em `pontuadas`, sendo recalculado pelo motor, nunca incrementado pela importação.
Snapshot inconsistente é recusado, sem criar acertos ou reparar silenciosamente o arquivo.

**Pontuação histórica não é acerto atual:** o motor preserva `pontuadas` depois de editar uma
resposta, mesmo que a nova esteja errada. Backup deve preservar esse estado legítimo; não
rejeitar um backup próprio apenas por essa diferença. Marcadores históricos válidos em forma
e IDs são declarações do backup confirmado pelo responsável, não evidência autenticada de
desempenho. Não há como provar sua origem por digest de JSON editável; não prometer prevenção
de falsificação do histórico. Importação não libera avanço sem correção atual. A validação
de coerência é opt-in LAB e reutiliza o motor, sem mudar progresso oficial legado.

Preview mostra perfil, versões, situações e sessões; confirmar restauração e, se outra cópia/
origem, a associação explícita ao escopo atual. Chaves são recalculadas localmente. Conteúdo
divergente com mesma identidade bloqueia. Conteúdo idêntico pode ser reutilizado sem duplicação;
progresso já existente diferente bloqueia a restauração dessa entrada, sem opção de sobrescrita
embutida. Usuário pode cancelar ou excluir a sessão em operação independente e tentar novamente.
Progresso idêntico é idempotente; estado administrativo existente não muda silenciosamente.

Não há transação atômica entre IndexedDB e localStorage. Fazer preflight de todas as entradas,
adquirir locks em ordem de identidade, registrar operação pendente em IndexedDB e criar apenas
chaves de progresso antes ausentes. Publicar entradas só após confirmação de todas as gravações.
Journal interno guarda identidades/chaves geradas e snapshots estritamente necessários para
reconciliação, nunca caminhos ou autorizações externas. Se interrompido, bloquear essas entradas
e oferecer concluir/cancelar explicitamente; rollback remove somente chaves comprovadamente
criadas pela operação e ainda iguais ao snapshot gravado. Divergência preserva dados e exige
resolver conflito, sem varredura ou exclusão presumida. Só retirar journal após reconciliação.
Quota/falha parcial nunca aparece como restauração concluída. Em modo temporário, restauração
fica em memória e exportável, sem promessa de sobreviver ao fechamento.

### Matriz de riscos

| Risco | Controle obrigatório | Prova futura |
| --- | --- | --- |
| JSON hostil, HTML ou esgotamento | Limites antes do parse, schema fechado, chaves duplicadas/proibidas, texto escapado | Corpus negativo, tamanho/profundidade limítrofes, nenhum código/recurso executado |
| Colisão com oficial | Dono privado no motor, handle sem alvo arbitrário, chaves geradas | Tentativas de retirar/limpar oficial recusadas e marcadores intactos |
| Duas cópias na mesma origem | `copyId` no banco/chave, revalidação, sem adoção automática | Troca de servidor/cópia durante sessão e reinício |
| Pontuação duplicada ou estado incoerente | Normalizador LAB reutiliza avaliador, deriva total e separa ponto histórico de acerto atual | Backup inconsistente, edição após acerto e round-trip, erro/correção/volta/recarga |
| Quota, bloqueio ou valor antigo | Estado de durabilidade observável, memória, exportação, sem sobrescrita | Falha após gravação anterior e recarga com dados inconsistentes |
| Descarte indevido | Conteúdo/progresso separados, confirmações, tombstone | Cancelamento, reimportação e chaves vizinhas preservadas |
| Restauração parcial/concorrente | Locks, journal e reconciliação explícita | Interrupção em cada fronteira e duas abas |
| Vazamento de material privado | Banco local e download explícito, sem telemetria/publicação | Requisições/console sem conteúdo sensível e diff limitado |
| Regressão de motor/interface | Extensão opt-in, retorno LAB isolado | LAB → oficial → LAB, revisão sem opt-in e suíte global |

## 8. Critérios de aceite

1. Importar pacotes válidos de ambos os perfis sem alterar imports, catálogo ou testes por atividade;
   inválidos deixam bancos/listas/progresso inalterados e recebem erros acessíveis.
2. Executar `errar → conferir → corrigir → conferir → avançar → voltar → recarregar`, preservando
   respostas e posição, erro recuperável e ponto único por questão; subitens só concluem juntos.
3. Reabrir/liberar repetidamente não duplica listeners, registros ou pontos; revisão oficial
   continua funcionando e não pode ser removida por uma operação LAB.
4. Conteúdo e progresso sobrevivem a reinício somente nos modos comprovadamente persistentes;
   modo temporário e falha de gravação têm aviso visível e backup possível.
5. Perfis, matéria, pacote/versão, cópia, origem e sessões permanecem isolados. Reimportação,
   arquivar/reativar e descarte preservam progresso até sua exclusão explícita específica.
6. Backup válido restaura sob confirmação; conflitos, inconsistências e falhas parciais não
   sobrescrevem dados. Abas concorrentes não executam manutenção simultânea da mesma atividade.
7. Mouse, toque e teclado completam todos os fluxos, inclusive cancelamentos. Rótulos claros,
   foco visível/restaurado ao acionador, status via `aria-live`, sem dependência só de cor.
   Confirmações identificam alvo; Escape cancela sem mutação. Em 390 × 844 não há overflow
   horizontal; validar desktop, zoom 200%, leitor de tela e axe-core.
8. Entrada única “Laboratório” separada das trilhas oficiais; filtros perfil/matéria, situação
   administrativa e conclusão principal; botões importar, abrir/retomar, arquivar, reativar,
   descartar, excluir progresso por sessão, exportar e restaurar. Arquivadas em seção própria;
   descartadas em recuperação administrativa. Nenhum JSON bruto/gabarito na tela da criança.

## 9. Estratégia de testes

LAB.1 altera apenas Markdown: conferir diff/links/status; não executar build, lint, instalação
ou testes. Não se declara comportamento implementado ou validado em navegador nesta etapa.

LAB.2A: 98/98 testes Node direcionados aprovados, build, formato, lint e diff aprovados.
O primeiro build encontrou resolução de dependências ausentes na worktree; após reutilização
local dos pacotes já instalados, o build oficial completo passou e os bundles ficaram iguais
ao HEAD. Sem instalação/download: quatro junctions locais ignoradas em `node_modules`
(`vite`, `pdfjs-dist`, `prettier`, `eslint`) apontam para os pacotes existentes na cópia principal;
essa cópia continua necessária para executar as ferramentas. Nenhum arquivo dela foi editado.
Não foi executada global: módulo puro não importado, sem alterações em superfícies compartilhadas,
política, build ou estado escolar; falha inicial foi de resolução de dependência, sem regressão
funcional observada. Global de futura integração/PR continua obrigatória.

LAB.2A–LAB.4 terão corpus sintético versionado de fixtures mínimas, não pacotes reais das
crianças. Testes unitários permanentes do validador, canonicalização/digest, adaptação,
identidade, ciclo administrativo, transações/recuperação e limites. Cobrir propriedade
desconhecida em cada nível, ambiguidades do gabarito, fronteiras e entradas adversariais.

Playwright permanente por contrato: carregar fixture via seletor real, tipos opcoes/campos,
ambos os perfis, principal/responsável, matriz pedagógica completa, recarga/reinício do contexto,
arquivar/reativar/descartar, limpeza seletiva, backup round-trip/conflitos, dados corrompidos,
IndexedDB/localStorage bloqueados e quota, identidade ausente/trocada, duas abas, modo temporário,
callbacks tardios, teclado, toque, 390 × 844, axe-core, console e ausência de rede externa.
Interceptações de falha não substituem os percursos reais do banco/navegador.
Manter marcadores oficiais e de outras sessões/cópias em todos os testes destrutivos sintéticos.

Um novo JSON de uso local passa pelo mesmo validador em tempo de importação e revisão pedagógica
do responsável, sem acrescentar spec permanente. Fixture/teste novo é necessário quando surgir
um comportamento, regressão ou tipo de erro novo; não para cada conteúdo ou título.
Fixtures não constituem evidência de uso humano, fala, aprendizagem ou backup salvo em disco.

Qualquer código exige `npm run build`, `npm run format:check`, `npm run lint` e direcionados.
Mudanças previstas em motor, armazenamento, navegação, registro, HTML/CSS estrutural, limpeza,
restauração ou pontuação acionam **`npm test` integral**, conforme `AGENTS.md`; toda PR mantém
a global. Adição integrada v3/opt-ins não cobre o carregador LAB. Não mudar pins, contratos,
classificação, reporter, ORG ou seleção de testes para obter exceção artificial.

## 10. Etapas seguintes e limites de autorização

| Etapa | Entrega proposta | Gate antes de avançar |
| --- | --- | --- |
| LAB.2A (implementada isoladamente) | Validador puro, schema interno, pré-checagem limitada e vetores de canonicalização/digest; sem UI, banco ou registro dinâmico | Direcionados, build/formato/lint/diff aprovados; global se houver gatilho compartilhado futuro |
| LAB.2B | IndexedDB, identidade/locks, durabilidade e journal de backup; extensão opt-in mínima de armazenamento | Falhas/recuperação comprovadas; nenhuma migração de dados reais; global por armazenamento/restauração |
| LAB.2C | Adaptador/handle no motor, retirada restrita, snapshots de sessão e normalização LAB | Oficial irremovível, contratos pedagógicos/recarga e transições; global por motor/pontuação |
| LAB.2D | Interface mínima e contexto de retorno ao LAB, administração, importação/exportação/restauração | Fluxo acessível completo com fixtures, sem integração oficial por pacote; global por navegação/HTML |
| LAB.3 | Validação integrada dos contratos, falhas, concorrência e regressões; eventual piloto original somente com autorização específica | Global do snapshot final e revisão humana de acessibilidade/backup; nenhum piloto implícito |
| LAB.4 | Validação humana autorizada, documentação de operação/limites e decisão sobre adoção | Evidências de uso real e preservação; commit/publicação continuam dependendo de autorização |

Cada etapa requer pedido próprio. Dependências entre banco e handle podem usar contratos e
fixtures de teste; não criar um segundo motor provisório. Este documento não inicia LAB.2A.

## 11. Decisões pendentes e riscos residuais

As decisões de formato, limites, identidade, fallback temporário, isolamento e separação de
descarte/progresso estão consolidadas acima. Restam escolhas de implementação a comprovar:

- Escolha de parser resolvida na LAB.2A pelo scanner limitado + parser nativo (seção 4),
  sem dependência nova. O carregador LAB no bundle continua inexistente; sua integração e
  compatibilidade efetiva no navegador permanecem para etapas futuras.
- APIs mínimas exatas de handle/durabilidade e ponto do roteador para retorno: revisar os
  consumidores antes de editar; contrato legado e opt-in devem permanecer separados.
- Compatibilidade de IndexedDB, Web Locks e digest nos navegadores-alvo. Ausência mantém
  somente modo temporário; persistência em `file://` fica expressamente fora do v1.
- Limites de armazenamento/dados expulsos pelo navegador, fechamento abrupto, origem e caminho
  real alterados: backup explícito é a recuperação disponível, não garantia absoluta de retenção.
- Checagem HTTP de identidade reduz mistura acidental, sem autenticar conteúdo/cópia maliciosa
  ou garantir atomicidade com troca de servidor. Scripts da mesma origem têm acesso aos dados;
  LAB não constitui isolamento de segurança entre usuários do mesmo navegador.
- Avaliação de texto livre plausível e adequação pedagógica não são resolvidas pelo schema.
  Conteúdos com requisitos fora do formato precisam esperar nova versão, não burlar propriedades.
- Backup local editável não autentica histórico de pontuação; confirmação importa declarações
  do responsável. Coerência estrutural e correção atual são verificáveis; autoria/história não.

Conflitos reais com a arquitetura atual: não há retirada dinâmica nem canal visual de
durabilidade; normalização atual precisa de validação de coerência para backup importado,
respeitando a pontuação histórica que já existe. Alternativa de
menor risco é a extensão opt-in mínima descrita, condicionada às regressões/globais futuras,
em vez de duplicar motor, alimentar catálogo oficial ou reaproveitar infraestrutura ORG.
