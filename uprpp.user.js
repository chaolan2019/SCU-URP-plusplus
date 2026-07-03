// ==UserScript==
// @name         UPR++ 教务系统美化
// @namespace    https://github.com/hanako/upr-plus
// @version      0.3.0
// @description  四川大学 URP 教务系统登录页重建 | Design: UI UX Pro Max | Minimalism & Swiss Style
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
  // 设计 Token（CSS Custom Properties 驱动）
  // 基于 UI UX Pro Max: Minimalism & Swiss Style
  // 调色板: Institutional Navy #1E3A5F + Gold #A16207
  // ============================================================

  const THEME_KEY = 'uprpp_theme_v3';

  /**
   * 主题定义：只需提供 colors 和 typography
   * shape / spacing 由 base 统一控制
   */
  const THEMES = {

    'default': {
      name: '简约白',
      colors: {
        '--uprpp-primary': '#1E3A5F',
        '--uprpp-primary-hover': '#162D4A',
        '--uprpp-primary-ghost': '#E8EDF3',
        '--uprpp-accent': '#A16207',
        '--uprpp-accent-hover': '#8B5206',
        '--uprpp-bg': '#F4F6F9',
        '--uprpp-surface': '#FFFFFF',
        '--uprpp-surface-hover': '#F8FAFC',
        '--uprpp-text': '#0F172A',
        '--uprpp-text-secondary': '#64748B',
        '--uprpp-text-muted': '#94A3B8',
        '--uprpp-border': '#E2E8F0',
        '--uprpp-border-focus': '#1E3A5F',
        '--uprpp-input-bg': '#F8FAFC',
        '--uprpp-ring': 'rgba(30,58,95,0.15)',
        '--uprpp-divider': '#F1F5F9',
        '--uprpp-shadow-sm': '0 1px 3px rgba(0,0,0,0.06)',
        '--uprpp-shadow-card': '0 4px 32px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.03)',
        '--uprpp-radius': '14px',
        '--uprpp-radius-sm': '10px',
      },
      fontImport: null,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    },

    'dark': {
      name: '深邃暗',
      colors: {
        '--uprpp-primary': '#93A8C7',
        '--uprpp-primary-hover': '#AFC0D8',
        '--uprpp-primary-ghost': '#1E293B',
        '--uprpp-accent': '#D4AF37',
        '--uprpp-accent-hover': '#E5C550',
        '--uprpp-bg': '#0B0F17',
        '--uprpp-surface': '#151A24',
        '--uprpp-surface-hover': '#1C2330',
        '--uprpp-text': '#E2E8F0',
        '--uprpp-text-secondary': '#94A3B8',
        '--uprpp-text-muted': '#64748B',
        '--uprpp-border': '#1E293B',
        '--uprpp-border-focus': '#93A8C7',
        '--uprpp-input-bg': '#1C2330',
        '--uprpp-ring': 'rgba(147,168,199,0.15)',
        '--uprpp-divider': '#1A1F2A',
        '--uprpp-shadow-sm': '0 1px 3px rgba(0,0,0,0.3)',
        '--uprpp-shadow-card': '0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        '--uprpp-radius': '14px',
        '--uprpp-radius-sm': '10px',
      },
      fontImport: null,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    },

    'scu-red': {
      name: '川大红',
      colors: {
        '--uprpp-primary': '#B53434',
        '--uprpp-primary-hover': '#962929',
        '--uprpp-primary-ghost': '#FDF0F0',
        '--uprpp-accent': '#8B1F1F',
        '--uprpp-accent-hover': '#6E1818',
        '--uprpp-bg': '#FDF6F5',
        '--uprpp-surface': '#FFFFFF',
        '--uprpp-surface-hover': '#FFFAFA',
        '--uprpp-text': '#2C1810',
        '--uprpp-text-secondary': '#A0807A',
        '--uprpp-text-muted': '#C0A8A2',
        '--uprpp-border': '#F0E0DE',
        '--uprpp-border-focus': '#B53434',
        '--uprpp-input-bg': '#FEFCFB',
        '--uprpp-ring': 'rgba(181,52,52,0.12)',
        '--uprpp-divider': '#FAF0EE',
        '--uprpp-shadow-sm': '0 1px 3px rgba(139,31,31,0.04)',
        '--uprpp-shadow-card': '0 4px 32px rgba(139,31,31,0.07), 0 0 0 1px rgba(139,31,31,0.04)',
        '--uprpp-radius': '14px',
        '--uprpp-radius-sm': '10px',
      },
      fontImport: null,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", serif',
    },

  };

  // ============================================================
  // 主题管理器（CSS 变量方式）
  // ============================================================

  const ThemeManager = {
    _current: null,
    _styleEl: null,

    apply(name) {
      const t = THEMES[name];
      if (!t) { console.warn('[UPR++] 主题不存在:', name); return this.apply('default'); }
      this._current = name;
      GM_setValue(THEME_KEY, name);

      // 更新 CSS 变量
      let css = ':root {\n';
      for (const [k, v] of Object.entries(t.colors)) {
        css += `  ${k}: ${v};\n`;
      }
      css += '}';

      if (this._styleEl) this._styleEl.remove();
      this._styleEl = document.createElement('style');
      this._styleEl.id = 'uprpp-vars';
      this._styleEl.textContent = css;
      document.head.appendChild(this._styleEl);

      // 字体
      document.body.style.fontFamily = t.fontFamily;
      if (t.fontImport) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = t.fontImport;
        document.head.appendChild(link);
      }

      console.log(`[UPR++] ${t.name} | Minimalism & Swiss Style`);
    },

    getCurrent() { return this._current; },

    list() {
      return Object.entries(THEMES).map(([k, v]) => ({
        name: k, displayName: v.name, current: k === this._current,
      }));
    },
  };

  // ============================================================
  // 登录页重建器
  // ============================================================

  class LoginPageRebuilder {

    constructor() {
      this.originalForm = null;
      this.container = null;
      this.mode = 'account'; // 'account' | 'sso'
    }

    /**
     * 入口：检查是否为登录页，是则重建
     */
    static maybeRebuild() {
      const path = window.location.pathname;
      const isLogin = path === '/login' || path === '/loginEn' || path === '/' || path === '';
      if (!isLogin) {
        console.log('[UPR++] 非登录页，跳过');
        return;
      }
      const rebuilder = new LoginPageRebuilder();
      // 轮询等待原始 DOM 就绪
      const tryBuild = () => {
        const form = document.querySelector('.form-signin');
        const fc = document.getElementById('formContent');
        if (form && fc) {
          rebuilder.build(form, fc);
        } else {
          setTimeout(tryBuild, 50);
        }
      };
      tryBuild();
    }

    /**
     * 构建新 UI
     */
    build(originalForm, formContent) {
      this.originalForm = originalForm;

      // 1. 隐藏原始内容
      for (const child of formContent.children) {
        child.style.display = 'none';
      }

      // 2. 覆盖卡片样式（全宽居中）
      formContent.style.cssText = `
        max-width: 440px; width: 90%; margin: 0 auto;
        background: transparent; box-shadow: none; border-radius: 0;
        position: relative; z-index: 1;
      `;

      // 3. 注入新 UI
      const html = this._renderHTML();
      formContent.insertAdjacentHTML('afterbegin', html);
      this.container = formContent.querySelector('#uprpp-root');

      // 4. 绑定事件
      this._bindEvents(formContent);

      // 5. 主题适配
      this._applyThemeToUI();

      console.log('[UPR++] 登录界面重建完成');
    }

    /**
     * 渲染 HTML
     */
    _renderHTML() {
      const isEn = window.location.pathname === '/loginEn';
      const t = (zh, en) => isEn ? en : zh;

      return `
      <div id="uprpp-root" style="animation: uprpp-fadeIn 0.5s ease-out;">
        <style>
          @keyframes uprpp-fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes uprpp-slideUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          #uprpp-root * { box-sizing: border-box; margin: 0; }

          /* ===== 卡片 ===== */
          .uprpp-card {
            background: var(--uprpp-surface);
            border-radius: var(--uprpp-radius);
            box-shadow: var(--uprpp-shadow-card);
            overflow: hidden;
          }

          /* ===== 品牌区 ===== */
          .uprpp-brand {
            text-align: center;
            padding: 40px 32px 28px;
          }
          .uprpp-brand svg {
            width: 56px; height: 56px; opacity: 0.85;
          }
          .uprpp-brand h1 {
            font-size: 18px; font-weight: 600; color: var(--uprpp-text);
            margin-top: 16px; letter-spacing: 1px;
          }
          .uprpp-brand p {
            font-size: 13px; color: var(--uprpp-text-secondary);
            margin-top: 6px;
          }

          /* ===== Tab 切换 ===== */
          .uprpp-tabs {
            display: flex; margin: 0 32px;
            background: var(--uprpp-input-bg); border-radius: var(--uprpp-radius-sm);
            padding: 4px; gap: 4px;
          }
          .uprpp-tab {
            flex: 1; text-align: center; padding: 10px 0;
            border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;
            color: var(--uprpp-text-secondary); transition: all 0.2s;
            border: none; background: transparent; font-family: inherit;
          }
          .uprpp-tab.active {
            background: var(--uprpp-surface);
            color: var(--uprpp-text); font-weight: 600;
            box-shadow: var(--uprpp-shadow-sm);
          }
          .uprpp-tab:hover:not(.active) {
            color: var(--uprpp-text);
          }

          /* ===== 表单区 ===== */
          .uprpp-form-body {
            padding: 28px 32px 32px;
          }

          .uprpp-field {
            margin-bottom: 20px;
            animation: uprpp-slideUp 0.4s ease-out both;
          }
          .uprpp-field:nth-child(1) { animation-delay: 0.05s; }
          .uprpp-field:nth-child(2) { animation-delay: 0.1s; }
          .uprpp-field:nth-child(3) { animation-delay: 0.15s; }

          .uprpp-label {
            display: block; font-size: 13px; font-weight: 500;
            color: var(--uprpp-text); margin-bottom: 6px;
          }
          .uprpp-input {
            display: block; width: 100%; height: 46px; padding: 0 14px;
            background: var(--uprpp-input-bg); border: 1.5px solid var(--uprpp-border);
            border-radius: var(--uprpp-radius-sm); font-size: 15px;
            color: var(--uprpp-text); font-family: inherit;
            outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          }
          .uprpp-input:focus {
            border-color: var(--uprpp-border-focus);
            box-shadow: 0 0 0 3px var(--uprpp-ring);
          }
          .uprpp-input::placeholder {
            color: var(--uprpp-text-muted);
          }

          /* 验证码行 */
          .uprpp-captcha-row {
            display: flex; gap: 12px; align-items: stretch;
          }
          .uprpp-captcha-row .uprpp-field {
            flex: 1; margin-bottom: 0;
          }
          .uprpp-captcha-img {
            height: 46px; border-radius: var(--uprpp-radius-sm);
            cursor: pointer; border: 1.5px solid var(--uprpp-border);
            flex-shrink: 0;
          }

          /* ===== 按钮 ===== */
          .uprpp-btn {
            display: block; width: 100%; height: 48px; margin-top: 24px;
            background: var(--uprpp-primary); color: #FFFFFF; border: none;
            border-radius: var(--uprpp-radius-sm); font-size: 16px;
            font-weight: 600; font-family: inherit; cursor: pointer;
            letter-spacing: 2px; transition: all 0.2s;
            box-shadow: 0 2px 8px var(--uprpp-ring);
          }
          .uprpp-btn:hover {
            background: var(--uprpp-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px var(--uprpp-ring);
          }
          .uprpp-btn:active { transform: translateY(0); }

          /* ===== 底部链接 ===== */
          .uprpp-footer {
            text-align: center; padding: 0 32px 28px;
            font-size: 13px; color: var(--uprpp-text-secondary);
          }
          .uprpp-footer a {
            color: var(--uprpp-text-secondary); text-decoration: none;
            margin: 0 12px; transition: color 0.2s;
          }
          .uprpp-footer a:hover { color: var(--uprpp-primary); }

          /* ===== 主题切换器 ===== */
          .uprpp-theme-switcher {
            display: flex; justify-content: center; gap: 8px;
            padding: 0 32px 24px;
          }
          .uprpp-theme-dot {
            width: 10px; height: 10px; border-radius: 50%;
            cursor: pointer; border: 2px solid var(--uprpp-border);
            transition: all 0.2s; background: transparent;
          }
          .uprpp-theme-dot.active {
            border-color: var(--uprpp-primary);
            background: var(--uprpp-primary);
          }
          .uprpp-theme-dot:hover { border-color: var(--uprpp-text-secondary); }
        </style>

        <div class="uprpp-card">
          <!-- 品牌区 -->
          <div class="uprpp-brand">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="var(--uprpp-primary)" stroke-width="2" fill="none" opacity="0.3"/>
              <circle cx="50" cy="50" r="36" stroke="var(--uprpp-primary)" stroke-width="1.5" fill="none" opacity="0.5"/>
              <path d="M50 18 L58 42 L84 42 L63 57 L71 81 L50 66 L29 81 L37 57 L16 42 L42 42 Z"
                    fill="var(--uprpp-primary)" opacity="0.85"/>
            </svg>
            <h1>${t('四川大学教务管理系统', 'Sichuan University Academic System')}</h1>
            <p>${t('学生端登录', 'Student Portal')}</p>
          </div>

          <!-- Tab 切换 -->
          <div class="uprpp-tabs" id="uprpp-tabs">
            <button class="uprpp-tab active" data-mode="account">${t('账号登录', 'Account')}</button>
            <button class="uprpp-tab" data-mode="sso">${t('统一认证', 'SSO')}</button>
          </div>

          <!-- 表单 -->
          <div class="uprpp-form-body" id="uprpp-form-body">
            <div class="uprpp-field">
              <label class="uprpp-label" for="uprpp-username">${t('学号', 'Student ID')}</label>
              <input class="uprpp-input" id="uprpp-username" type="text"
                     placeholder="${t('请输入学号', 'Enter student ID')}" autocomplete="username">
            </div>
            <div class="uprpp-field">
              <label class="uprpp-label" for="uprpp-password">${t('密码', 'Password')}</label>
              <input class="uprpp-input" id="uprpp-password" type="password"
                     placeholder="${t('请输入密码', 'Enter password')}" autocomplete="current-password">
            </div>
            <div class="uprpp-captcha-row">
              <div class="uprpp-field">
                <label class="uprpp-label" for="uprpp-captcha">${t('验证码', 'Captcha')}</label>
                <input class="uprpp-input" id="uprpp-captcha" type="text"
                       placeholder="${t('请输入验证码', 'Enter captcha')}" maxlength="4" autocomplete="off">
              </div>
              <img class="uprpp-captcha-img" id="uprpp-captcha-img"
                   src="" alt="Captcha" title="${t('点击刷新验证码', 'Click to refresh')}">
            </div>
            <button class="uprpp-btn" id="uprpp-submit" type="button">
              ${t('登  录', 'Sign In')}
            </button>
          </div>

          <!-- SSO 提示（默认隐藏） -->
          <div class="uprpp-form-body" id="uprpp-sso-body" style="display:none; text-align:center;">
            <p style="font-size:14px; color:var(--uprpp-text-secondary); margin-bottom:20px; line-height:1.8;">
              ${t('点击下方按钮跳转到<br>四川大学统一身份认证平台', 'Click below to redirect to<br>SCU Unified Authentication')}
            </p>
            <button class="uprpp-btn" id="uprpp-sso-btn" type="button">
              ${t('前往统一认证', 'Go to SSO')}
            </button>
          </div>

          <!-- 底部链接 -->
          <div class="uprpp-footer">
            <a href="javascript:void(0)" id="uprpp-forgot">${t('忘记密码？', 'Forgot password?')}</a>
            <a href="${isEn ? '/login' : '/loginEn'}" id="uprpp-lang">
              ${isEn ? '中文' : 'EN'}
            </a>
          </div>

          <!-- 主题切换 -->
          <div class="uprpp-theme-switcher" id="uprpp-theme-dots">
            <span class="uprpp-theme-dot" data-theme="default" title="简约白"></span>
            <span class="uprpp-theme-dot" data-theme="dark" title="深邃暗"></span>
            <span class="uprpp-theme-dot" data-theme="scu-red" title="川大红"></span>
          </div>
        </div>
      </div>`;
    }

    /**
     * 绑定事件
     */
    _bindEvents(formContent) {
      const root = formContent.querySelector('#uprpp-root');

      // 输入框 ↔ 原始 input 双向同步
      this._bindInput('#uprpp-username', '#input_username');
      this._bindInput('#uprpp-password', '#input_password');
      this._bindInput('#uprpp-captcha', '#input_checkcode');

      // 验证码图片
      const captchaImg = root.querySelector('#uprpp-captcha-img');
      const originalCaptcha = document.querySelector('.form-signin img');
      if (originalCaptcha) {
        captchaImg.src = originalCaptcha.src;
        captchaImg.addEventListener('click', () => {
          const newSrc = originalCaptcha.src.replace(/\?.*/, '') + '?' + Date.now();
          originalCaptcha.src = newSrc;
          captchaImg.src = newSrc;
        });
      }

      // Tab 切换
      root.querySelectorAll('.uprpp-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.mode = tab.dataset.mode;
          root.querySelectorAll('.uprpp-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const formBody = root.querySelector('#uprpp-form-body');
          const ssoBody = root.querySelector('#uprpp-sso-body');
          if (this.mode === 'sso') {
            formBody.style.display = 'none';
            ssoBody.style.display = 'block';
          } else {
            formBody.style.display = 'block';
            ssoBody.style.display = 'none';
          }
        });
      });

      // SSO 按钮
      const ssoBtn = root.querySelector('#uprpp-sso-btn');
      if (ssoBtn) {
        ssoBtn.addEventListener('click', () => {
          const tocas = document.querySelector('#tocas a');
          if (tocas) window.location.href = tocas.href;
        });
      }

      // 登录按钮
      const submitBtn = root.querySelector('#uprpp-submit');
      submitBtn.addEventListener('click', () => {
        const originalBtn = document.getElementById('loginButton');
        if (originalBtn) {
          // 先触发原始按钮的 onclick（MD5 加密密码）
          originalBtn.click();
        }
        // 提交表单
        if (this.originalForm) {
          this.originalForm.submit();
        }
      });

      // 回车提交
      root.querySelectorAll('.uprpp-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') submitBtn.click();
        });
      });

      // 忘记密码
      const forgotLink = root.querySelector('#uprpp-forgot');
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const originalForgot = document.querySelector('a[href*="forgot"]');
        if (!originalForgot) {
          // 触发原始页面的忘记密码链接
          const allLinks = document.querySelectorAll('a');
          for (const a of allLinks) {
            if (a.textContent.includes('忘记') || a.textContent.includes('Forgot')) {
              a.click();
              break;
            }
          }
        }
      });

      // 主题切换
      const dots = root.querySelector('#uprpp-theme-dots');
      dots.querySelectorAll('.uprpp-theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          ThemeManager.apply(dot.dataset.theme);
          dots.querySelectorAll('.uprpp-theme-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });

      // 标记当前主题 dot
      const currentTheme = ThemeManager.getCurrent() || 'default';
      const activeDot = dots.querySelector(`[data-theme="${currentTheme}"]`);
      if (activeDot) activeDot.classList.add('active');
    }

    /**
     * 双向绑定：新 input ↔ 原始 input
     */
    _bindInput(newSelector, originalSelector) {
      const newInput = document.querySelector(newSelector);
      const originalInput = document.querySelector(originalSelector);
      if (!newInput || !originalInput) return;

      // 保留原始 input 的 name 等属性
      newInput.addEventListener('input', () => {
        originalInput.value = newInput.value;
      });
      // 初始值
      if (originalInput.value) {
        newInput.value = originalInput.value;
      }
    }

    /**
     * 主题适配 UI（更新中继数据）
     */
    _applyThemeToUI() {
      // CSS 变量已由 ThemeManager 注入，UI 自动响应
      // 此处仅需更新任何 JavaScript 相关的主题状态
    }
  }

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    // 等待 DOM 主体就绪后再初始化
    const doInit = () => {
      if (!document.body || !document.head) {
        setTimeout(doInit, 10);
        return;
      }
      // 加载主题
      const saved = GM_getValue(THEME_KEY, 'default');
      ThemeManager.apply(saved);

      // 重建登录页
      LoginPageRebuilder.maybeRebuild();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doInit);
    } else {
      doInit();
    }
  }

  // ============================================================
  // 全局 API
  // ============================================================

  const UPRPP = {
    version: '0.3.0',
    theme: {
      apply: ThemeManager.apply.bind(ThemeManager),
      getCurrent: ThemeManager.getCurrent.bind(ThemeManager),
      list: ThemeManager.list.bind(ThemeManager),
    },
  };

  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  global.UPRPP = UPRPP;

  init();
})();
