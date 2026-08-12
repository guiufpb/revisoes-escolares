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
    {
      id: 'alice-leitura-primeiras-licoes-dinheiro',
      aluno: 'alice',
      titulo: 'Primeiras Lições sobre Dinheiro',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.primeirasLicoesDinheiro.v1',
      totalEtapas: 25,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-primeiras-licoes-dinheiro',
      aluno: 'mariana',
      titulo: 'Primeiras Lições sobre Dinheiro',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.primeirasLicoesDinheiro.v1',
      totalEtapas: 25,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-quem-e-o-rei-dos-animais',
      aluno: 'alice',
      titulo: 'Quem é o rei dos animais?',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.quemEReiAnimais.v1',
      totalEtapas: 32,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-quem-e-o-rei-dos-animais',
      aluno: 'mariana',
      titulo: 'Quem é o rei dos animais?',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.quemEReiAnimais.v1',
      totalEtapas: 32,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-a-galinha-dos-ovos-de-ouro',
      aluno: 'alice',
      titulo: 'A Galinha dos Ovos de Ouro',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.galinhaOvosOuro.v1',
      totalEtapas: 35,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-a-galinha-dos-ovos-de-ouro',
      aluno: 'mariana',
      titulo: 'A Galinha dos Ovos de Ouro',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.galinhaOvosOuro.v1',
      totalEtapas: 35,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-a-raposa-e-as-uvas',
      aluno: 'alice',
      titulo: 'A Raposa e as Uvas',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.raposaEUvas.v1',
      totalEtapas: 21,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-a-raposa-e-as-uvas',
      aluno: 'mariana',
      titulo: 'A Raposa e as Uvas',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.raposaEUvas.v1',
      totalEtapas: 21,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-o-dia-que-o-sol-tirou-ferias',
      aluno: 'alice',
      titulo: 'O dia que o Sol tirou férias',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.solTirouFerias.v1',
      totalEtapas: 30,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-o-dia-que-o-sol-tirou-ferias',
      aluno: 'mariana',
      titulo: 'O dia que o Sol tirou férias',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.solTirouFerias.v1',
      totalEtapas: 30,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-a-formiga-que-queria-cantar',
      aluno: 'alice',
      titulo: 'A formiga que queria cantar',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.formigaQueriaCantar.v1',
      totalEtapas: 36,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-a-formiga-que-queria-cantar',
      aluno: 'mariana',
      titulo: 'A formiga que queria cantar',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.formigaQueriaCantar.v1',
      totalEtapas: 36,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-um-castelo-bem-assombrado',
      aluno: 'alice',
      titulo: 'Um castelo bem assombrado',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.casteloBemAssombrado.v1',
      totalEtapas: 25,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-um-castelo-bem-assombrado',
      aluno: 'mariana',
      titulo: 'Um castelo bem assombrado',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.casteloBemAssombrado.v1',
      totalEtapas: 25,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'alice-leitura-a-bela-desadormecida',
      aluno: 'alice',
      titulo: 'A Bela Desadormecida',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.alice.leitura.belaDesadormecida.v1',
      totalEtapas: 30,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
    },
    {
      id: 'mariana-leitura-a-bela-desadormecida',
      aluno: 'mariana',
      titulo: 'A Bela Desadormecida',
      cartaoId: 'materia-leitura',
      painelId: 'tela-biblioteca-leitura',
      chaveArmazenamento: 'revisoesEscolares.mariana.leitura.belaDesadormecida.v1',
      totalEtapas: 30,
      controladorCompartilhado: 'biblioteca-leituras',
      exibirEstadoNoCartao: false,
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

    function compartilhamentoValido(anterior, atual) {
      return Boolean(
        anterior &&
        atual.controladorCompartilhado &&
        anterior.controladorCompartilhado === atual.controladorCompartilhado
      );
    }

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
      if (
        cartoes[revisao.cartaoId] &&
        !compartilhamentoValido(cartoes[revisao.cartaoId], revisao)
      ) {
        conflitos.push('cartão associado a mais de uma revisão');
      }
      if (
        paineis[revisao.painelId] &&
        !compartilhamentoValido(paineis[revisao.painelId], revisao)
      ) {
        conflitos.push('painel associado a mais de uma revisão');
      }

      ids[revisao.id] = revisao;
      chaves[revisao.chaveArmazenamento] = revisao;
      cartoes[revisao.cartaoId] = revisao;
      paineis[revisao.painelId] = revisao;

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
