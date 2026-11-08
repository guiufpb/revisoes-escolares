# Inventário de implementações do projeto

## LAB.2D.6C.2 — integração operacional local (validada integralmente)

Admissão explícita v1/v2 com pacote original, digest e infraestrutura de aquisição/progresso/
recuperação autêntica. Interface neutra por identificação derivada do digest; v1 preservado.
Backup-v1 e journal existentes, sem interface de exportação/restauração/administração.
Temporário v2 recusado, sem migração, namespace ou alteração do avaliador/áudio.
Validação C2: 673 testes Node distintos aprovados nas 16 suítes LAB (13 novos); 238/238 Playwright em
quatro arquivos completos (32 novos). Rodada Node completa 672/672 e arquivo de aplicação
46/46 após acrescentar a recusa temporária: repetições não somadas ao total distinto.
Rodada Playwright completa 238/238 e quatro cenários ampliados de conclusão/recarga 4/4.
Sem falhas/retries/flaky/skips/omissões/timeouts nas rodadas finais. Fontes e artefatos
estáveis conforme reporters. Build, formato, lint, manifesto e diff aprovados.
Manifesto: 69 revisões, 50 specs, 850 casos descobertos. Relatório `tmp/lab2d6c2-faseA-20261108-000635/RELATORIO_FASE_A.md`.
Global integral aprovada conforme encerramento abaixo; liberação operacional local validada
no escopo da 6C.2, sem iniciar outras capacidades.
Contratos e limites em infraestrutura/LAB_DITADOS_V2.md. source.identity.complete:false separado.



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

## LAB.2D.6C.1 — contratos compartilhados (validada integralmente)

Reconhecimento v1/v2 somente para análise; canônico/digest originais, projeção única para
motor/configuração/snapshot e avaliador existente. Análise integral de lab-backup-v1 e
journal v1 prepara ambos os formatos sem emitir capacidade de gravação. Validadores e
operações públicas continuam exclusivos v1, incluindo restauração, reconciliação e retomada.
Sem alterações de banco/chaves/locks, áudio ou interfaces. Detalhes e dependências 6C.2 em
infraestrutura/LAB_DITADOS_V2.md. Fase A aprovada: 660 Node distintos nas 16 suítes LAB,
20 novos; 206/206 Playwright em quatro specs completas (9min02s), sem falhas/retries/skips.
Build, formato, lint, manifesto e diff aprovados. Descoberta: 69 revisões, 50 specs, 818 casos.
229 evidências/38.828.205 bytes e cópias, 13.997 históricos e 29 PNGs íntegros por SHA-256;
nove vínculos válidos. HEAD/branch preservados, staging vazio. Global aprovada conforme encerramento abaixo.
Relatório `tmp/lab2d6c1-faseA-20261107-201404/RELATORIO_FASE_A.md`.
source.identity.complete:false continua separado; nenhuma alteração de pins/políticas.




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

## LAB.2D.6B — adaptação interna e áudio (validada integralmente)

Adaptação pura revalidada de v2 para campos/ditado, IDs e ordem preservados, apresentação
neutra sem metadados recebidos. GramaticaDitado aceita en-US opt-in; pt-BR legado mantido.
Controles e guards existentes reutilizados, sem admissão pública ou persistência v2.
Testes instrumentam conexões/canais apenas na fixture; contratos reais v1 permanecem.
Detalhes e dependências LAB.2D.6C em LAB_DITADOS_V2.md.
Fase A aprovada: 169 Playwright (92 execução LAB, com 16 novos; 51 importação;
26 contratos oficiais de áudio/ditado/opt-ins) e 284 Node (validador v1/v2, registro,
motor, snapshots, backup, journal e restauração). Rodada final dos 16 novos também
aprovada após reforço de correção parcial/capturas, sem somar repetições aos totais.
Build, formato, lint, manifesto e diff aprovados. Manifesto: 69 revisões, 50 specs,
818 casos. Logs e relatório em `tmp/lab2d6b-faseA-20261107-182226/`.
Áudio compartilhado, validador e persistência protegidos por hash; 29 PNGs intactos,
nove vínculos válidos. source.identity.complete:false continua separado.

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




## LAB.2D.6A — contrato de ditados (validada integralmente)

Validação estrutural pura de lab-questionarios-v2, isolada da admissão operacional v1.
Palavra padrão/frase explícita, pt-BR/en-US, fonte única texto e limites UTF-16 estritos.
V1 e componentes de áudio/persistência preservados. Não importa/executa/recupera v2.
Detalhes em infraestrutura/LAB_DITADOS_V2.md.
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




## LAB.2D.5 — Desktop Amplo (validada integralmente)

Escolha visual antes de iniciar/continuar em Estudar atividades; configuração interna
fechada layout.desktopAmplo no construtor confiável. Reutiliza o CSS e a montagem oficiais.
Não alterna durante execução nem reconstrói sessão; preserva preferência entre criança
e responsável na mesma atividade. Retornar à lista ou recarregar restaura escolha padrão.
JSON v1, digest, snapshots, progresso, avaliador e registros oficiais inalterados.
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




## LAB.2D.4 — Modo Responsável (validada integralmente)

Alternância opt-in no controlador LAB existente, confirmação cancelável, sessões isoladas,
validação estrita do destino e recuperação explícita da origem. Mantém handle/coordenador
e aquisição na troca; desativar drena progresso e liberar fica na saída definitiva.
Gate recusa navegação concorrente com orientação para repetir. Listagem conserva presença
principal; abertura normal/recarga não ativam responsável. Sem mudança dos registros oficiais.
Fase A aprovada: 209 Playwright (67 execução, incluindo 18 novos; 87 consulta/importação;
55 contratos oficiais) e 130 Node de motor/coordenador/progresso/snapshots/registro.
Build, formato, lint, manifesto e diff aprovados. Manifesto: 69 revisões, 50 arquivos, 792 casos.
Logs novos `tmp/lab2d4-faseA-20261107-*.log`; artefatos exclusivos em
`tmp/lab2d4-faseA-20261107/`. Tentativas anteriores preservadas: falhas de seletor/fixture
novos foram corrigidas e todos os arquivos direcionados passaram na rodada final.
Nove vínculos locais e 29 PNGs mantidos; sem alteração de pins/políticas/classificações.
Global integral aprovada em 07/11/2026: 1272/1272 Node e 792/792 Playwright,
código 0; sem falhas, flaky, retries, skips ou casos omitidos. Duração total 57min50s
(Playwright 55,2min). Fontes e artefatos estáveis durante a execução conforme reporter.
Evidências preexistentes: 218 arquivos/36.127.357 bytes copiados e reconferidos por SHA-256;
136 logs históricos idênticos. Dez capturas de test-results regeneradas pelo runner têm
versões anteriores preservadas nas cópias verificadas. Os 29 PNGs de output permanecem
idênticos, e os nove vínculos válidos. Sem alteração de pins/políticas/classificações.
Log `tmp/lab2d4-global-20261107-011310/npm-test.log`; relatório `tmp/lab2d4-global-20261107-011310/RELATORIO_FASE_B.md`.
LAB.2D.4 validada integralmente no escopo técnico; identidade integral continua pendente.



## LAB.2D.3 — execução principal e saída segura

Na listagem, expandir **Estudar atividades** e escolher **Iniciar atividade** ou **Continuar
atividade**. Consulta/importação anteriores continuam opt-in independentes, sem iniciar
execução ou exigir reescrita dos seus testes. Novo `lab-execucao.js` consulta/revalida pacote,
identidade/digest/administração e journal; prepara coordenador existente, adquire Web Lock,
valida snapshot e abre handle autêntico na sessão principal. Configuração/ID/chave são
derivados internamente. Usa o painel e o avaliador existentes; nenhum catálogo oficial novo.

Handle ganhou observação privada de metadados de durabilidade, sem eventos globais de
respostas/chaves. Progresso ganhou consulta somente de presença, com o construtor interno
da chave, sem sessão ou escrita na listagem. Strict snapshot usa o analisador puro existente
antes de abrir; nenhuma reparação silenciosa. Final LAB informa verificar salvamento e
retorna ao Laboratório pelo gate, sem alterar a conclusão das revisões oficiais.

Gate opt-in antes de navegação/perfil/abertura oficial, captura de controles relevantes,
saída com `handle.liberar()` aguardado e coordenador encerrado somente após sucesso.
Falha mantém handle, memória e reserva; retentativa é explicitamente `persistir()`, sem
retry automático. Eventos antigos e comandos repetidos são invalidados. `beforeunload`
oferece aviso nativo para memória não durável, sem prometer salvamento em fechamento forçado.

Nova spec sintética `tests/lab-execucao.spec.js`, 49 casos, com IndexedDB/localStorage/Web
Locks reais, duas abas, coalescência, falhas, perfis, correção, recarga, teclado/toque e três
resoluções. Comparação de identidade no motor também impede troca de matéria/ID/versão
do pacote entre aquisição e conexão. Manifesto aditivo: 50 arquivos/774 casos; catálogo mantém 69 revisões oficiais.
Direcionados: 49 execução + 87 consulta/importação + 11 regressões escolares/a11y aprovados;
130 Node de motor/coordenador/progresso/snapshots e 19 do manifesto aprovados.
Build, formato, lint e diff aprovados. Logs em
`tmp/lab2d3-direcionados-final.log`, `tmp/lab2d3-direcionados-2.log` e
`tmp/lab2d3-mensagens-final.log` (quatro falhas/suspensão reconferidas após ajuste de mensagem).
Global integral aprovada em 07/11/2026: 1272 Node + 774 Playwright, saída 0, sem falhas,
flaky, skips ou retries; fontes e artefatos estáveis durante a execução. Log:
`tmp/lab2d3-global-20261106-231431/npm-test.log`. Os 271 arquivos/56.462.314 bytes de
evidências copiados tiveram todos os hashes reconferidos; nove vínculos e 29 PNGs mantidos.
Identidade integral continua `source.identity.complete:false`, com 29 PNGs `unknown`, sem
renovação de pins/políticas ou reclassificação. Só especificação/inventário recebem este
registro após a global; código, testes e bundle não foram alterados depois dela.
Execução temporária, sessão responsável,
limpeza, backup e recuperação visual continuam fora da interface.

## LAB.2D.2 — prévia e importação explícita de JSON

Área recolhível **Importar atividade — Responsável** na tela LAB, sem autenticação simulada.
Seleção nativa valida bytes originais (até 256 KiB, UTF-8 estrito, sem remover BOM) com
`LabValidador.validarPacote`. Prévia apresenta somente metadados literais e não cria banco,
pacote, progresso ou journal. Apenas **Confirmar importação** permite abrir/criar o banco e
usar `cadastrar(bytes)`; identidade/origem/perfil, pacote/digest, conflitos e journal são
reconferidos. Sucesso depende do retorno confirmado do repositório; falha na atualização
da lista é distinguida de cadastro não confirmado. Não há execução de atividades.

Novo `lab-importacao.js`, HTML/CSS e pontos mínimos de entrada/saída existentes. Listagem
passa a retornar resultado seguro da atualização. Repositório conserva transação e `add`;
exceções síncronas de quota nos callbacks agora abortam preservando o código específico.
Cancelamento/troca de arquivo/saída revogam prévias; duplo clique é bloqueado. Sair durante
confirmação não promete desfazer commit. Bytes e payload não são guardados em globais/DOM.

Nova spec sintética `tests/lab-importacao.spec.js` (50 casos), com identidade HTTP local e
IndexedDB nativo, falhas injetadas, concorrência de UI, teclado/toque e três resoluções.
LAB.2D.1 preserva seus 37 casos; duas asserções de ausência de execução agora conferem os
três botões autorizados e continuam exigindo lista sem ações de execução. Manifesto aditivo:
49 arquivos/725 casos; sem mudança de pins, políticas ou catálogo oficial.
Direcionados aprovados: 50 importação + 37 listagem + 11 regressões escolares/a11y;
97 Node de persistência/journal e 19 do manifesto, build, formato, lint e diff aprovados.
Log final em `tmp/lab2d2-direcionados-final.log`. Global integral aprovada em 06/11/2026:
1271 Node + 725 Playwright, saída 0, sem falhas/flaky/skips/retries; fontes e artefatos
estáveis durante a execução. Log: `tmp/lab2d2-global-20261106-200204/npm-test.log`.
248 arquivos/48.422.757 bytes de evidências preservados por cópia tiveram seus hashes
reconferidos após a global; nove vínculos e 29 PNGs mantidos. Bundle inalterado após a suíte.
A pendência `source.identity.complete:false` e os 29 PNGs `unknown` permanecem sem
reclassificação. Somente especificação/inventário recebem este registro após a global;
código, testes e bundle não foram alterados depois dela. [Fluxo e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#prévia-e-importação-explícita--lab2d2).

## LAB.2D.1 — primeira interface, consulta local somente de leitura

Entrada opt-in **Laboratório de Atividades** no painel de matérias, usando Alice/Mariana
já escolhida. Tela no roteador existente, retorno com painel/rolagem/foco preservados,
metadados literais sem conteúdo de questões e avisos de indisponibilidade/pendências.
`lab-listagem.js` abre somente banco existente; journal ganhou
`inspecionarPendenciasExistentes`, sem schema, migração, sessão ou handle de execução.
Identidade reconferida ao concluir e geração invalidada ao sair. Nada é cadastrado no
catálogo oficial; importação, execução e administração permanecem fora da interface.

Fontes: HTML, CSS específico, `app.js`, `app.entry.js`, novo módulo de listagem e extensão
de leitura no journal. Teste permanente `tests/lab-listagem.spec.js`: IndexedDB Chromium,
falhas, isolamento, ausência de escrita, teclado/toque, a11y e três tamanhos de tela.
Validação: 37 LAB + 11 regressões escolares/a11y, 97 persistência/journal e 19 manifesto
aprovados, além de build/formato/lint/diff. Metadados da spec no manifesto: 48 arquivos,
675 casos. Global integral aprovada em 06/11/2026: 1271 Node + 675 Playwright, saída 0,
sem falhas/flaky/skips/retries; fontes e artefatos estáveis durante a execução.
Log em `tmp/lab2d1-global-20261106-182233/npm-test.log`. As cópias de 229 arquivos de
evidências tiveram hashes reconferidos; nove vínculos e 29 PNGs preservados.
Mapa das instruções atualizado no ponto LAB. Identidade integral ainda pendente:
`source.identity.complete:false`, 29 PNGs `unknown`, sem alterações de pins/política ou
classificação. Especificação e inventário atualizados documentalmente após a global;
código, testes e bundle não foram alterados depois dela.
[Contrato e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#listagem-somente-de-leitura--lab2d1).

## LAB.2C.5C.5 — encerramento explícito da intenção nunca aplicada

`inspecionarReconciliacao` inclui fundamentos seguros de encerramento. Novo fluxo opt-in:
`solicitarEncerramento(original,operacao)` → `confirmarEncerramento()` →
`encerrarIntencao(original,confirmacao)`, com autorização própria e de uso único, identidade,
Web Locks reais, ausência de memória e bases revalidadas. Só intenção inicial íntegra com todos
os passos não iniciados, criações ainda ausentes e bases preservadas comprovadas é elegível.
Qualquer aplicação/retomada ou escrita solicitada bloqueia, mesmo se os dados pareçam ausentes.

Terminal estrito `cancelada-sem-aplicacao`, revisão 5, conserva marcadores/payload e adiciona
contexto `encerramento` versão 1 para validar histórico independentemente de futuras restaurações.
Reutiliza apenas a capacidade de journal 5C.3: CAS, `operacoes.put`, oncomplete e releitura;
zero mutações escolares. Terminal íntegro lido libera o bloqueio sem exclusão ou reativação.
Corrupção permanece bloqueante; nova restauração exige intenção e confirmações novas.
[APIs, compatibilidade, fundamentos e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#encerramento-assistido-sem-aplicação--lab2c5c5).

Alterados journal, novo teste, especificação e inventário; após falha global, também a fixture
de retenção de rota em `lab-backup-browser.unit.cjs`, sem alterar asserções anteriores.
Após a segunda global, também relógio controlado em cenário de preparação pendente de
`lab-restauracao.unit.cjs` e novo caso da expiração original, sem alteração de produção.
**49/49 testes novos e
603/603 LAB aprovados**, incluindo primitivas nativas, CAS adversarial, interrupção real durante
put, commit sem resposta e dois reinícios completos do Chromium. Build/formato/lint/diff
aprovados, bundle inalterado; demais módulos conferidos por hash. Resultado global final abaixo.
Primeira global: **1269/1270 Node**, saída 1, sem Playwright, em
`tmp/lab2c5c5-global-20261106-155350/npm-test.log`. Falhou persistência Lua do teste de backup;
edição em memória passou. Fixture podia reter uma segunda consulta da gravação coalescida;
reprodução com expiração dessa consulta manteve Lua em memória e Sol no storage, sem falsa
confirmação de produção. Node diagnóstico 1270/1270 passou. Fixture agora retém somente a
primeira consulta e encaminha as seguintes ao servidor real, mantendo handler/relógio até
verificar persistência bem-sucedida e a segunda consulta. Arquivo **17/17 aprovado**, cenário de
expiração original preservado. Produção/prazos/políticas inalterados nesta correção; logs e cópia
anterior preservados. Segunda global em `tmp/lab2c5c5-global-20261106-160606/npm-test.log`:
1269/1270 Node, saída 1, sem Playwright. Teste de coordenador ainda preparando retinha identidade
por tempo real e podia expirar entre observar estado e responder. Reprodução controlada aos
3.000 ms mostrou `CONSENTIMENTO_NECESSARIO`/`IDENTIDADE_TIMEOUT`, proteção correta.
Arquivo original isolado 35/35; corrigido **36/36**, com tempo pendente controlado e novo caso
ativa preparação em 2.999 ms, expiração em 3.000 ms e recusa de habilitação por resposta tardia.
Asserções anteriores, prazos e políticas mantidos; produção inalterada. Build/formato/lint/diff
novamente aprovados. Terceira global aprovada em 06/11/2026: **1271/1271 Node e 638/638
Playwright**, saída 0 (45,6 minutos Playwright). Log:
`tmp/lab2c5c5-global-20261106-162243/npm-test.log`. Relatório completo, 638 tentativas, sem
falhas/retries/flakies/skips/omissões/interrupções/timeouts; fontes e artefatos estáveis:
`tmp/validacao/2026-11-06T19-26-28-741Z-604342e4-c548-4a87-99f1-65113294efe7/run.json`.
Evidências fixas anteriores preservadas em `evidencias-anteriores/` da primeira rodada, com caminhos,
contagens e bytes conferidos em `preservacao.json`; relatório final 5C.4 agora na subpasta validacao.
Três manifestos 5C.5 reconferidos após a global sem divergência; 29 novos PNGs, nove vínculos
e bundle preservados. Depois da execução, somente documentação de resultados.
LAB.2C.5C.5 concluída localmente na branch `codex/lab-1-contrato-arquitetura`, HEAD `8024895`.
Históricos, perfis sintéticos, PNGs, logs e nove vínculos preservados; sem commit,
push, PR, merge, sincronização, limpeza, rollback, interface ou início de outra etapa.

## LAB.2C.5C.4 — retomada assistida somente de ausentes autorizados

`inspecionarReconciliacao` agora inclui diagnóstico de retomada sem escrita. Novo fluxo opt-in:
`solicitarRetomada(original,operacao)` → `confirmarRetomada()` →
`retomarIntencao(original,confirmacao)`, com confirmação própria, exclusiva e de uso único.
Mesma intenção/UUID, conteúdo/digest/sessões exatos e bases vinculadas; não amplia escopo.
Todos presentes encaminham à reconciliação 5C.3. Preservados exigem a base original;
ausência/leitura inconclusiva são distintas. Em `escrita-solicitada`, presente é conferido
sem regravar, e ausência comprovada sob nova autorização permite criação sem regredir etapas.
Efeito anteriormente observado/confirmado que desapareceu permanece bloqueado.

Reutiliza somente add atômico de pacote/administração e a capacidade privada de snapshot 5C.2;
journal usa a capacidade de confirmação 5C.3, com CAS/releitura e passos confirmados imutáveis.
Marcadores estritos `em-retomada`/`verificados-por-retomada`, no mesmo v1/schema. Sem retry,
rollback, sobrescrita, remoção, UI ou integração ao aplicativo. Interrupções conservam efeitos
e pendência; terminal exige oncomplete, leitura independente, identidade e posse válidas.
[Contrato, APIs, transições e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#retomada-assistida-de-incompletas--lab2c5c4).

Alterados journal, novo teste de retomada, especificação e inventário; após a falha global,
também sincronização de relógio de um teste anterior de backup, novo caso de expiração e
correção de identidade sintética no teste de inventário, conforme diagnóstico abaixo.
Demais módulos permanecem inalterados. **65/65 testes de retomada e 553/553 LAB aprovados**,
incluindo CAS nas duas capacidades, falhas nativas, memória entre abas, fechamento real nas
fronteiras de solicitação/add/setItem e dois reinícios completos do Chromium. Build/formato/
lint/diff aprovados; bundle inalterado. Primeira global: **1219/1220 Node**, saída 1, sem
Playwright; log `tmp/lab2c5c4-global-20261106-135507/npm-test.log`. Cenário anterior de backup
retinha identidade enquanto esperava editar Lua; expirando o prazo de 3 s, o motor corretamente
recusava a edição após suspensão. Arquivo original isolado 16/16 e Node diagnóstico 1220/1220
passaram; reprodução determinística ao vencer o prazo produziu a mesma divergência Sol/Lua.
Corrigido somente o relógio do cenário de escrita ainda pendente; asserções originais mantidas.
Novo caso verifica ativa em 2.999 ms e suspensa em 3.000 ms, resposta tardia sem escrita e captura
anterior imutável. Arquivo de backup **17/17 aprovado**, sem alterar produção, prazos ou políticas;
build/formato/lint/diff novamente aprovados. Falhas, cópia anterior e diagnósticos preservados.
Segunda global: **1220/1221 Node**, saída 1, sem Playwright; log
`tmp/lab2c5c4-global-20261106-140944/npm-test.log`. Falhou fixture de inventário que simulava
outro inode por `ino + 1`: para identificador Windows grande, a soma retornava o mesmo Number.
Reprodução nos arquivos sintéticos preservados comprovou identidades iguais. Corrigida somente
a fixture, garantindo números diferentes e cobrindo também `2 ** 54`; asserção `untracked`
mantida. Arquivo **13/13 aprovado**, classificador de produção inalterado; sem mudanças ORG,
políticas ou prazos. Global final aprovada em 06/11/2026: **1221/1221 Node e 638/638
Playwright**, saída 0, 45,0 minutos Playwright. Log:
`tmp/lab2c5c4-global-20261106-142236/npm-test.log`. Relatório completo, 638 tentativas,
sem falhas/retries/flakies/skips/omissões/interrupções/timeouts; fontes e artefatos estáveis:
`tmp/validacao/2026-11-06T17-26-15-434Z-0712b488-a9b6-480a-9502-359e961a91fd/run.json`.
Evidências fixas anteriores preservadas em `evidencias-anteriores/`
da primeira rodada, com caminhos/contagens/
bytes conferidos em `preservacao.json`; relatório final 5C.3 agora em sua subpasta validacao.
Três manifestos 5C.4 reconferidos após a global sem divergência; 29 novos PNGs e nove vínculos
preservados, bundle inalterado. Depois da execução, somente documentação de resultados.
LAB.2C.5C.4 concluída localmente na branch `codex/lab-1-contrato-arquitetura`, HEAD `8024895`.
Alterações acumuladas, nove vínculos, perfis, logs e PNGs anteriores preservados; sem commit,
push, PR, merge, sincronização, limpeza ou início de outra etapa.

## LAB.2C.5C.3 — reconciliação explícita, conservadora e sem escrita escolar

`inspecionarReconciliacao(operacao,original?)` identifica journal, destino, etapas, conteúdo/
administração e snapshots, distinguindo presença, preservação, ausência, divergência, corrupção
e leitura inconclusiva. Somente lê banco existente; não cria schema para diagnosticar ausência.
Sem original, diagnóstico usa payload suficiente do journal, sem conceder autorização.
`solicitarReconciliacao(original,operacao)` exige exclusividade e emite confirmação própria por
`confirmarReconciliacao()`. `reconciliarIntencao(original,confirmacao)` atualiza **só operacoes**,
com CAS, oncomplete e leitura independente; não cria, regrava, exclui ou reinterpreta dado escolar.

Igualdade não prova autoria. Resultado `presenca-verificada` separa efeito presente de criação
histórica. Confirmados não retrocedem; etapa posterior não solicitada não vira criação por
existência de dados. Terminal `verificados-por-reconciliacao` exige todos os efeitos/etapas
comprovados sob identidade e posse válidas. Ausências/conflitos/incerteza mantêm pendência;
commit sem resposta ao chamador é reconhecido por nova inspeção, sem recuperação automática.
[APIs, classificações, transições e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#reconciliação-conservadora-de-interrompidas--lab2c5c3).

Alterados journal, repositório, coordenador e helper de leitura do planejador, novo teste de
reconciliação, especificação e inventário. Sem módulo novo, UI ou armazenamento oficial.
**53/53 novos testes e 488/488 LAB aprovados**; build/formato/lint/diff aprovados.
A primeira global falhou em dois testes anteriores de journal (1153/1155 Node); Playwright não
iniciou. Diagnóstico reproduziu `ATIVIDADE_OCUPADA` (1154/1155 Node) e comprovou falha no helper:
`waitForFunction` com predicado async encerrava após uma consulta, mesmo resolvida em false.
Corrigido somente o polling para `expect.poll`, aguardando cada query nativa; mantidos limite
de três segundos, asserções e cobertura. Mensagens agora informam o código de recusa.
Arquivo completo **41/41 aprovado**, com reprodução adicional de lock real ocupado/livre;
produção inalterada nesta correção. Global integral corrigida aprovada em 06/11/2026:
**1155/1155 Node e 638/638 Playwright**, saída 0 (43,6 minutos Playwright).
Relatório completo, 638 tentativas, sem falhas, retries, flakies, skips, omissões, interrupções
ou timeouts; fontes e artefatos estáveis durante a execução. Relatório:
`tmp/validacao/2026-11-06T10-46-51-641Z-3baea7cd-04c6-41b1-ba0c-ba88a26cc3a8/run.json`.
Históricos, falhas e diagnósticos preservados. Retomada, rollback, cancelamento assistido ou
interface dependem de pedido separado.
Nova global: `tmp/lab2c5c3-global-20261106-074327/npm-test.log`. Primeira tentativa preservada em
`tmp/lab2c5c3-global-20261106-072021/npm-test.log`, com evidências
anteriores preservadas em `evidencias-anteriores/` dessa rodada, com contagens/bytes conferidos
no manifesto `preservacao.json`; nove junctions, PNGs, perfis e históricos preservados. Bundle inalterado.
Contagens/bytes dos dois manifestos 5C.3 reconferidos após a global; 29 novos PNGs preservados.
Depois da execução, somente documentação de resultados. LAB.2C.5C.3 concluída localmente,
sem commits, na branch `codex/lab-1-contrato-arquitetura`, HEAD `8024895`.

## LAB.2C.5C.2 — primeira aplicação controlada, sem sobrescrita

`LabJournal.solicitarAplicacao(original,operacao)` seleciona intenção persistida íntegra,
revalida destino/payload/bases sob Web Locks e emite confirmação separada de uso único por
`confirmarAplicacao()`. `aplicarIntencao(original,confirmacao)` cria somente ausentes:
pacote/administração por add atômico no IDB; snapshots pela capacidade privada do transporte
na chave LAB derivada. Iguais são preservados byte a byte; nenhuma execução recebe estado externo.

Journal v1 conserva solicitação, observação por leitura independente e confirmação persistida
por passo. Só o marcador terminal persistido/relido permite `aplicacaoConcluida:true`.
Falhas e interrupções deixam etapas incertas detectáveis, sem repetir escrita, remover dados
ou anunciar restauração integral. Não há atomicidade presumida entre IDB e localStorage.
Coordenador bloqueia execução persistente com journal pendente/incompatível; oficiais ficam
preservadas. Concluídos são retidos, sem limpeza automática ou ampliação do limite de registros.
[APIs, transações, estados e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#aplicação-controlada-sem-sobrescrita--lab2c5c2).

Alterados somente journal, planejador, repositório, progresso e coordenador LAB, além de
novo teste de aplicação, especificação e inventário. Dois testes anteriores de journal tiveram
sincronização de liberação nativa após fechamento, sem remoção de assertivas ou cobertura.
Diagnóstico histórico 5C.1 preservado e consultado pontualmente, sem ampliar prazos de produção
ou alterar políticas. **43/43 testes novos e
435/435 LAB aprovados**; build/formato/lint/diff aprovados. Primeiro motivo de falha da transação
é preservado, sem AbortError mascarar timeout. Global integral aprovada em 06/11/2026:
**1102/1102 Node e 638/638 Playwright**, saída 0 (45,5 minutos Playwright). Relatório completo,
638 tentativas, zero falhas/retries/flakies/skips/omissões/interrupções/timeouts na execução
final; fontes e artefatos estáveis durante a execução. Depois, somente documentação de resultados.
Log reservado: `tmp/lab2c5c2-global-20261106-005324/npm-test.log`. Evidências anteriores
preservadas em `evidencias-anteriores/` dessa rodada, com contagens/bytes conferidos no manifesto
`preservacao.json`; nove junctions, PNGs, perfis e arquivos históricos preservados. Bundle inalterado.
Primeira global: 1100/1102 Node passaram, saída 1; Playwright não iniciou. Dois testes anteriores
recusaram preparação após fechar aba com lock; hipótese de timing, sem causa comprovada.
Arquivo completo passou isolado (41/41), sem mudanças de código/testes/prazos/cobertura/política.
Reexecução integral também falhou nos mesmos dois casos (1100/1102 Node):
`tmp/lab2c5c2-global-20261106-012014/npm-test.log`; falhas e artefatos preservados.
Diagnóstico capturou `ATIVIDADE_OCUPADA` após page.close(): liberação nativa ainda em curso,
recusa correta da produção. Testes agora exigem query de locks vazia antes de nova preparação,
preservando bloqueio anterior e sucesso posterior. Cópia do teste anterior e diagnóstico na
especificação. Após isso, Node padrão **1102/1102 aprovado**, sem instrumentação, falhas ou skips.
Nova global aprovada: `tmp/lab2c5c2-global-20261106-014423/npm-test.log`; relatório
`tmp/validacao/2026-11-06T04-47-39-911Z-e51ae6e3-9fee-4e57-a95d-b98ec82e5e12/run.json`.
Contagens/bytes dos três manifestos reconferidos após a global; nove junctions, bundle,
29 novos PNGs e históricos preservados. Tentativas anteriores com falhas permanecem registradas.
Aplicativo continua sem integração/interface; chamadas JS não autenticam responsável humano.
LAB.2C.5C.2 concluída, sem commits, na branch `codex/lab-1-contrato-arquitetura`, HEAD `8024895`.
Reconciliação explícita e qualquer retomada dependem de LAB.2C.5C.3, não iniciada.

## LAB.2C.5C.1 — autorização controlada e journal operacional

`LabJournal.solicitarConfirmacao(original)` revalida uma atividade e reserva Web Locks reais;
o handle expõe prévia, confirmação específica de uso único e cancelamento. Somente
`prepararIntencao(original,confirmacao)` autenticado persiste `lab-journal-v1` por add em
`operacoes`, após nova comparação e confirmação nativa oncomplete. Nenhuma escrita em pacote,
administração ou localStorage; sucesso significa intenção registrada, nunca restauração aplicada.
Plano diagnóstico, true, registro pronto e objetos forjados continuam recusados.

Memória retida pelo motor conserva proteção nativa entre abas mesmo após suspensão do
coordenador; temporário usa reserva compartilhada conservadora, exclusiva durante intenção.
Recusa divergências, arquivos multiatividade, arquivados, limites/transporte excedidos,
ausência de identidade/locks, progresso não durável e journal conflitante/corrompido.
Cancelamento/expiração/pagehide revogam callbacks; commit persistido permanece detectável,
sem aplicação, exclusão, transições ou reconciliação automática.
[API, reservas, transação, limites e segurança](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#autorização-controlada-e-journal-operacional--lab2c5c1).

41/41 testes novos Chromium e 392/392 LAB aprovados, incluindo interrupção real da aba,
reinício completo do Chromium, CAS das bases e observação de somente `operacoes:add` nos
caminhos positivos. Build/formato/lint/diff aprovados; global integral aprovada na reexecução,
encerrada em 06/11/2026: 1059/1059 Node e 638/638 Playwright (45,9 minutos Playwright), saída 0.
Relatório completo, 638 tentativas e zero falhas/retries/flakies/skips/omissões/interrupções/
timeouts nessa reexecução; fontes/artefatos estáveis durante a execução. Depois, somente docs.
A primeira global saiu com código 1: 1058/1059 Node passaram, Playwright não iniciou; um cenário
de escrita pendente falhou em 3,39 segundos, compatível com timeout de identidade sob carga,
sem causa comprovada. Diagnóstico isolado do arquivo completo: 16/16 passaram sem alterações.
Mesmos código/testes/cobertura/política na reexecução integral aprovada, com log exclusivo
`tmp/lab2c5c1-global-20261105-232959/npm-test.log`; arquivos da tentativa anterior preservados.
Evidências anteriores preservadas em `tmp/lab2c5c1-global-20261105-223344/evidencias-anteriores/`,
com contagens/bytes conferidos no manifesto `preservacao.json`; nove junctions preservadas.
Log da primeira tentativa: `tmp/lab2c5c1-global-20261105-223344/npm-test.log`.
Relatório final: `tmp/validacao/2026-11-06T02-32-53-190Z-a8e45f31-eb88-431f-a15d-b141a7fcab9c/run.json`.
Contagens/bytes arquivados reconferidos após a global; 29 novos PNGs e nove junctions preservados.
Aplicativo sem integração LAB: uma chamada JavaScript não autentica humano; confirmação de
interface real ainda é necessária. Sem alegação de defesa contra scripts maliciosos da mesma
origem. LAB.2C.5C.1 concluída. Nenhuma aplicação de backup ou LAB.2C.5C.2 foi iniciada;
alterações anteriores preservadas, ainda sem commits na branch `codex/lab-1-contrato-arquitetura`.

## LAB.2C.5B — contrato de journal e detecção de pendências

`lab-journal.js` valida/inspeciona `lab-journal-v1` na store `operacoes` existente, sem schema
novo, aplicação ou escrita operacional. Destino atual, atividades/digests/sessões, intenções
criar/preservar, referências/snapshots e estados monotônicos fechados. Repositório ganhou apenas
cursor limitado e leitura por referência opaca; planejador 5A bloqueia pendências conhecidas
por atividade e corrupção/alcance incerto globalmente no LAB. Sem atingir revisões oficiais.
Criação operacional permanece bloqueada por falta da autorização/associação sob exclusividade
da LAB.2C.5C; não se promove token 5A nem objeto de lock. Persistência/commit/interrupção foram
exercitados exclusivamente pelo helper das fixtures, conforme exceção explícita do pedido.
[APIs, contrato, limites e bloqueio operacional](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#journal-contrato-e-detecção-implementados-lab2c5b).
25/25 novos testes Chromium e 351/351 no conjunto LAB aprovados, incluindo reinício real do
processo com perfil sintético preservado. Build/formato/lint/diff aprovados; bundle inalterado.
Global integral aprovada em 05/11/2026: 1018/1018 Node e 638/638 Playwright (45,5 minutos
Playwright), saída 0, sem falhas/retries/skips/flakies/interrupções/timeouts. Fontes/artefatos
não mudaram durante a execução. Log `tmp/lab2c5b-global-20261105-204511/npm-test.log`;
relatório completo na especificação.
Evidências anteriores preservadas e verificadas em
`tmp/lab2c5b-global-20261105-204511/evidencias-anteriores/`, manifesto `preservacao.json` na rodada.
Contagens/bytes reconferidos após a global; novos 29 PNGs e nove vínculos preservados.
LAB.2C.5B encerrada no recorte permitido de contrato/detecção e persistência sintética,
com criação operacional explicitamente bloqueada. LAB.2C.5C não iniciada.

## LAB.2C.5A — planejamento conservador por leitura, sem aplicação

`lab-restauracao.js` revalida os bytes/texto originais, identifica destino, consulta conteúdo
e progresso, observa locks/handles autênticos e entrega plano opaco apenas de inspeção.
Classifica ausência, idempotência lógica/textual, divergência, corrupção, incompatibilidade
administrativa e consulta inconclusiva. Reconfirma identidade e bases, sem overwrite, cadastro
ou correção automática. Arquivada, memória não comprovada, sessão ativa/pendente e snapshot
maior que o transporte atual bloqueiam; confirmação/associação e validação sob locks continuam futuras.
[APIs, efeito técnico de schema vazio, limites e dependências](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#planejamento-por-leitura-implementado-lab2c5a).
35/35 novos testes Chromium e 326/326 no conjunto LAB aprovados; build/formato/lint/diff aprovados.
Apenas módulo isolado não importado/testes/docs novos; motor, armazenamento e APIs anteriores
intactos, sem aplicação de restauração. Bundle com hash inalterado. Global integral aprovada
em 05/11/2026: 993/993 Node e 638/638 Playwright (45,8 minutos Playwright), saída 0, sem
falhas/retries/skips/flakies/interrupções/timeouts. Fontes/artefatos não mudaram durante a execução.
Log `tmp/lab2c5a-global-20261105-192552/npm-test.log`; relatório completo na especificação.
Evidências anteriores preservadas e verificadas
em `tmp/lab2c5a-global-20261105-192552/evidencias-anteriores/`, manifesto `preservacao.json` na rodada.
Contagens/bytes reconferidos após a global; novos 29 PNGs e nove vínculos preservados.
LAB.2C.5A concluída. Nenhuma próxima etapa iniciada; gatilhos de qualidade preservados.

## LAB.2C.4 — formato executável e validação de backups em memória

`lab-backup.js` constrói/valida/inspeciona `lab-backup-v1`, sem arquivo, aplicação, UI ou IO de
progresso. Capturas autênticas do motor/coordenador geram tokens privados independentes; não
abrem outras atividades nem inventam sessões ausentes. Parser LAB.2A reutilizado com perfil
fechado de 20 entradas/8 MiB UTF-8/16 contêineres/200000 tokens, sem relaxar limites dos pacotes.
Pacotes revalidados individualmente, inclusive trechos originais e digest; identidade repetida
é recusada. Contexto puro mínimo do motor revalida o pacote e delega coerência à LAB.2C.3,
sem aceitar vínculo declarado como capacidade. Pontos históricos e durabilidade da captura
separados; JSON determinístico, prévia sem gabaritos e sem autorização de restauração.
[APIs, limite Unicode e contratos futuros](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#backups-em-memória-implementados-lab2c4).
17 testes puros + 16 Chromium, 33/33 novos e 291/291 no conjunto LAB aprovados; build/formato/
lint/diff aprovados. Global integral aprovada em 05/11/2026: 958/958 Node e 638/638 Playwright
(44,9 minutos Playwright), saída 0, sem falhas/retries/skips/flakies/interrupções/timeouts.
Fontes/artefatos não mudaram durante a execução. Log `tmp/lab2c4-global-20261105-172510/npm-test.log`;
relatório completo na especificação.
Evidências anteriores preservadas e verificadas em
`tmp/lab2c4-global-20261105-172510/evidencias-anteriores/`, manifesto `preservacao.json` na rodada.
Contagens/bytes reconferidos após a global; novos 29 PNGs e nove vínculos preservados.
Testes/políticas anteriores intactos. LAB.2C.4 concluída; LAB.2C.5 não iniciada.

## LAB.2C.3 — captura interna e prévia rigorosa de snapshots

Handle LAB ganhou `exportarSnapshot()` e `validarSnapshot({vinculo,snapshot})`, sem aplicação,
gravação implícita, arquivos ou UI. Corpo v1 fechado nos oito campos do motor; vínculo exato
por pacote/digest/perfil/sessão, sem chaves/copyId. Mesmo avaliador/normalizador estrito,
recusando qualquer reparação externa, preservando pontos históricos após edição e exigindo
correção atual para conclusão. Cópias independentes capturam memória recente durante escrita
pendente/quota/divergência; metadados de durabilidade separados. Revisões oficiais intactas.
Compatibilidade documentada com o motor real: campos até 1.000 unidades UTF-16, em vez dos
160 pontos de código planejados. Captura limitada a 2 MiB; transporte persistente não ampliado.
[Contrato, limites e pendências de backup](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#snapshots-internos-implementados-lab2c3).
28/28 novos testes Chromium e 258/258 no conjunto LAB aprovados; build/formato/lint/diff aprovados.
Global integral aprovada em 05/11/2026: 925/925 Node e 638/638 Playwright (45,7 minutos
Playwright), saída 0, sem falhas/retries/skips/flakies/interrupções/timeouts. Fontes/artefatos
não mudaram durante a execução. Log `tmp/lab2c3-global-20261105-145224/npm-test.log`;
relatório completo na especificação.
Evidências da rodada anterior preservadas e verificadas em
`tmp/lab2c3-global-20261105-145224/evidencias-anteriores/`, manifesto `preservacao.json` na rodada.
Contagens/bytes reconferidos após a global; novos 29 PNGs e nove vínculos preservados.
Testes/políticas anteriores intactos. LAB.2C.3 concluída; próxima etapa não iniciada.

## LAB.2C.2 — execução controlada e progresso assíncrono no motor

O handle LAB abre apenas com instância emitida pelo coordenador, aquisição ativa e seleção
explícita de principal/responsável. Motor/normalizador/navegação existentes, canal LAB opt-in,
confirmação de durabilidade e fechamento que retém memória em falha, sem liberação prematura
do lock. Configuração confiável usa chave gerada pelo coordenador e confere o pacote validado;
sem JSON externo direto, import/catalog/UI ou alteração da persistência oficial.
[API, tratamento de falhas e limites](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#integração-opt-in-implementada-lab2c2).
22/22 testes novos Chromium e 230/230 no conjunto LAB aprovados; build, formato, lint e diff
aprovados. Global integral aprovada em 05/11/2026: 897/897 Node e 638/638 Playwright
(43,6 minutos Playwright), saída 0, sem falhas/retries/skips/flakies/interrupções/timeouts.
Fontes/artefatos não mudaram durante a execução. Log exclusivo em
`tmp/lab2c2-global-20261105-083100/npm-test.log`; relatório completo na especificação.
Evidências da rodada anterior preservadas em
`tmp/lab2c2-global-20261105-083100/evidencias-anteriores/`, com contagens/bytes conferidos e
manifesto `preservacao.json`; contagens/bytes reconferidos após a global. Novos 29 PNGs e nove
vínculos mantidos. Nenhum teste anterior/política alterado. LAB.2C.2 concluída; LAB.2C.3 não iniciada.

## LAB.2C.1 — registros LAB inativos por handle no motor

`QuestionariosRevisoes.registrarLab(construirConfiguracao)` cadastra cópia declarativa
construída por adaptador JS confiável e devolve handle restrito de consulta/liberação.
Propriedade em mapas privados, não no prefixo; colisões recusadas e revogação idempotente,
sem apagar progresso ou tocar na revisão oficial ativa. Abertura LAB bloqueada até LAB.2C.2,
pois durabilidade/normalização assíncronas ainda não estão conectadas ao motor.
[Contrato, limitações e validação](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#ciclo-de-registros-implementado-lab2c1).
23/23 direcionados novos e 208/208 no conjunto LAB aprovados; build/formato/lint/diff aprovados.
Global de 05/11/2026 aprovada: 875/875 Node e 638/638 Playwright, saída 0, 45,9 minutos Playwright,
sem retries/skips/flakies/interrupções/timeouts; relatório completo na especificação.
Evidências anteriores arquivadas sem sobrescrita em
`tmp/lab2c1-global-20261105-065245/evidencias-anteriores/`; manifesto de preservação na mesma rodada.
Contagens/bytes históricos conferidos após a execução; novos 29 PNGs da global também preservados.
Nenhum import, cartão, conteúdo escolar ou interface alterado. LAB.2C.2 não iniciada.

## LAB.2B.3 — durabilidade observável em adaptador exclusivo LAB

`js/lab-progresso.js` transporta snapshots opacos com chave LAB validada, resultado real de
leitura/escrita, preferência pela memória recente e recusa de base persistida divergente.
`lab-coordenador.js` acrescenta abertura de canal por sessão e gate de identidade/posse antes
de cada escrita; encerramento invalida handles e limpa memória. `armazenamento.js` e todas
as assinaturas/retornos legados permanecem intactos. Sem motor, pontuação, backup ou interface.
[Contrato, durabilidade, limites e dependência da LAB.2C](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#durabilidade-implementada-lab2b3).
30/30 novos testes Node/Chromium + 155/155 regressões LAB aprovados; nenhum teste anterior alterado.
Build, formato, lint e diff aprovados em 05/11/2026. Captura de snapshot recente também é
preservada quando chega durante outra operação pendente; não há retentativa automática.
Global não acionada: apenas adaptador/coordenador LAB isolados, sem alteração compartilhada no
aplicativo; futura integração conserva os gatilhos. Evidências/vínculos preservados e próxima
etapa não iniciada.

## LAB.2B.2 — coordenador isolado de sessões e Web Locks

`js/lab-coordenador.js` prepara sessão, exige consentimento explícito para memória temporária,
consulta pacotes existentes e mantém exclusividade por atividade/copyId via Web Locks.
Suspensão por perda de identidade/capacidade, encerramento idempotente e invalidação de
callbacks tardios; sem integração, escrita persistente, progresso, backup ou interface.
[API, estados, limites e política de validação](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#coordenador-implementado-lab2b2).
26/26 testes novos (Node + Chromium com Web Locks reais), mais 129/129 regressões LAB anteriores.
Build, formato, lint e diff aprovados em 05/11/2026; nenhuma fonte oficial ou módulo LAB anterior alterado.
Global não acionada por este módulo isolado de consultas, sem mudança de persistência existente
ou superfícies compartilhadas; futura integração conserva os gatilhos. Evidências e vínculos
anteriores preservados. Próximo incremento não iniciado.

## LAB.2B.1 — identidade e persistência isoladas de pacotes

`js/lab-identidade.js` consulta a identidade local; `js/lab-repositorio.js` cadastra, consulta
e lista pacotes LAB.2A em IndexedDB por cópia, com transação de conteúdo/metadados,
idempotência e recusas sem sobrescrita. Sem integração ao app, motor, progresso, Web Locks,
backup ou manutenção administrativa. API/limites em
[Laboratório](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#incremento-implementado-lab2b1).
Direcionados: 31 novos com IndexedDB real no Chromium + 98 LAB.2A aprovados.
Global de 05/11/2026: 796/796 Node e 638/638 Playwright, saída 0, 45,8 minutos Playwright,
sem retries/skips/flakies. Build, formato, lint e diff aprovados; fontes oficiais e bundle
PDF.js rastreado sem diferenças; app.bundle ignorado regenerado pelo build oficial.
Falha inicial de resolução das dependências Vite corrigida apenas por vínculos locais adicionais,
sem alterar os quatro anteriores nem testes/código. Logs, perfis sintéticos e 29 PNGs em
`output/` preservados, sem limpeza ou publicação. Evidências e limites na especificação.
Na entrega LAB.2B.1, LAB.2B.2 ainda não havia sido iniciada.

## LAB.2A — validador isolado de pacotes JSON

`js/lab-validador.js` implementa validação/normalização de `lab-questionarios-v1`, limites,
duplicatas, representação canônica e SHA-256, sem dependências novas ou integração ao aplicativo.
98/98 testes Node direcionados, build, formato, lint e diff aprovados; bundles sem diferenças.
O Laboratório completo permanece planejado. API, vetores, limitações e verificação em
[LABORATORIO_ATIVIDADES_AVULSAS.md](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md#implementação-isolada-lab2a).
LAB.2B não iniciada; revisões oficiais, armazenamento, catálogo e ORG inalterados.

## LAB.1 — contrato do Laboratório de Atividades Avulsas (planejado)

[Especificação técnica](infraestrutura/LABORATORIO_ATIVIDADES_AVULSAS.md) de `lab-questionarios-v1`,
registro temporário no motor existente, identidade por cópia, armazenamento, ciclo de vida,
backup e testes. **Planejada, ainda não implementada**: etapa exclusivamente documental,
sem carregador, interface, pacote real, mudança de código ou execução de testes. Próxima
etapa proposta: LAB.2A, somente mediante autorização própria. Catálogo oficial, ORG e
contratos de adição integrada permanecem inalterados.

## ORG.9B — primeira avaliação observacional do par físico do reporter

Avaliador opt-in de três arquivos explicitamente selecionados no perímetro experimental,
com inventário ORG.4D/adaptador ORG.6A preservados, aquisição limitada, identidade BigInt,
revalidação, comparação de bytes/JSON e procedências separadas. Não altera o reporter,
classificador sintético, aplicativo ou contratos anteriores. Consumidores externos e
dispensabilidade permanecem desconhecidos; espaço recuperável é null e autorização none.
Par experimental observado: 316 bytes em cada arquivo, conteúdo igual, sem repetir A/B.
Critérios, limites e testes em [Avaliação do par do reporter](../../validacao/AVALIACAO_PAR_REPORTER.md).
Validação final: 15/15 testes novos, global 648/648 Node e 638/638 Playwright (45,6 min),
exit 0; build, formato, lint e diff aprovados. Experimento preservado por identidade,
metadados e hashes após a global. Nenhuma autorização de limpeza/publicação.

## ORG.9A — consolidação técnica e preparação da entrega Git

Revisão delimitada da cadeia ORG.4D–ORG.8C, contratos, isolamento e autorizações,
reutilizando hashes e resultados ORG.8C: 633/633 Node, 638/638 Playwright e 225/225
direcionados. Nenhum código/contrato/teste alterado e nenhuma nova global ou operação
física executada. Lista explícita de 31 arquivos para futuro commit, separando fontes,
schemas, fixtures/testes e documentação de logs/traces/recursos locais. Os 29 PNGs
não rastreados em output ficam fora do lote; não há ignore geral dessa pasta.
Validação humana da CLI ainda pendente; limites de concorrência, plataforma e perda
da âncora mantidos. Sem staging, commit, PR ou publicação. Revisão, inventário preciso,
roteiro manual e proposta de estudo somente de leitura de `run.json.tmp` em
[Consolidação ORG](../../validacao/CONSOLIDACAO_ORG.md).

## ORG.8C — fluxo local mínimo de recuperação assistida

CLI opt-in com terminal interativo: inicia um cenário sintético novo, exige seleção
explícita do recurso e confirmação específica com desafio da seleção atual. Reutiliza
`identifyRecovery`, `authorizeRecovery` e `restoreAfterExit`, sem alterar executores
ou autorizações ORG.8B. Cancelamento não move o arquivo; pipe, respostas ausentes,
antecipadas/genéricas e replay não aprovam restauração. Resultado distingue restauração
verificada de posição observada após falha parcial. Âncora perdida bloqueia; sem adoção,
limpeza real, descoberta ou serviço residente. Contratos ORG.6B/ORG.7 mantêm `none`.
Uso, testes, limite de confirmação por terminal e próximo marco em
[Recuperação assistida](../../validacao/RECUPERACAO_ASSISTIDA.md#org8c--fluxo-local-mínimo-de-seleção-e-confirmação).
Build, formatação, lint, sintaxe Python e diff aprovados; 225/225 direcionados, com
35 novos. Correção de confirmação antecipada parcial preservou a asserção e os
executores; ocorrência documentada. Global: 633/633 Node e 638/638 Playwright
(45,5 min), exit code 0, sem retries/skips; snapshot estável e evidências preservadas.
Sem comprovação de uso humano real. Ciclo sintético de implementação encerrado;
próximo marco: consolidação/revisão e primeira classe real restrita somente em
leitura, sem criar ORG.8D ou autorizar integração Git/publicação.

## ORG.8B — recuperação assistida com âncora viva independente

Fábrica opt-in no harness físico existente: processo âncora cria e retém os handles
e recibo em memória, independentemente do executor de renomeação. Após morte efetiva
do executor, revalida o cenário e exige seleção explícita e autorização nova de uso
único para restaurar no mesmo recipiente, sem sobrescrita. Contratos ORG.5A–ORG.7
inalterados; `cleanupAuthorization=none` continua sem conceder permissão física.
Se a âncora também morrer, bloqueia: não importa/adota diretórios por recibo,
journal, marcador, UUID ou digest. Não recupera após fechamento de todos os processos
ou reinício da máquina. Somente novos cenários sintéticos Windows 64 bits/NTFS local.
Condições, testes e limitações em
[Recuperação assistida](../../validacao/RECUPERACAO_ASSISTIDA.md).
Build, formatação, lint, sintaxe Python e diff aprovados; 190/190 direcionados,
incluindo 29 novos. Global integral: 598/598 Node e 638/638 Playwright (45,5 min),
exit code 0. Snapshot estável durante a execução, artefatos próprios e nenhum
skip/retry. Hashes dos contratos, backend nativo e trace histórico preservados.

## ORG.8A — primeiro piloto físico reversível, somente fixtures próprias

Harness Node + backend Python/ctypes para Windows 64 bits e NTFS local. Cria perímetro
novo exclusivo, retém handles e IDs exatos, verifica conteúdo/digest/tamanho e duas
regenerações físicas. Reutiliza ORG.4D–ORG.7, exige simulação e autorização explícita
limitada à sessão. Quarentena e restauração por **renomeação dentro do mesmo recipiente**,
sem sobrescrita; movimento entre diretórios bloqueado para manter as travas. Journal
de intenções/verificações e reconciliação com sessão viva; sessão perdida não é adotada
por marcador. Não há exclusão permanente, limpeza genérica ou ação sobre preexistentes.
Limitação local: criação real de symlink de arquivo recusada pelo SO, explicitamente
registrada; junction real e guard de reparse testados. Condições, testes e próximo
incremento em [Harness físico](../../validacao/HARNESS_FISICO.md).
Validação: build, formato, lint, sintaxe Python e diff aprovados; 161/161 direcionados,
incluindo 24 casos do piloto. Global 569/569 Node e 638/638 Playwright (46,1 min),
exit code 0, com artefatos próprios e traces anteriores preservados. A limitação de
symlink de arquivo não foi convertida em alegação de cobertura física real.

## ORG.7 — primeira simulação exclusivamente sintética

`scripts/validacao/simulador-sintetico.cjs` avalia lotes explícitos em memória usando
o classificador ORG.6B inalterado. Relata os quatro resultados, provas/razões/lacunas,
contagens e bytes sintéticos verificados, sem equivalência a espaço recuperável real.
Colisões de identidade/escopo bloqueiam todos os envolvidos; autorização sempre `none`.
Sem IO, relógio atual, persistência, comandos ou planos físicos. Testes reutilizam o
corpus existente, com lotes mistos, duplicações e evidências incompatíveis. Mesma
worktree e lotes anteriores preservados. Contrato e próximo incremento reversível em
[Simulação sintética](../../validacao/SIMULACAO_SINTETICA.md).
Validação final: build, formato, lint e diff aprovados; 137/137 direcionados (47 novos).
Global final: 545/545 Node e 638/638 Playwright (46,0 min), exit code 0. A primeira
rodada parou em 544/545 Node por injeção de inode numericamente inalterado no teste
herdado; manutenção exclusiva da injeção preservou e reforçou as asserções, sem mudar
o leitor. Ocorrência, resultados e preservação de traces registrados no documento.

## ORG.6B — primeiro reconhecedor conservador (03/11/2026)

Reconhecedor puro de `synthetic-counter-v1`, produzido em memória por harness próprio,
com contexto independente, identidade/escopo exatos, receita/digest/tamanho coerentes,
duas regenerações e replay de aquisição/liberação do único consumidor previsto.
Reutiliza envelopes ORG.5A e saída ORG.6A sem alterar contratos. Distingue `recognized`,
`not-recognized`, `indeterminate` e `blocked`, com códigos/justificativas estáveis e
desconhecidos preservados. Não reconhece genericamente arquivos reais ou ignored/tmp,
não implementa simulação e nunca autoriza limpeza. Corpus exclusivamente sintético
em memória; continuidade na mesma worktree, sem nova cópia ou publicação.
Condições, limites e próximo incremento ORG.7 em
[Classificador sintético](../../validacao/CLASSIFICADOR_SINTETICO.md).
Validação: build, formato, lint e diff aprovados; direcionados 90/90 (46 da ORG.6B).
Global final: 498/498 Node e 638/638 Playwright (45,6 min), exit code 0. Primeira
global teve 637/638 e falha no teste legado de callbacks; reteste isolado 1/1 e nova
global integral aprovados sem alterar código/testes. Ocorrência e trace preservados
no relatório vinculado; possível oscilação, sem causa definitivamente comprovada.

## ORG.6A — adaptador puro de evidências do inventário

`scripts/validacao/inventario-evidencias.cjs` conecta o contrato ORG.4D ao envelope
independente v1 da ORG.5A, sem alterar o schema. Recebe relatório, data e IDs opacos
explícitos; preserva procedência, metadados, desconhecidos, recusas e diagnósticos de
inspeções parciais. Não executa IO, Git, relógio atual, persistência ou classificação.
Testes sintéticos cobrem ligação com o coletor, imutabilidade, determinismo e falhas.
A ORG.5A local foi incorporada por patch Git verificado, sem presumir publicação.
Contrato, limitações e próximo passo em
[Integração de evidências](../../validacao/INTEGRACAO_EVIDENCIAS.md).
Validação final: build, formato, lint e diff aprovados; direcionados 44/44;
`npm test` com 452/452 Node e 638/638 Playwright (45,6 min), exit code 0,
porta 5189, identidade confirmada e PDFs sintéticos oficiais.

## ORG.5A — registro privado do ciclo de vida das worktrees (02/11/2026)

Schemas v1 de registro individual e envelope mínimo de evidências, validador semântico
e CLI `scripts/validacao/registro-worktrees.cjs`, exclusivamente de leitura. UUID persistido
no registro; finalidade, tarefa, fase, estado declarado, notas reconciliáveis e referências
opcionais. Diretório central privado externo, sem índice duplicado, alteração de `copyId`
ou do catálogo. Limites de leitura, bloqueio de vínculos, diagnósticos sanitizados e
desconhecidos explícitos; fixtures exclusivamente sintéticas com regressões de integridade
e ausência de escrita. Sem registros reais criados, reconstrução histórica, classificador
ou manutenção. Contrato independente permite início da ORG.6A com observações de recursos,
sem aguardar ORG.5B–5D. Procedimento e limites em
[Registro de worktrees](../../validacao/REGISTRO_WORKTREES.md).
Validação final: build, formato, lint e diff aprovados; `npm test` com 438/438 Node
(17 da ORG.5A) e 638/638 Playwright (46,0 min), porta 5189, identidade confirmada e
PDFs sintéticos. Resultado e limites registrados no documento vinculado.

## ORG.4B — CLI de inventário somente de leitura

`scripts/validacao/inventario-seguro.cjs` inspeciona raiz e recursos explicitamente indicados,
sem recursão, conteúdo privado ou persistência. Informa metadados, HEAD/branch e condição no
índice/ignore, com bloqueio de symlinks/junctions e incertezas explícitas. Não possui operações
de manutenção. Limites, exemplos e testes sintéticos em
[Inventário seguro](../../validacao/INVENTARIO_SEGURO.md). Não altera a proposta ORG v0.1.
Correções ORG.4D preservam nomes NUL, verificam grafias Windows por evidência do filesystem,
recusam formatos de raiz não suportados e distinguem conclusão, resultado parcial e erro fatal
pelos códigos 0/2/1. Sem coleta de conteúdo, consumidores ou estado de alterações da working tree.

## Etapa 3N.6F — documentação do piloto real R1 (29/10/2026)

Consolidado em [Planejador — piloto real R1](../../validacao/PLANEJADOR.md#etapa-3n6f--piloto-real-r1-consolidado-29102026):
Alice, Gramática, “Sinais de pontuação e interpretação de texto”, com 30 questões, seis ditados,
Desktop Amplo e Modo Responsável com progressos independentes. Conclusão das 30 questões por Alice
confirmada pelo responsável. Etapa 3N.3: 130/638 Playwright selecionados e aprovados, 508 omitidos
justificadamente (79,62% menos casos), Node 408/408, sem falhas/retries/skips/fallback.
PR #58 integrada por squash em `ec15ab077968b1c7a57efe603955f8bd2865b1f8`; CI #144/#145 globais
aprovadas na primeira tentativa. A projeção observacional dos opt-ins na CI permanece inconclusiva
pelo aviso de consumidor/âncora não revisado em `app.entry.js`. Fingerprint, tempo externo,
evidências, limites e condições de reutilização constam no registro vinculado. A comparação de
tempos não foi controlada. Consolidação exclusivamente documental R0, sem ampliar elegibilidade,
reatestar identidade ou alterar a obrigação de global nas PRs. Pendências anteriores são históricas.

## Fase 5C.3D — reatestação da infraestrutura (21/10/2026)

Revisão deliberada dos seis deltas de corpus da 5C.3C, com pin anterior reproduzido sobre
`814557e`, registrada em [IDENTIDADE.md](../../validacao/IDENTIDADE.md). Manutenção manual
exclusivamente de `diagnosticAudit.corpusSha256`, sem alterar REVIEWED, produtores, HTTP,
executor, reporter, motores, manifesto ou políticas adicionais. Os oito vínculos fonte/bundle
permanecem e os 29 diagnósticos estão ausentes antes da global, sem cópia entre worktrees.
Congelamento, identidade e resultados da única validação global ficam nas evidências locais
`tmp/validacao/fase5c3d/`, sem antecipar resultado nesta nota anterior à execução.
Adições sucessivas continuam exigindo base consolidada e revisões próprias; piloto real,
commit e publicação não estão autorizados nesta fase.

## Fase 5C.3C — seleção local de adição integrada (21/10/2026)

O planejador pode propor candidato R1 exclusivamente pelo lote integral
`questionarios-adicao-integrada-v3`, com composição, revisão deliberada, identidade utilizável
e validação/descoberta estáveis. Seleciona arquivos completos da spec nova, associações e
representantes obrigatórios; preserva classificações e fallback anteriores.
O registro existente admite a base revisada das quatro integrações por
`questionarios-base-revisada-v1`, sem renovar REVIEWED e mantendo seis consumidores fixos.
Capturas reconhecidas conservam linhas/hashes no delta; somente adições diagnósticas comprovadas
são separadas da prova escolar. Corpus escolar exclusivamente decorrente do lote tem a
exceção local descrita na política temática, com revisão e pin manual ainda obrigatórios.

Executor, reporter, workflow, configuração Playwright, revisões e progresso permanecem intactos.
Fixtures verificam duas adições sucessivas com revisão distinta de base, além de recusas
de evidência/base/alvo/hash/manifesto divergentes, diagnósticos e alterações estruturais.
Nenhuma revisão real foi criada. Revisão deliberada da infraestrutura, manutenção autorizada
de corpus, congelamento e global final permanecem pendentes; não há aprovação do piloto.
Validação desta implementação: 337/337 Node, incluindo 17 regressões novas; build, formato,
lint, manifesto (67 revisões/44 arquivos/590 casos) e diff aprovados. Auditoria read-only sem
achados acionáveis. Evidências locais em `tmp/validacao/fase5c3c/`; identidade real bloqueada
pelo corpus alterado, sem manutenção de pin ou global final.

## PR #52 — correção do harness Node em CI

Executor aceita ambiente na injeção interna de serviços; somente o harness o fornece para
simular execução local. A CLI real conserva o bloqueio CI, coberto também por subprocessos.
Manutenção deliberada exclusiva do pin de corpus registrada em `validacao/IDENTIDADE.md`.
Evidências, congelamento e resultado da global final em `tmp/validacao/fase5c1-ci-fix/`,
sem antecipar aprovação, publicação ou ampliação para novas revisões.

## Fase 5C.2A — consolidação e identidade local

Executor da 5C.1 consolidado localmente em `1efb22b047cc8af741d13cb0975958fca94ec0c7`.
Revisão deliberada do novo corpus e manutenção restrita do pin descritas em
`validacao/IDENTIDADE.md`, sem ampliar o compositor ou alterar revisões escolares.
Hashes, preservação dos 29 diagnósticos e resultados finais do snapshot congelado ficam
em `tmp/validacao/fase5c2a/`; a prévia não substitui a global final. Piloto R1 não iniciado.

## Fase 5C.1 — executor local mínimo

Adaptador opt-in em `scripts/validacao/executor-local.cjs`, pelo comando `npm run test:local`.
Reutiliza `planRepository` e exige política local explícita, candidate R1/R2, identidade estável,
composição não recusada, contratos e igualdade exata dos arquivos/casos descobertos e executados.
Dry-run sem corpos/build; execução explícita com preparação obrigatória, duração real por etapa,
um novo relatório do reporter e resumo sanitizado em `tmp/validacao/`. Fallback indica `npm test`
e retorna saída 2, sem executar global automaticamente nem mascarar falhas seletivas.
CI, classificações e pins permanecem intactos. Os testes sintéticos não comprovam R1/R2 real;
identidade da worktree alterada pode ser bloqueada, e R2 conserva `assets-calculados`.
Contrato, comandos e limites: `validacao/PLANEJADOR.md`. Resultados da validação ficam nas
evidências locais da fase; não há alegação de execução seletiva real nem economia medida.

## 1. Visão geral

O **Revisões Escolares** evoluiu para uma aplicação educacional local com perfis, matérias, revisões versionadas, progresso persistente, áudio, leitura de PDFs, cenas manipulativas e testes automáticos. A estrutura chamada **Ambiente Interativo** está em `ambiente_interativo/` e atende Alice e Mariana sem misturar os dados das duas.

Este inventário preserva o estado de trabalho de **14/10/2026** como registro histórico.
As seções com datas posteriores registram a evolução subsequente, incluindo a consolidação
do piloto real R1 em **29/10/2026**. Leia os registros conforme suas datas, sem interpretar
os estados e as pendências históricos como situação atual.

## Fase 5B.3 — revisão e validação final controlada (19/10/2026)

Revisão deliberada dos consumidores e deltas PDF.js/validação concluída; manutenção autorizada
somente do pin de corpus, conforme [IDENTIDADE.md](../../validacao/IDENTIDADE.md).
Pins dos produtores/HTTP/REVIEWED, riscos e execução obrigatória global preservados.
Resultados do gate posterior, snapshot estabilizado, global e confronto local serão registrados
em `tmp/validacao/fase5b3/`, sem atribuir aprovação antecipada a esta nota pré-execução.
O guard de composição continua exigindo delta de política restrito ao pin; o lote de novos
rootInputs pode impedir plano comparável contra a base, conforme [PLANEJADOR.md](../../validacao/PLANEJADOR.md).

## Fases 5B.1/5B.2 — identidade e diagnósticos observacionais (19/10/2026)

Dez recursos PDF.js (quatro WASM/seis licenças) recebem tratamento explícito de entrada,
sem extensão genérica. Compatibilidade Git distingue incompletude, divergência de bytes e
materialização incompatível. O comparador separa procedência Git de identidade utilizável;
retornos antecipados preservam descritores disponíveis do manifesto. Inventário indisponível
produz contagens/omissões `null`, sem falsa economia ou acusação de global parcial. O adaptador
registra etapas e códigos seguros, sem mensagens/stacks de exceções.

Regressões direcionadas cobrem os dez recursos, alteração/remoção, recursos desconhecidos,
recusas Git, manifesto, inventário, procedência e privacidade dos erros. Riscos R1–R4, fallback,
execução global e isolamento do progresso permanecem vigentes. Nenhum pin foi renovado;
reatestação deliberada e global do snapshot final ficam pendentes para a Fase 5B.3.
Contrato/superfícies em [IDENTIDADE.md](../../validacao/IDENTIDADE.md) e
[PLANEJADOR.md](../../validacao/PLANEJADOR.md). Não há aprovação final ou publicação nesta etapa.

Validação intermediária: **225/225 Node** nos seis arquivos de identidade, planejador,
atestação textual, composição, adição e coleta; controle final de procedência **1/1** após
ajuste de descritor indisponível; PDF.js offline **12/12**, em porta de teste isolada.
Manifesto: **67 revisões / 44 arquivos / 590 casos**. Captura real reconhece os dez recursos
como entradas presentes e conserva exatamente 29 diagnósticos desconhecidos por corpus obsoleto.
Pins intactos; nenhuma global foi executada nesta rodada.

## Etapa 4.3A.4-M — Manutenção corretiva (17/10/2026)

Contrato de adição integrada v3 exige `pergunta` nos campos e `bloco` em cada questão, conforme
o motor existente, e recusa `antes`/`depois` não renderizados. Controles Node estruturais e Chromium verificam contexto,
nome acessível e recuperação, sem adicionar revisão escolar ou alterar o motor. Base sem manifesto
recebe recusa explícita; a fixture CLI histórica é isolada de adições pendentes na worktree,
conservando fallback global e controles negativos. Detalhes em
[ADICAO_INTEGRADA.md](../../validacao/ADICAO_INTEGRADA.md). Corpus alterado; pins/REVIEWED intactos,
reatestação, global integral e consolidação pendentes de autorização. Experimento de Mariana
preservado e sem retomada. A correção final autorizada exige etiqueta `bloco` literal não vazia,
sem preenchimento automático, e testa sua renderização junto de título, instrução e pergunta.
Evidências v1/v2 permanecem históricas; os testes direcionados não certificam o piloto ou a global.

## Etapa 4.3A.4-P — Manutenção preparatória (16/10/2026)

Rodada final posterior: sete deltas e consumidores revistos, dois pins HTTP/corpus mantidos
deliberadamente conforme [IDENTIDADE.md](../../validacao/IDENTIDADE.md). Uma única global do
novo snapshot foi autorizada, após gate e congelamento. Evidências, resultado efetivo e
estabilidade ficam em `tmp/validacao/etapa43a4p-pins-final-Sek0ch/`; não há aprovação antecipada,
consolidação Git ou experimento escolar nesta anotação.

A global posterior à reatestação executou os 571 casos: 220 aprovados e 351 falhas, sem retries,
skips ou interrupções, com identidade estável e 29 diagnósticos presentes. O bloqueador comum
demonstrado foi o HTTP 403 do runtime Vite. A correção controlada posterior usa o comprimento
de `'/@fs/'` e recompõe a barra POSIX quando necessário; acrescenta seis controles Node de
caminhos/HTTP real, preservando as regras de acesso. O pin HTTP e o corpus permanecem obsoletos,
sem reatestação ou nova global nesta rodada. Contrato e pendências em
[TESTES_E_VALIDACAO_REAL.md](infraestrutura/TESTES_E_VALIDACAO_REAL.md) e
[IDENTIDADE.md](../../validacao/IDENTIDADE.md); evidência local em
`tmp/validacao/etapa43a4p-http403-7zSKJN/`. Consolidação e experimento seguem pendentes.

Dois bloqueadores corrigidos exclusivamente na infraestrutura de testes: contrato central de
registro baseado em manifesto validado/referência histórica imutável e fixture de adição baseada
em snapshot JSON versionado, independente das integrações da checkout e da presença de histórico Git.
As onze entradas preservam os bytes da referência original `4d769c2`, com hashes individuais e
selo fixo de integridade. Trinta e um controles Node sintéticos cobrem preservação das 66 revisões,
adição coerente, substituição/remoção, duplicatas, portabilidade sem objetos emprestados,
adulteração do snapshot, coletor real incompatível e recusas nas dez superfícies REVIEWED.
Na preparação, nenhum conteúdo escolar, manifesto, política 1.1.0, pin ou hash REVIEWED foi alterado.
R1/R2, composição, reporter, comparador, workflow e execução global permanecem vigentes.
Os quatro deltas de código e o novo snapshot JSON alteram o corpus. A reatestação deliberada
posteriormente autorizada revisou os cinco leitores/entradas, reproduziu o corpus anterior e
manteve exclusivamente seu campo de pin, conforme [IDENTIDADE.md](../../validacao/IDENTIDADE.md).
Resultado da única global autorizada e identidade do snapshot congelado são registrados em
`tmp/validacao/etapa43a4p-final-tHzG96/`, sem aprovação antecipada. Relatório e procedimento em
[MANUTENCAO_PREPARATORIA.md](../../validacao/MANUTENCAO_PREPARATORIA.md).
Sem experimento 4.3A.4, revisão real, seleção executável ou consolidação Git nesta etapa.

## Etapa 4.3A.3 — Composição auditável de adição e atestação (16/10/2026)

Extensão [adicao-atestacao-composta-v1](../../validacao/COMPOSICAO_ATESTACAO.md), com verificação
separada da estrutura, manutenção deliberada do único campo de corpus e identidade/procedência
do mesmo snapshot. Registro explícito local e complementar; não há renovação automática de pin
nem autorização de seleção. Base Git deve conter a infraestrutura; dez `REVIEWED` continuam
fixos. Guards preservam recusa antes de VM/discovery. Testes são sintéticos, sem revisão real.
Política 1.1.0, reporter/comparador e CI obrigatória preservados. A manutenção deliberada dos
29 diagnósticos foi autorizada separadamente, após revisão dos oito deltas acumulados do corpus.
Procedimento em `validacao/IDENTIDADE.md`; identidade e resultado da global final ficam na
evidência local `tmp/validacao/etapa43a3-final/`. Consolidação Git e 4.3A.4 não integram esta etapa.

## Etapa 4.3A.2 — Prova observacional de adição integrada (16/10/2026)

Infraestrutura complementar `questionarios-adicao-integrada-v1`, descrita em
[Adição integrada](../../validacao/ADICAO_INTEGRADA.md): um lote estático Questionários para
Alice ou Mariana, com opções/campos e integrações restritas por AST/HTML. Candidato inválido é
recusado antes de VM/discovery. CLI e adaptador observacional emitem `adicao-integrada.json`,
separando estrutura, identidade e evidência de execução. Cobertura declarada não comprova função
ou pedagogia. Testes Node usam fixtures sintéticas, inclusive Git/CLI isolados; nenhuma revisão
real foi criada como experimento. R1/R2, riscos, identidade, reporter, comparador, workflow e
suíte global obrigatória permanecem preservados. Resultados do snapshot final ficam nas evidências
locais do lote; esta entrada não declara uso infantil nem economia de tempo comprovada.

## Etapa 4.1C — Atestação textual restrita (15/10/2026)

Política de identidade 1.1.0, formato 2, integrada ao capturador/planejador/reporter existentes.
Somente literais `questoes[*].dica` de payloads Questionários inteiramente estáticos podem
conservar a atestação dos 29 diagnósticos. A prova exige registro/ID/perfil/chave, AST completa
fonte/bundle igual, ausência de ambiguidade e corpus restante em bytes exatos. A base reconhece
sete configurações/190 dicas; isso não é uma exceção por nome ou perfil. Fingerprints brutos
sempre mudam com o texto. Novos consumidores, build divergente e mudanças protegidas revogam
a atestação. Comparação exige procedência e global completa do mesmo conteúdo. Contrato e
migração em [validacao/IDENTIDADE.md](../../validacao/IDENTIDADE.md).

Implementação R4: validações e digests finais são registrados na evidência local do snapshot
congelado. A execução continua global; nenhum suporte R2 ou CI seletiva foi acrescentado.

## Etapa 3 — Integração observacional à CI (15/10/2026)

O workflow mantém `npm test` integral e acrescenta planejamento após build/preparo sintético,
com confronto `always()` usando o relatório real único. PR compara base efetiva e commit integrado;
push main compara before/after. Refs inválidas, A3/identidade incompleta e resultados incompletos
ficam inconclusivos, sem projeção. Resumo do job e índice estruturado reutilizam os artefatos
de 14 dias. Sem seleção, novo planejador, mudança de check ou configuração Playwright.
Nove testes novos reutilizam fixtures R1/R2/global: Node passa a 64 casos; catálogo permanece
66 revisões, 42 arquivos e 571 casos Playwright. Contagens futuras continuam verificadas pelo
manifesto. Contrato, exemplos e limites em [validacao/PLANEJADOR.md](../../validacao/PLANEJADOR.md).
A1 e a necessidade de reatestação deliberada permanecem em `validacao/IDENTIDADE.md`.
Integração local em revisão; validação remota Ubuntu depende de futura PR autorizada.

A correção P1 separa compatibilidade de materialização e identidades brutas: `.bat` LF no Git
pode corresponder a CRLF na checkout somente com atributos Git e locais comprovadamente coerentes,
sem filtros ou outras transformações. Diferenças de conteúdo, binários e atributos incertos
continuam rejeitados. Testes positivos de PR integrada/push agora usam Git e `refIdentity` reais,
plano válido e comparação com global sintética completa; não autorizam seleção. Reatestação e
limites Windows/Ubuntu em `validacao/IDENTIDADE.md`; resultados locais registrados separadamente.

## Correção de checkout da CI — PR #44

`actions/checkout@v6` passa a usar `fetch-depth: 0` para disponibilizar a base Git histórica
exigida pelo teste CLI. A CI #110 parou em 54/55 Node, antes de build/Playwright; a nova
execução remota permanece pendente nesta anotação. Referência e asserções preservadas,
com reatestação restrita ao delta de workflow documentada em `validacao/IDENTIDADE.md`.
Global obrigatória, check, worker, retries, timeouts, A1/A3 e PR Draft preservados.

## Correção A2 — Descritores do manifesto no comparador

O comparador exige descritores presentes e válidos no plano e no relatório: schema 1, versão
numérica e SHA-256, com versão/fingerprint iguais. Ausência unilateral ou bilateral, nulidade,
formato inválido e divergência impedem conclusão e projeção; a decisão é a mesma exposta em
`identity.manifestCompatible`. Cobertura unitária em `tests/validacao/planejador.unit.cjs`;
a fixture de identidade usa o descritor completo. Contrato em
[validacao/PLANEJADOR.md](../../validacao/PLANEJADOR.md). A1/A3 e execução global preservados.

## Etapa 2.1 — Identidade das entradas e artefatos

Infraestrutura compartilhada em `scripts/validacao/identidade.cjs`, política 1.0.0 e formato 2
para novos planos/relatórios/comparações. Assets públicos são entradas em bytes; os 29 screenshots
têm evidência exata de produtor/bloqueio/corpus revisado. Desconhecidos bloqueiam comparação;
legados continuam imutáveis e inconclusivos quanto à identidade não capturada.
Detalhes e manutenção em [validacao/IDENTIDADE.md](../../validacao/IDENTIDADE.md).
Validação final: **52/52 Node**, manifesto **66/42/571**, build, formatação, lint e diff aprovados;
harnesses Windows **24/24** e **8/8**, abertura/identidade **2/2**. Nova global: **571/571 em
40,7 minutos**, exit code 0, sem falhas, retries, flakiness, skips ou interrupções.
Novo plano mantém **57 caminhos, 571 propostos e zero omitidos**. Comparação formato 2
**concluída**, sem caminhos desconhecidos: entradas/política/manifesto compatíveis e estáveis.
Identidade testada: **751 entradas**, incluindo **477 assets**, todos os **225 assets do manifesto**,
mais **29 diagnósticos** separados. Soma de tentativas: **2.396.444 ms**, redução projetada **0%**;
tempo seletivo não estimado. Os 42 relatórios anteriores, base histórica e 29 capturas/backups
continuam intactos. Relatório novo: `2026-10-15T02-55-01-261Z-dad13733-a45f-4f70-b5a8-c4a242b51829`.
O registro destes resultados na documentação é posterior à coleta e não foi atribuído à identidade
testada. Nenhuma mudança de política de execução ou publicação.

## Etapa 2 — Planejador observacional de testes

Implementação local preservando a Etapa 1/correções, manifesto 1.1.0 e base histórica imutável.
[Entradas, regras e limites](../../validacao/PLANEJADOR.md): diff explícito refs/base-worktree,
prova AST restrita para R1, SVG fechado para R2, consumidores/dependentes e contratos por motor.
Arquivos inteiros, identidades lógicas e fallback global para R3/R4, desconhecidos e lacunas.
Comparador separa identidade/completude, falhas omitidas e projeção condicional de tentativas.
Comandos locais `planejar:testes`, `test:planejador` e `comparar:plano`; nenhuma execução seletiva,
redução, mudança do check obrigatório ou integração observacional nova na CI.
Validação final em 14/10/2026: **40/40 Node** (19 do planejador), manifesto **66/42/571**,
build, format:check, lint e diff aprovados; abertura **2/2**, Windows **24/24 + 8/8**.
Nova global: **571/571 em 40,7 minutos**, exit code 0, sem falhas, flakiness, retries, skips,
interrupções ou timeouts; fontes estáveis durante a rodada. Plano real: **53 arquivos,
571 propostos, zero omitidos**. Fontes/manifesto compatíveis na comparação com a global; resultado
inconclusivo para identidade integral por 29 PNGs de output fora do fingerprint, sem projeção
real de custo. Fixtures R1/R2: 6/7; fallback: 7/7; projeção sintética 60/70 ms de tentativas.
Auditoria read-only concluída após correção dos contadores do comparador. Após a global,
somente este registro documental foi atualizado na worktree; código e manifesto testados
permanecem iguais. Nenhuma execução seletiva, publicação ou validação remota alegada.

## Etapa 1 — Manifesto e métricas de validação

Implementação isolada sobre `14584b2fee618fc900bb3d5657b9cfa16482bf33`.
[Manifesto e manutenção](../../validacao/README.md): 66 revisões, oito motores efetivos,
42 arquivos Playwright e 571 casos preservados. Schema fechado, referência independente
congelada de IDs/chaves, verificação de consumidores/fontes/casos e lacunas explícitas.
Reporter adicional sanitizado retém sucesso/falha e distingue execução direcionada, tentativas,
checkout modificada e base Git. CI preserva global/check obrigatório e diagnósticos; retenção
estruturada adicional de 14 dias. Sem alteração de conteúdo, chaves ou interface infantil.
Validação local em 14/10/2026: manifesto 66/42/571 aprovado; testes Node 13/13;
abertura/identidade 2/2; build, format:check, lint e diff aprovados. Global completa: **571/571
em 41,9 minutos**, sem falhas, retries, skips ou interrupções. Relatório estruturado completo,
571 tentativas/casos associados, checkout modificada identificada e fontes estáveis durante
a rodada. Sucesso, falha sintética isolada e invocação direcionada verificados. Sem dados
privados exportados; não houve execução de CI remota ou validação humana inferida.
Após a rodada, somente este registro documental de resultados foi atualizado.
Sem seletor, redução, cadência nova, certificação ou publicação.

### Correções delimitadas da Etapa 1

Validador agora compara os conjuntos completos de IDs nos dois sentidos e rejeita duplicatas
observadas. A referência histórica continua imutável e obrigatória como subconjunto preservado;
acréscimos atuais coerentes são aceitos. Manifesto 1.1.0 registra expectativas atuais explícitas
por arquivo e totais, separados dos 571 casos históricos. Procedimento e limites de manutenção
estão no README; não há mecanismo de transição para remoções/renomes históricos.

Validação final desta correção em 14/10/2026: testes Node **21/21**, manifesto **66/42/571**,
abertura/identidade **2/2**, build, format:check, lint e diff aprovados. Nova global completa:
**571/571 em 39,8 minutos**, exit code 0, sem falhas, flakiness, retries, skips, interrupções ou
timeouts. Relatório completo, 571 tentativas/casos associados e fontes estáveis durante a rodada.
Base histórica preservada byte a byte e digest semântico congelado. A simulação 67/66 agora
falha; acréscimos sintéticos coerentes passam. Após a global, somente este registro documental
de resultados foi atualizado na worktree. Sem staging, commit ou publicação.

## Etapa 4 — Inglês de Mariana: Transportes (integração local)

Moving Around · Transport & Safety foi transportada seletivamente da implementação original,
sobre a base autorizada `4f447cf1a93c123478783acab0634bc305e7e7e1` (PRs #39, #41 e #42).
Auditoria determinística: **66 cadastros, 66 IDs e 66 chaves únicos**; os 65 objetos anteriores
continuam integralmente idênticos à base. Os registros das etapas anteriores abaixo são históricos.

- ID: `mariana-ingles-means-of-transportation-outubro-2026`.
- Unidade: `means-of-transportation-outubro-2026`, versão 1, exclusiva de Mariana.
- Chave principal: `revisoesEscolares.mariana.ingles.meansOfTransportationOutubro2026.v1`.
- Auxiliar: `revisoesEscolares.responsavel.ingles.marianaMeansOfTransportationOutubro2026.v1`.
- 20 ditados/cartões em três grupos (9/4/7), história em quatro cenas, 25 questões,
  61 subitens, 25 pontos e 46 etapas cadastradas (20 ditados + história + 25 questões).
- 57 SVGs locais, conteúdo, gerador e testes próprios preservados por SHA-256.
- Estudo separado do ditado, escrita obrigatória, pergunta ouvida, estímulos separados em
  Q03/Q07, consolidação EN/PT/EN/PT, edição reversível, Desktop Amplo e Modo Responsável.
- Cinco conversas/dez modelos opcionais já existiam na origem. Preservados pelo controlador
  de pronúncia atual, com consentimento; nenhum microfone ou Azure real acionado.

Conciliados apenas os acréscimos da origem em HTML/CSS, imports, navegação, registro,
`ingles.js`, imagens opcionais de `pronuncia.js` e exposição do comparador de conjuntos.
`ingles-interacoes.js` renderiza/valida subitens; sessões, pontuação, navegação e áudio
continuam nos controladores existentes. `audio.js`, armazenamento, gateway, launcher,
dependências, workers, configuração Playwright e timeout CI de 120 minutos preservados.

Validação final da integração em 14/10/2026: próprios 19 passed (1.3m); regressões iniciais
133/134 (10,1 min), com única falha na asserção nova central (campo elementosExistem
ausente no esperado), corrigida sem alterar aplicação ou reduzir cobertura; reteste
1 passed (3.7s). Suíte global completa: **571 passed (40.0m)**, exit code 0.
Windows: 24/24 de abertura e 8/8 de launcher/pronúncia simulada. Build, format:check,
lint e diff aprovados. Porta 5188, identidade confirmada, um worker e PDFs sintéticos.
Sem Azure real, microfone, staging, commit ou publicação. Audição Windows, duplo clique
humano e uso infantil desta cópia permanecem pendentes.
Pasta habitual, origem e stash preservados; sem push, PR ou merge.

Correção local após a CI #107 do PR #43 (570/571): o teste dos 20 ditados esgotou
o orçamento total de 30 segundos no item 14. O trace registra 14 áudios/13 escritas e
o clique final interrompido após cerca de 493 ms, sem evidência de instabilidade persistente.
Somente esse teste recebe `test.setTimeout(120_000)`, conforme o percurso de 25 questões.
Os 20 itens, variantes e todas as asserções permanecem intactos. Teste direcionado com
duas execuções: **2/2 (17,0 s)**. Build, formatação, lint e diff aprovados.
A suíte global local de 571/571 acima é o resultado anterior; não foi repetida nesta correção.
Nova CI completa depende de futura autorização de push. Sem staging, commit ou push deste ajuste.

Registro histórico da Etapa 3 — Matemática de Mariana: **65 cadastros, 65 IDs e 65 chaves únicos**,
com os 64 registros anteriores idênticos à main do PR #41. Integração em cópia exclusiva
sobre `a3ed65b248487bc62c4885295b67f45272af50e4`.

Validação desta integração: 48/48 testes próprios (2,9 min); rodada de regressões 261/262 (20,4 min),
com única falha na coleta do teste central recém-ampliado: a asserção exigia totalEtapas, mas
o campo não era projetado. Corrigida somente a coleta, preservando a asserção; reteste 1/1
(3,7 s). Nenhum controlador precisou de correção. Suíte global completa: **552/552 (40.4m)**,
exit code 0, sem falhas, retries ou skips. Windows: 24/24 (17 s); pronúncia simulada: 8/8 (23 s).
Build, format:check, lint e diff aprovados novamente após a correção exclusiva do teste.

Ajuste local após a CI do PR #42 (551/552): o percurso de 30 questões esgotou o limite
de 30 segundos na Q21, após 20 pontos. O trace mostra o clique final cancelado após cerca de
102 ms pelo orçamento total, sem evidência de instabilidade persistente. Somente esse teste
passa a usar `test.setTimeout(180000)`, conforme o percurso equivalente já existente.
As 30 questões, duas conferências por questão e todas as asserções permanecem intactas.
Reteste direcionado: 1/1 (13,7 s); suíte global local não repetida. Nova CI ainda pendente.

Conteúdo e 21 SVGs + README idênticos à origem; teste próprio preservado com o ajuste
individual de timeout documentado acima. As 17 worktrees, os 935 arquivos
pendentes, as branches anteriores e o stash foram preservados por conferência final. Catálogo privado
atualizado somente na pasta habitual, com os 12 registros anteriores intactos. Uso infantil
e duplo clique humano nesta cópia permanecem pendentes. Sem commit ou publicação.

Histórico da Etapa 2 — Matemática de Alice, integração local em 13/10/2026: **64 cadastros**,
com os 63 anteriores preservados.

Validação desta integração: **20 passed (1.4m)** próprios, **177 passed (13.9m)** em regressões
e **504 passed (35.3m)** na suíte global completa, sem falhas, retries ou skips. Build, formatação,
lint e diff aprovados. Windows: **24/24** contratos de abertura e **8/8** cenários simulados
de pronúncia, sem Azure real ou microfone. Playwright usou porta 5188, um worker e identidade
da nova cópia confirmada; leitura usa somente as fixtures PDF sintéticas oficiais.

Os 63 cadastros anteriores, inclusive as quatro revisões do PR #39, permanecem preservados.
O teste central conserva as verificações de unicidade/existência e as quatro asserções do
PR #39, acrescenta a nova revisão e exige 64 cadastros, IDs e chaves únicos. Conteúdo,
22 SVGs e teste próprio conferidos por hash com a fonte preservada. As extensões de
questionários e ditado são opt-in, sem alterações nos padrões das revisões anteriores.

Revisão visual reaproveitou seis folhas de contato e tela móvel Q19 existentes, sem nova
renderização. Conferência estrutural das peças, células, argolas, dinheiro e grade integrou
os testes. Chaves principal e auxiliar mantidas, com erro/correção, restauração, pontuação
única, limpeza seletiva, Modo Responsável, Desktop Amplo, teclado, toque e file:// exercitados.

Validação humana geral das atividades locais informada pelo responsável em 13/10/2026;
audição específica do ditado numérico Q14 permanece sem confirmação. Fontes, worktrees,
stash e pasta habitual preservados. Sem commit ou publicação nesta etapa.

Registro histórico da etapa 1, publicada pelo PR #39:

Integração controlada de Ciências e Geografia em 13/10/2026: quatro revisões existentes
transportadas seletivamente para uma nova cópia sobre a main, com **63 registros**.
Conteúdo, assets, IDs e chaves foram preservados. A validação humana foi confirmada pelo
responsável antes desta etapa; não se infere dela audição específica do Windows ou Azure real.
Resultados históricos nas seções abaixo descrevem as cópias de origem. Validação técnica
desta combinação sobre a main confirmada: build, formatação, lint e diff aprovados;
**79/79 direcionados (6,6 min)**, **73/73 regressões (5,7 min)** e **484 passed (33.8m)**
na suíte global, sem falhas, retries ou skips. Contratos Windows de abertura: **24/24**;
pronúncia simulada: **8/8**, sem Azure real ou microfone. Testes em origem isolada, porta 5189,
com identidade da cópia confirmada; os livros de regressão são fixtures sintéticas originais.

Os 59 cadastros anteriores permanecem idênticos; os quatro novos cartões, IDs e chaves
são exclusivos. Conteúdo, 97 SVGs e quatro testes conferidos por hash com as fontes.
Modo Responsável, Desktop Amplo, teclado/toque, erro/correção, retorno/recarga, limpeza
seletiva e progresso por perfil foram exercitados pelos testes direcionados e regressões.
Controladores, áudio, armazenamento, Vite e launcher da main foram reutilizados sem alteração.
Fontes, alterações locais e stash preservados com backup verificável. A integração está
na cópia exclusiva, sem atualizar a pasta habitual e sem commit ou publicação nesta etapa.

Consolidação local das quatro revisões validadas em uso real: Alice História, Alice Play Time,
Mariana História e Alice At the Farm v2. Catálogo com 59 registros; build, formatação, lint e
diff aprovados. Testes direcionados: **62/62 (4.8m)**; regressões compartilhadas:
**112/112 (8.8m)**; suíte global: **392/392 (28.6m)**. As fontes e o stash original de Farm
permanecem preservados, sem reconstrução de progresso local. Os relatórios pedagógicos
distinguem este resultado dos testes históricos e das validações específicas de voz/Azure.


## Registro histórico da fonte — Alice, Matemática, preparação em 12/10/2026

- ID: alice-matematica-dezenas-numeros-dinheiro-outubro-2026; arquivo específico em
  ambiente_interativo/revisoes/alice/matematica-dezenas-numeros-dinheiro-outubro-2026.js.
- Título: **Dezenas, números e dinheiro — descobertas da Alice**. Cinco blocos,
  25 questões, 55 subitens e 25 pontos; cartão exclusivo em Alice → Matemática.
- Reutiliza QuestionariosRevisoes, seleção/ordenação, armazenamento e áudio existentes.
  Desktop Amplo e Modo Responsável ativados somente nesta revisão; salto não pontua.
- Principal: revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.v1.
  Auxiliar: revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.responsavel.v1.
- 22 SVGs originais, sem materiais escolares privados. Extensões compartilhadas opt-in:
  estímulo oral independente da resposta, rótulos de ditado e cenas responsivas por campo.
- Testes próprios em tests/matematica-alice-dezenas-numeros-dinheiro-outubro-2026.spec.js.
  20/20 testes próprios aprovados (1,4 min); global 424/425 (29,5 min), com única falha na
  contagem antiga do cadastro, corrigida e aprovada no reteste 1/1 (3,3 s). Não houve nova
  execução global integral após esse ajuste exclusivo ao teste. Windows: 24/24 de abertura
  e 8/8 de pronúncia simulada. Build, formatação, lint e diff aprovados; 22 cenas inspecionadas.
  Situação histórica da fonte: implementação isolada, audição e uso infantil pendentes naquela data. Sem integração à pasta habitual
  ou publicação. Evidências em pedagogia/ALICE_MATEMATICA_OUTUBRO_2026.md.


## 2. Base da aplicação

### Navegação e perfis

- Tela inicial com seleção de Alice ou Mariana.
- Painéis de matérias e cartões próprios de cada perfil.
- Breadcrumb, voltar, próxima etapa e retorno à página inicial.
- Cabeçalho com perfil, etapa, pontos ou conquistas.
- Estados “não iniciada”, “em andamento” e “concluída”.
- Limpeza seletiva de uma revisão, sem afetar outras trilhas.
- Registro central que valida IDs, chaves, cartões e painéis duplicados.

### Execução local

- Servidor Vite por `abrir_ambiente_interativo.bat` ou `npm run interativo`. O launcher prepara o
  gateway opcional de pronúncia via Azure CLI, reutiliza `/health` saudável e mantém o ambiente
  principal disponível em caso de falha da CLI, da chave ou do gateway.
- Aplicação principal por `file://` usando bundle clássico gerado.
- Atalho para Chromium do Playwright.
- Recursos locais, sem CDN obrigatória.
- Bundle principal e PDF.js gerados a partir dos módulos-fonte.
- Vite declara PostCSS sem plugins externos, restringe a descoberta aos dois HTMLs da aplicação
  e exclui `tmp`, `output` e `MINHAS_REVISOES_LOCAIS` da observação na raiz efetivamente servida. Fontes e
  recarregamento de desenvolvimento permanecem disponíveis; não houve mudança de launcher/origem.

### Otimização da configuração externa — 09/10/2026

- Configuração compartilhada declara PostCSS sem plugins e restringe descoberta aos dois HTMLs
  funcionais relativos à raiz servida; leitor opcional ausente não amplia a varredura.
- Plugin local captura a raiz final em `configResolved` e exclui somente seus artefatos de
  primeiro nível (`tmp`, `output`, `MINHAS_REVISOES_LOCAIS`) do watcher. Preserva fontes,
  recursos, raízes irmãs, identidade, proteções HTTP, bloco de build, auxiliares e portas.
- Três testes de configuração externa cobrem duas raízes simultâneas, ausência de leitor,
  dependências, CSS e bundle sintético recarregados. Harness Windows estendido para 24 cenários,
  incluindo partidas concorrentes e reutilização. Procedimentos e limites em
  [Testes e validação real](infraestrutura/TESTES_E_VALIDACAO_REAL.md) e
  [Worktrees, catálogo e entrega local](infraestrutura/WORKTREES_CATALOGO_E_ENTREGA_LOCAL.md).
- Instâncias de estudo existentes só carregam a configuração nova após reinício controlado.
  A atualização não migra progresso nem reorganiza o catálogo privado.
- Validação histórica da implementação isolada: build, formatação, lint e diff aprovados; **3/3** contratos novos,
  **24/24** cenários Windows e **404/404** globais em **27,3 min**, sem falhas, retries ou skips.
  Nove raízes/CSS conferidos sem abrir seus servidores. Medição sintética e limites registrados
  no documento de testes. O responsável confirmou posteriormente as entradas 03, 06 e 09 e
  a recusa de outra cópia com 5173 ocupada; etapa humana planejada concluída.
- Integração separada baseada na main do PR #37 preserva sua configuração e contratos; apenas
  a exclusão estática do watcher passa a usar a raiz resolvida. Auxiliares já publicados,
  sem dependências exclusivas da branch antiga. Essa combinação exige validação própria e
  check global do PR; publicar não integra automaticamente a pasta habitual.
- Na base reconciliada: build, formatação do código, lint e diff aprovados; **28/28** testes
  direcionados de Vite/HTTP/PDF, Leitura e armazenamento e **24/24** cenários Windows.
  A suíte global desta combinação é conferida pelo check obrigatório do PR para main.

### Abertura segura de cópias isoladas — 07/10/2026

- Os launchers padrão e Chromium delegam a scripts/abrir-ambiente-local.ps1, com raiz explícita,
  validação de dependências e comparação de identidade antes de preparar pronúncia ou abrir.
  Vite e comandos npm usam 127.0.0.1:5173 com strictPort; não escolhem outra porta.
- Endpoint de desenvolvimento /__revisoes_local__/identity: aplicação, schema 1 e SHA-256 da
  raiz real normalizada. Não expõe caminho, catálogo ou ambiente Azure, não recebe comandos e
  bloqueia catálogo/temporários privados. Outra cópia, resposta inválida ou servidor legado
  ocupando 5173 interrompem a abertura; servidores alheios são preservados.
- A configuração compartilhada permite iniciar cópia antiga selecionada com identidade,
  sem modificar sua worktree. Preparador e gateway Azure de produção permanecem intactos;
  pronúncia opcional sempre usa a raiz escolhida e falha sem bloquear estudo.
- Playwright usa porta 5181, configurável por PLAYWRIGHT_PORT (exceto 5173), strictPort e
  reuseExistingServer:false. Global setup confirma raiz/origem/identidade antes dos testes.
  Três testes de Gramática e os contratos de origem do gateway passaram a usar baseURL.
- Testes Windows: **23/23** de abertura/worktrees e **8/8** de pronúncia simulada aprovados;
  build, formatação, lint e diff aprovados. Os 49 casos direcionados distintos passaram após
  corrigir uma colisão de pasta de traces no teste de porta ocupada; esse teste agora usa
  output isolado. Reexecução do caso afetado, três fluxos file:// e dois casos novos: **6/6**
  na porta 5189; proteção final dos temporários: **2/2** adicionais aprovados.
- Suíte global deste lote: **394/394 aprovados (27,2 min)**, `npm test` com exit code 0,
  na porta 5181 e identidade da manutenção confirmada. A tentativa inicial com PDFs vazios
  de CI foi interrompida; os dez PDFs reais locais foram copiados para arquivos ignorados,
  conferidos por hash e preservados fora do Git antes da execução aprovada.
- Catálogo privado existente: auxiliar de abertura e instruções adaptados localmente;
  pronúncia sem entrada exige escolha/cancelamento explícitos. JSON e 17 atalhos preservados,
  com sete verificações de seleção/delegação aprovadas. Esses arquivos não integram o Git.
- Os dois .bat recusaram o servidor legado real em 5173. A partida real do auxiliar foi
  testada em porta isolada. A pendência de abertura manual foi encerrada por validação humana
  fornecida pelo responsável: ambos os launchers abriram a URL fixa 5173, com perfis e revisões
  carregados, Vite explicitamente em 5173 e nenhuma porta alternativa observada. O responsável
  informou gateway em 5190 e /health com ok:true e configured:true. Não é validação visual
  executada pelo Codex nem evidência de avaliação Azure, microfone, audição ou uso infantil.
- CI Windows permanece pendente; workflow Ubuntu preservado. A interface **Minhas revisões
  locais não está implementada**. Não houve alteração pedagógica, de progresso ou integração.
- O protocolo de [Worktrees, catálogo e entrega local](infraestrutura/WORKTREES_CATALOGO_E_ENTREGA_LOCAL.md)
  e [Testes e validação real](infraestrutura/TESTES_E_VALIDACAO_REAL.md) descrevem o novo fluxo.

### PDFs de teste reproduzíveis — 07/10/2026

- A dependência de dez livros privados foi substituída por fixtures sintéticas originais,
  determinísticas e offline, com 286 páginas A4, texto conhecido e desenho verificável.
  Nenhum conteúdo pedagógico, chave de progresso, atividade ou gateway foi alterado.
- `npm test` prepara automaticamente `tests/fixtures/pdfs/` por `vite.test.config.cjs`.
  CI e Windows usam tamanho/hash, páginas e PDF.js sob o mesmo contrato; o gerador exclusivo
  de páginas vazias foi removido. Os launchers comuns continuam usando livros reais locais.
- As dez cópias privadas temporárias desta manutenção foram removidas após conferência de
  proveniência/hash/ignore. Originais e outras worktrees preservados. A execução global ocorreu
  com zero PDF em `ambiente_interativo/leituras`, sem cópia nem preparo manual de livros.
- Validação: **401/401 PASS, 28,0 minutos, exit 0**; 22 casos direcionados distintos de
  PDF/Leitura/acessibilidade; abertura CJS **23/23**, pronúncia **8/8** e identidade **2/2**.
  Build, formatação, lint, skill e referências aprovados. Os 401 casos são os 394 anteriores
  mais sete regressões novas; os 416 da worktree isolada de Ciências incluíam 22 casos
  específicos dessa revisão, que não integram esta base.
- Contrato em [Testes e validação real](infraestrutura/TESTES_E_VALIDACAO_REAL.md#pdfs-sintéticos-e-preparo-reproduzível)
  e [Leitura e PDF.js](infraestrutura/LEITURA_E_PDF.md). Sem publicação de PDFs, redução de
  cobertura, commit, push, PR ou merge. O workflow foi atualizado; CI remota ainda não executada.

### Interface e acessibilidade

- Layout responsivo para computador e celular.
- Viewport de 390 × 844 sem rolagem horizontal.
- Operação por mouse, toque e teclado.
- Foco visível, rótulos acessíveis, texto alternativo e regiões `aria-live`.
- Barras de progresso acessíveis.
- Respeito a `prefers-reduced-motion`.
- Canvas em alta densidade.
- Auditoria axe-core para violações graves e críticas.

## 3. Infraestrutura compartilhada

### Registros e controladores

- `js/registro-revisoes.js`: catálogo central de revisões e chaves.
- `js/registro-ingles.js`: conteúdo compartilhado da Unidade 3.
- `js/registro-leituras.js`: livros, perguntas, ditados, glossários e metadados.
- `js/app.js` e `js/app.entry.js`: navegação, cartões e composição do bundle.
- `js/armazenamento.js`: persistência segura.
- `js/audio.js`: síntese de voz local bilíngue; cada solicitação usa um único utterance audível
  protegido por prefixo no mesmo payload, inclusive na repetição.
- `js/pronuncia.js`: controlador opt-in de conversa oral, com consentimento, captura PCM em memória,
  WAV de 16 kHz, gateway local, feedback infantil configurável, descarte e falha não bloqueante.
- `js/ingles.js`: motor único de Inglês, incluindo o **Modo Responsável** opt-in com sessões por
  chave, salto administrativo sem fabricar progresso e painel acessível por `Ctrl + Alt + R`.
- `js/gramatica-questionarios.js` e `js/gramatica-ditado.js`: questionários sequenciais de
  Gramática e outras matérias, mapa visual opt-in, Modo Responsável opt-in, imagem por subitem,
  apoio auditivo por lacuna, botão declarativo de
  travessão também em campos sem ditado e feedback opt-in por categoria de erro textual.
- `js/desenho.js`: canvas e persistência de desenho.
- `js/leitura.js`, `js/leitor-dedicado.js` e `js/glossario.js`: biblioteca e leitor.
- `js/matematica.js`, `js/matematica-cena.js` e `js/matematica-manipulaveis.js`: Matemática manipulativa.
- `js/matematica-geometria-medidas.js`: formas originais em CSS, campos com unidade, seleção,
  associação, mosaico, régua, balança, recipientes de capacidade, continhas verticais D–U,
  produtos de mercado e apoios determinísticos de base dez, sequências, vizinhos, ábaco D–U,
  dinheiro, decomposição e reagrupamento dentro do mesmo contrato de Cena Matemática.
- `js/matematica-operacoes.js`: operações digitadas, questões com vários campos e rótulos
  configuráveis, apoio visual opt-in e estudo intermediário de tabuadas configuráveis com
  bloqueio persistente.

### Armazenamento seguro

- Camada compartilhada `ArmazenamentoRevisoes`.
- Chaves independentes por perfil, matéria e revisão.
- Objetos persistidos com versão e normalização.
- Tratamento de JSON corrompido, versão incompatível, etapa inválida e valores fora dos limites.
- Migrações conservadoras e idempotentes.
- Fallback em memória quando `localStorage` é bloqueado.
- Limpeza limitada à revisão ativa; não existe `localStorage.clear()`.
- Restauração de etapa, respostas, pontuação, canvas, página e cenas manipulativas.

## 4. História, Geografia e Ciências

### Alice — Geografia: Brincar, conviver e descobrir lugares — outubro de 2026

- 30 questões em seis blocos de cinco; 58 subitens, 30 pontos e seis ampliações correlatas.
- Conteúdo exclusivo de Alice: tempos, brinquedos, materiais, lugares, lazer e convivência.
- Motor de questionários existente, Desktop Amplo, tentativas e Modo Responsável opt-in.
- Q09: banco e campos; Q10/Q30: ditados; Q13: mapa; Q14: ordenação reversível em um subitem;
  Q26/Q28: mistos. Um ponto só após todos os subitens corretos.
- 14 SVGs originais locais em assets/geografia-brincadeiras-lazer-outubro-2026/.
- CSS restrito aos campos Q30 oferece largura sem impor objetivo ortográfico.
- Rótulos do mapa Q13 são visíveis antes da conferência, com CSS restrito a este croqui.
- Testes: tests/geografia-alice-brincadeiras-lazer-outubro-2026.spec.js, **20/20 aprovados**.
  Regressões de revisões equivalentes e ditado: **36/36**; suíte global: **412/412**.
  Build, formatação, lint e diff aprovados. Uso real e audição da voz instalada pendentes.

ID: alice-geografia-brincadeiras-lazer-outubro-2026.

Chave: revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.v1.

Auxiliar: revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.responsavel.v1.

Conteúdo: ambiente_interativo/revisoes/alice/geografia-brincadeiras-lazer-outubro-2026.js.

Detalhes e resultados:
[Geografia de Alice — outubro de 2026](pedagogia/ALICE_GEOGRAFIA_BRINCADEIRAS_LAZER_OUTUBRO_2026.md).

### Mariana — Geografia: Lugares de viver, cuidar e transformar (outubro de 2026)

- Exclusiva de Mariana, 2º ano, prova 07/10: **30 questões, 75 subitens e 30 pontos**. Apoios
  em todas as telas e seis aberturas; 57 opções, 12 seleções, uma ordenação e cinco ditados.
- Reutiliza questionários, interações mistas, áudio local, validação estrita, tentativas,
  Desktop Amplo e sessões independentes Mariana/Responsável, sem alterar controladores.
- 23 SVGs originais em `assets/geografia-paisagens-outubro/`, com descrições equivalentes.
  CSS restrito à pasta e ao opt-in conserva largura integral das comparações empilhadas.
- Integração em `app.entry.js`, `registro-revisoes.js`, `app.js` e `index.html`; catálogo
  passa de 59 a **60 registros**. A asserção geral do catálogo acompanha a inclusão.
- Validação concluída em **06/10/2026**: build, formatação, lint e diff aprovados; figuras
  inspecionadas e 21 telas verificadas em três viewports. **31/31 testes direcionados (3,1 min)**,
  sendo 17 da nova revisão e 14 das Geografias anteriores; **409/409 na suíte global (30,8 min)**.
  Testes novos: `tests/geografia-mariana-paisagens-outubro-2026.spec.js`.
- A worktree recebeu cópias conferidas dos dez PDFs locais de leitura já existentes, ignorados
  pelo Git, para viabilizar a regressão global. Capturas e logs permanecem locais. Uso real e
  acústica desta revisão ainda não confirmados.
- Detalhes: [Geografia Mariana — paisagens](pedagogia/GEOGRAFIA_MARIANA_PAISAGENS_OUTUBRO_2026.md).

ID: `mariana-geografia-paisagens-qualidade-vida-outubro-2026`.

Chave principal: `revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/geografia-paisagens-qualidade-vida-outubro-2026.js`.

### Alice — Ciências: Objetos, rotina e cuidado com o ambiente (outubro de 2026)

- **30 questões, 60 subitens, 30 pontos**, com um ponto por questão integralmente correta.
  Blocos: objetos (9/17), rotina (8/15), ambiente (10/21), missão final (3/7).
- ID: `alice-ciencias-sustentabilidade-rotina-objetos-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/alice/ciencias-sustentabilidade-rotina-objetos-outubro-2026.js`.
- Chave principal: `revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.v1`.
  Auxiliar: `revisoesEscolares.alice.ciencias.sustentabilidadeRotinaObjetosOutubro2026.responsavel.v1`.
- Reutiliza `QuestionariosRevisoes`/`QuestionariosInteracoes`: mapa, campos, oito seleções,
  quatro sequências e escolhas únicas; Q11 usa um subitem de ordenação em `misto` para preservar
  a contagem aprovada. Nenhum ditado, microfone, payload de áudio ou novo controlador.
- Opt-ins: Desktop Amplo, validação estrita, tentativas e Modo Responsável, com Alice principal
  e Responsável auxiliar. Cartão consulta apenas a principal; chaves antigas preservadas.
- 27 composições SVG originais em `assets/ciencias-sustentabilidade-rotina-objetos-outubro-2026/`.
  CSS próprio mantém imagens verticais e remove o recorte celular somente nessa família.
- Documento pedagógico, conteúdo integral, gabarito e contratos:
  `pedagogia/CIENCIAS_ALICE_SUSTENTABILIDADE_OUTUBRO_2026.md`.
- Teste: `tests/ciencias-alice-sustentabilidade-rotina-objetos-outubro-2026.spec.js`.
  Build, formatação, lint e diff-check aprovados. Matriz direcionada: **24/24**;
  suíte global: **416/416**, em 7 de outubro de 2026, obrigatória pelo CSS/HTML.
  Cobertura: gabarito independente, percurso dos 60 subitens com erro/correção e 30 pontos,
  restauração/edição, campos Q03, conjuntos exatos, sequências reversíveis, sessões/limpeza,
  dados inválidos, armazenamento bloqueado, file://, toque, teclado, axe-core e geometria
  em 390 × 844, 1366 × 768 e 1920 × 1080. Os dez livros originais necessários foram copiados com
  hashes/páginas conferidos e mantidos ignorados; nenhum PDF sintético foi usado.
  Inspeção dos 27 SVGs realizada; screenshots de telas
  representativas nos três viewports gerados e geometria sem overflow horizontal nessas telas.
- Situação: implementação e validação automatizada concluídas em cópia isolada; acesso pelo
  cartão de Alice conferido na origem habitual. Uso real por Alice pendente;
  nenhuma integração à pasta habitual ou publicação.

### Mariana — Investigando o Sol, as sombras e os materiais (outubro de 2026)

- Nova revisão exclusiva do 2º ano: **30 questões, 64 subitens e 30 pontos**, com luz/sombras,
  materiais, calor/água, usos da energia, plantas, rotação e cuidados. A anterior permanece intacta.
- Reutiliza o questionário, interações, ditado, áudio e armazenamento existentes. Desktop Amplo,
  validação estrita, tentativas e Modo Responsável são opt-ins; principal e auxiliar isoladas.
- **33 SVGs originais locais**, incluindo três imagens por subitem na Q05 e apoio do gnômon
  separado. Sequências inteiras usam um único subitem misto; Q10 tem três ditados opcionais e
  escrita flexível; Q20 tem banco sem ditado. Mapa com geometria ajustada ao recorte no celular.
- Validação retomada e concluída: **15/15 cenários novos** e **27 regressões equivalentes**
  aprovados. `npm test`: **415/416 aprovados em 29,8 min**; a contagem fixa antiga do cadastro
  foi atualizada de 59 para 60 e passou no reteste **1/1**, preservando unicidade e elementos.
  Não houve repetição global integral após esse ajuste ao teste. Build, formatação, lint e
  diff aprovados; abertura Windows **23/23** e pronúncia simulada **8/8**. 90 telas renderizadas
  nos três viewports sem overflow. Sem audição humana ou uso infantil.
- Testes: `tests/ciencias-mariana-sol-sombras-materiais-outubro-2026.spec.js`.
- Detalhes e alcance: [registro pedagógico](pedagogia/MARIANA_CIENCIAS_SOL_SOMBRAS_MATERIAIS_OUTUBRO_2026.md).

ID: `mariana-ciencias-sol-sombras-materiais-outubro-2026`.

Principal: `revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.v1`.

Auxiliar: `revisoesEscolares.mariana.ciencias.solSombrasMateriaisOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/ciencias-sol-sombras-materiais-outubro-2026.js`.

Diagnóstico de Q16 em 09/10/2026: três novos testes por mouse, teclado e toque passaram,
cobrindo desmarcar nas duas partes antes/depois de conferir, correção, tentativa incompleta,
avançar/voltar/recarga e pontuação única. A falha relatada não foi reproduzida nessa cópia;
nenhum controlador, conteúdo, chave ou resposta foi alterado. Rodada da unidade: 17/18, com
prazo excedido no percurso de layout 1366; reteste desse caso: 1/1 aprovado, sem alterar prazos
ou asserções. Build, formatação, lint e diff aprovados. Sem nova suíte global, pois o diagnóstico
adicionou apenas testes. Posteriormente, em 09/10/2026, o responsável esclareceu que o erro
original era em Inglês da Mariana e retirou a atribuição a Ciências; os três testes permanecem
como cobertura de regressão, sem indicar uma falha confirmada ou corrigida em Ciências.

### Mariana — História: Uma viagem pelas histórias e memórias (outubro de 2026)

- Revisão nova, exclusiva de Mariana, 2º ano, para a prova de **06/10/2026**; mantém a atividade
  de agosto e todas as suas chaves. São **30 questões numeradas e 30 pontos**: cada questão exige
  todos os seus subitens corretos.
- Seis apoios completos nas aberturas dos blocos: transportes coletivos; terra/água e cuidado; objetos e
  registros; diários/cartas; fotografias; cruzamento de fontes. Contextos, modelos e personagens
  fictícios permanecem na própria atividade. As demais telas usam pistas específicas; Voltar permite
  reler a abertura sem perder os acertos. Pausas, conversa e autoavaliação são opcionais,
  fora da pontuação e sem coleta nova de dados pessoais.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js`,
  `audio.js` e `armazenamento.js`. Alternativas, associações, campos com banco, V/F, seleções,
  ordenações e subitens mistos; nenhuma extensão de controlador ou CSS.
- Desktop amplo, validação estrita de estado, registro de tentativas e Modo Responsável são
  opt-in. Sessões Mariana/Responsável independentes, salto sem pontos e cartão ligado à principal.
  Q26 e Q30 ocupam a largura disponível, sem coluna de leitura vazia; frases de ditado usam campos amplos.
- Q30 contém três frases independentes em um único ponto. Voz local pt-BR a 0,78, prefixo de
  frase protegido, ouvir/repetir/parar e cancelamento ao trocar campo. Não há controle separado
  de velocidade no ditado vigente. Campos toleram caixa, acentos, espaços e pontuação; Q07
  também aceita três/quatro por extenso. Nenhuma resposta de ditado aparece antes da conferência.
- Cenas SVG originais locais em `assets/historia-memorias-outubro/`, com textos alternativos:
  cinco ações em ônibus; três/quatro rodas verificáveis; cinco objetos da sala; seis crianças e
  uma professora; cenas distintas de casamento/praça e grupos diferentes em 1920/2026.
- Integração declarativa: import, registro, cartão HTML e abertura/visibilidade em `app.js`.
- Testes: `tests/historia-mariana-memorias-outubro-2026.spec.js` (20 casos), com gabarito
  independente, subitens incompletos/errados, reversão, recarga, isolamento, sessões, áudio,
  armazenamento adverso, teclado/toque, três viewports, axe-core, console e `file://` sem rede.
- Validação automatizada em **05/10/2026**: `npm run build`, `npm run format:check` e
  `npm run lint` aprovados; **69 regressões direcionadas aprovadas** (História de outubro e
  agosto de Mariana, História de Alice e Gramática de outubro de Mariana); suíte global
  `npm test` com **350 testes aprovados**.
- Uso real validado em outubro de 2026. Clareza, fluxo e execução foram confirmados pelo
  responsável; não há confirmação separada da acústica da voz instalada.

ID: `mariana-historia-transportes-memorias-outubro-2026`.

Chave principal: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/historia-transportes-memorias-outubro-2026.js`.

Abrir `ambiente_interativo/index.html`, escolher **Mariana** e o cartão **Uma viagem pelas
histórias e memórias**. `Ctrl + Alt + R` abre o painel apenas fora dos campos editáveis.


### Alice — História: Objetos e histórias — Uma investigação da Alice (outubro de 2026)

- Revisão exclusiva do **1º ano com ampliação gradual**, com **30 questões, 65 subitens,
  30 etapas avaliativas e 30 pontos**, em seis blocos de cinco questões. Preserva a revisão
  de famílias/objetos e seu progresso. Apoios e conversa opcional não criam pontos ou etapas.
- Todas as telas têm “Leia para aprender”, tarefa, dica e consolidação. Memórias e usos,
  fases da vida, diferentes povos no presente, materiais, antigo/atual com contexto,
  mudanças/permanências, papel/digital, fontes, agenda, museu e exposição.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js`,
  `audio.js` e `armazenamento.js`, sem extensão de controlador ou CSS. Integração declarativa
  por import, registro, cartão exclusivo e listener com proteção do perfil Alice.
- Desktop amplo, validação estrita de estado, tentativas e Modo Responsável são opt-in.
  Sessões Alice/Responsável independentes; salto puro, status principal e limpeza da chave ativa.
- Ditados Q05 (duas palavras), Q15 (uma frase) e Q30 (duas frases), em pt-BR local, rate 0,78,
  pitch 1, prefixo protegido no mesmo utterance, repetir/parar e cancelamento por campo/tela.
  Escrita tolera caixa, acentos, espaços e pontuação sem aceitar sequência livre de palavras.
  Não há alvo anunciado antes da conferência ou preenchimento automático. Sem voz, o responsável
  pode ler o gabarito editorial; os campos continuam operáveis.
- **13 SVGs originais locais**, com descrições equivalentes, usados em 17 telas. Incluem
  duas crianças/uma bola, galeria didática, comparação contextual de televisores, anúncio
  fictício de fogão, agenda de sete dias e pião com ficha. Os anexos privados de História
  não foram reabertos nem copiados para os ativos. Apoios textuais mantêm a atividade autossuficiente.
- `tests/historia-alice-objetos-memorias-outubro-2026.spec.js`: **20 casos direcionados aprovados**,
  com gabarito independente e percurso completo, 30 pontos, erro/correção/recarga, seleção e
  ordenação reversíveis, escrita flexível, três ditados, sessões, isolamento, limpeza seletiva,
  JSON impossível/inválido, fallback, teclado/toque, 1366 × 768, 1920 × 1080, 390 × 844,
  axe-core, console e `file://` sem rede. Uso real validado em outubro de 2026. Não há confirmação separada da acústica da voz instalada.
- Cadastro central consolidado: **59 revisões**; as três contagens do teste central foram atualizadas
  para incluir as três revisões novas do lote, mantendo unicidade de IDs/chaves e existência dos elementos.
- Validação local concluída em 05/10/2026: build, formatação, lint, `git diff --check`,
  **20 testes direcionados**, **11 regressões de cadastro/Leitura** e **350 testes na suíte
  global (`npm test`, 23,9 minutos, exit 0)**. Uso real validado em outubro de 2026. A preparação
  dos PDFs de Leitura ocorreu somente em caminhos ignorados, com os originais preservados.

ID: `alice-historia-objetos-memorias-outubro-2026`.

Chave principal: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.responsavel.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/historia-objetos-memorias-outubro-2026.js`.

Gabarito e uso acompanhado: [documento pedagógico](pedagogia/ALICE_HISTORIA_OBJETOS_MEMORIAS_OUTUBRO_2026.md).


### Alice — História: Famílias e objetos: ontem e hoje

- Revisão exclusiva do 1º ano com **20 questões numeradas e 20 pontos**, baseada na síntese das
  páginas 66–90, com ênfase reforçada nas páginas 70–75. Os dois PDFs privados não foram abertos,
  renderizados, extraídos nem submetidos a OCR nesta implementação.
- Diversidade familiar, parentesco fictício, rotinas, quantidade de crianças, fotografias e
  entrevista como fontes, mudanças nas famílias, direitos e proteção; objetos, fases da vida,
  povos Karajá, Baniwa e Timbira, antigo/atual, museus e preservação.
- Todas as 20 telas têm quadro “Leia para aprender” e fonte de estudo. Histórias, entrevista,
  relações de parentesco e situações necessárias à resposta aparecem integralmente na questão.
  Q14 tem um ditado de frase; Q20 tem três frases e só pontua quando todas estiverem corretas.
- Reutiliza `QuestionariosRevisoes`, `gramatica-ditado.js`, `audio.js` e o painel compartilhado.
  A extensão opt-in `tipo: 'misto'` combina alternativa, seleção e ordenação sem duplicar
  controlador. As ações são reversíveis por clique, toque e teclado e têm normalização estrita.
- `layout.desktopAmplo` organiza leitura e respostas lado a lado no desktop e mantém uma coluna no
  celular. Dois SVGs originais e acessíveis representam famílias de épocas diferentes e objetos
  domésticos antigos/atuais; nenhuma imagem do caderno foi copiada.
- Testes: `tests/historia-alice-familias-objetos.spec.js` (13 casos), incluindo percurso completo,
  questões mistas, ditado local, isolamento, armazenamento corrompido/bloqueado, `file://`,
  390 × 844, 1366 × 768, 1920 × 1080, axe-core e console. Cadastro central: 42 revisões.

ID: `alice-historia-familias-objetos-agosto-2026`.

Chave: `revisoesEscolares.alice.historia.familiasObjetosAgosto2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/historia-familias-objetos.js`.

### Mariana — História: Convivência nos transportes: ontem e hoje

- Nova revisão exclusiva de História, 2º ano, com **30 questões numeradas e 30 pontos**.
- Fonte inicial: síntese fornecida das páginas 50–61. Após validação em uso real, o responsável
  autorizou uma nova conferência do PDF por OCR e inspeção visual local das 12 páginas. O PDF e os
  arquivos temporários não integram o projeto.
- Cada uma das 30 questões exibe antes da atividade um quadro “Leia para aprender”, com explicação
  adaptada autossuficiente e indicação da página ou do material complementar. A revisão pode ser
  feita sem manter o caderno aberto; Q10–Q14 têm regressão específica para as fontes que motivaram
  a correção.
- Trens/maria-fumaça e classes; bondes e convivência; ônibus, demora e superlotação;
  automóveis, cronologia e congestionamento; barcos/piroga, fontes históricas e preservação.
  Complementos moderados: classificação dos transportes, convivência, diferenças e memória.
- Seleção múltipla, alternativa única, classificação, associação, V/F, ordenação reversível,
  escrita curta e ditados. Escrita: Q11 (1908), Q17 (1886), Q24 (palavra) e Q30 (três frases).
- Ditados Q24 e Q30 reutilizam exclusivamente `gramatica-ditado.js`/`audio.js`, em pt-BR local,
  sem início automático, com prefixo protegido, repetir, parar e cancelamento por subitem/tela.
- Motor existente `gramatica-questionarios.js`, também exposto como `QuestionariosRevisoes`;
  `questionarios-interacoes.js` oferece seleção múltipla e ordenação opcionais. Nenhum controlador
  duplicado. Painel e registro legados mantidos, com matéria configurável e retorno a Gramática.
- Subitens precisam estar todos corretos para ganhar um ponto. Edição invalida a conferência;
  acertos já conquistados não duplicam. Respostas, tentativas erradas, conferências, etapa e
  pontos persistem. Normalização estrita opcional, fallback em memória e limpeza somente da chave.
- Ícones locais existentes e três SVGs originais (trem, bonde e canoa), sem ilustrações do livro.
- Testes: `tests/historia-mariana-transportes.spec.js` (16 casos), incluindo gabarito independente
  para o percurso completo, isolamento, corrupção/bloqueio do armazenamento, teclado, toque,
  390 × 844, desktops, axe-core, console e `file://` sem rede. Cadastro central preservado em 42
  revisões após a inclusão da História da Alice.

ID: `mariana-historia-convivencia-transportes-agosto-2026`.

Chave atual: `revisoesEscolares.mariana.historia.convivenciaTransportesAgosto2026.v2`. A chave
`v1` permanece intocada para preservar o progresso da primeira versão, enquanto a rodada corrigida
começa do zero.

Conteúdo: `ambiente_interativo/revisoes/mariana/historia-convivencia-transportes.js`.

### Mariana — Geografia: Meios de transporte e comunicação

- Revisão exclusiva do 2º ano com **30 questões numeradas e 30 pontos**, baseada na síntese das
  páginas 58–69 e nos materiais complementares, sem reabrir ou reprocessar material privado.
- Q1–Q15 tratam de deslocamento até a escola, bicicleta, crianças ribeirinhas, classificação ampla
  e por caminhos, qualidade do ar, segurança, pedestre e leitura de dados fictícios. Hidroviário e
  dutoviário são explicados antes de serem cobrados.
- Q16–Q30 tratam de telefone, rádio, jornal, televisão, Libras, jornal impresso/digital, evolução
  temporal da comunicação, cuidados com telas e situações práticas de segurança na internet.
- Todas as telas mostram “Leia para aprender” e a fonte pedagógica adaptada. Q21–Q22 usam
  ordenação reversível; Q28 usa símbolos e rótulos textuais de Seguro, Cuidado e Perigo, sem
  depender apenas de cor.
- Q30 é um ditado final de três frases, usando somente `gramatica-ditado.js` e `audio.js` com voz
  local pt-BR, utterance protegido, repetir, parar e cancelamento. As respostas não aparecem nos
  controles.
- Reutiliza `QuestionariosRevisoes`, com estado estritamente normalizado, limpeza seletiva e
  fallback em memória. `layout.desktopAmplo` mantém leitura e atividade lado a lado no desktop e
  uma coluna no celular. Não há controlador paralelo.
- Testes: `tests/geografia-mariana-transportes-comunicacao.spec.js` (7 cenários), cobrindo gabarito
  independente, erro/correção, persistência, ordenação, ditado, isolamento, armazenamento
  corrompido ou bloqueado, 390 × 844, 1366 × 768, 1920 × 1080, axe-core e `file://` sem rede.

ID: `mariana-geografia-transportes-comunicacao-setembro-2026`.

Chave: `revisoesEscolares.mariana.geografia.transportesComunicacaoSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/geografia-transportes-comunicacao.js`.

### Alice — Geografia: Moradias, lugares e cômodos

- Revisão exclusiva do 1º ano, para a prova de 02/09/2026, com **25 questões numeradas e 25
  pontos**, baseada na síntese das páginas 64–69 sem reprocessar o material privado.
- Moradia, endereço e arredores são apresentados em cenas e dados totalmente fictícios; a revisão
  não pede, exibe como resposta nem armazena endereço real de Alice.
- Abrange lugares de brincar, casa térrea, sobrado, apartamento, palafita, oca, iglu, dados de uma
  turma fictícia, cômodos, objetos e organização da moradia. Materiais aparecem apenas como uma
  ampliação leve, sem transformar o conteúdo em revisão de construção.
- Todas as telas têm “Leia para aprender” e fonte de estudo; três SVGs originais descrevem tipos
  de moradia, uma casa com árvore/praça e o interior de uma casa fictícia com quatro cômodos.
- Q25 é um ditado final de três frases, usando somente `gramatica-ditado.js` e `audio.js` com voz
  local pt-BR, prefixo protegido, repetir, parar e cancelamento, sem expor respostas nos controles.
- Reutiliza `QuestionariosRevisoes`, com normalização estrita, limpeza seletiva e fallback em
  memória. `layout.desktopAmplo` organiza leitura e atividade lado a lado no desktop, mantendo uma
  coluna no celular; não há controlador paralelo.
- Testes: `tests/geografia-alice-moradias-interior.spec.js`, com gabarito independente, correção,
  persistência, isolamento, ditado, armazenamento corrompido/bloqueado, 390 × 844, desktops,
  axe-core e `file://` sem rede.

ID: `alice-geografia-moradias-lugares-interior-setembro-2026`.

Chave: `revisoesEscolares.alice.geografia.moradiasLugaresInteriorSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/geografia-moradias-lugares-interior.js`.

### Alice — Origem dos materiais

- Revisão preservada no perfil de Alice.
- Conteúdo sobre origem e classificação de materiais.
- Atividade com canvas e persistência de desenho.
- Migração do progresso antigo sem apagar a chave original.
- Isolamento em relação às atividades de Mariana.

Chave: `revisoesEscolares.alice.ciencias.origemMateriais`.

### Alice — Ciências: Objetos, emoções e alimentação

- Revisão exclusiva do 1º ano com **30 questões e 30 pontos**: materiais e reaproveitamento,
  sentimentos e atitudes respeitosas, alimentação variada e cuidados com os dentes.
- Dois ditados locais em pt-BR: `FELIZ` e `SAÚDE`, sem revelar ou preencher a resposta.
- Reutiliza o questionário declarativo compartilhado, com associações, seleção reversível,
  persistência, teclado, toque e cinco SVGs originais locais. A revisão antiga de Ciências da Alice
  permanece disponível no cartão próprio.

ID: `alice-ciencias-objetos-emocoes-alimentacao-setembro-2026`.

Chave: `revisoesEscolares.alice.ciencias.objetosEmocoesAlimentacaoSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/alice/ciencias-objetos-emocoes-alimentacao-setembro-2026.js`.

### Mariana — Ciências: Plantas, seres vivos e a luz do Sol

- Revisão exclusiva do 2º ano com **30 questões numeradas e 30 pontos**: Q1–Q15 abordam
  partes e funções das plantas, frutos, sementes, necessidades, alimentação e proteção do solo;
  Q16–Q30 abordam dia/noite, animais, luz, calor, materiais e cuidados sob Sol forte.
- Cinco ditados locais em pt-BR: Q8 `RAIZ`, Q14 `FOLHA`, Q20 `SOL`, Q25 `LUZ` e Q30 com a frase
  `A LUZ DO SOL É IMPORTANTE PARA A VIDA.`. A resposta não aparece nem é preenchida pelo áudio;
  a frase final exige maiúsculas, acentuação e pontuação.
- Reutiliza `QuestionariosRevisoes`, `questionarios-interacoes.js`, `gramatica-ditado.js` e
  `audio.js`. A Q1 ativa o novo `mapaVisual` declarativo para tocar diretamente na raiz, com botões
  posicionados também operáveis por teclado; associações usam subitens de alternativas e a
  ordenação permite retirar e limpar cartões.
- Dez SVGs originais e locais ilustram plantas, folha, sequência flor/fruto/sementes, seres vivos,
  solo, dia/noite, calor, materiais e proteção. Nenhum PDF, print, OCR ou recurso da internet foi
  reprocessado ou incorporado.
- Testes direcionados: `tests/ciencias-mariana-plantas-sol.spec.js`, incluindo gabarito completo,
  erro e correção, mapa visual, subitens, cinco ditados, persistência, isolamento, limpeza,
  armazenamento adverso, teclado/toque, layouts, axe-core, console e `file://`.

ID: `mariana-ciencias-plantas-sol-setembro-2026`.

Chave: `revisoesEscolares.mariana.ciencias.plantasSolSetembro2026.v1`.

Conteúdo: `ambiente_interativo/revisoes/mariana/ciencias-plantas-sol-setembro-2026.js`.

## 5. Matemática

### Alice e Mariana — Dezenas, dinheiro, contas e tabuadas

- Nova rodada com **30 questões e 30 pontos**, semanticamente idêntica nos dois perfis e com IDs,
  chaves, respostas e progresso independentes.
- Questões 1 a 6: material dourado, decomposição, sequências, números vizinhos e ábaco D–U.
- Questões 7 a 12: dinheiro fictício, dezenas exatas, cálculos até 19, formação de uma dezena e
  adição sem reagrupamento no quadro D–U.
- Questões 13 a 22: estratégias de adição, decomposição, cálculo mental, adição e subtração com
  reagrupamento, comparação e situações com dinheiro.
- Questões 23 e 24: problemas em etapas e mini simulado. Depois do acerto da questão 24, uma etapa
  de estudo apresenta somente as tabuadas do 2 e do 3, de `× 1` a `× 10`, sem conceder ponto.
- Ao iniciar a questão 25, a tabela fica bloqueada de modo persistente: voltar leva diretamente à
  questão 24 e avançar retorna à 25 sem reabrir o estudo, inclusive após sair ou recarregar.
- Questões 25 a 30 avaliam as tabuadas do 2 e do 3 em páginas com vários campos; cada página vale
  um único ponto e só termina quando todos os fatos estiverem corretos.
- Os visuais locais expõem dados estruturais que permitem conferir quantidades, posições D–U,
  valores monetários, parcelas e estados anterior/posterior das trocas sem revelar o resultado
  final. A revisão visual cega e os testes verificam o modelo matemático além da aparência.

IDs:

- `alice-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026`
- `mariana-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026`

Chaves:

- `revisoesEscolares.alice.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1`
- `revisoesEscolares.mariana.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1`

### Alice — Capacidade, continhas e números

- Revisão exclusiva com **32 etapas**: apresentação, **30 questões avaliativas** e encerramento.
- Questões 1 a 7: capacidade de recipientes, comparações, equivalências entre litro e mililitro e
  associação de objetos às unidades `L` e `mL`.
- Questões 8 a 12: adições com reagrupamento, apoiadas por continhas verticais D–U.
- Questões 13 a 17: subtrações com reagrupamento e decomposição visual da dezena, sem simular uma
  troca manipulativa inversa que a biblioteca compartilhada não oferece.
- Questões 18 a 22: sequências, nomes dos números e composição de 1 a 20 em dezenas e unidades.
- Questões 23 a 26: dezenas exatas até 100, leitura, ordenação e quantidade de dezenas.
- Questões 27 a 30: compras de supermercado, troco e dois mini simulados com várias respostas.
- Recipientes, produtos e continhas são ilustrações originais em HTML/CSS, sem imagens ou recursos
  obrigatórios da internet. Todos os campos continuam no contrato persistente da Cena Matemática.
- Erro bloqueia o avanço sem apagar a resposta; a criança pode corrigir, conferir novamente,
  avançar, voltar e recarregar. Clique, toque, teclado, `aria-live` e limpeza seletiva foram
  preservados, com progresso isolado de todas as revisões anteriores de Alice e Mariana.

Chave: `revisoesEscolares.alice.matematica.capacidadeOperacoesNumeros.v1`.

### Alice e Mariana — Contas do dia a dia

- Nova revisão independente de adição e subtração, disponível nos dois perfis com enunciados e
  situações diferentes para cada criança.
- Alice pratica **15 questões**; Mariana pratica **20 questões**.
- As cinco primeiras questões de cada perfil trabalham somente unidades e números de um algarismo.
- As questões seguintes avançam para dezenas e problemas com números de dois algarismos.
- Exclusivamente para Mariana, as seis questões finais trabalham equivalências entre centenas,
  dezenas e unidades e resultados imediatamente posteriores a 100, como `100 + 1`.
- Todas as respostas são digitadas no teclado. Um erro produz uma pista específica, mantém o campo
  editável e bloqueia o avanço somente até a resposta ser corrigida e conferida novamente.
- Questão atual, respostas, correções, pontuação e conclusão são restauradas ao voltar ou recarregar.
  Limpar remove somente a chave da atividade e do perfil ativos.
- O mesmo controlador compartilhado atende os dois conteúdos, sem misturar perguntas ou progresso.

Chaves:

- `revisoesEscolares.alice.matematica.contasDiaADia.v1`
- `revisoesEscolares.mariana.matematica.contasDiaADia.v1`

### Alice e Mariana — Contas e tabuada

- Nova rodada independente e idêntica nos dois perfis, com **18 questões** e progresso próprio.
- Questões 1 a 5: adição e subtração somente com unidades e números de um algarismo.
- Questões 6 a 13: problemas de adição e subtração com números de dois algarismos.
- Depois da questão 13, uma etapa de estudo mostra em tabelas completas as tabuadas do 1 e do 2,
  de `× 1` até `× 10`.
- Ao acionar “Já estudei — começar as multiplicações”, o bloqueio é salvo: voltar, sair ou
  recarregar não permite reabrir a tabela durante a mesma rodada.
- Questões 14 a 18: cinco páginas de multiplicação, cada uma com quatro resultados digitados das
  tabuadas do 1 e do 2.
- A questão só é concluída quando todos os seus campos estão corretos. Campos vazios ou errados
  permanecem editáveis, recebem indicação individual e podem ser conferidos novamente.
- Respostas de vários campos, etapa de estudo, bloqueio, questão atual, pontos e conclusão são
  persistidos; limpar remove somente a nova chave do perfil ativo e permite uma nova rodada.

Chaves:

- `revisoesEscolares.alice.matematica.contasETabuada.v1`
- `revisoesEscolares.mariana.matematica.contasETabuada.v1`

### Alice e Mariana — Mais contas e tabuada

- Segunda rodada independente e idêntica nos dois perfis, com **18 questões**, números novos e
  progresso separado da atividade anterior.
- Questões 1 a 5: adição e subtração simples somente com unidades.
- Questões 6 a 13: problemas de adição e subtração com números de dois algarismos, começando pelo
  exemplo `16 + 17`.
- Depois da questão 13, a etapa de estudo apresenta as tabuadas completas do 1, do 2 e do 3, de
  `× 1` até `× 10`, em tabelas responsivas.
- O controlador agora aceita a lista declarativa `estudoTabuada.fatores`; revisões anteriores sem
  essa lista continuam usando as tabuadas do 1 e do 2.
- Ao começar a questão 14, o bloqueio é persistido. Voltar, sair, avançar novamente ou recarregar
  não reabre as tabelas durante a rodada.
- Questões 14 a 18: cinco questionários com quatro multiplicações cada, cobrindo as tabuadas do 1,
  do 2 e do 3, inclusive `3 × 4` e `3 × 8`.
- Erros permanecem corrigíveis por campo; respostas parciais, acertos, bloqueio, questão e
  conclusão são restaurados. Limpar remove somente a chave da nova revisão ativa.

Chaves:

- `revisoesEscolares.alice.matematica.maisContasETabuada.v1`
- `revisoesEscolares.mariana.matematica.maisContasETabuada.v1`

### Mariana — Revisão ampla

- **25 etapas interativas**.
- Subtração, operações inversas, sequências e gráficos.
- Dezena e unidade; números de 10 a 19.
- Ordinais, pares e ímpares.
- Geometria, sólidos, vistas e planificações.
- Canvas, mini simulado, atividade livre, pontuação e conclusão persistentes.

#### Correção da etapa 14 — Crescente e decrescente

- Cartões posicionados são restaurados visivelmente após recarga.
- Um cartão colocado pode ser clicado para voltar à bandeja.
- Também pode ser arrastado novamente para corrigir a ordem.
- É possível errar, conferir, reorganizar e concluir sem pular a etapa.
- O fluxo de correção, avanço, retorno e recarga tem teste de regressão.

Chave: `revisoesEscolares.mariana.matematica.revisaoAmpla`.

### Biblioteca manipulativa

- Quadros U, D–U, C–D–U e M–C–D–U.
- Cubinho de 1, barra de 10, placa de 100 e cubo de 1.000.
- Ábaco para montar e ler números, com descrição por haste.
- Composição e decomposição, inclusive zero intermediário.
- Ordenação, sequências, reta numérica, dinheiro pedagógico e gráfico de barras.
- Histórico, desfazer, limpar, dica e conferir.
- Retirada por clique, arrasto ou descarte.
- Estado serializável, normalizado e persistente.
- Pointer Events para mouse, toque e caneta.
- Selecionar e colocar por botão, clique no quadro grande ou teclado.
- Ordens incompatíveis continuam bloqueadas; uma placa de 100 não entra em dezenas ou unidades.
- Supressão apenas do clique sintético após arrasto, sem perder o clique legítimo seguinte.
- Persistência de várias ações consecutivas, sem depender da identidade da mesma referência de objeto.

Trocas explícitas:

- 10 U por 1 D.
- 10 D por 1 C.
- 10 C por 1 M.
- Cada troca exige quantidade exata e preserva o valor.

### Mariana — Centenas em ação, nova rodada

- **20 etapas novas**: apresentação, 18 avaliativas e encerramento.
- Mesmo ID lógico e nova chave `v2`, preservando a rodada anterior.
- Disponível somente para Mariana.

Etapas: apresentação; reconhecer 100; trocas U→D e D→C; montar 700; montar 800 e 641 no ábaco; ler 307; quadros 582 e 905; compor 734; decompor 420; ordem crescente; saltos de +25 e −50; reta em 675; formar 840; troca C→M; gráfico; encerramento.

Chave: `revisoesEscolares.mariana.matematica.centenasEmAcao.v2`.

### Mariana — Formas, mosaicos e medidas

- Revisão exclusiva com 32 etapas: apresentação, 30 questões e encerramento.
- Progressão: formas planas e não planas, lados e vértices, relações com objetos e mosaico de três
  cores; comprimento em mm, cm e m; massa em g e kg; capacidade em mL e L; conversões e operações.
- Contagem auxiliada por figuras selecionáveis, associações por listas, mosaico editável com metade
  pronta, réguas originais, balança e campos numéricos com a unidade fora da digitação.
- Erro corrigível, avanço bloqueado até o acerto, desfazer/limpar no mosaico, teclado, toque,
  persistência visual e lógica e pontuação máxima de 30 conquistas.

Chave: `revisoesEscolares.mariana.matematica.formasMosaicosMedidas.v1`.

### Mariana — Formas e medidas — revisão 03/09

- Revisão exclusiva da Mariana com 32 etapas: apresentação, 30 questões avaliativas e encerramento.
- ID: `mariana-matematica-formas-medidas-setembro-2026`.
- Chave: `revisoesEscolares.mariana.matematica.formasMedidasSetembro2026.v1`.
- Progressão: formas e mosaico; comprimento em mm, cm e m; massa em g e kg; capacidade em mL e L;
  cinco operações com reagrupamento entre dezenas e unidades.
- Reutiliza integralmente a infraestrutura matemática existente: associações, seleção reversível,
  contagem, mosaico, régua, balança, recipientes de capacidade, campos e operação D-U.
- A revisão anterior Formas, mosaicos e medidas e os respectivos progressos permanecem intactos.

### Mariana — Medir, calcular e descobrir (outubro de 2026)

- Implementada para o 2º ano, com apresentação, **30 questões / 75 subitens / 30 pontos** e
  encerramento: 32 etapas. Seis blocos de comprimento, massa, capacidade, adição, subtração e
  interpretação de informações. Os 49 campos numéricos e 26 escolhas preservam a ordem aprovada.
- ID: `mariana-matematica-medir-calcular-descobrir-outubro-2026`.
- Chave: `revisoesEscolares.mariana.matematica.medirCalcularDescobrirOutubro2026.v1`.
- Conteúdo: `revisoes/mariana/matematica-medir-calcular-descobrir-outubro-2026.js`; cartão
  **Medir, calcular e descobrir** em Mariana → Matemática. Motor `MatematicaRevisoes`, com
  `conferenciaPorSubitem` opt-in em `atividade-visual`. Sem mudança de chave ou migração legada.
- Ensino antes das dependências, 75 pistas por subitem depois de tentativa, 30 consolidações
  após acerto integral e pausas sem pontuação. Edição remove conferência/consolidação e bloqueia
  avanço, preservando um único ponto histórico. Inteiros aceitam espaços externos/zeros iniciais;
  vazio continua distinto de zero. Alternativas extensas preservam conteúdo completo.
- 21 SVGs originais determinísticos: réguas cm/mm, contorno, três balanças, pacotes, recipientes,
  copos/alvos, quatro cartões de base dez, gráfico, carteiras, transferência e dados. Q28 usa
  tabela HTML com cabeçalhos associados. Sem imagem gerativa, material escolar privado ou
  dependência de internet. CSS novo limitado a `[data-math-subitens]`.
- Desktop Amplo, Modo Responsável e áudio não habilitados: o motor matemático não oferece os
  opt-ins compatíveis. Mantido layout responsivo comum e leitura pelo responsável.
- Testes: `tests/matematica-mariana-medir-calcular-descobrir.spec.js`, com oráculo
  independente, fluxo completo, erros, edição, recarga, isolamento, dados inválidos, modo em
  memória, toque/teclado, axe-core, figuras e capturas em 390, 1366 e 1920 pixels, e `file://`.
- Integração local Etapa 3 sobre a main do PR #41 em 13/10/2026. Conteúdo, chave, questões,
  assets e teste próprio transportados sem reconstrução. Nesta cópia: 48/48 próprios,
  261/262 regressões iniciais e reteste do cadastro 1/1 após corrigir somente sua projeção;
  global 552/552, Windows 24/24 e pronúncia simulada 8/8. A execução integral valida a base
  final com todas as asserções preservadas. Uso infantil e duplo clique humano pendentes.

## 6. Gramática

### Alice — Pontuação, LH e X/CH (outubro de 2026)

- Revisão original para a prova do 1º ano, com **30 questões e 30 pontos**. Progressão de
  reconhecimento, completamento, aplicação, comparação, correção e interpretação.
- Vírgula, ponto-final, pergunta, exclamação, dois-pontos, travessão, ponto e vírgula, reticências,
  aspas, LH, CH, NH e X com som de CH. Q28–Q30 reutilizam o mesmo texto original; Q30 mistura
  alternativas e seleção e só pontua depois de todos os subitens corretos.
- Quatro ditados locais em pt-BR (Q5, Q11, Q15 e Q24) reutilizam exclusivamente
  `gramatica-ditado.js` e `audio.js`. Q18 apresenta quatro SVGs originais e textos alternativos.
- Conteúdo declarativo em `revisoes/alice/gramatica-pontuacao-lh-xch-outubro-2026.js`, painel de
  questionários compartilhado, `layout.desktopAmplo`, `validacaoEstritaEstado` e contagem opt-in
  de tentativas completas por questão.
- Primeiro questionário com **Modo Responsável** opt-in: Ctrl + Alt + R abre o painel; a sessão
  auxiliar tem chave isolada, salto administrativo de Q1–Q30 sem fabricar progresso, limpeza
  seletiva e retorno à sessão principal. Cartão e status continuam ligados apenas à Alice.
- Teste direcionado: `tests/gramatica-alice-pontuacao-lh-xch-outubro-2026.spec.js`.
- Validação automatizada em 01/10/2026: build, formatação e lint aprovados; **14/14** testes
  direcionados e **315/315** testes na suíte global. Os quatro SVGs foram inspecionados
  visualmente. Em 02/10/2026, o responsável confirmou que a atividade funcionou corretamente no
  uso real. A orientação para evitar respostas entregues nos próprios itens foi registrada em
  `pedagogia/QUALIDADE_DAS_QUESTOES.md` para revisões futuras, sem alterar as questões atuais.
- Material escolar privado permaneceu fora do Git; nenhuma página, OCR, print ou ilustração foi
  copiada ou reprocessada.

ID: `alice-gramatica-pontuacao-lh-xch-outubro-2026`.

Chave principal: `revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.alice.gramatica.pontuacaoLhXchOutubro2026.responsavel.v1`.

### Mariana — Português e Gramática: revisão da prova (outubro de 2026)

- Revisão exclusiva do 2º ano com **35 questões e 35 pontos**: interpretação, vírgula,
  R/RR, estruturas silábicas, X/CH, sinônimos e antônimos, substantivos e gênero.
- Q1–Q4 mantêm “A caixa da exposição” para consulta; Q33–Q35 mantêm “O boné encontrado”.
  Ordenações Q2, Q13 e Q14 são reversíveis; questões com vários itens dão um ponto apenas após
  todos os acertos. A distribuição das alternativas é fixa e irregular.
- Quatro ditados locais em pt-BR (Q11, Q15, Q18 e Q32) usam `gramatica-ditado.js` e `audio.js`,
  sem reprodução automática nem exposição da resposta nos controles. Q32 cobra maiúscula,
  vírgula, acento e ponto na frase completa.
- Conteúdo em `revisoes/mariana/gramatica-portugues-prova-outubro-2026.js`, no painel e
  controlador `gramatica-questionarios` existentes. Usa `layout.desktopAmplo`,
  `validacaoEstritaEstado`, `registrarTentativas` e **Modo Responsável** opt-in com sessão e
  chave independentes, salto de posição sem fabricar progresso e limpeza da chave ativa.
- Teste direcionado: `tests/gramatica-mariana-portugues-prova-outubro-2026.spec.js`.
- Validação automatizada em 02/10/2026: build, formatação e lint aprovados; **15/15** testes
  direcionados e **330/330** testes na suíte global. A suíte global foi executada porque a
  integração acrescentou uma entrada de navegação em `app.js`. Áudio conferido por payload
  simulado. Em 04/10/2026, o responsável confirmou a validação em uso real e aprovou a revisão;
  não há registro separado de audição da voz instalada.

ID: `mariana-gramatica-portugues-prova-outubro-2026`.

Chave principal: `revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.mariana.gramatica.portuguesProvaOutubro2026.responsavel.v1`.

### Alice — Contos, dígrafos e vocabulário

- Revisão exclusiva da Alice com **30 questões** no controlador `gramatica-questionarios`,
  sem alterar controladores, áudio ou CSS compartilhados.
- ID: `alice-gramatica-contos-digrafos-vocabulario`. Conteúdo em
  `revisoes/alice/gramatica-contos-digrafos-vocabulario.js` e cartão próprio ao lado de H/til.
- Q1–Q4 reaproveitam integralmente os quatro contos originais da revisão da Mariana.
  Q5–Q18 praticam CH/LH/NH, famílias, recuperação da grafia, sílabas e transformação com H;
  Q19–Q24 trabalham sinônimos e antônimos; Q25 ordena uma frase; Q26–Q27 reforçam S com som de Z
  e RR; Q28 usa banco fechado; Q29 dita uma frase integradora; Q30 reúne oito itens de revisão.
- Q5 oculta os dígrafos em seis palavras; Q15 combina oito pistas com palavras incompletas;
  os três itens de CH/LH/NH da Q30 também usam lacunas, sem expor as palavras completas.
- **Cinco ditados:** Q8 (CH), Q11 (NH), Q14 (LH), Q18 (mistura) e Q29 (frase).
  Reutilizam `gramatica-ditado.js` e `audio.js`, com voz local pt-BR, ação explícita,
  utterance protegido, repetir, parar e cancelamento. Sem revelar ou preencher respostas.
- Q17 exige o til de “chão”; Q25 exige maiúscula na alternativa; Q29 exige grafia, maiúscula
  inicial e ponto-final em “A galinha achou o milho.”. Sinônimos e antônimos usam alternativas.
- Desktop Amplo ativado somente por `layout: { desktopAmplo: true }`, com suporte a
  1366 × 768, 1920 × 1080, celular 390 × 844 e bundle `file://`.
- Respostas, correções, etapa, pontos e conclusão ficam isolados na chave nova. Limpar não
  afeta H/til da Alice nem as revisões da Mariana. Nenhuma migração de progresso.
- Conteúdo baseado somente na síntese Markdown e nas revisões existentes; nenhum PDF/print
  escolar foi aberto, convertido, renderizado ou incluído.

Chave: `revisoesEscolares.alice.gramatica.contosDigrafosVocabulario.v1`.

Validação em 30/08/2026: build, formatação e lint aprovados; **13/13** testes em
`tests/gramatica-alice-contos-digrafos-vocabulario.spec.js` (1,4 min) e **1/1** teste central
de cadastro, com 40 IDs/chaves distintos. Cobertura de conclusão, correção, persistência,
limpeza seletiva, ditados, teclado/toque, layouts, axe, console e `file://`.
Capturas da aplicação conferidas; voz local simulada, sem audição humana. `npm test` dispensado
nesta inclusão declarativa, sem alteração de comportamento compartilhado ou regressão;
a suíte global permanece obrigatória na CI do futuro PR. Detalhes no relatório de testes.

Alice concluiu integralmente a revisão em uso real, inclusive após a correção pedagógica
de Q5, Q15 e Q30, com funcionamento correto confirmado pelo responsável.

### Mariana — Pontuação, ortografia e palavras (setembro de 2026)

- Nova revisão independente de Gramática do 2º ano com **35 questões e 35 pontos**.
- ID `mariana-gramatica-pontuacao-ortografia-vocabulario-setembro-2026` e conteúdo declarativo em
  `revisoes/mariana/gramatica-pontuacao-ortografia-vocabulario-setembro-2026.js`.
- Blocos de sinais e tipos de frase, vírgula, S/SS, R/RR, sinônimos, antônimos, encontros
  vocálicos, separação silábica, transformações de palavras, M antes de P/B e acentuação.
- Q4, Q16 e Q21 usam ditado opcional local em pt-BR, sem resposta escrita nos controles; Q7,
  Q17, Q32 e Q34 reutilizam seleção e ordenação reversíveis de `questionarios-interacoes.js`.
- Após validação em uso real, Q3 e Q4 receberam botão de travessão; Q4 orienta separadamente erros
  de início, grafia, acento, pontuação final e frase incompleta sem revelar a resposta. Os ditados
  usam um único utterance com “A palavra é:” ou “A frase é:” no mesmo enunciado da resposta. Esse
  prefixo absorve o corte inicial observado no Chromium/Windows sem expor a resposta escrita na
  interface.
- As alternativas foram redistribuídas deterministicamente nas questões com padrões previsíveis,
  incluindo Q23, Q25, Q27, Q30, Q31, Q32 e Q34. Q22 permanece exatamente nas posições 2/3/2/3.
- `layout: { desktopAmplo: true }` e `validacaoEstritaEstado: true`; correção recuperável,
  persistência, pontuação e limpeza ficam isoladas na chave nova. As revisões anteriores não são
  substituídas nem migradas.
- Teste direcionado em
  `tests/gramatica-mariana-pontuacao-ortografia-vocabulario-setembro-2026.spec.js`, cobrindo o
  percurso completo com gabarito independente, erro e correção, retorno/recarga, isolamento,
  ditado/áudio, teclado, toque, Desktop Amplo, 390 × 844, axe-core, overflow e `file://`.
- Correção de uso real e arquitetura de áudio unificada validadas com 123/123 testes direcionados e
  257/257 testes na suíte global.
- Validação acústica humana concluída com sucesso no Chromium/Windows em Português e Inglês.
- Implementação feita somente a partir da síntese Markdown consolidada, sem OCR, nova renderização
  ou cópia de PDF, página, texto ou ilustração escolar.

Chave:
`revisoesEscolares.mariana.gramatica.pontuacaoOrtografiaVocabularioSetembro2026.v1`.

### Mariana — Contos, ortografia e pontuação

- Nova revisão independente com **30 questões**, baseada na síntese pedagógica da prova de 31/08.
- Questões 1–4: contos, conto de fadas, começo/problema/desfecho e suspense infantil; 5–10: NH e CH;
  11–14: antônimos e sinônimos; 15–23: frase declarativa, ponto-final, interrogação, exclamação,
  travessão e dois-pontos; 24–28: S/SS, separação silábica e S com som de Z; 29–30: pontuação integrada.
- Conteúdo original e declarativo em `revisoes/mariana/gramatica-contos-ortografia-pontuacao.js`,
  reutilizando `js/gramatica-questionarios.js`. Não substitui as revisões de 40 e 25 questões.
- Sete ditados opcionais: Q7, Q10 e Q28 com palavras; Q17, Q21, Q23 e Q30 com frases curtas.
  `js/gramatica-ditado.js` aceita `unidadeDitado: 'frase'`, mantendo palavras como padrão legado.
  Usa exclusivamente `js/audio.js`, voz local pt-BR a 0,78, utterance protegido, repetir, parar e
  cancelamento. Nenhuma resposta é exposta nos controles ou preenchida pelo áudio.
- Campos podem declarar `maiusculasObrigatorias`, junto de `acentuacaoObrigatoria` e
  `fraseCompleta`. Enter confere no controlador compartilhado. `inserirTravessao` oferece um botão
  para inserir apenas esse sinal no cursor, com edição e exclusão normais por teclado ou toque.
- Erros continuam editáveis, com nomes dos itens a rever no retorno acessível e `aria-invalid`
  nos campos. Pontos são concedidos uma única vez. Progresso e limpeza usam somente a chave nova.
- Primeira revisão de Gramática com `layout: { desktopAmplo: true }`: 94vw, teto de 2360px e
  breakpoint de 1120px. `leitura` cria um painel de texto ao lado das respostas; questões sem texto
  não reservam coluna vazia. Campos podem ocupar duas colunas e frases usam a largura disponível.
  Em 390 × 844 tudo volta a uma coluna. Abrir H/til ou a revisão ampla remove a classe opt-in.
- O resumo global deriva o total do conteúdo ativo; as revisões antigas mantêm seus totais.
- Nenhum PDF ou print de referência foi aberto, convertido, submetido a OCR ou renderizado para
  esta implementação. Sem recursos obrigatórios da internet e com suporte ao bundle `file://`.

Chave: `revisoesEscolares.mariana.gramatica.contosOrtografiaPontuacao.v1`.

Validação em 30/08/2026: build, formatação e lint aprovados; 30/30 testes direcionados de
Gramática, 1/1 de cadastro e suíte global `npm test` com 160/160 aprovados em 10,1 minutos.
Capturas da aplicação conferidas nos dois desktops e no celular. Áudio validado com vozes locais
simuladas, sem audição humana; detalhes em `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`.

Mariana concluiu a revisão completa em uso real, com funcionamento correto confirmado pelo responsável.
A execução local de 160 testes incluía seis testes de outra implementação não incluída neste PR;
a suíte versionada desta entrega contém 154 testes.

### Mariana — revisão ampla de Gramática

- Nova revisão independente e disponível somente para Mariana.
- **40 questões** com correção imediata, tentativa recuperável e avanço bloqueado até a correção.
- Conteúdo baseado no caderno de agosto de 2026: M e N no final das palavras; frases declarativas
  e interrogativas; ponto-final e ponto de interrogação; `za`, `ze`, `zi`, `zo`, `zu`; contagem de
  sílabas; ponto de exclamação em emoções fortes; transformação digitada de frases declarativas em
  exclamativas; e uso introdutório de `s` e `ss`.
- Campos de texto e alternativas reutilizam os componentes visuais da revisão ampla, com mensagens
  específicas em região `aria-live` e operação por teclado, mouse ou toque.
- Respostas, questão atual, correções, pontuação e conclusão são restauradas depois de voltar ou
  recarregar; limpar remove somente a chave desta revisão.
- O PDF escolar permaneceu privado e não foi copiado para a aplicação.
- As questões 5, 7 e 22 oferecem ditado opcional de cada resposta em `pt-BR`, com prefixo protegido,
  repetição e parada, sem mostrar nem preencher automaticamente a palavra.

Chave: `revisoesEscolares.mariana.gramatica.revisaoAmpla.v1`.

### Alice e Mariana — H, til e vocabulário

- Revisão compartilhada com **25 questões idênticas** para os dois perfis e progresso individual.
- Conteúdo adaptado ao caderno: H inicial silencioso; dígrafos `ch`, `lh` e `nh`; H em
  `super-homem`, `anti-higiênico`, `ah!` e `oh!`; til e nasalização; combinações com `ã` e `õ`;
  plural; distinção entre `lã` e `lá`; circunflexo em `bebê`, `você`, `avô` e `robô`; sinônimos e
  antônimos.
- Questões específicas de teclado exigem o til ou o circunflexo; respostas sem o sinal continuam
  corrigíveis e não liberam o avanço.
- O mesmo conjunto de questões é cadastrado uma única vez, mas questão atual, respostas,
  correções, pontos, conclusão e limpeza permanecem isolados por perfil.
- O painel visual de Gramática é reutilizado sem remover a revisão anterior da Mariana, e o PDF
  escolar permanece privado fora da aplicação.
- Na questão 17, Alice e Mariana podem ouvir separadamente `irmã`, `avião`, `balões` e `manhã` e
  continuam responsáveis por digitar o til corretamente.

Chaves:

- `revisoesEscolares.alice.gramatica.hTilVocabulario.v1`
- `revisoesEscolares.mariana.gramatica.hTilVocabulario.v1`

## 7. Inglês — conteúdo, áudio e pronúncia

### Alice — Play Time · Unit 6 (outubro de 2026)

Uso real validado em outubro de 2026. Clareza, fluxo e execução da atividade foram confirmados;
Azure, gateway, avaliação automática e exposição da voz instalada no navegador não recebem
validação técnica adicional por essa confirmação.

- ID: `alice-ingles-play-time-unidade-6-outubro-2026`; unidade:
  `play-time-unidade-6-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/alice/ingles-play-time-unidade-6-outubro-2026.js`.
- Principal: `revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1`.
- Auxiliar: `revisoesEscolares.mariana.ingles.playTimeUnidade6Outubro2026Compartilhada.v1`;
  somente pelo Modo Responsável. O cartão e seu status pertencem exclusivamente a Alice.
- 25 cartões de áudio/escrita guiada (19 brinquedos e seis frases compostas), uma preparação
  `historia` com seis painéis, 25 questões/25 pontos: **51 etapas obrigatórias**. Escritas e os
  painéis internos não criam pontos ou etapas extras. Consulta disponível em todas as questões.
- Dez pares/20 alvos opcionais de conversa, ID `play-time-unidade-6-outubro-2026-conversacao-v1`.
- 61 SVGs locais originais `play-time-*`; geração determinística por
  `node scripts/gerar-assets-play-time.cjs`. Comparação A/B com sete alterações e mesma base;
  permanências e destaques auditados. Quatro versões móveis empilham as mesmas cenas A/B.
  A revisão das sete diferenças aparece somente após Q22.
- Reuso de RegistroIngles/ConfiguracoesIngles, Inglês, AudioRevisoes, pronúncia e armazenamento.
  Extensões opt-in: pergunta visível, ordem fixa, rótulo acessível, imagem de conversa e fontes
  móveis locais. Trocas de
  sessão/saída cancelam microfone/avaliação e exigem novo consentimento.
- Gabarito: B, D, A, C, B, A, D, C, A, B, C, D, B, A, D, C, D, B, A, C, B, D, C, A, B.
  Distribuição A=6, B=7, C=6, D=6, preservada também na sessão auxiliar.
- Testes específicos: `tests/ingles-alice-play-time.spec.js`; suíte global exigida pelas alterações
  compartilhadas. Validação automatizada usa TTS, microfone e gateway simulados; acústica
  instalada e serviço real não receberam confirmação técnica específica para Play Time.
- Validação histórica isolada: build, `format:check`, lint e `git diff --check` aprovados; **16/16** testes
  direcionados e **331/331** na suíte global (23,4 min). Capturas inspecionadas em 1366, 1920 e
  390 px; sete diferenças e variantes móveis auditadas sem mudança de geometria.
- Base: `origin/main` em `8e82c89`, branch `codex/alice-ingles-play-time-outubro-2026`.
  A implementação original não tinha commit. A consolidação local mantém a Gramática da
  Mariana já incorporada em `main` por `e88ad36`/`937989e` e acrescenta as duas Histórias de outubro.
- Detalhes: [Play Time](pedagogia/ALICE_INGLES_PLAY_TIME_OUTUBRO_2026.md).


### Alice e Mariana — Friends · Atividade 1

- Uma única unidade declarativa compartilhada oferece o mesmo conteúdo, as mesmas 25 questões,
  o mesmo gabarito e a mesma progressão pedagógica aos dois perfis. IDs, chaves, respostas,
  conferências, pontos, conclusão e limpeza permanecem separados para Alice e Mariana.
- A etapa inicial tem **25 itens obrigatórios de áudio e transcrição**: nome e amizade;
  números de 1 a 10; seis cores; e sete frases de apresentação, idade e cor. A grafia continua
  visível e o portão só libera as atividades com 25/25 áudios e 25/25 escritas corretas.
- As **25 atividades / 25 pontos** trabalham cumprimento, nome, idade, números, anterior e
  posterior no alfabeto, cores e três integrações curtas. Correção imediata permite errar,
  corrigir e conferir novamente antes de avançar.
- Nos exercícios específicos de números, o numeral aparece no enunciado e a criança escolhe a
  palavra em inglês, sem tradução em português nas alternativas. Nos exercícios de alfabeto, as
  alternativas exibem somente as letras e o enunciado explicita `Which letter...`; o áudio da
  pergunta pratica o nome inglês da letra. IDs, gabarito e chaves foram preservados, portanto o
  refinamento não invalida o progresso já salvo.
- `layout.desktopAmplo` e `praticaEscrita` reutilizam o motor atual. Áudio permanece exclusivamente
  em `audio.js`, com `Word:`/`Phrase:`, velocidades 0,62/0,50, repetição, parada e cancelamento.
- Dois SVGs originais representam um balão verde e uma mochila azul. Atividades visuais podem
  declarar `imagemEnunciadoAlt`; em repetições, o texto alternativo completo aparece somente na
  primeira imagem para evitar anúncio duplicado.
- Teste direcionado: `tests/ingles-friends-atividade-1.spec.js` (6 cenários), cobrindo cadastro,
  áudio/escrita, portão, percurso, pontuação, gabarito, isolamento, armazenamento adverso,
  lógica visual, teclado/toque, viewports, axe-core, troca para revisão legada e `file://`.

IDs:

- `alice-ingles-friends-atividade-1`
- `mariana-ingles-friends-atividade-1`

Chaves:

- `revisoesEscolares.alice.ingles.friendsAtividade1.v1`
- `revisoesEscolares.mariana.ingles.friendsAtividade1.v1`

Unidade compartilhada: `friends-level-1-atividade-1`.

### Mariana — At School · Atividade 2

- Revisão exclusiva da Mariana, independente da Unit 3 e da Atividade 1, com **25 itens de áudio
  e transcrição** distribuídos em dez objetos escolares, seis perguntas/respostas e nove comandos
  de sala. O portão exige 25/25 áudios e 25/25 escritas corretas.
- As **25 atividades / 25 pontos** avançam de reconhecimento visual de objetos para perguntas com
  `What's this?` e `Is it...?`, respostas afirmativas/negativas e compreensão de comandos.
- A unidade ativa `exigirAudioPerguntaAntesDeResponder`: cada questão começa bloqueada e somente o
  término do seu próprio áudio libera as alternativas. As liberações são isoladas por questão,
  normalizadas, persistidas e apagadas por `Refazer`; vocabulário e escrita permanecem preservados.
- `js/ingles.js` concentra a capacidade opt-in e continua usando exclusivamente `js/audio.js`.
  Revisões anteriores não recebem a trava. Parada, erro, cancelamento, nova fala, navegação ou
  troca de tela não simulam conclusão.
- Depois de cada conferência, a unidade abre a etapa obrigatória **Let’s review!**, com pergunta,
  resposta correta e imagem opcional somente em Inglês. O botão de revisão executa a sequência
  pergunta EN → tradução PT → resposta EN → significado PT; `Próxima` só libera ao término normal.
  Erro, parada, cancelamento, clique repetido, outro áudio, navegação e recarga não fabricam a
  conclusão. A questão 25 segue o mesmo ciclo antes do resultado final.
- A conclusão da revisão pós-resposta é persistida por questão e alternativa na mesma chave `v1`.
  Estados antigos já concluídos continuam válidos, tentativas e pontos não são duplicados, e
  `Refazer` inicia o ciclo completo na questão 1 sem apagar vocabulário ou escrita.
- Cinco SVGs originais representam abrir o livro, fechar a mochila, sentar na carteira, passar a
  caneta e a orientação da professora. As descrições significativas ficam expostas por
  `imagemEnunciadoAlt`; nenhum PDF, OCR, captura escolar ou recurso remoto foi incorporado.
- Teste direcionado: `tests/ingles-mariana-at-school-atividade-2.spec.js` (13 cenários), cobrindo
  cadastro, conteúdo, portão, ordem bilíngue, acerto/erro, bloqueio até o fim, parada, cancelamento,
  erro, clique repetido, outro áudio, navegação, recarga intermediária, persistência, progresso
  legado, refazer, questão 25, percurso completo, pontuação, isolamento, viewports, axe-core e
  `file://`.

ID: `mariana-ingles-at-school-atividade-2`.

Chave: `revisoesEscolares.mariana.ingles.atSchoolAtividade2.v1`.

Unidade: `at-school-atividade-2`.

### Mariana — At School · Atividade 3

- Revisão exclusiva da Mariana com **17 itens obrigatórios de áudio e transcrição** em quatro
  grupos: Story & Values, Phonics · Letter A, Senses e Create That!. O questionário permanece
  bloqueado até 17/17 áudios e 17/17 escritas corretas.
- A validação humana mostrou que Q1–Q7 dependiam de contexto externo. Por isso, uma **Story Time
  interna com seis cenas** agora aparece depois do estudo e antes das perguntas, tornando a revisão
  autossuficiente. As cenas são recontações e ilustrações originais/adaptadas; nenhuma página,
  quadrinho ou ilustração do livro foi copiada.
- Cada cena oferece texto em Inglês e Português e áudio local EN → PT, sem autoplay, pela
  infraestrutura `AudioRevisoes`. Cena, conclusão e origem da consulta sobrevivem à recarga.
- As **25 atividades / 25 pontos** cobrem a história e Helping Each Other, o som curto de `a`,
  Skills, os cinco sentidos e Think Back. Cada pergunta exige a conclusão do próprio áudio antes
  de liberar as alternativas e mantém erro recuperável.
- Q1–Q7 oferecem **Rever história**. A consulta abre a Story Time sem apagar questão, resposta,
  áudio já concluído ou consolidações anteriores; **Voltar à questão** restaura o ponto exato.
- Toda questão usa a consolidação obrigatória Let’s review!, na ordem pergunta EN → tradução PT →
  resposta EN → significado PT. Parada, cancelamento, erro ou substituição do áudio não fabricam
  conclusão; a recarga restaura o estado intermediário.
- Depois de uma resposta errada, a Activity 3 mantém **Let’s review!** aberta até o fim da sequência
  e então libera **Tentar novamente**, que volta à mesma questão. Cada novo erro invalida somente a
  revisão daquela tentativa e exige novamente EN → PT → EN → PT; o acerto libera **Próxima**.
- A Activity 3 e Play Time são as unidades de Inglês com **Modo Responsável** habilitado. O painel
  oculto abre e fecha por `Ctrl + Alt + R`, mostra sessão e questão, permite selecionar Mariana ou
  Alice, saltar livremente e encerrar a sessão administrativa. A faixa permanece visível enquanto
  a sessão auxiliar de Alice está ativa.
- A sessão principal continua usando exatamente
  `revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1`; a sessão auxiliar usa
  `revisoesEscolares.alice.ingles.atSchoolAtividade3Compartilhada.v1`. A troca salva e restaura os
  mapas completos sem copiar dados. O salto persiste apenas `questaoAtual`, não conclui os 17 itens,
  a Story Time, áudio, resposta, conferência, revisão pós-resposta, tentativa ou ponto.
- O cartão continua exclusivo da Mariana e consulta somente a chave principal. Não há cartão nem
  cadastro da Activity 3 no perfil de Alice, e a limpeza remove apenas a chave da sessão ativa.
- `destinatariaMensagemFinal` é uma capacidade declarativa opt-in de `js/ingles.js`: esta unidade
  mostra “Uma mensagem para as meninas”, enquanto a Atividade 2 e as demais revisões conservam o
  destinatário derivado do perfil.
- Depois do resultado normal, a seção opcional **CONVERSAÇÃO · ESCUTE E PRONUNCIE** reutiliza
  cinco pares de Q6, Q15, Q17, Q21 e Q22. Pergunta e resposta podem ser ouvidas pelo `audio.js` e
  praticadas separadamente, com gravação/parada/repetição ilimitada e feedback “Muito bem!”,
  “Quase!” ou “Tente mais uma vez.”, sem exibir nota nem aprovar/reprovar.
  **Ouvir modelo** fixa `en-US` a `0.50` em `js/pronuncia.js`, para pergunta e resposta, inclusive
  ao ouvir novamente; vocabulário, Story Time, perguntas e consolidação mantêm suas velocidades.
- A conversa não cria etapa, ponto ou estado persistido, portanto preserva as 25 questões, as 43
  etapas, a chave `v1`, progresso legado e sessões do Modo Responsável. Consentimento e permissão
  são explícitos; permissão negada, API ausente, timeout e rede indisponível não desfazem a
  conclusão.
- `scripts/azure-pronunciation-gateway.js` escuta apenas em loopback, lê chave/região do ambiente,
  limita WAV, aplica CORS local, chama o Azure e devolve somente escores resumidos. Navegador e
  gateway zeram buffers após uso e não gravam arquivos. Operação e privacidade estão documentadas
  em `infraestrutura/PRONUNCIA_AZURE.md`.
- O parser de pronúncia aceita os escores REST diretamente em `NBest[0]`, mantendo o formato
  aninhado compatível. Logs seguros distinguem status Azure, ausência de avaliação e erro local,
  com metadados WAV e nomes de campos, sem áudio, fala ou credenciais. A retomada após reboot e
  o contrato REST estão descritos em `PRONUNCIA_AZURE.md`; o responsável confirmou a validação do
  protótipo com Azure real antes da automação do launcher.
- Os SVGs novos são originais e descrevem conjuntos de objetos, ajuda entre colegas, ações de
  retirar/guardar, os cinco sentidos e as seis cenas da Story Time. Assets existentes de objetos
  escolares e de abrir o livro foram reutilizados. Nenhum PDF, OCR, print escolar ou recurso
  remoto foi incorporado.
- Teste direcionado: `tests/ingles-mariana-at-school-atividade-3.spec.js` (17 cenários), cobrindo
  cadastro, perfil, portão de estudo, Story Time antes das perguntas, seis cenas, conteúdo de
  Q1–Q7, áudio bilíngue sem autoplay, navegação e recarga, consulta sem perda de estado, escrita
  corrigível, áudio obrigatório, consolidação bilíngue, refazer, limpeza seletiva, armazenamento
  adverso, isolamento, cenas visuais, percurso completo, mensagem final, Activity 2, viewports,
  teclado, toque, axe-core, `file://`, opt-in exclusivo do Modo Responsável, atalho, sessão auxiliar,
  salto sem pré-requisitos falsos, restauração entre sessões, recarga e limpeza por chave.
- Protótipo de pronúncia: `tests/ingles-pronuncia-azure.spec.js` (8 cenários), com parser REST,
  resposta Azure 200/401 simulada, logs sem fala/credencial, descarte no gateway e gateway sem
  credencial e CORS restrito, opt-in exclusivo, TTS compartilhado, WAV de 16 kHz, consentimento,
  pergunta/resposta, repetição, faixas sem nota, descarte, permissão negada, `503`, rede, timeout,
  isolamento do `localStorage`, 390 × 844 e axe-core.
  O payload-modelo é verificado a `0.50` nas cinco perguntas e respostas, com repetição, retorno e
  nova audição após tentativa simulada, sem consumir Azure.
- Launcher de pronúncia: `tests/launcher-pronuncia.cjs` (8 cenários simulados) cobre autenticação,
  login, reutilização do gateway, CLI ausente, falha na chave, `configured:false`, raiz selecionada
  e limpeza das variáveis. A continuidade do ambiente e os wrappers são cobertos pelo teste de
  abertura/worktrees. A chave real não é usada nesses testes.

ID: `mariana-ingles-at-school-atividade-3`.

Chave: `revisoesEscolares.mariana.ingles.atSchoolAtividade3.v1`.

Chave auxiliar do Modo Responsável:
`revisoesEscolares.alice.ingles.atSchoolAtividade3Compartilhada.v1`.

Unidade: `at-school-atividade-3`.

### Unit 3 — At School

- Disponível para Alice e Mariana com progresso independente.
- **27 palavras e frases** agrupadas em objetos, pessoas, lugares e comandos escolares.
- Instrução em português e pronúncia em inglês para cada item.
- Clicar ou acionar pelo teclado um item já inicia sua pronúncia; nenhum áudio começa apenas ao
  abrir a revisão ou trocar de grupo.
- Depois dos 27 áudios, são liberadas 10 atividades.
- Atividades sobre vocabulário, contagem, tradução, materiais, respeito e `should`/`shouldn't`.
- Alternativas A–D pseudoaleatórias, estáveis e equilibradas por perfil.
- Correção conjunta apenas após a décima resposta.
- Resultado com acertos, erros, alternativa correta e explicação.
- Recompensa final com imagem local da Mita e mensagem própria para cada perfil.
- Ícone de borracha substituído por SVG original.

Chaves:

- `revisoesEscolares.alice.ingles.atSchoolUnidade3.v1`
- `revisoesEscolares.mariana.ingles.atSchoolUnidade3.v1`

### Mariana — Unit 5: City Life

- A revisão existente evoluiu para a versão 2, preservando o mesmo ID, cartão e unidade somente no
  perfil da Mariana. A chave v1 não é lida, migrada ou removida.
- **73 palavras e expressões** com pronúncia local e prática de escrita: os 44 itens anteriores foram
  preservados e receberam exatamente 29 acréscimos.
- Sete grupos em ordem: lugares da cidade; posições; materiais e propriedades; prédios e formas;
  viagens e férias; Dia do Soldado; escola e dias especiais.
- Cada cartão continua iniciando a pronúncia normal por clique, toque, `Enter` ou `Espaço`. Um único
  campo abaixo do item selecionado permite copiar, conferir, corrigir e retomar a escrita.
- Áudio e escrita têm selos e contadores separados. As **30 atividades** são liberadas somente
  depois dos 73 áudios e das 73 escritas conferidas corretamente.
- As atividades intercalam os 16 eixos pedagógicos anteriores com 14 questões novas sobre viagem,
  férias, passaporte, `I went to`, perguntas de viagem, Dia do Soldado, escola, preferências e
  lugares da cidade. Todas usam instrução bilíngue e correção imediata recuperável.
- Correção imediata por questão: um erro mostra uma pista específica, mantém as alternativas
  ativas e bloqueia o avanço somente até a resposta ser corrigida e conferida novamente.
- Voltar e recarregar restauram áudio, texto parcial, conferência de escrita, resposta, conferência de
  atividade, questão atual e pontuação sem duplicação.
- É o piloto da capacidade declarativa `layout.desktopAmplo`: em monitores com pelo menos 1120 px,
  ocupa 94% da viewport e distribui áudio, grupos, resumo/escrita, cartões, atividades e resultado em
  áreas proporcionais. Em larguras menores, conserva o fluxo responsivo existente.
- Unit 3 não ativa escrita e preserva suas chaves e seu comportamento anterior.
- Dez SVGs locais da biblioteca Fluent Emoji Flat foram incluídos para os conceitos novos; nenhum
  PDF, imagem escolar ou recurso da internet foi incorporado.

Chave ativa: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v2`.

Chave histórica preservada: `revisoesEscolares.mariana.ingles.cityLifeUnidade5.v1`.

### Alice — Unit 5: At the Farm

- **Versão 2**, no mesmo cartão e ID, somente para Alice: **97 itens + 30 atividades = 127 etapas**.
- Preserva os 41 itens dos quatro grupos antigos e acrescenta exatamente 56 itens em seis grupos:
  More Animals, Family & Father's Day, Toys, Where Is It?, Little Grammar e School & Special Days.
- Ativa declarativamente `praticaEscrita` obrigatória e `layout.desktopAmplo`, reutilizando a
  infraestrutura da City Life sem mudar controlador, áudio, HTML ou CSS compartilhados.
- As atividades exigem 97 áudios e 97 escritas corretas. A grafia canônica permanece visível;
  somente Father's Day e Happy Father's Day! têm variantes explícitas de pontuação para o 1º ano.
- As 16 atividades anteriores foram reformuladas; as 14 seguintes cobrem família fictícia, datas
  especiais, brinquedos, as cinco preposições e os padrões am/is/are e has/have.
- Correção recuperável por questão, recarga e isolamento preservados. A v1 não é lida, migrada ou
  apagada; limpar remove somente a v2 ativa. Mariana e Unit 3 conservam suas chaves.
- Reutiliza a biblioteca local e acrescenta 18 SVGs originais (13 conceitos e cinco cenas de
  posição). Nenhum PDF, scan ou desenho da professora foi incorporado.

Chave ativa: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2`.

Chave histórica preservada: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1`.


Validação técnica histórica concluída e atividade validada em uso real com Alice em outubro de
2026. O progresso local foi posteriormente limpo pelo responsável, sem alteração da implementação
ou da validação pedagógica realizada. Nenhum progresso foi reconstruído nesta consolidação.
A confirmação não valida separadamente Azure, avaliação automática ou voz instalada.

Detalhes: [At the Farm v2](pedagogia/ALICE_INGLES_AT_THE_FARM_V2.md).


### Melhorias aglutinadas de pronúncia

As melhorias foram concentradas em `js/audio.js` e consumidas por `js/ingles.js`, evitando que cada revisão implemente sua própria voz.

#### Pronúncia direta pelo cartão

- Clicar, tocar ou acionar por teclado um cartão de palavra seleciona o item e inicia sua pronúncia
  em inglês na velocidade normal de 0,62.
- O padrão é compartilhado pela Unit 3 e City Life e passa a valer automaticamente para novas
  revisões de Inglês de Alice e Mariana.
- Os botões “Ouvir em inglês”, “Ouvir devagar”, “Repetir” e “Parar” permanecem disponíveis.
- Abrir uma revisão ou apenas trocar o grupo de vocabulário não dispara áudio.

#### Prática optativa de escrita

- `js/ingles.js` oferece um módulo de escrita ativado por `praticaEscrita`, sem implementação própria
  dentro de cada conteúdo e sem alterar unidades que não optaram pelo recurso.
- O estado compartilhado usa `respostasEscrita` e `conferenciasEscrita`, aceita variações explícitas
  por item, normaliza caixa e espaços e invalida o acerto quando o texto é editado.
- A interface usa campo único com rótulo real, envio por `Enter`, navegação natural por `Tab`,
  mensagens bilíngues em `aria-live`, selos textuais e contadores derivados do conteúdo.
- Quando a escrita é obrigatória, o portão das atividades combina os áudios concluídos com todas as
  escritas corretas. O resumo do cabeçalho também apresenta os dois progressos.

#### Layout desktop amplo opt-in

- `js/ingles.js` aplica a classe genérica `.layout-desktop-amplo` somente quando a unidade declara
  `layout: { desktopAmplo: true }` e a remove automaticamente ao abrir outra unidade.
- `css/estilo.css` mantém todas as regras sob a classe e o breakpoint de 1120 px. O contêiner chega
  a 94% da viewport, com teto de 2360 px, sem transformar a tela em uma única coluna esticada.
- O áudio separa título/controles de vozes/status; o vocabulário separa resumo e escrita da grade de
  cartões; questões só ganham área visual quando possuem imagem; alternativas e resultado usam duas
  colunas quando há espaço.
- City Life v2, Friends · Atividade 1, At the Farm v2 e Play Time ativam o layout amplo. Unit 3
  de Alice e Mariana conserva o layout legado ao ser aberta depois de uma revisão
  optante.

#### Áudio compartilhado

`js/audio.js` atende Alice e Mariana, Inglês e ditados declarativos com vozes locais, uma única
utterance protegida por solicitação, repetição, parada e cancelamento. A revisão mantém pronúncia
normal/devagar e instruções em Português sem criar implementação própria.

A fonte normativa de payloads, idiomas, velocidades, privacidade, controles e validação humana é
[Áudio e voz](infraestrutura/AUDIO_E_VOZ.md). A justificativa arquitetural fica no
[ADR-001](decisoes/ADR-001-PROTECAO_AUDIO_CHROMIUM_WINDOWS.md).

## 8. Leitura

### Biblioteca compartilhada

| Livro                              | Páginas |
| ---------------------------------- | ------: |
| Primeiras Lições sobre Dinheiro    |      25 |
| Quem é o rei dos animais?          |      32 |
| A Galinha dos Ovos de Ouro         |      35 |
| A Raposa e as Uvas                 |      21 |
| O dia que o Sol tirou férias       |      30 |
| A formiga que queria cantar        |      36 |
| Um castelo bem assombrado          |      25 |
| A Bela Desadormecida               |      30 |
| A Joaninha que Perdeu as Pintinhas |      21 |
| Uma Formiga Especial               |      31 |

### Recursos

- Mesmo catálogo e dados totalmente separados por perfil e livro.
- Cartões com capa, autoria, páginas, resumo e situação.
- PDF.js local, renderização em canvas e leitor dedicado amplo.
- Sincronização e persistência de página.
- Cancelamento de renderizações antigas em trocas rápidas.
- Glossário apenas da página atual.
- Questionários com quatro alternativas em ordem estável.
- Ditados com voz local e prefixo protegido no mesmo utterance do conteúdo contra corte.
- Correções, explicações e resultado persistente.
- Explicações de cobiça e eclipse sem alterar pontos ou respostas.
- Conteúdo de inclusão em “Uma Formiga Especial”.
- Limpeza somente do livro ativo e fallback em memória.

### Privacidade dos PDFs

- PDFs escolares reais ficam no computador e são ignorados pelo Git.
- Capas e recursos publicáveis são versionados.
- CI e Windows usam dez fixtures sintéticas originais, com 286 páginas, texto conhecido e desenhos
  verificáveis, geradas em `tests/fixtures/pdfs/` pelo manifesto `tests/fixtures/pdfs.cjs`.
- O servidor Playwright usa `vite.test.config.cjs` e prepara automaticamente as fixtures;
  `npm run preparar:pdfs-teste` oferece preparo explícito. Não lê nem sobrescreve livros reais.
- Tamanho/hash e PDF.js usam o mesmo contrato local/CI. Sete novos casos cobrem preparo em outra
  raiz, idempotência, privacidade, corrupção, links, HTTP e renderização de todas as páginas.

## 9. Prevenções de regressão incorporadas

- Atividades de ordenar não prendem cartões após o primeiro erro.
- Bandejas e posições são reconstruídas do estado salvo.
- Todo item colocado tem caminho reversível.
- Soltar por arrasto não bloqueia o próximo clique legítimo.
- A área grande das colunas aceita clique após seleção da peça.
- Compatibilidade entre peça e ordem continua obrigatória.
- Várias alterações consecutivas são salvas.
- Voltar, avançar e recarregar preservam a representação.
- Reabrir não duplica listeners.
- Limpar uma revisão não apaga outra matéria, perfil ou rodada.
- Áudio antigo é cancelado antes de uma nova pronúncia.
- O início audível da pronúncia é protegido por prefixo dentro do mesmo utterance.
- Lacunas ambíguas de Gramática oferecem ditado opcional sem expor a resposta escrita no controle.
- A tabela de estudo da tabuada deixa de ser acessível de modo persistente quando começam as
  questões avaliativas, sem impedir voltar às questões anteriores.

Teste obrigatório: `errar → conferir → corrigir → conferir → avançar → voltar → recarregar`.

## 10. Testes e qualidade

Ferramentas: Playwright, axe-core, ESLint, Prettier e Vite.

### Cadência de validação

- Toda mudança de código passa por build, formatação e lint.
- Cada nova revisão recebe regressões e testes direcionados de fluxo pedagógico, persistência,
  isolamento, teclado, ponteiro, celular, acessibilidade e console conforme o risco.
- A suíte global roda localmente a cada três revisões ou conjuntos independentes de atividades e é
  antecipada por qualquer mudança comportamental em infraestrutura compartilhada.
- Perguntas ou etapas da mesma revisão contam como um único conjunto para essa cadência.
- Inclusões declarativas com apenas import, cartão ou cadastro central podem usar validação local
  direcionada quando não mudarem o comportamento compartilhado.
- Toda pull request para `main` continua executando a suíte global no GitHub Actions; a saída
  completa é consultada apenas quando houver falha ou necessidade de diagnóstico.

Na data desta integração existem **552 testes Playwright**, todos aprovados na suíte global:

- `tests/pdfs-sinteticos.spec.js`: sete casos de preparo, integridade, privacidade, portabilidade e PDF.js.

- `tests/infra-abertura-local.spec.js`: dois casos de identidade, raiz, porta de testes, recusa de comandos/origem externa e arquivos privados.

- `tests/ingles-alice-play-time.spec.js`: conteúdo, percurso, sessões, áudio, armazenamento, acessibilidade e execução local de Play Time.
- `tests/historia-alice-objetos-memorias-outubro-2026.spec.js`: **20 casos direcionados aprovados**,
  com gabarito independente e percurso completo, 30 pontos, erro/correção/recarga, seleção e
  ordenação reversíveis, escrita flexível, três ditados, sessões, isolamento, limpeza seletiva,
  JSON impossível/inválido, fallback, teclado/toque, 1366 × 768, 1920 × 1080, 390 × 844,
  axe-core, console e `file://` sem rede. Uso real validado em outubro de 2026. Não há confirmação separada da acústica da voz instalada.
- `tests/historia-mariana-memorias-outubro-2026.spec.js`: 30 questões e 30 pontos, gabarito
  independente, cenas locais, seleção/ordenação mista, ditado de frases e normalização de
  História, sessões independentes, persistência, isolamento, acessibilidade e `file://`.
- `tests/ingles-at-the-farm-v2.spec.js`: 97 itens, 30 questões, áudio/escrita, variantes, portão,
  chave v1 preservada, limpeza seletiva, desktop, preposições, axe-core e `file://`.
- `tests/ambiente-interativo.spec.js`: fluxos centrais, revisões de Inglês de Alice e Mariana, Leitura, Matemática ampla, armazenamento, canvas e `file://`.
- `tests/ingles-friends-atividade-1.spec.js`: unidade compartilhada com 25 itens e 25 questões,
  áudio e escrita obrigatórios, portão, correção recuperável, isolamento, armazenamento
  adverso, lógica das ilustrações, viewports, axe-core e `file://`.
- `tests/ingles-mariana-at-school-atividade-2.spec.js`: 25 itens e 25 questões, portão de
  áudio/escrita, conclusão obrigatória do áudio de cada pergunta, cancelamento, normalização,
  percurso completo, refazer, regressão legada, viewports, axe-core e `file://`.
- `tests/ingles-mariana-at-school-atividade-3.spec.js`: 17 itens, Story Time de seis cenas, 25
  questões e quatro grupos, portão de áudio/escrita, áudio bilíngue sem autoplay, consulta da
  história em Q1–Q7 com restauração exata, áudio obrigatório por pergunta, consolidação bilíngue,
  Modo Responsável opt-in com sessões Mariana/Alice, salto puro, restauração e limpeza seletiva,
  mensagem plural opt-in, cenas visuais, armazenamento adverso, isolamento, refazer, viewports,
  axe-core e `file://`.
- `tests/ciencias-mariana-plantas-sol.spec.js`: 30 questões, mapa visual, gabarito completo,
  associações, ordenação, cinco ditados, persistência, isolamento, armazenamento adverso,
  teclado/toque, layouts, axe-core, console e `file://`.
- `tests/matematica-manipulativa.spec.js`: cenas, trocas, ábacos, clique no quadro, teclado, persistência e nova Centenas em ação.
- `tests/acessibilidade.spec.js`: axe e responsividade das telas principais.
- `tests/gramatica-mariana.spec.js`: 40 questões, erro e correção, digitação, teclado, persistência,
  isolamento, limpeza seletiva, conclusão, ditado nas questões 5/7/22, celular, axe e `file://`.
- `tests/gramatica-mariana-portugues-prova-outubro-2026.spec.js`: 35 questões, quatro ditados,
  leitura, ordenação, subitens, tentativas, Modo Responsável, persistência, isolamento,
  armazenamento adverso, layouts, axe-core e `file://`.
- `tests/gramatica-contos-ortografia-pontuacao.spec.js`: 12 testes novos para cadastro exclusivo,
  sequência de 30 questões, maiúsculas/acentos/grafia/pontuação, travessão editável, ditados locais
  sem vazamento de respostas, repetir/parar/cancelar, várias edições persistidas, limpeza isolada,
  desktop 1366 × 768 e 1920 × 1080, celular com toque, axe, console, armazenamento indisponível
  ou corrompido, isolamento visual e execução sem rede em `file://`.
- `tests/gramatica-h-til-vocabulario.spec.js`: conteúdo idêntico com chaves distintas, erro e
  correção, teclado, exigência de sinais gráficos, retorno, recarga, isolamento, limpeza seletiva,
  conclusão, ditado compartilhado da questão 17, celular, axe e `file://`.
- `tests/matematica-operacoes.spec.js`: sequências próprias de 15 e 20 questões, progressão de
  unidades para dezenas, centenas exclusivas da Mariana, digitação, correção recuperável,
  persistência, isolamento, limpeza seletiva, celular, axe e `file://`.
- `tests/matematica-contas-tabuada.spec.js`: 18 questões iguais com chaves próprias, tabela completa,
  bloqueio persistente depois do início das multiplicações, quatro campos por questão, erro e
  correção, retorno, recarga, isolamento, limpeza seletiva, celular, axe e `file://`.
- `tests/matematica-mais-contas-tabuada.spec.js`: nova rodada com números próprios, tabuadas
  configuráveis do 1 ao 3, bloqueio persistente, multiplicações por 3, correção, retorno, recarga,
  isolamento da rodada anterior, limpeza seletiva, celular, axe e `file://`.
- `tests/matematica-dezenas-dinheiro-tabuadas-setembro.spec.js`: igualdade semântica das 30
  questões entre perfis, IDs e chaves isolados, gabarito, modelos visuais quantificados, erro e
  correção, vários campos, pontuação única, tabuadas somente do 2 e do 3, bloqueio persistente,
  limpeza seletiva, teclado, toque, celular, axe-core, console e `file://`.

A cobertura inclui isolamento, erro e correção antes do avanço em City Life e At the Farm,
recarga, Pointer Events, teclado, dados corrompidos, `localStorage` bloqueado, áudio bilíngue,
leitor, ditados, canvas, console, arquivo local e viewport móvel.

City Life v2 acrescenta regressão estrutural para 73 itens e 30 atividades, escrita com erro e nova
tentativa, caixa alta e espaços, edição após acerto, recarga parcial e correta, portão áudio/escrita
nas quatro combinações, chave v1 preservada, limpeza seletiva, fluxo completo das 30 atividades,
teclado, viewport 390 × 844, axe-core e ausência de rolagem horizontal. A capacidade desktop amplo
também é verificada em 1366 × 768 e 1920 × 1080, incluindo distribuição em áreas, áudio após troca
de grupos, questões sem coluna vazia, resultado em duas colunas e remoção da classe nas unidades
legadas.

## 11. GitHub e automações

- GitHub CLI instalado e autenticado.
- Repositório público: <https://github.com/guiufpb/revisoes-escolares>.
- Workflow `.github/workflows/validacao.yml` para `main`, pull requests e execução manual.
- Limite do job: 120 minutos desde o PR #41, mantendo suíte integral e um worker. Em 06/10/2026,
  os 392 testes passaram em 44,5 minutos na CI, mas o limite anterior de 45 minutos
  cancelou o job durante o encerramento; a janela foi ampliada para concluir o check.
- Node.js 24, `npm ci`, Chromium, formatação, lint, PDFs de teste, build e suíte completa.
- Artefatos de diagnóstico por 14 dias em falhas.
- Dependabot semanal para npm e GitHub Actions.
- Formulário “Erro em uma atividade” com orientação de privacidade.
- `main` protegida por check obrigatório, atualização da branch, bloqueio de force-push e exclusão.
- Pull request #1 em rascunho e com check aprovado nesta consolidação.

## 12. Ferramentas auxiliares

- Geração de PDF A4 a partir de cartilhas HTML.
- Geração de previews PNG.
- Validação de HTML, páginas, recursos e PDF.
- Relatório em texto e opção JSON.
- Biblioteca local de ícones e créditos.
- Atalhos Windows independentes do diretório inicial e do perfil pessoal do navegador.

## 13. Mapa principal

| Caminho                          | Responsabilidade                         |
| -------------------------------- | ---------------------------------------- |
| `ambiente_interativo/index.html` | Estrutura das telas e cartões            |
| `ambiente_interativo/css/`       | Estilo e leitor dedicado                 |
| `ambiente_interativo/js/`        | Controladores e registros compartilhados |
| `ambiente_interativo/revisoes/`  | Conteúdo por perfil                      |
| `ambiente_interativo/leituras/`  | Capas e recursos publicáveis dos livros  |
| `tests/`                         | Testes funcionais e de acessibilidade    |
| `scripts/`                       | PDF, previews, validação e apoio à CI    |
| `.github/`                       | Actions, Dependabot e formulário de erro |

## 14. Histórico técnico consolidado

- `105fba3` — ampliação do ambiente e automação das validações.
- `564a6c7` — PDFs vazios nos testes remotos.
- `048b84c` — integridade local dos PDFs separada da CI.
- `cb79555` — renovação completa de Centenas em ação.

O histórico detalhado permanece em `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`; este arquivo é a referência organizada e atual.


## Nova revisão: mariana-gramatica-singular-plural-cotidiano-outubro-2026

Singular e plural no cotidiano

Conteúdo: ambiente_interativo/revisoes/mariana/gramatica-singular-plural-cotidiano-outubro-2026.js

- Integrada à `main` pela PR #48.
- Validação humana em **17/10/2026**: **aprovada, conforme relato do responsável**.
  Evidência relatada: oito questões concluídas e tela final exibida. Não foram incorporados
  prints privados nem realizada avaliação pedagógica formal externa.
- Validação automatizada histórica da PR #48: **277 testes Node e 578 Playwright aprovados**,
  conforme confirmação do responsável. Esse resultado é distinto da validação humana relatada
  e das verificações posteriores da conciliação isolada.
- Conteúdo, gabarito, pontuação, chave de armazenamento e comportamento da revisão preservados.

## Correção local dos decodificadores PDF.js — 18/10/2026

- Mantida a biblioteca 6.3.289 e a arquitetura dos dois leitores. A fachada compartilhada
  configura `wasmUrl`; build publica os 13 recursos WASM/fallbacks/licenças locais em
  `js/pdfjs-wasm/`, sem dependência de `node_modules` no pacote distribuído.
- Doze testes adicionais verificam decodificação efetiva JPEG 2000/CCITT, fallback JS,
  distribuição estática/offline, MIME, API, cancelamento, leitores integrado/dedicado,
  Alice/Mariana e contrato `file://`. Descoberta atual: 44 arquivos, 590 casos Playwright;
  os 578 casos históricos da PR #48 continuam distinguidos desta validação.
- Amostragem autorizada: 21 páginas dos dez PDFs privados, somente leitura, sem cópia
  ou capturas; recuperação dos 118/118 objetos da página afetada. Não certifica páginas
  não verificadas. Documentação temática: infraestrutura/LEITURA_E_PDF.md.
- Implementação e validação iniciais em clone Git independente; a integração operacional
  posterior foi concluída na Fase 3C, conforme registro abaixo.
- Resultado atual, após consolidação: build, format:check, lint e manifesto aprovados;
  277 testes Node aprovados; uma global `npm test` aprovada com 590 testes Playwright
  (41,7 minutos, sem falhas/skips). Inclui os 12 novos casos. Código testado reconferido
  por SHA-256; sem renovação automática de pins, fingerprints ou atestações.
- A Fase 3C foi concluída operacionalmente, conforme confirmação do responsável: abertura
  por duplo clique no novo atalho, Firefox habitual em `http://127.0.0.1:5173`, progressos
  de Alice e Mariana preservados, "Singular e plural no cotidiano" concluída e PDF de
  leitura funcionando, sem erros relevantes relatados. O auxiliar existente usa
  `-SemPronuncia`; Azure não foi ativado nesse teste. O ambiente anterior foi preservado.
- Publicação da correção no GitHub ainda pendente; adoção local não significa publicação.

## Preparação publicável e avisos QuickJS — Fase 4B

- Preparação em outro clone Git independente, preservando o ambiente escolar ativo.
- Mantidos os 13 recursos oficiais do PDF.js 6.3.289 e seus hashes. O aviso complementar
  `ambiente_interativo/js/QUICKJS_LICENSE.txt` reproduz integralmente os dois textos MIT
  oficiais adicionados pelo upstream na PR #22185, com procedência fixa e atribuições.
  O aviso integra o pacote estático, além das seis licenças originais do diretório WASM.
- O contrato estático existente foi ampliado para conferir presença HTTP, MIME e hashes
  dos textos legais, sem novos casos ou redução de asserções: 67 revisões e 590 casos
  Playwright permanecem no manifesto. A global anterior de 277 Node/590 Playwright
  continua histórica; a preparação alterada exige sua própria validação final.
- Documentação temática em `infraestrutura/LEITURA_E_PDF.md`. Registro humano de Mariana
  preservado integralmente, sem alteração de respostas, chaves, pontuação ou conclusão.
- Nenhum staging, commit, push, PR ou merge integra esta etapa. Pins e atestações não
  foram renovados. Materiais privados, output e relatórios locais ficam fora da publicação.

## Fase 5B.5 — manutenção global da infraestrutura (intermediária)

O compositor existente ganhou a capacidade fechada `infraestrutura-global-v1`, sem seletor novo:
revisão explícita vinculada ao snapshot, dez rootInputs PDF.js exatos, bytes Git/binários e delta
integral. Reutiliza R4/global e preserva adição v3/REVIEWED. A CLI distingue capacidade não
aplicável de recusa e não imprime omissões zero em plano inválido. Contrato e formato do registro:
`validacao/COMPOSICAO_ATESTACAO.md`. Resultados direcionados: `tmp/validacao/fase5b5/`.
O pin real continua o da 5B.3; reatestação/global final pendentes. A CI não recebe aprovação
produzida pela PR e permanece inconclusiva sem mecanismo independente explicitamente autorizado.


## Nova revisão: alice-historia-caixa-lembrancas-outubro-2026

A caixa de lembranças

Conteúdo: ambiente_interativo/revisoes/alice/historia-caixa-lembrancas-outubro-2026.js

## Infraestrutura opt-ins — Fase 5C.3G-B2 (validação por snapshot)

Implementação de questionarios-adicao-optins-v1 e adicao-optins-atestacao-composta-v1 para
Gramática literal com duas sessões, Desktop Amplo e ditados existentes. Preserva v3, motores,
executor e CI global. Acrescenta 26 casos permanentes (13 por perfil), sem revisão escolar
nova. Manifesto descobre 623 casos (597 preservados + 26). Corpus mantido manualmente após
revisão e autorização específica, conforme IDENTIDADE.md. A global integral do snapshot
congelado é obrigatória; resultado efetivo em tmp/validacao/fase5c3g-b2/RELATORIO_VALIDACAO_GLOBAL.md.
Esta entrada não declara consolidação nem aprovação de piloto escolar.


## Nova revisão: alice-gramatica-pontuacao-interpretacao-outubro-2026

Sinais de pontuação e interpretação de texto

Conteúdo: ambiente_interativo/revisoes/alice/gramatica-pontuacao-interpretacao-outubro-2026.js

### Fase 3O.4C.5 — preparação das fixtures Git

O helper sintético de materialização reutiliza OIDs reais para Buffers idênticos na mesma
fixture, sem flag experimental ou dependência temporária. A otimização é exclusiva dos testes;
preservam-se planejador, seleção e cobertura. Justificativa e limites em `validacao/README.md`.
