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
  const URPPPP_VERSION = '1.3.3';
  const URPPPP_RAW_URL = 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js';

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
    evalConf,
    getBatchState,
    getLoginGuardState,
    loginConf,
    markPendingAutoLogin,
    resetLoginGuardState,
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
    config: { loginConf, beginLoginProcess, markPendingAutoLogin, resetLoginGuardState },
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
      compareStandaloneVersions,
      parseVersionFromSource,
    },
  });

  const panel = createAssistPanel({
    login,
    evaluation,
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

  watchSettingsPanel();

  // 登录
  const hasZhjwLoginForm = !!(
    document.getElementById('input_username')
    && document.getElementById('input_password')
    && document.getElementById('input_checkcode')
  );
  const maybeLogin =
    hasZhjwLoginForm ||
    /\/login/i.test(location.pathname || '') ||
    /login/i.test(location.href) ||
    /统一身份认证|frontend\/login/i.test(document.title + location.href);
  if (maybeLogin) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mainLogin);
    else mainLogin();
  } else {
    clearLoginGuardAfterSuccess();
  }

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
