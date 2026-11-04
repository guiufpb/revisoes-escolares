'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { evaluatePair, LIMIT_BYTES } = require('../../scripts/validacao/avaliar-par-reporter.cjs');

// In-memory IO only. No files, A/B scenarios, reporter calls or historical artifacts.
const ROOT = path.resolve(__dirname, '../..');
const ID = '11111111-1111-4111-8111-111111111111';
const RUN = '2026-11-04T03-00-00-000Z-' + ID;
const EXPERIMENT = 'tmp/org9b-reporter-ab-' + ID;
const BASE = 'a'.repeat(40);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function fixture() {
  const options = { root: ROOT, experiment: EXPERIMENT, runId: RUN, allowContent: true };
  const relative = [
    EXPERIMENT + '/tmp/validacao/' + RUN + '/run.json.tmp',
    EXPERIMENT + '/tmp/validacao/' + RUN + '/run.json',
    EXPERIMENT + '/observacoes.json',
  ];
  const files = new Map();
  const directories = new Map();
  const descriptors = new Map();
  let nextId = 100n;
  const stats = (kind, size = 0) => ({
    dev: 1n,
    ino: nextId++,
    size: BigInt(size),
    mode: 1n,
    nlink: 1n,
    mtimeNs: 10n,
    ctimeNs: 20n,
    isFile: () => kind === 'file',
    isDirectory: () => kind === 'directory',
    isSymbolicLink: () => kind === 'link',
  });
  function put(index, bytes) {
    const target = path.join(ROOT, ...relative[index].split('/'));
    const prior = files.get(target);
    files.set(target, {
      bytes: Buffer.from(bytes),
      stat: { ...(prior?.stat || stats('file')), size: BigInt(Buffer.byteLength(bytes)) },
    });
    let parent = path.dirname(target);
    while (!directories.has(parent)) {
      directories.set(parent, stats('directory'));
      const next = path.dirname(parent);
      if (next === parent) break;
      parent = next;
    }
  }
  const report = { schemaVersion: 2, runId: RUN, syntheticExperiment: true, cases: [] };
  put(0, JSON.stringify(report));
  put(1, JSON.stringify(report));
  const current = (index) => files.get(path.join(ROOT, ...relative[index].split('/')));
  function observations() {
    const describe = (index) => ({
      exists: true,
      fileId: String(current(index).stat.ino),
      sizeBytes: current(index).bytes.length,
      modifiedAtNs: '10',
    });
    return {
      experimentId: path.posix.basename(EXPERIMENT),
      runId: RUN,
      baseCommit: BASE,
      artifactOrigin: 'intentionally-created-experiment',
      sequenceCompleted: true,
      reporterSourceModified: false,
      historicalTargetsUsed: false,
      A: { returned: true, 'run.json': describe(1), 'run.json.tmp': { exists: false } },
      B: {
        returned: false,
        error: { code: 'EPERM', syscall: 'rename' },
        'run.json': describe(1),
        'run.json.tmp': describe(0),
      },
      finalIdentityPreservedFromA: true,
      handle: { opened: true, closed: true, shareDelete: false },
      afterHandleClosed: { 'run.json.tmp': describe(0), 'run.json': describe(1) },
      comparison: { temporarySha256: sha(current(0).bytes), finalSha256: sha(current(1).bytes) },
    };
  }
  put(2, JSON.stringify(observations()));
  const openedFlags = [];
  let reads = 0;
  let closes = 0;
  const io = {
    lstatSync(target, config) {
      assert.equal(config.bigint, true);
      const item = files.get(target)?.stat || directories.get(target);
      if (!item) throw Object.assign(new Error('private native error'), { code: 'ENOENT' });
      return { ...item };
    },
    openSync(target, flags) {
      assert.ok(files.has(target), 'Only explicitly selected files may be opened');
      openedFlags.push(flags);
      const fd = descriptors.size;
      descriptors.set(fd, { file: files.get(target), offset: 0 });
      return fd;
    },
    fstatSync(fd, config) {
      assert.equal(config.bigint, true);
      return { ...descriptors.get(fd).file.stat };
    },
    readSync(fd, buffer, offset, length) {
      reads++;
      const entry = descriptors.get(fd);
      const n = Math.min(length, entry.file.bytes.length - entry.offset);
      entry.file.bytes.copy(buffer, offset, entry.offset, entry.offset + n);
      entry.offset += n;
      return n;
    },
    closeSync() {
      closes++;
    },
  };
  const services = {
    fs: io,
    now: () => '2026-11-04T04:00:00Z',
    inventory(root, paths) {
      assert.equal(root, ROOT);
      assert.deepEqual(paths, relative);
      return {
        status: 'complete',
        exitCode: 0,
        worktree: {
          label: 'fixture',
          head: BASE,
          branch: 'codex/fixture',
          detached: false,
          provenance: 'git',
        },
        resources: paths.map((p) => {
          const item = files.get(path.join(ROOT, ...p.split('/')));
          return {
            path: p,
            type: item ? 'file' : 'absent',
            exists: !!item,
            ...(item ? { bytes: item.bytes.length } : {}),
            git: 'ignored',
            provenance: ['filesystem', 'git-index-or-ignore'],
          };
        }),
        limits: [],
      };
    },
  };
  const run = () => evaluatePair(options, services);
  return {
    options,
    services,
    io,
    files,
    directories,
    relative,
    put,
    current,
    observations,
    run,
    openedFlags,
    counts: () => ({ reads, closes }),
  };
}

test('equal physical bytes and report; declarations corroborated without cleanup or consumer inference', () => {
  const f = fixture();
  const result = f.run();
  assert.equal(result.status, 'complete');
  assert.equal(result.comparison.bytes, 'equal');
  assert.equal(result.comparison.reports, 'equal');
  assert.equal(result.producer.experiment, 'corroborated-declaration');
  assert.equal(result.producer.authenticated, false);
  assert.equal(result.producer.currentProcessState, 'unknown');
  assert.equal(result.consumers.externalConsumers, 'unknown');
  assert.equal(result.consumers.concurrentProcesses, 'unknown');
  assert.equal(result.space.temporaryObservedBytes, f.current(0).bytes.length);
  assert.equal(result.space.recoverableBytes, null);
  assert.equal(result.cleanupAuthorization, 'none');
  assert.equal(result.conclusion.dispensability, 'undetermined');
  assert.equal(f.counts().closes, 3);
  assert.ok(
    f.openedFlags.every(
      (flags) =>
        flags ===
        (fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0) | (fs.constants.O_NONBLOCK || 0))
    )
  );
  assert.ok(result.inventory.resources.every((r) => r.evidence.length === 3));
  assert.ok(!JSON.stringify(result).includes(ROOT));
});

test('divergence is independently computed; old claims of equality cannot hide changed bytes', () => {
  const f = fixture();
  f.put(0, JSON.stringify({ schemaVersion: 2, runId: RUN, syntheticExperiment: true, cases: [1] }));
  const result = f.run();
  assert.equal(result.comparison.bytes, 'different');
  assert.equal(result.comparison.reports, 'different');
  assert.equal(result.producer.experiment, 'declaration-conflict');
  assert.equal(result.cleanupAuthorization, 'none');
});

test('missing final or intermediate or observations remains partial, with handles closed', () => {
  for (const index of [0, 1, 2]) {
    const f = fixture();
    f.files.delete(path.join(ROOT, ...f.relative[index].split('/')));
    const result = f.run();
    assert.equal(result.status, 'partial');
    assert.equal(result.resources[index].exists, false);
    assert.ok(result.diagnostics.includes('file-absent'));
    if (index < 2) assert.equal(result.comparison.bytes, 'inconclusive');
    assert.equal(f.counts().closes, 2);
  }
});

test('hardlinks, missing identity, nonregular file and links refuse content acquisition', () => {
  for (const update of [
    { nlink: 2n },
    { ino: 0n },
    { isFile: () => false },
    { isSymbolicLink: () => true },
  ]) {
    const f = fixture();
    Object.assign(f.current(0).stat, update);
    const result = f.run();
    assert.equal(result.comparison.bytes, 'inconclusive');
    assert.equal(result.resources[0].status, 'indeterminate');
    assert.equal(f.openedFlags.length, 2);
    assert.equal(result.cleanupAuthorization, 'none');
  }
});

test('parent link blocks all three opens without following the target', () => {
  const f = fixture();
  const parent = path.join(ROOT, ...EXPERIMENT.split('/'));
  f.directories.get(parent).isSymbolicLink = () => true;
  const result = f.run();
  assert.equal(f.openedFlags.length, 0);
  assert.ok(result.diagnostics.includes('link-in-path'));
});

test('large file is refused before open; oversized stream also cannot escape read limit', () => {
  const f = fixture();
  f.current(0).stat.size = BigInt(LIMIT_BYTES + 1);
  assert.ok(f.run().diagnostics.includes('byte-limit'));
  assert.equal(f.openedFlags.length, 2);
  const g = fixture();
  g.current(0).bytes = Buffer.alloc(LIMIT_BYTES + 5);
  assert.ok(g.run().diagnostics.includes('byte-limit'));
  assert.equal(g.counts().closes, 3);
});

test('changes before open, during read or after another resource acquisition invalidate comparison', () => {
  for (const stage of ['open', 'read', 'later-read', 'parent']) {
    const f = fixture();
    const originalOpen = f.io.openSync;
    f.io.openSync = (target, flags) => {
      const fd = originalOpen(target, flags);
      if (stage === 'open' && fd === 0) f.current(0).stat.ino++;
      if (stage === 'later-read' && fd === 2) f.current(0).stat.mtimeNs++;
      if (stage === 'parent' && fd === 2) f.directories.get(ROOT).mtimeNs++;
      return fd;
    };
    const originalRead = f.io.readSync;
    f.io.readSync = (...args) => {
      const n = originalRead(...args);
      if (stage === 'read' && args[0] === 0) f.current(0).stat.ctimeNs++;
      return n;
    };
    const result = f.run();
    assert.equal(result.comparison.bytes, 'inconclusive', stage);
    assert.ok(result.diagnostics.includes('changed-during-observation'), stage);
    assert.equal(f.counts().closes, 3);
  }
});

test('read errors are sanitized and every acquired descriptor is closed', () => {
  const f = fixture();
  const read = f.io.readSync;
  f.io.readSync = (...args) => {
    if (args[0] === 0) throw new Error('private content secret');
    return read(...args);
  };
  const result = f.run();
  assert.equal(result.comparison.bytes, 'inconclusive');
  assert.ok(!JSON.stringify(result).includes('private content secret'));
  assert.equal(f.counts().closes, 3);
});

test('no explicit content permission means zero opens, reads or digests', () => {
  const f = fixture();
  f.options.allowContent = false;
  const result = f.run();
  assert.equal(f.openedFlags.length, 0);
  assert.equal(f.counts().reads, 0);
  assert.equal(result.comparison.bytes, 'inconclusive');
  assert.ok(result.diagnostics.includes('content-reading-not-authorized'));
  assert.ok(result.resources.every((r) => r.sha256 === undefined));
});

test('malformed/missing provenance cannot grant authenticity even when the pair is equal', () => {
  for (const value of [
    '{',
    '{}',
    JSON.stringify({ ...fixture().observations(), handle: { closed: false } }),
  ]) {
    const f = fixture();
    f.put(2, value);
    const result = f.run();
    assert.equal(result.comparison.bytes, 'equal');
    assert.equal(result.status, 'partial');
    assert.equal(result.producer.experiment, 'insufficient-information');
    assert.equal(result.cleanupAuthorization, 'none');
  }
});

test('bytes can match while report identity or UTF-8 remains unverified', () => {
  for (const bytes of [Buffer.from([255]), Buffer.from(JSON.stringify({ runId: 'wrong' }))]) {
    const f = fixture();
    f.put(0, bytes);
    f.put(1, bytes);
    const result = f.run();
    assert.equal(result.comparison.bytes, 'equal');
    assert.equal(result.comparison.reports, 'inconclusive');
    assert.equal(result.status, 'partial');
  }
});

test('explicit scope rejects traversal, generic paths and unsupported roots before IO', () => {
  for (const patch of [
    { experiment: '../private' },
    { experiment: 'tmp/validacao' },
    { runId: '../outside' },
    { root: 'relative' },
    { root: '\\\\server\\share' },
    { allowContent: undefined },
  ]) {
    const f = fixture();
    Object.assign(f.options, patch);
    f.services.inventory = () => assert.fail('No IO on invalid scope');
    assert.ok(f.run().diagnostics.includes('explicit-experimental-scope-invalid'));
  }
});

test('incompatible inventory is not treated as known physical evidence', () => {
  const f = fixture();
  f.services.inventory = () => ({ status: 'unsupported' });
  const result = f.run();
  assert.equal(result.status, 'partial');
  assert.equal(f.openedFlags.length, 0);
  assert.equal(result.cleanupAuthorization, 'none');
});

test('same physical identity cannot establish a pair of distinct resources', () => {
  const f = fixture();
  f.current(1).stat.ino = f.current(0).stat.ino;
  const result = f.run();
  assert.equal(result.comparison.bytes, 'inconclusive');
  assert.ok(result.diagnostics.includes('pair-identity-not-distinct'));
  assert.equal(result.cleanupAuthorization, 'none');
});

test('contradictory A/B declaration and missing source identity stay insufficient', () => {
  for (const change of [
    (record) => {
      record.A['run.json'].fileId = 'different';
    },
    (record) => {
      delete record.baseCommit;
    },
  ]) {
    const f = fixture();
    const record = f.observations();
    change(record);
    f.put(2, JSON.stringify(record));
    const result = f.run();
    assert.notEqual(result.producer.experiment, 'corroborated-declaration');
    assert.equal(result.status, 'partial');
  }
});
