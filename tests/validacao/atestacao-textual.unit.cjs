'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { captureIdentity, hash, identityUsable } = require('../../scripts/validacao/identidade.cjs');
const { CONTRACT, BUNDLE } = require('../../scripts/validacao/identidade-texto.cjs');
const { comparePlan } = require('../../scripts/validacao/planejador-comparacao.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');
const SOURCE = 'ambiente_interativo/revisoes/perfil/conteudo.js';
const CONFIG =
  'window.QuestionariosRevisoes.registrar({id:"unit",aluno:"alice",chave:"key",questoes:[{id:"q",tipo:"campos",dica:"Pense com calma.",respostas:["a"]}]});';
function fixture() {
  const files = new Map(
    Object.entries({
      [SOURCE]: CONFIG,
      [BUNDLE]: '(function(){' + CONFIG + '})();',
      'validacao/manifesto.json': JSON.stringify({
        revisions: [
          {
            id: 'unit',
            engine: 'questionarios',
            profile: 'alice',
            primaryKey: 'key',
            contentSources: [SOURCE],
            configFiles: [SOURCE],
          },
        ],
      }),
      'tests/producer.js': 'page.screenshot({path:"output/known.png"});',
      'scripts/deny.cjs': '// output forbidden',
      'ambiente_interativo/js/renderer.js': 'element.textContent = item.dica;',
      'vite.config.js': 'module.exports = {build:{minify:false}};',
      'output/known.png': 'PNG',
    }).map(([f, v]) => [f, Buffer.from(v)])
  );
  const policy = {
    schemaVersion: 1,
    identityFormat: 2,
    version: '1.1.0',
    inputRoots: ['ambiente_interativo/', 'validacao/', 'scripts/', 'tests/'],
    inputExtensions: ['.js', '.cjs', '.json'],
    rootInputs: ['vite.config.js'],
    forcedInputs: [BUNDLE],
    syntheticInputs: [],
    diagnosticProducers: [
      {
        id: 'output',
        source: 'tests/producer.js',
        sha256: hash(files.get('tests/producer.js')),
        anchor: '.screenshot(',
        paths: ['output/known.png'],
      },
    ],
    diagnosticAudit: {
      representation: CONTRACT,
      corpusSha256: 'pending',
      scope: 'Reviewed isolated fixture',
      httpDeny: {
        source: 'scripts/deny.cjs',
        sha256: hash(files.get('scripts/deny.cjs')),
        anchor: 'forbidden',
      },
    },
  };
  const snapshot = () =>
    captureIdentity({ paths: [...files.keys()], policy, readBytes: (f) => files.get(f) || null });
  policy.diagnosticAudit.corpusSha256 = snapshot().corpusFingerprint;
  const edit = (file, a, b) =>
    files.set(file, Buffer.from(files.get(file).toString().replace(a, b)));
  const coherent = (a, b) => {
    edit(SOURCE, a, b);
    edit(BUNDLE, a, b);
  };
  return { files, policy, snapshot, edit, coherent };
}
function pair(identity) {
  const source = {
    available: true,
    commit: 'a'.repeat(40),
    tree: 'b'.repeat(40),
    dirty: true,
    statusFingerprint: 'c'.repeat(64),
    contentIdentity: 'working-tree-not-identical-to-commit',
    identity,
    sourceFingerprint: identity.inputFingerprint,
  };
  const item = { file: 'tests/case.spec.js', titles: ['case'], project: '', repeatEachIndex: 0 };
  item.id = logicalId(item.file, item.titles);
  const plan = {
    schemaVersion: 2,
    valid: true,
    result: 'global',
    identityPolicy: identity.policy,
    comparison: {
      target: { kind: 'working-tree', identity, sourceFingerprint: identity.inputFingerprint },
      worktree: { source },
    },
    manifest: { schemaVersion: 1, version: '1.1.0', fingerprint: 'd'.repeat(64) },
    identityUncoveredPaths: [],
    available: { cases: [item], caseCount: 1 },
    proposed: { cases: [item], caseCount: 1 },
  };
  const run = {
    schemaVersion: 2,
    complete: true,
    status: 'passed',
    errors: [],
    source: structuredClone(source),
    sourceAtEnd: structuredClone(source),
    sourcesChangedDuringRun: false,
    manifest: plan.manifest,
    counts: {
      discovered: 1,
      expected: 1,
      executed: 1,
      attempts: 1,
      passed: 1,
      failed: 0,
      flaky: 0,
      skipped: 0,
      notExecuted: 0,
      retries: 0,
      interruptedAttempts: 0,
      timedOutAttempts: 0,
    },
    cases: [
      {
        ...item,
        outcome: 'expected',
        attempts: [{ status: 'passed', expectedStatus: 'passed', retry: 0, durationMs: 1 }],
      },
    ],
  };
  return { plan, run };
}
test('A1: literal autorizado conserva atestação; bytes/fingerprint e prova fonte/bundle mudam', () => {
  const f = fixture(),
    before = f.snapshot();
  assert.equal(identityUsable(before), true);
  f.coherent('Pense com calma.', 'Leia e pense novamente.');
  const after = f.snapshot();
  assert.equal(identityUsable(after), true);
  assert.equal(after.corpusFingerprint, before.corpusFingerprint);
  assert.notEqual(after.inputFingerprint, before.inputFingerprint);
  for (const file of [SOURCE, BUNDLE])
    assert.notEqual(
      after.inputs.find((e) => e.path === file).sha256,
      before.inputs.find((e) => e.path === file).sha256
    );
  assert.equal(after.artifacts.entries.length, 1);
  assert.equal(comparePlan(...Object.values(pair(after))).comparable, true);
  const old = pair(before);
  old.run = pair(after).run;
  assert.equal(comparePlan(old.plan, old.run).costProjection.available, false);
});
for (const [name, mutate] of [
  ['bundle antigo', (f) => f.edit(SOURCE, 'Pense com calma.', 'Leia novamente.')],
  ['bundle ausente', (f) => f.files.delete(BUNDLE)],
  ['bundle divergente', (f) => f.edit(BUNDLE, 'Pense com calma.', 'Outra dica.')],
  ['código adicional no bundle', (f) => f.edit(BUNDLE, '})();', '})();extra();')],
  ['dica fora de questoes', (f) => f.coherent('chave:"key"', 'chave:"key",dica:"Outra"')],
  ['campo protegido', (f) => f.coherent('respostas:["a"]', 'respostas:["b"]')],
  ['identidade protegida', (f) => f.coherent('chave:"key"', 'chave:"nova"')],
  [
    'propriedade calculada',
    (f) => f.coherent('dica:"Pense com calma."', '["dica"]:"Pense com calma."'),
  ],
  ['getter', (f) => f.coherent('dica:"Pense com calma."', 'get dica(){return "Pense com calma."}')],
  ['função', (f) => f.coherent('dica:"Pense com calma."', 'dica:()=>"Pense com calma."')],
  [
    'template executável',
    (f) => f.coherent('dica:"Pense com calma."', 'dica:`Pense ${dynamic()}`'),
  ],
  ['estrutura', (f) => f.coherent('id:"q"', 'id:"q",extra:true')],
  ['propriedade duplicada', (f) => f.coherent('id:"q"', 'id:"q",id:"q"')],
  ['referência em dica', (f) => f.coherent('Pense com calma.', '../assets/known.png')],
  ['questão ambígua', (f) => f.coherent('id:"q"', 'id:""')],
  ['registrador desconhecido', (f) => f.coherent('QuestionariosRevisoes', 'OutroMotor')],
  [
    'consumidor literal novo',
    (f) => f.files.set('tests/reader.js', Buffer.from('fs.readFileSync("output/known.png")')),
  ],
  [
    'consumidor dinâmico não resolvido',
    (f) => f.files.set('tests/reader.js', Buffer.from('fs.readFileSync(process.env.FILE)')),
  ],
  ['renderer', (f) => f.edit('ambiente_interativo/js/renderer.js', 'textContent', 'innerHTML')],
  ['produtor', (f) => f.edit('tests/producer.js', 'page.screenshot', 'other.screenshot')],
  ['bloqueio HTTP', (f) => f.edit('scripts/deny.cjs', 'forbidden', 'allowed')],
  ['configuração build', (f) => f.edit('vite.config.js', 'false', 'true')],
  [
    'política incompatível',
    (f) => {
      f.policy.version = '9.0.0';
    },
  ],
  [
    'contrato incompatível',
    (f) => {
      f.policy.diagnosticAudit.representation = 'other';
    },
  ],
])
  test('A1 recusa: ' + name, () => {
    const f = fixture();
    mutate(f);
    const result = f.snapshot();
    assert.equal(identityUsable(result), false);
    if (name === 'consumidor literal novo')
      assert.equal(result.treatments.find((e) => e.path === 'output/known.png').role, 'input');
    else if (name !== 'política incompatível') assert.ok(result.unknown.length);
  });
test('A1: novo diagnóstico desconhecido e entrada promovida conservam precedência', () => {
  const f = fixture();
  f.files.set('output/new.png', Buffer.from('NEW'));
  assert.equal(f.snapshot().treatments.find((e) => e.path === 'output/new.png').role, 'unknown');
  f.policy.rootInputs.push('output/known.png');
  assert.equal(f.snapshot().treatments.find((e) => e.path === 'output/known.png').role, 'input');
});
for (const field of ['commit', 'tree', 'statusFingerprint', 'dirty', 'contentIdentity'])
  test('A1: mesmo fingerprint não substitui procedência ' + field, () => {
    const { plan, run } = pair(fixture().snapshot());
    run.source[field] =
      field === 'dirty' ? false : field === 'statusFingerprint' ? 'invalid' : 'f'.repeat(40);
    const result = comparePlan(plan, run);
    assert.equal(result.comparable, false);
    assert.equal(result.costProjection.available, false);
  });
test('A1: metadados antigos/completos, parcial e política divergente não permitem projeção', () => {
  for (const mutate of [
    (p) => {
      delete p.run.source.commit;
    },
    (p) => {
      p.run.complete = false;
    },
    (p) => {
      p.run.source.identity.complete = false;
    },
    (p) => {
      p.run.source.identity.policy = { ...p.run.source.identity.policy, version: '1.0.0' };
    },
    (p) => {
      p.run.source.identity.diagnostics[0].textual.bindings[0].bundleSha256 = 'f'.repeat(64);
    },
    (p) => {
      p.run.source.identity.diagnostics[0].textual.valid = false;
    },
    (p) => {
      p.run.source.identity.diagnostics[0].producerProofs = { unknown: true };
    },
    (p) => {
      p.run.source.identity.diagnostics[0].producerProofs = {};
    },
    (p) => {
      delete p.run.source.identity.diagnostics;
    },
    (p) => {
      p.run.source.identity.diagnostics = [];
    },
    (p) => {
      p.run.source.identity.artifacts.entries[0].producer = 'unknown';
    },
    (p) => {
      const artifacts = p.run.source.identity.artifacts;
      artifacts.entries[0].path = 'output/other.png';
      artifacts.fingerprint = hash(JSON.stringify(artifacts.entries));
    },
    (p) => {
      p.run.source.identity.policy.diagnosticProof.producers[0].paths = null;
    },
  ]) {
    const p = pair(fixture().snapshot());
    mutate(p);
    assert.equal(comparePlan(p.plan, p.run).costProjection.available, false);
  }
});

test('A1: surgimento de diagnósticos pode mudar metadados Git, conservando entradas e alvo', () => {
  const { plan, run } = pair(fixture().snapshot());
  run.sourceAtEnd.statusFingerprint = 'e'.repeat(64);
  run.sourceAtEnd.dirty = false;
  run.sourceAtEnd.contentIdentity = 'clean-tracked-tree';
  assert.equal(comparePlan(plan, run).comparable, true);
});
