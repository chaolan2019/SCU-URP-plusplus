import { expect, test } from '@playwright/test';
import { FIXTURE_URLS, loadUrpFixture } from './support/urp-fixture.js';

// 对抗性验证：rAF 中途停摆（模拟 CI 无头后台标签的帧暂停）时，
// 抽屉关闭必须由墙钟 setTimeout 兜底完成收尾，不能卡在中间态。
test('mobile drawer closes via wall-clock fallback when rAF stalls mid-animation', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    fixture: 'mobile-home',
    viewport: { width: 390, height: 844 },
    values: { urppp_skin_v1: 'apple', urppp_theme_v3: 'default' },
  });

  // 打开抽屉，rAF 正常跑完
  await page.locator('#urppp-mobile-menu-button').click();
  await expect(page.locator('#sidebar')).toHaveClass(/\bdisplay\b/);

  // 让 rAF 跑有限的几帧后停摆：重放前 ~3 帧，此后吞掉回调，制造中间态
  await page.evaluate(() => {
    const native = window.requestAnimationFrame.bind(window);
    let frames = 0;
    window.requestAnimationFrame = (callback) => {
      frames += 1;
      if (frames > 3) return 0; // 停摆
      return native(callback);
    };
  });

  // 点击关闭：动画进入中间态后 rAF 停摆，display 必须靠兜底 timer 移除
  await page.locator('#urppp-mobile-menu-button').click();
  await expect(page.locator('#sidebar')).not.toHaveClass(/\bdisplay\b/, { timeout: 4000 });

  // 收尾态应完整：visibility hidden、transform 回到 -100% 之外
  const settled = await page.locator('#sidebar').evaluate((sidebar) => ({
    visibility: getComputedStyle(sidebar).visibility,
    closing: sidebar.classList.contains('urppp-drawer-closing'),
  }));
  expect(settled).toEqual({ visibility: 'hidden', closing: false });
  expect(pageErrors).toEqual([]);
});
