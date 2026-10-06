# Play Time · Unit 6 · Outubro de 2026

Implementação original da síntese fechada, a partir de `origin/main` (`8e82c89`), na branch
`codex/alice-ingles-play-time-outubro-2026`. Naquela etapa, a Gramática da Mariana permanecia
no checkout original. Sua incorporação posterior em `main` foi preservada na consolidação atual.

## Identidade e percurso

- Revisão `alice-ingles-play-time-unidade-6-outubro-2026`, unidade
  `play-time-unidade-6-outubro-2026`, arquivo de conteúdo em
  `ambiente_interativo/revisoes/alice/ingles-play-time-unidade-6-outubro-2026.js`.
- Chave principal `revisoesEscolares.alice.ingles.playTimeUnidade6Outubro2026.v1`.
- Chave auxiliar `revisoesEscolares.mariana.ingles.playTimeUnidade6Outubro2026Compartilhada.v1`.
- Pronúncia `play-time-unidade-6-outubro-2026-conversacao-v1`.
- 25 itens (V01–V19 palavras; F20–F25 frases compostas), 25 áudios completos e 25 escritas
  corretas para abrir a preparação. Transcrição guiada com modelo escrito. Variantes são
  declaradas explicitamente, incluindo combinações de apóstrofos tipográficos; a normalização
  compartilhada continua limitada a caixa/espaços.
- S01 brinquedos; S02 cores/números/tipos de bola; S03 posições; S04 ações/ambientes;
  S05 materiais; S06 exemplo independente de comparação. Uma etapa `historia`, seis painéis,
  áudio EN→PT e consulta em todas as questões. Não há controlador de contexto paralelo.
- 25 questões, 25 pontos; total no registro: 25 + 1 + 25 = **51 etapas**. Cada conferência,
  inclusive incorreta, requer consolidação EN→PT→EN→PT. Q25 só finaliza depois da sequência.
- Dez conversas opcionais/20 alvos, sem pontos ou etapas obrigatórias. Referências EN sem
  prefixo acústico, modelos a 0,50, limite 15 s, timeout 12000 ms, faixas 75/45 e gateway
  `http://127.0.0.1:5190/api/pronunciation`. Consentimento renovado por sessão e descarte em memória.

## Contratos visuais

Os 61 SVGs originais usam o prefixo `play-time-` em `assets/objetos_escolares/`. Regeneração:
`node scripts/gerar-assets-play-time.cjs`. O script não lê material escolar privado, não acessa a
rede e não depende de serviço de imagem. Reproduz somente a geometria original desta revisão.

- Quatro bolas: duas azuis, uma vermelha e uma verde.
- Sete crianças: três meninos e duas meninas seguram fios; dois meninos sem balão têm avião e
  bicicleta. Um menino e uma menina seguram dois balões cada: sete balões no total. Cada criança
  é identificada individualmente em Português, sem legenda com contagem pronta.
- Apoio sobre a mesa/cama e posição debaixo do tampo são explícitos, com chão/pernas visíveis.
- A/B preservam duas crianças, fundo, roupas, avião azul no chão, bola de praia e dois discos
  voadores. Somente sete grupos variam: bandeirinha, avião vermelho da prateleira, dardo,
  robô/boneca, futebol/basquete, arranjo dos mesmos quatro blocos e cor do cubo com numeral 1.
- Q21/Q22 acrescentam apenas setas neutras. O asset pós-resposta de Q22 usa a mesma base,
  sete marcadores e legendas EN/PT; não acrescenta perguntas nem pontos.
- Quatro versões para celular empilham A/B e ampliam as legendas, preservando exatamente
  a geometria interna e as sete diferenças das versões de desktop.
- Q23 indica o quadro da bicicleta com seta e detalhe metálico; Q24 mostra boneca de pano com
  costuras/tecido; Q25 mostra papel e plástico moldado em dois brinquedos distintos.

## Extensões compartilhadas

`ingles.js`: `textoPerguntaVisivel` opcional altera somente o cabeçalho da questão;
`rotuloAcessivel` descreve alternativas visuais; `ordemAlternativasFixa` preserva a sequência
declarada; `data-unidade` permite CSS restrito à revisão. O áudio e a consolidação continuam
usando a pergunta integral. Os comportamentos legados sem opt-in continuam vigentes.
`imagemEnunciadoMobile` e `imagemRespostaMobile` opcionais selecionam SVG local via `picture`
até 720 px. A revisão usa cenas amplas em todas as telas, alternativas visuais legíveis e
comparação empilhada no celular; a origem móvel da revisão é removida ao trocar de questão.

`pronuncia.js` e HTML: imagem local/descrição opcionais por par; validação do nome do arquivo,
limpeza de src/alt, recipiente oculto quando ausente. Troca/encerramento de sessão e saída
desativam a pronúncia, cancelam captura/avaliação e limpam consentimento. Sem nova persistência,
gravação em arquivo, servidor, engine, fila de áudio ou alteração do gateway/launcher/Azure.
Descrição e mensagem de indisponibilidade opt-in identificam as dez conversas de Play Time;
configurações anteriores conservam os textos originais do Activity 3.

## Validação e limites

`tests/ingles-alice-play-time.spec.js` verifica conteúdo fechado, recursos, sete diferenças,
estudo integral, variantes, edição, interrupção, preparação, consulta, erro/correção, retorno,
recarga, Q25, Refazer, armazenamento adverso/bloqueado, sessões, limpeza seletiva, microfone/gateway
simulados, imagens, 20 modelos a 0,50, celular/toque, desktop, axe-core e `file://`.
As capturas e logs ficam somente em `output/play-time/` e `output/*.log`, excluídos localmente.
Os PDFs legados necessários às regressões foram copiados para caminhos ignorados nesta worktree,
sem alterar os originais ou incluir documentos privados no conjunto de mudanças.

Build, `format:check`, lint e os **16/16 testes direcionados** passaram após os ajustes finais.
As verificações cobrem 1366 × 768, 1920 × 1080 e 390 × 844, com cenas A/B e conversas responsivas,
nomes acessíveis e ausência de violações axe-core graves/críticas. A auditoria estrutural e a
inspeção das capturas confirmaram as sete diferenças, as permanências e as relações de posição.
Em **04/10/2026**, `npm test` terminou com **331/331 aprovados em 23,4 min**, incluindo os
16 testes novos e todas as regressões anteriores disponíveis nesta base. `git diff --check`
também passou. Logs: `output/play-time-directed-complete.log` e
`output/play-time-global-complete.log`. Duas execuções anteriores incompletas e uma execução
interrompida para corrigir textos herdados não foram contadas como aprovação global.
A regeneração dos 61 SVGs foi executada novamente após a suíte; os hashes SHA-256 de todos
permaneceram idênticos. Nenhum conteúdo testado mudou nessa conferência.

Uso real validado em outubro de 2026, conforme confirmação do responsável, incluindo clareza,
fluxo e execução com Alice. Testes simulados não validam acústica, pronúncia real da criança ou Azure real.
Nenhuma voz do usuário foi gravada nem avaliação real disparada. Na inspeção pelo navegador
embutido não apareceu voz local en-US, embora a enumeração somente de leitura do Windows tenha
encontrado Microsoft Zira Desktop en-US habilitada. Não há evidência técnica separada da exposição dessa voz no navegador de uso
ou da audição humana nesta revisão. Não houve instalação de voz ou mudança do serviço.

## Plano histórico de conciliação

Sobreposição com o lote pendente da Mariana no checkout original:

- `ambiente_interativo/index.html`: preservar o novo cartão de Gramática e acrescentar o cartão
  Play Time, o recipiente de imagem/textos na seção de pronúncia existente e a fonte responsiva
  da imagem pós-resposta.
- `ambiente_interativo/js/app.entry.js`: manter ambos os imports.
- `ambiente_interativo/js/app.js`: preservar visibilidade/roteamento de ambos os cartões.
- `ambiente_interativo/js/registro-revisoes.js`: manter ambos os registros exclusivos.
- `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`: manter as duas entradas.
- `tests/ambiente-interativo.spec.js`: reconciliar o total do catálogo e os dois testes de
  unicidade. Play Time isolado acrescenta um registro (55→56); com Mariana acrescentam-se dois
  sobre esta base (55→57). A suíte global deve confirmar o resultado combinado.

Também integrar as mudanças em `ingles.js`, `pronuncia.js`, CSS, as três fontes de infraestrutura,
este documento, o conteúdo novo, o gerador, os SVGs e os testes específicos. Nenhum arquivo da
revisão de Gramática da Mariana deve ser substituído. Gerar novamente o bundle após a integração;
não copiar o bundle gerado como fonte nem editar PDF.js manualmente.

Não houve commit, staging, push, merge ou publicação. Branch e stash originais preservados.

## Consolidação local — outubro de 2026

Uso real validado em outubro de 2026. A Gramática da Mariana mencionada no histórico
foi incorporada em main por `e88ad36`/`937989e`; a integração atual mantém esse conteúdo.
O catálogo integrado contém 59 revisões. Azure, gateway e avaliação automática de Play Time
continuam com as ressalvas técnicas acima. At the Farm v2 foi incluída após autorização específica,
por extração seletiva; o stash original e os prompts misturados permanecem preservados.

## Validação da consolidação — 06/10/2026

As quatro revisões foram conciliadas na branch
`codex/integracao-revisoes-validadas-outubro-2026`, com 59 registros no catálogo.
Build, `format:check`, lint e `git diff --check` passaram. Passaram também os testes
direcionados das quatro revisões: **62/62 (4.8m)**; as regressões compartilhadas:
**112/112 (8.8m)**; e `npm test` integral: **392/392 (28.6m)**.

Os testes e a inspeção dos cartões/telas usaram contextos de navegador isolados.
O armazenamento do navegador de uso permaneceu intacto. A confirmação de uso real
das quatro atividades não substitui avaliação específica de Azure Speech, pronúncia
automática ou audição da voz instalada. Os stashes e as fontes originais foram preservados.
