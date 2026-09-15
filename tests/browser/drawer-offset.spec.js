import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 时间筛选器的抽屉（#div_kbt，站点自己渲染）靠内联 top 收起：top = 面板高度的负值。
 * 站点只在打开面板时量一次并记住；点查询后网格被填满、面板长高，它仍按旧值收起，
 * 于是收起态底下会露出一截（实测 107px）。站点要过一会儿才自己补量，那段间隔就是
 * 用户看到的「先露出一部分再收回」。
 *
 * 注意：抽屉是点开面板时才渲染的，启动时页面上没有它——插件必须等它出现再接管。
 */

function drawerState(page) {
  return page.evaluate(() => {
    const panel = document.getElementById('div_kbt');
    if (!panel) return { top: null, height: 0, offset: NaN };
    return { top: panel.style.top, height: panel.offsetHeight, offset: parseFloat(panel.style.top) };
  });
}

test('抽屉：点开面板后才渲染出来的抽屉，也会被接管并在同一帧内校正', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'drawer-offset' });

  await page.click('#open');
  const opened = await drawerState(page);
  expect(Math.abs(opened.offset + opened.height)).toBeLessThan(1);

  // 查询：网格填满、面板长高，站点仍按旧高度收起
  await page.click('#fill');

  // 校正必须发生在布局后、绘制前：读值取在下一帧（rAF 排在 ResizeObserver 之后、绘制之前）
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
  const rightAfter = await drawerState(page);
  expect(rightAfter.height).toBeGreaterThan(opened.height);
  expect(Math.abs(rightAfter.offset + rightAfter.height)).toBeLessThan(1);
});

test('抽屉：展开态不被干扰', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'drawer-offset' });

  await page.click('#open');
  await page.click('#expand');
  await page.waitForTimeout(400);

  // top 非负表示站点已展开，这里一律不碰
  expect((await drawerState(page)).top).toBe('0px');
});
