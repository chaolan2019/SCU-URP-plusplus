import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * favicon 跟着美化一起隔离。
 *
 * @match 为了兼容脚本运行环境覆盖了 https://*.scu.edu.cn/*，主站美化限定在教务两个入口；
 * 品牌 favicon 属于品牌行为，同样只该出现在教务系统上——其他 SCU 站点保持站方标签页图标。
 *
 * 隔离判据是「协议为 http 且主机名在教务集合内」，所以这里四个方向都覆盖：
 * 非教务的 https、非教务的 http、统一认证页（只注入辅助插件）、以及教务本身。
 */

function faviconHrefs(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('link[rel]'))
    .filter((link) => {
      const rel = (link.getAttribute('rel') || '').toLowerCase();
      return rel.includes('icon') && !rel.includes('apple-touch');
    })
    .map((link) => link.getAttribute('href') || ''));
}

function expectSiteFaviconIntact(hrefs) {
  expect(hrefs).toContain('/favicon-site.ico');
  expect(hrefs.filter((href) => href.startsWith('data:image/png;base64,'))).toHaveLength(0);
}

// 非教务域名上主脚本在隔离判据处就退出了，连就绪标记都不该打
async function expectPluginNotStarted(page) {
  const className = (await page.locator('html').getAttribute('class')) || '';
  expect(className).not.toContain('urppp-ready');
}

test('favicon：非教务的 https SCU 站点保持站方图标', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'favicon-scope',
    url: 'https://jwc.scu.edu.cn/cdxl.htm',
    expectReady: false,
  });
  expectSiteFaviconIntact(await faviconHrefs(page));
  await expectPluginNotStarted(page);
});

test('favicon：非教务的 http SCU 站点保持站方图标', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'favicon-scope',
    url: 'http://jwc.scu.edu.cn/cdxl.htm',
    expectReady: false,
  });
  expectSiteFaviconIntact(await faviconHrefs(page));
  await expectPluginNotStarted(page);
});

test('favicon：统一认证页（只注入辅助插件）保持站方图标', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'favicon-scope',
    url: 'https://id.scu.edu.cn/auth/login',
    expectReady: false,
  });
  expectSiteFaviconIntact(await faviconHrefs(page));
  await expectPluginNotStarted(page);
});

test('favicon：教务系统仍然换成品牌图标', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'favicon-scope', url: 'http://zhjw.scu.edu.cn/index' });
  const hrefs = await faviconHrefs(page);
  expect(hrefs.filter((href) => href.startsWith('data:image/png;base64,'))).toHaveLength(1);
  expect(hrefs).not.toContain('/favicon-site.ico');
});
