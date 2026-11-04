# ORG.9B — observação delimitada do par do reporter

`scripts/validacao/avaliar-par-reporter.cjs` avalia somente um par experimental
explicitamente selecionado. Não descobre execuções, chama o reporter ou faz manutenção.
Reutiliza o inventário ORG.4D e o adaptador ORG.6A para os fatos básicos; seus
contratos permanecem intactos. ORG.6B/7 reconhecem somente `synthetic-counter-v1`
e não são reaproveitados como classificadores de relatórios físicos.

## Seleção e consentimento

```text
node scripts/validacao/avaliar-par-reporter.cjs --root RAIZ_ABSOLUTA --experiment tmp/org9b-reporter-ab-UUID --run-id HORARIO_UTC-UUID --allow-content
```

A raiz precisa ser uma worktree e o experimento um caminho relativo nesse formato.
O runId segue o formato do construtor do reporter. UUIDs são v4 canônicos.
Somente três nomes são selecionados, sem recursão:

- `<experimento>/tmp/validacao/<runId>/run.json.tmp`;
- `<experimento>/tmp/validacao/<runId>/run.json`;
- `<experimento>/observacoes.json`.

Sem `--allow-content`, observa metadados, sem abrir conteúdo nem calcular hashes.
Não se deve apontar a CLI para evidências privadas não autorizadas. O nome do
diretório, o marcador de relatório fictício e as declarações não autenticam origem.

## Critérios e limites

Leituras limitadas a 64 KiB por arquivo; arquivos regulares, um hardlink e identidade
device/inode não nula em BigInt. `lstat` por componente, flags somente de leitura,
`O_NOFOLLOW`/`O_NONBLOCK` quando disponíveis, conferência de caminho/descritor antes
e depois, descritores retidos até terminar as três aquisições e fechamento em finally.
Mudança detectada invalida as comparações; ausência, vínculo, identidade insuficiente,
limite excedido e falha não produzem conclusão favorável.

Não há snapshot atômico ou monitor contínuo contra corrida hostil. Node não certifica
tags exóticas de reparse no Windows. Acesso pode atualizar atime pelo filesystem.
O inventário e as leituras são observações distintas, com procedências preservadas.

Compara bytes, SHA-256 e JSON interpretado separadamente; igualdade de bytes não
valida schema integral do reporter. Exige schemaVersion/runId/marcador experimental
para associar os relatórios. Observações A/B são declarações corroboráveis por
fileId, tamanho, mtime e hashes atuais, não autenticação de autoria ou processo.
IDs de volume Python/Node têm representações diferentes e não são equiparados.
Caminhos/textos declarados são inertes, nunca usados para selecionar outros arquivos
ou reproduzidos no resultado. Estado atual do produtor permanece desconhecido.

O reporter escreve o intermediário e usa seu nome no rename; a CI observacional
localiza relatórios finais e o comparador aceita relatório explicitamente indicado.
`attempts.jsonl` preserva tentativas por contrato; não é lido por este avaliador.
Consumidores externos, processos concorrentes e liberação de dependências não são
comprovados. Tamanho observado não significa espaço recuperável: este fica `null`.
`cleanupAuthorization=none` e dispensabilidade indeterminada são invariantes.

Saída JSON legível, sem caminhos absolutos ou conteúdo dos relatórios: `complete/0`
significa observação concluída com declarações corroboradas; `partial/2` conserva
lacunas, recusas e conflitos. Nenhum resultado concede autorização física.

## Evidência desta entrega

Avaliação do par físico criado intencionalmente na experiência ORG.9B, preservada
sem repetir A/B: dois arquivos distintos, 316 bytes cada, bytes e relatórios iguais.
Declaração A/B corroborada, sem prova de consumidores externos ou dispensabilidade.
Resultado privado em `tmp/org9b-avaliacao-primeira.json`; dados pessoais e caminhos
da máquina ficam fora da documentação versionada.

Testes novos usam filesystem em memória: igualdade/divergência, ausência, identidades,
links, limites, falhas, consentimento, lacunas e alterações durante aquisição.
Não geram outra experiência física. Validação final em 04/11/2026:

- 15/15 testes novos aprovados; regressões ORG direcionadas aprovadas.
- `npm test`: exit code 0, 648/648 Node e 638/638 Playwright (45,6 minutos).
- Build, formatação, lint e diff aprovados; porta de testes 5189, identidade confirmada.
- Os três arquivos experimentais conservaram identidade, tamanho, mtime/ctime e SHA-256
  após a global. O reporter e os contratos anteriores não foram modificados.

Logs privados: `tmp/org9b-global.log` e `tmp/org9b-global.exit`. A anotação documental
destes resultados é posterior à execução, sem mudança de código ou testes.

Próxima classe recomendada para estudo: PNGs de diagnóstico efetivamente existentes
em `output/`. Metadados do primeiro nível desta cópia após a global: três PNGs,
1.146.004 bytes nominais; o maior é `historia-outubro-1920.png`, com 511.201 bytes.
Essa medição não inclui subpastas, não lê imagens e não demonstra espaço recuperável.
A identidade compartilhada já diferencia um conjunto de 29 diagnósticos revisados;
isso não comprova consumidores encerrados ou cópia recuperável de cada recurso.
Recomenda-se selecionar explicitamente o maior desses três para futura avaliação,
sem ampliar a coleta nem autorizar limpeza nesta entrega.
