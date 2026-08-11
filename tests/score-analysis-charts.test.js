import test from 'node:test';
import assert from 'node:assert/strict';
import { bandsChartSvg, donutSvg, trendChartSvg } from '../src/features/score-analysis/charts.js';

const palette = {
  gpaLine: 'var(--primary)',
  scoreLine: 'var(--text-secondary)',
  credit: 'var(--primary)',
  primary: 'var(--primary)',
  share: {
    required: 'var(--primary)',
    elective: 'var(--text-muted)',
    optional: 'var(--text-secondary)',
    other: 'var(--border)',
  },
};

const elevenBands = Array.from({ length: 11 }, (_, i) => ({
  key: `k${i}`,
  level: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'][i],
  range: ['90-100', '85-89', '82-84', '78-81', '75-77', '72-74', '68-71', '64-67', '60-63', '60-62', '<60'][i],
  gpa: [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0][i],
  min: 90 - i * 5,
  max: 100 - i * 5,
  count: i % 3,
}));

test('trendChartSvg renders an empty svg without data', () => {
  const svg = trendChartSvg({ trend: [], palette });
  assert.match(svg, /^<svg/);
  assert.doesNotMatch(svg, /polyline/);
});

test('trendChartSvg draws two polylines, credit labels and hover zones', () => {
  const svg = trendChartSvg({
    trend: [
      { term: '2024-2025-1', label: '24-25-1', count: 3, credit: 6, avgScore: 85, avgGpa: 3.5 },
      { term: '2024-2025-2', label: '24-25-2', count: 4, credit: 8, avgScore: 88, avgGpa: 3.7 },
    ],
    palette,
  });
  assert.equal((svg.match(/polyline points=/g) || []).length, 2);
  assert.equal((svg.match(/class="urppp-sa-hover"/g) || []).length, 2);
  // hover 区必须透明，否则 SVG rect 默认黑色会遮住整张图
  assert.equal((svg.match(/fill="transparent"/g) || []).length, 2);
  assert.match(svg, /<title>/);
  assert.match(svg, /修读学分 6/);
  assert.match(svg, /加权均分 85/);
  // 学分柱顶标注
  assert.match(svg, />6<\/text>/);
  assert.match(svg, />8<\/text>/);
});

test('trendChartSvg mobile layout preserves readable units and minimum term slots', () => {
  const trend = Array.from({ length: 8 }, (_, i) => ({
    term: `202${i}-202${i + 1}-1`, label: `2${i}-2${i + 1}-1`, count: 4,
    credit: 10 + i, avgScore: 80 + i, avgGpa: 3 + i / 10,
  }));
  const svg = trendChartSvg({ trend, palette, layout: { variant: 'mobile' } });
  assert.match(svg, /data-urppp-chart-layout="mobile"/);
  assert.match(svg, /data-urppp-chart-kind="trend"/);
  assert.match(svg, /viewBox="0 0 616 286"/);
  assert.match(svg, /width:max\(100%,616px\)/);
  assert.match(svg, /font-size="12"/);
});

test('trendChartSvg escapes label and tooltip text', () => {
  const svg = trendChartSvg({
    trend: [{ term: '2024-2025-1', label: '24-25-1<script>', count: 1, credit: 2, avgScore: 90, avgGpa: 4 }],
    palette,
  });
  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /&lt;script&gt;/);
});

test('bandsChartSvg renders eleven bars with score range and gpa labels', () => {
  const svg = bandsChartSvg({ bands: elevenBands, palette });
  assert.equal((svg.match(/<rect /g) || []).length, 11);
  assert.match(svg, /aria-label="成绩分段分布"/);
  // 成绩分段 + 绩点双行标注，不再显示 ABCD 等级字母
  assert.match(svg, />90-100<\/text>/);
  assert.match(svg, /&lt;60<\/text>/);
  assert.match(svg, />4<\/text>/);
  assert.match(svg, />0<\/text>/);
  assert.doesNotMatch(svg, />A<\/text>/);
  assert.doesNotMatch(svg, />F<\/text>/);
  // 每柱 hover tooltip（等级仍保留在 tooltip 内）
  assert.equal((svg.match(/<title>/g) || []).length, 11);
  assert.match(svg, /A-（绩点 3\.7）/);
});

test('bandsChartSvg mobile layout gives eleven bands readable slots', () => {
  const svg = bandsChartSvg({ bands: elevenBands, palette, layout: { variant: 'mobile' } });
  assert.match(svg, /data-urppp-chart-layout="mobile"/);
  assert.match(svg, /data-urppp-chart-kind="bands"/);
  assert.match(svg, /viewBox="0 0 556 236"/);
  assert.match(svg, /width:max\(100%,556px\)/);
  assert.match(svg, /font-size="11"/);
});

test('bandsChartSvg escapes labels and tooltip text', () => {
  const svg = bandsChartSvg({
    bands: [{ key: 'x', level: 'A', range: '90-100<b>', gpa: 4, count: 1, min: 90, max: 100 }],
    palette,
  });
  assert.doesNotMatch(svg, /<b>/);
  assert.match(svg, /&lt;b&gt;/);
});

test('donutSvg renders multiple segments clockwise from top', () => {
  const svg = donutSvg({
    items: [
      { key: 'required', ratio: 50 },
      { key: 'elective', ratio: 30 },
      { key: 'optional', ratio: 20 },
    ],
    requiredRatio: 50,
    palette,
  });
  // 背景环 + 3 段
  assert.equal((svg.match(/<circle /g) || []).length, 4);
  assert.match(svg, />50%<\/text>/);
  assert.match(svg, /rotate\(-90/);
  assert.match(svg, /必修学分占比/);
});

test('donutSvg clamps ratio and renders empty svg without segments', () => {
  const over = donutSvg({ items: [{ key: 'required', ratio: 90 }], requiredRatio: 140, palette });
  assert.match(over, />100%<\/text>/);
  const empty = donutSvg({ items: [], requiredRatio: 0, palette });
  assert.doesNotMatch(empty, /<circle/);
});
