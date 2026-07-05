// ==UserScript==
// @name         UPR++ 教务系统美化
// @namespace    https://github.com/hanako/upr-plus
// @version      0.3.13
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

  // 最早阶段注入：先隐藏原 UI，重构完再淡入
  GM_addStyle(`
    html, body { background: #F4F6F9 !important; color: #0F172A !important; }
    body { opacity: 0 !important; transition: opacity .25s ease; }
    body.uprpp-ready { opacity: 1 !important; }
  `);

  const THEME_KEY = 'uprpp_theme_v3';
  const ACCENT_KEY = 'uprpp_accent_v1';

  const THEMES = {
    'default': {
      name: '简约白',
      vars: {
        '--bg': '#F4F6F9', '--surface': '#FFFFFF',
        '--text': '#0F172A', '--text-secondary': '#64748B', '--text-muted': '#94A3B8',
        '--border': '#E2E8F0', '--border-focus': 'var(--uprpp-accent, #1E3A5F)',
        '--input-bg': '#F8FAFC', '--primary': 'var(--uprpp-accent, #1E3A5F)', '--primary-hover': 'var(--uprpp-accent-hover, #162D4A)',
        '--ring': 'var(--uprpp-accent-ring, rgba(30,58,95,0.15))',
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
    document.documentElement.style.setProperty('--uprpp-accent', hex);
    document.documentElement.style.setProperty('--uprpp-accent-hover', hover);
    document.documentElement.style.setProperty('--uprpp-accent-ring', ring);
  }

  function getAccent() { return GM_getValue(ACCENT_KEY, ''); }

  function applyTheme(name) {
    const t = THEMES[name] || THEMES['default'];
    GM_setValue(THEME_KEY, name);
    const el = document.getElementById('uprpp-theme-vars') || (() => {
      const e = document.createElement('style'); e.id = 'uprpp-theme-vars';
      document.head.appendChild(e); return e;
    })();
    let css = ':root {';
    for (const [k, v] of Object.entries(t.vars)) css += `${k}:${v};`;
    css += '}';
    el.textContent = css;
    document.body.style.fontFamily = t.font;
    applyAccent(getAccent());
    console.log(`[UPR++] ${t.name}`);
  }

  function getCurrent() { return GM_getValue(THEME_KEY, 'default'); }

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
    <div id="uprpp-root">
      <style>
        #uprpp-root,#uprpp-root *{box-sizing:border-box;}
        #uprpp-root *{border:0;outline:0;}

        /* 全局背景同步主题 */
        html,body{background:var(--bg)!important;min-height:100vh}
        .wrapper{background:transparent!important}

        /* 版本水印 */
        #uprpp-root::after{
          content:'UPR++ v0.3.13';
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
        #uprpp-root .ui{
          display:block;width:100%;height:46px;padding:0 14px;
          background:var(--input-bg) !important;
          border:1.5px solid var(--border) !important;
          border-radius:var(--radius-sm);
          font-size:15px;color:var(--text) !important;
          font-family:inherit;
          transition:border-color .2s,box-shadow .2s;
        }
        #uprpp-root .ui:focus{
          border-color:var(--border-focus) !important;
          box-shadow:0 0 0 3px var(--ring) !important;
        }
        #uprpp-root .ui::placeholder{color:var(--text-muted)}

        /* 验证码行：图片放在输入框内部右侧，确保总长度与其他输入框一致 */
        #uprpp-root .ucr{
          width:100% !important;
          margin-bottom:0 !important;
        }
        #uprpp-root .ufg-cap{
          margin-bottom:0 !important;
        }
        #uprpp-root .ucap-input-wrap{
          position:relative !important;
          width:100% !important;
        }
        #uprpp-root .ucap-input-wrap .ui{
          padding-right:148px !important;
        }
        #uprpp-root .uci-wrap{
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
        #uprpp-root .uci{
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
        <div class="ub" id="uprpp-brand">
          <div class="ub-logo">${originalSvg || ''}</div>
          <h1>${t('四川大学教务管理系统','SCU Academic System')}</h1>
          <p>${t('学生端 · 欢迎登录','Student Portal · Welcome')}</p>
        </div>

        <div class="ut" id="uprpp-tabs">
          <button class="ac" data-mode="account">${t('账号登录','Account')}</button>
          <button data-mode="sso">${t('统一认证','SSO')}</button>
        </div>

        <div class="ufb" id="uprpp-form">
          <div class="ufg">
            <label class="ufl" for="uprpp-user">${t('学号','Student ID')}</label>
            <input class="ui" id="uprpp-user" type="text" placeholder="${t('请输入学号','Enter student ID')}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="uprpp-pass">${t('密码','Password')}</label>
            <input class="ui" id="uprpp-pass" type="password" placeholder="${t('请输入密码','Enter password')}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="uprpp-cap">${t('验证码','Captcha')}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="uprpp-cap" type="text" placeholder="${t('请输入','Enter')}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="uprpp-capwrap" title="${t('点击刷新','Refresh')}">
                  <img class="uci" id="uprpp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="uprpp-submit">${t('登 录','Sign In')}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="uprpp-forgot">${t('忘记密码？','Forgot password?')}</a>
          <a href="${isEn?'/login':'/loginEn'}">${isEn?'中文':'EN'}</a>
        </div>

        <div class="us" id="uprpp-dots">
          <span data-theme="default" title="简约白" style="background:#F1F5F9"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="川大红" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);

    // ---- 事件绑定 ----

    const root = formContent.querySelector('#uprpp-root');

    // 输入同步
    [
      ['#uprpp-user', '#input_username'],
      ['#uprpp-pass', '#input_password'],
      ['#uprpp-cap', '#input_checkcode'],
    ].forEach(([ns, os]) => {
      const ni = root.querySelector(ns), oi = document.querySelector(os);
      if (ni && oi) {
        if (oi.value) ni.value = oi.value;
        ni.addEventListener('input', () => { oi.value = ni.value; });
      }
    });

    // 验证码
    const capImg = root.querySelector('#uprpp-capimg');
    const capWrap = root.querySelector('#uprpp-capwrap');
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
        const formEl = root.querySelector('#uprpp-form');
        const ssoEl = root.querySelector('#uprpp-sso');
        if (formEl) formEl.style.display = 'block';
        if (ssoEl) ssoEl.style.display = 'none';
      });
    });

    // 登录
    const submitBtn = root.querySelector('#uprpp-submit');
    submitBtn.addEventListener('click', () => {
      const origBtn = document.getElementById('loginButton');
      if (origBtn) origBtn.click();
      originalForm.submit();
    });
    root.querySelectorAll('.ui').forEach(i => {
      i.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click(); });
    });

    // 忘记密码
    root.querySelector('#uprpp-forgot').addEventListener('click', e => {
      e.preventDefault();
      const links = document.querySelectorAll('a');
      for (const a of links) {
        if (a.textContent.includes('忘记') || a.textContent.includes('Forgot')) { a.click(); break; }
      }
    });

    // 主题
    const dots = root.querySelector('#uprpp-dots');
    const ct = getCurrent();
    dots.querySelectorAll('span').forEach(d => {
      if (d.dataset.theme === ct) d.classList.add('ac');
      d.addEventListener('click', () => {
        applyTheme(d.dataset.theme);
        dots.querySelectorAll('span').forEach(dd => dd.classList.remove('ac'));
        d.classList.add('ac');
      });
    });

    console.log('[UPR++] 登录界面已重建');
  }

  // ============================================================
  // 正式页面全局美化
  // ============================================================

  function beautifyInternal() {
    const styleExists = !!document.getElementById('uprpp-internal-style');
    if (!styleExists) {
      const style = document.createElement('style');
      style.id = 'uprpp-internal-style';
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
      :root { --uprpp-navbar-height: 45px; }
      .sidebar:not(.menu-min) { width: 260px !important; }
      .sidebar.menu-min { width: 50px !important; }
      .sidebar:not(.menu-min) ~ .main-content { margin-left: 260px !important; }
      .sidebar.menu-min ~ .main-content { margin-left: 50px !important; }
      .main-content { margin-top: var(--uprpp-navbar-height) !important; transition: margin-left .25s ease; }
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-fixed-top,
      .navbar-fixed-bottom { left: 0 !important; right: 0 !important; }
      .sidebar {
        z-index: 1040 !important;
        top: var(--uprpp-navbar-height) !important;
        height: calc(100vh - var(--uprpp-navbar-height)) !important;
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
      .uprpp-sidebar-header {
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
      #uprpp-menus { margin-top: 50px !important; }
      .uprpp-sidebar-toggle {
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
      .uprpp-sidebar-toggle:hover { background: var(--border); color: var(--text); }

      /* 新菜单 */
      #uprpp-menus {
        list-style: none;
        margin: 50px 0 0 0;
        padding: 10px 12px 24px;
        overflow-y: auto;
        max-height: calc(100vh - 64px);
      }
      #uprpp-menus::-webkit-scrollbar { width: 4px; }
      #uprpp-menus::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

      .uprpp-nav-item { margin: 4px 0; }
      .uprpp-nav-link {
        display: flex;
        align-items: center;
        padding: 11px 13px;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        cursor: pointer;
        transition: background .15s, color .15s;
        text-decoration: none;
        position: relative;
      }
      .uprpp-nav-link:hover { background: var(--input-bg); color: var(--text); }
      .uprpp-nav-item.active > .uprpp-nav-link,
      .uprpp-nav-item.open.active > .uprpp-nav-link {
        background: var(--input-bg);
        color: var(--primary);
        font-weight: 500;
      }
      .uprpp-nav-link > .fa {
        width: 22px;
        text-align: center;
        margin-right: 11px;
        font-size: 18px;
        color: inherit;
        flex-shrink: 0;
        transition: margin .25s ease;
      }
      .uprpp-nav-text {
        flex: 1;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 1;
        max-width: 200px;
        transition: opacity .2s ease, max-width .25s ease;
      }
      .uprpp-nav-arrow {
        font-size: 13px;
        color: var(--text-muted);
        margin-left: 8px;
        opacity: 1;
        max-width: 20px;
        transition: transform .2s, opacity .2s ease, max-width .25s ease;
        flex-shrink: 0;
      }
      .uprpp-nav-item.open > .uprpp-nav-link .uprpp-nav-arrow { transform: rotate(180deg); }

      .uprpp-nav-submenu {
        list-style: none;
        margin: 0;
        padding: 3px 0 3px 20px;
        display: none !important;
      }
      .uprpp-nav-item.open > .uprpp-nav-submenu { display: block !important; }
      .uprpp-nav-submenu .uprpp-nav-link { padding: 9px 13px; font-size: 14px; }
      .uprpp-nav-submenu .uprpp-nav-submenu { padding-left: 16px; }

      /* 折叠状态 */
      .sidebar.menu-min .uprpp-sidebar-header { justify-content: center; padding: 14px 0 12px; }
      .sidebar.menu-min #uprpp-menus { padding: 10px 6px 24px; }
      .sidebar.menu-min .uprpp-nav-link { padding: 12px 0; justify-content: center; }
      .sidebar.menu-min .uprpp-nav-text,
      .sidebar.menu-min .uprpp-nav-arrow {
        opacity: 0;
        max-width: 0;
        margin-left: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .sidebar.menu-min .uprpp-nav-link > .fa { margin-right: 0; font-size: 18px; }
      .sidebar.menu-min .uprpp-nav-submenu { display: none !important; }

      /* 主内容区 */
      .main-content, .page-content { background: var(--bg) !important; }
      .breadcrumbs, .breadcrumb { background: transparent !important; border-color: var(--border) !important; }
      .breadcrumb > li > a { color: var(--text-secondary) !important; }
      .breadcrumb > li.active { color: var(--text-muted) !important; }

      /* 卡片 / 面板 */
      .widget-box { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; box-shadow: var(--shadow) !important; }
      .widget-header { background: transparent !important; border-bottom: 1px solid var(--border) !important; color: var(--text) !important; }
      .widget-body { background: var(--surface) !important; color: var(--text) !important; }
      .well { background: var(--input-bg) !important; border-color: var(--border) !important; }

      /* 个人信息 */
      .profile-user-info { border-color: var(--border) !important; }
      .profile-info-name { background: var(--input-bg) !important; color: var(--text-secondary) !important; border-color: var(--border) !important; }
      .profile-info-value { border-color: var(--border) !important; color: var(--text) !important; }

      /* 表格 */
      .table, .table-bordered, .table-striped, .table-hover, .dataTable { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .table > thead > tr > th, .table-bordered > thead > tr > th, .dataTable > thead > tr > th { background: var(--input-bg) !important; color: var(--text) !important; border-color: var(--border) !important; }
      .table > tbody > tr > td, .table > tbody > tr > th, .table-bordered > tbody > tr > td, .dataTable > tbody > tr > td { border-color: var(--border) !important; color: var(--text) !important; }
      .table-striped > tbody > tr:nth-of-type(odd), .dataTable > tbody > tr:nth-of-type(odd) { background: var(--bg) !important; }
      .table-hover > tbody > tr:hover, .dataTable > tbody > tr:hover { background: var(--input-bg) !important; }

      /* 按钮 */
      .btn { border-radius: var(--radius-sm) !important; }
      .btn-primary, .btn-info { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }
      .btn-primary:hover, .btn-info:hover { background: var(--primary-hover) !important; border-color: var(--primary-hover) !important; }
      .btn-success { background: #22c55e !important; border-color: #22c55e !important; color: #fff !important; }
      .btn-success:hover { background: #16a34a !important; border-color: #16a34a !important; }
      .btn-warning { background: #f59e0b !important; border-color: #f59e0b !important; color: #fff !important; }
      .btn-danger { background: #ef4444 !important; border-color: #ef4444 !important; color: #fff !important; }
      .btn-default, .btn-white { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .btn-default:hover, .btn-white:hover { background: var(--border) !important; }
      .btn-app { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: var(--radius-sm) !important; }
      .btn-app:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }

      /* 表单 */
      input, select, textarea, .form-control, .chosen-single, .chosen-choices { background: var(--input-bg) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: var(--radius-sm) !important; }
      input:focus, select:focus, textarea:focus, .form-control:focus, .chosen-container-active .chosen-single, .chosen-container-active .chosen-choices { border-color: var(--border-focus) !important; box-shadow: 0 0 0 3px var(--ring) !important; }
      .chosen-drop { background: var(--surface) !important; border-color: var(--border) !important; box-shadow: var(--shadow) !important; }
      .chosen-results li { color: var(--text) !important; }
      .chosen-results li.highlighted { background: var(--primary) !important; color: #fff !important; }
      label { color: var(--text-secondary) !important; }

      /* 标签页 */
      .nav-tabs { border-bottom: 1px solid var(--border) !important; }
      .nav-tabs > li > a { color: var(--text-secondary) !important; background: transparent !important; border: none !important; }
      .nav-tabs > li > a:hover { color: var(--text) !important; background: var(--input-bg) !important; }
      .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus { color: var(--primary) !important; background: var(--surface) !important; border: 1px solid var(--border) !important; border-bottom-color: var(--surface) !important; }
      .tab-content { background: var(--surface) !important; border: 1px solid var(--border) !important; border-top: none !important; }

      /* 分页 */
      .pagination > li > a, .pagination > li > span { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .pagination > li.active > a, .pagination > li.active > span, .pagination > li.active > a:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }

      /* 下拉菜单 */
      .dropdown-menu { background: var(--surface) !important; border: 1px solid var(--border) !important; box-shadow: var(--shadow) !important; }
      .dropdown-menu > li > a { color: var(--text) !important; }
      .dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus, .dropdown-menu > .active > a { background: var(--input-bg) !important; color: var(--text) !important; }
      .dropdown-menu .divider { background: var(--border) !important; }

      /* 弹窗 */
      .modal-content { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; box-shadow: var(--shadow) !important; }
      .modal-header { border-bottom: 1px solid var(--border) !important; }
      .modal-header .close { color: var(--text-secondary) !important; }
      .modal-title { color: var(--text) !important; }
      .modal-footer { border-top: 1px solid var(--border) !important; }

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
      #courseTable { border-collapse: separate !important; border-spacing: 3px !important; background: transparent !important; }
      #courseTable th {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; border: none !important; border-radius: var(--radius-sm) !important;
        padding: 10px 8px !important; text-align: center !important; font-size: 13px !important;
      }
      #courseTable td {
        border: none !important; border-radius: var(--radius) !important;
        padding: 4px !important; vertical-align: top !important;
        font-size: 13px !important; line-height: 1.6 !important;
        color: var(--text) !important; overflow: visible !important;
      }
      #courseTable td:first-child {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; text-align: center !important; font-size: 11px !important;
      }
      /* 课程卡片色块 */
      #courseTable .class_div.box_font,
      #courseTable div[class*="div-kcb"],
      #courseTable .uprpp-course-card {
        border-radius: var(--radius) !important;
        overflow: hidden !important;
      }

      /* 列表 / 通知 */
      .list-group-item { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .list-group-item:hover { background: var(--input-bg) !important; }
      .list-group-item.active { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }
      .alert, .alert-info { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: var(--radius-sm) !important; }
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
      #uprpp-dashboard { padding: 24px; max-width: 1440px; margin: 0 auto; }
      .uprpp-welcome { margin-bottom: 24px; }
      .uprpp-welcome h2 { font-size: 26px; font-weight: 600; color: var(--text); margin: 0 0 6px; letter-spacing: 1px; }
      .uprpp-welcome p { color: var(--text-secondary); margin: 0; font-size: 14px; }
      .uprpp-stats-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
      .uprpp-stat-card {
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
      .uprpp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--ring); }
      .uprpp-stat-card .value {
        font-size: 34px;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
        flex-shrink: 0;
      }
      .uprpp-stat-card .value.uprpp-stat-value-text {
        font-size: 30px;
        font-weight: 600;
      }
      .uprpp-stat-card .label {
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
      .uprpp-stat-skeleton { cursor: default; pointer-events: none; }
      .uprpp-stat-skeleton .value { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 48px; height: 34px; }
      .uprpp-stat-skeleton .label { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 80px; height: 20px; }
      .uprpp-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
      @media (max-width: 1100px) { .uprpp-main-grid { grid-template-columns: 1fr; } }
      #uprpp-left .uprpp-card { box-shadow: none !important; }
      #uprpp-left .fc-toolbar { margin: 0 0 12px 0 !important; padding: 8px 8px 0 8px !important; }
      #uprpp-left .fc-toolbar .fc-center h2,
      #uprpp-left .fc-toolbar h2 { display: inline-block !important; background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; padding: 6px 14px !important; font-size: 14px !important; color: var(--text) !important; box-shadow: var(--shadow) !important; }
      .uprpp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; margin-bottom: 20px; }
      .uprpp-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
      .uprpp-card-header h4 { font-size: 16px; font-weight: 600; color: var(--text); margin: 0; }
      .uprpp-card-tools .widget-toolbar { padding: 0; line-height: 1; }
      .uprpp-card-tools .widget-toolbar a { color: var(--text-secondary) !important; margin-left: 12px; font-size: 14px; }
      .uprpp-card-tools .widget-toolbar a:hover { color: var(--primary) !important; }
      .uprpp-card-body { padding: 16px 20px; }
      #uprpp-dashboard .widget-box { background: transparent; border: none; border-radius: 0; box-shadow: none; margin-bottom: 0; }
      #uprpp-dashboard .widget-header { display: none; }
      #uprpp-dashboard .widget-body { background: transparent; border: none; padding: 0; }
      #uprpp-dashboard .tabContent { counter-reset: uprpp-notice; }
      #uprpp-dashboard .tabContent h3 {
        position: relative;
        margin: 0 0 10px !important;
        padding-left: 34px;
        height: auto !important;
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      #uprpp-dashboard .tabContent h3::before {
        counter-increment: uprpp-notice;
        content: counter(uprpp-notice);
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
      #uprpp-dashboard .tabContent h3 a {
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
      #uprpp-dashboard .tabContent h3 a:hover { background: var(--border); }
      #uprpp-dashboard .tabContent h3 label { font-weight: inherit; color: inherit; margin: 0; }
      #uprpp-dashboard .tabContent h3 a > span { display: flex; justify-content: space-between; align-items: center; width: 100%; }
      #uprpp-dashboard .tabContent h3 .hide_note { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 12px; }
      #uprpp-dashboard .tabContent h3 .fa-clock-o { margin-right: 4px; color: var(--text-muted); }
      #uprpp-dashboard .uprpp-card-body:has(.btn-app) { display: block !important; padding: 16px 14px; font-size: 0; }
      #uprpp-dashboard .btn-app {
        display: inline-flex !important;
        width: 80px !important;
        height: 80px !important;
        margin: 0 12px 12px 0 !important;
        border-radius: var(--radius-sm) !important;
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
      #uprpp-dashboard .btn-app:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; transform: translateY(-2px); box-shadow: 0 4px 12px var(--ring); }
      #uprpp-dashboard .btn-app > .ace-icon { color: inherit !important; display: block; margin: 0 auto 4px; font-size: 22px; }
    `;
    if (!styleExists) document.head.appendChild(style);
    }

    // 首页进行组件级重构
    const pageContent = document.querySelector('.page-content');
    const hasWidgets = pageContent && pageContent.querySelectorAll('.widget-box').length >= 4;
    if (hasWidgets) {
      setTimeout(rebuildDashboard, 500);
    }

    // 完全重构侧边栏为 Hanako 风格
    rebuildSidebarCompletely();

    // 顶栏重建（JS 强制对齐）
    rebuildNavbar();
    window.addEventListener('load', rebuildNavbar);

    // 等 dashboard 骨架屏建立后再淡入，避免原 UI 闪烁
    setTimeout(() => document.body.classList.add('uprpp-ready'), 600);

    if (!styleExists) console.log('[UPR++] 正式页面样式已注入');

    // 课表透明度调整：背景段落 50%，课程卡片 80%
    setTimeout(() => {
      const tbl = document.getElementById('courseTable');
      if (!tbl) return;
      // 背景色块（td 上的底色）→ 50%
      tbl.querySelectorAll('td').forEach(td => {
        const bg = td.style.backgroundColor;
        if (!bg || !bg.includes('rgba')) return;
        const m = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
        if (m) td.style.backgroundColor = 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',0.5)';
      });
      // 课程卡片 → 80%
      tbl.querySelectorAll('.class_div.box_font, [class*="class_div"][class*="box"]').forEach(el => {
        const bg = el.style.backgroundColor;
        if (!bg || !bg.includes('rgba')) return;
        const m = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
        if (m) el.style.backgroundColor = 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',0.8)';
      });
    }, 1000);
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
    if (!sidebar || !origMenus || document.getElementById('uprpp-menus')) return;

    // 读取顶栏高度并同步 CSS 变量（加兜底）
    const navbar = document.querySelector('.navbar.navbar-default, .navbar-fixed-top');
    const nh = navbar ? (navbar.offsetHeight || 45) : 45;
    document.documentElement.style.setProperty('--uprpp-navbar-height', nh + 'px', 'important');
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
        const href = a?.getAttribute('href') || '#';
        const onclick = li.getAttribute('onclick') || a?.getAttribute('onclick') || '';
        const id = li.id;

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
    origMenus.remove();

    // Header + toggle
    const header = document.createElement('div');
    header.className = 'uprpp-sidebar-header';
    header.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)';
    const toggle = document.createElement('div');
    toggle.className = 'uprpp-sidebar-toggle';
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
    newMenus.id = 'uprpp-menus';
    newMenus.style.cssText = 'margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)';

    function setActiveBranch(li) {
      document.querySelectorAll('#uprpp-menus .uprpp-nav-item').forEach(el => el.classList.remove('active'));
      let p = li;
      while (p && p.id !== 'uprpp-menus') {
        if (p.classList.contains('uprpp-nav-item')) p.classList.add('active');
        p = p.parentElement;
      }
    }

    function openActiveBranch(li) {
      let p = li.parentElement;
      while (p && p.id !== 'uprpp-menus') {
        if (p.classList.contains('uprpp-nav-item')) p.classList.add('open');
        p = p.parentElement;
      }
    }

    function buildItem(item, container) {
      const li = document.createElement('li');
      li.className = 'uprpp-nav-item';
      if (item.id) li.id = item.id;

      const hasSub = item.children.length > 0;
      const link = document.createElement(hasSub ? 'div' : 'a');
      link.className = 'uprpp-nav-link';
      if (!hasSub) link.href = item.href || '#';

      if (item.iconClass) {
        const icon = document.createElement('i');
        item.iconClass.split(' ').forEach(c => { if (c) icon.classList.add(c); });
        link.appendChild(icon);
      }

      const text = document.createElement('span');
      text.className = 'uprpp-nav-text';
      text.textContent = item.text;
      text.title = item.text;
      link.appendChild(text);

      if (hasSub) {
        const arrow = document.createElement('i');
        arrow.className = 'uprpp-nav-arrow fa fa-angle-down';
        link.appendChild(arrow);
      }

      li.appendChild(link);

      if (hasSub) {
        const sub = document.createElement('ul');
        sub.className = 'uprpp-nav-submenu';
        item.children.forEach(child => buildItem(child, sub));
        li.appendChild(sub);

        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('open');
        });
        link.style.cursor = 'pointer';
      } else {
        link.addEventListener('click', () => {
          setActiveBranch(li);
          // 叶子节点靠 href 跳转，不再阻止默认行为
        });
      }

      if (item.id && activeIds.has(item.id)) {
        li.classList.add('active');
        // 不再默认展开 active 分支，保持侧边栏整洁
      }

      container.appendChild(li);
    }

    menuData.forEach(item => buildItem(item, newMenus));

    sidebar.insertBefore(header, sidebar.firstChild);
    sidebar.appendChild(newMenus);
  }

  // ============================================================
  // 首页仪表板重构
  // ============================================================

  function rebuildDashboard() {
    if (document.getElementById('uprpp-dashboard')) return;

    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    const widgets = Array.from(pageContent.querySelectorAll('.widget-box'));
    if (widgets.length < 6) return;

    const studyWidget = widgets[4];
    const infoboxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];

    const dashboard = document.createElement('div');
    dashboard.id = 'uprpp-dashboard';
    dashboard.innerHTML = `
      <div class="uprpp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="uprpp-stats-grid" id="uprpp-stats"></div>
      <div class="uprpp-main-grid">
        <div class="uprpp-left" id="uprpp-left"></div>
        <div class="uprpp-right" id="uprpp-right"></div>
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
    const statsGrid = dashboard.querySelector('#uprpp-stats');
    const skeletonCount = Math.max(infoboxes.length, 5);
    for (let i = 0; i < skeletonCount; i++) {
      const sk = document.createElement('div');
      sk.className = 'uprpp-stat-card uprpp-stat-skeleton';
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
        const valueClass = isTextValue ? 'value uprpp-stat-value-text' : 'value';
        const link = box.closest('a');
        const card = document.createElement(link ? 'a' : 'div');
        if (link) {
          card.href = link.href || 'javascript:void(0)';
          card.onclick = link.onclick;
          card.style.textDecoration = 'none';
        }
        card.className = 'uprpp-stat-card';
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
    const left = dashboard.querySelector('#uprpp-left');
    const right = dashboard.querySelector('#uprpp-right');

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

    console.log('[UPR++] 首页仪表板已重构');
  }

  function wrapWidget(widget, container, title) {
    const header = widget.querySelector('.widget-header');
    const toolbar = header ? header.querySelector('.widget-toolbar') : null;

    const card = document.createElement('div');
    card.className = 'uprpp-card';
    card.innerHTML = `
      <div class="uprpp-card-header">
        <h4>${title}</h4>
        <div class="uprpp-card-tools"></div>
      </div>
      <div class="uprpp-card-body"></div>
    `;

    if (toolbar) {
      toolbar.style.display = 'inline-block';
      card.querySelector('.uprpp-card-tools').appendChild(toolbar);
    }
    card.querySelector('.uprpp-card-body').appendChild(widget);
    container.appendChild(card);
  }

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    if (!document.body) { setTimeout(init, 10); return; }
    applyTheme(getCurrent());

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
        document.documentElement.style.setProperty('--uprpp-navbar-height', nh + 'px', 'important');
        sidebar.style.setProperty('top', nh + 'px', 'important');
        sidebar.style.setProperty('height', 'calc(100vh - ' + nh + 'px)', 'important');
        rebuildSidebarCompletely();
        rebuildNavbar();
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
  global.UPRPP = {
    version: '0.3.13',
    showLogo(show) {
      const el = document.querySelector('#uprpp-brand .ub-logo');
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
