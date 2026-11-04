# ORG.6A — adaptação pura do inventário

A etapa seguinte [ORG.6B](CLASSIFICADOR_SINTETICO.md) usa este contrato sem alterá-lo
para reconhecer uma única classe dentro de um harness sintético fechado. Não autoriza
limpeza nem amplia as provas disponíveis sobre recursos reais.

`scripts/validacao/inventario-evidencias.cjs` exporta `adaptInventory(report, context)`.
Recebe dados JSON em memória da ORG.4D e produz evidências v1 já verificadas pelo
validador independente da ORG.5A. Não coleta recursos, executa Git, consulta filesystem,
obtém a hora atual ou persiste dados. Não classifica, simula ou executa limpeza.
O schema `evidencia-organizacao.schema.json` permanece inalterado.

## Base e isolamento

Base Git: `dfa1b0afb99c8ccd4db3f179fd89a6b9f6922a20`, com ORG.4D. A ORG.5A
não estava publicada nem commitada. Seus dez arquivos de implementação/documentação
foram incorporados por patch Git em worktree própria `codex/org-6a-integracao-evidencias`,
com índice temporário, sem modificar o índice original, criar commit ou fazer merge.
Conferência inicial: 10/10 hashes de bytes idênticos à entrega local ORG.5A.
Patch e hashes de origem ficam em `tmp/org5a-base.patch` e `tmp/org5a-base-hashes.json`.
Não foram transferidos node_modules, logs, previews, registros reais ou arquivos escolares.
As alterações posteriores da ORG.6A são código/testes novos e documentação explícita.

## Uso e contrato

```js
const { adaptInventory } = require('./scripts/validacao/inventario-evidencias.cjs');
const adapted = adaptInventory(reportOrg4D, {
  observedAt: '2026-11-02T12:00:00Z',
  resourceIds: ['recurso-sintetico-1'],
});
```

`context.observedAt` é a data da inspeção fornecida pelo chamador, UTC em segundos;
não a hora de conversão. Não é deduzida de HEAD/mtime nem preenchida automaticamente.
Sem data válida, recusa a adaptação. `resourceIds` associa, pela posição, um ID opaco
a cada recurso. IDs são únicos no lote, 1–100 caracteres ASCII de letras/dígitos/
hífen/underscore; não contêm caminhos. Cabe ao chamador preservar o vínculo e o escopo
dos IDs entre inspeções; o adaptador não inventa identidade persistente ou índice.
Todos os argumentos devem ser dados JSON simples, sem getters, proxies ou métodos.

A entrada ORG.4D não tem versão explícita. Esta versão aceita somente o contrato
conhecido daquela implementação: campos, enums, procedências, diagnósticos e relações
de status/código de saída, até 100 recursos. Campos/versões/diagnósticos novos exigem
revisão explícita. Não presume compatibilidade futura a partir do nome da ferramenta.
Entrada estruturalmente incompatível invalida o lote, sem aproveitar observações
potencialmente contraditórias; inspeção **parcial válida** preserva todos os recursos.

Saída auxiliar `adapterVersion=1`, separada do envelope de evidências:

- `source=ORG.4D`, `sourceStatus`, `sourceExitCode`: procedência e resultado da inspeção.
- `status`: `complete`/`partial` preservam o resultado da inspeção; `refused` preserva
  o fatal ORG.4D, sem inventar recursos; `incompatible` indica entrada/contexto recusado.
  Não é código de processo: o adaptador é função sem CLI.
- `diagnostics`: códigos fixos de incompatibilidade ou recusa fatal conhecida.
- `resources`: `slot`, `subjectId`, cópia de `provenance`, `inspection` com tipo/Git/
  existência/bytes conhecidos (ou `null`), `diagnostics` e três `evidence` por recurso.
- `unknown`: alterações da working tree, stashes, consumidores, conteúdo de diretórios,
  regenerabilidade, redundância e completude histórica não foram comprovados.

Não devolve caminho do recurso, label/branch/HEAD privados, mensagens externas ou
textos livres de `limits`. Preserva as limitações em códigos fixos e nesta documentação.
`inspection` conserva as observações sanitizadas originais; não equivale a fatos novos.
Desconhecidos no envelope têm `knowledge=unknown`, `value=null`, `observedAt=null`.

| Observação ORG.4D                                           | Fato no envelope independente                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `exists=true/false`, metadados conhecidos                   | `resource-exists`, observado, com a data fornecida                                 |
| `file/directory/absent/other`                               | `resource-type`, observado                                                         |
| `tracked/ignored/untracked/directory-contents-unverified`   | `resource-git`, observado, sem inferir dispensabilidade                            |
| Git indeterminado/falho                                     | Git desconhecido; metadados anteriores válidos preservados; diagnóstico conservado |
| caminho recusado, link bloqueado ou metadados indisponíveis | três fatos desconhecidos; recusa/diagnóstico e procedência disponíveis preservados |

Ausência legítima usa `resource-exists=false` e
`resource-type=absent`; pode coexistir com `resource-git=tracked`. `complete` significa
inspeção concluída no escopo. `ignored` não comprova regenerabilidade ou ausência de
trabalho. `directory-contents-unverified` mantém desconhecido o conteúdo do diretório.
Nenhum desses estados autoriza descarte. Links bloqueados não são convertidos em
recurso ausente ou tipo de destino observado.

## Segurança, testes e limitações

```powershell
node --test tests/validacao/inventario-evidencias.unit.cjs tests/validacao/inventario-seguro.unit.cjs tests/validacao/registro-worktrees.unit.cjs
```

Fixtures exclusivamente sintéticas. Os testes verificam determinismo, inputs congelados,
ausência de referências mutáveis compartilhadas, recusa de contratos incompatíveis,
casos completos/parciais/recusados/ausentes/indeterminados e conformidade de cada envelope.
Chamadas de IO/execução e relógio atual são bloqueadas durante a conversão em um teste.
Outro teste usa o coletor ORG.4D real com serviços inteiramente sintéticos, sem executar Git
ou filesystem, para conferir a ligação entre os contratos. O carregador de módulos Node
carrega os schemas confiáveis no início; isso não é leitura de recursos pelo adaptador.

Os limites da inspeção continuam valendo: sem snapshot atômico, leitura de conteúdo,
descoberta de consumidores ou prova de independência. Data/identidade são fornecidas,
não autenticadas. A adaptação não verifica novamente o estado físico, não reconcilia
histórico com observação e não faz correspondência automática entre sujeitos distintos.
Inspeção parcial/incompatível nunca deve ser tomada como cobertura completa.

## Menor passo seguinte

Criar um reconhecedor puro e conservador de **uma classe fechada de temporários sintéticos
gerados por um harness próprio**, com corpus e exemplos negativos. O harness precisará
fornecer prova explícita de origem, escopo exato, regenerabilidade e ausência de dependências;
os três fatos deste envelope, sozinhos, não comprovam essas condições.
Nome/extensão, idade, localização em `tmp`, status ignored ou arquivo ausente não bastam.
Falta, conflito ou recusa de evidência deve resultar em desconhecido/recusado, sem candidato
favorável. Essa etapa pode reconhecer a classe sem decidir exclusão, sem executar ações e
sem ampliar o schema até demonstrar quais evidências adicionais são realmente necessárias.

## Validação da implementação

Build, formatação, lint e diff aprovados. Direcionados: 44/44 Node, incluindo
14 casos novos do adaptador, 13 do inventário e 17 da ORG.5A. Nenhum schema de
evidências ou código dos coletores foi alterado pela ORG.6A.
A suíte global desta composição (`npm test`) terminou com exit code 0: 452/452 Node
e 638/638 Playwright, em 45,6 minutos de Playwright, um worker, porta 5189 e identidade
da worktree confirmada. PDFs sintéticos oficiais, sem reutilizar servidor de estudo.
Log local: `tmp/org6a-global.log`. Os warnings de armazenamento corrompido/bloqueado
pertencem aos cenários adversos do harness; o build preserva o aviso existente de
resolução de `pdfjs-wasm` em runtime. Previews gerados em `output/` foram preservados
fora do lote de implementação. Nenhum registro privado real foi consultado ou criado.
