export function createUpdateAssist({ deps }) {
  function fetchAssistRemoteVersion() {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: deps.URPPPP_RAW_URL,
          timeout: 15000,
          headers: { 'Cache-Control': 'no-cache' },
          onload: (r) => {
            if (r.status >= 200 && r.status < 400) resolve(r.responseText || '');
            else reject(new Error('HTTP ' + r.status));
          },
          onerror: () => reject(new Error('network error')),
          ontimeout: () => reject(new Error('timeout')),
        });
      } catch (e) {
        reject(e);
      }
    });
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
    const remoteSource = await fetchAssistRemoteVersion();
    const remote = deps.parseVersionFromSource(remoteSource);
    if (!remote) throw new Error('无法解析远程辅助插件版本');
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
