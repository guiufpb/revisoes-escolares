# Inglês — análise pedagógica, estudo ativo e consolidação

Leia esta referência ao planejar ou implementar revisões de Inglês no projeto Revisões Escolares,
especialmente quando o material de origem vier de livro didático, workbook, caderno, PDF, OCR,
prints ou páginas com textos, diálogos, histórias e ilustrações que sustentam as atividades.

Esta referência especializa Inglês. Ela não substitui as fontes normativas gerais.

Consulte também:

- `references/pedagogia-e-cobertura.md`;
- `references/materiais-locais.md`;
- `references/questionarios-e-audio.md`;
- `documentacao/ambiente-interativo/pedagogia/QUALIDADE_DAS_QUESTOES.md`;
- `documentacao/ambiente-interativo/infraestrutura/QUESTIONARIOS_E_INTERACOES.md`;
- `documentacao/ambiente-interativo/infraestrutura/AUDIO_E_VOZ.md`;
- uma revisão equivalente atual.

Para estudo ativo, prática escrita, áudio obrigatório da pergunta e consolidação pós-resposta,
consulte revisões equivalentes atuais antes de implementar.

Referências especialmente úteis no estado atual do projeto:

- `ambiente_interativo/revisoes/mariana/ingles-at-school-atividade-2.js` para cartões de estudo,
  áudio + transcrição, portão de liberação das atividades, pergunta ouvida e consolidação
  pós-resposta;

- `ambiente_interativo/revisoes/mariana/ingles-at-school-atividade-3.js` quando, além dessas
  capacidades, houver história, diálogo, contexto compartilhado ou informação visual necessária
  às questões.

Não copie essas revisões mecanicamente. Use-as para compreender as capacidades atuais e preserve
a adequação ao conteúdo novo.

## 1. Princípio pedagógico

A revisão de Inglês deve combinar, quando o conteúdo justificar:

**ver → ouvir → escrever → compreender → responder → revisar → consolidar → avançar**

A criança não deve apenas reconhecer uma alternativa correta. O percurso deve ajudá-la a formar
associações entre:

- som;
- escrita;
- imagem;
- significado;
- contexto;
- uso da palavra ou frase.

O ambiente deve ensinar antes e durante a avaliação.

Não transforme uma unidade de Inglês em uma sequência longa de perguntas descontextualizadas.

## 2. Análise de livros, workbooks, cadernos, PDFs e prints

Em Inglês, texto e imagem frequentemente funcionam juntos.

OCR ou transcrição textual não bastam quando a página possui:

- história em quadrinhos;
- personagens;
- ações;
- ordem temporal;
- diálogo;
- objetos apontados ou destacados;
- comparação visual;
- sequência de comandos;
- cena cuja imagem determina a resposta;
- atividade de listening;
- phonics;
- associação entre palavra, som e ilustração.

Para cada página relevante, analise pelo menos:

### Conteúdo linguístico

Identifique:

- palavras;
- frases;
- perguntas;
- respostas;
- comandos;
- estruturas gramaticais;
- expressões sociais;
- vocabulário-alvo.

### Contexto narrativo

Identifique:

- quem faz o quê;
- quem fala;
- para quem fala;
- em que ordem os acontecimentos ocorrem;
- causa e consequência;
- objetos ou ações envolvidos;
- fatos necessários para compreender perguntas futuras.

### Informação visual

Identifique o que somente a imagem revela, por exemplo:

- objeto;
- ação;
- quantidade;
- direção;
- posição;
- relação espacial;
- sequência;
- comparação;
- consequência visível;
- personagem associado a uma fala.

### Habilidade trabalhada

Classifique quando aplicável:

- listening;
- speaking;
- reading;
- writing;
- phonics;
- compreensão integrada.

### Função pedagógica

Identifique se a página serve para:

- apresentação;
- exemplo;
- prática;
- narrativa;
- revisão;
- valor/tema;
- avaliação.

### Dependências futuras

Pergunte:

**Quais perguntas ou atividades só poderão ser respondidas se a criança compreender esta página,
história, diálogo, cena ou informação visual?**

Registre essas dependências no planejamento.

Não copie página, ilustração, texto extenso, personagem, logotipo ou diagramação protegida.
Transforme o material em conteúdo original e adequado ao ambiente, preservando o conhecimento e
a lógica pedagógica necessários.

## 3. Gate de dependências antes do questionário

A regra geral de autossuficiência do projeto continua obrigatória.

Em Inglês, aplique-a de maneira operacional antes de fechar o roteiro e antes do Markdown de
implementação.

Para cada questão ou bloco avaliativo, responda:

| Questão/bloco | O que a criança precisa saber? | De onde isso vem no material? | Onde isso aparece dentro da revisão? |
| --- | --- | --- | --- |
| Ex.: fala após um acidente | sequência da história + `I'm sorry.` | história do livro | Story Time antes do questionário |
| Ex.: identificar `smell` | palavra + significado + ação visual | página de Senses | cartão de estudo + cena |
| Ex.: phonics de `a` | padrão sonoro dos exemplos | página de phonics | cartões com áudio |

A última coluna nunca pode ficar vazia.

Se uma pergunta depende de:

- história;
- diálogo;
- texto;
- tabela;
- ilustração;
- cena;
- áudio;
- sequência de acontecimentos;
- relação entre personagens;

esse contexto precisa existir dentro da revisão antes da questão ou estar contido integralmente
no próprio enunciado.

### Questão órfã

Considere inválida uma questão cujo gabarito dependa de informação que existe somente no livro,
caderno, PDF, print ou aula anterior.

Exemplo:

`What does Flash say after the accident?`

não é autossuficiente apenas porque a revisão ensinou isoladamente:

`I'm sorry.`

Para responder à pergunta narrativa, a criança também precisa conhecer:

- que houve um acidente;
- quem participou;
- em que momento a frase foi usada.

Palavras e frases isoladas não substituem narrativa quando a pergunta avalia fatos ou relações
da narrativa.

Se a matriz revelar uma questão órfã, não avance para implementação do questionário. Complete
primeiro o percurso pedagógico.

## 4. Contexto compartilhado: Story Time, diálogo, cena ou leitura

Quando várias questões dependem do mesmo contexto, apresente primeiro uma etapa própria de estudo.

Exemplos:

- `Story Time`;
- diálogo guiado;
- cena ilustrada;
- pequena leitura;
- sequência de ações;
- listening contextualizado.

Essa etapa:

- não precisa valer ponto;
- deve ensinar o necessário;
- não deve simplesmente entregar o gabarito das questões seguintes;
- deve usar texto infantil e original/adaptado;
- pode usar ilustrações locais originais;
- deve oferecer áudio quando isso contribuir para a aprendizagem de Inglês;
- deve aparecer antes das questões dependentes.

Quando pedagogicamente útil, permita rever esse contexto durante o questionário sem apagar:

- questão atual;
- respostas;
- progresso;
- pontuação;
- estados de áudio;
- revisões já concluídas.

A revisão deve poder ser realizada sem manter livro, caderno, PDF ou print aberto.

## 5. Fase 1 — estudo ativo com cartões

Para revisões que adotem a metodologia atual de Inglês, prefira uma primeira fase de estudo ativo.

Cada cartão pode combinar:

- imagem;
- palavra ou frase em Inglês;
- significado em Português;
- áudio normal;
- áudio devagar;
- repetir;
- parar;
- escrita/transcrição;
- conferência recuperável.

Quando a escrita fizer parte da revisão, reutilize:

`praticaEscrita: { habilitada: true, obrigatoriaParaAtividades: true }`

e a infraestrutura atual de `ingles.js`.

Não recrie:

- campo;
- correção;
- persistência;
- sintetizador;
- fila de áudio;

no conteúdo específico da revisão.

O padrão visual consolidado é:

- `✓ Ouvido`
- `✓ Escrito`

A escrita nesta fase é prática guiada.

Quando o objetivo for cópia/transcrição, a palavra ou frase estudada pode ficar visível.
Isso não deve ser confundido com avaliação.

Erro de transcrição permanece corrigível.

### Portão de estudo

Quando a revisão declarar a prática obrigatória, o questionário só é liberado quando todos os
itens exigidos tiverem:

- áudio concluído;
- escrita conferida como correta.

Exemplos:

`17/17 áudios + 17/17 escritas → liberar atividades`

ou:

`25/25 áudios + 25/25 escritas → liberar atividades`

A quantidade depende do roteiro.

Não force 25 cartões apenas para repetir uma revisão anterior.

O número de itens deve resultar da cobertura pedagógica real.

`Refazer atividades` deve, quando coerente com a revisão equivalente, reiniciar a parte avaliativa
sem obrigar a criança a repetir todo o estudo já concluído.

## 6. Fase 2 — compreensão antes da tradução

Nas revisões que adotem esse modelo, cada questão avaliativa segue:

**pergunta em Inglês → ouvir pergunta → liberar respostas → responder → conferir**

Use:

`exigirAudioPerguntaAntesDeResponder: true`

quando esse for o objetivo.

Antes da conclusão correta do áudio da pergunta:

- alternativas permanecem desabilitadas;
- parar não libera;
- cancelar não libera;
- erro de áudio não libera;
- nova solicitação não libera;
- trocar de questão não libera.

A criança deve primeiro tentar compreender o Inglês.

Não reproduza automaticamente a tradução da pergunta antes da tentativa, salvo quando o roteiro
pedagógico explicitamente justificar outro formato.

A tradução não deve eliminar a necessidade de ouvir e tentar interpretar o Inglês.

## 7. Fase 3 — consolidação após toda tentativa conferida

Nas revisões que usam consolidação pós-resposta, TODA tentativa conferida abre a etapa:

**Let's review!**

Isso vale tanto para acerto quanto para erro.

Use a capacidade existente:

`revisaoPosResposta: { obrigatoria: true, pausaMs: <tempo> }`

e:

`AudioRevisoes.falarSequencia`

`revisaoPosResposta.obrigatoria` executa a consolidação pós-resposta. Após uma tentativa
incorreta, sem outro opt-in, o fluxo pode retornar automaticamente à questão quando a sequência
termina.

`revisaoPosResposta.manterTelaAposErro: true` mantém a tela **Let's review!** após a tentativa
incorreta. Ao terminar a sequência, a tela libera explicitamente **Tentar novamente**, que retorna
à mesma questão. Esse comportamento é opt-in: revisões que não o declaram preservam o retorno
automático. A Activity 2 exemplifica a consolidação sem esse opt-in; a Activity 3, a consolidação
com `manterTelaAposErro: true`.

A sequência de consolidação é:

1. pergunta em Inglês;
2. pergunta em Português;
3. resposta correta em Inglês;
4. significado/resposta em Português.

Formato:

**EN pergunta → PT pergunta → EN resposta → PT significado**

Não crie outra fila de `speechSynthesis`.

### Depois de uma tentativa incorreta

Quando a metodologia desejada for:

**erro → Let's review! → Tentar novamente → mesma questão**

declare `revisaoPosResposta.manterTelaAposErro: true`. Nesse modo, o fluxo pedagógico é:

**ouvir pergunta
→ responder
→ conferir
→ Let's review!
→ pergunta EN
→ pergunta PT
→ resposta correta EN
→ significado PT
→ tentar novamente**

Depois da consolidação:

- liberar **Tentar novamente** e então retornar à mesma questão;
- permitir nova escolha;
- manter o erro recuperável;
- não conceder o ponto;
- não liberar a próxima questão.

Se houver outro erro, a consolidação ocorre novamente.

Uma revisão concluída após uma tentativa anterior não deve servir para liberar automaticamente
uma tentativa posterior.

Cada nova tentativa conferida passa novamente pela consolidação correspondente.

### Depois de uma tentativa correta

O fluxo é:

**ouvir pergunta
→ responder
→ conferir
→ Let's review!
→ pergunta EN
→ pergunta PT
→ resposta correta EN
→ significado PT
→ Próxima**

A próxima questão só é liberada após o callback final da sequência.

### Função pedagógica do erro

O erro também ensina.

Essa mecânica:

- reduz o incentivo ao chute sucessivo;
- impede que clicar nas alternativas até encontrar a correta seja o caminho mais curto;
- transforma cada tentativa em oportunidade de compreensão;
- permite rever explicitamente pergunta e resposta;
- exige nova tentativa quando houve erro;
- preserva uma única pontuação máxima por questão.

Não descreva esse mecanismo para a criança como punição.

Na interface, use linguagem pedagógica e acolhedora, por exemplo:

- `Vamos revisar e tentar de novo!`
- `Agora tente novamente.`

Evite linguagem constrangedora ou punitiva.

O “custo” do erro é pedagógico: revisar novamente o conteúdo.

## 8. Pontuação e tentativas

Uma questão continua valendo no máximo o ponto previsto pelo roteiro.

Tentativas erradas:

- não duplicam pontuação;
- não geram pontuação negativa por padrão;
- não eliminam a possibilidade de correção;
- podem ser persistidas quando a infraestrutura já suporta isso.

O objetivo da revisão não é punir erro, mas impedir avanço sem compreensão mínima.

## 9. Quantidade de questões

As revisões atuais podem usar percursos de 25 questões, mas 25 não é uma regra universal de Inglês.

Defina a quantidade a partir de:

- cobertura do material;
- idade;
- duração;
- variedade;
- densidade pedagógica;
- pedido do usuário.

Quando o roteiro especificar 25 questões, preserve essa quantidade e distribua intencionalmente
os conteúdos.

Não crie perguntas artificiais somente para atingir um número.

## 10. Phonics

Phonics deve priorizar:

- ouvir;
- repetir;
- reconhecer;
- comparar sons;
- identificar exemplos.

Para crianças pequenas, não exija IPA ou terminologia fonética avançada salvo pedido específico.

Use áudio local `en-US`.

Quando houver padrão sonoro, apresente exemplos antes de avaliar.

Uma questão de phonics não deve depender apenas da grafia quando o objetivo é som.

## 11. Listening, speaking, reading e writing

Integre habilidades quando isso fizer sentido.

### Listening

Pode aparecer em:

- cartões;
- perguntas;
- histórias;
- comandos;
- pequenas sequências;
- reconhecimento de palavras e frases.

### Speaking

Pode ser praticado por repetição voluntária após o áudio.

Não usar:

- microfone;
- gravação;
- reconhecimento automático;
- avaliação automática de pronúncia;

sem pedido específico.

### Reading

Use textos curtos e adequados à série.

Quando questões dependem de uma leitura, o texto necessário deve estar disponível dentro da
revisão.

Não crie texto longo apenas para justificar perguntas.

### Writing

Use escrita guiada quando tiver valor pedagógico:

- cópia;
- transcrição;
- completar;
- construção curta;
- ditado compatível.

Evite campo livre quando várias respostas legítimas não puderem ser validadas com segurança.

## 12. Imagens e cenas em Inglês

Uma imagem pode:

- ensinar vocabulário;
- contextualizar uma frase;
- representar uma ação;
- ser parte da resposta;
- sustentar uma história;
- permitir associação áudio ↔ significado.

Se a questão depende da imagem, valide a lógica visual depois de criar o asset.

Confirme:

- objeto correto;
- ação correta;
- quantidade correta;
- relação espacial correta;
- ausência de distrator involuntariamente válido;
- texto alternativo coerente.

Imagem bonita não compensa lógica errada.

Quando a imagem do material original contém informação necessária ao gabarito, essa informação
deve ser recriada de forma original dentro do ambiente ou explicitada de outra maneira adequada.

Não basta ler o OCR de uma página quando o desenho participa da atividade.

## 13. Tradução

A tradução é apoio pedagógico, não substituto da tentativa de compreender Inglês.

No modelo atual de consolidação:

- antes da resposta, a criança escuta a pergunta em Inglês;
- depois de conferir, a consolidação apresenta explicitamente a relação Inglês ↔ Português.

Isso ajuda a evitar que a criança dependa da tradução antes de toda tentativa, mas garante que o
significado seja consolidado depois.

A sequência pós-resposta deve manter sua função pedagógica tanto depois do erro quanto depois
do acerto.

## 14. Revisão equivalente e reuso técnico

Antes de implementar:

1. consulte o inventário;
2. leia `MODELO_NOVA_REVISAO.txt`;
3. abra uma revisão equivalente;
4. prefira configuração declarativa.

Para o método:

**cartões de estudo
→ áudio/transcrição
→ portão
→ pergunta ouvida
→ consolidação pós-resposta**

consulte primeiro:

`ambiente_interativo/revisoes/mariana/ingles-at-school-atividade-2.js`

Quando houver também:

- Story Time;
- diálogo;
- narrativa;
- contexto que precisa ser revisto;
- perguntas dependentes de fatos apresentados anteriormente;

consulte também:

`ambiente_interativo/revisoes/mariana/ingles-at-school-atividade-3.js`

Reutilize:

- `js/ingles.js`;
- `js/audio.js`;
- `RegistroIngles`;
- armazenamento compartilhado.

Não crie:

- `speechSynthesis` paralelo;
- controlador paralelo de Inglês;
- fila manual de áudio;
- persistência específica quando o controlador compartilhado já cobre o caso.

## 15. Estado e persistência

Quando aplicável, preserve:

- itens ouvidos;
- respostas de escrita;
- conferências de escrita;
- grupo/item atual;
- perguntas ouvidas;
- respostas das atividades;
- conferências;
- tentativas;
- questão atual;
- revisões pós-resposta concluídas;
- etapa de contexto/história;
- conclusão.

Voltar e recarregar devem restaurar estado visual e lógico juntos.

`Refazer` não duplica pontos nem listeners.

Nunca use:

`localStorage.clear()`

Limpe somente a chave da revisão ativa.

## 16. Testes específicos de Inglês

Além das regras gerais do projeto, cubra quando aplicável:

### Estudo

- quantidade de cartões;
- áudio normal;
- áudio devagar;
- repetir;
- parar;
- ausência de autoplay;
- escrita correta/incorreta;
- correção recuperável;
- portão de áudios + escritas;
- reload.

### Questões

- alternativas bloqueadas antes do áudio;
- áudio concluído libera;
- parar não libera;
- cancelar não libera;
- erro não libera;
- primeira resposta errada;
- correção;
- pontuação sem duplicação.

### Consolidação

Verifique a ordem:

`en-US pergunta`
→ `pt-BR pergunta`
→ `en-US resposta`
→ `pt-BR significado`

Após erro:

- revisão obrigatória;
- volta à mesma questão;
- próxima permanece bloqueada;
- nova tentativa pode ser feita;
- nova conferência exige nova consolidação.

Após acerto:

- revisão obrigatória;
- próxima só libera após o callback final.

Parar, cancelar ou interromper a sequência não pode ser tratado como conclusão.

### Contexto

Quando perguntas dependem de história, diálogo, leitura, cena ou sequência:

- o contexto existe antes das questões;
- contém realmente as informações necessárias;
- não depende de consultar o material original;
- pode ser revisto quando o roteiro assim definir;
- rever não apaga a questão nem o progresso.

Automação não substitui revisão pedagógica humana.

## 17. Gate específico de Inglês

Antes de gerar o Markdown para implementação, confirme:

- [ ] Texto e elementos visuais de todas as páginas relevantes foram analisados.
- [ ] Histórias e diálogos foram entendidos como sequência, não apenas como lista de frases.
- [ ] Toda questão possui fonte de resposta dentro da própria revisão.
- [ ] Nenhuma questão depende de voltar ao livro, workbook, caderno, PDF ou print.
- [ ] Se uma questão depende de imagem, a informação visual necessária foi recriada ou explicitada.
- [ ] Conceitos e vocabulário são ensinados antes de serem cobrados.
- [ ] A quantidade de cartões de estudo é adequada ao conteúdo.
- [ ] O portão Ouvido/Escrito é usado quando a escrita guiada tem valor pedagógico.
- [ ] O áudio obrigatório da pergunta é usado quando a compreensão auditiva faz parte do objetivo.
- [ ] A consolidação pós-resposta está planejada quando a revisão usa essa metodologia.
- [ ] Erro permanece recuperável e também passa pela consolidação quando ela estiver ativa.
- [ ] Depois de erro, a revisão retorna à mesma questão e não libera avanço.
- [ ] Depois de acerto, o avanço só ocorre após a consolidação.
- [ ] Phonics avalia som de forma apropriada à idade.
- [ ] Listening, speaking, reading e writing aparecem de forma coerente, sem obrigar todos em toda revisão.
- [ ] Imagens têm função pedagógica e lógica conferida.
- [ ] Não há cópia indevida de página, texto extenso, personagem ou ilustração protegida.
- [ ] A revisão permanece infantil, acessível, local e autossuficiente.

Se qualquer item relevante falhar, corrija o roteiro antes da implementação.
