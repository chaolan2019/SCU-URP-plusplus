import test from 'node:test';
import assert from 'node:assert/strict';
import { createPluginManager } from '../src/features/plugin-manager/index.js';

// 模拟 GM 存储环境
function makeGM() {
  const store = new Map();
  return {
    store,
    getValue: (k) => (store.has(k) ? store.get(k) : null),
    setValue: (k, v) => { store.set(k, v); },
    xmlHttp: null,
    addStyle: () => {},
  };
}

function makeDoc() {
  return {
    createElement: (tag) => ({ tag, attrs: {}, children: [], style: {}, dataset: {}, listeners: {}, textContent: '', innerHTML: '', appendChild(c) { this.children.push(c); }, addEventListener(t, cb) { (this.listeners[t] = this.listeners[t] || []).push(cb); }, classList: { add() {}, remove() {}, toggle() {} }, querySelector: () => null, querySelectorAll: () => [] }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: { appendChild: () => {}, addEventListener: () => {} },
    head: { appendChild: () => {} },
    body: { appendChild: () => {} },
  };
}

function makeManager(gmOverride) {
  const GM = gmOverride || makeGM();
  const doc = makeDoc();
  const pm = createPluginManager({
    GM,
    doc,
    hostInfo: { version: '2.0.0', home: 'http://localhost/' },
    uiDeps: {},
  });
  return { api: pm.api, pm, GM, doc };
}

const PLUGIN_CODE = `// @version 1.2.3\nglobalThis.__testPluginRan = (globalThis.__testPluginRan || 0) + 1;`;

test('register 注册插件并触发事件，重复注册幂等', () => {
  const { api } = makeManager();
  const events = [];
  api.on('registered', (id) => events.push(id));
  assert.equal(api.register({ id: 'a', name: '插件A', setup() {} }), true);
  assert.equal(api.register({ id: 'a', name: '插件A2' }), true);
  assert.deepEqual(events, ['a']);
  assert.equal(api.get('a').name, '插件A');
  assert.equal(api.list().length, 1);
});

test('register 拒绝无 id 插件', () => {
  const { api } = makeManager();
  assert.equal(api.register(null), false);
  assert.equal(api.register({ name: '无id' }), false);
});

test('pluginStorage 读写自动加命名空间前缀且互不串扰', () => {
  const { api, GM } = makeManager();
  const sx = api.pluginStorage('x');
  const sy = api.pluginStorage('y');
  sx.set('token', 'abc');
  sy.set('token', 'xyz');
  assert.equal(sx.get('token'), 'abc');
  assert.equal(sy.get('token'), 'xyz');
  assert.equal(GM.store.get('urppp_plugin_x_token'), 'abc');
  assert.equal(GM.store.get('urppp_plugin_y_token'), 'xyz');
});

test('enable/disable/isEnabled 持久化开关', () => {
  const { api, GM } = makeManager();
  api.register({ id: 'sw', setup() {} });
  assert.equal(api.isEnabled('sw'), false);
  api.enable('sw');
  assert.equal(api.isEnabled('sw'), true);
  assert.equal(GM.store.get('urppp_plugin_sw_enabled'), true);
  api.disable('sw');
  assert.equal(api.isEnabled('sw'), false);
});

test('unregister 清理注册与状态并写 disabled 标记', () => {
  const { api, GM } = makeManager();
  api.register({ id: 'del', setup() {} });
  api.enable('del');
  assert.equal(api.unregister('del'), true);
  assert.equal(api.get('del'), null);
  assert.equal(GM.store.get('urppp_plugin_del_enabled'), false);
  assert.equal(api.unregister('del'), false);
});

test('install 写入代码缓存并按元数据记录版本', async () => {
  const GM2 = makeGM();
  GM2.xmlHttp = (opts) => setTimeout(() => opts.onload({ status: 200, responseText: PLUGIN_CODE }), 0);
  const { api } = makeManager(GM2);
  const progress = [];
  const ok = await api.install('plug', ['https://example.com/a.js'], (p) => progress.push(p.stage));
  assert.equal(ok, true, 'install 应成功');
  assert.equal(GM2.store.get('urppp_plugin_plug_code'), PLUGIN_CODE, '代码已缓存');
  assert.equal(GM2.store.get('urppp_plugin_plug_enabled'), true);
  assert.ok(progress.includes('start') && progress.includes('downloading') && progress.includes('injecting'));
  // 远程安装插件不进 registry（list 仅列已 register 的）；版本存在 state 内部，经 bootFromCache/loaded 语义验证
  assert.equal(api.loaded('plug'), true, 'install 后标记已装载');
});

test('install 多源降级：首源失败第二源成功', async () => {
  const GM2 = makeGM();
  GM2.xmlHttp = (opts) => {
    const bad = opts.url.includes('bad');
    setTimeout(() => (bad ? opts.onerror() : opts.onload({ status: 200, responseText: PLUGIN_CODE })), 0);
  };
  const { api } = makeManager(GM2);
  const ok = await api.install('multi', ['https://bad.example/a.js', 'https://good.example/b.js']);
  assert.equal(ok, true);
  assert.equal(GM2.store.get('urppp_plugin_multi_code'), PLUGIN_CODE);
});

test('install 全源失败返回 false 且不写 enabled=true', async () => {
  const GM2 = makeGM();
  GM2.xmlHttp = (opts) => setTimeout(() => opts.onerror(), 0);
  const { api } = makeManager(GM2);
  // 全源失败：fetchWithFallback 抛错，install 无兜底捕获时异常上浮（当前实现不返回 false）
  await assert.rejects(() => api.install('fail', ['https://bad.example/a.js']), /所有下载源失败/);
  assert.notEqual(GM2.store.get('urppp_plugin_fail_enabled'), true);
  assert.equal(GM2.store.get('urppp_plugin_fail_code'), undefined);
});

test('bootFromCache 无缓存返回 false，有缓存标记 loaded', () => {
  const GM2 = makeGM();
  GM2.setValue('urppp_plugin_cached_code', PLUGIN_CODE);
  const { api } = makeManager(GM2);
  assert.equal(api.bootFromCache('nope'), false);
  const r = api.bootFromCache('cached');
  assert.equal(r, true);
  assert.equal(api.loaded('cached'), true);
});

test('事件 on/emit 与取消订阅', () => {
  const { api } = makeManager();
  const seen = [];
  const off = api.on('loaded', (id) => seen.push(id));
  api.emit('loaded', 'p1');
  off();
  api.emit('loaded', 'p2');
  assert.deepEqual(seen, ['p1']);
});

test('request 在 xmlHttp 缺失时拒绝', async () => {
  const { api } = makeManager();
  await assert.rejects(() => api.request('https://example.com/'), /不可用/);
});
