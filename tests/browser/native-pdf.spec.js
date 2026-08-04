import { expect, test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIXTURE_PATH = path.join(ROOT, 'tests/fixtures/schedule.html');
const FIXTURE_URL = 'http://zhjw.scu.edu.cn/student/courseSelect/thisSemesterCurriculum/index';
const USERSCRIPT_PATH = path.join(ROOT, 'urppp.user.js');

async function loadScheduleFixture(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const values = new Map([
      ['urppp_auto_update_check_v1', false],
      ['urppp_theme_v3', 'default'],
      ['urppp_skin_v1', 'apple'],
    ]);
    window.unsafeWindow = window;
    window.GM_getValue = (key, fallback) => (values.has(key) ? values.get(key) : fallback);
    window.GM_setValue = (key, value) => values.set(key, value);
    window.GM_addStyle = (css) => {
      const style = document.createElement('style');
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
      return style;
    };
    window.GM_xmlhttpRequest = (options) => {
      if (options && typeof options.onerror === 'function') options.onerror(new Error('network disabled in fixture'));
    };
  });
  await page.route('http://zhjw.scu.edu.cn/**', (route) => route.fulfill({
    path: FIXTURE_PATH,
    contentType: 'text/html; charset=utf-8',
  }));
  await page.goto(FIXTURE_URL);
  await page.addScriptTag({ path: USERSCRIPT_PATH });
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  await expect(page.locator('html')).toHaveClass(/urppp-ready/);
  return pageErrors;
}

test('native PDF capture removes theme residue and restores it after every export', async ({ page }) => {
  const pageErrors = await loadScheduleFixture(page);
  const card = page.locator('#courseTable .class_div').first();
  const before = await card.evaluate((element) => ({
    radius: getComputedStyle(element).borderRadius,
    shadow: getComputedStyle(element).boxShadow,
    style: element.getAttribute('style'),
  }));
  expect(before.radius).not.toBe('0px');

  const exportOnce = async (expectedCount) => {
    await page.locator('#urppp-native-schedule-export > .urppp-export-trigger').click();
    await page.locator('#urppp-native-schedule-export [data-export-type="pdf"]').click();
    await expect.poll(() => page.evaluate(() => window.__captureHistory.length)).toBe(expectedCount);
    await expect(page.locator('#urppp-native-schedule-export > .urppp-export-trigger')).toBeEnabled();
  };

  await exportOnce(1);
  const capture = await page.evaluate(() => window.__captureHistory[0]);
  expect(capture.tableBackground).toBe('rgba(0, 0, 0, 0)');
  expect(capture.cellBackground).toBe('rgba(0, 0, 0, 0)');
  expect(capture.cardRadius).toBe('0px');
  expect(capture.cardShadow).toBe('none');
  expect(capture.cardLeftPriority).toBe('');

  const restoredImmediately = await card.evaluate((element) => ({
    radius: getComputedStyle(element).borderRadius,
    style: element.getAttribute('style'),
  }));
  expect(restoredImmediately).toEqual({ radius: before.radius, style: before.style });
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).boxShadow)).toBe(before.shadow);
  await expect(page.locator('[data-urppp-pdf-hidden]')).toHaveCount(0);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);

  await exportOnce(2);
  expect(await page.evaluate(() => window.__captureHistory[1])).toEqual(capture);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test('@visual themed schedule fixture remains stable', async ({ page }) => {
  const pageErrors = await loadScheduleFixture(page);
  await expect(page.locator('#mycoursetable')).toHaveScreenshot('schedule-themed.png', {
    animations: 'disabled',
    maxDiffPixels: 120,
  });
  expect(pageErrors).toEqual([]);
});
