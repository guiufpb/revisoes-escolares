'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const { planRepository } = require('../../scripts/validacao/planejador-cli.cjs');
const { validateRepository } = require('../../scripts/validacao/manifesto.cjs');
const { fixture } = require('./helpers/adicao-fixture.cjs');
const {
  captureIdentity,
  identityUsable,
  hash,
  POLICY_FILE,
} = require('../../scripts/validacao/identidade.cjs');
const { reviewedSurfaces } = require('../../scripts/validacao/planejador-adicao.cjs');
const {
  composeAddition,
  sourceRows,
  infrastructureBase,
  INFRASTRUCTURE,
  REVIEW_CONTRACT,
  loadReview,
  reviewStable,
} = require('../../scripts/validacao/planejador-composicao.cjs');
const ROOT = path.resolve(__dirname, '../..');
const BUNDLE = 'ambiente_interativo/js/app.bundle.js';

// All pin changes below are IN MEMORY, for isolated synthetic identities. The
// repository policy and its 29 real diagnostic files are never changed/read.
function maintained(profile = 'alice') {
  const f = fixture(profile);
  const putBoth = (p, text) => {
    f.before.set(p, text);
    f.files.set(p, text);
  };
  for (const p of INFRASTRUCTURE) putBoth(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
  const policy = JSON.parse(fs.readFileSync(path.join(ROOT, POLICY_FILE)));
  policy.forcedInputs = [];
  policy.syntheticInputs = [];
  policy.diagnosticAudit.corpusSha256 = 'a'.repeat(64);
  const sources = [
    ...new Set(
      f.manifest.revisions
        .filter((r) => r.engine === 'questionarios')
        .flatMap((r) => r.contentSources)
    ),
  ];
  for (const p of sources)
    if (p !== f.file) putBoth(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
  for (const p of [
    ...new Set(policy.diagnosticProducers.map((p) => p.source)),
    policy.diagnosticAudit.httpDeny.source,
  ])
    putBoth(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
  const bundle = sources.map((p) => f.files.get(p)).join('\n');
  f.files.set(BUNDLE, bundle);
  // Immutable fake images only, never actual school/diagnostic image bytes.
  for (const r of f.manifest.revisions)
    for (const p of r.assets) if (!f.files.has(p)) putBoth(p, 'synthetic immutable image');
  for (const p of policy.diagnosticProducers.flatMap((p) => p.paths))
    putBoth(p, 'synthetic capture');
  f.before.set(POLICY_FILE, JSON.stringify(policy, null, 2) + '\n');
  const snapshot = () =>
    captureIdentity({
      paths: [...f.files.keys()],
      policy,
      readBytes: (p) => (f.files.has(p) ? Buffer.from(f.files.get(p)) : null),
    });
  f.files.set(POLICY_FILE, JSON.stringify(policy, null, 2) + '\n');
  policy.diagnosticAudit.corpusSha256 = snapshot().corpusFingerprint;
  f.files.set(POLICY_FILE, JSON.stringify(policy, null, 2) + '\n');
  const identity = snapshot();
  assert.equal(identityUsable(identity), true, JSON.stringify(identity.unknown));
  f.input.changes.push({ type: 'M', previousPath: null, currentPath: POLICY_FILE });
  Object.assign(f.input.comparison.target, {
    identity,
    sourceFingerprint: identity.inputFingerprint,
  });
  f.input.comparison.worktree = {
    source: {
      available: true,
      commit: 'a'.repeat(40),
      tree: 'b'.repeat(40),
      dirty: true,
      statusFingerprint: 'c'.repeat(64),
      contentIdentity: 'working-tree-not-identical-to-commit',
      identity,
      sourceFingerprint: identity.inputFingerprint,
    },
  };
  const baseInfo = { kind: 'git-commit', commit: 'a'.repeat(40), tree: 'b'.repeat(40) };
  const data = {
    schemaVersion: 1,
    contract: REVIEW_CONTRACT,
    decision: 'reviewed-no-new-diagnostic-consumers',
    reviewer: 'Synthetic reviewer record; not human authorization',
    reviewedAt: '2026-10-16T19:00:00.000Z',
    base: {
      commit: baseInfo.commit,
      tree: baseInfo.tree,
      policyFingerprint: hash(JSON.stringify(JSON.parse(f.before.get(POLICY_FILE)))),
      infrastructureFingerprint: infrastructureBase(f.input.read).fingerprint,
    },
    target: {
      commit: 'a'.repeat(40),
      tree: 'b'.repeat(40),
      inputFingerprint: identity.inputFingerprint,
      corpusFingerprint: identity.corpusFingerprint,
      policyFingerprint: identity.policy.fingerprint,
      manifestFingerprint: hash(JSON.stringify(f.manifest)),
    },
    changes: sourceRows(f.input).map((r) => ({
      ...r,
      rationale: 'Synthetic closed integration reviewed without reading diagnostic captures.',
    })),
    producers: policy.diagnosticProducers,
    httpDeny: policy.diagnosticAudit.httpDeny,
    diagnostics: {
      paths: policy.diagnosticProducers.flatMap((p) => p.paths).sort(),
      artifactsFingerprint: identity.artifacts.fingerprint,
    },
    reviewedSurfaces: reviewedSurfaces(f.input.read).map(
      ({ maintenance: _maintenance, ...r }) => r
    ),
    consumerReview: {
      noNewDiagnosticConsumers: true,
      analysis: 'Synthetic static consumers and test callbacks reviewed; no diagnostic inputs.',
      newTestBodyReviewed: true,
      bundleOfficialBuildReviewed: true,
      bundleSha256: identity.inputs.find((e) => e.path === BUNDLE).sha256,
    },
  };
  const seal = () => {
    const bytes = Buffer.from(JSON.stringify(data, null, 2) + '\n');
    return {
      path: 'tmp/validacao/atestacoes/synthetic.json',
      bytes,
      data,
      fingerprint: hash(bytes),
    };
  };
  const refresh = () => {
    policy.diagnosticAudit.corpusSha256 = snapshot().corpusFingerprint;
    f.files.set(POLICY_FILE, JSON.stringify(policy, null, 2) + '\n');
    Object.assign(identity, snapshot());
    assert.equal(identityUsable(identity), true, JSON.stringify(identity.unknown));
    f.input.comparison.target.sourceFingerprint = identity.inputFingerprint;
    f.input.comparison.worktree.source.sourceFingerprint = identity.inputFingerprint;
    data.target.inputFingerprint = identity.inputFingerprint;
    data.target.corpusFingerprint = identity.corpusFingerprint;
    data.target.policyFingerprint = identity.policy.fingerprint;
    data.changes = sourceRows(f.input).map((r) => ({
      ...r,
      rationale: 'Synthetic consumer review bound to the revised bytes and exact snapshot.',
    }));
  };
  return { ...f, identity, policy, baseInfo, data, seal, refresh };
}
function run(f, review = f.seal()) {
  return composeAddition(f.input, review, f.baseInfo);
}
function reject(f, pattern, review = f.seal()) {
  const r = run(f, review);
  assert.equal(r.composition.status, 'rejected', JSON.stringify(r));
  assert.equal(r.blockObservation, true);
  assert.equal(r.composition.executionPolicy, 'global');
  assert.equal(r.composition.effectiveIdentity, 'blocked');
  if (pattern) assert.match(r.composition.maintenance.reasons.join('; '), pattern);
  return r;
}

for (const profile of ['alice', 'mariana'])
  test(
    'composição: adição ' + profile + ' e manutenção sintética válida compartilham alvo exato',
    () => {
      const f = maintained(profile),
        r = run(f);
      assert.equal(r.composition.status, 'compatible', JSON.stringify(r));
      assert.equal(r.addition.structuralStatus, 'proven');
      assert.equal(r.composition.maintenance.status, 'verified-evidence');
      assert.equal(r.composition.compatibility.status, 'same-target');
      assert.equal(r.composition.effectiveIdentity, 'usable');
      assert.equal(r.blockObservation, false);
      assert.equal(r.composition.fullChanges.length, 8);
      assert.equal(r.addition.claimedChanges.length, 7);
      assert.equal(r.composition.runtimeEvidence, 'not-collected');
      assert.equal(r.composition.executionPolicy, 'global');
    }
  );
test('composição: atualização de pin sem revisão é recusada antes da observação', () => {
  const f = maintained();
  reject(f, /Review bytes/, null);
});
test('composição: política arbitrária é recusada mesmo com corpus válido registrado', () => {
  const f = maintained();
  const p = JSON.parse(f.files.get(POLICY_FILE));
  p.inputRoots.push('output/');
  f.files.set(POLICY_FILE, JSON.stringify(p));
  reject(f, /Arbitrary policy/);
});
test('composição: versão de identidade não pode ser ampliada', () => {
  const f = maintained();
  const p = JSON.parse(f.files.get(POLICY_FILE));
  p.version = '1.2.0';
  f.files.set(POLICY_FILE, JSON.stringify(p));
  reject(f, /format changed/);
});
test('composição: pin sem correspondência com corpus é recusado', () => {
  const f = maintained();
  const p = JSON.parse(f.files.get(POLICY_FILE));
  p.diagnosticAudit.corpusSha256 = 'd'.repeat(64);
  f.files.set(POLICY_FILE, JSON.stringify(p));
  reject(f, /Corpus\/policy/);
});
test('composição: fingerprint bruto de outro alvo não é aproveitado', () => {
  const f = maintained();
  f.input.comparison.target.sourceFingerprint = 'd'.repeat(64);
  reject(f, /identity\/provenance/);
});
test('composição: corpus desconhecido não é atestado por metadados isolados', () => {
  const f = maintained();
  f.identity.complete = false;
  reject(f, /identity\/provenance/);
});
test('composição: revisão vinculada a outro commit ou árvore é recusada', () => {
  const f = maintained();
  f.data.base.tree = 'e'.repeat(40);
  reject(f, /Base\/reference/);
});
test('composição: procedência Git incompleta não vira snapshot válido', () => {
  const f = maintained();
  f.input.comparison.worktree.source.statusFingerprint = null;
  reject(f, /Git provenance/);
});
test('composição: revisão de outro snapshot ou manifesto é recusada', () => {
  const f = maintained();
  f.data.target.manifestFingerprint = 'd'.repeat(64);
  reject(f, /snapshot differs/);
});
test('composição: produtor protegido alterado sem justificativa é recusado', () => {
  const f = maintained();
  f.files.set(f.policy.diagnosticProducers[0].source, 'changed producer');
  reject(f, /Producer changed/);
});
test('composição: bloqueio HTTP alterado é recusado', () => {
  const f = maintained();
  f.files.set(f.policy.diagnosticAudit.httpDeny.source, 'changed deny');
  reject(f, /HTTP deny/);
});
test('composição: lista de capturas ou identidade dos artefatos divergente é recusada', () => {
  const f = maintained();
  f.data.diagnostics.paths.pop();
  reject(f, /Captures/);
});
test('composição: revisão dos consumidores precisa abranger cada arquivo', () => {
  const f = maintained();
  f.data.changes.pop();
  reject(f, /Every changed/);
});
test('composição: pin novo não substitui análise deliberada dos consumidores', () => {
  const f = maintained();
  f.data.consumerReview.analysis = '';
  reject(f, /Consumer\/bundle/);
});
test('composição: justificativa e bytes da revisão precisam corresponder', () => {
  const f = maintained();
  const r = f.seal();
  f.data.consumerReview.analysis += ' changed after seal';
  reject(f, /bytes descriptor/, r);
});
test('composição: REVIEWED obsoleto não recebe atualização automática', () => {
  const f = maintained();
  f.before.set(
    'ambiente_interativo/js/app.js',
    f.before.get('ambiente_interativo/js/app.js') + '\n'
  );
  reject(f, /Addition incomplete/);
});
test('composição: infraestrutura não commitada não é atribuída à base', () => {
  const f = maintained();
  f.before.delete(INFRASTRUCTURE[0]);
  reject(f, /Git base/);
});
test('composição: código compartilhado indevido impede aceitação parcial', () => {
  const f = maintained();
  f.files.set(
    'ambiente_interativo/js/app.js',
    f.files.get('ambiente_interativo/js/app.js') + '\nalert(1);'
  );
  reject(f, /Addition incomplete/);
});
test('composição: consumidor externo ao lote não é ignorado pela composição', () => {
  const f = maintained();
  f.input.changes.push({ type: 'M', currentPath: 'scripts/consumer.cjs' });
  reject(f, /Addition incomplete/);
});
test('composição: dependência dinâmica na spec é recusada mesmo com declaração de revisão', () => {
  const f = maintained();
  f.files.set(
    f.spec,
    f.files
      .get(f.spec)
      .replace('expect(page).toBeDefined();', "require('node:fs'); expect(page).toBeDefined();")
  );
  // Bind the changed row to the review; identity remains old and cannot authorize the bytes.
  f.data.changes = sourceRows(f.input).map((r) => ({
    ...r,
    rationale: 'Synthetic consumer review bound to the newly modified test body.',
  }));
  reject(f, /Changed bytes not bound|nested test/);
});
test('composição: consumidor indevido com pin e identidade coerentes ainda é recusado', () => {
  const f = maintained();
  f.files.set(
    f.spec,
    f.files
      .get(f.spec)
      .replace('expect(page).toBeDefined();', "require('node:fs'); expect(page).toBeDefined();")
  );
  f.refresh();
  reject(f, /nested test dependency/);
});
for (const reference of [
  'C:\\Users\\private\\school.pdf',
  '\\\\server\\private\\capture.png',
  '/private/school.png',
  '../material/escola.pdf',
  'https://example.invalid/capture',
  'file:///private/capture.png',
])
  test('composição: referência privada/externa é recusada com pin coerente: ' + reference, () => {
    const f = maintained();
    f.files.set(
      f.spec,
      f.files
        .get(f.spec)
        .replace(
          'expect(page).toBeDefined();',
          'const privateReference = ' +
            JSON.stringify(reference) +
            '; expect(privateReference).toBeDefined();'
        )
    );
    f.refresh();
    reject(f, /Diagnostic\/private reference/);
  });

test('composição: guard de estabilidade interrompe validação antes de VM/discovery', () => {
  let calls = 0;
  assert.throws(
    () =>
      validateRepository(ROOT, {
        beforeExecutableRead() {
          calls++;
          throw new Error('STALE_REVIEW_MUST_STOP');
        },
      }),
    /STALE_REVIEW_MUST_STOP/
  );
  assert.equal(calls, 1);
});
test('composição: diferença de política não pode desaparecer de fullChanges', () => {
  const f = maintained();
  f.data.changes = f.data.changes.filter((r) => r.path !== POLICY_FILE);
  reject(f, /Every changed/);
});
test('composição: revisão sem delta de política é rejeitada', () => {
  const f = maintained();
  f.input.changes = f.input.changes.filter((r) => r.currentPath !== POLICY_FILE);
  reject(f, /single modification/);
});
test('composição: base histórica sem política conserva global sem alegar manutenção', () => {
  const f = fixture();
  f.files.set(POLICY_FILE, fs.readFileSync(path.join(ROOT, POLICY_FILE), 'utf8'));
  f.input.changes = [{ type: 'A', previousPath: null, currentPath: POLICY_FILE }];
  const r = composeAddition(f.input);
  assert.equal(r.blockObservation, false);
  assert.equal(r.composition.status, 'not-requested');
  assert.equal(r.composition.maintenance.status, 'not-applicable');
  assert.equal(r.composition.compatibility.status, 'not-established');
  assert.equal(r.composition.effectiveIdentity, 'blocked');
  assert.equal(r.composition.executionPolicy, 'global');
});
test('composição: introdução de política não permite aceitar adição parcialmente', () => {
  const f = maintained();
  f.before.delete(POLICY_FILE);
  f.input.changes.find((e) => e.currentPath === POLICY_FILE).type = 'A';
  reject(f, /single modification/, null);
});
test('composição: fluxo existente sem política/revisão preserva prova original', () => {
  const f = fixture();
  const r = composeAddition(f.input);
  assert.equal(r.composition.status, 'not-requested');
  assert.equal(r.addition.structuralStatus, 'proven');
  assert.equal(r.addition.identityStatus, 'blocked');
  assert.equal(r.blockObservation, false);
});
test('composição: loader só admite registro local explícito e detecta alteração de bytes', () => {
  const relative = 'tmp/validacao/atestacoes/unit-' + process.pid + '.json';
  const absolute = path.join(ROOT, relative);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  assert.equal(fs.existsSync(absolute), false);
  fs.writeFileSync(absolute, '{"schemaVersion":1}\n', { flag: 'wx' });
  try {
    const r = loadReview(ROOT, relative);
    assert.equal(reviewStable(ROOT, r), true);
    assert.throws(() => loadReview(ROOT, 'validacao/identidade-politica.json'), /explicit local/);
    assert.throws(() => loadReview(ROOT, '../outside.json'), /explicit local/);
    fs.writeFileSync(absolute, '{"schemaVersion":2}\n');
    assert.equal(reviewStable(ROOT, r), false);
    fs.writeFileSync(absolute, '{"schemaVersion":1,"schemaVersion":2}\n');
    assert.throws(() => loadReview(ROOT, relative), /Duplicate/);
  } finally {
    fs.unlinkSync(absolute);
  }
});

test('composição: diff privado desconhecido não é lido para compor hashes', () => {
  const f = fixture();
  f.input.changes.push({ type: 'A', currentPath: 'credentials/private.pdf' });
  const read = f.input.read;
  f.input.read = (side, p) => {
    assert.notEqual(p, 'credentials/private.pdf');
    return read(side, p);
  };
  const r = composeAddition(f.input);
  assert.equal(r.blockObservation, true);
  assert.equal(
    r.composition.fullChanges.find((e) => e.path === 'credentials/private.pdf').unread,
    true
  );
});

test('composição: Git/CLI reais bloqueiam manutenção sem revisão antes de VM/discovery', () => {
  const f = fixture();
  const policy = JSON.parse(fs.readFileSync(path.join(ROOT, POLICY_FILE), 'utf8'));
  f.before.set(POLICY_FILE, JSON.stringify(policy));
  policy.diagnosticAudit.corpusSha256 = 'd'.repeat(64);
  f.files.set(POLICY_FILE, JSON.stringify(policy));
  // This unchanged fixture module would throw if executable observation were reached.
  f.before.set(
    'ambiente_interativo/js/registro-leituras.js',
    "throw new Error('VM_MUST_NOT_RUN');"
  );
  f.files.set(
    'ambiente_interativo/js/registro-leituras.js',
    f.before.get('ambiente_interativo/js/registro-leituras.js')
  );
  const parent = path.join(ROOT, 'tmp/validacao');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'composicao-gate-'));
  const put = (p, text) => {
    const file = path.join(root, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  };
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  try {
    for (const [p, bytes] of f.before) put(p, bytes);
    git('init', '-q');
    git('add', '--', ...f.before.keys());
    const tree = git('write-tree');
    const commit = git(
      '-c',
      'user.name=Synthetic fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit-tree',
      tree,
      '-m',
      'Synthetic composition guard'
    );
    git('update-ref', 'HEAD', commit);
    for (const [p, bytes] of f.files) put(p, bytes);
    let composition;
    const plan = planRepository(root, { mode: 'worktree', base: commit }, () => {}, {
      onCompositionEvidence: (e) => {
        composition = e;
      },
    });
    assert.equal(plan.valid, false);
    assert.equal(plan.proposed, null);
    assert.equal(composition.status, 'rejected');
    assert.equal(composition.base.status, 'not-represented');
    assert.ok(plan.errors.some((e) => e.includes('Review bytes descriptor required')));
    assert.ok(plan.errors.every((e) => !e.includes('VM_MUST_NOT_RUN')));
  } finally {
    assert.equal(path.dirname(root), parent);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
