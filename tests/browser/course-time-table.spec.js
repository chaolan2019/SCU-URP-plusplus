import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 选课页的时间筛选器（#div_kb > #myselectTable > #courseTable）整块隔离。
 * 它由 coursetable 自行渲染，靠内联背景色标出「已占用时段」：
 * 一旦被主题色覆盖、或被包一层、或内联样式被清洗，整张网格就只剩空架子。
 */

const OCCUPIED = 'rgb(91, 127, 166)';
// 暗色下若被主题色吃掉，读到的是 --surface
const DARK_SURFACE = 'rgb(28, 28, 30)';

function cellBackground(page, id) {
  return page.evaluate((cellId) => {
    const cell = document.getElementById(cellId);
    return {
      computed: getComputedStyle(cell).backgroundColor,
      priority: cell.style.getPropertyPriority('background-color'),
    };
  }, id);
}

test('选课页课表：已占用时段的内联背景不被主题色覆盖', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  const occupied = await cellBackground(page, 'occupied-cell');
  const free = await cellBackground(page, 'free-cell');

  // 占用格保留站点写入的颜色，且是内联 !important（否则压不过样式表）
  expect(occupied.computed).toBe(OCCUPIED);
  expect(occupied.priority).toBe('important');
  // 空闲格没有站点标记，仍跟随主题底色；关键是两格看得出区别
  expect(free.computed).toBe(DARK_SURFACE);
  expect(occupied.computed).not.toBe(free.computed);
});

test('选课页课表：站点重写底色后提权仍跟随', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  // 模拟 coursetable 重新标记某一格：写入会顶掉上一次性
  await page.evaluate(() => {
    document.getElementById('occupied-cell').style.backgroundColor = 'rgb(10, 20, 30)';
  });

  await expect
    .poll(async () => (await cellBackground(page, 'occupied-cell')).computed)
    .toBe('rgb(10, 20, 30)');
  expect((await cellBackground(page, 'occupied-cell')).priority).toBe('important');
});

test('选课页课表：站点清掉底色时不残留提权', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  await page.evaluate(() => {
    document.getElementById('occupied-cell').style.removeProperty('background-color');
  });

  await expect
    .poll(async () => (await cellBackground(page, 'occupied-cell')).priority)
    .toBe('');
});

test('选课页课表：表格不被包裹，交由 coursetable 自行管理 DOM', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  const state = await page.evaluate(() => {
    const table = document.querySelector('#courseTable');
    return {
      // 美化会把业务表格包进 .table-box；课表必须保持原样，
      // 否则 coursetable 后续找不到自己的表体，填不出数据
      wrapped: !!table.closest('.table-box'),
      parentId: table.parentElement ? table.parentElement.id : '',
      tbodyKept: !!document.querySelector('#courseTableBody'),
    };
  });

  expect(state.wrapped).toBe(false);
  expect(state.parentId).toBe('myselectTable');
  expect(state.tbodyKept).toBe(true);
});
