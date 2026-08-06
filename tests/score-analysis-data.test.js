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
      summary: {},
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
  assert.equal(analysis.bands.length, 11);
});

test('metrics aggregate credit, score, gpa, required gpa and course count', () => {
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
  assert.equal(analysis.metrics.requiredGpa, (4.0 * 3 + 3.0 * 2) / 5);
});

test('major GPA stays empty when profile lacks it; required GPA computed separately', () => {
  const pack = scorePack([
    course({ credit: 2, score: '90', required: true }),
    course({ credit: 2, score: '80', required: false, attr: '任选' }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.equal(analysis.metrics.majorGpa, '');
  assert.equal(analysis.metrics.requiredGpa, 4.0);
});

test('letter grades convert into percentile bands', () => {
  const pack = scorePack([
    course({ score: 'A' }),
    course({ score: 'B+', attr: '选修' }),
    course({ score: 'F' }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  const counts = Object.fromEntries(analysis.bands.map((b) => [b.key, b.count]));
  assert.equal(counts.a, 1);   // A → 95 → 90-100
  assert.equal(counts.bp, 1);  // B+ → 83 → 82-84
  assert.equal(counts.f, 1);   // F → 50 → <60
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

test('bands distribute scores into eleven SCU grade point segments', () => {
  const pack = scorePack([
    course({ score: '98' }), course({ score: '优秀' }), course({ score: '91' }),
    course({ score: '88' }), course({ score: '82' }),
    course({ score: '75' }), course({ score: '62' }),
    course({ score: '55' }), course({ score: '未评估', unevaluated: true }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  const counts = Object.fromEntries(analysis.bands.map((b) => [b.key, b.count]));
  assert.deepEqual(counts, {
    a: 3, am: 1, bp: 1, b: 0, bm: 1, cp: 0, c: 0, cm: 0, dp: 1, d: 0, f: 1,
  });
});

test('share classifies required, elective, optional and other by attribute', () => {
  const pack = scorePack([
    course({ credit: 3, attr: '必修', required: true }),
    course({ credit: 2, attr: '任选', required: false }),
    course({ credit: 5, attr: '选修', required: false, term: '2024-2025-2' }),
    course({ credit: 1, attr: '通识实践', required: false, term: '2024-2025-2' }),
    course({ credit: 4, attr: '必修', required: true, term: '2024-2025-2' }),
  ]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  const byKey = Object.fromEntries(analysis.share.items.map((item) => [item.key, item]));
  assert.equal(byKey.required.credit, 7);
  assert.equal(byKey.elective.credit, 2);
  assert.equal(byKey.optional.credit, 5);
  assert.equal(byKey.other.credit, 1);
  assert.equal(analysis.share.requiredRatio, Math.round(7 / 15 * 100));
  assert.equal(analysis.share.items.length, 4);
});

test('share omits empty groups', () => {
  const pack = scorePack([course({ credit: 3, attr: '必修', required: true })]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.deepEqual(analysis.share.items.map((item) => item.key), ['required']);
});

test('official GPA takes precedence over converted GPA', () => {
  const pack = scorePack([course({ credit: 2, score: '85', officialGpa: 3.9 })]);
  const analysis = dataApi.analyzeScores({ scorePack: pack, profile: {} });
  assert.equal(analysis.metrics.avgGpa, 3.9);
  assert.equal(analysis.trend[0].avgGpa, 3.9);
});

test('SCORE_BANDS covers eleven SCU grade point levels in order', () => {
  assert.equal(SCORE_BANDS.length, 11);
  assert.deepEqual(SCORE_BANDS.map((b) => b.gpa), [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0]);
  assert.equal(SCORE_BANDS[0].label, 'A');
  assert.equal(SCORE_BANDS[10].label, 'F');
  const min = Math.min(...SCORE_BANDS.map((b) => b.min));
  const max = Math.max(...SCORE_BANDS.map((b) => b.max));
  assert.equal(min, 0);
  assert.equal(max, 100);
});
