import test from 'node:test';
import assert from 'node:assert/strict';
import { createLoginAssist } from '../src/assist/login.js';

function loginFixture() {
  const config = {
    loginConf: () => ({ enabled: true, zhjwUser: 'u', zhjwPass: 'p', casUser: '', casPass: '', shareCred: true, submitDelay: 300, ocrUrl: 'https://ocr' }),
    beginLoginProcess: () => ({ failures: 0, paused: false }),
    markPendingAutoLogin() {},
    resetLoginGuardState() {},
  };
  const storage = {
    getBool: () => true,
    setVal() {},
  };
  const deps = {
    constants: { LOGIN: {}, LOGIN_FAILURE_LIMIT: 4, DEFAULT_OCR_EXAMPLE: 'https://ocr.example' },
    escapeAttr: (v) => String(v),
    getBase64FromImage: () => 'data',
    log() {},
    loginGuardStyles: '',
    recognizeCaptchaWithRequest: async () => 'AB12',
    setInputValue() {},
    setStatus() {},
    sleep: async () => {},
    syncToggle() {},
  };
  const assist = createLoginAssist({ config, storage, deps });
  return { assist, deps };
}

test('login assist exposes UI builders and login entry points', () => {
  const { assist } = loginFixture();
  assert.equal(typeof assist.buildLoginSection, 'function');
  assert.equal(typeof assist.bindLoginSection, 'function');
  assert.equal(typeof assist.mainLogin, 'function');
  assert.equal(typeof assist.resumeAutoLogin, 'function');
});

test('mainLogin returns quietly when no login form is present', async () => {
  const { assist } = loginFixture();
  globalThis.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { innerText: '' },
  };
  globalThis.location = { pathname: '/', href: 'https://example.test/', search: '' };
  let settled = false;
  await assist.mainLogin().then(() => { settled = true; });
  assert.equal(settled, true);
});
