import { expect, test } from '@playwright/test';
import { FIXTURE_URLS, loadUrpFixture } from './support/urp-fixture.js';

const skinShapes = {
  apple: { actionRadius: '999px', menuRadius: '12px', shadow: true },
  flat: { actionRadius: '0px', menuRadius: '0px', shadow: false },
  organic: { actionRadius: '999px', menuRadius: '14px', shadow: false },
  brutal: { actionRadius: '0px', menuRadius: '0px', shadow: true },
  editorial: { actionRadius: '0px', menuRadius: '0px', shadow: false },
  neu: { actionRadius: '12px', menuRadius: '12px', shadow: true },
};

for (const [skin, expectedShape] of Object.entries(skinShapes)) {
  test(`mobile navbar applies ${skin} skin shape`, async ({ page }) => {
    const { pageErrors } = await loadUrpFixture(page, {
      fixture: 'mobile-home',
      viewport: { width: 390, height: 844 },
      values: { urppp_skin_v1: skin, urppp_theme_v3: 'default' },
    });

    await expect(page.locator('html')).toHaveAttribute('data-urppp-skin', skin);
    await expect(page.locator('#urppp-mobile-user')).toHaveCount(1);
    await expect(page.locator('#urppp-mobile-user .urppp-mobile-user-action')).toHaveCount(4);
    await expect(page.locator('#urppp-mobile-quick .urppp-mobile-tool-button')).toHaveText(['帮助', '搜索']);
    await expect(page.locator('#navbar #urppp-nav-theme')).toBeVisible();
    await expect(page.locator('#navbar #urppp-nav-theme .urppp-nav-dot')).toHaveCount(3);
    await expect(page.locator('#navbar #urppp-nav-settings')).toBeVisible();
    await expect(page.locator('#sidebar .urppp-sidebar-header')).toBeHidden();

    const shape = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const menu = getComputedStyle(document.querySelector('#navbar .menu-toggler'));
      const clean = getComputedStyle(document.querySelector('#urppp-nav-clean'));
      return {
        actionToken: root.getPropertyValue('--urppp-action-radius').trim(),
        menuToken: root.getPropertyValue('--urppp-menu-radius').trim(),
        actionRadius: clean.borderRadius,
        menuRadius: menu.borderRadius,
        actionShadow: clean.boxShadow,
        menuShadow: menu.boxShadow,
      };
    });
    expect(shape.actionToken).toBe(expectedShape.actionRadius);
    expect(shape.menuToken).toBe(expectedShape.menuRadius);
    expect(shape.actionRadius).toBe(expectedShape.actionRadius);
    expect(shape.menuRadius).toBe(expectedShape.menuRadius);
    if (expectedShape.shadow) {
      expect(shape.actionShadow).not.toBe('none');
      expect(shape.menuShadow).not.toBe('none');
    } else {
      expect(shape.actionShadow).toBe('none');
      expect(shape.menuShadow).toBe('none');
    }

    const compactLayout = await page.evaluate(() => {
      const menuRect = document.querySelector('#navbar .menu-toggler').getBoundingClientRect();
      const cleanRect = document.querySelector('#urppp-nav-clean').getBoundingClientRect();
      const navbarRect = document.querySelector('#navbar').getBoundingClientRect();
      const breadcrumb = document.querySelector('#breadcrumbs, .breadcrumb');
      const breadcrumbRect = breadcrumb?.getBoundingClientRect();
      return {
        menuWidth: Math.round(menuRect.width),
        menuHeight: Math.round(menuRect.height),
        cleanHeight: Math.round(cleanRect.height),
        cleanGap: Math.round(window.innerWidth - cleanRect.right),
        breadcrumbGap: breadcrumbRect ? Math.round(breadcrumbRect.top - navbarRect.bottom) : null,
        containerPaddingTop: getComputedStyle(document.querySelector('#main-container')).paddingTop,
      };
    });
    expect(compactLayout).toEqual({
      menuWidth: 28,
      menuHeight: 28,
      cleanHeight: 28,
      cleanGap: expect.any(Number),
      breadcrumbGap: expect.any(Number),
      containerPaddingTop: '0px',
    });
    expect(compactLayout.cleanGap).toBeGreaterThanOrEqual(8);
    expect(compactLayout.breadcrumbGap).toBeLessThanOrEqual(20);

    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-open path')).toHaveCount(2);
    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-close path')).toHaveCount(2);
    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-open')).toBeVisible();
    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-close')).toBeHidden();

    const helpAlignment = await page.locator('#urppp-mobile-quick .urppp-mobile-help-button').evaluate((button) => {
      const icon = button.querySelector('i');
      const buttonRect = button.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      return {
        offset: Math.abs((buttonRect.top + buttonRect.height / 2) - (iconRect.top + iconRect.height / 2)),
        top: getComputedStyle(icon).top,
      };
    });
    expect(helpAlignment.offset).toBeLessThanOrEqual(1);
    expect(helpAlignment.top).toBe('auto');

    await page.locator('#navbar .menu-toggler').click();
    await expect(page.locator('#navbar .menu-toggler')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-open')).toBeHidden();
    await expect(page.locator('#navbar .menu-toggler .urppp-menu-icon-close')).toBeVisible();
    await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);
    await expect(page.locator('#urppp-mobile-user')).toBeVisible();
    await expect(page.locator('#urppp-mobile-user .urppp-mobile-user-action')).toHaveText([
      '首页', '在线反馈', '修改密码', '注销',
    ]);

    await page.locator('#urppp-mobile-search-button').click();
    await expect(page.locator('#urppp-mobile-search-panel')).toBeVisible();
    await expect(page.locator('#urppp-mobile-search-panel #search-input')).toBeFocused();
    const searchPlacement = await page.locator('#urppp-mobile-search-panel').evaluate((panel) => {
      const row = panel.previousElementSibling;
      const panelRect = panel.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      return {
        directlyAfterTools: row.classList.contains('urppp-mobile-tool-row'),
        widthDifference: Math.abs(panelRect.width - rowRect.width),
      };
    });
    expect(searchPlacement.directlyAfterTools).toBe(true);
    expect(searchPlacement.widthDifference).toBeLessThanOrEqual(1);

    await page.locator('#navbar .menu-toggler').click();
    await expect(page.locator('#navbar .menu-toggler')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/);

    if (skin === 'flat') {
      await expect(page.locator('#urppp-dashboard .urppp-stat-card')).toHaveCount(5);
      const cards = await page.locator('#urppp-dashboard .urppp-stat-card').evaluateAll((elements) => (
        elements.map((element) => {
          const style = getComputedStyle(element);
          return { radius: style.borderRadius, width: style.borderTopWidth, shadow: style.boxShadow };
        })
      ));
      for (const card of cards) expect(card).toEqual({ radius: '0px', width: '2px', shadow: 'none' });
    }

    expect(pageErrors).toEqual([]);
  });
}

test('mobile navbar and sidebar survive business-page route replacement', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'apple', urppp_theme_v3: 'default' },
  });

  await page.locator('#navbar .menu-toggler').click();
  await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);

  await page.evaluate((nextUrl) => {
    const navbar = document.getElementById('navbar');
    navbar.outerHTML = `
      <nav class="navbar navbar-default navbar-fixed-top" id="navbar">
        <div class="navbar-header"><a class="navbar-brand" href="/index"><small>四川大学教务管理系统</small></a></div>
        <ul class="ace-nav"></ul>
      </nav>`;
    const root = document.getElementById('page-content-template');
    root.innerHTML = '<div class="breadcrumb">综合查询 / 成绩查询</div><h4>历年成绩</h4><table><tr><td>fixture</td></tr></table>';
    history.pushState({ fixture: true }, '', nextUrl);
  }, FIXTURE_URLS.grades);

  await expect(page.locator('#navbar')).toBeVisible();
  await expect(page.locator('#navbar .menu-toggler')).toHaveCount(1);
  await expect(page.locator('#navbar #urppp-nav-theme')).toBeVisible();
  await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/);

  const navbarStyle = await page.locator('#navbar').evaluate((navbar) => {
    const style = getComputedStyle(navbar);
    const rect = navbar.getBoundingClientRect();
    return { position: style.position, top: Math.round(rect.top), height: Math.round(rect.height) };
  });
  expect(navbarStyle).toEqual({ position: 'fixed', top: 0, height: 44 });

  await page.locator('#navbar .menu-toggler').click();
  await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);
  await expect(page.locator('#sidebar #urppp-menus .urppp-nav-link').first()).toBeVisible();
  await page.locator('#navbar .menu-toggler').click();
  await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/);

  for (const routeUrl of [FIXTURE_URLS.schedule, FIXTURE_URLS.evaluation, FIXTURE_URLS['free-classroom']]) {
    await page.evaluate((nextUrl) => {
      const root = document.getElementById('page-content-template');
      root.innerHTML = '<div class="breadcrumb">业务页面</div><h4>页面内容</h4>';
      history.pushState({ fixture: true }, '', nextUrl);
    }, routeUrl);
    await expect(page.locator('#navbar')).toBeVisible();
    await expect(page.locator('#navbar .menu-toggler')).toHaveCount(1);
    await expect(page.locator('#navbar #urppp-nav-theme')).toBeVisible();
    await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/);
    await page.locator('#navbar .menu-toggler').click();
    await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);
    await page.locator('#navbar .menu-toggler').click();
    await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/);
  }
  expect(pageErrors).toEqual([]);
});
