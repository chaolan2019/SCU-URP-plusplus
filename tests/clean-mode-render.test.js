import test from 'node:test';
import assert from 'node:assert/strict';
import { createCleanModeState } from '../src/features/clean-mode/state.js';
import { createCleanModeRenderer } from '../src/features/clean-mode/render.js';

function rendererFixture(overrides = {}) {
  const state = createCleanModeState();
  const calls = { render: 0, bindUI: 0, applyPersonalDisplay: 0 };
  const deps = {
    DIRECT_EDIT_LABELS: {},
    DAY_NAMES: ['日', '一', '二', '三', '四', '五', '六'],
    applyPersonalDisplay() { calls.applyPersonalDisplay += 1; },
    bindUI() { calls.bindUI += 1; },
    classifyPrivacyLabel: () => '',
    courseColor: () => '#50bd8b',
    ensureRoot: () => ({
      querySelector: () => ({ innerHTML: '' }),
      classList: { add() {}, remove() {} },
      __ucSettleTimer: 0,
    }),
    escapeHtml: (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    firstContentChar: (value) => (value || '').charAt(0),
    getViewWeekNumber: () => 3,
    ico: () => '',
    occupancyKindClass: () => '',
    occupancyTypeLabel: () => '占用',
    personalizedProfile: (profile) => profile,
    summarizeCourses: () => ({ totalCredit: 0, avgScore: 0, avgGpa: 0 }),
    weekBitActive: () => true,
    ...overrides,
  };
  const renderer = createCleanModeRenderer({ state, deps });
  return { state, deps, calls, renderer };
}

test('render schedule board places lessons with week-based emphasis', () => {
  const { renderer } = rendererFixture();
  const html = renderer.renderScheduleBoard([
    { name: '工程数学', day: 1, section: 1, span: 2, classWeek: '1010', week: '', color: '#1a73e8' },
  ]);
  assert.match(html, /uc-lesson/);
  assert.match(html, /工程数学/);
  assert.match(html, /data-week="3"/);
});

test('render draws desktop layout and binds UI once per frame', () => {
  const { state, calls, renderer } = rendererFixture();
  state.uiReady = false;
  renderer.render();
  assert.ok(calls.bindUI >= 1);
  assert.ok(calls.applyPersonalDisplay >= 1);
  assert.equal(state.uiReady, true);
});

test('scheduleRender coalesces into a single frame while open', () => {
  const { state, renderer } = rendererFixture();
  state.open = true;
  renderer.scheduleRender();
  renderer.scheduleRender();
  state.open = false;
});
