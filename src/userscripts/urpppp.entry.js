import { createAssistConfig } from '../assist/config.js';
import {
  DEFAULT_COMMENTS,
  DEFAULT_OCR_EXAMPLE,
  EVALUATION_KEYS,
  EVALUATION_LIST_PATH,
  LOGIN_FAILURE_LIMIT,
  LOGIN_KEYS,
} from '../assist/constants.js';
import { getBase64FromImage, recognizeCaptcha as recognizeCaptchaWithRequest } from '../assist/ocr.js';
import { recognizeLocalCaptcha } from '../assist/ocr-local.js';
import { recognizeZhjwCaptcha } from '../assist/ocr-zhjw.js';
import { createAssistStorage } from '../assist/storage.js';
import {
  escapeAssistHtml as escapeHtml,
  escapeAttr,
  lettersForMulti,
  lettersForSingle,
  log,
  optionLetter,
  parsePerQuestionMap,
  pickRandom,
  randInt,
  setInputValue,
  setTextAreaValue,
  sleep,
} from '../assist/utils.js';
import { compareVersions as compareStandaloneVersions, parseUserscriptVersion as parseVersionFromSource } from '../core/version.js';
import { createLoginAssist } from '../assist/login.js';
import { createSessionAssist } from '../assist/session.js';
import { createEvaluationAssist } from '../assist/evaluation.js';
import { createUpdateAssist } from '../assist/update.js';
import { createAssistPanel } from '../assist/panel.js';
import loginGuardStyles from '../styles/assist-login-guard.css';
import assistStyles from '../styles/assist.css';

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

/**
 * 依赖：URP++ 主脚本（设置面板 DOM）。本文件不修改 urppp.user.js。
 *
 * 模块：
 * 1) 登录助手：OCR + 账密自动填充（src/assist/login.js）
 * 2) 评教助手：分数/单选/多选/主观题自动填；可选等待约100秒后自动保存（src/assist/evaluation.js）
 * 3) 全自动评教：列表页扫描未评估问卷，逐个进入填写并到时提交（src/assist/evaluation.js）
 */

(function () {
  'use strict';

  // 与脚本头 @version 保持同步
  const URPPPP_VERSION = '1.5.3';
  const URPPPP_RAW_URL = 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js';
  // 多源探测：GitHub（权威）优先，Gitee 次之（国内直连），jsDelivr 兑底
  const URPPPP_SOURCES = [
    'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/version.json',
    'https://gitee.com/chaolan2026/SCU-URP-plusplus/raw/main/version.json',
    'https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/version.json',
  ];
  const URPPPP_RAW_URLS = [
    URPPPP_RAW_URL,
    'https://gitee.com/chaolan2026/SCU-URP-plusplus/raw/main/urpppp.user.js',
    'https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/urpppp.user.js',
  ];

  // ===================== 公共工具与配置 =====================
  const LOGIN = LOGIN_KEYS;
  const EVAL = EVALUATION_KEYS;
  const storage = createAssistStorage(GM_getValue, GM_setValue);
  const { getBool, getNum, getStr, setVal, setJSON } = storage;
  const config = createAssistConfig(storage);
  const {
    beginLoginProcess,
    clearBatchState,
    clearLoginGuardAfterSuccess,
    resetAllLoginGuard,
    evalConf,
    getBatchState,
    getLoginGuardState,
    loginConf,
    markPendingAutoLogin,
    resetLoginGuardState,
    sessionConf,
    setBatchState,
  } = config;

  // ===================== 设置面板公共 UI 工具 =====================
  function settingsStyles() {
    if (document.getElementById('urpppp-assist-style')) return;
    const st = document.createElement('style');
    st.id = 'urpppp-assist-style';
    st.textContent = assistStyles;
    (document.head || document.documentElement).appendChild(st);
  }

  function setStatus(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'urpppp-status' + (type ? ' ' + type : '');
  }

  function syncToggle(btn, on, onText, offText) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? onText : offText;
    btn.classList.toggle('ac', !!on);
  }

  // ===================== 功能域装配 =====================
  const login = createLoginAssist({
    config: { loginConf, beginLoginProcess, markPendingAutoLogin, resetLoginGuardState, resetAllLoginGuard },
    storage: { getBool, setVal },
    deps: {
      constants: { LOGIN, LOGIN_FAILURE_LIMIT, DEFAULT_OCR_EXAMPLE },
      escapeAttr,
      getBase64FromImage,
      log,
      loginGuardStyles,
      recognizeCaptchaWithRequest,
      recognizeLocalCaptcha,
      recognizeZhjwCaptcha,
      setInputValue,
      setStatus,
      sleep,
      syncToggle,
    },
  });

  const evaluation = createEvaluationAssist({
    config: { evalConf, getBatchState, setBatchState, clearBatchState },
    storage: { getBool, setVal, setJSON },
    deps: {
      constants: { EVAL, EVALUATION_LIST_PATH, DEFAULT_COMMENTS },
      settingsStyles,
      setStatus,
      syncToggle,
      utils: {
        escapeHtml,
        escapeAttr,
        lettersForMulti,
        lettersForSingle,
        log,
        optionLetter,
        parsePerQuestionMap,
        pickRandom,
        randInt,
        setInputValue,
        setTextAreaValue,
        sleep,
      },
    },
  });

  const update = createUpdateAssist({
    deps: {
      URPPPP_VERSION,
      URPPPP_RAW_URL,
      URPPPP_SOURCES,
      URPPPP_RAW_URLS,
      compareStandaloneVersions,
      parseVersionFromSource,
    },
  });

  const session = createSessionAssist({
    config: { sessionConf },
    storage: { getBool, getNum, getStr, setVal },
    deps: { setStatus, syncToggle, escapeAttr, log },
  });

  const panel = createAssistPanel({
    login,
    evaluation,
    session,
    deps: {
      URPPPP_VERSION,
      settingsStyles,
    },
  });

  const { mainLogin, resumeAutoLogin } = login;
  const {
    ensureWaitTip,
    installSaveSuccessWatcher,
    isEvaluationPage,
    isEvaluationListPage,
    markEvalPageEnter,
    resumeFullAutoOnList,
    runEvaluationAssist,
    startFullAutoEvaluation,
    updateBatchHud,
  } = evaluation;
  const { injectSettingsPanel, watchSettingsPanel } = panel;
  const { registerAssistUpdateChecker } = update;
  const { install2faAutoSend, is2faDomain, startKeepAlive } = session;

  // 插件模式：被主插件「下载→注入」装载，或独立脚本与新版主插件共存时，
  // 走主插件统一入口（主插件渲染入口，辅助只提供子面板构建与打开行为），
  // 不再自行注入设置面板入口，避免两套入口并存。
  const isPluginMode = typeof window.__urpppPlugin === 'object' && !!window.__urpppPlugin;
  if (isPluginMode) {
    try {
      window.__urpppPlugin.register({
        id: 'assist',
        type: 'plugin',
        name: '辅助插件',
        description: '登录助手 / 评教 / 会话保持 / 2FA',
        author: 'Chao_Lan',
        repo: 'https://github.com/chaolan2019/SCU-URP-plusplus',
        version: URPPPP_VERSION,
        subpanels: {
          login: { label: '登录助手', open: () => panel.openSubPanel('login') },
          eval: { label: '评教助手', open: () => panel.openSubPanel('eval') },
          session: { label: '会话保持', open: () => panel.openSubPanel('session') },
        },
      });
    } catch (_) { /* ignore */ }
  }

  // ===================== 启动 =====================
  try {
    GM_registerMenuCommand('URP++辅助：打开设置说明', () => {
      alert('请启用 URP++ 主脚本，点击顶栏齿轮，在设置底部配置「登录助手」「评教助手」。');
    });
    GM_registerMenuCommand('URP++辅助：立即识别登录验证码', () => { resumeAutoLogin(); });
    GM_registerMenuCommand('URP++辅助：立即处理当前评教页', () => { runEvaluationAssist({ force: true, forceSave: true }); });
    GM_registerMenuCommand('URP++辅助：启动全自动评教', () => { startFullAutoEvaluation(); });
    GM_registerMenuCommand('URP++辅助：停止全自动评教', () => { clearBatchState(); updateBatchHud(); });
  } catch (_) { /* ignore */ }

  try {
    window.__urppppAssist = {
      version: URPPPP_VERSION,
      loginConf,
      loginGuardState: getLoginGuardState,
      resumeLoginAuto: resumeAutoLogin,
      evalConf,
      runLogin: mainLogin,
      runEval: runEvaluationAssist,
      startFullAuto: startFullAutoEvaluation,
      stopFullAuto: () => { clearBatchState(); updateBatchHud(); },
      injectSettings: injectSettingsPanel,
    };
  } catch (_) { /* ignore */ }

  // 主插件可能稍晚就绪：轮询注册；打开设置时再补一次
  (function waitRegisterUpdate() {
    let tries = 0;
    const tick = () => {
      if (registerAssistUpdateChecker()) return;
      tries += 1;
      if (tries < 80) setTimeout(tick, 250);
    };
    tick();
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#urppp-nav-settings') || t.closest('#uc-settings') || t.closest('.urppp-nav-settings')) {
        setTimeout(() => { try { registerAssistUpdateChecker(); } catch (_) { /* ignore */ } }, 30);
        setTimeout(() => { try { registerAssistUpdateChecker(); } catch (_) { /* ignore */ } }, 200);
      }
    }, true);
  })();

  // 插件模式下入口由主插件统一渲染，不再自行注入（避免两套入口并存）
  if (!isPluginMode) watchSettingsPanel();

  // 登录
  // 登录界面判定：URL 含 login/second（统—认证登录/2FA/教务登录）或存在密码登录表单
  // 注意：不要用 title 含“统一身份认证”判断——id.scu 登录成功后的页面标题也含它，会误判成登录页导致失败计数不清
  const hasZhjwLoginForm = !!(
    document.getElementById('input_username')
    && document.getElementById('input_password')
    && document.getElementById('input_checkcode')
  );
  const isLoginUi = hasZhjwLoginForm
    || /\/login|\/second|frontend\/login/i.test(location.href + location.pathname)
    || !!document.querySelector('input[type="password"]');
  if (isLoginUi) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mainLogin);
    else mainLogin();
  } else {
    // 非登录界面（含 id.scu 已登录端）→ 清除全部失败计数，避免误报“已达上限暂停”
    resetAllLoginGuard();
  }

  // 2FA 界面为 SPA 路由切换(#/login → #/second/auth，页面不重载)：
  // 在 id.scu 统一认证域常驻监听，切到 2FA 步时自动点「获取验证码」
  if (is2faDomain()) install2faAutoSend();

  // 会话保活：仅在教务系统页面启动（内部判定域名 + 开关）
  startKeepAlive();

  // 评教填写页：自动填 +（批量/开启时）到时保存
  if (isEvaluationPage()) {
    markEvalPageEnter();
    installSaveSuccessWatcher();
    const boot = () => {
      markEvalPageEnter();
      ensureWaitTip();
      updateBatchHud();
      const batch = getBatchState();
      // 批量中强制执行填+保存；否则按设置
      runEvaluationAssist({ force: !!batch.active, forceSave: !!batch.active });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 500));
    else setTimeout(boot, 500);
  }

  // 评教列表页：若全自动进行中，继续下一份
  if (isEvaluationListPage()) {
    const bootList = () => {
      updateBatchHud();
      resumeFullAutoOnList();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bootList, 600));
    else setTimeout(bootList, 600);
  }
})();
