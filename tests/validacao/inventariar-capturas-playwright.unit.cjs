'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  dryRun,
  collectNative,
  LIMITS,
} = require('../../scripts/validacao/inventariar-capturas-playwright.cjs');
const ROOT = path.resolve(__dirname, '../..');

function fixture(count = 2) {
  const rows = Array.from({ length: count }, (_, i) => ({
    path: `test-results/capture-${i}.png`,
    regular: true,
    device: '1',
    fileId: String(i + 1),
    bytes: 100 + i,
    allocatedBytes: 4096,
    links: 1,
    mtimeNs: '10',
    ctimeNs: '20',
    attributes: 32,
    issues: [],
  }));
  const collection = {
    version: 1,
    status: 'complete',
    resources: rows,
    directories: [],
    issues: [],
    excludedFiles: 1,
  };
  const associations = new Map(
    rows.map((r) => [
      r.path,
      [
        {
          source: 'tests/fixture.spec.js',
          line: 1,
          operation: 'screenshot',
          basis: 'literal-output-path-in-code',
        },
      ],
    ])
  );
  let calls = 0;
  const batches = [];
  const services = {
    collect() {
      calls++;
      return structuredClone(collection);
    },
    producers: () => ({ associations, issues: [] }),
    inventory(root, paths) {
      assert.equal(root, ROOT);
      assert.ok(paths.length <= 100);
      batches.push(paths);
      return {
        status: 'complete',
        exitCode: 0,
        worktree: {
          label: 'fixture',
          head: 'a'.repeat(40),
          branch: 'codex/fixture',
          detached: false,
          provenance: 'git',
        },
        resources: paths.map((p) => ({
          path: p,
          type: p === 'test-results' ? 'directory' : 'file',
          exists: true,
          ...(p === 'test-results' ? {} : { bytes: rows.find((r) => r.path === p)?.bytes || 0 }),
          git: 'ignored',
          provenance: ['filesystem', 'git-index-or-ignore'],
        })),
        limits: [],
      };
    },
  };
  return {
    rows,
    collection,
    associations,
    services,
    batches,
    calls: () => calls,
    run: (options) => dryRun({ root: ROOT, ...options }, services),
  };
}

test('regular captures: economic aggregation, evidence and review without disposal', () => {
  const f = fixture();
  const r = f.run();
  assert.equal(r.status, 'complete');
  assert.equal(r.summary.observedPngPaths, 2);
  assert.equal(r.summary.uniqueNominalBytes, 201);
  assert.equal(r.summary.allocatedBytesComplete, 8192);
  assert.equal(r.summary.reviewOnly.count, 2);
  assert.equal(r.summary.recoverableBytes, null);
  assert.equal(r.consumers.external, 'unknown');
  assert.equal(r.evidence.exactRegeneration, 'not-demonstrated');
  assert.ok(
    r.resources.every(
      (x) =>
        x.cleanupAuthorization === 'none' &&
        x.evidence.length === 3 &&
        x.producer.authenticated === false
    )
  );
  assert.equal(r.cleanupAuthorization, 'none');
  assert.equal(f.calls(), 2);
});

test('scope escape and increased/unknown limits refused before discovery', () => {
  for (const options of [
    { root: 'relative' },
    { scope: 'output/' },
    { scope: 'test-results/../tmp/' },
    { limits: { files: 501 } },
    { limits: { unknown: 1 } },
  ]) {
    const f = fixture();
    const r = f.run(options);
    assert.equal(r.status, 'partial');
    assert.equal(f.calls(), 0);
    assert.ok(r.diagnostics.includes('scope-or-limits-invalid'));
  }
});

test('absent directory and empty present directory are distinct', () => {
  const f = fixture(0);
  f.collection.status = 'absent';
  assert.equal(f.run().status, 'absent');
  const g = fixture(0);
  const r = g.run();
  assert.equal(r.status, 'complete');
  assert.equal(r.summary.uniqueNominalBytes, 0);
});

test('up to 100 paths per ORG.4D batch; never pins a historical count', () => {
  const f = fixture(201);
  const r = f.run();
  assert.equal(r.inventoryBatches, 3);
  assert.deepEqual(
    f.batches.map((x) => x.length),
    [1, 100, 100, 1]
  );
  assert.equal(r.summary.reviewOnly.count, 201);
});

test('tracked PNG protected even when a producer exists', () => {
  const f = fixture();
  const inventory = f.services.inventory;
  f.services.inventory = (root, paths) => {
    const r = inventory(root, paths);
    r.resources.forEach((x) => {
      x.git = 'tracked';
    });
    return r;
  };
  const r = f.run();
  assert.equal(r.summary.protected.count, 2);
  assert.equal(r.summary.reviewOnly.count, 0);
});

test('unresolved producer is blocked; file-name similarity or success never releases dependencies', () => {
  const f = fixture();
  f.associations.clear();
  const r = f.run();
  assert.equal(r.summary.blocked.count, 2);
  assert.ok(
    r.resources.every(
      (x) => x.producer.status === 'unknown' && x.issues.includes('producer-provenance-unresolved')
    )
  );
  assert.equal(r.consumers.release, 'not-demonstrated');
});

test('ambiguous or incomplete source observations do not create review candidates', () => {
  const f = fixture();
  f.associations.get(f.rows[0].path).push({ ...f.associations.get(f.rows[0].path)[0] });
  assert.equal(f.run().resources[0].category, 'blocked');
  const g = fixture();
  g.services.producers = () => ({
    associations: g.associations,
    issues: ['producer-source-unavailable-or-changed'],
  });
  assert.equal(g.run().summary.reviewOnly.count, 0);
});

test('unexpected type, reparse, hardlinks and missing identity remain blocked', () => {
  for (const patch of [
    { regular: false, issues: ['not-regular-file'] },
    { regular: false, issues: ['reparse-refused'] },
    { links: 2 },
    { fileId: '0' },
  ]) {
    const f = fixture();
    Object.assign(f.rows[0], patch);
    const r = f.run();
    assert.equal(r.resources[0].category, 'blocked');
    assert.equal(r.resources[0].cleanupAuthorization, 'none');
  }
});

test('duplicate identities block all peers and count size and allocation once', () => {
  const f = fixture();
  f.rows[1] = { ...f.rows[0], path: 'test-results/alias.png' };
  f.collection.resources = f.rows;
  const r = f.run();
  assert.equal(r.summary.blocked.count, 2);
  assert.equal(r.summary.nominalPathBytes, 200);
  assert.equal(r.summary.uniqueNominalBytes, 100);
  assert.equal(r.summary.allocatedBytesComplete, 4096);
});

test('allocation unavailable is not rounded or converted into recoverable space', () => {
  const f = fixture();
  f.rows[0].allocatedBytes = null;
  f.rows[0].allocationIssue = 'sparse-or-compressed-allocation-uncertified';
  const r = f.run();
  assert.equal(r.summary.allocatedBytesKnown, 4096);
  assert.equal(r.summary.allocatedBytesComplete, null);
  assert.equal(r.summary.recoverableBytes, null);
});

test('conflicting metadata for one identity cannot yield a complete economic total', () => {
  const f = fixture();
  f.rows[1].fileId = f.rows[0].fileId;
  const result = f.run();
  assert.equal(result.summary.uniqueNominalBytes, null);
  assert.equal(result.summary.allocatedBytesComplete, null);
  assert.ok(result.resources.every((r) => r.issues.includes('conflicting-identity-metadata')));
});

test('aggregation beyond safe integer precision is refused rather than rounded', () => {
  const f = fixture();
  f.rows[0].bytes = Number.MAX_SAFE_INTEGER;
  assert.ok(f.run().diagnostics.includes('collector-contract-invalid'));
});

test('real producer code supports a literal path; dynamic paths are not guessed', () => {
  const f = fixture();
  f.rows[0].path = 'test-results/alice-historia-mobile.png';
  delete f.services.producers;
  const result = f.run();
  assert.equal(result.resources[0].producer.status, 'code-supported-inference');
  assert.equal(
    result.resources[0].producer.source,
    'tests/historia-alice-objetos-memorias-outubro-2026.spec.js'
  );
  assert.equal(result.resources[1].producer.status, 'unknown');
});

test('changed metadata or discovery between first observation and recheck blocks the snapshot', () => {
  for (const mode of ['identity', 'new-file', 'directory']) {
    const f = fixture();
    let calls = 0;
    f.services.collect = () => {
      const r = structuredClone(f.collection);
      if (++calls === 2) {
        if (mode === 'identity') r.resources[0].fileId = '999';
        if (mode === 'new-file') r.resources.pop();
        if (mode === 'directory')
          r.directories.push({
            path: 'test-results',
            device: '1',
            fileId: '5',
            mtimeNs: '1',
            ctimeNs: '1',
          });
      }
      return r;
    };
    const r = f.run();
    assert.equal(r.status, 'partial');
    assert.equal(r.summary.reviewOnly.count, 0);
    assert.equal(r.summary.uniqueNominalBytes, null);
    assert.equal(r.summary.allocatedBytesComplete, null);
  }
});

test('bounded/failed discovery remains partial and never reports complete totals', () => {
  const f = fixture();
  f.collection.status = 'partial';
  f.collection.issues = ['discovery-limit'];
  const r = f.run();
  assert.equal(r.status, 'partial');
  assert.equal(r.summary.reviewOnly.count, 0);
  const g = fixture();
  g.services.collect = () => {
    throw Error('private path token');
  };
  assert.ok(!JSON.stringify(g.run()).includes('private path token'));
});

test('unsafe collector paths, unknown codes and unsafe identity values are sanitized/refused', () => {
  for (const patch of [
    { path: 'test-results/../private.png' },
    { path: 'C:/private.png' },
    { path: 'test-results/private\n.png' },
    { bytes: Number.MAX_SAFE_INTEGER + 1 },
    { issues: ['secret text'] },
  ]) {
    const f = fixture();
    Object.assign(f.rows[0], patch);
    const r = f.run();
    assert.ok(r.diagnostics.includes('collector-contract-invalid'));
    assert.equal(r.resources.length, 0);
    assert.ok(!JSON.stringify(r).includes('secret text'));
  }
});

test('no image reads, hashes, writes or mutation; report omits absolute root and unknown fields', () => {
  const f = fixture();
  f.rows[0].privateText = 'secret-value';
  const names = [
    'writeFileSync',
    'renameSync',
    'unlinkSync',
    'rmSync',
    'mkdirSync',
    'readFileSync',
  ];
  const prior = names.map((n) => fs[n]);
  try {
    names.forEach((n) => {
      fs[n] = () => assert.fail('Unexpected IO ' + n);
    });
    const r = f.run();
    assert.equal(r.status, 'complete');
    assert.ok(!JSON.stringify(r).includes(ROOT));
    assert.ok(!JSON.stringify(r).includes('secret-value'));
  } finally {
    names.forEach((n, i) => {
      fs[n] = prior[i];
    });
  }
});

test('inventory failure/conflict is explicit, blocks resources and preserves none', () => {
  const f = fixture();
  const inventory = f.services.inventory;
  f.services.inventory = (root, paths) => {
    if (paths[0] !== 'test-results') throw Error('private info');
    return inventory(root, paths);
  };
  const r = f.run();
  assert.equal(r.status, 'partial');
  assert.equal(r.summary.blocked.count, 2);
  assert.equal(r.cleanupAuthorization, 'none');
  assert.ok(!JSON.stringify(r).includes('private info'));
});

test(
  'native bridge: metadata-only isolated fixture, bounded discovery and junction refusal',
  { skip: process.platform !== 'win32' },
  () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'org-capturas-unit-'));
    fs.mkdirSync(path.join(root, 'test-results'));
    const png = path.join(root, 'test-results', 'fixture.png');
    fs.writeFileSync(png, 'fictional fixture, not an image');
    fs.writeFileSync(path.join(root, 'test-results', 'preserved.json'), '{}');
    const before = fs.lstatSync(png, { bigint: true });
    const r = collectNative(root, LIMITS);
    assert.equal(r.status, 'complete');
    assert.equal(r.resources.length, 1);
    assert.equal(r.resources[0].bytes, Number(before.size));
    assert.ok(r.resources[0].allocatedBytes >= 0);
    const after = fs.lstatSync(png, { bigint: true });
    for (const key of ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs'])
      assert.equal(before[key], after[key]);
    const target = path.join(root, 'external-fixture');
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, 'not-observed.png'), 'external fictional fixture');
    fs.symlinkSync(target, path.join(root, 'test-results', 'junction'), 'junction');
    const linked = collectNative(root, LIMITS);
    assert.equal(linked.status, 'partial');
    assert.ok(linked.issues.includes('reparse-refused'));
    assert.equal(linked.resources.length, 1);
    assert.equal(collectNative(root, { ...LIMITS, entries: 1 }).status, 'partial');
    // All synthetic fixture files are preserved; no cleanup even in the unit test.
  }
);
