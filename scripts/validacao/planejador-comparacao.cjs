'use strict';

const { instanceKey } = require('./planejador.cjs');
const { logicalId } = require('./catalogo.cjs');
const { identityUsable } = require('./identidade.cjs');

function comparePlan(plan, run) {
  const reasons = [],
    warnings = [
      'Observational comparison only; execution policy remains global.',
      'A green global is not statistical evidence that a cut is safe.',
      'Attempt durations are a projection, not predicted elapsed selective-run duration; setup/teardown and concurrency may differ.',
    ];
  if (!plan.valid || !plan.proposed || !plan.available) reasons.push('Plan is invalid');
  if (run.schemaVersion !== 2 || plan.schemaVersion !== 2)
    reasons.push(
      'Legacy/unsupported plan or report format: input/assets/output identity was not captured; cannot retrofit historical evidence'
    );
  const planIdentity =
    plan.comparison?.target?.identity || plan.comparison?.worktree?.source?.identity;
  const identities = [planIdentity, run.source?.identity, run.sourceAtEnd?.identity];
  if (identities.some((identity) => !identityUsable(identity)))
    reasons.push('Input identity incomplete, unknown or missing; policy 2.1 evidence required');
  if (
    planIdentity?.inputFingerprint !== plan.comparison?.target?.sourceFingerprint ||
    run.source?.identity?.inputFingerprint !== run.source?.sourceFingerprint ||
    run.sourceAtEnd?.identity?.inputFingerprint !== run.sourceAtEnd?.sourceFingerprint
  )
    reasons.push('Input identity digest inconsistent with source identity alias');
  const policies = [plan.identityPolicy, ...identities.map((identity) => identity?.policy)];
  if (
    policies.some(
      (p) =>
        !p?.fingerprint ||
        p.schemaVersion !== 1 ||
        p.version !== policies[0]?.version ||
        p.fingerprint !== policies[0]?.fingerprint
    )
  )
    reasons.push('Identity policy incompatible or unavailable');
  if (!run.complete) reasons.push('Report incomplete');
  if (!['passed', 'failed'].includes(run.status)) reasons.push('Global did not finish normally');
  if (
    !run.source?.available ||
    !run.sourceAtEnd?.available ||
    run.sourcesChangedDuringRun !== false
  )
    reasons.push('Stable report content identity unavailable');
  if (
    !plan.comparison?.target?.sourceFingerprint ||
    plan.comparison.target.sourceFingerprint !== run.source?.sourceFingerprint
  )
    reasons.push('Source content identity differs or is unavailable');
  if (run.source?.sourceFingerprint !== run.sourceAtEnd?.sourceFingerprint)
    reasons.push('Report start/end identity differs');
  const manifestDescriptorsValid = [plan.manifest, run.manifest].every(
    (descriptor) =>
      descriptor !== null &&
      typeof descriptor === 'object' &&
      !Array.isArray(descriptor) &&
      descriptor.schemaVersion === 1 &&
      typeof descriptor.version === 'string' &&
      /^\d+\.\d+\.\d+$/.test(descriptor.version) &&
      typeof descriptor.fingerprint === 'string' &&
      descriptor.fingerprint.length === 64 &&
      /^[a-f0-9]{64}$/.test(descriptor.fingerprint)
  );
  const manifestCompatible =
    manifestDescriptorsValid &&
    plan.manifest.version === run.manifest.version &&
    plan.manifest.fingerprint === run.manifest.fingerprint;
  if (!manifestDescriptorsValid)
    reasons.push(
      'Manifest descriptor missing or invalid: schemaVersion 1, numeric version and SHA-256 fingerprint required in plan and report'
    );
  else if (!manifestCompatible) reasons.push('Manifest identity differs');
  if (plan.identityUncoveredPaths?.length)
    reasons.push(
      'Changed paths without demonstrated input/output treatment: ' +
        plan.identityUncoveredPaths.join(', ')
    );
  if (run.errors?.length) reasons.push('Report contains runner/association errors');
  const cases = run.cases || [],
    records = new Map();
  for (const item of cases) {
    if (item.id !== logicalId(item.file, item.titles))
      reasons.push('Report logical identity is invalid');
    const key = instanceKey(item);
    if (records.has(key)) reasons.push('Duplicate report instance');
    records.set(key, item);
  }
  const available = plan.available?.cases || [],
    proposed = plan.proposed?.cases || [];
  const availableKeys = new Set(available.map(instanceKey));
  if (
    proposed.some((c) => !availableKeys.has(instanceKey(c))) ||
    new Set(proposed.map(instanceKey)).size !== proposed.length
  )
    reasons.push('Proposed inventory is not a unique subset of available cases');
  if (
    available.length !== cases.length ||
    available.some((c) => !records.has(instanceKey(c))) ||
    run.counts?.discovered !== available.length ||
    run.counts?.expected !== available.length
  )
    reasons.push(
      'Report is not the complete current inventory; directed runs cannot validate this comparison'
    );
  const missingProposed = proposed.filter((c) => !records.has(instanceKey(c))).map(instanceKey);
  if (missingProposed.length) reasons.push('Proposed cases missing from execution');
  const proposedKeys = new Set(proposed.map(instanceKey));
  const omitted = cases.filter((c) => !proposedKeys.has(instanceKey(c)));
  const omittedFailures = omitted
    .filter(
      (c) =>
        c.outcome === 'unexpected' ||
        c.outcome === 'flaky' ||
        c.attempts?.some((a) => ['failed', 'timedOut', 'interrupted'].includes(a.status))
    )
    .map((c) => ({
      id: c.id,
      file: c.file,
      project: c.project,
      repeatEachIndex: c.repeatEachIndex,
      outcome: c.outcome,
      failedAttemptStatuses: (c.attempts || [])
        .filter((a) => a.status !== 'passed')
        .map((a) => ({ status: a.status, expectedStatus: a.expectedStatus })),
    }));
  const incompleteCases = cases
    .filter(
      (c) =>
        !c.attempts?.length ||
        c.outcome === 'skipped' ||
        c.outcome === 'not-executed' ||
        c.attempts.some((a) => ['skipped', 'interrupted'].includes(a.status))
    )
    .map((c) => ({
      id: c.id,
      file: c.file,
      proposed: proposedKeys.has(instanceKey(c)),
      outcome: c.outcome,
    }));
  if (
    incompleteCases.length ||
    run.counts?.notExecuted ||
    run.counts?.skipped ||
    run.counts?.interruptedAttempts
  )
    reasons.push('Cases not executed, skipped or interrupted prevent a conclusion');
  const attempts = cases.flatMap((c) => c.attempts || []);
  const executed = cases.filter((c) => c.attempts?.some((a) => a.status !== 'skipped')).length;
  if (run.counts?.executed !== executed || run.counts?.attempts !== attempts.length)
    reasons.push('Execution counts inconsistent with recorded cases/attempts');
  const derivedCounts = {
    passed: cases.filter((c) => c.outcome === 'expected').length,
    failed: cases.filter((c) => c.outcome === 'unexpected').length,
    flaky: cases.filter((c) => c.outcome === 'flaky').length,
    skipped: cases.filter((c) => c.outcome === 'skipped').length,
    notExecuted: cases.filter((c) => !c.attempts?.length).length,
    retries: attempts.filter((a) => a.retry > 0).length,
    interruptedAttempts: attempts.filter((a) => a.status === 'interrupted').length,
    timedOutAttempts: attempts.filter((a) => a.status === 'timedOut').length,
  };
  for (const [name, count] of Object.entries(derivedCounts))
    if (run.counts?.[name] !== count) reasons.push('Aggregate count differs from records: ' + name);
  if (
    cases.some(
      (c) => !['expected', 'unexpected', 'flaky', 'skipped', 'not-executed'].includes(c.outcome)
    ) ||
    attempts.some(
      (a) =>
        !['passed', 'failed', 'timedOut', 'skipped', 'interrupted'].includes(a.status) ||
        !Number.isInteger(a.retry) ||
        a.retry < 0
    )
  )
    reasons.push('Unknown outcome/status or invalid retry metadata');
  if (attempts.some((a) => !Number.isFinite(a.durationMs) || a.durationMs < 0))
    reasons.push('Recorded attempt durations missing or invalid');
  const comparable = reasons.length === 0;
  const sum = (items) =>
    items.reduce(
      (total, item) =>
        total +
        (item.attempts || []).reduce(
          (n, a) => n + (Number.isFinite(a.durationMs) ? a.durationMs : 0),
          0
        ),
      0
    );
  const allCost = sum(cases),
    selectedCost = sum(cases.filter((c) => proposedKeys.has(instanceKey(c))));
  return {
    schemaVersion: 2,
    identityPolicy: plan.identityPolicy || null,
    observational: true,
    comparable,
    result: comparable
      ? omittedFailures.length
        ? 'omitted-failure-observed'
        : 'observed-without-omitted-failure'
      : 'inconclusive',
    reasons: [...new Set(reasons)],
    planResult: plan.result,
    runStatus: run.status,
    identity: {
      sourcesCompatible:
        !!plan.comparison?.target?.sourceFingerprint &&
        plan.comparison.target.sourceFingerprint === run.source?.sourceFingerprint,
      manifestCompatible,
      stableDuringRun: run.sourcesChangedDuringRun === false,
      uncoveredChangedPaths: plan.identityUncoveredPaths || [],
    },
    missingProposed,
    omittedFailures,
    incompleteCases,
    counts: {
      available: available.length,
      proposed: proposed.length,
      globalReported: cases.length,
      omitted: omitted.length,
    },
    costProjection: comparable
      ? {
          available: true,
          units: 'sum of observed attempt milliseconds',
          globalAttemptsMs: allCost,
          proposedAttemptsMs: selectedCost,
          omittedAttemptsMs: allCost - selectedCost,
          projectedAttemptReductionFraction: allCost ? (allCost - selectedCost) / allCost : null,
          observedGlobalWallMs: run.timing?.durationMs ?? null,
          selectiveWallMs: null,
        }
      : {
          available: false,
          reason:
            'Identity/completeness prerequisites not established; no defensible cost projection',
        },
    warnings,
  };
}
module.exports = { comparePlan };
