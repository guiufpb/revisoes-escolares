# Inventário de implementações do projeto

## 1. Visão geral

O **Revisões Escolares** evoluiu para uma aplicação educacional local com perfis, matérias, revisões versionadas, progresso persistente, áudio, leitura de PDFs, cenas manipulativas e testes automáticos. A estrutura chamada **Ambiente Interativo** está em `ambiente_interativo/` e atende Alice e Mariana sem misturar os dados das duas.

Este inventário registra a branch `codex/github-automation` em **15/08/2026**.

## 2. Base da aplicação

### Navegação e perfis

- Tela inicial com seleção de Alice ou Mariana.
- Painéis de matérias e cartões próprios de cada perfil.
- Breadcrumb, voltar, próxima etapa e retorno à página inicial.
- Cabeçalho com perfil, etapa, pontos ou conquistas.
- Estados “não iniciada”, “em andamento” e “concluída”.
- Limpeza seletiva de uma revisão, sem afetar outras trilhas.
- Registro central que valida IDs, chaves, cartões e painéis duplicados.

### Execução local

- Servidor Vite por `abrir_ambiente_interativo.bat` ou `npm run interativo`.
- Aplicação principal por `file://` usando bundle clássico gerado.
- Atalho para Chromium do Playwright.
- Recursos locais, sem CDN obrigatória.
- Bundle principal e PDF.js gerados a partir dos módulos-fonte.

### Interface e acessibilidade

- Layout responsivo para computador e celular.
- Viewport de 390 × 844 sem rolagem horizontal.
- Operação por mouse, toque e teclado.
- Foco visível, rótulos acessíveis, texto alternativo e regiões `aria-live`.
- Barras de progresso acessíveis.
- Respeito a `prefers-reduced-motion`.
- Canvas em alta densidade.
- Auditoria axe-core para violações graves e críticas.

## 3. Infraestrutura compartilhada

### Registros e controladores

- `js/registro-revisoes.js`: catálogo central de revisões e chaves.
- `js/registro-ingles.js`: conteúdo compartilhado da Unidade 3.
- `js/registro-leituras.js`: livros, perguntas, ditados, glossários e metadados.
- `js/app.js` e `js/app.entry.js`: navegação, cartões e composição do bundle.
- `js/armazenamento.js`: persistência segura.
- `js/audio.js`: síntese de voz local bilíngue.
- `js/desenho.js`: canvas e persistência de desenho.
- `js/leitura.js`, `js/leitor-dedicado.js` e `js/glossario.js`: biblioteca e leitor.
- `js/matematica.js`, `js/matematica-cena.js` e `js/matematica-manipulaveis.js`: Matemática manipulativa.

### Armazenamento seguro

- Camada compartilhada `ArmazenamentoRevisoes`.
- Chaves independentes por perfil, matéria e revisão.
- Objetos persistidos com versão e normalização.
- Tratamento de JSON corrompido, versão incompatível, etapa inválida e valores fora dos limites.
- Migrações conservadoras e idempotentes.
- Fallback em memória quando `localStorage` é bloqueado.
- Limpeza limitada à revisão ativa; não existe `localStorage.clear()`.
- Restauração de etapa, respostas, pontuação, canvas, página e cenas manipulativas.

## 4. Ciências

### Alice — Origem dos materiais

- Revisão preservada no perfil de Alice.
- Conteúdo sobre origem e classificação de materiais.
- Atividade com canvas e persistência de desenho.
- Migração do progresso antigo sem apagar a chave original.
- Isolamento em relação às atividades de Mariana.

Chave: `revisoesEscolares.alice.ciencias.origemMateriais`.

## 5. Matemática

### Mariana — Revisão ampla

- **25 etapas interativas**.
- Subtração, operações inversas, sequências e gráficos.
- Dezena e unidade; números de 10 a 19.
- Ordinais, pares e ímpares.
- Geometria, sólidos, vistas e planificações.
- Canvas, mini simulado, atividade livre, pontuação e conclusão persistentes.

#### Correção da etapa 14 — Crescente e decrescente

- Cartões posicionados são restaurados visivelmente após recarga.
- Um cartão colocado pode ser clicado para voltar à bandeja.
- Também pode ser arrastado novamente para corrigir a ordem.
- É possível errar, conferir, reorganizar e concluir sem pular a etapa.
- O fluxo de correção, avanço, retorno e recarga tem teste de regressão.

Chave: `revisoesEscolares.mariana.matematica.revisaoAmpla`.

### Biblioteca manipulativa

- Quadros U, D–U, C–D–U e M–C–D–U.
- Cubinho de 1, barra de 10, placa de 100 e cubo de 1.000.
- Ábaco para montar e ler números, com descrição por haste.
- Composição e decomposição, inclusive zero intermediário.
- Ordenação, sequências, reta numérica, dinheiro pedagógico e gráfico de barras.
- Histórico, desfazer, limpar, dica e conferir.
- Retirada por clique, arrasto ou descarte.
- Estado serializável, normalizado e persistente.
- Pointer Events para mouse, toque e caneta.
- Selecionar e colocar por botão, clique no quadro grande ou teclado.
- Ordens incompatíveis continuam bloqueadas; uma placa de 100 não entra em dezenas ou unidades.
- Supressão apenas do clique sintético após arrasto, sem perder o clique legítimo seguinte.
- Persistência de várias ações consecutivas, sem depender da identidade da mesma referência de objeto.

Trocas explícitas:

- 10 U por 1 D.
- 10 D por 1 C.
- 10 C por 1 M.
- Cada troca exige quantidade exata e preserva o valor.

### Mariana — Centenas em ação, nova rodada

- **20 etapas novas**: apresentação, 18 avaliativas e encerramento.
- Mesmo ID lógico e nova chave `v2`, preservando a rodada anterior.
- Disponível somente para Mariana.

Etapas: apresentação; reconhecer 100; trocas U→D e D→C; montar 700; montar 800 e 641 no ábaco; ler 307; quadros 582 e 905; compor 734; decompor 420; ordem crescente; saltos de +25 e −50; reta em 675; formar 840; troca C→M; gráfico; encerramento.

Chave: `revisoesEscolares.mariana.matematica.centenasEmAcao.v2`.

## 6. Inglês — conteúdo, áudio e pronúncia

### Unit 3 — At School

- Disponível para Alice e Mariana com progresso independente.
- **27 palavras e frases** agrupadas em objetos, pessoas, lugares e comandos escolares.
- Instrução em português e pronúncia em inglês para cada item.
- A criança escolhe o item; nenhum áudio inicia automaticamente.
- Depois dos 27 áudios, são liberadas 10 atividades.
- Atividades sobre vocabulário, contagem, tradução, materiais, respeito e `should`/`shouldn't`.
- Alternativas A–D pseudoaleatórias, estáveis e equilibradas por perfil.
- Correção conjunta apenas após a décima resposta.
- Resultado com acertos, erros, alternativa correta e explicação.
- Recompensa final com imagem local da Mita e mensagem própria para cada perfil.
- Ícone de borracha substituído por SVG original.

Chaves:

- `revisoesEscolares.alice.ingles.atSchoolUnidade3.v1`
- `revisoesEscolares.mariana.ingles.atSchoolUnidade3.v1`

### Melhorias aglutinadas de pronúncia

As melhorias foram concentradas em `js/audio.js` e consumidas por `js/ingles.js`, evitando que cada revisão implemente sua própria voz.

#### Seleção inteligente da voz

- Usa `window.speechSynthesis` e somente vozes locais (`localService !== false`).
- Normaliza Inglês para `en-US` e Português para `pt-BR`.
- Prefere correspondência exata do idioma; aceita a mesma família linguística quando necessário.
- Atribui preferência extra a vozes locais com indicação `natural` ou `neural` e a vozes conhecidas do sistema.
- Reavalia a lista no evento `voiceschanged`, pois alguns navegadores carregam vozes depois da página.
- Exibe orientação clara se não houver voz inglesa ou portuguesa local instalada.

#### Proteção contra corte da primeira palavra

Foi corrigido o problema do Chromium/Windows que pode cortar o início da primeira fala depois de um período ocioso:

1. espera inicial de **1.000 ms**;
2. fala de aquecimento “Ready.” ou “Preparando.” no mesmo idioma e voz, com volume de **1%**;
3. pausa de **250 ms**;
4. aviso audível completo “Listen.” ou “Atenção.”;
5. pausa de **600 ms**;
6. pronúncia do conteúdo em uma fala separada.

O eventual corte fica no aquecimento quase inaudível, não em “Listen” nem na primeira palavra estudada.

#### Velocidades pedagógicas

- “Ouvir em inglês”: velocidade **0,62**, lenta o bastante para compreensão e ainda natural.
- “Ouvir devagar”: velocidade **0,50**, limite mais lento aceito pelo módulo.
- A opção devagar mantém a palavra ou frase contínua; não soletra e não separa sílabas artificialmente.
- O `pitch` permanece neutro em 1 para evitar distorção da pronúncia.

#### Controles e continuidade

- “Ouvir instrução”: voz local `pt-BR`.
- “Ouvir em inglês”: voz local `en-US`.
- “Ouvir devagar”: repete o mesmo inglês em velocidade menor.
- “Repetir”: reproduz exatamente a última solicitação, inclusive idioma e velocidade.
- “Parar”: cancela a fila, o temporizador e a fala atual imediatamente.
- Uma nova solicitação invalida a sequência anterior, impedindo falas sobrepostas ou atrasadas.
- `resume()` é acionado antes das falas para recuperar sintetizadores pausados pelo navegador.

#### Retorno acessível e privacidade

- O módulo emite estados `aguardando`, `aviso`, `pausa`, `reproduzindo`, `concluido`, `parado` e `erro`.
- As mensagens chegam à interface por evento compartilhado e região `aria-live`.
- A interface informa que o áudio começará, qual voz está reproduzindo e quando é possível repetir.
- Botões funcionam por teclado e em viewport móvel.
- Não há microfone, gravação, reconhecimento de fala, avaliação automática de pronúncia, upload, API ou CDN.

#### Cobertura e reaproveitamento

- A mesma infraestrutura bilíngue atende Alice e Mariana.
- O padrão de espera e aviso também foi reaproveitado nos ditados de Leitura, protegendo a primeira palavra avaliada.
- Testes verificam presença das vozes `pt-BR`/`en-US`, controles, progresso dos 27 itens, atividades, isolamento por perfil, recompensa e acessibilidade móvel.

## 7. Leitura

### Biblioteca compartilhada

| Livro                              | Páginas |
| ---------------------------------- | ------: |
| Primeiras Lições sobre Dinheiro    |      25 |
| Quem é o rei dos animais?          |      32 |
| A Galinha dos Ovos de Ouro         |      35 |
| A Raposa e as Uvas                 |      21 |
| O dia que o Sol tirou férias       |      30 |
| A formiga que queria cantar        |      36 |
| Um castelo bem assombrado          |      25 |
| A Bela Desadormecida               |      30 |
| A Joaninha que Perdeu as Pintinhas |      21 |
| Uma Formiga Especial               |      31 |

### Recursos

- Mesmo catálogo e dados totalmente separados por perfil e livro.
- Cartões com capa, autoria, páginas, resumo e situação.
- PDF.js local, renderização em canvas e leitor dedicado amplo.
- Sincronização e persistência de página.
- Cancelamento de renderizações antigas em trocas rápidas.
- Glossário apenas da página atual.
- Questionários com quatro alternativas em ordem estável.
- Ditados com voz local, “Atenção” completo e proteção contra corte.
- Correções, explicações e resultado persistente.
- Explicações de cobiça e eclipse sem alterar pontos ou respostas.
- Conteúdo de inclusão em “Uma Formiga Especial”.
- Limpeza somente do livro ativo e fallback em memória.

### Privacidade dos PDFs

- PDFs escolares reais ficam no computador e são ignorados pelo Git.
- Capas e recursos publicáveis são versionados.
- Na CI, `scripts/gerar_pdfs_teste_ci.js` cria PDFs vazios válidos com a quantidade exata de páginas apenas quando estão ausentes.
- O gerador nunca sobrescreve livros reais locais.

## 8. Prevenções de regressão incorporadas

- Atividades de ordenar não prendem cartões após o primeiro erro.
- Bandejas e posições são reconstruídas do estado salvo.
- Todo item colocado tem caminho reversível.
- Soltar por arrasto não bloqueia o próximo clique legítimo.
- A área grande das colunas aceita clique após seleção da peça.
- Compatibilidade entre peça e ordem continua obrigatória.
- Várias alterações consecutivas são salvas.
- Voltar, avançar e recarregar preservam a representação.
- Reabrir não duplica listeners.
- Limpar uma revisão não apaga outra matéria, perfil ou rodada.
- Áudio antigo é cancelado antes de uma nova pronúncia.
- O início audível da pronúncia é protegido por aquecimento e pausas.

Teste obrigatório: `errar → conferir → corrigir → conferir → avançar → voltar → recarregar`.

## 9. Testes e qualidade

Ferramentas: Playwright, axe-core, ESLint, Prettier e Vite.

Na data deste inventário existem **84 testes Playwright**:

- `tests/ambiente-interativo.spec.js`: fluxos centrais, Inglês, Leitura, Matemática ampla, armazenamento, canvas e `file://`.
- `tests/matematica-manipulativa.spec.js`: cenas, trocas, ábacos, clique no quadro, teclado, persistência e nova Centenas em ação.
- `tests/acessibilidade.spec.js`: axe e responsividade das telas principais.

A cobertura inclui isolamento, erro e correção, recarga, Pointer Events, teclado, dados corrompidos, `localStorage` bloqueado, áudio bilíngue, leitor, ditados, canvas, console, arquivo local e viewport móvel.

## 10. GitHub e automações

- GitHub CLI instalado e autenticado.
- Repositório público: <https://github.com/guiufpb/revisoes-escolares>.
- Workflow `.github/workflows/validacao.yml` para `main`, pull requests e execução manual.
- Node.js 24, `npm ci`, Chromium, formatação, lint, PDFs de teste, build e suíte completa.
- Artefatos de diagnóstico por 14 dias em falhas.
- Dependabot semanal para npm e GitHub Actions.
- Formulário “Erro em uma atividade” com orientação de privacidade.
- `main` protegida por check obrigatório, atualização da branch, bloqueio de force-push e exclusão.
- Pull request #1 em rascunho e com check aprovado nesta consolidação.

## 11. Ferramentas auxiliares

- Geração de PDF A4 a partir de cartilhas HTML.
- Geração de previews PNG.
- Validação de HTML, páginas, recursos e PDF.
- Relatório em texto e opção JSON.
- Biblioteca local de ícones e créditos.
- Atalhos Windows independentes do diretório inicial e do perfil pessoal do navegador.

## 12. Mapa principal

| Caminho                          | Responsabilidade                         |
| -------------------------------- | ---------------------------------------- |
| `ambiente_interativo/index.html` | Estrutura das telas e cartões            |
| `ambiente_interativo/css/`       | Estilo e leitor dedicado                 |
| `ambiente_interativo/js/`        | Controladores e registros compartilhados |
| `ambiente_interativo/revisoes/`  | Conteúdo por perfil                      |
| `ambiente_interativo/leituras/`  | Capas e recursos publicáveis dos livros  |
| `tests/`                         | Testes funcionais e de acessibilidade    |
| `scripts/`                       | PDF, previews, validação e apoio à CI    |
| `.github/`                       | Actions, Dependabot e formulário de erro |

## 13. Histórico técnico consolidado

- `105fba3` — ampliação do ambiente e automação das validações.
- `564a6c7` — PDFs vazios nos testes remotos.
- `048b84c` — integridade local dos PDFs separada da CI.
- `cb79555` — renovação completa de Centenas em ação.

O histórico detalhado permanece em `ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt`; este arquivo é a referência organizada e atual.
