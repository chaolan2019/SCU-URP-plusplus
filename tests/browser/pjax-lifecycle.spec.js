import { expect, test } from '@playwright/test';
import { FIXTURE_URLS, loadUrpFixture } from './support/urp-fixture.js';

const GENERIC_PAGE_HTML = `
  <div class="page-content" id="page-content-template">
    <div class="breadcrumb">综合查询 / 成绩查询</div>
    <h4 class="header">成绩查询</h4>
    <table class="table table-bordered" id="fixture-grade-table">
      <thead><tr><th>课程</th><th>成绩</th></tr></thead>
      <tbody><tr><td>示例课程</td><td>95</td></tr></tbody>
    </table>
  </div>`;

async function installNavigationShell(page) {
  await page.evaluate(() => {
    if (!document.getElementById('navbar')) {
      document.body.insertAdjacentHTML('afterbegin', `
        <nav class="navbar" id="navbar">
          <div class="navbar-header"><a class="navbar-brand" href="/index">URP Fixture</a></div>
          <ul class="ace-nav"></ul>
        </nav>`);
    }
    if (!document.getElementById('sidebar')) {
      document.body.insertAdjacentHTML('afterbegin', `
        <aside class="sidebar" id="sidebar">
          <ul class="nav nav-list" id="menus">
            <li id="menu-home"><a href="/index"><span class="menu-text">首页</span></a></li>
          </ul>
          <div class="sidebar-collapse" id="sidebar-collapse"></div>
        </aside>`);
    }
  });
}

async function replacePjaxRoot(page, html, url) {
  await page.evaluate(({ nextHtml, nextUrl }) => {
    const template = document.createElement('template');
    template.innerHTML = nextHtml.trim();
    const nextRoot = template.content.firstElementChild;
    const currentRoot = document.getElementById('page-content-template') || document.querySelector('.page-content');
    if (!currentRoot || !nextRoot) throw new Error('PJAX fixture root is missing');
    window.__urpDetachedFixtureRoots = window.__urpDetachedFixtureRoots || [];
    window.__urpDetachedFixtureRoots.push(currentRoot);
    currentRoot.replaceWith(nextRoot);
    history.pushState({ fixture: true }, '', nextUrl);
  }, { nextHtml: html, nextUrl: url });
}

async function expectSingletonUi(page) {
  await expect(page.locator('#urppp-nav-theme')).toHaveCount(1);
  await expect(page.locator('#urppp-nav-settings')).toHaveCount(1);
  await expect(page.locator('#urppp-settings-panel')).toHaveCount(1);
  await expect(page.locator('#urppp-settings-mask')).toHaveCount(1);
}

test('PJAX replacement remounts schedule UI without duplicate nodes or global listeners', async ({ page }) => {
  const { nativePageHtml, pageErrors } = await loadUrpFixture(page);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  await installNavigationShell(page);

  await page.evaluate(() => history.replaceState({ fixture: true }, '', location.pathname));
  await expect(page.locator('#urppp-nav-settings')).toHaveCount(1);

  await page.evaluate((url) => history.pushState({ fixture: true }, '', url), FIXTURE_URLS.grades);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(0);
  await expect(page.locator('#native-export')).toBeVisible();
  await expect(page.locator('[data-urppp-native-export-source]')).toHaveCount(0);
  await page.evaluate((url) => history.pushState({ fixture: true }, '', url), FIXTURE_URLS.schedule);
  await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
  await expect(page.locator('#native-export')).toBeHidden();

  const initialDiagnostics = await page.evaluate(() => window.__urpFixtureDiagnosticsSnapshot());

  for (let cycle = 0; cycle < 2; cycle += 1) {
    await replacePjaxRoot(page, GENERIC_PAGE_HTML, FIXTURE_URLS.grades);
    await expect(page.locator('#fixture-grade-table')).toHaveCount(1);
    await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(0);
    await expectSingletonUi(page);

    for (let openCount = 0; openCount < 2; openCount += 1) {
      await page.locator('#urppp-nav-settings').click();
      await expect(page.locator('#urppp-settings-panel')).toHaveClass(/open/);
      await expect(page.locator('#urppp-settings-mask')).toHaveClass(/open/);
      await page.locator('#urppp-settings-panel .urppp-set-close').click();
      await expect(page.locator('#urppp-settings-panel')).not.toHaveClass(/open/);
    }
    await expectSingletonUi(page);

    await replacePjaxRoot(page, nativePageHtml, FIXTURE_URLS.schedule);
    await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(1);
    await expectSingletonUi(page);
  }

  const finalDiagnostics = await page.evaluate(() => window.__urpFixtureDiagnosticsSnapshot());
  expect(finalDiagnostics.activeWindowListeners).toBe(initialDiagnostics.activeWindowListeners);
  expect(finalDiagnostics.activeDocumentListeners).toBe(initialDiagnostics.activeDocumentListeners);
  expect(finalDiagnostics.detachedObserverTargets).toEqual([]);
  expect(pageErrors).toEqual([]);
});
