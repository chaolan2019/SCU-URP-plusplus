import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const scorePayload = {
  lnList: [
    {
      cjlx: '2024-2025-1',
      cjList: [
        { courseName: '高等数学', credit: 5, cj: '95', courseAttributeName: '必修', gradePointScore: 4.0, id: { courseNumber: 'C1' } },
        { courseName: '大学英语', credit: 3, cj: '86', courseAttributeName: '必修', gradePointScore: 3.5, id: { courseNumber: 'C2' } },
        { courseName: '通识任选', credit: 2, cj: '良好', courseAttributeName: '任选', gradePointScore: 3.7, id: { courseNumber: 'C3' } },
      ],
    },
    {
      cjlx: '2024-2025-2',
      cjList: [
        { courseName: '线性代数', credit: 3, cj: '78', courseAttributeName: '必修', gradePointScore: 2.5, id: { courseNumber: 'C4' } },
      ],
    },
  ],
};

async function installScoreApiMock(page) {
  await page.evaluate(({ payload }) => {
    window.GM_xmlhttpRequest = (options) => {
      const url = String((options && options.url) || '');
      if (typeof options.onload !== 'function') return;
      const isIndex = /scoreQuery\/(allPassingScores|schemeScores)\/index/.test(url);
      if (isIndex) {
        const hint = /allPassingScores/.test(url) ? 'allPassingScores' : 'schemeScores';
        options.onload({
          status: 200,
          responseText: `<html><body><script>var url="/student/integratedQuery/scoreQuery/${hint}/callback";</script></body></html>`,
        });
        return;
      }
      const isPassing = /allPassingScores\/callback/.test(url);
      options.onload({
        status: 200,
        responseText: JSON.stringify(isPassing ? payload : { lnList: [] }),
      });
    };
  }, { payload: scorePayload });
}

test('clean mode opens with score data and renders analysis charts', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);
  // fixture sidebar 无定位上下文导致 header 覆盖，原生 click 直接派发事件
  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => ({
    rootOpen: !!(document.getElementById('urppp-clean-root') && document.getElementById('urppp-clean-root').classList.contains('open')),
    bodyLen: (document.getElementById('uc-body') || { innerHTML: '' }).innerHTML.length,
  }));
  expect(state.rootOpen).toBe(true);
  expect(state.bodyLen).toBeGreaterThan(0);
  // 切到成绩分析 tab：标题位 tab 存在，点击后展示两张图
  await page.locator('#urppp-clean-root [data-sa-tab="analysis"]').first().click();
  await page.waitForTimeout(600);
  const charts = await page.evaluate(() => {
    const root = document.getElementById('urppp-clean-root');
    if (!root) return { err: 'no root' };
    const pane = root.querySelector('.uc-sa-pane-analysis');
    const op = pane ? pane.offsetParent : null;
    const rect = pane ? pane.getBoundingClientRect() : null;
    const chain = [];
    let n = pane;
    while (n && chain.length < 6) {
      const cs = getComputedStyle(n);
      chain.push(n.className + ' => display:' + cs.display + ' visibility:' + cs.visibility);
      n = n.parentElement;
    }
    const tabs = Array.from(root.querySelectorAll('[data-sa-tab]')).map((b) => b.getAttribute('data-sa-tab') + (b.classList.contains('ac') ? '!' : ''));
    const direct = !!root.querySelector('.uc-hd-tabs');
    const cardOpen = root.classList.contains('open');
    return {
      cardOpen, direct, tabs: tabs.join(','),
      paneHidden: !!(pane && pane.hasAttribute('hidden')),
      paneVisible: !!(pane && pane.offsetParent !== null),
      chain,
      offsetParent: op ? op.tagName + '.' + (op.className || '') : null,
      rect: rect ? { w: rect.width.toFixed(1), h: rect.height.toFixed(1), top: rect.top.toFixed(1) } : null,
      chartCards: root.querySelectorAll('.uc-sa-chart-card').length,
      hoverFill: root.querySelector('.urppp-sa-hover') ? getComputedStyle(root.querySelector('.urppp-sa-hover')).fill : 'none',
    };
  });
  console.log('CHARTS_ONE:', JSON.stringify(charts));
  // offsetParent 在 fixed 定位上下文下为 null，改用实际布局尺寸判断可见性
  expect(charts.rect && charts.rect.h > 0).toBe(true);
  expect(charts.chartCards).toBe(2);
  expect(pageErrors).toEqual([]);
});

test('clean mode top-left toggle opens the site sidebar drawer', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);

  // 打开清爽模式
  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);

  const root = page.locator('#urppp-clean-root');
  await expect(root).toHaveClass(/open/);
  await expect(page.locator('#uc-menu-toggle')).toHaveCount(1);

  // 清爽模式下站点侧边栏进入抽屉隐藏态
  const sidebar = page.locator('#sidebar');
  await expect(sidebar).toHaveClass(/urppp-clean-sidebar/);

  // 点击汉堡：站点侧边栏滑出（display + 宽度 260px），且顶边与顶栏底部平齐
  await page.locator('#uc-menu-toggle').click();
  await expect(sidebar).toHaveClass(/display/);
  const sidebarBox = await sidebar.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const topEl = document.querySelector('#urppp-clean-root .uc-top');
    const tr = topEl ? topEl.getBoundingClientRect() : null;
    return {
      w: Math.round(r.width),
      top: Math.round(r.top),
      topBarBottom: tr ? Math.round(tr.bottom) : null,
    };
  });
  expect(sidebarBox.w).toBeGreaterThanOrEqual(259);
  expect(sidebarBox.w).toBeLessThanOrEqual(262);
  // 侧边栏顶边贴着清爽模式顶栏底部
  expect(Math.abs(sidebarBox.top - sidebarBox.topBarBottom)).toBeLessThanOrEqual(1);
  // 汉堡切换为关闭图标（aria-expanded=true）
  await expect(page.locator('#uc-menu-toggle')).toHaveAttribute('aria-expanded', 'true');

  // 侧边栏菜单含站点菜单项（首页）
  const menuTexts = await sidebar.locator('#urppp-menus a[href], #menus a[href]').allTextContents();
  expect(menuTexts.some((t) => t.includes('首页'))).toBeTruthy();
  expect(await sidebar.locator('a[href]').count()).toBeGreaterThan(0);

  // 再点汉堡：侧边栏收回，图标还原
  await page.locator('#uc-menu-toggle').click();
  await expect(sidebar).not.toHaveClass(/display/);
  await expect(page.locator('#uc-menu-toggle')).toHaveAttribute('aria-expanded', 'false');

  // 关闭清爽模式后 sidebar 恢复原状（移除 urppp-clean-sidebar、display，内联 z-index/position 还原）
  await page.evaluate(() => document.getElementById('uc-exit').click());
  await page.waitForTimeout(400);
  await expect(sidebar).not.toHaveClass(/urppp-clean-sidebar/);
  await expect(sidebar).not.toHaveClass(/display/);
  const inlineAfterClose = await sidebar.evaluate((el) => ({
    z: el.style.getPropertyValue('z-index'),
    pos: el.style.getPropertyValue('position'),
    top: el.style.getPropertyValue('top'),
  }));
  expect(inlineAfterClose.z).not.toBe('12030');
  expect(inlineAfterClose.pos).not.toBe('fixed');
  expect(pageErrors).toEqual([]);
});

test('clean mode sidebar drawer works on mobile viewport with aligned top', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'mobile-home', viewport: { width: 390, height: 844 } });
  await installScoreApiMock(page);

  // 先交互站点侧边栏（开→关），残留站点动画内联，验证清爽模式仍能接管
  await page.locator('#urppp-mobile-menu-button').click();
  await page.waitForTimeout(350);
  await page.locator('#urppp-mobile-menu-button').click();
  await page.waitForTimeout(350);

  // 打开清爽模式
  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);

  const sidebar = page.locator('#sidebar');
  await expect(sidebar).toHaveClass(/urppp-clean-sidebar/);
  // 站点动画残留的内联已清除，CSS 完全接管
  const inlineAfterClean = await sidebar.evaluate((el) => ({
    transform: el.style.getPropertyValue('transform'),
    vis: el.style.getPropertyValue('visibility'),
    pe: el.style.getPropertyValue('pointer-events'),
    transition: el.style.getPropertyValue('transition'),
  }));
  expect(inlineAfterClean.transform).toBe('');
  expect(inlineAfterClean.vis).toBe('');
  expect(inlineAfterClean.pe).toBe('');
  expect(inlineAfterClean.transition).toBe('');

  // 移动端：顶边与清爽顶栏底部（52px）平齐，宽度 260px
  await page.locator('#uc-menu-toggle').click();
  await expect(sidebar).toHaveClass(/display/);
  await page.waitForTimeout(400); // 等待滑入动画完成
  const box = await sidebar.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const topEl = document.querySelector('#urppp-clean-root .uc-top');
    const tr = topEl ? topEl.getBoundingClientRect() : null;
    return { top: Math.round(r.top), topBarBottom: tr ? Math.round(tr.bottom) : null, w: Math.round(r.width), left: Math.round(r.left) };
  });
  expect(Math.abs(box.top - box.topBarBottom)).toBeLessThanOrEqual(1);
  expect(box.w).toBeGreaterThanOrEqual(259);
  expect(box.w).toBeLessThanOrEqual(262);
  expect(box.left).toBe(0);
  await expect(page.locator('#uc-menu-toggle')).toHaveAttribute('aria-expanded', 'true');

  // 再点汉堡收回：动画中途 transform 应在 -260 与 0 之间（非瞬跳）
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(80);
  const midX = await sidebar.evaluate((el) => {
    const m = getComputedStyle(el).transform.match(/matrix\(1, 0, 0, 1, ([\d.-]+),/);
    return m ? Math.round(parseFloat(m[1])) : null;
  });
  expect(midX).not.toBe(0);
  expect(midX).toBeLessThan(0);
  expect(midX).toBeGreaterThan(-261);
  await page.waitForTimeout(400);
  await expect(sidebar).not.toHaveClass(/display/);
  await expect(page.locator('#uc-menu-toggle')).toHaveAttribute('aria-expanded', 'false');

  // 退出清爽模式后 sidebar 回到原位，内联样式还原
  await page.evaluate(() => document.getElementById('uc-exit').click());
  await page.waitForTimeout(400);
  const afterClose = await sidebar.evaluate((el) => ({
    z: el.style.getPropertyValue('z-index'),
    pos: el.style.getPropertyValue('position'),
    parentTag: el.parentElement ? el.parentElement.id || el.parentElement.tagName : null,
  }));
  expect(afterClose.z).not.toBe('12030');
  expect(afterClose.pos).not.toBe('fixed');
  expect(afterClose.parentTag).not.toBe('urppp-clean-root');
  expect(pageErrors).toEqual([]);
});

test('clean mode sidebar sits below top bar and gets mobile sections on desktop', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(350);

  const info = await page.evaluate(() => {
    const sidebar = document.getElementById('sidebar');
    const root = document.getElementById('urppp-clean-root');
    const topEl = root.querySelector('.uc-top');
    return {
      sidebarParentIsRoot: sidebar.parentElement === root,
      sidebarZ: getComputedStyle(sidebar).zIndex,
      topZ: getComputedStyle(topEl).zIndex,
      hasMobileUser: !!document.getElementById('urppp-mobile-user'),
      hasQuick: !!document.getElementById('urppp-mobile-quick'),
      userVisible: (() => {
        const el = document.getElementById('urppp-mobile-user');
        return el ? el.getBoundingClientRect().height > 0 : false;
      })(),
    };
  });
  // 侧边栏在清爽模式 root 内、顶栏之下（顶栏 z-index 更高）
  expect(info.sidebarParentIsRoot).toBe(true);
  expect(parseInt(info.topZ, 10)).toBeGreaterThan(parseInt(info.sidebarZ, 10));
  // 桌面清爽模式也注入移动端侧边栏区块
  expect(info.hasMobileUser).toBe(true);
  expect(info.hasQuick).toBe(true);
  expect(info.userVisible).toBe(true);
  expect(pageErrors).toEqual([]);
});
