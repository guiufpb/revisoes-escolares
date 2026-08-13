# Nivelamento da infraestrutura de leitura no computador reserva

## Instrução principal ao Codex

Trabalhe diretamente no projeto aberto neste computador reserva:

    C:\Users\guiuf\Documents\Codex\Revisões escolares

Execute as alterações no projeto. Não entregue apenas recomendações.

Antes de agir, leia integralmente este documento e também o arquivo já existente:

    PROMPT_NIVELAR_MELHORIAS_AMBIENTE_INTERATIVO.md

Examine o projeto real antes de modificar qualquer coisa. O objetivo é fazer uma
mesclagem cuidadosa, preservando tudo o que já estiver correto.

---

## 1. Objetivo

O ambiente interativo deste computador reserva provavelmente já recebeu um
nivelamento estrutural anterior. Esta nova tarefa deve:

1. confirmar e preservar as melhorias estruturais já existentes;
2. acrescentar a infraestrutura reutilizável de leitura desenvolvida depois;
3. deixar o ambiente pronto para receber novos PDFs de livros;
4. permitir que, futuramente, um PDF seja cadastrado com capa, metadados,
   questionário, alternativas pseudoaleatórias, ditados, glossário e explicação
   final sem reconstruir o sistema;
5. configurar ou confirmar o Git local;
6. não copiar livros, PDFs, perguntas ou conteúdos pedagógicos específicos de
   outro computador.

Implemente apenas a infraestrutura. Não invente textos escolares.

---

## 2. Conteúdo que não deve ser criado nem copiado

Não copie ou recrie nesta tarefa:

- PDFs de livros;
- capas de livros reais;
- nomes, autores ou metadados de livros existentes no outro computador;
- perguntas e respostas de livros;
- frases reais de ditado;
- glossários específicos desses livros;
- ilustrações específicas;
- explicações pedagógicas específicas;
- pastas numeradas das matérias;
- progresso de Alice ou Mariana;
- `node_modules`;
- `test-results`;
- `tmp`;
- capturas de tela;
- perfis de navegador;
- documentos pessoais;
- arquivos gerados antigos.

O catálogo de leitura pode ficar vazio até que o usuário forneça um PDF.

Se forem necessários dados para testes, use somente uma configuração sintética,
claramente marcada como fixture de teste e invisível no catálogo real. Não crie
uma história ou atividade escolar fictícia como conteúdo definitivo.

---

## 3. Segurança e preservação

Antes de editar:

1. execute `git status --short --branch`, caso Git exista;
2. liste os arquivos relevantes;
3. leia os módulos atuais;
4. identifique o que já foi implementado pelo nivelamento anterior;
5. preserve IDs HTML, chaves de armazenamento e progresso existente;
6. preserve as revisões escolares já existentes;
7. não substitua o projeto inteiro;
8. não use `git reset --hard`;
9. não use `localStorage.clear()`;
10. não apague arquivos do usuário;
11. não faça push, publicação, criação de repositório remoto ou envio a
    serviços externos.

Trabalhe ao redor de alterações locais existentes. Não descarte arquivos
modificados ou não versionados.

---

## 4. Configuração do Git local

Verifique primeiro:

```powershell
git --version
git rev-parse --is-inside-work-tree
git status --short --branch
git log --oneline --decorate -5
git remote -v
```

Se o projeto ainda não for um repositório Git, inicialize:

```powershell
git init -b main
```

Configure a identidade somente neste projeto:

```powershell
git config --local user.name "guiufpb"
git config --local user.email "guiufpb@hotmail.com"
```

Não configure repositório remoto e não faça push.

Confirme ou crie um `.gitignore` que ignore pelo menos:

```gitignore
/node_modules/
/.vite/
/test-results/
/playwright-report/
/blob-report/
/tmp/
/.playwright/
**/.auth/
*.log
npm-debug.log*

/ambiente_interativo/js/app.bundle.js
/ambiente_interativo/js/pdfjs.bundle.mjs
/ambiente_interativo/js/assets/

/ambiente_interativo/screenshots/
/ambiente_interativo/screenshots_*/
**/preview_paginas/

/[0-9][0-9] /
/pacote_frases_visiveis/

*.pdf
*.docx
*.tmp
*.bak
*~

/.vscode/
/.idea/
.DS_Store
Thumbs.db
Desktop.ini
```

Não adicione ao Git tarefas das alunas, PDFs, documentos pessoais, progresso,
dependências, temporários ou resultados de testes.

Se ainda não existir commit e o conteúdo a ser versionado estiver seguro, crie
um commit local de referência antes da mudança. Antes de confirmar, confira
cuidadosamente os arquivos preparados e retire qualquer material escolar ou
pessoal.

Exemplo:

```powershell
git add .gitignore package.json package-lock.json playwright.config.js eslint.config.js .prettierrc .prettierignore ambiente_interativo tests
git status --short
git diff --cached --name-only
git commit -m "chore: registrar base antes da infraestrutura de leitura"
```

Ao concluir, pode ser criado um segundo commit local seguro:

```powershell
git add .gitignore package.json package-lock.json vite.config.js vite.pdfjs.config.js eslint.config.js playwright.config.js README_FERRAMENTAS.txt ambiente_interativo tests
git status --short
git diff --cached --name-only
git commit -m "feat: preparar infraestrutura reutilizavel de leitura"
```

Somente faça commits sem conteúdo privado ou pedagógico. Não faça push.

---

## 5. Confirmar a infraestrutura anterior

Antes da parte de leitura, confirme que continuam funcionando:

- arquitetura modular;
- `registro-revisoes.js`;
- armazenamento isolado por revisão;
- fallback em memória quando `localStorage` falha;
- normalização de JSON inválido;
- migração conservadora e idempotente;
- estados “Não iniciada”, “Em andamento” e “Concluída”;
- navegação entre Alice, Mariana, matérias e revisões;
- canvas com mouse, toque, caneta e `devicePixelRatio`;
- restauração de desenhos;
- suporte a teclado;
- responsividade;
- foco visível;
- ESLint;
- Prettier;
- Vite;
- Playwright;
- axe-core;
- atalhos BAT portáveis;
- bundle clássico para abertura por `file://`.

Não reimplemente o que já estiver correto.

---

## 6. Estrutura reutilizável da matéria Leitura

Prepare esta estrutura:

```text
ambiente_interativo/
├── index.html
├── leitor.html
├── css/
│   ├── estilo.css
│   └── leitor-dedicado.css
├── js/
│   ├── app.entry.js
│   ├── app.js
│   ├── armazenamento.js
│   ├── glossario.js
│   ├── leitura.js
│   ├── leitor-dedicado.js
│   ├── pdfjs.entry.js
│   ├── pdfjs.bundle.mjs
│   ├── registro-leituras.js
│   └── registro-revisoes.js
├── leituras/
│   └── (subpastas futuras dos livros)
└── revisoes/
    ├── alice/
    │   └── (configurações futuras dos livros)
    └── mariana/
        └── (configurações futuras dos livros)
```

`pdfjs.bundle.mjs` e `app.bundle.js` são gerados automaticamente. Não os edite
manualmente.

Não coloque livros reais nessa estrutura agora.

---

## 7. Dependência local do PDF.js

Adicione ao projeto, preservando versões compatíveis:

```json
"dependencies": {
  "pdfjs-dist": "^6.2.108"
}
```

Não use CDN. O leitor deve usar arquivos locais e não depender da internet.

Crie `ambiente_interativo/js/pdfjs.entry.js` com a responsabilidade de:

- importar `pdfjs-dist`;
- importar o worker local usando o mecanismo de URL do Vite;
- definir `GlobalWorkerOptions.workerSrc`;
- expor a biblioteca como `window.PDFJSLocal`.

Estrutura equivalente:

```js
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
window.PDFJSLocal = pdfjsLib;
```

---

## 8. Build dos dois bundles

Mantenha o bundle principal em formato IIFE para compatibilidade com abertura
local.

O `vite.config.js` deve gerar:

    ambiente_interativo/js/app.bundle.js

a partir de:

    ambiente_interativo/js/app.entry.js

Crie `vite.pdfjs.config.js` para gerar:

    ambiente_interativo/js/pdfjs.bundle.mjs

a partir de:

    ambiente_interativo/js/pdfjs.entry.js

Use saída ES para o PDF.js e preserve o worker como recurso local.

O comando de build deve gerar os dois:

```json
"build": "vite build && vite build --config vite.pdfjs.config.js"
```

O `app.entry.js` deve importar, nessa ordem lógica:

1. registros;
2. glossário;
3. armazenamento;
4. desenho e atividades;
5. configurações das revisões existentes;
6. configurações futuras de leitura, quando existirem;
7. controlador de leitura;
8. aplicativo principal.

Enquanto não houver livro, não importe módulos inexistentes.

---

## 9. Scripts esperados no `package.json`

Preserve scripts existentes e confirme equivalentes a:

```json
{
  "scripts": {
    "build": "vite build && vite build --config vite.pdfjs.config.js",
    "dev": "vite --host 127.0.0.1",
    "interativo": "vite --host 127.0.0.1 --open /ambiente_interativo/index.html",
    "format": "prettier --write \"ambiente_interativo/**/*.{html,css,js}\" \"tests/**/*.js\"",
    "format:check": "prettier --check \"ambiente_interativo/**/*.{html,css,js}\" \"tests/**/*.js\"",
    "lint": "eslint ambiente_interativo/**/*.js tests/**/*.js",
    "pretest:interativo": "npm run build",
    "test:interativo": "playwright test tests/ambiente-interativo.spec.js",
    "pretest:a11y": "npm run build",
    "test:a11y": "playwright test tests/acessibilidade.spec.js",
    "pretest:e2e": "npm run build",
    "test:e2e": "playwright test",
    "test": "npm run test:e2e"
  }
}
```

Não remova scripts de geração de cartilhas existentes. Mantenha `package.json`
e `package-lock.json` sincronizados.

---

## 10. Integração visual da matéria Leitura

Adicione a matéria “Leitura” para Alice e Mariana, seguindo a identidade visual
atual.

Use as mesmas telas compartilhadas para os dois perfis:

1. biblioteca;
2. visualizador do PDF;
3. questionário;
4. resultado.

A biblioteca deve ser gerada dinamicamente a partir do registro, sem cartões de
livros codificados diretamente no HTML.

Cada cartão futuro deve mostrar:

- capa;
- título;
- autor;
- adaptador, quando existir;
- ilustrador, quando existir;
- quantidade de páginas;
- resumo curto;
- estado da leitura;
- botão “Começar leitura”;
- “Continuar da página X”;
- ou “Ler novamente”.

Quando o catálogo estiver vazio:

- não lance erro;
- mostre uma mensagem compreensível;
- não crie cartões falsos;
- opcionalmente esconda a matéria até o primeiro livro ser cadastrado, desde que
  ela apareça automaticamente depois.

O resumo superior deve mostrar algo equivalente a:

    Mariana: página 12/30

quando uma leitura estiver ativa.

O botão global de limpeza deve mudar para “Limpar progresso desta leitura” nas
telas de leitura.

---

## 11. Registro central de leituras

Crie `ambiente_interativo/js/registro-leituras.js`.

Ele deve expor:

```js
window.RegistroLeituras = {
  listar(perfil),
  obter(id),
};
```

Os valores devolvidos devem ser cópias, evitando mutação acidental.

O catálogo pode começar vazio:

```js
var livros = [];
```

Formato futuro:

```js
{
  id: 'id-estavel-do-livro',
  versao: 1,
  titulo: 'Título',
  autor: 'Autor',
  adaptador: 'Nome opcional',
  ilustrador: 'Nome opcional',
  arquivoPdf: 'leituras/id-do-livro/livro.pdf',
  capa: 'leituras/id-do-livro/capa.jpg',
  totalPaginas: 30,
  resumo: 'Resumo infantil curto.',
  perfisDisponiveis: ['alice', 'mariana'],
  correcaoObjetivas: 'ao-final',

  glossarioPorPagina: {
    5: ['palavraId'],
    16: ['outraPalavraId', 'terceiraPalavraId']
  },

  explicacaoFinal: {
    titulo: 'Título opcional',
    paragrafos: ['Primeiro parágrafo.', 'Segundo parágrafo.'],
    imagem: 'leituras/id-do-livro/explicacao.png',
    imagemAlt: 'Descrição completa da imagem.',
    botaoTexto: 'Entendi - responder perguntas'
  },

  questionario: []
}
```

Campos `adaptador`, `ilustrador`, `glossarioPorPagina` e `explicacaoFinal` são
opcionais. O campo `correcaoObjetivas: 'ao-final'` é obrigatório para os livros
novos com perguntas objetivas seguidas de ditados.

Não deixe o controlador com texto rígido de um livro específico. Para
explicações finais, use `botaoTexto` ou o padrão genérico:

    Entendi - responder perguntas

---

## 12. Formato das perguntas

Pergunta objetiva:

```js
{
  id: 'id-unico-da-pergunta',
  enunciado: 'Pergunta?',
  alternativas: [
    { id: 'alternativa-a', texto: 'Texto' },
    { id: 'alternativa-b', texto: 'Texto' },
    { id: 'alternativa-c', texto: 'Texto' },
    { id: 'alternativa-d', texto: 'Texto' }
  ],
  respostaCorreta: 'alternativa-a',
  feedback: 'Explicação infantil curta.',
  explicacaoRevisao: 'Justificativa curta, infantil e baseada no texto.'
}
```

Ditado:

```js
{
  id: 'ditado-id',
  tipo: 'ditado',
  enunciado: 'Ditado: ouça e digite a frase.',
  textoDitado: 'Frase completa que será pronunciada.',
  respostaCorreta: 'Frase completa que será pronunciada.',
  feedback: 'Comentário infantil curto.'
}
```

Regras:

- IDs estáveis e únicos;
- quatro alternativas nas perguntas objetivas;
- respostas salvas pelo ID, nunca pela letra visual;
- feedback explicativo;
- registrar `correcaoObjetivas: 'ao-final'` nos livros novos;
- nas 10 objetivas, apenas registrar a escolha e avançar, sem revelar acerto ou
  erro a cada marcação;
- depois da décima objetiva, corrigir o conjunto e exibir uma revisão com todos
  os acertos; para cada erro, mostrar a resposta certa e `explicacaoRevisao`;
- liberar os ditados somente após essa revisão;
- não expor resposta correta antes da revisão conjunta;
- ditados normalmente ao final;
- objetivas e ditados usam o mesmo controlador.

---

## 13. Configuração separada por perfil e livro

Para cada livro futuro, crie um módulo para Alice e outro para Mariana.

Exemplo genérico:

```js
(function () {
  'use strict';

  window.ConfiguracoesLeitura = window.ConfiguracoesLeitura || {};
  window.ConfiguracoesLeitura.alice = window.ConfiguracoesLeitura.alice || {};

  window.ConfiguracoesLeitura.alice['id-do-livro'] = {
    perfil: 'alice',
    livroId: 'id-do-livro',
    chaveArmazenamento: 'revisoesEscolares.alice.leitura.nomeEstavel.v1',
  };
})();
```

Mariana deve usar chave diferente:

```text
revisoesEscolares.mariana.leitura.nomeEstavel.v1
```

Nunca compartilhe a chave de progresso entre as meninas.

Cada livro usa uma única cópia física do PDF; somente o estado é separado.

O registro geral de revisões pode permitir que livros compartilhem o cartão
`materia-leitura`, o painel da biblioteca e o controlador
`biblioteca-leituras`, desde que esse compartilhamento seja explícito.

---

## 14. Estado persistido da leitura

Use `ArmazenamentoRevisoes.criar()` e mantenha, para cada perfil e livro:

```js
{
  livroId: 'id-do-livro',
  versao: 1,
  paginaAtual: 1,
  maiorPaginaAlcancada: 1,
  paginasVisitadas: [],
  respostas: {},
  perguntasCorrigidas: {},
  acertos: 0,
  tentativas: 0,
  perguntaAtual: 0,
  leituraIniciada: false,
  questionarioConcluido: false,
  leituraConcluida: false,
  atualizadoEm: null
}
```

Normalização obrigatória:

- limitar página entre 1 e `totalPaginas`;
- remover páginas inválidas e duplicadas;
- aceitar somente IDs de perguntas existentes;
- aceitar somente alternativas existentes;
- limitar ditados a 180 caracteres;
- ignorar respostas malformadas;
- recalcular acertos;
- limitar `perguntaAtual`;
- só considerar o questionário concluído se todas as perguntas foram corrigidas;
- considerar leitura concluída quando a última página foi alcançada e o
  questionário terminou;
- não exigir 100% de acertos;
- funcionar quando `localStorage` falhar;
- não misturar livros ou perfis.

O botão de limpeza deve pedir confirmação e remover somente a chave do livro e
perfil ativos. Nunca use `localStorage.clear()`.

---

## 15. Embaralhamento pseudoaleatório e equilibrado

Implemente ordem estável das alternativas. Não use `Math.random()` a cada
renderização.

A ordem deve depender de chave estável composta por:

```text
perfil | livroId | perguntaId
```

Requisitos:

- Alice e Mariana podem receber sequências diferentes;
- voltar ou recarregar não muda a ordem;
- resposta continua associada ao ID;
- alternativas incorretas são embaralhadas deterministicamente;
- posição correta é distribuída entre A, B, C e D;
- diferença de frequência entre letras é no máximo uma;
- evitar ciclo simples `A, B, C, D, A, B, C, D`;
- ditados não participam do cálculo das letras.

Pode usar hash FNV-1a, gerador congruencial linear e Fisher-Yates baseado em
semente.

Teste estabilidade, isolamento, distribuição, ausência de ciclo simples e
preservação da resposta correta.

---

## 16. Leitor PDF integrado

Crie `ambiente_interativo/js/leitura.js` como controlador reutilizável.

O visualizador deve:

- carregar PDF.js somente ao abrir livro;
- usar PDF local;
- validar quantidade de páginas;
- renderizar em `<canvas>`;
- respeitar `devicePixelRatio`;
- ajustar à largura;
- permitir zoom aproximadamente entre 75% e 175%;
- ter página anterior e próxima;
- aceitar número da página;
- usar setas esquerda/direita quando o foco não estiver em campo ou botão;
- anunciar “Página X carregada”;
- atualizar o nome acessível do canvas;
- salvar somente depois de renderização bem-sucedida;
- mostrar carregamento e erro compreensível;
- cancelar renderização antiga durante navegação rápida;
- usar contador de sequência para impedir desenho de página antiga;
- não deformar canvas;
- não causar rolagem horizontal móvel;
- liberar questionário na última página;
- mostrar explicação final opcional.

Nome acessível do canvas:

    Página 12 do livro Título

---

## 17. Compatibilidade com abertura por arquivo local

O restante do ambiente deve continuar abrindo pelo bundle clássico via
`file://`.

Como navegadores bloqueiam módulos e workers de PDF nesse modo, ofereça:

- botão para abrir PDF original em janela ampla;
- orientação para usar servidor local;
- botão “Já terminei o PDF - responder perguntas”, quando apropriado;
- nenhuma tentativa de contornar a segurança do navegador;
- nenhuma dependência de CDN.

Modo recomendado:

```powershell
npm run interativo
```

Endereço:

```text
http://127.0.0.1:5173/ambiente_interativo/index.html
```

---

## 18. Leitor dedicado em nova janela

Crie:

    ambiente_interativo/leitor.html
    ambiente_interativo/css/leitor-dedicado.css
    ambiente_interativo/js/leitor-dedicado.js

Parâmetros:

```text
?perfil=alice&livro=id-do-livro&pagina=1
```

Recursos:

- título acessível;
- ajuste à tela;
- zoom;
- tela cheia;
- página anterior e próxima;
- contador;
- setas do teclado;
- link para PDF original;
- canvas nítido;
- layout móvel sem rolagem horizontal;
- carregamento e erro;
- atualização da página na URL;
- glossário da página;
- botão final para questionário ou explicação;
- erro seguro para livro inválido ou catálogo vazio.

Sincronize com a janela principal por `postMessage` usando tipos:

```text
leitura-pagina
leitura-questionario
leitura-explicacao
```

Valide `evento.origin`, livro, perfil, tipo e página. Ao terminar, foque a
janela principal e feche a dedicada quando permitido.

---

## 19. Ditado falado sem corte da primeira palavra

O controlador compartilhado deve proteger a primeira palavra usando duas falas
separadas:

1. aviso audível “Atenção.”;
2. frase real do ditado.

Fluxo:

1. criança clica em “🔊 Ouvir ditado”;
2. aguarde 1 segundo;
3. pronuncie `Atenção.` em `pt-BR`, velocidade aproximada `0.9`;
4. quando o aviso terminar, aguarde aproximadamente 600 ms;
5. pronuncie a frase real em outra `SpeechSynthesisUtterance`, velocidade `0.78`;
6. criança digita somente a frase real.

Não coloque “Atenção” dentro da resposta avaliada.

Configure:

```js
fala.lang = 'pt-BR';
fala.pitch = 1;
fala.volume = 1;
```

Priorize voz exatamente `pt-BR` quando disponível e use
`speechSynthesis.resume()` antes da reprodução.

Constantes equivalentes:

```js
ATRASO_INICIAL_DITADO_MS = 1000;
PAUSA_APOS_PREPARACAO_DITADO_MS = 600;
TEXTO_PREPARACAO_DITADO = 'Atenção.';
```

Evite corridas:

- contador de sequência por reprodução;
- cancelamento de temporizadores e síntese antigos;
- ignorar eventos de reprodução cancelada;
- não iniciar frase depois de trocar de pergunta ou tela;
- impedir agendamento duplo;
- se o aviso falhar, ainda tentar a frase principal;
- mensagens `aria-live` para espera, aviso, reprodução, conclusão e erro.

Instrução visível:

    Clique em Ouvir ditado. Você ouvirá “Atenção” e, depois, a frase. Digite somente a frase usando o teclado.

Fallback:

    O navegador não conseguiu reproduzir o ditado. Peça a um adulto para ler a frase.

Correção:

- ignorar maiúsculas/minúsculas;
- ignorar acentos;
- ignorar pontuação final;
- normalizar espaços;
- não ignorar palavras ausentes;
- não aceitar resposta vazia;
- salvar texto digitado;
- permitir nova tentativa.

Essa solução deve valer automaticamente para ditados futuros.

### 19.1. Áudio bilíngue reutilizável para Inglês

Preserve também o módulo compartilhado `ambiente_interativo/js/audio.js` e a
integração de Alice e Mariana > Inglês > Unit 3: At School. A arquitetura é:

- `js/audio.js`: síntese local, seleção da melhor voz local, cancelamento,
  repetição, aviso audível e idiomas `pt-BR`/`en-US`;
- `js/registro-ingles.js`: unidades, grupos, vocabulário, atividades, traduções e
  imagens;
- `js/ingles.js`: tela, áudio, atividades, correção final e progresso;
- `revisoes/<perfil>/ingles-unidade-3.js`: configuração e chave exclusiva de
  Alice ou Mariana;
- `materia-ingles` e `tela-ingles` no HTML;
- imports correspondentes em `js/app.entry.js`.

Controles obrigatórios:

- `🔊 Ouvir instrução` em `pt-BR`;
- `🔊 Ouvir em inglês` em `en-US`, com velocidade `0.62`;
- `🐢 Ouvir devagar`, com velocidade `0.50` e pronúncia contínua;
- `🔁 Repetir`;
- `⏹ Parar`.

O módulo deve aguardar 1 segundo e enviar primeiro à mesma voz uma fala de
aquecimento (`Ready.` em en-US ou `Preparando.` em pt-BR) com volume `0.01`.
Quando ela terminar, deve aguardar aproximadamente 250 ms, falar `Atenção.` ou
`Listen.` com volume normal em uma fala separada, aguardar 600 ms e somente
então pronunciar o conteúdo. Essa etapa é necessária porque o
Chromium/Windows pode cortar o começo do primeiro enunciado mesmo após uma
espera silenciosa. Prefira vozes com `localService !== false`, nunca use CDN ou
API de áudio, não acesse o microfone e não reproduza nada automaticamente. A
tela deve anunciar estados por `aria-live`, funcionar por teclado e persistir
os IDs ouvidos e as respostas somente na chave do perfil.

Depois que os 27 itens forem ouvidos, libere 10 atividades baseadas na Unidade 3
do caderno: objetos escolares, pessoas, lugares, contagem, tradução, materiais,
respeito e regras com `should`/`shouldn't`. Distribua as respostas corretas de
modo pseudoaleatório estável e equilibrado entre A, B, C e D. Não mostre acerto
ou erro durante as questões. Após a décima resposta, apresente a revisão final
com acertos, erros, alternativa certa e explicação breve para cada erro.

Disponibilize exatamente a mesma unidade para Alice e Mariana, mas use
configurações, chaves e estados separados. Preserve o progresso antigo da Alice
ao acrescentar os novos campos. Considere a revisão concluída apenas após a
correção final das 10 atividades.

Ao final da correção, exiba o recurso local
`assets/personagens/mita-recompensa.png` em um cartão de recompensa. Não use URL
externa. Escolha o texto estritamente pelo perfil ativo:

- Alice: `Alice, invadi o computador de vocês, li tudo e vi que você é muito
  estudiosa, espero que você volte a jogar e me liberte da Mita Day Mochi má!
  Como prova da minha gratidão, vou te enviar pelos correios um presentinho. Ah,
  vi que você gosta de Minecraft, né?`
- Mariana: `Mariana, invadi o computador de vocês, li tudo e vi que você é muito
  estudiosa, e em breve deve me libertar da Mita Day Mochi má, como prova da
  minha gratidão, vou te enviar pelos correios um presentinho. Ah, vi que você
  gosta de Minecraft, né?`

Depois do texto, mostre `Beijos.` e `Mita.`. O cartão deve ter texto alternativo
na imagem, funcionar em tela móvel e nunca misturar as mensagens dos perfis.

---

## 20. Glossário infantil reutilizável

Crie `ambiente_interativo/js/glossario.js`.

O dicionário pode começar vazio:

```js
const glossario = Object.freeze({});
```

Formato futuro:

```js
palavraId: {
  palavra: 'palavra exibida',
  significado: 'Explicação simples e adequada à idade.',
  exemplo: 'Exemplo curto no contexto infantil.'
}
```

Exponha API equivalente a:

```js
window.GlossarioRevisoes = {
  glossario,
  obter,
  encontrarNoTexto,
  encontrarEmTextos,
  criarBotao,
  criarAtalhos,
  renderizarTexto,
  abrirLista,
  termosDaPagina,
  atualizarBotaoPagina
};
```

Comportamento:

- nenhuma consulta à internet;
- definições infantis controladas;
- palavras HTML como botões sublinhados;
- `aria-haspopup="dialog"`;
- diálogo interno com título, significado e exemplo;
- fechamento por botão, Escape e fundo;
- foco inicial no fechar;
- devolução de foco à palavra;
- nenhuma alteração em progresso ou pontuação;
- nunca inserir botão dentro de outro botão.

Quando a palavra estiver em alternativa, use área separada:

    Palavra que pode ajudar: palavra

Nos PDFs, use `glossarioPorPagina`. O botão
“📘 Palavras desta página” aparece somente em páginas cadastradas e funciona nos
dois leitores.

---

## 21. Explicação final opcional

Implemente como recurso genérico:

```js
explicacaoFinal: {
  titulo,
  paragrafos,
  imagem,
  imagemAlt,
  botaoTexto
}
```

Regras:

- mostrar somente na última página;
- ocultar em livros sem explicação;
- parágrafos com glossário;
- imagem com texto alternativo;
- `botaoTexto` opcional;
- padrão “Entendi - responder perguntas”;
- leitor dedicado retorna primeiro à explicação;
- não codificar assunto específico no controlador;
- avisos de segurança pertencem aos dados do livro.

---

## 22. Acessibilidade

Verifique:

- botões reais;
- títulos focados ao trocar de tela;
- foco visível;
- nomes acessíveis;
- `aria-live` para páginas, ditado e correção;
- progresso com `role="progressbar"`;
- `aria-valuemin`, `aria-valuemax` e `aria-valuenow`;
- alternativas com `aria-pressed`;
- campos com `<label>`;
- canvas com nome acessível;
- diálogo com título;
- foco devolvido ao fechar;
- Escape;
- áreas de toque adequadas;
- contraste;
- `prefers-reduced-motion`;
- ausência de violações sérias ou críticas no axe.

Não dependa somente de cor.

---

## 23. Responsividade

Teste:

- 390 × 844;
- 768 × 1024;
- 1280 × 800;
- alta densidade de pixels;
- títulos longos;
- zoom do navegador.

Não pode haver rolagem horizontal acidental, PDF maior que recipiente, diálogo
cortado, botões inacessíveis ou canvas deformado.

No leitor dedicado, use colunas com `minmax(0, 1fr)` e limite a largura do
canvas também por `window.innerWidth`.

---

## 24. Atalhos BAT

Confirme:

```text
abrir_ambiente_interativo.bat
abrir_chromium_ambiente_interativo.bat
abrir_chromium_revisoes.bat
```

Todos devem usar:

```bat
@echo off
setlocal
cd /d "%~dp0"
```

O primeiro verifica Vite e executa `npm run interativo`.

O atalho do Chromium deve iniciar o servidor, esperar a URL responder, abrir o
Chromium do Playwright e orientar `npx playwright install chromium` quando
necessário. Não use perfil pessoal ou caminho rígido de outro computador.

---

## 25. ESLint

Reconheça como módulos ES:

```text
ambiente_interativo/js/app.entry.js
ambiente_interativo/js/pdfjs.entry.js
ambiente_interativo/js/leitor-dedicado.js
```

Ignore dependências, bundles, assets gerados, screenshots, `test-results` e
`tmp`.

Mantenha `no-undef`, `no-unreachable`, `no-unused-vars` e
`no-constant-condition`. Não desligue regras para fazer passar.

---

## 26. Testes automatizados

Sem livros reais, teste:

1. aplicação inicia;
2. registro vazio é aceito;
3. biblioteca vazia é tratada;
4. matéria Leitura fica oculta ou mostra vazio coerente;
5. nenhum cartão fictício aparece;
6. módulos carregam;
7. revisões antigas continuam;
8. armazenamento continua isolado;
9. acessibilidade passa.

Use fixtures ou mocks técnicos para testar:

1. esquema do livro;
2. estado inicial;
3. normalização de páginas;
4. JSON inválido;
5. `localStorage` bloqueado;
6. separação Alice/Mariana;
7. separação entre livros;
8. botão de retomada;
9. distribuição pseudoaleatória;
10. estabilidade das alternativas;
11. correção de ditado;
12. sequência `1 segundo → Atenção → 600 ms → frase`;
13. cancelamento de reprodução antiga;
14. glossário sem alterar progresso;
15. explicação final opcional;
16. livro inexistente no leitor dedicado.

Quando o primeiro PDF real for adicionado, inclua testes de resposta HTTP,
páginas, renderização, navegação rápida, retomada, questionário, leitor
dedicado, `postMessage`, fallback `file://`, móvel, console e axe.

Limpe somente chaves criadas pelos testes. Não use `localStorage.clear()`.

---

## 27. Documentação

Atualize:

```text
README_FERRAMENTAS.txt
ambiente_interativo/README_INTERATIVO.txt
ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt
```

Documente instalação, Chromium, servidor, build, PDF.js, catálogo vazio,
esquemas, configurações por perfil, chaves, pseudoaleatoriedade, aviso
“Atenção”, glossário, explicação final, leitor dedicado, gerados, temporários,
Git local e procedimento para adicionar livro.

Não documente livros inexistentes.

---

## 28. Procedimento futuro para cadastrar um PDF

Deixe instruções para:

1. criar `ambiente_interativo/leituras/id-do-livro/`;
2. copiar uma única versão do PDF;
3. contar e validar páginas;
4. extrair capa da página 1;
5. verificar visualmente todas as páginas;
6. cadastrar metadados;
7. criar perguntas objetivas;
8. criar ditados;
9. selecionar palavras difíceis por página;
10. adicionar definições ao glossário;
11. adicionar explicação final, se necessária;
12. configurar Alice;
13. configurar Mariana;
14. importar configurações em `app.entry.js`;
15. registrar integração em `registro-revisoes.js`;
16. testar os dois perfis;
17. testar isolamento;
18. executar qualidade completa.

Reutilize `leitura.js`; não copie o controlador por livro.

---

## 29. Fluxo obrigatório

Siga:

1. diagnóstico;
2. Git e `.gitignore`;
3. confirmação da infraestrutura anterior;
4. dependências;
5. build PDF.js;
6. registro vazio;
7. integração visual;
8. biblioteca;
9. visualizador;
10. leitor dedicado;
11. armazenamento;
12. pseudoaleatoriedade;
13. questionário;
14. ditado;
15. glossário;
16. explicação final;
17. acessibilidade;
18. responsividade;
19. testes;
20. documentação;
21. build final;
22. commit local seguro, se não incluir material privado.

---

## 30. Validação final obrigatória

Execute:

```powershell
npm install
npx playwright install chromium
npm run format
npm run format:check
npm run lint
npm test
```

Depois:

1. abra `npm run interativo`;
2. verifique Alice e Mariana;
3. confirme revisões antigas;
4. confirme catálogo vazio;
5. teste teclado;
6. teste largura móvel;
7. confira console;
8. teste fixtures de leitura;
9. confirme os dois bundles;
10. confirme que bundles gerados não foram preparados para commit.

Se algo falhar, corrija e repita o fluxo.

---

## 31. Critérios de aceitação

Conclua somente quando:

- nenhum livro específico foi copiado;
- revisões existentes foram preservadas;
- Git local foi verificado ou configurado;
- nenhum remoto foi criado;
- `.gitignore` protege dados e gerados;
- PDF.js está local;
- build gera os dois bundles;
- catálogo vazio não quebra;
- matéria Leitura está pronta;
- registro aceita novos livros;
- estados são separados;
- visualizador integrado está pronto;
- leitor dedicado está pronto;
- pseudoaleatoriedade é estável e equilibrada;
- ditado usa “Atenção” e pausa antes da frase;
- primeira palavra está protegida contra corte;
- glossário está pronto;
- explicação final está pronta;
- acessibilidade e responsividade passam;
- lint, formatação, build e testes passam;
- documentação corresponde ao projeto real.

---

## 32. Relatório final

Ao terminar, responda em português com:

### Diagnóstico

- o que existia;
- o que faltava;
- se Git existia;
- branch atual;
- remotos encontrados.

### Implementação

- arquivos criados;
- arquivos modificados;
- infraestrutura preparada;
- compatibilidades preservadas.

### Git

- identidade local;
- `.gitignore`;
- commits criados;
- confirmação de que não houve push.

### Validação

- build;
- lint;
- formatação;
- quantidade de testes;
- acessibilidade;
- teste móvel;
- console;
- atalhos.

### Pendências

- catálogo vazio;
- PDFs, perguntas e glossários aguardando materiais do usuário;
- limitações reais encontradas.

Inclua links locais clicáveis para os arquivos principais. Não declare que algo
passou sem executar.
