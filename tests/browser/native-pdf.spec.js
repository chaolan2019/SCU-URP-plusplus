import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

test('native PDF capture removes theme residue and restores it after every export', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  const card = page.locator('#courseTable .class_div').first();
  await card.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
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
  // 原生 divBuild 按整页坐标重排卡片：隔离必须把定位上下文固定回 page-content，
  // 否则 td/#mycoursetable 的 position:relative 会让卡片相对它们定位，整列偏移。
  expect(capture.cardOffsetDelta).toBe(0);

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

test('mobile schedule hides native print and keeps export action in view', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    viewport: { width: 390, height: 844 },
    beforeUserscript: async (fixturePage) => {
      await fixturePage.evaluate(() => {
        const actionHost = document.querySelector('#h4_id1 .right_top_oper');
        const selfCheck = document.createElement('button');
        selfCheck.id = 'native-self-check';
        selfCheck.type = 'button';
        selfCheck.textContent = '课表自检';
        actionHost.prepend(selfCheck);
        document.getElementById('native-print').setAttribute('onclick', 'dy(); return false;');
      });
    },
  });

  const nativePrint = page.locator('#native-print');
  const exportTrigger = page.locator('#urppp-native-schedule-export > .urppp-export-trigger');
  await expect(nativePrint).toHaveAttribute('data-urppp-native-print-source', '1');
  await nativePrint.evaluate((button) => button.removeAttribute('data-urppp-native-print-source'));
  await expect(nativePrint).toBeHidden();
  await expect(page.locator('#native-self-check')).toBeVisible();
  await expect(exportTrigger).toBeVisible();

  const mobileLayout = await page.evaluate(() => {
    const actionHost = document.querySelector('#h4_id1 .right_top_oper');
    const trigger = document.querySelector('#urppp-native-schedule-export > .urppp-export-trigger');
    const hostRect = actionHost.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    return {
      hostInViewport: hostRect.left >= 0 && hostRect.right <= window.innerWidth + 1,
      triggerInViewport: triggerRect.left >= 0 && triggerRect.right <= window.innerWidth + 1,
      clipped: actionHost.scrollWidth > actionHost.clientWidth + 1,
    };
  });
  expect(mobileLayout).toEqual({
    hostInViewport: true,
    triggerInViewport: true,
    clipped: false,
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(nativePrint).toBeVisible();
  await expect(exportTrigger).toBeVisible();
  const desktopTrigger = await exportTrigger.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const labelRect = button.querySelector('span').getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      labelHeight: labelRect.height,
      whiteSpace: getComputedStyle(button).whiteSpace,
    };
  });
  expect(desktopTrigger.width / desktopTrigger.height).toBeGreaterThan(2.5);
  expect(desktopTrigger.height).toBeLessThanOrEqual(30);
  expect(desktopTrigger.labelHeight).toBeLessThanOrEqual(16);
  expect(desktopTrigger.whiteSpace).toBe('nowrap');
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
