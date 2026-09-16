import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 「菜单推荐」是站点顶栏里新增的入口，行为和作息时间表一样挂在内联 onclick 上：
 *
 *   <a data-toggle="dropdown" class="dropdown-toggle" href="#" onclick="openMenuRecommend();return false;">
 *
 * 移动端 / 清爽模式的快捷区靠克隆顶栏项来重建导航（ensureMobileQuick），但克隆循环有两处
 * 会把它漏掉：`dropdown-toggle` 一律跳过；onclick 白名单只认 openWorkRestSchedule。
 * 作息时间表能保留是因为它命中白名单且不带 dropdown-toggle。
 *
 * 位置不需要额外代码：克隆跟随顶栏顺序，而站点的顶栏正是「…作息时间表、当前日期、菜单推荐…」。
 * 因此这里只断言「紧跟当前日期」这个结果，不假设实现方式。
 */

const MOBILE = { width: 390, height: 844 };

function quickLinks(page) {
  return page.locator('#urppp-mobile-quick .urppp-mobile-quick-link');
}

function recommendLink(page) {
  return quickLinks(page).filter({ hasText: '菜单推荐' });
}

async function quickTexts(page) {
  // 用 textContent：快捷区在关着的抽屉里，innerText 对隐藏元素返回空串
  return page.evaluate(() => Array.from(document.querySelectorAll('#urppp-mobile-quick .urppp-mobile-quick-link'))
    .map((el) => (el.textContent || '').trim()));
}

async function expectRecommendAfterDate(page) {
  await expect(recommendLink(page)).toHaveCount(1);
  const texts = await quickTexts(page);
  const dateIndex = texts.findIndex((text) => /第\s*\d{1,2}\s*周/.test(text));
  expect(dateIndex, '快捷区里应当有当前日期那一行').toBeGreaterThanOrEqual(0);
  expect(texts[dateIndex + 1]).toBe('菜单推荐');
}

test('移动端侧边栏：菜单推荐紧跟当前日期，且能调到站点入口', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'mobile-home', viewport: MOBILE });
  await expectRecommendAfterDate(page);
  // 快捷区在抽屉里，先开抽屉
  await page.locator('#urppp-mobile-menu-button').click();
  await recommendLink(page).click();
  await expect.poll(() => page.evaluate(() => window.__urpppMenuRecommendCalls || 0)).toBeGreaterThan(0);
  // 站点该入口写成 href="#"：单独的 '#' 不是合法选择器，不得因此在点击处理里报错
  expect(pageErrors).toEqual([]);
});

test('清爽模式侧边栏：菜单推荐紧跟当前日期，且能调到站点入口', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: MOBILE,
    values: { urppp_clean_default_v1: true },
  });
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('urppp-clean-open'))).toBe(true);
  await expectRecommendAfterDate(page);
  await page.locator('#uc-menu-toggle').click();
  await recommendLink(page).click();
  await expect.poll(() => page.evaluate(() => window.__urpppMenuRecommendCalls || 0)).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test('点击 href="#" 的站点入口不应产生脚本错误', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'home' });
  // 站点大量入口用 href="#" 承接内联 onclick，插件在那个点击监听里做锚点解锁
  await page.evaluate(() => {
    const a = document.createElement('a');
    a.id = 'urppp-hash-anchor-probe';
    a.setAttribute('href', '#');
    a.textContent = '锚点入口';
    document.body.appendChild(a);
  });
  await page.locator('#urppp-hash-anchor-probe').click();
  // 顺带覆盖 hash 路由与非法 id：都不得抛选择器语法错误
  for (const hash of ['#/route', '#!', '#a b']) {
    await page.evaluate((value) => document.getElementById('urppp-hash-anchor-probe').setAttribute('href', value), hash);
    await page.locator('#urppp-hash-anchor-probe').click();
  }
  expect(pageErrors).toEqual([]);
});

test('快捷区不会把用户菜单这类下拉项带进来', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'mobile-home', viewport: MOBILE });
  const texts = await quickTexts(page);
  expect(texts.some((text) => /欢迎您/.test(text))).toBe(false);
});
