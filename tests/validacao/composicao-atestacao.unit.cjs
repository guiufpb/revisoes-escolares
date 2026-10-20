'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const { planRepository } = require('../../scripts/validacao/planejador-cli.cjs');
const { summarizePlan } = require('../../scripts/validacao/planejador-cli.cjs');
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
  INFRA_CONTRACT,
  PDF_INPUTS,
  maintenanceRows,
} = require('../../scripts/validacao/planejador-composicao.cjs');
const { makePlan } = require('../../scripts/validacao/planejador.cjs');
const { comparePlan } = require('../../scripts/validacao/planejador-comparacao.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');
const { gitRepository } = require('../../scripts/validacao/planejador-git.cjs');
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

function infrastructureFixture() {
  const f = maintained();
  f.files.clear();
  for (const [p, bytes] of f.before) f.files.set(p, bytes);
  f.manifest = JSON.parse(f.files.get('validacao/manifesto.json'));
  const sources = [
    ...new Set(
      f.manifest.revisions
        .filter((r) => r.engine === 'questionarios')
        .flatMap((r) => r.contentSources)
    ),
  ];
  const bundle = sources.map((p) => f.files.get(p)).join('\n');
  for (const map of [f.before, f.files]) map.set(BUNDLE, bundle);
  PDF_INPUTS.forEach((p, i) => {
    for (const map of [f.before, f.files]) map.set(p, Buffer.from([0, 255, 254, i]));
  });
  const oldPolicy = JSON.parse(f.before.get(POLICY_FILE));
  oldPolicy.rootInputs = oldPolicy.rootInputs.filter((p) => !PDF_INPUTS.includes(p));
  f.before.set(POLICY_FILE, JSON.stringify(oldPolicy));
  const code = 'scripts/validacao/planejador-cli.cjs';
  f.files.set(code, f.files.get(code) + '\n// Synthetic infrastructure maintenance.\n');
  f.input.changes = [POLICY_FILE, code].map((currentPath) => ({
    type: 'M',
    previousPath: currentPath,
    currentPath,
  }));
  f.input.readBytes = (side, p) => {
    const bytes = (side === 'before' ? f.before : f.files).get(p);
    return bytes === undefined ? null : Buffer.from(bytes);
  };
  f.input.comparison.mode = 'worktree';
  f.data.capability = INFRA_CONTRACT;
  const refresh = f.refresh;
  f.refresh = () => {
    refresh();
    f.data.base.policyFingerprint = hash(JSON.stringify(JSON.parse(f.before.get(POLICY_FILE))));
    f.data.target.manifestFingerprint = hash(JSON.stringify(f.manifest));
    f.data.consumerReview.bundleSha256 = f.identity.inputs.find((e) => e.path === BUNDLE).sha256;
    f.data.reviewedSurfaces = reviewedSurfaces(f.input.read).map(
      ({ maintenance: _maintenance, ...e }) => e
    );
    f.data.infrastructure = infrastructureBase(f.input.read).entries.map((e) => ({
      ...e,
      targetSha256: hash(f.input.read('after', e.path)),
    }));
    f.data.pdfInputs = PDF_INPUTS.map((path) => ({
      path,
      sha256: hash(f.input.readBytes('after', path)),
    }));
    f.data.changes = maintenanceRows(f.input).map((e) => ({
      ...e,
      rationale: 'Synthetic infrastructure and consumer review bound to each exact changed byte.',
    }));
  };
  f.refresh();
  return f;
}

test('manutenção: identidade comprovada admite somente plano global e comparação correspondente', () => {
  const f = infrastructureFixture(),
    r = run(f);
  assert.equal(r.composition.status, 'compatible', JSON.stringify(r));
  assert.equal(r.composition.capability, INFRA_CONTRACT);
  assert.equal(r.addition.structuralStatus, 'unsupported');
  assert.equal(r.blockObservation, false);
  // Use the real manifest and its full declared inventory, never a smaller expectation.
  const cases = f.manifest.tests.flatMap((t) =>
    Array.from({ length: t.expectedCases }, (_, n) => ({
      file: t.file,
      titles: ['synthetic-' + n],
      project: '',
      repeatEachIndex: 0,
    }))
  );
  cases.forEach((c) => (c.id = logicalId(c.file, c.titles)));
  const plan = makePlan({ ...f.input, manifest: f.manifest, cases, validation: { errors: [] } });
  assert.equal(plan.valid, true, JSON.stringify(plan.errors));
  assert.equal(plan.result, 'global');
  assert.equal(plan.available.caseCount, f.manifest.discovery.caseCount);
  assert.equal(plan.proposed.caseCount, plan.available.caseCount);
  assert.equal(plan.omitted.length, 0);
  const report = {
    schemaVersion: 2,
    complete: true,
    status: 'passed',
    source: f.input.comparison.worktree.source,
    sourceAtEnd: f.input.comparison.worktree.source,
    manifest: plan.manifest,
    sourcesChangedDuringRun: false,
    counts: {
      discovered: cases.length,
      expected: cases.length,
      executed: cases.length,
      passed: cases.length,
      failed: 0,
      flaky: 0,
      skipped: 0,
      notExecuted: 0,
      attempts: cases.length,
      retries: 0,
      interruptedAttempts: 0,
      timedOutAttempts: 0,
    },
    cases: cases.map((c) => ({
      ...c,
      nativeId: c.id,
      outcome: 'expected',
      attempts: [{ status: 'passed', expectedStatus: 'passed', retry: 0, durationMs: 1 }],
    })),
  };
  assert.equal(comparePlan(plan, report).comparable, true);
  report.sourceAtEnd = { ...report.sourceAtEnd, sourceFingerprint: 'f'.repeat(64) };
  assert.equal(comparePlan(plan, report).comparable, false);
});

for (const [label, mutate, pattern] of [
  [
    'política arbitrária',
    (f) => {
      f.policy.normalization = 'arbitrary policy mutation';
    },
    /Arbitrary policy/,
  ],
  ['entrada extra', (f) => f.policy.rootInputs.push('unknown.wasm'), /exactly the ten/],
  ['entrada removida', (f) => f.policy.rootInputs.splice(0, 1), /exactly the ten/],
  ['entrada duplicada', (f) => f.policy.rootInputs.push(PDF_INPUTS[0]), /exactly the ten/],
  [
    'produtor incompatível',
    (f) => f.files.set(f.policy.diagnosticProducers[0].source, 'changed producer'),
    /identity\/provenance|Producer/,
  ],
])
  test('manutenção: recusa ' + label + ' mesmo com novo corpus sintético', () => {
    const f = infrastructureFixture();
    mutate(f);
    // Some invalid producer/policy changes intentionally cannot pass identityUsable.
    if (label === 'produtor incompatível') reject(f, pattern);
    else {
      f.refresh();
      reject(f, pattern);
    }
  });

for (const [label, mutate, pattern] of [
  [
    'corpus obsoleto',
    (f) => {
      f.identity.corpusFingerprint = 'b'.repeat(64);
    },
    /identity\/provenance/,
  ],
  [
    'outro snapshot',
    (f) => {
      f.data.target.inputFingerprint = 'b'.repeat(64);
    },
    /target snapshot/,
  ],
  [
    'outro commit',
    (f) => {
      f.data.base.commit = 'b'.repeat(40);
    },
    /Base\/reference/,
  ],
  [
    'Git divergente',
    (f) => {
      f.input.comparison.identityErrors.push('synthetic mismatch');
    },
    /identity\/provenance/,
  ],
  [
    'recurso binário divergente',
    (f) => {
      f.before.set(PDF_INPUTS[0], Buffer.from([0, 255, 253, 0]));
    },
    /PDF.js bytes/,
  ],
  [
    'recurso ausente',
    (f) => {
      f.before.delete(PDF_INPUTS[0]);
    },
    /PDF.js bytes/,
  ],
  [
    'lote sem revisão individual',
    (f) => {
      f.data.changes.pop();
    },
    /Every changed path/,
  ],
  [
    'infraestrutura não revisada',
    (f) => {
      f.data.infrastructure.pop();
    },
    /infrastructure bytes/,
  ],
])
  test('manutenção: recusa ' + label, () => {
    const f = infrastructureFixture();
    mutate(f);
    reject(f, pattern);
  });

test('manutenção: revisão ausente e bytes obsoletos não são aceitos', () => {
  const f = infrastructureFixture();
  reject(f, /Review bytes/, null);
  const sealed = f.seal();
  f.data.reviewer += ' modified';
  reject(f, /Review bytes/, sealed);
});
test('manutenção: adição misturada e desconhecido não são lidos nem aceitos parcialmente', () => {
  for (const p of ['ambiente_interativo/revisoes/alice/nova.js', 'credentials/private.pdf']) {
    const f = infrastructureFixture(),
      read = f.input.read;
    f.input.changes.push({ type: 'A', currentPath: p, previousPath: null });
    f.input.read = (side, file) => {
      assert.notEqual(file, p);
      return read(side, file);
    };
    reject(f, /scope excludes/);
  }
});
test('manutenção: saídas diagnósticas presentes têm vínculo próprio no delta completo', () => {
  const f = infrastructureFixture(),
    p = f.policy.diagnosticProducers[0].paths[0];
  f.before.delete(p);
  f.input.changes.push({ type: 'A', currentPath: p, previousPath: null });
  f.refresh();
  assert.equal(run(f).composition.status, 'compatible');
  assert.equal(f.data.changes.find((e) => e.path === p).role, 'diagnostic');
  f.data.diagnostics.artifactsFingerprint = 'b'.repeat(64);
  reject(f, /Captures\/snapshot/);
});
test('manutenção: REVIEWED divergente permanece recusado pela adição v3', () => {
  const f = maintained();
  f.before.set(
    'ambiente_interativo/js/app.js',
    f.before.get('ambiente_interativo/js/app.js') + '\n'
  );
  reject(f, /Addition incomplete/);
});
test('manutenção: pins históricos divergentes não são renovados e capturas ausentes são recusadas', () => {
  const f = infrastructureFixture();
  for (const p of [
    'ambiente_interativo/js/app.entry.js',
    'ambiente_interativo/js/app.js',
    'ambiente_interativo/js/registro-revisoes.js',
    'ambiente_interativo/index.html',
  ]) {
    // A real maintenance base can already contain earlier school integrations.
    // Keep those bytes identical across this delta; do not change REVIEWED pins.
    const bytes = f.before.get(p) + '\n/* Historical integration already in base. */\n';
    f.before.set(p, bytes);
    f.files.set(p, bytes);
  }
  f.refresh();
  const r = run(f);
  assert.equal(
    r.composition.reviewedSurfaces.filter((e) => e.baseSha256 !== e.expectedSha256).length,
    4
  );
  assert.equal(r.composition.status, 'compatible');
  assert.equal(r.addition.structuralStatus, 'unsupported');
  f.files.delete(f.policy.diagnosticProducers[0].paths[0]);
  f.refresh();
  reject(f, /all diagnostic captures present/);
});
test('manutenção: caminhos unread do contrato de adição recebem hashes sem virar desconhecidos', () => {
  const f = infrastructureFixture(),
    p = 'tests/validacao/identidade.unit.cjs';
  f.before.set(p, '// Before');
  f.files.set(p, '// After');
  f.input.changes.push({ type: 'M', previousPath: p, currentPath: p });
  f.refresh();
  assert.equal(sourceRows(f.input).find((e) => e.path === p).unread, true);
  assert.equal(f.identity.unknown.length, 0);
  assert.equal(run(f).composition.status, 'compatible');
});
test('manutenção: parser malformado não serializa mensagem, stack ou conteúdo privado', () => {
  const f = infrastructureFixture();
  f.files.set(POLICY_FILE, '{SENTINELA_PRIVADA_NAO_SERIALIZAR');
  const r = reject(f, /Malformed maintenance evidence/);
  assert.deepEqual(r.composition.maintenance.failure, {
    stage: 'policy',
    code: 'maintenance-malformed',
  });
  assert.ok(!JSON.stringify(r).includes('SENTINELA_PRIVADA_NAO_SERIALIZAR'));
  assert.ok(!JSON.stringify(r).includes('SyntaxError'));
});
test('manutenção: CLI real sem revisão bloqueia descoberta e informa contagens indisponíveis', () => {
  const f = infrastructureFixture();
  const parent = path.join(ROOT, 'tmp/validacao'),
    root = fs.mkdtempSync(path.join(parent, 'infra-gate-'));
  const put = (p, bytes) => {
    const file = path.join(root, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
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
    const tree = git('write-tree'),
      commit = git(
        '-c',
        'user.name=Synthetic fixture',
        '-c',
        'user.email=fixture@example.invalid',
        'commit-tree',
        tree,
        '-m',
        'Synthetic infrastructure base'
      );
    git('update-ref', 'HEAD', commit);
    assert.deepEqual(
      gitRepository(root).readRefBytes(commit, PDF_INPUTS[0]),
      f.before.get(PDF_INPUTS[0])
    );
    for (const [p, bytes] of f.files) put(p, bytes);
    let evidence;
    const plan = planRepository(root, { mode: 'worktree', base: commit }, () => {}, {
      onCompositionEvidence: (e) => {
        evidence = e;
      },
    });
    assert.equal(plan.valid, false);
    assert.equal(plan.available, null);
    assert.equal(plan.proposed, null);
    assert.ok(
      plan.errors.some((e) => e.startsWith('Infrastructure maintenance rejected: Review bytes'))
    );
    assert.ok(plan.errors.every((e) => !e.includes('Integrated addition rejected')));
    assert.equal(evidence.capability, INFRA_CONTRACT);
    assert.match(summarizePlan(plan), /omitidos: indisponível/);
  } finally {
    assert.equal(path.dirname(root), parent);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

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
