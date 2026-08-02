export function scheduleWeeksFromDescription(value) {
  const text = String(value || '').replace(/[—–]/g, '-');
  const parity = /单周|单数周|[（(]单[）)]/.test(text)
    ? 1
    : (/双周|双数周|[（(]双[）)]/.test(text) ? 0 : -1);
  const weeks = new Set();
  const add = (week) => {
    const normalized = Number(week);
    if (normalized >= 1 && normalized <= 30 && (parity < 0 || normalized % 2 === parity)) {
      weeks.add(normalized);
    }
  };
  text.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g, (match, start, end) => {
    const from = Math.min(Number(start), Number(end));
    const to = Math.max(Number(start), Number(end));
    for (let week = from; week <= to; week += 1) add(week);
    return match;
  });
  (text.match(/\d{1,2}/g) || []).forEach(add);
  return Array.from(weeks).sort((first, second) => first - second);
}

export function scheduleWeeks(classWeek, weekDescription) {
  const bits = String(classWeek || '').trim();
  if (/^[01]+$/.test(bits)) {
    const weeks = [];
    for (let index = 0; index < bits.length; index += 1) {
      if (bits.charAt(index) === '1') weeks.push(index + 1);
    }
    return weeks;
  }
  return scheduleWeeksFromDescription(weekDescription || bits);
}
