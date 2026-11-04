'use strict';

// Specific observational adapter. No PNG content IO, hashes, execution or maintenance.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { performance } = require('node:perf_hooks');
const acorn = require('acorn');
const { inspect } = require('./inventario-seguro.cjs');
const { adaptInventory } = require('./inventario-evidencias.cjs');
const ROOT = path.resolve(__dirname, '../..');
const LIMITS = Object.freeze({
  files: 500,
  entries: 4096,
  directories: 256,
  depth: 8,
  seconds: 10,
});
const SOURCES = [
  'tests/historia-alice-objetos-memorias-outubro-2026.spec.js',
  'tests/historia-alice-familias-objetos.spec.js',
  'tests/historia-mariana-transportes.spec.js',
  'tests/ingles-mariana-transportes-outubro-2026.spec.js',
  'tests/ingles-at-the-farm-v2.spec.js',
  'tests/matematica-alice-dezenas-numeros-dinheiro-outubro-2026.spec.js',
];
const CODES = new Set([
  'native-platform-unsupported',
  'directory-linked-or-unsupported',
  'directory-identity-unavailable',
  'metadata-handle-unavailable',
  'reparse-refused',
  'not-regular-file',
  'identity-unavailable',
  'native-metadata-unavailable',
  'identity-changed',
  'metadata-changed',
  'metadata-handle-close-failed',
  'root-invalid',
  'mount-or-other-volume-refused',
  'nested-repository-refused',
  'discovery-limit',
  'depth-limit',
  'directory-changed',
  'discovery-unavailable',
  'root-or-scope-unavailable',
  'request-or-native-metadata-unavailable',
]);

function safeRelative(value, png = true) {
  return (
    typeof value === 'string' &&
    value.length <= 2048 &&
    value.startsWith('test-results/') &&
    !/[\\\x00-\x1f\x7f:*?"<>|]/.test(value) &&
    value
      .split('/')
      .every(
        (p) => p && p !== '.' && p !== '..' && !/[. ]$/.test(p) && p.toLowerCase() !== '.git'
      ) &&
    (!png || /\.png$/i.test(value))
  );
}
function safeRoot(root) {
  return (
    typeof root === 'string' &&
    path.isAbsolute(root) &&
    !/^[/\\]{2}/.test(root) &&
    !/[\x00-\x1f\x7f*?"<>|]/.test(root) &&
    !root
      .slice(path.parse(root).root.length)
      .split(/[\\/]/)
      .some((p) => !p || p === '.' || p === '..' || /[:. ]$|:/.test(p))
  );
}
function collectNative(root, limits) {
  const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
  return JSON.parse(
    execFileSync('python', ['-I', '-B', path.join(__dirname, 'capturas-playwright-win.py')], {
      cwd: ROOT,
      env,
      shell: false,
      windowsHide: true,
      timeout: 12000,
      maxBuffer: 2097152,
      input: JSON.stringify({ root, limits }) + '\n',
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  );
}
function literal(node) {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0].value.cooked;
  if (node?.type === 'BinaryExpression' && node.operator === '+') {
    const left = literal(node.left),
      right = literal(node.right);
    if (left !== null && right !== null) return left + right;
  }
  return null;
}
function producers(root) {
  const associations = new Map();
  const issues = [];
  for (const source of SOURCES) {
    let fd;
    try {
      let target = root;
      for (const part of source.split('/')) {
        target = path.join(target, part);
        if (fs.lstatSync(target).isSymbolicLink()) throw new Error();
      }
      const before = fs.lstatSync(target, { bigint: true });
      if (!before.isFile() || before.nlink !== 1n || before.size > 1048576n) throw new Error();
      fd = fs.openSync(target, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
      const text = fs.readFileSync(fd, 'utf8'); // Trusted, fixed test sources only. Never a PNG.
      const after = fs.fstatSync(fd, { bigint: true });
      if (!['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs'].every((k) => before[k] === after[k]))
        throw new Error();
      const tree = acorn.parse(text, {
        ecmaVersion: 'latest',
        sourceType: 'script',
        locations: true,
      });
      const visit = (node) => {
        if (!node || typeof node !== 'object') return;
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          !node.callee.computed &&
          node.callee.property.name === 'screenshot'
        ) {
          const property =
            node.arguments[0]?.type === 'ObjectExpression'
              ? node.arguments[0].properties.find((p) => !p.computed && p.key?.name === 'path')
              : null;
          const output = literal(property?.value);
          if (safeRelative(output)) {
            const list = associations.get(output) || [];
            list.push({
              source,
              line: node.loc.start.line,
              operation: 'screenshot',
              basis: 'literal-output-path-in-code',
            });
            associations.set(output, list);
          }
        }
        for (const value of Object.values(node)) {
          if (Array.isArray(value)) value.forEach(visit);
          else if (value && typeof value === 'object' && typeof value.type === 'string')
            visit(value);
        }
      };
      visit(tree);
    } catch {
      issues.push('producer-source-unavailable-or-changed');
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
  }
  return { associations, issues: [...new Set(issues)] };
}
function validCollection(value, limits) {
  return (
    value?.version === 1 &&
    ['complete', 'partial', 'absent'].includes(value.status) &&
    Array.isArray(value.resources) &&
    value.resources.length <= limits.files &&
    Array.isArray(value.directories) &&
    value.directories.length <= limits.directories &&
    Array.isArray(value.issues) &&
    value.issues.every((x) => CODES.has(x)) &&
    Number.isSafeInteger(value.excludedFiles) &&
    value.excludedFiles >= 0 &&
    value.resources.every(
      (r) =>
        safeRelative(r.path) &&
        typeof r.regular === 'boolean' &&
        Number.isSafeInteger(r.bytes) &&
        r.bytes >= 0 &&
        Number.isSafeInteger(r.links) &&
        r.links >= 0 &&
        ['device', 'fileId', 'mtimeNs', 'ctimeNs'].every(
          (k) => typeof r[k] === 'string' && /^\d+$/.test(r[k])
        ) &&
        Number.isSafeInteger(r.attributes) &&
        r.attributes >= 0 &&
        (r.allocatedBytes === null ||
          (Number.isSafeInteger(r.allocatedBytes) && r.allocatedBytes >= 0)) &&
        Array.isArray(r.issues) &&
        r.issues.every((x) => CODES.has(x))
    ) &&
    value.resources.reduce((sum, r) => sum + BigInt(r.bytes), 0n) <=
      BigInt(Number.MAX_SAFE_INTEGER) &&
    value.resources.reduce((sum, r) => sum + BigInt(r.allocatedBytes || 0), 0n) <=
      BigInt(Number.MAX_SAFE_INTEGER) &&
    value.directories.every(
      (r) =>
        (r.path === 'test-results' || safeRelative(r.path, false)) &&
        ['device', 'fileId', 'mtimeNs', 'ctimeNs'].every(
          (k) => typeof r[k] === 'string' && /^\d+$/.test(r[k])
        )
    )
  );
}
function snapshot(collection) {
  const projection = (r) => [
    r.path,
    r.device,
    r.fileId,
    r.bytes,
    r.links,
    r.mtimeNs,
    r.ctimeNs,
    r.attributes,
    r.allocatedBytes,
    r.issues,
  ];
  return JSON.stringify([
    collection.status,
    collection.resources.map(projection),
    collection.directories.map(projection),
  ]);
}

function dryRun(options = {}, services = {}) {
  const start = performance.now();
  const root = options.root ?? ROOT;
  const limits = { ...LIMITS, ...options.limits };
  const result = {
    dryRunVersion: 1,
    scope: 'test-results/',
    status: 'partial',
    exitCode: 2,
    cleanupAuthorization: 'none',
    resources: [],
    diagnostics: [],
    limits,
    consumers: {
      knownContract: ['explicit screenshot producers in tests', 'CI diagnostic upload on failure'],
      possible: ['human diagnostic review', 'local comparison or external tools'],
      external: 'unknown',
      concurrentProcesses: 'unknown',
      release: 'not-demonstrated',
    },
    evidence: {
      historicalValue: 'diagnostic-evidence',
      runBinding: 'unknown',
      exactRegeneration: 'not-demonstrated',
    },
    summary: {
      observedPngPaths: 0,
      uniqueIdentities: 0,
      nominalPathBytes: 0,
      uniqueNominalBytes: null,
      allocatedBytesKnown: 0,
      allocatedBytesComplete: null,
      recoverableBytes: null,
      protected: { count: 0, uniqueNominalBytesKnown: 0 },
      blocked: { count: 0, uniqueNominalBytesKnown: 0 },
      reviewOnly: { count: 0, uniqueNominalBytesKnown: 0 },
    },
    limitations: [
      'No PNG bytes, pixels or hashes read; producer association is code-supported inference, not authenticated provenance.',
      'No process/consumer absence or byte-identical regeneration demonstrated. Review candidates are never disposable.',
      'AllocationSize is file data allocation, excluding filesystem overhead; compressed/sparse allocation remains unknown.',
      'Bounded observations and rechecks are not an atomic snapshot or a hostile-race security boundary.',
    ],
  };
  const finish = () => {
    result.elapsedMs = +(performance.now() - start).toFixed(3);
    return result;
  };
  if (
    !safeRoot(root) ||
    (options.scope !== undefined && options.scope !== 'test-results/') ||
    Object.keys(limits).some(
      (k) =>
        !Object.hasOwn(LIMITS, k) ||
        !Number.isInteger(limits[k]) ||
        limits[k] < 1 ||
        limits[k] > LIMITS[k]
    )
  ) {
    result.diagnostics.push('scope-or-limits-invalid');
    return finish();
  }
  try {
    const preflight = (services.inventory || inspect)(root, ['test-results']);
    if (!['complete', 'partial'].includes(preflight.status) || !preflight.worktree?.head)
      throw new Error();
    result.baseHead = preflight.worktree.head;
  } catch {
    result.diagnostics.push('worktree-preflight-unavailable');
    return finish();
  }
  const collector = services.collect || collectNative;
  let initial;
  try {
    initial = collector(root, limits);
  } catch {
    result.diagnostics.push('native-collector-unavailable');
    return finish();
  }
  if (!validCollection(initial, limits)) {
    result.diagnostics.push('collector-contract-invalid');
    return finish();
  }
  result.diagnostics.push(...initial.issues);
  result.discovery = {
    status: initial.status,
    excludedNonPngFiles: initial.excludedFiles,
    directories: initial.directories.length,
  };
  if (initial.status === 'absent') {
    result.status = 'absent';
    result.exitCode = 0;
    return finish();
  }
  let source;
  try {
    source = (services.producers || producers)(root);
  } catch {
    source = { associations: new Map(), issues: ['producer-source-unavailable-or-changed'] };
  }
  result.diagnostics.push(...source.issues);
  const inventoryByPath = new Map();
  const observedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  result.inventoryBatches = 0;
  for (let offset = 0; offset < initial.resources.length; offset += 100) {
    const batch = initial.resources.slice(offset, offset + 100);
    try {
      const inventory = (services.inventory || inspect)(
        root,
        batch.map((r) => r.path)
      );
      const adapted = adaptInventory(inventory, {
        observedAt,
        resourceIds: batch.map((_, i) => 'capture-' + (offset + i + 1)),
      });
      result.inventoryBatches++;
      if (
        !['complete', 'partial'].includes(adapted.status) ||
        adapted.resources.length !== batch.length
      )
        throw new Error();
      adapted.resources.forEach((r, i) => inventoryByPath.set(batch[i].path, r));
      if (adapted.status === 'partial') result.diagnostics.push('inventory-partial');
    } catch {
      result.diagnostics.push('inventory-unavailable-or-incompatible');
    }
  }
  let stable = false;
  try {
    const final = collector(root, limits);
    stable = validCollection(final, limits) && snapshot(initial) === snapshot(final);
  } catch {
    /* No native error/path disclosure. */
  }
  if (!stable) result.diagnostics.push('changed-or-unavailable-at-recheck');
  const censusComplete = initial.status === 'complete' && stable;
  const identities = new Map();
  for (const raw of initial.resources) {
    const key = raw.device !== '0' && raw.fileId !== '0' ? raw.device + ':' + raw.fileId : null;
    if (key) identities.set(key, [...(identities.get(key) || []), raw.path]);
  }
  const counted = new Set();
  let allocationComplete = true,
    identityComplete = true;
  for (const [index, raw] of initial.resources.entries()) {
    const inventory = inventoryByPath.get(raw.path);
    const association = source.associations.get(raw.path) || [];
    const issues = [...raw.issues];
    const key = raw.device !== '0' && raw.fileId !== '0' ? raw.device + ':' + raw.fileId : null;
    if (!raw.regular) issues.push('not-regular-file');
    if (!key) {
      issues.push('identity-unavailable');
      identityComplete = false;
    }
    if (raw.links !== 1) issues.push('hardlink-or-link-count-inadequate');
    if (key && identities.get(key).length > 1) issues.push('duplicate-physical-identity');
    if (
      key &&
      initial.resources.some(
        (peer) =>
          peer.path !== raw.path &&
          peer.device === raw.device &&
          peer.fileId === raw.fileId &&
          ['bytes', 'mtimeNs', 'ctimeNs', 'allocatedBytes'].some(
            (field) => peer[field] !== raw[field]
          )
      )
    ) {
      issues.push('conflicting-identity-metadata');
      identityComplete = false;
    }
    if (
      !inventory ||
      inventory.diagnostics.length ||
      inventory.inspection.type !== 'file' ||
      inventory.inspection.bytes !== raw.bytes
    )
      issues.push('inventory-unverified-or-conflicting');
    if (!censusComplete) issues.push('scope-incomplete-or-unstable');
    if (association.length !== 1)
      issues.push(
        association.length ? 'producer-association-ambiguous' : 'producer-provenance-unresolved'
      );
    if (source.issues.length) issues.push('producer-analysis-incomplete');
    const tracked = inventory?.inspection.git === 'tracked';
    const category = tracked ? 'protected' : issues.length ? 'blocked' : 'reviewOnly';
    const resource = {
      id: 'capture-' + (index + 1),
      path: raw.path,
      category,
      nominalBytes: raw.regular ? raw.bytes : null,
      identity: key ? { device: raw.device, fileId: raw.fileId, links: raw.links } : null,
      allocatedBytes: raw.allocatedBytes,
      allocationProvenance: raw.allocatedBytes === null ? 'unknown' : 'Windows-FileStandardInfo',
      allocationLimitation: raw.allocationIssue ? 'allocation-uncertified' : null,
      producer:
        association.length === 1
          ? {
              status: 'code-supported-inference',
              ...association[0],
              authenticated: false,
              runBinding: 'unknown',
            }
          : { status: 'unknown' },
      evidence: inventory?.evidence || [],
      issues: [...new Set(issues)],
      cleanupAuthorization: 'none',
    };
    result.resources.push(resource);
    result.summary[category].count++;
    if (raw.regular) result.summary.nominalPathBytes += raw.bytes;
    if (raw.regular && key && !counted.has(key)) {
      counted.add(key);
      result.summary[category].uniqueNominalBytesKnown += raw.bytes;
      if (raw.allocatedBytes === null) allocationComplete = false;
      else result.summary.allocatedBytesKnown += raw.allocatedBytes;
    }
    if (raw.allocatedBytes === null) allocationComplete = false;
  }
  result.summary.observedPngPaths = result.resources.length;
  result.summary.regularPngFiles = initial.resources.filter(
    (r) => r.regular && !r.issues.includes('reparse-refused')
  ).length;
  result.summary.uniqueIdentities = counted.size;
  if (identityComplete && censusComplete)
    result.summary.uniqueNominalBytes = Object.values(result.summary)
      .filter((v) => v && typeof v === 'object')
      .reduce((sum, v) => sum + v.uniqueNominalBytesKnown, 0);
  if (allocationComplete && censusComplete && identityComplete)
    result.summary.allocatedBytesComplete = result.summary.allocatedBytesKnown;
  result.diagnostics = [...new Set(result.diagnostics)];
  if (
    censusComplete &&
    !result.diagnostics.length &&
    result.resources.every(
      (r) =>
        !r.issues.some(
          (c) => c !== 'producer-provenance-unresolved' && c !== 'producer-association-ambiguous'
        )
    )
  ) {
    result.status = 'complete';
    result.exitCode = 0;
  }
  result.readableSummary = `${result.summary.observedPngPaths} PNGs observados; ${result.summary.nominalPathBytes} bytes nominais por caminho. Protegidos: ${result.summary.protected.count}; bloqueados: ${result.summary.blocked.count}; somente revisao humana: ${result.summary.reviewOnly.count}. Espaco recuperavel indeterminado. Nenhuma autorizacao de limpeza.`;
  return finish();
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--root')) throw new Error();
    const result = dryRun({ root: args[1] || ROOT });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.exitCode;
  } catch {
    process.stdout.write(
      JSON.stringify({
        status: 'partial',
        exitCode: 2,
        cleanupAuthorization: 'none',
        diagnostics: ['arguments-or-inspection-unavailable'],
      }) + '\n'
    );
    process.exitCode = 2;
  }
}
module.exports = { dryRun, collectNative, LIMITS };
