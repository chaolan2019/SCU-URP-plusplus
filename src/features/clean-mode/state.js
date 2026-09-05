export function createCleanModeState() {
  return {
    open: false,
    mobileTab: 'home',
    scoreAnalysisTab: 'overview', // tab 模式下成绩分析子页：overview | analysis
    profile: null,
    schedule: null,
    scores: null,
    catalog: null,
    occupancy: null,
    currentBuilding: null,
    loading: { profile: false, schedule: false, scores: false, room: false },
    roomError: '',
    roomDateOffset: 0, // 0今天 1明天 2后天
    selected: { passing: new Set(), scheme: new Set() },
    activeSchemeIdx: 0,
    _schemeUserSelected: false,
    viewWeek: 0, // 0 = 跟随系统当前周
    weekLocked: false, // 用户手动切周后锁定
    _termWeek: 0,
    _termWeekResolved: false,
    uiReady: false,
    _bootRenderSettled: false,
  };
}

export function resetCleanModeData(state) {
  state.profile = null;
  state.schedule = null;
  state.scores = null;
  state.catalog = null;
  state.occupancy = null;
  state._termWeekResolved = false;
  state._schemeUserSelected = false;
  state._schemeInited = false;
}
