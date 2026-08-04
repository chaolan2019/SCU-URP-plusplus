import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

test('native PDF capture removes theme residue and restores it after every export', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
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
  const { pageErrors } = await loadUrpFixture(page);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  await expect(page.locator('#mycoursetable')).toHaveScreenshot('schedule-themed.png', {
    animations: 'disabled',
    maxDiffPixels: 120,
  });
  expect(pageErrors).toEqual([]);
});
