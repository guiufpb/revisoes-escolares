const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173/ambiente_interativo/index.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
