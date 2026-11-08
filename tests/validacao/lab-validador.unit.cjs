'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { validarPacote, LIMITES } = require('../../ambiente_interativo/js/lab-validador.js');

// Literal escrito independentemente do serializador; hashes fixados com Python hashlib.
const CANONICO =
  '{"formato":"lab-questionarios-v1","id":"sintetico","materia":"ciencias","perfil":"alice","questoes":[{"bloco":"Apoio","dica":"Observe.","id":"q1","instrucao":"Escolha.","itens":[{"id":"i1","opcoes":["Sol","Lua"],"pergunta":"Qual ilumina o dia?","respostas":["Sol"]}],"tipo":"opcoes","titulo":"O dia"}],"titulo":"Exemplo","versao":1}';
const HASH = 'd9ab1b1e4c3c2fbd28bade92aae7452f8f71d71b8c352291eae0bb3b76996294';
const HASH_UNICODE = 'e183e7b461a2b76354ba523dbb1241b4fd2c0655d5db2ec3c6d5cd62c800edb4';
const pacote = () => JSON.parse(CANONICO);
const validar = (p) => validarPacote(JSON.stringify(p));
async function recusa(entrada, codigo, local) {
  const r = await validarPacote(entrada);
  assert.equal(r.valido, false);
  assert.ok(
    r.erros.some((e) => e.codigo === codigo && (local === undefined || e.caminho === local)),
    JSON.stringify(r)
  );
  assert.equal('digest' in r, false);
  return r;
}

test('vetor mínimo ASCII e bytes UTF-8 canônicos fixos', async () => {
  const r = await validarPacote(CANONICO);
  assert.equal(r.valido, true);
  assert.equal(r.canonico, CANONICO);
  assert.equal(r.digest, HASH);
  assert.equal(crypto.createHash('sha256').update(r.canonico, 'utf8').digest('hex'), HASH);
});

test('vetor Unicode NFC e astral independente', async () => {
  const p = pacote();
  p.titulo = '  A\u0301gua 😀\r\n';
  const r = await validar(p);
  assert.equal(r.valido, true);
  assert.equal(r.canonico, CANONICO.replace('"Exemplo"', '"Água 😀"'));
  assert.equal(r.digest, HASH_UNICODE);
});

test('ordem de propriedades, escapes e formatação não mudam identidade', async () => {
  const p = pacote();
  function inverter(v) {
    if (Array.isArray(v)) return v.map(inverter);
    if (v && typeof v === 'object')
      return Object.fromEntries(
        Object.entries(v)
          .reverse()
          .map(([k, x]) => [k, inverter(x)])
      );
    return v;
  }
  const r = await validarPacote(JSON.stringify(inverter(p), null, 2).replace('Sol', '\\u0053ol'));
  assert.equal(r.digest, HASH);
  assert.equal(r.canonico, CANONICO);
});

for (const perfil of ['alice', 'mariana']) {
  for (const tipo of ['opcoes', 'campos']) {
    test(`${perfil}: ${tipo}, 30 questões e seis subitens válidos`, async () => {
      const p = pacote();
      p.perfil = perfil;
      p.questoes = Array.from({ length: 30 }, (_, i) => {
        const q = structuredClone(p.questoes[0]);
        q.id = 'q' + i;
        q.tipo = tipo;
        q.itens = Array.from({ length: 6 }, (_, j) => {
          const sub = structuredClone(q.itens[0]);
          sub.id = `i${i}-${j}`;
          if (tipo === 'campos') {
            delete sub.opcoes;
            sub.respostas = ['Sol', 'estrela'];
          }
          return sub;
        });
        return q;
      });
      assert.equal((await validar(p)).valido, true);
    });
  }
}

const negativos = [
  [
    '31 questões',
    (p) => {
      p.questoes = Array(31).fill(p.questoes[0]);
    },
    'VALOR_INVALIDO',
    '/questoes',
  ],
  [
    'nenhuma questão',
    (p) => {
      p.questoes = [];
    },
    'VALOR_INVALIDO',
    '/questoes',
  ],
  [
    'nenhum item',
    (p) => {
      p.questoes[0].itens = [];
    },
    'VALOR_INVALIDO',
    '/questoes/0/itens',
  ],
  [
    'sete itens',
    (p) => {
      p.questoes[0].itens = Array(7).fill(p.questoes[0].itens[0]);
    },
    'VALOR_INVALIDO',
  ],
  [
    'ID inválido',
    (p) => {
      p.id = ' Sem-normalizar';
    },
    'VALOR_INVALIDO',
    '/id',
  ],
  [
    'ID longo',
    (p) => {
      p.id = 'a'.repeat(65);
    },
    'VALOR_INVALIDO',
  ],
  [
    'IDs compartilhados entre questão e item',
    (p) => {
      p.questoes[0].itens[0].id = 'q1';
    },
    'ID_DUPLICADO',
    '/questoes/0/itens/0/id',
  ],
  [
    'questões duplicadas',
    (p) => {
      p.questoes.push(structuredClone(p.questoes[0]));
    },
    'ID_DUPLICADO',
  ],
  [
    'itens duplicados',
    (p) => {
      p.questoes[0].itens.push(structuredClone(p.questoes[0].itens[0]));
    },
    'ID_DUPLICADO',
  ],
  [
    'versão textual',
    (p) => {
      p.versao = '1';
    },
    'TIPO_INVALIDO',
    '/versao',
  ],
  [
    'versão fracionária',
    (p) => {
      p.versao = 1.5;
    },
    'TIPO_INVALIDO',
  ],
  [
    'versão zero',
    (p) => {
      p.versao = 0;
    },
    'VALOR_INVALIDO',
  ],
  [
    'versão acima do limite',
    (p) => {
      p.versao = 10000;
    },
    'VALOR_INVALIDO',
  ],
  [
    'perfil desconhecido',
    (p) => {
      p.perfil = 'Alice';
    },
    'VALOR_INVALIDO',
  ],
  [
    'matéria desconhecida',
    (p) => {
      p.materia = 'artes';
    },
    'VALOR_INVALIDO',
  ],
  [
    'formato incorreto',
    (p) => {
      p.formato += ' ';
    },
    'VALOR_INVALIDO',
  ],
  [
    'tipo misto',
    (p) => {
      p.questoes[0].tipo = 'misto';
    },
    'VALOR_INVALIDO',
  ],
  [
    'campo ausente',
    (p) => {
      delete p.questoes[0].bloco;
    },
    'CAMPO_OBRIGATORIO',
    '/questoes/0/bloco',
  ],
  [
    'null em vez de objeto',
    (p) => {
      p.questoes[0].itens[0] = null;
    },
    'TIPO_INVALIDO',
  ],
  [
    'array em vez de objeto',
    (p) => {
      p.questoes[0] = [];
    },
    'TIPO_INVALIDO',
  ],
  [
    'objeto em vez de array',
    (p) => {
      p.questoes = {};
    },
    'TIPO_INVALIDO',
  ],
  [
    'número em texto',
    (p) => {
      p.titulo = 1;
    },
    'TIPO_INVALIDO',
  ],
  [
    'título vazio',
    (p) => {
      p.titulo = ' \t\n';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'título longo',
    (p) => {
      p.titulo = 'x'.repeat(121);
    },
    'TEXTO_INVALIDO',
  ],
  [
    'bloco longo',
    (p) => {
      p.questoes[0].bloco = 'x'.repeat(81);
    },
    'TEXTO_INVALIDO',
  ],
  [
    'pergunta longa',
    (p) => {
      p.questoes[0].itens[0].pergunta = 'x'.repeat(501);
    },
    'TEXTO_INVALIDO',
  ],
  [
    'resposta longa',
    (p) => {
      p.questoes[0].itens[0].respostas = ['x'.repeat(161)];
    },
    'TEXTO_INVALIDO',
  ],
  [
    'HTML',
    (p) => {
      p.titulo = '<script>throw 1</script>';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'HTML fim',
    (p) => {
      p.titulo = '>';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'controle antes de trim',
    (p) => {
      p.titulo = '\fExemplo';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'controle NUL',
    (p) => {
      p.titulo = '\u0000';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'DEL',
    (p) => {
      p.titulo = 'a\u007f';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'bidi',
    (p) => {
      p.titulo = 'a\u202e';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'isolador bidi',
    (p) => {
      p.titulo = 'a\u2066';
    },
    'TEXTO_INVALIDO',
  ],
  [
    'opções ausentes',
    (p) => {
      delete p.questoes[0].itens[0].opcoes;
    },
    'CAMPO_OBRIGATORIO',
  ],
  [
    'uma opção',
    (p) => {
      p.questoes[0].itens[0].opcoes = ['Sol'];
    },
    'VALOR_INVALIDO',
  ],
  [
    'sete opções',
    (p) => {
      p.questoes[0].itens[0].opcoes = Array(7).fill('Sol');
    },
    'VALOR_INVALIDO',
  ],
  [
    'sem gabarito',
    (p) => {
      p.questoes[0].itens[0].respostas = [];
    },
    'VALOR_INVALIDO',
  ],
  [
    'gabarito inexistente',
    (p) => {
      p.questoes[0].itens[0].respostas = ['Marte'];
    },
    'GABARITO_INVALIDO',
  ],
  [
    'gabarito não literal',
    (p) => {
      p.questoes[0].itens[0].respostas = ['sol'];
    },
    'GABARITO_INVALIDO',
  ],
  [
    'dois gabaritos',
    (p) => {
      p.questoes[0].itens[0].respostas = ['Sol', 'Lua'];
    },
    'GABARITO_INVALIDO',
  ],
  [
    'opções ambíguas',
    (p) => {
      p.questoes[0].itens[0].opcoes = ['Sol', 'sól'];
    },
    'OPCAO_DUPLICADA',
  ],
  [
    'duplicata com espaços/pontuação',
    (p) => {
      p.questoes[0].itens[0].opcoes = ['Sol !', ' sol! '];
    },
    'OPCAO_DUPLICADA',
  ],
  [
    'campos com opções',
    (p) => {
      p.questoes[0].tipo = 'campos';
    },
    'PROPRIEDADE_DESCONHECIDA',
  ],
  [
    'campos com variantes equivalentes',
    (p) => {
      p.questoes[0].tipo = 'campos';
      delete p.questoes[0].itens[0].opcoes;
      p.questoes[0].itens[0].respostas = ['Água', 'a\u0301GUA'];
    },
    'OPCAO_DUPLICADA',
  ],
  [
    'seis variantes',
    (p) => {
      p.questoes[0].tipo = 'campos';
      delete p.questoes[0].itens[0].opcoes;
      p.questoes[0].itens[0].respostas = ['a', 'b', 'c', 'd', 'e', 'f'];
    },
    'VALOR_INVALIDO',
  ],
];
for (const [nome, mutar, codigo, local] of negativos) {
  test(`recusa ${nome}`, async () => {
    const p = pacote();
    mutar(p);
    await recusa(JSON.stringify(p), codigo, local);
  });
}

for (const [nome, selecionar] of [
  ['raiz', (p) => p],
  ['questão', (p) => p.questoes[0]],
  ['item', (p) => p.questoes[0].itens[0]],
]) {
  test(`schema fechado na ${nome}, pointer escapado`, async () => {
    const p = pacote();
    selecionar(p)['x~/y'] = 'sem executar';
    const r = await recusa(JSON.stringify(p), 'PROPRIEDADE_DESCONHECIDA');
    assert.ok(r.erros[0].caminho.endsWith('/x~0~1y'));
  });
}

for (const [nome, fonte, codigo] of [
  [
    'duplicata direta',
    CANONICO.replace('"id":"sintetico"', '"id":"sintetico","id":"outro"'),
    'CHAVE_DUPLICADA',
  ],
  [
    'duplicata Unicode',
    CANONICO.replace('"id":"sintetico"', '"id":"sintetico","\\u0069d":"outro"'),
    'CHAVE_DUPLICADA',
  ],
  [
    'duplicata aninhada',
    CANONICO.replace('"id":"i1"', '"id":"i1","i\\u0064":"i2"'),
    'CHAVE_DUPLICADA',
  ],
  ['prototype', '{"prototype":0}', 'VALOR_INVALIDO'],
  ['constructor', '{"constructor":0}', 'VALOR_INVALIDO'],
  ['proto escapado', '{"\\u005f_proto__":0}', 'VALOR_INVALIDO'],
  ['surrogate alto escapado', CANONICO.replace('Exemplo', '\\ud800'), 'UNICODE_INVALIDO'],
  ['surrogate baixo escapado', CANONICO.replace('Exemplo', '\\udfff'), 'UNICODE_INVALIDO'],
  ['surrogate literal', CANONICO.replace('Exemplo', '\ud800'), 'UNICODE_INVALIDO'],
  ['surrogate em chave', '{"\\ud800":0}', 'UNICODE_INVALIDO'],
  ['BOM texto', '\ufeff' + CANONICO, 'BOM_PROIBIDO'],
  ['profundidade nove', '['.repeat(9) + '0' + ']'.repeat(9), 'LIMITE_ESTRUTURA'],
  ['10001 tokens', '[' + Array(5000).fill('0').join(',') + ']', 'LIMITE_ESTRUTURA'],
]) {
  test(`léxico: ${nome}`, () => recusa(fonte, codigo));
}
for (const fonte of [
  '',
  '{} {}',
  '[}',
  '{"a":}',
  '{"a":1,}',
  '{"a":01}',
  '{"a":+1}',
  '{"a":NaN}',
  '{"a":true false}',
  '// comentário\n{}',
  '{"a":"\\x41"}',
  '{"a":"linha\ncrua"}',
  '[1 2]',
  'undefined',
  '{"x":(()=>{throw 1})()}',
]) {
  test(`JSON inválido ${JSON.stringify(fonte)}`, () => recusa(fonte, 'JSON_INVALIDO'));
}

test('limite de bytes inclusivo e excesso multibyte', async () => {
  const bytes = Buffer.byteLength(CANONICO);
  assert.equal(
    (await validarPacote(Buffer.from(CANONICO + ' '.repeat(LIMITES.bytes - bytes)))).digest,
    HASH
  );
  await recusa(Buffer.from(CANONICO + ' '.repeat(LIMITES.bytes - bytes + 1)), 'LIMITE_BYTES');
  await recusa('á'.repeat(131073), 'LIMITE_BYTES');
  await recusa('x'.repeat(262145), 'LIMITE_BYTES');
});

test('tokens e profundidade nos limites não são recusados pelo scanner', async () => {
  await recusa('[' + Array(4999).fill('0').join(',') + ']', 'TIPO_INVALIDO');
  await recusa('['.repeat(8) + '0' + ']'.repeat(8), 'TIPO_INVALIDO');
});

for (const bytes of [
  [0xc0, 0xaf],
  [0xed, 0xa0, 0x80],
  [0xf4, 0x90, 0x80, 0x80],
  [0xe2, 0x82],
  [0xff],
  [0xef, 0xbb, 0xbf, 0x7b, 0x7d],
]) {
  test(`bytes inválidos ${bytes.join('-')}`, () =>
    recusa(new Uint8Array(bytes), bytes[0] === 0xef ? 'BOM_PROIBIDO' : 'UTF8_INVALIDO'));
}

test('caracteres astral contam um ponto; LF/TAB preservados e CR normalizado', async () => {
  const p = pacote();
  p.titulo = '😀'.repeat(120);
  p.questoes[0].dica = 'Uma\r\nlinha\tduas';
  const r = await validar(p);
  assert.equal(r.valido, true);
  assert.equal(r.pacoteNormalizado.questoes[0].dica, 'Uma\nlinha\tduas');
  p.titulo += '😀';
  await recusa(JSON.stringify(p), 'TEXTO_INVALIDO');
});

test('arrays e diferenças reais preservam a identidade distinta', async () => {
  const p = pacote();
  p.questoes[0].itens[0].opcoes.reverse();
  const r = await validar(p);
  assert.equal(r.valido, true);
  assert.notEqual(r.digest, HASH);
  for (const mutar of [
    (x) => {
      x.perfil = 'mariana';
    },
    (x) => {
      x.versao = 2;
    },
    (x) => {
      x.titulo = 'exemplo';
    },
  ]) {
    const v = pacote();
    mutar(v);
    assert.notEqual((await validar(v)).digest, HASH);
  }
});

test('erros ordenados, limitados e sem dados brutos', async () => {
  const p = pacote();
  for (let i = 0; i < 24; i++) p['extra' + i] = 'SEGREDO';
  const r = await recusa(JSON.stringify(p), 'PROPRIEDADE_DESCONHECIDA');
  assert.equal(r.erros.length, 20);
  assert.equal(r.truncado, true);
  assert.deepEqual(
    r.erros.map((e) => e.caminho),
    r.erros.map((e) => e.caminho).sort()
  );
  assert.equal(JSON.stringify(r).includes('SEGREDO'), false);
});

test('não muta bytes e não lê getters nem executa objeto de entrada', async () => {
  const bytes = Buffer.from(CANONICO);
  const copia = Buffer.from(bytes);
  await validarPacote(bytes);
  assert.deepEqual(bytes, copia);
  const obj = Object.freeze({
    get titulo() {
      throw new Error('não executar');
    },
  });
  await recusa(obj, 'TIPO_INVALIDO');
  assert.equal(Object.isFrozen(obj), true);
});

test('capacidade criptográfica ausente e falha explícita', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  try {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
    await recusa(CANONICO, 'CRIPTO_INDISPONIVEL');
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        subtle: {
          async digest() {
            throw new Error('não divulgar');
          },
        },
      },
    });
    const r = await recusa(CANONICO, 'FALHA_DIGEST');
    assert.equal(JSON.stringify(r).includes('não divulgar'), false);
  } finally {
    Object.defineProperty(globalThis, 'crypto', descriptor);
  }
});

test('vetores de comparação conferidos na função efetiva do motor sem flags', async () => {
  for (const [a, b] of [
    ['ÁGUA', 'agua'],
    ['Sol  !', 'sol!'],
    ['a\t b', 'A B'],
    ['coração', 'coracao'],
  ]) {
    const p = pacote();
    p.questoes[0].itens[0].opcoes = [a, b];
    p.questoes[0].itens[0].respostas = [a];
    await recusa(JSON.stringify(p), 'OPCAO_DUPLICADA');
  }
});

// LAB.2D.6A: validação pura separada da admissão operacional v1.
const { validarContratoDitado } = require('../../ambiente_interativo/js/lab-validador.js');
function contratoDitado(texto = 'café', unidade) {
  return {
    formato: 'lab-questionarios-v2',
    id: 'ditado-sintetico',
    versao: 1,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: 'Escutar e escrever',
    questoes: [
      {
        id: 'q1',
        bloco: 'Escrita',
        titulo: 'Escute com atenção',
        instrucao: 'Ouça e escreva.',
        tipo: 'ditado',
        idioma: 'pt-BR',
        ...(unidade ? { unidade } : {}),
        itens: [{ id: 'i1', texto }],
      },
    ],
  };
}
const validarDitado = (p) => validarContratoDitado(JSON.stringify(p));
for (const idioma of ['pt-BR', 'en-US'])
  for (const unidade of ['palavra', 'frase'])
    test(`LAB.2D.6A ${idioma}/${unidade}: contrato analítico válido e admissão revalidada 6C.2`, async () => {
      const p = contratoDitado(unidade === 'frase' ? 'A casa é azul.' : 'café', unidade);
      p.questoes[0].idioma = idioma;
      const antes = JSON.stringify(p);
      const r = await validarDitado(p);
      assert.equal(r.valido, true);
      assert.equal(r.admissaoOperacional, false);
      assert.equal(JSON.stringify(p), antes);
      assert.equal(r.digestContrato, crypto.createHash('sha256').update(r.canonico).digest('hex'));
      assert.equal('digest' in r, false);
      assert.equal((await validar(p)).valido, true);
      assert.equal((await validar(p)).digest, r.digestContrato);
    });
test('LAB.2D.6A palavra padrão, ordem de campos e escapes são determinísticos', async () => {
  const p = contratoDitado();
  const r = await validarDitado(p);
  p.questoes[0].unidade = 'palavra';
  assert.equal((await validarDitado(p)).digestContrato, r.digestContrato);
  const inverso = (v) =>
    Array.isArray(v)
      ? v.map(inverso)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v)
              .reverse()
              .map(([k, x]) => [k, inverso(x)])
          )
        : v;
  assert.deepEqual(
    await validarContratoDitado(JSON.stringify(inverso(p), null, 2).replace('café', 'caf\\u00e9')),
    r
  );
});
for (const [nome, mutar] of [
  [
    'idioma',
    (p) => {
      p.questoes[0].idioma = 'pt-PT';
    },
  ],
  [
    'tipo',
    (p) => {
      p.questoes[0].tipo = 'campos';
    },
  ],
  [
    'unidade',
    (p) => {
      p.questoes[0].unidade = 'texto';
    },
  ],
  [
    'idioma ausente',
    (p) => {
      delete p.questoes[0].idioma;
    },
  ],
  [
    'texto ausente',
    (p) => {
      delete p.questoes[0].itens[0].texto;
    },
  ],
  [
    'instrução ausente',
    (p) => {
      delete p.questoes[0].instrucao;
    },
  ],
  [
    'tipo de texto',
    (p) => {
      p.questoes[0].itens[0].texto = 5;
    },
  ],
  [
    'vazio',
    (p) => {
      p.questoes[0].itens[0].texto = '';
    },
  ],
  [
    'NFD',
    (p) => {
      p.questoes[0].itens[0].texto = 'cafe\u0301';
    },
  ],
  [
    'espaço inicial',
    (p) => {
      p.questoes[0].itens[0].texto = ' café';
    },
  ],
  [
    'espaço repetido',
    (p) => {
      p.questoes[0].unidade = 'frase';
      p.questoes[0].itens[0].texto = 'A  casa';
    },
  ],
  [
    'linha nova',
    (p) => {
      p.questoes[0].itens[0].texto = 'ca\nfé';
    },
  ],
  [
    'zero width',
    (p) => {
      p.questoes[0].itens[0].texto = 'ca\u200bfé';
    },
  ],
  [
    'bidi',
    (p) => {
      p.questoes[0].itens[0].texto = 'ca\u202efé';
    },
  ],
  [
    'surrogate',
    (p) => {
      p.questoes[0].itens[0].texto = '\ud800';
    },
  ],
  [
    'astral falado',
    (p) => {
      p.questoes[0].itens[0].texto = '😀';
    },
  ],
  [
    'HTML',
    (p) => {
      p.questoes[0].itens[0].texto = '<script>alert(1)</script>';
    },
  ],
  [
    'URL',
    (p) => {
      p.questoes[0].itens[0].texto = 'https://exemplo.test/a.mp3';
    },
  ],
  [
    'JavaScript',
    (p) => {
      p.questoes[0].itens[0].texto = 'javascript:alert(1)';
    },
  ],
  [
    'áudio externo',
    (p) => {
      p.questoes[0].audioUrl = 'a.mp3';
    },
  ],
  [
    'gabarito duplicado',
    (p) => {
      p.questoes[0].itens[0].respostas = ['café'];
    },
  ],
  [
    'ID duplicado',
    (p) => {
      p.questoes[0].itens[0].id = 'q1';
    },
  ],
  [
    'questões demais',
    (p) => {
      p.questoes = Array(31).fill(p.questoes[0]);
    },
  ],
  [
    'itens demais',
    (p) => {
      p.questoes[0].itens = Array(7).fill(p.questoes[0].itens[0]);
    },
  ],
  [
    'sem itens',
    (p) => {
      p.questoes[0].itens = [];
    },
  ],
  [
    'frase de uma palavra',
    (p) => {
      p.questoes[0].unidade = 'frase';
    },
  ],
])
  test('LAB.2D.6A recusa ' + nome, async () => {
    const p = contratoDitado();
    mutar(p);
    const r = await validarDitado(p);
    assert.equal(r.valido, false);
    assert.ok(r.erros.every((e) => e.mensagem && e.caminho !== undefined));
    assert.equal('digestContrato' in r, false);
  });
test('LAB.2D.6A limites exatos de UTF-16, palavras, frase e metadados', async () => {
  assert.equal((await validarDitado(contratoDitado('a'.repeat(40)))).valido, true);
  assert.equal((await validarDitado(contratoDitado('a'.repeat(41)))).valido, false);
  const frase = ['a'.repeat(40), 'b'.repeat(40), 'c'.repeat(40), 'd'.repeat(37)].join(' ');
  assert.equal(frase.length, 160);
  assert.equal((await validarDitado(contratoDitado(frase, 'frase'))).valido, true);
  assert.equal((await validarDitado(contratoDitado(frase + '.', 'frase'))).valido, false);
  assert.equal(
    (await validarDitado(contratoDitado(Array(12).fill('Sol').join(' '), 'frase'))).valido,
    true
  );
  assert.equal(
    (await validarDitado(contratoDitado(Array(13).fill('Sol').join(' '), 'frase'))).valido,
    false
  );
  const p = contratoDitado();
  p.titulo = '😀'.repeat(60);
  assert.equal((await validarDitado(p)).valido, true);
  p.titulo += 'a';
  assert.equal((await validarDitado(p)).valido, false);
});
test('6C.2 contrato v2 revalidado amplia explicitamente backup-v1 sem alterar v1', async () => {
  const p = contratoDitado();
  const r = await validarDitado(p);
  const Backup = require('../../ambiente_interativo/js/lab-backup.js');
  const backup = {
    formato: 'lab-backup-v1',
    versao: 1,
    entradas: [
      { pacote: p, digest: r.digestContrato, situacaoAdministrativa: 'ativa', sessoes: {} },
    ],
  };
  assert.equal((await Backup.validarBackup(JSON.stringify(backup))).valido, true);
  const v1 = await validarPacote(CANONICO);
  assert.equal(v1.digest, HASH);
  assert.equal((await validarContratoDitado(CANONICO)).valido, false);
});

// LAB.2D.6C.1: reconhecimento compartilhado não concede admissão.
test('6C.1 reconhecimento versionado preserva vetores v1 e recalcula v2 original', async () => {
  const { reconhecerPacote } = require('../../ambiente_interativo/js/lab-validador.js');
  const v1 = await reconhecerPacote(CANONICO);
  assert.equal(v1.canonico, CANONICO);
  assert.equal(v1.digest, HASH);
  assert.equal(v1.admissaoOperacional, false);
  const p = contratoDitado();
  const antes = JSON.stringify(p);
  const v2 = await reconhecerPacote(antes);
  assert.equal(v2.valido, true);
  assert.equal(v2.admissaoOperacional, false);
  assert.equal(v2.pacoteNormalizado.formato, 'lab-questionarios-v2');
  assert.equal(JSON.parse(v2.canonico).questoes[0].unidade, 'palavra');
  assert.equal(v2.digest, crypto.createHash('sha256').update(v2.canonico).digest('hex'));
  assert.equal(JSON.stringify(p), antes);
  assert.equal((await reconhecerPacote(v2.canonico)).digest, v2.digest);
  assert.equal((await validarPacote(v2.canonico)).digest, v2.digest);
  assert.notEqual(v2.digest, (await reconhecerPacote(CANONICO)).digest);
});

test('6C.1 reconhecimento revalida bytes e não aceita objetos, marcas ou digest fornecido', async () => {
  const { reconhecerPacote } = require('../../ambiente_interativo/js/lab-validador.js');
  const p = contratoDitado();
  for (const d of [p, { valido: true, pacoteNormalizado: p, digest: HASH }])
    assert.equal((await reconhecerPacote(d)).valido, false);
  for (const campo of ['digest', 'digestContrato', 'admissaoOperacional']) {
    assert.equal((await reconhecerPacote(JSON.stringify({ ...p, [campo]: HASH }))).valido, false);
  }
  for (const formato of ['lab-questionarios-v3', 'lab-backup-v1', null])
    assert.equal((await reconhecerPacote(JSON.stringify({ ...p, formato }))).valido, false);
  const antes = await reconhecerPacote(JSON.stringify(p));
  p.questoes[0].itens[0].texto = 'árvore';
  assert.notEqual((await reconhecerPacote(JSON.stringify(p))).digest, antes.digest);
});

test('6C.1 reconhecimento mantém limites Unicode, UTF-16 e transporte sem reparação', async () => {
  const { reconhecerPacote } = require('../../ambiente_interativo/js/lab-validador.js');
  for (const texto of ['a'.repeat(41), 'cafe\u0301', 'Sol Lua', 'a\u200bb', '\ud800'])
    assert.equal(
      (await reconhecerPacote(JSON.stringify(contratoDitado(texto)))).valido,
      false,
      texto
    );
  const entrada = JSON.stringify(contratoDitado());
  assert.equal((await reconhecerPacote(entrada + ' '.repeat(LIMITES.bytes))).valido, false);
});

test('6C.2 admissão revalida original, não aceita autorização/digest ou versão desconhecida', async () => {
  const p = contratoDitado();
  const r = await validar(p);
  assert.equal(r.valido, true);
  assert.equal((await validarPacote({ ...r, valido: true })).valido, false);
  for (const campo of ['digest', 'digestContrato', 'autorizado'])
    assert.equal((await validar({ ...p, [campo]: r.digest })).valido, false);
  assert.equal((await validar({ ...p, formato: 'lab-questionarios-v3' })).valido, false);
});
