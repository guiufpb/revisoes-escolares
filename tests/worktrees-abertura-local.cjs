'use strict';

// Real local HTTP/Vite and Windows PowerShell; no Azure, microphone or foreign process shutdown.
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { IDENTITY_PATH, identityForRoot } = require('../scripts/identidade-ambiente-local.cjs');

const projectRoot = path.resolve(__dirname, '..');
const temporaryParent = path.join(projectRoot, 'tmp');
fs.mkdirSync(temporaryParent, { recursive: true });
const fixture = fs.mkdtempSync(path.join(temporaryParent, 'abertura-worktrees-'));
const first = path.join(fixture, 'Cópia um com espaços');
const second = path.join(fixture, 'Revisões segunda cópia');
let scriptIndex = 0;
let passed = 0;

function makeCopy(root) {
  fs.mkdirSync(path.join(root, 'ambiente_interativo'), { recursive: true });
  fs.mkdirSync(path.join(root, 'node_modules/vite/bin'), { recursive: true });
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'revisoes-escolares', private: true })
  );
  fs.writeFileSync(path.join(root, 'vite.config.js'), 'module.exports = {};');
  fs.writeFileSync(
    path.join(root, 'ambiente_interativo/index.html'),
    '<!doctype html><title>Cópia local</title><p>Ambiente local</p>'
  );
  fs.writeFileSync(
    path.join(root, 'node_modules/vite/bin/vite.js'),
    `import(${JSON.stringify(pathToFileURL(path.join(projectRoot, 'node_modules/vite/bin/vite.js')).href)});`
  );
  fs.writeFileSync(
    path.join(root, 'scripts/preparar-pronuncia-azure.ps1'),
    `$selected = Split-Path -Parent $PSScriptRoot\n[IO.File]::AppendAllText($env:WORKTREES_PREPARATIONS, $selected + [Environment]::NewLine)\nif ($env:WORKTREES_FAIL_PRONUNCIATION -eq 'yes') { throw 'Gateway simulado indisponivel' }\n`
  );
  fs.mkdirSync(path.join(root, 'MINHAS_REVISOES_LOCAIS'));
  fs.writeFileSync(
    path.join(root, 'MINHAS_REVISOES_LOCAIS/catalogo-local.json'),
    '{"private":"catalogo privado"}'
  );
}
makeCopy(first);
makeCopy(second);

function runPowerShell(code, overrides = {}) {
  const file = path.join(fixture, `scenario-${++scriptIndex}.ps1`);
  fs.writeFileSync(
    file,
    '\ufeff' +
      `$ErrorActionPreference = 'Stop'\n. $env:WORKTREES_HELPER\n$first = $env:WORKTREES_FIRST\n$second = $env:WORKTREES_SECOND\nfunction Assert-Equal($Actual, $Expected) { if ($Actual -cne $Expected) { throw "Esperado: $Expected; recebido: $Actual" } }\n` +
      code
  );
  return new Promise((resolve, reject) => {
    const child = spawn(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', file],
      {
        cwd: projectRoot,
        windowsHide: true,
        env: {
          ...process.env,
          WORKTREES_HELPER: path.join(projectRoot, 'scripts/abrir-ambiente-local.ps1'),
          WORKTREES_FIRST: first,
          WORKTREES_SECOND: second,
          WORKTREES_PREPARATIONS: path.join(fixture, 'preparations.txt'),
          ...overrides,
        },
      }
    );
    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
    });
    child.stderr.on('data', (data) => {
      output += data;
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('PowerShell excedeu o limite.\n' + output));
    }, 30000);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('exit', (status) => {
      clearTimeout(timer);
      resolve({ status, output });
    });
  });
}

async function psOK(code, overrides) {
  const result = await runPowerShell(code, overrides);
  assert.equal(result.status, 0, result.output);
  return result.output;
}

async function scenario(name, task) {
  await task();
  passed++;
  console.log(`PASS ${name}`);
}

async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server.address().port;
}

async function close(server) {
  await new Promise((resolve) => server.close(resolve));
}

async function main() {
  const { createServer } = await import('vite');
  await scenario(
    'identidade deterministica, duas raizes, espacos, acentos e caixa no Windows',
    async () => {
      assert.deepEqual(identityForRoot(first), identityForRoot(path.join(first, '.')));
      assert.notEqual(identityForRoot(first).copyId, identityForRoot(second).copyId);
      if (process.platform === 'win32')
        assert.deepEqual(identityForRoot(first), identityForRoot(first.toUpperCase()));
      assert.deepEqual(Object.keys(identityForRoot(first)).sort(), [
        'application',
        'copyId',
        'schema',
      ]);
      assert.doesNotMatch(JSON.stringify(identityForRoot(first)), /Users|Cópia|Revisões|[A-Z]:\\/);
    }
  );

  await scenario(
    'raiz valida, arquivos essenciais, dependencias, projeto estranho e raiz ausente',
    async () => {
      const output = await psOK(`
Assert-Equal (Resolve-StudyRoot $first 'Padrao') $first
Assert-Equal (Resolve-StudyRoot $second 'Padrao') $second
foreach ($file in @('package.json','vite.config.js','ambiente_interativo/index.html','node_modules/vite/bin/vite.js')) {
    $target = Join-Path $first $file
    Move-Item -LiteralPath $target -Destination ($target + '.saved')
    try { Assert-Equal (Invoke-StudyOpening -Root $first -CheckOnly) 1 }
    finally { Move-Item -LiteralPath ($target + '.saved') -Destination $target }
}
$packagePath = Join-Path $first 'package.json'
$original = [IO.File]::ReadAllText($packagePath)
try {
    [IO.File]::WriteAllText($packagePath, '{"name":"outro-projeto","private":true}')
    Assert-Equal (Invoke-StudyOpening -Root $first -CheckOnly) 1
    [IO.File]::WriteAllText($packagePath, '{')
    Assert-Equal (Invoke-StudyOpening -Root $first -CheckOnly) 1
} finally { [IO.File]::WriteAllText($packagePath, $original) }
Assert-Equal (Invoke-StudyOpening -Root (Join-Path $first 'inexistente') -CheckOnly) 1
Assert-Equal (Invoke-StudyOpening -Root $first -Browser Chromium -CheckOnly) 1
`);
      assert.match(output, /Dependencias ausentes/);
      assert.match(output, /nao pertence ao projeto/);
    }
  );

  // Exercise the actual endpoint in two separately served roots, without occupying 5173.
  for (const root of [first, second]) {
    const vite = await createServer({
      root,
      configFile: path.join(projectRoot, 'vite.config.js'),
      server: { port: 0, strictPort: true },
      logLevel: 'silent',
    });
    try {
      await vite.listen();
      const port = vite.httpServer.address().port;
      const origin = `http://127.0.0.1:${port}`;
      await scenario(
        `Vite identifica a raiz ${root === first ? '1' : '2'} sem caminho ou dados privados`,
        async () => {
          const response = await fetch(origin + IDENTITY_PATH);
          assert.equal(response.status, 200);
          assert.equal(response.headers.get('cache-control'), 'no-store');
          assert.deepEqual(await response.json(), identityForRoot(root));
          for (const resource of [
            '/MINHAS_REVISOES_LOCAIS/catalogo-local.json',
            '/minhas_revisoes_locais/catalogo-local.json',
            '/%4dINHAS_REVISOES_LOCAIS/catalogo-local.json',
            '/tmp/preflight-preservacao.json',
            '/output/backup.json',
            '/.codex/config.toml',
            '/.git/config',
            '/@fs/' +
              path.join(root, 'MINHAS_REVISOES_LOCAIS/catalogo-local.json').replaceAll('\\', '/'),
          ]) {
            const denied = await fetch(origin + resource);
            assert.equal(denied.status, 403, resource);
            assert.doesNotMatch(await denied.text(), /catalogo privado/);
          }
          assert.equal(
            (
              await fetch(origin + IDENTITY_PATH, {
                method: 'POST',
                body: JSON.stringify({ root: second, command: 'echo unsafe' }),
              })
            ).status,
            405
          );
          assert.equal(
            (await fetch(origin + IDENTITY_PATH, { headers: { Origin: 'https://example.com' } }))
              .status,
            403
          );
          const foreignHostStatus = await new Promise((resolve, reject) => {
            http
              .get(origin + IDENTITY_PATH, { headers: { Host: 'example.com' } }, (res) => {
                res.resume();
                resolve(res.statusCode);
              })
              .on('error', reject);
          });
          assert.equal(foreignHostStatus, 403);
          assert.equal((await fetch(origin + IDENTITY_PATH, { method: 'HEAD' })).status, 200);
        }
      );
      await scenario(
        `PowerShell reconhece a mesma copia e recusa a outra (raiz ${root === first ? '1' : '2'})`,
        async () => {
          await psOK(
            `
$studyPort = [int]$env:WORKTREES_PORT
$localOrigin = "http://127.0.0.1:$studyPort"
$identityUri = "$localOrigin/__revisoes_local__/identity"
Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity ${root === first ? '$first' : '$second'})) 'same'
Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity ${root === first ? '$second' : '$first'})) 'other'
Assert-Equal (Invoke-StudyOpening -Root ${root === first ? '$second' : '$first'} -CheckOnly) 1
`,
            { WORKTREES_PORT: String(port) }
          );
        }
      );
      await scenario('strictPort falha em porta ocupada e nao escolhe alternativa', async () => {
        const contender = await createServer({
          root: second,
          configFile: path.join(projectRoot, 'vite.config.js'),
          server: { port, strictPort: true },
          logLevel: 'silent',
        });
        try {
          await assert.rejects(contender.listen(), /already in use/);
        } finally {
          await contender.close();
        }
        assert.deepEqual(await (await fetch(origin + IDENTITY_PATH)).json(), identityForRoot(root));
      });
    } finally {
      await vite.close();
    }
  }

  const responses = [
    ['endpoint ausente', 404, 'text/plain', 'ausente'],
    ['HTTP estranho', 200, 'text/html', '<html>outro servidor</html>'],
    ['JSON invalido', 200, 'application/json', '{'],
    [
      'schema errado',
      200,
      'application/json',
      JSON.stringify({ ...identityForRoot(first), schema: 2 }),
    ],
    [
      'schema em string',
      200,
      'application/json',
      JSON.stringify({ ...identityForRoot(first), schema: '1' }),
    ],
    [
      'identificador invalido',
      200,
      'application/json',
      JSON.stringify({ ...identityForRoot(first), copyId: '../other' }),
    ],
    [
      'campos extras',
      200,
      'application/json',
      JSON.stringify({ ...identityForRoot(first), root: 'private' }),
    ],
    ['redirecionamento', 302, 'application/json', JSON.stringify(identityForRoot(first))],
  ];
  for (const [name, status, type, body] of responses) {
    const server = http.createServer((_request, response) => {
      response.writeHead(status, { 'Content-Type': type, Location: '/elsewhere' });
      response.end(body);
    });
    const port = await listen(server);
    try {
      await scenario(
        `identidade indisponivel: ${name}; nenhum navegador ou pronuncia`,
        async () => {
          const output = await psOK(
            `
$studyPort = [int]$env:WORKTREES_PORT
$identityUri = "http://127.0.0.1:$studyPort/__revisoes_local__/identity"
function Open-StudyBrowser { throw 'NAO_DEVERIA_ABRIR' }
function Prepare-StudyPronunciation { throw 'NAO_DEVERIA_PREPARAR' }
Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity $first)) 'unknown'
Assert-Equal (Invoke-StudyOpening -Root $first) 1
`,
            { WORKTREES_PORT: String(port) }
          );
          assert.match(output, /identidade indisponivel/);
          assert.doesNotMatch(output, /NAO_DEVERIA/);
        }
      );
    } finally {
      await close(server);
    }
  }

  const probe = net.createServer();
  const explicitPort = await listen(probe);
  await close(probe);
  await scenario(
    'porta livre e partida real do auxiliar em raiz legada com espacos/acentos',
    async () => {
      await psOK(
        `
$studyPort = [int]$env:WORKTREES_PORT
$localOrigin = "http://127.0.0.1:$studyPort"
$identityUri = "$localOrigin/__revisoes_local__/identity"
Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity $first)) 'free'
$own = Start-StudyServer $first
try {
    Wait-StudyServer (Get-ExpectedIdentity $first) $own
    Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity $first)) 'same'
    Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity $second)) 'other'
    $html = Invoke-WebRequest -UseBasicParsing "$localOrigin/ambiente_interativo/index.html"
    Assert-Equal $html.StatusCode 200
} finally { if (-not $own.HasExited) { $own.Kill(); $own.WaitForExit() }; $own.Dispose() }
`,
        { WORKTREES_PORT: String(explicitPort) }
      );
    }
  );

  await scenario('partidas simultaneas: somente um Vite ocupa a porta explicita', async () => {
    const probe = net.createServer();
    const port = await listen(probe);
    await close(probe);
    assert.ok(![5173, 5187, 5190].includes(port));
    await psOK(
      `
$studyPort = [int]$env:WORKTREES_PORT
$localOrigin = "http://127.0.0.1:$studyPort"
$identityUri = "$localOrigin/__revisoes_local__/identity"
$one = $null
$two = $null
try {
    $one = Start-StudyServer $first
    $two = Start-StudyServer $first
    $limit = (Get-Date).AddSeconds(10)
    do {
        $one.Refresh(); $two.Refresh()
        if ($one.HasExited -or $two.HasExited) { break }
        Start-Sleep -Milliseconds 100
    } while ((Get-Date) -lt $limit)
    Assert-Equal ($one.HasExited -xor $two.HasExited) $true
    $winner = $one
    $loser = $two
    if ($one.HasExited) { $winner = $two; $loser = $one }
    if ($loser.ExitCode -eq 0) { throw 'Partida concorrente deveria falhar' }
    Wait-StudyServer (Get-ExpectedIdentity $first) $winner
    Assert-Equal (Get-StudyServerState (Get-ExpectedIdentity $first)) 'same'
    function Start-StudyServer { throw 'NAO_DEVERIA_INICIAR' }
    function Open-StudyBrowser { param($Root, $Browser); Assert-Equal $Root $first }
    Assert-Equal (Invoke-StudyOpening -Root $first -SkipPronunciation) 0
} finally {
    foreach ($own in @($one, $two)) {
        if ($null -ne $own) {
            $own.Refresh()
            if (-not $own.HasExited) { $own.Kill(); $own.WaitForExit() }
            $own.Dispose()
        }
    }
}
`,
      { WORKTREES_PORT: String(port) }
    );
  });

  await scenario('corrida: porta ocupada depois do preflight nao abre outra copia', async () => {
    const occupied = net.createServer();
    const port = await listen(occupied);
    try {
      const output = await psOK(
        `
$studyPort = [int]$env:WORKTREES_PORT
$identityUri = "http://127.0.0.1:$studyPort/__revisoes_local__/identity"
$own = Start-StudyServer $first
try {
    $own.WaitForExit(10000) | Out-Null
    Assert-Equal $own.HasExited $true
    if ($own.ExitCode -eq 0) { throw 'Corrida deveria falhar' }
    try { Wait-StudyServer (Get-ExpectedIdentity $first) $own; throw 'Nao deveria iniciar' }
    catch { if ($_.Exception.Message -notmatch 'strictPort') { throw } }
} finally { if (-not $own.HasExited) { $own.Kill(); $own.WaitForExit() }; $own.Dispose() }
`,
        { WORKTREES_PORT: String(port) }
      );
      assert.doesNotMatch(output, /Nao deveria iniciar/);
      assert.equal(occupied.listening, true);
    } finally {
      await close(occupied);
    }
  });

  await scenario(
    'mesma copia reutilizada; pronuncia da raiz selecionada e falha opcional',
    async () => {
      const output = await psOK(
        `
$script:opened = 0
function Get-StudyServerState { return 'same' }
function Start-StudyServer { throw 'NAO_DEVERIA_INICIAR' }
function Open-StudyBrowser { param($Root, $Browser); Assert-Equal $Root $second; $script:opened++ }
Assert-Equal (Invoke-StudyOpening -Root $second) 0
Assert-Equal (Invoke-StudyOpening -Root $second -Browser Padrao -PronunciationOnly) 0
$env:WORKTREES_FAIL_PRONUNCIATION = 'yes'
Assert-Equal (Invoke-StudyOpening -Root $second) 0
Assert-Equal $script:opened 2
`,
        {}
      );
      assert.match(output, /Pronuncia opcional indisponivel/);
      const preparations = fs
        .readFileSync(path.join(fixture, 'preparations.txt'), 'utf8')
        .trim()
        .split(/\r?\n/);
      assert.deepEqual(preparations, [second, second, second]);
    }
  );

  await scenario(
    'revalidacao depois da pronuncia impede troca de servidor antes do navegador',
    async () => {
      const output = await psOK(`
$script:checks = 0
function Get-StudyServerState { $script:checks++; if ($script:checks -eq 1) { return 'same' }; return 'other' }
function Prepare-StudyPronunciation { }
function Open-StudyBrowser { throw 'NAO_DEVERIA_ABRIR' }
Assert-Equal (Invoke-StudyOpening -Root $first) 1
`);
      assert.match(output, /outra copia/);
      assert.doesNotMatch(output, /NAO_DEVERIA_ABRIR/);
    }
  );

  await scenario('wrappers delegam identidade, raiz e Chromium ao mesmo auxiliar', async () => {
    for (const file of [
      'abrir_ambiente_interativo.bat',
      'abrir_chromium_ambiente_interativo.bat',
    ]) {
      const wrapper = fs.readFileSync(path.join(projectRoot, file), 'utf8');
      assert.match(wrapper, /scripts\\abrir-ambiente-local\.ps1/);
      assert.match(wrapper, /-Raiz "%~dp0\."/);
      assert.doesNotMatch(wrapper, /npm run|Invoke-WebRequest|taskkill|5174/);
      if (file.includes('chromium')) assert.match(wrapper, /-Navegador Chromium/);
    }
  });
  await scenario('Playwright valida porta configuravel e preserva a porta habitual', async () => {
    for (const port of ['5173', '0', '1023', '65536', '5181;echo unsafe', 'localhost']) {
      const invalid = spawnSync(process.execPath, ['-e', "require('./playwright.config.js')"], {
        cwd: projectRoot,
        env: { ...process.env, PLAYWRIGHT_PORT: port },
        encoding: 'utf8',
      });
      assert.notEqual(invalid.status, 0, port);
      assert.match(invalid.stderr, /PLAYWRIGHT_PORT/);
    }
    const valid = spawnSync(
      process.execPath,
      [
        '-e',
        "const c=require('./playwright.config.js'); console.log(JSON.stringify({baseURL:c.use.baseURL,server:c.webServer}));",
      ],
      {
        cwd: projectRoot,
        env: { ...process.env, PLAYWRIGHT_PORT: '5189' },
        encoding: 'utf8',
      }
    );
    assert.equal(valid.status, 0, valid.stderr);
    const config = JSON.parse(valid.stdout);
    assert.equal(config.baseURL, 'http://127.0.0.1:5189');
    assert.equal(config.server.reuseExistingServer, false);
    assert.equal(config.server.cwd, projectRoot);
    assert.match(config.server.command, /--port 5189 --strictPort/);
  });
  await scenario(
    'Playwright recusa HTTP estranho na porta de teste em vez de reutilizar',
    async () => {
      const unknown = http.createServer((_request, response) => response.end('unknown server'));
      const port = await listen(unknown);
      try {
        const result = await new Promise((resolve, reject) => {
          const child = spawn(
            process.execPath,
            [
              path.join(projectRoot, 'node_modules/@playwright/test/cli.js'),
              'test',
              'tests/infra-abertura-local.spec.js',
              '--output',
              path.join(fixture, 'playwright-ocupado'),
            ],
            {
              cwd: projectRoot,
              windowsHide: true,
              env: { ...process.env, PLAYWRIGHT_PORT: String(port) },
            }
          );
          let output = '';
          child.stdout.on('data', (data) => {
            output += data;
          });
          child.stderr.on('data', (data) => {
            output += data;
          });
          const timer = setTimeout(() => {
            child.kill();
            reject(new Error('Playwright nao recusou servidor ocupado.'));
          }, 15000);
          child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
          });
          child.on('exit', (status) => {
            clearTimeout(timer);
            resolve({ status, output });
          });
        });
        assert.notEqual(result.status, 0, result.output);
        assert.match(result.output, /already used/);
        assert.doesNotMatch(result.output, /identidade confirmada/);
        assert.equal(unknown.listening, true);
      } finally {
        await close(unknown);
      }
    }
  );
  console.log(`Abertura/worktrees: ${passed} cenarios aprovados; sem Azure real ou microfone.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (path.resolve(fixture).startsWith(path.resolve(temporaryParent) + path.sep))
      fs.rmSync(fixture, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  });
