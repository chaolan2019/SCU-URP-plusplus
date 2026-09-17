/**
 * api.actions 单测：导出格式归一、失败不抛、以及“只有真正调用了导出函数才算成功”。
 * 导出本身的生成逻辑由 schedule-export 的既有测试覆盖，这里只测这一层。
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { createActionApi } from '../src/features/plugin-manager/action-api.js';

const DATA = { xkxx: {} };

function makeDeps(overrides = {}) {
  const calls = [];
  const base = {
    loadSchedule: async () => DATA,
    exportIcs: async (data) => { calls.push({ kind: 'ics', data }); },
    exportJson: async (data) => { calls.push({ kind: 'json', data }); },
    exportPng: async (data) => { calls.push({ kind: 'png', data }); },
  };
  return { calls, deps: Object.assign(base, overrides), base };
}

test('exportSchedule()：格式别名归一，真的调到对应导出函数', async () => {
  const cases = [
    ['ics', 'ics'], ['ical', 'ics'], ['calendar', 'ics'],
    ['json', 'json'],
    ['png', 'png'], ['image', 'png'], ['PNG', 'png'],
  ];
  for (const [input, expect] of cases) {
    const { deps, calls } = makeDeps();
    const out = await createActionApi(deps).exportSchedule({ format: input });
    assert.deepEqual(out, { ok: true, format: expect }, `${input} 应归一为 ${expect}`);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].kind, expect);
    assert.equal(calls[0].data, DATA);
  }
});

test('exportSchedule()：未知格式、缺能力、数据读不到，都不抛只回 ok:false', async () => {
  const bad = [
    { override: {}, args: { format: 'pdf' }, expect: '不支持的格式' },
    { override: {}, args: {}, expect: '不支持的格式' },
    { override: { exportPng: null }, args: { format: 'png' }, expect: '还不能导出 png' },
    { override: { loadSchedule: async () => null }, args: { format: 'ics' }, expect: '读不到课表' },
    { override: { loadSchedule: async () => ({ error: '登录过期' }) }, args: { format: 'ics' }, expect: '登录过期' },
    { override: { exportIcs: async () => { throw new Error('写文件失败'); } }, args: { format: 'ics' }, expect: '写文件失败' },
  ];
  for (const item of bad) {
    const { deps } = makeDeps(item.override);
    const out = await createActionApi(deps).exportSchedule(item.args);
    assert.equal(out.ok, false, `${JSON.stringify(item.args)} 应当失败`);
    assert.ok(out.error.includes(item.expect), `期望含「${item.expect}」，实际：${out.error}`);
  }
});

test('exportFormats()：只列出真的能用的格式', async () => {
  const { deps } = makeDeps({ exportPng: null });
  const formats = createActionApi(deps).exportFormats();
  assert.deepEqual(formats.map((item) => item.format), ['ics', 'json']);
  assert.ok(formats[0].label);
});
