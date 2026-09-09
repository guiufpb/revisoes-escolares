# Analise pedagogica e cobertura

Leia esta referencia antes de criar uma revisao, uma sintese pedagogica ou o Markdown de implementacao para o Codex.

## Separacao de responsabilidades

Na fase de analise pedagogica, normalmente conduzida no ChatGPT:

- estude todas as paginas e materiais relevantes;
- combine texto, imagens, caderno, prova e prints correlatos;
- identifique o que ensinar e como a crianca vai observar, praticar e consolidar;
- produza atividades originais e uma sintese rica;
- conclua a matriz de cobertura e o gate pedagogico antes de gerar o Markdown para implementacao.

Nao aplique economia que reduza profundidade, conceitos considerados, qualidade dos textos, diversidade, ilustracoes ou adequacao pedagogica.

Na fase de implementacao no Codex, use a sintese aprovada como fonte pedagogica. Consulte poucos arquivos tecnicos, prefira uma revisao equivalente conhecida e nao refaca OCR, renderizacao ou analise integral salvo duvida pontual indispensavel.

## Camadas de cobertura

Classifique o material em quatro camadas:

1. **Nucleo obrigatorio** — conteudo explicitamente indicado para a prova.
2. **Reforco** — conteudo do caderno diretamente ligado ao nucleo.
3. **Ampliacao correlata** — conceitos presentes em prints, atividades complementares e materiais relacionados, adequados a idade e uteis para compreender o nucleo.
4. **Enriquecimento** — conhecimento adicional pequeno, seguro e apropriado a serie, usado quando melhora a compreensao.

A prova determina o nucleo, nao o limite maximo. Como referencia flexivel, destine cerca de 70–80% do percurso a nucleo/reforco e 20–30% a ampliacao/enriquecimento. Ajuste quando o material justificar; nao transforme a proporcao em regra matematica.

## Ensinar antes e ao longo da pratica

Uma revisao relevante deve combinar:

**ensinar -> observar -> praticar -> verificar -> consolidar**

Nao produza uma sequencia longa composta apenas por perguntas. Quando um conceito exigir conhecimento previo, inclua antes ou junto da atividade um apoio curto, infantil e autossuficiente, como:

- Leia para aprender;
- Voce sabia?;
- Observe e descubra;
- Vamos lembrar;
- Veja este exemplo;
- Descubra comigo.

O apoio nao precisa valer ponto. Ensine apenas o necessario e nao revele diretamente a resposta da atividade seguinte.

## Densidade pedagogica

Densidade pedagogica significa oferecer conhecimento, retomada, observacao, aplicacao, feedback e consolidacao ao longo do percurso. Nao significa escrever muito.

Um item pode combinar uma explicacao curta, uma imagem util, uma aplicacao simples e feedback orientador. Priorize qualidade por tela e progressao de entendimento, nao apenas quantidade de questoes.

## Prints, caderno e imagens

Para cada print relevante, identifique:

1. o conceito acrescentado;
2. a habilidade exercitada;
3. o formato pedagogico interessante;
4. a camada de cobertura ou o uso apenas como referencia;
5. como transformar a contribuicao em atividade original.

Considere paginas correlatas do caderno, mesmo quando nao repetem literalmente a lista da prova, se ajudarem a compreender o nucleo.

Imagem pedagogica deve ensinar, contextualizar ou participar da resposta. Priorize partes, comparacao, sequencia, quantidade, consequencia, ambiente, classificacao, objeto-alvo e relacao espacial. Evite imagem ou SVG meramente decorativo. Reutilize assets adequados e crie novos somente quando melhorarem a aprendizagem.

Nunca copie enunciados completos, textos, ilustracoes protegidas, personagens, logos, diagramacao ou folhas prontas. Use o material como fonte pedagogica, nao como molde.

## Diversidade real de atividades

Escolha interacoes conforme materia, idade, objetivo e infraestrutura existente. Combine, quando fizer sentido:

- alternativa e selecao multipla;
- associacao, classificacao e ordenacao;
- completar com banco fechado;
- observar uma cena e identificar uma parte;
- sequencia visual;
- verdadeiro/falso quando apropriado;
- manipulaveis;
- escrita controlada e ditado;
- mini-situacao-problema e subquestoes;
- desenho quando tiver valor pedagogico e nao depender de correcao automatica impossivel.

Nao imponha percentuais rigidos, mas corrija percursos dominados por multipla escolha. Em materias visuais, a imagem deve participar do ensino ou da resposta.

Quando varias respostas legitimas puderem estar corretas e o sistema aceitar apenas uma, evite campo livre. Prefira alternativas, banco fechado, transformacao definida, classificacao, associacao ou ditado. Ditado deve ter valor pedagogico proprio para leitura, escrita ou vocabulario; nao o use apenas como contorno tecnico.

## Validacao textual por materia

Exija somente o que pertence ao objetivo pedagogico da atividade.

Em Ciencias, Historia, Geografia, Matematica e Leitura, a comparacao deve ser por padrao insensivel a maiusculas/minusculas. Reserve `maiusculasObrigatorias` principalmente para Gramatica/Portugues, estudo explicito de maiusculas ou enunciado que exija essa aprendizagem.

Adote o mesmo criterio para pontuacao, acentuacao e frase completa. Nao rejeite uma resposta conceitualmente correta por uma convencao de escrita que a atividade nao ensina nem avalia. Se a escrita fizer parte do objetivo, declare a exigencia no enunciado e forneca feedback especifico e recuperavel.

## Matriz de cobertura

Antes de escrever as atividades ou gerar o Markdown para implementacao, monte ao menos internamente uma matriz com:

| Conceito | Fonte | Prioridade | Nivel | Como ensinar | Como praticar | Tipo de atividade |
| --- | --- | --- | --- | --- | --- | --- |
| Exemplo: materiais | prova/caderno | alta | nucleo | explicacao curta | associar objeto e material | associacao |

A matriz deve mostrar todos os conceitos relevantes sem inflar o percurso com repeticao. Use-a para detectar lacunas, excesso de um tipo de interacao e conceitos que precisam de apoio antes da avaliacao.

## Gate pedagogico antes do Markdown

Responda a todos os itens antes de gerar a sintese final ou o prompt de implementacao:

1. Todos os topicos obrigatorios da prova foram contemplados?
2. Todas as paginas relevantes do caderno foram consideradas?
3. As imagens e os elementos visuais relevantes foram compreendidos?
4. Os prints uteis contribuiram para o planejamento?
5. Ha conteudo correlato pertinente?
6. A revisao ensina, alem de avaliar?
7. Ha explicacoes antes dos conceitos que precisam ser ensinados?
8. Existe variedade real de interacoes?
9. Ha excesso de multipla escolha?
10. Alguma questao admite resposta legitima nao prevista?
11. A linguagem esta adequada a idade e a serie?
12. A dificuldade esta adequada?
13. As regras de escrita correspondem a materia e ao objetivo?
14. Ha repeticao sem ganho?
15. Alguma questao pode ficar mais rica sem ficar mais dificil?
16. As imagens tem funcao pedagogica real?
17. A revisao e autossuficiente ou exige voltar ao caderno para responder?

Se qualquer resposta revelar lacuna material, corrija a matriz e o plano. Gere o Markdown para o Codex somente depois de concluir o gate.
