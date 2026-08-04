import test from 'node:test';
import assert from 'node:assert/strict';
import { syncThemeSettingsControls } from '../src/features/settings/theme-settings.js';

function createControl(dataset = {}) {
  return {
    attributes: {},
    classList: {
      values: new Set(),
      toggle(name, enabled) {
        if (enabled) this.values.add(name);
        else this.values.delete(name);
      },
    },
    dataset,
    disabled: false,
    style: {},
    textContent: '',
    title: '',
    value: '',
    removeAttribute(name) { delete this.attributes[name]; if (name === 'title') this.title = ''; },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

function createPanel() {
  const controls = {
    color: createControl(),
    hex: createControl(),
    defaultMode: createControl({ theme: 'default' }),
    darkMode: createControl({ theme: 'dark' }),
    dynamicMode: createControl({ theme: 'scu-red' }),
    follow: createControl(),
    dynamicFollow: createControl(),
    dynamicSection: createControl(),
    dynamicChild: createControl(),
    dynamicLabel: createControl(),
    brutalSection: createControl(),
    cleanDefault: createControl(),
    appleEdge: createControl(),
    appleEdgeTip: createControl(),
    autoUpdate: createControl(),
  };
  controls.dynamicSection.querySelectorAll = (selector) => selector.startsWith('button')
    ? [controls.dynamicChild]
    : [controls.dynamicLabel];
  return {
    ...controls,
    querySelectorAll(selector) {
      return selector === '.urppp-set-mode'
        ? [controls.defaultMode, controls.darkMode, controls.dynamicMode]
        : [];
    },
    querySelector(selector) {
      return {
        '#urppp-set-color': controls.color,
        '#urppp-set-hex': controls.hex,
        '#urppp-set-follow': controls.follow,
        '#urppp-set-follow-dynamic': controls.dynamicFollow,
        '#urppp-set-dynamic': controls.dynamicSection,
        '#urppp-set-brutal': controls.brutalSection,
        '#urppp-set-clean-default': controls.cleanDefault,
        '#urppp-set-apple-edge': controls.appleEdge,
        '#urppp-set-apple-edge-tip': controls.appleEdgeTip,
        '#urppp-set-auto-update': controls.autoUpdate,
      }[selector] || null;
    },
  };
}

function baseState(overrides = {}) {
  return {
    seed: '#B53434',
    currentTheme: 'default',
    followSystem: false,
    skinId: 'apple',
    darkSupported: true,
    dynamicSupported: true,
    fixedPalettes: false,
    followUseDynamic: false,
    cleanDefault: false,
    appleEdge: true,
    autoUpdate: false,
    modeAvailability: { default: true, dark: true, 'scu-red': true },
    ...overrides,
  };
}

test('theme settings projection reflects an available Apple theme state', () => {
  const panel = createPanel();
  syncThemeSettingsControls(panel, baseState({
    currentTheme: 'scu-red',
    followSystem: true,
    followUseDynamic: true,
    cleanDefault: true,
    autoUpdate: true,
  }));

  assert.equal(panel.color.value, '#B53434');
  assert.equal(panel.hex.value, '#B53434');
  assert.equal(panel.defaultMode.classList.values.has('ac'), false);
  assert.equal(panel.dynamicMode.classList.values.has('ac'), false);
  assert.equal(panel.follow.classList.values.has('ac'), true);
  assert.equal(panel.follow.attributes['aria-pressed'], 'true');
  assert.equal(panel.dynamicFollow.classList.values.has('ac'), true);
  assert.equal(panel.dynamicFollow.disabled, false);
  assert.equal(panel.dynamicSection.style.display, '');
  assert.equal(panel.dynamicSection.style.opacity, '1');
  assert.equal(panel.brutalSection.style.display, 'none');
  assert.equal(panel.cleanDefault.textContent, '默认进入清爽模式：开');
  assert.equal(panel.appleEdge.style.display, '');
  assert.equal(panel.appleEdge.textContent, '类Apple边缘线条：开');
  assert.equal(panel.autoUpdate.textContent, '自动检测更新：开');
});

test('theme settings projection disables unsupported brutal theme controls', () => {
  const panel = createPanel();
  syncThemeSettingsControls(panel, baseState({
    currentTheme: 'default',
    skinId: 'brutal',
    darkSupported: false,
    dynamicSupported: false,
    fixedPalettes: true,
    followUseDynamic: true,
    appleEdge: false,
    modeAvailability: { default: true, dark: false, 'scu-red': false },
  }));

  assert.equal(panel.defaultMode.classList.values.has('ac'), true);
  assert.equal(panel.darkMode.disabled, true);
  assert.equal(panel.darkMode.attributes['aria-disabled'], 'true');
  assert.match(panel.darkMode.title, /不支持暗色模式/);
  assert.equal(panel.dynamicMode.disabled, true);
  assert.match(panel.dynamicMode.title, /不支持动态配色/);
  assert.equal(panel.follow.disabled, true);
  assert.equal(panel.dynamicFollow.disabled, true);
  assert.equal(panel.dynamicFollow.style.opacity, '0.5');
  assert.equal(panel.dynamicSection.style.display, 'none');
  assert.equal(panel.dynamicChild.disabled, true);
  assert.equal(panel.dynamicLabel.classList.values.has('urppp-dyn-disabled'), true);
  assert.equal(panel.brutalSection.style.display, '');
  assert.equal(panel.appleEdge.style.display, 'none');
  assert.equal(panel.appleEdgeTip.style.display, 'none');
});
