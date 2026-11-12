# LAB Visual v3 — núcleo de projeção infantil, incremento 3B

Extensão opt-in 3C.1: [serviço privado de imagens](LAB_VISUAL_V3_IMAGENS.md).
As descrições e evidências 3B abaixo permanecem históricas; sua API continua sem decodificar
e sempre informa decodificação pendente. A nova fábrica é independente e não registra
componentes no aplicativo. A projeção lab-v3-previa-1 não muda.

Base: 9af0139d98c22ff0f16f81c6fa0151fd4fda71b2. Complementa os contratos
[analítico](LAB_VISUAL_V3_ANALISE.md) e [ZIP](LAB_VISUAL_V3_ZIP.md).
Não é renderizador, decodificação, prévia navegável, importação ou execução escolar.

## Módulos e pipeline único

lab-visual-zip-nucleo.js contém o leitor movido do adaptador, seus mesmos limites/códigos,
extração, CRC/hash e chamada única a analisarContratoVisual. processarZip é privado: retorna
internamente relatório e Map de bytes por hash apenas depois da validação completa. O manifesto
vem de resultado.manifesto do analisador homologado, sem novo parser JSON ou alteração no 1/1A.

lab-visual-zip.js continua exportando somente analisarTransporteZipVisual(zipBytes), com mesma
aridade, argumentos, resultados e erros. A fachada descarta o retorno privado, sem expor bytes.
lab-visual-previa.js exporta somente criarPreparacaoPreviaVisual(), sem parâmetros de validação.
O núcleo tem somente essas duas entradas seguras: não exporta parser, pipeline, projetor,
contexto, getter de bytes, callback de recursos ou API que aceite relatório como prova de validade.

Em Node, as fachadas carregam o mesmo módulo por require/cache. No navegador, o harness isolado
deve carregar deliberadamente nesta ordem: lab-visual-analise.js, lab-visual-zip-nucleo.js,
depois lab-visual-zip.js e/ou lab-visual-previa.js. O núcleo publica LabVisualZipNucleo com apenas
as duas entradas seguras; fachadas publicam LabVisualZip e LabVisualPrevia. A nova dependência
de carregamento é explícita, sem loader de rede/dynamic import ou duplicação do parser.
Nenhum desses módulos é registrado em app.entry.js, index.html ou no reconhecedor operacional.

Os testes comparam integralmente a API ZIP anterior, lida do commit-base por git show, e a atual
em Node/Chromium: corpus congelado, truncagens, mutação de cada byte do ZIP sintético, argumentos
inválidos e erros criptográficos. Os testes anteriores apenas passam a carregar o núcleo antes
da fachada e conferem a dependência transitiva; não mudam fixtures, oráculos ou condições de aceite.

## API de preparação e ciclo de vida

criarPreparacaoPreviaVisual() devolve objeto congelado com:

- preparar(zipBytes): recebe exclusivamente um Uint8Array, executa snapshot e pipeline completos.
  Rejeita relatórios externos, objetos marcados válidos, buffers separados e argumentos extras.
- consultarReferencia(ref): reconhece somente referência por identidade do contexto atual;
  devolve informacao fechada mime/largura/altura, nunca hash, bytes, catálogo ou URL.
- consultarEstado(): devolve estado, admissaoOperacional:false e decodificacao:pendente.
- descartar(): invalida a preparação/contexto permanentemente e de forma idempotente.

preparar retorna status contexto-disponivel, projecao congelada, admissaoOperacional:false e
decodificacao:pendente. Não retorna manifesto, digest ou relatório completo à apresentação.
Em recusa, preserva os erros do pipeline; erros próprios têm origem previa e códigos
PREVIA_DESCARTADA, PREVIA_REFERENCIA_INVALIDA ou PREVIA_PREPARACAO_FALHOU, sem stacks/alvos.
Todas as respostas novas da preparação/consulta mantêm decodificacao:pendente, inclusive recusas;
o formato de recusa da API ZIP homologada permanece exatamente como antes.
consultarReferencia retorna status referencia-reconhecida quando válida; recusas nunca incluem
dados parciais autorizativos. Não existe opção, flag ou callback de admissão.

Estados: inicial → preparando → analisado → contexto-disponivel; erro → falha;
descartar leva permanentemente a descartado. analisado é transição síncrona interna, não uma
notificação ou promessa de pixels. Nova chamada preparar antes de descartar substitui a anterior:
incrementa geração, invalida imediatamente todas as referências antigas e libera contexto atual.
Instâncias independentes não se invalidam entre si. Resultados atrasados verificam geração e
descarte antes de instalar contexto; nunca reativam preparação antiga ou sobrescrevem estado novo.

Cancelar equivale a descartar; para outra seleção após cancelamento, criar nova instância.
Invalidar não aborta retroativamente o pipeline homologado em andamento: sua computação limitada
pode terminar antes de liberar temporários. Não publica resultado após cancelamento. Não há fila
ou preparação automática de vários pacotes; o futuro controlador deve limitar concorrência.

O contexto privado retém digest, manifesto validado, recursos verificados e referências por hash.
Descarte zera os vínculos do controlador e limpa o registro de referências, permitindo GC. Não
promete cancelamento do SHA nativo ou apagamento físico imediato. Consumidores podem conservar
uma projeção antiga, mas suas referências deixam de ter direitos. Não há persistência alternativa.

## Contrato fechado lab-v3-previa-1

Construção por seleção explícita, sem spread/cópia de objetos completos do manifesto seguido
de remoções. Toda a árvore é de objetos/arrays ordinários, sem callbacks/getters; congelamento
recursivo impede alterações acidentais. Identificadores são locais p-1, p-2 etc., independentes
dos IDs pedagógicos. Não são globais entre contextos nem fazem parte da identidade lógica.

- Raiz: formato lab-v3-previa-1, titulo fixo Prévia da atividade, questoes na ordem original.
- Questões opcoes/campos: id, tipo, bloco, titulo, instrucao, dica, visuais, itens.
- Subitem: id, pergunta, visuais. Opcoes acrescenta alternativas; campos acrescenta
  campo:{tipo:demonstrativo,valor:""}, sem respostas ou variantes.
- Alternativa: id, visuais, texto somente quando presente. Sem gabarito/alternativaId ou
  indicadores de correção. Texto de alternativa legítima permanece mesmo sendo a resposta correta.
- Ditado: id, tipo, titulo fixo Ditado, idioma, unidade, itens com id e rotulo gerado
  Ditado — item N. Não inclui alvos, IDs originais, áudio ou configuração operacional.
- Imagem: id, tipo, recurso opaco e acessibilidade. rotulo opcional; acessibilidade decorativa
  contém só tipo; essencial contém descricao e descricaoLonga quando fornecida.
- Conjunto: id, tipo, apresentacao, rotulo, elementos e descricaoRelacao opcional. Agrupamento
  contém grupos com id, rotulo e elementoIds remapeados. Todas as ordens são preservadas,
  inclusive referências de grupo fora de ordem e elementos intercalados. Futuro renderer deriva
  a ordem interna do grupo pela ordem relativa de elementos; não reordena os arrays recebidos.

O título administrativo da atividade, perfil, matéria, versão, catálogo, capacidades e IDs
originais não são necessários ao apresentador e não entram na projeção. Informações de questão
permitidas continuam literais, inclusive <, > e aparência de HTML: não há interpretação nem DOM.
Não há OCR ou filtro heurístico: autores ainda podem embutir respostas em texto/imagens livres.
A garantia estrutural é excluir campos avaliativos e alvos de ditado, não detectar significado.

## Referências e futura decodificação

Cada hash recebe um único objeto ordinário vazio/congelado, sem propriedades ou símbolos.
Aliases compartilham esse objeto, mas mantêm descrições contextuais distintas. Somente o registro
privado do controlador atual o reconhece. Cópia JSON, objeto falso, URL, hash textual ou referência
de outra instância não escolhem recurso. O contexto associa o mesmo hash aos bytes e catálogo
do pipeline validado; nenhuma entrada externa pode substituir os bytes depois da conferência.

Não há interface de extração pública. O 3C deverá acrescentar o consumidor privado de bytes
verificados no núcleo, com política própria de decodificação/URLs e memória, sem usar um novo
parser ou aceitar buffers fornecidos pelo apresentador. consultarReferencia só prepara o vínculo
de apresentação; não decodifica nem significa imagem pronta. A opacidade não oferece sigilo
criptográfico contra quem controla o runtime, altera módulos ou possui o ZIP original.

Não existem Blob, URLs temporárias, img, ImageBitmap, canvas, áudio, microfone, rede, sessão,
pontuação, progresso ou escrita de armazenamento. O 3C terá decoder/renderizador isolado;
o 3D terá seleção/navegação sem importação. Ambos permanecem não iniciados.

## Testes e verificação

Testes 3B usam composto heterogêneo e 25 ZIPs congelados, sem alterações nos fixtures/hashes.
Canários exclusivos em alvo de ditado, variantes, título administrativo e IDs; inspeção recursiva
de propriedades/descritores/serialização e projeção imutável; alternativa correta legítima visível.
Contagem de chamada ao analisador comprova um processamento lógico por preparação. VM de teste
instrumenta somente em memória a atribuição de contexto para conferir digest/hash/bytes/catalogo;
não existe hook de observação no código de produção. Há concorrência/descartes deliberadamente
fora de ordem, referências falsas/cruzadas e snapshot contra mutação durante await.

Chromium usa página vazia e servidor efêmero, sem carregar o aplicativo, guardando APIs de rede,
storage, áudio, motor e imagens. Projeção não chega ao DOM nem aos logs; não há renderer neste
incremento. Node usa referência Git do commit-base, que precisa estar disponível no clone (CI
faz fetch-depth:0). Regressões 1/1A, 2B/2C e v1/v2 permanecem obrigatórias.

Nova infraestrutura: executar direcionados, regressões, build, format:check, lint e diff --check.
Parar antes de npm test, apresentar checkpoint e aguardar autorização. Não reduzir a global.

Checkpoint 3B (11/11/2026): 40 novos testes, 213 do analisador e 104 ZIP/publicação, total
357/357 no lote v3; regressões validador/backup v1/v2 155/155. V0–V4 exatos em Node/Chromium.
Build, format:check, lint e diff --check aprovados. Logs locais tmp/3b-*.log (incluindo tentativas
iniciais), sem publicação de evidências. Global 3B ainda não iniciada. Comando previsto, após
autorização, preparar os PDFs sintéticos oficiais se ausentes, conferir porta livre e executar
em PowerShell: $env:PLAYWRIGHT_PORT='5181'; npm test. Sem filtros ou redução de cobertura.

## Encerramento da global 3B — 11/11/2026

Após autorização expressa, conferidos hashes dos 12 arquivos do checkpoint e porta 5181 livre.
Preparados dez PDFs sintéticos exclusivamente nesta worktree. npm test integral executado com
PLAYWRIGHT_PORT=5181, um worker, sem filtros/redução, código de saída 0.
Node: 1701/1701 aprovados, zero falhas/skips/cancelamentos, 147191,6692 ms.
Playwright: 850 descobertos/esperados/executados/aprovados, 850 tentativas; zero failed, flaky,
skipped, notExecuted, retries, interruptedAttempts ou timedOutAttempts. Duração 3393592,519 ms
(56min34s), excluindo pretest/build. Reporter passed, complete true, errors vazio;
sourcesChangedDuringRun e artifactsChangedDuringRun false. Os 12 arquivos mantiveram os hashes
do checkpoint após a suíte; apenas este registro e apontadores documentais atualizados depois.

Log preservado: tmp/3b-global.log; saída em tmp/3b-global-exit-code.txt. Reporter original:
tmp/validacao/2026-11-11T03-39-17-435Z-feb8890d-aec2-4c49-b2de-476d539931d7/run.json.
Nenhum processo de teste/servidor desta worktree permaneceu ativo. Sem staging, commit, push,
PR ou integração escolar. A aprovação é do núcleo 3B: sem decoder, renderer ou prévia navegável;
admissão sempre falsa, decodificação pendente. 3C/3D não iniciados.

## Incremento 3B.1 — cobertura de falha tardia (11/11/2026)

Somente teste e este registro foram alterados. O código de produção permanece idêntico ao
validado na global 3B acima. Novo caso em lab-visual-previa.unit.cjs instrumenta exclusivamente
o VM de teste, exatamente após atribuir contexto e antes de projetar. Exige uma única injeção,
manifesto validado com canário, digest esperado e dois recursos/duas referências privadas com
hashes conferidos; portanto uma recusa anterior à criação parcial não satisfaz o teste.

Confere PREVIA_PREPARACAO_FALHOU, estado falha, recusa sem projeção/digest/manifesto/binários/alvos,
invalidação de referências anteriores e parciais, conclusão assíncrona antiga sem reativação,
recuperação válida na mesma instância e preservação de instância independente. Flags de admissão
falsa e decodificação pendente são mantidas. O helper de inspeção recebe explicitamente o
Object.prototype do VM para exigir objetos ordinários no realm correto; as chamadas anteriores
continuam exigindo o protótipo nativo original. Não há hook novo em produção ou mudança de oráculo.

Executados nesta rodada: caso novo 1/1; suíte 3B completa 41/41 (39 Node + 2 Chromium), dentro
do lote v3 358/358 (41 novos, 213 analisador, 104 ZIP/publicação), sem falhas/skips/cancelamentos.
V0–V4 revalidados. Build, format:check, lint e diff --check aprovados. Logs próprios preservados:
tmp/3b1-falha-tardia-final.log, 3b1-v3-final.log, 3b1-build.log, 3b1-format.log, 3b1-lint.log.
Não substituem os resultados históricos da global nem logs de tentativas anteriores.

Não se repete a global local nesta correção exclusivamente de teste/documentação: não mudou
navegação, registro, armazenamento, áudio, controlador, CSS/HTML, build/bundle, pontuação ou
recuperação; não há novo conjunto escolar ou alcance funcional incerto. O núcleo de produção
já passou na global integral. Fundamentação: gatilhos do AGENTS.md e de TESTES_E_VALIDACAO_REAL.md,
seção Gatilhos da suíte global (lista Execute npm test). Não se declara global aprovada para o novo fingerprint:
1701 Node/850 Playwright continuam sendo a evidência histórica do 3B. Toda futura PR para main
continua exigindo a global integral na CI. Se houver alteração de produção ou outro gatilho,
nova execução local exigirá autorização antes de começar. Sem staging/commit/publicação.
