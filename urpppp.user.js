// ==UserScript==
// @name         SCU URP++教务系统辅助插件
// @namespace    https://github.com/hanako/urp-plus
// @version      1.2.6
// @description  URP++ 扩展：登录验证码识别 + 评教自动填写/到时自动保存 + 列表页全自动评教。设置挂到 URP++ 设置面板。
// @author       Chao_Lan,Hanako
// @license      MIT
// @icon         https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/docs/icon.png
// @match        http://zhjw.scu.edu.cn/*
// @match        http://202.115.47.141/*
// @match        https://*.scu.edu.cn/*
// @match        https://*.webvpn.scu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-idle
// ==/UserScript==

/**
 * 依赖：URP++ 主脚本（设置面板 DOM）。本文件不修改 urppp.user.js。
 *
 * 模块：
 * 1) 登录助手：OCR + 账密自动填充
 * 2) 评教助手：分数/单选/多选/主观题自动填；可选等待约100秒后自动保存（不跳过服务端倒计时）
 * 3) 全自动评教：在评教列表页扫描未评估问卷，逐个进入填写并到时提交
 */

(function () {
  'use strict';

  // ===================== 公共工具 =====================
  const NS = 'urpppp_assist_v1';

  function log(...args) { console.log('[URP++ 辅助]', ...args); }
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function getBool(key, def) {
    try { return !!GM_getValue(key, def); } catch (_) { return !!def; }
  }
  function getStr(key, def) {
    try {
      const v = GM_getValue(key, def == null ? '' : def);
      return v == null ? '' : String(v);
    } catch (_) { return def == null ? '' : String(def); }
  }
  function getNum(key, def) {
    const n = Number(getStr(key, String(def)));
    return Number.isFinite(n) ? n : def;
  }
  function getJSON(key, def) {
    try {
      const raw = GM_getValue(key, '');
      if (!raw) return def;
      return JSON.parse(raw);
    } catch (_) { return def; }
  }
  function setVal(key, val) {
    try { GM_setValue(key, val); } catch (_) {}
  }
  function setJSON(key, obj) {
    setVal(key, JSON.stringify(obj == null ? {} : obj));
  }

  function escapeAttr(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setInputValue(input, value) {
    if (!input) return;
    const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (desc && desc.set) desc.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function setTextAreaValue(el, value) {
    if (!el) return;
    const desc = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function randInt(min, max) {
    const a = Math.ceil(Number(min));
    const b = Math.floor(Number(max));
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
    if (b <= a) return a;
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function parseLetters(str) {
    // "A,B,C" / "A B C" / "ABC" → ['A','B','C']
    const s = String(str || '').toUpperCase();
    const set = new Set();
    (s.match(/[A-K]/g) || []).forEach((ch) => set.add(ch));
    return Array.from(set);
  }

  // ===================== 登录助手配置 =====================
  const LOGIN = {
    enabled: NS + '_login_enabled',
    autoSubmit: NS + '_login_auto_submit',
    ocrUrl: NS + '_login_ocr_url',
    zhjwUser: NS + '_login_zhjw_user',
    zhjwPass: NS + '_login_zhjw_pass',
    casUser: NS + '_login_cas_user',
    casPass: NS + '_login_cas_pass',
    shareCred: NS + '_login_share_cred',
    submitDelay: NS + '_login_submit_delay'
  };
  const DEFAULT_OCR_EXAMPLE = 'https://ocr.example.com/api/ocr';

  // ===================== 评教助手配置 =====================
  const EVAL = {
    enabled: NS + '_eval_enabled',
    // 进入页面后等待多久再自动保存（秒）。服务端约 100 秒，不跳过
    waitSec: NS + '_eval_wait_sec',
    // score
    scoreMin: NS + '_eval_score_min',
    scoreMax: NS + '_eval_score_max',
    // global single default letters e.g. "A,B"
    singleLetters: NS + '_eval_single_letters',
    // per-question single: { "2": "A,B", "3": "A" }
    singlePerQ: NS + '_eval_single_per_q',
    // multi
    multiLetters: NS + '_eval_multi_letters',
    multiPerQ: NS + '_eval_multi_per_q',
    multiAvoidNone: NS + '_eval_multi_avoid_none',
    // subjective
    commentTemplates: NS + '_eval_comment_templates',
    // actions
    autoFill: NS + '_eval_auto_fill',
    autoSave: NS + '_eval_auto_save',
    saveDelay: NS + '_eval_save_delay',
    // full-auto batch
    batchActive: NS + '_eval_batch_active',
    batchQueue: NS + '_eval_batch_queue',
    batchIndex: NS + '_eval_batch_index',
    batchGapSec: NS + '_eval_batch_gap_sec'
  };

  const DEFAULT_COMMENTS = [
    '老师授课认真负责，讲解清晰，收获很大。',
    '课堂氛围好，内容充实，希望继续保持。',
    '课程安排合理，老师答疑及时，总体满意。'
  ].join('\n');

  function loginConf() {
    return {
      enabled: getBool(LOGIN.enabled, true),
      autoSubmit: getBool(LOGIN.autoSubmit, true),
      ocrUrl: getStr(LOGIN.ocrUrl, ''),
      zhjwUser: getStr(LOGIN.zhjwUser, ''),
      zhjwPass: getStr(LOGIN.zhjwPass, ''),
      casUser: getStr(LOGIN.casUser, ''),
      casPass: getStr(LOGIN.casPass, ''),
      shareCred: getBool(LOGIN.shareCred, true),
      submitDelay: Math.max(0, getNum(LOGIN.submitDelay, 300))
    };
  }

  function evalConf() {
    return {
      enabled: getBool(EVAL.enabled, true),
      // 默认等 100 秒再自动保存（与页面/服务端倒计时一致）
      waitSec: Math.max(0, getNum(EVAL.waitSec, 100)),
      scoreMin: Math.max(1, Math.min(100, getNum(EVAL.scoreMin, 92))),
      scoreMax: Math.max(1, Math.min(100, getNum(EVAL.scoreMax, 98))),
      singleLetters: getStr(EVAL.singleLetters, 'A') || 'A',
      singlePerQ: getJSON(EVAL.singlePerQ, {}) || {},
      multiLetters: getStr(EVAL.multiLetters, 'A,B,C') || 'A,B,C',
      multiPerQ: getJSON(EVAL.multiPerQ, {}) || {},
      multiAvoidNone: getBool(EVAL.multiAvoidNone, true),
      commentTemplates: getStr(EVAL.commentTemplates, DEFAULT_COMMENTS),
      autoFill: getBool(EVAL.autoFill, true),
      autoSave: getBool(EVAL.autoSave, false),
      saveDelay: Math.max(0, getNum(EVAL.saveDelay, 500)),
      batchGapSec: Math.max(0, getNum(EVAL.batchGapSec, 2))
    };
  }

  function getBatchState() {
    return {
      active: getBool(EVAL.batchActive, false),
      queue: getJSON(EVAL.batchQueue, []) || [],
      index: Math.max(0, getNum(EVAL.batchIndex, 0))
    };
  }
  function setBatchState(partial) {
    const cur = getBatchState();
    const next = Object.assign({}, cur, partial || {});
    setVal(EVAL.batchActive, !!next.active);
    setJSON(EVAL.batchQueue, Array.isArray(next.queue) ? next.queue : []);
    setVal(EVAL.batchIndex, String(Math.max(0, Number(next.index) || 0)));
    return next;
  }
  function clearBatchState() {
    setBatchState({ active: false, queue: [], index: 0 });
  }

  // ===================== 设置面板注入 =====================
  const uiState = { injected: false };

  function settingsStyles() {
    if (document.getElementById('urpppp-assist-style')) return;
    const st = document.createElement('style');
    st.id = 'urpppp-assist-style';
    st.textContent = `
#urppp-settings-panel .urpppp-sec h3{margin:0 0 8px}
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

  function buildLoginSection() {
    const c = loginConf();
    const sec = document.createElement('section');
    sec.className = 'urppp-set-sec urpppp-sec';
    sec.id = 'urpppp-login-sec';
    sec.innerHTML = `
      <h3>登录助手</h3>
      <p class="urppp-set-tip">自动填写账号密码、OCR 识别验证码。OCR 地址需手动填写。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-login-enabled">功能：${c.enabled ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-auto">识别后自动登录：${c.autoSubmit ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-share">教务/统一认证共用账密：${c.shareCred ? '开' : '关'}</button>
      </div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>OCR 服务</label><input type="url" id="urpppp-login-ocr" placeholder="${DEFAULT_OCR_EXAMPLE}" value="${escapeAttr(c.ocrUrl)}" spellcheck="false" /></div>
        <div class="urpppp-row"><label>提交延迟(ms)</label><input type="number" id="urpppp-login-delay" min="0" step="50" value="${escapeAttr(String(c.submitDelay))}" /></div>
        <div class="urpppp-row"><label>教务学号</label><input type="text" id="urpppp-login-zhjw-user" value="${escapeAttr(c.zhjwUser)}" autocomplete="username" /></div>
        <div class="urpppp-row"><label>教务密码</label><input type="password" id="urpppp-login-zhjw-pass" value="${escapeAttr(c.zhjwPass)}" autocomplete="current-password" /></div>
        <div class="urpppp-row urpppp-cas-user"><label>统一认证账号</label><input type="text" id="urpppp-login-cas-user" value="${escapeAttr(c.casUser)}" /></div>
        <div class="urpppp-row urpppp-cas-pass"><label>统一认证密码</label><input type="password" id="urpppp-login-cas-pass" value="${escapeAttr(c.casPass)}" /></div>
      </div>
      <p class="urpppp-tip">OCR 示例：<code>${DEFAULT_OCR_EXAMPLE}</code> · POST <code>{"image":"base64"}</code> → <code>{"status":"success","code":"..."}</code></p>
      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-login-save">保存登录设置</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-login-clear">清除账密</button>
      </div>
      <div class="urpppp-status" id="urpppp-login-status"></div>
    `;
    return sec;
  }

  function bindLoginSection(sec) {
    let enabled = getBool(LOGIN.enabled, true);
    let autoSubmit = getBool(LOGIN.autoSubmit, true);
    let shareCred = getBool(LOGIN.shareCred, true);
    const enabledBtn = sec.querySelector('#urpppp-login-enabled');
    const autoBtn = sec.querySelector('#urpppp-login-auto');
    const shareBtn = sec.querySelector('#urpppp-login-share');
    const toggleCas = () => {
      sec.querySelectorAll('.urpppp-cas-user,.urpppp-cas-pass').forEach((r) => {
        r.style.display = shareCred ? 'none' : 'grid';
      });
    };
    syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    syncToggle(autoBtn, autoSubmit, '识别后自动登录：开', '识别后自动登录：关');
    syncToggle(shareBtn, shareCred, '教务/统一认证共用账密：开', '教务/统一认证共用账密：关');
    toggleCas();

    enabledBtn.onclick = () => {
      enabled = !enabled; setVal(LOGIN.enabled, enabled);
      syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    };
    autoBtn.onclick = () => {
      autoSubmit = !autoSubmit; setVal(LOGIN.autoSubmit, autoSubmit);
      syncToggle(autoBtn, autoSubmit, '识别后自动登录：开', '识别后自动登录：关');
    };
    shareBtn.onclick = () => {
      shareCred = !shareCred; setVal(LOGIN.shareCred, shareCred);
      syncToggle(shareBtn, shareCred, '教务/统一认证共用账密：开', '教务/统一认证共用账密：关');
      toggleCas();
    };
    sec.querySelector('#urpppp-login-save').onclick = () => {
      setVal(LOGIN.ocrUrl, (sec.querySelector('#urpppp-login-ocr').value || '').trim());
      setVal(LOGIN.submitDelay, String(Math.max(0, parseInt(sec.querySelector('#urpppp-login-delay').value, 10) || 300)));
      setVal(LOGIN.zhjwUser, (sec.querySelector('#urpppp-login-zhjw-user').value || '').trim());
      setVal(LOGIN.zhjwPass, sec.querySelector('#urpppp-login-zhjw-pass').value || '');
      setVal(LOGIN.casUser, (sec.querySelector('#urpppp-login-cas-user').value || '').trim());
      setVal(LOGIN.casPass, sec.querySelector('#urpppp-login-cas-pass').value || '');
      setVal(LOGIN.enabled, enabled);
      setVal(LOGIN.autoSubmit, autoSubmit);
      setVal(LOGIN.shareCred, shareCred);
      setStatus('urpppp-login-status', '登录设置已保存', 'ok');
    };
    sec.querySelector('#urpppp-login-clear').onclick = () => {
      setVal(LOGIN.zhjwUser, ''); setVal(LOGIN.zhjwPass, '');
      setVal(LOGIN.casUser, ''); setVal(LOGIN.casPass, '');
      sec.querySelector('#urpppp-login-zhjw-user').value = '';
      sec.querySelector('#urpppp-login-zhjw-pass').value = '';
      sec.querySelector('#urpppp-login-cas-user').value = '';
      sec.querySelector('#urpppp-login-cas-pass').value = '';
      setStatus('urpppp-login-status', '已清除账密', 'ok');
    };
  }

  function buildEvalSection() {
    const c = evalConf();
    const perSingle = Object.keys(c.singlePerQ || {}).map((k) => `${k}:${c.singlePerQ[k]}`).join('\n');
    const perMulti = Object.keys(c.multiPerQ || {}).map((k) => `${k}:${c.multiPerQ[k]}`).join('\n');
    const sec = document.createElement('section');
    sec.className = 'urppp-set-sec urpppp-sec';
    sec.id = 'urpppp-eval-sec';
    sec.innerHTML = `
      <h3>评教助手</h3>
      <p class="urppp-set-tip">在评教填写页自动填写问卷。服务端有约 100 秒停留校验，已取消“跳过倒计时”；开启自动保存后会等到设定秒数再提交。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-eval-enabled">功能：${c.enabled ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autofill">进入页面自动填写：${c.autoFill ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autosave">到时自动保存：${c.autoSave ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-avoid-none">多选避开「以上均无」：${c.multiAvoidNone ? '开' : '关'}</button>
      </div>

      <div class="urpppp-sub">自动保存等待</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>等待秒数</label><input type="number" id="urpppp-eval-wait-sec" min="0" max="600" value="${escapeAttr(String(c.waitSec))}" /></div>
      </div>
      <p class="urpppp-tip">默认100秒，启用自动保存后会在计时结束自动保存。教务系统服务端也会进行倒计时，无法直接跳过等待秒数。</p>

      <div class="urpppp-sub">分数题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>随机下限</label><input type="number" id="urpppp-eval-score-min" min="1" max="100" value="${escapeAttr(String(c.scoreMin))}" /></div>
        <div class="urpppp-row"><label>随机上限</label><input type="number" id="urpppp-eval-score-max" min="1" max="100" value="${escapeAttr(String(c.scoreMax))}" /></div>
      </div>
      <p class="urpppp-tip">每位教师的分数题会在 [下限, 上限] 内独立随机整数。</p>

      <div class="urpppp-sub">单选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认选项池</label><input type="text" id="urpppp-eval-single" value="${escapeAttr(c.singleLetters)}" placeholder="如 A 或 A,B" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-single-per" placeholder="每行：题号:选项池&#10;2:A,B&#10;5:A">${escapeHtml(perSingle)}</textarea></div>
      </div>
      <p class="urpppp-tip">不同问卷的部分题目特殊（如国际周课程的第7题），建议在执行自动评教前检查特殊题目并按题配置</p>
      <p class="urpppp-tip">题号为页面「2、3、4…」中的数字。选项池如 <code>A,B</code> 表示在 A/B 中随机。</p>

      <div class="urpppp-sub">多选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认勾选池</label><input type="text" id="urpppp-eval-multi" value="${escapeAttr(c.multiLetters)}" placeholder="如 A,B,C" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-multi-per" placeholder="每行：题号:选项池&#10;6:A,B,C,F">${escapeHtml(perMulti)}</textarea></div>
      </div>
      <p class="urpppp-tip">会勾选池内全部选项；若开启避开「以上均无」，不会勾选含「以上均无」的项。</p>

      <div class="urpppp-sub">主观题模板</div>
      <div class="urpppp-grid">
        <div class="urpppp-row" style="align-items:start"><label>评语模板</label><textarea id="urpppp-eval-comments" placeholder="每行一条，随机选用">${escapeHtml(c.commentTemplates)}</textarea></div>
        <div class="urpppp-row"><label>自动保存延迟(ms)</label><input type="number" id="urpppp-eval-save-delay" min="0" step="100" value="${escapeAttr(String(c.saveDelay))}" /></div>
      </div>
      <p class="urpppp-tip">评语模版以回车划分，可以自行添加新模板</p>

      <div class="urpppp-sub">全自动评教（列表页）</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>问卷间隔(秒)</label><input type="number" id="urpppp-eval-batch-gap" min="0" max="60" value="${escapeAttr(String(c.batchGapSec))}" /></div>
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

  function parsePerQuestionMap(text) {
    const map = {};
    String(text || '').split(/\r?\n/).forEach((line) => {
      const s = line.trim();
      if (!s || s.startsWith('#')) return;
      const m = s.match(/^(\d+)\s*[:：=]\s*(.+)$/);
      if (!m) return;
      map[m[1]] = m[2].trim();
    });
    return map;
  }

  function bindEvalSection(sec) {
    let enabled = getBool(EVAL.enabled, true);
    let autoFill = getBool(EVAL.autoFill, true);
    let autoSave = getBool(EVAL.autoSave, false);
    let avoidNone = getBool(EVAL.multiAvoidNone, true);
    const enabledBtn = sec.querySelector('#urpppp-eval-enabled');
    const fillBtn = sec.querySelector('#urpppp-eval-autofill');
    const saveAutoBtn = sec.querySelector('#urpppp-eval-autosave');
    const avoidBtn = sec.querySelector('#urpppp-eval-avoid-none');
    syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    syncToggle(fillBtn, autoFill, '进入页面自动填写：开', '进入页面自动填写：关');
    syncToggle(saveAutoBtn, autoSave, '到时自动保存：开', '到时自动保存：关');
    syncToggle(avoidBtn, avoidNone, '多选避开「以上均无」：开', '多选避开「以上均无」：关');

    enabledBtn.onclick = () => {
      enabled = !enabled; setVal(EVAL.enabled, enabled);
      syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    };
    fillBtn.onclick = () => {
      autoFill = !autoFill; setVal(EVAL.autoFill, autoFill);
      syncToggle(fillBtn, autoFill, '进入页面自动填写：开', '进入页面自动填写：关');
    };
    saveAutoBtn.onclick = () => {
      autoSave = !autoSave; setVal(EVAL.autoSave, autoSave);
      syncToggle(saveAutoBtn, autoSave, '到时自动保存：开', '到时自动保存：关');
    };
    avoidBtn.onclick = () => {
      avoidNone = !avoidNone; setVal(EVAL.multiAvoidNone, avoidNone);
      syncToggle(avoidBtn, avoidNone, '多选避开「以上均无」：开', '多选避开「以上均无」：关');
    };

    sec.querySelector('#urpppp-eval-save').onclick = () => {
      let min = Math.max(1, Math.min(100, parseInt(sec.querySelector('#urpppp-eval-score-min').value, 10) || 92));
      let max = Math.max(1, Math.min(100, parseInt(sec.querySelector('#urpppp-eval-score-max').value, 10) || 98));
      if (max < min) { const t = min; min = max; max = t; }
      setVal(EVAL.enabled, enabled);
      setVal(EVAL.autoFill, autoFill);
      setVal(EVAL.autoSave, autoSave);
      setVal(EVAL.multiAvoidNone, avoidNone);
      setVal(EVAL.waitSec, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-wait-sec').value, 10) || 100)));
      setVal(EVAL.scoreMin, String(min));
      setVal(EVAL.scoreMax, String(max));
      setVal(EVAL.singleLetters, (sec.querySelector('#urpppp-eval-single').value || 'A').trim());
      setJSON(EVAL.singlePerQ, parsePerQuestionMap(sec.querySelector('#urpppp-eval-single-per').value));
      setVal(EVAL.multiLetters, (sec.querySelector('#urpppp-eval-multi').value || 'A,B,C').trim());
      setJSON(EVAL.multiPerQ, parsePerQuestionMap(sec.querySelector('#urpppp-eval-multi-per').value));
      setVal(EVAL.commentTemplates, sec.querySelector('#urpppp-eval-comments').value || '');
      setVal(EVAL.saveDelay, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-save-delay').value, 10) || 500)));
      setVal(EVAL.batchGapSec, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-batch-gap').value, 10) || 2)));
      setStatus('urpppp-eval-status', '评教设置已保存', 'ok');
    };

    sec.querySelector('#urpppp-eval-run').onclick = async () => {
      try {
        const ok = await runEvaluationAssist({ force: true, forceSave: true });
        setStatus('urpppp-eval-status', ok ? '已在当前评教页执行' : '当前不是评教填写页，或执行失败', ok ? 'ok' : 'err');
      } catch (e) {
        setStatus('urpppp-eval-status', String(e && e.message || e), 'err');
      }
    };

    const batchStartBtn = sec.querySelector('#urpppp-eval-batch-start');
    const batchStopBtn = sec.querySelector('#urpppp-eval-batch-stop');
    if (batchStartBtn) {
      batchStartBtn.onclick = async () => {
        try {
          const n = await startFullAutoEvaluation();
          setStatus('urpppp-eval-status', n > 0 ? ('已启动全自动，共 ' + n + ' 份未评估') : '当前列表没有未评估问卷（请先打开教学评估列表页）', n > 0 ? 'ok' : 'err');
        } catch (e) {
          setStatus('urpppp-eval-status', String(e && e.message || e), 'err');
        }
      };
    }
    if (batchStopBtn) {
      batchStopBtn.onclick = () => {
        clearBatchState();
        setStatus('urpppp-eval-status', '已停止全自动评教', 'ok');
        updateBatchHud();
      };
    }
  }

  function ensureSubPanel() {
    let panel = document.getElementById('urpppp-subpanel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'urpppp-subpanel';
    panel.innerHTML = `
      <div class="urpppp-sub-head">
        <div class="urpppp-sub-title" id="urpppp-sub-title">助手设置</div>
        <button type="button" class="urpppp-sub-close" id="urpppp-sub-close" aria-label="关闭">×</button>
      </div>
      <div class="urpppp-sub-body" id="urpppp-sub-body"></div>
    `;
    document.documentElement.appendChild(panel);
    panel.querySelector('#urpppp-sub-close').onclick = closeSubPanel;
    return panel;
  }

  function placeSubPanelLikeMain() {
    const main = document.getElementById('urppp-settings-panel');
    const sub = document.getElementById('urpppp-subpanel');
    if (!main || !sub) return;
    const r = main.getBoundingClientRect();
    // 与主设置窗同位同尺寸，避免飘到别处
    const top = Math.max(8, r.top);
    const left = Math.max(8, r.left);
    const width = Math.max(320, r.width || 420);
    const maxHeight = Math.max(240, r.height || (window.innerHeight - top - 16));
    sub.style.top = top + 'px';
    sub.style.left = left + 'px';
    sub.style.width = width + 'px';
    sub.style.maxHeight = maxHeight + 'px';
    sub.style.right = 'auto';
    sub.style.bottom = 'auto';
  }

  function openSubPanel(kind) {
    settingsStyles();
    const sub = ensureSubPanel();
    const body = sub.querySelector('#urpppp-sub-body');
    const title = sub.querySelector('#urpppp-sub-title');
    if (!body || !title) return;
    body.innerHTML = '';
    if (kind === 'login') {
      title.textContent = '登录助手';
      const sec = buildLoginSection();
      body.appendChild(sec);
      bindLoginSection(sec);
    } else {
      title.textContent = '评教助手';
      const sec = buildEvalSection();
      body.appendChild(sec);
      bindEvalSection(sec);
    }
    placeSubPanelLikeMain();
    sub.classList.add('open');
    // 主设置若在滚动/动画，再贴一次位置
    setTimeout(placeSubPanelLikeMain, 30);
  }

  function closeSubPanel() {
    const sub = document.getElementById('urpppp-subpanel');
    if (!sub) return;
    sub.classList.remove('open');
    const body = sub.querySelector('#urpppp-sub-body');
    if (body) body.innerHTML = '';
  }

  function injectSettingsPanel() {
    const panel = document.getElementById('urppp-settings-panel');
    if (!panel) return false;
    const body = panel.querySelector('.urppp-set-body');
    if (!body) return false;
    settingsStyles();
    // 旧版直接塞进主设置的大段配置：清理掉，改入口按钮
    const oldLogin = document.getElementById('urpppp-login-sec');
    const oldEval = document.getElementById('urpppp-eval-sec');
    if (oldLogin && oldLogin.closest('#urppp-settings-panel')) oldLogin.remove();
    if (oldEval && oldEval.closest('#urppp-settings-panel')) oldEval.remove();

    if (!document.getElementById('urpppp-entry-sec')) {
      const entry = document.createElement('section');
      entry.className = 'urppp-set-sec urpppp-entry-sec';
      entry.id = 'urpppp-entry-sec';
      entry.innerHTML = `
        <h3>辅助插件</h3>
        <div class="urpppp-entry-grid">
          <button type="button" class="urppp-set-btn" id="urpppp-open-login">登录助手</button>
          <button type="button" class="urppp-set-btn" id="urpppp-open-eval">评教助手</button>
        </div>
      `;
      body.appendChild(entry);
      entry.querySelector('#urpppp-open-login').onclick = () => openSubPanel('login');
      entry.querySelector('#urpppp-open-eval').onclick = () => openSubPanel('eval');
    }

    // 主设置关闭时，子面板一并关
    if (!panel.__urppppCloseHooked) {
      panel.__urppppCloseHooked = true;
      const closeBtn = panel.querySelector('#urppp-set-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeSubPanel());
      }
      const mask = document.getElementById('urppp-settings-mask');
      if (mask && !mask.__urppppCloseHooked) {
        mask.__urppppCloseHooked = true;
        mask.addEventListener('click', () => closeSubPanel());
      }
    }
    uiState.injected = true;
    return true;
  }

  function watchSettingsPanel() {
    const tryInject = () => { try { injectSettingsPanel(); } catch (e) { console.warn(e); } };
    tryInject();
    const obs = new MutationObserver(() => tryInject());
    obs.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#urppp-nav-settings') || t.closest('#uc-settings') || t.closest('.urppp-nav-settings')) {
        setTimeout(tryInject, 50);
        setTimeout(tryInject, 200);
      }
    }, true);
  }

  // ===================== 登录逻辑 =====================
  function getBase64FromImage(img) {
    if (!img) throw new Error('验证码图片不存在');
    if (img.src && img.src.startsWith('data:image')) return img.src.split(',')[1];
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 120;
    canvas.height = img.naturalHeight || img.height || 40;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png').split(',')[1];
  }

  function recognizeCaptcha(base64, ocrUrl) {
    return new Promise((resolve, reject) => {
      const url = String(ocrUrl || '').trim();
      if (!url) return reject(new Error('未配置 OCR 服务地址'));
      if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error('不支持 GM_xmlhttpRequest'));
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ image: base64 }),
        timeout: 15000,
        onload(response) {
          try {
            const result = JSON.parse(response.responseText || '{}');
            const code = result.code || result.data || result.text || result.result;
            if ((result.status === 'success' && result.code != null) || code) resolve(String(code).trim());
            else reject(new Error(result.message || result.msg || 'OCR 识别失败'));
          } catch (_) { reject(new Error('OCR 响应解析失败')); }
        },
        onerror() { reject(new Error('OCR 服务请求失败')); },
        ontimeout() { reject(new Error('OCR 服务超时')); }
      });
    });
  }

  function credFor(kind, c) {
    if (c.shareCred || kind === 'zhjw') return { username: c.zhjwUser, password: c.zhjwPass };
    return { username: c.casUser || c.zhjwUser, password: c.casPass || c.zhjwPass };
  }

  function ensureReadyForLogin(kind) {
    const c = loginConf();
    if (!c.enabled) return null;
    if (!c.ocrUrl) { log('未配置 OCR，跳过登录识别'); return null; }
    const cred = credFor(kind, c);
    if (!cred.username || !cred.password) { log('未配置账密，请到设置 → 登录助手'); return null; }
    return { conf: c, cred };
  }

  async function handleZhjwLogin() {
    const usernameInput = document.getElementById('input_username');
    const passwordInput = document.getElementById('input_password');
    const captchaInput = document.getElementById('input_checkcode');
    const captchaImg = document.getElementById('captchaImg');
    const loginButton = document.getElementById('loginButton');
    if (!usernameInput || !passwordInput || !captchaInput || !captchaImg) return false;
    log('教务登录页');
    const ready = ensureReadyForLogin('zhjw');
    if (!ready) return true;
    const { conf: c, cred } = ready;
    setInputValue(usernameInput, cred.username);
    setInputValue(passwordInput, cred.password);
    if (!captchaImg.complete) await new Promise((r) => { captchaImg.onload = r; setTimeout(r, 2000); });
    const code = await recognizeCaptcha(getBase64FromImage(captchaImg), c.ocrUrl);
    setInputValue(captchaInput, code);
    log('教务验证码：', code);
    if (c.autoSubmit && loginButton) { await sleep(c.submitDelay); loginButton.click(); }
    return true;
  }

  function findCasElements() {
    const inputs = Array.from(document.querySelectorAll('input'));
    const usernameInput =
      inputs.find((i) => /账号|学号|用户名|username|user/i.test(i.placeholder || i.name || i.id || '')) ||
      inputs.find((i) => i.type === 'text' && !/验证码|captcha|check/i.test(i.placeholder || i.name || i.id || ''));
    const passwordInput = inputs.find((i) => i.type === 'password');
    const captchaInput =
      inputs.find((i) => /验证码|captcha|checkcode|check/i.test(i.placeholder || i.name || i.id || '')) ||
      inputs.find((i) => i.type === 'text' && i.maxLength > 0 && i.maxLength <= 8);
    const captchaImg =
      document.querySelector('img.captcha-img') ||
      document.querySelector("img[src^='data:image']") ||
      Array.from(document.querySelectorAll('img')).find((img) =>
        /captcha|yzm|验证码/i.test((img.className || '') + ' ' + (img.alt || '') + ' ' + (img.src || ''))
      );
    const loginButton = Array.from(document.querySelectorAll("button, .ivu-btn, input[type='button'], input[type='submit']"))
      .find((el) => ((el.textContent || el.value || '').replace(/\s+/g, '') === '登录'));
    return { usernameInput, passwordInput, captchaInput, captchaImg, loginButton };
  }

  async function handleUnifiedAuthLogin() {
    const bodyText = (document.body && document.body.innerText) || '';
    const isUnifiedAuth =
      /统一身份认证/.test(bodyText) ||
      !!document.querySelector('img.captcha-img') ||
      /frontend\/login|id\.scu\.edu\.cn|enduser\/sp\/sso/i.test(location.href);
    if (!isUnifiedAuth) return false;
    const els = findCasElements();
    if (!els.usernameInput || !els.passwordInput || !els.captchaInput || !els.captchaImg) return false;
    log('统一认证页');
    const ready = ensureReadyForLogin('cas');
    if (!ready) return true;
    const { conf: c, cred } = ready;
    setInputValue(els.usernameInput, cred.username);
    setInputValue(els.passwordInput, cred.password);
    if (!els.captchaImg.complete) await new Promise((r) => { els.captchaImg.onload = r; setTimeout(r, 2000); });
    const code = await recognizeCaptcha(getBase64FromImage(els.captchaImg), c.ocrUrl);
    setInputValue(els.captchaInput, code);
    log('统一认证验证码：', code);
    if (c.autoSubmit && els.loginButton) { await sleep(c.submitDelay); els.loginButton.click(); }
    return true;
  }

  let loginRunning = false;
  async function mainLogin() {
    if (loginRunning) return;
    loginRunning = true;
    try {
      await sleep(600);
      if (await handleZhjwLogin()) return;
      if (await handleUnifiedAuthLogin()) return;
    } catch (err) {
      console.error('[URP++ 辅助] 登录失败', err);
    } finally {
      loginRunning = false;
    }
  }

  // ===================== 评教逻辑 =====================
  function isEvaluationPage() {
    return /\/student\/teachingEvaluation\/newEvaluation\/evaluation\//i.test(location.pathname || '')
      || !!(document.getElementById('savebutton') && document.getElementById('timer') && document.forms.saveEvaluation);
  }

  function getGlobalScope() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
    } catch (_) {}
    return window;
  }

  // save() 在页面全局；油猴沙箱需注入调用
  function injectPageScript(fn, arg) {
    try {
      const script = document.createElement('script');
      script.textContent = '(' + fn.toString() + ')(' + JSON.stringify(arg == null ? null : arg) + ');';
      const root = document.documentElement || document.head || document.body;
      root.appendChild(script);
      script.remove();
      return true;
    } catch (e) {
      console.warn('[URP++ 辅助] injectPageScript failed', e);
      return false;
    }
  }

  // 到点后仅启用保存按钮（不提前跳过页面倒计时）
  function enableSaveButtonInPage() {
    injectPageScript(function () {
      try {
        var btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
          try { btn.classList.remove('disabled'); } catch (e0) {}
        }
        var ts = document.getElementById('tsxx');
        if (ts) ts.style.display = 'none';
      } catch (e) {
        console.warn('[URP++ 辅助] enable save failed', e);
      }
    });
    const btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
    }
  }

  function questionIndexNear(el) {
    // 向上找「N、」题号
    let node = el;
    for (let i = 0; i < 12 && node; i++) {
      const t = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
      const m = t.match(/(?:^|\n)\s*(\d{1,2})\s*[、.．]/);
      if (m) return m[1];
      // 前一个兄弟
      let prev = node.previousElementSibling;
      let guard = 0;
      while (prev && guard++ < 6) {
        const pt = (prev.innerText || prev.textContent || '').replace(/\s+/g, ' ').trim();
        const pm = pt.match(/^(\d{1,2})\s*[、.．]/);
        if (pm) return pm[1];
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }
    return '';
  }

  function lettersForSingle(qNo, cfg) {
    const per = (cfg.singlePerQ && (cfg.singlePerQ[qNo] || cfg.singlePerQ[String(qNo)])) || '';
    const pool = parseLetters(per || cfg.singleLetters || 'A');
    return pool.length ? pool : ['A'];
  }

  function lettersForMulti(qNo, cfg) {
    const per = (cfg.multiPerQ && (cfg.multiPerQ[qNo] || cfg.multiPerQ[String(qNo)])) || '';
    const pool = parseLetters(per || cfg.multiLetters || 'A,B,C');
    return pool.length ? pool : ['A'];
  }

  function optionLetter(valueOrLabel) {
    const s = String(valueOrLabel || '');
    const m = s.match(/^\s*([A-K])\s*[_\.、:：\-\s]/i) || s.match(/^\s*([A-K])\s*$/i);
    return m ? m[1].toUpperCase() : '';
  }

  function fillScores(cfg) {
    let min = Number(cfg.scoreMin) || 92;
    let max = Number(cfg.scoreMax) || 98;
    if (max < min) { const t = min; min = max; max = t; }
    const inputs = Array.from(document.querySelectorAll('input[data-name="szt"], input[placeholder*="1-100"]'));
    let n = 0;
    inputs.forEach((input) => {
      if (input.type === 'hidden') return;
      const v = String(randInt(min, max));
      setInputValue(input, v);
      n++;
    });
    return n;
  }

  function fillRadios(cfg) {
    const names = [...new Set(Array.from(document.querySelectorAll('input[type="radio"]'))
      .map((r) => r.name)
      .filter((n) => n && !/zcms|week|kszc|jszc/i.test(n)))];
    let filled = 0;
    names.forEach((name) => {
      const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
      if (!radios.length) return;
      // 跳过非问卷（如周次模式）
      if (radios.every((r) => /全周|单周|双周/.test(r.value || ''))) return;
      const qNo = questionIndexNear(radios[0]);
      const pool = lettersForSingle(qNo, cfg);
      const candidates = radios.filter((r) => {
        const letter = optionLetter(r.value) || optionLetter((r.nextSibling && r.nextSibling.textContent) || '') || optionLetter(r.parentElement && r.parentElement.textContent);
        return pool.includes(letter);
      });
      const pick = pickRandom(candidates.length ? candidates : radios);
      if (pick) {
        pick.checked = true;
        pick.dispatchEvent(new Event('click', { bubbles: true }));
        pick.dispatchEvent(new Event('change', { bubbles: true }));
        filled++;
      }
    });
    return filled;
  }

  function fillChecks(cfg) {
    const names = [...new Set(Array.from(document.querySelectorAll('input[type="checkbox"]')).map((c) => c.name).filter(Boolean))];
    let groups = 0;
    names.forEach((name) => {
      const boxes = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
      if (!boxes.length) return;
      const qNo = questionIndexNear(boxes[0]);
      const pool = lettersForMulti(qNo, cfg);
      // 先清空
      boxes.forEach((b) => { b.checked = false; });
      let any = false;
      boxes.forEach((b) => {
        const label = b.value || (b.parentElement && b.parentElement.textContent) || '';
        const letter = optionLetter(b.value) || optionLetter(label);
        if (!pool.includes(letter)) return;
        if (cfg.multiAvoidNone && /以上均无|均无|无以上/.test(label)) return;
        b.checked = true;
        b.dispatchEvent(new Event('click', { bubbles: true }));
        b.dispatchEvent(new Event('change', { bubbles: true }));
        any = true;
      });
      // 若池全被过滤，至少勾一个非「均无」
      if (!any) {
        const fallback = boxes.find((b) => !/以上均无|均无/.test(b.value || b.parentElement && b.parentElement.textContent || '')) || boxes[0];
        if (fallback) {
          fallback.checked = true;
          fallback.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      groups++;
    });
    return groups;
  }

  function fillComments(cfg) {
    const lines = String(cfg.commentTemplates || '')
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const pool = lines.length ? lines : DEFAULT_COMMENTS.split('\n');
    const areas = Array.from(document.querySelectorAll('form[name="saveEvaluation"] textarea, #saveEvaluation textarea, textarea'))
      .filter((t) => t.name || t.closest('form'));
    let n = 0;
    areas.forEach((ta) => {
      // 跳过无关
      if (/kszc|jszc|search/i.test(ta.name || ta.id || '')) return;
      const text = pickRandom(pool) || '老师认真负责，课程收获很大。';
      setTextAreaValue(ta, text.slice(0, ta.maxLength > 0 ? ta.maxLength : 500));
      n++;
    });
    return n;
  }

  function tryAutoSave(cfg) {
    if (!cfg.autoSave && !cfg.__forceSave) return false;
    enableSaveButtonInPage();
    const injected = injectPageScript(function () {
      try {
        var btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
        }
        if (typeof save === 'function') {
          save();
          return;
        }
        if (btn) btn.click();
      } catch (e) {
        console.warn('[URP++ 辅助] page save failed', e);
        try {
          var b2 = document.getElementById('savebutton');
          if (b2) b2.click();
        } catch (e2) {}
      }
    });
    if (injected) {
      log('已请求页面保存');
      return true;
    }
    const btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
      btn.click();
      log('已点击保存按钮');
      return true;
    }
    return false;
  }

  // 记录进入评教页时刻
  let evalPageEnterAt = 0;
  function markEvalPageEnter() {
    if (!isEvaluationPage()) return;
    if (!evalPageEnterAt) evalPageEnterAt = Date.now();
  }

  async function waitBeforeAutoSave(cfg) {
    const need = Math.max(0, Number(cfg.waitSec) || 0);
    if (need <= 0) return 0;
    if (!evalPageEnterAt) evalPageEnterAt = Date.now();
    const elapsed = (Date.now() - evalPageEnterAt) / 1000;
    const remain = Math.ceil(need - elapsed);
    if (remain <= 0) return 0;
    log(`自动保存等待 ${remain}s（不跳过服务端倒计时）`);
    // 轻量状态提示：不改原生 timer 文案逻辑，只在控制台与可选 label 提示
    let left = remain;
    while (left > 0) {
      const tip = document.getElementById('urpppp-eval-wait-tip');
      if (tip) tip.textContent = `评教助手：约 ${left} 秒后自动保存`;
      await sleep(1000);
      left -= 1;
    }
    const tip = document.getElementById('urpppp-eval-wait-tip');
    if (tip) tip.textContent = '评教助手：正在自动保存…';
    return remain;
  }

  function ensureWaitTip() {
    if (!isEvaluationPage()) return;
    if (document.getElementById('urpppp-eval-wait-tip')) return;
    const host = document.querySelector('.right_top_oper') || document.querySelector('#savebutton') && document.getElementById('savebutton').parentElement;
    if (!host) return;
    const tip = document.createElement('span');
    tip.id = 'urpppp-eval-wait-tip';
    host.appendChild(tip);
  }

  let evalRunning = false;
  async function runEvaluationAssist(opts) {
    opts = opts || {};
    if (!isEvaluationPage()) return false;
    markEvalPageEnter();
    ensureWaitTip();
    updateBatchHud();
    const cfg = evalConf();
    const batch = getBatchState();
    // 全自动队列中：强制填+保存
    const forceSave = !!(opts.forceSave || batch.active);
    const forceFill = !!(opts.force || cfg.autoFill || batch.active);
    if (!cfg.enabled && !opts.force && !batch.active) return false;
    if (evalRunning) return false;
    evalRunning = true;
    try {
      log('评教页处理开始', cfg, batch);
      if (forceFill) {
        const s = fillScores(cfg);
        const r = fillRadios(cfg);
        const m = fillChecks(cfg);
        const t = fillComments(cfg);
        log(`已填充：分数${s} 单选${r} 多选${m} 主观${t}`);
        setBatchTip(`已填写，等待 ${cfg.waitSec}s 后保存（${batch.active ? ('队列 ' + (batch.index + 1) + '/' + batch.queue.length) : '单页'}）`);
      }
      if (cfg.autoSave || forceSave) {
        await waitBeforeAutoSave(cfg);
        await sleep(cfg.saveDelay || 0);
        enableSaveButtonInPage();
        // 批量模式：拦截 doSave 成功后再跳下一项
        if (batch.active) installSaveSuccessWatcher();
        tryAutoSave(Object.assign({}, cfg, { autoSave: true, __forceSave: true }));
        // 兜底：若页面 save 成功会自己跳转列表；这里再等一会儿检查是否还在填写页
        if (batch.active) {
          await sleep(2500);
          // 若仍在填写页且未跳转，尝试直接回列表继续（可能保存失败）
          if (isEvaluationPage()) {
            log('保存后仍停留在填写页，可能失败；停止或回列表重试');
            setBatchTip('保存可能失败，请检查后重试/停止全自动');
          }
        }
      }
      return true;
    } catch (e) {
      console.error('[URP++ 辅助] 评教失败', e);
      return false;
    } finally {
      evalRunning = false;
    }
  }

  // ===================== 全自动评教（列表 → 逐份填写 → 保存后继续） =====================
  const EVAL_LIST_PATH = '/student/teachingEvaluation/newEvaluation/index';

  function isEvaluationListPage() {
    const p = String(location.pathname || '');
    return /\/student\/teachingEvaluation\/newEvaluation\/index/i.test(p);
  }

  function setBatchTip(text) {
    const el = document.getElementById('urpppp-eval-wait-tip') || document.getElementById('urpppp-batch-hud');
    if (el) el.textContent = text || '';
    log(text);
  }

  function updateBatchHud() {
    const batch = getBatchState();
    let hud = document.getElementById('urpppp-batch-hud');
    if (!batch.active) {
      if (hud) hud.remove();
      return;
    }
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'urpppp-batch-hud';
      document.documentElement.appendChild(hud);
      // 确保样式已注入（即使设置面板未打开）
      settingsStyles();
    }
    const total = (batch.queue || []).length;
    const cur = Math.min(batch.index + 1, total);
    const item = batch.queue[batch.index];
    hud.innerHTML = `<div class="urpppp-hud-title">全自动评教进行中</div>
      <div class="urpppp-hud-line">进度：${cur}/${total}</div>
      <div class="urpppp-hud-course">${escapeHtml((item && item.title) || '')}</div>
      <button type="button" id="urpppp-batch-hud-stop">停止</button>`;
    const stop = document.getElementById('urpppp-batch-hud-stop');
    if (stop) stop.onclick = () => { clearBatchState(); updateBatchHud(); setBatchTip('已停止全自动评教'); };
  }

  function scanUnevaluatedFromList() {
    const out = [];
    const seen = new Set();
    document.querySelectorAll('a[onclick*="evaluation("], button[onclick*="evaluation("]').forEach((a) => {
      const oc = a.getAttribute('onclick') || '';
      // evaluation(this, "KTID","01","0",...)
      const m = oc.match(/evaluation\s*\(\s*this\s*,\s*["']([0-9A-Fa-f]+)["']/);
      if (!m) return;
      const ktid = m[1];
      if (seen.has(ktid)) return;
      const tr = a.closest('tr');
      const rowText = ((tr && tr.innerText) || a.innerText || '').replace(/\s+/g, ' ').trim();
      // 仅未评估：操作文案为「评估」或行内含「否」
      const opText = (a.textContent || '').replace(/\s+/g, '');
      if (!(opText === '评估' || /\s否\s|是否已评估.*否|\b否\b/.test(rowText))) return;
      // 标题：优先课程名单元格
      let title = '';
      if (tr) {
        const tds = Array.from(tr.cells || []).map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim());
        title = tds[4] || tds[2] || tds.find((t) => t && !/^\d+$/.test(t) && t !== '评估' && t !== '否') || rowText;
      }
      seen.add(ktid);
      out.push({
        ktid,
        url: '/student/teachingEvaluation/newEvaluation/evaluation/' + ktid,
        title: String(title || ktid).slice(0, 80)
      });
    });
    return out;
  }

  async function startFullAutoEvaluation() {
    // 允许在列表页启动；若在其它页，跳到列表再由 resume 接管
    if (!isEvaluationListPage()) {
      // 先记一个空队列标记，到列表后重扫
      setBatchState({ active: true, queue: [], index: 0 });
      location.href = EVAL_LIST_PATH;
      return 0;
    }
    await sleep(400);
    const queue = scanUnevaluatedFromList();
    if (!queue.length) {
      clearBatchState();
      updateBatchHud();
      return 0;
    }
    setBatchState({ active: true, queue, index: 0 });
    updateBatchHud();
    log('全自动队列', queue);
    // 进入第一份
    await sleep(Math.max(0, (evalConf().batchGapSec || 0) * 1000));
    location.href = queue[0].url;
    return queue.length;
  }

  async function resumeFullAutoOnList() {
    const batch = getBatchState();
    if (!batch.active) return false;
    if (!isEvaluationListPage()) return false;
    await sleep(600);
    // 队列空：刚从设置跳来，重扫
    let queue = batch.queue || [];
    let index = batch.index || 0;
    if (!queue.length) {
      queue = scanUnevaluatedFromList();
      index = 0;
      if (!queue.length) {
        clearBatchState();
        updateBatchHud();
        setBatchTip('全自动完成：没有未评估问卷');
        alert('全自动评教完成：当前没有未评估问卷');
        return true;
      }
      setBatchState({ active: true, queue, index: 0 });
    }
    // 每回到列表，重新扫描未评估，避免队列陈旧
    const fresh = scanUnevaluatedFromList();
    if (!fresh.length) {
      clearBatchState();
      updateBatchHud();
      setBatchTip('全自动完成：全部评教已完成');
      alert('全自动评教完成：全部已评估');
      return true;
    }
    // 用最新未评估列表继续
    setBatchState({ active: true, queue: fresh, index: 0 });
    updateBatchHud();
    const next = fresh[0];
    setBatchTip(`全自动：下一项 ${next.title}`);
    await sleep(Math.max(300, (evalConf().batchGapSec || 0) * 1000));
    location.href = next.url;
    return true;
  }

  function installSaveSuccessWatcher() {
    if (window.__urppppSaveWatch) return;
    window.__urppppSaveWatch = true;
    // 监听页面 jQuery ajax 成功（doSave）
    injectPageScript(function () {
      try {
        if (!window.jQuery || window.__urppppAjaxHooked) return;
        window.__urppppAjaxHooked = true;
        var $ = window.jQuery;
        var orig = $.ajax;
        $.ajax = function (opts) {
          var o = opts || {};
          var url = o.url || '';
          if (/doSave/i.test(url)) {
            var userSuccess = o.success;
            o = Object.assign({}, o, {
              success: function (data, status, xhr) {
                try {
                  window.dispatchEvent(new CustomEvent('urpppp-eval-saved', { detail: data || {} }));
                } catch (e) {}
                if (typeof userSuccess === 'function') userSuccess(data, status, xhr);
              }
            });
            return orig.call(this, o);
          }
          return orig.apply(this, arguments);
        };
      } catch (e) {
        console.warn('[URP++ 辅助] ajax hook failed', e);
      }
    });
    window.addEventListener('urpppp-eval-saved', async (ev) => {
      const data = (ev && ev.detail) || {};
      const batch = getBatchState();
      if (!batch.active) return;
      const ok = data && (data.result === 'ok' || (typeof data.result === 'string' && data.result.indexOf('/') !== -1));
      if (!ok && data.result && data.result !== 'ok') {
        log('保存返回非 ok', data);
        // 仍尝试继续：回到列表重扫未评估
      }
      setBatchTip('保存成功，返回列表继续…');
      // 推进索引后回列表；列表页会重扫未评估并继续
      setBatchState({
        active: true,
        queue: batch.queue,
        index: (batch.index || 0) + 1
      });
      await sleep(Math.max(500, (evalConf().batchGapSec || 0) * 1000));
      location.href = EVAL_LIST_PATH;
    });
  }

  // ===================== 启动 =====================
  try {
    GM_registerMenuCommand('URP++辅助：打开设置说明', () => {
      alert('请启用 URP++ 主脚本，点击顶栏齿轮，在设置底部配置「登录助手」「评教助手」。');
    });
    GM_registerMenuCommand('URP++辅助：立即识别登录验证码', () => { mainLogin(); });
    GM_registerMenuCommand('URP++辅助：立即处理当前评教页', () => { runEvaluationAssist({ force: true, forceSave: true }); });
    GM_registerMenuCommand('URP++辅助：启动全自动评教', () => { startFullAutoEvaluation(); });
    GM_registerMenuCommand('URP++辅助：停止全自动评教', () => { clearBatchState(); updateBatchHud(); });
  } catch (_) {}

  try {
    window.__urppppAssist = {
      loginConf,
      evalConf,
      runLogin: mainLogin,
      runEval: runEvaluationAssist,
      startFullAuto: startFullAutoEvaluation,
      stopFullAuto: () => { clearBatchState(); updateBatchHud(); },
      injectSettings: injectSettingsPanel
    };
  } catch (_) {}

  watchSettingsPanel();

  // 登录
  const maybeLogin =
    /\/login/i.test(location.pathname || '') ||
    /login/i.test(location.href) ||
    /统一身份认证|frontend\/login/i.test(document.title + location.href);
  if (maybeLogin) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mainLogin);
    else mainLogin();
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
