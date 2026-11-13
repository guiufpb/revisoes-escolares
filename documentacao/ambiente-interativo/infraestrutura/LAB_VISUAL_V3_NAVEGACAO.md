# LAB Visual v3 — prévia navegável isolada, 3D

## Fechamento dos achados P2 — 13/11/2026

Estado atual: global local do 3D aprovada no snapshot ANTERIOR aos reforços de testes P2.
Os checkpoints de global pendente abaixo são registros históricos; nenhum é reescrito.

- Global: 1811/1811 Node, 850/850 Playwright, saída 0, reporter passed/complete:true;
  zero falhas, skips, cancelamentos, retries, flaky ou timeouts. Nove hashes estáveis.
- Execução em processo filho isolado com core.longpaths=true temporário, configuração
  persistente preservada e porta 5181 liberada. Outras 42 worktrees e stash preservados.
- Comparação observacional inconclusiva: 29 diagnósticos de capturas, 25 de ZIPs congelados,
  sem plano CI local conclusivo. Não equivale a comparação observacional aprovada.
- Auditoria final sem P0/P1: dois P2 de cobertura e um P2 de fechamento documental.
- Reforços posteriores à global: observer comprovado por alteração DOM antes de qualquer
  consultarEstado() do teste; consultas do renderer contadas no helper VM. Foco interno
  verificado pela identidade exata do aviso e tabindex=-1, antes e depois da reação assíncrona.
- Validação desta correção: 57/57 direcionados (24 testes 3D e 33 regressões 3C.2,
  incluindo P3 de foco), sem falhas/skips/cancelamentos. Nenhum defeito de produção revelado.

Evidências da global em tmp/3d-global-20261113T005122/ e reporter
em tmp/validacao/2026-11-13T03-54-32-139Z-b83771c9-4dfc-4ef8-8374-9610375e8b75/run.json.
Reforços em tmp/3d-p2-testes.log; hashes anteriores e posteriores em tmp/3d-p2-antes.json
e tmp/3d-p2-depois.json. Código de produção do 3D, módulos anteriores e fixtures preservados.
A global de 1811/850 NÃO executou estes oráculos posteriores. O snapshot final de testes
aguarda decisão sobre nova validação integral; nenhuma global adicional foi iniciada.
Sem aprovação de CI remota, commit ou publicação do 3D.


Base: 49c73400cfa0d938dd1d015f9c713b1b3bdafc23. Contrato opt-in
lab-v3-navegacao-1. Complementa a projeção 3B, o serviço 3C.1 e o renderizador 3C.2
sem modificar seus códigos ou contratos. Não é importação nem execução escolar.

## Página e API

ambiente_interativo/lab-visual-previa.html é uma página local independente, aberta
explicitamente pelo endereço correspondente no servidor local. Não há link no index escolar,
registro de revisão, alteração do launcher ou carregamento pelo app.entry. Scripts/CSS
homologados são carregados antes do controlador; o bootstrap da página apenas cria a prévia.

lab-visual-navegacao.js exporta somente criarPreviaNavegavelVisual(raizDOM), com exatamente
um Element do documento anfitrião. Dependências DOM/JavaScript são confiáveis, não constituem
fronteira contra scripts hostis no mesmo runtime. A raiz tem propriedade exclusiva por WeakMap.
Recusas da fábrica: objeto congelado {status:recusado,codigo,admissaoOperacional:false},
com NAV_RAIZ_INVALIDA ou NAV_PROPRIEDADE_OCUPADA, sem montar outra interface.

Sucesso: objeto congelado com somente consultarEstado(), encerrar() e descartar().
O snapshot público fechado/congelado contém formato, estado, indice (zero-based ou null),
total, acoes congeladas {anterior,proxima,selecionar,encerrar}, apresentacao (estado 3C.2
ou null), erro (código próprio ou null) e admissaoOperacional:false. Não há getter de File,
bytes, nome, manifesto, projeção, hash, URL, referência, gabarito ou alvo de ditado.

Estados: inicial, lendo, preparando, aguardando-liberacao, apresentando, disponivel,
falha, encerrada e descartada. Imagens adiadas são situação do renderizador, não falha
analítica. encerrar é idempotente e permite nova seleção; descartar é terminal/idempotente,
remove listeners/painel e libera somente sua propriedade. O host é responsável pelo foco
fora da interface quando decide removê-la definitivamente.

## Seleção e propriedade

Seleção exclusivamente por input file nativo, com rótulo e sugestão ZIP. MIME/extensão
não autorizam conteúdo. Seleção vazia/cancelada preserva a atividade atual; o input é
esvaziado para permitir selecionar de novo o mesmo arquivo. Uma seleção efetiva invalida
a anterior antes de eventual recusa: questões antigas não continuam expostas.

Tamanho positivo e inclusivo até 71303168 bytes conferido antes de FileReader. O resultado
ArrayBuffer tem tamanho novamente conferido e é convertido em Uint8Array ordinário.
Somente preparar(bytes) do 3C.1 recebe esses bytes; não há chamada analítica duplicada.
Leitura trata load/error/abort e exceção síncrona, removendo handlers na conclusão.
Referências ao arquivo/buffer/bytes são abandonadas quando deixam de ser necessárias;
o serviço conserva exclusivamente seus recursos privados homologados.

O controlador cria uma preparação por seleção aceita para processamento e um renderizador
por contexto disponível. Usa o total da projeção autêntica e passa apenas índices ao 3C.2.
Não copia a projeção nem inspeciona o DOM para inferir identidade ou resposta.

## Drenagem e gerações

Uma leitura/preparação ativa por controlador; um único candidato substituto File,
sem leitura antecipada. Nova seleção substitui o candidato. Na substituição/encerramento:
incrementar geração, cancelar timer, abortar leitura, desconectar observer, limpar e
descartar renderizador, então descartar preparação. Não há await antes dessa invalidação.

O contexto anterior fica retido somente para impedir sobreposição. Nova leitura/preparação
exige finalização da tarefa controlada anterior E observacao.decodificacoesAtivas === 0
da API pública do serviço antigo. Uma promessa resolvida por descarte não prova drenagem.
Há no máximo um setTimeout de 250 ms enquanto houver candidato aguardando; cada callback
confere geração. Não é timeout de validade, retry do pacote ou promessa de liberação física.

encerrar cancela acompanhamento e candidato; uma seleção posterior reconfere a drenagem
retida. descartar também abandona essa referência, sem iniciar outro serviço. Operação
nativa sem conclusão pode impedir nova preparação; a interface explica e permite encerrar.
Não se promete cancelamento físico ou limpeza instantânea de RAM. O limite é por controlador;
a página isolada monta uma instância. Não existe pré-carregamento, fila de cliques ou candidatos
materializados em paralelo. Temporários ainda usados por tarefas antigas dependem da conclusão
nativa e do GC, mesmo após invalidação lógica.

## Navegação, observer e foco

Anterior/Próxima chamam somente renderizarQuestao(indice), com limites e guarda síncrona
contra transições/pedido de imagem pendente. aria-disabled mantém botões focalizáveis;
o handler impede a ação. Voltar não restaura respostas ou progresso: não existem no 3D.
Exibir/Ocultar, orçamento, referências e handles continuam sob controle do 3C.2/3C.1.

MutationObserver observa apenas childList/subtree do conteúdo, incluindo remoção do artigo.
Notificações são coalescidas em microtask e verificam geração; o DOM é apenas sinal para
consultarEstado do renderizador. Controles 3D estão fora da área observada. Não há inferência
de falha pelo texto/estrutura de um artigo nem observer de atributos privados. Promessas
iniciadas pelo controlador atualizam diretamente o estado, independentemente do observer.

Após navegação, o marcador persistente Questão X de Y recebe foco somente se o iniciador
continua focalizado. Foco movido para fora é preservado; callbacks antigos nunca o recuperam.
O P3 do 3C.2 conserva o foco em seu aviso após falha tardia; o observer não o redireciona.
Falhas de leitura/preparação usam mensagem própria genérica; falhas do renderizador não
são anunciadas outra vez pelo controlador. Campos e ditados permanecem demonstrativos/neutros.

Códigos de estado: NAV_TAMANHO_INVALIDO, NAV_LEITURA_FALHOU, NAV_LEITURA_ABORTADA,
NAV_PACOTE_RECUSADO, NAV_APRESENTACAO_FALHOU e NAV_PREPARACAO_FALHOU.
Não são ecoadas exceções, paths, nomes ou detalhes privados do pipeline. Texto sempre literal.
Não há heurística para respostas que o próprio autor tenha colocado no conteúdo livre.

## Validação e limites

Testes Node/VM simulam leitor/serviço/DOM e timers para provar estados, propriedade, abort,
candidato único, drenagem após cancelamento lógico, geração terminal e observer desconectado.
Não constituem prova de codecs. Chromium usa os pacotes sintéticos existentes, FileReader,
pipeline e imagens reais, input file, teclado/toque, axe e três viewports.
A retenção de decode no teste apenas adia a API nativa original: ela é executada depois;
não simula aprovação de pixels. Falhas de leitura/tamanho e cancelamento do seletor usam
instrumentação/eventos controlados e não alegam automação do diálogo do sistema operacional.

Primeira rodada 17/21: quatro falhas da instrumentação de contagem de serviços, instalada
depois da captura da dependência pelo módulo. Corrigida somente a instrumentação, passando
a observar a fábrica antes do carregamento. Rodada seguinte 21/21; ampliações posteriores
acrescentam cenários de navegação pendente e bootstrap da página original.

Regressões anteriores 615/615 aprovadas nesta worktree, preservando v1/v2, 3B/3C.1/3C.2 e
V0–V4. Evidências locais em tmp/3d-regressoes.log e tmp/3d-regressoes-comando.json.
Os resultados finais dos novos testes e verificações constam do checkpoint de entrega.
Nada disso equivale à global aprovada do 3D: DOM/HTML/CSS exigem npm test integral pelo
AGENTS.md, com parada obrigatória e autorização separada antes de iniciar.

Sem importação, persistência, pontuação, respostas editáveis, correção, progresso, áudio,
microfone, Modo Responsável, uploads ou integração operacional. Sem zoom, miniaturas,
atalhos adicionais ou seleção direta de questão. Sem garantia de RAM física; até os tetos
analíticos, snapshot/extração e recursos podem consumir memória expressiva. Medições com
dispositivos modestos, validação pedagógica e leitores de tela reais continuam necessárias.

## Checkpoint direcionado — 13/11/2026

24/24 testes novos aprovados: 9 Node/VM e 15 Chromium, incluindo o bootstrap da página
original sem instrumentação. Regressões anteriores 615/615; total 639/639 (467 v3 e
172 v1/v2), zero falhas/skips/cancelamentos no lote final. V0–V4, equivalência ZIP e APIs
anteriores aprovados. Build, format:check, lint e git diff --check aprovados.

Evidências: tmp/3d-direcionados.log (23/23 antes do teste de bootstrap),
tmp/3d-direcionados-final.log (tentativa do bootstrap com MIME incorreto no servidor de teste),
tmp/3d-direcionados-final-2.log (24/24), tmp/3d-regressoes.log e tmp/3d-build.log,
tmp/3d-format.log, tmp/3d-lint.log, tmp/3d-diff.log. O MIME da rota HTML foi corrigido
no harness, sem mudanças no produto ou enfraquecimento do teste. As falhas intermediárias
não são declaradas aprovadas. Nenhum fixture congelado ou oráculo anterior foi alterado.

Base/HEAD 49c73400cfa0d938dd1d015f9c713b1b3bdafc23, branch
codex/lab-visual-v3-navegacao-3d. Global 3D ainda não iniciada. Após autorização,
usar npm test integral, sem filtros, com porta livre e configuração temporária de caminhos
longos em processo filho isolado conforme a evidência Windows dos incrementos anteriores.
Não modificar configurações Git persistentes. Parar antes da global, sem staging ou publicação.
