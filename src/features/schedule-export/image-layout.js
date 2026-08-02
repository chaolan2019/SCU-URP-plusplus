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
