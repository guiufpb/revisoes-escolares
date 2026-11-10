'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const api = require('../../ambiente_interativo/js/lab-visual-analise.js');
const f = require('./helpers/lab-visual-fixture.cjs');
const fonte = fs.readFileSync(
  path.join(__dirname, '../../ambiente_interativo/js/lab-visual-analise.js'),
  'utf8'
);
const run = (m, bins = []) => api.analisarContratoVisual(f.encode(m), bins);
function recusado(r, codigo) {
  assert.equal(r.status, 'recusado', JSON.stringify(r));
  assert.equal(r.admissaoOperacional, false);
  assert.equal('manifesto' in r, false);
  assert.equal('digestPacote' in r, false);
  if (codigo)
    assert.ok(
      r.erros.some((e) => e.codigo === codigo),
      JSON.stringify(r)
    );
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  assert.equal(
    JSON.stringify(r.erros),
    JSON.stringify(
      [...r.erros].sort((a, b) => cmp(a.caminho, b.caminho) || cmp(a.codigo, b.codigo))
    )
  );
}
function concluido(r) {
  assert.equal(r.status, 'analise-concluida', JSON.stringify(r));
  assert.equal(r.admissaoOperacional, false);
  assert.equal(r.decodificacao, 'pendente');
}
for (let n = 0; n <= 4; n++)
  test('identidade normativa V' + n, async () => {
    const { m, bins } = f.vetor(n);
    const hashesAntes = bins.map(f.hash);
    const r = await run(m, bins);
    concluido(r);
    assert.equal(r.digestPacote, f.digests[n]);
    assert.deepEqual(r.manifesto, m);
    assert.deepEqual(bins.map(f.hash), hashesAntes);
  });
for (const nome of Object.keys(f.hashes))
  test('fixture congelado: ' + nome, async () => {
    const b = f.bytes(nome);
    assert.equal(b.length, f.hashes[nome].bytes);
    assert.equal(f.hash(b), f.hashes[nome].sha256);
    if (/^[WJP]/.test(nome)) {
      const { m, bins } = f.raster(nome);
      concluido(await run(m, bins));
    }
  });
test('propriedades, escapes, espaços e ordem dos buffers preservam identidade', async () => {
  const { m, bins } = f.vetor(3);
  function inverter(v) {
    return Array.isArray(v)
      ? v.map(inverter)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v)
              .reverse()
              .map(([k, v]) => [k, inverter(v)])
          )
        : v;
  }
  const b = new Uint8Array(
    Buffer.from(JSON.stringify(inverter(m), null, 2).replace('Números', 'N\\u00fameros'))
  );
  const r = await api.analisarContratoVisual(b, [...bins].reverse());
  concluido(r);
  assert.equal(r.digestPacote, f.digests[3]);
});
test('símbolos são literais; escapes equivalentes e entidades distintas', async () => {
  const m = f.base();
  m.titulo = '3 < 7 > 2 <script>&lt;';
  const a = await run(m);
  concluido(a);
  const r = await api.analisarContratoVisual(
    new Uint8Array(Buffer.from(JSON.stringify(m).replaceAll('<', '\\u003c'))),
    []
  );
  assert.equal(a.digestPacote, r.digestPacote);
  m.titulo = m.titulo.replaceAll('<', '&lt;');
  assert.notEqual(a.digestPacote, (await run(m)).digestPacote);
});
function misto() {
  const m = f.base();
  m.questoes.push(
    {
      id: 'q2',
      tipo: 'campos',
      bloco: 'Escrever',
      titulo: 'Complete',
      instrucao: 'Escreva.',
      dica: 'Revise.',
      visuais: [],
      itens: [{ id: 'i2', pergunta: 'Escreva dois.', visuais: [], respostas: ['dois', '2'] }],
    },
    {
      id: 'q3',
      tipo: 'ditado',
      idioma: 'pt-BR',
      unidade: 'palavra',
      itens: [{ id: 'i3', texto: 'café' }],
    }
  );
  f.caps(m, 'questoes-campos', 'ditado');
  return m;
}
test('questões heterogêneas: opções, campos e ditado sem projeção ou defaults', async () => {
  const m = misto();
  const r = await run(m);
  concluido(r);
  assert.deepEqual(r.manifesto, m);
  assert.equal('unidadeDitado' in r.manifesto.questoes[2], false);
});
function agrupado() {
  const { m, bins } = f.vetor(3),
    c = m.questoes[0].visuais[0];
  c.apresentacao = 'agrupamento';
  c.elementos.push(f.use('v3', 'ponto'), f.use('v4', 'outro'));
  c.grupos = [
    { id: 'g2', rotulo: 'Segundo', elementoIds: ['v4', 'v2'] },
    { id: 'g1', rotulo: 'Primeiro', elementoIds: ['v3', 'v1'] },
  ];
  c.descricaoRelacao = 'Os grupos têm figuras intercaladas.';
  f.caps(m, 'agrupamento-visual');
  return { m, bins };
}
test('agrupamento intercalado mantém todos os arrays, inclusive referências fora de ordem', async () => {
  const { m, bins } = agrupado();
  const antes = JSON.stringify(m);
  const r = await run(m, bins);
  concluido(r);
  assert.equal(JSON.stringify(m), antes);
  assert.deepEqual(r.manifesto, m);
});
test('alternativa somente ilustrada, alias e contexto acessível independente', async () => {
  const { m, bins } = f.vetor(1);
  m.recursos.alias = { ...m.recursos.ponto };
  const a = m.questoes[0].itens[0].alternativas[0];
  delete a.texto;
  a.visuais = [f.use('va', 'alias', true)];
  f.caps(m, 'alternativas-visuais');
  const r = await run(m, bins);
  concluido(r);
  assert.equal(r.resumoRecursos.length, 1);
});
const casos = [
  ['formato desconhecido', (m) => (m.formato = 'lab-questionarios-v4'), 'FORMATO_INVALIDO'],
  ['id inválido', (m) => (m.id = 'A'), 'ID_INVALIDO'],
  ['questão desconhecida', (m) => (m.questoes[0].tipo = 'misto'), 'TIPO_QUESTAO_INVALIDO'],
  ['id global duplicado', (m) => (m.questoes[0].itens[0].id = 'q1'), 'ID_DUPLICADO'],
  [
    'alternativa duplicada',
    (m) => (m.questoes[0].itens[0].alternativas[1].id = 'a'),
    'ALTERNATIVA_DUPLICADA',
  ],
  [
    'aparência igual',
    (m) => (m.questoes[0].itens[0].alternativas[1].texto = '2'),
    'APRESENTACAO_ALTERNATIVA_DUPLICADA',
  ],
  [
    'gabarito ausente',
    (m) => (m.questoes[0].itens[0].gabarito.alternativaId = 'c'),
    'GABARITO_INVALIDO',
  ],
  ['campo desconhecido', (m) => (m.layout = {}), 'PROPRIEDADE_DESCONHECIDA'],
  ['NFC obrigatório', (m) => (m.titulo = 'cafe\u0301'), 'TEXTO_INVALIDO'],
  ['controle', (m) => (m.titulo = 'a\u0001b'), 'TEXTO_INVALIDO'],
  ['bidi', (m) => (m.titulo = 'a\u202eb'), 'TEXTO_INVALIDO'],
  ['trim não é reparado', (m) => (m.titulo = ' Somar'), 'TEXTO_INVALIDO'],
  ['capacidade omitida', (m) => (m.capacidades = []), 'CAPACIDADE_AUSENTE'],
  ['capacidade excedente', (m) => f.caps(m, 'raster-jpeg'), 'CAPACIDADE_EXCEDENTE'],
  ['capacidade bloqueada', (m) => f.caps(m, 'svg-estatico'), 'CAPACIDADE_BLOQUEADA'],
  ['capacidade desconhecida', (m) => f.caps(m, 'codigo-livre'), 'CAPACIDADE_DESCONHECIDA'],
  ['versão capacidade', (m) => (m.capacidades[0].versao = 2), 'VERSAO_CAPACIDADE_NAO_SUPORTADA'],
  [
    'variante duplicada',
    (m) => (m.questoes[1].itens[0].respostas = ['café', 'CAFE']),
    'RESPOSTA_DUPLICADA',
  ],
  ['regex não é resposta', (m) => (m.questoes[1].itens[0].respostas = [{}]), 'TEXTO_INVALIDO'],
  ['idioma', (m) => (m.questoes[2].idioma = 'pt-PT'), 'DITADO_INVALIDO'],
  ['unidade obrigatória', (m) => delete m.questoes[2].unidade, 'CAMPO_OBRIGATORIO'],
  ['ditado com símbolos', (m) => (m.questoes[2].itens[0].texto = '2 < 3'), 'TEXTO_DITADO_INVALIDO'],
  ['ditado sem palavra', (m) => (m.questoes[2].itens[0].texto = 'oi oi'), 'TEXTO_DITADO_INVALIDO'],
  ['grupo incompleto', (m) => m.questoes[0].visuais[0].grupos.pop(), 'AGRUPAMENTO_INCOMPLETO'],
  [
    'grupo com duplicação',
    (m) => m.questoes[0].visuais[0].grupos[0].elementoIds.push('v1'),
    'PERTENCIMENTO_INVALIDO',
  ],
  [
    'grupo com referência ausente',
    (m) => (m.questoes[0].visuais[0].grupos[0].elementoIds[0] = 'ausente'),
    'PERTENCIMENTO_INVALIDO',
  ],
  [
    'referência ausente',
    (m) => (m.questoes[0].visuais[0].elementos[0].recursoId = 'ausente'),
    'REFERENCIA_RECURSO_AUSENTE',
  ],
  [
    'imagem sem descrição',
    (m) => (m.questoes[0].visuais[0].elementos[0].acessibilidade = { tipo: 'essencial' }),
    'TEXTO_INVALIDO',
  ],
];
for (const [nome, mutar, codigo] of casos)
  test('recusa modelo: ' + nome, async () => {
    const grupo = /grupo|referência|imagem sem/.test(nome),
      { m, bins } = grupo ? agrupado() : { m: misto(), bins: [] };
    mutar(m);
    recusado(await run(m, bins), codigo);
  });
const textuais = [
  ['titulo', 120, (m) => [m, 'titulo']],
  ['bloco', 80, (m) => [m.questoes[0], 'bloco']],
  ['instrucao', 500, (m) => [m.questoes[0], 'instrucao']],
  ['dica', 500, (m) => [m.questoes[0], 'dica']],
  ['pergunta', 500, (m) => [m.questoes[0].itens[0], 'pergunta']],
  ['alternativa', 160, (m) => [m.questoes[0].itens[0].alternativas[0], 'texto']],
];
for (const [nome, max, alvo] of textuais)
  for (const delta of [0, 1])
    test(`texto ${nome}: ${max + delta} UTF-16`, async () => {
      const m = f.base(),
        [v, k] = alvo(m);
      v[k] = 'a'.repeat(max + delta);
      const r = await run(m);
      if (delta) recusado(r, 'TEXTO_INVALIDO');
      else concluido(r);
    });
for (const [nome, s, codigo] of [
  ['duplicada', '{"id":1,"id":2}', 'CHAVE_DUPLICADA'],
  ['duplicada escapada', '{"id":1,"\\u0069d":2}', 'CHAVE_DUPLICADA'],
  ['proto', '{"__proto__":{}}', 'PROPRIEDADE_PROIBIDA'],
  ['constructor', '{"constructor":1}', 'PROPRIEDADE_PROIBIDA'],
  ['surrogate', '{"a":"\\ud800"}', 'UNICODE_INVALIDO'],
  ['vírgula', '{"a":1,}', 'JSON_INVALIDO'],
  ['duas raízes', '{} {}', 'JSON_INVALIDO'],
  ['excesso profundidade', '['.repeat(17) + '0' + ']'.repeat(17), 'LIMITE_PROFUNDIDADE'],
  ['excesso array', '[' + Array(4097).fill('0').join(',') + ']', 'LIMITE_ARRAY'],
  [
    'excesso propriedades',
    '{' + Array.from({ length: 4097 }, (_, i) => '"p' + i + '":0').join(',') + '}',
    'LIMITE_PROPRIEDADES',
  ],
  [
    'excesso nós',
    '[' +
      Array(5)
        .fill('[' + Array(4000).fill('0').join(',') + ']')
        .join(',') +
      ']',
    'LIMITE_NOS',
  ],
  ['número inseguro', '{"a":9007199254740992}', 'NUMERO_INVALIDO'],
  ['zero negativo', '{"a":-0}', 'NUMERO_INVALIDO'],
])
  test('parser: ' + nome, async () =>
    recusado(await api.analisarContratoVisual(new Uint8Array(Buffer.from(s)), []), codigo)
  );
test('UTF-8, BOM e orçamento do manifesto inclusivo', async () => {
  const b = f.encode(f.base());
  for (const [a, c] of [
    [new Uint8Array([0xff]), 'UTF8_INVALIDO'],
    [new Uint8Array([239, 187, 191, ...b]), 'BOM_PROIBIDO'],
    [new Uint8Array(262145), 'LIMITE_BYTES'],
  ])
    recusado(await api.analisarContratoVisual(a, []), c);
  const cheio = new Uint8Array(262144).fill(32);
  cheio.set(b);
  concluido(await api.analisarContratoVisual(cheio, []));
});
test('erros limitados, sem alvo ou manifesto parcial', async () => {
  const m = misto();
  for (let i = 0; i < 30; i++) m.questoes.push({ ...m.questoes[0], id: 'Q' + i });
  const r = await run(m);
  recusado(r);
  assert.equal(r.erros.length, 20);
  assert.equal(r.truncado, true);
  assert.equal(JSON.stringify(r).includes('café'), false);
});
function isolado(cryptoImpl = crypto.webcrypto) {
  let efeitos = 0;
  const contexto = {
    module: { exports: {} },
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    crypto: cryptoImpl,
  };
  for (const n of [
    'localStorage',
    'indexedDB',
    'fetch',
    'document',
    'AudioRevisoes',
    'speechSynthesis',
    'LabCoordenador',
  ])
    Object.defineProperty(contexto, n, {
      get() {
        efeitos++;
        throw Error('efeito proibido');
      },
    });
  vm.runInNewContext(fonte, contexto);
  return { api: contexto.module.exports, efeitos: () => efeitos };
}
test('API mínima, sem imports/efeitos; v3 segue recusado pelo reconhecedor v1/v2', async () => {
  assert.deepEqual(Object.keys(api), ['analisarContratoVisual']);
  const t = isolado();
  const r = await t.api.analisarContratoVisual(f.encode(f.base()), []);
  concluido(r);
  assert.equal(t.efeitos(), 0);
  assert.equal(
    (
      await require('../../ambiente_interativo/js/lab-validador.js').validarPacote(
        f.encode(f.base())
      )
    ).valido,
    false
  );
});
test('falta de SHA-256 e falha de hash não têm fallback', async () => {
  for (const [c, k] of [
    [{}, 'CRIPTO_INDISPONIVEL'],
    [
      {
        subtle: {
          digest: async () => {
            throw Error('segredo');
          },
        },
      },
      'FALHA_DIGEST',
    ],
  ])
    recusado(await isolado(c).api.analisarContratoVisual(f.encode(f.base()), []), k);
});
test('snapshot antes do primeiro await e nenhuma mutação das entradas', async () => {
  const { m, bins } = f.vetor(1),
    raw = f.encode(m),
    antes = raw.slice(),
    original = bins[0].slice();
  let chamar;
  const espera = new Promise((r) => {
    chamar = r;
  });
  let primeira = true;
  const t = isolado({
    subtle: {
      digest: async (a, b) => {
        if (primeira) {
          primeira = false;
          await espera;
        }
        return crypto.webcrypto.subtle.digest(a, b);
      },
    },
  });
  const pendente = t.api.analisarContratoVisual(raw, bins);
  raw.fill(0);
  bins[0].fill(0);
  chamar();
  const r = await pendente;
  concluido(r);
  assert.equal(r.digestPacote, f.digests[1]);
  const r2 = await api.analisarContratoVisual(antes, [original]);
  concluido(r2);
  assert.deepEqual(antes, f.encode(m));
  assert.deepEqual(original, f.bytes('R.png'));
});
test('entradas inválidas, getters e species não executados', async () => {
  let chamadas = 0;
  const b = f.encode(f.base());
  Object.defineProperty(b, 'constructor', {
    get() {
      chamadas++;
      throw Error();
    },
  });
  concluido(await api.analisarContratoVisual(b, []));
  assert.equal(chamadas, 0);
  const a = [];
  Object.defineProperty(a, 0, {
    get() {
      chamadas++;
      return b;
    },
  });
  recusado(await api.analisarContratoVisual(f.encode(f.base()), a), 'ENTRADA_INVALIDA');
  assert.equal(chamadas, 0);
  for (const v of [{ valido: true }, '{}', new Uint16Array(2), new Proxy(b, {})])
    recusado(await api.analisarContratoVisual(v, []));
  recusado(await api.analisarContratoVisual(f.encode(f.base()), [], true), 'ENTRADA_INVALIDA');
  const hostil = new Proxy([], {
    ownKeys() {
      throw {
        codigo: 'ALVO_PRIVADO',
        get caminho() {
          throw Error();
        },
      };
    },
  });
  const r = await api.analisarContratoVisual(f.encode(f.base()), hostil);
  recusado(r, 'ENTRADA_INVALIDA');
  assert.equal(JSON.stringify(r).includes('ALVO_PRIVADO'), false);
  recusado(
    await api.analisarContratoVisual(new Uint8Array(new ArrayBuffer(8, { maxByteLength: 16 })), [])
  );
  const destacavel = new Uint8Array(8);
  structuredClone(destacavel.buffer, { transfer: [destacavel.buffer] });
  recusado(await api.analisarContratoVisual(destacavel, []));
});

for (const [nome, max] of [
  ['rotulo', 80],
  ['descricaoRelacao', 1000],
  ['descricao', 1000],
  ['descricaoLonga', 4000],
])
  for (const delta of [0, 1])
    test(`acessibilidade ${nome}: ${max + delta} UTF-16`, async () => {
      const { m, bins } = agrupado(),
        c = m.questoes[0].visuais[0];
      if (nome === 'rotulo' || nome === 'descricaoRelacao') c[nome] = 'a'.repeat(max + delta);
      else {
        const a = (c.elementos[0].acessibilidade = { tipo: 'essencial', descricao: 'Figura.' });
        a[nome] = 'a'.repeat(max + delta);
      }
      const r = await run(m, bins);
      if (delta) recusado(r);
      else concluido(r);
    });
test('descrição longa admite LF interno; outros controles e LF curto são recusados', async () => {
  const { m, bins } = f.vetor(1);
  const a = (m.questoes[0].visuais[0].acessibilidade = {
    tipo: 'essencial',
    descricao: 'Figura.',
    descricaoLonga: 'Primeiro.\nSegundo.',
  });
  concluido(await run(m, bins));
  a.descricao = 'Primeiro.\nSegundo.';
  recusado(await run(m, bins), 'TEXTO_INVALIDO');
  a.descricao = 'Figura.';
  a.descricaoLonga = 'a\tb';
  recusado(await run(m, bins), 'TEXTO_INVALIDO');
});
for (const [nome, texto, unidade, ok] of [
  ['palavra 40', 'a'.repeat(40), 'palavra', true],
  ['palavra 41', 'a'.repeat(41), 'palavra', false],
  ['frase 12', Array(12).fill('a').join(' '), 'frase', true],
  ['frase 13', Array(13).fill('a').join(' '), 'frase', false],
  ['frase 160', [40, 40, 40, 37].map((n) => 'a'.repeat(n)).join(' '), 'frase', true],
  ['frase 161', [40, 40, 40, 38].map((n) => 'a'.repeat(n)).join(' '), 'frase', false],
  ['conectores', "d'água", 'palavra', true],
  ['pontuação', 'Hello, world!', 'frase', true],
  ['alfabeto fora do recorte', '中文', 'palavra', false],
])
  test('ditado: ' + nome, async () => {
    const m = misto(),
      q = m.questoes[2];
    q.unidade = unidade;
    q.itens[0].texto = texto;
    const r = await run(m);
    if (ok) concluido(r);
    else recusado(r);
  });
test('identificadores e versões: limites inclusivos', async () => {
  const m = f.base();
  m.id = 'a'.repeat(64);
  m.versao = 9999;
  concluido(await run(m));
  m.id += 'a';
  recusado(await run(m));
  m.id = 'a';
  m.versao = 10000;
  recusado(await run(m));
  m.versao = 1;
  m.titulo = '😀'.repeat(60);
  concluido(await run(m));
  m.titulo += '😀';
  recusado(await run(m));
});
for (const [nome, s, codigo] of [
  ['profundidade 16', '['.repeat(16) + '0' + ']'.repeat(16), null],
  ['array 4096', '[' + Array(4096).fill('0').join(',') + ']', null],
  [
    'propriedades 4096',
    '{' + Array.from({ length: 4096 }, (_, i) => '"p' + i + '":0').join(',') + '}',
    null,
  ],
  [
    'nós 20000',
    '[' +
      [4096, 4096, 4096, 4096, 3610]
        .map((n) => '[' + Array(n).fill('0').join(',') + ']')
        .join(',') +
      ']',
    null,
  ],
  [
    'nós 20001',
    '[' +
      [4096, 4096, 4096, 4096, 3611]
        .map((n) => '[' + Array(n).fill('0').join(',') + ']')
        .join(',') +
      ']',
    'LIMITE_NOS',
  ],
])
  test('fronteira parser: ' + nome, async () => {
    const r = await api.analisarContratoVisual(new Uint8Array(Buffer.from(s)), []);
    recusado(r, codigo || undefined);
    if (!codigo) assert.ok(r.erros.every((e) => !e.codigo.startsWith('LIMITE_')));
  });
test('cinco variantes, ausência de informação, propriedades fechadas de visuais e grupos', async () => {
  const m = misto(),
    c = m.questoes[1].itens[0];
  c.respostas = ['a', 'b', 'c', 'd', 'e'];
  concluido(await run(m));
  c.respostas.push('f');
  recusado(await run(m));
  const x = f.base();
  delete x.questoes[0].itens[0].alternativas[0].texto;
  recusado(await run(x), 'ALTERNATIVA_SEM_INFORMACAO');
  for (const alterar of [
    (v) => (v.slot = 'enunciado'),
    (v) => (v.grupos[0].script = 'x'),
    (v) => (v.grupos[0].id = 'q1'),
    (v) => (v.elementos[0].acessibilidade.descricao = 'decoração indevida'),
  ]) {
    const { m, bins } = agrupado();
    alterar(m.questoes[0].visuais[0]);
    recusado(await run(m, bins));
  }
});
test('duplicação ilustrada ignora IDs e descrições contextuais', async () => {
  const { m, bins } = f.vetor(1),
    as = m.questoes[0].itens[0].alternativas;
  as.forEach((a, i) => {
    delete a.texto;
    a.visuais = [f.use('va' + i, 'ponto', true)];
    a.visuais[0].acessibilidade.descricao = 'Contexto ' + i;
  });
  f.caps(m, 'alternativas-visuais');
  recusado(await run(m, bins), 'APRESENTACAO_ALTERNATIVA_DUPLICADA');
});
test('alterações pedagógicas mudam digest; resultado não contamina futuras análises', async () => {
  const { m, bins } = f.vetor(1),
    inicial = await run(m, bins);
  inicial.manifesto.questoes[0].titulo = 'Resultado alterado';
  assert.equal((await run(m, bins)).digestPacote, f.digests[1]);
  for (const alterar of [
    (m) => (m.questoes[0].titulo += '!'),
    (m) => (m.questoes[0].visuais[0].rotulo = 'A'),
    (m) => m.questoes[0].itens[0].alternativas.reverse(),
  ]) {
    const x = structuredClone(m);
    alterar(x);
    const r = await run(x, bins);
    concluido(r);
    assert.notEqual(r.digestPacote, f.digests[1]);
  }
});
