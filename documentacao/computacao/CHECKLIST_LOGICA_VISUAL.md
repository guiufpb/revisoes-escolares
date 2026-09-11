# Checklist de Lógica Visual — Computação

Use este checklist na revisão das páginas de Computação que ensinam lógica. A imagem deve ensinar a relação conceitual; não basta decorar o tema.

## A. Regra de aprovação

Em páginas de lógica computacional, a prioridade é: **clareza lógica e pedagógica > beleza cênica > ornamentação**. Se uma resposta relevante for “não”, a página não está aprovada e precisa de revisão antes do PDF final.

## B. Perguntas para toda página lógica

- A cena, o diagrama ou a combinação deles deixa claro o objetivo da situação?
- É possível identificar o estado inicial e o estado final?
- A ordem dos passos pode ser lida sem depender do parágrafo inteiro?
- Cada comando está associado à ação que ele provoca?
- Quando há comparação, esperado e resultado real estão separados e rotulados?
- A primeira divergência entre o esperado e o ocorrido pode ser localizada?
- Uma correção mostra claramente antes e depois?
- Depois de corrigir, há reteste e novo resultado observável?
- Uma repetição está delimitada como grupo, com o que se repete, quantas vezes e qual resultado produz?
- Comparações usam a mesma escala, base, mapa ou condição inicial e não dependem apenas de cor?
- A representação continua compreensível mesmo sem ler todo o texto ao redor?

## C. Verificação por tipo de página

### N — Narrativa

- A cena preserva emoção, missão, descoberta e continuidade de personagens e cenário?
- Quando a narrativa carrega um conceito, há ao menos um elemento lógico observável, sem transformar toda cena em diagrama?

### C — Conceito visual

- A relação pode ser inferida pela imagem antes ou junto do termo técnico?
- O termo técnico nomeia uma experiência já observável, em vez de substituir a explicação?

### S — Sequência de comandos ou passos

- A direção de leitura é explícita, por numeração, conexões ou percurso?
- Comando e ação estão pareados?
- Estados intermediários pedagogicamente relevantes aparecem, sem saltos que impeçam conferir a execução?

### X — Comparação

- Painéis separados são usados quando a sobreposição confundiria?
- Rótulos como **ESPERADO / ACONTECEU**, **ANTES / DEPOIS** ou **CERTO / PRECISA REVER** tornam os lados inequívocos?
- Os lados partem de bases equivalentes?

### D — Depuração ou diagnóstico

- A página mostra observar, formular hipótese, testar, localizar a primeira divergência, corrigir e retestar?
- O bug é apresentado como diferença localizável no processo, e não somente como um ícone de alerta?

### R — Repetição ou loop

- O bloco externo de repetição está delimitado?
- Os comandos internos, a quantidade de repetições e o resultado final são legíveis?
- A repetição longa aparece antes de ser simplificada por um loop?

### A — Arquitetura ou fluxo interno

- Setas e fluxo estão coerentes, inclusive entrada, processamento e saída quando aplicável?
- Funções e estados são separados de elementos apenas decorativos?
- Uma metáfora preserva a relação técnica que pretende explicar?

### Q — Questão ou atividade

- O cenário visual contém as informações necessárias para responder?
- A pergunta não se reduz a texto quando deveria exigir leitura da imagem?
- Espaço de resposta, contraste e continuidade em duas páginas deixam claro que se trata da mesma questão e do mesmo ponto de decisão?

### G — Gabarito

- A resposta correta e o comentário pedagógico correspondem à questão e à imagem?
- Não há contradição entre gabarito, enunciado, comandos, mapa ou estados mostrados?

## D. Continuidade dos ativos

Confira ficha de personagem, robô, geometria do mapa, orientação esquerda/direita, significados de ícones e cartões, quantidades, cores e padrões. Quando um ativo representa evidência lógica, seu significado deve permanecer estável entre páginas.

## E. Gate de renderização

Para cada página crítica, confirme antes da aprovação:

1. A página foi renderizada individualmente em tamanho legível.
2. A lógica foi verificada por este checklist, não apenas por acabamento visual.
3. Problemas foram corrigidos, rerenderizados e revisados.
4. Páginas fora da correção seletiva foram comparadas por render, hash ou comparação determinística de imagem para comprovar que permaneceram inalteradas.
