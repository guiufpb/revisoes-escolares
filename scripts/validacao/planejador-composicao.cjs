'use strict';

// Administrative evidence is explicit and byte-bound; it is not an identity exception
// or a cryptographic signature of human review. This module NEVER writes a pin.
const acorn = require('acorn');
const { hash, identityUsable, POLICY_FILE, safeRead } = require('./identidade.cjs');
const { proveAddition, reviewedSurfaces, staticJson } = require('./planejador-adicao.cjs');
const CONTRACT = 'adicao-atestacao-composta-v1';
const REVIEW_CONTRACT = 'manutencao-deliberada-atestacao-v1';
const BUNDLE = 'ambiente_interativo/js/app.bundle.js';
const MANIFEST = 'validacao/manifesto.json';
const INFRASTRUCTURE = [
  'scripts/validacao/planejador-adicao.cjs',
  'scripts/validacao/planejador-composicao.cjs',
  'scripts/validacao/planejador-cli.cjs',
  'scripts/validacao/ci-observacional.cjs',
  'scripts/validacao/planejador.cjs',
  'scripts/validacao/planejador-provas.cjs',
  'scripts/validacao/planejador-git.cjs',
  'scripts/validacao/identidade.cjs',
  'scripts/validacao/identidade-texto.cjs',
  'scripts/validacao/manifesto.cjs',
  'scripts/validacao/fontes.cjs',
  'scripts/validacao/catalogo.cjs',
  'scripts/validacao/reporter.cjs',
  'scripts/validacao/planejador-comparacao.cjs',
  'package.json',
  'package-lock.json',
];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sha = (s) => typeof s === 'string' && /^[a-f0-9]{64}$/.test(s);
const check = (condition, reason) => {
  if (!condition) throw Error(reason);
};
const prose = (s) => typeof s === 'string' && s.trim().length >= 30;
const sorted = (a) => [...a].sort();
function sourceRows(collected) {
  return collected.changes
    .map((c) => {
      const p = c.currentPath;
      const publicText =
        INFRASTRUCTURE.includes(p) ||
        [
          POLICY_FILE,
          MANIFEST,
          'ambiente_interativo/js/app.entry.js',
          'ambiente_interativo/js/app.js',
          'ambiente_interativo/js/registro-revisoes.js',
          'ambiente_interativo/index.html',
          'documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md',
        ].includes(p) ||
        /^ambiente_interativo\/revisoes\/(alice|mariana)\/[a-z0-9-]+\.js$/.test(p) ||
        /^tests\/[a-z0-9-]+\.spec\.js$/.test(p);
      const before = publicText ? collected.read('before', p) : null;
      const after = publicText ? collected.read('after', p) : null;
      return {
        path: p,
        type: c.type,
        beforeSha256: before === null ? null : hash(before),
        afterSha256: after === null ? null : hash(after),
        ...(!publicText ? { unread: true } : {}),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
function infrastructureBase(read) {
  const entries = INFRASTRUCTURE.map((path) => {
    const bytes = read('before', path);
    return { path, sha256: bytes === null ? null : hash(bytes) };
  });
  return {
    status: entries.every((e) => e.sha256 && e.sha256 === hash(read('after', e.path) || ''))
      ? 'represented'
      : 'not-represented',
    fingerprint: hash(JSON.stringify(entries)),
    entries,
  };
}
function loadReview(root, relative) {
  check(
    typeof relative === 'string' &&
      /^tmp\/validacao\/atestacoes\/[a-zA-Z0-9-]+\.json$/.test(relative),
    'Review must be an explicit local JSON under tmp/validacao/atestacoes'
  );
  const bytes = safeRead(root, relative);
  check(
    bytes && bytes.length <= 1024 * 1024 && Buffer.from(bytes.toString('utf8')).equals(bytes),
    'Missing/unsafe/non-UTF8 review'
  );
  return {
    path: relative,
    fingerprint: hash(bytes),
    bytes,
    data: staticJson(bytes.toString('utf8')),
  };
}
function reviewStable(root, review) {
  const bytes = safeRead(root, review.path);
  return !!bytes && hash(bytes) === review.fingerprint;
}
function scanNewTest(source) {
  const tree = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script' });
  function visit(n, parent) {
    if (!n || typeof n !== 'object') return;
    check(
      !['ImportExpression', 'MetaProperty', 'WithStatement'].includes(n.type),
      'Unreviewable test consumer'
    );
    if (
      n.type === 'Identifier' &&
      ['process', 'global', 'globalThis', 'eval', 'Function'].includes(n.name)
    )
      check(false, 'Unsafe diagnostic consumer capability');
    if (n.type === 'Literal' && typeof n.value === 'string') {
      const value = n.value;
      const publicRoute =
        /^\/(?:ambiente_interativo\/(?:index|leitor)\.html|__revisoes_local__\/identity)(?:[?#].*)?$/.test(
          value
        );
      check(
        !/(?:^|[\\/])(?:output|\.codex|\.git|credentials|progresso)(?:[\\/]|$)/i.test(value) &&
          !/^(?:[a-z]:[\\/]|\\\\|(?:https?|file):)/i.test(value) &&
          !(value.startsWith('/') && !publicRoute) &&
          !/\.(?:pdf|docx?|xlsx?|pptx?|pem|key|wav|mp3|ogg|m4a|webm)(?:$|[?#])/i.test(value) &&
          !/(?:^|[\\/])\.env(?:\.|$)/i.test(value),
        'Diagnostic/private reference in new test'
      );
    }
    if (n.type === 'CallExpression' && n.callee?.name === 'require')
      check(
        parent?.type === 'VariableDeclarator' && n.arguments[0]?.value === '@playwright/test',
        'Dynamic/nested test dependency'
      );
    if (n.type === 'MemberExpression')
      check(
        !['constructor', 'prototype', '__proto__'].includes(n.property?.name || n.property?.value),
        'Unsafe reflective consumer'
      );
    for (const value of Object.values(n)) {
      if (Array.isArray(value)) value.forEach((v) => visit(v, n));
      else if (value && typeof value === 'object') visit(value, n);
    }
  }
  visit(tree, null);
}
function policyDelta(collected) {
  const changes = collected.changes.filter(
    (c) => c.currentPath === POLICY_FILE || c.previousPath === POLICY_FILE
  );
  check(
    changes.length === 1 &&
      changes[0].type === 'M' &&
      (!changes[0].previousPath || changes[0].previousPath === POLICY_FILE),
    'Policy change must be a single modification'
  );
  const before = staticJson(collected.read('before', POLICY_FILE));
  const after = staticJson(collected.read('after', POLICY_FILE));
  check(
    before.version === '1.1.0' &&
      after.version === '1.1.0' &&
      before.schemaVersion === 1 &&
      after.schemaVersion === 1 &&
      before.identityFormat === 2 &&
      after.identityFormat === 2,
    'Policy/identity format changed'
  );
  check(
    sha(before.diagnosticAudit?.corpusSha256) &&
      sha(after.diagnosticAudit?.corpusSha256) &&
      before.diagnosticAudit.corpusSha256 !== after.diagnosticAudit.corpusSha256,
    'Corpus pin was not deliberately changed'
  );
  const stripped = structuredClone(after);
  stripped.diagnosticAudit.corpusSha256 = before.diagnosticAudit.corpusSha256;
  check(
    same(stripped, before),
    'Arbitrary policy change; only corpusSha256 maintenance is permitted'
  );
  check(
    after.diagnosticAudit.representation === 'questionarios-dica-literal-v1' &&
      after.diagnosticProducers.flatMap((p) => p.paths).length === 29,
    'Diagnostic/textual contract changed'
  );
  return { before, after };
}
function composeAddition(collected, review = null, baseInfo = null) {
  const policyChanged = collected.changes.some(
    (c) => c.currentPath === POLICY_FILE || c.previousPath === POLICY_FILE
  );
  const result = {
    schemaVersion: 1,
    contract: CONTRACT,
    status: 'not-requested',
    executionPolicy: 'global',
    runtimeEvidence: 'not-collected',
    maintenance: { contract: REVIEW_CONTRACT, status: 'not-requested', reasons: [] },
    compatibility: { status: 'not-established', reasons: [] },
    effectiveIdentity: 'blocked',
    base: infrastructureBase(collected.read),
    reviewedSurfaces: reviewedSurfaces(collected.read),
    review: review
      ? {
          path: review.path,
          fingerprint: review.fingerprint,
          authority: 'explicit-review-record; not a signature or user authorization',
        }
      : null,
    fullChanges: sourceRows(collected),
  };
  let addition;
  const policyRows = collected.changes.filter(
    (c) => c.currentPath === POLICY_FILE || c.previousPath === POLICY_FILE
  );
  // A historical infrastructure comparison may predate identity itself. It is
  // never maintenance evidence, and may only follow the existing R4/global path.
  const historicalIntroduction =
    !review &&
    policyRows.length === 1 &&
    policyRows[0].type === 'A' &&
    !policyRows[0].previousPath &&
    collected.read('before', POLICY_FILE) === null &&
    !collected.changes.some(
      (c) => c.type === 'A' && /^ambiente_interativo\/revisoes\/.*\.js$/.test(c.currentPath)
    );
  if (historicalIntroduction) {
    addition = proveAddition(collected);
    result.maintenance.status = 'not-applicable';
    result.maintenance.reasons.push(
      'Policy absent from historical base; no maintenance proof, existing R4/global required'
    );
    return { addition, composition: result, blockObservation: false };
  }
  if (!policyChanged && !review) {
    addition = proveAddition(collected);
    result.effectiveIdentity = addition.identityStatus;
    return {
      addition,
      composition: result,
      blockObservation: addition.structuralStatus === 'rejected',
    };
  }
  // Policy syntax is verified BEFORE isolating its delta; the full diff remains recorded.
  try {
    const { before, after } = policyDelta(collected);
    addition = proveAddition({
      ...collected,
      changes: collected.changes.filter((c) => c.currentPath !== POLICY_FILE),
    });
    check(
      addition.structuralStatus === 'proven' ||
        (addition.structuralStatus === 'unsupported' && collected.changes.length === 1),
      'Addition incomplete/rejected or unrelated batch'
    );
    check(
      review &&
        /^tmp\/validacao\/atestacoes\/[a-zA-Z0-9-]+\.json$/.test(review.path) &&
        Buffer.isBuffer(review.bytes) &&
        sha(review.fingerprint) &&
        hash(review.bytes) === review.fingerprint &&
        same(staticJson(review.bytes.toString('utf8')), review.data),
      'Review bytes descriptor required'
    );
    // The loader validates exact bytes; the semantic record is bound independently here.
    const r = review.data;
    check(
      r.schemaVersion === 1 &&
        r.contract === REVIEW_CONTRACT &&
        r.decision === 'reviewed-no-new-diagnostic-consumers' &&
        prose(r.reviewer) &&
        typeof r.reviewedAt === 'string' &&
        Number.isFinite(Date.parse(r.reviewedAt)),
      'Missing explicit deliberate review'
    );
    check(
      result.base.status === 'represented',
      'Git base does not contain the implemented unchanged infrastructure'
    );
    check(
      baseInfo?.kind === 'git-commit' &&
        /^[a-f0-9]{40}$/.test(baseInfo.commit || '') &&
        /^[a-f0-9]{40}$/.test(baseInfo.tree || '') &&
        baseInfo.commit === collected.comparison.base.commit &&
        same(r.base, {
          commit: baseInfo.commit,
          tree: baseInfo.tree,
          policyFingerprint: hash(JSON.stringify(before)),
          infrastructureFingerprint: result.base.fingerprint,
        }),
      'Base/reference provenance differs'
    );
    const identity =
      collected.comparison.target.identity || collected.comparison.worktree?.source?.identity;
    const source = collected.comparison.worktree?.source;
    check(
      identityUsable(identity) &&
        source?.available === true &&
        same(source.identity, identity) &&
        source.sourceFingerprint === identity.inputFingerprint &&
        identity.inputFingerprint === collected.comparison.target.sourceFingerprint &&
        !collected.comparison.identityErrors?.length,
      'Effective target identity/provenance incompatible'
    );
    check(
      /^[a-f0-9]{40}$/.test(source.commit || '') &&
        /^[a-f0-9]{40}$/.test(source.tree || '') &&
        /^[a-f0-9]{64}$/.test(source.statusFingerprint || '') &&
        typeof source.dirty === 'boolean' &&
        source.contentIdentity ===
          (source.dirty ? 'working-tree-not-identical-to-commit' : 'clean-tracked-tree') &&
        (collected.comparison.target.kind === 'working-tree' ||
          (collected.comparison.target.kind === 'git-ref' &&
            collected.comparison.target.commit === source.commit)),
      'Target Git provenance incomplete'
    );
    check(
      identity.corpusFingerprint === after.diagnosticAudit.corpusSha256 &&
        identity.policy.version === '1.1.0' &&
        identity.policy.fingerprint === hash(JSON.stringify(after)),
      'Corpus/policy fingerprint mismatch'
    );
    check(
      same(r.target, {
        commit: source.commit,
        tree: source.tree,
        inputFingerprint: identity.inputFingerprint,
        corpusFingerprint: identity.corpusFingerprint,
        policyFingerprint: identity.policy.fingerprint,
        manifestFingerprint: hash(JSON.stringify(staticJson(collected.read('after', MANIFEST)))),
      }),
      'Reviewed target snapshot differs'
    );
    check(
      same(
        r.changes?.map(({ rationale: _rationale, ...entry }) => entry),
        result.fullChanges
      ) && r.changes.every((e) => prose(e.rationale)),
      'Every changed path needs hash-bound consumer rationale'
    );
    for (const p of after.diagnosticProducers) {
      const bytes = collected.read('after', p.source);
      check(
        bytes !== null &&
          bytes === collected.read('before', p.source) &&
          hash(bytes) === p.sha256 &&
          bytes.includes(p.anchor),
        'Producer changed/unjustified'
      );
    }
    const deny = after.diagnosticAudit.httpDeny,
      denyBytes = collected.read('after', deny.source);
    check(
      denyBytes !== null &&
        denyBytes === collected.read('before', deny.source) &&
        hash(denyBytes) === deny.sha256 &&
        denyBytes.includes(deny.anchor),
      'HTTP deny changed/unjustified'
    );
    check(
      same(r.producers, after.diagnosticProducers) && same(r.httpDeny, deny),
      'Protected evidence differs from review'
    );
    const expectedPaths = sorted(after.diagnosticProducers.flatMap((p) => p.paths));
    check(
      same(r.diagnostics, {
        paths: expectedPaths,
        artifactsFingerprint: identity.artifacts.fingerprint,
      }) && same(sorted(identity.artifacts.entries.map((e) => e.path)), expectedPaths),
      'Captures/snapshot not bound'
    );
    check(
      same(
        r.reviewedSurfaces,
        result.reviewedSurfaces.map(({ maintenance: _maintenance, ...entry }) => entry)
      ) && result.reviewedSurfaces.every((e) => e.baseSha256 === e.expectedSha256),
      'REVIEWED baseline obsolete or not reviewed'
    );
    check(
      r.consumerReview?.noNewDiagnosticConsumers === true &&
        prose(r.consumerReview.analysis) &&
        r.consumerReview.newTestBodyReviewed === true &&
        r.consumerReview.bundleOfficialBuildReviewed === true &&
        r.consumerReview.bundleSha256 === identity.inputs.find((e) => e.path === BUNDLE)?.sha256,
      'Consumer/bundle review incomplete'
    );
    for (const entry of result.fullChanges) {
      const current = collected.read('after', entry.path);
      check(
        identity.inputs.some((e) => e.path === entry.path && e.sha256 === entry.afterSha256),
        'Changed bytes not bound to identity'
      );
      if (entry.type === 'A' && /^tests\/.*\.spec\.js$/.test(entry.path)) scanNewTest(current);
    }
    if (addition.structuralStatus === 'proven')
      check(addition.identityStatus === 'usable', 'Addition and maintenance identities differ');
    result.status = 'compatible';
    result.maintenance.status = 'verified-evidence';
    result.compatibility.status = 'same-target';
    result.effectiveIdentity = 'usable';
    result.maintenance.policyDelta = {
      field: 'diagnosticAudit.corpusSha256',
      before: before.diagnosticAudit.corpusSha256,
      after: after.diagnosticAudit.corpusSha256,
    };
  } catch (error) {
    addition ||= proveAddition(collected);
    result.status = 'rejected';
    result.maintenance.status = 'rejected';
    result.maintenance.reasons.push(error.message);
    result.compatibility.reasons.push('No partial acceptance; observation blocked');
  }
  return { addition, composition: result, blockObservation: result.status === 'rejected' };
}
module.exports = {
  CONTRACT,
  REVIEW_CONTRACT,
  INFRASTRUCTURE,
  sourceRows,
  infrastructureBase,
  composeAddition,
  loadReview,
  reviewStable,
};
