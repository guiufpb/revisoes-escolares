# Inventário local somente de leitura — ORG.4B

Integração opcional em memória: [adaptador puro ORG.6A](INTEGRACAO_EVIDENCIAS.md).
Converte a saída ORG.4D em envelopes v1, preservando fatos, lacunas e recusas.
Não muda esta CLI, coleta dados adicionais ou decide dispensabilidade.

CLI independente dos coletores de identidade. Não altera a política ORG v0.1, que permanece
preliminar. Não possui executor, persistência, classificação de descarte ou descoberta global.

Fonte auxiliar opcional: [registro de ciclo de vida ORG.5A](REGISTRO_WORKTREES.md).
Seu leitor é independente desta CLI; o envelope mínimo de evidências admite observações
de recursos sem registros históricos. Esta etapa não adiciona coleta/classificação ou
integração automática ao inventário.

Na raiz da cópia de desenvolvimento:

```powershell
node scripts/validacao/inventario-seguro.cjs --root "C:\caminho\worktree" --path package.json --path node_modules
node scripts/validacao/inventario-seguro.cjs --help
```

A raiz absoluta deve corresponder ao topo de uma worktree com HEAD válido. A saída JSON omite
o caminho absoluto e contém somente metadados e a procedência de cada informação. A CLI não lê
conteúdo dos recursos selecionados. Git lê seu índice, configuração e regras de ignore.

Cada caminho é explícito; diretórios não são enumerados. Arquivos são classificados pelo índice
ou pelas regras de ignore. Diretórios sem regra de ignore recebem
`directory-contents-unverified`: Git não rastreia diretórios individualmente. Caminhos ausentes
podem continuar rastreados no índice; ausência não prova exclusão deliberada.

Travessia com `..`, caminhos absolutos de recursos, streams Windows, controles, administração
`.git` e links em componentes do caminho são recusados. Symlinks/junctions reconhecidos por
`lstat` não são seguidos; destinos não são publicados. Erros são sanitizados. Consultas Git são
fixas, sem shell, limitadas por tempo/saída, com locks opcionais e fsmonitor desativados e sem
herdar variáveis `GIT_*` que redirecionem a consulta.

O estado de alterações, stashes, consumidores, regenerabilidade e redundância **não é
verificado**. Evita-se `git status`/diff de conteúdo, que pode acionar filtros configurados.
Não há promessa de snapshot atômico diante de mudanças concorrentes; tags exóticas de reparse
point não são certificadas por esta versão Node. A ferramenta não deve ser usada como fronteira
de segurança contra outro processo que modifique caminhos simultaneamente. Não concede
autorização de manutenção.

Testes direcionados: `node --test tests/validacao/inventario-seguro.unit.cjs`. Fixtures são
sintéticas em `tmp/inventario-unit-*` e `tmp/inventario-target-*` desta cópia; não usam materiais
escolares. Esta entrega não inclui rotina de limpeza dessas fixtures.

## Precisão e contrato de saída — ORG.4D

- `0`: `status=complete`, nenhum recurso recusado ou consulta falha. Ausência legítima
  (`type=absent`, `exists=false`) não é falha. `--help` também retorna 0.
- `2`: `status=partial`, ao menos um recurso com `issue`: recusa de caminho/vínculo,
  falha de metadados/Git ou correspondência indeterminada. Recursos válidos continuam no JSON.
- `1`: `status=fatal`, a operação não pode iniciar (argumentos, raiz ou Git indisponíveis).
  JSON com `exitCode=1` em stdout e mensagem sanitizada em stderr, sem reproduzir erros externos.

`exitCode` no JSON corresponde ao processo. `complete` significa conclusão dentro dos limites
de inspeção, não comprovação de independência, integridade ou dispensabilidade.

No Windows, esta versão admite somente raízes locais absolutas com letra de unidade.
UNC (`\\servidor\pasta`), prefixos estendidos e namespaces de dispositivo (`\\?\`, `\\.\`)
são recusados antes de consultas ao filesystem. Recursos absolutos, drive-relative (`C:arquivo`),
streams e componentes terminados em ponto/espaço são recusados. Separadores `/` e `\` são
normalizados; nomes iniciados por hífen ou `..` (como `..notas.txt`) são literais, sem autorizar
componentes de travessia `..`. Outros sistemas usam raízes nativas absolutas.

Respostas Git NUL preservam integralmente os nomes; somente respostas escalares perdem um
terminador de linha. No Windows, candidatos do índice são consultados sem distinção de caixa,
mas **não** se presume que o filesystem seja insensível: grafias não exatas exigem identidade
do objeto (device/inode não nulo) e caminho canônico nativo coincidentes. Objetos distintos não
são equiparados; evidência insuficiente, hardlinks com grafias canônicas distintas ou múltiplas
correspondências retornam `git=indeterminate`. `core.ignorecase` não fornece essa prova.

Testes incluem junction, worktree vinculada com `.git` em arquivo e comparação dos metadados
compartilhados antes/depois; casos de ambiguidade e filesystem sensível são simulados sem mudar
configurações do Windows. Timeout/limite de saída são falhas simuladas na fronteira Git, sem
forçar processamento desproporcional. Permanecem os limites de concorrência e reparse points
documentados acima. Não há nova capacidade de manutenção.
