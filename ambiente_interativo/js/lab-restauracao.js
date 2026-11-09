/* global globalThis, module, require */
(function (root) {
  'use strict';
  const commonJS = typeof module !== 'undefined' && module.exports;
  const backup = commonJS ? require('./lab-backup.js') : root.LabBackup;
  const identidade = commonJS ? require('./lab-identidade.js') : root.LabIdentidade;
  const repositorios = commonJS ? require('./lab-repositorio.js') : root.LabRepositorio;
  const progresso = commonJS ? require('./lab-progresso.js') : root.LabProgresso;
  const parser = commonJS ? require('./lab-validador.js') : root.LabValidador;
  const planos = new WeakMap();
  const comparacoesJournal = new WeakMap();
  const sessoes = ['principal', 'responsavel'];
  const prefixoLock = 'revisoesEscolares.lab.sessao.v1.';
  const LIMITE_TRANSPORTE = 262144;
  const copiar = (v) => JSON.parse(JSON.stringify(v));
  const falha = (codigo) => ({ ok: false, codigo });
  function opcoesValidas(opcoes) {
    if (
      !opcoes ||
      typeof opcoes !== 'object' ||
      Array.isArray(opcoes) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(opcoes))
    )
      return null;
    const d = Object.getOwnPropertyDescriptors(opcoes);
    const resultado = { handlesLab: [] };
    for (const nome of Reflect.ownKeys(d)) {
      if (
        !Object.hasOwn(resultado, nome) ||
        !d[nome].enumerable ||
        !Object.hasOwn(d[nome], 'value')
      )
        return null;
      const lista = d[nome].value;
      if (
        !Array.isArray(lista) ||
        Object.getPrototypeOf(lista) !== Array.prototype ||
        lista.length > 40
      )
        return null;
      const itens = Object.getOwnPropertyDescriptors(lista);
      if (Reflect.ownKeys(itens).length !== lista.length + 1) return null;
      for (let i = 0; i < lista.length; ++i) {
        if (!itens[i] || !itens[i].enumerable || !Object.hasOwn(itens[i], 'value')) return null;
        resultado[nome].push(itens[i].value);
      }
    }
    return resultado;
  }
  function mesmaAtividade(a, b) {
    return a && a.perfil === b.perfil && a.id === b.id && a.versao === b.versao;
  }
  function bloquear(e, codigo) {
    if (!e.bloqueios.includes(codigo)) e.bloqueios.push(codigo);
  }
  async function consultarLocks() {
    let timer;
    try {
      if (typeof root.navigator?.locks?.query !== 'function') return null;
      const r = await Promise.race([
        Promise.resolve().then(() => root.navigator.locks.query()),
        new Promise((resolve) => {
          timer = root.setTimeout(() => resolve(null), 3000);
        }),
      ]);
      if (
        !r ||
        !Array.isArray(r.held) ||
        !Array.isArray(r.pending) ||
        r.held.length + r.pending.length > 10000
      )
        return null;
      const atividades = [];
      for (const lock of r.held.concat(r.pending)) {
        if (typeof lock.name !== 'string') return null;
        if (!lock.name.startsWith(prefixoLock)) continue;
        if (lock.name.length > 1024) return null;
        const dados = JSON.parse(lock.name.slice(prefixoLock.length));
        if (
          !Array.isArray(dados) ||
          dados.length !== 6 ||
          typeof dados[0] !== 'string' ||
          !/^[a-f0-9]{64}$/.test(dados[0]) ||
          !['alice', 'mariana'].includes(dados[1]) ||
          typeof dados[2] !== 'string' ||
          typeof dados[3] !== 'string' ||
          !Number.isInteger(dados[4]) ||
          typeof dados[5] !== 'string'
        )
          return null;
        atividades.push({
          copyId: dados[0],
          perfil: dados[1],
          materia: dados[2],
          id: dados[3],
          versao: dados[4],
        });
      }
      return atividades;
    } catch {
      return null;
    } finally {
      if (timer) root.clearTimeout(timer);
    }
  }
  function observarFluxos(entradas, observacoes) {
    function indeterminado(codigo) {
      for (const e of entradas) bloquear(e, codigo);
    }
    for (const handle of observacoes.handlesLab) {
      try {
        const motor = root.QuestionariosRevisoes;
        if (!motor?.capturarParaBackupLab) {
          indeterminado('MEMORIA_NAO_INSPECIONAVEL');
          continue;
        }
        const r = motor.capturarParaBackupLab(handle);
        if (!r.ok) {
          indeterminado('HANDLE_SEM_VINCULO_CONFIRMADO');
          continue;
        }
        for (const e of entradas)
          if (mesmaAtividade(e.identidade, r.vinculo)) {
            e.concorrencia.memoria = 'observada-em-uso';
            e.concorrencia.gravacaoPendente ||= r.durabilidade.pendente;
            e.concorrencia.memoriaNaoDuravel ||= r.durabilidade.naoDuravel;
            bloquear(e, 'ATIVIDADE_EM_USO');
            if (r.durabilidade.pendente) bloquear(e, 'GRAVACAO_PENDENTE');
            if (r.durabilidade.naoDuravel) bloquear(e, 'MEMORIA_NAO_DURAVEL');
          }
      } catch {
        indeterminado('MEMORIA_NAO_INSPECIONAVEL');
      }
    }
  }
  function observarLocks(entradas, destino, locks) {
    for (const e of entradas) {
      if (locks === null) {
        e.concorrencia.locks = 'indeterminado';
        bloquear(e, 'EXCLUSIVIDADE_NAO_OBSERVAVEL');
      } else if (
        locks.some((l) => l.copyId === destino.copyId && mesmaAtividade(e.identidade, l))
      ) {
        e.concorrencia.locks = 'em-uso';
        bloquear(e, 'LOCK_OU_PEDIDO_ATIVO');
      } else if (e.concorrencia.locks !== 'em-uso' && e.concorrencia.locks !== 'indeterminado')
        e.concorrencia.locks = 'livre-no-instante';
    }
  }
  function classificarConteudo(r, entrada) {
    if (!r.ok)
      return {
        estado:
          r.codigo === 'DADOS_INVALIDOS'
            ? 'dados-ou-administracao-invalidos'
            : 'consulta-inconclusiva',
        codigo: r.codigo || 'CONSULTA_FALHOU',
        administracaoDestino: 'nao-confirmada',
        baseReconferida: false,
      };
    if (r.pacote === null)
      return { estado: 'ausente', administracaoDestino: 'ausente', baseReconferida: false };
    return {
      estado: r.digest === entrada.digest ? 'identico' : 'conflito-digest',
      administracaoDestino: r.administracao.situacao,
      baseReconferida: false,
    };
  }
  const assinaturaConsulta = (r) =>
    JSON.stringify({
      ok: r.ok,
      codigo: r.codigo,
      ausente: r.pacote === null,
      digest: r.digest,
      administracao: r.administracao,
    });
  function recusaIdentidade(r) {
    if (r.codigo === 'IDENTIDADE_ALTERADA') return falha('DESTINO_ALTERADO');
    if (r.codigo === 'IDENTIDADE_INDISPONIVEL') return falha('IDENTIDADE_NAO_RECONFIRMADA');
    return null;
  }
  function lerTexto(chave) {
    try {
      return { ok: true, texto: root.localStorage.getItem(chave) };
    } catch {
      return { ok: false };
    }
  }
  function compararProgresso(leitura, contexto, sessao, snapshot) {
    const comum = {
      sessao,
      igualdadeLogica: null,
      igualdadeTextual: null,
      baseTextualEstavel: false,
      candidatoIdempotente: false,
    };
    if (!leitura.ok) return { ...comum, estado: 'indisponivel' };
    if (leitura.texto === null) return { ...comum, estado: 'ausente-no-storage' };
    const texto = leitura.texto;
    if (
      typeof texto !== 'string' ||
      texto.length > LIMITE_TRANSPORTE ||
      new root.TextEncoder().encode(texto).byteLength > LIMITE_TRANSPORTE
    )
      return { ...comum, estado: 'corrompido', codigo: 'LIMITE_TRANSPORTE_EXCEDIDO' };
    const dados = parser.lerJSONBackup(texto);
    if (!dados.valido)
      return {
        ...comum,
        estado: dados.erros[0].codigo === 'UNICODE_INVALIDO' ? 'inconclusivo' : 'corrompido',
        codigo: dados.erros[0].codigo,
      };
    const atual = contexto.validarSnapshot(sessao, dados.valor);
    if (!atual.ok) return { ...comum, estado: 'corrompido', codigo: atual.codigo };
    const igual = JSON.stringify(atual.snapshot) === JSON.stringify(snapshot);
    return {
      ...comum,
      estado: igual ? 'logicamente-identico' : 'divergente',
      igualdadeLogica: igual,
      igualdadeTextual: texto === JSON.stringify(snapshot),
      candidatoIdempotente: igual,
    };
  }
  async function prepararPlano(entradaOriginal, observacoes = {}) {
    let repo = null;
    let chaves = null;
    try {
      if (arguments.length > 2) return falha('ARGUMENTOS_INVALIDOS');
      const opcoes = opcoesValidas(observacoes);
      if (!opcoes) return falha('OBSERVACOES_INVALIDAS');
      const validado = await backup.validarBackup(entradaOriginal);
      if (!validado.valido) return { ok: false, codigo: 'BACKUP_INVALIDO', erros: validado.erros };
      const destino = await identidade.resolverIdentidade();
      if (destino.modo !== 'persistente') return falha(destino.codigo || 'IDENTIDADE_INDISPONIVEL');
      const fontes = validado.backupNormalizado.entradas;
      const entradas = fontes.map((e) => ({
        identidade: {
          perfil: e.pacote.perfil,
          materia: e.pacote.materia,
          id: e.pacote.id,
          versao: e.pacote.versao,
          digest: e.digest,
        },
        situacaoAdministrativa: e.situacaoAdministrativa,
        administracaoCompativel: e.situacaoAdministrativa === 'ativa',
        conteudo: null,
        progresso: [],
        concorrencia: {
          locks: 'nao-consultado',
          memoria: 'nao-comprovada',
          gravacaoPendente: false,
          memoriaNaoDuravel: false,
        },
        operacoesPotenciais: [],
        bloqueios: [],
        dependencias: ['ASSOCIACAO_EXPLICITA_AO_DESTINO', 'REVALIDACAO_SOB_EXCLUSIVIDADE'],
      }));
      observarFluxos(entradas, opcoes);
      observarLocks(entradas, destino, await consultarLocks());
      let pendenciasJournal = {
        estado: entradas.length ? 'nao-inspecionado' : 'sem-atividades',
        bloqueioGlobalLab: entradas.length > 0,
      };
      if (entradas.length && root.LabJournal) {
        const j = await root.LabJournal.inspecionarPendencias();
        if (!j.ok) {
          if (j.codigo && (j.codigo.startsWith('IDENTIDADE') || j.codigo === 'DESTINO_ALTERADO'))
            return falha('DESTINO_NAO_RECONFIRMADO_PELO_JOURNAL');
          pendenciasJournal = { estado: 'consulta-inconclusiva', bloqueioGlobalLab: true };
        } else {
          if (j.destino.copyId !== destino.copyId || j.destino.origem !== destino.origem)
            return falha('DESTINO_ALTERADO');
          pendenciasJournal = {
            estado: j.bloqueiaRestauracao ? 'pendencias-detectadas' : 'sem-pendencias-observadas',
            bloqueioGlobalLab: j.bloqueioGlobalLab,
          };
          for (const e of entradas)
            if (j.atividadesBloqueadas.some((a) => mesmaAtividade(a, e.identidade)))
              bloquear(e, 'JOURNAL_PENDENTE_NA_ATIVIDADE');
        }
      }
      if (pendenciasJournal.bloqueioGlobalLab)
        for (const e of entradas) bloquear(e, 'JOURNAL_NAO_LIBERADO_PARA_RESTAURACAO');
      let abertura = { ok: true };
      if (entradas.length) {
        abertura = await repositorios.abrirRepositorio();
        const recusa = recusaIdentidade(abertura);
        if (recusa) return recusa;
        if (abertura.ok) {
          repo = abertura.repositorio;
          if (abertura.copyId !== destino.copyId || abertura.origem !== destino.origem)
            return falha('DESTINO_ALTERADO');
          chaves = progresso.criarArmazenamento();
        }
      }
      const bases = [];
      for (let i = 0; i < entradas.length; ++i) {
        const e = entradas[i],
          fonte = fontes[i],
          p = fonte.pacote;
        const id = { perfil: p.perfil, id: p.id, versao: p.versao };
        const consulta = repo ? await repo.consultar(id) : abertura;
        const recusa = recusaIdentidade(consulta);
        if (recusa) return recusa;
        e.conteudo = classificarConteudo(consulta, fonte);
        if (e.conteudo.estado === 'ausente')
          e.operacoesPotenciais.push('cadastrar-pacote-futuramente');
        else if (e.conteudo.estado === 'identico') e.operacoesPotenciais.push('preservar-pacote');
        else
          bloquear(
            e,
            e.conteudo.estado === 'conflito-digest' ? 'CONFLITO_DIGEST' : 'CONTEUDO_NAO_CONFIRMADO'
          );
        if (!e.administracaoCompativel) {
          bloquear(e, 'ADMINISTRACAO_ARQUIVADA_NAO_SUPORTADA');
          e.dependencias.push('SUPORTE_A_ADMINISTRACAO_ARQUIVADA');
        }
        const base = { e, id, assinatura: assinaturaConsulta(consulta), sessoes: [] };
        bases.push(base);
        const nomes = sessoes.filter((s) => Object.hasOwn(fonte.sessoes, s));
        let contexto = null;
        if (nomes.length) {
          const motor = root.QuestionariosRevisoes;
          contexto = motor && (await motor.criarValidadorSnapshotLab(JSON.stringify(p)));
          if (!contexto?.ok || contexto.digest !== fonte.digest) {
            bloquear(e, 'CONTEXTO_SNAPSHOT_NAO_CONFIRMADO');
            for (const sessao of nomes)
              e.progresso.push({ sessao, estado: 'inconclusivo', candidatoIdempotente: false });
            continue;
          }
        }
        // Coleção privada e inerte: somente obter a chave já definida por LAB.2B.3.
        // Nunca chamar carregar/salvar, nem tocar no cache de outra execução.
        const derivador = chaves || (chaves = progresso.criarArmazenamento());
        for (const sessao of nomes) {
          const canal = derivador.abrir({
            modo: 'persistente',
            sessao,
            identidade: { copyId: destino.copyId, ...e.identidade },
            vigente: () => false,
            autorizar: () => Promise.resolve({ ok: false }),
          });
          if (!canal.ok) {
            e.progresso.push({ sessao, estado: 'inconclusivo', candidatoIdempotente: false });
            bloquear(e, 'CHAVE_LAB_NAO_DERIVADA');
            continue;
          }
          const leitura = lerTexto(canal.canal.chave);
          const estado = compararProgresso(leitura, contexto, sessao, fonte.sessoes[sessao]);
          const textoBackup = JSON.stringify(fonte.sessoes[sessao]);
          estado.compativelComTransporteAtual =
            textoBackup.length <= LIMITE_TRANSPORTE &&
            new root.TextEncoder().encode(textoBackup).byteLength <= LIMITE_TRANSPORTE;
          if (!estado.compativelComTransporteAtual) {
            bloquear(e, 'SNAPSHOT_EXCEDE_TRANSPORTE_ATUAL');
            e.dependencias.push('SUPORTE_A_PROGRESSO_MAIOR_QUE_256KIB');
          }
          e.progresso.push(estado);
          base.sessoes.push({ estado, chave: canal.canal.chave, leitura });
        }
      }
      // Bases são observações pontuais; mudanças durante a própria preparação também bloqueiam.
      for (const base of bases) {
        if (repo) {
          const novamente = await repo.consultar(base.id);
          const recusa = recusaIdentidade(novamente);
          if (recusa) return recusa;
          base.e.conteudo.baseReconferida = novamente.ok;
          if (assinaturaConsulta(novamente) !== base.assinatura) {
            base.e.conteudo.estado = 'alterado-durante-planejamento';
            bloquear(base.e, 'CONTEUDO_ALTERADO_DURANTE_PLANEJAMENTO');
          }
        }
      }
      observarFluxos(entradas, opcoes);
      observarLocks(entradas, destino, await consultarLocks());
      const final = await identidade.resolverIdentidade(destino.copyId);
      if (final.modo !== 'persistente' || final.origem !== destino.origem)
        return falha(
          final.codigo === 'IDENTIDADE_ALTERADA' ||
            (final.origem && final.origem !== destino.origem)
            ? 'DESTINO_ALTERADO'
            : 'IDENTIDADE_NAO_RECONFIRMADA'
        );
      // Última releitura síncrona: nenhum await posterior pode mascarar troca da base textual.
      for (const base of bases)
        for (const s of base.sessoes) {
          const atual = lerTexto(s.chave);
          s.estado.baseTextualEstavel = atual.ok && s.leitura.ok && atual.texto === s.leitura.texto;
          if (!s.estado.baseTextualEstavel) {
            s.estado.estado =
              atual.ok && s.leitura.ok ? 'alterado-durante-planejamento' : 'indisponivel';
            s.estado.candidatoIdempotente = false;
            s.estado.igualdadeLogica = null;
            s.estado.igualdadeTextual = null;
          }
        }
      for (const e of entradas) {
        if (e.concorrencia.memoria === 'nao-comprovada') bloquear(e, 'MEMORIA_NAO_INSPECIONADA');
        for (const s of e.progresso) {
          if (s.estado === 'ausente-no-storage')
            e.operacoesPotenciais.push('inserir-progresso-' + s.sessao + '-futuramente');
          else if (s.estado === 'logicamente-identico')
            e.operacoesPotenciais.push('preservar-progresso-' + s.sessao);
          else bloquear(e, 'PROGRESSO_' + s.estado.toUpperCase().replace(/-/g, '_'));
        }
        e.bloqueios.sort();
        e.bloqueada = e.bloqueios.length > 0;
      }
      const previa = {
        destino: { copyId: destino.copyId, origem: destino.origem },
        totalAtividades: entradas.length,
        journal: pendenciasJournal,
        entradas,
        restauracaoAutorizada: false,
        associacaoDestinoConfirmada: false,
        confirmacaoExplicitaNecessaria: true,
        repetirValidacaoSobExclusividade: true,
        instantaneoSemGarantiaDeVigencia: true,
        efeitosTecnicos: {
          aberturaPodeCriarSchemaVazio: entradas.length > 0,
          cadastrosOuGravacoesDeProgressoEmitidos: 0,
        },
      };
      const plano = Object.freeze({});
      planos.set(plano, copiar(previa));
      return { ok: true, plano, previa: copiar(previa) };
    } catch {
      return falha('PLANEJAMENTO_INCONCLUSIVO');
    } finally {
      if (repo) repo.fechar();
      if (chaves) chaves.encerrar();
    }
  }
  function inspecionarPlano(plano) {
    if (arguments.length !== 1 || !planos.has(plano)) return falha('PLANO_INVALIDO');
    return { ok: true, previa: copiar(planos.get(plano)) };
  }
  async function compararBasesJournal(entradaOriginal, coordenador, permissao) {
    let derivador;
    try {
      if (!root.LabCoordenador || !root.QuestionariosRevisoes)
        return falha('CONTEXTO_JOURNAL_INDISPONIVEL');
      const conexao = root.LabCoordenador.conectarJournal(coordenador);
      if (!conexao.ok || !conexao.vigente()) return falha('RESERVA_JOURNAL_INATIVA');
      const v = await backup.validarBackup(entradaOriginal);
      if (!v.valido) return falha('BACKUP_INVALIDO');
      if (v.backupNormalizado.entradas.length !== 1) return falha('ATIVIDADE_UNICA_NECESSARIA');
      const fonte = v.backupNormalizado.entradas[0],
        p = fonte.pacote,
        d = conexao.identidade;
      const aplicacao = permissao && root.LabJournal?.alvoAplicacao(permissao);
      if (
        permissao &&
        (!aplicacao ||
          aplicacao.destino.copyId !== d.copyId ||
          aplicacao.destino.origem !== d.origem ||
          !mesmaAtividade(aplicacao.identidade, p))
      )
        return falha('AUTORIZACAO_APLICACAO_INVALIDA');
      if (
        p.perfil !== d.perfil ||
        p.materia !== d.materia ||
        p.id !== d.id ||
        p.versao !== d.versao ||
        fonte.digest !== d.digest
      )
        return falha('ALVO_JOURNAL_DIVERGENTE');
      const livre = () => root.QuestionariosRevisoes.conferirDisponibilidadeJournal(d).ok;
      if (!livre()) return falha('EXECUCAO_LAB_EM_USO');
      const fresco = await prepararPlano(entradaOriginal);
      if (!fresco.ok) return fresco;
      const e = fresco.previa.entradas[0];
      if (fresco.previa.destino.copyId !== d.copyId || fresco.previa.destino.origem !== d.origem)
        return falha('DESTINO_ALTERADO');
      // Somente o lock próprio comprovado e a ausência no registro privado do motor substituem
      // estas duas observações inconclusivas; nenhum outro bloqueio do plano é dispensado.
      const bloqueios = e.bloqueios.filter(
        (c) =>
          ![
            'LOCK_OU_PEDIDO_ATIVO',
            'MEMORIA_NAO_INSPECIONADA',
            ...(aplicacao ? ['JOURNAL_PENDENTE_NA_ATIVIDADE'] : []),
          ].includes(c)
      );
      if (bloqueios.length) return { ...falha('PREPARACAO_JOURNAL_BLOQUEADA'), bloqueios };
      if (!['ausente', 'identico'].includes(e.conteudo.estado))
        return falha('CONTEUDO_NAO_CONFIRMADO');
      if (
        !aplicacao &&
        e.conteudo.estado === 'identico' &&
        !e.progresso.some((s) => s.estado === 'ausente-no-storage')
      )
        return falha('SOMENTE_OPERACOES_NULAS');
      derivador = progresso.criarArmazenamento();
      const leituras = [],
        bases = [];
      for (const nome of sessoes.filter((s) => Object.hasOwn(fonte.sessoes, s))) {
        const canal = derivador.abrir({
          modo: 'persistente',
          sessao: nome,
          identidade: {
            copyId: d.copyId,
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: fonte.digest,
          },
          vigente: () => false,
          autorizar: () => Promise.resolve({ ok: false }),
        });
        if (!canal.ok) return falha('CHAVE_LAB_NAO_DERIVADA');
        const leitura = lerTexto(canal.canal.chave);
        if (!leitura.ok) return falha('PROGRESSO_INDISPONIVEL');
        const contexto = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(
          JSON.stringify(p)
        );
        if (!contexto.ok || contexto.digest !== fonte.digest)
          return falha('CONTEXTO_SNAPSHOT_NAO_CONFIRMADO');
        const s = compararProgresso(leitura, contexto, nome, fonte.sessoes[nome]);
        if (!['ausente-no-storage', 'logicamente-identico'].includes(s.estado))
          return falha('PROGRESSO_NAO_ELEGIVEL');
        let hashTexto = null;
        if (leitura.texto !== null) {
          const hash = await root.crypto.subtle.digest(
            'SHA-256',
            new root.TextEncoder().encode(leitura.texto)
          );
          hashTexto = Array.from(new root.Uint8Array(hash), (n) =>
            n.toString(16).padStart(2, '0')
          ).join('');
        }
        leituras.push({ chave: canal.canal.chave, texto: leitura.texto });
        bases.push({ sessao: nome, existe: leitura.texto !== null, hashTexto });
      }
      const perm = await conexao.revalidar();
      const verificar = () =>
        conexao.vigente() &&
        livre() &&
        leituras.every((l) => {
          const atual = lerTexto(l.chave);
          return atual.ok && atual.texto === l.texto;
        });
      if (!perm.ok || !verificar()) return falha('BASE_OU_POSSE_ALTERADA');
      const referencia = Object.freeze({});
      comparacoesJournal.set(referencia, verificar);
      return {
        ok: true,
        referencia,
        destino: { copyId: d.copyId, origem: d.origem },
        identidade: {
          perfil: p.perfil,
          materia: p.materia,
          id: p.id,
          versao: p.versao,
          digest: fonte.digest,
        },
        conteudo: e.conteudo.estado,
        bases,
      };
    } catch {
      return falha('COMPARACAO_JOURNAL_INCONCLUSIVA');
    } finally {
      if (derivador) derivador.encerrar();
    }
  }
  async function compararParaJournal(original, coordenador) {
    if (arguments.length !== 2) return falha('ARGUMENTOS_INVALIDOS');
    return compararBasesJournal(original, coordenador, null);
  }
  async function compararParaAplicacao(original, coordenador, permissao) {
    if (arguments.length !== 3 || !permissao) return falha('AUTORIZACAO_APLICACAO_INVALIDA');
    return compararBasesJournal(original, coordenador, permissao);
  }
  function verificarComparacaoJournal(referencia) {
    const verificar = comparacoesJournal.get(referencia);
    try {
      return arguments.length === 1 && !!verificar && verificar();
    } catch {
      return false;
    }
  }
  const api = { prepararPlano, inspecionarPlano };
  Object.defineProperties(api, {
    avaliarProgressoReconciliacao: { value: compararProgresso },
    compararParaJournal: { value: compararParaJournal },
    compararParaAplicacao: { value: compararParaAplicacao },
    verificarComparacaoJournal: { value: verificarComparacaoJournal },
  });
  Object.freeze(api);
  if (commonJS) module.exports = api;
  else root.LabRestauracao = api;
})(typeof window === 'undefined' ? globalThis : window);
