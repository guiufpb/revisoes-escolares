/* global globalThis, module */
(function (root) {
  'use strict';

  const LIMITES = Object.freeze({ bytes: 262144, profundidade: 8, tokens: 10000, erros: 20 });
  const LIMITES_BACKUP = Object.freeze({
    bytes: 8388608,
    profundidade: 16,
    tokens: 200000,
    entradas: 20,
  });
  const mensagens = {
    LIMITE_BYTES: 'O arquivo excede o limite de bytes.',
    UTF8_INVALIDO: 'O arquivo precisa usar UTF-8 válido.',
    BOM_PROIBIDO: 'Salve o arquivo UTF-8 sem BOM.',
    UNICODE_INVALIDO: 'Há uma sequência Unicode malformada.',
    JSON_INVALIDO: 'O arquivo não contém JSON válido.',
    CHAVE_DUPLICADA: 'Uma propriedade foi declarada mais de uma vez.',
    LIMITE_ESTRUTURA: 'O arquivo excede o limite de profundidade ou tokens.',
    PROPRIEDADE_DESCONHECIDA: 'Esta propriedade não é permitida.',
    CAMPO_OBRIGATORIO: 'Preencha esta propriedade obrigatória.',
    TIPO_INVALIDO: 'O tipo deste valor não é permitido.',
    VALOR_INVALIDO: 'O valor não pertence ao contrato.',
    TEXTO_INVALIDO: 'O texto está vazio, é longo demais ou contém caracteres proibidos.',
    ID_DUPLICADO: 'O identificador já foi utilizado no pacote.',
    OPCAO_DUPLICADA: 'Há opções ou variantes equivalentes na comparação de respostas.',
    GABARITO_INVALIDO: 'O gabarito é incompatível com o tipo ou as opções.',
    CRIPTO_INDISPONIVEL: 'SHA-256 não está disponível neste ambiente.',
    FALHA_DIGEST: 'Não foi possível calcular SHA-256.',
    TEXTO_DITADO_INVALIDO:
      'Use uma palavra de até 40 caracteres ou uma frase de 2 a 12 palavras e até 160 caracteres, em português ou inglês, sem códigos ou endereços.',
  };
  const proibidas = new Set(['__proto__', 'prototype', 'constructor']);
  const id = { tipo: 'id' };
  const texto = (max) => ({ tipo: 'texto', max });
  const lista = (item, min, max) => ({ tipo: 'lista', item, min, max });
  const objeto = (props, opcionais = []) => ({ tipo: 'objeto', props, opcionais });
  const item = objeto(
    {
      id,
      pergunta: texto(500),
      respostas: lista(texto(160), 1, 5),
      opcoes: lista(texto(160), 2, 6),
    },
    ['opcoes']
  );
  const questao = objeto({
    id,
    bloco: texto(80),
    titulo: texto(120),
    instrucao: texto(500),
    tipo: { valores: ['opcoes', 'campos'] },
    itens: lista(item, 1, 6),
    dica: texto(500),
  });
  const schema = objeto({
    formato: { valores: ['lab-questionarios-v1'] },
    id,
    versao: { tipo: 'inteiro', min: 1, max: 9999 },
    perfil: { valores: ['alice', 'mariana'] },
    materia: {
      valores: [
        'gramatica',
        'matematica',
        'ciencias',
        'geografia',
        'historia',
        'ingles',
        'leitura',
      ],
    },
    titulo: texto(120),
    questoes: lista(questao, 1, 30),
  });
  // Contrato fechado de ditados; admissão versionada explícita na LAB.2D.6C.2.
  const literal = (max) => ({ tipo: 'literal', max });
  const schemaDitado = objeto({
    ...schema.props,
    formato: { valores: ['lab-questionarios-v2'] },
    titulo: literal(120),
    questoes: lista(
      objeto(
        {
          id,
          bloco: literal(80),
          titulo: literal(120),
          instrucao: literal(500),
          tipo: { valores: ['ditado'] },
          unidade: { valores: ['palavra', 'frase'] },
          idioma: { valores: ['pt-BR', 'en-US'] },
          itens: lista(objeto({ id, texto: literal(160) }), 1, 6),
        },
        ['unidade']
      ),
      1,
      30
    ),
  });
  const caminho = (base, chave) =>
    base + '/' + String(chave).replace(/~/g, '~0').replace(/\//g, '~1');
  const erro = (codigo, local = '') => ({ codigo, caminho: local, mensagem: mensagens[codigo] });
  const comparar = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  function falha(erros) {
    erros.sort((a, b) => comparar(a.caminho, b.caminho) || comparar(a.codigo, b.codigo));
    return {
      valido: false,
      erros: erros.slice(0, LIMITES.erros),
      truncado: erros.length > LIMITES.erros,
    };
  }

  function unicodeValido(valor) {
    for (let i = 0; i < valor.length; i += 1) {
      const c = valor.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const proximo = valor.charCodeAt(++i);
        if (!(proximo >= 0xdc00 && proximo <= 0xdfff)) return false;
      } else if (c >= 0xdc00 && c <= 0xdfff) return false;
    }
    return true;
  }

  // Apenas pré-checagem léxica/estrutural. A gramática e a construção do objeto
  // continuam a cargo de JSON.parse; não avaliar JS nem implementar outro parser.
  function preChecar(fonte, limites, trechos) {
    const token =
      /"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|true|false|null|[{}[\],:]/y;
    const pilha = [];
    let posicao = 0;
    let quantidade = 0;
    while (posicao < fonte.length) {
      if (/[\x20\t\r\n]/.test(fonte[posicao])) {
        posicao += 1;
        continue;
      }
      token.lastIndex = posicao;
      const inicio = posicao;
      const resultado = token.exec(fonte);
      if (!resultado) throw erro('JSON_INVALIDO');
      posicao = token.lastIndex;
      if (++quantidade > limites.tokens) throw erro('LIMITE_ESTRUTURA');
      const valor = resultado[0];
      const pai = pilha[pilha.length - 1];
      const local = pai ? caminho(pai.local, pai.objeto ? pai.chave : pai.indice) : '';
      if (valor === '{' || valor === '[') {
        if (pilha.length >= limites.profundidade) throw erro('LIMITE_ESTRUTURA', local);
        if (pai && !pai.objeto) pai.indice += 1;
        pilha.push({
          objeto: valor === '{',
          local,
          chave: '',
          indice: 0,
          esperaChave: true,
          chaves: new Set(),
          inicio,
        });
      } else if (valor === '}' || valor === ']') {
        const atual = pilha.pop();
        if (!atual || atual.objeto !== (valor === '}')) throw erro('JSON_INVALIDO');
        if (trechos && /^\/entradas\/[0-9]+\/pacote$/.test(atual.local))
          trechos[atual.local] = fonte.slice(atual.inicio, posicao);
      } else if (valor === ',') {
        if (pai) pai.esperaChave = true;
      } else if (valor === ':') {
        if (pai) pai.esperaChave = false;
      } else {
        if (valor[0] === '"') {
          const decodificado = JSON.parse(valor);
          if (!unicodeValido(decodificado)) throw erro('UNICODE_INVALIDO', local);
          if (pai && pai.objeto && pai.esperaChave) {
            const localChave = caminho(pai.local, decodificado);
            if (pai.chaves.has(decodificado)) throw erro('CHAVE_DUPLICADA', localChave);
            if (proibidas.has(decodificado)) throw erro('VALOR_INVALIDO', localChave);
            pai.chaves.add(decodificado);
            pai.chave = decodificado;
            pai.esperaChave = false;
          }
        }
        if (pai && !pai.objeto) pai.indice += 1;
      }
    }
    // JSON.parse recusará também separadores ausentes, múltiplas raízes e pilha incompleta.
  }

  function validarEstrutura(valor, regra, local, erros) {
    const adicionar = (codigo, onde = local) => erros.push(erro(codigo, onde));
    if (regra.tipo === 'objeto') {
      if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
        adicionar('TIPO_INVALIDO');
        return valor;
      }
      const novo = {};
      Object.keys(valor).forEach((chave) => {
        if (!Object.hasOwn(regra.props, chave))
          adicionar('PROPRIEDADE_DESCONHECIDA', caminho(local, chave));
      });
      Object.keys(regra.props).forEach((chave) => {
        if (!Object.hasOwn(valor, chave)) {
          if (!regra.opcionais.includes(chave))
            adicionar('CAMPO_OBRIGATORIO', caminho(local, chave));
        } else
          novo[chave] = validarEstrutura(
            valor[chave],
            regra.props[chave],
            caminho(local, chave),
            erros
          );
      });
      return novo;
    }
    if (regra.tipo === 'lista') {
      if (!Array.isArray(valor)) {
        adicionar('TIPO_INVALIDO');
        return valor;
      }
      if (valor.length < regra.min || valor.length > regra.max) adicionar('VALOR_INVALIDO');
      return valor.map((v, i) => validarEstrutura(v, regra.item, caminho(local, i), erros));
    }
    if (regra.tipo === 'inteiro') {
      if (typeof valor !== 'number' || !Number.isInteger(valor)) adicionar('TIPO_INVALIDO');
      else if (valor < regra.min || valor > regra.max) adicionar('VALOR_INVALIDO');
      return valor;
    }
    if (typeof valor !== 'string') {
      adicionar('TIPO_INVALIDO');
      return valor;
    }
    if (regra.valores) {
      if (!regra.valores.includes(valor)) adicionar('VALOR_INVALIDO');
    } else if (regra.tipo === 'literal') {
      // V2 recusa texto não canônico, nunca corrige, trunca ou normaliza silenciosamente.
      if (
        !valor ||
        valor !== valor.trim() ||
        valor !== valor.normalize('NFC') ||
        valor.length > regra.max ||
        /[<>\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(valor)
      )
        adicionar('TEXTO_INVALIDO');
    } else if (regra.tipo === 'id') {
      if (!/^[a-z][a-z0-9-]{0,63}$/.test(valor)) adicionar('VALOR_INVALIDO');
    } else {
      valor = valor.replace(/\r\n?/g, '\n').normalize('NFC');
      const proibido = /[<>\u0000-\u0008\u000b-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(valor);
      valor = valor.trim();
      if (!valor || [...valor].length > regra.max || proibido) adicionar('TEXTO_INVALIDO');
    }
    return valor;
  }

  // Espelha exclusivamente a comparação sem flags do motor, sem importar/ativar o motor.
  function respostaComparavel(valor) {
    return valor
      .trim()
      .replace(/\s+([.!?])/g, '$1')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function validarSemantica(pacote, erros) {
    const ids = new Set();
    function verificarId(valor, local) {
      if (ids.has(valor)) erros.push(erro('ID_DUPLICADO', local));
      ids.add(valor);
    }
    function duplicadas(valores, local) {
      const vistas = new Set();
      valores.forEach((valor, i) => {
        const comparavel = respostaComparavel(valor);
        if (vistas.has(comparavel)) erros.push(erro('OPCAO_DUPLICADA', caminho(local, i)));
        vistas.add(comparavel);
      });
    }
    pacote.questoes.forEach((q, i) => {
      const local = '/questoes/' + i;
      verificarId(q.id, local + '/id');
      q.itens.forEach((subitem, j) => {
        const onde = local + '/itens/' + j;
        verificarId(subitem.id, onde + '/id');
        duplicadas(subitem.respostas, onde + '/respostas');
        if (q.tipo === 'opcoes') {
          if (!subitem.opcoes) erros.push(erro('CAMPO_OBRIGATORIO', onde + '/opcoes'));
          else {
            duplicadas(subitem.opcoes, onde + '/opcoes');
            if (subitem.respostas.length !== 1)
              erros.push(erro('GABARITO_INVALIDO', onde + '/respostas'));
            subitem.respostas.forEach((r, k) => {
              if (!subitem.opcoes.includes(r))
                erros.push(erro('GABARITO_INVALIDO', onde + '/respostas/' + k));
            });
          }
        } else if (Object.hasOwn(subitem, 'opcoes'))
          erros.push(erro('PROPRIEDADE_DESCONHECIDA', onde + '/opcoes'));
      });
    });
  }

  function canonicalizar(valor) {
    if (Array.isArray(valor)) return '[' + valor.map(canonicalizar).join(',') + ']';
    if (valor && typeof valor === 'object') {
      return (
        '{' +
        Object.keys(valor)
          .sort()
          .map((k) => JSON.stringify(k) + ':' + canonicalizar(valor[k]))
          .join(',') +
        '}'
      );
    }
    return JSON.stringify(valor);
  }

  function lerJSON(entrada, limites, mapearPacotes = false) {
    let fonte;
    try {
      if (typeof entrada === 'string') {
        // Evitar alocar o encoder para strings já impossíveis pelo tamanho UTF-16.
        if (entrada.length > limites.bytes) return falha([erro('LIMITE_BYTES')]);
        if (!unicodeValido(entrada)) return falha([erro('UNICODE_INVALIDO')]);
        if (new root.TextEncoder().encode(entrada).byteLength > limites.bytes)
          return falha([erro('LIMITE_BYTES')]);
        fonte = entrada;
      } else if (
        mapearPacotes ? root.ArrayBuffer.isView(entrada) : entrada instanceof root.Uint8Array
      ) {
        let dados = entrada;
        if (mapearPacotes) {
          // Ler slots nativos, sem executar getters/subclasses apresentados como bytes.
          const prototipo = Object.getPrototypeOf(root.Uint8Array.prototype);
          const tag = Object.getOwnPropertyDescriptor(prototipo, Symbol.toStringTag).get.call(
            entrada
          );
          if (tag !== 'Uint8Array') return falha([erro('TIPO_INVALIDO')]);
          const ler = (nome) => Object.getOwnPropertyDescriptor(prototipo, nome).get.call(entrada);
          const tamanho = ler('byteLength');
          if (tamanho > limites.bytes) return falha([erro('LIMITE_BYTES')]);
          dados = new root.Uint8Array(ler('buffer'), ler('byteOffset'), tamanho);
        } else if (entrada.byteLength > limites.bytes) return falha([erro('LIMITE_BYTES')]);
        fonte = new root.TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(dados);
      } else return falha([erro('TIPO_INVALIDO')]);
    } catch {
      return falha([erro('UTF8_INVALIDO')]);
    }
    if (fonte.charCodeAt(0) === 0xfeff) return falha([erro('BOM_PROIBIDO')]);
    let recebido;
    const trechosPacotes = mapearPacotes ? Object.create(null) : null;
    try {
      preChecar(fonte, limites, trechosPacotes);
      recebido = JSON.parse(fonte);
    } catch (problema) {
      return falha([
        problema && Object.hasOwn(mensagens, problema.codigo) ? problema : erro('JSON_INVALIDO'),
      ]);
    }
    return { valido: true, valor: recebido, trechosPacotes, ...(mapearPacotes ? { fonte } : {}) };
  }

  // Perfil fechado: nenhum chamador pode ampliar os limites de validarPacote.
  function lerJSONBackup(entrada) {
    return lerJSON(entrada, LIMITES_BACKUP, true);
  }

  async function validarPacoteV1(entrada) {
    const leitura = lerJSON(entrada, LIMITES);
    if (!leitura.valido) return leitura;
    const recebido = leitura.valor;
    const erros = [];
    const pacoteNormalizado = validarEstrutura(recebido, schema, '', erros);
    if (erros.length) return falha(erros);
    validarSemantica(pacoteNormalizado, erros);
    if (erros.length) return falha(erros);
    const canonico = canonicalizar(pacoteNormalizado);
    if (!root.crypto || !root.crypto.subtle || typeof root.crypto.subtle.digest !== 'function')
      return falha([erro('CRIPTO_INDISPONIVEL')]);
    try {
      const bytes = new root.TextEncoder().encode(canonico);
      const resultado = await root.crypto.subtle.digest('SHA-256', bytes);
      const digest = Array.from(new root.Uint8Array(resultado), (v) =>
        v.toString(16).padStart(2, '0')
      ).join('');
      return { valido: true, pacoteNormalizado, canonico, digest };
    } catch {
      return falha([erro('FALHA_DIGEST')]);
    }
  }

  async function validarContratoDitado(entrada) {
    const leitura = lerJSON(entrada, LIMITES);
    if (!leitura.valido) return leitura;
    const erros = [];
    const contratoNormalizado = validarEstrutura(leitura.valor, schemaDitado, '', erros);
    if (erros.length) return falha(erros);
    const ids = new Set();
    const palavra = "[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*";
    const token = new RegExp('^' + palavra + '[,.!?;:]?$');
    const palavraInteira = new RegExp('^' + palavra + '$');
    function identificar(valor, local) {
      if (ids.has(valor)) erros.push(erro('ID_DUPLICADO', local));
      ids.add(valor);
    }
    contratoNormalizado.questoes.forEach((q, i) => {
      const local = '/questoes/' + i;
      identificar(q.id, local + '/id');
      q.unidade = q.unidade || 'palavra';
      q.itens.forEach((item, j) => {
        const onde = local + '/itens/' + j;
        identificar(item.id, onde + '/id');
        const partes = item.texto.split(' ');
        const valida =
          q.unidade === 'palavra'
            ? item.texto.length <= 40 && palavraInteira.test(item.texto)
            : partes.length >= 2 &&
              partes.length <= 12 &&
              partes.every((p) => p.replace(/[,.!?;:]$/, '').length <= 40 && token.test(p));
        if (!valida) erros.push(erro('TEXTO_DITADO_INVALIDO', onde + '/texto'));
      });
    });
    if (erros.length) return falha(erros);
    const canonico = canonicalizar(contratoNormalizado);
    if (!root.crypto?.subtle?.digest) return falha([erro('CRIPTO_INDISPONIVEL')]);
    try {
      const resultado = await root.crypto.subtle.digest(
        'SHA-256',
        new root.TextEncoder().encode(canonico)
      );
      const digestContrato = Array.from(new root.Uint8Array(resultado), (v) =>
        v.toString(16).padStart(2, '0')
      ).join('');
      return {
        valido: true,
        contratoNormalizado,
        canonico,
        digestContrato,
        admissaoOperacional: false,
      };
    } catch {
      return falha([erro('FALHA_DIGEST')]);
    }
  }

  // Reconhecimento analítico de contratos, sem capacidades de armazenamento/aquisição.
  async function reconhecerPacote(entrada) {
    const leitura = lerJSON(entrada, LIMITES);
    if (!leitura.valido) return leitura;
    if (leitura.valor?.formato !== 'lab-questionarios-v2') {
      const v1 = await validarPacoteV1(entrada);
      return v1.valido ? { ...v1, admissaoOperacional: false } : v1;
    }
    const v2 = await validarContratoDitado(entrada);
    if (!v2.valido) return v2;
    // O hash é recalculado pelo validador sobre o canônico ORIGINAL, nunca sobre a projeção.
    return {
      valido: true,
      pacoteNormalizado: v2.contratoNormalizado,
      canonico: v2.canonico,
      digest: v2.digestContrato,
      admissaoOperacional: false,
    };
  }

  // Admissão versionada: a validação produz dados; aquisição/escrita continuam nas capacidades existentes.
  async function validarPacote(entrada) {
    const r = await reconhecerPacote(entrada);
    if (!r.valido) return r;
    return {
      valido: true,
      pacoteNormalizado: r.pacoteNormalizado,
      canonico: r.canonico,
      digest: r.digest,
    };
  }

  // Metadados de apresentação; não modifica IDs, pacote, canônico ou identidade.
  function apresentarPacote(p, digest) {
    if (p.formato !== 'lab-questionarios-v2') return { titulo: p.titulo, id: p.id };
    const identificador = digest.match(/.{1,8}/g).join(' ');
    return { titulo: 'Ditado ' + identificador, id: identificador };
  }

  const api = Object.freeze({
    validarPacote,
    apresentarPacote,
    validarContratoDitado,
    reconhecerPacote,
    LIMITES,
    lerJSONBackup,
    LIMITES_BACKUP,
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabValidador = api;
})(typeof window === 'undefined' ? globalThis : window);
