# Nivelamento das melhorias do projeto Revisões escolares

## Instrução principal ao Codex

Trabalhe diretamente no projeto aberto neste computador:

    C:\Users\guiuf\Documents\Codex\Revisões escolares

O objetivo é nivelar a infraestrutura e os aprimoramentos gerais do ambiente interativo com a versão mais avançada existente no computador reserva.

Este arquivo descreve o estado desejado. Antes de alterar qualquer coisa, examine cuidadosamente o projeto local, identifique o que já existe, preserve tudo o que estiver correto e implemente somente o que estiver ausente, incompleto ou incompatível.

Não trate este documento como uma ordem para substituir cegamente o projeto. O trabalho deve ser uma atualização cuidadosa, com integração e preservação.

---

## 1. Escopo exato

Devem ser nivelados apenas os aprimoramentos estruturais e reutilizáveis do projeto, especialmente:

- arquitetura modular do ambiente interativo;
- armazenamento seguro e separado por revisão;
- controle de progresso;
- estados visuais dos cartões de revisão;
- navegação e validação das atividades;
- suporte aprimorado a desenho em canvas;
- acessibilidade e responsividade;
- ferramentas de desenvolvimento;
- build e geração do bundle;
- testes automatizados;
- scripts de abertura local;
- documentação técnica essencial.

Não crie, copie ou recrie tarefas escolares, revisões, provas, conteúdos pedagógicos ou pacotes de frases que tenham sido produzidos exclusivamente no computador reserva.

---

## 2. Regra de segurança mais importante

Faça uma mesclagem inteligente. Não apague nem substitua em massa os arquivos do computador principal.

Antes de editar:

1. liste a estrutura relevante do projeto;
2. leia os arquivos atuais;
3. verifique se há alterações locais ou arquivos ainda não versionados;
4. identifique funcionalidades que já existem;
5. preserve IDs HTML, chaves de armazenamento, nomes de revisão e compatibilidade com progresso salvo;
6. só então aplique mudanças pontuais.

Não use comandos destrutivos como reset forçado, limpeza geral ou exclusão recursiva do projeto.

Nunca use localStorage.clear(), pois isso pode apagar dados de outras revisões ou aplicações.

Se houver arquivos modificados pelo usuário, trabalhe ao redor deles e preserve seu conteúdo sempre que possível.

---

## 3. Conteúdo que não deve ser sincronizado

Não copie do computador reserva:

- pastas de tarefas das alunas;
- revisões ou atividades pedagógicas específicas;
- respostas e progresso pessoal;
- pacote_frases_visiveis;
- tmp;
- test-results;
- node_modules;
- perfis ou dados de navegador;
- capturas, relatórios temporários e artefatos de depuração;
- backups antigos;
- arquivos gerados que possam ser reconstruídos;
- app.bundle.js antigo sem antes gerar novamente a partir das fontes locais.

Esses itens podem ser ignorados na comparação. O foco é a infraestrutura compartilhável.

---

## 4. Diagnóstico inicial obrigatório

Inspecione, se existirem:

    ambiente_interativo
    ambiente_interativo\index.html
    ambiente_interativo\css
    ambiente_interativo\js
    ambiente_interativo\js\app.js
    ambiente_interativo\js\atividades.js
    ambiente_interativo\js\armazenamento.js
    ambiente_interativo\js\desenho.js
    ambiente_interativo\js\registro-revisoes.js
    ambiente_interativo\js\app.bundle.js
    scripts
    tests
    package.json
    package-lock.json
    eslint.config.js
    playwright.config.js
    .prettierrc
    .prettierignore
    README_FERRAMENTAS.txt
    abrir_ambiente_interativo.bat
    abrir_chromium_ambiente_interativo.bat
    abrir_chromium_revisoes.bat

Responda internamente às perguntas abaixo antes de modificar:

- O JavaScript está modularizado ou concentrado em um único arquivo?
- Existe um registro central das revisões?
- Os IDs de cartões e painéis são validados?
- Cada revisão usa uma chave própria de armazenamento?
- O ambiente funciona quando localStorage está indisponível?
- Há estados visuais de não iniciada, em andamento e concluída?
- Os estados são acessíveis por texto ou ARIA, e não apenas por cor?
- O canvas aceita mouse, toque e caneta?
- O desenho é salvo e restaurado?
- O canvas continua nítido em telas de alta densidade?
- Há ESLint, Prettier, Vite, Playwright e axe?
- Os testes cobrem os fluxos essenciais?
- O bundle é gerado automaticamente antes dos testes?
- Os atalhos BAT localizam a própria pasta sem depender do diretório atual?

Registre uma conclusão breve desse diagnóstico no relatório final.

---

## 5. Arquitetura modular desejada

O ambiente interativo deve possuir uma separação clara de responsabilidades. Use ou adapte a estrutura abaixo:

    ambiente_interativo\js\app.js
    ambiente_interativo\js\atividades.js
    ambiente_interativo\js\armazenamento.js
    ambiente_interativo\js\desenho.js
    ambiente_interativo\js\registro-revisoes.js
    ambiente_interativo\js\app.bundle.js

Responsabilidades esperadas:

### app.js

- inicialização da aplicação;
- eventos globais;
- navegação entre tela inicial e revisões;
- integração entre registro, armazenamento, atividades e desenho;
- atualização dos cartões e da interface;
- tratamento seguro de erros de inicialização.

### atividades.js

- descoberta e renderização das etapas;
- leitura e validação das respostas;
- marcação de etapas concluídas;
- avanço e retorno entre etapas;
- cálculo do progresso;
- atualização dos controles da atividade.

### armazenamento.js

- leitura segura de JSON;
- gravação segura;
- normalização e migração do estado antigo, quando necessária;
- isolamento por chave de revisão;
- fallback em memória se localStorage falhar;
- preservação dos dados existentes.

### desenho.js

- inicialização do canvas;
- eventos de ponteiro;
- suporte a mouse, toque e caneta;
- uso da pressão da caneta quando disponível;
- limpar, salvar e restaurar desenhos;
- ajuste para devicePixelRatio;
- descarte correto dos ouvintes ao trocar de revisão.

### registro-revisoes.js

- fonte central da configuração das revisões;
- ID lógico;
- ID do cartão;
- ID do painel;
- título e metadados;
- chave de armazenamento;
- tipo ou comportamento especial, quando aplicável;
- validação de IDs duplicados e configurações ausentes.

### app.bundle.js

- arquivo gerado automaticamente;
- não deve ser editado manualmente;
- deve refletir exatamente os módulos-fonte atuais;
- deve ser reconstruído pelo script de build.

Se a versão local já possuir organização equivalente com outros nomes, não renomeie sem necessidade. Preserve a arquitetura existente e adapte apenas o que for preciso.

---

## 6. Registro central das revisões

Crie ou fortaleça um registro único que descreva todas as revisões disponíveis.

Cada entrada deve permitir localizar com segurança:

- a revisão;
- o cartão da tela inicial;
- o painel correspondente;
- a chave exclusiva de armazenamento;
- o título exibido;
- metadados opcionais;
- recursos especiais, como desenho.

Na inicialização, valide:

- IDs lógicos duplicados;
- chaves de armazenamento duplicadas;
- cartão inexistente;
- painel inexistente;
- configurações obrigatórias ausentes;
- associações inconsistentes entre cartão e painel.

Falhas em uma revisão não devem derrubar toda a aplicação. Mostre aviso claro no console e, quando adequado, um estado compreensível na interface.

Não invente revisões pedagógicas que não existam no computador principal.

---

## 7. Armazenamento resiliente e compatível

O estado persistido de cada revisão deve ser isolado em chave própria.

O formato pode seguir esta ideia, adaptada ao sistema já existente:

    {
      "etapa": 0,
      "concluidas": [],
      "respostas": {},
      "desenhos": {}
    }

Requisitos:

- leitura com tratamento de JSON inválido;
- valores padrão quando a chave não existir;
- validação dos tipos lidos;
- remoção de duplicatas na lista de concluídas;
- limitação da etapa ao intervalo válido;
- preservação de campos reconhecidos;
- migração conservadora de formatos antigos;
- gravação apenas da chave da revisão atual;
- fallback em memória quando localStorage lançar erro;
- aplicação funcional mesmo em arquivo local, quando possível;
- nenhum apagamento global do armazenamento.

Se o computador principal já tiver progresso salvo em formato antigo, mantenha compatibilidade ou realize uma migração segura e idempotente.

Uma migração idempotente pode ser executada novamente sem corromper ou duplicar dados.

---

## 8. Estados visuais dos cartões

Cada cartão de revisão deve refletir um dos três estados:

- não iniciada;
- em andamento;
- concluída.

O cálculo deve partir do progresso real salvo, não de uma variável visual temporária.

O estado precisa ser comunicável por mais de um meio:

- classe CSS;
- texto visível ou ícone com significado;
- aria-label, aria-describedby ou equivalente;
- contraste suficiente;
- indicação compreensível sem depender somente da cor.

Ao concluir, reabrir ou alterar uma revisão, o cartão deve atualizar sem exigir recarregamento manual da página.

Os estados devem sobreviver a recarregamento do navegador.

---

## 9. Navegação e fluxo das atividades

Garanta que:

- clicar em um cartão abra somente a revisão correspondente;
- voltar à tela inicial esconda o painel ativo;
- a etapa salva seja restaurada;
- avançar e voltar respeitem os limites;
- a última etapa possa ser concluída corretamente;
- a barra ou indicação de progresso seja atualizada;
- revisões incompletas sejam marcadas como em andamento;
- revisões completas sejam marcadas como concluídas;
- uma etapa inválida no armazenamento não quebre a interface;
- eventos não sejam registrados repetidamente ao abrir e fechar painéis.

Ao validar respostas:

- normalize espaços quando apropriado;
- respeite o tipo da atividade;
- mantenha mensagens claras;
- não exponha respostas de forma inadequada;
- preserve respostas já salvas;
- trate campos ausentes sem interromper a aplicação.

Se existirem renderizadores diferentes, mantenha-os separados e testáveis.

---

## 10. Canvas de desenho

Quando uma atividade usar desenho, o canvas deve:

- funcionar com mouse;
- funcionar com toque;
- funcionar com caneta;
- usar Pointer Events quando disponíveis;
- impedir rolagem acidental durante o desenho;
- capturar e liberar o ponteiro corretamente;
- considerar pressão da caneta, quando válida;
- continuar com traço utilizável quando a pressão não existir;
- ajustar a resolução interna ao devicePixelRatio;
- manter o tamanho visual definido pelo layout;
- restaurar o desenho salvo ao reabrir;
- salvar sem bloquear a interface;
- permitir limpeza intencional;
- reagir corretamente a redimensionamento;
- remover ouvintes e referências quando o painel for descartado.

O salvamento pode usar uma representação adequada ao projeto, como data URL, desde que seja validada e isolada por revisão e etapa.

Evite acumular handlers a cada reabertura do painel.

---

## 11. Acessibilidade

Revise a interface para assegurar:

- uso completo por teclado;
- foco visível;
- ordem de tabulação coerente;
- botões reais para ações;
- cartões clicáveis também acionáveis por teclado;
- nomes acessíveis;
- rótulos associados aos campos;
- mensagens de status anunciáveis quando necessário;
- regiões e títulos com semântica apropriada;
- canvas com alternativa textual ou instrução;
- contraste adequado;
- redução de movimento para usuários que preferem menos animação;
- ausência de bloqueios graves detectáveis pelo axe.

Não altere o visual pedagógico sem necessidade. Corrija acessibilidade preservando a identidade do projeto.

---

## 12. Responsividade e robustez visual

Teste pelo menos:

- largura de celular;
- tablet;
- desktop;
- zoom aumentado;
- textos longos;
- cartões com títulos em múltiplas linhas;
- orientação vertical e horizontal, quando relevante.

Evite:

- rolagem horizontal acidental;
- botões fora da tela;
- canvas deformado;
- conteúdo encoberto;
- texto cortado;
- foco invisível;
- controles pequenos demais para toque.

---

## 13. Build e bundle

Configure o projeto para gerar ambiente_interativo\js\app.bundle.js a partir dos módulos-fonte.

O build deve:

- ser reproduzível;
- falhar claramente quando houver erro;
- gerar um bundle compatível com a forma de abertura atual;
- não depender de edição manual;
- ser executado antes dos testes automatizados;
- evitar código obsoleto no bundle.

O HTML deve carregar o arquivo correto para o modo de uso escolhido.

Se a aplicação precisa funcionar por duplo clique em index.html, verifique esse cenário explicitamente. Se módulos ES diretos forem incompatíveis com arquivo local, use o bundle apropriado.

---

## 14. Ferramentas de desenvolvimento

Verifique package.json e package-lock.json. Mantenha as versões compatíveis e configure scripts claros, preferencialmente equivalentes a:

    npm run build
    npm run dev
    npm run lint
    npm run format
    npm run format:check
    npm test
    npm run test:e2e

Pode adaptar nomes se o projeto já adotar outra convenção, mas documente-os.

Ferramentas esperadas, se compatíveis com o projeto:

- Vite para servidor e build;
- ESLint para análise estática;
- Prettier para formatação;
- Playwright para testes de interface;
- axe-core integrado aos testes de acessibilidade.

Não atualize dependências indiscriminadamente para versões incompatíveis. Prefira o menor conjunto de mudanças necessário.

Depois de alterar dependências, mantenha package.json e package-lock.json sincronizados.

---

## 15. ESLint e Prettier

Confirme ou crie:

    eslint.config.js
    .prettierrc
    .prettierignore

O lint deve analisar os módulos-fonte e testes relevantes sem tentar validar:

- node_modules;
- bundles gerados;
- test-results;
- arquivos temporários;
- artefatos de navegador;
- conteúdo pedagógico não relacionado.

O Prettier deve usar uma configuração simples e consistente, sem produzir uma reescrita desnecessária de todo o acervo escolar.

---

## 16. Playwright e testes

Confirme ou crie:

    playwright.config.js
    tests

Os testes devem iniciar o ambiente de modo confiável e cobrir, no mínimo:

1. carregamento da tela inicial;
2. existência dos cartões registrados;
3. abertura de uma revisão;
4. navegação entre etapas;
5. persistência após recarregar;
6. isolamento de armazenamento entre revisões;
7. estado não iniciada;
8. estado em andamento;
9. estado concluída;
10. funcionamento do retorno à tela inicial;
11. ausência de erros graves no console;
12. verificação de acessibilidade com axe;
13. fluxo básico do canvas, quando houver desenho;
14. restauração de desenho salvo;
15. comportamento com armazenamento inválido ou indisponível.

Os testes não devem depender de dados pessoais, respostas reais das alunas ou tarefas exclusivas do computador reserva.

Use dados temporários e limpe somente as chaves criadas pelos próprios testes.

Não deixe test-results como parte da atualização permanente.

---

## 17. Atalhos BAT

Na raiz do projeto, verifique a utilidade destes atalhos:

    abrir_ambiente_interativo.bat
    abrir_chromium_ambiente_interativo.bat
    abrir_chromium_revisoes.bat

Requisitos gerais:

- usar a pasta do próprio arquivo BAT como referência;
- funcionar mesmo quando chamado de outro diretório;
- lidar corretamente com espaços e acentos no caminho;
- verificar se o alvo existe;
- apresentar mensagem compreensível em caso de falha;
- não depender de um caminho absoluto exclusivo do computador reserva;
- não usar perfil pessoal do navegador sem necessidade.

Exemplo de princípio seguro para localizar a raiz:

    @echo off
    setlocal
    cd /d "%~dp0"

Adapte o restante ao projeto real. Não copie caminhos rígidos do outro computador.

---

## 18. Documentação

Atualize ou crie README_FERRAMENTAS.txt com instruções curtas para:

- instalar dependências;
- iniciar o servidor;
- gerar o bundle;
- executar lint;
- conferir formatação;
- executar testes;
- abrir o ambiente pelos atalhos;
- explicar quais pastas são temporárias ou geradas;
- orientar como adicionar uma revisão ao registro central.

A documentação deve corresponder aos comandos que realmente funcionam.

---

## 19. Ordem recomendada de execução

Siga esta sequência:

1. inventário da estrutura local;
2. leitura dos arquivos existentes;
3. identificação das diferenças;
4. preservação de dados, IDs e chaves;
5. modularização ou ajuste dos módulos;
6. registro central;
7. armazenamento resiliente;
8. estados dos cartões;
9. navegação e validação;
10. canvas;
11. acessibilidade e responsividade;
12. build e bundle;
13. ferramentas de lint e formatação;
14. testes automatizados;
15. atalhos BAT;
16. documentação;
17. execução de todas as verificações;
18. inspeção final das alterações.

Não pare após apenas criar configurações. O objetivo é deixar o ambiente funcionando e validado.

---

## 20. Verificações finais obrigatórias

Execute, conforme os scripts disponíveis:

    npm install
    npm run build
    npm run lint
    npm run format:check
    npm test

Se npm install não for necessário porque as dependências já estão consistentes, use npm ci quando apropriado ou explique a decisão.

Além dos comandos automáticos:

- abra a interface em navegador;
- verifique a tela inicial;
- abra mais de uma revisão;
- avance e volte;
- recarregue a página;
- confirme a persistência;
- confirme o isolamento entre revisões;
- teste teclado;
- teste uma largura móvel;
- teste o canvas, se existir;
- observe o console do navegador.

Se algum teste falhar por uma limitação real do ambiente, investigue e corrija. Caso não seja possível, documente precisamente a causa e o impacto.

---

## 21. Critérios de aceitação

Considere o nivelamento concluído somente quando:

- o projeto existente foi preservado;
- nenhuma tarefa exclusiva do computador reserva foi criada;
- a aplicação inicia sem erro;
- revisões existentes continuam acessíveis;
- progresso antigo compatível continua disponível;
- cada revisão possui armazenamento isolado;
- os cartões refletem o progresso real;
- a navegação funciona;
- canvas funciona nos dispositivos suportados;
- acessibilidade não apresenta violações graves;
- o bundle é reproduzível;
- lint e formatação passam;
- testes relevantes passam;
- atalhos funcionam com caminhos locais;
- documentação corresponde ao estado real;
- arquivos temporários não foram incorporados como fonte.

---

## 22. Relatório final solicitado

Ao terminar, apresente ao usuário um relatório em português contendo:

### Diagnóstico

- o que já existia;
- o que estava ausente;
- diferenças relevantes encontradas.

### Alterações realizadas

- arquivos criados;
- arquivos modificados;
- comportamento implementado;
- compatibilidades preservadas.

### Validação

- comandos executados;
- quantidade ou resumo dos testes;
- resultado do lint;
- resultado da formatação;
- resultado do build;
- resultado dos testes no navegador.

### Pendências

- qualquer limitação restante;
- qualquer decisão que dependa do conteúdo do computador reserva;
- qualquer melhoria opcional não necessária para o nivelamento.

Inclua links clicáveis para os arquivos principais alterados.

---

## 23. Restrições finais

- Não invente diferenças que não foram verificadas localmente.
- Não afirme que algo foi testado sem executar o teste.
- Não copie conteúdo escolar exclusivo.
- Não sobrescreva o projeto inteiro.
- Não apague progresso do usuário.
- Não use caminhos absolutos do computador reserva dentro do código.
- Não edite manualmente arquivos gerados quando houver fonte e build.
- Não deixe a aplicação parcialmente migrada.
- Não finalize enquanto houver uma verificação segura e relevante que ainda possa ser executada.

Comece agora pelo diagnóstico do projeto local e prossiga autonomamente até concluir o nivelamento estrutural e sua validação.
