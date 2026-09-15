import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 选课页的时间筛选器（iframe 里的 #courseTable）。
 *
 * 站点用单元格的内联底色表达信息：可选的时段刷成 #8EBDDD，已被课程占用的留空。
 * 它写的是普通内联值（不带 !important），所以只要皮肤或主题往同一批格子上写
 * `background: transparent !important`，信息就被整片擦掉，网格看上去像没有数据。
 */

const FREE_SLOT = 'rgb(142, 189, 221)'; // 站点给可选时段写的底色
const TAKEN_SLOT = 'rgba(0, 0, 0, 0)'; // 已被占用：留空，由里面的课程卡片表达
const DARK_SURFACE = 'rgb(28, 28, 30)';

function cellState(page, id) {
  return page.evaluate((cellId) => {
    const cell = document.getElementById(cellId);
    return {
      computed: getComputedStyle(cell).backgroundColor,
      inline: cell.style.getPropertyValue('background-color'),
    };
  }, id);
}

test('时间筛选器：插件不接管这页的 divBuild，站点自己的渲染照常执行', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  const before = await page.evaluate(() => window.__divBuildRuns);
  // 这页没有 #mycoursetable 的卡片要摆，插件不该动站点的渲染函数
  expect(await page.evaluate(() => window.divBuild._urppp)).toBeUndefined();

  await page.click('#open-filter');

  expect(await page.evaluate(() => window.__divBuildRuns)).toBeGreaterThan(before);
  // 站点写下的两种底色都要留下：可选 = 蓝，占用 = 空
  expect((await cellState(page, '2_1')).computed).toBe(FREE_SLOT);
  expect((await cellState(page, '1_1')).computed).toBe(TAKEN_SLOT);
});

test('时间筛选器：editorial 皮肤不擦掉站点写在格子上的底色', async ({ page }) => {
  // editorial 用 `background: transparent !important` 铺平表格，为周课表卡片让路；
  // 套到这块网格上就等于把信息擦掉
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_skin_v1: 'editorial' },
  });

  await page.click('#open-filter');

  expect((await cellState(page, '2_1')).computed).toBe(FREE_SLOT);
  expect((await cellState(page, '1_2')).computed).toBe(FREE_SLOT);
  expect((await cellState(page, '1_1')).computed).toBe(TAKEN_SLOT);
});

test('时间筛选器：清理浅色内联底色的规则不删站点写的值', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  await page.click('#open-filter');

  // 暗色下的主题规则仍会接管格子的呈现，但站点的值本身不该被删掉
  expect((await cellState(page, '2_1')).inline).toBe(FREE_SLOT);
  expect((await cellState(page, '1_1')).inline).toBe(TAKEN_SLOT);
});

test('周课表：需要接管卡片布局时，站点的渲染函数仍会被调用', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'schedule' });

  // 这页有 #mycoursetable，插件会接管 divBuild 以纠正卡片几何
  expect(await page.evaluate(() => window.divBuild._urppp)).toBe(true);

  const before = await page.evaluate(() => window.__nativeDivBuildCalls);
  await page.evaluate(() => window.divBuild());

  // 接管不等于丢掉：站点原逻辑必须先跑完（它不只摆位，还会写渲染结果）
  expect(await page.evaluate(() => window.__nativeDivBuildCalls)).toBeGreaterThan(before);
});

test('时间筛选器：容器的 DOM 不被插件改写', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  const state = await page.evaluate(() => {
    const table = document.querySelector('#courseTable');
    return {
      wrapped: !!table.closest('.table-box'),
      parentId: table.parentElement ? table.parentElement.id : '',
      cellCount: document.querySelectorAll('#courseTableBody td').length,
    };
  });

  expect(state.wrapped).toBe(false);
  expect(state.parentId).toBe('soliderbox');
  expect(state.cellCount).toBe(4);
});

test('时间筛选器：站点用 !important 写下的底色不被清洗', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  await page.click('#open-filter');
  // 渲染完再写入。清理浅色内联背景的规则只看颜色浅不浅，
  // 站点显式写了 !important 就等于声明「这个底色有用」
  await page.evaluate(() => {
    document.getElementById('2_1').style.setProperty('background-color', '#C8D2D8', 'important');
  });
  // 清洗由 style 变更触发，带 120ms 防抖
  await page.waitForTimeout(400);

  const state = await cellState(page, '2_1');
  expect(state.inline).toBe('rgb(200, 210, 216)');
  expect(state.computed).not.toBe(DARK_SURFACE);
});
