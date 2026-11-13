# LAB Visual v3 — renderizador isolado, incremento 3C.2

## Checkpoint final de consolidação local — 12/11/2026

Estado atual: snapshot corrigido P3/P4 aprovado na global final local. As declarações de
pendência nos checkpoints abaixo descrevem seus snapshots históricos, não o estado atual.
Nenhuma aprovação de CI remota é atribuída: o incremento ainda não foi publicado.

- Primeira global reprovada: 1782/1784 Node, duas falhas ambientais por caminho longo,
  Playwright não iniciado, saída 1.
- Prova ambiental: 2/2 aprovados com core.longpaths=true temporário.
- Segunda global aprovada, anterior ao P3: 1784/1784 Node, 850/850 Playwright, saída 0.
- P3/P4: foco interno recuperado após falha tardia, foco externo preservado e geração
  obsoleta sem roubo de foco; 615/615 testes direcionados aprovados.
- Global final do snapshot corrigido: 1787/1787 Node e 850/850 Playwright, saída 0,
  reporter passed/complete:true, zero falhas, skips, cancelamentos, retries, flaky e
  timeouts. Nove hashes estáveis; contratos anteriores e V0–V4 preservados.

Comparação observacional inconclusiva: 29 diagnósticos de capturas e 25 de ZIPs congelados,
sem plano CI local conclusivo. Não confundir aprovação funcional ou completude do reporter
com comparação observacional aprovada.

A global final usou processo filho isolado e core.longpaths=true temporário, confirmado
com origem command line. Configurações persistentes preservadas; processo encerrado,
porta 5181 liberada e variáveis ausentes no processo pai após a execução. O registro
histórico restaurado:false da execução anterior permanece preservado, sem reinterpretação.

Evidências preservadas em tmp/3c2-global-final-p3p4-20261112T175932/: global.log,
exit-code.txt, config-efetiva.log, preflight.json e conferencia-final.json. Reporter:
tmp/validacao/2026-11-12T21-02-53-837Z-e1f41d13-3f8e-4099-8d24-e0eb4128cd6f/run.json.
Somente os três documentos receberam este fechamento após a global; os seis arquivos
não documentais continuam byte a byte iguais ao snapshot validado. Sem nova implementação,
integração escolar, 3D ou publicação. A suíte não foi repetida para consolidar documentação.


Base: 5203524bda05f0b12e195c779f59059f023138c3. Contrato opt-in
lab-v3-renderizador-1, sem registro no aplicativo escolar, importação, navegação entre questões,
respostas, correção, áudio, persistência ou progresso.

Reutiliza [lab-v3-previa-1](LAB_VISUAL_V3_PREVIA.md) e o
[serviço lab-v3-ilustrada-1](LAB_VISUAL_V3_IMAGENS.md). Não altera os módulos anteriores:
não recebe ZIP, manifesto, bytes, hashes ou URLs; não analisa, projeta ou decodifica recursos.

## API pública

lab-visual-renderizador.js exporta somente criarRenderizadorVisual(raizDOM, servicoIlustrado).
CommonJS em Node, LabVisualRenderizador em scripts deliberadamente carregados no navegador.
Não modifica app.entry.js, index.html operacional, registros ou controladores escolares.

A fábrica exige exatamente dois argumentos: Element com ownerDocument/defaultView e instância
do serviço 3C.1 disponível. Consulta somente consultarEstado/consultarProjecao e reconhece os
formatos, disponibilidade e admissaoOperacional:false. Projeção deve estar congelada.
São verificações de compatibilidade do consumidor, não um segundo validador do manifesto.
Dependências JavaScript e DOM são confiáveis: não há autenticação criptográfica de funções
fornecidas por código hostil no mesmo runtime.

Recusa de fábrica: status recusado, erros [{codigo,caminho:"",origem:"renderizador"}],
admissaoOperacional:false, sem modificar o serviço ou o DOM.

Sucesso: objeto congelado com quatro métodos:

- renderizarQuestao(indice): promessa; índice inteiro zero-based da projeção ativa.
  Busca a questão diretamente no serviço; não aceita questões reconstruídas ou argumentos extras.
  Índice inválido recusa sem apagar uma renderização válida.
- consultarEstado(): snapshot formato/estado/admissaoOperacional:false,
  figuras:{total,exibidas,adiadas}, operacaoPendente. Revalida vínculo ativo e pode limpar DOM
  desatualizado quando detectar alteração externa do contexto.
- limpar(): síncrono e idempotente; cancela logicamente a geração, libera os handles em ordem
  inversa, remove listeners e somente o painel controlado; permite nova renderização.
- descartar(): limpeza definitiva; libera propriedade e impede reutilização. Idempotente.

renderizarQuestao retorna o snapshot de estado quando conclui a tentativa inicial, ou recusa.
Estados: inicial, carregando, completo, imagens-adiadas, falha, limpo, descartado.
Durante carregamento, adiadas conta figuras ainda sem handle, incluindo a pendente.
Uma tarefa de geração antiga pode manter operacaoPendente:true enquanto uma questão nova,
sem imagens, já está completa. Não é autorização operacional nem nova validação de pixels.

Códigos próprios: RENDER_ARGUMENTOS_INVALIDOS, RENDER_CONTEXTO_INCOMPATIVEL,
RENDER_PROPRIEDADE_OCUPADA, RENDER_INDICE_INVALIDO, RENDER_DESCARTADO,
RENDER_INVALIDADO, RENDER_CONTEXTO_INVALIDADO, RENDER_IMAGEM_FALHOU,
RENDER_ESTRUTURA_INVALIDA, RENDER_OCUPADO, RENDER_FIGURA_ADIADA.
Não ecoam mensagens nativas, dados do pacote, stacks, gabaritos ou alvos.

## Propriedade e contexto

WeakMaps privados vinculam instância de serviço e raiz a um dono. Dois renderizadores não
controlam simultaneamente a mesma instância ou raiz. limpar conserva propriedade; descartar
libera somente se o token ainda for seu. Descarte repetido antigo não remove dono novo.
Não há registro global de hashes ou conteúdo.

O renderizador usa exclusivamente consultarProjecao(), consultarEstado() e
criarApresentacao(usoVisual). Nunca chama preparar() ou descartar() do serviço.
O proprietário externo deve chamar renderizador.limpar() ANTES de preparar/substituir/descartar
a preparação ilustrada. Somente essa preparação recebe o ZIP.

O 3C.1 cria novos envelopes de consulta, mas conserva a mesma árvore de projeção enquanto
o contexto permanece ativo. Por isso o vínculo compara r.projecao por identidade, não r.
Reconfere antes de operações, após awaits e em consultas. Sem cooperação externa não há
notificação imediata de substituição; não se acrescentam polling, hooks ou alterações no 3C.1.

## DOM e fidelidade

Cada geração cria painel próprio dentro da raiz; irmãos de outros componentes são preservados.
Textos usam textContent e elementos/atributos fixos, sem innerHTML, interpretação de entidades,
templates ou HTML. <, >, &lt; e aparência de tags permanecem literais.
IDs DOM recebem prefixo local por renderizador; IDs de projeção servem apenas a associações
e atributos de teste, nunca como respostas ou chaves de progresso.

Questão: título fixo da prévia e faixa não avaliativa; bloco, título, instrução, dica,
visuais e subitens na ordem da projeção. Não se inventam blocos intercaláveis.
Subitem: pergunta, visuais, alternativas estáticas ou campo demonstrativo não editável.
Ditado: título/idioma/unidade e rótulos neutros existentes, sem alvos, áudio ou entrada.
Não existem inputs, radios, seleção, correção ou pontuação.

Figuras: espaço reservado, aviso, descrição essencial enquanto a imagem não está exibida,
rótulo em figcaption, grupo quando aplicável, descrição longa em details/summary e botão.
O próprio img vem do serviço com alt contextual; a descrição curta de fallback é ocultada
quando o img é exibido para evitar anúncio duplicado. Descrições longas continuam acessíveis.

Conjuntos: seção nomeada por rótulo e texto da relação. Comparação/grade/agrupamento usam
lista não ordenada; sequência usa lista ordenada. Nunca role grid ou resposta manipulativa.
Agrupamento mostra índice de grupos na ordem declarada e rótulo de grupo junto a cada figura,
preservando elementos na sequência original inclusive quando intercalados. Não duplica imagens
por grupo e não ordena elementos pelos arrays elementoIds.
Somente imagens essenciais recebem aria-describedby para o rótulo de grupo; decorativas
mantêm alt vazio e ficam fora da árvore de imagens acessíveis.

## Imagens, falhas e concorrência

Carregamento inicial sequencial, no máximo um pedido de apresentação pendente por renderizador.
Passa o objeto imagem autêntico da projeção, sem copiar ou serializar suas referências.
Instala o elemento somente após conferir geração, contexto e estado pronto do handle.
Cada posição já existe no DOM: a ordem de conclusão nunca determina a ordem de leitura.

Nova renderização invalida a anterior. limpar/descartar resolvem o cliente como cancelado
sem aguardar a conclusão nativa. Uma apresentação atrasada é liberada imediatamente.
Enquanto um pedido antigo não termina, nova renderização não faz outro pedido: mantém figuras
adiadas e botões de exibição desabilitados, liberando-os quando o pedido antigo terminar.
Não há fila adicional ilimitada ou promessa de cancelamento físico. Se a API nativa nunca
concluir, o slot pode permanecer ocupado; o serviço documenta a mesma limitação.

Recusas ILUSTRADA_ORCAMENTO_OCUPADO/FILA_OCUPADA preservam figura, texto/legenda/descrição
e permitem tentativa explícita posterior. Botões Exibir figura N/Ocultar figura N atuam só
na apresentação. Ocultar chama liberar, preserva o botão/foco e retorna a descrição de fallback.
Não expulsa imagens, não cria segundo orçamento e não faz retry automático em loop.
Estado completo exige handle para todas as figuras da questão, ou nenhuma figura.
Figuras ocultadas/adiadas impedem qualificar a exibição como completa.

Falha real na segunda/última imagem ou error tardio invalida a renderização, libera todos
os handles, remove o artigo incompleto e exibe mensagem segura por região de status.
Se o serviço falhou, cabe ao proprietário limpar e preparar novamente; se continua disponível,
uma nova renderização pode recuperar. Não se substitui silenciosamente imagem por outra.
Listeners são removidos antes de liberar o handle, inclusive após erro do próprio 3C.1.

No tratamento de falha vigente, o foco é consultado imediatamente antes do rollback.
Se estava dentro do painel removido, o aviso recebe tabindex=-1 e foco programático;
nesse caso aria-live=off evita solicitar também o anúncio pela região viva. Se o foco
estava fora, permanece intacto e o aviso conserva role=status com anúncio implícito.
Ocultação, orçamento ocupado e limpeza comum não transferem foco. Callbacks obsoletos
continuam recusados antes do tratamento de falha, sem foco ou reinserção de conteúdo.

DOM não é fronteira contra scripts externos. O futuro consumidor deve preservar src/alt e
chamar liberar pelos mecanismos corretos. Conteúdo livre pode conter respostas escritas pelo
autor; não há OCR ou filtro heurístico. Garantia estrutural vem da projeção homologada.

## Acessibilidade e layout

CSS em lab-visual-renderizador.css, restrito a .lab-v3-renderizador; sem regras globais.
Fonte de sistema, alto contraste, botões grandes, foco visível, imagens proporcionais sem
recorte e texto com quebra segura. Duas colunas em telas amplas e uma em celular; rolagem
vertical permitida. Uma questão principal por painel. Não usa modo Desktop Amplo do aplicativo.
Sem zoom modal ou arrastar.

Cabeçalhos h1/h2/h3/h4, listas, figure/figcaption, details/summary e botões nativos.
aria-controls/aria-expanded vinculam o botão ao espaço da imagem. Nomes numéricos locais
contextualizam as figuras. Região role status/aria-live polite atualiza a mensagem apenas
quando o texto muda, sem anunciar toda a questão a cada imagem.

## Harness e validação

tests/fixtures/lab-visual-renderizador.html carrega explicitamente os módulos e CSS isolados.
Não contém seletor de ZIP ou navegação. Testes fornecem exclusivamente pacotes sintéticos e
índices conhecidos. Servidor efêmero serve uma lista fechada de arquivos, navegador/contextos
descartáveis; nenhuma revisão escolar real é aberta.

Node/VM usa DOM/serviço simulados e projeção produzida pelo 3B real para estados, propriedade,
argumentos, vínculo, cancelamento, liberação e falhas controladas; não prova layout/codecs.
Chromium usa preparação 3C.1 real, imagens, DOM, CSS e axe. A falha nativa de apresentação
revoga deliberadamente a segunda URL depois de preflight válido: img.decode rejeita,
sem simular um erro de codec ou alterar bytes. Wrappers de teste identificados exercitam
fila ocupada e resultados retidos; não são hooks de produção.

Cobertura de orçamento usa três utilizações de um mesmo PNG sintético 2048x2048, sem novos
fixtures congelados. Todos os fixtures anteriores, contratos v1/v2, 3B/3C.1 e V0–V4 preservados.
Verificações direcionadas e pendência global constam do checkpoint final.

Infraestrutura DOM/CSS exige global integral conforme AGENTS.md. Parar antes de npm test,
aguardar autorização e não atribuir a este snapshot a CI dos incrementos anteriores.

## Checkpoint direcionado — 12/11/2026

30 testes novos aprovados: 16 Node/VM e 14 Chromium. Lote final 595/595: 440 testes v3
(410 anteriores + 30 novos) e 155 regressões validador/backup v1/v2, zero falhas/skips/cancelamentos.
V0–V4 e as APIs 3B/3C.1 permanecem exatos nas regressões. Build, format:check, lint e
git diff --check aprovados. Nenhum módulo homologado anterior foi alterado.

Axe sem violações em 390x844, 1366x768 e 1920x1080. Teclado Enter/Space e toque real pelo
contexto hasTouch testados nos controles de figuras; foco conservado no mesmo botão.
PNG 2048x2048 real confirma adiamento da terceira instância e retomada após ocultar outra.
Falha nativa após a primeira imagem comprovada por rejeição de img.decode com URL de segunda
apresentação revogada pelo teste, depois de preflight válido; rollback sem imagens/handles.

Captura sintética tmp/3c2-mobile-sintetico.png inspecionada: estrutura legível, sem cortes ou
sobreposição. Os vetores normativos de um pixel permanecem intrínsecos, não são ilustrações
pedagógicas reais. A legibilidade de futuras imagens depende de autoria/material representativo;
não se aumenta artificialmente esses vetores nem se afirma validação infantil.

Evidências locais: tmp/3c2-regressoes-checkpoint.log, tmp/3c2-build.log,
tmp/3c2-format-final.log, tmp/3c2-lint-final.log. Tentativas iniciais preservadas, incluindo
correção do harness axe para contexto explícito e remoção de aria-describedby de imagens
decorativas; testes mantiveram exigência de zero violações. Globais de navegador nos testes
foram declaradas para lint; nenhum oráculo anterior/fixture congelado foi relaxado.

Global 3C.2 ainda não iniciada. Após autorização, conferir porta livre e, se necessários,
preparar exclusivamente os PDFs sintéticos oficiais nesta worktree; comando previsto:
$env:PLAYWRIGHT_PORT='5181'; npm test. Integral, sem filtros ou redução de cobertura.
Não houve staging, commit, push, PR, merge, sincronização escolar ou início do 3D.

## Encerramento histórico da global e correções P3/P4 — 12/11/2026

O checkpoint anterior permanece histórico. A primeira global terminou com 1782/1784 Node,
duas falhas ambientais por limite de caminho do Git, Playwright não iniciado e saída 1
(tmp/3c2-global.log e tmp/3c2-global-exit-code.txt). A prova ambiental direcionada passou
2/2 com core.longpaths=true temporário (tmp/3c2-longpaths-direcionados.log).

A segunda global aprovou o snapshot ANTERIOR à correção P3: 1784/1784 Node e 850/850
Playwright, saída 0, reporter passed/complete:true, zero falhas, skips, retries, flaky ou
timeouts; nove hashes estáveis. Evidências: tmp/3c2-global-longpaths.log,
tmp/3c2-global-longpaths-exit-code.txt e
tmp/validacao/2026-11-12T11-22-09-881Z-0b893e2c-154b-4f31-b710-5835d16638ca/run.json.

A comparação observacional permaneceu inconclusiva, sem plano CI local conclusivo:
29 diagnósticos de capturas e 25 de ZIPs congelados. Não equivale a comparação aprovada
nem altera o resultado da suíte ou a completude do reporter.

Configurações Git persistentes foram preservadas. O registro original restaurado:false
em tmp/3c2-longpaths-ambiente-restaurado.json permanece: o finally deixou quatro entradas
de ambiente vazias. O processo encerrou e as variáveis estavam ausentes no ambiente
posterior; não se afirma restauração integral naquele processo.

A correção P3 trata o foco interno/externo após falha tardia sem mudar APIs ou rollback.
O helper Node apenas passa a modelar Element.contains; a suíte Chromium ganha regressões
de foco interno, foco externo e resultado atrasado de geração invalidada, com conferência
de liberação. O P4 acrescenta este encerramento e seus resumos no inventário/LAB.
Resultados desta rodada serão registrados separadamente; a global histórica não homologa
o novo snapshot corrigido.

Nova global integral obrigatória pelo gatilho DOM do AGENTS.md, ainda NÃO iniciada:
aguardar autorização. Na execução futura, preferir processo filho isolado com ambiente
controlado (GIT_CONFIG_COUNT=1, GIT_CONFIG_KEY_0=core.longpaths, GIT_CONFIG_VALUE_0=true,
PLAYWRIGHT_PORT=5181 após confirmar porta livre), npm test integral e encerramento verificável.
Não alterar configuração persistente nem reutilizar a restauração .NET com entradas vazias.

### Validação direcionada da correção — 12/11/2026

33/33 testes do renderizador aprovados (16 Node/VM e 17 Chromium), incluindo as três
regressões novas: foco interno transferido ao aviso após falha, foco externo preservado
e resultado obsoleto liberado sem roubar foco da questão atual. Os cenários de falha
confirmam artigo/imagens removidos, pixels/URLs/listeners liberados e admissão falsa.
O caso obsoleto retém uma apresentação real antes da invalidação, não apenas um pedido vazio.

Regressões adicionais 582/582: 410 v3 e 172 v1/v2 (incluindo 17 de backup no Chromium).
Total desta rodada: 615/615, sendo 443 v3 e 172 v1/v2, sem falhas/skips/cancelamentos.
V0–V4 e equivalência das APIs 3B/3C.1/ZIP aprovados. Build, format:check, lint e
git diff --check aprovados; sem alteração dos módulos anteriores ou fixtures congelados.

Evidências novas em tmp/3c2-p3p4-20261112T170944/: renderizador.log, regressoes.log,
regressoes-comando.json, build.log, format.log, lint.log, diff.log e códigos de saída.
hashes-antes.json registra os nove arquivos e as evidências anteriores; a conferência
posterior identifica os seis arquivos alterados por P3/P4. Logs históricos preservados.
Esses resultados são direcionados: nova global do snapshot corrigido ainda NÃO iniciada.
