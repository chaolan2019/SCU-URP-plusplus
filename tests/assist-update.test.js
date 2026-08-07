import test from 'node:test';
import assert from 'node:assert/strict';
import { createUpdateAssist } from '../src/assist/update.js';

function updateFixture(overrides = {}) {
  const calls = { register: 0 };
  const deps = {
    URPPPP_VERSION: '1.3.2',
    URPPPP_RAW_URL: 'https://example.test/urpppp.user.js',
    URPPPP_SOURCES: [
      'https://example.test/version.json',
    ],
    URPPPP_RAW_URLS: [
      'https://example.test/urpppp.user.js',
    ],
    compareStandaloneVersions: (a, b) => (a > b ? 1 : (a < b ? -1 : 0)),
    parseVersionFromSource: (source) => {
      const m = source && source.match(/@version\s+([\w.\-]+)/);
      return m ? m[1] : '';
    },
    ...overrides,
  };
  const assist = createUpdateAssist({ deps });
  return { assist, calls, deps };
}

test('update assist exposes version check and registration', () => {
  const { assist } = updateFixture();
  assert.equal(typeof assist.checkAssistUpdate, 'function');
  assert.equal(typeof assist.registerAssistUpdateChecker, 'function');
});

test('checkAssistUpdate reports update status from version.json', async () => {
  const { assist } = updateFixture();
  globalThis.GM_xmlhttpRequest = (opts) => {
    opts.onload({ status: 200, responseText: JSON.stringify({ version: '1.4.0', assist: '1.4.0' }) });
  };
  const report = await assist.checkAssistUpdate();
  assert.equal(report.id, 'assist');
  assert.equal(report.local, '1.3.2');
  assert.equal(report.remote, '1.4.0');
  assert.equal(report.status, 'update');
});

test('checkAssistUpdate falls back to script header when version.json is invalid', async () => {
  const { assist } = updateFixture();
  globalThis.GM_xmlhttpRequest = (opts) => {
    const body = opts.url.includes('version.json')
      ? 'not json'
      : '// ==UserScript==\n// @version 1.4.1\n// ==/UserScript==\n';
    opts.onload({ status: 200, responseText: body });
  };
  const report = await assist.checkAssistUpdate();
  assert.equal(report.remote, '1.4.1');
  assert.equal(report.status, 'update');
});

test('checkAssistUpdate falls back when primary times out then returns invalid', async () => {
  const { assist } = updateFixture({
    URPPPP_SOURCES: ['https://slow.test/version.json', 'https://fast.test/version.json'],
    URPPPP_RAW_URLS: ['https://slow.test/urpppp.user.js', 'https://fast.test/urpppp.user.js'],
  });
  globalThis.GM_xmlhttpRequest = (opts) => {
    const host = opts.url.split('/')[2];
    if (host === 'slow.test') {
      // 主源迟到且内容无效：不应抢先于 fallback 使整体失败
      setTimeout(() => opts.onload({ status: 200, responseText: '' }), 1200);
    } else {
      opts.onload({ status: 200, responseText: JSON.stringify({ version: '1.4.0', assist: '1.4.0' }) });
    }
  };
  const t0 = Date.now();
  const report = await assist.checkAssistUpdate();
  assert.equal(report.remote, '1.4.0');
  assert.equal(report.status, 'update');
  assert.ok(Date.now() - t0 < 1500, '应在主源 1s 超时后由加速源返回');
});

test('registerAssistUpdateChecker skips when main plugin is absent', () => {
  const { assist } = updateFixture();
  globalThis.window = {};
  globalThis.unsafeWindow = undefined;
  assert.equal(assist.registerAssistUpdateChecker(), false);
});
