import test from 'node:test';
import assert from 'node:assert/strict';
import {
  firstScheduleCourse,
  normalizeScheduleExportData,
  schedulePlanCodeFromData,
  semesterLabelFromPlanCode,
} from '../src/features/schedule-export/data-normalize.js';

const rawSchedule = {
  jcsjbs: [
    { jc: '2', kssj: '0910', jssj: '0955' },
    { jc: '1', kssj: '08:15', jssj: '09:00' },
    { jc: '99', kssj: '10:00', jssj: '10:45' },
    { jc: '3', kssj: '25:00', jssj: '11:45' },
  ],
  xkxx: [{
    courseKey: {
      id: {
        coureNumber: 'C001',
        coureSequenceNumber: '02',
        zxjxjhh: '2026-2027-1',
      },
      courseName: '测试课程',
      englishCourseName: 'Test Course',
      attendClassTeacher: '测试教师',
      coursePropertiesName: '必修',
      courseCategoryName: '专业课',
      unit: '3',
      selectCourseStatusName: '已选',
      skzcs: '1-4周单周',
      timeAndPlaceList: [
        {
          classDay: '1',
          classSessions: '1',
          continuingSession: '2',
          weekDescription: '1-4周单周',
          campusName: '测试校区',
          teachingBuildingName: '一教',
          classroomName: 'A101',
        },
        {
          classDay: '8',
          classSessions: '1',
          continuingSession: '1',
        },
      ],
    },
  }],
};

test('raw schedule helpers extract plans and readable semester labels', () => {
  assert.equal(firstScheduleCourse(rawSchedule).courseName, '测试课程');
  assert.equal(schedulePlanCodeFromData(rawSchedule), '2026-2027-1');
  assert.equal(schedulePlanCodeFromData({ xkxx: [] }), '');
  assert.equal(semesterLabelFromPlanCode('2026-2027-1'), '2026-2027学年秋季学期');
  assert.equal(semesterLabelFromPlanCode('2026-2027-2'), '2026-2027学年春季学期');
  assert.equal(semesterLabelFromPlanCode('invalid'), '学生课表');
});

test('raw schedule normalization filters invalid data without page dependencies', () => {
  const normalized = normalizeScheduleExportData(rawSchedule, '', 'fixture', {
    firstMonday: '2026-09-07',
    now: new Date('2026-08-04T00:00:00.000Z'),
  });

  assert.equal(normalized.exportedAt, '2026-08-04T00:00:00.000Z');
  assert.deepEqual(normalized.semester, {
    planCode: '2026-2027-1',
    label: '2026-2027学年秋季学期',
    firstMonday: '2026-09-07',
  });
  assert.deepEqual(normalized.sections, [
    { section: 1, start: '08:15', end: '09:00' },
    { section: 2, start: '09:10', end: '09:55' },
  ]);
  assert.equal(normalized.courses.length, 1);
  assert.deepEqual(normalized.courses[0], {
    code: 'C001',
    sequence: '02',
    name: '测试课程',
    englishName: 'Test Course',
    teacher: '测试教师',
    attribute: '必修',
    category: '专业课',
    credit: 3,
    status: '已选',
    arrangements: [{
      day: 1,
      startSection: 1,
      endSection: 2,
      weeks: [1, 3],
      weekDescription: '1-4周单周',
      campus: '测试校区',
      building: '一教',
      classroom: 'A101',
    }],
  });
});

test('invalid stored first Mondays are discarded', () => {
  const normalized = normalizeScheduleExportData(rawSchedule, '', '', {
    firstMonday: '2026-02-30',
    now: new Date('2026-08-04T00:00:00.000Z'),
  });
  assert.equal(normalized.semester.firstMonday, '');
  assert.equal(normalized.source, 'SCU URP++');
});
