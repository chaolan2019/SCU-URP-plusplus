// ==UserScript==
// @name         SCU URP++教务系统辅助插件
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.5.3
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
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      cdn.jsdelivr.net
// @connect      gh-proxy.com
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
  var SESSION_KEYS = {
    keepAliveEnabled: `${ASSIST_NAMESPACE}_session_keepalive_enabled`,
    keepAliveInterval: `${ASSIST_NAMESPACE}_session_keepalive_interval`,
    keepAliveUrl: `${ASSIST_NAMESPACE}_session_keepalive_url`,
    autoSend2fa: `${ASSIST_NAMESPACE}_session_autosend_2fa`
  };
  var DEFAULT_KEEPALIVE_URL = "/student/courseSelect/thisSemesterCurriculum/index";
  var DEFAULT_KEEPALIVE_INTERVAL = 8 * 60;
  var LOGIN_FAILURE_LIMIT = 3;
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
    function guardKey(kind) {
      return LOGIN_KEYS.guardState + (kind ? ":" + kind : "");
    }
    __name(guardKey, "guardKey");
    function getLoginGuardState(kind) {
      const raw = getJSON(guardKey(kind), {}) || {};
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
    function saveLoginGuardState(kind, state) {
      const next = Object.assign(emptyLoginGuardState(""), state || {}, { updatedAt: now() });
      setJSON(guardKey(kind), next);
      return next;
    }
    __name(saveLoginGuardState, "saveLoginGuardState");
    function resetLoginGuardState(kind, identity) {
      return saveLoginGuardState(kind, emptyLoginGuardState(identity));
    }
    __name(resetLoginGuardState, "resetLoginGuardState");
    function loginIdentity(_kind, username) {
      return String(username || "").trim();
    }
    __name(loginIdentity, "loginIdentity");
    function ensureLoginGuardIdentity(kind, username) {
      const identity = loginIdentity(kind, username);
      const state = getLoginGuardState(kind);
      if (state.identity && state.identity !== identity) return resetLoginGuardState(kind, identity);
      if (!state.identity) return saveLoginGuardState(kind, Object.assign(state, { identity }));
      return state;
    }
    __name(ensureLoginGuardIdentity, "ensureLoginGuardIdentity");
    function beginLoginProcess(kind, username) {
      const identity = loginIdentity(kind, username);
      const state = getLoginGuardState(kind);
      const pending = state.pending;
      const fresh = pending && pending.createdAt > 0 && now() - pending.createdAt <= LOGIN_PENDING_TTL;
      const continuesPreviousAttempt = fresh && pending.identity === identity;
      if (!continuesPreviousAttempt) {
        try {
          console.log("[URP++辅助][guard] reset 新attempt", kind, identity);
        } catch (_) {
        }
        return resetLoginGuardState(kind, identity);
      }
      state.identity = identity;
      state.pending = null;
      state.failures = Math.min(LOGIN_FAILURE_LIMIT, state.failures + 1);
      state.paused = state.failures >= LOGIN_FAILURE_LIMIT;
      try {
        console.log("[URP++辅助][guard] 失败+1", kind, identity, state.failures, "paused=" + state.paused);
      } catch (_) {
      }
      return saveLoginGuardState(kind, state);
    }
    __name(beginLoginProcess, "beginLoginProcess");
    function markPendingAutoLogin(kind, username) {
      const state = ensureLoginGuardIdentity(kind, username);
      state.pending = {
        kind: String(kind || ""),
        identity: state.identity,
        createdAt: now()
      };
      return saveLoginGuardState(kind, state);
    }
    __name(markPendingAutoLogin, "markPendingAutoLogin");
    function clearLoginGuardAfterSuccess(kind) {
      const state = getLoginGuardState(kind);
      if (state.failures || state.paused || state.pending) {
        try {
          console.log("[URP++辅助][guard] 清成功", kind, state.failures);
        } catch (_) {
        }
        resetLoginGuardState(kind, "");
      }
    }
    __name(clearLoginGuardAfterSuccess, "clearLoginGuardAfterSuccess");
    function resetAllLoginGuard() {
      ["zhjw", "cas", ""].forEach((k) => {
        try {
          console.log("[URP++辅助][guard] 重置全部", k);
        } catch (_) {
        }
        resetLoginGuardState(k, "");
      });
    }
    __name(resetAllLoginGuard, "resetAllLoginGuard");
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
    function sessionConf() {
      return {
        keepAliveEnabled: getBool(SESSION_KEYS.keepAliveEnabled, true),
        keepAliveInterval: Math.max(60, Math.min(3600, getNum(SESSION_KEYS.keepAliveInterval, DEFAULT_KEEPALIVE_INTERVAL))),
        keepAliveUrl: (getStr(SESSION_KEYS.keepAliveUrl, "") || "").trim() || DEFAULT_KEEPALIVE_URL,
        autoSend2fa: getBool(SESSION_KEYS.autoSend2fa, true)
      };
    }
    __name(sessionConf, "sessionConf");
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
      resetAllLoginGuard,
      evalConf,
      getBatchState,
      setBatchState,
      clearBatchState,
      sessionConf
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

  // src/assist/scu-id-v3-model.json
  var scu_id_v3_model_default = { v: 1, chars: "23456789abcdefghjklmnpqrstuvwxyz", tpl: "AP////8A////////AAAAAAD/AAAAAAD/AAAA//8AAAD/AAAAAP//AAAA////////TgD/////AP///////wAAAAAA/wAAAAD//wD//////wAAAAAA/wAAAAAA/////////04CAgIC/wICAgL//wIAAP39/wIAAP0C/wAA/QAC/QD9/f/9/f39///9/f0CAgIC/wJY/P/////8//////////8AAAAA//8AAAAA/Pz/////AAAAAAD/AAAAAAD/////////TgAC////AAIC/////wL/AAAAAP//AAAAAP39//////39AAAA//39AAAA/wL//////1j///////////////8AAAAAAP8AAAAA//8AAAD/AAAAAAAAAAAAAP8AAAAA//8AAABOAAD///8AAP//////AP8AAP//AP//AP8AAAD///8A//8AAAD///8AAAD/AP//////WAAA//8AAAD/////////AAAA////AAAA/wD//////wAAAAAA/wAAAAD//wD/////AFgAAAD/AAAAAAD/AAAAAP8A/wAAAP8A/wAAAP8A/wAA//////8A/////////wAAAP9s/f////8A/////////f0AAP3//f0A/f8C/f////8C/f0AAAD//f0AAAD/////////TgAA/////wAA//////v/AAAAAP//AAAAAP//AAAAAP//AAAABP//AAAABAAA/////1j//////wD//////wD//wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///////wBi///+/v7+///+/v7+//8AAAAA//8AAAAA///+/v7+//8AAAAA//8AAAAA///+/v7+Tv//////////////////AAAAAP//AAAAAP//////////AAAAAP//AAAAAP//AAAAAEUAAP////8AAP////8C/wAAAAD//wAAAAD//wAAAAD//wAAAP3//wAAAP0AAP////9i//8AAAD///8AAAD///8AAAD///8AAAD///////////8AAAD///8AAAD///8AAAD/YgAAAAD//wAAAAD//wAAAAD//wAAAAD//wAAAAD//wAAAAD//wAAAAD///39/f//AjD//wAAAP///wAA/wD//wD/AAD//wD/AAD///8AAAD//wD/AAD//wD//wD//wAAAP9i//8AAAAA//8AAAAA//8AAAAA//8AAAAA//8AAAAA//8AAAAA//8AAAAA////////Tv/+AAEA/v/+AAEA/v7/AAAA/v4B/gD/AP4B/gD/Af4B/gD/Af4B/gD/Af4AAf4BAYD//wAAAP///wAAAP////8AAP////8AAP///wD/AP///wD//////wAA/////wAAAP9i//////8C//////////8AAAD9//8AAAD9//////////8AAAAA//8AAAAA//8AAAAATgAA//8CAAD/AgD/Av8CAAAA//8CAAAA//8CAAAA/wD/AgD/AgAA//8CAAAAAAD9/2D/////BAL//////wT//wAA+wL//wAA+wL//////wT//wD7AAD//wD7+wD//wAAAPtiAP////8A//////////8AAAAA//8AAAAAAAD/////AAAAAAD/AAAAAAD/////////Rf///////////////wAAAP8AAAAAAP8AAAAAAP8AAAAAAP8AAAAAAP8AAAAAAP8AAGL//wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP8A//////9Y//8AAAD/AP8AAAD/AP0CAAL9AAD/AP8AAAD9Av0AAAD9Av0AAAD9Av0AAAAA/wAAdf8CAP0AAv0CAP0AAgD/AAAA9AD99AAN8gD99AAN/QD99AAN/QD99AAN/QAA/QL9C5L//wAAAP8A/wAAAP8AAv0A/QIAAP/9/wAAAAL9AgAAAP/9/wAAAP8A/wAA/QACAP1i//8AAAD/AP8AAAD/AAD/AP8AAAD/AP8AAAAA/wAAAAAA/wAAAAAA/wAAAAAA/wAAav3//////f///////wAAAAD8/wAAAPz9AwAAAP8CAAAA/QAAAAD9/wAAAP3///39/U4=" };

  // src/assist/ocr-local.js
  var CHAR_W = 6;
  var CHAR_H = 8;
  var FEAT_DIM = CHAR_W * CHAR_H;
  var FEAT_DIM_WITH_AR = FEAT_DIM + 1;
  var AR_WEIGHT = 25;
  var MAX_ASPECT_RATIO = 2;
  var LINE_R = 111;
  var LINE_G = 110;
  var LINE_B = 112;
  var LINE_TOL = 10;
  var QUANT_STEP = 8;
  var WHITE_THRESHOLD = 250;
  var IMG_W = 80;
  var IMG_H = 26;
  var CHARS = scu_id_v3_model_default.chars;
  var TEMPLATES = (() => {
    const bin = Uint8Array.from(atob(scu_id_v3_model_default.tpl), (c) => c.charCodeAt(0));
    const ts = [];
    for (let i = 0; i < CHARS.length; i++) {
      const t = [];
      for (let j = 0; j < 49; j++) t.push(bin[i * 49 + j] / 255);
      ts.push(t);
    }
    return ts;
  })();
  function loadRgb(image) {
    const canvas = document.createElement("canvas");
    canvas.width = IMG_W;
    canvas.height = IMG_H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, IMG_W, IMG_H);
    ctx.drawImage(image, 0, 0, IMG_W, IMG_H);
    return ctx.getImageData(0, 0, IMG_W, IMG_H).data;
  }
  __name(loadRgb, "loadRgb");
  function isLineColor(r, g, b) {
    return Math.abs(r - LINE_R) <= LINE_TOL && Math.abs(g - LINE_G) <= LINE_TOL && Math.abs(b - LINE_B) <= LINE_TOL;
  }
  __name(isLineColor, "isLineColor");
  function segmentByColor(rgba) {
    const len = IMG_W * IMG_H;
    const pixels = [];
    for (let i = 0; i < len; i++) {
      const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
      if (isLineColor(r, g, b)) continue;
      if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue;
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
      let x1 = IMG_W, y1 = IMG_H, x2 = 0, y2 = 0, n = 0;
      for (let i = 0; i < len; i++) {
        if (labels[i] !== c) continue;
        const x = i % IMG_W, y = i / IMG_W | 0;
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
    const cw = box.x2 - box.x1 + 1;
    const ch = box.y2 - box.y1 + 1;
    const feat = new Float64Array(FEAT_DIM_WITH_AR);
    for (let sy = 0; sy < CHAR_H; sy++) {
      const srcY = box.y1 + Math.min(ch - 1, Math.floor(sy / CHAR_H * ch));
      for (let sx = 0; sx < CHAR_W; sx++) {
        const srcX = box.x1 + Math.min(cw - 1, Math.floor(sx / CHAR_W * cw));
        const i = (srcY * IMG_W + srcX) * 4;
        const gray = (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) / 255;
        feat[sy * CHAR_W + sx] = gray < 0.7 ? 1 : 0;
      }
    }
    feat[FEAT_DIM] = Math.min(1, cw / Math.max(ch, 1) / MAX_ASPECT_RATIO);
    return feat;
  }
  __name(extractFeature, "extractFeature");
  function classify(feat) {
    let best = 0;
    let bestD = Infinity;
    for (let c = 0; c < TEMPLATES.length; c++) {
      const t = TEMPLATES[c];
      let d = 0;
      for (let i = 0; i < FEAT_DIM; i++) {
        const dd = feat[i] - t[i];
        d += dd * dd;
      }
      const ar = feat[FEAT_DIM] - t[FEAT_DIM];
      d += AR_WEIGHT * ar * ar;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    return CHARS[best];
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

  // src/assist/zhjw-model.json
  var zhjw_model_default = { chars: ["2", "3", "4", "5", "6", "7", "8", "a", "b", "c", "d", "e", "f", "g", "h", "i", "l", "m", "n", "o", "p", "r", "s", "t", "w", "x", "y"], arch: "tiny-ds-int16", layers: [{ type: "conv", name: "stem", dtype: "int16", out_c: 16, in_c: 3, k: 3, groups: 1, w: "ehfpIajzExzI+T0WBPyiQH8y6dFMKSsSrwdu/Xcj1f1nKxcIFuCy+LbVYO+c3mgQxuLx3uXXNPCGE/fQbkY83SVBrStG/GcZhR21MKcRQewRCbzyqzo1P3IPxc57Dwv+3vbCylG34beOuJUIDTNiUIpNQxn/f5zh/xDguuYczdDeHJ3zC1GCzS7RZcXkXMsi2DMuhcOECpk+vX8/WwhPJOSna8wCE6jeNksh8FcxE+LO1AYGCg/2yk8bt0ycvDnMcFovyRO7psDr0RoVNCLp53AQevwr7sLwz9xq6vUunAWKDFfjU+Ao+UwPSdBM7CrsDvEF6WQBX9KF4mnqbABR7VMqdQiVKEgXw/MiMMwF3uJHxdzGQP257mQCQdzPMresN+WP/fshiRAtLO++FBZa6sfZZ9p2RjPsZQBFHEUc+tm3U5gcVgK3i+4qSBjb3QhpEkjv5PHedr6sBdfRkbt/ttaTQERPZ9ykzDBuM9UBFAgHYyFb5PLEzy8BMAzZ7Kba6y2WJaLhwPvD9vndgyYYGrK5l/WBKoAG5gtCzEi3hrK72ZQNyiM7+c23JOQN7BktMR6hBZoUAfRL4sMbMNAV5Lyl8Eq0VaQaaeV40Ey1aBsNBRgDiyIpGpoEZASMBNnovkk0GSYegtso3cfeh7KEEH75BkV1Ehvfnu+6pdziI5ZAISPAOUvKbcZuuwAsdjYIIjSTS5MTjNQ9y5CplBIAgK4msD/nWZwDEK6AIaFPgoOqwVTAw/kw10oEd+g9uSx2pm/PF5JBhPTH0Wzl1yyOzrC5as8t3lXtyf/O5tb3lNRvvrQ//rhgEDHpSQUTPcQuTbhZG1xIqxC2PeNqVPw/28HsJP5BHGcavwIi8ATloepu5G3xaAVb+NHeZPQOCevRpQDJADbeZe8/8VPu1v0q9Wb3MARjM3kHie/EC20Hiu98EjAWEbUsCaAizfdh4G4+zr2ixxnG2/XrHlQPPQNU07PMCgE2M0UzhuKY+tnKX92+A/UqT01m5HAsi+p4PNk6sf06Zgb38O8WPMzgxfdG5mYU2wclHi/18L3F+1njA9QX0Mnuvc1U4KjcmsHmszbtovCmJ4rxe/STPfoEbiniwTfU6DJm5rXOPw5N6zi/OENvQp4d8RUm5igNCvoHCdEA", w_scale: 5233220508671366e-20, w_zero: 37, b: "wMrA/HoMgl81Bi0FnLv/fwCAAc2BGGGKvlhGSxQLBvE=", b_scale: 58820503909373656e-21, b_zero: -10713 }, { type: "conv", name: "ds1_dw", dtype: "int16", out_c: 16, in_c: 1, k: 3, groups: 16, w: "AuWAYaP4YmC8E9RB/jAYQrMXPEUkFgZayHpoDRbK/38TY3LN3OOfm2CUdzAOLoMIefztWeUjR+DLH5gXFR1azUAh3Pry5fQCFWagZKs+DVrJYbMSHO2KJNj6a81D7AErwjZGAT7mwA0y14zIJzwxBh1Y011SL9sj/xdKOkEjGfKALexZogWt/CT0TOfvFFFClUGWIYa6wvbF9bLothP/sCYiMr/XwzLQEE57vLE8SgjCCpo89gdwKMdFUc0BJpcUfT9TH8wyfdESEmttfVlzJEvXqCbm/6xUlr134tr0mQ2xbAcjFSakTeZMd9qp7F8psQ+UQgYGRd9oN3oRFiQYZjE/3z1B+Iq9KsporgCAhAdBtt3OxvRUsu3EnDtdb64A", w_scale: 14786603060201742e-21, w_zero: 3442, b: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", b_scale: 0, b_zero: 0 }, { type: "conv", name: "ds1_pw", dtype: "int16", out_c: 32, in_c: 16, k: 1, groups: 1, w: "AdV6+gCyOuqbHh7Twg+WKZXpTAuwtaG/yQsdFlIbx1Rk61v+1+jNztIIfrOXJYTsfvMvIN3PlPLB9vvVEthY7TtCNCX+N0Thm9qmGZwdwukhEdHCZ/w7BS/snP5ouvLakexH1mztiQ3842kVYNSW21EsphuQ+9v3BdwGyVPAqfPi4xytykFvJJ+lMQnEF5v7rrqJz8c91eMuQP3p4CQCJpz5AcWk4gMa49fiFAPQkC82DUTxBv2z+xgO9r+j9S4KuzVwIXXOIgikASbyQMlXzmELffAC360Tkt1UHxXbsf2n0cbq9RSRJ8QLcxbcEK0Y0BgaK/byfEDxGsHPL+oqzLLZAID0XwkU97tiFgzo4Q8yAV6xKzGB5kEhsKZU0rvhoLsgHCk2EyCYtOQQUxVSmuuobbk6LnTM59O6+y4i8SkrqRKolRcqKhj72Qt2/kZBqt5u1dpXQumL4F4nSh71AzPRaej/f3HYnBTIJ8vcQ+DMzmD6TMgYy+GsDxkX8427v9bGIx7s7yt614DV7uWv9F3haAzKAfn68w44/kstuDBd0N7BzQuTBvrmuilM09Yq9RAM0rAhN87D8fP4pu/9LZD+vhaTuoYN2QEGmJ0ZHSk6V7Pd2tGw9LX69Tw3Nh/1kf+gPpjrcB3kHpNXB8hlzNEGmhfQNOO6jDCpzKJSQP5UwJekkL/zWci/Mx2lGheyG7Z5jZjGopk857oeSQ7e3zhM7VnQBLTYcNupBk3QNPp2DIg8kToLY/YiyAqCXEjpagExSslYUSlg7BWj+PZkTHMtj+8u+5LPpTSvDEE88NYm8Lj9LBgEAl07+yEGKMP7CqiyB7j/4cZOFVTeDzhcGp7b+qcc9pvqAjiTLHsQ2+O1GgEQkfJm6zfsycRX6EYjhDYDHiMZzOq27Xr7Vuuc9eO2XhO/yWvxOjXXFjskwg3yxI/yKDiC4xm8Tf4r6NHsVd2ZEbj/18rNsCryR8hv3+bJlCm2yTjN5c8F81/VtPKtGnIVujOvqmTV3dj9PPr55JiNv0vCB/tvz1ZTNB866MvSuPiwDWYZhxEe5KBVh9OQ9bUuzjE0ag0wmPRsTqg5DsgHAkPAl8ERSvXwvAz1Ro3UYL6ZSxXgV/h2CZ/riMwLIxvkkOTHEn664+MV0vvimQSWA4Q94Mx+2t7uAfnLHTDVKuZ8I4IPDreUy9/RVMv9D0T9VSZ1380IzsmEIUn1+wpq5iLzwh5SKRP26AaM+6aBxxV+Q38QF5mq5ekXo0Lx6b/iOkdn1uO9+SQtU9fdvP228vW8ltKRyds5YT9TLL7xIA0t7tjrkCFtKf9bPS4dGYsxw+VlAfj3ceZCz93kWMvI4ZLVLtxLBToG4xDiCg==", w_scale: 4817063745576888e-20, w_zero: -806, b: "cOyEnACA22YWT85Jp9da6Hlw2To9Ma4/JyT/f8umlQyqZJCnoZ/qrydGRcmUYA4+ZE48k6ZS28w5hbtX2gp9zA==", b_scale: 43141113565070555e-21, b_zero: -6799 }, { type: "conv", name: "ds2_dw", dtype: "int16", out_c: 32, in_c: 1, k: 3, groups: 32, w: "0MkhosoZbDnPnJbqb0+G82eWv1FrKdMtMsUXMBC2XEVo++4hiTRBCULcOipUzfWbRhd7UbvFXxsazCdG8kvCH7DbCLhID4PO/UIyy0Lx/3/wQ/8TVd1OZHcA67uVUXmcKuepOJW2Xsw+BXzkvtPPm6YCiskY3FSeoDhjAA6RkicvCP4BHNF0D9h8KCGbqDs7fPsSTDcw4i7HpOlIzcuhEsvh6ta7HY/4w/ueIadN7RcgPQc+/UQx59rYpCPoscqzcfTAuxzsaOx/LLlepeaKMOE2pL2tpJCfzuy52+MC6bg+sEPNOLcpWQzyLNoCLCzwPC7ERIBQ9sCMVRZRb+BLL1k/fOtF8oPr0JuIB4sUyeW7OdXJ1D8BdQ4uudQ4KkP9DOtHG307HOTGMiUzdP4USGfAGfNXDlrBQCqu8gCAkfEl1qIPCvfApPbn0uQHyIND+9u2R4AfUK6jDjY5j9JiqWFBqWJXsqowlfEmgXz0fwqN7l4gdaypNchXAilaH5r/YbDL1R8H6Ly1rjJHmFdgwOUMQCuuVig8p1Em6rEilljxwWyfbCxQKI63lRLtCdcUO723IfMuOLMS+oYboyJvQLIjrfqAbNfdDNmuDDzB2Prft6TsrhCLAeqh34siElJLo7JtDt63Gu6HT2JTEMurN8ghIfWUUS3yEN18wCwOnP427+PKec6l+6mcEux18a+7q+8f/J9E++rbymdB8w8u3qutfhLXn+P51DY5oFy+VcMzZqlHpOkHZBr2jMq3UDkj", w_scale: 13835260688210838e-21, w_zero: -817, b: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==", b_scale: 0, b_zero: 0 }, { type: "conv", name: "ds2_pw", dtype: "int16", out_c: 64, in_c: 32, k: 1, groups: 1, w: "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", w_scale: 4221142080496065e-20, w_zero: 1908, b: "vDP50VhP3x4BysBMmUToAfNsUhaM/rEAZQYa1rwfUOVqbGCmjvA8JEO/8xQSDkhffWahof9/WQEvKPsmGNUo+McKWiw/4tzLBSv4uKA9rel1z7noAd+p/07L+GII+Bjy/MxZE0NBxrb+Zr+kHsU+845Bud6Q2wCAc/lqFS0r81I=", b_scale: 629444548394531e-19, b_zero: 784 }, { type: "conv", name: "ds3_dw", dtype: "int16", out_c: 64, in_c: 1, k: 3, groups: 64, w: "pz5+w5UsxOYtY56mzx/ZtEEvevnIGA+3nyshmuiqywRvvtyyyKlNxgIXClH4SZcT9sT2xaNBoa3T9TuQKslb+DDeTBFDCULghfyfDXEdzFZuYK3GCLBtApj2JlKqU4kpZNly9TRbkPU7zCIJHJ8qv4gvUMzWIp7F3G37DDEn7hno9WDRSMNApYIhycQj3gChLRI8zlrAmuzImzHqEbmWHR28dxvbFNHIay5YWNXxsttULqdaqzwXm6jJb7j6tZDh2gOgJka00a/NvMWwUUKx8gW9aPNNwDPbKifBJk47YP6WqzW8mkyvx9EbaeHRVsxII9iFqR/vAdVw/2wYwSa32zHWJLaUnAL7QNcJ2WjPOcvuVMYXjjP/fynG4LyF3P3l+wgjNFjHiKFAQEWxm9Z2JujJAQ4VOItEigHgqScmFmGukxPjDK8ut8oNtSQN+VGTdgzkJW72Qt1Sx3hKALtNrmo0g936KXPXr++g0wo/pkCECtEWwMNaqRridPMXG/U6MRR4173DeQKyn+n13z4pFiVDdxNOwt/EGL9MD3cpXquWIonmqzSj2SoyTUT/Sik23/PCPVjK1PyqKoFI7+r5OiVgVSacIx/iCygGDw5JvQF81HKQh0wy7qBFMM+qtpTm4sSeERnlMeQENntE66TEqdMuasY/73LKHf1U2Mzq4ubPvcS01vo+H0/pNv9ZM7Q95+Wczy8KQSKTsj6lDw21ba+i083g1Nimj73MHaIo7NjWzmPClvsAgHa8Tuwx+TgpseyLFqI30v6LNbEdtPlPQ/JN9vKgceU1uxmoUnfqzw65vnNIN0VJrUWfmcXJ3k8k3PnWuZ885gUg7OWypgdyn8D+6wyf5tkFSgZDOeE+PbdPrPO2ku3OKVnITJgh3ogFBvFZtx4E0zAuYWn/Bxs9mWNHPJlArCIgmfp5P2OxISySRtVBbVVk6LXEUkFGB7K/jR553h3LfjNS4V+fxyEGRlw4AvLctByr6Fpm5zXffWZER4nCtOkNr1sJRJYFqa3DqTKcTVsf/UfGtnnPVukIH4UabCV2sr4dyLZa1xjMD90z1PA48eMIGH5nnSMmOaIuLUKTItg7vLZ2vtInFhOgEf7BnkgZLmb1wyr++ECWxR7tyUSgiWNwRm7/iA9W36f5KcV0zJ8OuhT/A+Udt0jLSvENottQ82vjY6w15rKtN6PtzRk84dr25KkG2mmbDNSsL1dGsiv6yWG/Xz/Jk86JOK41OspUwRPRf/99CuA+FeIooNrZNaVU6WpD+dhF9R2+mMSzhC7QD+WhD8A3UVBzPG1ChRAWP1Tw3jNnsZfKxQCPz2gYj06cVJEu0eU+7s7k6g3r2kIgEEqFDJpb3SCPSCIqvuaSNluwptQwXj08QupKW40meRi/Y5vvQufQVUcSFOVtA6lXKCczzH7NX/Beq+z85cJS/m/xG9PGbbwPYwHxuPf4ZyLVUO3rmd/DtJAChVW1SUwo6GA4XyASXwIfKOTQlAw2AuOhefhTwWy3wkMOZ3Hyfi0K8O0IK/tv9xDu", w_scale: 13999787370266858e-21, w_zero: -517, b: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", b_scale: 0, b_zero: 0 }, { type: "conv", name: "ds3_pw", dtype: "int16", out_c: 64, in_c: 64, k: 1, groups: 1, w: "NuU7/fXPDghkxVsR9ySd08IYSs/e90Hyd9hAwmQzDjIjIGHBRTAlDvIu+wSZ2AMRJNvh5dMuZN4/vqERQtnIB88usd2M2BDMIUJM7n4rqPkKMZUmgNWH66siawY17lD04sU4FBUC5/pAvIju3+GD6tQQE9oT5wfcjvBWFG4nIj3G5wz1dCRR4woN9PtT+1LXy8XNJXInD8cK8fPNe/+z8dUm2+EB3TkEvTFKvJbiaOat0pMnGcyvIjsEgRV8wPHXZQNsCS9K8RxI+Y5PBeUrFjcjJOZ4wWiY4hSI6HPoBj7B80YIeg8oOtrsTPpR5BTpLTGp87wJOxdLw+LJjB+x52PdS+6R9Ff+5+lwQKLU+ckjCJXrKr4QzdkHB8z3Ghnw0fga/WMk/RD/La34YARLBm/qsM9A+iv1Xt5qtk4VOCL3NRrvIhxH074KoDC39PnnCA4M0THe2c0f2bfPpNp6HkC/lvFqG28gcgk9KDIWpLy5y9AL8S/fyczQpwykQbcvOg4d77WlhVXSx//SmPm27bnp8PdBE1YI/tBKEuLW+zGy6No5pNqC7cckVANB/aYV3dIioW4odxbQ1rkDGhMHLyPTk/qpUg3+xAIM9xkzy9tbHPL7DNtc0g6xY/CyFpfyNwUeBQQBQwe5AvjtUiCMGh1E7RlOLZIgruLW5zbkn/K9yzBC6foFDW8A+gneyH0lEwwLE8jF486B/jD9a/KLHCn5muLgCKPoGBNu8bwWyS6qEJX+YQk9ww0qcAmgDBUbHAYOL+UEEwWWGzPa7xAQvOP5TAt1C7UBXvsUxPPUFf768Uz8/RMq8n0kncWCECj/ViEqMWDI3swEy6Y2FBCY8NgQ974Z/bIW5u1cAgjwuNlI/ecKcwSZ7NoNCytr9jj/i/YLuUT7VgEM4Sjz0ehB9YbH6x4k6TEHzPFIE3L7Zfnm7iobiurN8LIZ9S0B7NvWNQB71/b7x+ODEwENuxjr6hz62Oo+9DT8M8vgy6zUWR+CEeXs18+5+aHYQuDC7lkxQ/Tm6FDNTfv5wsH59vK/wJz3o/ESyHHy7BG2/PT4px/s4tnX+AMm6OvemDcMPxAVkPrm/7/ougfvFNPwaicuAqw0Op8VLzT6edWn7LgG7T0AD5fuhQkgsnK/0MWmlOdTtSVzFuzJbgsjyIz0TCFj//nTrAt88cEUdQN0zT8sWwU86LHPPP5N+h/Bf+dZAd7dXhrGKzQLo0Ezy+jeKthpSjD80O+C2SwiRDb5+4tnF9kG3xXQOfvw9XXuGOxKD1oD3AIE1AwHzT4/+2o64CQeyFeqje4N/8LfLuty8CYjBwr98OrIqirDSffp5OIhGJ4JAQxR8jDaku5W4TYHJfYOAd0IjhHh0Wir+bnY8EnwzDUbBaP9BeYi/vrfhrgS/wvk7uyW/aoaO/o1By0Z/SPi/UkXaqsYynDzXfxHQQ7agvsNDLP8OQfS49nUmvpJ++3j4+SGObIMuW7swm/llatM9Xj/SRno8PLghSxi/hw/2xvP5IHWFynx8mJLIAyhJBbn2cr1CNcwoOl1DYjsCgRy+Fk/+Pj5zo3yiNDq3mMX+B6e8Ob5Gyq/9C8nkQlsEon03xfV5sYjfP2I/yruFeM9uucUffKHGUj6BvNCFkIDItO+7CPLIN1E4of2vc8IIikVEejXFCU+wwOp/Wn56vZq+BXycfBl3aMmzDM4JvPDiDJI8JEA0fuV8/8HwtZOAkcYGASdF67WAOkg2vYeJzT3NBkwMAiJ19fpMwA7Bin0iA2o/13nCBBhEI4ENtop8IMQBwt8EmIFqgvcGlUXlBGfNHwKOt/TBAfglQ4C0kImUyD97a83ftfh3toIzOVC7jzqhB+K9/MXNyYIHgYCbvv5+ooirCep/8UjSNcv6vsvnjAUFw8gSO0B1GH1NCJU40oUp0JK/g/c6r+S8c4z5+ozEvwgaNiG6FQEYASoLca4Uu5nAGgM9RTFwf79dsKJwh/+QfzR0TnX8QcB7ikedSyGJXASuuZoKQvqyS+REu0usgXm3pXfa+2x0zEavQEd5obZe/gUIPPWauS3wHgB0BW+Do8IYQlJJJgDcyA0/j0TJfnL8B/qwCz+DU4Ot+QHK33roie4IyIWnSgZBSLCouuiF4fuNQbE33cRMQwN8esDqO4euIEA2dR+P0nm6wav/uT32iO92FAE1jCRFg4LyUz/GnvzSPyk3/P7iOJNDXvw5QTx4jL9a+Wy2OcIuvO1zK61iQ/47vUAbNNiEib4ujtxIk4DyufaM2ohAP0UAlToNDDk+pv7fPXDJHoModHd38PpOOxiMqYx6QsXE2UiEBgfAe0uhtrG2CDP8ugw9M8Ll+mT5P39zCLgvlwH4sDM8hEXyxHm3u4RzhPOrYvuxQYSEkIGqyfSDIEUTdrfHjEGfQZSNYYA3+fuGJUYb8MoKXEyge8KFt3bp9Tm0WzZ2Q9J558FRtVd9JJZyv1k+ekH/QiDEPTACdJqy83FTz271xDqfyxkDgjTivE69rstgQu+ChDwJuPA6/oTrx1aFSzpUTSN4BcbZOE9OkL2y/zY8ZkDI03hKCYm6/L46kEDw+r+FMflkerzySAz3PpH/H35lxfcDYf8Y9xbHs+/sAtwqaPM0gSWGZIm3cfzEdziMbl1LqEYDxb74Q4Qm9Wm3fH1gQPJBTjy6NbQ9WsA9/lQ7n0XA+Pbui0vp9n+BPwikuWiKHL3ZuujC33qcQxDL9bDqxI/HZICDCWi1JTSVQsK2hbr9gMQ2GQQ6SFH5bMfIspEB9Af3zST/FU8mguVOEckZjL1YIrT+fUb3hkeCP2T+YnuqgEBB/fAufuD0RnVuMSVMiz2JPzl+P7RmCTp75kjvdV0OK0dGvwwCt4r1xjINHcexAhN0EPqjg+r7uTLBZeB9wfQ7PoVDNEB6wVEEHgjaudF2MTsEjmZr2YJs+/mAEY5v/m63FL9MyYRwUro+NEBGf9/KudAGUDquvhQEXH8zPyH+DrsZcA2+iT/ypGXB7D8L/X7CzTho7Me9hnJzveyBxkGHB9NHJk1fFRv/P0mS//tAFLKdRQq38rD8vZVKD3JzROYJIHoiidPDjQuYjoN6679jOdGHqbodBML9qIbxfiB+HP4ngFKAGD6g822DtgevwqNxVobixvl5mUWgAO0BgoCyvTtFLvooQzb/JkVsAx7K1xLa9Q1ALf7OQcZ44IvW8M4IzTYB/P+BtrYUurm3hTrfwvDD0f8oB/25K8Khy4oM8Tg9uvU8FHwkBcvCBqdpswiCaogc+Z0QUXN3MKaFDj7feCt5qb1LwWHARfWr+UT9sz869Kh8jaoWf4TRIoBkwKb8bEFvy7PErAolgTHAPjcSPQy5ijQwBue/Uzk5u/h7l7w4AGC+avqNP5iBHUb/zRr92XovwP378aXfQ08E+3q40PL/2UWZOvg5pEqFB5s5rwL1AI/8M30NibWsNn0GylRG67yPeMhApsooOz3FpUSktTH+3cMru4v6ywFwNXKyUUBXTY36rr6c+a949ondhZVvSrd+v334Io8V0hWF9YICeKX7sfNgEjM+hEDR+l33crj1/o+1oTMxdZNyKrecx7RAFf+KNYt+4Idfwwa4J8DH9TKCe5JEQ/rwubyWSGx/CQaWkeY+6E3AjFRFij3Rs59BMYgXAG/KkcywBu++eAM5QeVBrgRryR3HGm+PeGk3QILVRSYJTssSBm+7w79ptSFzAYoL+lY/SPzzxP99Usd9Gq1DvMWLsBu+frdq/nX6HwOAxAi50sEFl5TI6PVYQBbA5YbLPrVHqHst/o4BugR6hXF4mzJxgjl6pb04RcBKNHboPBYD3EsACdUx+z6Tc+YDEUItgBiBEX7GPUt2rUVZjvHCzj7xzCAH77trPck49j0+hOPz1zIlu/e2Z1ebBg297TTXvmx1ee3WOCKKof/IgLcIXfuowez9V7RqgSk7ojaj+LpEyXb+du/DlHwPeB2AVbthwMzCrgCwAp1uXoKnCD/J90OY+VCMgfqagG44HjjWhLmJvALUySv2eLHaMptNEYh9ucK1QcYxguCEcMVc6D+29HmTQy9ClkAYi7iC9MDU7+m6JFQXv8F4in9ng83IO4n7eB877Q22fo3IGs6dv2c12AdXQ+23TL2TCsY7mQKwf/g2ZjY0wiaDJ4CcO4M5HoZvc6z3GwEMRVXE/M+idpiOgL1vSV7B8HmDfnn+4kAThxdBHX5Xf6k2vX6puRMyRUKE9DCAL32pRwCxdkgT0rw3Mbftd4KAbnvVxBNJQYTPbShE43hhUGgMqfTHB//B0QTdSQ0/EsGAAeVDOzJEyz58I+6KBOq6RoNPN6vE962hP9aE9UUb/bMAYEKoPUN7YO5Py0djHgXhf700yAGoPBUGpDl/fvsEP4arCZc1afSKtTNBfwK5hIB4o5QDR2RAMXQ2gsW8zO6IQt2683ssBkK/+vbXBKr9Nf7XjnJEaYWhfhIq+Ibz/oM9EfhsAQqvHucVKx37oo6b+XnDyQLls/F8rnOk+Pm4l0DDs8wD7gowPCu2o+t6f+hMggB9xVB7lLq6+th7gCAW9lk/RzNvd5fEWsxHvnLFcQAyR0XRd8jPvaVGXbTnetyFqXPweeRy87rfviK7QTduOc6403dwduiE2T0pwH+x3UH9hZLAQ7yEBgxGHP5bxUoAq/7Vdq/70jn2OzyEEvsIDPFHF8xogyeFR35gAT2+YCYs+nuCtXvjxD+B9gyfSkEMQvlfBjiD7Yfmu200D7cBhM/7tPrZ/JeIiveDSUzviDqsvnZuRIKYPcNx0L+3wJsFeTDhhNwI0BDZtQQ1JmpVSrGI9ArndGjITLLbvRL/NMN7ukUJYEJY99kALUO9Tev+BW8HfXjIBIFeBvMCGEVAwmamvcjruqJ6PTcGtfL+IDhUBBw7Gcp2+wKCcbDGeFa89fc7V1+3wkKlygY3Ecv9/FZBUjJvb/n6U3dzu9b6xDOsA1I8src/PZJODjmE/PJ6q4tnADcE64On+TIHeskjBGG5Tnr7QGZGYIDC0TjBNwM/Czt6z4ZgeE/JDf1bc4QuBbgB9Rp9qAJdg8BERwhk/gC8/wy0eFo6bj6xyrswKIJQvAq+Lkl6wN6AJPN+D043BTVHAELBaLlE+Kd6SsJURqBHPX2xSBU+UQbgeq1CK04lvQ66z1Fq64YBHMiN96T+b0HbbHLid2o6NpR1eP+CAJ7C2UyuQ0WFhX4+8auA/HyYAFYyegHsuFG7BicRPrU1OxMlvHm4wYhItk6G0k9TdKZCMQoM+RKLMMRNR2S6jcze/O+E1cWags5udPuj0H2DuHBPgVv7I4sKuhMvl3xgu1j6EbJJhX3MVMD8M7WxNApkwf+y30qR8wcA+A/gCRU9+oPWDpV4ZW0KRf38ZkWfwBknP7VyMqhFXn4tOTsDIo+DvwF5ToP8wGdqGIEe/xRD3mtkv7P/p0unwIG7DXg29zE9XEeQhGT+dAmU/P7KOwEViASKEQHDxOOKMgw/On96Gf6xs0nEwLV+AVX5Ny6GgzzJs/aHcgpCwI9mN5nAigPIzPmJFLfn+fq2yK1hRqR/z7o2Qm0Hu/dZAAg76QfqQ3b4ewKz/LcCIcHKQKRDG/R/zFm447h5OHoD/jB2+2jHtka0OG177U7D+8Zt+EkEAlZ3yDH0818I2790NPp9cYfMh0Q8Uf1Yga6DJMmrahRzeLViLom0X7GVuQZ/wv1hbQkuyL8vPoaEpUUn7ZbEVP4vBTx0xsTyfwyAmwQCxi4L2T9jdEBCiS0Ji/3Bc4FHuX/+pLWIScr6tsh0OTqIBg1NiC+/ebkjB5CKlzXsSFq+KwF5gdh9EIN7NE3yLbfbLeQEMbwXd8djvbY89tTuSkiAfJy/rnhjOGI9+XHJyHAxR3UHs1L1B4By8qq23XXgd/cwPkufgG402LkJLKpFxkSw8rc1/ruJPuYOzXy8t9R5BokjgIdw560u/zU7mzgwwmV5Q8CChJv93HSsNE0FJfmTPuE4ZXefQEVQfHyk/CiKqH9Hfo56JwUUA6LGWLqrhXV4mj+7/KOBCrlABa2KgIE1xws4dE6JPhmHKAB3AaS7lzh3PTb8VA+iEcALRUBFRt9G0QVEu3o+VXcrPnUqgkA4BQs8PI6jgm0B7Ddwx832EzcDvneGjXPQhtr5M8L7dfvGR8FNfA2wbr1xdWgzqg46RXm7ksUFzyk82nmCvUZI3UBtd8Ry00Hpeje+53//dIPGLgCCe18IBPaTuikH+4V2AOUNeQhM/mWD2UfYfdoB+Lw38zX6dAmYudR/Q8SUQy79SDkov013eWlNhtXMoX5thdCXi8R0PVy0PcAKf1c7xfbTO4U30cIFOhdFVnA4lXX2HQN/N+/6KQG3FXN7SrY4h7yLrnxwO56+zkOZumN4vrx2zvEzHslxg4JL+Ln/R8OHu4Dp/We7CEDFvZ51wjqacjN/DwZPOPMVOfMrwAgAV/l4TDKEU7M7BDcB6T6m+6xHQIBQic589c6dQ6u9Jb4Fd6oNbYhHezNBibqpMnBBD70h+0zCN4K3/QkOcLyx/x68HgCg+bk/WoCkPYkB38NYu+HNqLxvAoFz3runf9WIrQYmOAj9pT9kQ2MEczj7Bnx+BHNLwBQGkLqAxqkGBcg7QdOFZcfiQOzvtaiQO+3AC0UY+Zx3zT4+gTYFV8ZTen+ypD7OxCK8GAWD/gB2H7xJDTU/DvMpAwlDGHkkfW89cv4t8spG4b+4wgmCUgP3EdN7/kaHOlB29b2XxXu3r75YuvL/XkFigbbDqQC5B4L8gLutfY97yLh3A481TDKNN+z91kpdO+E0DLfqdZMxgH1u8MZ/HcIGxKhwRkREAbX6+P+ccPQI83O9hTvxiMGCxYSEr8x3wl7ARXQ/dwXJU3jKCfwyNQbO9x18ukYJfGBx3vh9GsvDP419BWCDRQYpd1T1nxSV9wj8y7+SeZuJVj7ohk9FboaKRvU6uz/tRRuEtUejR3WEPUhvBXu3SLTiiBy4rDuCDkyFvancAS8/f7O9fuuHkT4A+W/+8IEEf/nF/ELyO+zyiLadSIJ8GepVPAStbAnUQQGCPAudhQm8fcJZZviGCcbpgbw8UTypR4Zxpcjqeh8BosS9BSIGqLujQEgJP4ZicYA6n85fCX6/gARPvRaHn/JzMZNKoIMLNv4y+7tlera3AAPZKTkHHJYzApn9VPpZfM46zc8POJeCJsk+v4gJmNS0SRxHhb1aSkoAUf9Zf+IEPwuoRsCCmfV2v7O/ZVbChZODFciJvlfEt7Bt8j0Dmz8sxOHAHsQAQDvIOc5ETyE99MlJ9vXM/IXOx4bJ1oL18opJnUquRYS9/TzYbsy69khUvCrDpMIIdbPD20VX+TKKQMMMPvl83EeGOn/Kv/Var1L46wLze0F/WoSb/O5JHsJDi7+BOrtGgVaH+zsQgKZ/dU3gtTQ+/4HhizLPU/fIerl7SJBQAxJ2/b1QUK883gM2pvn+XAWeNciFGH51SHL3rzbjAYh83n6Qx5C69gcfP3lEoBEEMWa2O3VidNF9ZHMKfYYDobqbC4///kpsLthNH8A0xEXGZvCvAjf3aYLmfH/7jQYAuBh8vgyuhOk4H4MIf9++KbZIhh5HBj+V+TlRPjNQ/TUy0s5cQUE/yL4yvJAC2bllgy1BSwNZg9p4Zn17tlMCtMcQchHDfbMnPdWvTupPuIuyknlRhQWIzbA0iF17DTuDTZO5h3bKxNwGFbFCiCxB3AE4+HSDwTohe3+y1AGIw+c07P9N/kyIkbNkRd4AlYkDyrq/jDvFCUG4mzc3iNW+88PHjya+jAoJysbzEj8kw5G+0bf+zlvDmrlzAm25Hv5KAj8Gh/Vg/74B8/6JtvVEB/LPSlVBzAJ7QDw3RvJGgnZ2HfilBPe/lLIW9KHGhwLQgRkt7JCdACtyJPy8gDk6kr0aeAMAcwMUxXNmNQmTerfAbHgTgaPJAYgWNPD0NEW1gYlvVWR2Qt1NTc8h8MYQG21zLrvCxTicSYyygHQfuweBCLiaGjkICsNsSsV91zBOOhIBhv0PjOsEJYugighDa4uOyIBzfP/ZiCDBALrOuuxtUkclt3LChADF8mKF5e8+8vKDKQgdNxrVXMJH/VS6wgZbtBe9PO6MSfovVUadBfwuvnW+decINw6G/afAZ640tqV5p65Md/h7WvIrhB6AYYQk/ySGlsBlwqXIkgp0tIHFB4haave+jrt9eVgxaUEth4f7YwmwyUi8zEMtAFk9oH33umK0M330hrXEqHvtAPp/M8N3sBQKo70Kz3/BggUExV1958G9R2fv8oMWyoFBaHyC+dF1AJIWv+ctL7qwbGuLpzStN3/zqPjag3cCYQa6vSGDb/gZk7jH8PubRlP14n3uyEE+zjnVtgq/17spCId6CMzoxPM0ogdMAom848IftJgIbbG6tKOOeYfJg7L2lIWTi0x5asLMBRhMKHEbReUyyDQh6ngFSzsPwWZE6kma+r2BZAV9+nZ/j4MHcwIA9kDR/BQ1EH9BxsrxPH01PH50N8UoeyXynnLihfb9vYtRAPs31IMy/hdLEwi3xbV/gX7feGN2ugO9O9XOGfC4cxBDsTmBP8ix50kVxAW3tYqNbF2OJbwTwkGHsgdUQPrF531uAdQC53bKPBg7UQKZu2wPsfULwaWMFcS4yslHfS80sKsH78/xvhyaInsyil3EOzoOrl7E303V+FoJAUT2rk9tf/MRwc6ODQXEhvUu3Dqk/Mh0L+/WvmyBNHT4fPq5+NM7xWlQa0KUttF7zg6Z+9MHOAhJNYl7ekVtQBhNNzuLRca8Vg/WBg56MP+VwgwsYM8zxmhCRr3wANqEFghddtb1WUQlffcQfH7meQO2Dzkjww8Fs4S7c0x5uMU8sv9DP4KB+6A+L8wQRAdOIwL9frbIqbWZAyjGrr9PPBIBjsG8STE8UJAg8PG/TGuieiGKE7j+OJDERzxbObT6iPJR/hlJyMLQtH85krR6cigICfxWQF5FrjTKUrIAKbhTQxH5z8L47zhBEHyTxoD+Zrj5tYy18UfK+oK+3y8O+2G8jsMbQeq3fouxQLK+HADiOzT63HnbDM8/YgVHRsNy8L1jBU+F2YE6/RvAfrg6/14A5+9Je1/E5i9963YB20I+CRY553o7ukBC7Losvzj9ljdEgL262/2vwIG/SsY2Bhlys4QXNNiyDvXke3jKZ/pKQHAKV0oxNOsKSMKVgwE78ny1AWjzfn69CN6GTzTlBk+LpsF3OVS4vP6P+M698X6Yg5F9fkGgSotCT/psywa3gjl5heQBuy8zgG5QOI2RPZt6/QhfPUl933/y/de5mPBtcbqxMqhnzX/DU012RKO3lgDcAOmO373LApZ/CMVxtSE/PT8QrM2HAkumP/UDFgD6uvK897obXN/Afa/LRum/EcRFK2o52jlKhb/KlrerrbMU/v9Geh78pkW+wt18b3ZC/p28uopxxNiEam8T+APKBvSjTJ2ChLdSu3U/OUIUSIzHogj7xIDDUfRs+IA1Hf6rRApujnwSfezA90WI9Te7929HhqAN1TtIbKnEeS1k/2lsHfFC+0uJ7ADgCvO2Rzp4vML8JzhgixJ+4MA9thG2kefgKN9I7cbDhcE1zQD7ORspxKTCAjv7/wVYDJq8ALiFc5GJUfVhuYi/30ZQRNd7R3U/QjrLb7FfRJC9zNZxBj1Dxb+SsR/F2Xj/hb6O6b+Jy2PGSzfZd+64cHR1ATWLlIV6AWhFRYFbCOv7gv0Pj5jCA3jS9IQAM4fyQZREZ7sM+3F6ljKxwj26N/sSRPW9JspC1+L5pTvbdFfMVvX6/0fKkIADBOGEF4Lq0DI8xQZfNXhEoEt2N07AKMw5xLQAeXgHurOOkf4a/qE40ogs+DOFN0ex8l/A4QANDWGCIHkBCRj3f2yaw6/8zn30O/vQf/u7ut3/xXJGOKF3aPj3fhZ4ufP/RQMu2TiPAs67tb25OqV/I7T0Sy15xQcsw2U6o8MDhh6G6jtP92E7+3Wn0Lu7qD/t8mFHR7svQR26xckRfXk6uGflOFkFKbx4/2n8TTsMgRcJGC/vR7mx+zyqtC707cBAd269jPP8bI38nP1SumgDYAgMOShBX8x//uB8+gEa/ey8Wrp9fQjE1zggevhy1n6twOG9ozZK+jA82MDmO1S480VnfN5L4ITXhogAcoJCui228z46+iL6o3pe/UiG3X2ueeO2NrrliKwAvojYBZ0ImrZ7cUh5BIOBfLhRjftGAZ8JRX2f6PPG68lQxQovnnV7fErJSXqM/j1CAUXghDHS4pKDyL475kda/ADy3bsiw2OCWXMxCV9/iUPp+nMAYXOuBJQ7ULIJN/zTJTE1hXz/u8QwQMg+58zBzjVzZkCSt3/MAcXDTQK+E3t0wpHRPO3Pd9CGvv6v/Oa9VQXkQug028Obw7o6J0SasNM1gbtQhwIDWcW9/Jb7RIewgHX+Pb37vkL67n4mgNKS8DJF/tO7Yb9lgD6AFT4ThX+6O77PiIX703s+vMYEREIY+erEPUf6+D0Kj4CmOEDMTP+iztlGJgihAnM8IbqTPIlAo7Pxhi69PD3Yfik73vdhOa59jbVygp1AX/eniV+2Zqu+xTBEZTqqgFo0Orz5AeqD1n8WioM0CPb4uXl47HuE+sz3sL4pzbxD5XcT/eB5J0aVteJ79buYtqpqgT9y+rdJ1Ysws+/AH7t0Pzrw1UEmQ98AF78wQ8c4bX2EffN2jTmFR8JxUwJEywRwS4Ech4Z5ykCZjMpriXqTub1D4Dxbwn34qPlbeGUGIsL3u3m81LIG++g1tc47v+W0SzEgAYvCRAF2vUlHaoGj+sk0RkG4P2Q+j4iMxnw2m/lJ+yjHs/EKs0k1eQoiCefN4UVlBkV9mL+4PYaIxXxVwJ04F/d0tpV/TPawxCy/AYAsvk=", w_scale: 57649085647426546e-21, w_zero: -975, b: "KCKCxZPx5FgxDlO9vxxMMYQ8Egi9OjrBc0KTG9hKc8PBvJbgQzMAgDAjOS1/2OQgQ+/fUwylQeJCoP0HSQzNKHZ95A4In+NmUVjJDzwEDNW6gTzaXe3UHv9/ipJ5bDn+Zdetr8m+BFO8Cpe+nfIuBf/mRlFzpg+weOIKNCPxqhE=", b_scale: 5404767216532491e-20, b_zero: 5637 }, { type: "fc", name: "fc1", dtype: "int16", in: 256, out: 64, w: "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", w_scale: 12267775673535652e-21, w_zero: 2931, b: "ja0RrhDbNcjLpavUwubJkQad4aUAgP9/JstFivcQuEyWB1eRlctyQnQTi1dc3QW90e2vG3T23S44tCfK88500bSmlq246EMNh8dZ6ZzrS8JHnbQRE6X9HUrGV+w90/f2gAjV01SmhdiVmIuK5gY5t5+tVhwU0c8Qo74+FYQ36Ow=", b_scale: 2857102117559407e-21, b_zero: -9897 }, { type: "fc", name: "fc2", dtype: "int16", in: 64, out: 27, w: "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", w_scale: 15091635759745259e-21, w_zero: 13231, b: "AID1Gb7Nho9nHkfJv+WG4RQ3pW3ExicQOjuY6Gcjx2L/f0PVMg3jRaoICmuVS6v2vBNx/26A", b_scale: 7395479315164266e-21, b_zero: 5284 }] };

  // src/assist/ocr-zhjw.js
  var W = 180;
  var H = 60;
  function dequant(b64, scale, zero, dtype) {
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    if (dtype === "int16") {
      const n = Math.floor(buf.length / 2);
      const arr = new Int16Array(n);
      for (let i = 0; i < n; i++) arr[i] = buf[i * 2] | buf[i * 2 + 1] << 8;
      return Array.from(arr, (v) => (v - zero) * scale);
    }
    return Array.from(new Int8Array(buf.buffer, 0, buf.length), (v) => (v - zero) * scale);
  }
  __name(dequant, "dequant");
  var MODEL = {
    chars: zhjw_model_default.chars,
    layers: zhjw_model_default.layers.map((L) => L.type === "conv" ? {
      type: "conv",
      name: L.name,
      out_c: L.out_c,
      in_c: L.in_c,
      k: L.k,
      groups: L.groups || 1,
      dtype: L.dtype || "int8",
      w: dequant(L.w, L.w_scale, L.w_zero, L.dtype),
      b: dequant(L.b, L.b_scale, L.b_zero, L.dtype)
    } : { type: "fc", name: L.name, in: L.in, out: L.out, dtype: L.dtype || "int8", w: dequant(L.w, L.w_scale, L.w_zero, L.dtype), b: dequant(L.b, L.b_scale, L.b_zero, L.dtype) })
  };
  function hsvRedMask(pixels) {
    const mask = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const r = pixels[i * 4] / 255, g = pixels[i * 4 + 1] / 255, b = pixels[i * 4 + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const diff = mx - mn;
      let h = 0;
      if (diff !== 0) {
        if (mx === r) h = (g - b) / diff % 6;
        else if (mx === g) h = (b - r) / diff + 2;
        else h = (r - g) / diff + 4;
        h *= 60;
        if (h < 0) h += 360;
        h = Math.floor(h / 2);
      }
      const s = mx === 0 ? 0 : Math.floor(diff / mx * 255);
      const inRed = h >= 170 && h <= 179 && s >= 50 || h >= 0 && h <= 12 && s >= 50;
      mask[i] = inRed ? 1 : 0;
    }
    return mask;
  }
  __name(hsvRedMask, "hsvRedMask");
  function seededRandom(seed) {
    let s = seed;
    return () => {
      s = s * 1664525 + 1013904223 >>> 0;
      return s / 4294967296;
    };
  }
  __name(seededRandom, "seededRandom");
  function kmeans1D(xs, K, rng, attempts = 10) {
    let bestCompact = Infinity, bestLabels = null, bestCenters = null;
    const n = xs.length;
    for (let a = 0; a < attempts; a++) {
      const centers = [xs[rng() * n | 0]];
      while (centers.length < K) {
        const dists = new Float64Array(n);
        let total = 0;
        for (let i = 0; i < n; i++) {
          let bd = Infinity;
          for (const c of centers) {
            const d = (xs[i] - c) * (xs[i] - c);
            if (d < bd) bd = d;
          }
          dists[i] = bd;
          total += bd;
        }
        let r = rng() * total, pick = n - 1;
        for (let i = 0; i < n; i++) {
          r -= dists[i];
          if (r <= 0) {
            pick = i;
            break;
          }
        }
        centers.push(xs[pick]);
      }
      const labels = new Int32Array(n);
      let c2 = centers.slice();
      for (let iter = 0; iter < 100; iter++) {
        let changed = false;
        for (let i = 0; i < n; i++) {
          let bi = 0, bd = Infinity;
          for (let k = 0; k < K; k++) {
            const d = (xs[i] - c2[k]) * (xs[i] - c2[k]);
            if (d < bd) {
              bd = d;
              bi = k;
            }
          }
          if (labels[i] !== bi) {
            labels[i] = bi;
            changed = true;
          }
        }
        if (!changed) break;
        for (let k = 0; k < K; k++) {
          let sum = 0, cnt = 0;
          for (let i = 0; i < n; i++) if (labels[i] === k) {
            sum += xs[i];
            cnt++;
          }
          if (cnt) c2[k] = sum / cnt;
        }
      }
      let comp = 0;
      for (let i = 0; i < n; i++) comp += (xs[i] - c2[labels[i]]) * (xs[i] - c2[labels[i]]);
      if (comp < bestCompact) {
        bestCompact = comp;
        bestLabels = labels;
        bestCenters = c2;
      }
    }
    return { labels: bestLabels, centers: bestCenters };
  }
  __name(kmeans1D, "kmeans1D");
  function segmentChars(mask) {
    const xs = [], ys = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (mask[y * W + x]) {
        xs.push(x);
        ys.push(y);
      }
    }
    if (xs.length < 20) return null;
    const { labels, centers } = kmeans1D(xs, 4, seededRandom(42));
    const order = centers.map((c, i) => i).sort((a, b) => centers[a] - centers[b]);
    const mapId = new Int32Array(4);
    order.forEach((oldId, newId) => {
      mapId[oldId] = newId;
    });
    const bounds = [];
    for (let cid = 0; cid < 4; cid++) {
      let x1 = W, x2 = 0, y1 = H, y2 = 0, cnt = 0;
      for (let i = 0; i < xs.length; i++) {
        if (mapId[labels[i]] !== cid) continue;
        const x = xs[i], y = ys[i];
        if (x < x1) x1 = x;
        if (x > x2) x2 = x;
        if (y < y1) y1 = y;
        if (y > y2) y2 = y;
        cnt++;
      }
      if (cnt === 0) return null;
      const bw = x2 - x1;
      if (bw < 6 || bw > 50) return null;
      bounds.push({ x1, x2, y1, y2 });
    }
    bounds.sort((a, b) => a.x1 - b.x1);
    return bounds;
  }
  __name(segmentChars, "segmentChars");
  function bicubicKernel(x) {
    x = Math.abs(x);
    if (x <= 1) return (1.5 * x - 2.5) * x * x + 1;
    if (x < 2) return ((-0.5 * x + 2.5) * x - 4) * x + 2;
    return 0;
  }
  __name(bicubicKernel, "bicubicKernel");
  function bicubicChannel(src, sw, sh, dw, dh, ch, srcBpp) {
    const out = new Float32Array(dw * dh);
    const scaleX = sw / dw, scaleY = sh / dh;
    for (let dy = 0; dy < dh; dy++) {
      const srcY = (dy + 0.5) * scaleY - 0.5;
      const y0 = Math.floor(srcY);
      for (let dx = 0; dx < dw; dx++) {
        const srcX = (dx + 0.5) * scaleX - 0.5;
        const x0 = Math.floor(srcX);
        let sum = 0, wsum = 0;
        for (let m = -1; m <= 2; m++) {
          const wy = bicubicKernel(srcY - (y0 + m));
          if (wy === 0) continue;
          const sy = Math.min(sh - 1, Math.max(0, y0 + m));
          for (let n = -1; n <= 2; n++) {
            const wx = bicubicKernel(srcX - (x0 + n));
            if (wx === 0) continue;
            const sx = Math.min(sw - 1, Math.max(0, x0 + n));
            sum += wx * wy * src[(sy * sw + sx) * srcBpp + ch];
            wsum += wx * wy;
          }
        }
        out[dy * dw + dx] = wsum ? sum / wsum : 0;
      }
    }
    return out;
  }
  __name(bicubicChannel, "bicubicChannel");
  function cropResize(imgData, box) {
    const { x1, x2, y1, y2 } = box;
    const padX = 4, padY = 5;
    const sx1 = Math.max(0, x1 - padX), sx2 = Math.min(W - 1, x2 + padX);
    const sy1 = Math.max(0, y1 - padY), sy2 = Math.min(H - 1, y2 + padY);
    const cw = sx2 - sx1 + 1, ch = sy2 - sy1 + 1;
    const crop = new Float32Array(cw * ch * 4);
    for (let y = sy1; y <= sy2; y++) for (let x = sx1; x <= sx2; x++) {
      const si = (y * W + x) * 4;
      const di = ((y - sy1) * cw + (x - sx1)) * 4;
      crop[di] = imgData[si];
      crop[di + 1] = imgData[si + 1];
      crop[di + 2] = imgData[si + 2];
      crop[di + 3] = 255;
    }
    const b = bicubicChannel(crop, cw, ch, 32, 32, 2, 4);
    const g = bicubicChannel(crop, cw, ch, 32, 32, 1, 4);
    const r = bicubicChannel(crop, cw, ch, 32, 32, 0, 4);
    const out = new Float32Array(3 * 32 * 32);
    for (let i = 0; i < 1024; i++) {
      out[i] = b[i] / 255;
      out[1024 + i] = g[i] / 255;
      out[2048 + i] = r[i] / 255;
    }
    return out;
  }
  __name(cropResize, "cropResize");
  function conv2d(x, L, inH, inW, doPool) {
    const { out_c, in_c, k, groups, w, b } = L;
    const outH = inH, outW = inW;
    const pad = k === 1 ? 0 : 1;
    const g = groups || 1;
    const out = new Float32Array(out_c * outH * outW);
    const isDepthwise = g > 1 && in_c === 1;
    const inPerG = isDepthwise ? 1 : in_c / g;
    const outPerG = isDepthwise ? 1 : out_c / g;
    for (let oc = 0; oc < out_c; oc++) {
      const gid = Math.floor(oc / outPerG);
      const icBase = gid * inPerG;
      for (let i = 0; i < outH; i++) {
        for (let j = 0; j < outW; j++) {
          let acc = b[oc];
          for (let ic = 0; ic < inPerG; ic++) {
            const icAbs = icBase + ic;
            for (let di = -pad; di <= pad; di++) {
              const si = i + di;
              if (si < 0 || si >= inH) continue;
              const xRowBase = (icAbs * inH + si) * inW;
              let wRowBase;
              if (g > 1) {
                wRowBase = (oc * k + (di + pad)) * k;
              } else {
                wRowBase = ((oc * in_c + icAbs) * k + (di + pad)) * k;
              }
              for (let dj = -pad; dj <= pad; dj++) {
                const sj = j + dj;
                if (sj < 0 || sj >= inW) continue;
                acc += x[xRowBase + sj] * w[wRowBase + (dj + pad)];
              }
            }
          }
          out[(oc * outH + i) * outW + j] = acc;
        }
      }
    }
    if (L.name === "stem" || L.name.endsWith("_pw")) {
      for (let i = 0; i < out.length; i++) out[i] = Math.max(0, out[i]);
    }
    if (!doPool) {
      return { data: out, h: outH, w: outW };
    }
    const pH = Math.floor(outH / 2), pW = Math.floor(outW / 2);
    const pooled = new Float32Array(out_c * pH * pW);
    for (let oc = 0; oc < out_c; oc++) {
      for (let i = 0; i < pH; i++) {
        for (let j = 0; j < pW; j++) {
          let m = -Infinity;
          const base = (oc * outH + i * 2) * outW + j * 2;
          for (let di = 0; di < 2; di++) for (let dj = 0; dj < 2; dj++) {
            const v = out[base + di * outW + dj];
            if (v > m) m = v;
          }
          pooled[(oc * pH + i) * pW + j] = m;
        }
      }
    }
    return { data: pooled, h: pH, w: pW };
  }
  __name(conv2d, "conv2d");
  function fc(x, L, relu) {
    const { in: inDim, out: outDim, w, b } = L;
    const out = new Float32Array(outDim);
    for (let o = 0; o < outDim; o++) {
      let acc = b[o];
      const wRow = o * inDim;
      for (let i = 0; i < inDim; i++) acc += x[i] * w[wRow + i];
      out[o] = relu ? Math.max(0, acc) : acc;
    }
    return out;
  }
  __name(fc, "fc");
  var LAYER_POOL = {
    "stem": true,
    "ds1_dw": false,
    "ds1_pw": true,
    "ds2_dw": false,
    "ds2_pw": true,
    "ds3_dw": false,
    "ds3_pw": true
  };
  function predictChar(pixels, box) {
    let x = cropResize(pixels, box);
    let h = 32, w = 32;
    for (const L of MODEL.layers) {
      if (L.type === "conv") {
        const r = conv2d(x, L, h, w, LAYER_POOL[L.name] === true);
        x = r.data;
        h = r.h;
        w = r.w;
      } else {
        x = fc(x, L, L.out > MODEL.chars.length);
      }
    }
    let best = 0;
    let bestV = -Infinity;
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      const e = Math.exp(x[i]);
      sum += e;
      if (x[i] > bestV) {
        bestV = x[i];
        best = i;
      }
    }
    return { char: MODEL.chars[best], prob: Math.exp(bestV) / sum };
  }
  __name(predictChar, "predictChar");
  function recognizeZhjwCaptchaData(imgData) {
    const mask = hsvRedMask(imgData.data);
    const boxes = segmentChars(mask);
    if (!boxes || boxes.length !== 4) return null;
    let code = "";
    let conf = 1;
    for (const box of boxes) {
      const r = predictChar(imgData.data, box);
      code += r.char;
      conf *= r.prob;
    }
    return { code, conf };
  }
  __name(recognizeZhjwCaptchaData, "recognizeZhjwCaptchaData");
  function recognizeZhjwCaptcha(image) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(image, 0, 0, W, H);
      return recognizeZhjwCaptchaData(ctx.getImageData(0, 0, W, H));
    } catch (_) {
      return null;
    }
  }
  __name(recognizeZhjwCaptcha, "recognizeZhjwCaptcha");

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
      const autoSend2fa = getBool(SESSION_KEYS.autoSend2fa, true);
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
        <button type="button" class="urppp-set-follow" id="urpppp-login-autosend2fa">统一认证 2FA 自动获取验证码：${autoSend2fa ? "开" : "关"}</button>
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
      let autoSend2fa = getBool(SESSION_KEYS.autoSend2fa, true);
      const enabledBtn = sec.querySelector("#urpppp-login-enabled");
      const autoBtn = sec.querySelector("#urpppp-login-auto");
      const shareBtn = sec.querySelector("#urpppp-login-share");
      const persistBtn = sec.querySelector("#urpppp-login-persist-password");
      const autoSend2faBtn = sec.querySelector("#urpppp-login-autosend2fa");
      const toggleCas = /* @__PURE__ */ __name(() => {
        sec.querySelectorAll(".urpppp-cas-user,.urpppp-cas-pass").forEach((r) => {
          r.style.display = shareCred ? "none" : "grid";
        });
      }, "toggleCas");
      deps.syncToggle(enabledBtn, enabled, "功能：开", "功能：关");
      deps.syncToggle(autoBtn, autoSubmit, "识别后自动登录：开", "识别后自动登录：关");
      deps.syncToggle(shareBtn, shareCred, "教务/统一认证共用账密：开", "教务/统一认证共用账密：关");
      deps.syncToggle(persistBtn, persistPassword, "持久保存密码：开", "持久保存密码：关");
      deps.syncToggle(autoSend2faBtn, autoSend2fa, "统一认证 2FA 自动获取验证码：开", "统一认证 2FA 自动获取验证码：关");
      toggleCas();
      autoSend2faBtn.onclick = () => {
        autoSend2fa = !autoSend2fa;
        setVal(SESSION_KEYS.autoSend2fa, autoSend2fa);
        deps.syncToggle(autoSend2faBtn, autoSend2fa, "统一认证 2FA 自动获取验证码：开", "统一认证 2FA 自动获取验证码：关");
      };
      enabledBtn.onclick = () => {
        enabled = !enabled;
        setVal(LOGIN.enabled, enabled);
        if (enabled) config.resetAllLoginGuard();
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
        config.resetAllLoginGuard();
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
        config.resetAllLoginGuard();
        deps.setStatus("urpppp-login-status", "已清除账密和连续失败计数", "ok");
      };
    }
    __name(bindLoginSection, "bindLoginSection");
    const recognizeSmart = /* @__PURE__ */ __name(async (img, ocrUrl, kind) => {
      let local = null;
      let conf = 1;
      if (kind === "cas" && typeof deps.recognizeLocalCaptcha === "function") {
        local = deps.recognizeLocalCaptcha(img);
      } else if (kind === "zhjw" && typeof deps.recognizeZhjwCaptcha === "function") {
        const r = deps.recognizeZhjwCaptcha(img);
        if (r) {
          local = r.code;
          conf = r.conf;
        }
      }
      const confThreshold = 0.5;
      if (local && /^[a-z0-9]{4}$/i.test(local) && (kind === "cas" || conf >= confThreshold)) {
        deps.log("验证码（本地）", local);
        return local;
      }
      const url = String(ocrUrl || "").trim();
      if (!url) {
        deps.log(kind === "cas" ? "本地识别失败且未配置线上 OCR，等待手动填写" : "本地识别低置信且未配置线上 OCR，等待手动填写");
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
      config.resetAllLoginGuard();
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
      try {
        console.log("[URP++辅助][guard] 进入教务登录");
      } catch (_) {
      }
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
      const code = await recognizeSmart(captchaImg, c.ocrUrl, "zhjw");
      if (!code) return true;
      fillLoginCaptcha(captchaInput, code);
      deps.log("教务验证码：", code);
      if (c.autoSubmit && loginButton) {
        await deps.sleep(c.submitDelay);
        config.markPendingAutoLogin("zhjw", cred.username);
        loginButton.click();
        scheduleAutoRetry("zhjw");
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
    function ensureAccountLoginTab() {
      const cand = Array.from(document.querySelectorAll("a, li, button, span, div"));
      const tab = cand.find((t) => (t.textContent || "").replace(/\s+/g, "") === "账号登录");
      if (tab) {
        try {
          tab.click();
        } catch (_) {
        }
      }
    }
    __name(ensureAccountLoginTab, "ensureAccountLoginTab");
    async function handleUnifiedAuthLogin() {
      const bodyText = document.body && document.body.innerText || "";
      const isUnifiedAuth = /统一身份认证/.test(bodyText) || !!document.querySelector("img.captcha-img") || /frontend\/login|id\.scu\.edu\.cn|enduser\/sp\/sso/i.test(location.href);
      if (!isUnifiedAuth) return false;
      if (/短信认证|短信验证|手机号|获取验证码|动态口令|安全验证/.test(bodyText.slice(0, 500))) return false;
      try {
        console.log("[URP++辅助][guard] 进入统一认证登录");
      } catch (_) {
      }
      ensureAccountLoginTab();
      await deps.sleep(250);
      let els = findCasElements();
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
      const code = await recognizeSmart(els.captchaImg, c.ocrUrl, "cas");
      if (!code) return true;
      fillLoginCaptcha(els.captchaInput, code);
      deps.log("统一认证验证码：", code);
      if (c.autoSubmit && els.loginButton) {
        await deps.sleep(c.submitDelay);
        config.markPendingAutoLogin("cas", cred.username);
        els.loginButton.click();
        scheduleAutoRetry("cas");
      }
      return true;
    }
    __name(handleUnifiedAuthLogin, "handleUnifiedAuthLogin");
    let loginRunning = false;
    function scheduleAutoRetry(kind) {
      setTimeout(() => {
        try {
          const c = config.loginConf();
          if (!c.enabled) return;
          const guard = config.getLoginGuardState(kind);
          if (kind === "cas") {
            const bodyText = document.body && document.body.innerText || "";
            const slice = bodyText.slice(0, 500);
            const in2fa = /短信认证|短信验证|手机号|获取验证码|动态口令|安全验证/.test(slice);
            const leftCas = !/id\.scu\.edu\.cn|enduser\/sp\/sso|frontend\/login/i.test(location.href) && !/统一身份认证/.test(slice);
            if (in2fa || leftCas) {
              config.clearLoginGuardAfterSuccess("cas");
              return;
            }
            if (guard.identity && !guard.paused) {
              try {
                console.log("[URP++辅助][guard] 统一认证失败，自动重试");
              } catch (_) {
              }
              ensureAccountLoginTab();
              mainLogin();
            }
          } else {
            const stillLogin = !!document.querySelector('input[type="password"]');
            if (!stillLogin) {
              config.clearLoginGuardAfterSuccess("zhjw");
              return;
            }
            if (guard.identity && !guard.paused) {
              try {
                console.log("[URP++辅助][guard] 教务登录失败，自动重试");
              } catch (_) {
              }
              mainLogin();
            }
          }
        } catch (_) {
        }
      }, 3e3);
    }
    __name(scheduleAutoRetry, "scheduleAutoRetry");
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

  // src/assist/session.js
  var SESSION_KEY_ENABLED = SESSION_KEYS.keepAliveEnabled;
  var SESSION_KEY_INTERVAL = SESSION_KEYS.keepAliveInterval;
  var SESSION_KEY_URL = SESSION_KEYS.keepAliveUrl;
  function createSessionAssist({ config, storage, deps }) {
    const { getBool, getNum, getStr, setVal } = storage;
    const { setStatus, syncToggle, escapeAttr: escapeAttr2, log: log2 } = deps;
    function isKeepaliveHost() {
      const host = String(location.hostname || "");
      if (/^zhjw\./i.test(host)) return true;
      if (/^202\.115\.47\.141$/i.test(host)) return true;
      if (/webvpn/i.test(host)) return true;
      return false;
    }
    __name(isKeepaliveHost, "isKeepaliveHost");
    function isLoginPath() {
      const path = String(location.pathname || "");
      const href = String(location.href || "");
      if (/login/i.test(path)) return true;
      if (/frontend\/login/i.test(href)) return true;
      return false;
    }
    __name(isLoginPath, "isLoginPath");
    function is2faDomain() {
      return /^id\./i.test(String(location.hostname || ""));
    }
    __name(is2faDomain, "is2faDomain");
    function is2faPage() {
      const href = String(location.href || "");
      if (/#\/(second|mfa|verify)/i.test(href)) return true;
      const bodyText = String(document.body ? document.body.innerText : "");
      if (/短信认证|手机验证码|安全码|二次验证|2FA/i.test(bodyText) && /获取验证码/.test(bodyText)) return true;
      return false;
    }
    __name(is2faPage, "is2faPage");
    let keepAliveTimer = 0;
    async function beat() {
      const conf = config.sessionConf();
      if (!conf.keepAliveEnabled) return;
      if (!isKeepaliveHost() || isLoginPath()) return;
      let url;
      try {
        url = new URL(conf.keepAliveUrl, location.origin).href;
      } catch (_) {
        return;
      }
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          redirect: "follow"
        });
        if (/login/i.test(String(res.url || "")) && !/thisSemesterCurriculum|second|auth/i.test(String(res.url || ""))) {
          stopKeepAlive();
          log2("会话保持：登录态已失效，停止心跳");
        }
      } catch (_) {
      }
    }
    __name(beat, "beat");
    function startKeepAlive() {
      const conf = config.sessionConf();
      if (!conf.keepAliveEnabled) return;
      if (!isKeepaliveHost() || isLoginPath()) return;
      if (keepAliveTimer) return;
      const interval = Math.max(60, conf.keepAliveInterval) * 1e3;
      keepAliveTimer = setInterval(beat, interval);
      beat();
      log2(`会话保持：已启动（每 ${conf.keepAliveInterval}s 心跳）`);
    }
    __name(startKeepAlive, "startKeepAlive");
    function stopKeepAlive() {
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = 0;
      }
    }
    __name(stopKeepAlive, "stopKeepAlive");
    let installed2fa = false;
    function findSendButton() {
      const btns = Array.from(document.querySelectorAll('button, .btn, .ivu-btn, .el-button, [role="button"]'));
      return btns.find((b) => {
        const t = String(b.innerText || b.textContent || "").replace(/\s+/g, "");
        if (!/获取验证码|获取短信|发送验证码|发送短信/.test(t)) return false;
        if (/重新|已发送|重发|请稍候|\(\d+|\d+s|秒/.test(t)) return false;
        return true;
      });
    }
    __name(findSendButton, "findSendButton");
    function hasVisibleOverlay() {
      const overlays = document.querySelectorAll(".ivu-modal-wrap, .ivu-modal, .el-dialog__wrapper, .el-overlay");
      return Array.from(overlays).some((el) => {
        const st = getComputedStyle(el);
        return st.display !== "none" && st.visibility !== "hidden" && st.opacity !== "0";
      });
    }
    __name(hasVisibleOverlay, "hasVisibleOverlay");
    function send2faOnce() {
      const conf = config.sessionConf();
      if (!conf.autoSend2fa) return;
      if (!is2faPage()) return;
      if (hasVisibleOverlay()) return;
      const btn = findSendButton();
      if (!btn) return;
      if (btn.getAttribute("data-urpppp2fa-sent") === "1") return;
      btn.setAttribute("data-urpppp2fa-sent", "1");
      try {
        btn.click();
      } catch (_) {
      }
      log2("2FA：已自动点击「获取验证码」发送短信");
    }
    __name(send2faOnce, "send2faOnce");
    function install2faAutoSend() {
      if (installed2fa) return;
      installed2fa = true;
      setTimeout(send2faOnce, 300);
      let tries = 0;
      const timer = setInterval(() => {
        send2faOnce();
        tries += 1;
        if (tries >= 25) clearInterval(timer);
      }, 800);
      const observer = new MutationObserver(() => send2faOnce());
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.addEventListener("beforeunload", () => {
        try {
          observer.disconnect();
        } catch (_) {
        }
      }, { once: true });
    }
    __name(install2faAutoSend, "install2faAutoSend");
    function buildSessionSection() {
      const c = config.sessionConf();
      const sec = document.createElement("section");
      sec.className = "urppp-set-sec urpppp-sec";
      sec.id = "urpppp-session-sec";
      sec.innerHTML = `
      <h3>会话保持</h3>
      <p class="urppp-set-tip">在教务系统页面定时静默请求，避免仅放置不操作就被登出。只在教务系统页面生效。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-session-keepalive">会话保活：${c.keepAliveEnabled ? "开" : "关"}</button>
      </div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>心跳间隔(秒)</label><input type="number" id="urpppp-session-interval" min="60" step="60" value="${escapeAttr2(String(c.keepAliveInterval))}" /></div>
        <div class="urpppp-row"><label>心跳接口(可选)</label><input type="text" id="urpppp-session-url" placeholder="留空用默认" value="${escapeAttr2(confKeepAliveUrlPreview(c))}" spellcheck="false" /></div>
      </div>
      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-session-save">保存会话设置</button>
      </div>
      <div class="urpppp-status" id="urpppp-session-status"></div>
    `;
      return sec;
    }
    __name(buildSessionSection, "buildSessionSection");
    function confKeepAliveUrlPreview(c) {
      if (c.keepAliveUrl && c.keepAliveUrl !== DEFAULT_KEEPALIVE_URL) return c.keepAliveUrl;
      return "";
    }
    __name(confKeepAliveUrlPreview, "confKeepAliveUrlPreview");
    function bindSessionSection(sec) {
      const keepAlive = config.sessionConf().keepAliveEnabled;
      const keepBtn = sec.querySelector("#urpppp-session-keepalive");
      syncToggle(keepBtn, keepAlive, "会话保活：开", "会话保活：关");
      keepBtn.onclick = () => {
        const next = !getBool(SESSION_KEY_ENABLED, true);
        setVal(SESSION_KEY_ENABLED, next);
        syncToggle(keepBtn, next, "会话保活：开", "会话保活：关");
        if (next) startKeepAlive();
        else stopKeepAlive();
      };
      sec.querySelector("#urpppp-session-save").onclick = () => {
        const interval = Math.max(60, Math.min(3600, parseInt(sec.querySelector("#urpppp-session-interval").value, 10) || 480));
        const url = String(sec.querySelector("#urpppp-session-url").value || "").trim();
        setVal(SESSION_KEY_INTERVAL, String(interval));
        setVal(SESSION_KEY_URL, url);
        stopKeepAlive();
        if (getBool(SESSION_KEY_ENABLED, true)) startKeepAlive();
        setStatus("urpppp-session-status", "会话设置已保存", "ok");
      };
    }
    __name(bindSessionSection, "bindSessionSection");
    return {
      buildSessionSection,
      bindSessionSection,
      install2faAutoSend,
      startKeepAlive,
      stopKeepAlive,
      is2faDomain,
      is2faPage
    };
  }
  __name(createSessionAssist, "createSessionAssist");

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
    function fetchAssistWithTimeout(url, headers, timeoutMs) {
      const ctrl = typeof AbortController === "function" ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
      return fetch(url, { cache: "no-store", headers, signal: ctrl ? ctrl.signal : void 0 }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).finally(() => {
        if (timer) clearTimeout(timer);
      });
    }
    __name(fetchAssistWithTimeout, "fetchAssistWithTimeout");
    function gmAssistRequest(url, headers) {
      return new Promise((resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: "GET",
            url,
            timeout: 12e3,
            headers,
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
    __name(gmAssistRequest, "gmAssistRequest");
    function fetchAssistUrl(url, opts) {
      const headers = { "Cache-Control": "no-cache" };
      if (opts && opts.range) headers.Range = opts.range;
      if (typeof GM_xmlhttpRequest === "function") return gmAssistRequest(url, headers);
      return fetchAssistWithTimeout(url, headers, 12e3);
    }
    __name(fetchAssistUrl, "fetchAssistUrl");
    async function fetchAssistFirstAvailable(urls, opts, primaryTimeout = 1e3) {
      const details = [];
      const primary = urls[0];
      const fallbacks = urls.slice(1);
      const grab = /* @__PURE__ */ __name((url) => fetchAssistUrl(url, opts).then((text) => ({ url, text })).catch((e) => {
        details.push((url.split("/")[2] || url) + ": " + (e && e.message || e));
        return null;
      }), "grab");
      const primaryJob = grab(primary);
      const timeoutMark = new Promise((resolve) => setTimeout(() => resolve("__TIMEOUT__"), primaryTimeout));
      const first = await Promise.race([primaryJob, timeoutMark]);
      if (first !== "__TIMEOUT__") {
        if (first && first.text && first.text.length > 0) return first.text;
        const fb = await Promise.all(fallbacks.map(grab));
        const ok = fb.find((r) => r && r.text && r.text.length > 0);
        if (ok) return ok.text;
        throw new Error("所有更新源均不可用（" + details.join("; ") + "）");
      }
      const fallbackJob = Promise.all(fallbacks.map(grab)).then((results) => {
        const ok = results.find((r) => r && r.text && r.text.length > 0);
        if (ok) return ok.text;
        throw new Error("所有更新源均不可用（" + details.join("; ") + "）");
      });
      const latePrimary = primaryJob.then((r) => {
        if (r && r.text && r.text.length > 0) return r.text;
        throw new Error("主源内容无效");
      }).catch(() => new Promise(() => {
      }));
      return Promise.race([latePrimary, fallbackJob]);
    }
    __name(fetchAssistFirstAvailable, "fetchAssistFirstAvailable");
    async function fetchAssistRemoteVersion() {
      try {
        const text = await fetchAssistFirstAvailable(deps.URPPPP_SOURCES);
        const j = JSON.parse(text);
        const assist = String(j && j.assist || "").trim();
        if (assist) return assist;
      } catch (_) {
      }
      const head = await fetchAssistFirstAvailable(deps.URPPPP_RAW_URLS, { range: "bytes=0-2048" });
      const remote = deps.parseVersionFromSource(head);
      if (!remote) throw new Error("无法解析远程辅助插件版本");
      return remote;
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
      const remote = await fetchAssistRemoteVersion();
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
  function createAssistPanel({ login, evaluation, session, deps }) {
    const uiState = { injected: false };
    function ensureSubPanel() {
      let panel = document.getElementById("urpppp-subpanel");
      if (panel) {
        ensureSubParent(panel);
        return panel;
      }
      panel = document.createElement("div");
      panel.id = "urpppp-subpanel";
      panel.innerHTML = `
      <div class="urpppp-sub-head">
        <button type="button" class="urpppp-sub-back" id="urpppp-sub-back" aria-label="返回">←</button>
        <div class="urpppp-sub-title" id="urpppp-sub-title">助手设置</div>
        <button type="button" class="urpppp-sub-close" id="urpppp-sub-close" aria-label="关闭">×</button>
      </div>
      <div class="urpppp-sub-body" id="urpppp-sub-body"></div>
    `;
      ensureSubParent(panel);
      panel.querySelector("#urpppp-sub-close").onclick = closeSubPanel;
      panel.querySelector("#urpppp-sub-back").onclick = closeSubPanel;
      return panel;
    }
    __name(ensureSubPanel, "ensureSubPanel");
    function ensureSubParent(panel) {
      if (panel.parentElement) return;
      const main = document.getElementById("urppp-settings-panel");
      if (main) main.appendChild(panel);
      else document.documentElement.appendChild(panel);
    }
    __name(ensureSubParent, "ensureSubParent");
    function placeSubPanelLikeMain() {
      const sub = document.getElementById("urpppp-subpanel");
      if (!sub) return;
      sub.style.position = "absolute";
      sub.style.top = "0";
      sub.style.left = "0";
      sub.style.width = "100%";
      sub.style.height = "100%";
      sub.style.maxHeight = "none";
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
      } else if (kind === "session") {
        title.textContent = "会话保持";
        const sec = session.buildSessionSection();
        body.appendChild(sec);
        session.bindSessionSection(sec);
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
          <button type="button" class="urppp-set-btn" id="urpppp-open-session">会话保持</button>
        </div>
        <p class="urpppp-tip">辅助插件 v${deps.URPPPP_VERSION}</p>
      `;
        body.appendChild(entry);
        entry.querySelector("#urpppp-open-login").onclick = () => openSubPanel("login");
        entry.querySelector("#urpppp-open-eval").onclick = () => openSubPanel("eval");
        entry.querySelector("#urpppp-open-session").onclick = () => openSubPanel("session");
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
  background:#fff;color:#1d1d1f;padding:6px 10px;font-size:12px;box-sizing:border-box
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
  position:absolute;inset:0;z-index:3;display:none;box-sizing:border-box;
  background:var(--surface,#fff);color:var(--text,#111);
  flex-direction:column;overflow:hidden;border-radius:0
}
#urpppp-subpanel.open{display:flex}
#urpppp-subpanel .urpppp-sub-head{
  display:flex;align-items:center;gap:8px;
  padding:14px 16px 10px;border-bottom:1px solid var(--border,#e5e7eb);
  flex:0 0 auto;background:var(--surface,#fff)
}
#urpppp-subpanel .urpppp-sub-title{font-size:16px;font-weight:700;flex:1}
#urpppp-subpanel .urpppp-sub-back,
#urpppp-subpanel .urpppp-sub-close{
  width:30px;height:30px;border:0;border-radius:8px;cursor:pointer;
  background:transparent;color:var(--text-secondary,#667085);font-size:18px;line-height:1;
  display:inline-flex;align-items:center;justify-content:center
}
#urpppp-subpanel .urpppp-sub-back:hover,
#urpppp-subpanel .urpppp-sub-close:hover{background:var(--input-bg,#f8fafc);color:var(--text,#111)}
#urpppp-subpanel .urpppp-sub-body{padding:12px 16px 16px;flex:1;overflow:auto}
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
  color:#1d1d1f!important
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
    const URPPPP_VERSION = "1.5.3";
    const URPPPP_RAW_URL = "https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js";
    const URPPPP_SOURCES = [
      "https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/version.json",
      "https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/version.json",
      "https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/version.json"
    ];
    const URPPPP_RAW_URLS = [
      URPPPP_RAW_URL,
      "https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/urpppp.user.js",
      "https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js"
    ];
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
      config: { loginConf, beginLoginProcess, markPendingAutoLogin, resetLoginGuardState, resetAllLoginGuard },
      storage: { getBool, setVal },
      deps: {
        constants: { LOGIN, LOGIN_FAILURE_LIMIT, DEFAULT_OCR_EXAMPLE },
        escapeAttr,
        getBase64FromImage,
        log,
        loginGuardStyles: assist_login_guard_default,
        recognizeCaptchaWithRequest: recognizeCaptcha,
        recognizeLocalCaptcha,
        recognizeZhjwCaptcha,
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
        URPPPP_SOURCES,
        URPPPP_RAW_URLS,
        compareStandaloneVersions: compareVersions,
        parseVersionFromSource: parseUserscriptVersion
      }
    });
    const session = createSessionAssist({
      config: { sessionConf },
      storage: { getBool, getNum, getStr, setVal },
      deps: { setStatus, syncToggle, escapeAttr, log }
    });
    const panel = createAssistPanel({
      login,
      evaluation,
      session,
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
    const { install2faAutoSend, is2faDomain, startKeepAlive } = session;
    const isPluginMode = typeof window.__urpppPlugin === "object" && !!window.__urpppPlugin;
    if (isPluginMode) {
      try {
        window.__urpppPlugin.register({
          id: "assist",
          type: "plugin",
          name: "辅助插件",
          version: URPPPP_VERSION,
          subpanels: {
            login: { label: "登录助手", open: /* @__PURE__ */ __name(() => panel.openSubPanel("login"), "open") },
            eval: { label: "评教助手", open: /* @__PURE__ */ __name(() => panel.openSubPanel("eval"), "open") },
            session: { label: "会话保持", open: /* @__PURE__ */ __name(() => panel.openSubPanel("session"), "open") }
          }
        });
      } catch (_) {
      }
    }
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
    if (!isPluginMode) watchSettingsPanel();
    const hasZhjwLoginForm = !!(document.getElementById("input_username") && document.getElementById("input_password") && document.getElementById("input_checkcode"));
    const isLoginUi = hasZhjwLoginForm || /\/login|\/second|frontend\/login/i.test(location.href + location.pathname) || !!document.querySelector('input[type="password"]');
    if (isLoginUi) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mainLogin);
      else mainLogin();
    } else {
      resetAllLoginGuard();
    }
    if (is2faDomain()) install2faAutoSend();
    startKeepAlive();
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
