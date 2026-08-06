// 成绩分析：从 scorePack 聚合指标、学期趋势、分数段与必修/选修构成。
// 纯计算模块，不触碰 DOM；换算函数（scoreToNumber/scoreToGpa）由 deps 注入，
// 与入口共用同一套成绩语义，避免重复实现漂移。

function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export const SCORE_BANDS = [
  { key: 's90', label: '90+', min: 90, max: 100 },
  { key: 's80', label: '80-89', min: 80, max: 89.999 },
  { key: 's70', label: '70-79', min: 70, max: 79.999 },
  { key: 's60', label: '60-69', min: 60, max: 69.999 },
  { key: 's59', label: '<60', min: 0, max: 59.999 },
];

export function shortTerm(term) {
  const m = String(term || '').match(/^(\d{4})-(\d{4})-(\d+)/);
  if (!m) return String(term || '');
  return `${m[1].slice(2)}-${m[2].slice(2)}-${m[3]}`;
}

export function createScoreAnalysisData({ deps }) {
  const scoreToNumber = deps.scoreToNumber;
  const scoreToGpa = deps.scoreToGpa;

  function hasScore(course) {
    if (!course) return false;
    if (course.unevaluated) return false;
    return scoreToNumber(course.score) != null;
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

  function computeMetrics({ scorePack, profile }) {
    const courses = allCourses(scorePack);
    const majorGpa = profile && profile.majorGpa ? String(profile.majorGpa).trim() : '';
    let totalCredit = 0;
    let scoreWeighted = 0;
    let gpaWeighted = 0;
    let gpaCredit = 0;
    let requiredCredit = 0;
    let requiredScoreWeighted = 0;
    let requiredGpaWeighted = 0;
    let requiredGpaCredit = 0;
    courses.forEach((course) => {
      if (!hasScore(course)) return;
      const credit = Number(course.credit) || 0;
      const score = scoreToNumber(course.score);
      if (score == null || credit <= 0) return;
      totalCredit += credit;
      scoreWeighted += score * credit;
      const gpa = officialGpa(course) != null ? officialGpa(course) : scoreToGpa(course.score);
      if (gpa != null) {
        gpaWeighted += gpa * credit;
        gpaCredit += credit;
      }
      if (course.required) {
        requiredCredit += credit;
        requiredScoreWeighted += score * credit;
        if (gpa != null) {
          requiredGpaWeighted += gpa * credit;
          requiredGpaCredit += credit;
        }
      }
    });
    const requiredGpa = round2(requiredGpaCredit ? requiredGpaWeighted / requiredGpaCredit : 0);
    return {
      majorGpa: majorGpa || (requiredGpa > 0 ? String(requiredGpa) : ''),
      avgGpa: round2(gpaCredit ? gpaWeighted / gpaCredit : 0),
      avgScore: round2(totalCredit ? scoreWeighted / totalCredit : 0),
      totalCredit: round2(totalCredit),
      requiredGpa,
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
      const score = scoreToNumber(course.score);
      if (score == null) return;
      bucket.count += 1;
      if (credit <= 0) return;
      bucket.credit += credit;
      bucket.scoreW += score * credit;
      const gpa = officialGpa(course) != null ? officialGpa(course) : scoreToGpa(course.score);
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
      const score = scoreToNumber(course.score);
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
    let requiredCredit = 0;
    let optionalCredit = 0;
    let requiredCount = 0;
    let optionalCount = 0;
    (courses || []).forEach((course) => {
      if (!hasScore(course)) return;
      const credit = Number(course.credit) || 0;
      if (course.required) {
        requiredCredit += credit;
        requiredCount += 1;
      } else {
        optionalCredit += credit;
        optionalCount += 1;
      }
    });
    const total = requiredCredit + optionalCredit || 1;
    return {
      requiredCredit: round2(requiredCredit),
      optionalCredit: round2(optionalCredit),
      requiredCount,
      optionalCount,
      requiredRatio: Math.round((requiredCredit / total) * 100),
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

  return { analyzeScores, hasScore, officialGpa, shortTerm };
}
