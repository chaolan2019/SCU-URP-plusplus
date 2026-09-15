import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 遮罩的撤除判据是「首屏几何连续两帧不变」，观察器挂在 document.body 上。
 *
 * 旧实现里 schedule() 会把计数无条件清零，于是判据退化成「body 上没有 class/style 变更」——
 * 与"几何稳定"不是一回事：站点只要持续切换类名（布局其实没动），计数就永远回零，遮罩永不撤。
 * 实测线上就是这种状态：DOM 在 1 秒就绪、页面静止，遮罩 3 秒还挂着。
 *
 * 这条用例只切一个不影响布局的类名，专门复现这个差异。
 */

test('遮罩：站点持续切换类名（几何不变）也要按时撤除', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    beforeUserscript: (target) => target.evaluate(() => {
      // 只切类名，夹具里没有对应 CSS 规则，几何不会变。
      // 间隔必须快于两帧（~33ms），否则旧实现仍能在两次踢动之间凑满两帧而不卡。
      window.__urpppChurnTimer = setInterval(() => {
        document.body.classList.toggle('urppp-probe-churn');
      }, 10);
    }),
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const elapsed = Date.now() - started;

  await page.evaluate(() => clearInterval(window.__urpppChurnTimer));
  expect(elapsed).toBeLessThan(5000);
});
