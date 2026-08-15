# Instruções do projeto Revisões Escolares

Estas regras valem para todo o repositório. O projeto é um ambiente escolar local, usado por crianças, e exige preservação rigorosa de progresso, acessibilidade e correção pedagógica.

## Leitura obrigatória antes de alterar o projeto

1. Leia `documentacao/ambiente-interativo/INSTRUCOES_PROJETO.md`.
2. Consulte `documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md` para saber o que já existe.
3. Para uma nova revisão, leia também `ambiente_interativo/revisoes/MODELO_NOVA_REVISAO.txt`.
4. Para histórico detalhado, consulte `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`.

## Regras essenciais

- Preserve alterações existentes e nunca apague progresso, conteúdo ou infraestrutura de outro perfil para simplificar uma tarefa.
- Mantenha Alice e Mariana isoladas por perfil, matéria, revisão e chave de armazenamento.
- Nunca use `localStorage.clear()`. Remova somente a chave da revisão ativa.
- Toda rodada que deve começar do zero precisa de chave versionada nova; não reutilize uma chave antiga com significado diferente.
- O ambiente deve continuar local: sem CDN, API, fonte, áudio ou recurso obrigatório da internet.
- Não publique PDFs escolares, pastas identificadas por aluna ou documentos pessoais. Esses itens são ignorados pelo Git.
- Não edite `ambiente_interativo/js/app.bundle.js` nem `ambiente_interativo/js/pdfjs.bundle.mjs` manualmente. Edite as fontes e execute `npm run build`.
- Preserve o funcionamento por servidor local e, para a aplicação principal, por `file://` com o bundle gerado.
- Não faça commit, push, merge, publicação ou mudança de visibilidade sem autorização explícita do usuário para essa ação.

## Contrato obrigatório das atividades

- Errar deve ser recuperável sem pular a etapa.
- O fluxo mínimo é: errar → conferir → corrigir → conferir → avançar → voltar → recarregar.
- Toda ação de colocar, ordenar ou arrastar deve ter forma clara de desfazer: clicar para devolver, arrastar de volta, botão de remoção, desfazer ou limpar a cena.
- Arrastar nunca pode ser o único meio: ofereça clique/toque e teclado.
- Ao recarregar, restaure simultaneamente o estado visual, o estado lógico, a etapa e a pontuação.
- Em Matemática manipulativa, a área grande da coluna deve aceitar clique depois da seleção da peça, mas ordens incompatíveis devem continuar bloqueadas.
- Várias ações consecutivas precisam ser persistidas; não salve apenas a primeira por causa de referências de objeto reutilizadas.
- Ao sair e reabrir, não duplique listeners nem ações.
- Mensagens de erro e sucesso devem ser pedagógicas, específicas e anunciadas por `aria-live`.

## Inglês e pronúncia

- Use apenas o módulo compartilhado `ambiente_interativo/js/audio.js` para síntese de voz.
- Mantenha vozes locais `pt-BR` e `en-US`, sem microfone ou serviço de nuvem.
- Preserve o aquecimento quase inaudível e as pausas que protegem “Listen” e a primeira palavra contra cortes do Chromium/Windows.
- Preserve as velocidades 0,62 para “Ouvir em inglês” e 0,50 para “Ouvir devagar”; a opção lenta deve continuar natural, sem soletrar ou separar sílabas artificialmente.
- Mantenha repetir, parar, cancelamento da sequência anterior e retorno acessível do estado do áudio.

## Qualidade mínima

Para mudanças de código, execute na raiz:

```text
npm run build
npm run format:check
npm run lint
npm test
```

Acrescente regressão para o comportamento alterado. Teste desktop, viewport móvel de 390 × 844, teclado, ponteiro, recarga, armazenamento bloqueado quando aplicável, ausência de rolagem horizontal e console sem erros graves.

Mudanças apenas em documentação podem ser validadas com conferência dos links e `git diff --check`.

## Organização

- Registros centrais: `ambiente_interativo/js/registro-*.js`.
- Controladores compartilhados: `ambiente_interativo/js/`.
- Conteúdo específico: `ambiente_interativo/revisoes/<perfil>/`.
- Testes: `tests/`.
- Documentação central: `documentacao/ambiente-interativo/`.
- Automação do GitHub: `.github/`.

Atualize o inventário e as instruções quando uma mudança alterar arquitetura, conteúdo disponível, armazenamento, comandos, testes ou automações.
