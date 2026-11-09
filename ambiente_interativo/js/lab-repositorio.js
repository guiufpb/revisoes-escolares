/* global globalThis, module, require */
(function (root) {
  'use strict';

  const commonJS = typeof module !== 'undefined' && module.exports;
  const identidade = commonJS ? require('./lab-identidade.js') : root.LabIdentidade;
  const validador = commonJS ? require('./lab-validador.js') : root.LabValidador;
  const STORES = ['administracao', 'operacoes', 'pacotes'];
  const CHAVE = ['perfil', 'id', 'versao'];
  const TIMEOUT_MS = 3000;
  const mensagens = {
    IDENTIDADE_INDISPONIVEL: 'Não foi possível confirmar a cópia local.',
    IDENTIDADE_ALTERADA: 'A cópia ou a origem mudou. Abra novamente a cópia desejada.',
    REPOSITORIO_FECHADO: 'O repositório está fechado ou suspenso.',
    INDEXEDDB_INDISPONIVEL: 'O armazenamento persistente não está disponível.',
    BANCO_BLOQUEADO: 'Outra conexão está bloqueando a abertura do banco.',
    VERSAO_INCOMPATIVEL: 'A versão ou a estrutura do banco não é compatível.',
    ARMAZENAMENTO_QUOTA: 'O armazenamento está sem espaço disponível.',
    TRANSACAO_FALHOU: 'A transação não foi concluída. Os dados anteriores foram preservados.',
    ARMAZENAMENTO_TIMEOUT: 'O armazenamento não respondeu no prazo esperado.',
    PACOTE_INVALIDO: 'O pacote não atende ao contrato LAB.',
    IDENTIFICADOR_INVALIDO: 'Informe perfil, ID e versão válidos.',
    PERFIL_INVALIDO: 'O perfil não é válido.',
    CONFLITO_DIGEST: 'Este ID e versão já possuem outro conteúdo. Use uma versão nova.',
    DADOS_INVALIDOS: 'Há dados persistidos inconsistentes. Nenhum dado foi reparado ou apagado.',
  };
  const falha = (codigo, extra = {}) => ({
    ok: false,
    codigo,
    mensagem: mensagens[codigo],
    ...extra,
  });
  function codigoErro(erro) {
    if (erro && erro.name === 'QuotaExceededError') return 'ARMAZENAMENTO_QUOTA';
    if (erro && erro.name === 'VersionError') return 'VERSAO_INCOMPATIVEL';
    if (erro && erro.name === 'SecurityError') return 'INDEXEDDB_INDISPONIVEL';
    return 'TRANSACAO_FALHOU';
  }
  const perfilValido = (perfil) => perfil === 'alice' || perfil === 'mariana';
  const chave = (valor) => CHAVE.map((k) => valor[k]);
  const campos = (valor, esperados) =>
    valor &&
    typeof valor === 'object' &&
    !Array.isArray(valor) &&
    Object.keys(valor).sort().join(',') === esperados.slice().sort().join(',');
  function identificadorValido(valor) {
    return (
      campos(valor, CHAVE) &&
      perfilValido(valor.perfil) &&
      typeof valor.id === 'string' &&
      /^[a-z][a-z0-9-]{0,63}$/.test(valor.id) &&
      Number.isInteger(valor.versao) &&
      valor.versao >= 1 &&
      valor.versao <= 9999
    );
  }
  function estruturaValida(db) {
    if (db.version !== 1 || Array.from(db.objectStoreNames).sort().join(',') !== STORES.join(','))
      return false;
    const tx = db.transaction(STORES, 'readonly');
    return STORES.every((nome) => {
      const store = tx.objectStore(nome);
      if (store.autoIncrement) return false;
      if (nome === 'operacoes') return store.keyPath === 'id' && store.indexNames.length === 0;
      if (JSON.stringify(store.keyPath) !== JSON.stringify(CHAVE)) return false;
      if (Array.from(store.indexNames).sort().join(',') !== 'perfil,perfilMateria') return false;
      return (
        store.index('perfil').keyPath === 'perfil' &&
        !store.index('perfil').unique &&
        JSON.stringify(store.index('perfilMateria').keyPath) === '["perfil","materia"]' &&
        !store.index('perfilMateria').unique
      );
    });
  }

  function abrirBanco(nome, existente = false) {
    return new Promise((resolve) => {
      let encerrado = false;
      let pedido;
      const concluir = (resultado) => {
        if (encerrado) return;
        encerrado = true;
        root.clearTimeout(timer);
        resolve(resultado);
      };
      const timer = root.setTimeout(() => concluir(falha('ARMAZENAMENTO_TIMEOUT')), TIMEOUT_MS);
      try {
        pedido = existente ? root.indexedDB.open(nome) : root.indexedDB.open(nome, 1);
        pedido.onupgradeneeded = (evento) => {
          if (existente || encerrado || evento.oldVersion !== 0) {
            pedido.transaction.abort();
            return;
          }
          for (const storeNome of ['pacotes', 'administracao']) {
            const store = pedido.result.createObjectStore(storeNome, { keyPath: CHAVE });
            store.createIndex('perfil', 'perfil');
            store.createIndex('perfilMateria', ['perfil', 'materia']);
          }
          pedido.result.createObjectStore('operacoes', { keyPath: 'id' });
        };
        pedido.onblocked = () => concluir(falha('BANCO_BLOQUEADO'));
        pedido.onerror = () => concluir(falha(codigoErro(pedido.error)));
        pedido.onsuccess = () => {
          const db = pedido.result;
          if (encerrado) {
            db.close();
            return;
          }
          try {
            if (!estruturaValida(db)) {
              db.close();
              concluir(falha('VERSAO_INCOMPATIVEL'));
              return;
            }
            concluir({ ok: true, db });
          } catch {
            db.close();
            concluir(falha('VERSAO_INCOMPATIVEL'));
          }
        };
      } catch (erro) {
        concluir(falha(codigoErro(erro)));
      }
    });
  }

  // Não usar await dentro de transação IDB: emitir pedidos nos callbacks síncronos.
  function transacionar(db, modo, emitir, stores = ['pacotes', 'administracao']) {
    return new Promise((resolve) => {
      let tx;
      let resultado;
      let aoConfirmar;
      let falhou;
      let finalizado = false;
      const concluir = (valor) => {
        if (finalizado) return;
        finalizado = true;
        root.clearTimeout(timer);
        resolve(valor);
      };
      const timer = root.setTimeout(() => {
        falhou ||= falha('ARMAZENAMENTO_TIMEOUT');
        try {
          tx.abort();
        } catch {
          concluir(falhou);
        }
      }, TIMEOUT_MS);
      try {
        tx = db.transaction(stores, modo);
        tx.oncomplete = () => {
          if (aoConfirmar) aoConfirmar();
          concluir(falhou || { ok: true, resultado });
        };
        tx.onabort = () => concluir(falhou || falha(codigoErro(tx.error)));
        tx.onerror = (evento) => {
          falhou ||= falha(codigoErro(evento.target.error));
        };
        const controle = {
          aoConfirmar: (acao) => {
            aoConfirmar = acao;
          },
          concluir: (valor) => {
            resultado = valor;
          },
          recusar: (codigo) => {
            falhou ||= falha(codigo);
            tx.abort();
          },
        };
        emitir(tx, controle);
      } catch (erro) {
        falhou ||= falha(codigoErro(erro));
        try {
          tx.abort();
        } catch {
          concluir(falhou);
        }
      }
    });
  }

  function lerPar(db, id) {
    return transacionar(db, 'readonly', (tx, controle) => {
      const r = tx.objectStore('pacotes').get(chave(id));
      const a = tx.objectStore('administracao').get(chave(id));
      a.onsuccess = () => controle.concluir({ registro: r.result, admin: a.result });
    });
  }

  async function validarPar(registro, admin) {
    if (registro === undefined && admin === undefined) return { ok: true, ausente: true };
    if (
      !campos(registro, [...CHAVE, 'materia', 'digest', 'conteudo']) ||
      !campos(admin, [...CHAVE, 'materia', 'digest', 'situacao', 'criadoEm']) ||
      typeof registro.conteudo !== 'string' ||
      admin.situacao !== 'ativa' ||
      typeof admin.criadoEm !== 'string' ||
      !Number.isFinite(Date.parse(admin.criadoEm))
    )
      return falha('DADOS_INVALIDOS');
    const validacao = await validador.validarPacote(registro.conteudo);
    if (!validacao.valido) return falha('DADOS_INVALIDOS');
    const p = validacao.pacoteNormalizado;
    if (
      registro.conteudo !== validacao.canonico ||
      registro.digest !== validacao.digest ||
      admin.digest !== validacao.digest ||
      [...CHAVE, 'materia'].some((k) => registro[k] !== p[k] || admin[k] !== p[k])
    )
      return falha('DADOS_INVALIDOS');
    return { ok: true, ausente: false, pacote: p, digest: validacao.digest, administracao: admin };
  }

  async function abrirRepositorioInterno(existente) {
    const escopo = await identidade.resolverIdentidade();
    if (escopo.modo !== 'persistente')
      return falha('IDENTIDADE_INDISPONIVEL', { modo: 'temporario', motivo: escopo.codigo });
    const nome = 'revisoesEscolares.lab.' + escopo.copyId + '.v1';
    if (existente) {
      let timer;
      try {
        if (typeof root.indexedDB.databases !== 'function')
          return falha('INSPECAO_EXISTENCIA_INDISPONIVEL');
        const lista = await Promise.race([
          root.indexedDB.databases(),
          new Promise((resolve) => {
            timer = root.setTimeout(() => resolve(null), TIMEOUT_MS);
          }),
        ]);
        if (lista === null) return falha('ARMAZENAMENTO_TIMEOUT');
        if (!lista.some((b) => b.name === nome)) return falha('BANCO_LAB_AUSENTE');
      } catch (e) {
        return falha(codigoErro(e));
      } finally {
        root.clearTimeout(timer);
      }
    }
    const banco = await abrirBanco(nome, existente);
    if (!banco.ok) return { ...banco, modo: 'temporario' };
    const db = banco.db;
    let fechado = false;
    const referenciasJournal = new WeakMap();
    const fechar = () => {
      fechado = true;
      db.close();
    };
    db.onversionchange = fechar;
    db.onclose = () => {
      fechado = true;
    };
    async function conferir() {
      if (fechado) return falha('REPOSITORIO_FECHADO');
      const atual = await identidade.resolverIdentidade(escopo.copyId);
      if (fechado) return falha('REPOSITORIO_FECHADO');
      if (atual.modo !== 'persistente' || atual.origem !== escopo.origem) {
        fechar();
        return falha(
          atual.codigo === 'IDENTIDADE_ALTERADA' || (atual.origem && atual.origem !== escopo.origem)
            ? 'IDENTIDADE_ALTERADA'
            : 'IDENTIDADE_INDISPONIVEL'
        );
      }
      return { ok: true };
    }
    async function cadastrar(entrada) {
      if (fechado) return falha('REPOSITORIO_FECHADO');
      const v = await validador.validarPacote(entrada);
      if (!v.valido) return falha('PACOTE_INVALIDO', { erros: v.erros, truncado: v.truncado });
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const p = v.pacoteNormalizado;
      const existente = await lerPar(db, p);
      if (!existente.ok) return existente;
      const par = await validarPar(existente.resultado.registro, existente.resultado.admin);
      if (!par.ok) return par;
      if (!par.ausente && par.digest !== v.digest) return falha('CONFLITO_DIGEST');
      // A validação acima é assíncrona. Reconfirmar a cópia antes de gravar.
      const reconfirmado = await conferir();
      if (!reconfirmado.ok) return reconfirmado;
      const transacao = await transacionar(db, 'readwrite', (tx, controle) => {
        const store = tx.objectStore('pacotes');
        const admins = tx.objectStore('administracao');
        const r = store.get(chave(p));
        const a = admins.get(chave(p));
        a.onsuccess = () => {
          // Comparar o snapshot revalidado: nenhuma sobrescrita, mesmo se outra aba mudou dados.
          if (
            JSON.stringify(r.result) !== JSON.stringify(existente.resultado.registro) ||
            JSON.stringify(a.result) !== JSON.stringify(existente.resultado.admin)
          ) {
            controle.recusar('TRANSACAO_FALHOU');
            return;
          }
          if (par.ausente) {
            const base = {
              perfil: p.perfil,
              id: p.id,
              versao: p.versao,
              materia: p.materia,
              digest: v.digest,
            };
            try {
              store.add({ ...base, conteudo: v.canonico });
              admins.add({ ...base, situacao: 'ativa', criadoEm: new Date().toISOString() });
            } catch (erro) {
              controle.recusar(codigoErro(erro));
              return;
            }
          }
          controle.concluir({
            criado: par.ausente,
            digest: v.digest,
            identidade: { perfil: p.perfil, id: p.id, versao: p.versao },
          });
        };
      });
      return transacao.ok ? { ok: true, ...transacao.resultado } : transacao;
    }
    async function consultar(id) {
      if (!identificadorValido(id)) return falha('IDENTIFICADOR_INVALIDO');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const leitura = await lerPar(db, id);
      if (!leitura.ok) return leitura;
      const par = await validarPar(leitura.resultado.registro, leitura.resultado.admin);
      return par.ok && par.ausente ? { ok: true, pacote: null } : par;
    }
    async function lerBaseReconciliacao(id) {
      if (!identificadorValido(id)) return falha('IDENTIFICADOR_INVALIDO');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const l = await lerPar(db, id);
      if (!l.ok) return l;
      const { registro, admin } = l.resultado;
      const validacao = await validarPar(registro, admin);
      return { ok: true, registro, administracao: admin, validacao };
    }
    async function listar(perfil) {
      if (!perfilValido(perfil)) return falha('PERFIL_INVALIDO');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const leitura = await transacionar(db, 'readonly', (tx, controle) => {
        const r = tx.objectStore('pacotes').index('perfil').getAll(perfil);
        const a = tx.objectStore('administracao').index('perfil').getAll(perfil);
        a.onsuccess = () => controle.concluir({ registros: r.result, admins: a.result });
      });
      if (!leitura.ok) return leitura;
      const { registros, admins } = leitura.resultado;
      const mapa = new Map(admins.map((a) => [JSON.stringify(chave(a)), a]));
      if (registros.length !== admins.length) return falha('DADOS_INVALIDOS');
      const pacotes = [];
      for (const r of registros) {
        const par = await validarPar(r, mapa.get(JSON.stringify(chave(r))));
        if (!par.ok) return par; // Não apresentar uma lista parcial como íntegra.
        pacotes.push({ pacote: par.pacote, digest: par.digest, administracao: par.administracao });
      }
      return { ok: true, pacotes };
    }
    // Leituras opacas e limitadas da store já existente.
    async function listarOperacoesJournal() {
      if (arguments.length) return falha('IDENTIFICADOR_INVALIDO');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const leitura = await transacionar(
        db,
        'readonly',
        (tx, controle) => {
          const referencias = [];
          const r = tx.objectStore('operacoes').openKeyCursor();
          r.onsuccess = () => {
            const cursor = r.result;
            if (!cursor) {
              controle.concluir({ referencias, limiteExcedido: false });
              return;
            }
            if (referencias.length === 32) {
              controle.concluir({ referencias, limiteExcedido: true });
              return;
            }
            const referencia = Object.freeze({});
            referenciasJournal.set(referencia, cursor.primaryKey);
            referencias.push(referencia);
            cursor.continue();
          };
        },
        ['operacoes']
      );
      return leitura.ok ? { ok: true, ...leitura.resultado } : leitura;
    }
    async function lerOperacaoJournal(referencia) {
      if (arguments.length !== 1 || !referenciasJournal.has(referencia))
        return falha('IDENTIFICADOR_INVALIDO');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const leitura = await transacionar(
        db,
        'readonly',
        (tx, controle) => {
          const r = tx.objectStore('operacoes').get(referenciasJournal.get(referencia));
          r.onsuccess = () => controle.concluir(r.result);
        },
        ['operacoes']
      );
      return leitura.ok ? { ok: true, registro: leitura.resultado } : leitura;
    }
    async function registrarIntencaoJournal(chaveInterna) {
      if (arguments.length !== 1) return falha('AUTORIZACAO_OPERACIONAL_INDISPONIVEL');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const journal = commonJS ? require('./lab-journal.js') : root.LabJournal;
      if (!journal || typeof journal.executarGravacaoInterna !== 'function')
        return falha('AUTORIZACAO_OPERACIONAL_INDISPONIVEL');
      return journal.executarGravacaoInterna(chaveInterna, (registro, contexto) => {
        if (
          registro.destino.copyId !== escopo.copyId ||
          registro.destino.origem !== escopo.origem ||
          !contexto.vigente()
        )
          return falha('DESTINO_OU_OPERACAO_OBSOLETA');
        return transacionar(
          db,
          'readwrite',
          (tx, controle) => {
            const abortar = () => {
              try {
                controle.recusar('OPERACAO_CANCELADA');
              } catch {
                /* Transação já terminou. */
              }
            };
            contexto.signal.addEventListener('abort', abortar, { once: true });
            const remover = () => contexto.signal.removeEventListener('abort', abortar);
            tx.addEventListener('abort', remover);
            controle.aoConfirmar(() => {
              remover();
              contexto.confirmarCommit(registro.id);
            });
            if (!contexto.vigente()) {
              abortar();
              return;
            }
            const id = registro.atividades[0];
            const pacote = tx.objectStore('pacotes').get(chave(id));
            const admin = tx.objectStore('administracao').get(chave(id));
            const store = tx.objectStore('operacoes');
            let conteudoLido = false,
              catalogoLido = false,
              emitido = false;
            let quantidade = 0;
            function tentarInserir() {
              if (!conteudoLido || !catalogoLido || emitido) return;
              if (
                !contexto.vigente() ||
                !contexto.conferirConteudo(pacote.result, admin.result) ||
                !contexto.catalogoCompleto(quantidade)
              ) {
                controle.recusar('BASE_ALTERADA_ANTES_DO_JOURNAL');
                return;
              }
              emitido = true;
              const adicao = store.add(registro);
              adicao.onsuccess = () => {
                if (!contexto.vigente()) {
                  controle.recusar('BASE_OU_POSSE_ALTERADA');
                  return;
                }
                controle.concluir({
                  operacao: registro.id,
                  estado: 'intencao-registrada',
                  intencaoRegistrada: true,
                });
              };
            }
            admin.onsuccess = () => {
              conteudoLido = true;
              tentarInserir();
            };
            const cursor = store.openCursor();
            cursor.onsuccess = () => {
              if (!contexto.vigente()) {
                abortar();
                return;
              }
              const atual = cursor.result;
              if (!atual) {
                catalogoLido = true;
                tentarInserir();
                return;
              }
              if (++quantidade > 32 || !contexto.conferirOperacao(atual.value)) {
                controle.recusar('CATALOGO_JOURNAL_ALTERADO');
                return;
              }
              atual.continue();
            };
          },
          ['operacoes', 'pacotes', 'administracao']
        );
      });
    }
    async function executarAplicacaoJournal(referencia) {
      if (arguments.length !== 1) return falha('AUTORIZACAO_APLICACAO_INVALIDA');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const journal = commonJS ? require('./lab-journal.js') : root.LabJournal;
      if (!journal) return falha('AUTORIZACAO_APLICACAO_INVALIDA');
      return journal.executarAplicacaoInterna(referencia, (c) => {
        if (
          c.registro.destino.copyId !== escopo.copyId ||
          c.registro.destino.origem !== escopo.origem ||
          !c.vigente()
        )
          return falha('DESTINO_OU_OPERACAO_OBSOLETA');
        return transacionar(
          db,
          'readwrite',
          (tx, controle) => {
            const abortar = () => {
              try {
                controle.recusar('OPERACAO_CANCELADA');
              } catch {
                /* Já terminou. */
              }
            };
            const remover = () => c.signal.removeEventListener('abort', abortar);
            c.signal.addEventListener('abort', abortar, { once: true });
            tx.addEventListener('abort', remover);
            controle.aoConfirmar(() => {
              remover();
              c.confirmarCommit();
            });
            if (!c.vigente()) {
              abortar();
              return;
            }
            const store = tx.objectStore('operacoes'),
              id = c.registro.atividades[0];
            const p = tx.objectStore('pacotes').get(chave(id)),
              a = tx.objectStore('administracao').get(chave(id));
            let basesLidas = false,
              catalogoLido = false,
              emitido = false,
              quantidade = 0;
            function executar() {
              if (!basesLidas || !catalogoLido || emitido) return;
              emitido = true;
              if (
                !c.vigente() ||
                !c.conferirConteudo(p.result, a.result) ||
                !c.catalogoCompleto(quantidade)
              ) {
                controle.recusar('BASE_ALTERADA_ANTES_DA_APLICACAO');
                return;
              }
              const concluir = (resultado) => {
                if (!c.posse()) {
                  abortar();
                  return;
                }
                controle.concluir(resultado);
              };
              try {
                if (c.tipo === 'marcar') {
                  const q = store.put(c.proximo);
                  q.onsuccess = () => concluir({ marcadorPersistido: true });
                } else if (c.tipo === 'cadastrar') {
                  if (p.result !== undefined || a.result !== undefined) {
                    controle.recusar('CONTEUDO_JA_EXISTENTE');
                    return;
                  }
                  tx.objectStore('pacotes').add(c.criacao.pacote);
                  const q = tx.objectStore('administracao').add(c.criacao.admin);
                  q.onsuccess = () => concluir({ conteudoCriado: true });
                } else if (c.tipo === 'snapshot') {
                  const r = c.executarSnapshot();
                  if (!r.ok) {
                    controle.recusar(r.codigo || 'SNAPSHOT_NAO_CONFIRMADO');
                    return;
                  }
                  concluir(r);
                } else controle.recusar('AUTORIZACAO_APLICACAO_INVALIDA');
              } catch (erro) {
                controle.recusar(codigoErro(erro));
              }
            }
            a.onsuccess = () => {
              basesLidas = true;
              executar();
            };
            const q = store.openCursor();
            q.onsuccess = () => {
              if (!c.vigente()) {
                abortar();
                return;
              }
              const cursor = q.result;
              if (!cursor) {
                catalogoLido = true;
                executar();
                return;
              }
              if (++quantidade > 32 || !c.conferirOperacao(cursor.value)) {
                controle.recusar('CATALOGO_JOURNAL_ALTERADO');
                return;
              }
              cursor.continue();
            };
          },
          ['operacoes', 'pacotes', 'administracao']
        );
      });
    }
    // Capacidade distinta: esta transação nunca emite mutação nas stores escolares.
    async function confirmarReconciliacaoJournal(referencia) {
      if (arguments.length !== 1) return falha('AUTORIZACAO_RECONCILIACAO_INVALIDA');
      const confirmado = await conferir();
      if (!confirmado.ok) return confirmado;
      const journal = commonJS ? require('./lab-journal.js') : root.LabJournal;
      if (!journal) return falha('AUTORIZACAO_RECONCILIACAO_INVALIDA');
      return journal.executarReconciliacaoInterna(referencia, (c) => {
        if (
          c.registro.destino.copyId !== escopo.copyId ||
          c.registro.destino.origem !== escopo.origem ||
          !c.vigente()
        )
          return falha('DESTINO_OU_OPERACAO_OBSOLETA');
        return transacionar(
          db,
          'readwrite',
          (tx, controle) => {
            const abortar = () => {
              try {
                controle.recusar('RECONCILIACAO_CANCELADA');
              } catch {
                /* Já terminou. */
              }
            };
            const remover = () => c.signal.removeEventListener('abort', abortar);
            c.signal.addEventListener('abort', abortar, { once: true });
            tx.addEventListener('abort', remover);
            controle.aoConfirmar(() => {
              remover();
              c.confirmarCommit();
            });
            if (!c.vigente()) {
              abortar();
              return;
            }
            const id = c.registro.atividades[0],
              store = tx.objectStore('operacoes');
            const p = tx.objectStore('pacotes').get(chave(id)),
              a = tx.objectStore('administracao').get(chave(id));
            let baseLida = false,
              catalogoLido = false,
              emitido = false,
              quantidade = 0;
            function tentar() {
              if (!baseLida || !catalogoLido || emitido) return;
              emitido = true;
              if (
                !c.vigente() ||
                !c.conferirConteudo(p.result, a.result) ||
                !c.catalogoCompleto(quantidade)
              ) {
                controle.recusar('BASE_ALTERADA_ANTES_DA_RECONCILIACAO');
                return;
              }
              try {
                const q = store.put(c.proximo);
                q.onsuccess = () => {
                  if (!c.vigente()) {
                    abortar();
                    return;
                  }
                  controle.concluir({ marcadorPersistido: true });
                };
              } catch (e) {
                controle.recusar(codigoErro(e));
              }
            }
            a.onsuccess = () => {
              baseLida = true;
              tentar();
            };
            const q = store.openCursor();
            q.onsuccess = () => {
              if (!c.vigente()) {
                abortar();
                return;
              }
              const cursor = q.result;
              if (!cursor) {
                catalogoLido = true;
                tentar();
                return;
              }
              if (++quantidade > 32 || !c.conferirOperacao(cursor.value)) {
                controle.recusar('CATALOGO_JOURNAL_ALTERADO');
                return;
              }
              cursor.continue();
            };
          },
          ['operacoes', 'pacotes', 'administracao']
        );
      });
    }
    // Não devolver DB, nomes de stores ou capacidade de remoção ao coordenador.
    return {
      ok: true,
      modo: 'persistente',
      copyId: escopo.copyId,
      origem: escopo.origem,
      repositorio: Object.freeze({
        cadastrar,
        consultar,
        lerBaseReconciliacao,
        listar,
        fechar,
        listarOperacoesJournal,
        lerOperacaoJournal,
        registrarIntencaoJournal,
        executarAplicacaoJournal,
        confirmarReconciliacaoJournal,
      }),
    };
  }

  async function abrirRepositorio() {
    return abrirRepositorioInterno(false);
  }
  async function abrirRepositorioExistente() {
    if (arguments.length) return falha('ARGUMENTOS_INVALIDOS');
    return abrirRepositorioInterno(true);
  }
  const api = Object.freeze({ abrirRepositorio, abrirRepositorioExistente });
  if (commonJS) module.exports = api;
  else root.LabRepositorio = api;
})(typeof window === 'undefined' ? globalThis : window);
