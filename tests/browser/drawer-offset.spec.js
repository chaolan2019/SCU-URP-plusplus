import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 时间筛选器的抽屉（#div_kbt，站点自己渲染）靠内联 top 收起：top = 面板高度的负值。
 * 站点只在载入时量一次；查询后网格被填满、面板长高，位移还是旧值，收起态底下就会
 * 露出一截（实测 107px）。站点不会因为 resize 重算，所以由插件把位移补齐到当前高度。
 */

function drawerState(page) {
  return page.evaluate(() => {
    const panel = document.getElementById('div_kbt');
    return {
      top: panel.style.top,
      height: panel.offsetHeight,
      offset: parseFloat(panel.style.top),
    };
  });
}

test('抽屉：内容长高后，收起位移被补齐到当前高度', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'drawer-offset' });

  // 站点按载入时的高度收起，此时是对的
  const before = await drawerState(page);
  expect(Math.abs(before.offset + before.height)).toBeLessThan(1);

  // 查询：网格被填满，面板长高，而站点不再重新量
  await page.click('#fill');

  // 校正必须发生在布局后、绘制前，不能等防抖——否则会先闪一瞬再收回。
  // 等到下一帧（rAF 在 ResizeObserver 之后、绘制之前）再读，值就该已经对了。
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
  const rightAfter = await drawerState(page);
  expect(Math.abs(rightAfter.offset + rightAfter.height)).toBeLessThan(1);

  await expect
    .poll(async () => {
      const now = await drawerState(page);
      return now.height > before.height && Math.abs(now.offset + now.height) < 1;
    })
    .toBe(true);
});

test('抽屉：展开态不被干扰', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'drawer-offset' });

  await page.click('#expand');
  await page.waitForTimeout(400);

  // top 非负表示站点已展开，这里一律不碰
  expect((await drawerState(page)).top).toBe('0px');
});
