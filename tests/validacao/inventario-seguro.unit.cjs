'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const { inspect } = require('../../scripts/validacao/inventario-seguro.cjs');
const ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(ROOT, 'scripts/validacao/inventario-seguro.cjs');

function fixture() {
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/inventario-unit-'));
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true });
  git('init', '--quiet');
  git('config', 'user.name', 'Fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'core.autocrlf', 'false');
  fs.writeFileSync(path.join(root, '.gitignore'), 'ignored.txt\n');
  fs.writeFileSync(path.join(root, 'tracked.txt'), 'synthetic\n');
  fs.writeFileSync(path.join(root, 'literal[1].txt'), 'synthetic\n');
  git('--literal-pathspecs', 'add', '--', '.gitignore', 'tracked.txt', 'literal[1].txt');
  git('-c', 'core.hooksPath=NUL', 'commit', '--quiet', '-m', 'synthetic');
  fs.writeFileSync(path.join(root, 'ignored.txt'), 'synthetic ignored\n');
  fs.writeFileSync(path.join(root, 'untracked.txt'), 'synthetic untracked\n');
  fs.mkdirSync(path.join(root, 'directory'));
  return { root, git };
}

function snapshot(root) {
  const rows = [];
  function visit(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name),
        st = fs.lstatSync(file);
      if (st.isSymbolicLink())
        rows.push([path.relative(root, file), 'link', fs.readlinkSync(file)]);
      else if (st.isDirectory()) {
        rows.push([path.relative(root, file), 'directory']);
        visit(file);
      } else
        rows.push([
          path.relative(root, file),
          st.size,
          st.mtimeMs,
          crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
        ]);
    }
  }
  visit(root);
  return rows;
}

test('metadata and Git provenance; directories not enumerated; no mutation including index', () => {
  const { root } = fixture();
  const before = snapshot(root);
  const report = inspect(root, [
    'tracked.txt',
    'ignored.txt',
    'untracked.txt',
    'directory',
    'missing.txt',
  ]);
  assert.deepEqual(
    report.resources.map((r) => r.git),
    ['tracked', 'ignored', 'untracked', 'directory-contents-unverified', 'untracked']
  );
  assert.equal(report.resources[0].bytes, 10);
  assert.equal(report.resources[3].type, 'directory');
  assert.equal(report.resources[4].exists, false);
  assert.equal(report.worktree.detached, false);
  assert.deepEqual(snapshot(root), before);
});

test('detached HEAD is explicit', () => {
  const { root, git } = fixture();
  git('checkout', '--quiet', '--detach');
  assert.equal(inspect(root, ['tracked.txt']).worktree.detached, true);
});

test('Git resource paths are literal, not glob patterns', () => {
  const { root } = fixture();
  assert.equal(inspect(root, ['literal[1].txt']).resources[0].git, 'tracked');
});

test('rejects traversal, absolute paths, ADS, control characters and Git administration', () => {
  const { root } = fixture();
  const paths = [
    '../outside',
    'directory/../../outside',
    '/outside',
    'C:\\outside',
    'C:outside',
    'tracked.txt:stream',
    'a\nfile',
    '.git/config',
  ];
  const result = inspect(root, paths);
  assert.ok(result.resources.every((r) => r.type === 'indeterminate'));
  assert.throws(() => inspect(path.join(root, 'directory'), ['.']));
  assert.throws(() => inspect('.', ['tracked.txt']));
});

test('blocks junction/symlink leaf and intermediate components without visiting target', () => {
  const { root } = fixture();
  const target = fs.mkdtempSync(path.join(ROOT, 'tmp/inventario-target-'));
  fs.writeFileSync(path.join(target, 'private.txt'), 'synthetic sentinel');
  fs.symlinkSync(
    target,
    path.join(root, 'link'),
    process.platform === 'win32' ? 'junction' : 'dir'
  );
  const visits = [];
  const result = inspect(root, ['link', 'link/private.txt'], {
    lstat(file) {
      visits.push(file);
      return fs.lstatSync(file);
    },
  });
  assert.ok(result.resources.every((r) => r.issue === 'link-in-path-not-followed'));
  assert.ok(!visits.includes(path.join(root, 'link/private.txt')));
  assert.throws(() => inspect(path.join(root, 'link'), ['private.txt']));
});

test('access and Git failures stay indeterminate and do not leak stderr', () => {
  const { root } = fixture();
  const result = inspect(root, ['tracked.txt'], {
    lstat(file) {
      if (file === path.join(root, 'tracked.txt'))
        throw Object.assign(new Error('private'), { code: 'EACCES' });
      return fs.lstatSync(file);
    },
  });
  assert.equal(result.resources[0].issue, 'metadata-unavailable');
  assert.throws(
    () =>
      inspect(root, ['tracked.txt'], {
        git() {
          throw new Error('private');
        },
      }),
    /Consulta Git/
  );
  const mixed = inspect(root, ['tracked.txt'], {
    git(_root, args) {
      if (args[0] === 'ls-files') throw new Error('private');
      return execFileSync('git', ['-C', root, ...args], {
        encoding: 'utf8',
        windowsHide: true,
      }).trim();
    },
  });
  assert.equal(mixed.resources[0].git, 'indeterminate');
  assert.ok(!JSON.stringify(mixed).includes('private'));
});

test('CLI help, bounded arguments, environment isolation and side-effect-free subprocess', () => {
  const { root } = fixture();
  const before = snapshot(root);
  const result = spawnSync(process.execPath, [CLI, '--root', root, '--path', 'tracked.txt'], {
    encoding: 'utf8',
    env: { ...process.env, GIT_DIR: path.join(root, 'nonexistent') },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).resources[0].git, 'tracked');
  assert.ok(!result.stdout.includes(root));
  assert.deepEqual(snapshot(root), before);
  assert.equal(spawnSync(process.execPath, [CLI, '--help']).status, 0);
  assert.equal(spawnSync(process.execPath, [CLI, '--delete', root]).status, 1);
  assert.throws(() => inspect(root, []));
  assert.throws(() => inspect(root, Array(101).fill('tracked.txt')));
});

function rawGit(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true });
}

test('leading spaces, hyphen, dot prefix and mixed separators retain literal index names', () => {
  const { root, git } = fixture();
  for (const name of [' leading.txt', '-option.txt', '..notas.txt']) {
    fs.writeFileSync(path.join(root, name), 'synthetic');
    git('--literal-pathspecs', 'add', '--', name);
  }
  const report = inspect(root, [
    ' leading.txt',
    '-option.txt',
    '..notas.txt',
    'directory\\missing.txt',
  ]);
  assert.deepEqual(
    report.resources.map((r) => r.git),
    ['tracked', 'tracked', 'tracked', 'untracked']
  );
  assert.equal(report.exitCode, 0);
  // A valid NUL entry retains trailing spaces as well, even though Windows resource
  // arguments with trailing spaces are deliberately unsupported.
  const seen = [];
  const simulated = inspect(root, ['tracked.txt'], {
    git(r, args) {
      if (args[0] === 'ls-files') {
        seen.push('tracked.txt \0');
        return seen[0];
      }
      return rawGit(r, args);
    },
  });
  assert.equal(simulated.resources[0].git, 'untracked');
});

test('case differences use filesystem evidence; missing or ambiguous evidence stays partial', () => {
  const { root } = fixture();
  const actual = inspect(root, ['TRACKED.TXT']);
  assert.equal(
    actual.resources[0].git,
    fs.existsSync(path.join(root, 'TRACKED.TXT'))
      ? 'tracked'
      : process.platform === 'win32'
        ? 'indeterminate'
        : 'untracked'
  );
  const target = path.join(root, 'TRACKED.TXT');
  const targetStat = fs.lstatSync(path.join(root, 'tracked.txt'));
  const services = {
    platform: 'win32',
    lstat(file) {
      return file === target ? targetStat : fs.lstatSync(file);
    },
    realpath(file) {
      return file === target
        ? fs.realpathSync.native(path.join(root, 'tracked.txt'))
        : fs.realpathSync.native(file);
    },
    git(r, args) {
      return args[0] === 'ls-files' ? 'tracked.txt\0' : rawGit(r, args);
    },
  };
  assert.equal(inspect(root, ['TRACKED.TXT'], services).resources[0].git, 'tracked');
  const ambiguous = inspect(root, ['TRACKED.TXT'], {
    ...services,
    git(r, args) {
      return args[0] === 'ls-files' ? 'tracked.txt\0TRACKED.TXT\0' : rawGit(r, args);
    },
  });
  assert.equal(ambiguous.exitCode, 2);
  assert.equal(ambiguous.resources[0].git, 'indeterminate');
  const distinct = inspect(root, ['TRACKED.TXT'], {
    ...services,
    lstat(file) {
      return file === target
        ? {
            ...targetStat,
            ino: targetStat.ino + 1,
            isFile: () => true,
            isDirectory: () => false,
            isSymbolicLink: () => false,
          }
        : fs.lstatSync(file);
    },
  });
  assert.equal(distinct.resources[0].git, 'untracked');
});

test('CLI exit contract: complete, legitimate absence, partial, refusal and fatal', () => {
  const { root } = fixture();
  for (const [paths, expected, status] of [
    [['tracked.txt'], 0, 'complete'],
    [['missing.txt'], 0, 'complete'],
    [['../outside'], 2, 'partial'],
    [['tracked.txt', '../outside'], 2, 'partial'],
  ]) {
    const args = paths.flatMap((p) => ['--path', p]);
    const result = spawnSync(process.execPath, [CLI, '--root', root, ...args], {
      encoding: 'utf8',
    });
    assert.equal(result.status, expected);
    assert.equal(JSON.parse(result.stdout).status, status);
    assert.equal(JSON.parse(result.stdout).exitCode, expected);
  }
  const fatal = spawnSync(process.execPath, [CLI, '--root', root], { encoding: 'utf8' });
  assert.equal(fatal.status, 1);
  assert.equal(JSON.parse(fatal.stdout).status, 'fatal');
  assert.ok(!fatal.stderr.includes(root));
});

test('linked worktree does not mutate its files or shared Git metadata', () => {
  const { root, git } = fixture();
  const linked = root + '-linked';
  git('worktree', 'add', '--quiet', '--detach', linked);
  assert.equal(fs.lstatSync(path.join(linked, '.git')).isFile(), true);
  const before = snapshot(root),
    linkedBefore = snapshot(linked);
  assert.equal(inspect(linked, ['tracked.txt']).resources[0].git, 'tracked');
  assert.deepEqual(snapshot(root), before);
  assert.deepEqual(snapshot(linked), linkedBefore);
});

test('UNC/device roots and absolute resource variants are explicitly refused', () => {
  const { root } = fixture();
  for (const unsupported of ['\\\\server\\share', '\\\\?\\C:\\repo', '\\\\.\\C:\\repo'])
    assert.throws(() => inspect(unsupported, ['x']), /nao suportada/);
  for (const resource of ['\\\\server\\share\\x', '\\\\?\\C:\\x', '\\x', 'C:/x'])
    assert.equal(inspect(root, [resource]).exitCode, 2);
});

test('check-ignore failure, timeout, buffer limit and malformed NUL output are partial', () => {
  const { root } = fixture();
  for (const [command, failure] of [
    ['check-ignore', { status: 128 }],
    ['ls-files', { code: 'ETIMEDOUT' }],
    ['ls-files', { code: 'ENOBUFS' }],
  ]) {
    const before = snapshot(root);
    const result = inspect(root, ['untracked.txt'], {
      git(r, args) {
        if (args[0] === command) throw Object.assign(new Error('private external stderr'), failure);
        return rawGit(r, args);
      },
    });
    assert.equal(result.exitCode, 2);
    assert.equal(result.resources[0].issue, 'git-query-unavailable');
    assert.ok(!JSON.stringify(result).includes('private external'));
    assert.deepEqual(snapshot(root), before);
  }
  assert.equal(
    inspect(root, ['tracked.txt'], {
      git(r, args) {
        return args[0] === 'ls-files' ? 'tracked.txt' : rawGit(r, args);
      },
    }).exitCode,
    2
  );
});
