import test from 'node:test';
import assert from 'node:assert/strict';
import { createUpdateAssist } from '../src/assist/update.js';

function updateFixture(overrides = {}) {
  const calls = { register: 0 };
  const deps = {
    URPPPP_VERSION: '1.3.2',
    URPPPP_RAW_URL: 'https://example.test/urpppp.user.js',
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

test('checkAssistUpdate reports update status from the remote source', async () => {
  const { assist } = updateFixture();
  globalThis.GM_xmlhttpRequest = (opts) => {
    opts.onload({ status: 200, responseText: '// @version 1.4.0\n' });
  };
  const report = await assist.checkAssistUpdate();
  assert.equal(report.id, 'assist');
  assert.equal(report.local, '1.3.2');
  assert.equal(report.remote, '1.4.0');
  assert.equal(report.status, 'update');
});

test('registerAssistUpdateChecker skips when main plugin is absent', () => {
  const { assist } = updateFixture();
  globalThis.window = {};
  globalThis.unsafeWindow = undefined;
  assert.equal(assist.registerAssistUpdateChecker(), false);
});
