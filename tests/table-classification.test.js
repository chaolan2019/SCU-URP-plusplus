import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBusinessDataTable,
  isNoticeBulletText,
  isNoticeDateText,
  isNoticeListTable,
  isNoticePageContext,
} from '../src/features/table-beautify/table-classification.js';

function classList(values = []) {
  const classes = new Set(values);
  return { contains: (value) => classes.has(value) };
}

function tableFixture({
  id = '',
  classes = [],
  headText = '',
  rows = [],
  style = '',
  width = '',
  text = '',
  hasBusinessBody = false,
} = {}) {
  const rowNodes = rows.map(({ cells, hasLink = false }) => {
    const cellNodes = cells.map((cellText) => ({ textContent: cellText }));
    return {
      textContent: cells.join(' '),
      querySelector: (selector) => (selector === 'a' && hasLink ? {} : null),
      querySelectorAll: (selector) => (selector === 'td' || selector === 'td,th' ? cellNodes : []),
    };
  });
  const thead = headText ? { textContent: headText } : null;
  const attributes = { class: classes.join(' '), style, width };

  return {
    id,
    classList: classList(classes),
    textContent: text || [headText, ...rowNodes.map((row) => row.textContent)].join(' '),
    getAttribute: (name) => attributes[name] || '',
    querySelector(selector) {
      if (selector === 'thead') return thead;
      if (selector === 'tbody tr, tr') return rowNodes[0] || null;
      if (selector === 'a') return rowNodes.some((row) => row.querySelector('a')) ? {} : null;
      if (selector.startsWith('#tbodyFreeClassroom')) return hasBusinessBody ? {} : null;
      return null;
    },
    querySelectorAll: (selector) => (selector === 'tbody tr, tr' ? rowNodes : []),
  };
}

test('recognizes notice markers, dates, and route context', () => {
  assert.equal(isNoticeBulletText(' ● '), true);
  assert.equal(isNoticeBulletText('1024'), true);
  assert.equal(isNoticeBulletText('课程'), false);
  assert.equal(isNoticeDateText('发布于 2026-07-10 11:10'), true);
  assert.equal(isNoticePageContext({ pathname: '/student/notice/index' }), true);
  assert.equal(isNoticePageContext({ title: '选课公告' }), true);
  assert.equal(isNoticePageContext({ title: '成绩查询' }), false);
});

test('prioritizes notice headers and compact notice rows over business heuristics', () => {
  const headedNotice = tableFixture({
    headText: '序号 标题 发布时间',
    rows: [{ cells: ['1', '选课安排', '2026-07-10'], hasLink: true }],
  });
  const borderlessNotice = tableFixture({
    classes: ['no-border-top'],
    rows: [{ cells: ['●', '系统维护通知', '2026-07-10'], hasLink: true }],
  });

  assert.equal(isNoticeListTable(headedNotice), true);
  assert.equal(isBusinessDataTable(headedNotice), false);
  assert.equal(isNoticeListTable(borderlessNotice), true);
});

test('classifies wide and domain-specific tables while leaving generic compact tables alone', () => {
  const wideTable = tableFixture({ rows: [{ cells: ['1', '2', '3', '4', '5'] }] });
  const gradeTable = tableFixture({ id: 'student-grade-table', headText: '课程名 成绩' });
  const compactTable = tableFixture({ rows: [{ cells: ['标签', '值'] }] });

  assert.equal(isBusinessDataTable(wideTable), true);
  assert.equal(isBusinessDataTable(gradeTable), true);
  assert.equal(isBusinessDataTable(compactTable), false);
});
