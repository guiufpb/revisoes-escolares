# Testes e validação real

## Base obrigatória

Toda mudança de código executa, na raiz:

```text
npm run build
npm run format:check
npm run lint
```

Acrescente regressão para o comportamento alterado e execute testes Playwright direcionados à
revisão, ao controlador e às telas atingidas. A matriz, quando aplicável, inclui caminho feliz,
primeira tentativa errada, correção sem sair da etapa, desfazer, avançar, voltar, recarregar,
persistência de várias ações, dados corrompidos/bloqueados, isolamento, teclado, ponteiro,
390 × 844 sem overflow, axe-core, console e `file://`.

Não enfraqueça um teste para fazer a implementação passar. Prefira asserções sobre contrato e
efeito observável; em áudio, valide o payload enviado ao sintetizador, não um atraso arbitrário.

Para o **Modo Responsável**, cubra unidade sem opt-in, atalho e `Escape`, teclado/toque, troca e
restauração integral de sessões, chaves independentes, salto para frente e para trás, bypass sem
pré-requisitos falsos, fluxo normal após o salto, recarga, cartão ligado apenas à sessão principal,
limpeza seletiva, 390 × 844, desktop e axe-core.

## Gatilhos da suíte global

Execute `npm test`:

1. a cada três revisões ou conjuntos independentes novos sobre infraestrutura estabilizada;
2. ao mudar navegação, registros, armazenamento, áudio, controlador compartilhado, CSS/HTML
   estrutural, build, bundle, PDF.js ou `file://`;
3. ao mudar pontuação, conclusão, limpeza, migração ou restauração de progresso;
4. diante de falha inesperada, interferência ou alcance incerto;
5. antes de consolidar na `main` um lote que ainda não passou pela suíte global.

Uma inclusão declarativa pode ficar nos testes direcionados quando nenhum outro gatilho se aplica.
Toda PR para `main` mantém a suíte global e aguarda “Formatação, lint e testes”.

O job de CI tem limite de 60 minutos, mantendo a suíte completa e um único worker.
Em 06/10/2026, a execução das 392 verificações passou em 44,5 minutos, mas o limite
anterior de 45 minutos cancelou o job durante o encerramento. A janela foi ampliada
para acomodar a execução e o encerramento, sem reduzir testes ou suas asserções.
O resumo de testes aprovados não substitui o resultado final aprovado do check.

## Servidor conhecido e testes de abertura

[playwright.config.js](../../../playwright.config.js) usa `127.0.0.1:5181` por padrão.
`PLAYWRIGHT_PORT` pode definir outra porta entre 1024 e 65535, exceto 5173, reservada ao estudo.
O servidor inicia na raiz desta configuração com porta explícita, `strictPort` e
`reuseExistingServer: false`. Uma porta de testes ocupada interrompe a execução, mesmo que
o servidor pareça pertencer à mesma cópia; não encerre processos alheios para liberar testes.

O global setup consulta `/__revisoes_local__/identity`, compara todos os campos com a identidade
calculada da raiz e registra raiz/origem confirmadas antes dos testes. Falha nessa confirmação
invalida a execução. Use caminhos relativos em `page.goto` e `baseURL` para contratos de origem;
não fixe 5173 nos testes. Outra porta de testes não migra nem comprova progresso da origem habitual.

### PDFs sintéticos e preparo reproduzível

Testes de Leitura usam exclusivamente as fixtures originais de
[tests/fixtures/pdfs.cjs](../../../tests/fixtures/pdfs.cjs). Não copie automaticamente PDFs
escolares privados entre worktrees nem reduza a suíte por sua ausência. Material real da criança
serve à análise pedagógica ou ao uso local autorizado; fixture automatizada serve à regressão.

O servidor Playwright seleciona [vite.test.config.cjs](../../../vite.test.config.cjs), que prepara
automaticamente dez PDFs em `tests/fixtures/pdfs/`, fora dos diretórios de livros reais. Para
preparo explícito, execute `npm run preparar:pdfs-teste`. O comando é offline, determinístico e
idempotente; valida arquivos existentes sem sobrescrevê-los. Corrupção, versão divergente ou link
simbólico interrompem o preparo com diagnóstico. Remova somente a fixture sintética indicada
quando precisar regenerá-la; nunca remova documentos privados para preparar testes.

Windows e CI usam o mesmo contrato, sem exceções por `CI`: tamanho e SHA-256 dos bytes gerados,
páginas, texto conhecido, dimensões A4 e desenho não branco via PDF.js. As URLs dos livros são
atendidas apenas por fixtures no servidor de teste; outros PDFs são recusados sem ler arquivos
privados. A configuração comum e os launchers de estudo continuam usando os livros locais.
O antigo gerador de páginas vazias da CI foi substituído por esse preparo compartilhado.

Ao adicionar livro ou cenário, reutilize ou estenda o manifesto sintético com as páginas exigidas
pelo registro. Preserve asserções de navegação, progresso, questionário, glossário e acessibilidade;
uma fixture não comprova a integridade ou a adequação pedagógica do documento escolar original.

`tests/pdfs-sinteticos.spec.js` cobre sete casos: raiz vazia diferente, CI/local e idempotência,
proibição de leitura privada, corrupção sem sobrescrita, links recusados, HTTP/HEAD/ranges,
texto e renderização de todas as páginas e separação entre configuração comum e de teste.

No Windows, execute também:

```text
node tests/worktrees-abertura-local.cjs
node tests/launcher-pronuncia.cjs
```

O primeiro cobre 23 cenários de raízes, identidade, dependências, portas, pronúncia opcional e
recusa real do Playwright a HTTP desconhecido. O segundo cobre oito cenários do preparador Azure
com CLI, npm, credencial e saúde simulados, conferindo a raiz escolhida e ausência de segredo
na saída ou no ambiente posterior. Não usam Azure real ou microfone. A porta 5190 deve estar
livre para o segundo teste; não encerre um gateway alheio automaticamente.

`tests/infra-abertura-local.spec.js` acrescenta dois casos à suíte global: identidade da raiz,
aplicação disponível, recusa de comandos/origem externa e proteção dos arquivos privados.
Os testes de launcher Windows continuam fora do workflow Ubuntu; CI Windows é pendência
explícita, sem ampliação do workflow neste lote.

Não execute testes Playwright concorrentes com a mesma pasta de resultados. O cenário de
porta ocupada do teste CJS usa `--output` dentro da própria fixture. Na validação inicial deste
lote, uma execução concorrente sem essa separação removeu um trace; após isolar a saída,
o caso afetado passou novamente. Isso não autoriza reduzir asserções ou desativar traces.

## O que automação não prova

Playwright valida lógica, DOM, persistência, acessibilidade programática e payloads simulados. Não
prova pronúncia da voz instalada, ergonomia infantil, clareza do enunciado, dificuldade adequada,
ambiguidade percebida ou valor pedagógico.

Depois dos testes, o uso real pode exigir audição no Windows, teclado físico, toque, leitura pela
criança e inspeção da distribuição das alternativas. Registre uma validação real somente após
confirmação do usuário; não a infira de mocks ou screenshots.

## Registro e saída

Use `INVENTARIO_IMPLEMENTACOES.md` para estado atual e `RELATORIO_TESTE_INTERATIVO.txt` para fatos
cronológicos. Relate apenas comandos realmente executados, contagens aprovadas, falhas, limites e
validação humana pendente. Finalize com `git diff --check`, status, auditoria de privacidade e stash.

## Processamento e observação do servidor de desenvolvimento

O CSS atual é comum e não depende de plugins PostCSS externos. Declare essa configuração em
`vite.config.js`; não dependa de descoberta automática em diretórios ancestrais. Uma futura
necessidade de plugin deve ser explícita na configuração do projeto e validada com CSS servido,
build, layout e regressões. A investigação no Windows encontrou espera de acesso a configurações
ausentes fora da raiz, concorrendo com a observação inicial de artefatos.

O watcher exclui somente `tmp`, `output` e `MINHAS_REVISOES_LOCAIS` da raiz desta configuração;
exclusão do Git não equivale a exclusão do watcher. Não copie essa regra como uma exclusão global
de qualquer diretório chamado `tmp`: uma checkout pode estar numa pasta temporária. Preserve a
observação de fontes, CSS e configuração. A descoberta de dependências usa apenas `index.html`
e `leitor.html` do ambiente, sem varrer HTMLs de diagnóstico ou capturas. Novos HTMLs funcionais
precisam ser incluídos deliberadamente; novas revisões declarativas não criam outra entrada.

A regra usa a raiz do arquivo de configuração. Ao servir outra cópia com configuração externa,
confira separadamente a raiz efetivamente servida; não presuma que as exclusões foram transferidas.
Isso não modifica o auxiliar externo do catálogo nem substitui as proteções HTTP de identidade
e `fs.deny`. Preserve também a composição de plugins em `vite.test.config.cjs` e os PDFs sintéticos.

Observar fontes não recompõe automaticamente o bundle clássico carregado por `index.html`.
Após editar seus módulos-fonte, execute o build oficial. Alterações no CSS podem ser refletidas
pelo cliente Vite; a mudança do bundle gerado pode recarregar a página. Não confunda observação,
recarregamento e reconstrução, nem edite bundles manualmente.

Compare inicialização fria e recargas quentes, HTTP/transformação, execução no navegador e
condições de carga antes de alterar testes. Considere o orçamento acumulado do teste e separe
hooks/teardown do corpo. Não diagnostique perda de progresso, erro de imagem ou falha de um
controle apenas pela última tela de um timeout. Não aumente prazos ou reduza asserções para
compensar processamento redundante.

Use raiz absoluta, porta exclusiva, `strictPort` e `reuseExistingServer: false` nas reproduções.
Preserve os servidores de estudo e a origem de cada cópia; portas/perfis diferentes têm progresso
separado. Não execute vários servidores de medição simultaneamente sem que a concorrência seja
a hipótese explícita. Catálogos privados localizam worktrees; não as integram nem migram progresso.

Preview é uma comparação complementar: neste projeto serve a checkout construída, não um `dist`
convencional. Confira HTML, CSS, bundles, imagens, worker e PDFs sintéticos nos testes de Leitura.
Ele não cobre transformações, watcher e cliente Vite do dev; mantenha regressões direcionadas
nesse modo. Os mapas acrescentados ao bundle pelo dev não são prova de custo integral da suíte.
Não remova diagnóstico ou recursos funcionais sem demonstrar o efeito. Alterar o modo preferencial
da global é uma decisão explícita, com equivalência relevante e cobertura dev preservada.

Imagens amplas podem ter poucos bytes. Antes de otimizar, registre tamanho real, `viewBox`, variante
selecionada e requisições de elementos ocultos/duplicados. Reutilize recursos e componentes;
não reduza ilustrações, remova responsividade ou multiplique variantes móveis sem necessidade
pedagógica e técnica. Permanecem os contratos existentes de teclado, foco, toque, fonte, layout e
testes móveis; uma mudança de política para revisões futuras exige decisão própria.

`tests/infraestrutura-vite.spec.js` verifica a configuração resolvida, CSS servido sem alteração,
artefatos próprios realmente ausentes do watcher, observação de CSS/JS/configuração e identidade
com proteção HTTP. As exclusões também são verificadas para raízes irmãs e fontes internas.
Esse teste não mede desempenho nem comprova sozinho o ciclo completo de HMR ou a atualização do
bundle; combine-o com os contratos de carregamento, navegação e PDF e a suíte global da base atual.
