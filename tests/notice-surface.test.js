import test from 'node:test';
import assert from 'node:assert/strict';
import { createNoticeTableSurface } from '../src/features/table-beautify/notice-surface.js';

function styleFixture(initial = {}) {
  const values = new Map(Object.entries(initial));
  const priorities = new Map();
  return {
    values,
    getPropertyPriority(property) { return priorities.get(property) || ''; },
    removeProperty(property) { values.delete(property); priorities.delete(property); },
    setProperty(property, value, priority = '') {
      values.set(property, value);
      if (priority) priorities.set(property, priority);
    },
  };
}

function classListFixture(initial = []) {
  const values = new Set(initial);
  return {
    values,
    add(...classes) { classes.forEach((value) => values.add(value)); },
    remove(...classes) { classes.forEach((value) => values.delete(value)); },
    contains(value) { return values.has(value); },
  };
}

test('pins the theme surface onto notice rows and their cells', () => {
  const rowStyle = styleFixture();
  const cellStyle = styleFixture();
  const row = {
    classList: classListFixture(['urppp-notice-row']),
    style: rowStyle,
    querySelectorAll: () => [{ style: cellStyle, classList: classListFixture() }],
  };
  const controller = createNoticeTableSurface({
    getCurrentTheme: () => 'dark',
    documentRef: { documentElement: {} },
    getComputedStyleRef: () => ({ getPropertyValue: () => '' }),
  });

  controller.pinNoticeRowSurface(row);

  assert.equal(rowStyle.values.get('background'), '#151A24');
  assert.equal(rowStyle.values.get('background-color'), '#151A24');
  assert.equal(cellStyle.values.get('background'), 'transparent');
});

test('scrubs all notice rows inside a table and disarms hover classes', () => {
  const controller = createNoticeTableSurface({
    getCurrentTheme: () => 'light',
    documentRef: { documentElement: {} },
    getComputedStyleRef: () => ({ getPropertyValue: () => '#FFFFFF' }),
  });
  const pinned = [];
  const row = {
    classList: classListFixture(['urppp-notice-row', 'hover']),
    style: styleFixture(),
    querySelectorAll: () => [],
  };
  controller.pinNoticeRowSurface = (value) => pinned.push(value);

  const table = {
    classList: classListFixture(['table-hover', 'table-striped']),
    querySelectorAll: (selector) => (selector === 'tr.urppp-notice-row' ? [row] : []),
  };
  controller.disarmNoticeTableHover(table);

  assert.equal(table.classList.contains('urppp-notice-nohover'), true);
  assert.equal(table.classList.contains('table-hover'), false);
});

test('reverts notice classes and important styles on business tables', () => {
  const controller = createNoticeTableSurface({
    getCurrentTheme: () => 'light',
    documentRef: { documentElement: {} },
    getComputedStyleRef: () => ({ getPropertyValue: () => '#FFFFFF' }),
  });
  const removed = [];
  const element = {
    classList: classListFixture(['urppp-notice-row']),
    style: {
      getPropertyPriority: () => 'important',
      removeProperty: (property) => removed.push(property),
    },
    dataset: {},
    tagName: 'TR',
  };
  const wrapperStyle = styleFixture({ border: '1px', overflow: 'hidden' });
  const wrapper = {
    classList: classListFixture(['urppp-notice-wrap']),
    style: wrapperStyle,
  };
  const table = {
    classList: classListFixture(['urppp-notice-table']),
    dataset: { urpppNoticeScan: '1' },
    style: styleFixture({ border: '1px' }),
    closest: () => wrapper,
    querySelectorAll: () => [element],
  };

  controller.stripMistakenNoticeTable(table);

  assert.equal(table.classList.contains('urppp-notice-table'), false);
  assert.equal(table.dataset.urpppNoticeScan, undefined);
  assert.ok(removed.includes('display'));
  assert.ok(removed.includes('border'));
  assert.equal(wrapper.classList.contains('urppp-notice-wrap'), false);
});
