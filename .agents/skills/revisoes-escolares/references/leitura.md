# Leitura

Nao crie novo leitor de PDF.

Reutilize a infraestrutura documentada e existente:

- `ambiente_interativo/js/registro-leituras.js`;
- `ambiente_interativo/js/leitura.js`;
- `ambiente_interativo/js/leitor-dedicado.js`;
- `ambiente_interativo/js/glossario.js`;
- PDF.js local ja integrado.

Preserve:

- progresso por perfil/livro;
- pagina persistida;
- questionarios/ditados/glossario quando previstos;
- cancelamento de renderizacoes antigas;
- funcionamento local;
- privacidade dos PDFs escolares reais.

Nao publique PDF privado apenas para fazer a revisao funcionar. Antes de adicionar recurso de leitura, confirme o que pode ou nao ser versionado segundo `AGENTS.md` e instrucoes.

Para testes automatizados, reutilize `tests/fixtures/pdfs.cjs`. O servidor Playwright prepara as
fixtures sinteticas automaticamente; `npm run preparar:pdfs-teste` permite preparo explicito.
As fixtures ficam separadas dos livros reais. Consulte o contrato de integridade, regeneracao e
novos cenarios em `documentacao/ambiente-interativo/infraestrutura/TESTES_E_VALIDACAO_REAL.md`.
