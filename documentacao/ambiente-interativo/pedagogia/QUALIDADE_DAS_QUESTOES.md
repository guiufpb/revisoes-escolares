# Qualidade das questões

## Clareza e resposta

Use linguagem infantil, simples e objetiva, com uma tarefa principal por tela quando possível. A
questão deve ser autossuficiente quando a criança não puder consultar o caderno. Leitura de apoio
ensina o necessário sem entregar o gabarito.

Evite resposta aberta quando várias formulações legítimas não puderem ser validadas com segurança.
Prefira alternativa, banco fechado, transformação definida ou conjunto explícito de respostas.
Exija maiúscula, acento, pontuação ou frase completa somente quando isso for objetivo pedagógico e
estiver claro no enunciado.

Imagens têm função pedagógica, descrição significativa e autoria/licença adequada. Ornamentação não
deve competir com a tarefa nem substituir texto necessário.

## Alternativas e gabarito

As posições corretas têm distribuição determinística, irregular e reproduzível. Elas não mudam a
cada reload e não dependem de aleatoriedade em runtime. Ao preparar o conteúdo, evite:

- quatro ou mais corretas consecutivas na mesma posição;
- alternância perfeita prolongada como A/B/A/B/A/B;
- concentração extrema numa posição;
- sequência que replica a ordem apresentada no título, banco ou texto de apoio;
- distratores absurdos que revelam a correta sem exigir o conhecimento avaliado.

A auditoria mecânica detecta padrões de posição, não qualidade semântica. Testes podem reutilizar
`tests/helpers/auditoria-gabaritos.js`; o gabarito do percurso completo continua independente do
conteúdo renderizado.

## Uso real

Automação não mede ambiguidade percebida, dificuldade, ergonomia nem estratégia de chute. Durante o
uso real, observe hesitação, leitura das pistas, padrões descobertos pela criança, áudio e correção.
Registre validação somente após confirmação do usuário e corrija o menor escopo necessário sem
reescrever atividades que continuam adequadas.
