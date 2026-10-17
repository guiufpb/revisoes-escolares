'use strict';

const assert = require('node:assert/strict');
const { digest, BASELINE_DIGEST } = require('../../../scripts/validacao/manifesto.cjs');

// Shared by the browser check and synthetic controls. The historical reference
// is immutable; current expectations come from the independently validated manifest.
function assertRegistry(registro, { manifest, baseline }) {
  assert.equal(digest(JSON.stringify(baseline)), BASELINE_DIGEST, 'Referência histórica alterada');
  const total = manifest.revisions.length;
  assert.equal(registro.length, total, 'Total do registro diverge do manifesto');
  assert.equal(new Set(registro.map((r) => r.id)).size, total, 'IDs duplicados');
  assert.equal(new Set(registro.map((r) => r.chaveArmazenamento)).size, total, 'Chaves duplicadas');
  const identities = Array.from(registro, (r) => [r.id, r.aluno, r.chaveArmazenamento]);
  assert.deepEqual(
    identities.sort(),
    manifest.revisions.map((r) => [r.id, r.profile, r.primaryKey]).sort(),
    'Identidades atuais divergem do manifesto'
  );
  const byId = new Map(registro.map((r) => [r.id, r]));
  for (const historical of baseline.revisions) {
    assert.ok(byId.has(historical.id), 'Revisão histórica ausente: ' + historical.id);
    assert.equal(
      byId.get(historical.id).chaveArmazenamento,
      historical.primaryKey,
      'Chave histórica alterada: ' + historical.id
    );
  }
}

module.exports = { assertRegistry };
