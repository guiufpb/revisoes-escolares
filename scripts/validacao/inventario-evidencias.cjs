'use strict';

// Pure adapter for the pinned, unversioned ORG.4D report. No collector imports.
const { validateEvidence, validTime } = require('./evidencia-organizacao.cjs');
const TYPES = ['file', 'directory', 'absent', 'other', 'link', 'indeterminate'];
const GIT = [
  'tracked',
  'ignored',
  'untracked',
  'directory-contents-unverified',
  'unverified',
  'indeterminate',
];
const ISSUES = [
  'invalid-relative-path',
  'git-administration-protected',
  'outside-root',
  'link-in-path-not-followed',
  'metadata-unavailable',
  'case-correspondence-unresolved',
  'git-query-unavailable',
];
const PROVENANCE = ['filesystem', 'git-index-or-ignore'];
const FACTS = ['resource-exists', 'resource-type', 'resource-git'];

function object(value, keys) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).every((key) => keys.includes(key))
  );
}
function text(value, max) {
  return typeof value === 'string' && value.length <= max;
}
function resourceValid(r) {
  if (
    !object(r, ['path', 'type', 'provenance', 'git', 'exists', 'bytes', 'issue']) ||
    !text(r.path, 2048) ||
    !TYPES.includes(r.type) ||
    (r.issue !== undefined && !ISSUES.includes(r.issue))
  )
    return false;
  const refused = [
    'invalid-relative-path',
    'git-administration-protected',
    'outside-root',
  ].includes(r.issue);
  if (refused)
    return (
      r.type === 'indeterminate' &&
      Object.keys(r).every((key) => ['path', 'type', 'issue'].includes(key))
    );
  if (
    !Array.isArray(r.provenance) ||
    r.provenance.length < 1 ||
    r.provenance.length > 2 ||
    r.provenance[0] !== 'filesystem' ||
    new Set(r.provenance).size !== r.provenance.length ||
    !r.provenance.every((p) => PROVENANCE.includes(p)) ||
    !GIT.includes(r.git)
  )
    return false;
  if (r.bytes !== undefined && (!Number.isSafeInteger(r.bytes) || r.bytes < 0 || r.type !== 'file'))
    return false;
  if (['file', 'directory', 'other'].includes(r.type) && r.exists !== true) return false;
  if (r.type === 'absent' && r.exists !== false) return false;
  if (['link', 'indeterminate'].includes(r.type) && r.exists !== undefined) return false;
  if (r.type === 'link') return r.issue === 'link-in-path-not-followed' && r.git === 'unverified';
  if (r.type === 'indeterminate')
    return r.issue === 'metadata-unavailable' && r.git === 'unverified';
  if (r.git === 'indeterminate')
    return ['git-query-unavailable', 'case-correspondence-unresolved'].includes(r.issue);
  if (r.issue !== undefined || !r.provenance.includes('git-index-or-ignore')) return false;
  return (
    r.git !== 'unverified' && (r.git !== 'directory-contents-unverified' || r.type === 'directory')
  );
}

function reportValid(report) {
  if (!object(report, ['status', 'exitCode', 'worktree', 'resources', 'limits', 'issue']))
    return false;
  if (report.status === 'fatal')
    return (
      report.exitCode === 1 &&
      report.issue === 'arguments-root-or-git-unavailable' &&
      Object.keys(report).every((key) => ['status', 'exitCode', 'issue'].includes(key))
    );
  if (
    !['complete', 'partial'].includes(report.status) ||
    report.exitCode !== (report.status === 'complete' ? 0 : 2) ||
    report.issue !== undefined ||
    !Array.isArray(report.resources) ||
    !report.resources.length ||
    report.resources.length > 100 ||
    !report.resources.every(resourceValid) ||
    (report.status === 'partial') !== report.resources.some((r) => r.issue !== undefined)
  )
    return false;
  const w = report.worktree;
  return (
    object(w, ['label', 'head', 'branch', 'detached', 'provenance']) &&
    text(w.label, 2048) &&
    /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(w.head) &&
    (w.branch === null || text(w.branch, 2048)) &&
    typeof w.detached === 'boolean' &&
    w.detached === (w.branch === null) &&
    w.provenance === 'git' &&
    Array.isArray(report.limits) &&
    report.limits.length <= 20 &&
    report.limits.every((v) => text(v, 500))
  );
}

function adaptInventory(report, context) {
  const result = {
    adapterVersion: 1,
    source: 'ORG.4D',
    status: 'incompatible',
    sourceStatus: null,
    sourceExitCode: null,
    diagnostics: [],
    resources: [],
    unknown: [
      'working-tree-changes',
      'stashes',
      'consumers',
      'directory-contents',
      'regenerability',
      'redundancy',
      'history-completeness',
    ],
  };
  // Inputs are plain JSON data, not proxies/getters or executable objects.
  if (!reportValid(report)) {
    result.diagnostics.push('inventory-contract-incompatible');
    return result;
  }
  result.sourceStatus = report.status;
  result.sourceExitCode = report.exitCode;
  if (report.status === 'fatal') {
    result.status = 'refused';
    result.diagnostics.push(report.issue);
    return result;
  }
  if (
    !object(context, ['observedAt', 'resourceIds']) ||
    !text(context.observedAt, 20) ||
    !validTime(context.observedAt) ||
    !Array.isArray(context.resourceIds) ||
    context.resourceIds.length !== report.resources.length ||
    !context.resourceIds.every(
      (id) => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id)
    ) ||
    new Set(context.resourceIds).size !== context.resourceIds.length
  ) {
    result.diagnostics.push('observation-context-incompatible');
    return result;
  }
  result.status = report.status;
  result.resources = report.resources.map((r, index) => {
    const metadataKnown = ['file', 'directory', 'absent', 'other'].includes(r.type);
    const gitKnown = !['unverified', 'indeterminate'].includes(r.git) && r.git !== undefined;
    const values = [
      metadataKnown ? r.exists : null,
      metadataKnown ? r.type : null,
      gitKnown ? r.git : null,
    ];
    const evidence = FACTS.map((fact, i) => ({
      evidenceVersion: 1,
      subject: { kind: 'resource', id: context.resourceIds[index] },
      source: 'resource-observation',
      fact,
      knowledge: values[i] === null ? 'unknown' : 'observed',
      value: values[i],
      observedAt: values[i] === null ? null : context.observedAt,
    }));
    // Defensive invariant; no change to the independent v1 contract.
    if (!evidence.every(validateEvidence)) throw new Error('Evidence invariant failed.');
    return {
      slot: index + 1,
      subjectId: context.resourceIds[index],
      provenance: [...(r.provenance || [])],
      inspection: {
        type: r.type,
        git: r.git === undefined ? null : r.git,
        exists: r.exists === undefined ? null : r.exists,
        bytes: r.bytes === undefined ? null : r.bytes,
      },
      diagnostics: r.issue ? [r.issue] : [],
      evidence,
    };
  });
  return result;
}

module.exports = { adaptInventory };
