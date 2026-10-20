'use strict';

const { logicalId, classify } = require('./catalogo.cjs');
const { digest } = require('./manifesto.cjs');
const { proveDeclarative, proveLocalVisual } = require('./planejador-provas.cjs');
const { treatmentResolved } = require('./identidade.cjs');

const VERSION = '1.1.0';
// Explicit existing representatives are resolved from manifesto.contracts, with
// engine-specific state contracts. UI/catalogue contracts do not certify state.
const CONTRACT_POLICY = {
  questionarios: ['cadastro', 'recuperacao', 'limpeza-sessoes'],
  ingles: [
    'cadastro',
    'persistencia',
    'reversibilidade',
    'audio-cancelamento',
    'pre-requisitos',
    'responsavel',
  ],
  'cena-matematica': [
    'cadastro',
    'pontuacao-edicao',
    'storage-adverso',
    'trocas',
    'mosaico',
    'subitens',
  ],
  operacoes: ['cadastro'],
  leitura: ['cadastro', 'audio-leitura', 'pdf-integridade', 'pdf-privacidade'],
  'ciencias-legado': ['cadastro'],
  'matematica-legado': ['cadastro'],
  'gramatica-legado': ['cadastro'],
};
const DOC_PATH = /^(?:documentacao\/[^\r\n]+\.md|validacao\/(?:README|PLANEJADOR)\.md)$/;
const policyDocument = (file) =>
  /(?:^|\/)(?:AGENTS|INSTRUCOES_PROJETO|TESTES_E_VALIDACAO_REAL)\.md$/.test(file);
const isInfrastructure = (file) =>
  /^(?:scripts\/|tests\/|validacao\/.*\.json$|\.github\/|package(?:-lock)?\.json$|[^/]*\.config\.|AGENTS\.md$|\.agents\/|\.gitattributes$|\.gitignore$)/.test(
    file
  );
const sorted = (values) => [...new Set(values)].sort();
const instanceKey = (item) =>
  JSON.stringify([item.id, item.project || '', item.repeatEachIndex || 0]);

function impact(manifests, paths) {
  const revisions = new Map(),
    engines = new Map(),
    capabilities = new Map(),
    dependencies = [];
  for (const manifest of manifests.filter(Boolean)) {
    for (const entity of [...manifest.engines, ...manifest.capabilities]) {
      if (
        [...entity.sources, ...entity.dependencies.map((d) => d.source)].some((p) =>
          paths.includes(p)
        )
      ) {
        (manifest.engines.includes(entity) ? engines : capabilities).set(entity.id, entity);
        for (const id of entity.consumers) {
          const revision = manifest.revisions.find((r) => r.id === id);
          if (revision) revisions.set(id, revision);
        }
        dependencies.push(...entity.dependencies.map((d) => ({ owner: entity.id, ...d })));
      }
    }
    for (const revision of manifest.revisions)
      if (
        [...revision.configFiles, ...revision.contentSources, ...revision.assets].some((p) =>
          paths.includes(p)
        )
      )
        revisions.set(revision.id, revision);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const manifest of manifests.filter(Boolean)) {
      for (const revision of manifest.revisions) {
        for (const dependency of revision.contentDependencies) {
          // Both directions: shared content and reverse consumers, including Alice → Mariana.
          if (!revisions.has(revision.id) && !revisions.has(dependency.revision)) continue;
          dependencies.push({ owner: revision.id, ...dependency });
          for (const id of [revision.id, dependency.revision]) {
            const match = manifest.revisions.find((r) => r.id === id);
            if (match && !revisions.has(id)) {
              revisions.set(id, match);
              changed = true;
            }
          }
        }
      }
    }
  }
  for (const revision of revisions.values()) {
    for (const manifest of manifests.filter(Boolean)) {
      const engine = manifest.engines.find((e) => e.id === revision.engine);
      if (engine) {
        engines.set(engine.id, engine);
        dependencies.push(...engine.dependencies.map((d) => ({ owner: engine.id, ...d })));
      }
      for (const id of revision.capabilities) {
        const capability = manifest.capabilities.find((c) => c.id === id);
        if (capability) capabilities.set(id, capability);
      }
    }
  }
  return {
    revisions: sorted(revisions.keys()),
    engines: sorted(engines.keys()),
    capabilities: sorted(capabilities.keys()),
    dependencies: [...new Map(dependencies.map((d) => [JSON.stringify(d), d])).values()],
  };
}

function makePlan({
  manifest,
  previousManifest = null,
  validation,
  cases,
  changes,
  comparison,
  read,
}) {
  const inputIdentity = comparison.target.identity || comparison.worktree?.source?.identity;
  const errors = [
    ...(validation?.errors || ['Manifest validation was not supplied']),
    ...(comparison.identityErrors || []),
  ];
  const fallback = [],
    required = new Map(),
    files = new Map(),
    rows = [];
  const addFile = (file, reason) => {
    files.set(file, sorted([...(files.get(file) || []), reason]));
  };
  const available = [];
  const instances = new Set();
  if (!manifest || errors.length)
    return {
      schemaVersion: 2,
      plannerVersion: VERSION,
      observational: true,
      identityPolicy: inputIdentity?.policy || null,
      valid: false,
      result: 'invalid',
      comparison,
      errors,
      fallbackReasons: ['Manifest/identity invalid; no valid candidate plan emitted'],
      manifest: manifest
        ? {
            version: manifest.version,
            schemaVersion: manifest.schemaVersion,
            fingerprint: digest(JSON.stringify(manifest)),
          }
        : null,
      available: null,
      proposed: null,
      omitted: [],
      changes: [],
      warnings: ['Execution remains global; this diagnostic is not permission to filter tests.'],
    };
  for (const item of cases) {
    const identity = {
      id: logicalId(item.file, item.titles),
      file: item.file,
      titles: item.titles,
      project: item.project || '',
      repeatEachIndex: item.repeatEachIndex || 0,
    };
    if ((item.id && item.id !== identity.id) || instances.has(instanceKey(identity)))
      errors.push('Invalid/duplicate logical identity: ' + item.file);
    instances.add(instanceKey(identity));
    try {
      available.push({ ...identity, associationScope: classify(manifest, item).associationScope });
    } catch (error) {
      errors.push(error.message);
    }
  }
  for (const change of changes) {
    const paths = sorted([change.previousPath, change.currentPath].filter(Boolean));
    const affected = impact([manifest, previousManifest], paths);
    const revisions = manifest.revisions.filter((r) => affected.revisions.includes(r.id));
    const directConfigs = manifest.revisions.filter((r) =>
      r.configFiles.includes(change.currentPath)
    );
    const row = {
      ...change,
      risk: 'R3',
      rule: 'unknown-or-uncertain',
      basis: '',
      ...affected,
      contracts: [],
      tests: [],
      unresolved: [],
      fallbackReasons: [],
    };
    const file = change.currentPath || change.previousPath;
    row.identityTreatments = paths.map(
      (p) =>
        inputIdentity?.treatments?.find((entry) => entry.path === p) || { path: p, role: 'unknown' }
    );
    if (row.identityTreatments.every((entry) => entry.role === 'diagnostic')) {
      row.risk = 'R0';
      row.rule = 'verified-diagnostic-output';
      row.basis =
        'Exact screenshot output: pinned producer and reviewed consumer corpus; input precedence checked by shared identity policy.';
    } else if (paths.every((p) => DOC_PATH.test(p) && !policyDocument(p))) {
      row.risk = 'R0';
      row.rule = 'documentation-only-allowlist';
      row.basis =
        'Only Markdown in the explicit documentation allowlist; no execution/configuration path.';
    } else if (paths.some((p) => isInfrastructure(p) || policyDocument(p))) {
      row.risk = 'R4';
      row.rule = 'validation-or-build-infrastructure';
      row.basis =
        'Manifest, validation/planner, tests, configuration, workflow or repository policy changed.';
      row.fallbackReasons.push('Infrastructure changes require global');
    } else if (['R', 'C', 'D', 'T', 'U', 'X', 'B'].includes(change.type)) {
      row.rule = 'old-and-new-consumers';
      row.basis =
        'Old/new paths mapped; rename/copy/deletion/type change has no narrow proof in this stage.';
      if (!previousManifest)
        row.unresolved.push('Previous manifest unavailable; old consumers cannot be certified');
      row.fallbackReasons.push('Rename/deletion/structural reach is not demonstrated');
    } else if (
      affected.engines.some((id) =>
        manifest.engines.find((e) => e.id === id)?.sources.some((p) => paths.includes(p))
      ) ||
      [...manifest.engines, ...manifest.capabilities].some((e) =>
        e.dependencies.some((d) => paths.includes(d.source))
      )
    ) {
      row.risk = paths.some((p) => /(?:armazenamento|app\.entry|pdfjs)/.test(p)) ? 'R4' : 'R3';
      row.rule = 'shared-source-or-dependency';
      row.basis = 'Effective engine/capability source or cross-engine dependency.';
      row.fallbackReasons.push('Shared/structural change requires global');
    } else if (
      change.type === 'M' &&
      directConfigs.length &&
      file.endsWith('.js') &&
      proveDeclarative(read('before', file), read('after', file), directConfigs)
    ) {
      row.risk = 'R1';
      row.rule = 'ast-static-data-delta';
      row.basis =
        'Validated effective engine/configuration plus identical executable AST; only approved static content leaves changed.';
    } else if (
      change.type === 'M' &&
      file.endsWith('.svg') &&
      revisions.length &&
      revisions.every((r) => r.assets.includes(file) && !r.gaps.includes('assets-calculados')) &&
      proveLocalVisual(read('before', file), read('after', file))
    ) {
      row.risk = 'R2';
      row.rule = 'closed-svg-colour-delta';
      row.basis =
        'Explicit consumers without unresolved asset-index gap; closed SVG grammar proves unchanged geometry/structure, hex fill/stroke only.';
    } else {
      row.basis = 'No sufficient data/visual/integration proof for this delta.';
      row.unresolved.push(
        file.endsWith('.css') || file.endsWith('.svg')
          ? 'CSS/asset consumers or visual delta not completely resolved'
          : 'Unknown file or unproven executable/content reach'
      );
      row.fallbackReasons.push('Uncertain reach requires global');
    }
    for (const revision of revisions) {
      if (!revision.tests.length && row.risk !== 'R0')
        row.unresolved.push('Affected revision has no mapped tests: ' + revision.id);
      for (const dep of revision.contentDependencies)
        if (!manifest.revisions.some((r) => r.id === dep.revision))
          row.unresolved.push('Unresolved dependency: ' + dep.revision);
      for (const test of revision.tests) {
        addFile(test, 'affected revision/dependent: ' + revision.id);
        row.tests.push(test);
      }
    }
    for (const engine of affected.engines) {
      if (row.risk === 'R1' && !['questionarios', 'cena-matematica'].includes(engine))
        row.unresolved.push('No narrow state/integration proof for engine: ' + engine);
      if (!CONTRACT_POLICY[engine])
        row.unresolved.push('No explicit contract policy for engine: ' + engine);
      for (const contract of CONTRACT_POLICY[engine] || []) {
        required.set(contract, sorted([...(required.get(contract) || []), engine]));
        row.contracts.push(contract);
      }
    }
    if (row.risk === 'R2') {
      required.set(
        'acessibilidade',
        sorted([...(required.get('acessibilidade') || []), ...affected.engines])
      );
      row.contracts.push('acessibilidade');
    }
    if (row.unresolved.length) row.fallbackReasons.push('Unresolved references require global');
    row.tests = sorted(row.tests);
    row.contracts = sorted(row.contracts);
    fallback.push(...row.fallbackReasons.map((reason) => file + ': ' + reason));
    rows.push(row);
  }
  const represented = [],
    gaps = [];
  if (fallback.length)
    for (const contract of manifest.contracts)
      if (!required.has(contract.id)) required.set(contract.id, []);
  for (const [id, engines] of required) {
    const contract = manifest.contracts.find((c) => c.id === id);
    const resolved = [];
    for (const ref of contract?.representatives || []) {
      const matched = available.filter(
        (c) => c.file === ref.file && new RegExp(ref.pattern, 'u').test(c.titles.join(' › '))
      );
      if (!matched.length)
        gaps.push('Required representative unresolved: ' + id + ' in ' + ref.file);
      for (const item of matched) {
        resolved.push(item.id);
        addFile(item.file, 'contract ' + id + ' for ' + engines.join(', '));
      }
    }
    if (!contract || !resolved.length)
      gaps.push('Required contract without resolved representative: ' + id);
    represented.push({
      id,
      engines,
      references: contract?.representatives || [],
      representatives: sorted(resolved),
      scope: ['cadastro', 'acessibilidade'].includes(id)
        ? 'catalogue/UI only; no equivalence of engine state formats'
        : 'representative within its declared engine/preparation, not every consumer',
      limits: contract?.limits || [],
    });
  }
  fallback.push(...gaps);
  if (available.length !== manifest.discovery.caseCount)
    errors.push('Available inventory differs from validated current expectations');
  for (const file of files.keys())
    if (!available.some((c) => c.file === file)) {
      gaps.push('Selected file has no discovered case: ' + file);
      fallback.push('Selected file unresolved: ' + file);
    }
  const codeChanged = rows.some((r) => r.risk !== 'R0');
  if (codeChanged && !files.size && !fallback.length)
    errors.push('Empty selection for a code change');
  if (codeChanged && !available.length) errors.push('Empty available inventory for a code change');
  const global = fallback.length > 0;
  const proposedCases = global ? available : available.filter((c) => files.has(c.file));
  if (codeChanged && !proposedCases.length) errors.push('Empty selection for a code change');
  for (const row of rows) {
    if (row.fallbackReasons.length) row.contracts = represented.map((c) => c.id).sort();
    row.tests = sorted([
      ...(row.fallbackReasons.length ? available.map((c) => c.file) : row.tests),
      ...represented
        .filter((c) => row.contracts.includes(c.id))
        .flatMap((c) =>
          available.filter((item) => c.representatives.includes(item.id)).map((item) => item.file)
        ),
    ]);
  }
  return {
    schemaVersion: 2,
    plannerVersion: VERSION,
    observational: true,
    identityPolicy: inputIdentity?.policy || null,
    valid: !errors.length,
    result: errors.length ? 'invalid' : global ? 'global' : 'candidate',
    comparison,
    manifest: {
      version: manifest.version,
      schemaVersion: manifest.schemaVersion,
      fingerprint: digest(JSON.stringify(manifest)),
    },
    available: {
      files: sorted(available.map((c) => c.file)),
      caseCount: available.length,
      cases: available,
    },
    proposed: errors.length
      ? null
      : {
          files: sorted(proposedCases.map((c) => c.file)),
          caseCount: proposedCases.length,
          cases: proposedCases,
          fileReasons: global
            ? sorted(available.map((c) => c.file)).map((file) => ({
                file,
                reasons: ['global fallback; see fallbackReasons'],
              }))
            : [...files].map(([file, reasons]) => ({ file, reasons })),
        },
    omitted: errors.length
      ? []
      : available
          .filter((c) => !proposedCases.includes(c))
          .map((c) => ({
            ...c,
            reason:
              'Outside resolved impact and explicit representatives; omission is only a hypothesis, execution remains global',
          })),
    changes: rows,
    contracts: { policy: CONTRACT_POLICY, represented, unresolved: sorted(gaps) },
    knownGaps: manifest.gaps,
    errors,
    fallbackReasons: sorted(fallback),
    identityUncoveredPaths: sorted(
      changes
        .flatMap((c) => [c.previousPath, c.currentPath])
        .filter((p) => p && !treatmentResolved(inputIdentity, p))
    ),
    warnings: [
      'OBSERVATIONAL ONLY: npm test and mandatory CI remain global.',
      'Whole files selected. File supersets do not prove every case covers every revision/capability.',
      'A green global does not establish statistical safety of this hypothetical cut.',
    ],
  };
}
module.exports = { VERSION, CONTRACT_POLICY, makePlan, impact, instanceKey };
