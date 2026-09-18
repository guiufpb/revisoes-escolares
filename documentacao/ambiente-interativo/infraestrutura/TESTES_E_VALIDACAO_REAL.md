# Testes e validação real

## Base obrigatória

Toda mudança de código executa, na raiz:

```text
npm run build
npm run format:check
npm run lint
```

Acrescente regressão para o comportamento alterado e execute testes Playwright direcionados à
revisão, ao controlador e às telas atingidas. A matriz, quando aplicável, inclui caminho feliz,
primeira tentativa errada, correção sem sair da etapa, desfazer, avançar, voltar, recarregar,
persistência de várias ações, dados corrompidos/bloqueados, isolamento, teclado, ponteiro,
390 × 844 sem overflow, axe-core, console e `file://`.

Não enfraqueça um teste para fazer a implementação passar. Prefira asserções sobre contrato e
efeito observável; em áudio, valide o payload enviado ao sintetizador, não um atraso arbitrário.

## Gatilhos da suíte global

Execute `npm test`:

1. a cada três revisões ou conjuntos independentes novos sobre infraestrutura estabilizada;
2. ao mudar navegação, registros, armazenamento, áudio, controlador compartilhado, CSS/HTML
   estrutural, build, bundle, PDF.js ou `file://`;
3. ao mudar pontuação, conclusão, limpeza, migração ou restauração de progresso;
4. diante de falha inesperada, interferência ou alcance incerto;
5. antes de consolidar na `main` um lote que ainda não passou pela suíte global.

Uma inclusão declarativa pode ficar nos testes direcionados quando nenhum outro gatilho se aplica.
Toda PR para `main` mantém a suíte global e aguarda “Formatação, lint e testes”.

## O que automação não prova

Playwright valida lógica, DOM, persistência, acessibilidade programática e payloads simulados. Não
prova pronúncia da voz instalada, ergonomia infantil, clareza do enunciado, dificuldade adequada,
ambiguidade percebida ou valor pedagógico.

Depois dos testes, o uso real pode exigir audição no Windows, teclado físico, toque, leitura pela
criança e inspeção da distribuição das alternativas. Registre uma validação real somente após
confirmação do usuário; não a infira de mocks ou screenshots.

## Registro e saída

Use `INVENTARIO_IMPLEMENTACOES.md` para estado atual e `RELATORIO_TESTE_INTERATIVO.txt` para fatos
cronológicos. Relate apenas comandos realmente executados, contagens aprovadas, falhas, limites e
validação humana pendente. Finalize com `git diff --check`, status, auditoria de privacidade e stash.
