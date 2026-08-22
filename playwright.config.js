import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  workers: 1,
  // CI 下偶发 flaky 测试自动重试（本地不重试，便于定位真问题）
  retries: process.env.CI ? 2 : 0,
  reporter: [['line']],
  use: {
    ...devices['Desktop Chrome'],
    launchOptions: { args: ['--no-sandbox'] },
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
