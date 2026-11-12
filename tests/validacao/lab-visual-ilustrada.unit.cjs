/* global setImmediate */
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./helpers/lab-visual-ilustrada-fixture.cjs');
const f = require('./helpers/lab-visual-fixture.cjs');
const p = require('./helpers/lab-visual-previa-fixture.cjs');
const zip = require('../../ambiente_interativo/js/lab-visual-zip.js');
const real = require('../../ambiente_interativo/js/lab-visual-ilustrada.js');
const tick = () => new Promise((r) => setImmediate(r));
const norm = (v) => JSON.parse(JSON.stringify(v));
function recusa(r, c) {
  assert.equal(r.status, 'recusado');
  assert.equal(r.erros[0].codigo, c);
  assert.equal(r.admissaoOperacional, false);
  assert.equal(r.decodificacao, 'pendente');
  assert.deepEqual(Object.keys(r).sort(), [
    'admissaoOperacional',
    'decodificacao',
    'erros',
    'status',
    'truncado',
  ]);
  assert.ok(!JSON.stringify(r).includes('segredo'));
}
test('Node não simula decoder, mesmo para pacote sem imagens', async () => {
  const c = real.criarPreparacaoIlustradaVisual();
  recusa(await c.preparar(p.zip(f.vetor(0))), 'ILUSTRADA_RUNTIME_INDISPONIVEL');
  recusa(c.consultarProjecao(), 'ILUSTRADA_INDISPONIVEL');
});
for (let n = 0; n < 5; n++)
  test('VM: pipeline único e V' + n, async () => {
    const e = h.carregar(),
      c = e.api.criarPreparacaoIlustradaVisual(),
      bytes = p.zip(f.vetor(n));
    const r = await c.preparar(bytes);
    assert.equal(r.status, 'ilustracao-disponivel');
    assert.equal(e.stats.calls, 1);
    assert.equal((await zip.analisarTransporteZipVisual(bytes)).digestPacote, f.digests[n]);
    assert.equal(r.decodificacao, n ? 'verificada-no-navegador' : 'sem-recursos');
    assert.equal(e.stats.decode, n >= 3 ? 2 : n ? 1 : 0);
    assert.equal(e.urls.size, 0);
    assert.equal(e.stats.pico, n ? 1 : 0);
    const old = e.api.criarPreparacaoPreviaVisual();
    assert.deepEqual(norm((await old.preparar(bytes)).projecao), norm(r.projecao));
    assert.equal(old.consultarEstado().decodificacao, 'pendente');
    c.descartar();
  });
test('projeção segura, usos autênticos, aliases e descrições contextuais', async () => {
  const e = h.carregar(),
    c = e.api.criarPreparacaoIlustradaVisual(),
    x = p.canarios();
  const r = await c.preparar(p.zip(x)),
    usos = h.imagens(r.projecao);
  for (const s of [
    'AlvoSecretoCanario',
    'RespostaSecretaCanario',
    'orig-',
    'TituloAdministrativoCanario',
  ])
    assert.ok(!JSON.stringify(r).includes(s));
  assert.equal(e.stats.decode, 2);
  const decorativa = usos.find((u) => u.acessibilidade.tipo === 'decorativa');
  const essencial = usos.find((u) => u.acessibilidade.tipo === 'essencial');
  const a = await c.criarApresentacao(decorativa),
    b = await c.criarApresentacao(essencial);
  assert.equal(a.elemento.alt, '');
  assert.equal(b.elemento.alt, essencial.acessibilidade.descricao);
  assert.ok(Object.isFrozen(r.projecao));
  for (const falso of [{}, JSON.parse(JSON.stringify(essencial)), essencial.recurso, null])
    recusa(await c.criarApresentacao(falso), 'ILUSTRADA_REFERENCIA_INVALIDA');
  recusa(await c.criarApresentacao(essencial, {}), 'ILUSTRADA_REFERENCIA_INVALIDA');
  a.liberar();
  a.liberar();
  b.liberar();
  c.descartar();
  assert.equal(e.urls.size, 0);
  assert.equal(c.consultarEstado().observacao.pixelsEmUso, 0);
});
test('mesmo hash compartilha URL, mas cada instância custa pixels', async () => {
  const e = h.carregar(),
    c = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(p.zip(f.vetor(1))),
    u = h.imagens(r.projecao)[0];
  const a = await c.criarApresentacao(u),
    b = await c.criarApresentacao(u);
  assert.equal(a.elemento.src, b.elemento.src);
  assert.equal(e.urls.size, 1);
  assert.equal(c.consultarEstado().observacao.pixelsEmUso, 2);
  a.liberar();
  assert.equal(e.urls.size, 1);
  assert.equal(b.consultarEstado().estado, 'pronta');
  b.liberar();
  assert.equal(e.urls.size, 0);
  assert.equal(b.consultarEstado().estado, 'liberada');
});
test('orçamento inclusivo, recusa imediata e retomada após liberação', async () => {
  const e = h.carregar(),
    c = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(h.pacotePNG(2048, 2048)),
    u = h.imagens(r.projecao)[0];
  const a = await c.criarApresentacao(u),
    b = await c.criarApresentacao(u);
  assert.equal(c.consultarEstado().observacao.pixelsEmUso, 8388608);
  recusa(await c.criarApresentacao(u), 'ILUSTRADA_ORCAMENTO_OCUPADO');
  assert.equal(c.consultarEstado().estado, 'disponivel');
  a.liberar();
  const d = await c.criarApresentacao(u);
  assert.equal(d.status, 'imagem-disponivel');
  b.liberar();
  d.liberar();
  assert.equal(c.consultarEstado().observacao.pixelsEmUso, 0);
});
for (const [opt, code] of [
  ['blobThrow', 'ILUSTRADA_RECURSO_FALHOU'],
  ['urlThrow', 'ILUSTRADA_RECURSO_FALHOU'],
  ['createThrow', 'ILUSTRADA_RECURSO_FALHOU'],
  ['bitmapThrow', 'ILUSTRADA_DECODIFICACAO_FALHOU'],
  ['bitmapWidth', 'ILUSTRADA_DIMENSOES_DIVERGENTES'],
  ['width', 'ILUSTRADA_DIMENSOES_DIVERGENTES'],
])
  test('falha preflight: ' + opt, async () => {
    const opts = { [opt]: opt === 'width' || opt === 'bitmapWidth' ? 2 : true },
      e = h.carregar(opts),
      c = e.api.criarPreparacaoIlustradaVisual();
    recusa(await c.preparar(p.zip(f.vetor(1))), code);
    assert.equal(c.consultarEstado().estado, 'falha');
    assert.equal(e.urls.size, 0);
    recusa(c.consultarProjecao(), 'ILUSTRADA_INDISPONIVEL');
    delete opts[opt];
    assert.equal((await c.preparar(p.zip(f.vetor(1)))).status, 'ilustracao-disponivel');
    assert.equal(e.stats.bitmaps, e.stats.fechados);
  });
test('bitmap nativo concluído após descarte é fechado sem publicar resultado', async () => {
  const d = h.defer(),
    entry = h.defer(),
    opts = {
      bitmap: async () => {
        entry.resolve();
        await d.promise;
      },
    };
  const e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual();
  const pendente = c.preparar(p.zip(f.vetor(1)));
  await entry.promise;
  c.descartar();
  recusa(await pendente, 'ILUSTRADA_INVALIDADA');
  d.resolve();
  await tick();
  assert.equal(e.stats.bitmaps, 1);
  assert.equal(e.stats.fechados, 1);
  assert.equal(e.urls.size, 0);
  assert.equal(c.consultarEstado().estado, 'descartado');
});
test('falha após primeiro recurso: nenhum sucesso parcial, recuperação', async () => {
  const opts = {
      decode: async (_img, n) => {
        if (n === 2) throw Error('segredo-decoder');
      },
    },
    e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual();
  recusa(await c.preparar(p.zip(f.vetor(3))), 'ILUSTRADA_DECODIFICACAO_FALHOU');
  assert.equal(e.stats.decode, 2);
  assert.equal(c.consultarEstado().estado, 'falha');
  assert.equal(e.urls.size, 0);
  recusa(c.consultarProjecao(), 'ILUSTRADA_INDISPONIVEL');
  delete opts.decode;
  assert.equal((await c.preparar(p.zip(f.vetor(3)))).status, 'ilustracao-disponivel');
});
test('descarte pendente resolve cliente, limpa URL e não libera slot físico antes de decode', async () => {
  const d = h.defer(),
    entered = h.defer(),
    opts = {
      decode: async () => {
        entered.resolve();
        await d.promise;
      },
    };
  const e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual();
  const pendente = c.preparar(p.zip(f.vetor(1)));
  await entered.promise;
  c.descartar();
  recusa(await pendente, 'ILUSTRADA_INVALIDADA');
  assert.equal(e.urls.size, 0);
  assert.equal(c.consultarEstado().observacao.decodificacoesAtivas, 1);
  d.resolve();
  await tick();
  assert.equal(c.consultarEstado().estado, 'descartado');
  recusa(await c.preparar(p.zip(f.vetor(1))), 'ILUSTRADA_DESCARTADA');
  assert.equal(c.consultarEstado().observacao.decodificacoesAtivas, 0);
});
test('substituição, fila e referências antigas; instância independente', async () => {
  const opts = {},
    e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual(),
    other = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(p.zip(f.vetor(1))),
    u = h.imagens(r.projecao)[0];
  const ro = await other.preparar(p.zip(f.vetor(1)));
  recusa(await c.criarApresentacao(h.imagens(ro.projecao)[0]), 'ILUSTRADA_REFERENCIA_INVALIDA');
  const d = h.defer(),
    entered = h.defer();
  opts.decode = async () => {
    entered.resolve();
    await d.promise;
  };
  const a = c.criarApresentacao(u);
  await entered.promise;
  const b = c.criarApresentacao(u);
  const nova = c.preparar(p.zip(f.vetor(1)));
  recusa(await a, 'ILUSTRADA_INVALIDADA');
  recusa(await b, 'ILUSTRADA_INVALIDADA');
  delete opts.decode;
  d.resolve();
  assert.equal((await nova).status, 'ilustracao-disponivel');
  recusa(await c.criarApresentacao(u), 'ILUSTRADA_REFERENCIA_INVALIDA');
  assert.equal(other.consultarEstado().estado, 'disponivel');
  c.descartar();
  other.descartar();
  assert.equal(e.urls.size, 0);
  assert.equal(e.stats.pico, 1);
});
test('fila limitada não cria promessas abandonadas', async () => {
  const opts = {},
    e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(p.zip(f.vetor(1))),
    u = h.imagens(r.projecao)[0];
  const d = h.defer(),
    entered = h.defer();
  opts.decode = async () => {
    entered.resolve();
    await d.promise;
  };
  const a = c.criarApresentacao(u);
  await entered.promise;
  const fila = Array.from({ length: 64 }, () => c.criarApresentacao(u));
  recusa(await c.criarApresentacao(u), 'ILUSTRADA_FILA_OCUPADA');
  c.descartar();
  for (const r of await Promise.all([a, ...fila])) recusa(r, 'ILUSTRADA_INVALIDADA');
  d.resolve();
  await tick();
  assert.equal(e.urls.size, 0);
});
test(
  'fila cheia drena em FIFO, libera em ordem inversa e não retém listeners',
  { timeout: 10000 },
  async () => {
    const opts = {},
      e = h.carregar(opts),
      c = e.api.criarPreparacaoIlustradaVisual();
    const x = f.vetor(1);
    x.m.questoes[0].visuais = Array.from({ length: 65 }, (_, i) => {
      const uso = f.use('uso-' + i, 'ponto', true);
      uso.acessibilidade.descricao = 'Uso ' + i;
      return uso;
    });
    const r = await c.preparar(p.zip(x)),
      usos = h.imagens(r.projecao);
    const gate = h.defer(),
      entry = h.defer(),
      ordem = [];
    opts.decode = async (img) => {
      ordem.push(img.alt);
      if (ordem.length === 1) {
        entry.resolve();
        await gate.promise;
      }
    };
    const primeira = c.criarApresentacao(usos[0]);
    await entry.promise;
    const restantes = usos.slice(1).map((u) => c.criarApresentacao(u));
    const cheio = c.consultarEstado().observacao;
    assert.equal(cheio.decodificacoesAtivas, 1);
    assert.equal(cheio.fila, 64);
    assert.deepEqual(ordem, ['Uso 0']);
    recusa(await c.criarApresentacao(usos[0]), 'ILUSTRADA_FILA_OCUPADA');
    gate.resolve();
    const apresentacoes = await Promise.all([primeira, ...restantes]);
    assert.deepEqual(
      ordem,
      Array.from({ length: 65 }, (_, i) => 'Uso ' + i)
    );
    assert.equal(apresentacoes.length, 65);
    for (const a of apresentacoes) assert.equal(a.status, 'imagem-disponivel');
    assert.equal(c.consultarEstado().estado, 'disponivel');
    assert.equal(c.consultarEstado().observacao.pixelsEmUso, 65);
    assert.equal(c.consultarEstado().observacao.apresentacoes, 65);
    assert.equal(c.consultarEstado().observacao.fila, 0);
    assert.equal(e.urls.size, 1);
    for (const [i, a] of apresentacoes.slice().reverse().entries()) {
      a.liberar();
      assert.equal(a.elemento.listeners.size, 0);
      assert.equal(a.elemento.src, '');
      assert.equal(a.status, 'imagem-indisponivel');
      assert.equal(c.consultarEstado().observacao.pixelsEmUso, 64 - i);
      assert.equal(e.urls.size, i === 64 ? 0 : 1);
    }
    const final = c.consultarEstado().observacao;
    for (const k of [
      'pixelsEmUso',
      'apresentacoes',
      'urlsApresentacao',
      'urlsVerificacao',
      'fila',
      'decodificacoesAtivas',
    ])
      assert.equal(final[k], 0, k);
    for (const a of apresentacoes) a.elemento.dispatch('error');
    assert.equal(c.consultarEstado().estado, 'disponivel');
    c.descartar();
  }
);

test('falha tardia de apresentação invalida contexto e remove listeners', async () => {
  const e = h.carregar(),
    c = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(p.zip(f.vetor(1))),
    u = h.imagens(r.projecao)[0];
  const a = await c.criarApresentacao(u);
  a.elemento.dispatch('error');
  assert.equal(a.consultarEstado().estado, 'indisponivel');
  assert.equal(a.status, 'imagem-indisponivel');
  assert.equal(a.decodificacao, 'pendente');
  assert.equal(c.consultarEstado().estado, 'falha');
  assert.equal(e.urls.size, 0);
  assert.equal(a.elemento.listeners.size, 0);
  a.liberar();
  recusa(c.consultarProjecao(), 'ILUSTRADA_INDISPONIVEL');
  assert.equal((await c.preparar(p.zip(f.vetor(1)))).status, 'ilustracao-disponivel');
});
test('falha de nova apresentação libera todas as anteriores', async () => {
  const opts = {},
    e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual();
  const r = await c.preparar(p.zip(f.vetor(1))),
    u = h.imagens(r.projecao)[0];
  const a = await c.criarApresentacao(u);
  opts.decode = async () => {
    throw Error('segredo');
  };
  recusa(await c.criarApresentacao(u), 'ILUSTRADA_DECODIFICACAO_FALHOU');
  assert.equal(a.consultarEstado().estado, 'liberada');
  assert.equal(e.urls.size, 0);
  assert.equal(c.consultarEstado().observacao.pixelsEmUso, 0);
});
test('entrada alterada durante await não substitui bytes verificados; argumentos extras recusados', async () => {
  const d = h.defer(),
    entered = h.defer(),
    opts = {
      decode: async () => {
        entered.resolve();
        await d.promise;
      },
    };
  const e = h.carregar(opts),
    c = e.api.criarPreparacaoIlustradaVisual(),
    b = p.zip(f.vetor(1));
  const original = Buffer.from(b),
    p1 = c.preparar(b);
  await entered.promise;
  assert.deepEqual(b, original);
  b.fill(0);
  d.resolve();
  assert.equal((await p1).status, 'ilustracao-disponivel');
  assert.ok(e.stats.blobs[0].bytes.equals(Buffer.from(f.bytes('R.png'))));
  const bad = await c.preparar(original, {});
  assert.equal(bad.status, 'recusado');
  assert.equal(c.consultarEstado().estado, 'falha');
});
