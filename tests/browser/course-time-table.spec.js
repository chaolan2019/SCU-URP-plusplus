import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 选课页的时间筛选器（#soliderbox 里的 #courseTable）。
 *
 * 它和周课表由同一套站点组件渲染，容器 id 也一样，但页面上没有 #mycoursetable。
 * 插件的卡片布局纠正只对周课表有意义（找不到 #mycoursetable 就直接返回），所以在这页
 * 必须不去碰站点的 divBuild：一经换掉，站点就没机会把空闲格刷回浅灰，整片只剩一种颜色。
 */

const OCCUPIED = 'rgb(142, 189, 221)'; // #8EBDDD
const FREE = 'rgb(200, 210, 216)'; // #C8D2D8

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

  expect(await page.evaluate(() => window.__divBuildRuns)).toBeGreaterThan(before);
  expect((await cellState(page, '1_1')).computed).toBe(OCCUPIED);
  expect((await cellState(page, '2_1')).computed).toBe(FREE);
  expect((await cellState(page, '1_2')).computed).toBe(FREE);
  expect((await cellState(page, '2_2')).computed).toBe(OCCUPIED);
});

test('时间筛选器：渲染期间不把课表留在隐藏状态', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  await page.click('#open-filter');

  // 为了让站点原逻辑的中间态不被画出来，渲染期间会临时隐藏容器；必须恢复
  const visibility = await page.evaluate(() => document.getElementById('soliderbox').style.visibility);
  expect(visibility).toBe('');
});

test('时间筛选器：站点用 !important 写下的底色不被清洗', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'course-time-table',
    values: { urppp_theme_v3: 'dark' },
  });

  await page.click('#open-filter');

  // 清理浅色内联背景的规则只针对站点随手写的浅色；它显式加了 !important 就不该动
  expect((await cellState(page, '2_1')).inline).toBe(FREE);
  expect((await cellState(page, '2_1')).computed).toBe(FREE);
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
