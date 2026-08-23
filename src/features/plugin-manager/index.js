// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

/**
 * URPP 插件管理（P0）——主插件做宿主，暴露插件协议 + 装载/状态/入口 UI。
 *
 * 面向未来（主题/商店/第三方）的协议，均在此统一定义：
 *  - window.__urpppPlugin: 宿主暴露给插件的整组能力（协议版本 + 注册/查询 + 存储/请求/样式/日志 + 事件 + 子面板注册）
 *  - 插件统一用 register() 注册；主题可注册为 type:'theme'；第三方插件同样走 register
 *  - 商店/在线安装可复用 install() 的下载→缓存→注入链路（后续扩展来源清单）
 *
 * 说明：本模块只做宿主侧骨架；P0 先用「下载远程辅助产物→缓存→注入」打通装载，
 * 辅助插件迁移到 __urpppPlugin.register 形态为下一步。
 */

const STORAGE_PREFIX = 'urppp_plugin_';
const PROTOCOL_VERSION = '1.0.0';

export function createPluginManager({ GM, doc, hostInfo, uiDeps }) {
  const {
    getValue = () => null,
    setValue = () => {},
    xmlHttp,
    addStyle,
  } = GM || {};
  const onSubpanel = (typeof uiDeps === 'function' ? uiDeps : uiDeps && uiDeps.openSubpanel) || null;

  const registry = new Map(); // id -> plugin instance
  const state = new Map();    // id -> { loaded, enabled, version, code? }
  const events = new Map();   // event -> Set<cb>
  const listeners = [];       // onPage 回调（页面级引导）收集

  function emit(name, payload) {
    const set = events.get(name);
    if (set) set.forEach((cb) => { try { cb(payload); } catch (_) { /* ignore */ } });
  }
  function on(name, cb) {
    if (!events.has(name)) events.set(name, new Set());
    events.get(name).add(cb);
    return () => events.get(name).delete(cb);
  }

  // ---- 存储（插件命名空间，自动加前缀，避免互相覆盖） ----
  function storageGet(id, key) { return getValue(`${STORAGE_PREFIX}${id}_${key}`); }
  function storageSet(id, key, value) { setValue(`${STORAGE_PREFIX}${id}_${key}`, value); }
  function storage() {
    return (id) => ({
      get: (k) => storageGet(id, k),
      set: (k, v) => storageSet(id, k, v),
      remove: (k) => setValue(`${STORAGE_PREFIX}${id}_${k}`, undefined),
    });
  }

  // ---- 请求（GM_xmlhttpRequest 封装，失败可多源重试） ----
  function request(url, opts = {}) {
    return new Promise((resolve, reject) => {
      if (typeof xmlHttp !== 'function') { reject(new Error('GM_xmlhttpRequest 不可用（未授权跨域？）')); return; }
      xmlHttp({
        method: opts.method || 'GET',
        url,
        headers: opts.headers || {},
        data: opts.data,
        timeout: opts.timeout || 8000,
        onload: (res) => (res.status >= 200 && res.status < 300 ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`))),
        onerror: () => reject(new Error('网络错误')),
        ontimeout: () => reject(new Error('超时(8s)')),
      });
    });
  }

  // ---- 下载（多源逐个降级，记录每源错误） ----
  async function fetchWithFallback(urls, onProgress) {
    const list = Array.isArray(urls) ? urls : [urls];
    const errors = [];
    for (let i = 0; i < list.length; i += 1) {
      const u = list[i];
      if (onProgress) onProgress({ stage: 'downloading', index: i + 1, total: list.length, url: u });
      try {
        const text = await request(u);
        if (onProgress) onProgress({ stage: 'downloaded', url: u, size: text.length });
        return text;
      } catch (e) {
        errors.push(`源${i + 1}(${shortHost(u)})失败: ${e && e.message ? e.message : e}`);
        if (onProgress) onProgress({ stage: 'source_failed', index: i + 1, total: list.length, error: e && e.message ? e.message : e });
      }
    }
    throw new Error('所有下载源失败 → ' + errors.join(' ｜ '));
  }

  function shortHost(url) {
    try { return new URL(url).host; } catch (_) { return url; }
  }

  // 剥离 UserScript 元数据块（// ==UserScript== ... // ==/UserScript==），保留可执行的 IIFE
  function stripMetadata(code) {
    const m = String(code || '').match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);
    return m ? code.replace(m[0], '') : code;
  }

  // ---- 注入执行 ----
  function inject(code, id) {
    try {
      const js = stripMetadata(code);
      // 用 Function 在沙箱执行；辅助/插件代码里的 GM_* 由 Tampermonkey 提供
      // eslint-disable-next-line no-new-func
      new Function(js)();
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[URP++ plugin] 注入失败', id, e);
      return false;
    }
  }

  // ---- 编辑器禁用/启用（仅记录状态；真正"卸载"需页面级实现） ----
  function setEnabled(id, enabled) {
    const s = state.get(id);
    if (!s) return false;
    s.enabled = !!enabled;
    setValue(`${STORAGE_PREFIX}${id}_enabled`, s.enabled);
    emit(enabled ? 'enabled' : 'disabled', id);
    return true;
  }
  function isEnabled(id) { const s = state.get(id); return !!s && s.enabled; }

  // ---- 注册（插件/主题统一入口） ----
  function register(plugin) {
    if (!plugin || !plugin.id) return false;
    if (registry.has(plugin.id) && registry.get(plugin.id).__urpppRegistered) return true; // 防重复注册
    const item = Object.assign({ type: 'plugin' }, plugin);
    item.__urpppRegistered = true;
    registry.set(plugin.id, item);
    const s = state.get(plugin.id) || { loaded: false, enabled: false, version: plugin.version || '' };
    s.version = item.version || s.version;
    state.set(plugin.id, s);
    emit('registered', item.id);
    return true;
  }

  function get(id) { return registry.get(id) || null; }
  function list(type) {
    const out = [];
    for (const it of registry.values()) if (!type || it.type === type) out.push(it);
    return out;
  }
  function loaded(id) { const s = state.get(id); return !!s && s.loaded; }

  // ---- 装载：下载→缓存→注入→标记 ----
  async function install(id, remoteUrls, onProgress) {
    if (onProgress) onProgress({ stage: 'start', id });
    const urls = Array.isArray(remoteUrls) ? remoteUrls : (remoteUrls ? [remoteUrls] : pluginSource(id));
    const code = await fetchWithFallback(urls, onProgress);
    setValue(`${STORAGE_PREFIX}${id}_code`, code);
    if (onProgress) onProgress({ stage: 'injecting', id });
    const ok = inject(code, id);
    const s = state.get(id) || { loaded: false, enabled: false, version: '' };
    s.loaded = ok;
    s.enabled = ok;
    s.code = code;
    s.version = s.version || detectVersion(code);
    state.set(id, s);
    setValue(`${STORAGE_PREFIX}${id}_enabled`, ok);
    emit('loaded', id);
    return ok;
  }

  function detectVersion(code) {
    const m = String(code || '').match(/@version\s+(\S+)/);
    return m ? m[1] : '';
  }

  // 已缓存则自动装载（无网络请求）
  function bootFromCache(id) {
    const code = getValue(`${STORAGE_PREFIX}${id}_code`);
    if (!code) return false;
    const ok = inject(code, id);
    const s = state.get(id) || { loaded: false, enabled: false, version: detectVersion(code) };
    s.loaded = ok;
    s.enabled = ok && getValue(`${STORAGE_PREFIX}${id}_enabled`) !== false;
    s.code = code;
    state.set(id, s);
    emit('loaded', id);
    return ok;
  }

  function unregister(id) {
    const it = registry.get(id);
    registry.delete(id);
    state.delete(id);
    setValue(`${STORAGE_PREFIX}${id}_enabled`, false);
    emit('unregistered', id);
    return !!it;
  }

  // 插件默认下载源（可按 id 扩展；P0 固定辅助插件 → urpppp.plugin.js 多源）
  function pluginSource(id) {
    if (id === 'assist') {
      return [
        'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.plugin.js',
        'https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/urpppp.plugin.js',
        'https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.plugin.js',
      ];
    }
    return [];
  }

  // ---- 宿主全局协议对象 ----
  const api = {
    protocolVersion: PROTOCOL_VERSION,
    register,
    unregister,
    get,
    list,
    loaded,
    isEnabled,
    enable: (id, on = true) => setEnabled(id, on),
    disable: (id) => setEnabled(id, false),
    install,
    bootFromCache,
    // 宿主能力
    storage: () => getValue && ({ get: (k) => getValue(k), set: (k, v) => setValue(k, v) }),
    pluginStorage: (id) => storage()(id),
    request,
    addStyle: (css) => { try { addStyle && addStyle(css); } catch (_) { /* ignore */ } },
    log: (...a) => { /* eslint-disable-next-line no-console */ console.log('[URP++ plugin]', ...a); },
    on,
    emit,
    hostInfo: Object.assign({ name: 'SCU URP++' }, hostInfo || {}),
    getSubpanel: () => onSubpanel,
  };

  try { window.__urpppPlugin = api; } catch (_) { /* ignore */ }
  try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow) unsafeWindow.__urpppPlugin = api; } catch (_) { /* ignore */ }

  // ---- assist 槽（系统设置 → 辅助插件位置）加载 UI ----
  function renderAssistUi(slot) {
    if (!slot || !doc) return;
    if (slot.querySelector('.urppp-plugin-sec, .urpppp-entry-sec')) return; // 防重复（含辅助自注入的 entry）
    const sec = doc.createElement('section');
    sec.className = 'urppp-set-sec urppp-plugin-sec';
    sec.id = 'urppp-plugin-sec';
    sec.innerHTML = `
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urpppp-entry-grid" style="margin-top:8px;grid-template-columns:1fr 1fr">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `;
    slot.appendChild(sec);

    const status = sec.querySelector('#urppp-plugin-status');
    const installBtn = sec.querySelector('#urppp-plugin-install');
    const storeBtn = sec.querySelector('#urppp-plugin-store');
    const panels = sec.querySelector('#urppp-plugin-panels');
    const tip = sec.querySelector('#urppp-plugin-tip');

    function refresh() {
      const s = state.get('assist');
      const registered = registry.has('assist');
      if ((s && s.loaded) || registered) {
        status.textContent = `辅助插件 v${s && s.version ? s.version : (get('assist') && get('assist').version) || ''} 已装载`;
        status.className = 'urppp-plugin-status ok';
        installBtn.textContent = '重新装载';
        installBtn.dataset.state = 'loaded';
        tip.textContent = '已装载。下方为扩展入口。';
      } else {
        status.textContent = '未装载';
        status.className = 'urppp-plugin-status';
        installBtn.textContent = '装载辅助插件';
        installBtn.dataset.state = 'notloaded';
        tip.textContent = '点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。';
      }
      // 子面板入口
      panels.innerHTML = '';
      const subpanels = collectSubpanels();
      if (subpanels && Object.keys(subpanels).length) {
        const grid = doc.createElement('div');
        grid.className = 'urpppp-entry-grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        Object.keys(subpanels).forEach((kind) => {
          const b = doc.createElement('button');
          b.type = 'button';
          b.className = 'urppp-set-btn ghost';
          b.textContent = subpanels[kind].label || kind;
          b.addEventListener('click', () => {
            // 优先用插件提供的 open（打开其子面板），否则回退宿主 openSubpanel
            try {
              if (subpanels[kind] && typeof subpanels[kind].open === 'function') subpanels[kind].open();
              else if (onSubpanel) onSubpanel(kind);
            } catch (_) { /* ignore */ }
          });
          grid.appendChild(b);
        });
        panels.appendChild(grid);
      }
    }

    // 装载动作（带进度反馈）
    installBtn.addEventListener('click', async () => {
      installBtn.disabled = true;
      installBtn.textContent = '装载中…';
      status.className = 'urppp-plugin-status';
      status.textContent = '正在开始装载…';
      try {
        const ok = await install('assist', null, (p) => {
          try {
            if (p.stage === 'downloading') status.textContent = `下载中… 源${p.index}/${p.total}（${shortHost(p.url)}）`;
            else if (p.stage === 'downloaded') status.textContent = `已下载（${p.size} 字节），注入中…`;
            else if (p.stage === 'source_failed') status.textContent = `源${p.index}失败（${p.error || ''}），切换下一源…`;
            else if (p.stage === 'injecting') status.textContent = '注入中…';
            else if (p.stage === 'start') status.textContent = '正在开始装载…';
            console.log('[URP++ plugin] assist 装载进度', p);
          } catch (_) { /* ignore */ }
        });
        if (ok) {
          status.textContent = '辅助插件已装载 v' + ((get('assist') && get('assist').version) || '');
          console.log('[URP++ plugin] assist 装载成功');
        } else {
          throw new Error('注入失败');
        }
      } catch (e) {
        status.textContent = '装载失败：' + (e && e.message ? e.message : e);
        status.className = 'urppp-plugin-status err';
        console.warn('[URP++ plugin] assist 装载失败', e);
      } finally {
        installBtn.disabled = false;
        refresh();
      }
    });

    // 插件商店（占位）
    storeBtn.addEventListener('click', () => {
      tip.textContent = '插件商店即将上线，敬请期待。';
    });

    // 装载后子面板注册（辅助插件调用 register 时，主插件拉取它的 subpanels）
    // 通过事件联动刷新
    on('loaded', (id) => { if (id === 'assist') refresh(); });
    on('registered', (id) => { if (id === 'assist') refresh(); });

    // 已缓存则自动装载并刷新
    if (bootFromCache('assist')) refresh();
    else refresh();
  }

  // 收集已注册插件提供的子面板（P0：辅助注册待迁移；先支持插件通过 register 声明 subpanels）
  function collectSubpanels() {
    const map = {};
    registry.forEach((p) => {
      if (p.subpanels && typeof p.subpanels === 'function') {
        const sp = p.subpanels();
        Object.keys(sp || {}).forEach((k) => { map[k] = sp[k]; });
      } else if (p.subpanels && typeof p.subpanels === 'object') {
        Object.keys(p.subpanels).forEach((k) => { map[k] = p.subpanels[k]; });
      }
    });
    return map;
  }

  return {
    api,
    install,
    renderAssistUi,
    bootFromCache,
    register,
  };
}
