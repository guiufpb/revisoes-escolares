/* global globalThis, module, require */
(function (root) {
  'use strict';
  const materias = [
    'gramatica',
    'matematica',
    'ciencias',
    'geografia',
    'historia',
    'ingles',
    'leitura',
  ];
  const chavePersistente = (i, sessao) =>
    `revisoesEscolares.lab.v1.${i.copyId}.${i.perfil}.${i.materia}.${i.id}.v${i.versao}.${i.digest}.${sessao}`;
  function configuracaoValida(c) {
    const i = c?.identidade;
    return (
      c &&
      Object.keys(c).sort().join(',') === 'autorizar,identidade,modo,sessao,vigente' &&
      ['persistente', 'temporario'].includes(c.modo) &&
      ['principal', 'responsavel'].includes(c.sessao) &&
      typeof c.vigente === 'function' &&
      typeof c.autorizar === 'function' &&
      i &&
      Object.keys(i).sort().join(',') === 'copyId,digest,id,materia,perfil,versao' &&
      ['alice', 'mariana'].includes(i.perfil) &&
      materias.includes(i.materia) &&
      typeof i.id === 'string' &&
      /^[a-z][a-z0-9-]{0,63}$/.test(i.id) &&
      Number.isInteger(i.versao) &&
      i.versao >= 1 &&
      i.versao <= 9999 &&
      typeof i.digest === 'string' &&
      /^[a-f0-9]{64}$/.test(i.digest) &&
      (c.modo === 'temporario'
        ? i.copyId === null
        : typeof i.copyId === 'string' && /^[a-f0-9]{64}$/.test(i.copyId))
    );
  }
  // Transporte de snapshots JSON opacos. Não normaliza respostas ou pontuação.
  function serializar(estado) {
    let nos = 0;
    const vistos = new Set();
    function visitar(valor, nivel) {
      if (++nos > 10000 || nivel > 16) throw new Error('limite');
      if (typeof valor === 'string' && valor.length > 262144) throw new Error('limite');
      if (valor === null || typeof valor === 'boolean' || typeof valor === 'string')
        return JSON.stringify(valor);
      if (typeof valor === 'number' && Number.isFinite(valor)) return JSON.stringify(valor);
      if (!valor || typeof valor !== 'object' || vistos.has(valor)) throw new Error('tipo');
      const array = Array.isArray(valor);
      if (array && valor.length > 10000) throw new Error('limite');
      if (!array && ![Object.prototype, null].includes(Object.getPrototypeOf(valor)))
        throw new Error('objeto');
      vistos.add(valor);
      const descritores = Object.getOwnPropertyDescriptors(valor);
      if (
        Object.getOwnPropertySymbols(valor).length ||
        Object.keys(descritores).length !== (array ? valor.length + 1 : Object.keys(valor).length)
      )
        throw new Error('propriedades');
      const keys = array
        ? Array.from({ length: valor.length }, (_, i) => String(i))
        : Object.keys(valor);
      if (keys.length > 10000) throw new Error('limite');
      const partes = keys.map((k) => {
        const d = descritores[k];
        if (!d || !Object.hasOwn(d, 'value')) throw new Error('acessor');
        const texto = visitar(d.value, nivel + 1);
        return array ? texto : JSON.stringify(k) + ':' + texto;
      });
      vistos.delete(valor);
      return array ? '[' + partes.join(',') + ']' : '{' + partes.join(',') + '}';
    }
    if (!estado || typeof estado !== 'object' || Array.isArray(estado)) throw new Error('raiz');
    const texto = visitar(estado, 1);
    if (texto.length > 262144 || new root.TextEncoder().encode(texto).byteLength > 262144)
      throw new Error('limite');
    return texto;
  }
  function erroArmazenamento(erro, etapa) {
    if (erro?.name === 'SecurityError') return 'ACESSO_BLOQUEADO';
    if (erro?.name === 'QuotaExceededError') return 'QUOTA_EXCEDIDA';
    return etapa === 'leitura' ? 'LEITURA_FALHOU' : 'ESCRITA_FALHOU';
  }

  function criarArmazenamento() {
    const slots = new Map();
    let fechado = false;
    function abrir(c) {
      if (fechado) return { ok: false, codigo: 'ARMAZENAMENTO_ENCERRADO' };
      if (!configuracaoValida(c)) return { ok: false, codigo: 'CONFIGURACAO_INVALIDA' };
      const { modo, sessao, autorizar, vigente } = c;
      const i = { ...c.identidade };
      const chave = modo === 'persistente' ? chavePersistente(i, sessao) : null;
      const indice = JSON.stringify([
        modo,
        i.copyId,
        i.perfil,
        i.materia,
        i.id,
        i.versao,
        i.digest,
        sessao,
      ]);
      if (!slots.has(indice))
        slots.set(indice, {
          texto: undefined,
          base: undefined,
          baseConhecida: false,
          sujo: false,
          conflito: false,
          pendente: false,
          revisao: 0,
          ultima: { durabilidade: 'nao-verificada', codigo: null },
        });
      const slot = slots.get(indice);
      function resultado(
        ok,
        durabilidade,
        codigo = null,
        aceitaPeloNavegador = null,
        etapa = null
      ) {
        const meta = { ok, durabilidade, codigo, aceitaPeloNavegador, etapa };
        if (!fechado) slot.ultima = meta;
        return {
          ...meta,
          estado: !fechado && slot.texto !== undefined ? JSON.parse(slot.texto) : null,
        };
      }
      const obterDurabilidade = () => ({
        ...slot.ultima,
        encerrado: fechado,
        pendente: slot.pendente,
      });
      function lerPersistido(storage) {
        try {
          return { ok: true, texto: storage.getItem(chave) };
        } catch (e) {
          return { ok: false, codigo: erroArmazenamento(e, 'leitura') };
        }
      }
      function obterStorage() {
        try {
          const storage = root.localStorage;
          return storage
            ? { ok: true, storage }
            : { ok: false, codigo: 'ARMAZENAMENTO_INDISPONIVEL' };
        } catch (e) {
          return {
            ok: false,
            codigo: e?.name === 'SecurityError' ? 'ACESSO_BLOQUEADO' : 'ACESSO_FALHOU',
          };
        }
      }
      async function operar(operacao, novoTexto) {
        if (fechado) return resultado(false, 'encerrado', 'ARMAZENAMENTO_ENCERRADO');
        if (!vigente()) return resultado(false, 'suspenso', 'CANAL_INATIVO');
        if (novoTexto !== undefined) {
          slot.texto = novoTexto;
          slot.sujo = true;
          ++slot.revisao;
        }
        if (slot.pendente)
          return resultado(
            false,
            'memoria',
            'OPERACAO_EM_ANDAMENTO',
            operacao === 'gravacao' ? false : null
          );
        slot.pendente = true;
        const revisao = slot.revisao;
        const textoEsperado = slot.texto;
        const gravar = operacao === 'gravacao';
        let realizada = null;
        try {
          if (gravar && slot.texto === undefined)
            return resultado(false, 'memoria', 'SEM_ESTADO_EM_MEMORIA');
          if (modo === 'temporario') return resultado(true, 'memoria', null, gravar ? false : null);
          // Memória suja é autoritativa; carregar não pode trazer de volta o valor antigo.
          if (!gravar && slot.sujo) return resultado(true, 'memoria', slot.ultima.codigo);
          const executarIO = () => {
            if (fechado || !vigente()) return resultado(false, 'suspenso', 'CANAL_INATIVO');
            if (slot.revisao !== revisao)
              return resultado(false, 'memoria', 'ESTADO_SUBSTITUIDO', false);
            const acesso = obterStorage();
            if (!acesso.ok)
              return resultado(false, 'memoria', acesso.codigo, gravar ? false : null, 'acesso');
            if (fechado || !vigente()) return resultado(false, 'suspenso', 'CANAL_INATIVO');
            const leitura = lerPersistido(acesso.storage);
            if (!leitura.ok)
              return resultado(false, 'memoria', leitura.codigo, gravar ? false : null, 'leitura');
            const atual = leitura.texto;
            if (
              slot.conflito ||
              (slot.baseConhecida && atual !== slot.base) ||
              (!slot.baseConhecida && gravar && atual !== null)
            ) {
              slot.conflito = true;
              return resultado(
                false,
                'conflito',
                'CONFLITO_PERSISTIDO',
                gravar ? false : null,
                'comparacao'
              );
            }
            if (!gravar) {
              if (atual !== null) {
                try {
                  if (atual.length > 262144) throw new Error('limite');
                  serializar(JSON.parse(atual)); // Somente transporte JSON; motor validará significado.
                } catch {
                  return resultado(
                    false,
                    'memoria',
                    'DADOS_PERSISTIDOS_INVALIDOS',
                    null,
                    'leitura'
                  );
                }
              }
              slot.base = atual;
              slot.baseConhecida = true;
              slot.texto = atual === null ? undefined : atual;
              return resultado(true, atual === null ? 'ausente' : 'persistido-lido');
            }
            if (slot.texto === undefined)
              return resultado(false, 'memoria', 'SEM_ESTADO_EM_MEMORIA');
            // Base só é estabelecida aqui se não havia progresso persistido.
            slot.base = atual;
            slot.baseConhecida = true;
            if (fechado || !vigente()) return resultado(false, 'suspenso', 'CANAL_INATIVO', false);
            if (slot.revisao !== revisao)
              return resultado(false, 'memoria', 'ESTADO_SUBSTITUIDO', false);
            try {
              acesso.storage.setItem(chave, textoEsperado);
            } catch (e) {
              return resultado(false, 'memoria', erroArmazenamento(e, 'escrita'), false, 'escrita');
            }
            slot.base = textoEsperado;
            slot.sujo = slot.revisao !== revisao;
            return resultado(true, 'gravacao-aceita', null, true, 'escrita');
          };
          const autorizado = await autorizar(() => {
            realizada = executarIO();
            return realizada;
          });
          // O callback é síncrono. Não conceder uma permissão reutilizável depois do await.
          if (fechado)
            return resultado(
              false,
              'encerrado',
              'ARMAZENAMENTO_ENCERRADO',
              realizada?.aceitaPeloNavegador ?? null
            );
          if (slot.revisao !== revisao)
            return resultado(
              false,
              'memoria',
              'ESTADO_SUBSTITUIDO',
              realizada?.aceitaPeloNavegador ?? false
            );
          if (realizada) return realizada;
          if (!autorizado.ok)
            return resultado(
              false,
              'suspenso',
              autorizado.codigo,
              realizada?.aceitaPeloNavegador ?? (gravar ? false : null),
              'autorizacao'
            );
          return resultado(
            false,
            'suspenso',
            'AUTORIZACAO_FALHOU',
            gravar ? false : null,
            'autorizacao'
          );
        } catch {
          return resultado(
            false,
            fechado ? 'encerrado' : 'memoria',
            'AUTORIZACAO_FALHOU',
            gravar ? false : null,
            'autorizacao'
          );
        } finally {
          slot.pendente = false;
        }
      }
      async function salvar(estado) {
        if (fechado || !vigente())
          return resultado(
            false,
            fechado ? 'encerrado' : 'suspenso',
            fechado ? 'ARMAZENAMENTO_ENCERRADO' : 'CANAL_INATIVO'
          );
        let texto;
        try {
          texto = serializar(estado);
        } catch {
          return resultado(false, 'memoria', 'ESTADO_INVALIDO');
        }
        return operar('gravacao', texto);
      }
      async function carregar() {
        // Canal invalidado pode inspecionar sua memória, mas nunca reler o navegador.
        if (!fechado && !vigente()) return resultado(false, 'suspenso', 'CANAL_INATIVO');
        return operar('leitura');
      }
      const tentarPersistir = () => operar('gravacao');
      return {
        ok: true,
        canal: Object.freeze({ chave, carregar, salvar, tentarPersistir, obterDurabilidade }),
      };
    }
    function encerrar() {
      if (fechado) return;
      fechado = true;
      for (const slot of slots.values()) {
        slot.texto = undefined;
        slot.base = undefined;
        slot.ultima = { ok: false, durabilidade: 'encerrado', codigo: 'ARMAZENAMENTO_ENCERRADO' };
      }
      slots.clear();
    }
    return Object.freeze({ abrir, encerrar });
  }
  // Somente o journal pode emitir a referência, e só a consome dentro da janela nativa
  // protegida pelo repositório. Nunca recebe chave arbitrária nem toca no cache do motor.
  function restaurarSnapshotInterno(referencia) {
    const journal =
      typeof module !== 'undefined' && module.exports
        ? require('./lab-journal.js')
        : root.LabJournal;
    if (arguments.length !== 1 || !journal)
      return { ok: false, codigo: 'AUTORIZACAO_APLICACAO_INVALIDA' };
    return journal.executarProgressoInterno(referencia, (c) => {
      let solicitada = false,
        aceita = false,
        etapa = 'leitura';
      try {
        const v = c.contexto.validarSnapshot(c.sessao, c.snapshot);
        if (!v.ok || c.contexto.digest !== c.identidade.digest)
          return { ok: false, codigo: 'SNAPSHOT_INVALIDO' };
        const texto = serializar(v.snapshot),
          chave = chavePersistente(c.identidade, c.sessao);
        if (!c.vigente()) return { ok: false, codigo: 'OPERACAO_OBSOLETA' };
        const storage = root.localStorage;
        const base = storage.getItem(chave);
        if (c.escrever) {
          if (base !== null || !c.vigente()) return { ok: false, codigo: 'PROGRESSO_JA_EXISTENTE' };
          solicitada = true;
          etapa = 'escrita';
          storage.setItem(chave, texto);
          aceita = true;
        }
        etapa = 'leitura';
        const posterior = storage.getItem(chave);
        if (
          !c.posse() ||
          posterior === null ||
          posterior.length > 262144 ||
          new root.TextEncoder().encode(posterior).byteLength > 262144 ||
          (c.exato && posterior !== texto) ||
          (c.escrever && posterior !== texto)
        )
          return { ok: false, codigo: 'LEITURA_NAO_CONFIRMADA', escritaSolicitada: solicitada };
        const parser =
          typeof module !== 'undefined' && module.exports
            ? require('./lab-validador.js')
            : root.LabValidador;
        const l = parser.lerJSONBackup(posterior);
        const verificado = l.valido && c.contexto.validarSnapshot(c.sessao, l.valor);
        if (!verificado?.ok || serializar(verificado.snapshot) !== texto)
          return { ok: false, codigo: 'SNAPSHOT_DIVERGENTE', escritaSolicitada: solicitada };
        return {
          ok: true,
          escritaSolicitada: solicitada,
          aceitaPeloNavegador: c.escrever ? true : null,
          leituraConferida: true,
          retencaoPermanenteComprovada: false,
        };
      } catch (e) {
        return {
          ok: false,
          codigo: erroArmazenamento(e, etapa),
          escritaSolicitada: solicitada,
          aceitaPeloNavegador: aceita,
        };
      }
    });
  }
  // Só presença para a listagem, sem canal, sessão, parse, reparação ou escrita.
  function consultarPresenca(identidade) {
    if (
      !configuracaoValida({
        identidade,
        modo: 'persistente',
        sessao: 'principal',
        vigente: () => true,
        autorizar: () => false,
      })
    )
      return { ok: false };
    try {
      return {
        ok: true,
        existe: root.localStorage.getItem(chavePersistente(identidade, 'principal')) !== null,
      };
    } catch {
      return { ok: false };
    }
  }
  const api = { criarArmazenamento, consultarPresenca };
  Object.defineProperty(api, 'restaurarSnapshotInterno', { value: restaurarSnapshotInterno });
  Object.freeze(api);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabProgresso = api;
})(typeof window === 'undefined' ? globalThis : window);
