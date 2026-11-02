'use strict';

// Metadata only. Do not import project collectors or execute inspected sources.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const HELP =
  'Uso: node scripts/validacao/inventario-seguro.cjs --root RAIZ_ABSOLUTA --path CAMINHO_RELATIVO [--path OUTRO]\nSomente metadados e indice Git; sem recursao, conteudos, hashes ou manutencao.\n';

function git(root, args) {
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_'))
  );
  Object.assign(env, {
    GIT_OPTIONAL_LOCKS: '0',
    GIT_TERMINAL_PROMPT: '0',
    GIT_NO_LAZY_FETCH: '1',
  });
  return execFileSync(
    'git',
    [
      '--no-optional-locks',
      '-c',
      'core.fsmonitor=false',
      '-C',
      root,
      ...(args[0] === 'ls-files' && !args.at(-1).startsWith(':(icase,literal)')
        ? ['--literal-pathspecs']
        : []),
      ...args,
    ],
    {
      env,
      encoding: 'utf8',
      shell: false,
      windowsHide: true,
      timeout: 5000,
      maxBuffer: 65536,
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
}

function inspect(root, resources, services = {}) {
  const stat = services.lstat || fs.lstatSync;
  const query = services.git || git;
  const canonical = services.realpath || fs.realpathSync.native;
  const platform = services.platform || process.platform;
  const scalar = (args) => query(absolute, args).replace(/\r?\n$/, '');
  if (typeof root === 'string' && /^[/\\]{2}/.test(root))
    throw new Error('Raiz UNC ou de dispositivo nao suportada.');
  if (process.platform === 'win32' && (typeof root !== 'string' || !/^[a-z]:[\\/]/i.test(root)))
    throw new Error('Raiz Windows exige letra de unidade absoluta.');
  if (typeof root !== 'string' || !path.isAbsolute(root) || /[\x00-\x1f]/.test(root))
    throw new Error('Raiz absoluta obrigatoria.');
  if (!Array.isArray(resources) || !resources.length || resources.length > 100)
    throw new Error('Informe de 1 a 100 caminhos explicitos.');
  const absolute = path.resolve(root);
  function metadata(target) {
    let current = path.parse(target).root;
    const parts = target.slice(current.length).split(path.sep).filter(Boolean);
    let item = stat(current);
    if (item.isSymbolicLink()) return { type: 'link', blocked: true };
    for (const part of parts) {
      current = path.join(current, part);
      try {
        item = stat(current);
      } catch (error) {
        return error.code === 'ENOENT'
          ? { type: 'absent', exists: false }
          : { type: 'indeterminate', issue: 'metadata-unavailable' };
      }
      if (item.isSymbolicLink()) return { type: 'link', blocked: true };
    }
    return {
      type: item.isFile() ? 'file' : item.isDirectory() ? 'directory' : 'other',
      exists: true,
      item,
    };
  }
  const base = metadata(absolute);
  if (base.type !== 'directory')
    throw new Error('Raiz indisponivel ou vinculada; inspecao recusada.');
  const administrative = metadata(path.join(absolute, '.git'));
  if (!['file', 'directory'].includes(administrative.type))
    throw new Error('Raiz deve ser uma worktree explicita, sem vinculo em .git.');
  let repository;
  try {
    const top = scalar(['rev-parse', '--show-toplevel']);
    if (canonical(top) !== canonical(absolute)) throw new Error('not-root');
    const head = scalar(['rev-parse', '--verify', 'HEAD']);
    if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(head)) throw new Error('invalid-head');
    const branch = scalar(['rev-parse', '--abbrev-ref', 'HEAD']);
    repository = {
      label: path.basename(absolute),
      head,
      branch: branch === 'HEAD' ? null : branch,
      detached: branch === 'HEAD',
      provenance: 'git',
    };
  } catch {
    throw new Error('Consulta Git indisponivel ou raiz nao corresponde a worktree.');
  }

  const results = resources.map((relative) => {
    if (
      typeof relative !== 'string' ||
      !relative ||
      relative.length > 2048 ||
      /[\x00-\x1f\x7f:*?"<>|]/.test(relative) ||
      path.posix.isAbsolute(relative) ||
      path.win32.isAbsolute(relative) ||
      relative.split(/[\\/]/).some((p) => p === '..' || (/[. ]$/.test(p) && p !== '.'))
    )
      return { path: '(invalid)', type: 'indeterminate', issue: 'invalid-relative-path' };
    const parts = relative.split(/[\\/]/).filter((p) => p && p !== '.');
    // Git administration is not a resource to inspect (shared metadata may live elsewhere).
    if (parts.some((p) => p.toLowerCase() === '.git'))
      return { path: relative, type: 'indeterminate', issue: 'git-administration-protected' };
    const target = path.resolve(absolute, ...parts);
    const within = path.relative(absolute, target);
    if (within === '..' || within.startsWith('..' + path.sep) || path.isAbsolute(within))
      return { path: '(invalid)', type: 'indeterminate', issue: 'outside-root' };
    const found = metadata(target);
    const result = {
      path: parts.join('/') || '.',
      type: found.type,
      provenance: ['filesystem'],
      git: 'unverified',
    };
    if (found.exists !== undefined) result.exists = found.exists;
    if (found.blocked) return { ...result, issue: 'link-in-path-not-followed' };
    if (found.issue) return { ...result, issue: found.issue };
    if (found.type === 'file') result.bytes = found.item.size;
    try {
      // Directory contents are deliberately never enumerated, even via Git's index.
      if (found.type !== 'directory') {
        const name = parts.join('/');
        const pattern = platform === 'win32' ? ':(icase,literal)' + name : name;
        const tracked = query(absolute, ['ls-files', '-z', '--', pattern]);
        if (tracked && !tracked.endsWith('\0')) throw new Error('invalid-index-output');
        const candidates = tracked.split('\0').filter(Boolean);
        let matches = 0;
        for (const candidate of candidates) {
          if (candidate === name) {
            matches++;
            continue;
          }
          if (platform !== 'win32' || candidate.toLowerCase() !== name.toLowerCase()) continue;
          if (candidate.split('/').some((p) => p === '..' || p.toLowerCase() === '.git'))
            throw new Error('invalid-index-path');
          const otherPath = path.join(absolute, ...candidate.split('/'));
          const other = metadata(otherPath);
          if (found.type !== 'file' || other.type !== 'file' || !found.item.ino || !other.item.ino)
            throw Object.assign(new Error(), { inventoryIssue: 'case-correspondence-unresolved' });
          if (other.item.dev !== found.item.dev || other.item.ino !== found.item.ino) continue;
          // Both object identity and canonical spelling are required: inode alone also
          // matches hardlinks. Never infer case-insensitivity from Windows or Git config.
          if (canonical(otherPath) !== canonical(target))
            throw Object.assign(new Error(), { inventoryIssue: 'case-correspondence-unresolved' });
          matches++;
        }
        if (matches > 1)
          throw Object.assign(new Error(), { inventoryIssue: 'case-correspondence-unresolved' });
        if (matches === 1) result.git = 'tracked';
      }
      if (result.git !== 'tracked') {
        try {
          query(absolute, ['check-ignore', '-q', '--', parts.join('/') || '.']);
          result.git = 'ignored';
        } catch (error) {
          if (error.status !== 1) throw error;
          result.git = found.type === 'directory' ? 'directory-contents-unverified' : 'untracked';
        }
      }
      result.provenance.push('git-index-or-ignore');
    } catch (error) {
      result.git = 'indeterminate';
      result.issue =
        error.inventoryIssue === 'case-correspondence-unresolved'
          ? error.inventoryIssue
          : 'git-query-unavailable';
    }
    return result;
  });
  const partial = results.some((result) => result.issue);
  return {
    status: partial ? 'partial' : 'complete',
    exitCode: partial ? 2 : 0,
    worktree: repository,
    resources: results,
    limits: [
      'Root label only; absolute paths omitted.',
      'Working tree changes, stashes, consumers and directory contents not inspected.',
      'No file contents read. No regeneration, redundancy or disposability inferred.',
      'Symlinks/junctions reported by lstat blocked; concurrent path replacement and exotic reparse tags are not certified.',
    ],
  };
}

function main(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write(HELP);
    return;
  }
  let root;
  const resources = [];
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i],
      value = args[i + 1];
    if (!value || value.startsWith('--')) throw new Error('Opcao ou valor invalido.');
    if (flag === '--root' && root === undefined) root = value;
    else if (flag === '--path') resources.push(value);
    else throw new Error('Opcao desconhecida ou repetida.');
  }
  const report = inspect(root, resources);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exitCode = report.exitCode;
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch {
    process.stdout.write(
      JSON.stringify({ status: 'fatal', exitCode: 1, issue: 'arguments-root-or-git-unavailable' }) +
        '\n'
    );
    process.stderr.write(
      'Inventario recusado: argumentos, raiz ou consulta indisponiveis. Use --help.\n'
    );
    process.exitCode = 1;
  }
}
module.exports = { inspect };
