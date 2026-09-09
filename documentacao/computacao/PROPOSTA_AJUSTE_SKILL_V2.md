# Governança e ajuste da Skill v2 para Computação

## Skill encontrada

- **Caminho:** `.agents/skills/revisoes-escolares/SKILL.md`.
- **Nome exibido:** Revisões Escolares v2, confirmado em `.agents/skills/revisoes-escolares/agents/openai.yaml`.
- **Localização:** dentro da pasta de trabalho deste repositório.
- **Estado Git no ciclo de 10/09/2026:** toda a pasta `.agents/skills/revisoes-escolares/` está não rastreada; `git ls-files` não reconhece o `SKILL.md` e ele não está ignorado.
- **Instalação global:** não foi encontrada outra cópia com `name: revisoes-escolares` em `C:\Users\guiuf\.codex\skills`. A cópia local é a skill exposta nesta sessão.
- **Escopo:** específica deste repositório. A descrição nomeia o projeto, Alice e Mariana; as rotas apontam para sua documentação, controladores, revisões e testes; os scripts dependem das ferramentas e dependências locais do projeto.

## Origem e ausência de sincronização

A pasta foi criada em 03/09/2026 e atualizada para a v2 em 04/09/2026 pelo ciclo local descrito em `PROMPT_CODEX_UPGRADE_SKILL_REVISOES_ESCOLARES_V2.md`. O prompt exigiu backup da v1, edição da skill e validação; o histórico local de sessão registra comandos de leitura, `apply_patch` e validação do pacote. Não foi encontrado gerador, instalador, link simbólico, junction, cópia global ou processo de sincronização automática. Os arquivos são normais, não links, e a única outra versão é o backup histórico interno.

O prompt de upgrade dizia “não adicionar ao Git automaticamente” porque a área era local e podia conter arquivos não rastreados. Isso impedia inclusão incidental naquele ciclo; não definia que a skill devesse permanecer para sempre fora do histórico do projeto.

## Auditoria de conteúdo e privacidade

Foram auditados os 13 arquivos de `.agents/skills/revisoes-escolares/`: `SKILL.md`, metadados de interface, modelo pedagógico, backup v1, sete referências e dois scripts. Todos são arquivos de texto; não há binários, streams alternativos, credenciais, tokens, scans, OCR, PDFs, DOCX, caches ou dados específicos da máquina. O exemplo `C:\caminho\arquivo.pdf` é genérico. Os nomes Alice e Mariana e as regras pedagógicas pertencem ao escopo já público do repositório.

O restante de `.agents/` contém somente o diretório `skills/` e esta skill. Isso não autoriza versionar `.agents/` inteira: arquivos locais futuros no mesmo diretório não fazem parte automaticamente do projeto. A pasta separada `.codex/agents/` contém configurações locais dos subagentes e permanece fora desta decisão.

## Decisão de governança

Somente `.agents/skills/revisoes-escolares/` deve fazer parte oficial do projeto. A unidade a versionar é o pacote completo, pois `SKILL.md` referencia seus arquivos em `agents/`, `assets/`, `references/`, `scripts/` e o backup histórico exigido pelo upgrade.

Não foi necessário alterar `.gitignore`: o caminho já não é ignorado. Quando houver autorização posterior para staging e commit, use seleção explícita do caminho, revise a lista staged e nunca use `git add .` ou `git add -A`:

```powershell
git add -- .agents/skills/revisoes-escolares/
git diff --cached --name-status -- .agents/skills/revisoes-escolares/
```

Não incluir `.agents/` como alvo amplo, `.codex/`, sessões, prompts locais ou outros arquivos não rastreados.

## Ajuste aplicado em 10/09/2026

As rotas anteriores foram preservadas. A descrição passou a reconhecer Computação explicitamente, e a seção de infraestrutura ganhou uma rota que aponta para `documentacao/computacao/README.md` como fonte principal.

Essa rota exige:

- leitura da trilha, do histórico, da bibliografia/mapa de fontes e do padrão editorial;
- análise de novas páginas relevantes das obras-base antes de cada novo volume;
- atualização do mapa comparativo e identificação de lacunas;
- continuidade de Lina, Nino e da identidade visual;
- conteúdo e ilustrações originais;
- cartilha e questões comuns a Alice e Mariana;
- progresso isolado na futura integração;
- reutilização da infraestrutura existente de Leitura/PDF e questionários, sem leitor paralelo.

## Arquivos que a rota consulta

1. `documentacao/computacao/README.md`;
2. `documentacao/computacao/REFERENCIAL_PEDAGOGICO.md`;
3. `documentacao/computacao/HISTORICO_PEDAGOGICO.md`;
4. `documentacao/computacao/TRILHA_DE_VOLUMES.md`;
5. `documentacao/computacao/BIBLIOGRAFIA_E_MAPA_DE_FONTES.md`;
6. `documentacao/computacao/PADRAO_EDITORIAL_VISUAL.md`;
7. somente depois, os materiais novos e estritamente necessários do volume.

## Fluxo editorial obrigatório

> **fontes → mapa comparativo → lacunas → ideia central → roteiro → texto → direção visual → briefings → questões → ativos → PDF → validação → integração**

A rota deve ainda exigir a arquitetura pedagógica **história → conceito → aplicação cotidiana → aplicação computacional → questões**, continuidade visual, conteúdo original, proteção de materiais privados e isolamento futuro do progresso de Alice e Mariana.
