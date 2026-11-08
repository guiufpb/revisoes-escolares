(function () {
  'use strict';

  var revisoes = Object.create(null);
  var armazenamentos = Object.create(null);
  var revisaoAtiva = null;
  var estado = null;
  var conteudo = null;
  var controladorApp = null;
  var modoResponsavelAtivo = false;
  var sessaoResponsavelAtual = null;
  var focoAntesDoPainelResponsavel = null;
  var eventosModoResponsavelInstalados = false;
  // Propriedade por capacidade, nunca inferida pelo prefixo do ID.
  var proprietariosLab = Object.create(null);
  var handlesLab = new WeakMap();
  var revogadosLab = new WeakSet();
  var geracaoAberturasLab = 0;

  function copiaEstadoLab(valor) {
    return JSON.parse(JSON.stringify(valor));
  }
  function registroLabAtivo() {
    return (revisaoAtiva && proprietariosLab[revisaoAtiva.id]) || null;
  }
  function protegerEventoLab(callback) {
    var r = registroLabAtivo();
    if (!r || !r.execucao) return callback;
    var e = r.execucao,
      renderId = e.renderId;
    return function () {
      if (
        r.execucao !== e ||
        e.oculta ||
        e.fechando ||
        e.renderId !== renderId ||
        revisaoAtiva !== r.configuracao ||
        !e.conexao.vigente()
      )
        return;
      return callback.apply(this, arguments);
    };
  }
  function separarVisualLab() {
    var r = registroLabAtivo();
    if (r && r.execucao) {
      r.execucao.oculta = true;
      ++r.execucao.renderId;
    }
  }
  function metadadosLab(resultado) {
    var copia = Object.assign({}, resultado);
    delete copia.estado;
    delete copia.situacao;
    return copia;
  }
  function iniciarGravacaoLab(r, e) {
    if (e.pendente || e.confirmada >= e.versao) return;
    var versao = e.versao,
      snapshot = copiaEstadoLab(e.estado);
    var resultado;
    e.pendente = e.conexao.canal
      .salvar(snapshot)
      .then(function (resposta) {
        resultado = resposta;
        e.resultado = metadadosLab(resposta);
        if (
          resposta.ok &&
          (resposta.aceitaPeloNavegador === true || e.conexao.modo === 'temporario')
        )
          e.confirmada = versao;
      })
      .catch(function () {
        e.resultado = { ok: false, codigo: 'GRAVACAO_LAB_FALHOU', durabilidade: 'memoria' };
      })
      .finally(function () {
        e.pendente = null;
        // Coalescer apenas novas ações que chegaram durante uma gravação bem-sucedida.
        // Nunca repetir automaticamente quota, divergência ou autorização perdida.
        if (resultado && resultado.ok && e.versao > versao && e.conexao.vigente())
          iniciarGravacaoLab(r, e);
        notificarDurabilidadeLab(r);
      });
  }
  function salvarLab(r) {
    var e = r.execucao;
    estado = normalizadorDaRevisao(r.configuracao)(estado, estadoInicial(r.configuracao));
    e.estado = estado;
    ++e.versao;
    iniciarGravacaoLab(r, e);
    notificarDurabilidadeLab(r);
  }
  // Observação por handle: apenas metadados, nunca respostas, snapshots ou chaves.
  function notificarDurabilidadeLab(r) {
    if (!r.execucao || !r.observadores) return;
    var e = r.execucao;
    var meta = Object.freeze({
      pendente: !!e.pendente,
      naoDuravel: e.confirmada < e.versao || !e.conexao.vigente(),
      durabilidade: e.resultado.durabilidade,
      codigo: e.resultado.codigo || null,
    });
    r.observadores.forEach(function (callback) {
      try {
        callback(meta);
      } catch {
        /* Observação não interfere na gravação. */
      }
    });
  }
  async function aguardarLab(e) {
    while (e.pendente) await e.pendente;
    return e.confirmada >= e.versao;
  }
  function assinaturaLab(valor) {
    if (Array.isArray(valor)) return '[' + valor.map(assinaturaLab).join(',') + ']';
    if (valor && typeof valor === 'object')
      return (
        '{' +
        Object.keys(valor)
          .sort()
          .map(function (k) {
            return JSON.stringify(k) + ':' + assinaturaLab(valor[k]);
          })
          .join(',') +
        '}'
      );
    return JSON.stringify(valor);
  }
  function configuracaoCorrespondeLab(c, conexao) {
    var p = conexao.pacote;
    var projetada = p && projetarPacoteLab(p);
    if (
      !p ||
      !conexao.identidade ||
      ['perfil', 'materia', 'id', 'versao'].some(function (campo) {
        return p[campo] !== conexao.identidade[campo];
      }) ||
      c.aluno !== p.perfil ||
      c.titulo !== projetada.titulo ||
      (c.chave !== null && c.chave !== conexao.chavePrincipal)
    )
      return false;
    function semSucesso(questoes) {
      return questoes.map(function (q) {
        var copia = Object.assign({}, q);
        delete copia.sucesso;
        return copia;
      });
    }
    // Sucesso é mensagem interna, não participa da avaliação nem da identidade.
    return assinaturaLab(semSucesso(c.questoes)) === assinaturaLab(semSucesso(projetada.questoes));
  }
  function chavesReservadasLab(r) {
    return [r.configuracao.chave].concat(r.chaves || []).filter(function (k) {
      return typeof k === 'string';
    });
  }

  function chavesDaRevisao(revisao) {
    var chaves = [revisao.chave];
    var configuracao = revisao.modoResponsavel;
    if (configuracao && Array.isArray(configuracao.sessoes))
      configuracao.sessoes.forEach(function (sessao) {
        if (sessao && typeof sessao === 'object') chaves.push(sessao.chaveArmazenamento);
      });
    return chaves;
  }

  function copiarConfiguracaoLab(valor, snapshot) {
    var limiteTotal = snapshot ? 2097152 : 262144;
    var vistos = new Set();
    var nos = 0;
    function copiar(entrada, nivel) {
      if (++nos > 10000 || nivel > 12) throw new Error('Configuração LAB excessiva.');
      if (typeof entrada === 'string' && entrada.length > (snapshot ? 1000 : limiteTotal))
        throw new Error('Texto LAB excessivo.');
      if (entrada === null || typeof entrada === 'boolean' || typeof entrada === 'string')
        return entrada;
      if (typeof entrada === 'number' && Number.isFinite(entrada)) return entrada;
      if (!entrada || typeof entrada !== 'object' || vistos.has(entrada))
        throw new Error('Configuração LAB não declarativa.');
      var array = Array.isArray(entrada);
      if (array && entrada.length > 10000) throw new Error('Lista LAB excessiva.');
      if (snapshot && array && ![Array.prototype, null].includes(Object.getPrototypeOf(entrada)))
        throw new Error('Lista LAB inválida.');
      if (!array && ![Object.prototype, null].includes(Object.getPrototypeOf(entrada)))
        throw new Error('Objeto LAB inválido.');
      var descritores = Object.getOwnPropertyDescriptors(entrada);
      if (Object.getOwnPropertySymbols(entrada).length)
        throw new Error('Propriedade LAB inválida.');
      var keys = array
        ? Array.from({ length: entrada.length }, function (_, i) {
            return String(i);
          })
        : Object.keys(entrada);
      if (Object.keys(descritores).length !== keys.length + (array ? 1 : 0))
        throw new Error('Propriedade LAB oculta.');
      var saida = array ? [] : Object.create(null);
      vistos.add(entrada);
      keys.forEach(function (key) {
        var d = descritores[key];
        if (
          !d ||
          !Object.hasOwn(d, 'value') ||
          ['__proto__', 'prototype', 'constructor'].includes(key)
        )
          throw new Error('Propriedade LAB inválida.');
        saida[key] = copiar(d.value, nivel + 1);
      });
      vistos.delete(entrada);
      return Object.freeze(saida);
    }
    var copia = copiar(valor, 1);
    var texto = JSON.stringify(copia);
    if (
      texto.length > limiteTotal ||
      (snapshot && new window.TextEncoder().encode(texto).byteLength > limiteTotal)
    )
      throw new Error('Dados LAB excessivos.');
    return copia;
  }

  // Fronteira não confiável exclusiva LAB. Nunca aplica nem grava o estado recebido.
  function analisarSnapshotLab(r, e, entrada) {
    var recusa = null;
    function recusar(codigo, caminho) {
      recusa = { codigo: codigo, caminho: caminho };
      throw recusa;
    }
    function campos(valor, esperados, caminho) {
      if (
        !valor ||
        typeof valor !== 'object' ||
        Array.isArray(valor) ||
        Object.keys(valor).length !== esperados.length ||
        !esperados.every(function (campo) {
          return Object.hasOwn(valor, campo);
        })
      )
        recusar('ESTRUTURA_SNAPSHOT_INVALIDA', caminho);
    }
    try {
      var copia = copiarConfiguracaoLab(entrada, true);
      campos(copia, ['vinculo', 'snapshot'], '');
      campos(copia.vinculo, ['perfil', 'materia', 'id', 'versao', 'digest', 'sessao'], '/vinculo');
      if (assinaturaLab(copia.vinculo) !== assinaturaLab(e.conexao.identidade))
        recusar('VINCULO_SNAPSHOT_DIVERGENTE', '/vinculo');
      var s = copia.snapshot;
      campos(
        s,
        [
          'versao',
          'questaoAtual',
          'respostas',
          'corrigidas',
          'pontuadas',
          'conferidas',
          'pontos',
          'finalizada',
        ],
        '/snapshot'
      );
      if (s.versao !== 1) recusar('VERSAO_SNAPSHOT_INCOMPATIVEL', '/snapshot/versao');
      var questoes = r.configuracao.questoes;
      if (
        !Number.isInteger(s.questaoAtual) ||
        s.questaoAtual < 0 ||
        s.questaoAtual >= questoes.length
      )
        recusar('POSICAO_SNAPSHOT_INVALIDA', '/snapshot/questaoAtual');
      if (!Number.isInteger(s.pontos) || s.pontos < 0 || s.pontos > questoes.length)
        recusar('PONTOS_SNAPSHOT_INCOERENTES', '/snapshot/pontos');
      if (typeof s.finalizada !== 'boolean')
        recusar('CONCLUSAO_SNAPSHOT_INCOERENTE', '/snapshot/finalizada');
      ['respostas', 'corrigidas', 'pontuadas', 'conferidas'].forEach(function (nome) {
        var mapa = s[nome];
        if (!mapa || typeof mapa !== 'object' || Array.isArray(mapa))
          recusar('MAPA_SNAPSHOT_INVALIDO', '/snapshot/' + nome);
        Object.keys(mapa).forEach(function (id) {
          var q = questoes.find(function (item) {
            return item.id === id;
          });
          var caminho = '/snapshot/' + nome + '/' + id;
          if (!q) recusar('QUESTAO_SNAPSHOT_DESCONHECIDA', caminho);
          if (nome !== 'respostas') {
            if (mapa[id] !== true) recusar('MARCADOR_SNAPSHOT_INVALIDO', caminho);
          } else {
            if (!Array.isArray(mapa[id]) || mapa[id].length !== q.itens.length)
              recusar('RESPOSTA_SNAPSHOT_INVALIDA', caminho);
            mapa[id].forEach(function (texto, indice) {
              if (
                typeof texto !== 'string' ||
                texto.length > 1000 ||
                (q.tipo === 'opcoes' && texto !== '' && !q.itens[indice].opcoes.includes(texto))
              )
                recusar('RESPOSTA_SNAPSHOT_INVALIDA', caminho + '/' + indice);
            });
          }
        });
      });
      questoes.forEach(function (q) {
        var respostas = s.respostas[q.id] || [];
        var correta =
          avaliar(q, respostas).every(Boolean) &&
          q.itens.every(function (item, i) {
            return respostaPreenchida(q, item, respostas[i]);
          });
        if (
          (s.corrigidas[q.id] && (!s.conferidas[q.id] || !s.pontuadas[q.id] || !correta)) ||
          (s.conferidas[q.id] && correta && !s.corrigidas[q.id]) ||
          (s.pontuadas[q.id] && !Object.hasOwn(s.respostas, q.id))
        )
          recusar('CORRECAO_SNAPSHOT_INCOERENTE', '/snapshot/corrigidas/' + q.id);
      });
      if (s.pontos !== Object.keys(s.pontuadas).length)
        recusar('PONTOS_SNAPSHOT_INCOERENTES', '/snapshot/pontos');
      if (
        s.finalizada &&
        (Object.keys(s.corrigidas).length !== questoes.length ||
          s.questaoAtual !== questoes.length - 1)
      )
        recusar('CONCLUSAO_SNAPSHOT_INCOERENTE', '/snapshot/finalizada');
      var normalizado = normalizadorDaRevisao(r.configuracao)(s, estadoInicial(r.configuracao));
      // O normalizador é tolerante no legado; a fronteira externa recusa qualquer reparação.
      if (assinaturaLab(normalizado) !== assinaturaLab(s))
        recusar('NORMALIZACAO_SNAPSHOT_DIVERGENTE', '/snapshot');
      return {
        ok: true,
        vinculo: copiaEstadoLab(copia.vinculo),
        snapshot: copiaEstadoLab(normalizado),
        resumo: {
          totalQuestoes: questoes.length,
          pontosHistoricos: normalizado.pontos,
          questoesCorrigidas: Object.keys(normalizado.corrigidas).length,
          questoesConferidas: Object.keys(normalizado.conferidas).length,
          questaoAtual: normalizado.questaoAtual,
          finalizada: normalizado.finalizada,
        },
        restauracaoAutorizada: false,
      };
    } catch (erro) {
      return {
        ok: false,
        codigo: recusa && erro === recusa ? recusa.codigo : 'DADOS_SNAPSHOT_INVALIDOS',
        caminho: recusa && erro === recusa ? recusa.caminho : '',
      };
    }
  }
  function operacaoSnapshotLab(handle) {
    var r = handlesLab.get(handle);
    if (!r)
      return {
        ok: false,
        codigo: revogadosLab.has(handle) ? 'HANDLE_LIBERADO' : 'HANDLE_INVALIDO',
      };
    var e = r.execucao;
    if (!e || !e.conexao.vigente()) return { ok: false, codigo: 'SESSAO_LAB_NAO_AUTORIZADA' };
    return { ok: true, r: r, e: e };
  }
  function exportarSnapshotLab() {
    if (arguments.length) return { ok: false, codigo: 'ARGUMENTOS_SNAPSHOT_INVALIDOS' };
    var operacao = operacaoSnapshotLab(this);
    if (!operacao.ok) return operacao;
    var e = operacao.e;
    var analise = analisarSnapshotLab(operacao.r, e, {
      vinculo: e.conexao.identidade,
      snapshot: e.estado,
    });
    if (!analise.ok) return analise;
    return {
      ok: true,
      vinculo: analise.vinculo,
      snapshot: analise.snapshot,
      durabilidade: {
        modo: e.conexao.modo,
        pendente: !!e.pendente,
        naoDuravel:
          e.conexao.modo !== 'persistente' ||
          e.confirmada < e.versao ||
          !['gravacao-aceita', 'persistido-lido'].includes(e.resultado.durabilidade),
        resultado: copiaEstadoLab(e.resultado),
      },
    };
  }
  function validarSnapshotLab(entrada) {
    if (arguments.length !== 1) return { ok: false, codigo: 'ARGUMENTOS_SNAPSHOT_INVALIDOS' };
    var operacao = operacaoSnapshotLab(this);
    return operacao.ok ? analisarSnapshotLab(operacao.r, operacao.e, entrada) : operacao;
  }

  // Contexto apenas de análise: pacote revalidado, sem registro, painel, lease ou IO de progresso.
  async function criarValidadorSnapshotLab(entradaPacote) {
    if (arguments.length !== 1 || !window.LabValidador)
      return { ok: false, codigo: 'VALIDADOR_LAB_INDISPONIVEL' };
    var v = await window.LabValidador.reconhecerPacote(entradaPacote);
    if (!v.valido) return { ok: false, codigo: 'PACOTE_LAB_INVALIDO' };
    var p = v.pacoteNormalizado;
    var r = {
      configuracao: copiarConfiguracaoLab({
        questoes: projetarPacoteLab(p).questoes,
        validacaoEstritaEstado: true,
      }),
    };
    var identidade = {
      perfil: p.perfil,
      materia: p.materia,
      id: p.id,
      versao: p.versao,
      digest: v.digest,
    };
    return Object.freeze({
      ok: true,
      digest: v.digest,
      admissaoOperacional: false,
      correspondeConfiguracao: function (configuracao) {
        try {
          return configuracaoCorrespondeLab(copiarConfiguracaoLab(configuracao), {
            pacote: p,
            identidade: identidade,
            chavePrincipal: null,
          });
        } catch {
          return false;
        }
      },
      analisarSnapshot: function (sessao, entrada) {
        if (arguments.length !== 2 || !['principal', 'responsavel'].includes(sessao))
          return { ok: false, codigo: 'SESSAO_INVALIDA' };
        return analisarSnapshotLab(
          r,
          { conexao: { identidade: Object.assign({}, identidade, { sessao: sessao }) } },
          entrada
        );
      },
      validarSnapshot: function (sessao, snapshot) {
        if (arguments.length !== 2 || !['principal', 'responsavel'].includes(sessao))
          return { ok: false, codigo: 'SESSAO_INVALIDA' };
        var vinculo = Object.assign({}, identidade, { sessao: sessao });
        return analisarSnapshotLab(
          r,
          { conexao: { identidade: vinculo } },
          { vinculo: vinculo, snapshot: snapshot }
        );
      },
    });
  }
  // Adaptação pura: não registra, abre, adquire ou persiste um pacote v2.
  async function adaptarContratoDitadoLab(entrada) {
    if (!window.LabValidador || !window.LabValidador.validarContratoDitado)
      return { ok: false, codigo: 'VALIDADOR_LAB_INDISPONIVEL' };
    var v = await window.LabValidador.validarContratoDitado(entrada);
    if (!v.valido) return { ok: false, codigo: 'CONTRATO_DITADO_INVALIDO' };
    return Object.assign(
      { ok: true, admissaoOperacional: false },
      projetarPacoteLab(v.contratoNormalizado)
    );
  }
  // Uma única projeção, exclusivamente de pacotes previamente revalidados.
  function projetarPacoteLab(pacote) {
    if (pacote.formato !== 'lab-questionarios-v2')
      return { titulo: pacote.titulo, questoes: pacote.questoes };
    return {
      titulo: 'Atividade de escrita',
      questoes: pacote.questoes.map(function (q, indice) {
        return {
          id: q.id,
          tipo: 'campos',
          bloco: 'Escrita',
          titulo: 'Atividade ' + (indice + 1),
          instrucao: 'Ouça e escreva. Depois, confira.',
          dica: 'Ouça novamente e revise o que escreveu.',
          sucesso: 'Você conferiu esta questão.',
          ditado: true,
          unidadeDitado: q.unidade,
          idiomaDitado: q.idioma,
          cancelarAoTrocarCampo: true,
          apresentacaoDitadoSegura: true,
          itens: q.itens.map(function (item, i) {
            return {
              id: item.id,
              pergunta: 'Item ' + (i + 1),
              respostas: [item.texto],
              fraseCompleta: q.unidade === 'frase',
            };
          }),
        };
      }),
    };
  }

  function capturarParaBackupLab(handle) {
    if (arguments.length !== 1) return { ok: false, codigo: 'HANDLE_INVALIDO' };
    var operacao = operacaoSnapshotLab(handle);
    if (!operacao.ok) return operacao;
    var captura = exportarSnapshotLab.call(handle);
    if (!captura.ok) return captura;
    return Object.assign(captura, { pacote: copiaEstadoLab(operacao.e.conexao.pacote) });
  }
  function conferirDisponibilidadeJournal(destino) {
    if (!destino || typeof destino !== 'object' || arguments.length !== 1)
      return { ok: false, codigo: 'DESTINO_JOURNAL_INVALIDO' };
    var campos = ['copyId', 'origem', 'perfil', 'materia', 'id', 'versao', 'digest'];
    if (
      Object.keys(destino).length !== campos.length ||
      !campos.every(function (k) {
        return Object.hasOwn(destino, k);
      })
    )
      return { ok: false, codigo: 'DESTINO_JOURNAL_INVALIDO' };
    var ocupado = Object.keys(proprietariosLab).some(function (id) {
      var r = proprietariosLab[id],
        e = r.execucao,
        conexao = e ? e.conexao : r.vinculo;
      if (!conexao || !conexao.pacote) return false;
      var p = conexao.pacote;
      if (p.perfil !== destino.perfil || p.id !== destino.id || p.versao !== destino.versao)
        return false;
      if (conexao.modo === 'temporario') return true;
      var coordenador = e ? e.coordenador : r.coordenador;
      var situacao = coordenador && coordenador.obterSituacao();
      return (
        !situacao ||
        (situacao.copyId === destino.copyId && situacao.origem === destino.origem && !!e)
      );
    });
    return ocupado ? { ok: false, codigo: 'EXECUCAO_LAB_EM_USO' } : { ok: true };
  }

  function consultarRegistroLab() {
    var registro = handlesLab.get(this);
    if (!registro || arguments.length)
      return { ok: false, codigo: revogadosLab.has(this) ? 'HANDLE_LIBERADO' : 'HANDLE_INVALIDO' };
    var c = registro.configuracao;
    return {
      ok: true,
      situacao: registro.execucao
        ? registro.execucao.oculta
          ? 'desativado'
          : 'ativo'
        : 'registrado',
      aberturaDisponivel: !!(window.LabCoordenador && window.LabCoordenador.conectarMotor),
      progresso: registro.execucao
        ? {
            sessao: registro.execucao.sessao,
            estado: copiaEstadoLab(registro.execucao.estado),
            pendente: !!registro.execucao.pendente,
            modo: registro.execucao.conexao.modo,
            naoDuravel:
              registro.execucao.conexao.modo !== 'persistente' ||
              registro.execucao.confirmada < registro.execucao.versao,
            durabilidade: Object.assign({}, registro.execucao.resultado),
          }
        : null,
      registro: {
        id: c.id,
        aluno: c.aluno,
        materia: c.materia,
        titulo: c.titulo,
        totalQuestoes: c.questoes.length,
      },
    };
  }

  function abrirRegistroLab(coordenador, sessao) {
    if (!handlesLab.has(this))
      return { ok: false, codigo: revogadosLab.has(this) ? 'HANDLE_LIBERADO' : 'HANDLE_INVALIDO' };
    if (!arguments.length) return { ok: false, codigo: 'ABERTURA_LAB_PENDENTE' };
    if (arguments.length !== 2 || !['principal', 'responsavel'].includes(sessao))
      return { ok: false, codigo: 'SESSAO_INVALIDA' };
    var r = handlesLab.get(this);
    return abrirLabControlado(r, coordenador, sessao);
  }

  async function abrirLabControlado(r, coordenador, sessao) {
    if (!window.LabCoordenador || !window.LabCoordenador.conectarMotor)
      return { ok: false, codigo: 'SESSAO_LAB_INVALIDA' };
    if (r.vinculo && r.coordenador !== coordenador && r.vinculo.vigente())
      return { ok: false, codigo: 'VINCULO_LAB_EM_USO' };
    if (registroLabAtivo() && registroLabAtivo() !== r)
      return { ok: false, codigo: 'DESATIVACAO_LAB_NECESSARIA' };
    var geracao = ++geracaoAberturasLab,
      token = ++r.geracao;
    function atual() {
      return r.configuracao && token === r.geracao && geracao === geracaoAberturasLab;
    }
    if (r.execucao) {
      if (
        r.execucao.coordenador === coordenador &&
        r.execucao.sessao === sessao &&
        !r.execucao.fechando
      ) {
        await aguardarLab(r.execucao);
        if (!atual() || !r.execucao) return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
        var valido = await r.execucao.conexao.revalidar();
        if (!atual() || !valido.ok || !r.execucao.conexao.vigente())
          return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
        r.execucao.oculta = false;
        montarRevisao(r.configuracao, r.execucao.estado);
        return { ok: true };
      }
      return { ok: false, codigo: 'DESATIVACAO_LAB_NECESSARIA' };
    }
    var conexao = await window.LabCoordenador.conectarMotor(coordenador, sessao);
    if (!atual()) return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
    if (!conexao.ok) return conexao;
    if (!configuracaoCorrespondeLab(r.configuracao, conexao))
      return { ok: false, codigo: 'CONFIGURACAO_LAB_DIVERGENTE' };
    var chave = conexao.canal.chave;
    if (chave && armazenamentos[chave]) return { ok: false, codigo: 'COLISAO_CHAVE_LAB' };
    if (
      chave &&
      Object.keys(revisoes).some(function (id) {
        return id !== r.configuracao.id && chavesDaRevisao(revisoes[id]).includes(chave);
      })
    )
      return { ok: false, codigo: 'COLISAO_CHAVE_LAB' };
    if (
      chave &&
      Object.keys(proprietariosLab).some(function (id) {
        return (
          proprietariosLab[id] !== r && chavesReservadasLab(proprietariosLab[id]).includes(chave)
        );
      })
    )
      return { ok: false, codigo: 'COLISAO_CHAVE_LAB' };
    var leitura = await conexao.canal.carregar();
    if (!atual()) return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
    if (!leitura.ok) return leitura;
    var verificacao = await conexao.revalidar();
    if (!atual() || !verificacao.ok || !conexao.vigente())
      return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
    var anterior = registroLabAtivo();
    if (anterior && anterior !== r) return { ok: false, codigo: 'DESATIVACAO_LAB_NECESSARIA' };
    var normalizado = normalizadorDaRevisao(r.configuracao)(
      leitura.estado,
      estadoInicial(r.configuracao)
    );
    if (conexao.reservarMemoria && (!r.reservaMemoria || !r.reservaMemoria.vigente())) {
      var memoria = await conexao.reservarMemoria();
      if (!atual()) {
        if (memoria.ok) memoria.liberar();
        return { ok: false, codigo: 'ABERTURA_LAB_CANCELADA' };
      }
      // Temporário continua utilizável em navegadores sem Web Locks; nesse navegador
      // a preparação de journal permanece indisponível. Outros erros não são dispensados.
      if (
        !memoria.ok &&
        !(conexao.modo === 'temporario' && memoria.codigo === 'WEB_LOCKS_INDISPONIVEIS')
      )
        return memoria;
      if (memoria.ok) r.reservaMemoria = memoria;
    }
    if (!r.chaves.includes(chave)) r.chaves.push(chave);
    r.vinculo = conexao;
    r.coordenador = coordenador;
    r.execucao = {
      conexao: conexao,
      coordenador: coordenador,
      sessao: sessao,
      estado: normalizado,
      versao: 0,
      confirmada: 0,
      pendente: null,
      resultado: metadadosLab(leitura),
      oculta: false,
      fechando: false,
      renderId: 0,
    };
    montarRevisao(r.configuracao, normalizado);
    return { ok: true, durabilidade: metadadosLab(leitura) };
  }

  async function desativarExecucaoLab(r, liberar) {
    var e = r.execucao;
    if (!e) return { ok: true };
    e.liberarSolicitado = e.liberarSolicitado || liberar;
    if (e.fechamento) return e.fechamento;
    e.fechando = true;
    if (revisaoAtiva === r.configuracao) window.GramaticaDitado.parar();
    ++r.geracao;
    ++geracaoAberturasLab;
    e.fechamento = (async function () {
      if (!(await aguardarLab(e))) {
        e.fechando = false;
        e.liberarSolicitado = false;
        return {
          ok: false,
          codigo: 'PROGRESSO_LAB_NAO_DURAVEL',
          estado: copiaEstadoLab(e.estado),
          durabilidade: e.resultado,
        };
      }
      if (!e.conexao.vigente()) {
        e.fechando = false;
        e.liberarSolicitado = false;
        return {
          ok: false,
          codigo: 'SESSAO_LAB_NAO_AUTORIZADA',
          estado: copiaEstadoLab(e.estado),
          durabilidade: e.resultado,
        };
      }
      if (e.liberarSolicitado) {
        var soltura = await e.conexao.liberar();
        if (!soltura.ok) {
          e.fechando = false;
          e.liberarSolicitado = false;
          return soltura;
        }
        r.vinculo = null;
        r.coordenador = null;
      }
      if (revisaoAtiva === r.configuracao) desativarVisual();
      r.execucao = null;
      if (e.conexao.modo === 'persistente' && r.reservaMemoria) {
        r.reservaMemoria.liberar();
        r.reservaMemoria = null;
      }
      var resultado = {
        ok: true,
        durabilidade: e.resultado,
        memoriaPreservada: e.conexao.modo === 'temporario',
      };
      e.estado = null;
      e.conexao = null;
      e.coordenador = null;
      return resultado;
    })();
    var resultado = await e.fechamento;
    if (!resultado.ok) e.fechamento = null;
    return resultado;
  }
  function persistirRegistroLab() {
    var r = handlesLab.get(this);
    if (!r || arguments.length || !r.execucao)
      return Promise.resolve({ ok: false, codigo: 'HANDLE_OU_EXECUCAO_INVALIDA' });
    var e = r.execucao;
    return (async function () {
      await aguardarLab(e);
      if (r.execucao !== e || e.fechando) return { ok: false, codigo: 'OPERACAO_OBSOLETA' };
      if (e.confirmada < e.versao) iniciarGravacaoLab(r, e);
      var ok = await aguardarLab(e);
      return { ok: ok, durabilidade: e.resultado, estado: copiaEstadoLab(e.estado) };
    })();
  }
  function desativarRegistroLab() {
    var r = handlesLab.get(this);
    if (!r || arguments.length) return Promise.resolve({ ok: false, codigo: 'HANDLE_INVALIDO' });
    return desativarExecucaoLab(r, false);
  }

  function liberarRegistroLab() {
    if (arguments.length) return { ok: false, codigo: 'HANDLE_INVALIDO' };
    if (revogadosLab.has(this)) return { ok: true, liberado: true, jaLiberado: true };
    var registro = handlesLab.get(this);
    if (
      !registro ||
      proprietariosLab[registro.configuracao.id] !== registro ||
      revisoes[registro.configuracao.id] !== registro.configuracao
    )
      return { ok: false, codigo: 'HANDLE_INVALIDO' };
    // Não há abertura LAB nesta fase. Se esse contrato mudar, não usar o salvar
    // síncrono legado como confirmação de durabilidade ou descartar estado ativo.
    if (registro.execucao) {
      var handle = this;
      if (!registro.liberacao)
        registro.liberacao = desativarExecucaoLab(registro, true).then(function (resposta) {
          registro.liberacao = null;
          if (!resposta.ok) return resposta;
          return Object.assign({}, liberarRegistroLab.call(handle), {
            durabilidade: resposta.durabilidade,
            memoriaPreservada: resposta.memoriaPreservada,
          });
        });
      return registro.liberacao;
    }
    if (registro.vinculo && registro.vinculo.vigente()) {
      var proprio = this;
      if (!registro.liberacao)
        registro.liberacao = registro.vinculo.liberar().then(function (resposta) {
          registro.liberacao = null;
          if (!resposta.ok) return resposta;
          registro.vinculo = null;
          registro.coordenador = null;
          return liberarRegistroLab.call(proprio);
        });
      return registro.liberacao;
    }
    ++registro.geracao;
    var c = registro.configuracao;
    delete revisoes[c.id];
    delete proprietariosLab[c.id];
    if (typeof c.chave === 'string') delete armazenamentos[c.chave];
    handlesLab.delete(this);
    if (registro.observadores) registro.observadores.clear();
    revogadosLab.add(this);
    registro.configuracao = null;
    registro.vinculo = null;
    registro.coordenador = null;
    registro.chaves = [];
    if (registro.reservaMemoria) {
      registro.reservaMemoria.liberar();
      registro.reservaMemoria = null;
    }
    return {
      ok: true,
      liberado: true,
      jaLiberado: false,
      salvamento: 'nao-aplicavel-registro-inativo',
    };
  }

  function registrarLab(construir) {
    if (typeof construir !== 'function' || arguments.length !== 1)
      return { ok: false, codigo: 'CONSTRUTOR_LAB_INVALIDO' };
    var c;
    try {
      var construida = construir();
      var assincrona = false;
      try {
        // Checar o tipo interno sem ler um getter "then" do objeto recebido.
        Promise.prototype.then.call(
          construida,
          function () {},
          function () {}
        );
        assincrona = true;
      } catch {
        /* Objeto não é uma Promise nativa. */
      }
      if (assincrona) {
        return { ok: false, codigo: 'CONSTRUTOR_LAB_ASSINCRONO' };
      }
      c = copiarConfiguracaoLab(construida);
      var campos = ['aluno', 'chave', 'id', 'materia', 'nome', 'questoes', 'titulo'];
      // Preferência visual do construtor confiável; não pertence ao JSON LAB.
      if (Object.hasOwn(c, 'layout')) {
        if (
          !c.layout ||
          typeof c.layout !== 'object' ||
          Object.keys(c.layout).join(',') !== 'desktopAmplo' ||
          typeof c.layout.desktopAmplo !== 'boolean'
        )
          return { ok: false, codigo: 'CONFIGURACAO_LAB_INVALIDA' };
        campos.push('layout');
        campos.sort();
      }

      var padraoChave =
        /^revisoesEscolares\.lab\.v1\.[a-f0-9]{64}\.(alice|mariana)\.(gramatica|matematica|ciencias|geografia|historia|ingles|leitura)\.[a-z][a-z0-9-]{0,63}\.v([1-9][0-9]{0,3})\.[a-f0-9]{64}\.principal$/;
      var chaveValida = typeof c.chave === 'string' && c.chave.match(padraoChave);
      if (
        Object.keys(c).sort().join(',') !== campos.join(',') ||
        typeof c.id !== 'string' ||
        !/^lab-[a-z0-9-]{1,512}$/.test(c.id) ||
        (c.chave !== null && (!chaveValida || chaveValida[1] !== c.aluno)) ||
        !['alice', 'mariana'].includes(c.aluno) ||
        ![c.nome, c.materia, c.titulo].every(function (s) {
          return typeof s === 'string' && s.trim() && s.length <= 160 && !/[<>]/.test(s);
        }) ||
        !Array.isArray(c.questoes) ||
        c.questoes.length < 1 ||
        c.questoes.length > 30 ||
        !c.questoes.every(function (q) {
          return (
            q &&
            ['opcoes', 'campos'].includes(q.tipo) &&
            Array.isArray(q.itens) &&
            q.itens.length > 0
          );
        })
      )
        return { ok: false, codigo: 'CONFIGURACAO_LAB_INVALIDA' };
    } catch {
      return { ok: false, codigo: 'CONFIGURACAO_LAB_INVALIDA' };
    }
    if (revisoes[c.id]) return { ok: false, codigo: 'COLISAO_ID_LAB' };
    if (
      (c.chave !== null && armazenamentos[c.chave]) ||
      Object.keys(revisoes).some(function (id) {
        return c.chave !== null && chavesDaRevisao(revisoes[id]).includes(c.chave);
      })
    )
      return { ok: false, codigo: 'COLISAO_CHAVE_LAB' };
    c = Object.freeze(
      Object.assign({}, c, {
        validacaoEstritaEstado: true,
        questoes: Object.freeze(
          c.questoes.map(function (q) {
            return Object.freeze(
              Object.assign({}, q, {
                sucesso: typeof q.sucesso === 'string' ? q.sucesso : 'Você conferiu esta questão.',
              })
            );
          })
        ),
      })
    );
    registrar(c);
    var handle = criarHandleLab();
    var registro = {
      configuracao: c,
      geracao: 0,
      execucao: null,
      chaves: [],
      observadores: new Set(),
    };
    handlesLab.set(handle, registro);
    proprietariosLab[c.id] = registro;
    return { ok: true, handle: handle };
  }

  function criarHandleLab() {
    // Este escopo não retém configuração/construtor/questões depois da liberação.
    var handle = {};
    handle.observarDurabilidade = function (callback) {
      var r = handlesLab.get(handle);
      if (this !== handle || !r || typeof callback !== 'function') return null;
      r.observadores.add(callback);
      notificarDurabilidadeLab(r);
      return function () {
        r.observadores.delete(callback);
      };
    };
    handle.consultar = function () {
      if (this !== handle) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      return consultarRegistroLab.apply(handle, arguments);
    };
    handle.abrir = function () {
      if (this !== handle) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      return abrirRegistroLab.apply(handle, arguments);
    };
    handle.liberar = function () {
      if (this !== handle) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      return liberarRegistroLab.apply(handle, arguments);
    };
    handle.persistir = function () {
      if (this !== handle) return Promise.resolve({ ok: false, codigo: 'HANDLE_INVALIDO' });
      return persistirRegistroLab.apply(handle, arguments);
    };
    handle.desativar = function () {
      if (this !== handle) return Promise.resolve({ ok: false, codigo: 'HANDLE_INVALIDO' });
      return desativarRegistroLab.apply(handle, arguments);
    };
    handle.exportarSnapshot = function () {
      if (this !== handle) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      return exportarSnapshotLab.apply(handle, arguments);
    };
    handle.validarSnapshot = function () {
      if (this !== handle) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      return validarSnapshotLab.apply(handle, arguments);
    };
    return Object.freeze(handle);
  }

  function elementoResponsavel(sufixo) {
    return document.getElementById('gramatica-modo-responsavel-' + sufixo);
  }

  function configuracaoModoResponsavel(revisao) {
    var configuracao = revisao && revisao.modoResponsavel;
    if (!configuracao || !configuracao.habilitado || !Array.isArray(configuracao.sessoes))
      return null;
    var ids = [];
    var chaves = [];
    var sessoes = configuracao.sessoes.filter(function (sessao) {
      if (
        !sessao ||
        typeof sessao.id !== 'string' ||
        !sessao.id ||
        typeof sessao.nome !== 'string' ||
        !sessao.nome ||
        typeof sessao.chaveArmazenamento !== 'string' ||
        !sessao.chaveArmazenamento ||
        ids.indexOf(sessao.id) >= 0 ||
        chaves.indexOf(sessao.chaveArmazenamento) >= 0
      )
        return false;
      ids.push(sessao.id);
      chaves.push(sessao.chaveArmazenamento);
      return true;
    });
    if (
      sessoes.length < 2 ||
      !sessoes.some(function (sessao) {
        return sessao.principal === true && sessao.chaveArmazenamento === revisao.chave;
      })
    )
      return null;
    return { sessoes: sessoes };
  }

  function sessaoPrincipal() {
    var configuracao = configuracaoModoResponsavel(revisaoAtiva);
    return (
      configuracao &&
      configuracao.sessoes.find(function (sessao) {
        return sessao.principal === true;
      })
    );
  }

  function sessaoAuxiliarAtiva() {
    var principal = sessaoPrincipal();
    return Boolean(
      modoResponsavelAtivo &&
      sessaoResponsavelAtual &&
      principal &&
      sessaoResponsavelAtual.id !== principal.id
    );
  }

  function chaveDaSessaoAtiva() {
    return sessaoAuxiliarAtiva() ? sessaoResponsavelAtual.chaveArmazenamento : revisaoAtiva.chave;
  }

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function estadoInicial(revisao) {
    var inicial = {
      questaoAtual: 0,
      respostas: {},
      corrigidas: {},
      pontuadas: {},
      pontos: 0,
      finalizada: false,
    };
    if (revisao && revisao.registrarTentativas) inicial.tentativas = {};
    return inicial;
  }

  function normalizadorDaRevisao(revisao) {
    return function (valor, base) {
      valor = objeto(valor);
      if (revisao.validacaoEstritaEstado && valor.versao != null && valor.versao !== 1) valor = {};
      if (revisao.validacaoEstritaEstado) base.versao = 1;
      base.questaoAtual = Math.max(
        0,
        Math.min(revisao.questoes.length - 1, Math.trunc(Number(valor.questaoAtual) || 0))
      );
      base.respostas = objeto(valor.respostas);
      base.corrigidas = {};
      base.pontuadas = {};
      revisao.questoes.forEach(function (item) {
        if (objeto(valor.corrigidas)[item.id]) base.corrigidas[item.id] = true;
        if (objeto(valor.pontuadas)[item.id]) base.pontuadas[item.id] = true;
      });
      if (revisao.validacaoEstritaEstado) {
        base.respostas = {};
        base.conferidas = {};
        revisao.questoes.forEach(function (item) {
          if (objeto(valor.conferidas)[item.id] === true) base.conferidas[item.id] = true;
          var entrada = objeto(valor.respostas)[item.id];
          if (Array.isArray(entrada)) {
            base.respostas[item.id] = item.itens.map(function (subitem, indice) {
              if (
                item.tipo === 'selecao' ||
                (item.tipo === 'misto' && subitem.tipo === 'selecao')
              ) {
                return Array.isArray(entrada[indice])
                  ? subitem.opcoes.filter(function (opcao) {
                      return entrada[indice].indexOf(opcao) >= 0;
                    })
                  : [];
              }
              if (item.tipo === 'misto' && subitem.tipo === 'ordenacao') {
                var ordem = Array.isArray(entrada[indice]) ? entrada[indice] : [];
                return ordem
                  .filter(function (cartao, posicao) {
                    return (
                      typeof cartao === 'string' &&
                      subitem.cartoes.indexOf(cartao) >= 0 &&
                      ordem.indexOf(cartao) === posicao
                    );
                  })
                  .slice(0, subitem.respostas.length);
              }
              var texto = typeof entrada[indice] === 'string' ? entrada[indice].slice(0, 1000) : '';
              if (subitem.opcoes && subitem.opcoes.indexOf(texto) < 0) return '';
              if (
                item.tipo === 'ordenacao' &&
                (item.cartoes.indexOf(texto) < 0 || entrada.indexOf(texto) !== indice)
              )
                return '';
              return texto;
            });
          }
          if (!avaliar(item, base.respostas[item.id] || []).every(Boolean))
            delete base.corrigidas[item.id];
        });
      }
      base.pontos = Object.keys(base.pontuadas).length;
      if (revisao.registrarTentativas) {
        base.tentativas = {};
        revisao.questoes.forEach(function (item) {
          var quantidade = Number(objeto(valor.tentativas)[item.id]);
          if (Number.isInteger(quantidade) && quantidade > 0)
            base.tentativas[item.id] = Math.min(quantidade, 999);
        });
      }
      base.finalizada =
        Boolean(valor.finalizada) &&
        Object.keys(base.corrigidas).length === revisao.questoes.length;
      return base;
    };
  }

  function registrar(configuracao) {
    if (!configuracao || !configuracao.id || revisoes[configuracao.id]) {
      throw new Error('Cadastro de questionário inválido ou repetido.');
    }
    if (!Array.isArray(configuracao.questoes) || configuracao.questoes.length === 0) {
      throw new Error('O questionário precisa ter questões.');
    }
    if (
      Object.keys(proprietariosLab).length &&
      Object.keys(proprietariosLab).some(function (id) {
        return chavesReservadasLab(proprietariosLab[id]).some(function (k) {
          return chavesDaRevisao(configuracao).includes(k);
        });
      })
    )
      throw new Error('Chave reservada por registro LAB.');
    revisoes[configuracao.id] = configuracao;
  }

  function obterArmazenamento(revisao, chave) {
    chave = chave || revisao.chave;
    if (!armazenamentos[chave]) {
      armazenamentos[chave] = window.ArmazenamentoRevisoes.criar({
        chave: chave,
        padrao: estadoInicial(revisao),
        normalizar: normalizadorDaRevisao(revisao),
      });
    }
    return armazenamentos[chave];
  }

  function emitirProgresso(revisao) {
    document.dispatchEvent(
      new CustomEvent('revisaoprogressoalterado', { detail: { revisaoId: revisao.id } })
    );
  }

  function salvar() {
    estado.pontos = Object.keys(estado.pontuadas).length;
    var lab = registroLabAtivo();
    if (lab && lab.execucao) {
      salvarLab(lab);
      return;
    }
    estado = obterArmazenamento(revisaoAtiva, chaveDaSessaoAtiva()).salvar(estado);
    if (!sessaoAuxiliarAtiva()) emitirProgresso(revisaoAtiva);
  }

  function normalizarResposta(valor, acentuacaoObrigatoria, maiusculasObrigatorias) {
    var resposta = String(valor == null ? '' : valor)
      .trim()
      .replace(/\s+([.!?])/g, '$1')
      .replace(/\s+/g, ' ');
    if (!maiusculasObrigatorias) resposta = resposta.toLowerCase();
    if (!acentuacaoObrigatoria) {
      resposta = resposta.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return resposta;
  }

  function respostaCorreta(valor, subitem) {
    var normalizada = normalizarResposta(
      valor,
      subitem.acentuacaoObrigatoria,
      subitem.maiusculasObrigatorias
    );
    if (subitem.pontuacaoFlexivel)
      normalizada = normalizada.replace(/[.,!?;:—-]/g, '').replace(/\s+/g, ' ');
    return subitem.respostas.some(function (resposta) {
      if (subitem.pontuacaoFlexivel)
        resposta = resposta.replace(/[.,!?;:—-]/g, '').replace(/\s+/g, ' ');
      return (
        normalizarResposta(
          resposta,
          subitem.acentuacaoObrigatoria,
          subitem.maiusculasObrigatorias
        ) === normalizada
      );
    });
  }

  function escapar(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function respostasDaQuestao(item) {
    var respostas = estado.respostas[item.id];
    return Array.isArray(respostas) ? respostas.slice(0, item.itens.length) : [];
  }

  function montarCampos(item, respostas) {
    return (
      '<div class="lista-campos-mariana">' +
      item.itens
        .map(function (subitem, indice) {
          var idCampo =
            'gramatica-resposta-' +
            (item.apresentacaoDitadoSegura ? 'ditado' : item.id) +
            '-' +
            indice;
          if (item.ditado) {
            return (
              '<div class="campo-mariana campo-mariana-ditado' +
              (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
              '"><label for="' +
              escapar(idCampo) +
              '"><span>' +
              escapar(subitem.pergunta) +
              '</span></label><div class="campo-resposta-ditado"><input id="' +
              escapar(idCampo) +
              '" type="text" data-resposta-gramatica="' +
              indice +
              '" value="' +
              escapar(respostas[indice] || '') +
              '" autocomplete="off" autocapitalize="' +
              (subitem.maiusculasObrigatorias ? 'off' : 'sentences') +
              '"' +
              (item.unidadeDitado ? ' spellcheck="false"' : '') +
              '>' +
              window.GramaticaDitado.botaoHtml(indice, item.unidadeDitado, subitem.rotuloDitado) +
              '</div>' +
              (subitem.inserirTravessao
                ? '<button class="botao-secundario" type="button" data-inserir-travessao="' +
                  indice +
                  '">Inserir travessão —</button>'
                : '') +
              '</div>'
            );
          }
          if (subitem.inserirTravessao) {
            return (
              '<div class="campo-mariana' +
              (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
              '"><label for="' +
              escapar(idCampo) +
              '"><span>' +
              escapar(subitem.pergunta) +
              '</span></label><input id="' +
              escapar(idCampo) +
              '" type="text" data-resposta-gramatica="' +
              indice +
              '" value="' +
              escapar(respostas[indice] || '') +
              '" autocomplete="off" autocapitalize="sentences">' +
              '<button class="botao-secundario" type="button" data-inserir-travessao="' +
              indice +
              '">Inserir travessão —</button></div>'
            );
          }
          return (
            '<label class="campo-mariana' +
            (subitem.fraseCompleta ? ' campo-gramatica-frase' : '') +
            '"><span>' +
            escapar(subitem.pergunta) +
            '</span>' +
            (subitem.imagem
              ? '<img class="imagem-campo-questionario" src="' +
                escapar(subitem.imagem) +
                '" alt="' +
                escapar(subitem.imagemAlt || '') +
                '">'
              : '') +
            '<input type="text" data-resposta-gramatica="' +
            indice +
            '" value="' +
            escapar(respostas[indice] || '') +
            '" autocomplete="off" autocapitalize="sentences"></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function respostaPreenchida(item, subitem, resposta) {
    if (item.tipo === 'misto' && subitem.tipo === 'ordenacao') {
      return Array.isArray(resposta) && resposta.length === subitem.respostas.length;
    }
    if (item.tipo === 'selecao' || (item.tipo === 'misto' && subitem.tipo === 'selecao')) {
      return Array.isArray(resposta) && resposta.length > 0;
    }
    return normalizarResposta(resposta, subitem.acentuacaoObrigatoria) !== '';
  }

  function montarOpcoes(item, respostas) {
    return item.itens
      .map(function (subitem, indice) {
        var mapa = indice === 0 ? item.mapaVisual : null;
        if (mapa) {
          return (
            '<fieldset class="questao-mariana questao-mapa-visual" data-item-gramatica="' +
            indice +
            '"><legend>' +
            escapar(subitem.pergunta) +
            '</legend><div class="mapa-visual-questionario" role="group" aria-label="' +
            escapar(mapa.rotulo || subitem.pergunta) +
            '"><img src="' +
            escapar(mapa.imagem) +
            '" alt="' +
            escapar(mapa.descricao || '') +
            '">' +
            mapa.pontos
              .map(function (ponto) {
                var selecionada = respostas[indice] === ponto.opcao;
                return (
                  '<button type="button" class="ponto-mapa-visual opcao-mariana' +
                  (selecionada ? ' selecionada' : '') +
                  '" style="--mapa-x:' +
                  Math.max(0, Math.min(100, Number(ponto.x) || 0)) +
                  '%;--mapa-y:' +
                  Math.max(0, Math.min(100, Number(ponto.y) || 0)) +
                  '%" data-opcao-gramatica="' +
                  escapar(ponto.opcao) +
                  '" aria-pressed="' +
                  String(selecionada) +
                  '" aria-label="' +
                  escapar(ponto.rotulo || ponto.opcao) +
                  '"><span aria-hidden="true">' +
                  (selecionada ? '✓' : '○') +
                  '</span><span class="rotulo-ponto-mapa">' +
                  escapar(ponto.opcao) +
                  '</span></button>'
                );
              })
              .join('') +
            '</div></fieldset>'
          );
        }
        return (
          '<fieldset class="questao-mariana" data-item-gramatica="' +
          indice +
          '"><legend>' +
          escapar(subitem.pergunta) +
          '</legend>' +
          (subitem.imagem
            ? '<img class="' +
              (subitem.imagemAmpla
                ? 'imagem-item-questionario-ampla'
                : 'imagem-item-questionario') +
              '" src="' +
              escapar(subitem.imagem) +
              '" alt="' +
              escapar(subitem.imagemAlt || '') +
              '">'
            : '') +
          '<div class="opcoes-mariana">' +
          subitem.opcoes
            .map(function (opcao) {
              var selecionada = respostas[indice] === opcao;
              return (
                '<button type="button" class="opcao-mariana' +
                (selecionada ? ' selecionada' : '') +
                '" data-opcao-gramatica="' +
                escapar(opcao) +
                '" aria-pressed="' +
                String(selecionada) +
                '">' +
                (item.opcoesReversiveis
                  ? '<span aria-hidden="true">' + (selecionada ? '✓ ' : '○ ') + '</span>'
                  : '') +
                escapar(opcao) +
                '</button>'
              );
            })
            .join('') +
          '</div></fieldset>'
        );
      })
      .join('');
  }

  function atualizarNavegacao() {
    var total = revisaoAtiva.questoes.length;
    var indice = estado.questaoAtual;
    var item = revisaoAtiva.questoes[indice];
    var finalizada = estado.finalizada;
    document.getElementById('gramatica-contador').textContent = finalizada
      ? total + ' questões concluídas'
      : 'Questão ' + (indice + 1) + ' de ' + total;
    document.getElementById('gramatica-pontos').textContent = estado.pontos + ' de ' + total;
    document.getElementById('gramatica-barra').style.width =
      ((finalizada ? total : indice + 1) / total) * 100 + '%';
    var progresso = document.getElementById('gramatica-progresso');
    progresso.setAttribute('aria-valuemax', total);
    progresso.setAttribute('aria-valuenow', finalizada ? total : indice + 1);
    document.getElementById('gramatica-voltar').disabled = !finalizada && indice === 0;
    var proxima = document.getElementById('gramatica-proxima');
    proxima.hidden = finalizada;
    proxima.disabled = !estado.corrigidas[item.id];
    proxima.textContent = indice === total - 1 ? 'Concluir revisão →' : 'Próxima →';
  }

  function anunciar(item, mensagem, sucesso) {
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className =
      'retorno retorno-mariana retorno-gramatica ' + (sucesso ? 'sucesso' : 'tente-novamente');
    retorno.textContent = mensagem || item.dica;
  }

  function invalidarCorrecao(item) {
    if (estado.corrigidas[item.id]) delete estado.corrigidas[item.id];
    if (estado.conferidas) delete estado.conferidas[item.id];
    conteudo.querySelectorAll('.campo-correto, .campo-incorreto').forEach(function (elemento) {
      elemento.classList.remove('campo-correto', 'campo-incorreto');
      elemento.removeAttribute('aria-invalid');
    });
    conteudo.querySelectorAll('.correta, .incorreta').forEach(function (elemento) {
      elemento.classList.remove('correta', 'incorreta');
    });
    var retorno = conteudo.querySelector('.retorno-gramatica');
    retorno.className = 'retorno retorno-mariana retorno-gramatica';
    retorno.textContent = '';
    salvar();
    atualizarNavegacao();
  }

  function configurarInteracoes(item) {
    if (window.QuestionariosInteracoes.aceita(item)) {
      window.QuestionariosInteracoes.configurar(
        conteudo,
        item,
        function () {
          return respostasDaQuestao(item);
        },
        function (respostas) {
          estado.respostas[item.id] = respostas;
          invalidarCorrecao(item);
        },
        escapar
      );
    } else if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input) {
        input.addEventListener(
          'input',
          protegerEventoLab(function () {
            var respostas = respostasDaQuestao(item);
            respostas[Number(input.dataset.respostaGramatica)] = input.value;
            estado.respostas[item.id] = respostas;
            invalidarCorrecao(item);
          })
        );
        input.addEventListener(
          'keydown',
          protegerEventoLab(function (evento) {
            if (evento.key === 'Enter' && !evento.isComposing) {
              evento.preventDefault();
              conferir(item);
            }
          })
        );
      });
      conteudo.querySelectorAll('[data-inserir-travessao]').forEach(function (botao) {
        botao.addEventListener(
          'click',
          protegerEventoLab(function () {
            var input = conteudo.querySelector(
              '[data-resposta-gramatica="' + botao.dataset.inserirTravessao + '"]'
            );
            input.setRangeText('—', input.selectionStart, input.selectionEnd, 'end');
            input.dispatchEvent(new window.Event('input', { bubbles: true }));
            input.focus();
          })
        );
      });
    } else {
      conteudo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
        botao.addEventListener(
          'click',
          protegerEventoLab(function () {
            var grupo = botao.closest('[data-item-gramatica]');
            var indice = Number(grupo.dataset.itemGramatica);
            var respostas = respostasDaQuestao(item);
            var retirar =
              item.opcoesReversiveis && respostas[indice] === botao.dataset.opcaoGramatica;
            respostas[indice] = retirar ? '' : botao.dataset.opcaoGramatica;
            estado.respostas[item.id] = respostas;
            grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (outra) {
              var selecionada = !retirar && outra === botao;
              outra.classList.toggle('selecionada', selecionada);
              outra.setAttribute('aria-pressed', String(selecionada));
              if (item.opcoesReversiveis)
                outra.querySelector('span').textContent = selecionada ? '✓ ' : '○ ';
            });
            invalidarCorrecao(item);
          })
        );
      });
    }
    var revisaoDitado = revisaoAtiva;
    var autorizadoDitado = protegerEventoLab(function () {
      return true;
    });
    window.GramaticaDitado.configurar(conteudo, item, function () {
      return revisaoAtiva === revisaoDitado && autorizadoDitado() === true;
    });
    conteudo.querySelector('[data-conferir-gramatica]').addEventListener(
      'click',
      protegerEventoLab(function () {
        conferir(item);
      })
    );
  }

  function marcarResultado(item, acertos) {
    if (item.tipo === 'campos') {
      conteudo.querySelectorAll('[data-resposta-gramatica]').forEach(function (input, indice) {
        input.classList.toggle('campo-correto', acertos[indice]);
        input.classList.toggle('campo-incorreto', !acertos[indice]);
        input.setAttribute('aria-invalid', String(!acertos[indice]));
      });
    } else {
      conteudo.querySelectorAll('[data-item-gramatica]').forEach(function (grupo, indice) {
        grupo.querySelectorAll('[data-opcao-gramatica]').forEach(function (botao) {
          var selecionada = botao.getAttribute('aria-pressed') === 'true';
          botao.classList.toggle('correta', selecionada && acertos[indice]);
          botao.classList.toggle('incorreta', selecionada && !acertos[indice]);
        });
      });
    }
  }

  function avaliar(item, respostas) {
    if (window.QuestionariosInteracoes.aceita(item))
      return window.QuestionariosInteracoes.acertos(item, respostas);
    return item.itens.map(function (subitem, indice) {
      return respostaCorreta(respostas[indice], subitem);
    });
  }

  function semAcentos(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function diagnosticarCampo(subitem, resposta) {
    var mensagens = subitem.feedbackErros;
    if (!mensagens) return [];
    var valor = String(resposta || '').trim();
    var esperado = String(subitem.respostas[0] || '').trim();
    if (!valor) return mensagens.incompleta ? [mensagens.incompleta] : [];

    var diagnosticos = [];
    if (mensagens.inicio && esperado.indexOf('— ') === 0 && valor.indexOf('— ') !== 0) {
      diagnosticos.push(mensagens.inicio);
    }

    var sinalFinal = esperado.match(/[.!?]$/);
    if (mensagens.final && sinalFinal && !valor.endsWith(sinalFinal[0])) {
      diagnosticos.push(mensagens.final);
    }

    var palavrasEsperadas = esperado
      .replace(/^—\s*/, '')
      .replace(/[.!?]$/, '')
      .split(/\s+/);
    var palavrasInformadas = valor
      .replace(/^[-—]\s*/, '')
      .replace(/[.!?]$/, '')
      .split(/\s+/);
    if (mensagens.incompleta && palavrasInformadas.length < palavrasEsperadas.length) {
      diagnosticos.push(mensagens.incompleta);
    } else {
      var textoEsperado = palavrasEsperadas.join(' ').toLowerCase();
      var textoInformado = palavrasInformadas.join(' ').toLowerCase();
      if (
        mensagens.acentuacao &&
        textoEsperado !== textoInformado &&
        semAcentos(textoEsperado) === semAcentos(textoInformado)
      ) {
        diagnosticos.push(mensagens.acentuacao);
      } else if (mensagens.palavras && textoEsperado !== textoInformado) {
        diagnosticos.push(mensagens.palavras);
      }
    }
    return diagnosticos;
  }

  function mensagemDeRevisao(item, respostas, acertos) {
    var itensParaRever = item.itens
      .filter(function (_subitem, indice) {
        return !acertos[indice];
      })
      .map(function (subitem) {
        return subitem.pergunta;
      })
      .join('; ');
    var orientacoes = [];
    item.itens.forEach(function (subitem, indice) {
      if (acertos[indice]) return;
      diagnosticarCampo(subitem, respostas[indice]).forEach(function (mensagem) {
        if (orientacoes.indexOf(mensagem) === -1) orientacoes.push(mensagem);
      });
    });
    return (
      '↻ Revise os itens destacados. Itens para rever: ' +
      itensParaRever +
      '. ' +
      (orientacoes.length ? orientacoes.join(' ') : item.dica)
    );
  }

  function conferir(item) {
    var respostas = respostasDaQuestao(item);
    var acertos = avaliar(item, respostas);
    if (revisaoAtiva.validacaoEstritaEstado) {
      estado.conferidas = estado.conferidas || {};
      estado.conferidas[item.id] = true;
      salvar();
    }
    var completos = item.itens.map(function (subitem, indice) {
      return respostaPreenchida(item, subitem, respostas[indice]);
    });
    marcarResultado(item, acertos);
    if (
      completos.some(function (completo) {
        return !completo;
      })
    ) {
      anunciar(item, 'Complete todos os itens antes de conferir novamente.', false);
      return;
    }
    if (revisaoAtiva.registrarTentativas) {
      estado.tentativas = estado.tentativas || {};
      estado.tentativas[item.id] = Math.min((estado.tentativas[item.id] || 0) + 1, 999);
    }
    if (acertos.every(Boolean)) {
      estado.corrigidas[item.id] = true;
      estado.pontuadas[item.id] = true;
      salvar();
      anunciar(item, '✓ ' + item.sucesso, true);
      atualizarNavegacao();
      return;
    }
    delete estado.corrigidas[item.id];
    salvar();
    anunciar(item, mensagemDeRevisao(item, respostas, acertos), false);
    atualizarNavegacao();
  }

  function renderizarQuestao() {
    var item = revisaoAtiva.questoes[estado.questaoAtual];
    var respostas = respostasDaQuestao(item);
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">' +
      escapar(item.bloco) +
      '</p><h1 id="gramatica-titulo-questao">' +
      escapar(item.titulo) +
      '</h1><p class="explicacao-mariana">' +
      escapar(item.instrucao) +
      '</p></div><img class="icone-etapa" src="' +
      escapar(item.icone || '../assets/objetos_escolares/pencil.svg') +
      '" alt=""></div>' +
      '<div class="atividade-mariana' +
      (item.leitura ? ' gramatica-com-leitura' : '') +
      '">' +
      (item.leitura
        ? '<div class="leitura-gramatica" role="region" aria-label="' +
          escapar(item.leituraTitulo || 'Leia para aprender') +
          '"><p class="titulo-leitura-questionario">📖 ' +
          escapar(item.leituraTitulo || 'Leia para aprender') +
          '</p><p class="texto-leitura-questionario">' +
          escapar(item.leitura) +
          '</p>' +
          (item.fonteEstudo
            ? '<p class="fonte-estudo-questionario">Fonte de estudo: ' +
              escapar(item.fonteEstudo) +
              '</p>'
            : '') +
          (item.ilustracaoLeitura
            ? '<img class="ilustracao-leitura-questionario" src="' +
              escapar(item.ilustracaoLeitura) +
              '" alt="' +
              escapar(item.descricaoIlustracao || '') +
              '">'
            : '') +
          '</div>'
        : '') +
      '<div class="respostas-gramatica">' +
      (item.ditado
        ? window.GramaticaDitado.painelHtml(
            item.unidadeDitado,
            item.instrucaoDitado,
            item.idiomaDitado
          )
        : '') +
      (window.QuestionariosInteracoes.aceita(item)
        ? '<div data-interacao-questionario>' +
          window.QuestionariosInteracoes.montar(item, respostas, escapar) +
          '</div>'
        : item.tipo === 'campos'
          ? montarCampos(item, respostas)
          : montarOpcoes(item, respostas)) +
      '<div class="acoes-atividade-mariana"><button class="botao-principal botao-grande" type="button" data-conferir-gramatica>Conferir</button>' +
      '<div class="retorno retorno-mariana retorno-gramatica" role="status" aria-live="polite"></div></div></div></div></article>';
    configurarInteracoes(item);
    if (estado.corrigidas[item.id]) {
      marcarResultado(
        item,
        item.itens.map(function () {
          return true;
        })
      );
      anunciar(item, '✓ ' + item.sucesso, true);
    } else if (estado.conferidas && estado.conferidas[item.id]) {
      var acertos = avaliar(item, respostas);
      marcarResultado(item, acertos);
      anunciar(item, mensagemDeRevisao(item, respostas, acertos), false);
    }
  }

  function renderizarFinal() {
    conteudo.innerHTML =
      '<article class="etapa-mariana"><div class="cabecalho-etapa-mariana"><div>' +
      '<p class="etiqueta">Revisão concluída</p><h1 id="gramatica-titulo-questao">Parabéns, ' +
      escapar(revisaoAtiva.nome) +
      '!</h1><p class="explicacao-mariana">' +
      escapar(revisaoAtiva.resumoFinal) +
      '</p></div><img class="icone-etapa" src="../assets/objetos_escolares/book.svg" alt=""></div>' +
      '<div class="atividade-mariana"><p class="retorno sucesso" role="status">' +
      (registroLabAtivo()
        ? 'Confira abaixo a situação do salvamento das respostas.'
        : '✓ Seu progresso ficou salvo neste computador.') +
      '</p>' +
      '<button class="botao-principal botao-grande" type="button" data-ir-inicio>' +
      (registroLabAtivo() ? 'Voltar ao Laboratório' : 'Voltar ao início') +
      '</button></div></article>';
    conteudo.querySelector('[data-ir-inicio]').addEventListener(
      'click',
      protegerEventoLab(function () {
        var lab = registroLabAtivo();
        if (lab) {
          if (controladorApp && controladorApp.retornarLab) {
            controladorApp.retornarLab();
            return;
          }
          void desativarExecucaoLab(lab, false);
          return;
        }
        document.getElementById('botao-inicio').click();
      })
    );
  }

  function renderizar() {
    var lab = registroLabAtivo();
    if (lab && lab.execucao) ++lab.execucao.renderId;
    window.GramaticaDitado.parar();
    if (estado.finalizada) renderizarFinal();
    else renderizarQuestao();
    atualizarNavegacao();
    atualizarModoResponsavel();
    if (lab) configurarNavegacao();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (revisaoAtiva.materia) {
      var titulo = conteudo.querySelector('h1');
      titulo.tabIndex = -1;
      titulo.focus({ preventScroll: true });
    }
  }

  function irPara(indice) {
    estado.finalizada = false;
    estado.questaoAtual = Math.max(0, Math.min(revisaoAtiva.questoes.length - 1, indice));
    salvar();
    renderizar();
  }

  function abrir(id) {
    if (
      controladorApp &&
      controladorApp.antesAbrir &&
      controladorApp.antesAbrir(function () {
        abrir(id);
      })
    )
      return;
    if (proprietariosLab[id]) throw new Error('Abertura LAB pendente da LAB.2C.2.');
    var revisao = revisoes[id];
    if (!revisao) throw new Error('Questionário não cadastrado: ' + id);
    ++geracaoAberturasLab;
    separarVisualLab();
    montarRevisao(revisao);
  }
  function montarRevisao(revisao, estadoLab) {
    revisaoAtiva = revisao;
    modoResponsavelAtivo = false;
    sessaoResponsavelAtual = null;
    fecharPainelModoResponsavel();
    var materia = revisao.materia || 'Gramática';
    var painel = document.getElementById('tela-gramatica-mariana');
    painel.querySelector('.migalhas strong').textContent = materia;
    painel
      .querySelector('.migalhas')
      .setAttribute('aria-label', 'Navegação da revisão de ' + materia);
    document
      .getElementById('gramatica-progresso')
      .setAttribute('aria-label', 'Progresso da revisão de ' + materia);
    document
      .getElementById('tela-gramatica-mariana')
      .classList.toggle(
        'layout-desktop-amplo',
        Boolean(revisao.layout && revisao.layout.desktopAmplo)
      );
    conteudo = document.getElementById('gramatica-conteudo');
    estado = estadoLab || obterArmazenamento(revisao).carregar();
    document.getElementById('gramatica-nome-perfil').textContent = revisao.nome;
    if (!registroLabAtivo()) configurarNavegacao();
    renderizar();
    if (controladorApp && !registroLabAtivo()) controladorApp.mostrarTela('gramaticaMariana');
  }
  function configurarNavegacao() {
    document.getElementById('gramatica-voltar').onclick = protegerEventoLab(function () {
      if (estado.finalizada) irPara(revisaoAtiva.questoes.length - 1);
      else irPara(estado.questaoAtual - 1);
    });
    document.getElementById('gramatica-proxima').onclick = protegerEventoLab(function () {
      var item = revisaoAtiva.questoes[estado.questaoAtual];
      if (!estado.corrigidas[item.id]) return;
      if (estado.questaoAtual === revisaoAtiva.questoes.length - 1) {
        estado.finalizada = true;
        salvar();
        renderizar();
      } else {
        irPara(estado.questaoAtual + 1);
      }
    });
  }

  function limpar(id, pedirConfirmacao) {
    if (proprietariosLab[id]) return false;
    var revisao = revisoes[id];
    if (!revisao) return false;
    if (
      pedirConfirmacao &&
      !window.confirm(
        'Limpar apenas o progresso desta revisão de ' +
          (revisao.materia || 'Gramática') +
          ' de ' +
          revisao.nome +
          '?'
      )
    ) {
      return false;
    }
    var auxiliar = revisaoAtiva && revisaoAtiva.id === id && sessaoAuxiliarAtiva();
    obterArmazenamento(revisao, auxiliar ? chaveDaSessaoAtiva() : revisao.chave).remover();
    if (revisaoAtiva && revisaoAtiva.id === id) {
      estado = estadoInicial(revisao);
      if (conteudo) renderizar();
    }
    if (!auxiliar) emitirProgresso(revisao);
    return true;
  }

  function obterEstado(id) {
    if (proprietariosLab[id]) return null;
    var revisao = revisoes[id];
    if (!revisao) return null;
    if (revisaoAtiva && revisaoAtiva.id === id && estado && !sessaoAuxiliarAtiva()) return estado;
    return obterArmazenamento(revisao).carregar();
  }

  function obterSituacao(id) {
    var atual = obterEstado(id);
    if (!atual) return 'nao-iniciada';
    if (atual.finalizada) return 'concluida';
    if (
      atual.questaoAtual > 0 ||
      Object.keys(atual.respostas).length > 0 ||
      Object.keys(atual.corrigidas).length > 0
    ) {
      return 'em-andamento';
    }
    return 'nao-iniciada';
  }

  function inicializar(controlador) {
    controladorApp = controlador;
    instalarEventosModoResponsavel();
  }

  function fecharPainelModoResponsavel() {
    var painel = document.getElementById('gramatica-modo-responsavel');
    if (!painel || painel.hidden) return;
    painel.hidden = true;
    if (focoAntesDoPainelResponsavel && focoAntesDoPainelResponsavel.isConnected)
      focoAntesDoPainelResponsavel.focus();
    focoAntesDoPainelResponsavel = null;
  }

  function atualizarModoResponsavel() {
    var painel = document.getElementById('gramatica-modo-responsavel');
    if (!painel) return;
    var faixa = document.getElementById('gramatica-faixa-modo-responsavel');
    var configuracao = configuracaoModoResponsavel(revisaoAtiva);
    if (!configuracao) {
      painel.hidden = true;
      faixa.hidden = true;
      return;
    }
    var sessao =
      modoResponsavelAtivo && sessaoResponsavelAtual ? sessaoResponsavelAtual : sessaoPrincipal();
    var seletor = elementoResponsavel('sessao');
    var assinatura = configuracao.sessoes
      .map(function (item) {
        return item.id + '|' + item.nome;
      })
      .join(';');
    if (seletor.dataset.sessoes !== assinatura) {
      seletor.innerHTML = '';
      configuracao.sessoes.forEach(function (item) {
        var opcao = document.createElement('option');
        opcao.value = item.id;
        opcao.textContent = item.nome;
        seletor.appendChild(opcao);
      });
      seletor.dataset.sessoes = assinatura;
    }
    seletor.value = sessao.id;
    elementoResponsavel('sessao-atual').textContent = sessao.nome;
    elementoResponsavel('questao-atual').textContent =
      estado.questaoAtual + 1 + ' de ' + revisaoAtiva.questoes.length;
    var campo = elementoResponsavel('questao');
    campo.max = String(revisaoAtiva.questoes.length);
    if (document.activeElement !== campo) campo.value = String(estado.questaoAtual + 1);
    elementoResponsavel('anterior').disabled = estado.questaoAtual === 0;
    elementoResponsavel('proxima').disabled =
      estado.questaoAtual === revisaoAtiva.questoes.length - 1;
    faixa.hidden = !sessaoAuxiliarAtiva();
    faixa.textContent =
      '🔐 Modo Responsável · sessão de ' +
      sessao.nome +
      ' · questão ' +
      (estado.questaoAtual + 1) +
      ' de ' +
      revisaoAtiva.questoes.length;
  }

  function abrirPainelModoResponsavel() {
    if (!configuracaoModoResponsavel(revisaoAtiva)) return;
    if (!modoResponsavelAtivo) {
      modoResponsavelAtivo = true;
      sessaoResponsavelAtual = sessaoPrincipal();
    }
    focoAntesDoPainelResponsavel = document.activeElement;
    document.getElementById('gramatica-modo-responsavel').hidden = false;
    atualizarModoResponsavel();
    elementoResponsavel('titulo').focus();
  }

  function trocarSessaoModoResponsavel(id) {
    var configuracao = configuracaoModoResponsavel(revisaoAtiva);
    if (!modoResponsavelAtivo || !configuracao) return;
    var nova = configuracao.sessoes.find(function (item) {
      return item.id === id;
    });
    if (!nova || nova.id === sessaoResponsavelAtual.id) return;
    salvar();
    window.GramaticaDitado.parar();
    sessaoResponsavelAtual = nova;
    estado = obterArmazenamento(revisaoAtiva, nova.chaveArmazenamento).carregar();
    renderizar();
    document.getElementById('gramatica-modo-responsavel').hidden = false;
    elementoResponsavel('status').textContent =
      'Sessão de ' + nova.nome + ' carregada sem copiar dados de outra sessão.';
  }

  function irParaQuestaoModoResponsavel(indice) {
    if (!modoResponsavelAtivo || !sessaoResponsavelAtual) return;
    var destino = Number(indice);
    if (!Number.isInteger(destino) || destino < 0 || destino >= revisaoAtiva.questoes.length) {
      elementoResponsavel('status').textContent =
        'Informe uma questão entre 1 e ' + revisaoAtiva.questoes.length + '.';
      return;
    }
    estado.questaoAtual = destino;
    estado.finalizada = false;
    salvar();
    renderizar();
    elementoResponsavel('status').textContent =
      'Questão ' + (destino + 1) + ' aberta na sessão de ' + sessaoResponsavelAtual.nome + '.';
  }

  function encerrarModoResponsavel() {
    if (!modoResponsavelAtivo) return;
    salvar();
    window.GramaticaDitado.parar();
    modoResponsavelAtivo = false;
    sessaoResponsavelAtual = null;
    estado = obterArmazenamento(revisaoAtiva).carregar();
    document.getElementById('gramatica-modo-responsavel').hidden = true;
    focoAntesDoPainelResponsavel = null;
    renderizar();
  }

  function instalarEventosModoResponsavel() {
    if (eventosModoResponsavelInstalados) return;
    eventosModoResponsavelInstalados = true;
    var painel = document.getElementById('gramatica-modo-responsavel');
    elementoResponsavel('fechar').addEventListener('click', fecharPainelModoResponsavel);
    elementoResponsavel('encerrar').addEventListener('click', encerrarModoResponsavel);
    elementoResponsavel('sessao').addEventListener('change', function (evento) {
      trocarSessaoModoResponsavel(evento.target.value);
    });
    elementoResponsavel('ir').addEventListener('submit', function (evento) {
      evento.preventDefault();
      irParaQuestaoModoResponsavel(Number(elementoResponsavel('questao').value) - 1);
    });
    elementoResponsavel('anterior').addEventListener('click', function () {
      irParaQuestaoModoResponsavel(estado.questaoAtual - 1);
    });
    elementoResponsavel('proxima').addEventListener('click', function () {
      irParaQuestaoModoResponsavel(estado.questaoAtual + 1);
    });
    document.addEventListener('keydown', function (evento) {
      if (
        !revisaoAtiva ||
        document.getElementById('tela-gramatica-mariana').hidden ||
        !configuracaoModoResponsavel(revisaoAtiva)
      )
        return;
      var alvo = evento.target;
      var editavel =
        alvo &&
        (alvo.matches('input, textarea, select') || alvo.isContentEditable) &&
        !painel.contains(alvo);
      if (
        evento.ctrlKey &&
        evento.altKey &&
        !evento.shiftKey &&
        String(evento.key).toLocaleLowerCase('pt-BR') === 'r'
      ) {
        if (editavel) return;
        evento.preventDefault();
        if (painel.hidden) abrirPainelModoResponsavel();
        else fecharPainelModoResponsavel();
      } else if (evento.key === 'Escape' && !painel.hidden) {
        evento.preventDefault();
        fecharPainelModoResponsavel();
      }
    });
  }

  function desativarVisual() {
    var lab = registroLabAtivo();
    window.GramaticaDitado.parar();
    fecharPainelModoResponsavel();
    modoResponsavelAtivo = false;
    sessaoResponsavelAtual = null;
    document.getElementById('gramatica-faixa-modo-responsavel').hidden = true;
    document.getElementById('tela-gramatica-mariana').classList.remove('layout-desktop-amplo');
    var painel = document.getElementById('tela-gramatica-mariana');
    painel.querySelector('.migalhas strong').textContent = 'Gramática';
    painel
      .querySelector('.migalhas')
      .setAttribute('aria-label', 'Navegação da revisão de Gramática');
    document
      .getElementById('gramatica-progresso')
      .setAttribute('aria-label', 'Progresso da revisão de Gramática');
    separarVisualLab();
    if (lab) {
      if (conteudo) conteudo.replaceChildren();
      document.getElementById('gramatica-voltar').onclick = null;
      document.getElementById('gramatica-proxima').onclick = null;
    }
    revisaoAtiva = null;
    estado = null;
  }

  window.GramaticaQuestionarios = {
    registrar: registrar,
    registrarLab: registrarLab,
    adaptarContratoDitadoLab: adaptarContratoDitadoLab,
    criarValidadorSnapshotLab: criarValidadorSnapshotLab,
    capturarParaBackupLab: capturarParaBackupLab,
    conferirDisponibilidadeJournal: conferirDisponibilidadeJournal,
    inicializar: inicializar,
    abrir: abrir,
    limpar: limpar,
    obterEstado: obterEstado,
    obterSituacao: obterSituacao,
    obterAtiva: function () {
      return revisaoAtiva;
    },
    desativar: function () {
      ++geracaoAberturasLab;
      desativarVisual();
    },
    obterRevisao: function (id) {
      if (proprietariosLab[id]) return null;
      return revisoes[id] || null;
    },
  };
  // Mesmo motor e painel; o nome antigo permanece para todas as revisões legadas.
  window.QuestionariosRevisoes = window.GramaticaQuestionarios;
})();
