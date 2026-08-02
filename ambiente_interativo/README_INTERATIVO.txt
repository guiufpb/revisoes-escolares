AMBIENTE INTERATIVO - REVISOES ESCOLARES
========================================

COMO ABRIR
1. Na pasta principal do projeto, execute:
   npm run interativo
2. O Vite abrira o ambiente automaticamente no navegador.
3. Escolha Alice ou Mariana.

Endereco local padrao:
http://127.0.0.1:5173/ambiente_interativo/index.html

Tambem e possivel abrir ambiente_interativo/index.html diretamente no
Microsoft Edge.

TRILHAS DISPONIVEIS
- Alice > Ciencias > Origem dos materiais.
- Mariana > Matematica > Revisao ampla.

REVISAO DE MATEMATICA DA MARIANA
A revisao possui 25 etapas interativas:
1. Apresentacao.
2. Subtracao: tirar quantidades.
3. Problemas de subtracao.
4. Troco.
5. Quanto a mais / quanto a menos.
6. Operacoes inversas.
7. Sequencias com adicao.
8. Sequencias com subtracao.
9. Maquina de numeros.
10. Grafico de barras.
11. Dezena e unidade.
12. Quadro de ordens.
13. Numeros de 10 a 19 por extenso.
14. Ordem crescente e decrescente.
15. Numeros ordinais.
16. Antes e depois nos ordinais.
17. Pares e impares.
18. Formando pares.
19. Figuras geometricas nao planas.
20. Faces, vertices, arestas e base.
21. Vistas dos objetos com canvas.
22. Moldes e planificacoes.
23. Mini simulado com 10 questoes.
24. Atividade livre com caneta.
25. Resultado final.

INTERACOES
- Botoes grandes de marcar e conferir.
- Campos para completar.
- Ligar pares.
- Arrastar ou clicar para ordenar e classificar.
- Grafico de barras.
- Dois canvases com mouse, toque e caneta via Pointer Events.
- Limpar e desfazer desenho.
- Pontuacao e feedback visual.

ARMAZENAMENTO
- O progresso da Alice continua na chave original do ambiente.
- A revisao da Mariana usa a chave exclusiva:
  revisoesEscolares.mariana.matematica.revisaoAmpla
- Sao salvos etapa atual, respostas, pontuacao, atividades concluidas e canvases.
- O botao discreto "Limpar progresso" apaga somente o aluno ativo.

ESTRUTURA PRINCIPAL
- index.html: telas e rotas visuais.
- css/estilo.css: estilo compartilhado e estilo da revisao ampla.
- js/app.js: navegacao entre alunos, materias e revisoes.
- js/atividades.js: atividade demo da Alice.
- js/desenho.js: canvas da revisao da Alice.
- js/armazenamento.js: progresso da Alice.
- revisoes/mariana/matematica-revisao-ampla.js:
  conteudo, interacoes, canvases, correcao e armazenamento da Mariana.

RECURSOS VISUAIS
Os SVGs locais sao carregados de:
../assets/objetos_escolares

O ambiente nao usa internet, CDN ou bibliotecas externas.

TESTES AUTOMATICOS
- npm run format: formata HTML, CSS e JavaScript com Prettier.
- npm run format:check: confere a formatacao sem alterar arquivos.
- npm run lint: analisa o JavaScript do ambiente e dos testes com ESLint.
- npm run test:interativo: valida o fluxo Mariana > Matematica > Revisao ampla,
  uma questao, a barra de progresso, a etapa com canvas e erros no console.
- npm run test:a11y: executa axe nas telas inicial, da Mariana, da revisao de
  Matematica e do canvas.
- npm test: executa todos os testes Playwright.

O projeto possui formatacao com Prettier, analise de JavaScript com ESLint,
testes com Playwright, acessibilidade com axe-core e abertura local com Vite.
Os testes ficam em tests/ e usam o endereco local do Vite. O servidor em
127.0.0.1:5173 e reutilizado quando ja esta em execucao.
