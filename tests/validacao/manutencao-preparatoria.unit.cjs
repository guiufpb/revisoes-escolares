'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const { assertRegistry } = require('./helpers/registro-contrato.cjs');
const { fixture, loadSnapshot, SNAPSHOT_FILE } = require('./helpers/adicao-fixture.cjs');
const { hash } = require('../../scripts/validacao/identidade.cjs');
const { planRepository } = require('../../scripts/validacao/planejador-cli.cjs');
const { ROOT, MANIFEST, BASELINE, readJson } = require('../../scripts/validacao/manifesto.cjs');
const { observarFontes } = require('../../scripts/validacao/fontes.cjs');
const {
  proveAddition,
  reviewedSurfaces,
} = require('../../scripts/validacao/planejador-adicao.cjs');

function registryData(manifest = readJson(ROOT, MANIFEST)) {
  return {
    manifest,
    baseline: readJson(ROOT, BASELINE),
    registro: manifest.revisions.map((r) => ({
      id: r.id,
      aluno: r.profile,
      chaveArmazenamento: r.primaryKey,
    })),
  };
}

test('preparação: preserva todas as 66 identidades/chaves históricas observadas', () => {
  const data = registryData();
  assert.equal(data.baseline.revisions.length, 66);
  const observed = observarFontes(ROOT).revisions.map((r) => ({
    id: r.id,
    aluno: r.profile,
    chaveArmazenamento: r.primaryKey,
  }));
  assertRegistry(observed, data);
});

test('preparação: aceita 67ª revisão com integrações e manifesto aditivos sintéticos', () => {
  const f = fixture();
  assert.equal(proveAddition(f.input).structuralStatus, 'proven');
  const data = registryData(f.manifest);
  assert.equal(data.registro.length, data.baseline.revisions.length + 1);
  assertRegistry(data.registro, data);
});

test('preparação: total atual deve coincidir com o manifesto, mesmo com adição', () => {
  const data = registryData(fixture().manifest);
  data.registro.pop();
  assert.throws(() => assertRegistry(data.registro, data), /Total do registro/);
});

test('preparação: remoção histórica falha mesmo removida também do manifesto', () => {
  const data = registryData();
  data.registro.shift();
  data.manifest.revisions.shift();
  assert.throws(() => assertRegistry(data.registro, data), /Revisão histórica ausente/);
});

test('preparação: substituição histórica com total igual falha em ambos os catálogos', () => {
  const data = registryData();
  data.registro[0].id = data.manifest.revisions[0].id = 'alice-historia-substituida';
  assert.throws(() => assertRegistry(data.registro, data), /Revisão histórica ausente/);
});

test('preparação: alteração histórica de chave falha mesmo alinhada ao manifesto', () => {
  const data = registryData();
  data.registro[0].chaveArmazenamento = data.manifest.revisions[0].primaryKey = 'outra.v1';
  assert.throws(() => assertRegistry(data.registro, data), /Chave histórica alterada/);
});

test('preparação: troca de identidade ou perfil com contagem igual falha', () => {
  for (const field of ['id', 'aluno', 'chaveArmazenamento']) {
    const data = registryData();
    data.registro[0][field] += '-substituido';
    assert.throws(() => assertRegistry(data.registro, data), /Identidades atuais/);
  }
});

test('preparação: rejeita IDs/chaves duplicados inclusive com manifesto alinhado', () => {
  for (const [field, manifestField, reason] of [
    ['id', 'id', /IDs duplicados/],
    ['chaveArmazenamento', 'primaryKey', /Chaves duplicadas/],
  ]) {
    const data = registryData();
    data.registro[1][field] = data.registro[0][field];
    data.manifest.revisions[1][manifestField] = data.registro[0][field];
    assert.throws(() => assertRegistry(data.registro, data), reason);
  }
});

test('preparação: referência histórica adulterada não vira expectativa atual', () => {
  const data = registryData();
  data.baseline.revisions.shift();
  assert.throws(() => assertRegistry(data.registro, data), /Referência histórica alterada/);
});

function sandbox(run) {
  const parent = path.join(ROOT, 'tmp/validacao');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'fixture-base-'));
  const env = { ...process.env, GIT_CEILING_DIRECTORIES: parent };
  for (const name of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_COMMON_DIR',
    'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES',
    'GIT_INDEX_FILE',
  ])
    delete env[name];
  const git = (...args) =>
    execFileSync('git', ['-C', root, '-c', 'core.autocrlf=false', ...args], {
      encoding: 'utf8',
      windowsHide: true,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  const put = (file, text) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
    return target;
  };
  try {
    return run({ root, env, git, put });
  } finally {
    assert.equal(path.dirname(root), parent);
    fs.rmSync(root, { recursive: true, force: true });
  }
}

for (const minimalGit of [false, true])
  test(
    'preparação: snapshot funciona com Git ' +
      (minimalGit ? 'mínimo, sem objetos emprestados' : 'ausente'),
    () =>
      sandbox(({ root, env, git, put }) => {
        if (minimalGit) {
          git('init', '-q');
          assert.equal(fs.existsSync(path.join(root, '.git/objects/info/alternates')), false);
          assert.throws(() => git('cat-file', '-e', '4d769c2f3867315e2c163405a22dd0789cc278e1'));
        } else {
          assert.equal(fs.existsSync(path.join(root, '.git')), false);
          assert.throws(() => git('rev-parse', '--git-dir'));
        }
        const snapshotFile = put('adicao-base.json', fs.readFileSync(SNAPSHOT_FILE));
        for (const profile of ['alice', 'mariana']) {
          const first = fixture(profile);
          for (const [file, text] of first.files)
            put(file, text + '\n// Later synthetic checkout addition\n');
          const next = fixture(profile, snapshotFile);
          assert.deepEqual(next.before, first.before);
          assert.deepEqual(next.files, first.files);
          assert.equal(proveAddition(next.input).structuralStatus, 'proven');
          // A fresh process cannot execute Git (or any child process) while loading
          // the fixture/proof. No cache, clone, alternates or developer objects help.
          const script = `
        const cp = require('node:child_process');
        for (const name of ['execFileSync','execSync','spawnSync','execFile','exec','spawn','fork'])
          cp[name] = () => { throw Error('CHILD_PROCESS_FORBIDDEN'); };
        const { fixture } = require(${JSON.stringify(require.resolve('./helpers/adicao-fixture.cjs'))});
        const { proveAddition } = require(${JSON.stringify(require.resolve('../../scripts/validacao/planejador-adicao.cjs'))});
        const { hash } = require(${JSON.stringify(require.resolve('../../scripts/validacao/identidade.cjs'))});
        const f = fixture(${JSON.stringify(profile)}, ${JSON.stringify(snapshotFile)});
        const result = proveAddition(f.input);
        console.log(JSON.stringify({ structural: result.structuralStatus, identity: result.identityStatus,
          before: hash(JSON.stringify([...f.before])), after: hash(JSON.stringify([...f.files])) }));
      `;
          const actual = JSON.parse(
            execFileSync(process.execPath, ['-e', script], {
              cwd: root,
              env: { ...env, PATH: '' },
              windowsHide: true,
              encoding: 'utf8',
              stdio: ['ignore', 'pipe', 'pipe'],
            })
          );
          assert.deepEqual(actual, {
            structural: 'proven',
            identity: 'blocked',
            before: hash(JSON.stringify([...first.before])),
            after: hash(JSON.stringify([...first.files])),
          });
        }
      })
  );

test('preparação: snapshot ausente falha sem fallback para Git ou checkout', () =>
  sandbox(({ root }) => {
    assert.throws(() => fixture('alice', path.join(root, 'missing.json')), { code: 'ENOENT' });
  }));

for (const [name, mutate, reason] of [
  [
    'conteúdo adulterado',
    (s) => {
      s.files[0].content += '\n';
    },
    /entry hash mismatch/,
  ],
  [
    'hash incompatível',
    (s) => {
      s.files[0].sha256 = '0'.repeat(64);
    },
    /entry hash mismatch/,
  ],
  [
    'manifesto e hash recalculados',
    (s) => {
      const entry = s.files.find((e) => e.path === MANIFEST);
      entry.content += '\n';
      entry.sha256 = hash(entry.content);
    },
    /Snapshot integrity mismatch/,
  ],
  [
    'superfície e hash recalculados',
    (s) => {
      s.files[0].content += '\n';
      s.files[0].sha256 = hash(s.files[0].content);
    },
    /Snapshot REVIEWED mismatch/,
  ],
  [
    'entrada removida',
    (s) => {
      s.files.pop();
    },
    /entry count mismatch/,
  ],
  [
    'entrada duplicada',
    (s) => {
      s.files[1] = s.files[0];
    },
    /duplicate entry/,
  ],
])
  test('preparação: snapshot recusa ' + name, () =>
    sandbox(({ put }) => {
      const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
      mutate(snapshot);
      const file = put('bad.json', JSON.stringify(snapshot));
      assert.throws(() => fixture('alice', file), reason);
    })
  );

test('preparação: snapshot íntegro reproduz onze entradas e mapas independentes', () => {
  const original = loadSnapshot();
  assert.equal(original.size, 11);
  const first = fixture();
  first.before.clear();
  first.files.clear();
  assert.deepEqual(loadSnapshot(), original);
  assert.equal(proveAddition(fixture().input).structuralStatus, 'proven');
});

test('preparação: coletor Git real recusa pin obsoleto sem usar o snapshot como base', () =>
  sandbox(({ root, git, put }) => {
    const f = fixture('mariana');
    const app = 'ambiente_interativo/js/app.js';
    f.before.set(app, f.before.get(app) + '\n');
    f.files.set(app, f.files.get(app) + '\n');
    for (const [file, text] of f.before) put(file, text);
    git('init', '-q');
    git('add', '--', ...f.before.keys());
    const tree = git('write-tree');
    // Only isolated synthetic Git objects, using the existing CLI test pattern.
    const base = git(
      '-c',
      'user.name=Synthetic fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit-tree',
      tree,
      '-m',
      'Synthetic incompatible consumer base'
    );
    git('update-ref', 'HEAD', base);
    for (const [file, text] of f.files) put(file, text);
    let evidence;
    const plan = planRepository(root, { mode: 'worktree', base }, (e) => {
      evidence = e;
    });
    assert.equal(plan.valid, false);
    assert.equal(evidence.structuralStatus, 'rejected');
    assert.match(
      evidence.reasons.join(' '),
      /Unreviewed consumer\/anchor: ambiente_interativo\/js\/app.js/
    );
    assert.ok(plan.errors.some((e) => e.includes('rejected before executable observation')));
    assert.equal(
      fs.existsSync(path.join(root, 'tests/validacao/fixtures/adicao-base.json')),
      false
    );
  }));

const surfaces = reviewedSurfaces(fixture().input.read);
assert.equal(surfaces.length, 10);
for (const surface of surfaces)
  test('preparação: REVIEWED recusa base incompatível em ' + surface.path, () => {
    const f = fixture();
    // Assert the actual fixed proof boundary, never update expected hashes.
    assert.equal(surface.baseSha256, surface.expectedSha256);
    f.before.set(surface.path, f.before.get(surface.path) + '\n');
    const result = proveAddition(f.input);
    assert.equal(result.structuralStatus, 'rejected');
    assert.ok(result.reasons.some((r) => r === 'Unreviewed consumer/anchor: ' + surface.path));
  });

test('preparação: integrações da primeira adição não renovam pins para a segunda', () => {
  const first = fixture('alice');
  assert.equal(proveAddition(first.input).structuralStatus, 'proven');
  const second = fixture('mariana');
  // Isolate the REVIEWED gate: keep the second fixture's valid manifest delta,
  // but supply the first addition's integrations as its consumer/anchor base.
  for (const { path: file } of surfaces) second.before.set(file, first.files.get(file));
  const result = proveAddition(second.input);
  assert.equal(result.structuralStatus, 'rejected');
  assert.match(result.reasons.join(' '), /Unreviewed consumer\/anchor/);
});
