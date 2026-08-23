import { SESSION_KEYS } from './constants.js';

export function createLoginAssist({ config, storage, deps }) {
  const { getBool, setVal } = storage;
  const { LOGIN, LOGIN_FAILURE_LIMIT, DEFAULT_OCR_EXAMPLE } = deps.constants;

  function buildLoginSection() {
    const c = config.loginConf();
    const autoSend2fa = getBool(SESSION_KEYS.autoSend2fa, true);
    const sec = document.createElement('section');
    sec.className = 'urppp-set-sec urpppp-sec';
    sec.id = 'urpppp-login-sec';
    sec.innerHTML = `
      <h3>登录助手</h3>
      <p class="urppp-set-tip">自动填写账号密码、OCR 识别验证码。同一次自动登录过程连续失败 ${LOGIN_FAILURE_LIMIT} 次后暂停提交，由用户手动填写验证码并接管登录。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-login-enabled">功能：${c.enabled ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-auto">识别后自动登录：${c.autoSubmit ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-share">教务/统一认证共用账密：${c.shareCred ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-persist-password">持久保存密码：${c.passwordStorage === 'persistent' ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-login-autosend2fa">统一认证 2FA 自动获取验证码：${autoSend2fa ? '开' : '关'}</button>
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
    sec.querySelector('#urpppp-login-zhjw-pass').value = c.zhjwPass;
    sec.querySelector('#urpppp-login-cas-pass').value = c.casPass;
    return sec;
  }

  function bindLoginSection(sec) {
    let enabled = getBool(LOGIN.enabled, true);
    let autoSubmit = getBool(LOGIN.autoSubmit, true);
    let shareCred = getBool(LOGIN.shareCred, true);
    let persistPassword = config.loginConf().passwordStorage === 'persistent';
    let autoSend2fa = getBool(SESSION_KEYS.autoSend2fa, true);
    const enabledBtn = sec.querySelector('#urpppp-login-enabled');
    const autoBtn = sec.querySelector('#urpppp-login-auto');
    const shareBtn = sec.querySelector('#urpppp-login-share');
    const persistBtn = sec.querySelector('#urpppp-login-persist-password');
    const autoSend2faBtn = sec.querySelector('#urpppp-login-autosend2fa');
    const toggleCas = () => {
      sec.querySelectorAll('.urpppp-cas-user,.urpppp-cas-pass').forEach((r) => {
        r.style.display = shareCred ? 'none' : 'grid';
      });
    };
    deps.syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    deps.syncToggle(autoBtn, autoSubmit, '识别后自动登录：开', '识别后自动登录：关');
    deps.syncToggle(shareBtn, shareCred, '教务/统一认证共用账密：开', '教务/统一认证共用账密：关');
    deps.syncToggle(persistBtn, persistPassword, '持久保存密码：开', '持久保存密码：关');
    deps.syncToggle(autoSend2faBtn, autoSend2fa, '统一认证 2FA 自动获取验证码：开', '统一认证 2FA 自动获取验证码：关');
    toggleCas();

    autoSend2faBtn.onclick = () => {
      autoSend2fa = !autoSend2fa;
      setVal(SESSION_KEYS.autoSend2fa, autoSend2fa);
      deps.syncToggle(autoSend2faBtn, autoSend2fa, '统一认证 2FA 自动获取验证码：开', '统一认证 2FA 自动获取验证码：关');
    };

    enabledBtn.onclick = () => {
      enabled = !enabled; setVal(LOGIN.enabled, enabled);
      if (enabled) config.resetLoginGuardState('');
      deps.syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    };
    autoBtn.onclick = () => {
      autoSubmit = !autoSubmit; setVal(LOGIN.autoSubmit, autoSubmit);
      deps.syncToggle(autoBtn, autoSubmit, '识别后自动登录：开', '识别后自动登录：关');
    };
    shareBtn.onclick = () => {
      shareCred = !shareCred; setVal(LOGIN.shareCred, shareCred);
      deps.syncToggle(shareBtn, shareCred, '教务/统一认证共用账密：开', '教务/统一认证共用账密：关');
      toggleCas();
    };
    persistBtn.onclick = () => {
      persistPassword = !persistPassword;
      deps.syncToggle(persistBtn, persistPassword, '持久保存密码：开', '持久保存密码：关');
    };
    sec.querySelector('#urpppp-login-save').onclick = () => {
      setVal(LOGIN.ocrUrl, (sec.querySelector('#urpppp-login-ocr').value || '').trim());
      setVal(LOGIN.submitDelay, String(Math.max(0, parseInt(sec.querySelector('#urpppp-login-delay').value, 10) || 300)));
      setVal(LOGIN.zhjwUser, (sec.querySelector('#urpppp-login-zhjw-user').value || '').trim());
      setVal(LOGIN.zhjwPass, persistPassword ? sec.querySelector('#urpppp-login-zhjw-pass').value || '' : '');
      setVal(LOGIN.casUser, (sec.querySelector('#urpppp-login-cas-user').value || '').trim());
      setVal(LOGIN.casPass, persistPassword ? sec.querySelector('#urpppp-login-cas-pass').value || '' : '');
      setVal(LOGIN.passwordStorage, persistPassword ? 'persistent' : 'none');
      setVal(LOGIN.enabled, enabled);
      setVal(LOGIN.autoSubmit, autoSubmit);
      setVal(LOGIN.shareCred, shareCred);
      if (!persistPassword) {
        sec.querySelector('#urpppp-login-zhjw-pass').value = '';
        sec.querySelector('#urpppp-login-cas-pass').value = '';
      }
      config.resetLoginGuardState('');
      deps.setStatus('urpppp-login-status', persistPassword
        ? '登录设置已保存；密码将持久保存在脚本存储中，请确认你接受风险。'
        : '登录设置已保存；密码未持久化，连续失败计数已清零', 'ok');
    };
    sec.querySelector('#urpppp-login-clear').onclick = () => {
      setVal(LOGIN.zhjwUser, ''); setVal(LOGIN.zhjwPass, '');
      setVal(LOGIN.casUser, ''); setVal(LOGIN.casPass, '');
      setVal(LOGIN.passwordStorage, 'none');
      sec.querySelector('#urpppp-login-zhjw-user').value = '';
      sec.querySelector('#urpppp-login-zhjw-pass').value = '';
      sec.querySelector('#urpppp-login-cas-user').value = '';
      sec.querySelector('#urpppp-login-cas-pass').value = '';
      persistPassword = false;
      deps.syncToggle(persistBtn, false, '持久保存密码：开', '持久保存密码：关');
      config.resetLoginGuardState('');
      deps.setStatus('urpppp-login-status', '已清除账密和连续失败计数', 'ok');
    };
  }

  // 验证码识别：统一认证（cas）本地优先（v3 质心模板，97.8%）；
  // 教务（zhjw）本地 CNN 优先（~81%），低置信走线上兜底。
  const recognizeSmart = async (img, ocrUrl, kind) => {
    let local = null;
    let conf = 1;
    if (kind === 'cas' && typeof deps.recognizeLocalCaptcha === 'function') {
      local = deps.recognizeLocalCaptcha(img);
    } else if (kind === 'zhjw' && typeof deps.recognizeZhjwCaptcha === 'function') {
      const r = deps.recognizeZhjwCaptcha(img);
      if (r) { local = r.code; conf = r.conf; }
    }
    const confThreshold = 0.5; // 四字符联合置信度：zhjw 低置信走线上，cas 本地已足够可靠
    if (local && /^[a-z0-9]{4}$/i.test(local) && (kind === 'cas' || conf >= confThreshold)) {
      deps.log('验证码（本地）', local);
      return local;
    }
    const url = String(ocrUrl || '').trim();
    if (!url) {
      deps.log(kind === 'cas' ? '本地识别失败且未配置线上 OCR，等待手动填写' : '本地识别低置信且未配置线上 OCR，等待手动填写');
      return '';
    }
    const code = await deps.recognizeCaptchaWithRequest(
      deps.getBase64FromImage(img),
      url,
      typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null,
    );
    deps.log('验证码（线上）', code);
    return code;
  };

  function credFor(kind, c) {
    if (c.shareCred || kind === 'zhjw') return { username: c.zhjwUser, password: c.zhjwPass };
    return { username: c.casUser || c.zhjwUser, password: c.casPass || c.zhjwPass };
  }

  function ensureReadyForLogin(kind) {
    const c = config.loginConf();
    if (!c.enabled) return null;
    const cred = credFor(kind, c);
    if (!cred.username || !cred.password) { deps.log('未配置账密，请到设置 → 登录助手'); return null; }
    return { conf: c, cred };
  }

  function fillLoginCredentials(usernameInput, passwordInput, cred) {
    const users = [usernameInput, document.getElementById('urppp-user')];
    const passwords = [passwordInput, document.getElementById('urppp-pass')];
    Array.from(new Set(users.filter(Boolean))).forEach((el) => deps.setInputValue(el, cred.username));
    Array.from(new Set(passwords.filter(Boolean))).forEach((el) => deps.setInputValue(el, cred.password));
  }

  function fillLoginCaptcha(captchaInput, code) {
    const inputs = [captchaInput, document.getElementById('urppp-cap')];
    Array.from(new Set(inputs.filter(Boolean))).forEach((el) => deps.setInputValue(el, code));
  }

  function refreshLoginCaptchaImage(captchaImg) {
    if (!captchaImg || !captchaImg.src) return;
    let refreshed = captchaImg.src;
    try {
      const url = new URL(captchaImg.src, location.href);
      url.searchParams.set('_urpppp', String(Date.now()));
      refreshed = url.href;
    } catch (_) { /* ignore */ }
    captchaImg.src = refreshed;
    const visibleImg = document.getElementById('urppp-capimg');
    if (visibleImg) visibleImg.src = refreshed;
  }

  function ensureLoginGuardStyles() {
    if (document.getElementById('urpppp-login-guard-style')) return;
    const style = document.createElement('style');
    style.id = 'urpppp-login-guard-style';
    style.textContent = deps.loginGuardStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function removeLoginGuardNotice() {
    const notice = document.getElementById('urpppp-login-guard-notice');
    if (notice) notice.remove();
  }

  function resumeAutoLogin() {
    config.resetLoginGuardState('');
    removeLoginGuardNotice();
    setTimeout(() => { mainLogin(); }, 0);
  }

  function showLoginGuardNotice(state) {
    if (!state || (!state.failures && !state.paused)) {
      removeLoginGuardNotice();
      return;
    }
    const host = document.getElementById('urppp-form')
      || document.querySelector('.form-signin')
      || document.querySelector('form');
    if (!host) return;
    ensureLoginGuardStyles();
    let notice = document.getElementById('urpppp-login-guard-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'urpppp-login-guard-notice';
      notice.setAttribute('role', 'status');
    }
    notice.innerHTML = '';
    const title = document.createElement('strong');
    const text = document.createElement('span');
    title.textContent = state.paused ? '自动登录已暂停' : `自动登录失败 ${state.failures}/${LOGIN_FAILURE_LIMIT}`;
    text.textContent = state.paused
      ? '连续登录失败已达上限。学号和密码已填好，请手动输入验证码后登录。'
      : `正在重新识别验证码；达到 ${LOGIN_FAILURE_LIMIT} 次后将改为手动接管。`;
    notice.append(title, text);
    if (state.paused) {
      const resume = document.createElement('button');
      resume.type = 'button';
      resume.textContent = '恢复自动登录';
      resume.addEventListener('click', resumeAutoLogin);
      notice.appendChild(resume);
    }
    host.insertBefore(notice, host.firstChild);
  }

  async function handleZhjwLogin() {
    const usernameInput = document.getElementById('input_username');
    const passwordInput = document.getElementById('input_password');
    const captchaInput = document.getElementById('input_checkcode');
    const captchaImg = document.getElementById('captchaImg') || document.querySelector('.form-signin img');
    const loginButton = document.getElementById('loginButton');
    if (!usernameInput || !passwordInput || !captchaInput || !captchaImg) return false;
    deps.log('教务登录页');
    const ready = ensureReadyForLogin('zhjw');
    if (!ready) return true;
    const { conf: c, cred } = ready;
    fillLoginCredentials(usernameInput, passwordInput, cred);
    const guard = config.beginLoginProcess('zhjw', cred.username);
    showLoginGuardNotice(guard);
    if (guard.paused) return true;
    if (guard.failures > 0) refreshLoginCaptchaImage(captchaImg);
    fillLoginCaptcha(captchaInput, '');
    if (!captchaImg.complete) await new Promise((resolve) => { captchaImg.onload = resolve; setTimeout(resolve, 2000); });
    const code = await recognizeSmart(captchaImg, c.ocrUrl, 'zhjw');
    if (!code) return true;
    fillLoginCaptcha(captchaInput, code);
    deps.log('教务验证码：', code);
    if (c.autoSubmit && loginButton) {
      await deps.sleep(c.submitDelay);
      config.markPendingAutoLogin('zhjw', cred.username);
      loginButton.click();
    }
    return true;
  }

  function findCasElements() {
    const inputs = Array.from(document.querySelectorAll('input'));
    const usernameInput =
      inputs.find((i) => /账号|学号|用户名|username|user/i.test(i.placeholder || i.name || i.id || '')) ||
      inputs.find((i) => i.type === 'text' && !/验证码|captcha|check/i.test(i.placeholder || i.name || i.id || ''));
    const passwordInput = inputs.find((i) => i.type === 'password');
    const captchaInput =
      inputs.find((i) => /验证码|captcha|checkcode|verifycode|verification/i.test(i.placeholder || i.name || i.id || '')) ||
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
    deps.log('统一认证页');
    const ready = ensureReadyForLogin('cas');
    if (!ready) return true;
    const { conf: c, cred } = ready;
    fillLoginCredentials(els.usernameInput, els.passwordInput, cred);
    const guard = config.beginLoginProcess('cas', cred.username);
    showLoginGuardNotice(guard);
    if (guard.paused) return true;
    fillLoginCaptcha(els.captchaInput, '');
    if (!els.captchaImg.complete) await new Promise((resolve) => { els.captchaImg.onload = resolve; setTimeout(resolve, 2000); });
    const code = await recognizeSmart(els.captchaImg, c.ocrUrl, 'cas');
    if (!code) return true;
    fillLoginCaptcha(els.captchaInput, code);
    deps.log('统一认证验证码：', code);
    if (c.autoSubmit && els.loginButton) {
      await deps.sleep(c.submitDelay);
      config.markPendingAutoLogin('cas', cred.username);
      els.loginButton.click();
    }
    return true;
  }

  let loginRunning = false;
  async function mainLogin() {
    if (loginRunning) return;
    loginRunning = true;
    try {
      await deps.sleep(600);
      if (await handleZhjwLogin()) return;
      if (await handleUnifiedAuthLogin()) return;
    } catch (error) {
      console.error('[URP++ 辅助] 登录失败', error);
    } finally {
      loginRunning = false;
    }
  }

  return {
    bindLoginSection,
    buildLoginSection,
    mainLogin,
    resumeAutoLogin,
  };
}
