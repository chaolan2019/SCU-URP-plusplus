import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 站点自己的 fullCalendars 初始化会对没有实例的元素调用 fullCalendar('render')，
 * FullCalendar 的 jQuery 包装随即打印
 *   “Attempting to call a FullCalendar method on an element with no calendar.”
 * 无害但刷控制台。插件只吞这一种：首参是方法名（字符串）且元素无实例。
 *
 * 关键是不能吞错：初始化调用传的是配置对象，必须照常透传，否则日历根本不会初始化。
 */

async function installJQueryStub(page) {
  await page.evaluate(() => {
    window.__fcCalls = 0;
    const factory = () => {
      // 仿 jQuery：实例方法来自 $.fn（真实 jQuery 是原型链，这里用 Proxy 等价表达）
      const jq = function () {
        const inst = { length: 1, first() { return inst; }, data() { return undefined; } };
        return new Proxy(inst, {
          get(target, prop) {
            if (prop in target) return target[prop];
            return jq.fn[prop];
          },
        });
      };
      jq.fn = { fullCalendar: function () { window.__fcCalls += 1; return this; } };
      return jq;
    };
    window.__jqFactory = factory;
    window.jQuery = window.$ = factory();
  });
}

test('FullCalendar 空操作警告被静默，初始化调用照常透传', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'home',
    beforeUserscript: installJQueryStub,
  });

  // 补丁要装上（jQuery 可能晚于插件出现，插件会用轮询补装）
  await expect.poll(
    () => page.evaluate(() => !!(window.jQuery.fn.fullCalendar && window.jQuery.fn.fullCalendar.__urpppQuiet)),
    { timeout: 5000 },
  ).toBe(true);

  // 无实例 + 方法名：静默，不进原函数
  await page.evaluate(() => { window.jQuery('x').fullCalendar('render'); });
  expect(await page.evaluate(() => window.__fcCalls)).toBe(0);

  // 初始化（对象参数）：必须透传
  await page.evaluate(() => { window.jQuery('x').fullCalendar({ header: false }); });
  expect(await page.evaluate(() => window.__fcCalls)).toBe(1);
});

test('jQuery 晚到时补丁也要赶上站点的调用', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'home',
    beforeUserscript: (target) => target.evaluate(() => {
      window.__fcCalls = 0;
      // 站点场景：jQuery 在 260ms 出现，随后就调用；旧的 250ms 轮询会错过（下一次在 500ms）
      setTimeout(() => {
        const factory = () => {
          const jq = function () {
            const inst = { length: 1, first() { return inst; }, data() { return undefined; } };
            return new Proxy(inst, { get: (t, p) => (p in t ? t[p] : jq.fn[p]) });
          };
          jq.fn = { fullCalendar: function () { window.__fcCalls += 1; return this; } };
          return jq;
        };
        window.jQuery = window.$ = factory();
        setTimeout(() => { window.jQuery('x').fullCalendar('render'); }, 40);
      }, 260);
    }),
  });

  await page.waitForTimeout(1200);
  // 无实例的空操作应当被静默：计数保持 0（未被静默就会是 1）
  expect(await page.evaluate(() => window.__fcCalls)).toBe(0);
});
