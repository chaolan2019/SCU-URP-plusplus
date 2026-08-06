// 成绩分析面板交互：折叠/展开、重试事件转发。
// 数据加载由 controller 编排，本模块只负责 DOM 事件与状态切换。

export function createScoreAnalysisUI() {
  function bindPanel(panel, handlers) {
    const toggle = panel.querySelector('.urppp-sa-toggle');
    const body = panel.querySelector('[data-urppp-sa-body]');
    if (!toggle || !body) return { isExpanded: () => false, setExpanded: () => {} };

    const setExpanded = (expanded) => {
      const state = expanded ? 'expanded' : 'collapsed';
      panel.dataset.urpppSaState = state;
      toggle.setAttribute('aria-expanded', String(expanded));
      body.hidden = !expanded;
      if (expanded && typeof handlers.onExpand === 'function') handlers.onExpand();
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    // 内容区每次重填都会重建按钮，用委托绑定重试
    body.addEventListener('click', (event) => {
      const target = event.target;
      const retry = target && target.closest ? target.closest('[data-urppp-sa-retry]') : null;
      if (retry && typeof handlers.onRetry === 'function') handlers.onRetry();
    });

    return {
      setExpanded,
      isExpanded: () => toggle.getAttribute('aria-expanded') === 'true',
    };
  }

  return { bindPanel };
}
