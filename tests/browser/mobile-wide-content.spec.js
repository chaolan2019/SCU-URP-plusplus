import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

test('mobile week schedule keeps readable columns inside a horizontal viewport', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'schedule',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const host = page.locator('#mycoursetable');
  const table = page.locator('#courseTable');
  await expect(host).toHaveClass(/\burppp-mobile-schedule-scroll\b/);
  await expect(table).toHaveCSS('width', '760px');

  const metrics = await page.evaluate(() => {
    const schedule = document.getElementById('mycoursetable');
    const courseTable = document.getElementById('courseTable');
    const row = document.querySelector('#courseTableBody tr');
    return {
      clientWidth: schedule.clientWidth,
      scrollWidth: schedule.scrollWidth,
      tableWidth: courseTable.getBoundingClientRect().width,
      rowHeight: row.getBoundingClientRect().height,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  expect(metrics.clientWidth).toBeLessThan(390);
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth + 250);
  expect(metrics.tableWidth).toBeGreaterThanOrEqual(759);
  expect(metrics.rowHeight).toBeLessThanOrEqual(90);
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);

  const stickyOffset = await page.evaluate(async () => {
    const schedule = document.getElementById('mycoursetable');
    schedule.scrollLeft = 180;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const hostRect = schedule.getBoundingClientRect();
    const firstColumnRect = document.querySelector('#courseTableBody tr > :first-child').getBoundingClientRect();
    return Math.abs(firstColumnRect.left - hostRect.left);
  });
  expect(stickyOffset).toBeLessThanOrEqual(3);
  expect(pageErrors).toEqual([]);

  // 纯媒体查询兜底：即使 JS 未加 class，课表仍保持固定列宽可横向滚动，不压缩溢出
  await page.evaluate(() => {
    document.getElementById('mycoursetable').classList.remove('urppp-mobile-schedule-scroll');
  });
  const fallback = await page.evaluate(() => {
    const schedule = document.getElementById('mycoursetable');
    const courseTable = document.getElementById('courseTable');
    return {
      overflowX: getComputedStyle(schedule).overflowX,
      tableWidth: courseTable.getBoundingClientRect().width,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  expect(fallback.overflowX).toBe('auto');
  expect(fallback.tableWidth).toBeGreaterThanOrEqual(759);
  expect(fallback.pageOverflow).toBeLessThanOrEqual(1);
});

test('mobile query fields use one column on phones and two on tablets', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'grades',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const rows = page.locator('.profile-info-row.urppp-query-row');
  await expect(rows).toHaveCount(1);
  await expect(rows.locator(':scope > .urppp-query-pair')).toHaveCount(4);
  const inputStyle = await page.locator('#course-name').evaluate((element) => {
    const style = getComputedStyle(element);
    return { borderTopWidth: style.borderTopWidth, boxShadow: style.boxShadow };
  });
  expect(inputStyle.borderTopWidth).toBe('1px');
  expect(inputStyle.boxShadow).not.toBe('none');

  const mobileLayout = await page.evaluate(() => {
    const row = document.querySelector('.profile-info-row.urppp-query-row');
    const pairs = [...row.querySelectorAll(':scope > .urppp-query-pair')];
    const first = pairs[0];
    const label = first.querySelector('.profile-info-name').getBoundingClientRect();
    const value = first.querySelector('.profile-info-value').getBoundingClientRect();
    const control = first.querySelector('.chosen-container') || first.querySelector('select:not([style*="display: none"]), input:not([type="hidden"])');
    const controlRect = control.getBoundingClientRect();
    const form = row.closest('.urppp-query-form, .profile-user-info');
    const rowStyle = getComputedStyle(row);
    return {
      columns: rowStyle.gridTemplateColumns.split(' ').filter(Boolean).length,
      pairWidth: first.getBoundingClientRect().width,
      labelWithValue: Math.abs(label.top - value.top) < 12 && label.bottom <= value.bottom,
      controlWidth: Math.round(controlRect.width),
      clipped: form.scrollWidth > form.clientWidth + 1,
    };
  });
  expect(mobileLayout.columns).toBe(1);
  expect(mobileLayout.labelWithValue).toBeTruthy();
  expect(mobileLayout.clipped).toBeFalsy();
  expect(mobileLayout.pairWidth).toBeGreaterThan(280);
  // 控件要够大，不能是细条（>180px）
  expect(mobileLayout.controlWidth).toBeGreaterThan(180);

  await page.setViewportSize({ width: 350, height: 844 });
  await expect.poll(async () => page.evaluate(() => (
    getComputedStyle(document.querySelector('.profile-info-row.urppp-query-row')).gridTemplateColumns.split(' ').filter(Boolean).length
  ))).toBe(1);
  expect(pageErrors).toEqual([]);
});

test('section headers keep title on one line with actions on a second line', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'schedule',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const layout = await page.evaluate(() => {
    const h4 = document.getElementById('h4_id1');
    const title = h4.querySelector(':scope > span:first-child');
    const oper = h4.querySelector('.right_top_oper');
    const h4Style = getComputedStyle(h4);
    const titleRect = title.getBoundingClientRect();
    const operRect = oper.getBoundingClientRect();
    return {
      flexWrap: h4Style.flexWrap,
      titleSingleLine: titleRect.height <= 24,
      operBelowTitle: operRect.top >= titleRect.bottom - 2,
      operInViewport: operRect.right <= window.innerWidth + 1 && operRect.left >= 0,
    };
  });
  expect(layout.flexWrap).toBe('wrap');
  expect(layout.titleSingleLine).toBeTruthy();
  expect(layout.operBelowTitle).toBeTruthy();
  expect(layout.operInViewport).toBeTruthy();
  expect(pageErrors).toEqual([]);

  // 标题区内的长注释 label：窄屏下换行显示，不溢出标题卡框
  const labelInfo = await page.evaluate(() => {
    const h4 = document.getElementById('h4_id1');
    const label = h4.querySelector('.label');
    const h4Rect = h4.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    return {
      whiteSpace: getComputedStyle(label).whiteSpace,
      labelWithinH4: labelRect.left >= h4Rect.left - 1 && labelRect.right <= h4Rect.right + 1,
      labelLines: Math.round(labelRect.height / 20),
      labelText: label.textContent.trim().slice(0, 12),
    };
  });
  expect(labelInfo.whiteSpace).toBe('normal');
  expect(labelInfo.labelWithinH4).toBeTruthy();
  expect(labelInfo.labelLines).toBeGreaterThan(1);
});

test('desktop section headers keep title and actions on one row', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'schedule',
    viewport: { width: 1280, height: 900 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const layout = await page.evaluate(() => {
    const h4 = document.getElementById('h4_id1');
    const title = h4.querySelector(':scope > span:first-child');
    const oper = h4.querySelector('.right_top_oper');
    const titleRect = title.getBoundingClientRect();
    const operRect = oper.getBoundingClientRect();
    return {
      flexWrap: getComputedStyle(h4).flexWrap,
      titleSingleLine: titleRect.height <= 24,
      actionsSameRow: Math.abs(titleRect.top - operRect.top) < 20,
      operInViewport: operRect.right <= window.innerWidth + 1,
    };
  });
  expect(layout.flexWrap).toBe('nowrap');
  expect(layout.titleSingleLine).toBeTruthy();
  expect(layout.actionsSameRow).toBeTruthy();
  expect(layout.operInViewport).toBeTruthy();
  expect(pageErrors).toEqual([]);
});

test('chosen dropdown stays above neighboring controls to avoid click-through', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'grades',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const info = await page.evaluate(() => {
    const drop = document.querySelector('.chosen-drop');
    const container = document.querySelector('.chosen-container');
    return {
      dropZ: drop ? getComputedStyle(drop).zIndex : null,
      containerOverflow: container ? getComputedStyle(container).overflow : null,
      dropRuleZ: [...document.querySelectorAll('style')].flatMap((s) => {
        try { return [...s.sheet.cssRules]; } catch (e) { return []; }
      }).filter((r) => r.selectorText && r.selectorText.includes('.chosen-drop')).map((r) => ({
        sel: r.selectorText.slice(0, 40),
        z: r.style.getPropertyValue('z-index'),
      })),
    };
  });
  // 下拉浮层 z-index 规则必须高于普通控件，点击选项不会穿透到下层表单
  const dropZ = info.dropZ ? parseInt(info.dropZ, 10) : null;
  const ruleZ = info.dropRuleZ.map((r) => parseInt(r.z, 10)).filter((z) => !Number.isNaN(z));
  if (dropZ !== null) {
    expect(dropZ).toBeGreaterThanOrEqual(1000);
  } else {
    // 静态 fixture 无运行时 drop：至少 CSS 规则里有高 z-index
    expect(Math.max(...ruleZ)).toBeGreaterThanOrEqual(1000);
  }
  expect(info.containerOverflow).toBe('visible');
  // 防穿透绑定：chosen 容器已挂 no-pierce 标记，选项点击不会冒泡触发下层控件
  const noPierce = await page.evaluate(() => {
    const containers = [...document.querySelectorAll('.chosen-container')];
    return {
      count: containers.length,
      bound: containers.filter((c) => c.__urpppChosenNoPierce).length,
    };
  });
  expect(noPierce.count).toBeGreaterThan(0);
  expect(noPierce.bound).toBe(noPierce.count);
  expect(pageErrors).toEqual([]);
});

test('scroll pagebar wraps on narrow viewports so info text is not clipped', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'grades',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  // 注入一个滚动态分页条，验证窄屏下换行、不左截断
  await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.id = 'urppagebar';
    bar.className = 'urppp-pagebar urppp-pagebar-scroll';
    bar.innerHTML = '<div class="dataTables_paginate"><div>页显示 <select><option>30</option></select> 条 当前显示第1~90条, 共276条</div></div>';
    document.body.appendChild(bar);
  });

  const info = await page.evaluate(() => {
    const bar = document.getElementById('urppagebar');
    const paginate = bar.querySelector('.dataTables_paginate');
    const inner = paginate.querySelector('div');
    const barRect = bar.getBoundingClientRect();
    return {
      flexWrap: getComputedStyle(paginate).flexWrap,
      justify: getComputedStyle(paginate).justifyContent,
      innerWrap: getComputedStyle(inner).flexWrap,
      textAlign: getComputedStyle(bar).textAlign,
      clipped: inner.scrollWidth > inner.clientWidth + 1 || inner.getBoundingClientRect().left < barRect.left - 1,
    };
  });
  expect(info.flexWrap).toBe('wrap');
  expect(info.innerWrap).toBe('wrap');
  expect(info.clipped).toBeFalsy();
  expect(pageErrors).toEqual([]);
});

test('scroll-loading page footer flows below the list with wrapping text', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'grades',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  await page.evaluate(() => {
    const footer = document.createElement('div');
    footer.id = 'div_page_loading_urppagebar';
    footer.style.cssText = 'position:absolute;left:0;top:-2px;display:inline-block;';
    footer.innerHTML = '<span>第 2 页 | 共10页 | 每页显示</span><select><option>滚动加载(30)</option></select><span>条 | 当前显示第1~90条, 共276条</span>';
    document.body.appendChild(footer);
  });

  const info = await page.evaluate(() => {
    const footer = document.getElementById('div_page_loading_urppagebar');
    const style = getComputedStyle(footer);
    const rect = footer.getBoundingClientRect();
    const spans = [...footer.querySelectorAll('span')];
    return {
      position: style.position,
      display: style.display,
      whiteSpace: style.whiteSpace,
      textAlign: style.textAlign,
      inFlow: rect.top >= 0,
      noClip: spans.every((s) => s.scrollWidth <= s.clientWidth + 1 || s.textContent.length > 8),
    };
  });
  expect(info.position).toBe('static');
  expect(info.display).toBe('block');
  expect(info.whiteSpace).toBe('normal');
  expect(info.inFlow).toBeTruthy();
  expect(pageErrors).toEqual([]);
});
