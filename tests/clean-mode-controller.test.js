import test from 'node:test';
import assert from 'node:assert/strict';
import { createCleanModeState } from '../src/features/clean-mode/state.js';
import { createCleanModeController } from '../src/features/clean-mode/controller.js';

function controllerFixture() {
  const state = createCleanModeState();
  const calls = { loadAll: 0, render: 0, closeModal: 0 };
  const makeElement = () => ({
    id: '',
    innerHTML: '',
    offsetWidth: 0,
    __syncCleanThemeDots: null,
    classList: { add() {}, remove() {}, toggle() {} },
    style: { setProperty() {} },
    querySelector: () => ({ onclick: null, classList: { add() {}, remove() {}, toggle() {} }, dataset: {}, addEventListener() {} }),
    querySelectorAll: () => [],
    addEventListener() {},
    appendChild() {},
  });
  let createdEl = null;
  globalThis.document = {
    documentElement: { classList: { add() {}, remove() {} }, appendChild() {} },
    getElementById: () => createdEl,
    createElement: () => {
      createdEl = makeElement();
      return createdEl;
    },
    querySelector: () => null,
    readyState: 'complete',
    addEventListener() {},
  };
  const controller = createCleanModeController({
    state,
    deps: {
      CLEAN_FLAG: 'urppp-clean-open',
      applySkinAttr() {},
      closeModal() { calls.closeModal += 1; },
      ensureRoomCatalogLoaded() {},
      ensureStyle() {},
      getCurrentWeekNumber: () => 0,
      getSkin: () => 'apple',
      handleThemeDotClick() {},
      ico: () => '',
      isHomePage: () => true,
      loadAll(force) { calls.loadAll += 1; },
      openSettingsPanel() {},
      readRememberedTermWeek: () => 0,
      refreshCleanPersonalDisplay() {},
      render() { calls.render += 1; },
      scoreToGpa: () => null,
      summarizeCourses: () => ({}),
      syncNavbarThemeUI() {},
      syncSettingsPanelUI() {},
      syncThemeDotGroup() {},
    },
  });
  return { state, calls, controller };
}

test('clean mode controller exposes the public API surface', () => {
  const { controller } = controllerFixture();
  assert.equal(typeof controller.openCleanMode, 'function');
  assert.equal(typeof controller.closeCleanMode, 'function');
  assert.equal(typeof controller.injectCleanEntry, 'function');
  assert.equal(typeof controller.ensureRoot, 'function');
  assert.equal(typeof controller.cleanModeApi.open, 'function');
  assert.equal(typeof controller.cleanModeApi.close, 'function');
  assert.equal(typeof controller.cleanModeApi.inject, 'function');
  assert.equal(typeof controller.cleanModeApi.refresh, 'function');
});

test('openCleanMode marks the root and loads data once', () => {
  const { state, calls, controller } = controllerFixture();
  controller.openCleanMode(false);
  assert.equal(state.open, true);
  assert.equal(calls.loadAll, 1);
  controller.closeCleanMode();
  assert.equal(state.open, false);
  assert.ok(calls.closeModal >= 1);
});
