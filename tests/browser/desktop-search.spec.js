import { expect, test } from '@playwright/test';
import { FIXTURE_URLS, loadUrpFixture } from './support/urp-fixture.js';

test('desktop search opens with stable styling and renders menu results', async ({ page }) => {
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

  await button.click();
  await expect(panel).toHaveAttribute('data-open', '1');
  await expect(input).toBeFocused();
  await expect(panel).toHaveCSS('width', /px/);

  await input.fill('首页');
  await expect(page.locator('#urppp-search-results .urppp-search-result')).toHaveCount(1);
  await expect(page.locator('#urppp-search-results .urppp-search-result')).toHaveText('首页');
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
  await input.fill('首页');
  await expect(page.locator('#urppp-search-results .urppp-search-result')).toHaveText('首页');
  expect(pageErrors).toEqual([]);
});
