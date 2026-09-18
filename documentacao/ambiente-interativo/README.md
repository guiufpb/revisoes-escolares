# Documentação do Ambiente Interativo

Mapa da referência vigente do **Revisões Escolares**. O inventário descreve o que existe; o
relatório guarda fatos históricos; os documentos temáticos definem as regras atuais; ADRs registram
decisões arquiteturais difíceis.

## Comece aqui

- [Instruções e arquitetura](INSTRUCOES_PROJETO.md)
- [Inventário de implementações](INVENTARIO_IMPLEMENTACOES.md)
- [Modelo de nova revisão](../../ambiente_interativo/revisoes/MODELO_NOVA_REVISAO.txt)
- [Relatório histórico de testes](../../ambiente_interativo/RELATORIO_TESTE_INTERATIVO.txt)
- [Instruções automáticas da raiz](../../AGENTS.md)
- [Orquestração e economia](../../.agents/skills/revisoes-escolares/references/orquestracao-economia.md)

## Infraestrutura

- [Áudio e voz](infraestrutura/AUDIO_E_VOZ.md)
- [Questionários e interações](infraestrutura/QUESTIONARIOS_E_INTERACOES.md)
- [Armazenamento e progresso](infraestrutura/ARMAZENAMENTO_E_PROGRESSO.md)
- [Layout e acessibilidade](infraestrutura/LAYOUT_E_ACESSIBILIDADE.md)
- [Testes e validação real](infraestrutura/TESTES_E_VALIDACAO_REAL.md)
- [Matemática e ordenação](infraestrutura/MATEMATICA_E_ORDENACAO.md)
- [Leitura e PDF.js](infraestrutura/LEITURA_E_PDF.md)

## Pedagogia e decisões

- [Qualidade das questões](pedagogia/QUALIDADE_DAS_QUESTOES.md)
- [ADR-001 — proteção de áudio no Chromium/Windows](decisoes/ADR-001-PROTECAO_AUDIO_CHROMIUM_WINDOWS.md)
- [Coleção de Computação](../computacao/README.md)

## Código principal

- Controladores, registros e armazenamento: `ambiente_interativo/js/`
- Conteúdo por perfil: `ambiente_interativo/revisoes/<perfil>/`
- Testes Playwright e axe-core: `tests/`
- Build e automação: `package.json`, `vite.config.js` e `.github/`

## Outras referências

- [Guia de uso do ambiente](../../ambiente_interativo/README_INTERATIVO.txt)
- [Ferramentas locais](../../README_FERRAMENTAS.txt)
