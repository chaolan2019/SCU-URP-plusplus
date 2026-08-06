import { resetCleanModeData } from './state.js';

export function createCleanModeDataLoader({ state, deps }) {
  async function ensureRoomCatalogLoaded(force) {
    if (!force && state.catalog && state.catalog.length) return state.catalog;
    if (state.loading.room) return state.catalog;
    state.loading.room = true;
    try { deps.render(); } catch (_) { /* ignore */ }
    try {
      state.catalog = await deps.loadClassroomCatalog();
      state.roomError = '';
    } catch (error) {
      state.catalog = state.catalog || [];
      state.roomError = String(error && error.message || error);
      console.warn('[URP++] room catalog', error);
    } finally {
      state.loading.room = false;
      try { deps.scheduleRender(); } catch (_) { /* ignore */ }
    }
    return state.catalog;
  }

  async function loadAll(force) {
    if (force) {
      resetCleanModeData(state);
    }
    state.loading.profile = state.loading.schedule = state.loading.scores = true;
    // 先解析教学周，再画界面，避免小屏首帧落到第1周
    try {
      const termWeek = await deps.ensureTermWeekResolved();
      if (!state.weekLocked && termWeek >= 1) state.viewWeek = termWeek;
    } catch (_) { /* ignore */ }
    deps.render();
    await Promise.all([
      (async () => {
        try {
          if (!(state.profile && !force)) state.profile = await deps.loadProfile();
          deps.reconcileProfileAndScores();
        } catch (error) {
          state.profile = { name: '同学', majorPlan: '主修方案', majorGpa: '—', avatar: '' };
          console.warn(error);
        } finally {
          state.loading.profile = false;
          deps.scheduleRender();
        }
      })(),
      (async () => {
        try {
          if (!(state.schedule && !force)) state.schedule = await deps.loadSchedule();
        } catch (error) {
          state.schedule = { courses: [], error: String(error && error.message || error) };
        } finally {
          state.loading.schedule = false;
          // 课表加载后若周次仍可疑，再纠一次
          if (!state.weekLocked) {
            const termWeek = deps.getCurrentWeekNumber() || deps.readRememberedTermWeek();
            if (termWeek >= 1) state.viewWeek = termWeek;
          }
          deps.scheduleRender();
        }
      })(),
      (async () => {
        let scorePack = null;
        try {
          if (!(state.scores && !force)) state.scores = await deps.loadScores(force);
          scorePack = state.scores;
          deps.reconcileProfileAndScores();
          if (scorePack && !scorePack.error && !scorePack.evaluationReady) {
            deps.enrichScoresWithEvaluation(scorePack).then(() => {
              if (state.scores !== scorePack) return;
              deps.reconcileProfileAndScores();
              deps.scheduleRender();
            }).catch((error) => {
              console.warn('[URP++] attach evaluation', error);
            });
          }
        } catch (error) {
          state.scores = { passing: [], schemes: [], error: String(error && error.message || error) };
        } finally {
          state.loading.scores = false;
          deps.scheduleRender();
        }
      })(),
    ]);
    deps.reconcileProfileAndScores();
    if (!state.weekLocked) {
      const termWeek = deps.getCurrentWeekNumber() || deps.readRememberedTermWeek();
      if (termWeek >= 1) state.viewWeek = termWeek;
    }
    deps.scheduleRender();
  }

  return { ensureRoomCatalogLoaded, loadAll };
}
