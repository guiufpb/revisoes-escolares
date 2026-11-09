/* global globalThis, module, require */
(function (root) {
  'use strict';
  const commonJS = typeof module !== 'undefined' && module.exports;
  const validador = commonJS ? require('./lab-validador.js') : root.LabValidador;
  const LIMITES = validador.LIMITES_BACKUP;
  const capturas = new WeakMap();
  const sessoes = ['principal', 'responsavel'];
  const copiar = (dado) => JSON.parse(JSON.stringify(dado));
  const bytes = (texto) => new root.TextEncoder().encode(texto).byteLength;
  const identidade = (p) => JSON.stringify([p.perfil, p.id, p.versao]);
  const comparar = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  function falha(codigo, caminho = '', causa = null) {
    return {
      valido: false,
      erros: [
        {
          codigo,
          caminho,
          ...(causa ? { causa } : {}),
          mensagem: 'O backup não pôde ser validado integralmente.',
        },
      ],
    };
  }
  function campos(valor, obrigatorios, opcionais = []) {
    if (
      !valor ||
      typeof valor !== 'object' ||
      Array.isArray(valor) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(valor))
    )
      return null;
    const descritores = Object.getOwnPropertyDescriptors(valor);
    const chaves = Reflect.ownKeys(descritores);
    if (
      chaves.some((k) => typeof k !== 'string' || !obrigatorios.concat(opcionais).includes(k)) ||
      obrigatorios.some((k) => !Object.hasOwn(descritores, k))
    )
      return null;
    const dados = Object.create(null);
    for (const k of chaves) {
      const d = descritores[k];
      if (!d.enumerable || !Object.hasOwn(d, 'value')) return null;
      dados[k] = d.value;
    }
    return dados;
  }
  function lista(valor, maximo, minimo = 0) {
    if (
      !Array.isArray(valor) ||
      Object.getPrototypeOf(valor) !== Array.prototype ||
      valor.length < minimo ||
      valor.length > maximo
    )
      return null;
    const d = Object.getOwnPropertyDescriptors(valor);
    if (Reflect.ownKeys(d).length !== valor.length + 1) return null;
    const resultado = [];
    for (let i = 0; i < valor.length; ++i) {
      if (!d[i] || !d[i].enumerable || !Object.hasOwn(d[i], 'value')) return null;
      resultado.push(d[i].value);
    }
    return resultado;
  }
  function ordenar(entradas) {
    return entradas.sort(
      (a, b) =>
        comparar(a.pacote.perfil, b.pacote.perfil) ||
        comparar(a.pacote.id, b.pacote.id) ||
        a.pacote.versao - b.pacote.versao
    );
  }
  async function analisarBackup(entrada, validarPacote) {
    try {
      const leitura = validador.lerJSONBackup(entrada);
      // Diagnóstico léxico não reproduz nomes/valores arbitrários da entrada.
      if (!leitura.valido) return falha(leitura.erros[0].codigo);
      const raiz = campos(leitura.valor, ['formato', 'versao', 'entradas']);
      if (!raiz) return falha('ESTRUTURA_BACKUP_INVALIDA');
      if (raiz.formato !== 'lab-backup-v1') return falha('FORMATO_BACKUP_INVALIDO');
      if (raiz.versao !== 1) return falha('VERSAO_BACKUP_INCOMPATIVEL');
      const entradas = lista(raiz.entradas, LIMITES.entradas);
      if (!entradas) return falha('ENTRADAS_BACKUP_INVALIDAS', '/entradas');
      const conferidas = [];
      for (let i = 0; i < entradas.length; ++i) {
        const local = '/entradas/' + i;
        const e = campos(entradas[i], ['pacote', 'digest', 'situacaoAdministrativa', 'sessoes']);
        if (!e) return falha('ESTRUTURA_BACKUP_INVALIDA', local);
        if (!['ativa', 'arquivada'].includes(e.situacaoAdministrativa))
          return falha('SITUACAO_BACKUP_INVALIDA', local + '/situacaoAdministrativa');
        if (typeof e.digest !== 'string' || !/^[a-f0-9]{64}$/.test(e.digest))
          return falha('DIGEST_BACKUP_INVALIDO', local + '/digest');
        const estados = campos(e.sessoes, [], sessoes);
        if (!estados) return falha('SESSOES_BACKUP_INVALIDAS', local + '/sessoes');
        conferidas.push({ e, estados, local });
      }
      const vistas = new Map();
      const normalizadas = [];
      const resumos = [];
      for (let i = 0; i < conferidas.length; ++i) {
        const { e, estados, local } = conferidas[i];
        const fonte = leitura.trechosPacotes[local + '/pacote'];
        if (!fonte) return falha('PACOTE_BACKUP_INVALIDO', local + '/pacote');
        const p = await validarPacote(fonte);
        if (!p.valido) return falha('PACOTE_BACKUP_INVALIDO', local + '/pacote', p.erros[0].codigo);
        if (bytes(p.canonico) > validador.LIMITES.bytes)
          return falha('PACOTE_BACKUP_INVALIDO', local + '/pacote', 'LIMITE_BYTES');
        if (p.digest !== e.digest) return falha('DIGEST_BACKUP_DIVERGENTE', local + '/digest');
        const id = identidade(p.pacoteNormalizado);
        if (vistas.has(id))
          return falha(
            vistas.get(id) === p.digest
              ? 'IDENTIDADE_BACKUP_REPETIDA'
              : 'IDENTIDADE_BACKUP_CONFLITANTE',
            local
          );
        vistas.set(id, p.digest);
        const nomes = sessoes.filter((nome) => Object.hasOwn(estados, nome));
        let contexto = null;
        if (nomes.length) {
          const motor = root.QuestionariosRevisoes;
          if (!motor || typeof motor.criarValidadorSnapshotLab !== 'function')
            return falha('VALIDADOR_SNAPSHOT_INDISPONIVEL', local + '/sessoes');
          // O motor revalida o pacote e deriva o vínculo; nada do backup é usado como capacidade.
          contexto = await motor.criarValidadorSnapshotLab(p.canonico);
          if (!contexto.ok || contexto.digest !== p.digest)
            return falha('CONTEXTO_SNAPSHOT_INVALIDO', local + '/sessoes');
        }
        const normalizados = {};
        const resumosSessoes = [];
        for (const nome of nomes) {
          const analise = contexto.validarSnapshot(nome, estados[nome]);
          if (!analise.ok)
            return falha('SNAPSHOT_BACKUP_INVALIDO', local + '/sessoes/' + nome, analise.codigo);
          normalizados[nome] = analise.snapshot;
          resumosSessoes.push({ sessao: nome, valido: true, ...analise.resumo });
        }
        normalizadas.push({
          pacote: p.pacoteNormalizado,
          digest: p.digest,
          situacaoAdministrativa: e.situacaoAdministrativa,
          sessoes: normalizados,
        });
        const q = p.pacoteNormalizado;
        resumos.push({
          perfil: q.perfil,
          materia: q.materia,
          id: q.id,
          versao: q.versao,
          situacaoAdministrativa: e.situacaoAdministrativa,
          pacoteValido: true,
          sessoes: resumosSessoes,
        });
      }
      ordenar(normalizadas);
      resumos.sort(
        (a, b) => comparar(a.perfil, b.perfil) || comparar(a.id, b.id) || a.versao - b.versao
      );
      const backupNormalizado = { formato: 'lab-backup-v1', versao: 1, entradas: normalizadas };
      const json = JSON.stringify(backupNormalizado);
      const tamanho = bytes(json);
      if (tamanho > LIMITES.bytes) return falha('LIMITE_BYTES');
      return {
        valido: true,
        backupNormalizado,
        json,
        bytes: tamanho,
        previa: {
          totalAtividades: normalizadas.length,
          atividades: resumos,
          restauracaoAutorizada: false,
        },
      };
    } catch {
      return falha('DADOS_BACKUP_INVALIDOS');
    }
  }
  // Fronteira operacional versionada; envelope backup-v1 preservado, sem flags de ampliação.
  async function validarBackup(entrada) {
    return analisarBackup(entrada, validador.validarPacote);
  }
  // Reconhecimento apenas em memória. O resultado não é plano, captura ou autorização.
  async function analisarContratoBackup(entrada) {
    const r = await analisarBackup(entrada, validador.reconhecerPacote);
    return r.valido ? { ...r, admissaoOperacional: false } : r;
  }
  async function inspecionarBackup(entrada) {
    const r = await validarBackup(entrada);
    return r.valido ? { valido: true, bytes: r.bytes, previa: r.previa } : r;
  }
  function guardarCaptura(dado) {
    const token = Object.freeze({});
    const copia = copiar(dado);
    capturas.set(token, copia);
    const p = copia.pacote;
    return {
      ok: true,
      captura: token,
      resumo: {
        perfil: p.perfil,
        materia: p.materia,
        id: p.id,
        versao: p.versao,
        sessao: copia.sessao,
        somenteMemoria: copia.durabilidade?.naoDuravel ?? null,
      },
    };
  }
  function capturar(handle) {
    try {
      if (arguments.length !== 1) return { ok: false, codigo: 'HANDLE_INVALIDO' };
      const motor = root.QuestionariosRevisoes;
      if (!motor || typeof motor.capturarParaBackupLab !== 'function')
        return { ok: false, codigo: 'MOTOR_LAB_INDISPONIVEL' };
      const r = motor.capturarParaBackupLab(handle);
      if (!r.ok) return { ok: false, codigo: r.codigo };
      return guardarCaptura({
        pacote: r.pacote,
        digest: r.vinculo.digest,
        sessao: r.vinculo.sessao,
        snapshot: r.snapshot,
        durabilidade: r.durabilidade,
      });
    } catch {
      return { ok: false, codigo: 'CAPTURA_LAB_INVALIDA' };
    }
  }
  async function capturarPacote(coordenador) {
    try {
      if (arguments.length !== 1 || !root.LabCoordenador)
        return { ok: false, codigo: 'SESSAO_LAB_INVALIDA' };
      const c = await root.LabCoordenador.conectarMotor(coordenador, 'principal');
      if (!c.ok) return { ok: false, codigo: c.codigo };
      if (!c.vigente()) return { ok: false, codigo: 'SESSAO_LAB_NAO_AUTORIZADA' };
      return guardarCaptura({
        pacote: c.pacote,
        digest: c.identidade.digest,
        sessao: null,
        snapshot: null,
        durabilidade: null,
      });
    } catch {
      return { ok: false, codigo: 'CAPTURA_LAB_INVALIDA' };
    }
  }
  async function construirBackup(fontes) {
    try {
      if (arguments.length !== 1) return falha('FONTES_BACKUP_INVALIDAS');
      const registros = lista(fontes, LIMITES.entradas);
      if (!registros) return falha('FONTES_BACKUP_INVALIDAS');
      const entradas = [];
      const somenteMemoria = [];
      let tamanho = bytes('{"formato":"lab-backup-v1","versao":1,"entradas":[]}');
      for (let i = 0; i < registros.length; ++i) {
        const local = '/entradas/' + i;
        const fonte = campos(registros[i], ['situacaoAdministrativa', 'capturas']);
        if (!fonte || !['ativa', 'arquivada'].includes(fonte.situacaoAdministrativa))
          return falha('FONTES_BACKUP_INVALIDAS', local);
        const tokens = lista(fonte.capturas, 3, 1);
        if (!tokens) return falha('CAPTURA_LAB_INVALIDA', local);
        let base = null;
        const estados = {};
        const vistas = new Set();
        for (const token of tokens) {
          const c = capturas.get(token);
          if (!c || vistas.has(token)) return falha('CAPTURA_LAB_INVALIDA', local);
          vistas.add(token);
          if (
            base &&
            (identidade(c.pacote) !== identidade(base.pacote) || c.digest !== base.digest)
          )
            return falha('CAPTURAS_LAB_INCOMPATIVEIS', local);
          base = c;
          if (c.sessao !== null) {
            if (Object.hasOwn(estados, c.sessao))
              return falha('SESSAO_BACKUP_REPETIDA', local + '/sessoes');
            estados[c.sessao] = c.snapshot;
            if (c.durabilidade.naoDuravel)
              somenteMemoria.push({
                perfil: c.pacote.perfil,
                id: c.pacote.id,
                versao: c.pacote.versao,
                sessao: c.sessao,
              });
          }
        }
        const e = {
          pacote: base.pacote,
          digest: base.digest,
          situacaoAdministrativa: fonte.situacaoAdministrativa,
          sessoes: estados,
        };
        tamanho += bytes(JSON.stringify(e)) + (i ? 1 : 0);
        if (tamanho > LIMITES.bytes) return falha('LIMITE_BYTES');
        entradas.push(e);
      }
      const r = await validarBackup(
        JSON.stringify({ formato: 'lab-backup-v1', versao: 1, entradas })
      );
      if (!r.valido) return r;
      somenteMemoria.sort(
        (a, b) =>
          comparar(a.perfil, b.perfil) ||
          comparar(a.id, b.id) ||
          a.versao - b.versao ||
          comparar(a.sessao, b.sessao)
      );
      return { ...r, capturasSomenteMemoria: somenteMemoria };
    } catch {
      return falha('FONTES_BACKUP_INVALIDAS');
    }
  }
  const api = Object.freeze({
    validarBackup,
    analisarContratoBackup,
    inspecionarBackup,
    capturar,
    capturarPacote,
    construirBackup,
    LIMITES,
  });
  if (commonJS) module.exports = api;
  else root.LabBackup = api;
})(typeof window === 'undefined' ? globalThis : window);
