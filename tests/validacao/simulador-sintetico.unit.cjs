'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { simulateSyntheticBatch } = require('../../scripts/validacao/simulador-sintetico.cjs');
const {
  classifySynthetic,
} = require('../../scripts/validacao/classificador-temporario-sintetico.cjs');
const { scenario, corpus } = require('../fixtures/temporarios-sinteticos.cjs');
function item(runId) {
  const { input, context } = scenario(runId);
  return { resourceId: 'counter-' + runId, scopeId: 'scope-' + runId, input, context };
}
function batch(resources) {
  return { batchVersion: 1, resources };
}
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

test('positive lot exposes classifier evidence and synthetic bytes, never reclaimable space', () => {
  const a = item('positive'),
    b = item('second');
  const result = simulateSyntheticBatch(freeze(batch([a, b])));
  assert.equal(result.status, 'evaluated');
  assert.deepEqual(result.summary.counts, {
    recognized: 2,
    'not-recognized': 0,
    indeterminate: 0,
    blocked: 0,
  });
  assert.equal(
    result.summary.knownSyntheticBytes,
    Buffer.byteLength(
      'ORG.6B synthetic counter\nrun=positive\n0,1,2,3\nORG.6B synthetic counter\nrun=second\n0,1,2,3\n'
    )
  );
  assert.equal(result.summary.realReclaimableBytes, null);
  assert.equal(result.summary.resourcesWithKnownSize, 2);
  assert.deepEqual(result.resources[0].classification, classifySynthetic(a.input, a.context));
  assert.ok(result.requiredChecks.includes('verify-reversible-recovery'));
  assert.ok(result.resources.every((r) => r.cleanupAuthorization === 'none'));
});

test('mixed lot counts all four outcomes and preserves opposing/unknown evidence', () => {
  const rows = ['positive', 'negative', 'unknown', 'blocked'].map(item);
  rows[1].input.proof.purpose = 'permanent';
  delete rows[2].input.proof.regeneration;
  rows[3].input.proof.regeneration.attempts = [];
  const result = simulateSyntheticBatch(batch(rows));
  assert.deepEqual(result.summary.counts, {
    recognized: 1,
    'not-recognized': 1,
    indeterminate: 1,
    blocked: 1,
  });
  assert.equal(result.summary.assessedCount, 4);
  assert.equal(result.summary.resourcesWithUnknownSize, 3);
  assert.equal(
    result.summary.knownSyntheticBytes,
    Buffer.byteLength('ORG.6B synthetic counter\nrun=positive\n0,1,2,3\n')
  );
  assert.ok(result.resources[2].classification.unknown.includes('regenerability'));
  assert.ok(result.resources[3].classification.codes.includes('regeneration-not-demonstrated'));
});

for (const [index, example] of corpus.entries()) {
  test('reuses negative corpus without reimplementing classification: ' + example.name, () => {
    const row = item('corpus-' + index);
    example.change(row.input);
    const result = simulateSyntheticBatch(batch([row]));
    assert.deepEqual(result.resources[0].classification, classifySynthetic(row.input, row.context));
    assert.notEqual(result.resources[0].status, 'recognized');
    assert.equal(result.summary.knownSyntheticBytes, 0);
    assert.equal(result.summary.realReclaimableBytes, null);
  });
}

test('duplicates block every peer and never double-count bytes, including invalid peers', () => {
  for (const invalid of [false, true]) {
    const a = item('one'),
      b = item('one');
    if (invalid) b.classification = { status: 'recognized', cleanupAuthorization: 'approved' };
    const result = simulateSyntheticBatch(batch([a, b, item('unrelated')]));
    assert.deepEqual(
      result.resources.map((r) => r.status),
      ['blocked', 'blocked', 'recognized']
    );
    assert.ok(
      result.resources
        .slice(0, 2)
        .every((r) => r.diagnostics.some((d) => d.code === 'duplicate-identity-or-scope'))
    );
    assert.equal(result.summary.resourcesWithKnownSize, 1);
  }
});

test('manifest/context/proof/observed/event identities cannot hide aliases or scope collisions', () => {
  for (const change of [
    (r) => {
      r.resourceId = 'counter-two';
    },
    (r) => {
      r.scopeId = 'scope-two';
    },
    (r) => {
      r.context.runId = 'two';
    },
    (r) => {
      r.input.proof.runId = 'two';
    },
    (r) => {
      r.input.proof.resourceId = 'counter-two';
    },
    (r) => {
      r.input.inspection.resources[0].subjectId = 'counter-two';
    },
    (r) => {
      r.input.inspection.resources[0].evidence[0].subject.id = 'counter-two';
    },
    (r) => {
      r.input.proof.lifecycle[0].resourceId = 'counter-two';
    },
  ]) {
    const a = item('one');
    change(a);
    const result = simulateSyntheticBatch(batch([a, item('two')]));
    assert.ok(result.resources.every((r) => r.status === 'blocked'));
    assert.equal(result.summary.knownSyntheticBytes, 0);
  }
  const a = item('one');
  a.scopeId = 'wrong-scope';
  assert.equal(simulateSyntheticBatch(batch([a])).resources[0].status, 'blocked');
});

test('empty, bounded, absent and incompatible lots distinguish rejection from assessment', () => {
  assert.equal(simulateSyntheticBatch(batch([])).status, 'evaluated');
  assert.equal(
    simulateSyntheticBatch(batch(Array.from({ length: 100 }, (_, i) => item('run-' + i)))).summary
      .counts.recognized,
    100
  );
  for (const value of [
    null,
    undefined,
    {},
    [],
    { batchVersion: 2, resources: [] },
    { batchVersion: 1, resources: Array(101).fill(null) },
    { batchVersion: 1, resources: [], commands: [] },
  ]) {
    const result = simulateSyntheticBatch(value);
    assert.equal(result.status, 'rejected');
    assert.equal(result.summary.submittedCount, null);
    assert.equal(result.summary.assessedCount, 0);
    assert.equal(result.summary.realReclaimableBytes, null);
  }
});

test('bad entries and preclassified or incompatible evidence cannot grant authorization', () => {
  const rows = [null, {}, item('future'), item('preclassified'), item('version')];
  rows[2].input.proof.harnessVersion = 2;
  rows[3].classification = { status: 'recognized', cleanupAuthorization: 'yes' };
  rows[4].input.inspection.adapterVersion = 2;
  const result = simulateSyntheticBatch(batch(rows));
  assert.ok(
    result.resources.every((r) => r.status === 'blocked' && r.cleanupAuthorization === 'none')
  );
  assert.equal(result.cleanupAuthorization, 'none');
  assert.ok(!JSON.stringify(result).includes('"yes"'));
});

test('future/incompatible classifier result fails closed at the integration boundary', () => {
  const file = require.resolve('../../scripts/validacao/simulador-sintetico.cjs');
  const classifier = require('../../scripts/validacao/classificador-temporario-sintetico.cjs');
  const savedModule = require.cache[file],
    original = classifier.classifySynthetic;
  try {
    classifier.classifySynthetic = () => ({
      classificationVersion: 2,
      status: 'recognized',
      cleanupAuthorization: 'approved',
    });
    delete require.cache[file];
    const simulate = require(file).simulateSyntheticBatch;
    const result = simulate(batch([item('one')]));
    assert.equal(result.resources[0].status, 'blocked');
    assert.equal(result.resources[0].classification, null);
    assert.equal(result.summary.knownSyntheticBytes, 0);
  } finally {
    classifier.classifySynthetic = original;
    require.cache[file] = savedModule;
  }
});

test('determinism, frozen inputs, detached outputs and no executable plans', () => {
  const input = freeze(batch([item('one'), item('two')]));
  const before = JSON.stringify(input),
    a = simulateSyntheticBatch(input),
    b = simulateSyntheticBatch(input);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(input), before);
  a.resources[0].classification.unknown.push('modified');
  a.requiredChecks.push('modified');
  assert.deepEqual(simulateSyntheticBatch(input), b);
  for (const field of ['commands', 'actions', 'movePlan', 'deletePlan', 'eligibleForCleanup'])
    assert.ok(!(field in b));
  assert.ok(!JSON.stringify(b).includes('arbitrary-name.bin'));
});

test('simulation performs no IO, process execution, persistence, clock or random generation', () => {
  const fs = require('node:fs'),
    child = require('node:child_process');
  const input = batch([item('one'), item('one'), item('two')]);
  const original = JSON.stringify(input);
  const saved = [];
  for (const [object, methods] of [
    [
      fs,
      [
        'readFileSync',
        'writeFileSync',
        'lstatSync',
        'openSync',
        'unlinkSync',
        'renameSync',
        'rmSync',
        'mkdirSync',
      ],
    ],
    [child, ['execSync', 'execFileSync', 'spawn', 'spawnSync']],
    [Date, ['now']],
    [Math, ['random']],
  ]) {
    for (const key of methods) {
      saved.push([object, key, object[key]]);
      object[key] = () => {
        throw new Error('forbidden side effect');
      };
    }
  }
  try {
    assert.equal(simulateSyntheticBatch(input).summary.counts.blocked, 2);
    assert.equal(JSON.stringify(input), original);
  } finally {
    for (const [object, key, fn] of saved) object[key] = fn;
  }
});
