'use strict';

// Explicit experimental pair only. No discovery, reporter execution or maintenance.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { TextDecoder, isDeepStrictEqual } = require('node:util');
const { inspect } = require('./inventario-seguro.cjs');
const { adaptInventory } = require('./inventario-evidencias.cjs');

const LIMIT_BYTES = 65536;
const UUID = '[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}';
const EXPERIMENT = new RegExp('^tmp/org9b-reporter-ab-' + UUID + '$');
const RUN = new RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-\\d{3}Z-' + UUID + '$');
const FIELDS = ['dev', 'ino', 'mode', 'nlink', 'size', 'mtimeNs', 'ctimeNs'];
const same = (a, b) => FIELDS.every((key) => a[key] === b[key]);
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const fault = (code) => Object.assign(new Error(code), { observationCode: code });

function evaluatePair(options, services = {}) {
  const result = {
    evaluationVersion: 1,
    status: 'partial',
    exitCode: 2,
    cleanupAuthorization: 'none',
    resources: [],
    inventory: null,
    comparison: { bytes: 'inconclusive', reports: 'inconclusive' },
    producer: {
      contract: 'scripts/validacao/reporter.cjs: ValidationReporter.write()',
      behavior: 'serializes run.json.tmp, then renames it to run.json; rename errors propagate',
      experiment: 'insufficient-information',
      evidenceSource: 'experiment-observations-declaration',
      authenticated: false,
      currentProcessState: 'unknown',
    },
    consumers: {
      contractSources: [
        'validacao/README.md',
        'scripts/validacao/reporter.cjs',
        'scripts/validacao/ci-observacional.cjs',
        'scripts/validacao/planejador-cli.cjs',
      ],
      expected: [
        'reporter writes the intermediate and consumes its pathname during publication',
        'CI observation and explicit comparison consume final reports; diagnostics may depend on them',
        'attempts.jsonl records attempts separately; it is outside this read scope',
      ],
      externalConsumers: 'unknown',
      concurrentProcesses: 'unknown',
      dependencyRelease: 'not-demonstrated',
    },
    space: { temporaryObservedBytes: null, recoverableBytes: null },
    diagnostics: [],
    conclusion: { relation: 'inconclusive', dispensability: 'undetermined' },
    limits: [
      'Experimental artifacts only; not historical provenance or full reporter-schema validation.',
      'Independent inventory and bounded reads are observations, not an atomic snapshot or continuous monitor.',
      'lstat/O_NOFOLLOW block recognized links; exotic Windows reparse tags and hostile path races are not certified.',
      'Reading may update access time. No consumers/process enumeration, regeneration or recoverable-space proof.',
    ],
  };
  if (
    !options ||
    typeof options.root !== 'string' ||
    !path.isAbsolute(options.root) ||
    /^[/\\]{2}/.test(options.root) ||
    /[\x00-\x1f\x7f]/.test(options.root) ||
    options.root.split(/[\\/]/).some((part) => part === '..' || part === '.') ||
    typeof options.experiment !== 'string' ||
    !EXPERIMENT.test(options.experiment) ||
    typeof options.runId !== 'string' ||
    !RUN.test(options.runId) ||
    typeof options.allowContent !== 'boolean'
  ) {
    result.diagnostics.push('explicit-experimental-scope-invalid');
    return result;
  }
  const root = path.resolve(options.root);
  const directory = options.experiment + '/tmp/validacao/' + options.runId;
  const relatives = [
    directory + '/run.json.tmp',
    directory + '/run.json',
    options.experiment + '/observacoes.json',
  ];
  const observedAt = (services.now || (() => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')))();
  try {
    const inventory = (services.inventory || inspect)(root, relatives);
    result.inventory = adaptInventory(inventory, {
      observedAt,
      resourceIds: ['reporter-intermediate', 'reporter-final', 'reporter-observations'],
    });
    if (
      !['complete', 'partial'].includes(result.inventory.status) ||
      result.inventory.resources.length !== 3
    )
      throw fault('inventory-incompatible');
    result.baseHead = inventory.worktree.head;
    if (result.inventory.status === 'partial') result.diagnostics.push('inventory-partial');
  } catch {
    result.diagnostics.push('inventory-unavailable-or-incompatible');
    return result;
  }

  const io = services.fs || fs;
  const parents = new Map();
  const opened = [];
  const contents = new Map();
  let unstable = false;
  function metadata(target) {
    let cursor = path.parse(target).root;
    const parts = target.slice(cursor.length).split(path.sep).filter(Boolean);
    let item = io.lstatSync(cursor, { bigint: true });
    for (const part of parts) {
      if (item.isSymbolicLink()) throw fault('link-in-path');
      if (!item.isDirectory()) throw fault('nondirectory-component');
      if (!item.ino || !item.dev) throw fault('identity-unavailable');
      if (parents.has(cursor) && !same(parents.get(cursor), item))
        throw fault('changed-during-observation');
      parents.set(cursor, item);
      cursor = path.join(cursor, part);
      item = io.lstatSync(cursor, { bigint: true });
    }
    if (item.isSymbolicLink()) throw fault('link-in-path');
    return item;
  }
  function validateFile(item) {
    if (!item.isFile()) throw fault('not-regular-file');
    if (!item.ino || !item.dev || item.nlink !== 1n) throw fault('identity-inadequate');
    if (item.size > BigInt(LIMIT_BYTES)) throw fault('byte-limit');
  }
  try {
    for (const relative of relatives) {
      const resource = {
        path: relative,
        exists: null,
        type: 'unknown',
        status: 'indeterminate',
        provenance: 'bounded-filesystem-observation',
      };
      result.resources.push(resource);
      try {
        const target = path.join(root, ...relative.split('/'));
        const before = metadata(target);
        resource.exists = true;
        resource.type = before.isFile() ? 'file' : before.isDirectory() ? 'directory' : 'other';
        validateFile(before);
        resource.identity = {
          device: String(before.dev),
          fileId: String(before.ino),
          hardlinks: String(before.nlink),
        };
        resource.bytes = Number(before.size);
        resource.modifiedAtNs = String(before.mtimeNs);
        resource.modifiedAtUtc = new Date(Number(before.mtimeNs / 1000000n)).toISOString();
        resource.changedAtNs = String(before.ctimeNs);
        if (!options.allowContent) {
          resource.status = 'metadata-only';
          continue;
        }
        const fd = io.openSync(
          target,
          fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0) | (fs.constants.O_NONBLOCK || 0)
        );
        const entry = { fd, target, resource, before };
        opened.push(entry);
        const actual = io.fstatSync(fd, { bigint: true });
        validateFile(actual);
        if (!same(before, actual)) throw fault('changed-during-observation');
        const buffer = Buffer.alloc(LIMIT_BYTES + 1);
        let count = 0;
        while (count < buffer.length) {
          const n = io.readSync(fd, buffer, count, buffer.length - count, null);
          if (!n) break;
          count += n;
        }
        if (count > LIMIT_BYTES) throw fault('byte-limit');
        if (BigInt(count) !== actual.size) throw fault('changed-during-observation');
        contents.set(relative, buffer.subarray(0, count));
        resource.status = 'read-awaiting-revalidation';
      } catch (error) {
        const code =
          error.observationCode || (error.code === 'ENOENT' ? 'file-absent' : 'read-unavailable');
        resource.status = code === 'file-absent' ? 'absent' : 'indeterminate';
        if (code === 'file-absent') resource.exists = false;
        resource.issue = code;
        result.diagnostics.push(code);
        contents.delete(relative);
        if (code === 'changed-during-observation') unstable = true;
      }
    }
    // Keep all read descriptors open until all three acquisitions are finished.
    for (const entry of opened) {
      if (entry.resource.issue) continue;
      try {
        if (
          !same(entry.before, io.fstatSync(entry.fd, { bigint: true })) ||
          !same(entry.before, metadata(entry.target))
        )
          throw fault('changed-during-observation');
        entry.resource.status = 'observed';
      } catch {
        unstable = true;
      }
    }
    for (const [target, before] of parents) {
      try {
        const after = io.lstatSync(target, { bigint: true });
        if (after.isSymbolicLink() || !same(before, after)) unstable = true;
      } catch {
        unstable = true;
      }
    }
  } finally {
    for (const { fd } of opened) {
      try {
        io.closeSync(fd);
      } catch {
        unstable = true;
      }
    }
  }
  if (unstable) {
    result.diagnostics.push('changed-during-observation');
    for (const resource of result.resources)
      if (resource.status === 'observed') resource.status = 'indeterminate';
    contents.clear();
  }
  if (!options.allowContent) result.diagnostics.push('content-reading-not-authorized');
  result.space.temporaryObservedBytes = result.resources[0]?.bytes ?? null;
  for (const resource of result.resources) {
    if (contents.has(resource.path)) resource.sha256 = sha256(contents.get(resource.path));
  }
  const [temporary, final, observation] = relatives.map((name) => contents.get(name));
  const parsed = [];
  for (const bytes of [temporary, final, observation]) {
    try {
      parsed.push(
        bytes ? JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) : null
      );
    } catch {
      parsed.push(null);
      result.diagnostics.push('json-or-utf8-invalid');
    }
  }
  if (temporary && final) {
    result.comparison.bytes = temporary.equals(final) ? 'equal' : 'different';
    const [a, b] = result.resources;
    if (a.identity.device === b.identity.device && a.identity.fileId === b.identity.fileId) {
      result.comparison.bytes = 'inconclusive';
      result.diagnostics.push('pair-identity-not-distinct');
    }
  }
  const [tempReport, finalReport, record] = parsed;
  if (
    [tempReport, finalReport].every(
      (value) =>
        value &&
        value.schemaVersion === 2 &&
        value.syntheticExperiment === true &&
        value.runId === options.runId
    )
  ) {
    result.comparison.reports = isDeepStrictEqual(tempReport, finalReport) ? 'equal' : 'different';
  } else result.diagnostics.push('experimental-report-association-unverified');

  // Record paths/text are inert declarations: never use them to select files or authenticate origin.
  const declaration =
    record &&
    record.experimentId === path.posix.basename(options.experiment) &&
    record.runId === options.runId &&
    record.artifactOrigin === 'intentionally-created-experiment' &&
    record.sequenceCompleted === true &&
    record.baseCommit === result.baseHead &&
    record.reporterSourceModified === false &&
    record.historicalTargetsUsed === false &&
    record.A?.returned === true &&
    record.A?.['run.json']?.exists === true &&
    record.A?.['run.json.tmp']?.exists === false &&
    record.B?.returned === false &&
    record.B?.['run.json']?.exists === true &&
    record.B?.['run.json.tmp']?.exists === true &&
    record.B?.error?.code === 'EPERM' &&
    record.B?.error?.syscall === 'rename' &&
    record.handle?.opened === true &&
    record.handle?.closed === true &&
    record.handle?.shareDelete === false &&
    record.finalIdentityPreservedFromA === true;
  if (declaration) {
    const matches = ['run.json.tmp', 'run.json'].every((name, index) => {
      const prior = record.afterHandleClosed?.[name];
      const current = result.resources[index];
      const coherentB = ['fileId', 'sizeBytes', 'modifiedAtNs'].every(
        (key) => record.B[name][key] === prior?.[key]
      );
      const coherentA =
        index !== 1 ||
        ['fileId', 'sizeBytes', 'modifiedAtNs'].every(
          (key) => record.A[name][key] === prior?.[key]
        );
      return (
        coherentA &&
        coherentB &&
        prior?.exists === true &&
        prior.fileId === current.identity?.fileId &&
        prior.sizeBytes === current.bytes &&
        prior.modifiedAtNs === current.modifiedAtNs &&
        record.comparison?.[index === 0 ? 'temporarySha256' : 'finalSha256'] === current.sha256
      );
    });
    result.producer.experiment = matches ? 'corroborated-declaration' : 'declaration-conflict';
    result.producer.volumeIdentityAcrossApis = 'not-equated-python-and-node-representations';
  }
  // Keep the final conclusion independent of assertions such as record.comparison.bytesEqual.
  if (result.producer.experiment !== 'corroborated-declaration')
    result.diagnostics.push('producer-provenance-insufficient-or-conflicting');
  result.conclusion.relation =
    result.comparison.bytes === 'equal'
      ? 'experimental-byte-duplication-observed'
      : result.comparison.bytes === 'different'
        ? 'different-content-preserve-both'
        : 'comparison-inconclusive';
  result.diagnostics = [...new Set(result.diagnostics)];
  if (!result.diagnostics.length && result.inventory.status === 'complete') {
    result.status = 'complete';
    result.exitCode = 0;
  }
  return result;
}

function main(args) {
  const options = { allowContent: false };
  const flags = { '--root': 'root', '--experiment': 'experiment', '--run-id': 'runId' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--allow-content' && !options.allowContent) options.allowContent = true;
    else {
      const key = flags[args[i]];
      if (!key || options[key] !== undefined || !args[i + 1] || args[i + 1].startsWith('--'))
        throw new Error();
      options[key] = args[++i];
    }
  }
  const result = evaluatePair(options);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exitCode = result.exitCode;
}
if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch {
    process.stdout.write(
      JSON.stringify({
        status: 'partial',
        exitCode: 2,
        cleanupAuthorization: 'none',
        diagnostics: ['arguments-or-observation-unavailable'],
      }) + '\n'
    );
    process.exitCode = 2;
  }
}
module.exports = { evaluatePair, LIMIT_BYTES };
