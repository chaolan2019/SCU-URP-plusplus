export function createUpdateAssist({ deps }) {
  // fetch 优先（CORS 机制，无需 GM 跨域授权弹窗）；失败再降级 GM_xmlhttpRequest（@connect 白名单兜底）
  function fetchAssistWithTimeout(url, headers, timeoutMs) {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    return fetch(url, { cache: 'no-store', headers, signal: ctrl ? ctrl.signal : undefined })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .finally(() => { if (timer) clearTimeout(timer); });
  }

  function gmAssistRequest(url, headers) {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          timeout: 12000,
          headers,
          onload: (r) => {
            if (r.status >= 200 && r.status < 400) resolve(r.responseText || '');
            else reject(new Error('HTTP ' + r.status));
          },
          onerror: () => reject(new Error('network error')),
          ontimeout: () => reject(new Error('timeout')),
        });
      } catch (e) { reject(e); }
    });
  }

  function fetchAssistUrl(url, opts) {
    const headers = { 'Cache-Control': 'no-cache' };
    if (opts && opts.range) headers.Range = opts.range;
    return fetchAssistWithTimeout(url, headers, 12000)
      .catch((fetchError) => {
        if (typeof GM_xmlhttpRequest === 'function') return gmAssistRequest(url, headers);
        throw fetchError;
      });
  }

  // 多源探测：主源（GitHub 权威）优先，primaryTimeout 内未响应则并发切换加速源；主源稍后返回也参与竞争
  async function fetchAssistFirstAvailable(urls, opts, primaryTimeout = 1000) {
    const details = [];
    const primary = urls[0];
    const fallbacks = urls.slice(1);
    const grab = (url) => fetchAssistUrl(url, opts)
      .then((text) => ({ url, text }))
      .catch((e) => { details.push((url.split('/')[2] || url) + ': ' + (e && e.message || e)); return null; });

    const primaryJob = grab(primary);
    const timeoutMark = new Promise((resolve) => setTimeout(() => resolve('__TIMEOUT__'), primaryTimeout));
    const first = await Promise.race([primaryJob, timeoutMark]);
    if (first !== '__TIMEOUT__') {
      if (first && first.text && first.text.length > 0) return first.text;
      const fb = await Promise.all(fallbacks.map(grab));
      const ok = fb.find((r) => r && r.text && r.text.length > 0);
      if (ok) return ok.text;
      throw new Error('所有更新源均不可用（' + details.join('; ') + '）');
    }
    // 主源超时：加速源并发；主源迟到成功才参与竞争（失败/无效不影响 fallback，避免抢先 reject）
    const fallbackJob = Promise.all(fallbacks.map(grab)).then((results) => {
      const ok = results.find((r) => r && r.text && r.text.length > 0);
      if (ok) return ok.text;
      throw new Error('所有更新源均不可用（' + details.join('; ') + '）');
    });
    const latePrimary = primaryJob
      .then((r) => {
        if (r && r.text && r.text.length > 0) return r.text;
        throw new Error('主源内容无效');
      })
      .catch(() => new Promise(() => {})); // 主源失败/无效：让位给 fallback
    return Promise.race([latePrimary, fallbackJob]);
  }

  // 远程版本探测：优先多源 version.json（assist 字段），失败回退 Range 拉脚本头
  async function fetchAssistRemoteVersion() {
    try {
      const text = await fetchAssistFirstAvailable(deps.URPPPP_SOURCES);
      const j = JSON.parse(text);
      const assist = String((j && j.assist) || '').trim();
      if (assist) return assist;
    } catch (_) { /* 回退 */ }
    const head = await fetchAssistFirstAvailable(deps.URPPPP_RAW_URLS, { range: 'bytes=0-2048' });
    const remote = deps.parseVersionFromSource(head);
    if (!remote) throw new Error('无法解析远程辅助插件版本');
    return remote;
  }

  function compareSemver(a, b) {
    // 优先复用主插件比较器
    try {
      const api = (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.__urpppUpdate)
        || window.__urpppUpdate;
      if (api && typeof api.compareVersions === 'function') {
        return api.compareVersions(a, b);
      }
    } catch (_) { /* ignore */ }
    return deps.compareStandaloneVersions(a, b);
  }

  async function checkAssistUpdate() {
    const local = deps.URPPPP_VERSION;
    const remote = await fetchAssistRemoteVersion();
    const cmp = compareSemver(remote, local);
    return {
      id: 'assist',
      name: '辅助插件',
      local,
      remote,
      status: cmp > 0 ? 'update' : (cmp === 0 ? 'latest' : 'ahead'),
      updateUrl: deps.URPPPP_RAW_URL,
    };
  }

  function getMainUpdateApi() {
    // 主/副都有 @grant 沙箱：优先页面真实 window（unsafeWindow）
    try {
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.__urpppUpdate) {
        return unsafeWindow.__urpppUpdate;
      }
    } catch (_) { /* ignore */ }
    try {
      if (window.top && window.top !== window && window.top.__urpppUpdate) return window.top.__urpppUpdate;
    } catch (_) { /* ignore */ }
    try {
      if (window.__urpppUpdate) return window.__urpppUpdate;
    } catch (_) { /* ignore */ }
    return null;
  }

  function registerAssistUpdateChecker() {
    try {
      const api = getMainUpdateApi();
      if (!api || typeof api.registerChecker !== 'function') return false;
      return api.registerChecker({
        id: 'assist',
        name: '辅助插件',
        localVersion: deps.URPPPP_VERSION,
        check: checkAssistUpdate,
      });
    } catch (_) { /* ignore */ }
    return false;
  }

  return {
    checkAssistUpdate,
    registerAssistUpdateChecker,
  };
}
