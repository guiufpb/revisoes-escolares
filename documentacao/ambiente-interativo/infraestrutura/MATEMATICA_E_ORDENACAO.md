# Matemática e ordenação

## Cena manipulativa

Reutilize os controladores compartilhados e declare quantidades, objetos, unidades e estados na
configuração da etapa. A seleção tem indicação visual e acessível. Depois de selecionar peça, a área
grande aceita clique; ordens incompatíveis continuam bloqueadas com mensagem pedagógica.

Cubinho → U, barra → D, placa → C e cubo → M. Remoção recalcula contagens, número e decomposição.
Trocas exigem exatamente dez peças e preservam valor: 10 U → 1 D, 10 D → 1 C e 10 C → 1 M.
Desfazer e recarregar preservam a representação. Em ábaco, declare montar ou ler e descreva cada
haste de forma acessível.

## Questionário de dezenas, nomes e reais — Alice, outubro de 2026

matematica-dezenas-numeros-dinheiro-outubro-2026 utiliza QuestionariosRevisoes, configurado
com matéria Matemática: 25 questões, 55 subitens e um ponto por questão completa. Inclui campos,
associação por banco fixo, alternativas, seleção exata e ordenação integral reversível. A Q22
usa um único subitem de ordenação no tipo misto; suas quatro colocações não criam quatro pontos.
Desktop Amplo e Modo Responsável são opt-in, com principal Alice e auxiliar independente.

As 22 cenas SVG originais usam geometria determinística: dez células por barra, D à esquerda
de U, ausência de argolas nas unidades igual a zero, dinheiro pedagógico e gráfico com grade
unitária de zero a 17. A tabela equivalente do gráfico permanece em texto acessível.
Q6 ensina os nove nomes das dezenas somente após acerto; Q11 ensina catorze/quatorze antes
de Q12. Campos monetários usam variantes finitas e conservam a vírgula, rejeitando centavos
não nulos. Q14 separa nomes falados dos numerais corrigidos pelo módulo de ditado compartilhado.

## Operações digitadas

Use `matematica-operacoes.js`; enunciados, respostas e progressão ficam no conteúdo por perfil.
Campo numérico tem rótulo real e Enter confere. Depois do erro, preserve a resposta, dê pista
específica e só libere Próxima após a correção.

`apoioVisual` é determinístico e não revela a resposta. Em múltiplos cálculos, cada item tem ID e
resposta próprios. Estudo que não pode ser consultado durante a avaliação persiste separadamente os
estados aberto e concluído. `estudoTabuada.fatores` determina título, contador e tabelas; revisões
antigas mantêm `[1, 2]` quando não declaram.

## Ordenação de cartões

Reconstrua bandeja e posições do estado atual. Cartão colocado pode voltar por clique, novo arrasto
ou controle explícito. Depois de conferir errado, todos os controles necessários à correção
permanecem ativos. Atualize o modelo de dados, não apenas o DOM, e teste um cartão errado na primeira
posição, recarga, teclado, toque e supressão apenas do clique sintético ligado ao `pointerup`.
