(function () {
  'use strict';

  var revisoes = [
    {
      id: 'alice-ciencias-origem-materiais',
      aluno: 'alice',
      titulo: 'Origem dos materiais',
      cartaoId: 'materia-ciencias',
      painelId: 'tela-revisao',
      chaveArmazenamento: 'revisoesEscolares.alice.ciencias.origemMateriais',
      totalEtapas: 1,
      possuiDesenho: true,
    },
    {
      id: 'mariana-matematica-revisao-ampla',
      aluno: 'mariana',
      titulo: 'Revisão ampla de Matemática',
      cartaoId: 'abrir-revisao-mariana',
      painelId: 'tela-mariana-revisao',
      chaveArmazenamento: 'revisoesEscolares.mariana.matematica.revisaoAmpla',
      totalEtapas: 25,
      possuiDesenho: true,
    },
  ];

  function avisar(revisao, mensagem) {
    console.warn('[Registro de revisões] ' + mensagem, revisao || '');
  }

  function marcarIndisponivel(revisao, mensagem) {
    var cartao = revisao && document.getElementById(revisao.cartaoId);
    if (!cartao) {
      return;
    }
    cartao.disabled = true;
    cartao.classList.add('revisao-indisponivel');
    cartao.setAttribute('aria-disabled', 'true');
    cartao.title = mensagem;
  }

  function validar() {
    var ids = Object.create(null);
    var chaves = Object.create(null);
    var cartoes = Object.create(null);
    var paineis = Object.create(null);

    return revisoes.filter(function (revisao) {
      var camposObrigatorios = [
        'id',
        'titulo',
        'cartaoId',
        'painelId',
        'chaveArmazenamento',
        'totalEtapas',
      ];
      var ausentes = camposObrigatorios.filter(function (campo) {
        return revisao[campo] == null || revisao[campo] === '';
      });

      if (ausentes.length) {
        avisar(revisao, 'Configuração incompleta: ' + ausentes.join(', ') + '.');
        marcarIndisponivel(revisao, 'Esta revisão está temporariamente indisponível.');
        return false;
      }

      var conflitos = [];
      if (ids[revisao.id]) conflitos.push('ID lógico duplicado');
      if (chaves[revisao.chaveArmazenamento]) conflitos.push('chave de armazenamento duplicada');
      if (cartoes[revisao.cartaoId]) conflitos.push('cartão associado a mais de uma revisão');
      if (paineis[revisao.painelId]) conflitos.push('painel associado a mais de uma revisão');

      ids[revisao.id] = true;
      chaves[revisao.chaveArmazenamento] = true;
      cartoes[revisao.cartaoId] = true;
      paineis[revisao.painelId] = true;

      if (conflitos.length) {
        avisar(revisao, conflitos.join('; ') + '.');
        marcarIndisponivel(revisao, 'Esta revisão possui uma configuração inconsistente.');
        return false;
      }

      if (!document.getElementById(revisao.cartaoId)) {
        avisar(revisao, 'Cartão inexistente: #' + revisao.cartaoId + '.');
        return false;
      }
      if (!document.getElementById(revisao.painelId)) {
        avisar(revisao, 'Painel inexistente: #' + revisao.painelId + '.');
        marcarIndisponivel(revisao, 'O painel desta revisão não foi encontrado.');
        return false;
      }
      return true;
    });
  }

  function obter(id) {
    return revisoes.find(function (revisao) {
      return revisao.id === id;
    });
  }

  window.RegistroRevisoes = {
    listar: function () {
      return revisoes.slice();
    },
    obter: obter,
    validar: validar,
  };
})();
