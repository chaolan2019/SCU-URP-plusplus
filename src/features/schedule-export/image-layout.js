function wrapField(text, limit, kind) {
  const lines = [];
  let rest = String(text || '');
  const width = Math.max(4, Number(limit) || 4);
  while (rest) {
    lines.push({ text: rest.slice(0, width), kind });
    rest = rest.slice(width);
  }
  return lines;
}

function takeLines(lines, count) {
  const taken = lines.slice(0, Math.max(0, count)).map((line) => ({ ...line }));
  if (taken.length && taken.length < lines.length) {
    const last = taken[taken.length - 1];
    last.text = last.text.length > 1 ? last.text.slice(0, -1) + '…' : '…';
  }
  return taken;
}

const COURSE_PALETTE = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#DB2777', '#4D7C0F', '#EA580C', '#4F46E5'];

export function exportCourseColor(name) {
  let hash = 0;
  const text = String(name || '');
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return COURSE_PALETTE[hash % COURSE_PALETTE.length];
}

function assignScheduleLanes(component) {
  const laneEnds = [];
  component.forEach((item) => {
    let lane = laneEnds.findIndex((end) => end < item.startSection);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = item.endSection;
    item.lane = lane;
  });
  component.forEach((item) => { item.laneCount = Math.max(1, laneEnds.length); });
}

export function layoutScheduleDay(items) {
  const sorted = items.slice().sort((left, right) => (
    left.startSection - right.startSection
    || left.endSection - right.endSection
    || left.course.name.localeCompare(right.course.name)
  ));
  let component = [];
  let componentEnd = 0;
  sorted.forEach((item) => {
    if (component.length && item.startSection > componentEnd) {
      assignScheduleLanes(component);
      component = [];
      componentEnd = 0;
    }
    component.push(item);
    componentEnd = Math.max(componentEnd, item.endSection);
  });
  if (component.length) assignScheduleLanes(component);
  return sorted;
}

export function scheduleExportEvents(data) {
  const events = [];
  data.courses.forEach((course) => course.arrangements.forEach((arrangement) => {
    events.push({
      course,
      arrangement,
      startSection: arrangement.startSection,
      endSection: arrangement.endSection,
      day: arrangement.day,
    });
  }));
  return events;
}

export function wrapScheduleFooter(text, limit) {
  const lines = [];
  let rest = String(text || '');
  while (rest) {
    lines.push(rest.slice(0, limit));
    rest = rest.slice(limit);
  }
  return lines;
}

export function scheduleImageTextLines(item, maxChars, maxLines) {
  const sectionLabel = item.startSection === item.endSection
    ? item.startSection + '节'
    : item.startSection + '-' + item.endSection + '节';
  const title = wrapField(item.name, Math.max(5, maxChars), 'title');
  const teacher = wrapField(item.teacher, Math.max(6, maxChars + 2), 'teacher');
  const schedule = wrapField([item.weekDescription, sectionLabel].filter(Boolean).join(' · '), Math.max(6, maxChars + 2), 'schedule');
  const location = wrapField([item.campus, item.building, item.classroom].filter(Boolean).join(' '), Math.max(6, maxChars + 2), 'location');
  const capacity = Math.max(1, Number(maxLines) || 1);
  const locationReserve = location.length && capacity >= 2 ? Math.min(2, location.length) : 0;
  const scheduleReserve = schedule.length && capacity >= 3 ? 1 : 0;
  const teacherReserve = teacher.length && capacity >= 4 ? 1 : 0;
  const titleBudget = Math.max(1, capacity - locationReserve - scheduleReserve - teacherReserve);
  const output = takeLines(title, titleBudget);
  let remaining = capacity - output.length;
  const teacherBudget = Math.min(teacher.length, Math.max(0, remaining - scheduleReserve - locationReserve));
  output.push(...takeLines(teacher, teacherBudget));
  remaining = capacity - output.length;
  const scheduleBudget = Math.min(schedule.length, Math.max(0, remaining - locationReserve));
  output.push(...takeLines(schedule, scheduleBudget));
  remaining = capacity - output.length;
  output.push(...takeLines(location, remaining));
  return output.slice(0, capacity);
}
