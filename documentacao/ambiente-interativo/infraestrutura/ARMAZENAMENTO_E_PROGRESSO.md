# Armazenamento e progresso

Cada revisão possui ID, perfil, matéria, total e chave exclusivos. Use o padrão
`revisoesEscolares.<perfil>.<materia>.<revisao>.v<versao>` e avance a versão quando etapas ou
respostas antigas puderem adquirir outro significado. Não apague a chave anterior automaticamente.

## Regras de persistência

- Salve cada ação significativa, não apenas a primeira mutação de um objeto reutilizado.
- Restaure estado lógico e visual, etapa, respostas, conferências, pontos e bloqueios em conjunto.
- Ignore IDs inexistentes, duplicatas, índices inválidos e estruturas incompatíveis.
- Tolere ausência de dados, JSON corrompido e `localStorage` bloqueado com fallback em memória.
- Nunca use `localStorage.clear()`; Limpar remove somente a chave ativa.
- Voltar ou reabrir não duplica pontos, listeners, peças ou ações.
- Edição posterior a um acerto invalida a conferência quando o objetivo exigir nova checagem.

## Isolamento

Alice e Mariana não compartilham progresso. Matérias, revisões anteriores e novas rodadas também
permanecem independentes. Testes de limpeza sempre deixam marcadores em chaves vizinhas e confirmam
que somente a chave ativa foi removida.

## Mudanças de contrato

Migração só é apropriada quando o significado anterior pode ser preservado com segurança. Se uma
atividade mudou de sentido, use chave nova. Não simplifique implementação destruindo ou reinterpretando
progresso já existente. Alterações compartilhadas de armazenamento, limpeza ou restauração exigem
regressões direcionadas e `npm test`.
