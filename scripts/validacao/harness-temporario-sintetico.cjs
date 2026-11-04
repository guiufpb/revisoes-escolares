'use strict';

// A closed in-memory scenario, never a producer of files in a user's filesystem.
const { createHash } = require('node:crypto');
const CLASS_ID = 'synthetic-counter-v1';
const PRODUCER_ID = 'org6b-owned-harness-v1';
const SCENARIO_ID = 'closed-counter-harness-v1';

function identity(runId) {
  if (typeof runId !== 'string' || !/^[a-z0-9-]{1,32}$/.test(runId))
    throw new Error('Invalid synthetic run identifier.');
  return { runId, scopeId: 'scope-' + runId, resourceId: 'counter-' + runId };
}
function generateCounter(runId) {
  identity(runId);
  return 'ORG.6B synthetic counter\nrun=' + runId + '\n0,1,2,3\n';
}
function digest(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
function runHarness(runId) {
  const ids = identity(runId);
  const lifecycle = [];
  const activeConsumers = new Set();
  const record = (actor, step) => lifecycle.push({ actor, step, resourceId: ids.resourceId });
  const content = generateCounter(runId);
  record('producer', 'produce');
  activeConsumers.add('verifier');
  record('verifier', 'acquire');
  const sha256 = digest(content);
  // Independent invocations, with no reuse of the original content as a cache.
  const attempts = [digest(generateCounter(runId)), digest(generateCounter(runId))];
  activeConsumers.delete('verifier');
  record('verifier', 'release');
  if (activeConsumers.size) throw new Error('Synthetic consumers still active.');
  record('producer', 'finish');
  return {
    harnessVersion: 1,
    scenarioId: SCENARIO_ID,
    classId: CLASS_ID,
    producerId: PRODUCER_ID,
    ...ids,
    purpose: 'test-only-ephemeral',
    artifact: { content, sha256 },
    regeneration: { recipeId: 'counter-sequence-v1', attempts },
    // The verifier is the only consumer in this fixed scenario; references must
    // be released before the producer declares the scope finished.
    lifecycle,
  };
}
module.exports = {
  CLASS_ID,
  PRODUCER_ID,
  SCENARIO_ID,
  identity,
  generateCounter,
  digest,
  runHarness,
};
