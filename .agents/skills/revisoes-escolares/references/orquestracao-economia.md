# Orquestração econômica

## Objetivo e precedência

Reduzir custo de modelo, poluição de contexto, releituras e tempo de espera sem multiplicar agentes
por rotina nem reduzir análise pedagógica, correção, testes, acessibilidade, preservação de
progresso, estabilidade, privacidade ou qualidade da revisão final.

Este protocolo complementa `AGENTS.md` e a skill `revisoes-escolares`. Em caso de conflito,
prevalecem `AGENTS.md`, as instruções do projeto e a implementação atual.

A fórmula central da v2 permanece:

**análise pedagógica rica uma vez → síntese rica → implementação técnica econômica**

Economize releitura de código, varredura do repositório, OCR/rerenderização repetidos,
infraestrutura paralela, coordenação desnecessária e testes sem gatilho. Não economize profundidade
pedagógica, cobertura exigida, acessibilidade ou segurança do progresso.

## Princípio operacional

> **Ferramenta determinística faz o que é determinístico.**
>
> **Luna executa tarefas mecânicas e estreitas.**
>
> **Terra explora, compara e revisa.**
>
> **Sol decide arquitetura, integra e resolve risco alto.**

**Tarefa longa ≠ tarefa difícil.** Não escolha Sol apenas pela duração. Uma suíte de 20 minutos é
longa, mas intelectualmente simples; uma alteração curta em armazenamento, pontuação ou
restauração pode ser de alto risco.

Antes de usar um modelo para listar, contar, comparar valores estruturados ou executar comandos,
prefira `rg`, Git, scripts do projeto, build, lint, formatadores e testes reais. Modelo interpreta;
ferramenta determinística mede e executa.

## Classes de risco R0–R4

| Classe | Tipo | Exemplos | Roteamento inicial |
| --- | --- | --- | --- |
| R0 | Mecânica/determinística | `git status`, `git diff --check`, build, lint, format, listar arquivos | ferramenta local; Luna Low somente se delegar trouxer benefício |
| R1 | Declarativa | revisão nova usando controlador pronto | Terra Medium |
| R2 | Visual/isolada | dados visuais, CSS local, conteúdo visual em infraestrutura pronta | Terra Medium; Terra High na revisão visual |
| R3 | Compartilhada | controlador, renderer reutilizável, navegação, pontuação, restauração | Sol High |
| R4 | Estrutural | armazenamento, build, bundle, PDF.js, arquitetura, migração | Sol High |

Se uma tarefa R1 ou R2 exigir mudança compartilhada, reclassifique para R3 antes de continuar. Se
atingir armazenamento, build, bundle, PDF.js, migração ou arquitetura, reclassifique para R4.

### Inclusão declarativa de baixo risco

Quando houver equivalente conhecido, conteúdo específico novo e nenhuma mudança de controlador,
armazenamento ou estrutura:

- consulte o mínimo técnico necessário;
- mantenha a implementação declarativa;
- não use subagentes automaticamente;
- crie assets somente quando tiverem função pedagógica;
- teste conforme `AGENTS.md`.

### Mudança compartilhada de maior risco

Ao alterar controlador, armazenamento, áudio, navegação, motor de atividades ou componente
reutilizável, o modo econômico deixa de prevalecer. Amplie a investigação, mapeie revisões
afetadas, justifique a mudança, avalie regressão e compatibilidade, considere auditoria e siga os
gatilhos completos de `AGENTS.md`.

## Matriz Sol/Terra/Luna

### Sol

**Sol Medium**

- integrar resultados e revisar o diff final;
- escolher entre alternativas já mapeadas;
- preparar consolidação.

**Sol High**

- decidir comportamento compartilhado, persistência e arquitetura;
- resolver problemas de pontuação, restauração e navegação;
- criar ou alterar motores/controladores;
- investigar regressões difíceis e conflitos arquiteturais.

Evite Sol para aguardar suítes, listar arquivos, contar testes, lint, whitespace ou polling.

### Terra

**Terra Medium**

- localizar revisão equivalente;
- mapear controlador, registro e testes;
- comparar implementações e confirmar capacidade existente;
- implementar conteúdo declarativo;
- escrever testes direcionados para API já definida;
- atualizar documentação de mudança conhecida.

**Terra High**

- revisar tecnicamente diffs;
- fazer revisão visual matemática/pedagógica;
- auditar acessibilidade e lógica de ilustrações;
- fazer triagem intermediária.

Escale para Sol quando a decisão envolver arquitetura compartilhada ou risco elevado.

### Luna

**Luna Low**

- executar comandos conhecidos;
- fazer auditoria simples e contagens;
- conferir `git status` e `git diff --check`;
- resumir testes;
- checar arquivos privados fora do Git.

**Luna Medium**

- conferir IDs, chaves e totais;
- comparar registro, teste e documentação;
- detectar arquivo estranho no diff ou contagem desatualizada;
- fazer triagem simples.

Luna não redesenha infraestrutura nem improvisa correção complexa.

## Regra de delegação e reutilização de contexto

Antes de criar subagente, responda:

1. A tarefa é independente?
2. A saída pode ser curta e verificável?
3. O subagente precisa de menos contexto que o principal?
4. Um modelo mais barato consegue executá-la com segurança?
5. A delegação evita trabalho real, em vez de apenas criar coordenação?

Se alguma resposta relevante for “não”, mantenha a tarefa no agente principal.

**Leia uma vez, distribua sínteses.** Subagentes recebem apenas escopo, arquivos relevantes,
restrições, pergunta concreta e formato esperado. Não envie automaticamente `AGENTS.md` inteiro,
inventário inteiro, PDF/OCR, histórico completo ou prompt pedagógico longo a quem executará apenas
um comando.

## Papéis locais recomendados

### Agente principal

Responsabilidades:

- interpretar o pedido e a síntese pedagógica;
- classificar risco e decidir arquitetura/controlador;
- planejar e integrar escritas;
- executar comandos determinísticos quando não houver delegação claramente vantajosa;
- decidir gates e consolidar o retorno ao usuário.

Para nova revisão ou tarefa ambígua, prefira Sol em esforço médio; aumente o esforço apenas para
arquitetura compartilhada, regressão complexa ou conflito difícil.

### `revisoes_explorer`

Use o explorador read-only somente quando o equivalente ou a infraestrutura não estiverem claros.
Ele deve retornar:

```text
Controlador:
Revisão equivalente:
Registro:
Teste equivalente:
Capacidade existente:
Infra nova necessária:
Classe de risco:
Evidências/caminhos:
```

Configuração local preservada: Terra Medium, read-only. Não crie explorer quando o caminho já
estiver claro.

### `revisoes_auditor`

Use o auditor read-only no fim para verificar escopo do diff, arquivos inesperados, IDs, chaves,
totais, arquivos compartilhados, registros, testes, documentação e candidatos privados ao Git.
Priorize-o em mudança compartilhada, risco de colisão, escopo estrutural ou lote relevante; ele não
é obrigatório para inclusão declarativa simples.

Configuração local preservada: Luna Medium, read-only. O auditor não substitui build, lint ou
Playwright reais e não faz `git add`, commit, push, PR ou merge.

## Paralelismo e propriedade de escrita

> **Um escritor por conjunto de arquivos compartilhados.**

Evite escrita paralela em `app.js`, `app.entry.js`, registros centrais, documentação central,
armazenamento, áudio, controladores e CSS estrutural.

Limite recomendado:

- normalmente, no máximo 2 subagentes simultâneos;
- até 3 somente quando todos forem read-only e independentes.

Não paralelize dois builds, duas suítes globais, dois agentes no mesmo componente nem duas tarefas
que gerem os mesmos bundles ou relatórios. Se escrita paralela for realmente necessária, use
worktrees isoladas e uma estratégia explícita de integração; caso contrário, o agente principal
escreve.

## Estratégia econômica de validação

A cobertura é definida exclusivamente por `AGENTS.md` e nunca pode ser reduzida para economizar
tempo, tokens ou custo de modelo.

Ordem preferida:

```text
build/checagem necessária
→ format:check
→ lint
→ teste novo direcionado
→ regressões diretamente afetadas
→ npm test global somente quando AGENTS.md exigir
```

Não comece pela suíte global se verificações mais baratas puderem detectar erros antes. Se um teste
depende de bundle gerado, faça o build antes.

### Comandos longos e ausência de polling narrativo

Durante `npm test`, Playwright extenso, build ou renderização demorada:

- não narre progresso periódico;
- não envie contagens intermediárias como “99/243”;
- aguarde a conclusão sem polling narrativo;
- intervenha apenas em falha, timeout, pedido de decisão ou evento que altere o plano.

Retorno mínimo:

```text
Comando:
Resultado: PASS/FAIL
Exit code:
Duração:
Testes:
Falhas:
Observação necessária:
```

### Executor de testes estrito e opcional

Um subagente de testes não é obrigatório. A preferência é o agente principal disparar a ferramenta
local e aguardar.

Se desacoplar a execução trouxer benefício real e a configuração instalada permitir restringir a
função com segurança, use Luna Low com este contrato:

```text
Execute exatamente os comandos informados.
Não edite código-fonte.
Não tente corrigir falhas.
Não faça commit, push ou merge.
Não narre progresso periódico.

Retorne somente:
- comando;
- PASS/FAIL;
- exit code;
- duração;
- total de testes;
- nomes das falhas;
- trecho mínimo relevante do erro.
```

Se o comando gerar bundle ou artefato, o executor precisará de escrita técnica. Não crie uma
configuração local que conceda escrita ampla fingindo que ela restringe com segurança a edição de
fontes. Quando o schema ou o isolamento instalado não oferecer essa garantia, o agente principal
executa os comandos diretamente. Antes de alterar `.codex/*.toml`, confirme o schema suportado pelo
Codex instalado.

## Escalonamento de falhas

```text
Falha
↓
mecânica/configuração óbvia?
↓
Luna/Terra
↓
persistiu ou exige interpretação?
↓
Terra High
↓
envolve estado compartilhado, arquitetura ou regressão difícil?
↓
Sol High
```

Casos baratos incluem contagem esperada antiga, bundle não reconstruído, caminho incorreto no
teste e asserção textual inadequada quando o DOM correto é estrutural.

Casos para Sol incluem estado perdido após voltar/recarregar, pontuação duplicada, chave antiga
reinterpretada, regressão em controlador compartilhado, troca matemática que altera valor e
listener duplicado.

Não esconda problemas alterando testes para fazê-los passar.

## Política de flakiness

Uma falha possivelmente flakey não dispara automaticamente outra suíte global inteira:

1. identifique o teste;
2. execute somente o teste falho;
3. verifique se reproduz;
4. se reproduzir, trate como problema real;
5. se passar isoladamente, registre possível oscilação;
6. repita a suíte global quando `AGENTS.md` exigir, houver correção de alcance amplo, dúvida de
   alcance ou necessidade de passagem global limpa.

Nunca remova, pule ou enfraqueça teste para “resolver” flake ou economizar.

## Revisão visual e ilustrações com lógica

Não delegue revisão visual pedagógica relevante a Luna:

- Terra High por padrão;
- Sol quando houver ambiguidade conceitual ou risco arquitetural.

Na revisão cega:

1. abra o render;
2. descreva quantidades, grupos, ordem, estados e relações;
3. só depois consulte o contrato;
4. compare observado × esperado;
5. reprove se houver interpretação concorrente.

Pergunta central: **se eu esconder o texto explicativo e olhar apenas a estrutura visual, qual
relação concluo?**

Imagem lógica é dado, não decoração. Prefira:

```text
modelo matemático/conceitual
        ↓
dados declarativos
       ↙ ↘
render   validação
```

Evite imagem independente validada apenas por aparência.

## Formatos curtos de retorno

### Sucesso

```text
RESULTADO: PASS

Escopo:
Comando ou arquivos:
Achados:
Arquivos alterados: nenhum
Observações necessárias:
```

### Falha

```text
RESULTADO: FAIL

Escopo:
Falha:
Arquivo/teste provável:
Evidência mínima:
Correções realizadas: nenhuma
Escalonamento sugerido:
```

Sem diário de raciocínio. Para exploração, retorne poucos itens com caminhos e evidências; para
testes, use o formato mínimo de comando longo.

## Matriz prática

| Tarefa | Recomendação |
| --- | --- |
| Criar questões declarativas em motor pronto | Terra Medium |
| Comparar Alice/Mariana | teste determinístico ou Luna Medium |
| Localizar revisão equivalente | Terra Medium |
| `npm run lint` | ferramenta local; Luna Low se necessário |
| `npm test` | ferramenta local; Luna Low apenas como executor estrito |
| Arquivos privados fora do Git | Luna Low/Medium |
| Atualizar inventário | Terra Medium |
| Revisar reagrupamento visual | Terra High |
| Alterar `matematica-operacoes.js` | Sol High |
| Alterar armazenamento/restauração | Sol High |
| Investigar pontuação duplicada | Sol High |
| Revisar diff final grande | Sol Medium/High |
| Conferir IDs/chaves/totais | Luna Medium |

## Métricas de eficiência

1. releituras duplicadas por subagentes: **0 quando evitável**;
2. dois agentes escrevendo o mesmo componente: **0**;
3. mensagens intermediárias durante teste longo: **0**, salvo intervenção necessária;
4. Sol em tarefa puramente mecânica: **0**;
5. OCR/rerenderização repetidos sem necessidade: **0**;
6. redução de cobertura de testes para economizar: **proibida**;
7. suítes ou builds concorrentes sobre os mesmos artefatos: **0**;
8. retornos de subagentes sem conclusão verificável: **0**.

## Fluxo recomendado

```text
Sol/Terra: classificar risco
↓
Terra Medium: explorar somente se necessário
↓
Terra Medium ou Sol High: implementar conforme risco
↓
ferramenta local / Luna: build + format + lint
↓
ferramenta local / Luna: teste direcionado
↓
Terra High: revisão visual quando aplicável
↓
ferramenta local / Luna: regressões
↓
ferramenta local / Luna: npm test, se AGENTS.md exigir
↓
Luna Medium: auditoria objetiva opcional
↓
Sol Medium: integração e revisão final
```

## Git e regra de ouro

Nunca delegue automaticamente comandos destrutivos, staging amplo, push, merge ou publicação.
`git reset --hard`, `git clean -fd`, `git add -A`, `git add .` e `git add -f` permanecem proibidos
como atalhos. Commit, push, PR e merge dependem de autorização explícita.

> **Comece barato, escale pelo risco.**
>
> **Teste com ferramentas, não com raciocínio.**
>
> **Leia uma vez e distribua sínteses.**
>
> **Um escritor por área.**
>
> **Sol decide; Terra investiga e revisa; Luna executa e audita.**

Economia nunca pode significar menos análise pedagógica, menos testes, menos acessibilidade,
imagens logicamente frágeis, perda de progresso ou atalhos destrutivos de Git.
