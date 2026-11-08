/* global globalThis, module, require */
(function (root) {
  'use strict';
  const commonJS = typeof module !== 'undefined' && module.exports;
  const repositorios = commonJS ? require('./lab-repositorio.js') : root.LabRepositorio;
  const identidade = commonJS ? require('./lab-identidade.js') : root.LabIdentidade;
  const pacotes = commonJS ? require('./lab-validador.js') : root.LabValidador;
  const backup = commonJS ? require('./lab-backup.js') : root.LabBackup;
  const contextos = new WeakMap(),
    catalogos = new WeakMap();
  const confirmacoes = new WeakMap(),
    gravacoes = new WeakMap();
  const confirmacoesAplicacao = new WeakMap(),
    efeitosAplicacao = new WeakMap();
  const permissoesComparacao = new WeakMap(),
    snapshotsInternos = new WeakMap();
  const confirmacoesReconciliacao = new WeakMap(),
    escritasReconciliacao = new WeakMap();
  const confirmacoesRetomada = new WeakMap();
  const confirmacoesEncerramento = new WeakMap();
  const restauracao = () => (commonJS ? require('./lab-restauracao.js') : root.LabRestauracao);
  const coordenadores = () => (commonJS ? require('./lab-coordenador.js') : root.LabCoordenador);
  const LIMITES = Object.freeze({
    registros: 32,
    bytesRegistro: 8388608,
    bytesInspecao: 16777216,
    atividades: 20,
    profundidade: 16,
    tokens: 200000,
  });
  const estados = [
    'intencao-registrada',
    'pendente',
    'reconciliacao-necessaria',
    'bloqueada',
    'aplicacao-concluida',
    'cancelada-sem-aplicacao',
  ];
  const encerradaSemAplicacao = (r) => r.estado === 'cancelada-sem-aplicacao';
  const terminalNaoPendente = (r) => r.estado === 'aplicacao-concluida' || encerradaSemAplicacao(r);
  function intencaoNuncaAplicada(r) {
    return (
      r.atividades.length === 1 &&
      r.marcadores.intencao === 'registrada' &&
      r.marcadores.aplicacao === 'nao-iniciada' &&
      r.marcadores.efeitos === 'nao-comprovados' &&
      passos(r).every((p) => p.etapa === 'nao-iniciada' && p.resultado === 'nao-comprovado')
    );
  }
  function transicaoEncerramento(a, b) {
    if (assinatura(a) === assinatura(b)) return true;
    if (
      a.estado !== 'intencao-registrada' ||
      a.revisao !== 0 ||
      !intencaoNuncaAplicada(a) ||
      !encerradaSemAplicacao(b)
    )
      return false;
    const c = copiar(b);
    delete c.encerramento;
    c.estado = a.estado;
    c.revisao = a.revisao;
    return assinatura(c) === assinatura(a);
  }
  const etapas = [
    'nao-iniciada',
    'escrita-solicitada',
    'escrita-observada',
    'resultado-confirmado',
  ];
  const passos = (r) =>
    r.atividades.flatMap((a) => [
      a.conteudo,
      ...['principal', 'responsavel']
        .filter((s) => Object.hasOwn(a.sessoes, s))
        .map((s) => a.sessoes[s]),
    ]);
  const ehReconciliacao = (r) =>
    r.marcadores.aplicacao === 'em-reconciliacao' ||
    r.marcadores.efeitos === 'verificados-por-reconciliacao';
  const ehRetomada = (r) =>
    r.marcadores.aplicacao === 'em-retomada' || r.marcadores.efeitos === 'verificados-por-retomada';
  function validarEtapa(p, operacional, reconciliacao) {
    if (!operacional)
      return exigir(
        p.etapa === etapas[0] && p.resultado === 'nao-comprovado',
        'ETAPAS_JOURNAL_INCOERENTES'
      );
    const n = etapas.indexOf(p.etapa);
    exigir(
      n >= 0 &&
        (n < 2
          ? p.resultado === 'nao-comprovado' && (n === 0 || p.intencao === 'criar')
          : (p.resultado === 'criacao-observada' && p.intencao === 'criar') ||
            (reconciliacao && p.resultado === 'presenca-verificada' && p.intencao === 'criar') ||
            (n === 3 && p.resultado === 'base-preservada')),
      'ETAPAS_JOURNAL_INCOERENTES'
    );
  }
  function assinaturaImutavel(r) {
    const c = copiar(r);
    delete c.estado;
    delete c.revisao;
    delete c.marcadores;
    for (const p of passos(c)) {
      delete p.etapa;
      delete p.resultado;
    }
    return assinatura(c);
  }
  function transicaoAplicacao(a, b) {
    if (ehReconciliacao(a) || ehReconciliacao(b) || ehRetomada(a) || ehRetomada(b)) return false;
    if (assinaturaImutavel(a) !== assinaturaImutavel(b)) return false;
    if (assinatura(a) === assinatura(b)) return true;
    if (
      !['intencao-registrada', 'pendente'].includes(a.estado) ||
      (a.estado === 'pendente' && a.marcadores.aplicacao !== 'em-andamento')
    )
      return false;
    const pa = passos(a),
      pb = passos(b);
    if (b.estado === 'aplicacao-concluida')
      return (
        a.marcadores.aplicacao === 'em-andamento' &&
        pa.every((p, i) => p.etapa === etapas[3] && assinatura(p) === assinatura(pb[i]))
      );
    if (b.estado !== 'pendente' || b.marcadores.aplicacao !== 'em-andamento') return false;
    const mudados = pa
      .map((p, i) => (assinatura(p) === assinatura(pb[i]) ? -1 : i))
      .filter((i) => i >= 0);
    if (mudados.length !== 1) return false;
    const i = mudados[0],
      antes = etapas.indexOf(pa[i].etapa),
      depois = etapas.indexOf(pb[i].etapa);
    return (
      (depois === antes + 1 ||
        (antes === 0 && depois === 3 && pb[i].resultado === 'base-preservada')) &&
      pa.slice(0, i).every((p) => p.etapa === etapas[3])
    );
  }
  function transicaoReconciliacao(a, b) {
    if (assinaturaImutavel(a) !== assinaturaImutavel(b)) return false;
    if (assinatura(a) === assinatura(b)) return true;
    if (
      a.estado !== 'pendente' ||
      !['em-andamento', 'em-reconciliacao', 'em-retomada'].includes(a.marcadores.aplicacao) ||
      !ehReconciliacao(b)
    )
      return false;
    const pa = passos(a),
      pb = passos(b);
    if (b.estado === 'aplicacao-concluida')
      return pa.every((p, i) => p.etapa === etapas[3] && assinatura(p) === assinatura(pb[i]));
    if (b.estado !== 'pendente' || b.marcadores.aplicacao !== 'em-reconciliacao') return false;
    const mudados = pa
      .map((p, i) => (assinatura(p) === assinatura(pb[i]) ? -1 : i))
      .filter((i) => i >= 0);
    if (mudados.length !== 1) return false;
    const i = mudados[0],
      antes = etapas.indexOf(pa[i].etapa),
      depois = etapas.indexOf(pb[i].etapa);
    if (!pa.slice(0, i).every((p) => p.etapa === etapas[3])) return false;
    return (
      (antes === 0 &&
        depois === 3 &&
        pa[i].intencao === 'preservar' &&
        pb[i].resultado === 'base-preservada') ||
      (antes === 1 && depois === 2 && pb[i].resultado === 'presenca-verificada') ||
      (antes === 2 && depois === 3 && pa[i].resultado === pb[i].resultado)
    );
  }
  function transicaoRetomada(a, b) {
    if (assinaturaImutavel(a) !== assinaturaImutavel(b)) return false;
    if (assinatura(a) === assinatura(b)) return true;
    if (
      !(a.estado === 'intencao-registrada' && a.revisao === 0) &&
      !(
        a.estado === 'pendente' &&
        ['em-andamento', 'em-reconciliacao', 'em-retomada'].includes(a.marcadores.aplicacao)
      )
    )
      return false;
    const pa = passos(a),
      pb = passos(b);
    if (b.estado === 'aplicacao-concluida')
      return (
        ehRetomada(b) &&
        a.marcadores.aplicacao === 'em-retomada' &&
        pa.every((p, i) => p.etapa === etapas[3] && assinatura(p) === assinatura(pb[i]))
      );
    if (b.estado !== 'pendente' || b.marcadores.aplicacao !== 'em-retomada') return false;
    const mudados = pa
      .map((p, i) => (assinatura(p) === assinatura(pb[i]) ? -1 : i))
      .filter((i) => i >= 0);
    // Troca de finalidade explícita, sem reiniciar etapas nem fabricar uma nova solicitação.
    if (!mudados.length) return a.estado === 'pendente';
    if (mudados.length !== 1) return false;
    const i = mudados[0],
      antes = etapas.indexOf(pa[i].etapa),
      depois = etapas.indexOf(pb[i].etapa);
    if (!pa.slice(0, i).every((p) => p.etapa === etapas[3])) return false;
    return (
      (antes === 0 && depois === 1 && pa[i].intencao === 'criar') ||
      (antes === 0 &&
        depois === 3 &&
        pa[i].intencao === 'preservar' &&
        pb[i].resultado === 'base-preservada') ||
      (antes === 1 &&
        depois === 2 &&
        ['criacao-observada', 'presenca-verificada'].includes(pb[i].resultado)) ||
      (antes === 2 && depois === 3 && pa[i].resultado === pb[i].resultado)
    );
  }
  const codigos = new Set([
    'CONTRATO_JOURNAL_INVALIDO',
    'LIMITE_JOURNAL',
    'REGISTRO_JOURNAL_CORROMPIDO',
    'VERSAO_JOURNAL_INCOMPATIVEL',
    'REGISTRO_JOURNAL_INCOMPLETO',
    'DESTINO_JOURNAL_DIVERGENTE',
    'ESTADO_JOURNAL_INCOMPATIVEL',
    'ETAPAS_JOURNAL_INCOERENTES',
    'IDENTIDADE_JOURNAL_REPETIDA',
    'ORDEM_JOURNAL_INVALIDA',
    'PACOTE_JOURNAL_INVALIDO',
    'BASE_JOURNAL_NAO_CONFIRMADA',
    'IDENTIDADE_JOURNAL_DIVERGENTE',
    'LIMITE_SNAPSHOT_JOURNAL',
    'SNAPSHOT_JOURNAL_INVALIDO',
    'LIMITE_INSPECAO_JOURNAL',
    'JOURNAL_FECHADO',
  ]);
  const codigoSeguro = (erro, padrao) => (codigos.has(erro) ? erro : padrao);
  const uuid = (v) =>
    typeof v === 'string' &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v);
  const hash = (v) => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
  const idAtividade = (v) => JSON.stringify([v.perfil, v.id, v.versao]);
  const copiar = (v) => JSON.parse(JSON.stringify(v));
  const falha = (codigo) => ({
    ok: false,
    codigo,
    bloqueioGlobalLab: true,
    reconciliacaoAutomatica: false,
  });
  function exigir(condicao, codigo = 'CONTRATO_JOURNAL_INVALIDO') {
    if (!condicao) throw codigo;
  }
  function fechado(v, nomes) {
    exigir(v && typeof v === 'object' && !Array.isArray(v));
    exigir(
      nomes.every((k) => Object.hasOwn(v, k)),
      'REGISTRO_JOURNAL_INCOMPLETO'
    );
    exigir(
      v &&
        typeof v === 'object' &&
        !Array.isArray(v) &&
        Object.keys(v).length === nomes.length &&
        nomes.every((k) => Object.hasOwn(v, k))
    );
  }
  function assinatura(v) {
    if (Array.isArray(v)) return '[' + v.map(assinatura).join(',') + ']';
    if (v && typeof v === 'object')
      return (
        '{' +
        Object.keys(v)
          .sort()
          .map((k) => JSON.stringify(k) + ':' + assinatura(v[k]))
          .join(',') +
        '}'
      );
    return JSON.stringify(v);
  }
  // Objetos de IDB são dados, mas podem conter Date/Blob/Map e valores não JSON.
  // Cópia declarativa limitada antes de serializar; nunca invoca toJSON/getters.
  function textoDeRegistro(valor) {
    let nos = 0,
      caracteres = 0;
    const vistos = new Set();
    function visitar(v, nivel) {
      exigir(++nos <= 100000 && nivel <= 17, 'LIMITE_JOURNAL');
      if (typeof v === 'string') {
        caracteres += v.length;
        exigir(v.length <= 262144 && caracteres <= LIMITES.bytesRegistro, 'LIMITE_JOURNAL');
        return v;
      }
      if (v === null || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v)))
        return v;
      exigir(v && typeof v === 'object' && !vistos.has(v));
      const array = Array.isArray(v);
      exigir([array ? Array.prototype : Object.prototype, null].includes(Object.getPrototypeOf(v)));
      const chaves = Reflect.ownKeys(v);
      exigir(chaves.length <= 100000, 'LIMITE_JOURNAL');
      if (array) exigir(v.length <= 10000 && chaves.length === v.length + 1, 'LIMITE_JOURNAL');
      vistos.add(v);
      const resultado = array ? [] : Object.create(null);
      for (const k of chaves) {
        if (array && k === 'length') continue;
        exigir(typeof k === 'string' && !['__proto__', 'constructor', 'prototype'].includes(k));
        caracteres += k.length;
        exigir(caracteres <= LIMITES.bytesRegistro, 'LIMITE_JOURNAL');
        const d = Object.getOwnPropertyDescriptor(v, k);
        exigir(d.enumerable && Object.hasOwn(d, 'value'));
        if (array) exigir(/^(0|[1-9][0-9]*)$/.test(k) && Number(k) < v.length);
        resultado[k] = visitar(d.value, nivel + 1);
      }
      vistos.delete(v);
      return resultado;
    }
    const texto = JSON.stringify(visitar(valor, 1));
    exigir(
      texto.length <= LIMITES.bytesRegistro &&
        new root.TextEncoder().encode(texto).byteLength <= LIMITES.bytesRegistro,
      'LIMITE_JOURNAL'
    );
    return texto;
  }
  async function analisarRegistro(texto, destino, repo, validarPacote, validarBackup) {
    const l = pacotes.lerJSONBackup(texto);
    exigir(l.valido, 'REGISTRO_JOURNAL_CORROMPIDO');
    const r = l.valor;
    if (r && typeof r === 'object' && Object.hasOwn(r, 'versao'))
      exigir(r.versao === 1, 'VERSAO_JOURNAL_INCOMPATIVEL');
    fechado(r, [
      'formato',
      'versao',
      'id',
      'destino',
      'estado',
      'revisao',
      'atividades',
      'marcadores',
      ...(encerradaSemAplicacao(r) ? ['encerramento'] : []),
    ]);
    exigir(r.formato === 'lab-journal-v1');
    exigir(r.versao === 1, 'VERSAO_JOURNAL_INCOMPATIVEL');
    exigir(uuid(r.id));
    fechado(r.destino, ['copyId', 'origem']);
    exigir(hash(r.destino.copyId) && typeof r.destino.origem === 'string');
    exigir(
      r.destino.copyId === destino.copyId && r.destino.origem === destino.origem,
      'DESTINO_JOURNAL_DIVERGENTE'
    );
    exigir(estados.includes(r.estado), 'ESTADO_JOURNAL_INCOMPATIVEL');
    exigir(r.revisao === estados.indexOf(r.estado), 'ETAPAS_JOURNAL_INCOERENTES');
    fechado(r.marcadores, ['intencao', 'aplicacao', 'efeitos']);
    const operacional = r.marcadores.aplicacao !== 'nao-iniciada';
    exigir(
      r.marcadores.intencao === 'registrada' &&
        (operacional
          ? (r.estado === 'pendente' &&
              ['em-andamento', 'em-reconciliacao', 'em-retomada'].includes(
                r.marcadores.aplicacao
              ) &&
              r.marcadores.efeitos === 'nao-comprovados') ||
            (r.estado === 'aplicacao-concluida' &&
              r.marcadores.aplicacao === 'concluida' &&
              [
                'verificados-por-leitura',
                'verificados-por-reconciliacao',
                'verificados-por-retomada',
              ].includes(r.marcadores.efeitos))
          : r.estado !== 'aplicacao-concluida' && r.marcadores.efeitos === 'nao-comprovados'),
      'ETAPAS_JOURNAL_INCOERENTES'
    );
    exigir(
      Array.isArray(r.atividades) &&
        r.atividades.length >= 1 &&
        r.atividades.length <= LIMITES.atividades,
      'LIMITE_JOURNAL'
    );
    let pacoteEncerrado;
    if (encerradaSemAplicacao(r)) {
      exigir(intencaoNuncaAplicada(r), 'ETAPAS_JOURNAL_INCOERENTES');
      fechado(r.encerramento, ['versao', 'efeito', 'pacote']);
      exigir(r.encerramento.versao === 1 && r.encerramento.efeito === 'sem-aplicacao');
      const v = await validarPacote(r.encerramento.pacote);
      exigir(
        v.valido && v.canonico === r.encerramento.pacote && v.digest === r.atividades[0].digest,
        'PACOTE_JOURNAL_INVALIDO'
      );
      pacoteEncerrado = v.pacoteNormalizado;
    }
    const entradas = [],
      ids = new Set();
    let ordem = '';
    for (const a of r.atividades) {
      fechado(a, ['perfil', 'materia', 'id', 'versao', 'digest', 'conteudo', 'sessoes']);
      exigir(
        ['alice', 'mariana'].includes(a.perfil) &&
          typeof a.id === 'string' &&
          /^[a-z][a-z0-9-]{0,63}$/.test(a.id) &&
          Number.isInteger(a.versao) &&
          a.versao >= 1 &&
          a.versao <= 9999 &&
          hash(a.digest)
      );
      const id = idAtividade(a);
      exigir(!ids.has(id), 'IDENTIDADE_JOURNAL_REPETIDA');
      ids.add(id);
      const ordenacao = JSON.stringify([a.perfil, a.id, String(a.versao).padStart(4, '0')]);
      exigir(!ordem || ordenacao > ordem, 'ORDEM_JOURNAL_INVALIDA');
      ordem = ordenacao;
      fechado(a.conteudo, ['intencao', 'baseDigest', 'pacote', 'etapa', 'resultado']);
      validarEtapa(a.conteudo, operacional, ehReconciliacao(r) || ehRetomada(r));
      let p;
      if (a.conteudo.intencao === 'criar') {
        exigir(a.conteudo.baseDigest === null && typeof a.conteudo.pacote === 'string');
        const v = await validarPacote(a.conteudo.pacote);
        exigir(
          v.valido && v.canonico === a.conteudo.pacote && v.digest === a.digest,
          'PACOTE_JOURNAL_INVALIDO'
        );
        p = v.pacoteNormalizado;
        if (pacoteEncerrado)
          exigir(a.conteudo.pacote === r.encerramento.pacote, 'PACOTE_JOURNAL_INVALIDO');
      } else {
        exigir(
          a.conteudo.intencao === 'preservar' &&
            a.conteudo.pacote === null &&
            a.conteudo.baseDigest === a.digest
        );
        if (pacoteEncerrado) p = pacoteEncerrado;
        else {
          const c = await repo.consultar({ perfil: a.perfil, id: a.id, versao: a.versao });
          exigir(c.ok && c.pacote && c.digest === a.digest, 'BASE_JOURNAL_NAO_CONFIRMADA');
          p = c.pacote;
        }
      }
      exigir(
        ['perfil', 'materia', 'id', 'versao'].every((k) => p[k] === a[k]),
        'IDENTIDADE_JOURNAL_DIVERGENTE'
      );
      exigir(
        a.sessoes &&
          typeof a.sessoes === 'object' &&
          !Array.isArray(a.sessoes) &&
          Object.keys(a.sessoes).every((k) => ['principal', 'responsavel'].includes(k))
      );
      const snapshots = {};
      for (const nome of ['principal', 'responsavel'])
        if (Object.hasOwn(a.sessoes, nome)) {
          const s = a.sessoes[nome];
          fechado(s, ['intencao', 'base', 'snapshot', 'etapa', 'resultado']);
          fechado(s.base, ['existe', 'hashTexto']);
          validarEtapa(s, operacional, ehReconciliacao(r) || ehRetomada(r));
          exigir(
            (s.intencao === 'criar' && s.base.existe === false && s.base.hashTexto === null) ||
              (s.intencao === 'preservar' && s.base.existe === true && hash(s.base.hashTexto))
          );
          const t = JSON.stringify(s.snapshot);
          exigir(
            t.length <= 262144 && new root.TextEncoder().encode(t).byteLength <= 262144,
            'LIMITE_SNAPSHOT_JOURNAL'
          );
          snapshots[nome] = s.snapshot;
        }
      entradas.push({
        pacote: p,
        digest: a.digest,
        situacaoAdministrativa: 'ativa',
        sessoes: snapshots,
      });
    }
    const v = await validarBackup(
      JSON.stringify({ formato: 'lab-backup-v1', versao: 1, entradas })
    );
    exigir(v.valido, 'SNAPSHOT_JOURNAL_INVALIDO');
    for (let i = 0; i < r.atividades.length; ++i) {
      const e = v.backupNormalizado.entradas[i],
        a = r.atividades[i];
      exigir(idAtividade(a) === idAtividade(e.pacote), 'ORDEM_JOURNAL_INVALIDA');
      for (const nome of Object.keys(a.sessoes))
        exigir(
          assinatura(a.sessoes[nome].snapshot) === assinatura(e.sessoes[nome]),
          'SNAPSHOT_JOURNAL_INVALIDO'
        );
    }
    if (operacional) {
      exigir(r.atividades.length === 1, 'ETAPAS_JOURNAL_INCOERENTES');
      let incompleto = false,
        emCurso = false;
      for (const p of passos(r)) {
        const n = etapas.indexOf(p.etapa);
        exigir(!(incompleto && n > 0), 'ETAPAS_JOURNAL_INCOERENTES');
        if (n < 3) incompleto = true;
        if (n > 0) emCurso = true;
      }
      exigir(
        emCurso && (r.estado !== 'aplicacao-concluida' || !incompleto),
        'ETAPAS_JOURNAL_INCOERENTES'
      );
    }
    return r;
  }
  function validarRegistro(texto, destino, repo) {
    return analisarRegistro(texto, destino, repo, pacotes.validarPacote, backup.validarBackup);
  }
  // Análise pura, inclusive de bases de preservação explicitamente fornecidas como JSON.
  // Nenhum repositório/capacidade recebidos ou criados; fluxos persistentes usam validarRegistro.
  async function analisarContratoJournal(
    texto,
    destino,
    bases = '{"formato":"lab-backup-v1","versao":1,"entradas":[]}'
  ) {
    try {
      fechado(destino, ['copyId', 'origem']);
      const b = await backup.analisarContratoBackup(bases);
      exigir(b.valido, 'BASE_JOURNAL_NAO_CONFIRMADA');
      const repo = {
        consultar: async (id) => {
          const e = b.backupNormalizado.entradas.find((entrada) =>
            ['perfil', 'id', 'versao'].every((k) => entrada.pacote[k] === id[k])
          );
          return e && e.situacaoAdministrativa === 'ativa'
            ? { ok: true, pacote: e.pacote, digest: e.digest }
            : { ok: false };
        },
      };
      const registro = await analisarRegistro(
        texto,
        destino,
        repo,
        pacotes.reconhecerPacote,
        backup.analisarContratoBackup
      );
      return { ok: true, registro, admissaoOperacional: false, restauracaoAutorizada: false };
    } catch (e) {
      return falha(typeof e === 'string' ? e : 'CONTRATO_JOURNAL_INVALIDO');
    }
  }
  function resumo(r, observadoNoBanco = false) {
    return {
      operacao: r.id,
      estadoRegistro: r.estado,
      revisao: r.revisao,
      situacao: encerradaSemAplicacao(r)
        ? 'cancelada-sem-aplicacao'
        : r.estado === 'aplicacao-concluida'
          ? 'aplicacao-concluida'
          : r.estado === 'bloqueada'
            ? 'operacao-bloqueada'
            : 'pendente-valida',
      exigeReconciliacao: !terminalNaoPendente(r),
      ...(r.marcadores.aplicacao !== 'nao-iniciada'
        ? {
            etapas: passos(r).map((p, i) => ({
              alvo: [
                'conteudo',
                ...['principal', 'responsavel'].filter((s) =>
                  Object.hasOwn(r.atividades[0].sessoes, s)
                ),
              ][i],
              etapa: p.etapa,
              resultado: p.resultado,
              escritaIncerta: p.etapa === 'escrita-solicitada',
              resultadoPersistido: observadoNoBanco && p.etapa === 'resultado-confirmado',
            })),
          }
        : {}),
      alcance: 'atividades',
      presencaEmIndexedDBObservada: observadoNoBanco,
      atividades: r.atividades.map((a) => ({
        perfil: a.perfil,
        materia: a.materia,
        id: a.id,
        versao: a.versao,
        digest: a.digest,
        sessoes: Object.keys(a.sessoes),
      })),
    };
  }
  async function abrirJournalInterno(existente) {
    const destino = await identidade.resolverIdentidade();
    if (destino.modo !== 'persistente') return falha(destino.codigo || 'IDENTIDADE_INDISPONIVEL');
    const aberto = existente
      ? await repositorios.abrirRepositorioExistente()
      : await repositorios.abrirRepositorio();
    if (!aberto.ok) return falha(aberto.codigo);
    const repo = aberto.repositorio;
    if (aberto.copyId !== destino.copyId || aberto.origem !== destino.origem) {
      repo.fechar();
      return falha('DESTINO_ALTERADO');
    }
    let encerrado = false,
      pendente = false,
      geracao = 0;
    const vigente = (token) => !encerrado && token === geracao;
    function fechar() {
      if (!encerrado) {
        encerrado = true;
        ++geracao;
        repo.fechar();
      }
    }
    async function conferir(token) {
      if (!vigente(token)) return false;
      const atual = await identidade.resolverIdentidade(destino.copyId);
      if (!vigente(token)) return false;
      if (atual.modo !== 'persistente' || atual.origem !== destino.origem) {
        fechar();
        return false;
      }
      return true;
    }
    async function inspecionarPendencias() {
      if (arguments.length) return falha('ARGUMENTOS_INVALIDOS');
      if (encerrado) return falha('JOURNAL_FECHADO');
      if (pendente) return falha('INSPECAO_EM_ANDAMENTO');
      pendente = true;
      const token = geracao;
      try {
        if (!(await conferir(token))) return falha('IDENTIDADE_OU_OPERACAO_OBSOLETA');
        const lista = await repo.listarOperacoesJournal();
        if (!lista.ok) return falha(lista.codigo);
        if (!vigente(token)) return falha('OPERACAO_OBSOLETA');
        const registros = [],
          catalogo = new Map();
        let tamanho = 0,
          global = lista.limiteExcedido;
        for (const ref of lista.referencias) {
          const l = await repo.lerOperacaoJournal(ref);
          if (!vigente(token)) return falha('OPERACAO_OBSOLETA');
          if (!l.ok) return falha(l.codigo);
          try {
            exigir(l.registro !== undefined, 'REGISTRO_JOURNAL_INCOMPLETO');
            const texto = textoDeRegistro(l.registro);
            tamanho += new root.TextEncoder().encode(texto).byteLength;
            exigir(tamanho <= LIMITES.bytesInspecao, 'LIMITE_INSPECAO_JOURNAL');
            const r = await validarRegistro(texto, destino, repo);
            if (!vigente(token)) return falha('OPERACAO_OBSOLETA');
            registros.push(resumo(r, true));
            catalogo.set(r.id, assinatura(r));
          } catch (erro) {
            global = true;
            registros.push({
              operacao: uuid(l.registro?.id) ? l.registro.id : null,
              situacao: 'registro-bloqueado',
              codigo: codigoSeguro(erro, 'REGISTRO_JOURNAL_CORROMPIDO'),
              alcance: 'lab-inteiro',
              exigeReconciliacao: true,
            });
            if (tamanho > LIMITES.bytesInspecao) break;
          }
        }
        if (!(await conferir(token))) return falha('IDENTIDADE_OU_OPERACAO_OBSOLETA');
        const atividades = new Map(),
          conflitos = [];
        for (const r of registros)
          if (r.atividades && r.exigeReconciliacao)
            for (const a of r.atividades) {
              const id = idAtividade(a);
              if (atividades.has(id))
                conflitos.push({
                  atividade: a,
                  operacoes: [atividades.get(id).operacao, r.operacao],
                });
              else atividades.set(id, { ...a, operacao: r.operacao });
            }
        const resultado = {
          ok: true,
          destino: copiar(destino),
          registros,
          conflitos,
          atividadesBloqueadas: [...atividades.values()],
          bloqueioGlobalLab: global,
          bloqueiaRestauracao: global || registros.some((r) => r.exigeReconciliacao),
          reconciliacaoAutomatica: false,
          criacaoOperacionalDisponivel: false,
          observacaoPontual: true,
          basesDeProgressoReconciliadas: false,
        };
        if (!global && !conflitos.length) catalogos.set(resultado, catalogo);
        return resultado;
      } finally {
        pendente = false;
      }
    }
    async function inspecionarRegistro(entrada) {
      const token = geracao;
      try {
        exigir(arguments.length === 1 && !encerrado, 'JOURNAL_FECHADO');
        const r = await validarRegistro(entrada, destino, repo);
        if (!(await conferir(token))) return falha('IDENTIDADE_OU_OPERACAO_OBSOLETA');
        return { ok: true, ...resumo(r), criacaoOperacionalDisponivel: false };
      } catch (erro) {
        return falha(codigoSeguro(erro, 'REGISTRO_JOURNAL_CORROMPIDO'));
      }
    }
    async function avaliarTransicao(antes, depois) {
      const token = geracao;
      try {
        exigir(arguments.length === 2 && !encerrado, 'JOURNAL_FECHADO');
        const a = await validarRegistro(antes, destino, repo),
          b = await validarRegistro(depois, destino, repo);
        if (!(await conferir(token))) return falha('IDENTIDADE_OU_OPERACAO_OBSOLETA');
        const base = (r) => {
          const c = copiar(r);
          delete c.estado;
          delete c.revisao;
          return assinatura(c);
        };
        const coerente = encerradaSemAplicacao(b)
          ? transicaoEncerramento(a, b)
          : ehRetomada(b)
            ? transicaoRetomada(a, b)
            : ehReconciliacao(a) || ehReconciliacao(b)
              ? transicaoReconciliacao(a, b)
              : a.marcadores.aplicacao !== 'nao-iniciada' ||
                  b.marcadores.aplicacao !== 'nao-iniciada'
                ? transicaoAplicacao(a, b)
                : base(a) === base(b) && b.revisao >= a.revisao;
        return {
          ok: true,
          coerente,
          repeticao: coerente && assinatura(a) === assinatura(b),
          estadoProposto: b.estado,
          transicaoOperacionalDisponivel: false,
        };
      } catch (erro) {
        return falha(codigoSeguro(erro, 'TRANSICAO_JOURNAL_INVALIDA'));
      }
    }
    const journal = Object.freeze({
      inspecionarPendencias,
      inspecionarRegistro,
      avaliarTransicao,
      fechar,
    });
    contextos.set(journal, { repo, destino });
    return {
      ok: true,
      journal,
    };
  }
  async function abrirJournal() {
    return abrirJournalInterno(false);
  }
  // Leitura visual: nunca criar schema, mesmo se o banco sumir entre consultas.
  async function inspecionarPendenciasExistentes() {
    if (arguments.length) return falha('ARGUMENTOS_INVALIDOS');
    const a = await abrirJournalInterno(true);
    if (!a.ok) return a;
    try {
      return await a.journal.inspecionarPendencias();
    } finally {
      a.journal.fechar();
    }
  }
  async function inspecionarPendencias() {
    if (arguments.length) return falha('ARGUMENTOS_INVALIDOS');
    const a = await abrirJournal();
    if (!a.ok) return a;
    try {
      return await a.journal.inspecionarPendencias();
    } finally {
      a.journal.fechar();
    }
  }
  function fonteOriginal(entrada) {
    const l = pacotes.lerJSONBackup(entrada);
    exigir(l.valido && typeof l.fonte === 'string', 'BACKUP_INVALIDO');
    return l.fonte;
  }
  const baseComparacao = (c) =>
    assinatura({
      destino: c.destino,
      identidade: c.identidade,
      conteudo: c.conteudo,
      bases: c.bases,
    });
  async function baseConteudo(repo, comparacao) {
    const { perfil, id, versao, materia, digest } = comparacao.identidade;
    const r = await repo.consultar({ perfil, id, versao });
    exigir(r.ok, 'BASE_NAO_CONFIRMADA');
    if (comparacao.conteudo === 'ausente') {
      exigir(r.pacote === null, 'BASE_ALTERADA');
      return { pacote: undefined, admin: undefined };
    }
    exigir(
      r.pacote && r.digest === digest && r.administracao.situacao === 'ativa',
      'BASE_ALTERADA'
    );
    const v = await pacotes.validarPacote(JSON.stringify(r.pacote));
    exigir(v.valido && v.digest === digest, 'BASE_ALTERADA');
    return {
      pacote: { perfil, id, versao, materia, digest, conteudo: v.canonico },
      admin: r.administracao,
    };
  }
  const assinaturaBase = (b) => assinatura({ pacote: b.pacote ?? null, admin: b.admin ?? null });
  async function encerrarFluxo(f) {
    if (f.fase !== 'encerrada') {
      f.fase = 'encerrada';
      if (f.confirmacao) confirmacoes.delete(f.confirmacao);
      if (f.confirmacao) confirmacoesAplicacao.delete(f.confirmacao);
      if (f.confirmacao) confirmacoesReconciliacao.delete(f.confirmacao);
      if (f.confirmacao) confirmacoesRetomada.delete(f.confirmacao);
      if (f.confirmacao) confirmacoesEncerramento.delete(f.confirmacao);
      if (f.chave) gravacoes.delete(f.chave);
      f.abortador.abort();
      root.clearTimeout(f.timer);
      root.removeEventListener?.('pagehide', f.aoSair);
    }
    if (f.transacao) await f.transacao.catch(() => {});
    if (f.journal) f.journal.fechar();
    if (f.repositorioReconciliacao) f.repositorioReconciliacao.fechar();
    if (f.chaveReconciliacao) escritasReconciliacao.delete(f.chaveReconciliacao);
    if (f.coordenador) await f.coordenador.encerrar();
  }
  // Opt-in de infraestrutura. A chamada explícita é simulável pelo harness e não autentica humanos.
  async function solicitarConfirmacao(entradaOriginal) {
    let f;
    try {
      exigir(arguments.length === 1, 'ARGUMENTOS_INVALIDOS');
      const fonte = fonteOriginal(entradaOriginal);
      const v = await backup.validarBackup(fonte);
      exigir(v.valido, 'BACKUP_INVALIDO');
      exigir(v.backupNormalizado.entradas.length === 1, 'ATIVIDADE_UNICA_NECESSARIA');
      const entrada = v.backupNormalizado.entradas[0];
      exigir(entrada.situacaoAdministrativa === 'ativa', 'ADMINISTRACAO_ARQUIVADA_NAO_SUPORTADA');
      f = { fonte, entrada, fase: 'preparando', abortador: new root.AbortController() };
      f.aoSair = () => {
        void encerrarFluxo(f);
      };
      root.addEventListener?.('pagehide', f.aoSair);
      f.timer = root.setTimeout(f.aoSair, 30000);
      f.coordenador = coordenadores().criarSessao();
      const preparado = await f.coordenador.preparar();
      exigir(preparado.ok, preparado.codigo || 'IDENTIDADE_INDISPONIVEL');
      exigir(f.fase === 'preparando', 'OPERACAO_OBSOLETA');
      const adquirido = await f.coordenador.adquirirIntencao(JSON.stringify(entrada.pacote));
      exigir(adquirido.ok, adquirido.codigo || 'EXCLUSIVIDADE_INDISPONIVEL');
      f.conexao = coordenadores().conectarJournal(f.coordenador);
      exigir(f.conexao.ok && f.conexao.vigente(), 'EXCLUSIVIDADE_PERDIDA');
      f.comparacao = await restauracao().compararParaJournal(fonte, f.coordenador);
      exigir(f.comparacao.ok, f.comparacao.codigo || 'BASE_NAO_ELEGIVEL');
      const aberto = await abrirJournal();
      exigir(aberto.ok, aberto.codigo);
      f.journal = aberto.journal;
      f.repo = contextos.get(f.journal).repo;
      const j = await f.journal.inspecionarPendencias();
      exigir(
        j.ok &&
          catalogos.has(j) &&
          !j.atividadesBloqueadas.some((a) => idAtividade(a) === idAtividade(entrada.pacote)),
        'JOURNAL_NAO_LIBERADO'
      );
      exigir(catalogos.get(j).size < LIMITES.registros, 'LIMITE_JOURNAL');
      f.base = await baseConteudo(f.repo, f.comparacao);
      exigir(
        f.fase === 'preparando' &&
          restauracao().verificarComparacaoJournal(f.comparacao.referencia),
        'BASE_OU_POSSE_ALTERADA'
      );
      f.fase = 'aguarda-confirmacao';
      const previa = {
        destino: f.comparacao.destino,
        atividade: f.comparacao.identidade,
        conteudo: f.comparacao.conteudo,
        sessoes: f.comparacao.bases.map((b) => ({
          sessao: b.sessao,
          intencao: b.existe ? 'preservar' : 'criar',
        })),
        efeito: 'registrar-intencao-sem-restaurar',
        validadeMs: 30000,
      };
      return {
        ok: true,
        solicitacao: Object.freeze({
          consultar: () => ({ ok: f.fase === 'aguarda-confirmacao', previa: copiar(previa) }),
          confirmar: function () {
            if (
              arguments.length ||
              f.fase !== 'aguarda-confirmacao' ||
              !restauracao().verificarComparacaoJournal(f.comparacao.referencia)
            ) {
              void encerrarFluxo(f);
              return falha('CONFIRMACAO_OBSOLETA');
            }
            f.fase = 'confirmada';
            f.confirmacao = Object.freeze({});
            confirmacoes.set(f.confirmacao, f);
            return { ok: true, confirmacao: f.confirmacao };
          },
          cancelar: async () => {
            await encerrarFluxo(f);
            return { ok: true, intencaoPodeEstarRegistrada: !!(f.commit || f.transacao) };
          },
        }),
      };
    } catch (erro) {
      if (f) await encerrarFluxo(f);
      return falha(typeof erro === 'string' ? erro : 'PREPARACAO_JOURNAL_INCONCLUSIVA');
    }
  }
  function montarRegistro(f, comparacao) {
    const e = f.entrada,
      sessoes = {};
    for (const b of comparacao.bases)
      sessoes[b.sessao] = {
        intencao: b.existe ? 'preservar' : 'criar',
        base: { existe: b.existe, hashTexto: b.hashTexto },
        snapshot: copiar(e.sessoes[b.sessao]),
        etapa: 'nao-iniciada',
        resultado: 'nao-comprovado',
      };
    return {
      formato: 'lab-journal-v1',
      versao: 1,
      id: root.crypto.randomUUID(),
      destino: copiar(comparacao.destino),
      estado: 'intencao-registrada',
      revisao: 0,
      atividades: [
        {
          ...comparacao.identidade,
          conteudo: {
            intencao: comparacao.conteudo === 'ausente' ? 'criar' : 'preservar',
            baseDigest: comparacao.conteudo === 'ausente' ? null : e.digest,
            pacote: null, // Preenchido com a canonicalização LAB.2A antes da validação fechada.
            etapa: 'nao-iniciada',
            resultado: 'nao-comprovado',
          },
          sessoes,
        },
      ],
      marcadores: { intencao: 'registrada', aplicacao: 'nao-iniciada', efeitos: 'nao-comprovados' },
    };
  }
  async function executarGravacaoInterna(chave, registrar) {
    const f = gravacoes.get(chave);
    gravacoes.delete(chave);
    if (!f || typeof registrar !== 'function' || f.fase !== 'persistindo')
      return falha('AUTORIZACAO_OPERACIONAL_INDISPONIVEL');
    return f.conexao.autorizar(() =>
      registrar(f.registro, {
        signal: f.abortador.signal,
        vigente: () =>
          f.fase === 'persistindo' &&
          !f.abortador.signal.aborted &&
          f.conexao.vigente() &&
          restauracao().verificarComparacaoJournal(f.atual.referencia),
        conferirConteudo: (p, a) => {
          try {
            return assinaturaBase({ pacote: p, admin: a }) === assinaturaBase(f.base);
          } catch {
            return false;
          }
        },
        conferirOperacao: (r) => {
          try {
            return (
              f.catalogo.get(r.id) === assinatura(JSON.parse(textoDeRegistro(r))) &&
              (terminalNaoPendente(r) ||
                !r.atividades.some((a) => idAtividade(a) === idAtividade(f.entrada.pacote)))
            );
          } catch {
            return false;
          }
        },
        catalogoCompleto: (n) => n === f.catalogo.size && n < LIMITES.registros,
        confirmarCommit: (id) => {
          if (id === f.registro.id) f.commit = true;
        },
      })
    );
  }
  async function prepararIntencao(entradaOriginal, confirmacao) {
    const f = confirmacoes.get(confirmacao);
    if (f) {
      confirmacoes.delete(confirmacao);
      try {
        exigir(arguments.length === 2 && f.fase === 'confirmada', 'CONFIRMACAO_OBSOLETA');
        f.fase = 'persistindo';
        exigir(fonteOriginal(entradaOriginal) === f.fonte, 'BACKUP_DIFERENTE_DA_CONFIRMACAO');
        f.atual = await restauracao().compararParaJournal(f.fonte, f.coordenador);
        exigir(
          f.atual.ok && baseComparacao(f.atual) === baseComparacao(f.comparacao),
          'BASE_OU_DESTINO_ALTERADO'
        );
        const base = await baseConteudo(f.repo, f.atual);
        exigir(assinaturaBase(base) === assinaturaBase(f.base), 'BASE_ALTERADA');
        const j = await f.journal.inspecionarPendencias();
        exigir(
          j.ok &&
            catalogos.has(j) &&
            !j.atividadesBloqueadas.some((a) => idAtividade(a) === idAtividade(f.entrada.pacote)),
          'JOURNAL_NAO_LIBERADO'
        );
        f.catalogo = catalogos.get(j);
        f.registro = montarRegistro(f, f.atual);
        const p = await pacotes.validarPacote(JSON.stringify(f.entrada.pacote));
        if (f.registro.atividades[0].conteudo.intencao === 'criar')
          f.registro.atividades[0].conteudo.pacote = p.canonico;
        await validarRegistro(textoDeRegistro(f.registro), f.atual.destino, f.repo);
        const bytes = (s) => new root.TextEncoder().encode(s).byteLength;
        exigir(
          bytes(assinatura(f.registro)) +
            [...f.catalogo.values()].reduce((n, s) => n + bytes(s), 0) <=
            LIMITES.bytesInspecao,
          'LIMITE_INSPECAO_JOURNAL'
        );
        exigir(f.fase === 'persistindo', 'OPERACAO_OBSOLETA');
        f.chave = Object.freeze({});
        gravacoes.set(f.chave, f);
        f.transacao = f.repo.registrarIntencaoJournal(f.chave);
        const r = await f.transacao;
        exigir(r.ok && f.commit && f.fase === 'persistindo', r.codigo || 'COMMIT_NAO_CONFIRMADO');
        return { ok: true, ...r.resultado, restauracaoAplicada: false };
      } catch (erro) {
        return {
          ...falha(typeof erro === 'string' ? erro : 'GRAVACAO_JOURNAL_FALHOU'),
          intencaoPodeEstarRegistrada: !!(f.commit || f.transacao),
        };
      } finally {
        await encerrarFluxo(f);
      }
    }
    if (arguments.length !== 1) return falha('AUTORIZACAO_OPERACIONAL_INDISPONIVEL');
    const v = await backup.validarBackup(entradaOriginal);
    if (!v.valido) return falha('BACKUP_INVALIDO');
    return {
      ...falha('AUTORIZACAO_OPERACIONAL_INDISPONIVEL'),
      dependencias: [
        'ASSOCIACAO_EXPLICITA_AO_DESTINO',
        'AUTORIZACAO_INTERNA_SOB_EXCLUSIVIDADE',
        'RECOMPARACAO_DAS_BASES',
      ],
      registrosPersistidos: 0,
    };
  }
  function alvoAplicacao(referencia) {
    const f = permissoesComparacao.get(referencia);
    if (!f || f.fase === 'encerrada' || !f.conexao?.vigente()) return null;
    return {
      operacao: f.registro.id,
      destino: copiar(f.registro.destino),
      identidade: copiar(f.atual?.identidade || f.conexao.identidade),
    };
  }
  async function reconferirAplicacao(f) {
    exigir(f.fase !== 'encerrada' && f.conexao.vigente(), 'OPERACAO_OBSOLETA');
    const j = await f.journal.inspecionarPendencias();
    exigir(j.ok && catalogos.has(j), 'JOURNAL_NAO_LIBERADO');
    const catalogo = catalogos.get(j);
    exigir(catalogo.get(f.registro.id) === assinatura(f.registro), 'JOURNAL_ALTERADO');
    exigir(
      !j.atividadesBloqueadas.some(
        (a) => idAtividade(a) === idAtividade(f.entrada.pacote) && a.operacao !== f.registro.id
      ),
      'JOURNAL_CONFLITANTE'
    );
    const c = await restauracao().compararParaAplicacao(f.fonte, f.coordenador, f.permissao);
    exigir(c.ok, c.codigo || 'BASE_NAO_ELEGIVEL');
    if (f.comparacao) exigir(baseComparacao(c) === baseComparacao(f.comparacao), 'BASE_ALTERADA');
    const base = await baseConteudo(f.repo, c);
    if (f.base) exigir(assinaturaBase(base) === assinaturaBase(f.base), 'BASE_ALTERADA');
    const a = f.registro.atividades[0];
    exigir(
      a.conteudo.intencao !== 'preservar' || c.conteudo === 'identico',
      'BASE_PRESERVADA_AUSENTE'
    );
    for (const b of c.bases)
      exigir(a.sessoes[b.sessao].intencao !== 'preservar' || b.existe, 'BASE_PRESERVADA_AUSENTE');
    exigir(
      f.fase !== 'encerrada' && restauracao().verificarComparacaoJournal(c.referencia),
      'BASE_OU_POSSE_ALTERADA'
    );
    f.atual = c;
    f.comparacao = c;
    f.base = base;
    f.catalogo = catalogo;
  }
  async function solicitarAplicacao(original, operacao) {
    let f;
    try {
      exigir(arguments.length === 2 && uuid(operacao), 'OPERACAO_INVALIDA');
      const fonte = fonteOriginal(original),
        v = await backup.validarBackup(fonte);
      exigir(v.valido && v.backupNormalizado.entradas.length === 1, 'BACKUP_INVALIDO');
      const entrada = v.backupNormalizado.entradas[0];
      exigir(entrada.situacaoAdministrativa === 'ativa', 'ADMINISTRACAO_ARQUIVADA_NAO_SUPORTADA');
      f = {
        fonte,
        entrada,
        fase: 'preparando-aplicacao',
        abortador: new root.AbortController(),
        criadas: new Set(),
      };
      f.aoSair = () => {
        void encerrarFluxo(f);
      };
      root.addEventListener?.('pagehide', f.aoSair);
      f.timer = root.setTimeout(f.aoSair, 30000);
      const aberto = await abrirJournal();
      exigir(aberto.ok, aberto.codigo);
      f.journal = aberto.journal;
      f.repo = contextos.get(f.journal).repo;
      const j = await f.journal.inspecionarPendencias();
      exigir(j.ok && catalogos.has(j) && catalogos.get(j).has(operacao), 'JOURNAL_NAO_LIBERADO');
      f.registro = JSON.parse(catalogos.get(j).get(operacao));
      exigir(
        f.registro.estado === 'intencao-registrada' &&
          f.registro.revisao === 0 &&
          f.registro.atividades.length === 1,
        'OPERACAO_NAO_APLICAVEL'
      );
      const a = f.registro.atividades[0],
        p = entrada.pacote;
      exigir(
        ['perfil', 'materia', 'id', 'versao'].every((k) => a[k] === p[k]) &&
          a.digest === entrada.digest &&
          assinatura(Object.keys(a.sessoes).sort()) ===
            assinatura(Object.keys(entrada.sessoes).sort()) &&
          Object.keys(a.sessoes).every(
            (s) => assinatura(a.sessoes[s].snapshot) === assinatura(entrada.sessoes[s])
          ),
        'BACKUP_DIVERGENTE_DA_INTENCAO'
      );
      const vp = await pacotes.validarPacote(JSON.stringify(p));
      exigir(
        vp.valido && (a.conteudo.pacote === null || a.conteudo.pacote === vp.canonico),
        'BACKUP_DIVERGENTE_DA_INTENCAO'
      );
      f.canonico = vp.canonico;
      f.contexto = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(f.canonico);
      exigir(
        f.contexto.ok && f.contexto.digest === entrada.digest,
        'CONTEXTO_SNAPSHOT_NAO_CONFIRMADO'
      );
      f.coordenador = coordenadores().criarSessao();
      const preparado = await f.coordenador.preparar();
      exigir(preparado.ok, preparado.codigo);
      const adquirido = await f.coordenador.adquirirIntencao(f.canonico);
      exigir(adquirido.ok, adquirido.codigo);
      f.conexao = coordenadores().conectarJournal(f.coordenador);
      exigir(f.conexao.ok, f.conexao.codigo);
      f.permissao = Object.freeze({});
      permissoesComparacao.set(f.permissao, f);
      await reconferirAplicacao(f);
      exigir(f.fase === 'preparando-aplicacao', 'OPERACAO_OBSOLETA');
      f.fase = 'aguarda-aplicacao';
      const previa = {
        operacao,
        destino: f.atual.destino,
        atividade: f.atual.identidade,
        conteudo: f.atual.conteudo,
        sessoes: f.atual.bases.map((b) => ({
          sessao: b.sessao,
          efeito: b.existe ? 'preservar' : 'criar',
        })),
        efeito: 'aplicar-somente-ausentes',
      };
      return {
        ok: true,
        solicitacao: Object.freeze({
          consultar: () => ({ ok: f.fase === 'aguarda-aplicacao', previa: copiar(previa) }),
          confirmarAplicacao: function () {
            if (
              arguments.length ||
              f.fase !== 'aguarda-aplicacao' ||
              !restauracao().verificarComparacaoJournal(f.atual.referencia)
            ) {
              void encerrarFluxo(f);
              return falha('CONFIRMACAO_APLICACAO_OBSOLETA');
            }
            f.fase = 'aplicacao-confirmada';
            f.confirmacao = Object.freeze({});
            confirmacoesAplicacao.set(f.confirmacao, f);
            return { ok: true, confirmacao: f.confirmacao };
          },
          cancelar: async () => {
            await encerrarFluxo(f);
            return { ok: true, exigeInspecao: !!f.transacao };
          },
        }),
      };
    } catch (e) {
      if (f) await encerrarFluxo(f);
      return falha(typeof e === 'string' ? e : 'PREPARACAO_APLICACAO_INCONCLUSIVA');
    }
  }
  function posseAplicacao(f) {
    if (f.retomada) return f.fase === 'retomando' && reservaReconciliacao(f);
    return (
      f.fase === 'aplicando' &&
      !f.abortador.signal.aborted &&
      f.conexao.vigente() &&
      root.QuestionariosRevisoes.conferirDisponibilidadeJournal(
        f.atual.identidade && { ...f.atual.destino, ...f.atual.identidade }
      ).ok
    );
  }
  const baseAplicacaoVigente = (f) =>
    posseAplicacao(f) &&
    (f.retomada
      ? f.observacao.estavel()
      : restauracao().verificarComparacaoJournal(f.atual.referencia));
  async function executarAplicacaoInterna(referencia, executar) {
    const c = efeitosAplicacao.get(referencia);
    efeitosAplicacao.delete(referencia);
    if (!c || typeof executar !== 'function' || !posseAplicacao(c.f))
      return falha('AUTORIZACAO_APLICACAO_INVALIDA');
    const f = c.f;
    return f.conexao.autorizar(() =>
      executar({
        tipo: c.tipo,
        registro: f.registro,
        proximo: c.proximo,
        criacao: c.criacao,
        signal: f.abortador.signal,
        posse: () => posseAplicacao(f),
        vigente: () => baseAplicacaoVigente(f),
        conferirConteudo: (p, a) => {
          try {
            return f.retomada
              ? assinaturaBaseSegura(p, a) === f.observacao.baseSig
              : assinaturaBase({ pacote: p, admin: a }) === assinaturaBase(f.base);
          } catch {
            return false;
          }
        },
        conferirOperacao: (r) => {
          try {
            return (
              (f.retomada ? f.observacao.catalogo : f.catalogo).get(r.id) ===
              assinatura(JSON.parse(textoDeRegistro(r)))
            );
          } catch {
            return false;
          }
        },
        catalogoCompleto: (n) =>
          n === (f.retomada ? f.observacao.catalogo : f.catalogo).size && n <= LIMITES.registros,
        confirmarCommit: () => {
          c.completou = true;
        },
        executarSnapshot: () => {
          if (c.tipo !== 'snapshot' || !posseAplicacao(f))
            return falha('AUTORIZACAO_APLICACAO_INVALIDA');
          const chave = Object.freeze({});
          snapshotsInternos.set(chave, c);
          f.janelaProgresso = true;
          try {
            const progresso = commonJS ? require('./lab-progresso.js') : root.LabProgresso;
            return progresso.restaurarSnapshotInterno(chave);
          } finally {
            f.janelaProgresso = false;
            snapshotsInternos.delete(chave);
          }
        },
      })
    );
  }
  function executarProgressoInterno(referencia, executar) {
    const c = snapshotsInternos.get(referencia);
    snapshotsInternos.delete(referencia);
    if (
      !c ||
      c.tipo !== 'snapshot' ||
      !c.f.janelaProgresso ||
      !posseAplicacao(c.f) ||
      typeof executar !== 'function'
    )
      return falha('AUTORIZACAO_APLICACAO_INVALIDA');
    const f = c.f;
    return executar({
      sessao: c.sessao,
      snapshot: f.entrada.sessoes[c.sessao],
      contexto: f.contexto,
      identidade: { copyId: f.atual.destino.copyId, ...f.atual.identidade },
      escrever: c.escrever,
      exato: c.escrever || f.criadas.has(c.sessao),
      posse: () => posseAplicacao(f),
      vigente: () => baseAplicacaoVigente(f),
    });
  }
  async function emitirAplicacao(f, dados) {
    exigir(posseAplicacao(f), 'OPERACAO_OBSOLETA');
    const c = { ...dados, f, completou: false },
      ref = Object.freeze({});
    efeitosAplicacao.set(ref, c);
    f.transacao = f.repo.executarAplicacaoJournal(ref);
    const r = await f.transacao;
    exigir(r.ok && c.completou && posseAplicacao(f), r.codigo || 'TRANSACAO_NAO_CONFIRMADA');
    return r.resultado;
  }
  async function marcarAplicacao(f, nome, etapa, resultado) {
    await reconferirAplicacao(f);
    const proximo = copiar(f.registro);
    if (nome === 'terminal') {
      proximo.estado = 'aplicacao-concluida';
      proximo.revisao = 4;
      proximo.marcadores = {
        intencao: 'registrada',
        aplicacao: 'concluida',
        efeitos: 'verificados-por-leitura',
      };
    } else {
      proximo.estado = 'pendente';
      proximo.revisao = 1;
      proximo.marcadores.aplicacao = 'em-andamento';
      const p =
        nome === 'conteudo' ? proximo.atividades[0].conteudo : proximo.atividades[0].sessoes[nome];
      p.etapa = etapa;
      p.resultado = resultado;
    }
    exigir(transicaoAplicacao(f.registro, proximo), 'TRANSICAO_JOURNAL_INVALIDA');
    await validarRegistro(textoDeRegistro(proximo), f.atual.destino, f.repo);
    const bytes = (s) => new root.TextEncoder().encode(s).byteLength;
    exigir(
      [...f.catalogo.entries()].reduce(
        (n, [id, s]) => n + (id === proximo.id ? 0 : bytes(s)),
        bytes(assinatura(proximo))
      ) <= LIMITES.bytesInspecao,
      'LIMITE_INSPECAO_JOURNAL'
    );
    await emitirAplicacao(f, { tipo: 'marcar', proximo });
    f.registro = proximo;
  }
  async function aplicarIntencao(original, confirmacao) {
    const f = confirmacoesAplicacao.get(confirmacao);
    confirmacoesAplicacao.delete(confirmacao);
    if (!f) return falha('AUTORIZACAO_APLICACAO_INVALIDA');
    try {
      exigir(
        arguments.length === 2 && f.fase === 'aplicacao-confirmada',
        'CONFIRMACAO_APLICACAO_OBSOLETA'
      );
      f.fase = 'aplicando';
      exigir(fonteOriginal(original) === f.fonte, 'BACKUP_DIFERENTE_DA_CONFIRMACAO');
      await reconferirAplicacao(f);
      const criarConteudo = f.atual.conteudo === 'ausente';
      if (criarConteudo) {
        await marcarAplicacao(f, 'conteudo', etapas[1], 'nao-comprovado');
        await reconferirAplicacao(f);
        const i = f.atual.identidade,
          base = {
            perfil: i.perfil,
            materia: i.materia,
            id: i.id,
            versao: i.versao,
            digest: i.digest,
          };
        const criacao = {
          pacote: { ...base, conteudo: f.canonico },
          admin: { ...base, situacao: 'ativa', criadoEm: new Date().toISOString() },
        };
        await emitirAplicacao(f, { tipo: 'cadastrar', criacao });
        f.base = criacao;
        f.comparacao.conteudo = 'identico';
        await reconferirAplicacao(f); // nova transação de leitura, independente do add
        await marcarAplicacao(f, 'conteudo', etapas[2], 'criacao-observada');
      }
      await marcarAplicacao(
        f,
        'conteudo',
        etapas[3],
        criarConteudo ? 'criacao-observada' : 'base-preservada'
      );
      for (const sessao of ['principal', 'responsavel'].filter((s) =>
        Object.hasOwn(f.entrada.sessoes, s)
      )) {
        await reconferirAplicacao(f);
        const b = f.comparacao.bases.find((s) => s.sessao === sessao),
          criar = !b.existe;
        if (criar) {
          await marcarAplicacao(f, sessao, etapas[1], 'nao-comprovado');
          await reconferirAplicacao(f);
          await emitirAplicacao(f, { tipo: 'snapshot', sessao, escrever: true });
          f.criadas.add(sessao);
          const escrita = f.comparacao.bases.find((s) => s.sessao === sessao);
          escrita.existe = true;
          const digest = await root.crypto.subtle.digest(
            'SHA-256',
            new root.TextEncoder().encode(JSON.stringify(f.entrada.sessoes[sessao]))
          );
          escrita.hashTexto = Array.from(new root.Uint8Array(digest), (n) =>
            n.toString(16).padStart(2, '0')
          ).join('');
        }
        await reconferirAplicacao(f);
        await emitirAplicacao(f, { tipo: 'snapshot', sessao, escrever: false }); // leitura independente
        if (criar) await marcarAplicacao(f, sessao, etapas[2], 'criacao-observada');
        await marcarAplicacao(
          f,
          sessao,
          etapas[3],
          criar ? 'criacao-observada' : 'base-preservada'
        );
      }
      await marcarAplicacao(f, 'terminal');
      await reconferirAplicacao(f); // confirmar também o marcador terminal por nova leitura
      exigir(posseAplicacao(f), 'OPERACAO_OBSOLETA');
      return {
        ok: true,
        operacao: f.registro.id,
        estado: 'aplicacao-concluida',
        aplicacaoConcluida: true,
        retencaoPermanenteComprovada: false,
      };
    } catch (e) {
      return {
        ...falha(typeof e === 'string' ? e : 'APLICACAO_INTERROMPIDA'),
        operacao: f.registro.id,
        aplicacaoConcluida: false,
        exigeInspecao: true,
        pendenteDeReconciliacao: true,
      };
    } finally {
      await encerrarFluxo(f);
    }
  }
  const assinaturaBaseSegura = (p, a) =>
    assinatura(JSON.parse(textoDeRegistro({ pacote: p ?? null, admin: a ?? null })));
  const assinaturaCatalogo = (m) =>
    assinatura([...m.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  const nomesPassos = (r) => [
    'conteudo',
    ...['principal', 'responsavel'].filter((s) => Object.hasOwn(r.atividades[0].sessoes, s)),
  ];
  async function abrirContextoReconciliacao() {
    const destino = await identidade.resolverIdentidade();
    exigir(destino.modo === 'persistente', destino.codigo || 'IDENTIDADE_INDISPONIVEL');
    const a = await repositorios.abrirRepositorioExistente();
    exigir(a.ok, a.codigo);
    if (a.copyId !== destino.copyId || a.origem !== destino.origem) {
      a.repositorio.fechar();
      throw 'DESTINO_ALTERADO';
    }
    return { repo: a.repositorio, destino: { copyId: a.copyId, origem: a.origem } };
  }
  async function fonteReconciliacao(original) {
    if (original === undefined) return null;
    const fonte = fonteOriginal(original),
      v = await backup.validarBackup(fonte);
    exigir(v.valido && v.backupNormalizado.entradas.length === 1, 'BACKUP_INVALIDO');
    const entrada = v.backupNormalizado.entradas[0];
    exigir(entrada.situacaoAdministrativa === 'ativa', 'BACKUP_INVALIDO');
    const p = await pacotes.validarPacote(JSON.stringify(entrada.pacote));
    exigir(p.valido, 'BACKUP_INVALIDO');
    return { fonte, entrada, canonico: p.canonico };
  }
  async function lerCatalogoReconciliacao(c, operacao, origem) {
    const lista = await c.repo.listarOperacoesJournal();
    exigir(lista.ok, lista.codigo);
    exigir(!lista.limiteExcedido, 'LIMITE_INSPECAO_JOURNAL');
    const catalogo = new Map(),
      registros = [];
    let selecionado,
      tamanho = 0,
      incompativel = false;
    for (const ref of lista.referencias) {
      const l = await c.repo.lerOperacaoJournal(ref);
      exigir(l.ok, l.codigo);
      const escolhido = l.registro?.id === operacao;
      try {
        const texto = textoDeRegistro(l.registro);
        tamanho += new root.TextEncoder().encode(texto).byteLength;
        exigir(tamanho <= LIMITES.bytesInspecao, 'LIMITE_INSPECAO_JOURNAL');
        // O backup comprova apenas o payload de uma referência de preservação.
        // O estado escolar verdadeiro será lido separadamente, sem substituir o repositório.
        const validadorReferencia =
          escolhido && origem
            ? {
                consultar: async (id) => {
                  const e = origem.entrada,
                    p = e.pacote;
                  return idAtividade(id) === idAtividade(p)
                    ? { ok: true, pacote: p, digest: e.digest }
                    : { ok: false };
                },
              }
            : c.repo;
        const r = await validarRegistro(texto, c.destino, validadorReferencia);
        catalogo.set(r.id, assinatura(r));
        registros.push(r);
        if (escolhido) selecionado = r;
      } catch (e) {
        if (escolhido) throw codigoSeguro(e, 'JOURNAL_INCOMPATIVEL');
        incompativel = true;
      }
    }
    exigir(selecionado, 'OPERACAO_NAO_ENCONTRADA');
    exigir(selecionado.atividades.length === 1, 'ATIVIDADE_UNICA_NECESSARIA');
    const a = selecionado.atividades[0];
    const conflitante = registros.some(
      (r) =>
        r.id !== operacao &&
        !terminalNaoPendente(r) &&
        r.atividades.some((p) => idAtividade(p) === idAtividade(a))
    );
    return { registro: selecionado, catalogo, incompativel, conflitante };
  }
  async function entradaReconciliacao(c, r, origem) {
    const a = r.atividades[0];
    if (origem) {
      const e = origem.entrada,
        p = e.pacote;
      exigir(
        ['perfil', 'materia', 'id', 'versao'].every((k) => a[k] === p[k]) &&
          a.digest === e.digest &&
          (a.conteudo.pacote === null || a.conteudo.pacote === origem.canonico) &&
          assinatura(Object.keys(a.sessoes).sort()) === assinatura(Object.keys(e.sessoes).sort()) &&
          Object.keys(a.sessoes).every(
            (s) => assinatura(a.sessoes[s].snapshot) === assinatura(e.sessoes[s])
          ),
        'BACKUP_DIVERGENTE_DA_INTENCAO'
      );
      return origem.entrada;
    }
    let p;
    if (encerradaSemAplicacao(r)) p = JSON.parse(r.encerramento.pacote);
    else if (a.conteudo.pacote !== null) p = JSON.parse(a.conteudo.pacote);
    else {
      const v = await c.repo.consultar({ perfil: a.perfil, id: a.id, versao: a.versao });
      exigir(v.ok && v.pacote && v.digest === a.digest, 'PAYLOAD_NAO_COMPROVADO_SEM_BACKUP');
      p = v.pacote;
    }
    const sessoes = {};
    for (const s of Object.keys(a.sessoes)) sessoes[s] = copiar(a.sessoes[s].snapshot);
    const v = await backup.validarBackup(
      JSON.stringify({
        formato: 'lab-backup-v1',
        versao: 1,
        entradas: [{ pacote: p, digest: a.digest, situacaoAdministrativa: 'ativa', sessoes }],
      })
    );
    exigir(v.valido, 'SNAPSHOT_JOURNAL_INVALIDO');
    return v.backupNormalizado.entradas[0];
  }
  function leituraTexto(chave) {
    try {
      return { ok: true, texto: root.localStorage.getItem(chave) };
    } catch {
      return { ok: false };
    }
  }
  async function hashTextoRecon(texto) {
    const h = await root.crypto.subtle.digest('SHA-256', new root.TextEncoder().encode(texto));
    return Array.from(new root.Uint8Array(h), (n) => n.toString(16).padStart(2, '0')).join('');
  }
  function impedimentoEtapa(p, observado) {
    if (!observado.satisfeito) return 'EFEITO_NAO_COMPROVADO';
    const n = etapas.indexOf(p.etapa);
    if (n === 0 && !(p.intencao === 'preservar' && observado.basePreservada))
      return 'ETAPA_NAO_SOLICITADA';
    if (n > 0 && p.intencao === 'criar' && p.resultado !== 'base-preservada' && !observado.textual)
      return 'REPRESENTACAO_NAO_COMPROVADA';
    return null;
  }
  async function observarReconciliacao(c, operacao, origem) {
    let derivador;
    try {
      const j = await lerCatalogoReconciliacao(c, operacao, origem),
        r = j.registro,
        a = r.atividades[0];
      const entrada = await entradaReconciliacao(c, r, origem),
        p = entrada.pacote;
      const contexto = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(
        JSON.stringify(p)
      );
      exigir(contexto.ok && contexto.digest === a.digest, 'CONTEXTO_SNAPSHOT_NAO_CONFIRMADO');
      const id = { perfil: a.perfil, id: a.id, versao: a.versao };
      const base = await c.repo.lerBaseReconciliacao(id);
      let baseSig = null;
      if (base.ok) {
        try {
          baseSig = assinaturaBaseSegura(base.registro, base.administracao);
        } catch {
          /* Base não declarativa. */
        }
      }
      const v = base.validacao,
        presente = base.ok && v?.ok && !v.ausente,
        igual = presente && v.digest === a.digest;
      const conteudo = {
        classificacao: !base.ok
          ? 'leitura-inconclusiva'
          : !v.ok || baseSig === null
            ? 'dado-invalido-ou-corrompido'
            : v.ausente
              ? 'efeito-esperado-ausente'
              : !igual
                ? 'dado-presente-divergente'
                : a.conteudo.intencao === 'preservar'
                  ? 'base-anterior-preservada'
                  : 'efeito-esperado-presente',
        administracao: !base.ok
          ? 'nao-confirmada'
          : v.ok
            ? v.ausente
              ? 'ausente'
              : 'coerente'
            : 'inconsistente',
        satisfeito: !!igual,
        textual: !!igual,
        basePreservada: !!igual && a.conteudo.intencao === 'preservar',
        autoriaComprovadaPorIgualdade: false,
      };
      derivador = (
        commonJS ? require('./lab-progresso.js') : root.LabProgresso
      ).criarArmazenamento();
      const leituras = [],
        sessoes = [];
      for (const nome of ['principal', 'responsavel'].filter((s) => Object.hasOwn(a.sessoes, s))) {
        const canal = derivador.abrir({
          modo: 'persistente',
          sessao: nome,
          identidade: {
            copyId: c.destino.copyId,
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: a.digest,
          },
          vigente: () => false,
          autorizar: () => Promise.resolve({ ok: false }),
        });
        exigir(canal.ok, 'CHAVE_LAB_NAO_DERIVADA');
        const leitura = leituraTexto(canal.canal.chave),
          resultado = restauracao().avaliarProgressoReconciliacao(
            leitura,
            contexto,
            nome,
            entrada.sessoes[nome]
          );
        const satisfeito = resultado.estado === 'logicamente-identico';
        const basePreservada =
          satisfeito &&
          a.sessoes[nome].base.existe &&
          (await hashTextoRecon(leitura.texto)) === a.sessoes[nome].base.hashTexto;
        const classificacao = satisfeito
          ? basePreservada
            ? 'base-anterior-preservada'
            : 'efeito-esperado-presente'
          : resultado.estado === 'ausente-no-storage'
            ? 'efeito-esperado-ausente'
            : resultado.estado === 'divergente'
              ? 'dado-presente-divergente'
              : resultado.estado === 'corrompido'
                ? 'dado-invalido-ou-corrompido'
                : 'leitura-inconclusiva';
        sessoes.push({
          sessao: nome,
          classificacao,
          satisfeito,
          textual: !!resultado.igualdadeTextual,
          basePreservada: !!basePreservada,
          autoriaComprovadaPorIgualdade: false,
        });
        leituras.push({ chave: canal.canal.chave, ...leitura });
      }
      const bloqueios = [];
      if (j.incompativel) bloqueios.push('JOURNAL_INCOMPATIVEL_NO_CATALOGO');
      if (j.conflitante) bloqueios.push('OUTRA_OPERACAO_CONFLITANTE');
      const nomes = nomesPassos(r),
        observados = [conteudo, ...sessoes];
      for (let i = 0; i < nomes.length; ++i) {
        const codigo = impedimentoEtapa(passos(r)[i], observados[i]);
        if (codigo) bloqueios.push(nomes[i] + ':' + codigo);
      }
      if (!origem) bloqueios.push('BACKUP_ORIGINAL_NECESSARIO_PARA_CONFIRMAR');
      if (
        r.estado !== 'pendente' ||
        !['em-andamento', 'em-reconciliacao', 'em-retomada'].includes(r.marcadores.aplicacao)
      )
        bloqueios.push(
          r.estado === 'aplicacao-concluida'
            ? 'OPERACAO_JA_CONCLUIDA'
            : 'APLICACAO_NAO_RECONCILIAVEL'
        );
      const novamente = await c.repo.lerBaseReconciliacao(id);
      if (!base.ok || !novamente.ok) bloqueios.push('LEITURA_BASE_INCONCLUSIVA');
      else {
        let atual = null;
        try {
          atual = assinaturaBaseSegura(novamente.registro, novamente.administracao);
        } catch {
          /* Dado inválido. */
        }
        if (baseSig === null || atual !== baseSig) bloqueios.push('BASE_INSTAVEL_OU_INVALIDA');
      }
      const catalogoFinal = await lerCatalogoReconciliacao(c, operacao, origem);
      exigir(
        assinaturaCatalogo(j.catalogo) === assinaturaCatalogo(catalogoFinal.catalogo) &&
          j.incompativel === catalogoFinal.incompativel,
        'JOURNAL_ALTERADO_DURANTE_INSPECAO'
      );
      const destino = await identidade.resolverIdentidade(c.destino.copyId);
      exigir(
        destino.modo === 'persistente' && destino.origem === c.destino.origem,
        'DESTINO_ALTERADO'
      );
      const estavel = () =>
        leituras.every((l) => {
          const atual = leituraTexto(l.chave);
          return l.ok && atual.ok && atual.texto === l.texto;
        });
      if (!estavel()) bloqueios.push('PROGRESSO_INSTAVEL_OU_INCONCLUSIVO');
      const resumoPassos = nomes.map((alvo, i) => ({
        alvo,
        etapa: passos(r)[i].etapa,
        resultado: passos(r)[i].resultado,
        confirmacaoPendente: [etapas[1], etapas[2]].includes(passos(r)[i].etapa),
      }));
      const integralmenteConsistente =
        observados.every((o) => o.satisfeito) && baseSig !== null && estavel();
      const diagnostico = {
        operacao,
        destino: copiar(c.destino),
        identidade: {
          perfil: a.perfil,
          materia: a.materia,
          id: a.id,
          versao: a.versao,
          digest: a.digest,
        },
        journal: {
          integridade: 'integro',
          estado: r.estado,
          revisao: r.revisao,
          terminalObservado: r.estado === 'aplicacao-concluida',
          encerramentoSemAplicacaoObservado: encerradaSemAplicacao(r),
          ultimaEtapaConfirmada:
            resumoPassos.filter((p) => p.etapa === etapas[3]).at(-1)?.alvo || null,
          passos: resumoPassos,
        },
        conteudo,
        sessoes,
        integralmenteConsistente,
        elegivelParaConfirmacao: bloqueios.length === 0,
        bloqueios,
        backupOriginalDisponivel: !!origem,
        situacao: encerradaSemAplicacao(r)
          ? 'encerrada-sem-aplicacao'
          : integralmenteConsistente && r.estado !== 'aplicacao-concluida'
            ? 'integralmente-consistente-sem-terminal'
            : r.estado === 'aplicacao-concluida'
              ? 'terminal-observado'
              : 'pendente',
        observacaoPontual: true,
        exigeRevalidacaoSobExclusividade: true,
      };
      return {
        diagnostico,
        registro: r,
        catalogo: j.catalogo,
        baseSig,
        estavel,
        leituras,
        entrada,
      };
    } finally {
      if (derivador) derivador.encerrar();
    }
  }
  function falhaReconciliacao(e) {
    const codigo = typeof e === 'string' ? e : 'INSPECAO_RECONCILIACAO_INCONCLUSIVA';
    return {
      ...falha(codigo),
      diagnostico: {
        journal: {
          integridade:
            (codigos.has(codigo) && codigo !== 'BASE_JOURNAL_NAO_CONFIRMADA') ||
            codigo === 'JOURNAL_INCOMPATIVEL'
              ? 'incompativel'
              : 'nao-confirmada',
        },
        situacao: 'leitura-inconclusiva',
        elegivelParaConfirmacao: false,
      },
    };
  }
  function avaliarEncerramento(o) {
    const r = o.registro,
      d = o.diagnostico,
      nomes = nomesPassos(r),
      observados = [d.conteudo, ...d.sessoes];
    const encerrada = encerradaSemAplicacao(r);
    const bloqueios = d.bloqueios.filter(
      (c) =>
        c !== 'APLICACAO_NAO_RECONCILIAVEL' &&
        c !== 'BACKUP_ORIGINAL_NECESSARIO_PARA_CONFIRMAR' &&
        !nomes.some((n) =>
          ['EFEITO_NAO_COMPROVADO', 'ETAPA_NAO_SOLICITADA', 'REPRESENTACAO_NAO_COMPROVADA'].some(
            (m) => c === n + ':' + m
          )
        )
    );
    const nuncaAplicada = intencaoNuncaAplicada(r);
    if (!nuncaAplicada) bloqueios.push('APLICACAO_OU_RETOMADA_INICIADA');
    if (!encerrada && r.estado !== 'intencao-registrada') bloqueios.push('ESTADO_NAO_ENCERRAVEL');
    const bases = nomes.map((alvo, i) => {
      const p = passos(r)[i],
        v = observados[i],
        compativel =
          p.intencao === 'criar' ? v.classificacao === 'efeito-esperado-ausente' : v.basePreservada;
      if (!compativel) bloqueios.push(alvo + ':BASE_NAO_COMPROVADA_PARA_ENCERRAMENTO');
      return {
        alvo,
        intencao: p.intencao,
        etapa: p.etapa,
        classificacao: v.classificacao,
        compativel: !!compativel,
      };
    });
    return {
      elegivel: !encerrada && bloqueios.length === 0,
      basesCoerentes: bloqueios.length === 0,
      aplicacaoIniciadaOuEfeitoPossivel: !nuncaAplicada,
      efeitoEscolarPresente: observados.some(
        (v, i) => passos(r)[i].intencao === 'criar' && v.satisfeito
      ),
      dadosDivergentes: observados.some((v) => v.classificacao === 'dado-presente-divergente'),
      leituraInconclusiva: observados.some((v) => v.classificacao === 'leitura-inconclusiva'),
      exclusividade: 'exige-aquisicao-e-revalidacao',
      encaminhamento: encerrada
        ? 'historico-encerrado'
        : r.estado === 'aplicacao-concluida'
          ? 'historico-concluido'
          : d.elegivelParaConfirmacao
            ? 'reconciliacao'
            : bloqueios.length
              ? 'manter-pendencia'
              : 'confirmacao-de-encerramento',
      estado: encerrada
        ? 'encerrada-sem-aplicacao'
        : r.estado === 'aplicacao-concluida'
          ? 'ja-concluida'
          : !nuncaAplicada
            ? 'aplicacao-iniciada-ou-efeito-possivel'
            : bloqueios.length
              ? 'inconclusivo-ou-base-divergente'
              : 'elegivel-sem-aplicacao',
      nuncaAplicada,
      bases,
      bloqueios,
      consentimentoHumanoComprovado: false,
    };
  }
  function avaliarRetomada(o) {
    const r = o.registro,
      d = o.diagnostico,
      nomes = nomesPassos(r),
      observados = [d.conteudo, ...d.sessoes];
    // Só substitui os impedimentos por etapa pelos critérios de continuação abaixo.
    // Instabilidade, falha de leitura, catálogo e identidade nunca são dispensados.
    const bloqueios = d.bloqueios.filter(
      (c) =>
        c !== 'APLICACAO_NAO_RECONCILIAVEL' &&
        !nomes.some((n) =>
          ['EFEITO_NAO_COMPROVADO', 'ETAPA_NAO_SOLICITADA', 'REPRESENTACAO_NAO_COMPROVADA'].some(
            (m) => c === n + ':' + m
          )
        )
    );
    if (
      !(r.estado === 'intencao-registrada' && r.revisao === 0) &&
      !(
        r.estado === 'pendente' &&
        ['em-andamento', 'em-reconciliacao', 'em-retomada'].includes(r.marcadores.aplicacao)
      )
    )
      bloqueios.push('ESTADO_NAO_RETOMAVEL');
    const operacoes = nomes.map((alvo, i) => {
      const p = passos(r)[i],
        observado = observados[i],
        n = etapas.indexOf(p.etapa);
      let acao = 'bloqueada';
      if (p.intencao === 'preservar') {
        if (!observado.basePreservada) bloqueios.push(alvo + ':BASE_ORIGINAL_NAO_PRESERVADA');
        else acao = n === 3 ? 'ja-confirmada' : 'preservar-base';
      } else if (observado.classificacao === 'efeito-esperado-ausente') {
        if (n <= 1) acao = 'criar-ausente';
        else bloqueios.push(alvo + ':EFEITO_ANTES_OBSERVADO_AUSENTE');
      } else {
        const b = impedimentoEtapa(p, observado);
        if (b) bloqueios.push(alvo + ':' + b);
        else acao = n === 3 ? 'ja-confirmada' : 'confirmar-presenca';
      }
      return { alvo, etapa: p.etapa, acao };
    });
    const seguro = bloqueios.length === 0,
      ausentes = operacoes.filter((p) => p.acao === 'criar-ausente').length;
    return {
      seguro,
      elegivel: seguro && ausentes > 0,
      bloqueios,
      operacoes,
      encaminhamento:
        seguro && !ausentes
          ? 'reconciliacao'
          : seguro
            ? 'confirmacao-de-retomada'
            : 'manter-pendencia',
      consentimentoHumanoComprovado: false,
    };
  }
  async function inspecionarReconciliacao(operacao, original) {
    let c;
    try {
      exigir(arguments.length >= 1 && arguments.length <= 2 && uuid(operacao), 'OPERACAO_INVALIDA');
      const origem = await fonteReconciliacao(original);
      c = await abrirContextoReconciliacao();
      const r = await observarReconciliacao(c, operacao, origem);
      r.diagnostico.retomada = avaliarRetomada(r);
      r.diagnostico.encerramento = avaliarEncerramento(r);
      return { ok: true, diagnostico: copiar(r.diagnostico) };
    } catch (e) {
      return falhaReconciliacao(e);
    } finally {
      if (c) c.repo.fechar();
    }
  }
  const assinaturaObservacaoRecon = (o) =>
    assinatura({
      catalogo: assinaturaCatalogo(o.catalogo),
      base: o.baseSig,
      progresso: o.leituras.map((l) => [l.chave, l.ok, l.texto]),
    });
  function reservaReconciliacao(f) {
    return (
      f.fase !== 'encerrada' &&
      !f.abortador.signal.aborted &&
      f.conexao?.vigente() &&
      root.QuestionariosRevisoes.conferirDisponibilidadeJournal(f.conexao.identidade).ok
    );
  }
  const faseEscritaContinuacao = (f) =>
    f.encerramento ? 'encerrando-intencao' : f.retomada ? 'retomando' : 'reconciliando';
  async function reconferirReconciliacao(f, terminal = false) {
    exigir(reservaReconciliacao(f), 'RESERVA_RECONCILIACAO_INATIVA');
    const atual = await observarReconciliacao(f.contextoReconciliacao, f.operacao, f.origem);
    exigir(
      assinaturaObservacaoRecon(atual) === assinaturaObservacaoRecon(f.observacao),
      'BASE_OU_JOURNAL_ALTERADO'
    );
    exigir(
      f.encerramento
        ? terminal
          ? encerradaSemAplicacao(atual.registro) && avaliarEncerramento(atual).basesCoerentes
          : avaliarEncerramento(atual).elegivel
        : terminal
          ? atual.registro.estado === 'aplicacao-concluida' &&
            atual.diagnostico.integralmenteConsistente &&
            atual.diagnostico.bloqueios.every((c) => c === 'OPERACAO_JA_CONCLUIDA')
          : f.retomada
            ? avaliarRetomada(atual).seguro
            : atual.diagnostico.elegivelParaConfirmacao,
      'RECONCILIACAO_NAO_COMPROVADA'
    );
    const posse = await f.conexao.revalidar();
    exigir(posse.ok && reservaReconciliacao(f) && atual.estavel(), 'BASE_OU_POSSE_ALTERADA');
    f.observacao = atual;
  }
  async function solicitarReconciliacao(original, operacao) {
    if (arguments.length !== 2) return falha('OPERACAO_INVALIDA');
    return solicitarContinuacao(original, operacao, false);
  }
  async function solicitarRetomada(original, operacao) {
    if (arguments.length !== 2) return falha('OPERACAO_INVALIDA');
    return solicitarContinuacao(original, operacao, true);
  }
  async function solicitarEncerramento(original, operacao) {
    if (arguments.length !== 2) return falha('OPERACAO_INVALIDA');
    return solicitarContinuacao(original, operacao, false, true);
  }
  async function solicitarContinuacao(original, operacao, retomada, encerramento = false) {
    let f;
    try {
      exigir(uuid(operacao), 'OPERACAO_INVALIDA');
      const origem = await fonteReconciliacao(original);
      exigir(origem, 'BACKUP_ORIGINAL_NECESSARIO_PARA_CONFIRMAR');
      f = {
        origem,
        operacao,
        retomada,
        encerramento,
        fase: 'preparando-reconciliacao',
        abortador: new root.AbortController(),
      };
      f.aoSair = () => {
        void encerrarFluxo(f);
      };
      root.addEventListener?.('pagehide', f.aoSair);
      f.timer = root.setTimeout(f.aoSair, 30000);
      f.contextoReconciliacao = await abrirContextoReconciliacao();
      f.repositorioReconciliacao = f.contextoReconciliacao.repo;
      f.observacao = await observarReconciliacao(f.contextoReconciliacao, operacao, origem);
      const plano = encerramento
        ? avaliarEncerramento(f.observacao)
        : retomada
          ? avaliarRetomada(f.observacao)
          : null;
      if (plano ? !plano.elegivel : !f.observacao.diagnostico.elegivelParaConfirmacao) {
        const diagnostico = copiar(f.observacao.diagnostico);
        if (plano) diagnostico[encerramento ? 'encerramento' : 'retomada'] = plano;
        await encerrarFluxo(f);
        return {
          ...falha(
            diagnostico.journal.encerramentoSemAplicacaoObservado
              ? 'OPERACAO_JA_ENCERRADA'
              : diagnostico.journal.terminalObservado
                ? 'OPERACAO_JA_CONCLUIDA'
                : encerramento
                  ? 'ENCERRAMENTO_BLOQUEADO'
                  : retomada
                    ? plano.encaminhamento === 'reconciliacao'
                      ? 'ENCAMINHAR_RECONCILIACAO'
                      : 'RETOMADA_BLOQUEADA'
                    : 'RECONCILIACAO_BLOQUEADA'
          ),
          diagnostico,
        };
      }
      exigir(f.fase === 'preparando-reconciliacao', 'OPERACAO_OBSOLETA');
      f.coordenador = coordenadores().criarSessao();
      const preparado = await f.coordenador.prepararExistente();
      exigir(preparado.ok, preparado.codigo);
      const adquirido = await f.coordenador.adquirirIntencao(origem.canonico);
      exigir(adquirido.ok, adquirido.codigo);
      f.conexao = coordenadores().conectarJournal(f.coordenador);
      exigir(f.conexao.ok, f.conexao.codigo);
      exigir(
        f.conexao.identidade.copyId === f.contextoReconciliacao.destino.copyId &&
          f.conexao.identidade.origem === f.contextoReconciliacao.destino.origem,
        'DESTINO_ALTERADO'
      );
      await reconferirReconciliacao(f);
      if (retomada) {
        f.entrada = origem.entrada;
        f.canonico = origem.canonico;
        f.contexto = await root.QuestionariosRevisoes.criarValidadorSnapshotLab(f.canonico);
        exigir(
          f.contexto.ok && f.contexto.digest === f.entrada.digest,
          'CONTEXTO_SNAPSHOT_NAO_CONFIRMADO'
        );
        f.criadas = new Set();
        f.atual = { destino: f.contextoReconciliacao.destino, identidade: f.conexao.identidade };
        f.repo = f.repositorioReconciliacao;
        // Revalidar também após criar o contexto, antes de entregar a confirmação.
        await reconferirReconciliacao(f);
      }
      exigir(f.fase === 'preparando-reconciliacao', 'OPERACAO_OBSOLETA');
      f.fase = encerramento
        ? 'aguarda-encerramento'
        : retomada
          ? 'aguarda-retomada'
          : 'aguarda-reconciliacao';
      const previa = {
        ...copiar(f.observacao.diagnostico),
        ...(retomada ? { retomada: avaliarRetomada(f.observacao) } : {}),
        ...(encerramento ? { encerramento: avaliarEncerramento(f.observacao) } : {}),
        efeitoAdministrativo: encerramento
          ? 'encerrar-intencao-sem-aplicacao-e-sem-remocao'
          : retomada
            ? 'retomar-somente-criacoes-ausentes-autorizadas'
            : 'confirmar-journal-sem-escrita-escolar',
        consentimentoHumanoComprovado: false,
      };
      return {
        ok: true,
        solicitacao: Object.freeze({
          consultar: () => ({
            ok:
              f.fase ===
              (encerramento
                ? 'aguarda-encerramento'
                : retomada
                  ? 'aguarda-retomada'
                  : 'aguarda-reconciliacao'),
            previa: copiar(previa),
          }),
          [encerramento
            ? 'confirmarEncerramento'
            : retomada
              ? 'confirmarRetomada'
              : 'confirmarReconciliacao']: function () {
            if (
              arguments.length ||
              f.fase !==
                (encerramento
                  ? 'aguarda-encerramento'
                  : retomada
                    ? 'aguarda-retomada'
                    : 'aguarda-reconciliacao') ||
              !reservaReconciliacao(f) ||
              !f.observacao.estavel()
            ) {
              void encerrarFluxo(f);
              return falha(
                encerramento
                  ? 'CONFIRMACAO_ENCERRAMENTO_OBSOLETA'
                  : retomada
                    ? 'CONFIRMACAO_RETOMADA_OBSOLETA'
                    : 'CONFIRMACAO_RECONCILIACAO_OBSOLETA'
              );
            }
            f.fase = encerramento
              ? 'encerramento-confirmado'
              : retomada
                ? 'retomada-confirmada'
                : 'reconciliacao-confirmada';
            f.confirmacao = Object.freeze({});
            (encerramento
              ? confirmacoesEncerramento
              : retomada
                ? confirmacoesRetomada
                : confirmacoesReconciliacao
            ).set(f.confirmacao, f);
            return { ok: true, confirmacao: f.confirmacao };
          },
          cancelar: async () => {
            await encerrarFluxo(f);
            return { ok: true, exigeInspecao: !!f.transacao };
          },
        }),
      };
    } catch (e) {
      if (f) await encerrarFluxo(f);
      if (encerramento) {
        const r = falhaReconciliacao(e);
        r.diagnostico.encerramento = {
          elegivel: false,
          estado: [
            'ATIVIDADE_OCUPADA',
            'MEMORIA_LAB_EM_USO',
            'IDENTIDADE_INDISPONIVEL',
            'DESTINO_ALTERADO',
          ].includes(r.codigo)
            ? 'identidade-ou-exclusividade-indisponivel'
            : 'situacao-inconclusiva',
        };
        return r;
      }
      return falhaReconciliacao(e);
    }
  }
  async function executarReconciliacaoInterna(referencia, executar) {
    const c = escritasReconciliacao.get(referencia);
    escritasReconciliacao.delete(referencia);
    if (
      !c ||
      typeof executar !== 'function' ||
      c.f.fase !== faseEscritaContinuacao(c.f) ||
      !reservaReconciliacao(c.f)
    )
      return falha('AUTORIZACAO_RECONCILIACAO_INVALIDA');
    const f = c.f,
      o = f.observacao;
    return f.conexao.autorizar(() =>
      executar({
        registro: o.registro,
        proximo: c.proximo,
        signal: f.abortador.signal,
        vigente: () =>
          f.fase === faseEscritaContinuacao(f) && reservaReconciliacao(f) && o.estavel(),
        conferirConteudo: (p, a) => {
          try {
            return assinaturaBaseSegura(p, a) === o.baseSig;
          } catch {
            return false;
          }
        },
        conferirOperacao: (r) => {
          try {
            return o.catalogo.get(r.id) === assinatura(JSON.parse(textoDeRegistro(r)));
          } catch {
            return false;
          }
        },
        catalogoCompleto: (n) => n === o.catalogo.size && n <= LIMITES.registros,
        confirmarCommit: () => {
          c.completou = true;
        },
      })
    );
  }
  async function marcarReconciliacao(f, nome, etapa, resultado) {
    await reconferirReconciliacao(f);
    const anterior = f.observacao.registro,
      proximo = copiar(anterior);
    if (nome === 'encerramento') {
      proximo.estado = 'cancelada-sem-aplicacao';
      proximo.revisao = 5;
      proximo.encerramento = { versao: 1, efeito: 'sem-aplicacao', pacote: f.origem.canonico };
    } else if (nome === 'terminal') {
      proximo.estado = 'aplicacao-concluida';
      proximo.revisao = 4;
      proximo.marcadores = {
        intencao: 'registrada',
        aplicacao: 'concluida',
        efeitos: f.retomada ? 'verificados-por-retomada' : 'verificados-por-reconciliacao',
      };
    } else {
      proximo.estado = 'pendente';
      proximo.revisao = 1;
      proximo.marcadores.aplicacao = f.retomada ? 'em-retomada' : 'em-reconciliacao';
      if (nome !== 'autorizar-retomada') {
        const p =
          nome === 'conteudo'
            ? proximo.atividades[0].conteudo
            : proximo.atividades[0].sessoes[nome];
        p.etapa = etapa;
        p.resultado = resultado;
      }
    }
    exigir(
      (f.encerramento
        ? transicaoEncerramento
        : f.retomada
          ? transicaoRetomada
          : transicaoReconciliacao)(anterior, proximo),
      'TRANSICAO_RECONCILIACAO_INVALIDA'
    );
    await validarRegistro(
      textoDeRegistro(proximo),
      f.contextoReconciliacao.destino,
      f.repositorioReconciliacao
    );
    const bytes = (s) => new root.TextEncoder().encode(s).byteLength;
    exigir(
      [...f.observacao.catalogo.entries()].reduce(
        (n, [id, s]) => n + (id === proximo.id ? 0 : bytes(s)),
        bytes(assinatura(proximo))
      ) <= LIMITES.bytesInspecao,
      'LIMITE_INSPECAO_JOURNAL'
    );
    exigir(f.fase === faseEscritaContinuacao(f) && reservaReconciliacao(f), 'OPERACAO_OBSOLETA');
    const c = { f, proximo, completou: false };
    f.chaveReconciliacao = Object.freeze({});
    escritasReconciliacao.set(f.chaveReconciliacao, c);
    f.transacao = f.repositorioReconciliacao.confirmarReconciliacaoJournal(f.chaveReconciliacao);
    const r = await f.transacao;
    exigir(
      r.ok && c.completou && f.fase === faseEscritaContinuacao(f) && reservaReconciliacao(f),
      r.codigo || 'COMMIT_RECONCILIACAO_NAO_CONFIRMADO'
    );
    f.observacao.registro = proximo;
    f.observacao.catalogo.set(proximo.id, assinatura(proximo));
    await reconferirReconciliacao(f, nome === 'terminal' || nome === 'encerramento'); // transações independentes de leitura
  }
  async function reconciliarIntencao(original, confirmacao) {
    const f = confirmacoesReconciliacao.get(confirmacao);
    confirmacoesReconciliacao.delete(confirmacao);
    if (!f) return falha('AUTORIZACAO_RECONCILIACAO_INVALIDA');
    try {
      exigir(
        arguments.length === 2 && f.fase === 'reconciliacao-confirmada',
        'CONFIRMACAO_RECONCILIACAO_OBSOLETA'
      );
      f.fase = 'reconciliando';
      exigir(fonteOriginal(original) === f.origem.fonte, 'BACKUP_DIFERENTE_DA_CONFIRMACAO');
      await reconferirReconciliacao(f);
      for (const nome of nomesPassos(f.observacao.registro)) {
        let p =
          nome === 'conteudo'
            ? f.observacao.registro.atividades[0].conteudo
            : f.observacao.registro.atividades[0].sessoes[nome];
        if (p.etapa === etapas[3]) continue;
        if (p.etapa === etapas[0]) await marcarReconciliacao(f, nome, etapas[3], 'base-preservada');
        else {
          if (p.etapa === etapas[1])
            await marcarReconciliacao(f, nome, etapas[2], 'presenca-verificada');
          p =
            nome === 'conteudo'
              ? f.observacao.registro.atividades[0].conteudo
              : f.observacao.registro.atividades[0].sessoes[nome];
          await marcarReconciliacao(f, nome, etapas[3], p.resultado);
        }
      }
      await marcarReconciliacao(f, 'terminal');
      exigir(
        reservaReconciliacao(f) &&
          f.observacao.diagnostico.integralmenteConsistente &&
          f.observacao.registro.estado === 'aplicacao-concluida',
        'CONCLUSAO_NAO_COMPROVADA'
      );
      return {
        ok: true,
        operacao: f.operacao,
        estado: 'aplicacao-concluida',
        aplicacaoConcluida: true,
        efeitosEscolaresGravados: 0,
        autoriaInferidaPorIgualdade: false,
        retencaoPermanenteComprovada: false,
      };
    } catch (e) {
      return {
        ...falhaReconciliacao(e),
        operacao: f.operacao,
        aplicacaoConcluida: false,
        exigeInspecao: true,
      };
    } finally {
      await encerrarFluxo(f);
    }
  }
  async function retomarIntencao(original, confirmacao) {
    const f = confirmacoesRetomada.get(confirmacao);
    confirmacoesRetomada.delete(confirmacao);
    if (!f) return falha('AUTORIZACAO_RETOMADA_INVALIDA');
    const criados = [];
    try {
      exigir(
        arguments.length === 2 && f.fase === 'retomada-confirmada',
        'CONFIRMACAO_RETOMADA_OBSOLETA'
      );
      f.fase = 'retomando';
      const origem = await fonteReconciliacao(original);
      exigir(origem && origem.fonte === f.origem.fonte, 'BACKUP_DIFERENTE_DA_CONFIRMACAO');
      await reconferirReconciliacao(f);
      for (const nome of nomesPassos(f.observacao.registro)) {
        await reconferirReconciliacao(f);
        const obter = () =>
          nome === 'conteudo'
            ? f.observacao.registro.atividades[0].conteudo
            : f.observacao.registro.atividades[0].sessoes[nome];
        let p = obter();
        if (p.etapa === etapas[3]) continue;
        const d = f.observacao.diagnostico;
        const observado =
          nome === 'conteudo' ? d.conteudo : d.sessoes.find((s) => s.sessao === nome);
        if (observado.classificacao === 'efeito-esperado-ausente') {
          exigir(
            p.intencao === 'criar' && [etapas[0], etapas[1]].includes(p.etapa),
            'CRIACAO_NAO_AUTORIZADA_NA_ETAPA'
          );
          if (p.etapa === etapas[0])
            await marcarReconciliacao(f, nome, etapas[1], 'nao-comprovado');
          else if (!ehRetomada(f.observacao.registro))
            await marcarReconciliacao(f, 'autorizar-retomada');
          // escrita-solicitada é mantida: só a inspeção nova sob posse e esta confirmação
          // permitem tentar criar novamente. Ausência não é inferida de um marcador antigo.
          await reconferirReconciliacao(f);
          f.registro = f.observacao.registro;
          if (nome === 'conteudo') {
            const a = f.registro.atividades[0],
              base = {};
            for (const k of ['perfil', 'materia', 'id', 'versao', 'digest']) base[k] = a[k];
            const criacao = {
              pacote: { ...base, conteudo: f.canonico },
              admin: { ...base, situacao: 'ativa', criadoEm: new Date().toISOString() },
            };
            await emitirAplicacao(f, { tipo: 'cadastrar', criacao });
            f.observacao.baseSig = assinaturaBaseSegura(criacao.pacote, criacao.admin);
          } else {
            await emitirAplicacao(f, { tipo: 'snapshot', sessao: nome, escrever: true });
            f.criadas.add(nome);
            const i = ['principal', 'responsavel']
              .filter((s) => Object.hasOwn(f.entrada.sessoes, s))
              .indexOf(nome);
            f.observacao.leituras[i].texto = JSON.stringify(f.entrada.sessoes[nome]);
          }
          criados.push(nome);
          // Só adotamos os bytes exatos do efeito emitido. Toda outra base deve permanecer
          // idêntica; uma leitura independente compara o estado inteiro antes de avançar.
          await reconferirReconciliacao(f);
          await marcarReconciliacao(f, nome, etapas[2], 'criacao-observada');
        } else {
          if (p.etapa === etapas[0]) {
            exigir(
              p.intencao === 'preservar' && observado.basePreservada,
              'BASE_ORIGINAL_NAO_PRESERVADA'
            );
            await marcarReconciliacao(f, nome, etapas[3], 'base-preservada');
            continue;
          }
          if (p.etapa === etapas[1])
            await marcarReconciliacao(f, nome, etapas[2], 'presenca-verificada');
        }
        p = obter();
        await marcarReconciliacao(f, nome, etapas[3], p.resultado);
      }
      await marcarReconciliacao(f, 'terminal');
      exigir(
        reservaReconciliacao(f) &&
          f.observacao.diagnostico.integralmenteConsistente &&
          f.observacao.registro.estado === 'aplicacao-concluida',
        'CONCLUSAO_NAO_COMPROVADA'
      );
      return {
        ok: true,
        operacao: f.operacao,
        estado: 'aplicacao-concluida',
        aplicacaoConcluida: true,
        passosCriados: criados,
        autoriaInferidaPorIgualdade: false,
        retencaoPermanenteComprovada: false,
      };
    } catch (e) {
      return {
        ...falhaReconciliacao(e),
        operacao: f.operacao,
        aplicacaoConcluida: false,
        exigeInspecao: true,
        pendenteDeReconciliacao: true,
      };
    } finally {
      await encerrarFluxo(f);
    }
  }
  async function encerrarIntencao(original, confirmacao) {
    const f = confirmacoesEncerramento.get(confirmacao);
    confirmacoesEncerramento.delete(confirmacao);
    if (!f) return falha('AUTORIZACAO_ENCERRAMENTO_INVALIDA');
    try {
      exigir(
        arguments.length === 2 && f.fase === 'encerramento-confirmado',
        'CONFIRMACAO_ENCERRAMENTO_OBSOLETA'
      );
      f.fase = 'encerrando-intencao';
      const origem = await fonteReconciliacao(original);
      exigir(origem && origem.fonte === f.origem.fonte, 'BACKUP_DIFERENTE_DA_CONFIRMACAO');
      await reconferirReconciliacao(f);
      await marcarReconciliacao(f, 'encerramento');
      exigir(
        reservaReconciliacao(f) && encerradaSemAplicacao(f.observacao.registro),
        'ENCERRAMENTO_NAO_COMPROVADO'
      );
      return {
        ok: true,
        operacao: f.operacao,
        estado: 'cancelada-sem-aplicacao',
        encerramentoConfirmado: true,
        efeitosEscolaresGravados: 0,
        retencaoPermanenteComprovada: false,
      };
    } catch (e) {
      return {
        ...falhaReconciliacao(e),
        operacao: f.operacao,
        encerramentoConfirmado: false,
        exigeInspecao: true,
      };
    } finally {
      await encerrarFluxo(f);
    }
  }
  const api = {
    analisarContratoJournal,
    abrirJournal,
    inspecionarPendenciasExistentes,
    inspecionarPendencias,
    prepararIntencao,
    solicitarConfirmacao,
    solicitarAplicacao,
    aplicarIntencao,
    inspecionarReconciliacao,
    solicitarReconciliacao,
    reconciliarIntencao,
    solicitarRetomada,
    retomarIntencao,
    solicitarEncerramento,
    encerrarIntencao,
    LIMITES,
  };
  Object.defineProperty(api, 'executarGravacaoInterna', { value: executarGravacaoInterna });
  Object.defineProperties(api, {
    alvoAplicacao: { value: alvoAplicacao },
    executarAplicacaoInterna: { value: executarAplicacaoInterna },
    executarProgressoInterno: { value: executarProgressoInterno },
    executarReconciliacaoInterna: { value: executarReconciliacaoInterna },
  });
  Object.freeze(api);
  if (commonJS) module.exports = api;
  else root.LabJournal = api;
})(typeof window === 'undefined' ? globalThis : window);
