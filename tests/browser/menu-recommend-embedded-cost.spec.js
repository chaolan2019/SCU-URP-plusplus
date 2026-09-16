import { expect, test } from '@playwright/test';
import path from 'node:path';
import { loadUrpFixture, ROOT, USERSCRIPT_PATH } from './support/urp-fixture.js';

/**
 * 弹窗内层（宿主 layui iframe 装的智能应用推荐页）只该加载主题变量与专属样式。
 *
 * 这条守卫的来历：该页曾经连同整套美化样式一起加载——实测注入 311KB（含清爽模式、
 * 表格、导航、仪表盘）并额外发起 6 次联网请求（校历 ×3、商店目录 ×3），全部在和它
 * 自己的首屏抢主线程。收窄后为 26KB、0 请求，宿主「建层 → 放行」410ms → 190ms。
 * 阈值刻意留松：只拦「又把它当普通页面启动」这类回退，不拦少量新增。
 */

const MENU_RECOMMEND_URL = 'http://zhjw.scu.edu.cn/student/menu-recommend/page';
const LAYER_IFRAME_SELECTOR = '.layui-layer-iframe iframe[src*="menu-recommend"]';
const STYLE_BUDGET_BYTES = 60_000;

async function getLayerFrame(page) {
  for (let i = 0; i < 100; i += 1) {
    const frame = page.frames().find((f) => f.url().includes('menu-recommend'));
    if (frame) return frame;
    await page.waitForTimeout(50);
  }
  throw new Error('menu-recommend frame 未出现');
}

test('弹窗内层只加载必要样式，且不做任何联网', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'home' });
  await page.route('**/student/menu-recommend/page', (route) => route.fulfill({
    path: path.join(ROOT, 'tests/fixtures/menu-recommend.html'),
    contentType: 'text/html; charset=utf-8',
  }));

  await page.evaluate(() => { window.__t0 = performance.now(); });
  await page.evaluate((url) => {
    const layer = document.createElement('div');
    layer.className = 'layui-layer layui-layer-iframe layer-anim';
    const content = document.createElement('div');
    content.className = 'layui-layer-content';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    content.appendChild(iframe);
    layer.appendChild(content);
    document.body.appendChild(layer);
  }, MENU_RECOMMEND_URL);

  const frame = await getLayerFrame(page);
  await frame.evaluate(() => {
    window.__probe = { gm: [] };
    const orig = window.GM_xmlhttpRequest;
    if (typeof orig === 'function') {
      window.GM_xmlhttpRequest = (options) => {
        try { window.__probe.gm.push(String((options && options.url) || '')); } catch (_) { /* ignore */ }
        return orig(options);
      };
    }
  });

  await frame.addScriptTag({ path: USERSCRIPT_PATH });
  await frame.waitForSelector('html.urppp-ready');

  await page.waitForFunction((selector) => (
    document.querySelector(selector)
      && document.querySelector(selector).classList.contains('urppp-layer-revealed')
  ), LAYER_IFRAME_SELECTOR);

  // 等「非关键路径」定时器（3s/4s）都有机会跑，确认这个页面里没有它们的身影
  await page.waitForTimeout(5_000);

  const inner = await frame.evaluate(() => {
    const styles = [...document.querySelectorAll('style')];
    return {
      ids: styles.map((s) => s.id),
      styleBytes: styles.reduce((sum, s) => sum + (s.textContent || '').length, 0),
      gmCalls: window.__probe.gm,
    };
  });

  // 该页需要的那几项仍在
  expect(inner.ids).toContain('urppp-theme-vars');
  expect(inner.ids).toContain('urppp-menu-recommend-style');
  // 整套美化样式不该进来
  for (const heavy of ['urppp-internal-style', 'urppp-clean-style', 'urppp-table-beautify-style',
    'urppp-navigation-style', 'urppp-dashboard-style', 'urppp-schedule-card-style']) {
    expect(inner.ids, `${heavy} 不该出现在弹窗内层`).not.toContain(heavy);
  }
  expect(inner.styleBytes).toBeLessThan(STYLE_BUDGET_BYTES);
  // 弹窗内层不联网
  expect(inner.gmCalls).toEqual([]);
});
