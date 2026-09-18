# Áudio e voz

Esta é a fonte normativa do áudio compartilhado do Ambiente Interativo.

## Fonte única e privacidade

Use `ambiente_interativo/js/audio.js` para síntese de voz de Inglês e dos questionários
declarativos. Não crie `speechSynthesis` paralelo em uma revisão. Use somente vozes locais,
`pt-BR` para Português e `en-US` para Inglês; mantenha `voiceschanged` e a preferência por
correspondência exata do idioma e vozes naturais/neural.

Não há microfone, gravação, reconhecimento, avaliação automática da fala, upload ou API. O áudio
só começa após ação explícita da criança. Abrir tela ou trocar grupo não pode reproduzir som.

## Um utterance protegido por solicitação

O Chromium/Windows pode cortar o início de **cada** novo `SpeechSynthesisUtterance`. Pausas entre
falas não corrigem essa fronteira: em uso real, `barata` foi percebida como `prata` e `Listen.` como
`ten`. A decisão vigente está no
[ADR-001](../decisoes/ADR-001-PROTECAO_AUDIO_CHROMIUM_WINDOWS.md).

Cada solicitação usa um único utterance audível, com prefixo sacrificial dentro da mesma fala:

| Idioma e unidade | Payload enviado ao sintetizador |
| --- | --- |
| `pt-BR`, palavra | `A palavra é: <resposta>` |
| `pt-BR`, frase | `A frase é: <resposta>` |
| `pt-BR`, instrução | `Instrução: <texto>` |
| `en-US`, palavra | `Word: <target>` |
| `en-US`, frase | `Phrase: <target>` |

`unidadeAudio` aceita `palavra`, `frase` ou `instrucao`. Ditados antigos continuam compatíveis com
`unidadeDitado`. Não deduza frase apenas por espaços ou pontuação; conteúdo declarativo marca a
unidade quando ela não for a palavra padrão.

Não reintroduza aquecimento, `Listen.`, `Atenção.` ou outro aviso como utterance separado, nem tente
resolver corte acústico apenas aumentando delays sem nova evidência comparativa.

## Velocidades e controles

- Inglês normal: `rate = 0.62`.
- Inglês devagar: `rate = 0.50`, com fala contínua, sem soletrar ou separar sílabas.
- Ditado de Português: `rate = 0.78`.
- Instrução em Português: velocidade declarada pelo controlador; atualmente `0.88` em Inglês.
- Todo áudio usa `pitch = 1`.

Preserve Ouvir, Ouvir devagar, Repetir, Parar e cancelamento da solicitação anterior. Repetir envia
o mesmo payload protegido, idioma, unidade e velocidade. Nova solicitação invalida callbacks da
anterior e cancela a fila para impedir sobreposição. Clique, toque, `Enter` e `Espaço` continuam
disponíveis onde já fazem parte do controle.

## Ditado e não exposição

Ditado é apoio auditivo e não preenchimento automático. A resposta pode existir na configuração
interna e no payload do sintetizador, mas não antes da conferência em botão, texto visível,
`aria-label`, `title`, atributo de interface ou mensagem `aria-live`.

Ofereça ditado opcional quando a palavra não puder ser deduzida com segurança do enunciado. Preserve
digitação, acentuação, erro recuperável e progresso mesmo sem áudio. A interface anuncia somente
estados genéricos como preparação, reprodução, conclusão, interrupção e erro.

## Testes automáticos e audição humana

Mocks verificam o payload efetivo, quantidade de utterances, idioma, voz local, velocidade,
repetição, parada, cancelamento, ausência de início automático e ausência de vazamento no DOM.
Cubra revisão antiga e atual de Inglês, ditado legado, Gramática atual e `file://` conforme o risco.

Mocks não provam a acústica da voz instalada. Depois de mudança compartilhada, peça audição no
Windows de palavra inglesa normal/devagar/repetida, uma frase inglesa, `barata`, outra palavra
iniciada por vogal, uma frase curta e a troca após Parar. Só registre validação real quando o usuário
a confirmar.

A arquitetura vigente desde 18/09/2026 teve validação acústica humana concluída com sucesso no
Chromium/Windows em Português e Inglês. Mudanças compartilhadas futuras exigem nova validação
proporcional ao risco.
