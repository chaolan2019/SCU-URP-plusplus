// Normalize raw SCU URP schedule responses into the export data model.

import { normalizeSectionTime } from './json-format.js';
import { parseLocalIsoDate } from './ics.js';
import { scheduleWeeks } from './weeks.js';

export function firstScheduleCourse(data) {
  const packs = data && Array.isArray(data.xkxx) ? data.xkxx : [];
  for (const pack of packs) {
    const values = Object.values(pack || {});
    if (values.length) return values[0];
  }
  return null;
}

export function schedulePlanCodeFromData(data) {
  const course = firstScheduleCourse(data);
  if (!course) return '';
  const firstTime = Array.isArray(course.timeAndPlaceList) ? course.timeAndPlaceList[0] : null;
  return String(
    course.zxjxjhh
      || course.executiveEducationPlanNumber
      || course.id && (course.id.zxjxjhh || course.id.executiveEducationPlanNumber)
      || firstTime && (firstTime.zxjxjhh || firstTime.executiveEducationPlanNumber)
      || '',
  ).trim();
}

export function semesterLabelFromPlanCode(planCode) {
  const match = String(planCode || '').match(/^(\d{4})-(\d{4})-(\d)/);
  if (!match) return '学生课表';
  const term = match[3] === '1' ? '秋季学期' : (match[3] === '2' ? '春季学期' : '学期');
  return match[1] + '-' + match[2] + '学年' + term;
}

export function normalizeScheduleExportData(data, requestedPlanCode, source, options = {}) {
  const planCode = requestedPlanCode || schedulePlanCodeFromData(data);
  const sections = (Array.isArray(data && data.jcsjbs) ? data.jcsjbs : []).map((item) => ({
    section: Number(item.jc) || 0,
    start: normalizeSectionTime(item.kssj),
    end: normalizeSectionTime(item.jssj),
  })).filter((item) => item.section >= 1 && item.section <= 20 && item.start && item.end)
    .sort((left, right) => left.section - right.section);
  const courses = [];
  (Array.isArray(data && data.xkxx) ? data.xkxx : []).forEach((pack) => {
    Object.keys(pack || {}).forEach((key) => {
      const course = pack[key];
      if (!course) return;
      const id = course.id || {};
      const arrangements = (course.timeAndPlaceList || []).map((time) => ({
        day: Number(time.classDay) || 0,
        startSection: Number(time.classSessions) || 1,
        endSection: Math.min(12, (Number(time.classSessions) || 1) + Math.max(1, Number(time.continuingSession) || 1) - 1),
        weeks: scheduleWeeks(time.classWeek, time.weekDescription || course.skzcs),
        weekDescription: String(time.weekDescription || course.skzcs || '').trim(),
        campus: String(time.campusName || '').trim(),
        building: String(time.teachingBuildingName || '').trim(),
        classroom: String(time.classroomName || '').trim(),
      })).filter((item) => item.day >= 1 && item.day <= 7 && item.startSection >= 1 && item.startSection <= 12);
      courses.push({
        code: String(id.coureNumber || course.zkch || '').trim(),
        sequence: String(id.coureSequenceNumber || course.zkxh || '').trim(),
        name: String(course.courseName || course.englishCourseName || key).trim(),
        englishName: String(course.englishCourseName || '').trim(),
        teacher: String(course.attendClassTeacher || '').trim(),
        attribute: String(course.coursePropertiesName || '').trim(),
        category: String(course.courseCategoryName || '').trim(),
        credit: Number(course.unit) || 0,
        status: String(course.selectCourseStatusName || '').trim(),
        arrangements,
      });
    });
  });
  const firstMonday = String(options.firstMonday || '').trim();
  return {
    schemaVersion: 1,
    exportedAt: (options.now instanceof Date ? options.now : new Date()).toISOString(),
    source: source || 'SCU URP++',
    semester: {
      planCode,
      label: semesterLabelFromPlanCode(planCode),
      firstMonday: parseLocalIsoDate(firstMonday) ? firstMonday : '',
    },
    sections,
    courses,
  };
}
