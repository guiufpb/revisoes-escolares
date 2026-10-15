# Manifesto e resultados de validação — Etapa 1

Esta pasta contém **metadados de validação**, sem perguntas, respostas, textos pedagógicos ou
progresso. Não é seletor: a global de toda PR, os gatilhos R0–R4 e a cadência vigente permanecem.
Os motores, a interface infantil, o servidor, os workers, os retries e os timeouts foram preservados.

## Arquivos e manutenção

- `manifesto.json`: versão do mapa, revisões, motores efetivos, capacidades, contratos, testes,
  sessões/chaves e lacunas. `manifesto.schema.json` é o schema fechado JSON Schema draft-07.
- `base-14584b2.json`: referência independente extraída do registro e da árvore do commit
  `14584b2fee618fc900bb3d5657b9cfa16482bf33`, com os 66 IDs/chaves, 42 arquivos e 571 casos.
  O validador verifica seu digest semântico congelado. Esta referência é imutável;
  não deve ser regenerada para fazer uma divergência desaparecer.
- `scripts/validacao/fontes.cjs`: observa os registradores reais em contexto sem DOM, áudio,
  armazenamento, rede ou inicialização do app. Não reproduz os motores. Só deve ler código
  confiável da checkout; `node:vm` não é sandbox de segurança para fontes externas.
- `scripts/validacao/manifesto.cjs`: valida o schema, a referência independente, arquivos,
  relações recíprocas, capacidades/sessões observadas e descoberta completa do Playwright.
- `scripts/validacao/catalogo.cjs`: identidade lógica e resolução das exceções por título.
- `scripts/validacao/reporter.cjs`: reporter adicional; preserva os reporters line/HTML e traces.

Ao mudar conteúdo/configuração, revise fontes efetivas, capacidades, sessões, dependências,
testes e evidências. As fontes e o manifesto devem concordar; o validador nunca os reescreve.
Chaves auxiliares são únicas; alias da sessão principal precisa ser idêntico à chave principal.
Exceções de colisão só podem ser históricas, com participantes exatos, justificativa e referência.
Não há exceção de colisão ativa cadastrada na base.

Cada revisão registra evidência disponível, lacunas e maturidade **não avaliada**. Candidatura
futura não concede elegibilidade. Coleção histórica permanece `not-configured`, separada da
maturidade. Os relatos humanos do inventário são históricos e não equivalem a certificação
versionada das 66 revisões.

## Referência histórica, catálogo atual e expectativas atuais

São três verificações distintas:

1. **Preservação histórica:** os 66 IDs/chaves e 42 arquivos de `base-14584b2.json` devem
   continuar presentes. Seus 571 casos são contexto histórico, sem fixar o tamanho futuro da suíte.
   O arquivo e seu digest semântico permanecem congelados.
2. **Catálogo atual:** o manifesto e os registradores observados devem conter exatamente os mesmos
   IDs, sem duplicatas em nenhum lado. As verificações de chaves, fontes, capacidades, sessões,
   classificações e relações recíprocas continuam obrigatórias, também para acréscimos.
3. **Expectativas atuais:** cada entrada em `tests` exige `expectedCases`, número explícito
   de instâncias esperadas naquele arquivo na descoberta completa. `discovery.fileCount` deve
   corresponder ao número de entradas; `discovery.caseCount` deve corresponder à soma de
   `expectedCases` e à descoberta. Cada arquivo também é conferido individualmente.
   Hoje são 42 arquivos e 571 casos. Esses valores ficam versionados no manifesto, não são
   calculados da descoberta para substituírem automaticamente o esperado durante a validação.

### Procedimento de acréscimo

- Acrescente a revisão às fontes reais e ao manifesto, com chave própria, metadados, evidências,
  sessões, dependências, testes e consumidores recíprocos. Nenhum registro histórico é removido.
- Para arquivo novo, inclua classificação, associações e `expectedCases`; atualize as relações
  de revisão/teste e `discovery.fileCount`/`discovery.caseCount`.
- Para casos novos em arquivo existente, revise as classificações e regras/padrões aplicáveis,
  atualize `expectedCases` desse arquivo e o total atual. Padrões com contagem própria continuam
  exigindo manutenção de `expectedMatches`. Defaults continuam sendo classificações agregadas.
- Revise as expectativas explicitamente contra a mudança pretendida, rode a validação e os testes
  aplicáveis. O validador é somente leitura; não oferece regeneração de expectativas nem da base.

### Remoções, renomes e limites

Remoção/renome de ID ou arquivo histórico e mudança de chave principal histórica falham mesmo
quando manifesto e fontes atuais concordam. Não existe mecanismo de transição/migração nesta
etapa; uma necessidade legítima requer tratamento deliberado em escopo futuro, sem editar a base
para silenciar o diagnóstico. A base protege presença dos arquivos, não hashes de seu conteúdo
nem identidade de cada caso histórico. Expectativas por quantidade não detectam substituição de
um caso por outro com a mesma contagem quando ambos usam defaults válidos. Regras por título
continuam verificadas, mas não representam uma lista congelada dos 571 casos.

A classificação por arquivo e a expectativa numérica não comprovam cobertura semântica de cada
caso, nem impedem uma manutenção manual incorreta dos metadados; dependem de revisão humana.
O reporter continua usando o conjunto filtrado da invocação: testes direcionados são válidos
sem cumprir os totais da descoberta completa, conferidos pelo validador.

## Casos e precisão

Os 42 arquivos têm metadados agregados e regras de exceção. Os padrões são ancorados, têm
contagem esperada e são conferidos contra a descoberta real; regras sobrepostas, títulos
completos duplicados, referências sem correspondência e classificações incompatíveis falham.

O ID lógico é SHA-256 de `[arquivo relativo, caminho de títulos]`; não usa linha, ordem, duração
ou ID nativo. Renomear título/arquivo muda a identidade, exigindo manutenção deliberada. Projeto
e repetição identificam instâncias distintas da mesma identidade lógica. Linhas são apenas
localização da descoberta e não são persistidas como identidade.

As classes distinguem declaração, contrato, percurso de questões/bloco, percurso parcial,
estado preparado, navegação administrativa e visual/acessibilidade. Percurso completo de questões
não implica vocabulário estudado nem PDF lido integralmente na mesma invocação. Oráculos são
independentes, da aplicação, mistos ou não aplicáveis; cadastro que inspeciona respostas não
transforma um percurso independente em autorreferente.

`file-conservative-superset` declara associação agregada por arquivo. Não afirma que cada caso
protege todas as revisões/capacidades associadas. Exceções com `metadata.revisions` refinam essa
associação por caso. Essa limitação bloqueia qualquer alegação de mapa completo para seleção.

## Comandos

```text
npm run validar:manifesto
npm run test:validacao
npm run build
npm run format:check
npm run lint
npm test
```

O pretest da global valida o manifesto, executa os testes Node da infraestrutura e faz um único
build. Os novos testes usam `.unit.cjs`, fora do padrão de descoberta Playwright; não alteram os
42 arquivos/571 casos existentes. Os comandos de formatação e lint incluem explicitamente os
novos scripts, testes e configuração; JSON/schema e workflow também entram na formatação.

Execuções direcionadas legítimas continuam aceitas, por exemplo:

```text
npx playwright test tests/infra-abertura-local.spec.js
```

Use a porta exclusiva via `PLAYWRIGHT_PORT`, conforme a política temática. O reporter não
exige 571 casos nessas invocações. A descoberta de integridade usa `--list --reporter=json`;
não executa testes, build ou servidor.

## Relatórios e privacidade

Cada invocação cria `tmp/validacao/<horário-UTC>-<UUID>/`:

- `run.json`: schema/versionamento, Git, fingerprint do manifesto/fontes, ambiente/configuração,
  conjunto descoberto/esperado da invocação, casos, tentativas, contagens e resultado final.
- `attempts.jsonl`: evento sanitizado por tentativa, gravado imediatamente. Se houver término
  abrupto antes de `onEnd`, o snapshot fica `complete:false`; os eventos preservam os resultados
  já recebidos. Não interpretar snapshot incompleto como aprovação.

O estado modificado é identificado explicitamente. Commit/árvore representam a base Git;
mudanças não commitadas recebem fingerprint separado das fontes/configurações permitidas.
A política atual de entradas inclui recursos públicos e entradas geradas explícitas, preserva a
privacidade e separa diagnósticos; não é árvore Git. A captura no
fim detecta mudanças durante a execução. Nenhuma identidade de árvore limpa é atribuída a uma
checkout modificada.

O esperado é o conjunto entregue pelo runner **após os filtros da invocação**; não é uma prova
independente de execução global. `inventoryBaseCount` preserva 571 como contexto separado.
`expected`, `executed`, `skipped`, `notExecuted`, resultados inesperados, retries e interrupções
são distintos. Casos com resultado esperado, inclusive eventual falha esperada, são contados em
`passed` conforme `test.outcome`; as tentativas mantêm status e `expectedStatus` originais.

`durationMs` de tentativa e duração total vêm do Playwright. Não há separação inventada de hooks,
preparação e corpo. O total do runner não inclui o build/pretest npm. Versão do navegador, quando
disponível, vem dos metadados do pacote; a versão do processo real não é observada pelo reporter.

Não são coletados progresso, respostas, áudio, credenciais, stdout, attachments, stacks nem
mensagens livres de erro/skip. Falhas têm categoria, fingerprint e orientação para os diagnósticos
existentes. Os relatórios são ignorados pelo Git por estarem em `tmp/`.

A CI continua executando `npm test` no check **Formatação, lint e testes**, em Ubuntu, com a
configuração/fixtures vigentes. Um upload adicional `always()` retém resultados estruturados por
14 dias. O upload de diagnósticos em falha e seu prazo de 14 dias foram preservados. Falha antes
da inicialização do runner pode não produzir relatório; ausência de artefato não vira aprovação.

## Achados e limites preservados

- 20 consumidores efetivos do questionário compartilhado e três fluxos próprios; o metadado
  declarado da Gramática ampla da Mariana diverge do controlador efetivo. Aplicativo preservado.
- Matemática de setembro da Mariana copia o registro da Alice e exige ordem de carregamento.
- Unit 3, Friends e os livros compartilham conteúdo entre perfis; sessões têm progresso separado.
- Inglês com subitens usa `QuestionariosInteracoes.mesmoConjunto`.
- Ditado de Leitura usa implementação própria, sem equivalência presumida com `audio.js`.
- Auxiliares não são IDs adicionais do catálogo.
- Assets literais são caminhos resolvidos relativos ao HTML principal. Referências por basename,
  caminhos calculados e consumidores de CSS continuam lacunas explícitas, sem falsa completude.
- O caso “conclui Q25–Q30” executa Q30 após estado preparado; Centenas usa `irPara` para navegar.
- Não há promoção de maturidade, seleção, alteração de cadência ou CI Windows nesta entrega.

Os harnesses Windows de 24 e oito cenários continuam separados do workflow Ubuntu. Esta mudança
não usa microfone, Azure real, documentos privados ou servidores de estudo. Testes automatizados
não comprovam acústica, ergonomia ou validação pedagógica humana.

## Planejamento observacional — Etapa 2

O [planejador local](PLANEJADOR.md) explica hipóteses por risco/impacto, com fallback conservador.
Ele não executa recortes e não modifica a política global. Comparações de identidade/cobertura
e projeções condicionais são separadas da execução obrigatória.

## Identidade compartilhada — Etapa 2.1

A [política de identidade](IDENTIDADE.md) substitui a allowlist antiga, inclui bytes de assets
públicos e separa os 29 diagnósticos comprovados. Formato 2 e política 1.0.0 exigem nova coleta;
relatórios antigos preservam suas limitações. Caminhos desconhecidos bloqueiam comparação.
