'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  captureIdentity,
  hash,
  treatmentResolved,
} = require('../../scripts/validacao/identidade.cjs');
const { comparePlan } = require('../../scripts/validacao/planejador-comparacao.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');
const { ROOT } = require('../../scripts/validacao/manifesto.cjs');

test('PDF.js: dez entradas exatas preservam bytes, detectam alteração/remoção e recusam novos recursos', () => {
  const names = [
    'jbig2.wasm',
    'openjpeg.wasm',
    'qcms_bg.wasm',
    'quickjs-eval.wasm',
    'LICENSE_JBIG2',
    'LICENSE_OPENJPEG',
    'LICENSE_PDFJS_JBIG2',
    'LICENSE_PDFJS_OPENJPEG',
    'LICENSE_PDFJS_QCMS',
    'LICENSE_QCMS',
  ];
  const paths = names.map((name) => 'ambiente_interativo/js/pdfjs-wasm/' + name);
  const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'validacao/identidade-politica.json')));
  const files = new Map(paths.map((file) => [file, fs.readFileSync(path.join(ROOT, file))]));
  const snapshot = (scope = paths) =>
    captureIdentity({
      paths: scope,
      policy,
      gitScope: true,
      readBytes: (file) => files.get(file) || null,
    });
  assert.equal(policy.inputExtensions.includes('.wasm'), false);
  assert.equal(policy.inputExtensions.includes(''), false);
  const start = snapshot();
  assert.equal(start.complete, true);
  assert.equal(start.inputCount, 10);
  for (const file of paths) {
    const bytes = files.get(file);
    assert.equal(start.inputs.find((e) => e.path === file).sha256, hash(bytes));
    assert.equal(treatmentResolved(start, file), true);
    files.set(file, Buffer.concat([bytes, Buffer.from([0xff, 0x00])]));
    const altered = snapshot();
    assert.notEqual(altered.inputFingerprint, start.inputFingerprint, file);
    assert.notEqual(altered.corpusFingerprint, start.corpusFingerprint, file);
    assert.notEqual(altered.inputs.find((e) => e.path === file).sha256, hash(bytes), file);
    files.delete(file);
    const missing = snapshot();
    assert.equal(missing.complete, false, file);
    assert.ok(
      missing.unknown.some((e) => e.path === file),
      file
    );
    files.set(file, bytes);
  }
  for (const name of ['unknown.wasm', 'LICENSE_UNKNOWN']) {
    const file = 'ambiente_interativo/js/pdfjs-wasm/' + name;
    files.set(file, Buffer.from('unreviewed public resource'));
    const unknown = snapshot([...paths, file]);
    assert.equal(unknown.complete, false);
    assert.equal(treatmentResolved(unknown, file), false);
    assert.ok(unknown.unknown.some((e) => e.path === file));
  }
});

function fixture({ diagnostic = true } = {}) {
  const files = new Map([
    ['tests/producer.js', Buffer.from('page.screenshot({path:"output/known.png"});')],
    ['scripts/deny.cjs', Buffer.from('// output forbidden by reviewed server')],
    [
      'assets/figure.svg',
      Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#112233"/></svg>'),
    ],
    ['assets/figure.png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff])],
    ['output/known.png', Buffer.from([0x89, 0x50, 0xff])],
  ]);
  const policy = {
    schemaVersion: 1,
    identityFormat: 2,
    version: '1.0.0',
    rootInputs: [],
    inputRoots: ['assets/', 'scripts/', 'tests/', 'validacao/'],
    inputExtensions: ['.js', '.cjs', '.json', '.svg', '.png'],
    forcedInputs: [],
    syntheticInputs: [],
    diagnosticProducers: diagnostic
      ? [
          {
            id: 'fixture-output',
            source: 'tests/producer.js',
            sha256: hash(files.get('tests/producer.js')),
            anchor: '.screenshot(',
            paths: ['output/known.png'],
          },
        ]
      : [],
    diagnosticAudit: {
      corpusSha256: 'pending',
      scope: 'Synthetic isolated corpus',
      httpDeny: {
        source: 'scripts/deny.cjs',
        sha256: hash(files.get('scripts/deny.cjs')),
        anchor: 'forbidden',
      },
    },
  };
  if (!diagnostic) files.delete('output/known.png');
  const reads = [];
  const snapshot = (extra = {}) =>
    captureIdentity({
      paths: [...files.keys()],
      policy,
      readBytes: (file) => {
        reads.push(file);
        return files.get(file) || null;
      },
      ...extra,
    });
  policy.diagnosticAudit.corpusSha256 = snapshot().corpusFingerprint;
  return { files, policy, reads, snapshot };
}
function pair(start, end = start) {
  const item = {
    file: 'tests/case.spec.js',
    titles: ['synthetic'],
    project: '',
    repeatEachIndex: 0,
  };
  item.id = logicalId(item.file, item.titles);
  const plan = {
    schemaVersion: 2,
    valid: true,
    result: 'global',
    identityPolicy: structuredClone(start.policy),
    comparison: {
      target: { identity: structuredClone(start), sourceFingerprint: start.inputFingerprint },
    },
    manifest: { schemaVersion: 1, version: '1.1.0', fingerprint: 'a'.repeat(64) },
    identityUncoveredPaths: [],
    available: { caseCount: 1, cases: [item] },
    proposed: { caseCount: 1, cases: [item] },
  };
  const run = {
    schemaVersion: 2,
    complete: true,
    status: 'passed',
    errors: [],
    source: {
      available: true,
      identity: structuredClone(start),
      sourceFingerprint: start.inputFingerprint,
    },
    sourceAtEnd: {
      available: true,
      identity: structuredClone(end),
      sourceFingerprint: end.inputFingerprint,
    },
    sourcesChangedDuringRun: start.inputFingerprint !== end.inputFingerprint,
    manifest: plan.manifest,
    counts: {
      discovered: 1,
      expected: 1,
      executed: 1,
      attempts: 1,
      passed: 1,
      failed: 0,
      flaky: 0,
      skipped: 0,
      notExecuted: 0,
      retries: 0,
      interruptedAttempts: 0,
      timedOutAttempts: 0,
    },
    cases: [
      {
        ...item,
        outcome: 'expected',
        attempts: [{ status: 'passed', expectedStatus: 'passed', retry: 0, durationMs: 15 }],
      },
    ],
    timing: { durationMs: 25 },
  };
  return { plan, run };
}

test('SVG e PNG de entrada mudam identidade; mudança binária não usa decodificação UTF-8', () => {
  const f = fixture({ diagnostic: false });
  const start = f.snapshot();
  assert.equal(start.complete, true);
  f.files.set('assets/figure.svg', Buffer.from('<svg><rect fill="#445566"/></svg>'));
  assert.notEqual(f.snapshot().inputFingerprint, start.inputFingerprint);
  const a = Buffer.from([0xff]),
    b = Buffer.from([0xfe]);
  assert.equal(a.toString('utf8'), b.toString('utf8'));
  f.files.set('assets/figure.png', a);
  const first = f.snapshot();
  f.files.set('assets/figure.png', b);
  const second = f.snapshot();
  assert.notEqual(first.inputFingerprint, second.inputFingerprint);
  assert.notEqual(
    first.inputs.find((e) => e.path.endsWith('.png')).sha256,
    second.inputs.find((e) => e.path.endsWith('.png')).sha256
  );
});
test('captura conhecida muda só identidade dos artefatos; comparação permanece possível', () => {
  const f = fixture();
  const start = f.snapshot();
  assert.equal(start.complete, true);
  assert.equal(start.treatments.find((e) => e.path === 'output/known.png').role, 'diagnostic');
  f.files.set('output/known.png', Buffer.from([0x89, 0x50, 0xfe]));
  const end = f.snapshot();
  assert.equal(start.inputFingerprint, end.inputFingerprint);
  assert.notEqual(start.artifacts.fingerprint, end.artifacts.fingerprint);
  const p = pair(start, end);
  assert.equal(comparePlan(p.plan, p.run).comparable, true);
});
test('output/tmp desconhecidos não ganham exclusão automática nem são lidos para hash', () => {
  const f = fixture();
  f.files.set('output/arbitrary.png', Buffer.from('unknown'));
  f.files.set('tmp/arbitrary.png', Buffer.from('unknown'));
  const identity = f.snapshot();
  assert.equal(identity.complete, false);
  for (const file of ['output/arbitrary.png', 'tmp/arbitrary.png']) {
    assert.equal(identity.treatments.find((e) => e.path === file).role, 'unknown');
    assert.ok(!f.reads.includes(file));
    assert.equal(treatmentResolved(identity, file), false);
  }
  const p = pair(identity);
  assert.equal(comparePlan(p.plan, p.run).result, 'inconclusive');
});
test('consumo como entrada prevalece sobre produtor screenshot e localização', () => {
  const f = fixture();
  f.files.set('tests/consumer.js', Buffer.from('fs.readFileSync("output/known.png");'));
  const identity = f.snapshot();
  assert.equal(identity.treatments.find((e) => e.path === 'output/known.png').role, 'input');
  assert.ok(identity.inputs.some((e) => e.path === 'output/known.png'));
  assert.ok(!identity.artifacts.entries.some((e) => e.path === 'output/known.png'));
  f.policy.diagnosticProducers[0].paths = ['assets/figure.png'];
  assert.equal(f.snapshot().treatments.find((e) => e.path === 'assets/figure.png').role, 'input');
});
test('consumidor dinâmico ou alteração do produtor invalida a exclusão sem suposição por regex', () => {
  for (const mutation of [
    (f) =>
      f.files.set('tests/consumer.js', Buffer.from('fs.readFileSync(process.env.DYNAMIC_INPUT);')),
    (f) =>
      f.files.set(
        'tests/producer.js',
        Buffer.from('page.screenshot({path:"output/known.png"}); extra();')
      ),
  ]) {
    const f = fixture();
    mutation(f);
    const identity = f.snapshot();
    assert.equal(identity.complete, false);
    assert.equal(identity.treatments.find((e) => e.path === 'output/known.png').role, 'unknown');
  }
});
test('entrada alterada entre início/fim impede conclusão e projeção', () => {
  const f = fixture({ diagnostic: false }),
    start = f.snapshot();
  f.files.set('assets/figure.png', Buffer.from([1, 2, 3, 4]));
  const end = f.snapshot();
  const p = pair(start, end),
    result = comparePlan(p.plan, p.run);
  assert.equal(p.run.sourcesChangedDuringRun, true);
  assert.equal(result.result, 'inconclusive');
  assert.equal(result.costProjection.available, false);
});
test('ausência/exclusão, rename e corrida na leitura de entrada são percebidos', () => {
  const f = fixture({ diagnostic: false }),
    start = f.snapshot(),
    paths = [...f.files.keys()];
  const bytes = f.files.get('assets/figure.png');
  f.files.delete('assets/figure.png');
  const missing = f.snapshot({ paths });
  assert.equal(missing.complete, false);
  assert.notEqual(missing.inputFingerprint, start.inputFingerprint);
  assert.ok(missing.unknown.some((e) => e.path === 'assets/figure.png'));
  f.files.set('assets/renamed.png', bytes);
  const renamed = f.snapshot();
  assert.notEqual(renamed.inputFingerprint, start.inputFingerprint);
  assert.ok(renamed.inputs.some((e) => e.path === 'assets/renamed.png'));
  const raced = f.snapshot({
    readBytes: (file) => {
      if (file === 'assets/renamed.png') throw Error('Input changed during snapshot');
      return f.files.get(file) || null;
    },
  });
  assert.equal(raced.complete, false);
});
test('política/formato incompatível ou identidade ausente bloqueiam comparação', () => {
  const f = fixture(),
    identity = f.snapshot();
  for (const mutate of [
    (p) => {
      p.run.schemaVersion = 1;
    },
    (p) => {
      p.plan.schemaVersion = 1;
    },
    (p) => {
      p.run.sourceAtEnd.identity.policy.fingerprint = 'different';
    },
    (p) => {
      p.run.source.identity.schemaVersion = 999;
    },
    (p) => {
      delete p.run.source.identity;
    },
  ]) {
    const p = structuredClone(pair(identity));
    mutate(p);
    const result = comparePlan(p.plan, p.run);
    assert.equal(result.result, 'inconclusive');
    assert.equal(result.costProjection.available, false);
  }
  f.policy.version = '999.0.0';
  assert.equal(f.snapshot().complete, false);
});
test('relatório antigo conserva limitações e bytes; nenhum hash é acrescentado retrospectivamente', () => {
  const f = fixture(),
    p = pair(f.snapshot());
  p.plan.schemaVersion = 1;
  p.run.schemaVersion = 1;
  delete p.run.source.identity;
  delete p.run.sourceAtEnd.identity;
  const before = JSON.stringify(p),
    result = comparePlan(p.plan, p.run);
  assert.equal(result.result, 'inconclusive');
  assert.equal(JSON.stringify(p), before);
  assert.ok(result.reasons.some((reason) => reason.includes('Legacy/unsupported')));
  const pointer = path.join(ROOT, 'tmp/etapa2-preflight/artefatos.json');
  if (fs.existsSync(pointer)) {
    const a = JSON.parse(fs.readFileSync(pointer));
    const raw = fs.readFileSync(path.join(ROOT, a.globalRun));
    const old = JSON.parse(raw);
    assert.equal(old.schemaVersion, 1);
    assert.ok(!old.source.identity);
    assert.equal(
      comparePlan(JSON.parse(fs.readFileSync(path.join(ROOT, a.plan))), old).result,
      'inconclusive'
    );
    assert.equal(hash(fs.readFileSync(path.join(ROOT, a.globalRun))), hash(raw));
  }
});
test('documentos privados, progresso, credenciais e áudio nunca precisam de leitura', () => {
  const f = fixture();
  const privatePaths = [
    'ambiente_interativo/leituras/private.pdf',
    'assets/credentials.json',
    'assets/audio.wav',
    'assets/progresso.json',
  ];
  for (const file of privatePaths) f.files.set(file, Buffer.from('PRIVATE_DOCUMENT_DO_NOT_READ'));
  const identity = f.snapshot({
    readBytes: (file) => {
      assert.ok(!privatePaths.includes(file), file);
      return f.files.get(file) || null;
    },
  });
  for (const file of privatePaths)
    assert.equal(identity.treatments.find((e) => e.path === file).role, 'protected');
  assert.ok(!JSON.stringify(identity).includes('PRIVATE_DOCUMENT_DO_NOT_READ'));
});
test('adaptador que decodifica bytes como UTF-8 é rejeitado; fixture sintética exige bytes esperados', () => {
  const f = fixture({ diagnostic: false });
  const decoded = f.snapshot({ readBytes: (file) => f.files.get(file)?.toString('utf8') || null });
  assert.equal(decoded.complete, false);
  f.policy.syntheticInputs = [
    {
      path: 'tests/fixtures/pdfs/only-synthetic.pdf',
      expectedSha256: hash(Buffer.from('known synthetic bytes')),
    },
  ];
  f.files.set('tests/fixtures/pdfs/only-synthetic.pdf', Buffer.from('different bytes'));
  assert.ok(f.snapshot().unknown.some((e) => e.reason.includes('immutable fixture contract')));
});
test('mesma fonte de política calcula identidade Git binária e worktree sem atribuir artefatos ao Git', () => {
  const f = fixture({ diagnostic: false });
  const worktree = f.snapshot();
  const git = f.snapshot({ gitScope: true });
  assert.equal(worktree.inputFingerprint, git.inputFingerprint);
  const paths = [...f.files.keys()];
  f.files.set('assets/figure.png', Buffer.from([0xff, 0xff]));
  assert.notEqual(
    captureIdentity({
      paths,
      policy: f.policy,
      readBytes: (file) => f.files.get(file) || null,
      gitScope: true,
    }).inputFingerprint,
    git.inputFingerprint
  );
});
