# LAB Visual v3 — serviço privado de imagens, incremento 3C.1

Base: 4a16e2e2044e1ee5ea7e71da169b2783a6407dba. Contrato opt-in
`lab-v3-ilustrada-1`, complementar à [projeção 3B](LAB_VISUAL_V3_PREVIA.md).
Sem renderizador de questões, seleção de arquivos, navegação pedagógica, importação,
armazenamento, áudio, progresso, avaliação ou admissão operacional.

## Pipeline e compatibilidade

Nova fachada lab-visual-ilustrada.js: somente criarPreparacaoIlustradaVisual(), sem parâmetros.
Node usa require/cache do núcleo; navegador carrega analisador, núcleo, depois fachada.
Não há registro em app.entry.js, index.html escolar ou motores.

O núcleo acrescenta uma fábrica independente. O parser, processarZip, projetar e a preparação
3B permanecem inalterados. A nova fábrica chama processarZip exatamente uma vez por preparação,
usa exclusivamente manifesto e bytes privados desse resultado e reutiliza projetar.
Não exporta pipeline, mapa, parser, callback, Blob, URL, hash ou getter de bytes.
Apenas a lista fechada de exports do núcleo ganha a fábrica opt-in; as fachadas antigas não mudam.

analisarContratoVisual, analisarTransporteZipVisual e criarPreparacaoPreviaVisual preservam
assinaturas, resultados e decodificacao:pendente. lab-v3-previa-1, perfil ZIP, V0–V4,
fixtures/hashes e contratos v1/v2 não mudam.

## API exata

criarPreparacaoIlustradaVisual() retorna objeto congelado com cinco métodos:

- preparar(zipBytes): um Uint8Array, sem argumentos extras; snapshot e validação homologados.
  Substitui a preparação anterior, invalidando imediatamente todas as suas referências.
  Retorna promessa de sucesso completo ou recusa. Uma falha permite preparar novamente.
- consultarEstado(): snapshot fechado de estado, flags e observacao, sem conteúdo privado.
- consultarProjecao(): sucesso seguro apenas em estado disponivel; não revalida ou decodifica.
- criarApresentacao(usoVisual): promessa; recebe exatamente o objeto imagem autêntico da
  projeção ativa, com sua referência opaca. Não aceita ref isolada, cópia, objeto falso,
  uso de outro contexto, bytes, URL ou metadados substitutos.
- descartar(): permanente e idempotente. Nova seleção após descarte exige nova instância.

Usar o objeto de utilização, além da referência, vincula acessibilidade contextual ao mesmo
contexto. Aliases compartilham recurso opaco, mas preservam alt distinto por utilização.
O futuro renderizador continua responsável por legenda, descrição longa e relações do conjunto,
presentes na projeção. Este serviço somente cria a imagem isolada.

Sucesso preparar/consultarProjecao:

```text
status: ilustracao-disponivel
formato: lab-v3-ilustrada-1
projecao: árvore lab-v3-previa-1 congelada
admissaoOperacional: false
decodificacao: verificada-no-navegador | sem-recursos
```

sem-recursos é exclusivo de contexto sem imagens: nenhum codec ou URL foi exercitado.
Mesmo nesse caso a fábrica exige runtime de navegador adequado; Node não simula sucesso.

Sucesso criarApresentacao: objeto congelado com elemento HTMLImageElement, liberar(),
consultarEstado(), admissaoOperacional:false e acessores status/decodificacao.
status é imagem-disponivel somente enquanto pronta; após liberação/falha torna-se
imagem-indisponivel, com decodificacao:pendente. consultarEstado retorna estado
preparando/pronta/liberada/indisponivel e flags atuais. liberar é explícito e idempotente;
remove listener de erro, src, elemento do DOM e sua retenção no serviço. Consumidor não
deve reutilizar/mudar src de um elemento liberado.

Estados da preparação: inicial, preparando, disponivel, falha, descartado.
Falha posterior em uma imagem invalida todo o contexto ilustrado, libera suas apresentações
e impede consultar projeção como pronta. A apresentação que sinalizou error fica indisponivel.
Recuperação requer nova preparação; nenhuma resposta ou progresso existe.

Recusas: status recusado, erros [{codigo,caminho,origem}], truncado:false,
admissaoOperacional:false, decodificacao:pendente. Sem manifesto/digest/projeção/binário/stack.
Erros do pipeline preservam origem/códigos anteriores. Erros próprios têm origem ilustrada
e caminho vazio. Códigos:

- ILUSTRADA_RUNTIME_INDISPONIVEL, ILUSTRADA_PREPARACAO_FALHOU.
- ILUSTRADA_DECODIFICACAO_FALHOU, ILUSTRADA_DIMENSOES_DIVERGENTES,
  ILUSTRADA_RECURSO_FALHOU.
- ILUSTRADA_REFERENCIA_INVALIDA, ILUSTRADA_INDISPONIVEL,
  ILUSTRADA_DESCARTADA, ILUSTRADA_INVALIDADA.
- ILUSTRADA_ORCAMENTO_OCUPADO, ILUSTRADA_FILA_OCUPADA: recuperáveis, sem invalidar
  contexto válido. Liberar apresentações ou aguardar o trabalho atual e tentar novamente.

Resultados preparar/consultarProjecao são registros da conclusão; referências neles contidas
perdem direitos após invalidação. Não são certificados de validade futura ou autorização escolar.

## Confirmação nativa

Runtime exige document.createElement, HTMLImageElement.decode, Blob, URLs temporárias
e createImageBitmap. Não há fallback permissivo nem decoder Node.

Cada hash único é verificado sequencialmente: Blob com MIME validado; URL de verificação;
img fora do DOM; await decode(); dimensões naturais positivas/exatas; materialização nativa
de um ImageBitmap do mesmo Blob e conferência de dimensões; geração conferida novamente;
fechamento do bitmap, remoção da imagem e revogação da URL; só então registro do sucesso.
Nenhum frame é reencodado ou desenhado em canvas.

Motivo da segunda confirmação: na verificação local, Chromium 153.0.8010.12 resolveu
HTMLImageElement.decode para um PNG sintético com IHDR/CRCs/zlib header válidos e IDAT
indecodificável. createImageBitmap rejeitou os mesmos bytes com InvalidStateError.
O oráculo nativo adicional já é empregado pelo corpus raster homologado. A nova preparação
exige ambos os sucessos; não relaxa análise ou teste para aceitar o negativo.

Apresentações posteriores usam somente os mesmos bytes já materializados no preflight.
Cada novo elemento passa por decode e dimensões antes de ser entregue ao consumidor.
Não há sucesso parcial: preflight com falha após outros recursos ainda recusa o conjunto inteiro.
O evento error após entrega invalida a apresentação e o contexto.

Isso demonstra decodificabilidade nas APIs do runtime selecionado, não integridade universal
de todo fluxo de coeficientes/pixels, igualdade de cores, correção pedagógica ou segurança
absoluta do codec. Variações recuperadas pelo navegador podem continuar admitidas.

## Memória, filas e URLs

Limite provisório fixo: 8388608 pixels estimados de residência controlada, aproximadamente
32 MiB em RGBA8. Não é teto de memória real nem limite de validade do pacote.
Cada instância de apresentação reserva largura * altura, mesmo com URL/hash compartilhado.
Uma requisição acima do saldo retorna ILUSTRADA_ORCAMENTO_OCUPADO, sem promessa aguardando
liberação indefinidamente e sem expulsar silenciosamente imagens ainda exibidas.

Uma tarefa nativa ativa por preparação, inclusive entre gerações. Fila FIFO limitada
internamente a 64 solicitações pendentes; excesso retorna ILUSTRADA_FILA_OCUPADA.
Esse teto de serviço não restringe quantidade de figuras no manifesto. Não há pré-carregamento.
Cada instância possui fila independente; o futuro controlador deverá limitar quantas instâncias
abre ao mesmo tempo. APIs nativas sem conclusão não têm timeout de validade: descarte resolve
clientes logicamente, mas não garante interromper imediatamente a operação nativa.

Verificação: uma URL e um recurso de cada vez; imagem + bitmap podem representar até
8388608 pixels estimados no teto por recurso (4194304 cada). Bitmaps sempre são fechados,
inclusive quando terminam depois do descarte. Não se retêm frames de verificação.

Apresentação: uma URL/Blob por hash enquanto houver usuários; somente a liberação do último
usuário revoga essa URL. Cada elemento mantém sua própria descrição. Não se presume que o
navegador compartilhe superfícies. A API não publica URL, mas o src do DOM é observável:
não há sigilo contra scripts hostis no mesmo runtime ou quem detém o pacote.

Invalidação resolve trabalhos enfileirados/ativos como recusados e revoga vínculos controlados.
O slot físico continua ocupado até a promessa nativa terminar. Resultados atrasados não
publicam contexto, imagem ou sucesso. Retenções de GC, caches e trabalho nativo podem sobreviver
ao descarte lógico: não se promete apagamento físico nem liberação imediata de memória.

consultarEstado.observacao contém somente contadores: recursosVerificados, semRecursos,
pixelsEmUso, limitePixels, decodificacoesAtivas (slot ocupado), fila, limiteFila,
urlsVerificacao, urlsApresentacao, apresentacoes. Sem persistência/telemetria.

Bytes ZIP comprimidos, bytes verificados, Blob, objetos/textos, imagens e memória real são
custos distintos. Os tetos analíticos/ZIP anteriores não mudam. Os ~196,5 MiB documentados no
transporte não incluem todas as superfícies do navegador. O orçamento de pixels não prova
um limite universal de RAM e precisa ser calibrado em dispositivos modestos.

## Harness e testes

tests/fixtures/lab-visual-imagens.html é somente uma página técnica: carrega os módulos
isolados e possui contêiner de imagens. Não escolhe ZIP nem renderiza questões.
O harness Node/Chromium serve apenas essa página e os três scripts autorizados em porta
efêmera, contexto descartável, sem aplicativo/dados escolares, fechando browser e servidor.

Testes VM usam APIs simuladas para estados/falhas/concorrência e contador de uma chamada
ao analisador por preparação. Não são evidência de decodificação real.
Chromium usa codecs reais para todos os positivos congelados, PNG negativo gerado em memória,
orçamento com PNG sintético real 2048x2048 e ciclos de liberação. Injeções explicitamente
identificadas cobrem falha de dimensões, Blob/URL, promessas nativas atrasadas e error tardio.
O negativo comprova aprovação analítica antes de alcançar os codecs. Fixtures antigos intactos.

Regressão 3B só atualiza a asserção de exports do núcleo para incluir exatamente a nova fábrica;
não muda oráculos de resultado ou condições de aceite anteriores.

## Checkpoint direcionado — 11/11/2026

51 testes novos: 23 Node/VM e 28 Chromium. Lote completo executado: 564/564,
composto de 409 v3 (358 anteriores + 51 novos) e 155 regressões validador/backup v1/v2.
Zero falhas, cancelamentos ou skips no snapshot final. V0–V4 exatos nas regressões
Node/Chromium. Build, formatação, lint e git diff --check aprovados.
O prefixo anterior do núcleo (parser/pipeline/projetor/3B) foi comparado integralmente à base,
uniformizando somente EOL; fachadas antigas, analisador, gerador e fixtures sem alterações.

Medições exploratórias locais: pacote sintético de 51379 bytes com três imagens de 4194304
pixels cada (12582912 agregados), verificado em 58,9 ms; zero frames retidos pela aplicação ao
concluir. Duas preparações e 40 apresentações isoladas em 26,2 ms, com URLs/registros zerados.
Não são medições de RAM, garantias de desempenho nem evidência de uso infantil/dispositivo modesto.
Node v24.19.0, Playwright 1.63.0, Chromium 153.0.8010.12.

Logs locais: tmp/3c1-regressoes-final-2.log, 3c1-build-final.log, 3c1-format-final.log,
3c1-lint-final.log. Tentativas iniciais preservadas: negativo inicialmente aceito por img.decode,
antes do segundo oráculo, e ajustes de declarações de globais dos testes no lint.
Não foram reduzidos testes ou modificados fixtures/oráculos congelados.

AGENTS.md e TESTES_E_VALIDACAO_REAL.md exigem global para infraestrutura: parar antes de npm test,
aguardar autorização e executar integralmente. Não usar aprovação histórica para este snapshot.
Global 3C.1 ainda não iniciada. Comando previsto em PowerShell, após autorização e conferência
de porta livre: $env:PLAYWRIGHT_PORT='5181'; npm test. Sem filtros/redução; preparar antes os
PDFs sintéticos oficiais de teste somente nesta worktree se necessários. Não usar PDFs privados.
Sem staging, commit, push, PR ou integração escolar. 3C.2/3D não iniciados.

Fontes: [HTML decode](https://html.spec.whatwg.org/multipage/images.html#dom-img-decode),
[ImageBitmap](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html),
[File API](https://w3c.github.io/FileAPI/#dfn-revokeObjectURL).

## Fechamento da auditoria — 11/11/2026

O checkpoint direcionado original acima permanece histórico: 564/564 aprovados.
Posteriormente foi executada uma única global local do 3C.1: Node 1753/1753 e
Playwright 850/850 descobertos/executados/aprovados, código de saída 0. Zero falhas,
skips, retries, flaky, interrupções ou timeouts. Reporter passed, complete:true,
errors vazio; fontes/artefatos estáveis. Os 11 hashes permaneceram idênticos antes/depois.
Evidências: tmp/3c1-global.log, tmp/3c1-global-exit-code.txt e
tmp/validacao/2026-11-11T21-42-36-339Z-1b0b7896-07b4-41df-a538-1f16780f43a4/run.json.

A comparação observacional ficou inconclusiva, sem plano CI local válido. A identidade
registrou 29 diagnósticos de capturas indisponíveis/desatualizadas e 25 referentes aos
ZIPs congelados anteriores, sem papel demonstrado pela política. Não se observou alteração
indevida desses arquivos ou falha funcional do 3C.1. Não equivale a comparação aprovada.

Após a auditoria, acrescentado somente teste permanente P3 de drenagem normal FIFO:
uma operação ativa, 64 pendentes, excesso recusado, sequência observada por rótulos distintos,
65 apresentações concluídas, liberação inversa e zero pixels/apresentações/URLs/fila/slots
ao final; listeners removidos e eventos em elementos liberados sem invalidar contexto.
Operações controladas por promessas explícitas; timeout do teste é somente proteção contra
travamento. O teste anterior de cancelamento por descarte permanece intacto.

Verificação posterior à global: novo teste 1/1; lote final 565/565, sendo 410 v3
(52 novos: 24 Node/VM e 28 Chromium) e 155 regressões v1/v2. Sem falhas/skips/cancelamentos;
V0–V4 preservados. Build, format:check, lint e diff --check aprovados.
Logs próprios: tmp/3c1-fifo.log e tmp/3c1-fechamento-{direcionados,build,format,lint}.log.

Produção, fixtures e hashes congelados não mudaram após a global: apenas teste P3 e documentação
P4. A global histórica não validou o teste novo. Nova global local dispensada neste fechamento
exclusivamente de teste/documentação: nenhum gatilho funcional do AGENTS.md ou de
TESTES_E_VALIDACAO_REAL.md foi introduzido; a infraestrutura de produção já passou integralmente.
A futura PR continua exigindo CI integral do snapshot final. Sem publicação ou integração
escolar; 3C.2/3D não iniciados.
