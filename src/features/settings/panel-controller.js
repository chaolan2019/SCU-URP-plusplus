// Settings panel shell lifecycle independent of settings content.

export function bindSettingsTabs(panel) {
  const switchTab = (tab) => {
    panel.querySelectorAll('.urppp-set-tab').forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle('ac', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panel.querySelectorAll('.urppp-set-pane').forEach((pane) => {
      pane.classList.toggle('ac', pane.dataset.pane === tab);
    });
    try {
      const body = panel.querySelector('.urppp-set-body');
      if (body) body.scrollTop = 0;
    } catch (_) {}
  };
  panel.querySelectorAll('.urppp-set-tab').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  panel.__urpppSwitchTab = switchTab;
  return switchTab;
}

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
    // 面板收起时同步隐藏/清理由面板内操作触发的浮窗（toast/确认条/下载进度），避免残留
    try {
      const dl = document.getElementById('urppp-dl-progress');
      if (dl) dl.style.display = 'none';
    } catch (_) {}
    try {
      const toast = document.getElementById('urppp-toast');
      if (toast) toast.style.display = 'none';
    } catch (_) {}
    try {
      const confirm = document.getElementById('urppp-confirm');
      if (confirm) confirm.style.display = 'none';
    } catch (_) {}
  }

  return { close, open };
}
