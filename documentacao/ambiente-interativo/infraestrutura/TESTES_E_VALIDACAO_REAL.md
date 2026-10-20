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

A manutenção corretiva 4.3A.4-M acrescenta controles Node de formulário em Chromium com as fontes
e o HTML reais, independentes do bundle/pretest: `node --test tests/validacao/campos-adicao.unit.cjs`.
Na correção final v3, os mesmos controles exigem a etiqueta `bloco`, título, instrução e pergunta
em opções/campos e recusam `undefined`; negativos estruturais cobrem ausência, tipos inválidos,
texto vazio, propriedades adicionais e código executável. O motor permanece intacto.
Registros sintéticos existem somente no navegador descartável. A CLI histórica usa snapshot Git
isolado, preservando o fallback global sem nova revisão e a recusa antes de VM/discovery quando
há adição sobre base sem manifesto. R1/R2, composição, consumidores e REVIEWED conservam seus
negativos. A global integral e a reatestação desta manutenção ficam expressamente pendentes,
conforme o escopo autorizado; validação direcionada não certifica o experimento interrompido.

A manutenção preparatória [4.3A.4-P](../../../validacao/MANUTENCAO_PREPARATORIA.md) retira o teto
literal do teste central: os totais de registro/IDs/chaves coincidem com o manifesto validado,
as identidades atuais coincidem integralmente e as 66 identidades/chaves históricas continuam
protegidas pela referência independente com digest congelado. Asserções específicas de metadados
e existência dos elementos continuam presentes. Adição coerente não exige mudar a expectativa
histórica; exclusão/substituição, duplicação ou chave antiga alterada continuam falhando.
Os 31 controles preparatórios são Node/sintéticos, sem aumentar a descoberta Playwright de 571 casos.
A fixture de adição usa um snapshot JSON versionado de onze entradas, com hashes individuais
e selo fixo do conjunto; não depende de objeto Git local, clone compartilhado ou histórico completo.
As dez expectativas REVIEWED e suas recusas reais permanecem. Os controles de portabilidade
usam processos novos com subprocessos proibidos, Git ausente/mínimo, snapshot ausente/adulterado
e coletor real sobre base sintética incompatível, recusada antes de VM/discovery.
Reatestação e global integral foram adiadas na preparação e posteriormente autorizadas para
uma única execução do snapshot congelado. Revisão deliberada em [IDENTIDADE.md](../../../validacao/IDENTIDADE.md)
e resultados/identidades em `tmp/validacao/etapa43a4p-final-tHzG96/`, sem aprovação antecipada.
Permanecem obrigatórias antes da consolidação, sem reaproveitar identidade/global de outro snapshot.

A Etapa 4.3A.3 acrescenta a [composição com manutenção deliberada](../../../validacao/COMPOSICAO_ATESTACAO.md).
Node direcionado valida evidências sintéticas e bloqueio anterior a VM/discovery; não reatesta
diagnósticos reais. A manutenção do pin e uma global do snapshot final foram autorizadas
separadamente; revisão, identidade e resultado ficam em `tmp/validacao/etapa43a3-final/`.
Não se declara aprovação antecipada. Build, formatação,
lint, Node e manifesto são conferidos antes; resultados históricos da 4.3A.2 não certificam
o snapshot alterado. A composição não reduz gatilhos ou suítes.

A Etapa 4.3A.2 acrescenta uma [prova complementar de adição integrada](../../../validacao/ADICAO_INTEGRADA.md)
com testes Node sintéticos de AST/HTML, preservação, manifesto, identidade e recusa antes de
observação executável. O complemento é observacional: a global e os gatilhos abaixo permanecem
integrais. Cobertura declarada não comprova função nem pedagogia; nenhuma revisão real ou seleção
substitutiva integra a validação deste contrato. A implementação da infraestrutura exige a global
final do snapshot estável, com Node/manifesto/build já abrangidos pelo pretest oficial.

A Etapa 4.1C de identidade é R4 e executa global integral após testes Node e revisão do snapshot
estável. A política 1.1.0 pode conservar a atestação de dicas comprovadamente textuais, mas não
altera os gatilhos de execução nem permite usar global de outro fingerprint. O contrato de
fonte/bundle, procedência e recusas está em [IDENTIDADE.md](../../../validacao/IDENTIDADE.md).

Execute `npm test`:

1. a cada três revisões ou conjuntos independentes novos sobre infraestrutura estabilizada;
2. ao mudar navegação, registros, armazenamento, áudio, controlador compartilhado, CSS/HTML
   estrutural, build, bundle, PDF.js ou `file://`;
3. ao mudar pontuação, conclusão, limpeza, migração ou restauração de progresso;
4. diante de falha inesperada, interferência ou alcance incerto;
5. antes de consolidar na `main` um lote que ainda não passou pela suíte global.

Uma inclusão declarativa pode ficar nos testes direcionados quando nenhum outro gatilho se aplica.
Toda PR para `main` mantém a suíte global e aguarda “Formatação, lint e testes”.

### CI observacional — Etapa 3

As Fases 5B.1/5B.2 acrescentam regressões em `tests/validacao/identidade.unit.cjs` e
`tests/validacao/planejador.unit.cjs`: entradas PDF.js exatas, recusas por incompletude/conteúdo/
materialização, manifesto no retorno inválido, inventário indisponível, procedência e erros
sem conteúdo privado. Testes direcionados e build/formatação/lint verificam o estágio intermediário.
Por autorização específica desta rodada, a global final fica para depois da revisão deliberada
da atestação na Fase 5B.3; nenhum pin é renovado nem há aprovação antecipada. Os gatilhos
normativos continuam vigentes. Superfícies e pendências em [IDENTIDADE.md](../../../validacao/IDENTIDADE.md).

O [contrato do planejador](../../../validacao/PLANEJADOR.md) define a instrumentação experimental
do workflow. `npm test` permanece integral: manifesto, testes Node, build e Playwright sem filtros.
O hook CI prepara as dez fixtures com a função existente e gera plano após o build; a etapa
`always()` confronta o relatório real único e publica resumo/artefatos. Erro experimental não
substitui o resultado da global. `valid=true` isolado não basta (A3); identidade/completude
incompatíveis impedem conclusão e projeção. Sem execução seletiva, sharding ou redução da suíte.

Mudanças nessa infraestrutura exigem testes Node direcionados, manifesto, build, formatação,
lint, diff e uma global do snapshot final. No Windows, a evidência local não substitui a futura
PR Ubuntu. Conserve referências, estado e relatórios de execuções anteriores; a atestação dos
29 diagnósticos segue manutenção deliberada em `validacao/IDENTIDADE.md` (A1 preservado).

A correção P1 acrescenta checkouts Git temporários reais: LF→CRLF declarado nos `.bat`,
identidades brutas preservadas, diferenças de conteúdo/binários e atributos inválidos recusados.
PR integrada e push main positivos precisam atravessar `refIdentity`/`collectComparison` reais,
plano válido e comparação conclusiva com relatório global sintético coerente. Consultar somente
`eventReferences` não comprova esse contrato. Nenhum desses cenários substitui a global final
nem a futura execução Ubuntu; atributos ausentes ou Git sem suporte ficam conservadoramente
incompatíveis. A3/identidade incompleta continua impedindo projeção.

O job de CI tem limite de 120 minutos desde o PR #41, mantendo a suíte completa e um único worker.
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

O primeiro cobre 24 cenários de raízes, identidade, dependências, portas, pronúncia opcional e
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

## Configuração Vite externa e watcher da raiz servida

### Correção controlada de `/@fs/` após a global 4.3A.4-P

A rodada posterior autorizou manutenção deliberada dos dois pins e uma única global do novo
snapshot. A revisão e os valores ficam em [IDENTIDADE.md](../../../validacao/IDENTIDADE.md);
gate, congelamento e resultado efetivo em `tmp/validacao/etapa43a4p-pins-final-Sek0ch/`.
Esta autorização não reduz casos nem permite repetir automaticamente uma global reprovada.

O middleware remove o prefixo pelo comprimento de `'/@fs/'`, preservando a unidade de caminhos
Windows e a barra inicial POSIX. O índice anterior `6` removia um caractere extra. Quando o
Vite emite `/@fs/home/...`, a barra POSIX é recomposta antes do cálculo relativo; a forma
`/@fs//home/...` também funciona. A simples troca do índice não cobria a primeira forma.
Quando o Vite resolve `env.mjs` fora da raiz servida (por exemplo, dependências via junction), ele emite
`/@fs/` em vez de `/node_modules/`; o cálculo incorreto podia confundir ancestrais `.codex/tmp`
da instalação com diretórios privados dentro da raiz. URLs absolutas explícitas também podiam
ser afetadas sem junction. A troca não altera allow/deny do Vite, a regex de privados ou o host.

`tests/validacao/http-local.unit.cjs` cobre o middleware real com `path.win32` e `path.posix`,
incluindo privados e codificações. Duas instâncias HTTP reais usam o runtime Vite local mínimo,
com e sem junction/symlink, para conferir `env.mjs`, URL absoluta explícita, diretórios privados,
traversal simples/codificado e arquivo externo indevido. A fixture mantém `fs.allow` limitado à
raiz; nenhum allow externo genérico é necessário. Os 24 cenários de abertura existentes
continuam aplicáveis. Testes POSIX de caminho não substituem a futura CI Linux real.

A alteração invalida o pin HTTP e o corpus da atestação: ambos exigem manutenção deliberada
posterior, sem modificar política para obter aprovação nos testes. Nesta rodada são autorizados
somente Node/HTTP e um pequeno recorte Playwright representativo. Usar `--output` próprio para
preservar os traces da global reprovada. A próxima global integral requer autorização específica.

`tests/infra-vite-externo.spec.js` acrescenta três contratos ao Playwright. Serve raízes diferentes
da localização da configuração, inclusive duas simultâneas, com espaços, acentos e ancestrais
`.codex/tmp`. Verifica PostCSS explícito, fontes e configuração observadas, artefatos de primeiro
nível ausentes do watcher, pastas internas homônimas e raízes irmãs preservadas, identidade,
bloqueios HTTP normais e `/@fs/`, CSS, JavaScript, SVG, PNG e bundle clássico.

A fixture executa o Vite da própria raiz servida, reproduzindo o auxiliar, com arquivos mínimos
da instalação existente e sem instalação pela internet. HTMLs de diagnóstico contêm imports
inválidos deliberados: a descoberta deve considerar somente as entradas funcionais explícitas.
O caso sem `leitor.html` confirma que somente a dependência da entrada principal é otimizada.
O caso com leitor confirma ambas as dependências, atualização real de CSS pelo cliente Vite e
recarga após alterar apenas um bundle sintético. Alterar o módulo-fonte não reconstrói esse bundle;
continue usando o build oficial para fontes reais, sem processo de build paralelo.

Execute o teste em porta temporária livre com `PLAYWRIGHT_PORT`, `strictPort` e
`reuseExistingServer:false`. As instâncias internas usam portas efêmeras e recusam 5173, 5187 e 5190. Fixtures privadas ficam em subdiretórios exclusivos de `tmp`, com limpeza limitada às
pastas criadas pela invocação. Não use PDFs escolares privados nem perfil habitual do navegador.

O harness `node tests/worktrees-abertura-local.cjs` passa a cobrir 24 cenários: acrescenta duas
partidas reais concorrentes na mesma porta explícita, exige um único vencedor, falha da segunda
instância e reutilização confirmada sem nova partida. Mantém os testes existentes de outra raiz,
identidade inválida, corrida de ocupação e recusa do Playwright a servidor desconhecido. Nenhum
launcher de produção foi alterado. O preparador de pronúncia em 5190 não integra esta validação.

Para esta mudança compartilhada, execute uma regressão global da base alterada após os contratos
direcionados, localmente ou pelo check obrigatório do PR; não repita a suíte da pasta habitual. Não altere timeouts,
retries ou asserções para compensar falhas. Antes de publicar, confira hashes dos auxiliares,
atalhos, catálogo, saídas de build e conteúdo das cópias atendidas, além de Git, stash e servidores.
Medições de inicialização isoladas não substituem essa regressão nem comprovam ganho geral.

### Histórico da implementação isolada — 09/10/2026

- Build, `format:check`, lint e `git diff --check` aprovados; configuração Vite e harness CJS
  também conferidos explicitamente por Prettier/ESLint, além dos padrões dos comandos npm.
- Teste novo: **3/3** aprovado. Harness Windows: **24/24** aprovado, sem Azure real ou microfone.
- Suíte global da worktree original de infraestrutura: **404/404 em 27,3 minutos**, exit code 0, sem falhas, retries ou
  skips, na porta temporária 62208 com identidade confirmada e sem reutilizar servidor.
  Inclui carregamento, Leitura/PDF sintético, armazenamento, sessões, Desktop Amplo e `file://`.
- Nove entradas conferidas por inspeção de atalhos, branch e conteúdo. Resolução da configuração
  nas nove raízes e processamento do CSS real preservaram integralmente o texto CSS, sem iniciar
  servidores nessas cópias. O responsável confirmou posteriormente a abertura real das entradas 03, 06 e 09 e a
  recusa de outra cópia em 5173 ocupada; veja o documento de worktrees. O Codex não acessou
  progresso habitual.
- Medição controlada após a global: três pares em ordem alternada, com dois HTMLs funcionais e
  90 HTMLs temporários sintéticos. Medianas de partida: 52 → 47 ms na primeira e 58 → 46 ms na
  segunda abertura; até CSS e descoberta concluírem: 375 → 65 ms e 305 → 63 ms. Diretórios de
  artefatos observados: 3 → 0 em todas as amostras. Cache do sistema operacional não controlado;
  primeira/segunda partida não comprova ganho geral, uso infantil ou desempenho das nove cópias.

A reconciliação com a main preserva os testes e as otimizações do PR #37. Os resultados
históricos acima não validam automaticamente essa combinação. Execute build, formatação, lint,
contratos Vite internos/externos, harness Windows e regressões de Leitura/armazenamento na base
reconciliada, em portas temporárias; a global também é obrigatória no check do PR para main.

### Validação local da base reconciliada — 09/10/2026

Na branch de integração baseada em `73813eb` (PR #37), build, formatação do código, lint e
diff aprovados. Contratos Vite/HTTP/PDF: **13/13**; regressões de Leitura, armazenamento,
restauração, isolamento, leitor dedicado e `file://`: **15/15**. Harness Windows: **24/24**.
Porta temporária 60338, identidade confirmada, contextos isolados e sem reuso de servidor.
Os testes internos usam portas efêmeras; 5173, 5187 e 5190 não foram utilizadas nesta rodada.
A global desta combinação fica no check obrigatório do PR; a contagem histórica de 404 não
é apresentada como resultado da base reconciliada. Nenhum timeout, retry, skip ou asserção mudou.

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

O watcher exclui somente `tmp`, `output` e `MINHAS_REVISOES_LOCAIS` da raiz efetivamente servida;
exclusão do Git não equivale a exclusão do watcher. Não copie essa regra como uma exclusão global
de qualquer diretório chamado `tmp`: uma checkout pode estar numa pasta temporária. Preserve a
observação de fontes, CSS e configuração. A descoberta de dependências usa apenas `index.html`
e `leitor.html` do ambiente, sem varrer HTMLs de diagnóstico ou capturas. Novos HTMLs funcionais
precisam ser incluídos deliberadamente; novas revisões declarativas não criam outra entrada.

A regra captura a raiz final em `configResolved`, tanto no uso habitual quanto com configuração
externa. Confira a raiz efetivamente servida ao testar outra cópia.
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

## Matemática de Alice — outubro de 2026

`tests/matematica-alice-dezenas-numeros-dinheiro-outubro-2026.spec.js` acrescenta 20 testes
para a revisão de dezenas, números e dinheiro: gabarito independente dos 55 subitens, cinco
blocos, variantes numéricas/extenso/monetárias, seleção exata, ordenação reversível, ditado
com estímulo oral independente da resposta, indisponibilidade de voz, sessões separadas,
restauração, armazenamento inválido/bloqueado, conclusão e limpeza seletiva. Confere também
geometria determinística, teclado, toque, três larguras, axe-core e contrato `file://`.

Mudanças compartilhadas exigem a global além desse arquivo. A contagem literal do teste de
registro acompanha a inclusão de uma revisão, preservando unicidade e existência dos elementos.
Os resultados da execução, a inspeção visual e as pendências humanas estão em
[pedagogia/ALICE_MATEMATICA_OUTUBRO_2026.md](../pedagogia/ALICE_MATEMATICA_OUTUBRO_2026.md).

Resultado da integração em 13/10/2026: 20 passed (1.4m) próprios; 177 passed (13.9m) no recorte
compartilhado e das quatro revisões do PR #39; 504 passed (35.3m) globais. A base passou de 63
para 64 registros mantendo unicidade, chaves e asserções das revisões anteriores. O resultado
424/425 da preparação original permanece apenas como histórico, sem substituir esta execução.


## Matemática de Mariana — integração Etapa 3

`tests/matematica-mariana-medir-calcular-descobrir.spec.js` conserva os 48 testes da
implementação original: gabarito independente de 30 questões/75 subitens, percurso completo,
erro parcial e correção, 30 pontos únicos, edição após acerto, normalização de inteiros,
retorno/recarga, isolamento, limpeza seletiva, armazenamento inválido/bloqueado, teclado, toque,
figuras determinísticas, tabela acessível, três viewports, axe-core, console e `file://`.

A inclusão reutiliza a conferência por subitem opt-in da Cena Matemática. O teste central exige
65 cadastros, IDs e chaves únicos e mantém as asserções das quatro revisões do PR #39 e da
Matemática da Alice do PR #41. A auditoria da integração compara os 64 registros anteriores
com a base e o conteúdo/teste/21 SVGs com a origem, sem importar materiais privados.

Resultado da integração local em 13/10/2026: 48/48 testes próprios (2,9 min); rodada de regressões 261/262 (20,4 min),
com única falha na coleta do teste central recém-ampliado: a asserção exigia totalEtapas, mas
o campo não era projetado. Corrigida somente a coleta, preservando a asserção; reteste 1/1
(3,7 s). Nenhum controlador precisou de correção. Suíte global completa: **552/552 (40.4m)**,
exit code 0, sem falhas, retries ou skips. Windows: 24/24 (17 s); pronúncia simulada: 8/8 (23 s).
Build, format:check, lint e diff aprovados novamente após a correção exclusiva do teste.
Porta 5189, identidade confirmada, um worker, sem reutilização de servidor.
A rodada inicial permanece registrada; o reteste isolado não substitui a passagem global final.
Testes não comprovam uso infantil, abertura humana por duplo clique ou voz instalada.

Ajuste local após a CI do PR #42 (551/552): o percurso de 30 questões esgotou o limite
de 30 segundos na Q21, após 20 pontos. O trace mostra o clique final cancelado após cerca de
102 ms pelo orçamento total, sem evidência de instabilidade persistente. Somente esse teste
passa a usar `test.setTimeout(180000)`, conforme o percurso equivalente já existente.
As 30 questões, duas conferências por questão e todas as asserções permanecem intactas.
Reteste direcionado: 1/1 (13,7 s); suíte global local não repetida. Nova CI ainda pendente.

## Inglês de Mariana — Transportes, integração Etapa 4

`tests/ingles-mariana-transportes-outubro-2026.spec.js` conserva os 19 testes atuais da origem,
incluindo gabarito independente das 61 respostas, percurso de 25 questões, 20 ditados,
callbacks tardios, bloqueios de áudio, variantes de escrita, conjuntos exatos, ordenação
reversível por mouse/teclado/toque, sessões independentes, limpeza seletiva, armazenamento
adverso, dez modelos opcionais, recusa simulada de microfone, três viewports, axe e file://.
O percurso completo já usa timeout individual de 120 segundos na origem; preservado.
O percurso longo de Matemática da Mariana mantém 180 segundos do PR #42.
CI continua com 120 minutos; workers, paralelismo e asserções preservados.

O teste central exige 66 cadastros/IDs/chaves únicos e os metadados de Transportes,
preservando as asserções dos cadastros anteriores. Auditoria local compara todos os 65
objetos completos com a base autorizada e os hashes dos ativos/conteúdo/testes com a origem.
A validação usa porta 5188, identidade confirmada e PDFs sintéticos oficiais.
Validação final da integração em 14/10/2026: próprios 19 passed (1.3m); regressões iniciais
133/134 (10,1 min), com única falha na asserção nova central (campo elementosExistem
ausente no esperado), corrigida sem alterar aplicação ou reduzir cobertura; reteste
1 passed (3.7s). Suíte global completa: **571 passed (40.0m)**, exit code 0.
Windows: 24/24 de abertura e 8/8 de launcher/pronúncia simulada. Build, format:check,
lint e diff aprovados. Porta 5188, identidade confirmada, um worker e PDFs sintéticos.
Sem Azure real, microfone, staging, commit ou publicação. Audição Windows, duplo clique
humano e uso infantil desta cópia permanecem pendentes.
Mocks não comprovam audição no Windows, Azure real ou utilização infantil.

### Ajuste direcionado após a CI #107 do PR #43 — 14/10/2026

A CI do commit `598da7ae2a59dd97cbfa7aad300f4c23282fb644` terminou 570/571,
com formatação e lint aprovados. O teste dos 20 ditados atingiu o timeout total de
30 segundos no clique de conferência do item 14, não um timeout individual de ação.
Log e trace mostram 14 áudios/13 escritas; o último clique durou cerca de 493 ms,
enquanto as conferências anteriores concluíram em 397–933 ms. Os registros de
instabilidade breve não demonstram um defeito persistente no botão.

Somente o teste `ditado separado, 20 escutas/escritas, variantes, revisão do estudo e
edição sem escuta fabricada` passa a declarar `test.setTimeout(120_000)`, seguindo
o percurso equivalente de 25 questões. Preservados todos os 20 itens, variantes,
conferências, verificações de áudio/escrita/progresso e asserções. Timeout global,
workers, controladores, áudio, dependências e workflow permanecem inalterados.

Validação local: **2/2 execuções direcionadas (17,0 s)** na porta 5188, com identidade
confirmada e um worker; build, format:check, lint e diff aprovados. Nenhuma global
local foi repetida: 571/571 permanece evidência histórica da versão anterior ao ajuste.
Nova CI completa será executada após autorização futura de push; este ajuste local
não inclui staging, commit ou publicação.

## Manifesto e métricas estruturadas — Etapa 1

A capacidade implementada está descrita em [validacao/README.md](../../../validacao/README.md).
O manifesto versionado mapeia a base de 66 revisões e 42 arquivos/571 casos, com motores efetivos,
capacidades, sessões, contratos e lacunas. `npm run validar:manifesto` verifica integridade e
descoberta; `npm run test:validacao` cobre o validador e o reporter com fixtures sintéticas.
O pretest global executa ambos e um único build.

O reporter adicional grava resultados sanitizados em `tmp/validacao/`, também em sucesso.
A CI retém essa saída por 14 dias com upload `always()`, preservando os diagnósticos em falha.
Execuções direcionadas registram seu próprio conjunto esperado; não exigem 571 casos.
Commit/árvore e alterações locais são distintos; duração não separa hooks/corpo artificialmente.

As associações agregadas, referências calculadas, gabaritos mistos, áudio próprio de Leitura e
a divergência do controlador declarado da Gramática ampla são limitações explícitas. Não houve
seleção, redução, promoção de maturidade, mudança de worker/timeout/retry/servidor, cadência ou
CI Windows. A global em toda PR e todos os gatilhos acima permanecem obrigatórios.

### Correções delimitadas da Etapa 1

A referência histórica continua imutável e protege presença de IDs/arquivos e chaves principais.
O catálogo atual deve coincidir integralmente com os registradores observados, sem duplicatas.
Acréscimos coerentes são permitidos. Expectativas atuais explícitas por arquivo (`expectedCases`)
e totais (`discovery`) são revisáveis, conferidas independentemente contra a descoberta completa.
Os 571 casos da base são contexto histórico, sem impor teto ou igualdade permanente.

O procedimento de acréscimo e os limites estão no [README](../../../validacao/README.md).
Remoções/renomes históricos e mudanças de chaves continuam falhando; mecanismo de transição
fica fora deste escopo. Contagens não congelam identidades ou semântica de todos os casos.
Execuções direcionadas do reporter permanecem aceitas. Global e check obrigatório preservados.

## Planejador observacional — Etapa 2

A capacidade local está em [validacao/PLANEJADOR.md](../../../validacao/PLANEJADOR.md).
`planejar:testes` exige comparação explícita entre refs ou base/worktree; `test:planejador` cobre
provas/impacto/identidades e `comparar:plano` confronta a hipótese com uma global estruturada.
São hipóteses explicáveis: não há comando de execução seletiva nem observação nova na CI.
`npm test`, o check obrigatório e todos os gatilhos globais permanecem integrais.

R1 exige prova AST e integração efetiva; R2 é restrito a SVG simples com consumidores resolvidos.
CSS, assets com lacunas, fontes compartilhadas, estrutura, infraestrutura, renomes/exclusões e
alcance incerto ampliam para global. O mapa por arquivo continua superset, sem alegação de
cobertura universal por caso. Audio de Leitura e estados próprios não são equiparados.
Identidade sem tratamento demonstrado ou relatório incompleto impede conclusão; durações
de tentativas são projeções condicionais, sem previsão de tempo seletivo ou certificação.

## Identidade de entradas e artefatos — Etapa 2.1

Na correção pontual A2, os testes do comparador cobrem descritores de manifesto ausentes em um ou
ambos os lados, nulos, vazios, malformados ou incompatíveis, além do par válido. Resultado e
`identity.manifestCompatible` usam a mesma verificação; manifesto inválido impede projeção.
Alterações de fontes/testes requerem revisão deliberada do corpus antes de renovar seu pin,
conforme [IDENTIDADE.md](../../../validacao/IDENTIDADE.md), sem reescrever evidências anteriores.

A [política comum versionada](../../../validacao/IDENTIDADE.md) é usada por reporter, planejador
e comparador. Formato 2 inclui bytes de recursos públicos e entradas sintéticas explicitamente
permitidas. Os 29 screenshots têm produtores, bloqueio HTTP e corpus de consumidores revisados
e fixados por hash. Não existe exceção geral para output/tmp; entrada prevalece sobre diagnóstico.
Mudança de fonte/configuração/SVG invalida o pin e exige nova revisão deliberada.

Git, entradas da worktree e artefatos têm identidades distintas. Fontes incompletas, desconhecidas,
instáveis ou incompatíveis impedem conclusão/projeção. Legados mantêm limitações e bytes originais.
As capturas de início/fim não são monitor contínuo; não editar durante a global. Privacidade,
suíte integral, check obrigatório e configuração de execução permanecem preservados.

Evidência real da Etapa 2.1: 52/52 Node, manifesto 66/42/571, abertura 2/2, harnesses 24/24 e
8/8; nova global 571/571 em 40,7 minutos (exit 0). Novo plano e relatório formato 2 são
comparáveis: 571 propostos, zero omitidos, entradas/política/manifesto estáveis e completos,
nenhum caminho sem tratamento. Projeção de tentativas com redução zero; sem estimar tempo
seletivo. Os 42 relatórios anteriores e a base histórica permanecem imutáveis. Esta anotação
documental foi feita após a coleta e não é apresentada como parte dos bytes testados.

## Histórico Git na CI — correção da PR #44

O checkout do workflow usa `fetch-depth: 0`, disponibilizando a base explícita
`14584b2fee618fc900bb3d5657b9cfa16482bf33` exigida pelo teste CLI e comparações históricas.
Na CI #110, o checkout raso impediu esse teste (54/55 Node); build e global Playwright
não chegaram a executar. A correção conserva a referência, as asserções, o check obrigatório,
Ubuntu, timeout, worker e `npm test` integral. A reatestação restrita do corpus está
documentada em [IDENTIDADE.md](../../../validacao/IDENTIDADE.md). A nova CI deve executar
a global completa e publicar o relatório estruturado; a falha antiga não comprova regressão
dos 571 casos não executados.

## Fase 5B.5 — validação intermediária do contrato global

A capacidade `infraestrutura-global-v1` requer testes Node de composição, identidade, Git/CLI,
comparação e preservação da adição v3, incluindo recusa sem revisão e contagens indisponíveis.
Positivos sintéticos não atestam a worktree real. Nesta fase intermediária, build, formatação,
lint, manifesto, diff e regressões direcionadas são exigidos; `npm test` integral fica para o
snapshot final deliberadamente reatestado e autorizado. A regra geral da global não foi removida.
