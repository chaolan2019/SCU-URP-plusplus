// ==UserScript==
// @name         URP++ 教务系统美化
// @namespace    https://github.com/hanako/urp-plus
// @version      0.4.5
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
        '--border': '#E2E8F0', '--border-focus': 'var(--urppp-accent, #1E3A5F)',
        '--input-bg': '#F8FAFC', '--primary': 'var(--urppp-accent, #1E3A5F)', '--primary-hover': 'var(--urppp-accent-hover, #162D4A)',
        '--ring': 'var(--urppp-accent-ring, rgba(30,58,95,0.15))',
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
        '--border': '#F0E0DE', '--border-focus': '#B53434',
        '--input-bg': '#FEFCFB', '--primary': '#B53434', '--primary-hover': '#962929',
        '--ring': 'rgba(181,52,52,0.12)',
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

  function alpha(hex, a) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ============================================================
  // 主题管理
  // ============================================================

  function applyAccent(hex) {
    if (!hex) return;
    const hover = darken(hex, 0.15);
    const ring = alpha(hex, 0.15);
    GM_setValue(ACCENT_KEY, hex);
    document.documentElement.style.setProperty('--urppp-accent', hex);
    document.documentElement.style.setProperty('--urppp-accent-hover', hover);
    document.documentElement.style.setProperty('--urppp-accent-ring', ring);
  }

  function getAccent() { return GM_getValue(ACCENT_KEY, ''); }

  function applyTheme(name) {
    const t = THEMES[name] || THEMES['default'];
    GM_setValue(THEME_KEY, name);
    const el = document.getElementById('urppp-theme-vars') || (() => {
      const e = document.createElement('style'); e.id = 'urppp-theme-vars';
      const host = document.head || document.documentElement;
      host.appendChild(e); return e;
    })();
    let css = ':root {';
    for (const [k, v] of Object.entries(t.vars)) css += `${k}:${v};`;
    css += '}';
    el.textContent = css;
    if (document.body) document.body.style.fontFamily = t.font;
    applyAccent(getAccent());
    // 同步启动遮罩字体
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
          content:'URP++ v0.4.5';
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
  function alignRollInfoLayout() {
    const page = document.querySelector('.page-content') || document.getElementById('page-content-template');
    if (!page) return;

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
  // 作息时间表：尽量做成干净表格；解析稳才重建，否则只样式原表
  function beautifyWorkRestSchedule() {
    try {
      const modal = document.getElementById('work_rest_schedule_modal');
      if (!modal) return;
      if (modal.classList.contains('in') || modal.classList.contains('show')) {
        modal.style.setProperty('display', 'block', 'important');
      }
      const body = modal.querySelector('.modal-body') || modal;
      let table = body.querySelector('table');
      if (!table) return;
      if (table.dataset.urpppWrsBuilt === '1') return;

      // 拆误包 wrapper
      const wrap = table.closest('.urppp-table-wrap');
      if (wrap && modal.contains(wrap) && wrap.parentElement) {
        wrap.parentElement.insertBefore(table, wrap);
        wrap.remove();
        table = body.querySelector('table') || table;
      }

      const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const isPeriod = (t) => /^(上午|下午|晚上|中午)$/.test(t);
      const isTime = (t) => /\d{1,2}\s*:\s*\d{2}/.test(t);
      const isSection = (t) => /第?\s*\d{1,2}\s*节/.test(t) || /^\d{1,2}$/.test(t);
      const fmtSection = (t) => {
        const n = String(t).match(/(\d{1,2})/);
        if (!n) return t;
        return '第' + n[1].padStart(2, '0') + '节课';
      };
      const fmtTime = (t) => norm(t).replace(/\s*[-~—–至到]+\s*/g, ' - ').replace(/\s*:\s*/g, ':');

      // 展开成矩阵（rowspan/colspan 填满）
      const srcRows = Array.from(table.rows || []);
      if (!srcRows.length) return;
      const matrix = [];
      const filled = {};
      srcRows.forEach((tr, r) => {
        if (!matrix[r]) matrix[r] = [];
        let c = 0;
        Array.from(tr.cells || []).forEach((cell) => {
          while (filled[r + ',' + c]) c++;
          const rs = cell.rowSpan || 1;
          const cs = cell.colSpan || 1;
          const text = norm(cell.textContent);
          for (let i = 0; i < rs; i++) {
            for (let j = 0; j < cs; j++) {
              const rr = r + i, cc = c + j;
              if (!matrix[rr]) matrix[rr] = [];
              matrix[rr][cc] = {
                text,
                master: i === 0 && j === 0,
                rs: i === 0 && j === 0 ? rs : 1,
                cs: i === 0 && j === 0 ? cs : 1,
              };
              filled[rr + ',' + cc] = true;
            }
          }
          c += cs;
        });
      });
      const colCount = matrix.reduce((m, row) => Math.max(m, row.length), 0);
      matrix.forEach((row) => {
        for (let i = 0; i < colCount; i++) {
          if (!row[i]) row[i] = { text: '', master: false, rs: 1, cs: 1 };
        }
      });

      // 找标题、表头
      let title = '作息时间表';
      let headIdx = -1;
      let colHeads = [];
      matrix.forEach((row, ri) => {
        const texts = row.map((c) => c.text).filter(Boolean);
        const joined = texts.join(' ');
        if (ri <= 2 && /作息时间|学年/.test(joined)) {
          title = texts.find((t) => /作息时间|学年/.test(t)) || title;
        }
        if (headIdx < 0 && /节次/.test(joined) && /(望江|华西|江安|校区)/.test(joined)) {
          headIdx = ri;
          // 表头：去掉时段/节次，保留校区列
          colHeads = texts.filter((t) => t !== '节次' && !isPeriod(t) && !/时段/.test(t));
        }
      });
      if (!colHeads.length) colHeads = ['望江、华西校区', '江安校区'];

      // 数据行：从表头后开始
      const startRow = headIdx >= 0 ? headIdx + 1 : 1;
      const data = [];
      for (let ri = startRow; ri < matrix.length; ri++) {
        const row = matrix[ri];
        const texts = row.map((c) => c.text);
        // 跳过空行/重复标题
        if (!texts.some(Boolean)) continue;
        if (/作息时间|学年/.test(texts.join(' ')) && texts.some((t) => (row[texts.indexOf(t)] || {}).cs > 1 || /作息时间|学年/.test(t))) {
          // 可能是合并标题
          if (texts.some((t) => /作息时间|学年/.test(t) && !isTime(t))) continue;
        }
        let period = '';
        let section = '';
        const times = [];
        texts.forEach((t) => {
          if (!t) return;
          if (isPeriod(t)) period = t;
          else if (isSection(t)) section = fmtSection(t);
          else if (isTime(t)) times.push(fmtTime(t));
        });
        // 至少要有节次或时间，才算数据
        if (!section && !times.length) continue;
        data.push({ period, section, times });
      }

      // 继承时段（矩阵已填满 rowspan，一般每行都有；再兜底）
      let lastPeriod = '';
      data.forEach((d) => {
        if (d.period) lastPeriod = d.period;
        else d.period = lastPeriod;
      });

      // 校验：时间数量足够才重建，避免抽坏
      const timeHits = data.reduce((n, d) => n + d.times.filter(Boolean).length, 0);
      const canRebuild = data.length >= 6 && timeHits >= data.length; // 平均每行至少 1 个时间

      const styleOnly = () => {
        table.classList.add('urppp-wrs-table', 'urppp-wrs-native');
        table.dataset.urpppWrsBuilt = 'style';
        // 给原生表也打点 class，边框统一
        Array.from(table.rows || []).forEach((tr, ri) => {
          Array.from(tr.cells || []).forEach((cell) => {
            const t = norm(cell.textContent);
            cell.classList.remove('urppp-wrs-title', 'urppp-wrs-head', 'urppp-wrs-period', 'urppp-wrs-section', 'urppp-wrs-time');
            if (/作息时间|学年/.test(t) && (cell.colSpan || 1) >= 2) cell.classList.add('urppp-wrs-title');
            else if (ri <= (headIdx >= 0 ? headIdx : 1) && /节次|望江|华西|江安|校区/.test(t)) cell.classList.add('urppp-wrs-head');
            else if (isPeriod(t) || ((cell.rowSpan || 1) > 1 && isPeriod(t))) cell.classList.add('urppp-wrs-period');
            else if (isSection(t)) cell.classList.add('urppp-wrs-section');
            else if (isTime(t)) cell.classList.add('urppp-wrs-time');
          });
        });
      };

      if (!canRebuild) {
        styleOnly();
        return;
      }

      // 列数：校区头与时间列对齐
      const timeCols = Math.max(colHeads.length, ...data.map((d) => d.times.length));
      const heads = colHeads.slice(0, timeCols);
      while (heads.length < timeCols) {
        // 不要造“校区3”，缺了就复制最后一个真实名或留空列名
        heads.push(heads[heads.length - 1] || '');
      }

      // 按时段分组 rowspan
      const groups = [];
      data.forEach((d) => {
        const name = d.period || '';
        if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, rows: [d] });
        else groups[groups.length - 1].rows.push(d);
      });

      const newTable = document.createElement('table');
      newTable.className = 'urppp-wrs-table';
      newTable.dataset.urpppWrsBuilt = '1';
      newTable.innerHTML = [
        '<thead>',
        `<tr><th class="urppp-wrs-title" colspan="${2 + timeCols}">${esc(title)}</th></tr>`,
        '<tr>',
        '<th class="urppp-wrs-head urppp-wrs-head-period">时段</th>',
        '<th class="urppp-wrs-head urppp-wrs-head-section">节次</th>',
        heads.map((h) => `<th class="urppp-wrs-head">${esc(h)}</th>`).join(''),
        '</tr>',
        '</thead>',
        '<tbody>',
        groups.map((g) => g.rows.map((d, idx) => {
          const tds = [];
          if (idx === 0) {
            tds.push(`<td class="urppp-wrs-period" rowspan="${g.rows.length}">${esc(g.name || '')}</td>`);
          }
          tds.push(`<td class="urppp-wrs-section">${esc(d.section || '')}</td>`);
          for (let i = 0; i < timeCols; i++) {
            tds.push(`<td class="urppp-wrs-time">${esc(d.times[i] || '')}</td>`);
          }
          return `<tr>${tds.join('')}</tr>`;
        }).join('')).join(''),
        '</tbody>',
      ].join('');

      table.replaceWith(newTable);
    } catch (err) {
      console.warn('[URP++] work rest beautify failed', err);
    }
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
  function wrapTables() {
    document.querySelectorAll('table.table, table.table-bordered, table.dataTable').forEach((table) => {
      if (!table || table.closest('.urppp-table-wrap')) return;
      if (table.id === 'courseTable') return;
      if (table.closest('.modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal')) return;
      if (table.classList.contains('urppp-wrs-table')) return;
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
  function beautifyInternal() {
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
      }
      .navbar.navbar-default .navbar-brand,
      .navbar-default .navbar-brand { color: var(--text) !important; text-shadow: none !important; }

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
      .sidebar:not(.menu-min) { width: 260px !important; }
      .sidebar.menu-min { width: 50px !important; }
      .sidebar:not(.menu-min) ~ .main-content { margin-left: 260px !important; }
      .sidebar.menu-min ~ .main-content { margin-left: 50px !important; }
      .main-content { margin-top: var(--urppp-navbar-height) !important; transition: margin-left .25s ease; }
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-fixed-top,
      .navbar-fixed-bottom { left: 0 !important; right: 0 !important; }
      .sidebar {
        z-index: 1040 !important;
        top: var(--urppp-navbar-height) !important;
        height: calc(100vh - var(--urppp-navbar-height)) !important;
        background: var(--surface) !important;
        border-right: 1px solid var(--border) !important;
        box-shadow: var(--shadow) !important;
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
      .sidebar.menu-min .urppp-sidebar-header { justify-content: center; padding: 14px 0 12px; }
      .sidebar.menu-min #urppp-menus { padding: 10px 6px 24px; }
      .sidebar.menu-min .urppp-nav-link { padding: 12px 0; justify-content: center; }
      .sidebar.menu-min .urppp-nav-text,
      .sidebar.menu-min .urppp-nav-arrow {
        opacity: 0;
        max-width: 0;
        margin-left: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .sidebar.menu-min .urppp-nav-link > .fa { margin-right: 0; font-size: 18px; }
      .sidebar.menu-min .urppp-nav-submenu { max-height: 0 !important; opacity: 0 !important; }

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
        color: #fff !important;
        text-shadow: 0 1px 1px rgba(0,0,0,0.22) !important;
        pointer-events: none !important;
        white-space: nowrap !important;
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
      .page-content .profile-info-row {
        flex-direction: row !important;
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
      /* 培养方案完成情况：下方课组卡片统一尺寸节奏 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped {
        min-height: 108px !important;
      }
      .page-content .col-xs-6 > .profile-user-info,
      .page-content .col-sm-6 > .profile-user-info,
      .page-content .col-md-6 > .profile-user-info,
      .page-content .col-xs-4 > .profile-user-info,
      .page-content .col-sm-4 > .profile-user-info,
      .page-content .col-xs-3 > .profile-user-info {
        height: 100% !important;
        min-height: 108px !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) > [class*="col-"] {
        display: flex !important;
        flex-direction: column !important;
      }
      .profile-user-info:has(.chosen-container),
      .widget-box:has(.chosen-container),
      .panel:has(.chosen-container) { overflow: visible !important; }
      .profile-info-row {
        display: flex !important;
        align-items: center !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 44px !important;
      }
      .profile-info-row:last-child { border-bottom: none !important; }
      .profile-info-name {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border-color: var(--border) !important;
        border-right: 1px solid var(--border) !important;
        padding: 0 14px !important;
        width: 140px !important;
        min-width: 120px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        text-align: right !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        line-height: 1.35 !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .profile-info-value {
        border-color: var(--border) !important;
        color: var(--text) !important;
        padding: 6px 12px !important;
        flex: 1 !important;
        min-width: 0 !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        background: var(--surface) !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      /* 查询表单：标签与输入框垂直居中（profile-info 结构） */
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
        display: inline-block !important;
        top: 0 !important;
        vertical-align: middle !important;
      }
      .profile-info-value .chosen-container .chosen-single {
        height: 32px !important;
        min-height: 32px !important;
        line-height: 30px !important;
        display: flex !important;
        align-items: center !important;
      }
      .profile-info-value select,
      .profile-info-value input[type="text"],
      .profile-info-value input[type="number"],
      .profile-info-value input:not([type]) {
        height: 32px !important;
        min-height: 32px !important;
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
      .table:not(.urppp-wrs-table),
      .table-bordered:not(.urppp-wrs-table),
      .table-striped:not(.urppp-wrs-table),
      .table-hover:not(.urppp-wrs-table),
      .dataTable {
        background: var(--surface) !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        color: var(--text) !important;
        border-collapse: collapse !important;
        margin-bottom: 0 !important;
        width: 100% !important;
      }
      /* 只画 right/bottom，top/left 由 wrapper 提供；弹窗作息表排除 */
      body:not(:has(#work_rest_schedule_modal)) .table > thead > tr > th,
      .page-content .table > thead > tr > th, .page-content .table-bordered > thead > tr > th, .dataTable > thead > tr > th,
      .page-content .table > tbody > tr > th, .page-content .table > tbody > tr > td,
      .page-content .table-bordered > tbody > tr > td, .dataTable > tbody > tr > td,
      .page-content .table > tfoot > tr > th, .page-content .table > tfoot > tr > td,
      .urppp-table-wrap .table > thead > tr > th, .urppp-table-wrap .table-bordered > thead > tr > th,
      .urppp-table-wrap .table > tbody > tr > th, .urppp-table-wrap .table > tbody > tr > td,
      .urppp-table-wrap .table-bordered > tbody > tr > td,
      .table:not(.urppp-wrs-table) > thead > tr > th, .table-bordered:not(.urppp-wrs-table) > thead > tr > th, .dataTable > thead > tr > th,
      .table:not(.urppp-wrs-table) > tbody > tr > th, .table:not(.urppp-wrs-table) > tbody > tr > td,
      .table-bordered:not(.urppp-wrs-table) > tbody > tr > td, .dataTable > tbody > tr > td,
      .table:not(.urppp-wrs-table) > tfoot > tr > th, .table:not(.urppp-wrs-table) > tfoot > tr > td {
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
      .table-striped > tbody > tr:nth-of-type(odd), .dataTable > tbody > tr:nth-of-type(odd) { background: var(--bg) !important; }
      .table-hover > tbody > tr:hover, .dataTable > tbody > tr:hover {
        background: var(--input-bg) !important;
      }
      /* 按钮 */
      .btn, .btn.btn-xs, .btn.btn-sm, .btn.btn-lg, .btn.btn-minier,
      .btn-group .btn, .btn-group > .btn, .input-group .btn, .btn-toolbar .btn,
      .btn-app {
        border-radius: 6px !important;
      }
      .btn, .btn.btn-xs, .btn.btn-sm, .btn.btn-lg, .btn.btn-minier,
      .btn.btn-round, .btn.btn-white, .btn.btn-info, .btn.btn-bold {
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
      .btn > .ace-icon,
      .btn > .fa,
      .btn > .glyphicon {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        margin: 0 !important;
        position: static !important;
        top: auto !important;
        vertical-align: middle !important;
      }
      .btn.btn-xs {
        height: 26px !important;
        min-height: 26px !important;
        max-height: 26px !important;
        padding: 0 10px !important;
        font-size: 12px !important;
      }
      .btn:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .btn:active { transform: translateY(0); box-shadow: none; }
      .btn-primary, .btn-info { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; border-radius: 6px !important; }
      .btn-primary:hover, .btn-info:hover { background: var(--primary-hover) !important; border-color: var(--primary-hover) !important; }
      .btn-success { background: #22c55e !important; border-color: #22c55e !important; color: #fff !important; border-radius: 6px !important; }
      .btn-success:hover { background: #16a34a !important; border-color: #16a34a !important; }
      .btn-warning { background: #f59e0b !important; border-color: #f59e0b !important; color: #fff !important; border-radius: 6px !important; }
      .btn-danger { background: #ef4444 !important; border-color: #ef4444 !important; color: #fff !important; border-radius: 6px !important; }
      .btn-default, .btn-white { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: 6px !important; }
      .btn-default:hover, .btn-white:hover { background: var(--border) !important; }
      .btn-app { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 6px !important; }
      .btn-app:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }

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
      /* 分页/每页条数：极窄 select，给足文字空间 */
      .urppagebreak select,
      .urppagebreak #pagesize,
      select#pagesize,
      .pagination select,
      .dataTables_length select,
      .page-content select[style*="width: 50"],
      .page-content select[style*="width:50"] {
        width: auto !important;
        min-width: 56px !important;
        max-width: 80px !important;
        padding: 2px 4px !important;
        height: 28px !important;
        min-height: 28px !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        border-radius: 6px !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
        background-image: none !important;
      }
      .urppagebreak {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 6px 8px !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
      }
      .urppagebreak input[type="text"],
      .urppagebreak input.form-control {
        padding: 1px 5px !important;
        height: 28px !important;
        min-height: 28px !important;
        width: auto !important;
        min-width: 40px !important;
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
        min-height: 32px !important;
        line-height: 1.4 !important;
        padding: 4px 12px !important;
        border-radius: 8px !important;
      }
      .chosen-single {
        display: flex !important;
        align-items: center !important;
      }
      .chosen-single span { margin-right: 26px !important; }
      .chosen-container {
        height: auto !important;
        min-height: 32px !important;
        vertical-align: middle !important;
        position: relative !important;
        box-sizing: border-box !important;
      }
      .chosen-container-single {
        width: auto !important;
        min-width: 150px !important;
        max-width: 100% !important;
      }
      .chosen-drop {
        position: absolute !important;
        z-index: 1010 !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        background: var(--surface) !important;
        border-color: var(--border) !important;
        box-shadow: var(--shadow) !important;
      }
      input:focus, select:focus, textarea:focus, .form-control:focus,
      .chosen-container-active .chosen-single, .chosen-container-active .chosen-choices {
        border-color: var(--border-focus) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
        outline: none !important;
      }
      .chosen-results li { color: var(--text) !important; padding: 8px 12px !important; }
      .chosen-results li.highlighted { background: var(--primary) !important; color: #fff !important; }
      label { color: var(--text-secondary) !important; font-weight: 500 !important; font-size: 13px !important; }

      /* 查询表单：col-sm-3 标签 + col-sm-9 控件 垂直居中 */
      .form-horizontal .form-group,
      form .form-group,
      .form-group {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 14px !important;
      }
      .form-group:before,
      .form-group:after,
      .form-horizontal .form-group:before,
      .form-horizontal .form-group:after {
        display: none !important;
        content: none !important;
      }
      .form-group > [class*="col-"],
      .form-horizontal .form-group > [class*="col-"] {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        min-height: 34px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        box-sizing: border-box !important;
      }
      .form-group > .col-sm-3,
      .form-group > .col-xs-3,
      .form-group > .col-md-3,
      .form-group > .no-padding-right,
      .form-group > [class*="col-"].no-padding-right {
        justify-content: flex-end !important;
        padding-right: 10px !important;
      }
      .form-group > .col-sm-9,
      .form-group > .col-xs-9,
      .form-group > .col-md-9 {
        justify-content: flex-start !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
      .form-horizontal .control-label,
      .form-group .control-label,
      label.control-label,
      .form-group > [class*="col-"] > label {
        display: block !important;
        width: 100% !important;
        float: none !important;
        margin: 0 !important;
        padding: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        line-height: 34px !important;
        text-align: right !important;
        color: var(--text-secondary) !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
      }
      .form-group input,
      .form-group select,
      .form-group textarea,
      .form-group .form-control,
      .form-group .chosen-container,
      .form-horizontal input,
      .form-horizontal select,
      .form-horizontal .form-control,
      .form-horizontal .chosen-container {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        vertical-align: middle !important;
      }
      .form-group .chosen-container,
      .form-horizontal .chosen-container {
        display: inline-block !important;
        vertical-align: middle !important;
        top: 0 !important;
      }
      .form-group .chosen-container .chosen-single,
      .form-horizontal .chosen-container .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 32px !important;
        display: flex !important;
        align-items: center !important;
      }
      .form-group select,
      .form-horizontal select {
        height: 34px !important;
        min-height: 34px !important;
      }
      .form-group input.form-control,
      .form-horizontal input.form-control {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 1.35 !important;
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
      /* 分页 */
      .pagination > li > a, .pagination > li > span {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
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

      /* 弹窗：保持 Bootstrap 3 结构，不改 display/float 布局 */      .modal-content {
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
      /* 确保 modal 显示不被覆盖 */
      .modal.fade.in,
      .modal.in {
        display: block !important;
      }
      .modal-backdrop.in {
        opacity: 0.45 !important;
      }

      /* 作息时间表：干净表格（重建表 + 原表样式兜底） */
      #work_rest_schedule_modal.modal.fade.in,
      #work_rest_schedule_modal.modal.in { display: block !important; }
      #work_rest_schedule_modal .modal-dialog {
        width: 880px !important;
        max-width: 96vw !important;
        margin: 48px auto !important;
      }
      #work_rest_schedule_modal .modal-content {
        border-radius: 14px !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 18px 50px rgba(0,0,0,0.16) !important;
        background: var(--surface) !important;
        overflow: hidden !important;
      }
      #work_rest_schedule_modal .modal-header {
        display: flex !important;
        align-items: center !important;
        min-height: 52px !important;
        padding: 14px 18px !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
      }
      #work_rest_schedule_modal .modal-title {
        margin: 0 !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        color: var(--text) !important;
      }
      #work_rest_schedule_modal .modal-header .close {
        margin-left: auto !important;
        opacity: 0.65 !important;
      }
      #work_rest_schedule_modal .modal-body {
        padding: 16px 18px 18px !important;
        background: var(--bg) !important;
      }

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
        table-layout: auto !important;
      }

      /* 覆盖全局 .table 残缺边框 */
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

      #work_rest_schedule_modal table .urppp-wrs-title,
      #work_rest_schedule_modal table tr:first-child th[colspan],
      #work_rest_schedule_modal table tr:first-child td[colspan] {
        background: color-mix(in srgb, var(--primary) 10%, var(--surface)) !important;
        color: var(--text) !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        padding: 12px 14px !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-head,
      #work_rest_schedule_modal table thead th {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        font-weight: 600 !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-period,
      #work_rest_schedule_modal table td[rowspan],
      #work_rest_schedule_modal table th[rowspan] {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        font-weight: 700 !important;
        width: 72px !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-section {
        font-weight: 600 !important;
        min-width: 92px !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-time {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-variant-numeric: tabular-nums !important;
        font-size: 13px !important;
        font-weight: 500 !important;
      }
      #work_rest_schedule_modal table tbody tr:nth-child(even) td:not(.urppp-wrs-period):not([rowspan]) {
        background: color-mix(in srgb, var(--input-bg) 35%, var(--surface)) !important;
      }
      #work_rest_schedule_modal .modal-body > h4,
      #work_rest_schedule_modal .modal-body > .center,
      #work_rest_schedule_modal .modal-body > p {
        text-align: center !important;
        color: var(--text) !important;
        margin: 0 0 10px !important;
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
        margin: 0 0 10px !important;
        padding-left: 34px;
        height: auto !important;
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      #urppp-dashboard .tabContent h3::before {
        counter-increment: urppp-notice;
        content: counter(urppp-notice);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
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
        font-weight: 500;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 10px 12px;
        border-radius: var(--radius-sm);
        background: var(--input-bg);
        transition: background .2s;
      }
      #urppp-dashboard .tabContent h3 a:hover { background: var(--border); }
      #urppp-dashboard .tabContent h3 label { font-weight: inherit; color: inherit; margin: 0; }
      #urppp-dashboard .tabContent h3 a > span { display: flex; justify-content: space-between; align-items: center; width: 100%; }
      #urppp-dashboard .tabContent h3 .hide_note { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 12px; }
      #urppp-dashboard .tabContent h3 .fa-clock-o { margin-right: 4px; color: var(--text-muted); }
      #urppp-dashboard .urppp-card-body:has(.btn-app) { display: block !important; padding: 16px 14px; font-size: 0; }
      #urppp-dashboard .btn-app {
        display: inline-flex !important;
        width: 80px !important;
        height: 80px !important;
        margin: 0 12px 12px 0 !important;
        border-radius: 8px !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        padding: 8px 6px !important;
        font-size: 12px !important;
        line-height: 1.3 !important;
        white-space: normal !important;
        text-align: center;
        transition: all .2s;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        word-break: keep-all !important;
        vertical-align: top !important;
      }
      #urppp-dashboard .btn-app:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; transform: translateY(-2px); box-shadow: 0 4px 12px var(--ring); }
      #urppp-dashboard .btn-app > .ace-icon { color: inherit !important; display: block; margin: 0 auto 4px; font-size: 22px; }
    `;
    }

    // 给表格包一层 wrapper：圆角 + 完整外框，绕过 Bootstrap thead border-top:0 和 overflow 裁剪
    wrapTables();
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
    // 强制内容区内边距（ACE 偶发内联样式覆盖）
    document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
      el.style.setProperty('padding', '16px 64px 40px', 'important');
      el.style.setProperty('box-sizing', 'border-box', 'important');
    });
    alignRollInfoLayout();
    patchAceTabNavbars();
    restyleInfoboxPercentages();
    setTimeout(restyleInfoboxPercentages, 300);
    setTimeout(restyleInfoboxPercentages, 1000);
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
    // 作息时间表：显示后提取重构；兼容 AJAX 晚到表格
    if (!window.__urpppWrsBound) {
      window.__urpppWrsBound = true;
      const runWrs = () => {
        beautifyWorkRestSchedule();
        const modal = document.getElementById('work_rest_schedule_modal');
        if (!modal || modal.dataset.urpppWrsObs === '1') return;
        modal.dataset.urpppWrsObs = '1';
        const body = modal.querySelector('.modal-body') || modal;
        let t = 0;
        const mo = new MutationObserver(() => {
          clearTimeout(t);
          t = setTimeout(() => {
            const tb = body.querySelector('table:not([data-urppp-wrs-built="1"])');
            if (tb) beautifyWorkRestSchedule();
          }, 40);
        });
        mo.observe(body, { childList: true, subtree: true });
      };
      document.addEventListener('shown.bs.modal', (e) => {
        if (e.target && (e.target.id === 'work_rest_schedule_modal' || e.target.querySelector?.('#work_rest_schedule_modal'))) {
          setTimeout(runWrs, 20);
        }
      }, true);
      document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a,button') : null;
        if (!a) return;
        const onclick = a.getAttribute('onclick') || '';
        const txt = (a.textContent || '').trim();
        if (onclick.includes('openWorkRestSchedule') || txt.includes('作息时间表')) {
          setTimeout(runWrs, 50);
          setTimeout(runWrs, 250);
          setTimeout(runWrs, 700);
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
    window.addEventListener('load', () => { rebuildNavbar(); patchSchoolCalendarLink(); });

    setTimeout(() => { document.body.classList.add('urppp-ready'); hideBootLoader(); }, 600);

    console.log('[URP++] style applied v0.4.5');

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

  function rebuildNavbar() {
    const navbar = document.getElementById('navbar');
    const aceNav = navbar?.querySelector('.ace-nav');
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

  function rebuildSidebarCompletely() {
    const sidebar = document.getElementById('sidebar');
    const origMenus = document.getElementById('menus');
    if (!sidebar || !origMenus) return;

    // 先清理旧的（可能从 PJAX 残留）
    const oldMenus = document.getElementById('urppp-menus');
    const oldHeader = sidebar.querySelector('.urppp-sidebar-header');
    if (oldMenus) oldMenus.remove();
    if (oldHeader) oldHeader.remove();

    // 读取顶栏高度并同步 CSS 变量（加兜底）
    const navbar = document.querySelector('.navbar.navbar-default, .navbar-fixed-top');
    const nh = navbar ? (navbar.offsetHeight || 45) : 45;
    document.documentElement.style.setProperty('--urppp-navbar-height', nh + 'px', 'important');
    sidebar.style.setProperty('top', nh + 'px', 'important');
    sidebar.style.setProperty('height', 'calc(100vh - ' + nh + 'px)', 'important');

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
  function watchRouteChanges() {
    const run = () => {
      setTimeout(() => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        const navbar = document.querySelector('.navbar.navbar-default, .navbar-fixed-top');
        const nh = navbar ? (navbar.offsetHeight || 45) : 45;
        document.documentElement.style.setProperty('--urppp-navbar-height', nh + 'px', 'important');
        sidebar.style.setProperty('top', nh + 'px', 'important');
        sidebar.style.setProperty('height', 'calc(100vh - ' + nh + 'px)', 'important');
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
    version: '0.4.5',
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
