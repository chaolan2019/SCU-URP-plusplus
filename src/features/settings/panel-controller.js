// Settings panel open/close lifecycle independent of panel content.

export function createSettingsPanelController(options) {
  const {
    document,
    ensurePanel,
    syncPanel,
    refreshUpdateStatus,
    defaultTab = 'theme',
  } = options;

  function open() {
    ensurePanel();
    const panel = document.getElementById('urppp-settings-panel');
    const mask = document.getElementById('urppp-settings-mask');
    if (!panel || !mask) return false;
    syncPanel();
    try { refreshUpdateStatus(); } catch (_) {}
    try { if (panel.__urpppSwitchTab) panel.__urpppSwitchTab(defaultTab); } catch (_) {}
    mask.classList.remove('open');
    panel.classList.remove('open');
    void panel.offsetWidth;
    mask.classList.add('open');
    panel.classList.add('open');
    try {
      const body = panel.querySelector('.urppp-set-body');
      if (body) body.scrollTop = 0;
    } catch (_) {}
    return true;
  }

  function close() {
    const panel = document.getElementById('urppp-settings-panel');
    const mask = document.getElementById('urppp-settings-mask');
    if (panel) panel.classList.remove('open');
    if (mask) mask.classList.remove('open');
  }

  return { close, open };
}
