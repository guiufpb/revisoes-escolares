# Dry-run operacional de capturas Playwright

Complemento inventarial independente da ORG.9B. Esta entrega observa apenas PNGs
de `test-results/`, sem conteúdo, pixels, hashes de imagens ou manutenção física.
Não altera nem amplia os classificadores sintéticos, o reporter ou o armazenamento escolar.

## Escopos de integração

A ORG.9B foi integrada à main pela PR #65, por squash no commit
`4550aba5fd1c27ed8ed67e7da2d28b3124b89283`, sobre a base
`a0da0ec0240a24facb17abb4be25a65ed5809f09`. Seus cinco arquivos já integrados
ficam inalterados e não compõem o diff desta segunda entrega:

- `scripts/validacao/avaliar-par-reporter.cjs`;
- `tests/validacao/avaliar-par-reporter.unit.cjs`;
- `validacao/AVALIACAO_PAR_REPORTER.md`;
- `validacao/CONSOLIDACAO_ORG.md`;
- `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`.

O lote novo contém somente este complemento inventarial e três arquivos novos:

- `scripts/validacao/inventariar-capturas-playwright.cjs`;
- `scripts/validacao/capturas-playwright-win.py`;
- `tests/validacao/inventariar-capturas-playwright.unit.cjs`.

Este registro separado preserva o escopo da ORG.9B já integrada, sem misturar alterações
no inventário principal. A integração do dry-run parte do squash da PR #65 e aplica
somente seu commit exclusivo; a atualização deste estado documental fica em commit
separado, sem alteração funcional. Evidências e capturas não integram nenhum dos lotes.
Publicação não concede autorização de merge ou limpeza.

## Uso e observação

```text
node scripts/validacao/inventariar-capturas-playwright.cjs
node scripts/validacao/inventariar-capturas-playwright.cjs --root RAIZ_ABSOLUTA_DA_WORKTREE
```

Saída JSON sanitizada e resumo legível, sem persistência obrigatória. O perímetro é
fixo; não aceita outro diretório. O responsável deve autorizar a raiz selecionada.
Não há quantidade obrigatória de PNGs nem descoberta de outras worktrees.
PNG é selecionado pela extensão e pelo tipo físico regular; o formato interno da
imagem não é validado, pois seu conteúdo não é aberto.

Para consultar somente o resumo sem percorrer a lista completa de recursos:

```text
node -e "const r=require('./scripts/validacao/inventariar-capturas-playwright.cjs').dryRun(); console.log(r.readableSummary); console.log(JSON.stringify(r.summary,null,2))"
```

Reutiliza ORG.4D e ORG.6A, em lotes de até 100 caminhos, com envelopes v1 intactos.
ORG.9B fornece a referência de reconferência, mantendo seu avaliador específico.
O auxiliar Windows é somente uma ponte de metadados: não recebe comandos de manutenção,
não cria recursos e não usa o backend de operações físicas reservado às fixtures ORG.8.
Importar aquele executor para examinar capturas preexistentes violaria seu perímetro.

Limites por descoberta: 500 entradas PNG, 4.096 entradas totais, 256 diretórios,
profundidade 8 e dez segundos. Python padrão, Windows de 64 bits. Plataforma ou
runtime indisponível produz resultado parcial, sem fallback que siga vínculos.
Recusa reparse points pelos atributos Windows, volumes diferentes e subrepositórios.
Usa identidades inteiras sem perda de precisão e handles com acesso a atributos,
compartilhamento completo e abertura sem seguir reparse no componente final.
Não lê dados de imagens. Confere identidade, tamanho e metadados antes/depois.

Alocação é `FILE_STANDARD_INFO.AllocationSize`, sem custo geral do filesystem.
Arquivos esparsos/comprimidos permanecem sem alocação certificada. Hardlinks e aliases
são bloqueados e contados uma vez por identidade; conflitos tornam os totais completos
indeterminados. Não arredonda valores fora da precisão numérica segura.

Duas descobertas nativas envolvem inventário e análise dos produtores. Alteração,
falha ou limite ficam explícitos e impedem tratar o escopo como completo. Isso não é
snapshot atômico, monitor contínuo ou fronteira contra troca hostil de caminhos.

## Produtores e decisões

Analisa somente seis fontes de testes predefinidas, por AST, sem executá-las. Uma
chamada `screenshot` com caminho literal completo dentro do perímetro sustenta uma
associação inferida do código. Não autentica a origem do arquivo nem o vincula a
uma execução. Caminhos dinâmicos, `testInfo.outputPath`, basenames e nomes de pastas
não são resolvidos por adivinhação. Associações ambíguas ou incompletas bloqueiam.

- **Protegido:** arquivo rastreado pelo Git, independentemente de sinais favoráveis.
- **Bloqueado:** vínculo, identidade/metadados inadequados, conflito, escopo parcial,
  inventário insuficiente ou produtor não resolvido.
- **Somente revisão humana:** PNG regular estável, não rastreado, com associação única
  sustentada pelo código. Isso não significa elegibilidade ou dispensabilidade.

O upload de diagnóstico da CI e a revisão humana são consumidores previstos/possíveis;
ferramentas externas e processos concorrentes permanecem desconhecidos. Sucesso anterior
não libera dependências, e gerar outra imagem não demonstra regeneração byte a byte.
Relatórios/traces e arquivos não PNG ficam fora da avaliação e são preservados.
`recoverableBytes=null` e `cleanupAuthorization=none` são invariantes de toda saída.

`complete/0` indica observação concluída, ainda que haja bloqueios de procedência.
`absent/0` distingue diretório ausente. `partial/2` expõe falhas, limites ou instabilidade;
os números observados não são apresentados como totais completos nesses casos.

## Validação e evidência inicial

Primeira observação real: 179 PNGs regulares, 32.101.557 bytes nominais e 32.497.664 bytes
de alocação informada, duas chamadas de inventário para os arquivos. Um recurso de
211.450 bytes ficou somente para revisão humana; 178 recursos, somando 31.890.107 bytes,
ficaram bloqueados por procedência não resolvida. Nenhuma elegibilidade física foi concedida.
As capturas conservaram seus metadados durante a observação. Custo inicial: cerca de 19,7 s.

Os testes novos usam dados em memória e fixture nativa fictícia isolada, preservada
sem limpeza. A global precisa rodar numa cópia técnica isolada: testes legados gravam
caminhos fixos em test-results, portanto somente mudar a saída do Playwright não
preservaria as capturas reais. Não copiar capturas ou evidências privadas para essa cópia.
Validação final em 04/11/2026:

- 19/19 testes novos aprovados; sintaxe Python aprovada.
- Build, formatação, lint e diff aprovados.
- Global na cópia curta: exit code 0, 667/667 Node e 638/638 Playwright (44,8 min),
  um worker, porta 5189 e identidade confirmada. Na data dessa execução, a composição
  local incluía a ORG.9B ainda não publicada; esse resultado histórico não representa
  execução da CI da segunda PR, cuja base agora contém a ORG.9B integrada pela PR #65.
- A primeira cópia, profundamente aninhada, encerrou em 663/667 Node com quatro falhas
  históricas de Git/CLI e mensagens `Filename too long`. A execução e seus logs foram
  preservados. A repetição mudou somente a localização, sem alterar código ou testes.
- Os fontes técnicos da cópia isolada foram conferidos contra os da worktree de origem.
  Os cinco arquivos pendentes da ORG.9B conservaram seus hashes de código/documentação.
- Reconferência final dos PNGs reais: mesmas 179 identidades, tamanhos e metadados da
  observação inicial, sem leitura de conteúdo ou hashes de imagens. O resultado agregado
  permaneceu igual; a execução final levou aproximadamente 20,4 s.

Logs e snapshot técnico ficam no `tmp/` de cada cópia de validação, fora dos lotes
versionáveis. Esta anotação dos resultados é posterior à global; código e testes
não foram modificados depois do snapshot aprovado. Nenhum artefato foi removido.

Próxima evolução recomendada, sem implementação nesta entrega: vínculo explícito entre
captura e execução produtora, para reduzir os bloqueios de procedência. Não começar
transferência entre volumes ou limpeza com base nas contagens deste dry-run.
