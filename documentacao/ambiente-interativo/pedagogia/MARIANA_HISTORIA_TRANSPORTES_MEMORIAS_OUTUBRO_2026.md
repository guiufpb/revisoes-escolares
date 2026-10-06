# Mariana — Uma viagem pelas histórias e memórias

Uso real validado em outubro de 2026, conforme confirmação do responsável. Clareza,
fluxo e execução da atividade foram validados com Mariana. Não há registro separado
de audição da voz instalada; os testes de áudio usam simulação.

## Identidade e conteúdo preservado

- ID: `mariana-historia-transportes-memorias-outubro-2026`.
- Conteúdo: `ambiente_interativo/revisoes/mariana/historia-transportes-memorias-outubro-2026.js`.
- Chave principal: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.v1`.
- Chave auxiliar: `revisoesEscolares.mariana.historia.transportesMemoriasOutubro2026.responsavel.v1`.
- 30 questões e 30 pontos; todos os subitens corretos são necessários para cada ponto.
- Seis apoios pedagógicos e 23 SVGs originais locais em `assets/historia-memorias-outubro/`.
- Transportes e convivência, objetos e registros, diários, cartas, fotografias e cruzamento
  de fontes. Contextos e personagens fictícios aparecem dentro da atividade.
- Desktop Amplo, validação estrita, tentativas e Modo Responsável são opt-in.
  Sessões independentes, salto sem pontos, restauração e limpeza somente da chave ativa.
- Q30 reúne três frases de ditado; voz local pt-BR, prefixo protegido, repetir/parar e
  cancelamento por campo. `Ctrl + Alt + R` funciona fora dos campos editáveis.

Reutiliza os controladores de questionários, interações, ditado, áudio e armazenamento.
Nenhum controlador novo foi criado. A consolidação transporta a implementação existente
do checkout principal sem reconstruir questões ou imagens e preserva a História de agosto.

## Histórico técnico anterior

Em 05/10/2026 passaram build, formatação, lint, 69 regressões direcionadas e os 350 testes
globais da implementação isolada, com inspeção visual. A suíte específica
`tests/historia-mariana-memorias-outubro-2026.spec.js` contém 20 casos: percurso com gabarito
independente, erros e correção, reversão, recarga, isolamento, sessões, ditado, armazenamento
adverso, teclado/toque, três viewports, axe-core, console e `file://`.

Esse histórico é distinto da validação da integração das quatro revisões. Materiais escolares,
prompts, PDFs, capturas e dados pessoais permanecem fora dos commits.

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
