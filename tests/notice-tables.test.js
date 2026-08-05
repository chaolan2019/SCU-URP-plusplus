import test from 'node:test';
import assert from 'node:assert/strict';
import { createNoticeTableBeautifier } from '../src/features/table-beautify/notice-tables.js';

function noop() {}

function documentMock(tablesBySelector) {
  return {
    title: '',
    createElement: () => ({ className: '', textContent: '', appendChild: noop }),
    querySelectorAll(selector) {
      return tablesBySelector[selector] || [];
    },
  };
}

test('returns immediately while native PDF isolation is active', () => {
  let touched = false;
  const beautifier = createNoticeTableBeautifier({
    isNativePdfIsolationActive: () => true,
    bindNoticeHoverScrub() { touched = true; },
    scrubNoticeInlineBg() { touched = true; },
    stripMistakenNoticeTable() { touched = true; },
    disarmNoticeTableHover: noop,
    pinNoticeRowSurface: noop,
    isBusinessDataTable: noop,
    isNoticeListTable: noop,
    isNoticePageContext: noop,
    isNoticeBulletText: noop,
    documentRef: documentMock({}),
    windowRef: { location: { href: '' }, open: noop },
    logger: { warn: noop },
  });

  beautifier.beautifyNoticeTables();
  assert.equal(touched, false);
});

test('strips notice styles from a business table misclassified as notice', () => {
  const stripped = [];
  const businessTable = {
    classList: { contains: (name) => name === 'urppp-notice-table' },
    querySelector: (selector) => (selector.includes('urppp-notice-row') ? {} : null),
  };
  const beautifier = createNoticeTableBeautifier({
    isNativePdfIsolationActive: () => false,
    bindNoticeHoverScrub: noop,
    scrubNoticeInlineBg: noop,
    stripMistakenNoticeTable: (table) => stripped.push(table),
    disarmNoticeTableHover: noop,
    pinNoticeRowSurface: noop,
    isBusinessDataTable: () => true,
    isNoticeListTable: () => false,
    isNoticePageContext: () => false,
    isNoticeBulletText: () => false,
    documentRef: documentMock({
      'table.urppp-notice-table, table.table': [businessTable],
    }),
    windowRef: { location: { href: '' }, open: noop },
    logger: { warn: noop },
  });

  beautifier.beautifyNoticeTables();
  assert.deepEqual(stripped, [businessTable]);
});
