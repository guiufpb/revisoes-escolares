# Worktrees, catálogo e entrega local

Este documento define o fluxo de isolamento, localização e acesso às revisões locais de todas
as matérias. Siga a precedência de `AGENTS.md`. A segurança do trabalho em worktree deve ser
acompanhada de uma entrega que permita ao responsável reencontrar e abrir a atividade.

## Escolha da cópia de trabalho

Use uma worktree quando houver conflito entre trabalhos pendentes, desenvolvimento simultâneo
ou risco concreto de interferência, especialmente em controladores, áudio, armazenamento e
navegação. Ter uma revisão aguardando validação ou publicação, por si só, não torna obrigatório
criar outra worktree. Uma inclusão compatível pode ocorrer na cópia habitual, preservando lotes
e alterações alheias; havendo conflito, interrompa a mistura e escolha isolamento adequado.

Antes de escrever, execute o preflight de Git. Identifique raiz, branch, HEAD, remoto, branch
padrão, commits locais fora da base remota, pendências, stashes, worktrees e capacidades da base.
Reutilize uma cópia adequada da tarefa quando possível; não ocupe uma de trabalho independente. Não
presuma que a branch remota padrão contém recursos presentes somente em outra cópia ou em
alterações não commitadas. Não faça stash, descarte, transplante ou merge automático de trabalho
alheio para obter uma base limpa. Criação/registro de worktree segue as ferramentas e regras
vigentes; commit, push, PR, merge e publicação continuam exigindo autorização explícita.

Registre qual cópia serve para desenvolvimento e qual é a pasta de uso habitual. Identifique-as
por Git e pelo launcher efetivamente utilizado, sem fixar um caminho de máquina na documentação
versionada. A pasta habitual não precisa estar na branch `main`: confirme sua branch real.

Uma worktree nova prepara os PDFs sintéticos de regressão pelo mecanismo oficial de
[Testes e validação real](TESTES_E_VALIDACAO_REAL.md#pdfs-sintéticos-e-preparo-reproduzível).
Não use cópia automática de materiais escolares privados como dependência da suíte.

## Launcher, servidor e pronúncia

O [launcher principal](../../../abrir_ambiente_interativo.bat) e o
[launcher Chromium](../../../abrir_chromium_ambiente_interativo.bat) são wrappers de
[scripts/abrir-ambiente-local.ps1](../../../scripts/abrir-ambiente-local.ps1). Ambos passam
explicitamente a própria raiz; Chromium acrescenta a opção de navegador. O auxiliar valida
package.json, arquivos essenciais e dependências da cópia selecionada. Não troca de
worktree nem reúne atividades de outras branches.

Antes de preparar pronúncia ou abrir navegador, verifica a porta habitual e a identidade do
servidor. A preparação chama somente o
[auxiliar de pronúncia](../../../scripts/preparar-pronuncia-azure.ps1) da raiz selecionada.
O gateway existente continua opcional: falha não impede estudo ou áudio local. Consulte
[Pronúncia com Azure](PRONUNCIA_AZURE.md). Os comandos npm run dev e npm run interativo
continuam disponíveis, com porta 5173 e strictPort; o segundo solicita abertura do navegador.
Esses comandos diretos não preparam pronúncia nem reutilizam servidores. Para o fluxo completo,
use o auxiliar compartilhado.

Uma entrega isolada deve oferecer acesso por duplo clique, além do diretório e do caminho até
o cartão. Reutilize os auxiliares; não duplique gateway, credenciais, fila de áudio ou controlador.
Não redirecione o launcher automaticamente à tarefa mais recente. Verifique destinos dos atalhos
e dependências; diferencie inspeção de abertura efetivamente testada.

Na origem habitual, o auxiliar inicia Vite com --host 127.0.0.1 --port 5173 --strictPort.
A proteção também está em vite.config.js e nos comandos npm; impede porta alternativa mesmo
se a ocupação ocorrer entre conferência e início. A identidade é confirmada após iniciar e
imediatamente antes de abrir, inclusive após atrasos de login Azure. O Vite criado fica oculto;
mantenha a janela do launcher aberta durante o estudo. A limpeza só pode encerrar o processo
criado pela própria invocação. Ao reutilizar um servidor confirmado, não assume sua propriedade
nem o encerra.

Progresso depende de protocolo, host, porta, perfil do navegador e chaves da aplicação. Mudança
de origem ou perfil pode mostrar armazenamento separado; não diagnostique perda nem limpe,
copie ou migre progresso automaticamente. Mantenha os contratos de
[Armazenamento e progresso](ARMAZENAMENTO_E_PROGRESSO.md).

### Identidade e ocupação da porta

O plugin de desenvolvimento em
[scripts/identidade-ambiente-local.cjs](../../../scripts/identidade-ambiente-local.cjs) fornece
GET /__revisoes_local__/identity (e HEAD). A resposta contém somente application:
revisoes-escolares, schema: 1 e copyId. O ID é SHA-256 da raiz real normalizada, com namespace
e versão; normaliza caixa no Windows. Não inclui branch, caminho absoluto, usuário, catálogo
ou variáveis Azure. Identifica a cópia para impedir reuso acidental; não autentica contra
processos locais maliciosos capazes de imitar o protocolo.

O endpoint é de desenvolvimento, não entra no bundle e não executa ações ou comandos. Recusa
métodos diferentes de GET/HEAD, Host não local e Origin diferente do próprio servidor; usa
Cache-Control: no-store. O Vite bloqueia o catálogo privado e os diretórios locais tmp,
output, .codex e .git, também nas URLs /@fs/ correspondentes à raiz servida.

| Situação em 5173 | Comportamento do auxiliar |
| --- | --- |
| Livre | Prepara pronúncia opcional da raiz escolhida, inicia com strictPort e confirma identidade. |
| Mesma cópia, identidade válida | Compara o ID esperado e revalida antes de reutilizar/abrir. |
| Outra cópia | Recusa abertura e preparação; não encerra o servidor. |
| Identidade ausente, inválida ou serviço estranho | Informa identidade indisponível; exige identificação e ação explícita do responsável. |

Um servidor legado ativo não recebe identidade inventada nem é presumido como entrada do
catálogo. Quando a porta está livre, o auxiliar pode servir uma cópia antiga explicitamente
selecionada usando o executável Vite dela e a configuração de desenvolvimento da infraestrutura.
A nova instância recebe identidade sem editar essa worktree. As dependências da cópia e da
infraestrutura devem permanecer instaladas; não remova a cópia que fornece o auxiliar enquanto
os atalhos privados dependerem dela.

Opções locais: -Raiz, -Navegador Chromium, -SomentePronuncia, -SemPronuncia e -Verificar.
-Verificar apenas valida e diagnostica, sem pronúncia, servidor ou navegador. Não há parâmetro
de porta habitual nem seleção de raiz pelo navegador. -SomentePronuncia também recusa um
servidor de outra cópia ou sem identidade na porta habitual.

### Evidências e limites da validação de 07/10/2026

Os testes Windows cobrem duas raízes, espaços/acentos, dependências, porta livre, mesma/outra
cópia, respostas inválidas, strictPort e corrida de porta. A partida real do auxiliar em cópia
legada foi verificada em porta isolada explicitamente pelo harness. Os dois .bat também foram
executados contra o servidor legado real em 5173 e recusaram a abertura.

Na auditoria inicial, esse servidor foi preservado e a abertura manual com 5173 livre ficou
pendente. Posteriormente, o responsável forneceu validação humana dos dois launchers: navegador
padrão e Chromium abriram http://127.0.0.1:5173/ambiente_interativo/index.html, com perfis e revisões
carregados. O Vite exibiu Local: http://127.0.0.1:5173/ e nenhuma porta alternativa foi observada.
O responsável também informou gateway em http://127.0.0.1:5190 e /health com ok:true e configured:true.
Essa é evidência humana fornecida pelo responsável, não validação visual executada pelo Codex;
ela não comprova avaliação de pronúncia, uso de microfone, audição ou uso infantil. Comandos,
isolamento e limitação de CI Windows constam em [Testes e validação real](TESTES_E_VALIDACAO_REAL.md).

## Catálogo privado de revisões locais

Ao entregar uma revisão ainda isolada, registre ou atualize sua entrada no catálogo local,
quando existente. Na instalação que motivou este fluxo, ele é `MINHAS_REVISOES_LOCAIS`, na pasta
habitual identificada por Git. O nome é uma convenção local; não crie catálogos concorrentes em
cada worktree. Preserve entradas anteriores e confirme a localização antes de atualizar.

Cada entrada deve permitir recuperar:

- perfil, matéria, título e IDs de revisão/unidade quando disponíveis;
- diretório, branch e arquivo de conteúdo, com caminho até o cartão;
- data da conferência, disponibilidade da cópia e forma de abertura;
- localização da integração: isolada, cópia de integração ou pasta habitual;
- evidências e pendências de testes, validação humana e ações de Git/publicação.

Localização e validação são informações distintas. A presença do arquivo não comprova testes;
testes simulados não comprovam audição humana, Azure real ou uso infantil. Registre origem e
alcance de resultados recebidos de outro chat. Não transforme “merge remoto concluído” em
“pasta habitual atualizada” nem deduza que todas as atividades estão numa cópia de integração.

Na instalação inspecionada, o catálogo contém `catalogo-local.json`, um índice legível,
instruções e atalhos. Essa organização não é um formato obrigatório para outras instalações.
Seus registros de estado são descritivos; eles não formam um controlador de progresso nem um
novo schema do aplicativo. Preserve compatibilidade dos auxiliares ao alterar o formato.
Metadados estruturados adicionais precisam ser definidos e verificados na tarefa correspondente.

O auxiliar privado existente pode delegar a abertura ao auxiliar compartilhado com raiz
explicitamente selecionada. Preserve os argumentos dos atalhos antes de adaptá-lo. No modo de
pronúncia, escolha a entrada indicada ou solicite seleção/cancelamento sem uma entrada padrão;
nunca use a primeira disponível. Na adaptação local de 07/10/2026, JSON e 17 atalhos foram
preservados; apenas auxiliar e instruções privados mudaram. O atalho .url para ambiente já
em execução continua sendo acesso explícito ao servidor atual, sem seleção de cópia ou garantia
de identidade; suas instruções distinguem esse acesso do fluxo verificado.

Mantenha caminhos absolutos, comandos locais, atalhos e registros privados fora do Git, usando
exclusão local apropriada. Não publique o catálogo da máquina, PDFs, OCR, prints ou credenciais.
Não importe os arquivos privados para bundles nem suponha que exclusão do Git substitui os
cuidados com recursos servidos ou exportados. A documentação versionada registra o procedimento,
não a lista privada de diretórios da família.

Atualize a entrada quando houver entrega, pausa relevante, integração ou mudança de localização.
Se uma cópia desaparecer, conserve sua referência e marque o acesso indisponível até localizar
o trabalho; não apague a entrada silenciosamente nem recrie conteúdo como se fosse a mesma versão.
O catálogo facilita localizar: não é backup, integração ou autorização para arquivar worktrees.

## Integração e encerramento

A integração à pasta habitual é uma etapa explícita, sujeita às autorizações de Git vigentes.
Identifique base e destino, preserve mudanças locais, resolva conflitos e execute as verificações
exigidas pelo alcance. Não copie pastas inteiras nem reúna branches para apenas facilitar acesso.
Atualize os registros da revisão e do catálogo sem alterar suas chaves de progresso indevidamente.

Commit, push, PR e merge remoto não atualizam automaticamente a pasta local que o responsável abre.
Depois da integração autorizada, confirme que essa pasta/branch contém a revisão e que o
launcher e o servidor apresentam o cartão, preservando a origem e o perfil habituais. Diferencie
pronta para validação, validada, integrada localmente e publicada.

Antes de remover ou arquivar uma worktree, confirme preservação recuperável do trabalho e acesso
funcional à atividade. Arquivos ignorados necessários não devem ser considerados incluídos em
um snapshot sem verificação. Não elimine materiais privados, estado ou cópias alheias por rotina.
Siga as regras das ferramentas de arquivamento e a autorização aplicável.

## Catálogo dentro do ambiente interativo — proposta futura

**Ainda não implementado.** A proposta é uma seção do responsável para localizar atividades,
mantendo o fluxo infantil e os controladores de revisão existentes. Sua implementação exige
escopo próprio, preflight, definição de dados/ações, verificação visual e testes.

O primeiro incremento recomendado é um painel de consulta:

1. Exibir perfil, matéria, título, localização, disponibilidade e pendências verificáveis.
2. Para uma revisão registrada na cópia em execução, abrir pelo roteamento existente e consultar
   seu progresso pela chave principal, sem criar um cartão ou progresso paralelo.
3. Para atividade somente em outra cópia, indicar “fora desta cópia” e oferecer instruções de
   acesso. Uma referência não deve fingir que o conteúdo foi integrado ou está disponível ali.
4. Ler apenas uma fonte local opcional e validada, definida na implementação; sem ela, preservar
   a aplicação atual. Distinguir a fonte privada de localização do registro normal de revisões.
5. Tratar caminho antigo, arquivo ausente, dados inválidos, entradas duplicadas e estado
   desatualizado sem fabricar disponibilidade, conclusão ou validação.

Uma página web comum não pode ler livremente diretórios Git nem iniciar um `.bat`, atalho ou
comando do sistema por um link convencional. Portanto, não prometer um botão de abertura de
outra worktree sem mecanismo local compatível e testado. A ação de abrir revisão da cópia atual
é diferente de iniciar o servidor de outra cópia.

Se um incremento posterior precisar coordenar servidores pelo navegador, deverá definir um
auxiliar local separado, com ações explícitas do responsável, IDs permitidos e diretórios
confirmados. Não aceitar comandos ou caminhos arbitrários vindos do navegador ou do catálogo;
validar origem, entradas e ciclo de vida, preservar servidores alheios e não mudar a origem
habitual silenciosamente. Não ampliar o gateway de pronúncia para execução genérica de comandos.
Nenhum serviço ou modificação de launcher está autorizado automaticamente por esta proposta.

Uma futura implementação deve testar navegação, teclado/toque, foco, isolamento, fonte ausente
ou inválida, referência externa indisponível, atualização após integração e separação entre
localização e progresso. Mudanças em navegação, registros, armazenamento, launcher ou estrutura
seguem os gatilhos de [Testes e validação real](TESTES_E_VALIDACAO_REAL.md), além dos contratos
de [Layout e acessibilidade](LAYOUT_E_ACESSIBILIDADE.md). Testes de serviços usam simulações;
não ativar microfone ou consumir Azure como efeito de consultar o catálogo.

## Checklist de entrega

- [ ] Cópia, branch, base e lote identificados; trabalho alheio preservado.
- [ ] Isolamento justificado e capacidades confirmadas na base efetiva.
- [ ] Atividade registrada no catálogo privado existente, com evidências e pendências precisas.
- [ ] Acesso por duplo clique e caminho até o cartão entregues; pronúncia preparada quando aplicável.
- [ ] Origem/perfil habituais preservados; conflito de porta tratado sem encerrar servidor alheio.
- [ ] Inspeção, testes simulados e validação humana diferenciados no relato.
- [ ] Após integração autorizada, pasta habitual e entrada do catálogo reconferidas.
- [ ] Antes de arquivar, preservação do trabalho e acesso verificados.
