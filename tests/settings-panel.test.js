import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  bindSettingsTabs,
  createSettingsPanelController,
} from '../src/features/settings/panel-controller.js';

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);
const controllerUrl = new URL('../src/features/settings/panel-controller.js', import.meta.url);

function classListFor(name, calls) {
  return {
    add: (value) => calls.push([name, 'add', value]),
    remove: (value) => calls.push([name, 'remove', value]),
  };
}

test('settings tabs synchronize active state, ARIA, panes, and scroll position', () => {
  const makeNode = (dataset) => ({
    dataset,
    active: false,
    selected: null,
    classList: {
      toggle(name, value) {
        if (name === 'ac') this.owner.active = value;
      },
      owner: null,
    },
    setAttribute(name, value) {
      if (name === 'aria-selected') this.selected = value;
    },
    addEventListener(name, listener) {
      if (name === 'click') this.click = listener;
    },
  });
  const themeTab = makeNode({ tab: 'theme' });
  const systemTab = makeNode({ tab: 'system' });
  const themePane = makeNode({ pane: 'theme' });
  const systemPane = makeNode({ pane: 'system' });
  [themeTab, systemTab, themePane, systemPane].forEach((node) => { node.classList.owner = node; });
  const body = { scrollTop: 42 };
  const panel = {
    querySelectorAll(selector) {
      return selector === '.urppp-set-tab' ? [themeTab, systemTab] : [themePane, systemPane];
    },
    querySelector: (selector) => selector === '.urppp-set-body' ? body : null,
  };

  const switchTab = bindSettingsTabs(panel);
  switchTab('system');
  assert.deepEqual([themeTab.active, themeTab.selected, systemTab.active, systemTab.selected], [false, 'false', true, 'true']);
  assert.deepEqual([themePane.active, systemPane.active], [false, true]);
  assert.equal(body.scrollTop, 0);
  assert.equal(panel.__urpppSwitchTab, switchTab);

  themeTab.click();
  assert.deepEqual([themeTab.active, systemTab.active, themePane.active, systemPane.active], [true, false, true, false]);
});

test('settings panel controller preserves open transition and scroll reset order', () => {
  const calls = [];
  const body = {
    set scrollTop(value) { calls.push(['body', 'scrollTop', value]); },
  };
  const panel = {
    classList: classListFor('panel', calls),
    __urpppSwitchTab: (tab) => calls.push(['tab', tab]),
    querySelector: (selector) => selector === '.urppp-set-body' ? body : null,
    get offsetWidth() {
      calls.push(['panel', 'layout']);
      return 420;
    },
  };
  const mask = { classList: classListFor('mask', calls) };
  const elements = {
    'urppp-settings-panel': panel,
    'urppp-settings-mask': mask,
  };
  const controller = createSettingsPanelController({
    document: { getElementById: (id) => elements[id] || null },
    ensurePanel: () => calls.push(['ensure']),
    syncPanel: () => calls.push(['sync']),
    refreshUpdateStatus: () => calls.push(['update']),
  });

  assert.equal(controller.open(), true);
  assert.deepEqual(calls, [
    ['ensure'],
    ['sync'],
    ['update'],
    ['tab', 'theme'],
    ['mask', 'remove', 'open'],
    ['panel', 'remove', 'open'],
    ['panel', 'layout'],
    ['mask', 'add', 'open'],
    ['panel', 'add', 'open'],
    ['body', 'scrollTop', 0],
  ]);

  calls.length = 0;
  controller.close();
  assert.deepEqual(calls, [
    ['panel', 'remove', 'open'],
    ['mask', 'remove', 'open'],
  ]);
});

test('settings panel controller exits cleanly when panel creation yields no shell', () => {
  let ensured = 0;
  const controller = createSettingsPanelController({
    document: { getElementById: () => null },
    ensurePanel: () => { ensured += 1; },
    syncPanel: () => assert.fail('sync should not run without a panel'),
    refreshUpdateStatus: () => assert.fail('status should not run without a panel'),
  });

  assert.equal(controller.open(), false);
  assert.equal(ensured, 1);
  assert.doesNotThrow(() => controller.close());
});

test('settings entry delegates panel transitions to the controller module', async () => {
  const [entrySource, controllerSource] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(controllerUrl, 'utf8'),
  ]);
  assert.match(entrySource, /const settingsPanelController = createSettingsPanelController\(\{/);
  assert.match(entrySource, /return settingsPanelController\.open\(\)/);
  assert.match(entrySource, /bindSettingsTabs\(panel\)/);
  assert.doesNotMatch(entrySource, /const switchTab = \(tab\) =>/);
  assert.doesNotMatch(entrySource, /void panel\.offsetWidth/);
  assert.match(controllerSource, /void panel\.offsetWidth/);
});
