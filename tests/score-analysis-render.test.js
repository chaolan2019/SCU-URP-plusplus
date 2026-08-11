import test from 'node:test';
import assert from 'node:assert/strict';
import { createScoreAnalysisRenderer } from '../src/features/score-analysis/render.js';

const renderer = createScoreAnalysisRenderer({ deps: {} });

const sampleAnalysis = {
  empty: false,
  metrics: {
    majorGpa: '', requiredGpa: 3.6, avgGpa: 3.4, avgScore: 86.5, totalCredit: 42, courseCount: 18,
  },
  trend: [
    { term: '2024-2025-1', label: '24-25-1', count: 5, credit: 10, avgScore: 84, avgGpa: 3.3 },
    { term: '2024-2025-2', label: '24-25-2', count: 6, credit: 12, avgScore: 88, avgGpa: 3.6 },
  ],
  bands: Array.from({ length: 11 }, (_, i) => ({
    key: `k${i}`,
    level: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'][i],
    range: ['90-100', '85-89', '82-84', '78-81', '75-77', '72-74', '68-71', '64-67', '60-63', '60-62', '<60'][i],
    gpa: [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0][i],
    min: 90 - i * 5,
    max: 100 - i * 5,
    count: i % 3,
  })),
  share: {
    items: [
      { key: 'required', label: '必修', credit: 28, count: 12, ratio: 67 },
      { key: 'elective', label: '任选', credit: 8, count: 3, ratio: 19 },
      { key: 'optional', label: '选修', credit: 6, count: 3, ratio: 14 },
    ],
    requiredRatio: 67,
  },
};

test('panel shell is collapsed with toggle and summary', () => {
  const html = renderer.panelShellHtml();
  assert.match(html, /id="urppp-score-analysis"/);
  assert.match(html, /data-urppp-sa-state="collapsed"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /urppp-sa-toggle/);
  assert.match(html, /data-urppp-sa-summary/);
  assert.match(html, /data-urppp-sa-body hidden/);
});

test('loading and error states expose retry affordance', () => {
  assert.match(renderer.loadingHtml(), /urppp-sa-loading/);
  const error = renderer.errorHtml('boom <script>');
  assert.match(error, /urppp-sa-error/);
  assert.match(error, /data-urppp-sa-retry/);
  assert.doesNotMatch(error, /<script>/);
  assert.match(error, /boom &lt;script&gt;/);
});

test('empty analysis renders a friendly empty state', () => {
  const html = renderer.analysisHtml({ empty: true });
  assert.match(html, /urppp-sa-empty/);
});

test('analysis renders five metrics, share first row and bands second row', () => {
  const html = renderer.analysisHtml(sampleAnalysis);
  assert.equal((html.match(/urppp-sa-metric-value/g) || []).length, 5);
  assert.doesNotMatch(html, />主修绩点<\/div>/);
  assert.match(html, />主修必修绩点<\/div>/);
  assert.match(html, />3\.6<\/div>/);
  // 布局：第一行趋势 + 构成，第二行成绩分段 + 明细
  const trendIndex = html.indexOf('urppp-sa-trend');
  const shareIndex = html.indexOf('urppp-sa-share');
  const bandsIndex = html.indexOf('urppp-sa-bands');
  const detailIndex = html.indexOf('urppp-sa-detail');
  assert.ok(trendIndex > -1 && shareIndex > -1 && bandsIndex > -1 && detailIndex > -1);
  assert.ok(trendIndex < shareIndex, 'trend card precedes share card in row one');
  assert.ok(bandsIndex < detailIndex, 'bands card precedes detail card in row two');
  assert.ok(shareIndex < bandsIndex, 'share row comes before bands row');
  assert.match(html, /课程类型构成/);
  assert.match(html, /成绩分段分布/);
  assert.match(html, /各学期明细/);
  assert.match(html, /urppp-sa-table/);
  assert.match(html, /67%/);
  assert.match(html, /任选 8 学分/);
  assert.match(html, /24-25-1/);
});

test('mobile analysis wraps responsive SVGs in isolated scroll containers', () => {
  const html = renderer.analysisHtml(sampleAnalysis, { chartLayout: { variant: 'mobile' } });
  assert.equal((html.match(/urppp-sa-chart-scroll/g) || []).length, 2);
  assert.equal((html.match(/data-urppp-chart-layout="mobile"/g) || []).length, 2);
  assert.match(html, /data-urppp-chart-kind="trend"/);
  assert.match(html, /data-urppp-chart-kind="bands"/);
});

test('analysis escapes course names and term labels', () => {
  const hostile = {
    ...sampleAnalysis,
    trend: [{ term: '<img onerror=alert(1)>', label: '<svg/onload=1>', count: 1, credit: 1, avgScore: 60, avgGpa: 1 }],
  };
  const html = renderer.analysisHtml(hostile);
  assert.doesNotMatch(html, /<img onerror/);
  assert.doesNotMatch(html, /<svg\/onload/);
  assert.match(html, /&lt;svg\/onload=1&gt;/);
});

test('share legend renders every group with color dot', () => {
  const html = renderer.analysisHtml(sampleAnalysis);
  assert.equal((html.match(/urppp-sa-legend-item/g) || []).length, 3);
  assert.match(html, /必修 28 学分 · 12 门/);
  assert.match(html, /任选 8 学分 · 3 门/);
  assert.match(html, /选修 6 学分 · 3 门/);
});
