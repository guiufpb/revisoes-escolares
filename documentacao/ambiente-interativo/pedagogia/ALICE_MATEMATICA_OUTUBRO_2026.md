# Alice — Dezenas, números e dinheiro

Registro de integração — 13/10/2026: o responsável informou validação humana geral das
atividades locais. Audição específica do ditado numérico não foi confirmada. Os resultados
e pendências abaixo são históricos da fonte; a validação desta integração consta no inventário.

Implementação local em 12/10/2026 do roteiro aprovado para a prova de 13/10/2026.
ID: `alice-matematica-dezenas-numeros-dinheiro-outubro-2026`.
Conteúdo: `ambiente_interativo/revisoes/alice/matematica-dezenas-numeros-dinheiro-outubro-2026.js`.
Cartão: Alice → Matemática → **Dezenas, números e dinheiro — descobertas da Alice**.

São 25 questões, 55 subitens, cinco blocos e 25 pontos. A cobertura inclui dezenas e unidades,
valor posicional, nomes dos números, comparação, ordenação, dinheiro inteiro, equivalência,
compras, troco e leitura de gráfico. Q6 e Q11 consolidam nomes antes da produção posterior;
Q22 é uma ordenação única, sem multiplicação artificial da pontuação. Q14 converte dois nomes
ouvidos em algarismos, sem mostrar previamente os alvos na interface.

## Validação da integração — 13/10/2026

Validação desta integração: **20 passed (1.4m)** próprios, **177 passed (13.9m)** em regressões
e **504 passed (35.3m)** na suíte global completa, sem falhas, retries ou skips. Build, formatação,
lint e diff aprovados. Windows: **24/24** contratos de abertura e **8/8** cenários simulados
de pronúncia, sem Azure real ou microfone. Playwright usou porta 5188, um worker e identidade
da nova cópia confirmada; leitura usa somente as fixtures PDF sintéticas oficiais.

Os 63 cadastros anteriores, inclusive as quatro revisões do PR #39, permanecem preservados.
O teste central conserva as verificações de unicidade/existência e as quatro asserções do
PR #39, acrescenta a nova revisão e exige 64 cadastros, IDs e chaves únicos. Conteúdo,
22 SVGs e teste próprio conferidos por hash com a fonte preservada. As extensões de
questionários e ditado são opt-in, sem alterações nos padrões das revisões anteriores.

Revisão visual reaproveitou seis folhas de contato e tela móvel Q19 existentes, sem nova
renderização. Conferência estrutural das peças, células, argolas, dinheiro e grade integrou
os testes. Chaves principal e auxiliar mantidas, com erro/correção, restauração, pontuação
única, limpeza seletiva, Modo Responsável, Desktop Amplo, teclado, toque e file:// exercitados.

Validação humana geral das atividades locais informada pelo responsável em 13/10/2026;
audição específica do ditado numérico Q14 permanece sem confirmação. Fontes, worktrees,
stash e pasta habitual preservados. Sem commit ou publicação nesta etapa.

## Arquitetura e isolamento

Reutiliza QuestionariosRevisoes, QuestionariosInteracoes, GramaticaDitado, AudioRevisoes,
Desktop Amplo e Modo Responsável. As sessões usam chaves independentes:

- Principal: `revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.v1`.
- Responsável: `revisoesEscolares.alice.matematica.dezenasNumerosDinheiroOutubro2026.responsavel.v1`.

As extensões compartilhadas são opt-in: `textoDitado` separa estímulo oral e resposta;
`rotuloDitado` e `instrucaoDitado` personalizam textos com escape HTML; campos podem conter
imagem acessível e alternativas podem ativar `imagemAmpla`. Revisões existentes mantêm os
padrões anteriores. Não houve mudança no motor de pontuação, normalização ou persistência.
Integrações: importação, registro, cartão e roteamento exclusivo de Alice. CSS acrescenta
somente as classes para as cenas responsivas. Bundles foram gerados pelo build oficial.

## Evidências de validação

- Build, formatação, lint e diff aprovados antes da validação completa.
- Arquivo próprio: **20/20**, em 1,4 minuto; expectativas independentes para os 55 subitens.
- Recorte sensível com História legada de Alice: **19/19**, em 1,3 minuto.
- Layout: 390 × 844, 1366 × 768 e 1920 × 1080; sem overflow horizontal e sem violações
  sérias/críticas de axe-core. Inclui teclado, toque, retorno, recarga e conclusão em 25 pontos.
- Windows: **24/24** cenários de abertura e **8/8** de pronúncia simulada, sem Azure real.
- Suíte global obrigatória por alterações em áudio, controlador, registro, navegação e CSS:
  **424/425**, em 29,5 minutos. A única falha foi a expectativa antiga de 59 registros,
  atualizada para 60, preservando as verificações de IDs/chaves únicas e existência dos
  elementos. Reteste desse caso: **1/1**, em 3,3 segundos. Não houve outra execução global
  integral após esse ajuste exclusivo ao teste. Nenhuma regressão crítica foi encontrada.

Testes executados em contextos sintéticos, porta exclusiva 5184, raiz/origem/identidade
confirmadas pelo setup oficial, strictPort e sem reutilizar servidor. Leitura usa apenas as
fixtures PDF sintéticas oficiais. O contrato offline também foi exercitado por `file://`.
Nenhum progresso real foi usado, removido ou migrado.

As 22 cenas SVG originais foram renderizadas e inspecionadas em seis folhas de contato.
Telas efetivas representativas foram conferidas em celular e desktop. Barras têm dez células;
ábacos mantêm D à esquerda e U à direita; carteiras conservam os valores individuais; o
gráfico tem origem comum, escala unitária, valores 12/17/15 e equivalente textual. Contagens
estruturais complementam a inspeção visual. Capturas e logs permanecem locais e ignorados.

## Entrega e pendências humanas

Implementação isolada na branch `codex/alice-matematica-dezenas-numeros-dinheiro-outubro-2026`,
base `09dba7042666f157b84ec4b0490c56505036a146`. Consulta técnica seletiva às revisões
equivalentes de História de Alice e Matemática de Mariana; capacidades disponíveis na base
foram reutilizadas, sem transplantar alterações pendentes de outras cópias.

Entrada 10 do catálogo privado existente atualizada, com atalho pelo auxiliar oficial.
Atalho inspecionado; sua abertura na origem habitual não foi executada, para preservar o
servidor de estudo. A cópia habitual, alterações alheias e stash original foram preservados.
Não houve integração, commit, push, PR, merge ou publicação. Nenhum PDF escolar, OCR, print
ou renderização de anexo foi incluído entre os arquivos da mudança.

Registro histórico da fonte em 12/10/2026: audição, ergonomia e uso com Alice aguardavam
confirmação. O responsável informou validações humanas das atividades locais antes desta
integração. Audição específica de Q14 permanece sem confirmação; áudio simulado não a comprova.
