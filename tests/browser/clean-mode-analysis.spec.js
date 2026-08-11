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

test('clean mode mobile score analysis uses readable responsive charts', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: { width: 390, height: 844 },
  });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(2500);
  await page.locator('#uc-tabbar button[data-tab="scores"]').click();
  await page.locator('[data-sa-tab="analysis"]').click();
  await page.waitForTimeout(300);

  const chartLayout = await page.evaluate(() => {
    const pane = document.querySelector('#urppp-clean-root .uc-sa-pane-analysis');
    const trendSvg = pane.querySelector('[data-urppp-chart-kind="trend"]');
    const bandsSvg = pane.querySelector('[data-urppp-chart-kind="bands"]');
    const trendScroll = trendSvg.closest('.uc-sa-chart-scroll');
    const bandsScroll = bandsSvg.closest('.uc-sa-chart-scroll');
    return {
      trendMode: trendSvg.getAttribute('data-urppp-chart-layout'),
      bandsMode: bandsSvg.getAttribute('data-urppp-chart-layout'),
      trendFont: parseFloat(getComputedStyle(trendSvg.querySelector('text')).fontSize),
      trendOverflow: trendScroll.scrollWidth - trendScroll.clientWidth,
      bandsOverflow: bandsScroll.scrollWidth - bandsScroll.clientWidth,
      rootOverflow: document.getElementById('urppp-clean-root').scrollWidth - document.getElementById('urppp-clean-root').clientWidth,
    };
  });
  expect(chartLayout.trendMode).toBe('mobile');
  expect(chartLayout.bandsMode).toBe('mobile');
  expect(chartLayout.trendFont).toBeGreaterThanOrEqual(11);
  expect(chartLayout.trendOverflow).toBeLessThanOrEqual(2);
  expect(chartLayout.bandsOverflow).toBeGreaterThan(150);
  expect(chartLayout.rootOverflow).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(300);
  await expect(page.locator('#urppp-clean-root [data-urppp-chart-kind="trend"]')).not.toHaveAttribute('data-urppp-chart-layout', 'mobile');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await expect(page.locator('#urppp-clean-root [data-urppp-chart-kind="trend"]')).toHaveAttribute('data-urppp-chart-layout', 'mobile');
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

  // 桌面窗口尺寸变化会触发通用 sidebar 同步，清爽模式仍应保持自己的顶栏几何。
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.waitForTimeout(180);
  const resizedBox = await sidebar.evaluate((el) => {
    const sidebarRect = el.getBoundingClientRect();
    const topRect = document.querySelector('#urppp-clean-root .uc-top').getBoundingClientRect();
    return {
      top: Math.round(sidebarRect.top),
      topBarBottom: Math.round(topRect.bottom),
      bottom: Math.round(sidebarRect.bottom),
      viewportBottom: window.innerHeight,
    };
  });
  expect(Math.abs(resizedBox.top - resizedBox.topBarBottom)).toBeLessThanOrEqual(1);
  expect(Math.abs(resizedBox.bottom - resizedBox.viewportBottom)).toBeLessThanOrEqual(1);

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
  // 接管时停止旧帧循环，并保留移动端 animateDrawer 已完成的关闭位置。
  const inlineAfterClean = await sidebar.evaluate((el) => {
    const matrix = getComputedStyle(el).transform.match(/matrix\(1, 0, 0, 1, ([\d.-]+),/);
    return {
      x: matrix ? Math.round(parseFloat(matrix[1])) : null,
      vis: getComputedStyle(el).visibility,
      pe: getComputedStyle(el).pointerEvents,
      transition: el.style.getPropertyValue('transition'),
      display: el.classList.contains('display'),
      closing: el.classList.contains('urppp-drawer-closing'),
    };
  });
  expect(inlineAfterClean.x).toBeLessThan(-250);
  expect(inlineAfterClean.vis).toBe('hidden');
  expect(inlineAfterClean.pe).toBe('none');
  expect(inlineAfterClean.transition).toBe('none');
  expect(inlineAfterClean.display).toBe(false);
  expect(inlineAfterClean.closing).toBe(false);

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

  // 再点汉堡收回：直接复用移动端 animateDrawer，动画结束前保留 display + closing 状态
  await page.locator('#uc-menu-toggle').click();
  await expect(sidebar).toHaveClass(/display/);
  await expect(sidebar).toHaveClass(/urppp-drawer-closing/);
  await page.waitForTimeout(80);
  const closingFrame = await sidebar.evaluate((el) => {
    const m = getComputedStyle(el).transform.match(/matrix\(1, 0, 0, 1, ([\d.-]+),/);
    return {
      x: m ? Math.round(parseFloat(m[1])) : null,
      z: getComputedStyle(el).zIndex,
      transition: el.style.getPropertyValue('transition'),
    };
  });
  expect(closingFrame.x).not.toBe(0);
  expect(closingFrame.x).toBeLessThan(0);
  expect(closingFrame.x).toBeGreaterThan(-261);
  expect(closingFrame.z).toBe('12030');
  expect(closingFrame.transition).toBe('none');
  await page.waitForTimeout(400);
  await expect(sidebar).not.toHaveClass(/display|urppp-drawer-closing/);
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
      // 搜索：清爽模式下站点 form-search（含 typeahead）移入侧边栏搜索面板，输入弹出结果框
      formSearchInPanel: !!document.getElementById('form-search') && !!document.getElementById('form-search').closest('#urppp-mobile-search-panel'),
      cleanSearchInput: !!document.getElementById('search-input') && !!document.getElementById('search-input').closest('#urppp-mobile-search-panel'),
      // 隐藏 ACE 原生菜单与折叠按钮，避免出现空的功能分区
      nativeMenusHidden: getComputedStyle(document.getElementById('menus')).display === 'none',
      collapseHidden: getComputedStyle(document.querySelector('#sidebar .sidebar-collapse')).display === 'none',
    };
  });
  // 侧边栏在清爽模式 root 内、顶栏之下（顶栏 z-index 更高）
  expect(info.sidebarParentIsRoot).toBe(true);
  expect(parseInt(info.topZ, 10)).toBeGreaterThan(parseInt(info.sidebarZ, 10));
  // 桌面清爽模式也注入移动端侧边栏区块
  expect(info.hasMobileUser).toBe(true);
  expect(info.hasQuick).toBe(true);
  expect(info.userVisible).toBe(true);
  // 搜索：form-search（含 typeahead）在侧边栏面板内，退出后恢复 navbar
  expect(info.formSearchInPanel).toBe(true);
  expect(info.cleanSearchInput).toBe(true);
  // ACE 原生菜单/折叠按钮隐藏，清爽模式只显示重建菜单
  expect(info.nativeMenusHidden).toBe(true);
  expect(info.collapseHidden).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('clean mode sidebar external links stay in clean mode while inner links exit', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'home',
    beforeUserscript: async (p) => {
      await p.evaluate(() => {
        const menus = document.getElementById('menus');
        menus.innerHTML = `
          <li id="menu-home" class="active"><a href="/index"><span class="menu-text">首页</span></a></li>
          <li id="menu-cal"><a href="https://jwc.scu.edu.cn/cdxl.htm" target="_blank"><span class="menu-text">校历</span></a></li>
          <li id="menu-inner"><a href="/schedule"><span class="menu-text">课表</span></a></li>`;
      });
    },
  });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(350);

  // 重建菜单保留 target=_blank（外部链接标志）
  const calLink = page.locator('#urppp-menus a[href*="jwc.scu.edu.cn"]');
  await expect(calLink).toHaveAttribute('target', '_blank');

  // 点外部链接：清爽模式保持
  await calLink.click();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.classList.contains('urppp-clean-open'))).toBe(true);

  // 点站内链接：清爽模式退出（抽屉仍开着，直接点）
  await page.locator('#urppp-menus a[href="/schedule"]').click();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.classList.contains('urppp-clean-open'))).toBe(false);
  expect(pageErrors).toEqual([]);
});

test('clean mode sidebar submenus stay collapsed until parent is clicked', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'home',
    beforeUserscript: async (p) => {
      await p.evaluate(() => {
        const menus = document.getElementById('menus');
        menus.innerHTML = `
          <li id="menu-home" class="active"><a href="/index"><span class="menu-text">首页</span></a></li>
          <li id="menu-service"><a href="#"><span class="menu-text">教学服务</span></a>
            <ul class="submenu">
              <li><a href="/schedule"><span class="menu-text">课表</span></a></li>
              <li><a href="/grades"><span class="menu-text">成绩</span></a></li>
            </ul>
          </li>`;
      });
    },
  });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(350);

  const sub = page.locator('#urppp-menus .urppp-nav-item .urppp-nav-submenu');
  // 默认折叠（高度为 0）
  const collapsedH = await sub.evaluate((el) => Math.round(el.getBoundingClientRect().height));
  expect(collapsedH).toBe(0);
  // 点击父项展开，子菜单可见
  await page.locator('#urppp-menus .urppp-nav-item a').nth(1).click();
  await page.waitForTimeout(400);
  const expandedH = await sub.evaluate((el) => Math.round(el.getBoundingClientRect().height));
  expect(expandedH).toBeGreaterThan(40);
  const texts = await sub.locator('.urppp-nav-text').allTextContents();
  expect(texts).toEqual(['课表', '成绩']);
  expect(pageErrors).toEqual([]);
});

test('clean mode exit removes injected mobile sections on desktop', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  // 清爽模式下有移动端区块
  expect(await page.evaluate(() => !!document.getElementById('urppp-mobile-user'))).toBe(true);
  expect(await page.evaluate(() => !!document.getElementById('urppp-mobile-quick'))).toBe(true);

  // 退出清爽模式：桌面侧边栏恢复原样，不再有移动端区块
  await page.evaluate(() => document.getElementById('uc-exit').click());
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    hasUser: !!document.getElementById('urppp-mobile-user'),
    hasQuick: !!document.getElementById('urppp-mobile-quick'),
    sidebarInRoot: document.getElementById('sidebar').parentElement === document.getElementById('urppp-clean-root'),
    cleanFlag: document.documentElement.classList.contains('urppp-clean-open'),
  }));
  expect(after.hasUser).toBe(false);
  expect(after.hasQuick).toBe(false);
  expect(after.sidebarInRoot).toBe(false);
  expect(after.cleanFlag).toBe(false);
  expect(pageErrors).toEqual([]);
});

test('clean mode quick section links do not close clean mode', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: { width: 390, height: 844 },
  });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);

  // 快捷区内静态项（假期状态）：清爽模式下变纯文本，不可点击、不退出清爽模式、不收回
  await page.evaluate(() => {
    const link = document.querySelector('#urppp-mobile-quick .urppp-mobile-quick-link');
    if (link && link.textContent.includes('假期')) link.setAttribute('onclick', 'window.__urpppHolidayClicked = true; return false;');
  });
  const holidayLink = page.locator('#urppp-mobile-quick .urppp-mobile-quick-link').filter({ hasText: '假期' });
  // 静态项已是纯文本：无 href、pointer-events none
  const hCount = await holidayLink.count();
  if (hCount > 0) {
    const href = await holidayLink.getAttribute('href');
    const pe = await holidayLink.evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(href).toBeNull();
    expect(pe).toBe('none');
    // 用 force 点击模拟用户点击（元素 pointer-events:none 时 Playwright 正常点击会被拦截）
    await holidayLink.click({ force: true });
    await page.waitForTimeout(300);
  }
  const state = await page.evaluate(() => ({
    cleanOpen: document.documentElement.classList.contains('urppp-clean-open'),
    sidebarDisplay: document.getElementById('sidebar').classList.contains('display'),
    aria: document.getElementById('uc-menu-toggle').getAttribute('aria-expanded'),
    holidayClicked: !!window.__urpppHolidayClicked,
  }));
  expect(state.cleanOpen).toBe(true);
  expect(state.sidebarDisplay).toBe(true);
  expect(state.aria).toBe('true');
  expect(state.holidayClicked).toBe(false);
  expect(pageErrors).toEqual([]);
});

test('clean mode desktop search input matches mobile style', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  await installScoreApiMock(page);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('#urppp-mobile-search-button').click();
  await page.waitForTimeout(300);

  const input = await page.evaluate(() => {
    // 清爽模式复用站点 form-search，输入框是 #search-input（含 typeahead）
    const el = document.getElementById('search-input');
    if (!el || !el.closest('#urppp-mobile-search-panel')) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const toolRect = document.querySelector('#urppp-mobile-quick .urppp-mobile-tool-row')?.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      borderW: parseFloat(cs.borderTopWidth),
      inPanel: true,
      leftDelta: toolRect ? Math.round(r.left - toolRect.left) : null,
      rightDelta: toolRect ? Math.round(toolRect.right - r.right) : null,
      verticalGap: toolRect ? Math.round(r.top - toolRect.bottom) : null,
    };
  });
  expect(input).not.toBeNull();
  expect(input.w).toBeGreaterThan(200);
  // 站点 nav-search-input 默认 36px 高、带边框
  expect(input.h).toBe(36);
  expect(input.borderW).toBeGreaterThan(0);
  expect(Math.abs(input.leftDelta)).toBeLessThanOrEqual(1);
  expect(Math.abs(input.rightDelta)).toBeLessThanOrEqual(1);
  expect(input.verticalGap).toBeGreaterThanOrEqual(6);
  expect(input.verticalGap).toBeLessThanOrEqual(16);

  // 搜索展开时收起并重新打开侧边栏，桌面搜索的 outside-click 不能把移动搜索写回 width:0
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  const afterDrawerCycle = await page.evaluate(() => {
    const panel = document.getElementById('urppp-mobile-search-panel');
    const form = document.getElementById('form-search');
    const inputEl = document.getElementById('search-input');
    const formStyle = form ? getComputedStyle(form) : null;
    return {
      panelOpen: !!panel && !panel.hidden && panel.classList.contains('open'),
      formWidth: form ? Math.round(form.getBoundingClientRect().width) : 0,
      inputWidth: inputEl ? Math.round(inputEl.getBoundingClientRect().width) : 0,
      opacity: formStyle ? formStyle.opacity : '',
      pointerEvents: formStyle ? formStyle.pointerEvents : '',
    };
  });
  expect(afterDrawerCycle.panelOpen).toBe(true);
  expect(afterDrawerCycle.formWidth).toBeGreaterThan(200);
  expect(afterDrawerCycle.inputWidth).toBeGreaterThan(200);
  expect(afterDrawerCycle.opacity).toBe('1');
  expect(afterDrawerCycle.pointerEvents).toBe('auto');
  expect(pageErrors).toEqual([]);
});

test('clean mode mobile search clears desktop width constraints and help navigates', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'home',
    viewport: { width: 1280, height: 900 },
    beforeUserscript: async (fixturePage) => {
      await fixturePage.evaluate(() => {
        const form = document.querySelector('#form-search .form-search');
        const icon = document.querySelector('#form-search .input-icon');
        const input = document.getElementById('search-input');
        [form, icon, input].forEach((element) => {
          element?.style.setProperty('max-width', '160px', 'important');
        });
      });
    },
  });
  await installScoreApiMock(page);

  // 模拟真实浏览器先完成桌面绑定，再切到移动视口。
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('#urppp-mobile-search-button').click();
  await page.waitForTimeout(300);

  const layout = await page.evaluate(() => {
    const toolRect = document.querySelector('#urppp-mobile-quick .urppp-mobile-tool-row')?.getBoundingClientRect();
    const input = document.getElementById('search-input');
    const inputRect = input?.getBoundingClientRect();
    const help = document.querySelector('#urppp-mobile-quick .urppp-mobile-help-button');
    return {
      leftDelta: toolRect && inputRect ? Math.round(inputRect.left - toolRect.left) : null,
      rightDelta: toolRect && inputRect ? Math.round(toolRect.right - inputRect.right) : null,
      inputWidth: Math.round(inputRect?.width || 0),
      inputMaxWidth: input ? getComputedStyle(input).maxWidth : '',
      helpHref: help?.getAttribute('href') || '',
    };
  });
  expect(Math.abs(layout.leftDelta)).toBeLessThanOrEqual(1);
  expect(Math.abs(layout.rightDelta)).toBeLessThanOrEqual(1);
  expect(layout.inputWidth).toBeGreaterThan(200);
  expect(layout.inputMaxWidth).toBe('none');
  expect(layout.helpHref).toContain('/main/customerServiceCenter');

  await page.locator('#urppp-mobile-quick .urppp-mobile-help-button').click();
  await page.waitForTimeout(500);
  expect(page.url()).toContain('/main/customerServiceCenter');
  expect(pageErrors).toEqual([]);
});

test('clean mode mobile search reuses site form-search typeahead', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: { width: 390, height: 844 },
  });
  await installScoreApiMock(page);

  // 站点侧边栏交互两次（预污染 animateDrawer 残留）
  await page.locator('#urppp-mobile-menu-button').click();
  await page.waitForTimeout(350);
  await page.locator('#urppp-mobile-menu-button').click();
  await page.waitForTimeout(350);

  await page.evaluate(() => document.getElementById('urppp-nav-clean').click());
  await page.waitForTimeout(600);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('#urppp-mobile-search-button').click();
  await page.waitForTimeout(300);

  const state = await page.evaluate(() => ({
    // 清爽模式复用站点 form-search（含 typeahead），移入侧边栏面板
    formSearchInPanel: !!document.getElementById('form-search') && !!document.getElementById('form-search').closest('#urppp-mobile-search-panel'),
    searchInputInPanel: !!document.getElementById('search-input') && !!document.getElementById('search-input').closest('#urppp-mobile-search-panel'),
    quickLinks: Array.from(document.querySelectorAll('#urppp-mobile-quick .urppp-mobile-quick-link')).map((a) => a.getAttribute('href')),
    inputH: Math.round(document.getElementById('search-input').getBoundingClientRect().height),
    alignment: (() => {
      const toolRect = document.querySelector('#urppp-mobile-quick .urppp-mobile-tool-row')?.getBoundingClientRect();
      const inputRect = document.getElementById('search-input')?.getBoundingClientRect();
      if (!toolRect || !inputRect) return null;
      return {
        leftDelta: Math.round(inputRect.left - toolRect.left),
        rightDelta: Math.round(toolRect.right - inputRect.right),
        verticalGap: Math.round(inputRect.top - toolRect.bottom),
      };
    })(),
  }));
  expect(state.formSearchInPanel).toBe(true);
  expect(state.searchInputInPanel).toBe(true);
  expect(state.inputH).toBeGreaterThan(20);
  expect(state.alignment).not.toBeNull();
  expect(Math.abs(state.alignment.leftDelta)).toBeLessThanOrEqual(1);
  expect(Math.abs(state.alignment.rightDelta)).toBeLessThanOrEqual(1);
  expect(state.alignment.verticalGap).toBeGreaterThanOrEqual(6);
  expect(state.alignment.verticalGap).toBeLessThanOrEqual(16);
  // 假期静态项变纯文本（href null），校历/作息仍保留链接
  expect(state.quickLinks).toContain('/calendar');
  expect(state.quickLinks).toContain('/schedule');
  expect(state.quickLinks).toContain(null);

  // 移动视口同样覆盖搜索展开后的抽屉收起/再展开，输入框不能被桌面监听器压成 0 宽。
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('#uc-menu-toggle').click();
  await page.waitForTimeout(400);
  const afterDrawerCycle = await page.evaluate(() => {
    const panel = document.getElementById('urppp-mobile-search-panel');
    const form = document.getElementById('form-search');
    return {
      panelOpen: !!panel && !panel.hidden && panel.classList.contains('open'),
      formWidth: form ? Math.round(form.getBoundingClientRect().width) : 0,
      inputWidth: Math.round(document.getElementById('search-input')?.getBoundingClientRect().width || 0),
      opacity: form ? getComputedStyle(form).opacity : '',
    };
  });
  expect(afterDrawerCycle.panelOpen).toBe(true);
  expect(afterDrawerCycle.formWidth).toBeGreaterThan(200);
  expect(afterDrawerCycle.inputWidth).toBeGreaterThan(200);
  expect(afterDrawerCycle.opacity).toBe('1');
  expect(pageErrors).toEqual([]);
});
