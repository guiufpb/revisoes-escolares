# Alice — Objetos e histórias

Nova revisão de História para o 1º ano, com ampliação gradual, preparada em 05/10/2026.
O roteiro editorial fornecido contém exatamente 30 questões, 65 subitens e 30 pontos.
Personagens, cenas e documentos são fictícios. Os anexos escolares privados de História
não foram reabertos nem copiados para os ativos ou arquivos publicáveis.

ID: `alice-historia-objetos-memorias-outubro-2026`.

Conteúdo: `ambiente_interativo/revisoes/alice/historia-objetos-memorias-outubro-2026.js`.

Chave principal: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.v1`.

Chave auxiliar: `revisoesEscolares.alice.historia.objetosMemoriasOutubro2026.responsavel.v1`.

## Ensino e uso acompanhado

São seis blocos de cinco questões: lembranças e pistas; crescer, usar e lembrar; diferentes
povos no presente; antigo, atual e permanências; registros e fontes; investigar e preservar.
Cada tela tem apoio consultável, tarefa, pista após erro e consolidação após acerto.
As associações usam alternativas por subitem; seleções exigem o conjunto exato e ordenações
permitem retirar e recolocar os cartões. Q07/Q27 usam uma ordenação dentro do tipo misto;
Q25 combina ordenação e alternativa. Um ponto exige todos os subitens corretos.

Desktop amplo, validação estrita, registro de tentativas e Modo Responsável são opt-in.
`Ctrl + Alt + R` abre o painel fora dos campos editáveis. O salto muda somente a posição;
Alice e Responsável têm progresso separado. Escape fecha o painel; encerrar volta à principal.
Recarga e reabertura iniciam na principal. Limpar remove somente a chave ativa.

Os ditados Q05, Q15 e Q30 reutilizam voz local pt-BR, rate 0,78 e pitch 1, com prefixo e alvo
no mesmo utterance. Ouvir, Repetir e Parar dependem de ação explícita. A escrita continua
operável sem voz disponível; nessa situação, o responsável pode ler os alvos abaixo.
Não exibir este gabarito à criança antes da conferência. A normalização aceita caixa,
acentos, espaços e pontuação flexíveis; mantém as palavras na ordem determinada.

Após a conclusão, pode-se conversar fora da pontuação: “Qual objeto você gostaria de guardar?
O que ele lembra? Quem poderia contar mais sobre ele?” A criança pode falar ou desenhar em papel.
Não é uma questão adicional e não exige registro pessoal no ambiente.

## Imagens originais

13 SVGs em `assets/historia-objetos-memorias-outubro-2026/`, reutilizados em 17 telas.
As fontes indispensáveis mostram duas crianças e uma bola sem nomes/data (Q04), televisores
com fichas de contexto, profundidade e controles (Q16/Q18), anúncio fictício de fogão e limites
de acesso (Q19), agenda de sete dias (Q25) e pião com ficha por atributo (Q28).
Os esquemas da galeria são didáticos, sem reprodução de grafismos culturais ou alegação
de réplica autêntica. Cada cena tem descrição alternativa equivalente. Demais contextos
têm apoio textual completo, inclusive coexistência de papel/digital e filtro comprado hoje.

## Gabarito editorial independente

As letras correspondem à ordem fixa do roteiro e da interface; não há sorteio na recarga.

| Questão | Respostas por subitem |
| --- | --- |
| 01 | A: B |
| 02 | A: B, C, D |
| 03 | A: B; B: A; C: C |
| 04 | A: B, C; B: C |
| 05 | A: memória; B: objeto |
| 06 | A: B; B: B; C: B |
| 07 | A: Usava sapatinhos de bebê → Aprendeu a andar → Começou a frequentar a escola |
| 08 | A: A; B: C |
| 09 | A: B; B: A; C: C |
| 10 | A: A; B: B; C: B |
| 11 | A: C; B: A; C: B |
| 12 | A: B; B: A; C: C |
| 13 | A: A, C |
| 14 | A: B, C; B: C |
| 15 | A: Cada povo tem sua história. |
| 16 | A: B; B: A |
| 17 | A: B; B: A; C: C |
| 18 | A: A, C; B: B |
| 19 | A: C; B: A |
| 20 | A: A; B: B; C: B |
| 21 | A: B; B: A; C: C |
| 22 | A: A, C, D |
| 23 | A: C; B: A; C: D; D: B |
| 24 | A: C; B: A |
| 25 | A: Separar objetos → Preparar fichas → Abrir a exposição; B: B |
| 26 | A: B; B: A, C |
| 27 | A: Escolher objetos com permissão → Conversar sobre os objetos e preparar fichas → Organizar peças e fichas para os visitantes |
| 28 | A: B; B: A; C: C |
| 29 | A: B, D; B: A |
| 30 | A: Objetos guardam lembranças.; B: Museus cuidam da história. |

## Limites da validação

O teste `tests/historia-alice-objetos-memorias-outubro-2026.spec.js` transcreve o gabarito
independentemente do objeto de conteúdo. Automação cobre software, acessibilidade programática
e payloads de voz. Uso real validado em outubro de 2026, conforme confirmação do responsável,
incluindo clareza, fluxo e execução com Alice. Não há confirmação separada de audição da voz instalada.

## Arquivos da implementação

- Conteúdo: `ambiente_interativo/revisoes/alice/historia-objetos-memorias-outubro-2026.js`.
- Ilustrações: os 13 arquivos em `assets/historia-objetos-memorias-outubro-2026/`.
- Integração: `ambiente_interativo/js/app.entry.js`, `ambiente_interativo/js/registro-revisoes.js`,
  `ambiente_interativo/js/app.js` e `ambiente_interativo/index.html`.
- Testes: `tests/historia-alice-objetos-memorias-outubro-2026.spec.js` e as três contagens
  do cadastro em `tests/ambiente-interativo.spec.js` (56 → 57 revisões).
- Documentação: este documento e `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md`.

Não houve alteração nos controladores, áudio, armazenamento ou CSS. O build gera o bundle
ignorado pelo Git. Para regressões de Leitura no worktree, foram preparados os dez PDFs
locais nos caminhos já ignorados, preservando os originais e sem análise pedagógica nova.

## Validação técnica local — 05/10/2026

| Verificação executada | Resultado |
| --- | --- |
| `npm run build` | PASS; bundle gerado, inclusive na preparação da suíte global |
| `npm run format:check` | PASS |
| `npm run lint` | PASS |
| Playwright direcionado da nova revisão | 20 PASS; 1,7 minuto |
| Regressões direcionadas de cadastro e Leitura | 11 PASS; 1 minuto |
| `npm test` | 350 PASS; 23,9 minutos; exit code 0 |
| `git diff --check` | PASS |
| Auditoria de IDs, chaves, totais, integração e privacidade | PASS |

A primeira execução global foi interrompida após identificar a expectativa antiga de 56
revisões e PDFs vazios de CI no worktree. A contagem foi atualizada para 57; os PDFs locais
da biblioteca foram preparados em caminhos ignorados. Os 11 casos afetados passaram
isoladamente e, depois, toda a suíte passou com as verificações de integridade preservadas.

A inspeção visual revisou os 13 SVGs e as telas em computador/celular. A automação verificou
1366 × 768, 1920 × 1080 e 390 × 844, uma coluna móvel, teclado/toque, axe-core sem falha
grave/crítica, console, restauração e execução `file://` sem rede. Mocks validaram os
payloads e cancelamentos dos ditados; não representam confirmação de audição humana.

Trabalho mantido em worktree separado, na branch `codex/alice-historia-objetos-memorias-outubro-2026`, sobre
`937989e82aa5deed23854cf259915cc8ecae2d18`, confirmado como `main` remoto. A cópia original,
suas alterações pendentes e seu stash foram preservados. Nenhum commit, push, PR, merge
ou publicação foi executado.

Prévia local: `http://127.0.0.1:5174/ambiente_interativo/index.html`.
Servidor: `npm run dev -- --port 5174 --strictPort` na raiz do worktree.
Escolha Alice e o cartão “Objetos e histórias — Uma investigação da Alice”.

## Consolidação local — outubro de 2026

Uso real validado em outubro de 2026. A integração conserva os arquivos de conteúdo,
13 SVGs e testes originais; concilia somente cadastros, navegação e documentação compartilhados.
As contagens históricas acima descrevem a implementação isolada; o catálogo integrado tem 59 revisões.

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
