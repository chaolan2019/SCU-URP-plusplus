import test from 'node:test';
import assert from 'node:assert/strict';
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
