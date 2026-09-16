(function () {
  'use strict';

  var modelo = window.MatematicaOperacoes.obterRevisao(
    'alice-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026'
  );
  if (!modelo) {
    throw new Error('O conteúdo compartilhado de Matemática de setembro não foi carregado.');
  }

  var questoes = JSON.parse(JSON.stringify(modelo.questoes)).map(function (questao) {
    questao.id = questao.id.replace(/^alice-set26-/, 'mariana-set26-');
    return questao;
  });

  window.MatematicaOperacoes.registrar({
    id: 'mariana-matematica-dezenas-dinheiro-contas-tabuadas-setembro-2026',
    perfil: 'mariana',
    titulo: 'Dezenas, dinheiro, contas e tabuadas',
    chaveArmazenamento:
      'revisoesEscolares.mariana.matematica.dezenasDinheiroContasTabuadasSetembro2026.v1',
    estudoTabuada: { aposQuestaoId: 'mariana-set26-q24', fatores: [2, 3] },
    questoes: questoes,
  });
})();
