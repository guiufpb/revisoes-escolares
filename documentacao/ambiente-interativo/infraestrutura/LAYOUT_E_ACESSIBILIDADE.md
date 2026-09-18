# Layout e acessibilidade

## Base comum

Use rótulos compreensíveis, controles nativos, foco visível, ordem lógica de tabulação, texto
alternativo e `aria-live` para mudanças importantes. Não dependa apenas de cor. Áreas de toque devem
ser confortáveis e `prefers-reduced-motion` respeitado.

Arrastar nunca é o único meio: ofereça clique/toque e teclado. Toda ação de colocar, ordenar ou
arrastar tem caminho claro de remoção ou desfazer.

## Desktop Amplo

`layout: { desktopAmplo: true }` é opt-in. O controlador aplica e remove `.layout-desktop-amplo` ao
trocar de revisão; regras visuais ficam sob essa classe e breakpoint desktop. Questão sem imagem não
reserva coluna vazia. Campos de frase permanecem amplos e o celular volta a uma coluna.

Antes de ativar, valide 1366 × 768, 1920 × 1080 e 390 × 844, incluindo troca para revisão legada,
cabeçalho, áudio, escrita, resultado e remoção da classe.

## Validação

Em 390 × 844 não pode haver rolagem horizontal nem conteúdo encoberto. Teste teclado, toque e mouse,
foco após mudança de etapa, nomes acessíveis, anúncios sem repetição excessiva e axe-core sem
violação grave ou crítica. Um screenshot ajuda a avaliar geometria, mas não substitui asserções de
estrutura, bounding boxes e overflow.
