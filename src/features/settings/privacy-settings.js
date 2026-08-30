// Privacy settings panel UI with persistence and page refresh effects injected.

import { normalizeCustomIdentity, validCustomAvatar } from './privacy-model.js';

export function readAvatarFile(file, FileReaderClass = globalThis.FileReader) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(png|jpeg|webp|gif)$/i.test(file.type || '')) {
      reject(new Error('请选择 PNG、JPG、WebP 或 GIF 图片'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('本地头像不能超过 2MB'));
      return;
    }
    const reader = new FileReaderClass();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('读取头像失败'));
    reader.readAsDataURL(file);
  });
}

export function createPrivacySettingsController(options) {
  const {
    getPrivacySettings,
    setPrivacySettings,
    getCustomIdentity,
    setCustomIdentity,
    applyDisplay,
    refreshCleanDisplay,
    finishActiveDirectEdit,
    readAvatar = readAvatarFile,
  } = options;

  function syncDirectEdit(panel, privacy) {
    const customMode = privacy.mode === 'custom';
    const control = panel.querySelector('.urppp-direct-edit-control');
    const button = panel.querySelector('#urppp-set-direct-edit-toggle');
    if (control) control.style.display = customMode ? 'flex' : 'none';
    if (!button) return;
    button.dataset.enabled = privacy.directEdit.enabled ? '1' : '0';
    button.classList.toggle('ac', privacy.directEdit.enabled);
    button.setAttribute('aria-pressed', privacy.directEdit.enabled ? 'true' : 'false');
    button.textContent = '页面内修改：' + (privacy.directEdit.enabled ? '开' : '关');
  }

  function sync(panel) {
    if (!panel) return;
    const privacy = getPrivacySettings();
    panel.querySelectorAll('[data-privacy-mode]').forEach((button) => {
      const active = button.getAttribute('data-privacy-mode') === privacy.mode;
      button.classList.toggle('ac', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const customBox = panel.querySelector('#urppp-set-privacy-custom');
    if (customBox) customBox.style.display = privacy.mode === 'custom' ? 'grid' : 'none';
    Object.keys(privacy.fields).forEach((field) => {
      const item = privacy.fields[field];
      const toggle = panel.querySelector('[data-privacy-field="' + field + '"]');
      const input = panel.querySelector('[data-privacy-value="' + field + '"]');
      if (toggle) toggle.checked = !!item.enabled;
      if (input) {
        input.value = item.replacement || '';
        input.disabled = !item.enabled;
      }
    });
    syncDirectEdit(panel, privacy);
    const identity = getCustomIdentity();
    const nameEnabled = panel.querySelector('#urppp-set-name-enabled');
    const nameInput = panel.querySelector('#urppp-set-custom-name');
    const avatarEnabled = panel.querySelector('#urppp-set-avatar-enabled');
    const avatarUrl = panel.querySelector('#urppp-set-custom-avatar-url');
    const preview = panel.querySelector('#urppp-set-avatar-preview');
    if (nameEnabled) nameEnabled.checked = identity.nameEnabled;
    if (nameInput) {
      nameInput.value = identity.name;
      nameInput.disabled = !identity.nameEnabled;
    }
    if (avatarEnabled) avatarEnabled.checked = identity.avatarEnabled;
    if (avatarUrl) {
      avatarUrl.value = /^data:image\//i.test(identity.avatar) ? '' : identity.avatar;
      avatarUrl.disabled = !identity.avatarEnabled;
    }
    panel.__urpppAvatarSource = identity.avatar;
    if (preview) {
      const source = validCustomAvatar(identity.avatar);
      preview.style.display = source ? 'block' : 'none';
      if (source) preview.src = source;
      else preview.removeAttribute('src');
    }
  }

  function collect(panel) {
    const next = getPrivacySettings();
    Object.keys(next.fields).forEach((field) => {
      const toggle = panel.querySelector('[data-privacy-field="' + field + '"]');
      const input = panel.querySelector('[data-privacy-value="' + field + '"]');
      if (toggle) next.fields[field].enabled = !!toggle.checked;
      if (input) next.fields[field].replacement = String(input.value || '').trim().slice(0, 80);
    });
    const directEditToggle = panel.querySelector('#urppp-set-direct-edit-toggle');
    next.directEdit.enabled = !!(directEditToggle && directEditToggle.dataset.enabled === '1');
    return next;
  }

  function setStatus(panel, message, error) {
    const status = panel && panel.querySelector('#urppp-set-privacy-status');
    if (!status) return;
    status.textContent = message || '';
    status.style.color = error ? '#b91c1c' : 'var(--text-muted)';
  }

  function bind(panel) {
    if (!panel || panel.__urpppPrivacyBound) return;
    panel.__urpppPrivacyBound = true;
    panel.querySelectorAll('[data-privacy-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = getPrivacySettings();
        next.mode = button.getAttribute('data-privacy-mode') || 'off';
        setPrivacySettings(next);
        sync(panel);
        applyDisplay();
      });
    });
    panel.querySelectorAll('[data-privacy-field]').forEach((toggle) => {
      toggle.addEventListener('change', () => {
        const field = toggle.getAttribute('data-privacy-field');
        const input = panel.querySelector('[data-privacy-value="' + field + '"]');
        if (input) input.disabled = !toggle.checked;
      });
    });
    const directEditToggle = panel.querySelector('#urppp-set-direct-edit-toggle');
    if (directEditToggle) directEditToggle.addEventListener('click', () => {
      const enabled = directEditToggle.dataset.enabled !== '1';
      directEditToggle.dataset.enabled = enabled ? '1' : '0';
      directEditToggle.classList.toggle('ac', enabled);
      directEditToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      directEditToggle.textContent = '页面内修改：' + (enabled ? '开' : '关');
    });
    const nameEnabled = panel.querySelector('#urppp-set-name-enabled');
    const avatarEnabled = panel.querySelector('#urppp-set-avatar-enabled');
    if (nameEnabled) nameEnabled.addEventListener('change', () => {
      const input = panel.querySelector('#urppp-set-custom-name');
      if (input) input.disabled = !nameEnabled.checked;
    });
    if (avatarEnabled) avatarEnabled.addEventListener('change', () => {
      const input = panel.querySelector('#urppp-set-custom-avatar-url');
      if (input) input.disabled = !avatarEnabled.checked;
    });
    const fileBtn = panel.querySelector('#urppp-set-avatar-file-btn');
    const fileInput = panel.querySelector('#urppp-set-custom-avatar-file');
    if (fileBtn && fileInput) fileBtn.addEventListener('click', () => { try { fileInput.click(); } catch (_) {} });
    if (fileInput) fileInput.addEventListener('change', async () => {
      try {
        const source = await readAvatar(fileInput.files && fileInput.files[0]);
        panel.__urpppAvatarSource = source;
        const preview = panel.querySelector('#urppp-set-avatar-preview');
        if (preview) {
          preview.src = source;
          preview.style.display = 'block';
        }
        if (avatarEnabled) avatarEnabled.checked = true;
        setStatus(panel, '本地头像已读取，点击保存后生效');
      } catch (error) {
        setStatus(panel, error && error.message || String(error), true);
      }
    });
    const clearAvatar = panel.querySelector('#urppp-set-avatar-clear');
    if (clearAvatar) clearAvatar.addEventListener('click', () => {
      try {
        const identity = getCustomIdentity();
        identity.avatarEnabled = false;
        identity.avatar = '';
        identity.avatarName = '';
        setCustomIdentity(identity);
        panel.__urpppAvatarSource = '';
        sync(panel);
        applyDisplay();
        refreshCleanDisplay();
        setStatus(panel, '已清除自定义头像');
      } catch (error) {
        setStatus(panel, error && error.message || '清除自定义头像失败', true);
      }
    });
    const save = panel.querySelector('#urppp-set-privacy-save');
    if (save) save.addEventListener('click', () => {
      const previousPrivacy = getPrivacySettings();
      const previousIdentity = getCustomIdentity();
      try {
        const draftPrivacy = collect(panel);
        const urlInput = panel.querySelector('#urppp-set-custom-avatar-url');
        const typedUrl = String(urlInput && urlInput.value || '').trim();
        const source = typedUrl || panel.__urpppAvatarSource || '';
        const draftIdentity = normalizeCustomIdentity({
          nameEnabled: !!(nameEnabled && nameEnabled.checked),
          name: String(panel.querySelector('#urppp-set-custom-name')?.value || '').trim(),
          avatarEnabled: !!(avatarEnabled && avatarEnabled.checked),
          avatar: source,
          avatarName: previousIdentity.avatarName,
        });
        if (draftIdentity.avatarEnabled && !validCustomAvatar(draftIdentity.avatar)) {
          throw new Error('头像地址必须是 http(s) 图片或已选择的本地图片');
        }
        if (previousPrivacy.directEdit.enabled && !draftPrivacy.directEdit.enabled) finishActiveDirectEdit(true);
        try {
          setCustomIdentity(draftIdentity);
          setPrivacySettings(draftPrivacy);
        } catch (writeError) {
          try {
            setCustomIdentity(previousIdentity);
            setPrivacySettings(previousPrivacy);
          } catch (_) {}
          throw writeError;
        }
        applyDisplay();
        refreshCleanDisplay();
        sync(panel);
        setStatus(panel, '隐私与显示设置已保存');
      } catch (error) {
        setStatus(panel, error && error.message || String(error), true);
      }
    });
  }

  return { bind, collect, setStatus, sync };
}
