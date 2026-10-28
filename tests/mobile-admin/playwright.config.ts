import { resolve } from 'node:path';

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'mobile-admin.spec.ts',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4317',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
  },
  webServer: {
    command: 'node tests/mobile-admin/serve.mjs',
    cwd: resolve(__dirname, '../..'),
    url: 'http://127.0.0.1:4317',
    reuseExistingServer: !process.env.CI,
  },
});
