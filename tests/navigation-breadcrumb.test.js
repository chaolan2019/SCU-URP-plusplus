import test from 'node:test';
import assert from 'node:assert/strict';
import { createBreadcrumbController } from '../src/features/navigation/breadcrumb.js';

function createNode(tagName) {
  const node = {
    tagName,
    children: [],
    listeners: {},
    classList: {
      values: new Set(),
      add(value) { this.values.add(value); },
      remove(value) { this.values.delete(value); },
      contains(value) { return this.values.has(value); },
    },
    style: { setProperty() {}, removeProperty() {} },
    dataset: {},
    innerHTML: '',
    textContent: '',
    parentElement: null,
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
    },
    cloneNode() { return { querySelectorAll: () => [], textContent: this.textContent }; },
    remove() {},
  };
  return node;
}

function buildMenuTree() {
  const root = createNode('UL');
  root.id = 'menus';
  const item = createNode('LI');
  item.id = 'grades-item';
  item.classList.values.add('active');
  const link = createNode('A');
  link.setAttribute = () => {};
  link.textContent = '成绩查询';
  const textEl = createNode('SPAN');
  textEl.className = 'menu-text';
  textEl.textContent = '成绩查询';
  item.querySelector = (selector) => (selector === ':scope > a' ? link : null);
  link.querySelector = (selector) => (selector === '.menu-text, .urppp-nav-text' ? textEl : null);
  root.appendChild(item);
  return { root, item };
}

test('rebuilds breadcrumb with home and the active menu label', () => {
  const { root, item } = buildMenuTree();
  const breadcrumbList = createNode('UL');
  const box = createNode('DIV');
  box.querySelector = (selector) => (selector.includes('breadcrumb') ? breadcrumbList : null);

  const controller = createBreadcrumbController({
    documentRef: {
      getElementById(id) { return id === 'menus' ? root : null; },
      querySelector(selector) { return selector.includes('breadcrumbs') ? box : null; },
      querySelectorAll(selector) { return selector === '#menus li.active' ? [item] : []; },
      createElement: (tag) => createNode(tag),
      cookie: '',
    },
    locationRef: { pathname: '/student/grades', search: '', origin: 'https://example.test' },
    windowRef: { location: { href: '' } },
  });

  controller.beautifyBreadcrumbs();

  const labels = breadcrumbList.children.map((li) => li.children[0]?.textContent || li.textContent || li.innerHTML);
  assert.ok(labels.some((label) => label.includes('首页')));
  assert.ok(labels.some((label) => label.includes('成绩查询')));
});

test('keeps an existing real breadcrumb when the menu has no active branch', () => {
  const breadcrumbList = createNode('UL');
  const existing = createNode('LI');
  existing.textContent = '综合查询';
  breadcrumbList.children.push(existing);
  const box = createNode('DIV');
  box.querySelector = (selector) => (selector.includes('breadcrumb') ? breadcrumbList : null);

  const controller = createBreadcrumbController({
    documentRef: {
      getElementById() { return null; },
      querySelector(selector) { return selector.includes('breadcrumbs') ? box : null; },
      querySelectorAll() { return []; },
      createElement: (tag) => createNode(tag),
      cookie: '',
    },
    locationRef: { pathname: '/student/grades', search: '', origin: 'https://example.test' },
    windowRef: { location: { href: '' } },
  });

  controller.beautifyBreadcrumbs();

  assert.ok(breadcrumbList.children.length >= 1);
  assert.match(existing.textContent, /综合查询/);
});
