/* global globalThis, module, require */
(function (root) {
  'use strict';
  // Somente transporte analítico. Não conectar ao aplicativo ou ao reconhecedor v1/v2.
  const analisar =
    typeof module !== 'undefined' && module.exports
      ? require('./lab-visual-analise.js').analisarContratoVisual
      : root.LabVisualAnalise?.analisarContratoVisual;
  const P = Object.freeze({
    zip: 71303168,
    entradas: 4097,
    nome: 96,
    central: 1048576,
    metadados: 2097152,
    manifesto: 262144,
    binario: 8388608,
    binarios: 67108864,
    total: 67371008,
  });
  const manifestoNome = 'lab-v3-zip-1/manifesto.json';
  const recursoNome = /^lab-v3-zip-1\/recursos\/([a-f0-9]{64})\.(png|webp|jpg)$/;
  const mime = { png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };
  const falhas = new WeakSet();
  function falhar(codigo, caminho = '') {
    const e = { codigo, caminho, origem: 'transporte' };
    falhas.add(e);
    throw e;
  }
  function exigir(c, codigo, caminho = '') {
    if (!c) falhar(codigo, caminho);
  }
  const typed = Object.getPrototypeOf(Uint8Array.prototype);
  const tag = Object.getOwnPropertyDescriptor(typed, Symbol.toStringTag).get;
  const buffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
  const length = Object.getOwnPropertyDescriptor(typed, 'byteLength').get;
  const abLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
  const resizable = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')?.get;
  function snapshot(v) {
    exigir(tag.call(v) === 'Uint8Array', 'ZIP_ENTRADA_INVALIDA');
    const b = buffer.call(v);
    abLength.call(b);
    exigir(!resizable || !resizable.call(b), 'ZIP_ENTRADA_INVALIDA');
    const n = length.call(v);
    exigir(n <= P.zip, 'ZIP_LIMITE_BYTES');
    const r = new Uint8Array(n);
    Uint8Array.prototype.set.call(r, v);
    return r;
  }
  function crc32(b) {
    let crc = 0xffffffff;
    for (const x of b) {
      crc ^= x;
      for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function dataDOS(data, hora) {
    const ano = 1980 + (data >>> 9),
      mes = (data >>> 5) & 15,
      dia = data & 31;
    const dias = [
      31,
      ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return (
      mes >= 1 &&
      mes <= 12 &&
      dia >= 1 &&
      dia <= dias[mes - 1] &&
      hora >>> 11 < 24 &&
      ((hora >>> 5) & 63) < 60 &&
      (hora & 31) < 30
    );
  }
  function inspecionar(b) {
    const d = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const u16 = (p) => d.getUint16(p, true),
      u32 = (p) => d.getUint32(p, true);
    const intervalo = (p, n, fim) =>
      exigir(
        Number.isSafeInteger(p + n) && p >= 0 && n >= 0 && p + n <= fim,
        'ZIP_INTERVALO_INVALIDO'
      );
    exigir(b.length >= 22, 'ZIP_TRUNCADO');
    const fim = b.length - 22;
    exigir(u32(fim) === 0x06054b50, 'ZIP_FIM_INVALIDO');
    exigir(u16(fim + 20) === 0, 'ZIP_METADADOS_PROIBIDOS');
    exigir(u16(fim + 4) === 0 && u16(fim + 6) === 0, 'ZIP_MULTIVOLUME');
    const n = u16(fim + 10),
      central = u32(fim + 12),
      inicio = u32(fim + 16);
    exigir(n !== 65535 && central !== 0xffffffff && inicio !== 0xffffffff, 'ZIP64_PROIBIDO');
    exigir(n >= 1 && n <= P.entradas, 'ZIP_LIMITE_ENTRADAS');
    exigir(u16(fim + 8) === n, 'ZIP_CONTAGEM_DIVERGENTE');
    exigir(central <= P.central, 'ZIP_LIMITE_CENTRAL');
    exigir(inicio + central === fim, 'ZIP_CENTRAL_INVALIDA');
    intervalo(inicio, central, fim);
    const entradas = [],
      nomes = new Set(),
      hashes = new Set();
    let p = inicio,
      meta = central + 22,
      total = 0,
      binarios = 0,
      manifestos = 0;
    for (let i = 0; i < n; i++) {
      intervalo(p, 46, fim);
      exigir(u32(p) === 0x02014b50, 'ZIP_CENTRAL_INVALIDA');
      const flags = u16(p + 8),
        metodo = u16(p + 10),
        hora = u16(p + 12),
        data = u16(p + 14);
      const crc = u32(p + 16),
        comprimido = u32(p + 20),
        tamanho = u32(p + 24);
      const nomeLen = u16(p + 28),
        local = u32(p + 42);
      exigir(
        comprimido !== 0xffffffff && tamanho !== 0xffffffff && local !== 0xffffffff,
        'ZIP64_PROIBIDO'
      );
      exigir(u16(p + 4) === 20 && u16(p + 6) === 20, 'ZIP_VERSAO_PROIBIDA');
      exigir(flags === 0 || flags === 0x0800, 'ZIP_FLAGS_PROIBIDAS');
      exigir(metodo === 0 || metodo === 8, 'ZIP_METODO_PROIBIDO');
      exigir(dataDOS(data, hora), 'ZIP_DATA_INVALIDA');
      exigir(u16(p + 30) === 0 && u16(p + 32) === 0, 'ZIP_METADADOS_PROIBIDOS');
      exigir(u16(p + 34) === 0, 'ZIP_MULTIVOLUME');
      exigir(
        u16(p + 36) === 0 && (u32(p + 38) === 0 || u32(p + 38) === 32),
        'ZIP_ATRIBUTOS_PROIBIDOS'
      );
      exigir(nomeLen > 0 && nomeLen <= P.nome, 'ZIP_NOME_INVALIDO');
      intervalo(p + 46, nomeLen, fim);
      let nome = '';
      for (let k = 0; k < nomeLen; k++) {
        const x = b[p + 46 + k];
        exigir(x >= 32 && x <= 126, 'ZIP_NOME_INVALIDO');
        nome += String.fromCharCode(x);
      }
      const recurso = recursoNome.exec(nome),
        ehManifesto = nome === manifestoNome;
      exigir(ehManifesto || recurso, 'ZIP_CAMINHO_PROIBIDO');
      exigir(!nomes.has(nome), 'ZIP_ENTRADA_DUPLICADA', nome);
      nomes.add(nome);
      if (ehManifesto) manifestos++;
      else {
        exigir(!hashes.has(recurso[1]), 'ZIP_HASH_REPETIDO', nome);
        hashes.add(recurso[1]);
        binarios += tamanho;
      }
      exigir(tamanho <= (ehManifesto ? P.manifesto : P.binario), 'ZIP_LIMITE_ENTRADA', nome);
      total += tamanho;
      exigir(total <= P.total && binarios <= P.binarios, 'ZIP_LIMITE_EXTRAIDO');
      exigir(comprimido <= P.zip, 'ZIP_LIMITE_COMPRIMIDO', nome);
      exigir(metodo !== 0 || comprimido === tamanho, 'ZIP_TAMANHO_DIVERGENTE', nome);
      intervalo(local, 30, inicio);
      exigir(u32(local) === 0x04034b50, 'ZIP_LOCAL_INVALIDO', nome);
      exigir(
        u16(local + 4) === 20 &&
          u16(local + 6) === flags &&
          u16(local + 8) === metodo &&
          u16(local + 10) === hora &&
          u16(local + 12) === data &&
          u32(local + 14) === crc &&
          u32(local + 18) === comprimido &&
          u32(local + 22) === tamanho &&
          u16(local + 26) === nomeLen,
        'ZIP_CABECALHOS_DIVERGENTES',
        nome
      );
      exigir(u16(local + 28) === 0, 'ZIP_METADADOS_PROIBIDOS', nome);
      intervalo(local + 30, nomeLen + comprimido, inicio);
      for (let k = 0; k < nomeLen; k++)
        exigir(b[local + 30 + k] === b[p + 46 + k], 'ZIP_CABECALHOS_DIVERGENTES', nome);
      const dados = local + 30 + nomeLen,
        final = dados + comprimido;
      meta += 30 + nomeLen;
      exigir(meta <= P.metadados, 'ZIP_LIMITE_METADADOS');
      entradas.push({ nome, metodo, crc, tamanho, dados, final, local, recurso });
      p += 46 + nomeLen;
    }
    exigir(p === fim, 'ZIP_CENTRAL_INVALIDA');
    exigir(manifestos === 1, 'ZIP_MANIFESTO_AUSENTE');
    let cobertura = 0;
    for (const e of [...entradas].sort((a, b) => a.local - b.local)) {
      exigir(e.local === cobertura, 'ZIP_COBERTURA_INVALIDA');
      cobertura = e.final;
    }
    exigir(cobertura === inicio, 'ZIP_COBERTURA_INVALIDA');
    entradas.sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
    return entradas;
  }
  async function extrair(b, e) {
    const entrada = b.subarray(e.dados, e.final);
    if (e.metodo === 0) return entrada;
    let ds;
    try {
      ds = new root.DecompressionStream('deflate-raw');
    } catch {
      falhar('ZIP_DEFLATE_INDISPONIVEL', e.nome);
    }
    const writer = ds.writable.getWriter(),
      reader = ds.readable.getReader();
    // A saída é pré-alocada SOMENTE após a inspeção integral e os tetos declarados.
    const saida = new Uint8Array(e.tamanho);
    let pos = 0,
      erroEscrita = false;
    const feed = (async () => {
      try {
        for (let p = 0; p < entrada.length; p += 4096)
          await writer.write(entrada.subarray(p, p + 4096));
        await writer.close();
      } catch {
        erroEscrita = true;
      }
    })();
    try {
      for (;;) {
        const r = await reader.read();
        if (r.done) break;
        exigir(r.value.length <= saida.length - pos, 'ZIP_SAIDA_EXCEDENTE', e.nome);
        saida.set(r.value, pos);
        pos += r.value.length;
      }
      await feed;
      exigir(!erroEscrita, 'ZIP_DEFLATE_INVALIDO', e.nome);
      exigir(pos === e.tamanho, 'ZIP_TAMANHO_DIVERGENTE', e.nome);
      return saida;
    } catch (erro) {
      await Promise.allSettled([reader.cancel(), writer.abort()]);
      await feed;
      if (falhas.has(erro)) throw erro;
      falhar('ZIP_DEFLATE_INVALIDO', e.nome);
    } finally {
      reader.releaseLock();
      writer.releaseLock();
    }
  }
  async function analisarTransporteZipVisual(zipBytes) {
    try {
      exigir(arguments.length === 1, 'ZIP_ENTRADA_INVALIDA');
      const zip = snapshot(zipBytes),
        entradas = inspecionar(zip);
      const binarios = [];
      let manifesto,
        totalReal = 0,
        binariosReal = 0;
      for (const e of entradas) {
        const b = await extrair(zip, e);
        totalReal += b.length;
        if (e.recurso) binariosReal += b.length;
        exigir(totalReal <= P.total && binariosReal <= P.binarios, 'ZIP_LIMITE_EXTRAIDO');
        exigir(crc32(b) === e.crc, 'ZIP_CRC_INVALIDO', e.nome);
        if (e.recurso) {
          exigir(typeof root.crypto?.subtle?.digest === 'function', 'CRIPTO_INDISPONIVEL');
          let digest;
          try {
            digest = await root.crypto.subtle.digest('SHA-256', b);
          } catch {
            falhar('FALHA_DIGEST', e.nome);
          }
          const hash = Array.from(new Uint8Array(digest), (x) =>
            x.toString(16).padStart(2, '0')
          ).join('');
          exigir(hash === e.recurso[1], 'ZIP_HASH_DIVERGENTE', e.nome);
          binarios.push(b);
        } else manifesto = b;
      }
      exigir(typeof analisar === 'function', 'ZIP_ANALISADOR_INDISPONIVEL');
      const resultado = await analisar(manifesto, binarios);
      if (resultado.status === 'recusado')
        return {
          ...resultado,
          erros: resultado.erros.map((e) => ({ ...e, origem: 'contrato' })),
        };
      const descritores = new Map(resultado.resumoRecursos.map((r) => [r.sha256, r]));
      for (const e of entradas)
        if (e.recurso)
          exigir(
            descritores.get(e.recurso[1])?.mime === mime[e.recurso[2]],
            'ZIP_EXTENSAO_DIVERGENTE',
            e.nome
          );
      return {
        ...resultado,
        transporte: {
          perfil: 'lab-v3-zip-1',
          bytes: zip.length,
          entradas: entradas.length,
          metodos: [...new Set(entradas.map((e) => e.metodo))].sort((a, b) => a - b),
        },
      };
    } catch (e) {
      return {
        status: 'recusado',
        erros: [
          falhas.has(e)
            ? e
            : {
                codigo: 'ZIP_ENTRADA_INVALIDA',
                caminho: '',
                origem: 'transporte',
              },
        ],
        truncado: false,
        admissaoOperacional: false,
      };
    }
  }
  const api = Object.freeze({ analisarTransporteZipVisual });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualZip = api;
})(typeof window === 'undefined' ? globalThis : window);
