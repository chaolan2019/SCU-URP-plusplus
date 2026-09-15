import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 选课页的时间筛选器（#div_kb > #myselectTable > #courseTable）整块隔离。
 * 它由 coursetable 自行渲染，「已占用 / 空闲」全靠单元格的内联底色表达：
 * 一旦被主题色覆盖、或被清洗掉，整片就只剩一种颜色，看上去像没有数据。
 */

const OCCUPIED = 'rgb(142, 189, 221)'; // #8EBDDD
const FREE = 'rgb(200, 210, 216)'; // #C8D2D8，浅色，正是会被清洗掉的那种

function cellState(page, id) {
  return page.evaluate((cellId) => {
    const cell = document.getElementById(cellId);
    return {
      computed: getComputedStyle(cell).backgroundColor,
      priority: cell.style.getPropertyPriority('background-color'),
    };
  }, id);
}

// 站点写下的两种底色都必须留下：占用色是深色，空闲色是浅色，各走一条覆盖路径
async function expectMarksSurvive(page) {
  expect((await cellState(page, 'occupied-cell')).computed).toBe(OCCUPIED);
  expect((await cellState(page, 'free-cell')).computed).toBe(FREE);
  expect((await cellState(page, 'occupied-cell-2')).computed).toBe(OCCUPIED);
  expect((await cellState(page, 'free-cell-2')).computed).toBe(FREE);
}

test('选课页课表：占用与空闲的内联底色都不被主题色覆盖', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  await expectMarksSurvive(page);
  // 提权过才压得住样式表里的 !important
  expect((await cellState(page, 'free-cell')).priority).toBe('important');
});

test('选课页课表：editorial 皮肤的 transparent 覆盖也压不过站点标记', async ({ page }) => {
  // editorial 用 `#courseTable td { background: transparent !important }` 换取卡片通透，
  // 这张网格不是卡片，不能跟着透明
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_skin_v1: 'editorial' },
  });

  await expectMarksSurvive(page);
});

test('选课页课表：站点重写底色后提权仍跟随', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  // 模拟 coursetable 重新标记某一格：写入会顶掉上一次性
  await page.evaluate(() => {
    document.getElementById('free-cell').style.backgroundColor = 'rgb(10, 20, 30)';
  });

  await expect
    .poll(async () => (await cellState(page, 'free-cell')).computed)
    .toBe('rgb(10, 20, 30)');
  expect((await cellState(page, 'free-cell')).priority).toBe('important');
});

test('选课页课表：站点清掉底色时不残留提权', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  await page.evaluate(() => {
    document.getElementById('occupied-cell').style.removeProperty('background-color');
  });

  await expect
    .poll(async () => (await cellState(page, 'occupied-cell')).priority)
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
