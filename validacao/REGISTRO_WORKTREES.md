# Registro privado do ciclo de vida — ORG.5A

Capacidade auxiliar e independente do inventário ORG.4B/4D: schema JSON versionado,
validação sem mutação e leitor exclusivamente de leitura. Nenhum campo, incluindo
`completed` ou `closed`, concede autorização de limpeza. Não há classificador,
simulação, quarentena, exclusão, movimentação, escritor ou reconstrução de histórico.

## Localização e uso

Diretório central privado reservado: `~/.revisoes-escolares/worktree-lifecycle/`,
fora de todas as checkouts, catálogos e diretórios servidos/exportados. `~` significa
o diretório pessoal do usuário, resolvido por `os.homedir()`; a CLI não expande `~`
recebido como argumento. Um arquivo por worktree; recomenda-se `<worktreeId>.json`.
Não existe índice central duplicado. Não muda `copyId`, identidade HTTP nem
`MINHAS_REVISOES_LOCAIS`. Permissões de acesso desse diretório são responsabilidade
do usuário; esta etapa não cria diretório, arquivo real ou ACL.

```powershell
node scripts/validacao/registro-worktrees.cjs
node scripts/validacao/registro-worktrees.cjs --records-dir "C:\pasta-privada\worktree-lifecycle"
node scripts/validacao/registro-worktrees.cjs --help
node --test tests/validacao/registro-worktrees.unit.cjs tests/validacao/inventario-seguro.unit.cjs
```

O override exige seleção explícita e deve continuar privado, externo ao repositório;
não há descoberta global. Somente os testes apontam para fixtures sintéticas em `tmp/`.
Não copie registros reais para fixtures, Git, bundles, relatórios públicos ou HTTP.
O leitor não cria nem preenche registros das worktrees existentes. Diretório ausente
retorna `directory=absent`, `coverage=unknown`; não representa ausência de trabalho.

## Contrato JSON v1

[Schema](registro-worktree.schema.json), complementado por `validateRecord`, e
[exemplo sintético completo](../tests/fixtures/registro-worktree-sintetico.json).
Todos os objetos são fechados: propriedades desconhecidas são recusadas.

```json
{
  "schemaVersion": 1,
  "worktreeId": "11111111-1111-4111-8111-111111111111",
  "recordedAt": "2026-11-02T12:00:00Z",
  "location": null,
  "purpose": "Exemplo sintético",
  "task": { "id": "ORG.EXEMPLO", "title": "Tarefa fictícia" },
  "phase": "implementation",
  "declaredState": "active",
  "observations": []
}
```

- Obrigatórios: os nove campos do exemplo. `null` significa desconhecido em
  `location`, `purpose`, `task`, `phase` e `declaredState`; não há valores padrão inferidos.
- `worktreeId`: UUID v4 canônico, minúsculo. Na futura criação explícita, gerar uma vez
  com `crypto.randomUUID()` e persistir no registro, preservando-o em retomadas,
  mudança de branch, localização ou nome do arquivo. Não derivar de caminho, `copyId`
  ou HEAD; não regenerar em leitura. Esta versão só lê/valida IDs já fornecidos.
- `recordedAt`: instante declarado de atualização, UTC, segundos, `YYYY-MM-DDTHH:mm:ssZ`;
  datas impossíveis são recusadas. Não comprova atualidade do estado do filesystem.
- `location`: caminho absoluto local ou `null`; validado lexicalmente e nunca acessado.
- `purpose`: texto de até 500 caracteres; `task`: `id` até 100 e `title` até 300.
- `phase`: `planning`, `implementation`, `validation`, `delivery`, `integration`, `closed`.
  `declaredState`: `active`, `paused`, `completed`. Fase e estado são declarações distintas.
- `observations`: até 50 notas com UUID `id` próprio, `topic`, `text` (até 1000),
  `recordedAt` e `supersedes` (UUID anterior ou `null`). Tópicos: `purpose`, `task`,
  `phase`, `declaredState`, `location`, `dependency`, `history`, `general`.
  Referência deve apontar para nota anterior do mesmo tópico, sem inverter datas;
  notas não podem ser posteriores à atualização do registro. IDs repetidos, ciclos e
  referências ausentes são recusados. Notas anteriores são preservadas; ramificações
  conflitantes continuam declarações para reconciliação humana futura. O leitor não
  escolhe uma nota vencedora nem altera os campos de topo.
- `dependencies` opcional: até 50 referências `{kind,target,reason}`. `kind=worktree`
  usa UUID v4 de outra worktree; `kind=resource` usa caminho absoluto local. `reason`
  tem até 300 caracteres. Não resolve referência nem prova disponibilidade/consumidores.
- `history` opcional: até 50 referências `{kind,reference,note}`. `kind` aceita
  `commit`, `pull-request`, `local-evidence`; referência opaca até 500 e nota até 300.
  Não abre arquivos/URLs, executa comandos ou confirma existência/autenticidade.

Ausência de `dependencies`/`history` é desconhecida; lista vazia só declara que
nenhuma referência foi informada, nunca prova inexistência real. Textos não admitem
controles, são dados inertes e jamais devem ser interpretados como comandos/instruções.
Validação estrutural não comprova verdade, preservação recuperável ou dispensabilidade.

## Leitura, diagnósticos e limites

API: `inspectRecords(directory?)`, `validateRecord(record)`, `recordEvidence(record)`
em `scripts/validacao/registro-worktrees.cjs`; `validateEvidence(evidence)` fica no módulo
independente `scripts/validacao/evidencia-organizacao.cjs`.
Schemas são código confiável do repositório; arquivos privados são dados não confiáveis.
O validador semântico complementa os schemas, sem coerção, defaults ou remoção de campos.

- `0`: leitura concluída dentro do escopo; registros válidos ou diretório ausente.
- `2`: parcial; há registro inválido/ilegível/recusado. Os demais continuam utilizáveis.
- `1`: fatal; argumento/diretório inválido, indisponível/vinculado ou enumeração além do limite.

`reportVersion=1`, `exitCode` corresponde ao processo. `directory` distingue `present`,
`absent` e `unknown`; `coverage=listed` só confirma enumeração limitada do diretório,
não completude histórica. `records[].status` distingue `valid` e `invalid`.
Campos nulos e fontes opcionais ausentes aparecem em `records[].unknown`; estado atual,
completude histórica e disponibilidade das dependências permanecem em `unknown` global.
UUIDs duplicados detectáveis invalidam **todos** os envolvidos, mesmo se um deles tiver
estrutura inválida. Arquivos ilegíveis não permitem verificar seus IDs; `partial`
nunca deve ser consumido como unicidade/completude global comprovada.

Diagnósticos usam códigos fixos e posições `slot`, sem nomes privados, caminhos,
textos, propriedades desconhecidas ou erros nativos. A projeção inclui UUID válido,
fase/estado enumerados e presença de finalidade/tarefa/localização; textos e caminhos
permanecem somente no registro privado. Não usar a projeção para inferir o conteúdo
dessas declarações ou a existência de uma localização.

Máximo de 100 entradas (incluindo inválidas), 64 KiB por arquivo, 1 MiB lido por
invocação, sem recursão. Nomes aceitos: 1–80 letras ASCII/dígitos/hífen/underscore e
`.json`. UTF-8 inválido, JSON inválido e tipos/tamanhos/versões inválidos são recusados.
Os limites de arrays/strings são os do schema; tamanho em bytes é aplicado antes do parse.

Reutiliza os padrões do inventário: raiz explícita, `lstat` por componente, recusa de
UNC/dispositivo/ADS/travessia/controles/nomes perigosos, erros sanitizados e ausência de
execução de conteúdo. Symlinks/junctions identificados por `lstat` não são seguidos;
hardlinks e objetos que não sejam arquivos regulares também são recusados.
Abre somente com flags de leitura, `O_NOFOLLOW` quando disponível, confere identidade e
metadados antes/depois e limita o buffer. Não consulta Git, targets declarados ou catálogo.

Não oferece snapshot atômico ou fronteira contra troca concorrente de caminhos por
outro processo. Tags exóticas de reparse point não são certificadas por Node; não
usar em diretório hostil/compartilhado. O acesso pode atualizar atime por política do
filesystem; não há chamada de escrita. Fixtures verificam hashes, entradas, tamanho,
mtime e flags de abertura, além de negar funções mutadoras durante a leitura.
Não há limpeza automática das fixtures sintéticas.

## Contrato mínimo de evidências para ORG.6A

[Envelope independente v1](evidencia-organizacao.schema.json), com validação semântica
em `scripts/validacao/evidencia-organizacao.cjs` (`validateEvidence`). Esse módulo não
importa o leitor nem o schema de registros. Não exige schema de ciclo de vida, catálogo, UUID de worktree
para recursos ou registros ORG.5B–5D. Cada evidência contém:

```json
{
  "evidenceVersion": 1,
  "subject": { "kind": "resource", "id": "resource-sintetico-1" },
  "source": "resource-observation",
  "fact": "resource-exists",
  "knowledge": "observed",
  "value": false,
  "observedAt": "2026-11-02T12:00:00Z"
}
```

`subject.id` é identificador opaco, sem caminho, com 1–100 caracteres ASCII de
letras/dígitos/hífen/underscore. Fonte `lifecycle-record` exige `kind=worktree` e UUID
v4; fatos `purpose`, `task`, `location` projetam só `present`; `phase`/`declaredState`
projetam seus enums. Conhecimento é `declared`, nunca observação do estado real.
Fonte `resource-observation` exige `kind=resource`; fatos independentes:
`resource-exists` (boolean), `resource-type` (`file`, `directory`, `absent`, `other`),
`resource-git` (`tracked`, `ignored`, `untracked`, `indeterminate`,
`directory-contents-unverified`). Conhecimento é `observed`.
Para ambas as fontes, `knowledge=unknown` exige `value=null` e `observedAt=null`.
Conhecimento declarado/observado exige valor e data; as correlações são verificadas
pelo validador. Não há campo de autorização nem transformação de declaração em prova.

ORG.6A pode começar com adaptador pequeno do resultado ORG.4D para esses fatos de
recursos simples, preservando erros/indeterminação como desconhecidos. Pode consumir
opcionalmente `recordEvidence`, mantendo procedência, sujeito e data, sem importar
schema completo de registro. Falta de registro não impede observação independente e
não deve produzir inferência favorável à limpeza. O futuro classificador terá de
tratar conflito, idade da evidência e lacunas explicitamente, em escopo próprio.

Menor próximo incremento: adaptador puro e testado de ORG.4D para o envelope v1,
sem classificar ou executar manutenção. A autoria/atualização transacional de registros
reais continua separada (ORG.5B), com preservação de UUID e histórico e ação explícita.

## Resultado da validação desta entrega

Base de implementação: `dfa1b0afb99c8ccd4db3f179fd89a6b9f6922a20` (PR #63),
branch isolada `codex/org-5a-registro-worktrees`. Sem commit ou publicação.

- `npm run build`, `npm run format:check`, `npm run lint` e `git diff --check`: aprovados.
- Direcionados do registro e inventário: 29/29 na rodada anterior à inclusão da
  regressão adicional de independência do módulo de evidências.
- `npm test`: exit code 0; 438/438 testes Node (incluindo os 17 da ORG.5A) e
  638/638 Playwright, estes em 46,0 minutos, um worker, porta 5189 e identidade
  da worktree confirmada. PDFs sintéticos oficiais, sem reutilizar servidor de estudo.
- Integridade/ausência de escrita: hashes, metadados, entradas e flags de abertura;
  regressões de vínculos, duplicação, limites, falhas de leitura e sanitização aprovadas.

Log integral local: `tmp/org5a-global.log`. Previews produzidos pela suíte ficam em
`output/`, fora do lote de implementação; não foram removidos ou preparados para Git.
Warnings de armazenamento corrompido/bloqueado pertencem aos cenários adversos do harness.
O build também emite o aviso existente de resolução de `pdfjs-wasm` em runtime.
Não há validação humana de registros reais nem alegação de completude histórica.
