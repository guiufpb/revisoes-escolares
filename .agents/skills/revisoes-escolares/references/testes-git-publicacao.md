# Testes, Git e publicacao

## Antes de escrever

- `git status --short --branch`
- preserve trabalho existente;
- nao misture revisoes independentes sem decisao explicita.

## Validacao

Siga sempre a politica atual do `AGENTS.md`.

Para codigo, normalmente:

```text
npm run build
npm run format:check
npm run lint
```

Depois execute testes direcionados.
Use `npm test` global somente quando os gatilhos atuais de `AGENTS.md` exigirem.

Mudanca apenas documental: valide caminhos/links e `git diff --check` conforme regra atual.

## Evidencia, nao suposicao

Nao declare teste aprovado se nao houver resultado real daquela versao.
Nao use resultado historico como se fosse execucao atual.
Nao reduza/remova testes para fazer o lote passar.

## Uso real

Validacao de Alice/Mariana e evidência complementar, nao substitui testes automatizados.
Registre apenas quando o usuario confirmar.

## Auditoria pre-publicacao

Classifique:

- conteudo especifico;
- testes especificos;
- integracoes centrais;
- documentacao;
- controladores compartilhados;
- CSS/HTML estrutural;
- prompts locais;
- material privado/temporario;
- qualquer arquivo fora do escopo.

Execute `git diff --check`.

## Staging

Somente apos autorizacao:

- use caminhos explicitos;
- confirme `git diff --cached --stat` e `git diff --cached --check`;
- confirme prompts e materiais privados fora;
- nao use `git add -A`, `git add .` ou `git add -f`.

## Commit/push/PR

Cada acao exige autorizacao explicita segundo `AGENTS.md`.
Ao criar PR, aguarde o check obrigatorio atual do GitHub Actions.
Nao faça merge enquanto o usuario tiver autorizado apenas PR.

## Merge/limpeza

Depois de merge autorizado e confirmado:

- alinhe `main` e `origin/main` por fluxo nao destrutivo;
- preserve untracked esperados;
- remova branch local com `git branch -d` quando seguro;
- remova remota sem force quando autorizado;
- `git fetch --prune`;
- nao repita suites ja validadas sem motivo.
