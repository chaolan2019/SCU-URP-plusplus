// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

/**
 * 全局文字对比度自愈（clean-mode 内容区）
 * - 遍历带实色背景的文字元素，读取“有效背景”明暗（向上找最近非透明背景）
 * - 若前景与背景亮度差过小（对比不足，如黑底黑字/浅底浅字），自动改为对比色（深底白字/浅底黑字）
 * - 只改对比不足的，不误伤原本配对良好的配色
 * - 通过 MutationObserver 监听清爽模式内容变化，新出现的元素也自动修复
 */

export function installContrastFixer(win = window) {
  const doc = win.document;
  const SEL = [
    '.uc-svc',
    '.uc-svc span', '.uc-svc b', '.uc-svc i', '.uc-svc em', '.uc-svc strong',
    '.uc-lesson', '.uc-lesson b', '.uc-lesson i', '.uc-lesson strong',
    '.uc-btn', '.uc-sa-tab', '.uc-badge',
    '.uc-gpa', '.uc-week-nav .uc-btn', '.uc-hd-tabs .uc-sa-tab',
    '.uc-course-detail .uc-cd-name', '.uc-course-detail .uc-cd-meta', '.uc-course-detail .uc-cd-chip',
    // 校历时间线弹窗（独立于清爽 root）
    '.cal-dialog', '.cal-modal-title', '.cal-term-pills', '.cal-close',
    '.cal-w-label', '.cal-w-ev', '.cal-w-ev b', '.cal-w-sub', '.cal-w-num', '.cal-w-unit',
    '.cal-w-wk', '.cal-w-prog-lbl', '.cal-w-prog-lbl span',
    '.cal-timeline', '.cal-month', '.cal-month-title', '.cal-day-num', '.cal-day-event',
    '.uc-cal-summary', '.uc-cal-summary .cal-s-wk', '.uc-cal-summary .cal-s-ev', '.uc-cal-summary .cal-s-date', '.uc-cal-summary .cal-s-prog',
  ].join(', ');

  function parseColor(str) {
    const m = String(str || '').match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] };
  }
  function lum(c) { return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; }

  // 向上找最近的“有效背景”（alpha > 0.4 的实色）
  function effectiveBg(el) {
    let cur = el;
    while (cur && cur.nodeType === 1 && cur !== doc.body && cur !== doc.documentElement) {
      const c = parseColor(win.getComputedStyle(cur).backgroundColor);
      if (c && c.a > 0.4) return c;
      cur = cur.parentElement;
    }
    return null;
  }

  function fix(el) {
    try {
      // 跳过本身就有背景 alpha 高且是按钮/卡片的“容器”，只处理文字承载者
      const bg = effectiveBg(el);
      if (!bg) return;
      const bgLum = lum(bg);
      const col = parseColor(win.getComputedStyle(el).color) || { r: 0, g: 0, b: 0 };
      const textLum = lum(col);
      // 前景与背景亮度差过小 => 可读性差，强制换成对比色（inline + !important 才能压过 CSS 的 !important）
      if (Math.abs(bgLum - textLum) < 0.3) {
        el.style.setProperty('color', bgLum < 0.5 ? '#ffffff' : '#000000', 'important');
      }
    } catch (_) { /* ignore */ }
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    const nodes = root.querySelectorAll(SEL);
    for (let i = 0; i < nodes.length; i += 1) fix(nodes[i]);
  }

  function handleMutations(records) {
    for (const rec of records) {
      for (const n of rec.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches && n.matches(SEL)) fix(n);
        if (n.querySelectorAll) scan(n);
      }
    }
  }

  const observer = new MutationObserver(handleMutations);
  const boot = () => {
    scan(doc);
    observer.observe(doc.body || doc.documentElement, { childList: true, subtree: true });
  };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();

  return () => observer.disconnect();
}
