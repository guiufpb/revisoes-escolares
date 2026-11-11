# LAB Visual v3 — transporte analítico ZIP, incremento 2B

Base: 18b2288757536242e58b9ab41050e884b55a2f07. Perfil aprovado na conversa: lab-v3-zip-1.
Este documento complementa [a análise v3](LAB_VISUAL_V3_ANALISE.md), sem alterar seus contratos.
Não é importação escolar, backup, prévia, avaliação ou autorização de armazenamento.

Extensão 3B: leitor/extração foram movidos, sem alteração de perfil ou resultados, para
lab-visual-zip-nucleo.js. A fachada lab-visual-zip.js mantém a API analítica homologada. Em scripts
isolados do navegador, carregar o núcleo depois do analisador e antes das fachadas ZIP/prévia.
Não há loader ou registro escolar automático. A nova fronteira privada e a projeção efêmera
constam em [LAB_VISUAL_V3_PREVIA.md](LAB_VISUAL_V3_PREVIA.md); as seções seguintes registram 2B/2C.

## API e fronteira

`ambiente_interativo/js/lab-visual-zip.js` exporta somente
`analisarTransporteZipVisual(zipBytes)`, um argumento Uint8Array. CommonJS em Node;
`LabVisualZip` no navegador somente ao carregar deliberadamente os scripts isolados, com
`LabVisualAnalise` antes. Não há import em app.entry, HTML ou reconhecedor operacional v1/v2.
O único import do adaptador é o analisador homologado; sua API e implementação não mudam.

O snapshot nativo ocorre antes do primeiro await, sem getters/constructor/species do argumento.
Recusam-se SharedArrayBuffer, buffers redimensionáveis/destacados e tipos incompatíveis.
Após inspecionar toda a estrutura, extrai sequencialmente, confere CRC e o hash nomeado de cada
recurso, constrói array ordinário/denso e chama obrigatoriamente analisarContratoVisual.
Após sucesso lógico, confere extensão/MIME contra o catálogo validado. Não faz JSON.parse
preliminar, não aceita objetos marcados válidos e não interpreta caminhos do sistema ou URLs.

Sucesso preserva todos os campos da análise lógica e acrescenta somente `transporte`:
`perfil`, `bytes`, `entradas`, `metodos` (únicos/ordenados). Sempre admissaoOperacional:false
e decodificacao:pendente. O resumo de transporte não participa da identidade lógica.
Recusa não retorna manifesto, canônico, digest ou binários. Erros têm codigo/caminho/origem,
sendo origem transporte ou contrato. Nomes inválidos não são ecoados; caminhos de erro do
transporte são vazios ou caminhos já aprovados pela gramática. Sem stacks/textos-alvo.
A inspeção física é fail-fast determinística (um erro); erros lógicos preservam a ordem e o
teto 20 do analisador. Sem resultado parcial nem timeout de relógio como critério de validade.

## Contrato físico fechado

- Exatamente `lab-v3-zip-1/manifesto.json` e zero ou mais arquivos
  `lab-v3-zip-1/recursos/<sha256>.<ext>`.
- SHA-256: 64 hexadecimais minúsculos; png/image/png, webp/image/webp, jpg/image/jpeg.
- Uma ocorrência física por hash, mesmo quando há aliases lógicos. Recurso ausente, extra,
  descritor inconsistente ou hash incorreto provoca recusa, sem reparo/deduplicação no leitor.
- Diretórios explícitos, README, miniaturas, outros catálogos e qualquer arquivo desconhecido
  são proibidos. Pacotes sem recursos são válidos se o manifesto for válido.
- Nomes ASCII exatos; sem normalização, percent-decoding, case folding ou reparação de barras.
  A gramática recusa traversal, caminhos absolutos, unidades Windows, NUL e Unicode ambíguo.
- ZIP clássico de disco único; métodos 0 (STORED) e 8 (DEFLATE bruto). Não ZIP64, criptografia,
  data descriptors, volumes múltiplos, extras, comentários, assinaturas digitais ou outros métodos.
- Version made by DOS 2.0 e version needed 2.0 (20); flags somente 0 ou 0x0800.
  Atributos internos 0; externos 0 ou 32. Outros hosts/modos, links e diretórios são recusados.
- Timestamps DOS válidos, incluindo calendário gregoriano, iguais no local e central.
  Autoria usa data 1980-01-01 e hora 00:00:00.
- EOCD exatamente nos últimos 22 bytes, sem comentário; diretório central contíguo antes dele.
  Registros locais cobrem exatamente [0,inicioCentral), sem prefixos, lacunas ou sobreposição.
  Uma entrada central por registro local; nomes, flags, método, timestamps, CRC e tamanhos iguais.
  Não se procuram assinaturas dentro de payloads. Ordem física e central podem diferir.
- CRC-32 de todos os payloads extraídos, inclusive manifesto. Método 0 exige tamanhos iguais;
  método 8 exige fim válido, ausência de cauda e tamanho exato. Nenhuma extração em disco.

Nome externo do ZIP, ordem, timestamps, flags UTF-8 admitidas e compressão não mudam o digest.
Renomear recurso fora da gramática recusa o transporte; não altera identidade pedagógica.
Versões futuras exigem reconhecimento explícito; nunca fallback permissivo. Compactadores
genéricos podem produzir metadados recusados: usar autoria conforme o perfil, sem sanitização.

## Orçamentos inclusivos e memória

Política interna fixa: ZIP 71303168 bytes; entradas 4097; nome 96 bytes; central 1048576;
metadados 2097152 (EOCD + central + cabeçalhos locais/nomes); manifesto 262144;
binário individual 8388608; binários acumulados 67108864; payload total 67371008; erros 20.
Nenhuma opção permite ampliá-los. Diretório, offsets, contagens e somas são inspecionados antes
de alocar saídas. Consumo real também é conferido; saída individual nunca ultrapassa o declarado.
O limite de 4097 permite manifesto + 4096 recursos; o manifesto limita antes muitos casos reais.
Gramática de nomes e contagem dominam os tetos de 96 bytes, central e metadados; manifesto e
binários dominam o total. Testes não criam bypass para tornar limites dominados alcançáveis.

Método 0 usa views do snapshot privado. Método 8 pré-aloca somente a saída declarada já limitada,
alimenta DecompressionStream em blocos de até 4096 bytes com await/backpressure e consome a
saída incrementalmente. Antes de copiar cada bloco, verifica espaço restante; ao exceder,
cancela reader, aborta writer, aguarda a tarefa alimentadora e libera locks. Sem acumulação
ilimitada, descompressão paralela ou Response.arrayBuffer para a saída.

Snapshot ZIP + todos os payloads extraídos + cópia do analisador podem somar aproximadamente
196,5 MiB de bytes nos tetos, além de entrada do chamador, objetos/textos, hashing e alocações
nativas. STORED evita uma cópia dos recursos no adaptador. Backpressure/limites controlam bytes
retidos pela aplicação; não prometem teto universal para memória interna do runtime/descompressor.
Sem limite por razão de expansão nem timeout: tamanho declarado e saída real são limitados.
Medições em dispositivos menores continuam necessárias antes de experiência escolar.

## DEFLATE e runtimes

API nativa conforme [WHATWG Compression](https://compression.spec.whatwg.org/#supported-formats):
deflate-raw, sem envelope zlib/gzip e sem bytes adicionais após o bloco final. Não há decoder
manual nem dependência externa nova. Método 0 independe da disponibilidade do descompressor.
Ausência nativa produz ZIP_DEFLATE_INDISPONIVEL, sem fallback permissivo.

Preflight local: Node v24.19.0, Playwright 1.63.0 e Chromium 153.0.8010.12. Probe confirmou
fluxo válido, inválido, truncado, cauda no mesmo bloco e em bloco posterior, leitura incremental,
cancelamento por excesso e término de writer. Erros de dados podem chegar depois de alguma saída:
nenhuma saída parcial é sucesso. Os mesmos critérios estão em testes Node/Chromium permanentes.
CI configura Node 24; a execução anterior #173 registrou Node v24.22.2 e o mesmo Chromium.
A versão exata Node da CI não foi executada localmente nem instalada: os testes novos precisam
passar também no runtime remoto. A global do 2B ainda depende da autorização de continuidade.

## Gerador Node para autoria

`scripts/validacao/gerar-lab-visual-zip.cjs` exporta
`gerarZipVisual(manifestoUTF8, recursosBinarios)` para autoria local confiável. Retorna zipBytes,
digestPacote e admissaoOperacional:false. Copia entradas, calcula hashes, deduplica, valida pelo
analisador e escreve em memória método 0: manifesto primeiro, recursos ordenados por hash,
timestamps/atributos fixos. Mantém os bytes JSON fornecidos; determinismo é para mesmas entradas.
JSON logicamente equivalente pode produzir ZIP diferente, mas mantém o mesmo digest lógico.
Reabre pelo adaptador e exige digest igual antes de retornar. Não há segunda validação lógica.

CLI (caminhos explícitos, sem varredura, glob ou rede):

```text
node scripts/validacao/gerar-lab-visual-zip.cjs manifesto.json saida.zip recurso1.png recurso2.webp
```

Lê somente a lista fornecida, com tamanhos limitados; não modifica manifesto/imagens, não
calcula descritores ausentes automaticamente e recusa contratos incoerentes. A partir do 2C,
a saída usa temporário exclusivo e publicação por hard link sem sobrescrita (detalhes abaixo).
A API de autoria é Node, não fronteira de objetos JS hostis;
o adaptador é a fronteira binária não confiável. Não se distribui no aplicativo escolar.

## Corpus, testes e limitações

25 ZIPs sintéticos congelados e hashes em tests/validacao/fixtures/lab-visual-zip:
V0–V4 em 0/8, W1–W5, J1–J3, P1–P5 e composto em 0/8. Reutilizam bytes originais sem
reencodificação. Composto inclui aliases, imagens por contêiner, alternativa ilustrada,
agrupamento intercalado e questões opções/campos/ditado. Fixture builder adversarial independente
do leitor/gerador de produção; testes nunca recompactam os positivos congelados.
CRC/extração dos 25 positivos também conferidos com Python zipfile, sem extrair em disco.

Testes exercitam identidade V0–V4 exata em Node/Chromium, ordens/timestamps/compressão, recusas
específicas, truncagens, metadados, cotas, mutação concorrente, snapshots e ausência de efeitos.
Um PNG derivado com BTYPE DEFLATE reservado, mas CRCs PNG/ZIP corretos, passa na inspeção
estrutural e falha no oráculo Chromium: prova que análise não garante pixels decodificáveis.
Nenhuma segurança foi relaxada para aceitar fixture. Uma experiência inicial apenas com Adler32
alterado foi tolerada pelo navegador; o teste usa corrupção real de bloco, não presume política
do decoder sobre checksums internos. Imagens derivadas não integram o corpus positivo congelado.

Medição exploratória Node local com PNGs sintéticos 1024x1024: zero recursos ~5–7 ms;
um recurso de 3147295 bytes ~203–259 ms; oito (25178360 bytes) ~1488–1591 ms, métodos 0/8.
Maior maxRSS observado no processo ~212 MiB, incluindo preparação/casos anteriores. Não é pico
isolado do adaptador nem garantia para outro hardware/runtime. Logs/scripts em tmp/lab-v3-zip-2b.

Não há UI, prévia, admissão, importação, IndexedDB, progresso, backup, áudio ou execução.
Prévia posterior exigirá projeção infantil segura sem gabaritos/alvos de ditado, URLs efêmeras,
decodificação de imagens e descarte em memória, sem sessões ou persistência antes da confirmação.

## Cadência de verificação

Novos testes: lab-visual-zip.unit.cjs e lab-visual-zip-browser.unit.cjs. Preservar testes do
analisador 1/1A, validador/backup v1/v2, build, format:check, lint e diff --check.
Novo núcleo de infraestrutura exige global integral antes de consolidação. Parar imediatamente
antes de npm test e aguardar autorização expressa; não reduzir filtros/cobertura.
Nenhum commit, staging, publicação ou integração escolar faz parte desta etapa.

Checkpoint local 2B (10/11/2026): 90/90 novos testes ZIP e 213/213 do analisador 1/1A,
303/303 no lote conjunto; 155/155 regressões validador/backup v1/v2. Sem falhas, skips ou
cancelamentos. V0–V4 exatos em Node/Chromium. Build, format:check, lint e diff --check aprovados.
Saídas locais em tmp/lab-v3-zip-2b: v3-final.log, regressao-v1-v2.log, build.log,
format-check.log, lint-final.log, probe-deflate.json e medicao.jsonl. Não são arquivos do pacote
nem evidências a publicar. Suíte global ainda não iniciada; comando previsto: npm test integral
com PLAYWRIGHT_PORT=5181, após verificar a porta livre e receber autorização. Os PDFs sintéticos
de regressão deverão ser preparados somente nesta worktree, se ausentes, antes da global.

Referência do contêiner: [PKWARE APPNOTE](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT).

## Encerramento da global 2B — 10/11/2026

Após autorização expressa, preparados dez PDFs sintéticos somente nesta worktree e executado
npm test integral com PLAYWRIGHT_PORT=5181, configuração original, um worker e sem filtros.
Código de saída 0. Node: 1647/1647, zero falhas/skips/cancelamentos, 161311,8335 ms.
Playwright: 850 descobertos/esperados/executados/aprovados, 850 tentativas; zero failed, flaky,
skipped, notExecuted, retries, interruptedAttempts ou timedOutAttempts. Duração 3389353,2 ms
(56min29s), sem pretest/build. Reporter passed, complete true, errors vazio;
sourcesChangedDuringRun e artifactsChangedDuringRun false. Todos os 35 arquivos do checkpoint
mantiveram seus hashes durante e após a suíte; somente documentação de encerramento atualizada.

Evidências preservadas, sem publicação: tmp/lab-v3-zip-2b/global.log e global-exit-code.txt;
reporter original em tmp/validacao/2026-11-10T17-08-08-087Z-4b1a6f31-77ee-428a-ae1b-1fbca58cc82a/run.json.
Sem processos de teste/servidor da worktree restantes. As 38 worktrees preexistentes mantêm
HEAD e estado Git; stash compartilhado preservado. output/tmp/logs mantidos; staging vazio.
Sem commit, push, PR, integração escolar ou próximo incremento. A aprovação é local do núcleo
analítico; validação remota no Node configurado pela CI continua pendente de publicação autorizada.

## Incremento 2C — confiabilidade da autoria

Correções localizadas, sem alterar gerarZipVisual, o leitor, o perfil ZIP, os limites, os
fixtures congelados ou a identidade. Novo auxiliar Node interno lab-visual-zip-publicacao.cjs:
cria diretório temporário exclusivo no diretório de destino, arquivo `pacote.tmp` com wx/0600,
escreve, sincroniza e fecha. Somente depois publica com fs.link, sem rename nem substituição.
O hard link exige destino inexistente, inclusive se outro processo o criar durante a escrita.
Sem suporte a hard links/permissão no sistema de arquivos, recusa sem fallback permissivo.
O teste real da CLI demonstra essa estratégia no Windows/NTFS local; os mesmos testes seguem
para Node/Linux na CI quando sua execução for autorizada.

Nunca remove o nome definitivo. Limpa somente o temporário reconhecido por dev/ino não zero,
comparado ao stat do handle criado com wx, e o diretório exclusivo com identidade correspondente.
Não faz remoção recursiva. Identidade desconhecida/substituída ou erro de limpeza preserva o
resíduo e é informado. A operação pressupõe diretório local confiável: comparações stat/unlink
não oferecem proteção atômica contra um agente hostil que substitua caminhos entre syscalls.

O erro primário é preservado; falhas adicionais ficam em falhasLimpeza. Erros após publicação
completa indicam publicado:true, sem remover o ZIP íntegro. A CLI anuncia sucesso somente após
publicação e limpeza concluídas; em erro informa a causa por código seguro, eventual publicação
já concluída e falha de limpeza, sem stacks/caminhos privados. Sync reduz risco de perda dos bytes,
mas não constitui transação durável universal nem garante persistência dos diretórios.
Queda de energia/encerramento abrupto pode deixar diretório temporário, ou ZIP completo e alias
temporário após link. Não há limpeza automática de resíduos de execuções anteriores nem promessa
de recuperação universal. Nenhuma etapa publica arquivo parcialmente escrito com nome definitivo.

O teste da CLI agora usa diretório exclusivo por execução, exige saída 0, lê e analisa o ZIP,
confere V0 e só então repete para exigir recusa de sobrescrita e hash preservado. Resíduos de
rodadas anteriores não dispensam a etapa de sucesso. Novos testes simulam fs em memória para
falhas de criação, abertura, escrita parcial, sync, fechamento, publicação, corrida de destino,
limpeza e identidade desconhecida/substituída. Não provocam falta real de espaço ou danos no disco.
A global 2B anterior não certifica estas alterações 2C; nova global requer autorização após checkpoint.

Checkpoint 2C (10/11/2026): 14 testes específicos de publicação, 104/104 testes ZIP no total,
mais 213/213 do analisador = 317/317 no lote conjunto; regressão validador/backup v1/v2 155/155.
V0–V4 exatos em Node/Chromium. Build, format:check, lint e diff --check aprovados. Logs próprios
tmp/lab-v3-zip-2c-*.log, sem substituir as evidências 2B. Nenhuma outra worktree ou stash alterado.
Global 2C ainda não iniciada; comando previsto após consentimento e conferência de porta livre:
PLAYWRIGHT_PORT=5181 npm test (em PowerShell, definir $env:PLAYWRIGHT_PORT antes).

## Encerramento da global 2C — 10/11/2026

Após autorização expressa, validada a identidade de todos os arquivos do checkpoint 2C,
conferida porta 5181 livre e revalidados os dez PDFs sintéticos existentes (zero criados).
Executado npm test integral com PLAYWRIGHT_PORT=5181, sem filtros ou redução, saída 0.
Node: 1661/1661, zero falhas/skips/cancelamentos, 153061,2002 ms. Playwright: 850 descobertos,
esperados, executados e aprovados, 850 tentativas; zero failed, flaky, skipped, notExecuted,
retries, interruptedAttempts ou timedOutAttempts. Duração 3389786,539 ms (56min30s), excluindo
pretest/build. Reporter passed, complete true, errors vazio; sourcesChangedDuringRun e
artifactsChangedDuringRun false. Hashes do checkpoint ainda idênticos após o término;
somente este registro documental atualizado depois. Processos de teste/servidor encerrados.

Evidências preservadas: tmp/lab-v3-zip-2c-global.log e tmp/lab-v3-zip-2c-global-exit-code.txt.
Reporter original: tmp/validacao/2026-11-10T18-38-12-346Z-cea03be8-bb47-4511-924e-fd83ec9d663a/run.json.
Global 2B e seus artefatos anteriores mantidos. Staging vazio, HEAD base mantido, sem commit,
push, PR, integração escolar ou novo incremento. Aprovação local conjunta de 2B/2C, sem alterar
o perfil ZIP, APIs analíticas, fixtures, limites, V0–V4, admissão falsa ou decodificação pendente.
