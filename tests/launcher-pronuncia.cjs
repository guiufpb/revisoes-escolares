'use strict';

// Execute with: node tests/launcher-pronuncia.cjs
// Uses only a dummy credential and a local /health server; never calls Azure.
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const portProbe = spawnSync(
  process.execPath,
  [
    '-e',
    "const server = require('node:net').createServer(); server.on('error', () => process.exit(1)); server.listen(5190, '127.0.0.1', () => server.close(() => process.exit(0)));",
  ],
  { timeout: 3000 }
);
assert.equal(
  portProbe.status,
  0,
  'Feche o gateway local antes de executar este teste (porta 5190).'
);
const fixtureRoot = path.join(projectRoot, 'output');
fs.mkdirSync(fixtureRoot, { recursive: true });
const fixture = fs.mkdtempSync(path.join(fixtureRoot, 'launcher-test-'));
const fakeBin = path.join(fixture, 'bin');
const noAzBin = path.join(fixture, 'no-az');
const dummyCredential = 'DUMMY_TEST_CREDENTIAL';
fs.mkdirSync(fakeBin);
fs.mkdirSync(noAzBin);

function writeFixture(name, contents, directory = fakeBin) {
  fs.writeFileSync(path.join(directory, name), contents);
}

writeFixture(
  'az.cmd',
  `@echo off\r\nif "%~1"=="account" (\r\n  if "%LAUNCHER_TEST_AUTH%"=="yes" exit /b 0\r\n  exit /b 1\r\n)\r\nif "%~1"=="login" (\r\n  echo login>>"%LAUNCHER_TEST_DIR%\\login-count.txt"\r\n  exit /b 0\r\n)\r\nif "%~1"=="cognitiveservices" (\r\n  if "%LAUNCHER_TEST_KEY_FAIL%"=="yes" exit /b 1\r\n  echo ${dummyCredential}\r\n  exit /b 0\r\n)\r\nexit /b 1\r\n`
);

const npmStub = `@echo off\r\nif "%~2"=="pronuncia:gateway" (\r\n  echo gateway>>"%LAUNCHER_TEST_DIR%\\gateway-count.txt"\r\n  "%LAUNCHER_TEST_NODE%" "%LAUNCHER_TEST_DIR%\\health.cjs"\r\n  exit /b %errorlevel%\r\n)\r\nif "%~2"=="interativo" (\r\n  if defined AZURE_SPEECH_KEY echo leak>>"%LAUNCHER_TEST_DIR%\\environment-leak.txt"\r\n  if defined AZURE_SPEECH_REGION echo leak>>"%LAUNCHER_TEST_DIR%\\environment-leak.txt"\r\n  echo interativo>>"%LAUNCHER_TEST_DIR%\\interativo-count.txt"\r\n  exit /b 0\r\n)\r\nexit /b 1\r\n`;
writeFixture('npm.cmd', npmStub);
writeFixture('npm.cmd', npmStub, noAzBin);

writeFixture(
  'health.cjs',
  `'use strict';\nconst fs = require('node:fs');\nconst http = require('node:http');\nfs.writeFileSync(process.env.LAUNCHER_TEST_DIR + '\\\\server-pid.txt', String(process.pid));\nhttp.createServer((request, response) => {\n  response.setHeader('Content-Type', 'application/json');\n  response.end(JSON.stringify({ ok: true, configured: Boolean(process.env.AZURE_SPEECH_KEY) && process.env.LAUNCHER_TEST_UNCONFIGURED !== 'yes' }));\n}).listen(5190, '127.0.0.1');\n`,
  fixture
);

function count(name) {
  const file = path.join(fixture, name);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).length : 0;
}

function runLauncher(overrides = {}, input = '\r\n', isolatedPath = false) {
  const environment = { ...process.env };
  delete environment.AZURE_SPEECH_KEY;
  delete environment.AZURE_SPEECH_REGION;
  const system32 = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32');
  environment.PATH = isolatedPath
    ? [noAzBin, system32, path.join(system32, 'WindowsPowerShell', 'v1.0')].join(path.delimiter)
    : [fakeBin, process.env.PATH].join(path.delimiter);
  Object.assign(environment, {
    LAUNCHER_TEST_DIR: fixture,
    LAUNCHER_TEST_NODE: process.execPath,
    LAUNCHER_TEST_AUTH: 'yes',
    LAUNCHER_TEST_KEY_FAIL: 'no',
    LAUNCHER_TEST_UNCONFIGURED: 'no',
    ...overrides,
  });
  const result = spawnSync(
    process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe',
    ['/d', '/c', 'call', path.join(projectRoot, 'abrir_ambiente_interativo.bat')],
    { cwd: projectRoot, env: environment, input, encoding: 'utf8', timeout: 20000 }
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(dummyCredential));
  return result.stdout + result.stderr;
}

function stopFixtureServer() {
  const pidFile = path.join(fixture, 'server-pid.txt');
  if (!fs.existsSync(pidFile)) return;
  const pid = Number(fs.readFileSync(pidFile, 'utf8'));
  fs.rmSync(pidFile);
  if (Number.isSafeInteger(pid) && pid > 0) {
    spawnSync('taskkill.exe', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
  }
}

try {
  const first = runLauncher();
  assert.match(first, /ok:true e configured:true/);
  assert.equal(count('gateway-count.txt'), 1);
  assert.equal(count('interativo-count.txt'), 1);

  const second = runLauncher();
  assert.match(second, /reutilizando/);
  assert.equal(count('gateway-count.txt'), 1);
  assert.equal(count('interativo-count.txt'), 2);

  stopFixtureServer();
  const withoutLogin = runLauncher({ LAUNCHER_TEST_AUTH: 'no' });
  assert.match(withoutLogin, /login Azure nao realizado/);
  assert.equal(count('gateway-count.txt'), 1);
  assert.equal(count('interativo-count.txt'), 3);
  assert.equal(count('login-count.txt'), 0);

  const failedKey = runLauncher({ LAUNCHER_TEST_KEY_FAIL: 'yes' });
  assert.match(failedKey, /nao foi possivel recuperar a chave/);
  assert.equal(count('gateway-count.txt'), 1);
  assert.equal(count('interativo-count.txt'), 4);

  const withoutCli = runLauncher({}, '\r\n', true);
  assert.match(withoutCli, /Azure CLI \(az\) nao encontrada/);
  assert.equal(count('interativo-count.txt'), 5);

  const unconfigured = runLauncher({ LAUNCHER_TEST_UNCONFIGURED: 'yes' });
  assert.match(unconfigured, /configured:false/);
  assert.equal(count('gateway-count.txt'), 2);
  assert.equal(count('interativo-count.txt'), 6);

  const occupied = runLauncher();
  assert.match(occupied, /configured:false/);
  assert.equal(count('gateway-count.txt'), 2);
  assert.equal(count('interativo-count.txt'), 7);

  stopFixtureServer();
  const afterLogin = runLauncher({ LAUNCHER_TEST_AUTH: 'no' }, 'L\r\n');
  assert.match(afterLogin, /ok:true e configured:true/);
  assert.equal(count('login-count.txt'), 1);
  assert.equal(count('gateway-count.txt'), 3);
  assert.equal(count('interativo-count.txt'), 8);
  assert.equal(count('environment-leak.txt'), 0);

  console.log('Launcher: 8 cenarios aprovados; credencial ficticia ausente da saida e do Vite.');
} finally {
  stopFixtureServer();
  const safeRoot = path.resolve(fixtureRoot) + path.sep;
  if (path.resolve(fixture).startsWith(safeRoot)) {
    fs.rmSync(fixture, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}
