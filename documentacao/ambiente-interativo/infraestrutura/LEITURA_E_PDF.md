# Leitura e PDF.js

Para livro novo, confira PDF, páginas e capa; cadastre recursos publicáveis em `leituras/<slug>/`;
registre metadados, perguntas, ditados e glossário; crie chaves separadas por perfil; atualize o
registro e informe à CI o número exato de páginas.

PDF.js permanece local. O leitor sincroniza páginas, cancela renderizações antigas e mostra somente
o glossário da página atual. Explicações não alteram pontos. O gerador da CI nunca sobrescreve PDF
real, e páginas, OCR ou scans privados não entram no Git.

Teste ambos os perfis, primeira e última página, questionário, ditado, recarga, limpeza seletiva,
troca rápida de página, celular, acessibilidade e `file://`. Uma futura integração de Computação
reutiliza este leitor, sem criar implementação paralela.
