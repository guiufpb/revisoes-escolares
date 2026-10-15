'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');
const { test, after } = require('node:test');
const { makePlan, impact, instanceKey } = require('../../scripts/validacao/planejador.cjs');
const { comparePlan } = require('../../scripts/validacao/planejador-comparacao.cjs');
const {
  proveDeclarative,
  proveLocalVisual,
} = require('../../scripts/validacao/planejador-provas.cjs');
const {
  parseChanges,
  collectComparison,
  reporterPath,
  gitRepository,
} = require('../../scripts/validacao/planejador-git.cjs');
const { provenance } = require('../../scripts/validacao/reporter.cjs');
const { ROOT } = require('../../scripts/validacao/manifesto.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');
const { captureIdentity, identityUsable } = require('../../scripts/validacao/identidade.cjs');
const {
  DIRECTORY,
  eventReferences,
  prepareObservation,
  finishObservation,
  evaluateObservation,
  summary,
  main: ciMain,
} = require('../../scripts/validacao/ci-observacional.cjs');

const source = 'ambiente_interativo/revisoes/alice/conteúdo com espaços.js';
const asset = 'assets/unidade/figura local.svg';
const before =
  'window.QuestionariosRevisoes.registrar({id:"alice-ciencias-fixture",titulo:"Antes",questoes:[{tipo:"campos",pergunta:"A?",respostas:["a"]}]});';
const afterSource = before.replace('Antes', 'Depois');
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#112233"/></svg>';
function fixture() {
  const ids = ['alice-ciencias-fixture', 'mariana-ciencias-fixture', 'alice-ciencias-outra'];
  const revisions = ids.map((id, i) => ({
    id,
    engine: 'questionarios',
    capabilities: [],
    configFiles: [i === 0 ? source : 'ambiente_interativo/revisoes/' + id + '.js'],
    contentSources: i < 2 ? [source] : ['outra.js'],
    assets: i < 2 ? [asset] : [],
    gaps: [],
    tests: ['tests/' + i + '.spec.js'],
    contentDependencies:
      i === 1
        ? [
            {
              revision: ids[0],
              kind: 'copied-registration',
              evidence: { path: source, anchor: 'registrar' },
            },
          ]
        : [],
  }));
  const metadata = {
    coverage: ['behavioral-contract'],
    oracle: 'independent',
    journeyScope: 'contract',
    limitations: [],
  };
  const contracts = ['cadastro', 'recuperacao', 'limpeza-sessoes', 'acessibilidade'].map((id) => ({
    id,
    representatives: [{ file: 'tests/contracts.spec.js', pattern: '^' + id + '$' }],
    limits: ['Representative is not universal.'],
  }));
  const titles = [
    ['tests/0.spec.js', 'Alice'],
    ['tests/1.spec.js', 'Mariana'],
    ['tests/2.spec.js', 'Outra'],
    ...contracts.map((c) => ['tests/contracts.spec.js', c.id]),
  ];
  const cases = titles.map(([file, title]) => ({
    id: logicalId(file, [title]),
    file,
    titles: [title],
    fullTitle: title,
    project: '',
    repeatEachIndex: 0,
  }));
  const files = [...new Set(cases.map((c) => c.file))];
  const manifest = {
    schemaVersion: 1,
    version: '1.1.0',
    revisions,
    gaps: [],
    capabilities: [],
    contracts,
    engines: [
      {
        id: 'questionarios',
        sources: ['shared.js'],
        consumers: ids,
        dependencies: [],
        contracts: contracts.map((c) => c.id),
      },
      {
        id: 'ingles',
        sources: ['ingles.js'],
        consumers: [],
        dependencies: [{ source: 'shared.js', kind: 'global-call' }],
        contracts: [],
      },
    ],
    tests: files.map((file) => ({
      file,
      revisions: ids,
      engines: ['questionarios'],
      capabilities: [],
      contracts: [],
      defaults: metadata,
      cases: [],
      expectedCases: cases.filter((c) => c.file === file).length,
    })),
    discovery: { fileCount: files.length, caseCount: cases.length },
  };
  const virtualPaths = [source, asset, 'shared.js', ...files];
  const syntheticIdentity = captureIdentity({
    paths: virtualPaths,
    readBytes: (file) =>
      virtualPaths.includes(file)
        ? Buffer.from(file === source ? before : file === asset ? svg : 'synthetic file')
        : null,
    policy: {
      schemaVersion: 1,
      identityFormat: 2,
      version: '1.0.0',
      rootInputs: virtualPaths,
      inputRoots: [],
      inputExtensions: [],
      forcedInputs: [],
      syntheticInputs: [],
      diagnosticProducers: [],
      diagnosticAudit: {
        corpusSha256: 'none',
        scope: 'isolated fixture',
        httpDeny: { source: 'absent', sha256: 'none', anchor: 'none' },
      },
    },
  });
  return {
    manifest,
    validation: { errors: [] },
    cases,
    comparison: {
      mode: 'worktree',
      base: { commit: 'a'.repeat(40) },
      target: {
        kind: 'working-tree',
        sourceFingerprint: syntheticIdentity.inputFingerprint,
        identity: syntheticIdentity,
      },
      worktree: { root: 'synthetic', source: { dirty: true } },
      identityErrors: [],
    },
    changes: [{ status: 'M', type: 'M', previousPath: source, currentPath: source }],
    read: (side, file) =>
      file.endsWith('.svg')
        ? side === 'before'
          ? svg
          : svg.replace('#112233', '#445566')
        : side === 'before'
          ? before
          : afterSource,
  };
}
const changed = (file, type = 'M', previousPath = file) => ({
  status: type,
  type,
  previousPath: type === 'A' ? null : previousPath,
  currentPath: type === 'D' ? null : file,
});
function planWith(file, mutate = () => {}) {
  const input = fixture();
  input.changes = [changed(file)];
  mutate(input);
  return makePlan(input);
}
function reportFor(plan) {
  return {
    schemaVersion: 2,
    complete: true,
    status: 'passed',
    errors: [],
    sourcesChangedDuringRun: false,
    source: {
      available: true,
      sourceFingerprint: plan.comparison.target.sourceFingerprint,
      identity: structuredClone(plan.comparison.target.identity),
    },
    sourceAtEnd: {
      available: true,
      sourceFingerprint: plan.comparison.target.sourceFingerprint,
      identity: structuredClone(plan.comparison.target.identity),
    },
    manifest: plan.manifest,
    timing: { durationMs: 100 },
    counts: {
      discovered: plan.available.caseCount,
      expected: plan.available.caseCount,
      executed: plan.available.caseCount,
      attempts: plan.available.caseCount,
      notExecuted: 0,
      skipped: 0,
      interruptedAttempts: 0,
      passed: plan.available.caseCount,
      failed: 0,
      flaky: 0,
      retries: 0,
      timedOutAttempts: 0,
    },
    cases: plan.available.cases.map((c) => ({
      ...c,
      outcome: 'expected',
      attempts: [{ status: 'passed', expectedStatus: 'passed', retry: 0, durationMs: 10 }],
    })),
  };
}

// All Git objects/index/checkout below belong exclusively to a temporary test repository.
function materializationFixture(attributes = '*.bat text eol=crlf\n*.png binary\n') {
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/git-materializacao-'));
  const input = fixture();
  const scripts = [
    'abrir_ambiente_interativo.bat',
    'abrir_chromium_ambiente_interativo.bat',
    'abrir_chromium_revisoes.bat',
  ];
  const files = new Map([
    ['.gitignore', Buffer.from('/tmp/\n')],
    ['package.json', Buffer.from('{"version":"2"}\n')],
    ...scripts.map((file) => [file, Buffer.from('@echo off\necho fixture\n')]),
    [asset, Buffer.from(svg)],
    ['assets/bytes.png', Buffer.from([0x89, 0x50, 0, 0x0a, 0xff])],
    ['assets/plain.txt', Buffer.from('plain\ntext\n')],
    ['validacao/manifesto.json', Buffer.from(JSON.stringify(input.manifest))],
  ]);
  if (attributes !== null) files.set('.gitattributes', Buffer.from(attributes));
  const identityPolicy = {
    ...JSON.parse(fs.readFileSync(path.join(ROOT, 'validacao/identidade-politica.json'))),
    forcedInputs: [],
    syntheticInputs: [],
    diagnosticProducers: [],
    diagnosticAudit: {
      corpusSha256: 'isolated-no-diagnostics',
      scope: 'synthetic fixture',
      httpDeny: { source: 'absent', sha256: 'none', anchor: 'none' },
    },
  };
  files.set('validacao/identidade-politica.json', Buffer.from(JSON.stringify(identityPolicy)));
  const git = (args, stdin) =>
    execFileSync('git', ['-C', root, ...args], {
      input: stdin,
      encoding: 'utf8',
      windowsHide: true,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'Fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
        GIT_ATTR_NOSYSTEM: '1',
      },
    }).trim();
  git(['init', '--quiet']);
  git(['config', 'core.autocrlf', 'false']);
  git(['config', 'core.attributesFile', '']);
  git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
  const tree = (entries) => {
    const groups = new Map();
    for (const [file, bytes] of entries) {
      const [name, ...rest] = file.split('/');
      if (rest.length) {
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push([rest.join('/'), bytes]);
      } else groups.set(name, bytes);
    }
    const rows = [...groups].map(([name, value]) =>
      Array.isArray(value)
        ? '040000 tree ' + tree(value) + '\t' + name
        : '100644 blob ' + git(['hash-object', '-w', '--stdin'], value) + '\t' + name
    );
    return git(['mktree'], rows.join('\n') + '\n');
  };
  const baseline = new Map(files);
  baseline.set('package.json', Buffer.from('{"version":"1"}\n'));
  const base = git(['commit-tree', tree(baseline), '-m', 'base fixture']);
  const targetTree = tree(files);
  const head = git(['commit-tree', targetTree, '-p', base, '-m', 'head fixture']);
  const integrated = git([
    'commit-tree',
    targetTree,
    '-p',
    base,
    '-p',
    head,
    '-m',
    'merge fixture',
  ]);
  git(['update-ref', 'HEAD', integrated]);
  git(['read-tree', integrated]);
  git(['checkout-index', '--all']);
  const repository = gitRepository(root);
  const inspect = () => repository.refIdentity(integrated, provenance(root));
  return { root, input, files, scripts, git, base, head, integrated, repository, inspect };
}

test('materialização: Git real aceita LF→CRLF declarado sem alterar identidades', () => {
  const f = materializationFixture();
  const source = provenance(f.root);
  const result = f.inspect();
  assert.equal(result.compatibleWithWorktree, true);
  assert.deepEqual(result.materializationErrors, []);
  assert.equal(result.materializedInputs.length, 3);
  assert.notEqual(result.inputFingerprint, result.workingScopeFingerprint);
  for (const file of f.scripts) {
    assert.match(f.git(['ls-files', '--eol', '--', file]), /i\/lf\s+w\/crlf/);
    assert.equal(result.inputs.find((e) => e.path === file).bytes, f.files.get(file).length);
    assert.equal(
      source.identity.inputs.find((e) => e.path === file).bytes,
      f.files.get(file).length + 2
    );
  }
  assert.equal(provenance(f.root).sourceFingerprint, source.sourceFingerprint);
});

for (const eventName of ['pull_request', 'push']) {
  test(
    'refs positivos: ' + eventName + ' integrado usa identidade Git real e comparação completa',
    () => {
      const f = materializationFixture();
      const env = { GITHUB_EVENT_NAME: eventName, GITHUB_SHA: f.integrated };
      const event =
        eventName === 'pull_request'
          ? { pull_request: { base: { ref: 'main', sha: f.base }, head: { sha: f.head } } }
          : { ref: 'refs/heads/main', before: f.base, after: f.integrated };
      const references = eventReferences(f.root, env, event);
      const collected = collectComparison(f.root, references, f.repository);
      assert.deepEqual(collected.comparison.identityErrors, []);
      assert.equal(collected.comparison.target.gitInputIdentity.compatibleWithWorktree, true);
      assert.equal(collected.comparison.target.gitInputIdentity.materializedInputs.length, 3);
      const plan = makePlan({ ...f.input, ...collected });
      assert.equal(plan.valid, true, JSON.stringify(plan.errors));
      assert.equal(identityUsable(plan.comparison.target.identity), true);
      const result = evaluateObservation(
        { event: eventName, references, diagnostics: [] },
        plan,
        reportFor(plan),
        'success'
      );
      assert.equal(result.comparable, true, JSON.stringify(result.diagnostics));
      assert.equal(result.executionPolicy, 'global');
      assert.equal(result.global.counts.executed, 7);
      assert.equal(result.costProjection.selectiveWallMs, null);
      assert.equal(result.identity, 'completa');
      const incomplete = structuredClone(plan);
      incomplete.comparison.target.identity.complete = false;
      assert.equal(
        evaluateObservation({ diagnostics: [] }, incomplete, reportFor(plan), 'success')
          .costProjection.available,
        false
      );
      assert.throws(() => eventReferences(f.root, { ...env, GITHUB_SHA: f.head }, event));
      assert.throws(() => eventReferences(f.root, { ...env, GITHUB_SHA: 'missing' }, event));
    }
  );
}

test('materialização: conteúdo alterado, binário e demais entradas exigem bytes exatos', () => {
  const f = materializationFixture();
  for (const [file, bytes] of [
    [f.scripts[0], Buffer.from('@echo off\r\necho changed\r\n')],
    ['assets/bytes.png', Buffer.from([0x89, 0x50, 0, 0x0d, 0x0a, 0xff])],
    ['assets/plain.txt', Buffer.from('plain\r\ntext\r\n')],
  ]) {
    const original = fs.readFileSync(path.join(f.root, file));
    fs.writeFileSync(path.join(f.root, file), bytes);
    assert.equal(f.inspect().compatibleWithWorktree, false, file);
    const collected = collectComparison(f.root, {
      mode: 'refs',
      base: f.base,
      target: f.integrated,
    });
    assert.ok(collected.comparison.identityErrors.length, file);
    assert.equal(makePlan({ ...f.input, ...collected }).valid, false);
    fs.writeFileSync(path.join(f.root, file), original);
  }
  assert.equal(f.inspect().compatibleWithWorktree, true);
});

for (const attributes of [
  null,
  '*.bat text eol=lf\n',
  '*.bat text=auto eol=crlf\n',
  '*.bat -text eol=crlf\n',
  '*.bat text eol=crlf filter=unexpected\n',
  '*.bat text eol=crlf ident\n',
  '*.bat text eol=crlf working-tree-encoding=UTF-8\n',
]) {
  test(
    'materialização: rejeita atributos ausentes/incompatíveis ' + JSON.stringify(attributes),
    () => {
      const f = materializationFixture(attributes);
      for (const file of f.scripts)
        fs.writeFileSync(path.join(f.root, file), '@echo off\r\necho fixture\r\n');
      assert.equal(f.inspect().compatibleWithWorktree, false);
    }
  );
}

test('materialização: recusa atributos locais divergentes e overrides externos', () => {
  const f = materializationFixture();
  const attributesPath = path.join(f.root, '.gitattributes');
  const original = fs.readFileSync(attributesPath);
  fs.writeFileSync(attributesPath, '*.bat text eol=lf\n');
  assert.equal(f.inspect().compatibleWithWorktree, false);
  fs.writeFileSync(attributesPath, original);
  const infoPath = path.join(f.root, '.git/info/attributes');
  fs.writeFileSync(infoPath, '*.bat text eol=crlf\n');
  assert.equal(f.inspect().compatibleWithWorktree, false);
  fs.renameSync(infoPath, infoPath + '.fixture-backup');
  const globalPath = path.join(f.root, 'tmp/global-attributes');
  fs.mkdirSync(path.dirname(globalPath), { recursive: true });
  fs.writeFileSync(globalPath, '*.bat filter=unexpected\n');
  f.git(['config', 'core.attributesFile', globalPath]);
  assert.equal(f.inspect().compatibleWithWorktree, false);
  f.git(['config', 'core.attributesFile', '']);
  assert.equal(f.inspect().compatibleWithWorktree, true);
});

test('materialização: declaração somente local não autoriza conversão', () => {
  const f = materializationFixture(null);
  fs.writeFileSync(path.join(f.root, '.gitattributes'), '*.bat text eol=crlf\n');
  for (const file of f.scripts)
    fs.writeFileSync(path.join(f.root, file), '@echo off\r\necho fixture\r\n');
  assert.equal(f.inspect().compatibleWithWorktree, false);
});

function ciFixture(plan, report = reportFor(plan)) {
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/ci-observacional-unit-'));
  const save = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), JSON.stringify(value));
  };
  // A stale report must never be mistaken for the current mandatory invocation.
  save('tmp/validacao/old/run.json', report);
  const state = prepareObservation(
    root,
    { GITHUB_EVENT_NAME: 'push' },
    {},
    {
      references: () => ({ mode: 'refs', base: 'a'.repeat(40), target: 'b'.repeat(40) }),
      fixtures: () => {},
      plan: () => plan,
    }
  );
  return { root, save, state, report };
}

test('CI: referências reais de PR usam commit integrado, push usa before/after', () => {
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/ci-git-unit-'));
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      windowsHide: true,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'Fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
      },
    }).trim();
  git('init', '--quiet');
  const tree = git('mktree');
  const base = git('commit-tree', tree, '-m', 'base sintética');
  const head = git('commit-tree', tree, '-p', base, '-m', 'head sintético');
  const integrated = git('commit-tree', tree, '-p', base, '-p', head, '-m', 'merge sintético');
  git('update-ref', 'HEAD', integrated);
  const env = { GITHUB_EVENT_NAME: 'pull_request', GITHUB_SHA: integrated };
  const event = { pull_request: { base: { ref: 'main', sha: base }, head: { sha: head } } };
  assert.deepEqual(eventReferences(root, env, event), { mode: 'refs', base, target: integrated });
  assert.notEqual(integrated, head);
  assert.deepEqual(
    eventReferences(
      root,
      { GITHUB_EVENT_NAME: 'push', GITHUB_SHA: integrated },
      { ref: 'refs/heads/main', before: base, after: integrated }
    ),
    { mode: 'refs', base, target: integrated }
  );
  assert.throws(
    () =>
      eventReferences(root, env, {
        pull_request: { ...event.pull_request, base: { ref: 'main', sha: 'f'.repeat(40) } },
      }),
    /indisponível/
  );
  assert.throws(() => eventReferences(root, { ...env, GITHUB_SHA: head }, event), /checkout/);
  assert.throws(
    () =>
      eventReferences(
        root,
        { GITHUB_EVENT_NAME: 'push', GITHUB_SHA: integrated },
        { ref: 'refs/heads/main', before: '0'.repeat(40), after: integrated }
      ),
    /SHA/
  );
  assert.throws(
    () => eventReferences(root, { GITHUB_EVENT_NAME: 'workflow_dispatch' }, {}),
    /não suportado/
  );
  fs.writeFileSync(path.join(root, '.git/shallow'), integrated + '\n');
  assert.throws(() => eventReferences(root, env, event), /Histórico raso/);
});

test('CI: preparação antecede plano; falha experimental conserva diagnóstico e permite global', () => {
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/ci-order-unit-'));
  const order = [];
  const state = prepareObservation(
    root,
    { GITHUB_EVENT_NAME: 'push' },
    {},
    {
      references: () => {
        order.push('refs');
        return {};
      },
      fixtures: () => {
        order.push('fixtures');
        throw new Error('fixture indisponível');
      },
      plan: () => {
        order.push('plan');
      },
    }
  );
  assert.deepEqual(order, ['refs', 'fixtures']);
  assert.equal(state.plan, null);
  assert.match(state.diagnostics.join(), /Preparação/);
  const unavailable = prepareObservation(
    root,
    { GITHUB_EVENT_NAME: 'push' },
    {},
    {
      references: () => {
        throw new Error('Commit indisponível');
      },
    }
  );
  assert.match(unavailable.diagnostics.join(), /Commit indisponível/);
  assert.doesNotThrow(() =>
    ciMain('planejar', root, {
      VALIDACAO_CI_OBSERVACIONAL: '1',
      GITHUB_EVENT_PATH: 'arquivo-inexistente',
    })
  );
  assert.ok(fs.existsSync(path.join(root, DIRECTORY, 'erro.json')));
});

for (const risk of ['R1', 'R2', 'global']) {
  test('CI: hipótese ' + risk + ' confronta global integral e publica índice/resumo', () => {
    const plan =
      risk === 'R1' ? makePlan(fixture()) : planWith(risk === 'R2' ? asset : 'shared.js');
    const f = ciFixture(plan);
    f.save('tmp/validacao/current/run.json', f.report);
    const result = finishObservation(f.root, { GLOBAL_OUTCOME: 'success' });
    assert.equal(result.comparable, true);
    assert.equal(result.executionPolicy, 'global');
    assert.equal(result.global.counts.executed, plan.available.caseCount);
    assert.equal(result.counts.actuallyExecuted, 7);
    assert.equal(result.counts.proposed, risk === 'global' ? 7 : 6);
    assert.equal(result.costProjection.selectiveWallMs, null);
    const index = JSON.parse(fs.readFileSync(path.join(f.root, DIRECTORY, 'indice.json')));
    assert.equal(index.run, 'tmp/validacao/current/run.json');
    assert.ok(fs.existsSync(path.join(f.root, index.comparison)));
    const markdown = fs.readFileSync(path.join(f.root, index.summary), 'utf8');
    assert.match(markdown, /realmente executados: 7/);
    assert.match(markdown, /R[1-4]/);
    assert.match(markdown, /10–15 minutos é experimental/);
    assert.match(markdown, /não estimam tempo seletivo/);
    if (risk === 'global') assert.ok(result.fallbackReasons.length);
  });
}

test('CI: A3 mantém plano válido separado da identidade incompleta e impede projeção', () => {
  const plan = makePlan(fixture());
  assert.equal(plan.valid, true);
  plan.comparison.target.identity.complete = false;
  const f = ciFixture(plan);
  f.save('tmp/validacao/current/run.json', f.report);
  const result = finishObservation(f.root, { GLOBAL_OUTCOME: 'success' });
  assert.equal(result.planValid, true);
  assert.equal(result.comparable, false);
  assert.equal(result.costProjection.available, false);
  assert.match(result.diagnostics.join(), /A3/);
  assert.match(result.identity, /incompleta/);
});

test('CI: falha global permanece visível inclusive com falha omitida no candidato', () => {
  const plan = makePlan(fixture());
  const report = reportFor(plan);
  const omitted = report.cases.find((c) => c.file === 'tests/2.spec.js');
  omitted.outcome = 'unexpected';
  omitted.attempts[0].status = 'failed';
  report.status = 'failed';
  report.counts.passed -= 1;
  report.counts.failed = 1;
  const f = ciFixture(plan, report);
  f.save('tmp/validacao/current/run.json', report);
  const result = finishObservation(f.root, { GLOBAL_OUTCOME: 'failure' });
  assert.equal(result.global.outcome, 'failure');
  assert.equal(result.comparisonResult, 'omitted-failure-observed');
  assert.equal(result.omittedFailures.length, 1);
  assert.match(summary(result), /npm test: \*\*failure\*\*/);
});

test('CI: relatório parcial, identidade divergente, zero/múltiplos relatórios são inconclusivos', () => {
  const plan = makePlan(fixture());
  for (const mutate of [
    (r) => {
      r.complete = false;
    },
    (r) => {
      r.sourceAtEnd.sourceFingerprint = 'diferente';
    },
    (r) => {
      r.cases.pop();
    },
  ]) {
    const report = reportFor(plan);
    mutate(report);
    const result = evaluateObservation({ diagnostics: [] }, plan, report, 'failure');
    assert.equal(result.comparable, false);
    assert.equal(result.costProjection.available, false);
  }
  const f = ciFixture(plan);
  assert.equal(finishObservation(f.root, { GLOBAL_OUTCOME: 'failure' }).comparable, false);
  f.save('tmp/validacao/one/run.json', f.report);
  f.save('tmp/validacao/two/run.json', f.report);
  assert.match(finishObservation(f.root, {}).diagnostics.join(), /Relatórios novos encontrados: 2/);
  assert.match(
    finishObservation(f.root, { GITHUB_RUN_ID: 'outro-job' }).diagnostics.join(),
    /não iniciado/
  );
  const empty = fs.mkdtempSync(path.join(ROOT, 'tmp/ci-empty-unit-'));
  const early = finishObservation(empty, { GLOBAL_OUTCOME: 'skipped' });
  assert.equal(early.global.outcome, 'skipped');
  assert.equal(early.global.reportStatus, null);
  assert.equal(early.costProjection.available, false);
  assert.match(early.diagnostics.join(), /não iniciado/);
});

test('CI: hook local sem opt-in é inerte e Markdown de caminhos externos é escapado', () => {
  const root = path.join(ROOT, 'tmp/ci-nao-deve-ser-criada-' + Date.now());
  ciMain('planejar', root, {});
  assert.equal(fs.existsSync(root), false);
  const result = evaluateObservation(
    { diagnostics: [], event: '<script>*externo*\n# título' },
    null,
    null,
    'failure'
  );
  assert.doesNotMatch(summary(result), /<script>/);
  assert.match(summary(result), /&lt;script&gt;/);
});

test('R1: AST, integração efetiva, dependência Alice → Mariana e recorte menor', () => {
  const input = fixture(),
    plan = makePlan(input);
  assert.equal(plan.result, 'candidate');
  assert.equal(plan.valid, true);
  assert.equal(plan.changes[0].risk, 'R1');
  assert.deepEqual(plan.changes[0].revisions, [
    'alice-ciencias-fixture',
    'mariana-ciencias-fixture',
  ]);
  assert.ok(plan.proposed.files.includes('tests/1.spec.js'));
  assert.ok(plan.proposed.caseCount < plan.available.caseCount);
  assert.ok(plan.omitted.some((c) => c.file === 'tests/2.spec.js'));
  assert.ok(plan.contracts.represented.every((c) => c.representatives.length));
  assert.ok(plan.proposed.cases.every((c) => c.associationScope === 'file-conservative-superset'));
});
test('R1 não é inferido de caminho, cadastro/import ou regex permissiva', () => {
  const revisions = fixture().manifest.revisions;
  for (const invalid of [
    afterSource + 'window.executar();',
    before.replace('titulo:"Antes"', 'titulo:executar()'),
    before.replace('tipo:"campos"', 'tipo:"opcoes"'),
    before.replace('id:"alice-ciencias-fixture"', 'id:"alice-ciencias-outra"'),
    before.replace('titulo:"Antes"', 'get titulo(){return "Depois"}'),
    before.replace('respostas:["a"]', 'respostas:["a", "b"]'),
  ]) {
    assert.equal(proveDeclarative(before, invalid, revisions), false);
    const input = fixture();
    input.read = (side) => (side === 'before' ? before : invalid);
    assert.equal(makePlan(input).result, 'global');
  }
  assert.equal(
    planWith(source, (i) => {
      i.read = () => 'import "x";';
    }).result,
    'global'
  );
});
test('R2: consumidores explícitos, SVG fechado e todos os arquivos/modos pertinentes', () => {
  const plan = planWith(asset);
  assert.equal(plan.result, 'candidate');
  assert.equal(plan.changes[0].risk, 'R2');
  assert.ok(plan.proposed.caseCount < plan.available.caseCount);
  assert.ok(
    plan.proposed.files.includes('tests/0.spec.js') &&
      plan.proposed.files.includes('tests/1.spec.js')
  );
  assert.ok(plan.contracts.represented.some((c) => c.id === 'acessibilidade'));
  assert.deepEqual(plan.identityUncoveredPaths, []);
});
test('SVG: geometria, script, CSS, entidades, links e pintura externa não passam na prova', () => {
  for (const invalid of [
    svg.replace('width="10"', 'width="20"'),
    svg.replace('/>', ' onload="x()"/>'),
    svg.replace('rect', 'script'),
    svg.replace('fill="#112233"', 'fill="url(externo.svg)"'),
    svg.replace('<rect', '<style/> <rect'),
    svg.replace('#112233', '&cor;'),
  ])
    assert.equal(proveLocalVisual(svg, invalid), false);
});
test('helper compartilhado alcança Questionários e Inglês, inclusive dependência global-call', () => {
  const plan = planWith('shared.js');
  assert.equal(plan.result, 'global');
  assert.equal(plan.changes[0].risk, 'R3');
  assert.deepEqual(plan.changes[0].engines, ['ingles', 'questionarios']);
  assert.equal(plan.proposed.caseCount, plan.available.caseCount);
});
test('áudio próprio de Leitura e fluxo próprio de Gramática ampla mantêm limites por motor', () => {
  for (const [engine, file, ownContract] of [
    ['leitura', 'leitura-audio.js', 'audio-leitura'],
    ['gramatica-legado', 'gramatica-ampla.js', 'cadastro'],
  ]) {
    const plan = planWith(file, (i) => {
      i.manifest.engines.push({
        id: engine,
        sources: [file],
        consumers: [i.manifest.revisions[0].id],
        dependencies: [],
        contracts: [ownContract],
      });
      i.manifest.revisions[0].engine = engine;
    });
    assert.equal(plan.result, 'global');
    assert.ok(plan.changes[0].engines.includes(engine));
    assert.ok(plan.changes[0].contracts.includes(ownContract));
  }
});
test('arquivo desconhecido, CSS/asset com lacuna e compartilhado/estrutural levam à global', () => {
  for (const file of [
    'novo.js',
    'ambiente_interativo/estilos.css',
    'scripts/validacao/planejador.cjs',
    'validacao/manifesto.json',
    '.github/workflows/validacao.yml',
    'playwright.config.js',
  ])
    assert.equal(planWith(file).result, 'global', file);
  const gap = planWith(asset, (i) => {
    i.manifest.revisions[0].gaps.push('assets-calculados');
  });
  assert.equal(gap.result, 'global');
  assert.ok(gap.changes[0].unresolved.length);
});
test('rename e exclusão consideram caminhos/consumidores antigos e novos; fallback explícito', () => {
  for (const change of [changed(source, 'D'), changed('novo caminho/renomeado.js', 'R', source)]) {
    const input = fixture();
    input.changes = [change];
    input.previousManifest = structuredClone(input.manifest);
    const plan = makePlan(input);
    assert.equal(plan.result, 'global');
    assert.ok(plan.changes[0].revisions.includes('alice-ciencias-fixture'));
    assert.equal(plan.changes[0].previousPath, source);
  }
});
test('manifesto inválido, inventário vazio em código e representante obrigatório não resolvido', () => {
  const bad = fixture();
  bad.validation.errors.push('schema invalid');
  assert.equal(makePlan(bad).result, 'invalid');
  assert.equal(makePlan(bad).proposed, null);
  const empty = fixture();
  empty.cases = [];
  empty.manifest.discovery.caseCount = 0;
  assert.equal(makePlan(empty).result, 'invalid');
  assert.ok(makePlan(empty).errors.some((e) => /Empty/.test(e)));
  const missing = planWith(source, (i) => {
    i.manifest.contracts[0].representatives[0].pattern = '^ausente$';
  });
  assert.equal(missing.result, 'global');
  assert.ok(missing.contracts.unresolved.length);
});
test('documentação reconhecida admite vazio por regra auditável; Markdown desconhecido é global', () => {
  const plan = planWith('documentacao/ambiente-interativo/nota.md');
  assert.equal(plan.result, 'candidate');
  assert.equal(plan.proposed.caseCount, 0);
  assert.equal(plan.changes[0].rule, 'documentation-only-allowlist');
  assert.equal(planWith('scripts/arquivo.md').result, 'global');
  assert.equal(
    planWith('documentacao/ambiente-interativo/infraestrutura/TESTES_E_VALIDACAO_REAL.md').result,
    'global'
  );
});
test('grafo real preserva helper entre motores, áudio próprio, fluxo próprio e dependência entre perfis', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'validacao/manifesto.json')));
  const helper = impact([manifest], ['ambiente_interativo/js/questionarios-interacoes.js']);
  assert.ok(helper.engines.includes('questionarios') && helper.engines.includes('ingles'));
  assert.ok(helper.dependencies.some((d) => d.kind === 'global-call'));
  const reading = impact([manifest], ['ambiente_interativo/js/leitura.js']);
  assert.ok(reading.engines.includes('leitura'));
  assert.ok(reading.dependencies.some((d) => d.kind === 'own-audio'));
  const grammar = impact(
    [manifest],
    ['ambiente_interativo/revisoes/mariana/gramatica-revisao-ampla.js']
  );
  assert.ok(grammar.engines.includes('gramatica-legado'));
  const dependent = manifest.revisions.find(
    (r) =>
      r.profile === 'mariana' &&
      r.contentDependencies.some((d) => d.revision.startsWith('alice-matematica'))
  );
  const dependency = dependent.contentDependencies.find((d) =>
    d.revision.startsWith('alice-matematica')
  );
  const alice = manifest.revisions.find((r) => r.id === dependency.revision);
  const scope = impact([manifest], alice.configFiles);
  assert.ok(scope.revisions.includes(alice.id) && scope.revisions.includes(dependent.id));
});
test('identidades lógicas não usam linhas, conservam projeto/repetição e rejeitam duplicação', () => {
  const input = fixture();
  input.cases.forEach((c) => {
    c.line = 999;
  });
  const plan = makePlan(input);
  assert.equal(
    plan.proposed.cases[0].id,
    logicalId(plan.proposed.cases[0].file, plan.proposed.cases[0].titles)
  );
  assert.ok(!JSON.stringify(plan.proposed).includes('line'));
  input.cases.push({ ...input.cases[0] });
  assert.equal(makePlan(input).result, 'invalid');
});

fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
const temp = fs.mkdtempSync(path.join(ROOT, 'tmp/planejador-git-espaços-'));
after(() => {
  assert.ok(path.resolve(temp).startsWith(path.join(ROOT, 'tmp') + path.sep));
  fs.rmSync(temp, { recursive: true });
});
test('Git NUL: caminhos com espaços/acentos, rename/exclusão e opções explícitas', () => {
  const changes = parseChanges(
    'M\0pasta/ação nova.js\0R100\0antes ç.js\0depois ç.js\0D\0apagado.js\0'
  );
  assert.equal(changes[0].currentPath, 'pasta/ação nova.js');
  assert.equal(changes[1].previousPath, 'antes ç.js');
  assert.equal(changes[1].currentPath, 'depois ç.js');
  assert.equal(changes[2].currentPath, null);
  assert.throws(() => parseChanges('R100\0incompleto\0'));
  assert.throws(() => collectComparison(temp, { mode: 'worktree', base: 'x', target: 'y' }, {}));
});
test('worktree modificada inclui índice/unstaged/untracked; refs são identidades distintas', () => {
  fs.writeFileSync(path.join(temp, 'package.json'), '{}');
  const calls = [];
  const git = (...args) => {
    calls.push(args);
    if (args[0] === 'status') return ' M package.json\0';
    if (args[0] === 'diff') return 'M\0package.json\0';
    if (args[0] === 'ls-files')
      return args.includes('--others') ? 'arquivo não rastreado.txt\0' : 'package.json\0';
    if (args[1] === '--show-toplevel') return temp;
    if (args[1] === 'HEAD^{tree}') return 'c'.repeat(40);
    if (args[1] === 'HEAD') return 'b'.repeat(40);
    throw new Error('Unexpected Git read');
  };
  const repository = {
    git,
    resolve: (ref) => (ref === 'base' ? 'a' : 'b').repeat(40),
    readRef: () => '{}',
    readWorktree: () => '{}',
    refFingerprint: () => provenance(temp, git).sourceFingerprint,
  };
  const working = collectComparison(temp, { mode: 'worktree', base: 'base' }, repository);
  assert.equal(working.comparison.target.kind, 'working-tree');
  assert.equal(working.comparison.worktree.source.dirty, true);
  assert.ok(working.changes.some((c) => c.status === 'untracked'));
  const refs = collectComparison(
    temp,
    { mode: 'refs', base: 'base', target: 'target' },
    repository
  );
  assert.equal(refs.comparison.target.commit, 'b'.repeat(40));
  assert.equal(refs.comparison.mode, 'refs');
  assert.deepEqual(refs.comparison.identityErrors, []);
  repository.refFingerprint = () => 'mismatch';
  assert.ok(
    collectComparison(temp, { mode: 'refs', base: 'base', target: 'target' }, repository).comparison
      .identityErrors.length
  );
  assert.ok(
    calls.every(
      (args) => !['checkout', 'add', 'commit', 'reset', 'clean', 'fetch'].includes(args[0])
    )
  );
  assert.equal(reporterPath('assets/figura.svg'), true);
});
test('comparação compatível projeta tentativas, sem prever tempo seletivo ou certificar recorte', () => {
  const plan = makePlan(fixture()),
    report = reportFor(plan),
    result = comparePlan(plan, report);
  assert.equal(result.comparable, true);
  assert.equal(result.identity.manifestCompatible, true);
  assert.equal(result.result, 'observed-without-omitted-failure');
  assert.ok(result.costProjection.omittedAttemptsMs > 0);
  assert.equal(result.costProjection.selectiveWallMs, null);
  assert.equal(result.costProjection.globalAttemptsMs, report.cases.length * 10);
  assert.ok(result.warnings.some((w) => w.includes('not statistical')));
});
function assertManifestInconclusive(plan, report, label) {
  const result = comparePlan(plan, report);
  assert.equal(result.comparable, false, label);
  assert.equal(result.result, 'inconclusive', label);
  assert.equal(result.identity.manifestCompatible, false, label);
  assert.ok(
    result.reasons.some((reason) => reason.startsWith('Manifest ')),
    label
  );
  assert.equal(result.costProjection.available, false, label);
  assert.equal(result.costProjection.projectedAttemptReductionFraction, undefined, label);
  assert.equal(result.costProjection.selectiveWallMs, undefined, label);
}
test('comparador rejeita manifesto/fingerprint ausente de um ou ambos os lados', () => {
  const base = makePlan(fixture());
  for (const sides of [['plan'], ['report'], ['plan', 'report']]) {
    for (const field of ['manifest', 'fingerprint']) {
      const pair = { plan: structuredClone(base), report: structuredClone(reportFor(base)) };
      for (const side of sides) {
        if (field === 'manifest') delete pair[side].manifest;
        else delete pair[side].manifest.fingerprint;
      }
      assertManifestInconclusive(pair.plan, pair.report, sides.join('/') + ': ' + field);
    }
  }
});
test('comparador rejeita descritores de manifesto nulos, vazios ou malformados', () => {
  const base = makePlan(fixture());
  const invalid = [
    null,
    {},
    [],
    '',
    1,
    { ...base.manifest, fingerprint: null },
    { ...base.manifest, fingerprint: '' },
    { ...base.manifest, fingerprint: 123 },
    { ...base.manifest, fingerprint: ['a'.repeat(64)] },
    { ...base.manifest, fingerprint: 'g'.repeat(64) },
    { ...base.manifest, fingerprint: 'A'.repeat(64) },
    { ...base.manifest, fingerprint: 'a'.repeat(64) + '\n' },
    { ...base.manifest, fingerprint: ' ' + 'a'.repeat(64) },
    { ...base.manifest, fingerprint: 'a'.repeat(63) },
    { ...base.manifest, fingerprint: 'a'.repeat(65) },
    { ...base.manifest, schemaVersion: undefined },
    { ...base.manifest, schemaVersion: '1' },
    { ...base.manifest, schemaVersion: 2 },
    { ...base.manifest, version: undefined },
    { ...base.manifest, version: '' },
    { ...base.manifest, version: 1 },
    { ...base.manifest, version: 'invalid' },
  ];
  for (const [index, descriptor] of invalid.entries()) {
    for (const sides of [['plan'], ['report'], ['plan', 'report']]) {
      const pair = { plan: structuredClone(base), report: structuredClone(reportFor(base)) };
      for (const side of sides) pair[side].manifest = structuredClone(descriptor);
      assertManifestInconclusive(pair.plan, pair.report, index + ': ' + sides.join('/'));
    }
  }
});
test('comparador rejeita fingerprints ou versões de manifesto diferentes', () => {
  const base = makePlan(fixture());
  for (const delta of [{ fingerprint: 'b'.repeat(64) }, { version: '1.2.0' }]) {
    const plan = structuredClone(base);
    const report = structuredClone(reportFor(base));
    Object.assign(report.manifest, delta);
    assertManifestInconclusive(plan, report, JSON.stringify(delta));
  }
});
test('comparação detecta falhas omitidas, inclusive tentativa flakey e status esperado', () => {
  const plan = makePlan(fixture()),
    report = reportFor(plan);
  const omitted = report.cases.find(
    (c) => !plan.proposed.cases.some((p) => instanceKey(p) === instanceKey(c))
  );
  omitted.outcome = 'flaky';
  omitted.attempts.unshift({ status: 'failed', expectedStatus: 'passed', durationMs: 5, retry: 0 });
  report.counts.attempts += 1;
  omitted.attempts[1].retry = 1;
  report.counts.retries = 1;
  report.counts.flaky = 1;
  report.counts.passed -= 1;
  const result = comparePlan(plan, report);
  assert.equal(result.result, 'omitted-failure-observed');
  assert.equal(result.omittedFailures.length, 1);
});
test('identidade divergente, relatório incompleto/direcionado, ausências/skips/interrupções são inconclusivos', () => {
  const plan = makePlan(fixture());
  for (const mutate of [
    (r) => {
      r.complete = false;
    },
    (r) => {
      r.source.sourceFingerprint = 'other';
    },
    (r) => {
      r.manifest = { fingerprint: 'other' };
    },
    (r) => {
      r.sourcesChangedDuringRun = true;
    },
    (r) => {
      r.cases.pop();
    },
    (r) => {
      r.cases[0].attempts = [];
    },
    (r) => {
      r.cases[0].outcome = 'skipped';
      r.cases[0].attempts[0].status = 'skipped';
    },
    (r) => {
      r.cases[0].attempts[0].status = 'interrupted';
    },
    (r) => {
      r.counts.executed = 0;
    },
    (r) => {
      delete r.cases[0].attempts[0].durationMs;
    },
  ]) {
    const report = reportFor(plan);
    mutate(report);
    const result = comparePlan(plan, report);
    assert.equal(result.result, 'inconclusive');
    assert.equal(result.costProjection.available, false);
  }
  const visual = planWith(asset);
  assert.equal(comparePlan(visual, reportFor(visual)).result, 'observed-without-omitted-failure');
});
test('CLI real é somente leitura: diff completo da worktree exige global e preserva fontes/Git', () => {
  const beforeIdentity = provenance(ROOT);
  const beforeStatus = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const parent = path.join(ROOT, 'tmp/validacao/planejador');
  const previous = new Set(fs.existsSync(parent) ? fs.readdirSync(parent) : []);
  const result = spawnSync(
    process.execPath,
    [
      'scripts/validacao/planejador-cli.cjs',
      'plano',
      '--mode',
      'worktree',
      '--base',
      '14584b2fee618fc900bb3d5657b9cfa16482bf33',
    ],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const folder = fs.readdirSync(parent).find((f) => !previous.has(f));
  const plan = JSON.parse(fs.readFileSync(path.join(parent, folder, 'plano.json')));
  assert.equal(plan.result, 'global');
  assert.equal(plan.proposed.caseCount, plan.available.caseCount);
  assert.ok(plan.changes.some((c) => c.currentPath === 'package.json'));
  assert.ok(plan.changes.some((c) => c.currentPath === 'scripts/validacao/manifesto.cjs'));
  assert.equal(provenance(ROOT).sourceFingerprint, beforeIdentity.sourceFingerprint);
  assert.equal(
    execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {
      cwd: ROOT,
      encoding: 'utf8',
    }),
    beforeStatus
  );
  const r1 = makePlan(fixture());
  fs.writeFileSync(
    path.join(parent, 'exemplos-' + Date.now() + '.json'),
    JSON.stringify(
      {
        fixtureOnly: true,
        r1,
        r2: planWith(asset),
        fallback: planWith('shared.js'),
        comparisonProjection: comparePlan(r1, reportFor(r1)),
      },
      null,
      2
    )
  );
});

test('comparador rejeita divergência em cada contador agregado de resultados/tentativas', () => {
  const plan = makePlan(fixture());
  for (const key of [
    'discovered',
    'expected',
    'executed',
    'attempts',
    'passed',
    'failed',
    'flaky',
    'skipped',
    'notExecuted',
    'retries',
    'interruptedAttempts',
    'timedOutAttempts',
  ]) {
    const report = reportFor(plan);
    report.counts[key] += 1;
    const result = comparePlan(plan, report);
    assert.equal(result.result, 'inconclusive', key);
    assert.equal(result.costProjection.available, false, key);
  }
});
