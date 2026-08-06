import test from 'node:test';
import assert from 'node:assert/strict';
import { createScoreAnalysisController } from '../src/features/score-analysis/controller.js';

function makeEventTarget() {
  const handlers = {};
  const attrs = {};
  return {
    handlers,
    attrs,
    dataset: {},
    hidden: false,
    addEventListener(type, fn) { handlers[type] = fn; },
    dispatch(type, event) { if (handlers[type]) handlers[type](event || {}); },
    getAttribute(name) { return name in attrs ? attrs[name] : null; },
    setAttribute(name, value) { attrs[name] = String(value); },
  };
}

function makeHead() {
  const head = makeEventTarget();
  head.children = [];
  head.appendChild = (child) => { head.children.push(child); return child; };
  return head;
}

function controllerFixture({ loadScores, loadProfile } = {}) {
  const toggle = makeEventTarget();
  const body = makeEventTarget();
  const content = makeEventTarget();
  const panel = {
    dataset: { urpppSaState: 'collapsed' },
    isConnected: true,
    remove() { this.isConnected = false; },
    querySelector(selector) {
      if (selector === '.urppp-sa-toggle') return toggle;
      if (selector === '[data-urppp-sa-body]') return body;
      if (selector === '[data-urppp-sa-content]') return content;
      return null;
    },
  };
  const host = { children: [], insertBefore(child) { this.children.unshift(child); } };
  const styleEl = makeEventTarget();
  const scorePack = {
    passing: [{ title: '全部及格成绩', courses: [
      { name: '高数', credit: 4, score: '92', attr: '必修', required: true, term: '2024-2025-1', officialGpa: 4.0, unevaluated: false },
      { name: '英语', credit: 2, score: '85', attr: '必修', required: true, term: '2024-2025-1', officialGpa: 3.5, unevaluated: false },
    ], summary: { totalCredit: 6, avgScore: 89.7, avgGpa: 3.83, requiredGpa: 3.83 } }],
    schemes: [],
  };

  globalThis.document = {
    head: makeHead(),
    getElementById(id) {
      if (id === 'urppp-score-analysis') return null;
      if (id === 'urppp-score-analysis-style') return null;
      return null;
    },
    createElement(tag) {
      if (tag === 'style') { styleEl.tagName = 'STYLE'; return styleEl; }
      return { innerHTML: '', firstElementChild: panel };
    },
    querySelector() { return null; },
  };

  const calls = { loadScores: 0, loadProfile: 0 };
  const controller = createScoreAnalysisController({
    deps: {
      styles: '.urppp-sa{}',
      loadScores: async () => { calls.loadScores += 1; return typeof loadScores === 'function' ? loadScores() : scorePack; },
      loadProfile: async () => { calls.loadProfile += 1; return loadProfile || { majorGpa: '3.8' }; },
      scoreToNumber(raw) {
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      },
      scoreToGpa() { return 3.5; },
      getInsertHost: () => host,
    },
  });
  return { controller, host, panel, toggle, body, content, styleEl, calls };
}

test('mount inserts a collapsed panel at the host top and injects style', () => {
  const { controller, host, styleEl } = controllerFixture();
  const panel = controller.mount();
  assert.ok(panel);
  assert.equal(host.children[0], panel);
  assert.equal(styleEl.textContent, '.urppp-sa{}');
  assert.equal(controller.getPanel(), panel);
});

test('mount is idempotent and reuses the existing panel', () => {
  const { controller, host } = controllerFixture();
  const first = controller.mount();
  const second = controller.mount();
  assert.equal(first, second);
  assert.equal(host.children.length, 1);
});

test('expanding loads scores once and renders analysis into content', async () => {
  const { controller, toggle, content } = controllerFixture();
  controller.mount();
  toggle.dispatch('click');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(toggle.handlers.click !== undefined, true);
  assert.match(content.innerHTML, /urppp-sa-metrics/);
  assert.match(content.innerHTML, /学期趋势/);
  assert.equal(controller.getPanel().dataset.urpppSaState, 'expanded');
});

test('re-expanding after ready does not reload data', async () => {
  const { controller, toggle, calls } = controllerFixture();
  controller.mount();
  toggle.dispatch('click');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.loadScores, 1);
  // 折叠再展开：命中 ready 缓存，不再请求
  toggle.dispatch('click');
  toggle.dispatch('click');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.loadScores, 1);
});

test('failed load renders error with retry that reloads', async () => {
  let fail = true;
  const { controller, toggle, body, content, calls } = controllerFixture({
    loadScores: async () => {
      if (fail) throw new Error('接口超时');
      return { passing: [{ title: '全部及格成绩', courses: [
        { name: '高数', credit: 4, score: '92', term: '2024-2025-1', required: true, unevaluated: false },
      ], summary: {} }], schemes: [] };
    },
  });
  controller.mount();
  toggle.dispatch('click');
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(content.innerHTML, /urppp-sa-error/);
  assert.match(content.innerHTML, /接口超时/);
  // 重试：数据恢复后渲染成功
  fail = false;
  body.dispatch('click', { target: { closest: () => ({}) } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(content.innerHTML, /urppp-sa-metrics/);
  assert.equal(calls.loadScores, 2);
});

test('unmount removes the panel and resets load state', () => {
  const { controller, panel } = controllerFixture();
  controller.mount();
  controller.unmount();
  assert.equal(panel.isConnected, false);
  assert.equal(controller.getPanel(), null);
  // 重新 mount 可再次使用
  const again = controller.mount();
  assert.ok(again);
});
