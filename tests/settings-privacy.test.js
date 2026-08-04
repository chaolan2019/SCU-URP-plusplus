import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPrivacySettingsController,
  readAvatarFile,
} from '../src/features/settings/privacy-settings.js';
import {
  CUSTOM_AVATAR_MAX_LENGTH,
  DIRECT_EDIT_KEYS,
  PRIVACY_FIELD_DEFAULTS,
  PRIVACY_MASK_TEXT,
  normalizeCustomIdentity,
  normalizePrivacySettings,
  validCustomAvatar,
} from '../src/features/settings/privacy-model.js';

test('privacy model applies defaults and normalizes bounded values', () => {
  const settings = normalizePrivacySettings({
    mode: 'invalid',
    fields: {
      name: { enabled: true, replacement: '私密姓名' },
      identity: { enabled: false, replacement: 'x'.repeat(100) },
    },
    directEdit: {
      enabled: true,
      values: { majorGpa: '  4.00  ', unknown: 'ignored' },
    },
  });

  assert.equal(settings.mode, 'off');
  assert.equal(settings.mask, PRIVACY_MASK_TEXT);
  assert.equal(settings.fields.name.enabled, false);
  assert.equal(settings.fields.identity.enabled, false);
  assert.equal(settings.fields.identity.replacement.length, 80);
  assert.equal(settings.fields.organization.replacement, PRIVACY_FIELD_DEFAULTS.organization.replacement);
  assert.equal(settings.directEdit.enabled, true);
  assert.equal(settings.directEdit.values.majorGpa, '4.00');
  assert.deepEqual(Object.keys(settings.directEdit.values), DIRECT_EDIT_KEYS);
});

test('privacy model migrates legacy score and homepage settings', () => {
  const settings = normalizePrivacySettings({
    mode: 'custom',
    fields: {
      score: { enabled: false, replacement: '旧成绩' },
      grade: { enabled: true, replacement: '旧其他' },
    },
    homepage: {
      enabled: true,
      values: { completedCourses: '12' },
    },
  });

  assert.equal(settings.fields.grade.replacement, '旧其他');
  assert.equal(settings.fields.gpa.replacement, '旧成绩');
  assert.equal(settings.fields.credit.replacement, '旧成绩');
  assert.equal(settings.fields.other.replacement, '旧其他');
  assert.equal(settings.directEdit.enabled, true);
  assert.equal(settings.directEdit.values.completedCourses, '12');
});

test('custom identity model enforces text and avatar safety boundaries', () => {
  const identity = normalizeCustomIdentity({
    nameEnabled: 1,
    name: '  ' + '潮'.repeat(50) + '  ',
    avatarEnabled: 'yes',
    avatar: ' https://example.test/avatar.png ',
    avatarName: ' image.png ',
  });

  assert.equal(identity.nameEnabled, true);
  assert.equal(identity.name.length, 40);
  assert.equal(identity.avatarEnabled, true);
  assert.equal(identity.avatar, 'https://example.test/avatar.png');
  assert.equal(identity.avatarName, 'image.png');
  assert.equal(validCustomAvatar(identity.avatar), identity.avatar);
  assert.equal(validCustomAvatar('data:image/webp;base64,AAAA'), 'data:image/webp;base64,AAAA');
  assert.equal(validCustomAvatar('javascript:alert(1)'), '');
  assert.equal(validCustomAvatar('data:image/svg+xml;base64,AAAA'), '');

  const oversized = 'x'.repeat(CUSTOM_AVATAR_MAX_LENGTH + 1);
  assert.equal(normalizeCustomIdentity({ avatar: oversized }).avatar, '');
  assert.equal(validCustomAvatar(oversized), '');
});

function createControl(attributes = {}) {
  const listeners = {};
  return {
    attributes: { ...attributes },
    checked: false,
    classList: {
      values: new Set(),
      toggle(name, enabled) {
        if (enabled) this.values.add(name);
        else this.values.delete(name);
      },
    },
    dataset: {},
    disabled: false,
    files: [],
    style: {},
    textContent: '',
    value: '',
    addEventListener(name, listener) { listeners[name] = listener; },
    emit(name) { return listeners[name]?.(); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    removeAttribute(name) { delete this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

function createPrivacyPanel() {
  const modeOff = createControl({ 'data-privacy-mode': 'off' });
  const modeCustom = createControl({ 'data-privacy-mode': 'custom' });
  const identityToggle = createControl({ 'data-privacy-field': 'identity' });
  const identityInput = createControl({ 'data-privacy-value': 'identity' });
  const controls = {
    modeOff,
    modeCustom,
    identityToggle,
    identityInput,
    customBox: createControl(),
    directControl: createControl(),
    directToggle: createControl(),
    nameEnabled: createControl(),
    nameInput: createControl(),
    avatarEnabled: createControl(),
    avatarUrl: createControl(),
    avatarFile: createControl(),
    avatarPreview: createControl(),
    clearAvatar: createControl(),
    save: createControl(),
    status: createControl(),
  };
  return {
    ...controls,
    querySelectorAll(selector) {
      if (selector === '[data-privacy-mode]') return [modeOff, modeCustom];
      if (selector === '[data-privacy-field]') return [identityToggle];
      return [];
    },
    querySelector(selector) {
      return {
        '#urppp-set-privacy-custom': controls.customBox,
        '.urppp-direct-edit-control': controls.directControl,
        '#urppp-set-direct-edit-toggle': controls.directToggle,
        '#urppp-set-name-enabled': controls.nameEnabled,
        '#urppp-set-custom-name': controls.nameInput,
        '#urppp-set-avatar-enabled': controls.avatarEnabled,
        '#urppp-set-custom-avatar-url': controls.avatarUrl,
        '#urppp-set-custom-avatar-file': controls.avatarFile,
        '#urppp-set-avatar-preview': controls.avatarPreview,
        '#urppp-set-avatar-clear': controls.clearAvatar,
        '#urppp-set-privacy-save': controls.save,
        '#urppp-set-privacy-status': controls.status,
        '[data-privacy-field="identity"]': controls.identityToggle,
        '[data-privacy-value="identity"]': controls.identityInput,
      }[selector] || null;
    },
  };
}

test('privacy settings controller syncs and saves panel state transactionally', () => {
  let privacy = normalizePrivacySettings({
    mode: 'custom',
    fields: { identity: { enabled: true, replacement: '隐藏' } },
    directEdit: { enabled: true, values: {} },
  });
  let identity = normalizeCustomIdentity({
    nameEnabled: true,
    name: '旧姓名',
    avatarEnabled: true,
    avatar: 'https://example.test/old.png',
    avatarName: 'old.png',
  });
  const calls = [];
  const panel = createPrivacyPanel();
  const controller = createPrivacySettingsController({
    getPrivacySettings: () => structuredClone(privacy),
    setPrivacySettings: (next) => { privacy = structuredClone(next); calls.push('set-privacy'); },
    getCustomIdentity: () => ({ ...identity }),
    setCustomIdentity: (next) => { identity = { ...next }; calls.push('set-identity'); },
    applyDisplay: () => calls.push('apply'),
    refreshCleanDisplay: () => calls.push('refresh'),
    finishActiveDirectEdit: (cancel) => calls.push(['finish', cancel]),
    readAvatar: async () => 'data:image/png;base64,LOCAL',
  });

  controller.sync(panel);
  assert.equal(panel.modeCustom.classList.values.has('ac'), true);
  assert.equal(panel.customBox.style.display, 'grid');
  assert.equal(panel.identityToggle.checked, true);
  assert.equal(panel.identityInput.value, '隐藏');
  assert.equal(panel.directToggle.dataset.enabled, '1');
  assert.equal(panel.nameInput.value, '旧姓名');
  assert.equal(panel.avatarPreview.src, identity.avatar);

  controller.bind(panel);
  panel.identityToggle.checked = false;
  panel.identityInput.value = '  新遮罩  ';
  panel.directToggle.dataset.enabled = '0';
  panel.nameEnabled.checked = true;
  panel.nameInput.value = '新姓名';
  panel.avatarEnabled.checked = true;
  panel.avatarUrl.value = 'https://example.test/new.png';
  panel.save.emit('click');

  assert.equal(privacy.fields.identity.enabled, false);
  assert.equal(privacy.fields.identity.replacement, '新遮罩');
  assert.equal(privacy.directEdit.enabled, false);
  assert.equal(identity.name, '新姓名');
  assert.equal(identity.avatar, 'https://example.test/new.png');
  assert.deepEqual(calls, [
    ['finish', true],
    'set-identity',
    'set-privacy',
    'apply',
    'refresh',
  ]);
  assert.equal(panel.status.textContent, '隐私与显示设置已保存');
});

test('privacy settings controller rolls back identity when privacy persistence fails', () => {
  let privacy = normalizePrivacySettings({ mode: 'custom' });
  let identity = normalizeCustomIdentity({ nameEnabled: true, name: '旧姓名' });
  let failPrivacyWrite = true;
  let applied = 0;
  const panel = createPrivacyPanel();
  const controller = createPrivacySettingsController({
    getPrivacySettings: () => structuredClone(privacy),
    setPrivacySettings: (next) => {
      if (failPrivacyWrite) {
        failPrivacyWrite = false;
        throw new Error('存储失败');
      }
      privacy = structuredClone(next);
    },
    getCustomIdentity: () => ({ ...identity }),
    setCustomIdentity: (next) => { identity = { ...next }; },
    applyDisplay: () => { applied += 1; },
    refreshCleanDisplay: () => { applied += 1; },
    finishActiveDirectEdit: () => {},
  });

  controller.sync(panel);
  controller.bind(panel);
  panel.nameEnabled.checked = true;
  panel.nameInput.value = '新姓名';
  panel.save.emit('click');

  assert.equal(identity.name, '旧姓名');
  assert.equal(privacy.mode, 'custom');
  assert.equal(applied, 0);
  assert.equal(panel.status.textContent, '存储失败');
  assert.equal(panel.status.style.color, '#b91c1c');
});

test('avatar file reader validates type and size before reading', async () => {
  class FakeReader {
    readAsDataURL() {
      this.result = 'data:image/png;base64,TEST';
      this.onload();
    }
  }
  await assert.rejects(() => readAvatarFile(null, FakeReader), /请选择/);
  await assert.rejects(() => readAvatarFile({ type: 'image/svg+xml', size: 10 }, FakeReader), /请选择/);
  await assert.rejects(() => readAvatarFile({ type: 'image/png', size: 2 * 1024 * 1024 + 1 }, FakeReader), /2MB/);
  await assert.doesNotReject(async () => {
    const result = await readAvatarFile({ type: 'image/png', size: 10 }, FakeReader);
    assert.equal(result, 'data:image/png;base64,TEST');
  });
});
