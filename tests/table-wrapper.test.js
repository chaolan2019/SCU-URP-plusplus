import test from 'node:test';
import assert from 'node:assert/strict';
import { createTableWrapper } from '../src/features/table-beautify/table-wrapper.js';

function tableFixture(parent) {
  return {
    id: 'fixture-table',
    parentElement: parent,
    classList: { contains: () => false },
    closest: () => null,
  };
}

function createDocument(tables, root = null) {
  const wrappers = [];
  return {
    body: root,
    wrappers,
    getElementById: () => root,
    querySelector: () => null,
    querySelectorAll: () => tables,
    createElement() {
      const wrapper = {
        className: '',
        child: null,
        appendChild(child) { this.child = child; },
      };
      wrappers.push(wrapper);
      return wrapper;
    },
  };
}

test('wraps ordinary tables once and only marks scroll table hosts', () => {
  const inserted = [];
  const parent = {
    id: 'results',
    style: {},
    classList: { add() {} },
    insertBefore(wrapper, table) { inserted.push({ wrapper, table }); },
  };
  const scrollClasses = [];
  const scrollParent = {
    id: 'scores_scroll',
    style: {},
    classList: { add(value) { scrollClasses.push(value); } },
    insertBefore() { throw new Error('scroll tables must not be wrapped'); },
  };
  const tables = [tableFixture(parent), tableFixture(scrollParent)];
  const documentRef = createDocument(tables);
  const controller = createTableWrapper({
    documentRef,
    windowRef: {},
    MutationObserverRef: class {},
    getComputedStyleRef: () => ({ overflow: 'visible' }),
    isNativePdfIsolationActive: () => false,
    isBusinessDataTable: () => true,
  });

  controller.wrapTables();

  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].wrapper.className, 'urppp-table-wrap');
  assert.equal(inserted[0].wrapper.child, tables[0]);
  assert.deepEqual(scrollClasses, ['urppp-scroll-table-host']);
});

test('reuses the observer for a connected PJAX root and replaces stale roots', () => {
  const observed = [];
  const disconnected = [];
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe(root, options) { observed.push({ root, options }); }
    disconnect() { disconnected.push(this); }
  }

  const firstRoot = { isConnected: true };
  const secondRoot = { isConnected: true };
  let currentRoot = firstRoot;
  const documentRef = {
    body: firstRoot,
    getElementById: () => currentRoot,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({}),
  };
  const windowRef = {};
  const controller = createTableWrapper({
    documentRef,
    windowRef,
    MutationObserverRef: Observer,
    getComputedStyleRef: () => ({ overflow: 'visible' }),
    isNativePdfIsolationActive: () => false,
    isBusinessDataTable: () => false,
  });

  controller.bindTableWrapObserver();
  controller.bindTableWrapObserver();
  assert.equal(observed.length, 1);

  currentRoot = secondRoot;
  controller.bindTableWrapObserver();
  assert.equal(observed.length, 2);
  assert.equal(disconnected.length, 1);
  assert.equal(windowRef.__urpppTableObsRoot, secondRoot);
});
