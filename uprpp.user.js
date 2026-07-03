// ==UserScript==
// @name         UPR++ 教务系统美化
// @namespace    https://github.com/hanako/upr-plus
// @version      0.1.0
// @description  四川大学 URP 教务系统美化插件，支持多主题切换
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
  // 主题系统：ThemeManager
  // 每个主题是一个 plain object，包含颜色、字体、间距等属性
  // 注册新主题调用 UPRPP.theme.register(name, config)
  // 切换主题调用 UPRPP.theme.apply(name)
  // ============================================================

  const THEME_STORAGE_KEY = 'uprpp_theme';

  /**
   * @typedef {Object} ThemeConfig
   * @property {string} name           - 主题标识（英文）
   * @property {string} displayName    - 中文显示名
   * @property {string} bodyBg         - 页面背景
   * @property {string} bodyBgImage    - 背景图（可选，CSS url() 内容）
   * @property {string} cardBg         - 登录卡片背景
   * @property {string} cardRadius     - 卡片圆角
   * @property {string} cardShadow     - 卡片阴影
   * @property {string} titleColor     - 标题颜色
   * @property {string} inputBg        - 输入框背景
   * @property {string} inputBorder    - 输入框边框
   * @property {string} inputRadius    - 输入框圆角
   * @property {string} inputColor     - 输入框文字颜色
   * @property {string} inputFocusBorder - 输入框聚焦边框
   * @property {string} inputFocusShadow - 输入框聚焦阴影
   * @property {string} buttonBg       - 按钮背景
   * @property {string} buttonColor    - 按钮文字颜色
   * @property {string} buttonRadius   - 按钮圆角
   * @property {string} buttonHoverBg  - 按钮悬停背景
   * @property {string} buttonShadow   - 按钮阴影
   * @property {string} linkColor      - 链接颜色
   * @property {string} tabBg          - 登录方式标签默认背景
   * @property {string} tabTextColor   - 登录方式标签默认文字色
   * @property {string} tabActiveBg    - 登录方式切换标签活跃背景
   * @property {string} tabActiveColor - 登录方式切换标签活跃文字色
   * @property {string} fontFamily     - 全局字体
   * @property {string} fontImport     - Google Fonts / 字体 CDN 的 @import URL（可选）
   * @property {string|null} logoUrl   - 自定义 logo 图片 URL（可选，null 保留原始校徽）
   */

  const ThemeManager = {
    /** @type {Map<string, ThemeConfig>} */
    _themes: new Map(),
    _current: null,
    _styleEl: null,

    /**
     * 注册一个主题
     * @param {string} name
     * @param {ThemeConfig} config
     */
    register(name, config) {
      config.name = name;
      this._themes.set(name, config);
    },

    /**
     * 应用指定主题（自动保存到本地存储）
     * @param {string} name
     */
    apply(name) {
      const theme = this._themes.get(name);
      if (!theme) {
        console.warn(`[UPR++] 主题 "${name}" 未注册，使用默认主题`);
        return this.apply('default');
      }
      this._current = name;
      GM_setValue(THEME_STORAGE_KEY, name);
      this._injectCSS(theme);
      console.log(`[UPR++] 已应用主题: ${theme.displayName}`);
    },

    /**
     * 获取当前主题名称
     */
    getCurrent() {
      return this._current;
    },

    /**
     * 获取所有已注册主题
     */
    list() {
      return Array.from(this._themes.values()).map(t => ({
        name: t.name,
        displayName: t.displayName,
        current: t.name === this._current,
      }));
    },

    /**
     * 注入 CSS
     */
    _injectCSS(theme) {
      // 移除旧样式
      if (this._styleEl) {
        this._styleEl.remove();
      }

      const fontImport = theme.fontImport
        ? `@import url('${theme.fontImport}');`
        : '';

      const bodyBgImage = theme.bodyBgImage
        ? `background-image: ${theme.bodyBgImage}; background-size: cover; background-position: center; background-repeat: no-repeat;`
        : '';

      const logoCSS = theme.logoUrl
        ? `#formContent > div.fadeIn.first svg { display: none !important; }
           #formContent > div.fadeIn.first::after {
             content: '';
             display: block;
             width: 80px; height: 80px;
             margin: 0 auto;
             background: url('${theme.logoUrl}') center/contain no-repeat;
           }`
        : '';

      const css = `
        ${fontImport}

        /* === 页面背景（消除原始蓝色） === */
        html, body {
          background: ${theme.bodyBg} !important;
          ${bodyBgImage}
          font-family: ${theme.fontFamily} !important;
        }
        body {
          min-height: 100vh;
        }
        /* 消除 wrapper 可能的背景残留 */
        .wrapper {
          background: transparent !important;
        }

        /* === 登录卡片 === */
        #formContent {
          background: ${theme.cardBg} !important;
          border-radius: ${theme.cardRadius} !important;
          box-shadow: ${theme.cardShadow} !important;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        /* === 标题 === */
        #formContent > h2.active {
          color: ${theme.titleColor} !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          text-align: center;
          width: 100% !important;
          margin: 36px 0 20px 0 !important;
          letter-spacing: 2px;
        }

        /* === 登录方式切换标签 === */
        /* 定位：h2 → div.fadeIn.first(SVG) → div(标签容器) */
        #formContent > h2.active + div + div {
          display: flex !important;
          gap: 0 !important;
          margin-bottom: 24px !important;
        }
        #formContent > h2.active + div + div > div:first-child {
          flex: 1 !important;
          width: auto !important;
          text-align: center !important;
          background: ${theme.tabActiveBg} !important;
          color: ${theme.tabActiveColor} !important;
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
          background: ${theme.tabBg || 'rgba(0,0,0,0.03)'} !important;
          border-radius: 0 !important;
          padding: 8px 10px !important;
          height: auto !important;
        }
        #tocas a {
          color: ${theme.tabTextColor || theme.linkColor} !important;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 1px;
          text-decoration: none;
          display: inline-block;
          width: auto !important;
          height: auto !important;
        }
        #tocas a:hover {
          opacity: 0.8;
        }
        #tocas a br {
          display: none;
        }
        #tocas span {
          display: block;
          font-size: 12px !important;
          color: #999 !important;
          margin-top: 4px;
        }

        /* === 表单 === */
        .form-signin {
          padding: 0 32px !important;
        }

        /* 隐藏不需要的 hidden input */
        .form-signin > input[type="hidden"] {
          display: none;
        }

        /* === 输入框 === */
        #input_username,
        #input_password,
        .form-signin input[type="text"]:not([id]),
        .form-signin input[type="password"]:not([id]) {
          width: calc(100% - 64px) !important;
          height: 48px !important;
          margin: 8px 32px !important;
          padding: 0 16px !important;
          background: ${theme.inputBg} !important;
          border: ${theme.inputBorder} !important;
          border-radius: ${theme.inputRadius} !important;
          color: ${theme.inputColor} !important;
          font-size: 15px !important;
          font-family: ${theme.fontFamily} !important;
          transition: border-color 0.25s, box-shadow 0.25s !important;
          outline: none !important;
          box-sizing: border-box !important;
        }

        #input_username::placeholder,
        #input_password::placeholder,
        .form-signin input::placeholder {
          color: #b0b0b0 !important;
        }

        #input_username:focus,
        #input_password:focus,
        .form-signin input[type="text"]:focus,
        .form-signin input[type="password"]:focus {
          border: ${theme.inputFocusBorder} !important;
          box-shadow: ${theme.inputFocusShadow} !important;
          background: #fff !important;
        }

        /* === 验证码行 === */
        .form-signin input[id=""]:not([type="submit"]):not([type="hidden"]) {
          width: 60% !important;
          margin: 8px 32px !important;
          padding: 0 16px !important;
          height: 48px !important;
          background: ${theme.inputBg} !important;
          border: ${theme.inputBorder} !important;
          border-radius: ${theme.inputRadius} !important;
          font-size: 15px !important;
          outline: none !important;
          box-sizing: border-box !important;
        }

        /* 验证码图片 */
        .form-signin img {
          border-radius: 6px !important;
          margin-left: 8px !important;
          cursor: pointer;
          height: 48px !important;
          vertical-align: middle !important;
        }

        /* === 登录按钮 === */
        .form-signin input[type="submit"] {
          display: block !important;
          width: calc(100% - 64px) !important;
          height: 48px !important;
          margin: 24px 32px !important;
          padding: 0 !important;
          background: ${theme.buttonBg} !important;
          color: ${theme.buttonColor} !important;
          border: none !important;
          border-radius: ${theme.buttonRadius} !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          font-family: ${theme.fontFamily} !important;
          letter-spacing: 4px !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
          box-shadow: ${theme.buttonShadow} !important;
        }
        .form-signin input[type="submit"]:hover {
          background: ${theme.buttonHoverBg} !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }
        .form-signin input[type="submit"]:active {
          transform: translateY(0);
        }

        /* === 底部链接 === */
        #formFooter {
          text-align: center !important;
          padding: 16px 0 24px 0 !important;
        }
        #formFooter a {
          color: ${theme.linkColor} !important;
          text-decoration: none !important;
          font-size: 13px !important;
          margin: 0 12px !important;
          transition: opacity 0.2s;
        }
        #formFooter a:hover {
          opacity: 0.7;
        }

        /* === 校徽 / Logo === */
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

        /* === 卡片入场动效 === */
        @keyframes uprpp-fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        #formContent {
          animation: uprpp-fadeInUp 0.6s ease-out;
        }
      `;

      this._styleEl = document.createElement('style');
      this._styleEl.id = 'uprpp-theme';
      this._styleEl.textContent = css;
      document.head.appendChild(this._styleEl);
    },
  };

  // ============================================================
  // 内置主题
  // ============================================================

  // 主题 1：默认（现代简约 · 浅色）
  ThemeManager.register('default', {
    name: 'default',
    displayName: '简约白',
    bodyBg: '#f0f4f8',
    bodyBgImage: null,
    cardBg: '#ffffff',
    cardRadius: '16px',
    cardShadow: '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
    titleColor: '#1a1a2e',
    inputBg: '#f7f8fa',
    inputBorder: '2px solid #e8ecf1',
    inputRadius: '10px',
    inputColor: '#1a1a2e',
    inputFocusBorder: '2px solid #4f6ef6',
    inputFocusShadow: '0 0 0 3px rgba(79,110,246,0.12)',
    buttonBg: '#4f6ef6',
    buttonColor: '#ffffff',
    buttonRadius: '10px',
    buttonHoverBg: '#3d5bd9',
    buttonShadow: '0 4px 14px rgba(79,110,246,0.3)',
    linkColor: '#7c8db5',
    tabBg: '#f5f6f8',
    tabTextColor: '#7c8db5',
    tabActiveBg: '#f0f4ff',
    tabActiveColor: '#4f6ef6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontImport: null,
  });

  // 主题 2：暗色模式
  ThemeManager.register('dark', {
    name: 'dark',
    displayName: '深邃暗',
    bodyBg: '#0f0f1a',
    bodyBgImage: null,
    cardBg: '#1a1a2e',
    cardRadius: '16px',
    cardShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
    titleColor: '#e8e8f0',
    inputBg: '#252540',
    inputBorder: '2px solid #2e2e48',
    inputRadius: '10px',
    inputColor: '#e8e8f0',
    inputFocusBorder: '2px solid #7b8cff',
    inputFocusShadow: '0 0 0 3px rgba(123,140,255,0.15)',
    buttonBg: '#7b8cff',
    buttonColor: '#ffffff',
    buttonRadius: '10px',
    buttonHoverBg: '#6678e8',
    buttonShadow: '0 4px 14px rgba(123,140,255,0.3)',
    linkColor: '#6b6b8a',
    tabBg: '#1e1e35',
    tabTextColor: '#6b6b8a',
    tabActiveBg: '#252540',
    tabActiveColor: '#7b8cff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontImport: null,
  });

  // 主题 3：川大红
  ThemeManager.register('scu-red', {
    name: 'scu-red',
    displayName: '川大红',
    bodyBg: '#fdf6f5',
    bodyBgImage: null,
    cardBg: '#ffffff',
    cardRadius: '16px',
    cardShadow: '0 4px 24px rgba(139,31,31,0.08), 0 0 0 1px rgba(139,31,31,0.06)',
    titleColor: '#8b1f1f',
    inputBg: '#fefafa',
    inputBorder: '2px solid #f0d6d6',
    inputRadius: '10px',
    inputColor: '#2c1810',
    inputFocusBorder: '2px solid #c0392b',
    inputFocusShadow: '0 0 0 3px rgba(192,57,43,0.10)',
    buttonBg: '#c0392b',
    buttonColor: '#ffffff',
    buttonRadius: '10px',
    buttonHoverBg: '#a33025',
    buttonShadow: '0 4px 14px rgba(192,57,43,0.3)',
    linkColor: '#b0887f',
    tabBg: '#faf5f5',
    tabTextColor: '#b0887f',
    tabActiveBg: '#fef5f5',
    tabActiveColor: '#c0392b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", serif',
    fontImport: null,
  });

  // ============================================================
  // 初始化
  // ============================================================

  const SUPPORTED_PATHS = ['/login', '/'];

  function isLoginPage() {
    const path = window.location.pathname;
    return SUPPORTED_PATHS.some(p => path === p || path.startsWith(p + '?'));
  }

  function init() {
    if (!isLoginPage()) {
      console.log('[UPR++] 非登录页面，跳过（后续版本将扩展更多页面）');
      return;
    }

    // 读取保存的主题，没有则用默认
    const savedTheme = GM_getValue(THEME_STORAGE_KEY, 'default');
    ThemeManager.apply(savedTheme);

    console.log(
      `[UPR++] 登录页美化已加载 | 当前主题: ${ThemeManager._themes.get(ThemeManager._current)?.displayName}`,
    );
    console.log('[UPR++] 可用主题:', ThemeManager.list().map(t => t.displayName).join(' / '));
    console.log('[UPR++] 切换主题: UPRPP.theme.apply("主题名")');
  }

  // ============================================================
  // 暴露全局 API
  // ============================================================

  const UPRPP = {
    version: '0.1.0',
    theme: {
      register: ThemeManager.register.bind(ThemeManager),
      apply: ThemeManager.apply.bind(ThemeManager),
      getCurrent: ThemeManager.getCurrent.bind(ThemeManager),
      list: ThemeManager.list.bind(ThemeManager),
    },
  };

  // 挂载到页面全局（沙箱模式下必须用 unsafeWindow）
  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  global.UPRPP = UPRPP;

  // 等待 DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
