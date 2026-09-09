# Questionarios, Portugues, Historia, Geografia, Ciencias, Ingles e audio

## Questionarios declarativos

Para novas revisoes de Gramatica/Portugues e, quando adequado, Historia, Geografia, Ciencias e outras materias, prefira o motor compartilhado descrito no inventario e nas instrucoes:

- `ambiente_interativo/js/gramatica-questionarios.js` / `window.QuestionariosRevisoes`;
- `ambiente_interativo/js/questionarios-interacoes.js` para tipos opcionais existentes;
- conteudo em `ambiente_interativo/revisoes/<perfil>/`.

Nao crie outro motor de questionarios para trocar materia ou conteudo.

Use apenas tipos/capacidades realmente disponiveis na implementacao atual. Consulte uma revisao equivalente.

## Conteudo pedagogico

- linguagem infantil, simples e objetiva;
- uma tarefa principal por tela quando possivel;
- conteudo autossuficiente quando a crianca nao deve depender do caderno aberto;
- atividades proprias, sem copiar livro/site;
- para escrita com varias respostas possiveis, prefira alternativa, banco fechado ou transformacao definida.

Antes de definir as questoes, conclua a matriz e o gate de `references/pedagogia-e-cobertura.md`. Inclua textos curtos de apoio quando o conceito precisar ser ensinado e varie as interacoes conforme a materia, sem deixar a revisao dominada por multipla escolha.

## Validacao textual por materia

Em Ciencias, Historia, Geografia, Matematica e Leitura, trate maiusculas/minusculas como equivalentes por padrao. Nao rejeite, por exemplo, uma resposta conceitualmente correta apenas porque o gabarito interno usa caixa alta.

Reserve `maiusculasObrigatorias` principalmente para Gramatica/Portugues, estudo explicito de maiusculas ou enunciado que exija esse aprendizado. Aplique o mesmo criterio a pontuacao, acentuacao e frase completa: exija somente quando fizerem parte do objetivo pedagogico e deixe a exigencia clara no enunciado.

## Ditado e audio

Use exclusivamente os modulos compartilhados existentes:

- `ambiente_interativo/js/audio.js`;
- `ambiente_interativo/js/gramatica-ditado.js` quando aplicavel.

Regras basicas:

- audio somente apos acao da crianca;
- pt-BR para ditado/instrucoes em portugues;
- en-US para conteudo em ingles;
- repetir/parar/cancelar;
- nao revelar/preencher a resposta;
- preserve as configuracoes de velocidade/aquecimento definidas nas instrucoes atuais;
- nao crie `speechSynthesis` paralelo.

Ditado e ferramenta pedagogica quando exercita leitura, escrita ou vocabulario de forma apropriada; nao e apenas uma solucao tecnica para evitar respostas abertas.

## Ingles

Reutilize `ambiente_interativo/js/ingles.js` e `audio.js`.
Recursos opt-in como pratica de escrita ou Desktop Amplo so devem ser usados conforme implementacao/documentacao atual e sem mudar revisoes antigas.

## Desktop Amplo

E opt-in. Ao usa-lo, teste troca para revisoes antigas e viewports de desktop/celular previstos nas instrucoes.

## Testes

Inclua, quando aplicavel:

- gabarito independente/percurso completo;
- erro/correcao;
- varios subitens;
- persistencia/limpeza seletiva;
- audio sem inicio automatico;
- repetir/parar/cancelar;
- teclado/toque;
- 390 x 844;
- axe-core;
- console;
- `file://`;
- isolamento entre Alice/Mariana e revisoes antigas.
