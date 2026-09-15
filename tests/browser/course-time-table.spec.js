import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 选课页的时间筛选器（#soliderbox 里的 #courseTable）。
 *
 * 站点先把整片网格画成同一个底色，「空闲」要等它自己的渲染函数 divBuild 再刷回浅灰；
 * 占用与空闲的区别只用单元格的 title 表达。插件把 divBuild 换成自己的布局函数之后，
 * 这一步就不再执行，整片网格只剩一种颜色，看上去像没有数据。
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

test('时间筛选器：展开后站点自己的渲染仍被执行，空闲格刷回浅灰', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'course-time-table' });

  const before = await page.evaluate(() => window.__divBuildRuns);
  // 先确认插件确实换掉了这个函数名，否则下面的断言只是空转
  expect(await page.evaluate(() => window.divBuild._urppp)).toBe(true);
  await page.click('#open-filter');

  // 插件换掉了 divBuild 这个函数名，但它必须把原函数放进去跑一遍
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
