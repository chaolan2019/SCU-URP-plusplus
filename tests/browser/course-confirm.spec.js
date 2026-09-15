import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const DIALOG = '#layui-layer-fixture';

test('退课确认：提示语补上要退的课程', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');

  // 弹窗仍由页面自己的 layui 渲染
  await expect(page.locator(DIALOG)).toHaveCount(1);
  const content = page.locator(`${DIALOG} .layui-layer-content`);
  await expect(content).toContainText('测试课程 A');
  // 原有提示语保持不动，只是在前面补了课程
  await expect(content).toContainText('是否确定要删除此门课程？');
});

test('退课确认：弹窗沿用主题样式（layui dialog 型）', async ({ page }) => {
  // 暗色主题下判定更明确：深邃暗的 --surface 是 #1C1C1E
  await loadUrpFixture(page, {
    fixture: 'quit-course',
    values: { urppp_theme_v3: 'dark' },
  });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toHaveCount(1);

  const styles = await page.evaluate((sel) => {
    const layer = document.querySelector(sel);
    const title = layer.querySelector('.layui-layer-title');
    const btn0 = layer.querySelector('.layui-layer-btn0');
    const btn1 = layer.querySelector('.layui-layer-btn1');
    const cs = (el) => getComputedStyle(el);
    return {
      layerBg: cs(layer).backgroundColor,
      layerRadius: cs(layer).borderTopLeftRadius,
      titleBg: cs(title).backgroundColor,
      titleWeight: cs(title).fontWeight,
      okBg: cs(btn0).backgroundColor,
      cancelBg: cs(btn1).backgroundColor,
    };
  }, DIALOG);

  expect(styles.layerBg).toBe('rgb(28, 28, 30)');
  expect(styles.titleBg).toBe('rgb(28, 28, 30)');
  expect(styles.titleWeight).toBe('600');
  // 主按钮用主题主色，次按钮用输入底色，两者可区分
  expect(styles.okBg).not.toBe(styles.cancelBg);
  // 圆角取自主题变量（editorial 为 0，apple 为设计值）
  expect(styles.layerRadius).not.toBe('2px');
});

test('退课确认：取消不会执行退课', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toHaveCount(1);

  await page.click(`${DIALOG} .layui-layer-btn1`);
  await expect(page.locator(DIALOG)).toHaveCount(0);

  const state = await page.evaluate(() => ({
    answered: window.__confirmCallbackFired,
    deleted: !!window.__deleteRequested,
  }));
  expect(state.answered).toBe(false);
  expect(state.deleted).toBe(false);
});

test('退课确认：点确定才真正执行', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toHaveCount(1);

  await page.click(`${DIALOG} .layui-layer-btn0`);
  await expect(page.locator(DIALOG)).toHaveCount(0);

  const state = await page.evaluate(() => ({
    answered: window.__confirmCallbackFired,
    deleted: !!window.__deleteRequested,
  }));
  expect(state.answered).toBe(true);
  expect(state.deleted).toBe(true);
});
