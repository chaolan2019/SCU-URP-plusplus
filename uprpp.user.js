// ==UserScript==
// @name         UPR++ 教务系统美化
// @namespace    https://github.com/hanako/upr-plus
// @version      0.3.4
// @description  四川大学 URP 教务系统登录页美化 | UI UX Pro Max | Minimalism & Swiss Style
// @author       Hanako
// @match        http://zhjw.scu.edu.cn/*
// @match        http://202.115.47.141/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const THEME_KEY = 'uprpp_theme_v3';

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
        '--ring': 'rgba(147,168,199,0.15)',
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
  // 主题管理
  // ============================================================

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
          content:'UPR++ v0.3.4';
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
        .ui{
          display:block;width:100%;height:46px;padding:0 14px;
          background:var(--input-bg);
          border:1.5px solid var(--border);
          border-radius:var(--radius-sm);
          font-size:15px;color:var(--text);
          font-family:inherit;
          transition:border-color .2s,box-shadow .2s;
        }
        .ui:focus{
          border-color:var(--border-focus);
          box-shadow:0 0 0 3px var(--ring);
        }
        .ui::placeholder{color:var(--text-muted)}

        /* 验证码行 */
        .ucr{display:flex;gap:10px;align-items:flex-end}
        .ucr .ufg{flex:1;margin-bottom:0}
        .uci{
          height:46px;width:96px;
          border-radius:var(--radius-sm);
          cursor:pointer;
          border:1.5px solid var(--border);
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
            <div class="ufg">
              <label class="ufl" for="uprpp-cap">${t('验证码','Captcha')}</label>
              <input class="ui" id="uprpp-cap" type="text" placeholder="${t('请输入','Enter')}" maxlength="4" autocomplete="off">
            </div>
            <img class="uci" id="uprpp-capimg" src="" alt="Captcha" title="${t('点击刷新','Refresh')}">
          </div>
          <button class="ubtn" id="uprpp-submit">${t('登 录','Sign In')}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="uprpp-forgot">${t('忘记密码？','Forgot password?')}</a>
          <a href="${isEn?'/login':'/loginEn'}">${isEn?'中文':'EN'}</a>
        </div>

        <div class="us" id="uprpp-dots">
          <span data-theme="default" title="简约白" style="background:#1E3A5F"></span>
          <span data-theme="dark" title="深邃暗" style="background:#93A8C7"></span>
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
    const origCapImg = document.querySelector('.form-signin img');
    if (capImg && origCapImg) {
      capImg.src = origCapImg.src;
      capImg.addEventListener('click', () => {
        const u = origCapImg.src.replace(/\?.*/, '') + '?' + Date.now();
        origCapImg.src = u; capImg.src = u;
      });
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
  // 初始化
  // ============================================================

  function init() {
    if (!document.body) { setTimeout(init, 10); return; }
    applyTheme(getCurrent());
    rebuild();
  }

  // 全局 API
  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  global.UPRPP = {
    version: '0.3.4',
    showLogo(show) {
      const el = document.querySelector('#uprpp-brand .ub-logo');
      if (el) el.classList.toggle('show', show);
    },
    theme: {
      apply: (n) => { applyTheme(n); },
      getCurrent,
      list: () => Object.entries(THEMES).map(([k, v]) => ({ name: k, displayName: v.name, current: k === getCurrent() })),
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
