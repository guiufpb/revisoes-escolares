# ORG.8A — piloto físico reversível, somente fixtures próprias

Extensão opt-in posterior: [ORG.8B — recuperação assistida](RECUPERACAO_ASSISTIDA.md).
Permite recuperação após morte do executor somente enquanto uma âncora independente
retém os handles de criação; não adota os cenários antigos desta ORG.8A nem recupera
após perda de todos os processos. A entrada ORG.8A abaixo mantém seus limites originais.

Entrada: `createPhysicalHarness(runId)` em `scripts/validacao/harness-fisico.cjs`.
Backend privado: `scripts/validacao/harness-fisico-win.py`, Python padrão/ctypes,
Windows 64 bits e volume local fixo NTFS. Sem instalação, elevação, serviço ou UI.
Autorização expressa recebida no chat exclusivamente para arquivos sintéticos recém-criados
pelo próprio harness; nenhuma autorização de manutenção de recursos preexistentes.

## Operação efetivamente suportada

Renomeação física `source/counter.bin → source/quarantined.bin`, seguida de restauração
ao nome original, dentro do **mesmo recipiente isolado**. A quarentena é uma entrada
de nome reservado nesse recipiente, não uma pasta/volume distinto nem uma fronteira ACL.
O arquivo conserva seu volume/file ID, tamanho e conteúdo; nunca há cópia seguida de
exclusão, sobrescrita, remoção permanente ou movimentação de pastas.

O movimento entre diretórios foi bloqueado: manter uma trava efetiva contra escrita
e troca dos diretórios conflita com a abertura adicional de destino para esse movimento.
O piloto não relaxa a trava para fazê-lo funcionar. A operação suportada usa nome simples
e `RootDirectory=NULL`, renomeando a entrada relativa ao pai do próprio handle do arquivo.
Somente nomes constantes internos são aceitos. [Contrato nativo de rename](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntifs/ns-ntifs-_file_rename_information).

## Perímetro e comprovação de propriedade

Cada sessão cria exclusivamente `tmp/org8a-<UUID>/`, com criação nativa `FILE_CREATE`
que falha se o destino existir, sem reaproveitar diretório antigo. Dentro dele cria
`source`, `regeneration` e `sentinel`, o arquivo selecionado, duas regenerações físicas,
uma sentinela e `journal.jsonl`. `tmp` deve existir; não há criação de pastas ancestrais.
O prefixo/UUID ou um arquivo marcador **não** provam propriedade.

Propriedade é mantida por handles nascidos das criações exclusivas e retidos pela sessão,
mais IDs exatos de volume/arquivo e dos diretórios. Não se adotam arquivos por caminho
ou por dados recebidos de um journal. A API não recebe raiz, origem ou destino arbitrário.
`runId` segue o contrato sintético anterior; a sessão recebe também root ID independente.
Repetir runId cria outro perímetro, sem reutilizar recursos ou autorizações antigos.

Ancestrais são abertos por componente e sem seguir reparse points; os diretórios próprios
retêm acesso de leitura/listagem e compartilhamento somente para leitura, impedindo
aberturas de escrita e renomeação. Abrir só para atributos não ativava essas travas no
protótipo; o teste detectou a falha e a implementação foi corrigida, sem relaxar a asserção.
O arquivo próprio fica com acesso exclusivo durante a sessão. Todos os reparse points
reconhecidos pelo atributo nativo e hardlinks (`links != 1`) são recusados.
Não há fallback para operações por caminho se a API/trava/filesystem não suportar o contrato.
[Abertura e compartilhamento](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea).

## Integração, simulação e autorização separadas

1. A receita ORG.6B produz o conteúdo; duas novas execuções da receita produzem dados
   para arquivos físicos de regeneração distintos. O backend verifica bytes/SHA-256/tamanho.
2. O verificador do universo controlado adquire e libera seu consumo; o conjunto de
   consumidores ativos precisa estar vazio. Handles retidos para propriedade/manutenção
   não significam trabalho pendente de consumidores.
3. ORG.4D inspeciona somente o novo arquivo selecionado e sua condição no índice/ignore
   da checkout atual, sem escrever Git ou modificar a worktree. ORG.6A adapta a saída,
   ORG.5A valida os envelopes, ORG.6B reconhece e ORG.7 simula o lote de um recurso.
   O Git não é prova de propriedade física; esta vem dos handles recém-criados.
4. `simulate()` devolve o relatório original com `cleanupAuthorization=none`. Mesmo
   `recognized` não permite manutenção. Resultado duplicado, consumidor ativo ou escopo
   conflitante impede a ligação da simulação ao recurso físico e invalida grants anteriores.
5. `authorize({...h.descriptor, intent:'quarantine-and-restore-owned-synthetic'})` é uma
   solicitação explícita, separada da classificação. Exige scope/resource/root IDs exatos,
   simulação válida e sessão viva; aceita somente os campos conhecidos.
6. `quarantine()` e `restore()` usam só o handle original, revalidam file ID, tamanho,
   conteúdo, digest, diretórios, consumidores e localização imediatamente antes de agir.
   Cada operação pode ter apenas um sucesso por sessão; autorização não é reutilizável.
   Reinspeção da entrada em quarentena e grant explícito novo permitem recuperação de
   uma autorização invalidada, sem fabricar autorização a partir da classificação.

`explicitTestAuthorization` no relatório descreve a solicitação de teste aceita; não
altera os contratos antigos ou permite operação sobre qualquer outro recurso.
`identity`, `sha256` e `size` do relatório são o recibo verificado **na criação**;
os eventos guardam as verificações posteriores e suas falhas, não fingindo que o recibo
inicial é um snapshot atual após corrupção/interrupção. Mensagens são códigos fixos e
metadados de fixtures próprias, sem caminhos absolutos ou stderr externo.
IDs e creation time são serializados sem perda numérica. Creation time é informação,
não autoridade: o cache de nomes NTFS pode alterá-lo legitimamente durante rename;
a comparação vinculante usa o handle retido + volume/file ID e conteúdo.
[Identidade NTFS](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/ns-fileapi-by_handle_file_information),
[tunneling de nomes/metadados](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/fltkernel/nf-fltkernel-fltgettunneledname).

## Não sobrescrever e tratar falhas parciais

`NtSetInformationFile(FileRenameInformation)` recebe `ReplaceIfExists=false` e nome
simples, sem resolução de caminhos fornecidos pelo chamador. Um destino criado mesmo
na última janela causa recusa pelo filesystem. O teste cria colisão tanto na quarentena
quanto na restauração e comprova os dois conteúdos preservados. O piloto não remove
nem movimenta a colisão para liberar destino: não é o arquivo selecionado autorizado.
[API nativa](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntifs/nf-ntifs-ntsetinformationfile).

O journal próprio é append-only por handle e recebe flush antes da intenção e depois
da verificação. Contém slot/estado, ID, tamanho e digest, sem conteúdo privado/comandos.
Após rename e antes de confirmar, o estado é `indeterminate`; não se assume sucesso
com base na intenção. `recover()` revalida o handle ainda vivo e identifica a localização
real para permitir a restauração autorizada. Falha antes/depois de ambos os renames é
testada, inclusive restauração completada mas ainda sem recibo final.

Encerrar abruptamente o processo pode deixar intenção sem confirmação e o arquivo em
quarentena. Dados e journal ficam preservados, mas `backend-session-lost` **bloqueia a
retomada automática**: a sessão nova não pode adquirir propriedade por um marcador.
O journal/recibo permite identificar o estado pendente, não prova sozinho sua conclusão
nem autoriza restauração. Não há recuperação automática após morte de processo ou queda
de energia, nem transação atômica entre journal e rename. Isso exige evolução própria.

## Testes e limites efetivos

`node --test tests/validacao/harness-fisico.unit.cjs` usa somente fixtures recém-criadas
no perímetro. Cobre criação/regeneração/restauração; autorização ausente/divergente/replay;
invalidação de grants; consumidor real do harness ativo; duplicação/escopo inválido;
conteúdo/identidade alterados após inspeção; hardlinks; colisões sem sobrescrita; interrupções
antes/depois das etapas; morte efetiva do subprocesso próprio; travas contra troca de pasta
e escrita; junction real; rejeição de qualquer tag reparse na fronteira de metadados;
sentinelas e outra fixture nova fora do perímetro operado sem alterações.

O Windows desta máquina recusou a criação de symlink de arquivo (`EPERM`), sem elevação.
O teste registra a indisponibilidade explicitamente; **não comprova a execução real desse
caso**. A rejeição por atributo reparse, independente da tag, é validada separadamente,
e junctions reais são recusados. Não houve skips ocultando essa limitação.
Outros sistemas/arquiteturas/filesystems retornam capacidade não suportada, sem fallback.
A CI Linux testa a recusa de plataforma e não substitui os testes físicos Windows locais.

O modelo não promete resistência a administrador/kernel malicioso, filtros de filesystem
hostis, alteração do código confiável ou mídia defeituosa. As travas devem ser obtidas;
conflitos, APIs sem suporte, timeouts e metadados indeterminados bloqueiam, sem copiar/apagar.
Fixtures e probes de desenvolvimento ficam preservados em `tmp/org8a-*`, sem limpeza
recursiva ou exclusão automática. Não se acessam materiais escolares nem registros reais.
O backend privado por stdin é componente interno do harness confiável, não serviço para
clientes não confiáveis nem executor de registros ORG ou comandos do navegador.

## Lotes, validação e próximo incremento

Continuidade na branch `codex/org-6a-integracao-evidencias`, HEAD `dfa1b0a`. Baseline dos
21 arquivos anteriores em `tmp/org8a-base-hashes.json`. Adicionados: módulo Node, backend
Python, testes e este documento; referências no documento ORG.7 e no inventário. Contratos
anteriores preservados, sem commit/push/PR/merge/publicação. Log direcionado:
`tmp/org8a-fisicos-final.log`.

Validação inicial: build, formato, lint, sintaxe Python e diff aprovados; direcionados
161/161, incluindo 24 testes Windows do piloto (com a limitação de symlink de arquivo
explicitada acima). Os 19 arquivos herdados fora dos dois documentos atualizados
mantêm os hashes da baseline; trace ORG.6B preservado.

Global integral: `npm test -- -- --output tmp/org8a-global-artifacts`, incluindo pretest
oficial completo. Resultado: 569/569 Node e 638/638 Playwright em 46,1 min de Playwright,
exit code 0, um worker, porta 5189, identidade da worktree confirmada e PDFs sintéticos
oficiais. Log: `tmp/org8a-global.log`; artefatos: `tmp/org8a-global-artifacts`, sem
sobrescrever traces anteriores. Nenhum skip; a limitação do symlink de arquivo aparece
como diagnóstico explícito do teste e não como cobertura real comprovada.
O build preserva o aviso existente de resolução de `pdfjs-wasm` em runtime; warnings
de storage corrompido/bloqueado pertencem aos cenários adversos do harness escolar.
Os recursos sintéticos produzidos, incluindo casos interrompidos, permanecem nos
perímetros criados; não houve limpeza automática ou operação sobre recurso preexistente.

Menor próximo incremento: recuperação assistida de uma sessão encerrada, usando recibo
externo confiável de criação e revalidação física, com autorização nova e limitada ao
mesmo harness sintético. Não estender a worktrees/arquivos preexistentes ou habilitar
movimento entre diretórios sem resolver e testar a garantia de concorrência correspondente.
