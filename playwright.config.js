import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  workers: 1,
  reporter: [['line']],
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
