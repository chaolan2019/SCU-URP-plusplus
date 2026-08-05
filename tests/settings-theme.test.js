import test from 'node:test';
import assert from 'node:assert/strict';
import { createThemeSettingsController } from '../src/features/settings/theme-controller.js';
import { syncThemeSettingsControls } from '../src/features/settings/theme-settings.js';

function createControl(dataset = {}) {
  const listeners = {};
  return {
    attributes: {},
    children: [],
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
    addEventListener(name, listener) { listeners[name] = listener; },
    appendChild(child) { this.children.push(child); },
    emit(name) { return listeners[name]?.(); },
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
    checkUpdate: createControl(),
    generate: createControl(),
    save: createControl(),
    schemes: createControl(),
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
        '#urppp-set-check-update': controls.checkUpdate,
        '#urppp-set-gen': controls.generate,
        '#urppp-set-save': controls.save,
        '#urppp-set-schemes': controls.schemes,
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

test('theme settings controller translates controls into ordered theme commands', () => {
  const panel = createPanel();
  const calls = [];
  let followSystem = false;
  let followDynamic = false;
  let cleanDefault = false;
  let appleEdge = true;
  let autoUpdate = false;
  let scheme = 'tonal';
  const normalize = (value) => /^#?[0-9a-f]{6}$/i.test(String(value))
    ? ('#' + String(value).replace('#', '').toUpperCase())
    : '';
  const controller = createThemeSettingsController({
    document: { createElement: () => createControl() },
    theme: {
      isModeAvailable: () => true,
      apply: (name, options) => calls.push(['apply', name, options]),
      supportsDark: () => true,
      supportsDynamic: () => true,
      getFollowSystem: () => followSystem,
      setFollowSystem: (value) => { followSystem = value; calls.push(['follow', value]); },
      resolveFollowTheme: () => 'dark',
      getCurrent: () => 'default',
      getFollowDynamic: () => followDynamic,
      setFollowDynamic: (value) => { followDynamic = value; calls.push(['dynamic', value]); },
      syncNavbar: () => calls.push(['navbar']),
    },
    preferences: {
      getCleanDefault: () => cleanDefault,
      setCleanDefault: (value) => { cleanDefault = value; calls.push(['clean', value]); },
      getAppleEdge: () => appleEdge,
      setAppleEdge: (value) => { appleEdge = value; calls.push(['edge', value]); },
      applySkin: () => calls.push(['skin']),
      getAutoUpdate: () => autoUpdate,
      setAutoUpdate: (value) => { autoUpdate = value; calls.push(['auto', value]); },
      checkUpdates: () => calls.push(['check']),
    },
    accent: {
      normalize,
      setAccent: (value) => calls.push(['accent', value]),
      savePreset: (value) => calls.push(['preset', value]),
      getScheme: () => scheme,
      setScheme: (value) => { scheme = value; calls.push(['scheme', value]); },
      listSchemePreviews: () => [{
        id: 'tonal',
        name: '柔和同色',
        desc: '测试方案',
        bg: '#FFFFFF',
        surface: '#F5F5F5',
        border: '#DDDDDD',
        primary: '#B53434',
      }],
    },
    syncPanel: () => calls.push(['sync']),
  });

  controller.bind(panel);
  panel.dynamicMode.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['apply', 'scu-red', { manual: true }],
    ['sync'],
  ]);

  panel.follow.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['follow', true],
    ['apply', 'dark', { system: true }],
    ['sync'],
    ['navbar'],
  ]);

  panel.dynamicFollow.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['dynamic', true],
    ['apply', 'dark', { system: true }],
    ['sync'],
    ['navbar'],
  ]);

  panel.cleanDefault.emit('click');
  panel.appleEdge.emit('click');
  panel.autoUpdate.emit('click');
  panel.checkUpdate.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['clean', true], ['sync'],
    ['edge', false], ['skin'], ['sync'],
    ['auto', true], ['sync'],
    ['check'],
  ]);

  panel.color.value = '#abcdef';
  panel.color.emit('input');
  assert.equal(panel.hex.value, '#ABCDEF');
  panel.generate.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['accent', '#ABCDEF'],
    ['apply', 'dark', { system: true }],
    ['sync'],
  ]);

  panel.save.emit('click');
  assert.deepEqual(calls.splice(0), [
    ['preset', '#ABCDEF'],
    ['accent', '#ABCDEF'],
    ['apply', 'dark', { system: true }],
    ['sync'],
  ]);

  panel.color.emit('change');
  assert.equal(panel.schemes.children.length, 1);
  panel.schemes.children[0].emit('click');
  assert.deepEqual(calls.splice(0), [
    ['accent', '#ABCDEF'],
    ['scheme', 'tonal'],
    ['apply', 'dark', { system: true }],
    ['sync'],
  ]);
});
