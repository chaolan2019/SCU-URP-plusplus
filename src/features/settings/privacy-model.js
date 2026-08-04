// Privacy and custom identity data contracts shared by settings and display adapters.

export const PRIVACY_MASK_TEXT = '••••';
export const CUSTOM_AVATAR_MAX_LENGTH = 3 * 1024 * 1024;
export const PRIVACY_FIELD_DEFAULTS = {
  name: { enabled: false, replacement: '同学' },
  identity: { enabled: true, replacement: '已隐藏' },
  organization: { enabled: true, replacement: '已隐藏' },
  contact: { enabled: true, replacement: '已隐藏' },
  grade: { enabled: true, replacement: '已隐藏' },
  gpa: { enabled: true, replacement: '••••' },
  credit: { enabled: true, replacement: '••••' },
  other: { enabled: true, replacement: '已隐藏' },
  avatar: { enabled: true, replacement: '' },
  schedule: { enabled: false, replacement: '课表已隐藏' },
};
export const DIRECT_EDIT_KEYS = [
  'completedCourses', 'failedCourses', 'majorGpa', 'majorPlan', 'remainingCourses',
  'passingTotalCredit', 'passingAvgScore', 'passingAvgGpa',
  'passingRequiredCredit', 'passingRequiredAvg', 'passingRequiredGpa',
  'schemeTotalCredit', 'schemeAvgScore', 'schemeAvgGpa',
  'schemeRequiredCredit', 'schemeRequiredAvg', 'schemeRequiredGpa',
];

export function normalizePrivacySettings(value) {
  const raw = value && typeof value === 'object' ? value : {};
  const mode = ['off', 'one', 'custom'].includes(raw.mode) ? raw.mode : 'off';
  const fields = {};
  const rawFields = raw.fields && typeof raw.fields === 'object' ? raw.fields : {};
  const legacyScore = rawFields.score && typeof rawFields.score === 'object' ? rawFields.score : null;
  Object.keys(PRIVACY_FIELD_DEFAULTS).forEach((key) => {
    const base = PRIVACY_FIELD_DEFAULTS[key];
    const migratedScore = ['grade', 'gpa', 'credit'].includes(key) ? legacyScore : null;
    const migratedOther = key === 'other' && rawFields.grade && typeof rawFields.grade === 'object' ? rawFields.grade : null;
    const item = rawFields[key] && typeof rawFields[key] === 'object' ? rawFields[key] : (migratedScore || migratedOther || {});
    fields[key] = {
      enabled: key === 'name' ? false : (item.enabled == null ? base.enabled : !!item.enabled),
      replacement: String(item.replacement == null ? base.replacement : item.replacement).slice(0, 80),
    };
  });
  const legacyHomepage = raw.homepage && typeof raw.homepage === 'object' ? raw.homepage : {};
  const rawDirectEdit = raw.directEdit && typeof raw.directEdit === 'object' ? raw.directEdit : legacyHomepage;
  const rawDirectValues = rawDirectEdit.values && typeof rawDirectEdit.values === 'object' ? rawDirectEdit.values : {};
  const directValues = {};
  DIRECT_EDIT_KEYS.forEach((key) => {
    directValues[key] = String(rawDirectValues[key] == null ? '' : rawDirectValues[key]).trim().slice(0, 80);
  });
  return {
    mode,
    mask: PRIVACY_MASK_TEXT,
    fields,
    directEdit: { enabled: !!rawDirectEdit.enabled, values: directValues },
  };
}

export function normalizeCustomIdentity(value) {
  const raw = value && typeof value === 'object' ? value : {};
  const avatar = String(raw.avatar || '').trim();
  return {
    nameEnabled: !!raw.nameEnabled,
    name: String(raw.name || '').trim().slice(0, 40),
    avatarEnabled: !!raw.avatarEnabled,
    avatar: avatar.length <= CUSTOM_AVATAR_MAX_LENGTH ? avatar : '',
    avatarName: String(raw.avatarName || '').trim().slice(0, 120),
  };
}

export function validCustomAvatar(value) {
  const source = String(value || '').trim();
  if (source.length > CUSTOM_AVATAR_MAX_LENGTH) return '';
  return /^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(source) ? source : '';
}
