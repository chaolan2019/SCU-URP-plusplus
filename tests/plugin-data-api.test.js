/**
 * api.data 单测：只测这一层自己的责任——形状收口、周次兜底、出错不抛。
 * 课表解析本身由 schedule-export 的既有测试覆盖，这里用假的解析器就行，
 * 否则一处改版要同时扑两套测试。
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { createDataApi } from '../src/features/plugin-manager/data-api.js';

const RAW = { xkxx: { a: {} } };

const NORMALIZED = {
  semester: { label: '2026-2027 秋季学期', firstMonday: '2026-08-31' },
  sections: [{ section: 1, start: '08:00', end: '08:45' }],
  courses: [
    {
      name: '高等数学',
      teacher: '张老师',
      credit: 5,
      extra: '不该出现在契约里',
      arrangements: [
        { day: 5, startSection: 1, endSection: 2, weeks: [1, 2, 3], weekDescription: '1-3周', campus: '江安', building: '东三教', classroom: '201', extra: 'x' },
      ],
    },
  ],
};

function makeDeps(overrides = {}) {
  const calls = [];
  return {
    calls,
    deps: Object.assign({
      loadSchedule: async () => RAW,
      normalizeScheduleDataForPage: (data, planCode, source) => {
        calls.push({ data, planCode, source });
        return NORMALIZED;
      },
      schedulePlanCodeFromData: () => 'PLAN-1',
      ensureTermWeekResolved: async () => 4,
    }, overrides),
  };
}

test('schedule()：按契约收口，且只暴露约定字段', async () => {
  const { deps, calls } = makeDeps();
  const api = createDataApi(deps);
  const out = await api.schedule();

  assert.equal(out.error, undefined);
  assert.equal(out.currentWeek, 4);
  assert.equal(out.semester.label, '2026-2027 秋季学期');
  assert.equal(out.semester.firstMonday, '2026-08-31');
  assert.deepEqual(out.sections, NORMALIZED.sections);
  assert.equal(out.courses.length, 1);
  assert.deepEqual(out.courses[0], {
    name: '高等数学',
    teacher: '张老师',
    credit: 5,
    arrangements: [{
      day: 5,
      startSection: 1,
      endSection: 2,
      weeks: [1, 2, 3],
      weekDescription: '1-3周',
      campus: '江安',
      building: '东三教',
      classroom: '201',
    }],
  });

  // 复用了主脚本的解析，并且带上了来源标记，便于主脚本侧排查
  assert.equal(calls.length, 1);
  assert.equal(calls[0].data, RAW);
  assert.equal(calls[0].planCode, 'PLAN-1');
  assert.equal(calls[0].source, 'agent');
});

test('schedule()：读不到、解析器缺失、抛异常，都回 { error } 而不抛', async () => {
  const cases = [
    { override: { loadSchedule: async () => null }, expect: '读不到课表' },
    { override: { loadSchedule: async () => ({ error: '登录已过期' }) }, expect: '登录已过期' },
    { override: { normalizeScheduleDataForPage: null }, expect: '解析器不可用' },
    { override: { loadSchedule: async () => { throw new Error('网络断了'); } }, expect: '网络断了' },
  ];
  for (const item of cases) {
    const { deps } = makeDeps(item.override);
    const out = await createDataApi(deps).schedule();
    assert.ok(out.error && out.error.includes(item.expect), `期望 error 含「${item.expect}」，实际：${JSON.stringify(out)}`);
  }
});

test('term()：周次三条来源依次兜底，并带上学期首周一', async () => {
  // 第一条可用就用第一条
  let { deps } = makeDeps();
  assert.deepEqual(await createDataApi(deps).term(), { currentWeek: 4, firstMonday: '2026-08-31' });

  // 第一条不可用 → 退到 getCurrentWeekNumber
  deps = makeDeps({ ensureTermWeekResolved: async () => 0, getCurrentWeekNumber: () => 7 }).deps;
  assert.equal((await createDataApi(deps).term()).currentWeek, 7);

  // 前两条都不可用 → 退到记住的周次
  deps = makeDeps({
    ensureTermWeekResolved: async () => { throw new Error('boom'); },
    getCurrentWeekNumber: () => 0,
    readRememberedTermWeek: () => 9,
  }).deps;
  assert.equal((await createDataApi(deps).term()).currentWeek, 9);

  // 三条都不可用 → 0，不抛
  deps = makeDeps({ ensureTermWeekResolved: null, getCurrentWeekNumber: null, readRememberedTermWeek: null }).deps;
  const out = await createDataApi(deps).term();
  assert.equal(out.currentWeek, 0);
  assert.equal(out.firstMonday, '2026-08-31');
});

test('term()：拿不到课表时首周一留空，不影响周次', async () => {
  const { deps } = makeDeps({ loadSchedule: async () => { throw new Error('no'); } });
  const out = await createDataApi(deps).term();
  assert.equal(out.currentWeek, 4);
  assert.equal(out.firstMonday, '');
});
