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

test('mobile query fields use two columns and collapse to one on extra-narrow screens', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'grades',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const rows = page.locator('.profile-info-row.urppp-query-row');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator(':scope > .urppp-query-pair')).toHaveCount(3);
  await expect(rows.nth(1).locator(':scope > .urppp-query-pair')).toHaveCount(1);
  const inputStyle = await page.locator('#course-name').evaluate((element) => {
    const style = getComputedStyle(element);
    return { borderTopWidth: style.borderTopWidth, boxShadow: style.boxShadow };
  });
  expect(inputStyle.borderTopWidth).toBe('1px');
  expect(inputStyle.boxShadow).not.toBe('none');

  const mobileLayout = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.profile-info-row.urppp-query-row')];
    const first = rows[0];
    const second = rows[1];
    const pair = first.querySelector('.urppp-query-pair');
    const label = pair.querySelector('.profile-info-name').getBoundingClientRect();
    const value = pair.querySelector('.profile-info-value').getBoundingClientRect();
    const form = first.closest('.urppp-query-form, .profile-user-info');
    const firstStyle = getComputedStyle(first);
    const secondStyle = getComputedStyle(second);
    const firstRect = first.getBoundingClientRect();
    const secondRect = second.getBoundingClientRect();
    return {
      firstColumns: firstStyle.gridTemplateColumns.split(' ').filter(Boolean).length,
      secondColumns: secondStyle.gridTemplateColumns.split(' ').filter(Boolean).length,
      pairWidth: pair.getBoundingClientRect().width,
      labelWithValue: Math.abs(label.top - value.top) < 12 && label.bottom <= value.bottom,
      clipped: form.scrollWidth > form.clientWidth + 1,
      secondSpansFullRow: Math.abs(secondRect.width - firstRect.width) < 2,
    };
  });
  expect(mobileLayout.firstColumns).toBe(2);
  expect(mobileLayout.secondColumns).toBe(2);
  expect(mobileLayout.labelWithValue).toBeTruthy();
  expect(mobileLayout.clipped).toBeFalsy();
  expect(mobileLayout.pairWidth).toBeGreaterThan(140);
  // 单字段行占满整行（grid-column 1 / -1）
  expect(mobileLayout.secondSpansFullRow).toBeTruthy();

  await page.setViewportSize({ width: 350, height: 844 });
  await expect.poll(async () => page.evaluate(() => (
    getComputedStyle(document.querySelectorAll('.profile-info-row.urppp-query-row')[0]).gridTemplateColumns.split(' ').filter(Boolean).length
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
