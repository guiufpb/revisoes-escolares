'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fixture, loadSnapshot } = require('./adicao-fixture.cjs');
const {
  captureIdentity,
  identityUsable,
  hash,
  POLICY_FILE,
} = require('../../../scripts/validacao/identidade.cjs');
const { reviewedSurfaces, COVERAGE } = require('../../../scripts/validacao/planejador-adicao.cjs');
const {
  sourceRows,
  infrastructureBase,
  INFRASTRUCTURE,
  REVIEW_CONTRACT,
} = require('../../../scripts/validacao/planejador-composicao.cjs');
const O = require('../../../scripts/validacao/planejador-adicao-optins.cjs');
const { discover } = require('../../../scripts/validacao/manifesto.cjs');
const { makePlan } = require('../../../scripts/validacao/planejador.cjs');
const { logicalId } = require('../../../scripts/validacao/catalogo.cjs');
const ROOT = path.resolve(__dirname, '../../..');
const BUNDLE = 'ambiente_interativo/js/app.bundle.js';
const MANIFEST = 'validacao/manifesto.json';
function optinsFixture(profile = 'alice', _unused, baseFiles = null) {
  const base = baseFiles ? new Map(baseFiles) : loadSnapshot();
  if (!baseFiles) base.set(MANIFEST, fs.readFileSync(path.join(ROOT, MANIFEST), 'utf8'));
  for (const p of [
    ...O.CONSUMERS,
    O.REPRESENTATIVE,
    'scripts/validacao/planejador-adicao-optins.cjs',
  ])
    if (!base.has(p)) base.set(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
  const f = fixture(profile, undefined, base);
  const old = { id: f.id, key: f.key, file: f.file, spec: f.spec };
  const replacements = [
    [old.id, old.id.replace('-historia-', '-gramatica-')],
    [old.key, old.key.replace('.historia.', '.gramatica.')],
    [old.file, old.file.replace('/historia-', '/gramatica-')],
    [old.spec, old.spec.replace('-historia-', '-gramatica-')],
  ];
  const replace = (text) =>
    replacements
      .reduce((s, [a, b]) => s.replaceAll(a, b), text)
      .replaceAll('/historia-synthetic.js', '/gramatica-synthetic.js');
  for (const [p, text] of [...f.files]) {
    f.files.delete(p);
    f.files.set(replace(p), replace(text));
  }
  Object.assign(f, {
    id: replace(old.id),
    key: replace(old.key),
    file: replace(old.file),
    spec: replace(old.spec),
  });
  Object.assign(f.config, {
    id: f.id,
    chave: f.key,
    materia: 'Gramática',
    layout: { desktopAmplo: true },
    modoResponsavel: {
      habilitado: true,
      sessoes: [
        { id: profile, nome: f.config.nome, principal: true, chaveArmazenamento: f.key },
        {
          id: 'responsavel',
          nome: 'Responsável',
          principal: false,
          chaveArmazenamento: f.key.replace('.v1', '.responsavel.v1'),
        },
      ],
    },
  });
  const word = f.config.questoes[1];
  Object.assign(word, { ditado: true, unidadeDitado: 'palavra', cancelarAoTrocarCampo: true });
  word.itens[0].pergunta = 'Escreva a palavra que você ouviu.';
  const phrase = structuredClone(word);
  phrase.id = 'q3';
  phrase.unidadeDitado = 'frase';
  phrase.itens[0].id = 'q3-a';
  phrase.itens[0].respostas = ['A folha caiu.'];
  f.config.questoes.push(phrase);
  f.files.set(
    f.file,
    "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
      JSON.stringify(f.config) +
      ');})();'
  );
  f.files.set(
    'ambiente_interativo/js/registro-revisoes.js',
    f.files
      .get('ambiente_interativo/js/registro-revisoes.js')
      .replace('"totalEtapas":2', '"totalEtapas":3')
  );
  const html = f.files.get('ambiente_interativo/index.html');
  const card = html.slice(
    html.indexOf('<button class="cartao-materia historia" id="' + f.cardId + '"'),
    html.indexOf('</button>', html.indexOf('id="' + f.cardId + '"')) + 9
  );
  f.files.set(
    'ambiente_interativo/index.html',
    html.replace(
      card,
      card
        .replace('cartao-materia historia', 'cartao-materia gramatica')
        .replace('<small>História</small>', '<small>Gramática</small>')
    )
  );
  const m = JSON.parse(f.files.get(MANIFEST));
  Object.assign(f.manifest, m);
  const r = f.manifest.revisions.find((r) => r.id === f.id);
  Object.assign(r, {
    subject: 'gramatica',
    capabilities: O.CAPABILITIES,
    sessions: f.config.modoResponsavel.sessoes.map((s) => ({
      id: s.id,
      key: s.chaveArmazenamento,
      principal: s.principal,
    })),
  });
  for (const c of f.manifest.capabilities)
    if (O.CAPABILITIES.includes(c.id) && !c.consumers.includes(f.id)) c.consumers.push(f.id);
  const spec = f.manifest.tests.find((t) => t.file === f.spec);
  spec.capabilities = O.CAPABILITIES;
  const extra = O.COVERAGE.map((tag) => '[optins:' + tag + '] synthetic');
  f.files.set(
    f.spec,
    f.files.get(f.spec) +
      '\n' +
      extra
        .map(
          (title) =>
            'test(' + JSON.stringify(title) + ',async({page})=>{expect(page).toBeDefined();});'
        )
        .join('\n')
  );
  f.manifest.discovery.caseCount += extra.length;
  spec.expectedCases += extra.length;
  f.files.set(MANIFEST, JSON.stringify(f.manifest, null, 2) + '\n');
  f.input.changes = [...f.files]
    .filter(([p, v]) => f.before.get(p) !== v)
    .map(([p]) => ({ type: f.before.has(p) ? 'M' : 'A', previousPath: null, currentPath: p }));
  return f;
}
function maintained(profile = 'alice', baseFiles = null) {
  const f = optinsFixture(profile, undefined, baseFiles);
  const putBoth = (p, text) => {
    f.before.set(p, text);
    f.files.set(p, text);
  };
  for (const p of INFRASTRUCTURE) putBoth(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
  const policy = JSON.parse(
    baseFiles ? baseFiles.get(POLICY_FILE) : fs.readFileSync(path.join(ROOT, POLICY_FILE))
  );
  policy.forcedInputs = [];
  policy.syntheticInputs = [];
  if (!baseFiles) policy.diagnosticAudit.corpusSha256 = 'a'.repeat(64);
  const sources = [
    ...new Set(
      f.manifest.revisions
        .filter((r) => r.engine === 'questionarios')
        .flatMap((r) => r.contentSources)
    ),
  ];
  for (const p of sources)
    if (p !== f.file && !f.files.has(p)) putBoth(p, fs.readFileSync(path.join(ROOT, p), 'utf8'));
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
  data.optinsReview = {
    contract: O.CONTRACT,
    compositionContract: O.COMPOSITION,
    schemaVersion: 1,
    representatives: [
      {
        path: O.REPRESENTATIVE,
        sha256: hash(f.files.get(O.REPRESENTATIVE)),
        contractId: O.BEHAVIOR,
      },
    ],
    consumers: O.reviewConsumers(f.input.read, f.file, f.spec).map((e) => ({
      ...e,
      rationale: 'Synthetic full consumer closure reviewed for this snapshot.',
    })),
    rationale: 'Synthetic opt-ins schema, consumers and representatives reviewed.',
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
let realDeclarations;
function additionCases(f) {
  realDeclarations ||= discover(ROOT);
  return f.manifest.tests.flatMap((t) => {
    const existing = realDeclarations.filter((c) => c.file === t.file);
    const required = f.manifest.contracts
      .flatMap((c) => c.representatives)
      .filter((r) => r.file === t.file)
      .flatMap((r) =>
        existing.filter((c) => new RegExp(r.pattern, 'u').test(c.titles.join(' › ')))
      );
    const titles = [...new Set(required.map((c) => JSON.stringify(c.titles)))].map(JSON.parse);
    if (!existing.length)
      titles.push(
        ...COVERAGE.map((tag) => ['[adicao:' + tag + '] synthetic']),
        ...O.COVERAGE.map((tag) => ['[optins:' + tag + '] synthetic'])
      );
    while (titles.length < t.expectedCases) titles.push(['synthetic-' + titles.length]);
    assert.ok(titles.length <= t.expectedCases);
    return titles.map((titles) => ({
      file: t.file,
      titles,
      fullTitle: titles.join(' › '),
      project: '',
      repeatEachIndex: 0,
      id: logicalId(t.file, titles),
    }));
  });
}
function additionPlan(
  f,
  evidence = require('../../../scripts/validacao/planejador-composicao.cjs').composeAddition(
    f.input,
    f.seal(),
    f.baseInfo
  ).selectionEvidence,
  cases = additionCases(f)
) {
  return makePlan({
    ...f.input,
    manifest: f.manifest,
    previousManifest: JSON.parse(f.before.get('validacao/manifesto.json')),
    validation: { errors: [] },
    cases,
    additionEvidence: evidence,
  });
}
function explicitIntegrationBase(f) {
  f.data.reviewedSurfaces = reviewedSurfaces(f.input.read).map(
    ({ maintenance: _maintenance, ...e }) => e
  );
  f.data.integrationBaseContract = 'questionarios-base-revisada-v1';
  f.data.integrationBaseReview = reviewedSurfaces(f.input.read)
    .slice(0, 4)
    .map((e) => ({
      path: e.path,
      sha256: e.baseSha256,
      rationale:
        'Synthetic deliberate base and indirect consumers reviewed for this exact Git base.',
    }));
  f.data.consumerReview.integrationBaseConsumersReviewed = true;
}
module.exports = {
  optinsFixture,
  maintained,
  additionCases,
  additionPlan,
  explicitIntegrationBase,
};
