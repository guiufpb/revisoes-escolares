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

Play Time usa `data-unidade` no painel de Inglês para restringir seu tratamento visual:
em desktop, cenas de enunciado ficam amplas e a comparação A/B ocupa a largura do cartão,
com alternativas abaixo. Figuras alternativas ficam maiores em todas as telas. No celular,
as versões locais de comparação empilham A/B sem alterar as cenas; as legendas também são amplas.
A imagem opt-in das conversas é responsiva; pergunta/resposta mantêm as colunas existentes no
desktop e uma coluna no celular. Essas regras não se aplicam às outras unidades de Inglês.

Em 390 × 844 não pode haver rolagem horizontal nem conteúdo encoberto. Teste teclado, toque e mouse,
foco após mudança de etapa, nomes acessíveis, anúncios sem repetição excessiva e axe-core sem
violação grave ou crítica. Um screenshot ajuda a avaliar geometria, mas não substitui asserções de
estrutura, bounding boxes e overflow.

## Modo Responsável opt-in

O painel administrativo de Inglês e dos questionários optantes fica oculto no uso infantil normal
e só responde a `Ctrl + Alt + R` em uma unidade ou revisão que declare `modoResponsavel`. Ele usa controles nativos com
rótulos, foco visível, região de status e faixa persistente quando a sessão auxiliar está ativa.
`Escape` fecha apenas o painel, sem encerrar a sessão; o botão **Encerrar sessão responsável** volta
à sessão principal. O atalho é ignorado em campos editáveis da atividade e deve ser validado também
em 390 × 844 sem overflow horizontal.
