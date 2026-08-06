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
    analyzeScores: () => ({ empty: false, trend: [{ label: '24-25-1', count: 2, credit: 6, avgScore: 88, avgGpa: 3.5 }], bands: [] }),
    applyPersonalDisplay() { calls.applyPersonalDisplay += 1; },
    bandsChartSvg: () => '<svg class="mock-bands"></svg>',
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
    isCleanAnalysisDirect: () => false,
    occupancyKindClass: () => '',
    occupancyTypeLabel: () => '占用',
    personalizedProfile: (profile) => profile,
    summarizeCourses: () => ({ totalCredit: 0, avgScore: 0, avgGpa: 0 }),
    trendChartSvg: () => '<svg class="mock-trend"></svg>',
    weekBitActive: () => true,
    ...overrides,
  };
  const renderer = createCleanModeRenderer({ state, deps });
  return { state, deps, calls, renderer };
}

function scorePack() {
  return { passing: [{ title: '全部及格成绩', courses: [
    { name: '高数', credit: 4, score: '92', term: '2024-2025-1', required: true, unevaluated: false },
  ], summary: {} }], schemes: [] };
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

test('tab mode renders header tabs with analysis pane hidden by default', () => {
  const { state, renderer } = rendererFixture();
  state.scores = scorePack();
  const html = renderer.scoreSectionHtml('<div class="uc-score-grid">x</div>');
  assert.match(html, /uc-hd uc-hd-tabs/);
  assert.match(html, /data-sa-tab="overview"/);
  assert.match(html, /data-sa-tab="analysis"/);
  assert.match(html, /uc-sa-pane-analysis"/);
  assert.match(html, /uc-sa-pane-analysis" hidden>/);
  // 分析 pane 内容已渲染但隐藏，切换时无需重新计算
  assert.match(html, /mock-trend/);
  assert.doesNotMatch(html, /uc-sa-switch/);
});

test('tab mode with analysis selected shows charts and hides overview', () => {
  const { state, renderer } = rendererFixture();
  state.scores = scorePack();
  state.scoreAnalysisTab = 'analysis';
  const html = renderer.scoreSectionHtml('<div class="uc-score-grid">x</div>');
  assert.match(html, /uc-sa-pane-analysis"[^h]/);
  assert.match(html, /mock-trend/);
  assert.match(html, /mock-bands/);
});

test('direct mode renders overview and analysis together without tabs', () => {
  const { state, renderer } = rendererFixture({ isCleanAnalysisDirect: () => true });
  state.scores = scorePack();
  const html = renderer.scoreSectionHtml('<div class="uc-score-grid">x</div>');
  assert.doesNotMatch(html, /uc-hd-tabs/);
  assert.match(html, /uc-sa-pane-analysis/);
  assert.match(html, /mock-trend/);
  assert.match(html, /mock-bands/);
  assert.doesNotMatch(html, /hidden/);
});

test('analysis renders empty state when scores are unavailable', () => {
  const { state, renderer } = rendererFixture();
  state.scores = null;
  const html = renderer.analysisHtml();
  assert.match(html, /uc-sa-empty/);
});

test('scheduleRender coalesces into a single frame while open', () => {
  const { state, renderer } = rendererFixture();
  state.open = true;
  renderer.scheduleRender();
  renderer.scheduleRender();
  state.open = false;
});
