import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SCHEDULE_JSON_MAPPING,
  buildCustomScheduleJson,
  buildScheduleJsonSource,
  buildXiaoAiScheduleJson,
  normalizeSectionTime,
  validateScheduleJsonMapping,
  validateScheduleJsonPath,
} from '../src/features/schedule-export/json-format.js';

const scheduleData = {
  sections: [
    { section: 1, start: '0815', end: '0900' },
    { section: 2, start: '09:10', end: '09:55' },
    { section: 3, start: '14:00', end: '14:45' },
    { section: 4, start: '19:00', end: '19:45' },
  ],
  courses: [
    {
      name: '测试课程',
      teacher: '测试教师',
      code: 'C001',
      sequence: '01',
      englishName: 'Test Course',
      attribute: '必修',
      category: '专业课',
      credit: 2,
      status: '已选',
      arrangements: [
        {
          day: 1,
          startSection: 1,
          endSection: 2,
          weeks: [2, 1, 2],
          campus: '江安校区',
          building: '一教',
          classroom: 'A101',
        },
      ],
    },
    {
      name: '未排课程',
      teacher: '',
      arrangements: [],
    },
  ],
};

test('normalizes section times without changing accepted values', () => {
  assert.equal(normalizeSectionTime('0815'), '08:15');
  assert.equal(normalizeSectionTime('19:45'), '19:45');
  assert.equal(normalizeSectionTime('25:00'), '');
});

test('validates safe declarative mapping paths', () => {
  assert.equal(validateScheduleJsonPath('payload.courses', false), 'payload.courses');
  assert.throws(() => validateScheduleJsonPath('__proto__.polluted', false), /无效片段/);
  assert.throws(() => validateScheduleJsonPath('items.0.name', false), /无效片段/);
  assert.throws(
    () => validateScheduleJsonMapping({
      ...DEFAULT_SCHEDULE_JSON_MAPPING,
      courseFields: { name: 'info', teacher: 'info.teacher' },
    }),
    /目标路径不能重叠/,
  );
});

test('builds the default XiaoAi-compatible payload and statistics', () => {
  const source = buildScheduleJsonSource(scheduleData);
  const payload = buildXiaoAiScheduleJson(source);

  assert.deepEqual(source.stats, {
    unscheduledCourses: 1,
    missingWeeks: 0,
    invalidArrangements: 0,
  });
  assert.deepEqual(payload.courses, [
    {
      name: '测试课程',
      teacher: '测试教师',
      position: '江安校区 一教 A101',
      day: 1,
      sections: '1,2',
      weeks: '1,2',
    },
  ]);
  assert.equal(payload.schedule.morningNum, 2);
  assert.equal(payload.schedule.afternoonNum, 1);
  assert.equal(payload.schedule.nightNum, 1);
  assert.deepEqual(JSON.parse(payload.schedule.sections), [
    { i: 1, s: '08:15', e: '09:00' },
    { i: 2, s: '09:10', e: '09:55' },
    { i: 3, s: '14:00', e: '14:45' },
    { i: 4, s: '19:00', e: '19:45' },
  ]);
});

test('builds nested custom output without mutating mapping base', () => {
  const source = buildScheduleJsonSource(scheduleData);
  const input = {
    base: { schema: 'custom' },
    coursesPath: 'payload.courses',
    schedulePath: 'payload.schedule',
    courseFields: {
      name: 'title',
      position: 'location.text',
      weekList: 'weeks',
    },
    scheduleFields: {
      sections: 'raw',
    },
  };
  const mapping = validateScheduleJsonMapping(input);
  const payload = buildCustomScheduleJson(source, mapping);

  assert.equal(payload.schema, 'custom');
  assert.equal(payload.payload.courses[0].title, '测试课程');
  assert.equal(payload.payload.courses[0].location.text, '江安校区 一教 A101');
  assert.deepEqual(payload.payload.courses[0].weeks, [1, 2]);
  assert.equal(typeof payload.payload.schedule.raw, 'string');
  assert.deepEqual(input.base, { schema: 'custom' });
});
