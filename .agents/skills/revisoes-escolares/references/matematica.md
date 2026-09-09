# Roteamento de Matematica

Sempre consulte o inventario e uma revisao equivalente antes de criar infraestrutura.

## Visual/manipulativa — Cena Matematica

Reutilize conforme a implementacao atual:

- `ambiente_interativo/js/matematica.js`;
- `ambiente_interativo/js/matematica-cena.js`;
- `ambiente_interativo/js/matematica-manipulaveis.js`;
- `ambiente_interativo/js/matematica-geometria-medidas.js`.

Capacidades existentes incluem, conforme inventario/modelo atual:

- base dez;
- U, D-U, C-D-U, M-C-D-U;
- abaco;
- trocas 10 U->1 D, 10 D->1 C, 10 C->1 M;
- composicao/decomposicao;
- sequencias;
- reta numerica;
- dinheiro pedagogico;
- graficos;
- formas;
- selecao e associacao;
- mosaicos;
- reguas;
- massa/balanca;
- capacidade/recipientes;
- campos numericos com unidade;
- continhas verticais D-U e recursos declarativos documentados.

Se a pergunta puder ser adaptada a um tipo declarativo existente, adapte o conteudo em vez de criar novo controlador.

## Operacoes digitadas/tabuada

Use `ambiente_interativo/js/matematica-operacoes.js` para operacoes sequenciais, varios campos e estudo de tabuada.
Conteudo e dificuldade ficam em `revisoes/<perfil>/`.

## Serie e dificuldade

- Alice/1o ano: instrucoes curtas, U ou D-U quando apropriado, apoio visual, uma tarefa principal por tela.
- Mariana/2o ano: pode ampliar D-U/C-D-U e medidas conforme material e maturidade, sem saltar para tecnicas nao estudadas.
- Nao introduza decimais/conversoes avancadas apenas porque a infraestrutura permitir.

## Respostas

Evite resposta aberta ambigua. Prefira:

- alternativa;
- selecao;
- associacao;
- completar com resposta unica;
- manipulacao com alvo definido;
- operacao digitada com resultado inequivoco.

## Regressoes essenciais

Conforme o tipo, cubra:

- primeira tentativa errada e correcao;
- Proxima bloqueada ate acerto;
- pontuacao unica;
- voltar/recarregar;
- varias acoes consecutivas persistidas;
- desfazer/retirar/reposicionar;
- teclado/toque/ponteiro;
- isolamento de perfil/chave;
- 390 x 844 e axe-core quando aplicavel;
- `file://` conforme AGENTS/instrucoes.

## Gate de controlador compartilhado

Se uma nova revisao exigir alteracao em qualquer controlador compartilhado que nao estava prevista no plano:

1. pare;
2. explique a capacidade ausente;
3. mostre por que os tipos atuais nao resolvem;
4. espere autorizacao para ampliar infraestrutura;
5. se autorizado, trate como mudanca de risco maior e siga os gatilhos globais do `AGENTS.md`.
