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
test('遮罩：清爽默认 + 网络卡住时，遮罩仍在时限内撤除（不等数据）', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    values: { urppp_clean_default_v1: true },
    // 接口不报错也不回调：数据阶段永远不完成
    beforeUserscript: (target) => target.evaluate(() => {
      window.GM_xmlhttpRequest = () => {};
      window.fetch = () => new Promise(() => {});
    }),
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 6000 });
  const elapsed = Date.now() - started;
  const state = await page.evaluate(() => ({
    timedOut: !!window.__urpppCleanBootTimedOut,
    cleanOpen: document.documentElement.classList.contains('urppp-clean-open'),
  }));
  // 线上实测：这条路径曾卡到 11576ms（时限和交互都被 hideBootLoader 的清爽守卫挡住）
  expect(elapsed).toBeLessThan(2500);
  expect(state.timedOut).toBe(true);
  expect(state.cleanOpen).toBe(true);
});

/*
 * 潮蓝的真实场景：缓存全部命中（日志里四行「命中缓存，先渲染旧数据」），
 * 而接口要好几秒。旧实现里「渲染就绪」只认网络阶段，于是首屏早就用缓存画完了，
 * 遮罩却一直等到数据回来（实测 11576ms）。
 * 现在缓存命中即视为可撑起首屏，遮罩不再等接口。
 */
test('遮罩：清爽默认 + 缓存命中 + 接口很慢时，不等接口就交界面', async ({ page }) => {
  const cacheEntry = (data) => JSON.stringify({ v: '2.0.2', ts: Date.now(), data });
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    values: {
      urppp_clean_default_v1: true,
      urppp_clean_cache_schedule: cacheEntry({ courses: [{ name: '高数', room: 'A101', weeks: '1-16', weekday: 1, startNode: 1, endNode: 2 }] }),
      urppp_clean_cache_scores: cacheEntry({ passing: [{ courses: [{ courseName: '高数', credit: 5, cj: '95' }] }], schemes: [] }),
      urppp_clean_cache_profile: cacheEntry({ name: '测试同学' }),
      urppp_clean_cache_roomcat: cacheEntry([{ name: 'A101' }]),
    },
    // 接口永远不回调
    beforeUserscript: (target) => target.evaluate(() => {
      window.GM_xmlhttpRequest = () => {};
      window.fetch = () => new Promise(() => {});
    }),
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const elapsed = Date.now() - started;
  const state = await page.evaluate(() => ({
    cacheReady: !!window.__urpppCleanCacheReady,
    dataReady: !!window.__urpppCleanDataReady,
    timedOut: !!window.__urpppCleanBootTimedOut,
  }));
  // 不依赖接口：既不是靠时限救的，也不是等数据等到的
  expect(state.cacheReady).toBe(true);
  expect(state.dataReady).toBe(false);
  expect(elapsed).toBeLessThan(2500);
});

/*
 * 线上还存在一个夹具原本没有的延迟：清爽外壳的入场动画。
 * CleanRenderReady / CleanAnimationReady 都在 settle() 里置位，而 settle() 等动画播完，
 * 于是遮罩盖住整个入场过程，用户只看到静止结果——实测 1420ms。
 * 现在首帧一画出来就上报，遮罩在动画开始时就让开。
 */
test('遮罩：入场动画很长也不等它播完', async ({ page }) => {
  const cacheEntry = (data) => JSON.stringify({ v: '2.0.2', ts: Date.now(), data });
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    values: {
      urppp_clean_default_v1: true,
      urppp_clean_cache_schedule: cacheEntry({ courses: [{ name: '高数', room: 'A101', weeks: '1-16', weekday: 1, startNode: 1, endNode: 2 }] }),
      urppp_clean_cache_scores: cacheEntry({ passing: [{ courses: [{ courseName: '高数', credit: 5, cj: '95' }] }], schemes: [] }),
      urppp_clean_cache_profile: cacheEntry({ name: '测试同学' }),
      urppp_clean_cache_roomcat: cacheEntry([{ name: 'A101' }]),
    },
    beforeUserscript: async (target) => {
      await target.evaluate(() => {
        window.GM_xmlhttpRequest = () => {};
        window.fetch = () => new Promise(() => {});
        // 给清爽外壳的子树挂一段 1500ms 的入场动画（有限次数，会被 getAnimations 捕获）
        const style = document.createElement('style');
        style.textContent = '@keyframes urppp-probe-in{from{opacity:0}to{opacity:1}}'
          + '#urppp-clean-root *{animation:urppp-probe-in 1500ms linear 1}'
          + '#urppp-boot-loader,#urppp-boot-loader *{animation:none!important}';
        document.head.appendChild(style);
      });
    },
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const elapsed = Date.now() - started;
  const flags = await page.evaluate(() => ({
    render: !!window.__urpppCleanRenderReady,
    anim: !!window.__urpppCleanAnimationReady,
  }));
  console.log('ANIM_CASE ' + JSON.stringify({ elapsed, flags }));
  // 注：夹具里的 settle() 路径与线上不完全一致，这条只能当上限守卫，不能当复现用例。
  // 真正的验证靠线上那行「遮罩撤除」读数。
  expect(elapsed).toBeLessThan(1000);
});

test('遮罩：沙箱里 rAF 不触发时，几何判定仍要靠定时器完成（why=stable）', async ({ page }) => {
  // 用户脚本沙箱位于隐藏 iframe，拿不到渲染帧，rAF 永不触发。
  // 线上实测：stableStart 有值而 stableEnd 永远是空，说明判定一直是死的，
  // 真正在撤遮罩的是交互兜底。这条把 rAF 置空复现那个环境。
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    beforeUserscript: (target) => target.evaluate(() => {
      window.requestAnimationFrame = () => 0;
      window.cancelAnimationFrame = () => {};
    }),
  });

  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const state = await page.evaluate(() => ({
    start: window.__urpppVeilStartAt,
    end: window.__urpppVeilFinishAt,
    why: window.__urpppVeilFinishReason,
    ready: document.body.classList.contains('urppp-ready'),
  }));
  // 旧实现在这里 why 是空的（判定从未结束），只有上限能救；
  // 现在判定由定时器驱动，会在很短的时间内以 stable 或 ceiling 结束。
  expect(typeof state.start).toBe('number');
  expect(['stable', 'ceiling']).toContain(state.why);
  expect(typeof state.end).toBe('number');
  expect(state.end - state.start).toBeLessThan(700);
});

test('遮罩：清爽默认下用户一交互也立即交界面', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    values: { urppp_clean_default_v1: true },
    beforeUserscript: (target) => target.evaluate(() => {
      window.GM_xmlhttpRequest = () => {};
      window.fetch = () => new Promise(() => {});
    }),
  });
  await page.evaluate(() => window.dispatchEvent(new Event('pointerdown')));
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 4000 });
  const ready = await page.evaluate(() => document.body.classList.contains('urppp-ready'));
  expect(ready).toBe(true);
});

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

test('遮罩：几何持续在变也要按时撤除（不被自身重渲染顶住）', async ({ page }) => {
  // 线上非清爽模式的实际情况：rs 已是 interactive，但插件的首页重构与缓存重渲染
  // 持续改 page-content 的几何，判定一直不达标，拖到 922ms。上限收到 300ms 后不再如此。
  await loadUrpFixture(page, {
    fixture: 'home',
    expectReady: false,
    beforeUserscript: (target) => target.evaluate(() => {
      let n = 0;
      window.__urpppLayoutChurn = setInterval(() => {
        n += 1;
        const main = document.querySelector('.main-content');
        if (main) main.style.paddingBottom = (10 + (n % 20)) + 'px';
      }, 10);
    }),
  });

  const started = Date.now();
  await page.waitForFunction(() => document.body.classList.contains('urppp-ready'), { timeout: 8000 });
  const elapsed = Date.now() - started;
  await page.evaluate(() => clearInterval(window.__urpppLayoutChurn));
  // 注：这条只能当上限守卫，不能当复现用例——夹具里没能构造出真正顶住判定的几何扰动
  //（把上限改回 1500ms 它照样通过）。
  expect(elapsed).toBeLessThan(2500);
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
