// 成绩分析模块编排：在成绩查询页顶部插入折叠面板。
// mount 时后台预热成绩数据，首次展开直接渲染缓存，感知零延迟。

import { createScoreAnalysisData } from './data.js';
import { createScoreAnalysisRenderer } from './render.js';
import { createScoreAnalysisUI } from './ui.js';

const PANEL_ID = 'urppp-score-analysis';

export function createScoreAnalysisController({ deps }) {
  const dataApi = createScoreAnalysisData({ deps });
  const renderer = createScoreAnalysisRenderer({ deps });
  const ui = createScoreAnalysisUI();

  let panel = null;
  let loadState = 'idle'; // idle | loading | ready | error
  let loadPromise = null;
  let cachedAnalysis = null;
  let uiHandle = null;
  let resizeBound = false;

  function ensureStyle() {
    if (!deps.styles) return;
    if (document.getElementById('urppp-score-analysis-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-score-analysis-style';
    style.textContent = deps.styles;
    (document.head || document.documentElement).appendChild(style);
  }

  function findHost() {
    if (typeof deps.getInsertHost === 'function') {
      const host = deps.getInsertHost();
      if (host) return host;
    }
    return document.querySelector('.page-content')
      || document.getElementById('page-content-template')
      || document.body;
  }

  function contentEl() {
    return panel && panel.querySelector('[data-urppp-sa-content]');
  }

  function startLoad() {
    if (loadPromise) return loadPromise;
    loadState = 'loading';
    loadPromise = (async () => {
      try {
        const [scorePack, profile] = await Promise.all([
          deps.loadScores(),
          deps.loadProfile(),
        ]);
        // loadScores 内部吞错后通过 error 字段回传，转成异常以进入错误态（可重试）
        if (scorePack && scorePack.error) throw new Error(scorePack.error);
        const analysis = dataApi.analyzeScores({ scorePack, profile });
        cachedAnalysis = analysis;
        loadState = 'ready';
        return analysis;
      } catch (error) {
        loadState = 'error';
        throw error;
      } finally {
        loadPromise = null;
      }
    })();
    return loadPromise;
  }

  function warmup() {
    // mount 时后台预热，失败保持 error 态，展开时给出重试入口
    if (loadState === 'idle') {
      startLoad().catch(() => { /* 预热失败交给展开路径展示 */ });
    }
  }

  function syncShareLayout() {
    if (uiHandle && typeof uiHandle.syncShareLayout === 'function') {
      try { uiHandle.syncShareLayout(); } catch (_) { /* ignore */ }
    }
  }

  function bindResize() {
    if (resizeBound) return;
    resizeBound = true;
    window.addEventListener('resize', syncShareLayout);
  }

  function unbindResize() {
    if (!resizeBound) return;
    resizeBound = false;
    window.removeEventListener('resize', syncShareLayout);
  }

  async function handleExpand() {
    const content = contentEl();
    if (!content) return;
    if (loadState === 'ready' && cachedAnalysis) {
      content.innerHTML = renderer.analysisHtml(cachedAnalysis);
      syncShareLayout();
      return;
    }
    content.innerHTML = renderer.loadingHtml();
    try {
      const analysis = await startLoad();
      content.innerHTML = renderer.analysisHtml(analysis);
      syncShareLayout();
    } catch (error) {
      content.innerHTML = renderer.errorHtml(error && error.message || String(error));
    }
  }

  function mount() {
    ensureStyle();
    if (panel && panel.isConnected) return panel;
    if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
    const host = findHost();
    if (!host) return null;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderer.panelShellHtml();
    panel = wrapper.firstElementChild;
    host.insertBefore(panel, host.firstChild);
    uiHandle = ui.bindPanel(panel, { onExpand: handleExpand, onRetry: handleExpand });
    bindResize();
    warmup();
    // 从清爽模式「详细分析」跳转而来：自动展开成绩分析面板
    if (deps.shouldAutoExpand && deps.shouldAutoExpand()) {
      const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 0);
      raf(() => {
        try { uiHandle.setExpanded(true); } catch (_) { /* ignore */ }
      });
    }
    return panel;
  }

  function unmount() {
    unbindResize();
    if (panel && panel.isConnected) panel.remove();
    panel = null;
    uiHandle = null;
    loadState = 'idle';
    loadPromise = null;
    cachedAnalysis = null;
  }

  return {
    mount,
    unmount,
    getPanel: () => panel,
    reset: unmount,
  };
}
