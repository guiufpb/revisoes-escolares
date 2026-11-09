(function (root) {
  'use strict';
  let controlador,
    atual = null,
    navegacao = null;
  const el = (id) => root.document.getElementById(id);
  const nomes = {
    ciencias: 'Ciências',
    gramatica: 'Gramática',
    matematica: 'Matemática',
    historia: 'História',
    geografia: 'Geografia',
    ingles: 'Inglês',
    leitura: 'Leitura',
  };
  const ocupada = () => !!atual;
  function mensagem(codigo) {
    if (codigo === 'ATIVIDADE_OCUPADA')
      return 'Esta atividade está aberta em outra aba. Volte a essa aba ou aguarde sua saída segura.';
    if (codigo === 'DADOS_PERSISTIDOS_INVALIDOS')
      return 'O progresso salvo não pôde ser validado. Peça ao responsável para verificar. Nada foi reparado.';
    return 'Não foi possível abrir esta atividade com segurança. Confira a cópia, o perfil, o armazenamento e as pendências com o responsável.';
  }
  function bloquear(valor) {
    el('gramatica-conteudo').inert = valor;
    el('lab-execucao-acoes').setAttribute('aria-busy', String(valor));
    el('lab-execucao-persistir').disabled = valor;
    el('lab-execucao-voltar').disabled = valor;
    el('lab-execucao-sessao').disabled = valor;
    el('lab-execucao-recuperar').disabled = valor;
    if (valor) {
      el('gramatica-voltar').disabled = true;
      el('gramatica-proxima').disabled = true;
    }
  }
  function apresentar(c, m) {
    if (atual !== c || !c.aberta || c.fechando || c.recuperacao) return;
    c.meta = m;
    let texto;
    if (m.pendente) texto = 'Salvando suas respostas…';
    else if (m.naoDuravel)
      texto =
        m.codigo === 'CONFLITO_PERSISTIDO'
          ? 'Há conflito com o progresso salvo. Suas respostas continuam nesta tela. Fechar ou recarregar pode perder alterações. Peça ajuda ao responsável.'
          : 'Não foi possível salvar. Suas respostas ainda estão nesta tela. Fechar ou recarregar o navegador pode perder alterações. Tente salvar novamente.';
    else
      texto =
        m.durabilidade === 'ausente'
          ? 'Atividade pronta. Suas respostas serão salvas neste navegador.'
          : 'Respostas salvas neste navegador. Isso não garante proteção contra toda perda futura de dados.';
    if (m.durabilidade === 'suspenso' || m.durabilidade === 'encerrado')
      texto = 'Atividade suspensa. A cópia ou a exclusividade precisa ser verificada. ' + texto;
    if (el('lab-execucao-status').textContent !== texto)
      el('lab-execucao-status').textContent = texto;
    el('lab-execucao-persistir').hidden = !m.naoDuravel || m.pendente;
  }
  async function limparAbertura(c) {
    if (c.handle) {
      const r = await c.handle.liberar();
      if (!r.ok) return false;
    }
    if (c.coordenador) await c.coordenador.encerrar();
    return true;
  }
  function vigente(c) {
    return atual === c && !c.cancelada && controlador.perfilAtual() === c.id.perfil;
  }
  async function abrir(id, base) {
    if (atual) {
      if (!atual.aberta) return;
      navegar(() => abrir(id, base));
      return;
    }
    if (!controlador || !id || !base) return;
    if (controlador.perfilAtual() !== id.perfil) {
      el('lab-status').textContent =
        'Esta atividade pertence a outro perfil. Selecione o perfil correto antes de abrir.';
      return;
    }
    const c = {
      id: { perfil: id.perfil, id: id.id, versao: id.versao },
      base: { copyId: base.copyId, origem: base.origem, digest: base.digest },
      scroll: root.scrollY,
      aberta: false,
      cancelada: false,
      fechando: false,
      handle: null,
      coordenador: null,
      meta: null,
      sessao: 'principal',
      desktopAmplo: el('lab-desktop-amplo').checked,
      recuperacao: false,
      transicao: null,
    };
    atual = c;
    el('lab-status').textContent = 'Preparando a atividade…';
    c.abertura = (async () => {
      let repo;
      try {
        if (!root.LabCoordenador || !root.LabProgresso || !root.QuestionariosRevisoes)
          throw new Error('MODULO_INDISPONIVEL');
        const copia = await root.LabIdentidade.resolverIdentidade(c.base.copyId);
        if (!vigente(c)) return;
        if (copia.modo !== 'persistente' || copia.origem !== c.base.origem)
          throw new Error('IDENTIDADE_ALTERADA');
        const banco = await root.LabRepositorio.abrirRepositorioExistente();
        repo = banco.repositorio;
        if (!vigente(c)) return;
        if (!banco.ok || banco.copyId !== c.base.copyId || banco.origem !== c.base.origem)
          throw new Error('BANCO_INDISPONIVEL');
        const p = await repo.consultar(c.id);
        if (!vigente(c)) return;
        if (
          !p.ok ||
          !p.pacote ||
          p.digest !== c.base.digest ||
          p.administracao.situacao !== 'ativa'
        )
          throw new Error('PACOTE_INVALIDO');
        const v = await root.LabValidador.validarPacote(JSON.stringify(p.pacote));
        if (!vigente(c)) return;
        if (!v.valido || v.digest !== c.base.digest || v.pacoteNormalizado.perfil !== c.id.perfil)
          throw new Error('PACOTE_INVALIDO');
        const j = await root.LabJournal.inspecionarPendenciasExistentes();
        if (!vigente(c)) return;
        if (
          !j.ok ||
          j.destino.copyId !== c.base.copyId ||
          j.destino.origem !== c.base.origem ||
          j.bloqueioGlobalLab ||
          j.atividadesBloqueadas.some(
            (a) => a.perfil === c.id.perfil && a.id === c.id.id && a.versao === c.id.versao
          )
        )
          throw new Error('JOURNAL_BLOQUEADO');
        c.coordenador = root.LabCoordenador.criarSessao();
        const preparada = await c.coordenador.prepararExistente();
        if (!vigente(c)) return;
        const situacao = c.coordenador.obterSituacao();
        if (
          !preparada.ok ||
          situacao.modo !== 'persistente' ||
          situacao.copyId !== c.base.copyId ||
          situacao.origem !== c.base.origem
        )
          throw new Error('IDENTIDADE_ALTERADA');
        const adquirida = await c.coordenador.adquirir(c.id);
        if (!vigente(c)) return;
        if (!adquirida.ok) throw new Error(adquirida.codigo);
        if (adquirida.digest !== c.base.digest) throw new Error('PACOTE_ALTERADO');
        const canal = c.coordenador.abrirProgresso('principal');
        if (!canal.ok) throw new Error(canal.codigo);
        const leitura = await canal.canal.carregar();
        if (!vigente(c)) return;
        if (!leitura.ok) throw new Error(leitura.codigo);
        if (leitura.estado !== null && leitura.estado !== undefined) {
          const analisador = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(v.canonico);
          if (!vigente(c)) return;
          if (!analisador.ok || !analisador.validarSnapshot('principal', leitura.estado).ok)
            throw new Error('DADOS_PERSISTIDOS_INVALIDOS');
        }
        c.canonico = v.canonico;
        const pacote = v.pacoteNormalizado;
        const pedagogia =
          pacote.formato === 'lab-questionarios-v2'
            ? await root.QuestionariosRevisoes.adaptarContratoDitadoLab(v.canonico)
            : { ok: true, titulo: pacote.titulo, questoes: pacote.questoes };
        if (!vigente(c)) return;
        if (!pedagogia.ok) throw new Error('PACOTE_INVALIDO');
        const registro = root.QuestionariosRevisoes.registrarLab(() => ({
          id: 'lab-ui-' + root.crypto.randomUUID(),
          chave: null,
          aluno: c.id.perfil,
          nome: c.id.perfil === 'alice' ? 'Alice' : 'Mariana',
          materia: nomes[pacote.materia],
          titulo: pedagogia.titulo,
          questoes: pedagogia.questoes,
          ...(c.desktopAmplo ? { layout: { desktopAmplo: true } } : {}),
        }));
        if (!registro.ok) throw new Error(registro.codigo);
        c.handle = registro.handle;
        const aberta = await c.handle.abrir(c.coordenador, c.sessao);
        if (!vigente(c)) return;
        if (!aberta.ok) throw new Error(aberta.codigo);
        c.aberta = true;
        el('lab-execucao-titulo').textContent = root.LabValidador.apresentarPacote(
          pacote,
          v.digest
        ).titulo;
        el('lab-execucao-layout').textContent = c.desktopAmplo
          ? 'Modo Desktop Amplo selecionado — no celular, a apresentação se adapta à tela.'
          : 'Apresentação normal';
        el('lab-execucao-acoes').hidden = false;
        identificar(c);
        bloquear(false);
        c.desobservar = c.handle.observarDurabilidade((m) => apresentar(c, m));
        controlador.mostrarExecucao();
      } catch (erro) {
        if (vigente(c)) el('lab-status').textContent = mensagem(erro.message);
      } finally {
        repo?.fechar();
        if (!c.aberta) {
          await limparAbertura(c);
          if (atual === c) atual = null;
        } else if (c.cancelada) {
          const segura = await limparAbertura(c);
          if (segura && atual === c) atual = null;
        }
      }
    })();
    await c.abertura;
  }
  function navegar(acao) {
    const c = atual;
    if (!c) return false;
    if (c.transicao || c.recuperacao) {
      el('lab-execucao-status').textContent = c.recuperacao
        ? 'Recupere a sessão de origem antes de sair. A navegação foi bloqueada.'
        : 'Aguarde a troca de sessão e acione a navegação novamente.';
      return true;
    }
    el('lab-execucao-confirmacao').close();
    if (navegacao) return true;
    c.cancelada = !c.aberta;
    c.fechando = true;
    if (c.aberta) bloquear(true);
    navegacao = (async () => {
      await c.abertura;
      if (c.persistencia) await c.persistencia;
      if (c.aberta && atual === c) {
        el('lab-execucao-status').textContent = 'Aguardando o salvamento para sair…';
        const r = await c.handle.liberar();
        if (!r.ok) {
          c.fechando = false;
          bloquear(false);
          // Reabrir o MESMO handle só restaura navegação/render guards, sem substituir a memória.
          await c.handle.abrir(c.coordenador, c.sessao);
          const progresso = c.handle.consultar().progresso;
          apresentar(c, {
            ...progresso.durabilidade,
            pendente: progresso.pendente,
            naoDuravel: true,
          });
          el('lab-execucao-status').textContent +=
            ' A saída foi bloqueada para preservar suas respostas.';
          el('lab-execucao-persistir').focus({ preventScroll: true });
          return;
        }
        c.desobservar?.();
        await c.coordenador.encerrar();
        atual = null;
      }
      if (!atual) {
        el('gramatica-conteudo').inert = false;
        el('lab-execucao-acoes').hidden = true;
        await acao();
      }
    })().finally(() => {
      navegacao = null;
    });
    return true;
  }
  function voltar() {
    const c = atual;
    if (c) navegar(() => controlador.retornarLab(c.id, c.scroll));
  }
  async function persistir() {
    const c = atual;
    if (!c?.aberta || c.fechando || c.persistencia || c.transicao || c.recuperacao || navegacao)
      return;
    c.fechando = true;
    bloquear(true);
    el('lab-execucao-status').textContent = 'Tentando salvar suas respostas…';
    c.persistencia = (async () => {
      try {
        await c.handle.persistir();
      } finally {
        if (atual === c) {
          c.fechando = false;
          bloquear(false);
          await c.handle.abrir(c.coordenador, c.sessao);
          const p = c.handle.consultar().progresso;
          apresentar(c, { ...p.durabilidade, pendente: p.pendente, naoDuravel: p.naoDuravel });
        }
      }
    })();
    try {
      await c.persistencia;
    } finally {
      c.persistencia = null;
    }
  }
  function identificar(c) {
    const responsavel = c.sessao === 'responsavel';
    el('lab-execucao-sessao').textContent = responsavel
      ? 'Voltar à sessão da criança'
      : 'Modo Responsável';
    el('lab-execucao-identificacao').textContent = responsavel
      ? 'Sessão do Responsável — Progresso separado'
      : 'Sessão da criança';
    el('lab-execucao-recuperar').hidden = !c.recuperacao;
  }
  async function validarDestino(c, sessao) {
    const valida = await c.coordenador.revalidar();
    if (!vigente(c) || !valida.ok) throw new Error('IDENTIDADE_ALTERADA');
    const canal = c.coordenador.abrirProgresso(sessao);
    if (!canal.ok) throw new Error(canal.codigo);
    const leitura = await canal.canal.carregar();
    if (!vigente(c) || !leitura.ok) throw new Error(leitura.codigo);
    const analisador = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(c.canonico);
    if (
      !vigente(c) ||
      !analisador.ok ||
      (leitura.estado != null && !analisador.validarSnapshot(sessao, leitura.estado).ok)
    )
      throw new Error('DADOS_PERSISTIDOS_INVALIDOS');
  }
  function solicitarSessao() {
    const c = atual;
    if (!c?.aberta || c.fechando || c.transicao || c.persistencia || c.recuperacao || navegacao)
      return;
    if (c.sessao === 'responsavel') void alternar('principal');
    else el('lab-execucao-confirmacao').showModal();
  }
  async function alternar(destino, recuperar = false) {
    const c = atual;
    if (
      !c?.aberta ||
      c.fechando ||
      c.transicao ||
      c.persistencia ||
      navegacao ||
      (c.recuperacao && !recuperar)
    )
      return;
    c.fechando = true;
    bloquear(true);
    el('lab-execucao-status').textContent = 'Aguardando o salvamento para trocar de sessão…';
    c.transicao = (async () => {
      try {
        if (!c.recuperacao) {
          // desativar drena inclusive a coalescência e mantém aquisição/canais.
          const desativada = await c.handle.desativar();
          if (!desativada.ok) {
            await c.handle.abrir(c.coordenador, c.sessao);
            const p = c.handle.consultar().progresso;
            c.fechando = false;
            apresentar(c, { ...p.durabilidade, pendente: p.pendente, naoDuravel: true });
            el('lab-execucao-status').textContent +=
              ' A troca foi bloqueada para preservar suas respostas.';
            return;
          }
          c.recuperacao = true;
        }
        await validarDestino(c, destino);
        const aberta = await c.handle.abrir(c.coordenador, destino);
        if (!vigente(c) || !aberta.ok) throw new Error(aberta.codigo);
        c.sessao = destino;
        c.recuperacao = false;
        el('lab-execucao-status').textContent = recuperar
          ? 'Sessão de origem recuperada. Confira suas respostas.'
          : 'Troca concluída. ' +
            (destino === 'responsavel'
              ? 'Sessão do Responsável — Progresso separado.'
              : 'Sessão da criança.');
        el('lab-execucao-persistir').hidden = true;
      } catch (erro) {
        el('lab-execucao-status').textContent =
          mensagem(erro.message) +
          ' A troca não foi concluída. Tente recuperar a sessão de origem; a recuperação depende da cópia e da exclusividade válidas.';
      } finally {
        if (atual === c) {
          c.fechando = false;
          identificar(c);
          bloquear(c.recuperacao);
          // Estado sem execução: só recuperação explícita fica disponível.
          el('lab-execucao-recuperar').disabled = false;
          el(c.recuperacao ? 'lab-execucao-recuperar' : 'lab-execucao-sessao').focus({
            preventScroll: true,
          });
        }
      }
    })();
    try {
      await c.transicao;
    } finally {
      c.transicao = null;
    }
  }
  function inicializar(configuracao) {
    if (controlador) return;
    controlador = configuracao;
    el('lab-execucao-sessao').addEventListener('click', solicitarSessao);
    el('lab-execucao-cancelar').addEventListener('click', () =>
      el('lab-execucao-confirmacao').close()
    );
    el('lab-execucao-confirmar').addEventListener('click', () => {
      if (!el('lab-execucao-confirmacao').open) return;
      el('lab-execucao-confirmacao').close();
      void alternar('responsavel');
    });
    el('lab-execucao-confirmacao').addEventListener('close', () => {
      if (atual?.aberta && !atual.fechando)
        el('lab-execucao-sessao').focus({ preventScroll: true });
    });
    el('lab-execucao-recuperar').addEventListener('click', () => {
      if (atual?.recuperacao) void alternar(atual.sessao, true);
    });
    el('lab-execucao-voltar').addEventListener('click', voltar);
    el('lab-execucao-persistir').addEventListener('click', persistir);
    root.addEventListener('beforeunload', (evento) => {
      const p = atual?.handle?.consultar().progresso;
      if (p && (p.pendente || p.naoDuravel)) {
        evento.preventDefault();
        evento.returnValue = '';
      }
    });
    root.document.addEventListener(
      'click',
      (evento) => {
        if (!ocupada() || !evento.target.closest) return;
        const alvo = evento.target.closest(
          '#botao-inicio, [data-aluno], [data-voltar-materias], #grade-materias button'
        );
        if (!alvo) return;
        evento.preventDefault();
        evento.stopImmediatePropagation();
        navegar(() => alvo.click());
      },
      true
    );
  }
  root.LabExecucao = Object.freeze({ inicializar, abrir, navegar, ocupada, voltar });
})(window);
