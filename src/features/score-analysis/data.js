// 成绩分析：从 scorePack 聚合指标、学期趋势、绩点分段与课程类型构成。
// 纯计算模块，不触碰 DOM；换算函数（scoreToNumber/scoreToGpa）由 deps 注入，
// 与入口共用同一套成绩语义；字母等级成绩（A/B+/C- 等）在模块内补齐换算。

function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

// 川大 2017-2018 秋季学期起等级制绩点分段（A 4.0 ~ F 0）。
// D+（60-63, 1.3）与 D（60-62, 1.0）在官方表存在边界重叠，D+ 优先命中。
export const SCORE_BANDS = [
  { key: 'a',  label: 'A',  gpa: 4.0, min: 90, max: 100 },
  { key: 'am', label: 'A-', gpa: 3.7, min: 85, max: 89.999 },
  { key: 'bp', label: 'B+', gpa: 3.3, min: 82, max: 84.999 },
  { key: 'b',  label: 'B',  gpa: 3.0, min: 78, max: 81.999 },
  { key: 'bm', label: 'B-', gpa: 2.7, min: 75, max: 77.999 },
  { key: 'cp', label: 'C+', gpa: 2.3, min: 72, max: 74.999 },
  { key: 'c',  label: 'C',  gpa: 2.0, min: 68, max: 71.999 },
  { key: 'cm', label: 'C-', gpa: 1.7, min: 64, max: 67.999 },
  { key: 'dp', label: 'D+', gpa: 1.3, min: 60, max: 63.999 },
  { key: 'd',  label: 'D',  gpa: 1.0, min: 60, max: 62.999 },
  { key: 'f',  label: 'F',  gpa: 0,   min: 0,  max: 59.999 },
];

// 等级成绩 → 百分制换算（等级制课程无百分制分数，按川大对照表取段内代表值）
const LEVEL_SCORES = {
  '优秀': 95, 'A+': 98, 'A': 95, 'A-': 87,
  '良好': 85, 'B+': 83, 'B': 79, 'B-': 76,
  '中等': 73, 'C+': 73, 'C': 69, 'C-': 65,
  '及格': 62, 'D+': 62, 'D': 60,
  '不及格': 50, 'F': 50,
};

const SHARE_GROUPS = [
  { key: 'required', label: '必修', test: (attr) => /必修/.test(attr) },
  { key: 'elective', label: '任选', test: (attr) => /任选/.test(attr) },
  { key: 'optional', label: '选修', test: (attr) => /选修/.test(attr) },
  { key: 'other', label: '其他', test: () => true },
];

export function shortTerm(term) {
  const m = String(term || '').match(/^(\d{4})-(\d{4})-(\d+)/);
  if (!m) return String(term || '');
  return `${m[1].slice(2)}-${m[2].slice(2)}-${m[3]}`;
}

export function createScoreAnalysisData({ deps }) {
  const scoreToNumber = deps.scoreToNumber;
  const scoreToGpa = deps.scoreToGpa;

  function scoreToNumberWithLevels(raw) {
    const base = scoreToNumber(raw);
    if (base != null) return base;
    const key = String(raw || '').trim().toUpperCase();
    return LEVEL_SCORES[key] != null ? LEVEL_SCORES[key] : null;
  }

  function hasScore(course) {
    if (!course) return false;
    if (course.unevaluated) return false;
    return scoreToNumberWithLevels(course.score) != null;
  }

  function termOrderKey(term) {
    const m = String(term || '').match(/^(\d{4})-(\d{4})-(\d+)/);
    if (!m) return [9999, 9999];
    return [Number(m[1]), Number(m[3])];
  }

  function allCourses(scorePack) {
    const group = scorePack && scorePack.passing && scorePack.passing[0];
    return (group && group.courses) || [];
  }

  function officialGpa(course) {
    const value = course && course.officialGpa;
    const number = Number(value);
    if (value != null && Number.isFinite(number) && number >= 0 && number <= 5) return number;
    return null;
  }

  function courseGpa(course) {
    const official = officialGpa(course);
    return official != null ? official : scoreToGpa(course.score);
  }

  function computeMetrics({ scorePack, profile }) {
    const courses = allCourses(scorePack);
    const majorGpa = profile && profile.majorGpa ? String(profile.majorGpa).trim() : '';
    let totalCredit = 0;
    let scoreWeighted = 0;
    let gpaWeighted = 0;
    let gpaCredit = 0;
    let requiredGpaWeighted = 0;
    let requiredGpaCredit = 0;
    courses.forEach((course) => {
      if (!hasScore(course)) return;
      const credit = Number(course.credit) || 0;
      const score = scoreToNumberWithLevels(course.score);
      if (score == null || credit <= 0) return;
      totalCredit += credit;
      scoreWeighted += score * credit;
      const gpa = courseGpa(course);
      if (gpa != null) {
        gpaWeighted += gpa * credit;
        gpaCredit += credit;
        if (course.required) {
          requiredGpaWeighted += gpa * credit;
          requiredGpaCredit += credit;
        }
      }
    });
    return {
      majorGpa,
      requiredGpa: round2(requiredGpaCredit ? requiredGpaWeighted / requiredGpaCredit : 0),
      avgGpa: round2(gpaCredit ? gpaWeighted / gpaCredit : 0),
      avgScore: round2(totalCredit ? scoreWeighted / totalCredit : 0),
      totalCredit: round2(totalCredit),
      courseCount: courses.length,
    };
  }

  function computeTrend(courses) {
    const byTerm = new Map();
    (courses || []).forEach((course) => {
      if (!hasScore(course)) return;
      const term = course.term || '未分组';
      let bucket = byTerm.get(term);
      if (!bucket) {
        bucket = { term, count: 0, credit: 0, scoreW: 0, gpaW: 0, gpaCredit: 0 };
        byTerm.set(term, bucket);
      }
      const credit = Number(course.credit) || 0;
      const score = scoreToNumberWithLevels(course.score);
      if (score == null) return;
      bucket.count += 1;
      if (credit <= 0) return;
      bucket.credit += credit;
      bucket.scoreW += score * credit;
      const gpa = courseGpa(course);
      if (gpa != null) {
        bucket.gpaW += gpa * credit;
        bucket.gpaCredit += credit;
      }
    });
    return Array.from(byTerm.values())
      .map((bucket) => ({
        term: bucket.term,
        label: shortTerm(bucket.term),
        count: bucket.count,
        credit: round2(bucket.credit),
        avgScore: round2(bucket.credit ? bucket.scoreW / bucket.credit : 0),
        avgGpa: round2(bucket.gpaCredit ? bucket.gpaW / bucket.gpaCredit : 0),
      }))
      .sort((a, b) => {
        const ka = termOrderKey(a.term);
        const kb = termOrderKey(b.term);
        return ka[0] - kb[0] || ka[1] - kb[1];
      });
  }

  function computeBands(courses) {
    const buckets = SCORE_BANDS.map((band) => ({ ...band, count: 0, credit: 0 }));
    (courses || []).forEach((course) => {
      if (!hasScore(course)) return;
      const score = scoreToNumberWithLevels(course.score);
      if (score == null) return;
      const hit = buckets.find((band) => score >= band.min && score <= band.max);
      if (!hit) return;
      hit.count += 1;
      hit.credit += Number(course.credit) || 0;
    });
    const maxCount = buckets.reduce((max, band) => Math.max(max, band.count), 1);
    return buckets.map((band) => ({ ...band, ratio: Math.round((band.count / maxCount) * 100) }));
  }

  function computeShare(courses) {
    const groups = SHARE_GROUPS.map((group) => ({
      ...group,
      credit: 0,
      count: 0,
    }));
    (courses || []).forEach((course) => {
      if (!hasScore(course)) return;
      const attr = String(course.attr || '');
      const group = groups.find((item) => item.test(attr));
      if (!group) return;
      group.credit += Number(course.credit) || 0;
      group.count += 1;
    });
    const total = groups.reduce((sum, group) => sum + group.credit, 0) || 1;
    const items = groups
      .filter((group) => group.count > 0)
      .map((group) => ({
        key: group.key,
        label: group.label,
        credit: round2(group.credit),
        count: group.count,
        ratio: Math.round((group.credit / total) * 100),
      }));
    const required = items.find((item) => item.key === 'required');
    return {
      items,
      requiredCredit: required ? required.credit : 0,
      requiredRatio: required ? required.ratio : 0,
    };
  }

  function analyzeScores({ scorePack, profile }) {
    const courses = allCourses(scorePack);
    return {
      metrics: computeMetrics({ scorePack, profile }),
      trend: computeTrend(courses),
      bands: computeBands(courses),
      share: computeShare(courses),
      empty: courses.length === 0,
    };
  }

  return { analyzeScores, hasScore, officialGpa, scoreToNumberWithLevels, shortTerm };
}
