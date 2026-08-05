import test from 'node:test';
import assert from 'node:assert/strict';
import { createNavbarController } from '../src/features/navigation/navbar.js';

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
      toggle(value, force) {
        const has = this.values.has(value);
        const shouldAdd = force === undefined ? !has : Boolean(force);
        if (shouldAdd) this.values.add(value);
        else this.values.delete(value);
      },
    },
    style: {
      props: {},
      setProperty(key, value, priority) { this.props[key] = { value, priority }; },
      removeProperty(key) { delete this.props[key]; },
    },
    dataset: {},
    innerHTML: '',
    textContent: '',
    title: '',
    id: '',
    className: '',
    href: '',
    disabled: false,
    parentElement: null,
    nextSibling: null,
    firstChild: null,
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
    },
    insertBefore(child, ref) {
      child.parentElement = this;
      child.nextSibling = ref || null;
      this.children.unshift(child);
    },
    setAttribute() {},
    removeAttribute() {},
    remove() {},
    click() {},
  };
  return element;
}

function baseTheme() {
  return {
    BRUTAL_DEFAULT_PALETTE: 'pink',
    DEFAULT_SEED: '#B53434',
    applyTheme() {},
    buildSchemePreview: () => ({ primary: '#000', surface: '#fff' }),
    getAccent: () => '',
    getBrutalActivePalette: () => ({ id: 'pink' }),
    getBrutalPaletteById: () => ({ accent: '#FF006E' }),
    getBrutalSelectedPalette: () => ({ id: 'acid', accent: '#CCFF00', name: '酸性绿' }),
    getCurrent: () => 'default',
    getScheme: () => 'tonal',
    getSkin: () => 'apple',
    isThemeModeAvailable: () => true,
    setBrutalPalette() {},
    skinSupportsDark: () => true,
    skinSupportsDynamic: () => true,
    skinSupportsFixedPalettes: () => false,
  };
}

function baseSettings() {
  return {
    ensureSettingsPanel() {},
    openSettingsPanel() {},
    syncSettingsPanelUI() {},
  };
}

test('syncs theme dots with the current theme state', () => {
  const dot = createElement('BUTTON');
  dot.dataset.theme = 'dark';
  const wrap = createElement('DIV');
  wrap.appendChild(dot);
  wrap.querySelectorAll = () => [dot];

  const controller = createNavbarController({
    theme: { ...baseTheme(), getCurrent: () => 'dark' },
    settings: baseSettings(),
    documentRef: { getElementById: () => wrap },
    windowRef: {},
  });

  controller.syncThemeDotGroup(wrap);

  assert.equal(dot.classList.contains('ac'), true);
  assert.equal(dot.classList.contains('urppp-theme-disabled'), false);
});

test('injects the theme switch and settings entry into the navbar brand', () => {
  const brand = createElement('A');
  const navbar = createElement('NAV');
  navbar.id = 'navbar';
  navbar.querySelector = () => brand;
  navbar.appendChild(brand);
  let injectedWrap = null;

  const controller = createNavbarController({
    theme: baseTheme(),
    settings: baseSettings(),
    documentRef: {
      getElementById(id) {
        if (id === 'navbar') return navbar;
        if (id === 'urppp-nav-theme') return injectedWrap;
        return null;
      },
      querySelector: () => brand,
      createElement: (tag) => createElement(tag),
    },
    windowRef: {},
  });

  controller.injectNavbarThemeSwitch();

  const wrap = navbar.children.find((child) => child.id === 'urppp-nav-theme');
  injectedWrap = wrap;
  assert.ok(wrap);
  assert.equal(wrap.style.props.display.value, 'inline-flex');

  const applied = [];
  const theme = baseTheme();
  theme.applyTheme = (name, opts) => applied.push({ name, opts });
  const dot = createElement('BUTTON');
  dot.dataset.theme = 'dark';
  const dotController = createNavbarController({ theme, settings: baseSettings(), documentRef: {}, windowRef: {} });
  dotController.handleThemeDotClick('dark');
  assert.equal(applied.length, 1);
  assert.equal(applied[0].name, 'dark');
});
