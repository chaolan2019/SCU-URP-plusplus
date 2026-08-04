import test from 'node:test';
import assert from 'node:assert/strict';
import { createJsonSettingsController } from '../src/features/settings/json-settings.js';

function createElement() {
  const listeners = {};
  return {
    classList: {
      values: new Set(),
      toggle(name, enabled) {
        if (enabled) this.values.add(name);
        else this.values.delete(name);
      },
    },
    style: {},
    dataset: {},
    value: '',
    textContent: '',
    attributes: {},
    addEventListener(name, listener) { listeners[name] = listener; },
    emit(name) { listeners[name]?.(); },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

function createPanel() {
  const elements = {
    toggle: createElement(),
    editor: createElement(),
    textarea: createElement(),
    save: createElement(),
    reset: createElement(),
    status: createElement(),
  };
  return {
    ...elements,
    querySelector(selector) {
      return {
        '#urppp-set-json-custom': elements.toggle,
        '#urppp-set-json-editor': elements.editor,
        '#urppp-set-json-mapping': elements.textarea,
        '#urppp-set-json-save': elements.save,
        '#urppp-set-json-reset': elements.reset,
        '#urppp-set-json-status': elements.status,
      }[selector] || null;
    },
  };
}

test('JSON settings controller preserves drafts and validates save/reset actions', () => {
  const defaultMapping = { coursesPath: 'courses' };
  let settings = { enabled: false, mapping: { coursesPath: 'initial' } };
  let recovery = '';
  const writes = [];
  const panel = createPanel();
  const controller = createJsonSettingsController({
    document: { activeElement: null },
    getSettings: () => ({ enabled: settings.enabled, mapping: { ...settings.mapping } }),
    setSettings: (next) => {
      settings = { enabled: !!next.enabled, mapping: { ...next.mapping } };
      writes.push(settings);
    },
    validateMapping: (value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('映射必须是对象');
      return { ...value };
    },
    defaultMapping,
    getRecoveryMessage: () => recovery,
  });

  controller.sync(panel, true);
  assert.equal(panel.toggle.textContent, '自定义 JSON：关');
  assert.equal(panel.editor.style.display, 'none');
  assert.deepEqual(JSON.parse(panel.textarea.value), settings.mapping);

  controller.bind(panel);
  controller.bind(panel);
  panel.textarea.value = '{"draft":true}';
  panel.textarea.emit('input');
  panel.toggle.emit('click');
  assert.equal(settings.enabled, true);
  assert.equal(panel.textarea.value, '{"draft":true}');
  assert.match(panel.status.textContent, /未保存草稿已保留/);

  panel.textarea.value = '{bad';
  panel.save.emit('click');
  assert.equal(panel.status.classList.values.has('urppp-status-error'), true);
  assert.match(panel.status.textContent, /Expected|Unexpected|期望/);

  panel.textarea.value = '{"saved":"value"}';
  panel.save.emit('click');
  assert.deepEqual(settings.mapping, { saved: 'value' });
  assert.equal(panel.__urpppJsonMappingDirty, false);
  assert.equal(panel.status.textContent, '自定义 JSON 映射已保存');

  panel.reset.emit('click');
  assert.deepEqual(settings.mapping, defaultMapping);
  assert.equal(panel.status.textContent, '已恢复默认字段映射');
  assert.equal(writes.length, 3);

  recovery = 'JSON 映射配置损坏，已回退小爱课程兼容格式';
  controller.sync(panel, false);
  assert.equal(panel.status.textContent, recovery);
  assert.equal(panel.status.classList.values.has('urppp-status-error'), true);
});
