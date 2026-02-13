import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3050',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'HOST=127.0.0.1 npm start',
    url: 'http://127.0.0.1:3050',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
