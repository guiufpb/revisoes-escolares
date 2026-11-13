'use strict';
const { test } = require('node:test'),
  assert = require('node:assert/strict');
const { ambiente, tick } = require('./helpers/lab-visual-navegacao-fixture.cjs');
test('API fechada, estados congelados e propriedade exclusiva por raiz', () => {
  const e = ambiente();
  assert.deepEqual(Object.keys(e.api).sort(), ['consultarEstado', 'descartar', 'encerrar']);
  assert.ok(Object.isFrozen(e.api));
  assert.ok(Object.isFrozen(e.api.consultarEstado()));
  assert.ok(Object.isFrozen(e.api.consultarEstado().acoes));
  assert.equal(e.criar(e.raiz).codigo, 'NAV_PROPRIEDADE_OCUPADA');
  assert.equal(e.criar(null).codigo, 'NAV_RAIZ_INVALIDA');
  e.api.descartar();
  e.api.descartar();
  assert.equal(e.api.consultarEstado().estado, 'descartada');
  assert.equal(e.criar(e.raiz).consultarEstado().estado, 'inicial');
  e.api.descartar();
});
test('tamanho recusado antes de leitura; cancelamento não altera questão existente', async () => {
  const e = ambiente();
  for (const size of [0, 71303169]) {
    e.selecionar('invalido', size);
    assert.equal(e.api.consultarEstado().erro, 'NAV_TAMANHO_INVALIDO');
  }
  assert.equal(e.stats.leituras.length, 0);
  e.selecionar('valido', 71303168);
  await tick();
  assert.equal(e.api.consultarEstado().total, 3);
  e.selecionar(null);
  assert.equal(e.api.consultarEstado().estado, 'disponivel');
  assert.equal(e.stats.preparacoes.length, 1);
});
test('navegação, limites, nenhuma fila de cliques e foco externo preservado', async () => {
  const e = ambiente();
  e.selecionar('a');
  await tick();
  const [ant, prox] = e.nodes('button');
  ant.dispatch('click');
  assert.equal(e.api.consultarEstado().indice, 0);
  prox.focus();
  prox.dispatch('click');
  prox.dispatch('click');
  await tick();
  assert.equal(e.api.consultarEstado().indice, 1);
  assert.notEqual(e.doc.activeElement, prox);
  prox.dispatch('click');
  const externo = e.doc.createElement('button');
  externo.focus();
  await tick();
  assert.equal(e.doc.activeElement, externo);
  prox.dispatch('click');
  assert.equal(e.api.consultarEstado().indice, 2);
  e.api.encerrar();
  assert.deepEqual(e.stats.ordem.slice(-3), ['limpar', 'renderer', 'servico']);
});
for (const opt of ['erroLeitura', 'recusar'])
  test('falha segura sem conteúdo parcial: ' + opt, async () => {
    const e = ambiente({ [opt]: true });
    e.selecionar('arquivo-secreto');
    await tick();
    const s = e.api.consultarEstado();
    assert.equal(s.estado, 'falha');
    assert.equal(s.total, 0);
    assert.equal(s.indice, null);
    assert.equal(s.admissaoOperacional, false);
    assert.ok(!JSON.stringify(s).includes('secreto'));
    e.api.encerrar();
  });
test('leitura abortada na substituição e candidatos superados nunca são lidos', async () => {
  const e = ambiente({ lerPendente: true });
  e.selecionar('a');
  e.selecionar('b');
  e.selecionar('c');
  await tick();
  e.drenar();
  assert.deepEqual(e.stats.leituras, ['a', 'c']);
  e.api.encerrar();
  await tick();
  assert.equal(e.stats.timers.size, 0);
});
test('cancelamento lógico não libera slot físico: candidato único e um timer', async () => {
  const e = ambiente({ reter: true });
  e.selecionar('a');
  await tick();
  const antigo = e.stats.servicos[0];
  e.selecionar('b');
  await tick();
  e.selecionar('c');
  await tick();
  for (let n = 0; n < 8; n++) {
    e.drenar();
    assert.equal(e.stats.timers.size, 1);
  }
  assert.deepEqual(e.stats.preparacoes, ['a']);
  assert.deepEqual(e.stats.leituras, ['a']);
  antigo.active = 0;
  e.drenar();
  await tick();
  assert.deepEqual(e.stats.preparacoes, ['a', 'c']);
  assert.equal(e.api.consultarEstado().estado, 'disponivel');
});
test('encerrar/descartar suspendem acompanhamento; nova seleção reconfere drenagem', async () => {
  const e = ambiente({ reter: true });
  e.selecionar('a');
  await tick();
  e.selecionar('b');
  await tick();
  e.api.encerrar();
  assert.equal(e.stats.timers.size, 0);
  e.selecionar('c');
  assert.equal(e.stats.timers.size, 1);
  e.api.descartar();
  e.stats.servicos[0].active = 0;
  e.drenar();
  await tick();
  assert.deepEqual(e.stats.preparacoes, ['a']);
  assert.equal(e.api.consultarEstado().estado, 'descartada');
});
test('observer é apenas sinal de consulta pública e é desconectado', async () => {
  const e = ambiente();
  e.selecionar('a');
  await tick();
  const obs = e.stats.observadores[0];
  const proxima = e.nodes('button')[1];
  assert.equal(proxima.attrs['aria-disabled'], 'false');
  const consultasAntes = e.stats.consultasRenderizador;
  e.stats.renderer.falhar();
  obs.fn();
  obs.fn();
  assert.equal(proxima.attrs['aria-disabled'], 'false');
  assert.equal(e.stats.consultasRenderizador, consultasAntes);
  await tick();
  // A microtask do observer consultou o renderer e atualizou o DOM sem consulta do teste.
  assert.equal(e.stats.consultasRenderizador, consultasAntes + 1);
  assert.equal(proxima.attrs['aria-disabled'], 'true');
  assert.equal(e.api.consultarEstado().estado, 'falha');
  e.api.encerrar();
  assert.equal(obs.ativo, false);
  obs.fn();
  await tick();
  assert.equal(e.api.consultarEstado().estado, 'encerrada');
});
