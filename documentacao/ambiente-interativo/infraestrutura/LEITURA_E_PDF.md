# Leitura e PDF.js

Para livro novo, confira PDF, páginas e capa; cadastre recursos publicáveis em `leituras/<slug>/`;
registre metadados, perguntas, ditados e glossário; crie chaves separadas por perfil; atualize o
registro e mantenha no manifesto de fixtures o número de páginas necessário aos testes.

PDF.js permanece local. O leitor sincroniza páginas, cancela renderizações antigas e mostra somente
o glossário da página atual. Explicações não alteram pontos. Páginas, OCR ou scans privados não
entram no Git.

Para regressões, reutilize os PDFs sintéticos originais do projeto, com texto e desenho conhecidos.
O preparo automático é exclusivo do servidor de teste e não modifica livros reais. Consulte o
contrato e o comando oficial em [Testes e validação real](TESTES_E_VALIDACAO_REAL.md#pdfs-sintéticos-e-preparo-reproduzível).

Teste ambos os perfis, primeira e última página, questionário, ditado, recarga, limpeza seletiva,
troca rápida de página, celular, acessibilidade e `file://`. Uma futura integração de Computação
reutiliza este leitor, sem criar implementação paralela.
