# Instruções do projeto Revisões Escolares

Este repositório contém um ambiente escolar local usado por crianças. Preserve progresso,
acessibilidade, correção pedagógica e privacidade em toda mudança.

## Precedência e leitura inicial

1. Siga este arquivo.
2. Leia `documentacao/ambiente-interativo/INSTRUCOES_PROJETO.md` e o documento temático da mudança.
3. Consulte `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md` para o estado atual.
4. Em revisão nova, leia `ambiente_interativo/revisoes/MODELO_NOVA_REVISAO.txt`.
5. Use `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt` somente para histórico detalhado.

Antes de editar, execute `git status --short --branch` e preserve alterações, arquivos locais e
stashes existentes.

## Invariantes críticos

- Preserve revisões anteriores e isole Alice e Mariana por perfil, matéria, revisão e chave.
- Nunca use `localStorage.clear()`; remova somente a chave da revisão ativa.
- Use chave versionada nova quando respostas antigas puderem adquirir outro significado.
- Mantenha o ambiente local, sem CDN, API, fonte, voz ou recurso obrigatório da internet.
- Não edite `ambiente_interativo/js/app.bundle.js` nem `pdfjs.bundle.mjs` manualmente; edite fontes
  e execute o build.
- Não publique PDF escolar, OCR, print, pasta identificada por aluna ou documento pessoal.
- Reutilize registros e controladores compartilhados; conteúdo específico fica em
  `ambiente_interativo/revisoes/<perfil>/`.

## Contrato geral das atividades

O fluxo mínimo é:

`errar → conferir → corrigir → conferir → avançar → voltar → recarregar`

Restaure juntos estado visual, estado lógico, etapa e pontuação. Toda manipulação precisa ser
reversível; arrastar nunca pode ser o único meio. Preserve clique, toque, teclado, foco visível,
mensagens pedagógicas por `aria-live` e pontuação sem duplicação.

## Git e publicação

Não use `git reset --hard`, `git clean -fd`, `git add -A`, `git add .` ou `git add -f` como atalho.
Commit, push, PR, merge, publicação e mudança de visibilidade exigem autorização explícita.

## Qualidade proporcional ao risco

Toda mudança de código executa `npm run build`, `npm run format:check`, `npm run lint` e regressões
direcionadas. Mudanças em áudio, armazenamento, navegação, registros, controladores, CSS/HTML
estrutural, build, bundle, PDF.js, pontuação, conclusão, limpeza ou restauração exigem `npm test`.
Inclusões somente declarativas podem usar testes direcionados, salvo os demais gatilhos descritos
na política temática. Não reduza testes para fazê-los passar.

## Mapa de regras especializadas

| Tema | Fonte normativa |
| --- | --- |
| Arquitetura e roteamento | `documentacao/ambiente-interativo/INSTRUCOES_PROJETO.md` |
| Áudio, voz, Inglês e ditado | `documentacao/ambiente-interativo/infraestrutura/AUDIO_E_VOZ.md` |
| Questionários e interações | `documentacao/ambiente-interativo/infraestrutura/QUESTIONARIOS_E_INTERACOES.md` |
| Armazenamento e progresso | `documentacao/ambiente-interativo/infraestrutura/ARMAZENAMENTO_E_PROGRESSO.md` |
| Layout e acessibilidade | `documentacao/ambiente-interativo/infraestrutura/LAYOUT_E_ACESSIBILIDADE.md` |
| Testes e validação real | `documentacao/ambiente-interativo/infraestrutura/TESTES_E_VALIDACAO_REAL.md` |
| Matemática e ordenação | `documentacao/ambiente-interativo/infraestrutura/MATEMATICA_E_ORDENACAO.md` |
| Leitura e PDF.js | `documentacao/ambiente-interativo/infraestrutura/LEITURA_E_PDF.md` |
| Qualidade pedagógica e gabaritos | `documentacao/ambiente-interativo/pedagogia/QUALIDADE_DAS_QUESTOES.md` |
| Computação | `documentacao/computacao/README.md` |
| Orquestração e economia | `.agents/skills/revisoes-escolares/references/orquestracao-economia.md` |

Atualize a fonte temática e o inventário quando uma mudança alterar arquitetura, conteúdo,
armazenamento, comandos, testes ou automações.
