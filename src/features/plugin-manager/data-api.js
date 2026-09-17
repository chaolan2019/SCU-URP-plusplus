/**
 * @file api.data：给插件用的只读教务数据接口。
 *
 * 三条原则：
 *   1. 复用主脚本已有的解析，不重写一份。课表的核心解析（含学期首周一、节次时间表、
 *      周次展开）在 schedule-export 的规范化模型里，这里只做调用与形状收口。
 *      重写一份的代价是：教务系统一改版要修两处，而且插件那份一定会先烂。
 *   2. 形状即契约。插件按这里给出的字段写，主脚本内部重构解析不影响插件。
 *   3. 出错只回 { error }，不抛异常。插件跑在页面上，不能因为数据读不到就炸掉调用方。
 *
 * 只读：这里没有任何写教务系统的能力；选课、退课这类事不在这层。
 */

const MAX_COURSES = 300;

/** 当前教学周：三条来源依次兜底，任何一条不可用都不影响后面 */
async function resolveWeek(deps) {
  const { ensureTermWeekResolved, getCurrentWeekNumber, readRememberedTermWeek } = deps || {};
  try {
    if (typeof ensureTermWeekResolved === 'function') {
      const week = await ensureTermWeekResolved();
      if (Number(week) >= 1) return Number(week);
    }
  } catch (_) { /* 继续往下兜 */ }
  try {
    if (typeof getCurrentWeekNumber === 'function') {
      const week = Number(getCurrentWeekNumber());
      if (week >= 1) return week;
    }
  } catch (_) { /* ignore */ }
  try {
    if (typeof readRememberedTermWeek === 'function') {
      const week = Number(readRememberedTermWeek());
      if (week >= 1) return week;
    }
  } catch (_) { /* ignore */ }
  return 0;
}

/** 只保留插件要用的字段：形状稳定，也不会把整坨原始数据搬来搬去 */
function pickArrangement(item) {
  return {
    day: Number(item.day) || 0,
    startSection: Number(item.startSection) || 0,
    endSection: Number(item.endSection) || 0,
    weeks: item.weeks || null,
    weekDescription: String(item.weekDescription || ''),
    campus: String(item.campus || ''),
    building: String(item.building || ''),
    classroom: String(item.classroom || ''),
  };
}

function pickCourse(course) {
  return {
    name: String(course.name || ''),
    teacher: String(course.teacher || ''),
    credit: Number(course.credit) || 0,
    arrangements: (Array.isArray(course.arrangements) ? course.arrangements : []).map(pickArrangement),
  };
}

export function createDataApi(deps) {
  const {
    loadSchedule,
    loadScores,
    normalizeScheduleDataForPage,
    schedulePlanCodeFromData,
  } = deps || {};

  return {
    /**
     * 学期与周次。插件要靠它把「明天」换算成第几周。
     * firstMonday 拿不到时插件会退化成按「今天所在周」推算法，所以这里是尽力而为。
     */
    async term() {
      const currentWeek = await resolveWeek(deps);
      let firstMonday = '';
      try {
        if (typeof loadSchedule === 'function' && typeof normalizeScheduleDataForPage === 'function') {
          const data = await loadSchedule(false);
          if (data && !data.error) {
            const planCode = typeof schedulePlanCodeFromData === 'function' ? schedulePlanCodeFromData(data) : '';
            const normalized = normalizeScheduleDataForPage(data, planCode, 'agent');
            firstMonday = String((normalized && normalized.semester && normalized.semester.firstMonday) || '');
          }
        }
      } catch (_) { /* 首周一拿不到就留空 */ }
      return { currentWeek, firstMonday };
    },

    /** 课表：学期信息 + 节次时间表 + 课程（含上课安排） */
    async schedule() {
      const currentWeek = await resolveWeek(deps);
      const fail = (error) => ({ error: String(error).slice(0, 200), currentWeek });
      try {
        if (typeof loadSchedule !== 'function') return fail('这个版本的主脚本还没提供课表读取');
        const data = await loadSchedule(false);
        if (!data) return fail('读不到课表（可能是登录已过期，或还没进过课表页面）');
        if (data.error) return fail(data.error);
        if (typeof normalizeScheduleDataForPage !== 'function') return fail('课表解析器不可用，请更新主脚本');
        const planCode = typeof schedulePlanCodeFromData === 'function' ? schedulePlanCodeFromData(data) : '';
        const normalized = normalizeScheduleDataForPage(data, planCode, 'agent');
        const courses = Array.isArray(normalized && normalized.courses) ? normalized.courses : [];
        return {
          currentWeek,
          semester: {
            label: String((normalized.semester && normalized.semester.label) || ''),
            firstMonday: String((normalized.semester && normalized.semester.firstMonday) || ''),
          },
          sections: Array.isArray(normalized.sections) ? normalized.sections : [],
          courses: courses.slice(0, MAX_COURSES).map(pickCourse),
        };
      } catch (error) {
        return fail((error && error.message) || error);
      }
    },

    /**
     * 成绩：汇总（学分/绩点/均分）+ 按学期分组的课程。
     * 只给模型用得上的字段；原始包里有评教链接、分组层级这类东西，插件不需要。
     */
    async scores() {
      const fail = (error) => ({ error: String(error).slice(0, 200) });
      try {
        if (typeof loadScores !== 'function') return fail('这个版本的主脚本还没提供成绩读取');
        const pack = await loadScores(false);
        if (!pack) return fail('读不到成绩（可能是登录已过期）');
        if (pack.error) return fail(pack.error);

        const passing = Array.isArray(pack.passing) ? pack.passing[0] : null;
        const list = (passing && Array.isArray(passing.courses)) ? passing.courses : [];
        const groups = new Map();
        list.forEach((course) => {
          const term = String((course && course.term) || '未标学期');
          if (!groups.has(term)) groups.set(term, []);
          groups.get(term).push({
            name: String((course && course.name) || ''),
            credit: Number(course && course.credit) || 0,
            score: String((course && course.score) || ''),
            gpa: course && course.officialGpa != null ? Number(course.officialGpa) : null,
            required: !!(course && course.required),
            unevaluated: !!(course && course.unevaluated),
          });
        });
        const summary = (passing && passing.summary) || null;
        return {
          summary: summary ? {
            totalCredit: Number(summary.totalCredit) || 0,
            avgGpa: Number(summary.avgGpa) || 0,
            avgScore: Number(summary.avgScore) || 0,
            requiredCredit: Number(summary.requiredCredit) || 0,
            requiredGpa: Number(summary.requiredGpa) || 0,
            count: Number(summary.count) || 0,
          } : null,
          terms: Array.from(groups.entries()).map(([term, courses]) => ({ term, courses })),
        };
      } catch (error) {
        return fail((error && error.message) || error);
      }
    },
  };
}
