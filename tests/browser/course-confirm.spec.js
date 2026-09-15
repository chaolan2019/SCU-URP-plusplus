import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const DIALOG = '#urppp-confirm-dialog';

test('退课确认：插件接管 urp.confirm 并弹出跟随主题的确认框', async ({ page }) => {
  // 用暗色主题验证「跟随主题」：深邃暗的 --surface 是 #1C1C1E，与默认白底区分明显
  await loadUrpFixture(page, {
    fixture: 'quit-course',
    values: { urppp_theme_v3: 'dark' },
  });

  // 页面自带的 urp.confirm 已由插件接管
  expect(await page.evaluate(() => !!window.__urpppConfirmInstalled)).toBe(true);

  await page.click('#quit-btn');

  await expect(page.locator(DIALOG)).toBeVisible();
  await expect(page.locator(`${DIALOG} .urppp-cd-body`)).toContainText('删除此门课程');

  const panel = await page.locator(`${DIALOG} .urppp-cd-panel`).evaluate((el) => {
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, color: cs.color, radius: cs.borderTopLeftRadius };
  });
  // 面板取自主题变量，而不是浏览器默认外观
  expect(panel.bg).toBe('rgb(28, 28, 30)');
  expect(panel.radius).not.toBe('0px');
});

test('退课确认：取消不会执行退课', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toBeVisible();

  await page.click(`${DIALOG} .urppp-cd-cancel`);
  await expect(page.locator(DIALOG)).toBeHidden();

  const state = await page.evaluate(() => ({
    answered: window.__confirmCallbackFired,
    deleted: !!window.__deleteRequested,
  }));
  // 关键：确认流程必须真的走完，且取消不产生任何删除动作
  expect(state.answered).toBe(false);
  expect(state.deleted).toBe(false);
});

test('退课确认：点确定才真正执行', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toBeVisible();

  await page.click(`${DIALOG} .urppp-cd-ok`);
  await expect(page.locator(DIALOG)).toBeHidden();

  const state = await page.evaluate(() => ({
    answered: window.__confirmCallbackFired,
    deleted: !!window.__deleteRequested,
  }));
  expect(state.answered).toBe(true);
  expect(state.deleted).toBe(true);
});
