# Mariana — Moving Around · Transport & Safety

Implementação local em 06/10/2026, a partir da síntese de implementação fornecida pelo responsável.
O documento pessoal de origem permanece em `tmp/`, fora da publicação.

## Conteúdo e cobertura

- Revisão: `mariana-ingles-means-of-transportation-outubro-2026`.
- Unidade: `means-of-transportation-outubro-2026`, versão 1, exclusiva do perfil Mariana.
- 20 ditados em três grupos (9 transportes, 4 equipamentos, 7 frases), com estudo ilustrado separado.
- Story Time local em quatro cenas, com textos EN/PT e apoio visual; a história precede sua cobrança.
- 25 questões, 61 unidades de resposta e máximo de 25 pontos; o catálogo registra 46 etapas.
- Reconhecimento visual/auditivo, escrita, associação, classificação, bancos reutilizáveis, ordenação,
  seleção exata, contagem, comparação, segurança, leitura de tabelas, história e direção.
- Apoios, pausas, autoavaliação e glossário permanecem fora da pontuação.
- Cinco conversas opcionais, dez modelos locais a 0,50, pelo controlador de pronúncia existente.

Q03/Q07 exigem a audição de cada estímulo a/b além da pergunta. Q05 exige palavras completas.
Q16 permite retirar e recolocar ações. Q22 aceita exatamente train/bus, e Q25 exatamente boat/bike;
opções extras invalidam a seleção. Q23 preserva a tabela Day/Trip.
Cada tentativa usa os quatro passos completos EN → PT → EN → PT da síntese. Uma questão vale um
ponto apenas após todos os subitens corretos e sua consolidação completa. Editar exige nova conferência.

## Arquitetura e progresso

Conteúdo em `ambiente_interativo/revisoes/mariana/ingles-means-of-transportation-outubro-2026.js`.
`ingles-interacoes.js` renderiza e valida subitens opt-in; `ingles.js` continua responsável por
sessões, áudio, navegação, pontuação, conclusão e restauração. O comparador de conjuntos existente
de QuestionariosInteracoes é reutilizado. Não há controlador paralelo nem alteração em audio.js/gateway.

Chave principal: `revisoesEscolares.mariana.ingles.meansOfTransportationOutubro2026.v1`.
Chave auxiliar: `revisoesEscolares.responsavel.ingles.marianaMeansOfTransportationOutubro2026.v1`.
O Modo Responsável usa sessão genérica, sem criar atividade em Alice. Salto altera só posição;
limpeza remove só a chave ativa. Respostas estruturadas, posição, audições e assinaturas de revisão
são restauradas juntos. Assinaturas inválidas e valores fora do contrato são descartados.
Não há migração de revisões anteriores.

Ditado usa IDs opacos d01–d20 e etiquetas Item N. A tela de estudo possui ordem própria.
A audição de estudo não libera o ditado; só o término válido da reprodução no ditado conta.
Parar, trocar sessão/revisão/item e sair invalidam callbacks antigos. Superfícies anteriores de
resultado/pronúncia são limpas ao voltar ao ditado. A tolerância de pontuação/apóstrofos e variantes
explícitas limita-se a esta unidade; os campos de Q05 conservam validação de palavra completa.

## Ativos originais e revisão visual

57 SVGs locais em `assets/ingles-means-of-transportation-outubro-2026/`, reproduzíveis com
`python scripts/gerar_assets_ingles_transportes.py` (biblioteca padrão).
Inspeção de todas as folhas de ativos, seguida de correções: quatro rodas visíveis no carro,
seis assentos no modelo de ônibus, avião/helicóptero no céu, comparação de capacetes com a mesma
base, duas bicicletas e coletes no plano final. O mapa mantém cais à esquerda, parque à direita,
S no centro e somente a seta para o cais.
Descrições acessíveis acompanham as figuras e preservam as relações cobradas.

A conferência final de Q25 em 1366, 1920 e 390 pixels mostrou alternativas legíveis, cena ampla
e largura da página igual à viewport. Isso não substitui os testes de teclado/toque/axe de todas
as etapas nem validação pela criança.

## Validação

Implementação e revisão estática dos pontos sensíveis concluídas; auditoria read-only confirmou
IDs, chaves, contagens e escopo. `npm run build`, `npm run format:check`, `npm run lint` e
`git diff --check` aprovados no checkpoint final; nenhum resultado de suíte é presumido.
Teste novo: `tests/ingles-mariana-transportes-outubro-2026.spec.js`, com gabarito independente.
Testes direcionados, regressões legadas e `npm test` ficaram pendentes na pausa solicitada pelo usuário.
Na retomada em 07/10/2026: 15/15 testes novos (55,4s), 1/1 reforço de armazenamento adverso
(5,3s), 134/134 regressões (9,8m) e 407/407 na suíte global `npm test` (29,3m).
O reforço verifica opção inexistente, seleção duplicada/extra, estímulo desconhecido e assinatura
antiga sem fabricar conferência, ponto ou conclusão. Nenhuma correção do código de aplicação foi
necessária após a pausa; todas as 15 verificações novas passaram novamente na suíte global.
Os testes simulam vozes locais, microfone e serviço; não devem chamar Azure real.
Não houve confirmação acústica, gravação real nem uso pela criança.

Trabalho isolado da revisão de História pendente na pasta original. Nenhum commit, push, PR,
merge ou publicação foi executado. Os dez PDFs originais necessários às regressões foram preparados
localmente com hashes e número de páginas conferidos, permanecendo ignorados pelo Git.

## Abertura da cópia implementada

Esta inclusão está na worktree da tarefa, branch
`codex/mariana-ingles-transportes-outubro-2026`; a checkout principal não foi mesclada.
Na raiz dessa worktree, execute `npm run dev -- --port 5173 --strictPort` quando o servidor
da tarefa não estiver rodando. Abra `http://127.0.0.1:5173/ambiente_interativo/index.html`
e siga Mariana → Inglês → Moving Around · Transport & Safety.
Durante a validação, esse servidor apresentou o cartão novo e serviu os PDFs originais corretamente.
O launcher de pronúncia não é necessário para estudo e testes locais.
Preserve protocolo, host, porta e perfil habituais do navegador: são parte da origem do progresso.
Se a porta estiver ocupada por outra tarefa, não a encerre nem troque a origem sem diagnóstico.

## Integração local — Etapa 4, 13/10/2026

O histórico acima descreve a origem. A integração atual preserva conteúdo, IDs, chaves,
57 SVGs, gerador e os 19 testes atuais (incluindo os reforços posteriores de Q16).
Não reprocessa os materiais privados nem copia PDFs da origem.
Base autorizada: `4f447cf1a93c123478783acab0634bc305e7e7e1`; 66 cadastros únicos,
com os 65 objetos anteriores idênticos. A cópia de integração é isolada da pasta habitual.
Build, formatação, lint, diff e 19/19 testes próprios (1,3 min) aprovados.
Validação final da integração em 14/10/2026: próprios 19 passed (1.3m); regressões iniciais
133/134 (10,1 min), com única falha na asserção nova central (campo elementosExistem
ausente no esperado), corrigida sem alterar aplicação ou reduzir cobertura; reteste
1 passed (3.7s). Suíte global completa: **571 passed (40.0m)**, exit code 0.
Windows: 24/24 de abertura e 8/8 de launcher/pronúncia simulada. Build, format:check,
lint e diff aprovados. Porta 5188, identidade confirmada, um worker e PDFs sintéticos.
Sem Azure real, microfone, staging, commit ou publicação. Audição Windows, duplo clique
humano e uso infantil desta cópia permanecem pendentes.
Audição Windows, abertura humana por duplo clique e uso infantil desta cópia pendentes.
Acesso local pelo launcher oficial; as conversas opcionais preexistentes continuam opt-in,
sem ativação de microfone/Azure nesta tarefa. Sem staging, commit ou publicação.
