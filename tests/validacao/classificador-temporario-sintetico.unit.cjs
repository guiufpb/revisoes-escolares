'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  classifySynthetic,
  REASONS,
} = require('../../scripts/validacao/classificador-temporario-sintetico.cjs');
const {
  runHarness,
  generateCounter,
  digest,
} = require('../../scripts/validacao/harness-temporario-sintetico.cjs');
const { scenario, corpus } = require('../fixtures/temporarios-sinteticos.cjs');
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

test('owned harness creates the single pinned artifact and regenerates it twice', () => {
  const expected = 'ORG.6B synthetic counter\nrun=case-one\n0,1,2,3\n';
  const hash = '33d6b9b130efcfc570805358d1c776fae5ea6ab63abd8c3b25c667a7f14d93ae';
  assert.equal(generateCounter('case-one'), expected);
  assert.equal(digest(expected), hash);
  const proof = runHarness('case-one');
  assert.equal(proof.artifact.content, expected);
  assert.deepEqual(proof.regeneration.attempts, [hash, hash]);
  assert.deepEqual(runHarness('case-one'), proof);
  assert.notEqual(runHarness('case-two').artifact.sha256, hash);
  for (const id of ['', '../private', 'a'.repeat(33), null, 1]) assert.throws(() => runHarness(id));
});

for (const git of ['ignored', 'untracked']) {
  test('recognizes only the complete closed proof: ' + git, () => {
    for (const runId of ['case-one', 'case-two', 'a'.repeat(32)]) {
      const { input, context } = scenario(runId, git);
      const result = classifySynthetic(freeze(input), freeze(context));
      assert.equal(result.status, 'recognized');
      assert.equal(result.cleanupAuthorization, 'none');
      assert.equal(result.subjectId, 'counter-' + runId);
      assert.deepEqual(result.codes, ['closed-synthetic-class-recognized']);
      assert.equal(result.basis.length, 10);
      for (const unknown of input.inspection.unknown) assert.ok(result.unknown.includes(unknown));
      assert.ok(result.unknown.includes('external-consumers'));
      assert.ok(result.unknown.includes('current-filesystem-state'));
    }
  });
}

for (const item of corpus) {
  test('synthetic corpus: ' + item.name, () => {
    const { input, context } = scenario();
    item.change(input);
    const before = JSON.stringify({ input, context });
    const a = classifySynthetic(freeze(input), freeze(context));
    const b = classifySynthetic(input, context);
    assert.deepEqual(a, b);
    assert.equal(a.status, item.status);
    assert.deepEqual(a.codes, [item.code]);
    assert.deepEqual(a.explanations, [REASONS[item.code]]);
    assert.equal(a.cleanupAuthorization, 'none');
    assert.equal(JSON.stringify({ input, context }), before);
  });
}

test('every missing proof category stays unknown and never favorable', () => {
  for (const field of [
    'producerId',
    'scopeId',
    'runId',
    'resourceId',
    'purpose',
    'artifact',
    'regeneration',
    'lifecycle',
    'scenarioId',
  ]) {
    const { input, context } = scenario();
    delete input.proof[field];
    assert.equal(classifySynthetic(input, context).status, 'indeterminate');
  }
  const { input, context } = scenario();
  for (const missing of [null, undefined, {}])
    assert.equal(classifySynthetic(missing, context).status, 'indeterminate');
  delete input.inspection;
  assert.equal(classifySynthetic(input, context).status, 'indeterminate');
});

test('independent context, schema, integrity and size constraints fail closed', () => {
  const { input, context } = scenario();
  for (const ctx of [
    undefined,
    {},
    { ...context, runId: '../private' },
    { ...context, scenarioId: 'unknown' },
    { ...context, observedAt: '2026-02-30T12:00:00Z' },
  ])
    assert.equal(classifySynthetic(input, ctx).status, 'blocked');
  for (const change of [
    (i) => {
      i.proof.classId = {};
    },
    (i) => {
      i.proof.artifact.content = 'x'.repeat(257);
    },
    (i) => {
      i.proof.artifact.extra = true;
    },
    (i) => {
      i.proof.lifecycle = Array(9).fill({});
    },
    (i) => {
      i.inspection.resources[0].evidence[0].canDelete = true;
    },
    (i) => {
      i.inspection.resources[0].provenance = ['filesystem'];
    },
  ]) {
    const copy = structuredClone(input);
    change(copy);
    assert.equal(classifySynthetic(copy, context).status, 'blocked');
  }
});

test('weak signals alone, a digest alone or a self-asserted trust flag cannot recognize', () => {
  const { input, context } = scenario();
  assert.equal(
    classifySynthetic({ inspection: input.inspection }, context).status,
    'indeterminate'
  );
  assert.equal(
    classifySynthetic(
      {
        proof: {
          name: 'tmp/old.log',
          ignored: true,
          trusted: true,
          sha256: input.proof.artifact.sha256,
        },
      },
      context
    ).status,
    'blocked'
  );
  // ORG.6A deliberately omits names/paths/ages; no such field influences the recognizer.
  assert.ok(!JSON.stringify(input.inspection).includes('arbitrary-name.bin'));
});

test('output is detached, explains failures without leaking private input, preserves unknowns', () => {
  const { input, context } = scenario();
  const before = classifySynthetic(input, context);
  const output = classifySynthetic(input, context);
  output.unknown.push('modified');
  output.basis.push('modified');
  output.codes[0] = 'modified';
  assert.deepEqual(classifySynthetic(input, context), before);
  input.proof.producerId = 'private-secret-do-not-echo';
  assert.ok(!JSON.stringify(classifySynthetic(input, context)).includes('private-secret'));
});

test('harness and classification perform no IO, execution, wall clock or random generation', () => {
  const fs = require('node:fs'),
    child = require('node:child_process');
  const { input, context } = scenario();
  const saved = [];
  for (const [object, names] of [
    [
      fs,
      [
        'readFileSync',
        'writeFileSync',
        'appendFileSync',
        'lstatSync',
        'openSync',
        'renameSync',
        'unlinkSync',
        'mkdirSync',
        'rmSync',
      ],
    ],
    [child, ['execFileSync', 'spawnSync', 'execSync', 'spawn']],
    [Date, ['now']],
    [Math, ['random']],
  ]) {
    for (const name of names) {
      saved.push([object, name, object[name]]);
      object[name] = () => {
        throw new Error('forbidden side effect');
      };
    }
  }
  try {
    assert.deepEqual(runHarness('case-one'), input.proof);
    assert.equal(classifySynthetic(input, context).status, 'recognized');
    for (const item of corpus) {
      const { input: copy } = scenario();
      item.change(copy);
      assert.notEqual(classifySynthetic(copy, context).status, 'recognized');
    }
  } finally {
    for (const [object, name, fn] of saved) object[name] = fn;
  }
});
