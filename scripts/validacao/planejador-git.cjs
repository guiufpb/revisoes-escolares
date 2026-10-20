'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { provenance, captureIdentity, inputRule, safeRead } = require('./identidade.cjs');
const policy = require('../../validacao/identidade-politica.json');

// Compatibility alias; classification rules live only in identidade.cjs/policy.
const reporterPath = (file) => !!inputRule(file, policy);
const split = (value) => value.split('\0').filter(Boolean);
const materializationAttributes = [
  'text',
  'eol',
  'filter',
  'working-tree-encoding',
  'ident',
  'crlf',
];

// Only compatibility may account for checkout conversion. Neither identity is rewritten.
function lfToCrlfEvidence(root, ref, file, blob, working, git, readBytes) {
  if (!file.endsWith('.bat') || !blob || !working || blob.includes(0) || blob.includes(13))
    throw new Error('Only LF text .bat materialization is supported');
  if (!blob.includes(10)) throw new Error('No LF to materialize');
  if (process.env.GIT_ATTR_SOURCE) throw new Error('External attribute source is unsupported');
  // --source still honors info/attributes. Never let that override authorize a conversion.
  const info = path.resolve(root, git('rev-parse', '--git-path', 'info/attributes').trim());
  if (fs.lstatSync(info, { throwIfNoEntry: false }))
    throw new Error('Local info/attributes override is unsupported');
  // Check every applicable versioned attribute file, including nested/untracked overrides.
  let directory = path.posix.dirname(file);
  while (true) {
    const attributes = directory === '.' ? '.gitattributes' : directory + '/.gitattributes';
    const expected = readBytes(attributes);
    const actual = safeRead(root, attributes);
    if (
      (expected && (!actual || !expected.equals(actual))) ||
      (!expected && fs.lstatSync(path.join(root, attributes), { throwIfNoEntry: false }))
    )
      throw new Error('Attribute file differs from Git revision: ' + attributes);
    if (directory === '.') break;
    directory = path.posix.dirname(directory);
  }
  const parse = (raw) => {
    const fields = split(raw);
    if (fields.length !== materializationAttributes.length * 3)
      throw new Error('Incomplete Git attribute evidence');
    return Object.fromEntries(
      materializationAttributes.map((attribute, i) => {
        if (fields[i * 3] !== file || fields[i * 3 + 1] !== attribute)
          throw new Error('Unexpected Git attribute evidence');
        return [attribute, fields[i * 3 + 2]];
      })
    );
  };
  // Isolate versioned rules from global/system attributes; no filters are executed.
  const declared = parse(
    execFileSync(
      'git',
      [
        '-C',
        root,
        '-c',
        'core.attributesFile=',
        'check-attr',
        '--source=' + ref,
        '-z',
        ...materializationAttributes,
        '--',
        file,
      ],
      {
        encoding: 'utf8',
        windowsHide: true,
        env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_ATTR_NOSYSTEM: '1' },
      }
    )
  );
  const effective = parse(git('check-attr', '-z', ...materializationAttributes, '--', file));
  if (
    JSON.stringify(declared) !== JSON.stringify(effective) ||
    declared.text !== 'set' ||
    declared.eol !== 'crlf' ||
    materializationAttributes.slice(2).some((attribute) => declared[attribute] !== 'unspecified')
  )
    throw new Error('Unsupported or divergent Git materialization attributes');
  // latin1 is a reversible byte mapping; no Unicode decoding or general normalization.
  const materialized = Buffer.from(blob.toString('latin1').replace(/\n/g, '\r\n'), 'latin1');
  if (!materialized.equals(working)) throw new Error('Content differs beyond LF to CRLF');
  return { path: file, conversion: 'lf-to-crlf', source: ref, attributes: declared };
}
function parseChanges(raw) {
  const parts = split(raw),
    changes = [];
  for (let i = 0; i < parts.length;) {
    const status = parts[i++];
    if (!/^[AMDTUXBRC][0-9]*$/.test(status) || !parts[i])
      throw new Error('Invalid Git name-status record');
    const first = parts[i++];
    const moved = /^[RC]/.test(status);
    if (moved && !parts[i]) throw new Error('Missing rename/copy target');
    const second = moved ? parts[i++] : first;
    changes.push({
      status,
      type: status[0],
      previousPath: status[0] === 'A' ? null : first,
      currentPath: status[0] === 'D' ? null : second,
    });
  }
  return changes;
}
function gitRepository(root) {
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      windowsHide: true,
      env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
    });
  const resolve = (ref) =>
    git('rev-parse', '--verify', '--end-of-options', ref + '^{commit}').trim();
  const readRef = (ref, file) => {
    try {
      return git('show', ref + ':' + file);
    } catch {
      return null;
    }
  };
  const readRefBytes = (ref, file) => {
    try {
      return execFileSync('git', ['-C', root, 'show', ref + ':' + file], {
        maxBuffer: 64 * 1024 * 1024,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'ignore'],
        env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
      });
    } catch {
      return null;
    }
  };
  const readWorktree = (file) => {
    const target = path.resolve(root, file);
    if (!target.startsWith(path.resolve(root) + path.sep)) throw new Error('Path outside checkout');
    try {
      // Do not follow symlinks in either the final component or its ancestors.
      let cursor = target;
      while (cursor !== path.resolve(root)) {
        if (fs.lstatSync(cursor).isSymbolicLink()) return null;
        cursor = path.dirname(cursor);
      }
      return fs.readFileSync(target, 'utf8');
    } catch {
      return null;
    }
  };
  const refIdentity = (ref, worktreeSource) => {
    ref = resolve(ref);
    const paths = split(git('ls-tree', '-r', '--name-only', '-z', ref));
    const referenceBytes = new Map();
    const readBytes = (file) => {
      if (referenceBytes.has(file)) return referenceBytes.get(file);
      try {
        const bytes = execFileSync('git', ['-C', root, 'show', ref + ':' + file], {
          maxBuffer: 64 * 1024 * 1024,
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'ignore'],
          env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
        });
        referenceBytes.set(file, bytes);
        return bytes;
      } catch {
        referenceBytes.set(file, null);
        return null;
      }
    };
    const identity = captureIdentity({ paths, readBytes, gitScope: true });
    const workingBytes = new Map();
    const workingScope = captureIdentity({
      paths,
      readBytes: (file) => {
        const bytes = safeRead(root, file);
        workingBytes.set(file, bytes);
        return bytes;
      },
      gitScope: true,
    });
    const derived = new Set([...policy.forcedInputs, ...policy.syntheticInputs.map((p) => p.path)]);
    const extraInputs = (worktreeSource?.identity?.inputs || [])
      .filter((e) => !paths.includes(e.path) && !derived.has(e.path))
      .map((e) => e.path);
    const materializedInputs = [],
      materializationErrors = [],
      compatibilityIssues = [];
    if (!identity.complete) compatibilityIssues.push('git-input-identity-incomplete');
    if (!workingScope.complete) compatibilityIssues.push('worktree-input-identity-incomplete');
    if (extraInputs.length) compatibilityIssues.push('extra-worktree-inputs');
    if (identity.policy.fingerprint !== workingScope.policy.fingerprint)
      compatibilityIssues.push('identity-policy-mismatch');
    if (identity.inputs.length !== workingScope.inputs.length)
      compatibilityIssues.push('input-scope-mismatch');
    const workingInputs = new Map(workingScope.inputs.map((entry) => [entry.path, entry]));
    let compatible =
      identity.complete &&
      workingScope.complete &&
      !extraInputs.length &&
      identity.policy.fingerprint === workingScope.policy.fingerprint &&
      identity.inputs.length === workingScope.inputs.length;
    if (compatible) {
      for (const entry of identity.inputs) {
        const current = workingInputs.get(entry.path);
        if (!current) {
          compatible = false;
          compatibilityIssues.push('input-scope-mismatch');
          materializationErrors.push({ path: entry.path, reason: 'Input scope differs' });
        } else if (entry.sha256 !== current.sha256 || entry.bytes !== current.bytes) {
          try {
            materializedInputs.push(
              lfToCrlfEvidence(
                root,
                ref,
                entry.path,
                readBytes(entry.path),
                workingBytes.get(entry.path),
                git,
                readBytes
              )
            );
          } catch {
            compatible = false;
            const blob = readBytes(entry.path),
              working = workingBytes.get(entry.path);
            // Diagnose only. Exact conversion/attribute acceptance above is unchanged.
            const crlfCandidate =
              entry.path.endsWith('.bat') &&
              blob &&
              working &&
              !blob.includes(0) &&
              !blob.includes(13) &&
              blob.includes(10) &&
              Buffer.from(blob.toString('latin1').replace(/\n/g, '\r\n'), 'latin1').equals(working);
            const code = crlfCandidate ? 'materialization-incompatible' : 'input-content-differs';
            compatibilityIssues.push(code);
            materializationErrors.push({ path: entry.path, reason: code });
          }
        }
      }
    }
    return {
      ...identity,
      gitTreeScope: true,
      workingScopeFingerprint: workingScope.inputFingerprint,
      extraInputs,
      materializedInputs,
      materializationErrors,
      compatibilityIssues: [...new Set(compatibilityIssues)],
      compatibleWithWorktree: compatible,
    };
  };
  const refFingerprint = (ref) => refIdentity(ref).inputFingerprint;
  return { git, resolve, readRef, readRefBytes, readWorktree, refFingerprint, refIdentity };
}
function collectComparison(root, { mode, base, target }, repository = gitRepository(root)) {
  if (
    !base ||
    !['refs', 'worktree'].includes(mode) ||
    (mode === 'refs' && !target) ||
    (mode === 'worktree' && target)
  )
    throw new Error('Use --mode refs --base REF --target REF, or --mode worktree --base REF');
  const { git, resolve, readRef, readWorktree, refFingerprint } = repository;
  const baseCommit = resolve(base),
    targetCommit = mode === 'refs' ? resolve(target) : null;
  const changes = parseChanges(
    git(
      'diff',
      '--no-ext-diff',
      '--no-textconv',
      '--name-status',
      '-z',
      '--find-renames',
      baseCommit,
      ...(targetCommit ? [targetCommit] : []),
      '--'
    )
  );
  if (mode === 'worktree') {
    for (const file of split(git('ls-files', '--others', '--exclude-standard', '-z')))
      if (!changes.some((c) => c.currentPath === file))
        changes.push({ status: 'untracked', type: 'A', previousPath: null, currentPath: file });
  }
  const source = provenance(root, git);
  const referenceIdentity =
    targetCommit && repository.refIdentity ? repository.refIdentity(targetCommit, source) : null;
  const targetFingerprint = referenceIdentity
    ? source.sourceFingerprint
    : targetCommit
      ? refFingerprint(targetCommit)
      : source.sourceFingerprint;
  const identityErrors = [];
  if (!source.available) identityErrors.push('Worktree identity unavailable');
  if (
    targetCommit &&
    (referenceIdentity
      ? !referenceIdentity.compatibleWithWorktree
      : targetFingerprint !== source.sourceFingerprint)
  ) {
    const issues = referenceIdentity?.compatibilityIssues;
    if (issues?.length) {
      for (const issue of issues) identityErrors.push('Target Git compatibility refused: ' + issue);
    } else {
      identityErrors.push(
        referenceIdentity
          ? 'Target Git compatibility unavailable; no demonstrated byte/materialization equivalence'
          : 'Target Git input fingerprint differs from validated checkout'
      );
    }
  }
  const read = (side, file) => {
    if (!file) return null;
    return side === 'before'
      ? readRef(baseCommit, file)
      : targetCommit
        ? readRef(targetCommit, file)
        : readWorktree(file);
  };
  return {
    comparison: {
      mode,
      base: { requested: base, commit: baseCommit },
      target: targetCommit
        ? {
            kind: 'git-ref',
            requested: target,
            commit: targetCommit,
            sourceFingerprint: targetFingerprint,
            identity: source.identity,
            gitInputIdentity: referenceIdentity,
            materialization:
              'Git inputs matched separately; generated local inputs observed from worktree, never attributed to Git blobs',
          }
        : {
            kind: 'working-tree',
            identity: source.identity,
            includesIndexAndUnstaged: true,
            includesUntracked: true,
            sourceFingerprint: targetFingerprint,
          },
      worktree: { root: path.resolve(root), source },
      identityErrors,
    },
    changes: changes.sort((a, b) =>
      (a.currentPath || a.previousPath).localeCompare(b.currentPath || b.previousPath)
    ),
    read,
    // Binary evidence is separate from the existing UTF-8 source reader.
    readBytes: (side, file) =>
      side === 'before'
        ? (repository.readRefBytes?.(baseCommit, file) ?? null)
        : targetCommit
          ? (repository.readRefBytes?.(targetCommit, file) ?? null)
          : safeRead(root, file),
  };
}
module.exports = { collectComparison, gitRepository, parseChanges, reporterPath };
