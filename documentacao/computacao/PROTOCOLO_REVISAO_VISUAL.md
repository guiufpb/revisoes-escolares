# Protocolo de Revisão Visual — Computação

## Objetivo

Páginas críticas de Computação precisam provar visualmente a relação ensinada antes de receber acabamento final. Este protocolo reduz divergência entre roteiro e ilustração, páginas bonitas porém ambíguas, correções tardias, retrabalho do PDF completo e consumo desnecessário de geração e renderização.

Princípios do processo:

> Em Computação, uma página crítica não pode ir diretamente do roteiro textual para a arte final.

> A arte pode variar; a semântica pedagógica não.

## Quando aplicar

Uma página é crítica quando introduz vocabulário ou conceito novo, mostra primeira execução, erro, correção, repetição/loop, arquitetura/fluxo, comparação necessária, ou questão integrada final. Registre o tipo da página (`N`, `C`, `S`, `X`, `D`, `R`, `A`, `Q` ou `G`) no roteiro e use o [Modelo de Contrato Visual](MODELO_CONTRATO_VISUAL.md) para cada página crítica.

O artefato local do volume é `output/pdf/volumeN/CONTRATO_VISUAL_VOLUME_N.md`. Ele registra somente páginas críticas e pode apontar para previews e wireframes. Permanece local se `output/` estiver ignorado. O relatório final deve informar quantidades de páginas críticas, contratos preenchidos, wireframes aprovados, revisões cegas e correções seletivas.

## Fluxo obrigatório para página crítica

1. **Roteiro pedagógico.** Defina conceito, objetivo, texto, tipo e por que a página é crítica.
2. **Contrato Visual.** Antes da arte, registre o que a criança deve perceber, estados inicial/final, elementos e relações espaciais obrigatórios, ordem, agrupamentos, inferências e interpretações proibidas e pergunta de teste visual.
3. **Wireframe de baixa fidelidade.** Construa caixas, setas, rótulos, posições, agrupamentos, placeholders de personagens, estados e numeração. Ele testa semântica, não beleza.
4. **Auditoria do wireframe.** Compare-o ao contrato: o conceito está visível, a leitura espacial está correta, há interpretação concorrente, decoração interfere, e a pergunta de teste pode ser respondida só olhando a estrutura? Corrija o wireframe se qualquer resposta falhar.
5. **Bloqueio da geometria pedagógica.** Após aprovação, congele relações, agrupamentos, direção, ordem, estados, quantidade e pontos de decisão.
6. **Arte final.** Aplique personagens, cenário, textura, paleta e acabamento sem mudar a geometria aprovada. Diagramas lógicos permanecem preferencialmente determinísticos.
7. **Revisão cega do render.** Abra a página renderizada antes de consultar código, prompt ou intenção; descreva objetivamente o que ela comunica e só então compare com o contrato.
8. **Validação estrutural.** Execute verificações determinísticas aplicáveis.
9. **Correção seletiva.** Corrija somente a página ou elemento reprovado, rerenderize, refaça a revisão cega e compare deterministicamente; preserve páginas aprovadas.
10. **Gate final.** Libere a página somente com contrato, wireframe, render, revisão cega e validação estrutural aplicável aprovados.

## Wireframes e geometria pedagógica

Wireframes precedem a ilustração final, são baratos, podem usar formas simples e não exigem personagens acabados. Devem preservar proporção aproximada da página A4 e mostrar caixas, setas, rótulos e relações. Para páginas críticas, prefira `previews/wireframes/pagina-XX-wireframe.png` e a prancha `previews/wireframes/contato-wireframes-criticos.jpg`. Inspecione-os antes do acabamento.

Depois de aprovados, não altere sem reabrir o contrato: direção do fluxo, posição relativa, agrupamento, bifurcação, ordem, quantidade, estados, correspondência item/rótulo, lados, número de repetições ou ponto de decisão. Textura, expressão, cenário, acabamento e detalhes decorativos podem mudar se não prejudicarem a acessibilidade ou a relação ensinada.

## Revisão cega

Revisão cega é uma técnica de processo, não independência absoluta entre agentes. O agente conhece o projeto, mas deliberadamente segue esta ordem:

1. abrir o render;
2. descrever literalmente a semântica observável;
3. registrar a interpretação espontânea;
4. abrir o contrato;
5. comparar observado e esperado;
6. aprovar ou reprovar.

Registre o que aparece, o que está ligado a quê, a ordem percebida, estados coexistentes, causa aparente e grupos visuais. Não conclua que a intenção está presente porque conhece o briefing. Por exemplo, “CPU, RAM e GPU estão no mesmo contêiner, sem setas sequenciais; isso comunica cooperação” é evidência visual. Se a descrição divergir do contrato, a página falha.

## Construção determinística e arte artística

| Construção determinística, quando possível | Arte generativa/original apropriada |
| --- | --- |
| algoritmo, sequência, loop, bug, antes/depois, esperado/acontecido, estados, RAM × armazenamento, CPU/RAM/GPU, entrada/processamento/saída, condições, `SE/ENTÃO/SENÃO`, `TRUE/FALSE`, `AND/OR/NOT`, árvores de decisão e questão lógica integrada | Lina, Nino, Tico, cenários, emoções, aventura, mundo lúdico e objetos narrativos |

Use SVG, ReportLab, formas vetoriais, componentes programáticos ou ativos fixos para a primeira coluna. Combine cena artística e overlay determinístico quando a história der contexto e o diagrama fornecer a lógica.

Exemplos originais de semântica:

- **Coexistência:** `EM USO → SALVO` é inadequado quando ambos coexistem. Um mesmo estado deve originar **EM USO** e **VERSÃO SALVA**.
- **Cooperação:** `CPU → RAM → GPU` é inadequado para colaboração sem sequência física obrigatória. Agrupe os três em **COOPERAÇÃO INTERNA**.
- **Condição:** não use `SE → ENTÃO → SENÃO` como série. Use um ponto comum de decisão:

```text
        SE condição?
        /         \
     SIM           NÃO
      |             |
    ENTÃO         SENÃO
```

## Validação estrutural e teste de leitura visual

Um validador como `validate_visual_contract.py`, ou o validador específico do volume, pode conferir quando aplicável: rótulos, quantidades, ordem, IDs, caixas dentro de contêineres, sobreposição, margens, fonte mínima, setas esperadas/proibidas, página/pergunta/gabarito, continuidade entre partes, símbolos, repetições, nomes de estado e títulos como `MODELO SIMPLIFICADO`. Ele complementa, mas não substitui, a revisão visual.

Pergunte em cada página crítica: **“Se eu ocultar o parágrafo explicativo e olhar apenas a estrutura visual, qual relação eu concluo?”** A resposta deve ser compatível com o contrato. Página que exige texto para corrigir um desenho ambíguo falha. Páginas narrativas podem depender mais do texto, mas nunca contradizer visualmente o conceito.

## Condições: preparação obrigatória antes do Volume 5

Este protocolo deve estar ativo antes da produção visual do Volume 5; ele não autoriza iniciar esse volume. Para `SE / ENTÃO / SENÃO`, coloque a condição em ponto inequívoco, faça dois resultados saírem do mesmo teste, rotule VERDADEIRO/FALSO além da cor e termine ramos em ações coerentes. Mostre retorno ou convergência apenas quando necessário. Para `AND`, mostre condições simultâneas; para `OR`, não exija todas; para `NOT`, torne a negação ou inversão inequívoca.

## Artefatos futuros por volume

Além do contrato local, recomende `previews/wireframes/`, `contato-wireframes-criticos.jpg`, `contato-paginas-criticas.jpg`, relatório final e scripts de comparação/validação quando aplicáveis. Não rerenderize o volume inteiro sem necessidade: correções devem preservar evidência determinística de que páginas fora do escopo não mudaram.
