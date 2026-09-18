# Instruções atualizadas do projeto

## Objetivo

Manter o **Revisões Escolares** como ambiente local, infantil, acessível e confiável. Toda mudança
deve conservar o que já funciona, preservar progresso e permitir que a estudante se recupere de
erros sem abandonar a atividade.

## Antes de alterar

1. Leia `AGENTS.md`, este mapa e o documento temático relacionado.
2. Execute `git status --short --branch` e preserve trabalho pendente e stashes.
3. Identifique perfil, matéria, revisão, controlador, chave e testes atingidos.
4. Para revisão nova, leia o modelo e examine uma implementação equivalente.
5. Não reprocese material escolar já sintetizado sem dúvida pontual indispensável.

## Arquitetura

1. **HTML/CSS:** painéis, cartões, controles e layout.
2. **Registros:** metadados de revisões, Inglês e Leitura.
3. **Controladores compartilhados:** navegação, armazenamento, áudio, questionários, leitura e
   Matemática.
4. **Conteúdo por perfil:** `ambiente_interativo/revisoes/alice/` e `mariana/`.
5. **Build:** `app.entry.js` gera `app.bundle.js`; PDF.js tem build próprio.
6. **Testes:** Playwright e axe-core em `tests/`.

Comportamento reutilizável pertence aos controladores; enunciados, respostas e exemplos pertencem
ao conteúdo. Não duplique um motor inteiro para trocar matéria ou perguntas.

## Roteamento por domínio

- [Áudio e voz](infraestrutura/AUDIO_E_VOZ.md): `audio.js`, Inglês, ditado, prefixos, vozes e
  validação humana.
- [Questionários e interações](infraestrutura/QUESTIONARIOS_E_INTERACOES.md): campos, alternativas,
  seleção, ordenação, mapa visual e motores declarativos.
- [Armazenamento e progresso](infraestrutura/ARMAZENAMENTO_E_PROGRESSO.md): chaves, normalização,
  recarga, isolamento e limpeza.
- [Layout e acessibilidade](infraestrutura/LAYOUT_E_ACESSIBILIDADE.md): desktop amplo, celular,
  teclado, toque e axe-core.
- [Testes e validação real](infraestrutura/TESTES_E_VALIDACAO_REAL.md): comandos, matriz de risco,
  suíte global e limites da automação.
- [Matemática e ordenação](infraestrutura/MATEMATICA_E_ORDENACAO.md): cenas, operações, cartões e
  regras manipulativas.
- [Leitura e PDF.js](infraestrutura/LEITURA_E_PDF.md): cadastro de livros, leitor e integração.
- [Qualidade das questões](pedagogia/QUALIDADE_DAS_QUESTOES.md): ambiguidade, bancos fechados,
  imagens e distribuição de gabarito.
- [Computação](../computacao/README.md): fluxo editorial e continuidade da coleção.

## Decisões transversais

- Preserve o contrato `errar → conferir → corrigir → conferir → avançar → voltar → recarregar`.
- Uma rodada com novo significado recebe ID ou chave versionada nova; a anterior não é apagada.
- A aplicação continua sem dependência obrigatória da internet e sem serviço externo de voz.
- Bundles gerados nunca são editados manualmente.
- Conteúdo privado orienta a análise, mas não entra no repositório.
- Interface global, controladores e persistência só mudam quando a capacidade precisa ser comum.
- `INVENTARIO_IMPLEMENTACOES.md` descreve o estado atual; o relatório interativo registra fatos
  históricos; ADRs explicam decisões; documentos temáticos guardam regras vigentes.

## Critérios de aceite

- Pedido funciona no fluxo real e comportamento fora do escopo foi preservado.
- Perfis, revisões, chaves e pontos continuam isolados.
- Erro permanece corrigível e a recarga restaura lógica e interface.
- Teclado, toque e mouse têm caminhos adequados; celular não tem overflow horizontal.
- Build, formatação, lint e testes aplicáveis passaram.
- Documentação e inventário refletem a capacidade atual.
- Git e privacidade foram auditados antes de qualquer publicação autorizada.

## GitHub e publicação

- Use branch com prefixo `codex/` e preserve commits e trabalho local existente.
- Selecione arquivos intencionais; não use `git add -A`, `git add .` ou `git add -f` como atalho.
- Commit, push, PR, merge e publicação exigem autorização explícita.
- Mantenha a PR em rascunho enquanto houver trabalho ou decisão pendente.
- Antes do merge, aguarde o check **Formatação, lint e testes**; abra logs completos somente para
  investigar falha.
- Não exponha dados pessoais em issue, commit, PR ou artefato público.
