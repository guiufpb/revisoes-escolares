# Alice — At the Farm v2

Validação técnica histórica concluída e atividade validada em uso real com Alice em outubro
de 2026. O progresso local foi posteriormente limpo pelo responsável, sem alteração da
implementação ou da validação pedagógica realizada. Essa confirmação é documental:
nenhum histórico, resposta, ponto, tentativa ou estado concluído foi reconstruído.

Azure Speech, avaliação automática e voz instalada continuam sendo validações separadas.
At the Farm v2 não declara conversação por Azure; o estudo usa o áudio local compartilhado.

## Identidade e implementação preservada

- Mesmo ID: `alice-ingles-at-the-farm-unidade-5`.
- Mesma unidade e cartão: `at-the-farm-unidade-5` / `abrir-ingles-at-the-farm`.
- Chave ativa: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v2`.
- Chave histórica intacta: `revisoesEscolares.alice.ingles.atTheFarmUnidade5.v1`.
- Conteúdo: `ambiente_interativo/revisoes/alice/ingles-at-the-farm-unidade-5.js`.
- 97 itens em dez grupos: os 41 anteriores e 56 novos. 30 questões, 30 pontos e 127 etapas.
- Escrita obrigatória e Desktop Amplo declarativos, com portão de 97 áudios e 97 escritas.
- 18 SVGs originais: 13 conceitos e cinco cenas de posição, além da biblioteca existente.
- Testes próprios: `tests/ingles-at-the-farm-v2.spec.js` (seis casos), com regressões centrais
  de percurso, correção, recarga, teclado/celular, áudio, pontuação e isolamento.

O controlador, o armazenamento e o áudio existentes são reutilizados. Não há migração,
leitura ou limpeza automática da chave v1. A v2 inicia conforme seu armazenamento próprio.

## Recuperação seletiva do stash

Origem: stash `dd5623a8d3db5cbb0f699d13d2af34b8afc39590`, criado sobre
`2481fbc75a011ca876b25148d3d2d816cd189145`. Foram extraídos isoladamente conteúdo, assets,
testes e documentação, antes da conciliação com a base atual. O stash original foi preservado.
Dois prompts locais misturados no stash foram excluídos da integração e permanecem nele.

O índice de ícones mantém também as adições posteriores de Friends e At School. Os testes
preservam os controles atuais e verificam o prefixo acústico vigente `Word: rocket`,
em lugar do payload anterior à unificação de áudio de setembro. O conteúdo e a geometria
dos SVGs não foram reconstruídos.

## Histórico técnico anterior

Em 30/08/2026 passaram build, formatação, lint e 16 regressões direcionadas, incluindo os
seis testes próprios da v2 e o percurso de 30 atividades. Houve inspeção das capturas de
desktop/celular e testes de áudio simulado; a suíte global não foi executada naquela rodada.
Esses resultados históricos são distintos da validação atual da integração.

## Validação da consolidação — 06/10/2026

As quatro revisões foram conciliadas na branch
`codex/integracao-revisoes-validadas-outubro-2026`, com 59 registros no catálogo.
Build, `format:check`, lint e `git diff --check` passaram. Passaram também os testes
direcionados das quatro revisões: **62/62 (4.8m)**; as regressões compartilhadas:
**112/112 (8.8m)**; e `npm test` integral: **392/392 (28.6m)**.

Os testes e a inspeção dos cartões/telas usaram contextos de navegador isolados.
O armazenamento do navegador de uso permaneceu intacto. A confirmação de uso real
das quatro atividades não substitui avaliação específica de Azure Speech, pronúncia
automática ou audição da voz instalada. Os stashes e as fontes originais foram preservados.
