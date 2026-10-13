# Alice — Geografia — Brincar, conviver e descobrir lugares

Registro de integração — 13/10/2026: validação humana das atividades confirmada pelo
responsável antes desta etapa. Os relatos de pendência e os resultados técnicos abaixo
descrevem a cópia de origem em suas respectivas datas. Conteúdo, IDs e chaves foram
preservados; a validação da combinação com 63 revisões consta no inventário.

Estado em 06/10/2026: implementação integrada e validação automatizada aprovada.
A pausa para troca de modelo foi concluída e o usuário autorizou
a retomada dos testes. Uso real e audição da voz instalada aguardam confirmação.

## Identidade e cobertura

- Perfil: Alice, 1º ano. Geografia. Prova indicada: 07/10/2026.
- ID: alice-geografia-brincadeiras-lazer-outubro-2026.
- Conteúdo: ambiente_interativo/revisoes/alice/geografia-brincadeiras-lazer-outubro-2026.js.
- Principal: revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.v1.
- Auxiliar: revisoesEscolares.alice.geografia.brincadeirasLazerOutubro2026.responsavel.v1.
- 30 questões, 58 subitens e 30 pontos, em seis blocos de cinco.
- Núcleo/reforço: 24 questões. Ampliações: Q19, Q20, Q22, Q23, Q25 e Q29.

Conteúdo original da especificação editorial: brinquedos e ações, passado/presente, materiais,
licocós, vento, lugares adequados, croqui, trajeto, lazer, tabela fictícia, mudanças situadas,
cuidado, inclusão e comunicação. Relatos, dados, bancos e fichas estão na própria revisão.
Não se coletam dados pessoais, endereço, preferência individual ou rotina. Conversa e
autoavaliação opcionais ficam na mensagem final, sem coleta ou pontuação.

## Implementação e ajustes de apresentação

Motor único QuestionariosRevisoes, questionarios-interacoes.js, gramatica-ditado.js, audio.js
e armazenamento.js. Desktop Amplo, validação estrita, tentativas, opções reversíveis e
Modo Responsável são opt-in. Não houve alteração de controladores.

Q14 usa um único subitem de ordenação dentro do tipo misto já existente, como Q07 de História
de Alice, com três cartões reversíveis. Isso conserva 58 subitens e um ponto para o percurso.
Q26/Q28 também usam misto; Q09 tem banco textual e campos; Q10/Q30 são ditados.
Q13 tem quatro setores; seu SVG tem razão 1,3, igual ao recorte móvel existente, preservando
a geometria dos pontos.

Rótulos dos quatro setores ficam visíveis antes da conferência, com CSS limitado ao croqui
desta revisão. Os dois pontos inferiores ficam acima da legenda para não encobri-la no celular.

Q18 mostra tabela SVG com linhas e valores, acompanhada de equivalência textual.
Pontuação final dos botões foi omitida por apresentação; ordem e significado foram preservados.
As lacunas de Q09 usam reticências no rótulo, com campo associado.

Os campos Q30 têm CSS limitado ao prefixo dos seus IDs: linha inteira, alinhamento à esquerda
e botão de áudio em linha separada no celular. Nenhum requisito ortográfico foi ativado para
obter largura. O validador existente tolera caixa, acentos, espaços e pontuação, preservando
as palavras e sua ordem.

14 SVGs originais em assets/geografia-brincadeiras-lazer-outubro-2026/: 12 briefings, tabela
e espaços de Q16. Q11/Q12 reutilizam uma cena; Q13/Q14, o mesmo croqui. Q09 não inventa
grafismos culturais; Q10/Q30 não têm figura, banco ou transcrição de alvo. Materiais escolares,
prompt e gabarito avulso não integram o lote publicável.

## Pontos sensíveis

- Cartão exclusivo de Alice; Geografia anterior preservada.
- Principal e auxiliar têm chaves exclusivas, sem conteúdo ou motor duplicado.
- Saltos e limpeza usam a infraestrutura existente, sem copiar ou migrar progresso.
- Ditado usa apenas áudio local compartilhado, prefixo protegido, unidade explícita,
  velocidade 0,78, pitch 1 e cancelamento ao trocar campo.
- Alvos internos não entram em rótulos, instruções, dicas ou apoio.
- Gabarito independente nos testes; ordem editorial preservada.
- Sem rede obrigatória, CDN, serviço externo ou controlador paralelo.

## Validação

Antes da pausa: npm run build, npm run format:check, npm run lint e git diff --check aprovados.
Revisão visual das 14 cenas e das telas Q1/Q13/Q30; Q13/Q30 também em 390 × 844.
Testes direcionados: 20/20 aprovados (1,7 min), incluindo percurso completo de 30 pontos.
Regressões de Geografia anterior, História de Alice e Gramática/ditado: 36/36 (2,6 min).
Suíte global obrigatória pela integração e CSS: 412/412 aprovados (28,8 min), exit code 0.
Nenhum ajuste de código foi necessário após a pausa. Formatação, lint e diff final aprovados.
Controladores de áudio, armazenamento, pontuação e sessões não foram modificados.

Origem: cópia isolada de desenvolvimento, preservada durante a integração.
Branch: codex/alice-geografia-brincadeiras-lazer-outubro-2026.
Base: origin/main, 35f5b7a. Checkout original e stash preservados.

Suíte preparada: tests/geografia-alice-brincadeiras-lazer-outubro-2026.spec.js.
Cobre percurso completo, erros/vazios, conjuntos exatos, reversibilidade, mapa/tabela/mistos,
normalização textual, ditado, sessões, limpeza, persistência, armazenamento adverso,
teclado/toque, desktop/celular, axe-core, console e file://.

Comandos executados na worktree desta atividade:

1. npm run build, npm run format:check e npm run lint.
2. npx playwright test tests/geografia-alice-brincadeiras-lazer-outubro-2026.spec.js
   --config tmp/playwright.geografia.config.cjs.
3. Regressões geografia-alice-moradias-interior.spec.js,
   historia-alice-objetos-memorias-outubro-2026.spec.js e gramatica-h-til-vocabulario.spec.js,
   com o mesmo --config temporário (cobrem revisões equivalentes, áudio e questionários).
4. npm test -- -- --config tmp/playwright.geografia.config.cjs,
   obrigatório pelo CSS e integração compartilhada.
5. git diff --check.

Registro histórico da preparação do servidor na cópia de origem:
Os testes direcionados e regressões usaram 5174. Na tentativa global seguinte, um teste legado
que navega diretamente à porta 5173 falhou por conexão recusada. A execução foi interrompida;
após confirmar a porta livre, o config temporário foi ajustado para 5173 com porta estrita
e sem reutilizar servidor existente. A suíte global foi reiniciada e passou integralmente.
Testes e fontes não foram
alterados para contornar essas falhas de preparação.
Bundle é gerado pelo build. node_modules reutiliza bibliotecas já instaladas no checkout
original via junction, sem instalação.

Na primeira tentativa global, nove verificações locais de PDF falharam porque a worktree
tinha placeholders da CI. A execução foi interrompida. Os dez PDFs reais da biblioteca
foram copiados do checkout original para os mesmos caminhos ignorados pelo Git, com hashes
conferidos. A regressão específica dos PDFs passou: 9/9 (42,4 s). Nenhuma asserção foi
alterada ou desativada; a suíte global foi reiniciada com a preparação local correta.
Esses livros privados permanecem fora do versionamento.

Após aprovação automatizada, abrir Alice e selecionar o cartão. Ctrl + Alt + R abre o painel
e permite escolher Responsável; Escape fecha só o painel; Encerrar volta à principal.
Sem voz, o responsável usa o gabarito privado fornecido, sem mostrar transcrição à criança.
Uso real por Alice e audição da voz instalada permanecem pendentes.

Nenhum commit, push, PR, merge ou publicação foi realizado.

Arquivos compartilhados alterados: index.html, css/estilo.css, js/app.entry.js, js/app.js
e js/registro-revisoes.js; teste do catálogo atualizado para 60 registros. Documentação
temática e inventário atualizados. Controladores, armazenamento e áudio preservados.
Privacidade final conferida: apenas fontes, SVGs originais, testes e documentação no lote;
capturas e assets gerados pelas regressões foram preservados em tmp/global-output,
ignorado pelo Git, junto dos demais temporários locais. PDFs privados também ignorados.
