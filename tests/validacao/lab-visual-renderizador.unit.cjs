/* global setImmediate */
'use strict';
const { test } = require('node:test'),
  assert = require('node:assert/strict');
const {
  criarRenderizadorVisual: criar,
} = require('../../ambiente_interativo/js/lab-visual-renderizador.js');
const h = require('./helpers/lab-visual-renderizador-fixture.cjs');
const p = require('./helpers/lab-visual-previa-fixture.cjs');
const tick = () => new Promise((r) => setImmediate(r));
const nodes = (e, tag) => h.elementos(e.raiz, (n) => n.tagName === tag.toUpperCase());
function recusa(r, code) {
  assert.equal(r.status, 'recusado');
  assert.equal(r.erros[0].codigo, code);
  assert.equal(r.admissaoOperacional, false);
}
test('API mínima, argumentos, raiz e serviço incompatíveis sem mutação', async () => {
  const e = await h.ambiente(),
    antes = e.raiz.children.length;
  for (const args of [[], [null, e.svc], [e.raiz, {}], [e.raiz, e.svc, {}]])
    recusa(criar(...args), 'RENDER_ARGUMENTOS_INVALIDOS');
  assert.equal(e.raiz.children.length, antes);
  assert.equal(e.stats.pedidos.length, 0);
  e.invalidar();
  recusa(criar(e.raiz, e.svc), 'RENDER_CONTEXTO_INCOMPATIVEL');
});
test('propriedade exclusiva do serviço e raiz; descarte antigo não libera novo dono', async () => {
  const e = await h.ambiente(),
    r = criar(e.raiz, e.svc);
  recusa(criar(h.dom().raiz, e.svc), 'RENDER_PROPRIEDADE_OCUPADA');
  const outro = await h.ambiente();
  recusa(criar(e.raiz, outro.svc), 'RENDER_PROPRIEDADE_OCUPADA');
  r.limpar();
  recusa(criar(h.dom().raiz, e.svc), 'RENDER_PROPRIEDADE_OCUPADA');
  r.descartar();
  const novo = criar(e.raiz, e.svc);
  r.descartar();
  recusa(criar(h.dom().raiz, e.svc), 'RENDER_PROPRIEDADE_OCUPADA');
  assert.equal((await novo.renderizarQuestao(0)).estado, 'completo');
  novo.descartar();
});
test('índices inválidos não destroem apresentação válida', async () => {
  const e = await h.ambiente(),
    r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  const painel = e.raiz.children[0];
  for (const n of [-1, 0.5, '0', NaN, 1])
    recusa(await r.renderizarQuestao(n), 'RENDER_INDICE_INVALIDO');
  recusa(await r.renderizarQuestao(0, {}), 'RENDER_INDICE_INVALIDO');
  assert.equal(e.raiz.children[0], painel);
  assert.equal(e.stats.ativos, 3);
  r.descartar();
});
test('projeção autêntica, envelopes novos, sequência e liberação inversa', async () => {
  const e = await h.ambiente(),
    r = criar(e.raiz, e.svc);
  assert.deepEqual(Object.keys(r).sort(), [
    'consultarEstado',
    'descartar',
    'limpar',
    'renderizarQuestao',
  ]);
  const s = await r.renderizarQuestao(0);
  assert.equal(s.estado, 'completo');
  assert.equal(s.admissaoOperacional, false);
  assert.deepEqual(e.stats.pedidos, e.projecao.questoes[0].visuais);
  assert.equal(nodes(e, 'img').length, 3);
  assert.ok(e.stats.consultas > 3);
  r.limpar();
  r.limpar();
  assert.deepEqual(e.stats.liberados, e.stats.pedidos.map((u) => u.id).reverse());
  for (const a of e.stats.handles) assert.equal(a.elemento.listeners.get('error').size, 0);
  assert.equal(r.consultarEstado().estado, 'limpo');
  assert.equal(e.stats.ativos, 0);
  r.descartar();
  recusa(await r.renderizarQuestao(0), 'RENDER_DESCARTADO');
});
for (const falhaNa of [2, 3])
  test('rollback na imagem ' + falhaNa + ' e recuperação', async () => {
    const opts = { falhaNa },
      e = await h.ambiente(opts),
      r = criar(e.raiz, e.svc);
    recusa(await r.renderizarQuestao(0), 'RENDER_IMAGEM_FALHOU');
    assert.equal(r.consultarEstado().estado, 'falha');
    assert.equal(nodes(e, 'article').length, 0);
    assert.equal(nodes(e, 'img').length, 0);
    assert.equal(e.stats.ativos, 0);
    delete opts.falhaNa;
    assert.equal((await r.renderizarQuestao(0)).estado, 'completo');
    r.descartar();
  });
for (const ocupado of ['ILUSTRADA_FILA_OCUPADA', 'ILUSTRADA_ORCAMENTO_OCUPADO'])
  test('recusa recuperável ' + ocupado + ' não gera loop', async () => {
    const opts = { ocupado },
      e = await h.ambiente(opts),
      r = criar(e.raiz, e.svc);
    assert.equal((await r.renderizarQuestao(0)).estado, 'imagens-adiadas');
    assert.equal(e.stats.pedidos.length, 3);
    assert.equal(nodes(e, 'figure').length, 3);
    delete opts.ocupado;
    nodes(e, 'button')[0].dispatch('click');
    await tick();
    assert.equal(nodes(e, 'img').length, 1);
    r.descartar();
  });
test('ocultar libera orçamento; botões mantêm foco e ordem', async () => {
  const e = await h.ambiente({ limite: 1 }),
    r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  assert.equal(r.consultarEstado().figuras.adiadas, 2);
  const botoes = nodes(e, 'button');
  botoes[0].focus();
  botoes[0].dispatch('click');
  assert.equal(e.doc.activeElement, botoes[0]);
  assert.equal(e.stats.ativos, 0);
  botoes[2].dispatch('click');
  await tick();
  assert.equal(e.stats.ativos, 1);
  assert.equal(r.consultarEstado().estado, 'imagens-adiadas');
  assert.equal(nodes(e, 'figure')[2].children[0].children[0].tagName, 'IMG');
  r.descartar();
});
test('limpar durante await resolve cliente; nova renderização não solicita em paralelo', async () => {
  const gate = h.defer(),
    entry = h.defer();
  const e = await h.ambiente({
      gate: async (n) => {
        if (n === 1) {
          entry.resolve();
          await gate.promise;
        }
      },
    }),
    r = criar(e.raiz, e.svc);
  const antiga = r.renderizarQuestao(0);
  await entry.promise;
  r.limpar();
  recusa(await antiga, 'RENDER_INVALIDADO');
  assert.equal((await r.renderizarQuestao(0)).estado, 'imagens-adiadas');
  assert.equal(e.stats.pedidos.length, 1);
  gate.resolve();
  await tick();
  assert.equal(nodes(e, 'img').length, 0);
  assert.equal(e.stats.ativos, 0);
  nodes(e, 'button')[0].dispatch('click');
  await tick();
  assert.equal(nodes(e, 'img').length, 1);
  r.descartar();
});
test('descarte durante await e isolamento de instância independente', async () => {
  const gate = h.defer(),
    entry = h.defer(),
    e = await h.ambiente({
      gate: async () => {
        entry.resolve();
        await gate.promise;
      },
    });
  const r = criar(e.raiz, e.svc),
    tarefa = r.renderizarQuestao(0);
  await entry.promise;
  r.descartar();
  recusa(await tarefa, 'RENDER_INVALIDADO');
  const outro = await h.ambiente(),
    b = criar(outro.raiz, outro.svc);
  await b.renderizarQuestao(0);
  gate.resolve();
  await tick();
  assert.equal(e.raiz.children.length, 0);
  assert.equal(e.stats.ativos, 0);
  assert.equal(b.consultarEstado().estado, 'completo');
  b.descartar();
});
test('mudança externa detectada por identidade da projeção durante consulta', async () => {
  const e = await h.ambiente(),
    r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  e.substituir();
  assert.equal(r.consultarEstado().estado, 'falha');
  assert.equal(e.stats.ativos, 0);
  r.descartar();
});
test('renderizar novamente durante await cancela a geração anterior sem paralelismo', async () => {
  const gate = h.defer(),
    entry = h.defer();
  const e = await h.ambiente({
    gate: async (n) => {
      if (n === 1) {
        entry.resolve();
        await gate.promise;
      }
    },
  });
  const r = criar(e.raiz, e.svc),
    antiga = r.renderizarQuestao(0);
  await entry.promise;
  const atual = await r.renderizarQuestao(0);
  recusa(await antiga, 'RENDER_INVALIDADO');
  assert.equal(atual.estado, 'imagens-adiadas');
  assert.equal(e.stats.pedidos.length, 1);
  assert.equal(nodes(e, 'article').length, 1);
  gate.resolve();
  await tick();
  assert.equal(nodes(e, 'img').length, 0);
  assert.equal(e.stats.ativos, 0);
  assert.equal(
    nodes(e, 'button').some((b) => b.disabled),
    false
  );
  r.descartar();
});
test('erro tardio remove apresentação completa e listeners', async () => {
  const e = await h.ambiente(),
    r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  e.stats.handles[1].elemento.dispatch('error');
  assert.equal(r.consultarEstado().estado, 'falha');
  assert.equal(e.stats.ativos, 0);
  assert.equal(nodes(e, 'img').length, 0);
  r.descartar();
});
test('conteúdo literal, grupos intercalados, campos e ditados seguros', async () => {
  const e = await h.ambiente({ x: p.canarios() }),
    r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  const q = e.projecao.questoes[0],
    conjunto = q.visuais[0],
    figuras = nodes(e, 'figure');
  assert.deepEqual(
    figuras.slice(0, 4).map((n) => n.dataset.uso),
    conjunto.elementos.map((u) => u.id)
  );
  assert.ok(e.raiz.textContent.includes('<b>3 < 7 e 9 > 4 &lt;</b>'));
  assert.equal(nodes(e, 'b').length, 0);
  assert.equal(nodes(e, 'input').length, 0);
  await r.renderizarQuestao(1);
  assert.ok(e.raiz.textContent.includes('Campo demonstrativo'));
  await r.renderizarQuestao(2);
  assert.ok(e.raiz.textContent.includes('Ditado — item 1'));
  for (const s of [
    'AlvoSecretoCanario',
    'RespostaSecretaCanario',
    'TituloAdministrativoCanario',
    'orig-',
  ])
    assert.ok(!e.raiz.textContent.includes(s));
  r.descartar();
});
test('limpeza preserva componentes externos à raiz controlada', async () => {
  const e = await h.ambiente(),
    externo = e.doc.createElement('aside');
  externo.textContent = 'Preservar';
  e.raiz.append(externo);
  const r = criar(e.raiz, e.svc);
  await r.renderizarQuestao(0);
  r.limpar();
  assert.deepEqual(e.raiz.children, [externo]);
  r.descartar();
  assert.deepEqual(e.raiz.children, [externo]);
});
