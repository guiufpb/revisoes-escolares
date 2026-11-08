/* global globalThis, module */
(function (root) {
  'use strict';

  const ENDPOINT = '/__revisoes_local__/identity';
  const TIMEOUT_MS = 3000;
  function temporario(codigo) {
    return { modo: 'temporario', copyId: null, origem: null, codigo };
  }

  async function resolverIdentidade(copyIdEsperado = null) {
    let origem;
    try {
      const url = new root.URL(root.location.href);
      if (
        url.protocol !== 'http:' ||
        !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
        url.username ||
        url.password
      )
        return temporario('ORIGEM_NAO_SUPORTADA');
      origem = url.origin;
    } catch {
      return temporario('ORIGEM_NAO_SUPORTADA');
    }
    if (
      copyIdEsperado !== null &&
      (typeof copyIdEsperado !== 'string' || !/^[a-f0-9]{64}$/.test(copyIdEsperado))
    )
      return temporario('IDENTIDADE_INVALIDA');
    if (typeof root.fetch !== 'function' || typeof root.AbortController !== 'function')
      return temporario('IDENTIDADE_INDISPONIVEL');
    const controller = new root.AbortController();
    let timer;
    const expiracao = new Promise((resolve) => {
      timer = root.setTimeout(() => {
        controller.abort();
        resolve(temporario('IDENTIDADE_TIMEOUT'));
      }, TIMEOUT_MS);
    });
    const consulta = (async () => {
      try {
        const resposta = await root.fetch(ENDPOINT, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'same-origin',
          mode: 'same-origin',
          redirect: 'error',
          signal: controller.signal,
        });
        if (!resposta.ok) return temporario('IDENTIDADE_INDISPONIVEL');
        // Leitura limitada também quando o servidor omite Content-Length.
        const leitor = resposta.body.getReader();
        const partes = [];
        let tamanho = 0;
        try {
          for (;;) {
            const { value, done } = await leitor.read();
            if (done) break;
            tamanho += value.byteLength;
            if (tamanho > 4096) {
              controller.abort();
              return temporario('IDENTIDADE_INVALIDA');
            }
            partes.push(value);
          }
        } finally {
          leitor.releaseLock();
        }
        const bytes = new root.Uint8Array(tamanho);
        let posicao = 0;
        partes.forEach((parte) => {
          bytes.set(parte, posicao);
          posicao += parte.length;
        });
        let dado;
        try {
          dado = JSON.parse(new root.TextDecoder('utf-8', { fatal: true }).decode(bytes));
        } catch {
          return temporario('IDENTIDADE_INVALIDA');
        }
        if (
          !dado ||
          typeof dado !== 'object' ||
          Array.isArray(dado) ||
          Object.keys(dado).sort().join(',') !== 'application,copyId,schema' ||
          dado.application !== 'revisoes-escolares' ||
          dado.schema !== 1 ||
          typeof dado.copyId !== 'string' ||
          !/^[a-f0-9]{64}$/.test(dado.copyId)
        )
          return temporario('IDENTIDADE_INVALIDA');
        if (copyIdEsperado !== null && dado.copyId !== copyIdEsperado)
          return temporario('IDENTIDADE_ALTERADA');
        try {
          if (!root.indexedDB) return temporario('INDEXEDDB_INDISPONIVEL');
        } catch {
          return temporario('INDEXEDDB_INDISPONIVEL');
        }
        return { modo: 'persistente', copyId: dado.copyId, origem, codigo: null };
      } catch {
        return temporario(
          controller.signal.aborted ? 'IDENTIDADE_TIMEOUT' : 'IDENTIDADE_INDISPONIVEL'
        );
      }
    })();
    try {
      return await Promise.race([consulta, expiracao]);
    } finally {
      root.clearTimeout(timer);
    }
  }

  const api = Object.freeze({ resolverIdentidade });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabIdentidade = api;
})(typeof window === 'undefined' ? globalThis : window);
