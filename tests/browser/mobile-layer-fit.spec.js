import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 移动端弹层适配。
 *
 * 站点的弹层尺寸按桌面写死（layui 的 area 选项），手机上会超出屏幕，
 * 关闭按钮与页面里的「发送」都点不到。插件只收弹层自身的尺寸与定位。
 *
 * 注意边界：弹层**内部页面**的布局不归插件管——那个页面是聊天式 flex 结构、自有滚动，
 * 夺走它会破坏它自己（menu-recommend.spec.js 里已有断言守着这一点）。
 * 所以这里只验证弹层盒子被收进视口。
 */

const PHONE = { width: 390, height: 844 };

async function mountFakeLayer(page) {
  await page.evaluate(() => {
    const layer = document.createElement('div');
    layer.className = 'layui-layer layui-layer-iframe';
    // 桌面写死的尺寸：在 390x844 的手机视口上会溢出
    layer.style.cssText = 'position:fixed;top:60px;left:200px;width:900px;height:700px;';
    const title = document.createElement('div');
    title.className = 'layui-layer-title';
    title.textContent = '菜单推荐';
    const content = document.createElement('div');
    content.className = 'layui-layer-content';
    content.style.cssText = 'width:900px;height:660px;';
    const setwin = document.createElement('span');
    setwin.className = 'layui-layer-setwin';
    layer.appendChild(title);
    layer.appendChild(content);
    layer.appendChild(setwin);
    document.body.appendChild(layer);
  });
}

test('移动端：桌面写死的弹层被收进视口，关闭按钮可见', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'menu-recommend',
    url: 'http://zhjw.scu.edu.cn/student/menu-recommend/page',
    viewport: PHONE,
  });
  await mountFakeLayer(page);

  const box = await page.evaluate(() => {
    const layer = document.querySelector('.layui-layer.layui-layer-iframe');
    const rect = layer.getBoundingClientRect();
    const close = document.querySelector('.layui-layer-setwin').getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      closeTop: Math.round(close.top),
      closeLeft: Math.round(close.left),
      vw: window.innerWidth,
      vh: window.innerHeight,
    };
  });

  // 盒子必须落在视口内（含 1px 取整余量）
  expect(box.left).toBeGreaterThanOrEqual(-1);
  expect(box.top).toBeGreaterThanOrEqual(-1);
  expect(box.left + box.width).toBeLessThanOrEqual(box.vw + 1);
  expect(box.top + box.height).toBeLessThanOrEqual(box.vh + 1);
  // 关闭按钮也要在屏幕里
  expect(box.closeTop).toBeLessThan(box.vh - 4);
  expect(box.closeLeft).toBeLessThan(box.vw - 4);
});
