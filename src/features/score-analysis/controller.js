// 成绩分析模块编排：在成绩查询页顶部插入折叠面板，首次展开时拉取成绩数据并渲染。
// deps 注入：styles（CSS 字符串）、loadScores、loadProfile、analyzeScores、getInsertHost。

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

  async function handleExpand() {
    if (loadState === 'loading' || loadState === 'ready') return;
    const content = contentEl();
    if (!content) return;
    loadState = 'loading';
    content.innerHTML = renderer.loadingHtml();
    try {
      const [scorePack, profile] = await Promise.all([
        deps.loadScores(),
        deps.loadProfile(),
      ]);
      // loadScores 内部吞错后通过 error 字段回传，转成异常以进入错误态（可重试）
      if (scorePack && scorePack.error) throw new Error(scorePack.error);
      const analysis = dataApi.analyzeScores({ scorePack, profile });
      content.innerHTML = renderer.analysisHtml(analysis);
      loadState = 'ready';
    } catch (error) {
      content.innerHTML = renderer.errorHtml(error && error.message || String(error));
      loadState = 'error';
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
    ui.bindPanel(panel, { onExpand: handleExpand, onRetry: handleExpand });
    return panel;
  }

  function unmount() {
    if (panel && panel.isConnected) panel.remove();
    panel = null;
    loadState = 'idle';
  }

  return {
    mount,
    unmount,
    getPanel: () => panel,
    reset: unmount,
  };
}
