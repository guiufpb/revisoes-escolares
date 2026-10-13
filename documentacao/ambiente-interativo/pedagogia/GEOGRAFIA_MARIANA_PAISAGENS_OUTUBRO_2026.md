# Mariana — Lugares de viver, cuidar e transformar

Registro de integração — 13/10/2026: validação humana das atividades confirmada pelo
responsável antes desta etapa. Os relatos de pendência e os resultados técnicos abaixo
descrevem a cópia de origem em suas respectivas datas. Conteúdo, IDs e chaves foram
preservados; a validação da combinação com 63 revisões consta no inventário.

Revisão de Geografia, 2º ano, prova de 07/10/2026. Implementada a partir da síntese aprovada
e das questões fornecidas em 06/10/2026. A síntese incorpora páginas 74–91 do caderno e
materiais complementares. Páginas 72–73 não foram fornecidas. Não houve nova leitura de anexos,
OCR ou reprodução de páginas privadas.

## Conteúdo e cobertura

São **30 questões, 75 subitens e 30 pontos**, um ponto por questão depois de todos os subitens
corretos. Posições das alternativas fixas, preservadas do gabarito editorial.

| Bloco | Questões | Subitens | Ensino e aplicação |
| --- | --- | --- | --- |
| A | 1–5 | 12 | Paisagens, indícios, elementos naturais/construídos e vocabulário. |
| B | 6–10 | 13 | Trabalho, interdependência, matéria-prima e cadeia do alimento. |
| C | 11–15 | 12 | Convivência, recursos/necessidades, ações coletivas, solo e água. |
| D | 16–20 | 12 | Mudanças/permanências, referências, moradia, migração e causa/consequência. |
| E | 21–25 | 12 | Vistas, planos, horizonte, legenda e croqui. |
| F | 26–30 | 14 | Água/terras, movimentos da Terra, integração de fontes e consolidação. |

Há 23 questões de núcleo/reforço, cinco ampliações correlatas (9, 10, 14, 15, 19) e dois
enriquecimentos (26, 27). As 75 tarefas compreendem 57 opções únicas, 12 seleções, uma ordenação
e cinco campos de ditado. Nas 51 opções de três alternativas, as corretas estão em 17 A,
17 B e 17 C. As seis classificações binárias mantêm a ordem editorial.

Todas as telas têm apoio, contexto autossuficiente, pista no erro e consolidação no acerto.
A primeira questão de cada bloco incorpora sua abertura. Conversa e autoavaliação final
permanecem opcionais, sem pontos ou coleta de relatos pessoais.

## Representações e contratos

Os 16 contratos visuais usam 23 SVGs originais em `assets/geografia-paisagens-outubro/`.
Cenas compostas são empilhadas para celular. Descrições oferecem os mesmos fatos; tabelas
editoriais viraram texto com rótulos explícitos, preservando posições, relações e datas.

- V01/V02: moradias e árvores nos dois ambientes, serviços na cidade e cultivo/criação/tecnologia
  no campo; ponte de madeira cruza o rio e conecta as margens.
- V03/V04: trabalhos e pares de materiais/produtos identificados; a coleta sem cultivo é
  informada no texto. Cartões de alface fora de ordem, sem números ou setas da resposta.
- V05/V06: convivência, recursos e problemas delimitados; crianças pedem ajuda, sem fazer
  obras/reparos. Horta urbana entre construções. Água transparente não é declarada potável.
- V07: ipê, ponte e córrego mantêm geometria/posição. Só mudam pavimento, terreno que recebe
  biblioteca e altura do muro, no mesmo enquadramento de 2006/2026.
- V08: duas ruas e mudança da família, sem transformar casa em prédio ou hierarquizar moradias.
- V09: mesma escola, pátio e árvore; frontal sem teto visto por cima, vertical sem fachadas,
  oblíqua com teto, frente e lateral.
- V10/V11: cerca, lago e montanhas em faixas distintas. Linha 2 coincide com céu/mar; linhas
  1 e 3 ficam próximas, na areia e na beira do calçadão.
- V12: escola/esquerda, praça/centro, mercado/direita; símbolos nomeados e legenda. A farmácia
  fica acima, o ponto abaixo; o segundo croqui retira somente o ponto de ônibus.
- V13/V14: predominância da água, sem porcentagem cobrada. X mostra giro junto à Terra e Y
  uma Terra no percurso ao redor do Sol, sem antecipar nomes dos movimentos.
- V15/V16: sítio/esquerda, rio/centro, mercado/direita, posto/acima, escola/abaixo. Caminho cruza
  ponte e chega ao mercado. Embalagens delimitam Q28; caixas delimitam o problema atual de Q29.
  Terreno vazio e posto correspondem à mesma posição em 2016/2026.

`css/geografia-paisagens-outubro.css` restringe seu seletor a Desktop Amplo e às imagens dessa
pasta. Remove o teto de altura que encolheria as figuras compostas, mantendo largura integral
e proporção, sem afetar figuras das revisões anteriores.

## Ditado e gabarito do responsável

Q5: `paisagem` e `moradia`. Q30:

1. O campo e a cidade se ajudam.
2. Cuidamos da água e do solo.
3. A paisagem muda com o tempo.

Estes alvos pertencem ao gabarito/configuração interna, sem exposição na tela antes da
conferência. O cabeçalho do bloco A foi adaptado de “Aprender a observar uma paisagem” para
**“Aprender a observar os lugares”**, pois o original revelava o alvo de Q5. Seu apoio de
abertura, subitens e decisões pedagógicas foram preservados.

Campos aceitam caixa, acentos, espaços e pontuação flexíveis; palavras e sequência são
obrigatórias. Q5 declara palavra e Q30 frase. Usa `gramatica-ditado.js`/`audio.js`, voz local
pt-BR, velocidade 0,78, pitch 1, prefixo no mesmo utterance e cancelamento compartilhado.
Ouvir não preenche campos. Sem voz, responsável lê um alvo por vez, sem mostrar ou soletrar.

## Integração e progresso

- ID: `mariana-geografia-paisagens-qualidade-vida-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/mariana/geografia-paisagens-qualidade-vida-outubro-2026.js`.
- Principal: `revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.v1`.
- Responsável: `revisoesEscolares.mariana.geografia.paisagensQualidadeVidaOutubro2026.responsavel.v1`.
- Cartão: `abrir-geografia-paisagens-outubro-mariana`, exclusivo de Mariana/Geografia.

Reutiliza questionários, interações mistas, validação estrita, tentativas, Desktop Amplo e
Modo Responsável. Não altera controladores, áudio ou armazenamento. Salto administrativo,
limpeza seletiva, isolamento e restauração usam o contrato vigente. Mantém revisões antigas.

## Validação

Build, formatação e lint aprovados. As 23 figuras foram inspecionadas visualmente. Verificação
local de 21 telas em 1366 × 768, 1920 × 1080 e 390 × 844, sem overflow, imagens ausentes ou
erros JavaScript. Os testes preliminares confirmaram cadastro, ditados Q5/Q30 e Modo
Responsável, após corrigir o cabeçalho que revelava Q5.

`tests/geografia-mariana-paisagens-outubro-2026.spec.js` tem **17 cenários aprovados**:
gabarito independente, percurso integral com vazio/erro/correção, pontuação única,
retorno/recarga, seleções/ordenação reversíveis, escrita flexível, áudio protegido, falta de
voz, sessões, limpeza, armazenamento adverso, geometria, teclado/toque, axe-core, viewports
e `file://` sem rede obrigatória.

Validação concluída em **06/10/2026**:

- **31/31 testes direcionados (3,1 min):** nova revisão e Geografias anteriores de Mariana/Alice.
- **409/409 na suíte global `npm test` (30,8 min):** exigida por registro/navegação/HTML/CSS,
  incluindo o build e regressões de áudio, progresso, sessões, leitura e demais matérias.
- Build, `format:check`, lint e `git diff --check` aprovados.

A primeira execução direcionada encontrou um seletor do teste que contava também um controle
oculto de outra tela. A asserção foi limitada aos grupos da questão, mantendo quatro escolhas
e exigindo duas em cada grupo; a repetição isolada e a suíte completa passaram. Nenhum
comportamento compartilhado foi alterado para resolver essa falha.

A primeira execução global foi interrompida por PDFs locais ausentes na worktree. Dez arquivos
de leitura já existentes foram copiados para seus caminhos locais, sem sobrescrever arquivos,
com hashes conferidos e permanecendo ignorados pelo Git. Os oito testes de leitura atingidos
passaram (46,8 s), e a execução global completa posterior passou. Capturas, logs e PDFs locais
não integram o conjunto de arquivos da atividade a versionar.

Acústica real e uso infantil desta revisão dependem de confirmação posterior. Não houve commit,
push, PR, merge ou publicação.
