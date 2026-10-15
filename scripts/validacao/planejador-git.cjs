'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { provenance, captureIdentity, inputRule, safeRead } = require('./identidade.cjs');
const policy = require('../../validacao/identidade-politica.json');

// Compatibility alias; classification rules live only in identidade.cjs/policy.
const reporterPath = (file) => !!inputRule(file, policy);
const split = (value) => value.split('\0').filter(Boolean);
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
    const paths = split(git('ls-tree', '-r', '--name-only', '-z', ref));
    const readBytes = (file) => {
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
    const identity = captureIdentity({ paths, readBytes, gitScope: true });
    const workingScope = captureIdentity({
      paths,
      readBytes: (file) => safeRead(root, file),
      gitScope: true,
    });
    const derived = new Set([...policy.forcedInputs, ...policy.syntheticInputs.map((p) => p.path)]);
    const extraInputs = (worktreeSource?.identity?.inputs || [])
      .filter((e) => !paths.includes(e.path) && !derived.has(e.path))
      .map((e) => e.path);
    return {
      ...identity,
      gitTreeScope: true,
      workingScopeFingerprint: workingScope.inputFingerprint,
      extraInputs,
      compatibleWithWorktree:
        identity.complete &&
        workingScope.complete &&
        identity.inputFingerprint === workingScope.inputFingerprint &&
        !extraInputs.length,
    };
  };
  const refFingerprint = (ref) => refIdentity(ref).inputFingerprint;
  return { git, resolve, readRef, readWorktree, refFingerprint, refIdentity };
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
  )
    identityErrors.push(
      'Target Git content differs from validated checkout; use a matching checkout without transplanting files'
    );
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
  };
}
module.exports = { collectComparison, gitRepository, parseChanges, reporterPath };
