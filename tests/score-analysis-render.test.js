import test from 'node:test';
import assert from 'node:assert/strict';
import { createScoreAnalysisRenderer } from '../src/features/score-analysis/render.js';

const renderer = createScoreAnalysisRenderer({ deps: {} });

const sampleAnalysis = {
  empty: false,
  metrics: {
    majorGpa: '3.6', avgGpa: 3.4, avgScore: 86.5, totalCredit: 42, courseCount: 18, requiredGpa: 3.6,
  },
  trend: [
    { term: '2024-2025-1', label: '24-25-1', count: 5, credit: 10, avgScore: 84, avgGpa: 3.3 },
    { term: '2024-2025-2', label: '24-25-2', count: 6, credit: 12, avgScore: 88, avgGpa: 3.6 },
  ],
  bands: [
    { key: 's90', label: '90+', count: 4, credit: 8, ratio: 100 },
    { key: 's80', label: '80-89', count: 3, credit: 6, ratio: 75 },
    { key: 's70', label: '70-79', count: 1, credit: 2, ratio: 25 },
    { key: 's60', label: '60-69', count: 0, credit: 0, ratio: 0 },
    { key: 's59', label: '<60', count: 0, credit: 0, ratio: 0 },
  ],
  share: { requiredCredit: 28, optionalCredit: 14, requiredCount: 12, optionalCount: 6, requiredRatio: 67 },
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

test('analysis renders metrics, trend, bands, share and detail table', () => {
  const html = renderer.analysisHtml(sampleAnalysis);
  assert.equal((html.match(/urppp-sa-metric-value/g) || []).length, 5);
  assert.match(html, /学期趋势/);
  assert.match(html, /分数段分布/);
  assert.match(html, /必修 \/ 选修构成/);
  assert.match(html, /各学期明细/);
  assert.match(html, /urppp-sa-table/);
  assert.match(html, /67%/);
  assert.match(html, /28 学分/);
  assert.match(html, /24-25-1/);
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
