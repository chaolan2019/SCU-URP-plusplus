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

/*
 * 同一类问题的另一种表现，也是线上实际遇到的那种：侧边栏在加载期持续变高
 *（多出的菜单项 / 站点自己重算），而内容区是稳定的。
 *
 * #sidebar 在采样目标里，于是它的高度变化会把「几何稳定」一直顶住，
 * 即使内容早就绪也要等到上限才撤遮罩。而侧边栏属于 chrome，不是首屏内容，
 * 且插件自己也会往它写内联样式——把它算进首屏几何稳定本来就不合适。
 */
test('遮罩：时限在 document-start 就武装，不等 load', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'home', expectReady: false });
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const state = await page.evaluate(() => ({
    armedAt: window.__urpppVeilArmedAt,
    logged: !!window.__urpppVeilLogged,
    ready: document.body.classList.contains('urppp-ready'),
  }));
  // 旧实现把时限放在 waitForInitialLayoutStable 的 start() 里，而 start() 要等 load 事件；
  // 线上那次 11.5 秒就是上限压根没参与。这里锁住「遮罩一挂上就开始计时」。
  // 注：夹具是在 load 之后注入插件的（真实浏览器是 document-start），所以这里不卡绝对时刻。
  expect(typeof state.armedAt).toBe('number');
  expect(state.armedAt).toBeLessThan(5000);
  expect(state.logged).toBe(true);
  expect(state.ready).toBe(true);
});

/*
 * 有些环境（用户脚本沙箱位于隐藏 frame、标签页在后台）会把 setTimeout 与 rAF 一起推迟，
 * 线上实测时限武装于 187ms、本该 1687ms 触发，实际 11659ms 才触发——晚了约 10 秒。
 * 这种情况下靠“按时间兜底”没用，所以补一条：用户一有交互就交界面。
 */
test('遮罩：用户一交互立即交界面（不等定时器）', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'home', expectReady: false });
  // 立刻派发一次交互，应当直接把遮罩撤掉
  await page.evaluate(() => window.dispatchEvent(new Event('pointerdown')));
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 3000 });
  const delivered = await page.evaluate(() => ({
    ready: document.body.classList.contains('urppp-ready'),
    logged: !!window.__urpppVeilLogged,
  }));
  expect(delivered.ready).toBe(true);
  expect(delivered.logged).toBe(true);
});

test('遮罩：侧边栏高度在变化时也要按时撤除（内容区已稳定）', async ({ page }) => {
  // 注：这条是上限守卫，不是复现用例——侧边栏 rect 不随内容变，见提交说明。
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    beforeUserscript: (target) => target.evaluate(() => {
      const menus = document.getElementById('menus');
      window.__urpppGrowTimer = setInterval(() => {
        if (!menus) return;
        const li = document.createElement('li');
        li.innerHTML = '<a href="/x"><span class="menu-text">填充项</span></a>';
        menus.appendChild(li);
      }, 10);
    }),
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const elapsed = Date.now() - started;

  await page.evaluate(() => clearInterval(window.__urpppGrowTimer));
  expect(elapsed).toBeLessThan(1200);
});
