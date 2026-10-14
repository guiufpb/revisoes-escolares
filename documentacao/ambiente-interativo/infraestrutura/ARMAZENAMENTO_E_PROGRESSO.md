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

Uma revisão pode declarar, de forma opt-in, sessões autorizadas pelo **Modo Responsável**. Cada
sessão precisa ter ID, nome e chave próprios; a sessão principal conserva exatamente a chave já
registrada da revisão. Trocar de sessão salva integralmente a atual e carrega a outra pelo mesmo
`ArmazenamentoRevisoes`, sem copiar, migrar, reinterpretar ou apagar dados entre chaves.

O salto administrativo persiste somente a posição da questão na sessão escolhida. O bypass de
navegação é efêmero e não entra no objeto de progresso: não conclui estudo, escrita ou história,
não marca áudio, resposta, conferência, revisão pós-resposta, tentativa, ponto nem questão anterior.
A limpeza continua removendo somente a chave da sessão ativa; limpar a sessão principal ou a
auxiliar nunca remove silenciosamente a outra.

Em questionários, `obterEstado` e o status do cartão consultam sempre a chave principal, mesmo
quando a sessão auxiliar está aberta. O estado da sessão auxiliar é salvo na própria chave a cada
ação. Depois de recarregar a aplicação, o cartão abre a sessão principal; o painel administrativo
permite selecionar novamente a auxiliar e continuar exatamente do ponto salvo.

## Mudanças de contrato

Migração só é apropriada quando o significado anterior pode ser preservado com segurança. Se uma
atividade mudou de sentido, use chave nova. Não simplifique implementação destruindo ou reinterpretando
progresso já existente. Alterações compartilhadas de armazenamento, limpeza ou restauração exigem
regressões direcionadas e `npm test`.


## Estado opt-in de Inglês com subitens

Moving Around usa duas chaves novas v1, principal de Mariana e auxiliar genérica do responsável;
não há migração nem reutilização das chaves antigas. `ditadoEmExibicao` e
`estimulosOuvidos` são campos da unidade optante. A lista de estímulos aceita apenas IDs
declarados; respostas estruturadas mantêm somente subitens/opções válidos, eliminam duplicações,
ordenam seleções e preservam sequências. Campos conservam texto para edição.

Conferência e consolidação são revalidadas contra a resposta normalizada inteira. Assinatura
incompatível invalida a consolidação; progresso incompatível com unidade/versão é ignorado.
O ponto deriva de resposta correta com consolidação válida, sem incremento duplicado.
Posição, modo, respostas, audições e progresso visual são restaurados juntos; abrir novamente
a unidade retoma atividade/resultado quando cabível. Sessões usam o armazenamento existente.
Mudança de resposta invalida conclusão anterior. Limpeza seletiva permanece obrigatória.
