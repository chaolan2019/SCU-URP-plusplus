// JSON export settings UI with storage and validation injected by the entry adapter.

export function createJsonSettingsController(options) {
  const {
    document,
    getSettings,
    setSettings,
    validateMapping,
    defaultMapping,
    getRecoveryMessage = () => '',
  } = options;

  function setStatus(panel, message, error) {
    const status = panel && panel.querySelector('#urppp-set-json-status');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('urppp-status-error', !!error);
    status.style.color = error ? 'var(--danger,#b91c1c)' : 'var(--text-muted)';
  }

  function sync(panel, force) {
    if (!panel) return;
    const settings = getSettings();
    const toggle = panel.querySelector('#urppp-set-json-custom');
    const editor = panel.querySelector('#urppp-set-json-editor');
    const textarea = panel.querySelector('#urppp-set-json-mapping');
    if (toggle) {
      toggle.classList.toggle('ac', settings.enabled);
      toggle.setAttribute('aria-pressed', settings.enabled ? 'true' : 'false');
      toggle.textContent = '自定义 JSON：' + (settings.enabled ? '开' : '关');
    }
    if (editor) editor.style.display = settings.enabled ? 'grid' : 'none';
    if (textarea && (force || (!panel.__urpppJsonMappingDirty && document.activeElement !== textarea))) {
      textarea.value = JSON.stringify(settings.mapping, null, 2);
      panel.__urpppJsonMappingDirty = false;
    }
    const recoveryMessage = getRecoveryMessage();
    if (recoveryMessage) setStatus(panel, recoveryMessage, true);
  }

  function bind(panel) {
    if (!panel || panel.__urpppJsonSettingsBound) return;
    panel.__urpppJsonSettingsBound = true;
    const toggle = panel.querySelector('#urppp-set-json-custom');
    const textarea = panel.querySelector('#urppp-set-json-mapping');
    const save = panel.querySelector('#urppp-set-json-save');
    const reset = panel.querySelector('#urppp-set-json-reset');
    if (textarea) textarea.addEventListener('input', () => { panel.__urpppJsonMappingDirty = true; });
    if (toggle) toggle.addEventListener('click', () => {
      const settings = getSettings();
      settings.enabled = !settings.enabled;
      const hadDraft = !!panel.__urpppJsonMappingDirty;
      setSettings(settings);
      sync(panel, false);
      const message = settings.enabled ? '已启用自定义 JSON 格式' : '已恢复小爱课程兼容格式';
      setStatus(panel, hadDraft ? message + '；未保存草稿已保留' : message);
    });
    if (save) save.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(String(textarea && textarea.value || '').trim());
        const settings = getSettings();
        settings.mapping = validateMapping(parsed);
        setSettings(settings);
        panel.__urpppJsonMappingDirty = false;
        sync(panel, true);
        setStatus(panel, '自定义 JSON 映射已保存');
      } catch (error) {
        setStatus(panel, error && error.message || String(error), true);
      }
    });
    if (reset) reset.addEventListener('click', () => {
      const settings = getSettings();
      settings.mapping = validateMapping(defaultMapping);
      setSettings(settings);
      panel.__urpppJsonMappingDirty = false;
      sync(panel, true);
      setStatus(panel, '已恢复默认字段映射');
    });
  }

  return { bind, setStatus, sync };
}
