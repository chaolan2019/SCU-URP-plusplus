import { resetCleanModeData } from './state.js';

export function createCleanModeDataLoader({ state, deps }) {
  let roomCatalogPromise = null; // 并发共享：进行中的加载 Promise，避免后来者拿到空数组后无人刷新弹窗
  async function ensureRoomCatalogLoaded(force) {
    if (!force && state.catalog && state.catalog.length) return state.catalog;
    if (state.loading.room && roomCatalogPromise) return roomCatalogPromise;
    state.loading.room = true;
    roomCatalogPromise = (async () => {
      try { deps.render(); } catch (_) { /* ignore */ }
      try {
        // 缓存版加载器可能返回归一化包装（__empty/__error），拆包为数组
        const raw = await deps.loadClassroomCatalog();
        const cat = Array.isArray(raw) ? raw : [];
        state.catalog = cat;
        state.roomError = cat.length ? '' : (!Array.isArray(raw) && raw && raw.__error ? raw.__error : '未解析到教学楼，请刷新后重试');
      } catch (error) {
        state.catalog = state.catalog || [];
        state.roomError = String(error && error.message || error);
        console.warn('[URP++] room catalog', error);
      } finally {
        state.loading.room = false;
        roomCatalogPromise = null;
        try { deps.scheduleRender(); } catch (_) { /* ignore */ }
      }
      return state.catalog;
    })();
    return roomCatalogPromise;
  }

  // 数据是否可用（非 error 态且有内容）；error/空态不算已有数据，下次进入仍尝试缓存/重新拉取
  function hasUsableSchedule(s) { return !!(s && !s.error && Array.isArray(s.courses) && s.courses.length); }
  function hasUsableScores(s) {
    if (!s || s.error) return false;
    const pc = s.passing && s.passing[0] && Array.isArray(s.passing[0].courses) ? s.passing[0].courses.length : 0;
    const sc = Array.isArray(s.schemes) && s.schemes.some((x) => Array.isArray(x.courses) && x.courses.length);
    return pc > 0 || sc;
  }

  // 个人资料无严格可用性判定（缓存层以 name 非空为准；缓存命中时 state.profile 直接可用）
  function hasUsableProfile(p) { return !!(p && (p.name || p.avatar || p.majorPlan)); }

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
          if (!hasUsableProfile(state.profile)) state.profile = await deps.loadProfile();
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
          if (!hasUsableSchedule(state.schedule)) state.schedule = await deps.loadSchedule(force);
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
          if (!hasUsableScores(state.scores)) scorePack = state.scores = await deps.loadScores(force);
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
