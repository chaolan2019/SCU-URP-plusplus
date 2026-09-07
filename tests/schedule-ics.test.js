import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildScheduleIcs,
  defaultSemesterMonday,
  localDateIso,
  mondayOfDate,
  parseLocalIsoDate,
  scheduleIcsOmissionStats,
  timetableKeyForCampus,
} from '../src/features/schedule-export/ics.js';

const scheduleData = {
  semester: { planCode: '2026-2027-1', label: '2026-2027学年秋季学期' },
  sections: [
    { section: 1, start: '08:15', end: '09:00' },
    { section: 2, start: '09:10', end: '09:55' },
  ],
  courses: [{
    name: '工程,数学;专题',
    teacher: '测试教师',
    code: 'MATH001',
    sequence: '01',
    attribute: '必修',
    credit: 3,
    arrangements: [{
      day: 1,
      startSection: 1,
      endSection: 2,
      weeks: [1, 2],
      weekDescription: '1-2周',
      campus: '测试校区',
      building: '一教',
      classroom: 'A101',
    }],
  }],
};

test('local date helpers reject overflow and derive semester Mondays', () => {
  assert.equal(localDateIso(new Date(2026, 7, 4)), '2026-08-04');
  assert.equal(localDateIso(mondayOfDate(new Date(2026, 7, 9))), '2026-08-03');
  assert.equal(parseLocalIsoDate('2026-02-29'), null);
  assert.equal(localDateIso(parseLocalIsoDate('2028-02-29')), '2028-02-29');
  assert.equal(defaultSemesterMonday('2026-2027-1'), '2026-09-07');
  assert.equal(defaultSemesterMonday('2026-2027-2'), '2027-03-01');
});

test('ICS generation is deterministic, escaped, folded, and week-aware', () => {
  const ics = buildScheduleIcs(scheduleData, '2026-09-07', {
    now: new Date('2026-08-04T01:02:03.000Z'),
  });

  const unfolded = ics.replace(/\r\n /g, '');
  assert.equal((unfolded.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.match(unfolded, /DTSTAMP:20260804T010203Z/);
  assert.match(unfolded, /SUMMARY:工程\\,数学\\;专题/);
  assert.match(unfolded, /LOCATION:测试校区 一教 A101/);
  assert.match(unfolded, /DESCRIPTION:教师：测试教师\\n周次：1-2周\\n课程号：MATH001_01/);
  assert.match(unfolded, /DTSTART;TZID=Asia\/Shanghai:20260907T081500/);
  assert.match(unfolded, /DTEND;TZID=Asia\/Shanghai:20260914T095500/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  ics.split('\r\n').filter(Boolean).forEach((line) => {
    assert.ok(new TextEncoder().encode(line).length <= 75, `unfolded ICS line exceeds 75 bytes: ${line}`);
  });
});

test('ICS generation rejects missing dates and reports omitted arrangements', () => {
  assert.throws(() => buildScheduleIcs(scheduleData, '2026-02-30'), /第一教学周日期无效/);
  assert.throws(() => buildScheduleIcs({ ...scheduleData, sections: [] }, '2026-09-07'), /没有返回节次时间/);

  const data = structuredClone(scheduleData);
  data.courses[0].arrangements.push({
    day: 2,
    startSection: 9,
    endSection: 10,
    weeks: [],
  });
  assert.deepEqual(scheduleIcsOmissionStats(data), { missingWeeks: 1, missingTimes: 1 });
});

test('campus timetable key resolves Wangjiang/Huaxi as one group and Jiang\'an separately', () => {
  assert.equal(timetableKeyForCampus('江安'), 'jiangAn');
  assert.equal(timetableKeyForCampus('江安校区'), 'jiangAn');
  assert.equal(timetableKeyForCampus('望江'), 'wangjiang');
  assert.equal(timetableKeyForCampus('华西'), 'wangjiang');
  assert.equal(timetableKeyForCampus('望江校区'), 'wangjiang');
  assert.equal(timetableKeyForCampus(''), '');
  assert.equal(timetableKeyForCampus('未知校区'), '');
});

test('ICS export routes mixed-campus courses to their own timetable silently', () => {
  const data = structuredClone(scheduleData);
  // 接口作息是江安(08:15)。望江课、江安课、未知校区课混合时各自按校区作息，不打扰。
  data.courses = [
    {
      name: '望江课程',
      code: 'WJ001',
      arrangements: [{
        day: 1, startSection: 1, endSection: 2, weeks: [1],
        campus: '望江', building: '一教', classroom: 'A101',
      }],
    },
    {
      name: '江安课程',
      code: 'JA001',
      arrangements: [{
        day: 1, startSection: 1, endSection: 2, weeks: [1],
        campus: '江安校区', building: '二教', classroom: 'B101',
      }],
    },
    {
      name: '网络课程',
      code: 'NET01',
      arrangements: [{
        day: 1, startSection: 1, endSection: 2, weeks: [1],
        campus: '', building: '', classroom: '',
      }],
    },
  ];
  const ics = buildScheduleIcs(data, '2026-09-07', {
    now: new Date('2026-08-04T01:02:03.000Z'),
  });
  const unfolded = ics.replace(/\r\n /g, '');
  // 望江课程按望江作息：08:00-09:40
  assert.match(unfolded, /SUMMARY:望江课程[\s\S]*?DTSTART;TZID=Asia\/Shanghai:20260907T080000/);
  // 江安课程按江安作息：08:15-09:55
  assert.match(unfolded, /SUMMARY:江安课程[\s\S]*?DTSTART;TZID=Asia\/Shanghai:20260907T081500/);
  // 未知校区课程回退接口作息（江安 08:15）
  assert.match(unfolded, /SUMMARY:网络课程[\s\S]*?DTSTART;TZID=Asia\/Shanghai:20260907T081500/);
});

test('ICS export maps sections to the matching campus timetable by default', () => {
  const data = structuredClone(scheduleData);
  // 接口作息为望江/华西(08:00 首节)，但课程在江安校区。自动路由必须用江安表覆盖接口表。
  data.sections = [
    { section: 1, start: '08:00', end: '08:45' },
    { section: 2, start: '08:55', end: '09:40' },
  ];
  data.courses[0].arrangements[0].campus = '江安校区';
  const ics = buildScheduleIcs(data, '2026-09-07', {
    now: new Date('2026-08-04T01:02:03.000Z'),
  });
  const unfolded = ics.replace(/\r\n /g, '');
  // 江安作息：第一节 08:15-09:00、第二节 09:10-09:55，覆盖接口的 08:00 作息
  assert.match(unfolded, /DTSTART;TZID=Asia\/Shanghai:20260907T081500/);
  assert.match(unfolded, /DTEND;TZID=Asia\/Shanghai:20260907T095500/);
});

test('ICS export falls back to interface sections for unknown campuses', () => {
  const data = structuredClone(scheduleData);
  // 接口作息为江安(08:15)，课程校区未知：应按接口作息导出。
  data.courses[0].arrangements[0].campus = '网络课程';
  const ics = buildScheduleIcs(data, '2026-09-07', {
    now: new Date('2026-08-04T01:02:03.000Z'),
  });
  const unfolded = ics.replace(/\r\n /g, '');
  assert.match(unfolded, /DTSTART;TZID=Asia\/Shanghai:20260907T081500/);
  assert.match(unfolded, /DTEND;TZID=Asia\/Shanghai:20260907T095500/);
});
