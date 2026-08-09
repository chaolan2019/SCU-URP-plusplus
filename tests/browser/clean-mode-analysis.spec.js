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

test('clean mode drawer opens from top-left toggle with site menu links', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);

  // 打开清爽模式
  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);

  const root = page.locator('#urppp-clean-root');
  await expect(root).toHaveClass(/open/);
  await expect(page.locator('#uc-menu-toggle')).toHaveCount(1);
  await expect(page.locator('#uc-clean-drawer')).toHaveCount(1);

  // 点击汉堡打开抽屉
  await page.locator('#uc-menu-toggle').click();
  await expect(root).toHaveClass(/uc-drawer-open/);
  await expect(page.locator('#uc-clean-drawer')).toHaveAttribute('aria-hidden', 'false');

  // 抽屉菜单来自站点菜单链接
  const drawerItems = await page.locator('#uc-drawer-nav .uc-drawer-item').count();
  const siteItems = await page.locator('#urppp-menus a[href], #menus a[href]').count();
  expect(drawerItems).toBeGreaterThan(0);
  // 抽屉至少包含站点首页菜单项
  await expect(page.locator('#uc-drawer-nav .uc-drawer-item').first()).toBeVisible();
  const drawerTexts = await page.locator('#uc-drawer-nav .uc-drawer-item').allTextContents();
  expect(drawerTexts.some((t) => t.trim() === '首页')).toBeTruthy();
  void siteItems;

  // 抽屉宽度 260px（桌面端宽度）
  const drawerW = await page.locator('#uc-clean-drawer').evaluate((el) => Math.round(el.getBoundingClientRect().width));
  expect(drawerW).toBe(260);

  // 点击遮罩关闭
  await page.locator('#uc-drawer-mask').click({ position: { x: 300, y: 300 } });
  await expect(root).not.toHaveClass(/uc-drawer-open/);
  expect(pageErrors).toEqual([]);
});
