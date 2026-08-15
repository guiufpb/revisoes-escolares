FERRAMENTAS DO PROJETO
Projeto: Revisões escolares


DOCUMENTAÇÃO CENTRAL

Inventário completo do Ambiente Interativo:

  documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md

Instruções atualizadas de manutenção e criação:

  documentacao/ambiente-interativo/INSTRUCOES_PROJETO.md

Regras automáticas para trabalhos futuros com o Codex:

  AGENTS.md


1. PREPARAÇÃO

Requisitos: Node.js, npm e o Chromium do Playwright.

Instalar ou sincronizar as dependências:

  npm install
  npx playwright install chromium

Quando for necessária uma instalação exatamente igual ao package-lock.json,
use npm ci em uma pasta sem node_modules.


2. AMBIENTE INTERATIVO

Iniciar o servidor local sem abrir o navegador:

  npm run dev

Iniciar e abrir automaticamente a página correta:

  npm run interativo

Endereço local:

  http://127.0.0.1:5173/ambiente_interativo/index.html

Gerar ambiente_interativo/js/app.bundle.js a partir dos módulos-fonte:

  npm run build

O index.html usa esse bundle clássico para também funcionar por duplo clique
(file://). O bundle é gerado: não o edite manualmente. As fontes ficam em
ambiente_interativo/js e ambiente_interativo/revisoes.

Atalhos da raiz:

  abrir_ambiente_interativo.bat
    Abre o index.html no navegador padrão.

  abrir_chromium_ambiente_interativo.bat
    Abre o index.html em um Chromium temporário do Playwright.

  abrir_chromium_revisoes.bat
    Nome compatível que encaminha para o atalho do ambiente interativo.

Todos os atalhos localizam a própria pasta e funcionam quando chamados de
outro diretório. Eles não usam perfil pessoal do navegador.


3. QUALIDADE E TESTES

Gerar o bundle:

  npm run build

Analisar o JavaScript:

  npm run lint

Formatar as fontes cobertas pelo projeto:

  npm run format

Conferir a formatação sem alterar arquivos:

  npm run format:check

Executar todos os testes de navegador (o bundle é gerado antes):

  npm test
  npm run test:e2e

Executar apenas o fluxo interativo ou a acessibilidade:

  npm run test:interativo
  npm run test:a11y

Os testes usam Playwright e axe-core. Eles cobrem navegação, progresso,
isolamento e migração do armazenamento, estados dos cartões, canvas,
responsividade, teclado, abertura por arquivo local e falha do localStorage.


4. COMO ADICIONAR UMA REVISÃO

1. Crie o painel e o cartão no HTML, mantendo IDs únicos.
2. Adicione a implementação da revisão sem reutilizar a chave de outra revisão.
3. Registre a revisão em ambiente_interativo/js/registro-revisoes.js com:
   - id lógico;
   - aluno;
   - título;
   - cartaoId;
   - painelId;
   - chaveArmazenamento;
   - totalEtapas;
   - possuiDesenho, quando aplicável.
4. Inclua a fonte em ambiente_interativo/js/app.entry.js, se for um novo módulo.
5. Execute npm run build, npm run lint, npm run format:check e npm test.

O registro valida campos obrigatórios, duplicidades e a existência do cartão e
do painel. Cada revisão deve salvar apenas em sua própria chave. Migrações de
formato antigo devem ser conservadoras, idempotentes e nunca apagar a chave
antiga automaticamente.


5. ARQUIVOS GERADOS OU TEMPORÁRIOS

- ambiente_interativo/js/app.bundle.js: gerado por npm run build.
- node_modules: dependências instaladas; pode ser recriada com npm install.
- test-results: resultados temporários do Playwright; não é fonte do projeto.
- tmp: arquivos temporários; não é fonte do projeto.
- screenshots e previews: artefatos de conferência visual, não módulos da aplicação.

Não use localStorage.clear(). Para limpeza, remova somente a chave pertencente
à revisão ou ao teste atual.


6. PDF, PREVIEWS E VALIDAÇÃO DAS CARTILHAS

Gerar PDF A4 ao lado do HTML:

  npm run gerar:pdf -- "04 Mariana Matemática/saida/revisao_matematica_mariana_ampla_A4.html"

Indicar outro PDF ou uma pasta de destino já existente:

  node scripts/gerar_pdf.js "cartilha.html" "saida/cartilha_final.pdf"
  node scripts/gerar_pdf.js "cartilha.html" "saida/"

Gerar previews PNG:

  npm run gerar:previews -- "cartilha.html"
  node scripts/gerar_previews.js "cartilha.html" "saida/meus_previews"

Validar HTML, páginas, recursos locais e PDF:

  npm run validar:cartilha -- "cartilha.html"
  node scripts/validar_cartilha.js "cartilha.html" --paginas 18 --pdf "cartilha.pdf"

O relatório padrão é VALIDACAO_AUTOMATICA.txt ao lado do HTML. Opções úteis:

  --relatorio "saida/VALIDACAO_AUTOMATICA.txt"
  --json

Os scripts de PDF usam Chromium/Playwright com fundo impresso e tamanho CSS de
página. Inkscape e ImageMagick são opcionais para conversão e otimização.
