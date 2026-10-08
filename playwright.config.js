const { defineConfig } = require('@playwright/test');

const portText = process.env.PLAYWRIGHT_PORT || '5181';
if (!/^\d+$/.test(portText) || Number(portText) < 1024 || Number(portText) > 65535) {
  throw new Error('PLAYWRIGHT_PORT deve ser uma porta entre 1024 e 65535.');
}
if (Number(portText) === 5173) {
  throw new Error('PLAYWRIGHT_PORT deve ser diferente da porta habitual 5173.');
}
const baseURL = `http://127.0.0.1:${Number(portText)}`;

module.exports = defineConfig({
  globalSetup: require.resolve('./tests/confirmar-servidor-local.cjs'),
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'line',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: `npm run dev -- --config vite.test.config.cjs --port ${Number(portText)} --strictPort`,
    cwd: __dirname,
    url: `${baseURL}/__revisoes_local__/identity`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
