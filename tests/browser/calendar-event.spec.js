import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

/*
 * 日历事件卡片读不出字。
 *
 * 站点用 fullCalendar 3 渲染日程，事件元素本身就是 <a class="fc-event ..." href=...>。
 * 插件有一条全局链接色 a, a:link, a:visited { color: var(--primary) !important }：
 * :link 这个伪类把特异度抬到 (0,1,1)，高于 .fc-event 的 (0,1,0)，于是卡片文字被刷成
 * var(--primary)——而卡片底色也是 var(--primary)。杂志主题下两边同为 #1C1C1C
 *（暗色同为 #F3F0EA），亮暗两种模式全都看不见字。
 *
 * 底线用对比度，不用具体色值：卡片底色随主题变，能保证的只是「文字在底色上看得见」。
 */

function parseRgb(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(',').map((item) => parseFloat(item.trim()));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
}

function relativeLuminance({ r, g, b }) {
  const channel = (value) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const [lighter, darker] = first > second ? [first, second] : [second, first];
  return (lighter + 0.05) / (darker + 0.05);
}

function eventColors(page) {
  return page.evaluate(() => {
    const read = (element) => {
      if (!element) return null;
      const style = getComputedStyle(element);
      const title = element.querySelector('.fc-title');
      return {
        color: style.color,
        background: style.backgroundColor,
        // 标题本身没有独立规则时应当继承卡片文字色
        titleColor: title ? getComputedStyle(title).color : null,
      };
    };
    return {
      linked: read(document.querySelector('#main-calendar a.fc-event')),
      plain: read(document.querySelector('#main-calendar div.fc-event')),
    };
  });
}

function expectReadable(colors, label) {
  expect(colors, `${label}: 找不到事件卡片`).not.toBeNull();
  const foreground = parseRgb(colors.color);
  const background = parseRgb(colors.background);
  expect(foreground && background, `${label}: 颜色无法解析`).toBeTruthy();
  expect(
    contrastRatio(foreground, background),
    `${label}: 卡片文字 ${colors.color} 落在底色 ${colors.background} 上`,
  ).toBeGreaterThan(3);
  if (colors.titleColor) expect(colors.titleColor).toBe(colors.color);
}

test('日历卡片：杂志主题亮色下文字与底色可辨', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'calendar', values: { urppp_skin_v1: 'editorial' } });
  const colors = await eventColors(page);
  expectReadable(colors.linked, '带链接的事件');
  expectReadable(colors.plain, '不带链接的事件');
});

test('日历卡片：杂志主题暗色下文字与底色可辨', async ({ page }) => {
  await loadUrpFixture(page, {
    fixture: 'calendar',
    values: { urppp_skin_v1: 'editorial', urppp_theme_v3: 'dark' },
  });
  const colors = await eventColors(page);
  expectReadable(colors.linked, '带链接的事件（暗色）');
  expectReadable(colors.plain, '不带链接的事件（暗色）');
});

test('日历卡片：默认主题下文字与底色可辨', async ({ page }) => {
  await loadUrpFixture(page, { fixture: 'calendar', values: { urppp_skin_v1: 'apple' } });
  const colors = await eventColors(page);
  expectReadable(colors.linked, '带链接的事件（默认主题）');
  expectReadable(colors.plain, '不带链接的事件（默认主题）');
});
