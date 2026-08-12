# Implementar a matéria Leitura no ambiente interativo

## Papel do Codex

Trabalhe diretamente no projeto real localizado em:

`C:\Users\guiuf\Documents\Codex\Revisões escolares`

Leia este arquivo integralmente antes de alterar qualquer coisa. Depois, inspecione o estado atual do projeto e implemente tudo o que está descrito aqui. Não entregue apenas orientações, exemplos ou trechos soltos: faça as alterações reais, gere os arquivos necessários, execute as validações e corrija os problemas encontrados.

## Objetivo

Adicionar ao ambiente interativo uma nova matéria chamada **Leitura**, disponível nos perfis de **Alice** (6 anos, 1º ano) e **Mariana** (7 anos, 2º ano).

Dentro de Leitura, criar uma biblioteca preparada para receber vários livros. O primeiro livro será o PDF **`infantil-dinheiro.pdf`**, exibido integralmente dentro do ambiente, com todas as páginas, textos, cores e ilustrações originais. Depois da leitura, cada criança responderá a um questionário simples sobre a história.

O mesmo arquivo do livro deve ser compartilhado pelos dois perfis, sem duplicar desnecessariamente o PDF, mas o progresso de Alice e Mariana deve ser completamente independente, inclusive a última página lida e as respostas do questionário.

## Restrições obrigatórias

1. Não reconstruir o ambiente do zero.
2. Não apagar, substituir ou prejudicar as revisões existentes.
3. Preservar a tela inicial, os perfis Alice e Mariana, as matérias atuais, os canvases, o armazenamento, o Vite, o bundle, o Prettier, o ESLint e os testes já existentes.
4. Não editar, mover ou excluir materiais sincronizados ou arquivos de referência somente para leitura.
5. Não recriar as páginas do livro em HTML e não redesenhar suas ilustrações. O visualizador deve renderizar o PDF original, preservando o material integral.
6. Não usar CDN, serviço externo, link remoto ou conexão com a internet para abrir o livro. Tudo deve funcionar localmente pelo Vite.
7. Não misturar o progresso de uma criança com o da outra e não misturar o progresso deste livro com o de leituras futuras.
8. Não copiar o PDF duas vezes, uma para cada criança. Deve existir uma cópia compartilhada do livro e dois estados de progresso separados.
9. Não considerar a tarefa concluída com testes falhando, erros graves no console, páginas do PDF ausentes ou fluxo inacessível por teclado.
10. Respeitar a autoria e manter a página de créditos/licença do PDF acessível como parte das 25 páginas.

## Localização e conferência do PDF

Procure o arquivo nesta ordem:

1. `C:\Users\guiuf\Documents\Codex\Revisões escolares\infantil-dinheiro.pdf`
2. `C:\Users\guiuf\Downloads\infantil-dinheiro.pdf`
3. em outra subpasta do projeto, sempre pelo nome exato `infantil-dinheiro.pdf`.

Quando encontrado, **copie, não mova**, o arquivo para uma pasta compartilhada e clara, por exemplo:

`ambiente_interativo\leituras\primeiras-licoes-sobre-dinheiro\infantil-dinheiro.pdf`

Antes e depois da cópia, confira:

- nome: `infantil-dinheiro.pdf`;
- tamanho esperado: `14.842.959` bytes;
- quantidade: `25` páginas;
- orientação: paisagem;
- SHA-256 esperado: `F3F072A0C1688D3989A3A1E7617FE8D57A62A45F0BEBD77CDD0286A705A36F3D`.

Se o arquivo não for encontrado ou não corresponder ao PDF esperado, não baixe outro livro, não crie um substituto e não invente páginas. Interrompa somente a parte que depende do PDF e informe com precisão o que está faltando.

## Identificação do primeiro livro

- **Título:** Primeiras Lições sobre Dinheiro
- **Autor apresentado na capa:** Anderson Abreu
- **Arquivo:** `infantil-dinheiro.pdf`
- **Total:** 25 páginas
- **Personagem principal:** Helena
- **Temas:** trabalho, necessidades e desejos, cuidado com os bens, compartilhamento, espera, economia, escolhas e valor das pessoas.

Na biblioteca, mostrar no cartão do livro pelo menos a capa, o título, `Anderson Abreu`, `25 páginas` e o estado da criança: `Não iniciado`, `Continuar da página X` ou `Concluído`.

## Conteúdo obrigatório das 25 páginas

Use esta relação para validar a ordem e a integridade do PDF. Não substitua o PDF por estes resumos.

1. **Página 1 - Capa:** título “Primeiras Lições sobre Dinheiro”, nome Anderson Abreu, Helena, cofrinho e elementos relacionados a cuidar, esperar, compartilhar, trabalhar e agradecer.
2. **Página 2 - Créditos e autorização:** capa/projeto gráfico, preparação/revisão, copyright, autorização de disponibilização e informações da plataforma BaixeLivros.
3. **Página 3 - Helena curiosa:** apresentação de Helena e de suas perguntas sobre trabalho e origem do dinheiro.
4. **Página 4 - Passeio ao mercado:** Helena vai ao mercado com a mãe e observa brinquedos, doces, balões e outras coisas interessantes.
5. **Página 5 - Querer e precisar:** Helena quer vários produtos; a mãe pergunta se sobraria dinheiro para o que realmente precisam.
6. **Página 6 - O padeiro:** Helena observa o padeiro que acordou cedo e preparou os pães com cuidado.
7. **Página 7 - Pessoas no mercado:** funcionários organizam frutas, ajudam clientes e registram compras; Helena percebe que muitos trabalhos fazem o mercado funcionar.
8. **Página 8 - Cena ilustrada no caixa:** Helena e a mãe passam pelo caixa do mercado; a página é essencialmente ilustrada e deve aparecer normalmente.
9. **Página 9 - Trabalho e dinheiro:** a mãe explica que o dinheiro está relacionado ao trabalho, à ajuda oferecida e ao que se recebe em troca.
10. **Página 10 - O jardineiro:** no caminho de volta, Helena vê um jardineiro cuidando das flores na praça.
11. **Página 11 - Trabalhos importantes:** aparecem o gari e o motorista; Helena entende que as pessoas fazem tarefas diferentes e importantes.
12. **Página 12 - Cuidar dos brinquedos:** em casa, Helena nota brinquedos bem guardados e outros esquecidos e percebe que não cuidou bem de presentes especiais.
13. **Página 13 - O ursinho e a avó:** o pai lembra que a avó economizou durante meses para comprar o ursinho; Helena passa a valorizá-lo ainda mais.
14. **Página 14 - Organizar e consertar:** Helena separa brinquedos, conserta a boneca, cola uma roupa rasgada e limpa tudo.
15. **Página 15 - Um brinquedo sem uso:** Helena encontra um brinquedo que não usava e percebe a alegria do irmão menor ao vê-lo.
16. **Página 16 - Compartilhar:** Helena dá o brinquedo ao irmão e descobre uma alegria especial ao compartilhar.
17. **Página 17 - Três moedas:** o avô dá três moedas a Helena.
18. **Página 18 - Pensar antes de comprar:** diante da loja de brinquedos, Helena se pergunta se realmente precisa comprar algo naquele momento.
19. **Página 19 - Escolher com calma:** Helena olha os brinquedos, gosta de vários, mas decide esperar antes de escolher.
20. **Página 20 - O cofrinho:** Helena guarda as moedas e acrescenta outra a cada semana para realizar seu sonho.
21. **Página 21 - A compra planejada:** depois de economizar, Helena compra um jogo de montar e percebe que esperar também pode ser divertido.
22. **Página 22 - O que é mais importante:** o pai explica que as pessoas são mais importantes e que o dinheiro ajuda a cuidar do que importa.
23. **Página 23 - Escolhas e ajuda:** Helena lembra da família, dos amigos e dos trabalhadores e compreende que cada escolha tem valor.
24. **Página 24 - O verdadeiro tesouro:** Helena coloca outra moeda no cofrinho e entende que o tesouro também está em aprender a fazer boas escolhas.
25. **Página 25 - Mensagem final:** reflexão sobre sabedoria, possuir menos ou mais e fazer bom uso do que se recebe.

Faça uma verificação visual das 25 páginas renderizadas. A extração de texto não substitui essa conferência, especialmente porque a página 8 é ilustrada e pode não produzir texto extraído.

## Experiência desejada

### 1. Matéria Leitura

- Mostrar um cartão grande chamado **Leitura** na tela de matérias de Alice.
- Mostrar o mesmo cartão na tela de matérias de Mariana.
- O cartão deve aparecer junto das matérias existentes e seguir o mesmo padrão visual infantil.
- Usar ícone local apropriado, como livro aberto, sem CDN.
- Ao selecionar Leitura, abrir uma tela intitulada **Escolha uma leitura**.
- Preservar migalhas, botão de voltar, foco no título e o comportamento de navegação já adotado no ambiente.

### 2. Biblioteca de leituras

Construir a biblioteca como estrutura reutilizável para novos PDFs. Não deixar a implementação rigidamente limitada a um único livro.

O primeiro cartão deve mostrar:

- miniatura fiel da capa, gerada localmente a partir da página 1;
- título;
- autor;
- total de páginas;
- pequeno resumo infantil próprio, sem copiar longos trechos do livro;
- situação individual da criança;
- botão `Começar leitura`, `Continuar da página X` ou `Ler novamente`.

As duas crianças devem enxergar o mesmo catálogo, mas o texto de progresso precisa refletir somente o perfil ativo.

### 3. Visualizador integrado

Implemente um visualizador próprio com **PDF.js instalado localmente pelo npm**, preferencialmente por `pdfjs-dist`, integrado ao bundle do Vite. Atualize `package.json` e `package-lock.json`. Não use o visualizador nativo em `iframe` como solução principal, pois ele não permite acompanhar com confiança a troca de páginas.

O visualizador deve:

- renderizar diretamente o PDF original em `canvas`, sem converter previamente as 25 páginas em substitutos;
- usar worker local e nenhum recurso externo;
- começar na página 1 na primeira leitura;
- retomar automaticamente a última página salva ao continuar;
- exibir `Página X de 25`;
- oferecer botões grandes `Página anterior` e `Próxima página`;
- desabilitar os botões nos limites corretos;
- permitir ir para uma página válida por um controle acessível, se isso não complicar a experiência infantil;
- oferecer `Ajustar à largura` e, se implementado com segurança, zoom `-` e `+`;
- adaptar o canvas à largura disponível, mantendo a proporção e sem corte ou rolagem horizontal em telas pequenas;
- mostrar estado de carregamento e mensagem de erro amigável;
- impedir que renderizações assíncronas antigas sobrescrevam a página mais recente quando a criança clicar rapidamente;
- salvar a página somente depois de uma navegação válida e manter o estado consistente se o carregamento falhar;
- aceitar teclado, mouse e toque;
- permitir setas esquerda/direita quando o foco não estiver dentro de campo de formulário;
- preservar o foco de modo previsível e anunciar a mudança de página em uma região `aria-live` discreta;
- possuir nome acessível para o canvas, por exemplo `Página 7 do livro Primeiras Lições sobre Dinheiro`;
- incluir uma alternativa clara para abrir o PDF original em outra aba ou baixá-lo se o navegador não conseguir renderizar o canvas.

O fluxo oficial de Leitura pode exigir o Vite, aberto por `npm run interativo`. Preserve o teste existente de abertura do restante do ambiente por `file://`; nesse modo, se PDF.js não puder carregar o livro por restrição do navegador, mostre orientação amigável para usar `npm run interativo`, sem travar a aplicação nem gerar erro não tratado.

### 4. Progresso individual e por livro

Criar duas chaves exclusivas e versionadas, uma por criança para este livro. Use nomes claros equivalentes a:

- `revisoesEscolares.alice.leitura.primeirasLicoesDinheiro.v1`
- `revisoesEscolares.mariana.leitura.primeirasLicoesDinheiro.v1`

O estado normalizado deve poder guardar, no mínimo:

- identificador e versão do livro;
- página atual/última página lida, sempre entre 1 e 25;
- maior página alcançada e/ou páginas visitadas, se útil;
- respostas do questionário por ID de pergunta;
- perguntas já corrigidas;
- quantidade de acertos e tentativas;
- leitura iniciada;
- questionário concluído;
- leitura concluída;
- data/hora da última atualização, se usada no projeto.

Reutilize a camada segura de armazenamento existente. Continue funcionando em memória quando `localStorage` estiver bloqueado, ignore JSON inválido com segurança e normalize páginas, respostas e valores fora dos limites.

Nunca use uma chave compartilhada entre Alice e Mariana. Alternar o perfil não pode alterar nem exibir o estado da outra criança. O botão **Limpar progresso desta leitura** deve apagar somente a chave do perfil ativo e deste livro, após confirmação, sem apagar Matemática, Ciências, outras leituras ou o progresso da irmã.

### 5. Questionário final

Ao chegar à página 25, mostrar um botão destacado **Terminei a leitura - responder perguntas**. Não esconder a navegação do livro: a criança pode voltar às páginas para consultar a história.

Apresentar o questionário em telas curtas, idealmente uma pergunta por vez, com fonte grande, botões grandes, feedback acolhedor e barra de progresso. Usar as mesmas perguntas básicas nos dois perfis; as respostas e o resultado permanecem individuais.

Implemente estas 10 perguntas, com alternativas curtas e ordem estável para os testes:

1. **Como se chama a menina da história?** Resposta: Helena.
2. **Aonde Helena foi com a mãe?** Resposta: ao mercado.
3. **Quem preparou os pães quentinhos?** Resposta: o padeiro.
4. **O que Helena aprendeu sobre as pessoas que trabalham?** Resposta esperada: elas ajudam outras pessoas e recebem algo em troca.
5. **Por que o ursinho ficou ainda mais valioso para Helena?** Resposta: porque a avó economizou por vários meses para comprá-lo.
6. **O que Helena fez com o brinquedo que não usava mais?** Resposta: compartilhou/deu ao irmão menor.
7. **Quantas moedas Helena ganhou do avô?** Resposta: três.
8. **O que Helena fez antes de comprar um brinquedo?** Resposta: pensou, esperou e guardou moedas no cofrinho.
9. **O que Helena comprou quando juntou dinheiro suficiente?** Resposta: um jogo de montar.
10. **Segundo o pai de Helena, o que é mais importante: o dinheiro ou as pessoas?** Resposta: as pessoas; o dinheiro ajuda a cuidar do que é importante.

Para cada pergunta:

- oferecer 3 alternativas plausíveis e infantis;
- usar um ID estável;
- permitir escolher antes de corrigir;
- anunciar o retorno com `role="status"` ou região equivalente;
- não humilhar nem punir o erro;
- salvar a resposta e restaurá-la após recarregar;
- permitir tentar novamente;
- ao concluir as 10 perguntas, mostrar acertos, mensagem acolhedora e botões `Rever o livro` e `Responder novamente`.

Considere a leitura **concluída** somente depois que a página 25 tiver sido alcançada e o questionário final tiver sido concluído. Não exigir 100% de acertos para concluir.

## Organização sugerida dos arquivos

Inspecione a estrutura real antes de decidir os nomes definitivos. Prefira uma arquitetura semelhante a esta, ajustando-a ao padrão existente:

- `ambiente_interativo/leituras/primeiras-licoes-sobre-dinheiro/infantil-dinheiro.pdf` - única cópia compartilhada do livro;
- `ambiente_interativo/leituras/primeiras-licoes-sobre-dinheiro/capa.jpg` ou `.webp` - miniatura local derivada da página 1;
- `ambiente_interativo/js/registro-leituras.js` - catálogo central de livros, metadados, PDF, total de páginas e questionário;
- `ambiente_interativo/js/leitura.js` - biblioteca, visualizador, navegação, PDF.js, questionário e integração com armazenamento;
- `ambiente_interativo/revisoes/alice/leitura-primeiras-licoes-sobre-dinheiro.js` - registro/configuração específica da Alice, inclusive chave própria;
- `ambiente_interativo/revisoes/mariana/leitura-primeiras-licoes-sobre-dinheiro.js` - registro/configuração específica da Mariana, inclusive chave própria.

Evite duplicar a lógica ou o banco de perguntas nos dois arquivos de perfil. Os arquivos de perfil podem apenas registrar a disponibilidade e a chave; catálogo, PDF, perguntas e controlador devem ser compartilhados.

Atualize também, conforme necessário:

- `ambiente_interativo/index.html`;
- `ambiente_interativo/css/estilo.css`;
- `ambiente_interativo/js/app.entry.js` para incluir os novos módulos no bundle;
- `ambiente_interativo/js/app.js` para navegação e perfil ativo;
- `ambiente_interativo/js/registro-revisoes.js`, ampliando o cadastro central sem quebrar as revisões atuais;
- `ambiente_interativo/js/armazenamento.js` somente se a ampliação for realmente necessária;
- `package.json` e `package-lock.json` para a dependência local do PDF.js;
- `tests/ambiente-interativo.spec.js`;
- `tests/acessibilidade.spec.js`;
- `ambiente_interativo/README_INTERATIVO.txt`;
- `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`.

Não altere manualmente apenas o arquivo gerado `app.bundle.js`. Altere as fontes, mantenha os imports corretos em `app.entry.js` e gere novamente o bundle pelo fluxo do projeto.

## Cadastro central

Criar um registro de leituras como fonte única de verdade. Cada livro deve possuir, no mínimo:

- `id` estável;
- `titulo`;
- `autor`;
- `arquivoPdf`;
- `capa`;
- `totalPaginas`;
- `resumo`;
- `perfisDisponiveis`;
- questionário com IDs, enunciados, alternativas, resposta correta e feedback.

Integrar Alice e Mariana ao cadastro central já existente com IDs e chaves únicas. Se a validação atual do registro impedir que dois perfis usem um controlador ou painel compartilhado, evolua a validação de forma explícita e testada, sem simplesmente remover a proteção contra IDs, chaves ou cartões duplicados.

O projeto deve ficar pronto para receber um segundo livro adicionando arquivo e metadados, sem copiar todo o visualizador.

## Acessibilidade e experiência infantil

- Linguagem simples, acolhedora e objetiva.
- Botões com área de toque de pelo menos 44 x 44 px.
- Contraste adequado e foco visível.
- Navegação completa por teclado.
- Hierarquia correta de títulos.
- Imagens decorativas com `alt=""`; capa informativa com texto alternativo adequado.
- Canvas do PDF com nome acessível e texto alternativo/fallback próximo.
- Barra de progresso com nome e valores acessíveis.
- Mensagens de carregamento, erro, página alterada, resposta e conclusão anunciadas sem excesso.
- Respeitar `prefers-reduced-motion`.
- Não depender somente de cor para indicar acerto, erro ou conclusão.
- Funcionar em desktop e em viewport móvel de aproximadamente 390 x 844, sem rolagem horizontal.

## Testes obrigatórios

Atualize testes antigos que estejam rigidamente presos à quantidade anterior de registros, preservando a intenção original. Acrescente testes Playwright que comprovem, no mínimo:

1. Leitura aparece para Alice e para Mariana junto das matérias.
2. A biblioteca dos dois perfis mostra o mesmo livro, com título, autor e 25 páginas.
3. O PDF responde com sucesso pelo Vite e tem 25 páginas.
4. A página 1 é renderizada no canvas e os controles mostram `Página 1 de 25`.
5. O botão anterior está desabilitado na página 1.
6. Avançar altera a página, o nome acessível e o estado salvo.
7. Recarregar e continuar restaura exatamente a última página.
8. Navegação rápida não deixa uma página antiga desenhada por cima da atual.
9. A página 25 é alcançável e libera o questionário.
10. As 10 perguntas podem ser respondidas e o resultado final é salvo.
11. O progresso de Alice não aparece para Mariana e vice-versa.
12. Limpar a leitura da criança ativa não apaga o progresso da irmã nem de outras matérias.
13. Página inválida, JSON corrompido e respostas malformadas são normalizados com segurança.
14. O ambiente não quebra quando `localStorage` está bloqueado.
15. A tela da biblioteca, o visualizador, o questionário e o resultado passam por axe-core sem violações sérias ou críticas.
16. O fluxo funciona em viewport móvel sem conteúdo ultrapassar a largura.
17. Não há erros graves no console durante os fluxos de Alice e Mariana.
18. A abertura local já testada do restante do ambiente continua funcionando e apresenta orientação segura para a leitura quando necessário.

Não faça testes frágeis baseados em tempo quando for possível esperar por um estado visível, evento ou atributo determinístico. Não desative regras de acessibilidade para fazer o teste passar.

## Documentação e relatório

Atualize `ambiente_interativo/README_INTERATIVO.txt` com:

- a nova matéria Leitura;
- o caminho Alice/Mariana > Leitura > Primeiras Lições sobre Dinheiro;
- como iniciar e continuar a leitura;
- como funciona a última página salva;
- as duas chaves independentes de armazenamento;
- como limpar somente o progresso do livro;
- localização do PDF e da capa;
- como cadastrar novos livros;
- dependência local do PDF.js;
- observação de que a leitura integrada deve ser aberta por `npm run interativo`.

Atualize `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt` com data, escopo, comandos executados, resultados reais, contagem de testes, conferência visual das 25 páginas, teste móvel, acessibilidade, console e qualquer limitação encontrada. Não declare aprovação de algo que não foi executado.

## Validação visual e técnica

Antes de finalizar:

1. confirme o hash e as 25 páginas do PDF copiado;
2. renderize ou percorra visualmente todas as páginas no visualizador;
3. confira especialmente capa, créditos, página 8 sem texto extraído e página 25;
4. abra os dois perfis e confirme que Leitura aparece em ambos;
5. avance páginas em Alice, troque para Mariana e confirme isolamento;
6. recarregue a página e teste o botão de continuar;
7. conclua o questionário ao menos uma vez;
8. teste teclado e viewport móvel;
9. verifique console e requisições do PDF/worker;
10. corrija os defeitos antes de encerrar.

## Fluxo final obrigatório

Execute, nesta ordem, na raiz do projeto:

```powershell
npm run format
npm run format:check
npm run lint
npm test
```

Se qualquer comando falhar, investigue, corrija e repita o fluxo completo até tudo passar. Como `npm test` já executa o build no fluxo atual, confirme também que `ambiente_interativo/js/app.bundle.js` foi regenerado a partir das fontes novas.

## Entrega final esperada

Ao terminar, responda de forma objetiva com:

- resumo do que foi implementado;
- principais arquivos criados e alterados;
- localização da cópia compartilhada do PDF;
- chaves de progresso de Alice e Mariana;
- confirmação de que as 25 páginas foram verificadas;
- resultados reais de format, format:check, lint e testes, com a quantidade aprovada;
- qualquer limitação restante, se houver;
- comando para abrir: `npm run interativo`;
- endereço: `http://127.0.0.1:5173/ambiente_interativo/index.html`.

Não faça commit, push, publicação externa nem apague arquivos sem solicitação expressa.
