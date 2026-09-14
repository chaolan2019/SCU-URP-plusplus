import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { loadUrpFixture, ROOT, USERSCRIPT_PATH } from './support/urp-fixture.js';

/*
 * 主题变量表见 urppp.entry.js 的 THEMES（皮肤未覆盖时的基座值）：
 *   简约白 --bg #F5F5F7 / --surface #FFFFFF / --input-bg #F5F5F7 / --text #1D1D1F / --primary #0071E3
 *   深邃暗 --bg #000000 / --surface #1C1C1E / --input-bg #2C2C2E / --primary #0A84FF
 * 下方断言的色值由此而来；主题色板调整时需同步。
 */
const LIGHT = {
  bg: 'rgb(245, 245, 247)',
  inputBg: 'rgb(245, 245, 247)',
  text: 'rgb(29, 29, 31)',
  primary: 'rgb(0, 113, 227)',
};

const MENU_RECOMMEND_URL = 'http://zhjw.scu.edu.cn/student/menu-recommend/page';

test('智能应用推荐页：接管视觉，但不夺走页面自身布局', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'menu-recommend' });

  // 专属样式只在目标页注入
  await expect(page.locator('#urppp-menu-recommend-style')).toHaveCount(1);

  const styles = await page.evaluate(() => {
    const cs = (selector) => getComputedStyle(document.querySelector(selector));
    return {
      display: cs('.chat-container').display,
      flexDirection: cs('.chat-container').flexDirection,
      height: cs('.chat-container').height,
      messagesFlex: cs('.chat-messages').flexGrow,
      bg: cs('.chat-container').backgroundColor,
      inputBg: cs('.chat-input-area input').backgroundColor,
      inputColor: cs('.chat-input-area input').color,
      inputWidth: cs('.chat-input-area input').width,
      buttonBg: cs('.chat-input-area button').backgroundColor,
    };
  });

  // 布局归页面：flex 结构、撑满高度、输入区自增长都由页面决定，样式层不得夺走
  expect(styles.display).toBe('flex');
  expect(styles.flexDirection).toBe('column');
  expect(styles.messagesFlex).toBe('1');
  expect(parseFloat(styles.height)).toBeGreaterThan(400);

  // 视觉归主题：底色改用 --bg，表单控件不再沿用页面原生的白底黑字
  expect(styles.bg).toBe(LIGHT.bg);
  expect(styles.inputBg).toBe(LIGHT.inputBg);
  expect(styles.inputColor).toBe(LIGHT.text);
  expect(styles.buttonBg).toBe(LIGHT.primary);
  // 输入框被放开撑满：页面写死的 200px 不应在宽容器里把它卡成半截
  expect(parseFloat(styles.inputWidth)).toBeGreaterThan(500);
});

test('智能应用推荐页：暗色主题下自动跟随', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'menu-recommend',
    values: { urppp_theme_v3: 'dark' },
  });

  const styles = await page.evaluate(() => {
    const cs = (selector) => getComputedStyle(document.querySelector(selector));
    return {
      bg: cs('.chat-container').backgroundColor,
      inputBg: cs('.chat-input-area input').backgroundColor,
    };
  });

  // 深邃暗 --bg #000000 / --input-bg #2C2C2E：无一处硬编码，全部由主题变量驱动
  expect(styles.bg).toBe('rgb(0, 0, 0)');
  expect(styles.inputBg).toBe('rgb(44, 44, 46)');
});

test('layui iframe 弹窗：换装跟随主题，几何尺寸保持不动', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'home' });

  // 按真实 layui 取值复现原生外观（setwin 的 top/right 并不是 0），
  // 并动态插入弹窗：样式为全局注入，后插入的节点同样生效
  await page.addStyleTag({
    content: [
      '.layui-layer { position: fixed; background: #fff; border-radius: 2px; }',
      '.layui-layer-title { height: 42px; line-height: 42px; padding: 0 80px 0 20px; background: #F8F8F8; border-bottom: 1px solid #eee; }',
      '.layui-layer-setwin { position: absolute; right: 15px; top: 15px; }',
      '.layui-layer-setwin a { position: relative; display: inline-block; width: 16px; height: 16px; margin-left: 10px; }',
      '.layui-layer-setwin .layui-layer-ico { background: url("/static/layui/sprites.png") no-repeat 0 0; }',
    ].join('\n'),
  });
  await page.evaluate(() => {
    const layer = document.createElement('div');
    layer.className = 'layui-layer layui-layer-iframe layer-anim';
    layer.setAttribute('type', 'iframe');
    layer.style.cssText = 'z-index:19891019;width:600px;height:520px;top:301.5px;left:471.5px;';
    layer.innerHTML = [
      '<div class="layui-layer-title" style="cursor:move;height:42px;line-height:42px;">智能应用推荐</div>',
      '<div class="layui-layer-content"><iframe frameborder="0" src="about:blank" style="height:478px;"></iframe></div>',
      '<span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a></span>',
    ].join('');
    document.body.appendChild(layer);
  });

  const styles = await page.evaluate(() => {
    const layer = document.querySelector('.layui-layer-iframe');
    const title = layer.querySelector('.layui-layer-title');
    const close = layer.querySelector('.layui-layer-close');
    const titleBox = title.getBoundingClientRect();
    const closeBox = close.getBoundingClientRect();
    return {
      layerWidth: getComputedStyle(layer).width,
      layerHeight: getComputedStyle(layer).height,
      layerRadius: getComputedStyle(layer).borderTopLeftRadius,
      titleHeight: getComputedStyle(title).height,
      titleBg: getComputedStyle(title).backgroundColor,
      titleWeight: getComputedStyle(title).fontWeight,
      closeBgImage: getComputedStyle(close).backgroundImage,
      closeWidth: getComputedStyle(close).width,
      // 关闭按钮应落在标题栏内并垂直居中，而不是被 setwin 的偏移推到标题栏之外
      closeInsideTitle: closeBox.top >= titleBox.top - 0.5 && closeBox.bottom <= titleBox.bottom + 0.5,
      titleCenter: (titleBox.top + titleBox.bottom) / 2,
      closeCenter: (closeBox.top + closeBox.bottom) / 2,
    };
  });

  // 几何不动：layui 以内联宽高反算 iframe 高度，改标题栏高度会让 content 与 iframe 之间露出缝隙
  expect(styles.layerWidth).toBe('600px');
  expect(styles.layerHeight).toBe('520px');
  expect(styles.titleHeight).toBe('42px');

  // 视觉换装：标题栏改用 --surface，关闭按钮的 sprite 被 CSS 绘制的图标取代
  expect(styles.titleBg).toBe('rgb(255, 255, 255)');
  expect(styles.titleWeight).toBe('600');
  expect(styles.closeBgImage).toBe('none');
  expect(styles.closeWidth).toBe('28px');
  // 圆角取自主题变量：editorial 下为 0，apple 下为设计值，两侧都不需要额外改动
  expect(styles.layerRadius).not.toBe('2px');
  // 关闭按钮位置：落在标题栏内并垂直居中
  expect(styles.closeInsideTitle).toBe(true);
  expect(Math.abs(styles.titleCenter - styles.closeCenter)).toBeLessThanOrEqual(1.5);
});

test('智能应用推荐页：样式早于 DOMContentLoaded 注入，避免首帧闪原生样式', async ({ page }) => {
  // 该页多作为 layui iframe 弹窗内容加载：网络往返与解析期间若还没有样式，
  // 会先按原生外观绘制一次再被接管。这里用一个阻塞解析的同步脚本把页面卡在
  // loading 阶段（等价于真实油猴在 document-start 注入脚本的时机），
  // 验证此时变量与专属样式已经就位。
  await page.addInitScript(() => {
    const store = {
      urppp_auto_update_check_v1: false,
      urppp_theme_v3: 'default',
      urppp_skin_v1: 'apple',
      urppp_clean_default_v1: false,
    };
    window.GM_getValue = (k, d) => (k in store ? store[k] : d);
    window.GM_setValue = (k, v) => { store[k] = v; };
    window.GM_deleteValue = (k) => { delete store[k]; };
    window.GM_listValues = () => Object.keys(store);
    window.GM_addStyle = (css) => {
      const s = document.createElement('style');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      return s;
    };
    window.GM_xmlhttpRequest = () => {};
    window.unsafeWindow = window;
  });

  const html = fs.readFileSync(path.join(ROOT, 'tests/fixtures/menu-recommend.html'), 'utf8')
    .replace('</head>', '<script src="/slow-block.js"></script></head>');
  await page.route('**/slow-block.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.fulfill({ contentType: 'application/javascript', body: '/* block parsing */' });
  });
  await page.route('**/student/menu-recommend/page', (route) => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: html,
  }));

  await page.goto(MENU_RECOMMEND_URL, { waitUntil: 'commit' });
  await page.waitForFunction(() => !!document.documentElement && !!document.head);
  await page.addScriptTag({ path: USERSCRIPT_PATH });

  const state = await page.evaluate(() => ({
    readyState: document.readyState,
    hasThemeVars: !!document.getElementById('urppp-theme-vars'),
    hasPageStyles: !!document.getElementById('urppp-menu-recommend-style'),
  }));

  // 解析仍被阻塞脚本卡住，DOMContentLoaded 尚未触发
  expect(state.readyState).toBe('loading');
  // 但变量与样式已经落好，首帧不会以原生外观示人
  expect(state.hasThemeVars).toBe(true);
  expect(state.hasPageStyles).toBe(true);
});
