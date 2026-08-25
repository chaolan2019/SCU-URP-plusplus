// Projects a resolved theme/settings snapshot onto settings panel controls.

export function syncThemeSettingsControls(panel, state) {
  const {
    seed,
    currentTheme,
    followSystem,
    skinId,
    darkSupported,
    dynamicSupported,
    fixedPalettes,
    followUseDynamic,
    cleanDefault,
    cleanAnalysis,
    appleEdge,
    autoUpdate,
    modeAvailability,
  } = state;
  const colorInput = panel.querySelector('#urppp-set-color');
  const hexInput = panel.querySelector('#urppp-set-hex');
  if (colorInput) colorInput.value = seed;
  if (hexInput) hexInput.value = seed;

  panel.querySelectorAll('.urppp-set-mode').forEach((button) => {
    const theme = button.dataset.theme;
    const available = modeAvailability[theme] !== false;
    const active = !followSystem && theme === currentTheme && available;
    button.disabled = !available;
    button.classList.toggle('ac', active);
    button.classList.toggle('urppp-dyn-disabled', !available);
    button.setAttribute('aria-disabled', available ? 'false' : 'true');
    if (!available) {
      button.title = theme === 'dark'
        ? '当前界面风格不支持暗色模式'
        : '当前界面风格不支持动态配色';
    } else {
      button.removeAttribute('title');
    }
  });

  const followButton = panel.querySelector('#urppp-set-follow');
  if (followButton) {
    followButton.disabled = !darkSupported;
    followButton.classList.toggle('ac', followSystem && darkSupported);
    followButton.classList.toggle('urppp-dyn-disabled', !darkSupported);
    followButton.setAttribute('aria-pressed', followSystem && darkSupported ? 'true' : 'false');
    followButton.textContent = followSystem && darkSupported ? '跟随系统：开' : '跟随系统：关';
    followButton.title = darkSupported ? '' : '当前界面风格不支持暗色模式';
  }

  const dynamicFollowButton = panel.querySelector('#urppp-set-follow-dynamic');
  if (dynamicFollowButton) {
    dynamicFollowButton.classList.toggle('ac', followUseDynamic && dynamicSupported);
    dynamicFollowButton.setAttribute('aria-pressed', followUseDynamic && dynamicSupported ? 'true' : 'false');
    dynamicFollowButton.textContent = followUseDynamic ? '浅色用动态配色：开' : '浅色用动态配色：关';
    dynamicFollowButton.disabled = !followSystem || !dynamicSupported;
    dynamicFollowButton.classList.toggle('urppp-dyn-disabled', !dynamicSupported);
    dynamicFollowButton.style.opacity = !dynamicSupported ? '0.5' : (followSystem ? '1' : '0.5');
    dynamicFollowButton.title = dynamicSupported ? '' : '当前界面风格不支持动态配色';
  }

  const dynamicSection = panel.querySelector('#urppp-set-dynamic');
  if (dynamicSection) {
    // 不支持动态配色的主题：整体隐藏动态配色 section（不再划线禁用）
    dynamicSection.style.display = dynamicSupported ? '' : 'none';
    dynamicSection.style.opacity = '1';
    dynamicSection.classList.toggle('urppp-dyn-disabled', false);
    dynamicSection.querySelectorAll('button, input, .urppp-set-scheme, .urppp-set-swatch').forEach((element) => {
      element.disabled = false;
      element.classList.toggle('urppp-dyn-disabled', false);
    });
    dynamicSection.querySelectorAll('h3, .urppp-set-tip, label').forEach((element) => {
      element.classList.toggle('urppp-dyn-disabled', false);
    });
  }

  const brutalSection = panel.querySelector('#urppp-set-brutal');
  if (brutalSection) brutalSection.style.display = fixedPalettes ? '' : 'none';

  const cleanDefaultButton = panel.querySelector('#urppp-set-clean-default');
  if (cleanDefaultButton) {
    cleanDefaultButton.classList.toggle('ac', cleanDefault);
    cleanDefaultButton.setAttribute('aria-pressed', cleanDefault ? 'true' : 'false');
    cleanDefaultButton.textContent = cleanDefault ? '默认进入清爽模式：开' : '默认进入清爽模式：关';
  }

  const cleanAnalysisButton = panel.querySelector('#urppp-set-clean-analysis');
  if (cleanAnalysisButton) {
    const direct = cleanAnalysis === 'direct';
    cleanAnalysisButton.classList.toggle('ac', direct);
    cleanAnalysisButton.setAttribute('aria-pressed', direct ? 'true' : 'false');
    cleanAnalysisButton.textContent = direct ? '清爽成绩分析展示：直接显示' : '清爽成绩分析展示：选项卡';
  }

  const appleEdgeButton = panel.querySelector('#urppp-set-apple-edge');
  const appleEdgeTip = panel.querySelector('#urppp-set-apple-edge-tip');
  if (appleEdgeButton) {
    const appleSkin = skinId === 'apple';
    appleEdgeButton.style.display = appleSkin ? '' : 'none';
    if (appleEdgeTip) appleEdgeTip.style.display = appleSkin ? '' : 'none';
    if (appleSkin) {
      appleEdgeButton.classList.toggle('ac', appleEdge);
      appleEdgeButton.setAttribute('aria-pressed', appleEdge ? 'true' : 'false');
      appleEdgeButton.textContent = appleEdge ? '类Apple边缘线条：开' : '类Apple边缘线条：关';
    }
  }

  const autoUpdateButton = panel.querySelector('#urppp-set-auto-update');
  if (autoUpdateButton) {
    autoUpdateButton.classList.toggle('ac', autoUpdate);
    autoUpdateButton.setAttribute('aria-pressed', autoUpdate ? 'true' : 'false');
    autoUpdateButton.textContent = autoUpdate ? '自动检测更新：开' : '自动检测更新：关';
  }
}
