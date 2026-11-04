'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const {
  inspectRecords,
  validateRecord,
  recordEvidence,
  LIMITS,
  DEFAULT_DIRECTORY,
} = require('../../scripts/validacao/registro-worktrees.cjs');
const { validateEvidence } = require('../../scripts/validacao/evidencia-organizacao.cjs');
const ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(ROOT, 'scripts/validacao/registro-worktrees.cjs');
const ID = '11111111-1111-4111-8111-111111111111';
const NOTE = '22222222-2222-4222-8222-222222222222';
const NEXT = '33333333-3333-4333-8333-333333333333';

function record() {
  return {
    schemaVersion: 1,
    worktreeId: ID,
    recordedAt: '2026-11-02T12:00:00Z',
    location: null,
    purpose: 'Synthetic implementation',
    task: { id: 'ORG.TEST', title: 'Synthetic task' },
    phase: 'implementation',
    declaredState: 'active',
    observations: [],
  };
}
function fixture() {
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  return fs.mkdtempSync(path.join(ROOT, 'tmp/registro-unit-'));
}
function put(root, value = record(), name = 'synthetic.json') {
  fs.writeFileSync(path.join(root, name), JSON.stringify(value));
}
function snapshot(root) {
  return fs
    .readdirSync(root)
    .sort()
    .map((name) => {
      const target = path.join(root, name),
        stat = fs.lstatSync(target);
      return [
        name,
        stat.size,
        stat.mtimeMs,
        stat.mode,
        stat.isFile()
          ? crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')
          : 'directory',
      ];
    });
}

test('schema and synthetic example; stable UUID across rename and repeated reads', () => {
  const root = fixture();
  put(root);
  assert.equal(validateRecord(record()).valid, true);
  const before = inspectRecords(root);
  assert.equal(before.records[0].worktreeId, ID);
  fs.renameSync(path.join(root, 'synthetic.json'), path.join(root, 'renamed.json'));
  assert.deepEqual(inspectRecords(root), before);
  assert.deepEqual(inspectRecords(root), before);
  const example = require('../fixtures/registro-worktree-sintetico.json');
  assert.equal(validateRecord(example).valid, true);
});

test('unknown is explicit, including missing directory; no inferred lifecycle or dependencies', () => {
  const root = fixture();
  const value = record();
  for (const key of ['purpose', 'task', 'phase', 'declaredState']) value[key] = null;
  put(root, value);
  const result = inspectRecords(root);
  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.records[0].unknown, [
    'purpose',
    'task',
    'phase',
    'declaredState',
    'location',
    'dependencies',
    'history',
  ]);
  assert.ok(
    result.records[0].evidence.every((item) => item.knowledge === 'unknown' && item.value === null)
  );
  assert.ok(result.unknown.includes('worktree-current-state'));
  const missing = path.join(root, 'missing');
  assert.equal(inspectRecords(missing).directory, 'absent');
  assert.equal(inspectRecords(missing).coverage, 'unknown');
  assert.equal(fs.existsSync(missing), false);
  assert.equal(inspectRecords(root).coverage, 'listed');
});

test('rejects missing/extra fields, versions, types, enums and permission fields', () => {
  const mutations = [
    (r) => {
      delete r.purpose;
    },
    (r) => {
      r.schemaVersion = 2;
    },
    (r) => {
      r.schemaVersion = '1';
    },
    (r) => {
      r.worktreeId = 'not-a-uuid';
    },
    (r) => {
      r.worktreeId = ID.replace('11111111', 'AAAAAAAA');
    },
    (r) => {
      r.phase = 'cleanup-approved';
    },
    (r) => {
      r.declaredState = false;
    },
    (r) => {
      r.canDelete = true;
    },
    (r) => {
      r.task.authorization = true;
    },
    (r) => {
      r.observations = {};
    },
    (r) => {
      r.purpose = 'x'.repeat(501);
    },
    (r) => {
      r.purpose = 'private\nvalue';
    },
    (r) => {
      r.task.id = '';
    },
    (r) => {
      r.history = Array(51).fill({ kind: 'commit', reference: 'abc', note: 'synthetic' });
    },
  ];
  for (const mutate of mutations) {
    const value = record();
    mutate(value);
    assert.equal(validateRecord(value).valid, false, JSON.stringify(value).slice(0, 200));
  }
  assert.equal(validateRecord(null).valid, false);
  assert.equal(validateRecord([]).valid, false);
});

test('strict dates reject impossible calendar dates and future observations', () => {
  for (const date of ['2026-02-30T12:00:00Z', '2026-11-02', '2026-11-02T12:00:00+00:00']) {
    assert.equal(validateRecord({ ...record(), recordedAt: date }).valid, false);
  }
  const value = record();
  value.observations.push({
    id: NOTE,
    topic: 'general',
    text: 'Synthetic note',
    recordedAt: '2026-11-03T12:00:00Z',
    supersedes: null,
  });
  assert.equal(validateRecord(value).valid, false);
});

test('observations reconcile by stable reference without erasing earlier statements', () => {
  const value = record();
  const note = {
    id: NOTE,
    topic: 'phase',
    text: 'Synthetic prior statement',
    recordedAt: '2026-11-01T12:00:00Z',
    supersedes: null,
  };
  value.observations = [
    note,
    {
      ...note,
      id: NEXT,
      text: 'Synthetic correction',
      supersedes: NOTE,
      recordedAt: value.recordedAt,
    },
  ];
  const before = JSON.stringify(value);
  assert.equal(validateRecord(value).valid, true);
  recordEvidence(value);
  assert.equal(JSON.stringify(value), before);
  for (const mutate of [
    (r) => {
      r.observations[1].id = NOTE;
    },
    (r) => {
      r.observations[0].supersedes = NEXT;
    },
    (r) => {
      r.observations[1].supersedes = NEXT;
    },
    (r) => {
      r.observations[1].topic = 'task';
    },
    (r) => {
      r.observations[1].recordedAt = '2026-10-01T12:00:00Z';
    },
  ]) {
    const copy = JSON.parse(before);
    mutate(copy);
    assert.equal(validateRecord(copy).valid, false);
  }
});

test('optional dependency/history references are validated but never dereferenced', () => {
  const root = fixture();
  const value = record();
  value.location = path.join(root, 'nonexistent-worktree');
  value.dependencies = [
    {
      kind: 'resource',
      target: path.join(root, 'nonexistent-evidence'),
      reason: 'Synthetic consumer',
    },
    { kind: 'worktree', target: NEXT, reason: 'Synthetic dependency' },
  ];
  value.history = [
    { kind: 'local-evidence', reference: 'synthetic-report-id', note: 'Reference only' },
  ];
  put(root, value);
  assert.equal(inspectRecords(root).records[0].status, 'valid');
  assert.equal(fs.existsSync(value.location), false);
  value.dependencies[1].target = ID;
  assert.equal(validateRecord(value).valid, false);
  value.dependencies[1].target = 'invalid';
  assert.equal(validateRecord(value).valid, false);
});

test('unsafe directory and record paths are refused before use', () => {
  for (const input of [
    'relative',
    '../outside',
    'C:relative',
    '\\\\server\\share',
    '\\\\?\\C:\\folder',
    '\\\\.\\C:\\folder',
    'a\0b',
    path.parse(ROOT).root,
    path.join(ROOT, '.git'),
  ]) {
    assert.equal(inspectRecords(input).exitCode, 1, input);
  }
  const root = fixture();
  for (const suffix of [
    '../outside',
    'file:stream',
    'trailing.',
    'trailing ',
    'NUL.txt',
    '.git/config',
  ]) {
    const value = record();
    value.location = root + path.sep + suffix;
    assert.equal(validateRecord(value).valid, false, suffix);
    value.location = null;
    value.dependencies = [
      { kind: 'resource', target: root + path.sep + suffix, reason: 'Synthetic' },
    ];
    assert.equal(validateRecord(value).valid, false, suffix);
  }
});

test('malformed JSON, UTF-8, unsupported entries and unknown keys are sanitized', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'private-name.json'), '{private-secret');
  fs.writeFileSync(path.join(root, 'bad-utf8.json'), Buffer.from([0xff]));
  fs.mkdirSync(path.join(root, 'nested.json'));
  fs.writeFileSync(path.join(root, 'private-secret.txt'), 'synthetic');
  put(root, { ...record(), 'private-secret': root }, 'extra.json');
  const report = inspectRecords(root);
  assert.equal(report.records.length, 5);
  assert.ok(report.records.every((item) => item.status === 'invalid'));
  const json = JSON.stringify(report);
  assert.ok(!json.includes(root));
  assert.ok(!json.includes('private-secret'));
  assert.ok(!json.includes('private-name'));
  assert.equal(report.exitCode, 2);
});

test('duplicate UUID invalidates all peers, including malformed structural peer', () => {
  const root = fixture();
  put(root, record(), 'one.json');
  put(root, { ...record(), phase: 'invalid' }, 'two.json');
  const report = inspectRecords(root);
  assert.ok(
    report.records.every(
      (r) => r.status === 'invalid' && r.diagnostics.includes('worktree-id-duplicate')
    )
  );
  assert.ok(report.records.every((r) => r.evidence.length === 0 && r.worktreeId === undefined));
});

test('symlinks, junction ancestors and hardlinks are blocked without opening targets', () => {
  const root = fixture(),
    target = fixture();
  put(target);
  fs.symlinkSync(
    target,
    path.join(root, 'linked.json'),
    process.platform === 'win32' ? 'junction' : 'dir'
  );
  fs.linkSync(path.join(target, 'synthetic.json'), path.join(root, 'hard.json'));
  const opened = [];
  const open = fs.openSync;
  fs.openSync = (...args) => {
    opened.push(args[0]);
    return open(...args);
  };
  try {
    assert.equal(inspectRecords(root).exitCode, 2);
    assert.equal(inspectRecords(path.join(root, 'linked.json')).exitCode, 1);
    assert.equal(inspectRecords(path.join(root, 'linked.json', 'child')).exitCode, 1);
    assert.deepEqual(opened, []);
  } finally {
    fs.openSync = open;
  }
  // File symlinks need a privilege on Windows; simulate lstat at the exact leaf there.
  const original = fs.lstatSync;
  fs.lstatSync = (file) =>
    file === path.join(target, 'synthetic.json') ? { isSymbolicLink: () => true } : original(file);
  try {
    assert.equal(inspectRecords(target).records[0].status, 'invalid');
  } finally {
    fs.lstatSync = original;
  }
});

test('per-file, total bytes and entry limits are bounded', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'large.json'), 'x'.repeat(LIMITS.bytes + 1));
  assert.ok(inspectRecords(root).records[0].diagnostics.includes('record-byte-limit'));
  for (let i = 0; i < LIMITS.records; i++) put(root, record(), 'record-' + i + '.json');
  const report = inspectRecords(root);
  assert.equal(report.exitCode, 1);
  assert.equal(report.records.length, 0);
  assert.equal(report.coverage, 'unknown');
  const total = fixture();
  for (let i = 0; i < 20; i++) fs.writeFileSync(path.join(total, i + '.json'), ' '.repeat(65536));
  let bytes = 0;
  const read = fs.readSync;
  fs.readSync = (...args) => {
    const count = read(...args);
    bytes += count;
    return count;
  };
  try {
    assert.ok(
      inspectRecords(total).records.some((r) => r.diagnostics.includes('record-byte-limit'))
    );
    assert.ok(bytes <= LIMITS.totalBytes);
  } finally {
    fs.readSync = read;
  }
});

test('metadata/access/read errors remain sanitized and preserve other records', () => {
  const root = fixture();
  put(root);
  put(root, { ...record(), worktreeId: NEXT }, 'other.json');
  for (const method of ['lstatSync', 'openSync', 'readSync']) {
    const original = fs[method];
    let raised = false;
    fs[method] = (...args) => {
      if (!raised && (method === 'readSync' || args[0] === path.join(root, 'other.json'))) {
        raised = true;
        throw Object.assign(new Error('private-secret ' + root), { code: 'EACCES' });
      }
      return original(...args);
    };
    try {
      const report = inspectRecords(root);
      assert.equal(report.exitCode, 2);
      assert.equal(report.records.filter((r) => r.status === 'valid').length, 1);
      assert.ok(!JSON.stringify(report).includes('private-secret'));
    } finally {
      fs[method] = original;
    }
  }
});

test('file replacement while opening is rejected', () => {
  const root = fixture();
  put(root);
  const original = fs.fstatSync;
  fs.fstatSync = (...args) => {
    const value = original(...args);
    // Windows inode numbers can exceed Number's exact integer range: +1 can
    // round back to the same value and fail to inject any replacement at all.
    const originalInode = value.ino;
    value.ino = originalInode === 0 ? 1 : 0;
    assert.notEqual(value.ino, originalInode, 'Synthetic replacement must change identity.');
    return value;
  };
  try {
    assert.ok(inspectRecords(root).records[0].diagnostics.includes('record-file-changed'));
  } finally {
    fs.fstatSync = original;
  }
});

test('read-only API and CLI preserve hashes, metadata and directory entries', () => {
  const root = fixture();
  put(root);
  const before = snapshot(root);
  const methods = [
    'writeFileSync',
    'appendFileSync',
    'mkdirSync',
    'renameSync',
    'unlinkSync',
    'rmSync',
    'truncateSync',
    'symlinkSync',
    'linkSync',
  ];
  const originals = new Map(methods.map((name) => [name, fs[name]]));
  let writes = 0;
  for (const method of methods)
    fs[method] = () => {
      writes++;
      throw new Error('write forbidden');
    };
  const open = fs.openSync;
  fs.openSync = (target, flags, ...rest) => {
    assert.equal(
      flags &
        (fs.constants.O_WRONLY |
          fs.constants.O_RDWR |
          fs.constants.O_CREAT |
          fs.constants.O_TRUNC |
          fs.constants.O_APPEND),
      0
    );
    return open(target, flags, ...rest);
  };
  try {
    assert.equal(inspectRecords(root).exitCode, 0);
    assert.equal(writes, 0);
  } finally {
    for (const [name, fn] of originals) fs[name] = fn;
    fs.openSync = open;
  }
  const output = spawnSync(process.execPath, [CLI, '--records-dir', root], { encoding: 'utf8' });
  assert.equal(output.status, 0, output.stderr);
  assert.equal(JSON.parse(output.stdout).records[0].status, 'valid');
  assert.ok(!output.stdout.includes(root));
  assert.deepEqual(snapshot(root), before);
});

test('CLI help, bad arguments, fatal/partial exit codes and absent default do not write', () => {
  const root = fixture();
  assert.equal(spawnSync(process.execPath, [CLI, '--help']).status, 0);
  for (const args of [
    ['--delete', root],
    ['--records-dir'],
    ['--records-dir', root, '--records-dir', root],
  ]) {
    const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(result.stdout).exitCode, 1);
  }
  put(root, { schemaVersion: 999 });
  const partial = spawnSync(process.execPath, [CLI, '--records-dir', root], { encoding: 'utf8' });
  assert.equal(partial.status, 2);
  assert.equal(JSON.parse(partial.stdout).exitCode, 2);
  assert.ok(path.isAbsolute(DEFAULT_DIRECTORY));
  assert.ok(!DEFAULT_DIRECTORY.startsWith(ROOT));
});

test('evidence contract accepts lifecycle and independent resources without record coupling', () => {
  const evidence = recordEvidence(record());
  assert.ok(evidence.every(validateEvidence));
  assert.equal(evidence.find((e) => e.fact === 'phase').value, 'implementation');
  assert.ok(!JSON.stringify(evidence).includes('Synthetic'));
  const observed = {
    evidenceVersion: 1,
    subject: { kind: 'resource', id: 'resource-1' },
    source: 'resource-observation',
    fact: 'resource-exists',
    knowledge: 'observed',
    value: false,
    observedAt: '2026-11-02T12:00:00Z',
  };
  assert.equal(validateEvidence(observed), true);
  assert.equal(
    validateEvidence({ ...observed, knowledge: 'unknown', value: null, observedAt: null }),
    true
  );
  for (const mutate of [
    (e) => {
      e.canDelete = true;
    },
    (e) => {
      e.evidenceVersion = 2;
    },
    (e) => {
      e.value = null;
    },
    (e) => {
      e.observedAt = null;
    },
    (e) => {
      e.knowledge = 'declared';
    },
    (e) => {
      e.value = 'tracked';
    },
    (e) => {
      e.source = 'lifecycle-record';
    },
    (e) => {
      e.subject.id = '../private';
    },
    (e) => {
      e.observedAt = '2026-02-30T12:00:00Z';
    },
  ]) {
    const copy = structuredClone(observed);
    mutate(copy);
    assert.equal(validateEvidence(copy), false);
  }
  assert.deepEqual(recordEvidence({}), []);
});

test('independent evidence validator does not load lifecycle schema or reader', () => {
  const script = `
    const assert = require('node:assert/strict');
    require('./scripts/validacao/evidencia-organizacao.cjs');
    assert.ok(!Object.keys(require.cache).some((name) =>
      /registro-worktree(?:s\\.cjs|\\.schema\\.json)$/.test(name)));
  `;
  const output = spawnSync(process.execPath, ['-e', script], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(output.status, 0, output.stderr);
});
