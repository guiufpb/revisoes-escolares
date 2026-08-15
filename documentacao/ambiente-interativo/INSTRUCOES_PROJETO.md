# Instruções atualizadas do projeto

## 1. Objetivo

Manter e ampliar o **Revisões Escolares** como ambiente local, infantil, acessível e confiável. Toda mudança deve conservar o que já funciona e permitir que a estudante se recupere de erros sem abandonar uma atividade.

## 2. Antes de alterar

1. Leia o `AGENTS.md` da raiz e este documento por inteiro.
2. Confira `git status --short --branch` e preserve arquivos já modificados.
3. Identifique perfil, matéria, revisão, controlador, chave e testes atingidos.
4. Para revisão nova, leia `ambiente_interativo/revisoes/MODELO_NOVA_REVISAO.txt`.
5. Faça validação de base proporcional ao risco.
6. Examine o fluxo real no navegador quando a tarefa for visual ou interativa.

Não remova uma implementação para facilitar outra. Se a solicitação for uma rodada nova, preserve a antiga e use chave versionada nova.

## 3. Arquitetura

1. **HTML/CSS:** painéis, cartões, controles e layout.
2. **Registros:** metadados de revisões, Inglês e Leitura.
3. **Controladores compartilhados:** navegação, armazenamento, áudio, desenho, leitura e Matemática.
4. **Conteúdo por perfil:** `ambiente_interativo/revisoes/alice/` e `mariana/`.
5. **Build:** `app.entry.js` gera `app.bundle.js`; PDF.js tem build próprio.
6. **Testes:** Playwright e axe-core em `tests/`.

Coloque comportamento reutilizável nos controladores e exemplos/perguntas nos arquivos da revisão. Não duplique um controlador inteiro apenas para trocar conteúdo.

## 4. Arquivos gerados e privados

Nunca edite manualmente:

- `ambiente_interativo/js/app.bundle.js`
- `ambiente_interativo/js/pdfjs.bundle.mjs`

Altere as fontes e execute `npm run build`.

Não publique pastas numeradas das alunas, PDFs escolares reais, documentos pessoais, resultados, caches ou capturas temporárias. Não contorne o `.gitignore` com `git add -f` sem autorização e revisão específica.

## 5. Revisões e armazenamento

Cada revisão precisa de ID único, perfil, cartão, painel, título, total correto, chave exclusiva e controlador quando aplicável.

Padrão recomendado:

```text
revisoesEscolares.<perfil>.<materia>.<revisao>.v<versao>
```

Avance a versão quando etapas mudarem de significado, respostas antigas puderem ser mal interpretadas ou a tarefa pedir nova rodada limpa. Não apague a chave anterior automaticamente.

Todo carregamento deve tolerar dados ausentes, JSON corrompido, versão incompatível, etapas fora do limite e `localStorage` bloqueado. Use fallback em memória.

Regras de persistência:

- salve cada ação significativa;
- não dependa só da identidade da referência de um objeto mutável;
- restaure estado lógico e visual juntos;
- teste várias ações seguidas antes da recarga;
- nunca use `localStorage.clear()`;
- “Limpar” remove somente a chave ativa.

## 6. Contrato pedagógico

Toda atividade editável, ordenável ou manipulável deve passar por:

```text
errar → conferir → corrigir → conferir → avançar → voltar → recarregar
```

- A primeira tentativa errada não bloqueia a correção.
- A criança não precisa usar “Próxima” para escapar de uma etapa travada.
- Todo item colocado continua visível e pode ser retirado, devolvido ou desfeito.
- O estado restaurado oferece as mesmas ações do estado recém-criado.
- “Conferir” explica o que falta sem entregar toda a solução.
- Pontos e conquistas são concedidos uma única vez.
- Voltar não duplica pontos, peças, listeners ou respostas.

### Arrasto

- Use Pointer Events para mouse e toque.
- Ofereça também clique/toque e teclado.
- Cartão colocado pode voltar por clique, novo arrasto ou controle explícito.
- Suprima somente o clique sintético ligado ao `pointerup`; preserve o clique legítimo seguinte.
- Teste após recarregar dados persistidos.

## 7. Matemática manipulativa

- A seleção precisa de indicação visual e acessível.
- Coloque peças pelo botão, clique na área grande ou teclado.
- A área clicável corresponde ao quadro visual inteiro.
- Cubinho→U, barra→D, placa→C e cubo→M.
- Rejeite ordem incompatível com mensagem pedagógica e sem mover a peça.
- Remoção recalcula contagens, número e decomposição.
- Trocas exigem exatamente 10 peças e preservam o valor: 10 U→1 D, 10 D→1 C e 10 C→1 M.
- Desfazer e recarregar preservam a representação anterior ou trocada.
- No ábaco, declare se a tarefa é montar ou ler, mostre apenas hastes necessárias e descreva cada haste de modo acessível.
- Use o modelo de nova revisão, atualize cartão, registro, chave, total, testes e inventário.

## 8. Ordenação de cartões

- Reconstrua bandeja e posições a partir do estado atual.
- Restaure cartões colocados dentro da área correta.
- Reexiba cartões disponíveis na bandeja.
- Depois de conferir errado, mantenha ativos todos os controles de correção.
- Atualize o modelo de dados, não apenas o DOM.
- Teste expressamente um cartão errado na primeira posição.

## 9. Inglês e pronúncia

### Fonte única

Use `ambiente_interativo/js/audio.js`. Uma revisão não deve criar outra implementação direta de `speechSynthesis`.

### Idiomas e voz local

- Instruções: `pt-BR`.
- Palavras e frases estudadas: `en-US`.
- Considere apenas vozes locais.
- Preserve a seleção que prefere correspondência exata de idioma e vozes naturais/neural quando disponíveis.
- Continue reagindo a `voiceschanged`.
- Se faltar voz, oriente a instalação local no Windows; não migre para serviço online.

### Sequência que protege a pronúncia

Preserve a ordem e os valores atuais, salvo teste comparativo que demonstre melhoria:

1. espera de 1.000 ms;
2. aquecimento “Ready.”/“Preparando.” com volume 0,01;
3. pausa de 250 ms;
4. aviso “Listen.”/“Atenção.” em fala separada;
5. pausa de 600 ms;
6. conteúdo em outra fala.

Essa sequência absorve o corte inicial do Chromium/Windows antes da palavra estudada.

### Velocidades

- “Ouvir em inglês”: `rate = 0.62`.
- “Ouvir devagar”: `rate = 0.50`.
- `pitch = 1`.
- Não soletrar nem separar sílabas artificialmente; a pronúncia deve permanecer contínua.

### Controles obrigatórios

- Ouvir instrução.
- Ouvir em inglês.
- Ouvir devagar.
- Repetir a última solicitação com mesmo idioma e velocidade.
- Parar e cancelar imediatamente fila, timer e fala.

Nova solicitação invalida a anterior para impedir sobreposição. Preserve mensagens acessíveis de espera, aviso, pausa, reprodução, conclusão, parada e erro.

### Privacidade e escopo pedagógico

- Sem microfone, gravação, reconhecimento, avaliação automática da fala, upload ou API.
- Não reproduza automaticamente ao abrir.
- Alice e Mariana mantêm progresso próprio.
- Na Unidade 3 atual, preserve 27 áudios antes das 10 atividades, salvo nova versão solicitada.
- Preserve alternativas estáveis e correção conjunta no final.

### Testes de áudio

- Simule vozes `pt-BR` e `en-US`.
- Verifique idioma, velocidade normal e devagar.
- Confirme atraso, aquecimento, aviso e conteúdo em ordem.
- Confirme que “Parar” e nova solicitação cancelam a anterior.
- Verifique “Repetir”.
- Cubra os 27 itens, desbloqueio, persistência e isolamento.
- Audite controles por teclado e em 390 × 844.
- Não dependa da voz específica instalada na máquina de CI.

## 10. Leitura

Para um livro novo:

1. confira PDF, páginas e capa;
2. cadastre recursos publicáveis em `leituras/<slug>/`;
3. registre metadados, perguntas, ditados e glossário;
4. crie arquivos dos dois perfis quando compartilhado;
5. use chaves separadas;
6. registre as revisões;
7. informe à CI o número exato de páginas;
8. teste ambos os perfis, primeira/última página, questionário, ditado, recarga e limpeza.

PDF.js permanece local. O leitor dedicado sincroniza páginas, cancela renderizações antigas e mostra glossário da página atual. Explicações não alteram pontos. O gerador da CI nunca sobrescreve PDF real.

## 11. Interface e acessibilidade

- Rótulos compreensíveis, elementos nativos e foco visível.
- Ordem lógica de tabulação.
- `aria-live` para mudanças importantes sem repetição excessiva.
- Texto alternativo adequado.
- Não depender só de cor.
- Sem rolagem horizontal em 390 × 844.
- Cabeçalho não encobre conteúdo.
- Áreas de toque confortáveis e movimento reduzido respeitado.
- Execute axe-core nas telas alteradas.

## 12. Testes obrigatórios

```text
npm run build
npm run format:check
npm run lint
npm test
```

Matriz mínima:

- caminho feliz e primeira tentativa errada;
- correção sem sair da etapa;
- retirar/desfazer;
- avançar, voltar e recarregar;
- várias ações persistidas;
- dados corrompidos e armazenamento bloqueado quando aplicável;
- teclado e ponteiro;
- viewport 390 × 844, sem overflow;
- console sem erro grave e axe sem violação grave/crítica;
- outro perfil/revisão preservado;
- `file://` para o fluxo principal.

Não reduza testes para fazer uma mudança passar.

Mudança apenas em Markdown/TXT não exige build, mas requer links válidos e `git diff --check`.

## 13. GitHub

1. Use branch `codex/`.
2. Preserve commits; não use reset destrutivo.
3. Revise o diff e selecione arquivos intencionais, sem `git add -A` às cegas.
4. Valide localmente.
5. Commit, push, PR, merge ou publicação somente com autorização explícita.
6. Aguarde o check “Formatação, lint e testes”.
7. Mantenha PR em rascunho enquanto houver trabalho ou decisão pendente.

GitHub Actions, Dependabot, artefatos de falha, formulário de bug e proteção da `main` já estão configurados. Não inclua dados pessoais em issue, commit, PR ou artefato público.

## 14. Critérios de aceite

- Pedido funciona no fluxo real.
- Comportamento fora do escopo foi preservado.
- Perfis e revisões permanecem isolados.
- Erro é corrigível sem pular.
- Teclado, toque e mouse têm alternativa adequada.
- Desktop, celular, armazenamento e recarga foram verificados.
- Não há erro grave no console.
- Build, formatação, lint e testes aplicáveis passaram.
- Documentação foi atualizada quando a capacidade mudou.
- Relatório final informa arquivos, benefícios, testes e limites.

## 15. Manutenção desta documentação

Atualize o inventário quando houver nova revisão, livro, etapa, controlador, chave, interação, teste, comando ou automação. Atualize estas instruções sempre que uma experiência revelar nova regra de prevenção.
