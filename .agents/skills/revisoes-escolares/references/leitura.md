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
