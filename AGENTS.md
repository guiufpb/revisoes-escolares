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
- Na página inicial de vocabulário, clicar ou pressionar Enter/Espaço em uma palavra ou frase deve selecioná-la e iniciar imediatamente a pronúncia em inglês na velocidade 0,62. Preserve os botões de velocidade, repetição e parada como controles adicionais e nunca inicie áudio apenas ao abrir a página ou trocar de grupo.
- Mantenha repetir, parar, cancelamento da sequência anterior e retorno acessível do estado do áudio.

## Ditados em lacunas de Português

- Quando uma lacuna pedir uma palavra que não possa ser deduzida com segurança apenas pelo enunciado visível, ofereça ditado opcional da resposta em `pt-BR`.
- Use somente `ambiente_interativo/js/audio.js`; não revele a resposta escrita no botão, no DOM visível ou no rótulo acessível.
- O áudio exige ação da criança, anuncia “Atenção”, fala uma palavra por vez e oferece repetir e parar.
- Preserve digitação, acentuação, correção recuperável e progresso; o ditado é apoio auditivo, não preenchimento automático.
- Teste teclado, cancelamento da fala anterior, troca de etapa, voz local, celular, axe-core e `file://`.

## Qualidade proporcional ao risco

Para toda mudança de código, execute na raiz:

```text
npm run build
npm run format:check
npm run lint
```

Acrescente regressão para o comportamento alterado e execute os testes direcionados da revisão,
do controlador ou da tela afetada. A validação direcionada deve cobrir, quando aplicável: caminho
feliz, primeira tentativa errada, correção sem pular, desfazer, avançar, voltar, recarregar,
persistência de várias ações, isolamento entre perfis e revisões, teclado, ponteiro, viewport móvel
de 390 × 844, axe-core, ausência de rolagem horizontal e console sem erros graves.

Execute a suíte global `npm test`:

- a cada três novas revisões ou conjuntos independentes de atividades baseados em infraestrutura
  já estabilizada; perguntas ou etapas da mesma revisão contam como um único conjunto;
- imediatamente quando houver mudança de comportamento em navegação, registros compartilhados,
  armazenamento, áudio, controladores compartilhados, CSS estrutural, HTML global, build, bundle,
  PDF.js, `file://`, pontuação, conclusão, limpeza ou restauração;
- antes de consolidar na `main` um lote que ainda não tenha passado pela suíte global.

Uma inclusão somente declarativa pode ficar nos testes direcionados mesmo quando precisar de um
novo import, cartão ou cadastro central sem mudança de comportamento. Se houver dúvida sobre o
alcance, falha inesperada ou interferência entre perfis, antecipe `npm test`.

Em pull requests, mantenha a suíte global no GitHub Actions e aguarde o check “Formatação, lint e
testes”. Para mudanças de conteúdo já cobertas localmente por testes direcionados, não é necessário
repetir a suíte global local antes da CI, salvo nos gatilhos acima. Consolide os commits antes do
push quando possível para evitar execuções remotas desnecessárias.

Mudanças apenas em documentação podem ser validadas com conferência dos links e `git diff --check`.

## Organização

- Registros centrais: `ambiente_interativo/js/registro-*.js`.
- Controladores compartilhados: `ambiente_interativo/js/`.
- Conteúdo específico: `ambiente_interativo/revisoes/<perfil>/`.
- Testes: `tests/`.
- Documentação central: `documentacao/ambiente-interativo/`.
- Automação do GitHub: `.github/`.

Atualize o inventário e as instruções quando uma mudança alterar arquitetura, conteúdo disponível, armazenamento, comandos, testes ou automações.
