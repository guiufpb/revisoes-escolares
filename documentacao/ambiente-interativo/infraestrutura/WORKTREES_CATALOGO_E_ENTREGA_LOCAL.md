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

## Launcher, servidor e pronúncia

O [launcher principal](../../../abrir_ambiente_interativo.bat) usa `cd /d "%~dp0"`: inicia
o projeto da pasta em que está e não reúne atividades de outras branches ou worktrees. Após
verificar as dependências, chama o [auxiliar de pronúncia](../../../scripts/preparar-pronuncia-azure.ps1)
e então `npm run interativo`. Os comandos em [package.json](../../../package.json) são distintos:
`npm run dev` inicia Vite; `npm run interativo` inicia Vite e pede abertura do navegador.
Nenhum deles prepara o gateway por si só. A pronúncia Azure é opcional; sua indisponibilidade
não impede usar a revisão ou o áudio local. Para o protocolo do gateway, consulte
[Pronúncia com Azure](PRONUNCIA_AZURE.md).

Uma entrega isolada deve oferecer acesso por duplo clique, além do diretório e do caminho até
o cartão. Reutilize o launcher ou seus auxiliares vigentes; não duplique gateway, credenciais,
fila de áudio ou controlador. Não altere o launcher compartilhado automaticamente para
redirecioná-lo à tarefa mais recente. Verifique os destinos dos atalhos e a presença das
dependências locais. Diferencie inspeção dos atalhos de abertura efetivamente testada.

Confirme que o servidor apresenta a atividade da cópia escolhida. Preserve servidores de outras
tarefas. Na origem habitual, use uma cópia por vez: diante de porta ocupada, identifique o
servidor, avise e não encerre processo alheio nem escolha silenciosamente outra porta. Separar
portas para testes é possível pela configuração suportada, mas não equivale a preservar o
acesso habitual ao progresso. Antes de Playwright, confirme também a cópia servida e as
dependências privadas conforme [Testes e validação real](TESTES_E_VALIDACAO_REAL.md).

Para abertura isolada na origem habitual, a configuração suportada é
`npm run interativo -- --port 5173 --strictPort`, executada na cópia escolhida após verificar
dependências e, quando aplicável, preparar a pronúncia pelo auxiliar existente. Isso permite
falhar se a porta for ocupada entre a conferência e o início. O acesso por duplo clique deve
usar essa proteção por meio dos auxiliares locais disponíveis; o comando sozinho não é um atalho.

Progresso depende de protocolo, host, porta, perfil do navegador e chaves da aplicação. Mudança
de origem ou perfil pode mostrar armazenamento separado; não diagnostique perda nem limpe,
copie ou migre progresso automaticamente. Mantenha os contratos de
[Armazenamento e progresso](ARMAZENAMENTO_E_PROGRESSO.md).

### Limites observados na auditoria documental de 07/10/2026

Estas evidências são inspeção estática, sem executar launchers ou serviços. São pendências para
tarefa própria; este protocolo não altera o funcionamento atual:

- O launcher principal chama `npm run interativo` sem porta explícita ou `--strictPort`, e
  [vite.config.js](../../../vite.config.js) não define essas opções. Não há garantia de falha
  diante de porta ocupada. Recomenda-se explicitar a origem habitual e a falha no launcher.
- O [launcher Chromium](../../../abrir_chromium_ambiente_interativo.bat) inicia `npm run dev`
  e aceita qualquer HTTP 200 no endereço habitual, sem identificar a cópia servida nem preparar
  a pronúncia. Pode abrir um servidor anterior. Recomenda-se conferir a identidade da cópia e
  tratar ocupação antes da abertura, mantendo a preparação opcional como etapa distinta.
- [playwright.config.js](../../../playwright.config.js) usa `reuseExistingServer: true` sem
  conferir a identidade da cópia. Recomenda-se tornar essa identidade verificável ou impedir
  reutilização indevida na futura correção; um resultado contra outro servidor não valida a entrega.
- Na instalação inspecionada, o auxiliar privado usa a primeira entrada do catálogo no modo
  de preparação de pronúncia, sem identificar o servidor atual. O nome do atalho não comprova
  esse destino. Recomenda-se seleção explícita da cópia ou conferência do servidor antes de
  anunciar preparação do ambiente atual; essa particularidade não é capacidade do aplicativo.

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
