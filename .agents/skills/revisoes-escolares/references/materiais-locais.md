# Materiais locais, OCR e economia de contexto

## Duas fases com objetivos diferentes

### Analise pedagogica profunda

Quando os materiais ainda precisam ser compreendidos, percorra todas as paginas relevantes e combine texto com inspecao visual. Um PDF pre-OCRizado por PDFgear, Tesseract ou outro processo acelera a leitura, mas nao substitui a compreensao visual.

Para cada pagina relevante:

1. aproveite o texto OCR existente;
2. examine a pagina renderizada;
3. considere desenhos, fotografias, diagramas, tabelas, setas, sequencias, legendas e relacoes espaciais;
4. identifique quando a imagem integra o enunciado ou a resposta;
5. complemente o OCR somente para recuperar informacao ausente ou duvidosa.

Nenhuma pagina relevante esta analisada apenas porque existe OCR. Leia tambem `references/pedagogia-e-cobertura.md` para tratar prova, caderno, prints e gate de cobertura.

### Implementacao tecnica no Codex

Depois que houver sintese pedagogica rica e aprovada, use-a como fonte. Nao refaca OCR, nao rerenderize nem reanalise integralmente os materiais. Consulte uma pagina original somente para resolver duvida pontual indispensavel que a sintese nao permita decidir.

## Hierarquia de processamento local

Quando for realmente necessario extrair informacao:

1. reutilize sintese, OCR e renderizacoes confiaveis;
2. em PDF com camada textual, extraia localmente as paginas relevantes;
3. em documento digitalizado, delimite primeiro as paginas relevantes;
4. use OCR local apenas onde o texto existente for insuficiente;
5. filtre a saida antes de leva-la ao contexto principal.

Nao rerenderize ou re-OCRize o documento inteiro por padrao. Nao despeje OCR bruto ou lotes de imagens no contexto.

## Ferramentas esperadas no computador principal

Detecte antes de usar; nao presuma que outra maquina esteja igual.

- Tesseract OCR 5.4 no PATH, com `por`, `eng` e `osd` no computador principal;
- `por.traineddata` proveniente de `tessdata_best`;
- ImageMagick (`magick`);
- Python 3;
- Node.js/npm;
- LibreOffice/`soffice.exe` quando localizado;
- Git e GitHub CLI (`gh`);
- PDFgear como ferramenta manual, sem presumir CLI.

Execute `scripts/verificar-ferramentas.ps1` quando precisar confirmar o ambiente.

## Idioma OCR

- material escolar em portugues: `-l por`;
- pagina de Ingles: `-l eng`;
- pagina realmente mista: considere `-l por+eng`.

Nao use `eng` para caderno em portugues apenas por ser o padrao do Tesseract.

## Extracao de PDF com texto

O projeto ja depende de `pdfjs-dist`. Extraia apenas a camada textual e as paginas necessarias:

```powershell
node .agents/skills/revisoes-escolares/scripts/extrair-texto-pdf.mjs --pdf "C:\caminho\arquivo.pdf" --pages "132-166" --out "C:\caminho\temporario\material.txt"
```

Use `--pages "1,3,8-12"` para selecao descontigua. O script nao faz OCR.

Se `pdfjs-dist` ou `node_modules` nao estiver disponivel, nao instale dependencia sem necessidade e autorizacao. Use outra ferramenta local existente ou reporte.

## OCR de imagens e PDFs digitalizados

Quando uma pagina relevante ja estiver em imagem e o OCR existente for insuficiente:

```powershell
tesseract "pagina.png" stdout -l por
```

Use ImageMagick somente quando o pre-processamento melhorar a leitura. Em PDF digitalizado, limite as paginas antes de renderizar, mantenha a saida fora do Git e aplique Tesseract somente nas selecionadas. Nunca use `git clean` para descartar temporarios.

## Outros documentos

Use LibreOffice para conversoes mecanicas de DOCX, ODT, PPTX ou planilhas quando isso simplificar a extracao. Converter localmente nao economiza contexto se toda a saida for carregada depois; filtre-a primeiro.

## Sintese pedagogica e privacidade

Registre a analise em `assets/modelo-sintese-pedagogica.md`, incluindo fontes/paginas, elementos visuais, camadas de cobertura, conceitos, ensino, pratica, variedade, limites e duvidas. A sintese deve ser rica o bastante para o Codex implementar sem reabrir todo o material.

Prefira pasta ignorada pelo Git ou fora do repositorio para temporarios. PDF, OCR bruto, paginas renderizadas, prints e dados pessoais nunca devem entrar no staging ou ser publicados.
