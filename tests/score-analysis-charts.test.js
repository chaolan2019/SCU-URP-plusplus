import test from 'node:test';
import assert from 'node:assert/strict';
import { bandsChartSvg, donutSvg, trendChartSvg } from '../src/features/score-analysis/charts.js';

const palette = {
  gpaLine: 'var(--primary)',
  scoreLine: 'var(--text-secondary)',
  credit: 'var(--primary)',
  required: 'var(--primary)',
  optional: 'var(--text-muted)',
  bands: ['#15803d', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'],
};

test('trendChartSvg renders an empty svg without data', () => {
  const svg = trendChartSvg({ trend: [], palette });
  assert.match(svg, /^<svg/);
  assert.doesNotMatch(svg, /polyline/);
});

test('trendChartSvg draws two polylines, dots and escaped labels', () => {
  const svg = trendChartSvg({
    trend: [
      { term: '2024-2025-1', label: '24-25-1', count: 3, credit: 6, avgScore: 85, avgGpa: 3.5 },
      { term: '2024-2025-2', label: '24-25-2', count: 4, credit: 8, avgScore: 88, avgGpa: 3.7 },
    ],
    palette,
  });
  assert.match(svg, /polyline points="/);
  assert.equal((svg.match(/polyline points=/g) || []).length, 2);
  assert.match(svg, /24-25-1/);
  assert.match(svg, /aria-label="学期成绩趋势"/);
});

test('trendChartSvg escapes label text', () => {
  const svg = trendChartSvg({
    trend: [{ term: '2024-2025-1', label: '24-25-1<script>', count: 1, credit: 2, avgScore: 90, avgGpa: 4 }],
    palette,
  });
  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /&lt;script&gt;/);
});

test('bandsChartSvg renders five bars with counts', () => {
  const svg = bandsChartSvg({
    bands: [
      { key: 's90', label: '90+', count: 3, min: 90, max: 100 },
      { key: 's80', label: '80-89', count: 2, min: 80, max: 89.999 },
      { key: 's70', label: '70-79', count: 1, min: 70, max: 79.999 },
      { key: 's60', label: '60-69', count: 0, min: 60, max: 69.999 },
      { key: 's59', label: '<60', count: 1, min: 0, max: 59.999 },
    ],
    palette,
  });
  assert.equal((svg.match(/<rect /g) || []).length, 5);
  assert.match(svg, />3<\/text>/);
  assert.match(svg, />0<\/text>/);
});

test('bandsChartSvg escapes labels and values', () => {
  const svg = bandsChartSvg({
    bands: [{ key: 'x', label: '90+<b>', count: 1, min: 90, max: 100 }],
    palette,
  });
  assert.doesNotMatch(svg, /<b>/);
  assert.match(svg, /&lt;b&gt;/);
});

test('donutSvg renders required ratio and safe texts', () => {
  const svg = donutSvg({ requiredRatio: 72, palette });
  assert.equal((svg.match(/<circle /g) || []).length, 2);
  assert.match(svg, />72%<\/text>/);
  assert.match(svg, /必修学分占比/);
});

test('donutSvg clamps ratio outside 0-100', () => {
  const over = donutSvg({ requiredRatio: 140, palette });
  assert.match(over, />100%<\/text>/);
  const under = donutSvg({ requiredRatio: -5, palette });
  assert.match(under, />0%<\/text>/);
});
