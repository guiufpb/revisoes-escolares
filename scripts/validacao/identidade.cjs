'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const acorn = require('acorn');
const { projectHintCorpus, CONTRACT } = require('./identidade-texto.cjs');
const { execFileSync } = require('node:child_process');

const FORMAT = 2;
const POLICY_FILE = 'validacao/identidade-politica.json';
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const jsonHash = (value) => hash(JSON.stringify(value));
const unique = (items) => [...new Set(items)].sort();
const corpusExtension = /\.(?:js|cjs|mjs|html|css|svg|json|yaml|yml|ps1|bat|py)$/;
const PRIVATE =
  /(?:\.(?:pdf|docx?|xlsx?|pptx?|wav|mp3|ogg|m4a|webm|pem|key)$|(?:^|\/)(?:\.env[^/]*|\.auth|credentials?|credenciais|secrets?|progresso|progress|MINHAS_REVISOES_LOCAIS)(?:[./]|$))/i;
function canonical(file) {
  return (
    typeof file === 'string' &&
    file &&
    !file.includes('\\') &&
    !path.posix.isAbsolute(file) &&
    !file.split('/').some((p) => ['..', '.', ''].includes(p)) &&
    !/[:\0]/.test(file)
  );
}
function inputRule(file, policy) {
  if (!canonical(file)) return false;
  return (
    policy.rootInputs?.includes(file) ||
    (policy.inputRoots?.some((root) => file.startsWith(root)) &&
      policy.inputExtensions?.includes(path.posix.extname(file)))
  );
}
function safeRead(root, file) {
  if (!canonical(file)) return null;
  const target = path.resolve(root, file);
  if (!target.startsWith(path.resolve(root) + path.sep)) return null;
  try {
    let cursor = target;
    while (cursor !== path.resolve(root)) {
      if (fs.lstatSync(cursor).isSymbolicLink()) return null;
      cursor = path.dirname(cursor);
    }
    const before = fs.statSync(target);
    if (!before.isFile()) return null;
    const bytes = fs.readFileSync(target); // Buffer, never UTF-8 for image hashes.
    const after = fs.statSync(target);
    if (
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.ctimeMs !== after.ctimeMs
    )
      throw new Error('Input changed during snapshot: ' + file);
    return bytes;
  } catch (error) {
    if (error.message.startsWith('Input changed during snapshot:')) throw error;
    return null;
  }
}
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => walk(item, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  }
}
function strings(node) {
  const values = [];
  walk(node, (n) => {
    if (n.type === 'Literal' && typeof n.value === 'string') values.push(n.value);
    if (n.type === 'TemplateElement' && n.value.cooked) values.push(n.value.cooked);
  });
  return values;
}
function outputReference(value) {
  const match = /(?:^|\/)(output|tmp)\/([^?#]*)/.exec(value.replaceAll('\\', '/'));
  return match ? path.posix.normalize(match[1] + '/' + match[2]).replace(/\/$/, '') : null;
}
// Positive evidence only: this scanner can promote a diagnostic to input. It is
// NOT used to prove absence of consumers; that requires the reviewed corpus pin.
function literalConsumers(file, text) {
  const refs = [];
  if (/\.(?:js|cjs|mjs)$/.test(file) && !/bundle\./.test(file)) {
    try {
      const tree = acorn.parse(text, { ecmaVersion: 'latest', sourceType: 'module' });
      walk(tree, (n) => {
        if (n.type !== 'CallExpression') return;
        const name = n.callee?.property?.name || n.callee?.name;
        if (
          ![
            'readFileSync',
            'readFile',
            'createReadStream',
            'openSync',
            'open',
            'goto',
            'get',
            'fetch',
          ].includes(name)
        )
          return;
        refs.push(...strings(n.arguments[0]));
      });
    } catch {
      /* exact corpus attestation, not parser success, guards exclusion */
    }
  } else if (/\.(?:html|css|svg)$/.test(file)) {
    for (const match of text.matchAll(
      /(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)/g
    ))
      refs.push(match[1] || match[2]);
  }
  return refs.map(outputReference).filter(Boolean);
}

function captureIdentity({ paths, readBytes, policy: suppliedPolicy, gitScope = false }) {
  const cache = new Map(),
    readErrors = new Map();
  const read = (file) => {
    if (!cache.has(file)) {
      try {
        const bytes = readBytes(file);
        if (bytes !== null && bytes !== undefined && !Buffer.isBuffer(bytes))
          throw new Error('Identity adapter must return raw Buffer bytes');
        cache.set(file, bytes || null);
      } catch (error) {
        cache.set(file, null);
        readErrors.set(file, error.message);
      }
    }
    return cache.get(file);
  };
  let policy = suppliedPolicy;
  try {
    policy ||= JSON.parse(read(POLICY_FILE)?.toString('utf8'));
  } catch {
    policy = null;
  }
  const validPolicy =
    policy?.schemaVersion === 1 &&
    policy.identityFormat === FORMAT &&
    ['1.0.0', '1.1.0'].includes(policy.version);
  const descriptor = {
    schemaVersion: 1,
    version: policy?.version || null,
    fingerprint: policy ? jsonHash(policy) : null,
    ...(policy?.version === '1.1.0'
      ? {
          attestationContract: policy.diagnosticAudit?.representation || null,
          diagnosticCount: policy.diagnosticProducers?.reduce((n, p) => n + p.paths.length, 0),
          diagnosticProof: {
            corpusSha256: policy.diagnosticAudit?.corpusSha256,
            httpDeny: policy.diagnosticAudit?.httpDeny,
            producers: policy.diagnosticProducers,
          },
        }
      : {}),
  };
  if (!validPolicy)
    return {
      schemaVersion: FORMAT,
      policy: descriptor,
      complete: false,
      inputFingerprint: jsonHash(['identity-policy-unavailable', descriptor]),
      inputCount: 0,
      inputs: [],
      diagnostics: [],
      artifacts: { fingerprint: null, entries: [] },
      unknown: [{ path: POLICY_FILE, reason: 'Identity policy missing or unsupported' }],
      treatments: paths.map((file) => ({
        path: file,
        role: 'unknown',
        reason: 'Identity policy unavailable',
      })),
      corpusFingerprint: null,
    };

  const synthetic = new Map(policy.syntheticInputs.map((entry) => [entry.path, entry]));
  const outputs = new Map(
    policy.diagnosticProducers.flatMap((producer) => producer.paths.map((file) => [file, producer]))
  );
  const consumed = new Map();
  try {
    const manifest = JSON.parse(read('validacao/manifesto.json')?.toString('utf8'));
    for (const revision of manifest?.revisions || [])
      for (const file of revision.assets || [])
        consumed.set(file, 'manifest asset consumer: ' + revision.id);
  } catch {
    /* validation is independent; absence does not authorize exclusions */
  }
  const initial = unique([
    ...paths,
    ...(gitScope ? [] : [...policy.forcedInputs, ...synthetic.keys(), ...outputs.keys()]),
    ...consumed.keys(),
  ]);
  const surfaces = initial.filter(
    (file) =>
      file !== POLICY_FILE &&
      !PRIVATE.test(file) &&
      inputRule(file, policy) &&
      (corpusExtension.test(file) ||
        (policy.rootInputs.includes(file) && !/\.(?:md|txt)$/.test(file)))
  );
  const textual =
    policy.version === '1.1.0' && policy.diagnosticAudit.representation === CONTRACT
      ? projectHintCorpus({ surfaces, read })
      : null;
  const corpus = surfaces.map((file) => [
    file,
    read(file)
      ? hash(
          textual?.valid && textual.representations.has(file)
            ? textual.representations.get(file)
            : read(file)
        )
      : 'missing',
  ]);
  for (const file of surfaces) {
    if (!read(file)) continue;
    for (const ref of literalConsumers(file, read(file).toString('utf8'))) {
      const matched = initial.filter((p) => p === ref || p.startsWith(ref + '/'));
      // A fragment in a path.join for a temporary fixture is not a demonstrated
      // root-relative file. Promote only indexed/declared paths it can reach.
      for (const target of matched) consumed.set(target, 'literal input/reference sink: ' + file);
    }
  }
  const corpusFingerprint = jsonHash(corpus);
  const pin = policy.diagnosticAudit;
  const verifyPin = (proof) => {
    const bytes = read(proof.source);
    return !!bytes && hash(bytes) === proof.sha256 && bytes.toString('utf8').includes(proof.anchor);
  };
  const auditValid =
    corpusFingerprint === pin.corpusSha256 &&
    verifyPin(pin.httpDeny) &&
    (policy.version === '1.0.0' || (pin.representation === CONTRACT && textual?.valid === true));
  const producerValid = new Map(
    policy.diagnosticProducers.map((p) => [p.id, auditValid && verifyPin(p)])
  );
  const inputs = [],
    diagnostics = [],
    unknown = [],
    treatments = [];
  for (const file of unique([...initial, ...consumed.keys()])) {
    const producer = outputs.get(file);
    let role, reason;
    if (!canonical(file)) {
      role = 'unknown';
      reason = 'Noncanonical path';
    } else if (PRIVATE.test(file) && !synthetic.has(file)) {
      role = 'protected';
      reason = 'Private document/progress/credential/audio policy: bytes never read';
    } else if (synthetic.has(file) || inputRule(file, policy) || consumed.has(file)) {
      role = 'input';
      reason = synthetic.has(file)
        ? 'Exact synthetic fixture with pinned expected bytes/producer'
        : consumed.get(file) || 'Public source/configuration/resource namespace';
    } else if (producer && producerValid.get(producer.id)) {
      role = 'diagnostic';
      reason = 'Pinned screenshot producer, reviewed consumer corpus and HTTP output deny';
    } else {
      role = 'unknown';
      reason = producer
        ? 'Diagnostic evidence stale/unavailable; exclusion refused'
        : 'No demonstrated input/output role';
    }
    const treatment = {
      path: file,
      role,
      reason,
      ...(producer ? { producer: producer.id, producerSource: producer.source } : {}),
    };
    treatments.push(treatment);
    if (role === 'input' || role === 'diagnostic') {
      const bytes = read(file);
      const entry = {
        path: file,
        role,
        state: bytes ? 'present' : 'missing-or-link',
        sha256: bytes ? hash(bytes) : null,
        bytes: bytes?.length ?? null,
      };
      if (role === 'input') {
        inputs.push(entry);
        if (!bytes)
          unknown.push({
            path: file,
            reason: readErrors.get(file) || 'Input absent/deleted/unreadable/symlink',
          });
        if (synthetic.has(file) && bytes && hash(bytes) !== synthetic.get(file).expectedSha256)
          unknown.push({
            path: file,
            reason: 'Synthetic input does not match immutable fixture contract',
          });
      } else diagnostics.push({ ...entry, producer: producer.id });
    } else if (role === 'unknown' || (role === 'protected' && consumed.has(file)))
      unknown.push({ path: file, reason });
  }
  return {
    schemaVersion: FORMAT,
    policy: descriptor,
    complete: !unknown.length,
    inputFingerprint: jsonHash({ format: FORMAT, policy: descriptor, inputs, unknown }),
    inputCount: inputs.length,
    inputs,
    artifacts: { fingerprint: jsonHash(diagnostics), entries: diagnostics },
    diagnostics: [
      {
        corpusMatchesReview: auditValid,
        producerProofs: Object.fromEntries(producerValid),
        scope: pin.scope,
        ...(textual
          ? {
              textual: {
                contract: textual.contract,
                valid: textual.valid,
                bindings: textual.bindings,
                ...(textual.reason ? { reason: textual.reason } : {}),
              },
            }
          : {}),
      },
    ],
    unknown,
    treatments,
    corpusFingerprint,
  };
}

function provenance(root, gitRead) {
  const git =
    gitRead ||
    ((...args) =>
      execFileSync('git', ['-C', root, ...args], {
        encoding: 'utf8',
        windowsHide: true,
        maxBuffer: 32 * 1024 * 1024,
        env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
      }));
  try {
    if (path.resolve(git('rev-parse', '--show-toplevel').trim()) !== path.resolve(root))
      return { available: false, reason: 'root-is-not-a-checkout' };
    const status = git('status', '--porcelain=v1', '-z', '--untracked-files=all');
    const paths = unique(
      [
        ...git('ls-files', '-z').split('\0'),
        ...git('ls-files', '--others', '--exclude-standard', '-z').split('\0'),
      ].filter(Boolean)
    );
    const identity = captureIdentity({ paths, readBytes: (file) => safeRead(root, file) });
    return {
      available: true,
      commit: git('rev-parse', 'HEAD').trim(),
      tree: git('rev-parse', 'HEAD^{tree}').trim(),
      dirty: !!status.length,
      statusFingerprint: hash(status),
      contentIdentity: status.length
        ? 'working-tree-not-identical-to-commit'
        : 'clean-tracked-tree',
      sourceFingerprint: identity.inputFingerprint,
      sourceFileCount: identity.inputCount,
      fingerprintScope:
        'identity format 2; exact public input bytes, explicit generated diagnostics separate; not a Git tree',
      identity,
    };
  } catch {
    return { available: false, reason: 'git-metadata-or-input-identity-unavailable' };
  }
}
function treatmentResolved(identity, file) {
  const entry = identity?.treatments?.find((item) => item.path === file);
  return !!entry && ['input', 'diagnostic'].includes(entry.role);
}
function identityUsable(identity) {
  if (
    identity?.schemaVersion !== FORMAT ||
    identity.complete !== true ||
    !Array.isArray(identity.inputs) ||
    !Array.isArray(identity.unknown) ||
    identity.unknown.length ||
    identity.inputCount !== identity.inputs.length ||
    identity.policy?.schemaVersion !== 1 ||
    !['1.0.0', '1.1.0'].includes(identity.policy.version) ||
    !/^[a-f0-9]{64}$/.test(identity.policy.fingerprint || '')
  )
    return false;
  if (identity.policy.version === '1.1.0') {
    const count = identity.policy.diagnosticCount;
    if (!Number.isInteger(count) || count < 0 || identity.artifacts?.entries?.length !== count)
      return false;
    if (count) {
      const audit = identity.diagnostics?.[0],
        proof = audit?.textual,
        expected = identity.policy.diagnosticProof;
      if (
        !Array.isArray(expected?.producers) ||
        !expected.producers.length ||
        !canonical(expected.httpDeny?.source) ||
        !/^[a-f0-9]{64}$/.test(expected.httpDeny?.sha256 || '') ||
        expected.producers.some(
          (p) =>
            !p ||
            typeof p.id !== 'string' ||
            !p.id ||
            !canonical(p.source) ||
            !/^[a-f0-9]{64}$/.test(p.sha256 || '') ||
            !Array.isArray(p.paths) ||
            !p.paths.length ||
            p.paths.some((file) => !canonical(file))
        )
      )
        return false;
      const ids = expected.producers.map((p) => p.id).sort();
      const paths = expected.producers.flatMap((p) => p.paths.map((file) => [file, p.id]));
      if (
        new Set(ids).size !== ids.length ||
        new Set(paths.map(([file]) => file)).size !== count ||
        JSON.stringify(Object.keys(audit?.producerProofs || {}).sort()) !== JSON.stringify(ids) ||
        identity.corpusFingerprint !== expected.corpusSha256 ||
        identity.artifacts.fingerprint !== jsonHash(identity.artifacts.entries)
      )
        return false;
      const entries = new Map(identity.artifacts.entries.map((e) => [e.path, e]));
      if (
        entries.size !== count ||
        paths.some(([file, producer]) => {
          const e = entries.get(file);
          return (
            !e ||
            e.role !== 'diagnostic' ||
            e.producer !== producer ||
            !(
              (e.state === 'present' &&
                /^[a-f0-9]{64}$/.test(e.sha256 || '') &&
                Number.isInteger(e.bytes) &&
                e.bytes >= 0) ||
              (e.state === 'missing-or-link' && e.sha256 === null && e.bytes === null)
            )
          );
        })
      )
        return false;
      if (
        identity.policy.attestationContract !== CONTRACT ||
        audit?.corpusMatchesReview !== true ||
        !Object.values(audit.producerProofs || {}).length ||
        !Object.values(audit.producerProofs).every((v) => v === true) ||
        proof?.contract !== CONTRACT ||
        proof.valid !== true ||
        !proof.bindings?.length
      )
        return false;
      const inputs = new Map(identity.inputs.map((e) => [e.path, e.sha256]));
      if (
        inputs.get(expected.httpDeny?.source) !== expected.httpDeny?.sha256 ||
        expected.producers.some((p) => inputs.get(p.source) !== p.sha256)
      )
        return false;
      if (
        proof.bindings.some(
          (b) =>
            b.sourceSha256 !== inputs.get(b.source) ||
            b.bundleSha256 !== inputs.get('ambiente_interativo/js/app.bundle.js') ||
            !b.questions?.length
        )
      )
        return false;
    }
  }
  if (
    new Set(identity.inputs.map((entry) => entry.path)).size !== identity.inputs.length ||
    identity.inputs.some(
      (entry) =>
        !canonical(entry.path) ||
        entry.role !== 'input' ||
        entry.state !== 'present' ||
        !/^[a-f0-9]{64}$/.test(entry.sha256 || '') ||
        !Number.isInteger(entry.bytes) ||
        entry.bytes < 0
    )
  )
    return false;
  return (
    identity.inputFingerprint ===
    jsonHash({
      format: FORMAT,
      policy: identity.policy,
      inputs: identity.inputs,
      unknown: identity.unknown,
    })
  );
}
module.exports = {
  FORMAT,
  POLICY_FILE,
  captureIdentity,
  provenance,
  safeRead,
  inputRule,
  treatmentResolved,
  hash,
  identityUsable,
};
