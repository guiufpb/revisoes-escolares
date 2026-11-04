'use strict';

// Optional private context only. No Git, discovery of worktrees or filesystem writes.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { TextDecoder } = require('node:util');
const Ajv = require('ajv');
const schema = require('../../validacao/registro-worktree.schema.json');
const { validTime } = require('./evidencia-organizacao.cjs');
const ajv = new Ajv({ allErrors: false, ownProperties: true });
const checkStructure = ajv.compile(schema);
const LIMITS = Object.freeze({ records: 100, bytes: 65536, totalBytes: 1048576 });
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const DEFAULT_DIRECTORY = path.join(os.homedir(), '.revisoes-escolares', 'worktree-lifecycle');

function safeAbsolute(value) {
  if (
    typeof value !== 'string' ||
    value.length > 2048 ||
    !path.isAbsolute(value) ||
    /^[/\\]{2}/.test(value) ||
    /[\x00-\x1f\x7f*?"<>|]/.test(value) ||
    (process.platform === 'win32' && !/^[a-z]:[\\/]/i.test(value))
  )
    return false;
  const tail = value.slice(path.parse(value).root.length);
  return (
    !!tail &&
    !tail
      .split(/[\\/]/)
      .some(
        (part) =>
          !part ||
          part === '.' ||
          part === '..' ||
          /[:. ]$|:/.test(part) ||
          part.toLowerCase() === '.git' ||
          /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)
      )
  );
}

function validateRecord(record) {
  if (!checkStructure(record)) return { valid: false, issue: 'record-structure-invalid' };
  if (!validTime(record.recordedAt)) return { valid: false, issue: 'record-time-invalid' };
  if (record.location !== null && !safeAbsolute(record.location))
    return { valid: false, issue: 'record-path-invalid' };
  const previous = new Map();
  for (const note of record.observations) {
    if (!validTime(note.recordedAt) || note.recordedAt > record.recordedAt)
      return { valid: false, issue: 'observation-time-invalid' };
    if (previous.has(note.id)) return { valid: false, issue: 'observation-id-duplicate' };
    if (note.supersedes !== null) {
      const prior = previous.get(note.supersedes);
      if (!prior || prior.topic !== note.topic || prior.recordedAt > note.recordedAt)
        return { valid: false, issue: 'observation-reference-invalid' };
    }
    previous.set(note.id, note);
  }
  for (const dependency of record.dependencies || []) {
    if (
      (dependency.kind === 'worktree' && dependency.target === record.worktreeId) ||
      (dependency.kind === 'resource' && !safeAbsolute(dependency.target))
    )
      return { valid: false, issue: 'dependency-reference-invalid' };
  }
  return { valid: true };
}

function recordEvidence(record) {
  if (!validateRecord(record).valid) return [];
  return ['purpose', 'task', 'phase', 'declaredState', 'location'].map((fact) => ({
    evidenceVersion: 1,
    subject: { kind: 'worktree', id: record.worktreeId },
    source: 'lifecycle-record',
    fact,
    knowledge: record[fact] === null ? 'unknown' : 'declared',
    // Text and paths remain private in the record, not in the evidence projection.
    value:
      record[fact] === null
        ? null
        : ['phase', 'declaredState'].includes(fact)
          ? record[fact]
          : 'present',
    observedAt: record[fact] === null ? null : record.recordedAt,
  }));
}

function inspectRecords(directory = DEFAULT_DIRECTORY) {
  const report = {
    reportVersion: 1,
    status: 'complete',
    exitCode: 0,
    directory: 'unknown',
    coverage: 'unknown',
    records: [],
    diagnostics: [],
    unknown: ['worktree-current-state', 'history-completeness', 'dependencies-availability'],
  };
  function issue(code, fatal = false) {
    report.diagnostics.push(code);
    report.status = fatal ? 'fatal' : 'partial';
    report.exitCode = fatal ? 1 : 2;
    return report;
  }
  if (!safeAbsolute(directory)) return issue('records-directory-invalid', true);
  const absolute = path.resolve(directory);
  function metadata(target) {
    let current = path.parse(target).root;
    let item = fs.lstatSync(current);
    if (item.isSymbolicLink()) throw new Error();
    const parts = target.slice(current.length).split(path.sep);
    for (const part of parts) {
      if (!item.isDirectory()) throw new Error();
      current = path.join(current, part);
      item = fs.lstatSync(current);
      if (item.isSymbolicLink()) throw new Error();
    }
    return item;
  }
  try {
    if (!metadata(absolute).isDirectory()) return issue('records-directory-unsupported', true);
  } catch (error) {
    if (error.code === 'ENOENT') {
      report.directory = 'absent';
      return report;
    }
    return issue('records-directory-unavailable-or-linked', true);
  }
  report.directory = 'present';
  let handle;
  const names = [];
  try {
    handle = fs.opendirSync(absolute);
    let entry;
    while ((entry = handle.readSync()) !== null) {
      if (names.length === LIMITS.records) return issue('directory-entry-limit', true);
      names.push(entry.name);
    }
  } catch {
    return issue('records-directory-unreadable', true);
  } finally {
    if (handle) handle.closeSync();
  }
  report.coverage = 'listed';
  let totalBytes = 0;
  const ids = new Map();
  for (const [index, name] of names.sort().entries()) {
    const result = { slot: index + 1, status: 'invalid', diagnostics: [], evidence: [] };
    report.records.push(result);
    const fail = (code) => {
      result.diagnostics.push(code);
      report.status = 'partial';
      report.exitCode = 2;
    };
    // Never echo private names, unknown properties, values or native errors.
    if (!/^[a-z0-9_-]{1,80}\.json$/i.test(name)) {
      fail('record-name-unsupported');
      continue;
    }
    let descriptor;
    let record;
    try {
      const target = path.join(absolute, name);
      const before = metadata(target);
      if (!before.isFile() || before.nlink !== 1) {
        fail('record-file-unsupported');
        continue;
      }
      if (before.size > LIMITS.bytes || totalBytes + before.size > LIMITS.totalBytes) {
        fail('record-byte-limit');
        continue;
      }
      descriptor = fs.openSync(target, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
      const opened = fs.fstatSync(descriptor);
      if (!opened.isFile() || opened.nlink !== 1 || !sameFile(before, opened)) {
        fail('record-file-changed');
        continue;
      }
      const buffer = Buffer.alloc(Math.min(LIMITS.bytes, LIMITS.totalBytes - totalBytes) + 1);
      let count = 0;
      let read;
      while (
        count < buffer.length &&
        (read = fs.readSync(descriptor, buffer, count, buffer.length - count, null)) > 0
      )
        count += read;
      totalBytes += count;
      if (count > LIMITS.bytes || totalBytes > LIMITS.totalBytes) {
        fail('record-byte-limit');
        continue;
      }
      if (!sameFile(opened, fs.fstatSync(descriptor)) || !sameFile(opened, metadata(target))) {
        fail('record-file-changed');
        continue;
      }
      try {
        record = JSON.parse(
          new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, count))
        );
      } catch {
        fail('record-json-invalid');
        continue;
      }
    } catch {
      fail('record-unavailable-or-linked');
      continue;
    } finally {
      if (descriptor !== undefined) fs.closeSync(descriptor);
    }
    // Reserve even structurally invalid UUIDs: a bad duplicate cannot validate its peer.
    if (record && typeof record.worktreeId === 'string' && UUID.test(record.worktreeId)) {
      const peers = ids.get(record.worktreeId) || [];
      peers.push(result);
      ids.set(record.worktreeId, peers);
    }
    const validation = validateRecord(record);
    if (!validation.valid) {
      fail(validation.issue);
      continue;
    }
    result.status = 'valid';
    result.worktreeId = record.worktreeId;
    result.unknown = ['purpose', 'task', 'phase', 'declaredState', 'location'].filter(
      (key) => record[key] === null
    );
    if (record.dependencies === undefined) result.unknown.push('dependencies');
    if (record.history === undefined) result.unknown.push('history');
    result.evidence = recordEvidence(record);
  }
  for (const peers of ids.values()) {
    if (peers.length < 2) continue;
    for (const peer of peers) {
      peer.status = 'invalid';
      peer.evidence = [];
      delete peer.worktreeId;
      delete peer.unknown;
      peer.diagnostics.push('worktree-id-duplicate');
    }
    report.status = 'partial';
    report.exitCode = 2;
  }
  return report;
}

function sameFile(a, b) {
  return ['dev', 'ino', 'size', 'mtimeMs', 'ctimeMs'].every((key) => a[key] === b[key]);
}

function main(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write(
      'Uso: node scripts/validacao/registro-worktrees.cjs [--records-dir DIRETORIO_ABSOLUTO]\n' +
        'Leitura privada opcional; sem escrita, historico automatico ou autorizacao de limpeza.\n'
    );
    return;
  }
  if (args.length && (args.length !== 2 || args[0] !== '--records-dir')) throw new Error();
  const report = inspectRecords(args[1]);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exitCode = report.exitCode;
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch {
    process.stdout.write(
      JSON.stringify({
        status: 'fatal',
        exitCode: 1,
        diagnostics: ['reader-unavailable-or-arguments-invalid'],
      }) + '\n'
    );
    process.exitCode = 1;
  }
}
module.exports = {
  inspectRecords,
  validateRecord,
  recordEvidence,
  LIMITS,
  DEFAULT_DIRECTORY,
};
