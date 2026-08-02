import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssistConfig } from '../src/assist/config.js';
import { EVALUATION_KEYS, LOGIN_FAILURE_LIMIT, LOGIN_KEYS } from '../src/assist/constants.js';
import { parseOcrResponse, recognizeCaptcha } from '../src/assist/ocr.js';
import { createAssistStorage } from '../src/assist/storage.js';
import {
  escapeAssistHtml,
  escapeAttr,
  lettersForMulti,
  lettersForSingle,
  optionLetter,
  parseLetters,
  parsePerQuestionMap,
} from '../src/assist/utils.js';

function memoryStorage() {
  const values = new Map();
  const storage = createAssistStorage(
    (key, fallback) => (values.has(key) ? values.get(key) : fallback),
    (key, value) => values.set(key, value),
  );
  return { values, storage };
}

test('assistant storage preserves typed fallbacks and JSON behavior', () => {
  const { values, storage } = memoryStorage();
  assert.equal(storage.getBool('missing', true), true);
  assert.equal(storage.getStr('missing', null), '');
  assert.equal(storage.getNum('missing', 7), 7);
  assert.deepEqual(storage.getJSON('missing', { ok: true }), { ok: true });

  storage.setVal('number', '12');
  storage.setJSON('object', { value: 1 });
  assert.equal(storage.getNum('number', 0), 12);
  assert.deepEqual(storage.getJSON('object', null), { value: 1 });
  values.set('broken', '{');
  assert.deepEqual(storage.getJSON('broken', []), []);
});

test('login guard increments only a fresh pending retry chain and pauses at four failures', () => {
  const { storage } = memoryStorage();
  let currentTime = 1_000;
  const config = createAssistConfig(storage, () => currentTime);

  let state = config.beginLoginProcess('zhjw', '20260001');
  assert.equal(state.failures, 0);
  for (let failure = 1; failure <= LOGIN_FAILURE_LIMIT; failure += 1) {
    config.markPendingAutoLogin('zhjw', '20260001');
    currentTime += 500;
    state = config.beginLoginProcess('zhjw', '20260001');
    assert.equal(state.failures, failure);
  }
  assert.equal(state.paused, true);

  state = config.ensureLoginGuardIdentity('zhjw', '20260002');
  assert.equal(state.identity, '20260002');
  assert.equal(state.failures, 0);
  assert.equal(state.paused, false);
});

test('assistant config and batch state retain existing defaults', () => {
  const { values, storage } = memoryStorage();
  const config = createAssistConfig(storage, () => 10_000);
  assert.deepEqual(config.loginConf(), {
    enabled: true,
    autoSubmit: true,
    ocrUrl: '',
    zhjwUser: '',
    zhjwPass: '',
    casUser: '',
    casPass: '',
    shareCred: true,
    submitDelay: 300,
  });
  assert.equal(config.evalConf().waitSec, 100);
  assert.equal(config.evalConf().scoreMin, 92);
  assert.equal(config.evalConf().scoreMax, 98);

  config.setBatchState({ active: true, queue: [{ id: 1 }], index: 2 });
  assert.deepEqual(config.getBatchState(), { active: true, queue: [{ id: 1 }], index: 2 });
  config.clearBatchState();
  assert.deepEqual(config.getBatchState(), { active: false, queue: [], index: 0 });
  assert.equal(values.get(EVALUATION_KEYS.batchIndex), '0');
  assert.ok(LOGIN_KEYS.guardState.includes('login_guard_state'));
});

test('OCR parser accepts supported fields and rejects malformed codes', async () => {
  assert.equal(parseOcrResponse('{"code":"A1b2"}'), 'A1b2');
  assert.equal(parseOcrResponse('{"data":"123456"}'), '123456');
  assert.throws(() => parseOcrResponse('{'), /响应解析失败/);
  assert.throws(() => parseOcrResponse('{"code":"!"}'), /格式无效/);

  let requestBody = null;
  const code = await recognizeCaptcha('image-only', 'https://ocr.example/api', (options) => {
    requestBody = JSON.parse(options.data);
    options.onload({ responseText: '{"status":"success","code":"Z9Y8"}' });
  });
  assert.equal(code, 'Z9Y8');
  assert.deepEqual(requestBody, { image: 'image-only' });
  await assert.rejects(recognizeCaptcha('x', '', () => {}), /未配置 OCR/);
});

test('assistant text and option parsers preserve existing semantics', () => {
  assert.equal(escapeAttr('"<&>'), '&quot;&lt;&amp;&gt;');
  assert.equal(escapeAssistHtml("'\"<&>"), "'&quot;&lt;&amp;&gt;");
  assert.deepEqual(parseLetters('A, B, AAC'), ['A', 'B', 'C']);
  assert.deepEqual(parsePerQuestionMap('2:A,B\n# comment\n5：C'), { 2: 'A,B', 5: 'C' });
  assert.equal(optionLetter('B_满意'), 'B');
  assert.deepEqual(lettersForSingle('2', { singlePerQ: { 2: 'B,C' }, singleLetters: 'A' }), ['B', 'C']);
  assert.deepEqual(lettersForMulti('', { multiPerQ: {}, multiLetters: 'A,C' }), ['A', 'C']);
});
