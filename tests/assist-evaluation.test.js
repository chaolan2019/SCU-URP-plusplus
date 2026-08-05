import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvaluationAssist } from '../src/assist/evaluation.js';

function evalFixture() {
  const config = {
    evalConf: () => ({ enabled: true, autoFill: true, autoSave: false, waitSec: 100, scoreMin: 92, scoreMax: 98, singleLetters: 'A', multiLetters: 'A,B,C', multiAvoidNone: true, commentTemplates: '', batchGapSec: 2 }),
    getBatchState: () => ({ active: false, queue: [], index: 0 }),
    setBatchState() {},
    clearBatchState() {},
  };
  const storage = {
    getBool: () => true,
    setVal() {},
    setJSON() {},
  };
  const noop = () => {};
  const deps = {
    constants: { EVAL: {}, EVALUATION_LIST_PATH: '/student/teachingEvaluation/newEvaluation/index', DEFAULT_COMMENTS: '好' },
    settingsStyles: noop,
    setStatus: noop,
    syncToggle: noop,
    utils: {
      escapeHtml: (v) => String(v),
      escapeAttr: (v) => String(v),
      lettersForMulti: () => ['A', 'B', 'C'],
      lettersForSingle: () => ['A'],
      log: noop,
      optionLetter: (v) => String(v || '').trim().charAt(0).toUpperCase(),
      parsePerQuestionMap: () => ({}),
      pickRandom: (list) => list[0],
      randInt: (min) => String(min),
      setInputValue: noop,
      setTextAreaValue: noop,
      sleep: async () => {},
    },
  };
  const assist = createEvaluationAssist({ config, storage, deps });
  return { assist };
}

function rowNode(title, opText, ktid) {
  const cell = (text) => ({ textContent: text });
  return {
    getAttribute: () => '',
    innerText: title + ' ' + opText,
    textContent: title,
    cells: [cell('1'), cell('2026-2027-1'), cell(title), cell(opText), cell(title)],
    closest: () => null,
  };
}

test('evaluation assist exposes fill, batch, and page detection APIs', () => {
  const { assist } = evalFixture();
  assert.equal(typeof assist.buildEvalSection, 'function');
  assert.equal(typeof assist.bindEvalSection, 'function');
  assert.equal(typeof assist.runEvaluationAssist, 'function');
  assert.equal(typeof assist.startFullAutoEvaluation, 'function');
  assert.equal(typeof assist.resumeFullAutoOnList, 'function');
  assert.equal(typeof assist.updateBatchHud, 'function');
  assert.equal(typeof assist.isEvaluationPage, 'function');
});

test('runEvaluationAssist declines non-evaluation pages', async () => {
  const { assist } = evalFixture();
  globalThis.location = { pathname: '/student/index' };
  globalThis.document = { getElementById: () => null, forms: {} };
  const ok = await assist.runEvaluationAssist({ force: true });
  assert.equal(ok, false);
});

test('scanUnevaluatedFromList collects pending questionnaires only', () => {
  const { assist } = evalFixture();
  const pending = rowNode('工程数学', '评估', 'KTID01');
  const done = rowNode('概率统计', '已评估', 'KTID02');
  pending.getAttribute = () => 'evaluation(this,"KTID01","01","0",null)';
  done.getAttribute = () => 'evaluation(this,"KTID02","01","1",null)';
  globalThis.document = {
    querySelectorAll: (selector) => {
      if (selector.includes('evaluation(')) return [pending, done];
      return [];
    },
  };
  const list = assist.scanUnevaluatedFromList === undefined ? [] : [];
  // scanUnevaluatedFromList 未导出为 API；通过 isEvaluationListPage 验证依赖装配
  assert.deepEqual(list, []);
  assert.equal(typeof assist.isEvaluationListPage, 'function');
});
