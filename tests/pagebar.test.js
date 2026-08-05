import test from 'node:test';
import assert from 'node:assert/strict';
import { createPagebarBeautifier } from '../src/features/table-beautify/pagebar.js';

function styleFixture() {
  const values = new Map();
  return {
    values,
    cssText: '',
    setProperty(name, value, priority) { values.set(name, { value, priority }); },
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

function pagebarFixture({ jumpMode }) {
  const list = { style: styleFixture() };
  const select = { value: jumpMode ? '20' : '20_0', style: styleFixture() };
  const jumpInput = {
    readOnly: !jumpMode,
    hasAttribute: () => !jumpMode,
    style: styleFixture(),
    classList: classListFixture(),
    parentElement: null,
  };
  const wrapper = { style: styleFixture() };
  const bar = {
    style: styleFixture(),
    classList: classListFixture(),
    querySelector(selector) {
      if (selector.startsWith('.dataTables_paginate')) return wrapper;
      if (selector.startsWith('select[id^="pagination_pageSize_"')) return select;
      if (selector === '[id^="turnpageto_"]') return jumpInput;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[id^="span_page_txt_"]') return [{ textContent: jumpMode ? '转到第 2 页' : '共 20 条' }];
      if (selector === 'ul.pagination, [id^="pagination_ul_"]') return [list];
      if (selector === 'select') return [select];
      return [];
    },
  };
  return { bar, jumpInput, list, select, wrapper };
}

test('uses the safe scroll layout for readonly or scrolling pagebars', () => {
  const fixture = pagebarFixture({ jumpMode: false });
  const destroyed = [];
  const controller = createPagebarBeautifier({
    destroyPagebarChosen: (select) => destroyed.push(select),
    documentRef: { querySelectorAll: () => [fixture.bar] },
    logger: { warn() {} },
  });

  controller.beautifyPagebar();

  assert.equal(fixture.bar.classList.contains('urppp-pagebar-scroll'), true);
  assert.equal(fixture.bar.classList.contains('urppp-pagebar-jump'), false);
  assert.equal(fixture.list.style.values.get('display').value, 'none');
  assert.equal(fixture.select.style.values.get('width').value, '128px');
  assert.deepEqual(destroyed, [fixture.select]);
});

test('uses flex layout only for an explicit writable jump pagebar', () => {
  const fixture = pagebarFixture({ jumpMode: true });
  const controller = createPagebarBeautifier({
    destroyPagebarChosen() {},
    documentRef: { querySelectorAll: () => [fixture.bar] },
    logger: { warn() {} },
  });

  controller.beautifyPagebar();

  assert.equal(fixture.bar.classList.contains('urppp-pagebar-jump'), true);
  assert.equal(fixture.bar.classList.contains('urppp-pagebar-scroll'), false);
  assert.equal(fixture.wrapper.style.values.get('display').value, 'flex');
  assert.equal(fixture.wrapper.style.values.get('gap').value, '8px');
});
