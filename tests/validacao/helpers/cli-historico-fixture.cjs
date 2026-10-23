'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// The historical scenario must not inherit a caller's pending revision, manifest
// or integrations. Use one coherent tracked Git snapshot, never private files.
// Current CLI sources are overlaid so this still exercises the implementation
// under test. No historical object ID, shared clone, worktree or application edit.
function historicalCliFixture(sourceRoot) {
  const parent = path.join(sourceRoot, 'tmp/validacao');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'cli-historico-'));
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Synthetic fixture',
    GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Synthetic fixture',
    GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    GIT_ATTR_NOSYSTEM: '1',
  };
  for (const name of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_COMMON_DIR',
    'GIT_INDEX_FILE',
    'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES',
    'GIT_ATTR_SOURCE',
  ])
    delete env[name];
  const git = (cwd, args, input) =>
    execFileSync('git', ['-C', cwd, ...args], {
      input,
      windowsHide: true,
      maxBuffer: 64 * 1024 * 1024,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  const put = (file, bytes) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  };
  const rows = git(sourceRoot, ['ls-tree', '-rz', 'HEAD'])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((row) => {
      const [metadata, file] = row.split('\t');
      const [mode, type, sha] = metadata.split(' ');
      assert.equal(type, 'blob');
      assert.ok(['100644', '100755'].includes(mode), 'No links/submodules in CLI fixture');
      return { file, sha };
    });
  const objects = git(
    sourceRoot,
    ['cat-file', '--batch'],
    rows.map((r) => r.sha).join('\n') + '\n'
  );
  let offset = 0;
  const files = new Map();
  for (const row of rows) {
    const end = objects.indexOf(10, offset);
    const [sha, type, size] = objects.subarray(offset, end).toString('ascii').split(' ');
    assert.equal(sha, row.sha);
    assert.equal(type, 'blob');
    const bytes = objects.subarray(end + 1, end + 1 + Number(size));
    assert.equal(bytes.length, Number(size));
    assert.equal(objects[end + 1 + Number(size)], 10);
    files.set(row.file, bytes);
    offset = end + 2 + Number(size);
  }
  assert.equal(offset, objects.length);
  for (const { file } of rows)
    if (file.startsWith('scripts/validacao/') && file.endsWith('.cjs')) {
      files.set(file, fs.readFileSync(path.join(sourceRoot, file)));
    }
  // A fixed new public CLI dependency is overlaid even before its first commit.
  // No arbitrary untracked namespace is copied into the historical fixture.
  const optinsProof = 'scripts/validacao/planejador-adicao-optins.cjs';
  files.set(optinsProof, fs.readFileSync(path.join(sourceRoot, optinsProof)));
  const introduced = [
    'validacao/manifesto.json',
    'validacao/identidade-politica.json',
    'scripts/validacao/manifesto.cjs',
  ];
  for (const [file, bytes] of files)
    if (!introduced.includes(file))
      put(file, file === 'package.json' ? Buffer.from('{}\n') : bytes);
  git(root, ['init', '-q']);
  git(root, ['config', 'core.autocrlf', 'false']);
  git(root, ['config', 'core.attributesFile', '']);
  const baselinePaths = [...files.keys()].filter((file) => !introduced.includes(file));
  git(
    root,
    ['add', '--pathspec-from-file=-', '--pathspec-file-nul'],
    baselinePaths.join('\0') + '\0'
  );
  const tree = git(root, ['write-tree']).toString('ascii').trim();
  const base = git(root, [
    'commit-tree',
    tree,
    '-m',
    'Synthetic historical CLI base without manifest/policy',
  ])
    .toString('ascii')
    .trim();
  git(root, ['update-ref', 'HEAD', base]);
  for (const file of [...introduced, 'package.json']) put(file, files.get(file));
  fs.symlinkSync(
    path.join(sourceRoot, 'node_modules'),
    path.join(root, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir'
  );
  return {
    root,
    base,
    dispose() {
      assert.equal(path.dirname(root), parent);
      // Detach only this fixture's dependency link before deleting its own files.
      fs.unlinkSync(path.join(root, 'node_modules'));
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

module.exports = { historicalCliFixture };
