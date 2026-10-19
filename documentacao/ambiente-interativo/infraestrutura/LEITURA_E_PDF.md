# Leitura e PDF.js

Para livro novo, confira PDF, páginas e capa; cadastre recursos publicáveis em `leituras/<slug>/`;
registre metadados, perguntas, ditados e glossário; crie chaves separadas por perfil; atualize o
registro e mantenha no manifesto de fixtures o número de páginas necessário aos testes.

PDF.js permanece local. O leitor sincroniza páginas, cancela renderizações antigas e mostra somente
o glossário da página atual. Explicações não alteram pontos. Páginas, OCR ou scans privados não
entram no Git.

Para regressões, reutilize os PDFs sintéticos originais do projeto, com texto e desenho conhecidos.
O preparo automático é exclusivo do servidor de teste e não modifica livros reais. Consulte o
contrato e o comando oficial em [Testes e validação real](TESTES_E_VALIDACAO_REAL.md#pdfs-sintéticos-e-preparo-reproduzível).

Teste ambos os perfis, primeira e última página, questionário, ditado, recarga, limpeza seletiva,
troca rápida de página, celular, acessibilidade e `file://`. Uma futura integração de Computação
reutiliza este leitor, sem criar implementação paralela.

## Decodificadores locais do PDF.js 6.3.289 — 18/10/2026

A integração anterior fornecia apenas a URL do PDF. Imagens JPEG 2000 e CCITT podiam
resolver como nulas quando o worker não localizava o WASM nem o fallback JavaScript;
canvas visível e navegação não comprovavam decodificação completa.

`pdfjs.entry.js` conserva a fachada compartilhada `PDFJSLocal` e acrescenta `wasmUrl`
local absoluto, relativo ao módulo e com barra final, sem mutar as opções do chamador.
Uma opção `wasmUrl` explícita é preservada. Os leitores integrado e dedicado continuam
usando a mesma API; armazenamento, questionários, páginas salvas e pontuação não mudam.

`vite.pdfjs.config.js` emite os 13 arquivos oficiais de `pdfjs-dist/wasm` em
`ambiente_interativo/js/pdfjs-wasm/`, com nomes estáveis, fallbacks JS e licenças.
Não há dependência de CDN, Azure ou `node_modules` no pacote distribuído. Os recursos
gerados de terceiros são excluídos de formatação/lint; sua igualdade byte a byte com
o pacote instalado é testada. Fontes, CMaps e ICC não foram implicados nos casos
investigados e não foram acrescentados por hipótese.

`tests/pdfjs-offline.spec.js` cobre o pacote estático sem Vite/node_modules, os 13
arquivos/MIME, imagens sintéticas originais JPEG 2000 e CCITT Group 4, padrão de pixels,
fallbacks sob HTTP 503 simulado, API/opções, cancelamento, ambos os leitores/perfis,
recarga e isolamento de progresso. Recursos auxiliares são locais, via HTTP; o ramo
`file://` do leitor integrado preserva a orientação de abrir o PDF original, sem
prometer suporte a fetch/worker que esse protocolo não garante.

Na conferência local autorizada, 21 páginas dos dez PDFs históricos foram amostradas
sem copiá-los, extrair texto/pixels ou produzir capturas. A página afetada recuperou
118/118 objetos de imagem; a amostra não apresentou avisos de decodificação ou objetos
nulos indevidos. Essa evidência não certifica todas as páginas nem variantes de codecs.
Os resultados finais dos comandos oficiais e da suíte global ficam registrados no
relatório local da tarefa; não constituem reatestação automática dos experimentos.

Validação da correção em 18/10/2026, no clone independente: build, format:check, lint,
manifesto e 277 testes Node aprovados. Uma execução integral de `npm test` sobre o
snapshot de código consolidado aprovou os 590 casos Playwright em 41,7 minutos,
sem falhas ou skips. Inclui os 12 novos contratos de decodificação/distribuição e
os 578 casos anteriores; não reutiliza a aprovação histórica da PR #48 como evidência
atual. Os hashes do código testado e dos 13 recursos foram reconferidos após a suíte.
A aprovação acima é evidência histórica desse snapshot. Posteriormente, a correção foi
integrada ao ambiente escolar atualizado e a Fase 3C foi concluída operacionalmente,
conforme confirmação do responsável: abertura pelo novo atalho, Firefox habitual na
origem `http://127.0.0.1:5173`, progressos de Alice e Mariana preservados e leitura de PDF
funcionando. A revisão de Mariana "Singular e plural no cotidiano" permanece concluída.
O atalho reutiliza o auxiliar existente com `-SemPronuncia`; Azure não foi ativado nessa
conferência. A publicação no GitHub continua pendente e exige autorização própria.

## Avisos QuickJS no pacote distribuído — Fase 4B

Os 13 recursos oficiais, inclusive `quickjs-eval.js` e `quickjs-eval.wasm`, permanecem
inalterados. Esses dois arquivos conferem byte a byte com a versão 6.3.289 e com o commit
upstream `a3beacc1a35f2d285f0505c5489d8cb4a9ebcc89`, que acrescentou os avisos omitidos
na distribuição, sem mudar os recursos. O [README dessa versão](https://github.com/mozilla/pdf.js/blob/v6.3.289/external/quickjs/README.md)
declara a licença MIT; a regularização upstream está na [PR #22185](https://github.com/mozilla/pdf.js/pull/22185),
associada ao [issue #22143](https://github.com/mozilla/pdf.js/issues/22143).

O arquivo `ambiente_interativo/js/QUICKJS_LICENSE.txt` reproduz integralmente os avisos
oficiais `LICENSE_PDFJS_QUICKJS` e `LICENSE_QUICKJS`, com suas atribuições, fontes fixas
e SHA-256. Ele fica junto aos arquivos distribuíveis, fora de `pdfjs-wasm/`, preservando
o conjunto original de 13 recursos. O build conserva esse arquivo (`emptyOutDir: false`)
e o ensaio estático distribui toda a árvore pública de `ambiente_interativo`, sem PDFs
escolares. A redistribuição deve incluir também esse aviso, além das seis licenças já
presentes; não basta conservar a documentação ou o pacote de desenvolvimento.

O contrato estático de `tests/pdfjs-offline.spec.js` exige o aviso por HTTP, MIME textual
e os hashes exatos dos dois textos MIT oficiais. Não executa consultas externas durante
os testes, não substitui os decodificadores e não reduz as asserções anteriores. O total
permanece em 590 casos; a suíte de 277 Node/590 Playwright anterior é histórica e não
certifica automaticamente este novo snapshot de preparação para publicação. Resultados
da nova rodada ficam nos artefatos locais de validação, sem renovar pins ou atestações.
