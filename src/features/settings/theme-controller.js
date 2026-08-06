// Theme settings commands with theme algorithms and persistence injected by the entry adapter.

export function createThemeSettingsController(options) {
  const {
    document,
    theme,
    preferences,
    accent,
    syncPanel,
  } = options;

  function applyAccentTheme() {
    if (theme.getFollowSystem()) theme.apply(theme.resolveFollowTheme(), { system: true });
    else theme.apply('scu-red', { manual: true });
  }

  function renderSchemeChoices(panel, seed) {
    const schemes = panel.querySelector('#urppp-set-schemes');
    if (!schemes) return;
    const currentScheme = accent.getScheme();
    schemes.innerHTML = '';
    accent.listSchemePreviews(seed).forEach((item) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'urppp-set-scheme' + (item.id === currentScheme ? ' ac' : '');
      card.innerHTML = [
        '<div class="urppp-set-scheme-preview">',
        '  <span style="background:' + item.bg + '"></span>',
        '  <span style="background:' + item.surface + ';border-color:' + item.border + '"></span>',
        '  <span style="background:' + item.primary + '"></span>',
        '</div>',
        '<div class="urppp-set-scheme-meta">',
        '  <strong>' + item.name + '</strong>',
        '  <em>' + item.desc + '</em>',
        '</div>',
      ].join('');
      card.addEventListener('click', () => {
        accent.setAccent(seed);
        accent.setScheme(item.id);
        applyAccentTheme();
        syncPanel();
      });
      schemes.appendChild(card);
    });
  }

  function bind(panel) {
    panel.querySelectorAll('.urppp-set-mode').forEach((button) => {
      button.addEventListener('click', () => {
        if (!theme.isModeAvailable(button.dataset.theme)) return;
        theme.apply(button.dataset.theme, { manual: true });
        syncPanel();
      });
    });

    const followButton = panel.querySelector('#urppp-set-follow');
    if (followButton) followButton.addEventListener('click', () => {
      if (!theme.supportsDark()) return;
      const next = !theme.getFollowSystem();
      theme.setFollowSystem(next);
      if (next) theme.apply(theme.resolveFollowTheme(), { system: true });
      else theme.apply(theme.getCurrent(), { manual: true });
      syncPanel();
      theme.syncNavbar();
    });

    const dynamicFollowButton = panel.querySelector('#urppp-set-follow-dynamic');
    if (dynamicFollowButton) dynamicFollowButton.addEventListener('click', () => {
      if (!theme.supportsDynamic()) return;
      if (!theme.getFollowSystem()) {
        theme.setFollowSystem(true);
        theme.setFollowDynamic(true);
      } else {
        theme.setFollowDynamic(!theme.getFollowDynamic());
      }
      theme.apply(theme.resolveFollowTheme(), { system: true });
      syncPanel();
      theme.syncNavbar();
    });

    const cleanDefaultButton = panel.querySelector('#urppp-set-clean-default');
    if (cleanDefaultButton) cleanDefaultButton.addEventListener('click', () => {
      preferences.setCleanDefault(!preferences.getCleanDefault());
      syncPanel();
    });

    const cleanAnalysisButton = panel.querySelector('#urppp-set-clean-analysis');
    if (cleanAnalysisButton) cleanAnalysisButton.addEventListener('click', () => {
      const direct = preferences.getCleanAnalysis() === 'direct';
      preferences.setCleanAnalysis(direct ? 'tab' : 'direct');
      syncPanel();
    });

    const appleEdgeButton = panel.querySelector('#urppp-set-apple-edge');
    if (appleEdgeButton) appleEdgeButton.addEventListener('click', () => {
      preferences.setAppleEdge(!preferences.getAppleEdge());
      try { preferences.applySkin(); } catch (_) {}
      syncPanel();
    });

    const autoUpdateButton = panel.querySelector('#urppp-set-auto-update');
    if (autoUpdateButton) autoUpdateButton.addEventListener('click', () => {
      preferences.setAutoUpdate(!preferences.getAutoUpdate());
      syncPanel();
    });

    const checkUpdateButton = panel.querySelector('#urppp-set-check-update');
    if (checkUpdateButton && !checkUpdateButton.__urpppBound) {
      checkUpdateButton.__urpppBound = true;
      checkUpdateButton.addEventListener('click', () => { preferences.checkUpdates(); });
    }

    const colorInput = panel.querySelector('#urppp-set-color');
    const hexInput = panel.querySelector('#urppp-set-hex');
    if (!colorInput || !hexInput) return;
    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value.toUpperCase();
    });
    hexInput.addEventListener('change', () => {
      const color = accent.normalize(hexInput.value);
      if (color) {
        hexInput.value = color;
        colorInput.value = color;
      }
    });

    const generateButton = panel.querySelector('#urppp-set-gen');
    if (generateButton) generateButton.addEventListener('click', () => {
      const color = accent.normalize(hexInput.value) || colorInput.value;
      if (!color) return;
      accent.setAccent(accent.normalize(color));
      applyAccentTheme();
      syncPanel();
    });

    const saveButton = panel.querySelector('#urppp-set-save');
    if (saveButton) saveButton.addEventListener('click', () => {
      const color = accent.normalize(hexInput.value) || colorInput.value;
      if (!color) return;
      accent.savePreset(color);
      accent.setAccent(accent.normalize(color));
      applyAccentTheme();
      syncPanel();
    });

    colorInput.addEventListener('change', () => {
      const color = accent.normalize(colorInput.value);
      if (!color) return;
      hexInput.value = color;
      renderSchemeChoices(panel, color);
    });
  }

  return { bind, renderSchemeChoices };
}
