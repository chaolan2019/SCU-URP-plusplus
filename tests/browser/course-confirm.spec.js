import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const DIALOG = '.layui-layer-dialog';
const CONTENT = `${DIALOG} #layui-layer-content`;

test('退课确认：提示语补上要退的课程', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn');

  // 弹窗仍由页面自己的脚本渲染
  await expect(page.locator(DIALOG)).toHaveCount(1);
  await expect(page.locator(CONTENT)).toContainText('跨文化实用交际_28');
  // 原有提示语保持不动，只是在前面补了课程
  await expect(page.locator(CONTENT)).toContainText('是否确定要删除此门课程？');
  // 课程名按「课程名」列取：首列是操作图标，次列是培养方案，都不是课程
  const text = await page.locator(CONTENT).innerText();
  expect(text).not.toContain('电气电子创新设计');
  expect(text).not.toContain('105806020');
});

test('退课确认：补的是被点那一行的课程', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#quit-btn-2');

  await expect(page.locator(CONTENT)).toContainText('世界民族问题研究_01');
  await expect(page.locator(CONTENT)).not.toContainText('跨文化实用交际_28');
});

test('退课确认：增强不依赖 urp / layer 这类全局', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  // 真实页面上这两个全局都不保证存在；挂它们的结果就是静默失效
  const globals = await page.evaluate(() => ({
    urp: typeof window.urp,
    layer: typeof window.layer,
  }));
  expect(globals).toEqual({ urp: 'undefined', layer: 'undefined' });

  await page.click('#quit-btn');
  await expect(page.locator(CONTENT)).toContainText('跨文化实用交际_28');
});

test('退课确认：不是退课类的弹窗不动它', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#other-btn');

  await expect(page.locator(CONTENT)).toHaveText('选课时间冲突，请重新选择时间段');
});

test('退课确认：没点过课程行时不凭空补课程名', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'quit-course' });

  await page.click('#toolbar-btn');

  await expect(page.locator(CONTENT)).toHaveText('是否确定要删除所选课程？');
});

test('退课确认：内容节点是 layui 1.x 的 id 形态也跟随主题', async ({ page }) => {
  // 暗色主题下判定更明确：--surface 是 #1C1C1E
  await loadUrpFixture(page, {
    fixture: 'quit-course',
    values: { urppp_theme_v3: 'dark' },
  });

  await page.click('#quit-btn');
  await expect(page.locator(DIALOG)).toHaveCount(1);

  const styles = await page.evaluate(() => {
    const dialog = document.querySelector('.layui-layer-dialog');
    const content = dialog.querySelector('#layui-layer-content');
    const title = dialog.querySelector('.layui-layer-title');
    const btn0 = dialog.querySelector('.layui-layer-btn0');
    const btn1 = dialog.querySelector('.layui-layer-btn1');
    const cs = (el) => getComputedStyle(el);
    return {
      layerBg: cs(dialog).backgroundColor,
      layerRadius: cs(dialog).borderTopLeftRadius,
      contentBg: cs(content).backgroundColor,
      contentColor: cs(content).color,
      titleWeight: cs(title).fontWeight,
      okBg: cs(btn0).backgroundColor,
      cancelBg: cs(btn1).backgroundColor,
    };
  });

  expect(styles.layerBg).toBe('rgb(28, 28, 30)');
  expect(styles.contentBg).toBe('rgb(28, 28, 30)');
  expect(styles.contentColor).toBe('rgb(245, 245, 247)');
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
