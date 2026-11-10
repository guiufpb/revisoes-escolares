/* global globalThis, module */
(function (root) {
  'use strict';

  // Exclusivamente analítico. Não importar no app.entry nem no reconhecedor operacional.
  // Política lab-v3-analise-1: tetos inclusivos; nenhum parâmetro de ampliação.
  const P = Object.freeze({
    manifesto: 262144,
    profundidade: 16,
    nos: 20000,
    tokens: 100000,
    entradas: 4096,
    binario: 8388608,
    total: 67108864,
    dimensao: 4096,
    pixels: 4194304,
    registros: 4096,
    erros: 20,
  });
  const capacidades = new Set([
    'questoes-opcoes',
    'questoes-campos',
    'ditado',
    'raster-png',
    'raster-webp',
    'raster-jpeg',
    'alternativas-visuais',
    'conjuntos-visuais',
    'agrupamento-visual',
  ]);
  const reservadas = new Set([
    'svg-estatico',
    'representacoes-contaveis',
    'momentos-visuais',
    'ditado-visual',
  ]);
  const proibidas = new Set(['__proto__', 'prototype', 'constructor']);
  const comparar = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const caminho = (p, k) => p + '/' + String(k).replace(/~/g, '~0').replace(/\//g, '~1');
  const falhas = new WeakSet();
  const falhar = (codigo, local = '') => {
    const erro = { codigo, caminho: local };
    falhas.add(erro);
    throw erro;
  };
  const exigir = (c, codigo = 'ESTRUTURA_RECURSO_INVALIDA', p = '') => {
    if (!c) falhar(codigo, p);
  };
  function unicode(s) {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const n = s.charCodeAt(++i);
        if (!(n >= 0xdc00 && n <= 0xdfff)) return false;
      } else if (c >= 0xdc00 && c <= 0xdfff) return false;
    }
    return true;
  }
  function canonico(v) {
    if (Array.isArray(v)) return '[' + v.map(canonico).join(',') + ']';
    if (v && typeof v === 'object')
      return (
        '{' +
        Object.keys(v)
          .sort()
          .map((k) => JSON.stringify(k) + ':' + canonico(v[k]))
          .join(',') +
        '}'
      );
    return JSON.stringify(v);
  }
  // Snapshot por slots nativos: não chamar métodos/propriedades de instâncias recebidas.
  const typed = Object.getPrototypeOf(Uint8Array.prototype);
  const typedTag = Object.getOwnPropertyDescriptor(typed, Symbol.toStringTag).get;
  const typedBuffer = Object.getOwnPropertyDescriptor(typed, 'buffer').get;
  const typedLength = Object.getOwnPropertyDescriptor(typed, 'byteLength').get;
  const abLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
  const abResizable = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')?.get;
  function copiarBytes(v, max) {
    exigir(typedTag.call(v) === 'Uint8Array', 'ENTRADA_INVALIDA');
    const b = typedBuffer.call(v);
    abLength.call(b); // SharedArrayBuffer e proxies não possuem estes slots.
    exigir(!abResizable || !abResizable.call(b), 'ENTRADA_INVALIDA');
    exigir(typedLength.call(v) <= max, 'LIMITE_BYTES');
    const copia = new Uint8Array(typedLength.call(v));
    Uint8Array.prototype.set.call(copia, v);
    return copia;
  }
  function lerJSON(bytes) {
    exigir(!(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191), 'BOM_PROIBIDO');
    let s;
    try {
      s = new root.TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      falhar('UTF8_INVALIDO');
    }
    const lex =
      /"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|true|false|null|[{}[\],:]/y;
    let i = 0,
      tokens = 0,
      nos = 0;
    function token(p) {
      while (i < s.length && /[ \t\r\n]/.test(s[i])) i++;
      lex.lastIndex = i;
      const t = lex.exec(s);
      exigir(t, 'JSON_INVALIDO', p);
      i = lex.lastIndex;
      exigir(++tokens <= P.tokens, 'LIMITE_TOKENS', p);
      return t[0];
    }
    function proximo(c) {
      let j = i;
      while (j < s.length && /[ \t\r\n]/.test(s[j])) j++;
      return s[j] === c;
    }
    function string(t, p) {
      exigir(t[0] === '"', 'JSON_INVALIDO', p);
      const v = JSON.parse(t);
      exigir(unicode(v), 'UNICODE_INVALIDO', p);
      exigir(v.length <= 4000, 'LIMITE_TEXTO', p);
      return v;
    }
    function valor(nivel, p) {
      exigir(++nos <= P.nos, 'LIMITE_NOS', p);
      const t = token(p);
      if (t === '{' || t === '[') {
        exigir(nivel <= P.profundidade, 'LIMITE_PROFUNDIDADE', p);
        const obj = t === '{',
          v = obj ? {} : [],
          vistas = new Set();
        const fim = obj ? '}' : ']';
        let n = 0;
        if (!proximo(fim))
          for (let continuar = true; continuar;) {
            exigir(++n <= P.entradas, obj ? 'LIMITE_PROPRIEDADES' : 'LIMITE_ARRAY', p);
            let k = n - 1;
            if (obj) {
              k = string(token(p), p);
              exigir(k.length <= 64, 'LIMITE_TEXTO', p);
              // Não refletir nomes arbitrários (que podem conter um alvo) em diagnósticos.
              exigir(!proibidas.has(k), 'PROPRIEDADE_PROIBIDA', p);
              exigir(!vistas.has(k), 'CHAVE_DUPLICADA', p);
              vistas.add(k);
              exigir(token(p) === ':', 'JSON_INVALIDO', p);
            }
            v[k] = valor(
              nivel + 1,
              obj && !/^[a-z][a-zA-Z0-9-]{0,63}$/.test(k) ? p : caminho(p, k)
            );
            continuar = proximo(',');
            if (continuar) token(p);
          }
        exigir(token(p) === fim, 'JSON_INVALIDO', p);
        return v;
      }
      if (t[0] === '"') return string(t, p);
      exigir(!/[\[\]{}:,]/.test(t), 'JSON_INVALIDO', p);
      const v = JSON.parse(t);
      exigir(
        typeof v !== 'number' || (Number.isSafeInteger(v) && !Object.is(v, -0)),
        'NUMERO_INVALIDO',
        p
      );
      return v;
    }
    const v = valor(1, '');
    exigir(/^[ \t\r\n]*$/.test(s.slice(i)), 'JSON_INVALIDO');
    return v;
  }
  function analisarModelo(m) {
    const erros = [],
      requeridas = new Set(),
      globais = new Set(),
      usos = new Set();
    const add = (c, p) => {
      if (erros.length <= P.erros) erros.push({ codigo: c, caminho: p });
    };
    function objeto(v, req, opt, p) {
      if (!v || typeof v !== 'object' || Array.isArray(v)) {
        add('TIPO_INVALIDO', p);
        return false;
      }
      Object.keys(v).forEach((k) => {
        if (!req.includes(k) && !opt.includes(k)) add('PROPRIEDADE_DESCONHECIDA', p);
      });
      req.forEach((k) => {
        if (!Object.hasOwn(v, k)) add('CAMPO_OBRIGATORIO', caminho(p, k));
      });
      return true;
    }
    function lista(v, min, p, max = P.entradas) {
      if (!Array.isArray(v)) {
        add('TIPO_INVALIDO', p);
        return [];
      }
      if (v.length < min || v.length > max) add('CARDINALIDADE_INVALIDA', p);
      return v;
    }
    function texto(v, max, p, longo = false) {
      if (
        typeof v !== 'string' ||
        !v ||
        v !== v.trim() ||
        v !== v.normalize('NFC') ||
        v.length > max ||
        (longo
          ? /[\p{Cf}\p{Zl}\p{Zp}\u0000-\u0009\u000b-\u001f\u007f-\u009f]/u
          : /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u
        ).test(v)
      )
        add('TEXTO_INVALIDO', p);
    }
    function id(v, p, global = false) {
      if (typeof v !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(v)) add('ID_INVALIDO', p);
      else if (global) {
        if (globais.has(v)) add('ID_DUPLICADO', p);
        globais.add(v);
      }
    }
    function inteiro(v, min, max, p) {
      if (!Number.isSafeInteger(v) || v < min || v > max) add('VALOR_INVALIDO', p);
    }
    const recursos =
      m && m.recursos && typeof m.recursos === 'object' && !Array.isArray(m.recursos)
        ? m.recursos
        : {};
    function imagem(v, p) {
      if (!objeto(v, ['id', 'tipo', 'recursoId', 'acessibilidade'], ['rotulo'], p)) return;
      id(v.id, p + '/id', true);
      if (v.tipo !== 'imagem') add('TIPO_VISUAL_INVALIDO', p + '/tipo');
      id(v.recursoId, p + '/recursoId');
      if (!Object.hasOwn(recursos, v.recursoId))
        add('REFERENCIA_RECURSO_AUSENTE', p + '/recursoId');
      else usos.add(v.recursoId);
      if (Object.hasOwn(v, 'rotulo')) texto(v.rotulo, 80, p + '/rotulo');
      const a = v.acessibilidade;
      if (
        objeto(
          a,
          ['tipo'],
          a?.tipo === 'essencial' ? ['descricao', 'descricaoLonga'] : [],
          p + '/acessibilidade'
        )
      ) {
        if (!['essencial', 'decorativa'].includes(a.tipo))
          add('ACESSIBILIDADE_INVALIDA', p + '/acessibilidade');
        if (a.tipo === 'essencial') {
          texto(a.descricao, 1000, p + '/acessibilidade/descricao');
          if (Object.hasOwn(a, 'descricaoLonga'))
            texto(a.descricaoLonga, 4000, p + '/acessibilidade/descricaoLonga', true);
        }
      }
    }
    function visual(v, p) {
      if (v?.tipo === 'imagem') {
        imagem(v, p);
        return;
      }
      requeridas.add('conjuntos-visuais');
      if (
        !objeto(
          v,
          ['id', 'tipo', 'apresentacao', 'rotulo', 'elementos'],
          ['descricaoRelacao', ...(v?.apresentacao === 'agrupamento' ? ['grupos'] : [])],
          p
        )
      )
        return;
      id(v.id, p + '/id', true);
      if (
        v.tipo !== 'conjunto' ||
        !['comparacao', 'sequencia', 'grade', 'agrupamento'].includes(v.apresentacao)
      )
        add('TIPO_VISUAL_INVALIDO', p);
      texto(v.rotulo, 80, p + '/rotulo');
      if (Object.hasOwn(v, 'descricaoRelacao'))
        texto(v.descricaoRelacao, 1000, p + '/descricaoRelacao');
      const elementos = lista(v.elementos, 2, p + '/elementos');
      elementos.forEach((e, i) => imagem(e, p + '/elementos/' + i));
      if (v.apresentacao === 'agrupamento') {
        requeridas.add('agrupamento-visual');
        const ids = new Set(elementos.map((e) => e?.id)),
          vistos = new Set();
        lista(v.grupos, 1, p + '/grupos').forEach((g, i) => {
          const q = p + '/grupos/' + i;
          if (!objeto(g, ['id', 'rotulo', 'elementoIds'], [], q)) return;
          id(g.id, q + '/id', true);
          texto(g.rotulo, 80, q + '/rotulo');
          lista(g.elementoIds, 1, q + '/elementoIds').forEach((e) => {
            if (!ids.has(e) || vistos.has(e)) add('PERTENCIMENTO_INVALIDO', q + '/elementoIds');
            vistos.add(e);
          });
        });
        if (vistos.size !== ids.size || [...ids].some((e) => !vistos.has(e)))
          add('AGRUPAMENTO_INCOMPLETO', p + '/grupos');
      }
    }
    function visuais(v, p) {
      lista(v, 0, p).forEach((e, i) => visual(e, caminho(p, i)));
    }
    // Equivalência textual sem flags, exatamente a comparação já documentada do motor.
    const equivalente = (v) =>
      v
        .trim()
        .replace(/\s+([.!?])/g, '$1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    function aparencia(v) {
      if (!v || typeof v !== 'object') return null;
      if (v.tipo === 'imagem') return ['imagem', recursos[v.recursoId]?.sha256, v.rotulo || ''];
      const elementos = Array.isArray(v.elementos) ? v.elementos : [];
      const grupos = Array.isArray(v.grupos)
        ? v.grupos.map((g) => [
            g?.rotulo,
            elementos
              .filter((e) => Array.isArray(g?.elementoIds) && g.elementoIds.includes(e?.id))
              .map(aparencia),
          ])
        : [];
      return ['conjunto', v.apresentacao, v.rotulo, elementos.map(aparencia), grupos];
    }
    function item(v, tipo, p) {
      const campos = tipo === 'campos';
      if (
        !objeto(
          v,
          ['id', 'pergunta', 'visuais', ...(campos ? ['respostas'] : ['alternativas', 'gabarito'])],
          [],
          p
        )
      )
        return;
      id(v.id, p + '/id', true);
      texto(v.pergunta, 500, p + '/pergunta');
      visuais(v.visuais, p + '/visuais');
      if (campos) {
        const vistas = new Set();
        lista(v.respostas, 1, p + '/respostas', 5).forEach((r, i) => {
          texto(r, 160, p + '/respostas/' + i);
          if (typeof r === 'string') {
            const k = equivalente(r);
            if (vistas.has(k)) add('RESPOSTA_DUPLICADA', p + '/respostas/' + i);
            vistas.add(k);
          }
        });
      } else {
        const ids = new Set(),
          aparencias = new Set();
        lista(v.alternativas, 2, p + '/alternativas').forEach((a, i) => {
          const q = p + '/alternativas/' + i;
          if (!objeto(a, ['id', 'visuais'], ['texto'], q)) return;
          id(a.id, q + '/id');
          if (ids.has(a.id)) add('ALTERNATIVA_DUPLICADA', q + '/id');
          ids.add(a.id);
          if (Object.hasOwn(a, 'texto')) texto(a.texto, 160, q + '/texto');
          visuais(a.visuais, q + '/visuais');
          if (Array.isArray(a.visuais) && a.visuais.length) requeridas.add('alternativas-visuais');
          const essencial = (x) =>
            x?.tipo === 'imagem'
              ? x.acessibilidade?.tipo === 'essencial'
              : Array.isArray(x?.elementos) && x.elementos.some(essencial);
          if (!a.texto && (!Array.isArray(a.visuais) || !a.visuais.some(essencial)))
            add('ALTERNATIVA_SEM_INFORMACAO', q);
          if (Array.isArray(a.visuais)) {
            const k = canonico([
              typeof a.texto === 'string' ? equivalente(a.texto) : '',
              a.visuais.map(aparencia),
            ]);
            if (aparencias.has(k)) add('APRESENTACAO_ALTERNATIVA_DUPLICADA', q);
            aparencias.add(k);
          }
        });
        if (
          objeto(v.gabarito, ['alternativaId'], [], p + '/gabarito') &&
          !ids.has(v.gabarito.alternativaId)
        )
          add('GABARITO_INVALIDO', p + '/gabarito');
      }
    }
    if (
      !objeto(
        m,
        [
          'formato',
          'id',
          'versao',
          'perfil',
          'materia',
          'titulo',
          'capacidades',
          'recursos',
          'questoes',
        ],
        [],
        ''
      )
    )
      return erros;
    if (m.formato !== 'lab-questionarios-v3') add('FORMATO_INVALIDO', '/formato');
    id(m.id, '/id');
    inteiro(m.versao, 1, 9999, '/versao');
    texto(m.titulo, 120, '/titulo');
    if (!['alice', 'mariana'].includes(m.perfil)) add('PERFIL_INVALIDO', '/perfil');
    if (
      ![
        'gramatica',
        'matematica',
        'ciencias',
        'geografia',
        'historia',
        'ingles',
        'leitura',
      ].includes(m.materia)
    )
      add('MATERIA_INVALIDA', '/materia');
    if (objeto(m.recursos, [], Object.keys(recursos), '/recursos'))
      Object.entries(recursos).forEach(([k, r], i) => {
        const p = '/recursos/' + i;
        id(k, p);
        if (!objeto(r, ['mime', 'sha256', 'bytes', 'largura', 'altura'], [], p)) return;
        const tipos = {
          'image/png': 'raster-png',
          'image/webp': 'raster-webp',
          'image/jpeg': 'raster-jpeg',
        };
        if (!Object.hasOwn(tipos, r.mime)) add('FORMATO_RECURSO_NAO_SUPORTADO', p + '/mime');
        else requeridas.add(tipos[r.mime]);
        if (typeof r.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(r.sha256))
          add('HASH_INVALIDO', p + '/sha256');
        inteiro(r.bytes, 1, P.binario, p + '/bytes');
        inteiro(r.largura, 1, P.dimensao, p + '/largura');
        inteiro(r.altura, 1, P.dimensao, p + '/altura');
        if (r.largura * r.altura > P.pixels) add('LIMITE_PIXELS', p);
      });
    lista(m.questoes, 1, '/questoes').forEach((q, i) => {
      const p = '/questoes/' + i;
      if (q?.tipo === 'ditado') {
        requeridas.add('ditado');
        if (!objeto(q, ['id', 'tipo', 'idioma', 'unidade', 'itens'], [], p)) return;
        id(q.id, p + '/id', true);
        if (!['pt-BR', 'en-US'].includes(q.idioma) || !['palavra', 'frase'].includes(q.unidade))
          add('DITADO_INVALIDO', p);
        lista(q.itens, 1, p + '/itens').forEach((it, j) => {
          const t = p + '/itens/' + j;
          if (!objeto(it, ['id', 'texto'], [], t)) return;
          id(it.id, t + '/id', true);
          texto(it.texto, 160, t + '/texto');
          if (typeof it.texto !== 'string') return;
          const palavra = "[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*";
          const partes = it.texto.split(' ');
          const ok =
            q.unidade === 'palavra'
              ? it.texto.length <= 40 && new RegExp('^' + palavra + '$').test(it.texto)
              : partes.length >= 2 &&
                partes.length <= 12 &&
                partes.every(
                  (t) =>
                    t.replace(/[,.!?;:]$/, '').length <= 40 &&
                    new RegExp('^' + palavra + '[,.!?;:]?$').test(t)
                );
          if (!ok) add('TEXTO_DITADO_INVALIDO', t + '/texto');
        });
      } else {
        if (
          !objeto(
            q,
            ['id', 'tipo', 'bloco', 'titulo', 'instrucao', 'dica', 'visuais', 'itens'],
            [],
            p
          )
        )
          return;
        if (!['opcoes', 'campos'].includes(q.tipo)) add('TIPO_QUESTAO_INVALIDO', p + '/tipo');
        else requeridas.add('questoes-' + q.tipo);
        id(q.id, p + '/id', true);
        texto(q.bloco, 80, p + '/bloco');
        texto(q.titulo, 120, p + '/titulo');
        texto(q.instrucao, 500, p + '/instrucao');
        texto(q.dica, 500, p + '/dica');
        visuais(q.visuais, p + '/visuais');
        lista(q.itens, 1, p + '/itens').forEach((v, j) => item(v, q.tipo, p + '/itens/' + j));
      }
    });
    Object.keys(recursos).forEach((k, i) => {
      if (!usos.has(k)) add('RECURSO_ORFAO', '/recursos/' + i);
    });
    const declaradas = new Set();
    let anterior = '';
    lista(m.capacidades, 1, '/capacidades').forEach((c, i) => {
      const p = '/capacidades/' + i;
      if (!objeto(c, ['id', 'versao'], [], p)) return;
      id(c.id, p + '/id');
      if (reservadas.has(c.id)) add('CAPACIDADE_BLOQUEADA', p);
      else if (!capacidades.has(c.id)) add('CAPACIDADE_DESCONHECIDA', p);
      if (c.versao !== 1) add('VERSAO_CAPACIDADE_NAO_SUPORTADA', p);
      if (typeof c.id !== 'string' || c.id <= anterior) add('ORDEM_CAPACIDADES_INVALIDA', p);
      anterior = c.id;
      declaradas.add(c.id);
      if (!requeridas.has(c.id)) add('CAPACIDADE_EXCEDENTE', p);
    });
    if ([...requeridas].some((c) => !declaradas.has(c))) add('CAPACIDADE_AUSENTE', '/capacidades');
    return { erros, requeridas: [...requeridas].sort() };
  }

  // Os leitores abaixo verificam contêiner/estrutura. Não decodificam pixels.
  // PNG: W3C PNG 3; WebP: RIFF container specification; JPEG: ITU-T T.81 anexo B.
  function inspecionar(b) {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const ascii = (o, n) => String.fromCharCode(...b.subarray(o, o + n));
    const be16 = (o) => dv.getUint16(o),
      be32 = (o) => dv.getUint32(o),
      le32 = (o) => dv.getUint32(o, true);
    const le24 = (o) => b[o] + b[o + 1] * 256 + b[o + 2] * 65536;
    let quantidade = 0;
    const contar = () => exigir(++quantidade <= P.registros, 'LIMITE_REGISTROS');
    function dimensoes(w, h, mime) {
      exigir(
        w > 0 && h > 0 && w <= P.dimensao && h <= P.dimensao && w * h <= P.pixels,
        'LIMITE_DIMENSOES'
      );
      return { mime, largura: w, altura: h };
    }
    if (b.length >= 8 && ascii(0, 8) === '\x89PNG\r\n\x1a\n') {
      let o = 8,
        w,
        h,
        cor,
        bits,
        paleta = 0,
        dados = false,
        fechado = false,
        tamanhoDados = 0;
      const cabecalhoZlib = [];
      const vistos = new Set();
      while (o < b.length) {
        contar();
        exigir(o + 12 <= b.length);
        const n = be32(o),
          t = ascii(o + 4, 4),
          d = o + 8,
          fim = d + n;
        exigir(fim + 4 <= b.length && n <= 0x7fffffff);
        let crc = 0xffffffff;
        for (let i = o + 4; i < fim; i++) {
          crc ^= b[i];
          for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
        exigir((crc ^ 0xffffffff) >>> 0 === be32(fim), 'CRC_INVALIDO');
        if (['acTL', 'fcTL', 'fdAT'].includes(t)) falhar('VARIANTE_RECURSO_NAO_SUPORTADA');
        exigir(
          ['IHDR', 'PLTE', 'tRNS', 'sRGB', 'IDAT', 'IEND'].includes(t),
          'METADADO_NAO_PERMITIDO'
        );
        exigir(vistos.has('IHDR') || t === 'IHDR');
        if (t !== 'IDAT') {
          exigir(!vistos.has(t));
          vistos.add(t);
          if (dados) fechado = true;
        }
        if (t === 'IHDR') {
          exigir(o === 8 && n === 13);
          w = be32(d);
          h = be32(d + 4);
          bits = b[d + 8];
          cor = b[d + 9];
          const permitidos = {
            0: [1, 2, 4, 8, 16],
            2: [8, 16],
            3: [1, 2, 4, 8],
            4: [8, 16],
            6: [8, 16],
          };
          exigir(
            permitidos[cor]?.includes(bits) && b[d + 10] === 0 && b[d + 11] === 0 && b[d + 12] <= 1
          );
          dimensoes(w, h, 'image/png');
        } else if (t === 'PLTE') {
          exigir(
            !dados &&
              !vistos.has('tRNS') &&
              ![0, 4].includes(cor) &&
              n > 0 &&
              n <= 768 &&
              n % 3 === 0
          );
          paleta = n / 3;
          exigir(cor !== 3 || paleta <= 2 ** bits);
        } else if (t === 'tRNS') {
          exigir(
            !dados &&
              ((cor === 0 && n === 2 && be16(d) < 2 ** bits) ||
                (cor === 2 && n === 6 && [0, 2, 4].every((i) => be16(d + i) < 2 ** bits)) ||
                (cor === 3 && paleta && n > 0 && n <= paleta))
          );
        } else if (t === 'sRGB') exigir(!dados && !vistos.has('PLTE') && n === 1 && b[d] <= 3);
        else if (t === 'IDAT') {
          exigir(!fechado && (cor !== 3 || paleta > 0));
          dados = true;
          tamanhoDados += n;
          for (let j = 0; j < n && cabecalhoZlib.length < 2; j++) cabecalhoZlib.push(b[d + j]);
        } else if (t === 'IEND') {
          exigir(n === 0 && dados && fim + 4 === b.length && tamanhoDados >= 6);
          const [cmf, flg] = cabecalhoZlib;
          exigir(
            (cmf & 15) === 8 && cmf >> 4 <= 7 && (flg & 32) === 0 && (cmf * 256 + flg) % 31 === 0
          );
          return dimensoes(w, h, 'image/png');
        }
        o = fim + 4;
      }
      falhar('ESTRUTURA_RECURSO_INVALIDA');
    }
    if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
      exigir(le32(4) + 8 === b.length && b.length % 2 === 0);
      let o = 12,
        canvas = null,
        imagem = null,
        alpha = false,
        temAlpha = false,
        flags = 0;
      while (o < b.length) {
        contar();
        exigir(o + 8 <= b.length);
        const t = ascii(o, 4),
          n = le32(o + 4),
          d = o + 8,
          fim = d + n;
        exigir(fim + (n % 2) <= b.length && (!(n % 2) || b[fim] === 0));
        if (['ANIM', 'ANMF'].includes(t)) falhar('VARIANTE_RECURSO_NAO_SUPORTADA');
        exigir(['VP8X', 'VP8 ', 'VP8L', 'ALPH'].includes(t), 'METADADO_NAO_PERMITIDO');
        if (t === 'VP8X') {
          exigir(o === 12 && n === 10 && !canvas);
          flags = b[d];
          exigir((flags & 0xef) === 0, 'VARIANTE_RECURSO_NAO_SUPORTADA');
          exigir(b[d + 1] === 0 && b[d + 2] === 0 && b[d + 3] === 0);
          canvas = dimensoes(le24(d + 4) + 1, le24(d + 7) + 1, 'image/webp');
        } else if (t === 'ALPH') {
          exigir(
            canvas &&
              !alpha &&
              !imagem &&
              n > 1 &&
              (b[d] & 0xc0) === 0 &&
              (b[d] & 3) <= 1 &&
              ((b[d] >> 4) & 3) <= 1
          );
          if ((b[d] & 3) === 0) exigir(n === 1 + canvas.largura * canvas.altura);
          alpha = true;
        } else {
          exigir(!imagem);
          if (t === 'VP8 ') {
            exigir(
              n >= 10 &&
                (b[d] & 1) === 0 &&
                ((b[d] >> 1) & 7) <= 3 &&
                (b[d] & 16) !== 0 &&
                ascii(d + 3, 3) === '\x9d\x01\x2a'
            );
            const particao = (b[d] + b[d + 1] * 256 + b[d + 2] * 65536) >>> 5;
            exigir(particao > 0 && particao <= n - 10);
            exigir(
              (dv.getUint16(d + 6, true) & 0xc000) === 0 &&
                (dv.getUint16(d + 8, true) & 0xc000) === 0
            );
            imagem = dimensoes(dv.getUint16(d + 6, true), dv.getUint16(d + 8, true), 'image/webp');
            temAlpha = alpha;
          } else {
            exigir(!alpha && n >= 6 && b[d] === 0x2f);
            const v = le32(d + 1);
            exigir(v >>> 29 === 0);
            imagem = dimensoes((v & 0x3fff) + 1, ((v >>> 14) & 0x3fff) + 1, 'image/webp');
            // alpha_is_used é apenas hint; pixels reais dependem de decodificação.
            temAlpha = null;
          }
        }
        o = fim + (n % 2);
      }
      exigir(
        imagem &&
          (!canvas ||
            (canvas.largura === imagem.largura &&
              canvas.altura === imagem.altura &&
              (temAlpha === null || !!(flags & 16) === temAlpha)))
      );
      return imagem;
    }
    if (b.length >= 4 && b[0] === 255 && b[1] === 216) {
      let o = 2,
        frame = null,
        jfif = false,
        scans = 0,
        intervalo = 0;
      const quant = new Map(),
        quantUsada = new Map(),
        huffman = new Map(),
        coef = new Map();
      while (o < b.length) {
        contar();
        exigir(b[o++] === 255);
        while (b[o] === 255) o++;
        const t = b[o++];
        if (t === 217) {
          exigir(
            frame &&
              jfif &&
              scans &&
              o === b.length &&
              [...coef.values()].every((c) => c.every((v) => v >= 0))
          );
          return frame.info;
        }
        exigir(o + 2 <= b.length);
        const n = be16(o),
          d = o + 2,
          fim = o + n;
        exigir(n >= 2 && fim <= b.length);
        if (t === 224) {
          exigir(
            !jfif &&
              !frame &&
              n === 16 &&
              ascii(d, 5) === 'JFIF\0' &&
              b[d + 5] === 1 &&
              b[d + 6] <= 2 &&
              b[d + 7] <= 2 &&
              be16(d + 8) > 0 &&
              be16(d + 10) > 0 &&
              b[d + 12] === 0 &&
              b[d + 13] === 0,
            'VARIANTE_RECURSO_NAO_SUPORTADA'
          );
          jfif = true;
        } else if ((t >= 225 && t <= 239) || t === 254) falhar('METADADO_NAO_PERMITIDO');
        else if (t === 219) {
          exigir(fim > d);
          let j = d;
          while (j < fim) {
            const v = b[j++],
              precisao = v >> 4,
              id = v & 15;
            exigir(precisao <= 1 && id <= 3 && j + 64 * (precisao + 1) <= fim);
            const valores = [];
            for (let k = 0; k < 64; k++) {
              const valor = precisao ? be16(j) : b[j];
              exigir(valor > 0);
              valores.push(valor);
              j += precisao + 1;
            }
            const tabela = { id, precisao, valores };
            exigir(
              !quantUsada.has(id) || canonico(quantUsada.get(id)) === canonico(tabela),
              'QUANTIZACAO_PROGRESSIVA_ALTERADA'
            );
            quant.set(id, tabela);
          }
          exigir(j === fim);
        } else if (t === 196) {
          exigir(fim > d);
          let j = d;
          while (j < fim) {
            const v = b[j++];
            exigir((v & 15) <= 3 && v >> 4 <= 1 && j + 16 <= fim);
            let total = 0,
              livres = 1;
            for (let k = 0; k < 16; k++) {
              const c = b[j++];
              total += c;
              livres = livres * 2 - c;
              exigir(livres > 0);
            }
            exigir(total > 0 && total <= 256 && j + total <= fim);
            const simbolos = new Set();
            for (let k = 0; k < total; k++) {
              const s = b[j++];
              exigir(!simbolos.has(s) && (v >> 4 === 0 ? s <= 11 : (s & 15) <= 10));
              simbolos.add(s);
            }
            huffman.set(v, simbolos);
          }
          exigir(j === fim);
        } else if (t === 192 || t === 194) {
          exigir(!frame && jfif && n >= 11 && b[d] === 8, 'VARIANTE_RECURSO_NAO_SUPORTADA');
          const count = b[d + 5];
          exigir([1, 3].includes(count) && n === 8 + count * 3, 'VARIANTE_RECURSO_NAO_SUPORTADA');
          const comps = new Map();
          let blocos = 0;
          for (let k = 0; k < count; k++) {
            const j = d + 6 + k * 3,
              id = b[j],
              h = b[j + 1] >> 4,
              v = b[j + 1] & 15;
            exigir(id === k + 1 && h >= 1 && h <= 4 && v >= 1 && v <= 4 && b[j + 2] <= 3);
            blocos += h * v;
            comps.set(id, { h, v, q: b[j + 2] });
            coef.set(id, Array(64).fill(-1));
          }
          exigir(blocos <= 10);
          frame = {
            progressivo: t === 194,
            comps,
            info: dimensoes(be16(d + 3), be16(d + 1), 'image/jpeg'),
          };
        } else if (t === 221) {
          exigir(n === 4);
          intervalo = be16(d);
        } else if (t === 218) {
          exigir(frame && n >= 8);
          const ns = b[d];
          exigir(ns >= 1 && ns <= frame.comps.size && n === 6 + 2 * ns);
          const ss = b[fim - 3],
            se = b[fim - 2],
            ah = b[fim - 1] >> 4,
            al = b[fim - 1] & 15;
          exigir(ss <= se && se <= 63 && ah <= 13 && al <= 13);
          if (!frame.progressivo) exigir(ss === 0 && se === 63 && ah === 0 && al === 0);
          else exigir((ss === 0 ? se === 0 : ns === 1) && (ah === 0 || ah === al + 1));
          const selecionadas = new Set();
          for (let k = 0; k < ns; k++) {
            const id = b[d + 1 + k * 2],
              ht = b[d + 2 + k * 2],
              comp = frame.comps.get(id);
            exigir(
              comp && !selecionadas.has(id) && quant.has(comp.q) && ht >> 4 <= 3 && (ht & 15) <= 3
            );
            selecionadas.add(id);
            if (!frame.progressivo)
              exigir(quant.get(comp.q).precisao === 0 && ht >> 4 <= 1 && (ht & 15) <= 1);
            else {
              // Destinos já usados pelo frame progressivo conservam sua definição efetiva.
              comp.quantizacao = quant.get(comp.q);
              quantUsada.set(comp.q, comp.quantizacao);
            }
            if (!frame.progressivo || (ss === 0 && ah === 0)) exigir(huffman.has(ht >> 4));
            if (!frame.progressivo || ss > 0) exigir(huffman.has(16 + (ht & 15)));
            if (!frame.progressivo)
              exigir(
                [...huffman.get(16 + (ht & 15))].every((s) => (s & 15) > 0 || s === 0 || s === 240)
              );
            else if (ss > 0 && ah > 0)
              exigir([...huffman.get(16 + (ht & 15))].every((s) => (s & 15) <= 1));
            if (frame.progressivo) exigir(ss === 0 ? (ht & 15) === 0 : ht >> 4 === 0);
            const c = coef.get(id);
            if (ss > 0) exigir(c[0] >= 0);
            for (let j = ss; j <= se; j++) {
              exigir(ah === 0 ? c[j] === -1 : c[j] === ah);
              c[j] = al;
            }
          }
          scans++;
          o = fim;
          let dados = 0,
            restart = 0,
            trecho = 0;
          // Somente enquadramento de entropy-coded segments; Huffman/pixels ficam pendentes.
          while (o < b.length) {
            if (b[o] !== 255) {
              dados++;
              trecho++;
              o++;
              continue;
            }
            const inicio = o++;
            while (b[o] === 255) o++;
            const marker = b[o];
            if (marker === 0) {
              exigir(o === inicio + 1);
              dados++;
              trecho++;
              o++;
            } else if (marker >= 208 && marker <= 215) {
              contar();
              exigir(intervalo > 0 && trecho > 0 && marker === 208 + (restart++ % 8));
              trecho = 0;
              o++;
            } else {
              o = inicio;
              break;
            }
          }
          exigir(dados > 0 && trecho > 0);
          continue;
        } else falhar('VARIANTE_RECURSO_NAO_SUPORTADA');
        o = fim;
      }
      falhar('ESTRUTURA_RECURSO_INVALIDA');
    }
    falhar('FORMATO_RECURSO_NAO_SUPORTADO');
  }
  async function analisarContratoVisual(manifestoUTF8, recursosBinarios) {
    const recusar = (erros, truncado = false) => ({
      status: 'recusado',
      erros: erros
        .sort((a, b) => comparar(a.caminho, b.caminho) || comparar(a.codigo, b.codigo))
        .slice(0, P.erros),
      truncado: truncado || erros.length > P.erros,
      admissaoOperacional: false,
    });
    let bytes, binarios;
    try {
      exigir(arguments.length === 2, 'ENTRADA_INVALIDA');
      bytes = copiarBytes(manifestoUTF8, P.manifesto);
      exigir(Array.isArray(recursosBinarios), 'ENTRADA_INVALIDA');
      const tamanho = Object.getOwnPropertyDescriptor(recursosBinarios, 'length');
      exigir(tamanho && tamanho.value <= P.entradas, 'ENTRADA_INVALIDA');
      // Enumeração de nomes é inevitável para recusar extras em arrays JS arbitrários.
      // Não materializar descritores de propriedades que já sabemos ser incompatíveis.
      const chaves = Reflect.ownKeys(recursosBinarios);
      exigir(
        chaves.length === tamanho.value + 1 &&
          chaves.every(
            (k) =>
              typeof k === 'string' &&
              (k === 'length' || (/^(0|[1-9][0-9]*)$/.test(k) && Number(k) < tamanho.value))
          ),
        'ENTRADA_INVALIDA'
      );
      binarios = [];
      let total = 0;
      for (let i = 0; i < tamanho.value; i++) {
        const d = Object.getOwnPropertyDescriptor(recursosBinarios, String(i));
        exigir(d && Object.hasOwn(d, 'value'), 'ENTRADA_INVALIDA');
        const b = copiarBytes(d.value, Math.min(P.binario, P.total - total));
        total += b.length;
        exigir(total <= P.total, 'LIMITE_BYTES');
        binarios.push(b);
      }
      const m = lerJSON(bytes),
        modelo = analisarModelo(m);
      if (Array.isArray(modelo)) return recusar(modelo);
      if (modelo.erros.length) return recusar(modelo.erros);
      if (typeof root.crypto?.subtle?.digest !== 'function')
        return recusar([{ codigo: 'CRIPTO_INDISPONIVEL', caminho: '' }]);
      const hash = async (b) => {
        try {
          return Array.from(new Uint8Array(await root.crypto.subtle.digest('SHA-256', b)), (x) =>
            x.toString(16).padStart(2, '0')
          ).join('');
        } catch {
          falhar('FALHA_DIGEST');
        }
      };
      const mapa = new Map();
      for (const b of binarios) {
        const h = await hash(b);
        exigir(!mapa.has(h), 'RECURSO_BINARIO_DUPLICADO');
        mapa.set(h, { bytes: b });
      }
      const descritores = new Map();
      for (const r of Object.values(m.recursos)) {
        const anterior = descritores.get(r.sha256);
        exigir(!anterior || canonico(anterior) === canonico(r), 'DESCRITOR_RECURSO_DIVERGENTE');
        descritores.set(r.sha256, r);
      }
      const resumoRecursos = [];
      for (const [h, r] of descritores) {
        exigir(mapa.has(h), 'INTEGRIDADE_RECURSO_DIVERGENTE');
        const b = mapa.get(h).bytes;
        exigir(b.length === r.bytes, 'TAMANHO_RECURSO_DIVERGENTE');
        const info = inspecionar(b);
        exigir(info.mime === r.mime, 'FORMATO_RECURSO_DIVERGENTE');
        exigir(info.largura === r.largura && info.altura === r.altura, 'DIMENSOES_DIVERGENTES');
        resumoRecursos.push({ sha256: h, mime: r.mime, bytes: b.length });
      }
      exigir(mapa.size === descritores.size, 'RECURSO_EXTRA');
      resumoRecursos.sort((a, b) => comparar(a.sha256, b.sha256));
      const manifestoCanonico = canonico(m);
      const preimagem = canonico({
        dominio: 'revisoes-escolares/lab-v3/identidade-1',
        manifesto: m,
        recursos: resumoRecursos,
      });
      return {
        status: 'analise-concluida',
        manifesto: m,
        manifestoCanonico,
        digestPacote: await hash(new root.TextEncoder().encode(preimagem)),
        capacidadesRequeridas: modelo.requeridas.map((id) => ({ id, versao: 1 })),
        resumoRecursos,
        decodificacao: 'pendente',
        admissaoOperacional: false,
      };
    } catch (e) {
      return recusar([{ codigo: falhas.has(e) ? e.codigo : 'ENTRADA_INVALIDA', caminho: '' }]);
    }
  }
  const api = Object.freeze({ analisarContratoVisual });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualAnalise = api;
})(typeof window === 'undefined' ? globalThis : window);
