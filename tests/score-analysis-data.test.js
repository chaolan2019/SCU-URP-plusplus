import test from 'node:test';
import assert from 'node:assert/strict';
import { createScoreAnalysisData, SCORE_BANDS, shortTerm } from '../src/features/score-analysis/data.js';

function scoreToNumber(raw) {
  const s = String(raw || '').trim();
  if (!s || /未评估/.test(s)) return null;
  if (s === '优秀') return 95;
  if (s === '良好') return 85;
  if (s === '中等') return 75;
  if (s === '及格') return 65;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function scoreToGpa(raw) {
  const n = scoreToNumber(raw);
  if (n == null) return null;
  if (n >= 90) return 4;
  if (n >= 80) return 3;
  if (n >= 70) return 2;
  if (n >= 60) return 1;
  return 0;
}

const dataApi = createScoreAnalysisData({ deps: { scoreToNumber, scoreToGpa } });

function course(over = {}) {
  return {
    code: 'C001', name: '课程', credit: 2, score: '90', attr: '必修',
    required: true, term: '2024-2025-1', officialGpa: null, unevaluated: false,
    ...over,
  };
}

function scorePack(courses) {
  return {
    passing: [{
      title: '全部及格成绩',
      courses,
      summary: { totalCredit: 0, avgScore: 0, avgGpa: 0, requiredCredit: 0, requiredGpa: 0 },
    }],
    schemes: [],
  };
}

test('shortTerm compresses academic term labels', () => {
  assert.equal(shortTerm('2024-2025-1'), '24-25-1');
  assert.equal(shortTerm('2025-2026-2'), '25-26-2');
  assert.equal(shortTerm('其他文本'), '其他文本');
  assert.equal(shortTerm(''), '');
});

test('analyzeScores reports empty state without courses', () => {
  const analysis = dataApi.analyzeScores({ scorePack: scorePack([]), profile: {} });
  assert.equal(analysis.empty, true);
  assert.equal(analysis.trend.length, 0);
  assert.equal(analysis.bands.length, 5);
});

test('metrics aggregate credit, score, gpa and course count', () => {
  const pack = scorePack([
    course({ credit: 3, score: '90', officialGpa: 4.0 }),
    course({ credit: 2, score: '80', officialGpa: 3.0, term: '2024-2025-2' }),
    course({ credit: 1, score: '未评估', unevaluated: true, term: '2024-2025-2' }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: { majorGpa: '3.6' } });
  assert.equal(analysis.empty, false);
  assert.equal(analysis.metrics.majorGpa, '3.6');
  assert.equal(analysis.metrics.courseCount, 3);
  assert.equal(analysis.metrics.totalCredit, 5);
  assert.equal(analysis.metrics.avgScore, (90 * 3 + 80 * 2) / 5);
  assert.equal(analysis.metrics.avgGpa, (4.0 * 3 + 3.0 * 2) / 5);
});

test('metrics falls back to required GPA for major GPA', () => {
  const pack = scorePack([course({ credit: 2, score: '90' })]);
  pack.passing[0].summary = { requiredGpa: 4.0 };
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.equal(analysis.metrics.majorGpa, '4');
});

test('trend groups courses by term and sorts chronologically', () => {
  const pack = scorePack([
    course({ term: '2025-2026-1', credit: 3, score: '85', officialGpa: 3.5 }),
    course({ term: '2024-2025-2', credit: 2, score: '95', officialGpa: 4.0 }),
    course({ term: '2024-2025-1', credit: 1, score: '70', officialGpa: 2.0 }),
    course({ term: '2024-2025-1', credit: 1, score: '未评估', unevaluated: true }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  const terms = analysis.trend.map((item) => item.term);
  assert.deepEqual(terms, ['2024-2025-1', '2024-2025-2', '2025-2026-1']);
  const first = analysis.trend[0];
  assert.equal(first.count, 1);
  assert.equal(first.credit, 1);
  assert.equal(first.avgScore, 70);
  assert.equal(first.avgGpa, 2.0);
  const second = analysis.trend[1];
  assert.equal(second.credit, 2);
  assert.equal(second.avgScore, 95);
});

test('bands distribute numeric and letter grades into five buckets', () => {
  const pack = scorePack([
    course({ score: '98' }), course({ score: '优秀' }), course({ score: '91' }),
    course({ score: '88' }), course({ score: '82' }),
    course({ score: '75' }), course({ score: '62' }),
    course({ score: '55' }), course({ score: '未评估', unevaluated: true }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  const counts = Object.fromEntries(analysis.bands.map((b) => [b.key, b.count]));
  assert.deepEqual(counts, { s90: 3, s80: 2, s70: 1, s60: 1, s59: 1 });
});

test('share splits required and optional credits by required flag', () => {
  const pack = scorePack([
    course({ credit: 3, required: true }),
    course({ credit: 2, required: false, attr: '任选' }),
    course({ credit: 5, required: false, attr: '选修', term: '2024-2025-2' }),
    course({ credit: 4, required: true, term: '2024-2025-2' }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.equal(analysis.share.requiredCredit, 7);
  assert.equal(analysis.share.optionalCredit, 7);
  assert.equal(analysis.share.requiredRatio, 50);
  assert.equal(analysis.share.requiredCount, 2);
  assert.equal(analysis.share.optionalCount, 2);
});

test('official GPA takes precedence over converted GPA', () => {
  const pack = scorePack([course({ credit: 2, score: '85', officialGpa: 3.9 })]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.equal(analysis.metrics.avgGpa, 3.9);
  assert.equal(analysis.trend[0].avgGpa, 3.9);
});

test('SCORE_BANDS covers the full numeric range', () => {
  assert.equal(SCORE_BANDS.length, 5);
  const min = Math.min(...SCORE_BANDS.map((b) => b.min));
  const max = Math.max(...SCORE_BANDS.map((b) => b.max));
  assert.equal(min, 0);
  assert.equal(max, 100);
});
