// ==UserScript==
// @name         UPR++ 教务系统美化
// @namespace    https://github.com/hanako/upr-plus
// @version      0.2.0
// @description  四川大学 URP 教务系统美化插件，多主题设计系统 | Design System: UI UX Pro Max
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

  // ============================================================
  // 设计系统：Design Token 架构
  // 基于 UI UX Pro Max 方法论 — Minimalism & Swiss Style
  //
  // 色彩模型：Primary / Secondary / Background / Foreground /
  //          Card / Muted / Border / Accent / Destructive / Ring
  // 风格原则：清洁、功能优先、网格对齐、高对比度
  // 效果策略：微阴影 + 200ms 过渡 + 清晰聚焦环
  // ============================================================

  const THEME_STORAGE_KEY = 'uprpp_theme_v2';

  /**
   * 完整设计 token 集
   * @typedef {Object} DesignTokens
   * @property {Object} colors
   * @property {string} colors.primary       - 主色（按钮、活跃标签）
   * @property {string} colors.onPrimary     - 主色上的文字
   * @property {string} colors.secondary     - 辅色
   * @property {string} colors.background    - 页面背景
   * @property {string} colors.foreground    - 前景文字色
   * @property {string} colors.card          - 卡片背景
   * @property {string} colors.cardShadow    - 卡片阴影
   * @property {string} colors.muted         - 弱化背景（输入框等）
   * @property {string} colors.mutedForeground - 弱化文字（提示、链接等）
   * @property {string} colors.border        - 边框色
   * @property {string} colors.accent        - 强调色（可选，CTA）
   * @property {string} colors.destructive   - 危险/错误色
   * @property {string} colors.ring          - 聚焦环
   * @property {Object} typography
   * @property {string} typography.fontFamily
   * @property {string} [typography.fontImport]
   * @property {Object} shape
   * @property {string} shape.borderRadius   - 通用圆角
   * @property {string} shape.buttonRadius   - 按钮圆角
   * @property {Object} [meta]
   * @property {string} [meta.logoUrl]       - 自定义 logo
   * @property {string} [meta.bodyBgImage]   - 背景图 CSS
   */

  const ThemeManager = {
    _themes: new Map(),
    _current: null,
    _styleEl: null,

    register(name, displayName, tokens) {
      tokens.name = name;
      tokens.displayName = displayName;
      this._themes.set(name, tokens);
    },

    apply(name) {
      const theme = this._themes.get(name);
      if (!theme) {
        console.warn(`[UPR++] 主题 "${name}" 未注册`);
        return this.apply('default');
      }
      this._current = name;
      GM_setValue(THEME_STORAGE_KEY, name);
      this._injectCSS(theme);
      console.log(`[UPR++] 已应用: ${theme.displayName}`);
    },

    getCurrent() {
      return this._current;
    },

    list() {
      return Array.from(this._themes.values()).map(t => ({
        name: t.name,
        displayName: t.displayName,
        current: t.name === this._current,
      }));
    },

    _injectCSS(t) {
      if (this._styleEl) this._styleEl.remove();

      const c = t.colors;
      const ty = t.typography;
      const sh = t.shape;
      const m = t.meta || {};

      const fontImport = ty.fontImport ? `@import url('${ty.fontImport}');` : '';
      const bgImage = m.bodyBgImage
        ? `background-image: ${m.bodyBgImage}; background-size: cover; background-position: center; background-repeat: no-repeat;`
        : '';

      const logoCSS = m.logoUrl
        ? `#formContent > div.fadeIn.first svg { display: none !important; }
           #formContent > div.fadeIn.first::after {
             content: ''; display: block; width: 80px; height: 80px; margin: 0 auto;
             background: url('${m.logoUrl}') center/contain no-repeat;
           }`
        : '';

      const css = /* css */ `
        ${fontImport}

        /* ========== 全局背景 ========== */
        html, body {
          background: ${c.background} !important;
          ${bgImage}
          font-family: ${ty.fontFamily} !important;
          color: ${c.foreground};
        }
        body { min-height: 100vh; }
        .wrapper { background: transparent !important; }

        /* ========== 登录卡片 ========== */
        #formContent {
          background: ${c.card} !important;
          border-radius: ${sh.borderRadius} !important;
          box-shadow: ${c.cardShadow} !important;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        /* ========== 标题 ========== */
        #formContent > h2.active {
          color: ${c.foreground} !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          text-align: center;
          width: 100% !important;
          margin: 36px 0 20px 0 !important;
          letter-spacing: 2px;
        }

        /* ========== 登录方式标签 ========== */
        #formContent > h2.active + div + div {
          display: flex !important;
          gap: 0 !important;
          margin-bottom: 24px !important;
        }
        #formContent > h2.active + div + div > div:first-child {
          flex: 1 !important;
          width: auto !important;
          text-align: center !important;
          background: ${c.primary} !important;
          color: ${c.onPrimary} !important;
          border-radius: 0 !important;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 1px;
          padding: 14px 10px !important;
          height: auto !important;
          line-height: 1.4;
        }
        #tocas {
          flex: 1 !important;
          width: auto !important;
          text-align: center !important;
          background: ${c.muted} !important;
          border-radius: 0 !important;
          padding: 8px 10px !important;
          height: auto !important;
        }
        #tocas a {
          color: ${c.mutedForeground} !important;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 1px;
          text-decoration: none;
          display: inline-block;
          width: auto !important;
          height: auto !important;
        }
        #tocas a:hover { opacity: 0.8; }
        #tocas a br { display: none; }
        #tocas span {
          display: block;
          font-size: 12px !important;
          color: ${c.mutedForeground} !important;
          margin-top: 4px;
        }

        /* ========== 表单 ========== */
        .form-signin { padding: 0 32px !important; }
        .form-signin > input[type="hidden"] { display: none; }

        /* ========== 输入框 ========== */
        #input_username,
        #input_password,
        #input_checkcode {
          width: calc(100% - 64px) !important;
          height: 48px !important;
          margin: 8px 32px !important;
          padding: 0 16px !important;
          background: ${c.muted} !important;
          border: 2px solid ${c.border} !important;
          border-radius: ${sh.borderRadius} !important;
          color: ${c.foreground} !important;
          font-size: 15px !important;
          font-family: ${ty.fontFamily} !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
          outline: none !important;
          box-sizing: border-box !important;
        }
        #input_username::placeholder,
        #input_password::placeholder,
        #input_checkcode::placeholder,
        .form-signin input::placeholder {
          color: ${c.mutedForeground} !important;
        }
        #input_username:focus,
        #input_password:focus,
        #input_checkcode:focus {
          border: 2px solid ${c.ring} !important;
          box-shadow: 0 0 0 3px ${c.ring}22 !important;
        }

        /* ========== 验证码图片 ========== */
        .form-signin img {
          border-radius: 6px !important;
          margin-left: 8px !important;
          cursor: pointer;
          height: 48px !important;
          vertical-align: middle !important;
          background: ${c.muted} !important;
          padding: 2px;
        }

        /* ========== 登录按钮 ========== */
        #loginButton {
          display: block !important;
          width: calc(100% - 64px) !important;
          height: 48px !important;
          margin: 24px 32px !important;
          padding: 0 !important;
          background: ${c.primary} !important;
          color: ${c.onPrimary} !important;
          border: none !important;
          border-radius: ${sh.buttonRadius} !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          font-family: ${ty.fontFamily} !important;
          letter-spacing: 4px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 14px ${c.primary}44 !important;
        }
        #loginButton:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px ${c.primary}55 !important;
        }
        #loginButton:active { transform: translateY(0); }

        /* ========== 表单内链接 ========== */
        .form-signin > a {
          color: ${c.mutedForeground} !important;
          text-decoration: none !important;
          font-size: 13px !important;
          margin: 0 8px !important;
        }
        .form-signin > a:hover { opacity: 0.7; }

        /* ========== 底部 ========== */
        #formFooter {
          background: ${c.card} !important;
          text-align: center !important;
          padding: 16px 0 24px 0 !important;
          color: ${c.mutedForeground} !important;
          font-size: 12px !important;
        }
        #formFooter a {
          color: ${c.mutedForeground} !important;
          text-decoration: none !important;
          font-size: 13px !important;
          margin: 0 12px !important;
          transition: opacity 0.2s;
        }
        #formFooter a:hover { opacity: 0.7; }

        /* ========== 校徽 / Logo ========== */
        #formContent > div.fadeIn.first {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100% !important;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        #formContent > div.fadeIn.first svg {
          max-width: 160px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        ${logoCSS}

        /* ========== 隐藏冗余元素 ========== */
        #to_modify_pwd, #schoolId { display: none !important; }

        /* ========== 入场动效 ========== */
        @keyframes uprpp-fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        #formContent { animation: uprpp-fadeInUp 0.5s ease-out; }

        /* ========== 聚焦环（无障碍） ========== */
        *:focus-visible {
          outline: 2px solid ${c.ring} !important;
          outline-offset: 2px;
        }
      `;

      this._styleEl = document.createElement('style');
      this._styleEl.id = 'uprpp-theme';
      this._styleEl.textContent = css;
      document.head.appendChild(this._styleEl);
    },
  };

  // ============================================================
  // 内置主题（基于 UI UX Pro Max 设计 token 体系）
  // ============================================================

  // ---------- 主题 1：简约白（Educational App 调色板 #9）----------
  ThemeManager.register('default', '简约白', {
    colors: {
      primary: '#4F46E5',        // Indigo 主色
      onPrimary: '#FFFFFF',
      secondary: '#818CF8',
      background: '#EEF2FF',     // 极浅 Indigo 背景
      foreground: '#1E1B4B',     // 深 Indigo 文字
      card: '#FFFFFF',
      cardShadow: '0 4px 24px rgba(79,70,229,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      muted: '#EBEEF8',          // 弱化底
      mutedForeground: '#64748B',
      border: '#C7D2FE',
      accent: '#EA580C',         // Orange CTA
      destructive: '#DC2626',
      ring: '#4F46E5',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    },
    shape: {
      borderRadius: '12px',
      buttonRadius: '10px',
    },
  });

  // ---------- 主题 2：深邃暗（OLED Dark Mode + Indigo accent）----------
  ThemeManager.register('dark', '深邃暗', {
    colors: {
      primary: '#818CF8',        // 淡 Indigo（暗色下不宜太亮）
      onPrimary: '#0F172A',
      secondary: '#6366F1',
      background: '#0F0F1A',     // Deep black
      foreground: '#E2E8F0',
      card: '#1A1A2E',           // 暗蓝灰卡片
      cardShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      muted: '#252540',
      mutedForeground: '#94A3B8',
      border: '#334155',
      accent: '#22C55E',         // Green
      destructive: '#EF4444',
      ring: '#818CF8',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    },
    shape: {
      borderRadius: '12px',
      buttonRadius: '10px',
    },
  });

  // ---------- 主题 3：川大红（SCU 校色定制）----------
  ThemeManager.register('scu-red', '川大红', {
    colors: {
      primary: '#C0392B',        // 川大红
      onPrimary: '#FFFFFF',
      secondary: '#E74C3C',
      background: '#FDF6F5',     // 暖白底
      foreground: '#2C1810',
      card: '#FFFFFF',
      cardShadow: '0 4px 24px rgba(139,31,31,0.08), 0 0 0 1px rgba(139,31,31,0.05)',
      muted: '#FEF5F5',
      mutedForeground: '#B0887F',
      border: '#F0D6D6',
      accent: '#8B1F1F',         // 深红
      destructive: '#DC2626',
      ring: '#C0392B',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Serif SC", serif',
    },
    shape: {
      borderRadius: '12px',
      buttonRadius: '10px',
    },
  });

  // ============================================================
  // 初始化
  // ============================================================

  const SUPPORTED_PATHS = ['/login', '/loginEn', '/'];

  function isLoginPage() {
    const path = window.location.pathname;
    return SUPPORTED_PATHS.some(p => path === p || path.startsWith(p + '?'));
  }

  function init() {
    if (!isLoginPage()) {
      console.log('[UPR++] 非登录页面，后续版本将扩展');
      return;
    }

    const savedTheme = GM_getValue(THEME_STORAGE_KEY, 'default');
    ThemeManager.apply(savedTheme);

    const t = ThemeManager._themes.get(ThemeManager._current);
    console.log(`[UPR++] 已加载 | ${t?.displayName} | Minimalism & Swiss Style`);
    console.log('[UPR++] 可用主题:', ThemeManager.list().map(i => i.displayName).join(' / '));
    console.log('[UPR++] 切换: UPRPP.theme.apply("主题名")');
    console.log('[UPR++] 注册新主题: UPRPP.theme.register("id", "名称", designTokens)');
  }

  // ============================================================
  // 全局 API
  // ============================================================

  const UPRPP = {
    version: '0.2.0',
    theme: {
      register: ThemeManager.register.bind(ThemeManager),
      apply: ThemeManager.apply.bind(ThemeManager),
      getCurrent: ThemeManager.getCurrent.bind(ThemeManager),
      list: ThemeManager.list.bind(ThemeManager),
    },
  };

  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  global.UPRPP = UPRPP;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
