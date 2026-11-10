# LAB Visual v3 — incremento 1, análise isolada

Base: bd99c24212fd6d1de187e46d382f3c7e17b2aab6. A especificação foi aprovada na conversa;
esta implementação não admite v3 no aplicativo. Global do incremento 1 aprovada em 10/11/2026;
correções 1A aprovadas também na global integral, conforme encerramento ao final.

## Fronteira

`ambiente_interativo/js/lab-visual-analise.js` exporta somente
`analisarContratoVisual(manifestoUTF8, recursosBinarios)`. CommonJS em Node; publicação isolada
em `LabVisualAnalise` somente quando seu script é carregado deliberadamente. Não há import em
app.entry, dependência de motor, UI, rede, storage, ZIP, áudio, sessão ou recuperação.

São dois argumentos, sem opções: Uint8Array UTF-8 e array de Uint8Array, uma ocorrência por
binário único. Buffers são copiados antes do primeiro await, sem chamar métodos/constructor/
species recebidos. SharedArrayBuffer, ArrayBuffer redimensionável e entradas incompatíveis são
recusados. Não aceitar objetos marcados válidos nem digests autorizativos.

Sucesso analítico: status analise-concluida, manifesto, manifestoCanonico, digestPacote,
capacidadesRequeridas, resumoRecursos, decodificacao:pendente e admissaoOperacional:false.
Recusa: status recusado, erros com código/caminho, truncado, admissaoOperacional:false;
sem manifesto ou digest parcial. Não há chave, flag ou função de admissão.

## Contrato e identidade

Objetos fechados e sem defaults; questões opcoes/campos/ditado podem coexistir. Alternativas
guardam IDs, gabarito referencia alternativaId. Equivalência textual acompanha a comparação
sem flags documentada do motor; equivalência mecânica de apresentação ignora IDs de usos/grupos
e descrições contextuais, sem alegar equivalência perceptual entre imagens diferentes.

Catálogo fechado: mime, sha256, bytes, largura, altura. IDs de recursos são independentes;
questões/itens/usos/conjuntos/grupos têm unicidade global; alternativas têm unicidade por item.
Todos os aliases precisam ser usados, com descritores iguais para hash igual. Binários extras,
órfãos, repetidos, faltantes e inconsistências são recusados.

Imagem: id, tipo, recursoId, acessibilidade, rotulo opcional. Acessibilidade decorativa só
contém tipo; essencial exige descricao e permite descricaoLonga. Slot deriva do contêiner.
Conjunto: id, tipo, apresentacao, rotulo, elementos; descricaoRelacao opcional. Apresentações:
comparacao, sequencia, grade, agrupamento. Somente agrupamento recebe grupos de id/rotulo/
elementoIds; partição exata, sem sobreposição, aceita elementos intercalados. Nenhum array é
reordenado, inclusive grupos e referências; apresentação futura segue a ordem relativa de
elementos. Não há UI de agrupamento neste incremento.

Capacidades @1: questoes-opcoes, questoes-campos, ditado, raster-png, raster-webp, raster-jpeg,
alternativas-visuais, conjuntos-visuais, agrupamento-visual. D=R; declarações ordenadas e
únicas. SVG, representações contáveis, momentos visuais e ditado visual estão bloqueados.
Não se altera o reconhecedor v1/v2; disponibilidade operacional v3 continua vazia.

Textos exigem Unicode válido/NFC/trim prévio; Cc/Cf/Zl/Zp proibidos, salvo LF interno em
descricaoLonga. `<` e `>` são literais admitidos; entidades não são decodificadas. Ditados
mantêm a gramática lexical v2, sem envelope artificial, projeção ou exposição do alvo.

Canônico: chaves de objetos ordenadas por UTF-16; arrays intactos; JSON sem espaços e UTF-8
sem BOM. SHA-256 sobre o canônico de {dominio,manifesto,recursos}, domínio
revisoes-escolares/lab-v3/identidade-1, recursos únicos {sha256,mime,bytes} ordenados por hash
e conferidos contra os bytes. Nome/ordem/compressão do futuro ZIP não participam.

## Política lab-v3-analise-1

Tetos inclusivos, fixos no módulo, provisórios para calibração e sem efeito em v1/v2:

- Manifesto 262144 bytes; profundidade 16 (raiz=1); 20000 nós; 100000 tokens.
- 4096 entradas por array/objeto/coleção binária; cinco variantes por campo; 20 erros.
- Binário 8388608 bytes; total recebido 67108864 bytes; lado 4096; 4194304 pixels.
- 4096 chunks/segmentos por recurso, inclusive marcadores de restart JPEG.
- UTF-16: título 120; bloco/rótulo 80; instrução/dica/pergunta 500; alternativa/resposta 160;
  descrição/relação 1000; descrição longa 4000; propriedade/ID 64.
- Versão 1..9999; ditado preserva palavra 40, frase 160 e 2..12 palavras do v2.

Contam-se nós de valores/contêineres, não nomes de propriedades; tokens incluem pontuadores,
nomes e valores. O teto de tokens é defesa adicional: a gramática válida com 20000 nós já
limita os tokens abaixo de 100000. Fronteiras alcançáveis são exercitadas pela API; não há
bypass de orçamento para testar um limite dominado por outro. Sem timeout como critério puro.

## Inspeção raster e limites da afirmação

PNG estático: IHDR/PLTE/tRNS/sRGB/IDAT/IEND, CRCs, sequência, combinações padronizadas de
cor/profundidade/interlace, paleta, transparência e cabeçalho zlib. Sem APNG ou chunks extras.
WebP: RIFF exato, padding zero, VP8/VP8L/VP8X/ALPH, flags, dimensões e ordem coerentes.
JPEG JFIF: 8 bits baseline/progressivo, 1/3 componentes, sem thumbnails; DQT/DHT/SOF/SOS/DRI,
ordem estrutural de scans e refinamentos, stuffing/restarts e EOI. Sem outras variantes.
EXIF/XMP/ICC/comentários e metadados fora das listas são recusados, nunca removidos.

Não se descomprime DEFLATE/VP8/VP8L nem se decodifica o fluxo de coeficientes JPEG: checksum
interno de DEFLATE, suficiência do entropy stream, número de MCUs e pixels reais dependem da
decodificação posterior. Não confundir estrutura inspecionada com imagem exibível ou segura
para admissão. Resultados continuam com decodificação pendente e admissão falsa. A autoria
deve preparar orientação e sRGB antes do pacote; nada é reencodado pelo analisador.

## Corpus e verificações

Fixtures originais em tests/validacao/fixtures/lab-visual-v3, hashes congelados em hashes.json.
R/B são exatamente os PNGs normativos. W1 VP8 opaco; W2 VP8L opaco; W3 VP8L alpha;
W4 VP8X+ALPH+VP8; W5 VP8X+VP8L alpha; J1 baseline cinza; J2 baseline três componentes;
J3 progressivo três componentes. W/J medem 16x16. Preparados uma vez com ImageMagick já
instalado, pixels sintéticos, -strip, lossless explícito para W2/W3 e interlace Plane em J3.
W5 enquadra o payload de W3 em VP8X coerente. Testes nunca reencodam os positivos.

V0–V4 e os cinco hashes aprovados ficam no helper e são comparados em Node e Chromium.
Negativos derivam dos bytes congelados, com descritores re-hasheados para isolar defeitos
estruturais; incluem todos os prefixos truncados, comprimentos, CRC, flags, metadados,
variantes, referências e orçamentos. Testes de dimensão grande que alteram somente cabeçalho
comprovam a fronteira estrutural, não a decodificação de uma imagem grande.

O teste Chromium usa servidor efêmero em porta atribuída pelo sistema, contexto descartável,
sem Vite nem dados escolares, encerra browser/servidor. Decodificação dos positivos é oráculo
externo do corpus, não nova API nem promessa para outros pacotes. Há guards de efeitos, rede,
storage, áudio, motor e sessões, mutação concorrente e entradas adversariais.

Direcionados: node --test tests/validacao/lab-visual-*.unit.cjs
Regressão: lab-validador.unit.cjs, lab-backup.unit.cjs e demais contratos LAB pertinentes.
Build/formato/lint seguem package.json. Novo núcleo de infraestrutura: global conservadoramente
necessária antes de consolidação; execução autorizada e aprovada conforme encerramento abaixo.

Fontes técnicas: https://www.w3.org/TR/png-3/ ;
https://developers.google.com/speed/webp/docs/riff_container ;
https://www.w3.org/Graphics/JPEG/itu-t81.pdf .

## Checkpoint das verificações direcionadas

Regressão Node específica LAB: 868/868 (677 preexistentes + 191 v3), concorrência 1,
sem falhas/skips/cancelamentos. Após a última pré-checagem defensiva da coleção binária,
191/191 v3 reexecutados, sem falhas. V0–V4 exatos em Node/Chromium; 10 fixtures positivos
decodificados no oráculo Chromium. Build, format:check, lint e git diff --check aprovados.
Naquele checkpoint, npm test e Playwright global ainda não haviam sido iniciados.
Logs locais preservados em tmp/lab-visual-v3-incremento1: contratos-lab.log,
direcionados-final.log, build.log, format-check.log e lint.log.

## Encerramento da global — 10/11/2026

Após autorização expressa de continuidade, executados preparar:pdfs-teste (dez fixtures
sintéticos na worktree isolada) e npm test com PLAYWRIGHT_PORT=5181. Saída final 0.
Node integral: 1535/1535 aprovados, zero falhas/skips/cancelamentos, 153239 ms.
Playwright integral: 850 descobertos/esperados/executados/aprovados, 850 tentativas;
zero failed/flaky/skipped/notExecuted/retries/interruptedAttempts/timedOutAttempts.
Duração Playwright: 3402379,874 ms (56min42s), sem incluir pretest/build.
Reporter: status passed, complete true, errors vazio, sourcesChangedDuringRun false,
artifactsChangedDuringRun false. Nenhuma alteração de código durante ou após a global.
Apenas este registro documental e os dois apontadores foram atualizados após seu término.

Log: tmp/lab-visual-v3-incremento1/global.log. Reporter imutado:
tmp/validacao/2026-11-10T02-53-29-717Z-cc4d560a-22c8-47ee-b8b4-d839d9940d75/run.json.
As evidências de output/tmp e os fixtures sintéticos de regressão foram preservados.
Processos de testes/servidor da worktree encerrados. Cópia escolar limpa; worktree de História
com as mesmas 16 entradas rastreadas alteradas e 35 não rastreadas; stash compartilhado
dd5623a8d3db5cbb0f699d13d2af34b8afc39590 preservado. HEAD/branch mantidos.
Sem commit/push/PR/merge/publicação, admissão operacional, integração escolar ou próximo incremento.

## Incremento 1A — correções pós-auditoria

DQT progressiva agora conserva ID, precisão e os 64 coeficientes. Cada componente iniciado
fica vinculado à definição efetiva de seu destino; destinos usados pelo frame progressivo
aceitam somente redefinições idênticas. Destinos ainda não usados podem ser redefinidos,
inclusive antes do primeiro scan. Destinos compartilhados ficam protegidos para todos os
componentes vinculados. Baseline não recebe o bloqueio progressivo. Recusa específica:
QUANTIZACAO_PROGRESSIVA_ALTERADA. Nenhum pixel é decodificado por esta verificação.

VP8L alpha_is_used é tratado como hint: não é usado para comprovar transparência ou impor
igualdade com VP8X. Preservados flags reservados, versão, dimensões, ordem, chunks e as
regras de alpha explícito ALPH+VP8. Transparência real continua pendente de decodificação.

A coleção binária é examinada por Reflect.ownKeys antes de buscar descritores individuais
das posições. Extras são recusados sem materializar seus descritores ou executar getters.
Limitação: a enumeração de nomes ainda aloca uma lista proporcional às propriedades do
objeto anfitrião; não existe enumeração limitada nativa geral de arrays JavaScript. Proxies
também podem executar traps de reflexão. O futuro adaptador deve construir uma coleção
ordinária a partir dos bytes, não repassar objetos JavaScript arbitrários. Isso não interpreta
código em manifesto ou binários e não altera a API. Caso adversarial usa 4097 propriedades
extras e comprova que apenas o descritor length foi consultado, sem executar getters.

Teste tautológico substituído por hashes capturados antes da chamada. Os negativos de
formato com causa conhecida agora verificam códigos específicos, não qualquer recusa.
Corpus congelado adicional, 16x16, preparado uma vez com ImageMagick instalado e -strip:
P1-paleta (paleta de 1 bit), P2-cinza (8 bits), P3-alpha (RGBA 8 bits), P4-16bits (RGB),
P5-adam7 (RGB 8 bits). Bytes/hashes originais R/B/W1–W5/J1–J3 preservados. Não há
reencodificação durante testes. Chromium confirmou decodificação dos 15 positivos do corpus.

Validação 1A: 213/213 testes v3, incluindo todos os 64 coeficientes de DQT em uma regressão,
destino compartilhado, alteração de precisão, redefinições permitidas, hint e coleção hostil.
V0–V4 continuam exatos em Node/Chromium. Regressão específica de fronteira validador/backup
v1/v2: 155/155. Não foram repetidas as suítes operacionais não alteradas neste checkpoint.
Build, format:check, lint e diff --check aprovados. Logs próprios preservados em
tmp/lab-visual-v3-incremento1a, sem substituir as evidências anteriores.

No checkpoint direcionado, a global anterior não certificava as correções 1A e npm test
ainda não havia sido iniciado para elas. A continuidade foi posteriormente autorizada. API, política lab-v3-analise-1,
capacidades, contratos v1/v2 e isolamento preservados; admissão sempre false e decodificação
sempre pendente. Sem staging, commit, publicação ou incremento 2.

## Encerramento da global 1A — 10/11/2026

Execução integral autorizada com PLAYWRIGHT_PORT=5181, porta livre previamente conferida,
sem filtros, exclusões ou redução. npm test terminou com código 0.
Node: 1557/1557 aprovados, zero falhas/skips, duração 152606,2896 ms.
Playwright: 850 descobertos/esperados/executados/aprovados, 850 tentativas; zero failed, flaky,
skipped, notExecuted, retries, interruptedAttempts ou timedOutAttempts. Duração Playwright
3357916,539 ms (55min58s), excluindo pretest/build. Reporter status passed, complete true,
errors vazio; sourcesChangedDuringRun e artifactsChangedDuringRun false.

Log preservado: tmp/lab-visual-v3-incremento1a/global.log. Código de saída registrado em
tmp/lab-visual-v3-incremento1a/global-exit-code.txt. Reporter original, sem edição:
tmp/validacao/2026-11-10T04-27-05-481Z-77a6f83b-1776-4cb6-b68b-cf62765cf0bb/run.json.

Nenhum código/teste foi alterado durante ou após a suíte. Somente documentação de encerramento
atualizada após seu término. Processos Playwright/Vite desta worktree encerrados. HEAD base e
branch mantidos, staging vazio; stash compartilhado dd5623a8d3db5cbb0f699d13d2af34b8afc39590
preservado. Sem intervenções nas outras worktrees, commit/push/PR/merge/publicação ou incremento 2.
A aprovação é do núcleo analítico: admissão sempre false, pixels ainda pendentes de decodificação.
Permanece a limitação documentada de enumeração de nomes dos objetos JavaScript anfitriões.
