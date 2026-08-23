import { DEFAULT_KEEPALIVE_URL, SESSION_KEYS } from './constants.js';

const SESSION_KEY_ENABLED = SESSION_KEYS.keepAliveEnabled;
const SESSION_KEY_INTERVAL = SESSION_KEYS.keepAliveInterval;
const SESSION_KEY_URL = SESSION_KEYS.keepAliveUrl;

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

/**
 * 会话保持与 2FA 自动化（辅助插件）
 *
 * 1) 保活（Keep-alive）：在教务系统页面定时请求一个轻量的同域接口，
 *    让服务端空闲会话计时器持续重置，避免"一段时间不操作就掉登录态"。
 *    - 心跳目标默认用本学期课表页（GET、服务端渲染、会话失效时自动回登录页，可作登录态自检）
 * 2) 2FA 自动发送：在统一认证登录页走到"短信认证"（手机验证码）步骤时，
 *    自动点击"获取验证码"按钮发送短信码，省去一次手动点击。
 *    不会自动填 6 位短信码（需用户手机收码）。
 */

export function createSessionAssist({ config, storage, deps }) {
  const { getBool, getNum, getStr, setVal } = storage;
  const { setStatus, syncToggle, escapeAttr, log } = deps;

  // ===================== 页面域判定 =====================

  function isKeepaliveHost() {
    const host = String(location.hostname || '');
    // 教务 URP：zhjw.scu.edu.cn / 202.115.47.141；webvpn 为访问教务的代理
    if (/^zhjw\./i.test(host)) return true;
    if (/^202\.115\.47\.141$/i.test(host)) return true;
    if (/webvpn/i.test(host)) return true;
    return false;
  }

  function isLoginPath() {
    const path = String(location.pathname || '');
    const href = String(location.href || '');
    if (/login/i.test(path)) return true;
    if (/frontend\/login/i.test(href)) return true;
    return false;
  }

  function is2faDomain() {
    // 统一认证在 id.scu.edu.cn（及可能 webvpn 代理），以 id. 前缀识别，避免教务域误装监听
    return /^id\./i.test(String(location.hostname || ''));
  }

  function is2faPage() {
    const href = String(location.href || '');
    // 实测 2FA 界面 URL 形如 .../frontend/login#/second/auth
    if (/#\/(second|mfa|verify)/i.test(href)) return true;
    const bodyText = String(document.body ? document.body.innerText : '');
    if (/短信认证|手机验证码|安全码|二次验证|2FA/i.test(bodyText) && /获取验证码/.test(bodyText)) return true;
    return false;
  }

  // ===================== 保活 =====================

  let keepAliveTimer = 0;

  async function beat() {
    const conf = config.sessionConf();
    if (!conf.keepAliveEnabled) return;
    if (!isKeepaliveHost() || isLoginPath()) return;
    // 保活目的就是“用户不操作/切后台时不掉线”，后台标签仍要发心跳
    // （Chrome 对后台标签 setInterval 会节流，但不会完全停，8 分钟间隔足够跑）

    let url;
    try {
      url = new URL(conf.keepAliveUrl, location.origin).href;
    } catch (_) { return; }

    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        redirect: 'follow',
      });
      // 会话失效：教务系统会把请求重定向回登录页
      if (/login/i.test(String(res.url || '')) && !/thisSemesterCurriculum|second|auth/i.test(String(res.url || ''))) {
        stopKeepAlive();
        log('会话保持：登录态已失效，停止心跳');
      }
    } catch (_) { /* 网络异常静默 */ }
  }

  function startKeepAlive() {
    const conf = config.sessionConf();
    if (!conf.keepAliveEnabled) return;
    if (!isKeepaliveHost() || isLoginPath()) return;
    if (keepAliveTimer) return;
    const interval = Math.max(60, conf.keepAliveInterval) * 1000;
    keepAliveTimer = setInterval(beat, interval);
    beat();
    log(`会话保持：已启动（每 ${conf.keepAliveInterval}s 心跳）`);
  }

  function stopKeepAlive() {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = 0;
    }
  }

  // ===================== 2FA 自动发送验证码 =====================

  let installed2fa = false;

  function findSendButton() {
    const btns = Array.from(document.querySelectorAll('button, .btn, .ivu-btn, .el-button, [role="button"]'));
    return btns.find((b) => {
      const t = String(b.innerText || b.textContent || '').replace(/\s+/g, '');
      if (!/获取验证码|获取短信|发送验证码|发送短信/.test(t)) return false;
      // 已进入"重新获取/倒计时/已发送"态则不再点
      if (/重新|已发送|重发|请稍候|\(\d+|\d+s|秒/.test(t)) return false;
      return true;
    });
  }

  function hasVisibleOverlay() {
    const overlays = document.querySelectorAll('.ivu-modal-wrap, .ivu-modal, .el-dialog__wrapper, .el-overlay');
    return Array.from(overlays).some((el) => {
      const st = getComputedStyle(el);
      return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
    });
  }

  function send2faOnce() {
    const conf = config.sessionConf();
    if (!conf.autoSend2fa) return;
    if (!is2faPage()) return;
    // 风控弹出"身份认证"等可见 modal 挡住主界面时，不强行点主区域按钮
    if (hasVisibleOverlay()) return;
    const btn = findSendButton();
    if (!btn) return;
    if (btn.getAttribute('data-urpppp2fa-sent') === '1') return;
    btn.setAttribute('data-urpppp2fa-sent', '1');
    try { btn.click(); } catch (_) { /* ignore */ }
    log('2FA：已自动点击「获取验证码」发送短信');
  }

  function install2faAutoSend() {
    if (installed2fa) return;
    installed2fa = true;
    // 立即试一次（页面可能已渲染完成）
    setTimeout(send2faOnce, 300);
    // SPA 组件/验证码按钮可能晚出，轮询 + DOM 观察兜底
    let tries = 0;
    const timer = setInterval(() => {
      send2faOnce();
      tries += 1;
      if (tries >= 25) clearInterval(timer);
    }, 800);
    const observer = new MutationObserver(() => send2faOnce());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // 页面卸载时清理 observer
    window.addEventListener('beforeunload', () => {
      try { observer.disconnect(); } catch (_) { /* ignore */ }
    }, { once: true });
  }

  // ===================== 设置面板 =====================

  function buildSessionSection() {
    const c = config.sessionConf();
    const sec = document.createElement('section');
    sec.className = 'urppp-set-sec urpppp-sec';
    sec.id = 'urpppp-session-sec';
    sec.innerHTML = `
      <h3>会话保持</h3>
      <p class="urppp-set-tip">在教务系统页面定时静默请求，避免仅放置不操作就被登出。只在教务系统页面生效。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-session-keepalive">会话保活：${c.keepAliveEnabled ? '开' : '关'}</button>
      </div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>心跳间隔(秒)</label><input type="number" id="urpppp-session-interval" min="60" step="60" value="${escapeAttr(String(c.keepAliveInterval))}" /></div>
        <div class="urpppp-row"><label>心跳接口(可选)</label><input type="text" id="urpppp-session-url" placeholder="留空用默认" value="${escapeAttr(confKeepAliveUrlPreview(c))}" spellcheck="false" /></div>
      </div>
      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-session-save">保存会话设置</button>
      </div>
      <div class="urpppp-status" id="urpppp-session-status"></div>
    `;
    return sec;
  }

  // 设置里展示默认值时，不写死完整接口路径到输入框（为空即默认）
  function confKeepAliveUrlPreview(c) {
    if (c.keepAliveUrl && c.keepAliveUrl !== DEFAULT_KEEPALIVE_URL) return c.keepAliveUrl;
    return '';
  }

  function bindSessionSection(sec) {
    const keepAlive = config.sessionConf().keepAliveEnabled;
    const keepBtn = sec.querySelector('#urpppp-session-keepalive');
    syncToggle(keepBtn, keepAlive, '会话保活：开', '会话保活：关');

    keepBtn.onclick = () => {
      const next = !getBool(SESSION_KEY_ENABLED, true);
      setVal(SESSION_KEY_ENABLED, next);
      syncToggle(keepBtn, next, '会话保活：开', '会话保活：关');
      if (next) startKeepAlive(); else stopKeepAlive();
    };

    sec.querySelector('#urpppp-session-save').onclick = () => {
      const interval = Math.max(60, Math.min(3600, parseInt(sec.querySelector('#urpppp-session-interval').value, 10) || 480));
      const url = String(sec.querySelector('#urpppp-session-url').value || '').trim();
      setVal(SESSION_KEY_INTERVAL, String(interval));
      setVal(SESSION_KEY_URL, url);
      // 间隔改了最好重启心跳以生效
      stopKeepAlive();
      if (getBool(SESSION_KEY_ENABLED, true)) startKeepAlive();
      setStatus('urpppp-session-status', '会话设置已保存', 'ok');
    };
  }

  return {
    buildSessionSection,
    bindSessionSection,
    install2faAutoSend,
    startKeepAlive,
    stopKeepAlive,
    is2faDomain,
    is2faPage,
  };
}

