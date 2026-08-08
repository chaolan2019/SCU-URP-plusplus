import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

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

    const cleanGap = await page.locator('#urppp-nav-clean').evaluate((button) => (
      Math.round(window.innerWidth - button.getBoundingClientRect().right)
    ));
    expect(cleanGap).toBeGreaterThanOrEqual(8);

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
