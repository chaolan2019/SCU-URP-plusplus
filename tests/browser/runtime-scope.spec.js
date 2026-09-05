import { expect, test } from '@playwright/test';
import { USERSCRIPT_PATH } from './support/urp-fixture.js';

test('broad SCU match does not beautify unrelated SCU hosts', async ({ page }) => {
  await page.route('http://other.scu.edu.cn/**', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><head><title>Other SCU site</title></head><body><main>other site</main></body></html>',
  }));
  await page.goto('http://other.scu.edu.cn/index');
  await page.addScriptTag({ path: USERSCRIPT_PATH });

  await expect(page.locator('#urppp-boot-loader')).toHaveCount(0);
  await expect(page.locator('#urppp-internal-style')).toHaveCount(0);
  await expect(page.locator('#urppp-navigation-style')).toHaveCount(0);
  await expect(page.locator('#urppp-mobile-menu-button')).toHaveCount(0);
  expect(await page.evaluate(() => ({
    mobileClass: document.documentElement.classList.contains('urppp-mobile'),
    hasApi: !!window.urppp,
    bodyClass: document.body.className,
  }))).toEqual({ mobileClass: false, hasApi: false, bodyClass: '' });
});
