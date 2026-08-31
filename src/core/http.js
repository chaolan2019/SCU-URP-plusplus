/**
 * 统一网络层：GM_xmlhttpRequest 优先（无 CORS/PNA/preflight 限制），fetch 兜底。
 * 三种语义：
 * - httpText(url, opts)：失败 reject（抛错），供需要感知失败的调用方
 * - httpTextSoft(url, timeoutMs)：失败 resolve('')，供多源降级探测（catalog/更新源）
 * - 两者均 GM 优先，fetch 兜底；withCredentials 仅 fetchText（同源会话）需要
 */

/** 已废弃的 GitHub 加速镜像：@connect 未授权，请求必被拒产生控制台报错，网络层统一拦截 */
const DEPRECATED_HOSTS = /gh-proxy\.(com|net)/i;

/** 基础 GM→fetch 实现。onFail 决定失败语义（reject 或 resolve(fallback)） */
function gmFetchText(url, { method = 'GET', headers = {}, data = null, timeoutMs = 12000, withCredentials = false } = {}, onFail) {
  if (DEPRECATED_HOSTS.test(String(url || ''))) {
    return Promise.reject(new Error('该地址使用了已停止服务的 gh-proxy 镜像，请更换为 GitHub/Gitee 直链'));
  }
  return new Promise((resolve, reject) => {
    const done = (ok, val) => (ok ? resolve(val) : onFail(reject, resolve, val));
    try {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method,
          url,
          data: data || undefined,
          headers,
          timeout: timeoutMs,
          withCredentials,
          onload: (r) => {
            if (r.status >= 200 && r.status < 400) done(true, r.responseText || '');
            else done(false, 'HTTP ' + r.status);
          },
          onerror: () => done(false, 'network error'),
          ontimeout: () => done(false, 'timeout'),
        });
        return;
      }
    } catch (_) { /* 落到 fetch */ }
    fetch(url, {
      method,
      credentials: withCredentials ? 'include' : 'same-origin',
      cache: 'no-store',
      headers,
      body: data || undefined,
    }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then((txt) => done(true, txt)).catch((e) => done(false, e && e.message));
  });
}

/** 失败抛错版（对应原 fetchText / fetchTextForUpdate） */
export function httpText(url, opts = {}) {
  const { timeoutMs = 12000 } = opts;
  return gmFetchText(url, { ...opts, timeoutMs }, (reject) => reject(new Error('fetch failed')));
}

/** 失败返回空串版（对应原 fetchRemoteCatalog，多源降级用） */
export function httpTextSoft(url, timeoutMs = 5000) {
  return gmFetchText(url, { timeoutMs }, (reject, resolve) => resolve(''));
}
