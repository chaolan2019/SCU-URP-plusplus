import test from 'node:test';
import assert from 'node:assert/strict';
import { createDashboardController } from '../src/features/dashboard/dashboard.js';

function makeElement(tagName) {
  return {
    tagName,
    children: [],
    listeners: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    style: { setProperty() {}, display: '' },
    innerHTML: '',
    innerText: '',
    textContent: '',
    href: '',
    onclick: null,
    scrollTop: 0,
    scrollLeft: 0,
    parentElement: null,
    closest: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener(type, callback) { this.listeners[type] = callback; },
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
    },
    getBoundingClientRect: () => ({ height: 400 }),
  };
}

test('rebuildDashboard returns early without enough site widgets', () => {
  const pageContent = makeElement('DIV');
  pageContent.appendChild(makeElement('DIV'));
  const documentRef = {
    body: makeElement('BODY'),
    getElementById: () => null,
    querySelector: (selector) => (selector === '.page-content' ? pageContent : null),
    createElement: (tag) => makeElement(tag),
  };
  globalThis.document = documentRef;
  const controller = createDashboardController({ deps: { statCardPrivacyMarkup: (value) => ({ valueHtml: value, labelHtml: '' }) } });
  controller.rebuildDashboard();
  assert.equal(documentRef.querySelector('#urppp-dashboard'), null);
});

test('dashboard exposes home reconstruction and calendar helpers', () => {
  const controller = createDashboardController({ deps: { statCardPrivacyMarkup: () => ({ valueHtml: '', labelHtml: '' }) } });
  assert.equal(typeof controller.rebuildDashboard, 'function');
  assert.equal(typeof controller.refreshHomeFullCalendar, 'function');
  assert.equal(typeof controller.scheduleHomeFullCalendarRefresh, 'function');
  assert.equal(typeof controller.wrapWidget, 'function');
});
