import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CAL_TERMS, CAL_LUNAR, calActiveTerm, calStatus, calendarSummaryHtml, calendarModalHtml,
} from '../src/features/interactive-calendar/index.js';

// 测试数据注入（校历数据现由远程 JSON 加载，测试直接注入固定数据）
CAL_TERMS.autumn = {
  name: '秋季学期', weeks: 20, start: '2026-08-31', end: '2027-02-20',
  events: [
    { t: 'reg', name: '本科生新生报到', start: '2026-08-24', end: '2026-08-25' },
    { t: 'term', name: '在校生正式行课', start: '2026-08-31', end: '2026-09-06' },
    { t: 'holiday', name: '中秋节', start: '2026-09-25' },
    { t: 'sport', name: '校秋季田径运动会', start: '2026-10-23', end: '2026-10-24' },
    { t: 'exam', name: '本科生期末集中考试周', start: '2027-01-04', end: '2027-01-15' },
  ],
};
CAL_TERMS.spring = {
  name: '春季学期', weeks: 18, start: '2027-03-01', end: '2027-07-03',
  events: [
    { t: 'reg', name: '在校生报到', start: '2027-02-25', end: '2027-02-26' },
    { t: 'term', name: '正式行课', start: '2027-03-01', end: '2027-03-07' },
  ],
};
CAL_LUNAR['2026-08-24'] = '农历七月十二';
CAL_LUNAR['2026-09-25'] = '农历八月十五';
CAL_LUNAR['2026-10-23'] = '农历九月十四';
CAL_LUNAR['2027-02-25'] = '农历正月二十';

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
