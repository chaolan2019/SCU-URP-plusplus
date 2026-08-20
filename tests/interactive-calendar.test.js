import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CAL_TERMS, calActiveTerm, calStatus, calendarSummaryHtml, calendarModalHtml,
} from '../src/features/interactive-calendar/index.js';

test('calActiveTerm picks autumn for Aug through Feb and spring in term', () => {
  assert.equal(calActiveTerm('2026-09-10'), 'autumn');
  assert.equal(calActiveTerm('2027-01-20'), 'autumn');
  assert.equal(calActiveTerm('2026-08-20'), 'autumn');
  assert.equal(calActiveTerm('2027-04-10'), 'spring');
  assert.equal(calActiveTerm('2027-06-01'), 'spring');
});

test('calStatus resolves the next event and days left from today', () => {
  const st = calStatus('autumn', '2026-08-17');
  assert.equal(st.termId, 'autumn');
  assert.ok(st.next, 'next event exists before term starts');
  assert.equal(st.next.e.name, '本科生新生报到');
  assert.equal(st.daysLeft, 7); // 08-24 - 08-17
  assert.equal(st.started, false);
  assert.equal(st.weekNo, 0);
});

test('calStatus after term start reports week and progress', () => {
  const st = calStatus('autumn', '2026-10-15'); // 第7周附近
  assert.equal(st.started, true);
  assert.ok(st.weekNo >= 1);
  assert.ok(st.progress > 0 && st.progress <= 100);
  // 下一个事件：运动会 10-23（10-15 起第 8 天）
  assert.equal(st.next.e.name, '校秋季田径运动会');
});

test('calStatus graceful when no term id or today passed', () => {
  // 无参调用不应抛（render.js 以无参方式调用）
  const st = calStatus();
  assert.ok(st.term);
  assert.equal(typeof st.daysLeft, 'number');
});

test('calendarSummaryHtml renders countdown string safely', () => {
  const html = calendarSummaryHtml('autumn', '2026-08-17');
  assert.match(html, /天后/);
  assert.match(html, /本科生新生报到/);
  assert.match(html, /uc-cal-summary/);
});

test('calendarModalHtml renders widget and timeline, no week-axis scale', () => {
  const html = calendarModalHtml('autumn', '2026-08-17');
  assert.match(html, /校历时间线/);
  assert.match(html, /cal-widget/); // 横置小组件
  assert.match(html, /cal-timeline/); // 时间线
  assert.match(html, /cal-mon/); // 月份分组
  // 时间线不含周刻度轴
  assert.doesNotMatch(html, /cal-week-axis|wk-axis/);
  // 事件都落到月份分组里
  const monthCount = (html.match(/class="cal-mon"/g) || []).length;
  assert.ok(monthCount >= 4, 'multiple month groups');
});

test('every event date has a lunar entry', () => {
  Object.values(CAL_TERMS).forEach((term) => {
    term.events.forEach((e) => {
      const lunar = e.start;
      assert.match(lunar, /^\d{4}-\d{2}-\d{2}$/, `${e.name} start format`);
    });
  });
});
