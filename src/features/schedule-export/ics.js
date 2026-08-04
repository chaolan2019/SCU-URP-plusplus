// Pure ICS generation helpers for normalized SCU URP schedule data.

export function localDateIso(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

export function parseLocalIsoDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) || localDateIso(date) !== String(value) ? null : date;
}

export function mondayOfDate(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  return result;
}

export function defaultSemesterMonday(planCode) {
  const match = String(planCode || '').match(/^(\d{4})-(\d{4})-(\d)/);
  if (!match) return localDateIso(mondayOfDate(new Date()));
  const year = match[3] === '1' ? Number(match[1]) : Number(match[2]);
  const month = match[3] === '1' ? 8 : 2;
  const date = new Date(year, month, 1);
  while (date.getDay() !== 1) date.setDate(date.getDate() + 1);
  return localDateIso(date);
}

function formatIcsLocal(date) {
  return date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0') + 'T' + String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0') + '00';
}

function escapeIcsText(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function foldIcsLine(line) {
  if (typeof TextEncoder !== 'function') return line;
  const encoder = new TextEncoder();
  const parts = [];
  let current = '';
  let limit = 73;
  for (const char of String(line)) {
    if (encoder.encode(current + char).length > limit && current) {
      parts.push(current);
      current = ' ' + char;
      limit = 74;
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  return parts.join('\r\n');
}

function scheduleUid(value) {
  let hash = 2166136261;
  const text = String(value || '');
  for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16) + '@scu-urppp';
}

function scheduleSectionMap(data) {
  const map = new Map();
  data.sections.forEach((item) => map.set(item.section, item));
  return map;
}

function formatTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildScheduleIcs(data, firstMondayIso, options = {}) {
  const firstMonday = parseLocalIsoDate(firstMondayIso);
  if (!firstMonday) throw new Error('第一教学周日期无效');
  const sectionMap = scheduleSectionMap(data);
  if (!sectionMap.size) throw new Error('教务接口没有返回节次时间，无法生成 ICS');
  const timestamp = formatTimestamp(options.now instanceof Date ? options.now : new Date());
  let eventCount = 0;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SCU URP++//Schedule Export//CN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:' + escapeIcsText(data.semester.label + '课表'),
    'X-WR-TIMEZONE:Asia/Shanghai', 'BEGIN:VTIMEZONE', 'TZID:Asia/Shanghai',
    'X-LIC-LOCATION:Asia/Shanghai', 'BEGIN:STANDARD', 'TZOFFSETFROM:+0800',
    'TZOFFSETTO:+0800', 'TZNAME:CST', 'DTSTART:19700101T000000', 'END:STANDARD',
    'END:VTIMEZONE',
  ];
  data.courses.forEach((course) => course.arrangements.forEach((arrangement) => {
    const startInfo = sectionMap.get(arrangement.startSection);
    const endInfo = sectionMap.get(arrangement.endSection);
    if (!startInfo || !endInfo) return;
    arrangement.weeks.forEach((week) => {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + (week - 1) * 7 + arrangement.day - 1);
      const start = new Date(date);
      const end = new Date(date);
      const startParts = startInfo.start.split(':').map(Number);
      const endParts = endInfo.end.split(':').map(Number);
      start.setHours(startParts[0], startParts[1], 0, 0);
      end.setHours(endParts[0], endParts[1], 0, 0);
      const locationText = [arrangement.campus, arrangement.building, arrangement.classroom].filter(Boolean).join(' ');
      const description = [
        '教师：' + course.teacher,
        '周次：' + arrangement.weekDescription,
        '课程号：' + course.code + (course.sequence ? '_' + course.sequence : ''),
        '学分：' + course.credit,
        '课程属性：' + course.attribute,
      ].filter((item) => !/[：:]$/.test(item)).join('\n');
      const key = [
        data.semester.planCode, course.code, course.sequence, arrangement.day,
        arrangement.startSection, arrangement.endSection, week, arrangement.campus,
        arrangement.building, arrangement.classroom,
      ].join('|');
      eventCount += 1;
      lines.push(
        'BEGIN:VEVENT',
        'UID:' + scheduleUid(key),
        'DTSTAMP:' + timestamp,
        'SUMMARY:' + escapeIcsText(course.name),
        'LOCATION:' + escapeIcsText(locationText),
        'DESCRIPTION:' + escapeIcsText(description),
        'DTSTART;TZID=Asia/Shanghai:' + formatIcsLocal(start),
        'DTEND;TZID=Asia/Shanghai:' + formatIcsLocal(end),
        'END:VEVENT',
      );
    });
  }));
  if (!eventCount) throw new Error('课表中没有已安排时间的课程，无法生成 ICS');
  lines.push('END:VCALENDAR');
  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

export function scheduleIcsOmissionStats(data) {
  const sectionMap = scheduleSectionMap(data);
  let missingWeeks = 0;
  let missingTimes = 0;
  data.courses.forEach((course) => course.arrangements.forEach((arrangement) => {
    if (!arrangement.weeks.length) missingWeeks += 1;
    if (!sectionMap.has(arrangement.startSection) || !sectionMap.has(arrangement.endSection)) missingTimes += 1;
  }));
  return { missingWeeks, missingTimes };
}
