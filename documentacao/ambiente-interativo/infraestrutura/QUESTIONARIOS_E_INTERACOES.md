# Questionários e interações

## Motores compartilhados

Use `js/gramatica-questionarios.js`, também exposto como `window.QuestionariosRevisoes`, para
Gramática e matérias compatíveis. `js/questionarios-interacoes.js` acrescenta capacidades opt-in.
Conteúdo fica em `revisoes/<perfil>/`; matéria, mensagens e respostas não entram no controlador.

As capacidades atuais incluem alternativa, associação, campo, seleção, ordenação e tipo misto.
`opcoesReversiveis: true` permite desmarcar. Seleção e ordenação precisam funcionar por clique,
toque e teclado; cartões podem ser retirados. Uma questão com subitens pontua apenas quando todos
estiverem corretos.

`validacaoEstritaEstado: true` normaliza IDs, opções, duplicatas e conferências.
Não a ative retroativamente sem avaliar o armazenamento legado. `pontuacaoFlexivel` só flexibiliza
os campos das matérias que o declaram.
`registrarTentativas: true` acrescenta, somente na revisão optante, a contagem persistida de
conferências completas por questão. Conferir com item vazio não conta como tentativa; voltar,
recarregar e salto administrativo não incrementam a contagem.

## Campos e ditados

Campos simples usam `pergunta` para o texto do rótulo e do contexto da resposta. O motor não
renderiza `antes`/`depois`. O contrato de [adição integrada v3](../../../validacao/ADICAO_INTEGRADA.md)
exige `id`, `pergunta` e `respostas`, recusando rótulo ausente, vazio ou `undefined`/`null`.
A prova estática não certifica suficiência pedagógica do enunciado: confira o contexto visível
e o nome acessível no formulário real. Essa correção não modifica o motor ou revisões existentes.
Em `questoes[*]`, `bloco` também é obrigatório no contrato v3: texto literal não vazio para a
etiqueta acima do título, sem valor automático. Ausência, tipos não textuais e os textos
`undefined`/`null` são recusados. Título, instrução e pergunta mantêm suas funções próprias.

Declare `maiusculasObrigatorias`, `acentuacaoObrigatoria` e `fraseCompleta` somente quando forem
objetivos pedagógicos. `inserirTravessao: true` oferece um botão que insere o sinal no cursor e
permite apagá-lo normalmente. Enter confere sem interceptar composição de caracteres.

Ditados usam `gramatica-ditado.js` e a política de [Áudio e voz](AUDIO_E_VOZ.md). O controle nunca
revela a resposta. `cancelarAoTrocarCampo: true` cancela ao mudar de subitem e desabilita a repetição
da solicitação anterior.

## Leitura, imagens e mapas

`leitura` cria quadro de apoio sem HTML arbitrário. `ilustracaoLeitura` exige imagem local original
ou licenciada e descrição significativa. Em itens de alternativa, `imagem` e `imagemAlt` exibem uma
figura local própria para cada subitem, sem criar coluna vazia nos itens sem imagem. `mapaVisual`
associa botões nomeados a pontos percentuais
de uma imagem; cada ponto permanece acionável por teclado e o acerto não depende só de cor.

No motor de Inglês, questões podem declarar `imagemEnunciadoAlt` junto de `imagemEnunciado`.
Quando a mesma imagem é repetida para representar quantidade, o texto alternativo é aplicado
somente à primeira ocorrência, evitando anúncios duplicados. O texto deve descrever toda a
informação visual indispensável à atividade.

`imagemEnunciadoMobile` e `imagemRespostaMobile` são opcionais no motor de Inglês: selecionam
uma versão local por `picture` até 720 px, mantendo a descrição acessível da imagem principal.
Sem esses campos, o recurso original permanece em todas as telas. A fonte móvel pós-resposta
é limpa ao renderizar outra questão, inclusive quando a nova revisão não declara imagem.

Não copie páginas, personagens ou imagens do material escolar. Quando a síntese pedagógica já foi
fornecida, não reextraia PDF sem pedido ou dúvida indispensável.

## Cenas contáveis em campos e alternativas

Campos simples podem declarar imagem e imagemAlt no subitem; a cena local fica junto do
rótulo e do campo, sem alterar a resposta ou a persistência. Alternativas podem ativar
imagemAmpla: true para cenas que precisam preservar peças contáveis, usando largura
responsiva e altura natural. Sem a opção, a geometria anterior das imagens de alternativas
permanece vigente. A revisão de Matemática de Alice de outubro utiliza esses opt-ins para
ábacos, barras, carteiras e comparação de representações.

## Inglês

Em Play Time · Unit 6, `textoPerguntaVisivel` opcional permite mostrar **Listen and choose.**
em Q01–Q02. Somente a pergunta visível usa esse campo; pergunta auditiva e consolidação continuam
usando `perguntaIngles`. Não inserir o alvo ditado em title, tooltip, nome acessível ou status
antes da conferência. Sem o campo, a apresentação anterior é preservada.

`ordemAlternativasFixa: true` na unidade preserva a ordem declarada A–D, em ambas as sessões.
Esse opt-in foi necessário porque a distribuição determinística do controlador anterior também
reordenava o gabarito fechado de Play Time. Ausência da opção conserva a distribuição legada.
`rotuloAcessivel` opcional na alternativa define seu nome acessível, permitindo descrever quantidade,
móvel e posição em Q14 sem antecipar a frase inglesa. As imagens das alternativas permanecem
decorativas quando o botão já tem uma descrição significativa.

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

O motor de Inglês também aceita o opt-in `modoResponsavel`, com `habilitado` e uma lista de
`sessoes` identificadas por `id`, `nome`, `chaveArmazenamento` e, em uma delas, `principal: true`.
`Ctrl + Alt + R` abre ou fecha o painel administrativo somente em unidades optantes. A troca de
sessão reutiliza o mesmo controlador e o mesmo `ArmazenamentoRevisoes`; a sessão auxiliar não cria
cartão, não altera o perfil disponível e não alimenta o status do cartão principal.

O painel pode saltar entre questões sem depender do portão de estudo ou da Story Time. Esse bypass
existe apenas durante a sessão autorizada e altera somente `questaoAtual`; o fluxo pedagógico normal
da questão escolhida — inclusive áudio obrigatório, conferência, revisão pós-resposta e avanço —
continua vigente. Na ausência da configuração, o atalho, o painel e o bypass permanecem inativos.

O motor compartilhado de questionários também aceita `modoResponsavel` com a mesma lista de sessões.
A sessão principal deve usar exatamente a chave `chave` da revisão; cada sessão auxiliar usa chave
exclusiva. O painel funciona apenas na revisão optante. Trocar de sessão salva a atual e carrega a
outra; salto administrativo salva apenas `questaoAtual` e não cria resposta, conferência, acerto ou
ponto. O status do cartão sempre lê a sessão principal. `Escape` fecha só o painel; **Encerrar sessão
responsável** volta à principal. Após recarga, abrir o cartão apresenta a sessão principal, e a
auxiliar pode ser retomada pelo painel com seu próprio progresso. Limpar remove apenas a chave da
sessão ativa.

## Correção e feedback

A revisão alice-geografia-brincadeiras-lazer-outubro-2026 reutiliza mapa visual em Q13,
ordenação de três cartões num único subitem misto em Q14, seleção/opções em Q26 e opções em Q28.
Q09 usa banco textual e campos; Q10/Q30 usam ditado com pontuação flexível, sem requisitos
ortográficos. São 30 questões, 58 subitens e 30 pontos. Nenhum controlador foi estendido.
Os campos Q30 têm largura local pelo prefixo dos seus IDs, sem ativar fraseCompleta.
Os quatro rótulos do croqui Q13 também ficam visíveis antes da conferência, por CSS local.
Validação automatizada em 06/10/2026: 20/20 direcionados, 36/36 regressões e 412/412 globais.
Registro histórico da origem: uso real e audição ainda não confirmados naquela data.
O responsável confirmou a validação humana antes da integração de 13/10/2026.

A revisão `mariana-geografia-paisagens-qualidade-vida-outubro-2026` reutiliza os opt-ins vigentes:
seleções em várias partes usam tipo misto, Q10 combina ordenação e duas alternativas, Q5/Q30
usam campos de ditado separados das questões mistas. Apoios, pistas, consolidações e 75 subitens
permanecem declarativos, com um ponto por questão, sem extensão do motor.

A revisão `mariana-ciencias-sol-sombras-materiais-outubro-2026` reutiliza essas capacidades:
Q06/Q12/Q15 são questões mistas com um único grupo de ordenação, para contar uma sequência
inteira como uma unidade de resposta; Q30 combina seleção, alternativa e ordenação. Q05 mantém
o apoio do gnômon em `ilustracaoLeitura` e as previsões sem sombras prontas em `imagem` por
subitem. O mapa Q02 alinha os valores das opções e pontos sem pontuação incidental e usa SVG
com a proporção do recorte móvel existente. Essas adaptações são de conteúdo, sem extensão do motor.

A revisão `mariana-historia-transportes-memorias-outubro-2026` demonstra essas capacidades sem
extensão compartilhada: Q08 combina alternativa e seleção; Q12 combina ordenação e alternativa;
Q13/Q25 combinam seleção e alternativa. Bancos fechados usam alternativas ou campos existentes;
Q07 usa campos para contagens e para a função do transporte. Isso conserva todos os subitens e
um ponto por questão, sem presumir suporte de campo livre dentro do tipo misto. Q26 usa `imagem`
e `imagemAlt` por subitem para manter as duas cenas legíveis. Os seis apoios usam `leitura`;
conversa, pausas e autoavaliação permanecem fora da pontuação.

Depois de erro, preserve a resposta para edição, marque `aria-invalid` e dê orientação específica
sem entregar toda a solução. Acerto e conquista acontecem uma vez. Voltar, reabrir e recarregar não
duplicam listeners, cartões ou pontos.

Teste gabarito independente, primeira tentativa errada, correção, desfazer, persistência de várias
ações, troca de perfil/revisão, armazenamento adverso, teclado, toque, celular, axe-core e console.
Qualidade de enunciados e distribuição de alternativas seguem
[Qualidade das questões](../pedagogia/QUALIDADE_DAS_QUESTOES.md).


## Inglês com subitens opt-in

Moving Around de Mariana declara `interacoes.habilitadas` e questões com `itens` identificados
por a/b/c. `ingles-interacoes.js` renderiza e valida campos, alternativas, associações, categorias,
bancos, ordenação e seleção; `ingles.js` conserva todo o ciclo de vida existente. O comparador
`QuestionariosInteracoes.mesmoConjunto` é reutilizado nas seleções exatas.
A resposta é um objeto por subitem: string ou lista de IDs. Seleções são canônicas sem depender
da ordem; sequências preservam ordem. Bancos podem reutilizar opção entre subitens. Ordenação
permite retirada/reinserção por botões. Nenhuma interação depende de arrastar.

Nas ordenações de Inglês, o próprio cartão permanece acionável depois de colocado:
clicar/tocar novamente ou usar Espaço/Enter retira esse cartão da sequência. O rótulo muda
de **Colocar** para **Retirar**, mantendo `aria-pressed` coerente com a sequência salva.
Os botões **Retirar** na lista continuam disponíveis. Ambos os caminhos respeitam o bloqueio
de áudio; uma ordem incompleta impede conferência. A Q16 de Moving Around cobre retirada,
recolocação, desmarcação do sinal, erro/correção, avanço, retorno e recarga por mouse, teclado
e toque, sem usar salto administrativo durante o percurso.

Todos os subitens devem ser respondidos e corretos para o único ponto da questão. A revisão
EN/PT/EN/PT liga-se à assinatura da resposta inteira; editar invalida conferência e consolidação.
A tela pós-resposta oferece **Editar respostas** também após acerto. A conclusão exige todos os
portões, todas as questões e consolidações. Unidades sem opt-in preservam respostas escalares.

A unidade pode declarar `diretorioImagens` com slug de uma pasta local; nomes de imagem aceitam
somente basename SVG/PNG/JPG/JPEG/WebP. O padrão permanece objetos_escolares. URLs, diretórios
no nome e travessia não são aceitos. História, tabelas e apoios estão no conteúdo local.
