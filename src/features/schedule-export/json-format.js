// Pure JSON mapping and XiaoAi-compatible schedule builders.

export const DEFAULT_SCHEDULE_JSON_MAPPING = {
  base: {},
  coursesPath: 'courses',
  schedulePath: 'schedule',
  courseFields: {
    name: 'name',
    teacher: 'teacher',
    position: 'position',
    day: 'day',
    sections: 'sections',
    weeks: 'weeks',
  },
  scheduleFields: {
    morningNum: 'morningNum',
    afternoonNum: 'afternoonNum',
    nightNum: 'nightNum',
    sections: 'sections',
  },
};

export const SCHEDULE_JSON_COURSE_FIELDS = [
  'name', 'teacher', 'position', 'day', 'sections', 'weeks', 'code', 'sequence', 'englishName',
  'attribute', 'category', 'credit', 'status', 'campus', 'building', 'classroom',
  'startSection', 'endSection', 'weekList',
];

export const SCHEDULE_JSON_SCHEDULE_FIELDS = [
  'morningNum', 'afternoonNum', 'nightNum', 'sections', 'sectionList',
];

function cloneJsonValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function scheduleJsonPathsOverlap(first, second) {
  return first === second || first.startsWith(`${second}.`) || second.startsWith(`${first}.`);
}

export function validateScheduleJsonPath(value, optional) {
  const path = String(value == null ? '' : value).trim();
  if (!path) {
    if (optional) return '';
    throw new Error('课程数组输出路径不能为空');
  }
  if (path.length > 120) throw new Error('JSON 输出路径不能超过 120 个字符');
  const segments = path.split('.');
  const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
  const invalid = segments.some((part) => (
    !part
    || /^\d+$/.test(part)
    || /[\[\]\x00-\x1f]/.test(part)
    || forbidden.has(part)
  ));
  if (invalid) throw new Error(`JSON 输出路径包含无效片段：${path}`);
  return segments.join('.');
}

function validateScheduleJsonTargetPaths(paths, label) {
  for (let i = 0; i < paths.length; i += 1) {
    for (let j = i + 1; j < paths.length; j += 1) {
      if (scheduleJsonPathsOverlap(paths[i], paths[j])) {
        throw new Error(`${label}目标路径不能重叠：${paths[i]} / ${paths[j]}`);
      }
    }
  }
}

function validateScheduleJsonBasePath(base, path, label) {
  const segments = path.split('.');
  let cursor = base;
  for (let index = 0; index < segments.length; index += 1) {
    const part = segments[index];
    if (!Object.prototype.hasOwnProperty.call(cursor, part)) return;
    if (index === segments.length - 1) throw new Error(`${label}输出路径与 base 字段重叠：${path}`);
    cursor = cursor[part];
    if (!cursor || typeof cursor !== 'object' || Array.isArray(cursor)) {
      const prefix = segments.slice(0, index + 1).join('.');
      throw new Error(`${label}输出路径无法穿过 base 中的非对象字段：${prefix}`);
    }
  }
}

function validateScheduleJsonFieldMap(value, allowedFields, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}字段映射必须是对象`);
  }
  const output = {};
  Object.entries(value).forEach(([source, target]) => {
    if (!allowedFields.includes(source)) throw new Error(`${label}不支持源字段：${source}`);
    const path = validateScheduleJsonPath(target, true);
    if (path) output[source] = path;
  });
  validateScheduleJsonTargetPaths(Object.values(output), `${label}字段`);
  return output;
}

export function validateScheduleJsonMapping(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('自定义 JSON 映射必须是对象');
  }
  const base = value.base == null ? {} : value.base;
  if (!base || typeof base !== 'object' || Array.isArray(base)) {
    throw new Error('base 必须是 JSON 对象');
  }
  const mapping = {
    base: cloneJsonValue(base),
    coursesPath: validateScheduleJsonPath(value.coursesPath, false),
    schedulePath: validateScheduleJsonPath(value.schedulePath, true),
    courseFields: validateScheduleJsonFieldMap(
      value.courseFields,
      SCHEDULE_JSON_COURSE_FIELDS,
      '课程',
    ),
    scheduleFields: validateScheduleJsonFieldMap(
      value.scheduleFields || {},
      SCHEDULE_JSON_SCHEDULE_FIELDS,
      '时间表',
    ),
  };
  if (!Object.keys(mapping.courseFields).length) throw new Error('至少保留一个课程字段映射');
  if (mapping.schedulePath && scheduleJsonPathsOverlap(mapping.schedulePath, mapping.coursesPath)) {
    throw new Error('课程与时间表输出路径不能重叠');
  }
  validateScheduleJsonBasePath(mapping.base, mapping.coursesPath, '课程');
  if (mapping.schedulePath) validateScheduleJsonBasePath(mapping.base, mapping.schedulePath, '时间表');
  return mapping;
}

export function normalizeSectionTime(value) {
  const text = String(value || '').replace(/\D/g, '').padStart(4, '0').slice(-4);
  const normalized = `${text.slice(0, 2)}:${text.slice(2)}`;
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(normalized) ? normalized : '';
}

function setScheduleJsonPath(target, path, value) {
  const parts = validateScheduleJsonPath(path, false).split('.');
  let cursor = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    if (!cursor[part] || typeof cursor[part] !== 'object' || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  });
}

function mappedScheduleJsonObject(source, fieldMap) {
  const output = {};
  Object.entries(fieldMap || {}).forEach(([sourceField, targetPath]) => {
    if (!Object.prototype.hasOwnProperty.call(source, sourceField) || source[sourceField] === undefined) {
      return;
    }
    setScheduleJsonPath(output, targetPath, cloneJsonValue(source[sourceField]));
  });
  return output;
}

function scheduleJsonPosition(arrangement) {
  return [arrangement.campus, arrangement.building, arrangement.classroom]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .join(' ');
}

function scheduleJsonSectionString(arrangement) {
  const start = Number(arrangement.startSection) || 0;
  const end = Number(arrangement.endSection) || start;
  if (start < 1 || end < start) return '';
  return Array.from({ length: end - start + 1 }, (_, index) => start + index).join(',');
}

function scheduleJsonCourseRecord(course, arrangement) {
  const day = Number(arrangement.day) || 0;
  const sections = scheduleJsonSectionString(arrangement);
  const weekList = Array.from(new Set((arrangement.weeks || []).map(Number)
    .filter((week) => Number.isInteger(week) && week >= 1 && week <= 60)))
    .sort((a, b) => a - b);
  if (day < 1 || day > 7 || !sections) return { error: 'invalid' };
  if (!weekList.length) return { error: 'weeks' };
  return {
    value: {
      name: course.name,
      teacher: course.teacher,
      position: scheduleJsonPosition(arrangement),
      day,
      sections,
      weeks: weekList.join(','),
      code: course.code,
      sequence: course.sequence,
      englishName: course.englishName,
      attribute: course.attribute,
      category: course.category,
      credit: course.credit,
      status: course.status,
      campus: arrangement.campus,
      building: arrangement.building,
      classroom: arrangement.classroom,
      startSection: arrangement.startSection,
      endSection: arrangement.endSection,
      weekList,
    },
  };
}

function buildScheduleJsonCourses(data, stats) {
  const output = [];
  data.courses.forEach((course) => {
    if (!course.arrangements.length) {
      stats.unscheduledCourses += 1;
      return;
    }
    course.arrangements.forEach((arrangement) => {
      const record = scheduleJsonCourseRecord(course, arrangement);
      if (record.error === 'weeks') stats.missingWeeks += 1;
      else if (record.error) stats.invalidArrangements += 1;
      else output.push(record.value);
    });
  });
  return output;
}

export function buildScheduleJsonSections(sections) {
  const sectionMap = new Map();
  (sections || []).forEach((item) => {
    const section = Number(item.section);
    const start = normalizeSectionTime(item.start);
    const end = normalizeSectionTime(item.end);
    if (!Number.isInteger(section) || section < 1 || section > 20 || !start || !end) return;
    sectionMap.set(section, { i: section, s: start, e: end });
  });
  return Array.from(sectionMap.values()).sort((a, b) => a.i - b.i);
}

function buildScheduleJsonSchedule(sections) {
  const sectionList = buildScheduleJsonSections(sections);
  if (!sectionList.length) return {};
  const schedule = { sections: JSON.stringify(sectionList), sectionList };
  if (!sectionList.every((item, index) => item.i === index + 1)) return schedule;
  const counts = { morningNum: 0, afternoonNum: 0, nightNum: 0 };
  sectionList.forEach((item) => {
    const [hour, minute] = item.s.split(':').map(Number);
    const startMinutes = hour * 60 + minute;
    if (startMinutes < 12 * 60) counts.morningNum += 1;
    else if (startMinutes >= 18 * 60) counts.nightNum += 1;
    else counts.afternoonNum += 1;
  });
  return counts.morningNum && counts.afternoonNum && counts.nightNum
    ? Object.assign(schedule, counts)
    : schedule;
}

export function buildScheduleJsonSource(data) {
  const stats = { unscheduledCourses: 0, missingWeeks: 0, invalidArrangements: 0 };
  const courses = buildScheduleJsonCourses(data, stats);
  if (!courses.length) throw new Error('没有符合导入格式的已排课课程');
  return { courses, schedule: buildScheduleJsonSchedule(data.sections), stats };
}

export function buildXiaoAiScheduleJson(source) {
  const output = {
    courses: source.courses.map((course) => ({
      name: course.name,
      teacher: course.teacher,
      position: course.position,
      day: course.day,
      sections: course.sections,
      weeks: course.weeks,
    })),
  };
  const schedule = {};
  ['morningNum', 'afternoonNum', 'nightNum', 'sections'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source.schedule, field)) {
      schedule[field] = source.schedule[field];
    }
  });
  if (Object.keys(schedule).length) output.schedule = schedule;
  return output;
}

export function buildCustomScheduleJson(source, mapping) {
  const output = cloneJsonValue(mapping.base || {});
  const courses = source.courses.map((course) => (
    mappedScheduleJsonObject(course, mapping.courseFields)
  ));
  setScheduleJsonPath(output, mapping.coursesPath, courses);
  if (mapping.schedulePath && Object.keys(source.schedule).length) {
    const schedule = mappedScheduleJsonObject(source.schedule, mapping.scheduleFields);
    if (Object.keys(schedule).length) {
      setScheduleJsonPath(output, mapping.schedulePath, schedule);
    }
  }
  return output;
}
