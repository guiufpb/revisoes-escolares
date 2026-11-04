# ORG.8B e ORG.8C — recuperação assistida sintética

Entrada opt-in: `createAssistedPhysicalHarness(runId)`, no módulo existente
`scripts/validacao/harness-fisico.cjs`. A entrada ORG.8A `createPhysicalHarness`
preserva seu comportamento. Backend adicional: `harness-recuperacao-win.py`, que
importa as primitivas e o cenário ORG.8A sem copiá-los ou alterar seu contrato.
Windows 64 bits, Python padrão e NTFS local fixo; sem instalação ou elevação.

## Decisão de confiança e limite demonstrado

**Funciona após a morte do executor, enquanto a âncora permanece viva. Não funciona
após encerramento de todos os processos, fechamento do cliente ou reinício da máquina.**

A âncora é um processo separado do executor. Ela cria exclusivamente um cenário
novo `tmp/org8a-<UUID>/` pelos mecanismos ORG.8A e retém todos os handles nascidos
dessas criações. O executor recebe por herança somente dois handles: o arquivo
selecionado e seu diretório pai. Cada executor pode fazer uma única renomeação de
nome constante, dentro do mesmo recipiente, e termina. No teste de interrupção,
`os._exit(7)` o encerra efetivamente depois do rename, antes da confirmação.
A âncora espera sua terminação; não inicia recuperação concorrente com ele.

O Windows mantém os handles herdados ligados aos mesmos objetos. A morte do filho
não fecha as cópias retidas pela âncora, mantendo identidade e travas. A lista de
herança é explícita, com `close_fds=True`; o atributo herdável é retirado no pai
logo após a criação do processo. Não há threads concorrentes lançando processos.
O executor usa pipe anônimo privado, não recebe caminhos arbitrários e não abre
recursos históricos por dados de um recibo. [Herança de handles no Windows](https://learn.microsoft.com/en-us/windows/win32/procthread/inheritance),
[lista explícita de herança em Python](https://docs.python.org/3/library/subprocess.html#subprocess.STARTUPINFO).

A independência é em relação ao **diretório alvo e ao executor**, não um serviço
durável externo ao computador. Mantém-se a continuidade da propriedade por handles,
em vez de tentar reconstruí-la após perdê-los. Nem NTFS file ID, timestamp, nome,
UUID, digest ou assinatura de um JSON bastariam isoladamente para evitar adoção
indevida após perda dessa continuidade, inclusive diante de reutilização de IDs.
Se a âncora morrer, a API retorna `backend-session-lost`; uma nova âncora rejeita o
recibo antigo, mesmo com mesmo runId e conteúdo. Não há importação, descoberta ou
varredura de cenários existentes. O journal nunca é lido como fonte de autoridade.

## Recibo, identificação e autorização

Na criação, a âncora captura em memória um recibo independente do alvo e entrega
uma cópia ao cliente: `receiptVersion=1`, `anchorId`, `receiptId`, `runId`,
`resourceId`, `scopeId`, `rootId`, `fileId`, `directoryIds`, `sha256` e `size`.
Volume e file ID são hexadecimais exatos; não passam por inteiros JavaScript
imprecisos. Não contém caminhos, comandos ou conteúdo de arquivos. IDs aleatórios
vinculam o cenário; não constituem prova autônoma de propriedade ou permissão.
O recibo só é aceito quando coincide integralmente, inclusive tipos e campos,
com a cópia privada da mesma âncora, que ainda conserva os handles de criação.

Fluxo explícito, somente sobre o cenário criado por essa chamada:

```js
const h = await createAssistedPhysicalHarness('assisted-example');
try {
  const simulation = await h.simulate(); // contratos ORG.4D–ORG.7 inalterados
  // Mesmo recognized mantém cleanupAuthorization=none.
  await h.authorize({ ...h.descriptor, intent: 'quarantine-and-restore-owned-synthetic' });
  await h.quarantine('process-exit'); // morte real do executor sintético

  const pending = await h.identifyRecovery(h.creationReceipt);
  if (pending.ok && pending.recoveryNeeded) {
    // Seleção explícita do recurso comprovado, autorização nova e específica.
    await h.authorizeRecovery({
      ...pending.selection,
      intent: 'restore-owned-synthetic-after-worker-exit',
    });
    const restored = await h.restoreAfterExit();
    // Conferir restored.ok/estado; uma falha não significa restauração concluída.
  }
} finally {
  await h.close(); // encerra a âncora; não apaga fixtures
}
```

O exemplo demonstra a API de teste; não é lista de comandos de manutenção.
O chamador deve verificar os resultados de cada etapa. Não há autorização
automática a partir de classificação, simulação, seleção ou recibo.

`identifyRecovery` invalida seleção/grant anterior, confere o recibo e a pendência,
revalida o estado físico e devolve uma seleção com token novo. Se o rename já
restaurou o arquivo antes da morte, informa `state=source`, `recoveryNeeded=false`
e `selection=null`, sem executar novo movimento. Se ainda estiver em quarentena,
exige destino livre e devolve o recurso/escopo/raiz exatos para seleção assistida.

`authorizeRecovery` aceita somente a seleção atual acrescida do intent específico,
revalida novamente e consome o token. `restoreAfterExit` consome o grant **antes**
de tentar a operação. Colisão, falha de início ou nova interrupção exigem outra
identificação e outra autorização. Máximo de 32 seleções consumidas por âncora;
atingir o limite bloqueia, sem apagar ou adotar recursos em outro cenário.
Autorizações iniciais não são válidas para recuperar uma sessão interrompida.

## Revalidação, concorrência e falhas parciais

Reutiliza ORG.8A: volume/file ID, tamanho, bytes, SHA-256, ausência de reparse points
e hardlinks no recurso, identidade dos diretórios, sentinela e consumidores do
universo fechado. Acrescenta raiz exata, localização dos handles próprios e dos
diretórios, além de verificar de novo as duas regenerações físicas retidas.
Nenhum consumidor externo real é presumido resolvido; o universo é o harness.
O executor repete identidade, pai, tamanho e digest imediatamente antes do rename.

As travas permanecem mesmo depois da morte do executor. Tentativas externas de
escrever/substituir o arquivo ou renomear/abrir o diretório para escrita são
recusadas pelo SO nos testes. Como entradas novas ainda podem colidir no destino,
a âncora verifica ausência na identificação, autorização e execução. O executor
verifica novamente; a garantia final continua sendo `ReplaceIfExists=false` da
primitiva ORG.8A. Não remove, renomeia ou sobrescreve uma colisão para liberar espaço.
Nenhuma verificação por caminho substitui os handles de criação.

O journal é escrito pela âncora com flush de intenção antes do executor e de
resultado após verificação. Morte sem confirmação deixa `indeterminate` e pendência,
com exit code efetivamente observado; não transforma a intenção em sucesso.
Relatórios conservam IDs/digest de criação e eventos posteriores sanitizados, sem
stderr, caminhos absolutos, valores de handles ou tokens de seleção. O journal é
evidência auxiliar, não autorização. Não existe transação atômica journal/rename,
recuperação de queda de energia ou promessa contra administrador/kernel hostil.

## Cobertura e evidências

`tests/validacao/harness-recuperacao.unit.cjs` usa apenas cenários físicos recém-criados.
Reutiliza receita, simulação e inspeção existentes; não lê PDFs, progresso escolar,
registros privados, outros diretórios históricos ou fixtures físicas de execuções anteriores.
Cobre morte efetiva do executor; restauração íntegra; recibo ausente, falsificado,
incompatível ou divergente; tokens antigos, escopos e cenários confundidos; consumidor
ativo; conteúdo alterado inclusive com mesmo tamanho; identidade/hardlink divergentes;
colisão; travas externas; falha simulada de criação do executor; restauração interrompida
antes/depois do rename; morte da âncora e recusa de adoção, inclusive após substituição
física por conteúdo idêntico; junction real, sentinelas e outro cenário preservados.
Nenhum cenário é apagado. Casos físicos de reparse e limitações de symlink de arquivo
permanecem cobertos/documentados pela regressão ORG.8A; a máquina não autoriza criar
symlink de arquivo real sem elevação, e não se fabrica comprovação desse caso.

Continuidade na worktree `codex/org-6a-integracao-evidencias`, HEAD `dfa1b0a`.
Baseline dos 27 arquivos herdados: `tmp/org8b-base-hashes.json`. Único código herdado
alterado: orquestrador Node, com fábrica opt-in, backend fixo e métodos de recuperação;
backend nativo ORG.8A e contratos ORG.5A–ORG.7 permanecem idênticos. Documentos alterados:
este, referência no harness e inventário. Sem staging, commit ou publicação.
Validação inicial: build, formatação, lint, sintaxe Python e diff aprovados;
190/190 testes direcionados, incluindo 29 da ORG.8B e os 24 físicos ORG.8A.
Os 24 arquivos herdados fora das três alterações identificadas acima mantêm seus
hashes, assim como o trace original ORG.6B.

Global integral concluída: `npm test -- -- --output tmp/org8b-global-artifacts`,
com pretest oficial completo, **598/598 Node e 638/638 Playwright (45,5 min)**,
exit code 0. Um worker, porta 5189 e fixtures sintéticas oficiais; nenhum teste
reduzido, skip ou retry. Os seis arquivos do snapshot `tmp/org8b-snapshot-global.json`
mantiveram seus hashes durante a execução. Após a coleta, somente este documento
e o inventário receberam os resultados; essas anotações não são bytes da global.
O aviso já existente de resolução de `pdfjs-wasm` e os warnings de armazenamento
dos cenários adversos não impediram a aprovação. A limitação de symlink real
de arquivo da máquina continua explicitamente registrada, sem alegação de cobertura.
Logs próprios: `tmp/org8b-direcionados.log`, `tmp/org8b-global.log`;
artefatos globais: `tmp/org8b-global-artifacts`. Traces/logs anteriores preservados.

## ORG.8C — fluxo local mínimo de seleção e confirmação

Entrada: `scripts/validacao/recuperacao-assistida-cli.cjs`. Não modifica o executor,
o harness ORG.8B, contratos ou semântica de autorização. Usa somente as capacidades
existentes, sem descoberta, serviço residente ou adoção de diretórios anteriores.

Em um terminal local Windows interativo, na raiz desta worktree:

```text
node scripts/validacao/recuperacao-assistida-cli.cjs --demo
```

O demo exige primeiro digitar `CRIAR E INTERROMPER CENARIO SINTETICO`. Isso autoriza
a criação de **um cenário novo próprio**, simulação e quarentena com morte controlada
do executor. A classificação mantém `cleanupAuthorization=none`; o intent físico
inicial separado é associado ao descritor da nova criação. Essa resposta não autoriza
restauração. Cancelar nesse primeiro prompt não cria cenário algum.

Com a âncora ainda viva, o fluxo:

1. Chama `identifyRecovery(h.creationReceipt)` sobre a capacidade viva, sem ler recibos
   de arquivos. Apresenta recurso/escopo, raiz e volume/file ID, estado observado,
   tamanho sintético, digest e verificações aprovadas pela ORG.8B. Falhas preservam
   códigos sanitizados e desconhecidos, sem imprimir caminhos, handles ou stderr.
2. Exige digitar o ID exato do recurso para selecioná-lo. Não escolhe automaticamente
   a única entrada. Qualquer outra resposta, EOF ou Ctrl+C cancela.
3. Exige outra resposta, `RESTAURAR <ID> <desafio>`, exibindo a raiz e a operação
   específica. O desafio usa os 12 primeiros hexadecimais do token da seleção atual;
   não é credencial ou prova independente. Confirmação antiga, genérica, vazia ou
   ausente não concede permissão. Não há `--yes`, variável de aprovação, resposta
   padrão ou reaproveitamento de confirmação. Histórico do readline desativado;
   linhas completas antecipadas são ignoradas; uma linha parcial já presente ao
   abrir o próximo prompt cancela a interação, sem depender de teclas de edição
   que alguns consoles (como `TERM=dumb`) não implementam.
4. Só então chama `authorizeRecovery` com a seleção e o intent ORG.8B específico.
   Se houver recusa, não chama `restoreAfterExit`. A ORG.8B revalida no grant e
   imediatamente antes da operação; a CLI não duplica essas regras.
5. Exibe o resultado efetivo. Se uma operação interrompida não teve confirmação,
   informa `indeterminate` e reinspeciona com `verify()` apenas para relatar a posição
   observada. Mesmo observar `source` não reescreve a falha como sucesso. Não repete
   operação, seleção ou autorização automaticamente. Uma chamada posterior pode
   observar que já estava restaurado, sem fazer outro rename.

A CLI exige `stdin.isTTY===true` e `stdout.isTTY===true`. Pipes/redirecionamentos são
recusados antes de criar cenários. A origem das respostas é o terminal local; isso
não autentica biometricamente uma pessoa nem protege contra um processo hostil que
controle o console/código confiável. O objetivo é exigir interação explícita e
impedir aprovação automática dentro do fluxo. [TTY no Node](https://nodejs.org/api/tty.html#tty),
[eventos e encerramento de readline](https://nodejs.org/api/readline.html#event-line).

`runRecoveryFlow(h, streams)` permite uso equivalente pelo mesmo processo confiável
que já possui a capacidade viva. Não recebe caminhos, seleção pré-aprovada, callbacks
de confirmação ou um JSON para reconstruir propriedade. A injeção de streams serve
a testes explícitos; não é um endpoint para fontes não confiáveis. O chamador dessa
função conserva a responsabilidade de fechar o harness. A CLI fecha sua própria
âncora ao terminar, inclusive em cancelamento, sem manter serviço em segundo plano.
Cancelar preserva bytes e localização do arquivo selecionado; identificação pode
acrescentar eventos ao journal próprio. Não há restauração implícita no cancelamento.
Após fechar a âncora, esse cenário preservado não pode ser reaberto para recuperação.

O resultado do fluxo distingue `restored`, `observed-restored`, `cancelled`, `blocked`
e `indeterminate`. Inclui estado observado, código, se houve autorização aceita e
tentativa de restauração, verificações e `cleanupAuthorization=none`. Verificações
listadas refletem a observação/etapa aprovada, não monitoramento contínuo. Os contratos
ORG.6B/ORG.7 continuam intactos; sua autorização `none` não é elevada pela CLI.
A saída CLI usa exit code 0 para sucesso/observação sem movimento/cancelamento,
2 para bloqueio ou conclusão indeterminada. Não grava relatórios adicionais ou comandos.

### Testes e preservação ORG.8C

`tests/validacao/recuperacao-assistida-cli.unit.cjs` cobre seleção e confirmação
separadas, espera sem resposta, cancelamento, EOF/Ctrl+C, pipe real, flags recusadas,
respostas antecipadas completas/parciais, sanitização, recusa de grant, revogação
quando o terminal fecha antes da operação, mudança de estado após seleção, colisão,
consumidor ativo, âncora encerrada, replay, recuperação física e falha parcialmente
concluída. Reutiliza os módulos existentes e somente fixtures físicas recém-criadas.
Os testes positivos usam streams de terminal **sintéticos**, com cada resposta
roteirizada explicitamente. Não representam confirmação humana real nem a fabricam
como evidência de uso manual. O processo CLI real é testado com pipes para comprovar
sua recusa. Validação humana no terminal real permanece não realizada.

Baseline herdada: `tmp/org8c-base-hashes.json`, 30 arquivos. Código adicionado apenas
na CLI e no teste; documentação alterada apenas aqui e no inventário. Sem mudanças
nos executores, contratos ou testes anteriores. Logs reservados:
`tmp/org8c-direcionados.log` (primeira rodada), `tmp/org8c-direcionados-final.log`,
`tmp/org8c-global.log`; saída global exclusiva
`tmp/org8c-global-artifacts`. Traces, logs, stashes e lotes anteriores preservados.
Validação antes da global: build, formatação, lint, sintaxe Python e diff aprovados;
225/225 direcionados, incluindo 35 da ORG.8C. Os 28 arquivos herdados fora dos dois
documentos atualizados mantêm seus hashes; executores, contratos e trace ORG.6B
preservados. Ajuda da CLI também conferida em TTY real, sem iniciar o cenário.
Global integral concluída: `npm test -- -- --output tmp/org8c-global-artifacts`,
incluindo pretest oficial completo, **633/633 Node e 638/638 Playwright (45,5 min)**,
exit code 0, sem falhas, retries ou skips. Um worker, porta 5189 e fixtures sintéticas
oficiais. Os quatro arquivos de `tmp/org8c-snapshot-global.json` mantiveram seus
hashes durante a execução. Após a coleta, somente este documento e o inventário
receberam os resultados; essas anotações não são bytes da global. Os avisos existentes
de resolução de `pdfjs-wasm` e de armazenamento adverso dos testes escolares não
impediram a aprovação. A limitação herdada de symlink de arquivo real permanece
explícita; não se converteu teste sintético em comprovação humana ou cobertura ausente.

A primeira rodada direcionada teve 223/224: a regressão de confirmação antecipada
parcial detectou que as teclas de edição sintéticas não limpavam a linha no console
usado. O caso tinha capacidade simulada, sem operação física. Corrigida somente a
CLI nova para cancelar ao encontrar uma linha parcial antes do prompt, mantendo a
asserção e os executores inalterados. Reteste do fluxo 34/34; acrescentada também
regressão com harness físico que exige cancelamento antes do grant/segundo prompt.
A falha e os logs permanecem preservados; nenhuma global havia iniciado nessa versão.

## Encerramento do piloto e próximo marco

A cadeia ORG.5A–ORG.8C cobre os componentes necessários ao piloto sintético: evidência
independente, adaptação, classificação conservadora, simulação, criação física própria,
quarentena/restauração sem sobrescrita, âncora viva, revalidação e confirmação explícita.
Com a validação final aprovada, encerra-se o ciclo de implementação/experimentação
física sintética; há base suficiente para consolidação/revisão técnica do acumulado.
Isso não certifica um executor genérico ou arquivos reais. Não se abre ORG.8D.

O próximo marco deve preparar uma composição revisável para integração Git, mediante
autorização separada, e escolher uma primeira classe real restrita, avaliando-a
**somente em leitura**. Candidato a avaliar: artefatos descartáveis de testes produzidos
por invocações novas e explicitamente delimitadas do próprio projeto, com produtor e
consumidores demonstráveis. Logs/traces existentes permanecem evidências preservadas;
não são presumidos dispensáveis por estarem em tmp/output ou serem antigos/ignored.
Nenhuma inspeção ou limpeza real dessa classe foi iniciada nesta etapa.

Recuperar após perda de todos os processos permanece fora do contrato. Persistir ou
assinar recibos isoladamente não resolve a continuidade física; até haver confiança
demonstrada, o comportamento correto continua sendo recusa, sem nova fase automática.
