import test from 'node:test';
import assert from 'node:assert/strict';
import { createSidebarController } from '../src/features/navigation/sidebar.js';

function createElement(tagName) {
  const element = {
    tagName,
    children: [],
    listeners: {},
    classList: {
      values: new Set(),
      add(value) { this.values.add(value); },
      remove(value) { this.values.delete(value); },
      contains(value) { return this.values.has(value); },
      toggle(value) {
        if (this.values.has(value)) this.values.delete(value);
        else this.values.add(value);
      },
    },
    style: {
      props: {},
      cssText: '',
      setProperty(key, value, priority) { this.props[key] = { value, priority }; },
    },
    dataset: {},
    innerHTML: '',
    textContent: '',
    title: '',
    id: '',
    className: '',
    href: '',
    parentElement: null,
    firstChild: null,
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
    },
    insertBefore(child) { this.firstChild = child; this.children.unshift(child); },
    remove() {},
    click() {},
    getAttribute() { return ''; },
  };
  return element;
}

test('syncs content offset for desktop and narrow layouts', () => {
  const sidebar = createElement('ASIDE');
  sidebar.classList.values.add('menu-min');
  const main = createElement('MAIN');
  const controller = createSidebarController({
    documentRef: {
      getElementById: () => sidebar,
      querySelectorAll: () => [main],
      documentElement: createElement('HTML'),
      body: createElement('BODY'),
      createElement: (tag) => createElement(tag),
    },
    windowRef: {
      matchMedia: () => ({ matches: false }),
      __urpppSidebarMenuObserver: null,
    },
    MutationObserverRef: class {},
    nodeTypeRef: { TEXT_NODE: 3 },
  });

  controller.syncMobileContentOffset();
  assert.equal(main.style.props['margin-left'].value, '50px');
});

test('leaves clean mode sidebar geometry under clean controller ownership', () => {
  const sidebar = createElement('ASIDE');
  sidebar.classList.values.add('urppp-clean-sidebar');
  sidebar.style.setProperty('top', '60px', 'important');
  sidebar.style.setProperty('height', '740px', 'important');
  const navbar = createElement('NAV');
  navbar.getBoundingClientRect = () => ({ height: 45 });
  const controller = createSidebarController({
    documentRef: {
      getElementById: () => sidebar,
      querySelector: () => navbar,
      querySelectorAll: () => [],
      documentElement: createElement('HTML'),
      body: createElement('BODY'),
      createElement: (tag) => createElement(tag),
    },
    windowRef: { matchMedia: () => ({ matches: false }) },
    MutationObserverRef: class {},
    nodeTypeRef: { TEXT_NODE: 3 },
  });

  controller.syncSidebarUnderNavbar();

  assert.equal(sidebar.style.props.top.value, '60px');
  assert.equal(sidebar.style.props.height.value, '740px');
});

test('rebuilds the sidebar and clears the previous observer', () => {
  const sidebar = createElement('ASIDE');
  sidebar.id = 'sidebar';
  const menu = createElement('UL');
  menu.id = 'menus';
  const item = createElement('LI');
  item.id = 'menu-item';
  item.classList.values.add('active');
  menu.appendChild(item);
  const body = createElement('BODY');
  const windowRef = { __urpppSidebarMenuObserver: null };

  const observed = [];
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe(target, options) { observed.push({ target, options }); }
    disconnect() { this.disconnected = true; }
  }

  const controller = createSidebarController({
    documentRef: {
      body,
      getElementById(id) {
        if (id === 'sidebar') return sidebar;
        if (id === 'menus') return menu;
        return null;
      },
      querySelector(selector) { return selector === '#navbar, .navbar.navbar-default, .navbar-fixed-top' ? null : null; },
      querySelectorAll() { return []; },
      documentElement: createElement('HTML'),
      createElement: (tag) => createElement(tag),
    },
    windowRef,
    MutationObserverRef: Observer,
    nodeTypeRef: { TEXT_NODE: 3 },
  });

  const oldObserver = new Observer(() => {});
  windowRef.__urpppSidebarMenuObserver = oldObserver;

  controller.rebuildSidebarCompletely();

  assert.equal(oldObserver.disconnected, true);
  assert.ok(windowRef.__urpppSidebarMenuObserver instanceof Observer);
  assert.notEqual(windowRef.__urpppSidebarMenuObserver, oldObserver);
  assert.ok(observed.length >= 2);
});
