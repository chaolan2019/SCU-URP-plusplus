// ==UserScript==
// @name         SCU URP++教务系统辅助插件
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.3.3
// @description  URP++ 扩展：登录验证码识别 + 评教自动填写/到时自动保存 + 列表页全自动评教。设置挂到 URP++ 设置面板。
// @author       Chao_Lan,Hanako
// @license      GPL-3.0-only
// @icon         https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/docs/icon.png
// @updateURL    https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js
// @downloadURL  https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js
// @match        http://zhjw.scu.edu.cn/*
// @match        http://202.115.47.141/*
// @match        https://*.scu.edu.cn/*
// @match        https://*.webvpn.scu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      *
// @run-at       document-idle
// ==/UserScript==

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/assist/constants.js
  var ASSIST_NAMESPACE = "urpppp_assist_v1";
  var LOGIN_KEYS = {
    enabled: `${ASSIST_NAMESPACE}_login_enabled`,
    autoSubmit: `${ASSIST_NAMESPACE}_login_auto_submit`,
    ocrUrl: `${ASSIST_NAMESPACE}_login_ocr_url`,
    zhjwUser: `${ASSIST_NAMESPACE}_login_zhjw_user`,
    zhjwPass: `${ASSIST_NAMESPACE}_login_zhjw_pass`,
    casUser: `${ASSIST_NAMESPACE}_login_cas_user`,
    casPass: `${ASSIST_NAMESPACE}_login_cas_pass`,
    passwordStorage: `${ASSIST_NAMESPACE}_login_password_storage`,
    shareCred: `${ASSIST_NAMESPACE}_login_share_cred`,
    submitDelay: `${ASSIST_NAMESPACE}_login_submit_delay`,
    guardState: `${ASSIST_NAMESPACE}_login_guard_state`
  };
  var EVALUATION_KEYS = {
    enabled: `${ASSIST_NAMESPACE}_eval_enabled`,
    waitSec: `${ASSIST_NAMESPACE}_eval_wait_sec`,
    scoreMin: `${ASSIST_NAMESPACE}_eval_score_min`,
    scoreMax: `${ASSIST_NAMESPACE}_eval_score_max`,
    singleLetters: `${ASSIST_NAMESPACE}_eval_single_letters`,
    singlePerQ: `${ASSIST_NAMESPACE}_eval_single_per_q`,
    multiLetters: `${ASSIST_NAMESPACE}_eval_multi_letters`,
    multiPerQ: `${ASSIST_NAMESPACE}_eval_multi_per_q`,
    multiAvoidNone: `${ASSIST_NAMESPACE}_eval_multi_avoid_none`,
    commentTemplates: `${ASSIST_NAMESPACE}_eval_comment_templates`,
    autoFill: `${ASSIST_NAMESPACE}_eval_auto_fill`,
    autoSave: `${ASSIST_NAMESPACE}_eval_auto_save`,
    saveDelay: `${ASSIST_NAMESPACE}_eval_save_delay`,
    batchActive: `${ASSIST_NAMESPACE}_eval_batch_active`,
    batchQueue: `${ASSIST_NAMESPACE}_eval_batch_queue`,
    batchIndex: `${ASSIST_NAMESPACE}_eval_batch_index`,
    batchGapSec: `${ASSIST_NAMESPACE}_eval_batch_gap_sec`
  };
  var LOGIN_FAILURE_LIMIT = 4;
  var LOGIN_PENDING_TTL = 10 * 60 * 1e3;
  var DEFAULT_OCR_EXAMPLE = "https://ocr.yanjiangrd.site/api/ocr";
  var EVALUATION_LIST_PATH = "/student/teachingEvaluation/newEvaluation/index";
  var DEFAULT_COMMENTS = [
    "老师授课认真负责，讲解清晰，收获很大。",
    "课堂氛围好，内容充实，希望继续保持。",
    "课程安排合理，老师答疑及时，总体满意。"
  ].join("\n");

  // src/assist/config.js
  function createAssistConfig(storage, now = () => Date.now()) {
    const { getBool, getStr, getNum, getJSON, setVal, setJSON } = storage;
    function loginConf() {
      const storedZhjwPass = getStr(LOGIN_KEYS.zhjwPass, "");
      const storedCasPass = getStr(LOGIN_KEYS.casPass, "");
      const savedMode = getStr(LOGIN_KEYS.passwordStorage, "");
      const passwordStorage = savedMode === "persistent" || !savedMode && (storedZhjwPass || storedCasPass) ? "persistent" : "none";
      return {
        enabled: getBool(LOGIN_KEYS.enabled, true),
        autoSubmit: getBool(LOGIN_KEYS.autoSubmit, true),
        ocrUrl: getStr(LOGIN_KEYS.ocrUrl, ""),
        zhjwUser: getStr(LOGIN_KEYS.zhjwUser, ""),
        zhjwPass: passwordStorage === "persistent" ? storedZhjwPass : "",
        casUser: getStr(LOGIN_KEYS.casUser, ""),
        casPass: passwordStorage === "persistent" ? storedCasPass : "",
        passwordStorage,
        shareCred: getBool(LOGIN_KEYS.shareCred, true),
        submitDelay: Math.max(0, getNum(LOGIN_KEYS.submitDelay, 300))
      };
    }
    __name(loginConf, "loginConf");
    function emptyLoginGuardState(identity) {
      return {
        identity: String(identity || ""),
        failures: 0,
        paused: false,
        pending: null,
        updatedAt: now()
      };
    }
    __name(emptyLoginGuardState, "emptyLoginGuardState");
    function getLoginGuardState() {
      const raw = getJSON(LOGIN_KEYS.guardState, {}) || {};
      const failures = Math.max(0, Math.min(LOGIN_FAILURE_LIMIT, Number(raw.failures) || 0));
      const pending = raw.pending && typeof raw.pending === "object" ? {
        kind: String(raw.pending.kind || ""),
        identity: String(raw.pending.identity || ""),
        createdAt: Number(raw.pending.createdAt) || 0
      } : null;
      return {
        identity: String(raw.identity || ""),
        failures,
        paused: failures >= LOGIN_FAILURE_LIMIT || !!raw.paused,
        pending,
        updatedAt: Number(raw.updatedAt) || 0
      };
    }
    __name(getLoginGuardState, "getLoginGuardState");
    function saveLoginGuardState(state) {
      const next = Object.assign(emptyLoginGuardState(""), state || {}, { updatedAt: now() });
      setJSON(LOGIN_KEYS.guardState, next);
      return next;
    }
    __name(saveLoginGuardState, "saveLoginGuardState");
    function resetLoginGuardState(identity) {
      return saveLoginGuardState(emptyLoginGuardState(identity));
    }
    __name(resetLoginGuardState, "resetLoginGuardState");
    function loginIdentity(_kind, username) {
      return String(username || "").trim();
    }
    __name(loginIdentity, "loginIdentity");
    function ensureLoginGuardIdentity(kind, username) {
      const identity = loginIdentity(kind, username);
      const state = getLoginGuardState();
      if (state.identity && state.identity !== identity) return resetLoginGuardState(identity);
      if (!state.identity) return saveLoginGuardState(Object.assign(state, { identity }));
      return state;
    }
    __name(ensureLoginGuardIdentity, "ensureLoginGuardIdentity");
    function beginLoginProcess(kind, username) {
      const identity = loginIdentity(kind, username);
      const state = getLoginGuardState();
      const pending = state.pending;
      const fresh = pending && pending.createdAt > 0 && now() - pending.createdAt <= LOGIN_PENDING_TTL;
      const continuesPreviousAttempt = fresh && pending.identity === identity;
      if (!continuesPreviousAttempt) return resetLoginGuardState(identity);
      state.identity = identity;
      state.pending = null;
      state.failures = Math.min(LOGIN_FAILURE_LIMIT, state.failures + 1);
      state.paused = state.failures >= LOGIN_FAILURE_LIMIT;
      return saveLoginGuardState(state);
    }
    __name(beginLoginProcess, "beginLoginProcess");
    function markPendingAutoLogin(kind, username) {
      const state = ensureLoginGuardIdentity(kind, username);
      state.pending = {
        kind: String(kind || ""),
        identity: state.identity,
        createdAt: now()
      };
      return saveLoginGuardState(state);
    }
    __name(markPendingAutoLogin, "markPendingAutoLogin");
    function clearLoginGuardAfterSuccess() {
      const state = getLoginGuardState();
      if (state.failures || state.paused || state.pending) resetLoginGuardState("");
    }
    __name(clearLoginGuardAfterSuccess, "clearLoginGuardAfterSuccess");
    function evalConf() {
      return {
        enabled: getBool(EVALUATION_KEYS.enabled, true),
        waitSec: Math.max(0, getNum(EVALUATION_KEYS.waitSec, 100)),
        scoreMin: Math.max(1, Math.min(100, getNum(EVALUATION_KEYS.scoreMin, 92))),
        scoreMax: Math.max(1, Math.min(100, getNum(EVALUATION_KEYS.scoreMax, 98))),
        singleLetters: getStr(EVALUATION_KEYS.singleLetters, "A") || "A",
        singlePerQ: getJSON(EVALUATION_KEYS.singlePerQ, {}) || {},
        multiLetters: getStr(EVALUATION_KEYS.multiLetters, "A,B,C") || "A,B,C",
        multiPerQ: getJSON(EVALUATION_KEYS.multiPerQ, {}) || {},
        multiAvoidNone: getBool(EVALUATION_KEYS.multiAvoidNone, true),
        commentTemplates: getStr(EVALUATION_KEYS.commentTemplates, DEFAULT_COMMENTS),
        autoFill: getBool(EVALUATION_KEYS.autoFill, true),
        autoSave: getBool(EVALUATION_KEYS.autoSave, false),
        saveDelay: Math.max(0, getNum(EVALUATION_KEYS.saveDelay, 500)),
        batchGapSec: Math.max(0, getNum(EVALUATION_KEYS.batchGapSec, 2))
      };
    }
    __name(evalConf, "evalConf");
    function getBatchState() {
      return {
        active: getBool(EVALUATION_KEYS.batchActive, false),
        queue: getJSON(EVALUATION_KEYS.batchQueue, []) || [],
        index: Math.max(0, getNum(EVALUATION_KEYS.batchIndex, 0))
      };
    }
    __name(getBatchState, "getBatchState");
    function setBatchState(partial) {
      const current = getBatchState();
      const next = Object.assign({}, current, partial || {});
      setVal(EVALUATION_KEYS.batchActive, !!next.active);
      setJSON(EVALUATION_KEYS.batchQueue, Array.isArray(next.queue) ? next.queue : []);
      setVal(EVALUATION_KEYS.batchIndex, String(Math.max(0, Number(next.index) || 0)));
      return next;
    }
    __name(setBatchState, "setBatchState");
    function clearBatchState() {
      setBatchState({ active: false, queue: [], index: 0 });
    }
    __name(clearBatchState, "clearBatchState");
    return {
      loginConf,
      emptyLoginGuardState,
      getLoginGuardState,
      saveLoginGuardState,
      resetLoginGuardState,
      ensureLoginGuardIdentity,
      beginLoginProcess,
      markPendingAutoLogin,
      clearLoginGuardAfterSuccess,
      evalConf,
      getBatchState,
      setBatchState,
      clearBatchState
    };
  }
  __name(createAssistConfig, "createAssistConfig");

  // src/assist/ocr.js
  function getBase64FromImage(image) {
    if (!image) throw new Error("验证码图片不存在");
    if (image.src && image.src.startsWith("data:image")) return image.src.split(",")[1];
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width || 120;
    canvas.height = image.naturalHeight || image.height || 40;
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png").split(",")[1];
  }
  __name(getBase64FromImage, "getBase64FromImage");
  function parseOcrResponse(responseText) {
    let result;
    try {
      result = JSON.parse(responseText || "{}");
    } catch (_) {
      throw new Error("OCR 响应解析失败");
    }
    const code = String(result.code || result.data || result.text || result.result || "").trim();
    if (!code) throw new Error(result.message || result.msg || "OCR 识别失败");
    if (!/^[A-Za-z0-9]{4,8}$/.test(code)) throw new Error("OCR 返回的验证码格式无效");
    return code;
  }
  __name(parseOcrResponse, "parseOcrResponse");
  function recognizeCaptcha(base64, ocrUrl, request) {
    return new Promise((resolve, reject) => {
      const url = String(ocrUrl || "").trim();
      if (!url) {
        reject(new Error("未配置 OCR 服务地址"));
        return;
      }
      if (typeof request !== "function") {
        reject(new Error("不支持 GM_xmlhttpRequest"));
        return;
      }
      request({
        method: "POST",
        url,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ image: base64 }),
        timeout: 15e3,
        onload(response) {
          try {
            resolve(parseOcrResponse(response.responseText));
          } catch (error) {
            reject(error);
          }
        },
        onerror() {
          reject(new Error("OCR 服务请求失败"));
        },
        ontimeout() {
          reject(new Error("OCR 服务超时"));
        }
      });
    });
  }
  __name(recognizeCaptcha, "recognizeCaptcha");

  // src/assist/ocr-local.js
  var LOCAL_OCR_MODEL = { "chars": [{ "c": "2", "n": 20, "templates": [[0, 255, 255, 255, 255, 13, 255, 255, 255, 255, 255, 255, 0, 13, 26, 13, 13, 255, 13, 0, 13, 13, 0, 255, 13, 38, 13, 255, 255, 0, 0, 0, 255, 0, 0, 13, 0, 255, 255, 13, 13, 13, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "3", "n": 24, "templates": [[0, 255, 255, 255, 255, 11, 255, 255, 255, 255, 255, 255, 21, 11, 0, 21, 0, 255, 21, 21, 11, 11, 255, 255, 21, 255, 255, 255, 255, 255, 0, 11, 21, 11, 21, 255, 11, 21, 11, 21, 0, 255, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "4", "n": 29, "templates": [[26, 0, 9, 9, 255, 9, 26, 44, 9, 255, 255, 18, 0, 26, 255, 255, 255, 9, 0, 0, 255, 18, 255, 9, 9, 255, 18, 26, 255, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 26, 26, 18, 18, 255, 26, 88]] }, { "c": "5", "n": 30, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 9, 9, 34, 26, 255, 255, 0, 9, 9, 17, 255, 255, 255, 255, 255, 255, 43, 9, 17, 0, 17, 255, 9, 34, 17, 9, 0, 255, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "6", "n": 21, "templates": [[12, 24, 255, 255, 255, 36, 12, 0, 255, 255, 255, 255, 12, 255, 36, 12, 0, 0, 255, 255, 12, 49, 0, 12, 255, 255, 255, 255, 255, 255, 255, 255, 12, 0, 12, 255, 255, 255, 24, 0, 24, 255, 0, 255, 255, 255, 255, 255, 88]] }, { "c": "7", "n": 18, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 14, 0, 14, 0, 255, 0, 0, 0, 14, 255, 255, 14, 0, 0, 255, 14, 14, 0, 14, 14, 0, 0, 0, 14, 0, 255, 0, 0, 0, 28, 255, 255, 0, 0, 0, 78]] }, { "c": "8", "n": 23, "templates": [[11, 11, 255, 255, 255, 0, 11, 255, 255, 255, 255, 255, 22, 255, 22, 11, 255, 255, 11, 255, 255, 11, 255, 0, 11, 0, 255, 255, 255, 11, 255, 255, 22, 22, 11, 255, 255, 255, 22, 22, 0, 255, 22, 255, 255, 255, 255, 255, 88]] }, { "c": "9", "n": 33, "templates": [[15, 15, 255, 255, 0, 0, 8, 255, 255, 255, 255, 255, 255, 255, 15, 15, 0, 255, 255, 255, 23, 23, 23, 255, 15, 255, 255, 255, 255, 255, 8, 15, 31, 31, 23, 255, 8, 8, 31, 0, 255, 255, 0, 255, 255, 255, 255, 0, 88]] }, { "c": "a", "n": 26, "templates": [[20, 10, 0, 255, 0, 20, 39, 20, 39, 255, 20, 10, 49, 20, 255, 39, 255, 39, 20, 39, 255, 10, 255, 49, 20, 20, 255, 0, 255, 0, 10, 255, 255, 255, 255, 255, 10, 255, 255, 255, 255, 255, 255, 255, 29, 20, 0, 255, 108]] }, { "c": "b", "n": 22, "templates": [[255, 255, 255, 255, 255, 23, 255, 255, 255, 255, 255, 255, 255, 255, 0, 23, 255, 255, 255, 255, 12, 255, 255, 0, 255, 255, 255, 255, 255, 12, 255, 255, 23, 35, 12, 255, 255, 255, 23, 23, 23, 255, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "c", "n": 21, "templates": [[36, 12, 255, 255, 255, 255, 24, 24, 255, 255, 255, 255, 255, 255, 12, 24, 0, 0, 255, 255, 0, 12, 24, 0, 255, 255, 0, 0, 0, 12, 255, 255, 0, 0, 0, 0, 255, 255, 0, 0, 0, 0, 12, 12, 255, 255, 255, 255, 88]] }, { "c": "d", "n": 22, "templates": [[255, 255, 255, 255, 255, 0, 255, 255, 255, 255, 255, 23, 255, 255, 23, 23, 23, 255, 255, 255, 35, 12, 23, 255, 255, 255, 12, 23, 23, 255, 255, 255, 23, 35, 23, 255, 255, 255, 0, 12, 23, 255, 255, 255, 255, 255, 255, 0, 98]] }, { "c": "e", "n": 37, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 14, 14, 0, 255, 255, 7, 21, 21, 21, 255, 255, 255, 255, 255, 255, 255, 255, 21, 7, 7, 14, 255, 255, 21, 7, 14, 14, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "f", "n": 31, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 16, 16, 16, 0, 255, 255, 25, 8, 33, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 8, 25, 8, 255, 255, 0, 8, 8, 16, 255, 255, 8, 8, 16, 8, 69]] }, { "c": "g", "n": 27, "templates": [[0, 19, 255, 255, 255, 255, 19, 0, 255, 255, 255, 255, 9, 255, 0, 28, 28, 19, 255, 255, 38, 0, 9, 19, 255, 255, 19, 9, 9, 28, 255, 255, 0, 9, 19, 255, 255, 255, 9, 0, 0, 255, 19, 19, 255, 255, 255, 255, 98]] }, { "c": "h", "n": 28, "templates": [[255, 255, 0, 9, 9, 255, 255, 255, 9, 0, 18, 255, 255, 255, 9, 0, 9, 255, 255, 255, 0, 9, 18, 255, 255, 255, 255, 255, 255, 255, 255, 255, 9, 18, 27, 255, 255, 255, 0, 9, 18, 255, 255, 255, 9, 9, 0, 255, 98]] }, { "c": "j", "n": 28, "templates": [[9, 0, 0, 0, 255, 255, 18, 0, 0, 9, 255, 255, 9, 0, 0, 0, 255, 255, 9, 0, 0, 0, 255, 255, 0, 0, 9, 0, 255, 255, 0, 0, 0, 0, 255, 255, 18, 9, 0, 0, 255, 255, 255, 255, 255, 255, 255, 0, 48]] }, { "c": "k", "n": 16, "templates": [[255, 255, 16, 16, 0, 255, 255, 255, 0, 16, 255, 0, 255, 255, 16, 255, 0, 0, 255, 255, 0, 255, 16, 16, 255, 255, 255, 16, 0, 0, 255, 255, 0, 255, 16, 0, 255, 255, 0, 255, 255, 0, 255, 255, 16, 16, 16, 255, 98]] }, { "c": "l", "n": 28, "templates": [[255, 255, 9, 18, 0, 0, 255, 255, 9, 0, 18, 18, 255, 255, 0, 9, 0, 9, 255, 255, 18, 0, 18, 0, 255, 255, 9, 9, 18, 18, 255, 255, 0, 9, 0, 18, 255, 255, 0, 18, 0, 9, 255, 255, 255, 255, 255, 255, 78]] }, { "c": "m", "n": 21, "templates": [[255, 255, 0, 12, 12, 255, 255, 255, 0, 12, 24, 255, 255, 255, 0, 12, 24, 255, 255, 12, 255, 12, 255, 0, 255, 12, 255, 0, 255, 12, 255, 12, 255, 12, 255, 0, 255, 12, 255, 24, 255, 0, 255, 12, 24, 255, 36, 36, 128]] }, { "c": "n", "n": 32, "templates": [[255, 255, 0, 0, 0, 255, 255, 255, 8, 8, 0, 255, 255, 255, 255, 24, 0, 255, 255, 255, 255, 0, 24, 255, 255, 255, 16, 255, 0, 255, 255, 255, 16, 255, 255, 255, 255, 255, 8, 0, 255, 255, 255, 255, 16, 8, 8, 255, 98]] }, { "c": "p", "n": 27, "templates": [[255, 255, 255, 255, 255, 9, 255, 255, 255, 255, 255, 255, 255, 255, 19, 9, 28, 255, 255, 255, 28, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 28, 19, 28, 9, 255, 255, 19, 19, 28, 19, 255, 255, 28, 9, 28, 19, 78]] }, { "c": "q", "n": 24, "templates": [[0, 0, 255, 255, 11, 0, 0, 255, 21, 0, 255, 11, 255, 11, 0, 0, 11, 255, 255, 11, 0, 11, 0, 255, 255, 11, 0, 0, 21, 255, 11, 255, 11, 0, 255, 21, 11, 11, 255, 255, 21, 0, 21, 0, 11, 11, 244, 255, 95]] }, { "c": "r", "n": 20, "templates": [[255, 255, 255, 255, 0, 0, 255, 255, 255, 255, 255, 0, 255, 255, 13, 0, 255, 13, 255, 255, 38, 0, 255, 13, 255, 255, 255, 255, 255, 0, 255, 255, 0, 255, 0, 0, 255, 255, 13, 255, 255, 0, 255, 255, 13, 13, 13, 255, 98]] }, { "c": "s", "n": 24, "templates": [[0, 255, 255, 255, 255, 11, 255, 255, 255, 255, 255, 255, 255, 255, 0, 11, 11, 11, 255, 255, 0, 11, 0, 11, 11, 0, 255, 255, 255, 255, 21, 21, 11, 0, 21, 255, 0, 21, 21, 11, 11, 255, 255, 255, 255, 255, 255, 255, 69]] }, { "c": "t", "n": 23, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 11, 0, 0, 255, 0, 22, 22, 11, 11, 255, 0, 22, 11, 0, 0, 255, 11, 11, 55, 11, 0, 255, 0, 11, 22, 11, 0, 255, 0, 33, 11, 0, 11, 255, 0, 0, 98]] }, { "c": "u", "n": 18, "templates": [[255, 255, 14, 14, 28, 255, 255, 255, 0, 28, 14, 255, 255, 255, 14, 0, 28, 255, 255, 255, 28, 28, 14, 255, 255, 255, 0, 14, 14, 255, 255, 255, 28, 43, 14, 255, 255, 255, 28, 14, 43, 255, 14, 255, 255, 255, 255, 255, 88]] }, { "c": "v", "n": 24, "templates": [[255, 255, 11, 21, 21, 255, 32, 255, 11, 0, 21, 255, 11, 255, 21, 11, 11, 255, 21, 21, 255, 32, 255, 11, 11, 32, 255, 21, 255, 11, 0, 32, 255, 43, 255, 0, 21, 0, 255, 53, 255, 0, 32, 0, 11, 255, 11, 21, 117]] }, { "c": "w", "n": 26, "templates": [[255, 20, 10, 255, 10, 10, 255, 10, 0, 255, 29, 10, 29, 255, 0, 0, 10, 235, 20, 255, 235, 29, 39, 235, 10, 255, 235, 10, 29, 255, 39, 255, 235, 10, 29, 255, 0, 255, 245, 10, 20, 255, 20, 49, 255, 10, 255, 39, 146]] }, { "c": "x", "n": 25, "templates": [[255, 255, 20, 31, 0, 255, 20, 255, 10, 10, 41, 255, 31, 0, 255, 10, 255, 31, 31, 0, 255, 255, 255, 20, 20, 10, 0, 255, 0, 0, 10, 0, 255, 255, 255, 20, 41, 0, 255, 0, 255, 10, 31, 255, 10, 10, 10, 255, 98]] }, { "c": "y", "n": 24, "templates": [[255, 255, 0, 0, 0, 255, 11, 255, 21, 0, 0, 255, 21, 11, 255, 0, 255, 11, 0, 11, 255, 11, 255, 11, 0, 0, 11, 255, 11, 21, 0, 0, 0, 255, 0, 11, 11, 11, 11, 255, 11, 11, 0, 11, 11, 255, 11, 21, 106]] }, { "c": "z", "n": 28, "templates": [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 18, 9, 27, 246, 255, 9, 9, 18, 255, 255, 18, 0, 9, 0, 255, 9, 0, 0, 18, 246, 36, 18, 36, 9, 246, 255, 9, 46, 18, 246, 255, 255, 255, 246, 246, 78]] }], "k": 1, "ar_weight": 25, "max_aspect_ratio": 2 };
  var CHAR_H = 8;
  var CHAR_W = 6;
  var FEAT_DIM = CHAR_H * CHAR_W;
  var FEAT_DIM_WITH_AR = FEAT_DIM + 1;
  var AR_WEIGHT = LOCAL_OCR_MODEL.ar_weight || 25;
  var MAX_ASPECT_RATIO = LOCAL_OCR_MODEL.max_aspect_ratio || 2;
  var QUANT_STEP = 8;
  var WHITE_THRESHOLD = 250;
  var SAT_MIN = 10;
  function loadRgb(image) {
    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 26;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 80, 26);
    ctx.drawImage(image, 0, 0, 80, 26);
    return ctx.getImageData(0, 0, 80, 26).data;
  }
  __name(loadRgb, "loadRgb");
  function segmentByColor(rgba) {
    const w = 80;
    const h = 26;
    const len = w * h;
    const pixels = [];
    for (let i = 0; i < len; i++) {
      const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
      if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (sat < SAT_MIN) continue;
      pixels.push({ r, g, b, idx: i });
    }
    if (pixels.length < 20) return [];
    const quant = /* @__PURE__ */ new Map();
    for (const px of pixels) {
      const key = `${Math.floor(px.r / QUANT_STEP) * QUANT_STEP},${Math.floor(px.g / QUANT_STEP) * QUANT_STEP},${Math.floor(px.b / QUANT_STEP) * QUANT_STEP}`;
      const e = quant.get(key) || { r: 0, g: 0, b: 0, n: 0 };
      e.r += px.r;
      e.g += px.g;
      e.b += px.b;
      e.n++;
      quant.set(key, e);
    }
    const centers = [...quant.values()].sort((a, b) => b.n - a.n).slice(0, 4).map((e) => ({ r: Math.round(e.r / e.n), g: Math.round(e.g / e.n), b: Math.round(e.b / e.n) }));
    const labels = new Int32Array(len).fill(-1);
    for (const px of pixels) {
      let bi = 0, bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = (px.r - centers[c].r) ** 2 + (px.g - centers[c].g) ** 2 + (px.b - centers[c].b) ** 2;
        if (d < bd) {
          bd = d;
          bi = c;
        }
      }
      labels[px.idx] = bi;
    }
    const chars = [];
    for (let c = 0; c < centers.length; c++) {
      let x1 = w, y1 = h, x2 = 0, y2 = 0, n = 0;
      for (let i = 0; i < len; i++) {
        if (labels[i] !== c) continue;
        const x = i % w, y = i / w | 0;
        if (x < x1) x1 = x;
        if (x > x2) x2 = x;
        if (y < y1) y1 = y;
        if (y > y2) y2 = y;
        n++;
      }
      if (n < 5) continue;
      chars.push({ x1, y1, x2, y2 });
    }
    chars.sort((a, b) => (a.x1 + a.x2) / 2 - (b.x1 + b.x2) / 2);
    return chars;
  }
  __name(segmentByColor, "segmentByColor");
  function extractFeature(rgba, box) {
    const w = 80;
    const cw = box.x2 - box.x1 + 1;
    const ch = box.y2 - box.y1 + 1;
    const feat = new Float64Array(FEAT_DIM_WITH_AR);
    for (let ty = 0; ty < CHAR_H; ty++) {
      const sy = box.y1 + Math.min(ch - 1, Math.floor(ty / CHAR_H * ch));
      for (let tx = 0; tx < CHAR_W; tx++) {
        const sx = box.x1 + Math.min(cw - 1, Math.floor(tx / CHAR_W * cw));
        const i = (sy * w + sx) * 4;
        feat[ty * CHAR_W + tx] = rgba[i] > WHITE_THRESHOLD && rgba[i + 1] > WHITE_THRESHOLD && rgba[i + 2] > WHITE_THRESHOLD ? 0 : 1;
      }
    }
    feat[FEAT_DIM] = Math.max(0, Math.min(1, cw / Math.max(ch, 1) / MAX_ASPECT_RATIO));
    return feat;
  }
  __name(extractFeature, "extractFeature");
  function classify(feat) {
    let best = null;
    let bestD = Infinity;
    for (const m of LOCAL_OCR_MODEL.chars) {
      for (const t of m.templates) {
        let pixelDist = 0;
        for (let i = 0; i < FEAT_DIM; i++) {
          const d2 = feat[i] - t[i] / 255;
          pixelDist += d2 * d2;
        }
        const arDiff = feat[FEAT_DIM] - t[FEAT_DIM] / 255;
        const d = pixelDist + AR_WEIGHT * arDiff * arDiff;
        if (d < bestD) {
          bestD = d;
          best = m.c;
        }
      }
    }
    return best;
  }
  __name(classify, "classify");
  function recognizeLocalCaptcha(image) {
    try {
      const rgba = loadRgb(image);
      const chars = segmentByColor(rgba);
      if (chars.length !== 4) return null;
      let text = "";
      for (const box of chars) {
        const c = classify(extractFeature(rgba, box));
        if (!c) return null;
        text += c;
      }
      return text;
    } catch (_) {
      return null;
    }
  }
  __name(recognizeLocalCaptcha, "recognizeLocalCaptcha");

  // src/assist/storage.js
  function createAssistStorage(getValue, setValue) {
    function getBool(key, fallback) {
      try {
        return !!getValue(key, fallback);
      } catch (_) {
        return !!fallback;
      }
    }
    __name(getBool, "getBool");
    function getStr(key, fallback) {
      const defaultValue = fallback == null ? "" : fallback;
      try {
        const value = getValue(key, defaultValue);
        return value == null ? "" : String(value);
      } catch (_) {
        return String(defaultValue);
      }
    }
    __name(getStr, "getStr");
    function getNum(key, fallback) {
      const value = Number(getStr(key, String(fallback)));
      return Number.isFinite(value) ? value : fallback;
    }
    __name(getNum, "getNum");
    function getJSON(key, fallback) {
      try {
        const raw = getValue(key, "");
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (_) {
        return fallback;
      }
    }
    __name(getJSON, "getJSON");
    function setVal(key, value) {
      try {
        setValue(key, value);
      } catch (_) {
      }
    }
    __name(setVal, "setVal");
    function setJSON(key, value) {
      setVal(key, JSON.stringify(value == null ? {} : value));
    }
    __name(setJSON, "setJSON");
    return { getBool, getStr, getNum, getJSON, setVal, setJSON };
  }
  __name(createAssistStorage, "createAssistStorage");

  // src/assist/utils.js
  function log(...args) {
    console.log("[URP++ 辅助]", ...args);
  }
  __name(log, "log");
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  __name(sleep, "sleep");
  function escapeAttr(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  __name(escapeAttr, "escapeAttr");
  function escapeAssistHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  __name(escapeAssistHtml, "escapeAssistHtml");
  function setInputValue(input, value) {
    if (!input) return;
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    if (descriptor && descriptor.set) descriptor.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  __name(setInputValue, "setInputValue");
  function setTextAreaValue(element, value) {
    if (!element) return;
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
    if (descriptor && descriptor.set) descriptor.set.call(element, value);
    else element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
  __name(setTextAreaValue, "setTextAreaValue");
  function randInt(min, max) {
    const lower = Math.ceil(Number(min));
    const upper = Math.floor(Number(max));
    if (!Number.isFinite(lower) || !Number.isFinite(upper)) return 0;
    if (upper <= lower) return lower;
    return lower + Math.floor(Math.random() * (upper - lower + 1));
  }
  __name(randInt, "randInt");
  function pickRandom(values) {
    if (!values || !values.length) return null;
    return values[Math.floor(Math.random() * values.length)];
  }
  __name(pickRandom, "pickRandom");
  function parseLetters(value) {
    const text = String(value || "").toUpperCase();
    const letters = /* @__PURE__ */ new Set();
    (text.match(/[A-K]/g) || []).forEach((letter) => letters.add(letter));
    return Array.from(letters);
  }
  __name(parseLetters, "parseLetters");
  function parsePerQuestionMap(value) {
    const map = {};
    String(value || "").split(/\r?\n/).forEach((line) => {
      const text = line.trim();
      if (!text || text.startsWith("#")) return;
      const match = text.match(/^(\d+)\s*[:：=]\s*(.+)$/);
      if (match) map[match[1]] = match[2].trim();
    });
    return map;
  }
  __name(parsePerQuestionMap, "parsePerQuestionMap");
  function optionLetter(valueOrLabel) {
    const text = String(valueOrLabel || "");
    const match = text.match(/^\s*([A-K])\s*[_\.、:：\-\s]/i) || text.match(/^\s*([A-K])\s*$/i);
    return match ? match[1].toUpperCase() : "";
  }
  __name(optionLetter, "optionLetter");
  function lettersForSingle(questionNumber, config) {
    const perQuestion = config.singlePerQ && (config.singlePerQ[questionNumber] || config.singlePerQ[String(questionNumber)]) || "";
    const pool = parseLetters(perQuestion || config.singleLetters || "A");
    return pool.length ? pool : ["A"];
  }
  __name(lettersForSingle, "lettersForSingle");
  function lettersForMulti(questionNumber, config) {
    const perQuestion = config.multiPerQ && (config.multiPerQ[questionNumber] || config.multiPerQ[String(questionNumber)]) || "";
    const pool = parseLetters(perQuestion || config.multiLetters || "A,B,C");
    return pool.length ? pool : ["A"];
  }
  __name(lettersForMulti, "lettersForMulti");

  // src/core/version.js
  function parseUserscriptVersion(source) {
    const match = String(source || "").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);
    return match ? match[1] : "";
  }
  __name(parseUserscriptVersion, "parseUserscriptVersion");
  function normalizeVersionParts(version) {
    return String(version || "0").replace(/^v/i, "").split(/[.+\-]/).filter(Boolean).map((part) => /^\d+$/.test(part) ? parseInt(part, 10) : part);
  }
  __name(normalizeVersionParts, "normalizeVersionParts");
  function compareVersions(first, second) {
    const firstParts = normalizeVersionParts(first);
    const secondParts = normalizeVersionParts(second);
    const length = Math.max(firstParts.length, secondParts.length);
    for (let index = 0; index < length; index += 1) {
      const left = firstParts[index] == null ? 0 : firstParts[index];
      const right = secondParts[index] == null ? 0 : secondParts[index];
      const leftIsNumber = typeof left === "number";
      const rightIsNumber = typeof right === "number";
      if (leftIsNumber && rightIsNumber) {
        if (left > right) return 1;
        if (left < right) return -1;
        continue;
      }
      const leftText = String(left);
      const rightText = String(right);
      if (leftText > rightText) return 1;
      if (leftText < rightText) return -1;
    }
    return 0;
  }
  __name(compareVersions, "compareVersions");

  // src/assist/login.js
  function createLoginAssist({ config, storage, deps }) {
    const { getBool, setVal } = storage;
    const { LOGIN, LOGIN_FAILURE_LIMIT: LOGIN_FAILURE_LIMIT2, DEFAULT_OCR_EXAMPLE: DEFAULT_OCR_EXAMPLE2 } = deps.constants;
    function buildLoginSection() {
      const c = config.loginConf();
      const sec = document.createElement("section");
      sec.className = "urppp-set-sec urpppp-sec";
      sec.id = "urpppp-login-sec";
      sec.innerHTML = `
      <h3>登录助手</h3>
      <p class="urppp-set-tip">自动填写账号密码、OCR 识别验证码。同一次自动登录过程连续失败 ${LOGIN_FAILURE_LIMIT2} 次后暂停提交，由用户手动填写验证码并接管登录。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-login-enabled">功能：${c.enabled ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-auto">识别后自动登录：${c.autoSubmit ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-share">教务/统一认证共用账密：${c.shareCred ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-persist-password">持久保存密码：${c.passwordStorage === "persistent" ? "开" : "关"}</button>
      </div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>线上 OCR 服务（可选）</label><input type="url" id="urpppp-login-ocr" placeholder="https://..." value="${deps.escapeAttr(c.ocrUrl)}" spellcheck="false" /></div>
        <div class="urpppp-row"><label>提交延迟(ms)</label><input type="number" id="urpppp-login-delay" min="0" step="50" value="${deps.escapeAttr(String(c.submitDelay))}" /></div>
        <div class="urpppp-row"><label>教务学号</label><input type="text" id="urpppp-login-zhjw-user" value="${deps.escapeAttr(c.zhjwUser)}" autocomplete="username" /></div>
        <div class="urpppp-row"><label>教务密码</label><input type="password" id="urpppp-login-zhjw-pass" autocomplete="current-password" /></div>
        <div class="urpppp-row urpppp-cas-user"><label>统一认证账号</label><input type="text" id="urpppp-login-cas-user" value="${deps.escapeAttr(c.casUser)}" /></div>
        <div class="urpppp-row urpppp-cas-pass"><label>统一认证密码</label><input type="password" id="urpppp-login-cas-pass" /></div>
      </div>
      <p class="urpppp-tip">默认不保存密码；开关关闭时只保存学号，登录请使用浏览器密码管理器或手动输入。已有旧密码会兼容读取，关闭开关并保存后立即清除。</p>
      <p class="urpppp-tip">验证码默认本地识别；识别失败时若填写了线上 OCR 服务地址则自动改用线上。</p>
      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-login-save">保存登录设置</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-login-clear">清除账密</button>
      </div>
      <div class="urpppp-status" id="urpppp-login-status"></div>
    `;
      sec.querySelector("#urpppp-login-zhjw-pass").value = c.zhjwPass;
      sec.querySelector("#urpppp-login-cas-pass").value = c.casPass;
      return sec;
    }
    __name(buildLoginSection, "buildLoginSection");
    function bindLoginSection(sec) {
      let enabled = getBool(LOGIN.enabled, true);
      let autoSubmit = getBool(LOGIN.autoSubmit, true);
      let shareCred = getBool(LOGIN.shareCred, true);
      let persistPassword = config.loginConf().passwordStorage === "persistent";
      const enabledBtn = sec.querySelector("#urpppp-login-enabled");
      const autoBtn = sec.querySelector("#urpppp-login-auto");
      const shareBtn = sec.querySelector("#urpppp-login-share");
      const persistBtn = sec.querySelector("#urpppp-login-persist-password");
      const toggleCas = /* @__PURE__ */ __name(() => {
        sec.querySelectorAll(".urpppp-cas-user,.urpppp-cas-pass").forEach((r) => {
          r.style.display = shareCred ? "none" : "grid";
        });
      }, "toggleCas");
      deps.syncToggle(enabledBtn, enabled, "功能：开", "功能：关");
      deps.syncToggle(autoBtn, autoSubmit, "识别后自动登录：开", "识别后自动登录：关");
      deps.syncToggle(shareBtn, shareCred, "教务/统一认证共用账密：开", "教务/统一认证共用账密：关");
      deps.syncToggle(persistBtn, persistPassword, "持久保存密码：开", "持久保存密码：关");
      toggleCas();
      enabledBtn.onclick = () => {
        enabled = !enabled;
        setVal(LOGIN.enabled, enabled);
        if (enabled) config.resetLoginGuardState("");
        deps.syncToggle(enabledBtn, enabled, "功能：开", "功能：关");
      };
      autoBtn.onclick = () => {
        autoSubmit = !autoSubmit;
        setVal(LOGIN.autoSubmit, autoSubmit);
        deps.syncToggle(autoBtn, autoSubmit, "识别后自动登录：开", "识别后自动登录：关");
      };
      shareBtn.onclick = () => {
        shareCred = !shareCred;
        setVal(LOGIN.shareCred, shareCred);
        deps.syncToggle(shareBtn, shareCred, "教务/统一认证共用账密：开", "教务/统一认证共用账密：关");
        toggleCas();
      };
      persistBtn.onclick = () => {
        persistPassword = !persistPassword;
        deps.syncToggle(persistBtn, persistPassword, "持久保存密码：开", "持久保存密码：关");
      };
      sec.querySelector("#urpppp-login-save").onclick = () => {
        setVal(LOGIN.ocrUrl, (sec.querySelector("#urpppp-login-ocr").value || "").trim());
        setVal(LOGIN.submitDelay, String(Math.max(0, parseInt(sec.querySelector("#urpppp-login-delay").value, 10) || 300)));
        setVal(LOGIN.zhjwUser, (sec.querySelector("#urpppp-login-zhjw-user").value || "").trim());
        setVal(LOGIN.zhjwPass, persistPassword ? sec.querySelector("#urpppp-login-zhjw-pass").value || "" : "");
        setVal(LOGIN.casUser, (sec.querySelector("#urpppp-login-cas-user").value || "").trim());
        setVal(LOGIN.casPass, persistPassword ? sec.querySelector("#urpppp-login-cas-pass").value || "" : "");
        setVal(LOGIN.passwordStorage, persistPassword ? "persistent" : "none");
        setVal(LOGIN.enabled, enabled);
        setVal(LOGIN.autoSubmit, autoSubmit);
        setVal(LOGIN.shareCred, shareCred);
        if (!persistPassword) {
          sec.querySelector("#urpppp-login-zhjw-pass").value = "";
          sec.querySelector("#urpppp-login-cas-pass").value = "";
        }
        config.resetLoginGuardState("");
        deps.setStatus("urpppp-login-status", persistPassword ? "登录设置已保存；密码将持久保存在脚本存储中，请确认你接受风险。" : "登录设置已保存；密码未持久化，连续失败计数已清零", "ok");
      };
      sec.querySelector("#urpppp-login-clear").onclick = () => {
        setVal(LOGIN.zhjwUser, "");
        setVal(LOGIN.zhjwPass, "");
        setVal(LOGIN.casUser, "");
        setVal(LOGIN.casPass, "");
        setVal(LOGIN.passwordStorage, "none");
        sec.querySelector("#urpppp-login-zhjw-user").value = "";
        sec.querySelector("#urpppp-login-zhjw-pass").value = "";
        sec.querySelector("#urpppp-login-cas-user").value = "";
        sec.querySelector("#urpppp-login-cas-pass").value = "";
        persistPassword = false;
        deps.syncToggle(persistBtn, false, "持久保存密码：开", "持久保存密码：关");
        config.resetLoginGuardState("");
        deps.setStatus("urpppp-login-status", "已清除账密和连续失败计数", "ok");
      };
    }
    __name(bindLoginSection, "bindLoginSection");
    const recognizeSmart = /* @__PURE__ */ __name(async (img, ocrUrl) => {
      const local = typeof deps.recognizeLocalCaptcha === "function" ? deps.recognizeLocalCaptcha(img) : null;
      if (local && /^[a-z0-9]{4}$/i.test(local)) {
        deps.log("验证码（本地）", local);
        return local;
      }
      const url = String(ocrUrl || "").trim();
      if (!url) {
        deps.log("本地识别失败且未配置线上 OCR，等待手动填写");
        return "";
      }
      const code = await deps.recognizeCaptchaWithRequest(
        deps.getBase64FromImage(img),
        url,
        typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null
      );
      deps.log("验证码（线上）", code);
      return code;
    }, "recognizeSmart");
    function credFor(kind, c) {
      if (c.shareCred || kind === "zhjw") return { username: c.zhjwUser, password: c.zhjwPass };
      return { username: c.casUser || c.zhjwUser, password: c.casPass || c.zhjwPass };
    }
    __name(credFor, "credFor");
    function ensureReadyForLogin(kind) {
      const c = config.loginConf();
      if (!c.enabled) return null;
      const cred = credFor(kind, c);
      if (!cred.username || !cred.password) {
        deps.log("未配置账密，请到设置 → 登录助手");
        return null;
      }
      return { conf: c, cred };
    }
    __name(ensureReadyForLogin, "ensureReadyForLogin");
    function fillLoginCredentials(usernameInput, passwordInput, cred) {
      const users = [usernameInput, document.getElementById("urppp-user")];
      const passwords = [passwordInput, document.getElementById("urppp-pass")];
      Array.from(new Set(users.filter(Boolean))).forEach((el) => deps.setInputValue(el, cred.username));
      Array.from(new Set(passwords.filter(Boolean))).forEach((el) => deps.setInputValue(el, cred.password));
    }
    __name(fillLoginCredentials, "fillLoginCredentials");
    function fillLoginCaptcha(captchaInput, code) {
      const inputs = [captchaInput, document.getElementById("urppp-cap")];
      Array.from(new Set(inputs.filter(Boolean))).forEach((el) => deps.setInputValue(el, code));
    }
    __name(fillLoginCaptcha, "fillLoginCaptcha");
    function refreshLoginCaptchaImage(captchaImg) {
      if (!captchaImg || !captchaImg.src) return;
      let refreshed = captchaImg.src;
      try {
        const url = new URL(captchaImg.src, location.href);
        url.searchParams.set("_urpppp", String(Date.now()));
        refreshed = url.href;
      } catch (_) {
      }
      captchaImg.src = refreshed;
      const visibleImg = document.getElementById("urppp-capimg");
      if (visibleImg) visibleImg.src = refreshed;
    }
    __name(refreshLoginCaptchaImage, "refreshLoginCaptchaImage");
    function ensureLoginGuardStyles() {
      if (document.getElementById("urpppp-login-guard-style")) return;
      const style = document.createElement("style");
      style.id = "urpppp-login-guard-style";
      style.textContent = deps.loginGuardStyles;
      (document.head || document.documentElement).appendChild(style);
    }
    __name(ensureLoginGuardStyles, "ensureLoginGuardStyles");
    function removeLoginGuardNotice() {
      const notice = document.getElementById("urpppp-login-guard-notice");
      if (notice) notice.remove();
    }
    __name(removeLoginGuardNotice, "removeLoginGuardNotice");
    function resumeAutoLogin() {
      config.resetLoginGuardState("");
      removeLoginGuardNotice();
      setTimeout(() => {
        mainLogin();
      }, 0);
    }
    __name(resumeAutoLogin, "resumeAutoLogin");
    function showLoginGuardNotice(state) {
      if (!state || !state.failures && !state.paused) {
        removeLoginGuardNotice();
        return;
      }
      const host = document.getElementById("urppp-form") || document.querySelector(".form-signin") || document.querySelector("form");
      if (!host) return;
      ensureLoginGuardStyles();
      let notice = document.getElementById("urpppp-login-guard-notice");
      if (!notice) {
        notice = document.createElement("div");
        notice.id = "urpppp-login-guard-notice";
        notice.setAttribute("role", "status");
      }
      notice.innerHTML = "";
      const title = document.createElement("strong");
      const text = document.createElement("span");
      title.textContent = state.paused ? "自动登录已暂停" : `自动登录失败 ${state.failures}/${LOGIN_FAILURE_LIMIT2}`;
      text.textContent = state.paused ? "连续登录失败已达上限。学号和密码已填好，请手动输入验证码后登录。" : `正在重新识别验证码；达到 ${LOGIN_FAILURE_LIMIT2} 次后将改为手动接管。`;
      notice.append(title, text);
      if (state.paused) {
        const resume = document.createElement("button");
        resume.type = "button";
        resume.textContent = "恢复自动登录";
        resume.addEventListener("click", resumeAutoLogin);
        notice.appendChild(resume);
      }
      host.insertBefore(notice, host.firstChild);
    }
    __name(showLoginGuardNotice, "showLoginGuardNotice");
    async function handleZhjwLogin() {
      const usernameInput = document.getElementById("input_username");
      const passwordInput = document.getElementById("input_password");
      const captchaInput = document.getElementById("input_checkcode");
      const captchaImg = document.getElementById("captchaImg") || document.querySelector(".form-signin img");
      const loginButton = document.getElementById("loginButton");
      if (!usernameInput || !passwordInput || !captchaInput || !captchaImg) return false;
      deps.log("教务登录页");
      const ready = ensureReadyForLogin("zhjw");
      if (!ready) return true;
      const { conf: c, cred } = ready;
      fillLoginCredentials(usernameInput, passwordInput, cred);
      const guard = config.beginLoginProcess("zhjw", cred.username);
      showLoginGuardNotice(guard);
      if (guard.paused) return true;
      if (guard.failures > 0) refreshLoginCaptchaImage(captchaImg);
      fillLoginCaptcha(captchaInput, "");
      if (!captchaImg.complete) await new Promise((resolve) => {
        captchaImg.onload = resolve;
        setTimeout(resolve, 2e3);
      });
      const code = await recognizeSmart(captchaImg, c.ocrUrl);
      if (!code) return true;
      deps.log("教务验证码：", code);
      if (c.autoSubmit && loginButton) {
        await deps.sleep(c.submitDelay);
        config.markPendingAutoLogin("zhjw", cred.username);
        loginButton.click();
      }
      return true;
    }
    __name(handleZhjwLogin, "handleZhjwLogin");
    function findCasElements() {
      const inputs = Array.from(document.querySelectorAll("input"));
      const usernameInput = inputs.find((i) => /账号|学号|用户名|username|user/i.test(i.placeholder || i.name || i.id || "")) || inputs.find((i) => i.type === "text" && !/验证码|captcha|check/i.test(i.placeholder || i.name || i.id || ""));
      const passwordInput = inputs.find((i) => i.type === "password");
      const captchaInput = inputs.find((i) => /验证码|captcha|checkcode|verifycode|verification/i.test(i.placeholder || i.name || i.id || "")) || inputs.find((i) => i.type === "text" && i.maxLength > 0 && i.maxLength <= 8);
      const captchaImg = document.querySelector("img.captcha-img") || document.querySelector("img[src^='data:image']") || Array.from(document.querySelectorAll("img")).find(
        (img) => /captcha|yzm|验证码/i.test((img.className || "") + " " + (img.alt || "") + " " + (img.src || ""))
      );
      const loginButton = Array.from(document.querySelectorAll("button, .ivu-btn, input[type='button'], input[type='submit']")).find((el) => (el.textContent || el.value || "").replace(/\s+/g, "") === "登录");
      return { usernameInput, passwordInput, captchaInput, captchaImg, loginButton };
    }
    __name(findCasElements, "findCasElements");
    async function handleUnifiedAuthLogin() {
      const bodyText = document.body && document.body.innerText || "";
      const isUnifiedAuth = /统一身份认证/.test(bodyText) || !!document.querySelector("img.captcha-img") || /frontend\/login|id\.scu\.edu\.cn|enduser\/sp\/sso/i.test(location.href);
      if (!isUnifiedAuth) return false;
      const els = findCasElements();
      if (!els.usernameInput || !els.passwordInput || !els.captchaInput || !els.captchaImg) return false;
      deps.log("统一认证页");
      const ready = ensureReadyForLogin("cas");
      if (!ready) return true;
      const { conf: c, cred } = ready;
      fillLoginCredentials(els.usernameInput, els.passwordInput, cred);
      const guard = config.beginLoginProcess("cas", cred.username);
      showLoginGuardNotice(guard);
      if (guard.paused) return true;
      fillLoginCaptcha(els.captchaInput, "");
      if (!els.captchaImg.complete) await new Promise((resolve) => {
        els.captchaImg.onload = resolve;
        setTimeout(resolve, 2e3);
      });
      const code = await recognizeSmart(els.captchaImg, c.ocrUrl);
      if (!code) return true;
      fillLoginCaptcha(els.captchaInput, code);
      deps.log("统一认证验证码：", code);
      if (c.autoSubmit && els.loginButton) {
        await deps.sleep(c.submitDelay);
        config.markPendingAutoLogin("cas", cred.username);
        els.loginButton.click();
      }
      return true;
    }
    __name(handleUnifiedAuthLogin, "handleUnifiedAuthLogin");
    let loginRunning = false;
    async function mainLogin() {
      if (loginRunning) return;
      loginRunning = true;
      try {
        await deps.sleep(600);
        if (await handleZhjwLogin()) return;
        if (await handleUnifiedAuthLogin()) return;
      } catch (error) {
        console.error("[URP++ 辅助] 登录失败", error);
      } finally {
        loginRunning = false;
      }
    }
    __name(mainLogin, "mainLogin");
    return {
      bindLoginSection,
      buildLoginSection,
      mainLogin,
      resumeAutoLogin
    };
  }
  __name(createLoginAssist, "createLoginAssist");

  // src/assist/evaluation.js
  function createEvaluationAssist({ config, storage, deps }) {
    const { getBool, setVal, setJSON } = storage;
    const { EVAL, EVALUATION_LIST_PATH: EVALUATION_LIST_PATH2, DEFAULT_COMMENTS: DEFAULT_COMMENTS2 } = deps.constants;
    const {
      escapeHtml,
      escapeAttr: escapeAttr2,
      lettersForMulti: lettersForMulti2,
      lettersForSingle: lettersForSingle2,
      log: log2,
      optionLetter: optionLetter2,
      parsePerQuestionMap: parsePerQuestionMap2,
      pickRandom: pickRandom2,
      randInt: randInt2,
      setInputValue: setInputValue2,
      setTextAreaValue: setTextAreaValue2,
      sleep: sleep2
    } = deps.utils;
    function buildEvalSection() {
      const c = config.evalConf();
      const perSingle = Object.keys(c.singlePerQ || {}).map((k) => `${k}:${c.singlePerQ[k]}`).join("\n");
      const perMulti = Object.keys(c.multiPerQ || {}).map((k) => `${k}:${c.multiPerQ[k]}`).join("\n");
      const sec = document.createElement("section");
      sec.className = "urppp-set-sec urpppp-sec";
      sec.id = "urpppp-eval-sec";
      sec.innerHTML = `
      <h3>评教助手</h3>
      <p class="urppp-set-tip">在评教填写页自动填写问卷。服务端有约 100 秒停留校验，已取消“跳过倒计时”；开启自动保存后会等到设定秒数再提交。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-eval-enabled">功能：${c.enabled ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autofill">进入页面自动填写：${c.autoFill ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autosave">到时自动保存：${c.autoSave ? "开" : "关"}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-avoid-none">多选避开「以上均无」：${c.multiAvoidNone ? "开" : "关"}</button>
      </div>

      <div class="urpppp-sub">自动保存等待</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>等待秒数</label><input type="number" id="urpppp-eval-wait-sec" min="0" max="600" value="${escapeAttr2(String(c.waitSec))}" /></div>
      </div>
      <p class="urpppp-tip">默认100秒，启用自动保存后会在计时结束自动保存。教务系统服务端也会进行倒计时，无法直接跳过等待秒数。</p>

      <div class="urpppp-sub">分数题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>随机下限</label><input type="number" id="urpppp-eval-score-min" min="1" max="100" value="${escapeAttr2(String(c.scoreMin))}" /></div>
        <div class="urpppp-row"><label>随机上限</label><input type="number" id="urpppp-eval-score-max" min="1" max="100" value="${escapeAttr2(String(c.scoreMax))}" /></div>
      </div>
      <p class="urpppp-tip">每位教师的分数题会在 [下限, 上限] 内独立随机整数。</p>

      <div class="urpppp-sub">单选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认选项池</label><input type="text" id="urpppp-eval-single" value="${escapeAttr2(c.singleLetters)}" placeholder="如 A 或 A,B" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-single-per" placeholder="每行：题号:选项池&#10;2:A,B&#10;5:A">${escapeHtml(perSingle)}</textarea></div>
      </div>
      <p class="urpppp-tip">不同问卷的部分题目特殊（如国际周课程的第7题），建议在执行自动评教前检查特殊题目并按题配置</p>
      <p class="urpppp-tip">题号为页面「2、3、4…」中的数字。选项池如 <code>A,B</code> 表示在 A/B 中随机。</p>

      <div class="urpppp-sub">多选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认勾选池</label><input type="text" id="urpppp-eval-multi" value="${escapeAttr2(c.multiLetters)}" placeholder="如 A,B,C" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-multi-per" placeholder="每行：题号:选项池&#10;6:A,B,C,F">${escapeHtml(perMulti)}</textarea></div>
      </div>
      <p class="urpppp-tip">会勾选池内全部选项；若开启避开「以上均无」，不会勾选含「以上均无」的项。</p>

      <div class="urpppp-sub">主观题模板</div>
      <div class="urpppp-grid">
        <div class="urpppp-row" style="align-items:start"><label>评语模板</label><textarea id="urpppp-eval-comments" placeholder="每行一条，随机选用">${escapeHtml(c.commentTemplates)}</textarea></div>
        <div class="urpppp-row"><label>自动保存延迟(ms)</label><input type="number" id="urpppp-eval-save-delay" min="0" step="100" value="${escapeAttr2(String(c.saveDelay))}" /></div>
      </div>
      <p class="urpppp-tip">评语模版以回车划分，可以自行添加新模板</p>

      <div class="urpppp-sub">全自动评教（列表页）</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>问卷间隔(秒)</label><input type="number" id="urpppp-eval-batch-gap" min="0" max="60" value="${escapeAttr2(String(c.batchGapSec))}" /></div>
      </div>
      <p class="urpppp-tip">在「教学评估」列表页启动：自动找未评估 → 进入填写 → 等待秒数后保存 → 返回列表继续，直到全部完成。期间请勿手动关闭页面。</p>

      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-eval-save">保存评教设置</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-eval-run">对当前评教页立即执行</button>
        <button type="button" class="urppp-set-btn" id="urpppp-eval-batch-start">启动全自动评教</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-eval-batch-stop">停止全自动</button>
      </div>
      <div class="urpppp-status" id="urpppp-eval-status"></div>
    `;
      return sec;
    }
    __name(buildEvalSection, "buildEvalSection");
    function bindEvalSection(sec) {
      let enabled = getBool(EVAL.enabled, true);
      let autoFill = getBool(EVAL.autoFill, true);
      let autoSave = getBool(EVAL.autoSave, false);
      let avoidNone = getBool(EVAL.multiAvoidNone, true);
      const enabledBtn = sec.querySelector("#urpppp-eval-enabled");
      const fillBtn = sec.querySelector("#urpppp-eval-autofill");
      const saveAutoBtn = sec.querySelector("#urpppp-eval-autosave");
      const avoidBtn = sec.querySelector("#urpppp-eval-avoid-none");
      deps.syncToggle(enabledBtn, enabled, "功能：开", "功能：关");
      deps.syncToggle(fillBtn, autoFill, "进入页面自动填写：开", "进入页面自动填写：关");
      deps.syncToggle(saveAutoBtn, autoSave, "到时自动保存：开", "到时自动保存：关");
      deps.syncToggle(avoidBtn, avoidNone, "多选避开「以上均无」：开", "多选避开「以上均无」：关");
      enabledBtn.onclick = () => {
        enabled = !enabled;
        setVal(EVAL.enabled, enabled);
        deps.syncToggle(enabledBtn, enabled, "功能：开", "功能：关");
      };
      fillBtn.onclick = () => {
        autoFill = !autoFill;
        setVal(EVAL.autoFill, autoFill);
        deps.syncToggle(fillBtn, autoFill, "进入页面自动填写：开", "进入页面自动填写：关");
      };
      saveAutoBtn.onclick = () => {
        autoSave = !autoSave;
        setVal(EVAL.autoSave, autoSave);
        deps.syncToggle(saveAutoBtn, autoSave, "到时自动保存：开", "到时自动保存：关");
      };
      avoidBtn.onclick = () => {
        avoidNone = !avoidNone;
        setVal(EVAL.multiAvoidNone, avoidNone);
        deps.syncToggle(avoidBtn, avoidNone, "多选避开「以上均无」：开", "多选避开「以上均无」：关");
      };
      sec.querySelector("#urpppp-eval-save").onclick = () => {
        let min = Math.max(1, Math.min(100, parseInt(sec.querySelector("#urpppp-eval-score-min").value, 10) || 92));
        let max = Math.max(1, Math.min(100, parseInt(sec.querySelector("#urpppp-eval-score-max").value, 10) || 98));
        if (max < min) {
          const t = min;
          min = max;
          max = t;
        }
        setVal(EVAL.enabled, enabled);
        setVal(EVAL.autoFill, autoFill);
        setVal(EVAL.autoSave, autoSave);
        setVal(EVAL.multiAvoidNone, avoidNone);
        setVal(EVAL.waitSec, String(Math.max(0, parseInt(sec.querySelector("#urpppp-eval-wait-sec").value, 10) || 100)));
        setVal(EVAL.scoreMin, String(min));
        setVal(EVAL.scoreMax, String(max));
        setVal(EVAL.singleLetters, (sec.querySelector("#urpppp-eval-single").value || "A").trim());
        setJSON(EVAL.singlePerQ, parsePerQuestionMap2(sec.querySelector("#urpppp-eval-single-per").value));
        setVal(EVAL.multiLetters, (sec.querySelector("#urpppp-eval-multi").value || "A,B,C").trim());
        setJSON(EVAL.multiPerQ, parsePerQuestionMap2(sec.querySelector("#urpppp-eval-multi-per").value));
        setVal(EVAL.commentTemplates, sec.querySelector("#urpppp-eval-comments").value || "");
        setVal(EVAL.saveDelay, String(Math.max(0, parseInt(sec.querySelector("#urpppp-eval-save-delay").value, 10) || 500)));
        setVal(EVAL.batchGapSec, String(Math.max(0, parseInt(sec.querySelector("#urpppp-eval-batch-gap").value, 10) || 2)));
        deps.setStatus("urpppp-eval-status", "评教设置已保存", "ok");
      };
      sec.querySelector("#urpppp-eval-run").onclick = async () => {
        try {
          const ok = await runEvaluationAssist({ force: true, forceSave: true });
          deps.setStatus("urpppp-eval-status", ok ? "已在当前评教页执行" : "当前不是评教填写页，或执行失败", ok ? "ok" : "err");
        } catch (e) {
          deps.setStatus("urpppp-eval-status", String(e && e.message || e), "err");
        }
      };
      const batchStartBtn = sec.querySelector("#urpppp-eval-batch-start");
      const batchStopBtn = sec.querySelector("#urpppp-eval-batch-stop");
      if (batchStartBtn) {
        batchStartBtn.onclick = async () => {
          try {
            const n = await startFullAutoEvaluation();
            deps.setStatus("urpppp-eval-status", n > 0 ? "已启动全自动，共 " + n + " 份未评估" : "当前列表没有未评估问卷（请先打开教学评估列表页）", n > 0 ? "ok" : "err");
          } catch (e) {
            deps.setStatus("urpppp-eval-status", String(e && e.message || e), "err");
          }
        };
      }
      if (batchStopBtn) {
        batchStopBtn.onclick = () => {
          config.clearBatchState();
          deps.setStatus("urpppp-eval-status", "已停止全自动评教", "ok");
          updateBatchHud();
        };
      }
    }
    __name(bindEvalSection, "bindEvalSection");
    function isEvaluationPage() {
      return /\/student\/teachingEvaluation\/newEvaluation\/evaluation\//i.test(location.pathname || "") || !!(document.getElementById("savebutton") && document.getElementById("timer") && document.forms.saveEvaluation);
    }
    __name(isEvaluationPage, "isEvaluationPage");
    function getGlobalScope() {
      try {
        if (typeof unsafeWindow !== "undefined" && unsafeWindow) return unsafeWindow;
      } catch (_) {
      }
      return window;
    }
    __name(getGlobalScope, "getGlobalScope");
    function injectPageScript(fn, arg) {
      try {
        const script = document.createElement("script");
        script.textContent = "(" + fn.toString() + ")(" + JSON.stringify(arg == null ? null : arg) + ");";
        const root = document.documentElement || document.head || document.body;
        root.appendChild(script);
        script.remove();
        return true;
      } catch (e) {
        console.warn("[URP++ 辅助] injectPageScript failed", e);
        return false;
      }
    }
    __name(injectPageScript, "injectPageScript");
    function enableSaveButtonInPage() {
      injectPageScript(function() {
        try {
          var btn2 = document.getElementById("savebutton") || document.getElementById("save") || document.getElementById("save2");
          if (btn2) {
            btn2.disabled = false;
            btn2.removeAttribute("disabled");
            try {
              btn2.classList.remove("disabled");
            } catch (e0) {
            }
          }
          var ts = document.getElementById("tsxx");
          if (ts) ts.style.display = "none";
        } catch (e) {
          console.warn("[URP++ 辅助] enable save failed", e);
        }
      });
      const btn = document.getElementById("savebutton") || document.getElementById("save") || document.getElementById("save2");
      if (btn) {
        btn.disabled = false;
        btn.removeAttribute("disabled");
      }
    }
    __name(enableSaveButtonInPage, "enableSaveButtonInPage");
    function questionIndexNear(el) {
      let node = el;
      for (let i = 0; i < 12 && node; i++) {
        const t = (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
        const m = t.match(/(?:^|\n)\s*(\d{1,2})\s*[、.．]/);
        if (m) return m[1];
        let prev = node.previousElementSibling;
        let guard = 0;
        while (prev && guard++ < 6) {
          const pt = (prev.innerText || prev.textContent || "").replace(/\s+/g, " ").trim();
          const pm = pt.match(/^(\d{1,2})\s*[、.．]/);
          if (pm) return pm[1];
          prev = prev.previousElementSibling;
        }
        node = node.parentElement;
      }
      return "";
    }
    __name(questionIndexNear, "questionIndexNear");
    function fillScores(cfg) {
      let min = Number(cfg.scoreMin) || 92;
      let max = Number(cfg.scoreMax) || 98;
      if (max < min) {
        const t = min;
        min = max;
        max = t;
      }
      const inputs = Array.from(document.querySelectorAll('input[data-name="szt"], input[placeholder*="1-100"]'));
      let n = 0;
      inputs.forEach((input) => {
        if (input.type === "hidden") return;
        const v = String(randInt2(min, max));
        setInputValue2(input, v);
        n++;
      });
      return n;
    }
    __name(fillScores, "fillScores");
    function fillRadios(cfg) {
      const names = [...new Set(Array.from(document.querySelectorAll('input[type="radio"]')).map((r) => r.name).filter((n) => n && !/zcms|week|kszc|jszc/i.test(n)))];
      let filled = 0;
      names.forEach((name) => {
        const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
        if (!radios.length) return;
        if (radios.every((r) => /全周|单周|双周/.test(r.value || ""))) return;
        const qNo = questionIndexNear(radios[0]);
        const pool = lettersForSingle2(qNo, cfg);
        const candidates = radios.filter((r) => {
          const letter = optionLetter2(r.value) || optionLetter2(r.nextSibling && r.nextSibling.textContent || "") || optionLetter2(r.parentElement && r.parentElement.textContent);
          return pool.includes(letter);
        });
        const pick = pickRandom2(candidates.length ? candidates : radios);
        if (pick) {
          pick.checked = true;
          pick.dispatchEvent(new Event("click", { bubbles: true }));
          pick.dispatchEvent(new Event("change", { bubbles: true }));
          filled++;
        }
      });
      return filled;
    }
    __name(fillRadios, "fillRadios");
    function fillChecks(cfg) {
      const names = [...new Set(Array.from(document.querySelectorAll('input[type="checkbox"]')).map((c) => c.name).filter(Boolean))];
      let groups = 0;
      names.forEach((name) => {
        const boxes = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
        if (!boxes.length) return;
        const qNo = questionIndexNear(boxes[0]);
        const pool = lettersForMulti2(qNo, cfg);
        boxes.forEach((b) => {
          b.checked = false;
        });
        let any = false;
        boxes.forEach((b) => {
          const label = b.value || b.parentElement && b.parentElement.textContent || "";
          const letter = optionLetter2(b.value) || optionLetter2(label);
          if (!pool.includes(letter)) return;
          if (cfg.multiAvoidNone && /以上均无|均无|无以上/.test(label)) return;
          b.checked = true;
          b.dispatchEvent(new Event("click", { bubbles: true }));
          b.dispatchEvent(new Event("change", { bubbles: true }));
          any = true;
        });
        if (!any) {
          const fallback = boxes.find((b) => !/以上均无|均无/.test(b.value || b.parentElement && b.parentElement.textContent || "")) || boxes[0];
          if (fallback) {
            fallback.checked = true;
            fallback.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
        groups++;
      });
      return groups;
    }
    __name(fillChecks, "fillChecks");
    function fillComments(cfg) {
      const lines = String(cfg.commentTemplates || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const pool = lines.length ? lines : DEFAULT_COMMENTS2.split("\n");
      const areas = Array.from(document.querySelectorAll('form[name="saveEvaluation"] textarea, #saveEvaluation textarea, textarea')).filter((t) => t.name || t.closest("form"));
      let n = 0;
      areas.forEach((ta) => {
        if (/kszc|jszc|search/i.test(ta.name || ta.id || "")) return;
        const text = pickRandom2(pool) || "老师认真负责，课程收获很大。";
        setTextAreaValue2(ta, text.slice(0, ta.maxLength > 0 ? ta.maxLength : 500));
        n++;
      });
      return n;
    }
    __name(fillComments, "fillComments");
    function tryAutoSave(cfg) {
      if (!cfg.autoSave && !cfg.__forceSave) return false;
      enableSaveButtonInPage();
      const injected = injectPageScript(function() {
        try {
          var btn2 = document.getElementById("savebutton") || document.getElementById("save") || document.getElementById("save2");
          if (btn2) {
            btn2.disabled = false;
            btn2.removeAttribute("disabled");
          }
          if (typeof save === "function") {
            save();
            return;
          }
          if (btn2) btn2.click();
        } catch (e) {
          console.warn("[URP++ 辅助] page save failed", e);
          try {
            var b2 = document.getElementById("savebutton");
            if (b2) b2.click();
          } catch (e2) {
          }
        }
      });
      if (injected) {
        log2("已请求页面保存");
        return true;
      }
      const btn = document.getElementById("savebutton") || document.getElementById("save") || document.getElementById("save2");
      if (btn) {
        btn.disabled = false;
        btn.removeAttribute("disabled");
        btn.click();
        log2("已点击保存按钮");
        return true;
      }
      return false;
    }
    __name(tryAutoSave, "tryAutoSave");
    let evalPageEnterAt = 0;
    function markEvalPageEnter() {
      if (!isEvaluationPage()) return;
      if (!evalPageEnterAt) evalPageEnterAt = Date.now();
    }
    __name(markEvalPageEnter, "markEvalPageEnter");
    async function waitBeforeAutoSave(cfg) {
      const need = Math.max(0, Number(cfg.waitSec) || 0);
      if (need <= 0) return 0;
      if (!evalPageEnterAt) evalPageEnterAt = Date.now();
      const elapsed = (Date.now() - evalPageEnterAt) / 1e3;
      const remain = Math.ceil(need - elapsed);
      if (remain <= 0) return 0;
      log2(`自动保存等待 ${remain}s（不跳过服务端倒计时）`);
      let left = remain;
      while (left > 0) {
        const tip2 = document.getElementById("urpppp-eval-wait-tip");
        if (tip2) tip2.textContent = `评教助手：约 ${left} 秒后自动保存`;
        await sleep2(1e3);
        left -= 1;
      }
      const tip = document.getElementById("urpppp-eval-wait-tip");
      if (tip) tip.textContent = "评教助手：正在自动保存…";
      return remain;
    }
    __name(waitBeforeAutoSave, "waitBeforeAutoSave");
    function ensureWaitTip() {
      if (!isEvaluationPage()) return;
      if (document.getElementById("urpppp-eval-wait-tip")) return;
      const host = document.querySelector(".right_top_oper") || document.querySelector("#savebutton") && document.getElementById("savebutton").parentElement;
      if (!host) return;
      const tip = document.createElement("span");
      tip.id = "urpppp-eval-wait-tip";
      host.appendChild(tip);
    }
    __name(ensureWaitTip, "ensureWaitTip");
    let evalRunning = false;
    async function runEvaluationAssist(opts) {
      opts = opts || {};
      if (!isEvaluationPage()) return false;
      markEvalPageEnter();
      ensureWaitTip();
      updateBatchHud();
      const cfg = config.evalConf();
      const batch = config.getBatchState();
      const forceSave = !!(opts.forceSave || batch.active);
      const forceFill = !!(opts.force || cfg.autoFill || batch.active);
      if (!cfg.enabled && !opts.force && !batch.active) return false;
      if (evalRunning) return false;
      evalRunning = true;
      try {
        log2("评教页处理开始", cfg, batch);
        if (forceFill) {
          const s = fillScores(cfg);
          const r = fillRadios(cfg);
          const m = fillChecks(cfg);
          const t = fillComments(cfg);
          log2(`已填充：分数${s} 单选${r} 多选${m} 主观${t}`);
          setBatchTip(`已填写，等待 ${cfg.waitSec}s 后保存（${batch.active ? "队列 " + (batch.index + 1) + "/" + batch.queue.length : "单页"}）`);
        }
        if (cfg.autoSave || forceSave) {
          await waitBeforeAutoSave(cfg);
          await sleep2(cfg.saveDelay || 0);
          enableSaveButtonInPage();
          if (batch.active) installSaveSuccessWatcher();
          tryAutoSave(Object.assign({}, cfg, { autoSave: true, __forceSave: true }));
          if (batch.active) {
            await sleep2(2500);
            if (isEvaluationPage()) {
              log2("保存后仍停留在填写页，可能失败；停止或回列表重试");
              setBatchTip("保存可能失败，请检查后重试/停止全自动");
            }
          }
        }
        return true;
      } catch (e) {
        console.error("[URP++ 辅助] 评教失败", e);
        return false;
      } finally {
        evalRunning = false;
      }
    }
    __name(runEvaluationAssist, "runEvaluationAssist");
    function isEvaluationListPage() {
      const p = String(location.pathname || "");
      return /\/student\/teachingEvaluation\/newEvaluation\/index/i.test(p);
    }
    __name(isEvaluationListPage, "isEvaluationListPage");
    function setBatchTip(text) {
      const el = document.getElementById("urpppp-eval-wait-tip") || document.getElementById("urpppp-batch-hud");
      if (el) el.textContent = text || "";
      log2(text);
    }
    __name(setBatchTip, "setBatchTip");
    function updateBatchHud() {
      const batch = config.getBatchState();
      let hud = document.getElementById("urpppp-batch-hud");
      if (!batch.active) {
        if (hud) hud.remove();
        return;
      }
      if (!hud) {
        hud = document.createElement("div");
        hud.id = "urpppp-batch-hud";
        document.documentElement.appendChild(hud);
        deps.settingsStyles();
      }
      const total = (batch.queue || []).length;
      const cur = Math.min(batch.index + 1, total);
      const item = batch.queue[batch.index];
      hud.innerHTML = `<div class="urpppp-hud-title">全自动评教进行中</div>
      <div class="urpppp-hud-line">进度：${cur}/${total}</div>
      <div class="urpppp-hud-course">${escapeHtml(item && item.title || "")}</div>
      <button type="button" id="urpppp-batch-hud-stop">停止</button>`;
      const stop = document.getElementById("urpppp-batch-hud-stop");
      if (stop) stop.onclick = () => {
        config.clearBatchState();
        updateBatchHud();
        setBatchTip("已停止全自动评教");
      };
    }
    __name(updateBatchHud, "updateBatchHud");
    function scanUnevaluatedFromList() {
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      document.querySelectorAll('a[onclick*="evaluation("], button[onclick*="evaluation("]').forEach((a) => {
        const oc = a.getAttribute("onclick") || "";
        const m = oc.match(/evaluation\s*\(\s*this\s*,\s*["']([0-9A-Fa-f]+)["']/);
        if (!m) return;
        const ktid = m[1];
        if (seen.has(ktid)) return;
        const tr = a.closest("tr");
        const rowText = (tr && tr.innerText || a.innerText || "").replace(/\s+/g, " ").trim();
        const opText = (a.textContent || "").replace(/\s+/g, "");
        if (!(opText === "评估" || /\s否\s|是否已评估.*否|\b否\b/.test(rowText))) return;
        let title = "";
        if (tr) {
          const tds = Array.from(tr.cells || []).map((td) => (td.textContent || "").replace(/\s+/g, " ").trim());
          title = tds[4] || tds[2] || tds.find((t) => t && !/^\d+$/.test(t) && t !== "评估" && t !== "否") || rowText;
        }
        seen.add(ktid);
        out.push({
          ktid,
          url: "/student/teachingEvaluation/newEvaluation/evaluation/" + ktid,
          title: String(title || ktid).slice(0, 80)
        });
      });
      return out;
    }
    __name(scanUnevaluatedFromList, "scanUnevaluatedFromList");
    async function startFullAutoEvaluation() {
      if (!isEvaluationListPage()) {
        config.setBatchState({ active: true, queue: [], index: 0 });
        location.href = EVALUATION_LIST_PATH2;
        return 0;
      }
      await sleep2(400);
      const queue = scanUnevaluatedFromList();
      if (!queue.length) {
        config.clearBatchState();
        updateBatchHud();
        return 0;
      }
      config.setBatchState({ active: true, queue, index: 0 });
      updateBatchHud();
      log2("全自动队列", queue);
      await sleep2(Math.max(0, (config.evalConf().batchGapSec || 0) * 1e3));
      location.href = queue[0].url;
      return queue.length;
    }
    __name(startFullAutoEvaluation, "startFullAutoEvaluation");
    async function resumeFullAutoOnList() {
      const batch = config.getBatchState();
      if (!batch.active) return false;
      if (!isEvaluationListPage()) return false;
      await sleep2(600);
      let queue = batch.queue || [];
      let index = batch.index || 0;
      if (!queue.length) {
        queue = scanUnevaluatedFromList();
        index = 0;
        if (!queue.length) {
          config.clearBatchState();
          updateBatchHud();
          setBatchTip("全自动完成：没有未评估问卷");
          alert("全自动评教完成：当前没有未评估问卷");
          return true;
        }
        config.setBatchState({ active: true, queue, index: 0 });
      }
      const fresh = scanUnevaluatedFromList();
      if (!fresh.length) {
        config.clearBatchState();
        updateBatchHud();
        setBatchTip("全自动完成：全部评教已完成");
        alert("全自动评教完成：全部已评估");
        return true;
      }
      config.setBatchState({ active: true, queue: fresh, index: 0 });
      updateBatchHud();
      const next = fresh[0];
      setBatchTip(`全自动：下一项 ${next.title}`);
      await sleep2(Math.max(300, (config.evalConf().batchGapSec || 0) * 1e3));
      location.href = next.url;
      return true;
    }
    __name(resumeFullAutoOnList, "resumeFullAutoOnList");
    function installSaveSuccessWatcher() {
      if (window.__urppppSaveWatch) return;
      window.__urppppSaveWatch = true;
      injectPageScript(function() {
        try {
          if (!window.jQuery || window.__urppppAjaxHooked) return;
          window.__urppppAjaxHooked = true;
          var $ = window.jQuery;
          var orig = $.ajax;
          $.ajax = function(opts) {
            var o = opts || {};
            var url = o.url || "";
            if (/doSave/i.test(url)) {
              var userSuccess = o.success;
              o = Object.assign({}, o, {
                success: /* @__PURE__ */ __name(function(data, status, xhr) {
                  try {
                    window.dispatchEvent(new CustomEvent("urpppp-eval-saved", { detail: data || {} }));
                  } catch (e) {
                  }
                  if (typeof userSuccess === "function") userSuccess(data, status, xhr);
                }, "success")
              });
              return orig.call(this, o);
            }
            return orig.apply(this, arguments);
          };
        } catch (e) {
          console.warn("[URP++ 辅助] ajax hook failed", e);
        }
      });
      window.addEventListener("urpppp-eval-saved", async (ev) => {
        const data = ev && ev.detail || {};
        const batch = config.getBatchState();
        if (!batch.active) return;
        const ok = data && (data.result === "ok" || typeof data.result === "string" && data.result.indexOf("/") !== -1);
        if (!ok && data.result && data.result !== "ok") {
          log2("保存返回非 ok", data);
        }
        setBatchTip("保存成功，返回列表继续…");
        config.setBatchState({
          active: true,
          queue: batch.queue,
          index: (batch.index || 0) + 1
        });
        await sleep2(Math.max(500, (config.evalConf().batchGapSec || 0) * 1e3));
        location.href = EVALUATION_LIST_PATH2;
      });
    }
    __name(installSaveSuccessWatcher, "installSaveSuccessWatcher");
    return {
      bindEvalSection,
      buildEvalSection,
      ensureWaitTip,
      installSaveSuccessWatcher,
      isEvaluationPage,
      isEvaluationListPage,
      markEvalPageEnter,
      resumeFullAutoOnList,
      runEvaluationAssist,
      startFullAutoEvaluation,
      updateBatchHud
    };
  }
  __name(createEvaluationAssist, "createEvaluationAssist");

  // src/assist/update.js
  function createUpdateAssist({ deps }) {
    function fetchAssistRemoteVersion() {
      return new Promise((resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: "GET",
            url: deps.URPPPP_RAW_URL,
            timeout: 15e3,
            headers: { "Cache-Control": "no-cache" },
            onload: /* @__PURE__ */ __name((r) => {
              if (r.status >= 200 && r.status < 400) resolve(r.responseText || "");
              else reject(new Error("HTTP " + r.status));
            }, "onload"),
            onerror: /* @__PURE__ */ __name(() => reject(new Error("network error")), "onerror"),
            ontimeout: /* @__PURE__ */ __name(() => reject(new Error("timeout")), "ontimeout")
          });
        } catch (e) {
          reject(e);
        }
      });
    }
    __name(fetchAssistRemoteVersion, "fetchAssistRemoteVersion");
    function compareSemver(a, b) {
      try {
        const api = typeof unsafeWindow !== "undefined" && unsafeWindow && unsafeWindow.__urpppUpdate || window.__urpppUpdate;
        if (api && typeof api.compareVersions === "function") {
          return api.compareVersions(a, b);
        }
      } catch (_) {
      }
      return deps.compareStandaloneVersions(a, b);
    }
    __name(compareSemver, "compareSemver");
    async function checkAssistUpdate() {
      const local = deps.URPPPP_VERSION;
      const remoteSource = await fetchAssistRemoteVersion();
      const remote = deps.parseVersionFromSource(remoteSource);
      if (!remote) throw new Error("无法解析远程辅助插件版本");
      const cmp = compareSemver(remote, local);
      return {
        id: "assist",
        name: "辅助插件",
        local,
        remote,
        status: cmp > 0 ? "update" : cmp === 0 ? "latest" : "ahead",
        updateUrl: deps.URPPPP_RAW_URL
      };
    }
    __name(checkAssistUpdate, "checkAssistUpdate");
    function getMainUpdateApi() {
      try {
        if (typeof unsafeWindow !== "undefined" && unsafeWindow && unsafeWindow.__urpppUpdate) {
          return unsafeWindow.__urpppUpdate;
        }
      } catch (_) {
      }
      try {
        if (window.top && window.top !== window && window.top.__urpppUpdate) return window.top.__urpppUpdate;
      } catch (_) {
      }
      try {
        if (window.__urpppUpdate) return window.__urpppUpdate;
      } catch (_) {
      }
      return null;
    }
    __name(getMainUpdateApi, "getMainUpdateApi");
    function registerAssistUpdateChecker() {
      try {
        const api = getMainUpdateApi();
        if (!api || typeof api.registerChecker !== "function") return false;
        return api.registerChecker({
          id: "assist",
          name: "辅助插件",
          localVersion: deps.URPPPP_VERSION,
          check: checkAssistUpdate
        });
      } catch (_) {
      }
      return false;
    }
    __name(registerAssistUpdateChecker, "registerAssistUpdateChecker");
    return {
      checkAssistUpdate,
      registerAssistUpdateChecker
    };
  }
  __name(createUpdateAssist, "createUpdateAssist");

  // src/assist/panel.js
  function createAssistPanel({ login, evaluation, deps }) {
    const uiState = { injected: false };
    function ensureSubPanel() {
      let panel = document.getElementById("urpppp-subpanel");
      if (panel) return panel;
      panel = document.createElement("div");
      panel.id = "urpppp-subpanel";
      panel.innerHTML = `
      <div class="urpppp-sub-head">
        <div class="urpppp-sub-title" id="urpppp-sub-title">助手设置</div>
        <button type="button" class="urpppp-sub-close" id="urpppp-sub-close" aria-label="关闭">×</button>
      </div>
      <div class="urpppp-sub-body" id="urpppp-sub-body"></div>
    `;
      document.documentElement.appendChild(panel);
      panel.querySelector("#urpppp-sub-close").onclick = closeSubPanel;
      return panel;
    }
    __name(ensureSubPanel, "ensureSubPanel");
    function placeSubPanelLikeMain() {
      const main = document.getElementById("urppp-settings-panel");
      const sub = document.getElementById("urpppp-subpanel");
      if (!main || !sub) return;
      const r = main.getBoundingClientRect();
      const top = Math.max(8, r.top);
      const left = Math.max(8, r.left);
      const width = Math.max(320, r.width || 420);
      const maxHeight = Math.max(240, r.height || window.innerHeight - top - 16);
      sub.style.top = top + "px";
      sub.style.left = left + "px";
      sub.style.width = width + "px";
      sub.style.maxHeight = maxHeight + "px";
      sub.style.right = "auto";
      sub.style.bottom = "auto";
    }
    __name(placeSubPanelLikeMain, "placeSubPanelLikeMain");
    function openSubPanel(kind) {
      deps.settingsStyles();
      const sub = ensureSubPanel();
      const body = sub.querySelector("#urpppp-sub-body");
      const title = sub.querySelector("#urpppp-sub-title");
      if (!body || !title) return;
      body.innerHTML = "";
      if (kind === "login") {
        title.textContent = "登录助手";
        const sec = login.buildLoginSection();
        body.appendChild(sec);
        login.bindLoginSection(sec);
      } else {
        title.textContent = "评教助手";
        const sec = evaluation.buildEvalSection();
        body.appendChild(sec);
        evaluation.bindEvalSection(sec);
      }
      placeSubPanelLikeMain();
      sub.classList.add("open");
      setTimeout(placeSubPanelLikeMain, 30);
    }
    __name(openSubPanel, "openSubPanel");
    function closeSubPanel() {
      const sub = document.getElementById("urpppp-subpanel");
      if (!sub) return;
      sub.classList.remove("open");
      const body = sub.querySelector("#urpppp-sub-body");
      if (body) body.innerHTML = "";
    }
    __name(closeSubPanel, "closeSubPanel");
    function injectSettingsPanel() {
      const panel = document.getElementById("urppp-settings-panel");
      if (!panel) return false;
      const body = panel.querySelector("#urppp-set-assist-slot") || panel.querySelector('.urppp-set-pane[data-pane="system"]') || panel.querySelector(".urppp-set-body");
      if (!body) return false;
      deps.settingsStyles();
      const oldLogin = document.getElementById("urpppp-login-sec");
      const oldEval = document.getElementById("urpppp-eval-sec");
      if (oldLogin && oldLogin.closest("#urppp-settings-panel")) oldLogin.remove();
      if (oldEval && oldEval.closest("#urppp-settings-panel")) oldEval.remove();
      let entry = document.getElementById("urpppp-entry-sec");
      if (entry && body.id === "urppp-set-assist-slot" && entry.parentElement !== body) {
        entry.remove();
        entry = null;
      }
      if (!document.getElementById("urpppp-entry-sec")) {
        entry = document.createElement("section");
        entry.className = "urppp-set-sec urpppp-entry-sec";
        entry.id = "urpppp-entry-sec";
        entry.innerHTML = `
        <h3>辅助插件</h3>
        <div class="urpppp-entry-grid">
          <button type="button" class="urppp-set-btn" id="urpppp-open-login">登录助手</button>
          <button type="button" class="urppp-set-btn" id="urpppp-open-eval">评教助手</button>
        </div>
        <p class="urpppp-tip">辅助插件 v${deps.URPPPP_VERSION}</p>
      `;
        body.appendChild(entry);
        entry.querySelector("#urpppp-open-login").onclick = () => openSubPanel("login");
        entry.querySelector("#urpppp-open-eval").onclick = () => openSubPanel("eval");
      }
      if (!panel.__urppppCloseHooked) {
        panel.__urppppCloseHooked = true;
        const closeBtn = panel.querySelector("#urppp-set-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => closeSubPanel());
        }
        const mask = document.getElementById("urppp-settings-mask");
        if (mask && !mask.__urppppCloseHooked) {
          mask.__urppppCloseHooked = true;
          mask.addEventListener("click", () => closeSubPanel());
        }
      }
      uiState.injected = true;
      return true;
    }
    __name(injectSettingsPanel, "injectSettingsPanel");
    function watchSettingsPanel() {
      if (window.__urppppSettingsWatchBound) return;
      window.__urppppSettingsWatchBound = true;
      const tryInject = /* @__PURE__ */ __name(() => {
        try {
          injectSettingsPanel();
        } catch (e) {
          console.warn(e);
        }
      }, "tryInject");
      let injectTimer = 0;
      const scheduleInject = /* @__PURE__ */ __name((delay) => {
        clearTimeout(injectTimer);
        injectTimer = setTimeout(tryInject, delay);
      }, "scheduleInject");
      const settingsSelector = "#urppp-settings-panel, #urppp-set-assist-slot, .urppp-set-body";
      const containsSettingsNode = /* @__PURE__ */ __name((node) => {
        if (!node || ![1, 11].includes(node.nodeType)) return false;
        if (node.matches && node.matches(settingsSelector)) return true;
        return Boolean(node.querySelector && node.querySelector(settingsSelector));
      }, "containsSettingsNode");
      tryInject();
      const obs = new MutationObserver((mutations) => {
        const relevant = mutations.some((mutation) => Array.from(mutation.addedNodes || []).some(containsSettingsNode));
        if (relevant) scheduleInject(30);
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#urppp-nav-settings") || t.closest("#uc-settings") || t.closest(".urppp-nav-settings")) {
          setTimeout(tryInject, 50);
          setTimeout(tryInject, 200);
        }
      }, true);
    }
    __name(watchSettingsPanel, "watchSettingsPanel");
    return {
      closeSubPanel,
      injectSettingsPanel,
      openSubPanel,
      watchSettingsPanel
    };
  }
  __name(createAssistPanel, "createAssistPanel");

  // src/styles/assist-login-guard.css
  var assist_login_guard_default = `#urpppp-login-guard-notice{
  margin:10px 0;padding:10px 12px;border-radius:10px;
  border:1px solid color-mix(in srgb,var(--warning,#b7791f) 45%,var(--border,#e5e7eb));
  background:color-mix(in srgb,var(--warning,#b7791f) 10%,var(--surface,#fff));
  color:var(--text,#1f2937);font-size:12px;line-height:1.55
}
#urpppp-login-guard-notice strong{display:block;margin-bottom:3px;color:var(--warning,#9a6700)}
#urpppp-login-guard-notice button{
  margin-top:8px;height:30px;padding:0 12px;border-radius:8px;cursor:pointer;
  border:1px solid var(--border,#e5e7eb);background:var(--surface,#fff);color:var(--text,#1f2937);font-size:12px
}
#urpppp-login-guard-notice button:hover{border-color:var(--primary,#3b82f6);color:var(--primary,#3b82f6)}
`;

  // src/styles/assist.css
  var assist_default = `#urppp-settings-panel .urpppp-sec h3{margin:0 0 8px}
#urppp-settings-panel .urpppp-grid{display:grid;grid-template-columns:1fr;gap:8px}
#urppp-settings-panel .urpppp-row{display:grid;grid-template-columns:108px 1fr;gap:8px;align-items:center}
#urppp-settings-panel .urpppp-row label{font-size:12px;color:var(--text-secondary,#667085)}
#urppp-settings-panel .urpppp-row input[type="text"],
#urppp-settings-panel .urpppp-row input[type="password"],
#urppp-settings-panel .urpppp-row input[type="number"],
#urppp-settings-panel .urpppp-row input[type="url"],
#urppp-settings-panel .urpppp-row select,
#urppp-settings-panel .urpppp-row textarea{
  width:100%;border:1px solid var(--border,#e5e7eb);border-radius:8px;
  background:var(--input-bg,#f8fafc);color:var(--text,#111);padding:6px 10px;font-size:12px;box-sizing:border-box
}
#urppp-settings-panel .urpppp-row input, #urppp-settings-panel .urpppp-row select{height:32px;padding-top:0;padding-bottom:0}
#urppp-settings-panel .urpppp-row textarea{min-height:84px;resize:vertical;line-height:1.45}
#urppp-settings-panel .urpppp-switches{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 8px}
#urppp-settings-panel .urpppp-switches .urppp-set-follow{width:auto;min-width:0}
#urppp-settings-panel .urpppp-tip{font-size:12px;color:var(--text-muted,#98a2b3);line-height:1.55;margin:6px 0 0}
#urppp-settings-panel .urpppp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
#urppp-settings-panel .urpppp-status{margin-top:8px;font-size:12px;color:var(--text-secondary,#667085)}
#urpppp-batch-hud{
  position:fixed;right:12px;bottom:72px;z-index:2147483000;
  background:var(--surface,#fff);color:var(--text,#111);
  border:1px solid var(--border,#e5e7eb);border-radius:14px;
  padding:12px 14px;font-size:12px;line-height:1.5;max-width:280px;
  box-shadow:0 10px 28px rgba(15,23,42,.12),0 0 0 1px color-mix(in srgb,var(--border,#e5e7eb) 60%,transparent)
}
#urpppp-batch-hud .urpppp-hud-title{font-weight:700;margin-bottom:6px;font-size:13px;color:var(--text,#111)}
#urpppp-batch-hud .urpppp-hud-line{color:var(--text-secondary,#667085)}
#urpppp-batch-hud .urpppp-hud-course{margin-top:4px;color:var(--text,#111);font-weight:600}
#urpppp-batch-hud #urpppp-batch-hud-stop{
  margin-top:10px;height:30px;padding:0 12px;border-radius:10px;cursor:pointer;
  border:1px solid var(--border,#e5e7eb);background:var(--input-bg,#f8fafc);color:var(--text,#111);font-size:12px
}
#urpppp-batch-hud #urpppp-batch-hud-stop:hover{
  border-color:var(--primary,#3b82f6);background:color-mix(in srgb,var(--primary,#3b82f6) 10%,var(--input-bg,#f8fafc))
}
#urpppp-eval-wait-tip{margin-left:10px;font-size:12px;color:var(--text-secondary,#667085)}
#urppp-settings-panel .urpppp-status.ok{color:#15803d}
#urppp-settings-panel .urpppp-status.err{color:#b91c1c}
#urppp-settings-panel .urpppp-sub{font-size:12px;font-weight:700;margin:10px 0 4px;color:var(--text,#111)}
#urppp-settings-panel .urpppp-entry-sec{margin-top:4px}
#urppp-settings-panel .urpppp-entry-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#urppp-settings-panel .urpppp-entry-grid .urppp-set-btn{
  width:100%;height:36px;justify-content:center;font-weight:700
}
#urpppp-subpanel{
  position:fixed;z-index:13070;display:none;box-sizing:border-box;
  background:var(--surface,#fff);color:var(--text,#111);
  border:1px solid var(--border,#e5e7eb);border-radius:16px;
  box-shadow:0 18px 48px rgba(15,23,42,.18);overflow:auto
}
#urpppp-subpanel.open{display:block}
#urpppp-subpanel .urpppp-sub-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px 10px;border-bottom:1px solid var(--border,#e5e7eb);
  position:sticky;top:0;background:var(--surface,#fff);z-index:2
}
#urpppp-subpanel .urpppp-sub-title{font-size:16px;font-weight:700}
#urpppp-subpanel .urpppp-sub-close{
  width:30px;height:30px;border:0;border-radius:8px;cursor:pointer;
  background:transparent;color:var(--text-secondary,#667085);font-size:18px;line-height:1
}
#urpppp-subpanel .urpppp-sub-close:hover{background:var(--input-bg,#f8fafc);color:var(--text,#111)}
#urpppp-subpanel .urpppp-sub-body{padding:12px 16px 16px}
#urpppp-subpanel .urpppp-sec h3{display:none}
#urpppp-subpanel .urpppp-grid{display:grid;grid-template-columns:1fr;gap:8px}
#urpppp-subpanel .urpppp-row{display:grid;grid-template-columns:108px 1fr;gap:8px;align-items:center}
#urpppp-subpanel .urpppp-row label{font-size:12px;color:var(--text-secondary,#667085)}
#urpppp-subpanel .urpppp-row input[type="text"],
#urpppp-subpanel .urpppp-row input[type="password"],
#urpppp-subpanel .urpppp-row input[type="number"],
#urpppp-subpanel .urpppp-row input[type="url"],
#urpppp-subpanel .urpppp-row select,
#urpppp-subpanel .urpppp-row textarea{
  width:100%;border:1px solid var(--border,#e5e7eb);border-radius:8px;
  background:var(--input-bg,#f8fafc);color:var(--text,#111);padding:6px 10px;font-size:12px;box-sizing:border-box
}
#urpppp-subpanel .urpppp-row input,#urpppp-subpanel .urpppp-row select{height:32px;padding-top:0;padding-bottom:0}
#urpppp-subpanel .urpppp-row textarea{min-height:84px;resize:vertical;line-height:1.45}
#urpppp-subpanel .urpppp-switches{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 8px}
#urpppp-subpanel .urpppp-switches .urppp-set-follow{
  width:auto;min-width:0;height:34px;border-radius:10px;
  border:1px solid var(--border,#e5e7eb)!important;
  background:var(--input-bg,#f8fafc)!important;
  color:var(--text,#111)!important;
  font-size:12px!important;font-weight:600!important;
  cursor:pointer;padding:0 10px!important;white-space:nowrap
}
#urpppp-subpanel .urpppp-switches .urppp-set-follow:hover{
  border-color:var(--primary,#3b82f6)!important
}
#urpppp-subpanel .urpppp-switches .urppp-set-follow.ac{
  background:var(--primary,#3b82f6)!important;
  border-color:var(--primary,#3b82f6)!important;
  color:#fff!important
}
#urpppp-subpanel .urppp-set-btn{
  height:34px;border-radius:10px;border:1px solid var(--border,#e5e7eb);
  background:var(--input-bg,#f8fafc);color:var(--text,#111);
  font-size:12px;font-weight:600;cursor:pointer;padding:0 12px
}
#urpppp-subpanel .urppp-set-btn:hover{border-color:var(--primary,#3b82f6)}
#urpppp-subpanel .urppp-set-btn.ghost{background:transparent}
#urpppp-subpanel .urpppp-tip{font-size:12px;color:var(--text-muted,#98a2b3);line-height:1.55;margin:6px 0 0}
#urpppp-subpanel .urpppp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
#urpppp-subpanel .urpppp-status{margin-top:8px;font-size:12px;color:var(--text-secondary,#667085)}
#urpppp-subpanel .urpppp-status.ok{color:#15803d}
#urpppp-subpanel .urpppp-status.err{color:#b91c1c}
#urpppp-subpanel .urpppp-sub{font-size:12px;font-weight:700;margin:10px 0 4px;color:var(--text,#111)}
`;

  // src/userscripts/urpppp.entry.js
  (function() {
    "use strict";
    const URPPPP_VERSION = "1.3.3";
    const URPPPP_RAW_URL = "https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js";
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
      setBatchState
    } = config;
    function settingsStyles() {
      if (document.getElementById("urpppp-assist-style")) return;
      const st = document.createElement("style");
      st.id = "urpppp-assist-style";
      st.textContent = assist_default;
      (document.head || document.documentElement).appendChild(st);
    }
    __name(settingsStyles, "settingsStyles");
    function setStatus(id, text, type) {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = text || "";
      el.className = "urpppp-status" + (type ? " " + type : "");
    }
    __name(setStatus, "setStatus");
    function syncToggle(btn, on, onText, offText) {
      if (!btn) return;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? onText : offText;
      btn.classList.toggle("ac", !!on);
    }
    __name(syncToggle, "syncToggle");
    const login = createLoginAssist({
      config: { loginConf, beginLoginProcess, markPendingAutoLogin, resetLoginGuardState },
      storage: { getBool, setVal },
      deps: {
        constants: { LOGIN, LOGIN_FAILURE_LIMIT, DEFAULT_OCR_EXAMPLE },
        escapeAttr,
        getBase64FromImage,
        log,
        loginGuardStyles: assist_login_guard_default,
        recognizeCaptchaWithRequest: recognizeCaptcha,
        recognizeLocalCaptcha,
        setInputValue,
        setStatus,
        sleep,
        syncToggle
      }
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
          escapeHtml: escapeAssistHtml,
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
          sleep
        }
      }
    });
    const update = createUpdateAssist({
      deps: {
        URPPPP_VERSION,
        URPPPP_RAW_URL,
        compareStandaloneVersions: compareVersions,
        parseVersionFromSource: parseUserscriptVersion
      }
    });
    const panel = createAssistPanel({
      login,
      evaluation,
      deps: {
        URPPPP_VERSION,
        settingsStyles
      }
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
      updateBatchHud
    } = evaluation;
    const { injectSettingsPanel, watchSettingsPanel } = panel;
    const { registerAssistUpdateChecker } = update;
    try {
      GM_registerMenuCommand("URP++辅助：打开设置说明", () => {
        alert("请启用 URP++ 主脚本，点击顶栏齿轮，在设置底部配置「登录助手」「评教助手」。");
      });
      GM_registerMenuCommand("URP++辅助：立即识别登录验证码", () => {
        resumeAutoLogin();
      });
      GM_registerMenuCommand("URP++辅助：立即处理当前评教页", () => {
        runEvaluationAssist({ force: true, forceSave: true });
      });
      GM_registerMenuCommand("URP++辅助：启动全自动评教", () => {
        startFullAutoEvaluation();
      });
      GM_registerMenuCommand("URP++辅助：停止全自动评教", () => {
        clearBatchState();
        updateBatchHud();
      });
    } catch (_) {
    }
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
        stopFullAuto: /* @__PURE__ */ __name(() => {
          clearBatchState();
          updateBatchHud();
        }, "stopFullAuto"),
        injectSettings: injectSettingsPanel
      };
    } catch (_) {
    }
    (/* @__PURE__ */ __name((function waitRegisterUpdate() {
      let tries = 0;
      const tick = /* @__PURE__ */ __name(() => {
        if (registerAssistUpdateChecker()) return;
        tries += 1;
        if (tries < 80) setTimeout(tick, 250);
      }, "tick");
      tick();
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#urppp-nav-settings") || t.closest("#uc-settings") || t.closest(".urppp-nav-settings")) {
          setTimeout(() => {
            try {
              registerAssistUpdateChecker();
            } catch (_) {
            }
          }, 30);
          setTimeout(() => {
            try {
              registerAssistUpdateChecker();
            } catch (_) {
            }
          }, 200);
        }
      }, true);
    }), "waitRegisterUpdate"))();
    watchSettingsPanel();
    const hasZhjwLoginForm = !!(document.getElementById("input_username") && document.getElementById("input_password") && document.getElementById("input_checkcode"));
    const maybeLogin = hasZhjwLoginForm || /\/login/i.test(location.pathname || "") || /login/i.test(location.href) || /统一身份认证|frontend\/login/i.test(document.title + location.href);
    if (maybeLogin) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mainLogin);
      else mainLogin();
    } else {
      clearLoginGuardAfterSuccess();
    }
    if (isEvaluationPage()) {
      markEvalPageEnter();
      installSaveSuccessWatcher();
      const boot = /* @__PURE__ */ __name(() => {
        markEvalPageEnter();
        ensureWaitTip();
        updateBatchHud();
        const batch = getBatchState();
        runEvaluationAssist({ force: !!batch.active, forceSave: !!batch.active });
      }, "boot");
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 500));
      else setTimeout(boot, 500);
    }
    if (isEvaluationListPage()) {
      const bootList = /* @__PURE__ */ __name(() => {
        updateBatchHud();
        resumeFullAutoOnList();
      }, "bootList");
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(bootList, 600));
      else setTimeout(bootList, 600);
    }
  })();
})();
