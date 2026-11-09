/* global globalThis, module, require */
(function (root) {
  'use strict';
  const commonJS = typeof module !== 'undefined' && module.exports;
  const identidade = commonJS ? require('./lab-identidade.js') : root.LabIdentidade;
  const repositorios = commonJS ? require('./lab-repositorio.js') : root.LabRepositorio;
  const validador = commonJS ? require('./lab-validador.js') : root.LabValidador;
  const progressoAPI = commonJS ? require('./lab-progresso.js') : root.LabProgresso;
  const sessoesEmitidas = new WeakMap();
  const reservasJournal = new WeakMap();
  const AVISO =
    'Conteúdo somente em memória: não sobreviverá ao encerramento. Backup e exportação não estão disponíveis.';
  const perfilValido = (v) => v === 'alice' || v === 'mariana';
  const chave = (v) => JSON.stringify([v.perfil, v.id, v.versao]);
  function idValido(v) {
    return (
      v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      Object.keys(v).sort().join(',') === 'id,perfil,versao' &&
      perfilValido(v.perfil) &&
      typeof v.id === 'string' &&
      /^[a-z][a-z0-9-]{0,63}$/.test(v.id) &&
      Number.isInteger(v.versao) &&
      v.versao >= 1 &&
      v.versao <= 9999
    );
  }
  function locksDisponiveis() {
    try {
      return typeof root.navigator?.locks?.request === 'function';
    } catch {
      return false;
    }
  }

  // A memória pertence ao motor, não ao ciclo de vida da sessão que lhe concedeu escrita.
  // Compartilhado nas execuções; exclusivo durante a intenção. Escopo conservador na origem,
  // sem copyId/digest, para abranger também memória temporária e conteúdo divergente.
  function reservarMemoria(atividade, modo, valido) {
    if (!locksDisponiveis())
      return Promise.resolve({ ok: false, codigo: 'WEB_LOCKS_INDISPONIVEIS' });
    const nome = 'revisoesEscolares.lab.memoria.v1.' + chave(atividade);
    return new Promise((resolve) => {
      let encerrada = false,
        adquirida = false,
        entregue = false,
        soltar;
      const retida = new Promise((r) => {
        soltar = r;
      });
      const terminar = (r) => {
        if (!entregue) {
          entregue = true;
          root.clearTimeout(timer);
          resolve(r);
        }
      };
      const liberar = () => {
        encerrada = true;
        soltar();
      };
      const timer = root.setTimeout(() => {
        liberar();
        terminar({ ok: false, codigo: 'MEMORIA_NAO_OBSERVAVEL' });
      }, 3000);
      try {
        const pedido = root.navigator.locks.request(
          nome,
          { mode: modo, ifAvailable: true },
          (lock) => {
            if (encerrada || !valido() || !lock) {
              liberar();
              terminar({ ok: false, codigo: 'MEMORIA_LAB_EM_USO' });
              return;
            }
            adquirida = true;
            terminar(Object.freeze({ ok: true, vigente: () => adquirida && !encerrada, liberar }));
            return retida;
          }
        );
        pedido.catch(() => {
          liberar();
          terminar({ ok: false, codigo: 'MEMORIA_NAO_OBSERVAVEL' });
        });
      } catch {
        liberar();
        terminar({ ok: false, codigo: 'MEMORIA_NAO_OBSERVAVEL' });
      }
    });
  }

  function criarSessao() {
    let estado = 'nova';
    let modo = null;
    let escopo = null;
    let repo = null;
    let geracao = 0;
    let pendente = false;
    let motivo = null;
    let disponibilidade = 'indefinida';
    let atividade = null;
    let reservaJournal = false;
    let ausenciaMemoria = null;
    let trava = null;
    let encerramento = null;
    let liberacao = null;
    const memoria = new Map();
    let progresso = null;
    const canaisAtivos = new Map();

    function obterSituacao() {
      return {
        estado,
        modo,
        copyId: escopo?.copyId || null,
        origem: escopo?.origem || null,
        motivo,
        disponibilidade,
        operacaoPendente: pendente,
        atividade: atividade ? { ...atividade } : null,
        pacotesTemporarios: memoria.size,
        aviso: modo === 'temporario' ? AVISO : null,
        backupDisponivel: false,
        exportacaoDisponivel: false,
      };
    }
    const falha = (codigo, extra = {}) => ({
      ok: false,
      codigo,
      ...extra,
      situacao: obterSituacao(),
    });
    const sucesso = (extra = {}) => ({ ok: true, ...extra, situacao: obterSituacao() });
    const atual = (token) =>
      geracao === token && !['encerrada', 'suspensa', 'recusada'].includes(estado);
    function iniciar() {
      if (!['pronta', 'ativa'].includes(estado)) return false;
      if (pendente) return false;
      pendente = true;
      return ++geracao;
    }
    async function soltarTrava() {
      if (ausenciaMemoria) {
        ausenciaMemoria.liberar();
        ausenciaMemoria = null;
      }
      canaisAtivos.clear();
      const anterior = trava;
      trava = null;
      if (anterior) {
        anterior.solta = true;
        // Revogar escrita imediatamente e preservar o mesmo lock nativo enquanto
        // o motor retém estado. Não esperar memória que só o motor pode liberar.
        if (anterior.memoria > 0) anterior.retirada = true;
        else {
          anterior.soltar();
          await anterior.pedido.catch(() => {});
        }
      }
      atividade = null;
      reservaJournal = false;
    }
    async function reservarMemoriaMotor(vinculo, posse) {
      const marca = await reservarMemoria(
        vinculo,
        'shared',
        () => estado === 'ativa' && atividade === vinculo
      );
      if (!marca.ok || modo === 'temporario') return marca;
      if (estado !== 'ativa' || atividade !== vinculo || trava !== posse || posse.solta) {
        marca.liberar();
        return falha('CANAL_INATIVO');
      }
      posse.memoria = (posse.memoria || 0) + 1;
      // A sondagem compartilhada impede abertura durante journal exclusivo. O lock
      // da própria atividade passa a proteger a memória, sem segundo lock retido.
      marca.liberar();
      let liberada = false;
      return Object.freeze({
        ok: true,
        vigente: () => !liberada,
        liberar: () => {
          if (liberada) return;
          liberada = true;
          if (--posse.memoria === 0 && posse.retirada) posse.soltar();
        },
      });
    }
    async function suspender(codigo) {
      ++geracao;
      estado = 'suspensa';
      pendente = false;
      motivo = codigo;
      disponibilidade = 'indisponivel';
      if (repo) {
        repo.fechar();
        repo = null;
      }
      await soltarTrava();
    }
    async function conferir(token) {
      if (!atual(token)) return false;
      if (modo === 'temporario') return true;
      if (!locksDisponiveis()) {
        await suspender('WEB_LOCKS_INDISPONIVEIS');
        return false;
      }
      const agora = await identidade.resolverIdentidade(escopo.copyId);
      if (!atual(token)) return false;
      if (agora.modo !== 'persistente' || agora.origem !== escopo.origem) {
        await suspender(
          agora.codigo === 'IDENTIDADE_ALTERADA' || (agora.origem && agora.origem !== escopo.origem)
            ? 'IDENTIDADE_ALTERADA'
            : 'IDENTIDADE_INDISPONIVEL'
        );
        return false;
      }
      return true;
    }
    function oferecerTemporario(codigo) {
      estado = 'aguarda-consentimento';
      pendente = false;
      motivo = codigo;
      disponibilidade = 'indisponivel';
      return falha('CONSENTIMENTO_NECESSARIO', { aviso: AVISO });
    }
    async function prepararRepositorio(existente) {
      if (estado !== 'nova') return falha('ESTADO_INCOMPATIVEL');
      estado = 'preparando';
      pendente = true;
      const token = ++geracao;
      try {
        const copia = await identidade.resolverIdentidade();
        if (!atual(token)) return falha('OPERACAO_OBSOLETA');
        if (copia.modo !== 'persistente') return oferecerTemporario(copia.codigo);
        if (!locksDisponiveis()) return oferecerTemporario('WEB_LOCKS_INDISPONIVEIS');
        const banco = await (existente
          ? repositorios.abrirRepositorioExistente()
          : repositorios.abrirRepositorio());
        if (!atual(token)) {
          if (banco.ok) banco.repositorio.fechar();
          return falha('OPERACAO_OBSOLETA');
        }
        if (!banco.ok) return oferecerTemporario(banco.codigo);
        if (banco.copyId !== copia.copyId || banco.origem !== copia.origem) {
          banco.repositorio.fechar();
          await suspender('IDENTIDADE_ALTERADA');
          return falha('IDENTIDADE_ALTERADA');
        }
        repo = banco.repositorio;
        escopo = { copyId: banco.copyId, origem: banco.origem };
        modo = 'persistente';
        if (!(await conferir(token)) || !atual(token)) return falha(motivo || 'OPERACAO_OBSOLETA');
        estado = 'pronta';
        disponibilidade = 'disponivel';
        pendente = false;
        return sucesso();
      } catch {
        if (!atual(token)) return falha('OPERACAO_OBSOLETA');
        if (modo === 'persistente') {
          await suspender('PREPARACAO_FALHOU');
          return falha(motivo);
        }
        return oferecerTemporario('PREPARACAO_FALHOU');
      }
    }
    function decidirTemporario(aceitar) {
      if (estado !== 'aguarda-consentimento') return falha('ESTADO_INCOMPATIVEL');
      if (typeof aceitar !== 'boolean') return falha('DECISAO_INVALIDA');
      if (!aceitar) {
        estado = 'recusada';
        disponibilidade = 'indisponivel';
        return falha('CONSENTIMENTO_RECUSADO');
      }
      modo = 'temporario';
      estado = 'pronta';
      escopo = null;
      disponibilidade = 'somente-memoria';
      motivo = null;
      return sucesso();
    }
    async function preparar() {
      return prepararRepositorio(false);
    }
    async function prepararExistente() {
      if (arguments.length) return falha('ARGUMENTOS_INVALIDOS');
      return prepararRepositorio(true);
    }
    async function executar(acao) {
      const token = iniciar();
      if (!token) return falha(pendente ? 'OPERACAO_EM_ANDAMENTO' : 'ESTADO_INCOMPATIVEL');
      let resultado;
      try {
        if (!(await conferir(token)) || !atual(token))
          resultado = falha(motivo || 'OPERACAO_OBSOLETA');
        else {
          resultado = await acao(token);
          if (!atual(token)) resultado = falha(motivo || 'OPERACAO_OBSOLETA');
        }
      } catch {
        if (atual(token)) await suspender('OPERACAO_FALHOU');
        resultado = falha(motivo || 'OPERACAO_OBSOLETA');
      } finally {
        if (geracao === token) pendente = false;
      }
      return { ...resultado, situacao: obterSituacao() };
    }
    async function carregarTemporario(entrada) {
      if (modo !== 'temporario') return falha('MODO_INCOMPATIVEL');
      return executar(async (token) => {
        const validacao = await validador.validarPacote(entrada);
        if (!atual(token)) return falha('OPERACAO_OBSOLETA');
        if (!validacao.valido) return falha('PACOTE_INVALIDO', { erros: validacao.erros });
        const p = validacao.pacoteNormalizado;
        if (p.formato !== 'lab-questionarios-v1') return falha('PACOTE_INVALIDO');
        const k = chave(p);
        const anterior = memoria.get(k);
        if (anterior && anterior.digest !== validacao.digest) return falha('CONFLITO_DIGEST');
        memoria.set(k, { canonico: validacao.canonico, digest: validacao.digest });
        return sucesso({ criado: !anterior, digest: validacao.digest });
      });
    }
    function pacoteMemoria(id) {
      const registro = memoria.get(chave(id));
      return registro
        ? { ok: true, pacote: JSON.parse(registro.canonico), digest: registro.digest }
        : { ok: true, pacote: null };
    }
    async function ler(id, token) {
      if (modo === 'temporario') return pacoteMemoria(id);
      const resultado = await repo.consultar(id);
      if (!atual(token)) return falha('OPERACAO_OBSOLETA');
      if (!resultado.ok) {
        await suspender(resultado.codigo);
        return falha(resultado.codigo);
      }
      return resultado;
    }
    async function consultar(id) {
      if (!idValido(id)) return falha('IDENTIFICADOR_INVALIDO');
      // Copiar identidade antes do primeiro await, sem conservar objeto mutável do chamador.
      const alvo = { perfil: id.perfil, id: id.id, versao: id.versao };
      return executar((token) => ler(alvo, token));
    }
    async function listar(perfil) {
      if (!perfilValido(perfil)) return falha('PERFIL_INVALIDO');
      return executar(async (token) => {
        if (modo === 'temporario')
          return {
            ok: true,
            pacotes: [...memoria.values()]
              .map((r) => ({ pacote: JSON.parse(r.canonico), digest: r.digest }))
              .filter((r) => r.pacote.perfil === perfil),
          };
        const resultado = await repo.listar(perfil);
        if (!atual(token)) return falha('OPERACAO_OBSOLETA');
        if (!resultado.ok) {
          await suspender(resultado.codigo);
          return falha(resultado.codigo);
        }
        return resultado;
      });
    }
    async function pedirLock(nome, token) {
      return new Promise((resolve) => {
        let terminado = false;
        const terminar = (resultado) => {
          if (terminado) return;
          terminado = true;
          root.clearTimeout(timer);
          resolve(resultado);
        };
        const timer = root.setTimeout(() => terminar({ ok: false, codigo: 'LOCK_TIMEOUT' }), 3000);
        try {
          const pedido = root.navigator.locks.request(
            nome,
            { mode: 'exclusive', ifAvailable: true },
            (lock) => {
              if (terminado || !atual(token)) {
                terminar({ ok: false, codigo: 'OPERACAO_OBSOLETA' });
                return;
              }
              if (!lock) {
                terminar({ ok: false, codigo: 'ATIVIDADE_OCUPADA' });
                return;
              }
              let soltar;
              const espera = new Promise((r) => {
                soltar = r;
              });
              trava = { soltar, solta: false, pedido: null, nome };
              const adquirida = trava;
              // callback nativo é assíncrono; atribuir pedido antes de liberar o lock.
              root.queueMicrotask(() => {
                adquirida.pedido = pedido;
                terminar({ ok: true });
              });
              return espera;
            }
          );
          pedido.catch(() => {
            terminar({ ok: false, codigo: 'LOCK_FALHOU' });
            if (trava?.pedido === pedido && !trava.solta && estado !== 'encerrada')
              void suspender('LOCK_PERDIDO');
          });
        } catch {
          terminar({ ok: false, codigo: 'LOCK_FALHOU' });
        }
      });
    }
    async function adquirir(id) {
      if (!idValido(id)) return falha('IDENTIFICADOR_INVALIDO');
      if (estado === 'ativa') return falha('ATIVIDADE_JA_ABERTA');
      const alvo = { perfil: id.perfil, id: id.id, versao: id.versao };
      return executar(async (token) => {
        estado = 'adquirindo';
        const resultado = await ler(alvo, token);
        if (!atual(token)) return falha(motivo || 'OPERACAO_OBSOLETA');
        if (!resultado.ok || !resultado.pacote) {
          estado = 'pronta';
          return falha(resultado.codigo || 'PACOTE_AUSENTE');
        }
        return ativarPacote(resultado, token, false);
      });
    }
    async function conferirJournalExecucao(alvo) {
      if (modo !== 'persistente') return { ok: true };
      const journal = commonJS ? require('./lab-journal.js') : root.LabJournal;
      if (!journal) {
        const lista = await repo.listarOperacoesJournal();
        return lista.ok && !lista.limiteExcedido && !lista.referencias.length
          ? { ok: true }
          : falha('JOURNAL_NAO_INSPECIONAVEL');
      }
      const j = await journal.inspecionarPendencias();
      return j.ok &&
        !j.bloqueioGlobalLab &&
        !j.atividadesBloqueadas.some(
          (a) => a.perfil === alvo.perfil && a.id === alvo.id && a.versao === alvo.versao
        )
        ? { ok: true }
        : falha('JOURNAL_PENDENTE_NA_ATIVIDADE');
    }
    async function ativarPacote(resultado, token, paraJournal) {
      const p = resultado.pacote;
      const completa = {
        perfil: p.perfil,
        materia: p.materia,
        id: p.id,
        versao: p.versao,
        digest: resultado.digest,
      };
      if (modo === 'persistente') {
        const nome =
          'revisoesEscolares.lab.sessao.v1.' +
          JSON.stringify([escopo.copyId, p.perfil, p.materia, p.id, p.versao, resultado.digest]);
        const lock = await pedirLock(nome, token);
        if (!atual(token)) return falha(motivo || 'OPERACAO_OBSOLETA');
        if (!lock.ok) {
          estado = 'pronta';
          motivo = lock.codigo;
          disponibilidade = lock.codigo === 'ATIVIDADE_OCUPADA' ? 'ocupada' : 'indisponivel';
          return falha(lock.codigo);
        }
        if (!(await conferir(token))) return falha(motivo || 'OPERACAO_OBSOLETA');
        if (!paraJournal) {
          const j = await conferirJournalExecucao(completa);
          if (!atual(token)) return falha('OPERACAO_OBSOLETA');
          if (!j.ok) {
            await soltarTrava();
            estado = 'pronta';
            return j;
          }
        }
      }
      if (!atual(token)) return falha('OPERACAO_OBSOLETA');
      atividade = completa;
      reservaJournal = paraJournal;
      estado = 'ativa';
      motivo = null;
      disponibilidade = modo === 'persistente' ? 'exclusiva' : 'somente-memoria';
      return sucesso({ pacote: p, digest: resultado.digest });
    }
    async function adquirirIntencao(entradaPacote) {
      if (arguments.length !== 1 || modo !== 'persistente' || estado !== 'pronta')
        return falha('ESTADO_INCOMPATIVEL');
      return executar(async (token) => {
        const v = await validador.validarPacote(entradaPacote);
        if (!atual(token)) return falha('OPERACAO_OBSOLETA');
        if (!v.valido) return falha('PACOTE_INVALIDO');
        estado = 'adquirindo';
        const ativada = await ativarPacote(
          { pacote: v.pacoteNormalizado, digest: v.digest },
          token,
          true
        );
        if (!ativada.ok) return ativada;
        const memoria = await reservarMemoria(v.pacoteNormalizado, 'exclusive', () => atual(token));
        if (!atual(token) || !memoria.ok) {
          if (memoria.ok) memoria.liberar();
          await soltarTrava();
          if (atual(token)) estado = 'pronta';
          return falha(memoria.codigo || 'OPERACAO_OBSOLETA');
        }
        ausenciaMemoria = memoria;
        return ativada;
      });
    }
    function revalidar() {
      return executar(async () => sucesso());
    }
    function autorizarProgresso(vinculo, posse, acao) {
      return executar(async (token) => {
        if (estado !== 'ativa' || atividade !== vinculo) return falha('CANAL_INATIVO');
        if (modo === 'persistente') {
          if (
            !posse ||
            trava !== posse ||
            posse.solta ||
            typeof root.navigator?.locks?.query !== 'function'
          ) {
            await suspender('EXCLUSIVIDADE_PERDIDA');
            return falha(motivo);
          }
          let consulta;
          try {
            consulta = await root.navigator.locks.query();
          } catch {
            if (!atual(token)) return falha(motivo || 'OPERACAO_OBSOLETA');
            await suspender('EXCLUSIVIDADE_NAO_CONFIRMADA');
            return falha(motivo);
          }
          if (!atual(token)) return falha(motivo || 'OPERACAO_OBSOLETA');
          if (
            trava !== posse ||
            posse.solta ||
            !consulta.held.some((lock) => lock.name === posse.nome && lock.mode === 'exclusive')
          ) {
            await suspender('EXCLUSIVIDADE_PERDIDA');
            return falha(motivo);
          }
          if (reservaJournal) {
            const prefixo = 'revisoesEscolares.lab.sessao.v1.';
            const conflitos = consulta.held.concat(consulta.pending).some((lock) => {
              if (lock.name === posse.nome || !lock.name.startsWith(prefixo)) return false;
              try {
                const d = JSON.parse(lock.name.slice(prefixo.length));
                return (
                  d[0] === escopo.copyId &&
                  d[1] === vinculo.perfil &&
                  d[3] === vinculo.id &&
                  d[4] === vinculo.versao
                );
              } catch {
                return true;
              }
            });
            if (conflitos) return falha('ATIVIDADE_OCUPADA');
          }
        }
        if (!atual(token) || estado !== 'ativa' || atividade !== vinculo)
          return falha('CANAL_INATIVO');
        // Callback síncrono: a permissão não escapa para uma gravação posterior.
        return acao();
      });
    }
    function abrirProgresso(sessao) {
      if (reservaJournal) return falha('FINALIDADE_JOURNAL_SEM_CANAL_DE_PROGRESSO');
      if (!['principal', 'responsavel'].includes(sessao))
        return { ok: false, codigo: 'SESSAO_INVALIDA' };
      if (estado !== 'ativa' || pendente) return falha('ESTADO_INCOMPATIVEL');
      if (!progressoAPI) return falha('PROGRESSO_INDISPONIVEL');
      if (canaisAtivos.has(sessao)) return { ok: true, canal: canaisAtivos.get(sessao) };
      const vinculo = atividade;
      const posse = trava;
      if (!progresso) progresso = progressoAPI.criarArmazenamento();
      const aberto = progresso.abrir({
        modo,
        sessao,
        identidade: { copyId: escopo?.copyId || null, ...vinculo },
        vigente: () =>
          estado === 'ativa' &&
          atividade === vinculo &&
          (modo === 'temporario' || (trava === posse && !posse?.solta)),
        autorizar: (acao) => autorizarProgresso(vinculo, posse, acao),
      });
      if (aberto.ok) canaisAtivos.set(sessao, aberto.canal);
      return aberto;
    }
    function liberar() {
      if (liberacao) return liberacao;
      if (!['pronta', 'ativa', 'adquirindo'].includes(estado))
        return Promise.resolve(falha('ESTADO_INCOMPATIVEL'));
      ++geracao;
      pendente = true;
      liberacao = (async () => {
        await soltarTrava();
        if (estado === 'encerrada' || estado === 'suspensa') return falha('OPERACAO_OBSOLETA');
        estado = 'pronta';
        pendente = false;
        motivo = null;
        disponibilidade = modo === 'persistente' ? 'disponivel' : 'somente-memoria';
        return sucesso();
      })().finally(() => {
        liberacao = null;
      });
      return liberacao;
    }
    function encerrar() {
      if (encerramento) return encerramento;
      ++geracao;
      estado = 'encerrada';
      pendente = false;
      disponibilidade = 'indisponivel';
      memoria.clear();
      if (progresso) {
        progresso.encerrar();
        progresso = null;
      }
      if (repo) {
        repo.fechar();
        repo = null;
      }
      if (typeof root.removeEventListener === 'function')
        root.removeEventListener('pagehide', aoSair);
      encerramento = soltarTrava().then(() => sucesso());
      return encerramento;
    }
    function aoSair() {
      void encerrar();
    }
    if (typeof root.addEventListener === 'function') root.addEventListener('pagehide', aoSair);
    const handle = Object.freeze({
      preparar,
      prepararExistente,
      decidirTemporario,
      obterSituacao,
      revalidar,
      abrirProgresso,
      carregarTemporario,
      consultar,
      listar,
      adquirir,
      adquirirIntencao,
      liberar,
      encerrar,
    });
    sessoesEmitidas.set(handle, async (sessao) => {
      if (!['principal', 'responsavel'].includes(sessao)) return falha('SESSAO_INVALIDA');
      if (estado !== 'ativa' || pendente || reservaJournal) return falha('ESTADO_INCOMPATIVEL');
      const vinculo = atividade;
      const posse = trava;
      const journal = await conferirJournalExecucao(vinculo);
      if (!journal.ok) return journal;
      const leitura = await consultar({
        perfil: vinculo.perfil,
        id: vinculo.id,
        versao: vinculo.versao,
      });
      if (!leitura.ok) return leitura;
      if (estado !== 'ativa' || atividade !== vinculo) return falha('OPERACAO_OBSOLETA');
      const principal = abrirProgresso('principal');
      const selecionado = abrirProgresso(sessao);
      if (!principal.ok || !selecionado.ok) return falha('PROGRESSO_INDISPONIVEL');
      return {
        ok: true,
        modo,
        pacote: leitura.pacote,
        identidade: Object.freeze({ ...vinculo, sessao }),
        canal: selecionado.canal,
        chavePrincipal: principal.canal.chave,
        reservarMemoria: () => reservarMemoriaMotor(vinculo, posse),
        vigente: () =>
          estado === 'ativa' &&
          atividade === vinculo &&
          (modo === 'temporario' || (trava === posse && !posse?.solta)),
        revalidar: () => autorizarProgresso(vinculo, posse, () => ({ ok: true })),
        liberar: () =>
          atividade === vinculo ? liberar() : Promise.resolve(falha('CANAL_INATIVO')),
      };
    });
    reservasJournal.set(handle, () => {
      if (
        !reservaJournal ||
        modo !== 'persistente' ||
        estado !== 'ativa' ||
        pendente ||
        !atividade ||
        !trava ||
        trava.solta
      )
        return falha('RESERVA_JOURNAL_INATIVA');
      const vinculo = atividade,
        posse = trava;
      const vigente = () =>
        reservaJournal &&
        ausenciaMemoria?.vigente() &&
        estado === 'ativa' &&
        atividade === vinculo &&
        trava === posse &&
        !posse.solta;
      return Object.freeze({
        ok: true,
        identidade: Object.freeze({ copyId: escopo.copyId, origem: escopo.origem, ...vinculo }),
        vigente,
        revalidar: () => autorizarProgresso(vinculo, posse, () => ({ ok: true })),
        autorizar: (acao) => autorizarProgresso(vinculo, posse, acao),
      });
    });
    return handle;
  }
  function conectarMotor(sessaoLab, sessaoProgresso) {
    const conectar = sessoesEmitidas.get(sessaoLab);
    return conectar
      ? conectar(sessaoProgresso)
      : Promise.resolve({ ok: false, codigo: 'SESSAO_LAB_INVALIDA' });
  }
  function conectarJournal(sessao) {
    const conectar = reservasJournal.get(sessao);
    return conectar ? conectar() : { ok: false, codigo: 'SESSAO_LAB_INVALIDA' };
  }
  const api = Object.freeze({ criarSessao, conectarMotor, conectarJournal });
  if (commonJS) module.exports = api;
  else root.LabCoordenador = api;
})(typeof window === 'undefined' ? globalThis : window);
