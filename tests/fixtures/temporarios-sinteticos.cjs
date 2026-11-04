'use strict';
const {
  runHarness,
  SCENARIO_ID,
} = require('../../scripts/validacao/harness-temporario-sintetico.cjs');
const { adaptInventory } = require('../../scripts/validacao/inventario-evidencias.cjs');
const TIME = '2026-11-03T12:00:00Z';
function scenario(runId = 'case-one', git = 'ignored') {
  const proof = runHarness(runId);
  const report = {
    status: 'complete',
    exitCode: 0,
    worktree: {
      label: 'synthetic-only',
      head: 'a'.repeat(40),
      branch: 'fixture',
      detached: false,
      provenance: 'git',
    },
    resources: [
      {
        path: 'arbitrary-name.bin',
        type: 'file',
        git,
        exists: true,
        bytes: Buffer.byteLength(proof.artifact.content, 'utf8'),
        provenance: ['filesystem', 'git-index-or-ignore'],
      },
    ],
    limits: ['Synthetic report without filesystem access'],
  };
  return {
    context: { scenarioId: SCENARIO_ID, runId, observedAt: TIME },
    input: {
      proof,
      inspection: adaptInventory(report, { observedAt: TIME, resourceIds: [proof.resourceId] }),
    },
  };
}
function observe(input, fact, value) {
  const row = input.inspection.resources[0];
  row.evidence.find((e) => e.fact === fact).value = value;
  row.inspection[
    { 'resource-exists': 'exists', 'resource-type': 'type', 'resource-git': 'git' }[fact]
  ] = value;
}
const corpus = [
  {
    name: 'inconsistent resource slot',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].slot = 2;
    },
  },
  {
    name: 'producer unknown',
    status: 'blocked',
    code: 'producer-unknown',
    change: (i) => {
      i.proof.producerId = 'unknown-producer';
    },
  },
  {
    name: 'different class',
    status: 'not-recognized',
    code: 'outside-class',
    change: (i) => {
      i.proof.classId = 'another-class';
    },
  },
  {
    name: 'permanent purpose',
    status: 'not-recognized',
    code: 'outside-class',
    change: (i) => {
      i.proof.purpose = 'permanent';
    },
  },
  ...['runId', 'scopeId', 'resourceId', 'scenarioId'].map((field) => ({
    name: field + ' mismatch',
    status: 'blocked',
    code: 'identity-mismatch',
    change: (i) => {
      i.proof[field] = 'different';
    },
  })),
  {
    name: 'unknown harness version',
    status: 'blocked',
    code: 'evidence-incompatible',
    change: (i) => {
      i.proof.harnessVersion = 2;
    },
  },
  {
    name: 'unsupported permission field',
    status: 'blocked',
    code: 'evidence-incompatible',
    change: (i) => {
      i.proof.canDelete = true;
    },
  },
  {
    name: 'content modified',
    status: 'blocked',
    code: 'artifact-integrity-mismatch',
    change: (i) => {
      i.proof.artifact.content += 'private';
    },
  },
  {
    name: 'digest conflict',
    status: 'blocked',
    code: 'artifact-integrity-mismatch',
    change: (i) => {
      i.proof.artifact.sha256 = 'f'.repeat(64);
    },
  },
  {
    name: 'regeneration differs',
    status: 'blocked',
    code: 'regeneration-not-demonstrated',
    change: (i) => {
      i.proof.regeneration.attempts[1] = 'f'.repeat(64);
    },
  },
  {
    name: 'only one regeneration',
    status: 'blocked',
    code: 'regeneration-not-demonstrated',
    change: (i) => {
      i.proof.regeneration.attempts.pop();
    },
  },
  {
    name: 'unknown recipe',
    status: 'blocked',
    code: 'regeneration-not-demonstrated',
    change: (i) => {
      i.proof.regeneration.recipeId = 'unknown';
    },
  },
  {
    name: 'consumer still active',
    status: 'blocked',
    code: 'dependency-unresolved',
    change: (i) => {
      i.proof.lifecycle.splice(2, 1);
    },
  },
  {
    name: 'stopped with active consumer',
    status: 'blocked',
    code: 'dependency-unresolved',
    change: (i) => {
      i.proof.lifecycle.length = 2;
    },
  },
  {
    name: 'unknown consumer',
    status: 'blocked',
    code: 'lifecycle-incompatible',
    change: (i) => {
      i.proof.lifecycle[1].actor = 'external';
    },
  },
  {
    name: 'event references another resource',
    status: 'blocked',
    code: 'lifecycle-incompatible',
    change: (i) => {
      i.proof.lifecycle[2].resourceId = 'different';
    },
  },
  {
    name: 'duplicate release',
    status: 'blocked',
    code: 'lifecycle-incompatible',
    change: (i) => {
      i.proof.lifecycle.push(i.proof.lifecycle[2]);
    },
  },
  {
    name: 'scope not finished',
    status: 'indeterminate',
    code: 'lifecycle-incomplete',
    change: (i) => {
      i.proof.lifecycle.pop();
    },
  },
  {
    name: 'no events yet',
    status: 'indeterminate',
    code: 'lifecycle-incomplete',
    change: (i) => {
      i.proof.lifecycle = [];
    },
  },
  {
    name: 'partial inspection',
    status: 'blocked',
    code: 'inspection-blocked',
    change: (i) => {
      i.inspection.status = i.inspection.sourceStatus = 'partial';
      i.inspection.sourceExitCode = 2;
    },
  },
  {
    name: 'refused inspection',
    status: 'blocked',
    code: 'inspection-blocked',
    change: (i) => {
      i.inspection.status = 'refused';
      i.inspection.sourceStatus = 'fatal';
      i.inspection.sourceExitCode = 1;
      i.inspection.resources = [];
    },
  },
  {
    name: 'future adapter',
    status: 'blocked',
    code: 'evidence-incompatible',
    change: (i) => {
      i.inspection.adapterVersion = 2;
    },
  },
  {
    name: 'unknown adapter limits',
    status: 'blocked',
    code: 'evidence-incompatible',
    change: (i) => {
      i.inspection.unknown.push('future-limit');
    },
  },
  {
    name: 'resource missing from inspection',
    status: 'indeterminate',
    code: 'inspection-incomplete',
    change: (i) => {
      i.inspection.resources = [];
    },
  },
  {
    name: 'duplicate resource identity',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources.push(structuredClone(i.inspection.resources[0]));
    },
  },
  {
    name: 'resource diagnostic',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].diagnostics = ['git-query-unavailable'];
    },
  },
  {
    name: 'metadata and fact conflict',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].inspection.exists = false;
    },
  },
  {
    name: 'size mismatch',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].inspection.bytes++;
    },
  },
  {
    name: 'tracked resource',
    status: 'blocked',
    code: 'resource-tracked',
    change: (i) => observe(i, 'resource-git', 'tracked'),
  },
  {
    name: 'absence is not enough',
    status: 'not-recognized',
    code: 'outside-resource-kind',
    change: (i) => {
      observe(i, 'resource-exists', false);
      observe(i, 'resource-type', 'absent');
      i.inspection.resources[0].inspection.bytes = null;
    },
  },
  {
    name: 'directory is outside class',
    status: 'not-recognized',
    code: 'outside-resource-kind',
    change: (i) => {
      observe(i, 'resource-type', 'directory');
      observe(i, 'resource-git', 'directory-contents-unverified');
    },
  },
  {
    name: 'facts duplicated',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].evidence[1] = structuredClone(
        i.inspection.resources[0].evidence[0]
      );
    },
  },
  {
    name: 'facts bound to another subject',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].evidence[1].subject.id = 'different';
    },
  },
  {
    name: 'fact timestamp conflict',
    status: 'blocked',
    code: 'inspection-conflict',
    change: (i) => {
      i.inspection.resources[0].evidence[1].observedAt = '2026-11-03T13:00:00Z';
    },
  },
  {
    name: 'observation unknown',
    status: 'indeterminate',
    code: 'inspection-incomplete',
    change: (i) => {
      Object.assign(i.inspection.resources[0].evidence[1], {
        knowledge: 'unknown',
        value: null,
        observedAt: null,
      });
    },
  },
];
module.exports = { scenario, corpus };
