# Questionários e interações

## Motores compartilhados

Use `js/gramatica-questionarios.js`, também exposto como `window.QuestionariosRevisoes`, para
Gramática e matérias compatíveis. `js/questionarios-interacoes.js` acrescenta capacidades opt-in.
Conteúdo fica em `revisoes/<perfil>/`; matéria, mensagens e respostas não entram no controlador.

As capacidades atuais incluem alternativa, associação, campo, seleção, ordenação e tipo misto.
`opcoesReversiveis: true` permite desmarcar. Seleção e ordenação precisam funcionar por clique,
toque e teclado; cartões podem ser retirados. Uma questão com subitens pontua apenas quando todos
estiverem corretos.

`validacaoEstritaEstado: true` normaliza IDs, opções, duplicatas, conferências e tentativas erradas.
Não a ative retroativamente sem avaliar o armazenamento legado. `pontuacaoFlexivel` só flexibiliza
os campos das matérias que o declaram.

## Campos e ditados

Declare `maiusculasObrigatorias`, `acentuacaoObrigatoria` e `fraseCompleta` somente quando forem
objetivos pedagógicos. `inserirTravessao: true` oferece um botão que insere o sinal no cursor e
permite apagá-lo normalmente. Enter confere sem interceptar composição de caracteres.

Ditados usam `gramatica-ditado.js` e a política de [Áudio e voz](AUDIO_E_VOZ.md). O controle nunca
revela a resposta. `cancelarAoTrocarCampo: true` cancela ao mudar de subitem e desabilita a repetição
da solicitação anterior.

## Leitura, imagens e mapas

`leitura` cria quadro de apoio sem HTML arbitrário. `ilustracaoLeitura` exige imagem local original
ou licenciada e descrição significativa. `mapaVisual` associa botões nomeados a pontos percentuais
de uma imagem; cada ponto permanece acionável por teclado e o acerto não depende só de cor.

Não copie páginas, personagens ou imagens do material escolar. Quando a síntese pedagógica já foi
fornecida, não reextraia PDF sem pedido ou dúvida indispensável.

## Inglês

`js/ingles.js` atende várias revisões por perfil e chave. Clique ou teclado em cartão seleciona o
item e inicia a fala normal. A prática opt-in de escrita usa
`praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true }`, um campo real, Enter,
autocompletar/capitalização/corretor desativados e normalização apenas de caixa e espaços.

Persistem `respostasEscrita` e `conferenciasEscrita`; editar resposta correta invalida a conferência.
Variantes legítimas são explícitas em `variantesEscrita`. Se a escrita for obrigatória, o portão das
atividades combina todos os áudios concluídos e todas as escritas corretas.

## Correção e feedback

Depois de erro, preserve a resposta para edição, marque `aria-invalid` e dê orientação específica
sem entregar toda a solução. Acerto e conquista acontecem uma vez. Voltar, reabrir e recarregar não
duplicam listeners, cartões ou pontos.

Teste gabarito independente, primeira tentativa errada, correção, desfazer, persistência de várias
ações, troca de perfil/revisão, armazenamento adverso, teclado, toque, celular, axe-core e console.
Qualidade de enunciados e distribuição de alternativas seguem
[Qualidade das questões](../pedagogia/QUALIDADE_DAS_QUESTOES.md).
