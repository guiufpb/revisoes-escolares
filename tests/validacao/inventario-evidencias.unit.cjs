'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { adaptInventory } = require('../../scripts/validacao/inventario-evidencias.cjs');
const { validateEvidence } = require('../../scripts/validacao/evidencia-organizacao.cjs');
const TIME = '2026-11-02T12:00:00Z';
function resource(overrides = {}) {
  return {
    path: 'synthetic',
    type: 'file',
    exists: true,
    bytes: 10,
    git: 'ignored',
    provenance: ['filesystem', 'git-index-or-ignore'],
    ...overrides,
  };
}
function report(resources = [resource()]) {
  const partial = resources.some((r) => r.issue);
  return {
    status: partial ? 'partial' : 'complete',
    exitCode: partial ? 2 : 0,
    worktree: {
      label: 'private-label',
      head: 'a'.repeat(40),
      branch: 'private-branch',
      detached: false,
      provenance: 'git',
    },
    resources,
    limits: ['Synthetic limit'],
  };
}
function context(count = 1) {
  return {
    observedAt: TIME,
    resourceIds: Array.from({ length: count }, (_, i) => 'synthetic-' + i),
  };
}
function frozen(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(frozen);
    Object.freeze(value);
  }
  return value;
}

test('deterministic, immutable and detached from both inputs', () => {
  const input = frozen(report()),
    ctx = frozen(context());
  const a = adaptInventory(input, ctx),
    b = adaptInventory(input, ctx);
  assert.deepEqual(a, b);
  assert.equal(a.status, 'complete');
  assert.equal(a.sourceExitCode, 0);
  assert.ok(a.resources[0].evidence.every(validateEvidence));
  assert.deepEqual(
    a.resources[0].evidence.map((e) => e.value),
    [true, 'file', 'ignored']
  );
  assert.ok(a.resources[0].evidence.every((e) => e.observedAt === TIME));
  a.resources[0].provenance.push('changed');
  a.resources[0].evidence[0].subject.id = 'changed';
  assert.deepEqual(adaptInventory(input, ctx), b);
});

test('complete, ignored, absent and unverified directory imply no cleanup conclusion', () => {
  const rows = [
    resource(),
    resource({ type: 'absent', exists: false, bytes: undefined, git: 'tracked' }),
    resource({ type: 'directory', bytes: undefined, git: 'directory-contents-unverified' }),
  ];
  const output = adaptInventory(report(rows), context(3));
  assert.equal(output.status, 'complete');
  assert.deepEqual(
    output.resources[1].evidence.map((e) => e.value),
    [false, 'absent', 'tracked']
  );
  assert.equal(output.resources[2].evidence[2].value, 'directory-contents-unverified');
  assert.ok(output.unknown.includes('directory-contents'));
  const json = JSON.stringify(output);
  for (const word of ['canDelete', 'disposable', 'safeToDelete', 'classification'])
    assert.ok(!json.includes(word));
});

for (const issue of ['git-query-unavailable', 'case-correspondence-unresolved']) {
  test('partial preserves metadata and Git uncertainty: ' + issue, () => {
    const input = report([
      resource(),
      resource({ git: 'indeterminate', issue, provenance: ['filesystem'] }),
    ]);
    const output = adaptInventory(input, context(2));
    assert.equal(output.status, 'partial');
    assert.equal(output.sourceExitCode, 2);
    assert.deepEqual(output.resources[1].diagnostics, [issue]);
    assert.deepEqual(
      output.resources[1].evidence.map((e) => e.value),
      [true, 'file', null]
    );
    assert.equal(output.resources[1].evidence[2].knowledge, 'unknown');
    assert.equal(output.resources[1].evidence[2].observedAt, null);
    assert.equal(output.resources[1].inspection.git, 'indeterminate');
    assert.equal(output.resources[0].evidence[2].value, 'ignored');
  });
}

for (const issue of [
  'invalid-relative-path',
  'git-administration-protected',
  'outside-root',
  'link-in-path-not-followed',
  'metadata-unavailable',
]) {
  test('refusal/unknown keeps diagnostics and fabricates no observation: ' + issue, () => {
    const r = ['link-in-path-not-followed', 'metadata-unavailable'].includes(issue)
      ? {
          path: 'private-path',
          type: issue.startsWith('link') ? 'link' : 'indeterminate',
          git: 'unverified',
          provenance: ['filesystem'],
          issue,
        }
      : { path: '(invalid)', type: 'indeterminate', issue };
    const output = adaptInventory(report([r]), context());
    assert.equal(output.status, 'partial');
    assert.deepEqual(output.resources[0].diagnostics, [issue]);
    assert.ok(
      output.resources[0].evidence.every(
        (e) =>
          validateEvidence(e) &&
          e.value === null &&
          e.knowledge === 'unknown' &&
          e.observedAt === null
      )
    );
    assert.ok(!JSON.stringify(output).includes('private-path'));
  });
}

test('fatal inventory remains refused, without resources or invented context', () => {
  const output = adaptInventory({
    status: 'fatal',
    exitCode: 1,
    issue: 'arguments-root-or-git-unavailable',
  });
  assert.equal(output.status, 'refused');
  assert.equal(output.sourceExitCode, 1);
  assert.deepEqual(output.resources, []);
  assert.deepEqual(output.diagnostics, ['arguments-root-or-git-unavailable']);
});

test('incompatible contracts, versions, diagnostics, statuses, provenance and types fail closed', () => {
  const changes = [
    (r) => {
      r.schemaVersion = 2;
    },
    (r) => {
      r.status = 'unknown';
    },
    (r) => {
      r.exitCode = 2;
    },
    (r) => {
      r.resources[0].issue = 'private-secret';
    },
    (r) => {
      r.resources[0].git = 'disposable';
    },
    (r) => {
      r.resources[0].provenance = ['git-index-or-ignore'];
    },
    (r) => {
      r.resources[0].type = 'link';
    },
    (r) => {
      r.resources[0].bytes = -1;
    },
    (r) => {
      r.resources[0].exists = false;
    },
    (r) => {
      r.resources = [];
    },
    (r) => {
      r.resources = Array(101).fill(resource());
    },
    (r) => {
      r.resources[0].git = 'directory-contents-unverified';
    },
    (r) => {
      r.resources[0].private = 'private-secret';
    },
    (r) => {
      r.worktree.detached = true;
    },
    (r) => {
      r.limits = [10];
    },
  ];
  for (const change of changes) {
    const r = report();
    change(r);
    const output = adaptInventory(r, context());
    assert.equal(output.status, 'incompatible');
    assert.deepEqual(output.resources, []);
    assert.ok(!JSON.stringify(output).includes('private-secret'));
  }
  for (const r of [null, [], {}, 'private', { status: 'fatal', exitCode: 1, issue: 'private' }])
    assert.equal(adaptInventory(r, context()).status, 'incompatible');
});

test('explicit valid timestamp and unique opaque identities are required', () => {
  for (const ctx of [
    undefined,
    {},
    { ...context(), observedAt: '2026-02-30T12:00:00Z' },
    { ...context(), observedAt: null },
    { ...context(), resourceIds: ['../private'] },
    { ...context(), resourceIds: [] },
    { ...context(), extra: true },
  ]) {
    const output = adaptInventory(report(), ctx);
    assert.equal(output.status, 'incompatible');
    assert.deepEqual(output.resources, []);
  }
  assert.equal(
    adaptInventory(report([resource(), resource()]), {
      observedAt: TIME,
      resourceIds: ['same', 'same'],
    }).status,
    'incompatible'
  );
});

test('no IO, clock or external execution during adapter calls', () => {
  const fs = require('node:fs'),
    child = require('node:child_process');
  const originals = [];
  for (const [module, names] of [
    [
      fs,
      [
        'readFileSync',
        'writeFileSync',
        'lstatSync',
        'openSync',
        'renameSync',
        'unlinkSync',
        'mkdirSync',
      ],
    ],
    [child, ['execFileSync', 'spawnSync', 'execSync', 'spawn']],
  ]) {
    for (const name of names) {
      originals.push([module, name, module[name]]);
      module[name] = () => {
        throw new Error('forbidden IO');
      };
    }
  }
  const now = Date.now;
  Date.now = () => {
    throw new Error('forbidden clock');
  };
  try {
    assert.equal(adaptInventory(report(), context()).status, 'complete');
  } finally {
    for (const [module, name, fn] of originals) module[name] = fn;
    Date.now = now;
  }
});

test('actual ORG.4D collector shape through synthetic services fits unchanged v1 envelopes', () => {
  const { inspect } = require('../../scripts/validacao/inventario-seguro.cjs');
  const path = require('node:path');
  const root = process.platform === 'win32' ? 'C:\\synthetic-org6a' : '/synthetic-org6a';
  const input = inspect(root, ['item', 'missing', 'directory', '../private'], {
    lstat(target) {
      if (target.endsWith(path.sep + 'missing'))
        throw Object.assign(new Error('synthetic'), { code: 'ENOENT' });
      return {
        isSymbolicLink: () => false,
        isFile: () => target.endsWith(path.sep + 'item'),
        isDirectory: () => !target.endsWith(path.sep + 'item'),
        size: 10,
      };
    },
    realpath: (v) => v,
    git(_root, args) {
      if (args[0] === 'rev-parse')
        return args[1] === '--show-toplevel'
          ? root
          : args[1] === '--verify'
            ? 'a'.repeat(40)
            : 'main';
      if (args[0] === 'ls-files') return args.at(-1).endsWith('item') ? 'item\0' : '';
      throw Object.assign(new Error('synthetic'), { status: 1 });
    },
  });
  const output = adaptInventory(input, context(4));
  assert.equal(output.status, 'partial');
  assert.ok(output.resources.flatMap((r) => r.evidence).every(validateEvidence));
  assert.equal(output.resources[0].inspection.git, 'tracked');
  assert.equal(output.resources[1].evidence[0].value, false);
  assert.equal(output.resources[2].evidence[2].value, 'directory-contents-unverified');
  assert.equal(output.resources[3].evidence[0].knowledge, 'unknown');
  const json = JSON.stringify(output);
  for (const secret of ['private', 'synthetic-org6a', 'private-label', 'private-branch'])
    assert.ok(!json.includes(secret));
});
