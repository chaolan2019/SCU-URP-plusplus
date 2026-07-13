// ==UserScript==
// @name         URP++ 教务系统美化
// @namespace    https://github.com/hanako/urp-plus
// @version      0.5.11
// @description  四川大学 URP 教务系统登录页美化 | UI UX Pro Max | Minimalism & Swiss Style
// @author       Hanako
// @match        http://zhjw.scu.edu.cn/*
// @match        http://202.115.47.141/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // 最早阶段：最高优先级遮罩盖住未美化界面，完成后淡入
  GM_addStyle(`
    html, body { background: var(--bg, #F4F6F9) !important; color: var(--text, #0F172A) !important; }
    /* 未就绪时隐藏页面主体，避免 ACE 原样式闪现 */
    html:not(.urppp-ready) body {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    html.urppp-ready body,
    body.urppp-ready {
      opacity: 1 !important;
      pointer-events: auto !important;
      transition: opacity .2s ease !important;
    }
    #urppp-boot-loader {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;
      gap: 14px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: var(--bg, #F4F6F9) !important;
      color: var(--text, #0F172A) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      transition: opacity .25s ease, visibility .25s ease, background-color .2s ease !important;
      pointer-events: all !important;
    }
    #urppp-boot-loader.urppp-boot-hide {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #urppp-boot-loader .urppp-boot-text {
      font-size: 13px !important;
      color: var(--text-secondary, #64748B) !important;
      letter-spacing: 0.4px !important;
    }
    /* 立方体旋转 loading：浅色、扁平 */
    .urppp-cube-scene {
      width: 48px;
      height: 48px;
      perspective: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .urppp-cube {
      width: 26px;
      height: 26px;
      position: relative;
      transform-style: preserve-3d;
      animation: urppp-cube-spin 1.35s linear infinite;
    }
    .urppp-cube-face {
      position: absolute;
      inset: 0;
      border: 1.5px solid var(--border, #E2E8F0);
      background: var(--surface, #FFFFFF);
      border-radius: 2px;
      box-sizing: border-box;
      box-shadow: none;
      opacity: 0.95;
    }
    .urppp-cube-face.front  { transform: translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(13px); background: var(--bg, #F4F6F9); border-color: var(--border, #E2E8F0); }
    #urppp-boot-loader .urppp-cube-scene { width: 64px; height: 64px; perspective: 280px; }
    #urppp-boot-loader .urppp-cube { width: 34px; height: 34px; }
    #urppp-boot-loader .urppp-cube-face {
      border-width: 1.5px;
      border-color: var(--border, #E2E8F0);
    }
    #urppp-boot-loader .urppp-cube-face.front  { transform: translateZ(17px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(17px); background: var(--surface, #FFFFFF); }
    #urppp-boot-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(17px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(17px); background: var(--bg, #F4F6F9); }
    @keyframes urppp-cube-spin {
      0%   { transform: rotateX(-12deg) rotateY(0deg); }
      100% { transform: rotateX(-12deg) rotateY(360deg); }
    }
    @keyframes urppp-spin {
      to { transform: rotate(360deg); }
    }
    /* 原生 loading 图：先藏起来，JS 会替换成 SVG */
    img[src*="pageloading" i],
    img[src*="page-loading" i],
    img[src*="/loading" i],
    img[src*="Loading.gif"],
    .view-pre-loading,
    .pageloading,
    .pre-loading {
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
      position: absolute !important;
      pointer-events: none !important;
    }
    .urppp-inline-loader {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      min-height: 64px;
      color: #64748B !important;
      font-size: 13px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      box-sizing: border-box !important;
    }
    /* 分页/表格遮罩：绝不注入 DOM；只在可见时用 CSS 转圈，站点 display:none 即可彻底消失 */
    [id^="div_page_loading"],
    [id*="page_loading"],
    [id$="_loading"],
    div[id*="page_loading"] {
      background: transparent !important;
      background-image: none !important;
    }
    [id^="div_page_loading"] img,
    [id*="page_loading"] img {
      display: none !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }
    /* 清掉我们误注入的节点视觉 */
    [id^="div_page_loading"] .urppp-inline-loader,
    [id*="page_loading"] .urppp-inline-loader,
    [id^="div_page_loading"] svg,
    [id*="page_loading"] svg {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
    }
    /* 分页遮罩：不注入、不伪元素转圈，只藏原生 gif，避免卡住/卡死 */
    [id^="div_page_loading"]::before,
    [id*="page_loading"]::before {
      content: none !important;
      display: none !important;
    }
    .urppp-inline-loader .urppp-cube-scene {
      width: 40px !important;
      height: 40px !important;
      perspective: 200px !important;
    }
    .urppp-inline-loader .urppp-cube {
      width: 20px !important;
      height: 20px !important;
    }
    .urppp-inline-loader .urppp-cube-face {
      border-color: var(--border, #E2E8F0) !important;
      border-width: 1.5px !important;
      background: var(--surface, #FFFFFF) !important;
    }
    .urppp-inline-loader .urppp-cube-face.front  { transform: translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; }
    .urppp-inline-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(10px) !important; background: var(--bg, #F4F6F9) !important; }
    .center:has(> img[src*="pageloading" i]),
    .center:has(> .urppp-inline-loader),
    .modal-content .center {
      min-height: 80px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    }
    /* layui-layer 原生 loading（背景图 loading-0.gif） */
    .layui-layer-loading,
    .layui-layer-loading0,
    .layui-layer-loading1,
    .layui-layer-loading2,
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      background: transparent !important;
      background-image: none !important;
      background-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer.layui-layer-loading {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-loading .layui-layer-content,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      width: 72px !important;
      height: 72px !important;
      background: transparent !important;
      background-image: none !important;
      position: relative !important;
    }
    /* 未注入时，伪元素兜底：旋转方块 */
    .layui-layer-content.layui-layer-loading0:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading1:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading2:not(:has(.urppp-inline-loader))::before,
    .layui-layer-loading .layui-layer-content:not(:has(.urppp-inline-loader))::before {
      content: '' !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 20px !important;
      height: 20px !important;
      margin: -10px 0 0 -10px !important;
      border: 1.5px solid var(--border, #E2E8F0) !important;
      border-radius: 2px !important;
      background: var(--input-bg, #F8FAFC) !important;
      box-sizing: border-box !important;
      animation: urppp-cube-spin 1.15s linear infinite !important;
      transform-style: preserve-3d !important;
    }
    .layui-layer-loading .urppp-inline-loader,
    .layui-layer-content .urppp-inline-loader {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
    }
  `);

  const URPPP_LOADER_CUBE = `
    <div class="urppp-cube-scene" aria-hidden="true">
      <div class="urppp-cube">
        <div class="urppp-cube-face front"></div>
        <div class="urppp-cube-face back"></div>
        <div class="urppp-cube-face right"></div>
        <div class="urppp-cube-face left"></div>
        <div class="urppp-cube-face top"></div>
        <div class="urppp-cube-face bottom"></div>
      </div>
    </div>
  `;

  function makeInlineLoader(text) {
    const wrap = document.createElement('div');
    wrap.className = 'urppp-inline-loader';
    wrap.innerHTML = URPPP_LOADER_CUBE + (text ? `<div>${text}</div>` : '');
    return wrap;
  }

  function isPageLoadingOverlay(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]');
  }

  // 安全清理：只删我们注入的节点，绝不改 display / 不挂全局 observer
  function cleanupPageLoadingOverlays(scope) {
    try {
      const root = scope && scope.querySelectorAll ? scope : document;
      root.querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach((el) => {
        el.querySelectorAll('.urppp-inline-loader').forEach((n) => {
          try { n.remove(); } catch (_) {}
        });
        el.classList.remove('urppp-loading-active');
      });
    } catch (_) {}
  }

  function replaceNativeLoaders(root) {
    try {
      const scope = root && root.querySelectorAll ? root : document;

      // 分页遮罩：只清误注入，不碰显隐
      cleanupPageLoadingOverlays(scope);

      // 1) 替换普通 loading gif（跳过分页遮罩）
      scope.querySelectorAll('img').forEach((img) => {
        try {
          if (!img || img.dataset.urpppReplaced === '1') return;
          if (isPageLoadingOverlay(img)) return;
          const src = (img.getAttribute('src') || img.src || '').toLowerCase();
          if (!src) return;
          if (!(src.includes('pageloading') || src.includes('page-loading') || src.includes('loading.gif') || src.includes('loading-0') || src.includes('loading-1'))) return;
          // 避免匹配普通 /loading 路径过宽
          if (src.includes('/loading') && !src.includes('pageloading') && !src.includes('loading.gif') && !src.includes('loading-0')) return;
          img.dataset.urpppReplaced = '1';
          const loader = makeInlineLoader('');
          loader.style.minHeight = '0';
          loader.style.padding = '0';
          if (img.parentElement) img.parentElement.replaceChild(loader, img);
        } catch (_) {}
      });

      // 2) layui-layer loading：只去背景 + 注入一次 SVG
      scope.querySelectorAll(
        '.layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content'
      ).forEach((el) => {
        try {
          if (!el || el.dataset.urpppReplaced === '1') return;
          el.dataset.urpppReplaced = '1';
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('background-image', 'none', 'important');
          if (!el.querySelector('.urppp-inline-loader')) {
            const loader = makeInlineLoader('');
            loader.style.minHeight = '0';
            loader.style.padding = '0';
            el.appendChild(loader);
          }
        } catch (_) {}
      });
    } catch (_) {}
  }

  // 低频扫描替换 loading（只 childList，强节流，避免卡死页面）
  if (!window.__urpppLoaderObs) {
    window.__urpppLoaderObs = true;
    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      try { replaceNativeLoaders(document); } catch (_) {}
      running = false;
    };
    if (document.body) setTimeout(run, 0);
    document.addEventListener('DOMContentLoaded', () => setTimeout(run, 0), { once: true });
    const startObs = () => {
      const obs = new MutationObserver(() => {
        clearTimeout(window.__urpppLoaderTimer);
        window.__urpppLoaderTimer = setTimeout(run, 200);
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    };
    if (document.body) startObs();
    else document.addEventListener('DOMContentLoaded', startObs, { once: true });
  }

  const THEME_KEY = 'urppp_theme_v3';
  const ACCENT_KEY = 'urppp_accent_v1';
  const ACCENT_PRESETS_KEY = 'urppp_accent_presets_v1';
  const DEFAULT_ACCENT_PRESETS = ['#1E3A5F', '#B53434', '#0F766E', '#7C3AED', '#C2410C', '#0369A1'];

  function ensureBootLoader() {
    if (document.getElementById('urppp-boot-loader')) return;
    const el = document.createElement('div');
    el.id = 'urppp-boot-loader';
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = `
      <div class="urppp-cube-scene" aria-hidden="true">
        <div class="urppp-cube">
          <div class="urppp-cube-face front"></div>
          <div class="urppp-cube-face back"></div>
          <div class="urppp-cube-face right"></div>
          <div class="urppp-cube-face left"></div>
          <div class="urppp-cube-face top"></div>
          <div class="urppp-cube-face bottom"></div>
        </div>
      </div>
      <div class="urppp-boot-text">URP++ 加载中</div>
    `;
    const host = document.documentElement || document.body;
    if (host) host.appendChild(el);
  }
  function hideBootLoader() {
    try {
      document.documentElement.classList.add('urppp-ready');
      if (document.body) {
        document.body.classList.add('urppp-ready');
        document.body.style.removeProperty('opacity');
      }
      const el = document.getElementById('urppp-boot-loader');
      if (!el) return;
      el.classList.add('urppp-boot-hide');
      setTimeout(() => { try { el.remove(); } catch (_) {} }, 280);
    } catch (_) {}
  }
  // 立刻挂遮罩（document-start 阶段 html 已存在）
  try { ensureBootLoader(); } catch (_) {}
  // 兜底：最多 2.5s 必须进入
  if (!window.__urpppBootSafety) {
    window.__urpppBootSafety = setTimeout(() => { try { hideBootLoader(); } catch (_) {} }, 2500);
  }
  const THEMES = {
    'default': {
      name: '简约白',
      vars: {
        '--bg': '#F4F6F9', '--surface': '#FFFFFF',
        '--text': '#0F172A', '--text-secondary': '#64748B', '--text-muted': '#94A3B8',
        '--border': '#E2E8F0', '--border-focus': '#1E3A5F',
        '--input-bg': '#F8FAFC', '--primary': '#1E3A5F', '--primary-hover': '#162D4A',
        '--ring': 'rgba(30,58,95,0.15)',
        '--shadow': '0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
        '--radius': '16px', '--radius-sm': '10px',
      },
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    },
    'dark': {
      name: '深邃暗',
      vars: {
        '--bg': '#0B0F17', '--surface': '#151A24',
        '--text': '#E2E8F0', '--text-secondary': '#94A3B8', '--text-muted': '#64748B',
        '--border': '#1E293B', '--border-focus': '#93A8C7',
        '--input-bg': '#1C2330', '--primary': '#93A8C7', '--primary-hover': '#AFC0D8',
        '--ring': 'rgba(147,168,199,0.25)',
        '--shadow': '0 2px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
        '--radius': '16px', '--radius-sm': '10px',
      },
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    },
    'scu-red': {
      name: '川大红',
      vars: {
        '--bg': '#FDF6F5', '--surface': '#FFFFFF',
        '--text': '#2C1810', '--text-secondary': '#A0807A', '--text-muted': '#C0A8A2',
        '--border': '#F0E0DE', '--border-focus': 'var(--urppp-accent, #B53434)',
        '--input-bg': '#FEFCFB',
        '--primary': 'var(--urppp-accent, #B53434)',
        '--primary-hover': 'var(--urppp-accent-hover, #962929)',
        '--ring': 'var(--urppp-accent-ring, rgba(181,52,52,0.12))',
        '--shadow': '0 2px 16px rgba(139,31,31,0.05), 0 0 0 1px rgba(139,31,31,0.03)',
        '--radius': '16px', '--radius-sm': '10px',
      },
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", serif',
    },
  };

  // ============================================================
  // 颜色工具
  // ============================================================

  function hexToRgb(hex) {
    const m = String(hex).replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 30, g: 58, b: 95 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const v = Math.max(0, Math.min(255, Math.round(x)));
      return v.toString(16).padStart(2, '0');
    }).join('');
  }

  function darken(hex, p) {
    const { r, g, b } = hexToRgb(hex);
    const f = 1 - p;
    return rgbToHex(r * f, g * f, b * f);
  }

  function lighten(hex, p) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * p, g + (255 - g) * p, b + (255 - b) * p);
  }

  function alpha(hex, a) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  // 根据强调色生成浅色表面主题（背景/边框/输入底）
  function buildAccentSurfaceTheme(hex) {
    const h = hex.startsWith('#') ? hex : ('#' + hex);
    return {
      '--bg': lighten(h, 0.94),
      '--surface': '#FFFFFF',
      '--text': darken(h, 0.72),
      '--text-secondary': alpha(darken(h, 0.35), 0.72),
      '--text-muted': alpha(darken(h, 0.2), 0.55),
      '--border': lighten(h, 0.82),
      '--border-focus': 'var(--urppp-accent, ' + h + ')',
      '--input-bg': lighten(h, 0.97),
      '--primary': 'var(--urppp-accent, ' + h + ')',
      '--primary-hover': 'var(--urppp-accent-hover, ' + darken(h, 0.15) + ')',
      '--ring': 'var(--urppp-accent-ring, ' + alpha(h, 0.14) + ')',
      '--shadow': '0 2px 16px ' + alpha(h, 0.06) + ', 0 0 0 1px ' + alpha(h, 0.04),
      '--radius': '16px',
      '--radius-sm': '10px',
    };
  }

  // ============================================================
  // 主题管理
  // ============================================================

  function clearInlinePrimaryOverrides() {
    // 清掉内联主题变量，避免压过 :root 主题切换
    const root = document.documentElement;
    ;[
      '--primary', '--primary-hover', '--border-focus', '--ring',
      '--bg', '--surface', '--text', '--text-secondary', '--text-muted',
      '--border', '--input-bg', '--shadow'
    ].forEach((k) => root.style.removeProperty(k));
  }

  function applyAccent(hex, opts) {
    if (!hex) return;
    const clean = String(hex).trim();
    const body = clean.replace(/^#/, '');
    if (!/^[0-9a-fA-F]{6}$/.test(body)) return;
    const h = '#' + body.toUpperCase();
    GM_setValue(ACCENT_KEY, h);
    // 自定义色统一落到 scu-red 主题，由 applyTheme 重建整套背景/主色
    // skipTheme 用于 applyTheme 内部避免递归
    if (opts && opts.skipTheme) {
      const hover = darken(h, 0.15);
      const ring = alpha(h, 0.15);
      document.documentElement.style.setProperty('--urppp-accent', h);
      document.documentElement.style.setProperty('--urppp-accent-hover', hover);
      document.documentElement.style.setProperty('--urppp-accent-ring', ring);
      try { syncNavbarThemeUI(); } catch (_) {}
      return;
    }
    applyTheme('scu-red');
    try { syncNavbarThemeUI(); } catch (_) {}
  }

  function clearAccent() {
    GM_setValue(ACCENT_KEY, '');
    document.documentElement.style.removeProperty('--urppp-accent');
    document.documentElement.style.removeProperty('--urppp-accent-hover');
    document.documentElement.style.removeProperty('--urppp-accent-ring');
    clearInlinePrimaryOverrides();
  }

  function getAccent() { return GM_getValue(ACCENT_KEY, ''); }

  function getAccentPresets() {
    try {
      const raw = GM_getValue(ACCENT_PRESETS_KEY, '');
      if (!raw) return DEFAULT_ACCENT_PRESETS.slice();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return DEFAULT_ACCENT_PRESETS.slice();
      return arr.filter((x) => typeof x === 'string' && /^#?[0-9a-fA-F]{6}$/i.test(x.replace('#','')) )
        .map((x) => x.startsWith('#') ? x : ('#' + x));
    } catch (_) {
      return DEFAULT_ACCENT_PRESETS.slice();
    }
  }

  function saveAccentPreset(hex) {
    const h = (hex || getAccent() || '#1E3A5F').startsWith('#') ? (hex || getAccent()) : ('#' + (hex || getAccent()));
    let list = getAccentPresets();
    list = [h].concat(list.filter((x) => x.toLowerCase() !== h.toLowerCase()));
    list = list.slice(0, 12);
    GM_setValue(ACCENT_PRESETS_KEY, JSON.stringify(list));
    return list;
  }

  function removeAccentPreset(hex) {
    const h = (hex || '').toLowerCase();
    const list = getAccentPresets().filter((x) => x.toLowerCase() !== h);
    GM_setValue(ACCENT_PRESETS_KEY, JSON.stringify(list));
    return list;
  }

  function applyTheme(name) {
    const t = THEMES[name] || THEMES['default'];
    GM_setValue(THEME_KEY, name);
    // 先清内联覆盖，再写主题 :root
    clearInlinePrimaryOverrides();
    const el = document.getElementById('urppp-theme-vars') || (() => {
      const e = document.createElement('style'); e.id = 'urppp-theme-vars';
      const host = document.head || document.documentElement;
      host.appendChild(e); return e;
    })();

    const acc = getAccent();
    let vars = Object.assign({}, t.vars);
    // 只有「自定义」(scu-red) 吃自定义色整套表面；简约白/深邃暗用主题原配色
    if (name === 'scu-red') {
      const color = acc || '#B53434';
      vars = Object.assign(vars, buildAccentSurfaceTheme(color));
      const hover = darken(color, 0.15);
      const ring = alpha(color, 0.15);
      document.documentElement.style.setProperty('--urppp-accent', color);
      document.documentElement.style.setProperty('--urppp-accent-hover', hover);
      document.documentElement.style.setProperty('--urppp-accent-ring', ring);
    } else if (name === 'default') {
      document.documentElement.style.setProperty('--urppp-accent', '#1E3A5F');
      document.documentElement.style.setProperty('--urppp-accent-hover', '#162D4A');
      document.documentElement.style.setProperty('--urppp-accent-ring', 'rgba(30,58,95,0.15)');
    } else {
      // dark 等：清掉 accent 对主色的影响
      document.documentElement.style.removeProperty('--urppp-accent');
      document.documentElement.style.removeProperty('--urppp-accent-hover');
      document.documentElement.style.removeProperty('--urppp-accent-ring');
    }

    let css = ':root {';
    for (const [k, v] of Object.entries(vars)) css += `${k}:${v};`;
    css += '}';
    el.textContent = css;
    if (document.body) document.body.style.fontFamily = t.font;
    try {
      const root = document.documentElement;
      root.dataset.urpppTheme = name;
      root.classList.remove('urppp-theme-default', 'urppp-theme-dark', 'urppp-theme-scu-red');
      root.classList.add('urppp-theme-' + name);
      if (document.body) {
        document.body.dataset.urpppTheme = name;
        document.body.classList.toggle('urppp-dark', name === 'dark');
      }
    } catch (_) {}
    try { syncNavbarThemeUI(); } catch (_) {}
    const boot = document.getElementById('urppp-boot-loader');
    if (boot) boot.style.fontFamily = t.font;
  }

  function getCurrent() { return GM_getValue(THEME_KEY, 'default'); }

  // 尽早应用主题，让启动遮罩/立方体颜色跟主题一致
  try { applyTheme(getCurrent()); } catch (_) {}

  // ============================================================
  // 登录页重建
  // ============================================================

  function rebuild() {
    const path = location.pathname;
    if (!['/login', '/loginEn', '/'].includes(path) && path !== '') return;

    const formContent = document.getElementById('formContent');
    const originalForm = document.querySelector('.form-signin');
    if (!formContent || !originalForm) {
      setTimeout(rebuild, 50); return;
    }

    // 提取原始校徽 SVG
    const originalSvg = (() => {
      const svg = formContent.querySelector('.fadeIn.first svg');
      return svg ? svg.outerHTML : '';
    })();

    // 提取 SSO 链接
    const ssoHref = (() => {
      const a = document.querySelector('#tocas a');
      return a ? a.href : 'https://id.scu.edu.cn/';
    })();

    // 隐藏原始内容
    for (const c of formContent.children) c.style.display = 'none';
    formContent.style.cssText = 'max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;';

    const isEn = location.pathname === '/loginEn';
    const t = (zh, en) => isEn ? en : zh;

    // 注入新 UI
    formContent.insertAdjacentHTML('afterbegin', `
    <div id="urppp-root">
      <style>
        #urppp-root,#urppp-root *{box-sizing:border-box;}
        #urppp-root *{border:0;outline:0;}

        /* 全局背景同步主题 */
        html,body{background:var(--bg)!important;min-height:100vh}
        .wrapper{background:transparent!important}

        /* 版本水印 */
        #urppp-root::after{
          content:'URP++ v0.5.11';
          position:fixed;bottom:14px;right:18px;
          font-size:11px;color:var(--text-secondary);
          opacity:.5;letter-spacing:1px;pointer-events:none;
        }

        /* 卡片入场 */
        @keyframes uf{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .uc{animation:uf .4s ease-out}

        .uc{
          background:var(--surface);
          border-radius:var(--radius);
          box-shadow:var(--shadow);
          padding:48px 44px 36px;
        }

        /* === Brand === */
        .ub-logo{
          width:80px;height:80px;margin:0 auto 24px;
          display:none;
        }
        .ub-logo.show{display:flex;align-items:center;justify-content:center}
        .ub-logo svg{width:100%!important;height:100%!important;display:block}
        .ub h1{
          font-size:22px;font-weight:600;color:var(--text);
          text-align:center;letter-spacing:2px;line-height:1.4;margin:0;
        }
        .ub p{
          font-size:13px;color:var(--text-secondary);
          text-align:center;margin-top:6px;letter-spacing:1px;
        }

        /* === Tabs === */
        .ut{
          display:flex;margin:36px 0 32px;
          background:var(--input-bg);border-radius:var(--radius-sm);
          padding:4px;gap:4px;
        }
        .ut button{
          flex:1;padding:10px 0;
          border-radius:8px;cursor:pointer;
          font-size:14px;font-weight:500;
          color:var(--text-secondary);
          background:transparent;transition:all .2s;
          font-family:inherit;
        }
        .ut button.ac{
          background:var(--surface);color:var(--text);
          font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.05);
        }
        .ut button:hover:not(.ac){color:var(--text)}

        /* === Form === */
        .ufg{margin-bottom:20px}
        .ufg:last-of-type{margin-bottom:0}
        .ufl{
          display:block;font-size:13px;font-weight:500;
          color:var(--text);margin-bottom:8px;letter-spacing:.5px;
        }
        #urppp-root .ui{
          display:block;width:100%;height:46px;padding:0 14px;
          background:var(--input-bg) !important;
          border:1.5px solid var(--border) !important;
          border-radius:var(--radius-sm);
          font-size:15px;color:var(--text) !important;
          font-family:inherit;
          transition:border-color .2s,box-shadow .2s;
        }
        #urppp-root .ui:focus{
          border-color:var(--border-focus) !important;
          box-shadow:0 0 0 3px var(--ring) !important;
        }
        #urppp-root .ui::placeholder{color:var(--text-muted)}

        /* 验证码行：图片放在输入框内部右侧，确保总长度与其他输入框一致 */
        #urppp-root .ucr{
          width:100% !important;
          margin-bottom:0 !important;
        }
        #urppp-root .ufg-cap{
          margin-bottom:0 !important;
        }
        #urppp-root .ucap-input-wrap{
          position:relative !important;
          width:100% !important;
        }
        #urppp-root .ucap-input-wrap .ui{
          padding-right:148px !important;
        }
        #urppp-root .uci-wrap{
          position:absolute !important;
          right:-2px !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          width:144px !important;
          height:41px !important;
          border-radius:var(--radius-sm) !important;
          overflow:hidden !important;
          background:var(--input-bg) !important;
          cursor:pointer !important;
          box-shadow:0 0 0 1px var(--border) !important;
        }
        #urppp-root .uci{
          display:block !important;
          width:100% !important;
          height:100% !important;
          object-fit:cover !important;
          transform:scale(1.16) !important;
        }

        /* === Button === */
        .ubtn{
          display:flex;align-items:center;justify-content:center;
          width:100%;height:48px;margin-top:28px;
          background:var(--primary);color:#fff;
          border-radius:var(--radius-sm);
          font-size:15px;font-weight:600;
          font-family:inherit;
          cursor:pointer;letter-spacing:4px;
          transition:all .2s;
        }
        .ubtn:hover{
          background:var(--primary-hover);
          transform:translateY(-1px);
          box-shadow:0 4px 12px var(--ring);
        }
        .ubtn:active{transform:translateY(0)}

        /* === Footer === */
        .uft{
          display:flex;justify-content:center;gap:20px;
          margin-top:20px;font-size:13px;
        }
        .uft a{
          color:var(--text-secondary);text-decoration:none;
          transition:color .2s;
        }
        .uft a:hover{color:var(--primary)}

        /* === 主题 === */
        .us{
          display:flex;justify-content:center;gap:8px;margin-top:24px;
          padding-top:20px;border-top:1px solid var(--border);
        }
        .us span{
          width:22px;height:22px;border-radius:50%;
          cursor:pointer;border:2px solid var(--border);
          transition:all .2s;
        }
        .us span.ac{
          border-color:var(--primary);
          transform:scale(1.15);
        }
        .us span:hover{border-color:var(--text-secondary)}
      </style>

      <div class="uc">
        <div class="ub" id="urppp-brand">
          <div class="ub-logo">${originalSvg || ''}</div>
          <h1>${t('四川大学教务管理系统','SCU Academic System')}</h1>
          <p>${t('学生端 · 欢迎登录','Student Portal · Welcome')}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${t('账号登录','Account')}</button>
          <button data-mode="sso">${t('统一认证','SSO')}</button>
        </div>

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${t('学号','Student ID')}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${t('请输入学号','Enter student ID')}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${t('密码','Password')}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${t('请输入密码','Enter password')}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${t('验证码','Captcha')}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${t('请输入','Enter')}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${t('点击刷新','Refresh')}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${t('登 录','Sign In')}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${t('忘记密码？','Forgot password?')}</a>
          <a href="${isEn?'/login':'/loginEn'}">${isEn?'中文':'EN'}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F1F5F9"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="川大红" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);

    // ---- 事件绑定 ----

    const root = formContent.querySelector('#urppp-root');

    // 输入同步
    [
      ['#urppp-user', '#input_username'],
      ['#urppp-pass', '#input_password'],
      ['#urppp-cap', '#input_checkcode'],
    ].forEach(([ns, os]) => {
      const ni = root.querySelector(ns), oi = document.querySelector(os);
      if (ni && oi) {
        if (oi.value) ni.value = oi.value;
        ni.addEventListener('input', () => { oi.value = ni.value; });
      }
    });

    // 验证码
    const capImg = root.querySelector('#urppp-capimg');
    const capWrap = root.querySelector('#urppp-capwrap');
    const origCapImg = document.querySelector('.form-signin img');
    if (capImg && origCapImg) {
      capImg.src = origCapImg.src;
      const refreshCap = () => {
        const u = origCapImg.src.replace(/\?.*/, '') + '?' + Date.now();
        origCapImg.src = u; capImg.src = u;
      };
      if (capWrap) capWrap.addEventListener('click', refreshCap);
      else capImg.addEventListener('click', refreshCap);
    }

    // Tab：账号登录显示表单；统一认证直接跳转
    root.querySelectorAll('.ut button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.mode === 'sso') {
          location.href = ssoHref;
          return;
        }
        root.querySelectorAll('.ut button').forEach(b => b.classList.remove('ac'));
        btn.classList.add('ac');
        const formEl = root.querySelector('#urppp-form');
        const ssoEl = root.querySelector('#urppp-sso');
        if (formEl) formEl.style.display = 'block';
        if (ssoEl) ssoEl.style.display = 'none';
      });
    });

    // 登录
    const submitBtn = root.querySelector('#urppp-submit');
    submitBtn.addEventListener('click', () => {
      const origBtn = document.getElementById('loginButton');
      if (origBtn) origBtn.click();
      originalForm.submit();
    });
    root.querySelectorAll('.ui').forEach(i => {
      i.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click(); });
    });

    // 忘记密码
    root.querySelector('#urppp-forgot').addEventListener('click', e => {
      e.preventDefault();
      const links = document.querySelectorAll('a');
      for (const a of links) {
        if (a.textContent.includes('忘记') || a.textContent.includes('Forgot')) { a.click(); break; }
      }
    });

    // 主题
    const dots = root.querySelector('#urppp-dots');
    const ct = getCurrent();
    dots.querySelectorAll('span').forEach(d => {
      if (d.dataset.theme === ct) d.classList.add('ac');
      d.addEventListener('click', () => {
        applyTheme(d.dataset.theme);
        dots.querySelectorAll('span').forEach(dd => dd.classList.remove('ac'));
        d.classList.add('ac');
      });
    });

    console.log('[URP++] 登录界面已重建');
    setTimeout(() => { document.body.classList.add('urppp-ready'); hideBootLoader(); }, 100);
  }

  // ============================================================
  // 正式页面全局美化
  // ============================================================

  // 面包屑：恢复显示并清洗/重建路径
  function cleanMenuLabel(raw) {
    return String(raw || '')
      .replace(/[\u00a0\s]+/g, ' ')
      .replace(/^[>\u25b8\u203a·•\u00bb]+/, '')
      .replace(/^\s*[\u25b8>]\s*/, '')
      .trim();
  }

  function getMenuLiLabel(li) {
    if (!li) return '';
    const a = li.querySelector(':scope > a');
    if (!a) return '';
    const textEl = a.querySelector('.menu-text, .urppp-nav-text');
    if (textEl) return cleanMenuLabel(textEl.textContent);
    // 去掉图标后的纯文本
    const clone = a.cloneNode(true);
    clone.querySelectorAll('i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow').forEach(n => n.remove());
    return cleanMenuLabel(clone.textContent);
  }

  function walkMenuAncestors(li) {
    const stack = [];
    let node = li;
    const root = document.getElementById('menus') || document.getElementById('urppp-menus');
    while (node && node !== root) {
      if (node.tagName === 'LI') {
        const label = getMenuLiLabel(node);
        if (label && !/^(首页|一级菜单|二级菜单|三级菜单)$/.test(label)) {
          stack.unshift(label);
        }
      }
      node = node.parentElement;
    }
    // 去重相邻
    return stack.filter((t, i) => t && t !== stack[i - 1]);
  }

  function findMenuLiByPath() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const search = location.search || '';
    const candidates = [];
    const roots = [document.getElementById('menus'), document.getElementById('urppp-menus')].filter(Boolean);
    roots.forEach(root => {
      root.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('javascript')) return;
        try {
          const u = new URL(href, location.origin);
          const p = u.pathname.replace(/\/+$/, '') || '/';
          if (p === '/' && path !== '/') return;
          let score = 0;
          if (path === p) score = 1000 + p.length;
          else if (path.startsWith(p + '/')) score = 500 + p.length;
          else if (path.includes(p) && p.length > 8) score = 200 + p.length;
          if (score && search && u.search && search.indexOf(u.search.slice(1)) >= 0) score += 50;
          if (score > 0) candidates.push({ score, li: a.closest('li') });
        } catch (_) {}
      });
    });
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length ? candidates[0].li : null;
  }

  function getBreadcrumbTrail() {
    // 1) 当前 URL 匹配菜单（最稳）
    const byPath = findMenuLiByPath();
    if (byPath) {
      const t = walkMenuAncestors(byPath);
      if (t.length) return t;
    }

    // 2) cookie selectionBar + 原始 #menus
    let bar = '';
    try {
      const m = document.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);
      if (m) bar = decodeURIComponent(m[1]);
    } catch (_) {}
    if (bar && bar !== '0') {
      const node = document.getElementById(bar);
      if (node) {
        const t = walkMenuAncestors(node);
        if (t.length) return t;
      }
    }

    // 3) 原始 #menus / #urppp-menus 上的 .active
    let activeLi = null;
    const menuActives = Array.from(document.querySelectorAll('#menus li.active'));
    if (menuActives.length) {
      activeLi = menuActives[menuActives.length - 1];
      for (let i = menuActives.length - 1; i >= 0; i--) {
        if (!menuActives[i].querySelector('li.active')) { activeLi = menuActives[i]; break; }
      }
    }
    if (!activeLi) {
      const urpActives = Array.from(document.querySelectorAll('#urppp-menus .urppp-nav-item.active'));
      if (urpActives.length) {
        activeLi = urpActives[urpActives.length - 1];
        for (let i = urpActives.length - 1; i >= 0; i--) {
          if (!urpActives[i].querySelector('.urppp-nav-item.active')) { activeLi = urpActives[i]; break; }
        }
      }
    }
    if (activeLi) {
      const t = walkMenuAncestors(activeLi);
      if (t.length) return t;
    }

    // 4) 已有 DOM（ACE 可能已填）
    const box = document.getElementById('breadcrumbs') || document.querySelector('.breadcrumbs');
    const ul = box && (box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb'));
    if (ul) {
      const trail = [];
      Array.from(ul.children).forEach((li, idx) => {
        if (idx === 0) return;
        const t = cleanMenuLabel(li.textContent);
        if (!t || /^(首页|一级菜单|二级菜单|三级菜单)$/.test(t)) return;
        if (trail[trail.length - 1] === t) return;
        trail.push(t);
      });
      if (trail.length) return trail;
    }
    return [];
  }

  function beautifyBreadcrumbs() {
    const box = document.getElementById('breadcrumbs') || document.querySelector('.breadcrumbs');
    if (!box) return;
    box.classList.remove('hide');
    box.style.removeProperty('display');
    box.style.setProperty('display', 'flex', 'important');

    let ul = box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb');
    if (!ul) {
      ul = document.createElement('ul');
      ul.className = 'breadcrumb';
      box.appendChild(ul);
    }

    const trail = getBreadcrumbTrail();
    // trail 为空时不覆盖已有真实路径，避免和 ACE 竞态把内容清空
    if (!trail.length) {
      const existing = Array.from(ul.children).map(li => cleanMenuLabel(li.textContent)).filter(Boolean);
      const hasReal = existing.some(t => t !== '首页' && !/^(一级菜单|二级菜单|三级菜单)$/.test(t));
      if (hasReal) return;
    }

    ul.innerHTML = '';

    const home = document.createElement('li');
    home.style.cursor = 'pointer';
    home.innerHTML = '<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>';
    home.addEventListener('click', () => { window.location.href = '/'; });
    ul.appendChild(home);

    trail.forEach((label, i) => {
      const li = document.createElement('li');
      const isLast = i === trail.length - 1;
      if (isLast) li.classList.add('active');
      const span = document.createElement('span');
      span.className = 'urppp-bc-label';
      span.textContent = label;
      li.appendChild(span);
      ul.appendChild(li);
    });
  }
  // 学籍页：不改 DOM 结构。仅清理列 gutter，让「基本信息」与上方全宽标题同左缘

  // 个人信息修改等单对表单：若被误标查询表单，清掉并恢复横排
  function fixSinglePairProfileForms() {
    try {
      document.querySelectorAll('.profile-user-info, .profile-user-info-striped').forEach((root) => {
        if (root.classList.contains('setLabelWidth')) return;
        const rows = Array.from(root.querySelectorAll(':scope > .profile-info-row, .profile-info-row'));
        if (!rows.length) return;
        const multi = rows.some((row) =>
          Array.from(row.children).filter((el) => el.classList && el.classList.contains('profile-info-name')).length >= 2
        );
        if (multi) return;
        // 单对信息表
        root.classList.remove('urppp-query-form');
        root.style.setProperty('width', '100%', 'important');
        root.style.setProperty('max-width', '100%', 'important');
        root.style.setProperty('display', 'block', 'important');
        rows.forEach((row) => {
          row.classList.remove('urppp-query-row', 'urppp-dual-pair');
          delete row.dataset.urpppQueryDone;
          delete row.dataset.urpppQueryCols;
          // 拆 pair
          const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
          if (pairs.length) {
            const items = [];
            pairs.forEach((p) => Array.from(p.children).forEach((c) => items.push(c)));
            while (row.firstChild) row.removeChild(row.firstChild);
            items.forEach((el) => row.appendChild(el));
          }
          row.style.setProperty('display', 'grid', 'important');
          row.style.setProperty('grid-template-columns', '140px minmax(0,1fr)', 'important');
          row.style.setProperty('align-items', 'stretch', 'important');
          row.style.setProperty('width', '100%', 'important');
          Array.from(row.children).forEach((el) => {
            if (!el.classList) return;
            el.style.setProperty('float', 'none', 'important');
            el.style.setProperty('margin-left', '0', 'important');
            el.style.setProperty('width', 'auto', 'important');
            el.style.setProperty('max-width', 'none', 'important');
            el.style.setProperty('display', 'flex', 'important');
            el.style.setProperty('align-items', 'center', 'important');
            el.style.setProperty('box-sizing', 'border-box', 'important');
          });
        });
      });
    } catch (err) {
      console.warn('[URP++] single pair profile fix failed', err);
    }
  }
  function alignRollInfoLayout() {
    const page = document.querySelector('.page-content') || document.getElementById('page-content-template');
    if (!page) return;

    // 学籍卡若被误标成查询表单，清掉，恢复 ACE 横排
    page.querySelectorAll('.profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth').forEach((root) => {
      root.classList.remove('urppp-query-form');
      root.querySelectorAll('.profile-info-row').forEach((row) => {
        row.classList.remove('urppp-query-row');
        delete row.dataset.urpppQueryDone;
        delete row.dataset.urpppQueryCols;
        // 若曾被包成 pair，拆回 name/value 平铺
        const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
        if (pairs.length) {
          const items = [];
          pairs.forEach((pair) => {
            Array.from(pair.children).forEach((c) => items.push(c));
          });
          while (row.firstChild) row.removeChild(row.firstChild);
          items.forEach((el) => row.appendChild(el));
        }
      });
    });

    // 学籍一行两对：标记 + 强制 4 列 grid，清掉站点 width:34% / float 内联
    page.querySelectorAll('.setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row').forEach((row) => {
      // 先拆 pair 残留
      const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
      if (pairs.length) {
        const items = [];
        pairs.forEach((pair) => {
          Array.from(pair.children).forEach((c) => items.push(c));
        });
        while (row.firstChild) row.removeChild(row.firstChild);
        items.forEach((el) => row.appendChild(el));
      }
      row.classList.remove('urppp-query-row');
      delete row.dataset.urpppQueryDone;
      delete row.dataset.urpppQueryCols;

      const kids = Array.from(row.children).filter((el) =>
        el.classList && (el.classList.contains('profile-info-name') || el.classList.contains('profile-info-value'))
      );
      const names = kids.filter((el) => el.classList.contains('profile-info-name'));
      if (names.length >= 2) {
        row.classList.add('urppp-dual-pair');
        row.style.setProperty('display', 'grid', 'important');
        row.style.setProperty('grid-template-columns', '112px minmax(140px,1fr) 112px minmax(140px,1fr)', 'important');
        row.style.setProperty('align-items', 'stretch', 'important');
        row.style.setProperty('width', '100%', 'important');
        row.style.setProperty('max-width', '100%', 'important');
        row.style.setProperty('float', 'none', 'important');
        kids.forEach((el) => {
          el.style.setProperty('float', 'none', 'important');
          el.style.setProperty('clear', 'none', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('margin-left', '0', 'important');
          el.style.setProperty('width', 'auto', 'important');
          el.style.setProperty('max-width', 'none', 'important');
          el.style.setProperty('min-width', '0', 'important');
          el.style.setProperty('box-sizing', 'border-box', 'important');
          el.style.setProperty('display', 'flex', 'important');
          el.style.setProperty('align-items', 'center', 'important');
          // 去掉站点 style="width:34%" 等
          if (el.classList.contains('profile-info-value')) {
            el.style.removeProperty('width');
            el.style.setProperty('width', 'auto', 'important');
            el.style.setProperty('justify-content', 'flex-start', 'important');
            el.style.setProperty('white-space', 'normal', 'important');
            el.style.setProperty('word-break', 'normal', 'important');
          } else {
            el.style.setProperty('justify-content', 'flex-end', 'important');
            el.style.setProperty('white-space', 'nowrap', 'important');
          }
        });
      } else {
        row.classList.remove('urppp-dual-pair');
      }
    });
    // 卡片圆角内联兜底
    page.querySelectorAll('.profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth').forEach((card) => {
      card.classList.remove('urppp-query-form');
      card.style.setProperty('border-radius', '12px', 'important');
      card.style.setProperty('overflow', 'hidden', 'important');
      card.style.setProperty('border', '1px solid var(--border)', 'important');
      card.style.setProperty('width', '100%', 'important');
      card.style.setProperty('max-width', '100%', 'important');
      card.style.setProperty('box-sizing', 'border-box', 'important');
    });
    // 还原此前可能写过的 flex/宽度内联，避免破坏 col-xs-4 / col-xs-8
    page.querySelectorAll('.urppp-col-row').forEach((el) => {
      el.classList.remove('urppp-col-row');
      ['display','flex-wrap','gap','align-items','width','box-sizing'].forEach((p) => el.style.removeProperty(p));
    });
    page.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach((col) => {
      ['float','flex','width','max-width','padding-left','padding-right','box-sizing'].forEach((p) => {
        // 只清我们可能写过的强制布局，保留页面原有 inline 尺寸需求
        if (col.style.getPropertyPriority(p) === 'important') col.style.removeProperty(p);
      });
      col.style.setProperty('padding-left', '0', 'important');
      col.style.setProperty('box-sizing', 'border-box', 'important');
    });
    // 左列右侧留缝，右列不再额外左缩进
    page.querySelectorAll('.col-xs-4, .col-sm-4, .col-md-4').forEach((col) => {
      col.style.setProperty('padding-right', '16px', 'important');
    });
    page.querySelectorAll('.col-xs-8, .col-sm-8, .col-md-8').forEach((col) => {
      col.style.setProperty('padding-left', '0', 'important');
      col.style.setProperty('padding-right', '0', 'important');
    });
    // 若之前 hoist 过标题，刷新后会恢复；运行时若还挂在 wrap 里则放回原列顶部
    page.querySelectorAll('.urppp-section-title-wrap').forEach((wrap) => {
      const header = wrap.querySelector('h4.header, h3.header, h5.header, .header.smaller');
      if (!header) { wrap.remove(); return; }
      // 找后面的多列容器里的第一个 col，把标题塞回去
      let sib = wrap.nextElementSibling;
      while (sib && !sib.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]')) {
        sib = sib.nextElementSibling;
      }
      const leftCol = sib && (sib.querySelector('.col-xs-4, .col-sm-4, .col-md-4') || Array.from(sib.children).find((c) => /col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(c.className || '')));
      if (leftCol) {
        leftCol.insertBefore(header, leftCol.firstChild);
        delete header.dataset.urpppHoisted;
        header.style.removeProperty('width');
        header.style.removeProperty('max-width');
        header.style.removeProperty('margin-left');
        header.style.removeProperty('margin-right');
        header.style.removeProperty('box-sizing');
        header.style.removeProperty('position');
        header.style.removeProperty('left');
      }
      wrap.remove();
    });
  }
  // 查询条件：把 ACE 同行多对 name/value 包成 pair；按本行列数动态布局
  // 查询区原生 select 统一升级为 Chosen（与「学年学期」一致）
  // 注意：脚本有 @grant，页面 jQuery/Chosen 在 unsafeWindow 上
  function pageJQuery() {
    const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    return g.jQuery || g.$ || window.jQuery || window.$ || null;
  }

  function ensureQueryChosen() {
    try {
      const $ = pageJQuery();
      if (!$ || !$.fn || typeof $.fn.chosen !== 'function') return false;

      const roots = document.querySelectorAll(
        '.profile-user-info, .urppp-query-form, .profile-info-row, form'
      );
      const seen = new Set();
      const sels = [];
      roots.forEach((root) => {
        root.querySelectorAll('select').forEach((sel) => {
          if (seen.has(sel)) return;
          seen.add(sel);
          sels.push(sel);
        });
      });
      // 兜底：独立 value_element
      document.querySelectorAll('select.value_element, .profile-info-value > select').forEach((sel) => {
        if (seen.has(sel)) return;
        seen.add(sel);
        sels.push(sel);
      });

      sels.forEach((sel) => {
        if (!sel || sel.multiple || sel.disabled) return;
        if (sel.size && sel.size > 1) return; // 列表多选框跳过
        const $sel = $(sel);
        const already =
          !!$sel.data('chosen') ||
          sel.classList.contains('chzn-done') ||
          !!(sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')) ||
          !!(sel.parentElement && sel.parentElement.querySelector(':scope > .chosen-container'));
        if (already) {
          sel.dataset.urpppChosen = '1';
          sel.classList.add('urppp-chosen-hidden');
          sel.style.setProperty('display', 'none', 'important');
          return;
        }
        try {
          if (!sel.classList.contains('select')) sel.classList.add('select');
          // destroy 半残状态再 init
          try { if ($sel.data('chosen')) $sel.chosen('destroy'); } catch (_) { /* ignore */ }
          $sel.chosen({
            allow_single_deselect: true,
            search_contains: true,
            width: '100%',
            no_results_text: '无匹配项',
            disable_search_threshold: 0
          });
          sel.dataset.urpppChosen = '1';
          sel.classList.add('urppp-chosen-hidden');
          sel.style.setProperty('display', 'none', 'important');
          const cont =
            sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')
              ? sel.nextElementSibling
              : (sel.parentElement && sel.parentElement.querySelector('.chosen-container'));
          if (cont) {
            cont.style.setProperty('width', '100%', 'important');
            cont.style.setProperty('min-width', '0', 'important');
            cont.style.setProperty('display', 'block', 'important');
          }
        } catch (e) {
          console.warn('[URP++] chosen init failed', sel, e);
        }
      });

      // 校区→教学楼→教室 会用 .html() 重写 option，需同步 Chosen
      if (!window.__urpppChosenHtmlPatch) {
        window.__urpppChosenHtmlPatch = true;
        const oldHtml = $.fn.html;
        $.fn.html = function () {
          const ret = oldHtml.apply(this, arguments);
          if (arguments.length) {
            try {
              this.filter('select').add(this.find('select')).each(function () {
                const $el = $(this);
                if ($el.data('chosen') || $el.next('.chosen-container').length) {
                  try { $el.trigger('chosen:updated'); } catch (_) { /* ignore */ }
                }
              });
            } catch (_) { /* ignore */ }
          }
          return ret;
        };
      }
      return true;
    } catch (err) {
      console.warn('[URP++] ensureQueryChosen failed', err);
      return false;
    }
  }

  function scheduleEnsureQueryChosen() {
    if (window.__urpppChosenScheduleBound) return;
    window.__urpppChosenScheduleBound = true;
    const delays = [0, 200, 600, 1500, 3000];
    delays.forEach((ms) => setTimeout(() => { ensureQueryChosen(); }, ms));
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const ok = ensureQueryChosen();
      // jQuery/chosen 就绪后多试几次，不必无限跑
      if ((ok && tries > 3) || tries > 15) clearInterval(timer);
    }, 500);
  }

  // 空闲教室：楼栋列表轻量标记（校区标题 / 楼栋项 / 当前高亮）

  // 分页条：urp.pagebar 注入后常带 absolute/float，强制流式防重叠
  // 分页：基于 pagination.js 真实结构
  // ul.pagination > li.paginate_button > span(padding:3px 7px)
  // 当前页: li.active；确定: #btn_turnpageto_* (absolute, focus 才 display)
  function beautifyPagebar(root) {
    try {
      const bars = (root && root.querySelectorAll)
        ? root.querySelectorAll('#urppagebar')
        : document.querySelectorAll('#urppagebar');
      bars.forEach((bar) => {
        if (!bar) return;
        bar.classList.add('urppp-pagebar');

        // 容器
        bar.style.setProperty('display', 'block', 'important');
        bar.style.setProperty('width', '100%', 'important');
        const wrap = bar.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]') || bar;
        wrap.style.setProperty('display', 'flex', 'important');
        wrap.style.setProperty('align-items', 'center', 'important');
        wrap.style.setProperty('flex-wrap', 'wrap', 'important');
        wrap.style.setProperty('gap', '8px', 'important');
        wrap.style.setProperty('position', 'relative', 'important');

        // ul.pagination
        bar.querySelectorAll('ul.pagination').forEach((ul) => {
          ul.classList.add('urppp-pagination');
          ul.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'flex-wrap:wrap !important',
            'gap:4px !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'float:none !important',
            'position:static !important'
          ].join(';');
        });

        // 每个 li.paginate_button 是整颗按钮；内层 span 铺满且无边框
        bar.querySelectorAll('ul.pagination > li').forEach((li) => {
          const active = li.classList.contains('active');
          const disabled = li.classList.contains('disabled');
          const prev = li.classList.contains('previous') || /previous/i.test(li.getAttribute('name') || '');
          const next = li.classList.contains('next') || /next/i.test(li.getAttribute('name') || '');
          li.classList.add('urppp-page-li');
          if (active) li.classList.add('urppp-page-li-active');
          if (disabled) li.classList.add('urppp-page-li-disabled');
          if (prev) li.classList.add('urppp-page-li-prev');
          if (next) li.classList.add('urppp-page-li-next');

          li.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'float:none !important',
            'position:static !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'border:none !important',
            'background:transparent !important',
            'height:auto !important',
            'min-height:0 !important'
          ].join(';');

          const span = li.querySelector(':scope > span, :scope > a') || li.firstElementChild;
          if (!span) return;
          span.classList.add('urppp-page-chip');
          if (active) span.classList.add('urppp-page-chip-active');
          if (disabled) span.classList.add('urppp-page-chip-disabled');
          if (prev || next) span.classList.add('urppp-page-chip-nav');

          const minW = (prev || next) ? '72px' : '40px';
          const bg = active ? 'var(--primary)' : 'var(--surface)';
          const bd = active ? 'var(--primary)' : 'var(--border)';
          const fg = active ? '#fff' : (disabled ? 'var(--text-muted)' : 'var(--text)');
          span.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'box-sizing:border-box !important',
            'float:none !important',
            'position:static !important',
            'width:auto !important',
            'min-width:' + minW + ' !important',
            'height:36px !important',
            'min-height:36px !important',
            'max-height:36px !important',
            'padding:0 12px !important',
            'margin:0 !important',
            'line-height:36px !important',
            'font-size:14px !important',
            'font-weight:600 !important',
            'border-radius:8px !important',
            'border:1px solid ' + bd + ' !important',
            'background:' + bg + ' !important',
            'color:' + fg + ' !important',
            'box-shadow:none !important',
            'text-decoration:none !important',
            'cursor:' + (disabled ? 'default' : 'pointer') + ' !important',
            'white-space:nowrap !important',
            'overflow:hidden !important'
          ].join(';');
        });

        // 跳转区：取消 absolute 叠层，确定默认隐藏、focus 显示（交给站点 + CSS）
        bar.querySelectorAll('[id^="btn_turnpageto_"]').forEach((btn) => {
          btn.classList.add('urppp-page-confirm');
          // 不要强制 display；站点 turnpagetoFocus/Blur 控制
          // 但去掉 absolute，避免和文字重叠
          btn.style.setProperty('position', 'static', 'important');
          btn.style.setProperty('left', 'auto', 'important');
          btn.style.setProperty('top', 'auto', 'important');
          btn.style.setProperty('float', 'none', 'important');
          btn.style.setProperty('height', '36px', 'important');
          btn.style.setProperty('min-width', '56px', 'important');
          btn.style.setProperty('padding', '0 12px', 'important');
          btn.style.setProperty('margin', '0 4px', 'important');
          btn.style.setProperty('font-size', '13px', 'important');
          btn.style.setProperty('line-height', '1', 'important');
          btn.style.setProperty('vertical-align', 'middle', 'important');
        });

        // 跳转输入框的 relative 包裹：改为 inline-flex，避免 42x26 裁切
        bar.querySelectorAll('[id^="turnpageto_"]').forEach((inp) => {
          inp.classList.add('urppp-page-goto');
          inp.style.setProperty('position', 'static', 'important');
          inp.style.setProperty('display', 'inline-block', 'important');
          inp.style.setProperty('height', '36px', 'important');
          inp.style.setProperty('width', '48px', 'important');
          inp.style.setProperty('margin', '0 4px', 'important');
          inp.style.setProperty('padding', '4px 8px', 'important');
          inp.style.setProperty('font-size', '14px', 'important');
          inp.style.setProperty('line-height', '1.2', 'important');
          inp.style.setProperty('box-sizing', 'border-box', 'important');
          inp.style.setProperty('vertical-align', 'middle', 'important');
          const wrapSpan = inp.parentElement;
          if (wrapSpan && wrapSpan.tagName === 'SPAN') {
            wrapSpan.style.setProperty('position', 'static', 'important');
            wrapSpan.style.setProperty('display', 'inline-flex', 'important');
            wrapSpan.style.setProperty('align-items', 'center', 'important');
            wrapSpan.style.setProperty('width', 'auto', 'important');
            wrapSpan.style.setProperty('height', 'auto', 'important');
            wrapSpan.style.setProperty('min-height', '0', 'important');
            wrapSpan.style.setProperty('vertical-align', 'middle', 'important');
          }
        });

        // 统计文字区
        bar.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach((el) => {
          el.style.setProperty('display', 'inline', 'important');
          el.style.setProperty('border', 'none', 'important');
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('padding', '0', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('height', 'auto', 'important');
          el.style.setProperty('line-height', '36px', 'important');
          el.style.setProperty('font-size', '13px', 'important');
          el.style.setProperty('color', 'var(--text-secondary, var(--text-muted))', 'important');
        });
      });
    } catch (err) {
      console.warn('[URP++] pagebar beautify failed', err);
    }
  }

  function scheduleBeautifyPagebar() {
    if (window.__urpppPagebarBound) return;
    window.__urpppPagebarBound = true;
    const run = () => beautifyPagebar();
    ;[0, 200, 800, 2000].forEach((ms) => setTimeout(run, ms));
    const obs = new MutationObserver((muts) => {
      const meaningful = muts.some((m) => m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length));
      if (!meaningful) return;
      clearTimeout(window.__urpppPagebarTimer);
      window.__urpppPagebarTimer = setTimeout(run, 120);
    });
    // 观察所有 #urppagebar 及 body（分页可能晚注入）
    document.querySelectorAll('#urppagebar').forEach((host) => {
      obs.observe(host, { childList: true, subtree: true });
    });
    obs.observe(document.body, { childList: true, subtree: false });
  }
  function beautifyFreeClassroomList() {
    try {
      document.querySelectorAll('#drag-ul, ul#drag-ul').forEach((ul) => {
        if (!ul) return;
        const items = Array.from(ul.children).filter((n) => n.tagName === 'LI');
        if (!items.length) {
          ul.classList.add('urppp-empty');
          ul.style.setProperty('display', 'none', 'important');
          const host = ul.closest('#xq-section, .widget-main, .widget-body');
          // 仅当容器里没有任何 li 时隐藏外框，避免误伤
          if (host && !host.querySelector('li')) {
            host.classList.add('urppp-empty');
            host.style.setProperty('display', 'none', 'important');
          }
          return;
        }
        ul.classList.remove('urppp-empty');
        ul.classList.add('urppp-drag-ul');
        ul.style.removeProperty('display');
        ul.style.setProperty('height', 'auto', 'important');
        ul.style.setProperty('min-height', '0', 'important');

        items.forEach((li) => {
          const txt = (li.textContent || '').replace(/\s+/g, ' ').trim();
          const hasClick =
            (li.getAttribute('onclick') || '').includes('goDetail') ||
            li.classList.contains('ui-selectee') ||
            li.classList.contains('jc-future') ||
            !!li.querySelector('a');
          if (!hasClick && /校区/.test(txt) && txt.length <= 12) {
            li.classList.add('xq-section');
            li.classList.remove('ui-selectee', 'jc-future', 'urppp-building-active');
          } else if (hasClick && !li.classList.contains('jc-future')) {
            li.classList.add('ui-selectee');
          }
        });
      });

      if (!window.__urpppBuildingActiveBound) {
        window.__urpppBuildingActiveBound = true;
        document.addEventListener('click', (e) => {
          const li = e.target && e.target.closest ? e.target.closest('#drag-ul > li') : null;
          if (!li || li.classList.contains('xq-section') || li.classList.contains('jc-future')) return;
          const ul = li.parentElement;
          if (!ul) return;
          ul.querySelectorAll('li.urppp-building-active, li.ui-selected').forEach((x) => {
            x.classList.remove('urppp-building-active', 'ui-selected');
          });
          li.classList.add('urppp-building-active', 'ui-selected');
        }, true);
      }
    } catch (err) {
      console.warn('[URP++] free classroom list beautify failed', err);
    }
  }
  function beautifyQueryForms() {
    try {
      ensureQueryChosen();
      const applyRowLayout = (row) => {
        const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
        const n = Math.max(pairs.length, 1);
        // 4 个就 4 列，3 个 3 列，2 个 2 列；超过 4 按 4 列换行
        const cols = Math.min(n, 4);
        row.classList.add('urppp-query-row');
        row.style.setProperty('display', 'grid', 'important');
        row.style.setProperty('grid-template-columns', 'repeat(' + cols + ', minmax(0, 1fr))', 'important');
        row.style.setProperty('column-gap', '14px', 'important');
        row.style.setProperty('row-gap', '10px', 'important');
        row.style.setProperty('align-items', 'center', 'important');
        row.style.setProperty('width', '100%', 'important');
        row.style.setProperty('max-width', '100%', 'important');
        row.style.setProperty('box-sizing', 'border-box', 'important');
        row.dataset.urpppQueryCols = String(cols);

        pairs.forEach((pair) => {
          pair.style.setProperty('display', 'flex', 'important');
          pair.style.setProperty('align-items', 'center', 'important');
          pair.style.setProperty('width', '100%', 'important');
          pair.style.setProperty('min-width', '0', 'important');
          pair.style.setProperty('max-width', '100%', 'important');
          pair.style.setProperty('box-sizing', 'border-box', 'important');
          pair.style.removeProperty('flex');

          const name = pair.querySelector('.profile-info-name');
          const value = pair.querySelector('.profile-info-value');
          if (name) {
            name.style.setProperty('float', 'none', 'important');
            name.style.setProperty('display', 'flex', 'important');
            name.style.setProperty('align-items', 'center', 'important');
            name.style.setProperty('justify-content', 'flex-end', 'important');
            name.style.setProperty('flex', '0 0 84px', 'important');
            name.style.setProperty('width', '84px', 'important');
            name.style.setProperty('min-width', '84px', 'important');
            name.style.setProperty('max-width', '96px', 'important');
            name.style.setProperty('margin', '0', 'important');
            name.style.setProperty('margin-left', '0', 'important');
            name.style.setProperty('padding', '0 8px 0 0', 'important');
            name.style.setProperty('background', 'transparent', 'important');
            name.style.setProperty('border', 'none', 'important');
            name.style.setProperty('border-right', 'none', 'important');
          }
          if (value) {
            value.style.setProperty('float', 'none', 'important');
            value.style.setProperty('display', 'flex', 'important');
            value.style.setProperty('align-items', 'center', 'important');
            value.style.setProperty('flex', '1 1 auto', 'important');
            value.style.setProperty('width', 'auto', 'important');
            value.style.setProperty('min-width', '0', 'important');
            value.style.setProperty('max-width', 'none', 'important');
            value.style.setProperty('margin', '0', 'important');
            value.style.setProperty('margin-left', '0', 'important');
            value.style.setProperty('padding', '0', 'important');
            value.style.setProperty('background', 'transparent', 'important');
            value.style.setProperty('border', 'none', 'important');
            value.querySelectorAll('input, select, .chosen-container, .form-control').forEach((el) => {
              el.style.setProperty('width', '100%', 'important');
              el.style.setProperty('min-width', '0', 'important');
              el.style.setProperty('max-width', 'none', 'important');
            });
          }
          // Chosen 隐藏原生 select，并拉满宽度
          pair.querySelectorAll('.chosen-container').forEach((c) => {
            const prev = c.previousElementSibling;
            if (prev && prev.tagName === 'SELECT') {
              prev.style.setProperty('display', 'none', 'important');
              prev.classList.add('urppp-chosen-hidden');
            }
            const sel = c.parentElement && c.parentElement.querySelector('select');
            if (sel) {
              sel.style.setProperty('display', 'none', 'important');
              sel.classList.add('urppp-chosen-hidden');
            }
            c.style.setProperty('width', '100%', 'important');
            c.style.setProperty('min-width', '0', 'important');
            c.style.setProperty('max-width', 'none', 'important');
            const single = c.querySelector('.chosen-single');
            if (single) {
              single.style.setProperty('width', '100%', 'important');
              single.style.setProperty('max-width', 'none', 'important');
              single.style.setProperty('display', 'flex', 'important');
              single.style.setProperty('align-items', 'center', 'important');
              single.style.setProperty('height', '34px', 'important');
              single.style.setProperty('line-height', 'normal', 'important');
              const sp = single.querySelector(':scope > span, span');
              if (sp) {
                sp.style.setProperty('line-height', 'normal', 'important');
                sp.style.setProperty('height', 'auto', 'important');
                sp.style.setProperty('margin-top', '0', 'important');
                sp.style.setProperty('padding-top', '0', 'important');
              }
              const ab = single.querySelector('div');
              if (ab) {
                ab.style.setProperty('display', 'flex', 'important');
                ab.style.setProperty('align-items', 'center', 'important');
                ab.style.setProperty('justify-content', 'center', 'important');
                ab.style.setProperty('top', '0', 'important');
                ab.style.setProperty('bottom', '0', 'important');
                ab.style.setProperty('height', 'auto', 'important');
                const bb = ab.querySelector('b');
                if (bb) {
                  bb.style.setProperty('margin', '0', 'important');
                  bb.style.setProperty('background-position', 'center center', 'important');
                  bb.style.setProperty('background-size', '12px 12px', 'important');
                  bb.style.setProperty('width', '14px', 'important');
                  bb.style.setProperty('height', '14px', 'important');
                }
              }
            }
          });
        });
      };

      const roots = document.querySelectorAll(
        '.profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)'
      );
      roots.forEach((root) => {
        // 学籍 setLabelWidth 不当查询表单
        if (root.classList.contains('setLabelWidth')) return;
        // 个人信息修改等：每行只有一对 name/value，不当查询表单
        const multiPair = Array.from(root.querySelectorAll('.profile-info-row')).some((row) => {
          return Array.from(row.children).filter((el) => el.classList && el.classList.contains('profile-info-name')).length >= 2;
        });
        const hasChosenQuery = !!root.querySelector('select.chosen, select.select, .chosen-container');
        if (!multiPair && !hasChosenQuery) {
          root.classList.remove('urppp-query-form');
          return;
        }
        // 没有可编辑控件也不当查询表单
        if (!root.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')) {
          return;
        }
        root.classList.add('urppp-query-form');
        root.querySelectorAll('.profile-info-row').forEach((row) => {
          if (row.dataset.urpppQueryDone === '1') {
            applyRowLayout(row);
            return;
          }
          const kids = Array.from(row.children).filter((el) =>
            el.classList && (el.classList.contains('profile-info-name') || el.classList.contains('profile-info-value'))
          );
          const names = kids.filter((el) => el.classList.contains('profile-info-name'));
          if (names.length < 2) {
            row.dataset.urpppQueryDone = '1';
            return;
          }

          const frag = document.createDocumentFragment();
          for (let i = 0; i < kids.length; ) {
            const a = kids[i];
            const b = kids[i + 1];
            if (
              a && b &&
              a.classList.contains('profile-info-name') &&
              b.classList.contains('profile-info-value')
            ) {
              const pair = document.createElement('div');
              pair.className = 'urppp-query-pair';
              pair.appendChild(a);
              pair.appendChild(b);
              frag.appendChild(pair);
              i += 2;
            } else if (a) {
              frag.appendChild(a);
              i += 1;
            } else break;
          }
          while (row.firstChild) row.removeChild(row.firstChild);
          row.appendChild(frag);
          row.dataset.urpppQueryDone = '1';
          applyRowLayout(row);
        });
      });
      ensureQueryChosen();
    } catch (err) {
      console.warn('[URP++] query form beautify failed', err);
    }
  }

  // Chosen 下拉对齐：禁止全量 MutationObserver（会 style 回写死循环卡死页面）
  function patchChosenDropdownAlign() {
    if (window.__urpppChosenAlignBound) return;
    window.__urpppChosenAlignBound = true;
    let busy = false;

    const apply = (root) => {
      if (busy) return;
      busy = true;
      try {
        const scope = root && root.querySelectorAll ? root : document;
        // 选项垂直居中：flex + 内联，并注入最高优先级样式
        let st = document.getElementById('urppp-chosen-li-style');
        if (!st) {
          st = document.createElement('style');
          st.id = 'urppp-chosen-li-style';
          document.documentElement.appendChild(st);
        }
        st.textContent = [
          '.self div.profile-info-value a.chosen-single > span,',
          'body .self div.profile-info-value a.chosen-single > span {',
          '  line-height: normal !important;',
          '  height: auto !important;',
          '  margin-top: 0 !important;',
          '  padding-top: 0 !important;',
          '}',
          '.self div.profile-info-value a.chosen-single,',
          'body .self div.profile-info-value a.chosen-single {',
          '  display: flex !important;',
          '  align-items: center !important;',
          '  height: 34px !important;',
          '  line-height: normal !important;',
          '}',
          'body .chosen-container .chosen-results li,',
          'body .chosen-with-drop .chosen-results li,',
          'html body .chosen-container .chosen-results li.active-result {',
          '  display:flex !important;',
          '  align-items:center !important;',
          '  justify-content:flex-start !important;',
          '  height:36px !important;',
          '  min-height:36px !important;',
          '  max-height:36px !important;',
          '  line-height:1 !important;',
          '  padding:0 12px !important;',
          '  margin:0 !important;',
          '  box-sizing:border-box !important;',
          '}',
          'body .chosen-container .chosen-results li.highlighted,',
          'body .chosen-container .chosen-results li.result-selected {',
          '  display:flex !important;',
          '  align-items:center !important;',
          '  height:36px !important;',
          '  line-height:1 !important;',
          '  padding:0 12px !important;',
          '}'
        ].join('');
        scope.querySelectorAll('.chosen-results li').forEach((li) => {
          li.style.cssText = [
            'display:flex !important',
            'align-items:center !important',
            'justify-content:flex-start !important',
            'height:36px !important',
            'min-height:36px !important',
            'max-height:36px !important',
            'line-height:1 !important',
            'padding:0 12px !important',
            'margin:0 !important',
            'box-sizing:border-box !important'
          ].join(';');
        });
        // 搜索框：只设一次必要样式；图标交给 CSS（相对 input 同高盒子）
        // 关闭态/打开态：强制 chosen-single > span 的 line-height 为 normal
        scope.querySelectorAll('a.chosen-single').forEach((a) => {
          a.style.setProperty('display', 'flex', 'important');
          a.style.setProperty('align-items', 'center', 'important');
          a.style.setProperty('height', '34px', 'important');
          a.style.setProperty('min-height', '34px', 'important');
          a.style.setProperty('line-height', 'normal', 'important');
          a.style.setProperty('padding-top', '0', 'important');
          a.style.setProperty('padding-bottom', '0', 'important');
          const sp = a.querySelector(':scope > span');
          if (sp) {
            sp.style.setProperty('line-height', 'normal', 'important');
            sp.style.setProperty('height', 'auto', 'important');
            sp.style.setProperty('margin-top', '0', 'important');
            sp.style.setProperty('margin-bottom', '0', 'important');
            sp.style.setProperty('padding-top', '0', 'important');
            sp.style.setProperty('padding-bottom', '0', 'important');
          }
        });
        scope.querySelectorAll('.chosen-search').forEach((search) => {
          // 不在打开时改 input padding，避免光标前闪
          // 图标与尺寸交给 CSS 固定规则
          if (!search.querySelector('.urppp-chosen-search-icon')) {
            const icon = document.createElement('i');
            icon.className = 'fa fa-search urppp-chosen-search-icon';
            icon.setAttribute('aria-hidden', 'true');
            search.appendChild(icon);
          }
        });
      } finally {
        // 下一帧再放行，避免同步重入
        setTimeout(() => { busy = false; }, 0);
      }
    };

    // 只在用户打开下拉时跑，不做 body 级 style 观察
    document.addEventListener('mousedown', (e) => {
      const c = e.target && e.target.closest ? e.target.closest('.chosen-container') : null;
      if (!c) return;
      setTimeout(() => apply(c), 0);
      setTimeout(() => apply(c), 30);
      setTimeout(() => apply(c), 100);
      setTimeout(() => apply(c), 200);
    }, true);

    try {
      const $ = window.jQuery || window.$;
      if ($ && $.fn) {
        $(document)
          .off('chosen:showing_dropdown.urppp chosen:updated.urppp')
          .on('chosen:showing_dropdown.urppp chosen:updated.urppp', (e) => {
            const host = e.target && e.target.parentElement ? e.target.parentElement : document;
            setTimeout(() => apply(host), 0);
            setTimeout(() => apply(host), 60);
          });
      }
    } catch (_) {}
  }

  // 作息时间表：轻量美化（不改数据；标题提出为整行居中横幅）
  function beautifyWorkRestSchedule() {
    try {
      const modal = document.getElementById('work_rest_schedule_modal');
      if (!modal) return;
      if (modal.classList.contains('in') || modal.classList.contains('show')) {
        modal.style.setProperty('display', 'block', 'important');
      }
      const body = modal.querySelector('.modal-body') || modal;
      const tables = Array.from(body.querySelectorAll('table'));
      if (!tables.length) return;

      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

      // 已处理过则跳过（避免重复插横幅）
      if (body.dataset.urpppWrsDone === '1') {
        // 仍允许刷新 class
      }

      tables.forEach((table) => {
        const wrap = table.closest('.urppp-table-wrap');
        if (wrap && modal.contains(wrap) && wrap.parentElement) {
          wrap.parentElement.insertBefore(table, wrap);
          wrap.remove();
        }

        table.classList.add('urppp-wrs-table');
        table.style.setProperty('width', '100%', 'important');

        const rows = Array.from(table.rows || []);
        if (!rows.length) return;

        // 用“有时间的数据行”估算真实列数，避免被残缺标题行误导
        let colCount = 0;
        rows.forEach((tr) => {
          const rt = norm(tr.textContent);
          if (!/\d{1,2}:\d{2}/.test(rt)) return;
          let n = 0;
          Array.from(tr.cells || []).forEach((c) => { n += (c.colSpan || 1); });
          if (n > colCount) colCount = n;
        });
        if (colCount < 4) {
          // 回退：所有行最大
          rows.forEach((tr) => {
            let n = 0;
            Array.from(tr.cells || []).forEach((c) => { n += (c.colSpan || 1); });
            if (n > colCount) colCount = n;
          });
        }
        if (colCount < 1) colCount = 1;

        // 标题行：提出为表格上方/段前横幅，或改写成单格满宽
        Array.from(table.rows || []).forEach((tr) => {
          const cells = Array.from(tr.cells || []);
          if (!cells.length) return;
          const rowText = norm(tr.textContent);
          const hasTime = /\d{1,2}:\d{2}/.test(rowText);
          const isTitleRow = !hasTime && (
            /作息时间|学年/.test(rowText) ||
            (/(望江|华西|江安)/.test(rowText) && /校区|时间|安排|作息/.test(rowText))
          );

          if (isTitleRow) {
            const titleText = rowText;
            // 直接重写整行：一个满宽单元格（最稳）
            tr.className = 'urppp-wrs-title-row';
            tr.innerHTML = '<td class="urppp-wrs-title" colspan="' + colCount + '" align="center">' + esc(titleText) + '</td>';
            return;
          }

          cells.forEach((cell) => {
            ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'textAlign', 'verticalAlign', 'width']
              .forEach((k) => { try { cell.style[k] = ''; } catch (_) {} });
            cell.classList.remove('urppp-wrs-title', 'urppp-wrs-period', 'urppp-wrs-time', 'urppp-wrs-head');
            const t = norm(cell.textContent);
            if (!t) return;
            if (/^(上午|下午|晚上|中午)$/.test(t) || ((cell.rowSpan || 1) > 1 && /上午|下午|晚上|中午/.test(t))) {
              cell.classList.add('urppp-wrs-period');
            } else if (/节次|大节|时间|校区/.test(t) && !/\d{1,2}:\d{2}/.test(t) && !/第\d/.test(t)) {
              if (/节次|时间|大节|校区/.test(rowText) && !/\d{1,2}:\d{2}/.test(rowText)) {
                cell.classList.add('urppp-wrs-head');
              }
            } else if (/\d{1,2}:\d{2}/.test(t)) {
              cell.classList.add('urppp-wrs-time');
            }
            cell.style.setProperty('text-align', 'center', 'important');
            cell.style.setProperty('vertical-align', 'middle', 'important');
          });
        });
      });

      // 弹窗标题也强制居中
      const mt = modal.querySelector('.modal-title');
      if (mt) {
        mt.style.setProperty('text-align', 'center', 'important');
        mt.style.setProperty('width', '100%', 'important');
      }
      body.dataset.urpppWrsDone = '1';
    } catch (_) {}
  }

  // 学校校历：重定向到教务处新页面
  const SCHOOL_CALENDAR_URL = 'https://jwc.scu.edu.cn/cdxl.htm';
  function patchSchoolCalendarLink() {
    const selectors = [
      'a[onclick*="jwc.scu.edu.cn/article/206"]',
      'a[href*="jwc.scu.edu.cn/article/206"]',
      '.cdsj a',
      '.ace-nav a'
    ];
    const seen = new Set();
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((a) => {
        if (seen.has(a)) return;
        seen.add(a);
        const text = (a.textContent || '').replace(/\s+/g, '');
        const onclick = a.getAttribute('onclick') || '';
        const href = a.getAttribute('href') || '';
        const isCalendar =
          text.includes('学校校历') ||
          onclick.includes('article/206') ||
          href.includes('article/206') ||
          (onclick.includes('jwc.scu.edu.cn') && text.includes('校历'));
        if (!isCalendar) return;
        a.setAttribute('href', SCHOOL_CALENDAR_URL);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.setAttribute('onclick', `window.open('${SCHOOL_CALENDAR_URL}');return false;`);
      });
    });
  }
  // 方案成绩等页：ACE 用 navbar-static 包 nav-tabs，清内联背景/负 margin
  function patchAceTabNavbars() {
    document.querySelectorAll('#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static').forEach((nav) => {
      if (!nav.querySelector('.nav-tabs')) return;
      // 外壳透明，避免与 nav-tabs 叠出第二条
      ['background', 'background-color', 'background-image', 'border', 'border-radius', 'box-shadow'].forEach((p) => {
        nav.style.setProperty(p, p.startsWith('background') || p === 'box-shadow' ? (p === 'box-shadow' ? 'none' : 'transparent') : (p === 'border' ? 'none' : '0'), 'important');
      });
      nav.style.setProperty('background', 'transparent', 'important');
      nav.style.setProperty('background-color', 'transparent', 'important');
      nav.style.setProperty('border', 'none', 'important');
      nav.style.setProperty('border-radius', '0', 'important');
      nav.style.setProperty('box-shadow', 'none', 'important');
      nav.style.setProperty('width', '100%', 'important');
      nav.style.setProperty('margin', '0 0 14px 0', 'important');
      nav.style.setProperty('padding', '0', 'important');
      nav.style.setProperty('min-height', '0', 'important');
      nav.style.setProperty('box-sizing', 'border-box', 'important');
      const inner = nav.querySelector('.navbar-inner');
      if (inner) {
        inner.style.setProperty('background', 'transparent', 'important');
        inner.style.setProperty('border', 'none', 'important');
        inner.style.setProperty('box-shadow', 'none', 'important');
        inner.style.setProperty('padding', '0', 'important');
        inner.style.setProperty('min-height', '0', 'important');
        inner.style.setProperty('filter', 'none', 'important');
        inner.style.setProperty('width', '100%', 'important');
      }
      nav.querySelectorAll('.container, .container-fluid').forEach((c) => {
        c.style.setProperty('width', '100%', 'important');
        c.style.setProperty('max-width', '100%', 'important');
        c.style.setProperty('margin', '0', 'important');
        c.style.setProperty('margin-left', '0', 'important');
        c.style.setProperty('padding', '0', 'important');
        c.style.setProperty('background', 'transparent', 'important');
        c.style.setProperty('box-sizing', 'border-box', 'important');
      });
      const tabs = nav.querySelector('.nav-tabs');
      if (tabs) {
        tabs.style.setProperty('width', '100%', 'important');
        tabs.style.setProperty('margin', '0', 'important');
        tabs.style.setProperty('padding', '8px 10px', 'important');
        tabs.style.setProperty('background', 'var(--surface)', 'important');
        tabs.style.setProperty('background-color', 'var(--surface)', 'important');
        tabs.style.setProperty('border', '1px solid var(--border)', 'important');
        tabs.style.setProperty('border-radius', '12px', 'important');
        tabs.style.setProperty('box-sizing', 'border-box', 'important');
      }
    });
  }
  // 培养方案等页：百分比放在主文字下方；粗细适中；0% 仅空轨道
  function restyleInfoboxPercentages() {
    const readPct = (box) => {
      let pct = NaN;
      const list = [
        box.getAttribute('data-percent'),
        box.querySelector('[data-percent]')?.getAttribute('data-percent'),
        box.querySelector('.percent')?.textContent,
        box.querySelector('.urppp-pct-text')?.textContent,
      ];
      for (const c of list) {
        if (c == null || c === '') continue;
        const n = parseFloat(String(c).replace(/[^\d.]/g, ''));
        if (!Number.isNaN(n)) { pct = n; break; }
      }
      if (Number.isNaN(pct)) {
        const m = (box.textContent || '').match(/(\d+(?:\.\d+)?)\s*%/);
        if (m) pct = parseFloat(m[1]);
      }
      if (Number.isNaN(pct)) {
        const wEl = box.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');
        if (wEl) {
          const m = String(wEl.style.width || '').match(/([\d.]+)%/);
          if (m) pct = parseFloat(m[1]);
        }
      }
      if (Number.isNaN(pct)) return null;
      return Math.max(0, Math.min(100, pct));
    };

    document.querySelectorAll('.infobox').forEach((box) => {
      const pct = readPct(box);
      if (pct == null) return;

      // 清 ACE 原生进度结构
      box.querySelectorAll('canvas').forEach((c) => c.remove());
      box.querySelectorAll('.easy-pie-chart, .percentage, .infobox-progress').forEach((el) => {
        if (el.classList.contains('urppp-pct-bar')) return;
        el.remove();
      });
      // 清旧注入，避免重复
      box.querySelectorAll('.urppp-pct-text, .urppp-pct-bar').forEach((el) => el.remove());

      // 主文字容器：进度放在主文字上面
      const data = box.querySelector('.infobox-data') || box;

      const textEl = document.createElement('div');
      textEl.className = 'urppp-pct-text';
      textEl.textContent = Math.round(pct) + '%';

      const bar = document.createElement('div');
      bar.className = 'urppp-pct-bar' + (pct <= 0 ? ' is-empty' : '');
      if (pct > 0) {
        const fill = document.createElement('span');
        fill.className = 'urppp-pct-fill';
        fill.style.width = pct + '%';
        bar.appendChild(fill);
      }

      // 插到最前：百分比 -> 进度条 -> 原主文字
      data.insertBefore(bar, data.firstChild);
      data.insertBefore(textEl, data.firstChild);
      box.dataset.urpppPctDone = '1';
    });
  }
  // 培养方案展示：zTree 安静可读版（防闪 + 分片美化 + 全开不卡）
  function beautifyPlanTree(opts) {
    const tree = document.getElementById('treeDemo');
    if (!tree) return;
    const force = !!(opts && opts.force);
    if (tree.dataset.urpppBusy === '1' && !(opts && opts.ignoreBusy)) return;

    const shell = tree.closest('div[style*="border"]') || tree.closest('#tree_div')?.parentElement || tree.parentElement;
    if (shell) shell.classList.add('urppp-plan-tree-shell');
    tree.classList.add('urppp-ztree');

    const pageWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const getZTree = () => {
      try {
        const $ = pageWin.jQuery || pageWin.$ || window.jQuery || window.$;
        return $?.fn?.zTree?.getZTreeObj?.('treeDemo') || null;
      } catch (_) {
        return null;
      }
    };
    const collapseAllDom = () => {
      // 自底向上点 open switch，避免父先收导致子 switch 找不到
      const opens = Array.from(tree.querySelectorAll('span.button.switch[class*="_open"]'))
        .filter((sw) => !/_docu\b/.test(sw.className));
      opens.reverse().forEach((sw) => {
        try { sw.click(); } catch (_) {}
      });
      return opens.length > 0;
    };
    const collapseAll = () => {
      const zTree = getZTree();
      if (zTree) {
        try { zTree.expandAll(false); } catch (_) {}
      }
      // API 失败或未完全收起时，DOM 兜底
      if (tree.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')) {
        collapseAllDom();
      }
      return true;
    };

    if (!window.__urpppExpandKzPatched) {
      window.__urpppExpandKzPatched = true;
      const patch = () => {
        const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        try { g.expandKzByRule = function () { if (!tree.dataset.urpppUserExpanded) collapseAll(); }; } catch (_) {}
      };
      patch();
      setTimeout(patch, 0);
      setTimeout(patch, 200);
    }
    if (!tree.dataset.urpppCollapsedOnce) {
      tree.dataset.urpppCollapsedOnce = '1';
      [0, 80, 200, 500, 1000].forEach((ms) => setTimeout(() => {
        if (!tree.dataset.urpppUserExpanded) collapseAll();
      }, ms));
    }

    // 标题图例只做一次
    const header = document.querySelector('#two h4.header, #two .header');
    if (header && !header.dataset.urpppLegendDone) {
      const font = header.querySelector('font');
      if (font) {
        const legend = document.createElement('div');
        legend.className = 'urppp-plan-legend';
        legend.innerHTML = [
          '<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>',
          '<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>',
          '<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>',
          '<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>',
          '<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>',
        ].join('');
        font.replaceWith(legend);
      }
      header.classList.add('urppp-plan-header');
      header.dataset.urpppLegendDone = '1';
    }

    const pauseObs = () => {
      tree.dataset.urpppBusy = '1';
      if (window.__urpppPlanTreeObs) {
        try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
      }
    };
    const resumeObs = () => {
      tree.dataset.urpppBusy = '0';
      const host = document.getElementById('tree_div') || tree;
      if (window.__urpppPlanTreeObs && host) {
        try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
      }
    };

    const formatNodeHtml = (raw) => {
      let html = raw;
      html = html.replace(/\((最低修读学分:[^)]+)\)/g, (_, body) => {
        const parts = body.split(',').map((p) => p.trim()).filter(Boolean);
        const keep = [];
        parts.forEach((p) => {
          if (/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(p)) keep.push(p);
        });
        const list = (keep.length ? keep : parts).map((p) => {
          const m = p.match(/^([^:：]+)[:：]\s*(.+)$/);
          if (!m) return p;
          const key = m[1].trim();
          const val = m[2].trim();
          let cls = 'neutral';
          if (/通过|已及格/.test(key)) cls = 'ok';
          else if (/未修读|未及格/.test(key)) cls = Number(val) > 0 ? 'warn' : 'muted';
          else if (/最低/.test(key)) cls = 'req';
          return `<span class="urppp-kv ${cls}"><em>${key}</em><b>${val}</b></span>`;
        }).join('');
        return `<span class="urppp-sub">${list}</span>`;
      });
      html = html.replace(/\[(\d{6,})\]/g, '<span class="urppp-code">$1</span>');
      html = html.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g, '<span class="urppp-meta">$1</span>');
      html = html.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g, (_, type, body) => {
        const sc = String(body).trim();
        const m = sc.match(/^(.+?)(?:\((\d{6,8})\))?$/);
        const grade = (m ? m[1] : sc).trim();
        const date = m && m[2] ? m[2] : '';
        const num = parseFloat(grade);
        let pass = false;
        if (!Number.isNaN(num)) pass = num >= 60;
        else if (/不及格|未通过|不通过/.test(grade)) pass = false;
        else if (/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(grade)) pass = true;
        else pass = true;
        const dateHtml = date ? `<i>${date}</i>` : '';
        return `<span class="urppp-score ${pass ? 'pass' : 'fail'}"><b>${type}</b><em>${grade}</em>${dateHtml}</span>`;
      });
      html = html.replace(
        /(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,
        '$1<span class="urppp-title">$2</span>'
      );
      // 课组名：图标后到 sub 前；去掉 &nbsp; 残留，避免双行撑高
      html = html.replace(
        /(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,
        '$1 <span class="urppp-gname">$2</span>'
      );
      // 若 gname 已存在仍残留纯文本，清掉
      html = html.replace(
        /(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,
        '$1 '
      );
      return html;
    };

    const markStatus = (a) => {
      const icon = a.querySelector('i.fa, i.ace-icon');
      const li = a.closest('li');
      if (!li) return;
      li.classList.remove('urppp-node-done', 'urppp-node-todo', 'urppp-node-pass', 'urppp-node-fail', 'urppp-node-pending');
      if (!icon) return;
      if (icon.classList.contains('fa-check-square-o')) li.classList.add('urppp-node-done');
      else if (icon.classList.contains('fa-smile-o')) li.classList.add('urppp-node-pass');
      else if (icon.classList.contains('fa-frown-o')) li.classList.add('urppp-node-fail');
      else if (icon.classList.contains('fa-meh-o')) li.classList.add('urppp-node-pending');
      else if (icon.classList.contains('fa-kz')) li.classList.add('urppp-node-todo');
    };

    const paintOne = (a) => {
      if (!a || (!force && a.dataset.urpppNodeDone === '1')) return false;
      markStatus(a);
      const span = a.querySelector('span.node_name') || a;
      if (!span) return false;
      if (!force && span.querySelector('.urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname')) {
        a.dataset.urpppNodeDone = '1';
      } else {
        let raw = span.dataset.urpppRaw;
        if (!raw) {
          // 已格式化过就别再当 raw
          if (span.querySelector('.urppp-score, .urppp-code, .urppp-sub')) {
            a.dataset.urpppNodeDone = '1';
            raw = null;
          } else {
            raw = span.innerHTML;
            if (raw) span.dataset.urpppRaw = raw;
          }
        }
        if (raw) {
          span.innerHTML = formatNodeHtml(raw);
          a.dataset.urpppNodeDone = '1';
        }
      }
      const sw = a.parentElement && a.parentElement.querySelector(':scope > span.button.switch');
      if (sw) {
        if (!sw.dataset.urpppSw) {
          sw.dataset.urpppSw = '1';
          if (/_docu\b/.test(sw.className)) {
            sw.classList.add('urppp-switch-leaf');
            sw.style.setProperty('display', 'none', 'important');
          }
        }
        if (/_docu\b/.test(sw.className) || sw.classList.contains('urppp-switch-leaf')) {
          a.classList.remove('urppp-expandable');
        } else {
          a.classList.add('urppp-expandable');
        }
      }
      return true;
    };

    const paintList = (list, done) => {
      const arr = Array.from(list || []);
      let i = 0;
      const step = () => {
        const end = Math.min(i + 48, arr.length);
        for (; i < end; i++) paintOne(arr[i]);
        if (i < arr.length) {
          if (window.requestIdleCallback) requestIdleCallback(step, { timeout: 120 });
          else setTimeout(step, 0);
        } else if (done) {
          done();
        }
      };
      step();
    };

    const paintScopeSync = (rootEl) => {
      const scope = rootEl || tree;
      scope.querySelectorAll('span.button.switch:not([data-urppp-sw])').forEach((sw) => {
        sw.dataset.urpppSw = '1';
        if (/_docu\b/.test(sw.className)) {
          sw.classList.add('urppp-switch-leaf');
          sw.style.setProperty('display', 'none', 'important');
        }
      });
      scope.querySelectorAll('li > a').forEach((a) => paintOne(a));
    };

    pauseObs();
    try {
      // 首次/增量：只处理未完成节点
      paintScopeSync(tree);

      // 整行点击：同步美化子节点，避免首帧闪未美化样式
      if (!tree.dataset.urpppExpandClick) {
        tree.dataset.urpppExpandClick = '1';
        tree.addEventListener('click', (e) => {
          if (e.target.closest && e.target.closest('span.button.switch')) {
            // 点小三角：同样同步美化，防闪
            const sw0 = e.target.closest('span.button.switch');
            const li0 = sw0 && sw0.parentElement;
            if (!li0 || /_docu\b/.test(sw0.className)) return;
            tree.dataset.urpppUserExpanded = '1';
            tree.dataset.urpppBusy = '1';
            if (window.__urpppPlanTreeObs) {
              try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
            }
            // 让原生先展开，再在同一事件循环末尾同步上色
            setTimeout(() => {
              paintScopeSync(li0);
              tree.dataset.urpppBusy = '0';
              const host = document.getElementById('tree_div') || tree;
              if (window.__urpppPlanTreeObs && host) {
                try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
              }
            }, 0);
            return;
          }
          const a = e.target && e.target.closest ? e.target.closest('li > a') : null;
          if (!a || !tree.contains(a)) return;
          const li = a.parentElement;
          if (!li) return;
          const sw = li.querySelector(':scope > span.button.switch');
          if (!sw || /_docu\b/.test(sw.className) || sw.classList.contains('urppp-switch-leaf')) return;
          if (!a.classList.contains('urppp-expandable') && !/_open|_close/.test(sw.className)) return;

          e.preventDefault();
          e.stopImmediatePropagation();
          tree.dataset.urpppUserExpanded = '1';
          tree.dataset.urpppBusy = '1';
          if (window.__urpppPlanTreeObs) {
            try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
          }
          sw.click();
          // 同步美化刚展开子节点（单课组量小，不卡；且无首帧闪烁）
          paintScopeSync(li);
          tree.dataset.urpppBusy = '0';
          const host = document.getElementById('tree_div') || tree;
          if (window.__urpppPlanTreeObs && host) {
            try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
          }
        }, true);
      }

      // 打开/关闭全部：接管按钮；关闭必须可靠（API + DOM 兜底）
      const bindAll = (id, expand) => {
        const btn = document.getElementById(id);
        if (!btn || btn.dataset.urpppBound === '1') return false;
        btn.dataset.urpppBound = '1';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          tree.dataset.urpppUserExpanded = '1';
          pauseObs();
          try {
            const zTree = getZTree();
            if (expand) {
              if (zTree) zTree.expandAll(true);
              else {
                tree.querySelectorAll('span.button.switch[class*="_close"]').forEach((sw) => {
                  if (!/_docu\b/.test(sw.className)) sw.click();
                });
              }
              const pending = tree.querySelectorAll('li > a:not([data-urppp-node-done="1"])');
              paintList(pending, resumeObs);
            } else {
              // 关闭：优先 API，再 DOM 兜底，确保一定收起
              if (zTree) {
                try { zTree.expandAll(false); } catch (_) {}
              }
              collapseAllDom();
              // 再保险一次，部分 zTree 版本 expandAll(false) 不完全
              setTimeout(() => {
                if (tree.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')) {
                  collapseAllDom();
                }
                resumeObs();
              }, 0);
            }
          } catch (_) {
            if (!expand) collapseAllDom();
            resumeObs();
          }
        }, true);
        return true;
      };
      // 按钮可能在 tab 切换后才出现，允许重复尝试绑定
      bindAll('expandAllBtn', true);
      bindAll('collapseAllBtn', false);
      if (!tree.dataset.urpppAllBtnsRetry) {
        tree.dataset.urpppAllBtnsRetry = '1';
        setTimeout(() => { bindAll('expandAllBtn', true); bindAll('collapseAllBtn', false); }, 300);
        setTimeout(() => { bindAll('expandAllBtn', true); bindAll('collapseAllBtn', false); }, 1000);
      }
    } finally {
      requestAnimationFrame(() => {
        requestAnimationFrame(resumeObs);
      });
    }
  }
  // 表格外框 wrapper：圆角 + 完整四边线

  // 评估公告 / 通知列表：
  // 真实结构多为 3 列 tr: 圆点 | 标题链接 | 日期（也可能单 td 多 span）

  // 本学期周课表：收束周次滑条；课程块相对父 td（拦截站点 divBuild，避免右闪）
  function fixWeekScheduleLayout() {
    try {
      const box = document.getElementById('soliderbox');
      if (box) {
        box.style.setProperty('width', '100%', 'important');
        box.style.setProperty('max-width', '720px', 'important');
        box.style.setProperty('min-width', '0', 'important');
        box.classList.remove('container');
        const row = box.closest('.profile-info-row');
        if (row) {
          row.style.setProperty('display', 'flex', 'important');
          row.style.setProperty('align-items', 'center', 'important');
          row.style.setProperty('width', '100%', 'important');
          row.style.setProperty('max-width', '100%', 'important');
        }
        const val = box.closest('.profile-info-value');
        if (val) {
          val.style.setProperty('width', 'auto', 'important');
          val.style.setProperty('max-width', '100%', 'important');
          val.style.setProperty('flex', '1 1 auto', 'important');
          val.style.setProperty('min-width', '0', 'important');
        }
      }

      const host = document.getElementById('mycoursetable');
      if (!host) return;
      host.style.setProperty('position', 'relative', 'important');
      host.style.setProperty('width', '100%', 'important');

      // 不把课程块改 static 测高（会闪）；用估算 + 已有高度
      let unitH = 72;
      host.querySelectorAll('#courseTableBody tr, table tbody tr').forEach((tr) => {
        const h = tr.offsetHeight || 0;
        if (h > unitH) unitH = h;
      });
      // 若行还没内容高度，保持 72
      if (unitH < 56) unitH = 72;

      // 先按 classNum 内容需要抬高 unitH（用 scrollHeight 但不改 position）
      host.querySelectorAll('div.class_div').forEach((div) => {
        const n = parseInt(div.getAttribute('classNum') || '1', 10) || 1;
        // 当前若已有宽度，scrollHeight 可用
        const h = div.scrollHeight || 0;
        if (h > 0) unitH = Math.max(unitH, Math.ceil(h / n));
      });
      if (unitH < 64) unitH = 72;
      if (unitH > 160) unitH = 120; // 防止异常撑爆

      host.querySelectorAll('#courseTableBody tr, table tbody tr').forEach((tr) => {
        tr.style.setProperty('height', unitH + 'px', 'important');
      });

      host.querySelectorAll('td').forEach((td) => {
        const blocks = Array.from(td.querySelectorAll(':scope > div.class_div'));
        if (!blocks.length) return;
        td.style.setProperty('position', 'relative', 'important');
        td.style.setProperty('vertical-align', 'top', 'important');
        td.style.setProperty('overflow', 'visible', 'important');

        const half = blocks.length > 1;
        const tdW = td.clientWidth || td.offsetWidth || 0;
        blocks.forEach((div, idx) => {
          const n = parseInt(div.getAttribute('classNum') || '1', 10) || 1;
          const w = half ? Math.floor(tdW / 2) : tdW;
          const left = half && idx > 0 ? w : 0;
          // 直接写最终几何，不经过「先大 left 再改回」
          div.style.setProperty('position', 'absolute', 'important');
          div.style.setProperty('top', '0px', 'important');
          div.style.setProperty('left', left + 'px', 'important');
          div.style.setProperty('right', 'auto', 'important');
          div.style.setProperty('bottom', 'auto', 'important');
          div.style.setProperty('transform', 'none', 'important');
          div.style.setProperty('width', Math.max(0, w - 2) + 'px', 'important');
          div.style.setProperty('height', (unitH * n) + 'px', 'important');
          div.style.setProperty('margin', '0', 'important');
          div.style.setProperty('box-sizing', 'border-box', 'important');
          div.style.setProperty('z-index', '2', 'important');
          div.style.setProperty('overflow', 'hidden', 'important');
        });
      });
    } catch (err) {
      console.warn('[URP++] week schedule fix failed', err);
    }
  }

  function patchSiteDivBuild() {
    try {
      const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
      if (!g || g.__urpppDivBuildPatched) return;
      // 可能尚未定义，稍后重试
      if (typeof g.divBuild !== 'function') return;
      g.__urpppDivBuildPatched = true;
      const orig = g.divBuild;
      g.divBuild = function () {
        // 站点原逻辑用整页 offset，会把课先甩到右侧再被我们纠正 → 闪烁
        // 直接走我们的相对 td 布局
        try {
          fixWeekScheduleLayout();
        } catch (e) {
          try { return orig.apply(this, arguments); } catch (_) { /* ignore */ }
        }
      };
      // jQuery resize 也会调 divBuild；保持函数名
      try { g.divBuild._urppp = true; } catch (_) { /* ignore */ }
    } catch (err) {
      console.warn('[URP++] patch divBuild failed', err);
    }
  }

  function scheduleWeekScheduleFix() {
    if (window.__urpppWeekSchedBound) return;
    window.__urpppWeekSchedBound = true;
    let busy = false;
    const run = () => {
      if (busy) return;
      if (!document.getElementById('soliderbox') && !document.getElementById('mycoursetable')) return;
      busy = true;
      try {
        patchSiteDivBuild();
        fixWeekScheduleLayout();
      } finally {
        setTimeout(() => { busy = false; }, 40);
      }
    };
    // 尽早 patch，减少首帧错位
    patchSiteDivBuild();
    ;[0, 50, 150, 400, 1000, 2000].forEach((ms) => setTimeout(() => {
      patchSiteDivBuild();
      run();
    }, ms));

    window.addEventListener('resize', () => {
      clearTimeout(window.__urpppWeekSchedResize);
      window.__urpppWeekSchedResize = setTimeout(run, 120);
    });

    // 新 class_div 一插入立刻钉到 left:0，避免先显示站点大 offset
    const pinNew = (node) => {
      if (!node) return;
      const list = [];
      if (node.nodeType === 1) {
        if (node.matches && node.matches('div.class_div')) list.push(node);
        if (node.querySelectorAll) node.querySelectorAll('div.class_div').forEach((el) => list.push(el));
      }
      list.forEach((div) => {
        const td = div.parentElement;
        if (td && td.tagName === 'TD') {
          td.style.setProperty('position', 'relative', 'important');
        }
        // 先钉在格内左上，稍后 run 再算半宽/高度
        div.style.setProperty('position', 'absolute', 'important');
        div.style.setProperty('top', '0px', 'important');
        div.style.setProperty('left', '0px', 'important');
        div.style.setProperty('right', 'auto', 'important');
        div.style.setProperty('transform', 'none', 'important');
        div.style.setProperty('width', '100%', 'important');
        div.style.setProperty('margin', '0', 'important');
        div.style.setProperty('box-sizing', 'border-box', 'important');
      });
    };

    const obs = new MutationObserver((muts) => {
      let need = false;
      muts.forEach((m) => {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            pinNew(n);
            need = true;
          });
        }
        // 站点 divBuild 会改 style left/top —— 立刻打回相对定位
        if (m.type === 'attributes' && m.attributeName === 'style' && m.target && m.target.classList && m.target.classList.contains('class_div')) {
          const div = m.target;
          const left = div.style.left || '';
          // 若 left 是很大的页坐标（如 800px+）或含异常值，立即钉回
          const px = parseFloat(left);
          if (!left || left === 'auto' || (Number.isFinite(px) && px > 200)) {
            div.style.setProperty('left', '0px', 'important');
            div.style.setProperty('top', '0px', 'important');
            div.style.setProperty('position', 'absolute', 'important');
          }
          need = true;
        }
      });
      if (!need) return;
      clearTimeout(window.__urpppWeekSchedMut);
      // 用 rAF 尽快布局，减少可见闪烁
      window.__urpppWeekSchedMut = setTimeout(() => {
        requestAnimationFrame(run);
      }, 16);
    });
    const host = document.getElementById('mycoursetable') || document.getElementById('page-content-template') || document.body;
    if (host) {
      obs.observe(host, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    document.addEventListener('mouseup', () => {
      if (!document.getElementById('soliderbox')) return;
      setTimeout(run, 200);
      setTimeout(run, 500);
    }, true);
  }

  // 学籍页培养方案抽屉：强制左树 / 右详情，每次打开都归位，禁止交错
  function beautifyCurriculumDrawer() {
    try {
      ;['curriculumInfo-divcon', 'curriculumInfo-divcon1'].forEach((id) => {
        const p = document.getElementById(id);
        if (!p) return;
        const w = parseFloat(p.style.width || '0');
        if (w >= 40) p.classList.add('urppp-curriculum-drawer');
      });

      const panel = document.getElementById('curriculumInfo-divcon2');
      if (!panel) return;
      const w = parseFloat(panel.style.width || getComputedStyle(panel).width || '0');
      if (!w || w < 40) return;
      panel.classList.add('urppp-curriculum-drawer');

      const body = panel.querySelector('.modal-body');
      if (!body) return;
      // 真实结构：.modal-body > .col-xs-12 > .row
      const host =
        body.querySelector(':scope > .col-xs-12 > .row') ||
        body.querySelector('.col-xs-12 > .row') ||
        body.querySelector('.row');
      if (!host) return;
      host.classList.add('urppp-drawer-layout');

      // 工具条
      let toolbar = host.querySelector(':scope > .urppp-drawer-toolbar, :scope > p');
      if (toolbar && toolbar.tagName === 'P') toolbar.classList.add('urppp-drawer-toolbar');

      // 确保外壳
      let bodyWrap = host.querySelector(':scope > .urppp-drawer-body');
      let left = host.querySelector('.urppp-drawer-left');
      let right = host.querySelector('.urppp-drawer-right');
      if (!bodyWrap) {
        bodyWrap = document.createElement('div');
        bodyWrap.className = 'urppp-drawer-body';
      }
      if (!left) {
        left = document.createElement('div');
        left.className = 'urppp-drawer-left';
      }
      if (!right) {
        right = document.createElement('div');
        right.className = 'urppp-drawer-right';
      }
      if (!bodyWrap.contains(left)) bodyWrap.appendChild(left);
      if (!bodyWrap.contains(right)) bodyWrap.appendChild(right);
      if (bodyWrap.parentElement !== host) {
        // 插到 toolbar 后
        if (toolbar && toolbar.parentElement === host) host.insertBefore(bodyWrap, toolbar.nextSibling);
        else host.appendChild(bodyWrap);
      }
      // toolbar 置顶
      if (toolbar && host.firstElementChild !== toolbar) host.insertBefore(toolbar, host.firstElementChild);

      // 找树列：含 #treeDemo / .ztree 的最近 col
      const treeEl = host.querySelector('#treeDemo, .ztree') || panel.querySelector('#treeDemo, .ztree');
      let treeCol = null;
      if (treeEl) {
        treeCol = treeEl.closest('.col-xs-6, .col-sm-6, .widget-box') || treeEl.parentElement;
        // 若点到 widget-box，用外层 col
        const col = treeEl.closest('.col-xs-6, .col-sm-6');
        if (col) treeCol = col;
      }

      // 详情块按 id 强制收集（最稳）
      const detailIds = ['fajh', 'xnxq', 'kz', 'kc', 'kcfa'];
      const details = detailIds
        .map((id) => document.getElementById(id))
        .filter((el) => el && panel.contains(el));

      // 左栏只保留树
      if (treeCol && treeCol.parentElement !== left) left.appendChild(treeCol);
      // 清掉左栏里误入的详情
      Array.from(left.children).forEach((child) => {
        if (detailIds.includes(child.id) || (child.id && detailIds.includes(child.id))) {
          right.appendChild(child);
        } else if (child !== treeCol && child.querySelector && !child.querySelector('#treeDemo, .ztree')) {
          // 非树节点挪到右栏（避免脏节点）
          if (child.classList && child.classList.contains('col-xs-6')) right.appendChild(child);
        }
      });

      // 右栏按固定顺序放详情，全部 100% 宽一列
      detailIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || !panel.contains(el)) return;
        if (el.parentElement !== right) right.appendChild(el);
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('max-width', '100%', 'important');
        el.style.setProperty('float', 'none', 'important');
        el.style.setProperty('margin', '0', 'important');
        el.style.setProperty('padding', '0', 'important');
        el.style.setProperty('box-sizing', 'border-box', 'important');
        if (el.style.display !== 'none') {
          const cs = getComputedStyle(el);
          if (cs.display !== 'none') el.style.setProperty('display', 'block', 'important');
        }
      });

      // 首次打开：#fajh 常异步填充，先预留右栏占位，避免“只有树再闪出详情”
      const fajh = document.getElementById('fajh');
      if (fajh && panel.contains(fajh)) {
        if (fajh.parentElement !== right) right.appendChild(fajh);
        // 若还是空壳，放一个轻量骨架，等 fillFajh 覆盖
        const empty = !fajh.innerHTML || !fajh.innerHTML.trim();
        if (empty && !fajh.querySelector('.urppp-drawer-skeleton, .profile-user-info, .widget-box')) {
          fajh.innerHTML = [
            "<div class='widget-box transparent urppp-drawer-skeleton'>",
            "  <div class='widget-header widget-header-small'>",
            "    <h4 class='widget-title smaller grey'>方案计划信息</h4>",
            "  </div>",
            "</div>",
            "<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>",
            "  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>",
            "</div>"
          ].join('');
          fajh.style.setProperty('display', 'block', 'important');
          fajh.dataset.urpppSkeleton = '1';
        }
        // 站点 fillFajh 写入后清 skeleton 标记
        if (fajh.dataset.urpppSkeleton === '1' && fajh.querySelector('.profile-info-value') && /方案名称|计划名称|年级|院系/.test(fajh.textContent || '')) {
          delete fajh.dataset.urpppSkeleton;
          fajh.querySelectorAll('.urppp-drawer-skeleton, .urppp-drawer-skeleton-card').forEach((n) => n.remove());
        }
        if (fajh.innerHTML && fajh.innerHTML.trim() && fajh.style.display === 'none') {
          // 有内容却被 none：首开闪烁场景，直接显示
          if (fajh.dataset.urpppSkeleton === '1' || fajh.querySelector('.profile-user-info')) {
            fajh.style.setProperty('display', 'block', 'important');
          }
        }
      }
      // 右栏始终占位，避免左树先独大再缩回去
      right.style.setProperty('min-height', '240px', 'important');
      left.style.setProperty('min-height', '240px', 'important');

      // 树列样式
      if (treeCol) {
        treeCol.style.setProperty('width', '100%', 'important');
        treeCol.style.setProperty('max-width', '100%', 'important');
        treeCol.style.setProperty('float', 'none', 'important');
        treeCol.style.setProperty('margin', '0', 'important');
        treeCol.style.setProperty('padding', '0', 'important');
        treeCol.style.setProperty('border', 'none', 'important');
        treeCol.style.setProperty('box-sizing', 'border-box', 'important');
      }
      const treeBox = left.querySelector('.widget-box');
      if (treeBox) {
        treeBox.style.setProperty('width', '100%', 'important');
        treeBox.style.setProperty('margin', '0', 'important');
        treeBox.style.setProperty('border', '1px solid var(--border)', 'important');
        treeBox.style.setProperty('border-radius', '12px', 'important');
        treeBox.style.setProperty('overflow', 'hidden', 'important');
        treeBox.style.setProperty('background', 'var(--surface)', 'important');
      }

      // 信息卡
      panel.querySelectorAll('.profile-info-row').forEach((r) => {
        r.classList.remove('urppp-query-row', 'urppp-dual-pair');
        r.style.setProperty('display', 'grid', 'important');
        r.style.setProperty('grid-template-columns', '112px minmax(0,1fr)', 'important');
        r.style.setProperty('width', '100%', 'important');
        Array.from(r.children).forEach((el) => {
          if (!el.classList) return;
          el.style.setProperty('float', 'none', 'important');
          el.style.setProperty('margin-left', '0', 'important');
          el.style.setProperty('width', 'auto', 'important');
          el.style.setProperty('max-width', 'none', 'important');
        });
      });
      panel.querySelectorAll('.profile-user-info, .profile-user-info-striped').forEach((card) => {
        card.classList.remove('urppp-query-form');
        card.style.setProperty('border-radius', '12px', 'important');
        card.style.setProperty('overflow', 'hidden', 'important');
        card.style.setProperty('width', '100%', 'important');
        card.style.setProperty('max-width', '100%', 'important');
        card.style.setProperty('display', 'block', 'important');
        card.style.setProperty('box-sizing', 'border-box', 'important');
      });
    } catch (err) {
      console.warn('[URP++] curriculum drawer beautify failed', err);
    }
  }
  function scheduleCurriculumDrawerBeautify() {
    if (window.__urpppCurriculumDrawerBound) return;
    window.__urpppCurriculumDrawerBound = true;
    const run = () => beautifyCurriculumDrawer();
    ;[0, 50, 150, 350, 800, 1600].forEach((ms) => setTimeout(run, ms));
    const obs = new MutationObserver((muts) => {
      // 面板宽度变化或 fajh 内容写入时立刻归位
      const hot = muts.some((m) => {
        if (m.type === 'childList') return true;
        if (m.type === 'attributes' && m.target && (m.target.id === 'curriculumInfo-divcon2' || m.target.id === 'fajh')) return true;
        return false;
      });
      if (!hot) return;
      clearTimeout(window.__urpppCurriculumDrawerTimer);
      window.__urpppCurriculumDrawerTimer = setTimeout(() => requestAnimationFrame(run), 16);
    });
    ['curriculumInfo-divcon', 'curriculumInfo-divcon1', 'curriculumInfo-divcon2'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    });
    // 点击“培养方案/与我相关”后尽快布局，减少首开只见树
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('a,button,span,div') : null;
      const txt = ((t && t.textContent) || '').replace(/\s+/g, '');
      if (/培养方案|与我相关|方案计划|自动化培养/.test(txt) || (t && t.closest && t.closest('#curriculumInfo-divcon2'))) {
        setTimeout(run, 0);
        setTimeout(run, 50);
        setTimeout(run, 150);
        setTimeout(run, 400);
      } else {
        setTimeout(run, 200);
      }
    }, true);
  }
  // 撤销误套在业务表上的公告样式（如空闲教室）

  function scrubNoticeInlineBg(root) {
    try {
      const scope = root || document;
      scope.querySelectorAll('table.urppp-notice-table tr, table.urppp-notice-table td, table.urppp-notice-table th').forEach((el) => {
        if (!el || !el.style) return;
        // ACE/jQuery hover 会写回 #fff；清掉后交给 CSS 主题色
        const bg = (el.style.backgroundColor || el.style.background || '').toLowerCase();
        if (!bg) return;
        if (/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)|#fff|#ffffff|white/.test(bg) || bg.includes('f5f5f5') || bg.includes('f9f9f9')) {
          el.style.removeProperty('background');
          el.style.removeProperty('background-color');
        }
      });
    } catch (_) {}
  }

  function bindNoticeHoverScrub() {
    if (window.__urpppNoticeHoverScrub) return;
    window.__urpppNoticeHoverScrub = true;
    const wipe = (e) => {
      const tr = e.target && e.target.closest ? e.target.closest('table.urppp-notice-table tr') : null;
      if (!tr) return;
      // 下一帧清，等 ACE mouseleave 写完再抹
      requestAnimationFrame(() => {
        scrubNoticeInlineBg(tr);
        tr.classList.remove('hover');
        tr.querySelectorAll('td,th').forEach((cell) => {
          if (!cell.style) return;
          cell.style.removeProperty('background');
          cell.style.removeProperty('background-color');
        });
        tr.style.removeProperty('background');
        tr.style.removeProperty('background-color');
      });
    };
    document.addEventListener('mouseout', wipe, true);
    document.addEventListener('mouseleave', wipe, true);
    // 保险：悬停过程中若被写成白，也立刻清
    document.addEventListener('mouseover', (e) => {
      const tr = e.target && e.target.closest ? e.target.closest('table.urppp-notice-table tr') : null;
      if (!tr) return;
      scrubNoticeInlineBg(tr);
    }, true);
  }
  function stripMistakenNoticeTable(table) {
    if (!table) return;
    table.classList.remove('urppp-notice-table');
    delete table.dataset.urpppNoticeScan;
    table.style.removeProperty('border');
    table.style.removeProperty('border-left');
    table.style.removeProperty('background');
    const wrap = table.closest('.urppp-table-wrap.urppp-notice-wrap');
    if (wrap) {
      wrap.classList.remove('urppp-notice-wrap');
      wrap.style.removeProperty('border');
      wrap.style.removeProperty('background');
      wrap.style.removeProperty('box-shadow');
      wrap.style.removeProperty('overflow');
      wrap.style.removeProperty('border-radius');
    }
    table.querySelectorAll('tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card').forEach((el) => {
      el.classList.remove(
        'urppp-notice-row',
        'urppp-notice-title-cell',
        'urppp-notice-date-cell',
        'urppp-notice-bullet-cell',
        'urppp-notice-link',
        'urppp-notice-time',
        'urppp-notice-card',
        'urppp-notice-card-row',
        'urppp-notice-main',
        'urppp-notice-meta',
        'urppp-notice-title',
        'urppp-notice-body'
      );
      if (el.tagName === 'TR' || el.tagName === 'TD') {
        ['display', 'border', 'background', 'padding', 'margin', 'width', 'box-shadow', 'border-radius', 'float', 'position'].forEach((p) => {
          if (el.style.getPropertyPriority(p) === 'important') el.style.removeProperty(p);
        });
      }
      delete el.dataset.urpppNoticeDone;
    });
  }

  function isBusinessDataTable(table) {
    if (!table) return true;
    const id = (table.id || '') + ' ' + ((table.getAttribute('class') || ''));
    if (/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(id)) return true;
    if (table.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]')) return true;
    // 多列表格（>=5 列）几乎一定是业务表
    const sample = table.querySelector('tbody tr, tr');
    if (sample && sample.querySelectorAll('td,th').length >= 5) return true;
    const headText = ((table.querySelector('thead') && table.querySelector('thead').textContent) || (table.querySelector('tr') && table.querySelector('tr').textContent) || '').replace(/\s+/g, '');
    if (/校区|教学楼|教室|座位数|类型|课表|操作|序号|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(headText)) return true;
    // 行内有“课表/教室信息”操作链接
    if (table.querySelector('a') && /课表|教室信息|查看|评估/.test(table.textContent || '')) {
      if (!/评估公告|通知公告|公告/.test(document.title || '') && !/公告/.test((document.querySelector('h4.header, .breadcrumb') || {}).textContent || '')) {
        // 空闲教室等
        if (/座位数|教学楼|教室号|校区名/.test(table.textContent || '')) return true;
      }
    }
    return false;
  }

  function beautifyNoticeTables() {
    try {
      bindNoticeHoverScrub();
      scrubNoticeInlineBg();
      // 先清理误伤业务表
      document.querySelectorAll('table.urppp-notice-table, table.table').forEach((table) => {
        if (isBusinessDataTable(table) && (table.classList.contains('urppp-notice-table') || table.querySelector('.urppp-notice-row, .urppp-notice-title-cell'))) {
          stripMistakenNoticeTable(table);
        }
      });

      const tables = document.querySelectorAll(
        '.page-content table.table, #page-content-template table.table, .page-content table'
      );
      tables.forEach((table) => {
        if (!table) return;
        if (isBusinessDataTable(table)) return;
        if (table.dataset.urpppNoticeScan === '1' && table.classList.contains('urppp-notice-table')) {
          // 已确认公告表，可增量处理未完成行
        }

        // 跳过真正业务数据表（有 thead 多列表头）
        if (table.querySelector('thead th') && table.querySelectorAll('thead th').length >= 3) {
          const thText = (table.querySelector('thead')?.textContent || '');
          if (/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(thText)) return;
        }
        const rows = Array.from(table.querySelectorAll('tbody > tr, tr')).filter((tr) => tr.querySelector('td'));
        if (!rows.length) return;

        // 判定是否公告列表（更严格）
        let noticeLike = 0;
        rows.slice(0, 8).forEach((tr) => {
          const tds = Array.from(tr.children).filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
          if (tds.length >= 5) return; // 多列业务行
          const text = (tr.textContent || '').replace(/\s+/g, ' ').trim();
          const hasLink = !!tr.querySelector('a[href]');
          const hasDate = /\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(text);
          const hasBullet = tds.some((td) => {
            const t = (td.textContent || '').trim();
            return t === '•' || t === '·' || t === '●' || t === '○' || t === '▪' || t.length <= 2 && /[•·●○▪◆★]/.test(t);
          });
          // 必须像公告：链接+日期，或圆点+链接；不再用“多列+短日期”这种宽松条件
          if ((hasLink && hasDate) || (hasBullet && hasLink)) {
            noticeLike += 1;
          }
        });
        const looksDashedNotice =
          table.classList.contains('no-border-top') ||
          /dashed|border-left-style/.test(table.getAttribute('style') || '');
        // 公告页上下文
        const pageHint = ((document.title || '') + ' ' + ((document.querySelector('h4.header, .breadcrumb, .page-content') || {}).textContent || '')).slice(0, 200);
        const inNoticePage = /公告|通知/.test(pageHint);
        if (noticeLike < 1 && !(looksDashedNotice && inNoticePage)) {
          return;
        }
        if (isBusinessDataTable(table)) return;
        table.classList.add('urppp-notice-table');
        table.dataset.urpppNoticeScan = '1';
        table.style.setProperty('border', 'none', 'important');
        table.style.setProperty('border-left', 'none', 'important');
        table.style.setProperty('background', 'transparent', 'important');
        table.style.setProperty('width', '100%', 'important');

        const wrap = table.closest('.urppp-table-wrap');
        if (wrap) {
          wrap.classList.add('urppp-notice-wrap');
          wrap.style.setProperty('border', 'none', 'important');
          wrap.style.setProperty('background', 'transparent', 'important');
          wrap.style.setProperty('box-shadow', 'none', 'important');
          wrap.style.setProperty('overflow', 'visible', 'important');
          wrap.style.setProperty('border-radius', '0', 'important');
        }

        rows.forEach((tr) => {
          if (tr.dataset.urpppNoticeDone === '1') return;
          const tds = Array.from(tr.children).filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
          if (!tds.length) return;

          const clean = (s) => (s || '')
            .replace(/\u00AD/g, '')
            .replace(/\u200B/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          // ---- 形态 A：多列（圆点 / 标题 / 日期）----
          if (tds.length >= 2) {
            let bulletTd = null;
            let titleTd = null;
            let dateTd = null;

            tds.forEach((td, i) => {
              const t = clean(td.textContent);
              const hasA = !!td.querySelector('a');
              if (!bulletTd && (t === '•' || t === '·' || t === '●' || t === '○' || t === '▪' || (/^[•·●○▪◆★]$/.test(t)))) {
                bulletTd = td;
                return;
              }
              if (!dateTd && (/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(t) || /text-align\s*:\s*right/i.test(td.getAttribute('style') || '') || i === tds.length - 1 && t.length <= 20 && /\d{4}/.test(t))) {
                // 最后一列短文本且像日期
                if (/\d{4}/.test(t) && t.length <= 24) {
                  dateTd = td;
                  return;
                }
              }
              if (!titleTd && (hasA || t.length > 4)) {
                titleTd = td;
              }
            });
            if (!titleTd) titleTd = tds.find((td) => td !== bulletTd && td !== dateTd) || tds[0];
            if (!dateTd && tds.length >= 2) {
              const last = tds[tds.length - 1];
              if (last !== titleTd && last !== bulletTd) dateTd = last;
            }

            tr.classList.add('urppp-notice-row');
            tds.forEach((td) => {
              td.style.setProperty('border', 'none', 'important');
              td.style.setProperty('background', 'transparent', 'important');
              td.style.setProperty('vertical-align', 'middle', 'important');
            });

            // 隐藏原始 bullet 列，改用 CSS ::before
            if (bulletTd) {
              bulletTd.classList.add('urppp-notice-bullet-cell');
              bulletTd.style.setProperty('display', 'none', 'important');
              bulletTd.style.setProperty('width', '0', 'important');
              bulletTd.style.setProperty('padding', '0', 'important');
            }
            if (titleTd) {
              titleTd.classList.add('urppp-notice-title-cell');
              titleTd.style.setProperty('width', 'auto', 'important');
              titleTd.style.setProperty('padding', '0', 'important');
              titleTd.style.setProperty('pointer-events', 'auto', 'important');
              // 链接可能不在 titleTd 内（误分类时），整行找
              let a = titleTd.querySelector('a[href], a[onclick], a');
              if (!a) a = tr.querySelector('a[href], a[onclick], a');
              if (a) {
                // 若链接不在标题格，挪进标题格，避免点不到
                if (!titleTd.contains(a)) {
                  titleTd.innerHTML = '';
                  titleTd.appendChild(a);
                }
                a.classList.add('urppp-notice-link');
                // 只清文本节点，保留 href/onclick/target
                const href = a.getAttribute('href');
                const onclick = a.getAttribute('onclick');
                const target = a.getAttribute('target');
                const label = clean(a.textContent);
                a.textContent = label;
                if (href != null) a.setAttribute('href', href);
                if (onclick != null) a.setAttribute('onclick', onclick);
                if (target != null) a.setAttribute('target', target);
                a.style.setProperty('color', 'var(--text)', 'important');
                a.style.setProperty('text-decoration', 'none', 'important');
                a.style.setProperty('font-size', '14px', 'important');
                a.style.setProperty('font-weight', '500', 'important');
                a.style.setProperty('line-height', '1.5', 'important');
                a.style.setProperty('pointer-events', 'auto', 'important');
                a.style.setProperty('cursor', 'pointer', 'important');
                a.style.setProperty('position', 'relative', 'important');
                a.style.setProperty('z-index', '2', 'important');
                a.style.setProperty('display', 'inline', 'important');
                // 整行可点：点卡片任意处触发链接
                if (tr.dataset.urpppNoticeClickBound !== '1') {
                  tr.dataset.urpppNoticeClickBound = '1';
                  tr.style.setProperty('cursor', 'pointer', 'important');
                  tr.addEventListener('click', (e) => {
                    if (e.target && e.target.closest && e.target.closest('a,button,input,select,textarea,label')) return;
                    // 优先原生跳转
                    if (a.getAttribute('onclick')) {
                      a.click();
                      return;
                    }
                    const h = a.getAttribute('href');
                    if (!h || h === '#' || h.indexOf('javascript:') === 0) {
                      a.click();
                      return;
                    }
                    if (a.target === '_blank') window.open(h, '_blank');
                    else window.location.href = h;
                  });
                }
              } else {
                // 无 a 时保留原 td 内容与事件，只做文本清理
                const rawHtml = titleTd.innerHTML;
                const onlyText = clean(titleTd.textContent);
                if (onlyText && !titleTd.querySelector('button, input, select')) {
                  // 若原本只有文字，保留文字；若有复杂结构不动
                  if (!titleTd.querySelector('*') || titleTd.children.length === 0) {
                    titleTd.textContent = onlyText;
                  }
                }
                void rawHtml;
              }
            }
            if (dateTd) {
              dateTd.classList.add('urppp-notice-date-cell');
              dateTd.style.cssText = [
                'display:flex !important',
                'align-items:center !important',
                'justify-content:flex-end !important',
                'flex:0 0 auto !important',
                'width:auto !important',
                'max-width:none !important',
                'white-space:nowrap !important',
                'text-align:right !important',
                'padding:0 !important',
                'margin:0 0 0 auto !important',
                'border:none !important',
                'background:transparent !important',
                'float:none !important',
                'position:static !important',
                'right:auto !important',
                'left:auto !important',
                'top:auto !important'
              ].join(';');
              const dateText = clean(dateTd.textContent);
              dateTd.innerHTML = '';
              const badge = document.createElement('span');
              badge.className = 'urppp-notice-time';
              badge.textContent = dateText;
              dateTd.appendChild(badge);
            }
            // 标题列吃满剩余空间，日期贴卡内右侧
            if (titleTd) {
              titleTd.style.setProperty('flex', '1 1 auto', 'important');
              titleTd.style.setProperty('min-width', '0', 'important');
              titleTd.style.setProperty('margin', '0', 'important');
              titleTd.style.setProperty('float', 'none', 'important');
              titleTd.style.setProperty('position', 'static', 'important');
            }
            tr.style.setProperty('display', 'flex', 'important');
            tr.style.setProperty('align-items', 'center', 'important');
            tr.style.setProperty('justify-content', 'space-between', 'important');
            tr.style.setProperty('gap', '16px', 'important');
            tr.style.setProperty('max-width', '100%', 'important');
            tr.style.setProperty('box-sizing', 'border-box', 'important');
            tr.style.setProperty('overflow', 'hidden', 'important');
            tr.dataset.urpppNoticeDone = '1';
            return;
          }

          // ---- 形态 B：单 td 内多层 span（旧逻辑）----
          const td = tds[0];
          const parts = Array.from(td.querySelectorAll(':scope > span'));
          if (parts.length < 2) {
            // 单格但有 a + 日期文本
            const a = td.querySelector('a');
            const full = clean(td.textContent);
            const dateMatch = full.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);
            if (a || dateMatch) {
              tr.classList.add('urppp-notice-row');
              const card = document.createElement('div');
              card.className = 'urppp-notice-card urppp-notice-card-row';
              const left = document.createElement('div');
              left.className = 'urppp-notice-main';
              if (a) {
                // 移动原节点，保留事件与属性，避免 clone 丢监听
                const link = a;
                link.classList.add('urppp-notice-link');
                const href = link.getAttribute('href');
                const onclick = link.getAttribute('onclick');
                const label = clean(link.textContent);
                link.textContent = label;
                if (href != null) link.setAttribute('href', href);
                if (onclick != null) link.setAttribute('onclick', onclick);
                link.style.setProperty('pointer-events', 'auto', 'important');
                link.style.setProperty('cursor', 'pointer', 'important');
                left.appendChild(link);
                if (tr.dataset.urpppNoticeClickBound !== '1') {
                  tr.dataset.urpppNoticeClickBound = '1';
                  tr.style.setProperty('cursor', 'pointer', 'important');
                  tr.addEventListener('click', (e) => {
                    if (e.target && e.target.closest && e.target.closest('a,button,input,select')) return;
                    if (link.getAttribute('onclick') || !link.getAttribute('href') || link.getAttribute('href') === '#') {
                      link.click();
                      return;
                    }
                    window.location.href = link.getAttribute('href');
                  });
                }
              } else {
                const title = document.createElement('div');
                title.className = 'urppp-notice-title';
                title.textContent = dateMatch ? full.replace(dateMatch[0], '').trim() : full;
                left.appendChild(title);
              }
              card.appendChild(left);
              if (dateMatch) {
                const meta = document.createElement('div');
                meta.className = 'urppp-notice-meta';
                const tEl = document.createElement('span');
                tEl.className = 'urppp-notice-time';
                tEl.textContent = dateMatch[1];
                meta.appendChild(tEl);
                card.appendChild(meta);
              }
              td.innerHTML = '';
              td.appendChild(card);
              td.dataset.urpppNoticeDone = '1';
              tr.dataset.urpppNoticeDone = '1';
            }
            return;
          }

          // multi-span body notice
          let titleEl = null;
          let timeEl = null;
          const bodyEls = [];
          parts.forEach((sp) => {
            const st = (sp.getAttribute('style') || '') + ' ' + (sp.style.cssText || '');
            const txt = clean(sp.textContent);
            if (!txt) return;
            if (/font-size\s*:\s*18/i.test(st) || (!titleEl && /font-size\s*:\s*1[6-9]/i.test(st))) {
              titleEl = sp; return;
            }
            if (/font-size\s*:\s*12/i.test(st) || /float\s*:\s*right/i.test(st) || /^\d{4}-\d{2}-\d{2}/.test(txt)) {
              timeEl = sp; return;
            }
            bodyEls.push(sp);
          });
          if (!titleEl) titleEl = parts[0];
          if (!timeEl) {
            const last = parts[parts.length - 1];
            if (last !== titleEl) timeEl = last;
          }
          const card = document.createElement('div');
          card.className = 'urppp-notice-card';
          if (titleEl) {
            const h = document.createElement('div');
            h.className = 'urppp-notice-title';
            h.textContent = clean(titleEl.textContent);
            card.appendChild(h);
          }
          (bodyEls.length ? bodyEls : parts.filter((sp) => sp !== titleEl && sp !== timeEl)).forEach((b) => {
            const p = document.createElement('div');
            p.className = 'urppp-notice-body';
            p.textContent = clean(b.textContent);
            if (p.textContent) card.appendChild(p);
          });
          if (timeEl) {
            const meta = document.createElement('div');
            meta.className = 'urppp-notice-meta';
            const tEl = document.createElement('span');
            tEl.className = 'urppp-notice-time';
            tEl.textContent = clean(timeEl.textContent);
            meta.appendChild(tEl);
            card.appendChild(meta);
          }
          td.innerHTML = '';
          td.appendChild(card);
          td.dataset.urpppNoticeDone = '1';
          tr.dataset.urpppNoticeDone = '1';
          tr.classList.add('urppp-notice-row');
        });
      });
    } catch (err) {
      console.warn('[URP++] notice table beautify failed', err);
    }
  }
  function wrapTables() {
    document.querySelectorAll('table.table, table.table-bordered, table.dataTable').forEach((table) => {
      if (!table || table.closest('.urppp-table-wrap')) return;
      if (table.id === 'courseTable') return;
      if (table.closest('.modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal')) return;
      if (table.classList.contains('urppp-wrs-table')) return;
      if (table.classList.contains('urppp-notice-table')) return;
      if (isBusinessDataTable(table)) { /* keep wrap for business tables */ }
      const parent = table.parentElement;
      if (!parent) return;
      const parentOverflow = (parent.style && parent.style.overflow) || getComputedStyle(parent).overflow;
      const isScrollBox = (parent.id && parent.id.endsWith('_scroll')) || parentOverflow === 'auto' || parentOverflow === 'scroll';
      if (isScrollBox) {
        parent.classList.add('urppp-table-wrap');
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'urppp-table-wrap';
      parent.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  // 清理被错误强制显示的空白 modal（无 .in/.show 却 display:block）
  function cleanupStuckModals() {
    try {
      // 只做一次、且尽量克制：
      // 1) 清掉我们曾写在 .modal 上的 display:!important
      // 2) 无打开 modal 时清残留 backdrop
      // 不要改抽屉 width/right，否则会把正在打开的侧栏打回 0
      document.querySelectorAll('.modal').forEach((m) => {
        if (m.style && m.style.getPropertyPriority('display') === 'important') {
          m.style.removeProperty('display');
        }
      });
      const anyOpen = !!document.querySelector('.modal.in, .modal.show');
      if (!anyOpen) {
        document.querySelectorAll('body > .modal-backdrop').forEach((b) => {
          if (b.parentElement) b.parentElement.removeChild(b);
        });
        if (document.body.classList.contains('modal-open') && !document.querySelector('.modal.in, .modal.show')) {
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
        }
      }
    } catch (_) { /* ignore */ }
  }
  function patchModalOpenPath() {
    if (window.__urpppModalOpenPatched) return;
    window.__urpppModalOpenPatched = true;
    const unlock = (el) => {
      if (!el || !el.style) return;
      if (el.style.getPropertyPriority('display') === 'important') el.style.removeProperty('display');
      if (el.style.getPropertyPriority('opacity') === 'important') el.style.removeProperty('opacity');
      if (el.style.getPropertyPriority('pointer-events') === 'important') el.style.removeProperty('pointer-events');
      if (el.style.getPropertyPriority('visibility') === 'important') el.style.removeProperty('visibility');
    };
    document.addEventListener('show.bs.modal', (e) => {
      const m = e.target;
      if (!m || !m.classList || !m.classList.contains('modal')) return;
      unlock(m);
      // 让 Bootstrap 自己设 display，不要抢写
    }, true);
    // 侧栏抽屉打开：站点 animate width，清理我们可能写过的锁
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('a,button,td,span,div,i') : null;
      if (!t) return;
      // 解锁所有侧栏/modal，避免历史 !important 残留
      ;['curriculumInfo-divcon', 'curriculumInfo-divcon1', 'curriculumInfo-divcon2', 'calssInfo-divcon', 'classroomInfo-divcon'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        unlock(el);
        // 清掉我们可能写过的 opacity/pointer-events 普通属性
        if (el.style.opacity === '0') el.style.removeProperty('opacity');
        if (el.style.pointerEvents === 'none') el.style.removeProperty('pointer-events');
      });
      document.querySelectorAll('.modal').forEach((m) => unlock(m));
      const sel = t.getAttribute && (t.getAttribute('data-target') || t.getAttribute('href') || '');
      if (sel && sel.charAt(0) === '#') {
        const m = document.querySelector(sel);
        if (m) unlock(m);
      }
    }, true);
  }
  function beautifyInternal() {
    // body 晚于首屏 applyTheme 时补挂暗色 class
    try {
      const n = getCurrent();
      document.documentElement.dataset.urpppTheme = n;
      document.documentElement.classList.remove('urppp-theme-default', 'urppp-theme-dark', 'urppp-theme-scu-red');
      document.documentElement.classList.add('urppp-theme-' + n);
      if (document.body) {
        document.body.dataset.urpppTheme = n;
        document.body.classList.toggle('urppp-dark', n === 'dark');
      }
    } catch (_) {}
    let styleEl = document.getElementById('urppp-internal-style');
    const styleExists = !!styleEl;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'urppp-internal-style';
      document.head.appendChild(styleEl);
    }
    {
      const style = styleEl;
      style.textContent = `
      /* 全局 */
      html, body { background: var(--bg) !important; color: var(--text) !important; }
      a, a:link, a:visited { color: var(--primary) !important; }
      a:hover, a:focus { color: var(--primary-hover) !important; }
      h1, h2, h3, h4, h5, h6, .page-header { color: var(--text) !important; border-color: var(--border) !important; }
      hr { border-color: var(--border) !important; }
      .text-muted, .muted, .help-block { color: var(--text-muted) !important; }

      /* 顶栏 —— 基于真实 DOM */
      .navbar.navbar-default,
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-default {
        background: var(--surface) !important;
        border: none !important;
        box-shadow: var(--shadow) !important;
        min-height: 45px !important;
        z-index: 1100 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }
      .navbar.navbar-default .navbar-brand,
      .navbar-default .navbar-brand {
        color: var(--text) !important;
        text-shadow: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        height: 45px !important;
        line-height: 45px !important;
        vertical-align: middle !important;
      }
      .navbar-header {
        display: flex !important;
        align-items: center !important;
        min-height: 45px !important;
      }
      /* 顶栏主题色切换 */
      #urppp-nav-theme {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        margin-left: 12px !important;
        height: 100% !important;
        min-height: 36px !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0 !important;
        transform: none !important;
        z-index: 20 !important;
        line-height: 1 !important;
      }
      #urppp-nav-theme .urppp-nav-dot {
        width: 16px !important;
        height: 16px !important;
        border-radius: 50% !important;
        border: 2px solid var(--border) !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 16px !important;
        box-shadow: 0 0 0 0 transparent !important;
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease !important;
        background-clip: padding-box !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0 !important;
      }
      #urppp-nav-theme .urppp-nav-dot:hover {
        transform: scale(1.08) !important;
        border-color: var(--text-muted) !important;
      }
      #urppp-nav-theme .urppp-nav-dot.ac {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      #urppp-nav-theme .urppp-nav-edit {
        width: 20px !important;
        height: 20px !important;
        border-radius: 0 !important;
        border: none !important;
        background: transparent !important;
        background-color: transparent !important;
        color: var(--text-secondary) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        font-size: 13px !important;
        line-height: 1 !important;
        padding: 0 !important;
        margin: 0 0 0 2px !important;
        box-shadow: none !important;
        transition: color .15s ease, transform .15s ease !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0 !important;
      }
      #urppp-nav-theme .urppp-nav-edit:hover {
        border: none !important;
        color: var(--primary) !important;
        background: transparent !important;
        background-color: transparent !important;
        transform: scale(1.08) !important;
      }
      #urppp-nav-theme .urppp-nav-edit:active,
      #urppp-nav-theme .urppp-nav-edit:focus {
        background: transparent !important;
        box-shadow: none !important;
        outline: none !important;
      }
      #urppp-nav-theme-pop {
        position: absolute !important;
        top: calc(100% + 10px) !important;
        left: 0 !important;
        min-width: 220px !important;
        padding: 12px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 12px 32px rgba(15,23,42,0.14) !important;
        z-index: 1200 !important;
        display: none !important;
        box-sizing: border-box !important;
      }
      #urppp-nav-theme-pop.open {
        display: block !important;
      }
      #urppp-nav-theme-pop .urppp-pop-title {
        font-size: 12px !important;
        font-weight: 600 !important;
        color: var(--text-secondary) !important;
        margin: 0 0 8px !important;
      }
      #urppp-nav-theme-pop .urppp-pop-row {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin: 0 0 10px !important;
      }
      #urppp-nav-theme-pop input[type="color"] {
        width: 36px !important;
        height: 28px !important;
        padding: 0 !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        background: var(--input-bg) !important;
        cursor: pointer !important;
      }
      #urppp-nav-theme-pop input[type="text"] {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        height: 28px !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        background: var(--input-bg) !important;
        color: var(--text) !important;
        padding: 0 8px !important;
        font-size: 12px !important;
        box-sizing: border-box !important;
      }
      #urppp-nav-theme-pop .urppp-pop-actions {
        display: flex !important;
        gap: 6px !important;
        margin: 0 0 10px !important;
      }
      #urppp-nav-theme-pop .urppp-pop-btn {
        height: 28px !important;
        padding: 0 10px !important;
        border-radius: 8px !important;
        border: 1px solid var(--border) !important;
        background: var(--input-bg) !important;
        color: var(--text) !important;
        font-size: 12px !important;
        cursor: pointer !important;
        line-height: 28px !important;
      }
      #urppp-nav-theme-pop .urppp-pop-btn.primary {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      #urppp-nav-theme-pop .urppp-pop-presets {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
      }
      #urppp-nav-theme-pop .urppp-pop-preset {
        width: 22px !important;
        height: 22px !important;
        border-radius: 50% !important;
        border: 2px solid var(--border) !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      #urppp-nav-theme-pop .urppp-pop-preset:hover {
        border-color: var(--primary) !important;
      }
      #urppp-nav-theme-pop .urppp-pop-preset .x {
        position: absolute !important;
        top: -6px !important;
        right: -6px !important;
        width: 14px !important;
        height: 14px !important;
        border-radius: 50% !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text-muted) !important;
        font-size: 10px !important;
        line-height: 12px !important;
        text-align: center !important;
        display: none !important;
      }
      #urppp-nav-theme-pop .urppp-pop-preset:hover .x {
        display: block !important;
      }

      /* 导航项 */
      .ace-nav { margin: 0 !important; }
      .ace-nav > li {
        text-align: left !important;
        vertical-align: middle !important;
        background: transparent !important;
        border: none !important;
      }
      .ace-nav > li > a {
        background: transparent !important;
        color: var(--text-secondary) !important;
        border-radius: var(--radius-sm) !important;
        padding: 7px 10px !important;
        line-height: 1.4 !important;
        height: auto !important;
        display: inline-flex !important;
        align-items: center;
        gap: 5px;
        white-space: nowrap !important;
        transition: background .15s;
      }
      .ace-nav > li > a:hover,
      .ace-nav > li.open > a {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        box-shadow: none !important;
      }

      /* 覆盖 ACE 颜色类 */
      #navbar .ace-nav > li.green > a,
      #navbar .ace-nav > li.grey > a,
      #navbar .ace-nav > li.light-red > a,
      #navbar .ace-nav > li.light-blue > a,
      #navbar .ace-nav > li.green.open > a,
      #navbar .ace-nav > li.grey.open > a,
      #navbar .ace-nav > li.light-red.open > a,
      #navbar .ace-nav > li.light-blue.open > a {
        background: transparent !important;
        color: var(--text-secondary) !important;
      }
      #navbar .ace-nav > li.green > a:hover,
      #navbar .ace-nav > li.grey > a:hover,
      #navbar .ace-nav > li.light-red > a:hover,
      #navbar .ace-nav > li.light-blue > a:hover {
        background: var(--input-bg) !important;
        color: var(--text) !important;
      }

      /* 图标统一颜色 */
      #navbar .ace-nav > li > a > .ace-icon,
      #navbar .ace-nav > li > a > .glyphicon {
        color: var(--text-secondary) !important;
        font-size: 15px;
        transition: color .15s;
      }
      #navbar .ace-nav > li > a:hover > .ace-icon,
      #navbar .ace-nav > li > a:hover > .glyphicon,
      #navbar .ace-nav > li.open > a > .ace-icon,
      #navbar .ace-nav > li.open > a > .glyphicon { color: var(--text) !important; }

      /* 强制所有顶栏项对齐 */
      #navbar .ace-nav > li {
        display: inline-block !important;
        vertical-align: middle !important;
        text-align: left !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #navbar .ace-nav > li > a {
        display: inline-flex !important;
        align-items: center !important;
        height: 36px !important;
        padding: 0 4px !important;
        flex-wrap: nowrap !important;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li > a > .ace-icon,
      #navbar .ace-nav > li > a > .glyphicon,
      #navbar .ace-nav > li > a > .fa {
        top: auto !important;
        vertical-align: middle !important;
        line-height: 1 !important;
        margin-top: 0 !important;
      }

      /* 限制搜索容器宽度 */
      #navbar #intellegenceUDiv {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 36px !important;
        vertical-align: middle !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* 搜索按钮向右微调，靠近客服 */
      #navbar #intellegenceUDiv #clickdiv {
        transform: translateX(42px) !important;
      }
      #intellegenceUDiv > .nav-search { position: absolute !important; right: 34px !important; top: 50% !important; transform: translateY(-50%) !important; }

      /* 用户项：头像和文字一行 */
      #navbar .ace-nav > li.light-blue > a {
        display: inline-flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 6px !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info {
        margin-top: -12px !important;
      }
      #navbar .ace-nav > li.light-blue > a .nav-user-photo {
        margin-right: 6px;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px;
        max-width: none !important;
        white-space: nowrap !important;
        color: var(--text-secondary) !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info * {
        display: inline !important;
        white-space: nowrap !important;
        color: inherit !important;
        vertical-align: middle !important;
        line-height: 1 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info small { color: var(--text-muted) !important; font-size: inherit !important; }

      /* 头像：中间截取矩形再裁圆 */
      #navbar .ace-nav .nav-user-photo {
        width: 30px !important;
        height: 30px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        object-position: center center !important;
        border: 2px solid var(--border) !important;
        margin-right: 6px;
        flex-shrink: 0;
        vertical-align: middle !important;
      }

      /* 搜索按钮 #clickdiv */
      #clickdiv {
        background: transparent !important;
        color: var(--text-secondary) !important;
        position: relative !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 32px !important;
        height: 32px !important;
        border-radius: var(--radius-sm) !important;
        line-height: 1 !important;
        transition: background .15s;
        z-index: 30 !important;
      }
      #clickdiv:hover { background: var(--input-bg) !important; color: var(--text) !important; }
      #clickdiv #clicki,
      #clickdiv .fa-search {
        color: var(--text-secondary) !important;
        margin-top: 0 !important;
        transition: color .15s;
      }
      #clickdiv:hover #clicki,
      #clickdiv:hover .fa-search { color: var(--text) !important; }

      /* 搜索表单 —— 在按钮左侧紧邻展开，无背景卡片 */
      #form-search.nav-search {
        position: absolute !important;
        right: 40px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin: 0 !important;
        z-index: 10 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        overflow: hidden !important;
        padding: 0 !important;
        transition: width .2s ease, opacity .2s ease;
      }
      #form-search.nav-search[style*="width: 0px"] {
        opacity: 0;
        pointer-events: none;
      }
      #form-search.nav-search .form-search,
      #form-search.nav-search .input-icon {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      #form-search.nav-search .nav-search-input {
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        height: 32px !important;
        padding: 0 12px !important;
        line-height: 32px !important;
      }
      #form-search.nav-search .nav-search-input:focus { border-color: var(--border-focus) !important; box-shadow: 0 0 0 3px var(--ring) !important; }
      #form-search.nav-search .ace-icon.fa-search { color: var(--text-secondary) !important; }
      #form-search.nav-search .nav-search-input:focus + .ace-icon.fa-search { color: var(--text) !important; }

      /* 用户下拉菜单 */
      .ace-nav > li.light-blue .dropdown-menu {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        box-shadow: var(--shadow) !important;
        border-radius: var(--radius-sm) !important;
      }
      .ace-nav > li.light-blue .dropdown-menu > li > a {
        color: var(--text-secondary) !important;
        background: transparent !important;
        border-radius: 0 !important;
      }
      .ace-nav > li.light-blue .dropdown-menu > li > a:hover {
        background: var(--input-bg) !important;
        color: var(--text) !important;
      }
      .ace-nav > li.light-blue .dropdown-menu .divider { background: var(--border) !important; }

      /* 侧边栏 —— Hanako 风格完全重构 */
      :root { --urppp-navbar-height: 45px; }
      /* 内容左边距只跟随侧栏状态，不跟随汉堡按钮 */
      .sidebar:not(.menu-min) { width: 260px !important; }
      .sidebar.menu-min,
      .sidebar.menu-min.display,
      body.menu-min .sidebar,
      body.menu-min .sidebar.display {
        width: 50px !important;
        min-width: 50px !important;
        max-width: 50px !important;
      }
      .sidebar:not(.menu-min) ~ .main-content { margin-left: 260px !important; }
      .sidebar.menu-min ~ .main-content,
      body.menu-min .main-content { margin-left: 50px !important; }
      .main-content {
        margin-top: var(--urppp-navbar-height) !important;
        transition: margin-left .25s ease !important;
      }
      /* 小屏：侧栏默认隐藏为覆盖层，内容贴左；展开侧栏也不挤占内容 */
      @media (max-width: 991px) {
        .sidebar:not(.display) ~ .main-content,
        .sidebar.menu-min:not(.display) ~ .main-content,
        .sidebar:not(.menu-min):not(.display) ~ .main-content,
        body.menu-min .main-content {
          margin-left: 0 !important;
        }
        .sidebar.display ~ .main-content {
          margin-left: 0 !important; /* 覆盖层模式，不推内容 */
        }
        /* 小屏点开汉堡：完整宽度抽屉 */
        .sidebar.display:not(.menu-min) {
          display: block !important;
          position: fixed !important;
          left: 0 !important;
          top: var(--urppp-navbar-height) !important;
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          z-index: 1045 !important;
          height: calc(100vh - var(--urppp-navbar-height)) !important;
        }
        /* 小屏若处于 menu-min，保持 50px，不要被 .display 的 260 盖掉 */
        .sidebar.display.menu-min,
        body.menu-min .sidebar.display {
          display: block !important;
          position: fixed !important;
          left: 0 !important;
          top: var(--urppp-navbar-height) !important;
          width: 50px !important;
          min-width: 50px !important;
          max-width: 50px !important;
          z-index: 1045 !important;
          height: calc(100vh - var(--urppp-navbar-height)) !important;
        }
      }
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-fixed-top,
      .navbar-fixed-bottom { left: 0 !important; right: 0 !important; }
      .sidebar {
        z-index: 1030 !important; /* 低于顶栏，避免盖住 navbar 底边 */
        top: var(--urppp-navbar-height) !important;
        height: calc(100vh - var(--urppp-navbar-height)) !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        background: var(--surface) !important;
        border-right: 1px solid var(--border) !important;
        border-top: none !important;
        /* 阴影只向右，不向上侵入顶栏 */
        box-shadow: 2px 0 10px rgba(15, 23, 42, 0.06) !important;
        transition: width .25s ease;
      }
      .sidebar:before { display: none !important; }
      .main-content { transition: margin-left .25s ease; }
      .sidebar .nav-wrap { padding: 0 !important; height: 100% !important; }
      .sidebar .nav-wrap > div { position: static !important; }
      .sidebar .ace-scroll.nav-scroll { display: none !important; }
      #menus { display: none !important; }
      .sidebar-collapse { display: none !important; }

      /* 侧边栏顶部 header */
      .urppp-sidebar-header {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        display: flex !important;
        align-items: center;
        justify-content: flex-end;
        padding: 14px 14px 12px;
        border-bottom: 1px solid var(--border);
        transition: padding .2s;
        z-index: 100 !important;
        background: var(--surface) !important;
      }
      #urppp-menus { margin-top: 50px !important; }
      .urppp-sidebar-toggle {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: var(--input-bg);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        transition: all .15s;
      }
      .urppp-sidebar-toggle:hover { background: var(--border); color: var(--text); }

      /* 小屏汉堡按钮：贴合主题，不再用 ACE 默认灰/蓝 */
      /* 桌面隐藏汉堡；仅小屏显示（不要全局 display:flex 常驻） */
      @media (min-width: 992px) {
        #menu-toggler,
        .navbar-toggle.menu-toggler,
        button.navbar-toggle.menu-toggler,
        .navbar .menu-toggler {
          display: none !important;
        }
      }
      @media (max-width: 991px) {
        #menu-toggler,
        .navbar-toggle.menu-toggler,
        button.navbar-toggle.menu-toggler,
        .navbar .menu-toggler {
          background: var(--input-bg) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          box-shadow: none !important;
          padding: 8px 10px !important;
          margin: 6px 8px !important;
          min-width: 40px !important;
          min-height: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
          gap: 4px !important;
        }
      }
      #menu-toggler:hover,
      .navbar-toggle.menu-toggler:hover,
      button.navbar-toggle.menu-toggler:hover {
        background: color-mix(in srgb, var(--primary) 12%, var(--surface)) !important;
        border-color: var(--primary) !important;
      }
      #menu-toggler:focus,
      .navbar-toggle.menu-toggler:focus,
      #menu-toggler:active,
      .navbar-toggle.menu-toggler:active {
        outline: none !important;
        background: color-mix(in srgb, var(--primary) 16%, var(--surface)) !important;
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      #menu-toggler .icon-bar,
      .navbar-toggle.menu-toggler .icon-bar,
      .menu-toggler .icon-bar {
        display: block !important;
        width: 18px !important;
        height: 2px !important;
        margin: 0 !important;
        background: var(--text) !important;
        border-radius: 2px !important;
        opacity: 1 !important;
        box-shadow: none !important;
      }
      #menu-toggler:hover .icon-bar,
      .navbar-toggle.menu-toggler:hover .icon-bar {
        background: var(--primary) !important;
      }
      /* ACE 有时用伪元素画三条线 */
      #menu-toggler:before,
      #menu-toggler:after,
      .menu-toggler:before,
      .menu-toggler:after {
        background: var(--text) !important;
        border-color: var(--text) !important;
      }

      /* 新菜单 */
      #urppp-menus {
        list-style: none;
        margin: 50px 0 0 0;
        padding: 10px 12px 24px;
        overflow-y: auto;
        max-height: calc(100vh - 64px);
      }
      #urppp-menus::-webkit-scrollbar { width: 4px; }
      #urppp-menus::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

      .urppp-nav-item { margin: 4px 0; }
      .urppp-nav-link {
        display: flex;
        align-items: center;
        padding: 11px 13px;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        transition: background .15s, color .15s;
        text-decoration: none;
        position: relative;
      }
      .urppp-nav-link { cursor: default !important; text-decoration: none !important; }
      .urppp-nav-link .urppp-nav-text { cursor: pointer; }
      .urppp-nav-link .fa, .urppp-nav-link .ace-icon { pointer-events: none !important; cursor: default !important; }
      .urppp-nav-link:hover { background: var(--input-bg); color: var(--text); }
      .urppp-nav-link:hover .urppp-nav-text { text-decoration: underline; }
      .urppp-nav-item.active > .urppp-nav-link,
      .urppp-nav-item.open.active > .urppp-nav-link {
        background: var(--input-bg);
        color: var(--primary);
        font-weight: 500;
      }
      .urppp-nav-link > .fa {
        width: 22px;
        text-align: center;
        margin-right: 11px;
        font-size: 18px;
        color: inherit;
        flex-shrink: 0;
        transition: margin .25s ease;
      }
      .urppp-nav-text {
        flex: 1;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 1;
        max-width: 200px;
        transition: opacity .2s ease, max-width .25s ease;
      }
      .urppp-nav-arrow {
        font-size: 13px;
        color: var(--text-muted);
        margin-left: 8px;
        opacity: 1;
        max-width: 20px;
        transition: transform .2s, opacity .2s ease, max-width .25s ease;
        flex-shrink: 0;
      }
      .urppp-nav-item.open > .urppp-nav-link .urppp-nav-arrow { transform: rotate(180deg); }

      .urppp-nav-submenu {
        list-style: none;
        margin: 0;
        padding: 0 0 0 20px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height .3s cubic-bezier(.4,0,.2,1), opacity .25s ease, padding .3s ease;
      }
      .urppp-nav-item.open > .urppp-nav-submenu {
        max-height: 800px;
        opacity: 1;
        padding: 3px 0 3px 20px;
      }
      .urppp-nav-submenu .urppp-nav-link { padding: 9px 13px; font-size: 14px; }
      .urppp-nav-submenu .urppp-nav-submenu { padding-left: 16px; }

      /* 折叠状态 */
      .sidebar.menu-min .urppp-sidebar-header,
      body.menu-min .sidebar .urppp-sidebar-header { justify-content: center; padding: 14px 0 12px; }
      .sidebar.menu-min #urppp-menus,
      body.menu-min .sidebar #urppp-menus { padding: 10px 6px 24px; }
      .sidebar.menu-min .urppp-nav-link,
      body.menu-min .sidebar .urppp-nav-link { padding: 12px 0; justify-content: center; }
      .sidebar.menu-min .urppp-nav-text,
      .sidebar.menu-min .urppp-nav-arrow,
      body.menu-min .sidebar .urppp-nav-text,
      body.menu-min .sidebar .urppp-nav-arrow {
        opacity: 0 !important;
        max-width: 0 !important;
        width: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        display: none !important;
      }
      .sidebar.menu-min .urppp-nav-link > .fa,
      body.menu-min .sidebar .urppp-nav-link > .fa { margin-right: 0; font-size: 18px; }
      .sidebar.menu-min .urppp-nav-submenu,
      body.menu-min .sidebar .urppp-nav-submenu { max-height: 0 !important; opacity: 0 !important; display: none !important; }

      /* 全局过渡和滚动条 */
      ::selection { background: var(--primary); color: #fff; }
      html { scroll-behavior: smooth; }
      :focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

      /* 主内容区 */
      .main-container, .main-container::before { background: var(--bg) !important; }
      .main-content, .page-content { background: var(--bg) !important; }
      /* 面包屑：胶囊路径条，加大字号，与顶栏/侧栏留白 */
      .breadcrumbs, #breadcrumbs {
        display: flex !important;
        align-items: center !important;
        background: transparent !important;
        border: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
        padding: 16px 64px 12px !important;
        min-height: 0 !important;
        line-height: 1.4 !important;
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
        z-index: 1 !important;
        margin: 0 !important;
      }
      .breadcrumbs.breadcrumbs-fixed {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
      }
      .main-content { padding-top: 0 !important; }
      body.breadcrumbs-fixed .main-content { padding-top: 0 !important; }
      .breadcrumb {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        margin: 0 !important;
        padding: 10px 16px !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 2px !important;
        font-size: 16px !important;
        list-style: none !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .breadcrumb > li {
        color: var(--text-secondary) !important;
        display: inline-flex !important;
        align-items: center !important;
        float: none !important;
        padding: 0 !important;
        text-shadow: none !important;
        font-size: 16px !important;
        line-height: 1.35 !important;
      }
      .breadcrumb > li + li:before {
        content: '' !important;
        display: inline-block !important;
        width: 6px !important;
        height: 6px !important;
        margin: 0 10px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-top: 1.5px solid var(--text-muted) !important;
        transform: rotate(45deg) !important;
        opacity: 0.7 !important;
        padding: 0 !important;
        float: none !important;
        font-size: 0 !important;
      }
      .breadcrumb > li > a,
      .breadcrumb > li > span,
      .breadcrumb > li .urppp-bc-label {
        color: inherit !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 7px !important;
        font-size: 16px !important;
        padding: 4px 10px !important;
        border-radius: 8px !important;
        transition: background .15s, color .15s !important;
      }
      .breadcrumb > li > a:hover,
      .breadcrumb > li:not(.active):not(:last-child) .urppp-bc-label:hover {
        color: var(--primary) !important;
        background: var(--input-bg) !important;
      }
      .breadcrumb > li.active,
      .breadcrumb > li:last-child {
        color: var(--primary) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      .breadcrumb > li.active > span,
      .breadcrumb > li.active .urppp-bc-label,
      .breadcrumb > li:last-child > span,
      .breadcrumb > li:last-child .urppp-bc-label {
        background: var(--ring) !important;
        color: var(--primary) !important;
        font-weight: 600 !important;
      }
      .breadcrumb .home-icon,
      .breadcrumb .fa-home {
        color: var(--primary) !important;
        margin-right: 0 !important;
        font-size: 16px !important;
      }
      .breadcrumb > li.hide-item { display: none !important; }
      /* 内容区：明显加大左右留白，高优先级覆盖 ACE */
      .main-content .page-content,
      #page-content-template.page-content,
      div.page-content {
        padding: 16px 64px 40px !important;
        box-sizing: border-box !important;
        max-width: 1600px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .breadcrumbs, #breadcrumbs {
        max-width: 1600px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box !important;
      }
      .main-content .page-content > .row,
      #page-content-template > .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .main-content .page-content > .row > [class*="col-"],
      .main-content .page-content [class*="col-xs-"],
      .main-content .page-content [class*="col-sm-"],
      .main-content .page-content [class*="col-md-"],
      .main-content .page-content [class*="col-lg-"],
      .main-content .page-content .self-margin,
      #page-content-template .self-margin {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      #left_layout, .page-content .widget, .page-content form {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      /* 学籍双栏：保留 col-xs-4 / col-xs-8 结构，只清外侧 gutter 并在中间留缝 */
      /* 学籍双栏父级常不是 .row：补 clearfix，保持左右并排且不塌陷 */
      .page-content .col-xs-4,
      .page-content .col-sm-4 {
        float: left !important;
        width: 33.33333333% !important;
      }
      .page-content .col-xs-8,
      .page-content .col-sm-8 {
        float: left !important;
        width: 66.66666667% !important;
      }
      .page-content .col-xs-4::after,
      .page-content .col-xs-8::after { display: none !important; }
      /* 包住 float 的父级 */
      .page-content form #left_layout > div > div:has(> .col-xs-4),
      .page-content div:has(> .col-xs-4):has(> .col-xs-8) {
        display: block !important;
        width: 100% !important;
        overflow: hidden !important; /* clearfix */
      }
      .page-content .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .page-content .col-xs-4,
      .page-content .col-sm-4,
      .page-content .col-md-4 {
        padding-left: 0 !important;
        padding-right: 16px !important;
        box-sizing: border-box !important;
      }
      .page-content .col-xs-8,
      .page-content .col-sm-8,
      .page-content .col-md-8 {
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      .page-content .col-xs-12,
      .page-content .col-sm-12,
      .page-content .col-md-12 {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      /* 列内标题/卡片自然 100%，不再 DOM 提升 */
      .page-content .col-xs-4 > .header,
      .page-content .col-xs-8 > .header,
      .page-content .col-xs-4 > h4.header,
      .page-content .col-xs-8 > h4.header {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
      }
      .main-content .page-content .tabbable,
      .page-content .tabbable {
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 16px !important;
        padding: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .main-content .tabbable .tab-content,
      .tabbable > .tab-content,
      .page-content .tab-content {
        padding: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      /* 滚动表格容器也吃一点内边距感 */
      .main-content #code_scroll,
      .page-content [id$="_scroll"] {
        box-sizing: border-box !important;
      }

      /* 页面区块标题：全宽条，与内容左右对齐，下边距拉开 */
      h4.header, h3.header, h5.header, .header.smaller, .header.lighter, .page-header {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-bottom: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        color: var(--text) !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        margin: 8px 0 18px !important;
        padding: 12px 18px !important;
        min-height: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        position: relative !important;
        clear: both !important;
        float: none !important;
      }
      /* 标题后的第一个内容块拉开间距 */
      h4.header + *,
      h3.header + *,
      h5.header + *,
      .header.smaller + *,
      .page-header + * {
        margin-top: 4px !important;
      }
      h4.header + .space, h4.header + .hr, h4.header + .space-6, h4.header + .space-10,
      h3.header + .space, .header.smaller + .space {
        display: none !important;
      }
      h4.header::before, h3.header::before, .header.smaller::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 16px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      h4.header::after, h3.header::after, .header.smaller::after {
        content: none !important;
        display: none !important;
      }
      /* 旧 header 图标隐藏；widget-title 保留并做成主题小标 */
      h4.header > .glyphicon,
      h4.header > .fa,
      h4.header > .ace-icon,
      h3.header > .glyphicon,
      h3.header > .fa,
      .header.smaller > .glyphicon,
      .header.smaller > .fa {
        display: none !important;
      }

      h4.header .right_top_oper,
      .header .right_top_oper {
        margin-left: auto !important;
        margin-right: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        float: none !important;
        position: static !important;
        top: auto !important;
        right: auto !important;
        height: auto !important;
        line-height: 1 !important;
      }
      h4.header > .btn,
      h4.header > a.btn,
      h3.header > .btn,
      .header.smaller > .btn,
      h4.header .right_top_oper > .btn,
      h4.header .right_top_oper > a,
      .header .right_top_oper > .btn,
      .header .right_top_oper > a {
        margin: 0 0 0 auto !important;
        float: none !important;
        position: static !important;
        top: auto !important;
        right: auto !important;
        vertical-align: middle !important;
        align-self: center !important;
      }
      /* 标题旁操作按钮略放大，保证垂直居中 */
      h4.header .btn,
      h3.header .btn,
      .header.smaller .btn,
      h4.header .right_top_oper .btn,
      .header .right_top_oper .btn {
        font-size: 12px !important;
        padding: 0 12px !important;
        line-height: 1 !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        border-radius: 8px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
      }
      h4.header.grey, .header.lighter.grey, .header.smaller.lighter {
        color: var(--text) !important;
      }
      /* 卡片 / 面板 */
      .widget-box,
      .widget-box.transparent,
      .panel,
      .panel-default,
      .panel-primary,
      .panel-info,
      .well,
      .thumbnail,
      .infobox,
      .profile-user-info,
      .profile-user-info-striped,
      .dd,
      fieldset {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }
      .widget-box {
        margin-bottom: 18px !important;
      }
      .widget-header,
      .panel-heading {
        background: transparent !important;
        border-bottom: 1px solid var(--border) !important;
        color: var(--text) !important;
        padding: 12px 16px !important;
        border-radius: 0 !important;
        display: flex !important;
        align-items: center !important;
        min-height: 48px !important;
      }
      /* widget-title 只做标题排版，不套整页 header 大卡片样式 */
      .widget-header .widget-title,
      h4.widget-title,
      h3.widget-title,
      .widget-title {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: auto !important;
        max-width: 100% !important;
        min-height: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        float: none !important;
        clear: none !important;
        color: var(--text) !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
      }
      .widget-header .widget-title::before,
      h4.widget-title::before,
      .widget-title::before {
        content: none !important;
        display: none !important;
      }
      .widget-header .widget-title > .glyphicon,
      .widget-header .widget-title > .fa,
      .widget-header .widget-title > .ace-icon,
      h4.widget-title > .glyphicon,
      h4.widget-title > .fa,
      h4.widget-title > .ace-icon,
      .widget-title > .glyphicon,
      .widget-title > .fa,
      .widget-title > .ace-icon {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 26px !important;
        height: 26px !important;
        margin: 0 !important;
        border-radius: 8px !important;
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        font-size: 13px !important;
        line-height: 1 !important;
        flex: 0 0 26px !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .widget-header .widget-title > img,
      h4.widget-title > img,
      .widget-title > img {
        display: inline-block !important;
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .widget-body,
      .panel-body {
        background: var(--surface) !important;
        color: var(--text) !important;
        padding: 16px 18px !important;
      }
      .well {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        border-radius: var(--radius) !important;
        padding: 16px 18px !important;
        margin-bottom: 18px !important;
        box-shadow: none !important;
      }
      /* 统计卡片 infobox：统一表面色与可读性；仅容器内才做网格 */
      /* infobox-container grid defined below */

      /* 所有 infobox 统一尺寸（上下卡片一致） */
      .infobox {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        padding: 14px 16px !important;
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
        margin: 0 12px 12px 0 !important;
        float: left !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        color: var(--text) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      .infobox[style] {
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
      }
      .infobox-container {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 0 16px !important;
      }
      .infobox-container > .infobox,
      .infobox-container > .infobox[style] {
        float: none !important;
        margin: 0 !important;
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
        flex: 0 0 220px !important;
      }
      /* 下方课组统计卡也统一成同样尺寸 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped {
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        min-height: 112px !important;
        height: auto !important;
        margin: 0 12px 12px 0 !important;
        float: left !important;
        box-sizing: border-box !important;
      }
      /* 去掉 ACE 彩色底/渐变，避免白字/深色字不可读 */
      .infobox.infobox-dark,
      .infobox.infobox-green,
      .infobox.infobox-blue,
      .infobox.infobox-pink,
      .infobox.infobox-red,
      .infobox.infobox-orange,
      .infobox.infobox-purple,
      .infobox.infobox-grey,
      .infobox.infobox-black {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
      }
      .infobox:before,
      .infobox:after {
        display: none !important;
        content: none !important;
        background: none !important;
      }
      /* ACE 左侧色条图标区：改为小色点，避免占宽导致竖排 */
      .infobox > .infobox-icon {
        display: none !important;
      }
      .infobox-container > .infobox > .infobox-icon {
        display: none !important;
      }
      .infobox > .infobox-data {
        border: none !important;
        min-width: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        color: var(--text) !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      .infobox .infobox-data-number,
      .infobox .infobox-content {
        color: var(--text) !important;
        text-shadow: none !important;
      }
      .infobox .infobox-data-number {
        font-size: 22px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        margin: 0 0 6px !important;
        display: block !important;
        color: var(--primary) !important;
      }
      .infobox .infobox-content {
        font-size: 13px !important;
        font-weight: 500 !important;
        line-height: 1.35 !important;
        color: var(--text-secondary) !important;
        white-space: normal !important;
        word-break: break-word !important;
      }
      /* 进度条：主文字下方；适中粗细；0% 空轨道 */
      .infobox .infobox-data {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: flex-start !important;
        gap: 0 !important;
        width: 100% !important;
      }
      .infobox .urppp-pct-text {
        order: 1 !important;
        display: block !important;
        margin: 0 0 6px !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        color: var(--primary) !important;
      }
      .infobox .urppp-pct-bar {
        order: 2 !important;
        display: block !important;
        width: 100% !important;
        height: 8px !important;
        border-radius: 999px !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        margin: 0 0 8px !important;
        padding: 0 !important;
      }
      .infobox .infobox-data-number,
      .infobox .infobox-content,
      .infobox .infobox-text {
        order: 3 !important;
      }
      .infobox .urppp-pct-fill {
        display: block !important;
        height: 100% !important;
        border-radius: 999px !important;
        background: var(--primary) !important;
        opacity: 1 !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      .infobox .urppp-pct-bar.is-empty .urppp-pct-fill { display: none !important; }
      /* 表格 progress：细条 + data-percent 伪元素居中（最稳） */
      .progress,
      .progress.pos-rel,
      div.progress {
        position: relative !important;
        border-radius: 999px !important;
        overflow: hidden !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        box-shadow: none !important;
        height: 16px !important;
        min-height: 16px !important;
        max-height: 16px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 16px !important;
      }
      .progress .progress-bar,
      .progress > .progress-bar {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        height: 100% !important;
        border-radius: 999px !important;
        background: var(--primary) !important;
        box-shadow: none !important;
        font-size: 0 !important;
        color: transparent !important;
        text-indent: -9999px !important;
      }
      /* 隐藏原生 span 文字，改用伪元素，保证垂直水平都居中 */
      .progress > span,
      .progress .progress-bar + span {
        display: none !important;
      }
      .progress.pos-rel::after,
      .progress[data-percent]::after {
        content: attr(data-percent) !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        z-index: 4 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        color: var(--text) !important;
        text-shadow: 0 0 0 transparent !important;
        pointer-events: none !important;
        white-space: nowrap !important;
        mix-blend-mode: difference !important;
      }
      .infobox .easy-pie-chart,
      .infobox .percentage,
      .infobox .infobox-progress,
      .infobox canvas {
        display: none !important;
      }
      .infobox-container::after,
      .page-content .infobox:last-of-type::after {
        content: '' !important;
        display: table !important;
        clear: both !important;
      }
      /* ========== 培养方案展示：zTree 安静可读 ========== */
      /* 保留全局 h4.header 卡片高度，只补布局 */
      #two .header.urppp-plan-header,
      .urppp-plan-header {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 8px 12px !important;
        min-height: 48px !important;
        margin: 8px 0 18px !important;
        padding: 12px 18px !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        background: var(--surface) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        line-height: 1.4 !important;
      }
      .urppp-plan-header > .glyphicon,
      .urppp-plan-header > .ace-icon {
        display: none !important; /* 与全局 header 一致，左侧用主色竖条 */
      }
      .urppp-plan-legend {
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 10px 14px !important;
        margin: 0 !important;
        color: var(--text-muted) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
      }
      .urppp-plan-legend .urppp-lg {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        color: var(--text-muted) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
      }
      .urppp-plan-legend .urppp-lg i {
        font-size: 13px !important;
        margin: 0 !important;
        width: auto !important;
        height: auto !important;
        background: none !important;
      }
      .urppp-plan-legend .urppp-lg.done i,
      .urppp-plan-legend .urppp-lg.pass i { color: #16a34a !important; }
      .urppp-plan-legend .urppp-lg.todo i { color: var(--primary) !important; }
      .urppp-plan-legend .urppp-lg.fail i { color: #dc2626 !important; }
      .urppp-plan-legend .urppp-lg.pending i { color: var(--text-muted) !important; }
      .urppp-plan-header .right_top_oper {
        margin-left: auto !important;
        display: inline-flex !important;
        gap: 8px !important;
      }

      /* 树外壳：透明容器，不再用大卡片裁切圆角 */
      .urppp-plan-tree-shell,
      #two .row > div[style*="border"] {
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
        padding: 0 !important;
      }
      #tree_div,
      .urppp-plan-tree-shell #tree_div,
      .urppp-plan-tree-shell .widget-body {
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
      }

      /* zTree：每个顶级课组独立卡片 */
      .ztree.urppp-ztree,
      #treeDemo.ztree {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        color: var(--text) !important;
      }
      .ztree.urppp-ztree li,
      #treeDemo.ztree li {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        padding: 0 !important;
        margin: 0 !important;
        line-height: 1.25 !important;
        list-style: none !important;
      }
      .ztree.urppp-ztree li + li,
      #treeDemo.ztree li + li {
        margin-top: 0 !important;
      }
      /* 顶级课组卡片：底部更贴；展开钮与标题首行对齐 */
      .ztree.urppp-ztree > li,
      #treeDemo.ztree > li {
        display: grid !important;
        grid-template-columns: 16px 1fr !important;
        column-gap: 6px !important;
        row-gap: 0 !important;
        align-items: start !important;
        margin: 0 0 8px 0 !important;
        padding: 5px 10px 1px !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        background: var(--surface) !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        min-height: 0 !important;
        height: auto !important;
      }
      .ztree.urppp-ztree > li:last-child,
      #treeDemo.ztree > li:last-child {
        margin-bottom: 0 !important;
      }
      /* 展开钮：对齐标题第一行中心 */
      .ztree.urppp-ztree > li > span.button.switch,
      #treeDemo.ztree > li > span.button.switch {
        grid-column: 1 !important;
        grid-row: 1 !important;
        align-self: start !important;
        justify-self: center !important;
        margin: 4px 0 0 0 !important;
        flex: none !important;
      }
      .ztree.urppp-ztree > li > a,
      #treeDemo.ztree > li > a {
        grid-column: 2 !important;
        grid-row: 1 !important;
        display: block !important;
        width: auto !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important;
        min-height: 0 !important;
        height: auto !important;
      }
      /* 折叠态：空 ul 绝不能占位/留底 */
      .ztree.urppp-ztree li > ul[style*="display: none"],
      .ztree.urppp-ztree li > ul[style*="display:none"],
      #treeDemo.ztree li > ul[style*="display: none"],
      #treeDemo.ztree li > ul[style*="display:none"] {
        display: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        height: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      /* 展开态课程列表：紧贴标题，不垫高 */
      .ztree.urppp-ztree li > ul,
      #treeDemo.ztree li > ul {
        flex: 0 0 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 0 0 8px !important;
        border-left: 1px solid var(--border) !important;
        box-sizing: border-box !important;
        background: transparent !important;
      }
      .ztree.urppp-ztree > li > ul,
      #treeDemo.ztree > li > ul {
        grid-column: 1 / -1 !important;
        grid-row: 2 !important;
        margin: 2px 0 0 0 !important;
        padding: 2px 0 0 22px !important;
        border-left: none !important;
        border-top: 1px solid var(--border) !important;
      }
      .ztree.urppp-ztree > li > a .urppp-sub,
      #treeDemo.ztree > li > a .urppp-sub {
        margin: 1px 0 0 0 !important;
        padding: 0 !important;
        line-height: 1.35 !important;
      }
      /* 原生 ico 占位干掉 */
      .ztree.urppp-ztree li span.button.ico_open,
      .ztree.urppp-ztree li span.button.ico_close,
      .ztree.urppp-ztree li span.button.ico_docu,
      #treeDemo.ztree li span.button.ico_open,
      #treeDemo.ztree li span.button.ico_close,
      #treeDemo.ztree li span.button.ico_docu {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* 状态图标与标题首行对齐 */
      .ztree.urppp-ztree li a i.ace-icon,
      .ztree.urppp-ztree li a i.fa,
      #treeDemo.ztree li a i.ace-icon,
      #treeDemo.ztree li a i.fa {
        font-size: 14px !important;
        line-height: 1.4 !important;
        vertical-align: baseline !important;
        margin: 0 6px 0 0 !important;
      }
      /* 展开钮：子节点用，顶级由 grid 对齐 */
      .ztree.urppp-ztree li > span.button.switch,
      #treeDemo.ztree li > span.button.switch {
        flex: 0 0 14px !important;
        width: 14px !important;
        height: 14px !important;
        margin: 3px 4px 0 0 !important;
      }
      .ztree.urppp-ztree > li > span.button.switch,
      #treeDemo.ztree > li > span.button.switch {
        width: 14px !important;
        height: 14px !important;
        margin: 4px 0 0 0 !important;
      }
      /* 叶子节点无子级：隐藏无效展开钮 */
      .ztree.urppp-ztree li > span.button.switch.urppp-switch-leaf,
      .ztree.urppp-ztree li > span.button.switch[class*="_docu"],
      #treeDemo.ztree li > span.button.switch.urppp-switch-leaf,
      #treeDemo.ztree li > span.button.switch[class*="_docu"] {
        display: none !important;
      }
      /* 叶子节点文字左缩进，与有展开钮的内容列对齐 */
      .ztree.urppp-ztree li:has(> span.button.switch[class*="_docu"]) > a,
      .ztree.urppp-ztree li:has(> span.button.switch.urppp-switch-leaf) > a,
      #treeDemo.ztree li:has(> span.button.switch[class*="_docu"]) > a,
      #treeDemo.ztree li:has(> span.button.switch.urppp-switch-leaf) > a {
        padding-left: 14px !important;
      }
      .ztree.urppp-ztree li a,
      #treeDemo.ztree li a {
        display: block !important;
        flex: 1 1 0 !important;
        min-width: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        padding: 2px 6px !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 8px !important;
        background: transparent !important;
        color: var(--text) !important;
        text-decoration: none !important;
        white-space: normal !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        transition: background .12s !important;
      }
      .ztree.urppp-ztree li a:hover,
      #treeDemo.ztree li a:hover {
        background: var(--input-bg) !important;
      }
      .ztree.urppp-ztree li a.curSelectedNode,
      #treeDemo.ztree li a.curSelectedNode {
        background: var(--input-bg) !important;
        border: none !important;
        color: var(--text) !important;
        opacity: 1 !important;
        height: auto !important;
        box-shadow: none !important;
      }

      /* 展开按钮：更小更安静 */
      .ztree.urppp-ztree li span.button,
      #treeDemo.ztree li span.button {
        width: 12px !important;
        height: 12px !important;
        margin: 0 3px 0 0 !important;
        vertical-align: middle !important;
      }
      .ztree.urppp-ztree li a.urppp-expandable,
      #treeDemo.ztree li a.urppp-expandable {
        cursor: pointer !important;
      }
      .ztree.urppp-ztree li span.button.switch,
      #treeDemo.ztree li span.button.switch {
        background-image: none !important;
        position: relative !important;
        border-radius: 4px !important;
        background: transparent !important;
        border: 1px solid var(--border) !important;
      }
      .ztree.urppp-ztree li span.button.noline_open::before,
      .ztree.urppp-ztree li span.button.roots_open::before,
      .ztree.urppp-ztree li span.button.center_open::before,
      .ztree.urppp-ztree li span.button.bottom_open::before,
      .ztree.urppp-ztree li span.button.root_open::before,
      #treeDemo.ztree li span.button.noline_open::before,
      #treeDemo.ztree li span.button.roots_open::before,
      #treeDemo.ztree li span.button.center_open::before,
      #treeDemo.ztree li span.button.bottom_open::before,
      #treeDemo.ztree li span.button.root_open::before {
        content: '' !important;
        position: absolute !important;
        left: 50% !important; top: 50% !important;
        width: 5px !important; height: 5px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-bottom: 1.5px solid var(--text-muted) !important;
        transform: translate(-50%, -65%) rotate(45deg) !important;
      }
      .ztree.urppp-ztree li span.button.noline_close::before,
      .ztree.urppp-ztree li span.button.roots_close::before,
      .ztree.urppp-ztree li span.button.center_close::before,
      .ztree.urppp-ztree li span.button.bottom_close::before,
      .ztree.urppp-ztree li span.button.root_close::before,
      #treeDemo.ztree li span.button.noline_close::before,
      #treeDemo.ztree li span.button.roots_close::before,
      #treeDemo.ztree li span.button.center_close::before,
      #treeDemo.ztree li span.button.bottom_close::before,
      #treeDemo.ztree li span.button.root_close::before {
        content: '' !important;
        position: absolute !important;
        left: 50% !important; top: 50% !important;
        width: 5px !important; height: 5px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-bottom: 1.5px solid var(--text-muted) !important;
        transform: translate(-65%, -50%) rotate(-45deg) !important;
      }
      .ztree.urppp-ztree li span.button.ico_open,
      .ztree.urppp-ztree li span.button.ico_close,
      .ztree.urppp-ztree li span.button.ico_docu,
      #treeDemo.ztree li span.button.ico_open,
      #treeDemo.ztree li span.button.ico_close,
      #treeDemo.ztree li span.button.ico_docu {
        display: none !important;
      }

      /* 状态只体现在图标色，节点不再铺大色块 */
      .ztree.urppp-ztree li a i.ace-icon,
      .ztree.urppp-ztree li a i.fa,
      #treeDemo.ztree li a i.ace-icon,
      #treeDemo.ztree li a i.fa {
        width: auto !important;
        height: auto !important;
        border-radius: 0 !important;
        display: inline !important;
        font-size: 14px !important;
        margin: 0 6px 0 0 !important;
        background: none !important;
        flex: none !important;
        line-height: 1 !important;
      }
      .ztree.urppp-ztree li.urppp-node-done > a i,
      #treeDemo.ztree li.urppp-node-done > a i,
      .ztree.urppp-ztree li.urppp-node-pass > a i,
      #treeDemo.ztree li.urppp-node-pass > a i { color: #16a34a !important; }
      .ztree.urppp-ztree li.urppp-node-todo > a i,
      #treeDemo.ztree li.urppp-node-todo > a i { color: var(--primary) !important; }
      .ztree.urppp-ztree li.urppp-node-fail > a i,
      #treeDemo.ztree li.urppp-node-fail > a i { color: #dc2626 !important; }
      .ztree.urppp-ztree li.urppp-node-pending > a i,
      #treeDemo.ztree li.urppp-node-pending > a i { color: var(--text-muted) !important; }
      .ztree.urppp-ztree li.urppp-node-done > a,
      .ztree.urppp-ztree li.urppp-node-todo > a,
      #treeDemo.ztree li.urppp-node-done > a,
      #treeDemo.ztree li.urppp-node-todo > a {
        background: transparent !important;
        border: none !important;
      }

      /* 文本层级：恢复正常字号，不拿缩小字体当压缩间距 */
      .ztree.urppp-ztree li a span.node_name,
      #treeDemo.ztree li a span.node_name {
        display: inline !important;
        white-space: normal !important;
        line-height: 1.4 !important;
        font-size: 13.5px !important;
        color: var(--text) !important;
      }
      .ztree.urppp-ztree > li > a span.node_name,
      #treeDemo.ztree > li > a span.node_name {
        font-weight: 600 !important;
        font-size: 14px !important;
      }
      .urppp-sub {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 4px 8px !important;
        width: auto !important;
        margin: 1px 0 0 0 !important;
        padding: 0 !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 1.35 !important;
        color: var(--text-muted) !important;
      }
      .urppp-kv {
        display: inline-flex !important;
        align-items: baseline !important;
        gap: 3px !important;
        white-space: nowrap !important;
      }
      .urppp-kv em {
        font-style: normal !important;
        color: var(--text-muted) !important;
        font-weight: 400 !important;
      }
      .urppp-kv b {
        font-weight: 700 !important;
        color: var(--text) !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-kv.req b { color: var(--primary) !important; }
      .urppp-kv.ok b { color: #15803d !important; }
      .urppp-kv.warn b { color: #ca8a04 !important; }
      .urppp-kv.muted b { color: var(--text-muted) !important; font-weight: 600 !important; }

      .urppp-code {
        display: inline !important;
        padding: 0 !important;
        margin-right: 6px !important;
        border: none !important;
        background: none !important;
        border-radius: 0 !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        color: var(--text-muted) !important;
      }
      .urppp-title,
      .urppp-gname {
        display: inline !important;
        font-weight: 600 !important;
        color: var(--text) !important;
      }
      .urppp-meta {
        display: inline !important;
        padding: 0 !important;
        margin-left: 6px !important;
        border: none !important;
        background: none !important;
        border-radius: 0 !important;
        font-size: 12px !important;
        color: var(--text-muted) !important;
      }
      .urppp-score {
        display: inline-flex !important;
        align-items: baseline !important;
        gap: 5px !important;
        margin-left: 8px !important;
        padding: 0 7px !important;
        border-radius: 999px !important;
        border: 1px solid transparent !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
        vertical-align: baseline !important;
      }
      .urppp-score b {
        font-weight: 600 !important;
        opacity: 0.9 !important;
      }
      .urppp-score em {
        font-style: normal !important;
        font-weight: 700 !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-score i {
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: 11px !important;
        opacity: 0.75 !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-score.pass {
        color: #15803d !important;
        background: rgba(22,163,74,0.10) !important;
        border-color: rgba(22,163,74,0.22) !important;
      }
      .urppp-score.fail {
        color: #b91c1c !important;
        background: rgba(220,38,38,0.10) !important;
        border-color: rgba(220,38,38,0.22) !important;
      }

      /* 主节点：卡片在 li 上；不缩 padding 挤压文字 */
      .ztree.urppp-ztree > li > a,
      #treeDemo.ztree > li > a {
        font-weight: 600 !important;
        background: transparent !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
      }
      .ztree.urppp-ztree > li > a:hover,
      #treeDemo.ztree > li > a:hover {
        background: var(--input-bg) !important;
        border: none !important;
      }
      .ztree.urppp-ztree > li + li,
      #treeDemo.ztree > li + li {
        margin-top: 0 !important;
      }

      /* 课组要求等表格恢复正常横向表格布局 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped {
        display: block !important;
        width: 100% !important;
      }
      .page-content .profile-user-info.self,
      .page-content .profile-user-info:has(.value_element) {
        overflow: visible !important;
      }
      /* 查询条件：pair 化后必须 flex 横排 */
      .page-content .profile-user-info.self .profile-info-row.urppp-query-row,
      .page-content .profile-user-info:has(.value_element) .profile-info-row.urppp-query-row,
      .page-content .profile-info-row.urppp-query-row {
        display: grid !important;
        align-items: center !important;
      }

      /* 个人信息 / 学籍信息 */
      .profile-user-info,
      .profile-user-info-striped {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        margin-bottom: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      /* 培养方案完成情况：下方课组卡片统一尺寸节奏（排除查询条件表单） */
      .page-content .profile-user-info:not(.self):not(.urppp-query-form):not(:has(.value_element)),
      .page-content .profile-user-info-striped:not(.self):not(.urppp-query-form):not(:has(.value_element)) {
        min-height: 108px !important;
      }
      .page-content .col-xs-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-sm-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-md-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-xs-4 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-sm-4 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-xs-3 > .profile-user-info:not(.self):not(.urppp-query-form) {
        height: 100% !important;
        min-height: 108px !important;
      }
      /* 查询条件表单：高度随内容，不留底部空档 */
      .page-content .profile-user-info.self,
      .page-content .profile-user-info.urppp-query-form,
      .page-content .profile-user-info:has(.value_element),
      .profile-user-info.self,
      .profile-user-info.urppp-query-form {
        min-height: 0 !important;
        height: auto !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) > [class*="col-"] {
        display: flex !important;
        flex-direction: column !important;
      }
      /* ============================================================
       * profile-info 布局（对齐 ACE 原版）
       * - 学籍等：一行一对 name/value
       * - 查询条件 .self：一行多对 name/value（float 横向排列）
       * 不能全局 float:none / display:flex，否则查询表会竖着堆
       * ============================================================ */
      .profile-user-info:has(.chosen-container),
      .widget-box:has(.chosen-container),
      .panel:has(.chosen-container),
      .profile-user-info.self:not(.setLabelWidth),
      .profile-user-info-striped.self:not(.setLabelWidth),
      .profile-user-info:has(.value_element):not(.setLabelWidth) {
        overflow: visible !important;
      }
      /* 学籍卡需要 overflow:hidden 才能裁出圆角 */
      .profile-user-info.setLabelWidth,
      .profile-user-info-striped.setLabelWidth {
        overflow: hidden !important;
        border-radius: var(--radius, 12px) !important;
      }

      /* 单对信息表：整卡拉满内容区，避免 shrink-to-fit 变窄条 */
      .page-content .profile-user-info:not(.urppp-query-form),
      .page-content .profile-user-info-striped:not(.urppp-query-form),
      .page-content form .profile-user-info,
      .page-content form .profile-user-info-striped {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: block !important;
      }
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) {
        display: grid !important;
        grid-template-columns: 140px minmax(0, 1fr) !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 42px !important;
        position: relative !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair):before,
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair):after {
        content: none !important;
        display: none !important;
      }
      .profile-info-row:last-child { border-bottom: none !important; }

      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) > .profile-info-name,
      .profile-info-name {
        float: none !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 10px 12px !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        text-align: right !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        white-space: nowrap !important;
      }
      /* 单对：value 占右侧剩余宽度，禁止 margin-left 把布局打成竖排 */
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) > .profile-info-value,
      .profile-info-value {
        float: none !important;
        margin: 0 !important;
        margin-left: 0 !important;
        min-height: 42px !important;
        padding: 6px 12px !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        border: none !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        position: relative !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
      }
      .profile-info-value > span {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      .profile-info-value .form-control,
      .profile-info-value input.form-control,
      .profile-info-value textarea.form-control,
      .profile-info-value input[type="text"],
      .profile-info-value textarea {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      /* 个人信息修改页输入区更宽、更易填 */
      .page-content form .profile-info-value .form-control,
      .page-content form .profile-info-value input.form-control,
      .page-content form .profile-info-value textarea.form-control {
        max-width: 720px !important;
      }
      /* 学籍 setLabelWidth：单对时标签 150px */
      .setLabelWidth .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) {
        grid-template-columns: 150px minmax(0, 1fr) !important;
      }
      /*
       * 学籍右侧「一行两对」：标记 .urppp-dual-pair 后用 4 列 grid
       * 不用 :has 作为唯一手段，避免兼容/覆盖失败
       */
      html body .page-content .profile-info-row.urppp-dual-pair,
      html body .page-content .setLabelWidth .profile-info-row.urppp-dual-pair,
      .profile-info-row.urppp-dual-pair {
        display: grid !important;
        grid-template-columns: 112px minmax(140px, 1fr) 112px minmax(140px, 1fr) !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 42px !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair::before,
      html body .page-content .profile-info-row.urppp-dual-pair::after,
      .profile-info-row.urppp-dual-pair::before,
      .profile-info-row.urppp-dual-pair::after {
        content: none !important;
        display: none !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair > .profile-info-name,
      .profile-info-row.urppp-dual-pair > .profile-info-name {
        float: none !important;
        clear: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 10px 12px !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        text-align: right !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair > .profile-info-value,
      .profile-info-row.urppp-dual-pair > .profile-info-value {
        float: none !important;
        clear: none !important;
        display: flex !important;
        align-items: center !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        margin-left: 0 !important;
        padding: 8px 12px !important;
        min-height: 42px !important;
        box-sizing: border-box !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
        white-space: normal !important;
      }
      /* 学籍信息卡圆角：必须 hidden 才能裁切 */
      html body .page-content .profile-user-info.setLabelWidth,
      html body .page-content .profile-user-info-striped.setLabelWidth,
      .profile-user-info.setLabelWidth,
      .profile-user-info-striped.setLabelWidth {
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        box-shadow: none !important;
      }
      html body .page-content .col-xs-4 > .profile-user-info.setLabelWidth,
      html body .page-content .col-xs-8 > .profile-user-info.setLabelWidth,
      html body .page-content .col-xs-4 > .profile-user-info-striped.setLabelWidth,
      html body .page-content .col-xs-8 > .profile-user-info-striped.setLabelWidth {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 12px !important;
        overflow: hidden !important;
      }
      /* 查询 pair 内的 value 绝不能 margin-left:140px */
      .urppp-query-pair .profile-info-value,
      .profile-info-row.urppp-query-row .profile-info-value {
        margin-left: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: none !important;
      }
      .urppp-query-pair .profile-info-name,
      .profile-info-row.urppp-query-row .profile-info-name {
        float: none !important;
        width: 84px !important;
        min-width: 84px !important;
        max-width: none !important;
        margin: 0 !important;
        border-right: none !important;
        background: transparent !important;
      }

      /* 查询条件：JS 包成 pair 后用 flex 横排（彻底摆脱 float 打架） */
      .profile-user-info.urppp-query-form,
      .profile-user-info.self.urppp-query-form,
      .profile-user-info-striped.self.urppp-query-form {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        background: var(--surface) !important;
        padding: 12px 14px 6px !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .page-content .profile-info-row.urppp-query-row,
      .profile-user-info.urppp-query-form .profile-info-row.urppp-query-row,
      .profile-info-row.urppp-query-row {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        column-gap: 14px !important;
        row-gap: 10px !important;
        align-items: center !important;
        border-bottom: none !important;
        min-height: 0 !important;
        padding: 2px 0 8px !important;
        margin: 0 !important;
        overflow: visible !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      /* 按本行 pair 数动态列数，避免 4 字段硬套 3 列留下空洞 */
      .profile-info-row.urppp-query-row[data-urppp-query-cols="1"] {
        grid-template-columns: minmax(0, 1fr) !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="2"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="3"] {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="4"] {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row:before,
      .profile-info-row.urppp-query-row:after,
      .page-content .profile-info-row.urppp-query-row:before,
      .page-content .profile-info-row.urppp-query-row:after {
        content: none !important;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        clear: none !important;
      }
      .page-content .urppp-query-pair,
      .profile-user-info.urppp-query-form .urppp-query-pair,
      .urppp-query-pair {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        flex: none !important;
        box-sizing: border-box !important;
        float: none !important;
        clear: none !important;
        margin: 0 !important;
      }
      .urppp-query-pair .profile-info-name {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex: 0 0 84px !important;
        width: 84px !important;
        min-width: 84px !important;
        max-width: 84px !important;
        height: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        padding: 0 8px 0 0 !important;
        background: transparent !important;
        border: none !important;
        border-right: none !important;
        text-align: right !important;
        line-height: 1.3 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .profile-info-value {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        margin-left: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .profile-info-value > input,
      .urppp-query-pair .profile-info-value > select:not(.urppp-chosen-hidden):not(.chzn-done):not(.chosen),
      .urppp-query-pair .profile-info-value > .form-control:not(select.urppp-chosen-hidden),
      .urppp-query-pair .profile-info-value > .chosen-container,
      .urppp-query-pair .value_element:not(select.urppp-chosen-hidden):not(select.chzn-done),
      .urppp-query-pair input.value_element,
      .urppp-query-pair select.value_element:not(.urppp-chosen-hidden):not(.chzn-done):not(.chosen) {
        display: block !important;
        float: none !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .chosen-container,
      .urppp-query-pair .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        top: 0 !important;
        height: 34px !important;
        position: relative !important;
      }
      .urppp-query-pair .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 34px !important;
        padding: 0 28px 0 10px !important;
        display: flex !important;
        align-items: center !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .chosen-single span {
        display: block !important;
        line-height: normal !important;
        margin-right: 22px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .urppp-query-pair .chosen-single div {
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        width: 26px !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .urppp-query-pair .chosen-single div b {
        display: block !important;
        width: 12px !important;
        height: 12px !important;
        margin: 0 !important;
        background-position: 0 0 !important;
      }

      /* Chosen 启用后隐藏原生 select，避免双层/撑破布局 */
      .urppp-query-pair select.chosen,
      .urppp-query-pair select.value_element.chosen,
      .urppp-query-pair select.urppp-chosen-hidden,
      .urppp-query-pair .chosen-container + select,
      .urppp-query-pair select + .chosen-container + select,
      .urppp-query-pair select.chzn-done,
      .profile-user-info select.urppp-chosen-hidden,
      .profile-user-info select.chzn-done,
      .profile-user-info select.chosen,
      .profile-user-info.urppp-query-form select.chosen,
      .profile-user-info.urppp-query-form select.urppp-chosen-hidden,
      .profile-user-info.urppp-query-form .chosen-container + select,
      .profile-info-value > select.urppp-chosen-hidden,
      .profile-info-value > select.chzn-done,
      select.urppp-chosen-hidden {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        position: absolute !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
      }
      .urppp-query-pair .chosen-container {
        display: block !important;
      }
      @media (max-width: 1200px) {
        .profile-info-row.urppp-query-row[data-urppp-query-cols="4"],
        .profile-info-row.urppp-query-row[data-urppp-query-cols="3"] {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      @media (max-width: 700px) {
        .profile-info-row.urppp-query-row {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      }

      /* 查询 pair：最后覆盖 commoncss / 旧规则的 150px 固定宽 */
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-container,
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-container-single,
      .profile-user-info.urppp-query-form .urppp-query-pair .value_element,
      .profile-user-info.urppp-query-form .urppp-query-pair input,
      .profile-user-info.urppp-query-form .urppp-query-pair select,
      .profile-user-info.urppp-query-form .urppp-query-pair .form-control,
      .urppp-query-pair .chosen-container,
      .urppp-query-pair .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-single {
        width: 100% !important;
        max-width: none !important;
      }

      /* 通用控件高度（学籍等单对结构） */
      .profile-info-value > input,
      .profile-info-value > select,
      .profile-info-value > textarea,
      .profile-info-value > .form-control,
      .profile-info-value > .chosen-container,
      .profile-info-value input.form-control,
      .profile-info-value select.form-control {
        margin: 0 !important;
        vertical-align: middle !important;
      }
      .profile-info-value .chosen-container {
        display: block !important;
        width: 100% !important;
        max-width: 360px !important;
        top: 0 !important;
      }
      .profile-info-value .chosen-container .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 32px !important;
        display: block !important;
        padding: 0 30px 0 12px !important;
      }
      .profile-info-value select,
      .profile-info-value input[type="text"],
      .profile-info-value input[type="number"],
      .profile-info-value input:not([type]) {
        width: 100% !important;
        max-width: 360px !important;
        height: 34px !important;
        min-height: 34px !important;
        line-height: 1.35 !important;
      }
      /* 学籍/个人头像：固定小尺寸 + 圆角（覆盖内联 width/height） */
      #avatar,
      .profile-picture img,
      img.editable.img-responsive,
      .page-content img#avatar {
        width: 96px !important;
        max-width: 96px !important;
        height: 118px !important;
        object-fit: cover !important;
        border-radius: 12px !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
      }
      .profile-picture {
        display: block !important;
        width: 96px !important;
        max-width: 96px !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        line-height: 0 !important;
        background: var(--surface) !important;
      }

      /* 学籍页常见布局：列间距与对齐 */
      .page-content .row + .row { margin-top: 8px !important; }
      .page-content .widget-container-col,
      .page-content .col-xs-12,
      .page-content .col-sm-6,
      .page-content .col-md-6,
      .page-content .col-lg-6 {
        margin-bottom: 8px !important;
      }
      legend {
        color: var(--text) !important;
        border-bottom: 1px solid var(--border) !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        padding-bottom: 8px !important;
        margin-bottom: 14px !important;
        width: 100% !important;
      }
      fieldset {
        padding: 16px 18px !important;
        margin-bottom: 18px !important;
      }

      /* 表格：外框交给 wrapper，表格本身只负责内部网格 */
      .urppp-table-wrap {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        overflow: auto !important;
        background: var(--surface) !important;
        margin: 0 0 8px !important;
      }
      .table, .table-bordered, .table-striped, .table-hover, .dataTable {
        background: var(--surface) !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        color: var(--text) !important;
        border-collapse: collapse !important;
        margin-bottom: 0 !important;
        width: 100% !important;
      }
      /* 只画 right/bottom，top/left 由 wrapper 提供，避免与 Bootstrap thead border-top:0 冲突 */
      .table > thead > tr > th, .table-bordered > thead > tr > th, .dataTable > thead > tr > th,
      .table > tbody > tr > th, .table > tbody > tr > td,
      .table-bordered > tbody > tr > td, .dataTable > tbody > tr > td,
      .table > tfoot > tr > th, .table > tfoot > tr > td {
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-bottom: 1px solid var(--border) !important;
        color: var(--text) !important;
        padding: 10px 12px !important;
        font-size: 13px !important;
        vertical-align: middle !important;
      }
      .table > thead > tr > th:last-child,
      .table > tbody > tr > td:last-child,
      .table > tbody > tr > th:last-child,
      .table > tfoot > tr > th:last-child,
      .table > tfoot > tr > td:last-child,
      .table-bordered > thead > tr > th:last-child,
      .table-bordered > tbody > tr > td:last-child {
        border-right: none !important;
      }
      .table > tbody > tr:last-child > td,
      .table > tbody > tr:last-child > th,
      .table > tfoot > tr:last-child > td,
      .table > tfoot > tr:last-child > th,
      .table-bordered > tbody > tr:last-child > td {
        border-bottom: none !important;
      }
      .table > thead > tr > th, .table-bordered > thead > tr > th, .dataTable > thead > tr > th {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
      }
      .table > tbody > tr,
      .table > tbody > tr > td,
      .table > tbody > tr > th,
      .table-bordered > tbody > tr,
      .table-bordered > tbody > tr > td,
      .dataTable > tbody > tr,
      .dataTable > tbody > tr > td {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
      }
      .table-striped > tbody > tr:nth-of-type(odd),
      .table-striped > tbody > tr:nth-of-type(odd) > td,
      .table-striped > tbody > tr:nth-of-type(odd) > th,
      .dataTable > tbody > tr:nth-of-type(odd),
      .dataTable > tbody > tr:nth-of-type(odd) > td,
      .dataTable > tbody > tr:nth-of-type(odd) > th {
        background: var(--bg) !important;
        background-color: var(--bg) !important;
      }
      .table-hover > tbody > tr:not(.urppp-notice-row):hover,
      .table-hover > tbody > tr:not(.urppp-notice-row):hover > td,
      .table-hover > tbody > tr:not(.urppp-notice-row):hover > th,
      .table-hover > tbody > tr.hover:not(.urppp-notice-row),
      .table-hover > tbody > tr.hover:not(.urppp-notice-row) > td,
      .dataTable > tbody > tr:hover,
      .dataTable > tbody > tr:hover > td {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      /* 公告卡片：不受 table-hover / ACE hover 类影响 */
      table.urppp-notice-table.table-hover > tbody > tr,
      table.urppp-notice-table.table-hover > tbody > tr:hover,
      table.urppp-notice-table.table-hover > tbody > tr.hover,
      table.urppp-notice-table > tbody > tr.urppp-notice-row,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
      }
      table.urppp-notice-table.table-hover > tbody > tr > td,
      table.urppp-notice-table.table-hover > tbody > tr:hover > td,
      table.urppp-notice-table.table-hover > tbody > tr.hover > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover > td {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* ============================================================
      /* ============================================================
      /* ============================================================
       * 评估公告 / 通知列表：紧凑卡片，日期在卡内右侧
       * ============================================================ */
      table.urppp-notice-table,
      .page-content table.urppp-notice-table,
      .urppp-table-wrap.urppp-notice-wrap,
      .urppp-table-wrap:has(table.urppp-notice-table) {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
        border-radius: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      table.urppp-notice-table > tbody,
      table.urppp-notice-table > thead,
      table.urppp-notice-table > tfoot {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row,
      table.urppp-notice-table > tbody > tr {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 0 10px !important;
        padding: 12px 18px !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
        position: relative !important;
        overflow: hidden !important;
        transition: border-color .15s ease, box-shadow .15s ease !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover {
        border-color: color-mix(in srgb, var(--primary) 35%, var(--border)) !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08) !important;
      }
      table.urppp-notice-table > tbody > tr > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover > td {
        display: block !important;
        border: none !important;
        background: transparent !important;
        background-color: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        vertical-align: middle !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        float: none !important;
        position: static !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-bullet-cell {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 !important;
        flex: 0 0 0 !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        max-width: none !important;
        width: auto !important;
        position: static !important;
        order: 1 !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell::before {
        content: '' !important;
        display: block !important;
        width: 7px !important;
        height: 7px !important;
        min-width: 7px !important;
        border-radius: 50% !important;
        background: var(--primary) !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }
      table.urppp-notice-table .urppp-notice-link,
      table.urppp-notice-table a.urppp-notice-link,
      table.urppp-notice-table td.urppp-notice-title-cell a,
      table.urppp-notice-table td.urppp-notice-title-cell a:link,
      table.urppp-notice-table td.urppp-notice-title-cell a:visited,
      table.urppp-notice-table a {
        color: var(--text) !important;
        text-decoration: none !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        border: none !important;
        background: transparent !important;
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        position: relative !important;
        z-index: 3 !important;
        display: inline !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row,
      table.urppp-notice-table td.urppp-notice-title-cell {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      /* ::before 圆点不拦截点击 */
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell::before {
        pointer-events: none !important;
      }
      table.urppp-notice-table .urppp-notice-link:hover,
      table.urppp-notice-table td.urppp-notice-title-cell a:hover {
        color: var(--primary) !important;
      }
      table.urppp-notice-table td.urppp-notice-date-cell {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex: 0 0 auto !important;
        width: auto !important;
        max-width: none !important;
        white-space: nowrap !important;
        text-align: right !important;
        order: 2 !important;
        margin-left: auto !important;
        float: none !important;
        position: static !important;
        right: auto !important;
        left: auto !important;
      }
      .urppp-notice-time {
        display: inline-flex !important;
        align-items: center !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
        color: var(--text-muted) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        border-radius: 999px !important;
        padding: 4px 10px !important;
        white-space: nowrap !important;
        position: static !important;
        float: none !important;
      }
      .urppp-notice-card {
        display: block !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        padding: 16px 18px 14px !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }
      .urppp-notice-card-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
        padding: 12px 16px !important;
        max-width: 100% !important;
      }
      .urppp-notice-card-row .urppp-notice-main {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }
      .urppp-notice-card-row .urppp-notice-main::before {
        content: '' !important;
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      .urppp-notice-title {
        display: block !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        line-height: 1.45 !important;
        color: var(--text) !important;
        margin: 0 0 8px !important;
      }
      .urppp-notice-body {
        display: block !important;
        font-size: 14px !important;
        line-height: 1.75 !important;
        color: var(--text) !important;
        margin: 0 0 10px !important;
        white-space: pre-wrap !important;
      }
      .urppp-notice-meta {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: center !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }
      table.urppp-notice-table a,
      table.urppp-notice-table a:link,
      table.urppp-notice-table a:visited {
        color: var(--text) !important;
        text-decoration: none !important;
      }
      table.urppp-notice-table a:hover {
        color: var(--primary) !important;
      }
      /* 按钮 */
      .btn, .btn.btn-xs, .btn.btn-sm, .btn.btn-lg, .btn.btn-minier,
      .btn-group .btn, .btn-group > .btn, .input-group .btn, .btn-toolbar .btn,
      .btn-app {
        border-radius: 6px !important;
      }
      /* 分页「确定」：禁止全局 .btn 的 display:inline-flex 盖掉 display:none */
      #urppagebar [id^="btn_turnpageto_"].btn,
      #urppagebar input.btn[id^="btn_turnpageto_"],
      body #urppagebar .btn[id^="btn_turnpageto_"] {
        /* display 留给内联 style / 站点 JS；只定尺寸 */
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        min-width: 56px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
      }
      #urppagebar [id^="btn_turnpageto_"][style*="display: none"],
      #urppagebar [id^="btn_turnpageto_"][style*="display:none"],
      body #urppagebar .btn[id^="btn_turnpageto_"][style*="display: none"],
      body #urppagebar .btn[id^="btn_turnpageto_"][style*="display:none"] {
        display: none !important;
      }
      .btn:not(.btn-app), .btn.btn-xs:not(.btn-app), .btn.btn-sm:not(.btn-app), .btn.btn-lg:not(.btn-app), .btn.btn-minier:not(.btn-app),
      .btn.btn-round:not(.btn-app), .btn.btn-white:not(.btn-app), .btn.btn-info:not(.btn-app), .btn.btn-bold:not(.btn-app) {
        font-size: 12px !important;
        line-height: 1 !important;
        padding: 0 12px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
        transition: all .15s ease !important;
      }
      /* 分页「确定」：用更高优先级盖过全局 .btn display:inline-flex */
      #urppagebar .btn.urppp-page-confirm,
      #urppagebar button.urppp-page-confirm,
      #urppagebar a.btn.urppp-page-confirm,
      #urppagebar input.urppp-page-confirm,
      .urppagebreak .btn.urppp-page-confirm,
      .urppagebreak button.urppp-page-confirm,
      body #urppagebar .urppp-page-confirm {
        display: none !important;
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        min-width: 52px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
      }
      #urppagebar .btn.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar button.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar a.btn.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar input.urppp-page-confirm.urppp-page-confirm-show,
      .urppagebreak .btn.urppp-page-confirm.urppp-page-confirm-show,
      body #urppagebar .urppp-page-confirm.urppp-page-confirm-show {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .btn:not(.btn-app) > .ace-icon,
      .btn:not(.btn-app) > .fa,
      .btn:not(.btn-app) > .glyphicon {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        margin: 0 !important;
        position: static !important;
        top: auto !important;
        vertical-align: middle !important;
      }
      .btn.btn-xs:not(.btn-app) {
        height: 26px !important;
        min-height: 26px !important;
        max-height: 26px !important;
        padding: 0 10px !important;
        font-size: 12px !important;
      }
      /* 首页/应用方块按钮：独立尺寸，不受 28px 限制 */
      .btn.btn-app,
      a.btn-app,
      button.btn-app {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        width: 90px !important;
        min-width: 90px !important;
        padding: 10px 8px !important;
        line-height: 1.25 !important;
        font-size: 12px !important;
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        white-space: normal !important;
        text-align: center !important;
        vertical-align: top !important;
      }
      .btn.btn-app > .ace-icon,
      .btn.btn-app > .fa,
      .btn.btn-app > .glyphicon,
      a.btn-app > .ace-icon,
      a.btn-app > .fa {
        display: block !important;
        margin: 0 0 2px !important;
        font-size: 24px !important;
        line-height: 1 !important;
        width: auto !important;
        height: auto !important;
      }
            .btn:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .btn:active,
      .btn.active,
      .btn:focus,
      .btn:focus-visible {
        transform: translateY(0) !important;
        outline: none !important;
      }
      .btn-primary, .btn-info {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        border-radius: 6px !important;
      }
      .btn-primary:hover, .btn-info:hover,
      .btn-primary:focus, .btn-info:focus,
      .btn-primary:active, .btn-info:active,
      .btn-primary.active, .btn-info.active,
      .btn-primary:active:focus, .btn-info:active:focus,
      .btn-primary:active:hover, .btn-info:active:hover,
      .open > .dropdown-toggle.btn-primary,
      .open > .dropdown-toggle.btn-info {
        background: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      .btn-success {
        background: #22c55e !important;
        border-color: #22c55e !important;
        color: #fff !important;
        border-radius: 6px !important;
      }
      .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active,
      .btn-success:active:focus, .btn-success:active:hover {
        background: #16a34a !important;
        border-color: #16a34a !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px rgba(34,197,94,0.25) !important;
      }
      .btn-warning {
        background: #f59e0b !important;
        border-color: #f59e0b !important;
        color: #fff !important;
        border-radius: 6px !important;
      }
      .btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning.active,
      .btn-warning:active:focus, .btn-warning:active:hover {
        background: #d97706 !important;
        border-color: #d97706 !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px rgba(245,158,11,0.25) !important;
      }
      .btn-danger {
        background: #ef4444 !important;
        border-color: #ef4444 !important;
        color: #fff !important;
        border-radius: 6px !important;
      }
      .btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger.active,
      .btn-danger:active:focus, .btn-danger:active:hover {
        background: #dc2626 !important;
        border-color: #dc2626 !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px rgba(239,68,68,0.25) !important;
      }
      .btn-default, .btn-white {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        border-radius: 6px !important;
      }
      .btn-default:hover, .btn-white:hover,
      .btn-default:focus, .btn-white:focus,
      .btn-default:active, .btn-white:active,
      .btn-default.active, .btn-white.active,
      .btn-default:active:focus, .btn-white:active:focus {
        background: color-mix(in srgb, var(--primary) 10%, var(--input-bg)) !important;
        border-color: var(--primary) !important;
        color: var(--text) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      .btn-link:active, .btn-link:focus, .btn-link.active {
        color: var(--primary-hover) !important;
      }
      /* 紫色等站点自定义按钮：点击态也贴主题 */
      .btn-purple, .btn.btn-purple {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      .btn-purple:hover, .btn-purple:focus, .btn-purple:active, .btn-purple.active,
      .btn.btn-purple:hover, .btn.btn-purple:focus, .btn.btn-purple:active {
        background: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
/* btn-app 必须压过 .btn-info 实心蓝，否则可申请业务页仍是 ACE 蓝块 */
      .btn-app,
      .btn.btn-app,
      a.btn-app,
      button.btn-app,
      .btn.btn-app.btn-info,
      .btn.btn-app.btn-primary,
      .btn.btn-app.btn-success,
      .btn.btn-app.btn-warning,
      .btn.btn-app.btn-danger,
      a.btn.btn-app.btn-info,
      a.btn.btn-app.btn-primary,
      button.btn.btn-app.btn-info {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: 12px !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .btn-app:hover,
      .btn.btn-app:hover,
      a.btn-app:hover,
      button.btn-app:hover,
      .btn.btn-app.btn-info:hover,
      .btn.btn-app.btn-primary:hover,
      a.btn.btn-app.btn-info:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 28%, transparent) !important;
        transform: translateY(-2px) !important;
      }
      .btn-app > .ace-icon,
      .btn-app > .fa,
      .btn-app > .glyphicon,
      .btn.btn-app > .ace-icon,
      .btn.btn-app > .fa,
      a.btn-app > .fa,
      a.btn-app > .ace-icon {
        color: var(--primary) !important;
      }
      .btn-app:hover > .ace-icon,
      .btn-app:hover > .fa,
      .btn-app:hover > .glyphicon,
      .btn.btn-app:hover > .ace-icon,
      .btn.btn-app:hover > .fa,
      a.btn-app:hover > .fa {
        color: #fff !important;
      }
      /* 可申请业务等页：大按钮容器横排换行 */
      .page-content .widget-main:has(> .btn-app),
      .page-content .widget-body .widget-main:has(.btn-app),
      .page-content #personalApplication,
      .page-content .tab-content .widget-main:has(.btn-app),
      .page-content .tab-pane:has(.btn-app) {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        align-content: flex-start !important;
      }
      .page-content .btn.btn-app,
      .page-content a.btn-app,
      .page-content button.btn-app {
        width: 104px !important;
        min-width: 104px !important;
        height: 100px !important;
        min-height: 100px !important;
        margin: 0 !important;
        padding: 12px 10px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        line-height: 1.3 !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
      }
      .page-content .btn.btn-app:hover,
      .page-content a.btn-app:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      .page-content .btn.btn-app > .ace-icon,
      .page-content .btn.btn-app > .fa,
      .page-content a.btn-app > .fa,
      .page-content a.btn-app > .ace-icon {
        display: block !important;
        margin: 0 0 8px !important;
        font-size: 28px !important;
        line-height: 1 !important;
        color: var(--primary) !important;
      }
      .page-content .btn.btn-app:hover > .ace-icon,
      .page-content .btn.btn-app:hover > .fa,
      .page-content a.btn-app:hover > .fa {
        color: #fff !important;
      }

      /* 表单：统一圆角；select 单独控制，避免小宽度分页下拉文字被 padding 截断 */
      input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="hidden"]):not([type="image"]):not([type="submit"]):not([type="button"]):not([type="reset"]),
      textarea,
      .form-control:not(select),
      .input-icon > input,
      .input-group .form-control:not(select),
      .chosen-single,
      .chosen-choices,
      .ace-spinner .input-group,
      .tags,
      .bootstrap-tagsinput,
      .editable-input input,
      .editable-input textarea {
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: 8px !important;
        padding: 6px 12px !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        height: auto !important;
        min-height: 32px !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
      }
      select,
      select.form-control,
      .editable-input select {
        background-color: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: 8px !important;
        padding: 4px 8px !important;
        font-size: 13px !important;
        line-height: 1.35 !important;
        height: 32px !important;
        min-height: 32px !important;
        max-width: 100% !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
        text-overflow: ellipsis !important;
      }
      /* 分页/每页条数：不截断，不强制压扁 */
      .urppagebreak select,
      .urppagebreak #pagesize,
      #urppagebar select,
      select#pagesize,
      .pagination select,
      .dataTables_length select {
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 28px !important;
        min-height: 28px !important;
        padding: 2px 6px !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        border-radius: 6px !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
        background-image: none !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }
      /* ============================================================
       * 分页（pagination.js 真实结构）
       * ul.pagination > li.paginate_button > span[padding:3px 7px]
       * 当前页 li.active；确定 #btn_turnpageto_* focus 显示
       * ============================================================ */
      #urppagebar,
      #urppagebar.urppp-pagebar {
        display: block !important;
        width: 100% !important;
        margin-top: 10px !important;
        line-height: 36px !important;
        box-sizing: border-box !important;
      }
      #urppagebar .dataTables_paginate,
      #urppagebar [id^="sample-table-2_paginate_"] {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 8px 10px !important;
        position: relative !important;
        width: 100% !important;
      }
      /* 清掉旧 pagination 全局小按钮样式在页码条上的影响 */
      #urppagebar ul.pagination,
      #urppagebar ul.urppp-pagination {
        display: inline-flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 4px !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
        float: none !important;
        position: static !important;
        border: none !important;
        background: transparent !important;
      }
      #urppagebar ul.pagination > li,
      #urppagebar .paginate_button,
      #urppagebar .urppp-page-li {
        display: inline-flex !important;
        float: none !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        list-style: none !important;
      }
      /* 真正的可点 chip = 内层 span（站点写死 padding:3px 7px，必须覆盖） */
      #urppagebar ul.pagination > li > span,
      #urppagebar ul.pagination > li > a,
      #urppagebar .paginate_button > span,
      #urppagebar .paginate_button > a,
      #urppagebar .urppp-page-chip,
      body #urppagebar .pagination > li > span,
      body #urppagebar .pagination > li > a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        float: none !important;
        position: static !important;
        box-sizing: border-box !important;
        width: auto !important;
        min-width: 40px !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        padding: 0 12px !important;
        margin: 0 !important;
        line-height: 36px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        border: 1px solid var(--border) !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        cursor: pointer !important;
      }
      #urppagebar ul.pagination > li.previous > span,
      #urppagebar ul.pagination > li.next > span,
      #urppagebar .urppp-page-chip-nav {
        min-width: 72px !important;
      }
      /* 当前页 */
      #urppagebar ul.pagination > li.active > span,
      #urppagebar ul.pagination > li.active > a,
      #urppagebar .paginate_button.active > span,
      #urppagebar .urppp-page-chip-active,
      body #urppagebar .pagination > li.active > span,
      body #urppagebar .pagination > li.active > a {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
      }
      /* 禁用 */
      #urppagebar ul.pagination > li.disabled > span,
      #urppagebar .urppp-page-chip-disabled {
        color: var(--text-muted) !important;
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
        cursor: default !important;
        opacity: 0.75 !important;
      }
      #urppagebar ul.pagination > li > span:hover,
      #urppagebar ul.pagination > li.pagebarhand > span:hover {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
      }
      #urppagebar ul.pagination > li.active > span:hover {
        color: #fff !important;
        border-color: var(--primary) !important;
      }
      /* 跳转输入 + 确定：流式排列，确定默认隐藏 */
      #urppagebar [id^="turnpageto_"],
      #urppagebar input.urppp-page-goto {
        display: inline-block !important;
        position: static !important;
        height: 36px !important;
        width: 48px !important;
        margin: 0 4px !important;
        padding: 4px 8px !important;
        font-size: 14px !important;
        line-height: 1.2 !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }
      #urppagebar [id^="btn_turnpageto_"],
      #urppagebar .urppp-page-confirm {
        position: static !important;
        left: auto !important;
        top: auto !important;
        height: 36px !important;
        min-width: 56px !important;
        margin: 0 4px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
        line-height: 1 !important;
        vertical-align: middle !important;
        float: none !important;
      }
      /* 站点默认 display:none；focus 时 inline-block —— 不要用全局 .btn 盖掉 none */
      #urppagebar [id^="btn_turnpageto_"][style*="display: none"],
      #urppagebar [id^="btn_turnpageto_"][style*="display:none"] {
        display: none !important;
      }
      #urppagebar [id^="btn_turnpageto_"][style*="inline-block"],
      #urppagebar [id^="btn_turnpageto_"][style*="inline-flex"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      /* 每页条数 */
      #urppagebar select[id^="pagination_pageSize_"],
      #urppagebar select {
        height: 36px !important;
        min-height: 36px !important;
        width: auto !important;
        min-width: 64px !important;
        max-width: none !important;
        padding: 2px 8px !important;
        font-size: 13px !important;
        vertical-align: middle !important;
        border-radius: 8px !important;
      }
      #urppagebar [id^="totalPage_show_"],
      #urppagebar [id^="span_page_txt_"] {
        display: inline !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        height: auto !important;
        line-height: 36px !important;
        font-size: 13px !important;
        color: var(--text-secondary, var(--text-muted)) !important;
      }
      /* 兼容旧 class 名（若残留） */
      .urppagebreak {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 6px 8px !important;
      }
      textarea {
        resize: vertical !important;
        min-height: 80px !important;
        padding: 10px 12px !important;
      }
      input[type="checkbox"], input[type="radio"] {
        border-radius: 4px !important;
        width: 15px !important;
        height: 15px !important;
        min-height: 0 !important;
        padding: 0 !important;
        accent-color: var(--primary) !important;
      }
      .input-group {
        border-radius: 8px !important;
      }
      .input-group .form-control {
        border-radius: 8px 0 0 8px !important;
      }
      .input-group .form-control:last-child,
      .input-group-btn:last-child > .btn {
        border-radius: 0 8px 8px 0 !important;
      }
      .input-group-addon {
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text-secondary) !important;
        border-radius: 8px !important;
      }
      .chosen-single, .chosen-choices {
        min-height: 34px !important;
        line-height: 34px !important;
        padding: 0 30px 0 12px !important;
        border-radius: 8px !important;
        box-sizing: border-box !important;
      }
      .chosen-single {
        display: block !important;
        height: 34px !important;
        position: relative !important;
      }
      .chosen-single span {
        display: block !important;
        margin-right: 26px !important;
        line-height: normal !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      /*
       * commoncss 原文：
       * .self div.profile-info-value a.chosen-single > span { line-height: 25px !important; }
       * 必须用同等或更高 specificity 才能压过
       */
      .self div.profile-info-value a.chosen-single > span,
      .self .profile-info-value a.chosen-single > span,
      .profile-user-info.self div.profile-info-value a.chosen-single > span,
      .profile-user-info.self .profile-info-value a.chosen-single > span,
      .urppp-query-form .urppp-query-pair .profile-info-value a.chosen-single > span,
      .urppp-query-pair .profile-info-value a.chosen-single > span,
      body .self div.profile-info-value a.chosen-single > span,
      html body .self div.profile-info-value a.chosen-single > span {
        line-height: normal !important;
        height: auto !important;
        margin: 0 26px 0 0 !important;
        padding: 0 !important;
        vertical-align: middle !important;
        display: block !important;
      }
      .self div.profile-info-value a.chosen-single,
      .profile-user-info.self .profile-info-value a.chosen-single,
      .urppp-query-pair a.chosen-single,
      body .self div.profile-info-value a.chosen-single,
      html body .chosen-container a.chosen-single {
        display: flex !important;
        align-items: center !important;
        height: 34px !important;
        min-height: 34px !important;
        line-height: normal !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        box-sizing: border-box !important;
      }
      .chosen-single div,
      .chosen-container-single .chosen-single div,
      body .chosen-container-single .chosen-single div,
      .urppp-query-pair .chosen-single div,
      .self .chosen-single div {
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        width: 28px !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      /* 不用猜 sprite 偏移：把 b 变成居中盒子，背景图放中心 */
      .chosen-single div b,
      .chosen-container-single .chosen-single div b,
      body .chosen-container-single .chosen-single div b,
      .urppp-query-pair .chosen-single div b,
      .self .chosen-single div b {
        display: block !important;
        width: 14px !important;
        height: 14px !important;
        margin: 0 !important;
        padding: 0 !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: 12px 12px !important;
      }
      .chosen-container {
        height: auto !important;
        min-height: 34px !important;
        vertical-align: middle !important;
        position: relative !important;
        box-sizing: border-box !important;
        font-size: 13px !important;
      }
      .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }
      .chosen-drop {
        position: absolute !important;
        top: calc(100% + 6px) !important; /* 下移，避免挡住触发框 */
        left: 0 !important;
        z-index: 1010 !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        background: var(--surface) !important;
        border-color: var(--border) !important;
        box-shadow: var(--shadow) !important;
        margin-top: 0 !important;
        /* 不要写 display:block，否则关闭态也会一直露出来 */
      }
      .chosen-container.chosen-with-drop .chosen-drop,
      .chosen-container-active.chosen-with-drop .chosen-drop {
        top: calc(100% + 6px) !important;
      }

      /* ============================================================
       * 空闲教室查询：右侧楼栋列表 #drag-ul
       * 一体式实心列表；高度随内容；当前项实色高亮
       * ============================================================ */
      #xq-section,
      #xq-section:has(#drag-ul) {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        align-self: flex-start !important;
      }
      /* 空列表 / 空容器不占位 */
      #drag-ul:empty,
      #xq-section:empty,
      #xq-section:not(:has(li)),
      #drag-ul.urppp-empty {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        overflow: hidden !important;
      }
      #drag-ul,
      #drag-ul.urppp-drag-ul,
      #xq-section #drag-ul {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        background: var(--surface) !important;
        border: none !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
      /* 清掉站点 #drag-ul .border-common 的 float/固定宽高 */
      #drag-ul > li,
      #drag-ul > li.border-common,
      #drag-ul > li.ui-selectee,
      #drag-ul > li.jc-future,
      #drag-ul .border-common,
      #xq-section #drag-ul > li,
      #xq-section #drag-ul .border-common {
        float: none !important;
        clear: both !important;
        display: block !important;
        list-style: none !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        margin: 0 !important;
        padding: 0 12px !important;
        line-height: 36px !important;
        border: none !important;
        border-bottom: 1px solid var(--border) !important;
        border-left: 3px solid transparent !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        text-align: left !important;
        cursor: pointer !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        opacity: 1 !important;
        transition: background .12s ease, color .12s ease, border-color .12s ease !important;
      }
      #drag-ul > li:last-child,
      #xq-section #drag-ul > li:last-child {
        border-bottom: none !important;
      }
      /* 校区标题（若有） */
      #drag-ul > li.xq-section,
      #xq-section #drag-ul > li.xq-section {
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        line-height: 32px !important;
        padding: 0 12px !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary, var(--text-muted)) !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        cursor: default !important;
        border-bottom: 1px solid var(--border) !important;
        border-left-color: transparent !important;
      }
      #drag-ul > li.ui-selectee:hover,
      #drag-ul > li.border-common:hover,
      #drag-ul .border-common:hover,
      #xq-section #drag-ul > li:not(.xq-section):not(.jc-future):hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        border-left-color: var(--primary) !important;
      }
      /* 当前选中：实色高亮，一眼能认 */
      #drag-ul > li.ui-selecting,
      #drag-ul > li.ui-selected,
      #drag-ul > li.urppp-building-active,
      #xq-section #drag-ul > li.ui-selected,
      #xq-section #drag-ul > li.urppp-building-active,
      body #drag-ul > li.ui-selected,
      body #drag-ul > li.urppp-building-active {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 600 !important;
        border-left-color: var(--primary) !important;
        border-bottom-color: transparent !important;
      }
      #drag-ul > li.ui-selected:hover,
      #drag-ul > li.urppp-building-active:hover {
        background: var(--primary) !important;
        color: #fff !important;
      }
      /* 不可选：仍实心，弱化文字即可 */
      #drag-ul > li.jc-future,
      #xq-section #drag-ul > li.jc-future {
        color: var(--text-muted) !important;
        background: var(--surface) !important;
        cursor: default !important;
        opacity: 1 !important;
        border-left-color: transparent !important;
      }
      #drag-ul > li.jc-future:hover,
      #xq-section #drag-ul > li.jc-future:hover {
        background: var(--surface) !important;
        color: var(--text-muted) !important;
      }
      /* 覆盖站点 today.css 等对 .border-common 的固定宽高 */
      body #drag-ul .border-common,
      html body #xq-section #drag-ul .border-common {
        width: 100% !important;
        height: 36px !important;
        line-height: 36px !important;
        float: none !important;
        text-align: left !important;
        border: none !important;
        border-bottom: 1px solid var(--border) !important;
        border-left: 3px solid transparent !important;
        background: var(--surface) !important;
      }
      body #drag-ul .border-common.ui-selected,
      body #drag-ul .border-common.urppp-building-active {
        background: var(--primary) !important;
        color: #fff !important;
        border-left-color: var(--primary) !important;
      }

      /* ============================================================
       * 空闲教室：节次选择 #drag-ol（1-12）
       * ============================================================ */
      #drag-area,
      #drag-section {
        background: transparent !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      #drag-ol,
      ol#drag-ol {
        list-style: none !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: stretch !important;
        gap: 0 !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      /* 压过 today.css: #drag-ol .border-common {width:35/50px;height:30px;float:left;border:1px solid #aaa} */
      #drag-ol > li,
      #drag-ol > li.border-common,
      #drag-ol .border-common,
      ol#drag-ol > li.border-common,
      body #drag-ol .border-common,
      html body #drag-ol li.border-common {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        list-style: none !important;
        width: 40px !important;
        min-width: 40px !important;
        max-width: 48px !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 34px !important;
        text-align: center !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        user-select: none !important;
        transition: background .12s ease, color .12s ease !important;
      }
      #drag-ol > li:last-child,
      #drag-ol > li.drag-border-right,
      #drag-ol .border-common:last-child {
        border-right: none !important;
      }
      /* 已过节次：明显弱化，和可选区分开 */
      #drag-ol > li.jc-back,
      body #drag-ol li.jc-back,
      html body #drag-ol li.jc-back.border-common {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
        font-weight: 500 !important;
        opacity: 0.55 !important;
        text-decoration: line-through !important;
        text-decoration-thickness: 1px !important;
        cursor: default !important;
      }
      #drag-ol > li.jc-back:hover,
      body #drag-ol li.jc-back:hover {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
      }
      /* 可选 / 未来 */
      #drag-ol > li.jc-future,
      #drag-ol > li.ui-selectee,
      body #drag-ol li.jc-future {
        background: var(--surface) !important;
        color: var(--text) !important;
        cursor: pointer !important;
      }
      #drag-ol > li.ui-selectee:hover,
      #drag-ol > li.jc-future:hover,
      #drag-ol > li.border-common:hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }
      /* 框选中 / 选中 */
      #drag-ol > li.ui-selecting,
      #drag-ol > li.ui-selected,
      #drag-ol > li.current-week,
      body #drag-ol li.ui-selected,
      body #drag-ol li.ui-selecting {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
        border-right-color: color-mix(in srgb, var(--primary) 70%, #000) !important;
      }
      /* ============================================================
       * 空闲教室 custom：星期/节次输入 + 垃圾桶、周次条 #test-drag
       * ============================================================ */
      /* 输入框 + 垃圾桶横排，垃圾桶在输入框后 */
      .profile-info-value > .dropdown,
      .profile-info-value .dropdown:has(#wSection),
      .profile-info-value .dropdown:has(#clearzc) {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        width: 100% !important;
        max-width: 100% !important;
        position: relative !important;
        float: none !important;
      }
      .profile-info-value .dropdown > #wSection,
      .profile-info-value .dropdown > input#wSection,
      .profile-info-value .dropdown > input.value_element {
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        order: 1 !important;
      }
      .profile-info-value .dropdown > #clearzc,
      .profile-info-value .dropdown > span#clearzc,
      #clearzc.btn {
        order: 2 !important;
        flex: 0 0 auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 34px !important;
        min-width: 34px !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 8px !important;
        float: none !important;
        position: static !important;
        vertical-align: middle !important;
      }
      .profile-info-value .dropdown > #clearzc > i,
      #clearzc .ace-icon,
      #clearzc .fa {
        margin: 0 !important;
        line-height: 1 !important;
      }
      /* 下拉面板仍绝对定位，不参与 flex 占位 */
      .profile-info-value .dropdown > .dropdown-menu,
      .profile-info-value .dropdown > #div-xqjc,
      .dropdown-menu.dropdown-self {
        order: 3 !important;
        position: absolute !important;
        top: calc(100% + 4px) !important;
        left: 0 !important;
        z-index: 1050 !important;
        min-width: 170px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        box-shadow: var(--shadow) !important;
        padding: 6px !important;
        margin: 0 !important;
      }

      /* 周次条 #test-drag：与节次 #drag-ol 同风格 */
      #drag-select-div {
        overflow: visible !important;
      }
      #test-drag,
      ol#test-drag {
        list-style: none !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: stretch !important;
        gap: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      #test-drag > li,
      #test-drag > li.ui-widget-content,
      #test-drag li.ui-widget-content,
      ol#test-drag > li,
      body #test-drag li {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        list-style: none !important;
        width: 22px !important;
        min-width: 22px !important;
        max-width: 26px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 28px !important;
        text-align: center !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        user-select: none !important;
        transition: background .12s ease, color .12s ease !important;
      }
      #test-drag > li:last-child,
      #test-drag li:last-child {
        border-right: none !important;
      }
      /* 已过周次 */
      #test-drag > li.zc-back,
      body #test-drag li.zc-back {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
        font-weight: 500 !important;
        opacity: 0.55 !important;
        text-decoration: line-through !important;
        cursor: default !important;
      }
      /* 可选周次 */
      #test-drag > li.zc-future,
      #test-drag > li.ui-selectee,
      body #test-drag li.zc-future {
        background: var(--surface) !important;
        color: var(--text) !important;
        opacity: 1 !important;
        text-decoration: none !important;
        cursor: pointer !important;
      }
      #test-drag > li.zc-future:hover,
      #test-drag > li.ui-selectee:hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }
      /* 选中周次 */
      #test-drag > li.ui-selecting,
      #test-drag > li.ui-selected,
      body #test-drag li.ui-selected,
      body #test-drag li.ui-selecting {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
        opacity: 1 !important;
        text-decoration: none !important;
        border-right-color: color-mix(in srgb, var(--primary) 70%, #000) !important;
      }

      /* Chosen 下拉：压过 commoncss/phone.css 的 25px，真正垂直居中 */
      .chosen-container .chosen-results,
      body .chosen-container .chosen-results {
        margin: 0 !important;
        padding: 4px 0 !important;
      }
      .chosen-container .chosen-results li,
      .chosen-container .chosen-results li.active-result,
      .chosen-container-single .chosen-results li,
      .chosen-container-multi .chosen-results li,
      body .chosen-container .chosen-results li,
      body .chosen-with-drop .chosen-results li {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        width: 100% !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        margin: 0 !important;
        padding: 0 12px !important;
        line-height: 1 !important;
        font-size: 13px !important;
        color: var(--text) !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      body .chosen-container .chosen-results li em,
      .chosen-container .chosen-results li em {
        font-style: normal !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      body .chosen-container .chosen-results li.highlighted,
      body .chosen-container .chosen-results li.result-selected,
      .chosen-container .chosen-results li.highlighted,
      .chosen-container .chosen-results li.result-selected {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        line-height: 1 !important;
        padding: 0 12px !important;
        background: var(--primary) !important;
        color: #fff !important;
      }
      body .chosen-container .chosen-results li.highlighted em,
      body .chosen-container .chosen-results li.result-selected em {
        background: transparent !important;
        color: #fff !important;
        line-height: 1 !important;
      }
      .chosen-results li.no-results {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 36px !important;
        line-height: 1 !important;
        background: var(--input-bg) !important;
        color: var(--text-muted) !important;
      }

      /* 搜索框：图标相对输入框垂直居中，不是相对整块 padding 区域 */
      .chosen-container .chosen-search,
      .chosen-container-single .chosen-search,
      .chosen-with-drop .chosen-search,
      .chosen-search {
        position: relative !important;
        margin: 0 !important;
        padding: 8px !important;
        box-sizing: border-box !important;
      }
      .chosen-container .chosen-search input[type="text"],
      .chosen-container-single .chosen-search input[type="text"],
      .chosen-container .chosen-search input,
      .chosen-container-single .chosen-search input,
      .chosen-with-drop .chosen-search input,
      body .chosen-container .chosen-search input {
        width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        padding: 0 34px 0 10px !important;
        line-height: 34px !important;
        font-size: 13px !important;
        border-radius: 8px !important;
        border: 1px solid var(--border) !important;
        background-color: var(--input-bg) !important;
        background-image: none !important;
        color: var(--text) !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }
      /* 关掉伪元素图标 */
      .chosen-container .chosen-search:after,
      .chosen-container-single .chosen-search:after,
      .chosen-with-drop .chosen-search:after,
      body .chosen-container .chosen-search:after,
      .chosen-search:before,
      .chosen-search:after {
        content: none !important;
        display: none !important;
      }
      /* 图标盒子与 input 同高同顶，内容垂直居中 */
      .chosen-container .chosen-search,
      .chosen-container-single .chosen-search,
      .chosen-with-drop .chosen-search {
        position: relative !important;
        padding: 8px !important;
        box-sizing: border-box !important;
      }
      .urppp-chosen-search-icon {
        position: absolute !important;
        top: 8px !important;          /* 与 search padding-top 对齐 */
        right: 18px !important;
        width: 14px !important;
        height: 34px !important;      /* 与 input 高度一致 */
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 13px !important;
        line-height: 1 !important;
        color: var(--text-muted) !important;
        pointer-events: none !important;
        z-index: 5 !important;
        transform: none !important;
      }

      input:focus, select:focus, textarea:focus, .form-control:focus,
      .chosen-container-active .chosen-single, .chosen-container-active .chosen-choices {
        border-color: var(--border-focus) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
        outline: none !important;
      }
      label { color: var(--text-secondary) !important; font-weight: 500 !important; font-size: 13px !important; }

      /* 查询表单：保留 Bootstrap 栅格，只做垂直居中与统一高度 */
      .form-horizontal .form-group,
      form .form-group,
      .form-group {
        display: block !important;
        margin-left: -12px !important;
        margin-right: -12px !important;
        margin-bottom: 12px !important;
      }
      .form-group:before,
      .form-group:after,
      .form-horizontal .form-group:before,
      .form-horizontal .form-group:after {
        content: " " !important;
        display: table !important;
      }
      .form-group:after,
      .form-horizontal .form-group:after {
        clear: both !important;
      }
      .form-group > [class*="col-"],
      .form-horizontal .form-group > [class*="col-"] {
        float: left !important;
        display: block !important;
        position: relative !important;
        min-height: 1px !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        box-sizing: border-box !important;
      }
      .form-group > .col-sm-3,
      .form-group > .col-xs-3,
      .form-group > .col-md-3,
      .form-horizontal .form-group > .col-sm-3,
      .form-horizontal .form-group > .col-xs-3,
      .form-horizontal .form-group > .col-md-3 {
        width: 25% !important;
        text-align: right !important;
      }
      .form-group > .col-sm-9,
      .form-group > .col-xs-9,
      .form-group > .col-md-9,
      .form-horizontal .form-group > .col-sm-9,
      .form-horizontal .form-group > .col-xs-9,
      .form-horizontal .form-group > .col-md-9 {
        width: 75% !important;
        text-align: left !important;
      }
      .form-horizontal .control-label,
      .form-group .control-label,
      label.control-label,
      .form-group > [class*="col-"] > label {
        display: block !important;
        float: none !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 34px !important;
        line-height: 34px !important;
        text-align: right !important;
        color: var(--text-secondary) !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        box-sizing: border-box !important;
      }
      .form-group input:not([type="checkbox"]):not([type="radio"]),
      .form-group select,
      .form-group .form-control,
      .form-horizontal input:not([type="checkbox"]):not([type="radio"]),
      .form-horizontal select,
      .form-horizontal .form-control {
        display: inline-block !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
      }
      .form-group textarea,
      .form-horizontal textarea {
        height: auto !important;
        min-height: 80px !important;
      }
      .form-group .chosen-container,
      .form-horizontal .chosen-container {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        top: 0 !important;
        vertical-align: middle !important;
      }
      .form-group .chosen-container .chosen-single,
      .form-horizontal .chosen-container .chosen-single,
      .form-group .chosen-container-single .chosen-single,
      .form-horizontal .chosen-container-single .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 32px !important;
        padding: 0 30px 0 12px !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      .form-group .chosen-container-single .chosen-single span,
      .form-horizontal .chosen-container-single .chosen-single span {
        display: block !important;
        line-height: 32px !important;
        margin-right: 26px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .form-group .chosen-container-single .chosen-single div,
      .form-horizontal .chosen-container-single .chosen-single div {
        top: 0 !important;
        height: 100% !important;
        width: 28px !important;
      }
      .form-group .chosen-container-single .chosen-single div b,
      .form-horizontal .chosen-container-single .chosen-single div b {
        background-position: 0 0 !important;
      }
      /* 查询区两列时更稳 */
      .form-horizontal .col-sm-6 .form-group > .col-sm-3,
      .form-horizontal .col-xs-6 .form-group > .col-sm-3 {
        width: 33.333333% !important;
      }
      .form-horizontal .col-sm-6 .form-group > .col-sm-9,
      .form-horizontal .col-xs-6 .form-group > .col-sm-9 {
        width: 66.666667% !important;
      }

      /* Alert 关闭叉：垂直居中对齐 */
      .alert {
        position: relative !important;
        padding: 12px 40px 12px 16px !important;
        border-radius: 10px !important;
        display: block !important;
        line-height: 1.5 !important;
      }
      .alert .close,
      .alert button.close {
        position: absolute !important;
        top: 50% !important;
        right: 12px !important;
        transform: translateY(-50%) !important;
        float: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 24px !important;
        height: 24px !important;
        line-height: 22px !important;
        text-align: center !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: inherit !important;
        opacity: 0.55 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        cursor: pointer !important;
      }
      .alert .close:hover,
      .alert button.close:hover {
        opacity: 0.9 !important;
        color: inherit !important;
      }

      /* 标签页：只保留一条圆角条，避免 navbar 外壳 + nav-tabs 双层色块 */
      .tabbable,
      .tabbable-custom,
      .tabbable-line,
      .widget-body > .tabbable,
      .page-content .tabbable {
        margin: 0 0 16px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* ACE 外壳 #navbar-example：完全透明，不画第二条 */
      .page-content .navbar.navbar-static,
      .page-content #navbar-example,
      .page-content .navbar-example,
      #page-content-template .navbar.navbar-static,
      #page-content-template #navbar-example {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 0 14px !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: auto !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
        left: 0 !important;
        z-index: 1 !important;
      }
      .page-content .navbar.navbar-static .navbar-inner,
      .page-content #navbar-example .navbar-inner,
      #page-content-template .navbar.navbar-static .navbar-inner {
        background: transparent !important;
        background-image: none !important;
        border: none !important;
        box-shadow: none !important;
        filter: none !important;
        padding: 0 !important;
        margin: 0 !important;
        min-height: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .page-content .navbar.navbar-static .container,
      .page-content #navbar-example .container,
      #page-content-template .navbar.navbar-static .container,
      .page-content .navbar.navbar-static .container-fluid,
      .page-content #navbar-example .container-fluid {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-sizing: border-box !important;
      }

      /* 唯一色块：nav-tabs 自身 */
      .page-content .navbar.navbar-static .nav-tabs,
      .page-content #navbar-example .nav-tabs,
      .page-content ul.nav.nav-tabs,
      .page-content .nav.nav-tabs,
      .tabbable > .nav-tabs,
      .widget-body > .nav-tabs,
      .self-margin > .nav-tabs,
      ul.nav.nav-tabs {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 6px !important;
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 14px !important;
        padding: 8px 10px !important;
        box-sizing: border-box !important;
        list-style: none !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        background-image: none !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        position: static !important;
        top: auto !important;
      }
      /* 外壳已有下边距时，内部 tabs 不再重复 margin-bottom */
      .page-content .navbar.navbar-static .nav-tabs,
      .page-content #navbar-example .nav-tabs {
        margin-bottom: 0 !important;
      }
      .nav-tabs > li,
      .nav.nav-tabs > li {
        float: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
      }
      .nav-tabs > li > a,
      .nav-tabs > li > a:link,
      .nav-tabs > li > a:visited {
        color: var(--text-secondary) !important;
        background: transparent !important;
        border: 1px solid transparent !important;
        border-radius: 8px !important;
        margin: 0 !important;
        padding: 7px 14px !important;
        line-height: 1.35 !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        box-shadow: none !important;
        position: static !important;
        top: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        white-space: nowrap !important;
      }
      .nav-tabs > li > a:hover,
      .nav-tabs > li > a:focus {
        color: var(--text) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
      }
      .nav-tabs > li.active > a,
      .nav-tabs > li.active > a:hover,
      .nav-tabs > li.active > a:focus,
      .nav-tabs > li.active > a:active {
        color: var(--primary) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        font-weight: 600 !important;
        box-shadow: none !important;
        z-index: auto !important;
      }
      .tab-content,
      .tabbable > .tab-content,
      .page-content .tab-content {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .tab-content > .tab-pane {
        padding: 0 !important;
        background: transparent !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .tab-content .urppp-table-wrap,
      .tab-content .table,
      .tab-content .table-bordered {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      /* 分页（通用；#urppagebar 内由上方专用规则覆盖为 36px 整颗 chip） */
      .pagination > li > a, .pagination > li > span {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        border-radius: 8px !important;
        margin: 0 2px !important;
      }
      .pagination > li > a:hover { background: var(--input-bg) !important; color: var(--primary) !important; }
      .pagination > li.active > a, .pagination > li.active > span, .pagination > li.active > a:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }

      /* layui 页面提示 toast / msg */
      .layui-layer.layui-layer-dialog.layui-layer-msg,
      .layui-layer.layui-layer-msg,
      .layui-layer-msg {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      .layui-layer-msg .layui-layer-content,
      .layui-layer-dialog.layui-layer-msg .layui-layer-content {
        background: var(--surface) !important;
        color: var(--text) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.03) !important;
        padding: 12px 18px !important;
        min-height: 0 !important;
        line-height: 1.5 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        max-width: min(420px, 86vw) !important;
        word-break: break-word !important;
      }
      .layui-layer-msg .layui-layer-content .layui-layer-ico,
      .layui-layer-msg .layui-layer-ico {
        position: static !important;
        display: inline-block !important;
        width: 18px !important;
        height: 18px !important;
        margin: 0 !important;
        background-size: 18px 18px !important;
        flex: 0 0 18px !important;
      }
      .layui-layer-hui .layui-layer-content {
        background: rgba(15, 23, 42, 0.88) !important;
        color: #fff !important;
        border: none !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.22) !important;
        padding: 12px 18px !important;
      }

      /* 弹窗：只美化外观；display 完全交给 Bootstrap，避免关不掉/打不开 */
      .modal-dialog {
        z-index: 1051 !important;
      }
      .modal-content {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.12) !important;
      }
      .modal-header {
        border-bottom: 1px solid var(--border) !important;
        padding: 16px 20px !important;
        background: var(--surface) !important;
      }
      .modal-header .close,
      .modal-header button.close {
        color: var(--text-secondary) !important;
        opacity: 0.75 !important;
        text-shadow: none !important;
      }
      .modal-header .close:hover,
      .modal-header button.close:hover {
        opacity: 1 !important;
        color: var(--text) !important;
      }
      .modal-title {
        color: var(--text) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      .modal-body { padding: 20px !important; background: var(--surface) !important; color: var(--text) !important; }
      .modal-footer { border-top: 1px solid var(--border) !important; padding: 16px 20px !important; background: var(--surface) !important; }
      .modal-backdrop {
        z-index: 1040 !important;
      }
      .modal-backdrop.in,
      .modal-backdrop.show {
        opacity: 0.45 !important;
      }


      /* ============================================================
       * 学籍页右侧滑出面板：培养方案 / 课表信息抽屉
       * #curriculumInfo-divcon / #curriculumInfo-divcon1 / #curriculumInfo-divcon2
       * ============================================================ */
      /*
       * 右侧滑出面板：只改颜色/阴影/标题，不锁 top/right/width/height/overflow/display
       * 教室课表/培养方案都依赖 jQuery animate(right/width)
       */
      #curriculumInfo-divcon,
      #curriculumInfo-divcon1,
      #curriculumInfo-divcon2,
      #calssInfo-divcon,
      #classroomInfo-divcon {
        background: var(--bg) !important;
        border-left: 1px solid var(--border) !important;
        box-shadow: -12px 0 40px rgba(15, 23, 42, 0.14) !important;
        z-index: 1050 !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon > .div-title,
      #curriculumInfo-divcon1 > .div-title,
      #curriculumInfo-divcon2 > .div-title {
        width: 100% !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 3 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        min-height: 56px !important;
        padding: 0 16px 0 20px !important;
        margin: 0 !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon > .div-title h3,
      #curriculumInfo-divcon1 > .div-title h3,
      #curriculumInfo-divcon2 > .div-title h3 {
        margin: 0 !important;
        padding: 0 !important;
        text-indent: 0 !important;
        font-size: 16px !important;
        font-weight: 650 !important;
        line-height: 1.3 !important;
        color: var(--text) !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      #curriculumInfo-divcon > .div-title h3::before,
      #curriculumInfo-divcon1 > .div-title h3::before,
      #curriculumInfo-divcon2 > .div-title h3::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 16px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      #curriculumInfo-divcon > .div-title span,
      #curriculumInfo-divcon1 > .div-title span,
      #curriculumInfo-divcon2 > .div-title span {
        position: static !important;
        right: auto !important;
        top: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 32px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
        line-height: 1 !important;
        text-indent: 0 !important;
      }
      #curriculumInfo-divcon > .div-title span:hover,
      #curriculumInfo-divcon1 > .div-title span:hover,
      #curriculumInfo-divcon2 > .div-title span:hover {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
        background: color-mix(in srgb, var(--primary) 8%, var(--surface)) !important;
      }
      #curriculumInfo-divcon > .modal-body,
      #curriculumInfo-divcon1 > .modal-body,
      #curriculumInfo-divcon2 > .modal-body,
      #curriculumInfo-divcon2 .modal-body.no-padding {
        height: calc(100% - 56px) !important;
        max-height: calc(100vh - 56px) !important;
        overflow: auto !important;
        padding: 16px !important;
        background: var(--bg) !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body.no-padding > .col-xs-12 {
        width: 100% !important;
        float: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #curriculumInfo-divcon2 .modal-body .row,
      #curriculumInfo-divcon2 .modal-body .row.urppp-drawer-layout {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p a,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar a {
        color: var(--primary) !important;
        text-decoration: none !important;
        font-weight: 500 !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p a:hover,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar a:hover {
        text-decoration: underline !important;
      }
      /* 固定左右两栏：左树 | 右详情（详情内部只纵向一列） */
      #curriculumInfo-divcon2 .urppp-drawer-body {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 14px !important;
        width: 100% !important;
        min-height: 0 !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-left,
      #curriculumInfo-divcon2 .urppp-drawer-right {
        float: none !important;
        flex: 1 1 0 !important;
        width: 0 !important; /* 配合 flex:1 均分，避免内容撑破 */
        max-width: none !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-left {
        position: sticky !important;
        top: 0 !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-right {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      /* 右栏子块绝不再 50% 并排 */
      #curriculumInfo-divcon2 .urppp-drawer-right > * {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-right > .col-xs-6,
      #curriculumInfo-divcon2 .urppp-drawer-right > #fajh,
      #curriculumInfo-divcon2 .urppp-drawer-right > #xnxq,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kz,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kc,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kcfa {
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      /* 兼容未包 wrapper 的旧结构：直接子级 col 不再并排交错 */
      #curriculumInfo-divcon2 .modal-body .row:not(.urppp-drawer-layout) > .col-xs-6 {
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
      }
      #curriculumInfo-divcon2 .modal-body .widget-box,
      #curriculumInfo-divcon2 #fajh .widget-box,
      #curriculumInfo-divcon2 #xnxq .widget-box,
      #curriculumInfo-divcon2 #kz .widget-box,
      #curriculumInfo-divcon2 #kc .widget-box,
      #curriculumInfo-divcon2 #kcfa .widget-box {
        margin: 0 0 12px !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        background: var(--surface) !important;
        box-shadow: none !important;
        overflow: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body .widget-box.transparent,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent {
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        margin-bottom: 8px !important;
      }
      #curriculumInfo-divcon2 .widget-header,
      #curriculumInfo-divcon2 .widget-header-small {
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        padding: 10px 14px !important;
        min-height: 0 !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent,
      #curriculumInfo-divcon2 #xnxq .widget-box.transparent,
      #curriculumInfo-divcon2 #kz .widget-box.transparent,
      #curriculumInfo-divcon2 #kc .widget-box.transparent,
      #curriculumInfo-divcon2 #kcfa .widget-box.transparent {
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        margin: 0 0 8px !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #xnxq .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kz .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kc .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kcfa .widget-box.transparent .widget-header {
        border: none !important;
        border-bottom: none !important;
        padding: 0 !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
        background: transparent !important;
        display: flex !important;
        align-items: center !important;
      }
      #curriculumInfo-divcon2 .widget-title,
      #curriculumInfo-divcon2 h4.widget-title,
      #curriculumInfo-divcon2 h4.widget-title.smaller,
      #curriculumInfo-divcon2 h4.widget-title.grey {
        margin: 0 !important;
        padding: 0 !important;
        color: var(--text) !important;
        font-size: 14px !important;
        font-weight: 650 !important;
        line-height: 1.35 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: transparent !important;
        border: none !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent .widget-title::before,
      #curriculumInfo-divcon2 #fajh .widget-title::before,
      #curriculumInfo-divcon2 #xnxq .widget-title::before,
      #curriculumInfo-divcon2 #kz .widget-title::before,
      #curriculumInfo-divcon2 #kc .widget-title::before,
      #curriculumInfo-divcon2 #kcfa .widget-title::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 14px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      /* 左树标题栏若为空，压低高度 */
      #curriculumInfo-divcon2 .urppp-drawer-left .widget-header:has(h4:empty),
      #curriculumInfo-divcon2 .urppp-drawer-left .widget-header:has(.widget-title:empty) {
        display: none !important;
      }
      #curriculumInfo-divcon2 .widget-body {
        background: var(--surface) !important;
        padding: 8px 10px 12px !important;
      }
      #curriculumInfo-divcon2 #treeDemo.ztree,
      #curriculumInfo-divcon2 .ztree {
        padding: 4px 2px !important;
        background: transparent !important;
        max-height: calc(100vh - 180px) !important;
        overflow: auto !important;
      }
      /* 右侧详情卡：方案计划 / 课组 / 课程 / 课程方案 — 全部拉满右栏 */
      #curriculumInfo-divcon2 #fajh,
      #curriculumInfo-divcon2 #xnxq,
      #curriculumInfo-divcon2 #kz,
      #curriculumInfo-divcon2 #kc,
      #curriculumInfo-divcon2 #kcfa {
        min-width: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 #fajh .profile-user-info,
      #curriculumInfo-divcon2 #fajh .profile-user-info-striped,
      #curriculumInfo-divcon2 #xnxq .profile-user-info,
      #curriculumInfo-divcon2 #xnxq .profile-user-info-striped,
      #curriculumInfo-divcon2 #kz .profile-user-info,
      #curriculumInfo-divcon2 #kz .profile-user-info-striped,
      #curriculumInfo-divcon2 #kc .profile-user-info,
      #curriculumInfo-divcon2 #kc .profile-user-info-striped,
      #curriculumInfo-divcon2 #kcfa .profile-user-info,
      #curriculumInfo-divcon2 #kcfa .profile-user-info-striped,
      #curriculumInfo-divcon2 .profile-user-info.self,
      #curriculumInfo-divcon2 .profile-user-info-striped {
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        margin: 0 0 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        display: block !important;
      }
      #curriculumInfo-divcon2 .profile-info-row {
        display: grid !important;
        grid-template-columns: 112px minmax(0, 1fr) !important;
        align-items: stretch !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 40px !important;
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .profile-info-row:last-child {
        border-bottom: none !important;
      }
      #curriculumInfo-divcon2 .profile-info-row::before,
      #curriculumInfo-divcon2 .profile-info-row::after {
        content: none !important;
        display: none !important;
      }
      #curriculumInfo-divcon2 .profile-info-name {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 8px 12px !important;
        background: var(--input-bg) !important;
        border-right: 1px solid var(--border) !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
      }
      #curriculumInfo-divcon2 .profile-info-value {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        margin: 0 !important;
        margin-left: 0 !important;
        width: auto !important;
        min-width: 0 !important;
        padding: 8px 12px !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
        white-space: normal !important;
      }
      @media (max-width: 1100px) {
        #curriculumInfo-divcon2 .urppp-drawer-body {
          flex-direction: column !important;
        }
        #curriculumInfo-divcon2 .urppp-drawer-left,
        #curriculumInfo-divcon2 .urppp-drawer-right {
          width: 100% !important;
          flex: 1 1 auto !important;
        }
      }

      /* 作息时间表：干净利落 + 全居中（不改 DOM 结构） */

      /* ============================================================
       * 本学期周课表：周次滑条 + 课程块对齐
       * ============================================================ */
      /* 站点写死 #soliderbox.container {width:300%} 会把滑条拖到全宽外 */
      #soliderbox.container,
      #soliderbox,
      .profile-info-value > #soliderbox,
      .profile-info-row #soliderbox {
        width: 100% !important;
        max-width: 720px !important;
        min-width: 0 !important;
        margin: 8px 0 4px !important;
        padding: 8px 12px 22px !important;
        box-sizing: border-box !important;
        float: none !important;
        overflow: visible !important;
      }
      .profile-info-row:has(#soliderbox) {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 16px !important;
        padding: 12px 16px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-sizing: border-box !important;
      }
      .profile-info-row:has(#soliderbox) .profile-info-name {
        float: none !important;
        width: auto !important;
        min-width: 72px !important;
        flex: 0 0 auto !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        color: var(--text) !important;
        font-weight: 600 !important;
      }
      .profile-info-row:has(#soliderbox) .profile-info-value {
        float: none !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
      }
      /* r-slider 主题色 */
      #soliderbox .r-slider-line {
        background: var(--border) !important;
        height: 6px !important;
        border-radius: 999px !important;
      }
      #soliderbox .r-slider-fill {
        background: var(--primary) !important;
        height: 6px !important;
        border-radius: 999px !important;
      }
      #soliderbox .r-slider-button {
        background: var(--primary) !important;
        border: 2px solid #fff !important;
        box-shadow: 0 1px 4px rgba(15,23,42,0.2) !important;
        width: 16px !important;
        height: 16px !important;
      }
      #soliderbox .r-slider-label,
      #soliderbox .r-slider-text {
        color: var(--text-muted) !important;
        font-size: 11px !important;
      }
      #soliderbox .r-slider-number {
        background: var(--text) !important;
        color: #fff !important;
      }
      /* 课表：td 作为定位容器，课程块相对单元格对齐 */
      #mycoursetable {
        position: relative !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: auto !important;
        box-sizing: border-box !important;
      }
      #mycoursetable > table,
      #mycoursetable table#courseTable,
      #courseTable {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        box-sizing: border-box !important;
      }
      #mycoursetable td,
      #mycoursetable th,
      #courseTable td,
      #courseTable th {
        position: relative !important;
        vertical-align: top !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      #mycoursetable th,
      #courseTable th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
      }
      /* 课程块相对父 td：默认 left/top=0，避免站点先写大 offset 再纠正造成右闪 */
      #mycoursetable div.class_div,
      #courseTable div.class_div {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: auto !important;
        bottom: auto !important;
        transform: none !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        border-radius: 8px !important;
        z-index: 2 !important;
        margin: 0 !important;
      }
      /* 同格两门课时由 JS 写 left/width；未写前也先铺满格，不飞到页右侧 */
      #mycoursetable td > div.class_div:only-of-type,
      #courseTable td > div.class_div:only-of-type {
        left: 0 !important;
        width: 100% !important;
      }
      #mycoursetable div.class_div p,
      #courseTable div.class_div p {
        margin: 2px 4px !important;
        line-height: 1.35 !important;
        word-break: break-word !important;
      }
      #work_rest_schedule_modal.modal.fade.in,
      #work_rest_schedule_modal.modal.in {
        display: block !important;
      }
      #work_rest_schedule_modal .modal-dialog {
        width: 720px !important;
        max-width: 94vw !important;
        margin: 48px auto !important;
      }
      #work_rest_schedule_modal .modal-content {
        position: relative !important;
        border-radius: 14px !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
        background: var(--surface) !important;
        overflow: hidden !important;
      }
      #work_rest_schedule_modal .modal-header {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 52px !important;
        padding: 14px 48px !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        position: relative !important;
      }
      #work_rest_schedule_modal .modal-title {
        margin: 0 auto !important;
        width: 100% !important;
        text-align: center !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        color: var(--text) !important;
        line-height: 1.3 !important;
      }
      #work_rest_schedule_modal .modal-header .close {
        position: absolute !important;
        right: 16px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin: 0 !important;
        opacity: 0.6 !important;
        float: none !important;
      }
      #work_rest_schedule_modal .modal-body {
        padding: 16px 18px 18px !important;
        background: var(--bg) !important;
        max-height: 75vh !important;
        overflow: auto !important;
      }
      #work_rest_schedule_modal .modal-body > h3,
      #work_rest_schedule_modal .modal-body > h4,
      #work_rest_schedule_modal .modal-body > p,
      #work_rest_schedule_modal .modal-body > .center {
        text-align: center !important;
        color: var(--text) !important;
        font-weight: 600 !important;
        margin: 0 0 10px !important;
      }

      /* 完整网格，覆盖全局 .table 残缺边框 */
      #work_rest_schedule_modal table,
      #work_rest_schedule_modal table.table,
      #work_rest_schedule_modal table.table-bordered,
      #work_rest_schedule_modal table.urppp-wrs-table {
        width: 100% !important;
        margin: 0 auto !important;
        border: 1px solid var(--border) !important;
        border-collapse: collapse !important;
        border-spacing: 0 !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        box-shadow: none !important;
      }
      #work_rest_schedule_modal table th,
      #work_rest_schedule_modal table td,
      #work_rest_schedule_modal table.table > thead > tr > th,
      #work_rest_schedule_modal table.table > tbody > tr > th,
      #work_rest_schedule_modal table.table > tbody > tr > td,
      #work_rest_schedule_modal table.table-bordered > thead > tr > th,
      #work_rest_schedule_modal table.table-bordered > tbody > tr > td,
      #work_rest_schedule_modal table.table > tbody > tr > td:last-child,
      #work_rest_schedule_modal table.table > tbody > tr:last-child > td {
        border: 1px solid var(--border) !important;
        padding: 10px 12px !important;
        text-align: center !important;
        vertical-align: middle !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        color: var(--text) !important;
        background: var(--surface) !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
        font-weight: 400 !important;
      }
      #work_rest_schedule_modal table {
        width: 100% !important;
        table-layout: fixed !important;
      }
      #work_rest_schedule_modal table tr.urppp-wrs-title-row > td.urppp-wrs-title,
      #work_rest_schedule_modal table .urppp-wrs-title {
        display: table-cell !important;
        width: 100% !important;
        text-align: center !important;
        vertical-align: middle !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        color: var(--text) !important;
        background: color-mix(in srgb, var(--primary) 8%, var(--surface)) !important;
        padding: 12px 14px !important;
        border: 1px solid var(--border) !important;
      }
      #work_rest_schedule_modal table tr.urppp-wrs-title-row {
        text-align: center !important;
      }
      #work_rest_schedule_modal table th[colspan],
      #work_rest_schedule_modal table td[colspan] {
        text-align: center !important;
        vertical-align: middle !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-head,
      #work_rest_schedule_modal table thead th {
        text-align: center !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        font-weight: 600 !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-period,
      #work_rest_schedule_modal table td[rowspan],
      #work_rest_schedule_modal table th[rowspan] {
        text-align: center !important;
        vertical-align: middle !important;
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        font-weight: 700 !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-time {
        text-align: center !important;
        font-variant-numeric: tabular-nums !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-weight: 500 !important;
      }

      /* 时间轴 */
      .timeline-container { background: var(--surface) !important; border-color: var(--border) !important; }
      .timeline-item { border-color: var(--border) !important; }
      .timeline-item .timeline-indicator { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .timeline-item h5 { color: var(--text) !important; }

      /* FullCalendar 课表 */
      .fc { background: var(--surface) !important; border-radius: var(--radius) !important; }
      .fc th, .fc td { border-color: var(--border) !important; }
      .fc-day-header { background: var(--input-bg) !important; color: var(--text-secondary) !important; }
      .fc-time-grid-event, .fc-event { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; border-radius: var(--radius-sm) !important; margin: 2px 4px !important; }
      .fc-event-container { padding: 2px !important; }
      .fc-toolbar { margin-top: 8px !important; margin-bottom: 12px !important; padding: 0 8px !important; }
      .fc-button { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .fc-button.fc-state-active { background: var(--primary) !important; color: #fff !important; }
      /* FullCalendar 事件悬停弹窗 */
      #schedule-hover {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12) !important;
      }
      #schedule-hover .promptedmessage-a,
      #schedule-hover .promptedmessage {
        background: var(--surface) !important;
        border: none !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
      }
      #schedule-hover .promptedmessage {
        padding: 10px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        color: var(--text-secondary) !important;
      }
      #schedule-hover .promptedmessage span:first-child {
        font-weight: 600 !important;
        color: var(--primary) !important;
        font-size: 14px !important;
      }
      #schedule-hover .promptedmessage .ace-icon {
        color: var(--text-muted) !important;
      }

      .fc-today { background: var(--input-bg) !important; }

      /* 课表页面 #courseTable */
      #courseTable { background: transparent !important; }
      /* 隐藏打印/导出按钮工具栏 */
      .page-content .tools,
      .widget-toolbar .btn-group { display: none !important; }

      /* 标签：箭头矩形 → 圆角矩形 + 80% 不透明度 */
      .label.arrowed-in,
      .label.arrowed,
      .label[class*="arrowed"] {
        border-radius: var(--radius-sm) !important;
        opacity: 0.8 !important;
      }
      .label.arrowed-in::before,
      .label.arrowed-in::after,
      .label.arrowed::before,
      .label.arrowed::after {
        display: none !important;
      }
      .label[class*="arrowed"] {
        vertical-align: middle !important;
        position: relative !important;
        top: -1px !important;
      }
      #courseTable th {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; border: none !important;
        padding: 10px 8px !important; text-align: center !important; font-size: 13px !important;
      }
      #courseTable td {
        border: 0.5px solid var(--border) !important;
        padding: 4px !important; vertical-align: top !important;
        font-size: 13px !important; line-height: 1.6 !important;
        color: var(--text) !important;
      }
      #courseTable td:first-child {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; text-align: center !important; font-size: 11px !important;
      }
      /* 课程卡片圆角 + 不透明度 */
      #courseTable .class_div.box_font,
      #courseTable div[class*="div-kcb"] {
        border-radius: var(--radius) !important;
        opacity: 0.88 !important;
      }

      /* 列表 / 通知 */
      .list-group-item { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .list-group-item:hover { background: var(--input-bg) !important; }
      .list-group-item.active { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }
      .alert, .alert-info { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: 10px !important; }
      .alert-success { background: rgba(34,197,94,0.1) !important; border-color: rgba(34,197,94,0.2) !important; color: #22c55e !important; }
      .alert-warning { background: rgba(245,158,11,0.1) !important; border-color: rgba(245,158,11,0.2) !important; color: #f59e0b !important; }
      .alert-danger { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; color: #ef4444 !important; }

      /* 标签 / 徽章 */
      .label-info, .badge-info { background: var(--primary) !important; }
      .label-success, .badge-success { background: #22c55e !important; }
      .label-warning, .badge-warning { background: #f59e0b !important; }
      .label-danger, .badge-danger { background: #ef4444 !important; }
      .badge, .label { border-radius: var(--radius-sm) !important; }
      /* ============================================================
       * 深邃暗：压过 ACE 白底 / 浅字 / 硬编码灰底
       * ============================================================ */
      html.urppp-theme-dark,
      html.urppp-theme-dark body,
      body.urppp-dark {
        color-scheme: dark !important;
      }
      html.urppp-theme-dark .page-content,
      html.urppp-theme-dark #page-content-template,
      html.urppp-theme-dark .main-content,
      body.urppp-dark .page-content,
      body.urppp-dark .main-content {
        background: var(--bg) !important;
        color: var(--text) !important;
      }
      /* 表格：强制 td/th 吃主题色，盖掉 Bootstrap #fff */
      html.urppp-theme-dark .table,
      html.urppp-theme-dark .table-bordered,
      html.urppp-theme-dark .table-striped,
      html.urppp-theme-dark .dataTable,
      html.urppp-theme-dark .urppp-table-wrap {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .table > thead > tr > th,
      html.urppp-theme-dark .table-bordered > thead > tr > th,
      html.urppp-theme-dark .dataTable > thead > tr > th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .table > tbody > tr > td,
      html.urppp-theme-dark .table > tbody > tr > th,
      html.urppp-theme-dark .table-bordered > tbody > tr > td,
      html.urppp-theme-dark .dataTable > tbody > tr > td,
      html.urppp-theme-dark .table > tfoot > tr > td {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd) > td,
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd) > th,
      html.urppp-theme-dark .dataTable > tbody > tr:nth-of-type(odd) > td {
        background: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
        background-color: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
        color: var(--text) !important;
      }
      html.urppp-theme-dark .table-hover > tbody > tr:hover > td,
      html.urppp-theme-dark .dataTable > tbody > tr:hover > td {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      /* 公告日期胶囊：暗色下更柔和 */
      html.urppp-theme-dark .urppp-notice-time {
        background: color-mix(in srgb, var(--primary) 16%, var(--input-bg)) !important;
        border-color: color-mix(in srgb, var(--primary) 28%, var(--border)) !important;
        color: var(--text-secondary) !important;
      }
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr:hover,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr.hover,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row.hover,
      html.urppp-theme-dark .urppp-notice-card {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border-color: var(--border) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.25) !important;
      }
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr > td,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr:hover > td,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.hover > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr:hover > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr.hover > td {
        background: transparent !important;
        background-color: transparent !important;
      }
      /* ACE 离开悬停时常把 td 写回 #fff：暗色下强制清掉 */
      html.urppp-theme-dark .table-hover > tbody > tr:not(.urppp-notice-row).hover > td,
      html.urppp-theme-dark .table-hover > tbody > tr:not(.urppp-notice-row) > td {
        background-color: var(--surface) !important;
      }
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd):not(.urppp-notice-row) > td {
        background-color: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
      }
      /* 空闲教室楼栋列表 / 校区标题 */
      html.urppp-theme-dark #drag-ul,
      html.urppp-theme-dark #drag-ul.urppp-drag-ul,
      html.urppp-theme-dark #xq-section #drag-ul {
        background: var(--surface) !important;
      }
      html.urppp-theme-dark #drag-ul > li,
      html.urppp-theme-dark #drag-ul > li.border-common,
      html.urppp-theme-dark #drag-ul .border-common {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-bottom-color: var(--border) !important;
      }
      html.urppp-theme-dark #drag-ul > li.xq-section {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
      }
      html.urppp-theme-dark #drag-ul > li.ui-selected,
      html.urppp-theme-dark #drag-ul > li.urppp-building-active {
        background: var(--primary) !important;
        color: #0B0F17 !important;
      }
      /* 节次 / 周次条 */
      html.urppp-theme-dark #drag-ol > li,
      html.urppp-theme-dark #drag-ol .border-common,
      html.urppp-theme-dark #test-drag > li,
      html.urppp-theme-dark #test-drag .ui-widget-content {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* Chosen 多选标签（教学楼等）：去掉白底浅字 */
      html.urppp-theme-dark .chosen-container-multi .chosen-choices,
      html.urppp-theme-dark .chosen-choices {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice,
      html.urppp-theme-dark .chosen-choices .search-choice,
      html.urppp-theme-dark .search-choice {
        background: color-mix(in srgb, var(--primary) 22%, var(--surface)) !important;
        background-image: none !important;
        border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--border)) !important;
        color: var(--text) !important;
        box-shadow: none !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice span,
      html.urppp-theme-dark .search-choice span {
        color: var(--text) !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice .search-choice-close {
        opacity: 0.75 !important;
      }
      /* 标签 badge/label 在暗色下文字更清晰 */
      html.urppp-theme-dark .label,
      html.urppp-theme-dark .badge {
        color: #fff !important;
      }
      html.urppp-theme-dark .label-info,
      html.urppp-theme-dark .badge-info {
        background: color-mix(in srgb, var(--primary) 70%, #1e293b) !important;
        color: #e2e8f0 !important;
      }
      /* 周课表格子 */
      html.urppp-theme-dark #mycoursetable,
      html.urppp-theme-dark #mycoursetable > table,
      html.urppp-theme-dark #courseTable {
        background: var(--surface) !important;
        color: var(--text) !important;
      }
      html.urppp-theme-dark #mycoursetable td,
      html.urppp-theme-dark #mycoursetable th,
      html.urppp-theme-dark #courseTable td,
      html.urppp-theme-dark #courseTable th {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark #mycoursetable th,
      html.urppp-theme-dark #courseTable th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      html.urppp-theme-dark #mycoursetable div.class_div,
      html.urppp-theme-dark #courseTable div.class_div {
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
      }
      html.urppp-theme-dark #mycoursetable div.class_div p,
      html.urppp-theme-dark #courseTable div.class_div p {
        color: inherit !important;
      }
      /* 进度条百分比：暗色下用亮字 + 阴影，避免白底条上几乎看不见 */
      html.urppp-theme-dark .progress.pos-rel::after,
      html.urppp-theme-dark .progress[data-percent]::after {
        color: #F8FAFC !important;
        mix-blend-mode: normal !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.65) !important;
      }
      html.urppp-theme-dark .progress,
      html.urppp-theme-dark div.progress {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
      }
      /* 星期/节次下拉：站点写死 #efefef */
      html.urppp-theme-dark #div-xqjc,
      html.urppp-theme-dark .dropdown-self,
      html.urppp-theme-dark .profile-info-value .dropdown > #div-xqjc {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: var(--shadow) !important;
      }
      html.urppp-theme-dark #div-xqjc table,
      html.urppp-theme-dark #div-xqjc td,
      html.urppp-theme-dark #div-xqjc th {
        background: transparent !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* profile 信息行：name 列暗色区分 */
      html.urppp-theme-dark .profile-info-name {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .profile-info-value {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .profile-user-info,
      html.urppp-theme-dark .profile-user-info-striped {
        background: var(--surface) !important;
        border-color: var(--border) !important;
      }
      /* widget / 卡片 */
      html.urppp-theme-dark .widget-box,
      html.urppp-theme-dark .widget-main,
      html.urppp-theme-dark .widget-body {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .widget-header {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* 输入/分页等残留白底 */
      html.urppp-theme-dark input,
      html.urppp-theme-dark textarea,
      html.urppp-theme-dark select,
      html.urppp-theme-dark .form-control {
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .pagination > li > a,
      html.urppp-theme-dark .pagination > li > span,
      html.urppp-theme-dark .urppp-page-chip {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .pagination > li.active > a,
      html.urppp-theme-dark .pagination > li.active > span,
      html.urppp-theme-dark .urppp-page-chip-active {
        background: var(--primary) !important;
        color: #0B0F17 !important;
        border-color: var(--primary) !important;
      }
      /* modal */
      html.urppp-theme-dark .modal-content,
      html.urppp-theme-dark .modal-header,
      html.urppp-theme-dark .modal-body,
      html.urppp-theme-dark .modal-footer {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* zTree */
      html.urppp-theme-dark .ztree li a,
      html.urppp-theme-dark .urppp-ztree li a {
        color: var(--text) !important;
      }
      html.urppp-theme-dark .ztree li a:hover,
      html.urppp-theme-dark .ztree li a.curSelectedNode {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }


      /* 杂项 */
      .btn-scroll-up { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text-secondary) !important; box-shadow: var(--shadow) !important; }
      .ui-jqgrid, .ui-jqgrid-view, .ui-jqgrid-bdiv, .ui-jqgrid-hdiv { background: var(--surface) !important; border-color: var(--border) !important; }
      .ui-jqgrid .ui-jqgrid-htable th { background: var(--input-bg) !important; color: var(--text) !important; border-color: var(--border) !important; }
      .ui-jqgrid tr.jqgrow td { color: var(--text) !important; border-color: var(--border) !important; }
      .ui-jqgrid tr.ui-row-ltr:hover { background: var(--input-bg) !important; }

      /* 首页重构仪表板 */
      /* 与面包屑/page-content 同宽同边，不再二次缩进 */
      #urppp-dashboard { padding: 0 !important; max-width: none !important; width: 100% !important; margin: 0 !important; box-sizing: border-box !important; }
      .urppp-welcome { margin: 4px 0 24px; }
      .urppp-welcome h2 { font-size: 26px; font-weight: 600; color: var(--text); margin: 0 0 6px; letter-spacing: 1px; }
      .urppp-welcome p { color: var(--text-secondary); margin: 0; font-size: 14px; }
      .urppp-stats-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
      .urppp-stat-card {
        display: flex;
        align-items: center;
        gap: 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 20px 24px;
        box-shadow: var(--shadow);
        cursor: pointer;
        text-decoration: none;
        transition: transform .2s, box-shadow .2s;
      }
      .urppp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--ring); }
      .urppp-stat-card .value {
        font-size: 34px;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
        flex-shrink: 0;
      }
      .urppp-stat-card .value.urppp-stat-value-text {
        font-size: 30px;
        font-weight: 600;
      }
      .urppp-stat-card .label {
        font-size: 16px;
        color: var(--text-secondary) !important;
        line-height: 1.4;
        white-space: normal;
        max-width: 150px;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .urppp-stat-skeleton { cursor: default; pointer-events: none; }
      .urppp-stat-skeleton .value { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 48px; height: 34px; }
      .urppp-stat-skeleton .label { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 80px; height: 20px; }
      .urppp-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
      @media (max-width: 1100px) { .urppp-main-grid { grid-template-columns: 1fr; } }
      #urppp-left .urppp-card { box-shadow: none !important; }
      #urppp-left .fc-toolbar { margin: 0 0 12px 0 !important; padding: 8px 8px 0 8px !important; }
      #urppp-left .fc-toolbar .fc-center h2,
      #urppp-left .fc-toolbar h2 { display: inline-block !important; background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; padding: 6px 14px !important; font-size: 14px !important; color: var(--text) !important; box-shadow: var(--shadow) !important; }
      .urppp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; margin-bottom: 20px; }
      .urppp-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
      .urppp-card-header h4 { font-size: 16px; font-weight: 600; color: var(--text); margin: 0; }
      .urppp-card-tools .widget-toolbar { padding: 0; line-height: 1; }
      .urppp-card-tools .widget-toolbar a { color: var(--text-secondary) !important; margin-left: 12px; font-size: 14px; }
      .urppp-card-tools .widget-toolbar a:hover { color: var(--primary) !important; }
      .urppp-card-body { padding: 16px 20px; }
      #urppp-dashboard .widget-box { background: transparent; border: none; border-radius: 0; box-shadow: none; margin-bottom: 0; }
      #urppp-dashboard .widget-header { display: none; }
      #urppp-dashboard .widget-body { background: transparent; border: none; padding: 0; }
      #urppp-dashboard .tabContent { counter-reset: urppp-notice; }
      #urppp-dashboard .tabContent h3 {
        position: relative;
        margin: 0 0 6px !important;
        padding-left: 32px !important;
        height: auto !important;
        min-height: 0 !important;
        display: flex !important;
        align-items: center !important;
      }
      #urppp-dashboard .tabContent h3:last-child { margin-bottom: 0 !important; }
      #urppp-dashboard .tabContent h3::before {
        counter-increment: urppp-notice;
        content: counter(urppp-notice);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--primary);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px var(--ring);
      }
      #urppp-dashboard .tabContent h3 a {
        color: var(--text) !important;
        font-weight: 500 !important;
        font-size: 13.5px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
        padding: 8px 10px !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        transition: background .2s;
        line-height: 1.35 !important;
        min-height: 0 !important;
        height: auto !important;
        max-height: none !important;
      }
      #urppp-dashboard .tabContent h3 a:hover { background: var(--border) !important; }
      #urppp-dashboard .tabContent h3 label { font-weight: inherit !important; color: inherit !important; margin: 0 !important; }
      #urppp-dashboard .tabContent h3 a > span { display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; }
      #urppp-dashboard .tabContent h3 .hide_note { flex: 1 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; margin-right: 10px !important; }
      #urppp-dashboard .tabContent h3 .fa-clock-o { margin-right: 4px !important; color: var(--text-muted) !important; }
      /* 覆盖原站 .tabContent h3 a:link { line-height:34px } 造成的过大行距 */
      #urppp-dashboard .tabContent h3 a:link,
      #urppp-dashboard .tabContent h3 a:visited,
      #urppp-dashboard .tabContent h3 a:hover,
      #urppp-dashboard .tabContent h3 a:active {
        line-height: 1.35 !important;
        padding: 8px 10px !important;
        height: auto !important;
      }
      #urppp-dashboard .urppp-card-body:has(.btn-app),
      #urppp-dashboard .widget-main:has(.btn-app),
      #urppp-dashboard #personalApplication {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
        padding: 14px !important;
        font-size: 13px !important;
      }
      #urppp-dashboard .btn-app,
      #urppp-dashboard a.btn-app,
      #urppp-dashboard button.btn-app {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 96px !important;
        min-width: 96px !important;
        height: 92px !important;
        min-height: 92px !important;
        max-height: none !important;
        margin: 0 !important;
        border-radius: 10px !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        padding: 10px 8px !important;
        font-size: 12px !important;
        line-height: 1.25 !important;
        white-space: normal !important;
        text-align: center !important;
        transition: all .2s;
        word-break: keep-all !important;
        vertical-align: top !important;
      }
      #urppp-dashboard .btn-app:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--ring);
      }
      #urppp-dashboard .btn-app > .ace-icon,
      #urppp-dashboard .btn-app > .fa,
      #urppp-dashboard .btn-app > .glyphicon {
        color: inherit !important;
        display: block !important;
        margin: 0 0 6px !important;
        font-size: 26px !important;
        line-height: 1 !important;
        width: auto !important;
        height: auto !important;
      }
    `;
    }

    // 给表格包一层 wrapper：圆角 + 完整外框，绕过 Bootstrap thead border-top:0 和 overflow 裁剪
    cleanupStuckModals();
    patchModalOpenPath();
    // 启动时清掉侧栏/modal 上可能残留的锁定样式
    ;['curriculumInfo-divcon','curriculumInfo-divcon1','curriculumInfo-divcon2','calssInfo-divcon','classroomInfo-divcon'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el || !el.style) return;
      ['display','opacity','pointer-events','visibility'].forEach((p) => {
        if (el.style.getPropertyPriority(p) === 'important') el.style.removeProperty(p);
      });
      if (el.style.opacity === '0') el.style.removeProperty('opacity');
      if (el.style.pointerEvents === 'none') el.style.removeProperty('pointer-events');
    });
    document.querySelectorAll('.modal').forEach((m) => {
      if (m.style && m.style.getPropertyPriority('display') === 'important') m.style.removeProperty('display');
    });
    wrapTables();
    beautifyNoticeTables();
    setTimeout(beautifyNoticeTables, 300);
    setTimeout(beautifyNoticeTables, 1000);
    setTimeout(() => document.querySelectorAll('table').forEach((tb) => { if (isBusinessDataTable(tb)) stripMistakenNoticeTable(tb); }), 500);
    scheduleWeekScheduleFix();
    fixWeekScheduleLayout();
    scheduleCurriculumDrawerBeautify();
    beautifyCurriculumDrawer();
    if (!window.__urpppTableObs) {
      let wrapTimer = 0;
      window.__urpppTableObs = new MutationObserver(() => {
        clearTimeout(wrapTimer);
        wrapTimer = setTimeout(wrapTables, 50);
      });
      window.__urpppTableObs.observe(document.body, { childList: true, subtree: true });
    }
    // 首页进行组件级重构
    const pageContent = document.querySelector('.page-content');
    const hasWidgets = pageContent && pageContent.querySelectorAll('.widget-box').length >= 4;
    if (hasWidgets) {
      setTimeout(rebuildDashboard, 500);
    }

    // 完全重构侧边栏为 Hanako 风格
    rebuildSidebarCompletely();
    syncSidebarUnderNavbar();
    // 强制内容区内边距（ACE 偶发内联样式覆盖）
    document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
      el.style.setProperty('padding', '16px 64px 40px', 'important');
      el.style.setProperty('box-sizing', 'border-box', 'important');
    });
    alignRollInfoLayout();
    fixSinglePairProfileForms();
    patchAceTabNavbars();
    restyleInfoboxPercentages();
    setTimeout(restyleInfoboxPercentages, 300);
    setTimeout(restyleInfoboxPercentages, 1000);
    beautifyFreeClassroomList();
    setTimeout(beautifyFreeClassroomList, 300);
    setTimeout(beautifyFreeClassroomList, 1000);
    scheduleBeautifyPagebar();
    beautifyPagebar();
    scheduleEnsureQueryChosen();
    ensureQueryChosen();
    beautifyQueryForms();
    patchChosenDropdownAlign();
    setTimeout(beautifyQueryForms, 100);
    setTimeout(beautifyQueryForms, 300);
    setTimeout(beautifyQueryForms, 800);
    setTimeout(beautifyQueryForms, 1500);
    setTimeout(fixSinglePairProfileForms, 100);
    setTimeout(fixSinglePairProfileForms, 400);
    setTimeout(fixSinglePairProfileForms, 900);
    beautifyPlanTree();
    setTimeout(() => beautifyPlanTree(), 400);
    if (!window.__urpppPlanTreeObs) {
      let planTimer = 0;
      window.__urpppPlanTreeObs = new MutationObserver(() => {
        const t = document.getElementById('treeDemo');
        if (!t || t.dataset.urpppBusy === '1') return;
        // 没有未处理节点就不动
        if (!t.querySelector('li > a:not([data-urppp-node-done="1"])')) return;
        clearTimeout(planTimer);
        planTimer = setTimeout(() => beautifyPlanTree(), 220);
      });
      const treeHost = document.getElementById('tree_div') || document.getElementById('treeDemo');
      if (treeHost) {
        window.__urpppPlanTreeObs.observe(treeHost, { childList: true, subtree: true });
      }
    }
    // 作息时间表：仅轻量样式，不改内容
    if (!window.__urpppWrsBound) {
      window.__urpppWrsBound = true;
      document.addEventListener('shown.bs.modal', (e) => {
        if (e.target && (e.target.id === 'work_rest_schedule_modal' || e.target.querySelector?.('#work_rest_schedule_modal'))) {
          setTimeout(beautifyWorkRestSchedule, 30);
        }
      }, true);
      document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a,button') : null;
        if (!a) return;
        const onclick = a.getAttribute('onclick') || '';
        const txt = (a.textContent || '').trim();
        if (onclick.includes('openWorkRestSchedule') || txt.includes('作息时间表')) {
          setTimeout(beautifyWorkRestSchedule, 80);
          setTimeout(beautifyWorkRestSchedule, 300);
        }
      }, true);
    }
    beautifyBreadcrumbs();
    setTimeout(alignRollInfoLayout, 200);
    setTimeout(patchAceTabNavbars, 200);
    setTimeout(alignRollInfoLayout, 600);
    setTimeout(patchAceTabNavbars, 600);
    setTimeout(alignRollInfoLayout, 1200);
    setTimeout(patchAceTabNavbars, 1200);
        setTimeout(beautifyBreadcrumbs, 200);
    setTimeout(beautifyBreadcrumbs, 600);
    setTimeout(beautifyBreadcrumbs, 1500);
    window.addEventListener('load', () => setTimeout(beautifyBreadcrumbs, 100));

    // 顶栏重建（JS 强制对齐）
    rebuildNavbar();
    patchSchoolCalendarLink();
    window.addEventListener('load', () => { rebuildNavbar(); injectNavbarThemeSwitch(); patchSchoolCalendarLink(); });

    setTimeout(() => { document.body.classList.add('urppp-ready'); hideBootLoader(); }, 600);

    console.log('[URP++] style applied v0.5.11');

    // 课表背景段落不透明度 50%（卡片用 CSS opacity 处理）
    (function courseTableOpacity() {
      const apply = () => {
        const tbl = document.getElementById('courseTable');
        if (!tbl) return;
        tbl.querySelectorAll('td').forEach(td => {
          const bg = td.style.backgroundColor;
          if (bg && bg.includes('rgba')) {
            const m = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
            if (m) td.style.backgroundColor = 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',0.5)';
          }
        });
      };
      apply();
      new MutationObserver(() => requestAnimationFrame(apply)).observe(document.body, { childList: true, subtree: true });
    })();

    // 课表背景卡片高度对齐（CSS translateY 处理）
  }

  // ============================================================
  // 顶栏重建（JS 强制对齐）
  // ============================================================

  let navbarClickBound = false;


  function syncNavbarThemeUI() {
    const wrap = document.getElementById('urppp-nav-theme');
    if (!wrap) return;
    const ct = getCurrent();
    wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((d) => {
      d.classList.toggle('ac', d.dataset.theme === ct);
    });
    const customDot = wrap.querySelector('.urppp-nav-dot[data-theme="scu-red"], .urppp-nav-dot[data-role="accent"]');
    const acc = getAccent() || '#B53434';
    const last = wrap.querySelector('.urppp-nav-dot[data-theme="scu-red"]');
    if (last) {
      // 第三个主题点：有自定义强调色时显示自定义色，否则川大红
      const themeAccent = (ct === 'scu-red' || ct === 'default') ? (getAccent() || (ct === 'scu-red' ? '#B53434' : '#1E3A5F')) : (ct === 'dark' ? '#93A8C7' : acc);
      if (ct === 'scu-red') last.style.background = getAccent() || '#B53434';
      else if (ct === 'default') {
        // default 主题点保持浅灰底；第三个仍显示川大/自定义
        last.style.background = getAccent() || '#B53434';
      } else {
        last.style.background = getAccent() || '#B53434';
      }
    }
    const colorInput = document.getElementById('urppp-nav-color');
    const hexInput = document.getElementById('urppp-nav-hex');
    if (colorInput) colorInput.value = (getAccent() || '#B53434');
    if (hexInput) hexInput.value = (getAccent() || '#B53434');
    renderNavbarAccentPresets();
  }

  function renderNavbarAccentPresets() {
    const box = document.getElementById('urppp-nav-presets');
    if (!box) return;
    const list = getAccentPresets();
    box.innerHTML = '';
    list.forEach((hex) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'urppp-pop-preset';
      b.title = hex;
      b.style.background = hex;
      b.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('x')) return;
        GM_setValue(ACCENT_KEY, hex);
        applyTheme('scu-red');
        syncNavbarThemeUI();
      });
      const x = document.createElement('span');
      x.className = 'x';
      x.textContent = '×';
      x.title = '删除预设';
      x.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeAccentPreset(hex);
        renderNavbarAccentPresets();
      });
      b.appendChild(x);
      box.appendChild(b);
    });
  }

  function injectNavbarThemeSwitch() {
    try {
      const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
      if (!navbar) return;
      if (document.getElementById('urppp-nav-theme')) {
        syncNavbarThemeUI();
        return;
      }
      // 放在品牌标题右侧
      const brand =
        navbar.querySelector('.navbar-header .navbar-brand') ||
        navbar.querySelector('.navbar-brand') ||
        navbar.querySelector('.navbar-header');
      if (!brand) return;

      const wrap = document.createElement('div');
      wrap.id = 'urppp-nav-theme';
      wrap.innerHTML = [
        '<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="自定义" style="background:#B53434"></button>',
        '<button type="button" class="urppp-nav-edit" id="urppp-nav-theme-edit" title="编辑主题色">✎</button>',
        '<div id="urppp-nav-theme-pop" role="dialog" aria-label="编辑主题色">',
        '  <div class="urppp-pop-title">自定义主题色</div>',
        '  <div class="urppp-pop-row">',
        '    <input type="color" id="urppp-nav-color" value="#B53434" />',
        '    <input type="text" id="urppp-nav-hex" maxlength="7" value="#B53434" spellcheck="false" />',
        '  </div>',
        '  <div class="urppp-pop-actions">',
        '    <button type="button" class="urppp-pop-btn primary" id="urppp-nav-apply">应用</button>',
        '    <button type="button" class="urppp-pop-btn" id="urppp-nav-save-preset">保存预设</button>',
        '  </div>',
        '  <div class="urppp-pop-title">已保存预设</div>',
        '  <div class="urppp-pop-presets" id="urppp-nav-presets"></div>',
        '</div>'
      ].join('');

      // 插到 brand 后面（同一 header 内），并垂直居中
      if (brand.parentElement) {
        brand.parentElement.style.setProperty('display', 'flex', 'important');
        brand.parentElement.style.setProperty('align-items', 'center', 'important');
        if (brand.nextSibling) brand.parentElement.insertBefore(wrap, brand.nextSibling);
        else brand.parentElement.appendChild(wrap);
      } else {
        brand.appendChild(wrap);
      }
      wrap.style.setProperty('display', 'inline-flex', 'important');
      wrap.style.setProperty('align-items', 'center', 'important');
      wrap.style.setProperty('height', '36px', 'important');

      wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((dot) => {
        dot.addEventListener('click', () => {
          // 简约白/深邃暗：只切主题，不叠加自定义表面
          // 自定义：切 scu-red 并应用已保存 accent（若无则川大红默认）
          applyTheme(dot.dataset.theme);
          syncNavbarThemeUI();
        });
      });

      const pop = wrap.querySelector('#urppp-nav-theme-pop');
      const editBtn = wrap.querySelector('#urppp-nav-theme-edit');
      const colorInput = wrap.querySelector('#urppp-nav-color');
      const hexInput = wrap.querySelector('#urppp-nav-hex');
      const applyBtn = wrap.querySelector('#urppp-nav-apply');
      const saveBtn = wrap.querySelector('#urppp-nav-save-preset');

      const openPop = () => {
        const acc = getAccent() || '#B53434';
        if (colorInput) colorInput.value = acc;
        if (hexInput) hexInput.value = acc;
        renderNavbarAccentPresets();
        pop.classList.add('open');
      };
      const closePop = () => pop.classList.remove('open');

      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pop.classList.contains('open')) closePop();
        else openPop();
      });
      pop.addEventListener('click', (e) => e.stopPropagation());
      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) closePop();
      });

      const normalizeHex = (v) => {
        let s = String(v || '').trim();
        if (!s) return '';
        if (s[0] !== '#') s = '#' + s;
        if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toUpperCase();
        return '';
      };

      colorInput.addEventListener('input', () => {
        hexInput.value = colorInput.value.toUpperCase();
      });
      hexInput.addEventListener('change', () => {
        const h = normalizeHex(hexInput.value);
        if (h) {
          hexInput.value = h;
          colorInput.value = h;
        }
      });
      applyBtn.addEventListener('click', () => {
        const h = normalizeHex(hexInput.value) || colorInput.value;
        if (!h) return;
        GM_setValue(ACCENT_KEY, h);
        applyTheme('scu-red'); // 自定义主题 + 整套表面
        syncNavbarThemeUI();
        closePop();
      });
      saveBtn.addEventListener('click', () => {
        const h = normalizeHex(hexInput.value) || colorInput.value;
        if (!h) return;
        GM_setValue(ACCENT_KEY, h);
        saveAccentPreset(h);
        applyTheme('scu-red');
        renderNavbarAccentPresets();
        syncNavbarThemeUI();
      });

      syncNavbarThemeUI();
    } catch (err) {
      console.warn('[URP++] navbar theme switch inject failed', err);
    }
  }
  function rebuildNavbar() {
    const navbar = document.getElementById('navbar');
    const aceNav = navbar?.querySelector('.ace-nav');
    // 主题切换不依赖 ace-nav，尽早注入
    try { injectNavbarThemeSwitch(); } catch (_) {}
    if (!aceNav) return;

    function force(el, styles) {
      Object.entries(styles).forEach(([k, v]) => el.style.setProperty(k, v, 'important'));
    }

    // 1. 统一所有 li 和 a 的容器样式；移除 ace-nav 中的空白文本节点消除 inline 间距
    Array.from(aceNav.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        node.remove();
      }
    });
    aceNav.querySelectorAll(':scope > li').forEach(li => {
      force(li, {
        display: 'inline-flex',
        'align-items': 'center',
        'vertical-align': 'middle',
        margin: '0',
        padding: '0',
        'text-align': 'left'
      });
    });

    aceNav.querySelectorAll(':scope > li > a').forEach(a => {
      force(a, {
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        height: '36px',
        padding: '0 4px',
        'flex-wrap': 'nowrap',
        'vertical-align': 'middle',
        'text-decoration': 'none'
      });
      a.style.lineHeight = '1';
    });

    // 2. 图标统一
    aceNav.querySelectorAll(':scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa').forEach(icon => {
      force(icon, { top: 'auto', 'vertical-align': 'middle', 'line-height': '1', 'margin-top': '0' });
    });

    // 客服图标所在的 a 标签保持最小宽度
    const serviceLink = aceNav.querySelector(':scope > li > a[href*="customerServiceCenter"]');
    if (serviceLink) {
      force(serviceLink, { width: '28px', 'justify-content': 'center' });
      serviceLink.style.padding = '0 4px';
    }

    // 3. 搜索区域（事件只绑定一次）
    const clickDiv = document.getElementById('clickdiv');
    const formSearch = document.getElementById('form-search');
    const searchInput = document.getElementById('search-input');
    const intelDiv = document.getElementById('intellegenceUDiv');
    if (intelDiv) {
      intelDiv.style.setProperty('position', 'relative', 'important');
      intelDiv.style.setProperty('z-index', '30', 'important');
      intelDiv.style.setProperty('display', 'inline-flex', 'important');
      intelDiv.style.setProperty('align-items', 'center', 'important');
      intelDiv.style.setProperty('justify-content', 'center', 'important');
      intelDiv.style.setProperty('width', '32px', 'important');
      intelDiv.style.setProperty('height', '36px', 'important');
      intelDiv.style.setProperty('vertical-align', 'middle', 'important');
      intelDiv.style.setProperty('margin', '0', 'important');
      intelDiv.style.setProperty('padding', '0', 'important');
    }

    if (clickDiv && formSearch) {
      clickDiv.removeAttribute('onclick');
      force(clickDiv, {
        'background-color': 'transparent',
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        width: '32px',
        height: '32px',
        'border-radius': '8px',
        'line-height': '1',
        'z-index': '30'
      });

      const clicki = document.getElementById('clicki');
      if (clicki) force(clicki, { color: 'var(--text-secondary)', 'margin-top': '0' });

      if (!navbarClickBound) {
        navbarClickBound = true;
        clickDiv.addEventListener('mouseenter', () => clickDiv.style.setProperty('background-color', 'var(--input-bg)', 'important'));
        clickDiv.addEventListener('mouseleave', () => clickDiv.style.setProperty('background-color', 'transparent', 'important'));

        clickDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = formSearch.dataset.open === '1';
          if (isOpen) {
            formSearch.style.width = '0px';
            formSearch.style.opacity = '0';
            formSearch.dataset.open = '0';
          } else {
            formSearch.style.width = '180px';
            formSearch.style.opacity = '1';
            formSearch.dataset.open = '1';
            if (searchInput) setTimeout(() => searchInput.focus(), 50);
          }
        });

        document.addEventListener('click', (e) => {
          if (!clickDiv.contains(e.target) && !formSearch.contains(e.target) && formSearch.dataset.open === '1') {
            formSearch.style.width = '0px';
            formSearch.style.opacity = '0';
            formSearch.dataset.open = '0';
          }
        });
      }

      // 定位：紧贴搜索按钮左侧，按钮本身 32px，搜索框 160px
      force(formSearch, {
        position: 'absolute',
        right: '34px',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 'auto',
        margin: '0',
        'z-index': '10',
        background: 'transparent',
        border: 'none',
        'box-shadow': 'none',
        overflow: 'hidden',
        padding: '0',
        transition: 'width .2s ease, opacity .2s ease'
      });
      // 注意：不要在 force 里覆盖 width/opacity，否则会打断正在进行的 transition
      const targetWidth = formSearch.dataset.open === '1' ? '160px' : '0px';
      if (formSearch.style.width !== targetWidth) {
        formSearch.style.width = targetWidth;
        formSearch.style.opacity = formSearch.dataset.open === '1' ? '1' : '0';
      }

      if (searchInput) {
        force(searchInput, {
          'background-color': 'var(--input-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          'border-radius': '8px',
          height: '32px',
          padding: '0 12px',
          'line-height': '32px',
          width: '100%'
        });
      }

      const innerIcon = formSearch.querySelector('.input-icon > .ace-icon.fa-search');
      if (innerIcon) innerIcon.style.display = 'none';
    }

    // 4. 用户项强制对齐
    const userLink = aceNav.querySelector(':scope > li.light-blue > a');
    if (userLink) {
      force(userLink, { display: 'inline-flex', 'align-items': 'center', gap: '6px' });
      const info = userLink.querySelector('.user-info');
      if (info) {
        force(info, {
          display: 'inline-flex',
          'align-items': 'center',
          gap: '4px',
          'max-width': 'none',
          'white-space': 'nowrap',
          'vertical-align': 'middle',
          'line-height': '1',
          'margin-top': '-12px'
        });
        // 移除文本节点中的多余空白
        Array.from(info.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s+/g, '').trim();
        });
        Array.from(info.children).forEach(child => {
          force(child, { display: 'inline', 'white-space': 'nowrap', 'vertical-align': 'middle', 'line-height': '1', margin: '0', padding: '0' });
          if (child.tagName === 'SMALL') child.style.setProperty('font-size', 'inherit', 'important');
        });
      }
      const photo = userLink.querySelector('.nav-user-photo');
      if (photo) {
        photo.alt = (photo.alt || '').replace(/\s+/g, '').trim();
        force(photo, { 'vertical-align': 'middle', display: 'inline-block', width: '30px', height: '30px' });
      }
    }
  }

  // ============================================================
  // 侧边栏完全重构（Hanako 风格）
  // ============================================================



  function syncMobileContentOffset() {
    try {
      const sidebar = document.getElementById('sidebar');
      const mains = document.querySelectorAll('.main-content');
      if (!mains.length) return;
      const narrow = window.matchMedia && window.matchMedia('(max-width: 991px)').matches;
      let ml = '260px';
      if (narrow) {
        // 小屏侧栏是覆盖层，内容始终贴左
        ml = '0px';
      } else if (sidebar) {
        // 桌面：只跟 menu-min / 展开走
        ml = sidebar.classList.contains('menu-min') ? '50px' : '260px';
      }
      mains.forEach((el) => el.style.setProperty('margin-left', ml, 'important'));
    } catch (_) { /* ignore */ }
  }
  function syncSidebarUnderNavbar() {
    try {
      const sidebar = document.getElementById('sidebar');
      const navbar = document.querySelector('#navbar, .navbar.navbar-default, .navbar-fixed-top');
      if (!sidebar || !navbar) return;
      // 用底边实测，避免 min-height 与真实高度不一致
      const rect = navbar.getBoundingClientRect();
      const nh = Math.max(45, Math.round(rect.height || navbar.offsetHeight || 45));
      document.documentElement.style.setProperty('--urppp-navbar-height', nh + 'px');
      sidebar.style.setProperty('top', nh + 'px', 'important');
      sidebar.style.setProperty('height', 'calc(100vh - ' + nh + 'px)', 'important');
      sidebar.style.setProperty('margin-top', '0', 'important');
      // 顶栏压过侧栏
      navbar.style.setProperty('z-index', '1100', 'important');
      sidebar.style.setProperty('z-index', '1030', 'important');
      syncMobileContentOffset();
    } catch (_) { /* ignore */ }
  }
  function rebuildSidebarCompletely() {
    const sidebar = document.getElementById('sidebar');
    const origMenus = document.getElementById('menus');
    if (!sidebar || !origMenus) return;

    // 先清理旧的（可能从 PJAX 残留）
    const oldMenus = document.getElementById('urppp-menus');
    const oldHeader = sidebar.querySelector('.urppp-sidebar-header');
    if (oldMenus) oldMenus.remove();
    if (oldHeader) oldHeader.remove();

    // 读取顶栏高度并同步：侧栏顶边紧贴顶栏底边
    syncSidebarUnderNavbar();

    // 记录原 active 状态
    const activeIds = new Set();
    origMenus.querySelectorAll('li.active').forEach(li => { if (li.id) activeIds.add(li.id); });

    function parseMenu(ul) {
      return Array.from(ul.children).filter(li => li.tagName === 'LI').map(li => {
        const a = li.querySelector(':scope > a');
        const textEl = a?.querySelector('.menu-text');
        const text = textEl
          ? textEl.textContent.trim()
          : (a ? Array.from(a.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim() : '');
        const iconEl = a?.querySelector('.menu-icon');
        const iconClass = iconEl ? Array.from(iconEl.classList).filter(c => c !== 'menu-icon').join(' ') : '';
        const submenu = li.querySelector(':scope > .submenu');
        let children = submenu ? parseMenu(submenu) : [];
        // 过滤空壳子节点（无文字且无有效 href）
        children = children.filter(c => c.text && (c.text.trim() || (c.href && c.href !== '#')));
        const href = a?.getAttribute('href') || '#';
        const onclick = li.getAttribute('onclick') || a?.getAttribute('onclick') || '';
        const id = li.id;
        // 有真实 href 的节点：忽略子菜单，直接当叶子
        if (href !== '#' && !href.startsWith('javascript')) {
          return { id, text, iconClass, children: [], href, onclick };
        }

        // 单叶子子菜单提升：父节点直接变成跳转节点，不再展开
        if (children.length === 1 && children[0].children.length === 0) {
          return {
            id: id || children[0].id,
            text,
            iconClass: iconClass || children[0].iconClass,
            children: [],
            href: children[0].href || href,
            onclick: children[0].onclick || onclick
          };
        }
        return { id, text, iconClass, children, href, onclick };
      });
    }

    const menuData = parseMenu(origMenus);
    origMenus.style.display = 'none';

    // Header + toggle
    const header = document.createElement('div');
    header.className = 'urppp-sidebar-header';
    header.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)';
    const toggle = document.createElement('div');
    toggle.className = 'urppp-sidebar-toggle';
    toggle.innerHTML = '<i class="fa fa-angle-left"></i>';
    toggle.title = '收起侧边栏';
    const doToggle = () => {
      const origToggle = document.getElementById('sidebar-collapse');
      if (origToggle) origToggle.click();
    };
    toggle.addEventListener('click', doToggle);
    header.appendChild(toggle);

    // 监听折叠状态，切换箭头
    const observer = new MutationObserver(() => {
      const isMin = document.body.classList.contains('menu-min') || sidebar.classList.contains('menu-min');
      toggle.innerHTML = isMin ? '<i class="fa fa-angle-right"></i>' : '<i class="fa fa-angle-left"></i>';
      toggle.title = isMin ? '展开侧边栏' : '收起侧边栏';
      if (isMin) {
        header.style.justifyContent = 'center';
        header.style.padding = '12px 0';
      } else {
        header.style.justifyContent = 'flex-end';
        header.style.padding = '';
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

    const newMenus = document.createElement('ul');
    newMenus.id = 'urppp-menus';
    newMenus.style.cssText = 'margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)';

    function setActiveBranch(li) {
      document.querySelectorAll('#urppp-menus .urppp-nav-item').forEach(el => el.classList.remove('active'));
      let p = li;
      while (p && p.id !== 'urppp-menus') {
        if (p.classList.contains('urppp-nav-item')) p.classList.add('active');
        p = p.parentElement;
      }
    }

    function openActiveBranch(li) {
      let p = li.parentElement;
      while (p && p.id !== 'urppp-menus') {
        if (p.classList.contains('urppp-nav-item')) p.classList.add('open');
        p = p.parentElement;
      }
    }

    function buildItem(item, container) {
      const li = document.createElement('li');
      li.className = 'urppp-nav-item';
      if (item.id) li.id = item.id;

      const hasSub = item.children.length > 0;
      const href = item.href || '#';
      const hasRealHref = href !== '#' && !href.startsWith('javascript');
      // 有真实 href 或有子菜单时都用 a 标签
      const link = document.createElement('a');
      link.className = 'urppp-nav-link';
      link.href = hasRealHref ? href : 'javascript:void(0)';

      if (item.iconClass) {
        const icon = document.createElement('i');
        item.iconClass.split(' ').forEach(c => { if (c) icon.classList.add(c); });
        link.appendChild(icon);
      }

      const text = document.createElement('span');
      text.className = 'urppp-nav-text';
      text.textContent = item.text;
      text.title = item.text;
      link.appendChild(text);

      if (hasSub) {
        const arrow = document.createElement('i');
        arrow.className = 'urppp-nav-arrow fa fa-angle-down';
        arrow.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('open');
        });
        link.appendChild(arrow);
      }

      li.appendChild(link);

      link.addEventListener('click', (e) => {
        setActiveBranch(li);
        if (!hasRealHref && hasSub) {
          // 无真实 href 的父节点：点击 toggle
          e.preventDefault();
          li.classList.toggle('open');
        } else if (hasRealHref) {
          // 有真实 href 且点击的不是箭头：跳转
          return;
        }
      });

      if (hasSub) {
        const sub = document.createElement('ul');
        sub.className = 'urppp-nav-submenu';
        item.children.forEach(child => buildItem(child, sub));
        li.appendChild(sub);
      }

      if (item.id && activeIds.has(item.id)) {
        li.classList.add('active');
        // 不再默认展开 active 分支，保持侧边栏整洁
      }

      container.appendChild(li);
    }

    menuData.forEach(item => buildItem(item, newMenus));
    // 强制清除所有 open 状态，避免默认展开
    newMenus.querySelectorAll('.urppp-nav-item.open').forEach(li => li.classList.remove('open'));

    sidebar.insertBefore(header, sidebar.firstChild);
    sidebar.appendChild(newMenus);
  }

  // ============================================================
  // 首页仪表板重构
  // ============================================================

  function rebuildDashboard() {
    if (document.getElementById('urppp-dashboard')) return;

    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    const widgets = Array.from(pageContent.querySelectorAll('.widget-box'));
    if (widgets.length < 6) return;

    const studyWidget = widgets[4];
    const infoboxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];

    const dashboard = document.createElement('div');
    dashboard.id = 'urppp-dashboard';
    dashboard.innerHTML = `
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `;

    pageContent.appendChild(dashboard);

    // 提取 modal 到 body，避免隐藏原始 row 后弹窗失效
    const warningModal = pageContent.querySelector('#warningInfo');
    if (warningModal) document.body.appendChild(warningModal);

    // 隐藏原始 widget 所在的容器列
    widgets.forEach(w => {
      const col = w.closest('.widget-container-col, [class*="col-"]');
      if (col) col.style.display = 'none';
    });
    // 兜底：隐藏 page-content 下直接的一级 row
    pageContent.querySelectorAll(':scope > .row').forEach(row => {
      row.style.display = 'none';
    });

    // 生成学业概览卡片（骨架屏 → 真实数据）
    const statsGrid = dashboard.querySelector('#urppp-stats');
    const skeletonCount = Math.max(infoboxes.length, 5);
    for (let i = 0; i < skeletonCount; i++) {
      const sk = document.createElement('div');
      sk.className = 'urppp-stat-card urppp-stat-skeleton';
      sk.innerHTML = '<div class="value">-</div><div class="label">加载中</div>';
      statsGrid.appendChild(sk);
    }

    function updateStats() {
      const boxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];
      if (boxes.length === 0) return;
      statsGrid.innerHTML = '';
      boxes.forEach(box => {
        const lines = box.innerText.trim().split(/\n+/).map(l => l.trim()).filter(l => l);
        const value = lines[0] || '';
        const label = lines.slice(1).join(' ').replace(/更多\.\.\./g, '').trim();
        const isTextValue = /[\u4e00-\u9fa5]/.test(value) || value.length > 5;
        const valueClass = isTextValue ? 'value urppp-stat-value-text' : 'value';
        const link = box.closest('a');
        const card = document.createElement(link ? 'a' : 'div');
        if (link) {
          card.href = link.href || 'javascript:void(0)';
          card.onclick = link.onclick;
          card.style.textDecoration = 'none';
        }
        card.className = 'urppp-stat-card';
        card.innerHTML = `<div class="${valueClass}">${value}</div><div class="label">${label}</div>`;
        statsGrid.appendChild(card);
      });
    }

    updateStats();

    // 监听学业信息数据异步加载
    if (studyWidget) {
      const statsObserver = new MutationObserver(() => updateStats());
      statsObserver.observe(studyWidget, { childList: true, subtree: true });
      setTimeout(() => statsObserver.disconnect(), 5000);
    }

    // 包装并移动 widget
    const left = dashboard.querySelector('#urppp-left');
    const right = dashboard.querySelector('#urppp-right');

    wrapWidget(widgets[5], left, '我的日程安排');
    wrapWidget(widgets[0], right, '通知公告');
    wrapWidget(widgets[1], right, '我的待办任务');
    wrapWidget(widgets[2], right, '可申请业务');
    wrapWidget(widgets[3], right, '常用下载');

    if (studyWidget) studyWidget.style.display = 'none';

    // FullCalendar 重新渲染
    setTimeout(() => {
      const fcEl = left.querySelector('.fc');
      if (fcEl && window.jQuery && window.jQuery.fn.fullCalendar) {
        try { window.jQuery(fcEl).fullCalendar('render'); } catch (e) {}
      }
    }, 200);

    console.log('[URP++] 首页仪表板已重构');
  }

  function wrapWidget(widget, container, title) {
    const header = widget.querySelector('.widget-header');
    const toolbar = header ? header.querySelector('.widget-toolbar') : null;

    const card = document.createElement('div');
    card.className = 'urppp-card';
    card.innerHTML = `
      <div class="urppp-card-header">
        <h4>${title}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `;

    if (toolbar) {
      toolbar.style.display = 'inline-block';
      card.querySelector('.urppp-card-tools').appendChild(toolbar);
    }
    card.querySelector('.urppp-card-body').appendChild(widget);
    container.appendChild(card);
  }

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    if (!document.body) { setTimeout(init, 10); return; }
    applyTheme(getCurrent());

    // 阻止 Chosen 搜索框聚焦时自动滚动页面/容器，避免下拉展开后内容被抬高
    document.addEventListener('focusin', (e) => {
      const t = e.target;
      if (!t || !t.matches || !t.matches('.chosen-search input')) return;
      const scrollers = [];
      let p = t.parentElement;
      while (p) {
        const st = p.scrollTop;
        const sl = p.scrollLeft;
        if (st || sl || p.scrollHeight > p.clientHeight || p.scrollWidth > p.clientWidth) {
          scrollers.push({ el: p, top: st, left: sl });
        }
        p = p.parentElement;
      }
      requestAnimationFrame(() => {
        scrollers.forEach(s => { s.el.scrollTop = s.top; s.el.scrollLeft = s.left; });
      });
    }, true);

    // 根据是否存在登录表单判断页面类型
    const isLoginPage = !!document.getElementById('formContent') && !!document.querySelector('.form-signin');
    if (isLoginPage) {
      rebuild();
    } else {
      beautifyInternal();
    }
  }

  // 监听 PJAX/AJAX 路由变化，重新执行美化

  if (!window.__urpppSidebarSyncBound) {
    window.__urpppSidebarSyncBound = true;
    window.addEventListener('resize', () => {
      clearTimeout(window.__urpppSidebarSyncTimer);
      window.__urpppSidebarSyncTimer = setTimeout(syncSidebarUnderNavbar, 50);
    });
    window.addEventListener('load', () => {
      syncSidebarUnderNavbar();
      syncMobileContentOffset();
      setTimeout(syncSidebarUnderNavbar, 100);
      setTimeout(syncSidebarUnderNavbar, 400);
    });
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest
        ? e.target.closest('#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse')
        : null;
      if (!t) return;
      // 等 ACE / 我们自己的 class 切换完成后再同步
      setTimeout(syncMobileContentOffset, 0);
      setTimeout(syncMobileContentOffset, 50);
      setTimeout(syncMobileContentOffset, 200);
    }, true);
    // 侧栏 class（menu-min / display）变化时同步内容边距
    const side = document.getElementById('sidebar');
    if (side && !side.__urpppMarginObs) {
      side.__urpppMarginObs = new MutationObserver(() => {
        clearTimeout(window.__urpppMarginObsTimer);
        window.__urpppMarginObsTimer = setTimeout(syncMobileContentOffset, 30);
      });
      side.__urpppMarginObs.observe(side, { attributes: true, attributeFilter: ['class', 'style'] });
    }
  }
  function watchRouteChanges() {
    const run = () => {
      setTimeout(() => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        syncSidebarUnderNavbar();
        rebuildSidebarCompletely();
        rebuildNavbar();
        patchSchoolCalendarLink();
        wrapTables();
        document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
          el.style.setProperty('padding', '16px 64px 40px', 'important');
          el.style.setProperty('box-sizing', 'border-box', 'important');
        });
        alignRollInfoLayout();
        patchAceTabNavbars();
        restyleInfoboxPercentages();
        setTimeout(restyleInfoboxPercentages, 300);
        setTimeout(restyleInfoboxPercentages, 1000);
        scheduleEnsureQueryChosen();
        ensureQueryChosen();
        beautifyQueryForms();
        patchChosenDropdownAlign();
        setTimeout(beautifyQueryForms, 300);
        beautifyPlanTree();
        setTimeout(() => beautifyPlanTree(), 500);
        beautifyBreadcrumbs();
      }, 100);
    };
    window.addEventListener('popstate', run);
    window.addEventListener('hashchange', run);
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) { origPush.apply(this, args); setTimeout(run, 100); };
    history.replaceState = function (...args) { origReplace.apply(this, args); setTimeout(run, 100); };
  }

  // 全局 API
  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  global.urppp = {
    version: '0.5.11',
    showLogo(show) {
      const el = document.querySelector('#urppp-brand .ub-logo');
      if (el) el.classList.toggle('show', show);
    },
    theme: {
      apply: (n) => { applyTheme(n); },
      setAccent: applyAccent,
      getAccent,
      getCurrent,
      list: () => Object.entries(THEMES).map(([k, v]) => ({ name: k, displayName: v.name, current: k === getCurrent() })),
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); watchRouteChanges(); });
  } else {
    init();
    watchRouteChanges();
  }
})();
