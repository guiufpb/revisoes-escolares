# ADR-001 — Proteção de áudio no Chromium/Windows

- **Estado:** aceita
- **Data:** 18 de setembro de 2026

## Contexto

O Chromium/Windows pode cortar o início de um novo `SpeechSynthesisUtterance`. Em uso real,
`barata` foi percebida como `prata` e o aviso `Listen.` como `ten`. Aumentar pausas entre utterances
não eliminou o problema, porque cada nova fala criava outra fronteira sujeita ao corte.

## Decisão

O áudio compartilhado usa um único utterance audível por solicitação quando possível. O conteúdo é
protegido por uma introdução curta dentro da mesma fala: `A palavra é:`, `A frase é:`, `Instrução:`,
`Word:` ou `Phrase:`. `Listen.`, `Atenção.` e aquecimento quase inaudível deixam de ser utterances
separados.

## Consequências

- menos falas, timers, estados intermediários e pontos de corrida;
- conteúdo protegido sem revelar resposta na interface;
- repetição reproduz exatamente a mesma solicitação protegida;
- mocks validam payload, idioma, velocidade e cancelamento;
- audição humana no Windows continua obrigatória para confirmar a acústica da voz instalada.

## Evitar

Não reintroduzir aviso em utterance separado nem tratar o defeito apenas com delays. Uma mudança
futura desta decisão requer evidência comparativa em uso real e atualização deste ADR e da fonte
normativa [Áudio e voz](../infraestrutura/AUDIO_E_VOZ.md).
