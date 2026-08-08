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
    await expect(page.locator('#urppp-mobile-quick .urppp-mobile-tool-button')).toHaveText(['客服', '搜索']);

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

    const lines = await page.locator('#navbar .menu-toggler .icon-bar').evaluateAll((elements) => (
      elements.map((element) => {
        const style = getComputedStyle(element);
        return { width: style.width, height: style.height, marginTop: style.marginTop, marginBottom: style.marginBottom };
      })
    ));
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toEqual({ width: '14px', height: '1px', marginTop: '2px', marginBottom: '2px' });
    }

    await page.locator('#navbar .menu-toggler').click();
    await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);
    await expect(page.locator('#urppp-mobile-user')).toBeVisible();
    await expect(page.locator('#urppp-mobile-user .urppp-mobile-user-action')).toHaveText([
      '首页', '在线反馈', '修改密码', '注销',
    ]);

    await page.locator('#urppp-mobile-search-button').click();
    await expect(page.locator('#urppp-mobile-search-panel')).toBeVisible();
    await expect(page.locator('#urppp-mobile-search-panel #search-input')).toBeFocused();

    await page.locator('#sidebar .urppp-sidebar-toggle').click();
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
