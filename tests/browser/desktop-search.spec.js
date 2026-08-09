import { expect, test } from '@playwright/test';
import { FIXTURE_URLS, loadUrpFixture } from './support/urp-fixture.js';

test('desktop search opens native input with stable placement and no self-built list', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'home',
    viewport: { width: 1280, height: 900 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  const button = page.locator('#clickdiv');
  const panel = page.locator('#form-search');
  const input = page.locator('#search-input');
  await expect(button).toHaveAttribute('aria-label', '搜索功能');
  await expect(panel).toHaveCSS('width', '0px');
  await expect(input).toHaveCSS('border-top-width', '1px');

  // 按钮插在“帮助/客服”按钮左边，form-search 留在按钮所在 li 内
  const positions = await page.evaluate(() => {
    const searchItem = document.querySelector('#intellegenceUDiv')?.closest('li');
    const helpItem = Array.from(document.querySelectorAll('.ace-nav > li')).find((li) => {
      const a = li.querySelector(':scope > a');
      return a && (a.getAttribute('href') || '').includes('customerServiceCenter');
    });
    return {
      searchBeforeHelp: searchItem && helpItem ? (searchItem.compareDocumentPosition(helpItem) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 : false,
      formInsideLi: document.getElementById('form-search')?.closest('li') === searchItem,
      buttonLeft: getComputedStyle(document.getElementById('clickdiv')).left,
      formTransparent: getComputedStyle(document.getElementById('form-search')).backgroundColor === 'rgba(0, 0, 0, 0)',
      noSelfBuiltList: !document.getElementById('urppp-search-results'),
    };
  });
  expect(positions.searchBeforeHelp).toBeTruthy();
  expect(positions.formInsideLi).toBeTruthy();
  expect(positions.buttonLeft).toBe('8px');
  expect(positions.formTransparent).toBeTruthy();
  expect(positions.noSelfBuiltList).toBeTruthy();

  await button.click();
  await expect(panel).toHaveAttribute('data-open', '1');
  await expect(input).toBeFocused();
  await expect(panel).toHaveCSS('width', /px/);
  // 宽度上限 240px（短一点），right 24px（往右一点）
  const rects = await page.evaluate(() => {
    const panelEl = document.getElementById('form-search');
    const inputEl = document.getElementById('search-input');
    return {
      panelWidth: Math.round(panelEl.getBoundingClientRect().width),
      inputWidth: Math.round(inputEl.getBoundingClientRect().width),
      right: getComputedStyle(panelEl).right,
    };
  });
  expect(rects.panelWidth).toBeLessThanOrEqual(240);
  expect(rects.right).toBe('24px');
  expect(pageErrors).toEqual([]);
});

test('desktop search is rebound after business-page navbar replacement', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'home',
    viewport: { width: 1280, height: 900 },
    values: { urppp_skin_v1: 'neu', urppp_theme_v3: 'default' },
  });

  await page.evaluate((nextUrl) => {
    const navbar = document.getElementById('navbar');
    navbar.outerHTML = `
      <nav class="navbar navbar-default navbar-fixed-top" id="navbar">
        <div class="navbar-header"><a class="navbar-brand" href="/index">URP Fixture</a></div>
        <ul class="ace-nav"></ul>
      </nav>`;
    const root = document.getElementById('page-content-template');
    root.innerHTML = '<div class="breadcrumb">综合查询 / 成绩查询</div><h4>历年成绩</h4>';
    history.pushState({ fixture: true }, '', nextUrl);
  }, FIXTURE_URLS.grades);

  const button = page.locator('#clickdiv');
  const input = page.locator('#search-input');
  await expect(button).toHaveCount(1);
  await button.click();
  await expect(input).toBeFocused();
  expect(pageErrors).toEqual([]);
});
