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

No motor de Inglês, questões podem declarar `imagemEnunciadoAlt` junto de `imagemEnunciado`.
Quando a mesma imagem é repetida para representar quantidade, o texto alternativo é aplicado
somente à primeira ocorrência, evitando anúncios duplicados. O texto deve descrever toda a
informação visual indispensável à atividade.

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

Uma unidade pode declarar `historia` como etapa opt-in entre o estudo e as atividades. Cada cena
mantém imagem local original, texto em Inglês e Português e uma sequência de áudio EN → PT feita
por `AudioRevisoes`; abrir ou trocar de cena nunca inicia áudio automaticamente. O controlador
persiste a cena atual e a conclusão, exige os pré-requisitos de estudo antes de aceitá-la como
concluída e restaura a etapa na recarga.

Quando `historia.questoesComConsulta` inclui a questão atual, **Rever história** abre essa mesma
etapa sem reinicializar resposta, conferência, liberação do áudio da pergunta, revisão pós-resposta
ou pontuação. **Voltar à questão** restaura o índice e o estado exatos. Revisões sem `historia`
preservam o fluxo anterior.

Uma unidade pode declarar `exigirAudioPerguntaAntesDeResponder: true`. Nesse modo, as alternativas
de cada questão permanecem desabilitadas até o callback `concluido` do áudio daquela pergunta. O
estado persiste somente IDs válidos e únicos em `perguntasOuvidasAtividades`; erro, parada,
cancelamento, nova solicitação, troca de questão ou saída da tela não liberam respostas. `Refazer`
limpa essas liberações junto das respostas e conferências das atividades, sem apagar o vocabulário.
Unidades que não declaram a opção preservam o comportamento anterior.

Uma unidade de Inglês pode ainda declarar
`revisaoPosResposta: { obrigatoria: true, pausaMs: <tempo> }`. Cada questão opt-in mantém em
`revisaoPosResposta` a tradução auditiva da pergunta, a resposta correta em Inglês, seu significado
em Português, as unidades de áudio e uma imagem local opcional. Depois de cada conferência, a tela
mostra somente a pergunta e a resposta correta em Inglês; a tradução existe apenas na sequência de
áudio EN → PT → EN → PT. A próxima questão só é liberada depois do callback final. Uma tentativa
errada retorna à questão para correção após a revisão; uma correta permanece na revisão com avanço
liberado. A conclusão fica associada ao ID da questão e à alternativa conferida, evitando reaproveitar
uma revisão após mudança de resposta.

Esse estado intermediário precisa sobreviver à recarga sem duplicar tentativa, listener ou ponto.
Estados legados já finalizados continuam finalizados mesmo sem o novo campo. `Refazer` limpa as
revisões pós-resposta e reinicia a pergunta 1, preservando estudo e escrita. A questão final segue o
mesmo contrato e só pode concluir a atividade depois da última sequência completa.

O opt-in `revisaoPosResposta.manterTelaAposErro` mantém a tela **Let’s review!** aberta depois da
sequência de uma tentativa incorreta e troca o avanço por **Tentar novamente**. Esse botão retorna
à mesma questão, preserva a alternativa marcada e invalida somente a conclusão daquela tentativa.
Se a criança errar outra vez, uma nova sequência EN → PT → EN → PT é obrigatória. Sem esse opt-in,
o retorno automático após erro permanece inalterado.

O título da mensagem final aceita o opt-in declarativo `destinatariaMensagemFinal`. Quando ausente,
o controlador continua derivando Alice ou Mariana do perfil, preservando todas as revisões antigas;
o texto da mensagem permanece configurável por `mensagemFinal`.

## Correção e feedback

Depois de erro, preserve a resposta para edição, marque `aria-invalid` e dê orientação específica
sem entregar toda a solução. Acerto e conquista acontecem uma vez. Voltar, reabrir e recarregar não
duplicam listeners, cartões ou pontos.

Teste gabarito independente, primeira tentativa errada, correção, desfazer, persistência de várias
ações, troca de perfil/revisão, armazenamento adverso, teclado, toque, celular, axe-core e console.
Qualidade de enunciados e distribuição de alternativas seguem
[Qualidade das questões](../pedagogia/QUALIDADE_DAS_QUESTOES.md).
