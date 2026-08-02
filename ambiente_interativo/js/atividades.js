(function () {
  'use strict';

  var atividades = {
    origemMateriais: {
      id: 'origem-materiais-1',
      pergunta: 'A folha de papel é produzida principalmente a partir de qual material?',
      opcoes: [
        { id: 'a', texto: 'Madeira de árvores', correta: true },
        { id: 'b', texto: 'Lã de ovelha', correta: false },
        { id: 'c', texto: 'Ferro retirado das rochas', correta: false },
      ],
      mensagemCorreta: 'Muito bem! A celulose usada no papel vem principalmente da madeira.',
      mensagemIncorreta: 'Quase! Pense no material vegetal usado para produzir a celulose.',
    },
  };

  function corrigir(idAtividade, idOpcao) {
    var atividade = atividades[idAtividade];
    if (!atividade || !Array.isArray(atividade.opcoes)) {
      return { correta: false, mensagem: 'Atividade não encontrada.' };
    }

    var opcao = atividade.opcoes.find(function (item) {
      return item.id === idOpcao;
    });

    var correta = atividade.opcoes.find(function (item) {
      return item.correta;
    });

    return {
      correta: Boolean(opcao && opcao.correta),
      opcaoCorreta: correta ? correta.id : null,
      mensagem: opcao && opcao.correta ? atividade.mensagemCorreta : atividade.mensagemIncorreta,
    };
  }

  window.AtividadesRevisoes = {
    dados: atividades,
    corrigir: corrigir,
  };
})();
