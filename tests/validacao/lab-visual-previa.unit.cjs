/* global Uint8Array, ArrayBuffer, SharedArrayBuffer, TextEncoder, TextDecoder, DecompressionStream, setImmediate */
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const f = require('./helpers/lab-visual-fixture.cjs');
const z = require('./helpers/lab-visual-zip-fixture.cjs');
const p = require('./helpers/lab-visual-previa-fixture.cjs');
const {
  criarPreparacaoPreviaVisual: criar,
} = require('../../ambiente_interativo/js/lab-visual-previa.js');
const {
  analisarTransporteZipVisual: analisar,
} = require('../../ambiente_interativo/js/lab-visual-zip.js');
const logico = require('../../ambiente_interativo/js/lab-visual-analise.js');
const indice = require('./fixtures/lab-visual-zip/hashes.json');
const base = execFileSync(
  'git',
  ['show', '9af0139d98c22ff0f16f81c6fa0151fd4fda71b2:ambiente_interativo/js/lab-visual-zip.js'],
  { encoding: 'utf8' }
);
const coreSrc = fs.readFileSync(
  path.join(__dirname, '../../ambiente_interativo/js/lab-visual-zip-nucleo.js'),
  'utf8'
);
function carregar(src, validar = logico.analisarContratoVisual, crypto = globalThis.crypto) {
  const modulo = { exports: {} };
  const sandbox = {
    module: modulo,
    require: (nome) => {
      assert.equal(nome, './lab-visual-analise.js');
      return { analisarContratoVisual: validar };
    },
    Uint8Array,
    ArrayBuffer,
    TextEncoder,
    TextDecoder,
    DecompressionStream,
    crypto,
  };
  return { api: (vm.runInNewContext(src, sandbox), modulo.exports), sandbox };
}
const antes = carregar(base).api.analisarTransporteZipVisual;
const simples = () => p.zip(f.vetor(1));
const norm = (v) => JSON.parse(JSON.stringify(v));
function semDados(v, prototipo = Object.prototype) {
  const proibidos = new Set([
    'gabarito',
    'alternativaId',
    'respostas',
    'recursoId',
    'sha256',
    'mime',
    'bytes',
    'perfil',
    'materia',
    'versao',
    'digestPacote',
  ]);
  function visitar(x) {
    if (!x || typeof x !== 'object') return;
    assert.equal(ArrayBuffer.isView(x), false);
    assert.ok(Object.isFrozen(x));
    assert.ok(Array.isArray(x) || Object.getPrototypeOf(x) === prototipo);
    for (const k of Reflect.ownKeys(x)) {
      assert.equal(typeof k, 'string');
      const d = Object.getOwnPropertyDescriptor(x, k);
      assert.ok(Object.hasOwn(d, 'value'));
      assert.ok(d.enumerable || (Array.isArray(x) && k === 'length'));
    }
    for (const [k, v] of Object.entries(x)) {
      assert.ok(!proibidos.has(k), k);
      assert.notEqual(typeof v, 'function');
      visitar(v);
    }
  }
  visitar(v);
  const json = JSON.stringify(v);
  for (const canario of [
    'orig-',
    'admincanario',
    'TituloAdministrativoCanario',
    'RespostaSecretaCanario',
    'AlvoSecretoCanario',
  ])
    assert.ok(!json.includes(canario), canario);
}
for (const [nome, esperado] of Object.entries(indice))
  test('API ZIP integralmente equivalente à base: ' + nome, async () => {
    const b = fs.readFileSync(path.join(__dirname, 'fixtures/lab-visual-zip', nome));
    assert.deepEqual(norm(await analisar(b)), norm(await antes(b)));
    assert.equal((await analisar(b)).digestPacote, esperado.digestPacote);
    const c = criar(),
      r = await c.preparar(b);
    assert.equal(r.status, 'contexto-disponivel');
    assert.equal(r.admissaoOperacional, false);
    assert.equal(r.decodificacao, 'pendente');
    c.descartar();
  });
test('erros públicos idênticos: truncagens e corrupção de cada byte', async () => {
  const b = simples();
  for (let i = 0; i < b.length; i++) {
    assert.deepEqual(norm(await analisar(b.subarray(0, i))), norm(await antes(b.subarray(0, i))));
    const m = Buffer.from(b);
    m[i] ^= 255;
    assert.deepEqual(norm(await analisar(m)), norm(await antes(m)));
  }
  for (const args of [[], [null], [{}], [b, {}], [new Uint8Array(new SharedArrayBuffer(2))]])
    assert.deepEqual(norm(await analisar(...args)), norm(await antes(...args)));
});
test('V0–V4: pipeline privado único, um analisador por preparação', async () => {
  let calls = 0;
  const api = carregar(coreSrc, async (...args) => {
    calls++;
    return logico.analisarContratoVisual(...args);
  }).api;
  for (let i = 0; i < 5; i++) {
    const x = f.vetor(i),
      b = p.zip(x),
      c = api.criarPreparacaoPreviaVisual();
    const n = calls,
      r = await c.preparar(b);
    assert.equal(r.status, 'contexto-disponivel');
    assert.equal(calls, n + 1);
    assert.equal((await api.analisarTransporteZipVisual(b)).digestPacote, f.digests[i]);
    c.descartar();
  }
  // O parser e o pipeline não são métodos da API interna ou pública.
  assert.deepEqual(Object.keys(api).sort(), [
    'analisarTransporteZipVisual',
    'criarPreparacaoIlustradaVisual',
    'criarPreparacaoPreviaVisual',
  ]);
});
test('projeção selecionada, sem campos avaliativos em qualquer profundidade', async () => {
  const x = p.canarios(),
    c = criar(),
    r = await c.preparar(p.zip(x));
  assert.equal(r.status, 'contexto-disponivel', JSON.stringify(r));
  semDados(r.projecao);
  assert.equal(r.projecao.formato, 'lab-v3-previa-1');
  assert.equal(r.projecao.questoes[0].instrucao, x.m.questoes[0].instrucao);
  assert.equal(r.projecao.questoes[0].itens[0].alternativas[0].texto, 'Alternativa legítima');
  assert.deepEqual(r.projecao.questoes[1].itens[0].campo, { tipo: 'demonstrativo', valor: '' });
  assert.deepEqual(Object.keys(r.projecao.questoes[2]).sort(), [
    'id',
    'idioma',
    'itens',
    'tipo',
    'titulo',
    'unidade',
  ]);
  assert.equal(r.projecao.questoes[2].itens[0].rotulo, 'Ditado — item 1');
  assert.throws(() => r.projecao.questoes.push({}), TypeError);
  assert.throws(() => {
    r.projecao.questoes[0].titulo = 'mudou';
  }, TypeError);
  c.descartar();
});
test('ordem de grupos, elementos e referências intercaladas preservada', async () => {
  const x = z.composto(),
    c = criar(),
    r = await c.preparar(p.zip(x)),
    g = r.projecao.questoes[0].visuais[0];
  assert.deepEqual(
    g.grupos.map((v) => v.rotulo),
    ['Segundo', 'Primeiro']
  );
  assert.deepEqual(g.grupos[0].elementoIds, [g.elementos[3].id, g.elementos[1].id]);
  assert.deepEqual(g.grupos[1].elementoIds, [g.elementos[2].id, g.elementos[0].id]);
  assert.equal(g.elementos[0].recurso, g.elementos[2].recurso);
  assert.equal(
    g.elementos[0].recurso,
    r.projecao.questoes[0].itens[0].alternativas[0].visuais[0].recurso
  );
  assert.notEqual(g.elementos[0].recurso, g.elementos[1].recurso);
  assert.equal(c.consultarReferencia(g.elementos[0].recurso).informacao.mime, 'image/png');
  assert.deepEqual(Object.keys(g.elementos[0].recurso), []);
  assert.notDeepEqual(
    g.elementos[0].acessibilidade,
    r.projecao.questoes[0].itens[0].alternativas[0].visuais[0].acessibilidade
  );
  c.descartar();
});
test('referências falsas, serializadas e de outro contexto recusadas', async () => {
  const a = criar(),
    b = criar(),
    r = await a.preparar(simples()),
    s = await b.preparar(simples()),
    ref = r.projecao.questoes[0].visuais[0].recurso;
  for (const x of [
    {},
    JSON.parse(JSON.stringify(ref)),
    'https://fora/',
    '0'.repeat(64),
    s.projecao.questoes[0].visuais[0].recurso,
    null,
  ])
    assert.equal(a.consultarReferencia(x).erros[0].codigo, 'PREVIA_REFERENCIA_INVALIDA');
  assert.equal(a.consultarReferencia(ref).status, 'referencia-reconhecida');
  a.descartar();
  a.descartar();
  assert.equal(a.consultarEstado().estado, 'descartado');
  assert.equal(a.consultarReferencia(ref).status, 'recusado');
  assert.equal((await a.preparar(simples())).erros[0].codigo, 'PREVIA_DESCARTADA');
  assert.equal(
    b.consultarReferencia(s.projecao.questoes[0].visuais[0].recurso).status,
    'referencia-reconhecida'
  );
  b.descartar();
});
test('snapshot antes de await e substituição invalidam referências antigas', async () => {
  const c = criar(),
    b = simples(),
    h = f.hash(b),
    pending = c.preparar(b);
  b.fill(0);
  const r = await pending;
  assert.equal(r.status, 'contexto-disponivel');
  assert.notEqual(f.hash(b), h);
  const ref = r.projecao.questoes[0].visuais[0].recurso;
  const novo = c.preparar(p.zip(f.vetor(0)));
  assert.equal(c.consultarReferencia(ref).status, 'recusado');
  await novo;
  assert.equal(c.consultarReferencia(ref).status, 'recusado');
  c.descartar();
});
test('descarte e respostas atrasadas nunca reativam contexto', async () => {
  let liberar;
  const api = carregar(coreSrc, async (...args) => {
    await new Promise((r) => {
      liberar = r;
    });
    return logico.analisarContratoVisual(...args);
  }).api;
  const c = api.criarPreparacaoPreviaVisual(),
    pendente = c.preparar(simples());
  while (!liberar) await new Promise((r) => setImmediate(r));
  c.descartar();
  liberar();
  const r = await pendente;
  assert.equal(r.erros[0].codigo, 'PREVIA_DESCARTADA');
  assert.equal(c.consultarEstado().estado, 'descartado');
});
test('preparações concorrentes: vence a mais recente, instâncias independentes', async () => {
  const gates = [];
  const api = carregar(coreSrc, async (...args) => {
    await new Promise((r) => gates.push(r));
    return logico.analisarContratoVisual(...args);
  }).api;
  const a = api.criarPreparacaoPreviaVisual(),
    b = api.criarPreparacaoPreviaVisual();
  const antigo = a.preparar(simples()),
    novo = a.preparar(p.zip(f.vetor(0))),
    outro = b.preparar(simples());
  while (gates.length < 3) await new Promise((r) => setImmediate(r));
  // Ordem de conclusão deliberadamente diferente da ordem de início.
  for (const g of [...gates].reverse()) g();
  const [r, s, t] = await Promise.all([antigo, novo, outro]);
  assert.equal(r.erros[0].codigo, 'PREVIA_DESCARTADA');
  assert.equal(s.status, 'contexto-disponivel');
  assert.equal(t.status, 'contexto-disponivel');
  assert.equal(a.consultarEstado().estado, 'contexto-disponivel');
  a.descartar();
  b.descartar();
});
test('falha durante substituição remove direitos antigos e não expõe resultado parcial', async () => {
  const c = criar(),
    r = await c.preparar(simples()),
    ref = r.projecao.questoes[0].visuais[0].recurso;
  const falha = await c.preparar(Buffer.from('invalido'));
  assert.equal(falha.status, 'recusado');
  assert.equal(c.consultarEstado().estado, 'falha');
  assert.equal(c.consultarReferencia(ref).status, 'recusado');
  assert.ok(!('projecao' in falha));
  assert.ok(!('digestPacote' in falha));
  c.descartar();
});
test('relatórios externos e buffers separados não são prova de validade', async () => {
  const c = criar(),
    b = simples(),
    r = await analisar(b);
  for (const args of [[r], [b, []], [{ relatorio: r, recursos: [] }], [r.manifesto]])
    assert.equal((await c.preparar(...args)).status, 'recusado');
  c.descartar();
});
test('falha tardia após associação privada invalida referências e permite recuperação isolada', async () => {
  const ancora = 'const projecao = projetar(contexto.manifesto, porHash);';
  assert.equal(
    coreSrc.split(ancora).length,
    2,
    'instrumentar exatamente a etapa posterior ao contexto'
  );
  const instrumentado = coreSrc.replace(
    ancora,
    'globalThis.injetarFalhaTardia(contexto); ' + ancora
  );
  let reterProxima = false,
    liberarAntiga,
    avisarEntrada,
    armado = false,
    injetadas = 0;
  let parcial;
  const entrou = new Promise((r) => {
    avisarEntrada = r;
  });
  const carregado = carregar(instrumentado, async (...args) => {
    if (reterProxima) {
      reterProxima = false;
      await new Promise((r) => {
        liberarAntiga = r;
        avisarEntrada();
      });
    }
    return logico.analisarContratoVisual(...args);
  });
  carregado.sandbox.injetarFalhaTardia = (ctx) => {
    if (!armado) return;
    armado = false;
    injetadas++;
    parcial = ctx; // Observável somente no VM instrumentado deste teste.
    throw new Error('ExcecaoPrivadaCanario');
  };
  const c = carregado.api.criarPreparacaoPreviaVisual();
  const independente = carregado.api.criarPreparacaoPreviaVisual();
  let antiga;
  try {
    const inicial = await c.preparar(simples());
    assert.equal(inicial.status, 'contexto-disponivel');
    const anterior = inicial.projecao.questoes[0].visuais[0].recurso;
    assert.equal(c.consultarReferencia(anterior).status, 'referencia-reconhecida');
    const outra = await independente.preparar(simples());
    assert.equal(outra.status, 'contexto-disponivel');
    const outraRef = outra.projecao.questoes[0].visuais[0].recurso;

    reterProxima = true;
    antiga = c.preparar(simples());
    await entrou; // A preparação antiga está parada no analisador, antes da substituição.
    assert.equal(c.consultarReferencia(anterior).status, 'recusado');
    const x = p.canarios(),
      bytes = p.zip(x),
      esperado = await analisar(bytes);
    assert.equal(esperado.status, 'analise-concluida');
    armado = true;
    const falha = await c.preparar(bytes);

    assert.equal(injetadas, 1, 'a exceção deve ocorrer após a associação privada');
    assert.equal(parcial.digest, esperado.digestPacote);
    assert.equal(parcial.manifesto.id, x.m.id);
    assert.equal(parcial.manifesto.questoes[2].itens[0].texto, 'AlvoSecretoCanario');
    assert.equal(parcial.recursos.size, 2);
    assert.equal(parcial.referencias.size, 2);
    for (const [hash, b] of parcial.recursos) assert.equal(f.hash(b), hash);
    const refsParciais = [...parcial.referencias.values()];
    assert.deepEqual(norm(falha), {
      status: 'recusado',
      erros: [{ codigo: 'PREVIA_PREPARACAO_FALHOU', caminho: '', origem: 'previa' }],
      truncado: false,
      admissaoOperacional: false,
      decodificacao: 'pendente',
    }); // Forma exata: sem projeção, manifesto, digest, binários ou campos ocultos.
    assert.deepEqual(
      Reflect.ownKeys(falha).sort(),
      ['status', 'erros', 'truncado', 'admissaoOperacional', 'decodificacao'].sort()
    );
    for (const canario of ['AlvoSecretoCanario', 'RespostaSecretaCanario', 'ExcecaoPrivadaCanario'])
      assert.ok(!JSON.stringify(falha).includes(canario));
    assert.equal(c.consultarEstado().estado, 'falha');
    for (const ref of [anterior, ...refsParciais])
      assert.equal(c.consultarReferencia(ref).erros[0].codigo, 'PREVIA_REFERENCIA_INVALIDA');

    liberarAntiga();
    const tardia = await antiga;
    assert.equal(tardia.erros[0].codigo, 'PREVIA_DESCARTADA');
    assert.equal(tardia.admissaoOperacional, false);
    assert.equal(tardia.decodificacao, 'pendente');
    assert.equal(c.consultarEstado().estado, 'falha', 'resultado antigo não reativa o contexto');
    for (const ref of refsParciais) assert.equal(c.consultarReferencia(ref).status, 'recusado');

    const recuperada = await c.preparar(simples());
    assert.equal(recuperada.status, 'contexto-disponivel');
    assert.equal(recuperada.admissaoOperacional, false);
    assert.equal(recuperada.decodificacao, 'pendente');
    semDados(recuperada.projecao, vm.runInNewContext('Object.prototype', carregado.sandbox));
    assert.equal(
      c.consultarReferencia(recuperada.projecao.questoes[0].visuais[0].recurso).status,
      'referencia-reconhecida'
    );
    for (const ref of [anterior, ...refsParciais])
      assert.equal(c.consultarReferencia(ref).status, 'recusado');
    assert.equal(independente.consultarEstado().estado, 'contexto-disponivel');
    const consulta = independente.consultarReferencia(outraRef);
    assert.equal(consulta.status, 'referencia-reconhecida');
    assert.equal(consulta.admissaoOperacional, false);
    assert.equal(consulta.decodificacao, 'pendente');
  } finally {
    armado = false;
    liberarAntiga?.();
    if (antiga) await antiga;
    c.descartar();
    independente.descartar();
  }
});
test('associação privada: digest, catálogo, hash e bytes do mesmo pipeline', async () => {
  // Observação somente neste VM de teste, sem hook ou export no código de produção.
  let contexto;
  const instrumentado = coreSrc.replace(
    'const projecao = projetar(contexto.manifesto, porHash);',
    'globalThis.observar(contexto); const projecao = projetar(contexto.manifesto, porHash);'
  );
  assert.notEqual(instrumentado, coreSrc);
  const carregado = carregar(instrumentado);
  carregado.sandbox.observar = (c) => {
    contexto = c;
  };
  const c = carregado.api.criarPreparacaoPreviaVisual();
  const r = await c.preparar(simples());
  assert.equal(r.status, 'contexto-disponivel');
  assert.equal(contexto.digest, f.digests[1]);
  assert.equal(contexto.recursos.size, 1);
  for (const [hash, b] of contexto.recursos) {
    assert.equal(f.hash(b), hash);
    assert.ok(Object.values(contexto.manifesto.recursos).some((d) => d.sha256 === hash));
  }
  c.descartar();
});
test('todos os conjuntos e descrições contextuais longas são fiéis', async () => {
  for (const apresentacao of ['comparacao', 'sequencia', 'grade']) {
    const x = f.vetor(3),
      v = x.m.questoes[0].visuais[0];
    v.apresentacao = apresentacao;
    v.descricaoRelacao = 'Relação literal < >';
    v.elementos[0].rotulo = 'Primeira';
    v.elementos[0].acessibilidade = {
      tipo: 'essencial',
      descricao: 'Figura A',
      descricaoLonga: 'Linha A\nLinha B',
    };
    const c = criar(),
      r = await c.preparar(p.zip(x)),
      a = r.projecao.questoes[0].visuais[0];
    assert.equal(a.apresentacao, apresentacao);
    assert.equal(a.descricaoRelacao, v.descricaoRelacao);
    assert.deepEqual(a.elementos[0].acessibilidade, v.elementos[0].acessibilidade);
    assert.equal(a.elementos[0].rotulo, 'Primeira');
    c.descartar();
  }
});
test('erros criptográficos preservam códigos da API pública e não criam contexto', async () => {
  for (const crypto of [
    null,
    {
      subtle: {
        digest: async () => {
          throw new Error('segredo');
        },
      },
    },
  ]) {
    const a = carregar(base, logico.analisarContratoVisual, crypto).api;
    const b = carregar(coreSrc, logico.analisarContratoVisual, crypto).api;
    assert.deepEqual(
      norm(await a.analisarTransporteZipVisual(simples())),
      norm(await b.analisarTransporteZipVisual(simples()))
    );
    const c = b.criarPreparacaoPreviaVisual(),
      r = await c.preparar(simples());
    assert.equal(r.status, 'recusado');
    assert.ok(!JSON.stringify(r).includes('segredo'));
    assert.equal(c.consultarEstado().estado, 'falha');
    c.descartar();
  }
});
